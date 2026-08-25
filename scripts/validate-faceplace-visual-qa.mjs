#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-16/faceplace-production/faceplace-anchor-master-v2.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const errors = [];
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push("FacePlace was not generated from the reviewed shared shell.");
for (let index = 1; index <= 12; index += 1) {
  const pngPath = path.join(path.dirname(svgPath), `faceplace-anchor-v2_p${index}.png`);
  if (!fs.existsSync(pngPath)) errors.push(`Missing exported FacePlace frame ${index}.`);
}
if (!fs.existsSync(path.join(path.dirname(svgPath), "faceplace-anchor-review-v2.html"))) errors.push("Missing FacePlace v2 click-through reviewer.");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(200);
const report = await page.evaluate(() => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const needs = (state, values) => values.forEach((value) => { if (!state?.textContent.includes(value)) issues.push(`${state?.id} missing ${value}`); });
  if (states.length !== 12) issues.push(`Expected twelve FacePlace sequence states; found ${states.length}.`);
  for (const state of states) {
    if (state.querySelectorAll("[data-post-state]").length !== 1) issues.push(`${state.id} must contain one authored social post.`);
    if (state.querySelectorAll("[data-album-module='true']").length !== 1) issues.push(`${state.id} must contain one profile-style album module.`);
    const photoFrame = [...state.querySelectorAll("rect")].find((rect) => rect.getAttribute("x") === "133" && rect.getAttribute("y") === "294" && rect.getAttribute("width") === "532" && rect.getAttribute("height") === "240");
    if (!photoFrame) issues.push(`${state.id} changed the fixed 532 × 240 photo viewport.`);
    for (const element of state.querySelectorAll("[data-qa-box]:not([data-post-state])")) {
      const bounds = element.getAttribute("data-qa-box").split(",").map(Number);
      const actual = element.getBBox();
      if (actual.x < bounds[0] - 1.5 || actual.y < bounds[1] - 1.5 || actual.x + actual.width > bounds[2] + 1.5 || actual.y + actual.height > bounds[3] + 1.5) issues.push(`${state.id} overflow: ${element.textContent.trim().slice(0, 42)}`);
    }
    for (const text of state.querySelectorAll(".face-caption,.face-body,.face-comment,.face-album,.lock-label")) {
      const maxWidth = text.classList.contains("lock-label") ? 385 : text.classList.contains("face-album") ? 88 : 522;
      if (text.getBBox().width > maxWidth) issues.push(`${state.id} text overflows its ${maxWidth}px safe width: ${text.textContent}`);
    }
    if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id} exposes internal Act/Phase language.`);
  }
  const initial = document.querySelector("#page-initial");
  const comments = document.querySelector("#page-comments");
  const helper = document.querySelector("#page-helper");
  const gear = document.querySelector("#page-gear");
  const barrel = document.querySelector("#page-barrel");
  const repaired = document.querySelector("#page-repaired");
  const overfix = document.querySelector("#page-super-corrupt");
  const checklist = document.querySelector("#page-checklist");
  const lockContext = document.querySelector("#page-lock-context");
  const lockFrame = document.querySelector("#page-lock-frame");
  const lockWordsScore = document.querySelector("#page-lock-words-score");
  const secured = document.querySelector("#page-secured");
  needs(initial, ["LEGENDARY FISH! ONE OF A KIND!", "#SoloLegend", "#OneOfAKind", "#BareHands", "BIGGEST FISH EVER!!!", "YOU DO EVERYTHING PERFECTLY!!!", "MOST LEGENDARY DAY EVER!!!", "COMMENTS ENHANCED FOR POSITIVITY", "MORE LIKES THAN YOU", "HONESTY METER", "9000%", "MORE FROM THIS ALBUM", "LOOK AT MY FISH"]);
  needs(comments, ["LEGENDARY FISH! ONE OF A KIND!", "ORIGINAL COMMENTS RESTORED", "Write a comment…", "12%", "1 PHOTO"]);
  needs(helper, ["Caught it with help", "I HAD HELP", "8805S%", "2 PHOTOS"]);
  needs(gear, ["Used fishing gear and cleaned up", "LOTS OF GEAR", "AND CLEANUP", "AVOCADO%", "3 PHOTOS"]);
  needs(barrel, ["LEGENDARY FISH! ONE OF A KIND!", "Caught one of the lake's fish", "MORE LIKES THAN YOU", "OTHER FISH", "AT THE LAKE", "3½ FISH%", "4 PHOTOS"]);
  needs(repaired, ["GREAT CATCH AT THE LAKE!", "Caught it with help", "Caught one of the lake's fish", "Used fishing gear and cleaned up", "Write a comment…", "BANANA%"]);
  needs(overfix, ["THE MOST AWESOME FISH PHOTO EVER!", "AUTO ENHANCED", "∞ reactions", "AUTO PRAISE ONLY", "AUTO AWESOMENESS METER", "∞ AWESOME", "∞ PERFECT MOMENTS"]);
  needs(checklist, ["LOCK IN THE REPAIR", "RESTORE COMMENTS + ALBUM PHOTOS", "RESTORE THE ORIGINAL PHOTO", "KEEP WORDS ACCURATE + REMOVE SCORE"]);
  needs(lockContext, ["The real comments and album are back", "RESTORE COMMENTS + ALBUM PHOTOS"]);
  needs(lockFrame, ["The original photo is restored", "RESTORE THE ORIGINAL PHOTO"]);
  needs(lockWordsScore, ["The words and score are now accurate", "KEEP WORDS ACCURATE + REMOVE SCORE"]);
  needs(secured, ["The whole story is secured", "GREAT CATCH AT THE LAKE!", "¯\\_(ツ)_/¯"]);
  const expectedAlbumCards = new Map([[initial, 1], [comments, 1], [helper, 2], [gear, 3], [barrel, 4], [repaired, 4], [overfix, 4]]);
  for (const [state, count] of expectedAlbumCards) {
    if (state.querySelectorAll("[data-album-card]").length !== count) issues.push(`${state.id} should show ${count} distinct album evidence cards.`);
  }
  for (const state of [checklist, lockContext, lockFrame, lockWordsScore]) {
    if (state.querySelectorAll("[data-lock-overlay='true']").length !== 1) issues.push(`${state.id} must show one lock-in overlay.`);
  }
  for (const state of [overfix, checklist]) {
    const cards = [...state.querySelectorAll("[data-album-card]")];
    if (cards.length !== 4 || cards.some((card) => card.getAttribute("data-album-content") !== "auto-duplicate")) issues.push(`${state.id} must replace all four album pictures with Auto's duplicated enhanced picture.`);
  }
  if ([...lockContext.querySelectorAll("[data-album-card]")].some((card) => card.getAttribute("data-album-content") !== "original")) issues.push("Context repair must restore the four original album pictures.");
  const repairedAlbumHrefs = [...repaired.querySelectorAll("[data-album-card] image")].map((image) => image.getAttribute("href"));
  if (new Set(repairedAlbumHrefs).size !== 4) issues.push("Repaired FacePlace album must contain four distinct evidence images.");
  const autoAlbumHrefs = [...overfix.querySelectorAll("[data-album-card] image")].map((image) => image.getAttribute("href"));
  if (new Set(autoAlbumHrefs).size !== 1) issues.push("Auto over-fix must visibly duplicate the same selected album image four times.");
  const expectedViews = new Map([[initial, "hero"], [comments, "hero"], [helper, "helper"], [gear, "gear"], [barrel, "full"], [repaired, "full"], [overfix, "hero"], [lockContext, "hero"], [lockFrame, "full"], [secured, "full"]]);
  for (const [state, expectedView] of expectedViews) {
    if (state.querySelector("[data-photo-view]")?.getAttribute("data-photo-view") !== expectedView) issues.push(`${state.id} does not use the expected ${expectedView} crop.`);
  }
  if (overfix.querySelector("[data-photo-view]")?.getAttribute("data-photo-enhanced") !== "true") issues.push("Auto over-fix must visibly enhance the selected crop.");
  if (lockFrame.querySelector("[data-photo-view]")?.getAttribute("data-photo-enhanced") !== "false") issues.push("Original-photo repair must remove Auto's enhancement.");
  const phaseOne = [initial, comments, helper, gear, barrel, repaired];
  for (let index = 1; index < phaseOne.length; index += 1) {
    const before = new Map([...phaseOne[index - 1].querySelectorAll("[data-content-key]")].map((element) => [element.getAttribute("data-content-key"), element]));
    for (const current of phaseOne[index].querySelectorAll("[data-content-key]")) {
      const previous = before.get(current.getAttribute("data-content-key"));
      if (!previous || previous.getAttribute("data-content-state") !== current.getAttribute("data-content-state")) continue;
      if (previous.textContent !== current.textContent) issues.push(`${phaseOne[index].id} changed ${current.getAttribute("data-content-state")} copy without repairing it: ${current.getAttribute("data-content-key")}`);
    }
  }
  if (initial.textContent.includes("ONLY POSITIVE COMMENTS ALLOWED")) issues.push("Initial comments must describe positivity enhancement, not imply that negative comments are desirable.");
  for (const state of [initial, comments, helper, gear, barrel]) {
    const reactions = state.querySelector("[data-reactions-state]");
    if (reactions?.getAttribute("data-reactions-state") !== "corrupted" || reactions.textContent !== "MORE LIKES THAN YOU") issues.push(`${state.id} must preserve the same red comparison until the final post repair.`);
    if (getComputedStyle(reactions).fill !== "rgb(197, 37, 30)") issues.push(`${state.id} comparison label is not visibly rendered in canonical corruption red.`);
  }
  if (repaired.querySelector("[data-reactions-copy='facebook-style-thumbs-heart']")?.getAttribute("data-reactions-state") !== "fixed") issues.push("The final first-run repair must replace the comparison with recognizable thumbs-up and heart reaction badges.");
  if ([gear, barrel, repaired].some((state) => /#Effortless|#CleanupStillMissing|ONE OF SEVERAL FISH|I CAUGHT THIS ONE/.test(state.textContent))) issues.push("Superseded Phase 1 copy remains in the sequence.");
  if (secured.querySelector("[data-lock-overlay='true']")) issues.push("Secured FacePlace state must close the lock-in overlay.");
  for (const state of states) {
    const rail = state.querySelector("[data-album-module='true']")?.textContent ?? "";
    if (/AVOCADO|BANANA|HONESTY/.test(rail)) issues.push(`${state.id} repeats the meter joke in the right rail.`);
  }
  const hrefs = states.map((state) => state.querySelector("[data-post-state] image")?.getAttribute("href"));
  if (new Set(hrefs).size !== 1) issues.push("FacePlace anchors do not reuse the same fishing master.");
  return issues;
});
errors.push(...report);
await browser.close();
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("PASS: FacePlace sequence QA — shared shell, five causal first-run repairs, fixed photo viewport, single-master crop continuity, distinct album evidence, duplicated Auto album over-fix, three one-passage lock states, secured state, and text bounds verified.");
