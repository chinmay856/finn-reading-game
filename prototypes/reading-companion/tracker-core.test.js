import test from "node:test";
import assert from "node:assert/strict";

import { alignKnownText, EvidenceLockedTracker, tokenize } from "./tracker-core.js";

const reference = "The quick brown fox jumps over the lazy dog.";

test("tokenizes display text without losing stable indexes", () => {
  assert.deepEqual(tokenize("Finn's fast-reading test.").map(({ normalized }) => normalized), [
    "finns", "fast", "reading", "test",
  ]);
});

test("aligns imperfect partial transcripts to known text", () => {
  const result = alignKnownText(reference, "the quick brown box jumps over");
  assert.equal(result.furthestMatchedIndex, 5);
  assert.ok(result.matchedCount >= 5);
});

test("a short live partial aligns to the passage prefix, not unseen trailing words", () => {
  const result = alignKnownText(
    "He tells us that at this festive season of the year",
    "he tells us",
  );
  assert.equal(result.furthestMatchedIndex, 2);
  assert.deepEqual(result.matchedIndexes, [0, 1, 2]);
});

test("evidence cursor never moves backward when a partial is revised", () => {
  const tracker = new EvidenceLockedTracker(reference);
  assert.equal(tracker.observe("the quick brown fox").confirmedIndex, 3);
  assert.equal(tracker.observe("the quick crown").confirmedIndex, 3);
});

test("a recognizer cannot jump beyond the amount of spoken evidence", () => {
  const tracker = new EvidenceLockedTracker("one two three four five six seven eight nine ten");
  const result = tracker.observe("one ten");
  assert.ok(result.confirmedIndex <= 3);
});
