const freezeUnit = (unit) => Object.freeze({ ...unit });

export const YAHUH_SORT_UNITS = Object.freeze([
  freezeUnit({
    act: "sort",
    moduleIds: Object.freeze(["news", "weather"]),
    reaction: "News and Weather labels restored. Two module pairs remain.",
    stateId: "yahuh_sort_1",
    unitId: "news_weather_sorted",
    visibleRepair: "News and Weather regain category, source, and date labels.",
  }),
  freezeUnit({
    act: "sort",
    moduleIds: Object.freeze(["finance", "sports"]),
    reaction: "Finance and Sports labels restored. One module pair remains.",
    stateId: "yahuh_sort_2",
    unitId: "finance_sports_sorted",
    visibleRepair: "Finance and Sports regain category, source, and date labels.",
  }),
  freezeUnit({
    act: "sort",
    moduleIds: Object.freeze(["mail", "sponsored"]),
    reaction: "Mail and Sponsored labels restored. Single Source of Everything detected.",
    stateId: "yahuh_sort_3",
    unitId: "mail_sponsored_sorted",
    visibleRepair: "Mail and Sponsored regain channel and sponsorship labels.",
  }),
]);

export const YAHUH_RECONNECT_UNITS = Object.freeze([
  freezeUnit({
    act: "reconnect",
    moduleIds: Object.freeze(["news", "weather"]),
    reaction: "News and Weather channels reconnected. Two circuit pairs remain.",
    stateId: "yahuh_reconnect_1",
    unitId: "news_weather_channels",
    visibleRepair: "News and Weather reconnect to distinct source channels.",
  }),
  freezeUnit({
    act: "reconnect",
    moduleIds: Object.freeze(["finance", "sports"]),
    reaction: "Finance and Sports channels reconnected. One circuit pair remains.",
    stateId: "yahuh_reconnect_2",
    unitId: "finance_sports_channels",
    visibleRepair: "Finance and Sports reconnect to distinct source channels.",
  }),
  freezeUnit({
    act: "reconnect",
    moduleIds: Object.freeze(["mail", "sponsored"]),
    reaction: "Mail and Sponsored separated. Category switchboard restored.",
    stateId: "yahuh_reconnect_3",
    unitId: "mail_sponsored_channels",
    visibleRepair: "Mail and Sponsored separate and the sponsorship gate restores.",
  }),
]);

export const YAHUH_CAMPAIGN_UNITS = Object.freeze([
  ...YAHUH_SORT_UNITS,
  ...YAHUH_RECONNECT_UNITS,
]);

const UNIT_BY_ID = new Map(YAHUH_CAMPAIGN_UNITS.map((unit) => [unit.unitId, unit]));

function completedCount(campaignState) {
  if (!Array.isArray(campaignState?.completedUnitIds)) return 0;
  let count = 0;
  for (const unit of YAHUH_CAMPAIGN_UNITS) {
    if (campaignState.completedUnitIds[count] !== unit.unitId) break;
    count += 1;
  }
  return count;
}

export function describeYahuhUnit(unitId) {
  return UNIT_BY_ID.get(unitId)?.reaction ?? "Yahuh portal recovery saved.";
}

export function getNextYahuhUnit(campaignState = {}) {
  if (campaignState.secured || campaignState.act === "secured") return null;
  const count = completedCount(campaignState);
  if (count >= YAHUH_CAMPAIGN_UNITS.length) return null;
  if (count >= YAHUH_SORT_UNITS.length && !campaignState.midpointAcknowledged) return null;
  return YAHUH_CAMPAIGN_UNITS[count] ?? null;
}

export function calculateYahuhReadingOutcome({
  accepted = true,
  campaignState = {},
} = {}) {
  if (!accepted) {
    return Object.freeze({
      kind: "no-progress",
      reaction: "No Yahuh switchboard unit changed.",
      reason: "reading-not-accepted",
      unitId: null,
    });
  }

  const nextUnit = getNextYahuhUnit(campaignState);
  if (!nextUnit) {
    const secured = Boolean(campaignState.secured) || campaignState.act === "secured";
    const midpointPending = Boolean(campaignState.midpointDiscovered)
      && !campaignState.midpointAcknowledged;
    return Object.freeze({
      kind: "no-progress",
      reaction: secured
        ? "Yahuh Portal is already secured."
        : midpointPending
          ? "Acknowledge Single Source of Everything before another switchboard reading."
          : "No authored Yahuh unit is available.",
      reason: secured
        ? "already-secured"
        : midpointPending
          ? "midpoint-acknowledgement-required"
          : "no-unit-available",
      unitId: null,
    });
  }

  return Object.freeze({
    kind: nextUnit.act === "sort" ? "sort-unit" : "reconnect-unit",
    moduleIds: nextUnit.moduleIds,
    reaction: nextUnit.reaction,
    stateId: nextUnit.stateId,
    unitId: nextUnit.unitId,
    unitOrdinal: YAHUH_CAMPAIGN_UNITS.indexOf(nextUnit) + 1,
    unitTotal: YAHUH_CAMPAIGN_UNITS.length,
  });
}
