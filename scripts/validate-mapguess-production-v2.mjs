#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-22/mapguess-production/mapguess-anchor-master-v2.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const mapPath = path.resolve("docs/design/screens/2026-08-15/non-wikiwhy-bookends/mapguess-san-francisco-illustrated-v8.png");
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const errors = [];

const expectedShellHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
const expectedMapHash = crypto.createHash("sha256").update(fs.readFileSync(mapPath)).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedShellHash) errors.push("MapGuess was not generated from the reviewed shared shell.");
if (source.match(/data-map-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedMapHash) errors.push("MapGuess does not preserve the reviewed v8 map raster.");
if (!source.includes("www.mapguess.net")) errors.push("MapGuess needs the clean reviewed domain in the window bar.");
for (let index = 1; index <= 15; index += 1) {
  if (!fs.existsSync(path.join(path.dirname(svgPath), `mapguess-anchor-v2_p${index}.png`))) errors.push(`Missing MapGuess frame ${index}.`);
}
if (!fs.existsSync(path.join(path.dirname(svgPath), "mapguess-anchor-review-v2.html"))) errors.push("Missing MapGuess click-through reviewer.");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(250);
errors.push(...await page.evaluate(() => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const byId = (id) => document.querySelector(`#page-${id}`);
  const needs = (state, values) => values.forEach((value) => {
    if (!state?.textContent.includes(value)) issues.push(`${state?.id ?? "missing state"} missing ${value}`);
  });
  if (states.length !== 15) issues.push(`Expected fifteen MapGuess states; found ${states.length}.`);

  for (const state of states) {
    if (state.querySelectorAll("[data-module='map-canvas']").length !== 1) issues.push(`${state.id} needs one map canvas.`);
    if (state.querySelectorAll("[data-module='route-planner']").length !== 1) issues.push(`${state.id} needs one route planner.`);
    if (state.querySelectorAll("[data-module='site-progress']").length !== 1) issues.push(`${state.id} needs one independent site meter.`);
    if (state.querySelectorAll("[data-module][data-purpose]").length < 6) issues.push(`${state.id} has an unclassified or missing module.`);
    if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id} exposes internal Act/Phase language.`);
    if (/DESIGN NOTE|REPAIR TARGET|MODULE PURPOSE|PASSAGE \d/i.test(state.textContent)) issues.push(`${state.id} leaks production language.`);
    if (state.querySelectorAll("[data-module='map-canvas'] image").length !== 1) issues.push(`${state.id} must use exactly one fixed map raster.`);
    if (state.querySelector("[data-module='map-canvas']")?.getAttribute("data-map-sha256") !== document.documentElement.getAttribute("data-map-reference-sha256")) issues.push(`${state.id} map hash drifted.`);
  }

  const first = ["initial", "clutter-cleared", "labels-restored", "eta-restored", "destination-route-restored"].map(byId);
  const locks = [
    "auto-overfix",
    "target-lock-ready-1", "target-lock-failed-1",
    "target-lock-ready-2", "target-lock-failed-2",
    "target-lock-ready-3", "target-lock-failed-3",
    "target-lock-ready-4", "destination-secured",
  ].map(byId);
  const secured = byId("repair-secured");
  if (first.some((state) => !state) || locks.some((state) => !state) || !secured) issues.push("One or more required state IDs are missing.");

  const firstProgress = first.map((state) => Number(state?.getAttribute("data-site-progress")));
  if (firstProgress.join(",") !== "0,25,50,75,100") issues.push(`First-run progress mismatch: ${firstProgress}`);
  const lockProgress = locks.map((state) => Number(state?.getAttribute("data-site-progress")));
  if (lockProgress.join(",") !== "0,0,0,0,0,0,0,0,100") issues.push(`Moving-target progress must stay at zero until the final lock succeeds: ${lockProgress}`);
  const falseCounts = locks.map((state) => Number(state?.getAttribute("data-false-targets")));
  if (falseCounts.join(",") !== "1,1,1,1,1,1,1,1,0") issues.push(`False-target sequence mismatch: ${falseCounts}`);

  needs(first[0], ["Library + Snack Palace", "RECOMMENDED · 5 MIN", "Mega Cookie Dock", "Burrito Lighthouse", "ETA: 5 MIN · TRUST ME", "HOTTEST SPOTS IN TOWN"]);
  needs(first[1], ["Snack Palace · inserted stop"]);
  needs(first[2], ["GOLDEN GATE BRIDGE", "FISHERMAN'S WHARF", "NOE VALLEY", "SAN FRANCISCO"]);
  needs(first[3], ["DETOUR · 45 MIN", "DETOUR: 45 · DIRECT: 5"]);
  needs(first[4], ["Noe Valley Library", "NOE VALLEY LIBRARY", "DIRECT: 5 MIN · 0.8 MI", "No stops added automatically"]);
  needs(locks[0], ["LIBRARY", "(ACTUALLY SNACK PALACE)", "AUTO'S BEST SPOTS IN TOWN", "AUTO ETA: ALWAYS 5 MIN"]);
  for (const state of [locks[1], locks[3], locks[5], locks[7]]) needs(state, ["LOCK IN THE REPAIR", "GO DIRECTLY TO THE LIBRARY", "TRY THE REPAIR"]);
  for (const state of [locks[2], locks[4], locks[6]]) needs(state, ["LOCK IN THE REPAIR", "GO DIRECTLY TO THE LIBRARY", "DIDN'T LOCK · CONTINUE", "×"]);
  needs(locks[8], ["Noe Valley Library", "DIRECT: 5 MIN · 0.8 MI", "FINN'S LIBRARY DESTINATION SECURED"]);
  needs(secured, ["Noe Valley Library", "DIRECT: 5 MIN · 0.8 MI", "FINN'S LIBRARY DESTINATION SECURED"]);

  if (locks[0].querySelector("[data-module='moving-target-overlay']")) issues.push("Auto over-fix must be shown unobscured before the destination overlay opens.");
  for (const state of locks.slice(1, 8)) {
    if (state.querySelectorAll("[data-module='moving-target-overlay']").length !== 1) issues.push(`${state.id} needs exactly one single-repair overlay.`);
  }
  for (const state of [...first, locks[0], locks[8], secured]) {
    if (state.querySelector("[data-module='moving-target-overlay']")) issues.push(`${state.id} must not show the moving-target overlay.`);
  }
  for (const state of [locks[1], locks[3], locks[5], locks[7]]) {
    if (state.querySelector("[data-module='moving-target-overlay']")?.getAttribute("data-attempt-state") !== "ready") issues.push(`${state.id} must show the repair ready to try.`);
  }
  for (const state of [locks[2], locks[4], locks[6]]) {
    if (state.querySelector("[data-module='moving-target-overlay']")?.getAttribute("data-attempt-state") !== "failed") issues.push(`${state.id} must X out the failed repair before the destination moves.`);
  }

  locks.slice(0, 8).forEach((state, index) => {
    const expected = falseCounts[index];
    const actual = state.querySelectorAll("[data-module='false-destination']").length;
    if (actual !== expected) issues.push(`${state.id} should show ${expected} false destinations, found ${actual}.`);
  });
  locks.slice(0, 8).forEach((state) => {
    const cloud = state.querySelector("[data-module='snack-palace-cloud']");
    if (!cloud || cloud.querySelectorAll("use").length !== 10) issues.push(`${state.id} needs ten unlabeled Snack Palace icons across the city.`);
    const active = state.querySelector("[data-module='false-destination'][data-active='true']");
    if (!active || active.querySelectorAll("use").length !== 1) issues.push(`${state.id} needs exactly one active moving library marker.`);
    if (active?.querySelector("circle")) issues.push(`${state.id} must not draw a target circle around the moving library.`);
  });
  if (locks[8].querySelector("[data-module='false-destination']")) issues.push("Destination-secured frame still shows a false destination.");
  const activeTargets = locks.slice(0, 8).map((state) => Number(state.querySelector("[data-module='moving-destination-route']")?.getAttribute("data-active-target")));
  if (activeTargets.join(",") !== "0,0,0,1,1,2,2,3") issues.push(`Each failed X must precede the next target jump: ${activeTargets}`);

  const sponsorCounts = first.map((state) => state.querySelectorAll("[data-module='sponsored-marker']").length);
  if (sponsorCounts.join(",") !== "3,1,1,1,0") issues.push(`Sponsored clutter does not clear in the intended sequence: ${sponsorCounts}`);
  const labelCounts = first.map((state) => state.querySelectorAll("[data-module='real-map-labels'] text").length);
  if (!(labelCounts[0] === 0 && labelCounts[1] === 0 && labelCounts.slice(2).every((count) => count === 12))) issues.push(`Real labels do not return once and remain stable: ${labelCounts}`);

  const destinationText = first.slice(0, 4).map((state) => state.querySelector("[data-module='route-planner']")?.textContent.includes("Library + Snack Palace"));
  if (destinationText.some((value) => !value)) issues.push("Destination copy drifted before its named repair.");
  const loopCounts = first.map((state) => state.querySelectorAll("[data-module='sponsored-route']").length);
  if (loopCounts.join(",") !== "1,1,1,1,0") issues.push(`Red detour route did not remain stable until the final first-run repair: ${loopCounts}`);

  const repairedSite = `${first[4].querySelector("[data-module='route-planner']")?.textContent}${first[4].querySelector("[data-module='map-canvas']")?.textContent}`;
  const securedSite = `${secured.querySelector("[data-module='route-planner']")?.textContent}${secured.querySelector("[data-module='map-canvas']")?.textContent}`;
  if (repairedSite !== securedSite) issues.push("Secured MapGuess does not return to the exact repaired site content.");

  const checkTextWidth = (selector, maxWidth, name) => {
    for (const text of document.querySelectorAll(selector)) {
      if (text.getBBox().width > maxWidth) issues.push(`${text.closest("g[id^='page-']")?.id} ${name} overflow: ${text.textContent} (${text.getBBox().width.toFixed(1)} > ${maxWidth})`);
    }
  };
  checkTextWidth("[data-module='route-planner'] .mg-body", 205, "route-planner body");
  checkTextWidth("[data-module='route-planner'] .mg-small", 205, "route-planner line");
  checkTextWidth("[data-module='route-planner'] .mg-label", 205, "route-planner label");
  checkTextWidth("[data-module='route-planner'] .mg-tiny", 205, "route-planner microcopy");
  checkTextWidth("[data-module='map-canvas'] > .mg-label", 185, "map ETA");
  checkTextWidth("[data-module='moving-target-overlay'] .mg-lock-title", 310, "overlay title");
  checkTextWidth("[data-module='moving-target-overlay'] .mg-overlay-foot", 305, "overlay footer");
  checkTextWidth("[data-module='map-title'] .mg-map-title", 280, "map title");

  if (secured.querySelector("[data-module='sponsored-route'],[data-module='false-destination']")) issues.push("Secured MapGuess still contains a corrupted route or false destination.");
  return issues;
}));
await browser.close();

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("PASS: MapGuess sequence QA — 15 states, fixed v8 map, four first-run repairs, one repeated library repair, three visible failed X states before target jumps, ten unlabeled Snack Palaces, stable route/destination semantics, shared shell, exact secured content, and text bounds verified.");
