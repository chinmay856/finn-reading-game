import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const REVIEWED_CHECKLISTS = Object.freeze([
  ["WikiWhy", "../docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg", "data-overlay=\"act2-checklist\""],
  ["ThreadIt", "../docs/design/screens/2026-08-16/threadit-production/threadit-anchor-master-v2.svg", "data-lock-overlay=\"true\""],
  ["FacePlace", "../docs/design/screens/2026-08-16/faceplace-production/faceplace-anchor-master-v2.svg", "data-lock-overlay=\"true\""],
  ["MyCorner", "../docs/design/screens/2026-08-22/mycorner-production/mycorner-anchor-master-v3.svg", "data-module=\"lock-overlay\""],
  ["Yahuh", "../docs/design/screens/2026-08-16/yahuh-production/yahuh-anchor-master-v2.svg", "data-lock-overlay=\"true\""],
  ["ViewTube", "../docs/design/screens/2026-08-17/viewtube-production/viewtube-anchor-master-v2.svg", "data-lock-overlay=\"true\""],
  ["Amaze-On", "../docs/design/screens/2026-08-15/amaze-on-production/amaze-on-anchor-master-v1.svg", "data-overlay=\"repair-checklist\""],
  ["Search-ish", "../docs/design/screens/2026-08-16/searchish-production/searchish-anchor-master-v3.svg", "data-module=\"lock-overlay\""],
  ["Spotty-Fi", "../docs/design/screens/2026-08-15/spotty-fi-production/spotty-fi-anchor-master-v1.svg", "data-overlay=\"act2-checklist\""],
  ["MapGuess", "../docs/design/screens/2026-08-22/mapguess-production/mapguess-anchor-master-v2.svg", "data-module=\"moving-target-overlay\""],
]);

function firstChecklistRect(svg, marker) {
  const markerIndex = svg.indexOf(marker);
  assert.notEqual(markerIndex, -1, `missing checklist marker ${marker}`);
  const rect = svg.slice(markerIndex, markerIndex + 900).match(/<rect\b[^>]*?\bx="([\d.]+)"[^>]*?\swidth="([\d.]+)"/u);
  assert.ok(rect, `missing checklist background rect after ${marker}`);
  return { x: Number(rect[1]), width: Number(rect[2]) };
}

test("playable repair checklists use the compact shared footprint", async () => {
  for (const [site, path, marker] of REVIEWED_CHECKLISTS) {
    const svg = await readFile(new URL(path, import.meta.url), "utf8");
    const { x, width } = firstChecklistRect(svg, marker);
    assert.ok(width <= 330, `${site} checklist width ${width}px exceeds the compact 330px maximum`);
    assert.ok(x >= 109 && x + width <= 911, `${site} checklist must remain inside the site surface`);
  }
});
