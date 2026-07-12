import assert from "node:assert/strict";
import test from "node:test";

import {
  FACEPLACE_ACT_ONE_UNITS,
  FACEPLACE_CAMPAIGN_UNITS,
  FACEPLACE_FALSE_TRACKER_UNITS,
  FACEPLACE_RECOVERY_UNITS,
  calculateFacePlaceReadingOutcome,
  getNextFacePlaceUnit,
} from "../apps/internet-recovery/faceplace-rules.js";
import {
  FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID,
  FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  FACEPLACE_PROVISIONAL_EVIDENCE_ID,
  FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
  FACEPLACE_STATE_KEY,
  acknowledgeFacePlaceMidpoint,
  acknowledgeFacePlaceMidpointState,
  advanceFacePlaceState,
  applyFacePlaceReading,
  normalizeFacePlaceState,
  readFacePlaceState,
  setFacePlaceFeedMode,
  setFacePlaceFeedModeState,
} from "../apps/internet-recovery/faceplace-state.js";

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
  const campaignState = currentState ?? readFacePlaceState(storage);
  return applyFacePlaceReading(storage, {
    completedAt: `2026-07-12T0${index}:00:00Z`,
    currentState,
    outcome: calculateFacePlaceReadingOutcome({ campaignState }),
    passageId: `faceplace-passage-${index}`,
    sessionId: `faceplace-session-${index}`,
  });
}

function advancePure(state, index) {
  return advanceFacePlaceState(state, {
    completedAt: `step-${index}`,
    outcome: calculateFacePlaceReadingOutcome({ campaignState: state }),
    passageId: `diagnostic-passage-${index}`,
    sessionId: `diagnostic-session-${index}`,
  });
}

function reachHonestZero(storage) {
  let result;
  for (let index = 1; index <= 3; index += 1) result = applyNext(storage, index);
  return result;
}

test("empty FacePlace state is versioned, non-audio, and has no invented tracker value", () => {
  const state = readFacePlaceState(null);
  assert.equal(state.version, 1);
  assert.equal(state.siteId, "faceplace");
  assert.equal(state.act, "false-tracker");
  assert.equal(state.stateId, "faceplace_corrupted");
  assert.equal(state.lastCompletedStateId, null);
  assert.equal(state.secured, false);
  assert.equal(state.evidenceId, null);
  assert.equal(state.feedMode, "ranked");
  assert.deepEqual(state.completedUnitIds, []);
  assert.equal("tracker" in state, false);
});

test("the campaign contains exactly three false-tracker and three recovery units", () => {
  assert.equal(FACEPLACE_ACT_ONE_UNITS, FACEPLACE_FALSE_TRACKER_UNITS);
  assert.deepEqual(
    FACEPLACE_FALSE_TRACKER_UNITS.map((unit) => [unit.stateId, unit.unitId, unit.tracker.display]),
    [
      ["faceplace_false_tracker_1", "duplicates_collapsed", "12%"],
      ["faceplace_false_tracker_2", "authorship_time_restored", "114%"],
      ["faceplace_false_tracker_3", "context_controls_restored", "AVOCADO%"],
    ],
  );
  assert.deepEqual(
    FACEPLACE_RECOVERY_UNITS.map((unit) => [unit.stateId, unit.unitId, unit.tracker.value]),
    [
      ["faceplace_recovery_1", "chronology_verified", 34],
      ["faceplace_recovery_2", "recommendations_explained", 67],
      ["faceplace_recovery_3", "distribution_gate_restored", 100],
    ],
  );
  assert.equal(FACEPLACE_CAMPAIGN_UNITS.length, 6);
});

test("accepted results advance one authored false-tracker unit regardless of metrics", () => {
  const storage = new MemoryStorage();
  for (let index = 1; index <= 3; index += 1) {
    const campaignState = readFacePlaceState(storage);
    const outcome = calculateFacePlaceReadingOutcome({
      accepted: true,
      campaignState,
      comprehension: "retry-offered",
      readingResult: { accuracy: 1, progress: 0.01, wpm: 1 },
    });
    const result = applyFacePlaceReading(storage, {
      completedAt: `false-tracker-${index}`,
      outcome,
      passageId: `false-tracker-passage-${index}`,
      sessionId: `false-tracker-session-${index}`,
    });
    assert.equal(result.ok, true);
    assert.equal(result.state.repairCount, index);
  }
});

test("the third unit saves Honest Zero before acknowledgement", () => {
  const storage = new MemoryStorage();
  const discovered = reachHonestZero(storage);
  assert.deepEqual(discovered.events, ["unit-complete", "midpoint-discovered"]);
  assert.equal(discovered.state.stateId, "faceplace_honest_zero");
  assert.equal(discovered.state.lastCompletedStateId, "faceplace_false_tracker_3");
  assert.equal(discovered.state.act, "midpoint");
  assert.equal(discovered.state.midpointDiscovered, true);
  assert.equal(discovered.state.midpointAcknowledged, false);
  assert.equal(discovered.state.midpointDiscoveredAt, "2026-07-12T03:00:00Z");
});

test("unit four is blocked until Honest Zero is explicitly acknowledged", () => {
  const storage = new MemoryStorage();
  const discovered = reachHonestZero(storage);
  assert.equal(getNextFacePlaceUnit(discovered.state), null);
  assert.equal(
    calculateFacePlaceReadingOutcome({ campaignState: discovered.state }).reason,
    "midpoint-acknowledgement-required",
  );
  const blocked = applyNext(storage, 4);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "midpoint-acknowledgement-required");
  assert.equal(blocked.state.repairCount, 3);
});

test("acknowledgement keeps the active state at Honest Zero", () => {
  const storage = new MemoryStorage();
  reachHonestZero(storage);
  const acknowledged = acknowledgeFacePlaceMidpoint(storage, { acknowledgedAt: "honest-zero-ack" });
  assert.equal(acknowledged.ok, true);
  assert.equal(acknowledged.event, "midpoint-acknowledged");
  assert.equal(acknowledged.state.act, "recovery");
  assert.equal(acknowledged.state.stateId, "faceplace_honest_zero");
  assert.equal(acknowledged.state.lastCompletedStateId, "faceplace_false_tracker_3");
  assert.equal(acknowledged.state.midpointAcknowledgedAt, "honest-zero-ack");
  assert.equal(getNextFacePlaceUnit(acknowledged.state).unitId, "chronology_verified");
});

test("feed order stays ranked until chronology is restored, then defaults chronological", () => {
  let state = normalizeFacePlaceState({ feedMode: "chronological" });
  assert.equal(state.feedMode, "ranked");
  for (let index = 1; index <= 3; index += 1) state = advancePure(state, index).state;
  state = acknowledgeFacePlaceMidpointState(state, { acknowledgedAt: "ack" }).state;
  assert.equal(state.feedMode, "ranked");
  state = advancePure(state, 4).state;
  assert.equal(state.completedUnitIds.includes("chronology_verified"), true);
  assert.equal(state.feedMode, "chronological");
});

test("restored feed order accepts only ranked or chronological and persists the choice", () => {
  const storage = new MemoryStorage();
  reachHonestZero(storage);
  acknowledgeFacePlaceMidpoint(storage, { acknowledgedAt: "ack" });
  const chronology = applyNext(storage, 4);
  assert.equal(chronology.state.feedMode, "chronological");

  const ranked = setFacePlaceFeedMode(storage, "ranked", { currentState: chronology.state });
  assert.equal(ranked.ok, true);
  assert.equal(ranked.state.feedMode, "ranked");
  assert.equal(readFacePlaceState(storage).feedMode, "ranked");

  const chronological = setFacePlaceFeedModeState(ranked.state, "chronological");
  assert.equal(chronological.ok, true);
  assert.equal(chronological.state.feedMode, "chronological");

  const invalid = setFacePlaceFeedModeState(chronological.state, "algorithmic");
  assert.equal(invalid.ok, false);
  assert.equal(invalid.reason, "invalid-feed-mode");
  assert.equal(invalid.state.feedMode, "chronological");
});

test("feed-order control fails closed before chronology is restored", () => {
  const current = normalizeFacePlaceState({ feedMode: "chronological" });
  const result = setFacePlaceFeedModeState(current, "chronological");
  assert.equal(result.ok, false);
  assert.equal(result.reason, "chronology-not-restored");
  assert.equal(result.state.feedMode, "ranked");
});

test("three recovery units secure FacePlace with test-only provisional records", () => {
  const storage = new MemoryStorage();
  reachHonestZero(storage);
  acknowledgeFacePlaceMidpoint(storage, { acknowledgedAt: "honest-zero-ack" });

  for (let index = 4; index <= 6; index += 1) {
    const result = applyNext(storage, index);
    assert.equal(result.ok, true);
    assert.equal(result.state.lastCompletedStateId, `faceplace_recovery_${index - 3}`);
    if (index === 6) {
      assert.deepEqual(result.events, [
        "recovery-unit-complete",
        "site-secured",
        "provisional-evidence-available",
        "provisional-blocked-write-recorded",
      ]);
    }
  }
  const secured = readFacePlaceState(storage);
  assert.equal(secured.secured, true);
  assert.equal(secured.act, "secured");
  assert.equal(secured.stateId, "faceplace_secured");
  assert.equal(secured.evidenceId, FACEPLACE_PROVISIONAL_EVIDENCE_ID);
  assert.equal(secured.blockedWriteId, FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID);
  assert.equal(secured.repairCount, 6);
});

test("provisional slot-three identities can never masquerade as canonical records", () => {
  for (const record of [
    FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
    FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  ]) {
    assert.equal(record.slot, 3);
    assert.equal(record.canonical, false);
    assert.equal(record.provisional, true);
    assert.equal(record.testOnly, true);
    assert.match(record.id, /provisional-test/u);
  }
  assert.match(FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.filename, /PROVISIONAL/u);
});

test("secured state is permanent and does not consume another passage", () => {
  let state = readFacePlaceState(null);
  for (let index = 1; index <= 3; index += 1) state = advancePure(state, index).state;
  state = acknowledgeFacePlaceMidpointState(state, { acknowledgedAt: "ack" }).state;
  for (let index = 4; index <= 6; index += 1) state = advancePure(state, index).state;
  const stopped = advanceFacePlaceState(state, {
    outcome: { kind: "recovery-unit" },
    passageId: "passage-7",
    sessionId: "session-7",
  });
  assert.deepEqual(stopped.events, ["already-secured"]);
  assert.equal(stopped.state.completedPassageIds.includes("passage-7"), false);
  assert.equal(stopped.state.stateId, "faceplace_secured");
});

test("all prior session and passage IDs remain idempotent", () => {
  const storage = new MemoryStorage();
  applyNext(storage, 1);
  applyNext(storage, 2);
  const current = readFacePlaceState(storage);

  const duplicateSession = applyFacePlaceReading(storage, {
    outcome: calculateFacePlaceReadingOutcome({ campaignState: current }),
    passageId: "new-passage",
    sessionId: "faceplace-session-1",
  });
  assert.equal(duplicateSession.duplicate, true);
  assert.equal(duplicateSession.state.repairCount, 2);

  const duplicatePassage = applyFacePlaceReading(storage, {
    outcome: calculateFacePlaceReadingOutcome({ campaignState: current }),
    passageId: "faceplace-passage-1",
    sessionId: "new-session",
  });
  assert.equal(duplicatePassage.duplicatePassage, true);
  assert.equal(duplicatePassage.state.repairCount, 2);
});

test("a stale tab reconciles to persisted progress before applying", () => {
  const storage = new MemoryStorage();
  const stale = readFacePlaceState(storage);
  applyNext(storage, 1);
  const second = applyFacePlaceReading(storage, {
    completedAt: "later",
    currentState: stale,
    outcome: { kind: "false-tracker-unit", unitId: "duplicates_collapsed" },
    passageId: "faceplace-passage-2",
    sessionId: "faceplace-session-2",
  });
  assert.equal(second.ok, true);
  assert.deepEqual(second.state.completedUnitIds, ["duplicates_collapsed", "authorship_time_restored"]);
  assert.deepEqual(second.state.completedPassageIds, ["faceplace-passage-1", "faceplace-passage-2"]);
});

test("malformed state cannot skip units, acknowledgement, or secured evidence", () => {
  const normalized = normalizeFacePlaceState({
    completedUnitIds: ["duplicates_collapsed", "context_controls_restored", "distribution_gate_restored"],
    evidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID,
    midpointAcknowledged: true,
    secured: true,
    version: 1,
  });
  assert.deepEqual(normalized.completedUnitIds, ["duplicates_collapsed"]);
  assert.equal(normalized.act, "false-tracker");
  assert.equal(normalized.midpointAcknowledged, false);
  assert.equal(normalized.secured, false);
  assert.equal(normalized.evidenceId, null);
});

test("blocked storage returns a safe in-tab state that can continue", () => {
  const storage = new MemoryStorage({ failWrites: true });
  const first = applyFacePlaceReading(storage, {
    completedAt: "first",
    outcome: { kind: "false-tracker-unit" },
    passageId: "passage-1",
    sessionId: "session-1",
  });
  assert.equal(first.ok, false);
  assert.equal(first.reason, "write-failed");
  assert.deepEqual(first.state.completedUnitIds, ["duplicates_collapsed"]);

  const second = applyFacePlaceReading(storage, {
    completedAt: "second",
    currentState: first.state,
    outcome: { kind: "false-tracker-unit" },
    passageId: "passage-2",
    sessionId: "session-2",
  });
  assert.equal(second.reason, "write-failed");
  assert.deepEqual(second.state.completedUnitIds, ["duplicates_collapsed", "authorship_time_restored"]);
});

test("corrupt and unavailable storage reads fail closed", () => {
  const malformed = new MemoryStorage();
  malformed.setItem(FACEPLACE_STATE_KEY, "not-json");
  assert.equal(readFacePlaceState(malformed).stateId, "faceplace_corrupted");
  assert.equal(readFacePlaceState(new MemoryStorage({ failReads: true })).stateId, "faceplace_corrupted");
});

test("persisted FacePlace state contains no audio, transcript, score, or comprehension data", () => {
  const storage = new MemoryStorage();
  applyNext(storage, 1);
  const persisted = storage.getItem(FACEPLACE_STATE_KEY);
  assert.doesNotMatch(persisted, /audio|transcript|accuracy|wpm|comprehension|score/iu);
  assert.match(persisted, /completedUnitIds/u);
});

test("rules stop at the midpoint and secured boundaries", () => {
  let state = readFacePlaceState(null);
  assert.equal(getNextFacePlaceUnit(state).unitId, "duplicates_collapsed");
  for (let index = 1; index <= 3; index += 1) state = advancePure(state, index).state;
  assert.equal(getNextFacePlaceUnit(state), null);
  state = acknowledgeFacePlaceMidpointState(state).state;
  for (let index = 4; index <= 6; index += 1) state = advancePure(state, index).state;
  assert.equal(getNextFacePlaceUnit(state), null);
  assert.equal(calculateFacePlaceReadingOutcome({ campaignState: state }).reason, "already-secured");
});
