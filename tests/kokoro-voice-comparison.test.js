import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Kokoro comparison is a contained local q8 listening spike", async () => {
  const [html, source, packageJson] = await Promise.all([
    readFile(new URL("../kokoro-voice-comparison.html", import.meta.url), "utf8"),
    readFile(new URL("../kokoro-voice-comparison.js", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(packageJson, /"kokoro-js": "1\.2\.1"/u);
  assert.match(source, /onnx-community\/Kokoro-82M-v1\.0-ONNX/u);
  assert.match(source, /dtype: "q8"/u);
  assert.match(source, /device: "wasm"/u);
  assert.match(source, /1939ad2a8e416c0acfeecc08a694d14ef25f2231/u);
  assert.match(source, /speechSynthesis\.cancel\(\)/u);
  assert.match(source, /URL\.revokeObjectURL/u);
  assert.match(html, /Nothing you play is uploaded/u);
  assert.match(html, /Heart · American female/u);
  assert.match(html, /Bella · American female/u);
  assert.match(html, /Fenrir · American male/u);
});
