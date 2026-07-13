import { THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE } from "../../content/viewtube/the-sky-becomes-a-streak-of-fire.js";
import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";

export const VIEWTUBE_DECK_A_IDS = Object.freeze([
  "the-sky-becomes-a-streak-of-fire-a01",
  "the-frame-before-the-crash-a02",
  "the-transcript-and-the-clip-a03",
  "what-the-camera-did-not-see-a04",
  "a-speech-in-its-moment-a05",
  "one-scene-three-cuts-a06",
  "the-duplicate-frame-a07",
]);

export const VIEWTUBE_DECK_B_IDS = Object.freeze([
  "the-expedition-dispatch-b01",
  "a-demonstration-needs-a-method-b02",
  "the-witness-and-the-recording-b03",
]);

export const VIEWTUBE_CONTENT_READINESS = Object.freeze({
  deckACount: VIEWTUBE_DECK_A_IDS.length,
  deckBCount: VIEWTUBE_DECK_B_IDS.length,
  firstRunShortfall: 0,
  plannedCount: VIEWTUBE_DECK_A_IDS.length + VIEWTUBE_DECK_B_IDS.length,
  requiredFirstRun: 7,
  structuredCandidateCount: 7,
});

const DEFAULT_VIEWTUBE_CATALOG = Object.freeze(
  PASSAGE_CATALOG.some(({ id }) => id === THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE.id)
    ? [...PASSAGE_CATALOG]
    : [...PASSAGE_CATALOG, THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE],
);

export function selectNextViewTubePassage(campaignState, options = {}) {
  const selection = selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog: options.catalog ?? DEFAULT_VIEWTUBE_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: VIEWTUBE_DECK_A_IDS,
  });
  return Object.freeze({ ...selection, ...VIEWTUBE_CONTENT_READINESS });
}
