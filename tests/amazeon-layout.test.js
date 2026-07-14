import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../apps/internet-recovery/amazeon.css", import.meta.url), "utf8"),
  readFile(new URL("../apps/internet-recovery/amazeon-frame.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
]);

test("Amaze-On exposes parcels, bins, receipt trace, and independent companion", async () => {
  const [app, css, , html] = await files;
  assert.match(html, /id="amazeonParcelList"/u);
  assert.match(html, /Cart and receipt trace/u);
  assert.match(html, /CASE FILE/u);
  assert.match(html, /MIC: OFF/u);
  assert.match(html, /id="amazeonPlaytest"/u);
  assert.match(app, /openAmazeOnExperience/u);
  assert.match(app, /acknowledgeAmazeOnMidpoint/u);
  assert.match(app, /selectNextAmazeOnPassage\(state\.amazeonState, \{ lane: "playtest" \}\)/u);
  assert.match(app, /applyAmazeOnReading\(null/u);
  assert.match(app, /state\.amazeonPersisted = false/u);
  assert.match(css, /@media\(max-width:1279px\)/u);
  assert.match(css, /data-receipt-open=true/u);
});

test("Amaze-On contains no real checkout, audio, iframe, or percentage progress", async () => {
  const [, , , html] = await files;
  const section = html.slice(html.indexOf('<section id="amazeon"'), html.indexOf('<section id="spottyfi"'));
  assert.doesNotMatch(section, /<(?:audio|video|iframe)\b/iu);
  assert.doesNotMatch(section, /\b\d+%/u);
  assert.doesNotMatch(section, /credit card|shipping address|payment method/iu);
});

test("Amaze-On uses the approved three-phase marketplace art and visible repair checks", async () => {
  const [app, , frameCss] = await files;
  assert.match(frameCss, /amazeon-frames\/amazeon-01\.webp/u);
  assert.match(frameCss, /amazeon-frames\/amazeon-02\.webp/u);
  assert.match(frameCss, /amazeon-frames\/amazeon-03\.webp/u);
  assert.match(frameCss, /data-stage="sort"/u);
  assert.match(frameCss, /data-stage="receipt"/u);
  assert.match(frameCss, /SORT THE FOUR CLAIMS/u);
  assert.match(frameCss, /TRACE THE RECEIPT/u);
  assert.match(app, /page\.dataset\.midpointDiscovered/u);
  assert.match(app, /page\.dataset\.secured/u);
  assert.match(app, /data-stage=/u);
  assert.match(app, /renderSimpleDiagnosticPanel\("amazeon",transition\.state\)/u);
  assert.doesNotMatch(app, /OF 7 AMAZE-ON UNITS SAVED/u);
});
