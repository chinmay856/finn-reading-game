const PHASES = new Set([
  "phase-one",
  "midpoint-required",
  "lock-sequence",
  "reflection-required",
  "completed",
]);

function positiveInteger(value, label) {
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${label} must be a positive integer.`);
  }
  return value;
}

function normalizePassageId(passageId) {
  return typeof passageId === "string" && passageId.trim() ? passageId.trim() : null;
}

function freezeState(state) {
  return Object.freeze({
    ...state,
    completedPassageIds: Object.freeze([...state.completedPassageIds]),
    skippedPassageIds: Object.freeze([...state.skippedPassageIds]),
    receipt: state.receipt ? Object.freeze({ ...state.receipt }) : null,
  });
}

function result(state, details = {}) {
  return Object.freeze({ ...details, state });
}

function assertState(state) {
  if (!state || !PHASES.has(state.phase)) {
    throw new TypeError("A valid mission sequence state is required.");
  }
}

export function createMissionSequenceState({ phaseOneCount, totalPassages } = {}) {
  const total = positiveInteger(totalPassages, "totalPassages");
  const midpoint = positiveInteger(phaseOneCount, "phaseOneCount");
  if (midpoint >= total) {
    throw new RangeError("phaseOneCount must be smaller than totalPassages.");
  }

  return freezeState({
    completedPassageIds: [],
    comprehensionAttempts: 0,
    frame: "start",
    index: 0,
    pendingPassageId: null,
    phase: "phase-one",
    phaseOneCount: midpoint,
    receipt: null,
    retryCount: 0,
    skippedPassageIds: [],
    totalPassages: total,
    version: 2,
  });
}

function advanceMissionPassage(state, { passageId, skipped = false } = {}) {
  const id = normalizePassageId(passageId);
  if (!id) return result(state, { advanced: false, reason: "missing-passage-id" });
  if (state.completedPassageIds.includes(id) || state.skippedPassageIds.includes(id)) {
    return result(state, { advanced: false, duplicate: true });
  }

  const index = state.index + 1;
  const phase = index === state.phaseOneCount
    ? "midpoint-required"
    : index === state.totalPassages
      ? "reflection-required"
      : state.phase;
  const next = freezeState({
    ...state,
    completedPassageIds: skipped ? state.completedPassageIds : [...state.completedPassageIds, id],
    frame: index,
    index,
    pendingPassageId: null,
    phase,
    skippedPassageIds: skipped ? [...state.skippedPassageIds, id] : state.skippedPassageIds,
  });
  return result(next, { advanced: true, skipped });
}

export function acceptMissionReading(state, { passageId } = {}) {
  assertState(state);
  const id = normalizePassageId(passageId);
  if (!id) return result(state, { accepted: false, reason: "missing-passage-id" });
  if (state.phase === "midpoint-required") {
    return result(state, { accepted: false, reason: "midpoint-required" });
  }
  if (state.phase === "reflection-required" || state.phase === "completed") {
    return result(state, { accepted: false, reason: state.phase });
  }
  if (state.completedPassageIds.includes(id) || state.skippedPassageIds.includes(id)) {
    return result(state, { accepted: true, duplicate: true });
  }
  if (state.pendingPassageId && state.pendingPassageId !== id) {
    return result(state, { accepted: false, reason: "comprehension-required" });
  }
  if (state.pendingPassageId === id) {
    return result(state, { accepted: true, duplicate: true });
  }

  return result(freezeState({ ...state, pendingPassageId: id }), { accepted: true });
}

export function recordMissionComprehension(state, { correct, passageId } = {}) {
  assertState(state);
  const id = normalizePassageId(passageId);
  if (!id) return result(state, { advanced: false, reason: "missing-passage-id" });
  if (state.completedPassageIds.includes(id) || state.skippedPassageIds.includes(id)) {
    return result(state, { advanced: false, duplicate: true });
  }
  if (state.pendingPassageId !== id) {
    return result(state, { advanced: false, reason: "reading-not-accepted" });
  }

  const comprehensionAttempts = state.comprehensionAttempts + 1;
  if (correct !== true) {
    return result(freezeState({ ...state, comprehensionAttempts }), {
      advanced: false,
      correct: false,
      retryComprehension: true,
    });
  }

  const advanced = advanceMissionPassage(
    freezeState({ ...state, comprehensionAttempts }),
    { passageId: id },
  );
  return result(advanced.state, { advanced: true, correct: true });
}

export function skipMissionPassage(state, { passageId } = {}) {
  assertState(state);
  const id = normalizePassageId(passageId);
  if (!id) return result(state, { advanced: false, skipped: false, reason: "missing-passage-id" });
  if (state.phase === "midpoint-required") {
    return result(state, { advanced: false, skipped: false, reason: "midpoint-required" });
  }
  if (state.phase === "reflection-required" || state.phase === "completed") {
    return result(state, { advanced: false, skipped: false, reason: state.phase });
  }
  if (state.pendingPassageId && state.pendingPassageId !== id) {
    return result(state, { advanced: false, skipped: false, reason: "different-passage-pending" });
  }
  return advanceMissionPassage(state, { passageId: id, skipped: true });
}

export function acknowledgeMissionMidpoint(state) {
  assertState(state);
  if (state.phase === "lock-sequence") return result(state, { acknowledged: true, duplicate: true });
  if (state.phase !== "midpoint-required") {
    return result(state, { acknowledged: false, reason: "midpoint-not-required" });
  }
  return result(freezeState({ ...state, phase: "lock-sequence" }), { acknowledged: true });
}

export function retryMissionPassage(state, { passageId } = {}) {
  assertState(state);
  const id = normalizePassageId(passageId);
  if (id && state.pendingPassageId && id !== state.pendingPassageId) {
    return result(state, { retried: false, reason: "different-passage-pending" });
  }
  if (state.phase === "reflection-required" || state.phase === "completed") {
    return result(state, { retried: false, reason: state.phase });
  }
  return result(freezeState({ ...state, retryCount: state.retryCount + 1 }), {
    advanced: false,
    retried: true,
  });
}

export function submitMissionReflection(state, { reflection, submittedAt } = {}) {
  assertState(state);
  if (state.phase === "completed") {
    return result(state, { completed: true, duplicate: true, receipt: state.receipt });
  }
  if (state.phase !== "reflection-required") {
    return result(state, { completed: false, reason: "reflection-not-required" });
  }
  const text = typeof reflection === "string" ? reflection.trim() : "";
  if (!text) return result(state, { completed: false, reason: "missing-reflection" });

  const receipt = Object.freeze({
    completedPassageCount: state.completedPassageIds.length,
    reflection: text,
    skippedPassageCount: state.skippedPassageIds.length,
    submittedAt: typeof submittedAt === "string" && submittedAt
      ? submittedAt
      : new Date().toISOString(),
  });
  const next = freezeState({ ...state, phase: "completed", receipt });
  return result(next, { completed: true, receipt });
}
