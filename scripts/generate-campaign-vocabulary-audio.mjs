import { execFile } from "node:child_process";
import { mkdir, unlink } from "node:fs/promises";
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
const requestedSites = argumentsList.filter((argument) => argument !== "--speech-excerpts");
const siteIds = requestedSites.length ? requestedSites : Object.keys(PLAYABLE_WALKTHROUGHS);
const cards = siteIds.flatMap((siteId) => {
  const mission = PLAYABLE_WALKTHROUGHS[siteId];
  if (!mission) throw new Error(`Unknown campaign site: ${siteId}`);
  return mission.passages.flatMap((passage) => passage.challengingWords.map((card) => ({ card, passage, siteId })));
}).filter(({ card, passage }) => (
  !speechExcerptsOnly || Object.hasOwn(CAMPAIGN_VOCABULARY_SPEECH_EXCERPTS, `${passage.id}/${card.word.toLowerCase()}`)
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
for (const { card, passage, siteId } of cards) {
  const outputRoot = path.resolve(`public/audio/${siteId}/kokoro-heart`);
  await mkdir(outputRoot, { recursive: true });
  const outputPath = path.resolve(`public${card.audioSrc}`);
  if (!outputPath.startsWith(`${outputRoot}${path.sep}`)) throw new Error(`Unsafe vocabulary audio path: ${outputPath}`);
  const temporaryWavePath = outputPath.replace(/\.m4a$/u, ".generated.wav");
  const audio = await model.generate(buildVocabularySpeechText({
    word: card.word,
    definition: card.meaning,
    sentence: card.speechSentence ?? card.sentence,
  }), { voice, speed: 0.95 });
  await audio.save(temporaryWavePath);
  await execFileAsync("/usr/bin/afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", temporaryWavePath, outputPath]);
  await unlink(temporaryWavePath);
  generated += 1;
  console.log(`Generated ${siteId}/${passage.id}/${card.word} (${generated}/${cards.length})`);
}

console.log(`Generated ${generated} static campaign vocabulary cards with Kokoro Heart and AAC encoding.`);
