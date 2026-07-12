import assert from "node:assert/strict";
import test from "node:test";

import {
  AFTER_FACEPLACE_PROVISIONAL_INCOMING_SITE_IDS,
  getIncomingSiteIds,
  getRecoverySite,
  INCOMING_SITE_IDS,
  RECOVERY_SITES,
} from "../apps/internet-recovery/site-catalog.js";

test("the recovery map exposes ten unique wrapper-owned site identities", () => {
  assert.equal(RECOVERY_SITES.length, 10);
  assert.equal(new Set(RECOVERY_SITES.map(({ id }) => id)).size, 10);
  assert.equal(new Set(RECOVERY_SITES.map(({ name }) => name)).size, 10);
  assert.ok(RECOVERY_SITES.every(({ archetype, belief, previewImage }) => archetype && belief && previewImage));
});

test("only WikiWhy is speech-playable while eight sites expose honest structural runtimes", () => {
  const playable = RECOVERY_SITES.filter(({ playable }) => playable);
  const runtimeAvailable = RECOVERY_SITES.filter(({ runtimeAvailable }) => runtimeAvailable);
  assert.deepEqual(playable.map(({ id }) => id), ["wikiwhy"]);
  assert.deepEqual(runtimeAvailable.map(({ id }) => id), ["wikiwhy", "threadit", "faceplace", "mycorner", "yahuh", "viewtube", "searchish", "mapguess"]);
  assert.equal(getRecoverySite("threadit").playable, false);
  assert.equal(getRecoverySite("threadit").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.equal(getRecoverySite("faceplace").playable, false);
  assert.equal(getRecoverySite("faceplace").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.match(getRecoverySite("faceplace").markImage, /faceplace-mark\.svg/u);
  assert.equal(getRecoverySite("mycorner").playable, false);
  assert.equal(getRecoverySite("mycorner").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.equal(getRecoverySite("mycorner").description, "Every profile has become one CEO demo page.");
  assert.match(getRecoverySite("mycorner").markImage, /mycorner-mark\.svg/u);
  assert.equal(getRecoverySite("yahuh").playable, false);
  assert.equal(getRecoverySite("yahuh").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.equal(getRecoverySite("yahuh").description, "All information has been blended into homepage paste.");
  assert.match(getRecoverySite("yahuh").markImage, /yahuh-mark\.svg/u);
  assert.equal(getRecoverySite("viewtube").playable, false);
  assert.equal(getRecoverySite("viewtube").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.match(getRecoverySite("viewtube").markImage, /viewtube-mark\.svg/u);
  assert.equal(getRecoverySite("searchish").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.match(getRecoverySite("searchish").markImage, /searchish-mark\.svg/u);
  assert.equal(getRecoverySite("mapguess").playable, false);
  assert.equal(getRecoverySite("mapguess").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.match(getRecoverySite("mapguess").markImage, /mapguess-mark\.svg/u);
  assert.equal(getRecoverySite("unknown").id, "wikiwhy");
});

test("the hub keeps incoming choice to three cases", () => {
  const rotations = [
    INCOMING_SITE_IDS,
    getIncomingSiteIds({ facePlaceSecured: true }),
    getIncomingSiteIds({ threadItSecured: true }),
    getIncomingSiteIds({ wikiWhySecured: true }),
    getIncomingSiteIds({ threadItSecured: true, wikiWhySecured: true }),
    getIncomingSiteIds({ facePlaceSecured: true, threadItSecured: true, wikiWhySecured: true }),
  ];
  assert.deepEqual(rotations[1], INCOMING_SITE_IDS);
  assert.deepEqual(rotations[2], ["wikiwhy", "mapguess", "viewtube"]);
  assert.deepEqual(rotations[3], ["threadit", "mapguess", "viewtube"]);
  assert.deepEqual(rotations[4], ["faceplace", "spottyfi", "searchish"]);
  assert.deepEqual(rotations[5], AFTER_FACEPLACE_PROVISIONAL_INCOMING_SITE_IDS);
  for (const ids of rotations) {
    assert.equal(ids.length, 3);
    assert.equal(new Set(ids).size, 3);
    assert.ok(ids.every((id) => RECOVERY_SITES.some((site) => site.id === id)));
  }
});
