const DEFAULT_FILLERS = new Set(["ah", "eh", "er", "hmm", "like", "uh", "um"]);

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
    index,
    display,
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
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost,
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

export function alignTranscript(expectedTokens, transcript, options = {}) {
  const lookAhead = options.lookAhead ?? 4;
  const fillers = options.fillers ?? DEFAULT_FILLERS;
  const spokenWords = tokenizeText(transcript)
    .map((token) => token.normalized)
    .filter(Boolean);
  const matched = new Set();
  const challenging = new Set();
  let cursor = 0;
  let unalignedWords = 0;
  let repeatedWords = 0;
  let selfCorrections = 0;

  for (const spoken of spokenWords) {
    if (fillers.has(spoken)) continue;

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
        challenging.add(skipped);
      }
      if (challenging.delete(foundIndex)) selfCorrections += 1;
      matched.add(foundIndex);
      cursor = foundIndex + 1;
      continue;
    }

    const recentStart = Math.max(0, cursor - 4);
    const repeatedIndex = expectedTokens
      .slice(recentStart, cursor)
      .findIndex((token) => wordsMatch(token.normalized, spoken));
    if (repeatedIndex >= 0) {
      repeatedWords += 1;
      continue;
    }

    unalignedWords += 1;
    if (cursor < expectedTokens.length) challenging.add(cursor);
  }

  const progress = expectedTokens.length ? matched.size / expectedTokens.length : 0;
  const alignedAttempts = matched.size + unalignedWords + challenging.size;
  const accuracyEstimate = alignedAttempts ? matched.size / alignedAttempts : 0;
  const completed = expectedTokens.length > 0
    && (cursor >= expectedTokens.length || (progress >= 0.92 && matched.has(expectedTokens.length - 1)));

  return Object.freeze({
    accuracyEstimate,
    challengingTokenIndexes: Object.freeze([...challenging]),
    completed,
    currentTokenIndex: Math.min(cursor, Math.max(0, expectedTokens.length - 1)),
    matchedTokenIndexes: Object.freeze([...matched]),
    progress,
    repeatedWords,
    selfCorrections,
    spokenWordCount: spokenWords.length,
    transcript: String(transcript).trim(),
    unalignedWords,
  });
}

export class ReadAloudSession {
  constructor(passage, options = {}) {
    this.passage = passage;
    this.tokens = tokenizeText(passage.text);
    this.startedAt = options.startedAt ?? Date.now();
    this.latestAlignment = alignTranscript(this.tokens, "");
  }

  updateTranscript(transcript) {
    this.latestAlignment = alignTranscript(this.tokens, transcript);
    return this.snapshot();
  }

  snapshot() {
    return Object.freeze({
      passageId: this.passage.id,
      tokens: this.tokens,
      ...this.latestAlignment,
    });
  }

  finish(options = {}) {
    const endedAt = options.endedAt ?? Date.now();
    const durationMs = Math.max(1, endedAt - this.startedAt);
    const minutes = durationMs / 60_000;
    const wordsPerMinute = Math.round(this.latestAlignment.matchedTokenIndexes.length / minutes);
    const challengingTokens = this.latestAlignment.challengingTokenIndexes
      .map((index) => this.tokens[index]?.display)
      .filter(Boolean);

    return Object.freeze({
      passageId: this.passage.id,
      completed: this.latestAlignment.completed,
      wordsAttempted: this.latestAlignment.spokenWordCount,
      wordsMatched: this.latestAlignment.matchedTokenIndexes.length,
      accuracyEstimate: this.latestAlignment.accuracyEstimate,
      wordsPerMinute,
      selfCorrections: this.latestAlignment.selfCorrections,
      repeatedWords: this.latestAlignment.repeatedWords,
      challengingTokens: Object.freeze(challengingTokens),
      durationMs,
      transcript: this.latestAlignment.transcript,
    });
  }
}

export class BrowserSpeechInput {
  constructor(options = {}) {
    this.language = options.language ?? "en-US";
    this.recognition = null;
  }

  static isSupported() {
    return Boolean(globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition);
  }

  async requestPermission() {
    if (!globalThis.isSecureContext) {
      throw new Error("Microphone access needs HTTPS or localhost.");
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("This browser does not expose microphone access.");
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  }

  start(handlers) {
    const Recognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
    if (!Recognition) {
      throw new Error("Live speech recognition is unavailable in this browser.");
    }

    const recognition = new Recognition();
    recognition.lang = this.language;
    recognition.continuous = true;
    recognition.interimResults = true;
    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0]?.transcript ?? "";
        if (event.results[index].isFinal) finalTranscript += ` ${text}`;
        else interimTranscript += ` ${text}`;
      }
      handlers.onTranscript?.(`${finalTranscript} ${interimTranscript}`.trim());
    };
    recognition.onerror = (event) => handlers.onError?.(new Error(event.error || "Speech recognition failed."));
    recognition.onend = () => handlers.onEnd?.();
    recognition.start();
    this.recognition = recognition;
  }

  stop() {
    this.recognition?.stop();
    this.recognition = null;
  }
}
