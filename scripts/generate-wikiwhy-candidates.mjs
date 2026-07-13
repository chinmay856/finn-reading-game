import { readFile, writeFile } from "node:fs/promises";

const sourcePath = new URL("../content/wikiwhy/PASSAGE_DECKS.md", import.meta.url);
const outputPath = new URL("../content/wikiwhy/first-run-passages.js", import.meta.url);

const ids = Object.freeze({
  A02: "plate-tectonics-a02", A03: "sleep-a03", A04: "memory-a04",
  A05: "habit-a05", A06: "placebo-a06", A07: "urban-heat-island-a07",
  A08: "pollination-a08", A09: "scientific-method-a09", A10: "cognitive-bias-a10",
  B01: "printing-press-b01", B02: "encryption-b02", B03: "internet-b03",
  B04: "public-library-b04", B05: "renewable-energy-b05", B06: "coral-reef-b06",
  B07: "probability-b07", B08: "music-b08", B09: "architecture-b09", B10: "map-b10",
});

const distractors = Object.freeze({
  A02: ["Plate motion changes the planet within a single year.", "Only earthquakes can move continents."],
  A03: ["Sleep shuts down organized brain activity.", "Caffeine performs every biological function of sleep."],
  A04: ["External records make human memory unnecessary.", "Confidence guarantees that a remembered detail is correct."],
  A05: ["Waiting for unusually strong motivation before acting.", "Removing every reward from a repeated behavior."],
  A06: ["Whether participants can identify the treatment by its color.", "Whether every symptom has the same cause."],
  A07: ["Cities stop absorbing solar energy after sunset.", "Rural areas always become warmer than cities at night."],
  A08: ["Only bees can move pollen between flowering plants.", "Every major food crop requires animal pollination."],
  A09: ["Every field follows one fixed experimental recipe.", "Scientific claims become dependable because they never change."],
  A10: ["Bias occurs only when people lack intelligence.", "Experts never rely on mental shortcuts."],
  B01: ["Mechanized printing guarantees that published claims are true.", "One machine alone removed every barrier to reading."],
  B02: ["The algorithm must remain secret from security specialists.", "Encryption prevents observers from seeing that communication occurred."],
  B03: ["The web and the Internet are two names for one website.", "The Internet stops whenever a browser cannot load a page."],
  B04: ["It stores books without making choices about access.", "Its purpose is to replace every private collection."],
  B05: ["Renewable projects use no land or manufactured materials.", "Renewable power always matches demand without a grid."],
  B06: ["Bleaching means the coral skeleton disappears immediately.", "The algae partnership has no role in coral energy."],
  B07: ["A fair coin must alternate heads and tails.", "One short sequence determines the coin's long-run probability."],
  B08: ["Experience changes the physical frequency of every sound.", "All musical traditions organize pitch and harmony in the same way."],
  B09: ["A photograph proves how well every person can use the building.", "A building's appearance is its only lasting design choice."],
  B10: ["A precise map includes every detail of the territory.", "One projection preserves area, shape, distance, and direction everywhere."],
});

const markdown = await readFile(sourcePath, "utf8");
const blocks = [...markdown.matchAll(/^### ([AB]\d{2}) — ([^\r\n]+)\r?\n\r?\n([\s\S]*?)(?=^### [AB]\d{2} — |(?![\s\S]))/gmu)];

function normalize(text) {
  return text.replace(/\r/g, "").replace(/\n(?!\n)/g, " ").replace(/\s+/g, " ").trim();
}

function parseBlock(match) {
  const [, code, title, body] = match;
  if (code === "A01") return null;
  const [prose, afterCheck] = body.split("**Check:**");
  const [prompt, afterAnswer] = afterCheck.split("**Answer:**");
  const [answer, sourceLine] = afterAnswer.split("**Source:**");
  const paragraphs = prose.trim().split(/\r?\n\r?\n/u).map(normalize);
  const urls = [...sourceLine.matchAll(/\((https:\/\/[^)]+)\)/gu)].map((entry) => entry[1]);
  const articleTitle = decodeURIComponent(new URL(urls[0]).pathname.split("/").at(-1)).replaceAll("_", " ");
  return { articleTitle, code, id: ids[code], title: title.trim(), paragraphs, prompt: normalize(prompt), answer: normalize(answer), urls };
}

const records = blocks.map(parseBlock).filter(Boolean);
if (records.length !== 19) throw new Error(`Expected 19 WikiWhy candidates, found ${records.length}.`);
for (const record of records) {
  if (!record.id || record.paragraphs.length !== 3 || record.urls.length !== 2 || distractors[record.code]?.length !== 2) {
    throw new Error(`Incomplete generated record: ${record.code}`);
  }
}

const header = `// Generated from content/wikiwhy/PASSAGE_DECKS.md by scripts/generate-wikiwhy-candidates.mjs.\n// Edit the canonical manuscript or generator inputs, then run npm run generate:wikiwhy.\n\n`;
const shared = `const SHARED_PROFILE = Object.freeze({\n  accuracyTarget: 85,\n  checkpoint: Object.freeze({ audioOverlapMs: 3_000, maximumWindowMs: 16_000, minimumWindowMs: 5_000, pauseMs: 450, tokenOverlap: 12 }),\n  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),\n  form: "expository-prose",\n  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),\n  segmentation: "short-paragraphs",\n  targetGrades: Object.freeze([10, 12]),\n  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),\n});\n\nconst SHARED_REVIEW = Object.freeze({\n  accessibility: "candidate-pending-human-review", comprehension: "candidate-pending-human-review",\n  editorial: "candidate-pending-independent-review", factual: "candidate-pending-human-review",\n  grade: "candidate-pending-formal-leveling", profile: "candidate-pending-real-microphone-review",\n  rights: "candidate-pending-license-record-review", sensitivity: "candidate-pending-human-review",\n  transcription: "candidate-pending-real-microphone-test", adaptationFidelity: "candidate-pending-independent-review",\n});\n\nconst SHARED_RIGHTS = Object.freeze({\n  basis: "license", creditLine: "English Wikipedia contributors; adapted and modified under CC BY-SA 4.0.",\n  licenseId: "CC-BY-SA-4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", verifiedOn: "2026-07-12",\n});\n\n`;

const rendered = records.map((record) => `  Object.freeze({\n    availability: "candidate",\n    id: ${JSON.stringify(record.id)},\n    title: ${JSON.stringify(record.title)},\n    paragraphs: Object.freeze(${JSON.stringify(record.paragraphs, null, 2).replaceAll("\n", "\n    ")}),\n    comprehension: Object.freeze({\n      prompt: ${JSON.stringify(record.prompt)},\n      choices: Object.freeze([\n        Object.freeze({ correct: true, text: ${JSON.stringify(record.answer)} }),\n        Object.freeze({ correct: false, text: ${JSON.stringify(distractors[record.code][0])} }),\n        Object.freeze({ correct: false, text: ${JSON.stringify(distractors[record.code][1])} }),\n      ]),\n      correctFeedback: "That answer matches the distinction made in the passage.",\n      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",\n    }),\n    profile: SHARED_PROFILE,\n    source: Object.freeze({\n      articleUrl: ${JSON.stringify(record.urls[0])}, attribution: ${JSON.stringify(`Adapted and modified from “${record.articleTitle},” English Wikipedia contributors.`)},\n      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: ${JSON.stringify(record.urls[1])},\n      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",\n      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: ${JSON.stringify(record.urls[0])},\n    }),\n    rights: SHARED_RIGHTS, review: SHARED_REVIEW,\n    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),\n  })`).join(",\n");

const revisionBoundRendered = rendered.replace(
  /    availability: "candidate",\n    id: "([^"]+)",/gu,
  '    availability: "candidate",\n    contentRevision: "$1@2026-07-12.1",\n    id: "$1",',
);
await writeFile(outputPath, `${header}${shared}export const WIKIWHY_FIRST_RUN_PASSAGES = Object.freeze([\n${revisionBoundRendered},\n]);\n`, "utf8");
