import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import path from "node:path";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

const cards = PLAYABLE_WALKTHROUGHS.searchish.passages.flatMap(({ challengingWords }) => challengingWords);
assert.equal(cards.length, 30, "Search-ish needs exactly three static vocabulary cards for each of ten passages");
assert.equal(new Set(cards.map(({ audioSrc }) => audioSrc)).size, 30, "Search-ish vocabulary audio paths must be unique");

for (const card of cards) {
  assert.match(card.audioSrc, /^\/audio\/searchish\/kokoro-heart\/searchish-\d{2}-[a-z0-9-]+\.m4a$/u);
  const metadata = await stat(path.resolve(`public${card.audioSrc}`));
  assert.ok(metadata.size > 1_000, `${card.audioSrc} must contain AAC audio`);
}

console.log("Validated 30 static Search-ish Kokoro Heart vocabulary cards.");
