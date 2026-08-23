#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-15/amaze-on-production/amaze-on-anchor-master-v1.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const errors = [];
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push("Amaze-On was not generated from the current reviewed shared shell.");
if (COLORS.corruption !== "#C5251E" || COLORS.repair !== "#2F8A49") errors.push("Canonical semantic colors changed.");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(200);
const report = await page.evaluate(() => {
  const issues = [];
  const red = "rgb(197, 37, 30)";
  const states = [...document.querySelectorAll("g[id^='page-']")];
  if (states.length !== 15) issues.push(`Expected fifteen sequence states; found ${states.length}.`);
  const needs = (state, values) => values.forEach((value) => { if (!state?.textContent.includes(value)) issues.push(`${state?.id} missing ${value}`); });
  for (const state of states) {
    if (state.getAttribute("data-site-progress-label") !== "SHOPPING CONTROL") issues.push(`${state.id} has the wrong progress label.`);
    if (state.querySelectorAll("[data-product-card='true']").length !== 4) issues.push(`${state.id} does not preserve four product slots.`);
    if (state.querySelectorAll("[data-sort-control='true']").length !== 1) issues.push(`${state.id} must contain exactly one Sort by control.`);
    for (const image of state.querySelectorAll("[data-product-card='true'] image")) {
      if (image.getAttribute("width") !== "130" || image.getAttribute("height") !== "154" || image.getAttribute("preserveAspectRatio") !== "xMidYMid slice") issues.push(`${state.id} has a product image outside the normalized crop contract.`);
    }
    for (const element of state.querySelectorAll("[data-content-state='corrupted']")) {
      if (getComputedStyle(element).fill !== red) issues.push(`${state.id} unresolved content is not red: ${element.textContent.trim()}`);
    }
    for (const element of state.querySelectorAll("[data-qa-box]")) {
      const box = element.getAttribute("data-qa-box").split(",").map(Number);
      const actual = element.getBBox();
      if (actual.x < box[0] - 1.5 || actual.y < box[1] - 1.5 || actual.x + actual.width > box[2] + 1.5 || actual.y + actual.height > box[3] + 1.5) issues.push(`${state.id} overflow: ${element.textContent.trim().slice(0, 42)}`);
    }
  }

  const byId = (id) => document.querySelector(`#page-${id}`);
  const initial = byId("initial");
  const repaired = byId("repaired");
  const overfix = byId("super-corrupt");
  needs(initial, ["WHO PAYS US", "SPONSOR ONLY", "FIT HIDDEN", "Cart (0)", "#1 · PAID PLACEMENT", "#2 · ALSO PAID PLACEMENT", "#3 · YOU GUESSED IT — PAID AGAIN", "#4 · CHEAPEST — ALSO PAID"]);
  needs(byId("size"), ["FINN'S SIZE", "WHO PAYS US"]);
  needs(byId("budget-brand"), ["ANY BRAND", "UNDER $90", "WHO PAYS US"]);
  needs(byId("reviews"), ["ALL RATINGS", "dates + reviewer history", "WHO PAYS US"]);
  needs(byId("delivery"), ["GROUP DELIVERY", "fewer trips + boxes", "WHO PAYS US"]);
  needs(byId("details"), ["durability unclear", "replacement waste shown", "WHO PAYS US"]);
  needs(repaired, ["MATCH FINN'S NEED", "ALL RATINGS", "NOTHING SELECTED", "Cart (0)", "#1 · BEST MATCH", "#2 · GREAT VALUE", "SPONSORED AD — PAID"]);
  for (const id of ["initial", "size", "budget-brand", "reviews", "delivery", "details"]) {
    const text = byId(id)?.textContent ?? "";
    if (text.includes("Field Classic") || text.includes("Swift Step")) issues.push(`${id} performs the dominant re-ranking before the final initial-repair step.`);
    if (!text.includes("1–4 OF 9,000 RESULTS — PAID RESULTS FIRST")) issues.push(`${id} changes the red ranking diagnostic before the ranking is fixed.`);
    if (!text.includes("RANKING DISTORTED")) issues.push(`${id} changes the red footer diagnostic before the ranking is fixed.`);
    if (!text.includes("Sort by:") || !text.includes("DISABLED")) issues.push(`${id} must keep the Sort by control disabled until ranking repair.`);
  }
  needs(repaired, ["Sort by:", "BEST MATCH"]);

  needs(overfix, ["AUTO-BUY COMPLETE", "AUTO ALREADY CHOSE FOR FINN", "AUTO-CART (4)", "BUYING NOW", "#1 · PAID AUTO-PICK", "AUTO-CART — BUY NOW COMPLETE", "3 × GOALAZO MEGA-BOOT", "ADDED TO CART · SHIPPING NOW", "SPONSORS SAID THEIR SHOES WERE BEST", "THEIR CLAIMS WERE LOUD AND VERY CONFIDENT", "FINN'S CONFIRMATION: SKIPPED FOR EFFICIENCY", "AUTO-BUY OVERRIDE ACTIVE"]);
  needs(overfix, ["Sort by:", "AUTO KNOWS BEST"]);
  if ([...overfix.querySelectorAll("[data-product-card='true']")].filter((card) => card.textContent.includes("Goalazo Mega-Boot")).length !== 3) issues.push("Auto-buy over-fix must keep three Goalazo cards and one cheapest card.");
  if (overfix?.querySelectorAll("[data-overlay='auto-cart']").length !== 1) issues.push("Auto-buy over-fix must contain exactly one prominent cart confirmation overlay.");
  if (states.reduce((count, state) => count + state.querySelectorAll("[data-overlay='auto-cart']").length, 0) !== 1) issues.push("The Auto-cart overlay must appear only on the over-fix screen.");

  const lockIds = ["locks", "sponsor-lock", "reviews-lock", "needs-lock", "delivery-lock", "permission-lock"];
  lockIds.forEach((id, checked) => {
    const state = byId(id);
    if (state?.querySelectorAll("[data-overlay='repair-checklist']").length !== 1) issues.push(`${id} must contain one repair checklist.`);
    if (state?.querySelectorAll("[data-check-state='fixed']").length !== checked) issues.push(`${id} should have ${checked} secured checklist items.`);
  });
  needs(byId("locks"), ["SHOW PAID PLACEMENT", "SHOW REAL REVIEWS", "SHOW ALL CHOICES", "SHOW DELIVERY + WASTE", "ASK BEFORE BUYING"]);
  needs(byId("sponsor-lock"), ["SPONSORED AD — PAID"]);
  needs(byId("reviews-lock"), ["2.6 ★ · mixed", "1.2 ★ · negative"]);
  needs(byId("needs-lock"), ["FINN'S SIZE", "durable materials", "#1 · BEST MATCH", "#2 · GREAT VALUE", "AUTO-CART (4)", "BUYING NOW", "SORT RESTORED"]);
  needs(byId("delivery-lock"), ["GROUP DELIVERY", "fewer trips + boxes", "replacement waste", "AUTO-CART (4)", "BUYING NOW", "SORT RESTORED"]);
  needs(byId("permission-lock"), ["Cart (0)", "#1 · BEST MATCH", "#2 · GREAT VALUE", "NOTHING SELECTED"]);
  if ((byId("needs-lock")?.textContent ?? "").includes("CHANGES LOCKED") || (byId("delivery-lock")?.textContent ?? "").includes("CHANGES LOCKED")) issues.push("The sorting lock remains red after SHOW ALL CHOICES is secured.");
  if ((byId("permission-lock")?.textContent ?? "").includes("AUTO-CART (4)") || (byId("permission-lock")?.textContent ?? "").includes("BUYING NOW")) issues.push("The Auto-buy badge remains after ASK BEFORE BUYING is secured.");
  if (byId("secured")?.querySelector("[data-overlay='repair-checklist']")) issues.push("Secured state must remove the repair overlay.");

  if ((repaired?.innerHTML ?? "").includes("#C5251E")) issues.push("Repaired state retains corruption red; truthful negative product facts must use neutral storefront color.");
  if ((repaired?.textContent.match(/Goalazo Mega-Boot/g) ?? []).length !== 1) issues.push("Repaired state must show the sponsored Goalazo result once.");
  if ((initial?.textContent.match(/Goalazo Mega-Boot/g) ?? []).length !== 3) issues.push("Initial state must repeat the sponsored Goalazo result three times.");
  if ((repaired?.textContent.match(/SPONSORED AD — PAID/g) ?? []).length !== 2) issues.push("Both distorted products must remain visibly labeled as paid sponsored ads in the repaired ranking.");
  return issues;
});
errors.push(...report);
await browser.close();
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("PASS: Amaze-On sequence QA — shared shell, fifteen-state continuity, semantic colors, repair pacing, ranking transition, Auto-buy over-fix, five lock-ins, and text bounds verified.");
