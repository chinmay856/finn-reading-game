import test from "node:test";
import assert from "node:assert/strict";

import { WIKIWHY_DIALOGUES } from "../apps/internet-recovery/wikiwhy-dialogues.js";
import { THREADIT_ACT_ONE_UNITS, THREADIT_CAMPAIGN_UNITS } from "../apps/internet-recovery/threadit-rules.js";
import { normalizeThreadItState } from "../apps/internet-recovery/threadit-state.js";
import { getThreadItCampaignView } from "../apps/internet-recovery/threadit-view.js";
import { FACEPLACE_CAMPAIGN_UNITS, FACEPLACE_FALSE_TRACKER_UNITS } from "../apps/internet-recovery/faceplace-rules.js";
import { normalizeFacePlaceState } from "../apps/internet-recovery/faceplace-state.js";
import { getFacePlaceCampaignView } from "../apps/internet-recovery/faceplace-view.js";

test("WikiWhy midpoint and completion exchanges explicitly explain the two halves and final repair", () => {
  assert.match(WIKIWHY_DIALOGUES["reverse-hack-ready"].body, /first repairs are saved.*second half/is);
  assert.match(WIKIWHY_DIALOGUES["reverse-hack-amy"].body, /first half.*second half/is);
  assert.match(WIKIWHY_DIALOGUES["site-secured-amy"].body, /restored.*sealed.*blocked.*site is complete/is);
  assert.match(WIKIWHY_DIALOGUES["site-secured"].heading, /WikiWhy fixed.*site is complete/is);
  assert.equal(WIKIWHY_DIALOGUES["reverse-hack-ready"].speaker, "chinmay");
  assert.equal(WIKIWHY_DIALOGUES["reverse-hack-amy"].speaker, "amy");
  assert.equal(WIKIWHY_DIALOGUES["site-secured-amy"].speaker, "amy");
  assert.equal(WIKIWHY_DIALOGUES["site-secured"].speaker, "chinmay");
});

test("ThreadIt view exposes exact seven-unit progress plus Amy and Chinmay midpoint/completion copy", () => {
  const midpointState = normalizeThreadItState({
    completedUnitIds: THREADIT_ACT_ONE_UNITS.map(({ unitId }) => unitId),
    midpointDiscovered: true,
  });
  const midpoint = getThreadItCampaignView(midpointState);
  assert.equal(midpoint.progress.display, "4 / 7 REPAIRS");
  assert.equal(midpoint.progress.totalUnitCount, THREADIT_CAMPAIGN_UNITS.length);
  assert.equal(midpoint.midpoint.repairedUnitCount, 4);
  assert.equal(midpoint.midpoint.nextUnitCount, 3);
  assert.match(midpoint.midpoint.amy, /First you restored.*Now trace/is);
  assert.match(midpoint.midpoint.chinmay, /created the agreement first/is);

  const secured = getThreadItCampaignView(normalizeThreadItState({
    completedUnitIds: THREADIT_CAMPAIGN_UNITS.map(({ unitId }) => unitId),
    midpointAcknowledged: true,
    midpointDiscovered: true,
  }));
  assert.equal(secured.progress.display, "7 / 7 REPAIRS");
  assert.equal(secured.securedPayoff.endOfSite, true);
  assert.match(secured.securedPayoff.amy, /Finn restored.*ThreadIt is fixed/is);
  assert.match(secured.securedPayoff.chinmay, /ten-person consensus/is);
});

test("FacePlace preserves the AVOCADO beat while exposing honest six-unit progress and two-character story beats", () => {
  const midpointState = normalizeFacePlaceState({
    completedUnitIds: FACEPLACE_FALSE_TRACKER_UNITS.map(({ unitId }) => unitId),
    midpointDiscovered: true,
  });
  const transient = getFacePlaceCampaignView(midpointState, { showActOneResult: true });
  assert.equal(transient.tracker.display, "AVOCADO%");
  assert.equal(transient.progress.display, "3 / 6 REPAIRS");

  const midpoint = getFacePlaceCampaignView(midpointState);
  assert.equal(midpoint.midpoint.repairedUnitCount, 3);
  assert.equal(midpoint.midpoint.nextUnitCount, 3);
  assert.match(midpoint.midpoint.amyLine, /first three repairs are saved.*honest zero/is);
  assert.match(midpoint.midpoint.chinmayLine, /AVOCADO.*dietary fiber/is);

  const secured = getFacePlaceCampaignView(normalizeFacePlaceState({
    completedUnitIds: FACEPLACE_CAMPAIGN_UNITS.map(({ unitId }) => unitId),
    midpointAcknowledged: true,
    midpointDiscovered: true,
  }));
  assert.equal(secured.progress.display, "6 / 6 REPAIRS");
  assert.equal(secured.securedPayoff.endOfSite, true);
  assert.match(secured.securedPayoff.amy, /Finn saved.*FacePlace is fixed/is);
  assert.match(secured.securedPayoff.chinmay, /AVOCADO/is);
});
