const freezeTracker = ({ display, kind, value = null }) => Object.freeze({
  display,
  kind,
  value,
});

const freezeUnit = (unit) => Object.freeze({
  ...unit,
  tracker: freezeTracker(unit.tracker),
});

export const FACEPLACE_FALSE_TRACKER_UNITS = Object.freeze([
  freezeUnit({
    act: "false-tracker",
    reaction: "Duplicate cluster collapsed. Two dishonest signals remain.",
    stateId: "faceplace_false_tracker_1",
    tracker: { display: "12%", kind: "nonsense" },
    unitId: "duplicates_collapsed",
    visibleRepair: "One repeated-post cluster collapses without deleting its source cards.",
  }),
  freezeUnit({
    act: "false-tracker",
    reaction: "Authors and timestamps restored. One dishonest signal remains.",
    stateId: "faceplace_false_tracker_2",
    tracker: { display: "114%", kind: "nonsense" },
    unitId: "authorship_time_restored",
    visibleRepair: "Author names and timestamps return to the recovered feed cards.",
  }),
  freezeUnit({
    act: "false-tracker",
    reaction: "Recommendation context restored. Honest Zero is ready.",
    stateId: "faceplace_false_tracker_3",
    tracker: { display: "AVOCADO%", kind: "nonsense" },
    unitId: "context_controls_restored",
    visibleRepair: "Recommendation labels and the shell of Why this appeared return.",
  }),
]);

// Act I is the three false-tracker units. Keep the alias for shared site tooling
// that uses the production-system term while FacePlace retains its local name.
export const FACEPLACE_ACT_ONE_UNITS = FACEPLACE_FALSE_TRACKER_UNITS;

export const FACEPLACE_RECOVERY_UNITS = Object.freeze([
  freezeUnit({
    act: "recovery",
    reaction: "Chronology verified. Two honest checks remain.",
    stateId: "faceplace_recovery_1",
    tracker: { display: "34%", kind: "honest", value: 34 },
    unitId: "chronology_verified",
    visibleRepair: "The chronological feed branch is verified and remains available.",
  }),
  freezeUnit({
    act: "recovery",
    reaction: "Recommendation reasons verified. One honest check remains.",
    stateId: "faceplace_recovery_2",
    tracker: { display: "67%", kind: "honest", value: 67 },
    unitId: "recommendations_explained",
    visibleRepair: "Authorship and recommendation reasons are verified together.",
  }),
  freezeUnit({
    act: "recovery",
    reaction: "Forced distribution disabled. Feed recovery verified.",
    stateId: "faceplace_recovery_3",
    tracker: { display: "100%", kind: "honest", value: 100 },
    unitId: "distribution_gate_restored",
    visibleRepair: "The distribution gate rejects another automated boost attempt.",
  }),
]);

export const FACEPLACE_CAMPAIGN_UNITS = Object.freeze([
  ...FACEPLACE_FALSE_TRACKER_UNITS,
  ...FACEPLACE_RECOVERY_UNITS,
]);

const UNIT_BY_ID = new Map(FACEPLACE_CAMPAIGN_UNITS.map((unit) => [unit.unitId, unit]));

function completedCount(campaignState) {
  if (!Array.isArray(campaignState?.completedUnitIds)) return 0;
  let count = 0;
  for (const unit of FACEPLACE_CAMPAIGN_UNITS) {
    if (campaignState.completedUnitIds[count] !== unit.unitId) break;
    count += 1;
  }
  return count;
}

export function describeFacePlaceUnit(unitId) {
  return UNIT_BY_ID.get(unitId)?.reaction ?? "Feed recovery saved.";
}

export function getNextFacePlaceUnit(campaignState = {}) {
  if (campaignState.secured || campaignState.act === "secured") return null;
  const count = completedCount(campaignState);
  if (count >= FACEPLACE_CAMPAIGN_UNITS.length) return null;
  if (count >= FACEPLACE_FALSE_TRACKER_UNITS.length && !campaignState.midpointAcknowledged) {
    return null;
  }
  return FACEPLACE_CAMPAIGN_UNITS[count] ?? null;
}

export function calculateFacePlaceReadingOutcome({
  accepted = true,
  campaignState = {},
} = {}) {
  if (!accepted) {
    return Object.freeze({
      kind: "no-progress",
      reaction: "No FacePlace feed unit changed.",
      reason: "reading-not-accepted",
      unitId: null,
    });
  }

  const nextUnit = getNextFacePlaceUnit(campaignState);
  if (!nextUnit) {
    const secured = Boolean(campaignState.secured) || campaignState.act === "secured";
    const midpointPending = Boolean(campaignState.midpointDiscovered)
      && !campaignState.midpointAcknowledged;
    return Object.freeze({
      kind: "no-progress",
      reaction: secured
        ? "FacePlace is already secured."
        : midpointPending
          ? "Acknowledge Honest Zero before another feed recovery can advance."
          : "No authored FacePlace unit is available.",
      reason: secured
        ? "already-secured"
        : midpointPending
          ? "midpoint-acknowledgement-required"
          : "no-unit-available",
      unitId: null,
    });
  }

  return Object.freeze({
    kind: nextUnit.act === "false-tracker" ? "false-tracker-unit" : "recovery-unit",
    reaction: nextUnit.reaction,
    stateId: nextUnit.stateId,
    tracker: nextUnit.tracker,
    unitId: nextUnit.unitId,
    unitOrdinal: FACEPLACE_CAMPAIGN_UNITS.indexOf(nextUnit) + 1,
    unitTotal: FACEPLACE_CAMPAIGN_UNITS.length,
  });
}
