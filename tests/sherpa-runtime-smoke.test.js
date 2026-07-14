import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = readFile(new URL("../sherpa-runtime-smoke.html", import.meta.url), "utf8");
const source = readFile(new URL("../speech/sherpa-runtime-smoke.js", import.meta.url), "utf8");

test("the production smoke page proves real isolation and warm-up without microphone or transcript work", async () => {
  const [page, script] = await Promise.all([html, source]);
  assert.match(page, /does not request a microphone, process speech, or retain a transcript/u);
  assert.match(script, /globalThis\.crossOriginIsolated !== true/u);
  assert.match(script, /await loadPinnedSherpaRuntime\(/u);
  assert.match(script, /onDataProgress\(progress\)/u);
  assert.doesNotMatch(script, /preparePinnedSherpaRuntimeCache/u);
  assert.match(script, /const prepared = recognizer\.prepare\(\)/u);
  assert.match(script, /if \(!statusLocked\) setStatus/u);
  assert.ok(script.indexOf("statusLocked = true") < script.indexOf("__sherpaRuntimeSmoke"));
  assert.doesNotMatch(script, /getUserMedia|transcribe|localStorage|sessionStorage/u);
  assert.doesNotMatch(script.slice(script.indexOf("__sherpaRuntimeSmoke")), /text|transcript|audio/u);
});
