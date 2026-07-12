import {
  MAPGUESS_COPY,
  MAPGUESS_COPY_IDS,
  MAPGUESS_PROVISIONAL_FIXTURE,
} from "./mapguess-copy.js";
import {
  MAPGUESS_ANCHOR_UNITS,
  MAPGUESS_CAMPAIGN_UNITS,
  MAPGUESS_REBUILD_UNITS,
  MAPGUESS_ROUTE_GOALS,
} from "./mapguess-rules.js";
import {
  MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD,
  MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
  normalizeMapGuessState,
} from "./mapguess-state.js";

const CORRUPTED_DIRECTION_COPY_IDS = Object.freeze([
  MAPGUESS_COPY_IDS.corruptModule1,
  MAPGUESS_COPY_IDS.corruptModule2,
  MAPGUESS_COPY_IDS.corruptModule3,
]);

function freezeDeep(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
}

function copy(copyId) {
  return MAPGUESS_COPY[copyId];
}

function recordsForUnit(unitId) {
  return new Set(
    MAPGUESS_PROVISIONAL_FIXTURE.unitAssignments
      .find((assignment) => assignment.unitId === unitId)
      ?.recordIds ?? [],
  );
}

function gridPoint(grid) {
  const match = /^([A-Z])(\d{1,2})$/u.exec(grid ?? "");
  if (!match) return null;
  const column = MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.columns.indexOf(match[1]) + 1;
  const row = Number(match[2]);
  return column > 0 && Number.isInteger(row)
    ? { column, row }
    : null;
}

function coordinateView(coordinate, visible) {
  if (!visible || !coordinate) {
    return {
      accessibleSummary: "Coordinate hidden until the destination inspector is restored.",
      column: null,
      grid: null,
      row: null,
      visible: false,
    };
  }
  return {
    accessibleSummary: coordinate.accessibleSummary,
    column: coordinate.column,
    grid: coordinate.grid,
    row: coordinate.row,
    visible: true,
  };
}

function buildTiles({ destinationInspectorRestored, terrainRestored, tilesNamesRestored }) {
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  const placeNamesByGrid = new Map();
  for (const place of fixture.placeNames) {
    const names = placeNamesByGrid.get(place.coordinate.grid) ?? [];
    names.push(place);
    placeNamesByGrid.set(place.coordinate.grid, names);
  }
  const terrainCells = new Map();
  for (const record of [...fixture.terrain, ...fixture.water]) {
    for (const cell of record.cells) {
      const records = terrainCells.get(cell) ?? [];
      records.push(record);
      terrainCells.set(cell, records);
    }
  }
  const inspectorFeatureIds = new Set([
    fixture.destination.id,
    fixture.movedDestination.id,
    ...fixture.landmarks.map(({ id }) => id),
  ]);
  const terrainFeatureIds = new Set([
    ...fixture.terrain.map(({ id }) => id),
    ...fixture.water.map(({ id }) => id),
  ]);

  return fixture.tiles.map((tile, index) => {
    const names = placeNamesByGrid.get(tile.grid) ?? [];
    const terrain = terrainCells.get(tile.grid) ?? [];
    const restoredFeatureIds = tile.restoredFeatures.filter((featureId) => {
      if (inspectorFeatureIds.has(featureId)) return destinationInspectorRestored;
      if (terrainFeatureIds.has(featureId)) return terrainRestored;
      return tilesNamesRestored;
    });
    const readableSummary = [
      `Fictional map tile ${tile.grid} is readable.`,
      names.length ? `Place names: ${names.map(({ label }) => label).join(", ")}.` : null,
      terrainRestored && terrain.length
        ? `Terrain and water: ${terrain.map(({ label }) => label).join(", ")}.`
        : null,
    ].filter(Boolean).join(" ");
    return {
      accessibleSummary: tilesNamesRestored
        ? destinationInspectorRestored
          ? tile.accessibleSummary
          : readableSummary
        : `Map tile ${index + 1} is present, but its grid label and place names are unreadable.`,
      grid: tilesNamesRestored ? tile.grid : null,
      id: tile.id,
      layoutIndex: index,
      placeNames: tilesNamesRestored
        ? names.map(({ id, label }) => ({ id, label }))
        : [],
      provisional: true,
      restored: tilesNamesRestored,
      restoredFeatureIds: tilesNamesRestored ? restoredFeatureIds : [],
      terrain: terrainRestored
        ? terrain.map(({ id, kind, label }) => ({ id, kind, label }))
        : [],
      terrainVisible: terrainRestored,
    };
  });
}

function buildPlaceNames(visible, { destinationInspectorRestored }) {
  return MAPGUESS_PROVISIONAL_FIXTURE.placeNames.map((place, index) => ({
    accessibleSummary: visible
      ? destinationInspectorRestored
        ? place.accessibleSummary
        : `${place.label} is labeled at fictional grid ${place.coordinate.grid}.`
      : `Place-name record ${index + 1} remains unreadable.`,
    coordinate: coordinateView(place.coordinate, visible),
    id: place.id,
    label: visible ? place.label : "PLACE NAME UNREADABLE",
    provisional: true,
    visible,
  }));
}

function buildRoadGeometry({ labelsVisible }) {
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  return {
    accessibleSummary: "The fictional road geometry is fixed throughout the Moving Target incident; labels return separately from the road shapes.",
    changedAtMidpoint: false,
    geometryId: fixture.midpointProof.routeGeometryId,
    roads: fixture.roads.map((road, index) => ({
      accessibleSummary: labelsVisible
        ? road.accessibleSummary
        : `Unlabeled road geometry ${index + 1}; its shape remains fixed.`,
      geometryPoints: road.gridPath.map(gridPoint).filter(Boolean),
      gridPath: labelsVisible ? [...road.gridPath] : [],
      id: road.id,
      label: labelsVisible ? road.label : "ROAD LABEL HIDDEN",
      labelVisible: labelsVisible,
      provisional: true,
    })),
  };
}

function buildRouteSegments({ goalRouteLocked, routeGoal, routeSegmentsRestored }) {
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  const baseSegmentIds = recordsForUnit("route_segments");
  const selectedVariant = fixture.routeVariants.find(({ goalId }) => goalId === routeGoal) ?? null;
  const selectedSegmentIds = new Set(selectedVariant?.routeSegmentIds ?? []);

  return fixture.routeSegments.map((segment, index) => {
    const repairedBaseSegment = !segment.corrupted && baseSegmentIds.has(segment.id);
    const selectedGoalSegment = selectedSegmentIds.has(segment.id);
    const displayBaseSegment = repairedBaseSegment && (!goalRouteLocked || selectedGoalSegment);
    const visible = segment.corrupted
      ? !routeSegmentsRestored
      : routeSegmentsRestored && (displayBaseSegment || selectedGoalSegment);
    const connected = routeSegmentsRestored && !segment.corrupted;
    return {
      accessibleSummary: visible
        ? segment.accessibleSummary
        : `Route segment ${index + 1} remains unlinked from the visible road geometry.`,
      connected,
      corrupted: segment.corrupted,
      from: visible ? segment.from : null,
      fromPoint: visible ? gridPoint(segment.from) : null,
      id: segment.id,
      label: visible ? segment.label : "ROUTE SEGMENT UNLINKED",
      provisional: true,
      selectedForGoal: selectedGoalSegment,
      to: visible ? segment.to : null,
      toPoint: visible ? gridPoint(segment.to) : null,
      verified: goalRouteLocked ? selectedGoalSegment : repairedBaseSegment && connected,
      visible,
    };
  });
}

function buildMetadata({ scaleDateRestored, terrainRestored }) {
  const { mapMetadata, terrain, water } = MAPGUESS_PROVISIONAL_FIXTURE;
  return {
    mapDate: {
      accessibleSummary: scaleDateRestored
        ? `Map date ${mapMetadata.dateDisplay}.`
        : "Map date hidden until the scale and date repair is saved.",
      display: scaleDateRestored ? mapMetadata.dateDisplay : "DATE HIDDEN",
      iso: scaleDateRestored ? mapMetadata.date : null,
      visible: scaleDateRestored,
    },
    scale: {
      accessibleSummary: scaleDateRestored
        ? mapMetadata.scale.display
        : "Map scale hidden until the scale and date repair is saved.",
      display: scaleDateRestored ? mapMetadata.scale.display : "SCALE HIDDEN",
      id: mapMetadata.scale.id,
      metersPerGridCell: scaleDateRestored ? mapMetadata.scale.metersPerGridCell : null,
      visible: scaleDateRestored,
    },
    source: {
      accessibleSummary: scaleDateRestored
        ? mapMetadata.source.accessibleSummary
        : "Map source hidden until the metadata repair is saved.",
      displayName: scaleDateRestored ? mapMetadata.source.displayName : "SOURCE HIDDEN",
      id: mapMetadata.source.id,
      sourceType: scaleDateRestored ? mapMetadata.source.sourceType : null,
      visible: scaleDateRestored,
    },
    terrain: terrain.map((record, index) => ({
      accessibleSummary: terrainRestored
        ? record.accessibleSummary
        : `Terrain record ${index + 1} remains hidden.`,
      cells: terrainRestored ? [...record.cells] : [],
      id: record.id,
      kind: terrainRestored ? record.kind : null,
      label: terrainRestored ? record.label : "TERRAIN HIDDEN",
      provisional: true,
      visible: terrainRestored,
    })),
    water: water.map((record, index) => ({
      accessibleSummary: terrainRestored
        ? record.accessibleSummary
        : `Water-boundary record ${index + 1} remains hidden.`,
      cells: terrainRestored ? [...record.cells] : [],
      id: record.id,
      kind: terrainRestored ? record.kind : null,
      label: terrainRestored ? record.label : "WATER BOUNDARY HIDDEN",
      provisional: true,
      visible: terrainRestored,
    })),
  };
}

function buildDestinationComparison({ destinationInspectorRestored, secured, state }) {
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  const proof = fixture.midpointProof;
  const comparisonVisible = state.midpointDiscovered && destinationInspectorRestored;
  const original = {
    accessibleSummary: destinationInspectorRestored
      ? fixture.destination.accessibleSummary
      : "The requested destination remains hidden until the destination inspector is restored.",
    coordinate: coordinateView(fixture.destination.coordinate, destinationInspectorRestored),
    displayName: destinationInspectorRestored ? fixture.destination.displayName : "DESTINATION HIDDEN",
    id: fixture.destination.id,
    locked: secured,
    requested: true,
    visible: destinationInspectorRestored,
  };
  const moved = {
    accessibleSummary: comparisonVisible
      ? fixture.movedDestination.accessibleSummary
      : "The moved destination is not disclosed before Moving Target is proved.",
    coordinate: coordinateView(fixture.movedDestination.coordinate, comparisonVisible),
    displayName: comparisonVisible ? fixture.movedDestination.displayName : "MOVED TARGET HIDDEN",
    id: fixture.movedDestination.id,
    locked: false,
    requested: false,
    sponsorDisclosure: comparisonVisible ? fixture.movedDestination.sponsorDisclosure : null,
    visible: comparisonVisible,
  };

  return {
    accessibleSummary: comparisonVisible ? proof.accessibleSummary : "Destination comparison unavailable.",
    after: comparisonVisible
      ? {
          coordinate: coordinateView(proof.after.destinationCoordinate, true),
          destinationId: proof.after.destinationId,
          etaDisplay: proof.after.etaDisplay,
        }
      : null,
    before: comparisonVisible
      ? {
          coordinate: coordinateView(proof.before.destinationCoordinate, true),
          destinationId: proof.before.destinationId,
          etaDisplay: proof.before.etaDisplay,
        }
      : null,
    currentLocation: !comparisonVisible ? "undisclosed" : secured ? "original" : "moved",
    destinationCoordinatesChanged: comparisonVisible ? proof.destinationCoordinatesChanged : null,
    moved,
    original,
    proofLines: comparisonVisible
      ? [
          copy(MAPGUESS_COPY_IDS.midpointProofRoad),
          copy(MAPGUESS_COPY_IDS.midpointProofDestination),
          copy(MAPGUESS_COPY_IDS.midpointProofEta),
        ]
      : [],
    roadGeometryChanged: comparisonVisible ? proof.roadGeometryChanged : null,
    routeGeometryId: proof.routeGeometryId,
    visible: comparisonVisible,
  };
}

function buildLandmarks({ destinationInspectorRestored, landmark1Anchored, landmarks23Anchored }) {
  return MAPGUESS_PROVISIONAL_FIXTURE.landmarks.map((landmark, index) => {
    const anchored = index === 0 ? landmark1Anchored : landmarks23Anchored;
    return {
      accessibleSummary: destinationInspectorRestored
        ? `${landmark.accessibleSummary} ${anchored ? "Anchor verified." : "Anchor pending."}`
        : `Landmark ${index + 1} remains hidden until the destination inspector is restored.`,
      anchorOrdinal: index + 1,
      anchorState: !destinationInspectorRestored ? "hidden" : anchored ? "anchored" : "revealed",
      anchored,
      coordinate: coordinateView(landmark.coordinate, destinationInspectorRestored),
      displayName: destinationInspectorRestored ? landmark.displayName : `LANDMARK ${index + 1} HIDDEN`,
      id: landmark.id,
      provisional: true,
      revealed: destinationInspectorRestored,
    };
  });
}

function buildGoals(state, { anchorCompletedCount, midpointAcknowledged }) {
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  const selectionAvailable = midpointAcknowledged && !state.routeGoalLocked;
  const goalRequired = midpointAcknowledged
    && anchorCompletedCount >= MAPGUESS_ANCHOR_UNITS.length - 1
    && !state.routeGoal;
  const variantsByGoal = new Map(fixture.routeVariants.map((variant) => [variant.goalId, variant]));
  const options = MAPGUESS_ROUTE_GOALS.map((goalId) => {
    const variant = variantsByGoal.get(goalId);
    const detailsVisible = midpointAcknowledged;
    return {
      accessibleSummary: detailsVisible
        ? variant.accessibleSummary
        : `${variant.label} route goal; tradeoff available after Moving Target is acknowledged.`,
      destinationCoordinate: coordinateView(variant.destinationCoordinate, detailsVisible),
      destinationId: detailsVisible ? variant.destinationId : null,
      enabled: selectionAvailable,
      etaDisplay: detailsVisible ? variant.etaDisplay : null,
      goalId,
      label: variant.label,
      locked: state.routeGoalLocked && state.routeGoal === goalId,
      provisional: true,
      selected: state.routeGoal === goalId,
      tradeoff: detailsVisible ? variant.tradeoff : "TRADEOFF AVAILABLE AFTER MOVING TARGET",
    };
  });

  return {
    canChange: selectionAvailable,
    goalRequired,
    locked: state.routeGoalLocked,
    options,
    selectedGoalId: state.routeGoal,
    selectionAvailable,
  };
}

function buildDirections(state, goals, { routeSegmentsRestored }) {
  const variant = MAPGUESS_PROVISIONAL_FIXTURE.routeVariants
    .find(({ goalId }) => goalId === state.routeGoal) ?? null;
  if (variant && (goals.selectionAvailable || goals.locked)) {
    return {
      accessibleSummary: variant.accessibleSummary,
      available: true,
      destinationId: variant.destinationId,
      etaBasis: variant.etaBasis,
      etaDisplay: variant.etaDisplay,
      goalId: variant.goalId,
      honest: true,
      steps: variant.directions.map((direction) => ({ ...direction })),
      tradeoff: variant.tradeoff,
    };
  }
  if (routeSegmentsRestored) {
    return {
      accessibleSummary: "The repaired road segments are available, but an honest direction list requires a route goal.",
      available: false,
      destinationId: MAPGUESS_PROVISIONAL_FIXTURE.destination.id,
      etaBasis: null,
      etaDisplay: null,
      goalId: null,
      honest: false,
      steps: [],
      tradeoff: "SELECT A ROUTE GOAL TO COMPARE TRADEOFFS",
    };
  }
  return {
    accessibleSummary: "Corrupted directions protect a two-minute claim by crossing water and changing the destination.",
    available: true,
    destinationId: null,
    etaBasis: "Corrupted proxy target; not a real route estimate.",
    etaDisplay: "2 minutes",
    goalId: null,
    honest: false,
    steps: CORRUPTED_DIRECTION_COPY_IDS.map((copyId, index) => ({
      accessibleSummary: `Corrupted direction ${index + 1}: ${copy(copyId)}.`,
      instruction: copy(copyId),
      ordinal: index + 1,
      provisional: true,
    })),
    tradeoff: "DESTINATION MAY MOVE WITHOUT NOTICE",
  };
}

function buildSponsoredStop({ destinationInspectorRestored, secured, state }) {
  const stop = MAPGUESS_PROVISIONAL_FIXTURE.sponsoredStop;
  return {
    accessibleSummary: destinationInspectorRestored
      ? stop.accessibleSummary
      : "A sponsored stop is affecting the corrupted route, but its coordinate and identity are not yet verified.",
    blockedAsDestination: secured,
    coordinate: coordinateView(stop.coordinate, destinationInspectorRestored),
    disclosure: destinationInspectorRestored
      ? stop.disclosure
      : copy(MAPGUESS_COPY_IDS.corruptModule4).toUpperCase(),
    disclosed: destinationInspectorRestored,
    id: stop.id,
    provisional: true,
    text: destinationInspectorRestored ? stop.text : "SPONSORED STOP DETAILS HIDDEN",
    treatedAsDestination: state.midpointDiscovered && !secured,
  };
}

function buildSecuredRecords(state, { directions, goals }) {
  if (!state.secured) return { blockedWrite: null, evidence: null, securedPayoff: null };
  const fixture = MAPGUESS_PROVISIONAL_FIXTURE;
  const blockedWrite = {
    ...MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD,
    fixtureAttempt: { ...fixture.blockedWrite },
    process: { ...fixture.process },
    routeGoal: state.routeGoal,
  };
  const evidence = {
    ...MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
    destinationCoordinate: { ...fixture.destination.coordinate },
    destinationId: fixture.destination.id,
    fixtureDraft: { ...fixture.evidence },
    routeGoal: state.routeGoal,
    routeGoalLabel: goals.options.find(({ selected }) => selected)?.label ?? null,
    routeSummary: directions.accessibleSummary,
  };
  return {
    blockedWrite,
    evidence,
    securedPayoff: {
      bodyLines: copy(MAPGUESS_COPY_IDS.secureBody).split("\n").filter(Boolean),
      canonical: true,
      denial: copy(MAPGUESS_COPY_IDS.secureDenial),
      provisional: false,
      status: copy(MAPGUESS_COPY_IDS.secureStatus),
      testOnly: false,
      title: copy(MAPGUESS_COPY_IDS.secureTitle),
    },
  };
}

export function getMapGuessCampaignView(currentState, { reducedMotion = false } = {}) {
  const state = normalizeMapGuessState(currentState);
  const completed = new Set(state.completedUnitIds);
  const completedCount = state.completedUnitIds.length;
  const rebuildCompletedCount = Math.min(completedCount, MAPGUESS_REBUILD_UNITS.length);
  const anchorCompletedCount = Math.max(0, completedCount - MAPGUESS_REBUILD_UNITS.length);
  const tilesNamesRestored = completed.has("tiles_names");
  const scaleDateRestored = completed.has("scale_date");
  const terrainRestored = completed.has("terrain");
  const routeSegmentsRestored = completed.has("route_segments");
  const destinationInspectorRestored = completed.has("destination_inspector");
  const landmark1Anchored = completed.has("landmark_1");
  const landmarks23Anchored = completed.has("landmarks_2_3");
  const goalRouteLocked = completed.has("goal_route_lock") && state.routeGoalLocked;
  const goals = buildGoals(state, { anchorCompletedCount, midpointAcknowledged: state.midpointAcknowledged });
  const directions = buildDirections(state, goals, { routeSegmentsRestored });
  const metadata = buildMetadata({ scaleDateRestored, terrainRestored });
  const destinationComparison = buildDestinationComparison({
    destinationInspectorRestored,
    secured: state.secured,
    state,
  });
  const securedRecords = buildSecuredRecords(state, { directions, goals });
  const repairedRule = state.midpointDiscovered;

  return freezeDeep({
    ariaDescription: state.secured
      ? `MapGuess destination locked to ${MAPGUESS_PROVISIONAL_FIXTURE.destination.displayName}. ${goals.options.find(({ selected }) => selected)?.label ?? "Selected"} route goal preserved. Evidence remains provisional and test-only.`
      : state.midpointDiscovered
        ? state.midpointAcknowledged
          ? `MapGuess Moving Target proved that the road stayed fixed while the destination coordinates changed. Five rebuild units and ${anchorCompletedCount} of three destination anchors are saved.${state.routeGoal ? ` ${state.routeGoal} route goal selected.` : ""}`
          : "MapGuess Moving Target proved that the road stayed fixed while the destination coordinates changed. Five rebuild units remain saved; acknowledgement is required before destination anchoring."
        : "Corrupted MapGuess route with unreadable map layers and a two-minute estimate protected by a movable destination.",
    blockedWrite: securedRecords.blockedWrite,
    coordinateSystem: {
      accessibleSummary: MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.accessibleSummary,
      columns: [...MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.columns],
      externalTileService: MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.externalTileService,
      id: MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.id,
      rows: MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.rows,
      type: MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.type,
      usesRealLocation: MAPGUESS_PROVISIONAL_FIXTURE.coordinateSystem.usesRealLocation,
    },
    destinationComparison,
    directions,
    evidence: securedRecords.evidence,
    fixture: {
      canonical: false,
      fixtureId: MAPGUESS_PROVISIONAL_FIXTURE.fixtureId,
      notice: MAPGUESS_PROVISIONAL_FIXTURE.notice,
      provisional: true,
      status: MAPGUESS_PROVISIONAL_FIXTURE.status,
      testOnly: true,
    },
    fixedRoadGeometry: buildRoadGeometry({ labelsVisible: tilesNamesRestored }),
    goals,
    headerStatus: state.secured
      ? copy(MAPGUESS_COPY_IDS.secureStatus)
      : state.midpointDiscovered
        ? copy(MAPGUESS_COPY_IDS.midpointTitle)
        : copy(MAPGUESS_COPY_IDS.corruptStatus),
    landmarks: buildLandmarks({
      destinationInspectorRestored,
      landmark1Anchored,
      landmarks23Anchored,
    }),
    lastRepairAnnouncement: state.lastReaction ?? "MapGuess structural test ready. No map repair result saved.",
    mapDate: metadata.mapDate,
    midpoint: {
      acknowledged: state.midpointAcknowledged,
      actionRequired: state.midpointDiscovered && !state.midpointAcknowledged,
      amyLine: copy(MAPGUESS_COPY_IDS.midpointAmy),
      body: copy(MAPGUESS_COPY_IDS.midpointBody),
      chinmayLine: copy(MAPGUESS_COPY_IDS.midpointChinmay),
      discovered: state.midpointDiscovered,
      preservedUnitIds: state.midpointDiscovered
        ? MAPGUESS_REBUILD_UNITS.map(({ unitId }) => unitId)
        : [],
      proof: destinationComparison,
      proofAvailable: destinationComparison.visible,
      title: copy(MAPGUESS_COPY_IDS.midpointTitle),
      visible: state.midpointDiscovered && !state.midpointAcknowledged,
    },
    motion: {
      destinationMoveMode: reducedMotion ? "before-after-coordinate-cards" : "pin-jump-plus-coordinate-cards",
      landmarkAnchorMs: reducedMotion ? 0 : 480,
      mapLayerRevealMs: reducedMotion ? 0 : 560,
      mode: reducedMotion ? "state-swap" : "stepped-map-repair",
      pinMoveMs: reducedMotion ? 0 : 700,
      routeDrawMs: reducedMotion ? 0 : 650,
      usesTechnoStill: reducedMotion,
    },
    placeNames: buildPlaceNames(tilesNamesRestored, { destinationInspectorRestored }),
    progress: {
      anchorCompletedCount,
      anchorTotal: MAPGUESS_ANCHOR_UNITS.length,
      completedUnitCount: completedCount,
      completedUnitIds: [...state.completedUnitIds],
      kind: "unit-ledger",
      rebuildCompletedCount,
      rebuildTotal: MAPGUESS_REBUILD_UNITS.length,
      totalUnitCount: MAPGUESS_CAMPAIGN_UNITS.length,
    },
    routeSegments: buildRouteSegments({
      goalRouteLocked,
      routeGoal: state.routeGoal,
      routeSegmentsRestored,
    }),
    ruleBody: copy(repairedRule ? MAPGUESS_COPY_IDS.repairBody : MAPGUESS_COPY_IDS.corruptBody),
    ruleLabel: copy(repairedRule ? MAPGUESS_COPY_IDS.repairHeadline : MAPGUESS_COPY_IDS.corruptHeadline),
    scale: metadata.scale,
    secured: state.secured,
    securedPayoff: securedRecords.securedPayoff,
    siteId: "mapguess",
    source: metadata.source,
    start: {
      accessibleSummary: tilesNamesRestored
        ? MAPGUESS_PROVISIONAL_FIXTURE.start.accessibleSummary
        : "Route start name and coordinate remain hidden until the tile and place-name repair is saved.",
      coordinate: coordinateView(MAPGUESS_PROVISIONAL_FIXTURE.start.coordinate, tilesNamesRestored),
      displayName: tilesNamesRestored ? MAPGUESS_PROVISIONAL_FIXTURE.start.displayName : "ROUTE START HIDDEN",
      id: MAPGUESS_PROVISIONAL_FIXTURE.start.id,
      visible: tilesNamesRestored,
    },
    sponsoredStop: buildSponsoredStop({ destinationInspectorRestored, secured: state.secured, state }),
    stateId: state.stateId,
    terrain: metadata.terrain,
    tiles: buildTiles({ destinationInspectorRestored, terrainRestored, tilesNamesRestored }),
    truth: {
      destinationInspectorRestored,
      goalRouteLocked,
      landmark1Anchored,
      landmarks23Anchored,
      routeSegmentsRestored,
      scaleDateRestored,
      terrainRestored,
      tilesNamesRestored,
    },
    water: metadata.water,
  });
}

export const createMapGuessViewModel = getMapGuessCampaignView;
