import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const manuscriptUrl = new URL(
  "../docs/content/FIRST_SIX_CANONICAL_READING_MANUSCRIPT_2026-08-21.md",
  import.meta.url,
);
const manuscript = readFileSync(fileURLToPath(manuscriptUrl), "utf8");
const expectedCounts = Object.freeze({
  faceplace: 8,
  mycorner: 9,
  threadit: 9,
  viewtube: 8,
  wikiwhy: 10,
  yahuh: 9,
});

const sections = manuscript.split(/^## /mu).slice(1);
const records = [];

for (const section of sections) {
  const [site] = section.split("\n", 1);
  if (!(site in expectedCounts)) continue;
  const passages = section.split(/^### \d+\. /mu).slice(1);
  assert.equal(passages.length, expectedCounts[site], `${site} passage count`);
  for (const passage of passages) {
    const id = passage.match(/\*\*Canonical ID:\*\* `([^`]+)`/u)?.[1];
    const declaredWords = Number(passage.match(/\*\*Spoken word count:\*\* (\d+)/u)?.[1]);
    const spoken = passage
      .split("**Spoken passage**", 2)[1]
      ?.split("**Comprehension check**", 1)[0]
      ?.trim();
    const comprehension = passage
      .split("**Comprehension check**", 2)[1]
      ?.split("**Vocabulary packet**", 1)[0];
    const vocabulary = passage.split("**Vocabulary packet**", 2)[1] ?? "";
    const actualWords = spoken?.split(/\s+/u).filter(Boolean).length ?? 0;
    const cards = [...vocabulary.matchAll(/^- \*\*([^*]+)\*\* — Definition: (.+?) Used in a sentence: (.+)$/gmu)];

    assert.ok(id?.startsWith(`${site}-`), `${id ?? site}: canonical ID`);
    const introduction = spoken?.split(/\n\s*\n/u, 1)[0] ?? "";
    assert.match(introduction, /^(?:An? (?:.+? )?excerpt|This is)\b/u, `${id}: spoken source introduction`);
    if (/Public domain in the USA/u.test(passage)) {
      assert.match(introduction, /^An? (?:.+? )?excerpt\b/u, `${id}: concise public-domain introduction`);
      assert.doesNotMatch(introduction, /\. It is\b/u, `${id}: no second form sentence`);
    }
    assert.equal(actualWords, declaredWords, `${id}: declared word count`);
    assert.ok(actualWords >= 245 && actualWords <= 325, `${id}: 245–325 spoken words`);
    assert.match(comprehension ?? "", /- Prompt: .+\n- Correct answer: .+\n- Distractor A: .+\n- Distractor B: /u, `${id}: comprehension shape`);
    assert.equal(cards.length, 3, `${id}: exactly three vocabulary cards`);
    assert.doesNotMatch(vocabulary, /Pronunciation:/u, `${id}: TTS owns pronunciation`);
    for (const [, word, definition, sentence] of cards) {
      assert.ok(definition.trim().length >= 8, `${id}/${word}: definition`);
      assert.match(spoken, new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\b`, "iu"), `${id}/${word}: word occurs in passage`);
      const normalizedSpoken = spoken.replace(/\s+/gu, " ");
      const normalizedSentence = sentence.replace(/\s+/gu, " ");
      assert.ok(normalizedSpoken.includes(normalizedSentence), `${id}/${word}: preserved source sentence`);
    }
    records.push(id);
  }
}

assert.equal(records.length, 53, "total passage count");
assert.equal(new Set(records).size, 53, "canonical IDs are unique");
console.log(`Validated ${records.length} passages and ${records.length * 3} vocabulary cards.`);
