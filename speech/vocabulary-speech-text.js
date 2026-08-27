const ROMAN_ORDINALS = Object.freeze({
  i: "one",
  ii: "two",
  iii: "three",
  iv: "four",
  v: "five",
  vi: "six",
  vii: "seven",
  viii: "eight",
  ix: "nine",
  x: "ten",
});

export function normalizeVocabularySentenceForSpeech(sentence) {
  return String(sentence ?? "")
    .replace(/\b(Chapter|Part)\s+([ivx]+)\b/giu, (match, label, numeral) => `${label} ${ROMAN_ORDINALS[numeral.toLowerCase()] ?? match}`)
    .replace(/\(([ivx]+)\)/giu, (match, numeral) => `${ROMAN_ORDINALS[numeral.toLowerCase()] ?? match},`)
    .replace(/\[(?:\d+|[ivxlcdm]+)\]/giu, "")
    .replace(/[\[\]]/gu, "")
    .replace(/[†‡※]/gu, "")
    .replace(/--/gu, "—")
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.;:!?])/gu, "$1")
    .trim();
}

export function buildVocabularySpeechText({ word, definition, sentence }) {
  const cleanWord = String(word ?? "").trim();
  const cleanDefinition = String(definition ?? "").trim().replace(/[.!?]+$/gu, "");
  const cleanSentence = normalizeVocabularySentenceForSpeech(sentence);
  if (!cleanWord || !cleanDefinition || !cleanSentence) {
    throw new Error("A vocabulary word, definition, and passage sentence are required.");
  }
  return `${cleanWord}. Definition: ${cleanDefinition}. In this passage: ${cleanSentence}`;
}
