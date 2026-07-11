import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(app, /audioUploadedByApp:\s*false/u);
  assert.match(app, /rawAudioStored:\s*false/u);
  assert.match(app, /transcriptStored:\s*false/u);
  assert.doesNotMatch(app, /SpeechRecognition|webkitSpeechRecognition/u);
});
