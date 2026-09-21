import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, unlink, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { KokoroTTS } from "kokoro-js";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";
import { CAMPAIGN_VOCABULARY_SPEECH_EXCERPTS } from "../speech/campaign-vocabulary-speech-excerpts.js";
import { buildVocabularySpeechText } from "../speech/vocabulary-speech-text.js";

const voice = "af_heart";
const execFileAsync = promisify(execFile);
const argumentsList = process.argv.slice(2);
const speechExcerptsOnly = argumentsList.includes("--speech-excerpts");
const passageFilter = argumentsList.find(argument => argument.startsWith("--passage="))?.slice(10);
const requestedSites = argumentsList.filter((argument) => argument !== "--speech-excerpts" && !argument.startsWith("--passage="));
const siteIds = requestedSites.length ? requestedSites : Object.keys(PLAYABLE_WALKTHROUGHS);
const cards = siteIds.flatMap((siteId) => {
  const mission = PLAYABLE_WALKTHROUGHS[siteId];
  if (!mission) throw new Error(`Unknown campaign site: ${siteId}`);
  return mission.passages.flatMap((passage) => passage.challengingWords.map((card) => ({ card, passage, siteId })));
}).filter(({ card, passage }) => (
  (!passageFilter || passage.id === passageFilter) && (!speechExcerptsOnly || Object.hasOwn(CAMPAIGN_VOCABULARY_SPEECH_EXCERPTS, `${passage.id}/${card.word.toLowerCase()}`))
));
if (!cards.length) throw new Error("No vocabulary cards matched the requested audio generation scope.");

const model = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
  device: "cpu",
  dtype: "q8",
  progress_callback(data = {}) {
    if (data.status === "progress") process.stdout.write(`\rLoading Kokoro Heart: ${Math.round(Number(data.progress) || 0)}%`);
  },
});
process.stdout.write("\n");

let generated = 0;
const receipts = new Map();
for (const { card, passage, siteId } of cards) {
  const outputRoot = path.resolve(`public/audio/${siteId}/kokoro-heart`);
  await mkdir(outputRoot, { recursive: true });
  const outputPath = path.resolve(`public${card.audioSrc}`);
  if (!outputPath.startsWith(`${outputRoot}${path.sep}`)) throw new Error(`Unsafe vocabulary audio path: ${outputPath}`);
  const temporaryWavePath = outputPath.replace(/\.m4a$/u, ".generated.wav");
  const speechText = buildVocabularySpeechText({
    word: card.word,
    definition: card.meaning,
    sentence: card.speechSentence ?? card.sentence,
  });
  const audio = await model.generate(speechText, { voice, speed: 0.95 });
  await audio.save(temporaryWavePath);
  await execFileAsync("/usr/bin/afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", temporaryWavePath, outputPath]);
  await unlink(temporaryWavePath);
  const receiptPath = path.join(outputRoot, "manifest.json");
  if (!receipts.has(receiptPath)) {
    let receipt = {};
    try { receipt = JSON.parse(await readFile(receiptPath, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
    receipts.set(receiptPath, receipt);
  }
  receipts.get(receiptPath)[card.audioSrc] = { speechText, voice, speed: 0.95, sha256: createHash("sha256").update(await readFile(outputPath)).digest("hex") };
  await writeFile(receiptPath, JSON.stringify(receipts.get(receiptPath), null, 2) + "\n");
  generated += 1;
  console.log(`Generated ${siteId}/${passage.id}/${card.word} (${generated}/${cards.length})`);
}

console.log(`Generated ${generated} static campaign vocabulary cards with Kokoro Heart and AAC encoding.`);
