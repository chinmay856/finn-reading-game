import assert from "node:assert/strict";

import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

// This is a release-blocking backstop for language a young player must never be
// unexpectedly required to speak. It complements, rather than replaces, the
// passage-by-passage human sensitivity and age-appropriateness review.
const FORCED_SPEECH_BLOCKLIST = Object.freeze([
  { label: "explicit racial slur (n-word)", pattern: new RegExp(`\\b${["ni", "gger"].join("")}s?\\b`, "iu") },
  { label: "explicit anti-Black slur", pattern: /\bcoons?\b/iu },
  { label: "explicit anti-Asian slur", pattern: /\bchinks?\b/iu },
  { label: "explicit antisemitic slur", pattern: /\bkikes?\b/iu },
  { label: "explicit anti-Latino slur", pattern: /\b(?:spics?|wetbacks?)\b/iu },
  { label: "explicit homophobic slur", pattern: /\bfaggots?\b/iu },
  { label: "explicit disability slur", pattern: /\bretards?\b/iu },
]);

function playerFacingText(passage) {
  return [
    passage.title,
    ...passage.paragraphs,
    passage.comprehension.question,
    ...passage.comprehension.choices.map(({ text }) => text),
    passage.comprehension.correctFeedback,
    passage.comprehension.tryAgainFeedback,
    ...passage.challengingWords.flatMap((entry) => [
      entry.word,
      entry.meaning,
      entry.sentence,
      entry.speechSentence,
    ]),
  ].filter(Boolean).join("\n");
}

const findings = [];
let passageCount = 0;

for (const [siteId, mission] of Object.entries(PLAYABLE_WALKTHROUGHS)) {
  for (const passage of mission.passages) {
    passageCount += 1;
    const text = playerFacingText(passage);
    for (const { label, pattern } of FORCED_SPEECH_BLOCKLIST) {
      if (pattern.test(text)) findings.push(`${siteId}/${passage.id}: ${label}`);
    }
  }
}

assert.equal(
  findings.length,
  0,
  `Release blocked by spoken-performance safety findings:\n${findings.join("\n")}`,
);

console.log(`Validated ${passageCount} playable passages against the release-blocking spoken-performance safety list.`);
