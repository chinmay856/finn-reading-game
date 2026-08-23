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
  process.argv[2] ?? "docs/design/screens/2026-08-15/spotty-fi-production/spotty-fi-anchor-master-v1.svg",
);
const shellReferencePath = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg",
);
const errors = [];
const svgSource = fs.readFileSync(svgPath, "utf8");
const referenceSource = fs.readFileSync(shellReferencePath, "utf8");
const referenceDefs = referenceSource.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const expectedHash = crypto.createHash("sha256").update(referenceDefs).digest("hex");
const actualHash = svgSource.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1];

if (actualHash !== expectedHash) errors.push("Spotty-Fi was not generated from the current reviewed shared shell.");
if (COLORS.corruption !== "#C5251E" || COLORS.repair !== "#2F8A49") errors.push("Canonical semantic colors changed.");

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(200);

const report = await page.evaluate(({ corruption, repair }) => {
  const issues = [];
  const tolerance = 1.5;
  for (const element of document.querySelectorAll("[data-qa-box]")) {
    const allowed = element.getAttribute("data-qa-box").split(",").map(Number);
    const actual = element.getBBox();
    const within = actual.x >= allowed[0] - tolerance && actual.y >= allowed[1] - tolerance && actual.x + actual.width <= allowed[2] + tolerance && actual.y + actual.height <= allowed[3] + tolerance;
    if (!within) issues.push(`Overflow: ${element.textContent.trim().slice(0, 42)} outside ${allowed.join(",")}`);
  }
  const initial = document.querySelector("#page-initial");
  const repairedState = document.querySelector("#page-repaired");
  const superState = document.querySelector("#page-super-corrupt");
  const locksState = document.querySelector("#page-act2-locks");
  const securedState = document.querySelector("#page-secured");
  const mustContain = (state, values) => values.forEach((value) => {
    if (!state?.textContent.includes(value)) issues.push(`${state?.id ?? "missing state"} missing ${value}`);
  });
  mustContain(initial, ["TRACK_001", "ARTIST: GENERATED", "CREATOR PROFILE NOT FOUND", "MUSIC RECOVERY", "VOLUME"]);
  mustContain(repairedState, ["Paper Planes", "Soft Crash", "VERIFIED CREATOR", "Mira — voice", "Related work", "FOLLOW"]);
  mustContain(superState, ["OPTIMAL SONG ∞", "ARTIST: AUTO", "ONE PERFECT CREATOR: AUTO", "17,004 NEW SONGS", "VOLUME: MAX", "AUTO OVER-FIX ACTIVE"]);
  mustContain(locksState, ["LOCK IN THE REPAIR", "SHOW THE ARTIST", "SHOW THE CREDITS", "LET USERS CHOOSE", "LET USERS SET THE VOLUME"]);
  mustContain(securedState, ["Paper Planes", "Soft Crash", "Chosen by Finn", "MUSIC + CHOICE RESTORED", "VOLUME"]);
  for (const forbidden of ["TRACK_001", "CREATOR PROFILE NOT FOUND", "ARTIST: GENERATED"]) {
    if (repairedState?.textContent.includes(forbidden)) issues.push(`Repaired state retains corrupted copy: ${forbidden}`);
  }
  for (const forbidden of ["Soft Crash", "VERIFIED CREATOR", "Chosen by Finn"]) {
    if (superState?.textContent.includes(forbidden)) issues.push(`Super-corruption retains repaired copy: ${forbidden}`);
  }
  const repairedStyle = repairedState?.innerHTML ?? "";
  if (repairedStyle.includes(corruption)) issues.push("Fully repaired site state retains canonical corruption red.");
  if (!repairedStyle.includes(repair)) issues.push("Fully repaired site state lacks canonical repair green.");
  const securedStyle = securedState?.innerHTML ?? "";
  if (securedStyle.includes(corruption)) issues.push("Final secured site retains canonical corruption red.");
  if (locksState?.querySelectorAll("[data-overlay='act2-checklist']").length !== 1) issues.push("Act 2 checklist state does not contain exactly one green repair overlay.");
  const states = [...document.querySelectorAll("g[id^='page-']")];
  if (states.length !== 13) issues.push(`Expected 13 site-only sequence states; found ${states.length}.`);
  for (const state of states) {
    const firstUse = [...state.children].find((child) => child.tagName.toLowerCase() === "use");
    if (firstUse?.getAttribute("href") !== "#sharedShell") issues.push(`${state.id} does not begin from the locked shared shell.`);
    if (state.querySelectorAll("[data-role='site-progress-fill']").length !== 1) issues.push(`${state.id} has the wrong number of site progress fills.`);
    if (state.querySelectorAll("[data-role='passage-progress-fill']").length !== 1) issues.push(`${state.id} has the wrong number of passage progress fills.`);

    // Generated, missing, or otherwise unresolved content is semantic
    // corruption and must remain canonical red until its own repair occurs.
    for (const element of state.querySelectorAll("[data-content-state='corrupted']")) {
      if (getComputedStyle(element).fill !== "rgb(197, 37, 30)") {
        issues.push(`${state.id} renders unresolved content in a non-corruption color: ${element.textContent.trim()}`);
      }
    }
    // Once content is repaired, it returns to the site's neutral content
    // palette. Green belongs to the surrounding repair signal, not ordinary
    // artist/title copy.
    for (const element of state.querySelectorAll("[data-content-state='fixed']")) {
      if (getComputedStyle(element).fill === "rgb(197, 37, 30)") {
        issues.push(`${state.id} leaves repaired content in corruption red: ${element.textContent.trim()}`);
      }
    }
  }
  const phase1Expectations = [
    ["page-phase1-track", "Mira • Jo • Kai"],
    ["page-phase1-artist", "Chosen by Finn"],
    ["page-phase1-about", "PROFILE DETAILS STILL MISSING"],
    ["page-phase1-credits", "Paper Planes began"],
  ];
  for (const [id, text] of phase1Expectations) mustContain(document.querySelector(`#${id}`), [text]);
  const finalTrackTitles = [...document.querySelectorAll("#page-repaired [data-track-title='true']")];
  if (finalTrackTitles.length !== 3 || finalTrackTitles.some((title) => getComputedStyle(title).fill !== "rgb(255, 255, 255)")) issues.push("Track titles and dominant artwork must restore together as the final large visual payoff.");
  const earlyTrackTitles = [...document.querySelectorAll("#page-phase1-track [data-track-title='true']")];
  if (earlyTrackTitles.some((title) => getComputedStyle(title).fill !== "rgb(197, 37, 30)")) issues.push("Early Spotty-Fi repairs must leave dominant track titles corrupted until the final visual payoff.");
  if (![...document.querySelectorAll("#page-phase1-track [data-content-state='corrupted']")].some((node) => node.textContent === "ARTIST: GENERATED" && getComputedStyle(node).fill === "rgb(197, 37, 30)")) {
    issues.push("The persistent player must keep ARTIST: GENERATED red until the artist repair occurs.");
  }
  const lockExpectations = [
    ["page-act2-artist", 1], ["page-act2-credits", 2], ["page-act2-choice", 3], ["page-act2-volume", 4],
  ];
  for (const [id, expected] of lockExpectations) {
    const state = document.querySelector(`#${id}`);
    const checked = [...state.querySelectorAll("[data-overlay='act2-checklist'] text")].filter((node) => node.textContent === "✓").length;
    if (checked !== expected) issues.push(`${id} has ${checked} secured locks; expected ${expected}.`);
  }
  if (initial?.querySelector("[data-volume-control='user']") == null || repairedState?.querySelector("[data-volume-control='user']") == null) issues.push("Phase 1 anchors must use the lime user-volume control.");
  if (superState?.querySelector("[data-volume-control='maximum']") == null) issues.push("Super-corruption must use the red maximum-volume control.");
  const maxBars = [...superState.querySelectorAll("[data-volume-control='maximum'] rect")];
  if (maxBars.length !== 5 || maxBars.some((bar) => Math.abs(bar.getBBox().height - 46) > 0.1)) issues.push("Maximum-volume control must show five equally full-height bars.");
  const choiceState = document.querySelector("#page-act2-choice");
  const searchChoice = choiceState?.querySelector("[data-choice-indicator='search']");
  const navChoice = choiceState?.querySelector("[data-choice-indicator='nav']");
  if (getComputedStyle(searchChoice).stroke !== "rgb(47, 138, 73)" || getComputedStyle(navChoice).fill !== "rgb(47, 138, 73)") issues.push("Act 2 user-choice lock does not turn both search and discovery navigation green immediately.");
  return issues;
}, { corruption: COLORS.corruption, repair: COLORS.repair });

errors.push(...report);
await browser.close();

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}
console.log("PASS: Spotty-Fi sequence QA — shared shell, 13 site states, staged Phase 1 repairs, four Act 2 locks, volume behavior, colors, and text bounds verified.");
