import {
  MAPGUESS_CAMPAIGN_UNITS,
  MAPGUESS_REBUILD_UNITS,
  describeMapGuessUnit,
  getNextMapGuessUnit,
  normalizeMapGuessRouteGoal,
} from "./mapguess-rules.js";

export const MAPGUESS_STATE_VERSION = 1;
export const MAPGUESS_STATE_KEY = "internet-recovery-98.mapguess.campaign.v1";

// These records exercise the structural ending only. Their IDs, fixture data,
// and route fields are deliberately ineligible for the canonical Case File and
// can never satisfy the final-incident unlock predicate.
export const MAPGUESS_PROVISIONAL_EVIDENCE_ID = "mapguess.evidence.provisional-test.moved-destination-pin-01";
export const MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID = "mapguess.blocked-write.provisional-test.destination-move-01";

export const MAPGUESS_PROVISIONAL_EVIDENCE_RECORD = Object.freeze({
  aiBehavior: "The route optimizer protected a two-minute ETA by moving the destination.",
  assetId: null,
  canonical: false,
  eligibleForCanonicalCount: false,
  filename: "PROVISIONAL_MAPGUESS_10.LOG",
  id: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
  label: "MOVED DESTINATION PIN · PROVISIONAL TEST",
  principle: "The right route depends on the goal.",
  provisional: true,
  registryStatus: "provisional-test-only",
  routeFragment: null,
  siteId: "mapguess",
  slot: 10,
  summary: "A test-only moved-destination receipt is available while the canonical route registry row remains pending.",
  testOnly: true,
  title: "MAPGUESS / MOVED DESTINATION PIN",
  upstreamServiceId: null,
  whatChanged: "Routes preserve destination, landmarks, scale, date, and the selected goal.",
  writerFingerprint: null,
});

export const MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD = Object.freeze({
  actorId: "mapguess-provisional-process-route-auto-fix-ai-01",
  body: "ROUTE AUTO-FIX AI attempted to move the pin.",
  canonical: false,
  eligibleForCanonicalCount: false,
  id: MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID,
  label: "DESTINATION LOCKED - USER CHOICE REQUIRED",
  provisional: true,
  registryStatus: "provisional-test-only",
  siteId: "mapguess",
  slot: 10,
  targetId: "mapguess-provisional-destination-glasswater-archive-01",
  testOnly: true,
  title: "DESTINATION LOCKED - USER CHOICE REQUIRED",
});

const MAX_SESSION_IDS = 32;
const MAX_PASSAGE_IDS = 24;
const UNIT_IDS = MAPGUESS_CAMPAIGN_UNITS.map((unit) => unit.unitId);

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

export function normalizeMapGuessState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const proposedRouteGoal = normalizeMapGuessRouteGoal(value.routeGoal);
  let completedUnitIds = completedUnitPrefix(value.completedUnitIds);

  // A malformed payload cannot claim the goal-dependent final unit without a
  // valid choice. Truncating to the last valid prefix preserves honest resume.
  if (completedUnitIds.includes("goal_route_lock") && !proposedRouteGoal) {
    completedUnitIds = Object.freeze(completedUnitIds.slice(0, -1));
  }

  const completedCount = completedUnitIds.length;
  const rebuildComplete = completedCount >= MAPGUESS_REBUILD_UNITS.length;
  const secured = completedCount === MAPGUESS_CAMPAIGN_UNITS.length;
  const midpointDiscovered = rebuildComplete;
  const midpointAcknowledged = rebuildComplete
    && (secured || completedCount > MAPGUESS_REBUILD_UNITS.length || Boolean(value.midpointAcknowledged));
  const routeGoal = midpointAcknowledged ? proposedRouteGoal : null;
  const routeGoalLocked = secured && completedUnitIds.includes("goal_route_lock");
  const act = secured
    ? "secured"
    : !rebuildComplete
      ? "rebuild"
      : midpointAcknowledged
        ? "anchor"
        : "midpoint";
  const lastUnit = completedCount ? MAPGUESS_CAMPAIGN_UNITS[completedCount - 1] : null;
  const stateId = secured
    ? "mapguess_secured"
    : rebuildComplete && completedCount === MAPGUESS_REBUILD_UNITS.length
      ? "mapguess_moving_target"
      : lastUnit?.stateId ?? "mapguess_corrupted";
  const appliedSessionIds = boundedUniqueStrings(value.appliedSessionIds, MAX_SESSION_IDS);
  const completedPassageIds = boundedUniqueStrings(value.completedPassageIds, MAX_PASSAGE_IDS);

  return freezeState({
    act,
    appliedSessionIds,
    blockedWriteId: secured ? MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID : null,
    completedPassageIds,
    completedUnitIds,
    evidenceId: secured ? MAPGUESS_PROVISIONAL_EVIDENCE_ID : null,
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
    routeGoal,
    routeGoalLocked,
    routeGoalLockedAt: routeGoalLocked
      ? stringOrNull(value.routeGoalLockedAt) ?? stringOrNull(value.securedAt) ?? stringOrNull(value.lastSavedAt)
      : null,
    routeGoalSelectedAt: routeGoal ? stringOrNull(value.routeGoalSelectedAt) : null,
    secured,
    securedAt: secured ? stringOrNull(value.securedAt) ?? stringOrNull(value.lastSavedAt) : null,
    siteId: "mapguess",
    stateId,
    version: MAPGUESS_STATE_VERSION,
  });
}

const EMPTY_STATE = normalizeMapGuessState();

function readStoredValue(storage) {
  try {
    const raw = storage?.getItem(MAPGUESS_STATE_KEY);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(storage, state, details = {}) {
  if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state });
  try {
    storage.setItem(MAPGUESS_STATE_KEY, JSON.stringify(state));
    return Object.freeze({ ...details, ok: true, state });
  } catch {
    return Object.freeze({ ...details, ok: false, reason: "write-failed", state });
  }
}

function campaignProgressRank(state) {
  if (state.secured) return 1_000;
  return state.completedUnitIds.length * 10
    + (state.midpointDiscovered ? 1 : 0)
    + (state.midpointAcknowledged ? 2 : 0)
    + (state.routeGoal ? 4 : 0);
}

function timestampMilliseconds(value) {
  if (typeof value !== "string" || !value) return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) ? milliseconds : null;
}

function currentHasNewerRouteGoalSelection(persisted, current) {
  if (!current.routeGoal || current.routeGoal === persisted.routeGoal) return false;
  if (current.completedUnitIds.length !== persisted.completedUnitIds.length) return false;
  const currentSelectedAt = timestampMilliseconds(current.routeGoalSelectedAt);
  const persistedSelectedAt = timestampMilliseconds(persisted.routeGoalSelectedAt);
  return currentSelectedAt !== null
    && (persistedSelectedAt === null || currentSelectedAt > persistedSelectedAt);
}

function reconcileMapGuessState(storage, currentState) {
  const persisted = readMapGuessState(storage);
  if (currentState?.version !== MAPGUESS_STATE_VERSION) return persisted;
  const provided = normalizeMapGuessState(currentState);
  const persistedRank = campaignProgressRank(persisted);
  const providedRank = campaignProgressRank(provided);
  const equalRankUsesCurrentGoal = persistedRank === providedRank
    && currentHasNewerRouteGoalSelection(persisted, provided);
  const base = persistedRank > providedRank
    ? persisted
    : persistedRank < providedRank || equalRankUsesCurrentGoal
      ? provided
      : persisted;
  const other = base === persisted ? provided : persisted;
  return normalizeMapGuessState({
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

export function readMapGuessState(storage) {
  if (!storage) return EMPTY_STATE;
  const parsed = readStoredValue(storage);
  return parsed?.version === MAPGUESS_STATE_VERSION
    ? normalizeMapGuessState(parsed)
    : EMPTY_STATE;
}

export function advanceMapGuessState(currentState, {
  completedAt = null,
  outcome,
  passageId,
  sessionId,
} = {}) {
  const current = normalizeMapGuessState(currentState);
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

  const nextUnit = getNextMapGuessUnit(current);
  if (!nextUnit) {
    const reason = current.midpointDiscovered && !current.midpointAcknowledged
      ? "midpoint-acknowledgement-required"
      : current.completedUnitIds.length === MAPGUESS_CAMPAIGN_UNITS.length - 1 && !current.routeGoal
        ? "goal-choice-required"
        : "no-unit-available";
    return result({ events: [], ok: false, reason, state: current });
  }

  const expectedKind = nextUnit.act === "rebuild" ? "rebuild-unit" : "anchor-unit";
  if (!outcome || outcome.kind !== expectedKind) {
    return result({ events: [], ok: false, reason: "invalid-outcome", state: current });
  }
  if (nextUnit.unitId === "goal_route_lock"
    && normalizeMapGuessRouteGoal(outcome.routeGoal) !== current.routeGoal) {
    return result({ events: [], ok: false, reason: "route-goal-outcome-mismatch", state: current });
  }

  const at = stringOrNull(completedAt);
  const completedUnitIds = [...current.completedUnitIds, nextUnit.unitId];
  const discoveredMidpoint = completedUnitIds.length === MAPGUESS_REBUILD_UNITS.length;
  const secured = completedUnitIds.length === MAPGUESS_CAMPAIGN_UNITS.length;
  const next = normalizeMapGuessState({
    ...current,
    appliedSessionIds: appendBounded(current.appliedSessionIds, normalizedSessionId, MAX_SESSION_IDS),
    completedPassageIds: appendBounded(current.completedPassageIds, normalizedPassageId, MAX_PASSAGE_IDS),
    completedUnitIds,
    lastPassageId: normalizedPassageId,
    lastReaction: describeMapGuessUnit(nextUnit.unitId),
    lastSavedAt: at,
    lastSessionId: normalizedSessionId,
    midpointDiscovered: current.midpointDiscovered || discoveredMidpoint,
    midpointDiscoveredAt: discoveredMidpoint ? at : current.midpointDiscoveredAt,
    routeGoalLockedAt: secured ? at : current.routeGoalLockedAt,
    secured,
    securedAt: secured ? at : null,
  });

  const events = [nextUnit.act === "rebuild" ? "rebuild-unit-complete" : "anchor-unit-complete"];
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

export function acknowledgeMapGuessMidpointState(currentState, { acknowledgedAt = null } = {}) {
  const current = normalizeMapGuessState(currentState);
  if (current.midpointAcknowledged || current.secured) {
    return result({ event: "already-acknowledged", events: [], ok: true, state: current });
  }
  if (!current.midpointDiscovered) {
    return result({ event: "not-ready", events: [], ok: false, reason: "not-ready", state: current });
  }
  const at = stringOrNull(acknowledgedAt);
  const next = normalizeMapGuessState({
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

export function setMapGuessRouteGoalState(currentState, routeGoal, { selectedAt = null } = {}) {
  const current = normalizeMapGuessState(currentState);
  const normalizedGoal = normalizeMapGuessRouteGoal(routeGoal);
  if (!normalizedGoal) {
    return result({ events: [], ok: false, reason: "invalid-route-goal", state: current });
  }
  if (!current.midpointAcknowledged) {
    return result({ events: [], ok: false, reason: "goal-selection-not-ready", state: current });
  }
  if (current.routeGoalLocked || current.secured) {
    return result({ events: [], ok: false, reason: "route-goal-locked", state: current });
  }
  if (current.routeGoal === normalizedGoal) {
    return result({ event: "route-goal-unchanged", events: [], ok: true, state: current });
  }
  const at = stringOrNull(selectedAt);
  const next = normalizeMapGuessState({
    ...current,
    lastSavedAt: at ?? current.lastSavedAt,
    routeGoal: normalizedGoal,
    routeGoalSelectedAt: at,
  });
  return result({
    event: current.routeGoal ? "route-goal-changed" : "route-goal-selected",
    events: [current.routeGoal ? "route-goal-changed" : "route-goal-selected"],
    ok: true,
    state: next,
  });
}

export function applyMapGuessReading(storage, details = {}) {
  const current = reconcileMapGuessState(storage, details.currentState);
  const transition = advanceMapGuessState(current, {
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

export function acknowledgeMapGuessMidpoint(storage, details = {}) {
  const current = reconcileMapGuessState(storage, details.currentState);
  const transition = acknowledgeMapGuessMidpointState(current, {
    acknowledgedAt: stringOrNull(details.acknowledgedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    event: transition.event,
    events: transition.events,
  });
}

export function setMapGuessRouteGoal(storage, routeGoal, details = {}) {
  const current = reconcileMapGuessState(storage, details.currentState);
  const transition = setMapGuessRouteGoalState(current, routeGoal, {
    selectedAt: stringOrNull(details.selectedAt) ?? new Date().toISOString(),
  });
  if (!transition.ok) return transition;
  return persistState(storage, transition.state, {
    event: transition.event,
    events: transition.events,
  });
}

export const setMapGuessGoalState = setMapGuessRouteGoalState;
export const setMapGuessGoal = setMapGuessRouteGoal;
