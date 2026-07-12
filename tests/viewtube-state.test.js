import test from "node:test";
import assert from "node:assert/strict";

import {
  VIEWTUBE_CAMPAIGN_UNITS,
  VIEWTUBE_RESTORE_UNITS,
  VIEWTUBE_TRACK_UNITS,
  calculateViewTubeReadingOutcome,
  getNextViewTubeUnit,
} from "../apps/internet-recovery/viewtube-rules.js";
import {
  VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID,
  VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  VIEWTUBE_PROVISIONAL_EVIDENCE_ID,
  VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
  VIEWTUBE_STATE_KEY,
  acknowledgeViewTubeMidpoint,
  acknowledgeViewTubeMidpointState,
  advanceViewTubeState,
  applyViewTubeReading,
  normalizeViewTubeState,
  readViewTubeState,
} from "../apps/internet-recovery/viewtube-state.js";

function outcomeFor(state) {
  return calculateViewTubeReadingOutcome({ accepted: true, campaignState: state });
}

function advance(state, ordinal) {
  return advanceViewTubeState(state, {
    completedAt: `2026-07-12T${String(ordinal).padStart(2, "0")}:00:00.000Z`,
    outcome: outcomeFor(state),
    passageId: `viewtube-passage-${ordinal}`,
    sessionId: `viewtube-session-${ordinal}`,
  });
}

function stateAt(completedCount, { acknowledged = true } = {}) {
  let state = normalizeViewTubeState();
  for (let index = 0; index < completedCount; index += 1) {
    if (index === VIEWTUBE_RESTORE_UNITS.length && acknowledged) {
      state = acknowledgeViewTubeMidpointState(state, {
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

test("seven ViewTube readings save autoplay discovery, acknowledgement, and secured tracks", () => {
  let state = normalizeViewTubeState();
  assert.equal(state.stateId, "viewtube_corrupted");
  assert.equal(state.act, "restore");

  for (let index = 0; index < VIEWTUBE_RESTORE_UNITS.length; index += 1) {
    assert.equal(getNextViewTubeUnit(state).unitId, VIEWTUBE_RESTORE_UNITS[index].unitId);
    state = advance(state, index + 1).state;
  }

  assert.equal(state.stateId, "viewtube_autoplay_loop");
  assert.equal(state.act, "midpoint");
  assert.equal(state.midpointDiscovered, true);
  assert.equal(state.midpointAcknowledged, false);
  assert.equal(outcomeFor(state).reason, "midpoint-acknowledgement-required");

  state = acknowledgeViewTubeMidpointState(state, {
    acknowledgedAt: "2026-07-12T04:30:00.000Z",
  }).state;
  assert.equal(state.stateId, "viewtube_autoplay_loop");
  assert.equal(state.act, "track");

  for (let index = 0; index < VIEWTUBE_TRACK_UNITS.length; index += 1) {
    assert.equal(getNextViewTubeUnit(state).unitId, VIEWTUBE_TRACK_UNITS[index].unitId);
    state = advance(state, VIEWTUBE_RESTORE_UNITS.length + index + 1).state;
  }

  assert.equal(state.stateId, "viewtube_secured");
  assert.equal(state.secured, true);
  assert.equal(state.evidenceId, VIEWTUBE_PROVISIONAL_EVIDENCE_ID);
  assert.equal(state.blockedWriteId, VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID);
  assert.equal(outcomeFor(state).reason, "already-secured");
});

test("normalization accepts only the exact prefix and cannot manufacture secured evidence", () => {
  const outOfOrder = normalizeViewTubeState({
    completedUnitIds: ["recording_identity", "transcript_track", "distinct_frames"],
    midpointAcknowledged: true,
    secured: true,
  });
  assert.deepEqual(outOfOrder.completedUnitIds, ["recording_identity"]);
  assert.equal(outOfOrder.midpointDiscovered, false);
  assert.equal(outOfOrder.midpointAcknowledged, false);
  assert.equal(outOfOrder.secured, false);
  assert.equal(outOfOrder.evidenceId, null);

  const wrongStart = normalizeViewTubeState({
    blockedWriteId: VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID,
    completedUnitIds: ["footage_track_verified", ...VIEWTUBE_CAMPAIGN_UNITS.map(({ unitId }) => unitId)],
    evidenceId: VIEWTUBE_PROVISIONAL_EVIDENCE_ID,
  });
  assert.deepEqual(wrongStart.completedUnitIds, []);
  assert.equal(wrongStart.evidenceId, null);
  assert.equal(wrongStart.blockedWriteId, null);

  const completed = normalizeViewTubeState({
    blockedWriteId: "forged",
    completedUnitIds: VIEWTUBE_CAMPAIGN_UNITS.map(({ unitId }) => unitId),
    evidenceId: "forged",
    midpointAcknowledged: false,
    secured: false,
  });
  assert.equal(completed.secured, true);
  assert.equal(completed.midpointAcknowledged, true);
  assert.equal(completed.evidenceId, VIEWTUBE_PROVISIONAL_EVIDENCE_ID);
  assert.equal(completed.blockedWriteId, VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID);
});

test("the saved autoplay loop blocks track readings until explicit acknowledgement", () => {
  const notReady = acknowledgeViewTubeMidpointState(stateAt(3));
  assert.equal(notReady.ok, false);
  assert.equal(notReady.reason, "not-ready");

  const midpoint = stateAt(4, { acknowledged: false });
  const blocked = advanceViewTubeState(midpoint, {
    outcome: { kind: "track-unit", stateId: "viewtube_track_1", unitId: "footage_track_verified" },
    passageId: "next-passage",
    sessionId: "next-session",
  });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "midpoint-acknowledgement-required");

  const acknowledged = acknowledgeViewTubeMidpointState(midpoint, {
    acknowledgedAt: "2026-07-12T04:31:00.000Z",
  });
  assert.equal(acknowledged.ok, true);
  assert.deepEqual(acknowledged.events, ["midpoint-acknowledged"]);
  assert.equal(acknowledged.state.midpointAcknowledged, true);
  assert.equal(acknowledged.state.completedUnitIds.length, 4);

  const again = acknowledgeViewTubeMidpointState(acknowledged.state);
  assert.equal(again.ok, true);
  assert.equal(again.event, "already-acknowledged");
  assert.deepEqual(again.events, []);
});

test("session, passage, and outcome guards cannot double-advance or select a unit", () => {
  const first = advance(normalizeViewTubeState(), 1);
  assert.equal(first.ok, true);

  const duplicateSession = advanceViewTubeState(first.state, {
    outcome: outcomeFor(first.state),
    passageId: "different-passage",
    sessionId: "viewtube-session-1",
  });
  assert.equal(duplicateSession.duplicate, true);
  assert.deepEqual(duplicateSession.state.completedUnitIds, ["recording_identity"]);

  const duplicatePassage = advanceViewTubeState(first.state, {
    outcome: outcomeFor(first.state),
    passageId: "viewtube-passage-1",
    sessionId: "different-session",
  });
  assert.equal(duplicatePassage.duplicatePassage, true);
  assert.deepEqual(duplicatePassage.state.completedUnitIds, ["recording_identity"]);

  const staleUnitClaim = advanceViewTubeState(first.state, {
    outcome: { kind: "restore-unit", stateId: "viewtube_restore_4", unitId: "source_context" },
    passageId: "different-passage",
    sessionId: "different-session",
  });
  assert.equal(staleUnitClaim.ok, true);
  assert.deepEqual(staleUnitClaim.state.completedUnitIds, ["recording_identity", "distinct_frames"]);

  const rejected = advanceViewTubeState(first.state, {
    outcome: calculateViewTubeReadingOutcome({ accepted: false, campaignState: first.state }),
    passageId: "rejected-passage",
    sessionId: "rejected-session",
  });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "invalid-outcome");

  const missingPassage = advanceViewTubeState(first.state, {
    outcome: outcomeFor(first.state),
    sessionId: "missing-passage",
  });
  assert.equal(missingPassage.reason, "missing-passage-id");
});

test("stale tabs reconcile to authoritative progress without trusting stale unit claims", () => {
  const storage = memoryStorage();
  const stale = readViewTubeState(storage);
  const first = applyViewTubeReading(storage, {
    currentState: stale,
    outcome: outcomeFor(stale),
    passageId: "stale-passage-1",
    sessionId: "stale-session-1",
  });
  assert.equal(first.ok, true);

  const second = applyViewTubeReading(storage, {
    currentState: stale,
    outcome: outcomeFor(stale),
    passageId: "stale-passage-2",
    sessionId: "stale-session-2",
  });
  assert.equal(second.ok, true);
  assert.deepEqual(second.state.completedUnitIds, ["recording_identity", "distinct_frames"]);
  assert.deepEqual(second.state.completedPassageIds, ["stale-passage-1", "stale-passage-2"]);

  let current = second.state;
  for (let ordinal = 3; ordinal <= 4; ordinal += 1) {
    const transition = applyViewTubeReading(storage, {
      currentState: current,
      outcome: outcomeFor(current),
      passageId: `stale-passage-${ordinal}`,
      sessionId: `stale-session-${ordinal}`,
    });
    assert.equal(transition.ok, true);
    current = transition.state;
  }
  const staleBeforeMidpoint = stateAt(3);
  const boundaryAttempt = applyViewTubeReading(storage, {
    currentState: staleBeforeMidpoint,
    outcome: outcomeFor(staleBeforeMidpoint),
    passageId: "must-not-cross-midpoint",
    sessionId: "must-not-cross-midpoint",
  });
  assert.equal(boundaryAttempt.ok, false);
  assert.equal(boundaryAttempt.reason, "midpoint-acknowledgement-required");
});

test("corrupt reads and failed writes preserve safe in-tab reading and acknowledgement", () => {
  const storage = {
    getItem() { return "{not-json"; },
    setItem() { throw new Error("blocked"); },
  };
  const empty = readViewTubeState(storage);
  assert.deepEqual(empty.completedUnitIds, []);

  const first = applyViewTubeReading(storage, {
    currentState: empty,
    outcome: outcomeFor(empty),
    passageId: "tab-passage-1",
    sessionId: "tab-session-1",
  });
  assert.equal(first.ok, false);
  assert.equal(first.reason, "write-failed");
  assert.deepEqual(first.state.completedUnitIds, ["recording_identity"]);

  const second = applyViewTubeReading(storage, {
    currentState: first.state,
    outcome: outcomeFor(first.state),
    passageId: "tab-passage-2",
    sessionId: "tab-session-2",
  });
  assert.equal(second.ok, false);
  assert.equal(second.reason, "write-failed");
  assert.deepEqual(second.state.completedUnitIds, ["recording_identity", "distinct_frames"]);

  const midpoint = stateAt(4, { acknowledged: false });
  const acknowledgement = acknowledgeViewTubeMidpoint(storage, {
    acknowledgedAt: "tab-only-ack",
    currentState: midpoint,
  });
  assert.equal(acknowledgement.ok, false);
  assert.equal(acknowledgement.reason, "write-failed");
  assert.equal(acknowledgement.state.midpointAcknowledged, true);
  assert.deepEqual(
    acknowledgement.state.completedUnitIds,
    VIEWTUBE_RESTORE_UNITS.map(({ unitId }) => unitId),
  );
});

test("persisted ViewTube state strips microphone, scoring, and reading-result payloads", () => {
  const storage = memoryStorage();
  const empty = readViewTubeState(storage);
  const transition = applyViewTubeReading(storage, {
    accuracy: 0.98,
    audioBlob: "must-not-persist",
    comprehension: { answer: "must-not-persist" },
    currentState: {
      ...empty,
      microphoneState: "capturing",
      rawTranscript: "must-not-persist",
      score: 999,
      wordsMatched: 100,
      wpm: 140,
    },
    microphoneState: "capturing",
    outcome: {
      ...outcomeFor(empty),
      accuracy: 0.98,
      rawTranscript: "must-not-persist",
      score: 999,
      wpm: 140,
    },
    passageId: "privacy-passage",
    rawTranscript: "must-not-persist",
    sessionId: "privacy-session",
  });
  assert.equal(transition.ok, true);

  const serialized = storage.getItem(VIEWTUBE_STATE_KEY);
  assert.doesNotMatch(
    serialized,
    /accuracy|audioBlob|comprehension|microphoneState|rawTranscript|score|wordsMatched|wpm/iu,
  );
  assert.equal(Object.hasOwn(transition.state, "microphoneState"), false);
  assert.equal(Object.hasOwn(transition.state, "score"), false);
});

test("slot-six evidence and blocked-write records match the canonical contract", () => {
  for (const record of [
    VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
    VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  ]) {
    assert.equal(record.siteId, "viewtube");
    assert.equal(record.slot, 6);
    assert.equal(record.canonical, true);
    assert.equal(record.eligibleForCanonicalCount, true);
    assert.equal(record.provisional, false);
    assert.equal(record.testOnly, false);
    assert.equal(record.registryStatus, "canonical-secured-only");
    assert.ok(Object.isFrozen(record));
  }
  assert.equal(VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD.title, "VIEWTUBE / DUPLICATE MEDIA HASHES");
  assert.equal(
    VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD.title,
    "DUPLICATE FRAMES - NO NEW EVIDENCE",
  );
});

test("secured ViewTube progress is permanent and emits no second evidence event", () => {
  const secured = stateAt(7);
  const resumed = normalizeViewTubeState({
    ...secured,
    blockedWriteId: null,
    evidenceId: null,
    secured: false,
  });
  assert.equal(resumed.secured, true);
  assert.equal(resumed.evidenceId, VIEWTUBE_PROVISIONAL_EVIDENCE_ID);
  assert.equal(resumed.blockedWriteId, VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID);

  const after = advanceViewTubeState(resumed, {
    outcome: { kind: "track-unit", stateId: "viewtube_track_3", unitId: "source_track_verified" },
    passageId: "eighth-passage",
    sessionId: "eighth-session",
  });
  assert.equal(after.ok, true);
  assert.deepEqual(after.events, ["already-secured"]);
  assert.deepEqual(after.state.completedUnitIds, secured.completedUnitIds);
});
