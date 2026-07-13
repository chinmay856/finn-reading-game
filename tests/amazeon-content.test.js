import assert from "node:assert/strict";
import test from "node:test";
import { isSelectablePassage } from "../content/passage-catalog.js";
import { AMAZEON_DECK_A_IDS, selectNextAmazeOnPassage } from "../apps/internet-recovery/amazeon-content.js";

test("Amaze-On exposes seven candidate playtests without promoting content", () => {
  const first = selectNextAmazeOnPassage({ completedPassageIds: [] }, { lane: "playtest" });
  assert.equal(first.lane, "playtest");
  assert.equal(first.canonicalEligible, false);
  assert.equal(first.reviewPending, true);
  assert.equal(first.selectableCount, 7);
  assert.equal(first.requiredFirstRun, 7);
  assert.equal(first.passage?.id, AMAZEON_DECK_A_IDS[0]);
  assert.equal(first.passage?.availability, "candidate");
  assert.equal(isSelectablePassage(first.passage), false);
  const next = selectNextAmazeOnPassage(
    { completedPassageIds: [first.passage.id] },
    { lane: "playtest" },
  );
  assert.equal(next.passage?.id, AMAZEON_DECK_A_IDS[1]);
  assert.equal(next.canonicalEligible, false);
});

test("Amaze-On production selection remains fail closed", () => {
  const selection = selectNextAmazeOnPassage({ completedPassageIds: [] });
  assert.equal(selection.passage, null);
  assert.equal(selection.selectableCount, 0);
  assert.equal(selection.reason, "no-selectable-passages");
});
