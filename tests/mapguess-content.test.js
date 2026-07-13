import test from "node:test";
import assert from "node:assert/strict";

import {
  MAPGUESS_ASSET_IDS,
  MAPGUESS_ASSETS,
  MAPGUESS_COPY_IDS,
  MAPGUESS_PROVISIONAL_FIXTURE,
  MAPGUESS_PROVISIONAL_NOTICE,
  MAPGUESS_ROUTE_GOALS,
  getMapGuessCopy,
} from "../apps/internet-recovery/mapguess-copy.js";
import {
  MAPGUESS_CONTENT_READINESS,
  MAPGUESS_DECK_A_IDS,
  MAPGUESS_DECK_B_IDS,
  selectNextMapGuessPassage,
} from "../apps/internet-recovery/mapguess-content.js";
import { A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE } from "../content/mapguess/a-map-is-not-a-photograph.js";
import { isSelectablePassage } from "../content/passage-catalog.js";

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

function assertProvisionalRecords(value) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value)) {
    assert.equal(value.canonical, false);
    assert.equal(value.provisional, true);
    assert.equal(value.testOnly, true);
  }
  for (const child of Object.values(value)) assertProvisionalRecords(child);
}

function approvedRecord(id) {
  return Object.freeze({
    ...A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE,
    availability: "approved",
    id,
    source: Object.freeze({
      ...A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE.source,
      frozenRevision: "test-fixture-noaa-cartography-revision-2026-07-12",
    }),
    review: Object.freeze({
      accessibility: "passed",
      adaptationFidelity: "passed",
      comprehension: "passed",
      editorial: "passed",
      factual: "passed",
      grade: "passed",
      profile: "passed",
      rights: "passed",
      sensitivity: "passed",
      transcription: "passed",
    }),
    transcriptionReview: Object.freeze({
      ...A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE.transcriptionReview,
      tested: true,
    }),
  });
}

test("MapGuess copy follows the frozen production language and uses its original mark", () => {
  assert.equal(getMapGuessCopy(MAPGUESS_COPY_IDS.corruptHeadline), "THE FASTEST ROUTE IS ALWAYS THE RIGHT ROUTE");
  assert.equal(getMapGuessCopy(MAPGUESS_COPY_IDS.repairHeadline), "THE RIGHT ROUTE DEPENDS ON THE GOAL");
  assert.equal(getMapGuessCopy(MAPGUESS_COPY_IDS.midpointAmy), "The road did not move. The target did.");
  assert.equal(getMapGuessCopy(MAPGUESS_COPY_IDS.secureStatus), "DESTINATION LOCKED");
  assert.match(getMapGuessCopy(MAPGUESS_COPY_IDS.secureDenial), /DESTINATION LOCKED - USER CHOICE REQUIRED/u);
  assert.match(MAPGUESS_ASSETS[MAPGUESS_ASSET_IDS.mark], /mapguess-mark\.svg/u);
  assert.throws(() => getMapGuessCopy("mapguess.unknown"), RangeError);
});

test("the provisional MapGuess fixture uses only fictional grid data and preserves the moving-target proof", () => {
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  assertDeepFrozen(fixture);
  assertProvisionalRecords(fixture);
  assert.equal(fixture.notice, MAPGUESS_PROVISIONAL_NOTICE);
  assert.equal(fixture.coordinateSystem.type, "fictional-grid");
  assert.equal(fixture.coordinateSystem.usesRealLocation, false);
  assert.equal(fixture.coordinateSystem.externalTileService, null);
  assert.equal(fixture.start.coordinate.grid, "B8");
  assert.equal(fixture.destination.coordinate.grid, "H4");
  assert.equal(fixture.movedDestination.coordinate.grid, "D7");
  assert.equal(fixture.midpointProof.roadGeometryChanged, false);
  assert.equal(fixture.midpointProof.destinationCoordinatesChanged, true);
  assert.equal(fixture.midpointProof.before.destinationId, fixture.destination.id);
  assert.equal(fixture.midpointProof.after.destinationId, fixture.movedDestination.id);
  assert.equal(fixture.landmarks.length, 3);
  assert.equal(new Set(fixture.landmarks.map(({ id }) => id)).size, 3);
  assert.match(fixture.mapMetadata.scale.display, /200 METERS/u);
  assert.match(fixture.mapMetadata.source.displayName, /fictional/iu);
  assert.ok(fixture.tiles.length >= 4);
  assert.ok(fixture.terrain.length >= 2);
  assert.ok(fixture.water.length >= 1);
  assert.ok(fixture.roads.length >= 4);
  assert.ok(fixture.routeSegments.some(({ corrupted }) => corrupted));
  assert.ok(fixture.routeSegments.some(({ corrupted }) => !corrupted));
  assert.doesNotMatch(JSON.stringify(fixture), /https?:|latitude|longitude|mapquest|google maps|openstreetmap/iu);
});

test("all four route goals keep one locked destination and expose honest tradeoffs, ETAs, and directions", () => {
  const variants = MAPGUESS_PROVISIONAL_FIXTURE.routeVariants;
  assert.deepEqual(
    new Set(variants.map(({ goalId }) => goalId)),
    new Set(Object.values(MAPGUESS_ROUTE_GOALS)),
  );
  assert.equal(variants.length, 4);
  assert.equal(new Set(variants.map(({ destinationId }) => destinationId)).size, 1);
  assert.equal(new Set(variants.map(({ destinationCoordinate }) => destinationCoordinate.grid)).size, 1);
  assert.equal(variants[0].destinationId, MAPGUESS_PROVISIONAL_FIXTURE.destination.id);
  for (const variant of variants) {
    assert.match(variant.label, /^(FASTEST|SAFEST|SCENIC|ACCESSIBLE)$/u);
    assert.ok(variant.etaMinutes > 2);
    assert.match(variant.etaDisplay, /minutes$/u);
    assert.ok(variant.tradeoff.length > 20);
    assert.ok(variant.directions.length >= 3);
    assert.ok(variant.directions.every(({ accessibleSummary, instruction }) => accessibleSummary && instruction));
  }
});

test("fixture units, process, blocked target, and slot-ten evidence stay explicitly noncanonical", () => {
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  assert.deepEqual(
    fixture.unitAssignments.map(({ unitId }) => unitId),
    [
      "tiles_names",
      "scale_date",
      "terrain",
      "route_segments",
      "destination_inspector",
      "landmark_1",
      "landmarks_2_3",
      "goal_route_lock",
    ],
  );
  assert.equal(fixture.process.displayName, "ROUTE AUTO-FIX AI");
  assert.equal(fixture.process.upstreamServiceId, "ai_repair_service");
  assert.match(fixture.process.id, /provisional/u);
  assert.equal(fixture.blockedWrite.actorId, fixture.process.id);
  assert.equal(fixture.blockedWrite.targetId, fixture.destination.id);
  assert.match(fixture.blockedWrite.id, /provisional-test/u);
  assert.equal(fixture.evidence.slot, 10);
  assert.match(fixture.evidence.evidenceId, /provisional-test/u);
  assert.match(fixture.evidence.filename, /PROVISIONAL/u);
  assert.match(fixture.evidence.writerFingerprint, /provisional.*pending-designer/u);
});

test("A Map Is Not a Photograph is a structured NOAA candidate that fails closed", () => {
  const passage = A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE;
  assertDeepFrozen(passage);
  assert.equal(passage.availability, "candidate");
  assert.equal(passage.id, MAPGUESS_DECK_A_IDS[0]);
  assert.equal(passage.paragraphs.length, 5);
  assert.match(passage.source.attribution, /NOAA/u);
  assert.match(passage.source.sourceUrl, /oceanservice\.noaa\.gov/u);
  assert.equal(passage.rights.basis, "public-domain");
  assert.match(passage.rights.jurisdiction, /pending/iu);
  assert.equal(passage.source.frozenRevision, "NOAA page last updated 2026-06-22; verified 2026-07-12");
  assert.equal(passage.transcriptionReview.tested, false);
  assert.ok(Object.values(passage.review).every((value) => /candidate|pending/u.test(value)));
  assert.equal(isSelectablePassage(passage), false);
});

test("MapGuess owns an eight-record first-run deck plus replay deck and reports the eight-reading gate", () => {
  assert.equal(MAPGUESS_DECK_A_IDS.length, 8);
  assert.equal(MAPGUESS_DECK_B_IDS.length, 5);
  assert.equal(new Set([...MAPGUESS_DECK_A_IDS, ...MAPGUESS_DECK_B_IDS]).size, 13);
  assert.deepEqual(MAPGUESS_CONTENT_READINESS, {
    deckACount: 8,
    deckBCount: 5,
    firstRunShortfall: 0,
    plannedCount: 13,
    requiredFirstRun: 8,
    structuredCandidateCount: 8,
  });

  const gated = selectNextMapGuessPassage({ completedPassageIds: [] });
  assert.equal(gated.passage, null);
  assert.equal(gated.reason, "no-selectable-passages");
  assert.equal(gated.selectableCount, 0);
  assert.equal(gated.plannedCount, 13);
  assert.equal(gated.requiredFirstRun, 8);
  assert.equal(gated.firstRunShortfall, 0);

  const approvedA = approvedRecord(MAPGUESS_DECK_A_IDS[1]);
  const approvedB = approvedRecord(MAPGUESS_DECK_B_IDS[0]);
  const first = selectNextMapGuessPassage(
    { completedPassageIds: [] },
    { catalog: [approvedB, approvedA] },
  );
  assert.equal(first.passage.id, approvedA.id);

  const exhausted = selectNextMapGuessPassage(
    { completedPassageIds: [approvedA.id] },
    { allowRepeat: true, catalog: [approvedB, approvedA] },
  );
  assert.equal(exhausted.passage, null);
  assert.equal(exhausted.reason, "no-unseen-passages");
});

test("MapGuess exposes eight candidate playtests without promoting content", () => {
  const first = selectNextMapGuessPassage({ completedPassageIds: [] }, { lane: "playtest" });
  assert.equal(first.lane, "playtest");
  assert.equal(first.canonicalEligible, false);
  assert.equal(first.reviewPending, true);
  assert.equal(first.selectableCount, 8);
  assert.equal(first.requiredFirstRun, 8);
  assert.equal(first.passage?.id, MAPGUESS_DECK_A_IDS[0]);
  assert.equal(first.passage?.availability, "candidate");

  const next = selectNextMapGuessPassage(
    { completedPassageIds: [first.passage.id] },
    { lane: "playtest" },
  );
  assert.equal(next.passage?.id, MAPGUESS_DECK_A_IDS[1]);
  assert.equal(next.canonicalEligible, false);
});
