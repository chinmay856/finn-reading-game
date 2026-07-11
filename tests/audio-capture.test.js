import assert from "node:assert/strict";
import test from "node:test";
import { summarizeSignal, trimSilence } from "../speech/audio-capture.js";
import { DEFAULT_SPEECH_DEVICE } from "../speech/local-whisper-recognizer.js";

test("uses the proven WebAssembly speech path by default", () => {
  assert.equal(DEFAULT_SPEECH_DEVICE, "wasm");
});

test("drops silent microphone input instead of sending it to Whisper", () => {
  const silent = new Float32Array(16_000 * 3);
  assert.equal(trimSilence(silent).length, 0);
});

test("keeps audible speech-like input with a small timing pad", () => {
  const audio = new Float32Array(16_000 * 3);
  for (let index = 8_000; index < 24_000; index += 1) {
    audio[index] = Math.sin(index / 8) * 0.05;
  }
  const trimmed = trimSilence(audio);
  assert.ok(trimmed.length >= 16_000);
  assert.ok(trimmed.length < audio.length);
});

test("summarizes signal without retaining audio", () => {
  const audio = new Float32Array(16_000);
  for (let index = 0; index < audio.length; index += 1) audio[index] = Math.sin(index / 8) * 0.05;
  const summary = summarizeSignal(audio);
  assert.deepEqual(Object.keys(summary), ["activeFrameRatio", "peak", "rms"]);
  assert.ok(summary.activeFrameRatio > 0.9);
  assert.equal(summary.peak, 0.05);
  assert.ok(summary.rms > 0.03);
});
