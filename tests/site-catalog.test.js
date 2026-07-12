import assert from "node:assert/strict";
import test from "node:test";

import { getRecoverySite, INCOMING_SITE_IDS, RECOVERY_SITES } from "../apps/internet-recovery/site-catalog.js";

test("the recovery map exposes ten unique wrapper-owned site identities", () => {
  assert.equal(RECOVERY_SITES.length, 10);
  assert.equal(new Set(RECOVERY_SITES.map(({ id }) => id)).size, 10);
  assert.equal(new Set(RECOVERY_SITES.map(({ name }) => name)).size, 10);
  assert.ok(RECOVERY_SITES.every(({ archetype, belief, previewImage }) => archetype && belief && previewImage));
});

test("only WikiWhy can launch gameplay while the other designs remain previews", () => {
  const playable = RECOVERY_SITES.filter(({ playable }) => playable);
  assert.deepEqual(playable.map(({ id }) => id), ["wikiwhy"]);
  assert.equal(getRecoverySite("threadit").playable, false);
  assert.equal(getRecoverySite("unknown").id, "wikiwhy");
});

test("the hub keeps incoming choice to three cases", () => {
  assert.equal(INCOMING_SITE_IDS.length, 3);
  assert.equal(new Set(INCOMING_SITE_IDS).size, 3);
  assert.ok(INCOMING_SITE_IDS.every((id) => RECOVERY_SITES.some((site) => site.id === id)));
});
