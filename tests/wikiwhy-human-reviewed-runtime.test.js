import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";
import { WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 } from "../content/wikiwhy-human-reviewed-passages.js";

test("WikiWhy uses the revised human-reviewed nine-passage runtime", () => {
  const mission = PLAYABLE_WALKTHROUGHS.wikiwhy;
  assert.equal(WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256, "20cb946affb40fcf556308b52fae92a22fbcd476f269205f35babeb8a3290cc5");
  assert.deepEqual(mission.passages.map(({ id }) => id), [
    "wikiwhy-01", "wikiwhy-02", "wikiwhy-03", "wikiwhy-05", "wikiwhy-06",
    "wikiwhy-07", "wikiwhy-08", "wikiwhy-09", "wikiwhy-10",
  ]);
  assert.equal(mission.repairFrames.length, 9);
  assert.equal(new Set(mission.repairFrames).size, 9);
  assert.deepEqual(mission.passages.map(({ title }) => title), [
    "What Can an Animal-Vision Test Prove?",
    "The Expression of the Emotions in Man and Animals",
    "Of Studies",
    "The Time Machine",
    "Sherlock Holmes: A Scandal in Bohemia",
    "The Fixation of Belief",
    "The Ethics of Belief",
    "Alice's Evidence",
    "An Essay Concerning Human Understanding",
  ]);
  assert.deepEqual(mission.passages.map(({ comprehension }) => comprehension.choices.findIndex(({ correct }) => correct)), [1, 2, 0, 1, 2, 0, 1, 2, 0]);
});

test("the passage renderer supports generic speaker and transition metadata", async () => {
  const source = await readFile(new URL("../playable-missions.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../playable-missions.css", import.meta.url), "utf8");
  assert.match(source, /current\.linePresentations\?\.\[index\]/u);
  assert.match(source, /presentation\?\.kind === "transition"/u);
  assert.match(source, /presentation\?\.speaker/u);
  assert.match(styles, /\.passage p\.passage-transition/u);
  assert.match(styles, /\.passage-speaker-label/u);
});
