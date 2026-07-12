import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";

export const SEARCHISH_DECK_A_IDS = Object.freeze([
  "two-results-one-suspicious-message-a01", "the-primary-source-a02",
  "the-independent-witness-a03", "the-sponsored-answer-a04",
  "what-a-snippet-leaves-out-a05", "the-domain-clue-a06",
  "when-results-disagree-a07",
]);
export const SEARCHISH_DECK_B_IDS = Object.freeze([
  "the-query-behind-the-answer-b01", "a-date-changes-the-story-b02",
  "synthesis-without-certainty-b03",
]);
export const SEARCHISH_CONTENT_READINESS = Object.freeze({
  deckACount: 7, deckBCount: 3, firstRunShortfall: 7,
  plannedCount: 10, requiredFirstRun: 7, structuredCandidateCount: 0,
});

export function selectNextSearchishPassage(campaignState, options = {}) {
  const selection = selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog: options.catalog ?? PASSAGE_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: SEARCHISH_DECK_A_IDS,
  });
  return Object.freeze({ ...selection, ...SEARCHISH_CONTENT_READINESS });
}
