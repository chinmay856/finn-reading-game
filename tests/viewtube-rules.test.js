import test from "node:test";
import assert from "node:assert/strict";

import {
  VIEWTUBE_CAMPAIGN_UNITS,
  VIEWTUBE_RESTORE_UNITS,
  VIEWTUBE_TRACK_UNITS,
  calculateViewTubeReadingOutcome,
  getNextViewTubeUnit,
} from "../apps/internet-recovery/viewtube-rules.js";

test("ViewTube freezes the exact four-restore plus three-track contract", () => {
  assert.deepEqual(
    VIEWTUBE_RESTORE_UNITS.map(({ unitId }) => unitId),
    ["recording_identity", "distinct_frames", "transcript_track", "source_context"],
  );
  assert.deepEqual(
    VIEWTUBE_TRACK_UNITS.map(({ unitId }) => unitId),
    ["footage_track_verified", "transcript_track_verified", "source_track_verified"],
  );
  assert.deepEqual(
    VIEWTUBE_CAMPAIGN_UNITS.map(({ stateId }) => stateId),
    [
      "viewtube_restore_1",
      "viewtube_restore_2",
      "viewtube_restore_3",
      "viewtube_restore_4",
      "viewtube_track_1",
      "viewtube_track_2",
      "viewtube_track_3",
    ],
  );
  assert.equal(VIEWTUBE_CAMPAIGN_UNITS.length, 7);
  assert.ok(Object.isFrozen(VIEWTUBE_CAMPAIGN_UNITS));
  assert.ok(VIEWTUBE_CAMPAIGN_UNITS.every(Object.isFrozen));
});

test("ViewTube outcomes stop at the saved autoplay midpoint and secured boundaries", () => {
  const empty = { completedUnitIds: [], midpointAcknowledged: false };
  const first = calculateViewTubeReadingOutcome({ campaignState: empty });
  assert.equal(first.kind, "restore-unit");
  assert.equal(first.unitId, "recording_identity");

  const midpoint = {
    completedUnitIds: VIEWTUBE_RESTORE_UNITS.map(({ unitId }) => unitId),
    midpointDiscovered: true,
    midpointAcknowledged: false,
  };
  assert.equal(getNextViewTubeUnit(midpoint), null);
  assert.equal(
    calculateViewTubeReadingOutcome({ campaignState: midpoint }).reason,
    "midpoint-acknowledgement-required",
  );

  const acknowledged = { ...midpoint, midpointAcknowledged: true };
  assert.equal(getNextViewTubeUnit(acknowledged).unitId, "footage_track_verified");
  assert.equal(calculateViewTubeReadingOutcome({ campaignState: acknowledged }).kind, "track-unit");

  const secured = {
    act: "secured",
    completedUnitIds: VIEWTUBE_CAMPAIGN_UNITS.map(({ unitId }) => unitId),
    midpointAcknowledged: true,
    secured: true,
  };
  assert.equal(calculateViewTubeReadingOutcome({ campaignState: secured }).reason, "already-secured");
});

test("a rejected reading never advances a ViewTube unit", () => {
  const outcome = calculateViewTubeReadingOutcome({ accepted: false, campaignState: {} });
  assert.equal(outcome.kind, "no-progress");
  assert.equal(outcome.reason, "reading-not-accepted");
  assert.equal(outcome.unitId, null);
});
