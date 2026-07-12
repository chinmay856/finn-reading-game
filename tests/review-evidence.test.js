import assert from "node:assert/strict";
import test from "node:test";

import { ENDGAME_COMMON_ORIGIN_PASSAGE } from "../content/endgame/final-incident-passages.js";
import {
  REQUIRED_REVIEW_DIMENSIONS,
  assessPassageReviewEvidence,
  buildApprovedPassageProjection,
} from "../content/review-evidence.js";
import { isSelectablePassage } from "../content/passage-catalog.js";

function completeEvidence() {
  return {
    authorId: "author-1",
    contentRevision: "sha256:final-content-revision",
    microphoneRuns: [{
      audioRetained: false,
      audioUploaded: false,
      browser: "Chromium",
      browserVersion: "reviewed-version",
      completePassage: true,
      deviceClass: "desktop-built-in-microphone",
      recognizer: "local-whisper",
      recognizerVersion: "pinned-reviewed-version",
      runId: "mic-run-1",
      testedAt: "2026-07-12T20:30:00.000Z",
    }],
    passageId: ENDGAME_COMMON_ORIGIN_PASSAGE.id,
    reviewedContentRevision: "sha256:final-content-revision",
    reviews: Object.fromEntries(REQUIRED_REVIEW_DIMENSIONS.map((dimension) => [dimension, {
      decision: "passed",
      evidence: `docs/reviews/${dimension}.md`,
      reviewedAt: "2026-07-12T20:20:00.000Z",
      reviewerId: `reviewer-${dimension}`,
    }])),
    transcription: {
      acceptedTranscriptForms: [],
      tokenResolutions: ENDGAME_COMMON_ORIGIN_PASSAGE.transcriptionReview.unstableTokens.map((token) => ({
        disposition: "stable",
        evidence: "mic-run-1",
        token,
      })),
    },
  };
}

test("empty or partial evidence fails closed with explicit blockers", () => {
  const assessment = assessPassageReviewEvidence(ENDGAME_COMMON_ORIGIN_PASSAGE, {});
  assert.equal(assessment.approved, false);
  assert.ok(assessment.blockers.includes("review:editorial"));
  assert.ok(assessment.blockers.includes("real-microphone-run"));
  assert.ok(assessment.blockers.includes("transcription-token-resolution"));
});

test("a passage author cannot self-approve any review dimension", () => {
  const evidence = completeEvidence();
  evidence.reviews.editorial.reviewerId = evidence.authorId;
  const assessment = assessPassageReviewEvidence(ENDGAME_COMMON_ORIGIN_PASSAGE, evidence);
  assert.equal(assessment.approved, false);
  assert.ok(assessment.blockers.includes("review:editorial"));
});

test("text revision drift invalidates otherwise complete review evidence", () => {
  const evidence = completeEvidence();
  evidence.contentRevision = "sha256:new-text";
  const assessment = assessPassageReviewEvidence(ENDGAME_COMMON_ORIGIN_PASSAGE, evidence);
  assert.equal(assessment.approved, false);
  assert.ok(assessment.blockers.includes("content-revision-not-fully-reviewed"));
});

test("microphone evidence must be local, complete, versioned, and token-resolved", () => {
  const evidence = completeEvidence();
  evidence.microphoneRuns[0].audioUploaded = true;
  evidence.transcription.tokenResolutions.pop();
  const assessment = assessPassageReviewEvidence(ENDGAME_COMMON_ORIGIN_PASSAGE, evidence);
  assert.equal(assessment.microphonePassed, false);
  assert.equal(assessment.tokensResolved, false);
  assert.equal(assessment.approved, false);
});

test("complete evidence creates a selectable approved projection without mutating the candidate", () => {
  const candidate = ENDGAME_COMMON_ORIGIN_PASSAGE;
  const result = buildApprovedPassageProjection(candidate, completeEvidence());
  assert.equal(result.assessment.approved, true);
  assert.equal(result.passage.availability, "approved");
  assert.equal(result.passage.transcriptionReview.tested, true);
  assert.equal(isSelectablePassage(result.passage), true);
  assert.equal(candidate.availability, "candidate");
  assert.equal(candidate.transcriptionReview.tested, false);
});
