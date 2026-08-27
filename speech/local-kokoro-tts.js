import { KokoroTTS } from "kokoro-js";

import { buildVocabularySpeechText } from "./vocabulary-speech-text.js";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const VOICE = "af_heart";
let modelPromise = null;
let player = null;
let playerUrl = null;
let playbackRequestId = 0;
const cardAudioPromises = new Map();

async function prepare(onStatus = () => {}) {
  if (!modelPromise) {
    onStatus("Preparing the local pronunciation voice…");
    modelPromise = KokoroTTS.from_pretrained(MODEL_ID, {
      device: "wasm",
      dtype: "q8",
      progress_callback(data = {}) {
        if (data.status !== "progress") return;
        const progress = Math.max(0, Math.min(100, Math.round(Number(data.progress) || 0)));
        onStatus(`Preparing the local pronunciation voice… ${progress}%`);
      },
    }).catch((error) => {
      modelPromise = null;
      throw error;
    });
  }
  return modelPromise;
}

export async function prepareVocabularyVoice(onStatus = () => {}) {
  await prepare(onStatus);
}

function cardKey({ word, definition, sentence }) {
  return JSON.stringify([word, definition, sentence]);
}

async function prepareVocabularyCard(card, onStatus = () => {}) {
  const cleanWord = String(card.word ?? "").trim();
  const cleanDefinition = String(card.definition ?? card.meaning ?? "").trim();
  const cleanSentence = String(card.sentence ?? "").trim();
  if (!cleanWord || !cleanDefinition || !cleanSentence) throw new Error("A vocabulary word, definition, and passage sentence are required.");
  const normalized = { word: cleanWord, definition: cleanDefinition, sentence: cleanSentence };
  const key = cardKey(normalized);
  if (!cardAudioPromises.has(key)) {
    cardAudioPromises.set(key, (async () => {
      const model = await prepare(onStatus);
      onStatus(`Preparing “${cleanWord}”…`);
      const audio = await model.generate(buildVocabularySpeechText(normalized), { voice: VOICE, speed: 0.95 });
      return URL.createObjectURL(audio.toBlob());
    })().catch((error) => {
      cardAudioPromises.delete(key);
      throw error;
    }));
  }
  return cardAudioPromises.get(key);
}

export async function prepareVocabularyCards(cards, onStatus = () => {}) {
  for (const card of cards) await prepareVocabularyCard(card, onStatus);
}

export async function speakVocabularyCard({ word, definition, sentence, onStatus = () => {}, onEnded = () => {} }) {
  const cleanWord = String(word ?? "").trim();
  const cleanDefinition = String(definition ?? "").trim();
  const cleanSentence = String(sentence ?? "").trim();
  const requestId = ++playbackRequestId;
  const preparedUrl = await prepareVocabularyCard({ word: cleanWord, definition: cleanDefinition, sentence: cleanSentence }, onStatus);
  if (requestId !== playbackRequestId) return false;
  player?.pause();
  playerUrl = preparedUrl;
  player = new Audio(playerUrl);
  player.addEventListener("ended", onEnded, { once: true });
  await player.play();
  onStatus(`Playing ${cleanWord}, its definition, and how it appears in this passage.`);
  return true;
}

export function stopVocabularyVoice() {
  playbackRequestId += 1;
  player?.pause();
  if (player) player.currentTime = 0;
  player = null;
}

export function closeVocabularyVoice() {
  stopVocabularyVoice();
  for (const prepared of cardAudioPromises.values()) {
    void prepared.then((url) => URL.revokeObjectURL(url)).catch(() => {});
  }
  cardAudioPromises.clear();
  playerUrl = null;
}
