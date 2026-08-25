import assert from "node:assert/strict";
import test from "node:test";

import {
  acceptMissionReading,
  acknowledgeMissionMidpoint,
  createMissionSequenceState,
  recordMissionComprehension,
  retryMissionPassage,
  skipMissionPassage,
  submitMissionReflection,
} from "../apps/internet-recovery/mission-sequence-state.js";

function completePassage(state, passageId) {
  const accepted = acceptMissionReading(state, { passageId });
  assert.equal(accepted.accepted, true);
  return recordMissionComprehension(accepted.state, { correct: true, passageId });
}

test("mission starts at index zero on the start frame", () => {
  const state = createMissionSequenceState({ phaseOneCount: 2, totalPassages: 4 });
  assert.equal(state.index, 0);
  assert.equal(state.frame, "start");
  assert.equal(state.phase, "phase-one");
  assert.deepEqual(state.completedPassageIds, []);
  assert.deepEqual(state.skippedPassageIds, []);
});

test("accepted reading waits for a correct comprehension answer", () => {
  const initial = createMissionSequenceState({ phaseOneCount: 2, totalPassages: 4 });
  const accepted = acceptMissionReading(initial, { passageId: "passage-1" });
  assert.equal(accepted.state.index, 0);
  assert.equal(accepted.state.frame, "start");
  assert.equal(accepted.state.pendingPassageId, "passage-1");

  const incorrect = recordMissionComprehension(accepted.state, {
    correct: false,
    passageId: "passage-1",
  });
  assert.equal(incorrect.advanced, false);
  assert.equal(incorrect.retryComprehension, true);
  assert.equal(incorrect.state.index, 0);
  assert.equal(incorrect.state.pendingPassageId, "passage-1");

  const corrected = recordMissionComprehension(incorrect.state, {
    correct: true,
    passageId: "passage-1",
  });
  assert.equal(corrected.advanced, true);
  assert.equal(corrected.state.index, 1);
  assert.equal(corrected.state.frame, 1);
  assert.equal(corrected.state.pendingPassageId, null);
});

test("a passage advances exactly once even when events are replayed", () => {
  const initial = createMissionSequenceState({ phaseOneCount: 2, totalPassages: 4 });
  const first = completePassage(initial, "passage-1");
  const duplicateReading = acceptMissionReading(first.state, { passageId: "passage-1" });
  const duplicateAnswer = recordMissionComprehension(first.state, {
    correct: true,
    passageId: "passage-1",
  });
  assert.equal(duplicateReading.duplicate, true);
  assert.equal(duplicateAnswer.duplicate, true);
  assert.equal(duplicateReading.state.index, 1);
  assert.equal(duplicateAnswer.state.index, 1);
});

test("midpoint gates the lock sequence after the configured phase-one count", () => {
  let state = createMissionSequenceState({ phaseOneCount: 2, totalPassages: 4 });
  state = completePassage(state, "passage-1").state;
  state = completePassage(state, "passage-2").state;
  assert.equal(state.phase, "midpoint-required");
  assert.equal(acceptMissionReading(state, { passageId: "passage-3" }).reason, "midpoint-required");

  const acknowledged = acknowledgeMissionMidpoint(state);
  assert.equal(acknowledged.acknowledged, true);
  assert.equal(acknowledged.state.phase, "lock-sequence");
  const duplicate = acknowledgeMissionMidpoint(acknowledged.state);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.state.phase, "lock-sequence");
});

test("retry never advances the mission or clears pending comprehension", () => {
  const initial = createMissionSequenceState({ phaseOneCount: 2, totalPassages: 4 });
  const accepted = acceptMissionReading(initial, { passageId: "passage-1" });
  const retried = retryMissionPassage(accepted.state, { passageId: "passage-1" });
  assert.equal(retried.retried, true);
  assert.equal(retried.advanced, false);
  assert.equal(retried.state.index, 0);
  assert.equal(retried.state.frame, "start");
  assert.equal(retried.state.pendingPassageId, "passage-1");
});

test("skip advances the preview without manufacturing reading completion", () => {
  let state = createMissionSequenceState({ phaseOneCount: 2, totalPassages: 4 });
  const skipped = skipMissionPassage(state, { passageId: "passage-1" });
  assert.equal(skipped.advanced, true);
  assert.equal(skipped.skipped, true);
  assert.equal(skipped.state.index, 1);
  assert.deepEqual(skipped.state.completedPassageIds, []);
  assert.deepEqual(skipped.state.skippedPassageIds, ["passage-1"]);
  assert.equal(skipped.state.comprehensionAttempts, 0);

  state = acceptMissionReading(skipped.state, { passageId: "passage-2" }).state;
  const retry = retryMissionPassage(state, { passageId: "passage-2" });
  assert.equal(retry.state.index, 1);
  assert.deepEqual(retry.state.skippedPassageIds, ["passage-1"]);
  const skipPending = skipMissionPassage(retry.state, { passageId: "passage-2" });
  assert.equal(skipPending.state.phase, "midpoint-required");
  assert.deepEqual(skipPending.state.completedPassageIds, []);
  assert.deepEqual(skipPending.state.skippedPassageIds, ["passage-1", "passage-2"]);
});

test("all passages invite reflection, accept any response, then produce an idempotent completion receipt", () => {
  let state = createMissionSequenceState({ phaseOneCount: 2, totalPassages: 4 });
  state = completePassage(state, "passage-1").state;
  state = completePassage(state, "passage-2").state;
  state = acknowledgeMissionMidpoint(state).state;
  state = completePassage(state, "passage-3").state;
  state = completePassage(state, "passage-4").state;
  assert.equal(state.phase, "reflection-required");
  assert.equal(state.index, 4);
  const blankCompleted = submitMissionReflection(state, {
    reflection: "  ",
    submittedAt: "2026-08-16T11:59:00Z",
  });
  assert.equal(blankCompleted.completed, true);
  assert.equal(blankCompleted.receipt.reflection, "");

  const completed = submitMissionReflection(state, {
    reflection: "People should stay in control.",
    submittedAt: "2026-08-16T12:00:00Z",
  });
  assert.equal(completed.completed, true);
  assert.equal(completed.state.phase, "completed");
  assert.deepEqual(completed.receipt, {
    completedPassageCount: 4,
    reflection: "People should stay in control.",
    skippedPassageCount: 0,
    submittedAt: "2026-08-16T12:00:00Z",
  });

  const replay = submitMissionReflection(completed.state, { reflection: "Different text" });
  assert.equal(replay.duplicate, true);
  assert.deepEqual(replay.receipt, completed.receipt);
});

test("invalid sequence configuration is rejected", () => {
  assert.throws(
    () => createMissionSequenceState({ phaseOneCount: 4, totalPassages: 4 }),
    /smaller than totalPassages/u,
  );
});
