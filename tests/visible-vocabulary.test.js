import assert from "node:assert/strict";
import test from "node:test";
import { visibleVocabulary } from "../reading-companion/visible-vocabulary.js";
import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

test("all 267 reviewed campaign vocabulary cards remain visible without rewriting them", () => {
  let count = 0;
  for (const mission of Object.values(PLAYABLE_WALKTHROUGHS)) {
    for (const passage of mission.passages) {
      const cards = visibleVocabulary(passage);
      assert.equal(cards.length, 3, passage.id);
      cards.forEach((card, i) => assert.strictEqual(card, passage.challengingWords[i]));
      count += cards.length;
    }
  }
  assert.equal(count, 267);
});

test("unreviewed contextual sentences stay filtered; empty and proper-noun cards stay hidden", () => {
  const quote = { word: "test", sentence: "A test sentence.", properNoun: false };
  const context = { word: "test", sentence: "In this passage, test means a trial.", properNoun: false };
  const passage = { lines: [quote.sentence], challengingWords: [quote, context,
    { ...quote, sentence: " " }, { ...quote, properNoun: true }] };
  assert.deepEqual(visibleVocabulary(passage), [quote]);
  assert.deepEqual(visibleVocabulary({ ...passage, sourceDocumentId: "reviewed-doc" }), [quote, context]);
});
