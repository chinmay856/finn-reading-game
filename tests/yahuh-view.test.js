import test from "node:test";
import assert from "node:assert/strict";

import {
  YAHUH_SORT_UNITS,
  calculateYahuhReadingOutcome,
} from "../apps/internet-recovery/yahuh-rules.js";
import {
  acknowledgeYahuhMidpointState,
  advanceYahuhState,
  normalizeYahuhState,
} from "../apps/internet-recovery/yahuh-state.js";
import { getYahuhCampaignView } from "../apps/internet-recovery/yahuh-view.js";

function stateAt(completedCount, { acknowledged = true } = {}) {
  let state = normalizeYahuhState();
  for (let index = 0; index < completedCount; index += 1) {
    if (index === YAHUH_SORT_UNITS.length && acknowledged) {
      state = acknowledgeYahuhMidpointState(state, { acknowledgedAt: "ack" }).state;
    }
    const transition = advanceYahuhState(state, {
      completedAt: `step-${index + 1}`,
      outcome: calculateYahuhReadingOutcome({ campaignState: state }),
      passageId: `view-passage-${index + 1}`,
      sessionId: `view-session-${index + 1}`,
    });
    assert.equal(transition.ok, true);
    state = transition.state;
  }
  return state;
}

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

test("the corrupted view has exactly six semantic modules and no percentage", () => {
  const view = getYahuhCampaignView(normalizeYahuhState());
  assertDeepFrozen(view);
  assert.equal(view.activeModules.length, 6);
  assert.equal(view.switchboardRoutes.length, 6);
  assert.equal(view.circuits.length, 3);
  assert.ok(view.activeModules.every(({ state }) => state === "pasted"));
  assert.ok(view.activeModules.every(({ source }) => source.visible === false));
  assert.equal(view.readingGate.microphone, "off");
  assert.equal(view.readingGate.scoreCreated, false);
  assert.deepEqual(view.progress, {
    completedUnitCount: 0,
    phase: { completed: 0, label: "SORT SIX MODULES", total: 3 },
    reconnectCompletedCount: 0,
    requiredReadingCount: 6,
    sortCompletedCount: 0,
    visibleCountLabel: "0 / 6 PORTAL REPAIRS",
  });
  assert.doesNotMatch(JSON.stringify(view), /percentage|progressbar|\d+%/iu);
});

test("each sort discloses only its assigned module pair", () => {
  for (let completed = 1; completed <= 3; completed += 1) {
    const view = getYahuhCampaignView(stateAt(completed, { acknowledged: false }));
    const disclosed = view.activeModules.filter(({ sorted }) => sorted).map(({ originalCategoryLabel }) => originalCategoryLabel);
    assert.equal(disclosed.length, completed * 2);
    assert.ok(view.activeModules.slice(0, completed * 2).every(({ sorted }) => sorted));
    assert.ok(view.activeModules.slice(completed * 2).every(({ sorted }) => !sorted));
  }
});

test("Single Source preserves six saved labels while proving one origin and timestamp", () => {
  const view = getYahuhCampaignView(stateAt(3, { acknowledged: false }));
  assert.equal(view.midpoint.actionRequired, true);
  assert.deepEqual(view.midpoint.proof, [
    "VISIBLE MODULES: 6",
    "INDEPENDENT CHANNELS: 1",
    "SAME-MILLISECOND REWRITE: CONFIRMED",
  ]);
  assert.equal(view.savedLabelSnapshot.length, 6);
  assert.equal(new Set(view.activeModules.map(({ source }) => source.id)).size, 1);
  assert.equal(new Set(view.activeModules.map(({ date }) => date.iso)).size, 1);
  assert.ok(view.activeModules.every(({ state }) => state === "single-stream"));
});

test("reconnect units restore only their assigned pair and secure six distinct routes", () => {
  const afterOne = getYahuhCampaignView(stateAt(4));
  assert.equal(afterOne.activeModules.filter(({ reconnected }) => reconnected).length, 2);
  assert.equal(new Set(afterOne.activeModules.slice(2).map(({ channel }) => channel.id)).size, 1);

  const afterTwo = getYahuhCampaignView(stateAt(5));
  assert.equal(afterTwo.activeModules.filter(({ reconnected }) => reconnected).length, 4);
  assert.equal(afterTwo.progress.reconnectCompletedCount, 2);

  const secured = getYahuhCampaignView(stateAt(6));
  assert.equal(secured.secured, true);
  assert.ok(secured.activeModules.every(({ state }) => state === "reconnected"));
  assert.equal(new Set(secured.activeModules.map(({ channel }) => channel.id)).size, 6);
  assert.equal(secured.activeModules.find(({ originalCategoryLabel }) => originalCategoryLabel === "SPONSORED").sponsorship.label, "SPONSORED");
  assert.equal(secured.securedPayoff.evidence.slot, 5);
  assert.equal(secured.securedPayoff.evidence.canonical, true);
  assert.equal(secured.securedPayoff.blockedWrite.label, "CATEGORY AND SOURCE REQUIRED");
  assert.equal(secured.securedPayoff.technoLabel, "DOG TOY — NOT BREAKING NEWS");
});

test("reduced motion changes only motion metadata", () => {
  const state = stateAt(3, { acknowledged: false });
  const animated = getYahuhCampaignView(state, { reducedMotion: false });
  const reduced = getYahuhCampaignView(state, { reducedMotion: true });
  assert.equal(animated.motion.mode, "switchboard-route");
  assert.equal(reduced.motion.mode, "discrete");
  const { motion: _animatedMotion, ...animatedSemantic } = animated;
  const { motion: _reducedMotion, ...reducedSemantic } = reduced;
  assert.deepEqual(reducedSemantic, animatedSemantic);
});

test("Yahuh exposes six real repairs across two named halves and a completion exchange", () => {
  const beforeMidpoint = getYahuhCampaignView(stateAt(2));
  assert.deepEqual(beforeMidpoint.progress.phase, { completed: 2, label: "SORT SIX MODULES", total: 3 });
  assert.equal(beforeMidpoint.progress.visibleCountLabel, "2 / 6 PORTAL REPAIRS");

  const midpoint = getYahuhCampaignView(stateAt(3));
  assert.deepEqual(midpoint.progress.phase, { completed: 0, label: "RECONNECT SIX CHANNELS", total: 3 });
  assert.match(midpoint.midpoint.amy, /First half complete/iu);
  assert.match(midpoint.midpoint.amy, /Second half/iu);

  const secured = getYahuhCampaignView(stateAt(6));
  assert.match(secured.securedPayoff.amy, /Site complete/iu);
  assert.match(secured.securedPayoff.chinmay, /withdraw my objection/iu);
});
