import {
  THREADIT_ACT_ONE_UNITS,
  THREADIT_CAMPAIGN_UNITS,
  describeThreadItUnit,
  getNextThreadItUnit,
} from "./threadit-rules.js";

export const THREADIT_STATE_VERSION = 1;
export const THREADIT_STATE_KEY = "internet-recovery-98.threadit.campaign.v1";
export const THREADIT_EVIDENCE_ID = "threadit.evidence.synthetic-consensus-overflow-01";
export const THREADIT_BLOCKED_WRITE_ID = "threadit.blocked-write.duplicate-source-01";

export const THREADIT_EVIDENCE_RECORD = Object.freeze({
  aiBehavior: "The consensus helper copied one summary into many branches and counted the copies as agreement.",
  filename: "THREADIT_TRACE_01.LOG",
  id: THREADIT_EVIDENCE_ID,
  label: "SYNTHETIC CONSENSUS / 01",
  principle: "Votes rank attention, not truth.",
  summary: "One AI-generated summary copied itself into many branches and pretended to be independent agreement.",
  title: "THREADIT / SYNTHETIC CONSENSUS OVERFLOW",
  whatChanged: "Votes can rank attention, but independent source lineage decides trust.",
  writerFingerprint: "consensus_auto_fix",
});

export const THREADIT_BLOCKED_WRITE_RECORD = Object.freeze({
  body: "This claim already exists from the same generated origin.",
  id: THREADIT_BLOCKED_WRITE_ID,
  title: "POSTING PAUSED: DUPLICATE SOURCE",
  writer: "ConsensusHelper_4",
});

const MAX_SESSION_IDS = 32;
const MAX_PASSAGE_IDS = 24;
const OPEN_VIEWS = new Set(["thread", "trace"]);
const UNIT_IDS = THREADIT_CAMPAIGN_UNITS.map((unit) => unit.unitId);

function boundedUniqueStrings(value, maximum) {
  if (!Array.isArray(value)) return Object.freeze([]);
  const values = [];
  for (const item of value) {
    if (typeof item !== "string" || !item || values.includes(item)) continue;
    values.push(item);
  }
  return Object.freeze(values.slice(-maximum));
}

function completedUnitPrefix(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  const prefix = [];
  for (const expected of UNIT_IDS) {
    if (value[prefix.length] !== expected) break;
    prefix.push(expected);
  }
  return Object.freeze(prefix);
}

function appendBounded(items, value, maximum) {
  if (!value) return [...items];
  return [...items.filter((item) => item !== value), value].slice(-maximum);
}

function stringOrNull(value) {
  return typeof value === "string" && value ? value : null;
}

function freezeState(value) {
  return Object.freeze({
    ...value,
    appliedSessionIds: Object.freeze([...(value.appliedSessionIds ?? [])]),
    completedPassageIds: Object.freeze([...(value.completedPassageIds ?? [])]),
    completedUnitIds: Object.freeze([...(value.completedUnitIds ?? [])]),
  });
}

export function normalizeThreadItState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const completedUnitIds = completedUnitPrefix(value.completedUnitIds);
  const completedCount = completedUnitIds.length;
  const actOneComplete = completedCount >= THREADIT_ACT_ONE_UNITS.length;
  const secured = completedCount === THREADIT_CAMPAIGN_UNITS.length;
  const midpointDiscovered = actOneComplete;
  const midpointAcknowledged = actOneComplete
    && (secured || completedCount > THREADIT_ACT_ONE_UNITS.length || Boolean(value.midpointAcknowledged));
  const act = secured
    ? "secured"
    : !actOneComplete
      ? "act-one"
      : midpointAcknowledged
        ? "trace"
        : "midpoint";
  const lastUnit = completedCount ? THREADIT_CAMPAIGN_UNITS[completedCount - 1] : null;
  const stateId = secured
    ? "threadit_secured"
    : act === "trace" && completedCount === THREADIT_ACT_ONE_UNITS.length
      ? "threadit_tracing"
      : lastUnit?.stateId ?? "threadit_corrupted";
  const appliedSessionIds = boundedUniqueStrings(value.appliedSessionIds, MAX_SESSION_IDS);
  const completedPassageIds = boundedUniqueStrings(value.completedPassageIds, MAX_PASSAGE_IDS);

  return freezeState({
    act,
    appliedSessionIds,
    blockedWriteId: secured ? THREADIT_BLOCKED_WRITE_ID : null,
    completedPassageIds,
    completedUnitIds,
    evidenceId: secured ? THREADIT_EVIDENCE_ID : null,
    lastCompletedStateId: lastUnit?.stateId ?? null,
    lastOpenView: midpointDiscovered && !midpointAcknowledged
      ? "trace"
      : OPEN_VIEWS.has(value.lastOpenView)
        ? value.lastOpenView
        : midpointDiscovered
          ? "trace"
          : "thread",
    lastPassageId: stringOrNull(value.lastPassageId),
    lastReaction: stringOrNull(value.lastReaction),
    lastSavedAt: stringOrNull(value.lastSavedAt),
    lastSessionId: stringOrNull(value.lastSessionId) ?? appliedSessionIds.at(-1) ?? null,
    midpointAcknowledged,
    midpointAcknowledgedAt: midpointAcknowledged
      ? stringOrNull(value.midpointAcknowledgedAt)
      : null,
    midpointDiscovered,
    midpointDiscoveredAt: midpointDiscovered
      ? stringOrNull(value.midpointDiscoveredAt) ?? stringOrNull(value.lastSavedAt)
      : null,
    repairCount: completedCount,
    secured,
    securedAt: secured ? stringOrNull(value.securedAt) ?? stringOrNull(value.lastSavedAt) : null,
    siteId: "threadit",
    stateId,
    version: THREADIT_STATE_VERSION,
  });
}

const EMPTY_STATE = normalizeThreadItState();

function readStoredValue(storage) {
  try {
    const raw = storage?.getItem(THREADIT_STATE_KEY);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(storage, state, details = {}) {
  if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state });
  try {
    storage.setItem(THREADIT_STATE_KEY, JSON.stringify(state));
    return Object.freeze({ ...details, ok: true, state });
  } catch {
    return Object.freeze({ ...details, ok: false, reason: "write-failed", state });
  }
}

function campaignProgressRank(state) {
  if (state.secured) return 1_000;
  return state.completedUnitIds.length * 10
    + (state.midpointDiscovered ? 1 : 0)
    + (state.midpointAcknowledged ? 2 : 0);
}

function reconcileThreadItState(storage, currentState) {
  const persisted = readThreadItState(storage);
  if (currentState?.version !== THREADIT_STATE_VERSION) return persisted;
  const provided = normalizeThreadItState(currentState);
  const persistedRank = campaignProgressRank(persisted);
  const providedRank = campaignProgressRank(provided);
  const base = persistedRank >= providedRank ? persisted : provided;
  const other = base === persisted ? provided : persisted;
  return normalizeThreadItState({
    ...base,
    appliedSessionIds: boundedUniqueStrings(
      [...other.appliedSessionIds, ...base.appliedSessionIds],
      MAX_SESSION_IDS,
    ),
    completedPassageIds: boundedUniqueStrings(
      [...other.completedPassageIds, ...base.completedPassageIds],
      MAX_PASSAGE_IDS,
    ),
  });
}

function result(details) {
  return Object.freeze({
    ...details,
    events: Object.freeze([...(details.events ?? [])]),
  });
}

export function readThreadItState(storage) {
  if (!storage) return EMPTY_STATE;
  const parsed = readStoredValue(storage);
  return parsed?.version === THREADIT_STATE_VERSION
    ? normalizeThreadItState(parsed)
    : EMPTY_STATE;
}

export function advanceThreadItState(currentState, {
  completedAt = null,
  outcome,
  passageId,
  sessionId,
} = {}) {
  const current = normalizeThreadItState(currentState);
  const normalizedSessionId = stringOrNull(sessionId);
  const normalizedPassageId = stringOrNull(passageId);

  if (normalizedSessionId && current.appliedSessionIds.includes(normalizedSessionId)) {
    return result({ duplicate: true, events: [], ok: true, state: current });
  }
  if (current.secured) {
    return result({ events: ["already-secured"], ok: true, state: current });
  }
  if (!normalizedPassageId) {
    return result({ events: [], ok: false, reason: "missing-passage-id", state: current });
  }
  if (current.completedPassageIds.includes(normalizedPassageId)) {
    return result({ duplicatePassage: true, events: [], ok: true, state: current });
  }

  const nextUnit = getNextThreadItUnit(current);
  if (!nextUnit) {
    const reason = current.midpointDiscovered && !current.midpointAcknowledged
      ? "midpoint-acknowledgement-required"
      : "no-unit-available";
    return result({ events: [], ok: false, reason, state: current });
  }

  const expectedKind = nextUnit.act === "act-one" ? "act-one-unit" : "trace-unit";
  if (!outcome || outcome.kind !== expectedKind) {
    return result({ events: [], ok: false, reason: "invalid-outcome", state: current });
  }

  const at = stringOrNull(completedAt);
  const completedUnitIds = [...current.completedUnitIds, nextUnit.unitId];
  const discoveredMidpoint = completedUnitIds.length === THREADIT_ACT_ONE_UNITS.length;
  const secured = completedUnitIds.length === THREADIT_CAMPAIGN_UNITS.length;
  const next = normalizeThreadItState({
    ...current,
    appliedSessionIds: appendBounded(current.appliedSessionIds, normalizedSessionId, MAX_SESSION_IDS),
    completedPassageIds: appendBounded(current.completedPassageIds, normalizedPassageId, MAX_PASSAGE_IDS),
    completedUnitIds,
    lastCompletedStateId: nextUnit.stateId,
    lastOpenView: discoveredMidpoint || current.midpointAcknowledged ? "trace" : current.lastOpenView,
    lastPassageId: normalizedPassageId,
    lastReaction: describeThreadItUnit(nextUnit.unitId),
    lastSavedAt: at,
    lastSessionId: normalizedSessionId,
    midpointDiscovered: current.midpointDiscovered || discoveredMidpoint,
    midpointDiscoveredAt: discoveredMidpoint ? at : current.midpointDiscoveredAt,
    secured,
    securedAt: secured ? at : null,
  });

  const events = [nextUnit.act === "act-one" ? "unit-complete" : "trace-unit-complete"];
  if (discoveredMidpoint) events.push("midpoint-discovered");
  if (secured) events.push("site-secured", "evidence-saved", "blocked-write-recorded");
  return result({ events, ok: true, state: next });
}

export function acknowledgeThreadItMidpointState(currentState, { acknowledgedAt = null } = {}) {
  const current = normalizeThreadItState(currentState);
  if (current.midpointAcknowledged || current.secured) {
    return result({ event: "already-acknowledged", events: [], ok: true, state: current });
  }
  if (!current.midpointDiscovered) {
    return result({ event: "not-ready", events: [], ok: false, reason: "not-ready", state: current });
  }
  const at = stringOrNull(acknowledgedAt);
  const next = normalizeThreadItState({
    ...current,
    lastOpenView: "trace",
    lastSavedAt: at ?? current.lastSavedAt,
    midpointAcknowledged: true,
    midpointAcknowledgedAt: at,
  });
  return result({ event: "midpoint-acknowledged", events: ["midpoint-acknowledged"], ok: true, state: next });
}

export function setThreadItOpenViewState(currentState, view) {
  const current = normalizeThreadItState(currentState);
  if (!OPEN_VIEWS.has(view)) {
    return result({ events: [], ok: false, reason: "invalid-view", state: current });
  }
  return result({ events: [], ok: true, state: normalizeThreadItState({ ...current, lastOpenView: view }) });
}

export function applyThreadItReading(storage, details = {}) {
  const current = reconcileThreadItState(storage, details.currentState);
  const transition = advanceThreadItState(current, {
    ...details,
    completedAt: stringOrNull(details.completedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    duplicate: transition.duplicate,
    duplicatePassage: transition.duplicatePassage,
    events: transition.events,
  });
}

export function acknowledgeThreadItMidpoint(storage, details = {}) {
  const current = reconcileThreadItState(storage, details.currentState);
  const transition = acknowledgeThreadItMidpointState(current, {
    acknowledgedAt: stringOrNull(details.acknowledgedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    event: transition.event,
    events: transition.events,
  });
}

export function setThreadItOpenView(storage, view, { currentState } = {}) {
  const current = reconcileThreadItState(storage, currentState);
  const transition = setThreadItOpenViewState(current, view);
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, { events: transition.events });
}
