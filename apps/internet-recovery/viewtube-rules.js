const freezeUnit = (unit) => Object.freeze({ ...unit });

export const VIEWTUBE_RESTORE_UNITS = Object.freeze([
  freezeUnit({
    act: "restore",
    reaction: "Recording identity restored. Three recording-context units remain.",
    stateId: "viewtube_restore_1",
    unitId: "recording_identity",
    visibleRepair: "The recording title, creator, and date return beside the silent player.",
  }),
  freezeUnit({
    act: "restore",
    reaction: "Distinct frames and duration restored. Two recording-context units remain.",
    stateId: "viewtube_restore_2",
    unitId: "distinct_frames",
    visibleRepair: "The frame strip separates the original recording from its repeated ending.",
  }),
  freezeUnit({
    act: "restore",
    reaction: "Site transcript timestamps restored. One recording-context unit remains.",
    stateId: "viewtube_restore_3",
    unitId: "transcript_track",
    visibleRepair: "The decorative site transcript reconnects to the recording timeline.",
  }),
  freezeUnit({
    act: "restore",
    reaction: "Source context restored. Autoplay Corroboration is ready.",
    stateId: "viewtube_restore_4",
    unitId: "source_context",
    visibleRepair: "The source and creator-context panel returns beside the recommendations.",
  }),
]);

export const VIEWTUBE_TRACK_UNITS = Object.freeze([
  freezeUnit({
    act: "track",
    reaction: "Footage hashes grouped. Two evidence tracks remain.",
    stateId: "viewtube_track_1",
    unitId: "footage_track_verified",
    visibleRepair: "Duplicate loops are quarantined under one original footage hash.",
  }),
  freezeUnit({
    act: "track",
    reaction: "Transcript timing verified. One evidence track remains.",
    stateId: "viewtube_track_2",
    unitId: "transcript_track_verified",
    visibleRepair: "Transcript timing links back to the original recording rather than its loops.",
  }),
  freezeUnit({
    act: "track",
    reaction: "Source evidence separated from recommendations. Evidence tracks restored.",
    stateId: "viewtube_track_3",
    unitId: "source_track_verified",
    visibleRepair: "Source evidence becomes distinct from recommendations and playback counts.",
  }),
]);

export const VIEWTUBE_CAMPAIGN_UNITS = Object.freeze([
  ...VIEWTUBE_RESTORE_UNITS,
  ...VIEWTUBE_TRACK_UNITS,
]);

const UNIT_BY_ID = new Map(VIEWTUBE_CAMPAIGN_UNITS.map((unit) => [unit.unitId, unit]));

function completedCount(campaignState) {
  if (!Array.isArray(campaignState?.completedUnitIds)) return 0;
  let count = 0;
  for (const unit of VIEWTUBE_CAMPAIGN_UNITS) {
    if (campaignState.completedUnitIds[count] !== unit.unitId) break;
    count += 1;
  }
  return count;
}

export function describeViewTubeUnit(unitId) {
  return UNIT_BY_ID.get(unitId)?.reaction ?? "ViewTube evidence-track recovery saved.";
}

export function getNextViewTubeUnit(campaignState = {}) {
  if (campaignState.secured || campaignState.act === "secured") return null;
  const count = completedCount(campaignState);
  if (count >= VIEWTUBE_CAMPAIGN_UNITS.length) return null;
  if (count >= VIEWTUBE_RESTORE_UNITS.length && !campaignState.midpointAcknowledged) {
    return null;
  }
  return VIEWTUBE_CAMPAIGN_UNITS[count] ?? null;
}

export function calculateViewTubeReadingOutcome({
  accepted = true,
  campaignState = {},
} = {}) {
  if (!accepted) {
    return Object.freeze({
      kind: "no-progress",
      reaction: "No ViewTube recording or evidence track changed.",
      reason: "reading-not-accepted",
      unitId: null,
    });
  }

  const nextUnit = getNextViewTubeUnit(campaignState);
  if (!nextUnit) {
    const secured = Boolean(campaignState.secured) || campaignState.act === "secured";
    const midpointPending = Boolean(campaignState.midpointDiscovered)
      && !campaignState.midpointAcknowledged;
    return Object.freeze({
      kind: "no-progress",
      reaction: secured
        ? "ViewTube is already secured."
        : midpointPending
          ? "Acknowledge Autoplay Corroboration before verifying evidence tracks."
          : "No authored ViewTube unit is available.",
      reason: secured
        ? "already-secured"
        : midpointPending
          ? "midpoint-acknowledgement-required"
          : "no-unit-available",
      unitId: null,
    });
  }

  return Object.freeze({
    kind: nextUnit.act === "restore" ? "restore-unit" : "track-unit",
    reaction: nextUnit.reaction,
    stateId: nextUnit.stateId,
    unitId: nextUnit.unitId,
    unitOrdinal: VIEWTUBE_CAMPAIGN_UNITS.indexOf(nextUnit) + 1,
    unitTotal: VIEWTUBE_CAMPAIGN_UNITS.length,
  });
}
