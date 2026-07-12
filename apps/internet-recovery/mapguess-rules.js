const freezeUnit = (unit) => Object.freeze({ ...unit });

export const MAPGUESS_ROUTE_GOALS = Object.freeze([
  "fastest",
  "safest",
  "scenic",
  "accessible",
]);

const ROUTE_GOAL_SET = new Set(MAPGUESS_ROUTE_GOALS);

export function normalizeMapGuessRouteGoal(value) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return ROUTE_GOAL_SET.has(normalized) ? normalized : null;
}

export function isMapGuessRouteGoal(value) {
  return normalizeMapGuessRouteGoal(value) !== null;
}

export const MAPGUESS_REBUILD_UNITS = Object.freeze([
  freezeUnit({
    act: "rebuild",
    reaction: "Map tiles and place names clarified. Four map layers remain.",
    stateId: "mapguess_rebuild_1",
    unitId: "tiles_names",
    visibleRepair: "The first tile block and its place names become readable.",
  }),
  freezeUnit({
    act: "rebuild",
    reaction: "Scale and map date restored. Three map layers remain.",
    stateId: "mapguess_rebuild_2",
    unitId: "scale_date",
    visibleRepair: "The map scale and source date return beside the route.",
  }),
  freezeUnit({
    act: "rebuild",
    reaction: "Terrain and water boundaries restored. Two map layers remain.",
    stateId: "mapguess_rebuild_3",
    unitId: "terrain",
    visibleRepair: "Terrain and water boundaries separate into honest map regions.",
  }),
  freezeUnit({
    act: "rebuild",
    reaction: "Route segments reconnected. One map layer remains.",
    stateId: "mapguess_rebuild_4",
    unitId: "route_segments",
    visibleRepair: "Route segments reconnect to the roads they actually follow.",
  }),
  freezeUnit({
    act: "rebuild",
    reaction: "Destination inspector restored. Moving Target is ready.",
    stateId: "mapguess_rebuild_5",
    unitId: "destination_inspector",
    visibleRepair: "Destination coordinates and the landmark inspector return.",
  }),
]);

export const MAPGUESS_ANCHOR_UNITS = Object.freeze([
  freezeUnit({
    act: "anchor",
    reaction: "First landmark anchored. Two destination checks remain.",
    stateId: "mapguess_anchor_1",
    unitId: "landmark_1",
    visibleRepair: "The first landmark anchors the original destination coordinate.",
  }),
  freezeUnit({
    act: "anchor",
    reaction: "Landmark triangulation verified. One destination check remains.",
    stateId: "mapguess_anchor_2",
    unitId: "landmarks_2_3",
    visibleRepair: "The second and third landmarks triangulate the destination pin.",
  }),
  freezeUnit({
    act: "anchor",
    reaction: "Route goal locked. Destination recalculated honestly.",
    stateId: "mapguess_anchor_3",
    unitId: "goal_route_lock",
    visibleRepair: "The selected route goal locks to the original destination.",
  }),
]);

export const MAPGUESS_CAMPAIGN_UNITS = Object.freeze([
  ...MAPGUESS_REBUILD_UNITS,
  ...MAPGUESS_ANCHOR_UNITS,
]);

const UNIT_BY_ID = new Map(MAPGUESS_CAMPAIGN_UNITS.map((unit) => [unit.unitId, unit]));

function completedCount(campaignState) {
  if (!Array.isArray(campaignState?.completedUnitIds)) return 0;
  let count = 0;
  for (const unit of MAPGUESS_CAMPAIGN_UNITS) {
    if (campaignState.completedUnitIds[count] !== unit.unitId) break;
    count += 1;
  }
  return count;
}

export function describeMapGuessUnit(unitId) {
  return UNIT_BY_ID.get(unitId)?.reaction ?? "Map recovery saved.";
}

export function getNextMapGuessUnit(campaignState = {}) {
  if (campaignState.secured || campaignState.act === "secured") return null;
  const count = completedCount(campaignState);
  if (count >= MAPGUESS_CAMPAIGN_UNITS.length) return null;
  if (count >= MAPGUESS_REBUILD_UNITS.length && !campaignState.midpointAcknowledged) {
    return null;
  }
  const nextUnit = MAPGUESS_CAMPAIGN_UNITS[count] ?? null;
  if (nextUnit?.unitId === "goal_route_lock" && !isMapGuessRouteGoal(campaignState.routeGoal)) {
    return null;
  }
  return nextUnit;
}

export function calculateMapGuessReadingOutcome({
  accepted = true,
  campaignState = {},
} = {}) {
  if (!accepted) {
    return Object.freeze({
      kind: "no-progress",
      reaction: "No MapGuess map unit changed.",
      reason: "reading-not-accepted",
      unitId: null,
    });
  }

  const nextUnit = getNextMapGuessUnit(campaignState);
  if (!nextUnit) {
    const secured = Boolean(campaignState.secured) || campaignState.act === "secured";
    const midpointPending = Boolean(campaignState.midpointDiscovered)
      && !campaignState.midpointAcknowledged;
    const goalRequired = !secured
      && !midpointPending
      && completedCount(campaignState) === MAPGUESS_CAMPAIGN_UNITS.length - 1
      && !isMapGuessRouteGoal(campaignState.routeGoal);
    return Object.freeze({
      kind: "no-progress",
      reaction: secured
        ? "MapGuess is already secured."
        : midpointPending
          ? "Acknowledge Moving Target before anchoring the destination."
          : goalRequired
            ? "Choose a route goal before the final destination-lock reading begins."
            : "No authored MapGuess unit is available.",
      reason: secured
        ? "already-secured"
        : midpointPending
          ? "midpoint-acknowledgement-required"
          : goalRequired
            ? "goal-choice-required"
            : "no-unit-available",
      unitId: null,
    });
  }

  return Object.freeze({
    kind: nextUnit.act === "rebuild" ? "rebuild-unit" : "anchor-unit",
    reaction: nextUnit.reaction,
    routeGoal: nextUnit.unitId === "goal_route_lock"
      ? normalizeMapGuessRouteGoal(campaignState.routeGoal)
      : null,
    stateId: nextUnit.stateId,
    unitId: nextUnit.unitId,
    unitOrdinal: MAPGUESS_CAMPAIGN_UNITS.indexOf(nextUnit) + 1,
    unitTotal: MAPGUESS_CAMPAIGN_UNITS.length,
  });
}
