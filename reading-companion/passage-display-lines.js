const SENTENCE_PATTERN = /[^.!?]+(?:[.!?]+["'’”)]*|$)/gu;

function chunkSentence(sentence, maximumWords) {
  const pieces = String(sentence).trim().split(/\s+/u).filter(Boolean);
  if (pieces.length <= maximumWords) return [pieces.join(" ")];
  const chunks = [];
  for (let index = 0; index < pieces.length; index += maximumWords) {
    chunks.push(pieces.slice(index, index + maximumWords).join(" "));
  }
  return chunks;
}

export function derivePassageDisplayLines(passage, { maximumWords = 18 } = {}) {
  if (Array.isArray(passage?.displayLines) && passage.displayLines.length) {
    return Object.freeze(passage.displayLines.map((line) => String(line).trim()).filter(Boolean));
  }
  const paragraphs = Array.isArray(passage?.paragraphs) ? passage.paragraphs : [];
  const lines = paragraphs.flatMap((paragraph) => {
    const sentences = String(paragraph).match(SENTENCE_PATTERN) ?? [String(paragraph)];
    return sentences.flatMap((sentence) => chunkSentence(sentence, maximumWords));
  }).filter(Boolean);
  if (!lines.length) throw new Error("A passage needs displayLines or paragraph text.");
  return Object.freeze(lines);
}
