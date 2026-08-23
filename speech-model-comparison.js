import { alignTranscript, tokenizeText } from "./reading-engine.js";
import { evaluateFinishedAttempt, summarizeGuideTrace } from "./reading-attempt-evaluation.js";
import { KnownTextLineGuide } from "./reading-companion/known-text-line-guide.js";
import { loadPinnedSherpaRuntime, PINNED_SHERPA_VERSION } from "./speech/sherpa-runtime-loader.js";
import { createSherpaStreamingRecognizer } from "./speech/sherpa-streaming-recognizer.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";
import { READING_ENGINE_PLAYTEST, READING_ENGINE_PLAYTEST_TEXT } from "./content/reading-engine-playtest.js";

const SAMPLE_RATE = 16_000;
const FRAME_SAMPLES = 320;
const REFERENCE = READING_ENGINE_PLAYTEST_TEXT;
const TOTAL_WORDS = tokenizeText(REFERENCE).length;
const $ = (id) => document.getElementById(id);
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function percentile(values, quantile) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * quantile))];
}

function readyState() {
  const ready = ["referenceAudio", "twoWordAudio", "endingAudio", "unrelatedAudio"]
    .every((id) => $(id).files.length === 1);
  $("run").disabled = !ready;
  $("status").textContent = ready
    ? "Fixtures ready. A full real-time comparison takes about two minutes after model loading."
    : "Choose both local audio fixtures.";
}

async function decodeFile(file) {
  const AudioContextApi = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextApi({ sampleRate: SAMPLE_RATE });
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    const output = new Float32Array(buffer.length);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const input = buffer.getChannelData(channel);
      for (let index = 0; index < output.length; index += 1) output[index] += input[index] / buffer.numberOfChannels;
    }
    return output;
  } finally {
    await context.close();
  }
}

function sliceSeconds(samples, startSeconds, endSeconds) {
  return samples.slice(
    Math.round(startSeconds * SAMPLE_RATE),
    Math.min(samples.length, Math.round(endSeconds * SAMPLE_RATE)),
  );
}

function buildCases(reference, twoWords, ending, unrelated) {
  const duration = reference.length / SAMPLE_RATE;
  return [
    ["silence", new Float32Array()],
    ["first-two-words", twoWords],
    ["beginning-only", sliceSeconds(reference, 0, Math.min(3.2, duration))],
    ["ending-only", ending],
    ["unrelated-speech", unrelated],
    ["complete", reference],
  ];
}

function summarizeEvidence(transcript, modelFailed = false) {
  const alignment = alignTranscript(REFERENCE, transcript, { lookAhead: 40 });
  return {
    transcript,
    alignment: {
      accuracy: alignment.accuracy,
      matchedWords: alignment.matchedCount,
      matchedTokenIndexes: alignment.matchedTokenIndexes,
      positionPercent: Math.round(alignment.positionProgress * 100),
      unalignedWords: alignment.unalignedWords,
    },
    outcome: evaluateFinishedAttempt({
      captureStarted: true,
      finishRequested: true,
      matchedWords: alignment.matchedCount,
      matchedTokenIndexes: alignment.matchedTokenIndexes,
      modelFailed,
      positionProgress: alignment.positionProgress,
      spokenWords: alignment.spokenWordCount,
      totalWords: TOTAL_WORDS,
      transcript,
      unalignedWords: alignment.unalignedWords,
    }),
  };
}

function guideTrace(updates, startedAt) {
  const guide = new KnownTextLineGuide({
    lines: READING_ENGINE_PLAYTEST.lines,
    passageId: READING_ENGINE_PLAYTEST.id,
    wordsPerMinute: 158,
  });
  const events = [];
  for (const update of updates) {
    const event = guide.observePartial(update.text, update.observedAtMs);
    events.push({
      observedAtMs: Math.round(update.observedAtMs - startedAt),
      visibleLineIndex: event.visibleLineIndex,
    });
  }
  return { confirmedWords: guide.confirmedWordIndex + 1, ...summarizeGuideTrace(events) };
}

async function feedAtRealTime(recognizer, audio) {
  const startedAt = performance.now();
  const decodeBlocks = [];
  const scheduleDrifts = [];
  for (let offset = 0; offset < audio.length; offset += FRAME_SAMPLES) {
    const targetAt = startedAt + ((offset / SAMPLE_RATE) * 1_000);
    const remaining = targetAt - performance.now();
    if (remaining > 0) await wait(remaining);
    scheduleDrifts.push(Math.max(0, performance.now() - targetAt));
    const decodeStartedAt = performance.now();
    recognizer.acceptAudio(audio.slice(offset, offset + FRAME_SAMPLES), SAMPLE_RATE);
    decodeBlocks.push(performance.now() - decodeStartedAt);
  }
  return {
    startedAt,
    maximumDecodeBlockMs: Number(Math.max(0, ...decodeBlocks).toFixed(1)),
    p95DecodeBlockMs: Number(percentile(decodeBlocks, 0.95).toFixed(1)),
    maximumScheduleDriftMs: Number(Math.max(0, ...scheduleDrifts).toFixed(1)),
  };
}

async function runSherpa(cases) {
  const loadStartedAt = performance.now();
  await loadPinnedSherpaRuntime({ runtime: globalThis });
  const loadMs = Math.round(performance.now() - loadStartedAt);
  const recognizer = createSherpaStreamingRecognizer({ runtime: globalThis });
  const warmupMs = recognizer.prepare().warmupMs;
  const results = [];
  try {
    for (const [id, audio] of cases) {
      $("status").textContent = `Sherpa real-time replay: ${id}…`;
      const updates = [];
      const unsubscribe = recognizer.subscribe((update) => updates.push(update));
      await recognizer.start();
      const playback = await feedAtRealTime(recognizer, audio);
      await recognizer.stop();
      unsubscribe();
      const transcript = updates.at(-1)?.text ?? "";
      results.push({
        id,
        audioMs: Math.round((audio.length / SAMPLE_RATE) * 1_000),
        wallMs: Math.round(performance.now() - playback.startedAt),
        maximumDecodeBlockMs: playback.maximumDecodeBlockMs,
        p95DecodeBlockMs: playback.p95DecodeBlockMs,
        maximumScheduleDriftMs: playback.maximumScheduleDriftMs,
        updateCount: updates.length,
        guide: guideTrace(updates, playback.startedAt),
        ...summarizeEvidence(transcript),
      });
    }
  } finally {
    await recognizer.close();
  }
  return { version: PINNED_SHERPA_VERSION, loadMs, warmupMs, cases: results };
}

async function runWhisper(cases) {
  const recognizer = new LocalWhisperRecognizer();
  try {
    const loadStartedAt = performance.now();
    await recognizer.load("wasm");
    const loadMs = Math.round(performance.now() - loadStartedAt);
    const results = [];
    for (const [id, audio] of cases) {
      $("status").textContent = `Whisper final scoring: ${id}…`;
      const startedAt = performance.now();
      const transcript = audio.length ? await recognizer.transcribe(audio.slice()) : "";
      results.push({
        id,
        audioMs: Math.round((audio.length / SAMPLE_RATE) * 1_000),
        decodeMs: Math.round(performance.now() - startedAt),
        ...summarizeEvidence(transcript),
      });
    }
    return { model: "onnx-community/whisper-base_timestamped", device: "wasm", loadMs, cases: results };
  } finally {
    recognizer.close();
  }
}

async function run() {
  $("run").disabled = true;
  try {
    if (globalThis.crossOriginIsolated !== true) throw new Error("Sherpa comparison requires a cross-origin-isolated local preview.");
    $("status").textContent = "Decoding both local fixtures…";
    const [reference, twoWords, ending, unrelated] = await Promise.all([
      decodeFile($("referenceAudio").files[0]),
      decodeFile($("twoWordAudio").files[0]),
      decodeFile($("endingAudio").files[0]),
      decodeFile($("unrelatedAudio").files[0]),
    ]);
    const cases = buildCases(reference, twoWords, ending, unrelated);
    const heapBefore = performance.memory?.usedJSHeapSize ?? null;
    const sherpa = await runSherpa(cases);
    const heapAfterSherpa = performance.memory?.usedJSHeapSize ?? null;
    const whisper = await runWhisper(cases);
    const heapAfterWhisper = performance.memory?.usedJSHeapSize ?? null;
    const result = { heapBefore, heapAfterSherpa, heapAfterWhisper, sherpa, whisper };
    $("results").textContent = JSON.stringify(result, null, 2);
    globalThis.__SPEECH_MODEL_COMPARISON__ = result;
    $("status").textContent = "Comparison complete. Nothing was uploaded or saved.";
  } catch (error) {
    $("status").textContent = `Comparison failed: ${error.message}`;
  } finally {
    $("run").disabled = false;
  }
}

$("referenceAudio").addEventListener("change", readyState);
$("twoWordAudio").addEventListener("change", readyState);
$("endingAudio").addEventListener("change", readyState);
$("unrelatedAudio").addEventListener("change", readyState);
$("run").addEventListener("click", run);
