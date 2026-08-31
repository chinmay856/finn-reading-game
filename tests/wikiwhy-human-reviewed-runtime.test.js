import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";
import { WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 } from "../content/wikiwhy-human-reviewed-passages.js";

test("WikiWhy uses the frozen human-reviewed ten-passage runtime", () => {
  const mission = PLAYABLE_WALKTHROUGHS.wikiwhy;
  assert.equal(WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256, "95e3bee0c555566229202fe36ad71768e65ffd1844b87562b0b20898b6980153");
  assert.deepEqual(mission.passages.map(({ id }) => id), Array.from({ length: 10 }, (_, index) => `wikiwhy-${String(index + 1).padStart(2, "0")}`));
  assert.equal(mission.repairFrames.length, 10);
  assert.deepEqual(mission.passages.map(({ title }) => title), [
    "What Can an Animal-Vision Test Prove?",
    "The Expression of the Emotions in Man and Animals",
    "Of Studies",
    "The Chemical History of a Candle",
    "The Time Machine",
    "Sherlock Holmes: A Scandal in Bohemia",
    "The Fixation of Belief",
    "The Ethics of Belief",
    "Alice's Evidence",
    "An Essay Concerning Human Understanding",
  ]);
  assert.deepEqual(mission.passages.map(({ comprehension }) => comprehension.choices.findIndex(({ correct }) => correct)), [1, 2, 0, 1, 2, 0, 1, 2, 0, 1]);
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
