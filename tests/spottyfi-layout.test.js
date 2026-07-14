import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../apps/internet-recovery/spottyfi.css", import.meta.url), "utf8"),
  readFile(new URL("../apps/internet-recovery/playful-frame-system.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
]);

test("Spotty-Fi exposes silent tracks, queue, history drawer, evidence, and companion", async () => {
  const [app, css, , html] = await files;
  assert.match(html, /CANONICAL FICTIONAL SILENT LIBRARY/u);
  assert.match(html, /id="spottyfiTrackList"/u);
  assert.match(html, /Credits, history, and suggestions/u);
  assert.match(html, /CASE FILE/u);
  assert.match(app, /openSpottyFiExperience/u);
  assert.match(css, /@media\(max-width:1279px\)/u);
});

test("Spotty-Fi ships no audio, video, lyrics, or percentage progress", async () => {
  const [, , , html] = await files;
  const section = html.slice(html.indexOf('<section id="spottyfi"'), html.indexOf('<section id="mapguess"'));
  assert.doesNotMatch(section, /<(?:audio|video|iframe)\b/iu);
  assert.doesNotMatch(section, /lyrics?\s*:/iu);
  assert.doesNotMatch(section, /\b\d+%/u);
});

test("Spotty-Fi maps every repair to a visible checklist item and has no fake player", async () => {
  const [app, , frameCss, html] = await files;
  const section = html.slice(html.indexOf('<section id="spottyfi"'), html.indexOf('<section id="mapguess"'));

  assert.match(section, /id="spottyfiFrameTracks"[^>]+Act one album-card repair checklist/u);
  assert.match(section, /id="spottyfiFrameControls"[^>]+Act two listener-control checklist/u);
  assert.match(frameCss, /spottyfi-frame-tracks li\[data-restored="true"\] strong::before/u);
  assert.match(frameCss, /spottyfi-frame-controls li\[data-restored="true"\]::before/u);
  assert.doesNotMatch(section, /spottyfi-frame-player|data-player-action|VISUAL PLAYER ONLY/u);
  assert.doesNotMatch(app, /syncSpottyFiPlayer|spottyfiPlaying|PASSAGES CLEARED/u);
  assert.doesNotMatch(section, /OF 8 REPAIRS COMPLETE/u);
});
