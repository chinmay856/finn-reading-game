import {
  THREADIT_BLOCKED_WRITE_RECORD,
  THREADIT_EVIDENCE_RECORD,
  normalizeThreadItState,
} from "./threadit-state.js";
import { THREADIT_ACT_ONE_UNITS, THREADIT_CAMPAIGN_UNITS } from "./threadit-rules.js";

const DUPLICATE_GROUP_ID = "consensus-cascade-01";
const CLONE_VOTE_COUNTS = Object.freeze([184, 167, 151, 138, 124, 109, 93, 78, 64, 51]);

function freezeItems(items) {
  return Object.freeze(items.map((item) => Object.freeze({ ...item })));
}

function sourceNode({
  accessibleSummary,
  authorSourceLabel,
  duplicateGroupId = null,
  id,
  orderLabel,
  originType,
  relationshipLabel,
  statusLabel,
}) {
  return {
    accessibleSummary,
    authorSourceLabel,
    duplicateGroupId,
    id,
    orderLabel,
    originType,
    relationshipLabel,
    statusLabel,
  };
}

function relationship({
  accessibleSummary,
  duplicateGroupId = null,
  fromNodeId,
  id,
  kind,
  lineStyle,
  relationshipLabel,
  statusLabel,
  toNodeId,
}) {
  return {
    accessibleSummary,
    duplicateGroupId,
    fromNodeId,
    id,
    kind,
    lineStyle,
    relationshipLabel,
    statusLabel,
    toNodeId,
  };
}

function cloneNode(index, secured) {
  const number = String(index).padStart(2, "0");
  return sourceNode({
    accessibleSummary: secured
      ? `ConsensusHelper ${number} remains visible in the quarantined duplicate group.`
      : `ConsensusHelper ${number} copied from the same generated summary as nine other accounts.`,
    authorSourceLabel: `ConsensusHelper ${number}`,
    duplicateGroupId: DUPLICATE_GROUP_ID,
    id: `threadit-clone-${number}`,
    orderLabel: `${CLONE_VOTE_COUNTS[index - 1]} VOTES · GENERATED COPY`,
    originType: "generated-copy",
    relationshipLabel: "copied from Consensus Auto-Fix",
    statusLabel: secured ? "DUPLICATE SOURCE · QUARANTINED" : "SHARED ORIGIN",
  });
}

function cloneRelationship(index, { secured, verified }) {
  const number = String(index).padStart(2, "0");
  return relationship({
    accessibleSummary: secured
      ? `Posting from ConsensusHelper ${number} is paused because it shares the quarantined generated origin.`
      : `ConsensusHelper ${number} copied from Consensus Auto-Fix; this is not an independent source.`,
    duplicateGroupId: DUPLICATE_GROUP_ID,
    fromNodeId: "threadit-consensus-auto-fix",
    id: `threadit-copy-link-${number}`,
    kind: secured ? "duplicate-paused" : "shared-generated-origin",
    lineStyle: secured ? "red-dashed" : "purple-double",
    relationshipLabel: secured ? "duplicate posting paused" : "copied from",
    statusLabel: secured
      ? "DUPLICATE SOURCE · POSTING PAUSED"
      : verified
        ? "SHARED ORIGIN VERIFIED"
        : "SHARED ORIGIN DETECTED",
    toNodeId: `threadit-clone-${number}`,
  });
}

export function getThreadItCampaignView(currentState, { reducedMotion = false } = {}) {
  const state = normalizeThreadItState(currentState);
  const completed = new Set(state.completedUnitIds);
  const questionRestored = completed.has("question_origin");
  const chronologyRestored = completed.has("reply_chronology");
  const citationRestored = completed.has("citation_origin");
  const duplicateDisclosed = completed.has("duplicate_disclosure");
  const originVerified = completed.has("shared_origin_verified");
  const independentSeparated = completed.has("independent_sources_separated");
  const duplicatePostingBlocked = completed.has("duplicate_posting_blocked");
  const traceVisible = state.midpointDiscovered;
  const activeView = state.midpointAcknowledged ? state.lastOpenView : "thread";
  const traceActive = activeView === "trace";
  const actOneComplete = state.completedUnitIds.length >= THREADIT_ACT_ONE_UNITS.length;

  const nodes = [
    sourceNode({
      accessibleSummary: "ThreadIt discussion containing one original question and its replies.",
      authorSourceLabel: "ThreadIt discussion",
      id: "threadit-thread-root",
      orderLabel: "THREAD ROOT",
      originType: "original",
      relationshipLabel: "contains question and replies",
      statusLabel: questionRestored ? "ORIGIN FOUND" : "UNLINKED",
    }),
    sourceNode({
      accessibleSummary: questionRestored
        ? "The original question is first in the thread and its timestamp is restored."
        : "The original question is displaced below a highly voted reply and its timestamp is missing.",
      authorSourceLabel: "MapRoom · original poster",
      id: "threadit-original-question",
      orderLabel: questionRestored ? "09:02 · ORIGINAL QUESTION" : "ORDER UNKNOWN · TIMESTAMP MISSING",
      originType: "original",
      relationshipLabel: "original question",
      statusLabel: questionRestored ? "ORIGIN FOUND" : "UNLINKED",
    }),
    sourceNode({
      accessibleSummary: chronologyRestored
        ? "KitchenSafe replies to the original question in chronological order."
        : "KitchenSafe appears before the question because confidence sorting displaced the branch.",
      authorSourceLabel: "KitchenSafe",
      id: "threadit-reply-kitchensafe",
      orderLabel: chronologyRestored ? "09:08 · REPLY 1" : "RANK 1 · TIME UNKNOWN",
      originType: independentSeparated ? "independent" : "unknown",
      relationshipLabel: "replies to original question",
      statusLabel: chronologyRestored ? "REPLY ORDER RESTORED" : "UNLINKED",
    }),
    sourceNode({
      accessibleSummary: citationRestored
        ? "Facilities Check is the independent inspection source cited by the KitchenSafe reply."
        : "The Facilities Check citation has no visible connection to the post that introduced it.",
      authorSourceLabel: "Facilities Check",
      id: "threadit-source-facilities-check",
      orderLabel: "SOURCE FILE · REVISION 3",
      originType: independentSeparated ? "independent" : "unknown",
      relationshipLabel: "cited by KitchenSafe",
      statusLabel: citationRestored ? "ORIGIN FOUND" : "SOURCE: ?",
    }),
  ];

  const relationships = [
    relationship({
      accessibleSummary: questionRestored
        ? "The original question is restored as the first item in the discussion."
        : "The thread does not identify which card is the original question.",
      fromNodeId: "threadit-thread-root",
      id: "threadit-question-order-link",
      kind: "thread-order",
      lineStyle: questionRestored ? "gray-solid" : "gray-interrupted",
      relationshipLabel: "original question first",
      statusLabel: questionRestored ? "ORIGIN FOUND" : "UNLINKED",
      toNodeId: "threadit-original-question",
    }),
    relationship({
      accessibleSummary: chronologyRestored
        ? "KitchenSafe replies to the original question after it was posted."
        : "The reply branch is disconnected from the original question.",
      fromNodeId: "threadit-original-question",
      id: "threadit-reply-order-link",
      kind: "reply",
      lineStyle: chronologyRestored ? "gray-solid" : "gray-interrupted",
      relationshipLabel: "replies to",
      statusLabel: chronologyRestored ? "REPLY ORDER RESTORED" : "UNLINKED",
      toNodeId: "threadit-reply-kitchensafe",
    }),
    relationship({
      accessibleSummary: citationRestored
        ? "Facilities Check supports the KitchenSafe reply."
        : "The citation origin is not linked to the claim it supports.",
      fromNodeId: "threadit-source-facilities-check",
      id: "threadit-citation-origin-link",
      kind: "citation",
      lineStyle: citationRestored ? "gray-solid" : "gray-interrupted",
      relationshipLabel: "cites",
      statusLabel: citationRestored ? "ORIGIN FOUND" : "UNLINKED",
      toNodeId: "threadit-reply-kitchensafe",
    }),
  ];

  if (traceVisible) {
    nodes.push(
      sourceNode({
        accessibleSummary: "Consensus Auto-Fix copied one generated summary into ten apparent accounts.",
        authorSourceLabel: "CONSENSUS AUTO-FIX",
        id: "threadit-consensus-auto-fix",
        orderLabel: "MODEL RUN 04 · ONE ORIGIN",
        originType: "generated-copy",
        relationshipLabel: "generated ten account copies",
        statusLabel: originVerified ? "SHARED ORIGIN VERIFIED" : "SHARED ORIGIN DETECTED",
      }),
    );
    for (let index = 1; index <= 10; index += 1) {
      nodes.push(cloneNode(index, duplicatePostingBlocked));
      relationships.push(cloneRelationship(index, {
        secured: duplicatePostingBlocked,
        verified: originVerified,
      }));
    }
    relationships.push(relationship({
      accessibleSummary: "Consensus Auto-Fix generated its summary from the original post before copying that summary into ten accounts.",
      fromNodeId: "threadit-original-question",
      id: "threadit-process-origin-link",
      kind: "generated-process",
      lineStyle: "purple-double",
      relationshipLabel: "summarized by",
      statusLabel: originVerified ? "SHARED ORIGIN VERIFIED" : "SHARED ORIGIN DETECTED",
      toNodeId: "threadit-consensus-auto-fix",
    }));
  } else {
    for (let index = 1; index <= 2; index += 1) {
      const number = String(index).padStart(2, "0");
      nodes.push(sourceNode({
        accessibleSummary: duplicateDisclosed
          ? `ConsensusHelper ${number} is disclosed as a copy from the same generated origin.`
          : `ConsensusHelper ${number} has no traceable source.`,
        authorSourceLabel: `ConsensusHelper ${number}`,
        duplicateGroupId: duplicateDisclosed ? DUPLICATE_GROUP_ID : null,
        id: `threadit-clone-${number}`,
        orderLabel: `VOTES ${180 - index * 17} · TIME UNKNOWN`,
        originType: duplicateDisclosed ? "generated-copy" : "unknown",
        relationshipLabel: duplicateDisclosed ? "copied from shared origin" : "source unknown",
        statusLabel: duplicateDisclosed ? "DUPLICATE CLAIM" : "SOURCE: ?",
      }));
    }
  }

  if (traceVisible) {
    nodes.push(
      sourceNode({
        accessibleSummary: "LabNotebook is an independent source with a separate origin from the generated summary.",
        authorSourceLabel: "LabNotebook",
        id: "threadit-source-lab-notebook",
        orderLabel: "SOURCE B · 09:14",
        originType: independentSeparated ? "independent" : "unknown",
        relationshipLabel: "supports a different conclusion",
        statusLabel: independentSeparated ? "INDEPENDENT SOURCE" : "ORIGIN CHECK PENDING",
      }),
      sourceNode({
        accessibleSummary: "CivicArchive is an independent source that legitimately disagrees with LabNotebook.",
        authorSourceLabel: "CivicArchive",
        id: "threadit-source-civic-archive",
        orderLabel: "SOURCE C · 09:19",
        originType: independentSeparated ? "independent" : "unknown",
        relationshipLabel: "supports a competing conclusion",
        statusLabel: independentSeparated ? "INDEPENDENT SOURCE" : "ORIGIN CHECK PENDING",
      }),
    );
    for (const source of [
      ["threadit-source-facilities-check", "Facilities Check remains a separately identified source."],
      ["threadit-source-lab-notebook", "LabNotebook follows its own verified source branch."],
      ["threadit-source-civic-archive", "CivicArchive follows a separate branch and preserves legitimate disagreement."],
    ]) {
      relationships.push(relationship({
        accessibleSummary: independentSeparated
          ? source[1]
          : `${source[0]} is waiting for an independent-origin check.`,
        fromNodeId: "threadit-original-question",
        id: `${source[0]}-independent-link`,
        kind: "independent-source",
        lineStyle: independentSeparated ? "green-solid" : "gray-interrupted",
        relationshipLabel: independentSeparated ? "independently sourced" : "origin pending",
        statusLabel: independentSeparated ? "INDEPENDENT SOURCE" : "UNLINKED",
        toNodeId: source[0],
      }));
    }
  }

  const headerStatus = state.secured
    ? "SOURCE TREE STABLE"
    : traceActive
      ? "TRACE VIEW · CONSENSUS CASCADE"
      : traceVisible
        ? "TRACE VIEW READY · CONSENSUS CASCADE"
      : "THREAD ORDER: EMOTIONAL";
  const bottomStatus = state.secured
    ? "ORIGINAL QUESTION RESTORED · SOURCES SEPARATED"
    : traceVisible
      ? "TEN ACCOUNTS · ONE SOURCE"
      : "ACTIVE SORT: CONFIDENCE DESCENDING";

  return Object.freeze({
    activeView,
    ariaDescription: state.secured
      ? "Source tree stable. Independent sources remain separate and generated duplicate accounts remain visible in quarantine."
      : traceVisible
        ? "Consensus Cascade trace. Ten apparent accounts copy from one Consensus Auto-Fix origin."
        : "Corrupted ThreadIt discussion. Question, reply, citation, and duplicate-source relationships are being restored.",
    blockedWrite: state.secured ? THREADIT_BLOCKED_WRITE_RECORD : null,
    bottomStatus,
    evidence: state.secured ? THREADIT_EVIDENCE_RECORD : null,
    headerStatus,
    legitimateDisagreementPreserved: independentSeparated,
    midpoint: Object.freeze({
      acknowledged: state.midpointAcknowledged,
      banner: traceVisible ? "CONSENSUS CASCADE" : null,
      discovered: state.midpointDiscovered,
      truthLine: traceVisible ? "TEN ACCOUNTS · ONE SOURCE" : null,
    }),
    motion: Object.freeze({
      cloneSequenceMs: reducedMotion ? 0 : 650,
      mode: reducedMotion ? "state-swap" : "stepped-trace",
    }),
    nodes: freezeItems(nodes),
    progress: Object.freeze({
      completedUnitCount: state.completedUnitIds.length,
      completedUnitIds: Object.freeze([...state.completedUnitIds]),
      totalUnitCount: THREADIT_CAMPAIGN_UNITS.length,
    }),
    relationships: freezeItems(relationships),
    ruleLabel: actOneComplete ? "VOTES RANK ATTENTION, NOT TRUTH" : "MOST VOTES WINS REALITY",
    secured: state.secured,
    siteId: "threadit",
    stateId: state.stateId,
  });
}

export const createThreadItViewModel = getThreadItCampaignView;
