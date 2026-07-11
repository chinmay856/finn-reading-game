import { EVIDENCE_PASSAGE } from "./content/evidence-passage.js";
import { alignTranscript, tokenizeText } from "./reading-engine.js";

const $ = (id) => document.getElementById(id);
const passageText = EVIDENCE_PASSAGE.paragraphs.join(" ");
const totalWords = tokenizeText(passageText).length;
const loadStartedAt = performance.now();
const worker = new Worker(new URL("./speech/moonshine-benchmark-worker.js", import.meta.url), { type: "module" });
let audioContext;
let source;
let stream;
let worklet;
let sessionStartedAt = 0;
let firstOutputAt = 0;
let stopRequestedAt = 0;
let device = "detecting";
let transcriptParts = [];
let segmentLatencies = [];

for (const paragraph of EVIDENCE_PASSAGE.paragraphs) {
  const element = document.createElement("p");
  element.textContent = paragraph;
  $("benchmarkPassage").append(element);
}
$("wordTotal").textContent = `${totalWords} words`;

function formatSeconds(milliseconds) {
  return `${(milliseconds / 1_000).toFixed(1)}s`;
}

function updateTranscript() {
  const transcript = transcriptParts.join(" ").trim();
  const alignment = alignTranscript(passageText, transcript, { lookAhead: 12 });
  $("liveTranscript").textContent = transcript || "No transcript segments yet.";
  $("accuracy").textContent = `${alignment.accuracy}%`;
  $("confirmed").textContent = `${alignment.matchedCount}/${totalWords}`;
  $("position").textContent = `${Math.round(alignment.positionProgress * 100)}%`;
}

async function stopAudio() {
  worklet?.disconnect();
  source?.disconnect();
  stream?.getTracks().forEach((track) => track.stop());
  if (audioContext && audioContext.state !== "closed") await audioContext.close();
  worklet = null;
  source = null;
  stream = null;
  audioContext = null;
}

async function startReading() {
  $("startBenchmark").disabled = true;
  $("finishBenchmark").disabled = false;
  transcriptParts = [];
  segmentLatencies = [];
  firstOutputAt = 0;
  stopRequestedAt = 0;
  updateTranscript();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, autoGainControl: true, noiseSuppression: true, sampleRate: 16_000 },
    });
    const AudioContextApi = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextApi({ sampleRate: 16_000, latencyHint: "interactive" });
    await audioContext.audioWorklet.addModule(new URL("./speech/moonshine-processor.js", import.meta.url));
    source = audioContext.createMediaStreamSource(stream);
    worklet = new AudioWorkletNode(audioContext, "moonshine-vad-processor", {
      numberOfInputs: 1, numberOfOutputs: 0, channelCount: 1,
      channelCountMode: "explicit", channelInterpretation: "discrete",
    });
    worklet.port.onmessage = ({ data }) => worker.postMessage({ type: "audio", buffer: data.buffer }, [data.buffer.buffer]);
    source.connect(worklet);
    sessionStartedAt = Date.now();
    $("runStatus").textContent = "Listening continuously. Read at your natural fast pace; Moonshine will emit a segment after about 400 ms of silence.";
    $("runStatus").className = "benchmark-status active";
  } catch (error) {
    await stopAudio();
    $("runStatus").textContent = `Microphone could not start: ${error.message}`;
    $("runStatus").className = "benchmark-status error";
    $("startBenchmark").disabled = false;
    $("finishBenchmark").disabled = true;
  }
}

async function finishReading() {
  $("finishBenchmark").disabled = true;
  stopRequestedAt = Date.now();
  await stopAudio();
  $("runStatus").textContent = "Finishing only the last local segment...";
  worker.postMessage({ type: "flush" });
}

worker.addEventListener("message", ({ data }) => {
  if (data.type === "loading") {
    device = data.device;
    $("loadStatus").textContent = data.message;
  } else if (data.type === "progress" && data.data?.status === "progress") {
    const percent = Number.isFinite(data.data.progress) ? ` ${Math.round(data.data.progress)}%` : "";
    $("loadStatus").textContent = `Downloading local model files${percent} · ${formatSeconds(performance.now() - loadStartedAt)}`;
  } else if (data.type === "ready") {
    device = data.device;
    $("loadStatus").textContent = `Ready on ${device.toUpperCase()} after ${formatSeconds(performance.now() - loadStartedAt)}. Model files are cached for later visits.`;
    $("startBenchmark").disabled = false;
  } else if (data.type === "speech_start") {
    $("segmentStatus").textContent = "Speech detected";
  } else if (data.type === "transcribing") {
    $("segmentStatus").textContent = `Transcribing segment ${data.id} locally...`;
  } else if (data.type === "output") {
    if (!firstOutputAt) firstOutputAt = data.completedAt;
    if (data.text) transcriptParts.push(data.text);
    const latency = Math.max(0, data.completedAt - data.end);
    segmentLatencies.push(latency);
    $("segmentStatus").textContent = `Segment ${data.id}: ${formatSeconds(latency)} after speech ended`;
    updateTranscript();
  } else if (data.type === "flushed") {
    const sorted = [...segmentLatencies].sort((a, b) => a - b);
    const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
    const worst = sorted.at(-1) ?? 0;
    $("firstResult").textContent = firstOutputAt ? formatSeconds(firstOutputAt - sessionStartedAt) : "—";
    $("medianLatency").textContent = sorted.length ? formatSeconds(median) : "—";
    $("worstLatency").textContent = sorted.length ? formatSeconds(worst) : "—";
    $("finishLatency").textContent = stopRequestedAt ? formatSeconds(Date.now() - stopRequestedAt) : "—";
    $("runStatus").textContent = "Moonshine comparison complete. These results stayed in this browser tab.";
    $("runStatus").className = "benchmark-status ready";
    $("startBenchmark").disabled = false;
  } else if (data.type === "error") {
    $("loadStatus").textContent = `Moonshine error on ${device}: ${data.message}`;
    $("runStatus").className = "benchmark-status error";
  }
});

worker.addEventListener("error", (event) => {
  $("loadStatus").textContent = `Moonshine worker failed: ${event.message}`;
});
$("startBenchmark").addEventListener("click", startReading);
$("finishBenchmark").addEventListener("click", finishReading);
