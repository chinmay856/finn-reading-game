export function estimateGuideProgress({ activeSpeechMs, leadWords = 0, totalWords, wordsPerMinute }) {
  if (!totalWords || !wordsPerMinute) return 0;
  const estimatedWords = (Math.max(0, activeSpeechMs) / 60_000) * wordsPerMinute;
  return Math.min(1, (estimatedWords + Math.max(0, leadWords)) / totalWords);
}

export function guideScrollTop({ progress, scrollHeight, viewportHeight }) {
  const maximum = Math.max(0, scrollHeight - viewportHeight);
  return Math.round(Math.min(1, Math.max(0, progress)) * maximum);
}

export function estimateGuideWordIndex({ activeSpeechMs, totalWords, wordsPerMinute }) {
  if (!totalWords || !wordsPerMinute) return 0;
  const estimated = Math.floor((Math.max(0, activeSpeechMs) / 60_000) * wordsPerMinute);
  return Math.min(totalWords - 1, Math.max(0, estimated));
}

export function centeredGuideScrollTop({ maximumScrollTop, viewportHeight, wordHeight, wordOffsetTop }) {
  const centered = wordOffsetTop - (viewportHeight / 2) + (wordHeight / 2);
  return Math.round(Math.min(Math.max(0, maximumScrollTop), Math.max(0, centered)));
}

export function approachScrollTop(current, target, maximumStep = 32) {
  const difference = target - current;
  if (Math.abs(difference) <= maximumStep) return target;
  return Math.round(current + (Math.sign(difference) * maximumStep));
}
