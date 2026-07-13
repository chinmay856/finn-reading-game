import { PASSAGE_CATALOG, selectNextPassage, selectNextPlaytestPassage } from "../../content/passage-catalog.js";

export const FACEPLACE_DECK_A_IDS = Object.freeze([
  "a-second-reading-a01",
  "the-photograph-outside-the-frame-a02",
  "a-letter-reread-later-a03",
  "what-the-feed-repeats-a04",
  "memory-with-edits-a05",
  "why-this-appeared-a06",
]);

export const FACEPLACE_DECK_B_IDS = Object.freeze([
  "the-public-self-b01",
  "a-rumor-travels-faster-b02",
  "the-hidden-chronology-b03",
  "the-second-account-b05",
]);

export const FACEPLACE_CONTENT_READINESS = Object.freeze({
  deckACount: FACEPLACE_DECK_A_IDS.length,
  deckBCount: FACEPLACE_DECK_B_IDS.length,
  firstRunShortfall: 0,
  plannedCount: FACEPLACE_DECK_A_IDS.length + FACEPLACE_DECK_B_IDS.length,
  requiredFirstRun: 6,
});

export function selectNextFacePlacePassage(campaignState, options = {}) {
  const selector = options.lane === "playtest" ? selectNextPlaytestPassage : selectNextPassage;
  const selection = selector({
    ...(options.lane === "playtest" ? {} : { allowRepeat: false }),
    catalog: options.catalog ?? PASSAGE_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: FACEPLACE_DECK_A_IDS,
  });
  return Object.freeze({ ...selection, ...FACEPLACE_CONTENT_READINESS });
}
