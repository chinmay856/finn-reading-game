import { THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE } from "../../content/yahuh/the-newspaper-that-found-people-on-the-moon.js";
import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";

export const YAHUH_DECK_A_IDS = Object.freeze([
  "the-newspaper-that-found-people-on-the-moon-a01",
  "the-front-page-choice-a02",
  "weather-is-not-a-mood-a03",
  "reading-a-public-ledger-a04",
  "the-label-on-the-ad-a05",
  "what-counts-as-news-a06",
]);

export const YAHUH_DECK_B_IDS = Object.freeze([
  "the-portal-window-b01",
  "six-sources-one-screen-b02",
  "the-date-line-b03",
  "a-category-is-a-promise-b04",
]);

export const YAHUH_CONTENT_READINESS = Object.freeze({
  deckACount: YAHUH_DECK_A_IDS.length,
  deckBCount: YAHUH_DECK_B_IDS.length,
  firstRunShortfall: 0,
  plannedCount: YAHUH_DECK_A_IDS.length + YAHUH_DECK_B_IDS.length,
  requiredFirstRun: 6,
  structuredCandidateCount: 6,
});

const DEFAULT_YAHUH_CATALOG = Object.freeze(
  PASSAGE_CATALOG.some(({ id }) => id === THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE.id)
    ? [...PASSAGE_CATALOG]
    : [...PASSAGE_CATALOG, THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE],
);

export function selectNextYahuhPassage(campaignState, options = {}) {
  const selection = selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog: options.catalog ?? DEFAULT_YAHUH_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: YAHUH_DECK_A_IDS,
  });
  return Object.freeze({ ...selection, ...YAHUH_CONTENT_READINESS });
}
