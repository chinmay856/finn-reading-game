#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2]);
if (!process.argv[2]) throw new Error("Usage: validate-search-map-visual-qa.mjs <master.svg>");
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg"), "utf8");
const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
const errors = [];
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push("Shared shell hash mismatch.");
const site = source.match(/data-site="([^"]+)"/)?.[1];
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(120);
errors.push(...await page.evaluate((siteName) => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const byId = (id) => document.querySelector(`#page-${id}`);
  const initial = byId("initial"), repaired = byId("repaired"), auto = byId("auto-overfix"), lock = byId("lock-repair");
  if (states.length !== 4) issues.push(`Expected four states; found ${states.length}.`);
  const need = (state, words) => words.forEach((word) => { if (!state?.textContent.includes(word)) issues.push(`${state?.id ?? "missing"} missing ${word}`); });
  if (siteName === "searchish") {
    need(initial, ["YOU DON'T NEED THE BOOK", "INTERNET MEGA BOOKSTORE", "San Francisco Public Library"]);
    need(repaired, ["ASK AI · OPTIONAL", "SPONSORED", "Neighborhood Books"]);
    need(auto, ["WHO NEEDS A BOOK", "USEFUL RESULTS MINIMIZED"]);
    need(lock, ["MAKE AI HELP OPTIONAL", "LABEL THE AD", "SHOW USEFUL RESULTS", "LET FINN CHOOSE"]);
  } else if (siteName === "mapguess") {
    need(initial, ["LIBRARY?", "SUGGESTED ON YOUR WAY", "SPONSORED DETOUR"]);
    need(repaired, ["SAN FRANCISCO PUBLIC LIBRARY", "DIRECT ROUTE · 5 MIN", "SPONSORED · OPTIONAL"]);
    need(auto, ["DESTINATION OPTIMIZED · NOTHING CHANGED", "LIBRARY (MOVED TO SNACK PALACE)"]);
    need(lock, ["KEEP FINN'S DESTINATION", "RESTORE THE DIRECT ROUTE", "SHOW MAP + SPONSOR LABELS"]);
  } else issues.push(`Unknown site ${siteName}.`);
  for (const state of states) {
    if (state.textContent.match(/\b(?:ACT|PHASE)\s*[12]\b/i)) issues.push(`${state.id} exposes internal production language.`);
    if (state.querySelectorAll("[data-site-meter='true']").length !== 1) issues.push(`${state.id} needs one site meter.`);
    for (const element of state.querySelectorAll("[data-qa-box]")) {
      const b = element.getAttribute("data-qa-box").split(",").map(Number), a = element.getBBox();
      if (a.x < b[0] - 2 || a.y < b[1] - 2 || a.x + a.width > b[2] + 2 || a.y + a.height > b[3] + 2) issues.push(`${state.id} overflow: ${element.textContent.trim().slice(0, 50)}`);
    }
  }
  if (initial.querySelector("[data-lock-overlay]") || repaired.querySelector("[data-lock-overlay]") || auto.querySelector("[data-lock-overlay]")) issues.push("Checklist appeared before the checklist frame.");
  if (lock.querySelectorAll("[data-lock-overlay='true']").length !== 1) issues.push("Checklist frame needs one overlay.");
  return issues;
}, site));
await browser.close();
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); process.exit(1); }
console.log(`PASS: ${site} anchor QA — shared shell, four fixed states, explicit Auto over-fix, green repair checklist, clean player language, and text bounds verified.`);
