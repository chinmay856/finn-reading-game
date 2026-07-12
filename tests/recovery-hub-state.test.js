import assert from "node:assert/strict";
import test from "node:test";

import {
  FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID,
  FACEPLACE_PROVISIONAL_EVIDENCE_ID,
  FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
} from "../apps/internet-recovery/faceplace-state.js";
import {
  MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID,
  MAPGUESS_PROVISIONAL_EVIDENCE_ID,
  MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
} from "../apps/internet-recovery/mapguess-state.js";
import {
  MYCORNER_PROVISIONAL_EVIDENCE_ID,
  MYCORNER_PROVISIONAL_EVIDENCE_RECORD,
} from "../apps/internet-recovery/mycorner-state.js";
import {
  YAHUH_PROVISIONAL_EVIDENCE_ID,
  YAHUH_PROVISIONAL_EVIDENCE_RECORD,
} from "../apps/internet-recovery/yahuh-state.js";
import {
  summarizeHubEvidenceState,
  summarizeHubSiteEvidence,
} from "../apps/internet-recovery/recovery-hub-state.js";

const CANONICAL_WIKIWHY = Object.freeze({
  canonical: true,
  id: "wikiwhy.evidence.route-fragment-01",
  slot: 1,
});

const CANONICAL_THREADIT = Object.freeze({
  canonical: true,
  id: "threadit.evidence.synthetic-consensus-overflow-01",
  slot: 2,
});

test("an unsecured site contributes no display or canonical evidence", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: CANONICAL_WIKIWHY.id,
    evidenceRecord: CANONICAL_WIKIWHY,
    persisted: true,
    siteId: "wikiwhy",
    state: { evidenceId: null, phase: "act-one" },
  });
  assert.equal(summary.displayMode, "unsecured");
  assert.equal(summary.displaySecured, false);
  assert.equal(summary.persistedCanonical, false);
  assert.equal(summary.displayEvidenceRecord, null);
});

test("diagnostic evidence can display but is always classified as test", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: null,
    diagnosticEvidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
    diagnosticState: {
      evidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID,
      secured: true,
    },
    persisted: false,
    siteId: "faceplace",
    state: { evidenceId: null, secured: false },
  });
  assert.equal(summary.displaySecured, true);
  assert.equal(summary.displayMode, "test");
  assert.equal(summary.testSecured, true);
  assert.equal(summary.displayEvidenceId, FACEPLACE_PROVISIONAL_EVIDENCE_ID);
  assert.equal(summary.displayEvidenceProvisional, false);
  assert.equal(summary.persistedCanonical, false);
  assert.equal(summary.tabOnly, false);
});

test("real secured state without storage is tab-only, not canonical", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: CANONICAL_THREADIT.id,
    evidenceRecord: CANONICAL_THREADIT,
    persisted: false,
    siteId: "threadit",
    state: { evidenceId: CANONICAL_THREADIT.id, secured: true },
  });
  assert.equal(summary.displayMode, "tab-only");
  assert.equal(summary.tabOnly, true);
  assert.equal(summary.persistedCanonical, false);
  assert.equal(summary.displaySecured, true);
});

test("persisted canonical evidence requires secured state, exact ID, and a canonical record", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: CANONICAL_WIKIWHY.id,
    evidenceRecord: CANONICAL_WIKIWHY,
    persisted: true,
    siteId: "wikiwhy",
    state: { evidenceId: CANONICAL_WIKIWHY.id, phase: "secured" },
  });
  assert.equal(summary.displayMode, "persisted-canonical");
  assert.equal(summary.realSecured, true);
  assert.equal(summary.persistedCanonical, true);
  assert.equal(summary.persistedNonCanonical, false);
});

test("a mismatched persisted evidence ID remains visibly secured but noncanonical", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: CANONICAL_WIKIWHY.id,
    evidenceRecord: CANONICAL_WIKIWHY,
    persisted: true,
    siteId: "wikiwhy",
    state: { evidenceId: "wikiwhy.evidence.wrong", phase: "secured" },
  });
  assert.equal(summary.displayMode, "persisted-noncanonical");
  assert.equal(summary.displaySecured, true);
  assert.equal(summary.persistedCanonical, false);
  assert.equal(summary.persistedNonCanonical, true);
});

test("FacePlace canonical evidence counts only when persisted and exactly matched", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalBlockedWriteId: FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID,
    canonicalEvidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID,
    evidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
    persisted: true,
    siteId: "faceplace",
    state: {
      blockedWriteId: FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID,
      evidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID,
      secured: true,
    },
  });
  assert.equal(summary.displayEvidenceProvisional, false);
  assert.equal(summary.persistedCanonical, true);
  assert.equal(summary.persistedNonCanonical, false);
  assert.equal(summary.displayMode, "persisted-canonical");
});

test("FacePlace evidence without the exact persisted blocked write stays noncanonical", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalBlockedWriteId: FACEPLACE_PROVISIONAL_BLOCKED_WRITE_ID,
    canonicalEvidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID,
    evidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
    persisted: true,
    siteId: "faceplace",
    state: {
      blockedWriteId: "faceplace.blocked-wrong",
      evidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID,
      secured: true,
    },
  });
  assert.equal(summary.blockedWriteMatches, false);
  assert.equal(summary.persistedCanonical, false);
  assert.equal(summary.persistedNonCanonical, true);
});

test("MapGuess canonical evidence also requires its blocked write and a locked route goal", () => {
  const base = {
    canonicalBlockedWriteId: MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID,
    canonicalEvidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
    evidenceRecord: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
    persisted: true,
    requiresLockedRouteGoal: true,
    siteId: "mapguess",
  };
  const incomplete = summarizeHubSiteEvidence({
    ...base,
    state: {
      blockedWriteId: MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID,
      evidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
      routeGoal: null,
      routeGoalLocked: false,
      secured: true,
    },
  });
  assert.equal(incomplete.routeGoalMatches, false);
  assert.equal(incomplete.persistedCanonical, false);

  const complete = summarizeHubSiteEvidence({
    ...base,
    state: {
      blockedWriteId: MAPGUESS_PROVISIONAL_BLOCKED_WRITE_ID,
      evidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
      routeGoal: "fastest",
      routeGoalLocked: true,
      secured: true,
    },
  });
  assert.equal(complete.blockedWriteMatches, true);
  assert.equal(complete.routeGoalMatches, true);
  assert.equal(complete.persistedCanonical, true);
});

test("MapGuess canonical slot-10 evidence counts when persisted and exactly matched", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
    evidenceRecord: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
    persisted: true,
    siteId: "mapguess",
    state: {
      evidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_ID,
      secured: true,
    },
  });
  assert.equal(summary.displayEvidenceId, MAPGUESS_PROVISIONAL_EVIDENCE_ID);
  assert.equal(summary.displayEvidenceRecord.slot, 10);
  assert.equal(summary.displayEvidenceProvisional, false);
  assert.equal(summary.persistedCanonical, true);
  assert.equal(summary.persistedNonCanonical, false);
  assert.equal(summary.displayMode, "persisted-canonical");
});

test("MyCorner canonical slot-four evidence counts only when persisted and exactly matched", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: MYCORNER_PROVISIONAL_EVIDENCE_ID,
    evidenceRecord: MYCORNER_PROVISIONAL_EVIDENCE_RECORD,
    persisted: true,
    siteId: "mycorner",
    state: {
      evidenceId: MYCORNER_PROVISIONAL_EVIDENCE_ID,
      secured: true,
    },
  });
  assert.equal(summary.displayEvidenceId, MYCORNER_PROVISIONAL_EVIDENCE_ID);
  assert.equal(summary.displayEvidenceRecord.slot, 4);
  assert.equal(summary.displayEvidenceProvisional, false);
  assert.equal(summary.persistedCanonical, true);
  assert.equal(summary.persistedNonCanonical, false);
  assert.equal(summary.displayMode, "persisted-canonical");
});

test("Yahuh canonical slot-five evidence counts only when persisted and exactly matched", () => {
  const summary = summarizeHubSiteEvidence({
    canonicalEvidenceId: YAHUH_PROVISIONAL_EVIDENCE_ID,
    evidenceRecord: YAHUH_PROVISIONAL_EVIDENCE_RECORD,
    persisted: true,
    siteId: "yahuh",
    state: {
      evidenceId: YAHUH_PROVISIONAL_EVIDENCE_ID,
      secured: true,
    },
  });
  assert.equal(summary.displayEvidenceId, YAHUH_PROVISIONAL_EVIDENCE_ID);
  assert.equal(summary.displayEvidenceRecord.slot, 5);
  assert.equal(summary.displayEvidenceProvisional, false);
  assert.equal(summary.persistedCanonical, true);
  assert.equal(summary.persistedNonCanonical, false);
  assert.equal(summary.displayMode, "persisted-canonical");
});

test("aggregate counts keep display, test, tab-only, and persisted canonical truth separate", () => {
  const summary = summarizeHubEvidenceState([
    {
      canonicalEvidenceId: CANONICAL_WIKIWHY.id,
      evidenceRecord: CANONICAL_WIKIWHY,
      persisted: true,
      siteId: "wikiwhy",
      state: { evidenceId: CANONICAL_WIKIWHY.id, phase: "secured" },
    },
    {
      canonicalEvidenceId: CANONICAL_THREADIT.id,
      evidenceRecord: CANONICAL_THREADIT,
      persisted: false,
      siteId: "threadit",
      state: { evidenceId: CANONICAL_THREADIT.id, secured: true },
    },
    {
      diagnosticEvidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
      diagnosticState: { evidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID, secured: true },
      siteId: "faceplace",
      state: { secured: false },
    },
  ], {
    requiredCanonicalSiteIds: ["wikiwhy", "threadit", "faceplace"],
  });

  assert.equal(summary.displaySecuredCount, 3);
  assert.equal(summary.testSecuredCount, 1);
  assert.equal(summary.tabOnlySecuredCount, 1);
  assert.equal(summary.persistedCanonicalCount, 1);
  assert.deepEqual(summary.persistedCanonicalSiteIds, ["wikiwhy"]);
  assert.equal(summary.hasTestState, true);
  assert.equal(summary.hasTabOnlyState, true);
  assert.equal(summary.canonicalComplete, false);
});

test("diagnostics cannot satisfy a canonical completion predicate", () => {
  const summary = summarizeHubEvidenceState({
    requiredCanonicalSiteIds: ["wikiwhy", "threadit", "faceplace"],
    sites: [
      {
        canonicalEvidenceId: CANONICAL_WIKIWHY.id,
        evidenceRecord: CANONICAL_WIKIWHY,
        persisted: true,
        siteId: "wikiwhy",
        state: { evidenceId: CANONICAL_WIKIWHY.id, phase: "secured" },
      },
      {
        canonicalEvidenceId: CANONICAL_THREADIT.id,
        evidenceRecord: CANONICAL_THREADIT,
        persisted: true,
        siteId: "threadit",
        state: { evidenceId: CANONICAL_THREADIT.id, secured: true },
      },
      {
        diagnosticEvidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: { evidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_ID, secured: true },
        siteId: "faceplace",
      },
    ],
  });
  assert.equal(summary.displaySecuredCount, 3);
  assert.equal(summary.persistedCanonicalCount, 2);
  assert.equal(summary.canonicalComplete, false);
  assert.equal(summary.bySiteId.faceplace.displayMode, "test");
});

test("canonical completion requires every distinct required site", () => {
  const summary = summarizeHubEvidenceState([
    {
      canonicalEvidenceId: CANONICAL_WIKIWHY.id,
      evidenceRecord: CANONICAL_WIKIWHY,
      persisted: true,
      siteId: "wikiwhy",
      state: { evidenceId: CANONICAL_WIKIWHY.id, phase: "secured" },
    },
    {
      canonicalEvidenceId: CANONICAL_THREADIT.id,
      evidenceRecord: CANONICAL_THREADIT,
      persisted: true,
      siteId: "threadit",
      state: { evidenceId: CANONICAL_THREADIT.id, secured: true },
    },
  ], {
    requiredCanonicalSiteIds: ["wikiwhy", "threadit", "threadit"],
  });
  assert.equal(summary.persistedCanonicalCount, 2);
  assert.deepEqual(summary.requiredCanonicalSiteIds, ["wikiwhy", "threadit"]);
  assert.equal(summary.canonicalComplete, true);
});

test("duplicate site entries do not inflate hub counts", () => {
  const summary = summarizeHubEvidenceState([
    {
      canonicalEvidenceId: CANONICAL_WIKIWHY.id,
      evidenceRecord: CANONICAL_WIKIWHY,
      persisted: false,
      siteId: "wikiwhy",
      state: { evidenceId: CANONICAL_WIKIWHY.id, phase: "secured" },
    },
    {
      canonicalEvidenceId: CANONICAL_WIKIWHY.id,
      evidenceRecord: CANONICAL_WIKIWHY,
      persisted: true,
      siteId: "wikiwhy",
      state: { evidenceId: CANONICAL_WIKIWHY.id, phase: "secured" },
    },
  ]);
  assert.equal(summary.sites.length, 1);
  assert.equal(summary.displaySecuredCount, 1);
  assert.equal(summary.persistedCanonicalCount, 1);
});

test("hub summary rejects entries without stable site IDs", () => {
  assert.throws(() => summarizeHubSiteEvidence({ state: { secured: true } }), /siteId/u);
});
