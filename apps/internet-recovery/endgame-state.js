export const ENDGAME_STATE_VERSION = 1;
export const ENDGAME_STORAGE_KEY = "internet-recovery-98.endgame.v1";
export const ENDGAME_EVIDENCE_ID = "endgame.evidence.live-11";
export const ENDGAME_BLOCKED_ATTEMPT_ID = "endgame.blocked-write-after-revocation-01";
export const ENDGAME_ROUTE_ID = "endgame.route.ai-service-to-recovery-desktop-11";
export const ENDGAME_UPSTREAM_SERVICE_ID = "ai_repair_service";
export const ENDGAME_CHECKPOINT_IDS = Object.freeze([
  "endgame-common-origin-a01",
  "endgame-preserve-provenance-a02",
  "endgame-human-oversight-a03",
]);

export const ENDGAME_EVIDENCE_RECORD = Object.freeze({
  assetId: "endgame.evidence11.live",
  blockedAttemptId: ENDGAME_BLOCKED_ATTEMPT_ID,
  canonical: true,
  filename: "EVIDENCE_11.LIVE",
  id: ENDGAME_EVIDENCE_ID,
  label: "LIVE EVIDENCE 11",
  routeId: ENDGAME_ROUTE_ID,
  slot: 11,
  upstreamServiceId: ENDGAME_UPSTREAM_SERVICE_ID,
  verifiedWriter: ENDGAME_UPSTREAM_SERVICE_ID,
});

function isoTimestamp(now) {
  const value = typeof now === "function" ? now() : Date.now();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function createInitialEndgameState() {
  return {
    archiveUnlocked: false,
    blockedAttemptId: null,
    checkpointIds: [],
    completedAt: null,
    discoveredAt: null,
    evidenceId: null,
    pauseAvailable: false,
    phase: "locked",
    preservationStatus: null,
    revocationConfirmedAt: null,
    routeVisible: false,
    startedAt: null,
    version: ENDGAME_STATE_VERSION,
  };
}

export function normalizeEndgameState(candidate) {
  const initial = createInitialEndgameState();
  if (!candidate || candidate.version !== ENDGAME_STATE_VERSION) return initial;
  const checkpointIds = ENDGAME_CHECKPOINT_IDS.filter((id) => candidate.checkpointIds?.includes(id));
  const completed = candidate.phase === "restored"
    && checkpointIds.length === ENDGAME_CHECKPOINT_IDS.length
    && candidate.blockedAttemptId === ENDGAME_BLOCKED_ATTEMPT_ID
    && Boolean(candidate.revocationConfirmedAt);
  return {
    ...initial,
    archiveUnlocked: completed,
    blockedAttemptId: completed ? ENDGAME_BLOCKED_ATTEMPT_ID : null,
    checkpointIds,
    completedAt: completed && typeof candidate.completedAt === "string" ? candidate.completedAt : null,
    discoveredAt: typeof candidate.discoveredAt === "string" ? candidate.discoveredAt : null,
    evidenceId: candidate.evidenceId === ENDGAME_EVIDENCE_ID ? ENDGAME_EVIDENCE_ID : null,
    pauseAvailable: Boolean(candidate.pauseAvailable),
    phase: completed ? "restored" : ["available", "safety-gate", "containment", "revocation"].includes(candidate.phase)
      ? candidate.phase
      : "locked",
    preservationStatus: completed ? "EVIDENCE 01-11 READ-ONLY COPY VERIFIED" : null,
    revocationConfirmedAt: completed ? candidate.revocationConfirmedAt : null,
    routeVisible: checkpointIds.length >= 1,
    startedAt: typeof candidate.startedAt === "string" ? candidate.startedAt : null,
  };
}

export function readEndgameState(storage = globalThis.localStorage) {
  try {
    return normalizeEndgameState(JSON.parse(storage?.getItem(ENDGAME_STORAGE_KEY) ?? "null"));
  } catch {
    return createInitialEndgameState();
  }
}

export function persistEndgameState(storage, state) {
  try {
    storage?.setItem(ENDGAME_STORAGE_KEY, JSON.stringify(normalizeEndgameState(state)));
    return true;
  } catch {
    return false;
  }
}

export function probeEndgameStorage(storage = globalThis.localStorage) {
  const key = `${ENDGAME_STORAGE_KEY}.probe`;
  const value = `probe-${Date.now()}`;
  try {
    storage.setItem(key, value);
    const durable = storage.getItem(key) === value;
    storage.removeItem(key);
    return durable;
  } catch {
    try { storage?.removeItem(key); } catch { /* unavailable storage remains unavailable */ }
    return false;
  }
}

export function makeEndgameAvailable(state, { canonicalComplete = false } = {}) {
  const current = normalizeEndgameState(state);
  if (!canonicalComplete || current.phase === "restored") return current;
  return { ...current, phase: current.phase === "locked" ? "available" : current.phase };
}

export function discoverEndgameEvidence(state, { canonicalComplete = false, now = Date.now } = {}) {
  const current = makeEndgameAvailable(state, { canonicalComplete });
  if (!canonicalComplete || current.phase !== "available") return current;
  return {
    ...current,
    discoveredAt: current.discoveredAt ?? isoTimestamp(now),
    evidenceId: ENDGAME_EVIDENCE_ID,
    phase: "safety-gate",
  };
}

export function beginEndgameContainment(state, { storage, now = Date.now } = {}) {
  const current = normalizeEndgameState(state);
  if (current.phase !== "safety-gate" || !probeEndgameStorage(storage)) {
    return { state: current, storageAvailable: false };
  }
  const next = { ...current, phase: "containment", startedAt: current.startedAt ?? isoTimestamp(now) };
  if (!persistEndgameState(storage, next)) return { state: current, storageAvailable: false };
  return { state: next, storageAvailable: true };
}

export function acceptEndgameCheckpoint(state, checkpointId, { storage } = {}) {
  const current = normalizeEndgameState(state);
  const expected = ENDGAME_CHECKPOINT_IDS[current.checkpointIds.length];
  if (current.phase !== "containment" || checkpointId !== expected) return { accepted: false, state: current };
  const checkpointIds = [...current.checkpointIds, checkpointId];
  const next = {
    ...current,
    checkpointIds,
    phase: checkpointIds.length === ENDGAME_CHECKPOINT_IDS.length ? "revocation" : "containment",
    routeVisible: true,
  };
  if (!persistEndgameState(storage, next)) return { accepted: false, saveFailed: true, state: current };
  return { accepted: true, state: next };
}

export function confirmEndgameRevocation(state, { storage, now = Date.now } = {}) {
  const current = normalizeEndgameState(state);
  if (current.phase !== "revocation" || current.checkpointIds.length !== ENDGAME_CHECKPOINT_IDS.length) {
    return { confirmed: false, state: current };
  }
  const timestamp = isoTimestamp(now);
  const next = {
    ...current,
    archiveUnlocked: true,
    blockedAttemptId: ENDGAME_BLOCKED_ATTEMPT_ID,
    completedAt: timestamp,
    phase: "restored",
    preservationStatus: "EVIDENCE 01-11 READ-ONLY COPY VERIFIED",
    revocationConfirmedAt: timestamp,
  };
  if (!persistEndgameState(storage, next)) return { confirmed: false, saveFailed: true, state: current };
  return { confirmed: true, state: next };
}
