import assert from "node:assert/strict";
import test from "node:test";

import {
  VIEWTUBE_PROVISIONAL_EVIDENCE_ID,
  VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
} from "../apps/internet-recovery/viewtube-state.js";
import {
  summarizeHubEvidenceState,
  summarizeHubSiteEvidence,
} from "../apps/internet-recovery/recovery-hub-state.js";

test("ViewTube canonical slot-six evidence counts only when persisted and exactly matched", () => {
  const entry = {
    canonicalEvidenceId: VIEWTUBE_PROVISIONAL_EVIDENCE_ID,
    evidenceRecord: VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
    persisted: true,
    siteId: "viewtube",
    state: {
      evidenceId: VIEWTUBE_PROVISIONAL_EVIDENCE_ID,
      secured: true,
    },
  };
  const site = summarizeHubSiteEvidence(entry);
  assert.equal(site.displayEvidenceId, VIEWTUBE_PROVISIONAL_EVIDENCE_ID);
  assert.equal(site.displayEvidenceRecord.slot, 6);
  assert.equal(site.displayEvidenceProvisional, false);
  assert.equal(site.persistedCanonical, true);
  assert.equal(site.persistedNonCanonical, false);
  assert.equal(site.displayMode, "persisted-canonical");

  const aggregate = summarizeHubEvidenceState([entry], {
    requiredCanonicalSiteIds: ["viewtube"],
  });
  assert.equal(aggregate.persistedCanonicalCount, 1);
  assert.equal(aggregate.canonicalComplete, true);
});
