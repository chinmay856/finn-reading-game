import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const manuscriptUrl = new URL("../docs/content/FIRST_SIX_CANONICAL_READING_MANUSCRIPT_2026-08-21.md", import.meta.url);
const selectionsUrl = new URL("../docs/content/FIRST_SIX_VOCABULARY_REVIEWED_DATA_2026-08-22.json", import.meta.url);
const tableUrl = new URL("../docs/content/FIRST_SIX_VOCABULARY_EDITORIAL_TABLE_2026-08-22.md", import.meta.url);
const selections = JSON.parse(readFileSync(fileURLToPath(selectionsUrl), "utf8"));
let manuscript = readFileSync(fileURLToPath(manuscriptUrl), "utf8");
const segmenter = new Intl.Segmenter("en-US", { granularity: "sentence" });

function sentenceContaining(spoken, word) {
  const body = spoken.split(/\n\s*\n/u).slice(1).join(" ").replace(/\s+/gu, " ").trim();
  const protectedBody = body
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St)\./gu, "$1∯")
    .replace(/\b([A-Z])\.(?=\s+[A-Z][a-z])/gu, "$1∯")
    .replace(/\b([AP])\.M\./gu, "$1∯M∯");
  const pattern = new RegExp(`(^|[^\\p{L}])${word.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}([^\\p{L}]|$)`, "iu");
  const sentence = [...segmenter.segment(protectedBody)].map(({ segment }) => segment.trim()).find((candidate) => pattern.test(candidate));
  return sentence?.replaceAll("∯", ".") ?? null;
}

const replacements = [];
const tableRows = [];
for (const [passageId, cards] of Object.entries(selections)) {
  assert.equal(cards.length, 3, `${passageId}: exactly three reviewed cards`);
  const idMarker = `**Canonical ID:** \`${passageId}\``;
  const idIndex = manuscript.indexOf(idMarker);
  assert.notEqual(idIndex, -1, `${passageId}: manuscript record exists`);
  const spokenStart = manuscript.indexOf("**Spoken passage**", idIndex) + "**Spoken passage**".length;
  const spokenEnd = manuscript.indexOf("**Comprehension check**", spokenStart);
  const vocabularyHeading = manuscript.indexOf("**Vocabulary packet**", spokenEnd);
  const blockStart = vocabularyHeading + "**Vocabulary packet**".length;
  const nextRecord = manuscript.indexOf("\n\n### ", blockStart);
  const nextSite = manuscript.indexOf("\n\n## ", blockStart);
  const candidates = [nextRecord, nextSite, manuscript.length].filter((index) => index >= 0);
  const blockEnd = Math.min(...candidates);
  const spoken = manuscript.slice(spokenStart, spokenEnd).trim();
  const lines = cards.map(([word, definition]) => {
    const sentence = sentenceContaining(spoken, word);
    assert.ok(sentence, `${passageId}/${word}: exact sentence containing word`);
    assert.ok(!/^\(/u.test(definition), `${passageId}/${word}: no raw dictionary grammar label`);
    tableRows.push({ passageId, word, definition, sentence });
    return `- **${word}** — Definition: ${definition} Used in a sentence: ${sentence}`;
  });
  replacements.push({ start: blockStart, end: blockEnd, text: `\n\n${lines.join("\n\n")}` });
}

for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  manuscript = `${manuscript.slice(0, replacement.start)}${replacement.text}${manuscript.slice(replacement.end)}`;
}
writeFileSync(fileURLToPath(manuscriptUrl), manuscript);

const displayNames = Object.freeze({ wikiwhy: "WikiWhy", threadit: "ThreadIt", faceplace: "FacePlace", mycorner: "MyCorner", yahuh: "Yahuh! Portal", viewtube: "ViewTube" });
const escapeCell = (value) => String(value).replaceAll("|", "\\|").replace(/\s+/gu, " ").trim();
const sections = [];
for (const siteId of Object.keys(displayNames)) {
  const rows = tableRows.filter((row) => row.passageId.startsWith(`${siteId}-`));
  sections.push(`## ${displayNames[siteId]}\n\n| Passage | Word | Context-specific meaning | Exact passage sentence |\n| --- | --- | --- | --- |\n${rows.map((row) => `| \`${row.passageId}\` | **${escapeCell(row.word)}** | ${escapeCell(row.definition)} | ${escapeCell(row.sentence)} |`).join("\n")}`);
}
const table = `# First Six Vocabulary Editorial Table — 2026-08-22\n\nStatus: reviewed replacement set for the 53-passage canonical manuscript. Every card uses a non-proper-noun word from the passage, a reader-facing definition for the sense used in context, and the exact source sentence. Candidate selection used a first-dictionary-sense check as a rejection gate; misleading secondary-sense candidates were discarded.\n\n${sections.join("\n\n")}\n`;
writeFileSync(fileURLToPath(tableUrl), table);
console.log(`Rebuilt ${tableRows.length} vocabulary cards and wrote ${fileURLToPath(tableUrl)}`);
