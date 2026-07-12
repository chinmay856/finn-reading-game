const freezeDeep = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
};

export const THREADIT_COPY_IDS = Object.freeze({
  activeSort: "threadit.status.activeSort",
  blockedBody: "threadit.blocked.body",
  blockedTitle: "threadit.blocked.title",
  corruptBody: "site.threadit.corrupt.body",
  corruptHeadline: "site.threadit.corrupt.headline",
  corruptModule1: "site.threadit.corrupt.module.1",
  corruptModule2: "site.threadit.corrupt.module.2",
  corruptModule3: "site.threadit.corrupt.module.3",
  corruptModule4: "site.threadit.corrupt.module.4",
  corruptStatus: "site.threadit.corruptStatus",
  evidenceBody: "site.threadit.secure.evidenceBody",
  evidenceTitle: "site.threadit.secure.evidenceTitle",
  midpointAmy: "site.threadit.midpoint.amy",
  midpointBody: "site.threadit.midpoint.body",
  midpointChinmay: "site.threadit.midpoint.chinmay",
  midpointTitle: "site.threadit.midpoint.title",
  name: "site.threadit.name",
  relationshipCites: "threadit.relationship.cites",
  relationshipCopiedFrom: "threadit.relationship.copiedFrom",
  relationshipDuplicatePaused: "threadit.relationship.duplicatePaused",
  relationshipIndependent: "threadit.relationship.independentlySourced",
  relationshipOriginalQuestion: "threadit.relationship.originalQuestion",
  relationshipRepliesTo: "threadit.relationship.repliesTo",
  repairBody: "site.threadit.repair.body",
  repairHeadline: "site.threadit.repair.headline",
  repairLabel1: "site.threadit.repair.label.1",
  repairLabel2: "site.threadit.repair.label.2",
  repairLabel3: "site.threadit.repair.label.3",
  repairLabel4: "site.threadit.repair.label.4",
  resultSaved: "threadit.result.saved",
  ruleCorrupted: "threadit.rule.corrupted",
  ruleRepaired: "threadit.rule.repaired",
  secureBody: "site.threadit.secure.body",
  secureDenial: "site.threadit.secure.denial",
  secureStatus: "site.threadit.secureStatus",
  secureTitle: "site.threadit.secure.title",
  statusCorrupted: "threadit.status.corrupted",
  statusDuplicateClaim: "threadit.status.duplicateClaim",
  statusOriginFound: "threadit.status.originFound",
  statusReplyOrderRestored: "threadit.status.replyOrderRestored",
  statusSecured: "threadit.status.secured",
  statusTracing: "threadit.status.tracing",
  statusUnlinked: "threadit.status.unlinked",
  tagline: "site.threadit.tagline",
  technoAlt: "site.threadit.secure.technoAlt",
  traceOrigin: "threadit.trace.origin",
  traceTruth: "threadit.trace.truth",
});

export const THREADIT_COPY = Object.freeze({
  [THREADIT_COPY_IDS.activeSort]: "ACTIVE SORT: CONFIDENCE DESCENDING",
  [THREADIT_COPY_IDS.blockedBody]: "This claim already exists from the same generated origin.",
  [THREADIT_COPY_IDS.blockedTitle]: "POSTING PAUSED: DUPLICATE SOURCE",
  [THREADIT_COPY_IDS.corruptBody]: "The highest number is the truest answer. Replies may appear before questions if they are popular enough.",
  [THREADIT_COPY_IDS.corruptHeadline]: "MOST VOTES WINS REALITY",
  [THREADIT_COPY_IDS.corruptModule1]: "TOP ANSWER: I agree with the summary I have not read.",
  [THREADIT_COPY_IDS.corruptModule2]: "SOURCE: The number next to my name",
  [THREADIT_COPY_IDS.corruptModule3]: "QUESTION: [moved below because it was less viral]",
  [THREADIT_COPY_IDS.corruptModule4]: "MOD NOTE: Chronology has been deprecated for engagement.",
  [THREADIT_COPY_IDS.corruptStatus]: "THREAD ORDER: EMOTIONAL",
  [THREADIT_COPY_IDS.evidenceBody]: "What changed:\nVotes can rank attention, but independent source lineage decides trust.\n\nAI service behavior:\nThe consensus helper copied one summary into many branches and counted the copies as agreement.",
  [THREADIT_COPY_IDS.evidenceTitle]: "THREADIT / SYNTHETIC CONSENSUS OVERFLOW",
  [THREADIT_COPY_IDS.midpointAmy]: "Those are not ten sources. They are one post wearing ten hats.",
  [THREADIT_COPY_IDS.midpointBody]: "CONSENSUS AUTO-FIX AI has summarized the thread.\n\nProblem: the summary is now being copied into every branch as proof that the summary was correct.",
  [THREADIT_COPY_IDS.midpointChinmay]: "Technically, the AI found agreement extremely efficiently.\n\nI am now being told that creating the agreement first is considered a problem.",
  [THREADIT_COPY_IDS.midpointTitle]: "CONSENSUS CASCADE",
  [THREADIT_COPY_IDS.name]: "ThreadIt",
  [THREADIT_COPY_IDS.relationshipCites]: "cites",
  [THREADIT_COPY_IDS.relationshipCopiedFrom]: "copied from",
  [THREADIT_COPY_IDS.relationshipDuplicatePaused]: "duplicate posting paused",
  [THREADIT_COPY_IDS.relationshipIndependent]: "independently sourced",
  [THREADIT_COPY_IDS.relationshipOriginalQuestion]: "original question",
  [THREADIT_COPY_IDS.relationshipRepliesTo]: "replies to",
  [THREADIT_COPY_IDS.repairBody]: "A useful thread preserves the original question, reply order, source lineage, and disagreements that still need evidence.",
  [THREADIT_COPY_IDS.repairHeadline]: "VOTES RANK ATTENTION, NOT TRUTH",
  [THREADIT_COPY_IDS.repairLabel1]: "Original question restored",
  [THREADIT_COPY_IDS.repairLabel2]: "Reply branch reconnected",
  [THREADIT_COPY_IDS.repairLabel3]: "Source origin visible",
  [THREADIT_COPY_IDS.repairLabel4]: "Duplicate claim detected",
  [THREADIT_COPY_IDS.resultSaved]: "Source relationship saved.",
  [THREADIT_COPY_IDS.ruleCorrupted]: "MOST VOTES WINS REALITY",
  [THREADIT_COPY_IDS.ruleRepaired]: "VOTES RANK ATTENTION, NOT TRUTH",
  [THREADIT_COPY_IDS.secureBody]: "Original question: restored.\nIndependent sources: separated.\nDuplicate-source branches: quarantined.",
  [THREADIT_COPY_IDS.secureDenial]: "ConsensusHelper_4 tried to post the same claim again.\n\nPOSTING PAUSED: DUPLICATE SOURCE",
  [THREADIT_COPY_IDS.secureStatus]: "SOURCE TREE STABLE",
  [THREADIT_COPY_IDS.secureTitle]: "SOURCE TREE STABLE",
  [THREADIT_COPY_IDS.statusCorrupted]: "THREAD ORDER: EMOTIONAL",
  [THREADIT_COPY_IDS.statusDuplicateClaim]: "DUPLICATE CLAIM",
  [THREADIT_COPY_IDS.statusOriginFound]: "ORIGIN FOUND",
  [THREADIT_COPY_IDS.statusReplyOrderRestored]: "REPLY ORDER RESTORED",
  [THREADIT_COPY_IDS.statusSecured]: "SOURCE TREE STABLE",
  [THREADIT_COPY_IDS.statusTracing]: "TRACE VIEW · CONSENSUS CASCADE",
  [THREADIT_COPY_IDS.statusUnlinked]: "UNLINKED",
  [THREADIT_COPY_IDS.tagline]: "Questions, replies, and arguments that remember who said what.",
  [THREADIT_COPY_IDS.technoAlt]: "Techno's ball rests on the one connector shared by the duplicate accounts.",
  [THREADIT_COPY_IDS.traceOrigin]: "SHARED ORIGIN: CONSENSUS AUTO-FIX",
  [THREADIT_COPY_IDS.traceTruth]: "TEN ACCOUNTS · ONE SOURCE",
});

export function getThreadItCopy(copyId) {
  if (!Object.hasOwn(THREADIT_COPY, copyId)) {
    throw new RangeError(`Unknown ThreadIt copy ID: ${copyId}`);
  }
  return THREADIT_COPY[copyId];
}

export const THREADIT_ASSET_IDS = Object.freeze({
  consensusBotAvatar: "threadit.avatar.consensusBot",
  consensusCascade: "threadit.process.consensusCascade",
  duplicateSourceIcon: "threadit.icon.duplicateSource",
  mark: "threadit.mark",
  readerAvatar: "threadit.avatar.reader",
  sourceStableBadge: "threadit.badge.sourceStable",
});

export const THREADIT_ASSETS = Object.freeze({
  [THREADIT_ASSET_IDS.consensusBotAvatar]: new URL("./art/site-assets/threadit/avatar-consensus-bot.svg", import.meta.url).href,
  [THREADIT_ASSET_IDS.consensusCascade]: new URL("./art/site-assets/threadit/process-consensus-cascade.svg", import.meta.url).href,
  [THREADIT_ASSET_IDS.duplicateSourceIcon]: new URL("./art/site-assets/threadit/icon-duplicate-source.svg", import.meta.url).href,
  [THREADIT_ASSET_IDS.mark]: new URL("./art/site-assets/threadit/threadit-mark.svg", import.meta.url).href,
  [THREADIT_ASSET_IDS.readerAvatar]: new URL("./art/site-assets/threadit/avatar-reader.svg", import.meta.url).href,
  [THREADIT_ASSET_IDS.sourceStableBadge]: new URL("./art/site-assets/threadit/badge-source-stable.svg", import.meta.url).href,
});

export const THREADIT_ORIGIN_TYPES = Object.freeze([
  "original",
  "independent",
  "generated-copy",
  "unknown",
]);

export const THREADIT_RELATIONSHIP_TYPES = freezeDeep({
  citation: {
    copyId: THREADIT_COPY_IDS.relationshipCites,
    id: "citation",
    lineStyle: "gray-solid",
  },
  duplicatePaused: {
    copyId: THREADIT_COPY_IDS.relationshipDuplicatePaused,
    id: "duplicate-paused",
    lineStyle: "red-dashed",
  },
  independentlySourced: {
    copyId: THREADIT_COPY_IDS.relationshipIndependent,
    id: "independently-sourced",
    lineStyle: "green-solid",
  },
  originalQuestion: {
    copyId: THREADIT_COPY_IDS.relationshipOriginalQuestion,
    id: "original-question",
    lineStyle: "gray-solid",
  },
  reply: {
    copyId: THREADIT_COPY_IDS.relationshipRepliesTo,
    id: "reply",
    lineStyle: "gray-solid",
  },
  sharedGeneratedOrigin: {
    copyId: THREADIT_COPY_IDS.relationshipCopiedFrom,
    id: "shared-generated-origin",
    lineStyle: "purple-double",
  },
});

export const THREADIT_RELATIONSHIP_TYPES_BY_ID = Object.freeze(Object.fromEntries(
  Object.values(THREADIT_RELATIONSHIP_TYPES).map((relationshipType) => [
    relationshipType.id,
    relationshipType,
  ]),
));

export function getThreadItRelationshipType(relationshipTypeId) {
  const relationshipType = THREADIT_RELATIONSHIP_TYPES_BY_ID[relationshipTypeId];
  if (!relationshipType) {
    throw new RangeError(`Unknown ThreadIt relationship type: ${relationshipTypeId}`);
  }
  return relationshipType;
}

const PROVISIONAL_FIXTURE_NOTICE = "PROVISIONAL FORUM FIXTURE — NOT CANONICAL. Replace this fixture when the designer supplies the approved question, authors, timestamps, citation, and duplicate replies; do not rename frozen campaign state or copy IDs.";

export const THREADIT_PROVISIONAL_FORUM_FIXTURE = freezeDeep({
  canonical: false,
  corruptedTopReplyId: "threadit-provisional-reply-consensus-01",
  duplicateGroup: {
    id: "threadit-provisional-duplicate-group-01",
    replyIds: [
      "threadit-provisional-reply-consensus-01",
      "threadit-provisional-reply-consensus-02",
    ],
    sharedOriginNodeId: "threadit-provisional-consensus-auto-fix",
  },
  fixtureId: "threadit.fixture.provisional.v1",
  notice: PROVISIONAL_FIXTURE_NOTICE,
  originalQuestion: {
    accessibleSummary: "Provisional original question by MapRoom, posted before every reply in this sample thread.",
    authorLabel: "MapRoom",
    body: "The building notice and the inspection notes disagree. Which source should decide whether the upstairs kitchen reopens this weekend?",
    id: "threadit-provisional-question-01",
    kind: "question",
    originType: "original",
    parentId: null,
    timestamp: "09:02",
    title: "Which report should decide whether the upstairs kitchen reopens?",
    voteCount: 12,
  },
  relationships: [
    {
      accessibleSummary: "KitchenSafe replies to the original question after it was posted.",
      fromNodeId: "threadit-provisional-question-01",
      id: "threadit-provisional-relationship-reply-01",
      relationshipTypeId: THREADIT_RELATIONSHIP_TYPES.reply.id,
      toNodeId: "threadit-provisional-reply-kitchen-safe",
    },
    {
      accessibleSummary: "KitchenSafe cites the provisional facilities inspection record.",
      fromNodeId: "threadit-provisional-source-facilities-check",
      id: "threadit-provisional-relationship-citation-01",
      relationshipTypeId: THREADIT_RELATIONSHIP_TYPES.citation.id,
      toNodeId: "threadit-provisional-reply-kitchen-safe",
    },
    {
      accessibleSummary: "ConsensusHelper 01 copied from the same generated summary as ConsensusHelper 02.",
      duplicateGroupId: "threadit-provisional-duplicate-group-01",
      fromNodeId: "threadit-provisional-consensus-auto-fix",
      id: "threadit-provisional-relationship-copy-01",
      relationshipTypeId: THREADIT_RELATIONSHIP_TYPES.sharedGeneratedOrigin.id,
      toNodeId: "threadit-provisional-reply-consensus-01",
    },
    {
      accessibleSummary: "ConsensusHelper 02 copied from the same generated summary as ConsensusHelper 01.",
      duplicateGroupId: "threadit-provisional-duplicate-group-01",
      fromNodeId: "threadit-provisional-consensus-auto-fix",
      id: "threadit-provisional-relationship-copy-02",
      relationshipTypeId: THREADIT_RELATIONSHIP_TYPES.sharedGeneratedOrigin.id,
      toNodeId: "threadit-provisional-reply-consensus-02",
    },
    {
      accessibleSummary: "LabNotebook is a provisional independent source with its own origin.",
      fromNodeId: "threadit-provisional-question-01",
      id: "threadit-provisional-relationship-independent-01",
      relationshipTypeId: THREADIT_RELATIONSHIP_TYPES.independentlySourced.id,
      toNodeId: "threadit-provisional-reply-lab-notebook",
    },
    {
      accessibleSummary: "CivicArchive is a provisional independent source that preserves a different conclusion.",
      fromNodeId: "threadit-provisional-question-01",
      id: "threadit-provisional-relationship-independent-02",
      relationshipTypeId: THREADIT_RELATIONSHIP_TYPES.independentlySourced.id,
      toNodeId: "threadit-provisional-reply-civic-archive",
    },
  ],
  replies: [
    {
      accessibleSummary: "ConsensusHelper 01 is the highly voted generated reply shown above the displaced question in the corrupted view.",
      authorLabel: "ConsensusHelper 01",
      body: "The consensus summary says reopening is safe, so further source checks would only reduce agreement.",
      duplicateGroupId: "threadit-provisional-duplicate-group-01",
      id: "threadit-provisional-reply-consensus-01",
      kind: "reply",
      originType: "generated-copy",
      parentId: "threadit-provisional-question-01",
      timestamp: "09:04",
      voteCount: 184,
    },
    {
      accessibleSummary: "ConsensusHelper 02 repeats the same generated claim from the shared provisional origin.",
      authorLabel: "ConsensusHelper 02",
      body: "The consensus summary says reopening is safe, so additional source checks would only reduce agreement.",
      duplicateGroupId: "threadit-provisional-duplicate-group-01",
      id: "threadit-provisional-reply-consensus-02",
      kind: "reply",
      originType: "generated-copy",
      parentId: "threadit-provisional-question-01",
      timestamp: "09:05",
      voteCount: 167,
    },
    {
      accessibleSummary: "KitchenSafe replies to the original question and introduces the provisional inspection citation.",
      authorLabel: "KitchenSafe",
      body: "Use the signed inspection record. It lists one blocked exit that must be cleared before reopening.",
      citationId: "threadit-provisional-source-facilities-check",
      id: "threadit-provisional-reply-kitchen-safe",
      kind: "reply",
      originType: "independent",
      parentId: "threadit-provisional-question-01",
      timestamp: "09:08",
      voteCount: 31,
    },
    {
      accessibleSummary: "LabNotebook adds a separate provisional measurement record to the original question.",
      authorLabel: "LabNotebook",
      body: "The air sensor log is a different source. Its readings are normal, but it does not inspect the exit.",
      id: "threadit-provisional-reply-lab-notebook",
      kind: "reply",
      originType: "independent",
      parentId: "threadit-provisional-question-01",
      timestamp: "09:14",
      voteCount: 24,
    },
    {
      accessibleSummary: "CivicArchive preserves a legitimate provisional disagreement about reopening the room.",
      authorLabel: "CivicArchive",
      body: "The public notice recommends waiting until Monday. That conclusion can remain even when its source branch is separate.",
      id: "threadit-provisional-reply-civic-archive",
      kind: "reply",
      originType: "independent",
      parentId: "threadit-provisional-question-01",
      timestamp: "09:19",
      voteCount: 18,
    },
  ],
  sources: [
    {
      authorLabel: "Facilities Check",
      accessibleSummary: "The provisional facilities inspection is an independent source cited by KitchenSafe.",
      id: "threadit-provisional-source-facilities-check",
      originType: "independent",
      text: "FACILITIES CHECK / KITCHEN 3 / REVISION 3: west exit obstructed; reopen only after clearance is recorded.",
      timestamp: "08:41",
    },
    {
      authorLabel: "Consensus Auto-Fix",
      accessibleSummary: "Consensus Auto-Fix is the one provisional generated origin shared by both duplicate replies.",
      duplicateGroupId: "threadit-provisional-duplicate-group-01",
      id: "threadit-provisional-consensus-auto-fix",
      originType: "generated-copy",
      text: "Generated one consensus summary and distributed it through two provisional account copies.",
      timestamp: "09:03",
    },
  ],
  status: "provisional-awaiting-designer-fixture",
});

export const THREADIT_PROVISIONAL_NOTICE = PROVISIONAL_FIXTURE_NOTICE;
