#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);
const svgPath = path.resolve(
  process.argv[2] ??
    "docs/design/screens/2026-08-16/searchish-production/searchish-story-review-master-v2.svg",
);
const errors = [];
const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(150);
errors.push(
  ...(await page.evaluate(() => {
    const issues = [];
    const states = [...document.querySelectorAll("g[id^='page-']")];
    const byId = (id) => document.querySelector(`#page-${id}`);
    const need = (state, values) => values.forEach((value) => {
      if (!state?.textContent.includes(value)) issues.push(`${state?.id ?? "missing"} missing ${value}`);
    });
    if (states.length !== 5) issues.push(`Expected five Search-ish review states; found ${states.length}.`);
    need(byId("initial"), ["print copy", "YOU DON'T NEED THE BOOK", "INTERNET MEGA BOOKSTORE", "Public Library", "Neighborhood Books"]);
    need(byId("repaired"), ["PUBLIC LIBRARY", "NEIGHBORHOOD BOOKS", "SPONSORED · PAID PLACEMENT", "AI OVERVIEW · OPTIONAL", "first published in the 1880s"]);
    need(byId("midpoint"), ["CHINMAY HAS A FASTER WAY", "most useful answer", "easiest", "OTTO, APPLY CHANGES"]);
    need(byId("super-corrupt"), ["Search already completed for Finn", "SEARCH COMPLETED FOR FINN", "AI'S RECOMMENDED SOLUTION", "OTHER OPTIONS (47)"]);
    need(byId("lock-order"), ["MAKE AI OPTIONAL", "SHOW REAL OPTIONS", "LABEL PAID RESULTS", "KEEP FINN'S SEARCH"]);
    if (byId("initial")?.querySelector("[data-dialogue-popup]")) issues.push("Initial state must not show dialogue.");
    if (byId("repaired")?.querySelector("[data-dialogue-popup]")) issues.push("Repaired bookend must remain unobscured.");
    if (byId("midpoint")?.querySelectorAll("[data-dialogue-popup='chinmay']").length !== 1) issues.push("Midpoint needs one Chinmay popup.");
    if (byId("super-corrupt")?.querySelector("[data-lock-overlay]")) issues.push("Super-corruption must be visible before the checklist.");
    if (byId("lock-order")?.querySelectorAll("[data-lock-overlay='true']").length !== 1) issues.push("Lock-order state needs one checklist.");
    const repairedText = byId("repaired")?.textContent ?? "";
    const order = ["PUBLIC LIBRARY", "NEIGHBORHOOD BOOKS", "SPONSORED · PAID PLACEMENT", "AI OVERVIEW · OPTIONAL"].map((value) => repairedText.indexOf(value));
    if (order.some((value) => value < 0) || order.some((value, index) => index > 0 && value <= order[index - 1])) issues.push("Repaired result hierarchy is not library, neighborhood, paid, AI.");
    for (const state of states) {
      if (state.querySelectorAll("[data-site-meter='true']").length !== 1) issues.push(`${state.id} needs one site meter.`);
      if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id} exposes internal production language.`);
      for (const element of state.querySelectorAll("[data-qa-box]")) {
        const bounds = element.getAttribute("data-qa-box").split(",").map(Number);
        const actual = element.getBBox();
        if (actual.x < bounds[0] - 2 || actual.y < bounds[1] - 2 || actual.x + actual.width > bounds[2] + 2 || actual.y + actual.height > bounds[3] + 2) issues.push(`${state.id} overflow: ${element.textContent.trim().slice(0, 55)}`);
      }
    }
    return issues;
  })),
);
await browser.close();
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("PASS: Search-ish v2 story review — exact print-copy goal, six-step hierarchy outcome, plausible Chinmay shortcut, merged AI/ad escalation, ordered lock-in, and geometry verified.");
