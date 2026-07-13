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

test("chunks long authored prose into bounded view-owned lines", () => {
  const passage = { paragraphs: ["one two three four five six seven eight nine ten"] };
  assert.deepEqual(derivePassageDisplayLines(passage, { maximumWords: 4 }), [
    "one two three four",
    "five six seven eight",
    "nine ten",
  ]);
});
