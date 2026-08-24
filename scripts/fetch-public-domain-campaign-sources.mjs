import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const gutenbergIds = [
  13, 23, 44, 46, 59, 84, 103, 120, 148, 205, 381, 408, 512, 521, 535, 550, 829, 833, 844,
  944, 1022, 1322, 2376, 2627, 2945, 3053, 3300, 5116, 6019, 6456, 7256, 9662,
  1315, 1661, 10615, 10616, 10761, 11339, 14474, 16287, 16643, 18338, 19484,
  2657, 30755, 37423, 43855, 42324, 50189, 55749, 64908, 65274,
  72890, 73893, 308, 575, 1228,
];

const outputDirectory = path.resolve("docs/content/sources/gutenberg");
await mkdir(outputDirectory, { recursive: true });

for (const id of gutenbergIds) {
  const outputPath = path.join(outputDirectory, `${id}.txt`);
  let existing = "";
  try { existing = await readFile(outputPath, "utf8"); } catch {}
  if (existing.includes("START OF THE PROJECT GUTENBERG")) {
    console.log(`Reused ${id}`);
    continue;
  }
  const candidates = [
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/files/${id}/${id}-8.txt`,
    `https://www.gutenberg.org/files/${id}/${id}.txt`,
  ];
  let text = "";
  for (const url of candidates) {
    const response = await fetch(url, { headers: { "user-agent": "FinnReadingGame/1.0 source-preservation" } });
    if (!response.ok) continue;
    const candidate = await response.text();
    if (/START OF (?:THE|THIS) PROJECT GUTENBERG/iu.test(candidate)) {
      text = candidate.replaceAll("\r\n", "\n");
      break;
    }
  }
  if (!text) throw new Error(`Could not fetch a verified plain-text source for Gutenberg ${id}`);
  await writeFile(outputPath, text);
  console.log(`Fetched ${id} (${text.length} characters)`);
}
