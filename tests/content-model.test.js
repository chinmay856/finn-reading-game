import assert from "node:assert/strict";
import test from "node:test";
import { EVIDENCE_PASSAGE } from "../content/evidence-passage.js";
import { PHOTOSYNTHESIS_PASSAGE } from "../content/wikiwhy/photosynthesis-passage.js";

test("passage carries a reusable reading profile", () => {
  assert.equal(EVIDENCE_PASSAGE.profile.form, "expository-prose");
  assert.equal(EVIDENCE_PASSAGE.profile.segmentation, "short-paragraphs");
  assert.ok(EVIDENCE_PASSAGE.profile.targetWpm.stretch > EVIDENCE_PASSAGE.profile.targetWpm.comfortable);
  assert.ok(EVIDENCE_PASSAGE.profile.checkpoint.pauseMs < 900);
  assert.ok(EVIDENCE_PASSAGE.profile.endDetection.minimumTailMatches > 0);
  assert.ok(EVIDENCE_PASSAGE.profile.guide.supportedWpm.includes(250));
  assert.ok(EVIDENCE_PASSAGE.profile.guide.supportedWpm.includes(300));
});

test("the selected campaign passage is a reusable attributed content record", () => {
  assert.equal(PHOTOSYNTHESIS_PASSAGE.id, "photosynthesis-a01");
  assert.equal(PHOTOSYNTHESIS_PASSAGE.paragraphs.length, 3);
  assert.equal(PHOTOSYNTHESIS_PASSAGE.comprehension.choices.filter(({ correct }) => correct).length, 1);
  assert.equal(PHOTOSYNTHESIS_PASSAGE.source.basis, "cc-by-sa-4.0-adaptation");
  assert.match(PHOTOSYNTHESIS_PASSAGE.source.sourceUrl, /wikipedia\.org\/wiki\/Photosynthesis/u);
  assert.match(PHOTOSYNTHESIS_PASSAGE.source.attribution, /adapted and modified/iu);
  assert.doesNotMatch(JSON.stringify(PHOTOSYNTHESIS_PASSAGE), /WikiWhy|Internet Recovery|repair|reward/iu);
});

test("theme-neutral content metadata contains no wrapper outcomes", () => {
  const content = JSON.stringify(EVIDENCE_PASSAGE);
  assert.doesNotMatch(content, /WikiWhy|Internet Recovery|bandwidth|repair|reward/iu);
});
