#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const shell = fs.readFileSync(shellPath, "utf8");
const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");

const contracts = {
  Yahuh: {
    file: "docs/design/screens/2026-08-16/yahuh-production/yahuh-anchor-master-v1.svg",
    domain: "www.yahuh.com",
    modules: ["[data-lead-story='true']", "[data-secondary-stories='true']"],
    initial: ["MOON RESIGNS", "ARTICLE DETAILS HIDDEN", "CHOPPED QUOTE", "HEADLINE REPAIR"],
    repaired: ["NEW MOON", "SHIP WITH SOUP", "PIGEON MASCOT", "FUNDRAISER VOTE", "CORRECTION POSTED", "CLEARLY LABELED"],
    overfix: ["MAXIMIZING CLICKS PER EXCLAMATION MARK", "ARTICLE REMOVED", "PROMOTION DISGUISED"],
    checklist: ["READ THE STORY", "SHOW WHAT SUPPORTS IT", "KEEP THE CONTEXT", "SHOW WHAT CHANGED"],
  },
  ViewTube: {
    file: "docs/design/screens/2026-08-16/viewtube-production/viewtube-anchor-master-v1.svg",
    domain: "www.viewtube.com",
    modules: ["[data-video-player='true']", "[data-video-queue='true']"],
    initial: ["SEARCH UNAVAILABLE", "THE VIDEO WITH THE MOST ADS", "AUTOPLAY LOCKED ON", "VIEWER CONTROL"],
    repaired: ["stop-motion rocket tutorial", "SELECTED BY FINN", "AUTOPLAY OFF", "FINN CHOOSES WHAT PLAYS"],
    overfix: ["OPTIMIZING FOR THE MOST ADS", "AUTOPLAYING PARTS 1–47", "SEARCH INTENT REMOVED", "AN AD INSIDE AN AD"],
    checklist: ["SEARCH WORKS", "SHOW WHY THIS IS NEXT", "ASK BEFORE PLAYING", "SELECTED BY FINN"],
  },
};

const requested = process.argv[2];
const chosen = requested ? [[requested, contracts[requested]]] : Object.entries(contracts);
const errors = [];
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });

for (const [site, contract] of chosen) {
  if (!contract) {
    errors.push(`Unknown site contract: ${site}`);
    continue;
  }
  const svgPath = path.resolve(contract.file);
  const source = fs.readFileSync(svgPath, "utf8");
  if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push(`${site}: shared shell hash mismatch.`);
  if (!source.includes(contract.domain)) errors.push(`${site}: clean domain missing.`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(pathToFileURL(svgPath).href);
  await page.waitForTimeout(150);
  errors.push(...await page.evaluate(({ site, contract }) => {
    const issues = [];
    const states = [...document.querySelectorAll("g[id^='page-']")];
    const state = (id) => document.querySelector(`#page-${id}`);
    const initial = state("initial"), repaired = state("repaired"), overfix = state("auto-overfix"), checklist = state("lock-repair");
    if (states.length !== 4) issues.push(`${site}: expected four states, found ${states.length}.`);
    const needs = (node, values) => values.forEach((value) => { if (!node?.textContent.includes(value)) issues.push(`${site}/${node?.id ?? "missing"}: missing ${value}`); });
    needs(initial, contract.initial); needs(repaired, contract.repaired); needs(overfix, contract.overfix); needs(checklist, contract.checklist);
    for (const node of states) {
      if (node.textContent.match(/\b(?:ACT|PHASE)\s*[12]\b/i)) issues.push(`${site}/${node.id}: exposes internal Act/Phase language.`);
      for (const selector of contract.modules) if (node.querySelectorAll(selector).length !== 1) issues.push(`${site}/${node.id}: needs one ${selector} module.`);
      const progress = node.querySelector("[data-role='site-progress-fill']");
      if (!progress) issues.push(`${site}/${node.id}: site progress missing.`);
      if (node.querySelectorAll("use[href='#sharedShell']").length !== 1) issues.push(`${site}/${node.id}: shared shell not reused exactly once.`);
    }
    if (initial?.querySelector("[data-lock-overlay]") || repaired?.querySelector("[data-lock-overlay]") || overfix?.querySelector("[data-lock-overlay]")) issues.push(`${site}: checklist appeared before its review frame.`);
    if (checklist?.querySelectorAll("[data-lock-overlay='true']").length !== 1) issues.push(`${site}: checklist frame needs one green overlay.`);
    return issues;
  }, { site, contract }));
  await page.close();
}

await browser.close();
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log(`PASS: ${chosen.map(([site]) => site).join(" and ")} anchor QA — shared shell, fixed geometry, required story states, explicit Auto over-fix, checklist isolation, clean domains, progress separation, and player-facing language verified.`);
