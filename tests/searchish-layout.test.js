import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../apps/internet-recovery/searchish.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
]);

test("Search-ish exposes semantic results, branches, evidence, and an independent companion", async () => {
  const [app, css, html] = await files;
  assert.match(html, /id="searchish"/u);
  assert.match(html, /id="searchishResultList"/u);
  assert.match(html, /id="searchishInspector"[^>]+aria-labelledby/u);
  assert.match(html, /CASE FILE · SLOT 7/u);
  assert.match(html, /MIC: OFF · NO READING SCORE/u);
  assert.match(app, /openSearchishExperience/u);
  assert.match(app, /acknowledgeSearchishMidpoint/u);
  assert.match(css, /@media \(max-width:1279px\)/u);
  assert.match(css, /data-inspector-open="true"/u);
});

test("Search-ish has no site audio, external map, or percentage progress", async () => {
  const [, , html] = await files;
  const section = html.slice(html.indexOf('<section id="searchish"'), html.indexOf('<section id="mapguess"'));
  assert.doesNotMatch(section, /<(?:audio|video|iframe)\b/iu);
  assert.doesNotMatch(section, /\b\d+%/u);
});
