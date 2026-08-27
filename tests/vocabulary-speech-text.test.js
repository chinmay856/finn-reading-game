import assert from "node:assert/strict";
import test from "node:test";

import {
  buildVocabularySpeechText,
  normalizeVocabularySentenceForSpeech,
} from "../speech/vocabulary-speech-text.js";
import {
  CAMPAIGN_VOCABULARY_SPEECH_EXCERPTS,
  vocabularySpeechExcerpt,
} from "../speech/campaign-vocabulary-speech-excerpts.js";

test("vocabulary speech introduces the source sentence as part of this passage", () => {
  assert.equal(
    buildVocabularySpeechText({
      word: "philanthropy",
      definition: "The effort to promote other people's welfare.",
      sentence: "Its philanthropy supported the library.",
    }),
    "philanthropy. Definition: The effort to promote other people's welfare. In this passage: Its philanthropy supported the library.",
  );
});

test("parenthesized outline numerals become natural spoken numbers", () => {
  assert.equal(
    normalizeVocabularySentenceForSpeech("Interest expresses (i) development, (ii) results, and (iii) inclination."),
    "Interest expresses one, development, two, results, and three, inclination.",
  );
});

test("source-note markers are omitted without changing meaningful Roman numerals", () => {
  assert.equal(
    normalizeVocabularySentenceForSpeech("The record [II] mentions World War II. A note [12] follows.†"),
    "The record mentions World War II. A note follows.",
  );
});

test("book-structure numerals and archival punctuation are made speakable", () => {
  assert.equal(
    normalizeVocabularySentenceForSpeech("CHAPTER V. A note] follows--then Part II begins."),
    "CHAPTER five. A note follows—then Part two begins.",
  );
});

test("campaign vocabulary can use a concise instructional excerpt without rewriting the passage", () => {
  assert.equal(
    vocabularySpeechExcerpt("spotty-fi-01", "carols", "A very long source sentence."),
    "I hear America singing, the varied carols I hear.",
  );
  assert.equal(
    vocabularySpeechExcerpt("wikiwhy-01", "dichromatic", "Dogs are dichromatic."),
    "Dogs are dichromatic.",
  );
});

test("every maintained speech excerpt is concise, complete, and still contains its vocabulary word", () => {
  assert.equal(Object.keys(CAMPAIGN_VOCABULARY_SPEECH_EXCERPTS).length, 28);
  for (const [key, excerpt] of Object.entries(CAMPAIGN_VOCABULARY_SPEECH_EXCERPTS)) {
    const word = key.slice(key.indexOf("/") + 1);
    assert.ok(excerpt.toLowerCase().includes(word), `${key}: speech excerpt should contain its vocabulary word`);
    assert.ok(excerpt.split(/\s+/u).length < 40, `${key}: speech excerpt should remain concise`);
    assert.match(excerpt, /[.!?]$/u, `${key}: speech excerpt should end cleanly`);
  }
});
