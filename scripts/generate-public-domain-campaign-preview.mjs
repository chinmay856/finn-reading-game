import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PUBLIC_DOMAIN_CAMPAIGN_SELECTION } from "./lib/public-domain-campaign-selection.mjs";

const common = new Set("about after again against almost among because before being between both could every first from have into itself just like many might more most much must never only other over same should some such than that their them then there these they this those through under very were what when where which while will with would your".split(" "));

function words(value) {
  return value.split(/\s+/u).filter(Boolean);
}

function extract(source, startLine, targetWords = 285) {
  const tail = source.split("\n").slice(startLine - 1).join("\n");
  const normalized = tail
    .replace(/^\s*(?:CHAPTER|BOOK|PART|FIT)\b[^\n]*\n+/iu, "")
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

function vocabularyCandidates(excerpt) {
  const counts = new Map();
  for (const match of excerpt.matchAll(/\b[A-Za-z][A-Za-z’'-]{6,}\b/gu)) {
    const word = match[0].toLocaleLowerCase().replace(/[’']/gu, "'");
    if (common.has(word) || /^[A-Z]/u.test(match[0])) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[0].length - a[0].length || a[1] - b[1]).slice(0, 12).map(([word]) => word);
}

const sections = [];
for (const spec of PUBLIC_DOMAIN_CAMPAIGN_SELECTION) {
  const sourcePath = path.resolve(`docs/content/sources/gutenberg/${spec.sourceId}.txt`);
  const source = await readFile(sourcePath, "utf8");
  const excerpt = extract(source, spec.startLine, spec.targetWords ?? 285);
  const introduction = `An excerpt from “${spec.title}” by ${spec.author}.`;
  const spokenWordCount = words(`${introduction} ${excerpt}`).length;
  sections.push([
    `## ${spec.id} — ${spec.title}`,
    "",
    `- Source: https://www.gutenberg.org/ebooks/${spec.sourceId}`,
    `- Source snapshot: \`docs/content/sources/gutenberg/${spec.sourceId}.txt\``,
    `- Start line: ${spec.startLine}`,
    `- Form: ${spec.form}`,
    `- Spoken words: ${spokenWordCount}`,
    `- Vocabulary candidates: ${vocabularyCandidates(excerpt).join(", ")}`,
    "",
    introduction,
    "",
    excerpt,
    "",
  ].join("\n"));
}

const output = `# Public-domain campaign excerpt-boundary preview\n\nStatus: generated editorial preview; not runtime content\nGenerated: 2026-08-23\n\n${sections.join("\n")}`;
const outputPath = path.resolve("docs/content/PUBLIC_DOMAIN_CAMPAIGN_EXCERPT_PREVIEW_2026-08-23.md");
await writeFile(outputPath, output);
console.log(`Generated ${PUBLIC_DOMAIN_CAMPAIGN_SELECTION.length} excerpt previews at ${outputPath}`);
