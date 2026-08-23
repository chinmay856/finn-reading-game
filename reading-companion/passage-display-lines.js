const SENTENCE_PATTERN = /[^.!?]+(?:[.!?]+["'’”)]*|$)/gu;
const CLAUSE_PATTERN = /[^,;:—–]+(?:[,;:—–]+|$)/gu;
const sentenceSegmenter = typeof Intl?.Segmenter === "function"
  ? new Intl.Segmenter("en", { granularity: "sentence" })
  : null;

function splitSentences(paragraph) {
  const text = String(paragraph);
  const protectedText = text
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|St|Jr|Sr|vs|etc)\./gu, "$1\u0000")
    .replace(/\b([A-Z])\.(?=\s+[A-Z][a-z])/gu, "$1\u0000");
  if (sentenceSegmenter) {
    return [...sentenceSegmenter.segment(protectedText)]
      .map(({ segment }) => segment.replaceAll("\u0000", ".").trim())
      .filter(Boolean);
  }
  return (protectedText.match(SENTENCE_PATTERN) ?? [protectedText])
    .map((sentence) => sentence.replaceAll("\u0000", ".").trim())
    .filter(Boolean);
}

function chunkSentence(sentence, maximumWords) {
  const cleanSentence = String(sentence).trim();
  const wordCount = cleanSentence.split(/\s+/u).filter(Boolean).length;
  if (wordCount <= maximumWords) return [cleanSentence];
  const rawClauses = (cleanSentence.match(CLAUSE_PATTERN) ?? [cleanSentence]).map((clause) => clause.trim()).filter(Boolean);
  const clauses = [];
  for (let index = 0; index < rawClauses.length; index += 1) {
    const clause = rawClauses[index];
    const clauseWords = clause.split(/\s+/u).filter(Boolean).length;
    if (clauseWords <= 3 && /[,;:]$/u.test(clause) && rawClauses[index + 1]) {
      clauses.push(`${clause} ${rawClauses[index + 1]}`);
      index += 1;
    } else {
      clauses.push(clause);
    }
  }
  if (clauses.length === 1) return [cleanSentence];
  const chunks = [];
  let current = "";
  for (const clause of clauses) {
    const candidate = `${current} ${clause}`.trim();
    const candidateWords = candidate.split(/\s+/u).filter(Boolean).length;
    if (current && candidateWords > maximumWords) {
      chunks.push(current);
      current = clause;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function mergeOrphanLines(lines) {
  const merged = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const words = line.split(/\s+/u).filter(Boolean);
    const isOrphan = words.length <= 3 && !/[.!?]["'’”)]*$/u.test(line);
    if (isOrphan && lines[index + 1]) {
      merged.push(`${line} ${lines[index + 1]}`.replace(/\s+/gu, " ").trim());
      index += 1;
    } else {
      merged.push(line);
    }
  }
  return merged;
}

export function derivePassageDisplayLines(passage, { maximumWords = Number.POSITIVE_INFINITY } = {}) {
  if (Array.isArray(passage?.displayLines) && passage.displayLines.length) {
    return Object.freeze(passage.displayLines.map((line) => String(line).trim()).filter(Boolean));
  }
  const paragraphs = Array.isArray(passage?.paragraphs) ? passage.paragraphs : [];
  const lines = mergeOrphanLines(paragraphs.flatMap((paragraph) => {
    const sentences = splitSentences(paragraph);
    return sentences.flatMap((sentence) => chunkSentence(sentence, maximumWords));
  }).filter(Boolean));
  if (!lines.length) throw new Error("A passage needs displayLines or paragraph text.");
  return Object.freeze(lines);
}
