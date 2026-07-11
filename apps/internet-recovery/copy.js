export const INTERNET_RECOVERY_COPY = Object.freeze({
  "mission.preparation.eyebrow": "RECOVERED FILE READY",
  "mission.preparation.title": "Read one recovered file to begin repairs.",
  "mission.preparation.body": "Read continuously at a comfortable pace. Pause when you need to. Correct yourself whenever you want. The repair only moves forward.",
  "privacy.microphone.truth": "Your voice is processed on this device. The game does not upload or save your audio or transcript.",
  "reading.ready.title": "READY WHEN YOU ARE, FINN",
  "reading.ready.body": "Start with the first highlighted line.",
  "reading.active": "Listening · keep going",
  "result.complete.eyebrow": "REPAIR COMPLETE",
  "result.complete.title": "The page changed because you read the recovered file.",
  "result.report.truth": "The report contains timing and scores, never audio or transcript text.",
  "amy.guide.note": "Finn, the highlighted passage is your current place. The page repair follows confirmed progress, so the two may not move at exactly the same time.",
});

export function hydrateInternetRecoveryCopy(root = document) {
  for (const element of root.querySelectorAll("[data-copy-id]")) {
    const value = INTERNET_RECOVERY_COPY[element.dataset.copyId];
    if (value) element.textContent = value;
  }
}
