import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { alignTranscript, summarizeTokenMatches } from "../reading-engine.js";
import { KnownTextLineGuide } from "../reading-companion/known-text-line-guide.js";
import { evaluateFinishedAttempt, summarizeGuideTrace } from "../reading-attempt-evaluation.js";

const LINES = Object.freeze([
  "He tells us that at this festive season of the year,",
  "with Christmas and roast beef looming before us,",
  "similes drawn from eating and its results occur",
  "most readily to the mind.",
]);
const REFERENCE = LINES.join(" ");
const TOTAL_WORDS = 32;

const CASES = Object.freeze([
  Object.freeze({ id: "silence", transcript: "", partials: [] }),
  Object.freeze({ id: "one-or-two-words", transcript: "He tells", partials: ["He tells"] }),
  Object.freeze({ id: "unrelated-speech", transcript: "Please open the weather forecast for tomorrow", partials: ["Please open", "Please open the weather forecast"] }),
  Object.freeze({ id: "beginning-only", transcript: "He tells us that at this festive season", partials: ["He tells us", "He tells us that at this festive season"] }),
  Object.freeze({ id: "ending-only", transcript: "most readily to the mind", partials: ["most readily", "most readily to the mind"] }),
  Object.freeze({ id: "skipped-words", transcript: "He tells us at this season with roast beef before us similes from eating occur readily to the mind", partials: [
    "He tells us at this season", "He tells us at this season with roast beef before us",
    "He tells us at this season with roast beef before us similes from eating occur readily to the mind",
  ] }),
  Object.freeze({ id: "restart-correction", transcript: "He tells us that at this festive festive season of the year with Christmas and roast beef looming before us similes drawn from eating and its results occur most readily to the mind", partials: [
    "He tells us that at this festive", "He tells us that at this festive festive season of the year",
    "He tells us that at this festive festive season of the year with Christmas and roast beef looming before us",
    "He tells us that at this festive festive season of the year with Christmas and roast beef looming before us similes drawn from eating and its results occur most readily to the mind",
  ] }),
  Object.freeze({ id: "complete", transcript: REFERENCE, partials: [
    LINES[0], `${LINES[0]} ${LINES[1]}`, `${LINES[0]} ${LINES[1]} ${LINES[2]}`, REFERENCE,
  ] }),
  Object.freeze({ id: "model-failure", transcript: "", partials: [], modelFailed: true }),
]);

function evaluateCase(definition) {
  const finalAlignment = alignTranscript(REFERENCE, definition.transcript, { lookAhead: 40 });
  const guide = new KnownTextLineGuide({ lines: LINES, passageId: definition.id, wordsPerMinute: 200 });
  const guideEvents = definition.partials.map((partial, index) => guide.observePartial(partial, (index + 1) * 400));
  const outcome = evaluateFinishedAttempt({
    captureStarted: true,
    finishRequested: true,
    matchedWords: finalAlignment.matchedCount,
    modelFailed: definition.modelFailed,
    positionProgress: finalAlignment.positionProgress,
    spokenWords: finalAlignment.spokenWordCount,
    totalWords: TOTAL_WORDS,
    transcript: definition.transcript,
    unalignedWords: finalAlignment.unalignedWords,
  });
  return Object.freeze({
    id: definition.id,
    finalAlignment: Object.freeze({
      accuracy: finalAlignment.accuracy,
      matchedWords: finalAlignment.matchedCount,
      positionPercent: Math.round(finalAlignment.positionProgress * 100),
      repeatedWords: finalAlignment.repeatedWords,
      selfCorrections: finalAlignment.selfCorrections,
      unalignedWords: finalAlignment.unalignedWords,
    }),
    guide: summarizeGuideTrace(guideEvents),
    outcome,
  });
}

const cases = CASES.map(evaluateCase);
const summary = Object.freeze({
  generatedAt: new Date().toISOString(),
  referenceWordCount: summarizeTokenMatches(REFERENCE, new Set()).totalCount,
  policy: "Finish trusts the attempt; evidence changes feedback, never forces a reread.",
  cases,
});

const outputArgument = process.argv.find((argument) => argument.startsWith("--output="));
if (outputArgument) {
  await writeFile(resolve(outputArgument.slice("--output=".length)), `${JSON.stringify(summary, null, 2)}\n`);
}
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
