import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseReviewedGoogleDoc } from '../scripts/lib/reviewed-google-doc-packet.mjs';
import { PLAYABLE_WALKTHROUGHS } from '../apps/internet-recovery/playable-walkthroughs.js';
import { buildVocabularySpeechText } from '../speech/vocabulary-speech-text.js';

const root = new URL('../docs/content/human-reviewed/2026-09-20/google-docs/', import.meta.url);
const approval = JSON.parse(readFileSync(new URL('approval.json', root), 'utf8'));
const normalize = text => text.replace(/\s+/gu, ' ').trim();

for (const site of ['wikiwhy', 'faceplace', 'threadit', 'mycorner']) {
  test(`${site}: effective content matches the approved Google Doc revision exactly`, () => {
    const raw = readFileSync(new URL(`${site}.json`, root), 'utf8');
    const doc = JSON.parse(raw);
    assert.equal(createHash('sha256').update(raw).digest('hex'), approval.sources[site].sha256);
    assert.equal(doc.documentId, approval.sources[site].documentId);
    assert.equal(doc.revisionId, approval.sources[site].revisionId);
    const expected = parseReviewedGoogleDoc(site, doc);
    const mission = PLAYABLE_WALKTHROUGHS[site];
    assert.equal(mission.passages.length, expected.length);
    assert.equal(mission.repairFrames.length, expected.length);
    expected.forEach((record, index) => {
      const actual = mission.passages[index];
      assert.equal(normalize(actual.paragraphs.join(' ')), normalize(record.paragraphs.join(' ')), `${site}/${index}: complete text`);
      assert.equal(normalize(actual.lines.join(' ')), normalize(record.paragraphs.join(' ')), `${site}/${index}: rendered text`);
      assert.equal(actual.paragraphs[0], record.paragraphs[0], 'Reviewed introduction, not editorial title');
      assert.equal(actual.comprehension.question, record.comprehension.prompt);
      assert.deepEqual(actual.comprehension.choices.map(({ text, correct }) => ({ text, correct })), record.comprehension.orderedChoices, 'Exact answer wording and key before presentation shuffle');
      assert.deepEqual(actual.challengingWords.map(card => ({word:card.word, definition:card.meaning, sentence:card.sentence, playbackPhrase:card.speechSentence, properNoun:card.properNoun})), record.vocabulary);
      for (const card of actual.challengingWords) {
        const speech = buildVocabularySpeechText({word:card.word, definition:card.meaning, sentence:card.speechSentence});
        assert.ok(speech.endsWith(card.speechSentence), 'Do not paraphrase the reviewed playback phrase');
        assert.equal((speech.match(/In this passage/gu) ?? []).length, 1, 'No duplicated playback introduction');
        assert.doesNotMatch(card.sentence, /^(?:Playback|Exact playback phrase):/u);
      }
    });
  });
}

test('explicit second-review corrections and bibliographic titles remain in the effective runtime', () => {
  assert.equal(PLAYABLE_WALKTHROUGHS.faceplace.passages[5].title, 'Little Women');
  assert.equal(PLAYABLE_WALKTHROUGHS.threadit.passages[0].title, 'The Fox Without a Tail');
  assert.equal(PLAYABLE_WALKTHROUGHS.mycorner.passages[3].title, 'Huckleberry Finn');
  assert.equal(PLAYABLE_WALKTHROUGHS.mycorner.passages[0].lines[0], 'An excerpt from Alice’s Adventures in Wonderland by Lewis Carroll. Alice has changed size several times and meets a Caterpillar.');
});
