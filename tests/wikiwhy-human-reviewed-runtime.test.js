import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";
import { WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 } from "../content/wikiwhy-human-reviewed-passages.js";

import { WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 as expectedChecksum } from "../scripts/lib/wikiwhy-human-reviewed-packet.mjs";

test("WikiWhy uses the revised human-reviewed nine-passage runtime", () => {
  const mission = PLAYABLE_WALKTHROUGHS.wikiwhy;
  assert.equal(WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256, expectedChecksum);
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
    "Were the stars made, or did they just happen?",
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


test("WikiWhy contains the approved clarity edits and replacement", () => {
  const p = PLAYABLE_WALKTHROUGHS.wikiwhy.passages;
  assert.match(p[0].paragraphs.join(" "), /If the mouse perceives/);
  assert.match(p[0].paragraphs.join(" "), /that mice cannot be taught/);
  assert.doesNotMatch(p[0].paragraphs.join(" "), /\bdancers?\b/);
  assert.equal(p[5].challengingWords.map(w=>w.word).join(","), "scow,speckled,joggle");
  assert.ok(p.every(x=>!/[Ff]ixation of [Bb]elief|Chemical History of a Candle/.test(x.title)));
});
