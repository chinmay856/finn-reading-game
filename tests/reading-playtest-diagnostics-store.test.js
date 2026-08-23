import assert from "node:assert/strict";
import test from "node:test";

import { encodePcmWav } from "../reading-playtest-diagnostics-store.js";

test("diagnostic recording encoder creates a valid mono 16-bit WAV", async () => {
  const blob = encodePcmWav(new Float32Array([0, 1, -1, 0.5]), 16_000);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(bytes.buffer);
  assert.equal(blob.type, "audio/wav");
  assert.equal(new TextDecoder().decode(bytes.slice(0, 4)), "RIFF");
  assert.equal(new TextDecoder().decode(bytes.slice(8, 12)), "WAVE");
  assert.equal(view.getUint16(22, true), 1);
  assert.equal(view.getUint32(24, true), 16_000);
  assert.equal(view.getUint16(34, true), 16);
  assert.equal(bytes.length, 52);
});
