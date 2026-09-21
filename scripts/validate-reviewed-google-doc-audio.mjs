import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PLAYABLE_WALKTHROUGHS } from '../apps/internet-recovery/playable-walkthroughs.js';
import { buildVocabularySpeechText } from '../speech/vocabulary-speech-text.js';

let count = 0;
for (const site of ['wikiwhy', 'faceplace', 'threadit', 'mycorner']) {
  const manifest = JSON.parse(await readFile(new URL(`../public/audio/${site}/kokoro-heart/manifest.json`, import.meta.url), 'utf8'));
  for (const passage of PLAYABLE_WALKTHROUGHS[site].passages) for (const card of passage.challengingWords) {
    const receipt = manifest[card.audioSrc];
    assert.ok(receipt, card.audioSrc);
    assert.equal(receipt.speechText, buildVocabularySpeechText({word:card.word,definition:card.meaning,sentence:card.speechSentence}));
    const bytes = await readFile(new URL(`../public${card.audioSrc}`, import.meta.url));
    assert.ok(bytes.length > 1000);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), receipt.sha256);
    count += 1;
  }
}
assert.equal(count, 105);
console.log('Verified all 105 reviewed vocabulary recordings against their exact synthesis text and audio hashes.');
