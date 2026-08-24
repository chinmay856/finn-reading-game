import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ACTIVE_MASTERS = Object.freeze([
  ["ThreadIt", "../docs/design/screens/2026-08-16/threadit-production/threadit-anchor-master-v2.svg"],
  ["FacePlace", "../docs/design/screens/2026-08-16/faceplace-production/faceplace-anchor-master-v2.svg"],
  ["MyCorner", "../docs/design/screens/2026-08-22/mycorner-production/mycorner-anchor-master-v3.svg"],
  ["Yahuh", "../docs/design/screens/2026-08-16/yahuh-production/yahuh-anchor-master-v2.svg"],
  ["ViewTube", "../docs/design/screens/2026-08-17/viewtube-production/viewtube-anchor-master-v2.svg"],
  ["Amaze-On", "../docs/design/screens/2026-08-15/amaze-on-production/amaze-on-anchor-master-v1.svg"],
  ["Search-ish", "../docs/design/screens/2026-08-16/searchish-production/searchish-anchor-master-v3.svg"],
  ["Spotty-Fi", "../docs/design/screens/2026-08-15/spotty-fi-production/spotty-fi-anchor-master-v1.svg"],
  ["MapGuess", "../docs/design/screens/2026-08-22/mapguess-production/mapguess-anchor-master-v2.svg"],
]);

test("launcher gives corrupted and recovered sites distinct actions", async () => {
  const [html, css, javascript] = await Promise.all([
    readFile(new URL("../playable-missions.html", import.meta.url), "utf8"),
    readFile(new URL("../playable-missions.css", import.meta.url), "utf8"),
    readFile(new URL("../playable-missions.js", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(html, /10 CASES AVAILABLE/u);
  assert.match(javascript, /OPEN CORRUPTED WEBSITE/u);
  assert.match(javascript, /RECOVERY COMPLETE · PLAY AGAIN/u);
  assert.match(css, /\.launcher-site \.case-status[^}]*background:var\(--corrupt\)/u);
  assert.match(css, /\.launcher-site\.completed \.case-status[^}]*background:#176633/u);
});

test("runtime windows share aligned three-button chrome", async () => {
  const [html, css] = await Promise.all([
    readFile(new URL("../playable-missions.html", import.meta.url), "utf8"),
    readFile(new URL("../playable-missions.css", import.meta.url), "utf8"),
  ]);
  assert.ok((html.match(/class="window-controls"/gu) ?? []).length >= 3);
  assert.ok((html.match(/class="window-control minimize"/gu) ?? []).length >= 3);
  assert.ok((html.match(/class="window-control maximize"/gu) ?? []).length >= 3);
  assert.ok((html.match(/class="window-control close"/gu) ?? []).length >= 3);
  assert.match(css, /--titlebar:\s*linear-gradient\(90deg,#053b70 0%,#00578d 58%,#00305e 100%\)/u);
});

test("story portraits keep their native square cells without a second frame", async () => {
  const css = await readFile(new URL("../playable-missions.css", import.meta.url), "utf8");
  const rule = css.match(/\.speaker-tile\s*\{([^}]+)\}/u)?.[1] ?? "";
  assert.match(rule, /aspect-ratio:\s*1/u);
  assert.match(rule, /border:\s*0/u);
  assert.doesNotMatch(rule, /height:\s*180px/u);
});

test("every non-WikiWhy mission paints one clean full-width identity bar", async () => {
  for (const [site, path] of ACTIVE_MASTERS) {
    const svg = await readFile(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(svg, /x="112" y="24" width="520" height="29"/u, `${site} still has a narrow titlebar patch`);
    assert.match(svg, /x="109" y="22" width="802" height="34" fill="url\(#titleGradient\)"/u, `${site} is missing the full-width titlebar`);
  }
});

test("Spotty-Fi pending repair labels use canonical corruption red", async () => {
  const svg = await readFile(new URL("../docs/design/screens/2026-08-15/spotty-fi-production/spotty-fi-anchor-master-v1.svg", import.meta.url), "utf8");
  assert.match(svg, /\.spot-check-row\{fill:#C5251E/u);
  assert.doesNotMatch(svg, /\.spot-check-row\{fill:#7A1815/u);
});
