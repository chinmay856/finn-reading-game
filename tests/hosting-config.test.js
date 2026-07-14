import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const config = JSON.parse(await readFile(new URL("../firebase.json", import.meta.url), "utf8"));

function headersFor(source) {
  const rule = config.hosting.headers.find((candidate) => candidate.source === source);
  return Object.fromEntries(rule?.headers.map(({ key, value }) => [key.toLowerCase(), value]) ?? []);
}

test("Firebase serves the complete app from the production build", () => {
  assert.equal(config.hosting.public, "dist");
  assert.deepEqual(config.emulators.hosting, { host: "127.0.0.1", port: 5005 });
});

test("every response carries the isolation headers required by the pinned Sherpa runtime", () => {
  const headers = headersFor("**");
  assert.equal(headers["cross-origin-opener-policy"], "same-origin");
  assert.equal(headers["cross-origin-embedder-policy"], "require-corp");
  assert.equal(headers["cross-origin-resource-policy"], "same-origin");
  assert.equal(headers["permissions-policy"], "microphone=(self)");
});

test("versioned Sherpa files are immutable while HTML always revalidates", () => {
  assert.equal(headersFor("/sherpa/v1.13.2/**")["cache-control"], "public, max-age=31536000, immutable");
  // This same-URL worker now exists only to replace the briefly deployed fetch-intercepting worker.
  assert.equal(headersFor("/sherpa-runtime-cache-sw.js")["cache-control"], "no-cache");
  assert.equal(headersFor("**/*.html")["cache-control"], "no-cache");
  assert.equal(headersFor("/")["cache-control"], "no-cache");
});
