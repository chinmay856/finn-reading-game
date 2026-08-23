#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);

const svgPath = path.resolve(
  process.argv[2] ??
    "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg",
);
const shellReferencePath = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg",
);
const errors = [];

if (COLORS.corruption !== "#C5251E" || COLORS.repair !== "#2F8A49") {
  errors.push("Canonical corruption/repair colors changed without updating the visual contract.");
}

function extractDefs(source) {
  return source.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
}

const svgSource = fs.readFileSync(svgPath, "utf8");
const referenceSource = fs.readFileSync(shellReferencePath, "utf8");
const referenceDefs = extractDefs(referenceSource);
if (!referenceDefs) throw new Error("Reviewed V2 shell has no extractable defs block.");
const expectedHash = crypto.createHash("sha256").update(referenceDefs).digest("hex");
const actualHash = svgSource.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1];
if (actualHash !== expectedHash) {
  errors.push("The complete master was not generated from the current reviewed V2 shell.");
}

for (const required of ["desktopComputer", "desktopFloppy", "desktopTrash", "microphoneIcon", "sharedShell"]) {
  if (!svgSource.includes(`id="${required}"`)) errors.push(`Reviewed shell component missing: #${required}.`);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(150);

const report = await page.evaluate(() => {
  const issues = [];
  const tolerance = 1.25;

  function boxWithin(actual, allowed) {
    return (
      actual.x >= allowed[0] - tolerance &&
      actual.y >= allowed[1] - tolerance &&
      actual.x + actual.width <= allowed[2] + tolerance &&
      actual.y + actual.height <= allowed[3] + tolerance
    );
  }

  for (const element of document.querySelectorAll("[data-qa-box]")) {
    const allowed = element.getAttribute("data-qa-box").split(",").map(Number);
    const actual = element.getBBox();
    if (!boxWithin(actual, allowed)) {
      const label = element.id || element.getAttribute("data-overlay") || element.textContent.trim().slice(0, 48);
      issues.push(`Overflow: ${label} bbox ${actual.x.toFixed(1)},${actual.y.toFixed(1)},${actual.width.toFixed(1)},${actual.height.toFixed(1)} outside ${allowed.join(",")}`);
    }
  }

  for (const element of document.querySelectorAll("[data-qa-color='red']")) {
    const fill = getComputedStyle(element).fill;
    if (!/rgb\((197, 37, 30|213, 36, 28|214, 36, 28)\)/.test(fill)) {
      issues.push(`Corruption marker is not red: ${element.textContent.trim()} computed ${fill}`);
    }
  }

  for (const element of document.querySelectorAll("[data-qa-on-red='true']")) {
    const fill = getComputedStyle(element).fill;
    if (fill !== "rgb(255, 255, 255)") {
      issues.push(`Red-surface label is not white: ${element.textContent.trim()} computed ${fill}`);
    }
  }

  for (const element of document.querySelectorAll("[data-qa-on-green='true']")) {
    const fill = getComputedStyle(element).fill;
    if (fill !== "rgb(255, 255, 255)") {
      issues.push(`Repair-surface label is not white: ${element.textContent.trim()} computed ${fill}`);
    }
  }

  for (const state of document.querySelectorAll("g[id^='page-']")) {
    const children = [...state.children];
    const firstUse = children.find((child) => child.tagName.toLowerCase() === "use");
    if (firstUse?.getAttribute("href") !== "#sharedShell") {
      issues.push(`${state.id} does not begin from the locked shared shell.`);
    }
    if (state.querySelector("[href='#technoOverlay']")) {
      issues.push(`${state.id} still contains the retired static Techno overlay.`);
    }
  }

  for (const checklist of document.querySelectorAll("[data-overlay='act2-checklist']")) {
    const box = checklist.getBBox();
    if (box.y + box.height > 744) {
      issues.push(`Act 2 checklist overlaps the footer meter: bottom=${(box.y + box.height).toFixed(1)}.`);
    }
  }

  const superState = document.querySelector("#page-super-corrupt");
  if (!superState?.querySelector("image[href*='wikiwhy-techno-vision-hatch-v3.png'][filter='url(#grayscale)']")) {
    issues.push("Super-corrupted state must use the grayscale colorblind-dog visual.");
  }
  if (superState?.querySelector("rect[fill='url(#spectrumGradient)']")) {
    issues.push("Super-corrupted state must not show the repaired dog-spectrum visual.");
  }

  const receipt = document.querySelector("#page-ai-receipt");
  if (!receipt?.querySelector("[data-companion-state='receipt']")) {
    issues.push("Final AI receipt state must keep the Reading Companion in its receipt/success state.");
  }
  if (receipt?.querySelector("[data-companion-state='reading']")) {
    issues.push("Final AI receipt state incorrectly resets the Reading Companion to reading mode.");
  }

  return issues;
});

errors.push(...report);
await browser.close();

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(
  "PASS: WikiWhy visual QA — reviewed shell locked; text boxes fit; red labels contrast; " +
    "checklist clears footer; grayscale Act 2 art and final receipt flow verified.",
);
