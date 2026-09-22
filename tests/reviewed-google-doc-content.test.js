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

for (const site of ['wikiwhy', 'faceplace', 'threadit', 'mycorner', 'yahuh', 'searchish', 'amaze-on', 'viewtube', 'spotty-fi', 'mapguess']) {
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

test('Yahuh imports inline vocabulary, poem lines, approval, and replacement IDs', () => {
  const mission = PLAYABLE_WALKTHROUGHS.yahuh;
  assert.equal(mission.phaseOneCount, 6);
  assert.equal(mission.passages[0].title, 'Peoples and Creatures of the Moon');
  assert.deepEqual(mission.passages[2].challengingWords.map(card => card.word), ['scarcely', 'extraordinary', 'prodigiously']);
  assert.equal(mission.passages[2].challengingWords[0].meaning, 'Barely; almost not.');
  assert.equal(mission.passages[2].challengingWords[0].speechSentence, 'In this passage, Pinocchio has scarcely spoken when his nose grows.');
  const poem = mission.passages[6];
  assert.equal(poem.title, 'If—');
  assert.deepEqual(poem.lines, poem.paragraphs.map(line => line.trim()));
  assert.deepEqual(mission.replacedPassageIds, mission.passages.map(passage => passage.id));
  assert.equal(mission.passages[8].comprehension.choices.find(choice => choice.correct).text, 'Lead with verified information and explain the limits of evidence behind disputed claims.');
  assert.ok(mission.passages.every(passage => passage.challengingWords.every(card => card.audioSrc.endsWith('-reviewed-20260920.m4a'))));
});


test('Searchish and Amaze-On retain reviewed inline vocabulary, verse, and replacement mapping', () => {
  const amazon = PLAYABLE_WALKTHROUGHS['amaze-on'];
  const search = PLAYABLE_WALKTHROUGHS.searchish;
  assert.equal(amazon.passages[3].challengingWords[0].word, 'Omnibus');
  assert.equal(amazon.passages[3].challengingWords[0].meaning, 'a bus carrying a number of passengers.');
  assert.equal(amazon.passages[3].challengingWords[0].speechSentence, 'In this passage, Gatsby’s car becomes an omnibus for his guests.');
  assert.equal(amazon.passages[10].comprehension.choices.find(choice => choice.correct).text, 'It changes how we value waiting, rather than removing a temptation.');
  for (const [mission, index] of [[search, 4], [amazon, 5]]) {
    assert.deepEqual(mission.passages[index].lines, mission.passages[index].paragraphs.map(line => line.trim()));
    assert.deepEqual(mission.replacedPassageIds, mission.passages.map(p => p.id));
    assert.equal(mission.phaseOneCount, 6);
  }
});


test('final packets preserve colon answer keys, vocabulary playback, verse, and save migration IDs', () => {
  const video = PLAYABLE_WALKTHROUGHS.viewtube;
  const music = PLAYABLE_WALKTHROUGHS['spotty-fi'];
  assert.equal(video.passages[0].comprehension.choices.find(choice => choice.correct).text, 'Performances reached more people cheaply but lacked voices, color, and depth.');
  assert.equal(video.passages[1].challengingWords[0].speechSentence, 'In this passage, temperance keeps powerful acting from becoming excessive.');
  assert.equal(music.passages[2].title, 'The Gramophone');
  for (const index of [0, 1, 3, 6]) assert.deepEqual(music.passages[index].lines, music.passages[index].paragraphs.map(line => line.trim()));
  for (const mission of [video, music]) {
    assert.deepEqual(mission.replacedPassageIds, mission.passages.map(p => p.id));
    assert.equal(mission.phaseOneCount, 5);
  }
});

test('MapGuess imports the exact final Treasure Island sentence and replacement IDs', () => {
  const mission = PLAYABLE_WALKTHROUGHS.mapguess;
  assert.equal(mission.contentVersion, '2026-09-21-reviewed-docs');
  assert.deepEqual(mission.replacedPassageIds, mission.passages.map(passage => passage.id));
  assert.equal(mission.passages.length, 8);
  assert.equal(mission.passages[0].paragraphs.at(-1), '“You,” replied the doctor; “for you cannot hold your tongue. We are not the only men who know of this paper.”');
  assert.equal(mission.passages[0].challengingWords[0].speechSentence, 'In this passage, soundings help a ship approach the island safely.');
  assert.equal(mission.passages[0].comprehension.choices.find(choice => choice.correct).text, 'Knowing the destination does not remove the danger of others learning their plan.');
  assert.ok(mission.passages.every(passage => passage.challengingWords.every(card => card.audioSrc.endsWith('-reviewed-20260920.m4a'))));
});


test('ViewTube follows the current Google Doc order including both replacements', () => {
  const mission = PLAYABLE_WALKTHROUGHS.viewtube;
  assert.equal(mission.contentVersion, '2026-09-21-reviewed-docs');
  assert.deepEqual(mission.passages.map(p => p.title), [
    'The Photoplay', 'Hamlet', 'A Click Doesn’t Mean You Liked It', 'Fahrenheit 451',
    'Beyond Likes and Watchtime', '1984', 'Heads Up', 'Mindfulness for Your Health',
  ]);
});
