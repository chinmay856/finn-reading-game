import assert from "node:assert/strict";
import test from "node:test";
import { calculateSpottyFiReadingOutcome } from "../apps/internet-recovery/spottyfi-rules.js";
import { acknowledgeSpottyFiMidpointState, advanceSpottyFiState, normalizeSpottyFiState } from "../apps/internet-recovery/spottyfi-state.js";
import { getSpottyFiCampaignView } from "../apps/internet-recovery/spottyfi-view.js";

function view(count) {
  let state = normalizeSpottyFiState();
  for (let index = 0; index < count; index += 1) {
    if (index === 5) state = acknowledgeSpottyFiMidpointState(state).state;
    state = advanceSpottyFiState(state, { outcome: calculateSpottyFiReadingOutcome({ campaignState: state }), passageId: `p${index}`, sessionId: `s${index}` }).state;
  }
  return getSpottyFiCampaignView(state);
}

test("fictional library is silent and preserves five authored tracks", () => {
  const campaign = view(0);
  assert.equal(campaign.silent, true);
  assert.equal(campaign.tracks.length, 5);
  assert.ok(campaign.tracks.every(({ genreDisplay }) => genreDisplay === "GENRE HIDDEN"));
});

test("secured library restores manual ownership and blocks predicted insert", () => {
  const campaign = view(8);
  assert.equal(campaign.queueOwner, "FINN — MANUAL ORDER");
  assert.equal(campaign.securedPayoff.evidence.slot, 9);
  assert.equal(campaign.securedPayoff.blockedWrite.label, "NOT REQUESTED");
  assert.ok(campaign.suggestions.every((label) => label.endsWith("OPTIONAL")));
});

test("midpoint and completion name the changed mechanic", () => {
  const midpoint = view(5);
  assert.equal(midpoint.progress.disclosureBoundary, 5);
  assert.equal(midpoint.midpoint.visible, true);
  assert.match(midpoint.midpoint.amyLine, /timestamps prove/i);
  assert.match(midpoint.midpoint.chinmayLine, /musical past/i);
  const secured = view(8);
  assert.equal(secured.securedPayoff.endOfSite, true);
  assert.match(secured.securedPayoff.amyLine, /Finn restored/i);
  assert.match(secured.securedPayoff.chinmayLine, /plays what you choose/i);
});
