import { measureReadingSessionStrength } from "../../game-rules/reading-session-strength.js";

export const WIKIWHY_ACT_ONE_LIMIT = 80;

export function describeWikiWhyRepairAdvance(advance) {
  return advance >= 19
    ? "The page is clearing faster."
    : advance >= 15
      ? "Nice. More of it stayed put."
      : "That held.";
}

export function describeWikiWhyShieldPass(pass) {
  const reactions = [
    "Content layer recovered. Two repairs remain.",
    "Citations and history verified. One repair remains.",
    "Edit permissions sealed. The shortcut is locked out.",
  ];
  const index = Math.min(3, Math.max(1, Number(pass) || 1)) - 1;
  return reactions[index];
}

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
  const reaction = describeWikiWhyRepairAdvance(advance);

  return Object.freeze({ advance, reaction, stability });
}

export function calculateWikiWhyReadingOutcome({
  campaignState = {},
  comprehension,
  readingResult = {},
} = {}) {
  const phase = campaignState.phase ?? "act-one";
  if (phase === "shield") {
    const shieldPass = Math.min(2, Math.max(0, Number(campaignState.shieldPass) || 0));
    return Object.freeze({
      advance: 0,
      kind: "shield-pass",
      reaction: describeWikiWhyShieldPass(shieldPass + 1),
      shieldAdvance: 1,
      stability: 80,
    });
  }
  if (phase !== "act-one") {
    return Object.freeze({
      advance: 0,
      kind: "no-progress",
      reaction: phase === "secured" ? "WikiWhy is already secured." : "Shield Protocol must start before another repair.",
      shieldAdvance: 0,
      stability: Number(campaignState.stability) || 0,
    });
  }
  const repair = calculateWikiWhyRepair({
    comprehension,
    previousStability: campaignState.stability,
    readingResult,
  });
  return Object.freeze({ ...repair, kind: "act-one-repair", shieldAdvance: 0 });
}
