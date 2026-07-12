import assert from "node:assert/strict";
import test from "node:test";
import { SEARCHISH_CAMPAIGN_UNITS, calculateSearchishReadingOutcome } from "../apps/internet-recovery/searchish-rules.js";
import { acknowledgeSearchishMidpointState, advanceSearchishState, normalizeSearchishState } from "../apps/internet-recovery/searchish-state.js";

test("Search-ish freezes four result origins plus three source branches", () => {
  assert.deepEqual(SEARCHISH_CAMPAIGN_UNITS.map(({ unitId }) => unitId), [
    "result_1_origin", "result_2_origin", "result_3_origin", "result_4_origin",
    "primary_branch", "independent_branch", "placement_origin_gate",
  ]);
});

test("Search-ish saves Five Costumes and requires explicit acknowledgement", () => {
  let state = normalizeSearchishState();
  for (let index = 0; index < 4; index += 1) {
    const transition = advanceSearchishState(state, {
      completedAt: `2026-07-12T00:00:0${index}.000Z`,
      outcome: calculateSearchishReadingOutcome({ campaignState: state }),
      passageId: `searchish-passage-${index}`,
      sessionId: `searchish-session-${index}`,
    });
    assert.equal(transition.ok, true);
    state = transition.state;
  }
  assert.equal(state.stateId, "searchish_five_costumes");
  assert.equal(calculateSearchishReadingOutcome({ campaignState: state }).accepted, false);
  state = acknowledgeSearchishMidpointState(state, { acknowledgedAt: "2026-07-12T00:00:05.000Z" }).state;
  assert.equal(calculateSearchishReadingOutcome({ campaignState: state }).kind, "branch-unit");
});

test("seven accepted units secure canonical slot-seven evidence", () => {
  let state = normalizeSearchishState();
  for (let index = 0; index < 7; index += 1) {
    if (index === 4) state = acknowledgeSearchishMidpointState(state).state;
    state = advanceSearchishState(state, {
      completedAt: `2026-07-12T00:00:0${index}.000Z`,
      outcome: calculateSearchishReadingOutcome({ campaignState: state }),
      passageId: `searchish-passage-${index}`,
      sessionId: `searchish-session-${index}`,
    }).state;
  }
  assert.equal(state.secured, true);
  assert.equal(state.evidenceId, "searchish.evidence.generated-cache-redirect-01");
  assert.equal(state.blockedWriteId, "searchish-blocked-placement-01");
});
