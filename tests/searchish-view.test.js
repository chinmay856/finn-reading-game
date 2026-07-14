import assert from "node:assert/strict";
import test from "node:test";
import { calculateSearchishReadingOutcome } from "../apps/internet-recovery/searchish-rules.js";
import { acknowledgeSearchishMidpointState, advanceSearchishState, normalizeSearchishState } from "../apps/internet-recovery/searchish-state.js";
import { getSearchishCampaignView } from "../apps/internet-recovery/searchish-view.js";

function preview(count) {
  let state = normalizeSearchishState();
  for (let index = 0; index < count; index += 1) {
    if (index === 4) state = acknowledgeSearchishMidpointState(state).state;
    state = advanceSearchishState(state, { outcome: calculateSearchishReadingOutcome({ campaignState: state }), passageId: `p${index}`, sessionId: `s${index}` }).state;
  }
  return getSearchishCampaignView(state);
}

test("corrupted results expose four redirects and no invented origins", () => {
  const view = preview(0);
  assert.equal(view.results.length, 4);
  assert.ok(view.results.every(({ cacheId, originId }) => cacheId === "searchish-cache-generated-7f21" && originId === null));
  assert.equal(view.answer.text, "The Northwind streak was definitely a test rocket. Four results confirm it.");
  assert.equal(view.progress.visibleSourceCount, 4);
  assert.equal(view.progress.visibleCorruptedSourceCount, 4);
  assert.equal(view.progress.restoreBoundary, 4);
  assert.deepEqual(view.progress.restoreUnits.map(({ resultId }) => resultId), view.results.map(({ id }) => id));
});

test("the four visible source bullets reach the midpoint together", () => {
  const before = preview(3);
  assert.equal(before.progress.visibleCorruptedSourceCount, 1);
  assert.equal(before.progress.visibleRepairedSourceCount, 3);
  assert.equal(before.midpoint.visible, false);
  const midpoint = preview(4);
  assert.equal(midpoint.progress.visibleCorruptedSourceCount, 0);
  assert.equal(midpoint.progress.visibleRepairedSourceCount, 4);
  assert.equal(midpoint.midpoint.visible, true);
  assert.match(midpoint.midpoint.amyLine, /all four result labels/i);
  assert.match(midpoint.midpoint.chinmayLine, /four.*name tags/i);
});

test("secured results expose three semantic branches and canonical payoff", () => {
  const view = preview(7);
  assert.equal(view.secured, true);
  assert.ok(view.branches.every(({ open }) => open));
  assert.equal(view.securedPayoff.evidence.slot, 7);
  assert.equal(view.securedPayoff.blockedWrite.targetId, "searchish-placement-top-result-01");
  assert.equal(view.securedPayoff.endOfSite, true);
  assert.match(view.securedPayoff.amyLine, /Finn fixed/i);
  assert.match(view.securedPayoff.chinmayLine, /one answer/i);
});
