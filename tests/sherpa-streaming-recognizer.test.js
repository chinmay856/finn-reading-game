import assert from "node:assert/strict";
import test from "node:test";

import {
  createSherpaStreamingRecognizer,
  sherpaStreamingRuntimeAvailable,
} from "../speech/sherpa-streaming-recognizer.js";

function mockRuntime() {
  const counters = { recognizerCreations: 0, streamCreations: 0 };
  const recognizer = {
    createStream() {
      counters.streamCreations += 1;
      return {
        acceptWaveform() { this.ready = true; },
        free() { this.freed = true; },
        inputFinished() { this.ready = true; },
        ready: false,
        text: "",
      };
    },
    decode(stream) { stream.ready = false; stream.text = "the quick brown fox"; },
    free() {},
    getResult(stream) { return { text: stream.text }; },
    isReady(stream) { return stream.ready; },
  };
  return {
    counters,
    Module: {},
    createOnlineRecognizer() {
      counters.recognizerCreations += 1;
      return recognizer;
    },
  };
}

test("requires the pinned browser runtime instead of silently substituting an engine", () => {
  assert.equal(sherpaStreamingRuntimeAvailable({}), false);
  assert.throws(() => createSherpaStreamingRecognizer({ runtime: {} }), /not loaded/u);
});

test("warms once and emits local partial evidence through the neutral contract", async () => {
  const runtime = mockRuntime();
  const updates = [];
  const recognizer = createSherpaStreamingRecognizer({ runtime });
  const prepared = recognizer.prepare();
  assert.ok(prepared.warmupMs >= 0);
  recognizer.subscribe((update) => updates.push(update));
  await recognizer.start();
  recognizer.acceptAudio(new Float32Array(320), 16_000);
  await recognizer.stop();
  assert.equal(updates[0].text, "the quick brown fox");
  assert.equal(Object.hasOwn(updates[0], "audio"), false);
  await recognizer.close();
});

test("warms once and reuses one in-memory recognizer across passages", async () => {
  const runtime = mockRuntime();
  const recognizer = createSherpaStreamingRecognizer({ runtime });
  const firstWarmup = recognizer.prepare();
  const secondWarmup = recognizer.prepare();
  assert.deepEqual(secondWarmup, firstWarmup);
  assert.equal(runtime.counters.recognizerCreations, 1);
  assert.equal(runtime.counters.streamCreations, 1);

  await recognizer.start();
  recognizer.acceptAudio(new Float32Array(320), 16_000);
  await recognizer.stop();
  await recognizer.start();
  recognizer.acceptAudio(new Float32Array(320), 16_000);
  await recognizer.stop();

  assert.equal(runtime.counters.recognizerCreations, 1);
  assert.equal(runtime.counters.streamCreations, 3);
  await recognizer.close();
});
