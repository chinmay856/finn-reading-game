#!/usr/bin/env node

import crypto from "node:crypto";
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
    "docs/design/screens/2026-08-16/mycorner-production/mycorner-bookends-master-v2.svg",
);
const shellPath = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg",
);
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const errors = [];
const expectedHash = crypto
  .createHash("sha256")
  .update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1])
  .digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) {
  errors.push("MyCorner v2 does not use the reviewed shared shell.");
}

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
    const needs = (state, values) =>
      values.forEach((value) => {
        if (!state?.textContent.includes(value)) {
          issues.push(`${state?.id ?? "missing"} missing ${value}`);
        }
      });

    if (states.length !== 2) issues.push(`Expected two MyCorner v2 bookends; found ${states.length}.`);
    needs(byId("initial"), [
      "DefinitelyAmy_Official_Real",
      "PHOTO TAPED TO A POPSICLE STICK",
      "Joined",
      "6 minutes ago",
      "URGENT BULLETIN",
      "PARIS",
      "DUBAI",
      "GATE 404",
      "PrinceOfPrinters",
    ]);
    needs(byId("repaired"), [
      "Amy",
      "KNOWN PROFILE",
      "joined 6 years ago",
      "Saved family chat",
      "Profile history",
      "Copied profile separated and blocked",
    ]);

    if (byId("initial")?.textContent.includes("PROFILE CHECK")) {
      issues.push("Initial bookend still explains the lesson through a PROFILE CHECK panel.");
    }
    if (byId("repaired")?.textContent.includes("NO URGENT MONEY REQUEST")) {
      issues.push("Repaired bookend still presents an instructional checklist instead of a profile.");
    }
    if (byId("initial")?.querySelector("[data-lock-overlay]")) {
      issues.push("Initial bookend must not show the later repair checklist.");
    }
    if (byId("repaired")?.querySelector("[data-lock-overlay]")) {
      issues.push("Repaired bookend must not show the later repair checklist.");
    }
    if (byId("repaired")?.textContent.includes("AI VERIFIED")) {
      issues.push("Repaired bookend must not retain Auto's fake verification language.");
    }
    if (byId("repaired")?.innerHTML.includes("#C5251E")) {
      issues.push("Repaired bookend contains canonical corruption red.");
    }

    for (const state of states) {
      if (state.querySelectorAll("[data-profile-image]").length !== 1) {
        issues.push(`${state.id} needs exactly one dominant profile image.`);
      }
      if (state.querySelectorAll("[data-site-meter]").length !== 1) {
        issues.push(`${state.id} needs exactly one site progress meter.`);
      }
      if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) {
        issues.push(`${state.id} exposes internal Act/Phase language.`);
      }
      for (const element of state.querySelectorAll("[data-qa-box]")) {
        const bounds = element.getAttribute("data-qa-box").split(",").map(Number);
        const actual = element.getBBox();
        if (
          actual.x < bounds[0] - 1.5 ||
          actual.y < bounds[1] - 1.5 ||
          actual.x + actual.width > bounds[2] + 1.5 ||
          actual.y + actual.height > bounds[3] + 1.5
        ) {
          issues.push(`${state.id} overflow: ${element.textContent.trim().slice(0, 60)}`);
        }
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
console.log(
  "PASS: MyCorner v2 bookends — shared shell, social-profile storytelling, paper-mask impersonation, contradictory history, complete repaired Amy profile, and geometry verified.",
);
