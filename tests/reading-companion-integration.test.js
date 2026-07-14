import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appSource = readFile(new URL("../app.js", import.meta.url), "utf8");

test("the app drives its visible line from transcript evidence, never elapsed speech time", async () => {
  const app = await appSource;
  assert.match(app, /new KnownTextLineGuide\(\{/u);
  assert.match(app, /observeGuideTranscript\(text, performance\.now\(\)\)/u);
  assert.match(app, /observeGuideTranscript\(text, performance\.now\(\), \{ replace: true \}\)/u);
  const monitor = app.slice(app.indexOf("function monitorSpeech()"), app.indexOf("async function startReading()"));
  assert.doesNotMatch(monitor, /updateReadingGuide\(/u);
  assert.doesNotMatch(monitor, /estimateGuideWordIndex/u);
});

test("the production viewport uses the proven top anchor and keeps manual position out of speech evidence", async () => {
  const app = await appSource;
  assert.match(app, /anchoredScrollTop\(\{/u);
  assert.match(app, /lineAtReadingAnchor\(\{/u);
  const manual = app.slice(app.indexOf("function reconcileManualGuidePosition()"), app.indexOf("function updateReadingGuide(event)"));
  assert.match(manual, /state\.guideVisibleLineIndex = nextLine/u);
  assert.doesNotMatch(manual, /confirmedWordIndex|confirmedMatches|confirmedProgress/u);
  assert.doesNotMatch(app, /guidePausedUntil/u);
});

test("the streaming lane is gated and Whisper remains the final assessment authority", async () => {
  const app = await appSource;
  assert.match(app, /resolveStreamingGuideGate\(\{/u);
  assert.match(app, /requestedStreamingGuide/u);
  assert.match(app, /await stopStreamingGuideAttempt\(\);/u);
  assert.match(app, /finalAssessment: "whisper"/u);
  assert.match(app, /const text = await recognizer\.transcribe\(audio\)/u);
});

test("guide transcript memory is reset per attempt and excluded from reports", async () => {
  const app = await appSource;
  assert.match(app, /state\.guideTranscriptText = "";/u);
  const report = app.slice(app.indexOf("function sessionReport()"), app.indexOf("async function exportReport()"));
  assert.doesNotMatch(report, /guideTranscriptText|finalText|transcriptDiagnostics/u);
  assert.match(report, /transcriptIncluded: false, transcriptStored: false/u);
});
