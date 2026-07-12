import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";

export const FACEPLACE_DECK_A_IDS = Object.freeze([
  "a-second-reading-a01",
  "the-photograph-outside-the-frame-a02",
  "a-letter-reread-later-a03",
  "what-the-feed-repeats-a04",
  "memory-with-edits-a05",
]);

export const FACEPLACE_DECK_B_IDS = Object.freeze([
  "the-public-self-b01",
  "a-rumor-travels-faster-b02",
  "the-hidden-chronology-b03",
  "why-this-appeared-b04",
  "the-second-account-b05",
]);

export const FACEPLACE_CONTENT_READINESS = Object.freeze({
  deckACount: FACEPLACE_DECK_A_IDS.length,
  deckBCount: FACEPLACE_DECK_B_IDS.length,
  firstRunShortfall: 1,
  plannedCount: FACEPLACE_DECK_A_IDS.length + FACEPLACE_DECK_B_IDS.length,
  requiredFirstRun: 6,
});

export function selectNextFacePlacePassage(campaignState, options = {}) {
  const selection = selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog: options.catalog ?? PASSAGE_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: FACEPLACE_DECK_A_IDS,
  });
  return Object.freeze({ ...selection, ...FACEPLACE_CONTENT_READINESS });
}
