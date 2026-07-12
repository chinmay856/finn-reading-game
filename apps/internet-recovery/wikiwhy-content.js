import { PASSAGE_CATALOG, isSelectablePassage, selectNextPassage } from "../../content/passage-catalog.js";

export const WIKIWHY_DECK_A_IDS = Object.freeze([
  "photosynthesis-a01",
  "plate-tectonics-a02",
  "sleep-a03",
  "memory-a04",
  "habit-a05",
  "placebo-a06",
  "urban-heat-island-a07",
  "pollination-a08",
  "scientific-method-a09",
  "cognitive-bias-a10",
]);

export const WIKIWHY_DECK_B_IDS = Object.freeze([
  "printing-press-b01",
  "encryption-b02",
  "internet-b03",
  "public-library-b04",
  "renewable-energy-b05",
  "coral-reef-b06",
  "probability-b07",
  "music-b08",
  "architecture-b09",
  "map-b10",
]);

export function selectNextWikiWhyPassage(campaignState, options = {}) {
  const catalog = (options.catalog ?? PASSAGE_CATALOG).filter((passage) => (
    isSelectablePassage(passage)
    && passage.rights.licenseId === "CC-BY-SA-4.0"
    && typeof passage.source.historyUrl === "string"
    && typeof passage.source.modificationNotice === "string"
    && typeof passage.source.reviewedRevisionUrl === "string"
  ));
  return selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: [...WIKIWHY_DECK_A_IDS, ...WIKIWHY_DECK_B_IDS],
  });
}
