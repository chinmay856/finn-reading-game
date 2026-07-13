import { alignTranscript } from "./reading-engine.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";
import { buildFixtureSamples, FIXTURE_DEFINITIONS, fixtureWordsPerMinute } from "./prototypes/reading-companion/fixture-suite.js";

const SAMPLE_RATE = 16_000;
const FIXTURE_URL = new URL("./prototypes/reading-companion/assets/1272-128104-0002.flac", import.meta.url).href;
const REFERENCE = [
  "He tells us that at this festive season of the year,",
  "with Christmas and roast beef looming before us,",
  "similes drawn from eating and its results occur",
  "most readily to the mind.",
].join(" ");
const FIXTURES = FIXTURE_DEFINITIONS.filter(({ id }) => ["natural-154", "fast-200", "fast-250"].includes(id));
const $ = (id) => document.getElementById(id);
const recognizer = new LocalWhisperRecognizer({
  onProgress(data = {}) {
    if (data.status !== "progress") return;
    const percent = Number.isFinite(data.progress) ? ` ${Math.round(data.progress)}%` : "";
    $("benchmarkStatus").textContent = `Downloading the local production model${percent}...`;
  },
});

$("referenceText").textContent = REFERENCE;
$("fixtureAudio").src = FIXTURE_URL;

async function decodeFixture() {
  const response = await fetch(FIXTURE_URL);
  if (!response.ok) throw new Error(`Fixture request failed (${response.status}).`);
  const AudioContextApi = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextApi({ sampleRate: SAMPLE_RATE });
  try {
    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    const samples = new Float32Array(buffer.length);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const input = buffer.getChannelData(channel);
      for (let index = 0; index < input.length; index += 1) samples[index] += input[index] / buffer.numberOfChannels;
    }
    return samples;
  } finally {
    await context.close();
  }
}

async function transcribeMeasured(samples) {
  const startedAt = performance.now();
  const text = await recognizer.transcribe(samples.slice());
  const latencyMs = Math.round(performance.now() - startedAt);
  const alignment = alignTranscript(REFERENCE, text, { lookAhead: 40 });
  return { accuracy: alignment.accuracy, latencyMs, matchedWords: alignment.matchedCount, text };
}

async function rollingWindowCheck(samples, { windowMs = 6_000, overlapMs = 1_500 } = {}) {
  const windowSamples = Math.round((windowMs / 1_000) * SAMPLE_RATE);
  const stepSamples = Math.round(((windowMs - overlapMs) / 1_000) * SAMPLE_RATE);
  const chunks = [];
  for (let start = 0; start < samples.length; start += stepSamples) {
    const audio = samples.slice(start, Math.min(samples.length, start + windowSamples));
    if (audio.length < SAMPLE_RATE) break;
    const result = await transcribeMeasured(audio);
    chunks.push({
      audioStartMs: Math.round((start / SAMPLE_RATE) * 1_000),
      audioWindowMs: Math.round((audio.length / SAMPLE_RATE) * 1_000),
      ...result,
    });
    if (start + windowSamples >= samples.length) break;
  }
  return chunks;
}

async function run() {
  $("runBenchmark").disabled = true;
  const startedAt = performance.now();
  try {
    $("benchmarkStatus").textContent = "Loading the production Whisper model locally...";
    const samples = await decodeFixture();
    const device = await recognizer.load("wasm");
    const modelLoadMs = Math.round(performance.now() - startedAt);
    const fixtures = [];
    for (const fixture of FIXTURES) {
      const audio = buildFixtureSamples(samples, fixture, SAMPLE_RATE);
      $("benchmarkStatus").textContent = `Transcribing ${fixture.label} locally...`;
      fixtures.push({
        fixture: fixture.id,
        effectiveWpm: fixtureWordsPerMinute(32, audio.length, SAMPLE_RATE),
        ...(await transcribeMeasured(audio)),
      });
    }
    $("benchmarkStatus").textContent = "Testing rolling six-second windows locally...";
    const rollingWindows = await rollingWindowCheck(samples);
    const result = { device, modelLoadMs, fixtures, rollingWindows };
    $("benchmarkResults").textContent = JSON.stringify(result, null, 2);
    $("benchmarkStatus").textContent = "Benchmark complete. Nothing was uploaded or saved.";
    $("benchmarkStatus").className = "benchmark-status ready";
  } catch (error) {
    $("benchmarkStatus").textContent = `Benchmark failed: ${error.message}`;
    $("benchmarkStatus").className = "benchmark-status error";
  } finally {
    $("runBenchmark").disabled = false;
  }
}

$("runBenchmark").addEventListener("click", run);
window.addEventListener("pagehide", () => recognizer.close());
