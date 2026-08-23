import { alignTranscript } from "./reading-engine.js";
import { evaluateFinishedAttempt } from "./reading-attempt-evaluation.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";

const SAMPLE_RATE = 16_000;
const REFERENCE = [
  "He tells us that at this festive season of the year,",
  "with Christmas and roast beef looming before us,",
  "similes drawn from eating and its results occur",
  "most readily to the mind.",
].join(" ");
const TOTAL_WORDS = 32;
const $ = (id) => document.getElementById(id);
const recognizer = new LocalWhisperRecognizer({
  onProgress(data = {}) {
    if (data.status !== "progress") return;
    const percent = Number.isFinite(data.progress) ? ` ${Math.round(data.progress)}%` : "";
    $("benchmarkStatus").textContent = `Downloading the local production model${percent}...`;
  },
});

$("referenceText").textContent = REFERENCE;

function updateReadyState() {
  const ready = $("referenceAudio").files.length === 1 && $("unrelatedAudio").files.length === 1;
  $("runBenchmark").disabled = !ready;
  $("benchmarkStatus").textContent = ready ? "Fixtures ready. The first model load may take up to two minutes." : "Choose both local audio fixtures.";
}

async function decodeFile(file) {
  const AudioContextApi = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextApi({ sampleRate: SAMPLE_RATE });
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    const samples = new Float32Array(buffer.length);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const input = buffer.getChannelData(channel);
      for (let index = 0; index < buffer.length; index += 1) samples[index] += input[index] / buffer.numberOfChannels;
    }
    return samples;
  } finally {
    await context.close();
  }
}

function sliceSeconds(samples, startSeconds, endSeconds) {
  return samples.slice(Math.round(startSeconds * SAMPLE_RATE), Math.min(samples.length, Math.round(endSeconds * SAMPLE_RATE)));
}

async function measureCase(id, samples) {
  const startedAt = performance.now();
  const transcript = samples.length ? await recognizer.transcribe(samples.slice()) : "";
  const latencyMs = Math.round(performance.now() - startedAt);
  const alignment = alignTranscript(REFERENCE, transcript, { lookAhead: 40 });
  return Object.freeze({
    id,
    audioMs: Math.round((samples.length / SAMPLE_RATE) * 1_000),
    latencyMs,
    transcript,
    alignment: Object.freeze({
      accuracy: alignment.accuracy,
      matchedWords: alignment.matchedCount,
      positionPercent: Math.round(alignment.positionProgress * 100),
      unalignedWords: alignment.unalignedWords,
    }),
    outcome: evaluateFinishedAttempt({
      captureStarted: true,
      finishRequested: true,
      matchedWords: alignment.matchedCount,
      positionProgress: alignment.positionProgress,
      spokenWords: alignment.spokenWordCount,
      totalWords: TOTAL_WORDS,
      transcript,
      unalignedWords: alignment.unalignedWords,
    }),
  });
}

async function run() {
  $("runBenchmark").disabled = true;
  const loadStartedAt = performance.now();
  try {
    const [referenceSamples, unrelatedSamples] = await Promise.all([
      decodeFile($("referenceAudio").files[0]),
      decodeFile($("unrelatedAudio").files[0]),
    ]);
    $("benchmarkStatus").textContent = "Loading the production Whisper model locally...";
    const device = await recognizer.load("wasm");
    const modelLoadMs = Math.round(performance.now() - loadStartedAt);
    const durationSeconds = referenceSamples.length / SAMPLE_RATE;
    const definitions = [
      ["silence", new Float32Array()],
      ["one-or-two-words", sliceSeconds(referenceSamples, 0, Math.min(0.9, durationSeconds))],
      ["beginning-only", sliceSeconds(referenceSamples, 0, Math.min(3.2, durationSeconds))],
      ["ending-only", sliceSeconds(referenceSamples, Math.max(0, durationSeconds - 2.4), durationSeconds)],
      ["unrelated-speech", unrelatedSamples],
      ["complete", referenceSamples],
    ];
    const cases = [];
    for (const [id, samples] of definitions) {
      $("benchmarkStatus").textContent = `Running ${id} locally...`;
      cases.push(await measureCase(id, samples));
    }
    const result = Object.freeze({ device, modelLoadMs, referenceAudioMs: Math.round(durationSeconds * 1_000), cases });
    $("benchmarkResults").textContent = JSON.stringify(result, null, 2);
    globalThis.__READING_ACCEPTANCE_BASELINE__ = result;
    $("benchmarkStatus").textContent = "Baseline complete. Nothing was uploaded or saved.";
    $("benchmarkStatus").className = "benchmark-status ready";
  } catch (error) {
    $("benchmarkStatus").textContent = `Benchmark failed: ${error.message}`;
    $("benchmarkStatus").className = "benchmark-status error";
  } finally {
    $("runBenchmark").disabled = false;
  }
}

$("referenceAudio").addEventListener("change", updateReadyState);
$("unrelatedAudio").addEventListener("change", updateReadyState);
$("runBenchmark").addEventListener("click", run);
window.addEventListener("pagehide", () => recognizer.close());
