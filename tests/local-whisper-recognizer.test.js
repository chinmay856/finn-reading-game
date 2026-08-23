import assert from "node:assert/strict";
import test from "node:test";
import { LocalWhisperRecognizer } from "../speech/local-whisper-recognizer.js";

test("a stalled local speech request times out and resets the worker", async () => {
  let terminated = false;
  const recognizer = new LocalWhisperRecognizer({ transcribeTimeoutMs: 5 });
  recognizer.ready = true;
  recognizer.worker = {
    postMessage() {},
    terminate() { terminated = true; },
  };

  await assert.rejects(recognizer.request("transcribe"), /timed out/u);
  assert.equal(terminated, true);
  assert.equal(recognizer.ready, false);
  assert.equal(recognizer.pending.size, 0);
});
