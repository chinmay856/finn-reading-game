import test from "node:test";
import assert from "node:assert/strict";

import {
  MYCORNER_CAMPAIGN_UNITS,
  MYCORNER_OWNER_LOCK_UNITS,
  MYCORNER_RESTORE_UNITS,
  calculateMyCornerReadingOutcome,
  getNextMyCornerUnit,
} from "../apps/internet-recovery/mycorner-rules.js";
import {
  MYCORNER_PROVISIONAL_BLOCKED_WRITE_ID,
  MYCORNER_PROVISIONAL_EVIDENCE_ID,
  MYCORNER_STATE_KEY,
  acknowledgeMyCornerMidpoint,
  acknowledgeMyCornerMidpointState,
  advanceMyCornerState,
  applyMyCornerReading,
  normalizeMyCornerState,
  readMyCornerState,
} from "../apps/internet-recovery/mycorner-state.js";

function outcomeFor(state) {
  return calculateMyCornerReadingOutcome({ accepted: true, campaignState: state });
}

function advance(state, ordinal) {
  return advanceMyCornerState(state, {
    completedAt: `2026-07-12T0${ordinal}:00:00.000Z`,
    outcome: outcomeFor(state),
    passageId: `mycorner-passage-${ordinal}`,
    sessionId: `mycorner-session-${ordinal}`,
  });
}

function stateAt(completedCount, { acknowledged = true } = {}) {
  let state = normalizeMyCornerState();
  for (let index = 0; index < completedCount; index += 1) {
    if (index === MYCORNER_RESTORE_UNITS.length && acknowledged) {
      state = acknowledgeMyCornerMidpointState(state, {
        acknowledgedAt: "2026-07-12T04:30:00.000Z",
      }).state;
    }
    const transition = advance(state, index + 1);
    assert.equal(transition.ok, true);
    state = transition.state;
  }
  return state;
}

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

test("MyCorner freezes the exact four-restore plus three-owner-lock sequence", () => {
  assert.deepEqual(
    MYCORNER_RESTORE_UNITS.map(({ unitId }) => unitId),
    ["owner_about", "theme_friends", "media_counter", "privacy_source"],
  );
  assert.deepEqual(
    MYCORNER_OWNER_LOCK_UNITS.map(({ unitId }) => unitId),
    ["profile_owner_lock", "presentation_owner_lock", "global_apply_blocked"],
  );
  assert.equal(MYCORNER_CAMPAIGN_UNITS.length, 7);

  let state = normalizeMyCornerState();
  for (let index = 0; index < MYCORNER_RESTORE_UNITS.length; index += 1) {
    const unit = getNextMyCornerUnit(state);
    assert.equal(unit.unitId, MYCORNER_RESTORE_UNITS[index].unitId);
    const outcome = outcomeFor(state);
    assert.equal(outcome.kind, "restore-unit");
    state = advance(state, index + 1).state;
  }

  assert.equal(state.stateId, "mycorner_template_reveal");
  assert.equal(state.midpointDiscovered, true);
  assert.equal(state.midpointAcknowledged, false);
  assert.equal(getNextMyCornerUnit(state), null);
  assert.equal(outcomeFor(state).reason, "midpoint-acknowledgement-required");

  state = acknowledgeMyCornerMidpointState(state, {
    acknowledgedAt: "2026-07-12T04:30:00.000Z",
  }).state;
  for (let index = 0; index < MYCORNER_OWNER_LOCK_UNITS.length; index += 1) {
    const unit = getNextMyCornerUnit(state);
    assert.equal(unit.unitId, MYCORNER_OWNER_LOCK_UNITS[index].unitId);
    assert.equal(outcomeFor(state).kind, "owner-lock-unit");
    state = advance(state, MYCORNER_RESTORE_UNITS.length + index + 1).state;
  }

  assert.equal(state.secured, true);
  assert.equal(state.stateId, "mycorner_secured");
  assert.equal(state.evidenceId, MYCORNER_PROVISIONAL_EVIDENCE_ID);
  assert.equal(state.blockedWriteId, MYCORNER_PROVISIONAL_BLOCKED_WRITE_ID);
  assert.equal(outcomeFor(state).reason, "already-secured");
});

test("normalization accepts only the exact completed-unit prefix", () => {
  const outOfOrder = normalizeMyCornerState({
    completedUnitIds: ["owner_about", "theme_friends", "privacy_source", "media_counter"],
    midpointAcknowledged: true,
    secured: true,
  });
  assert.deepEqual(outOfOrder.completedUnitIds, ["owner_about", "theme_friends"]);
  assert.equal(outOfOrder.midpointDiscovered, false);
  assert.equal(outOfOrder.midpointAcknowledged, false);
  assert.equal(outOfOrder.secured, false);

  const wrongStart = normalizeMyCornerState({
    completedUnitIds: ["global_apply_blocked", ...MYCORNER_CAMPAIGN_UNITS.map(({ unitId }) => unitId)],
    evidenceId: MYCORNER_PROVISIONAL_EVIDENCE_ID,
  });
  assert.deepEqual(wrongStart.completedUnitIds, []);
  assert.equal(wrongStart.evidenceId, null);

  const claimedSecured = normalizeMyCornerState({
    blockedWriteId: "fake",
    completedUnitIds: MYCORNER_CAMPAIGN_UNITS.map(({ unitId }) => unitId),
    evidenceId: "fake",
    midpointAcknowledged: false,
    secured: false,
  });
  assert.equal(claimedSecured.secured, true);
  assert.equal(claimedSecured.midpointAcknowledged, true);
  assert.equal(claimedSecured.evidenceId, MYCORNER_PROVISIONAL_EVIDENCE_ID);
  assert.equal(claimedSecured.blockedWriteId, MYCORNER_PROVISIONAL_BLOCKED_WRITE_ID);
});

test("the midpoint must be explicitly acknowledged after restore four saves", () => {
  const notReady = acknowledgeMyCornerMidpointState(stateAt(3));
  assert.equal(notReady.ok, false);
  assert.equal(notReady.reason, "not-ready");

  const midpoint = stateAt(4, { acknowledged: false });
  const blocked = advanceMyCornerState(midpoint, {
    outcome: {
      kind: "owner-lock-unit",
      stateId: "mycorner_owner_lock_1",
      unitId: "profile_owner_lock",
    },
    passageId: "next-passage",
    sessionId: "next-session",
  });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "midpoint-acknowledgement-required");

  const acknowledged = acknowledgeMyCornerMidpointState(midpoint, {
    acknowledgedAt: "2026-07-12T04:31:00.000Z",
  });
  assert.equal(acknowledged.ok, true);
  assert.deepEqual(acknowledged.events, ["midpoint-acknowledged"]);
  assert.equal(acknowledged.state.midpointAcknowledged, true);
  assert.equal(acknowledged.state.completedUnitIds.length, 4);

  const again = acknowledgeMyCornerMidpointState(acknowledged.state);
  assert.equal(again.ok, true);
  assert.equal(again.event, "already-acknowledged");
  assert.deepEqual(again.events, []);
});

test("session, passage, and outcome duplicate protections cannot double-advance", () => {
  const first = advance(normalizeMyCornerState(), 1);
  assert.equal(first.ok, true);

  const duplicateSession = advanceMyCornerState(first.state, {
    outcome: outcomeFor(first.state),
    passageId: "different-passage",
    sessionId: "mycorner-session-1",
  });
  assert.equal(duplicateSession.ok, true);
  assert.equal(duplicateSession.duplicate, true);
  assert.deepEqual(duplicateSession.state.completedUnitIds, ["owner_about"]);

  const duplicatePassage = advanceMyCornerState(first.state, {
    outcome: outcomeFor(first.state),
    passageId: "mycorner-passage-1",
    sessionId: "different-session",
  });
  assert.equal(duplicatePassage.ok, true);
  assert.equal(duplicatePassage.duplicatePassage, true);
  assert.deepEqual(duplicatePassage.state.completedUnitIds, ["owner_about"]);

  const staleUnitClaim = advanceMyCornerState(first.state, {
    outcome: {
      kind: "restore-unit",
      stateId: "mycorner_restore_3",
      unitId: "media_counter",
    },
    passageId: "different-passage",
    sessionId: "different-session",
  });
  assert.equal(staleUnitClaim.ok, true);
  assert.deepEqual(staleUnitClaim.state.completedUnitIds, ["owner_about", "theme_friends"]);
  assert.equal(staleUnitClaim.state.lastReaction, "Chosen theme and friend layout restored. Two module groups remain.");

  const missingPassage = advanceMyCornerState(first.state, {
    outcome: outcomeFor(first.state),
    sessionId: "another-session",
  });
  assert.equal(missingPassage.ok, false);
  assert.equal(missingPassage.reason, "missing-passage-id");
});

test("a rejected reading cannot advance a MyCorner unit", () => {
  const state = normalizeMyCornerState();
  const outcome = calculateMyCornerReadingOutcome({ accepted: false, campaignState: state });
  assert.equal(outcome.kind, "no-progress");
  assert.equal(outcome.reason, "reading-not-accepted");
  const transition = advanceMyCornerState(state, {
    outcome,
    passageId: "rejected-passage",
    sessionId: "rejected-session",
  });
  assert.equal(transition.ok, false);
  assert.equal(transition.reason, "invalid-outcome");
  assert.deepEqual(transition.state.completedUnitIds, []);
});

test("corrupt and write-failing storage remain safe and preserve the in-tab transition", () => {
  const storage = {
    getItem() { return "{not-json"; },
    setItem() { throw new Error("blocked"); },
  };
  const empty = readMyCornerState(storage);
  assert.deepEqual(empty.completedUnitIds, []);
  const transition = applyMyCornerReading(storage, {
    currentState: empty,
    outcome: outcomeFor(empty),
    passageId: "safe-passage",
    sessionId: "safe-session",
  });
  assert.equal(transition.ok, false);
  assert.equal(transition.reason, "write-failed");
  assert.deepEqual(transition.state.completedUnitIds, ["owner_about"]);
  assert.doesNotMatch(JSON.stringify(transition.state), /audio|transcript|score|comprehension/iu);
});

test("a failed midpoint write still returns the acknowledged in-tab state", () => {
  const storage = {
    getItem() { return null; },
    setItem() { throw new Error("blocked"); },
  };
  const midpoint = stateAt(4, { acknowledged: false });
  const transition = acknowledgeMyCornerMidpoint(storage, {
    acknowledgedAt: "tab-only-ack",
    currentState: midpoint,
  });
  assert.equal(transition.ok, false);
  assert.equal(transition.reason, "write-failed");
  assert.equal(transition.state.midpointAcknowledged, true);
  assert.deepEqual(transition.state.completedUnitIds, MYCORNER_RESTORE_UNITS.map(({ unitId }) => unitId));
});

test("storage reconciliation keeps the furthest campaign state and merged duplicate guards", () => {
  const storage = memoryStorage();
  let current = normalizeMyCornerState();

  for (let index = 0; index < 4; index += 1) {
    const transition = applyMyCornerReading(storage, {
      completedAt: `2026-07-12T0${index + 1}:00:00.000Z`,
      currentState: current,
      outcome: outcomeFor(current),
      passageId: `stored-passage-${index + 1}`,
      sessionId: `stored-session-${index + 1}`,
    });
    assert.equal(transition.ok, true);
    current = transition.state;
  }

  const acknowledged = acknowledgeMyCornerMidpoint(storage, {
    acknowledgedAt: "2026-07-12T04:30:00.000Z",
    currentState: normalizeMyCornerState(),
  });
  assert.equal(acknowledged.ok, true);
  assert.equal(acknowledged.state.midpointAcknowledged, true);
  assert.deepEqual(acknowledged.state.completedUnitIds, MYCORNER_RESTORE_UNITS.map(({ unitId }) => unitId));

  const stored = readMyCornerState(storage);
  assert.equal(stored.midpointAcknowledged, true);
  assert.equal(stored.completedPassageIds.length, 4);
  assert.equal(stored.appliedSessionIds.length, 4);
  assert.match(storage.getItem(MYCORNER_STATE_KEY), /mycorner_template_reveal/u);
});

test("a stale tab applies the next authoritative unit without trusting its stale unit claim", () => {
  const storage = memoryStorage();
  const stale = readMyCornerState(storage);
  const first = applyMyCornerReading(storage, {
    completedAt: "first",
    currentState: stale,
    outcome: outcomeFor(stale),
    passageId: "stale-passage-1",
    sessionId: "stale-session-1",
  });
  assert.equal(first.ok, true);

  const second = applyMyCornerReading(storage, {
    completedAt: "second",
    currentState: stale,
    outcome: outcomeFor(stale),
    passageId: "stale-passage-2",
    sessionId: "stale-session-2",
  });
  assert.equal(second.ok, true);
  assert.deepEqual(second.state.completedUnitIds, ["owner_about", "theme_friends"]);
  assert.deepEqual(second.state.completedPassageIds, ["stale-passage-1", "stale-passage-2"]);
});

test("secured progress is permanent and returns no second evidence event", () => {
  const secured = stateAt(7);
  const resumed = normalizeMyCornerState({
    ...secured,
    blockedWriteId: null,
    evidenceId: null,
    secured: false,
  });
  assert.equal(resumed.secured, true);
  assert.equal(resumed.evidenceId, MYCORNER_PROVISIONAL_EVIDENCE_ID);
  assert.equal(resumed.blockedWriteId, MYCORNER_PROVISIONAL_BLOCKED_WRITE_ID);

  const after = advanceMyCornerState(resumed, {
    outcome: { kind: "owner-lock-unit", stateId: "mycorner_owner_lock_3", unitId: "global_apply_blocked" },
    passageId: "eighth-passage",
    sessionId: "eighth-session",
  });
  assert.equal(after.ok, true);
  assert.deepEqual(after.events, ["already-secured"]);
  assert.deepEqual(after.state.completedUnitIds, secured.completedUnitIds);
});
