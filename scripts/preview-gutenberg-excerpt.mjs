import { readFile } from "node:fs/promises";

const [id, lineText = "1", targetText = "285"] = process.argv.slice(2);
if (!id) throw new Error("Usage: node scripts/preview-gutenberg-excerpt.mjs <ebook-id> <start-line> [target-words]");
const startLine = Math.max(1, Number(lineText));
const targetWords = Math.max(50, Number(targetText));
const source = await readFile(new URL(`../docs/content/sources/gutenberg/${id}.txt`, import.meta.url), "utf8");
const tail = source.split("\n").slice(startLine - 1).join("\n");
const normalized = tail
  .replace(/\n(?=[^\n])/gu, " ")
  .replace(/\s+/gu, " ")
  .trim();
const sentences = normalized.match(/.+?(?:[.!?](?:[”’"])?)(?=\s+[A-Z“‘"]|$)/gu) ?? [normalized];
const selected = [];
let count = 0;
for (const sentence of sentences) {
  const words = sentence.trim().split(/\s+/u).filter(Boolean).length;
  if (selected.length && count >= targetWords && count + words > 325) break;
  selected.push(sentence.trim());
  count += words;
  if (count >= targetWords && count >= 250) break;
}
console.log(`SOURCE ${id} LINE ${startLine} WORDS ${count}\n`);
console.log(selected.join(" "));
