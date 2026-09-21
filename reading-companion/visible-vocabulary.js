// Reviewed packets may explain a word in context rather than quote the passage.
// Keep their approved sentences intact; retain quote checks for other content.
export function visibleVocabulary(passage) {
  const normalizedPassage = passage.lines.join(" ").replace(/\s+/gu, " ").trim();
  const reviewedContext = Boolean(passage.sourceDocumentId)
    || passage.reviewStatus === "human-reviewed-frozen-2026-09-20";
  return passage.challengingWords.filter((entry) => {
    const sentence = String(entry.sentence ?? "").replace(/\s+/gu, " ").trim();
    return entry.properNoun === false && Boolean(sentence)
      && (reviewedContext || normalizedPassage.includes(sentence));
  }).slice(0, 3);
}
