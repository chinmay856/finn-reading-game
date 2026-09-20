import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { PLAYABLE_WALKTHROUGHS } from '../apps/internet-recovery/playable-walkthroughs.js';
import { WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 } from '../content/wikiwhy-human-reviewed-passages.js';
const receiptUrl = new URL('../docs/content/WIKIWHY_PLAYTESTER_SYNC.json', import.meta.url);
const documentId = '1pRtfNeqCoI40G1lKGo2YOzL9BO0ev1qNrnZc9qfIT1Y';
const normalize = value => value.replace(/\s+/gu, ' ').trim();
const source = process.argv[2];
if (source) {
  const doc = JSON.parse(await readFile(source, 'utf8'));
  assert.equal(doc.documentId, documentId);
  const sections = [];
  for (const paragraph of doc.paragraphs) {
    if (/^Passage \d+:/u.test(paragraph.text)) sections.push([]);
    if (sections.length) sections.at(-1).push(normalize(paragraph.text));
  }
  const passages = PLAYABLE_WALKTHROUGHS.wikiwhy.passages;
  assert.equal(sections.length, passages.length);
  sections.forEach((section, index) => {
    const passage = passages[index];
    assert.equal(section[0], `Passage ${index + 1}: ${passage.title}`);
    const start = section.indexOf('Exact complete spoken passage') + 1;
    const end = section.indexOf('Vocabulary');
    assert.ok(start > 0 && end > start, passage.id);
    assert.equal(normalize(section.slice(start, end).join(' ')), normalize(passage.paragraphs.join(' ')), `${passage.id}: full spoken text`);
    const all = normalize(section.join(' '));
    for (const card of passage.challengingWords) {
      for (const text of [card.word, card.meaning, card.sentence]) assert.ok(all.includes(normalize(text)), `${passage.id}: ${text}`);
    }
    assert.ok(section.includes(passage.comprehension.question) || section.includes(`Exact question: ${passage.comprehension.question}`), `${passage.id}: question`);
    const choices = section.filter(text => /^[ABC](?: — Correct)?:/u.test(text));
    assert.deepEqual(choices, passage.comprehension.choices.map((choice, i) => `${'ABC'[i]}${choice.correct ? ' — Correct' : ''}: ${choice.text}`), `${passage.id}: displayed answer order`);
  });
  await writeFile(receiptUrl, JSON.stringify({ documentId, documentUrl: `https://docs.google.com/document/d/${documentId}/edit`, revisionId: doc.revisionId, verifiedAt: new Date().toISOString(), packetSha256: WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256, passageCount: passages.length, checks: ['ordered titles', 'complete spoken text', 'vocabulary definitions and playback phrases', 'questions', 'answer order and correct answer'] }, null, 2) + '\n');
}
const receipt = JSON.parse(await readFile(receiptUrl, 'utf8'));
assert.equal(receipt.documentId, documentId);
assert.equal(receipt.packetSha256, WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256, 'WikiWhy changed since the last verified Google Doc sync. Update the Doc, obtain connector get_document_text readback, and rerun this command with the readback JSON path.');
console.log(`WikiWhy Doc sync verified against ${receipt.revisionId}: ${receipt.passageCount} passages.`);
