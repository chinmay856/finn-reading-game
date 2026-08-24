import { execFile } from "node:child_process";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { KokoroTTS } from "kokoro-js";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

const outputRoot = path.resolve("public/audio/searchish/kokoro-heart");
const voice = "af_heart";
const execFileAsync = promisify(execFile);
const cards = PLAYABLE_WALKTHROUGHS.searchish.passages.flatMap(({ challengingWords }) => challengingWords);

await mkdir(outputRoot, { recursive: true });

const model = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
  device: "cpu",
  dtype: "q8",
  progress_callback(data = {}) {
    if (data.status === "progress") process.stdout.write(`\rLoading Kokoro Heart: ${Math.round(Number(data.progress) || 0)}%`);
  },
});
process.stdout.write("\n");

let generated = 0;
for (const passage of PLAYABLE_WALKTHROUGHS.searchish.passages) {
  for (const card of passage.challengingWords) {
    const outputPath = path.resolve(`public${card.audioSrc}`);
    if (!outputPath.startsWith(`${outputRoot}${path.sep}`)) throw new Error(`Unsafe vocabulary audio path: ${outputPath}`);
    const temporaryWavePath = outputPath.replace(/\.m4a$/u, ".generated.wav");
    const text = `${card.word}. Definition: ${card.meaning}. Used in a sentence: ${card.sentence}`;
    const audio = await model.generate(text, { voice, speed: 0.95 });
    await audio.save(temporaryWavePath);
    await execFileAsync("/usr/bin/afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", temporaryWavePath, outputPath]);
    await unlink(temporaryWavePath);
    generated += 1;
    console.log(`Generated ${path.basename(outputPath)} (${generated}/${cards.length})`);
  }
}

console.log(`Generated ${generated} static Search-ish vocabulary cards with Kokoro Heart and AAC encoding.`);
