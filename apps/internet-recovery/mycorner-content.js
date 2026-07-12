import { A_CABIN_WITH_A_PURPOSE_PASSAGE } from "../../content/mycorner/a-cabin-with-a-purpose.js";
import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";

export const MYCORNER_DECK_A_IDS = Object.freeze([
  "a-cabin-with-a-purpose-a01",
  "the-page-you-choose-a02",
  "a-room-that-explains-its-owner-a03",
  "the-costume-and-the-person-a04",
  "what-a-profile-leaves-out-a05",
  "autoplay-is-not-personality-a06",
  "the-template-problem-a07",
]);

export const MYCORNER_DECK_B_IDS = Object.freeze([
  "a-chosen-name-b01",
  "the-visitor-counter-lies-b02",
  "the-habit-of-a-place-b03",
]);

export const MYCORNER_CONTENT_READINESS = Object.freeze({
  deckACount: MYCORNER_DECK_A_IDS.length,
  deckBCount: MYCORNER_DECK_B_IDS.length,
  firstRunShortfall: 7,
  plannedCount: MYCORNER_DECK_A_IDS.length + MYCORNER_DECK_B_IDS.length,
  requiredFirstRun: 7,
  structuredCandidateCount: 1,
});

const DEFAULT_MYCORNER_CATALOG = Object.freeze(
  PASSAGE_CATALOG.some(({ id }) => id === A_CABIN_WITH_A_PURPOSE_PASSAGE.id)
    ? [...PASSAGE_CATALOG]
    : [...PASSAGE_CATALOG, A_CABIN_WITH_A_PURPOSE_PASSAGE],
);

export function selectNextMyCornerPassage(campaignState, options = {}) {
  const selection = selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog: options.catalog ?? DEFAULT_MYCORNER_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: MYCORNER_DECK_A_IDS,
  });
  return Object.freeze({ ...selection, ...MYCORNER_CONTENT_READINESS });
}
