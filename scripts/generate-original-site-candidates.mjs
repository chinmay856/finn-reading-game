import { readFile, writeFile } from "node:fs/promises";

const configs = Object.freeze([
  { folder: "searchish", source: "FIRST_RUN_MANUSCRIPTS_A01_A07.md", domain: "research-literacy", count: 7 },
  { folder: "amazeon", source: "FIRST_RUN_MANUSCRIPTS_A01_A07.md", domain: "consumer-literacy", count: 7 },
  { folder: "spottyfi", source: "FIRST_RUN_MANUSCRIPTS_A01_A08.md", domain: "music-and-algorithm-literacy", count: 8 },
  { folder: "mapguess", source: "FIRST_RUN_MANUSCRIPTS_A02_A08.md", domain: "map-and-route-literacy", count: 7 },
  { folder: "viewtube", source: "FIRST_RUN_MANUSCRIPTS_A02_A07.md", domain: "media-literacy", count: 6 },
]);

function normalize(text) {
  return text.replace(/\r/g, "").replace(/^> ?/gmu, "").replace(/\n(?!\n)/g, " ").replace(/\s+/g, " ").trim();
}

function parseManuscript(markdown) {
  const blocks = [...markdown.matchAll(/^## `([^`]+)` — ([^\r\n]+)\r?\n\r?\n([\s\S]*?)(?=^## `[^`]+` — |(?![\s\S]))/gmu)];
  return blocks.map(([, id, title, body]) => {
    const [prose, afterPrompt] = body.split(/^Prompt: /mu);
    const prompt = afterPrompt?.match(/^`([^`]+)`/u)?.[1];
    const correct = afterPrompt?.match(/^- Correct: `([^`]+)`/mu)?.[1];
    const distractors = [...(afterPrompt ?? "").matchAll(/^- Distractor: `([^`]+)`/gmu)].map((match) => match[1]);
    const paragraphs = prose.trim().split(/\r?\n>\r?\n/u).map(normalize).filter(Boolean);
    return { correct, distractors, id, paragraphs, prompt, title: title.trim() };
  });
}

function renderModule(records, domain, sourceName) {
  const rendered = records.map((record) => `  candidate(${JSON.stringify(record, null, 2).replaceAll("\n", "\n  ")})`).join(",\n");
  return `// Generated from ${sourceName} by scripts/generate-original-site-candidates.mjs.\n// Edit the canonical manuscript or generator, then run npm run generate:site-content.\n\nconst SHARED_PROFILE = Object.freeze({\n  accuracyTarget: 85,\n  checkpoint: Object.freeze({ audioOverlapMs: 3_000, maximumWindowMs: 16_000, minimumWindowMs: 5_000, pauseMs: 450, tokenOverlap: 12 }),\n  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),\n  form: "expository-prose",\n  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),\n  segmentation: "short-paragraphs", targetGrades: Object.freeze([10, 12]),\n  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),\n});\n\nconst SHARED_SOURCE = Object.freeze({ basis: "original-project-prose", domain: ${JSON.stringify(domain)}, sourceType: "original" });\nconst SHARED_RIGHTS = Object.freeze({ basis: "original", creditLine: "Original prose created for Finn Reading Game.", verifiedOn: "2026-07-12" });\nconst SHARED_REVIEW = Object.freeze({\n  accessibility: "candidate-pending-human-review", comprehension: "candidate-pending-human-review",\n  editorial: "candidate-pending-independent-review", factual: "candidate-pending-human-review",\n  grade: "candidate-pending-formal-leveling", profile: "candidate-pending-real-microphone-review",\n  rights: "candidate-pending-original-work-record-review", sensitivity: "candidate-pending-human-review",\n  transcription: "candidate-pending-real-microphone-test",\n});\n\nfunction candidate({ id, title, paragraphs, prompt, correct, distractors }) {\n  return Object.freeze({\n    availability: "candidate", id, title, paragraphs: Object.freeze(paragraphs),\n    comprehension: Object.freeze({\n      prompt, choices: Object.freeze([\n        Object.freeze({ correct: true, text: correct }),\n        ...distractors.map((text) => Object.freeze({ correct: false, text })),\n      ]),\n      correctFeedback: "That answer matches the distinction made in the passage.",\n      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",\n    }),\n    profile: SHARED_PROFILE, source: SHARED_SOURCE, rights: SHARED_RIGHTS, review: SHARED_REVIEW,\n    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),\n  });\n}\n\nexport const FIRST_RUN_PASSAGES = Object.freeze([\n${rendered},\n]);\n`;
}

for (const config of configs) {
  const source = new URL(`../content/${config.folder}/${config.source}`, import.meta.url);
  const output = new URL(`../content/${config.folder}/first-run-passages.js`, import.meta.url);
  const records = parseManuscript(await readFile(source, "utf8"));
  if (records.length !== config.count) throw new Error(`${config.folder}: expected ${config.count} records, found ${records.length}.`);
  for (const record of records) {
    if (record.paragraphs.length < 3 || !record.prompt || !record.correct || record.distractors.length !== 2) {
      throw new Error(`${config.folder}/${record.id}: incomplete manuscript structure (${record.paragraphs.length} paragraphs, prompt=${Boolean(record.prompt)}, correct=${Boolean(record.correct)}, distractors=${record.distractors.length}).`);
    }
  }
  await writeFile(output, renderModule(records, config.domain, `content/${config.folder}/${config.source}`), "utf8");
}
