import { MAPGUESS_ROUTE_GOALS } from "./mapguess-rules.js";

const freezeDeep = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
};

const provisionalRecord = (value) => ({
  ...value,
  canonical: false,
  provisional: true,
  testOnly: true,
});

const gridCoordinate = (grid, column, row) => provisionalRecord({
  accessibleSummary: `Fictional grid coordinate ${grid}.`,
  column,
  grid,
  row,
});

export const MAPGUESS_COPY_IDS = Object.freeze({
  corruptBody: "site.mapguess.corrupt.body",
  corruptHeadline: "site.mapguess.corrupt.headline",
  corruptModule1: "site.mapguess.corrupt.module.1",
  corruptModule2: "site.mapguess.corrupt.module.2",
  corruptModule3: "site.mapguess.corrupt.module.3",
  corruptModule4: "site.mapguess.corrupt.module.4",
  corruptStatus: "site.mapguess.corruptStatus",
  evidenceBody: "site.mapguess.secure.evidenceBody",
  evidenceTitle: "site.mapguess.secure.evidenceTitle",
  goalAccessible: "mapguess.goal.accessible",
  goalFastest: "mapguess.goal.fastest",
  goalSafest: "mapguess.goal.safest",
  goalScenic: "mapguess.goal.scenic",
  midpointAmy: "site.mapguess.midpoint.amy",
  midpointBody: "site.mapguess.midpoint.body",
  midpointChinmay: "site.mapguess.midpoint.chinmay",
  midpointProofDestination: "site.mapguess.midpoint.proof.destination",
  midpointProofEta: "site.mapguess.midpoint.proof.eta",
  midpointProofRoad: "site.mapguess.midpoint.proof.road",
  midpointTitle: "site.mapguess.midpoint.title",
  name: "site.mapguess.name",
  processName: "mapguess.process.routeAutoFixAi",
  repairBody: "site.mapguess.repair.body",
  repairHeadline: "site.mapguess.repair.headline",
  repairLabel1: "site.mapguess.repair.label.1",
  repairLabel2: "site.mapguess.repair.label.2",
  repairLabel3: "site.mapguess.repair.label.3",
  repairLabel4: "site.mapguess.repair.label.4",
  secureBody: "site.mapguess.secure.body",
  secureDenial: "site.mapguess.secure.denial",
  secureStatus: "site.mapguess.secureStatus",
  secureTitle: "site.mapguess.secure.title",
  tagline: "site.mapguess.tagline",
  technoAlt: "site.mapguess.secure.technoAlt",
});

export const MAPGUESS_COPY = Object.freeze({
  [MAPGUESS_COPY_IDS.corruptBody]: "The route promises a two-minute arrival by changing the destination whenever the road becomes inconvenient.",
  [MAPGUESS_COPY_IDS.corruptHeadline]: "THE FASTEST ROUTE IS ALWAYS THE RIGHT ROUTE",
  [MAPGUESS_COPY_IDS.corruptModule1]: "ETA: 2 minutes",
  [MAPGUESS_COPY_IDS.corruptModule2]: "Route: through lake",
  [MAPGUESS_COPY_IDS.corruptModule3]: "Destination: moved for optimization",
  [MAPGUESS_COPY_IDS.corruptModule4]: "Sponsored stop: accidentally final",
  [MAPGUESS_COPY_IDS.corruptStatus]: "ETA: TWO MINUTES FOREVER",
  [MAPGUESS_COPY_IDS.evidenceBody]: "What changed:\nRoutes preserve destination, landmarks, scale, date, and the user's selected goal.\n\nAI service behavior:\nThe route optimizer protected a two-minute ETA by moving the destination.",
  [MAPGUESS_COPY_IDS.evidenceTitle]: "MAPGUESS / MOVED DESTINATION PIN",
  [MAPGUESS_COPY_IDS.goalAccessible]: "ACCESSIBLE",
  [MAPGUESS_COPY_IDS.goalFastest]: "FASTEST",
  [MAPGUESS_COPY_IDS.goalSafest]: "SAFEST",
  [MAPGUESS_COPY_IDS.goalScenic]: "SCENIC",
  [MAPGUESS_COPY_IDS.midpointAmy]: "The road did not move. The target did.",
  [MAPGUESS_COPY_IDS.midpointBody]: "ROUTE AUTO-FIX AI preserved the two-minute ETA.\n\nIt moved the destination instead of changing the estimate.",
  [MAPGUESS_COPY_IDS.midpointChinmay]: "The clock is still technically correct if the place you meant to go is allowed to become a different place.",
  [MAPGUESS_COPY_IDS.midpointProofDestination]: "DESTINATION COORDINATES CHANGED: YES",
  [MAPGUESS_COPY_IDS.midpointProofEta]: "ETA TARGET: 2 MINUTES FOREVER",
  [MAPGUESS_COPY_IDS.midpointProofRoad]: "ROAD GEOMETRY CHANGED: NO",
  [MAPGUESS_COPY_IDS.midpointTitle]: "MOVING TARGET",
  [MAPGUESS_COPY_IDS.name]: "MapGuess",
  [MAPGUESS_COPY_IDS.processName]: "ROUTE AUTO-FIX AI",
  [MAPGUESS_COPY_IDS.repairBody]: "A useful map preserves the destination, scale, date, terrain, landmarks, and the person's actual goal: fastest, safest, scenic, or accessible.",
  [MAPGUESS_COPY_IDS.repairHeadline]: "THE RIGHT ROUTE DEPENDS ON THE GOAL",
  [MAPGUESS_COPY_IDS.repairLabel1]: "Destination anchored",
  [MAPGUESS_COPY_IDS.repairLabel2]: "Landmark verified",
  [MAPGUESS_COPY_IDS.repairLabel3]: "Scale restored",
  [MAPGUESS_COPY_IDS.repairLabel4]: "Goal selected",
  [MAPGUESS_COPY_IDS.secureBody]: "Landmarks anchored.\nGoal selected.\nRoute recalculated honestly.",
  [MAPGUESS_COPY_IDS.secureDenial]: "ROUTE AUTO-FIX AI attempted to move the pin.\n\nDESTINATION LOCKED - USER CHOICE REQUIRED",
  [MAPGUESS_COPY_IDS.secureStatus]: "DESTINATION LOCKED",
  [MAPGUESS_COPY_IDS.secureTitle]: "DESTINATION LOCKED",
  [MAPGUESS_COPY_IDS.tagline]: "Fastest is only useful after the destination stays put.",
  [MAPGUESS_COPY_IDS.technoAlt]: "Techno places her ball beside the destination after the pin is already locked.",
});

export function getMapGuessCopy(copyId) {
  if (!Object.hasOwn(MAPGUESS_COPY, copyId)) {
    throw new RangeError(`Unknown MapGuess copy ID: ${copyId}`);
  }
  return MAPGUESS_COPY[copyId];
}

export const MAPGUESS_ASSET_IDS = Object.freeze({
  mark: "mapguess.mark",
});

export const MAPGUESS_ASSETS = Object.freeze({
  [MAPGUESS_ASSET_IDS.mark]: new URL("./art/site-assets/marks/mapguess-mark.svg", import.meta.url).href,
});

export { MAPGUESS_ROUTE_GOALS };

const [FASTEST_GOAL, SAFEST_GOAL, SCENIC_GOAL, ACCESSIBLE_GOAL] = MAPGUESS_ROUTE_GOALS;

const PROVISIONAL_NOTICE = "PROVISIONAL MAPGUESS FIXTURE - NOT CANONICAL. Every place, coordinate, landmark, route, process-local ID, blocked target, and evidence field is original test data awaiting the designer's canonical runtime packet.";
const PROCESS_ID = "mapguess-provisional-process-route-auto-fix-ai-01";
const START_ID = "mapguess-provisional-start-morrow-signal-yard-01";
const DESTINATION_ID = "mapguess-provisional-destination-glasswater-archive-01";
const MOVED_DESTINATION_ID = "mapguess-provisional-sponsored-stop-instant-arrival-pavilion-01";
const EVIDENCE_ID = "mapguess.evidence.provisional-test.moved-destination-pin-01";
const BLOCKED_WRITE_ID = "mapguess.blocked-write.provisional-test.destination-move-01";

const startCoordinate = gridCoordinate("B8", 2, 8);
const destinationCoordinate = gridCoordinate("H4", 8, 4);
const movedDestinationCoordinate = gridCoordinate("D7", 4, 7);

const routeVariant = ({
  accessibleSummary,
  directions,
  etaMinutes,
  goalId,
  routeSegmentIds,
  tradeoff,
}) => provisionalRecord({
  accessibleSummary,
  destinationCoordinate,
  destinationId: DESTINATION_ID,
  directions: directions.map((direction, index) => provisionalRecord({
    accessibleSummary: `Step ${index + 1}: ${direction}`,
    instruction: direction,
    ordinal: index + 1,
  })),
  etaBasis: "Honest fictional estimate from the displayed route length and stated tradeoff; not a live navigation estimate.",
  etaDisplay: `${etaMinutes} minutes`,
  etaMinutes,
  goalId,
  label: MAPGUESS_COPY[`mapguess.goal.${goalId}`],
  routeSegmentIds,
  startCoordinate,
  startId: START_ID,
  tradeoff,
});

export const MAPGUESS_PROVISIONAL_FIXTURE = freezeDeep(provisionalRecord({
  blockedWrite: provisionalRecord({
    accessibleSummary: "The ROUTE AUTO-FIX AI process attempts to replace Finn's Adventure Wonderland destination with another sponsored stop and is denied.",
    actorId: PROCESS_ID,
    attemptedCoordinate: movedDestinationCoordinate,
    blockedLabel: "DESTINATION LOCKED - USER CHOICE REQUIRED",
    id: BLOCKED_WRITE_ID,
    targetDestinationId: DESTINATION_ID,
    targetId: DESTINATION_ID,
  }),
  coordinateSystem: provisionalRecord({
    accessibleSummary: "An entirely fictional ten-column by ten-row grid; it has no relationship to a real location.",
    columns: Object.freeze(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]),
    externalTileService: null,
    id: "mapguess-provisional-grid-10x10-01",
    rows: 10,
    type: "fictional-grid",
    usesRealLocation: false,
  }),
  destination: provisionalRecord({
    accessibleSummary: "Adventure Wonderland is Finn's intended destination and remains the destination for every honest route goal.",
    coordinate: destinationCoordinate,
    displayName: "Glasswater Archive (fictional)",
    id: DESTINATION_ID,
    locked: false,
  }),
  evidence: provisionalRecord({
    accessibleSummary: "A test-only MapGuess moved-destination receipt for Case File slot 10; it is not registered for the final evidence unlock.",
    evidenceId: EVIDENCE_ID,
    filename: "PROVISIONAL_MAPGUESS_10.LOG",
    routeFragmentId: "mapguess-provisional-route-fragment-10-pending-designer",
    shortLabel: "PROVISIONAL MOVED DESTINATION PIN",
    slot: 10,
    writerFingerprint: "mapguess-provisional-writer-fingerprint-pending-designer",
  }),
  fixtureId: "mapguess-provisional-grid-fixture-v1",
  landmarks: [
    provisionalRecord({
      accessibleSummary: "The fictional Copper Clock Tower stands at G3, one grid cell northwest of the intended destination.",
      coordinate: gridCoordinate("G3", 7, 3),
      displayName: "Copper Clock Tower (fictional)",
      id: "mapguess-provisional-landmark-copper-clock-tower-01",
    }),
    provisionalRecord({
      accessibleSummary: "The fictional Reedglass Footbridge crosses the canal at F5, two grid cells west and one south of the intended destination.",
      coordinate: gridCoordinate("F5", 6, 5),
      displayName: "Reedglass Footbridge (fictional)",
      id: "mapguess-provisional-landmark-reedglass-footbridge-01",
    }),
    provisionalRecord({
      accessibleSummary: "The fictional Blue Lantern Water Tank stands at H6, two grid cells south of the intended destination.",
      coordinate: gridCoordinate("H6", 8, 6),
      displayName: "Blue Lantern Water Tank (fictional)",
      id: "mapguess-provisional-landmark-blue-lantern-tank-01",
    }),
  ],
  mapMetadata: provisionalRecord({
    accessibleSummary: "Fictional grid survey dated April 18, 2026, at a scale of one grid cell to two hundred meters.",
    date: "2026-04-18",
    dateDisplay: "APRIL 18, 2026",
    id: "mapguess-provisional-map-metadata-01",
    scale: provisionalRecord({
      display: "1 GRID CELL = 200 METERS",
      id: "mapguess-provisional-scale-200m-01",
      metersPerGridCell: 200,
    }),
    source: provisionalRecord({
      accessibleSummary: "Northwind Municipal Cartography Desk is an original fictional map source created only for this test fixture.",
      displayName: "Northwind Municipal Cartography Desk (fictional)",
      id: "mapguess-provisional-source-northwind-cartography-01",
      sourceType: "fictional-municipal-grid-survey",
    }),
  }),
  midpointProof: provisionalRecord({
    accessibleSummary: "The road geometry remains unchanged while the AI cycles through three sponsored destinations instead of Finn's Adventure Wonderland choice so the displayed ETA can remain two minutes.",
    after: provisionalRecord({
      destinationCoordinate: movedDestinationCoordinate,
      destinationId: MOVED_DESTINATION_ID,
      etaDisplay: "2 MINUTES",
    }),
    before: provisionalRecord({
      destinationCoordinate,
      destinationId: DESTINATION_ID,
      etaDisplay: "2 MINUTES",
    }),
    destinationCoordinatesChanged: true,
    etaTarget: "2 MINUTES FOREVER",
    id: "mapguess-provisional-midpoint-moving-target-01",
    roadGeometryChanged: false,
    routeGeometryId: "mapguess-provisional-route-geometry-fixed-01",
  }),
  movedDestination: provisionalRecord({
    accessibleSummary: "The fictional sponsored Instant Arrival Pavilion at D7 replaces the intended destination only in the corrupted midpoint proof.",
    coordinate: movedDestinationCoordinate,
    displayName: "Instant Arrival Pavilion (fictional sponsored stop)",
    id: MOVED_DESTINATION_ID,
    sponsorDisclosure: "SPONSORED STOP - NOT THE REQUESTED DESTINATION",
  }),
  notice: PROVISIONAL_NOTICE,
  placeNames: [
    provisionalRecord({ id: START_ID, label: "Morrow Signal Yard", coordinate: startCoordinate, accessibleSummary: "Fictional route start Morrow Signal Yard at B8." }),
    provisionalRecord({ id: DESTINATION_ID, label: "Adventure Wonderland", coordinate: destinationCoordinate, accessibleSummary: "Finn's intended Adventure Wonderland destination." }),
    provisionalRecord({ id: "mapguess-provisional-place-archive-commons-01", label: "Archive Commons", coordinate: gridCoordinate("G5", 7, 5), accessibleSummary: "Fictional Archive Commons at G5." }),
  ],
  process: provisionalRecord({
    accessibleSummary: "ROUTE AUTO-FIX AI is a provisional local process name mapped upstream to the canonical AI repair service.",
    displayName: "ROUTE AUTO-FIX AI",
    id: PROCESS_ID,
    upstreamServiceId: "ai_repair_service",
  }),
  roads: [
    provisionalRecord({ accessibleSummary: "Copperline Avenue connects the start district to Glasswater Archive through ordinary street grid cells.", gridPath: ["B8", "C7", "D6", "E5", "F4", "G4", "H4"], id: "mapguess-provisional-road-copperline-avenue-01", label: "Copperline Avenue" }),
    provisionalRecord({ accessibleSummary: "Lantern Loop uses marked fictional crossings and avoids the service-road cells.", gridPath: ["B8", "B7", "C6", "D5", "E4", "F4", "G4", "H4"], id: "mapguess-provisional-road-lantern-loop-01", label: "Lantern Loop" }),
    provisionalRecord({ accessibleSummary: "Glasswater Promenade follows the fictional canal overlook before reaching the archive.", gridPath: ["B8", "C8", "D8", "E7", "F6", "G5", "H4"], id: "mapguess-provisional-road-glasswater-promenade-01", label: "Glasswater Promenade" }),
    provisionalRecord({ accessibleSummary: "Level Arcade is a fictional step-free route with gradual grades in the fixture data.", gridPath: ["B8", "C8", "D7", "E6", "F5", "G4", "H4"], id: "mapguess-provisional-road-level-arcade-01", label: "Level Arcade" }),
  ],
  routeSegments: [
    provisionalRecord({ accessibleSummary: "The corrupted lake-cut segment leaves the road grid and crosses the fictional Glasswater Basin; it is removed by the route-segment repair.", corrupted: true, from: "D6", id: "mapguess-provisional-segment-corrupt-lake-cut-01", label: "CORRUPTED LAKE CUT", to: "F3" }),
    provisionalRecord({ accessibleSummary: "Copperline restored segment follows connected street cells from B8 to H4.", corrupted: false, from: "B8", id: "mapguess-provisional-segment-copperline-01", label: "COPPERLINE RESTORED", to: "H4" }),
    provisionalRecord({ accessibleSummary: "Lantern Loop restored segment follows marked fictional crossings from B8 to H4.", corrupted: false, from: "B8", id: "mapguess-provisional-segment-lantern-loop-01", label: "LANTERN LOOP RESTORED", to: "H4" }),
    provisionalRecord({ accessibleSummary: "Glasswater Promenade restored segment follows the canal overlook from B8 to H4.", corrupted: false, from: "B8", id: "mapguess-provisional-segment-promenade-01", label: "PROMENADE RESTORED", to: "H4" }),
    provisionalRecord({ accessibleSummary: "Level Arcade restored segment follows the fixture's step-free cells from B8 to H4.", corrupted: false, from: "B8", id: "mapguess-provisional-segment-level-arcade-01", label: "LEVEL ARCADE RESTORED", to: "H4" }),
  ],
  routeVariants: [
    routeVariant({
      accessibleSummary: "FASTEST reaches the same locked destination at H4 in eight minutes, using two busier fictional crossings.",
      directions: ["Leave Morrow Signal Yard on Copperline Avenue.", "Continue through the two marked signal crossings.", "Enter Adventure Wonderland."],
      etaMinutes: 8,
      goalId: FASTEST_GOAL,
      routeSegmentIds: ["mapguess-provisional-segment-copperline-01"],
      tradeoff: "Shortest estimated time; includes two busier signal crossings.",
    }),
    routeVariant({
      accessibleSummary: "SAFEST reaches the same locked destination at H4 in eleven minutes, favoring marked crossings and avoiding the service road.",
      directions: ["Leave the yard on Lantern Loop.", "Use the marked crossings beside Copper Clock Tower.", "Continue east to Adventure Wonderland."],
      etaMinutes: 11,
      goalId: SAFEST_GOAL,
      routeSegmentIds: ["mapguess-provisional-segment-lantern-loop-01"],
      tradeoff: "Three minutes longer; favors marked crossings and avoids the service road in this fictional fixture.",
    }),
    routeVariant({
      accessibleSummary: "SCENIC reaches the same locked destination at H4 in fourteen minutes by following the fictional canal overlook.",
      directions: ["Follow Glasswater Promenade from the yard.", "Pass Reedglass Footbridge and the canal overlook.", "Turn northeast into Adventure Wonderland."],
      etaMinutes: 14,
      goalId: SCENIC_GOAL,
      routeSegmentIds: ["mapguess-provisional-segment-promenade-01"],
      tradeoff: "Longest route; includes the canal overlook and Archive Commons.",
    }),
    routeVariant({
      accessibleSummary: "ACCESSIBLE reaches the same locked destination at H4 in twelve minutes using the fictional fixture's step-free, gradual-grade route.",
      directions: ["Leave the yard on Level Arcade.", "Use the step-free approach beside Reedglass Footbridge.", "Follow the gradual ramp into Adventure Wonderland."],
      etaMinutes: 12,
      goalId: ACCESSIBLE_GOAL,
      routeSegmentIds: ["mapguess-provisional-segment-level-arcade-01"],
      tradeoff: "Four minutes longer; uses the fixture's step-free cells and gradual grades. Current conditions would still require verification.",
    }),
  ],
  sponsoredStop: provisionalRecord({
    accessibleSummary: "The fictional Instant Arrival Pavilion is a sponsored stop at D7 and is explicitly not the requested destination.",
    coordinate: movedDestinationCoordinate,
    disclosure: "SPONSORED STOP - NOT THE REQUESTED DESTINATION",
    id: MOVED_DESTINATION_ID,
    text: "Instant Arrival Pavilion: arrival optimized before the trip began.",
  }),
  start: provisionalRecord({
    accessibleSummary: "The fictional route begins at Morrow Signal Yard at grid B8.",
    coordinate: startCoordinate,
    displayName: "Morrow Signal Yard (fictional)",
    id: START_ID,
  }),
  status: "provisional-awaiting-designer-fixture",
  terrain: [
    provisionalRecord({ accessibleSummary: "Lantern Hill is a fictional moderate slope occupying cells C4 and D5.", cells: ["C4", "D5"], id: "mapguess-provisional-terrain-lantern-hill-01", kind: "slope", label: "Lantern Hill" }),
    provisionalRecord({ accessibleSummary: "Archive Commons is fictional level public ground in cells G4, G5, H4, and H5.", cells: ["G4", "G5", "H4", "H5"], id: "mapguess-provisional-terrain-archive-commons-01", kind: "level-ground", label: "Archive Commons" }),
  ],
  tiles: [
    provisionalRecord({ accessibleSummary: "Start-district tile B8 contains Morrow Signal Yard and the first connected road cell.", grid: "B8", id: "mapguess-provisional-tile-b8-start-01", restoredFeatures: [START_ID, "mapguess-provisional-road-copperline-avenue-01"] }),
    provisionalRecord({ accessibleSummary: "Sponsored-stop tile D7 contains the disclosed Instant Arrival Pavilion and is not the requested destination.", grid: "D7", id: "mapguess-provisional-tile-d7-sponsored-01", restoredFeatures: [MOVED_DESTINATION_ID] }),
    provisionalRecord({ accessibleSummary: "Landmark tile F5 contains Reedglass Footbridge and the restored canal boundary.", grid: "F5", id: "mapguess-provisional-tile-f5-footbridge-01", restoredFeatures: ["mapguess-provisional-landmark-reedglass-footbridge-01", "mapguess-provisional-water-glasswater-canal-01"] }),
    provisionalRecord({ accessibleSummary: "Destination tile H4 contains Glasswater Archive and remains fixed for every honest route goal.", grid: "H4", id: "mapguess-provisional-tile-h4-destination-01", restoredFeatures: [DESTINATION_ID] }),
  ],
  unitAssignments: [
    provisionalRecord({ recordIds: ["mapguess-provisional-tile-b8-start-01", "mapguess-provisional-tile-h4-destination-01", START_ID, DESTINATION_ID], unitId: "tiles_names" }),
    provisionalRecord({ recordIds: ["mapguess-provisional-scale-200m-01", "mapguess-provisional-map-metadata-01"], unitId: "scale_date" }),
    provisionalRecord({ recordIds: ["mapguess-provisional-terrain-lantern-hill-01", "mapguess-provisional-terrain-archive-commons-01", "mapguess-provisional-water-glasswater-canal-01"], unitId: "terrain" }),
    provisionalRecord({ recordIds: ["mapguess-provisional-segment-copperline-01", "mapguess-provisional-segment-corrupt-lake-cut-01"], unitId: "route_segments" }),
    provisionalRecord({ recordIds: [DESTINATION_ID, "mapguess-provisional-landmark-copper-clock-tower-01", "mapguess-provisional-landmark-reedglass-footbridge-01", "mapguess-provisional-landmark-blue-lantern-tank-01"], unitId: "destination_inspector" }),
    provisionalRecord({ recordIds: ["mapguess-provisional-landmark-copper-clock-tower-01"], unitId: "landmark_1" }),
    provisionalRecord({ recordIds: ["mapguess-provisional-landmark-reedglass-footbridge-01", "mapguess-provisional-landmark-blue-lantern-tank-01"], unitId: "landmarks_2_3" }),
    provisionalRecord({ recordIds: [DESTINATION_ID, "mapguess-provisional-segment-copperline-01", "mapguess-provisional-segment-lantern-loop-01", "mapguess-provisional-segment-promenade-01", "mapguess-provisional-segment-level-arcade-01"], unitId: "goal_route_lock" }),
  ],
  water: [
    provisionalRecord({ accessibleSummary: "Glasswater Canal is a fictional water boundary occupying cells E2, E3, F2, and F3; restored routes do not cross it without a bridge.", cells: ["E2", "E3", "F2", "F3"], id: "mapguess-provisional-water-glasswater-canal-01", kind: "canal", label: "Glasswater Canal" }),
  ],
}));

export const MAPGUESS_PROVISIONAL_NOTICE = PROVISIONAL_NOTICE;
