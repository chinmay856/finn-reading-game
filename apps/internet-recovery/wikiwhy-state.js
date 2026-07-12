import {
  describeWikiWhyRepairAdvance,
  describeWikiWhyShieldPass,
} from "./wikiwhy-rules.js";

export const WIKIWHY_STATE_KEY = "internet-recovery-98.wikiwhy.prototype.v3";
const LEGACY_WIKIWHY_STATE_KEYS = Object.freeze([
  "internet-recovery-98.wikiwhy.prototype.v2",
  "internet-recovery-98.wikiwhy.prototype.v1",
]);

export const WIKIWHY_EVIDENCE_ID = "wikiwhy.active-write-after-command-end";
export const WIKIWHY_EVIDENCE_RECORD = Object.freeze({
  id: WIKIWHY_EVIDENCE_ID,
  title: "WIKIWHY / ACTIVE WRITE AFTER COMMAND END",
  principle: "People can contribute, but evidence earns trust.",
  behavior: "The automated verifier kept writing after its command ended.",
});

const PHASES = new Set(["act-one", "reverse-hack", "shield", "secured"]);
const MAX_SESSION_IDS = 32;
const MAX_PASSAGE_IDS = 24;

const EMPTY_STATE = freezeState({
  appliedSessionIds: [],
  completedPassageIds: [],
  evidenceId: null,
  lastAdvance: 0,
  lastPassageId: null,
  lastReaction: null,
  lastRepairAt: null,
  lastSessionId: null,
  overwriteDetectedAt: null,
  phase: "act-one",
  repairCount: 0,
  securedAt: null,
  shieldPass: 0,
  shieldProgress: 0,
  shieldStartedAt: null,
  stability: 0,
  version: 3,
  warningTriggered: false,
});

function finiteNumber(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function boundedInteger(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Math.trunc(finiteNumber(value))));
}

function boundedUniqueStrings(value, maximum) {
  if (!Array.isArray(value)) return Object.freeze([]);
  const values = [];
  for (const item of value) {
    if (typeof item !== "string" || !item || values.includes(item)) continue;
    values.push(item);
  }
  return Object.freeze(values.slice(-maximum));
}

function freezeState(value) {
  return Object.freeze({
    ...value,
    appliedSessionIds: Object.freeze([...(value.appliedSessionIds ?? [])]),
    completedPassageIds: Object.freeze([...(value.completedPassageIds ?? [])]),
  });
}

function normalizeVersionThree(parsed) {
  const phase = PHASES.has(parsed?.phase) ? parsed.phase : "act-one";
  const shieldPass = phase === "secured" ? 3 : boundedInteger(parsed?.shieldPass, 0, phase === "shield" ? 2 : 0);
  const shieldProgress = phase === "secured" ? 100 : phase === "shield" ? [0, 33, 66][shieldPass] : 0;
  const rawStability = Math.min(80, Math.max(0, finiteNumber(parsed?.stability)));
  const stability = phase === "secured" ? 100 : phase === "act-one" ? rawStability : 80;
  const appliedSessionIds = boundedUniqueStrings(parsed?.appliedSessionIds, MAX_SESSION_IDS);
  const completedPassageIds = boundedUniqueStrings(parsed?.completedPassageIds, MAX_PASSAGE_IDS);
  const lastSessionId = typeof parsed?.lastSessionId === "string" && parsed.lastSessionId
    ? parsed.lastSessionId
    : appliedSessionIds.at(-1) ?? null;
  return freezeState({
    appliedSessionIds,
    completedPassageIds,
    evidenceId: phase === "secured" ? WIKIWHY_EVIDENCE_ID : null,
    lastAdvance: Math.max(0, finiteNumber(parsed?.lastAdvance)),
    lastPassageId: typeof parsed?.lastPassageId === "string" ? parsed.lastPassageId : null,
    lastReaction: typeof parsed?.lastReaction === "string" ? parsed.lastReaction : null,
    lastRepairAt: typeof parsed?.lastRepairAt === "string" ? parsed.lastRepairAt : null,
    lastSessionId,
    overwriteDetectedAt: phase === "act-one" ? null : parsed?.overwriteDetectedAt ?? parsed?.lastRepairAt ?? null,
    phase,
    repairCount: Math.max(0, Math.trunc(finiteNumber(parsed?.repairCount))),
    securedAt: phase === "secured" ? parsed?.securedAt ?? parsed?.lastRepairAt ?? null : null,
    shieldPass,
    shieldProgress,
    shieldStartedAt: phase === "shield" || phase === "secured" ? parsed?.shieldStartedAt ?? null : null,
    stability,
    version: 3,
    warningTriggered: Boolean(parsed?.warningTriggered) || stability >= 70,
  });
}

function migrateLegacyState(parsed) {
  if (parsed?.version !== 1 && parsed?.version !== 2) return null;
  const repairCount = Math.max(0, Math.trunc(finiteNumber(parsed.repairCount)));
  const legacyStability = parsed.version === 1 ? Math.min(80, repairCount * 10) : 0;
  const stability = Math.min(80, Math.max(0, finiteNumber(parsed.stability, legacyStability)));
  const lastSessionId = typeof parsed.lastSessionId === "string" && parsed.lastSessionId
    ? parsed.lastSessionId
    : null;
  return normalizeVersionThree({
    appliedSessionIds: lastSessionId ? [lastSessionId] : [],
    completedPassageIds: parsed.lastPassageId ? [String(parsed.lastPassageId)] : [],
    lastAdvance: parsed.lastAdvance,
    lastPassageId: parsed.lastPassageId,
    lastReaction: parsed.lastReaction,
    lastRepairAt: parsed.lastRepairAt,
    lastSessionId,
    overwriteDetectedAt: stability >= 80 ? parsed.lastRepairAt ?? null : null,
    phase: stability >= 80 ? "reverse-hack" : "act-one",
    repairCount,
    stability,
    version: 3,
    warningTriggered: stability >= 70,
  });
}

function readStoredValue(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(storage, state, details = {}) {
  if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state });
  try {
    storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify(state));
    return Object.freeze({ ...details, ok: true, state });
  } catch {
    return Object.freeze({ ...details, ok: false, reason: "write-failed", state });
  }
}

function appendBounded(items, value, maximum) {
  if (!value) return [...items];
  return [...items.filter((item) => item !== value), value].slice(-maximum);
}

function campaignProgressRank(state) {
  if (state.phase === "secured") return 1_000;
  if (state.phase === "shield") return 800 + state.shieldPass;
  if (state.phase === "reverse-hack") return 700;
  return state.stability;
}

function reconcileCampaignState(storage, currentState) {
  const persisted = readWikiWhyState(storage);
  if (currentState?.version !== 3) return persisted;
  const provided = normalizeVersionThree(currentState);
  const persistedRank = campaignProgressRank(persisted);
  const providedRank = campaignProgressRank(provided);
  const base = persistedRank > providedRank
    || (persistedRank === providedRank && persisted.repairCount >= provided.repairCount)
    ? persisted
    : provided;
  const other = base === persisted ? provided : persisted;
  return normalizeVersionThree({
    ...base,
    appliedSessionIds: boundedUniqueStrings(
      [...other.appliedSessionIds, ...base.appliedSessionIds],
      MAX_SESSION_IDS,
    ),
    completedPassageIds: boundedUniqueStrings(
      [...other.completedPassageIds, ...base.completedPassageIds],
      MAX_PASSAGE_IDS,
    ),
    repairCount: Math.max(base.repairCount, other.repairCount),
    warningTriggered: base.warningTriggered || other.warningTriggered,
  });
}

export function readWikiWhyState(storage) {
  if (!storage) return EMPTY_STATE;
  const current = readStoredValue(storage, WIKIWHY_STATE_KEY);
  if (current?.version === 3) return normalizeVersionThree(current);
  for (const key of LEGACY_WIKIWHY_STATE_KEYS) {
    const migrated = migrateLegacyState(readStoredValue(storage, key));
    if (migrated) return migrated;
  }
  return EMPTY_STATE;
}

export function applyWikiWhyReading(storage, {
  currentState,
  outcome = {},
  passageId,
  repairedAt,
  sessionId,
} = {}) {
  const current = reconcileCampaignState(storage, currentState);
  const normalizedSessionId = typeof sessionId === "string" && sessionId ? sessionId : null;
  if (normalizedSessionId && current.appliedSessionIds.includes(normalizedSessionId)) {
    return persistState(storage, current, { duplicate: true, events: Object.freeze([]) });
  }
  if (current.phase === "secured") {
    return persistState(storage, current, { events: Object.freeze(["already-secured"]) });
  }
  if (current.phase === "reverse-hack") {
    return Object.freeze({ events: Object.freeze([]), ok: false, reason: "shield-not-started", state: current });
  }

  const nextPassageId = typeof passageId === "string" && passageId ? passageId : null;
  if (!nextPassageId) {
    return Object.freeze({ events: Object.freeze([]), ok: false, reason: "missing-passage-id", state: current });
  }
  if (current.completedPassageIds.includes(nextPassageId)) {
    return persistState(storage, current, { duplicatePassage: true, events: Object.freeze([]) });
  }

  const isShield = current.phase === "shield";
  const expectedKind = isShield ? "shield-pass" : "act-one-repair";
  if (outcome.kind !== expectedKind) {
    return Object.freeze({ events: Object.freeze([]), ok: false, reason: "invalid-outcome", state: current });
  }

  const at = typeof repairedAt === "string" && repairedAt ? repairedAt : new Date().toISOString();
  const appliedSessionIds = appendBounded(current.appliedSessionIds, normalizedSessionId, MAX_SESSION_IDS);
  const completedPassageIds = appendBounded(current.completedPassageIds, nextPassageId, MAX_PASSAGE_IDS);
  const common = {
    ...current,
    appliedSessionIds,
    completedPassageIds,
    lastPassageId: nextPassageId,
    lastReaction: current.lastReaction,
    lastRepairAt: at,
    lastSessionId: normalizedSessionId,
    repairCount: current.repairCount + 1,
  };

  if (isShield) {
    const shieldPass = Math.min(3, current.shieldPass + 1);
    const secured = shieldPass === 3;
    const next = normalizeVersionThree({
      ...common,
      evidenceId: secured ? WIKIWHY_EVIDENCE_ID : null,
      lastAdvance: 0,
      lastReaction: describeWikiWhyShieldPass(shieldPass),
      phase: secured ? "secured" : "shield",
      securedAt: secured ? at : null,
      shieldPass,
      shieldStartedAt: current.shieldStartedAt,
      stability: secured ? 100 : 80,
    });
    return persistState(storage, next, {
      events: Object.freeze([secured ? "site-secured" : "shield-pass-complete"]),
    });
  }

  const proposedAdvance = Math.max(0, finiteNumber(outcome.advance));
  const stability = Math.min(80, current.stability + proposedAdvance);
  const lastAdvance = stability - current.stability;
  const crossedWarning = !current.warningTriggered && current.stability < 70 && stability >= 70;
  const reachedRewrite = current.stability < 80 && stability >= 80;
  const events = [];
  if (crossedWarning) events.push("amy-warning");
  if (reachedRewrite) events.push("reverse-hack-ready");
  if (!events.length) events.push("passage-complete");
  const next = normalizeVersionThree({
    ...common,
    lastAdvance,
    lastReaction: describeWikiWhyRepairAdvance(lastAdvance),
    overwriteDetectedAt: reachedRewrite ? at : current.overwriteDetectedAt,
    phase: reachedRewrite ? "reverse-hack" : "act-one",
    stability,
    warningTriggered: current.warningTriggered || crossedWarning,
  });
  return persistState(storage, next, { events: Object.freeze(events) });
}

export function beginWikiWhyShield(storage, { currentState, startedAt } = {}) {
  const current = reconcileCampaignState(storage, currentState);
  if (current.phase === "shield" || current.phase === "secured") {
    return persistState(storage, current, { event: "already-started" });
  }
  if (current.phase !== "reverse-hack") {
    return Object.freeze({ event: "not-ready", ok: false, reason: "not-ready", state: current });
  }
  const next = normalizeVersionThree({
    ...current,
    phase: "shield",
    shieldPass: 0,
    shieldStartedAt: typeof startedAt === "string" && startedAt ? startedAt : new Date().toISOString(),
    stability: 80,
  });
  return persistState(storage, next, { event: "shield-intro" });
}

// Compatibility adapter for the original one-passage prototype API.
export function recordWikiWhyRepair(storage, details = {}) {
  const { advance, reaction, stability: _ignoredStability, ...metadata } = details;
  return applyWikiWhyReading(storage, {
    ...metadata,
    outcome: { advance, kind: "act-one-repair", reaction },
  });
}
