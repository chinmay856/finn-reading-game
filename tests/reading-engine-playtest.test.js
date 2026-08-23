import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { READING_ENGINE_PLAYTEST, READING_ENGINE_PLAYTEST_TEXT } from "../content/reading-engine-playtest.js";
import { advanceEvidenceCursor, alignTranscript, tokenizeText } from "../reading-engine.js";

test("contained live playtest is exactly 50 words in short display lines", () => {
  assert.equal(tokenizeText(READING_ENGINE_PLAYTEST_TEXT).length, 50);
  assert.equal(READING_ENGINE_PLAYTEST.lines.length, 6);
  assert.ok(READING_ENGINE_PLAYTEST.lines.every((line) => tokenizeText(line).length <= 12));
});

test("playtest content authors one easy comprehension check and non-accusatory word help", () => {
  assert.equal(READING_ENGINE_PLAYTEST.comprehension.choices.length, 3);
  assert.equal(READING_ENGINE_PLAYTEST.comprehension.choices.filter((choice) => choice.correct).length, 1);
  assert.equal(READING_ENGINE_PLAYTEST.challengingWords.length, 3);
  const passageWords = new Set(tokenizeText(READING_ENGINE_PLAYTEST_TEXT).map(({ normalized }) => normalized));
  for (const entry of READING_ENGINE_PLAYTEST.challengingWords) {
    assert.ok(passageWords.has(tokenizeText(entry.word)[0].normalized), `${entry.word} must occur in the passage`);
    assert.ok(entry.meaning.length > 0);
    assert.match(entry.example.toLowerCase(), new RegExp(`\\b${entry.word.toLowerCase()}\\b`, "u"));
    assert.equal(entry.audioSrc, `/audio/reading-engine-playtest/kokoro-heart/${entry.word}.m4a`);
  }
  assert.equal(READING_ENGINE_PLAYTEST.comprehension.tryAgainFeedback, "That’s incorrect. Try again.");
});

test("playtest exposes both guide modes, manual completion, and transcript-free result persistence", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("../reading-guide-playtest.html", import.meta.url), "utf8"),
    readFile(new URL("../reading-guide-playtest.js", import.meta.url), "utf8"),
  ]);
  assert.match(html, /value="hybrid"/u);
  assert.match(html, /value="whisper"/u);
  assert.match(html, />Finish now</u);
  assert.match(html, /role="progressbar"/u);
  assert.match(source, /createSherpaStreamingRecognizer/u);
  assert.match(source, /LocalWhisperRecognizer/u);
  assert.match(source, /disableSherpa/u);
  assert.match(source, /AUTO_FINISH_SILENCE_MS = 5_000/u);
  assert.match(source, /finn-reading-engine-playtest-result-v1/u);
  assert.match(source, /saveResult\(resultSummary\)/u);
  assert.match(html, /id="preserveDiagnostic"[^>]*checked/u);
  assert.match(html, /id="deleteSavedDiagnostic"/u);
  assert.match(source, /saveLatestDiagnosticRun/u);
  assert.match(source, /source === "sherpa-live" \? 0/u);
  assert.match(source, /autoFinishArmedAt = observedAt/u);
  assert.match(html, /id="comprehensionChoices"/u);
  assert.match(html, /id="challengingWords"/u);
  assert.match(html, /id="coverageBand"/u);
  assert.match(html, /id="paceBand"/u);
  assert.match(source, /const challengingWordAudio = new Audio\(\)/u);
  assert.match(source, /challengingWordAudio\.src = entry\.audioSrc/u);
  assert.match(source, /with Kokoro Heart/u);
  assert.match(html, /not words the voice check marked wrong/u);
  assert.doesNotMatch(source, /Samantha/u);
  assert.doesNotMatch(html, />Accuracy</u);
  assert.doesNotMatch(source, /capture\.level/u);
  assert.doesNotMatch(source, /resultSummary\s*=\s*\{[^}]*transcript/su);
});

test("accumulated Sherpa text cannot rematch earlier common words against the passage ending", () => {
  const observed = tokenizeText([
    "A city library found an unusual way to protect its oldest maps.",
    "Volunteers photographed each page, recorded every torn edge and stored copies in several places.",
    "When a leaking pipe damaged one cabinet, the originals needed to repair.",
    "But the readers could still study the digital maps and help identify missing details.",
  ].join(" ")).map(({ display }) => display);
  let cursor = 0;
  for (let spokenCount = 2; spokenCount <= 42; spokenCount += 2) {
    const alignment = alignTranscript(READING_ENGINE_PLAYTEST_TEXT, observed.slice(0, spokenCount).join(" "), {
      lookAhead: 50,
      startIndex: 0,
    });
    cursor = Math.max(cursor, advanceEvidenceCursor({
      currentTokenIndex: cursor,
      matchedTokenIndexes: alignment.matchedTokenIndexes,
      maximumAdvance: 12,
      totalCount: 50,
    }));
  }
  assert.ok(cursor <= 43, `cursor advanced to ${cursor} before the final passage words were spoken`);
});
