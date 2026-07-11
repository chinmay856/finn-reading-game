export function estimateGuideProgress({ activeSpeechMs, leadWords = 0, totalWords, wordsPerMinute }) {
  if (!totalWords || !wordsPerMinute) return 0;
  const estimatedWords = (Math.max(0, activeSpeechMs) / 60_000) * wordsPerMinute;
  return Math.min(1, (estimatedWords + Math.max(0, leadWords)) / totalWords);
}

export function guideScrollTop({ progress, scrollHeight, viewportHeight }) {
  const maximum = Math.max(0, scrollHeight - viewportHeight);
  return Math.round(Math.min(1, Math.max(0, progress)) * maximum);
}
