import assert from "node:assert/strict";
import test from "node:test";

import { selectNextEndgamePassage } from "../apps/internet-recovery/endgame-content.js";
import { ENDGAME_CHECKPOINT_IDS } from "../apps/internet-recovery/endgame-state.js";
import { ENDGAME_PASSAGES } from "../content/endgame/final-incident-passages.js";
import { PASSAGE_CATALOG, isSelectablePassage } from "../content/passage-catalog.js";

test("the three frozen final-incident passages are exact, ordered Content Platform records", () => {
  assert.deepEqual(ENDGAME_PASSAGES.map(({ id }) => id), ENDGAME_CHECKPOINT_IDS);
  assert.deepEqual(ENDGAME_PASSAGES.map(({ source }) => source.checkpoint), ["trace-origin", "preserve-evidence", "revoke-access"]);
  assert.equal(new Set(ENDGAME_PASSAGES.map(({ id }) => id)).size, 3);
  for (const passage of ENDGAME_PASSAGES) {
    assert.equal(passage.availability, "candidate");
    assert.match(passage.contentRevision, new RegExp(`^${passage.id.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}@`, "u"));
    assert.equal(passage.rights.basis, "original");
    assert.equal(passage.paragraphs.length, 4);
    assert.equal(passage.comprehension.choices.filter(({ correct }) => correct).length, 1);
    assert.equal(passage.transcriptionReview.tested, false);
    assert.equal(isSelectablePassage(passage), false);
    assert.equal(PASSAGE_CATALOG.includes(passage), true);
  }
});

test("endgame selection fails closed at the next unseen checkpoint", () => {
  const first = selectNextEndgamePassage({ checkpointIds: [] });
  assert.equal(first.passage, null);
  assert.equal(first.reason, "no-selectable-passages");
  assert.equal(first.structuredCandidateCount, 3);
  assert.equal(first.unavailableCount, 1);

  const second = selectNextEndgamePassage({ checkpointIds: [ENDGAME_CHECKPOINT_IDS[0]] });
  assert.equal(second.passage, null);
  assert.equal(second.unavailableCount, 1);
});

test("approval cannot skip the one-to-one checkpoint order", () => {
  const approvedSecond = {
    ...ENDGAME_PASSAGES[1],
    availability: "prototype",
    review: { factual: "passed", grade: "passed", sensitivity: "passed", transcription: "passed" },
  };
  const selection = selectNextEndgamePassage({ checkpointIds: [] }, { catalog: [approvedSecond] });
  assert.equal(selection.passage, null);
  assert.equal(selection.reason, "no-selectable-passages");
});

test("all three saved checkpoints produce no repeat passage", () => {
  const selection = selectNextEndgamePassage({ checkpointIds: ENDGAME_CHECKPOINT_IDS });
  assert.equal(selection.passage, null);
  assert.equal(selection.reason, "all-checkpoints-complete");
});
