import { PHOTOSYNTHESIS_PASSAGE } from "./content/wikiwhy/photosynthesis-passage.js";
import { hydrateInternetRecoveryCopy, INTERNET_RECOVERY_COPY } from "./apps/internet-recovery/copy.js";
import { alignTranscript, estimateReadingPace, hasEndEvidence, summarizeTokenMatches, tokenizeText } from "./reading-engine.js";
import { approachScrollTop, centeredGuideScrollTop, estimateGuideWordIndex } from "./reading-guide.js";
import { LocalAudioCapture } from "./speech/audio-capture.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";
import { saveSessionSummary, updateSessionComprehension } from "./reading-session-store.js";
import { readWikiWhyState, recordWikiWhyRepair } from "./apps/internet-recovery/wikiwhy-state.js";
import { calculateWikiWhyRepair } from "./apps/internet-recovery/wikiwhy-rules.js";

const PARAGRAPHS = PHOTOSYNTHESIS_PASSAGE.paragraphs;
const PASSAGE = PARAGRAPHS.join(" ");
const PROFILE = PHOTOSYNTHESIS_PASSAGE.profile;
const MODEL_ID = "onnx-community/whisper-base_timestamped";
const SPEECH_LEVEL = 0.009;
const TECHNO_PROGRESS_LOOP_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-progress-push-loop.webp", import.meta.url).href;
const TECHNO_PROGRESS_STILL_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-progress-push-still.webp", import.meta.url).href;
const $ = (id) => document.getElementById(id);
const capture = new LocalAudioCapture();
const requestedDevice = new URLSearchParams(location.search).get("speechDevice");
const uiPreview = new URLSearchParams(location.search).get("uiPreview");

function availableLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function createSessionId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `reading-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const localStateStorage = availableLocalStorage();

const state = {
  busy: false, confirmedMatches: new Set(), confirmedProgress: 0, confirmedTokenIndex: 0,
  diagnostics: [], finalText: "", finishing: false, lastCheckpointAt: 0, lastSpeechAt: 0,
  guidePausedUntil: 0, guideProgress: 0, guideSpeechMs: 0,
  guideWpm: PROFILE.guide.defaultWpm, lastMonitorAt: 0,
  listening: false, modelDevice: null, monitor: null, transcriptDiagnostics: [],
  comprehension: "not-attempted", processedThroughMs: 0, repairPercent: 0, result: null,
  sessionId: null, startedAt: 0, technoTimer: null,
};

const recognizer = new LocalWhisperRecognizer({ onProgress(data = {}) {
  const value = Number.isFinite(data.progress) ? ` ${Math.round(data.progress)}%` : "";
  $("modelProgress").textContent = data.message || `Preparing local model${value}`;
} });

function diagnostic(type, details = {}) {
  state.diagnostics.push({ at: new Date().toISOString(), type, ...details });
  if (state.diagnostics.length > 60) state.diagnostics.shift();
}

function hydratePassage() {
  const wordCount = tokenizeText(PASSAGE).length;
  $("fileTitle").textContent = PHOTOSYNTHESIS_PASSAGE.title;
  $("fileMeta").textContent = `${wordCount} words · science · grades 10–12`;
  $("fileSource").textContent = PHOTOSYNTHESIS_PASSAGE.source.attribution;
  $("passageTitle").textContent = PHOTOSYNTHESIS_PASSAGE.title;
  $("quizQuestion").textContent = PHOTOSYNTHESIS_PASSAGE.comprehension.prompt;
  document.querySelectorAll(".quiz button[data-choice]").forEach((button) => {
    const choice = PHOTOSYNTHESIS_PASSAGE.comprehension.choices[Number(button.dataset.choice)];
    button.textContent = choice.text;
    button.dataset.answer = choice.correct ? "1" : "0";
  });
}

function show(name) {
  for (const id of ["setup", "read", "review"]) $(id).classList.toggle("on", id === name);
}

function renderSavedRepair(savedState) {
  if (savedState.repairCount < 1) return;
  $("recoveredFilesShortcut").disabled = false;
  $("recoveredFilesCount").textContent = `${savedState.repairCount} repair${savedState.repairCount === 1 ? "" : "s"} saved`;
  $("savedRepairReceipt").hidden = false;
  $("savedStability").textContent = `${savedState.stability}%`;
  $("savedRepairCount").textContent = `${savedState.repairCount} saved repair${savedState.repairCount === 1 ? "" : "s"}`;
  $("savedReaction").textContent = savedState.lastReaction || "That held.";
  $("savedRepairStatus").hidden = false;
  $("savedRepairStatus").textContent = `WikiWhy is ${savedState.stability}% stable on this device. Audio and transcript text were not saved.`;
}

function renderRepairOutcome(repairState, persisted) {
  const previousStability = Math.max(0, repairState.stability - repairState.lastAdvance);
  $("repairOutcome").hidden = false;
  $("stabilityBefore").textContent = `${previousStability}%`;
  $("stabilityAfter").textContent = `${repairState.stability}%`;
  $("stabilityGain").textContent = `+${repairState.lastAdvance}%`;
  $("stabilityFill").style.width = `${repairState.stability}%`;
  $("stabilityMeter").setAttribute("aria-valuenow", String(repairState.stability));
  $("repairReaction").textContent = repairState.lastReaction;
  $("repairPersistence").textContent = persisted
    ? "Reading saved · evidence saved · available after reload"
    : "Repair applied for this tab. This browser did not save it for reload.";
}

function animateTechnoProgress() {
  const image = $("technoRepairSpriteImage");
  clearTimeout(state.technoTimer);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    image.src = TECHNO_PROGRESS_STILL_URL;
    return;
  }
  image.src = TECHNO_PROGRESS_STILL_URL;
  requestAnimationFrame(() => { image.src = TECHNO_PROGRESS_LOOP_URL; });
  state.technoTimer = setTimeout(() => { image.src = TECHNO_PROGRESS_STILL_URL; }, 2_050);
}

function renderPassage(progress = state.confirmedProgress) {
  const passage = $("passage");
  const previousScrollTop = passage.scrollTop;
  const allTokens = tokenizeText(PASSAGE);
  const confirmed = Math.round(progress * allTokens.length);
  let cursor = 0;
  passage.innerHTML = PARAGRAPHS.map((paragraph, paragraphIndex) => {
    const words = paragraph.split(/([\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*)/gu).map((part) => {
      if (!/^[\p{L}\p{N}]/u.test(part)) return part;
      const className = cursor < confirmed ? "confirmed" : "";
      cursor += 1;
      return `<span class="word ${className}">${part}</span>`;
    }).join("");
    const paragraphStart = cursor - tokenizeText(paragraph).length;
    const active = confirmed >= paragraphStart && confirmed < cursor;
    return `<p class="reading-paragraph ${active ? "active" : ""}" data-paragraph="${paragraphIndex}">${words}</p>`;
  }).join("");
  passage.scrollTop = previousScrollTop;
}

function updateReadingGuide() {
  const totalWords = tokenizeText(PASSAGE).length;
  const wordIndex = estimateGuideWordIndex({
    activeSpeechMs: state.guideSpeechMs,
    totalWords,
    wordsPerMinute: state.guideWpm,
  });
  state.guideProgress = Math.max(state.guideProgress, (wordIndex + 1) / totalWords);
  if (performance.now() < state.guidePausedUntil) return;
  const passage = $("passage");
  const firstSegmentWords = tokenizeText(PARAGRAPHS[0]).length;
  if (wordIndex >= firstSegmentWords) {
    const word = passage.querySelectorAll(".word")[wordIndex];
    if (word) {
      const target = centeredGuideScrollTop({
        maximumScrollTop: passage.scrollHeight - passage.clientHeight,
        viewportHeight: passage.clientHeight,
        wordHeight: word.offsetHeight,
        wordOffsetTop: word.offsetTop,
      });
      passage.scrollTop = approachScrollTop(passage.scrollTop, target);
    }
  }
  $("guideStatus").textContent = `Reading guide: ${state.guideWpm} WPM · ${Math.round(state.guideProgress * 100)}%`;
}

function updateProgress(alignment, latencyMs = null) {
  alignment.matchedTokenIndexes.forEach((index) => state.confirmedMatches.add(index));
  state.confirmedProgress = Math.max(state.confirmedProgress, alignment.positionProgress);
  state.confirmedTokenIndex = Math.max(state.confirmedTokenIndex, alignment.furthestMatchedTokenIndex + 1);
  const percent = Math.round(state.confirmedProgress * 100);
  const previousPercent = state.repairPercent;
  state.repairPercent = Math.max(state.repairPercent, percent);
  $("repairFill").style.width = `${percent}%`;
  $("repairEdge").style.left = `${percent}%`;
  $("technoRepairSprite").style.left = `clamp(82px, ${percent}%, calc(100% - 84px))`;
  if (percent > previousPercent) animateTechnoProgress();
  $("repairPercent").textContent = `${percent}% repaired`;
  $("siteStatus").textContent = percent >= 100 ? "STATUS: REPAIR COMPLETE" : percent > 0 ? `STATUS: RECOVERING · ${percent}%` : "STATUS: CORRUPTED";
  $("siteStatus").classList.toggle("complete", percent >= 100);
  $("siteStatus").style.color = percent >= 100 ? "#246b3c" : "#a6231d";
  $("progressText").textContent = `${percent}% confirmed by local transcript`;
  $("latency").textContent = latencyMs == null ? "Waiting for first checkpoint" : `Last checkpoint: ${(latencyMs / 1000).toFixed(1)}s`;
  renderPassage();
}

async function checkpoint(reason) {
  if (!state.listening || state.busy || capture.durationMs < PROFILE.checkpoint.minimumWindowMs) return;
  state.busy = true;
  state.lastCheckpointAt = performance.now();
  $("readerState").textContent = "Checking progress locally…";
  const requestedAt = performance.now();
  try {
    const capturedThroughMs = capture.durationMs;
    const windowStartMs = Math.max(0, state.processedThroughMs - PROFILE.checkpoint.audioOverlapMs);
    const audio = await capture.snapshot({ overlapMs: PROFILE.checkpoint.audioOverlapMs });
    const text = await recognizer.transcribe(audio);
    state.processedThroughMs = capturedThroughMs;
    if (!text || !state.listening) return;
    state.transcriptDiagnostics.push({ reason, text });
    state.finalText = text;
    const startIndex = Math.max(0, state.confirmedTokenIndex - PROFILE.checkpoint.tokenOverlap);
    const alignment = alignTranscript(PASSAGE, text, { lookAhead: 24, startIndex });
    const latencyMs = Math.round(performance.now() - requestedAt);
    updateProgress(alignment, latencyMs);
    diagnostic("checkpoint", {
      audioWindowMs: capturedThroughMs - windowStartMs,
      latencyMs,
      positionProgress: alignment.positionProgress,
      reason,
      startIndex,
    });
  } catch (error) {
    diagnostic("checkpoint-error", { message: error.message, reason });
  } finally {
    state.busy = false;
    if (state.listening) $("readerState").textContent = INTERNET_RECOVERY_COPY["reading.active"];
  }
}

function monitorSpeech() {
  const now = performance.now();
  const elapsedMs = state.lastMonitorAt ? now - state.lastMonitorAt : 0;
  state.lastMonitorAt = now;
  const speaking = capture.level >= SPEECH_LEVEL;
  $("voicePulse").classList.toggle("speaking", speaking);
  if (speaking) {
    state.lastSpeechAt = now;
    state.guideSpeechMs += elapsedMs;
    updateReadingGuide();
  }
  const totalWords = tokenizeText(PASSAGE).length;
  if (!speaking && !state.busy && !state.finishing
    && hasEndEvidence(state.confirmedMatches, totalWords, PROFILE.endDetection)
    && now - state.lastSpeechAt >= PROFILE.endDetection.finalPauseMs) {
    void finishReading();
    return;
  }
  const sinceCheckpoint = now - state.lastCheckpointAt;
  const naturalPause = state.lastSpeechAt > state.lastCheckpointAt
    && now - state.lastSpeechAt >= PROFILE.checkpoint.pauseMs;
  if (!state.busy && ((naturalPause && sinceCheckpoint >= PROFILE.checkpoint.minimumWindowMs)
    || sinceCheckpoint >= PROFILE.checkpoint.maximumWindowMs)) {
    checkpoint(naturalPause ? "natural-pause" : "maximum-window");
  }
}

async function startReading() {
  $("listen").disabled = true;
  $("readerState").textContent = "Starting microphone…";
  await capture.start();
  state.listening = true;
  state.sessionId = createSessionId();
  state.startedAt = performance.now();
  state.lastSpeechAt = state.startedAt;
  state.lastCheckpointAt = state.startedAt;
  state.lastMonitorAt = state.startedAt;
  state.processedThroughMs = 0;
  state.monitor = setInterval(monitorSpeech, 100);
  $("listen").textContent = "Finish now";
  $("listen").disabled = false;
  $("readerState").textContent = INTERNET_RECOVERY_COPY["reading.ready.title"];
  diagnostic("capture-start");
}

function renderReviewResult(summary, durationMs, progress) {
  const pace = estimateReadingPace({ durationMs, expectedText: PASSAGE, wordCount: summary.matchedCount });
  $("finalAccuracy").textContent = `${summary.accuracy}%`;
  $("finalCorrect").textContent = `${summary.matchedCount}/${summary.totalCount}`;
  $("finalSpeed").textContent = `${pace.wpm} WPM`;
  $("finalProgress").textContent = `${Math.round(progress * 100)}%`;
  return pace;
}

async function finishReading() {
  if (state.finishing) return;
  state.finishing = true;
  state.listening = false;
  clearInterval(state.monitor);
  $("listen").disabled = true;
  $("readerState").textContent = "Capturing results…";
  while (state.busy) await new Promise((resolve) => setTimeout(resolve, 100));
  const { audio, durationMs, signal } = await capture.stop();
  const liveMatches = new Set(state.confirmedMatches);
  const liveSummary = summarizeTokenMatches(PASSAGE, liveMatches);
  const livePace = renderReviewResult(liveSummary, durationMs, state.confirmedProgress);
  $("finalizationStatus").textContent = "Reading captured. Finalizing the local transcript… 0.0s";
  $("finalizationStatus").className = "finalization-status working";
  $("finalTranscript").textContent = "Final transcript is still processing locally…";
  $("again").disabled = true;
  $("continueResult").disabled = true;
  $("export").disabled = true;
  show("review");
  const requestedAt = performance.now();
  const finalizationTimer = setInterval(() => {
    const elapsedSeconds = (performance.now() - requestedAt) / 1_000;
    $("finalizationStatus").textContent = `Reading captured. Finalizing the local transcript… ${elapsedSeconds.toFixed(1)}s`;
  }, 250);
  let text = "";
  try {
    text = await recognizer.transcribe(audio);
  } catch (error) {
    diagnostic("final-transcription-error", { message: error.message });
  } finally {
    clearInterval(finalizationTimer);
  }
  state.finalText = text;
  const alignment = alignTranscript(PASSAGE, text, { lookAhead: 24 });
  const finalLatencyMs = Math.round(performance.now() - requestedAt);
  updateProgress(alignment, finalLatencyMs);
  const combined = summarizeTokenMatches(PASSAGE, state.confirmedMatches);
  const pace = renderReviewResult(combined, durationMs, state.confirmedProgress);
  const finalAddedWords = combined.matchedCount - liveSummary.matchedCount;
  state.result = {
    accuracy: combined.accuracy,
    durationMs,
    finalAddedWords,
    finalLatencyMs,
    finalPassMatchedWords: alignment.matchedCount,
    liveAccuracy: liveSummary.accuracy,
    liveMatchedWords: liveSummary.matchedCount,
    liveWpm: livePace.wpm,
    matchedWords: combined.matchedCount,
    progress: state.confirmedProgress,
    signal,
    totalWords: combined.totalCount,
    wpm: pace.wpm,
  };
  const completedAt = new Date().toISOString();
  const storedSession = saveSessionSummary(localStateStorage, {
    completedAt,
    passageId: PHOTOSYNTHESIS_PASSAGE.id,
    result: state.result,
    sessionId: state.sessionId,
  });
  $("saveStatus").textContent = storedSession.ok
    ? "Non-audio session summary saved on this device. Audio and transcript text were not saved."
    : "Result is ready, but this browser did not save local history. Audio and transcript text were not saved.";
  diagnostic("session-persistence", { saved: storedSession.ok });
  $("finalizationStatus").textContent = `Final score ready in ${(finalLatencyMs / 1_000).toFixed(1)}s. The final pass added ${finalAddedWords} confirmed words.`;
  $("finalizationStatus").className = "finalization-status ready";
  $("again").disabled = false;
  $("continueResult").disabled = false;
  $("export").disabled = false;
  $("finalTranscript").textContent = text || "No final transcript was returned.";
  $("checkpointTranscripts").textContent = state.transcriptDiagnostics.length
    ? state.transcriptDiagnostics.map(({ reason, text: checkpointText }, index) => (
      `Checkpoint ${index + 1} (${reason})\n${checkpointText}`
    )).join("\n\n")
    : "No live checkpoint transcript was returned.";
  diagnostic("session-finish", state.result);
}

function sessionReport() {
  return {
    appVersion: "wikiwhy-batched-2",
    browser: navigator.userAgent,
    checkpoints: state.diagnostics.filter(({ type }) => type.startsWith("checkpoint")),
    completedAt: new Date().toISOString(),
    privacy: { audioUploadedByApp: false, rawAudioStored: false, transcriptIncluded: false, transcriptStored: false },
    result: state.result,
    speechEngine: { device: state.modelDevice, model: MODEL_ID, processing: "in-browser" },
  };
}

async function exportReport() {
  const report = JSON.stringify(sessionReport(), null, 2);
  try {
    await navigator.clipboard.writeText(report);
    $("reportStatus").textContent = "Timing report copied. It contains no audio or transcript text.";
  } catch {
    const blob = new Blob([report], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `wikiwhy-reading-${new Date().toISOString().replace(/[:.]/gu, "-")}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1_000);
    $("reportStatus").textContent = "Timing report downloaded. It contains no audio or transcript text.";
  }
}

async function prepare() {
  $("begin").disabled = true;
  $("modelProgress").textContent = "Requesting microphone…";
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
  state.modelDevice = await recognizer.load(requestedDevice);
  state.guideWpm = Number($("guideWpm").value) || PROFILE.guide.defaultWpm;
  $("modelProgress").textContent = `Ready locally (${state.modelDevice}).`;
  show("read");
  await startReading();
}

$("begin").onclick = () => prepare().catch((error) => {
  $("begin").disabled = false;
  $("modelProgress").textContent = `Could not start: ${error.message}`;
});
$("listen").onclick = () => (state.listening ? finishReading() : startReading()).catch((error) => {
  $("readerState").textContent = error.message;
  $("listen").disabled = false;
});
$("again").onclick = () => location.reload();
$("continueResult").onclick = () => {
  const current = readWikiWhyState(localStateStorage);
  const outcome = calculateWikiWhyRepair({
    comprehension: state.comprehension,
    previousStability: current.stability,
    readingResult: state.result,
  });
  const repair = uiPreview
    ? {
        ok: true,
        state: {
          ...current,
          lastAdvance: outcome.advance,
          lastReaction: outcome.reaction,
          repairCount: current.repairCount + 1,
          stability: outcome.stability,
        },
      }
    : recordWikiWhyRepair(localStateStorage, {
        ...outcome,
        passageId: PHOTOSYNTHESIS_PASSAGE.id,
        repairedAt: new Date().toISOString(),
        sessionId: state.sessionId,
      });
  renderRepairOutcome(repair.state, repair.ok);
  diagnostic("wrapper-repair-persistence", { advance: outcome.advance, saved: repair.ok });
  $("continueResult").disabled = true;
  $("continueResult").textContent = "Repair applied";
  $("reportStatus").textContent = `${outcome.reaction} WikiWhy is ${outcome.stability}% stable for now.`;
};
$("export").onclick = exportReport;
for (const eventName of ["wheel", "pointerdown", "touchstart"]) {
  $("passage").addEventListener(eventName, () => {
    state.guidePausedUntil = performance.now() + 5_000;
    $("guideStatus").textContent = `Manual scroll — guide resumes at ${state.guideWpm} WPM`;
  }, { passive: true });
}
document.querySelectorAll(".quiz button").forEach((button) => {
  button.onclick = () => {
    const correct = button.dataset.answer === "1";
    document.querySelectorAll(".quiz button").forEach((choice) => {
      choice.classList.toggle("right", choice === button && correct);
      choice.classList.toggle("wrong", choice === button && !correct);
    });
    $("quizFeedback").textContent = correct
      ? PHOTOSYNTHESIS_PASSAGE.comprehension.correctFeedback
      : PHOTOSYNTHESIS_PASSAGE.comprehension.incorrectFeedback;
    $("payoff").hidden = !correct;
    state.comprehension = correct ? "supported" : "retry-offered";
    if (state.sessionId) {
      updateSessionComprehension(
        localStateStorage,
        state.sessionId,
        correct ? "supported" : "retry-offered",
      );
    }
  };
});
window.addEventListener("pagehide", () => {
  clearInterval(state.monitor);
  clearTimeout(state.technoTimer);
  if (capture.active) capture.stop();
  recognizer.close();
});
function updateDesktopClock() {
  $("desktopClock").textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

hydrateInternetRecoveryCopy();
hydratePassage();
const previousWikiWhyState = readWikiWhyState(localStateStorage);
renderSavedRepair(previousWikiWhyState);
$("recoveredFilesShortcut").onclick = () => $("savedRepairReceipt").scrollIntoView({ block: "center" });
updateDesktopClock();
setInterval(updateDesktopClock, 30_000);
renderPassage(0);
if (uiPreview === "read") {
  const previewCount = Math.round(tokenizeText(PASSAGE).length * 0.55);
  updateProgress({
    furthestMatchedTokenIndex: previewCount - 1,
    matchedTokenIndexes: Array.from({ length: previewCount }, (_, index) => index),
    positionProgress: 0.55,
  }, 1_250);
  $("readerState").textContent = INTERNET_RECOVERY_COPY["reading.active"];
  show("read");
} else if (uiPreview === "review") {
  const previewTotal = tokenizeText(PASSAGE).length;
  state.result = { accuracy: 91, matchedWords: Math.round(previewTotal * 0.91), progress: 0.96, totalWords: previewTotal, wpm: 243 };
  state.sessionId = "visual-preview";
  $("finalAccuracy").textContent = "91%";
  $("finalCorrect").textContent = `${Math.round(previewTotal * 0.91)}/${previewTotal}`;
  $("finalSpeed").textContent = "243 WPM";
  $("finalProgress").textContent = "96%";
  $("finalizationStatus").textContent = "Final score ready. The page repair is recorded.";
  $("finalizationStatus").className = "finalization-status ready";
  show("review");
} else if (uiPreview === "outcome") {
  const previewTotal = tokenizeText(PASSAGE).length;
  state.comprehension = "supported";
  state.result = { accuracy: 91, matchedWords: Math.round(previewTotal * 0.91), progress: 0.96, totalWords: previewTotal, wpm: 243 };
  $("finalAccuracy").textContent = "91%";
  $("finalCorrect").textContent = `${Math.round(previewTotal * 0.91)}/${previewTotal}`;
  $("finalSpeed").textContent = "243 WPM";
  $("finalProgress").textContent = "96%";
  $("finalizationStatus").textContent = "Final score ready. The page repair is recorded.";
  $("finalizationStatus").className = "finalization-status ready";
  show("review");
  $("continueResult").click();
}
