import test from "node:test";
import assert from "node:assert/strict";
import { alignTranscript, normalizeWord, ReadAloudSession, tokenizeText } from "../packages/reading-engine/index.js";

const passage = { id: "test", text: "The cloud is definitely not on fire." };

test("normalizes punctuation and apostrophes", () => {
  assert.equal(normalizeWord("Cloud’s"), "clouds");
  assert.deepEqual(tokenizeText("Hi, Finn!").map((token) => token.normalized), ["hi", "finn"]);
});

test("aligns an exact transcript to completion", () => {
  const tokens = tokenizeText(passage.text);
  const alignment = alignTranscript(tokens, passage.text);
  assert.equal(alignment.completed, true);
  assert.equal(alignment.progress, 1);
  assert.equal(alignment.accuracyEstimate, 1);
});

test("tolerates fillers and repeated words", () => {
  const tokens = tokenizeText(passage.text);
  const alignment = alignTranscript(tokens, "Um the cloud cloud is definitely not on fire");
  assert.equal(alignment.completed, true);
  assert.equal(alignment.repeatedWords, 1);
  assert.equal(alignment.accuracyEstimate, 1);
});

test("looks ahead after a skipped word without losing the passage", () => {
  const tokens = tokenizeText(passage.text);
  const alignment = alignTranscript(tokens, "The cloud definitely not on fire");
  assert.equal(alignment.completed, true);
  assert.ok(alignment.challengingTokenIndexes.includes(2));
});

test("produces theme-neutral reading results", () => {
  const session = new ReadAloudSession(passage, { startedAt: 0 });
  session.updateTranscript(passage.text);
  const result = session.finish({ endedAt: 30_000 });
  assert.equal(result.completed, true);
  assert.equal(result.wordsPerMinute, 14);
  assert.equal("bandwidthEarned" in result, false);
});
