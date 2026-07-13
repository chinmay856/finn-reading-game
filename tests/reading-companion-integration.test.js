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

test("guide transcript memory is reset per attempt and excluded from reports", async () => {
  const app = await appSource;
  assert.match(app, /state\.guideTranscriptText = "";/u);
  const report = app.slice(app.indexOf("function sessionReport()"), app.indexOf("async function exportReport()"));
  assert.doesNotMatch(report, /guideTranscriptText|finalText|transcriptDiagnostics/u);
  assert.match(report, /transcriptIncluded: false, transcriptStored: false/u);
});
