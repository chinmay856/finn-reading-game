import {
  FACEPLACE_COPY,
  FACEPLACE_COPY_IDS,
  FACEPLACE_PROVISIONAL_FEED_FIXTURE,
} from "./faceplace-copy.js";
import {
  FACEPLACE_CAMPAIGN_UNITS,
  FACEPLACE_FALSE_TRACKER_UNITS,
  FACEPLACE_RECOVERY_UNITS,
} from "./faceplace-rules.js";
import {
  FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
  normalizeFacePlaceState,
} from "./faceplace-state.js";

const HONEST_TRACKER_VALUES = Object.freeze([0, 34, 67, 100]);
const FALSE_TRACKER_COPY_IDS = Object.freeze([
  null,
  FACEPLACE_COPY_IDS.tracker12,
  FACEPLACE_COPY_IDS.tracker114,
  FACEPLACE_COPY_IDS.trackerAvocado,
]);
const HONEST_TRACKER_COPY_IDS = Object.freeze([
  FACEPLACE_COPY_IDS.trackerHonestZero,
  FACEPLACE_COPY_IDS.tracker34,
  FACEPLACE_COPY_IDS.tracker67,
  FACEPLACE_COPY_IDS.trackerVerified,
]);

function freezeDeep(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
}

function copy(copyId) {
  return FACEPLACE_COPY[copyId];
}

function timestampRank(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function orderedSourceCards(feedMode) {
  return FACEPLACE_PROVISIONAL_FEED_FIXTURE.feedCards
    .map((card, sourceIndex) => ({ card, sourceIndex }))
    .sort((left, right) => {
      const difference = feedMode === "chronological"
        ? timestampRank(right.card.timestamp) - timestampRank(left.card.timestamp)
        : right.card.reactions - left.card.reactions;
      return difference || left.sourceIndex - right.sourceIndex;
    });
}

function buildDuplicateGroup(collapsed) {
  const fixture = FACEPLACE_PROVISIONAL_FEED_FIXTURE;
  const memberCardIds = [...fixture.duplicateGroup.cardIds];
  return {
    accessibleSummary: collapsed
      ? `${fixture.duplicateGroup.accessibleSummary} The three source cards remain recorded under one collapsed feed cluster.`
      : fixture.duplicateGroup.accessibleSummary,
    collapsed,
    hiddenCardIds: collapsed ? memberCardIds.slice(1) : [],
    id: fixture.duplicateGroup.id,
    memberCardIds,
    provisional: true,
    representativeCardId: memberCardIds[0],
    sourceOriginId: fixture.duplicateGroup.sourceOriginId,
  };
}

function buildFeedCards({
  authorshipRestored,
  contextControlsRestored,
  duplicateGroup,
  feedMode,
  recommendationsExplained,
}) {
  const fixture = FACEPLACE_PROVISIONAL_FEED_FIXTURE;
  const hiddenDuplicateIds = new Set(duplicateGroup.hiddenCardIds);
  const visibleCards = orderedSourceCards(feedMode)
    .filter(({ card }) => !hiddenDuplicateIds.has(card.id));

  return visibleCards.map(({ card, sourceIndex }, visualIndex) => {
    const recommended = card.cardType === "recommended";
    const duplicateRepresentative = duplicateGroup.collapsed
      && card.id === duplicateGroup.representativeCardId;
    const cardTypeLabel = contextControlsRestored
      ? copy(recommended
        ? FACEPLACE_COPY_IDS.cardTypeRecommended
        : FACEPLACE_COPY_IDS.cardTypeChronological)
      : "UNLABELED";
    const reasonAvailable = recommended && contextControlsRestored;
    const reasonVerified = reasonAvailable && recommendationsExplained;
    const reasonText = reasonVerified
      ? card.recommendationReason
      : reasonAvailable
        ? "Recommendation reason restored; verification pending."
        : null;
    const authorLabel = authorshipRestored ? card.authorLabel : "AUTHOR HIDDEN";
    const displayTimestamp = authorshipRestored ? card.displayTimestamp : "TIME HIDDEN";
    const accessibleParts = [
      `Feed item ${visualIndex + 1}.`,
      authorshipRestored
        ? `${card.authorLabel}, ${card.displayTimestamp}.`
        : "Author and timestamp hidden by the corrupted feed.",
      contextControlsRestored
        ? `${cardTypeLabel.toLowerCase()} post.`
        : "Recommendation type unlabeled.",
      card.body,
    ];
    if (duplicateRepresentative) {
      accessibleParts.push(`${duplicateGroup.memberCardIds.length} repeated cards share this provisional generated origin and are collapsed together.`);
    }
    if (reasonText) accessibleParts.push(reasonText);

    return {
      accessibleSummary: accessibleParts.join(" "),
      authorId: authorshipRestored ? card.authorId : null,
      authorLabel,
      authorVisible: authorshipRestored,
      body: card.body,
      cardType: card.cardType,
      cardTypeLabel,
      cardTypeVisible: contextControlsRestored,
      collapsedDuplicateCardIds: duplicateRepresentative
        ? [...duplicateGroup.memberCardIds]
        : [],
      displayTimestamp,
      duplicateGroupId: card.duplicateGroupId,
      duplicateRepresentative,
      id: card.id,
      provisional: true,
      reactions: card.reactions,
      recommendation: {
        applicable: recommended,
        controlAvailable: reasonAvailable,
        reasonText,
        verified: reasonVerified,
      },
      sourceIndex,
      sourceOriginId: card.sourceOriginId,
      timestamp: authorshipRestored ? card.timestamp : null,
      timestampVisible: authorshipRestored,
      visualIndex,
    };
  });
}

function buildTracker({ completedCount, showActOneResult, state }) {
  const actOneCount = Math.min(completedCount, FACEPLACE_FALSE_TRACKER_UNITS.length);
  const recoveryCount = Math.max(0, completedCount - FACEPLACE_FALSE_TRACKER_UNITS.length);
  const showAvocadoResult = Boolean(showActOneResult)
    && completedCount === FACEPLACE_FALSE_TRACKER_UNITS.length
    && state.lastCompletedStateId === "faceplace_false_tracker_3";
  const honest = completedCount >= FACEPLACE_FALSE_TRACKER_UNITS.length && !showAvocadoResult;

  if (!honest) {
    const copyId = FALSE_TRACKER_COPY_IDS[actOneCount];
    return {
      ariaHidden: true,
      ariaValueMax: null,
      ariaValueMin: null,
      ariaValueNow: null,
      ariaValueText: null,
      decorative: true,
      display: copyId ? copy(copyId) : null,
      isProgress: false,
      kind: "nonsense",
      label: "LYING TRACKER",
      live: false,
      role: null,
      transientActOneResult: showAvocadoResult,
      value: null,
    };
  }

  const value = HONEST_TRACKER_VALUES[recoveryCount];
  const savedCheckText = recoveryCount === 0
    ? "Three Act I repairs remain saved."
    : recoveryCount === FACEPLACE_RECOVERY_UNITS.length
      ? "Three Act I repairs remain saved. Feed recovery verified."
      : `Three Act I repairs remain saved; ${recoveryCount} of ${FACEPLACE_RECOVERY_UNITS.length} honest recovery checks saved.`;
  return {
    ariaHidden: false,
    ariaValueMax: 100,
    ariaValueMin: 0,
    ariaValueNow: value,
    ariaValueText: `Honest feed recovery ${value}%. ${savedCheckText}`,
    decorative: false,
    display: copy(HONEST_TRACKER_COPY_IDS[recoveryCount]),
    isProgress: true,
    kind: "honest",
    label: "FEED RECOVERY",
    live: false,
    role: "progressbar",
    transientActOneResult: false,
    value,
  };
}

function buildRelationshipClusters(revealed) {
  if (!revealed) {
    return FACEPLACE_PROVISIONAL_FEED_FIXTURE.relationshipClusters.map((cluster, index) => ({
      accessibleSummary: `Relationship cluster ${index + 1} is hidden until the recovered authorship and context records agree.`,
      id: `${cluster.id}-redacted`,
      label: "CONNECTIONS SCRAMBLED",
      memberIds: [],
      members: [],
      provisional: true,
      revealed: false,
    }));
  }
  const peopleById = new Map(
    FACEPLACE_PROVISIONAL_FEED_FIXTURE.peopleSuggestions.map((person) => [person.id, person]),
  );
  return FACEPLACE_PROVISIONAL_FEED_FIXTURE.relationshipClusters.map((cluster) => ({
    accessibleSummary: cluster.accessibleSummary,
    id: cluster.id,
    label: cluster.label,
    memberIds: [...cluster.memberIds],
    members: cluster.memberIds.map((memberId) => {
      const member = peopleById.get(memberId);
      return member
        ? {
            accessibleSummary: member.accessibleSummary,
            displayName: member.displayName,
            handle: member.handle,
            id: member.id,
            provisional: true,
          }
        : {
            accessibleSummary: "Provisional relationship member awaiting a matching identity record.",
            displayName: "IDENTITY PENDING",
            handle: null,
            id: memberId,
            provisional: true,
          };
    }),
    provisional: true,
    revealed: true,
  }));
}

function buildContextPanel(feedCards, { contextControlsRestored, recommendationsExplained }) {
  const reasons = feedCards
    .filter(({ recommendation }) => recommendation.applicable)
    .map((card) => ({
      available: card.recommendation.controlAvailable,
      cardId: card.id,
      provisional: true,
      reasonText: card.recommendation.reasonText,
      verified: card.recommendation.verified,
    }));
  return {
    accessibleSummary: !contextControlsRestored
      ? "Why this appeared is unavailable while recommendation labels are hidden."
      : recommendationsExplained
        ? "Why this appeared is restored with verified recommendation reasons for visible recommended cards."
        : "Why this appeared is restored, but recommendation reasons still await verification.",
    heading: "WHY THIS APPEARED",
    reasons,
    reasonsVerified: recommendationsExplained,
    selectedCardId: FACEPLACE_PROVISIONAL_FEED_FIXTURE.boostedCardId,
    shellRestored: contextControlsRestored,
  };
}

function buildHonestZero(state, { completedCount, transientActOneResult }) {
  const visible = state.midpointDiscovered
    && completedCount === FACEPLACE_FALSE_TRACKER_UNITS.length
    && !transientActOneResult;
  return {
    acknowledged: state.midpointAcknowledged,
    actionRequired: visible && !state.midpointAcknowledged,
    amyLine: copy(FACEPLACE_COPY_IDS.midpointAmy),
    body: copy(FACEPLACE_COPY_IDS.midpointBody),
    chinmayLine: copy(FACEPLACE_COPY_IDS.midpointChinmay),
    discovered: state.midpointDiscovered,
    preservedUnitIds: FACEPLACE_FALSE_TRACKER_UNITS.map(({ unitId }) => unitId),
    recoveredPostsSaved: state.midpointDiscovered,
    nextUnitCount: FACEPLACE_CAMPAIGN_UNITS.length - FACEPLACE_FALSE_TRACKER_UNITS.length,
    repairedUnitCount: FACEPLACE_FALSE_TRACKER_UNITS.length,
    title: copy(FACEPLACE_COPY_IDS.midpointTitle),
    visible,
  };
}

function buildSecuredRecords(state) {
  if (!state.secured) {
    return { blockedWrite: null, evidence: null, securedPayoff: null };
  }
  const fixture = FACEPLACE_PROVISIONAL_FEED_FIXTURE;
  const blockedWrite = {
    ...FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD,
    fixtureAttempt: { ...fixture.finalBoostAttempt },
    process: { ...fixture.process },
  };
  const evidence = {
    ...FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
    fixtureDraft: { ...fixture.evidence },
  };
  return {
    blockedWrite,
    evidence,
    securedPayoff: {
      amy: copy(FACEPLACE_COPY_IDS.completionAmy),
      bodyLines: copy(FACEPLACE_COPY_IDS.secureBody).split("\n").filter(Boolean),
      canonical: true,
      chinmay: copy(FACEPLACE_COPY_IDS.completionChinmay),
      denial: copy(FACEPLACE_COPY_IDS.secureDenial),
      endOfSite: true,
      evidenceTitle: copy(FACEPLACE_COPY_IDS.evidenceTitle),
      provisional: false,
      status: copy(FACEPLACE_COPY_IDS.secureStatus),
      testOnly: false,
      title: copy(FACEPLACE_COPY_IDS.completionTitle),
    },
  };
}

export function getFacePlaceCampaignView(currentState, {
  reducedMotion = false,
  showActOneResult = false,
} = {}) {
  const state = normalizeFacePlaceState(currentState);
  const completed = new Set(state.completedUnitIds);
  const completedCount = state.completedUnitIds.length;
  const duplicatesCollapsed = completed.has("duplicates_collapsed");
  const authorshipRestored = completed.has("authorship_time_restored");
  const contextControlsRestored = completed.has("context_controls_restored");
  const chronologyVerified = completed.has("chronology_verified");
  const recommendationsExplained = completed.has("recommendations_explained");
  const distributionGateRestored = completed.has("distribution_gate_restored");
  const duplicateGroup = buildDuplicateGroup(duplicatesCollapsed);
  const tracker = buildTracker({ completedCount, showActOneResult, state });
  const feedCards = buildFeedCards({
    authorshipRestored,
    contextControlsRestored,
    duplicateGroup,
    feedMode: state.feedMode,
    recommendationsExplained,
  });
  const midpoint = buildHonestZero(state, {
    completedCount,
    transientActOneResult: tracker.transientActOneResult,
  });
  const securedRecords = buildSecuredRecords(state);
  const recoveryCount = Math.max(0, completedCount - FACEPLACE_FALSE_TRACKER_UNITS.length);
  const lastCompletedUnit = completedCount ? FACEPLACE_CAMPAIGN_UNITS[completedCount - 1] : null;
  const ruleRepaired = state.midpointDiscovered;

  return freezeDeep({
    ariaDescription: state.secured
      ? "FacePlace feed recovery verified. Chronology and recommendation context remain visible; forced distribution is off. Evidence is provisional and test-only."
      : state.midpointDiscovered
        ? "FacePlace Honest Zero. Three earlier feed repairs remain saved while honest recovery advances."
        : "Corrupted FacePlace ranked feed. Duplicate posts, hidden identities, and unlabeled recommendations are being repaired.",
    blockedWrite: securedRecords.blockedWrite,
    chronologyControl: {
      available: chronologyVerified,
      options: ["chronological", "ranked"],
      selected: state.feedMode,
    },
    contextPanel: buildContextPanel(feedCards, {
      contextControlsRestored,
      recommendationsExplained,
    }),
    duplicateGroups: [duplicateGroup],
    evidence: securedRecords.evidence,
    feedCards,
    feedMode: state.feedMode,
    fixture: {
      canonical: false,
      fixtureId: FACEPLACE_PROVISIONAL_FEED_FIXTURE.fixtureId,
      notice: FACEPLACE_PROVISIONAL_FEED_FIXTURE.notice,
      provisional: true,
      status: FACEPLACE_PROVISIONAL_FEED_FIXTURE.status,
    },
    headerStatus: state.secured
      ? copy(FACEPLACE_COPY_IDS.secureStatus)
      : tracker.isProgress
        ? `${tracker.label}: ${tracker.display}`
        : "LYING TRACKER",
    lastRepairAnnouncement: lastCompletedUnit?.reaction
      ?? "FacePlace structural test ready. No repair result saved.",
    midpoint,
    motion: {
      cardCollapseMs: reducedMotion ? 0 : 500,
      cardReorderMs: reducedMotion ? 0 : 650,
      mode: reducedMotion ? "state-swap" : "stepped-feed-repair",
      trackerSwapMs: reducedMotion ? 0 : 400,
      usesTechnoStill: reducedMotion,
    },
    peopleYouMaySortOfKnow: FACEPLACE_PROVISIONAL_FEED_FIXTURE.peopleSuggestions.map((person) => ({
      ...person,
    })),
    process: { ...FACEPLACE_PROVISIONAL_FEED_FIXTURE.process },
    profile: { ...FACEPLACE_PROVISIONAL_FEED_FIXTURE.profile },
    progress: {
      actOneCompletedCount: Math.min(completedCount, FACEPLACE_FALSE_TRACKER_UNITS.length),
      completedUnitCount: completedCount,
      completedUnitIds: [...state.completedUnitIds],
      display: `${completedCount} / ${FACEPLACE_CAMPAIGN_UNITS.length} REPAIRS`,
      honestRecoveryCompletedCount: recoveryCount,
      preservedActOneUnitIds: state.midpointDiscovered
        ? FACEPLACE_FALSE_TRACKER_UNITS.map(({ unitId }) => unitId)
        : [],
      totalUnitCount: FACEPLACE_CAMPAIGN_UNITS.length,
    },
    relationshipClusters: buildRelationshipClusters(
      state.midpointDiscovered && !tracker.transientActOneResult,
    ),
    ruleBody: copy(ruleRepaired ? FACEPLACE_COPY_IDS.repairBody : FACEPLACE_COPY_IDS.corruptBody),
    ruleLabel: copy(ruleRepaired ? FACEPLACE_COPY_IDS.ruleRepaired : FACEPLACE_COPY_IDS.ruleCorrupted),
    secured: state.secured,
    securedPayoff: securedRecords.securedPayoff,
    siteId: "faceplace",
    sourceCardIds: FACEPLACE_PROVISIONAL_FEED_FIXTURE.feedCards.map(({ id }) => id),
    stateId: state.stateId,
    tracker,
    truth: {
      authorshipRestored,
      chronologyVerified,
      contextControlsRestored,
      distributionGateRestored,
      duplicatesCollapsed,
      recommendationsExplained,
    },
  });
}

export const createFacePlaceViewModel = getFacePlaceCampaignView;
