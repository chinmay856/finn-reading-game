import assert from "node:assert/strict";
import test from "node:test";

import {
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

test("only WikiWhy is speech-playable while ThreadIt exposes an honest structural runtime", () => {
  const playable = RECOVERY_SITES.filter(({ playable }) => playable);
  const runtimeAvailable = RECOVERY_SITES.filter(({ runtimeAvailable }) => runtimeAvailable);
  assert.deepEqual(playable.map(({ id }) => id), ["wikiwhy"]);
  assert.deepEqual(runtimeAvailable.map(({ id }) => id), ["wikiwhy", "threadit"]);
  assert.equal(getRecoverySite("threadit").playable, false);
  assert.equal(getRecoverySite("threadit").runtimeLabel, "CAMPAIGN TEST BUILD");
  assert.equal(getRecoverySite("unknown").id, "wikiwhy");
});

test("the hub keeps incoming choice to three cases", () => {
  const rotations = [
    INCOMING_SITE_IDS,
    getIncomingSiteIds({ threadItSecured: true }),
    getIncomingSiteIds({ wikiWhySecured: true }),
    getIncomingSiteIds({ threadItSecured: true, wikiWhySecured: true }),
  ];
  assert.deepEqual(rotations[1], ["wikiwhy", "mapguess", "viewtube"]);
  assert.deepEqual(rotations[2], ["threadit", "mapguess", "viewtube"]);
  assert.deepEqual(rotations[3], ["faceplace", "spottyfi", "searchish"]);
  for (const ids of rotations) {
    assert.equal(ids.length, 3);
    assert.equal(new Set(ids).size, 3);
    assert.ok(ids.every((id) => RECOVERY_SITES.some((site) => site.id === id)));
  }
});
