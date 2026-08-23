import assert from "node:assert/strict";
import test from "node:test";

import {
  describeReadingCoverage,
  describeReadingPace,
  evaluateFinishedAttempt,
  shouldAutoFinishAttempt,
  summarizeGuideTrace,
} from "../reading-attempt-evaluation.js";

const REFERENCE_WORDS = 32;

test("player-facing performance uses broad evidence bands instead of fake precision", () => {
  assert.equal(describeReadingCoverage(0.96).band, "Strong coverage");
  assert.equal(describeReadingCoverage(0.74).band, "Solid coverage");
  assert.equal(describeReadingCoverage(0.35).band, "Partial coverage");
  assert.equal(describeReadingCoverage(0.02).band, "Not verified");
});

test("pace is descriptive, withheld on weak evidence, and never penalizes speed", () => {
  assert.equal(describeReadingPace({ matchedWords: 8, readingDurationMs: 10_000 }).band, "Not estimated");
  assert.equal(describeReadingPace({ matchedWords: 48, readingDurationMs: 14_585 }).band, "Brisk pace");
  const fast = describeReadingPace({ matchedWords: 50, readingDurationMs: 10_000 });
  assert.equal(fast.band, "Fast pace");
  assert.match(fast.detail, /never penalized/u);
});

test("microphone denial cannot create a completed attempt", () => {
  const result = evaluateFinishedAttempt({ captureStarted: false, finishRequested: true });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "capture-never-started");
});

test("restart abandons the current attempt without counting it", () => {
  const result = evaluateFinishedAttempt({ captureStarted: true, finishRequested: false, matchedWords: 20, totalWords: REFERENCE_WORDS });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "attempt-restarted");
});

test("Finish trusts a good-faith attempt even when silence produces no transcript", () => {
  const result = evaluateFinishedAttempt({ captureStarted: true, finishRequested: true, totalWords: REFERENCE_WORDS });
  assert.equal(result.accepted, true);
  assert.equal(result.confidenceBand.id, "unverified");
  assert.equal(result.retryAvailable, true);
});

test("Finish trusts a good-faith attempt when the local model fails", () => {
  const result = evaluateFinishedAttempt({ captureStarted: true, finishRequested: true, modelFailed: true, totalWords: REFERENCE_WORDS });
  assert.equal(result.accepted, true);
  assert.equal(result.reason, "model-failed-after-finish");
  assert.equal(result.confidenceBand.label, "Reading complete - voice check unavailable");
});

test("one or two matched words remain unverified rather than becoming a fake score", () => {
  const result = evaluateFinishedAttempt({
    captureStarted: true, finishRequested: true, transcript: "he tells", matchedWords: 2,
    positionProgress: 0.06, totalWords: REFERENCE_WORDS,
  });
  assert.equal(result.accepted, true);
  assert.equal(result.confidenceBand.id, "unverified");
});

test("unrelated speech remains unverified but does not force a reread after Finish", () => {
  const result = evaluateFinishedAttempt({
    captureStarted: true, finishRequested: true, transcript: "please open the weather tomorrow",
    matchedWords: 0, positionProgress: 0, totalWords: REFERENCE_WORDS,
  });
  assert.equal(result.accepted, true);
  assert.equal(result.confidenceBand.id, "unverified");
});

test("ending-only speech is accepted but does not earn directional confirmation", () => {
  const result = evaluateFinishedAttempt({
    captureStarted: true,
    finishRequested: true,
    matchedTokenIndexes: [23, 24, 25, 26, 27, 28, 29, 30, 31],
    matchedWords: 9,
    positionProgress: 1,
    spokenWords: 9,
    totalWords: 32,
    transcript: "and its results occur most readily to the mind",
  });
  assert.equal(result.accepted, true);
  assert.equal(result.confidenceBand.id, "unverified");
  assert.equal(result.evidence.hasBeginningEvidence, false);
});

test("partial matching speech receives directional non-percentage feedback", () => {
  const result = evaluateFinishedAttempt({
    captureStarted: true, finishRequested: true, transcript: "partial reading", matchedWords: 10,
    positionProgress: 0.4, spokenWords: 12, totalWords: REFERENCE_WORDS,
  });
  assert.equal(result.confidenceBand.id, "directional");
});

test("a well-covered finished reading receives strong directional feedback", () => {
  const result = evaluateFinishedAttempt({
    captureStarted: true, finishRequested: true, transcript: "complete reading transcript", matchedWords: 29,
    positionProgress: 0.95, spokenWords: 31, totalWords: REFERENCE_WORDS,
  });
  assert.equal(result.accepted, true);
  assert.equal(result.confidenceBand.id, "strong");
});

test("incidental common-word matches in unrelated speech remain unverified", () => {
  const result = evaluateFinishedAttempt({
    captureStarted: true, finishRequested: true, transcript: "unrelated transcript", matchedWords: 5,
    positionProgress: 0.97, spokenWords: 19, totalWords: REFERENCE_WORDS, unalignedWords: 14,
  });
  assert.equal(result.confidenceBand.id, "unverified");
});

test("guide trace reports backward and multi-line jumps separately", () => {
  const trace = summarizeGuideTrace([
    { observedAtMs: 0, visibleLineIndex: 0 },
    { observedAtMs: 420, visibleLineIndex: 1 },
    { observedAtMs: 760, visibleLineIndex: 3 },
    { observedAtMs: 900, visibleLineIndex: 2 },
  ]);
  assert.deepEqual(trace, {
    backwardJumps: 1,
    eventCount: 4,
    firstAdvanceMs: 420,
    firstUpdateMs: 0,
    largestForwardJump: 2,
    uncomfortableForwardJumps: 1,
  });
});

test("auto-finish requires end evidence, near-complete continuity, and five seconds of silence", () => {
  assert.equal(shouldAutoFinishAttempt({
    endEvidence: true,
    listening: true,
    millisecondsSinceSpeech: 5_000,
    positionProgress: 0.9,
  }), true);
});

test("silence without passage evidence never auto-finishes", () => {
  assert.equal(shouldAutoFinishAttempt({
    listening: true,
    millisecondsSinceSpeech: 30_000,
  }), false);
});

test("ending-only speech cannot auto-finish without continuity progress", () => {
  assert.equal(shouldAutoFinishAttempt({
    endEvidence: true,
    listening: true,
    millisecondsSinceSpeech: 6_000,
    positionProgress: 0.2,
  }), false);
});

test("continued speech postpones auto-finish even after reaching the end", () => {
  assert.equal(shouldAutoFinishAttempt({
    endEvidence: true,
    listening: true,
    millisecondsSinceSpeech: 900,
    positionProgress: 1,
  }), false);
});
