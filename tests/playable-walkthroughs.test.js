import assert from "node:assert/strict";
import test from "node:test";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

const assetPath = (source) => source.split("?", 1)[0];

const expectations = Object.freeze({
  wikiwhy: Object.freeze({ count: 10, first: 6, pages: [2, 3, 4, 5, 6, 7, 13, 14, 15, 7], secured: "_p7.png" }),
  threadit: Object.freeze({ count: 9, first: 6, pages: [2, 3, 4, 5, 6, 7, 10, 11, 12], secured: "_p13.png" }),
  faceplace: Object.freeze({ count: 8, first: 5, pages: [2, 3, 4, 5, 6, 9, 10, 11], secured: "_p12.png" }),
  mycorner: Object.freeze({ count: 9, first: 4, pages: [2, 3, 4, 5, 8, 9, 10, 11, 12], secured: "_p12.png" }),
  yahuh: Object.freeze({ count: 9, first: 6, pages: [2, 3, 4, 5, 6, 7, 10, 11, 12], secured: "_p13.png" }),
  viewtube: Object.freeze({ count: 8, first: 5, pages: [2, 3, 4, 5, 6, 9, 10, 11], secured: "_p12.png" }),
  "spotty-fi": Object.freeze({ count: 10, first: 5, pages: [2, 3, 4, 5, 6, 9, 10, 11, 12, 13], secured: "_p13.png" }),
  "amaze-on": Object.freeze({ count: 11, first: 6, pages: [2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14], secured: "_p15.png" }),
  searchish: Object.freeze({ count: 10, first: 6, pages: [2, 3, 4, 5, 6, 7, 10, 11, 12, 13], secured: "_p14.png" }),
  mapguess: Object.freeze({ count: 8, first: 4, pages: [2, 3, 4, 5, 8, 10, 12, 14], secured: "_p15.png" }),
});

test("the ten finished missions have one visual advance per passage", () => {
  assert.deepEqual(Object.keys(PLAYABLE_WALKTHROUGHS).sort(), Object.keys(expectations).sort());
  for (const [id, expected] of Object.entries(expectations)) {
    const mission = PLAYABLE_WALKTHROUGHS[id];
    assert.equal(mission.passages.length, expected.count, id);
    assert.equal(mission.repairFrames.length, expected.count, id);
    assert.equal(mission.phaseOneCount, expected.first, id);
    assert.deepEqual(mission.repairFrames.map((source) => Number(assetPath(source).match(/_p(\d+)\.png$/u)?.[1])), expected.pages, id);
    assert.match(mission.initialFrame, /^\/walkthroughs\//u);
    assert.ok(assetPath(mission.securedFrame).endsWith(expected.secured), id);
    assert.ok(mission.autoLesson.length > 80, `${id} has a specific Auto lesson`);
  }
});

test("every passage has authored lines and loopable comprehension choices", () => {
  for (const mission of Object.values(PLAYABLE_WALKTHROUGHS)) {
    for (const passage of mission.passages) {
      assert.ok(passage.lines.length > 0, passage.id);
      const wordCount = passage.lines.join(" ").trim().split(/\s+/u).length;
      if (["canonical-first-playtest-subject-to-recorded-review", "canonical-public-domain-campaign-subject-to-full-playtest"].includes(passage.reviewStatus)) {
        assert.ok(wordCount >= 245 && wordCount <= 325, `${passage.id}: ${wordCount} words`);
      } else if (passage.reviewStatus === "candidate-provisional-mapguess-playtest") {
        assert.ok(wordCount >= 200 && wordCount <= 400, `${passage.id}: ${wordCount} words`);
      } else {
        assert.ok(wordCount <= 45, `${passage.id}: ${wordCount} words`);
      }
      assert.equal(passage.comprehension.choices.length, 3, passage.id);
      assert.equal(passage.comprehension.choices.filter(({ correct }) => correct).length, 1, passage.id);
      assert.ok(passage.comprehension.tryAgainFeedback, passage.id);
    }
  }
});

test("MapGuess preserves the approved repeated moving-target sequence", () => {
  const mission = PLAYABLE_WALKTHROUGHS.mapguess;
  assert.deepEqual(
    mission.repairFrames.map((source) => Number(assetPath(source).match(/_p(\d+)\.png$/u)?.[1])),
    [2, 3, 4, 5, 8, 10, 12, 14],
  );
  assert.deepEqual(
    Object.values(mission.transitionBeats).map(({ frame }) => Number(assetPath(frame).match(/_p(\d+)\.png$/u)?.[1])),
    [9, 11, 13],
  );
  assert.equal(assetPath(mission.superFrame).endsWith("_p6.png"), true);
  assert.equal(assetPath(mission.checklistFrame).endsWith("_p7.png"), true);
});

test("passage decks map one-to-one onto every visible lock-in row", () => {
  const expectedLockPages = Object.freeze({
    threadit: [10, 11, 12],
    faceplace: [9, 10, 11],
    viewtube: [9, 10, 11],
  });
  for (const [siteId, pages] of Object.entries(expectedLockPages)) {
    const mission = PLAYABLE_WALKTHROUGHS[siteId];
    const actual = mission.repairFrames.slice(mission.phaseOneCount).map((source) => Number(assetPath(source).match(/_p(\d+)\.png$/u)?.[1]));
    assert.deepEqual(actual, pages, siteId);
  }
});

test("MyCorner preserves the reviewed twelve-state identity-check sequence", () => {
  const mission = PLAYABLE_WALKTHROUGHS.mycorner;
  assert.deepEqual(
    mission.repairFrames.map((source) => Number(assetPath(source).match(/_p(\d+)\.png$/u)?.[1])),
    [2, 3, 4, 5, 8, 9, 10, 11, 12],
  );
  assert.equal(assetPath(mission.superFrame).endsWith("_p6.png"), true);
  assert.equal(assetPath(mission.checklistFrame).endsWith("_p7.png"), true);
  assert.equal(mission.passages.every(({ id }, index) => id === `mycorner-${String(index + 1).padStart(2, "0")}`), true);
  assert.equal(mission.passages.flatMap(({ challengingWords }) => challengingWords).every(({ audioSrc }) => audioSrc?.startsWith("/audio/mycorner/kokoro-heart/")), true);
});

test("Search-ish preserves the reviewed fourteen-state search hierarchy sequence", () => {
  const mission = PLAYABLE_WALKTHROUGHS.searchish;
  assert.deepEqual(
    mission.repairFrames.map((source) => Number(assetPath(source).match(/_p(\d+)\.png$/u)?.[1])),
    [2, 3, 4, 5, 6, 7, 10, 11, 12, 13],
  );
  assert.equal(assetPath(mission.superFrame).endsWith("_p8.png"), true);
  assert.equal(assetPath(mission.checklistFrame).endsWith("_p9.png"), true);
  assert.equal(assetPath(mission.securedFrame).endsWith("_p14.png"), true);
  assert.equal(mission.passages.every(({ id }, index) => id === `searchish-${String(index + 1).padStart(2, "0")}`), true);
  assert.equal(mission.passages.flatMap(({ challengingWords }) => challengingWords).every(({ audioSrc }) => audioSrc?.startsWith("/audio/searchish/kokoro-heart/")), true);
});

test("player-facing midpoint copy contains no internal act or phase labels", () => {
  for (const mission of Object.values(PLAYABLE_WALKTHROUGHS)) {
    const copy = Object.values(mission.midpoint).flatMap(({ heading, text }) => [heading, text]).join(" ");
    assert.doesNotMatch(copy, /\b(?:act|phase)\s*[12]\b/iu, mission.id);
    assert.doesNotMatch(copy, /\bFinn\b/u, mission.id);
    assert.ok(mission.midpoint.auto.text.split("\n\n").length >= 3, `${mission.id} Auto copy has readable line breaks`);
  }
});
