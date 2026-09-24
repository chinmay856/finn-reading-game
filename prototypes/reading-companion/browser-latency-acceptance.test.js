import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const results = JSON.parse(await readFile(new URL("./browser-latency-results-2026-07-13.json", import.meta.url), "utf8"));

test("the warmed browser streaming suite stays below one second", () => {
  assert.deepEqual(results.map(({ id }) => id), [
    "natural-154", "fast-200", "fast-250", "mid-pause", "room-noise", "restart",
  ]);
  for (const result of results) {
    assert.ok(result.firstEvidenceAfterSpeechMs < 1_000, `${result.id} first evidence exceeded one second`);
    assert.ok(result.evidenceLagP95Ms < 1_000, `${result.id} p95 evidence lag exceeded one second`);
    assert.ok(result.evidenceLagMaximumMs < 1_000, `${result.id} maximum evidence lag exceeded one second`);
    assert.ok(result.worstDecodeMs < 200, `${result.id} blocked the UI thread for 200 ms or more`);
    assert.equal(result.finalLine, 4, `${result.id} did not reach the final line`);
  }
});
