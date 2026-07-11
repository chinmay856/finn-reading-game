import { alignTranscript, tokenizeText } from "./reading-engine.js?v=phone-test-1";

const LINES = [
  "When Mary Lennox was sent to Misselthwaite Manor to live with her uncle, everybody said she was the most disagreeable-looking child ever seen.",
  "She had a little thin face and a little thin body, thin light hair and a sour expression.",
  "But the fresh air, the moor, and the mystery of the locked garden slowly began to change her.",
  "Before long, Mary discovered that caring for the garden also taught her how to care for other people.",
];
const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
const $ = (id) => document.getElementById(id);
const screens = ["setup", "read", "review"];
const WORD_PART = /^[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*$/u;
const ERROR_MESSAGES = {
  "audio-capture": "No microphone input was available. Check that another app is not using the microphone, then try again.",
  network: "The browser speech service could not be reached. Check the connection and try again; nothing was scored.",
  "no-speech": "No speech was detected. Nothing was scored. Tap Start reading and try again.",
  "not-allowed": "Microphone or speech recognition was blocked. Allow Microphone for this site, reload, and try again.",
  "service-not-allowed": "The browser blocked its speech service. Check this site's Microphone permission or try the target browser again.",
};

const S = {
  activeDurationMs: 0,
  checking: false,
  diagnostics: [],
  finalText: "",
  goal: 85,
  interim: "",
  line: 0,
  listening: false,
  max: 150,
  min: 85,
  pending: null,
  permission: "not-requested",
  rec: null,
  results: [],
  segmentFirstSpeechAt: 0,
  segmentLastSpeechAt: 0,
  segmentStartedAt: 0,
  sessionStartedAt: 0,
  starting: false,
  stopResolver: null,
  tries: Array(LINES.length).fill(0),
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[character]);
}

function transcript() {
  return [S.finalText, S.interim].filter(Boolean).join(" ").trim();
}

function addDiagnostic(type, details = {}) {
  S.diagnostics.push({ at: new Date().toISOString(), type, ...details });
  if (S.diagnostics.length > 60) S.diagnostics.shift();
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
    const text = line.split(/([\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*)/gu)
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

function currentSegmentDuration() {
  if (!S.segmentLastSpeechAt) return 0;
  const liveDuration = S.segmentLastSpeechAt - S.segmentFirstSpeechAt;
  const measuredStart = liveDuration >= 1_000 ? S.segmentFirstSpeechAt : S.segmentStartedAt;
  return Math.max(2_000, S.segmentLastSpeechAt - measuredStart);
}

function finishSegment() {
  S.activeDurationMs += currentSegmentDuration();
  S.segmentFirstSpeechAt = 0;
  S.segmentLastSpeechAt = 0;
  S.segmentStartedAt = 0;
}

function metrics() {
  const alignment = alignTranscript(LINES[S.line], transcript());
  const durationMs = S.activeDurationMs + currentSegmentDuration();
  const countedWords = Math.max(
    alignment.matchedCount,
    alignment.spokenWordCount - alignment.fillerWords - alignment.repeatedWords,
  );
  const wpm = durationMs ? Math.round(countedWords / (durationMs / 60_000)) : 0;
  return { alignment, durationMs, wpm };
}

function pace(wpm) {
  if (!wpm) return ["--", ""];
  if (wpm < S.min) return ["Below target", "warn"];
  if (wpm > S.max) return ["Above target", "warn"];
  return ["On target", "good"];
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

function renderLive() {
  const current = metrics();
  const session = aggregate(true);
  const paceResult = pace(current.wpm);
  $("accuracy").textContent = transcript() ? `${session.accuracy}%` : "--";
  $("speed").textContent = current.wpm ? `${current.wpm} WPM` : "--";
  $("pace").textContent = paceResult[0];
  $("pace").className = paceResult[1];
  $("correct").textContent = session.correct;
  render(alignmentStatuses(current.alignment));
}

function errorMessage(code) {
  return ERROR_MESSAGES[code] ?? `Speech recognition reported "${code}". Try again; nothing was automatically accepted.`;
}

function createRecognition() {
  const recognition = new SpeechRecognitionApi();
  const baseFinalText = S.finalText;
  let hadError = false;
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    S.starting = false;
    S.listening = true;
    S.segmentStartedAt = Date.now();
    setState("Listening", "live");
    $("listen").disabled = false;
    $("listen").textContent = "Stop listening";
    notice("");
    addDiagnostic("recognition-start", { line: S.line + 1 });
  };

  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let index = 0; index < event.results.length; index += 1) {
      const text = event.results[index][0]?.transcript?.trim() ?? "";
      if (event.results[index].isFinal) finalText += `${text} `;
      else interimText += `${text} `;
    }
    S.finalText = [baseFinalText, finalText.trim()].filter(Boolean).join(" ");
    S.interim = interimText.trim();
    const now = Date.now();
    if (transcript() && !S.segmentFirstSpeechAt) S.segmentFirstSpeechAt = now;
    if (transcript()) S.segmentLastSpeechAt = now;
    $("heard").textContent = transcript() || "--";
    $("check").disabled = !transcript();
    renderLive();
  };

  recognition.onerror = (event) => {
    hadError = event.error !== "aborted";
    addDiagnostic("recognition-error", { code: event.error || "unknown", line: S.line + 1 });
    if (event.error !== "aborted") notice(errorMessage(event.error || "unknown"));
  };

  recognition.onend = () => {
    finishSegment();
    S.starting = false;
    S.listening = false;
    S.rec = null;
    $("listen").disabled = false;
    $("listen").textContent = "Start reading";
    $("check").disabled = !transcript();
    if (!S.checking) {
      if (hadError) setState("Needs attention", "warn");
      else if (transcript()) {
        setState("Paused", "warn");
        notice("Speech stopped. Review what the browser heard, then tap Check line or Start reading to continue.");
      } else setState("Ready");
    }
    addDiagnostic("recognition-end", { hadTranscript: Boolean(transcript()), line: S.line + 1 });
    S.stopResolver?.();
    S.stopResolver = null;
  };
  return recognition;
}

function startReading() {
  if (!SpeechRecognitionApi || S.starting || S.listening || S.checking) return;
  notice("");
  S.starting = true;
  $("listen").disabled = true;
  $("listen").textContent = "Starting...";
  setState("Starting", "warn");
  try {
    S.rec = createRecognition();
    S.rec.start();
  } catch (error) {
    S.starting = false;
    S.rec = null;
    $("listen").disabled = false;
    $("listen").textContent = "Start reading";
    setState("Ready");
    addDiagnostic("recognition-start-error", { name: error?.name ?? "Error" });
    notice("The browser could not start speech recognition. Wait a moment, then tap Start reading again.");
  }
}

function stopListening() {
  if (!S.rec || (!S.listening && !S.starting)) return Promise.resolve();
  return new Promise((resolve) => {
    const recognition = S.rec;
    let settled = false;
    let timeoutId;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve();
    };
    S.stopResolver = finish;
    timeoutId = window.setTimeout(() => {
      if (S.rec === recognition) {
        recognition.onend = null;
        recognition.onerror = null;
        recognition.onresult = null;
        finishSegment();
        S.listening = false;
        S.starting = false;
        S.rec = null;
        $("listen").disabled = false;
        $("listen").textContent = "Start reading";
        addDiagnostic("recognition-stop-timeout", { line: S.line + 1 });
      }
      finish();
    }, 1_200);
    try {
      if (S.listening) recognition.stop();
      else recognition.abort();
    } catch {
      finish();
    }
  });
}

function resetLine() {
  S.activeDurationMs = 0;
  S.finalText = "";
  S.interim = "";
  S.pending = null;
  S.segmentFirstSpeechAt = 0;
  S.segmentLastSpeechAt = 0;
  S.segmentStartedAt = 0;
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
  const pacePass = current.wpm >= S.min && current.wpm <= S.max;
  return {
    accuracy: current.alignment.accuracy,
    accuracyPass,
    attempts: S.tries[S.line],
    correct: current.alignment.matchedCount,
    durationMs: current.durationMs,
    fillerWords: current.alignment.fillerWords,
    forced: force,
    line: S.line,
    missedWords: current.alignment.missedWords,
    pacePass,
    passed: force || (accuracyPass && pacePass),
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
  if (!result.pacePass) details.push(`Estimated pace ${result.wpm || 0} WPM (target ${S.min}-${S.max}).`);
  if (result.missedWords.length) details.push(`Browser may have missed: ${result.missedWords.slice(0, 6).join(", ")}.`);
  details.push("This is an estimate. Retry the line, or accept it if the browser heard you wrong.");
  $("coachTitle").textContent = result.accuracyPass ? "Good words -- adjust the pace." : "Try that line once more.";
  $("coachText").textContent = details.join(" ");
  const alignment = alignTranscript(LINES[S.line], transcript());
  render(alignmentStatuses(alignment, true));
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
  if (S.checking || (!transcript() && !force)) {
    if (!transcript() && !force) notice("Read some of the highlighted line before checking it.");
    return;
  }
  S.checking = true;
  setState("Checking", "warn");
  await stopListening();
  let result;
  if (force && S.pending) result = { ...S.pending, forced: true, passed: true };
  else {
    S.tries[S.line] += 1;
    result = lineResult(force);
    result.attempts = S.tries[S.line];
  }
  S.checking = false;
  addDiagnostic("line-check", {
    acceptedBrowserEstimate: Boolean(result.forced),
    accuracy: result.accuracy,
    line: result.line + 1,
    wpm: result.wpm,
  });
  if (result.passed) advance(result);
  else coach(result);
}

function sessionReport() {
  return {
    appVersion: "phone-test-1",
    capabilities: {
      microphoneApi: Boolean(navigator.mediaDevices?.getUserMedia),
      secureContext: window.isSecureContext,
      speechRecognitionApi: Boolean(SpeechRecognitionApi),
    },
    completedAt: new Date().toISOString(),
    diagnostics: S.diagnostics,
    noRawAudioStored: true,
    page: window.location.href,
    permission: S.permission,
    results: S.results,
    sessionStartedAt: S.sessionStartedAt ? new Date(S.sessionStartedAt).toISOString() : null,
    targets: { accuracy: S.goal, maximumWpm: S.max, minimumWpm: S.min },
    userAgent: navigator.userAgent,
  };
}

function downloadReport(text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `finn-reading-test-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
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
    notice("Phone test report copied. It contains scores and browser diagnostics, never audio.");
  } catch {
    downloadReport(text);
    notice("The browser downloaded the phone test report. It contains scores and diagnostics, never audio.");
  }
}

async function finish() {
  await stopListening();
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
  S.max = Number($("maxWpm").value);
  S.goal = Number($("goal").value);
  if (S.min >= S.max) {
    notice("Minimum pace must be lower than maximum pace.");
    return;
  }
  S.line = 0;
  S.results = [];
  S.tries = Array(LINES.length).fill(0);
  S.sessionStartedAt = Date.now();
  $("target").textContent = `Target: ${S.min}-${S.max} WPM - ${S.goal}% accuracy`;
  show("read");
  resetLine();
  notice("Microphone permission is ready. Tap Start reading separately, then read the highlighted line.");
}

async function requestMicrophonePermission() {
  if (!window.isSecureContext) throw new Error("This test needs the published HTTPS link.");
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser cannot request microphone access.");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
}

$("begin").onclick = async () => {
  const button = $("begin");
  button.disabled = true;
  button.textContent = "Requesting microphone...";
  try {
    if (!SpeechRecognitionApi) {
      throw new Error("Speech recognition is unavailable here. Use Safari on iPhone/iPad or Chrome on Android.");
    }
    await requestMicrophonePermission();
    S.permission = "granted";
    addDiagnostic("microphone-permission", { result: "granted" });
    begin();
  } catch (error) {
    S.permission = error?.name === "NotAllowedError" ? "denied" : "error";
    addDiagnostic("microphone-permission", { name: error?.name ?? "Error", result: S.permission });
    notice(error?.name === "NotAllowedError" ? ERROR_MESSAGES["not-allowed"] : error.message);
  } finally {
    button.disabled = false;
    button.textContent = "Enable microphone";
  }
};

$("listen").onclick = () => (S.listening || S.starting ? stopListening() : startReading());
$("check").onclick = () => checkLine(false);
$("finish").onclick = finish;
$("retry").onclick = () => { resetLine(); startReading(); };
$("accept").onclick = () => checkLine(true);
$("again").onclick = () => { S.line = 0; S.results = []; S.tries = Array(LINES.length).fill(0); S.sessionStartedAt = Date.now(); show("read"); resetLine(); };
$("settings").onclick = async () => { await stopListening(); show("setup"); };
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
checkDevice("speechCheck", Boolean(SpeechRecognitionApi));
$("browserCheck").textContent = navigator.userAgent;
if (!window.isSecureContext) notice("This page must be published over HTTPS before a phone can use its microphone.");
else if (!SpeechRecognitionApi) notice("Use Safari on iPhone/iPad or Chrome on Android for this prototype.");
window.addEventListener("pagehide", () => { try { S.rec?.abort(); } catch { /* no-op */ } });
render();
