import assert from "node:assert/strict";
import test from "node:test";
import { estimateGuideProgress, guideScrollTop } from "../reading-guide.js";

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
