import assert from "node:assert/strict";
import test from "node:test";

import {
  FIRST_SIX_CANONICAL_PASSAGE_COUNT,
  FIRST_SIX_CANONICAL_PASSAGES,
} from "../content/first-six-canonical-reading-manuscript.js";
import { getPlayableWalkthrough } from "../apps/internet-recovery/playable-walkthroughs.js";

const EXPECTED_COUNTS = Object.freeze({ wikiwhy: 10, threadit: 9, faceplace: 8, mycorner: 9, yahuh: 9, viewtube: 8 });

test("reviewed first-six manuscript exposes 53 passages in canonical order", () => {
  assert.equal(FIRST_SIX_CANONICAL_PASSAGE_COUNT, 53);
  for (const [siteId, expectedCount] of Object.entries(EXPECTED_COUNTS)) {
    const deck = FIRST_SIX_CANONICAL_PASSAGES[siteId];
    assert.equal(deck.length, expectedCount);
    assert.deepEqual(deck.map((passage, index) => passage.id), Array.from({ length: expectedCount }, (_, index) => `${siteId}-${String(index + 1).padStart(2, "0")}`));
  }
});

test("every canonical record preserves its scored source introduction and exact vocabulary sentences", () => {
  for (const passage of Object.values(FIRST_SIX_CANONICAL_PASSAGES).flat()) {
    const spoken = passage.paragraphs.join(" ");
    assert.match(passage.paragraphs[0], /^(?:An? (?:.+? )?excerpt|This is)\b/u);
    if (/Public domain in the USA/u.test(passage.rights)) {
      assert.match(passage.paragraphs[0], /^An? (?:.+? )?excerpt\b/u);
      assert.doesNotMatch(passage.paragraphs[0], /\. It is\b/u);
    }
    assert.equal(spoken.split(/\s+/u).filter(Boolean).length, passage.spokenWordCount);
    assert.equal(passage.vocabulary.length, 3);
    for (const card of passage.vocabulary) {
      assert.equal(card.properNoun, false);
      assert.equal("pronunciation" in card, false);
      assert.ok(spoken.includes(card.sentence), `${passage.id}/${card.word}: exact source sentence`);
    }
  }
});

test("the first WikiWhy vocabulary set uses reviewed stretch words with contextual definitions", () => {
  const cards = FIRST_SIX_CANONICAL_PASSAGES.wikiwhy[0].vocabulary;
  assert.deepEqual(cards.map((card) => card.word), ["dichromatic", "pigments", "wavelengths"]);
  assert.match(cards[0].definition, /two primary types of color-sensing cells/u);
  assert.match(cards[1].definition, /absorb some wavelengths of light/u);
  assert.match(cards[2].definition, /different wavelengths of visible light correspond to different colors/u);
});

test("currently playable packet sites use canonical records and one visual frame per reading", () => {
  for (const siteId of ["wikiwhy", "threadit", "faceplace", "mycorner", "viewtube"]) {
    const walkthrough = getPlayableWalkthrough(siteId);
    assert.deepEqual(walkthrough.passages.map((passage) => passage.id), FIRST_SIX_CANONICAL_PASSAGES[siteId].map((passage) => passage.id));
    assert.equal(walkthrough.repairFrames.length, walkthrough.passages.length);
    for (const passage of walkthrough.passages) {
      assert.ok(passage.sourceIntroductionLineCount >= 1);
      assert.match(passage.lines[0], /^(?:(?:An?|Two) (?:.+? )?excerpts?|This is)\b/u);
      assert.equal(passage.challengingWords.length, 3);
    }
  }
});
