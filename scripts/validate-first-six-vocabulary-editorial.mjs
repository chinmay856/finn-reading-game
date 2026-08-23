import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const manuscript = readFileSync(fileURLToPath(new URL("../docs/content/FIRST_SIX_CANONICAL_READING_MANUSCRIPT_2026-08-21.md", import.meta.url)), "utf8");
const selections = JSON.parse(readFileSync(fileURLToPath(new URL("../docs/content/FIRST_SIX_VOCABULARY_REVIEWED_DATA_2026-08-22.json", import.meta.url)), "utf8"));
const table = readFileSync(fileURLToPath(new URL("../docs/content/FIRST_SIX_VOCABULARY_EDITORIAL_TABLE_2026-08-22.md", import.meta.url)), "utf8");
const bannedWeakWords = new Set(["attention", "behavioral", "conversation", "difference", "distance", "evidence", "experience", "experiment", "medical", "original", "position", "question", "sensitive", "sentence", "separate", "several", "statement", "surprised", "vacation"]);

assert.equal(Object.keys(selections).length, 53, "reviewed passage count");
let cardCount = 0;
for (const [passageId, cards] of Object.entries(selections)) {
  assert.equal(cards.length, 3, `${passageId}: card count`);
  assert.equal(new Set(cards.map(([word]) => word.toLocaleLowerCase())).size, 3, `${passageId}: unique words`);
  for (const [word, definition] of cards) {
    cardCount += 1;
    assert.ok(word.length >= 4, `${passageId}/${word}: usable word length floor`);
    assert.ok(!bannedWeakWords.has(word.toLocaleLowerCase()), `${passageId}/${word}: rejected weak word`);
    assert.ok(definition.length >= 18 && definition.length <= 180, `${passageId}/${word}: reader-facing definition length`);
    assert.doesNotMatch(definition, /^\(|\b(?:uncountable|transitive|not comparable|American spelling)\b/iu, `${passageId}/${word}: raw dictionary label`);
    assert.match(manuscript, new RegExp(`- \\*\\*${word.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\*\\* — Definition: ${definition.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}`, "u"), `${passageId}/${word}: canonical manuscript synchronized`);
    assert.ok(table.includes(`| \`${passageId}\` | **${word}** |`), `${passageId}/${word}: editorial table synchronized`);
  }
}
assert.equal(cardCount, 159, "reviewed vocabulary card count");
console.log(`Validated ${cardCount} reviewed vocabulary cards across ${Object.keys(selections).length} passages.`);
