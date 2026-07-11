export const DEFAULT_READING_RULES = Object.freeze({
  completionUnits: 60,
  highAccuracyBonus: 25,
  improvementBonus: 15,
  persistenceBonus: 10,
  highAccuracyThreshold: 0.9,
});

export function evaluateReadingResult(result, context = {}, rules = DEFAULT_READING_RULES) {
  let units = result.completed ? rules.completionUnits : 0;
  const achievementIds = [];

  if (result.accuracyEstimate >= rules.highAccuracyThreshold) {
    units += rules.highAccuracyBonus;
    achievementIds.push("accurate-reading");
  }
  if (context.previousAccuracy != null && result.accuracyEstimate > context.previousAccuracy) {
    units += rules.improvementBonus;
    achievementIds.push("personal-improvement");
  }
  if (result.selfCorrections > 0 || result.repeatedWords > 0) {
    units += rules.persistenceBonus;
    achievementIds.push("stuck-with-it");
  }

  const completionTier = !result.completed
    ? "in-progress"
    : result.accuracyEstimate >= rules.highAccuracyThreshold
      ? "strong"
      : "complete";

  return Object.freeze({
    achievementIds: Object.freeze(achievementIds),
    completionTier,
    progressReward: Object.freeze({ kind: "progress", units }),
    readingResult: result,
  });
}
