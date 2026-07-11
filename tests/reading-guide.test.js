import assert from "node:assert/strict";
import test from "node:test";
import {
  approachScrollTop,
  centeredGuideScrollTop,
  estimateGuideProgress,
  estimateGuideWordIndex,
  guideScrollTop,
} from "../reading-guide.js";

test("supports a 250 WPM predictive guide", () => {
  const progress = estimateGuideProgress({
    activeSpeechMs: 24_000,
    leadWords: 12,
    totalWords: 220,
    wordsPerMinute: 250,
  });
  assert.equal(progress, 112 / 220);
});

test("voice pauses do not advance active-speech progress", () => {
  const before = estimateGuideProgress({ activeSpeechMs: 10_000, totalWords: 100, wordsPerMinute: 200 });
  const afterPause = estimateGuideProgress({ activeSpeechMs: 10_000, totalWords: 100, wordsPerMinute: 200 });
  assert.equal(afterPause, before);
});

test("maps guide progress into the available scroll range", () => {
  assert.equal(guideScrollTop({ progress: 0.5, scrollHeight: 1_000, viewportHeight: 400 }), 300);
  assert.equal(guideScrollTop({ progress: 2, scrollHeight: 1_000, viewportHeight: 400 }), 600);
});

test("estimates the word position at 250 WPM", () => {
  assert.equal(estimateGuideWordIndex({ activeSpeechMs: 10_000, totalWords: 220, wordsPerMinute: 250 }), 41);
  assert.equal(estimateGuideWordIndex({ activeSpeechMs: 12_000, totalWords: 220, wordsPerMinute: 250 }), 50);
});

test("centers ordinary words but clamps at the real document bottom", () => {
  assert.equal(centeredGuideScrollTop({ maximumScrollTop: 700, viewportHeight: 400, wordHeight: 20, wordOffsetTop: 500 }), 310);
  assert.equal(centeredGuideScrollTop({ maximumScrollTop: 700, viewportHeight: 400, wordHeight: 20, wordOffsetTop: 1_000 }), 700);
});

test("eases into a new segment instead of jumping an entire viewport", () => {
  assert.equal(approachScrollTop(0, 300), 32);
  assert.equal(approachScrollTop(288, 300), 300);
});
