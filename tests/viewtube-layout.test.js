import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const CSS_URL = new URL("../apps/internet-recovery/viewtube.css", import.meta.url);

test("ViewTube reserves a distinct 1440 browser and 340-370 companion composition", async () => {
  const css = await readFile(CSS_URL, "utf8");
  assert.match(
    css,
    /\.viewtube-surface\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) clamp\(340px, 25vw, 370px\)/su,
  );
  assert.match(css, /\.viewtube-browser-window,\s*\.viewtube-companion-gate\s*\{/u);
  assert.match(
    css,
    /\.viewtube-content-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(218px, 0\.34fr\)/su,
  );
  assert.match(css, /\.viewtube-player-region\s*\{[^}]*grid-column:\s*1[^}]*grid-row:\s*1/su);
  assert.match(css, /\.viewtube-secondary-drawer\s*\{[^}]*grid-column:\s*2[^}]*grid-row:\s*1 \/ 3/su);
});

test("ViewTube names the silent player, recommendation rail, and lower context semantically", async () => {
  const css = await readFile(CSS_URL, "utf8");
  for (const selector of [
    ".viewtube-silent-player",
    ".viewtube-player-frame",
    ".viewtube-recommendations",
    ".viewtube-comments",
    ".viewtube-lower-context",
    ".viewtube-site-transcript",
    ".viewtube-source-context",
  ]) {
    assert.match(css, new RegExp(selector.replace(".", "\\."), "u"));
  }
  assert.match(
    css,
    /\.viewtube-lower-context\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.15fr\) minmax\(210px, 0\.85fr\)/su,
  );
  assert.doesNotMatch(css, /(?:percentage|progressbar|progress-bar|data-progress|--viewtube-progress)/iu);
});

test("ViewTube exposes seven discrete four-plus-three timeline units without a width formula", async () => {
  const css = await readFile(CSS_URL, "utf8");
  assert.match(
    css,
    /\.viewtube-timeline-units\s*\{[^}]*grid-template-columns:\s*repeat\(7, minmax\(0, 1fr\)\)/su,
  );
  assert.match(css, /\.viewtube-timeline-unit\[data-phase="restore"\]/u);
  assert.match(css, /\.viewtube-timeline-unit\[data-phase="track"\]/u);
  assert.match(css, /\.viewtube-track-list\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/su);
  assert.match(css, /\.viewtube-evidence-track\[data-verified="true"\]/u);
  assert.doesNotMatch(css, /\.viewtube-timeline-unit[^}]*width:\s*calc/iu);
});

test("1180 layout moves recommendations and comments into a site-owned drawer", async () => {
  const css = await readFile(CSS_URL, "utf8");
  const responsive = css.match(
    /@media \(min-width: 1180px\) and \(max-width: 1279px\) \{(?<body>[\s\S]*?)\n\}/u,
  )?.groups?.body;
  assert.ok(responsive);
  assert.match(
    responsive,
    /\.viewtube-surface\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(300px, 320px\)/su,
  );
  assert.match(
    responsive,
    /\.viewtube-secondary-drawer\s*\{[^}]*position:\s*absolute[^}]*display:\s*none[^}]*width:\s*clamp\(300px, 38vw, 360px\)/su,
  );
  assert.match(
    responsive,
    /\.viewtube-page\[data-secondary-drawer-open="true"\] \.viewtube-secondary-drawer\s*\{[^}]*display:\s*grid/su,
  );
  assert.match(responsive, /\.viewtube-drawer-toggle,\s*\.viewtube-drawer-close\s*\{[^}]*display:\s*inline-block/su);
  assert.doesNotMatch(responsive, /\.viewtube-(?:source-context|companion-gate)[^{]*\{[^}]*display:\s*none/su);
});

test("ViewTube layout keeps keyboard focus and alternate display modes explicit", async () => {
  const css = await readFile(CSS_URL, "utf8");
  assert.match(css, /\.viewtube-page button:focus-visible/u);
  assert.match(css, /\.viewtube-page \[tabindex\]:focus-visible/u);
  assert.match(css, /outline:\s*3px solid var\(--viewtube-focus\)/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(css, /animation:\s*none !important/u);
  assert.match(css, /transition:\s*none !important/u);
  assert.match(css, /@media \(forced-colors: active\)/u);
  assert.match(css, /outline-color:\s*Highlight/u);
  assert.match(css, /border-color:\s*CanvasText/u);
});
