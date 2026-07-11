import { measureReadingSessionStrength } from "../../game-rules/reading-session-strength.js";

export const WIKIWHY_ACT_ONE_LIMIT = 80;

export function calculateWikiWhyRepair({ comprehension, previousStability = 0, readingResult = {} }) {
  const strength = measureReadingSessionStrength({
    accuracy: readingResult.accuracy,
    comprehension,
    progress: readingResult.progress,
    wpm: readingResult.wpm,
  });
  const proposedAdvance = 10 + Math.round(strength * 10);
  const stability = Math.min(WIKIWHY_ACT_ONE_LIMIT, Math.max(0, previousStability) + proposedAdvance);
  const advance = stability - Math.max(0, previousStability);
  const reaction = advance >= 19
    ? "The page is clearing faster."
    : advance >= 15
      ? "Nice. More of it stayed put."
      : "That held.";

  return Object.freeze({ advance, reaction, stability });
}
