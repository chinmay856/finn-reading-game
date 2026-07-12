import {
  FACEPLACE_CAMPAIGN_UNITS,
  FACEPLACE_FALSE_TRACKER_UNITS,
  describeFacePlaceUnit,
  getNextFacePlaceUnit,
} from "./faceplace-rules.js";

export const FACEPLACE_STATE_VERSION = 2;
export const FACEPLACE_STATE_KEY = "internet-recovery-98.faceplace.campaign.v2";

// These identities exercise the structural ending only. They are deliberately
// ineligible for the canonical Case File registry and final campaign unlock.
export const FACEPLACE_PROVISIONAL_EVIDENCE_ID = "faceplace.evidence.promoted-feed-01";
export const FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID = "faceplace.blocked-boost-01";

export const FACEPLACE_PROVISIONAL_EVIDENCE_RECORD = Object.freeze({
  aiBehavior: "The feed optimizer repeated one generated claim because reactions were easier to measure than importance.",
  assetId: null,
  canonical: true,
  eligibleForCanonicalCount: true,
  filename: "FACEPLACE_PROMOTED_FEED.REC",
  id: FACEPLACE_PROVISIONAL_EVIDENCE_ID,
  label: "PROMOTED-FEED RECORD",
  principle: "A feed is a selection, not the whole world.",
  provisional: false,
  registryStatus: "canonical-secured-only",
  routeFragment: Object.freeze({ accessibleSummary: "FacePlace's local Feed Auto-Fix amplification job routes to the upstream AI repair service.", from: "faceplace-process-feed-autofix-01", fromLabel: "FEED AUTO-FIX AI", id: "faceplace.route.promoted-feed-03", relationshipLabel: "child amplification job routed to parent service", to: "ai_repair_service", toLabel: "AI REPAIR SERVICE" }),
  siteId: "faceplace",
  slot: 3,
  summary: "Chronology, authorship, recommendation reasons, and source lineage were restored.",
  testOnly: false,
  title: "FACEPLACE / PROMOTED-FEED RECORD",
  upstreamServiceId: "ai_repair_service",
  whatChanged: "Chronology, authorship, recommendation reasons, and source lineage were restored.",
  writerFingerprint: "fp-vibeshift-amplify-7c31",
});

export const FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD = Object.freeze({
  actorId: "faceplace-process-feed-autofix-01",
  body: "FEED AUTO-FIX AI attempted to boost the same post again.",
  canonical: true,
  id: FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID,
  label: "FORCED DISTRIBUTION: OFF",
  eligibleForCanonicalCount: true,
  provisional: false,
  registryStatus: "canonical-secured-only",
  siteId: "faceplace",
  slot: 3,
  targetId: "faceplace-card-crispmaster-01",
  testOnly: false,
  title: "FORCED DISTRIBUTION: OFF",
});

const MAX_SESSION_IDS = 32;
const MAX_PASSAGE_IDS = 24;
const UNIT_IDS = FACEPLACE_CAMPAIGN_UNITS.map((unit) => unit.unitId);
const FEED_MODES = new Set(["ranked", "chronological"]);

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

export function normalizeFacePlaceState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const completedUnitIds = completedUnitPrefix(value.completedUnitIds);
  const completedCount = completedUnitIds.length;
  const actOneComplete = completedCount >= FACEPLACE_FALSE_TRACKER_UNITS.length;
  const secured = completedCount === FACEPLACE_CAMPAIGN_UNITS.length;
  const midpointDiscovered = actOneComplete;
  const midpointAcknowledged = actOneComplete
    && (secured || completedCount > FACEPLACE_FALSE_TRACKER_UNITS.length || Boolean(value.midpointAcknowledged));
  const chronologyVerified = completedUnitIds.includes("chronology_verified");
  const feedMode = chronologyVerified
    ? FEED_MODES.has(value.feedMode) ? value.feedMode : "chronological"
    : "ranked";
  const act = secured
    ? "secured"
    : !actOneComplete
      ? "false-tracker"
      : midpointAcknowledged
        ? "recovery"
        : "midpoint";
  const lastUnit = completedCount ? FACEPLACE_CAMPAIGN_UNITS[completedCount - 1] : null;
  const stateId = secured
    ? "faceplace_secured"
    : actOneComplete && completedCount === FACEPLACE_FALSE_TRACKER_UNITS.length
      ? "faceplace_honest_zero"
      : lastUnit?.stateId ?? "faceplace_corrupted";
  const appliedSessionIds = boundedUniqueStrings(value.appliedSessionIds, MAX_SESSION_IDS);
  const completedPassageIds = boundedUniqueStrings(value.completedPassageIds, MAX_PASSAGE_IDS);

  return freezeState({
    act,
    appliedSessionIds,
    blockedWriteId: secured ? FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID : null,
    completedPassageIds,
    completedUnitIds,
    evidenceId: secured ? FACEPLACE_PROVISIONAL_EVIDENCE_ID : null,
    feedMode,
    lastCompletedStateId: lastUnit?.stateId ?? null,
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
    siteId: "faceplace",
    stateId,
    version: FACEPLACE_STATE_VERSION,
  });
}

const EMPTY_STATE = normalizeFacePlaceState();

function readStoredValue(storage) {
  try {
    const raw = storage?.getItem(FACEPLACE_STATE_KEY);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(storage, state, details = {}) {
  if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state });
  try {
    storage.setItem(FACEPLACE_STATE_KEY, JSON.stringify(state));
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

function reconcileFacePlaceState(storage, currentState) {
  const persisted = readFacePlaceState(storage);
  if (currentState?.version !== FACEPLACE_STATE_VERSION) return persisted;
  const provided = normalizeFacePlaceState(currentState);
  const persistedRank = campaignProgressRank(persisted);
  const providedRank = campaignProgressRank(provided);
  const base = persistedRank >= providedRank ? persisted : provided;
  const other = base === persisted ? provided : persisted;
  return normalizeFacePlaceState({
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

export function readFacePlaceState(storage) {
  if (!storage) return EMPTY_STATE;
  const parsed = readStoredValue(storage);
  return parsed?.version === FACEPLACE_STATE_VERSION
    ? normalizeFacePlaceState(parsed)
    : EMPTY_STATE;
}

export function advanceFacePlaceState(currentState, {
  completedAt = null,
  outcome,
  passageId,
  sessionId,
} = {}) {
  const current = normalizeFacePlaceState(currentState);
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

  const nextUnit = getNextFacePlaceUnit(current);
  if (!nextUnit) {
    const reason = current.midpointDiscovered && !current.midpointAcknowledged
      ? "midpoint-acknowledgement-required"
      : "no-unit-available";
    return result({ events: [], ok: false, reason, state: current });
  }

  const expectedKind = nextUnit.act === "false-tracker"
    ? "false-tracker-unit"
    : "recovery-unit";
  if (!outcome || outcome.kind !== expectedKind) {
    return result({ events: [], ok: false, reason: "invalid-outcome", state: current });
  }

  const at = stringOrNull(completedAt);
  const completedUnitIds = [...current.completedUnitIds, nextUnit.unitId];
  const discoveredMidpoint = completedUnitIds.length === FACEPLACE_FALSE_TRACKER_UNITS.length;
  const secured = completedUnitIds.length === FACEPLACE_CAMPAIGN_UNITS.length;
  const next = normalizeFacePlaceState({
    ...current,
    appliedSessionIds: appendBounded(current.appliedSessionIds, normalizedSessionId, MAX_SESSION_IDS),
    completedPassageIds: appendBounded(current.completedPassageIds, normalizedPassageId, MAX_PASSAGE_IDS),
    completedUnitIds,
    feedMode: nextUnit.unitId === "chronology_verified" ? "chronological" : current.feedMode,
    lastPassageId: normalizedPassageId,
    lastReaction: describeFacePlaceUnit(nextUnit.unitId),
    lastSavedAt: at,
    lastSessionId: normalizedSessionId,
    midpointDiscovered: current.midpointDiscovered || discoveredMidpoint,
    midpointDiscoveredAt: discoveredMidpoint ? at : current.midpointDiscoveredAt,
    secured,
    securedAt: secured ? at : null,
  });

  const events = [nextUnit.act === "false-tracker" ? "unit-complete" : "recovery-unit-complete"];
  if (discoveredMidpoint) events.push("midpoint-discovered");
  if (secured) {
    events.push(
      "site-secured",
      "provisional-evidence-available",
      "provisional-blocked-write-recorded",
    );
  }
  return result({ events, ok: true, state: next });
}

export function acknowledgeFacePlaceMidpointState(currentState, { acknowledgedAt = null } = {}) {
  const current = normalizeFacePlaceState(currentState);
  if (current.midpointAcknowledged || current.secured) {
    return result({ event: "already-acknowledged", events: [], ok: true, state: current });
  }
  if (!current.midpointDiscovered) {
    return result({ event: "not-ready", events: [], ok: false, reason: "not-ready", state: current });
  }
  const at = stringOrNull(acknowledgedAt);
  const next = normalizeFacePlaceState({
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

export function setFacePlaceFeedModeState(currentState, feedMode) {
  const current = normalizeFacePlaceState(currentState);
  if (!FEED_MODES.has(feedMode)) {
    return result({ events: [], ok: false, reason: "invalid-feed-mode", state: current });
  }
  if (!current.completedUnitIds.includes("chronology_verified")) {
    return result({ events: [], ok: false, reason: "chronology-not-restored", state: current });
  }
  return result({
    events: [],
    ok: true,
    state: normalizeFacePlaceState({ ...current, feedMode }),
  });
}

export function applyFacePlaceReading(storage, details = {}) {
  const current = reconcileFacePlaceState(storage, details.currentState);
  const transition = advanceFacePlaceState(current, {
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

export function acknowledgeFacePlaceMidpoint(storage, details = {}) {
  const current = reconcileFacePlaceState(storage, details.currentState);
  const transition = acknowledgeFacePlaceMidpointState(current, {
    acknowledgedAt: stringOrNull(details.acknowledgedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    event: transition.event,
    events: transition.events,
  });
}

export function setFacePlaceFeedMode(storage, feedMode, { currentState } = {}) {
  const current = reconcileFacePlaceState(storage, currentState);
  const transition = setFacePlaceFeedModeState(current, feedMode);
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, { events: transition.events });
}
