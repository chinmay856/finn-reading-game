import assert from "node:assert/strict";
import test from "node:test";

import { createMissionSequenceState, skipMissionPassage, submitMissionReflection } from "../apps/internet-recovery/mission-sequence-state.js";
import {
  ensurePlayableProgressProfile,
  launcherMissionProgress,
  persistPlayableMissionSequence,
  restorePlayableMissionSequence,
} from "../apps/internet-recovery/playable-save-progress.js";

const mission = Object.freeze({
  id: "threadit",
  passages: Object.freeze(Array.from({ length: 8 }, (_, index) => Object.freeze({ id: `threadit-${index + 1}` }))),
  phaseOneCount: 4,
});

function profile() {
  return ensurePlayableProgressProfile({ completedSiteIds: [], missions: {}, reflections: {} });
}

function advance(state, count) {
  let next = state;
  for (let index = 0; index < count; index += 1) {
    next = skipMissionPassage(next, { passageId: mission.passages[index].id }).state;
    if (next.phase === "midpoint-required") next = { ...next, phase: "lock-sequence" };
  }
  return next;
}

test("first-run progress resumes from the canonical save lane", () => {
  const save = profile();
  const sequence = advance(createMissionSequenceState({ phaseOneCount: 4, totalPassages: 8 }), 2);
  persistPlayableMissionSequence(save, mission, sequence, { updatedAt: "2026-08-24T00:00:00.000Z" });

  assert.equal(restorePlayableMissionSequence(save, mission).index, 2);
  assert.deepEqual(launcherMissionProgress(save, mission), {
    completed: false,
    index: 2,
    percent: 25,
    recoveryInProgress: true,
    replayInProgress: false,
    status: "CONTINUE RECOVERY",
    total: 8,
  });
});

test("a partial replay is saved separately from the completed recovery", () => {
  const save = profile();
  const original = { ...advance(createMissionSequenceState({ phaseOneCount: 4, totalPassages: 8 }), 8), phase: "completed" };
  save.completedSiteIds.push(mission.id);
  save.reflections[mission.id] = { reflection: "Keep distinct voices." };
  persistPlayableMissionSequence(save, mission, original);

  const replay = advance(createMissionSequenceState({ phaseOneCount: 4, totalPassages: 8 }), 5);
  persistPlayableMissionSequence(save, mission, replay, { replay: true });

  assert.equal(restorePlayableMissionSequence(save, mission).phase, "completed");
  assert.equal(restorePlayableMissionSequence(save, mission, { replay: true }).index, 5);
  assert.deepEqual(launcherMissionProgress(save, mission), {
    completed: true,
    index: 5,
    percent: 65,
    recoveryInProgress: false,
    replayInProgress: true,
    status: "RECOVERED · CONTINUE REPLAY",
    total: 8,
  });
});

test("finishing a replay clears only the replay checkpoint", () => {
  const save = profile();
  const original = { ...advance(createMissionSequenceState({ phaseOneCount: 4, totalPassages: 8 }), 8), phase: "reflection-required" };
  const completed = submitMissionReflection(original, { reflection: "Keep distinct voices." }).state;
  save.completedSiteIds.push(mission.id);
  save.reflections[mission.id] = { reflection: "Original lesson." };
  persistPlayableMissionSequence(save, mission, completed);
  persistPlayableMissionSequence(save, mission, advance(createMissionSequenceState({ phaseOneCount: 4, totalPassages: 8 }), 5), { replay: true });

  persistPlayableMissionSequence(save, mission, completed, { completed: true, replay: true });

  assert.equal(restorePlayableMissionSequence(save, mission, { replay: true }), null);
  assert.equal(restorePlayableMissionSequence(save, mission).phase, "completed");
  assert.equal(save.reflections[mission.id].reflection, "Original lesson.");
  assert.equal(save.replayCounts[mission.id], 1);
  assert.equal(launcherMissionProgress(save, mission).status, "RECOVERY COMPLETE · PLAY AGAIN");
});

test("restarting a replay clears its prior checkpoint", () => {
  const save = profile();
  const partial = advance(createMissionSequenceState({ phaseOneCount: 4, totalPassages: 8 }), 3);
  persistPlayableMissionSequence(save, mission, partial, { replay: true });
  persistPlayableMissionSequence(save, mission, createMissionSequenceState({ phaseOneCount: 4, totalPassages: 8 }), { replay: true });
  assert.equal(restorePlayableMissionSequence(save, mission, { replay: true }), null);
});
