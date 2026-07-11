function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : 0));
}

function comprehensionSignal(comprehension) {
  if (comprehension === "supported") return 1;
  if (comprehension === "retry-offered") return 0;
  return 0.4;
}

export function measureReadingSessionStrength({ accuracy, comprehension, progress, wpm }) {
  const completion = clamp(progress);
  const accuracySignal = clamp((accuracy - 70) / 25);
  const paceSignal = clamp((wpm - 100) / 150);

  return clamp(
    (completion * 0.45)
    + (accuracySignal * 0.3)
    + (comprehensionSignal(comprehension) * 0.2)
    + (paceSignal * 0.05),
  );
}
