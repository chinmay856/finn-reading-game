import {
  MYCORNER_CAMPAIGN_UNITS,
  MYCORNER_RESTORE_UNITS,
  describeMyCornerUnit,
  getNextMyCornerUnit,
} from "./mycorner-rules.js";

export const MYCORNER_STATE_VERSION = 1;
export const MYCORNER_STATE_KEY = "internet-recovery-98.mycorner.campaign.v1";

// Canonical registry eligibility still requires the persisted secured state;
// preview and diagnostic states cannot enter the Case File.
export const MYCORNER_PROVISIONAL_EVIDENCE_ID = "mycorner.evidence.global-profile-template-01";
export const MYCORNER_PROVISIONAL_BLOCKED_WRITE_ID = "mycorner-blocked-write-owner-permission-01";

export const MYCORNER_PROVISIONAL_EVIDENCE_RECORD = Object.freeze({
  aiBehavior: "The profile generator treated one polished demo account as the template for everyone.",
  assetId: null,
  canonical: true,
  eligibleForCanonicalCount: true,
  filename: "MYCORNER_GLOBAL_PROFILE_TEMPLATE.REC",
  id: MYCORNER_PROVISIONAL_EVIDENCE_ID,
  label: "GLOBAL PROFILE TEMPLATE",
  principle: "You choose what represents you.",
  provisional: false,
  registryStatus: "canonical-secured-only",
  routeFragment: Object.freeze({
    accessibleSummary: "MyCorner's local Auto-Persona template job routes to the upstream AI repair service.",
    from: "mycorner-process-auto-persona-01",
    fromLabel: "AUTO-PERSONA",
    id: "mycorner.route.global-template-04",
    relationshipLabel: "local profile-template job routed to parent service",
    to: "ai_repair_service",
    toLabel: "AI REPAIR SERVICE",
  }),
  siteId: "mycorner",
  slot: 4,
  summary: "The profile generator treated one polished demo account as the template for everyone.",
  testOnly: false,
  title: "MYCORNER / GLOBAL PROFILE TEMPLATE",
  upstreamServiceId: "ai_repair_service",
  whatChanged: "Profiles keep owner-written identity, chosen themes, and visible privacy controls.",
  writerFingerprint: "mc-autopersona-vibeshift-44b2",
});

export const MYCORNER_PROVISIONAL_BLOCKED_WRITE_RECORD = Object.freeze({
  actorId: "mycorner-process-auto-persona-01",
  body: "AUTO-PERSONA tried to overwrite another profile.",
  canonical: true,
  eligibleForCanonicalCount: true,
  id: MYCORNER_PROVISIONAL_BLOCKED_WRITE_ID,
  label: "OWNER PERMISSION REQUIRED",
  provisional: false,
  registryStatus: "canonical-secured-only",
  siteId: "mycorner",
  slot: 4,
  targetId: "mycorner-profile-rin-moss-02",
  testOnly: false,
  title: "OWNER PERMISSION REQUIRED",
});

const MAX_SESSION_IDS = 32;
const MAX_PASSAGE_IDS = 24;
const UNIT_IDS = MYCORNER_CAMPAIGN_UNITS.map((unit) => unit.unitId);

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

export function normalizeMyCornerState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const completedUnitIds = completedUnitPrefix(value.completedUnitIds);
  const completedCount = completedUnitIds.length;
  const restoreComplete = completedCount >= MYCORNER_RESTORE_UNITS.length;
  const secured = completedCount === MYCORNER_CAMPAIGN_UNITS.length;
  const midpointDiscovered = restoreComplete;
  const midpointAcknowledged = restoreComplete
    && (secured || completedCount > MYCORNER_RESTORE_UNITS.length || Boolean(value.midpointAcknowledged));
  const act = secured
    ? "secured"
    : !restoreComplete
      ? "restore"
      : midpointAcknowledged
        ? "owner-lock"
        : "midpoint";
  const lastUnit = completedCount ? MYCORNER_CAMPAIGN_UNITS[completedCount - 1] : null;
  const stateId = secured
    ? "mycorner_secured"
    : restoreComplete && completedCount === MYCORNER_RESTORE_UNITS.length
      ? "mycorner_template_reveal"
      : lastUnit?.stateId ?? "mycorner_corrupted";
  const appliedSessionIds = boundedUniqueStrings(value.appliedSessionIds, MAX_SESSION_IDS);
  const completedPassageIds = boundedUniqueStrings(value.completedPassageIds, MAX_PASSAGE_IDS);

  return freezeState({
    act,
    appliedSessionIds,
    blockedWriteId: secured ? MYCORNER_PROVISIONAL_BLOCKED_WRITE_ID : null,
    completedPassageIds,
    completedUnitIds,
    evidenceId: secured ? MYCORNER_PROVISIONAL_EVIDENCE_ID : null,
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
    siteId: "mycorner",
    stateId,
    version: MYCORNER_STATE_VERSION,
  });
}

const EMPTY_STATE = normalizeMyCornerState();

function readStoredValue(storage) {
  try {
    const raw = storage?.getItem(MYCORNER_STATE_KEY);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(storage, state, details = {}) {
  if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state });
  try {
    storage.setItem(MYCORNER_STATE_KEY, JSON.stringify(state));
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

function reconcileMyCornerState(storage, currentState) {
  const persisted = readMyCornerState(storage);
  if (currentState?.version !== MYCORNER_STATE_VERSION) return persisted;
  const provided = normalizeMyCornerState(currentState);
  const persistedRank = campaignProgressRank(persisted);
  const providedRank = campaignProgressRank(provided);
  const base = persistedRank >= providedRank ? persisted : provided;
  const other = base === persisted ? provided : persisted;
  return normalizeMyCornerState({
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

export function readMyCornerState(storage) {
  if (!storage) return EMPTY_STATE;
  const parsed = readStoredValue(storage);
  return parsed?.version === MYCORNER_STATE_VERSION
    ? normalizeMyCornerState(parsed)
    : EMPTY_STATE;
}

export function advanceMyCornerState(currentState, {
  completedAt = null,
  outcome,
  passageId,
  sessionId,
} = {}) {
  const current = normalizeMyCornerState(currentState);
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

  const nextUnit = getNextMyCornerUnit(current);
  if (!nextUnit) {
    const reason = current.midpointDiscovered && !current.midpointAcknowledged
      ? "midpoint-acknowledgement-required"
      : "no-unit-available";
    return result({ events: [], ok: false, reason, state: current });
  }

  const expectedKind = nextUnit.act === "restore" ? "restore-unit" : "owner-lock-unit";
  // The reconciled campaign state is authoritative. A reading may have begun
  // in a stale tab, so its outcome can name an earlier unit from the same act;
  // never let that stale snapshot choose or skip the unit applied here.
  if (!outcome || outcome.kind !== expectedKind) {
    return result({ events: [], ok: false, reason: "invalid-outcome", state: current });
  }

  const at = stringOrNull(completedAt);
  const completedUnitIds = [...current.completedUnitIds, nextUnit.unitId];
  const discoveredMidpoint = completedUnitIds.length === MYCORNER_RESTORE_UNITS.length;
  const secured = completedUnitIds.length === MYCORNER_CAMPAIGN_UNITS.length;
  const next = normalizeMyCornerState({
    ...current,
    appliedSessionIds: appendBounded(current.appliedSessionIds, normalizedSessionId, MAX_SESSION_IDS),
    completedPassageIds: appendBounded(current.completedPassageIds, normalizedPassageId, MAX_PASSAGE_IDS),
    completedUnitIds,
    lastPassageId: normalizedPassageId,
    lastReaction: describeMyCornerUnit(nextUnit.unitId),
    lastSavedAt: at,
    lastSessionId: normalizedSessionId,
    midpointDiscovered: current.midpointDiscovered || discoveredMidpoint,
    midpointDiscoveredAt: discoveredMidpoint ? at : current.midpointDiscoveredAt,
    secured,
    securedAt: secured ? at : null,
  });

  const events = [nextUnit.act === "restore" ? "restore-unit-complete" : "owner-lock-unit-complete"];
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

export function acknowledgeMyCornerMidpointState(currentState, { acknowledgedAt = null } = {}) {
  const current = normalizeMyCornerState(currentState);
  if (current.midpointAcknowledged || current.secured) {
    return result({ event: "already-acknowledged", events: [], ok: true, state: current });
  }
  if (!current.midpointDiscovered) {
    return result({ event: "not-ready", events: [], ok: false, reason: "not-ready", state: current });
  }
  const at = stringOrNull(acknowledgedAt);
  const next = normalizeMyCornerState({
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

export function applyMyCornerReading(storage, details = {}) {
  const current = reconcileMyCornerState(storage, details.currentState);
  const transition = advanceMyCornerState(current, {
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

export function acknowledgeMyCornerMidpoint(storage, details = {}) {
  const current = reconcileMyCornerState(storage, details.currentState);
  const transition = acknowledgeMyCornerMidpointState(current, {
    acknowledgedAt: stringOrNull(details.acknowledgedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    event: transition.event,
    events: transition.events,
  });
}
