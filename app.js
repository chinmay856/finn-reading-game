import { alignTranscript, estimateReadingPace, tokenizeText } from "./reading-engine.js";
import { LocalAudioCapture } from "./speech/audio-capture.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";

const LINES = [
  "When Mary Lennox was sent to live with her uncle in an old manor, everyone thought she looked unfriendly and unhappy.",
  "She had a little thin face and a little thin body, thin light hair and a sour expression.",
  "But the fresh air, the moor, and the mystery of the locked garden slowly began to change her.",
  "Before long, Mary discovered that caring for the garden also taught her how to care for other people.",
];
const MODEL_ID = "onnx-community/whisper-base_timestamped";
const $ = (id) => document.getElementById(id);
const screens = ["setup", "read", "review"];
const WORD_PART = /^[\p{L}\p{N}]+(?:[\u2019'][\p{L}\p{N}]+)*$/u;
const requestedSpeechDevice = new URLSearchParams(window.location.search).get("speechDevice");
const capture = new LocalAudioCapture();

const S = {
  checking: false,
  diagnostics: [],
  durationMs: 0,
  finalText: "",
  goal: 85,
  line: 0,
  listening: false,
  min: 100,
  modelDevice: null,
  pending: null,
  permission: "not-requested",
  previewPromise: null,
  previewTimer: null,
  results: [],
  sessionStartedAt: 0,
  starting: false,
  tries: Array(LINES.length).fill(0),
};

function addDiagnostic(type, details = {}) {
  S.diagnostics.push({ at: new Date().toISOString(), type, ...details });
  if (S.diagnostics.length > 60) S.diagnostics.shift();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/gu, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[character]);
}

function formatModelProgress(data = {}) {
  if (data.message) return data.message;
  if (data.status === "progress" && Number.isFinite(data.progress)) {
    return `Downloading local model: ${Math.round(data.progress)}%`;
  }
  if (data.status === "download") return "Downloading the local speech model...";
  if (data.status === "initiate") return "Preparing model files...";
  if (data.status === "done") return "Model file ready...";
  if (data.status === "ready") return "Local speech runtime ready...";
  return "Preparing the local speech engine...";
}

const recognizer = new LocalWhisperRecognizer({
  onProgress(data) {
    const message = formatModelProgress(data);
    $("modelProgress").textContent = message;
    $("modelProgress").hidden = false;
  },
});

function transcript() {
  return S.finalText.trim();
}

function notice(message = "") {
  $("notice").textContent = message;
  $("notice").hidden = !message;
}

function setState(message, className = "") {
  $("state").textContent = message;
  $("state").className = `pill ${className}`;
}

function show(name) {
  screens.forEach((screen) => $(screen).classList.toggle("on", screen === name));
  document.querySelectorAll(".steps span").forEach((step) => {
    step.classList.toggle("on", step.dataset.step === name);
  });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function alignmentStatuses(alignment, final = false) {
  const statuses = Array(alignment.expectedTokens.length).fill("");
  alignment.matchedTokenIndexes.forEach((index) => { statuses[index] = "ok"; });
  if (final) {
    alignment.missedTokenIndexes.forEach((index) => { statuses[index] = "bad"; });
  } else {
    alignment.uncertainTokenIndexes.forEach((index) => {
      if (!statuses[index]) statuses[index] = "uncertain";
    });
    if (!statuses[alignment.nextTokenIndex]) statuses[alignment.nextTokenIndex] = "now";
  }
  return statuses;
}

function render(statuses = []) {
  $("passage").innerHTML = LINES.map((line, lineIndex) => {
    let tokenIndex = 0;
    const text = line.split(/([\p{L}\p{N}]+(?:[\u2019'][\p{L}\p{N}]+)*)/gu)
      .map((part) => {
        if (lineIndex !== S.line || !WORD_PART.test(part)) return escapeHtml(part);
        const status = statuses[tokenIndex] ?? "";
        tokenIndex += 1;
        return `<span class="word ${status}">${escapeHtml(part)}</span>`;
      })
      .join("");
    const current = lineIndex === S.line ? ' aria-current="true"' : "";
    return `<div class="line ${lineIndex < S.line ? "done" : ""} ${lineIndex === S.line ? "active" : ""}"${current}>${text}</div>`;
  }).join("");
}

function metrics() {
  const alignment = alignTranscript(LINES[S.line], transcript());
  const durationMs = S.durationMs || capture.durationMs;
  const countedWords = Math.max(
    alignment.matchedCount,
    alignment.spokenWordCount - alignment.fillerWords - alignment.repeatedWords,
  );
  const paceEstimate = estimateReadingPace({
    durationMs,
    expectedText: LINES[S.line],
    wordCount: countedWords,
  });
  return { alignment, ...paceEstimate };
}

function pace(wpm) {
  if (!wpm) return ["--", ""];
  if (wpm < S.min) return ["Building speed", "warn"];
  if (wpm >= S.min + 30) return ["Fast pace", "good"];
  return ["Goal reached", "good"];
}

function aggregate(includeCurrent = true) {
  const results = [...S.results];
  if (includeCurrent && transcript()) {
    const current = metrics();
    results.push({
      accuracy: current.alignment.accuracy,
      correct: current.alignment.matchedCount,
      total: current.alignment.expectedTokens.length,
      wpm: current.wpm,
    });
  }
  const total = results.reduce((sum, item) => sum + item.total, 0);
  const correct = results.reduce((sum, item) => sum + item.correct, 0);
  const weightedAccuracy = results.reduce((sum, item) => sum + (item.accuracy * item.total), 0);
  const speeds = results.map((item) => item.wpm).filter(Boolean);
  return {
    accuracy: total ? Math.round(weightedAccuracy / total) : 0,
    correct,
    wpm: speeds.length ? Math.round(speeds.reduce((sum, value) => sum + value, 0) / speeds.length) : 0,
  };
}

function renderLive(final = false) {
  const current = metrics();
  const session = aggregate(true);
  const paceResult = pace(current.wpm);
  $("accuracy").textContent = transcript() ? `${session.accuracy}%` : "--";
  $("speed").textContent = current.wpm ? `${current.wpm} WPM` : "--";
  $("pace").textContent = paceResult[0];
  $("pace").className = paceResult[1];
  $("correct").textContent = session.correct;
  render(alignmentStatuses(current.alignment, final));
}

async function runPreview() {
  if (!S.listening || S.previewPromise || capture.durationMs < 2_000) return;
  const audio = await capture.snapshot();
  if (!audio.length) return;
  S.previewPromise = recognizer.transcribe(audio)
    .then((text) => {
      if (!S.listening || !text) return;
      S.finalText = text;
      $("heard").textContent = text;
      renderLive();
      addDiagnostic("local-preview", { line: S.line + 1 });
    })
    .catch((error) => {
      addDiagnostic("local-preview-error", { message: error.message });
    })
    .finally(() => { S.previewPromise = null; });
  await S.previewPromise;
}

async function startReading() {
  if (!recognizer.ready || S.starting || S.listening || S.checking) return;
  notice("");
  S.starting = true;
  $("listen").disabled = true;
  $("listen").textContent = "Starting...";
  setState("Starting", "warn");
  try {
    await capture.start();
    S.starting = false;
    S.listening = true;
    S.durationMs = 0;
    setState("Listening locally", "live");
    $("listen").disabled = false;
    $("listen").textContent = "Stop listening";
    window.setTimeout(() => { if (S.listening) $("check").disabled = false; }, 800);
    S.previewTimer = window.setInterval(runPreview, 3_500);
    addDiagnostic("local-capture-start", { line: S.line + 1 });
  } catch (error) {
    S.starting = false;
    S.listening = false;
    $("listen").disabled = false;
    $("listen").textContent = "Start reading";
    setState("Needs attention", "warn");
    addDiagnostic("local-capture-error", { message: error.message });
    notice(error?.name === "NotAllowedError"
      ? "Microphone access was blocked. Allow Microphone for this site, reload, and try again."
      : "The microphone could not start. Check that another app is not using it, then try again.");
  }
}

async function stopListening() {
  if (!capture.active) return transcript();
  S.listening = false;
  S.starting = false;
  window.clearInterval(S.previewTimer);
  S.previewTimer = null;
  $("listen").disabled = true;
  $("check").disabled = true;
  $("listen").textContent = "Transcribing...";
  setState("Transcribing locally", "warn");

  const { audio, durationMs, signal } = await capture.stop();
  S.durationMs = durationMs;
  $("signalCheck").textContent = `Last microphone signal: RMS ${signal.rms}, peak ${signal.peak}, active frames ${Math.round(signal.activeFrameRatio * 100)}%.`;
  if (S.previewPromise) await S.previewPromise;
  try {
    const text = await recognizer.transcribe(audio);
    S.finalText = text;
    $("heard").textContent = text || "--";
    renderLive(true);
    addDiagnostic("local-transcription", {
      durationMs,
      hadTranscript: Boolean(text),
      line: S.line + 1,
      signal,
    });
    if (!text) notice("The local model did not detect speech. Nothing was scored; try the line again.");
    else if (signal.rms < 0.01 || signal.peak < 0.04) {
      notice("The microphone signal was very quiet. Move closer to the microphone or raise its input level, then retry.");
    }
  } catch (error) {
    addDiagnostic("local-transcription-error", { message: error.message });
    notice("Local transcription failed. The recording was discarded; retry the line.");
  } finally {
    $("listen").disabled = false;
    $("listen").textContent = "Start reading";
    $("check").disabled = !transcript();
    setState(transcript() ? "Ready to check" : "Ready", transcript() ? "good" : "");
  }
  return transcript();
}

function resetLine() {
  S.durationMs = 0;
  S.finalText = "";
  S.pending = null;
  $("heard").textContent = "--";
  $("coach").hidden = true;
  $("controls").hidden = false;
  $("check").disabled = true;
  $("counter").textContent = `Line ${S.line + 1} of ${LINES.length}`;
  render();
  renderLive();
  setState("Ready");
}

function lineResult(force = false) {
  const current = metrics();
  const accuracyPass = current.alignment.accuracy >= S.goal;
  const pacePass = current.wpm >= S.min;
  return {
    accuracy: current.alignment.accuracy,
    accuracyPass,
    adjustedDurationMs: current.adjustedDurationMs,
    attempts: S.tries[S.line],
    correct: current.alignment.matchedCount,
    durationMs: current.rawDurationMs,
    fillerWords: current.alignment.fillerWords,
    forced: force,
    line: S.line,
    missedWords: current.alignment.missedWords,
    pacePass,
    passed: force || (accuracyPass && pacePass),
    pauseAllowanceMs: current.pauseAllowanceMs,
    repeatedWords: current.alignment.repeatedWords,
    selfCorrections: current.alignment.selfCorrections,
    total: current.alignment.expectedTokens.length,
    unalignedWords: current.alignment.unalignedWords,
    wpm: current.wpm,
  };
}

function coach(result) {
  S.pending = result;
  $("controls").hidden = true;
  $("coach").hidden = false;
  const details = [];
  if (!result.accuracyPass) details.push(`Estimated accuracy ${result.accuracy}% (goal ${S.goal}%).`);
  if (!result.pacePass) details.push(`Estimated speed ${result.wpm || 0} WPM (goal ${S.min}+).`);
  if (result.missedWords.length) details.push(`The model may have missed: ${result.missedWords.slice(0, 6).join(", ")}.`);
  details.push("Punctuation pauses are forgiven. Retry, or accept if the local model heard you wrong.");
  if (result.accuracyPass) $("coachTitle").textContent = "Clear enough -- try it faster.";
  else if (result.pacePass) $("coachTitle").textContent = "Fast -- make the words clearer.";
  else $("coachTitle").textContent = "Try that line once more.";
  $("coachText").textContent = details.join(" ");
  renderLive(true);
  setState("Retry or accept", "warn");
}

function advance(result) {
  S.results.push(result);
  S.pending = null;
  setState("Accepted", "live");
  render(Array(tokenizeText(LINES[S.line]).length).fill("ok"));
  if (S.line === LINES.length - 1) window.setTimeout(finish, 350);
  else {
    S.line += 1;
    window.setTimeout(resetLine, 350);
  }
}

async function checkLine(force = false) {
  if (S.checking) return;
  S.checking = true;
  setState("Checking", "warn");
  if (S.listening) await stopListening();
  if (!transcript() && !force) {
    S.checking = false;
    notice("Read the highlighted line before checking it.");
    return;
  }

  let result;
  if (force && S.pending) result = { ...S.pending, forced: true, passed: true };
  else {
    S.tries[S.line] += 1;
    result = lineResult(force);
    result.attempts = S.tries[S.line];
  }
  S.checking = false;
  addDiagnostic("line-check", {
    acceptedEstimate: Boolean(result.forced),
    accuracy: result.accuracy,
    line: result.line + 1,
    wpm: result.wpm,
  });
  if (result.passed) advance(result);
  else coach(result);
}

function sessionReport() {
  return {
    appVersion: "desktop-local-1",
    capabilities: {
      microphoneApi: Boolean(navigator.mediaDevices?.getUserMedia),
      secureContext: window.isSecureContext,
      webGpu: Boolean(navigator.gpu),
      webWorker: Boolean(window.Worker),
    },
    completedAt: new Date().toISOString(),
    diagnostics: S.diagnostics,
    page: window.location.href,
    privacy: {
      audioUploadedByApp: false,
      rawAudioStored: false,
      transcriptStored: false,
    },
    results: S.results,
    sessionStartedAt: S.sessionStartedAt ? new Date(S.sessionStartedAt).toISOString() : null,
    speechEngine: { device: S.modelDevice, model: MODEL_ID, processing: "in-browser" },
    targets: { accuracy: S.goal, minimumWpm: S.min },
    userAgent: navigator.userAgent,
  };
}

function downloadReport(text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `finn-reading-test-${new Date().toISOString().replace(/[:.]/gu, "-")}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

async function copyReport() {
  const text = JSON.stringify(sessionReport(), null, 2);
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    notice("Test report copied. It contains scores and browser diagnostics, never audio or transcripts.");
  } catch {
    downloadReport(text);
    notice("The browser downloaded the test report. It contains scores and diagnostics, never audio or transcripts.");
  }
}

async function finish() {
  if (S.listening) await stopListening();
  const total = S.results.reduce((sum, item) => sum + item.total, 0);
  const weightedAccuracy = S.results.reduce((sum, item) => sum + (item.accuracy * item.total), 0);
  const correct = S.results.reduce((sum, item) => sum + item.correct, 0);
  const speeds = S.results.map((item) => item.wpm).filter(Boolean);
  const accuracy = total ? Math.round(weightedAccuracy / total) : 0;
  const averageWpm = speeds.length ? Math.round(speeds.reduce((sum, value) => sum + value, 0) / speeds.length) : 0;
  const firstTry = S.results.filter((item) => item.attempts === 1 && !item.forced).length;
  const retries = S.results.reduce((sum, item) => sum + Math.max(0, item.attempts - 1), 0);
  $("finalAccuracy").textContent = `${accuracy}%`;
  $("finalCorrect").textContent = `${correct}/${total}`;
  $("finalSpeed").textContent = `${averageWpm} WPM`;
  $("firstTry").textContent = `${firstTry}/${S.results.length}`;
  $("retries").textContent = retries;
  $("results").innerHTML = S.results.map((item, index) => (
    `<div class="result"><span>Line ${index + 1}${item.forced ? " - accepted" : ""}</span><b>${item.accuracy}%</b><b>${item.wpm} WPM</b></div>`
  )).join("");
  addDiagnostic("session-review", { completedLines: S.results.length });
  show("review");
}

function begin() {
  S.min = Number($("minWpm").value);
  S.goal = Number($("goal").value);
  S.line = 0;
  S.results = [];
  S.tries = Array(LINES.length).fill(0);
  S.sessionStartedAt = Date.now();
  $("target").textContent = `Goal: ${S.min}+ WPM with ${S.goal}% accuracy`;
  show("read");
  resetLine();
  notice("The local model is ready. Start reading when you are ready; faster is better when the words stay clear.");
}

async function requestMicrophonePermission() {
  if (!window.isSecureContext) throw new Error("This test needs the published HTTPS link or localhost.");
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser cannot request microphone access.");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
}

$("begin").onclick = async () => {
  const button = $("begin");
  button.disabled = true;
  button.textContent = "Requesting microphone...";
  try {
    await requestMicrophonePermission();
    S.permission = "granted";
    addDiagnostic("microphone-permission", { result: "granted" });
    button.textContent = "Loading local model...";
    $("speechCheck").textContent = "loading";
    $("speechCheck").className = "warn";
    S.modelDevice = await recognizer.load(requestedSpeechDevice);
    $("speechCheck").textContent = `ready (${S.modelDevice})`;
    $("speechCheck").className = "good";
    $("modelProgress").textContent = "Model cached. Voice processing stays in this browser.";
    addDiagnostic("local-model-ready", { device: S.modelDevice, model: MODEL_ID });
    begin();
  } catch (error) {
    S.permission = error?.name === "NotAllowedError" ? "denied" : "error";
    addDiagnostic("setup-error", { message: error.message, name: error?.name ?? "Error" });
    $("speechCheck").textContent = "not ready";
    $("speechCheck").className = "bad";
    notice(error?.name === "NotAllowedError"
      ? "Microphone access was blocked. Allow Microphone for this site, reload, and try again."
      : `The local voice engine could not start: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = "Prepare local voice engine";
  }
};

$("listen").onclick = () => (S.listening ? stopListening() : startReading());
$("check").onclick = () => checkLine(false);
$("finish").onclick = finish;
$("retry").onclick = async () => { resetLine(); await startReading(); };
$("accept").onclick = () => checkLine(true);
$("again").onclick = () => {
  S.line = 0;
  S.results = [];
  S.tries = Array(LINES.length).fill(0);
  S.sessionStartedAt = Date.now();
  show("read");
  resetLine();
};
$("settings").onclick = async () => { if (S.listening) await stopListening(); show("setup"); };
$("export").onclick = copyReport;

document.querySelectorAll(".quiz button").forEach((button) => {
  button.onclick = () => {
    document.querySelectorAll(".quiz button").forEach((choice) => choice.classList.remove("right", "wrong"));
    const correct = button.dataset.answer === "1";
    button.classList.add(correct ? "right" : "wrong");
    $("quizFeedback").textContent = correct
      ? "Correct -- the garden and friendships helped Mary grow healthier and more caring."
      : "Not quite. Think about the people and environment that changed her.";
  };
});

function checkDevice(id, available) {
  $(id).textContent = available ? "ready" : "not available";
  $(id).className = available ? "good" : "bad";
}

checkDevice("httpsCheck", window.isSecureContext);
checkDevice("micCheck", Boolean(navigator.mediaDevices?.getUserMedia));
$("speechCheck").textContent = window.Worker ? "not loaded" : "not available";
$("speechCheck").className = window.Worker ? "warn" : "bad";
$("browserCheck").textContent = navigator.userAgent;
if (!window.isSecureContext) notice("Use the published HTTPS page or localhost so the browser can access the microphone.");
else if (!window.Worker) notice("This browser cannot run the local speech worker. Use a current desktop browser.");
window.addEventListener("pagehide", () => {
  window.clearInterval(S.previewTimer);
  if (capture.active) capture.stop();
  recognizer.close();
});
render();
