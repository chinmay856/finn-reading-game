#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-16/yahuh-production/yahuh-anchor-master-v2.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const errors = [];

const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push("Yahuh was not generated from the reviewed shared shell.");
if (!source.includes("www.yahuh.com")) errors.push("Yahuh needs its clean parody domain in the window bar.");
for (let index = 1; index <= 13; index += 1) {
  if (!fs.existsSync(path.join(path.dirname(svgPath), `yahuh-anchor-v2_p${index}.png`))) errors.push(`Missing exported Yahuh frame ${index}.`);
}
if (!fs.existsSync(path.join(path.dirname(svgPath), "yahuh-anchor-review-v2.html"))) errors.push("Missing Yahuh v2 click-through reviewer.");
if (!fs.existsSync(path.join(path.dirname(svgPath), "yahuh-typography-review-v1.html"))) errors.push("Missing Yahuh four-frame typography reviewer.");
if (!fs.existsSync(path.join(path.dirname(svgPath), "assets/auto-news-megaphone-v1.jpg"))) errors.push("Missing bespoke Auto-with-megaphone character asset.");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(250);
errors.push(...await page.evaluate(() => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const byId = (id) => document.querySelector(`#page-${id}`);
  const renderedFontSize = (node) => Number.parseFloat(getComputedStyle(node.closest("text") ?? node).fontSize);
  const boxesOverlap = (left, right) => Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x) > 0.5
    && Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y) > 0.5;
  const needs = (state, values) => values.forEach((value) => {
    if (!state?.textContent.includes(value)) issues.push(`${state?.id ?? "missing state"} missing ${value}`);
  });
  if (states.length !== 13) issues.push(`Expected thirteen Yahuh states; found ${states.length}.`);

  for (const state of states) {
    if (state.querySelectorAll("[data-module='lead-story']").length !== 1) issues.push(`${state.id} needs one lead story.`);
    if (state.querySelectorAll("[data-module='secondary-story']").length !== 2) issues.push(`${state.id} needs two supporting stories.`);
    if (state.querySelectorAll("[data-module='portal-header']").length !== 1) issues.push(`${state.id} needs one persistent portal header.`);
    if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id} exposes internal Act/Phase language.`);
    if (/DESIGN NOTE|REPAIR TARGET|LESSON:/i.test(state.textContent)) issues.push(`${state.id} leaks design-document language.`);
    for (const story of state.querySelectorAll("[data-story]")) {
      const [minX, minY, maxX, maxY] = story.getAttribute("data-qa-box").split(",").map(Number);
      for (const text of story.querySelectorAll("text")) {
        const box = text.getBBox();
        if (box.x < minX - 2 || box.y < minY - 2 || box.x + box.width > maxX + 2 || box.y + box.height > maxY + 2) issues.push(`${state.id} story text overflow: ${text.textContent}`);
      }
    }
    for (const line of state.querySelectorAll("[data-role='headline-line']")) {
      const slot = {
        x: Number(line.getAttribute("data-slot-x")),
        y: Number(line.getAttribute("data-slot-y")),
        width: Number(line.getAttribute("data-slot-width")),
        height: Number(line.getAttribute("data-slot-height")),
      };
      const box = line.getBBox();
      const horizontalInset = Math.min(box.x - slot.x, slot.x + slot.width - (box.x + box.width));
      const topPadding = box.y - slot.y;
      const bottomPadding = slot.y + slot.height - (box.y + box.height);
      if (horizontalInset < 1.5 || topPadding < 1.5 || bottomPadding < 1.5) issues.push(`${state.id} headline line escapes its explicit slot: ${line.textContent}`);
      if (Math.abs(topPadding - bottomPadding) > Math.max(8, slot.height * 0.18)) issues.push(`${state.id} headline line is not vertically balanced in its slot: ${line.textContent}`);
    }
    for (const panel of state.querySelectorAll("[data-role='reporting-panel']")) {
      const panelKey = panel.getAttribute("data-content-key");
      const rect = panel.querySelector(":scope > rect")?.getBBox();
      const block = panel.querySelector(":scope > [data-role='fact-block']");
      if (!rect || !block) {
        issues.push(`${state.id} ${panelKey} is missing its reporting rect or cohesive fact block.`);
        continue;
      }
      const blockBox = block.getBBox();
      const topPadding = blockBox.y - rect.y;
      const bottomPadding = rect.y + rect.height - (blockBox.y + blockBox.height);
      const leftPadding = blockBox.x - rect.x;
      const rightPadding = rect.x + rect.width - (blockBox.x + blockBox.width);
      if (topPadding < 2.5 || bottomPadding < 2.5 || leftPadding < 5 || rightPadding < 5) issues.push(`${state.id} ${panelKey} fact block is not safely inset: top ${topPadding.toFixed(1)}, bottom ${bottomPadding.toFixed(1)}, left ${leftPadding.toFixed(1)}, right ${rightPadding.toFixed(1)}.`);
      if (Math.abs(topPadding - bottomPadding) > 6) issues.push(`${state.id} ${panelKey} fact block is not vertically balanced: top ${topPadding.toFixed(1)}, bottom ${bottomPadding.toFixed(1)}.`);
      const textNodes = [...block.querySelectorAll("text")];
      for (const text of textNodes) {
        if (text.getAttribute("text-anchor") !== "start") issues.push(`${state.id} ${panelKey} reporting text is not left aligned: ${text.textContent}`);
      }
      for (let leftIndex = 0; leftIndex < textNodes.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < textNodes.length; rightIndex += 1) {
          if (boxesOverlap(textNodes[leftIndex].getBBox(), textNodes[rightIndex].getBBox())) issues.push(`${state.id} ${panelKey} has colliding text lines: ${textNodes[leftIndex].textContent} / ${textNodes[rightIndex].textContent}`);
        }
      }
    }
    for (const story of state.querySelectorAll("[data-story]")) {
      const storySizes = [...story.querySelectorAll("[data-content-key$='-story'] [data-role='fact-value']")].map(renderedFontSize);
      const captionSizes = [...story.querySelectorAll("[data-content-key$='-caption'] [data-role='fact-value']")].map(renderedFontSize);
      const metadataSizes = [...story.querySelectorAll("[data-content-key$='-source'] [data-role='fact-value'], [data-content-key$='-author'] [data-role='fact-value']")].map(renderedFontSize);
      if (storySizes.length && captionSizes.length && Math.min(...storySizes) <= Math.max(...captionSizes)) issues.push(`${state.id} ${story.getAttribute("data-story")} story type should be larger than its caption type.`);
      if (captionSizes.length && metadataSizes.length && Math.min(...captionSizes) < Math.max(...metadataSizes)) issues.push(`${state.id} ${story.getAttribute("data-story")} caption type should not be smaller than source/byline metadata.`);
    }
  }

  const first = ["initial", "story", "sources", "captions", "authors", "pictures", "repaired"].map(byId);
  const locks = ["auto-overfix", "checklist", "lock-pictures", "lock-reporting", "lock-headlines"].map(byId);
  const secured = byId("secured");

  needs(first[0], ["MOON", "RESIGNS", "PACIFIC", "OCEAN", "PIGEON", "WINS", "CITY"]);
  needs(first[1], ["The next new-moon phase arrives", "A cargo ship carrying canned soup"]);
  needs(first[2], ["COMMUNITY OBSERVATORY", "THE SOUP IS INSIDE THE SHIP"]);
  needs(first[3], ["Expected new-moon phase", "Soup cargo ship at sea.", "Winning school mascot."]);
  needs(first[4], ["MARA ORTIZ", "DEV PATEL", "JUNE PARK"]);
  needs(first[5], ["The next new-moon phase", "MOON", "RESIGNS", "FROM", "NIGHT", "SHIFT"]);
  needs(first[6], ["NEW MOON", "SHIP CARRYING SOUP", "PIGEON MASCOT WINS"]);
  needs(locks[0], ["AUTO NEWS DESK", "BLUETOOTH ENABLED", "MOON", "RESIGNS", "ENTIRE", "PLANET", "PIGEON", "ELECTED"]);
  needs(locks[1], ["BRING BACK THE PICTURES", "RESTORE THE STORIES", "FIX THE HEADLINES"]);
  needs(locks[2], ["MOON", "RESIGNS", "ENTIRE", "PLANET", "PIGEON", "ELECTED"]);
  needs(locks[3], ["MARA ORTIZ", "COMMUNITY OBSERVATORY", "MOON", "RESIGNS"]);
  needs(locks[4], ["NEW MOON", "SHIP CARRYING SOUP", "PIGEON MASCOT WINS"]);
  needs(secured, ["NEW MOON", "SHIP CARRYING SOUP", "PIGEON MASCOT WINS"]);

  const firstProgress = first.map((state) => Number(state.getAttribute("data-site-progress")));
  if (firstProgress.join(",") !== "0,17,33,50,67,83,100") issues.push(`First-run progress mismatch: ${firstProgress}`);
  const lockProgress = locks.map((state) => Number(state.getAttribute("data-site-progress")));
  if (lockProgress.join(",") !== "0,0,33,67,100") issues.push(`Lock-run progress mismatch: ${lockProgress}`);

  const headlineHeights = first.map((state) => Number(state.querySelector("[data-story='moon'] [data-headline-height]")?.getAttribute("data-headline-height")));
  for (let index = 1; index < 6; index += 1) {
    if (!(headlineHeights[index] < headlineHeights[index - 1])) issues.push(`Lead headline did not shrink at first-run step ${index}: ${headlineHeights}`);
    if (headlineHeights[index - 1] - headlineHeights[index] < 18) issues.push(`Lead headline shrink is too subtle at first-run step ${index}: ${headlineHeights}`);
  }
  if (headlineHeights[6] !== headlineHeights[5]) issues.push(`Final headline geometry should stay fixed while its wording corrects: ${headlineHeights}`);

  const initialLeadHeadline = first[0].querySelector("[data-content-key='moon-headline']").getBBox();
  if (initialLeadHeadline.width * initialLeadHeadline.height < 0.8 * 456 * 443) issues.push("The initial lead headline does not dominate the available article space.");
  for (const kind of ["soup", "pigeon"]) {
    const compactHeadline = first[0].querySelector(`[data-content-key='${kind}-headline']`).getBBox();
    if (compactHeadline.width * compactHeadline.height < 0.9 * 264 * 202) issues.push(`The initial ${kind} headline does not cover nearly the full compact story.`);
  }
  for (const kind of ["moon", "soup", "pigeon"]) {
    const redWording = first.slice(0, 6).map((state) => state.querySelector(`[data-content-key='${kind}-headline']`)?.textContent.replace(/[^a-z0-9]/gi, "").toLowerCase());
    if (new Set(redWording).size !== 1) issues.push(`${kind} red headline wording drifts before it is repaired: ${redWording.join(" | ")}`);
    for (const state of [...first, ...locks.slice(2), secured]) {
      const headline = state.querySelector(`[data-content-key='${kind}-headline']`);
      if (headline && [...headline.querySelectorAll("text")].some((text) => text.getAttribute("text-anchor") !== "middle")) issues.push(`${state.id} ${kind} headline type is not centered within its current container.`);
    }
  }

  const representative = [first[0], first[1], first[4], first[5], first[6], locks[2], locks[3]];
  for (const state of representative) {
    for (const headline of state.querySelectorAll("g[data-content-key$='-headline']")) {
      const lines = [...headline.querySelectorAll(":scope > [data-role='headline-line']")];
      const fontSizes = lines.map((line) => Number.parseFloat(line.getAttribute("font-size") || getComputedStyle(line).fontSize));
      if (fontSizes.length && Math.max(...fontSizes) - Math.min(...fontSizes) > 0.05) {
        issues.push(`${state.id} headline mixes font sizes within one container: ${fontSizes.join(", ")}.`);
      }
      for (const line of lines) {
        const slotWidth = Number(line.getAttribute("data-slot-width"));
        const utilization = line.getBBox().width / Math.max(1, slotWidth - 20);
        if (utilization < 0.16) issues.push(`${state.id} headline line underuses its assigned slot: ${line.textContent} (${utilization.toFixed(2)}).`);
      }
    }
  }
  const pictureLockLines = [...locks[2].querySelectorAll("g[data-content-key='moon-headline'] > [data-role='headline-line']")];
  const pictureLockBaselines = pictureLockLines.map((line) => Number(line.getAttribute("y")));
  const pictureLockGaps = pictureLockBaselines.slice(1).map((baseline, index) => baseline - pictureLockBaselines[index]);
  if (pictureLockGaps.length === 2 && Math.abs(pictureLockGaps[0] - pictureLockGaps[1]) > 0.5) {
    issues.push(`Pictures-restored moon headline is not evenly spaced: ${pictureLockBaselines.join(", ")}.`);
  }
  const reportingLockLines = [...locks[3].querySelectorAll("g[data-content-key='moon-headline'] > [data-role='headline-line']")];
  const reportingLockFont = Number(reportingLockLines[0]?.getAttribute("font-size"));
  if (!(reportingLockFont >= 32)) issues.push(`Reporting-restored moon headline is too small for its container: ${reportingLockFont}.`);
  for (const state of [first[4], locks[3]]) {
    for (const kind of ["soup", "pigeon"]) {
      const headlineRect = state.querySelector(`g[data-content-key='${kind}-headline'] > rect`)?.getBBox();
      const headlineLines = [...state.querySelectorAll(`g[data-content-key='${kind}-headline'] > [data-role='headline-line']`)];
      const picture = state.querySelector(`[data-module='secondary-story'][data-story='${kind}'] image`)?.getBBox();
      if (!headlineRect || Math.abs(headlineRect.width - 138) > 0.5 || Math.abs(headlineRect.height - 82) > 0.5) {
        issues.push(`${state.id} ${kind} headline does not preserve the guttered 138 by 82 compact composition.`);
      }
      if (headlineRect && picture && headlineRect.x - (picture.x + picture.width) < 13) {
        issues.push(`${state.id} ${kind} media row lost the whitespace between picture and headline.`);
      }
      if (headlineLines.length !== 3) issues.push(`${state.id} ${kind} headline should use three vertical slots, not ${headlineLines.length}.`);
      if (headlineRect && headlineLines.length) {
        const lineBoxes = headlineLines.map((line) => line.getBBox());
        const top = Math.min(...lineBoxes.map((box) => box.y));
        const bottom = Math.max(...lineBoxes.map((box) => box.y + box.height));
        if ((bottom - top) / headlineRect.height < 0.72) {
          issues.push(`${state.id} ${kind} headline does not use enough vertical space: ${((bottom - top) / headlineRect.height).toFixed(2)}.`);
        }
      }
    }
  }
  for (const state of [first[1], first[5], first[6]]) {
    const leadBlock = state.querySelector("[data-content-key='moon-story'] [data-role='fact-block']");
    const leadRect = state.querySelector("[data-content-key='moon-story'] rect")?.getBBox();
    if (leadBlock && leadRect && leadBlock.getBBox().height / leadRect.height < 0.45) issues.push(`${state.id} lead story copy does not use enough of its assigned height.`);
    const leadFont = Number(leadBlock?.getAttribute("data-body-font-size"));
    const compactFonts = [...state.querySelectorAll("[data-module='secondary-story'] [data-content-key$='-story'] [data-role='fact-block']")].map((block) => Number(block.getAttribute("data-body-font-size")));
    if (compactFonts.length && !(leadFont > Math.max(...compactFonts))) issues.push(`${state.id} lead story type should scale independently above compact story type.`);
  }

  for (const state of first.slice(2)) {
    const storyRect = state.querySelector("[data-content-key='moon-story'] rect")?.getBBox();
    const sourceRect = state.querySelector("[data-content-key='moon-source'] rect")?.getBBox();
    if (storyRect && sourceRect && storyRect.width * storyRect.height <= sourceRect.width * sourceRect.height) issues.push(`${state.id} source metadata is visually heavier than the article story.`);
  }

  for (const state of [...first.slice(1), ...locks.slice(2), secured]) {
    for (const label of state.querySelectorAll("[data-role='fact-label']")) {
      if (label.getAttribute("fill") !== "#2F8A49") issues.push(`${state.id} fact label is not canonical repair green: ${label.textContent}`);
    }
    for (const value of state.querySelectorAll("[data-role='fact-value']")) {
      if (value.getAttribute("fill") !== "#172D40") issues.push(`${state.id} fact value is not neutral black: ${value.textContent}`);
    }
  }

  const authorsLeadRows = ["moon-story", "moon-caption", "moon-source", "moon-author"].map((key) => first[4].querySelector(`[data-content-key='${key}'] rect`)?.getBBox());
  if (authorsLeadRows.some((box) => !box || box.x !== 132 || box.width !== 456)) issues.push("Authors-return lead reporting should use one clean full-width stack.");
  for (const state of first.slice(4)) {
    for (const compact of state.querySelectorAll("[data-module='secondary-story']")) {
      const authorRow = compact.querySelector("[data-content-key$='-author'] rect")?.getBBox();
      const storyBox = compact.getBBox();
      if (authorRow && Math.abs(authorRow.y + authorRow.height - (storyBox.y + 215)) > 1) issues.push(`${state.id} compact metadata stack does not use the available card height.`);
      for (const line of compact.querySelectorAll("text:has([data-role='fact-label'])")) {
        if (line.getAttribute("text-anchor") !== "start") issues.push(`${state.id} compact labeled fact is not left aligned in its row: ${line.textContent}`);
      }
    }
  }

  const firstKeys = ["moon-story", "moon-source", "moon-caption", "moon-author"];
  firstKeys.forEach((key, index) => {
    const firstVisible = first.findIndex((state) => state.querySelector(`[data-content-key='${key}']`));
    if (firstVisible !== index + 1) issues.push(`${key} appears at first-run index ${firstVisible}, expected ${index + 1}.`);
  });

  if (locks[0].querySelectorAll("[data-auto-character='news-desk']").length !== 1) issues.push("Auto over-fix needs the canonical visible Auto newsroom cue.");
  if (locks[0].querySelector("[data-story='moon'] image:not([href*='auto-news-megaphone'])")) issues.push("Auto over-fix should remove the underlying moon picture.");
  if (/PICTURE RESTORED|REPORTING STILL REMOVED|TRENDING REACTION|PICTURE STILL OVERSOLD|STORY SUMMARY/.test(states.map((state) => state.textContent).join("\n"))) issues.push("Yahuh still contains explanatory labels that should be shown through the layout instead.");
  if (locks[2].querySelectorAll("[data-story] image").length !== 3) issues.push("The first lock should restore all three pictures.");
  for (const key of ["story", "source", "caption", "author"]) {
    if (locks[3].querySelectorAll(`[data-content-key$='-${key}']`).length !== 3) issues.push(`The reporting lock should restore all three ${key} modules.`);
  }

  const expectedChecks = new Map([[locks[1], 0], [locks[2], 1], [locks[3], 2], [locks[4], 3]]);
  for (const [state, expected] of expectedChecks) {
    const checks = [...state.querySelectorAll(".lock-mark")].filter((mark) => mark.textContent === "✓").length;
    if (checks !== expected) issues.push(`${state.id} should show ${expected} checks, found ${checks}.`);
  }
  for (const state of [...first, locks[0], secured]) {
    if (state.querySelector("[data-lock-overlay='true']")) issues.push(`${state.id} must not show the checklist.`);
  }
  if (secured.querySelectorAll("[data-content-state='corrupted']").length) issues.push("Secured Yahuh still contains semantic-red content.");
  const repairedText = first[6].querySelector("[data-module='lead-story']").textContent + first[6].querySelectorAll("[data-module='secondary-story']")[0].textContent + first[6].querySelectorAll("[data-module='secondary-story']")[1].textContent;
  const securedText = secured.querySelector("[data-module='lead-story']").textContent + secured.querySelectorAll("[data-module='secondary-story']")[0].textContent + secured.querySelectorAll("[data-module='secondary-story']")[1].textContent;
  if (repairedText !== securedText) issues.push("Secured Yahuh does not return to the exact repaired story content.");
  return issues;
}));
await browser.close();

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("PASS: Yahuh sequence QA — thirteen states, centered responsive headline type, vertically balanced left-aligned reporting blocks, story-first type hierarchy, six shrinking-headline first-run repairs, three asymmetric Auto locks, canonical Auto art, no text overflow, and exact secured return.");
