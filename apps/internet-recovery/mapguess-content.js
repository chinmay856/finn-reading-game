import { A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE } from "../../content/mapguess/a-map-is-not-a-photograph.js";
import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";

export const MAPGUESS_DECK_A_IDS = Object.freeze([
  "a-map-is-not-a-photograph-a01",
  "the-destination-moved-a02",
  "scale-changes-the-story-a03",
  "a-river-edits-the-map-a04",
  "fastest-safest-scenic-a05",
  "landmarks-anchor-a-route-a06",
  "when-directions-cross-water-a07",
  "the-goal-before-the-route-a08",
]);

export const MAPGUESS_DECK_B_IDS = Object.freeze([
  "reading-the-legend-b01",
  "the-old-chart-was-honest-b02",
  "landmarks-that-anchor-a-route-b03",
  "when-directions-cross-water-b04",
  "the-mapmaker-chooses-b05",
]);

export const MAPGUESS_CONTENT_READINESS = Object.freeze({
  deckACount: MAPGUESS_DECK_A_IDS.length,
  deckBCount: MAPGUESS_DECK_B_IDS.length,
  firstRunShortfall: 0,
  plannedCount: MAPGUESS_DECK_A_IDS.length + MAPGUESS_DECK_B_IDS.length,
  requiredFirstRun: 8,
  structuredCandidateCount: 8,
});

const DEFAULT_MAPGUESS_CATALOG = Object.freeze(
  PASSAGE_CATALOG.some(({ id }) => id === A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE.id)
    ? [...PASSAGE_CATALOG]
    : [...PASSAGE_CATALOG, A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE],
);

export function selectNextMapGuessPassage(campaignState, options = {}) {
  const selection = selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog: options.catalog ?? DEFAULT_MAPGUESS_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: MAPGUESS_DECK_A_IDS,
  });
  return Object.freeze({ ...selection, ...MAPGUESS_CONTENT_READINESS });
}
