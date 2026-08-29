const SENTENCE_PATTERN = /[^.!?]+(?:[.!?]+["'’”)]*|$)/gu;
const sentenceSegmenter = typeof Intl?.Segmenter === "function"
  ? new Intl.Segmenter("en", { granularity: "sentence" })
  : null;

function splitSentences(paragraph) {
  const text = String(paragraph);
  const protectedText = text
    .replace(/([“"])([^”"]+)([”"])(?=\s*,?\s*by\b)/gu, (_match, open, title, close) => `${open}${title.replaceAll(".", "\u0003").replaceAll("?", "\u0001").replaceAll("!", "\u0002")}${close}`)
    .replace(/\.\[(\d+)\]/gu, "[$1].")
    .replace(/(^|\s)(\d{1,2})\.(?=\s+\S)/gu, "$1$2\u0004")
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|St|Jr|Sr|vs|etc)\./gu, "$1\u0000")
    .replace(/(?:\b[A-Z]\.){2,}/gu, (initials) => initials.replaceAll(".", "\u0000"))
    .replace(/\b([A-Z])\.(?=\s+(?:[A-Z]\.|[A-Z][a-z]))/gu, "$1\u0000");
  if (sentenceSegmenter) {
    return [...sentenceSegmenter.segment(protectedText)]
      .map(({ segment }) => segment.replaceAll("\u0000", ".").replaceAll("\u0001", "?").replaceAll("\u0002", "!").replaceAll("\u0003", ".").replaceAll("\u0004", ".").replace(/\[(\d+)\]\./gu, ".[$1]").trim())
      .filter(Boolean);
  }
  return (protectedText.match(SENTENCE_PATTERN) ?? [protectedText])
    .map((sentence) => sentence.replaceAll("\u0000", ".").replaceAll("\u0001", "?").replaceAll("\u0002", "!").replaceAll("\u0003", ".").replaceAll("\u0004", ".").replace(/\[(\d+)\]\./gu, ".[$1]").trim())
    .filter(Boolean);
}

export function derivePassageDisplayLines(passage, _options = {}) {
  if (Array.isArray(passage?.displayLines) && passage.displayLines.length) {
    return Object.freeze(passage.displayLines.map((line) => String(line).trim()).filter(Boolean));
  }
  const paragraphs = Array.isArray(passage?.paragraphs) ? passage.paragraphs : [];
  const lines = paragraphs.flatMap((paragraph) => splitSentences(paragraph)).filter(Boolean);
  if (!lines.length) throw new Error("A passage needs displayLines or paragraph text.");
  return Object.freeze(lines);
}
