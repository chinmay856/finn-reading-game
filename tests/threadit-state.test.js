import assert from "node:assert/strict";
import test from "node:test";

import {
  THREADIT_ACT_ONE_UNITS,
  THREADIT_CAMPAIGN_UNITS,
  THREADIT_TRACE_UNITS,
  calculateThreadItReadingOutcome,
  getNextThreadItUnit,
} from "../apps/internet-recovery/threadit-rules.js";
import {
  THREADIT_BLOCKED_WRITE_ID,
  THREADIT_EVIDENCE_ID,
  THREADIT_STATE_KEY,
  acknowledgeThreadItMidpoint,
  acknowledgeThreadItMidpointState,
  advanceThreadItState,
  applyThreadItReading,
  normalizeThreadItState,
  readThreadItState,
} from "../apps/internet-recovery/threadit-state.js";
import { getThreadItCampaignView } from "../apps/internet-recovery/threadit-view.js";

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
  const campaignState = currentState ?? readThreadItState(storage);
  return applyThreadItReading(storage, {
    completedAt: `2026-07-12T0${index}:00:00Z`,
    currentState,
    outcome: calculateThreadItReadingOutcome({ campaignState }),
    passageId: `threadit-passage-${index}`,
    sessionId: `threadit-session-${index}`,
  });
}

function advancePure(state, index) {
  return advanceThreadItState(state, {
    completedAt: `step-${index}`,
    outcome: calculateThreadItReadingOutcome({ campaignState: state }),
    passageId: `diagnostic-passage-${index}`,
    sessionId: `diagnostic-session-${index}`,
  });
}

function reachMidpoint(storage) {
  let result;
  for (let index = 1; index <= 4; index += 1) result = applyNext(storage, index);
  return result;
}

test("empty ThreadIt campaign state is versioned, non-audio, and starts corrupted", () => {
  const state = readThreadItState(null);
  assert.equal(state.version, 1);
  assert.equal(state.siteId, "threadit");
  assert.equal(state.act, "act-one");
  assert.equal(state.stateId, "threadit_corrupted");
  assert.equal(state.secured, false);
  assert.equal(state.evidenceId, null);
  assert.deepEqual(state.completedUnitIds, []);
  assert.equal(normalizeThreadItState(null).stateId, "threadit_corrupted");
});

test("the authored campaign contains exactly four untangle and three trace units", () => {
  assert.deepEqual(
    THREADIT_ACT_ONE_UNITS.map((unit) => [unit.stateId, unit.unitId]),
    [
      ["threadit_untangle_1", "question_origin"],
      ["threadit_untangle_2", "reply_chronology"],
      ["threadit_untangle_3", "citation_origin"],
      ["threadit_untangle_4", "duplicate_disclosure"],
    ],
  );
  assert.deepEqual(
    THREADIT_TRACE_UNITS.map((unit) => [unit.stateId, unit.unitId]),
    [
      ["threadit_trace_1", "shared_origin_verified"],
      ["threadit_trace_2", "independent_sources_separated"],
      ["threadit_trace_3", "duplicate_posting_blocked"],
    ],
  );
  assert.equal(THREADIT_CAMPAIGN_UNITS.length, 7);
});

test("every accepted result advances one authored Act I relationship regardless of metrics", () => {
  const storage = new MemoryStorage();
  for (let index = 1; index <= 4; index += 1) {
    const state = readThreadItState(storage);
    const outcome = calculateThreadItReadingOutcome({
      accepted: true,
      campaignState: state,
      comprehension: "retry-offered",
      readingResult: { accuracy: 1, progress: 0.01, wpm: 1 },
    });
    const result = applyThreadItReading(storage, {
      completedAt: `act-one-${index}`,
      outcome,
      passageId: `act-one-passage-${index}`,
      sessionId: `act-one-session-${index}`,
    });
    assert.equal(result.ok, true);
    assert.equal(result.state.repairCount, index);
    assert.deepEqual(result.state.completedUnitIds, THREADIT_CAMPAIGN_UNITS.slice(0, index).map((unit) => unit.unitId));
  }
  const midpoint = readThreadItState(storage);
  assert.equal(midpoint.stateId, "threadit_untangle_4");
  assert.equal(midpoint.act, "midpoint");
  assert.equal(midpoint.midpointDiscovered, true);
  assert.equal(midpoint.midpointAcknowledged, false);
  assert.equal(midpoint.lastOpenView, "trace");
});

test("production transitions fail closed without an accepted authored outcome", () => {
  const empty = readThreadItState(null);
  const result = advanceThreadItState(empty, {
    passageId: "missing-outcome-passage",
    sessionId: "missing-outcome-session",
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "invalid-outcome");
  assert.equal(result.state.repairCount, 0);
});

test("midpoint discovery saves before acknowledgement and blocks a fifth reading", () => {
  const storage = new MemoryStorage();
  const discovered = reachMidpoint(storage);
  assert.deepEqual(discovered.events, ["unit-complete", "midpoint-discovered"]);
  assert.equal(discovered.state.midpointDiscoveredAt, "2026-07-12T04:00:00Z");
  const readyView = getThreadItCampaignView(discovered.state);
  assert.equal(readyView.activeView, "thread");
  assert.equal(readyView.headerStatus, "TRACE VIEW READY · CONSENSUS CASCADE");
  assert.equal(readyView.ruleLabel, "VOTES RANK ATTENTION, NOT TRUTH");

  const blocked = applyNext(storage, 5);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "midpoint-acknowledgement-required");
  assert.equal(blocked.state.repairCount, 4);

  const acknowledged = acknowledgeThreadItMidpoint(storage, { acknowledgedAt: "midpoint-ack" });
  assert.equal(acknowledged.ok, true);
  assert.equal(acknowledged.event, "midpoint-acknowledged");
  assert.equal(acknowledged.state.stateId, "threadit_tracing");
  assert.equal(acknowledged.state.lastOpenView, "trace");
  assert.equal(acknowledged.state.midpointAcknowledgedAt, "midpoint-ack");
  assert.equal(getThreadItCampaignView(acknowledged.state).headerStatus, "TRACE VIEW · CONSENSUS CASCADE");
});

test("three trace readings secure ThreadIt permanently with evidence and blocked write", () => {
  const storage = new MemoryStorage();
  reachMidpoint(storage);
  acknowledgeThreadItMidpoint(storage, { acknowledgedAt: "midpoint-ack" });

  for (let index = 5; index <= 7; index += 1) {
    const result = applyNext(storage, index);
    assert.equal(result.ok, true);
    assert.equal(result.state.completedUnitIds.length, index);
    assert.equal(result.state.lastCompletedStateId, `threadit_trace_${index - 4}`);
    if (index === 7) {
      assert.deepEqual(result.events, [
        "trace-unit-complete",
        "site-secured",
        "evidence-saved",
        "blocked-write-recorded",
      ]);
    }
  }
  const secured = readThreadItState(storage);
  assert.equal(secured.secured, true);
  assert.equal(secured.act, "secured");
  assert.equal(secured.stateId, "threadit_secured");
  assert.equal(secured.evidenceId, THREADIT_EVIDENCE_ID);
  assert.equal(secured.blockedWriteId, THREADIT_BLOCKED_WRITE_ID);
  assert.equal(secured.repairCount, 7);

  const eighth = applyThreadItReading(storage, {
    completedAt: "step-8",
    outcome: { kind: "trace-unit" },
    passageId: "threadit-passage-8",
    sessionId: "threadit-session-8",
  });
  assert.deepEqual(eighth.events, ["already-secured"]);
  assert.equal(eighth.state.repairCount, 7);
  assert.equal(eighth.state.completedPassageIds.includes("threadit-passage-8"), false);
});

test("pure diagnostic transitions simulate seven units without touching storage", () => {
  let state = readThreadItState(null);
  for (let index = 1; index <= 4; index += 1) state = advancePure(state, index).state;
  const pending = advancePure(state, 5);
  assert.equal(pending.reason, "midpoint-acknowledgement-required");

  state = acknowledgeThreadItMidpointState(state, { acknowledgedAt: "diagnostic-ack" }).state;
  for (let index = 5; index <= 7; index += 1) state = advancePure(state, index).state;
  assert.equal(state.secured, true);
  assert.equal(state.completedUnitIds.length, 7);

  const stopped = advancePure(state, 8);
  assert.deepEqual(stopped.events, ["already-secured"]);
  assert.equal(stopped.state.completedUnitIds.length, 7);
});

test("all prior session and passage IDs remain idempotent", () => {
  const storage = new MemoryStorage();
  applyNext(storage, 1);
  applyNext(storage, 2);

  const duplicateSession = applyThreadItReading(storage, {
    completedAt: "duplicate-session",
    outcome: calculateThreadItReadingOutcome({ campaignState: readThreadItState(storage) }),
    passageId: "new-passage",
    sessionId: "threadit-session-1",
  });
  assert.equal(duplicateSession.duplicate, true);
  assert.equal(duplicateSession.state.repairCount, 2);

  const duplicatePassage = applyThreadItReading(storage, {
    completedAt: "duplicate-passage",
    outcome: calculateThreadItReadingOutcome({ campaignState: readThreadItState(storage) }),
    passageId: "threadit-passage-1",
    sessionId: "new-session",
  });
  assert.equal(duplicatePassage.duplicatePassage, true);
  assert.equal(duplicatePassage.state.repairCount, 2);
});

test("a stale tab reconciles with newer persisted units before applying", () => {
  const storage = new MemoryStorage();
  const stale = readThreadItState(storage);
  applyNext(storage, 1);
  const second = applyThreadItReading(storage, {
    completedAt: "later",
    currentState: stale,
    outcome: { kind: "act-one-unit", unitId: "question_origin" },
    passageId: "threadit-passage-2",
    sessionId: "threadit-session-2",
  });
  assert.equal(second.ok, true);
  assert.deepEqual(second.state.completedUnitIds, ["question_origin", "reply_chronology"]);
  assert.deepEqual(second.state.completedPassageIds, ["threadit-passage-1", "threadit-passage-2"]);
});

test("a stale trace result applies the next persisted trace unit, not its stale claim", () => {
  const storage = new MemoryStorage();
  reachMidpoint(storage);
  const started = acknowledgeThreadItMidpoint(storage, { acknowledgedAt: "start" });
  applyNext(storage, 5);

  const result = applyThreadItReading(storage, {
    completedAt: "later",
    currentState: started.state,
    outcome: { kind: "trace-unit", unitId: "shared_origin_verified" },
    passageId: "threadit-passage-6",
    sessionId: "threadit-session-6",
  });
  assert.equal(result.ok, true);
  assert.equal(result.state.lastCompletedStateId, "threadit_trace_2");
  assert.match(result.state.lastReaction, /Independent sources separated/iu);
});

test("malformed state cannot manufacture skipped units or a secured campaign", () => {
  const normalized = normalizeThreadItState({
    completedUnitIds: ["question_origin", "citation_origin", "duplicate_posting_blocked"],
    evidenceId: THREADIT_EVIDENCE_ID,
    midpointAcknowledged: true,
    secured: true,
    version: 1,
  });
  assert.deepEqual(normalized.completedUnitIds, ["question_origin"]);
  assert.equal(normalized.act, "act-one");
  assert.equal(normalized.secured, false);
  assert.equal(normalized.evidenceId, null);
  assert.equal(normalized.repairCount, 1);
});

test("blocked storage returns the safe in-tab state and can continue from it", () => {
  const storage = new MemoryStorage({ failWrites: true });
  const first = applyThreadItReading(storage, {
    completedAt: "first",
    outcome: { kind: "act-one-unit", unitId: "question_origin" },
    passageId: "passage-1",
    sessionId: "session-1",
  });
  assert.equal(first.ok, false);
  assert.equal(first.reason, "write-failed");
  assert.deepEqual(first.state.completedUnitIds, ["question_origin"]);

  const second = applyThreadItReading(storage, {
    completedAt: "second",
    currentState: first.state,
    outcome: { kind: "act-one-unit", unitId: "reply_chronology" },
    passageId: "passage-2",
    sessionId: "session-2",
  });
  assert.equal(second.ok, false);
  assert.equal(second.reason, "write-failed");
  assert.deepEqual(second.state.completedUnitIds, ["question_origin", "reply_chronology"]);
});

test("corrupt or unavailable reads fail closed to an empty state", () => {
  const malformed = new MemoryStorage();
  malformed.setItem(THREADIT_STATE_KEY, "not-json");
  assert.equal(readThreadItState(malformed).stateId, "threadit_corrupted");
  assert.equal(readThreadItState(new MemoryStorage({ failReads: true })).stateId, "threadit_corrupted");
});

test("persisted campaign state never stores audio, transcript, score, or comprehension", () => {
  const storage = new MemoryStorage();
  applyNext(storage, 1);
  const persisted = storage.getItem(THREADIT_STATE_KEY);
  assert.doesNotMatch(persisted, /audio|transcript|accuracy|wpm|comprehension|score/iu);
  assert.match(persisted, /completedUnitIds/u);
});

test("semantic view model exposes source relationships in text as well as connector style", () => {
  let state = readThreadItState(null);
  for (let index = 1; index <= 4; index += 1) state = advancePure(state, index).state;
  state = acknowledgeThreadItMidpointState(state, { acknowledgedAt: "ack" }).state;
  state = advancePure(state, 5).state;
  const view = getThreadItCampaignView(state);

  const clones = view.nodes.filter((node) => node.duplicateGroupId === "consensus-cascade-01");
  const cloneLinks = view.relationships.filter((item) => item.kind === "shared-generated-origin");
  const nodeIds = new Set(view.nodes.map(({ id }) => id));
  assert.equal(clones.length, 10);
  const cloneVotes = clones.map(({ orderLabel }) => Number(orderLabel.match(/^(\d+) VOTES/u)?.[1]));
  assert.equal(new Set(cloneVotes).size, 10);
  assert.deepEqual(cloneVotes.slice(0, 2), [184, 167]);
  assert.equal(cloneLinks.length, 10);
  assert.ok(cloneLinks.every((item) => item.lineStyle === "purple-double"));
  assert.ok(cloneLinks.every((item) => item.relationshipLabel === "copied from"));
  assert.ok(cloneLinks.every((item) => /not an independent source/iu.test(item.accessibleSummary)));
  assert.ok(view.relationships.every(({ fromNodeId, toNodeId }) => nodeIds.has(fromNodeId) && nodeIds.has(toNodeId)));
  assert.ok(view.nodes.some(({ authorSourceLabel }) => authorSourceLabel === "Facilities Check"));
  assert.equal(view.nodes.some(({ authorSourceLabel }) => authorSourceLabel === "KitchenSafe field notes"), false);
  assert.equal(view.midpoint.truthLine, "TEN ACCOUNTS · ONE SOURCE");
  assert.equal("percent" in view.progress, false);
});

test("reduced-motion view swaps state while preserving the same semantic tree", () => {
  let state = readThreadItState(null);
  for (let index = 1; index <= 4; index += 1) state = advancePure(state, index).state;
  const animated = getThreadItCampaignView(state);
  const reduced = getThreadItCampaignView(state, { reducedMotion: true });
  assert.deepEqual(reduced.nodes, animated.nodes);
  assert.deepEqual(reduced.relationships, animated.relationships);
  assert.equal(reduced.motion.mode, "state-swap");
  assert.equal(reduced.motion.cloneSequenceMs, 0);
});

test("secured view preserves disagreement and keeps duplicates visible in quarantine", () => {
  let state = readThreadItState(null);
  for (let index = 1; index <= 4; index += 1) state = advancePure(state, index).state;
  state = acknowledgeThreadItMidpointState(state, { acknowledgedAt: "ack" }).state;
  for (let index = 5; index <= 7; index += 1) state = advancePure(state, index).state;
  const view = getThreadItCampaignView(state);

  assert.equal(view.headerStatus, "SOURCE TREE STABLE");
  assert.equal(view.bottomStatus, "ORIGINAL QUESTION RESTORED · SOURCES SEPARATED");
  assert.equal(view.legitimateDisagreementPreserved, true);
  assert.equal(view.blockedWrite.title, "POSTING PAUSED: DUPLICATE SOURCE");
  assert.equal(view.evidence.id, THREADIT_EVIDENCE_ID);
  assert.equal(view.evidence.whatChanged, "Votes can rank attention, but independent source lineage decides trust.");
  assert.match(view.evidence.aiBehavior, /counted the copies as agreement/u);
  assert.equal(view.nodes.filter((node) => node.originType === "generated-copy").length, 11);
  assert.equal(view.relationships.filter((item) => item.lineStyle === "red-dashed").length, 10);
  assert.ok(view.relationships.some((item) => item.lineStyle === "green-solid"));
  assert.ok(view.nodes.some((node) => node.authorSourceLabel === "CivicArchive"));
  assert.match(view.ariaDescription, /remain visible in quarantine/iu);
});

test("rules stop at the midpoint and secured boundaries", () => {
  let state = readThreadItState(null);
  assert.equal(getNextThreadItUnit(state).unitId, "question_origin");
  for (let index = 1; index <= 4; index += 1) state = advancePure(state, index).state;
  assert.equal(getNextThreadItUnit(state), null);
  assert.equal(calculateThreadItReadingOutcome({ campaignState: state }).reason, "midpoint-acknowledgement-required");
  state = acknowledgeThreadItMidpointState(state).state;
  for (let index = 5; index <= 7; index += 1) state = advancePure(state, index).state;
  assert.equal(getNextThreadItUnit(state), null);
  assert.equal(calculateThreadItReadingOutcome({ campaignState: state }).reason, "already-secured");
});
