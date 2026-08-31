import assert from "node:assert/strict";
import test from "node:test";

import { ReadingAttemptController } from "../reading-companion/reading-attempt-controller.js";

const lines = [
  "One two three four five six seven eight nine ten.",
  "Eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty.",
];

function harness({ finalTranscript = lines.join(" "), permitCheckpointFallback = true, streaming = null } = {}) {
  let now = 1_000;
  const intervals = new Map();
  let nextInterval = 1;
  const statuses = [];
  const modelStatuses = [];
  const guideEvents = [];
  const results = [];
  const capture = {
    durationMs: 4_000,
    pcmListener: null,
    async cleanup() { this.cleaned = true; },
    async snapshot() { return new Float32Array([0.2]); },
    async start() { this.started = true; },
    async stop() { return { audio: new Float32Array([0.2]), durationMs: 8_000 }; },
    subscribePcm(listener) { this.pcmListener = listener; return () => { this.pcmListener = null; }; },
  };
  const whisper = {
    ready: false,
    async load(device) { this.device = device; this.ready = true; },
    async transcribe() { return finalTranscript; },
    close() { this.closed = true; },
  };
  const controller = new ReadingAttemptController({
    capture,
    clearIntervalFn(id) { intervals.delete(id); },
    lines,
    now: () => now,
    onGuidePosition: (event) => guideEvents.push(event),
    onModelStatus: (event) => modelStatuses.push(event),
    onResult: (event) => results.push(event),
    onStatus: (event) => statuses.push(event),
    passageId: "passage-test",
    permitCheckpointFallback,
    setIntervalFn(callback) { const id = nextInterval++; intervals.set(id, callback); return id; },
    streamingRecognizer: streaming,
    whisper,
  });
  return {
    capture,
    controller,
    guideEvents,
    intervals,
    modelStatuses,
    results,
    setNow(value) { now = value; },
    statuses,
    whisper,
  };
}

test("manual Finish accepts a captured attempt and emits no transcript or audio", async () => {
  const run = harness();
  await run.controller.prepare({ preferStreaming: false });
  await run.controller.start();
  const result = await run.controller.finish();

  assert.equal(result.accepted, true);
  assert.equal(result.confidenceBand.id, "strong");
  assert.equal(result.automaticFinish, false);
  assert.equal(run.results.length, 1);
  assert.equal(Object.hasOwn(result, "transcript"), false);
  assert.equal(Object.hasOwn(result, "audio"), false);
  assert.equal(run.whisper.device, "wasm");
});

test("starting a successful attempt immediately activates the first passage line", async () => {
  const run = harness();
  await run.controller.prepare({ preferStreaming: false });
  await run.controller.start();

  assert.equal(run.guideEvents.length, 1);
  assert.equal(run.guideEvents[0].source, "attempt-start");
  assert.equal(run.guideEvents[0].visibleLineIndex, 0);
  assert.equal(run.guideEvents[0].confirmedWordIndex, -1);
  assert.equal(run.guideEvents[0].matchedWordCount, 0);
  await run.controller.restart();
});

test("opt-in troubleshooting data uses a private diagnostic callback only", async () => {
  const run = harness();
  const diagnostics = [];
  run.controller.retainTroubleshooting = true;
  run.controller.onDiagnostic = (record) => diagnostics.push(record);
  await run.controller.prepare({ preferStreaming: false });
  await run.controller.start();
  const result = await run.controller.finish();

  assert.equal(diagnostics.length, 1);
  assert.ok(diagnostics[0].audio instanceof Float32Array);
  assert.equal(diagnostics[0].transcript, lines.join(" "));
  assert.equal(Object.hasOwn(result, "transcript"), false);
  assert.equal(Object.hasOwn(result, "audio"), false);
});

test("manual Finish still accepts when final Whisper fails", async () => {
  const run = harness();
  run.whisper.transcribe = async () => { throw new Error("worker stopped"); };
  await run.controller.prepare({ preferStreaming: false });
  await run.controller.start();
  const result = await run.controller.finish();

  assert.equal(result.accepted, true);
  assert.equal(result.modelFailed, true);
  assert.equal(result.confidenceBand.id, "unverified");
  assert.equal(result.reason, "model-failed-after-finish");
});

test("endpoint evidence arms and triggers the five-second automatic Finish", async () => {
  const run = harness();
  await run.controller.prepare({ preferStreaming: false });
  await run.controller.start();
  run.controller.observeTranscript(lines.join(" "), { observedAtMs: 1_000, source: "whisper-checkpoint" });
  run.controller.observeTranscript(lines.join(" "), { observedAtMs: 1_000, source: "whisper-checkpoint" });
  assert.equal(run.statuses.at(-1).phase, "auto-finish-armed");

  run.setNow(5_999);
  assert.equal(run.controller.monitorAutoFinish(), false);
  run.setNow(6_000);
  assert.equal(run.controller.monitorAutoFinish(), true);
  while (!run.results.length) await new Promise((resolve) => setImmediate(resolve));
  assert.equal(run.results[0].automaticFinish, true);
});

test("streaming guide failure falls back to Whisper checkpoints", async () => {
  let listener;
  const streaming = {
    prepare() { return { warmupMs: 12 }; },
    subscribe(next) { listener = next; return () => { listener = null; }; },
    async start() {},
    acceptAudio() { throw new Error("stream failed"); },
    async stop() {},
    async close() {},
  };
  const run = harness({ streaming });
  const prepared = await run.controller.prepare();
  assert.equal(prepared.guideMode, "streaming");
  await run.controller.start();
  run.capture.pcmListener(new Float32Array(320), 16_000);
  while (run.controller.streamingActive) await new Promise((resolve) => setImmediate(resolve));

  assert.equal(run.statuses.some(({ phase }) => phase === "streaming-guide-failed"), true);
  assert.equal(run.statuses.some(({ phase }) => phase === "whisper-checkpoint-fallback"), true);
  assert.equal(listener, null);
  await run.controller.finish();
});

test("required streaming guide failure never silently starts Whisper checkpoints", async () => {
  const streaming = {
    prepare() { return { warmupMs: 12 }; },
    subscribe() { return () => {}; },
    async start() { throw new Error("stream failed"); },
    async stop() {},
    async close() {},
  };
  const run = harness({ permitCheckpointFallback: false, streaming });
  const prepared = await run.controller.prepare();
  assert.equal(prepared.guideMode, "streaming");
  await assert.rejects(() => run.controller.start(), /stream failed/u);
  assert.equal(run.statuses.some(({ phase }) => phase === "streaming-guide-failed"), true);
  assert.equal(run.statuses.some(({ phase }) => phase === "whisper-checkpoint-fallback"), false);
});

test("streaming partials emit neutral guide events but final Whisper remains authoritative", async () => {
  let listener;
  const streaming = {
    prepare() { return {}; },
    subscribe(next) { listener = next; return () => { listener = null; }; },
    async start() {}, acceptAudio() {}, async stop() {}, async close() {},
  };
  const run = harness({ finalTranscript: "", streaming });
  await run.controller.prepare();
  await run.controller.start();
  listener({ observedAtMs: 1_500, text: lines.join(" ") });
  assert.ok(run.guideEvents.length > 0);
  assert.equal(Object.hasOwn(run.guideEvents[0], "transcript"), false);

  const result = await run.controller.finish();
  assert.equal(result.confidenceBand.id, "unverified");
  assert.equal(result.matchedWords, 0);
});

test("restart abandons the attempt without emitting a finished result", async () => {
  const run = harness();
  await run.controller.prepare({ preferStreaming: false });
  await run.controller.start();
  const outcome = await run.controller.restart();
  assert.equal(outcome.accepted, false);
  assert.equal(outcome.reason, "attempt-restarted");
  assert.equal(run.results.length, 0);
});

test("microphone failure is not accepted as a completed attempt and cleanup closes resources", async () => {
  const run = harness();
  run.capture.start = async () => { throw new Error("permission denied"); };
  await run.controller.prepare({ preferStreaming: false });
  await assert.rejects(run.controller.start(), /permission denied/u);
  assert.equal(run.results.length, 0);
  assert.equal(run.statuses.at(-1).phase, "microphone-unavailable");
  await run.controller.close();
  assert.equal(run.capture.cleaned, true);
  assert.equal(run.whisper.closed, true);
});
