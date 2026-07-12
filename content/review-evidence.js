export const REQUIRED_REVIEW_DIMENSIONS = Object.freeze([
  "accessibility",
  "comprehension",
  "editorial",
  "factual",
  "grade",
  "profile",
  "rights",
  "sensitivity",
  "transcription",
]);

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validTimestamp(value) {
  return text(value) && !Number.isNaN(Date.parse(value));
}

function validReviewDecision(decision, authorId) {
  return decision?.decision === "passed"
    && text(decision.reviewerId)
    && decision.reviewerId !== authorId
    && validTimestamp(decision.reviewedAt)
    && text(decision.evidence);
}

function microphoneRunComplete(run) {
  return text(run?.runId)
    && validTimestamp(run?.testedAt)
    && text(run?.browser)
    && text(run?.browserVersion)
    && text(run?.deviceClass)
    && text(run?.recognizer)
    && text(run?.recognizerVersion)
    && run?.completePassage === true
    && run?.audioUploaded === false
    && run?.audioRetained === false;
}

function transcriptionTokensResolved(passage, evidence) {
  const expected = passage?.transcriptionReview?.unstableTokens ?? [];
  const resolutions = new Map(
    (evidence?.transcription?.tokenResolutions ?? []).map((entry) => [entry?.token, entry]),
  );
  return expected.every((token) => {
    const resolution = resolutions.get(token);
    return resolution
      && ["stable", "accepted-form", "profile-adjusted"].includes(resolution.disposition)
      && text(resolution.evidence);
  });
}

export function assessPassageReviewEvidence(passage, evidence = {}) {
  const authorId = text(evidence.authorId) ? evidence.authorId : null;
  const dimensions = Object.freeze(Object.fromEntries(REQUIRED_REVIEW_DIMENSIONS.map((dimension) => [
    dimension,
    validReviewDecision(evidence.reviews?.[dimension], authorId),
  ])));
  const microphoneRuns = Array.isArray(evidence.microphoneRuns) ? evidence.microphoneRuns : [];
  const microphonePassed = microphoneRuns.length > 0 && microphoneRuns.every(microphoneRunComplete);
  const tokensResolved = transcriptionTokensResolved(passage, evidence);
  const passageMatches = text(passage?.id) && evidence.passageId === passage.id;
  const contentRevisionMatches = text(evidence.contentRevision)
    && evidence.contentRevision === evidence.reviewedContentRevision;
  const reviewPassed = REQUIRED_REVIEW_DIMENSIONS.every((dimension) => dimensions[dimension]);
  const approved = passageMatches
    && contentRevisionMatches
    && reviewPassed
    && microphonePassed
    && tokensResolved;
  const blockers = Object.freeze([
    ...(!passageMatches ? ["passage-id-mismatch"] : []),
    ...(!contentRevisionMatches ? ["content-revision-not-fully-reviewed"] : []),
    ...REQUIRED_REVIEW_DIMENSIONS.filter((dimension) => !dimensions[dimension]).map((dimension) => `review:${dimension}`),
    ...(!microphonePassed ? ["real-microphone-run"] : []),
    ...(!tokensResolved ? ["transcription-token-resolution"] : []),
  ]);
  return Object.freeze({
    approved,
    blockers,
    contentRevisionMatches,
    dimensions,
    microphonePassed,
    passageId: passage?.id ?? null,
    passageMatches,
    tokensResolved,
  });
}

export function buildApprovedPassageProjection(passage, evidence) {
  const assessment = assessPassageReviewEvidence(passage, evidence);
  if (!assessment.approved) return Object.freeze({ assessment, passage: null });
  return Object.freeze({
    assessment,
    passage: Object.freeze({
      ...passage,
      availability: "approved",
      review: Object.freeze(Object.fromEntries(REQUIRED_REVIEW_DIMENSIONS.map((dimension) => [dimension, "passed"]))),
      transcriptionReview: Object.freeze({
        ...passage.transcriptionReview,
        acceptedTranscriptForms: Object.freeze([...(evidence.transcription?.acceptedTranscriptForms ?? [])]),
        tested: true,
      }),
    }),
  });
}
