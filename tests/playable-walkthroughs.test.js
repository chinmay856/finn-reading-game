import assert from "node:assert/strict";
import test from "node:test";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

const expectations = Object.freeze({
  wikiwhy: Object.freeze({ count: 10, first: 6, secured: "_p7.png" }),
  threadit: Object.freeze({ count: 9, first: 6, secured: "_p14.png" }),
  faceplace: Object.freeze({ count: 8, first: 5, secured: "_p14.png" }),
  yahuh: Object.freeze({ count: 9, first: 6, secured: "_p13.png" }),
  viewtube: Object.freeze({ count: 8, first: 5, secured: "_p14.png" }),
  "spotty-fi": Object.freeze({ count: 10, first: 5, secured: "_p13.png" }),
  "amaze-on": Object.freeze({ count: 11, first: 6, secured: "_p15.png" }),
  mapguess: Object.freeze({ count: 8, first: 4, secured: "_p15.png" }),
});

test("the eight finished missions have one visual repair per passage", () => {
  assert.deepEqual(Object.keys(PLAYABLE_WALKTHROUGHS).sort(), Object.keys(expectations).sort());
  for (const [id, expected] of Object.entries(expectations)) {
    const mission = PLAYABLE_WALKTHROUGHS[id];
    assert.equal(mission.passages.length, expected.count, id);
    assert.equal(mission.repairFrames.length, expected.count, id);
    assert.equal(mission.phaseOneCount, expected.first, id);
    assert.match(mission.initialFrame, /^\/walkthroughs\//u);
    assert.ok(mission.securedFrame.endsWith(expected.secured), id);
    assert.ok(mission.ottoLesson.length > 80, `${id} has a specific Otto lesson`);
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
    mission.repairFrames.map((source) => Number(source.match(/_p(\d+)\.png$/u)?.[1])),
    [2, 3, 4, 5, 8, 10, 12, 14],
  );
  assert.deepEqual(
    Object.values(mission.transitionBeats).map(({ frame }) => Number(frame.match(/_p(\d+)\.png$/u)?.[1])),
    [9, 11, 13],
  );
  assert.equal(mission.superFrame.endsWith("_p6.png"), true);
  assert.equal(mission.checklistFrame.endsWith("_p7.png"), true);
});

test("player-facing midpoint copy contains no internal act or phase labels", () => {
  for (const mission of Object.values(PLAYABLE_WALKTHROUGHS)) {
    const copy = Object.values(mission.midpoint).flatMap(({ heading, text }) => [heading, text]).join(" ");
    assert.doesNotMatch(copy, /\b(?:act|phase)\s*[12]\b/iu, mission.id);
    assert.doesNotMatch(copy, /\bFinn\b/u, mission.id);
    assert.ok(mission.midpoint.auto.text.split("\n\n").length >= 3, `${mission.id} Otto copy has readable line breaks`);
  }
});
