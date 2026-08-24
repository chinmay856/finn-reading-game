import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PUBLIC_DOMAIN_CAMPAIGN_SELECTION } from "./lib/public-domain-campaign-selection.mjs";
import { PUBLIC_DOMAIN_CAMPAIGN_EDITORIAL } from "./lib/public-domain-campaign-editorial.mjs";

const siteNames = Object.freeze({
  wikiwhy: "WikiWhy",
  threadit: "ThreadIt",
  faceplace: "FacePlace",
  mycorner: "MyCorner",
  yahuh: "Yahuh! Portal",
  viewtube: "ViewTube",
  "amaze-on": "Amaze-On",
  "spotty-fi": "Spotty-Fi",
  mapguess: "MapGuess",
  searchish: "Search-ish",
});

function words(value) {
  return value.split(/\s+/u).filter(Boolean);
}

function extract(source, startLine, targetWords = 285) {
  const tail = source.split("\n").slice(startLine - 1).join("\n");
  const normalized = tail
    .replace(/^\s*(?:CHAPTER|BOOK|PART|FIT)\b[^\n]*\n+/iu, "")
    .replace(/\[(?:Picture|Illustration|Sidenote)[^\]]*\]\s*/giu, "")
    .replace(/\n(?=[^\n])/gu, " ")
    .replace(/\{\d+[a-z]?\}/giu, "")
    .replace(/[_*]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
  const sentences = normalized.match(/.+?(?:[.!?](?:[”’"])?)(?=\s+[A-Z“‘"]|$)/gu) ?? [normalized];
  const selected = [];
  let count = 0;
  for (const sentence of sentences) {
    const sentenceWords = words(sentence).length;
    if (selected.length && count >= 230 && count + sentenceWords > 314) break;
    selected.push(sentence.trim());
    count += sentenceWords;
    if (count >= targetWords && count >= 250) break;
  }
  return selected.join(" ");
}

function sentenceForWord(excerpt, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = excerpt.match(new RegExp(`[^.!?]*\\b${escaped}\\b[^.!?]*[.!?]`, "iu"));
  assert(match, `No exact sentence found for vocabulary word ${word}`);
  return match[0].trim();
}

function siteIdFor(passageId) {
  return passageId.replace(/-\d+$/u, "");
}

const records = [];
for (const spec of PUBLIC_DOMAIN_CAMPAIGN_SELECTION) {
  const editorial = PUBLIC_DOMAIN_CAMPAIGN_EDITORIAL[spec.id];
  assert(editorial, `${spec.id}: editorial metadata`);
  assert.equal(editorial.distractors.length, 2, `${spec.id}: distractor count`);
  assert.equal(editorial.vocabulary.length, 3, `${spec.id}: vocabulary count`);
  const source = await readFile(path.resolve(`docs/content/sources/gutenberg/${spec.sourceId}.txt`), "utf8");
  const excerpt = extract(source, spec.startLine, spec.targetWords ?? 285);
  const introduction = `An excerpt from “${spec.title}” by ${spec.author}.`;
  const paragraphs = Object.freeze([introduction, excerpt]);
  const spokenWordCount = words(paragraphs.join(" ")).length;
  assert(spokenWordCount >= 275 && spokenWordCount <= 325, `${spec.id}: ${spokenWordCount} spoken words`);
  const vocabulary = editorial.vocabulary.map(([word, definition]) => Object.freeze({
    word,
    definition,
    sentence: sentenceForWord(excerpt, word),
    properNoun: false,
  }));
  records.push(Object.freeze({
    id: spec.id,
    siteId: siteIdFor(spec.id),
    title: spec.title,
    form: spec.form,
    spokenWordCount,
    paragraphs,
    source: Object.freeze({ label: spec.title, url: `https://www.gutenberg.org/ebooks/${spec.sourceId}`, translator: spec.translator ?? null }),
    rights: "Public domain in the USA per the linked Project Gutenberg item record.",
    selectionNote: `Exact excerpt begins at line ${spec.startLine} of the frozen local Project Gutenberg text snapshot docs/content/sources/gutenberg/${spec.sourceId}.txt.`,
    comprehension: Object.freeze({
      prompt: editorial.question,
      correct: editorial.correct,
      distractors: Object.freeze(editorial.distractors),
      correctFeedback: "Yes. That answer is directly supported by the passage.",
      tryAgainFeedback: "Not quite. Look for the detail that most directly answers the question.",
    }),
    vocabulary: Object.freeze(vocabulary),
    reviewStatus: "canonical-public-domain-campaign-subject-to-full-playtest",
  }));
}

assert.equal(records.length, 54, "campaign passage count");
assert.equal(Object.keys(PUBLIC_DOMAIN_CAMPAIGN_EDITORIAL).length, 54, "editorial record count");

const grouped = Object.fromEntries(Object.keys(siteNames).map((siteId) => [siteId, records.filter((record) => record.siteId === siteId)]));
const moduleText = `// Generated from the frozen public-domain source snapshots and editorial metadata.\n// Update scripts/lib/public-domain-campaign-*.mjs and rerun npm run generate:public-domain-campaign.\n\nconst DATA = ${JSON.stringify(grouped, null, 2)};\n\nfunction deepFreeze(value) {\n  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;\n  for (const child of Object.values(value)) deepFreeze(child);\n  return Object.freeze(value);\n}\n\nexport const PUBLIC_DOMAIN_CAMPAIGN_PASSAGES = deepFreeze(DATA);\nexport const PUBLIC_DOMAIN_CAMPAIGN_PASSAGE_COUNT = Object.values(PUBLIC_DOMAIN_CAMPAIGN_PASSAGES).flat().length;\n`;
await writeFile(path.resolve("content/public-domain-campaign-passages.js"), moduleText);

const markdown = [
  "# Public-Domain Campaign Canonical Reading Manuscript",
  "",
  "Status: canonical integration source for the scheduled first-six replacements and the Amaze-On, Spotty-Fi, MapGuess, and Search-ish reading libraries. Exact questions, vocabulary, and readability remain subject to the recorded full playtest.",
  "",
  "Every spoken introduction is one short sentence naming the work and author. Excerpts preserve the frozen Project Gutenberg wording after removal of transcription markup. Vocabulary sentences are copied from the same excerpt and definitions are specific to that use.",
  "",
];
for (const [siteId, siteRecords] of Object.entries(grouped)) {
  if (!siteRecords.length) continue;
  markdown.push(`## ${siteNames[siteId]}`, "");
  for (const record of siteRecords) {
    markdown.push(
      `### ${record.id} — ${record.title}`,
      "",
      `- **Form:** ${record.form}`,
      `- **Spoken word count:** ${record.spokenWordCount}`,
      `- **Source:** [${record.source.label}](${record.source.url})`,
      ...(record.source.translator ? [`- **Translator:** ${record.source.translator}`] : []),
      `- **Rights:** ${record.rights}`,
      `- **Selection note:** ${record.selectionNote}`,
      "",
      "**Spoken passage**",
      "",
      ...record.paragraphs.flatMap((paragraph) => [paragraph, ""]),
      "**Comprehension check**",
      "",
      `- Prompt: ${record.comprehension.prompt}`,
      `- Correct answer: ${record.comprehension.correct}`,
      `- Distractor A: ${record.comprehension.distractors[0]}`,
      `- Distractor B: ${record.comprehension.distractors[1]}`,
      `- Correct feedback: ${record.comprehension.correctFeedback}`,
      `- Try-again feedback: ${record.comprehension.tryAgainFeedback}`,
      "",
      "**Vocabulary packet**",
      "",
      ...record.vocabulary.map((card) => `- **${card.word}** — Definition: ${card.definition} Used in a sentence: ${card.sentence}`),
      "",
    );
  }
}
await writeFile(path.resolve("docs/content/PUBLIC_DOMAIN_CAMPAIGN_CANONICAL_MANUSCRIPT_2026-08-23.md"), `${markdown.join("\n")}\n`);
console.log(`Generated ${records.length} canonical public-domain passages and ${records.length * 3} vocabulary cards.`);
