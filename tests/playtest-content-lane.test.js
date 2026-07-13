import assert from "node:assert/strict";
import test from "node:test";
import {
  PASSAGE_CATALOG,
  isPlaytestPassage,
  isSelectablePassage,
  selectNextPlaytestPassage,
} from "../content/passage-catalog.js";
import { THREADIT_DECK_A_IDS } from "../apps/internet-recovery/threadit-content.js";
import { WIKIWHY_DECK_A_IDS } from "../apps/internet-recovery/wikiwhy-content.js";

test("complete candidates can enter playtest without becoming approved", () => {
  const candidate = PASSAGE_CATALOG.find(({ id }) => id === THREADIT_DECK_A_IDS[1]);
  const original = JSON.stringify(candidate);
  assert.equal(candidate.availability, "candidate");
  assert.equal(isSelectablePassage(candidate), false);
  assert.equal(isPlaytestPassage(candidate), true);
  assert.equal(JSON.stringify(candidate), original);
  assert.equal(candidate.review.transcription, "candidate-pending-real-microphone-test");
});

test("playtest selection is explicit, noncanonical, unseen-first, and candidate-only", () => {
  const first = selectNextPlaytestPassage({ preferredIds: THREADIT_DECK_A_IDS });
  assert.equal(first.lane, "playtest");
  assert.equal(first.canonicalEligible, false);
  assert.equal(first.reviewPending, true);
  assert.equal(first.passage.id, THREADIT_DECK_A_IDS[0]);
  assert.equal(first.reason, "unseen-playtest-candidate");
  assert.equal(first.selectableCount, THREADIT_DECK_A_IDS.length);
  assert.equal(isSelectablePassage(first.passage), false);

  const second = selectNextPlaytestPassage({
    completedPassageIds: [THREADIT_DECK_A_IDS[0]],
    preferredIds: THREADIT_DECK_A_IDS,
  });
  assert.equal(second.passage.id, THREADIT_DECK_A_IDS[1]);

  const exhausted = selectNextPlaytestPassage({
    completedPassageIds: THREADIT_DECK_A_IDS,
    preferredIds: THREADIT_DECK_A_IDS,
  });
  assert.equal(exhausted.passage, null);
  assert.equal(exhausted.reason, "no-unseen-playtest-candidates");
});

test("production prototype records do not enter the candidate playtest lane", () => {
  const selection = selectNextPlaytestPassage({ preferredIds: WIKIWHY_DECK_A_IDS });
  assert.notEqual(selection.passage?.id, "photosynthesis-a01");
  assert.equal(isPlaytestPassage(PASSAGE_CATALOG.find(({ id }) => id === "photosynthesis-a01")), false);
});
