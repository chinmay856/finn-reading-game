import assert from "node:assert/strict";
import test from "node:test";

import {
  WIKIWHY_DIAGNOSTIC_KEY,
  advanceWikiWhyDiagnostic,
  beginWikiWhyShieldProtocol,
  readWikiWhyDiagnosticState,
  resetWikiWhyDiagnosticState,
  saveWikiWhyDiagnosticState,
} from "../apps/internet-recovery/wikiwhy-diagnostics.js";

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test("diagnostic passages reach the exact Act I warning and reverse-hack boundaries", () => {
  let current = readWikiWhyDiagnosticState(null);
  const expected = [19, 38, 57, 76, 80];
  const events = [];
  for (const stability of expected) {
    const transition = advanceWikiWhyDiagnostic(current);
    current = transition.state;
    events.push(transition.event);
    assert.equal(current.stability, stability);
  }
  assert.deepEqual(events, [
    "passage-complete", "passage-complete", "passage-complete", "amy-warning", "reverse-hack-ready",
  ]);
  assert.equal(current.phase, "reverse-hack");
  assert.equal(current.simulatedPassages, 5);
});

test("Shield Protocol visibly resets and completes in exactly three simulated passes", () => {
  let current = advanceWikiWhyDiagnostic({ phase: "act-one", stability: 76, version: 1 }).state;
  current = beginWikiWhyShieldProtocol(current).state;
  assert.equal(current.stability, 80);
  assert.equal(current.shieldProgress, 0);
  assert.equal(current.phase, "shield");

  const progress = [];
  const events = [];
  for (let pass = 0; pass < 3; pass += 1) {
    const transition = advanceWikiWhyDiagnostic(current);
    current = transition.state;
    progress.push(current.shieldProgress);
    events.push(transition.event);
  }
  assert.deepEqual(progress, [33, 66, 100]);
  assert.deepEqual(events, ["shield-pass-complete", "shield-pass-complete", "site-secured"]);
  assert.equal(current.phase, "secured");
});

test("diagnostic storage remains separate and can be reset without touching real repair state", () => {
  const storage = new MemoryStorage();
  storage.setItem("internet-recovery-98.wikiwhy.prototype.v2", JSON.stringify({ stability: 57 }));
  const saved = saveWikiWhyDiagnosticState(storage, { phase: "act-one", stability: 38, version: 1 });
  assert.equal(saved.ok, true);
  assert.equal(readWikiWhyDiagnosticState(storage).stability, 38);
  assert.ok(storage.getItem(WIKIWHY_DIAGNOSTIC_KEY));
  assert.equal(resetWikiWhyDiagnosticState(storage).ok, true);
  assert.equal(readWikiWhyDiagnosticState(storage).stability, 0);
  assert.ok(storage.getItem("internet-recovery-98.wikiwhy.prototype.v2"));
});
