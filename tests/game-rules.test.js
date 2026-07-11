import test from "node:test";
import assert from "node:assert/strict";
import { evaluateReadingResult } from "../packages/game-rules/index.js";

test("maps reading data to neutral progress rewards", () => {
  const outcome = evaluateReadingResult({
    completed: true,
    accuracyEstimate: 0.94,
    selfCorrections: 1,
    repeatedWords: 0,
  }, { previousAccuracy: 0.88 });

  assert.equal(outcome.completionTier, "strong");
  assert.equal(outcome.progressReward.kind, "progress");
  assert.equal(outcome.progressReward.units, 110);
  assert.deepEqual(outcome.achievementIds, ["accurate-reading", "personal-improvement", "stuck-with-it"]);
  assert.equal("bandwidth" in outcome, false);
});

test("does not punish an incomplete attempt", () => {
  const outcome = evaluateReadingResult({
    completed: false,
    accuracyEstimate: 0.7,
    selfCorrections: 0,
    repeatedWords: 0,
  });
  assert.equal(outcome.completionTier, "in-progress");
  assert.equal(outcome.progressReward.units, 0);
});
