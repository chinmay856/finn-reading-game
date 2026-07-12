import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";

export const THREADIT_DECK_A_IDS = Object.freeze([
  "why-disagreement-matters-a01",
  "the-strongest-version-a02",
  "a-vote-is-not-a-measurement-a03",
  "the-objection-that-improved-the-plan-a04",
  "when-the-crowd-is-partly-right-a05",
]);

export const THREADIT_DECK_B_IDS = Object.freeze([
  "two-witnesses-one-rumor-b01",
  "the-reply-that-changed-the-question-b02",
  "evidence-under-pressure-b03",
  "rules-for-a-fair-thread-b04",
  "the-best-objection-b05",
]);

export function selectNextThreadItPassage(campaignState, options = {}) {
  return selectNextPassage({
    allowRepeat: false,
    catalog: options.catalog ?? PASSAGE_CATALOG,
    completedPassageIds: campaignState?.completedPassageIds ?? [],
    preferredIds: [...THREADIT_DECK_A_IDS, ...THREADIT_DECK_B_IDS],
  });
}
