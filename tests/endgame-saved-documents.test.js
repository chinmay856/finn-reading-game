import test from 'node:test';
import assert from 'node:assert/strict';
import { savedEndgameDocuments, savedDocumentRepairStep } from '../apps/internet-recovery/endgame-saved-documents.js';
import { ENDGAME_SITE_FIXTURES, getEndgameRepairStep } from '../apps/internet-recovery/endgame-playtest-content.js';

test('all five lesson and explanation choices come from the matching saved documents', () => {
  const saved = Object.fromEntries(ENDGAME_SITE_FIXTURES.map(site => [site.id, {
    lesson: `Actual lesson for ${site.id}`, reflection: `My explanation for ${site.id}. `.repeat(80),
  }]));
  const docs = savedEndgameDocuments(ENDGAME_SITE_FIXTURES, saved, true);
  for (let siteIndex = 0; siteIndex < docs.length; siteIndex++) {
    for (const [repairIndex, field] of [[0, 'lesson'], [2, 'reflection']]) {
      const step = savedDocumentRepairStep(getEndgameRepairStep(siteIndex, repairIndex), docs, siteIndex);
      assert.equal(step.options.length, 5);
      assert.equal(step.options.find(option => option.correct).text, saved[docs[siteIndex].id][field].trim());
      for (const option of step.options) assert.ok(Object.values(saved).some(record => record[field].trim() === option.text));
      assert.equal(new Set(step.options.map(option => option.text)).size, 5);
    }
  }
});

test('missing saved explanations are identified rather than replaced with authored player text', () => {
  const docs = savedEndgameDocuments(ENDGAME_SITE_FIXTURES, {}, true);
  assert.match(docs[0].playerExplanation, /^No explanation was saved for/);
});
