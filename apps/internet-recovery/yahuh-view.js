import {
  YAHUH_COPY_IDS,
  YAHUH_PROVISIONAL_PORTAL_FIXTURE,
  getYahuhCopy,
} from "./yahuh-copy.js";
import { YAHUH_RECONNECT_UNITS, YAHUH_SORT_UNITS } from "./yahuh-rules.js";
import {
  YAHUH_PROVISIONAL_BLOCKED_WRITE_RECORD,
  YAHUH_PROVISIONAL_EVIDENCE_RECORD,
  normalizeYahuhState,
} from "./yahuh-state.js";

const freezeDeep = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
};

const assignmentFor = (moduleId, suffix) => YAHUH_PROVISIONAL_PORTAL_FIXTURE.unitAssignments
  .find(({ moduleIds, unitId }) => unitId.endsWith(suffix) && moduleIds.includes(moduleId));

function displayDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(iso));
}

function buildModuleView(module, completedUnitIds, midpointDiscovered) {
  const sortUnitId = assignmentFor(module.id, "_sorted")?.unitId ?? null;
  const reconnectUnitId = assignmentFor(module.id, "_channels")?.unitId ?? null;
  const sorted = Boolean(sortUnitId && completedUnitIds.has(sortUnitId));
  const reconnected = Boolean(reconnectUnitId && completedUnitIds.has(reconnectUnitId));
  const merged = midpointDiscovered && !reconnected;
  const state = reconnected ? "reconnected" : merged ? "single-stream" : sorted ? "sorted" : "pasted";
  const mergedOrigin = YAHUH_PROVISIONAL_PORTAL_FIXTURE.mergedOrigin;

  const category = reconnected || (sorted && !midpointDiscovered)
    ? { id: module.category.id, label: module.category.name, visible: true }
    : merged
      ? { id: mergedOrigin.id, label: "GENERATED STREAM", visible: true }
      : { id: null, label: "EVERYTHING PASTE", visible: false };
  const source = reconnected || (sorted && !midpointDiscovered)
    ? { id: module.source.id, label: module.source.label, visible: true }
    : merged
      ? { id: mergedOrigin.id, label: mergedOrigin.label, visible: true }
      : { id: null, label: "SOURCE HIDDEN", visible: false };
  const date = reconnected || (sorted && !midpointDiscovered)
    ? { display: displayDate(module.publishedAt), iso: module.publishedAt, visible: true }
    : merged
      ? { display: mergedOrigin.timestampDisplay, iso: mergedOrigin.timestamp, visible: true }
      : { display: "DATE HIDDEN", iso: null, visible: false };
  const sponsorship = reconnected || (sorted && !midpointDiscovered)
    ? { label: module.sponsorshipLabel, sponsored: module.sponsored, visible: true }
    : merged
      ? { label: "UNLABELED IN SINGLE STREAM", sponsored: null, visible: false }
      : { label: "SPONSORSHIP HIDDEN", sponsored: null, visible: false };
  const channel = reconnected
    ? { id: module.channel.id, label: module.channel.name, routeSummary: module.accessibleRouteSummary }
    : merged
      ? { id: mergedOrigin.id, label: mergedOrigin.label, routeSummary: mergedOrigin.accessibleSummary }
      : sorted
        ? { id: null, label: "CHANNEL CONNECTION PENDING", routeSummary: "Labels are saved; the source channel is not reconnected yet." }
        : { id: null, label: "FRONT PAGE PASTE", routeSummary: "This module has no inspectable category or source route yet." };

  return {
    accessibleSummary: `${module.category.name} module is ${state}. Category ${category.label}; source ${source.label}; channel ${channel.label}.`,
    category,
    channel,
    date,
    headline: sorted || midpointDiscovered ? module.title : module.corruptHeadline,
    id: module.id,
    originalCategoryLabel: module.category.name,
    reconnected,
    reconnectUnitId,
    sortUnitId,
    sorted,
    source,
    sponsorship,
    state,
    summary: sorted || midpointDiscovered
      ? module.summary
      : "Category, source, date, and sponsorship have been pasted into one unlabeled front-page item.",
  };
}

export function getYahuhCampaignView(campaignState, { reducedMotion = false } = {}) {
  const state = normalizeYahuhState(campaignState);
  const completedUnitIds = new Set(state.completedUnitIds);
  const modules = YAHUH_PROVISIONAL_PORTAL_FIXTURE.modules.map((module) => (
    buildModuleView(module, completedUnitIds, state.midpointDiscovered)
  ));
  const savedLabelSnapshot = YAHUH_PROVISIONAL_PORTAL_FIXTURE.modules
    .filter((module) => completedUnitIds.has(assignmentFor(module.id, "_sorted")?.unitId))
    .map((module) => ({
      categoryId: module.category.id,
      categoryLabel: module.category.name,
      channelId: module.channel.id,
      channelLabel: module.channel.name,
      channelRouteSummary: module.accessibleRouteSummary,
      date: module.publishedAt,
      moduleId: module.id,
      sourceId: module.source.id,
      sourceLabel: module.source.label,
      sponsorshipLabel: module.sponsorshipLabel,
    }));
  const circuits = YAHUH_SORT_UNITS.map((sortUnit, index) => ({
    circuitId: `yahuh-circuit-${index + 1}`,
    moduleIds: sortUnit.moduleIds,
    reconnected: completedUnitIds.has(YAHUH_RECONNECT_UNITS[index].unitId),
    reconnectUnitId: YAHUH_RECONNECT_UNITS[index].unitId,
    sortSaved: completedUnitIds.has(sortUnit.unitId),
    sortUnitId: sortUnit.unitId,
  }));
  const switchboardRoutes = modules.map((module) => ({
    accessibleSummary: module.channel.routeSummary,
    categoryLabel: module.category.label,
    channelId: module.channel.id,
    channelLabel: module.channel.label,
    moduleId: module.id,
    moduleLabel: module.originalCategoryLabel,
    sourceId: module.source.id,
    sourceLabel: module.source.label,
    state: module.state,
  }));
  const sourceLog = modules.map((module) => ({
    categoryLabel: module.category.label,
    channelLabel: module.channel.label,
    dateLabel: module.date.display,
    moduleId: module.id,
    sourceLabel: module.source.label,
    sponsorshipLabel: module.sponsorship.label,
    state: module.state,
  }));
  const sortCompletedCount = state.completedUnitIds.filter((id) => id.endsWith("_sorted")).length;
  const reconnectCompletedCount = state.completedUnitIds.filter((id) => id.endsWith("_channels")).length;
  const headerStatus = state.secured
    ? getYahuhCopy(YAHUH_COPY_IDS.secureStatus)
    : state.midpointDiscovered
      ? "SINGLE SOURCE: DETECTED"
      : getYahuhCopy(YAHUH_COPY_IDS.corruptStatus);
  const blockedProcess = YAHUH_PROVISIONAL_PORTAL_FIXTURE.processes
    .find(({ id }) => id === YAHUH_PROVISIONAL_BLOCKED_WRITE_RECORD.actorId) ?? null;

  return freezeDeep({
    act: state.act,
    activeModules: modules,
    ariaDescription: `Yahuh Portal structural campaign. ${state.completedUnitIds.length} of 6 authored units saved. ${headerStatus}. Microphone off; no reading score.`,
    circuits,
    fixture: {
      fixtureId: YAHUH_PROVISIONAL_PORTAL_FIXTURE.fixtureId,
      notice: YAHUH_PROVISIONAL_PORTAL_FIXTURE.notice,
      status: YAHUH_PROVISIONAL_PORTAL_FIXTURE.status,
    },
    headerStatus,
    midpoint: {
      acknowledged: state.midpointAcknowledged,
      actionLabel: "Keep the saved labels and reconnect source channels",
      actionRequired: state.midpointDiscovered && !state.midpointAcknowledged,
      amy: getYahuhCopy(YAHUH_COPY_IDS.midpointAmy),
      body: getYahuhCopy(YAHUH_COPY_IDS.midpointBody),
      chinmay: getYahuhCopy(YAHUH_COPY_IDS.midpointChinmay),
      discovered: state.midpointDiscovered,
      mergedOrigin: state.midpointDiscovered ? { ...YAHUH_PROVISIONAL_PORTAL_FIXTURE.mergedOrigin } : null,
      proof: state.midpointDiscovered
        ? [
            getYahuhCopy(YAHUH_COPY_IDS.midpointProofModules),
            getYahuhCopy(YAHUH_COPY_IDS.midpointProofChannels),
            getYahuhCopy(YAHUH_COPY_IDS.midpointProofRewrite),
          ]
        : [],
      savedComparisonAvailable: state.midpointDiscovered,
      title: getYahuhCopy(YAHUH_COPY_IDS.midpointTitle),
    },
    motion: {
      mode: reducedMotion ? "discrete" : "switchboard-route",
      reduced: Boolean(reducedMotion),
    },
    progress: {
      completedUnitCount: state.completedUnitIds.length,
      reconnectCompletedCount,
      requiredReadingCount: 6,
      sortCompletedCount,
    },
    readingGate: {
      microphone: "off",
      plannedCount: 10,
      requiredFirstRun: 6,
      scoreCreated: false,
      selectableCount: 0,
      structuredCandidateCount: 1,
    },
    ruleBody: state.midpointDiscovered
      ? getYahuhCopy(YAHUH_COPY_IDS.repairBody)
      : getYahuhCopy(YAHUH_COPY_IDS.corruptBody),
    ruleLabel: state.midpointDiscovered
      ? getYahuhCopy(YAHUH_COPY_IDS.repairHeadline)
      : getYahuhCopy(YAHUH_COPY_IDS.corruptHeadline),
    savedLabelSnapshot,
    secured: state.secured,
    securedPayoff: state.secured
      ? {
          blockedWrite: {
            ...YAHUH_PROVISIONAL_BLOCKED_WRITE_RECORD,
            process: blockedProcess ? { ...blockedProcess } : null,
          },
          body: getYahuhCopy(YAHUH_COPY_IDS.secureBody),
          evidence: { ...YAHUH_PROVISIONAL_EVIDENCE_RECORD },
          status: getYahuhCopy(YAHUH_COPY_IDS.secureStatus),
          technoAlt: getYahuhCopy(YAHUH_COPY_IDS.technoAlt),
          technoLabel: getYahuhCopy(YAHUH_COPY_IDS.technoLabel),
        }
      : null,
    sourceLog,
    stateId: state.stateId,
    switchboardRoutes,
  });
}
