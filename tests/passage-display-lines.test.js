import assert from "node:assert/strict";
import test from "node:test";

import { derivePassageDisplayLines } from "../reading-companion/passage-display-lines.js";

test("uses authored display lines unchanged when content provides them", () => {
  assert.deepEqual(derivePassageDisplayLines({ displayLines: [" First line. ", "Second line."] }), ["First line.", "Second line."]);
});

test("derives stable sentence lines before capture instead of reading DOM wrapping", () => {
  const passage = { paragraphs: ["One short sentence. A second short sentence!", "Last one?"] };
  assert.deepEqual(derivePassageDisplayLines(passage), ["One short sentence.", "A second short sentence!", "Last one?"]);
});

test("keeps a long sentence together by default so the guide never cuts a thought in half", () => {
  const passage = {
    paragraphs: [
      "Its lines are clean, its labels are confident, and its symbols seem to declare that the world has been measured and settled.",
    ],
  };
  assert.deepEqual(derivePassageDisplayLines(passage), passage.paragraphs);
});

test("chunks long authored prose at natural clause pauses", () => {
  const passage = { paragraphs: ["one two three, four five six; seven eight nine, ten eleven."] };
  assert.deepEqual(derivePassageDisplayLines(passage, { maximumWords: 6 }), [
    "one two three, four five six;",
    "seven eight nine, ten eleven.",
  ]);
});

test("does not invent a pause inside a long unpunctuated clause", () => {
  const line = "one two three four five six seven eight nine ten";
  assert.deepEqual(derivePassageDisplayLines({ paragraphs: [line] }, { maximumWords: 4 }), [line]);
});

test("does not mistake titles and abbreviations for sentence endings", () => {
  const paragraph = "Mr. and Mrs. Cuthbert waited for Dr. Spencer. Anne looked toward Bright River.";
  assert.deepEqual(derivePassageDisplayLines({ paragraphs: [paragraph] }), [
    "Mr. and Mrs. Cuthbert waited for Dr. Spencer.",
    "Anne looked toward Bright River.",
  ]);
});

test("joins a short connective clause to the phrase that follows it", () => {
  const paragraph = "The meadow faded into purple; while, far away, the birds continued their song.";
  assert.deepEqual(derivePassageDisplayLines({ paragraphs: [paragraph] }, { maximumWords: 6 }), [
    "The meadow faded into purple;",
    "while, far away, the birds continued their song.",
  ]);
});
