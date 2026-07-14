import assert from "node:assert/strict";
import test from "node:test";

import {
  resampleMonoPcm,
  STREAMING_FRAME_SAMPLES,
  StreamingPcmFramer,
} from "../speech/streaming-pcm.js";

test("resamples browser PCM to the proven 16 kHz input", () => {
  const input = new Float32Array(960).map((_, index) => Math.sin(index / 20));
  assert.equal(resampleMonoPcm(input, 48_000).length, 320);
});

test("emits exact 20 ms frames and retains only the unfinished tail", () => {
  const frames = [];
  const framer = new StreamingPcmFramer({ onFrame: (frame, sampleRate) => frames.push({ frame, sampleRate }) });
  assert.equal(framer.push(new Float32Array(640), 16_000), 2);
  assert.equal(frames.length, 2);
  assert.equal(frames[0].frame.length, STREAMING_FRAME_SAMPLES);
  assert.equal(frames[0].sampleRate, 16_000);
  assert.equal(framer.pending.length, 0);
});

test("preserves 20 ms cadence across small 48 kHz browser callbacks", () => {
  const frames = [];
  const framer = new StreamingPcmFramer({ onFrame: (frame) => frames.push(frame) });
  framer.push(new Float32Array(256), 48_000);
  framer.push(new Float32Array(256), 48_000);
  framer.push(new Float32Array(448), 48_000);
  assert.equal(frames.length, 1);
  assert.equal(frames[0].length, 320);
  assert.equal(framer.pending.length, 0);
});
