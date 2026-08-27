import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../speech/local-kokoro-tts.js", import.meta.url), "utf8");

test("vocabulary read-aloud uses pinned local Kokoro Heart for the word, definition, and passage sentence", () => {
  assert.match(source, /onnx-community\/Kokoro-82M-v1\.0-ONNX/u);
  assert.match(source, /const VOICE = "af_heart"/u);
  assert.match(source, /device: "wasm"/u);
  assert.match(source, /dtype: "q8"/u);
  assert.match(source, /buildVocabularySpeechText\(normalized\)/u);
  assert.match(source, /export async function prepareVocabularyCards/u);
  assert.match(source, /const cardAudioPromises = new Map\(\)/u);
  assert.match(source, /export function stopVocabularyVoice/u);
  assert.doesNotMatch(source, /SpeechSynthesisUtterance|speechSynthesis/u);
});
