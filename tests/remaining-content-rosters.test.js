import assert from "node:assert/strict";
import test from "node:test";
import { PASSAGE_CATALOG, isSelectablePassage } from "../content/passage-catalog.js";
import { FIRST_RUN_PASSAGES as SEARCHISH_PASSAGES } from "../content/searchish/first-run-passages.js";
import { FIRST_RUN_PASSAGES as AMAZEON_PASSAGES } from "../content/amazeon/first-run-passages.js";
import { FIRST_RUN_PASSAGES as SPOTTYFI_PASSAGES } from "../content/spottyfi/first-run-passages.js";
import { FIRST_RUN_PASSAGES as MAPGUESS_ORIGINAL_PASSAGES } from "../content/mapguess/first-run-passages.js";
import { FIRST_RUN_PASSAGES as VIEWTUBE_ORIGINAL_PASSAGES } from "../content/viewtube/first-run-passages.js";
import { SEARCHISH_CONTENT_READINESS, SEARCHISH_DECK_A_IDS } from "../apps/internet-recovery/searchish-content.js";
import { AMAZEON_CONTENT_READINESS, AMAZEON_DECK_A_IDS } from "../apps/internet-recovery/amazeon-content.js";
import { SPOTTYFI_CONTENT_READINESS, SPOTTYFI_DECK_A_IDS } from "../apps/internet-recovery/spottyfi-content.js";
import { MAPGUESS_CONTENT_READINESS, MAPGUESS_DECK_A_IDS } from "../apps/internet-recovery/mapguess-content.js";
import { VIEWTUBE_CONTENT_READINESS, VIEWTUBE_DECK_A_IDS } from "../apps/internet-recovery/viewtube-content.js";

const rosters = Object.freeze([
  { ids: SEARCHISH_DECK_A_IDS, passages: SEARCHISH_PASSAGES, readiness: SEARCHISH_CONTENT_READINESS },
  { ids: AMAZEON_DECK_A_IDS, passages: AMAZEON_PASSAGES, readiness: AMAZEON_CONTENT_READINESS },
  { ids: SPOTTYFI_DECK_A_IDS, passages: SPOTTYFI_PASSAGES, readiness: SPOTTYFI_CONTENT_READINESS },
  { ids: MAPGUESS_DECK_A_IDS.slice(1), passages: MAPGUESS_ORIGINAL_PASSAGES, readiness: MAPGUESS_CONTENT_READINESS },
  { ids: VIEWTUBE_DECK_A_IDS.slice(1), passages: VIEWTUBE_ORIGINAL_PASSAGES, readiness: VIEWTUBE_CONTENT_READINESS },
]);

test("five remaining manuscript rosters are complete neutral candidates", () => {
  assert.equal(rosters.reduce((sum, { passages }) => sum + passages.length, 0), 35);
  for (const { ids, passages, readiness } of rosters) {
    assert.deepEqual(passages.map(({ id }) => id), ids);
    assert.equal(readiness.firstRunShortfall, 0);
    for (const passage of passages) {
      assert.ok(PASSAGE_CATALOG.includes(passage));
      assert.equal(passage.availability, "candidate");
      assert.ok(passage.paragraphs.length >= 3);
      assert.equal(passage.comprehension.choices.length, 3);
      assert.equal(passage.comprehension.choices.filter(({ correct }) => correct).length, 1);
      assert.equal(passage.source.sourceType, "original");
      assert.equal(passage.rights.basis, "original");
      assert.equal(passage.transcriptionReview.tested, false);
      assert.equal(isSelectablePassage(passage), false);
      assert.doesNotMatch(JSON.stringify({ rights: passage.rights, source: passage.source }), /Internet Recovery|repair|reward/iu);
    }
  }
});

test("MapGuess first-run IDs follow the frozen eight-record manuscript roster", () => {
  assert.equal(MAPGUESS_DECK_A_IDS.length, 8);
  assert.deepEqual(MAPGUESS_DECK_A_IDS.slice(-3), [
    "landmarks-anchor-a-route-a06",
    "when-directions-cross-water-a07",
    "the-goal-before-the-route-a08",
  ]);
  assert.equal(MAPGUESS_CONTENT_READINESS.requiredFirstRun, 8);
  assert.equal(MAPGUESS_CONTENT_READINESS.structuredCandidateCount, 8);
});
