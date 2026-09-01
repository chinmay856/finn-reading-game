import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";
import {
  WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 as generatedChecksum,
  WIKIWHY_HUMAN_REVIEWED_PASSAGES,
} from "../content/wikiwhy-human-reviewed-passages.js";
import {
  packetSha256,
  parseWikiWhyHumanReviewedPacket,
  WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256,
} from "./lib/wikiwhy-human-reviewed-packet.mjs";

const packetUrl = new URL("../docs/content/human-reviewed/2026-08-31/wikiwhy/WIKIWHY_HUMAN_REVIEWED_PACKET.md", import.meta.url);
const markdown = await readFile(packetUrl, "utf8");
assert.equal(packetSha256(markdown), WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256, "frozen packet checksum");
assert.equal(generatedChecksum, WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256, "generated runtime checksum");

const parsed = parseWikiWhyHumanReviewedPacket(markdown);
assert.deepEqual(WIKIWHY_HUMAN_REVIEWED_PASSAGES, parsed, "generated runtime must exactly match the frozen packet parser");
assert.equal(parsed.length, 9, "nine playable WikiWhy records");

const mission = PLAYABLE_WALKTHROUGHS.wikiwhy;
assert.equal(mission.passages.length, 9, "nine effective WikiWhy runtime passages");
assert.equal(mission.repairFrames.length, 9, "nine reachable WikiWhy repair positions");
assert.equal(new Set(mission.repairFrames).size, 9, "nine distinct WikiWhy repair positions");
assert.deepEqual(mission.demotedPassageIds, ["wikiwhy-04"], "Faraday passage is explicitly demoted");

for (const [index, expected] of parsed.entries()) {
  const actual = mission.passages[index];
  assert.equal(actual.id, expected.id);
  assert.equal(actual.title, expected.title);
  assert.deepEqual(actual.paragraphs, expected.paragraphs, `${actual.id}: complete spoken/displayed paragraphs`);
  assert.deepEqual(actual.lines, expected.displayLines, `${actual.id}: exact display lines`);
  assert.deepEqual(actual.linePresentations, expected.linePresentations, `${actual.id}: line presentation metadata`);
  assert.equal(actual.comprehension.question, expected.comprehension.prompt, `${actual.id}: exact question`);
  assert.deepEqual(
    new Set(actual.comprehension.choices.map(({ text }) => text)),
    new Set([expected.comprehension.correct, ...expected.comprehension.distractors]),
    `${actual.id}: exact three answer texts`,
  );
  assert.equal(actual.comprehension.choices.filter(({ correct }) => correct).length, 1, `${actual.id}: one correct answer`);
  assert.equal(actual.comprehension.choices.find(({ correct }) => correct)?.text, expected.comprehension.correct, `${actual.id}: correct answer identity`);
  assert.equal(actual.comprehension.choices.findIndex(({ correct }) => correct), (index + "wikiwhy".length) % 3, `${actual.id}: deterministic answer shuffle`);
  assert.equal(actual.challengingWords.length, 3, `${actual.id}: three vocabulary cards`);
  for (const [wordIndex, card] of actual.challengingWords.entries()) {
    const expectedCard = expected.vocabulary[wordIndex];
    assert.equal(card.word, expectedCard.word, `${actual.id}: vocabulary word`);
    assert.equal(card.meaning, expectedCard.definition, `${actual.id}/${card.word}: definition`);
    assert.equal(card.sentence, expectedCard.sentence, `${actual.id}/${card.word}: playback phrase`);
    assert.equal(card.speechSentence, expectedCard.playbackPhrase, `${actual.id}/${card.word}: spoken playback phrase`);
    assert.match(card.audioSrc, new RegExp(`^/audio/wikiwhy/kokoro-heart/${actual.id}-[a-z0-9-]+\\.m4a$`, "u"));
    const metadata = await stat(path.resolve(`public${card.audioSrc}`));
    assert.ok(metadata.size > 1_000, `${actual.id}/${card.word}: generated vocabulary audio`);
  }
}

const sherlock = mission.passages.find(({ title }) => title === "Sherlock Holmes: A Scandal in Bohemia");
assert.deepEqual(
  [...new Set(sherlock.linePresentations.filter(({ speaker }) => speaker).map(({ speaker }) => speaker))],
  ["Watson", "Holmes"],
  "Sherlock speaker labels",
);
assert.ok(sherlock.linePresentations.some(({ kind }) => kind === "transition"), "Sherlock italic transition");
const alice = mission.passages.find(({ title }) => title === "Alice's Evidence");
assert.deepEqual(
  [...new Set(alice.linePresentations.filter(({ speaker }) => speaker).map(({ speaker }) => speaker))],
  ["King", "White Rabbit", "Queen", "Juryman", "Knave", "Alice"],
  "Alice speaker labels",
);
assert.equal(alice.linePresentations.filter(({ kind }) => kind === "transition").length, 2, "Alice italic transitions");

console.log("Validated the revised packet, nine effective WikiWhy passages, nine distinct repair positions, the Faraday demotion, exact questions and vocabulary, shuffled answers, speaker labels, transitions, and static audio.");
