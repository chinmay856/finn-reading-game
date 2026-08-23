#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const masterPath = path.resolve("docs/design/screens/2026-08-17/viewtube-production/viewtube-anchor-master-v2.svg");
const outputDirectory = path.dirname(masterPath);
const source = fs.readFileSync(masterPath, "utf8");
const errors = [];

for (const forbidden of ["MORE FROM FINN'S INTERESTS", "Chosen from Finn's interests", "WHY NEXT: HIDDEN", "SUGGESTIONS LABELED", "AD BREAKS REVEALED"]) {
  if (source.includes(forbidden)) errors.push(`Obsolete duplicated queue copy remains in rendered SVG: ${forbidden}`);
}

for (let index = 1; index <= 14; index += 1) {
  const png = path.join(outputDirectory, `viewtube-anchor-v2_p${index}.png`);
  if (!fs.existsSync(png)) errors.push(`Missing exported frame ${index}.`);
}

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(masterPath).href);
await page.waitForTimeout(200);

errors.push(...await page.evaluate(() => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const byId = (id) => document.getElementById(`page-${id}`);
  if (states.length !== 14) issues.push(`Expected 14 states, found ${states.length}.`);

  for (const state of states) {
    const queue = state.querySelector("[data-video-queue='true']");
    const rows = [...state.querySelectorAll("[data-queue-row]")];
    if (queue?.getAttribute("data-queue-count") !== "3" || rows.length !== 3) {
      issues.push(`${state.id}: right rail must contain exactly three video cards.`);
    }
    for (const title of state.querySelectorAll(".vt-card-title")) {
      if (title.getBBox().width > 219) issues.push(`${state.id}: queue title overflows its 219px safe width: ${title.textContent}`);
    }
    for (const status of state.querySelectorAll(".vt-queue-status")) {
      if (status.getBBox().width > 222) issues.push(`${state.id}: queue status overflows: ${status.textContent}`);
    }
    for (const text of state.querySelectorAll(".vt-description,.vt-description-strong,.vt-comment")) {
      if (text.getBBox().width > 480) issues.push(`${state.id}: player copy overflows its 480px safe width: ${text.textContent}`);
    }
    for (const text of state.querySelectorAll(".lock-label")) {
      if (text.getBBox().width > 385) issues.push(`${state.id}: checklist label overflows: ${text.textContent}`);
    }
    if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id}: exposes internal Act/Phase language.`);
  }

  const fixed = byId("repaired");
  const auto = byId("auto-overfix");
  const lockAds = byId("lock-ads");
  const initial = byId("initial");
  const ads = byId("ads");
  const details = byId("details");
  const autoplay = byId("autoplay");
  const lockDetails = byId("lock-details");
  const lockAutoplay = byId("lock-autoplay");
  const usesAsset = (root, selector, assetId) => [...(root?.querySelectorAll(selector) ?? [])].filter((node) => node.getAttribute("href") === assetId);
  if (usesAsset(fixed, "[data-queue-row='1'] use", "#vt-asset-tacoStunt").length === 0) issues.push("Repaired rail does not use the approved Taco Flip art.");
  if (usesAsset(auto, "[data-queue-row] use", "#vt-asset-autoShow").length !== 3) issues.push("Auto queue must repeat the same Auto Show thumbnail three times.");
  if (usesAsset(auto, "[data-video-player] use", "#vt-asset-autoShow").length === 0) issues.push("Auto main player does not use the dedicated Auto Show thumbnail.");
  if (initial?.querySelector("[data-video-player]")?.getAttribute("data-ad-break-count") !== "7") issues.push("Initial corruption must declare seven ad breaks.");
  if (initial?.querySelectorAll(".vt-ad").length !== 7) issues.push("Initial corruption must visibly label seven AD markers.");
  if (initial?.querySelector("[data-persistent-ads]")?.getAttribute("data-persistent-ads") !== "1") issues.push("Initial corruption must include one persistent popup ad.");
  if (initial?.querySelector("[data-persistent-ads]")?.getAttribute("data-popup-placement") !== "main-video") issues.push("Initial popup ad must overlay the main video, not the queue.");
  if (ads?.querySelector("[data-video-player]")?.getAttribute("data-ad-break-count") !== "1" || ads?.querySelectorAll(".vt-ad").length !== 1) issues.push("Excessive-ads repair must leave exactly one labeled ad break.");
  if (ads?.querySelector("[data-persistent-ads]")) issues.push("Persistent popup ad remains after excessive-ads repair.");
  if (!details?.textContent.includes("4.2M views · promoted today") || !details?.textContent.includes("PixelPilot:")) issues.push("Views-and-comments repair has no visible metadata payoff.");
  if (!autoplay?.textContent.includes("AUTOPLAY OFF") || !autoplay?.textContent.includes("MORE VIDEOS")) issues.push("Autoplay repair has no visible off-state or de-emphasized rail payoff.");
  if (autoplay?.querySelectorAll("[data-queue-media-mark]").length !== 3 || fixed?.querySelectorAll("[data-queue-media-mark]").length !== 3) issues.push("Autoplay and repaired rails must show three explicit play controls.");
  if (auto?.querySelector("[data-video-player]")?.getAttribute("data-ad-break-count") !== "infinity") issues.push("Auto over-fix must declare infinite ad breaks.");
  if (auto?.querySelectorAll(".vt-ad").length !== 12) issues.push("Auto over-fix must visibly use twelve representative AD markers.");
  if (auto?.querySelector("[data-persistent-ads]")?.getAttribute("data-persistent-ads") !== "4") issues.push("Auto over-fix must include four persistent popup ads.");
  for (const popup of [...initial.querySelectorAll("[data-popup-ad]"), ...auto.querySelectorAll("[data-popup-ad]")]) {
    if (popup.getAttribute("data-popup-label") !== "AD" || popup.textContent.trim() !== "AD") issues.push("Popup ads must communicate visually with the single label AD.");
  }
  if (auto?.textContent.includes("AUTO SHOW NETWORK") || !auto?.textContent.includes("AUTO SHOW") || !auto?.textContent.includes("BLUETOOTH ENABLED")) issues.push("Auto channel identity must use the short AUTO SHOW / BLUETOOTH ENABLED treatment.");
  if (!auto?.textContent.includes("∞ AD BREAKS · ∞ POP-UP ADS")) issues.push("Auto over-fix must show infinite ad breaks and popup ads in its visible metadata.");
  if (lockAds?.querySelector("[data-video-player]")?.getAttribute("data-ad-break-count") !== "1" || lockAds?.querySelectorAll(".vt-ad").length !== 1) issues.push("Remove-excessive-ads lock must leave one labeled ad break.");
  if (lockAds?.querySelector("[data-persistent-ads]")) issues.push("Auto popup ads remain after remove-excessive-ads lock.");
  if (!lockDetails?.textContent.includes("4.2M views · promoted today") || !lockDetails?.textContent.includes("PixelPilot:")) issues.push("Restore-views-and-comments lock has no visible metadata payoff.");
  if (lockDetails?.textContent.includes("AUTO-COMMENTS")) issues.push("Auto-comment heading remains after restore-views-and-comments lock.");
  if (!lockAutoplay?.textContent.includes("AUTOPLAY OFF") || !lockAutoplay?.textContent.includes("MORE VIDEOS")) issues.push("Autoplay lock has no visible off-state payoff.");
  return issues;
}));

await browser.close();

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log("PASS: ViewTube v2 — 14 states, three-card rails, main-video AD overlay, infinite Auto ad escalation, restored views/comments, visible autoplay/choice payoffs, and text safe widths verified.");
