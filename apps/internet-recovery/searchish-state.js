import { SEARCHISH_CAMPAIGN_UNITS, SEARCHISH_RESTORE_UNITS, getNextSearchishUnit, normalizeSearchishCompletedUnitIds } from "./searchish-rules.js";

export const SEARCHISH_STATE_VERSION = 1;
export const SEARCHISH_STATE_KEY = "internet-recovery-98.searchish.campaign.v1";
export const SEARCHISH_EVIDENCE_ID = "searchish.evidence.generated-cache-redirect-01";
export const SEARCHISH_BLOCKED_WRITE_ID = "searchish-blocked-placement-01";

export const SEARCHISH_EVIDENCE_RECORD = Object.freeze({
  aiBehavior: "The answer generator created several result cards from one generated cache and hid their shared origin.",
  assetId: null,
  canonical: true,
  eligibleForCanonicalCount: true,
  filename: "SEARCHISH_GENERATED_CACHE_REDIRECT.REC",
  id: SEARCHISH_EVIDENCE_ID,
  label: "GENERATED CACHE REDIRECT",
  principle: "Search finds sources. You evaluate them.",
  provisional: false,
  registryStatus: "canonical-secured-only",
  routeFragment: Object.freeze({
    accessibleSummary: "Search-ish's answer generator routes to the upstream AI repair service.",
    from: "searchish-process-answer-autofix-01",
    fromLabel: "ANSWER AUTO-FIX AI",
    id: "searchish.route.generated-cache-07",
    relationshipLabel: "local generated-answer job routed to parent service",
    to: "ai_repair_service",
    toLabel: "AI REPAIR SERVICE",
  }),
  siteId: "searchish",
  slot: 7,
  summary: "Four apparent results redirected to one generated cache; the generated answer falsely treated the repetition as confirmation.",
  testOnly: false,
  title: "SEARCH-ISH / GENERATED CACHE REDIRECT",
  upstreamServiceId: "ai_repair_service",
  whatChanged: "Results now expose domains, dates, authors, sponsorship, query matches, and independent origins.",
  writerFingerprint: "si-cacheanswer-52c8",
});

export const SEARCHISH_BLOCKED_WRITE_RECORD = Object.freeze({
  actorId: "searchish-process-answer-autofix-01",
  body: "ANSWER AUTO-FIX AI attempted to restore the generated answer to top placement.",
  canonical: true,
  eligibleForCanonicalCount: true,
  id: SEARCHISH_BLOCKED_WRITE_ID,
  label: "TOP PLACEMENT DENIED — SOURCE ORIGIN REQUIRED",
  siteId: "searchish",
  slot: 7,
  targetId: "searchish-placement-top-result-01",
  testOnly: false,
});

const strings = (value, max) => Object.freeze(Array.isArray(value) ? [...new Set(value.filter((item) => typeof item === "string" && item))].slice(-max) : []);
const text = (value) => typeof value === "string" && value ? value : null;
const freeze = (value) => Object.freeze({ ...value, appliedSessionIds: strings(value.appliedSessionIds, 32), completedPassageIds: strings(value.completedPassageIds, 24), completedUnitIds: Object.freeze([...value.completedUnitIds]) });

export function normalizeSearchishState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const completedUnitIds = normalizeSearchishCompletedUnitIds(value.completedUnitIds);
  const count = completedUnitIds.length;
  const midpointDiscovered = count >= SEARCHISH_RESTORE_UNITS.length;
  const secured = count === SEARCHISH_CAMPAIGN_UNITS.length;
  const midpointAcknowledged = midpointDiscovered && (secured || count > SEARCHISH_RESTORE_UNITS.length || Boolean(value.midpointAcknowledged));
  return freeze({
    act: secured ? "secured" : !midpointDiscovered ? "restore" : midpointAcknowledged ? "branch" : "midpoint",
    appliedSessionIds: strings(value.appliedSessionIds, 32),
    blockedWriteAt: secured ? text(value.blockedWriteAt) ?? text(value.securedAt) ?? text(value.lastSavedAt) : null,
    blockedWriteId: secured ? SEARCHISH_BLOCKED_WRITE_ID : null,
    completedPassageIds: strings(value.completedPassageIds, 24),
    completedUnitIds,
    evidenceId: secured ? SEARCHISH_EVIDENCE_ID : null,
    lastPassageId: text(value.lastPassageId),
    lastSavedAt: text(value.lastSavedAt),
    lastSessionId: text(value.lastSessionId),
    midpointAcknowledged,
    midpointAcknowledgedAt: midpointAcknowledged ? text(value.midpointAcknowledgedAt) : null,
    midpointDiscovered,
    midpointDiscoveredAt: midpointDiscovered ? text(value.midpointDiscoveredAt) ?? text(value.lastSavedAt) : null,
    secured,
    securedAt: secured ? text(value.securedAt) ?? text(value.lastSavedAt) : null,
    siteId: "searchish",
    stateId: secured ? "searchish_secured" : midpointDiscovered && !midpointAcknowledged ? "searchish_five_costumes" : SEARCHISH_CAMPAIGN_UNITS[count - 1]?.stateId ?? "searchish_corrupted",
    version: SEARCHISH_STATE_VERSION,
  });
}

const empty = normalizeSearchishState();
function readRaw(storage) { try { const raw = storage?.getItem(SEARCHISH_STATE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
function persist(storage, state, details = {}) { try { if (!storage) return Object.freeze({ ...details, ok: false, reason: "unavailable", state }); storage.setItem(SEARCHISH_STATE_KEY, JSON.stringify(state)); return Object.freeze({ ...details, ok: true, state }); } catch { return Object.freeze({ ...details, ok: false, reason: "write-failed", state }); } }
export function readSearchishState(storage) { const value = readRaw(storage); return value?.version === SEARCHISH_STATE_VERSION ? normalizeSearchishState(value) : empty; }

export function advanceSearchishState(currentState, { completedAt = null, outcome, passageId, sessionId } = {}) {
  const current = normalizeSearchishState(currentState);
  if (sessionId && current.appliedSessionIds.includes(sessionId)) return Object.freeze({ duplicate: true, events: [], ok: true, state: current });
  if (current.secured) return Object.freeze({ events: ["already-secured"], ok: true, state: current });
  if (!passageId) return Object.freeze({ events: [], ok: false, reason: "missing-passage-id", state: current });
  if (current.completedPassageIds.includes(passageId)) return Object.freeze({ duplicatePassage: true, events: [], ok: true, state: current });
  const unit = getNextSearchishUnit(current);
  if (!unit) return Object.freeze({ events: [], ok: false, reason: current.midpointDiscovered && !current.midpointAcknowledged ? "midpoint-acknowledgement-required" : "no-unit-available", state: current });
  const expectedKind = unit.unitId.endsWith("branch") || unit.unitId === "placement_origin_gate" ? "branch-unit" : "restore-unit";
  if (!outcome?.accepted || outcome.kind !== expectedKind) return Object.freeze({ events: [], ok: false, reason: "invalid-outcome", state: current });
  const completedUnitIds = [...current.completedUnitIds, unit.unitId];
  const discovered = completedUnitIds.length === SEARCHISH_RESTORE_UNITS.length;
  const secured = completedUnitIds.length === SEARCHISH_CAMPAIGN_UNITS.length;
  const next = normalizeSearchishState({
    ...current,
    appliedSessionIds: [...current.appliedSessionIds, sessionId].filter(Boolean),
    blockedWriteAt: secured ? completedAt : null,
    completedPassageIds: [...current.completedPassageIds, passageId],
    completedUnitIds,
    lastPassageId: passageId,
    lastSavedAt: completedAt,
    lastSessionId: sessionId,
    midpointDiscoveredAt: discovered ? completedAt : current.midpointDiscoveredAt,
    securedAt: secured ? completedAt : null,
  });
  const events = [unit.unitId.endsWith("origin") ? "result-origin-restored" : "source-branch-opened"];
  if (discovered) events.push("midpoint-discovered");
  if (secured) events.push("site-secured", "canonical-evidence-recorded", "canonical-blocked-write-recorded");
  return Object.freeze({ events: Object.freeze(events), ok: true, state: next });
}

export function acknowledgeSearchishMidpointState(currentState, { acknowledgedAt = null } = {}) {
  const current = normalizeSearchishState(currentState);
  if (!current.midpointDiscovered) return Object.freeze({ events: [], ok: false, reason: "not-ready", state: current });
  if (current.midpointAcknowledged) return Object.freeze({ events: [], ok: true, state: current });
  return Object.freeze({ events: Object.freeze(["midpoint-acknowledged"]), ok: true, state: normalizeSearchishState({ ...current, midpointAcknowledged: true, midpointAcknowledgedAt: acknowledgedAt, lastSavedAt: acknowledgedAt ?? current.lastSavedAt }) });
}

export function applySearchishReading(storage, details = {}) {
  const current = readSearchishState(storage);
  const provided = normalizeSearchishState(details.currentState);
  const base = current.completedUnitIds.length >= provided.completedUnitIds.length ? current : provided;
  const transition = advanceSearchishState(base, { ...details, completedAt: details.completedAt ?? new Date().toISOString() });
  return transition.ok ? persist(storage, transition.state, transition) : transition;
}

export function acknowledgeSearchishMidpoint(storage, details = {}) {
  const current = readSearchishState(storage).completedUnitIds.length >= normalizeSearchishState(details.currentState).completedUnitIds.length ? readSearchishState(storage) : normalizeSearchishState(details.currentState);
  const transition = acknowledgeSearchishMidpointState(current, { acknowledgedAt: details.acknowledgedAt ?? new Date().toISOString() });
  return transition.ok ? persist(storage, transition.state, transition) : transition;
}
