export const SEARCHISH_RESTORE_UNITS = Object.freeze([
  Object.freeze({ unitId: "result_1_origin", stateId: "searchish_result_1_origin", label: "RESULT 1 DOMAIN + DATE" }),
  Object.freeze({ unitId: "result_2_origin", stateId: "searchish_result_2_origin", label: "RESULT 2 AUTHOR + PUBLISHER" }),
  Object.freeze({ unitId: "result_3_origin", stateId: "searchish_result_3_origin", label: "RESULT 3 SPONSORSHIP + QUERY MATCH" }),
  Object.freeze({ unitId: "result_4_origin", stateId: "searchish_result_4_origin", label: "RESULT 4 DOMAIN + DATE + INSPECTOR" }),
]);

export const SEARCHISH_BRANCH_UNITS = Object.freeze([
  Object.freeze({ unitId: "primary_branch", stateId: "searchish_primary_branch", label: "PRIMARY CAMERA BRANCH" }),
  Object.freeze({ unitId: "independent_branch", stateId: "searchish_independent_branch", label: "INDEPENDENT CONTEXT BRANCH" }),
  Object.freeze({ unitId: "placement_origin_gate", stateId: "searchish_secured", label: "GENERATED ANSWER ORIGIN GATE" }),
]);

export const SEARCHISH_CAMPAIGN_UNITS = Object.freeze([...SEARCHISH_RESTORE_UNITS, ...SEARCHISH_BRANCH_UNITS]);

export function normalizeSearchishCompletedUnitIds(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  const prefix = [];
  for (const expected of SEARCHISH_CAMPAIGN_UNITS) {
    if (value[prefix.length] !== expected.unitId) break;
    prefix.push(expected.unitId);
  }
  return Object.freeze(prefix);
}

export function getNextSearchishUnit(state = {}) {
  const count = normalizeSearchishCompletedUnitIds(state.completedUnitIds).length;
  if (count >= SEARCHISH_CAMPAIGN_UNITS.length) return null;
  if (count === SEARCHISH_RESTORE_UNITS.length && !state.midpointAcknowledged) return null;
  return SEARCHISH_CAMPAIGN_UNITS[count];
}

export function calculateSearchishReadingOutcome({ accepted = true, campaignState = {} } = {}) {
  const unit = getNextSearchishUnit(campaignState);
  if (!accepted || !unit) return Object.freeze({ accepted: false, kind: "no-advance", unitId: null });
  return Object.freeze({
    accepted: true,
    kind: unit.unitId.endsWith("branch") || unit.unitId === "placement_origin_gate" ? "branch-unit" : "restore-unit",
    unitId: unit.unitId,
  });
}
