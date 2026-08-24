import assert from "node:assert/strict";
import { PUBLIC_DOMAIN_CAMPAIGN_PASSAGES, PUBLIC_DOMAIN_CAMPAIGN_PASSAGE_COUNT } from "../content/public-domain-campaign-passages.js";

const expected = Object.freeze({
  wikiwhy: 4,
  threadit: 2,
  faceplace: 2,
  mycorner: 3,
  yahuh: 2,
  viewtube: 2,
  "amaze-on": 11,
  "spotty-fi": 10,
  mapguess: 8,
  searchish: 10,
});

assert.equal(PUBLIC_DOMAIN_CAMPAIGN_PASSAGE_COUNT, 54);
for (const [siteId, count] of Object.entries(expected)) {
  const records = PUBLIC_DOMAIN_CAMPAIGN_PASSAGES[siteId];
  assert.equal(records.length, count, `${siteId}: passage count`);
  for (const record of records) {
    assert.match(record.paragraphs[0], /^An excerpt from .+ by .+\.$/u, `${record.id}: compact introduction`);
    assert(record.spokenWordCount >= 275 && record.spokenWordCount <= 325, `${record.id}: spoken word count`);
    assert.match(record.source.url, /^https:\/\/www\.gutenberg\.org\/ebooks\/\d+$/u, `${record.id}: source URL`);
    assert.equal(record.comprehension.distractors.length, 2, `${record.id}: comprehension choices`);
    assert.equal(record.vocabulary.length, 3, `${record.id}: vocabulary count`);
    for (const card of record.vocabulary) {
      assert.equal(card.properNoun, false, `${record.id}/${card.word}: non-proper noun`);
      assert(record.paragraphs[1].includes(card.sentence), `${record.id}/${card.word}: exact source sentence`);
      assert(new RegExp(`\\b${card.word.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\b`, "iu").test(card.sentence), `${record.id}/${card.word}: word in sentence`);
    }
  }
}

assert.equal(PUBLIC_DOMAIN_CAMPAIGN_PASSAGES.searchish[6].source.translator, "John Veitch", "searchish-07: translation metadata");

console.log(`Validated ${PUBLIC_DOMAIN_CAMPAIGN_PASSAGE_COUNT} public-domain passages and ${PUBLIC_DOMAIN_CAMPAIGN_PASSAGE_COUNT * 3} vocabulary cards.`);
