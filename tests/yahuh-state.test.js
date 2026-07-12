import test from "node:test";
import assert from "node:assert/strict";

import {
  YAHUH_CAMPAIGN_UNITS,
  YAHUH_RECONNECT_UNITS,
  YAHUH_SORT_UNITS,
  calculateYahuhReadingOutcome,
  getNextYahuhUnit,
} from "../apps/internet-recovery/yahuh-rules.js";
import {
  YAHUH_PROVISIONAL_BLOCKED_WRITE_ID,
  YAHUH_PROVISIONAL_EVIDENCE_ID,
  YAHUH_STATE_KEY,
  acknowledgeYahuhMidpoint,
  acknowledgeYahuhMidpointState,
  advanceYahuhState,
  applyYahuhReading,
  normalizeYahuhState,
  readYahuhState,
} from "../apps/internet-recovery/yahuh-state.js";

function outcomeFor(state) {
  return calculateYahuhReadingOutcome({ accepted: true, campaignState: state });
}

function advance(state, ordinal) {
  return advanceYahuhState(state, {
    completedAt: `2026-07-12T0${ordinal}:00:00.000Z`,
    outcome: outcomeFor(state),
    passageId: `yahuh-passage-${ordinal}`,
    sessionId: `yahuh-session-${ordinal}`,
  });
}

function stateAt(completedCount, { acknowledged = true } = {}) {
  let state = normalizeYahuhState();
  for (let index = 0; index < completedCount; index += 1) {
    if (index === YAHUH_SORT_UNITS.length && acknowledged) {
      state = acknowledgeYahuhMidpointState(state, { acknowledgedAt: "midpoint-ack" }).state;
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
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, value); },
  };
}

test("the six Yahuh readings save a midpoint, acknowledgement, and permanent secured state", () => {
  let state = normalizeYahuhState();
  assert.equal(state.stateId, "yahuh_corrupted");
  assert.equal(state.act, "sort");
  for (let index = 0; index < YAHUH_SORT_UNITS.length; index += 1) {
    assert.equal(getNextYahuhUnit(state).unitId, YAHUH_SORT_UNITS[index].unitId);
    state = advance(state, index + 1).state;
  }
  assert.equal(state.stateId, "yahuh_single_stream");
  assert.equal(state.midpointDiscovered, true);
  assert.equal(state.midpointAcknowledged, false);
  assert.equal(outcomeFor(state).reason, "midpoint-acknowledgement-required");

  state = acknowledgeYahuhMidpointState(state, { acknowledgedAt: "midpoint-ack" }).state;
  assert.equal(state.stateId, "yahuh_single_stream");
  assert.equal(state.act, "reconnect");
  for (let index = 0; index < YAHUH_RECONNECT_UNITS.length; index += 1) {
    assert.equal(getNextYahuhUnit(state).unitId, YAHUH_RECONNECT_UNITS[index].unitId);
    state = advance(state, YAHUH_SORT_UNITS.length + index + 1).state;
  }
  assert.equal(state.stateId, "yahuh_secured");
  assert.equal(state.secured, true);
  assert.equal(state.evidenceId, YAHUH_PROVISIONAL_EVIDENCE_ID);
  assert.equal(state.blockedWriteId, YAHUH_PROVISIONAL_BLOCKED_WRITE_ID);
  assert.equal(outcomeFor(state).reason, "already-secured");
});

test("normalization accepts only the exact unit prefix and cannot manufacture secured evidence", () => {
  const outOfOrder = normalizeYahuhState({
    completedUnitIds: ["news_weather_sorted", "mail_sponsored_sorted", "finance_sports_sorted"],
    midpointAcknowledged: true,
    secured: true,
  });
  assert.deepEqual(outOfOrder.completedUnitIds, ["news_weather_sorted"]);
  assert.equal(outOfOrder.midpointDiscovered, false);
  assert.equal(outOfOrder.secured, false);
  assert.equal(outOfOrder.evidenceId, null);

  const completed = normalizeYahuhState({
    completedUnitIds: YAHUH_CAMPAIGN_UNITS.map(({ unitId }) => unitId),
    evidenceId: "forged",
    blockedWriteId: "forged",
    midpointAcknowledged: false,
    secured: false,
  });
  assert.equal(completed.secured, true);
  assert.equal(completed.midpointAcknowledged, true);
  assert.equal(completed.evidenceId, YAHUH_PROVISIONAL_EVIDENCE_ID);
  assert.equal(completed.blockedWriteId, YAHUH_PROVISIONAL_BLOCKED_WRITE_ID);
});

test("the saved midpoint blocks a fourth reading until explicit acknowledgement", () => {
  const midpoint = stateAt(3, { acknowledged: false });
  const blocked = advanceYahuhState(midpoint, {
    outcome: { kind: "reconnect-unit" },
    passageId: "fourth-passage",
    sessionId: "fourth-session",
  });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "midpoint-acknowledgement-required");

  const notReady = acknowledgeYahuhMidpointState(stateAt(2));
  assert.equal(notReady.ok, false);
  assert.equal(notReady.reason, "not-ready");
  const acknowledged = acknowledgeYahuhMidpointState(midpoint, { acknowledgedAt: "ack" });
  assert.equal(acknowledged.ok, true);
  assert.deepEqual(acknowledged.events, ["midpoint-acknowledged"]);
  assert.equal(acknowledged.state.completedUnitIds.length, 3);
});

test("duplicates and rejected or malformed outcomes never double-advance", () => {
  const empty = normalizeYahuhState();
  const first = advance(empty, 1);
  const duplicateSession = advanceYahuhState(first.state, {
    outcome: outcomeFor(first.state),
    passageId: "different-passage",
    sessionId: "yahuh-session-1",
  });
  assert.equal(duplicateSession.duplicate, true);
  const duplicatePassage = advanceYahuhState(first.state, {
    outcome: outcomeFor(first.state),
    passageId: "yahuh-passage-1",
    sessionId: "different-session",
  });
  assert.equal(duplicatePassage.duplicatePassage, true);

  const rejected = advanceYahuhState(first.state, {
    outcome: calculateYahuhReadingOutcome({ accepted: false, campaignState: first.state }),
    passageId: "rejected",
    sessionId: "rejected",
  });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.reason, "invalid-outcome");
  assert.deepEqual(rejected.state.completedUnitIds, ["news_weather_sorted"]);

  const missingPassage = advanceYahuhState(first.state, {
    outcome: outcomeFor(first.state),
    sessionId: "missing-passage",
  });
  assert.equal(missingPassage.reason, "missing-passage-id");
});

test("stale tabs reconcile to authoritative progress without trusting stale unit claims", () => {
  const storage = memoryStorage();
  const stale = readYahuhState(storage);
  const first = applyYahuhReading(storage, {
    currentState: stale,
    outcome: outcomeFor(stale),
    passageId: "stale-passage-1",
    sessionId: "stale-session-1",
  });
  assert.equal(first.ok, true);
  const second = applyYahuhReading(storage, {
    currentState: stale,
    outcome: outcomeFor(stale),
    passageId: "stale-passage-2",
    sessionId: "stale-session-2",
  });
  assert.equal(second.ok, true);
  assert.deepEqual(second.state.completedUnitIds, ["news_weather_sorted", "finance_sports_sorted"]);
  assert.deepEqual(second.state.completedPassageIds, ["stale-passage-1", "stale-passage-2"]);
});

test("corrupt reads and failed writes preserve safe in-tab reading and midpoint transitions", () => {
  const storage = {
    getItem() { return "{not-json"; },
    setItem() { throw new Error("blocked"); },
  };
  const empty = readYahuhState(storage);
  assert.deepEqual(empty.completedUnitIds, []);
  const reading = applyYahuhReading(storage, {
    currentState: empty,
    outcome: outcomeFor(empty),
    passageId: "tab-passage",
    sessionId: "tab-session",
  });
  assert.equal(reading.ok, false);
  assert.equal(reading.reason, "write-failed");
  assert.deepEqual(reading.state.completedUnitIds, ["news_weather_sorted"]);

  const midpoint = stateAt(3, { acknowledged: false });
  const acknowledgement = acknowledgeYahuhMidpoint(storage, {
    currentState: midpoint,
    acknowledgedAt: "tab-only-ack",
  });
  assert.equal(acknowledgement.ok, false);
  assert.equal(acknowledgement.reason, "write-failed");
  assert.equal(acknowledgement.state.midpointAcknowledged, true);
});

test("persisted Yahuh state contains no audio, transcript, score, or reading metrics", () => {
  const storage = memoryStorage();
  const empty = readYahuhState(storage);
  const transition = applyYahuhReading(storage, {
    currentState: empty,
    outcome: outcomeFor(empty),
    passageId: "privacy-passage",
    sessionId: "privacy-session",
  });
  assert.equal(transition.ok, true);
  const serialized = storage.getItem(YAHUH_STATE_KEY);
  assert.doesNotMatch(serialized, /audio|transcript|score|wpm|accuracy|comprehension/iu);
});

test("secured Yahuh is permanent and emits no second evidence event", () => {
  const secured = stateAt(6);
  const after = advanceYahuhState(secured, {
    outcome: { kind: "reconnect-unit" },
    passageId: "seventh-passage",
    sessionId: "seventh-session",
  });
  assert.equal(after.ok, true);
  assert.deepEqual(after.events, ["already-secured"]);
  assert.deepEqual(after.state.completedUnitIds, secured.completedUnitIds);
});
