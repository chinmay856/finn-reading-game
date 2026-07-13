import assert from "node:assert/strict";
import test from "node:test";

import {
  addDeterministicNoise,
  buildFixtureSamples,
  changeSpeed,
  FIXTURE_DEFINITIONS,
  fixtureWordsPerMinute,
  insertSilence,
  repeatSegment,
} from "./fixture-suite.js";

const samples = Float32Array.from({ length: 16_000 }, (_, index) => Math.sin(index / 20) * 0.1);

test("fixture suite covers natural, fast, pause, noise, and restart cases", () => {
  assert.deepEqual(FIXTURE_DEFINITIONS.map(({ kind }) => kind), [
    "identity", "speed", "speed", "pause", "noise", "repeat",
  ]);
});

test("speed fixtures shorten audio to their requested delivery factor", () => {
  assert.equal(changeSpeed(samples, 2).length, 8_000);
  assert.equal(fixtureWordsPerMinute(4, 8_000), 480);
});

test("pause and restart fixtures preserve every original sample", () => {
  assert.equal(insertSilence(samples, 16_000, 1_500).length, 40_000);
  assert.equal(repeatSegment(samples, 16_000, 100, 300).length, 19_200);
});

test("noise fixture is deterministic and length preserving", () => {
  const first = addDeterministicNoise(samples);
  const second = addDeterministicNoise(samples);
  assert.equal(first.length, samples.length);
  assert.deepEqual(first, second);
  assert.notDeepEqual(first, samples);
});

test("every declared fixture produces a non-empty audio buffer", () => {
  for (const fixture of FIXTURE_DEFINITIONS) {
    assert.ok(buildFixtureSamples(samples, fixture).length > 0, fixture.id);
  }
});
