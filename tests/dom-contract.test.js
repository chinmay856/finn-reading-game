import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("every app DOM reference exists in the prototype HTML", async () => {
  const [app, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  const referencedIds = [...app.matchAll(/\$\("([^"]+)"\)/gu)].map((match) => match[1]);
  const missingIds = [...new Set(referencedIds)].filter((id) => !html.includes(`id="${id}"`));
  assert.deepEqual(missingIds, []);
  assert.match(html, /<script type="module" src="\/app\.js"><\/script>/u);
});

test("the reading engine stays free of wrapper concepts", async () => {
  const engine = await readFile(new URL("../reading-engine.js", import.meta.url), "utf8");
  assert.doesNotMatch(engine, /StoryQuest|Internet Recovery|Mary|stars|badges|coins|bandwidth/iu);
});

test("theme-neutral game rules stay free of wrapper concepts", async () => {
  const rules = await readFile(new URL("../game-rules/reading-session-strength.js", import.meta.url), "utf8");
  assert.doesNotMatch(rules, /WikiWhy|Internet Recovery|Finn|site stability|repair/iu);
});

test("the local speech adapter stays free of wrapper concepts", async () => {
  const files = await Promise.all([
    readFile(new URL("../speech/audio-capture.js", import.meta.url), "utf8"),
    readFile(new URL("../speech/local-whisper-recognizer.js", import.meta.url), "utf8"),
    readFile(new URL("../speech/whisper-worker.js", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(files.join("\n"), /StoryQuest|Internet Recovery|Mary|stars|badges|coins|bandwidth/iu);
});

test("the diagnostic report declares local-only audio handling", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, /fetch\(|XMLHttpRequest|WebSocket/u);
  assert.doesNotMatch(app, /SpeechRecognition|webkitSpeechRecognition/u);
});

test("continuous reading has no sentence or line check controls", async () => {
  const [app, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(html, /Check line|Retry line|Check sentence/iu);
  assert.match(html, /CONTINUOUS READER/u);
  assert.match(html, /repairFill/u);
  assert.match(html, /OPTIONAL EVIDENCE CHECK/u);
  assert.match(html, /Copy timing report/u);
  assert.match(html, /Inspect this session’s local transcripts/u);
  assert.match(html, /Prepare microphone/u);
  assert.match(app, /hasEndEvidence/u);
  assert.doesNotMatch(html, />Start reading</u);
  assert.match(html, /<option value="250" selected>250 WPM<\/option>/u);
  assert.match(html, /<option value="300">300 WPM<\/option>/u);
  assert.match(app, /updateReadingGuide/u);
  assert.match(app, /hasEndEvidence\(state\.confirmedMatches/u);
  assert.match(html, /id="finalizationStatus"/u);
  assert.match(app, /finalAddedWords/u);
  assert.match(html, /INTERNET RECOVERY 98/u);
  assert.match(html, /BROWSER-BASED REMOTE RECOVERY DESKTOP/u);
  assert.match(html, /id="repairEdge"/u);
  assert.match(html, /id="repairOutcome"/u);
  assert.match(html, /id="savedRepairReceipt"/u);
  assert.match(app, /calculateWikiWhyRepair/u);
});

test("implemented wrapper copy uses stable IDs outside the Reading Engine", async () => {
  const [app, copy, engine, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/copy.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.match(copy, /mission\.preparation\.title/u);
  assert.match(copy, /privacy\.microphone\.truth/u);
  assert.match(html, /data-copy-id="mission\.preparation\.title"/u);
  assert.match(app, /hydrateInternetRecoveryCopy/u);
  assert.doesNotMatch(engine, /mission\.preparation|privacy\.microphone|WikiWhy/u);
});

test("WikiWhy production art stays in the wrapper and is wired into the page", async () => {
  const [engine, html] = await Promise.all([
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/wikiwhy-globe.png", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/site-assets/wikiwhy-toast-evidence.png", import.meta.url)),
  ]);
  assert.match(html, /wikiwhy-globe\.png/u);
  assert.match(html, /wikiwhy-toast-evidence\.png/u);
  assert.match(html, /visual-polish\.css/u);
  assert.match(html, /class="wiki-masthead"/u);
  assert.doesNotMatch(engine, /site-assets|wikiwhy-globe|toast-evidence/iu);
});

test("Techno progress animation is optional wrapper presentation", async () => {
  const [app, engine, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-progress-push-loop.webp", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-progress-push-still.webp", import.meta.url)),
  ]);
  assert.match(html, /id="technoRepairSprite"/u);
  assert.match(app, /animateTechnoProgress/u);
  assert.match(app, /prefers-reduced-motion: reduce/u);
  assert.match(app, /2_050/u);
  assert.doesNotMatch(engine, /Techno|techno-progress|technoRepairSprite/iu);
});

test("live checkpoints cannot fragment the final recording", async () => {
  const capture = await readFile(new URL("../speech/audio-capture.js", import.meta.url), "utf8");
  assert.match(capture, /finalRecorder/u);
  assert.match(capture, /previewRecorder/u);
  assert.doesNotMatch(capture, /finalRecorder\.requestData/u);
});

test("the Moonshine comparison is isolated and theme-neutral", async () => {
  const [app, html, worker] = await Promise.all([
    readFile(new URL("../moonshine-benchmark.js", import.meta.url), "utf8"),
    readFile(new URL("../moonshine-benchmark.html", import.meta.url), "utf8"),
    readFile(new URL("../speech/moonshine-benchmark-worker.js", import.meta.url), "utf8"),
  ]);
  const referencedIds = [...app.matchAll(/\$\("([^"]+)"\)/gu)].map((match) => match[1]);
  const missingIds = [...new Set(referencedIds)].filter((id) => !html.includes(`id="${id}"`));
  assert.deepEqual(missingIds, []);
  assert.match(worker, /onnx-community\/moonshine-base-ONNX/u);
  assert.match(worker, /onnx-community\/silero-vad/u);
  assert.match(worker, /const device = "wasm"/u);
  assert.match(worker, /summarizeSignal/u);
  assert.doesNotMatch(worker, /WikiWhy|Internet Recovery|Finn|stars|badges|coins|bandwidth/iu);
  assert.doesNotMatch(app, /fetch\(|XMLHttpRequest|WebSocket/u);
  assert.match(app, /EVIDENCE_PASSAGE\.paragraphs\[0\]/u);
  assert.match(html, /id="diagnostics"/u);
  assert.match(html, /Nothing is uploaded or retained/u);
});
