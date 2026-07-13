const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

export function normalizeWord(value) {
  return String(value)
    .normalize("NFKD")
    .toLocaleLowerCase("en-US")
    .replace(/['’]/gu, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

export function tokenize(value) {
  return (String(value).match(WORD_PATTERN) ?? []).map((display, index) => ({
    display,
    index,
    normalized: normalizeWord(display),
  }));
}

export function anticipatedLineIndex({ confirmedIndex, effectiveWpm, lineEndIndexes, latencyMs = 1_000 }) {
  if (!lineEndIndexes?.length) return 0;
  const wordsPerSecond = Math.max(0, Number(effectiveWpm) || 0) / 60;
  const leadWords = Math.max(2, Math.min(4, Math.round(wordsPerSecond * (latencyMs / 1_000))));
  const anticipatedWordIndex = Math.max(0, confirmedIndex + leadWords);
  const found = lineEndIndexes.findIndex((endIndex) => anticipatedWordIndex <= endIndex);
  return found < 0 ? lineEndIndexes.length - 1 : found;
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

export function alignKnownText(reference, transcript) {
  const expected = Array.isArray(reference) ? reference : tokenize(reference);
  const spoken = tokenize(transcript);
  const rows = expected.length + 1;
  const columns = spoken.length + 1;
  const scores = Array.from({ length: rows }, () => new Float64Array(columns));
  const moves = Array.from({ length: rows }, () => new Uint8Array(columns));

  for (let row = 1; row < rows; row += 1) {
    scores[row][0] = row * 0.82;
    moves[row][0] = 1;
  }
  for (let column = 1; column < columns; column += 1) {
    scores[0][column] = column * 0.72;
    moves[0][column] = 2;
  }

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

  // A live transcript is a prefix of the reading, not a complete attempt.
  // Finish backtracking at the cheapest reference prefix so unseen trailing
  // passage words do not pull a short partial toward a later repeated phrase.
  let row = 0;
  for (let candidate = 1; candidate < rows; candidate += 1) {
    if (scores[candidate][columns - 1] < scores[row][columns - 1]) row = candidate;
  }
  let column = spoken.length;
  const matchedIndexes = [];
  while (row > 0 || column > 0) {
    const move = moves[row][column];
    if (move === 3) {
      const cost = matchCost(expected[row - 1].normalized, spoken[column - 1].normalized);
      if (cost < 1) matchedIndexes.push(row - 1);
      row -= 1;
      column -= 1;
    } else if (move === 1) {
      row -= 1;
    } else {
      column -= 1;
    }
  }
  matchedIndexes.reverse();

  return Object.freeze({
    expectedCount: expected.length,
    matchedIndexes: Object.freeze(matchedIndexes),
    matchedCount: matchedIndexes.length,
    furthestMatchedIndex: matchedIndexes.at(-1) ?? -1,
    spokenCount: spoken.length,
  });
}

export class EvidenceLockedTracker {
  constructor(reference) {
    this.reference = tokenize(reference);
    this.confirmedIndex = -1;
    this.lastTranscript = "";
  }

  observe(transcript) {
    const alignment = alignKnownText(this.reference, transcript);
    const previousIndex = this.confirmedIndex;
    // Indexes are zero-based, so this permits at most two expected words of
    // look-ahead beyond the amount of transcript evidence received.
    const plausibleAdvance = Math.max(1, alignment.spokenCount + 1);
    const proposed = Math.min(alignment.furthestMatchedIndex, plausibleAdvance);
    this.confirmedIndex = Math.max(this.confirmedIndex, proposed);
    this.lastTranscript = String(transcript).trim();
    return Object.freeze({
      ...alignment,
      advanced: this.confirmedIndex > previousIndex,
      confirmedIndex: this.confirmedIndex,
      previousIndex,
    });
  }

  reset() {
    this.confirmedIndex = -1;
    this.lastTranscript = "";
  }
}
