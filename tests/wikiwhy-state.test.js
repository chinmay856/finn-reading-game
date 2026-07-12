import assert from "node:assert/strict";
import test from "node:test";

import {
  WIKIWHY_EVIDENCE_ID,
  WIKIWHY_STATE_KEY,
  applyWikiWhyReading,
  beginWikiWhyShield,
  readWikiWhyState,
} from "../apps/internet-recovery/wikiwhy-state.js";

class MemoryStorage {
  constructor({ failWrites = false } = {}) {
    this.failWrites = failWrites;
    this.values = new Map();
  }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) {
    if (this.failWrites) throw new Error("storage blocked");
    this.values.set(key, value);
  }
}

function actOneReading(storage, {
  advance = 19,
  passageId = "passage-a01",
  repairedAt = "2026-07-12T01:00:00Z",
  sessionId = "session-1",
} = {}) {
  return applyWikiWhyReading(storage, {
    outcome: { advance, kind: "act-one-repair", reaction: "That held." },
    passageId,
    repairedAt,
    sessionId,
  });
}

function shieldReading(storage, pass) {
  return applyWikiWhyReading(storage, {
    outcome: { advance: 0, kind: "shield-pass", reaction: `Shield pass ${pass}.` },
    passageId: `shield-passage-${pass}`,
    repairedAt: `2026-07-12T02:00:0${pass}Z`,
    sessionId: `shield-session-${pass}`,
  });
}

test("empty WikiWhy campaign state starts in Act I without evidence", () => {
  const state = readWikiWhyState(null);
  assert.equal(state.version, 3);
  assert.equal(state.phase, "act-one");
  assert.equal(state.stability, 0);
  assert.equal(state.evidenceId, null);
  assert.deepEqual(state.appliedSessionIds, []);
});

test("one Act I reading can emit the warning and rewrite events in order", () => {
  const storage = new MemoryStorage();
  storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify({
    phase: "act-one",
    repairCount: 3,
    stability: 60,
    version: 3,
  }));
  const result = actOneReading(storage, { advance: 20 });
  assert.equal(result.ok, true);
  assert.deepEqual(result.events, ["amy-warning", "reverse-hack-ready"]);
  assert.equal(result.state.phase, "reverse-hack");
  assert.equal(result.state.stability, 80);
  assert.equal(result.state.warningTriggered, true);
  assert.equal(result.state.evidenceId, null);
});

test("Shield Protocol begins explicitly and secures WikiWhy in exactly three readings", () => {
  const storage = new MemoryStorage();
  storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify({
    phase: "reverse-hack",
    repairCount: 5,
    stability: 80,
    version: 3,
    warningTriggered: true,
  }));
  const started = beginWikiWhyShield(storage, { startedAt: "2026-07-12T02:00:00Z" });
  assert.equal(started.ok, true);
  assert.equal(started.state.phase, "shield");
  assert.equal(started.state.shieldProgress, 0);

  const expectedProgress = [33, 66, 100];
  for (let pass = 1; pass <= 3; pass += 1) {
    const result = shieldReading(storage, pass);
    assert.equal(result.ok, true);
    assert.equal(result.state.shieldPass, pass);
    assert.equal(result.state.shieldProgress, expectedProgress[pass - 1]);
    assert.equal(result.state.evidenceId, pass === 3 ? WIKIWHY_EVIDENCE_ID : null);
  }
  const secured = readWikiWhyState(storage);
  assert.equal(secured.phase, "secured");
  assert.equal(secured.stability, 100);
  assert.equal(secured.repairCount, 8);

  const fourth = shieldReading(storage, 4);
  assert.deepEqual(fourth.events, ["already-secured"]);
  assert.equal(fourth.state.repairCount, 8);
  assert.equal(fourth.state.shieldPass, 3);
});

test("Shield start is resumable and cannot begin before the rewrite", () => {
  const storage = new MemoryStorage();
  assert.equal(beginWikiWhyShield(storage).reason, "not-ready");
  storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify({ phase: "reverse-hack", stability: 80, version: 3 }));
  const first = beginWikiWhyShield(storage, { startedAt: "first" });
  const resumed = beginWikiWhyShield(storage, { startedAt: "second" });
  assert.equal(resumed.event, "already-started");
  assert.equal(resumed.state.shieldStartedAt, first.state.shieldStartedAt);
});

test("any previously applied session stays idempotent, not only the latest one", () => {
  const storage = new MemoryStorage();
  actOneReading(storage, { sessionId: "session-1" });
  actOneReading(storage, { passageId: "passage-a02", sessionId: "session-2" });
  const duplicate = actOneReading(storage, { sessionId: "session-1" });
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.state.repairCount, 2);
  assert.equal(duplicate.state.stability, 38);
});

test("a second session cannot advance the campaign with the same passage", () => {
  const storage = new MemoryStorage();
  actOneReading(storage, { passageId: "same-passage", sessionId: "session-1" });
  const repeated = actOneReading(storage, { passageId: "same-passage", sessionId: "session-2" });
  assert.equal(repeated.duplicatePassage, true);
  assert.equal(repeated.state.repairCount, 1);
  assert.equal(repeated.state.stability, 19);
});

test("a stale tab reconciles with newer persisted progress before applying", () => {
  const storage = new MemoryStorage();
  const stale = readWikiWhyState(storage);
  actOneReading(storage, { passageId: "passage-a01", sessionId: "session-1" });
  const second = applyWikiWhyReading(storage, {
    currentState: stale,
    outcome: { advance: 19, kind: "act-one-repair", reaction: "That held." },
    passageId: "passage-a02",
    repairedAt: "later",
    sessionId: "session-2",
  });
  assert.equal(second.state.repairCount, 2);
  assert.equal(second.state.stability, 38);
  assert.deepEqual(second.state.completedPassageIds, ["passage-a01", "passage-a02"]);
});

test("a stale Act I result adopts a newer rewrite or Shield phase without consuming it", () => {
  const storage = new MemoryStorage();
  const stale = readWikiWhyState(storage);
  storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify({
    phase: "reverse-hack",
    repairCount: 5,
    stability: 80,
    version: 3,
    warningTriggered: true,
  }));
  const rewrite = applyWikiWhyReading(storage, {
    currentState: stale,
    outcome: { advance: 19, kind: "act-one-repair", reaction: "That held." },
    passageId: "stale-passage",
    repairedAt: "later",
    sessionId: "stale-session",
  });
  assert.equal(rewrite.reason, "shield-not-started");
  assert.equal(rewrite.state.phase, "reverse-hack");
  assert.equal(rewrite.state.repairCount, 5);

  const started = beginWikiWhyShield(storage, { currentState: rewrite.state, startedAt: "start" });
  shieldReading(storage, 1);
  const resumed = beginWikiWhyShield(storage, { currentState: rewrite.state, startedAt: "stale-start" });
  assert.equal(started.state.phase, "shield");
  assert.equal(resumed.state.phase, "shield");
  assert.equal(resumed.state.shieldPass, 1);
  assert.equal(resumed.event, "already-started");
  shieldReading(storage, 2);
  shieldReading(storage, 3);
  const secured = beginWikiWhyShield(storage, { currentState: rewrite.state, startedAt: "stale-again" });
  assert.equal(secured.state.phase, "secured");
  assert.equal(secured.state.shieldPass, 3);
  assert.equal(secured.event, "already-started");
});

test("a stale Shield result derives its reaction from the pass actually applied", () => {
  const storage = new MemoryStorage();
  storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify({
    phase: "reverse-hack",
    repairCount: 5,
    stability: 80,
    version: 3,
    warningTriggered: true,
  }));
  const started = beginWikiWhyShield(storage, { startedAt: "start" });
  shieldReading(storage, 1);
  const applied = applyWikiWhyReading(storage, {
    currentState: started.state,
    outcome: {
      advance: 0,
      kind: "shield-pass",
      reaction: "Content layer recovered. Two repairs remain.",
    },
    passageId: "shield-passage-2",
    repairedAt: "later",
    sessionId: "shield-session-2",
  });
  assert.equal(applied.state.shieldPass, 2);
  assert.match(applied.state.lastReaction, /one repair remains/iu);
});

test("a stale Shield result cannot claim credit after another tab secures WikiWhy", () => {
  const storage = new MemoryStorage();
  storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify({
    phase: "reverse-hack",
    repairCount: 5,
    stability: 80,
    version: 3,
    warningTriggered: true,
  }));
  const started = beginWikiWhyShield(storage, { startedAt: "start" });
  shieldReading(storage, 1);
  shieldReading(storage, 2);
  const secured = shieldReading(storage, 3);
  const stale = applyWikiWhyReading(storage, {
    currentState: started.state,
    outcome: { advance: 0, kind: "shield-pass", reaction: "Wrong stale reaction." },
    passageId: "stale-shield-passage",
    repairedAt: "later",
    sessionId: "stale-shield-session",
  });
  assert.deepEqual(stale.events, ["already-secured"]);
  assert.equal(stale.state.phase, "secured");
  assert.equal(stale.state.repairCount, secured.state.repairCount);
  assert.equal(stale.state.completedPassageIds.includes("stale-shield-passage"), false);
});

test("malformed v3 data falls back to a valid v2 state at the rewrite boundary", () => {
  const storage = new MemoryStorage();
  storage.setItem(WIKIWHY_STATE_KEY, "not-json");
  storage.setItem("internet-recovery-98.wikiwhy.prototype.v2", JSON.stringify({
    lastPassageId: "legacy-passage",
    lastSessionId: "legacy-session",
    repairCount: 5,
    stability: 80,
    version: 2,
  }));
  const migrated = readWikiWhyState(storage);
  assert.equal(migrated.version, 3);
  assert.equal(migrated.phase, "reverse-hack");
  assert.equal(migrated.warningTriggered, true);
  assert.deepEqual(migrated.appliedSessionIds, ["legacy-session"]);
  assert.deepEqual(migrated.completedPassageIds, ["legacy-passage"]);
});

test("blocked storage returns the safe in-tab transition without throwing", () => {
  const storage = new MemoryStorage({ failWrites: true });
  const first = actOneReading(storage);
  assert.equal(first.ok, false);
  assert.equal(first.reason, "write-failed");
  assert.equal(first.state.stability, 19);
  const second = applyWikiWhyReading(storage, {
    currentState: first.state,
    outcome: { advance: 19, kind: "act-one-repair", reaction: "That held." },
    passageId: "passage-a02",
    repairedAt: "later",
    sessionId: "session-2",
  });
  assert.equal(second.ok, false);
  assert.equal(second.state.stability, 38);
  assert.equal(second.state.repairCount, 2);
});

test("persisted campaign state never contains audio or transcript fields", () => {
  const storage = new MemoryStorage();
  actOneReading(storage);
  const persisted = storage.getItem(WIKIWHY_STATE_KEY);
  assert.doesNotMatch(persisted, /audio|transcript/iu);
  assert.match(persisted, /completedPassageIds/u);
});
