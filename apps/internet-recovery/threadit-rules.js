const freezeUnit = (unit) => Object.freeze({ ...unit });

export const THREADIT_ACT_ONE_UNITS = Object.freeze([
  freezeUnit({
    act: "act-one",
    reaction: "Original question restored. Three relationships remain.",
    stateId: "threadit_untangle_1",
    unitId: "question_origin",
    visibleRepair: "The original question returns to the top with its timestamp.",
  }),
  freezeUnit({
    act: "act-one",
    reaction: "Reply order restored. Two relationships remain.",
    stateId: "threadit_untangle_2",
    unitId: "reply_chronology",
    visibleRepair: "Reply chronology and one nested branch reconnect.",
  }),
  freezeUnit({
    act: "act-one",
    reaction: "Citation origin restored. One relationship remains.",
    stateId: "threadit_untangle_3",
    unitId: "citation_origin",
    visibleRepair: "A citation reconnects to the post that introduced it.",
  }),
  freezeUnit({
    act: "act-one",
    reaction: "Duplicate source disclosed. Trace View is ready.",
    stateId: "threadit_untangle_4",
    unitId: "duplicate_disclosure",
    visibleRepair: "Two duplicate replies collapse under one disclosed origin.",
  }),
]);

export const THREADIT_TRACE_UNITS = Object.freeze([
  freezeUnit({
    act: "trace",
    reaction: "Shared generated origin verified. Two traces remain.",
    stateId: "threadit_trace_1",
    unitId: "shared_origin_verified",
    visibleRepair: "The shared model-run origin is verified for the cloned accounts.",
  }),
  freezeUnit({
    act: "trace",
    reaction: "Independent sources separated. One trace remains.",
    stateId: "threadit_trace_2",
    unitId: "independent_sources_separated",
    visibleRepair: "Independent sources receive separate verified branches.",
  }),
  freezeUnit({
    act: "trace",
    reaction: "Duplicate copies quarantined. Posting gate secured.",
    stateId: "threadit_trace_3",
    unitId: "duplicate_posting_blocked",
    visibleRepair: "Generated copies move into quarantine and the duplicate-posting gate activates.",
  }),
]);

export const THREADIT_CAMPAIGN_UNITS = Object.freeze([
  ...THREADIT_ACT_ONE_UNITS,
  ...THREADIT_TRACE_UNITS,
]);

const UNIT_BY_ID = new Map(THREADIT_CAMPAIGN_UNITS.map((unit) => [unit.unitId, unit]));

function completedCount(campaignState) {
  if (!Array.isArray(campaignState?.completedUnitIds)) return 0;
  let count = 0;
  for (const unit of THREADIT_CAMPAIGN_UNITS) {
    if (campaignState.completedUnitIds[count] !== unit.unitId) break;
    count += 1;
  }
  return count;
}

export function describeThreadItUnit(unitId) {
  return UNIT_BY_ID.get(unitId)?.reaction ?? "Source relationship saved.";
}

export function getNextThreadItUnit(campaignState = {}) {
  if (campaignState.secured || campaignState.act === "secured") return null;
  const count = completedCount(campaignState);
  if (count >= THREADIT_CAMPAIGN_UNITS.length) return null;
  if (count >= THREADIT_ACT_ONE_UNITS.length && !campaignState.midpointAcknowledged) return null;
  return THREADIT_CAMPAIGN_UNITS[count] ?? null;
}

export function calculateThreadItReadingOutcome({
  accepted = true,
  campaignState = {},
} = {}) {
  if (!accepted) {
    return Object.freeze({
      kind: "no-progress",
      reaction: "No ThreadIt relationship changed.",
      reason: "reading-not-accepted",
      unitId: null,
    });
  }

  const nextUnit = getNextThreadItUnit(campaignState);
  if (!nextUnit) {
    const secured = Boolean(campaignState.secured) || campaignState.act === "secured";
    const midpointPending = Boolean(campaignState.midpointDiscovered)
      && !campaignState.midpointAcknowledged;
    return Object.freeze({
      kind: "no-progress",
      reaction: secured
        ? "ThreadIt is already secured."
        : midpointPending
          ? "Acknowledge the Consensus Cascade before tracing another source."
          : "No authored ThreadIt unit is available.",
      reason: secured
        ? "already-secured"
        : midpointPending
          ? "midpoint-acknowledgement-required"
          : "no-unit-available",
      unitId: null,
    });
  }

  return Object.freeze({
    kind: nextUnit.act === "act-one" ? "act-one-unit" : "trace-unit",
    reaction: nextUnit.reaction,
    stateId: nextUnit.stateId,
    unitId: nextUnit.unitId,
    unitOrdinal: THREADIT_CAMPAIGN_UNITS.indexOf(nextUnit) + 1,
    unitTotal: THREADIT_CAMPAIGN_UNITS.length,
  });
}
