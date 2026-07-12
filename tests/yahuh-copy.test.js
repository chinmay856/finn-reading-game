import test from "node:test";
import assert from "node:assert/strict";

import {
  YAHUH_ASSET_IDS,
  YAHUH_ASSETS,
  YAHUH_COPY_IDS,
  YAHUH_PROVISIONAL_PORTAL_FIXTURE,
  getYahuhCopy,
} from "../apps/internet-recovery/yahuh-copy.js";

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

function assertCanonicalRecords(value) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value)) {
    assert.equal(value.canonical, true);
    assert.equal(value.provisional, false);
    assert.equal(value.testOnly, false);
  }
  for (const child of Object.values(value)) assertCanonicalRecords(child);
}

test("Yahuh copy follows the frozen six-module language and original mark", () => {
  assert.equal(getYahuhCopy(YAHUH_COPY_IDS.corruptStatus), "FRONT PAGE: EVERYTHING");
  assert.equal(getYahuhCopy(YAHUH_COPY_IDS.repairHeadline), "LABELS HELP YOU DECIDE WHAT MATTERS");
  assert.equal(getYahuhCopy(YAHUH_COPY_IDS.secureStatus), "CATEGORY SWITCHBOARD RESTORED");
  assert.match(getYahuhCopy(YAHUH_COPY_IDS.midpointBody), /one generated stream/u);
  assert.match(getYahuhCopy(YAHUH_COPY_IDS.midpointChinmay), /legacy clutter/u);
  assert.equal(getYahuhCopy(YAHUH_COPY_IDS.technoLabel), "DOG TOY — NOT BREAKING NEWS");
  assert.doesNotMatch(getYahuhCopy(YAHUH_COPY_IDS.corruptBody), /shopping/iu);
  assert.match(YAHUH_ASSETS[YAHUH_ASSET_IDS.mark], /yahuh-mark\.svg/u);
  assert.throws(() => getYahuhCopy("yahuh.unknown"), RangeError);
});

test("the canonical Yahuh fixture is complete, fictional, and safe", () => {
  const fixture = YAHUH_PROVISIONAL_PORTAL_FIXTURE;
  assertDeepFrozen(fixture);
  assertCanonicalRecords(fixture);
  assert.equal(fixture.fixtureId, "yahuh-portal-fixture-01");
  assert.match(fixture.notice, /Canonical fictional/u);
  assert.equal(fixture.modules.length, 6);
  assert.deepEqual(
    fixture.modules.map(({ category }) => category.name),
    ["NEWS", "WEATHER", "FINANCE", "SPORTS", "MAIL", "SPONSORED"],
  );
  assert.equal(new Set(fixture.modules.map(({ id }) => id)).size, 6);
  assert.equal(new Set(fixture.modules.map(({ channel }) => channel.id)).size, 6);
  assert.equal(new Set(fixture.modules.map(({ source }) => source.id)).size, 6);
  assert.ok(fixture.modules.every(({ accessibleRouteSummary }) => accessibleRouteSummary));
  assert.equal(fixture.modules.filter(({ sponsored }) => sponsored).length, 1);
  const mail = fixture.modules.find(({ category }) => category.name === "MAIL");
  assert.match(mail.summary, /No sender, recipient, address, or message body/iu);
  assert.doesNotMatch(JSON.stringify(mail), /@/u);
  assert.ok(["sender", "recipient", "address", "messageBody"].every((field) => !Object.hasOwn(mail, field)));
  assert.equal(fixture.mergedOrigin.timestamp, "2026-04-18T08:22:22.222Z");
  assert.equal(fixture.processes.length, 2);
  assert.ok(fixture.processes.every(({ relationship }) => /routed|retry job/iu.test(relationship)));
  assert.equal(fixture.unitAssignments.length, 6);
  assert.ok(fixture.unitAssignments.every(({ moduleIds }) => moduleIds.length === 2));
  assert.equal(fixture.blockedWrite.attemptedModuleIds.length, 6);
  assert.equal(fixture.evidence.slot, 5);
  assert.equal(fixture.evidence.routeFragmentId, "yahuh.route.single-stream-05");
  assert.equal(fixture.evidence.writerFingerprint, "yh-portalmerge-18d6");
});
