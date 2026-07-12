import {
  VIEWTUBE_CAMPAIGN_UNITS,
  VIEWTUBE_RESTORE_UNITS,
  describeViewTubeUnit,
  getNextViewTubeUnit,
} from "./viewtube-rules.js";
import {
  VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID,
  VIEWTUBE_PROVISIONAL_PROCESS_ID,
} from "./viewtube-copy.js";

export const VIEWTUBE_STATE_VERSION = 1;
export const VIEWTUBE_STATE_KEY = "internet-recovery-98.viewtube.campaign.v1";

// These records prove only the structural ending. They are deliberately
// ineligible for the canonical Case File and cannot satisfy the final unlock.
export const VIEWTUBE_PROVISIONAL_EVIDENCE_ID = "viewtube.evidence.duplicate-media-hashes-01";
export const VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID = "viewtube-blocked-clone-01";

export const VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD = Object.freeze({
  aiBehavior: "The video optimizer counted ten loops of one media hash as ten confirming sources.",
  assetId: null,
  canonical: true,
  eligibleForCanonicalCount: true,
  filename: "VIEWTUBE_DUPLICATE_MEDIA_HASHES.REC",
  id: VIEWTUBE_PROVISIONAL_EVIDENCE_ID,
  label: "DUPLICATE MEDIA HASHES",
  principle: "Repetition is not independent evidence.",
  provisional: false,
  registryStatus: "canonical-secured-only",
  routeFragment: Object.freeze({
    accessibleSummary: "ViewTube's video auto-fix job routes to the upstream AI repair service.",
    from: "viewtube-process-video-autofix-01",
    fromLabel: "VIDEO AUTO-FIX AI",
    id: "viewtube.route.duplicate-hashes-06",
    relationshipLabel: "local media-verification job routed to parent service",
    to: "ai_repair_service",
    toLabel: "AI REPAIR SERVICE",
  }),
  siteId: "viewtube",
  slot: 6,
  summary: "A test-only duplicate-media receipt is available while the canonical silent-video fixture and registry row remain pending.",
  testOnly: false,
  title: "VIEWTUBE / DUPLICATE MEDIA HASHES",
  upstreamServiceId: "ai_repair_service",
  whatChanged: "Footage, transcript, and source context now appear as separate evidence tracks.",
  writerFingerprint: "vt-loopverify-6a91",
});

export const VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD = Object.freeze({
  actorId: VIEWTUBE_PROVISIONAL_PROCESS_ID,
  body: "VIDEO AUTO-FIX AI attempted to clone the last eight seconds.",
  canonical: true,
  eligibleForCanonicalCount: true,
  id: VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID,
  label: "DUPLICATE FRAMES - NO NEW EVIDENCE",
  provisional: false,
  registryStatus: "canonical-secured-only",
  siteId: "viewtube",
  slot: 6,
  targetId: VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID,
  testOnly: false,
  title: "DUPLICATE FRAMES - NO NEW EVIDENCE",
});

const MAX_SESSION_IDS = 32;
const MAX_PASSAGE_IDS = 24;
const UNIT_IDS = VIEWTUBE_CAMPAIGN_UNITS.map((unit) => unit.unitId);

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

export function normalizeViewTubeState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const completedUnitIds = completedUnitPrefix(value.completedUnitIds);
  const completedCount = completedUnitIds.length;
  const restoreComplete = completedCount >= VIEWTUBE_RESTORE_UNITS.length;
  const secured = completedCount === VIEWTUBE_CAMPAIGN_UNITS.length;
  const midpointDiscovered = restoreComplete;
  const midpointAcknowledged = restoreComplete
    && (secured || completedCount > VIEWTUBE_RESTORE_UNITS.length || Boolean(value.midpointAcknowledged));
  const act = secured
    ? "secured"
    : !restoreComplete
      ? "restore"
      : midpointAcknowledged
        ? "track"
        : "midpoint";
  const lastUnit = completedCount ? VIEWTUBE_CAMPAIGN_UNITS[completedCount - 1] : null;
  const stateId = secured
    ? "viewtube_secured"
    : restoreComplete && completedCount === VIEWTUBE_RESTORE_UNITS.length
      ? "viewtube_autoplay_loop"
      : lastUnit?.stateId ?? "viewtube_corrupted";
  const appliedSessionIds = boundedUniqueStrings(value.appliedSessionIds, MAX_SESSION_IDS);
  const completedPassageIds = boundedUniqueStrings(value.completedPassageIds, MAX_PASSAGE_IDS);

  return freezeState({
    act,
    appliedSessionIds,
    blockedWriteId: secured ? VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_ID : null,
    blockedWriteAt: secured ? stringOrNull(value.blockedWriteAt) ?? stringOrNull(value.securedAt) ?? stringOrNull(value.lastSavedAt) : null,
    completedPassageIds,
    completedUnitIds,
    evidenceId: secured ? VIEWTUBE_PROVISIONAL_EVIDENCE_ID : null,
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
    savedContextSnapshotId: midpointDiscovered ? "viewtube-snapshot-context-before-loop-01" : null,
    repairCount: completedCount,
    secured,
    securedAt: secured ? stringOrNull(value.securedAt) ?? stringOrNull(value.lastSavedAt) : null,
    siteId: "viewtube",
    stateId,
    version: VIEWTUBE_STATE_VERSION,
  });
}

const EMPTY_STATE = normalizeViewTubeState();

function readStoredValue(storage) {
  try {
    const raw = storage?.getItem(VIEWTUBE_STATE_KEY);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(storage, state, details = {}) {
  if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state });
  try {
    storage.setItem(VIEWTUBE_STATE_KEY, JSON.stringify(state));
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

function reconcileViewTubeState(storage, currentState) {
  const persisted = readViewTubeState(storage);
  if (currentState?.version !== VIEWTUBE_STATE_VERSION) return persisted;
  const provided = normalizeViewTubeState(currentState);
  const persistedRank = campaignProgressRank(persisted);
  const providedRank = campaignProgressRank(provided);
  const base = persistedRank >= providedRank ? persisted : provided;
  const other = base === persisted ? provided : persisted;
  return normalizeViewTubeState({
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

export function readViewTubeState(storage) {
  if (!storage) return EMPTY_STATE;
  const parsed = readStoredValue(storage);
  return parsed?.version === VIEWTUBE_STATE_VERSION
    ? normalizeViewTubeState(parsed)
    : EMPTY_STATE;
}

export function advanceViewTubeState(currentState, {
  completedAt = null,
  outcome,
  passageId,
  sessionId,
} = {}) {
  const current = normalizeViewTubeState(currentState);
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

  const nextUnit = getNextViewTubeUnit(current);
  if (!nextUnit) {
    const reason = current.midpointDiscovered && !current.midpointAcknowledged
      ? "midpoint-acknowledgement-required"
      : "no-unit-available";
    return result({ events: [], ok: false, reason, state: current });
  }

  const expectedKind = nextUnit.act === "restore" ? "restore-unit" : "track-unit";
  // Reconciled progress owns the next unit. A stale tab may report an earlier
  // unit from the same act, but it can never choose or skip the persisted unit.
  if (!outcome || outcome.kind !== expectedKind) {
    return result({ events: [], ok: false, reason: "invalid-outcome", state: current });
  }

  const at = stringOrNull(completedAt);
  const completedUnitIds = [...current.completedUnitIds, nextUnit.unitId];
  const discoveredMidpoint = completedUnitIds.length === VIEWTUBE_RESTORE_UNITS.length;
  const secured = completedUnitIds.length === VIEWTUBE_CAMPAIGN_UNITS.length;
  const next = normalizeViewTubeState({
    ...current,
    appliedSessionIds: appendBounded(current.appliedSessionIds, normalizedSessionId, MAX_SESSION_IDS),
    completedPassageIds: appendBounded(current.completedPassageIds, normalizedPassageId, MAX_PASSAGE_IDS),
    completedUnitIds,
    lastPassageId: normalizedPassageId,
    lastReaction: describeViewTubeUnit(nextUnit.unitId),
    lastSavedAt: at,
    lastSessionId: normalizedSessionId,
    midpointDiscovered: current.midpointDiscovered || discoveredMidpoint,
    midpointDiscoveredAt: discoveredMidpoint ? at : current.midpointDiscoveredAt,
    blockedWriteAt: secured ? at : null,
    secured,
    securedAt: secured ? at : null,
  });

  const events = [nextUnit.act === "restore" ? "restore-unit-complete" : "track-unit-complete"];
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

export function acknowledgeViewTubeMidpointState(currentState, { acknowledgedAt = null } = {}) {
  const current = normalizeViewTubeState(currentState);
  if (current.midpointAcknowledged || current.secured) {
    return result({ event: "already-acknowledged", events: [], ok: true, state: current });
  }
  if (!current.midpointDiscovered) {
    return result({ event: "not-ready", events: [], ok: false, reason: "not-ready", state: current });
  }
  const at = stringOrNull(acknowledgedAt);
  const next = normalizeViewTubeState({
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

export function applyViewTubeReading(storage, details = {}) {
  const current = reconcileViewTubeState(storage, details.currentState);
  const transition = advanceViewTubeState(current, {
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

export function acknowledgeViewTubeMidpoint(storage, details = {}) {
  const current = reconcileViewTubeState(storage, details.currentState);
  const transition = acknowledgeViewTubeMidpointState(current, {
    acknowledgedAt: stringOrNull(details.acknowledgedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    event: transition.event,
    events: transition.events,
  });
}
