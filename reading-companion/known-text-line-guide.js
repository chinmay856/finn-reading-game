const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

export function normalizeGuideWord(value) {
  return String(value).normalize("NFKD").toLocaleLowerCase("en-US")
    .replace(/['’]/gu, "").replace(/[^\p{L}\p{N}]/gu, "");
}

export function tokenizeGuideText(value) {
  return (String(value).match(WORD_PATTERN) ?? []).map((display, index) => Object.freeze({
    display, index, normalized: normalizeGuideWord(display),
  }));
}

function editDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function matchCost(expected, spoken) {
  if (expected === spoken) return 0;
  const longest = Math.max(expected.length, spoken.length);
  if (longest >= 5 && editDistance(expected, spoken) <= (longest >= 9 ? 2 : 1)) return 0.3;
  return 1.15;
}

export function alignGuideEvidence(referenceTokens, transcript) {
  const expected = referenceTokens;
  const spoken = tokenizeGuideText(transcript);
  const rows = expected.length + 1;
  const columns = spoken.length + 1;
  const scores = Array.from({ length: rows }, () => new Float64Array(columns));
  const moves = Array.from({ length: rows }, () => new Uint8Array(columns));
  for (let row = 1; row < rows; row += 1) { scores[row][0] = row * 0.82; moves[row][0] = 1; }
  for (let column = 1; column < columns; column += 1) { scores[0][column] = column * 0.72; moves[0][column] = 2; }
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const diagonal = scores[row - 1][column - 1]
        + matchCost(expected[row - 1].normalized, spoken[column - 1].normalized);
      const deleteExpected = scores[row - 1][column] + 0.82;
      const insertSpoken = scores[row][column - 1] + 0.72;
      const best = Math.min(diagonal, deleteExpected, insertSpoken);
      scores[row][column] = best;
      moves[row][column] = best === diagonal ? 3 : best === deleteExpected ? 1 : 2;
    }
  }
  let row = 0;
  for (let candidate = 1; candidate < rows; candidate += 1) {
    if (scores[candidate][columns - 1] < scores[row][columns - 1]) row = candidate;
  }
  let column = spoken.length;
  const matchedIndexes = [];
  while (row > 0 || column > 0) {
    const move = moves[row][column];
    if (move === 3) {
      if (matchCost(expected[row - 1].normalized, spoken[column - 1].normalized) < 1) matchedIndexes.push(row - 1);
      row -= 1; column -= 1;
    } else if (move === 1) row -= 1;
    else column -= 1;
  }
  matchedIndexes.reverse();
  return Object.freeze({
    matchedCount: matchedIndexes.length,
    matchedIndexes: Object.freeze(matchedIndexes),
    furthestMatchedIndex: matchedIndexes.at(-1) ?? -1,
    spokenCount: spoken.length,
  });
}

export function createLineLayout(lines) {
  let lastWordIndex = -1;
  return Object.freeze(lines.map((text, index) => {
    const firstWordIndex = lastWordIndex + 1;
    lastWordIndex += tokenizeGuideText(text).length;
    return Object.freeze({ index, text: String(text), firstWordIndex, lastWordIndex });
  }));
}

export function anticipatedGuideWord({ confirmedWordIndex, latencyMs = 1_000, totalWords, wordsPerMinute }) {
  const wordsPerSecond = Math.max(0, Number(wordsPerMinute) || 0) / 60;
  const leadWords = Math.max(2, Math.min(4, Math.round(wordsPerSecond * (latencyMs / 1_000))));
  return Math.min(Math.max(0, totalWords - 1), Math.max(0, confirmedWordIndex + leadWords));
}

export function lineForWord(layout, wordIndex) {
  const found = layout.findIndex((line) => wordIndex <= line.lastWordIndex);
  return found < 0 ? Math.max(0, layout.length - 1) : found;
}

export class KnownTextLineGuide {
  constructor({ lines, passageId, latencyMs = 1_000, wordsPerMinute = 180 }) {
    if (!passageId) throw new Error("passageId is required.");
    if (!Array.isArray(lines) || !lines.length) throw new Error("At least one authored line is required.");
    this.passageId = passageId;
    this.layout = createLineLayout(lines);
    this.referenceTokens = tokenizeGuideText(lines.join(" "));
    this.latencyMs = latencyMs;
    this.wordsPerMinute = wordsPerMinute;
    this.confirmedWordIndex = -1;
    this.visibleLineIndex = 0;
  }

  observePartial(transcript, observedAtMs = performance.now()) {
    const evidence = alignGuideEvidence(this.referenceTokens, transcript);
    const plausibleAdvance = Math.max(1, evidence.spokenCount + 1);
    const proposed = Math.min(evidence.furthestMatchedIndex, plausibleAdvance);
    this.confirmedWordIndex = Math.max(this.confirmedWordIndex, proposed);
    const anticipatedWordIndex = anticipatedGuideWord({
      confirmedWordIndex: this.confirmedWordIndex,
      latencyMs: this.latencyMs,
      totalWords: this.referenceTokens.length,
      wordsPerMinute: this.wordsPerMinute,
    });
    this.visibleLineIndex = Math.max(this.visibleLineIndex, lineForWord(this.layout, anticipatedWordIndex));
    return Object.freeze({
      type: "reading-guide-position",
      passageId: this.passageId,
      observedAtMs,
      confirmedWordIndex: this.confirmedWordIndex,
      anticipatedWordIndex,
      visibleLineIndex: this.visibleLineIndex,
      matchedWordCount: evidence.matchedCount,
      totalWordCount: this.referenceTokens.length,
    });
  }

  reset() { this.confirmedWordIndex = -1; this.visibleLineIndex = 0; }
}
