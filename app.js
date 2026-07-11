import { alignTranscript, estimateReadingPace, tokenizeText } from "./reading-engine.js";
import { LocalAudioCapture } from "./speech/audio-capture.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";

const PARAGRAPHS = [
  "Most people encounter scientific results after they have been compressed into a headline. The headline may sound certain, even when the original researchers were careful to describe limits and unanswered questions. Reading the full account means slowing down long enough to notice what was actually measured, who participated, and what comparison was made.",
  "Imagine a study reporting that students who sleep longer tend to earn higher grades. That pattern is a correlation: two things changed together. It does not prove that extra sleep caused the grades. Students with stable schedules might also have quieter homes, shorter commutes, or more time for homework. Each possibility offers another explanation for the same result.",
  "Researchers can make a claim stronger by planning comparisons in advance and measuring other factors that might influence the outcome. Even then, a single study rarely settles a complicated question. A small sample may not represent everyone, and a result found in one school may change somewhere else. Replication helps reveal which patterns are dependable.",
  "Good scientific reading is therefore less about accepting or rejecting a bold conclusion than asking useful questions. What evidence supports the claim? What remains uncertain? Would a different explanation fit the observations? Those questions do not weaken science. They are part of the process that turns an interesting result into knowledge people can trust.",
];
const PASSAGE = PARAGRAPHS.join(" ");
const MODEL_ID = "onnx-community/whisper-base_timestamped";
const MIN_CAPTURE_MS = 8_000;
const MAX_CAPTURE_MS = 22_000;
const PAUSE_MS = 900;
const SPEECH_LEVEL = 0.009;
const AUDIO_OVERLAP_MS = 3_000;
const TOKEN_OVERLAP = 12;
const $ = (id) => document.getElementById(id);
const capture = new LocalAudioCapture();
const requestedDevice = new URLSearchParams(location.search).get("speechDevice");

const state = {
  busy: false, confirmedProgress: 0, confirmedTokenIndex: 0, diagnostics: [], finalText: "",
  lastCheckpointAt: 0, lastSpeechAt: 0, listening: false, modelDevice: null, monitor: null,
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
  if (!state.listening || state.busy || capture.durationMs < MIN_CAPTURE_MS) return;
  state.busy = true;
  state.lastCheckpointAt = performance.now();
  $("readerState").textContent = "Checking progress locally…";
  const requestedAt = performance.now();
  try {
    const capturedThroughMs = capture.durationMs;
    const windowStartMs = Math.max(0, state.processedThroughMs - AUDIO_OVERLAP_MS);
    const audio = await capture.snapshot({ overlapMs: AUDIO_OVERLAP_MS, sinceMs: state.processedThroughMs });
    const text = await recognizer.transcribe(audio);
    state.processedThroughMs = capturedThroughMs;
    if (!text || !state.listening) return;
    state.finalText = text;
    const startIndex = Math.max(0, state.confirmedTokenIndex - TOKEN_OVERLAP);
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
  const sinceCheckpoint = now - state.lastCheckpointAt;
  const naturalPause = state.lastSpeechAt > state.lastCheckpointAt && now - state.lastSpeechAt >= PAUSE_MS;
  if (!state.busy && ((naturalPause && sinceCheckpoint >= MIN_CAPTURE_MS) || sinceCheckpoint >= MAX_CAPTURE_MS)) {
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
  $("listen").textContent = "Finish reading";
  $("listen").disabled = false;
  $("readerState").textContent = "Listening — start when ready";
  diagnostic("capture-start");
}

async function finishReading() {
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
  const pace = estimateReadingPace({ durationMs, expectedText: PASSAGE, wordCount: alignment.matchedCount });
  state.result = {
    accuracy: alignment.accuracy,
    durationMs,
    finalLatencyMs,
    matchedWords: alignment.matchedCount,
    progress: alignment.positionProgress,
    signal,
    totalWords: alignment.expectedTokens.length,
    wpm: pace.wpm,
  };
  $("finalAccuracy").textContent = `${alignment.accuracy}%`;
  $("finalCorrect").textContent = `${alignment.matchedCount}/${alignment.expectedTokens.length}`;
  $("finalSpeed").textContent = `${pace.wpm} WPM`;
  $("finalProgress").textContent = `${Math.round(alignment.progress * 100)}%`;
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
