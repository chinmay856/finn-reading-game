import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import path from "node:path";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";
import { normalizeVocabularySentenceForSpeech } from "../speech/vocabulary-speech-text.js";

const cards = Object.entries(PLAYABLE_WALKTHROUGHS).flatMap(([siteId, mission]) => (
  mission.passages.flatMap(({ challengingWords, id }) => challengingWords.map((card) => ({ card, id, siteId })))
));

assert.equal(cards.length, 276, "The ten-site campaign needs three static vocabulary cards for each of 92 passages");
assert.equal(new Set(cards.map(({ card }) => card.audioSrc)).size, cards.length, "Campaign vocabulary audio paths must be unique");

for (const { card, id, siteId } of cards) {
  assert.match(card.audioSrc, new RegExp(`^/audio/${siteId}/kokoro-heart/${id}-[a-z0-9-]+\\.m4a$`, "u"));
  const metadata = await stat(path.resolve(`public${card.audioSrc}`));
  assert.ok(metadata.size > 1_000, `${card.audioSrc} must contain AAC audio`);
  const spokenSentence = normalizeVocabularySentenceForSpeech(card.speechSentence ?? card.sentence);
  assert.doesNotMatch(spokenSentence, /(?:\([ivxlcdm]+\)|\[[^\]]*\]|--|[†‡※])/iu, `${id}/${card.word} contains unnormalized source notation`);
}

console.log(`Validated ${cards.length} static Kokoro Heart vocabulary cards across all ten campaign sites.`);
