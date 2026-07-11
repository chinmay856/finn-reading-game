import assert from "node:assert/strict";
import test from "node:test";
import {
  alignTranscript,
  estimateReadingPace,
  normalizeWord,
  summarizeTokenMatches,
  tokenizeText,
} from "../reading-engine.js";

test("normalizes punctuation and apostrophes", () => {
  assert.equal(normalizeWord("Mary's"), "marys");
  assert.deepEqual(tokenizeText("Hi, Finn!").map((token) => token.normalized), ["hi", "finn"]);
});

test("matches an exact transcript", () => {
  const result = alignTranscript("The locked garden slowly changed her.", "The locked garden slowly changed her");
  assert.equal(result.accuracy, 100);
  assert.equal(result.matchedCount, 6);
  assert.deepEqual(result.missedWords, []);
});

test("ignores fillers and repeated words", () => {
  const result = alignTranscript("The garden slowly changed her.", "Um the garden garden slowly changed her");
  assert.equal(result.accuracy, 100);
  assert.equal(result.fillerWords, 1);
  assert.equal(result.repeatedWords, 1);
});

test("recovers from skipped words and self-correction", () => {
  const result = alignTranscript("The fresh air changed her.", "The air fresh changed her");
  assert.equal(result.selfCorrections, 1);
  assert.equal(result.matchedCount, 5);
  assert.equal(result.accuracy, 100);
});

test("allows a near recognition match for a longer word", () => {
  const result = alignTranscript("The disagreeable child changed.", "The disagreable child changed");
  assert.equal(result.accuracy, 100);
  assert.equal(result.matchedCount, 4);
});

test("keeps unmatched content words understandable", () => {
  const result = alignTranscript("The locked garden changed her.", "The garden changed her");
  assert.ok(result.accuracy < 100);
  assert.deepEqual(result.missedWords, ["locked"]);
});

test("returns theme-neutral reading data", () => {
  const result = alignTranscript("Read this line.", "Read this line");
  assert.equal("stars" in result, false);
  assert.equal("bandwidth" in result, false);
  assert.equal("reward" in result, false);
});

test("forgives natural punctuation pauses when estimating pace", () => {
  const withPunctuation = estimateReadingPace({
    durationMs: 10_000,
    expectedText: "Read this clearly, then stop.",
    wordCount: 10,
  });
  const withoutPunctuation = estimateReadingPace({
    durationMs: 10_000,
    expectedText: "Read this clearly then stop",
    wordCount: 10,
  });
  assert.ok(withPunctuation.pauseAllowanceMs > 0);
  assert.ok(withPunctuation.wpm > withoutPunctuation.wpm);
});

test("does not impose a maximum reading speed", () => {
  const fast = estimateReadingPace({
    durationMs: 2_000,
    expectedText: "One two three four five six seven eight.",
    wordCount: 8,
  });
  assert.ok(fast.wpm >= 240);
});

test("reports reading position separately from matched-word completion", () => {
  const result = alignTranscript(
    "One two three four five six seven eight nine ten.",
    "One two three seven eight nine",
    { lookAhead: 8 },
  );
  assert.ok(result.positionProgress > result.progress);
  assert.equal(result.furthestMatchedTokenIndex, 8);
});

test("aligns an overlapping batch from a known reading position", () => {
  const result = alignTranscript(
    "One two three four five six seven eight nine ten.",
    "five six seven eight",
    { startIndex: 4 },
  );
  assert.deepEqual(result.matchedTokenIndexes, [4, 5, 6, 7]);
  assert.equal(result.positionProgress, 0.8);
});

test("combines matched evidence across independent transcription batches", () => {
  const summary = summarizeTokenMatches("One two three four five.", new Set([0, 1, 3, 4]));
  assert.equal(summary.matchedCount, 4);
  assert.equal(summary.totalCount, 5);
  assert.ok(summary.accuracy >= 75);
});
