import { READING_ENGINE_PLAYTEST as passage, READING_ENGINE_PLAYTEST_TEXT as referenceText } from "./content/reading-engine-playtest.js";
import { advanceEvidenceCursor, alignTranscript, hasEndEvidence, tokenizeText } from "./reading-engine.js";
import {
  describeReadingCoverage,
  describeReadingPace,
  evaluateFinishedAttempt,
  shouldAutoFinishAttempt,
} from "./reading-attempt-evaluation.js";
import { LocalAudioCapture } from "./speech/audio-capture.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";
import { loadPinnedSherpaRuntime } from "./speech/sherpa-runtime-loader.js";
import { createSherpaStreamingRecognizer } from "./speech/sherpa-streaming-recognizer.js";
import {
  deleteLatestDiagnosticRun,
  encodePcmWav,
  loadLatestDiagnosticRun,
  saveLatestDiagnosticRun,
} from "./reading-playtest-diagnostics-store.js";

const $ = (id) => document.getElementById(id);
const AUTO_FINISH_SILENCE_MS = 5_000;
const PLAYTEST_RESULT_KEY = "finn-reading-engine-playtest-result-v1";
const tokens = tokenizeText(referenceText);
const lineEnds = [];
let tokenTotal = 0;
for (const line of passage.lines) {
  tokenTotal += tokenizeText(line).length;
  lineEnds.push(tokenTotal);
}

let capture = new LocalAudioCapture();
let whisper = createWhisper();
let sherpa = null;
let preparedMode = null;
let activeMode = null;
let cursor = 0;
let listening = false;
let busy = false;
let checkpointTimer = null;
let pcmUnsubscribe = null;
let sherpaUnsubscribe = null;
let attemptStartedAt = 0;
let autoFinishMonitor = null;
let autoFinishArmedAt = 0;
let endEvidenceObserved = false;
const diagnostics = [];
const retainedTranscriptTrace = [];
let savedRecordingUrl = null;
let latestResultSummary = null;
const challengingWordAudio = new Audio();

function resetLearningReview() {
  for (const button of $("comprehensionChoices").querySelectorAll("button")) {
    button.disabled = false;
    button.classList.remove("selected", "correct", "incorrect");
    button.setAttribute("aria-pressed", "false");
  }
  $("comprehensionFeedback").textContent = "Choose the answer that fits best. This does not change whether your reading counts.";
  $("wordAudioStatus").textContent = "";
  $("done").disabled = false;
}

function chooseComprehensionAnswer(choice, button) {
  for (const answerButton of $("comprehensionChoices").querySelectorAll("button")) {
    answerButton.classList.remove("selected", "correct", "incorrect");
    answerButton.setAttribute("aria-pressed", "false");
  }
  button.classList.add("selected", choice.correct ? "correct" : "incorrect");
  button.setAttribute("aria-pressed", "true");
  if (choice.correct) {
    for (const answerButton of $("comprehensionChoices").querySelectorAll("button")) {
      answerButton.disabled = true;
    }
  }
  $("comprehensionFeedback").textContent = choice.correct
    ? passage.comprehension.correctFeedback
    : passage.comprehension.tryAgainFeedback;
  diagnostics.push({
    atMs: Math.round(performance.now() - attemptStartedAt),
    choiceId: choice.id,
    correct: choice.correct,
    source: "comprehension",
  });
  if (latestResultSummary) {
    latestResultSummary = {
      ...latestResultSummary,
      comprehensionChoiceId: choice.id,
      comprehensionCorrect: choice.correct,
    };
    $("diagnostics").textContent = JSON.stringify(latestResultSummary, null, 2);
    saveResult(latestResultSummary);
  }
}

async function speakChallengingWord(entry, button) {
  challengingWordAudio.pause();
  challengingWordAudio.currentTime = 0;
  challengingWordAudio.src = entry.audioSrc;
  challengingWordAudio.onplay = () => {
    button.classList.add("speaking");
    $("wordAudioStatus").textContent = `Playing “${entry.word}” and its example with Kokoro Heart.`;
  };
  challengingWordAudio.onended = () => {
    button.classList.remove("speaking");
    $("wordAudioStatus").textContent = `Played “${entry.word}” and its example. Choose the card to repeat.`;
  };
  challengingWordAudio.onerror = () => {
    button.classList.remove("speaking");
    $("wordAudioStatus").textContent = `The Kokoro Heart recording for “${entry.word}” could not play.`;
  };
  try {
    await challengingWordAudio.play();
  } catch {
    button.classList.remove("speaking");
    $("wordAudioStatus").textContent = `Choose “${entry.word}” again if audio playback was blocked.`;
  }
}

function renderLearningReview() {
  $("comprehensionHeading").textContent = passage.comprehension.question;
  for (const choice of passage.comprehension.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-choice";
    button.textContent = choice.text;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => chooseComprehensionAnswer(choice, button));
    $("comprehensionChoices").append(button);
  }
  for (const entry of passage.challengingWords) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "word-card";
    const copy = document.createElement("div");
    const word = document.createElement("strong");
    word.textContent = entry.word;
    const meaning = document.createElement("span");
    meaning.textContent = entry.meaning;
    copy.append(word, meaning);
    card.setAttribute("aria-label", `Hear ${entry.word} and an example sentence`);
    card.addEventListener("click", () => speakChallengingWord(entry, card));
    card.append(copy);
    $("challengingWords").append(card);
  }
}

function readSavedResult() {
  try {
    return JSON.parse(localStorage.getItem(PLAYTEST_RESULT_KEY));
  } catch {
    return null;
  }
}

function showSavedResult(summary) {
  if (!summary || typeof summary !== "object") return;
  $("previousResult").hidden = false;
  $("previousDiagnostics").textContent = JSON.stringify(summary, null, 2);
}

function saveResult(summary) {
  try {
    localStorage.setItem(PLAYTEST_RESULT_KEY, JSON.stringify(summary));
    showSavedResult(summary);
    return true;
  } catch {
    return false;
  }
}

function clearSavedRecordingView() {
  if (savedRecordingUrl) URL.revokeObjectURL(savedRecordingUrl);
  savedRecordingUrl = null;
  $("savedRecording").removeAttribute("src");
  $("savedRecording").load();
  $("savedTranscript").textContent = "";
  $("savedTranscriptTrace").textContent = "";
  $("savedDiagnostic").hidden = true;
}

function showSavedDiagnostic(record) {
  if (!record || typeof record !== "object") return;
  clearSavedRecordingView();
  const audio = record.audio instanceof Float32Array ? record.audio : new Float32Array(record.audio ?? []);
  savedRecordingUrl = URL.createObjectURL(encodePcmWav(audio, record.sampleRate));
  $("savedRecording").src = savedRecordingUrl;
  $("savedRecordingDownload").href = savedRecordingUrl;
  $("savedTranscript").textContent = record.transcript || "No final transcript was returned.";
  $("savedTranscriptTrace").textContent = record.transcriptTrace?.length
    ? JSON.stringify(record.transcriptTrace, null, 2)
    : "No retained live transcript trace is available for this run.";
  $("savedDiagnostic").hidden = false;
}

async function restoreSavedDiagnostic() {
  try {
    showSavedDiagnostic(await loadLatestDiagnosticRun());
  } catch {
    // Troubleshooting retention is optional and must never block reading.
  }
}

function createWhisper() {
  return new LocalWhisperRecognizer({
    onProgress(data = {}) {
      if (data.status !== "progress") return;
      const percent = Number.isFinite(data.progress) ? Math.round(data.progress) : null;
      setModelProgress(percent ?? 0, `Preparing Whisper final check${percent == null ? "" : ` · ${percent}%`}`);
    },
  });
}

function setModelProgress(value, text) {
  const progress = Math.max(0, Math.min(100, Number(value) || 0));
  $("modelProgress").value = progress;
  $("modelProgress").textContent = `${progress}%`;
  $("modelProgressText").textContent = text;
}

function selectedMode() {
  return $("guideMode").value;
}

function activeLineIndex() {
  const index = lineEnds.findIndex((end) => cursor < end);
  return index < 0 ? passage.lines.length - 1 : index;
}

function renderGuide() {
  const activeLine = activeLineIndex();
  const paragraphs = [...$("passage").children];
  paragraphs.forEach((paragraph, index) => {
    paragraph.classList.toggle("past", index < activeLine);
    paragraph.classList.toggle("active", index >= activeLine && index <= activeLine + 1);
    if (index === activeLine) paragraph.setAttribute("aria-current", "true");
    else paragraph.removeAttribute("aria-current");
  });
  const target = paragraphs[activeLine]
    ? Math.max(0, paragraphs[activeLine].offsetTop - ($("passage").clientHeight / 3))
    : 0;
  $("passage").scrollTop = target;
  const percent = Math.round((cursor / tokens.length) * 100);
  $("progressFill").style.width = `${percent}%`;
  $("readingProgress").setAttribute("aria-valuenow", String(percent));
}

function resetAttempt() {
  clearInterval(autoFinishMonitor);
  autoFinishMonitor = null;
  cursor = 0;
  autoFinishArmedAt = 0;
  endEvidenceObserved = false;
  diagnostics.length = 0;
  retainedTranscriptTrace.length = 0;
  latestResultSummary = null;
  if ("speechSynthesis" in globalThis) speechSynthesis.cancel();
  resetLearningReview();
  $("result").hidden = true;
  $("restart").disabled = true;
  $("start").disabled = preparedMode !== selectedMode();
  $("finish").disabled = true;
  $("guideMode").disabled = false;
  $("status").textContent = preparedMode === selectedMode()
    ? "Ready. Start when you are comfortable."
    : "Prepare the selected local models before starting.";
  renderGuide();
}

function applyTranscript(transcript, { final = false, source = "unknown" } = {}) {
  const observedAt = performance.now();
  const alignment = alignTranscript(referenceText, transcript, {
    lookAhead: 50,
    startIndex: final || source === "sherpa-live" ? 0 : Math.max(0, cursor - 12),
  });
  const nextCursor = advanceEvidenceCursor({
    currentTokenIndex: final ? 0 : cursor,
    matchedTokenIndexes: alignment.matchedTokenIndexes,
    maximumAdvance: final ? tokens.length : 12,
    totalCount: tokens.length,
  });
  cursor = Math.max(cursor, nextCursor);
  if (!final && !endEvidenceObserved && cursor / tokens.length >= 0.9
    && hasEndEvidence(alignment.matchedTokenIndexes, tokens.length)) {
    endEvidenceObserved = true;
    autoFinishArmedAt = observedAt;
  }
  const atMs = Math.round(observedAt - attemptStartedAt);
  diagnostics.push({ atMs, cursor, source });
  retainedTranscriptTrace.push({ atMs, cursor, source, text: String(transcript) });
  renderGuide();
  return alignment;
}

function monitorAutoFinish() {
  if (!listening) return;
  const now = performance.now();
  const millisecondsSinceEndEvidence = autoFinishArmedAt ? Math.max(0, now - autoFinishArmedAt) : 0;
  const positionProgress = tokens.length ? cursor / tokens.length : 0;
  if (endEvidenceObserved && positionProgress >= 0.9 && millisecondsSinceEndEvidence < AUTO_FINISH_SILENCE_MS) {
    const seconds = Math.max(1, Math.ceil((AUTO_FINISH_SILENCE_MS - millisecondsSinceEndEvidence) / 1_000));
    $("status").textContent = `End detected. Finishing automatically in ${seconds} second${seconds === 1 ? "" : "s"}, or choose Finish now.`;
  }
  if (!shouldAutoFinishAttempt({
    endEvidence: endEvidenceObserved,
    listening,
    millisecondsSinceSpeech: millisecondsSinceEndEvidence,
    positionProgress,
    silenceThresholdMs: AUTO_FINISH_SILENCE_MS,
  })) return;
  diagnostics.push({ atMs: Math.round(now - attemptStartedAt), source: "auto-finish" });
  void finishReading({ automatic: true });
}

async function checkpoint() {
  if (!listening || busy || capture.durationMs < 3_500) return;
  busy = true;
  try {
    const audio = await capture.snapshot({ overlapMs: 1_800 });
    const transcript = await whisper.transcribe(audio);
    if (transcript && listening) applyTranscript(transcript, { source: "whisper-checkpoint" });
  } catch (error) {
    diagnostics.push({ atMs: Math.round(performance.now() - attemptStartedAt), error: error.message, source: "whisper-checkpoint" });
    if (listening) $("status").textContent = "The live guide paused, but Finish now still works.";
  } finally {
    busy = false;
  }
}

function startWhisperCheckpointFallback(message) {
  activeMode = "whisper";
  clearInterval(checkpointTimer);
  checkpointTimer = setInterval(checkpoint, 6_000);
  if (message) $("status").textContent = message;
}

async function disableSherpa(error) {
  if (activeMode !== "hybrid") return;
  diagnostics.push({ atMs: Math.round(performance.now() - attemptStartedAt), error: error.message, source: "sherpa-live" });
  pcmUnsubscribe?.();
  pcmUnsubscribe = null;
  sherpaUnsubscribe?.();
  sherpaUnsubscribe = null;
  await sherpa?.stop().catch(() => {});
  startWhisperCheckpointFallback("The instant guide paused; the local finish check is still listening.");
}

async function prepareSelectedMode() {
  const mode = selectedMode();
  $("prepare").disabled = true;
  $("start").disabled = true;
  $("guideMode").disabled = true;
  try {
    if (!whisper.ready) {
      setModelProgress(1, "Preparing Whisper final check…");
      await whisper.load("wasm");
    }
    if (mode === "hybrid") {
      if (globalThis.crossOriginIsolated !== true || typeof globalThis.SharedArrayBuffer !== "function") {
        throw new Error("The Sherpa live guide needs the isolated playtest server. Choose Whisper-only on this origin.");
      }
      setModelProgress(45, "Preparing Sherpa live guide…");
      await loadPinnedSherpaRuntime({
        runtime: globalThis,
        onDataProgress({ loaded, source, total }) {
          const ratio = total > 0 ? loaded / total : 0;
          const value = source === "opfs" ? 70 : 45 + Math.round(ratio * 45);
          setModelProgress(value, source === "opfs" ? "Loading saved Sherpa live guide…" : `Saving Sherpa live guide · ${Math.round(ratio * 100)}%`);
        },
      });
      sherpa ??= createSherpaStreamingRecognizer({ runtime: globalThis });
      const { warmupMs } = sherpa.prepare();
      diagnostics.push({ source: "sherpa-prepare", warmupMs });
    }
    preparedMode = mode;
    setModelProgress(100, mode === "hybrid" ? "Sherpa guide and Whisper finish ready" : "Whisper checkpoints and finish ready");
    $("status").textContent = "Ready. Start when you are comfortable.";
    $("start").disabled = false;
  } catch (error) {
    $("status").textContent = error.message;
    setModelProgress(0, "Preparation incomplete");
    preparedMode = null;
  } finally {
    $("prepare").disabled = false;
    $("guideMode").disabled = false;
  }
}

async function startReading() {
  resetAttempt();
  activeMode = selectedMode();
  $("start").disabled = true;
  $("guideMode").disabled = true;
  $("status").textContent = "Requesting microphone access…";
  try {
    if (activeMode === "hybrid") {
      await sherpa.start();
      sherpaUnsubscribe = sherpa.subscribe(({ text }) => {
        try {
          applyTranscript(text, { source: "sherpa-live" });
        } catch (error) {
          void disableSherpa(error);
        }
      });
      pcmUnsubscribe = capture.subscribePcm((samples, sampleRate) => {
        try {
          sherpa.acceptAudio(samples, sampleRate);
        } catch (error) {
          void disableSherpa(error);
        }
      });
    }
    await capture.start();
    attemptStartedAt = performance.now();
    listening = true;
    $("finish").disabled = false;
    $("restart").disabled = false;
    $("status").textContent = "Listening. Read naturally, then choose Finish now.";
    autoFinishMonitor = setInterval(monitorAutoFinish, 100);
    if (activeMode === "whisper") startWhisperCheckpointFallback();
  } catch (error) {
    pcmUnsubscribe?.();
    sherpaUnsubscribe?.();
    await sherpa?.stop().catch(() => {});
    await capture.cleanup().catch(() => {});
    $("status").textContent = `Microphone unavailable: ${error.message}`;
    $("start").disabled = false;
    $("guideMode").disabled = false;
  }
}

async function waitForCheckpoint() {
  const deadline = performance.now() + 31_000;
  while (busy && performance.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 50));
  if (!busy) return;
  whisper.close();
  whisper = createWhisper();
  busy = false;
  throw new Error("The checkpoint timed out.");
}

async function finishReading({ automatic = false, restarted = false } = {}) {
  if (!listening) return;
  listening = false;
  clearInterval(autoFinishMonitor);
  autoFinishMonitor = null;
  clearInterval(checkpointTimer);
  checkpointTimer = null;
  $("finish").disabled = true;
  $("restart").disabled = true;
  $("status").textContent = restarted
    ? "Restarting from the beginning…"
    : automatic
      ? "End detected. Your reading is captured and finishing locally…"
      : "Your reading is captured. Finishing locally…";
  let modelFailed = false;
  let transcript = "";
  let alignment = alignTranscript(referenceText, "");
  let durationMs = Math.max(0, Math.round(performance.now() - attemptStartedAt));
  try {
    await waitForCheckpoint();
  } catch (error) {
    modelFailed = true;
    diagnostics.push({ error: error.message, source: "checkpoint-finalize" });
  }
  pcmUnsubscribe?.();
  pcmUnsubscribe = null;
  sherpaUnsubscribe?.();
  sherpaUnsubscribe = null;
  await sherpa?.stop().catch((error) => diagnostics.push({ error: error.message, source: "sherpa-stop" }));
  let audio = new Float32Array();
  let diagnosticAudio = null;
  try {
    const stopped = await capture.stop();
    audio = stopped.audio;
    durationMs = stopped.durationMs;
    if ($("preserveDiagnostic").checked) diagnosticAudio = audio.slice();
  } catch (error) {
    modelFailed = true;
    diagnostics.push({ error: error.message, source: "capture-stop" });
    await capture.cleanup().catch(() => {});
  }
  if (restarted) {
    resetAttempt();
    return;
  }
  if (!modelFailed && whisper.ready) {
    try {
      transcript = await whisper.transcribe(audio);
      alignment = applyTranscript(transcript, { final: true, source: "whisper-final" });
    } catch (error) {
      modelFailed = true;
      diagnostics.push({ error: error.message, source: "whisper-final" });
    }
  } else {
    modelFailed = true;
  }
  const outcome = evaluateFinishedAttempt({
    captureStarted: true,
    finishRequested: true,
    matchedWords: alignment.matchedCount,
    matchedTokenIndexes: alignment.matchedTokenIndexes,
    modelFailed,
    positionProgress: alignment.positionProgress,
    spokenWords: alignment.spokenWordCount,
    totalWords: tokens.length,
    transcript,
    unalignedWords: alignment.unalignedWords,
  });
  const readingDurationMs = Math.max(2_000, Math.round(
    (autoFinishArmedAt || (attemptStartedAt + durationMs)) - attemptStartedAt,
  ));
  const coveragePresentation = describeReadingCoverage(outcome.evidence?.coverage ?? 0);
  const pacePresentation = describeReadingPace({ matchedWords: alignment.matchedCount, readingDurationMs });
  $("resultTitle").textContent = outcome.confidenceBand.label;
  $("resultDetail").textContent = outcome.confidenceBand.id === "strong"
    ? "Nice work — the local voice check followed your reading."
    : outcome.confidenceBand.id === "directional"
      ? "Good reading effort. You can move forward whenever you’re ready."
      : "Your attempt counts. The computer could not confidently verify the voice check.";
  $("coverageBand").textContent = coveragePresentation.band;
  $("coverageDetail").textContent = coveragePresentation.detail;
  $("paceBand").textContent = pacePresentation.band;
  $("paceDetail").textContent = pacePresentation.detail;
  const resultSummary = {
    automaticFinish: automatic,
    completedAt: new Date().toISOString(),
    durationMs,
    guideMode: activeMode,
    matchedWords: alignment.matchedCount,
    modelFailed,
    playerFacingCoverageBand: coveragePresentation.band,
    playerFacingPaceBand: pacePresentation.band,
    readingDurationMs,
    totalWords: tokens.length,
    trace: diagnostics,
    wpmEstimate: pacePresentation.wpm,
  };
  latestResultSummary = resultSummary;
  $("diagnostics").textContent = JSON.stringify(resultSummary, null, 2);
  const resultSaved = saveResult(resultSummary);
  let diagnosticSaved = false;
  if (diagnosticAudio) {
    try {
      const saved = await saveLatestDiagnosticRun({
        audio: diagnosticAudio,
        summary: resultSummary,
        transcript,
        transcriptTrace: retainedTranscriptTrace,
      });
      showSavedDiagnostic(saved);
      diagnosticSaved = true;
    } catch (error) {
      diagnostics.push({ error: error.message, source: "diagnostic-save" });
    }
  }
  $("result").hidden = false;
  $("restart").disabled = false;
  $("start").disabled = preparedMode !== selectedMode();
  $("guideMode").disabled = false;
  $("status").textContent = diagnosticSaved
    ? "Attempt complete. The latest recording and transcript were saved locally for troubleshooting."
    : resultSaved
      ? "Attempt complete. Transcript-free diagnostics were saved on this device; restarting is optional."
      : "Attempt complete. Restarting is optional.";
  $("result").focus({ preventScroll: false });
}

$("passageTitle").textContent = passage.title;
$("wordCount").textContent = `${tokens.length} words`;
for (const [index, line] of passage.lines.entries()) {
  const paragraph = document.createElement("p");
  paragraph.textContent = line;
  paragraph.dataset.line = String(index);
  $("passage").append(paragraph);
}
renderLearningReview();
const requestedMode = new URLSearchParams(location.search).get("mode");
$("guideMode").value = requestedMode === "whisper" || globalThis.crossOriginIsolated !== true ? "whisper" : "hybrid";
$("prepare").textContent = selectedMode() === "hybrid" ? "Prepare both models" : "Prepare Whisper";
$("guideMode").addEventListener("change", () => {
  $("prepare").textContent = selectedMode() === "hybrid" ? "Prepare both models" : "Prepare Whisper";
  resetAttempt();
});
$("prepare").addEventListener("click", prepareSelectedMode);
$("start").addEventListener("click", startReading);
$("finish").addEventListener("click", () => finishReading());
$("restart").addEventListener("click", () => (listening ? finishReading({ restarted: true }) : resetAttempt()));
$("done").addEventListener("click", () => {
  $("status").textContent = $("preserveDiagnostic").checked
    ? "Playtest complete. The latest troubleshooting run remains saved locally."
    : "Playtest complete. Recording retention was off for this run.";
  $("done").disabled = true;
});
$("deleteSavedDiagnostic").addEventListener("click", async () => {
  try {
    await deleteLatestDiagnosticRun();
    clearSavedRecordingView();
    $("status").textContent = "The saved troubleshooting recording and transcript were deleted.";
  } catch (error) {
    $("status").textContent = `Could not delete the saved diagnostic: ${error.message}`;
  }
});
window.addEventListener("pagehide", () => {
  clearInterval(checkpointTimer);
  clearInterval(autoFinishMonitor);
  pcmUnsubscribe?.();
  sherpaUnsubscribe?.();
  capture.cleanup();
  sherpa?.close();
  whisper.close();
  if ("speechSynthesis" in globalThis) speechSynthesis.cancel();
  if (savedRecordingUrl) URL.revokeObjectURL(savedRecordingUrl);
});
showSavedResult(readSavedResult());
void restoreSavedDiagnostic();
renderGuide();
