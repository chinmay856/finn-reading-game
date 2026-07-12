const freezeUnit = (unit) => Object.freeze({ ...unit });

export const MYCORNER_RESTORE_UNITS = Object.freeze([
  freezeUnit({
    act: "restore",
    reaction: "Profile owner and About Me restored. Three module groups remain.",
    stateId: "mycorner_restore_1",
    unitId: "owner_about",
    visibleRepair: "The actual profile owner and owner-written About Me return.",
  }),
  freezeUnit({
    act: "restore",
    reaction: "Chosen theme and friend layout restored. Two module groups remain.",
    stateId: "mycorner_restore_2",
    unitId: "theme_friends",
    visibleRepair: "Owner-selected theme fragments and real friend groups return.",
  }),
  freezeUnit({
    act: "restore",
    reaction: "Music controls and visitor counter restored. One module group remains.",
    stateId: "mycorner_restore_3",
    unitId: "media_counter",
    visibleRepair: "Silent owner-selected music metadata and the honest visitor counter return.",
  }),
  freezeUnit({
    act: "restore",
    reaction: "Privacy controls and source view restored. Apply to Everyone is ready.",
    stateId: "mycorner_restore_4",
    unitId: "privacy_source",
    visibleRepair: "Privacy values and the profile source inspector become visible.",
  }),
]);

export const MYCORNER_OWNER_LOCK_UNITS = Object.freeze([
  freezeUnit({
    act: "owner-lock",
    reaction: "Profile owner locked. Two ownership checks remain.",
    stateId: "mycorner_owner_lock_1",
    unitId: "profile_owner_lock",
    visibleRepair: "The profile-owner field is locked to the actual page owner.",
  }),
  freezeUnit({
    act: "owner-lock",
    reaction: "Theme and media ownership locked. One permission check remains.",
    stateId: "mycorner_owner_lock_2",
    unitId: "presentation_owner_lock",
    visibleRepair: "Theme, friends, and silent media remain the owner's choices.",
  }),
  freezeUnit({
    act: "owner-lock",
    reaction: "Global template permission removed. Owner controls restored.",
    stateId: "mycorner_owner_lock_3",
    unitId: "global_apply_blocked",
    visibleRepair: "Apply to Everyone is blocked behind owner permission.",
  }),
]);

export const MYCORNER_CAMPAIGN_UNITS = Object.freeze([
  ...MYCORNER_RESTORE_UNITS,
  ...MYCORNER_OWNER_LOCK_UNITS,
]);

const UNIT_BY_ID = new Map(MYCORNER_CAMPAIGN_UNITS.map((unit) => [unit.unitId, unit]));

function completedCount(campaignState) {
  if (!Array.isArray(campaignState?.completedUnitIds)) return 0;
  let count = 0;
  for (const unit of MYCORNER_CAMPAIGN_UNITS) {
    if (campaignState.completedUnitIds[count] !== unit.unitId) break;
    count += 1;
  }
  return count;
}

export function describeMyCornerUnit(unitId) {
  return UNIT_BY_ID.get(unitId)?.reaction ?? "MyCorner profile recovery saved.";
}

export function getNextMyCornerUnit(campaignState = {}) {
  if (campaignState.secured || campaignState.act === "secured") return null;
  const count = completedCount(campaignState);
  if (count >= MYCORNER_CAMPAIGN_UNITS.length) return null;
  if (count >= MYCORNER_RESTORE_UNITS.length && !campaignState.midpointAcknowledged) {
    return null;
  }
  return MYCORNER_CAMPAIGN_UNITS[count] ?? null;
}

export function calculateMyCornerReadingOutcome({
  accepted = true,
  campaignState = {},
} = {}) {
  if (!accepted) {
    return Object.freeze({
      kind: "no-progress",
      reaction: "No MyCorner profile unit changed.",
      reason: "reading-not-accepted",
      unitId: null,
    });
  }

  const nextUnit = getNextMyCornerUnit(campaignState);
  if (!nextUnit) {
    const secured = Boolean(campaignState.secured) || campaignState.act === "secured";
    const midpointPending = Boolean(campaignState.midpointDiscovered)
      && !campaignState.midpointAcknowledged;
    return Object.freeze({
      kind: "no-progress",
      reaction: secured
        ? "MyCorner is already secured."
        : midpointPending
          ? "Acknowledge Apply to Everyone before another owner-control reading."
          : "No authored MyCorner unit is available.",
      reason: secured
        ? "already-secured"
        : midpointPending
          ? "midpoint-acknowledgement-required"
          : "no-unit-available",
      unitId: null,
    });
  }

  return Object.freeze({
    kind: nextUnit.act === "restore" ? "restore-unit" : "owner-lock-unit",
    reaction: nextUnit.reaction,
    stateId: nextUnit.stateId,
    unitId: nextUnit.unitId,
    unitOrdinal: MYCORNER_CAMPAIGN_UNITS.indexOf(nextUnit) + 1,
    unitTotal: MYCORNER_CAMPAIGN_UNITS.length,
  });
}
