function nonEmptyString(value) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isSecuredState(state) {
  return Boolean(state?.secured) || state?.phase === "secured";
}

function canBeCanonical(record) {
  return Boolean(record)
    && record.canonical !== false
    && record.provisional !== true
    && record.testOnly !== true;
}

function freezeSummary(summary) {
  return Object.freeze({ ...summary });
}

export function summarizeHubSiteEvidence({
  canonicalBlockedWriteId = null,
  canonicalEvidenceId = null,
  diagnosticEvidenceRecord = null,
  diagnosticState = null,
  evidenceRecord = null,
  persisted = false,
  requiresLockedRouteGoal = false,
  siteId,
  state = null,
} = {}) {
  const normalizedSiteId = nonEmptyString(siteId);
  if (!normalizedSiteId) throw new TypeError("A hub evidence summary requires a siteId.");

  const realSecured = isSecuredState(state);
  const testSecured = isSecuredState(diagnosticState);
  const realEvidenceId = nonEmptyString(state?.evidenceId);
  const testEvidenceId = nonEmptyString(diagnosticState?.evidenceId);
  const expectedCanonicalId = nonEmptyString(canonicalEvidenceId);
  const expectedBlockedWriteId = nonEmptyString(canonicalBlockedWriteId);
  const blockedWriteMatches = !expectedBlockedWriteId
    || nonEmptyString(state?.blockedWriteId) === expectedBlockedWriteId;
  const routeGoalMatches = !requiresLockedRouteGoal
    || (Boolean(state?.routeGoalLocked) && Boolean(nonEmptyString(state?.routeGoal)));
  const canonicalMatch = Boolean(
    realSecured
    && persisted
    && expectedCanonicalId
    && realEvidenceId === expectedCanonicalId
    && blockedWriteMatches
    && routeGoalMatches
    && canBeCanonical(evidenceRecord),
  );
  const tabOnly = realSecured && !persisted;
  const persistedNonCanonical = realSecured && persisted && !canonicalMatch;
  const displaySecured = testSecured || realSecured;
  const displayEvidenceRecord = testSecured
    ? diagnosticEvidenceRecord ?? evidenceRecord
    : evidenceRecord;
  const displayEvidenceId = testSecured
    ? testEvidenceId ?? nonEmptyString(displayEvidenceRecord?.id)
    : realEvidenceId ?? nonEmptyString(displayEvidenceRecord?.id);
  const displayEvidenceProvisional = Boolean(
    displayEvidenceRecord?.provisional
    || displayEvidenceRecord?.testOnly
    || displayEvidenceRecord?.canonical === false,
  );
  const displayMode = testSecured
    ? "test"
    : canonicalMatch
      ? "persisted-canonical"
      : tabOnly
        ? "tab-only"
        : persistedNonCanonical
          ? "persisted-noncanonical"
          : "unsecured";

  return freezeSummary({
    canonicalBlockedWriteId: expectedBlockedWriteId,
    canonicalEvidenceId: expectedCanonicalId,
    displayEvidenceId: displaySecured ? displayEvidenceId : null,
    displayEvidenceProvisional: displaySecured && displayEvidenceProvisional,
    displayEvidenceRecord: displaySecured ? displayEvidenceRecord : null,
    displayMode,
    displaySecured,
    persistedCanonical: canonicalMatch,
    persistedNonCanonical,
    realEvidenceId,
    realSecured,
    routeGoalMatches,
    blockedWriteMatches,
    siteId: normalizedSiteId,
    tabOnly,
    testEvidenceId,
    testSecured,
  });
}

function normalizeArguments(entriesOrOptions, options) {
  if (Array.isArray(entriesOrOptions)) {
    return {
      entries: entriesOrOptions,
      requiredCanonicalSiteIds: options?.requiredCanonicalSiteIds ?? [],
    };
  }
  return {
    entries: entriesOrOptions?.sites ?? [],
    requiredCanonicalSiteIds: entriesOrOptions?.requiredCanonicalSiteIds ?? [],
  };
}

export function summarizeHubEvidenceState(entriesOrOptions = [], options = {}) {
  const { entries, requiredCanonicalSiteIds } = normalizeArguments(entriesOrOptions, options);
  const byId = new Map();
  for (const entry of entries) {
    const summary = summarizeHubSiteEvidence(entry);
    byId.set(summary.siteId, summary);
  }
  const sites = Object.freeze([...byId.values()]);
  const persistedCanonicalSiteIds = Object.freeze(
    sites.filter(({ persistedCanonical }) => persistedCanonical).map(({ siteId }) => siteId),
  );
  const required = Object.freeze([
    ...new Set(requiredCanonicalSiteIds.filter((siteId) => nonEmptyString(siteId))),
  ]);
  const persistedCanonicalSet = new Set(persistedCanonicalSiteIds);
  const canonicalComplete = required.length > 0
    && required.every((siteId) => persistedCanonicalSet.has(siteId));

  return Object.freeze({
    bySiteId: Object.freeze(Object.fromEntries(sites.map((summary) => [summary.siteId, summary]))),
    canonicalComplete,
    displaySecuredCount: sites.filter(({ displaySecured }) => displaySecured).length,
    hasTabOnlyState: sites.some(({ tabOnly }) => tabOnly),
    hasTestState: sites.some(({ testSecured }) => testSecured),
    persistedCanonicalCount: persistedCanonicalSiteIds.length,
    persistedCanonicalSiteIds,
    persistedNonCanonicalCount: sites.filter(({ persistedNonCanonical }) => persistedNonCanonical).length,
    requiredCanonicalSiteIds: required,
    sites,
    tabOnlySecuredCount: sites.filter(({ tabOnly }) => tabOnly).length,
    testSecuredCount: sites.filter(({ testSecured }) => testSecured).length,
  });
}
