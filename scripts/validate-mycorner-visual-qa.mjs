#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-16/mycorner-production/mycorner-anchor-master-v1.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const errors = [];
const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push("MyCorner does not use the reviewed shared shell.");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(150);
errors.push(...await page.evaluate(() => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const byId = (id) => document.querySelector(`#page-${id}`);
  const needs = (state, values) => values.forEach((value) => { if (!state?.textContent.includes(value)) issues.push(`${state?.id ?? "missing"} missing ${value}`); });
  if (states.length !== 4) issues.push(`Expected four MyCorner anchors; found ${states.length}.`);
  needs(byId("initial"), ["DefinitelyAmy_Official_Real", "IDENTITY NOT VERIFIED", "Joined 6 minutes ago", "PAPER PHOTO + POPSICLE STICK", "URGENT MONEY REQUEST"]);
  needs(byId("repaired"), ["KNOWN PROFILE · VERIFIED ANOTHER WAY", "KNOWN FAMILY CHAT", "Identity not verified · blocked", "NO URGENT MONEY REQUEST"]);
  needs(byId("auto-overfix"), ["AI VERIFIED 9000%", "AI UPSCALED TO 4K", "Verification photos: 17", "ALL GENERATED FROM THE SAME PHOTO"]);
  needs(byId("lock-repair"), ["PHOTO IS NOT IDENTITY", "CHECK THE TIMELINE", "VERIFY ANOTHER WAY", "DO NOT SEND MONEY"]);
  for (const state of states) {
    if (state.querySelectorAll("[data-profile-card='true']").length !== 1) issues.push(`${state.id} needs one fixed profile card.`);
    if (state.querySelectorAll("[data-profile-rail='true']").length !== 1) issues.push(`${state.id} needs one fixed profile rail.`);
    if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id} exposes internal Act/Phase language.`);
    for (const element of state.querySelectorAll("[data-qa-box]")) {
      const bounds = element.getAttribute("data-qa-box").split(",").map(Number);
      const actual = element.getBBox();
      if (actual.x < bounds[0] - 1.5 || actual.y < bounds[1] - 1.5 || actual.x + actual.width > bounds[2] + 1.5 || actual.y + actual.height > bounds[3] + 1.5) issues.push(`${state.id} overflow: ${element.textContent.trim().slice(0, 48)}`);
    }
  }
  if (byId("initial").querySelector("[data-lock-overlay]")) issues.push("Initial profile must not show the checklist.");
  if (byId("auto-overfix").querySelector("[data-lock-overlay]")) issues.push("Auto over-fix must be reviewable before the checklist appears.");
  if (byId("lock-repair").querySelectorAll("[data-lock-overlay='true']").length !== 1) issues.push("Lock state needs one checklist.");
  return issues;
}));
await browser.close();
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); process.exit(1); }
console.log("PASS: MyCorner anchor QA — shared shell, fixed profile geometry, paper-mask impersonation, known-route repair, explicit Auto polish over-fix, four-item checklist, and text bounds verified.");
