import {
  YAHUH_CAMPAIGN_UNITS,
  YAHUH_SORT_UNITS,
  describeYahuhUnit,
  getNextYahuhUnit,
} from "./yahuh-rules.js";

export const YAHUH_STATE_VERSION = 1;
export const YAHUH_STATE_KEY = "internet-recovery-98.yahuh.campaign.v1";

// Canonical eligibility still requires the exact persisted secured state;
// preview and diagnostic states remain excluded from the Case File count.
export const YAHUH_PROVISIONAL_EVIDENCE_ID = "yahuh.evidence.single-stream-merge-01";
export const YAHUH_PROVISIONAL_BLOCKED_WRITE_ID = "yahuh-blocked-write-category-source-01";

export const YAHUH_PROVISIONAL_EVIDENCE_RECORD = Object.freeze({
  aiBehavior: "The portal merger replaced distinct channels with one generated stream.",
  assetId: null,
  canonical: true,
  eligibleForCanonicalCount: true,
  filename: "YAHUH_SINGLE_STREAM_MERGE.REC",
  id: YAHUH_PROVISIONAL_EVIDENCE_ID,
  label: "SINGLE STREAM MERGE",
  principle: "Categories, sources, dates, and sponsorship labels remain distinct.",
  provisional: false,
  registryStatus: "canonical-secured-only",
  routeFragment: Object.freeze({
    accessibleSummary: "Yahuh's portal merge job routes to the upstream AI repair service.",
    from: "yahuh-process-portal-autofix-01",
    fromLabel: "PORTAL AUTO-FIX AI",
    id: "yahuh.route.single-stream-05",
    relationshipLabel: "local portal merge routed to parent service",
    to: "ai_repair_service",
    toLabel: "AI REPAIR SERVICE",
  }),
  siteId: "yahuh",
  slot: 5,
  summary: "The portal merger replaced distinct channels with one generated stream.",
  testOnly: false,
  title: "YAHUH PORTAL / SINGLE STREAM MERGE",
  upstreamServiceId: "ai_repair_service",
  whatChanged: "Portal modules now show category, source, date, and sponsorship labels.",
  writerFingerprint: "yh-portalmerge-18d6",
});

export const YAHUH_PROVISIONAL_BLOCKED_WRITE_RECORD = Object.freeze({
  actorId: "yahuh-process-auto-layout-01",
  body: "AUTO-LAYOUT tried to merge the portal again.",
  canonical: true,
  eligibleForCanonicalCount: true,
  id: YAHUH_PROVISIONAL_BLOCKED_WRITE_ID,
  label: "CATEGORY AND SOURCE REQUIRED",
  provisional: false,
  registryStatus: "canonical-secured-only",
  siteId: "yahuh",
  slot: 5,
  targetId: "yahuh-switchboard-all-modules-01",
  testOnly: false,
  title: "CATEGORY AND SOURCE REQUIRED",
});

const MAX_SESSION_IDS = 32;
const MAX_PASSAGE_IDS = 24;
const UNIT_IDS = YAHUH_CAMPAIGN_UNITS.map((unit) => unit.unitId);

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

export function normalizeYahuhState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const completedUnitIds = completedUnitPrefix(value.completedUnitIds);
  const completedCount = completedUnitIds.length;
  const sortComplete = completedCount >= YAHUH_SORT_UNITS.length;
  const secured = completedCount === YAHUH_CAMPAIGN_UNITS.length;
  const midpointDiscovered = sortComplete;
  const midpointAcknowledged = sortComplete
    && (secured || completedCount > YAHUH_SORT_UNITS.length || Boolean(value.midpointAcknowledged));
  const act = secured
    ? "secured"
    : !sortComplete
      ? "sort"
      : midpointAcknowledged
        ? "reconnect"
        : "midpoint";
  const lastUnit = completedCount ? YAHUH_CAMPAIGN_UNITS[completedCount - 1] : null;
  const stateId = secured
    ? "yahuh_secured"
    : sortComplete && completedCount === YAHUH_SORT_UNITS.length
      ? "yahuh_single_stream"
      : lastUnit?.stateId ?? "yahuh_corrupted";
  const appliedSessionIds = boundedUniqueStrings(value.appliedSessionIds, MAX_SESSION_IDS);
  const completedPassageIds = boundedUniqueStrings(value.completedPassageIds, MAX_PASSAGE_IDS);

  return freezeState({
    act,
    appliedSessionIds,
    blockedWriteId: secured ? YAHUH_PROVISIONAL_BLOCKED_WRITE_ID : null,
    blockedWriteAt: secured ? stringOrNull(value.blockedWriteAt) ?? stringOrNull(value.securedAt) ?? stringOrNull(value.lastSavedAt) : null,
    completedPassageIds,
    completedUnitIds,
    evidenceId: secured ? YAHUH_PROVISIONAL_EVIDENCE_ID : null,
    lastCompletedStateId: lastUnit?.stateId ?? null,
    lastPassageId: stringOrNull(value.lastPassageId),
    lastReaction: stringOrNull(value.lastReaction),
    lastSavedAt: stringOrNull(value.lastSavedAt),
    lastSessionId: stringOrNull(value.lastSessionId) ?? appliedSessionIds.at(-1) ?? null,
    midpointAcknowledged,
    midpointAcknowledgedAt: midpointAcknowledged ? stringOrNull(value.midpointAcknowledgedAt) : null,
    midpointDiscovered,
    midpointDiscoveredAt: midpointDiscovered
      ? stringOrNull(value.midpointDiscoveredAt) ?? stringOrNull(value.lastSavedAt)
      : null,
    savedLabelSnapshotId: midpointDiscovered ? "yahuh-saved-label-snapshot-01" : null,
    repairCount: completedCount,
    secured,
    securedAt: secured ? stringOrNull(value.securedAt) ?? stringOrNull(value.lastSavedAt) : null,
    siteId: "yahuh",
    stateId,
    version: YAHUH_STATE_VERSION,
  });
}

const EMPTY_STATE = normalizeYahuhState();

function readStoredValue(storage) {
  try {
    const raw = storage?.getItem(YAHUH_STATE_KEY);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(storage, state, details = {}) {
  if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state });
  try {
    storage.setItem(YAHUH_STATE_KEY, JSON.stringify(state));
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

function reconcileYahuhState(storage, currentState) {
  const persisted = readYahuhState(storage);
  if (currentState?.version !== YAHUH_STATE_VERSION) return persisted;
  const provided = normalizeYahuhState(currentState);
  const persistedRank = campaignProgressRank(persisted);
  const providedRank = campaignProgressRank(provided);
  const base = persistedRank >= providedRank ? persisted : provided;
  const other = base === persisted ? provided : persisted;
  return normalizeYahuhState({
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

export function readYahuhState(storage) {
  if (!storage) return EMPTY_STATE;
  const parsed = readStoredValue(storage);
  return parsed?.version === YAHUH_STATE_VERSION ? normalizeYahuhState(parsed) : EMPTY_STATE;
}

export function advanceYahuhState(currentState, {
  completedAt = null,
  outcome,
  passageId,
  sessionId,
} = {}) {
  const current = normalizeYahuhState(currentState);
  const normalizedSessionId = stringOrNull(sessionId);
  const normalizedPassageId = stringOrNull(passageId);

  if (normalizedSessionId && current.appliedSessionIds.includes(normalizedSessionId)) {
    return result({ duplicate: true, events: [], ok: true, state: current });
  }
  if (current.secured) return result({ events: ["already-secured"], ok: true, state: current });
  if (!normalizedPassageId) return result({ events: [], ok: false, reason: "missing-passage-id", state: current });
  if (current.completedPassageIds.includes(normalizedPassageId)) {
    return result({ duplicatePassage: true, events: [], ok: true, state: current });
  }

  const nextUnit = getNextYahuhUnit(current);
  if (!nextUnit) {
    const reason = current.midpointDiscovered && !current.midpointAcknowledged
      ? "midpoint-acknowledgement-required"
      : "no-unit-available";
    return result({ events: [], ok: false, reason, state: current });
  }

  const expectedKind = nextUnit.act === "sort" ? "sort-unit" : "reconnect-unit";
  // Reconciled state owns the next unit. A stale tab may name an earlier unit
  // from the same act, but it can never choose or skip the persisted next unit.
  if (!outcome || outcome.kind !== expectedKind) {
    return result({ events: [], ok: false, reason: "invalid-outcome", state: current });
  }

  const at = stringOrNull(completedAt);
  const completedUnitIds = [...current.completedUnitIds, nextUnit.unitId];
  const discoveredMidpoint = completedUnitIds.length === YAHUH_SORT_UNITS.length;
  const secured = completedUnitIds.length === YAHUH_CAMPAIGN_UNITS.length;
  const next = normalizeYahuhState({
    ...current,
    appliedSessionIds: appendBounded(current.appliedSessionIds, normalizedSessionId, MAX_SESSION_IDS),
    completedPassageIds: appendBounded(current.completedPassageIds, normalizedPassageId, MAX_PASSAGE_IDS),
    completedUnitIds,
    lastPassageId: normalizedPassageId,
    lastReaction: describeYahuhUnit(nextUnit.unitId),
    lastSavedAt: at,
    lastSessionId: normalizedSessionId,
    midpointDiscovered: current.midpointDiscovered || discoveredMidpoint,
    midpointDiscoveredAt: discoveredMidpoint ? at : current.midpointDiscoveredAt,
    secured,
    blockedWriteAt: secured ? at : null,
    securedAt: secured ? at : null,
  });

  const events = [nextUnit.act === "sort" ? "sort-unit-complete" : "reconnect-unit-complete"];
  if (discoveredMidpoint) events.push("midpoint-discovered");
  if (secured) {
    events.push(
      "site-secured",
      "canonical-evidence-recorded",
      "canonical-blocked-write-recorded",
    );
  }
  return result({ events, ok: true, state: next });
}

export function acknowledgeYahuhMidpointState(currentState, { acknowledgedAt = null } = {}) {
  const current = normalizeYahuhState(currentState);
  if (current.midpointAcknowledged || current.secured) {
    return result({ event: "already-acknowledged", events: [], ok: true, state: current });
  }
  if (!current.midpointDiscovered) {
    return result({ event: "not-ready", events: [], ok: false, reason: "not-ready", state: current });
  }
  const at = stringOrNull(acknowledgedAt);
  const next = normalizeYahuhState({
    ...current,
    lastSavedAt: at ?? current.lastSavedAt,
    midpointAcknowledged: true,
    midpointAcknowledgedAt: at,
  });
  return result({
    event: "midpoint-acknowledged",
    events: ["midpoint-acknowledged"],
    ok: true,
    state: next,
  });
}

export function applyYahuhReading(storage, details = {}) {
  const current = reconcileYahuhState(storage, details.currentState);
  const transition = advanceYahuhState(current, {
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

export function acknowledgeYahuhMidpoint(storage, details = {}) {
  const current = reconcileYahuhState(storage, details.currentState);
  const transition = acknowledgeYahuhMidpointState(current, {
    acknowledgedAt: stringOrNull(details.acknowledgedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    event: transition.event,
    events: transition.events,
  });
}
