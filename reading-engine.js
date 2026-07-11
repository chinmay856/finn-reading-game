const DEFAULT_FILLERS = new Set(["ah", "eh", "er", "hmm", "like", "uh", "um"]);
const LIGHT_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from",
  "had", "has", "he", "her", "him", "his", "i", "in", "is", "it", "of",
  "on", "or", "she", "that", "the", "their", "them", "they", "to", "was",
  "were", "with", "you",
]);

export function normalizeWord(value) {
  return String(value)
    .normalize("NFKD")
    .toLocaleLowerCase("en-US")
    .replace(/[’']/gu, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

export function tokenizeText(text) {
  const matches = String(text).match(/[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*/gu) ?? [];
  return matches.map((display, index) => Object.freeze({
    display,
    index,
    normalized: normalizeWord(display),
  }));
}

function editDistance(left, right) {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitution,
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function wordsMatch(expected, spoken) {
  if (expected === spoken) return true;
  const longest = Math.max(expected.length, spoken.length);
  if (longest < 5) return false;
  return editDistance(expected, spoken) <= (longest >= 9 ? 2 : 1);
}

function wordWeight(token) {
  return LIGHT_WORDS.has(token.normalized) ? 0.5 : 1;
}

export function alignTranscript(expectedText, spokenText, options = {}) {
  const expectedTokens = Array.isArray(expectedText) ? expectedText : tokenizeText(expectedText);
  const fillers = options.fillers ?? DEFAULT_FILLERS;
  const lookAhead = options.lookAhead ?? 5;
  const spokenTokens = tokenizeText(spokenText);
  const matched = new Set();
  const uncertain = new Set();
  let cursor = Math.max(0, Math.min(options.startIndex ?? 0, expectedTokens.length));
  let fillerWords = 0;
  let repeatedWords = 0;
  let selfCorrections = 0;
  let unalignedWords = 0;

  for (const token of spokenTokens) {
    const spoken = token.normalized;
    if (!spoken) continue;
    if (fillers.has(spoken)) {
      fillerWords += 1;
      continue;
    }

    const correctedIndex = [...uncertain]
      .find((index) => wordsMatch(expectedTokens[index]?.normalized ?? "", spoken));
    if (correctedIndex != null) {
      uncertain.delete(correctedIndex);
      matched.add(correctedIndex);
      selfCorrections += 1;
      while (matched.has(cursor)) cursor += 1;
      continue;
    }

    let foundIndex = -1;
    const searchEnd = Math.min(expectedTokens.length - 1, cursor + lookAhead);
    for (let index = cursor; index <= searchEnd; index += 1) {
      if (wordsMatch(expectedTokens[index].normalized, spoken)) {
        foundIndex = index;
        break;
      }
    }

    if (foundIndex >= 0) {
      for (let skipped = cursor; skipped < foundIndex; skipped += 1) {
        if (!matched.has(skipped)) uncertain.add(skipped);
      }
      matched.add(foundIndex);
      cursor = foundIndex + 1;
      while (matched.has(cursor)) cursor += 1;
      continue;
    }

    const recentStart = Math.max(0, cursor - 5);
    const isRepeat = expectedTokens
      .slice(recentStart, cursor)
      .some((expected) => wordsMatch(expected.normalized, spoken));
    if (isRepeat) {
      repeatedWords += 1;
      continue;
    }

    unalignedWords += 1;
    if (cursor < expectedTokens.length) uncertain.add(cursor);
  }

  const matchedWeight = [...matched]
    .reduce((total, index) => total + wordWeight(expectedTokens[index]), 0);
  const totalWeight = expectedTokens.reduce((total, token) => total + wordWeight(token), 0);
  const accuracy = totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  const missedTokenIndexes = expectedTokens
    .map((token) => token.index)
    .filter((index) => !matched.has(index));
  const nextTokenIndex = missedTokenIndexes[0] ?? Math.max(0, expectedTokens.length - 1);
  const furthestMatchedTokenIndex = matched.size ? Math.max(...matched) : -1;

  return Object.freeze({
    accuracy,
    expectedTokens: Object.freeze(expectedTokens),
    fillerWords,
    furthestMatchedTokenIndex,
    matchedCount: matched.size,
    matchedTokenIndexes: Object.freeze([...matched].sort((a, b) => a - b)),
    missedTokenIndexes: Object.freeze(missedTokenIndexes),
    missedWords: Object.freeze(missedTokenIndexes.map((index) => expectedTokens[index].display)),
    nextTokenIndex,
    positionProgress: expectedTokens.length ? (furthestMatchedTokenIndex + 1) / expectedTokens.length : 0,
    progress: expectedTokens.length ? matched.size / expectedTokens.length : 0,
    repeatedWords,
    selfCorrections,
    spokenWordCount: spokenTokens.length,
    transcript: String(spokenText).trim(),
    unalignedWords,
    uncertainTokenIndexes: Object.freeze([...uncertain].sort((a, b) => a - b)),
  });
}

export function estimateWordsPerMinute({ attemptStartedAt, firstSpeechAt, lastSpeechAt, wordCount }) {
  if (!wordCount || !attemptStartedAt || !lastSpeechAt) return 0;
  const liveSpeechDuration = firstSpeechAt ? lastSpeechAt - firstSpeechAt : 0;
  const measuredStart = liveSpeechDuration >= 1_000 ? firstSpeechAt : attemptStartedAt;
  const durationMs = Math.max(2_000, lastSpeechAt - measuredStart);
  return Math.round(wordCount / (durationMs / 60_000));
}

export function estimateReadingPace({ durationMs, expectedText, wordCount }) {
  if (!durationMs || !wordCount) {
    return Object.freeze({ adjustedDurationMs: 0, pauseAllowanceMs: 0, rawDurationMs: 0, wpm: 0 });
  }

  const text = String(expectedText);
  const sentenceBreaks = (text.match(/[.!?]+/gu) ?? []).length;
  const clauseBreaks = (text.match(/[,;:]+|[\u2013\u2014]/gu) ?? []).length;
  const requestedAllowanceMs = (sentenceBreaks * 650) + (clauseBreaks * 250);
  const pauseAllowanceMs = Math.round(Math.min(requestedAllowanceMs, durationMs * 0.3));
  const adjustedDurationMs = Math.max(2_000, durationMs - pauseAllowanceMs);

  return Object.freeze({
    adjustedDurationMs,
    pauseAllowanceMs,
    rawDurationMs: durationMs,
    wpm: Math.round(wordCount / (adjustedDurationMs / 60_000)),
  });
}
