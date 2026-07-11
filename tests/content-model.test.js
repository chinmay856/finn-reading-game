import assert from "node:assert/strict";
import test from "node:test";
import { EVIDENCE_PASSAGE } from "../content/evidence-passage.js";

test("passage carries a reusable reading profile", () => {
  assert.equal(EVIDENCE_PASSAGE.profile.form, "expository-prose");
  assert.equal(EVIDENCE_PASSAGE.profile.segmentation, "short-paragraphs");
  assert.ok(EVIDENCE_PASSAGE.profile.targetWpm.stretch > EVIDENCE_PASSAGE.profile.targetWpm.comfortable);
  assert.ok(EVIDENCE_PASSAGE.profile.checkpoint.pauseMs < 900);
  assert.ok(EVIDENCE_PASSAGE.profile.endDetection.minimumTailMatches > 0);
  assert.ok(EVIDENCE_PASSAGE.profile.guide.supportedWpm.includes(250));
  assert.ok(EVIDENCE_PASSAGE.profile.guide.supportedWpm.includes(300));
});

test("theme-neutral content metadata contains no wrapper outcomes", () => {
  const content = JSON.stringify(EVIDENCE_PASSAGE);
  assert.doesNotMatch(content, /WikiWhy|Internet Recovery|bandwidth|repair|reward/iu);
});
