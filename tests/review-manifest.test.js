import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ENDGAME_PASSAGES } from "../content/endgame/final-incident-passages.js";
import { assessPassageReviewEvidence } from "../content/review-evidence.js";

const records = JSON.parse(await readFile(new URL("../content/review-records/endgame.json", import.meta.url), "utf8"));

test("every final passage has exactly one revision-bound review manifest", () => {
  assert.equal(records.length, ENDGAME_PASSAGES.length);
  assert.equal(new Set(records.map(({ passageId }) => passageId)).size, records.length);
  for (const passage of ENDGAME_PASSAGES) {
    const record = records.find(({ passageId }) => passageId === passage.id);
    assert.ok(record);
    assert.equal(record.contentRevision, passage.contentRevision);
    assert.equal(record.reviewedContentRevision, null);
    assert.equal(assessPassageReviewEvidence(passage, record).approved, false);
  }
});
