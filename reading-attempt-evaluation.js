const CONFIDENCE_BANDS = Object.freeze({
  strong: Object.freeze({ id: "strong", label: "Reading confirmed" }),
  directional: Object.freeze({ id: "directional", label: "Good reading effort" }),
  unverified: Object.freeze({ id: "unverified", label: "Reading complete - voice check unavailable" }),
});

function clamp(value) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function describeReadingCoverage(coverage) {
  const normalized = clamp(coverage);
  if (normalized >= 0.9) return Object.freeze({ band: "Strong coverage", detail: "The voice check followed nearly all of the passage." });
  if (normalized >= 0.7) return Object.freeze({ band: "Solid coverage", detail: "The voice check followed most of the passage." });
  if (normalized >= 0.2) return Object.freeze({ band: "Partial coverage", detail: "The voice check followed part of the passage." });
  return Object.freeze({ band: "Not verified", detail: "The computer did not capture enough words to judge coverage." });
}

export function describeReadingPace({ matchedWords = 0, readingDurationMs = 0 } = {}) {
  if (matchedWords < 10 || readingDurationMs < 2_000) {
    return Object.freeze({ band: "Not estimated", detail: "There was not enough reliable timing evidence.", wpm: null });
  }
  const wpm = Math.round(matchedWords / (readingDurationMs / 60_000));
  const band = wpm < 90 ? "Taking your time" : wpm < 150 ? "Steady pace" : wpm < 220 ? "Brisk pace" : "Fast pace";
  return Object.freeze({ band, detail: `About ${wpm} words per minute. Faster reading is never penalized.`, wpm });
}

export function evaluateFinishedAttempt({
  captureStarted = false,
  finishRequested = false,
  modelFailed = false,
  transcript = "",
  matchedWords = 0,
  matchedTokenIndexes = null,
  spokenWords = 0,
  unalignedWords = 0,
  totalWords = 0,
  positionProgress = 0,
} = {}) {
  if (!captureStarted) {
    return Object.freeze({
      accepted: false,
      confidenceBand: null,
      reason: "capture-never-started",
      retryAvailable: true,
    });
  }
  if (!finishRequested) {
    return Object.freeze({
      accepted: false,
      confidenceBand: null,
      reason: "attempt-restarted",
      retryAvailable: true,
    });
  }

  const coverage = totalWords > 0 ? clamp(matchedWords / totalWords) : 0;
  const position = clamp(positionProgress);
  const observedWords = Math.max(Number(spokenWords) || 0, matchedWords + (Number(unalignedWords) || 0));
  const evidencePrecision = observedWords > 0 ? clamp(matchedWords / observedWords) : 0;
  const hasTranscript = String(transcript).trim().length > 0;
  const beginningWindow = Math.max(4, Math.ceil(totalWords * 0.15));
  const beginningMatches = Array.isArray(matchedTokenIndexes)
    ? matchedTokenIndexes.filter((index) => index >= 0 && index < beginningWindow).length
    : null;
  const hasBeginningEvidence = beginningMatches == null || beginningMatches >= 2;
  let confidenceBand = CONFIDENCE_BANDS.unverified;
  let reason = modelFailed ? "model-failed-after-finish" : "no-usable-speech-evidence";

  if (!modelFailed && hasTranscript && hasBeginningEvidence && coverage >= 0.7 && position >= 0.8 && evidencePrecision >= 0.65) {
    confidenceBand = CONFIDENCE_BANDS.strong;
    reason = "strong-reading-evidence";
  } else if (!modelFailed && hasTranscript && hasBeginningEvidence && coverage >= 0.2 && evidencePrecision >= 0.5) {
    confidenceBand = CONFIDENCE_BANDS.directional;
    reason = "partial-reading-evidence";
  }

  return Object.freeze({
    accepted: true,
    confidenceBand,
    evidence: Object.freeze({ coverage, evidencePrecision, hasBeginningEvidence, position }),
    reason,
    retryAvailable: true,
  });
}

export function summarizeGuideTrace(events = [], { maximumComfortableJump = 1 } = {}) {
  const normalized = events.map(({ observedAtMs, visibleLineIndex }) => Object.freeze({
    observedAtMs: Number(observedAtMs),
    visibleLineIndex: Number(visibleLineIndex),
  }));
  let backwardJumps = 0;
  let largestForwardJump = 0;
  let uncomfortableForwardJumps = 0;
  for (let index = 1; index < normalized.length; index += 1) {
    const jump = normalized[index].visibleLineIndex - normalized[index - 1].visibleLineIndex;
    if (jump < 0) backwardJumps += 1;
    if (jump > largestForwardJump) largestForwardJump = jump;
    if (jump > maximumComfortableJump) uncomfortableForwardJumps += 1;
  }
  const firstUpdateMs = normalized[0]?.observedAtMs ?? null;
  const firstAdvanceMs = normalized.find(({ visibleLineIndex }) => visibleLineIndex > 0)?.observedAtMs ?? null;
  return Object.freeze({
    backwardJumps,
    eventCount: normalized.length,
    firstAdvanceMs,
    firstUpdateMs,
    largestForwardJump,
    uncomfortableForwardJumps,
  });
}

export function shouldAutoFinishAttempt({
  endEvidence = false,
  listening = false,
  millisecondsSinceSpeech = 0,
  positionProgress = 0,
  silenceThresholdMs = 5_000,
} = {}) {
  return Boolean(
    listening
    && endEvidence
    && Number(positionProgress) >= 0.9
    && Number(millisecondsSinceSpeech) >= silenceThresholdMs
  );
}

export { CONFIDENCE_BANDS };
