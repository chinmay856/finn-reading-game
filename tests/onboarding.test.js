import assert from "node:assert/strict";
import test from "node:test";
import { readFile, stat } from "node:fs/promises";
import onboarding from "../apps/internet-recovery/onboarding-content.js";
import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

test("tutorial uses the actual initial passage and first repair without copying content", () => {
  assert.equal(onboarding.passage, PLAYABLE_WALKTHROUGHS.wikiwhy.passages[0]);
  assert.equal(onboarding.frames.before, PLAYABLE_WALKTHROUGHS.wikiwhy.initialFrame);
  assert.equal(onboarding.frames.after, PLAYABLE_WALKTHROUGHS.wikiwhy.repairFrames[0]);
  assert.equal(onboarding.intro.length, 8);
});

test("every story portrait and repair asset exists", async () => {
  for (const src of [...Object.values(onboarding.portraits).map(item => item.image), ...Object.values(onboarding.frames)]) {
    assert.ok((await stat(new URL(`../public${src.split("?")[0]}`, import.meta.url))).size > 0, src);
  }
});

test("tour is a demonstration without speech or campaign writes", async () => {
  const script = await readFile(new URL("../onboarding.js", import.meta.url), "utf8");
  assert.doesNotMatch(script, /getUserMedia|ReadingAttemptController|persistPlayableMissionSequence/);
  const html = await readFile(new URL("../onboarding.html", import.meta.url), "utf8");
  assert.match(html, /id="tourBack"/);
  assert.doesNotMatch(html, /id="intro(?:duction)?(?:Back|Count)"/);
});
