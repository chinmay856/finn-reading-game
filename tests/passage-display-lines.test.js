import assert from "node:assert/strict";
import test from "node:test";

import { derivePassageDisplayLines } from "../reading-companion/passage-display-lines.js";
import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

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

test("keeps semicolons, commas, and colons inside their complete sentence", () => {
  const passage = { paragraphs: ["one two three, four five six; seven eight nine, ten eleven."] };
  assert.deepEqual(derivePassageDisplayLines(passage, { maximumWords: 6 }), passage.paragraphs);
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

test("keeps multi-initial author names together", () => {
  const paragraph = "An excerpt from On the Method of Zadig by T. H. Huxley. The tracks were recorded carefully.";
  assert.deepEqual(derivePassageDisplayLines({ paragraphs: [paragraph] }), [
    "An excerpt from On the Method of Zadig by T. H. Huxley.",
    "The tracks were recorded carefully.",
  ]);
});

test("keeps compact dotted initials such as H. G. Wells together", () => {
  const paragraph = "An excerpt from The Time Machine by H. G. Wells. The fire burnt brightly.";
  assert.deepEqual(derivePassageDisplayLines({ paragraphs: [paragraph] }), [
    "An excerpt from The Time Machine by H. G. Wells.",
    "The fire burnt brightly.",
  ]);
});

test("keeps numbered-list markers attached to the text they introduce", () => {
  const paragraph = "1. The number. 2. The integrity. 3. The skill of the witnesses.";
  assert.deepEqual(derivePassageDisplayLines({ paragraphs: [paragraph] }), [
    "1. The number.",
    "2. The integrity.",
    "3. The skill of the witnesses.",
  ]);
});

test("all campaign passages use complete sentences without mid-punctuation display breaks", () => {
  const passages = Object.values(PLAYABLE_WALKTHROUGHS).flatMap(({ passages: sitePassages }) => sitePassages);
  assert.equal(passages.length, 91);
  for (const passage of passages) {
    assert.equal(passage.sourceIntroductionLineCount, 1, `${passage.id}: source introduction split`);
    const standaloneParagraphs = new Set(passage.paragraphs.map((paragraph) => paragraph.trim()));
    assert.ok(
      passage.lines.every((line, index) => (
        !/[,;—–]["'’”)]*$/u.test(line)
        || standaloneParagraphs.has(line)
        || (passage.reviewStatus === "human-reviewed-frozen-2026-08-31" && passage.linePresentations[index]?.kind === "speaker")
        || (passage.reviewStatus === "human-reviewed-frozen-2026-08-31" && /—[”"]$/u.test(line))
      )),
      `${passage.id}: mid-sentence punctuation break`,
    );
    const renderedText = passage.lines.join(" ").replace(/\s+/gu, " ").trim();
    const sourceText = passage.paragraphs.join(" ").replace(/\s+/gu, " ").trim();
    assert.equal(renderedText, sourceText, `${passage.id}: display text changed`);
  }
});
