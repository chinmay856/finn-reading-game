import { EvidenceLockedTracker, tokenize } from "./tracker-core.js";

const SAMPLE_RATE = 16_000;
const FEED_INTERVAL_MS = 80;
const REFERENCE = "He tells us that at this festive season of the year, with Christmas and roast beef looming before us, similes drawn from eating and its results occur most readily to the mind.";

const elements = {
  copyButton: document.querySelector("#copyButton"),
  cursor: document.querySelector("#cursor"),
  downloadDetail: document.querySelector("#downloadDetail"),
  eventTrace: document.querySelector("#eventTrace"),
  metrics: document.querySelector("#metrics"),
  passage: document.querySelector("#passage"),
  positionLabel: document.querySelector("#positionLabel"),
  runButton: document.querySelector("#runButton"),
  sampleAudio: document.querySelector("#sampleAudio"),
  status: document.querySelector("#status"),
  statusDot: document.querySelector("#statusDot"),
  transcript: document.querySelector("#transcript"),
};

const words = tokenize(REFERENCE);
const tracker = new EvidenceLockedTracker(REFERENCE);
const wordElements = words.map((word) => {
  const span = document.createElement("span");
  span.className = "word";
  span.dataset.wordIndex = String(word.index);
  span.textContent = `${word.display} `;
  elements.passage.append(span);
  return span;
});
elements.passage.append(elements.cursor);

let engineReady = false;
let recognizer = null;
let runState = null;
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
  const bounded = Math.max(0, Math.min(index, wordElements.length - 1));
  wordElements.forEach((word, wordIndex) => {
    word.classList.toggle("complete", wordIndex < bounded);
    word.classList.toggle("current", wordIndex === bounded);
  });
  const target = wordElements[bounded];
  const targetRect = target.getBoundingClientRect();
  elements.cursor.style.width = `${targetRect.width}px`;
  elements.cursor.style.height = `${targetRect.height}px`;
  elements.cursor.style.transform = `translate(${target.offsetLeft}px, ${target.offsetTop}px)`;
  elements.cursor.classList.add("visible");
  target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  elements.positionLabel.textContent = `Evidence locked through word ${bounded + 1} of ${words.length}`;
}

function animateAdvance(fromIndex, toIndex) {
  if (toIndex <= fromIndex) return;
  const distance = toIndex - fromIndex;
  const stepMs = Math.max(28, Math.min(75, 280 / distance));
  for (let step = 1; step <= distance; step += 1) {
    window.setTimeout(() => moveCursor(fromIndex + step), step * stepMs);
  }
}

function renderMetrics() {
  if (!runState) return;
  const values = {
    "Model load": `${Math.round(runState.modelLoadMs)} ms`,
    "Audio duration": runState.audioDurationMs ? `${runState.audioDurationMs} ms` : "—",
    "First partial": runState.firstPartialMs == null ? "—" : `${runState.firstPartialMs} ms`,
    "First cursor move": runState.firstEvidenceMs == null ? "—" : `${runState.firstEvidenceMs} ms`,
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
    const samples = new Float32Array(buffer.getChannelData(0));
    runState.audioDurationMs = Math.round((samples.length / SAMPLE_RATE) * 1_000);
    renderMetrics();
    return samples;
  } finally {
    await context.close();
  }
}

async function runSample() {
  if (!engineReady || runState?.running) return;
  tracker.reset();
  elements.cursor.classList.remove("visible");
  wordElements.forEach((word) => word.classList.remove("complete", "current"));
  elements.transcript.textContent = "Listening to the local stream…";
  elements.positionLabel.textContent = "Waiting for speech evidence";
  elements.eventTrace.textContent = "[]";
  runState = {
    audioDurationMs: 0,
    committedTranscript: "",
    cursorAdvances: 0,
    decodeTotalMs: 0,
    events: [],
    finalMatched: 0,
    firstEvidenceMs: null,
    firstPartialMs: null,
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
  setStatus("Replaying the fixed sample through local streaming ASR…", "running");

  let stream;
  try {
    const samples = await decodeFixture();
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
    setStatus("Replay complete. The engine is ready for another identical run.", "ready");
  } catch (error) {
    console.error(error);
    setStatus(error?.message ?? String(error), "error");
    record("error", { message: error?.message ?? String(error) });
  } finally {
    stream?.free();
    runState.running = false;
    elements.runButton.disabled = false;
    renderMetrics();
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
    elements.downloadDetail.textContent = "All recognition runs locally. No audio or transcript is uploaded or retained.";
    setStatus("Local streaming recognizer ready", "ready");
  } catch (error) {
    setStatus(`Recognizer initialization failed: ${error?.message ?? error}`, "error");
  }
});

elements.runButton.addEventListener("click", runSample);
elements.copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(elements.eventTrace.textContent);
  elements.copyButton.textContent = "Copied";
  window.setTimeout(() => { elements.copyButton.textContent = "Copy JSON"; }, 1_200);
});

renderMetrics();
