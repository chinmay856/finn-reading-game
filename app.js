import { EVIDENCE_PASSAGE } from "./content/evidence-passage.js";
import { alignTranscript, estimateReadingPace, hasEndEvidence, summarizeTokenMatches, tokenizeText } from "./reading-engine.js";
import { LocalAudioCapture } from "./speech/audio-capture.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";

const PARAGRAPHS = EVIDENCE_PASSAGE.paragraphs;
const PASSAGE = PARAGRAPHS.join(" ");
const PROFILE = EVIDENCE_PASSAGE.profile;
const MODEL_ID = "onnx-community/whisper-base_timestamped";
const SPEECH_LEVEL = 0.009;
const $ = (id) => document.getElementById(id);
const capture = new LocalAudioCapture();
const requestedDevice = new URLSearchParams(location.search).get("speechDevice");

const state = {
  busy: false, confirmedMatches: new Set(), confirmedProgress: 0, confirmedTokenIndex: 0,
  diagnostics: [], finalText: "", finishing: false, lastCheckpointAt: 0, lastSpeechAt: 0,
  listening: false, modelDevice: null, monitor: null, transcriptDiagnostics: [],
  processedThroughMs: 0, result: null, startedAt: 0,
};

const recognizer = new LocalWhisperRecognizer({ onProgress(data = {}) {
  const value = Number.isFinite(data.progress) ? ` ${Math.round(data.progress)}%` : "";
  $("modelProgress").textContent = data.message || `Preparing local model${value}`;
} });

function diagnostic(type, details = {}) {
  state.diagnostics.push({ at: new Date().toISOString(), type, ...details });
  if (state.diagnostics.length > 60) state.diagnostics.shift();
}

function show(name) {
  for (const id of ["setup", "read", "review"]) $(id).classList.toggle("on", id === name);
}

function renderPassage(progress = state.confirmedProgress) {
  const allTokens = tokenizeText(PASSAGE);
  const confirmed = Math.round(progress * allTokens.length);
  let cursor = 0;
  $("passage").innerHTML = PARAGRAPHS.map((paragraph, paragraphIndex) => {
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
  const active = $("passage").querySelector(".reading-paragraph.active");
  active?.scrollIntoView({ block: "center", behavior: "smooth" });
}

function updateProgress(alignment, latencyMs = null) {
  alignment.matchedTokenIndexes.forEach((index) => state.confirmedMatches.add(index));
  state.confirmedProgress = Math.max(state.confirmedProgress, alignment.positionProgress);
  state.confirmedTokenIndex = Math.max(state.confirmedTokenIndex, alignment.furthestMatchedTokenIndex + 1);
  const percent = Math.round(state.confirmedProgress * 100);
  $("repairFill").style.width = `${percent}%`;
  $("repairPercent").textContent = `${percent}% repaired`;
  $("progressText").textContent = `${percent}% confirmed`;
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
    if (state.listening) $("readerState").textContent = "Listening — keep reading";
  }
}

function monitorSpeech() {
  const now = performance.now();
  const speaking = capture.level >= SPEECH_LEVEL;
  $("voicePulse").classList.toggle("speaking", speaking);
  if (speaking) state.lastSpeechAt = now;
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
  state.startedAt = performance.now();
  state.lastSpeechAt = state.startedAt;
  state.lastCheckpointAt = state.startedAt;
  state.processedThroughMs = 0;
  state.monitor = setInterval(monitorSpeech, 100);
  $("listen").textContent = "Finish now";
  $("listen").disabled = false;
  $("readerState").textContent = "Listening — start when ready";
  diagnostic("capture-start");
}

async function finishReading() {
  if (state.finishing) return;
  state.finishing = true;
  state.listening = false;
  clearInterval(state.monitor);
  $("listen").disabled = true;
  $("readerState").textContent = "Finishing local transcription…";
  while (state.busy) await new Promise((resolve) => setTimeout(resolve, 100));
  const { audio, durationMs, signal } = await capture.stop();
  const requestedAt = performance.now();
  let text = "";
  try {
    text = await recognizer.transcribe(audio);
  } catch (error) {
    diagnostic("final-transcription-error", { message: error.message });
  }
  state.finalText = text;
  const alignment = alignTranscript(PASSAGE, text, { lookAhead: 24 });
  const finalLatencyMs = Math.round(performance.now() - requestedAt);
  updateProgress(alignment, finalLatencyMs);
  const combined = summarizeTokenMatches(PASSAGE, state.confirmedMatches);
  const pace = estimateReadingPace({ durationMs, expectedText: PASSAGE, wordCount: combined.matchedCount });
  state.result = {
    accuracy: combined.accuracy,
    durationMs,
    finalLatencyMs,
    matchedWords: combined.matchedCount,
    progress: state.confirmedProgress,
    signal,
    totalWords: combined.totalCount,
    wpm: pace.wpm,
  };
  $("finalAccuracy").textContent = `${combined.accuracy}%`;
  $("finalCorrect").textContent = `${combined.matchedCount}/${combined.totalCount}`;
  $("finalSpeed").textContent = `${pace.wpm} WPM`;
  $("finalProgress").textContent = `${Math.round(state.confirmedProgress * 100)}%`;
  $("finalTranscript").textContent = text || "No final transcript was returned.";
  $("checkpointTranscripts").textContent = state.transcriptDiagnostics.length
    ? state.transcriptDiagnostics.map(({ reason, text: checkpointText }, index) => (
      `Checkpoint ${index + 1} (${reason})\n${checkpointText}`
    )).join("\n\n")
    : "No live checkpoint transcript was returned.";
  diagnostic("session-finish", state.result);
  show("review");
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
$("export").onclick = exportReport;
document.querySelectorAll(".quiz button").forEach((button) => {
  button.onclick = () => {
    const correct = button.dataset.answer === "1";
    document.querySelectorAll(".quiz button").forEach((choice) => {
      choice.classList.toggle("right", choice === button && correct);
      choice.classList.toggle("wrong", choice === button && !correct);
    });
    $("quizFeedback").textContent = correct
      ? "Right. Correlation alone cannot rule out other explanations."
      : "Not quite. Look for another factor that could affect both observations.";
    $("payoff").hidden = !correct;
  };
});
window.addEventListener("pagehide", () => {
  clearInterval(state.monitor);
  if (capture.active) capture.stop();
  recognizer.close();
});
renderPassage(0);
