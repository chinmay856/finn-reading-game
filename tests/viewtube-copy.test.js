import assert from "node:assert/strict";
import test from "node:test";

import {
  VIEWTUBE_ASSET_IDS,
  VIEWTUBE_ASSETS,
  VIEWTUBE_COPY_IDS,
  VIEWTUBE_PROVISIONAL_FIXTURE,
  VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID,
  VIEWTUBE_PROVISIONAL_PROCESS_ID,
  getViewTubeCopy,
} from "../apps/internet-recovery/viewtube-copy.js";
import { VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD } from "../apps/internet-recovery/viewtube-state.js";

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

test("ViewTube copy follows the exact campaign language and original asset boundary", () => {
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.corruptHeadline), "WATCH TIME PROVES TRUTH");
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.repairHeadline), "A GOOD VIDEO STILL NEEDS CONTEXT");
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.secureStatus), "EVIDENCE TRACKS RESTORED");
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.secureDenial), "DUPLICATE FRAMES - NO NEW EVIDENCE");
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.name), "ViewTube");
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.tagline), "A good video still needs context.");
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.evidenceTitle), "VIEWTUBE / DUPLICATE MEDIA HASHES");
  assert.equal(VIEWTUBE_COPY_IDS.evidenceTitle, "site.viewtube.secure.evidenceTitle");
  assert.equal(getViewTubeCopy(VIEWTUBE_COPY_IDS.technoAlt), "Techno paws the silent autoplay control off beside the duplicate-frame warning.");
  assert.match(getViewTubeCopy(VIEWTUBE_COPY_IDS.midpointAmy), /file hashes match/iu);
  assert.match(VIEWTUBE_ASSETS[VIEWTUBE_ASSET_IDS.mark], /viewtube-mark\.svg/u);
  assert.match(VIEWTUBE_ASSETS[VIEWTUBE_ASSET_IDS.technoMidpoint], /techno-suspicious-file\.webp/u);
  assert.match(VIEWTUBE_ASSETS[VIEWTUBE_ASSET_IDS.technoSecured], /techno-paw-alert-still\.webp/u);
  assert.ok(Object.values(VIEWTUBE_ASSETS).every((url) => !url.startsWith("/")));
  assert.throws(() => getViewTubeCopy("site.viewtube.unknown"), RangeError);
});

test("the canonical silent-video fixture is complete, fictional, and stable", () => {
  const fixture = VIEWTUBE_PROVISIONAL_FIXTURE;
  assertDeepFrozen(fixture);
  assert.equal(fixture.canonical, true);
  assert.equal(fixture.provisional, false);
  assert.equal(fixture.testOnly, false);
  assert.equal(fixture.eligibleForCanonicalCount, true);
  assert.equal(fixture.registryStatus, "canonical-runtime-fixture");
  assert.match(fixture.notice, /Canonical fictional/u);
  assert.equal(fixture.frames.length, 6);
  assert.ok(fixture.frames.every(({ accessibleSummary }) => accessibleSummary));
  assert.equal(fixture.transcript.length, 4);
  assert.equal(fixture.sourceRecords.length, 3);
  assert.equal(fixture.recommendations.length, 4);
  assert.equal(fixture.comments.length, 2);
  assert.equal(fixture.unitAssignments.length, 7);
  assert.equal(fixture.evidenceTracks.length, 3);
  assert.ok(fixture.evidenceTracks.every(({ accessibleSummary, linkedRecordIds }) => accessibleSummary && linkedRecordIds.length));
  assert.equal(fixture.autoplayLoop.playbackCount, 10);
  assert.equal(fixture.autoplayLoop.distinctMediaHashCount, 1);
  assert.equal(fixture.autoplayLoop.newEvidenceCount, 0);
  assert.equal(fixture.duplicatePlaybacks.length, 10);
  assert.equal(new Set(fixture.duplicatePlaybacks.map(({ id }) => id)).size, 10);
  assert.deepEqual(new Set(fixture.duplicatePlaybacks.map(({ mediaHash }) => mediaHash)), new Set([fixture.autoplayLoop.mediaHash]));
  assert.deepEqual(new Set(fixture.duplicatePlaybacks.map(({ originId }) => originId)), new Set([fixture.autoplayLoop.originId]));
  assert.equal(fixture.process.upstreamServiceId, "ai_repair_service");
  assert.equal(fixture.process.id, VIEWTUBE_PROVISIONAL_PROCESS_ID);
  assert.equal(fixture.blockedCloneTarget.id, VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID);
  assert.equal(fixture.finalEightSecondSegment.id, VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID);
  assert.equal(fixture.autoplayLoop.segmentId, VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID);
  assert.equal(VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD.actorId, fixture.process.id);
  assert.equal(VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD.targetId, fixture.blockedCloneTarget.id);
  assert.equal(fixture.recording.timezone, "UTC");
  assert.match(fixture.recording.accessibleSummary, /fictional 46-second/iu);
  assert.equal(fixture.sponsorship.sponsored, false);
  assert.ok(fixture.unitAssignments.every(({ accessibleResult, recordIds }) => accessibleResult && recordIds.length));
  assert.equal(fixture.recording.creator, "Northwind Field Archive");
  assert.doesNotMatch(JSON.stringify(fixture), /youtube|youtu\.be|@|child|address/iu);
});
