import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Whisper uses a fixed model revision rather than mutable main", async () => {
  const source = await readFile(new URL("../speech/whisper-worker.js", import.meta.url), "utf8");
  assert.match(source, /MODEL_REVISION = "[a-f0-9]{40}"/u);
  assert.match(source, /revision: MODEL_REVISION/u);
  assert.doesNotMatch(source, /resolve\/main/u);
});
