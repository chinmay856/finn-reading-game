import test from "node:test";
import assert from "node:assert/strict";

import {
  YAHUH_CAMPAIGN_UNITS,
  YAHUH_RECONNECT_UNITS,
  YAHUH_SORT_UNITS,
  calculateYahuhReadingOutcome,
  getNextYahuhUnit,
} from "../apps/internet-recovery/yahuh-rules.js";

test("Yahuh freezes the exact three-sort plus three-reconnect contract", () => {
  assert.deepEqual(
    YAHUH_SORT_UNITS.map(({ unitId }) => unitId),
    ["news_weather_sorted", "finance_sports_sorted", "mail_sponsored_sorted"],
  );
  assert.deepEqual(
    YAHUH_RECONNECT_UNITS.map(({ unitId }) => unitId),
    ["news_weather_channels", "finance_sports_channels", "mail_sponsored_channels"],
  );
  assert.equal(YAHUH_CAMPAIGN_UNITS.length, 6);
  assert.ok(YAHUH_CAMPAIGN_UNITS.every(({ moduleIds }) => moduleIds.length === 2));
  assert.equal(new Set(YAHUH_CAMPAIGN_UNITS.flatMap(({ moduleIds }) => moduleIds)).size, 6);
});

test("Yahuh outcomes stop at the saved midpoint and secured boundaries", () => {
  const empty = { completedUnitIds: [], midpointAcknowledged: false };
  const first = calculateYahuhReadingOutcome({ campaignState: empty });
  assert.equal(first.kind, "sort-unit");
  assert.equal(first.unitId, "news_weather_sorted");

  const midpoint = {
    completedUnitIds: YAHUH_SORT_UNITS.map(({ unitId }) => unitId),
    midpointDiscovered: true,
    midpointAcknowledged: false,
  };
  assert.equal(getNextYahuhUnit(midpoint), null);
  assert.equal(calculateYahuhReadingOutcome({ campaignState: midpoint }).reason, "midpoint-acknowledgement-required");

  const acknowledged = { ...midpoint, midpointAcknowledged: true };
  assert.equal(getNextYahuhUnit(acknowledged).unitId, "news_weather_channels");

  const secured = {
    act: "secured",
    completedUnitIds: YAHUH_CAMPAIGN_UNITS.map(({ unitId }) => unitId),
    midpointAcknowledged: true,
    secured: true,
  };
  assert.equal(calculateYahuhReadingOutcome({ campaignState: secured }).reason, "already-secured");
});

test("a rejected reading never advances a Yahuh unit", () => {
  const outcome = calculateYahuhReadingOutcome({ accepted: false, campaignState: {} });
  assert.equal(outcome.kind, "no-progress");
  assert.equal(outcome.reason, "reading-not-accepted");
  assert.equal(outcome.unitId, null);
});
