import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { ENDGAME_PASSAGES } from "../content/endgame/final-incident-passages.js";
import { PASSAGE_CATALOG } from "../content/passage-catalog.js";
import { assessPassageReviewEvidence } from "../content/review-evidence.js";

const records = JSON.parse(await readFile(new URL("../content/review-records/endgame.json", import.meta.url), "utf8"));
const campaignRecords = JSON.parse(await readFile(new URL("../content/review-records/campaign.json", import.meta.url), "utf8"));

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

test("every campaign candidate has exactly one revision-bound pending manifest", () => {
  const endgameIds = new Set(ENDGAME_PASSAGES.map(({ id }) => id));
  const campaignCandidates = PASSAGE_CATALOG.filter((passage) => (
    passage.availability === "candidate" && !endgameIds.has(passage.id)
  ));
  assert.equal(campaignCandidates.length, 82);
  assert.equal(campaignRecords.length, campaignCandidates.length);
  assert.equal(new Set(campaignRecords.map(({ passageId }) => passageId)).size, campaignRecords.length);
  for (const passage of campaignCandidates) {
    const record = campaignRecords.find(({ passageId }) => passageId === passage.id);
    assert.ok(record, `Missing manifest for ${passage.id}`);
    assert.equal(record.contentRevision, passage.contentRevision);
    assert.equal(record.reviewedContentRevision, null);
    assert.deepEqual(record.reviews, {});
    assert.deepEqual(record.microphoneRuns, []);
    assert.equal(assessPassageReviewEvidence(passage, record).approved, false);
  }
});

test("campaign and final manifests cover every candidate exactly once", () => {
  const allRecords = [...campaignRecords, ...records];
  const candidates = PASSAGE_CATALOG.filter(({ availability }) => availability === "candidate");
  assert.equal(allRecords.length, 85);
  assert.equal(new Set(allRecords.map(({ passageId }) => passageId)).size, 85);
  assert.deepEqual(
    new Set(allRecords.map(({ passageId }) => passageId)),
    new Set(candidates.map(({ id }) => id)),
  );
});
