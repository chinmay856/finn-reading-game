import assert from "node:assert/strict";
import test from "node:test";

import { MAPGUESS_PROVISIONAL_FIXTURE } from "../apps/internet-recovery/mapguess-copy.js";
import {
  MAPGUESS_ANCHOR_UNITS,
  MAPGUESS_CAMPAIGN_UNITS,
  MAPGUESS_REBUILD_UNITS,
  MAPGUESS_ROUTE_GOALS,
} from "../apps/internet-recovery/mapguess-rules.js";
import {
  MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD,
  MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
  normalizeMapGuessState,
} from "../apps/internet-recovery/mapguess-state.js";
import { getMapGuessCampaignView } from "../apps/internet-recovery/mapguess-view.js";

function stateAt(completedCount, details = {}) {
  return normalizeMapGuessState({
    completedUnitIds: MAPGUESS_CAMPAIGN_UNITS
      .slice(0, completedCount)
      .map(({ unitId }) => unitId),
    midpointAcknowledged: completedCount > MAPGUESS_REBUILD_UNITS.length,
    ...details,
  });
}

function semanticView(view) {
  const { motion, ...semantic } = view;
  return semantic;
}

test("the corrupted view hides unrepaired map truth and uses an exact 5 plus 3 unit ledger", () => {
  const view = getMapGuessCampaignView(stateAt(0));

  assert.equal(view.progress.kind, "unit-ledger");
  assert.equal(view.progress.rebuildCompletedCount, 0);
  assert.equal(view.progress.rebuildTotal, 5);
  assert.equal(view.progress.anchorCompletedCount, 0);
  assert.equal(view.progress.anchorTotal, 3);
  assert.equal(view.progress.totalUnitCount, 8);
  assert.doesNotMatch(JSON.stringify(view), /%|percent/iu);

  assert.ok(view.tiles.every(({ grid, placeNames, restored }) => !restored && grid === null && placeNames.length === 0));
  assert.ok(view.placeNames.every(({ visible }) => !visible));
  assert.equal(view.scale.visible, false);
  assert.equal(view.mapDate.visible, false);
  assert.equal(view.source.visible, false);
  assert.ok(view.terrain.every(({ visible }) => !visible));
  assert.ok(view.water.every(({ visible }) => !visible));
  assert.ok(view.landmarks.every(({ anchorState }) => anchorState === "hidden"));
  assert.equal(view.destinationComparison.visible, false);
  assert.equal(view.destinationComparison.original.coordinate.grid, null);
  assert.equal(view.destinationComparison.moved.coordinate.grid, null);
  assert.equal(view.directions.honest, false);
  assert.equal(view.directions.steps.length, 3);
  assert.deepEqual(
    view.routeSegments.filter(({ visible }) => visible).map(({ corrupted }) => corrupted),
    [true],
  );
});

test("each rebuild unit reveals only its authored map layer", () => {
  const tileView = getMapGuessCampaignView(stateAt(1));
  assert.equal(tileView.truth.tilesNamesRestored, true);
  assert.ok(tileView.tiles.every(({ restored }) => restored));
  assert.ok(tileView.placeNames.every(({ visible }) => visible));
  assert.ok(tileView.placeNames.some(({ label }) => label === "Glasswater Archive"));
  const tileRepairText = [
    ...tileView.tiles.map(({ accessibleSummary }) => accessibleSummary),
    ...tileView.placeNames.map(({ accessibleSummary }) => accessibleSummary),
  ].join(" ");
  assert.doesNotMatch(tileRepairText, /\b(?:destination|sponsored|landmark|canal|water)\b/iu);
  assert.doesNotMatch(
    tileView.tiles.flatMap(({ restoredFeatureIds }) => restoredFeatureIds).join(" "),
    /\b(?:destination|sponsored|landmark|water)\b/iu,
  );
  assert.equal(tileView.scale.visible, false);

  const metadataView = getMapGuessCampaignView(stateAt(2));
  assert.equal(metadataView.truth.scaleDateRestored, true);
  assert.equal(metadataView.scale.display, "1 GRID CELL = 200 METERS");
  assert.equal(metadataView.mapDate.iso, "2026-04-18");
  assert.equal(metadataView.source.visible, true);
  assert.ok(metadataView.terrain.every(({ visible }) => !visible));

  const terrainView = getMapGuessCampaignView(stateAt(3));
  assert.equal(terrainView.truth.terrainRestored, true);
  assert.ok(terrainView.terrain.every(({ visible, cells }) => visible && cells.length > 0));
  assert.ok(terrainView.water.every(({ visible, cells }) => visible && cells.length > 0));
  assert.match(terrainView.tiles.map(({ accessibleSummary }) => accessibleSummary).join(" "), /water|canal/iu);
  assert.doesNotMatch(
    terrainView.tiles.map(({ accessibleSummary }) => accessibleSummary).join(" "),
    /\b(?:destination|sponsored|landmark)\b/iu,
  );
  assert.equal(terrainView.truth.routeSegmentsRestored, false);

  const routeView = getMapGuessCampaignView(stateAt(4));
  assert.equal(routeView.truth.routeSegmentsRestored, true);
  assert.ok(routeView.routeSegments.filter(({ visible }) => visible).every(({ corrupted }) => !corrupted));
  assert.equal(routeView.routeSegments.find(({ corrupted }) => corrupted).visible, false);
  assert.equal(routeView.directions.available, false);
  assert.equal(routeView.directions.tradeoff, "SELECT A ROUTE GOAL TO COMPARE TRADEOFFS");

  const inspectorView = getMapGuessCampaignView(stateAt(5));
  assert.equal(inspectorView.truth.destinationInspectorRestored, true);
  assert.ok(inspectorView.landmarks.every(({ revealed }) => revealed));
  assert.match(
    inspectorView.tiles.map(({ accessibleSummary }) => accessibleSummary).join(" "),
    /destination|sponsored|landmark/iu,
  );
  assert.equal(inspectorView.destinationComparison.visible, true);
  assert.equal(inspectorView.midpoint.discovered, true);
  assert.deepEqual(inspectorView.midpoint.preservedUnitIds, MAPGUESS_REBUILD_UNITS.map(({ unitId }) => unitId));
});

test("Moving Target keeps road geometry fixed and exposes the exact coordinate proof", () => {
  const before = getMapGuessCampaignView(stateAt(0));
  const midpoint = getMapGuessCampaignView(stateAt(5));

  assert.equal(midpoint.stateId, "mapguess_moving_target");
  assert.equal(midpoint.midpoint.visible, true);
  assert.equal(midpoint.midpoint.actionRequired, true);
  assert.equal(midpoint.destinationComparison.before.coordinate.grid, "H4");
  assert.equal(midpoint.destinationComparison.after.coordinate.grid, "D7");
  assert.equal(midpoint.destinationComparison.currentLocation, "moved");
  assert.equal(midpoint.destinationComparison.roadGeometryChanged, false);
  assert.equal(midpoint.destinationComparison.destinationCoordinatesChanged, true);
  assert.deepEqual(midpoint.destinationComparison.proofLines, [
    "ROAD GEOMETRY CHANGED: NO",
    "DESTINATION COORDINATES CHANGED: YES",
    "ETA TARGET: 2 MINUTES FOREVER",
  ]);
  assert.deepEqual(
    before.fixedRoadGeometry.roads.map(({ geometryPoints }) => geometryPoints),
    midpoint.fixedRoadGeometry.roads.map(({ geometryPoints }) => geometryPoints),
  );
  assert.equal(before.fixedRoadGeometry.geometryId, midpoint.fixedRoadGeometry.geometryId);
});

test("landmark anchors stage one then three, and the final reading waits for a goal", () => {
  const acknowledged = getMapGuessCampaignView(stateAt(5, { midpointAcknowledged: true }));
  assert.equal(acknowledged.midpoint.visible, false);
  assert.equal(acknowledged.goals.selectionAvailable, true);
  assert.equal(acknowledged.goals.goalRequired, false);

  const firstAnchor = getMapGuessCampaignView(stateAt(6));
  assert.deepEqual(firstAnchor.landmarks.map(({ anchored }) => anchored), [true, false, false]);
  assert.equal(firstAnchor.progress.anchorCompletedCount, 1);

  const triangulated = getMapGuessCampaignView(stateAt(7));
  assert.deepEqual(triangulated.landmarks.map(({ anchored }) => anchored), [true, true, true]);
  assert.equal(triangulated.progress.anchorCompletedCount, 2);
  assert.equal(triangulated.goals.goalRequired, true);
  assert.equal(triangulated.goals.selectedGoalId, null);
  assert.equal(triangulated.secured, false);
});

test("all four route goals are valid semantic choices with one fixed destination", () => {
  const destinations = new Set();
  const estimates = new Set();

  for (const routeGoal of MAPGUESS_ROUTE_GOALS) {
    const view = getMapGuessCampaignView(stateAt(7, { routeGoal }));
    const selected = view.goals.options.filter(({ selected }) => selected);
    assert.equal(view.goals.options.length, 4);
    assert.equal(selected.length, 1);
    assert.equal(selected[0].goalId, routeGoal);
    assert.equal(selected[0].enabled, true);
    assert.equal(view.goals.goalRequired, false);
    assert.equal(view.directions.honest, true);
    assert.equal(view.directions.goalId, routeGoal);
    assert.equal(view.directions.steps.length, 3);
    assert.ok(view.directions.steps.every(({ accessibleSummary, instruction }) => accessibleSummary && instruction));
    assert.ok(view.directions.tradeoff.length > 20);
    assert.ok(view.routeSegments.some(({ selectedForGoal, visible }) => selectedForGoal && visible));
    destinations.add(view.directions.destinationId);
    estimates.add(view.directions.etaDisplay);
  }

  assert.deepEqual([...destinations], [MAPGUESS_PROVISIONAL_FIXTURE.destination.id]);
  assert.equal(estimates.size, 4);
});

test("secured payoff permanently exposes only provisional evidence and the denied pin move", () => {
  const securedState = stateAt(8, { routeGoal: "scenic" });
  const view = getMapGuessCampaignView(securedState);

  assert.equal(view.secured, true);
  assert.equal(view.stateId, "mapguess_secured");
  assert.equal(view.goals.locked, true);
  assert.equal(view.goals.canChange, false);
  assert.equal(view.goals.selectedGoalId, "scenic");
  assert.equal(view.destinationComparison.currentLocation, "original");
  assert.equal(view.destinationComparison.original.locked, true);
  assert.equal(view.sponsoredStop.blockedAsDestination, true);

  assert.equal(view.evidence.id, MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.id);
  assert.equal(view.evidence.canonical, false);
  assert.equal(view.evidence.provisional, true);
  assert.equal(view.evidence.testOnly, true);
  assert.equal(view.evidence.slot, 10);
  assert.equal(view.evidence.routeGoal, "scenic");
  assert.equal(view.blockedWrite.id, MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD.id);
  assert.equal(view.blockedWrite.fixtureAttempt.targetDestinationId, MAPGUESS_PROVISIONAL_FIXTURE.destination.id);
  assert.equal(view.securedPayoff.canonical, false);
  assert.equal(view.securedPayoff.testOnly, true);

  const normalizedAgain = normalizeMapGuessState({
    ...securedState,
    blockedWriteId: null,
    evidenceId: null,
    secured: false,
  });
  const resumedView = getMapGuessCampaignView(normalizedAgain);
  assert.equal(resumedView.secured, true);
  assert.equal(resumedView.evidence.id, MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.id);
  assert.equal(resumedView.blockedWrite.id, MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD.id);
});

test("the view exposes semantic original geometry without external maps or real locations", () => {
  const view = getMapGuessCampaignView(stateAt(7, { routeGoal: "accessible" }));

  assert.equal(view.coordinateSystem.type, "fictional-grid");
  assert.equal(view.coordinateSystem.externalTileService, null);
  assert.equal(view.coordinateSystem.usesRealLocation, false);
  assert.equal(view.coordinateSystem.columns.length, 10);
  assert.equal(view.coordinateSystem.rows, 10);
  assert.equal(view.tiles.length, 4);
  assert.equal(view.fixedRoadGeometry.roads.length, 4);
  assert.equal(view.routeSegments.length, 5);
  assert.equal(view.landmarks.length, 3);
  assert.ok(view.tiles.every(({ accessibleSummary, id }) => accessibleSummary && id));
  assert.ok(view.fixedRoadGeometry.roads.every(({ accessibleSummary, geometryPoints, id }) => accessibleSummary && geometryPoints.length > 1 && id));
  assert.ok(view.landmarks.every(({ accessibleSummary, coordinate, id }) => accessibleSummary && coordinate.visible && id));
  assert.ok(view.terrain.every(({ accessibleSummary, cells }) => accessibleSummary && cells.length > 0));
  assert.ok(view.water.every(({ accessibleSummary, cells }) => accessibleSummary && cells.length > 0));
  assert.ok(view.sponsoredStop.accessibleSummary.length > 30);
  assert.ok(view.source.accessibleSummary.length > 30);
  assert.equal(view.fixture.canonical, false);
  assert.match(view.fixture.notice, /NOT CANONICAL/u);
});

test("reduced motion changes only motion metadata and uses coordinate cards", () => {
  for (let completedCount = 0; completedCount <= MAPGUESS_CAMPAIGN_UNITS.length; completedCount += 1) {
    const details = completedCount === MAPGUESS_CAMPAIGN_UNITS.length
      ? { routeGoal: "fastest" }
      : completedCount === MAPGUESS_CAMPAIGN_UNITS.length - 1
        ? { routeGoal: "safest" }
        : {};
    const state = stateAt(completedCount, details);
    const animated = getMapGuessCampaignView(state);
    const reduced = getMapGuessCampaignView(state, { reducedMotion: true });

    assert.deepEqual(semanticView(reduced), semanticView(animated));
    assert.equal(reduced.motion.mode, "state-swap");
    assert.equal(reduced.motion.destinationMoveMode, "before-after-coordinate-cards");
    assert.equal(reduced.motion.pinMoveMs, 0);
    assert.equal(reduced.motion.routeDrawMs, 0);
    assert.equal(reduced.motion.mapLayerRevealMs, 0);
    assert.equal(reduced.motion.landmarkAnchorMs, 0);
    assert.equal(reduced.motion.usesTechnoStill, true);
  }
});

test("the exact progress contract never becomes a generic percentage", () => {
  for (let completedCount = 0; completedCount <= MAPGUESS_CAMPAIGN_UNITS.length; completedCount += 1) {
    const details = completedCount === MAPGUESS_CAMPAIGN_UNITS.length
      ? { routeGoal: "accessible" }
      : {};
    const progress = getMapGuessCampaignView(stateAt(completedCount, details)).progress;
    assert.equal(progress.rebuildTotal, MAPGUESS_REBUILD_UNITS.length);
    assert.equal(progress.anchorTotal, MAPGUESS_ANCHOR_UNITS.length);
    assert.equal(progress.completedUnitCount, completedCount);
    assert.doesNotMatch(JSON.stringify(progress), /%|percent/iu);
    assert.equal(Object.hasOwn(progress, "percent"), false);
    assert.equal(Object.hasOwn(progress, "percentage"), false);
  }
});
