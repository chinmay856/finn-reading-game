import { anticipatedLineIndex, EvidenceLockedTracker, tokenize } from "./tracker-core.js";
import { buildFixtureSamples, FIXTURE_DEFINITIONS, fixtureWordsPerMinute } from "./fixture-suite.js";

const SAMPLE_RATE = 16_000;
const FEED_INTERVAL_MS = 80;
const REFERENCE_LINES = Object.freeze([
  "He tells us that at this festive season of the year,",
  "with Christmas and roast beef looming before us,",
  "similes drawn from eating and its results occur",
  "most readily to the mind.",
]);
const REFERENCE = REFERENCE_LINES.join(" ");

const elements = {
  copyButton: document.querySelector("#copyButton"),
  downloadDetail: document.querySelector("#downloadDetail"),
  eventTrace: document.querySelector("#eventTrace"),
  metrics: document.querySelector("#metrics"),
  passage: document.querySelector("#passage"),
  positionLabel: document.querySelector("#positionLabel"),
  runButton: document.querySelector("#runButton"),
  sampleAudio: document.querySelector("#sampleAudio"),
  status: document.querySelector("#status"),
  statusDot: document.querySelector("#statusDot"),
  suiteButton: document.querySelector("#suiteButton"),
  suiteResults: document.querySelector("#suiteResults"),
  transcript: document.querySelector("#transcript"),
};

const words = tokenize(REFERENCE);
const tracker = new EvidenceLockedTracker(REFERENCE);
let runningWordCount = 0;
const lineEndIndexes = [];
const lineElements = REFERENCE_LINES.map((line, lineIndex) => {
  runningWordCount += tokenize(line).length;
  lineEndIndexes.push(runningWordCount - 1);
  const element = document.createElement("div");
  element.className = "reader-line";
  element.dataset.lineIndex = String(lineIndex);
  element.textContent = line;
  elements.passage.append(element);
  return element;
});

let engineReady = false;
let recognizer = null;
let runState = null;
let suiteRunning = false;
let suiteSummaries = [];
const runtimeStartedAt = performance.now();

function setStatus(message, state = "loading") {
  elements.status.textContent = message;
  elements.statusDot.dataset.state = state;
}

function record(type, detail = {}) {
  if (!runState) return;
  const event = { atMs: Math.round(performance.now() - runState.startedAt), type, ...detail };
  runState.events.push(event);
  elements.eventTrace.textContent = JSON.stringify(runState.events, null, 2);
}

function moveCursor(index) {
  const bounded = Math.max(0, Math.min(index, words.length - 1));
  const lineIndex = anticipatedLineIndex({
    confirmedIndex: bounded,
    effectiveWpm: runState?.effectiveWpm,
    lineEndIndexes,
  });
  lineElements.forEach((line, candidateIndex) => {
    line.classList.toggle("complete", candidateIndex < lineIndex);
    line.classList.toggle("current", candidateIndex === lineIndex);
  });
  const target = lineElements[lineIndex];
  target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  elements.positionLabel.textContent = `Guiding line ${lineIndex + 1} of ${lineElements.length} · hidden evidence through word ${bounded + 1}`;
}

function animateAdvance(fromIndex, toIndex) {
  if (toIndex <= fromIndex) return;
  moveCursor(toIndex);
}

function renderMetrics() {
  if (!runState) return;
  const values = {
    "Fixture": runState.fixtureLabel,
    "Effective delivery": `${runState.effectiveWpm} WPM`,
    "Model load": `${Math.round(runState.modelLoadMs)} ms`,
    "Audio duration": runState.audioDurationMs ? `${runState.audioDurationMs} ms` : "—",
    "First partial": runState.firstPartialMs == null ? "—" : `${runState.firstPartialMs} ms`,
    "First line evidence": runState.firstEvidenceMs == null ? "—" : `${runState.firstEvidenceMs} ms`,
    "Partial revisions": String(runState.partialUpdates),
    "Cursor advances": String(runState.cursorAdvances),
    "Longest evidence gap": `${runState.longestEvidenceGapMs} ms`,
    "Decode CPU total": `${Math.round(runState.decodeTotalMs)} ms`,
    "Worst decode block": `${Math.round(runState.worstDecodeMs)} ms`,
    "Final reference coverage": `${runState.finalMatched}/${words.length}`,
  };
  elements.metrics.replaceChildren(...Object.entries(values).flatMap(([label, value]) => {
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value;
    return [term, description];
  }));
}

function processResult(text, isEndpoint = false) {
  const cleaned = String(text ?? "").trim();
  const fullTranscript = [runState.committedTranscript, cleaned].filter(Boolean).join(" ");
  if (!fullTranscript || fullTranscript === runState.lastTranscript) return;
  const now = Math.round(performance.now() - runState.startedAt);
  if (runState.firstPartialMs == null) runState.firstPartialMs = now;
  if (runState.lastEvidenceAtMs != null) {
    runState.longestEvidenceGapMs = Math.max(runState.longestEvidenceGapMs, now - runState.lastEvidenceAtMs);
  }
  runState.lastEvidenceAtMs = now;
  runState.lastTranscript = fullTranscript;
  runState.partialUpdates += 1;
  elements.transcript.textContent = fullTranscript;

  const evidence = tracker.observe(fullTranscript);
  if (evidence.advanced) {
    if (runState.firstEvidenceMs == null) runState.firstEvidenceMs = now;
    runState.cursorAdvances += 1;
    animateAdvance(evidence.previousIndex, evidence.confirmedIndex);
  }
  runState.finalMatched = evidence.matchedCount;
  record("partial", {
    confirmedIndex: evidence.confirmedIndex,
    endpoint: isEndpoint,
    matchedCount: evidence.matchedCount,
    text: cleaned,
  });
  renderMetrics();
}

function decodeAvailable(stream) {
  const started = performance.now();
  let decodes = 0;
  while (recognizer.isReady(stream)) {
    recognizer.decode(stream);
    decodes += 1;
  }
  const elapsed = performance.now() - started;
  runState.decodeTotalMs += elapsed;
  runState.worstDecodeMs = Math.max(runState.worstDecodeMs, elapsed);
  if (decodes) processResult(recognizer.getResult(stream).text, recognizer.isEndpoint(stream));
}

async function decodeFixture() {
  const response = await fetch(elements.sampleAudio.currentSrc || elements.sampleAudio.src);
  if (!response.ok) throw new Error(`Could not load the fixture (${response.status}).`);
  const bytes = await response.arrayBuffer();
  const context = new AudioContext({ sampleRate: SAMPLE_RATE });
  try {
    const buffer = await context.decodeAudioData(bytes.slice(0));
    return new Float32Array(buffer.getChannelData(0));
  } finally {
    await context.close();
  }
}

function renderSuiteResults() {
  if (!suiteSummaries.length) return;
  elements.suiteResults.replaceChildren(...suiteSummaries.map((summary) => {
    const row = document.createElement("tr");
    const values = [
      summary.label,
      String(summary.effectiveWpm),
      `${summary.firstEvidenceMs} ms`,
      `${summary.longestEvidenceGapMs} ms`,
      `${summary.worstDecodeMs} ms`,
      `${summary.finalPosition}/${words.length}`,
      `${summary.finalLine}/${lineElements.length}`,
      `${summary.finalMatched}/${words.length}`,
    ];
    row.replaceChildren(...values.map((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      return cell;
    }));
    return row;
  }));
}

async function runFixture(fixture, baseSamples) {
  if (!engineReady || runState?.running) return null;
  const samples = buildFixtureSamples(baseSamples, fixture, SAMPLE_RATE);
  tracker.reset();
  lineElements.forEach((line) => line.classList.remove("complete", "current"));
  elements.transcript.textContent = "Listening to the local stream…";
  elements.positionLabel.textContent = "Waiting for speech evidence";
  elements.eventTrace.textContent = "[]";
  runState = {
    audioDurationMs: Math.round((samples.length / SAMPLE_RATE) * 1_000),
    committedTranscript: "",
    cursorAdvances: 0,
    decodeTotalMs: 0,
    effectiveWpm: fixtureWordsPerMinute(words.length, samples.length, SAMPLE_RATE),
    events: [],
    finalMatched: 0,
    firstEvidenceMs: null,
    firstPartialMs: null,
    fixtureId: fixture.id,
    fixtureLabel: fixture.label,
    lastEvidenceAtMs: null,
    lastTranscript: "",
    longestEvidenceGapMs: 0,
    modelLoadMs: performance.now() - runtimeStartedAt,
    partialUpdates: 0,
    running: true,
    startedAt: performance.now(),
    worstDecodeMs: 0,
  };
  elements.runButton.disabled = true;
  elements.suiteButton.disabled = true;
  renderMetrics();
  setStatus(`Running ${fixture.label}…`, "running");

  let stream;
  try {
    stream = recognizer.createStream();
    const startedAt = performance.now();
    record("playback-start", { sampleCount: samples.length });

    let fedSamples = 0;
    const replayDeadline = performance.now() + runState.audioDurationMs + 5_000;
    await new Promise((resolve, reject) => {
      const timer = window.setInterval(() => {
        const target = Math.min(samples.length, Math.max(0, Math.floor(((performance.now() - startedAt) / 1_000) * SAMPLE_RATE)));
        if (target > fedSamples) {
          stream.acceptWaveform(SAMPLE_RATE, samples.slice(fedSamples, target));
          fedSamples = target;
          decodeAvailable(stream);
        }
        if (performance.now() > replayDeadline) {
          window.clearInterval(timer);
          reject(new Error("The local replay audio clock stopped before the fixture completed."));
          return;
        }
        if (fedSamples < samples.length) return;
        window.clearInterval(timer);
        resolve();
      }, FEED_INTERVAL_MS);
    });

    stream.inputFinished();
    decodeAvailable(stream);
    processResult(recognizer.getResult(stream).text, true);
    record("playback-complete", { finalTranscript: runState.lastTranscript });
    setStatus(`${fixture.label} complete.`, "ready");
  } catch (error) {
    console.error(error);
    setStatus(error?.message ?? String(error), "error");
    record("error", { message: error?.message ?? String(error) });
  } finally {
    stream?.free();
    runState.running = false;
    if (!suiteRunning) {
      elements.runButton.disabled = false;
      elements.suiteButton.disabled = false;
    }
    renderMetrics();
  }

  return Object.freeze({
    effectiveWpm: runState.effectiveWpm,
    finalMatched: runState.finalMatched,
    finalLine: anticipatedLineIndex({
      confirmedIndex: tracker.confirmedIndex,
      effectiveWpm: runState.effectiveWpm,
      lineEndIndexes,
    }) + 1,
    finalPosition: tracker.confirmedIndex + 1,
    firstEvidenceMs: runState.firstEvidenceMs ?? runState.audioDurationMs,
    id: fixture.id,
    label: fixture.label,
    longestEvidenceGapMs: runState.longestEvidenceGapMs,
    partialUpdates: runState.partialUpdates,
    transcript: runState.lastTranscript,
    worstDecodeMs: Math.round(runState.worstDecodeMs),
  });
}

async function runSample() {
  if (!engineReady || runState?.running || suiteRunning) return;
  const baseSamples = await decodeFixture();
  await runFixture(FIXTURE_DEFINITIONS[0], baseSamples);
}

async function runSuite() {
  if (!engineReady || runState?.running || suiteRunning) return;
  suiteRunning = true;
  suiteSummaries = [];
  elements.runButton.disabled = true;
  elements.suiteButton.disabled = true;
  try {
    const baseSamples = await decodeFixture();
    for (const fixture of FIXTURE_DEFINITIONS) {
      const summary = await runFixture(fixture, baseSamples);
      if (summary) suiteSummaries.push(summary);
      renderSuiteResults();
    }
    setStatus("Tough fixture suite complete.", "ready");
  } finally {
    suiteRunning = false;
    elements.runButton.disabled = false;
    elements.suiteButton.disabled = false;
  }
}

window.addEventListener("sherpa-status", ({ detail }) => {
  const message = String(detail ?? "");
  const match = message.match(/Downloading data\.\.\. \((\d+)\/(\d+)\)/u);
  if (match) {
    const loaded = Number(match[1]) / (1024 * 1024);
    const total = Number(match[2]) / (1024 * 1024);
    setStatus(`Downloading local model… ${Math.round((loaded / total) * 100)}%`);
    elements.downloadDetail.textContent = `${loaded.toFixed(1)} of ${total.toFixed(1)} MB; cached by the browser after first load.`;
  } else if (message) {
    setStatus(message === "Running..." ? "Initializing the local recognizer…" : message);
  }
});

window.addEventListener("sherpa-ready", () => {
  try {
    recognizer = globalThis.createOnlineRecognizer(globalThis.Module);
    engineReady = true;
    elements.runButton.disabled = false;
    elements.suiteButton.disabled = false;
    elements.downloadDetail.textContent = "All recognition runs locally. No audio or transcript is uploaded or retained.";
    setStatus("Local streaming recognizer ready", "ready");
  } catch (error) {
    setStatus(`Recognizer initialization failed: ${error?.message ?? error}`, "error");
  }
});

elements.runButton.addEventListener("click", runSample);
elements.suiteButton.addEventListener("click", runSuite);
elements.copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(elements.eventTrace.textContent);
  elements.copyButton.textContent = "Copied";
  window.setTimeout(() => { elements.copyButton.textContent = "Copy JSON"; }, 1_200);
});

renderMetrics();
