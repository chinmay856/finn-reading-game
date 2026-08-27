import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";
import { normalizeVocabularySentenceForSpeech } from "../speech/vocabulary-speech-text.js";

const cards = Object.entries(PLAYABLE_WALKTHROUGHS).flatMap(([siteId, mission]) => (
  mission.passages.flatMap((passage) => passage.challengingWords.map((card) => ({ card, passage, siteId })))
));

const normalized = [];
const review = [];

for (const { card, passage, siteId } of cards) {
  const spokenSentence = normalizeVocabularySentenceForSpeech(card.speechSentence ?? card.sentence);
  const words = spokenSentence.split(/\s+/u).filter(Boolean).length;
  const semicolons = (spokenSentence.match(/;/gu) ?? []).length;
  const dashes = (spokenSentence.match(/[—–]/gu) ?? []).length;
  const parentheses = (spokenSentence.match(/[()]/gu) ?? []).length;
  const straightQuotes = (spokenSentence.match(/"/gu) ?? []).length;
  const openingQuotes = (spokenSentence.match(/“/gu) ?? []).length;
  const closingQuotes = (spokenSentence.match(/”/gu) ?? []).length;
  const reasons = [];
  if (words >= 80) reasons.push(`${words}-word passage sentence`);
  if (semicolons >= 3) reasons.push(`${semicolons} semicolons`);
  if (dashes >= 4) reasons.push(`${dashes} dashes`);
  if (parentheses >= 4) reasons.push(`${parentheses / 2} parenthetical phrases`);
  if (straightQuotes % 2 || openingQuotes !== closingQuotes) reasons.push("unbalanced excerpt quotation");
  if (/^(?:CHAPTER\b|THE MACHINE STOPS\b)/u.test(spokenSentence)) reasons.push("source heading joined to prose");
  if (/^\d{1,2},\s*\d{4}\b/u.test(spokenSentence)) reasons.push("starts with a date fragment");
  if (reasons.length) review.push({ passageId: passage.id, reasons, sentence: spokenSentence, siteId, word: card.word });
  if (spokenSentence !== card.sentence) normalized.push({ passageId: passage.id, raw: card.sentence, siteId, spoken: spokenSentence, word: card.word });
}

console.log(`Audited ${cards.length} vocabulary cards.`);
console.log(`Speech-only normalization changes ${normalized.length} card${normalized.length === 1 ? "" : "s"}:`);
for (const item of normalized) {
  console.log(`- ${item.passageId}/${item.word}: ${item.spoken}`);
}
console.log(`Editorial listening review recommended for ${review.length} card${review.length === 1 ? "" : "s"}:`);
for (const item of review) {
  console.log(`- ${item.passageId}/${item.word}: ${item.reasons.join(", ")}`);
}
