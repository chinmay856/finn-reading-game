export const WIKIWHY_STATE_KEY = "internet-recovery-98.wikiwhy.prototype.v2";
const LEGACY_WIKIWHY_STATE_KEY = "internet-recovery-98.wikiwhy.prototype.v1";

const EMPTY_STATE = Object.freeze({
  lastAdvance: 0,
  lastPassageId: null,
  lastReaction: null,
  lastRepairAt: null,
  lastSessionId: null,
  repairCount: 0,
  stability: 0,
  status: "corrupted",
  version: 2,
});

function normalizedState(parsed) {
  if (parsed?.version !== 1 && parsed?.version !== 2) return EMPTY_STATE;
  const repairCount = Number.isFinite(parsed.repairCount) ? Math.max(0, parsed.repairCount) : 0;
  const legacyStability = parsed.version === 1 ? Math.min(80, repairCount * 10) : 0;
  const stability = Number.isFinite(parsed.stability)
    ? Math.min(80, Math.max(0, parsed.stability))
    : legacyStability;
  return Object.freeze({
    lastAdvance: Number.isFinite(parsed.lastAdvance) ? Math.max(0, parsed.lastAdvance) : 0,
    lastPassageId: parsed.lastPassageId ?? null,
    lastReaction: parsed.lastReaction ?? null,
    lastRepairAt: parsed.lastRepairAt ?? null,
    lastSessionId: parsed.lastSessionId ?? null,
    repairCount,
    stability,
    status: stability > 0 || parsed.status === "stable-for-now" ? "stable-for-now" : "corrupted",
    version: 2,
  });
}

export function readWikiWhyState(storage) {
  if (!storage) return EMPTY_STATE;
  try {
    const current = storage.getItem(WIKIWHY_STATE_KEY);
    const parsed = JSON.parse(current ?? storage.getItem(LEGACY_WIKIWHY_STATE_KEY) ?? "null");
    return normalizedState(parsed);
  } catch {
    return EMPTY_STATE;
  }
}

export function recordWikiWhyRepair(storage, {
  advance,
  passageId,
  reaction,
  repairedAt,
  sessionId,
  stability,
}) {
  const current = readWikiWhyState(storage);
  if (sessionId && current.lastSessionId === sessionId) {
    return Object.freeze({ duplicate: true, ok: true, state: current });
  }
  const next = Object.freeze({
    lastAdvance: Number.isFinite(advance) ? Math.max(0, advance) : 0,
    lastPassageId: String(passageId),
    lastReaction: String(reaction),
    lastRepairAt: String(repairedAt),
    lastSessionId: String(sessionId),
    repairCount: current.repairCount + 1,
    stability: Number.isFinite(stability) ? Math.min(80, Math.max(0, stability)) : current.stability,
    status: "stable-for-now",
    version: 2,
  });
  if (!storage) return Object.freeze({ ok: false, reason: "unavailable", state: next });
  try {
    storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify(next));
    return Object.freeze({ ok: true, state: next });
  } catch {
    return Object.freeze({ ok: false, reason: "write-failed", state: next });
  }
}
