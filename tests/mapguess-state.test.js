import assert from "node:assert/strict";
import test from "node:test";

import {
  MAPGUESS_ANCHOR_UNITS,
  MAPGUESS_CAMPAIGN_UNITS,
  MAPGUESS_REBUILD_UNITS,
  MAPGUESS_ROUTE_GOALS,
  calculateMapGuessReadingOutcome,
  getNextMapGuessUnit,
  normalizeMapGuessRouteGoal,
} from "../apps/internet-recovery/mapguess-rules.js";
import {
  MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID,
  MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD,
  MAPGUESS_PROVISIONAL_EVIDENCE_ID,
  MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
  MAPGUESS_STATE_KEY,
  acknowledgeMapGuessMidpoint,
  acknowledgeMapGuessMidpointState,
  advanceMapGuessState,
  applyMapGuessReading,
  normalizeMapGuessState,
  readMapGuessState,
  setMapGuessGoal,
  setMapGuessGoalState,
  setMapGuessRouteGoal,
  setMapGuessRouteGoalState,
} from "../apps/internet-recovery/mapguess-state.js";

class MemoryStorage {
  constructor({ failReads = false, failWrites = false } = {}) {
    this.failReads = failReads;
    this.failWrites = failWrites;
    this.values = new Map();
  }

  getItem(key) {
    if (this.failReads) throw new Error("storage read blocked");
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    if (this.failWrites) throw new Error("storage write blocked");
    this.values.set(key, value);
  }
}

function applyNext(storage, index, { currentState } = {}) {
  const campaignState = currentState ?? readMapGuessState(storage);
  return applyMapGuessReading(storage, {
    completedAt: `2026-07-12T${String(index).padStart(2, "0")}:00:00Z`,
    currentState,
    outcome: calculateMapGuessReadingOutcome({ campaignState }),
    passageId: `mapguess-passage-${index}`,
    sessionId: `mapguess-session-${index}`,
  });
}

function advancePure(state, index) {
  return advanceMapGuessState(state, {
    completedAt: `step-${index}`,
    outcome: calculateMapGuessReadingOutcome({ campaignState: state }),
    passageId: `diagnostic-passage-${index}`,
    sessionId: `diagnostic-session-${index}`,
  });
}

function reachMovingTarget(storage) {
  let result;
  for (let index = 1; index <= 5; index += 1) result = applyNext(storage, index);
  return result;
}

function reachFinalGoalGate(storage) {
  reachMovingTarget(storage);
  acknowledgeMapGuessMidpoint(storage, { acknowledgedAt: "moving-target-ack" });
  applyNext(storage, 6);
  return applyNext(storage, 7);
}

test("empty MapGuess state is versioned, wrapper-only, and contains no invented route choice", () => {
  const state = readMapGuessState(null);
  assert.equal(state.version, 1);
  assert.equal(state.siteId, "mapguess");
  assert.equal(state.act, "rebuild");
  assert.equal(state.stateId, "mapguess_corrupted");
  assert.equal(state.lastCompletedStateId, null);
  assert.equal(state.routeGoal, null);
  assert.equal(state.routeGoalLocked, false);
  assert.equal(state.secured, false);
  assert.equal(state.evidenceId, null);
  assert.deepEqual(state.completedUnitIds, []);
  assert.equal("score" in state, false);
  assert.equal("transcript" in state, false);
});

test("the campaign contains exactly five rebuild units and three anchor units", () => {
  assert.deepEqual(
    MAPGUESS_REBUILD_UNITS.map((unit) => [unit.stateId, unit.unitId]),
    [
      ["mapguess_rebuild_1", "tiles_names"],
      ["mapguess_rebuild_2", "scale_date"],
      ["mapguess_rebuild_3", "terrain"],
      ["mapguess_rebuild_4", "route_segments"],
      ["mapguess_rebuild_5", "destination_inspector"],
    ],
  );
  assert.deepEqual(
    MAPGUESS_ANCHOR_UNITS.map((unit) => [unit.stateId, unit.unitId]),
    [
      ["mapguess_anchor_1", "landmark_1"],
      ["mapguess_anchor_2", "landmarks_2_3"],
      ["mapguess_anchor_3", "goal_route_lock"],
    ],
  );
  assert.equal(MAPGUESS_CAMPAIGN_UNITS.length, 8);
  assert.deepEqual(MAPGUESS_ROUTE_GOALS, ["fastest", "safest", "scenic", "accessible"]);
});

test("route goals normalize canonical display casing without accepting invented goals", () => {
  assert.equal(normalizeMapGuessRouteGoal(" FASTEST "), "fastest");
  assert.equal(normalizeMapGuessRouteGoal("accessible"), "accessible");
  assert.equal(normalizeMapGuessRouteGoal("shortest"), null);
  assert.equal(normalizeMapGuessRouteGoal(null), null);
});

test("accepted results advance one authored rebuild unit regardless of metrics", () => {
  const storage = new MemoryStorage();
  for (let index = 1; index <= 5; index += 1) {
    const campaignState = readMapGuessState(storage);
    const outcome = calculateMapGuessReadingOutcome({
      accepted: true,
      campaignState,
      comprehension: "retry-offered",
      readingResult: { accuracy: 0.01, progress: 1, wpm: 9_999 },
    });
    const result = applyMapGuessReading(storage, {
      completedAt: `rebuild-${index}`,
      outcome,
      passageId: `rebuild-passage-${index}`,
      sessionId: `rebuild-session-${index}`,
    });
    assert.equal(result.ok, true);
    assert.equal(result.state.repairCount, index);
  }
});

test("a rejected reading creates no MapGuess progress", () => {
  const outcome = calculateMapGuessReadingOutcome({
    accepted: false,
    campaignState: readMapGuessState(null),
  });
  assert.equal(outcome.kind, "no-progress");
  assert.equal(outcome.reason, "reading-not-accepted");
  assert.equal(outcome.unitId, null);
});

test("the fifth rebuild saves Moving Target before acknowledgement", () => {
  const storage = new MemoryStorage();
  const discovered = reachMovingTarget(storage);
  assert.deepEqual(discovered.events, ["rebuild-unit-complete", "midpoint-discovered"]);
  assert.equal(discovered.state.stateId, "mapguess_moving_target");
  assert.equal(discovered.state.lastCompletedStateId, "mapguess_rebuild_5");
  assert.equal(discovered.state.act, "midpoint");
  assert.equal(discovered.state.midpointDiscovered, true);
  assert.equal(discovered.state.midpointAcknowledged, false);
  assert.equal(discovered.state.midpointDiscoveredAt, "2026-07-12T05:00:00Z");
  assert.deepEqual(discovered.state.completedUnitIds, [
    "tiles_names",
    "scale_date",
    "terrain",
    "route_segments",
    "destination_inspector",
  ]);
});

test("anchor one is blocked until Moving Target is explicitly acknowledged", () => {
  const storage = new MemoryStorage();
  const discovered = reachMovingTarget(storage);
  assert.equal(getNextMapGuessUnit(discovered.state), null);
  assert.equal(
    calculateMapGuessReadingOutcome({ campaignState: discovered.state }).reason,
    "midpoint-acknowledgement-required",
  );
  const blocked = applyNext(storage, 6);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "midpoint-acknowledgement-required");
  assert.equal(blocked.state.repairCount, 5);
});

test("acknowledgement preserves the Moving Target state and all five saved repairs", () => {
  const storage = new MemoryStorage();
  reachMovingTarget(storage);
  const acknowledged = acknowledgeMapGuessMidpoint(storage, { acknowledgedAt: "moving-target-ack" });
  assert.equal(acknowledged.ok, true);
  assert.equal(acknowledged.event, "midpoint-acknowledged");
  assert.equal(acknowledged.state.act, "anchor");
  assert.equal(acknowledged.state.stateId, "mapguess_moving_target");
  assert.equal(acknowledged.state.lastCompletedStateId, "mapguess_rebuild_5");
  assert.equal(acknowledged.state.midpointAcknowledgedAt, "moving-target-ack");
  assert.equal(acknowledged.state.completedUnitIds.length, 5);
  assert.equal(getNextMapGuessUnit(acknowledged.state).unitId, "landmark_1");
});

test("midpoint acknowledgement fails closed before discovery and is idempotent afterward", () => {
  const early = acknowledgeMapGuessMidpointState(readMapGuessState(null));
  assert.equal(early.ok, false);
  assert.equal(early.reason, "not-ready");

  let state = readMapGuessState(null);
  for (let index = 1; index <= 5; index += 1) state = advancePure(state, index).state;
  const first = acknowledgeMapGuessMidpointState(state, { acknowledgedAt: "ack" });
  const second = acknowledgeMapGuessMidpointState(first.state, { acknowledgedAt: "later" });
  assert.equal(second.ok, true);
  assert.equal(second.event, "already-acknowledged");
  assert.equal(second.state.midpointAcknowledgedAt, "ack");
});

test("route-goal selection fails closed until the midpoint is acknowledged", () => {
  const beforeMidpoint = setMapGuessRouteGoalState(readMapGuessState(null), "fastest");
  assert.equal(beforeMidpoint.ok, false);
  assert.equal(beforeMidpoint.reason, "goal-selection-not-ready");

  const storage = new MemoryStorage();
  const discovered = reachMovingTarget(storage);
  const beforeAck = setMapGuessGoalState(discovered.state, "scenic");
  assert.equal(beforeAck.ok, false);
  assert.equal(beforeAck.reason, "goal-selection-not-ready");
  assert.equal(beforeAck.state.routeGoal, null);
});

test("a valid route goal persists and remains changeable before the final reading", () => {
  const storage = new MemoryStorage();
  reachMovingTarget(storage);
  acknowledgeMapGuessMidpoint(storage, { acknowledgedAt: "ack" });

  const selected = setMapGuessRouteGoal(storage, "FASTEST", { selectedAt: "goal-1" });
  assert.equal(selected.ok, true);
  assert.equal(selected.event, "route-goal-selected");
  assert.equal(selected.state.routeGoal, "fastest");
  assert.equal(selected.state.routeGoalSelectedAt, "goal-1");

  applyNext(storage, 6);
  applyNext(storage, 7);
  const changed = setMapGuessGoal(storage, "scenic", { selectedAt: "goal-2" });
  assert.equal(changed.ok, true);
  assert.equal(changed.event, "route-goal-changed");
  assert.equal(changed.state.routeGoal, "scenic");
  assert.equal(changed.state.routeGoalSelectedAt, "goal-2");
  assert.equal(readMapGuessState(storage).routeGoal, "scenic");

  const unchanged = setMapGuessRouteGoalState(changed.state, "SCENIC", { selectedAt: "goal-3" });
  assert.equal(unchanged.ok, true);
  assert.equal(unchanged.event, "route-goal-unchanged");
  assert.equal(unchanged.state.routeGoalSelectedAt, "goal-2");
});

test("invented route goals are rejected without mutating the saved choice", () => {
  const storage = new MemoryStorage();
  reachMovingTarget(storage);
  acknowledgeMapGuessMidpoint(storage, { acknowledgedAt: "ack" });
  const selected = setMapGuessRouteGoal(storage, "safest", { selectedAt: "chosen" });
  const invalid = setMapGuessRouteGoalState(selected.state, "shortest");
  assert.equal(invalid.ok, false);
  assert.equal(invalid.reason, "invalid-route-goal");
  assert.equal(invalid.state.routeGoal, "safest");
});

test("anchor three fails closed until a goal is selected and consumes no passage", () => {
  const storage = new MemoryStorage();
  const gate = reachFinalGoalGate(storage);
  assert.equal(gate.state.repairCount, 7);
  assert.equal(getNextMapGuessUnit(gate.state), null);
  assert.equal(
    calculateMapGuessReadingOutcome({ campaignState: gate.state }).reason,
    "goal-choice-required",
  );
  const blocked = applyNext(storage, 8);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "goal-choice-required");
  assert.equal(blocked.state.completedPassageIds.includes("mapguess-passage-8"), false);
  assert.equal(blocked.state.appliedSessionIds.includes("mapguess-session-8"), false);
});

test("the final accepted reading binds the selected goal and secures MapGuess", () => {
  const storage = new MemoryStorage();
  reachFinalGoalGate(storage);
  setMapGuessRouteGoal(storage, "accessible", { selectedAt: "goal-selected" });
  const secured = applyNext(storage, 8);

  assert.equal(secured.ok, true);
  assert.deepEqual(secured.events, [
    "anchor-unit-complete",
    "site-secured",
    "provisional-evidence-available",
    "provisional-blocked-write-recorded",
  ]);
  assert.equal(secured.state.secured, true);
  assert.equal(secured.state.act, "secured");
  assert.equal(secured.state.stateId, "mapguess_secured");
  assert.equal(secured.state.lastCompletedStateId, "mapguess_anchor_3");
  assert.equal(secured.state.routeGoal, "accessible");
  assert.equal(secured.state.routeGoalLocked, true);
  assert.equal(secured.state.routeGoalLockedAt, "2026-07-12T08:00:00Z");
  assert.equal(secured.state.evidenceId, MAPGUESS_PROVISIONAL_EVIDENCE_ID);
  assert.equal(secured.state.blockedWriteId, MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID);
  assert.equal(secured.state.repairCount, 8);
});

test("the final result rejects a route-goal snapshot mismatch", () => {
  const storage = new MemoryStorage();
  const gate = reachFinalGoalGate(storage);
  const selected = setMapGuessRouteGoal(storage, "safest", { selectedAt: "selected" });
  const outcome = calculateMapGuessReadingOutcome({ campaignState: selected.state });
  const changed = setMapGuessRouteGoal(storage, "scenic", { selectedAt: "changed" });
  const rejected = advanceMapGuessState(changed.state, {
    completedAt: "final",
    outcome,
    passageId: "final-passage",
    sessionId: "final-session",
  });
  assert.equal(gate.state.repairCount, 7);
  assert.equal(outcome.routeGoal, "safest");
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "route-goal-outcome-mismatch");
  assert.equal(rejected.state.repairCount, 7);
});

test("the route goal and secured state are permanent after anchor three", () => {
  const storage = new MemoryStorage();
  reachFinalGoalGate(storage);
  setMapGuessRouteGoal(storage, "fastest", { selectedAt: "goal" });
  const secured = applyNext(storage, 8);

  const changed = setMapGuessRouteGoal(storage, "safest", { currentState: secured.state });
  assert.equal(changed.ok, false);
  assert.equal(changed.reason, "route-goal-locked");
  assert.equal(changed.state.routeGoal, "fastest");

  const stopped = advanceMapGuessState(secured.state, {
    outcome: { kind: "anchor-unit", routeGoal: "fastest" },
    passageId: "passage-9",
    sessionId: "session-9",
  });
  assert.deepEqual(stopped.events, ["already-secured"]);
  assert.equal(stopped.state.completedPassageIds.includes("passage-9"), false);
  assert.equal(stopped.state.stateId, "mapguess_secured");
});

test("provisional slot-ten records can never masquerade as canonical evidence", () => {
  for (const record of [
    MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
    MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD,
  ]) {
    assert.equal(record.siteId, "mapguess");
    assert.equal(record.slot, 10);
    assert.equal(record.canonical, false);
    assert.equal(record.eligibleForCanonicalCount, false);
    assert.equal(record.provisional, true);
    assert.equal(record.testOnly, true);
    assert.equal(record.registryStatus, "provisional-test-only");
    assert.match(record.id, /provisional-test/u);
  }
  assert.match(MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.filename, /PROVISIONAL/u);
  assert.equal(MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.routeFragment, null);
  assert.equal(MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.upstreamServiceId, null);
  assert.equal(
    MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD.targetId,
    "mapguess-provisional-destination-glasswater-archive-01",
  );
});

test("all prior session and passage IDs remain idempotent", () => {
  const storage = new MemoryStorage();
  applyNext(storage, 1);
  applyNext(storage, 2);
  const current = readMapGuessState(storage);

  const duplicateSession = applyMapGuessReading(storage, {
    outcome: calculateMapGuessReadingOutcome({ campaignState: current }),
    passageId: "new-passage",
    sessionId: "mapguess-session-1",
  });
  assert.equal(duplicateSession.duplicate, true);
  assert.equal(duplicateSession.state.repairCount, 2);

  const duplicatePassage = applyMapGuessReading(storage, {
    outcome: calculateMapGuessReadingOutcome({ campaignState: current }),
    passageId: "mapguess-passage-1",
    sessionId: "new-session",
  });
  assert.equal(duplicatePassage.duplicatePassage, true);
  assert.equal(duplicatePassage.state.repairCount, 2);
});

test("a stale tab reconciles to persisted progress before applying", () => {
  const storage = new MemoryStorage();
  const stale = readMapGuessState(storage);
  applyNext(storage, 1);
  const second = applyMapGuessReading(storage, {
    completedAt: "later",
    currentState: stale,
    outcome: { kind: "rebuild-unit", unitId: "tiles_names" },
    passageId: "mapguess-passage-2",
    sessionId: "mapguess-session-2",
  });
  assert.equal(second.ok, true);
  assert.deepEqual(second.state.completedUnitIds, ["tiles_names", "scale_date"]);
  assert.deepEqual(second.state.completedPassageIds, ["mapguess-passage-1", "mapguess-passage-2"]);
});

test("a stale tab cannot roll back later anchor progress or the persisted goal", () => {
  const storage = new MemoryStorage();
  reachMovingTarget(storage);
  const stale = acknowledgeMapGuessMidpoint(storage, { acknowledgedAt: "ack" }).state;
  applyNext(storage, 6);
  applyNext(storage, 7);
  setMapGuessRouteGoal(storage, "safest", { selectedAt: "goal" });

  const final = applyMapGuessReading(storage, {
    completedAt: "final",
    currentState: stale,
    outcome: { kind: "anchor-unit", routeGoal: "safest" },
    passageId: "mapguess-passage-8",
    sessionId: "mapguess-session-8",
  });
  assert.equal(final.ok, true);
  assert.equal(final.state.secured, true);
  assert.equal(final.state.routeGoal, "safest");
  assert.equal(final.state.repairCount, 8);
});

test("a newer same-rank route goal survives a failed storage write in the current tab", () => {
  const storage = new MemoryStorage();
  reachFinalGoalGate(storage);
  const persisted = setMapGuessRouteGoal(storage, "fastest", {
    selectedAt: "2026-07-12T07:10:00Z",
  });

  storage.failWrites = true;
  const changed = setMapGuessRouteGoal(storage, "scenic", {
    currentState: persisted.state,
    selectedAt: "2026-07-12T07:20:00Z",
  });
  assert.equal(changed.ok, false);
  assert.equal(changed.reason, "write-failed");
  assert.equal(changed.state.routeGoal, "scenic");
  assert.equal(readMapGuessState(storage).routeGoal, "fastest");

  const final = applyMapGuessReading(storage, {
    completedAt: "2026-07-12T08:00:00Z",
    currentState: changed.state,
    outcome: calculateMapGuessReadingOutcome({ campaignState: changed.state }),
    passageId: "mapguess-passage-8",
    sessionId: "mapguess-session-8",
  });
  assert.equal(final.ok, false);
  assert.equal(final.reason, "write-failed");
  assert.equal(final.state.secured, true);
  assert.equal(final.state.routeGoal, "scenic");
  assert.equal(final.state.routeGoalLocked, true);
});

test("an older same-rank tab cannot replace a newer persisted route goal", () => {
  const storage = new MemoryStorage();
  reachFinalGoalGate(storage);
  const stale = setMapGuessRouteGoal(storage, "fastest", {
    selectedAt: "2026-07-12T07:10:00Z",
  });
  const current = setMapGuessRouteGoal(storage, "scenic", {
    currentState: stale.state,
    selectedAt: "2026-07-12T07:20:00Z",
  });

  const final = applyMapGuessReading(storage, {
    completedAt: "2026-07-12T08:00:00Z",
    currentState: stale.state,
    outcome: calculateMapGuessReadingOutcome({ campaignState: current.state }),
    passageId: "mapguess-passage-8",
    sessionId: "mapguess-session-8",
  });
  assert.equal(final.ok, true);
  assert.equal(final.state.secured, true);
  assert.equal(final.state.routeGoal, "scenic");
  assert.equal(final.state.routeGoalLocked, true);
});

test("malformed state cannot skip units, acknowledgement, goal selection, or evidence", () => {
  const skipped = normalizeMapGuessState({
    completedUnitIds: ["tiles_names", "terrain", "goal_route_lock"],
    evidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
    midpointAcknowledged: true,
    routeGoal: "fastest",
    secured: true,
    version: 1,
  });
  assert.deepEqual(skipped.completedUnitIds, ["tiles_names"]);
  assert.equal(skipped.midpointAcknowledged, false);
  assert.equal(skipped.routeGoal, null);
  assert.equal(skipped.secured, false);
  assert.equal(skipped.evidenceId, null);

  const missingGoal = normalizeMapGuessState({
    completedUnitIds: MAPGUESS_CAMPAIGN_UNITS.map((unit) => unit.unitId),
    evidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
    midpointAcknowledged: true,
    secured: true,
    version: 1,
  });
  assert.equal(missingGoal.repairCount, 7);
  assert.equal(missingGoal.secured, false);
  assert.equal(missingGoal.evidenceId, null);
  assert.equal(missingGoal.stateId, "mapguess_anchor_2");
});

test("session and passage identity histories are unique and bounded", () => {
  const state = normalizeMapGuessState({
    appliedSessionIds: [
      "duplicate",
      "duplicate",
      ...Array.from({ length: 40 }, (_, index) => `session-${index}`),
    ],
    completedPassageIds: Array.from({ length: 30 }, (_, index) => `passage-${index}`),
  });
  assert.equal(state.appliedSessionIds.length, 32);
  assert.equal(new Set(state.appliedSessionIds).size, 32);
  assert.equal(state.appliedSessionIds.at(-1), "session-39");
  assert.equal(state.completedPassageIds.length, 24);
  assert.equal(state.completedPassageIds[0], "passage-6");
  assert.equal(state.completedPassageIds.at(-1), "passage-29");
});

test("blocked storage returns a safe in-tab state that can continue", () => {
  const storage = new MemoryStorage({ failWrites: true });
  const first = applyMapGuessReading(storage, {
    completedAt: "first",
    outcome: { kind: "rebuild-unit" },
    passageId: "passage-1",
    sessionId: "session-1",
  });
  assert.equal(first.ok, false);
  assert.equal(first.reason, "write-failed");
  assert.deepEqual(first.state.completedUnitIds, ["tiles_names"]);

  const second = applyMapGuessReading(storage, {
    completedAt: "second",
    currentState: first.state,
    outcome: { kind: "rebuild-unit" },
    passageId: "passage-2",
    sessionId: "session-2",
  });
  assert.equal(second.reason, "write-failed");
  assert.deepEqual(second.state.completedUnitIds, ["tiles_names", "scale_date"]);
});

test("corrupt, unavailable, and wrong-version storage reads fail closed", () => {
  const malformed = new MemoryStorage();
  malformed.setItem(MAPGUESS_STATE_KEY, "not-json");
  assert.equal(readMapGuessState(malformed).stateId, "mapguess_corrupted");
  assert.equal(readMapGuessState(new MemoryStorage({ failReads: true })).stateId, "mapguess_corrupted");

  const oldVersion = new MemoryStorage();
  oldVersion.setItem(MAPGUESS_STATE_KEY, JSON.stringify({ version: 99, secured: true }));
  assert.equal(readMapGuessState(oldVersion).secured, false);
});

test("persisted MapGuess state contains no audio, transcript, score, or comprehension data", () => {
  const storage = new MemoryStorage();
  applyNext(storage, 1);
  const persisted = storage.getItem(MAPGUESS_STATE_KEY);
  assert.doesNotMatch(persisted, /audio|transcript|accuracy|wpm|comprehension|score/iu);
  assert.match(persisted, /completedUnitIds/u);
  assert.match(persisted, /routeGoal/u);
});

test("rules stop at the midpoint, goal gate, and secured boundaries", () => {
  let state = readMapGuessState(null);
  assert.equal(getNextMapGuessUnit(state).unitId, "tiles_names");
  for (let index = 1; index <= 5; index += 1) state = advancePure(state, index).state;
  assert.equal(getNextMapGuessUnit(state), null);
  state = acknowledgeMapGuessMidpointState(state).state;
  for (let index = 6; index <= 7; index += 1) state = advancePure(state, index).state;
  assert.equal(getNextMapGuessUnit(state), null);
  state = setMapGuessRouteGoalState(state, "scenic").state;
  state = advancePure(state, 8).state;
  assert.equal(getNextMapGuessUnit(state), null);
  assert.equal(calculateMapGuessReadingOutcome({ campaignState: state }).reason, "already-secured");
});
