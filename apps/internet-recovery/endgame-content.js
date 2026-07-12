import { ENDGAME_PASSAGES } from "../../content/endgame/final-incident-passages.js";
import { selectNextPassage } from "../../content/passage-catalog.js";
import { ENDGAME_CHECKPOINT_IDS } from "./endgame-state.js";

export const ENDGAME_CONTENT_READINESS = Object.freeze({
  plannedCount: 3,
  requiredFirstRun: 3,
  structuredCandidateCount: ENDGAME_PASSAGES.length,
});

export function selectNextEndgamePassage(endgameState, options = {}) {
  const completedPassageIds = endgameState?.checkpointIds ?? [];
  const expectedId = ENDGAME_CHECKPOINT_IDS[completedPassageIds.length] ?? null;
  if (!expectedId) {
    return Object.freeze({
      ...ENDGAME_CONTENT_READINESS,
      passage: null,
      reason: "all-checkpoints-complete",
      selectableCount: 0,
      unavailableCount: 0,
    });
  }
  const selection = selectNextPassage({
    ...options,
    allowRepeat: false,
    catalog: options.catalog ?? ENDGAME_PASSAGES,
    completedPassageIds,
    preferredIds: [expectedId],
  });
  return Object.freeze({ ...selection, ...ENDGAME_CONTENT_READINESS });
}
