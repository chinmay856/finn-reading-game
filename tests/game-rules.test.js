import assert from "node:assert/strict";
import test from "node:test";

import { calculateWikiWhyRepair, WIKIWHY_ACT_ONE_LIMIT } from "../apps/internet-recovery/wikiwhy-rules.js";
import { measureReadingSessionStrength } from "../game-rules/reading-session-strength.js";

test("reading strength remains theme-neutral and rewards comprehension", () => {
  const base = { accuracy: 90, progress: 0.95, wpm: 220 };
  const supported = measureReadingSessionStrength({ ...base, comprehension: "supported" });
  const notAttempted = measureReadingSessionStrength({ ...base, comprehension: "not-attempted" });
  const retryOffered = measureReadingSessionStrength({ ...base, comprehension: "retry-offered" });
  assert.ok(supported > notAttempted);
  assert.ok(notAttempted > retryOffered);
  assert.ok(supported > retryOffered);
  assert.ok(supported <= 1);
});

test("faster reading helps without a maximum-WPM penalty", () => {
  const base = { accuracy: 90, comprehension: "supported", progress: 0.95 };
  const stretch = measureReadingSessionStrength({ ...base, wpm: 250 });
  const faster = measureReadingSessionStrength({ ...base, wpm: 400 });
  assert.ok(faster >= stretch);
});

test("a strong reading gets a visible but non-blocking comprehension lift", () => {
  const readingResult = { accuracy: 91, progress: 0.96, wpm: 243 };
  const supported = calculateWikiWhyRepair({ comprehension: "supported", readingResult });
  const skipped = calculateWikiWhyRepair({ comprehension: "not-attempted", readingResult });
  const retryOffered = calculateWikiWhyRepair({ comprehension: "retry-offered", readingResult });
  assert.equal(supported.advance, 19);
  assert.equal(skipped.advance, 18);
  assert.equal(retryOffered.advance, 17);
});

test("every WikiWhy repair advances between 10 and 20 percent before the story limit", () => {
  const repair = calculateWikiWhyRepair({
    comprehension: "retry-offered",
    previousStability: 20,
    readingResult: { accuracy: 70, progress: 0.65, wpm: 100 },
  });
  assert.ok(repair.advance >= 10);
  assert.ok(repair.advance <= 20);
  assert.equal(repair.stability, 20 + repair.advance);
});

test("the final Act I repair clamps to the documented story turn", () => {
  const repair = calculateWikiWhyRepair({
    comprehension: "supported",
    previousStability: 75,
    readingResult: { accuracy: 100, progress: 1, wpm: 350 },
  });
  assert.equal(repair.stability, WIKIWHY_ACT_ONE_LIMIT);
  assert.equal(repair.advance, 5);
});
