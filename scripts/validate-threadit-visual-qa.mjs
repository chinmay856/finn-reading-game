#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-16/threadit-production/threadit-anchor-master-v2.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const errors = [];

const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push("ThreadIt was not generated from the reviewed shared shell.");
if (!source.includes("www.thread-it.com")) errors.push("ThreadIt needs the clean reviewed domain in the window bar.");
if (/www\.thread-it\.com\/(?:r\/)?rawfishforever/i.test(source)) errors.push("The community path leaked into the clean window domain.");
for (let index = 1; index <= 13; index += 1) {
  if (!fs.existsSync(path.join(path.dirname(svgPath), `threadit-anchor-v2_p${index}.png`))) errors.push(`Missing exported ThreadIt frame ${index}.`);
}
if (!fs.existsSync(path.join(path.dirname(svgPath), "threadit-anchor-review-v2.html"))) errors.push("Missing ThreadIt v2 click-through reviewer.");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(200);
errors.push(...await page.evaluate(() => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const byId = (id) => document.querySelector(`#page-${id}`);
  const needs = (state, values) => values.forEach((value) => {
    if (!state?.textContent.includes(value)) issues.push(`${state?.id ?? "missing state"} missing ${value}`);
  });
  if (states.length !== 13) issues.push(`Expected thirteen ThreadIt states; found ${states.length}.`);

  for (const state of states) {
    if (state.querySelectorAll("[data-forum-thread='true']").length !== 1) issues.push(`${state.id} needs one fixed forum-thread surface.`);
    if (state.querySelectorAll("[data-community-rail='true']").length !== 1) issues.push(`${state.id} needs one fixed community rail.`);
    if (state.querySelectorAll("[data-module][data-purpose]").length < 6) issues.push(`${state.id} has an unclassified or missing site module.`);
    if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id} exposes internal Act/Phase language.`);
    if (/DESIGN NOTE|REPAIR TARGET|SOURCE INDEPENDENCE LESSON/i.test(state.textContent)) issues.push(`${state.id} leaks design-document language into the forum.`);
    for (const element of state.querySelectorAll("[data-qa-box]")) {
      const bounds = element.getAttribute("data-qa-box").split(",").map(Number);
      const actual = element.getBBox();
      if (actual.x < bounds[0] - 1.5 || actual.y < bounds[1] - 1.5 || actual.x + actual.width > bounds[2] + 1.5 || actual.y + actual.height > bounds[3] + 1.5) issues.push(`${state.id} overflow: ${element.textContent.trim().slice(0, 50)}`);
    }
    for (const text of state.querySelectorAll(".thread-heading,.thread-body,.thread-label,.thread-micro,.thread-small,.lock-label")) {
      const maxWidth = text.classList.contains("lock-label") ? 385 : text.closest("[data-community-rail],[data-top-posts]") ? 190 : 470;
      if (text.getBBox().width > maxWidth) issues.push(`${state.id} text exceeds ${maxWidth}px: ${text.textContent}`);
    }
  }

  const initial = byId("initial");
  const untangled = byId("untangled");
  const origin = byId("origin");
  const copies = byId("copies");
  const copiesRemoved = byId("copies-removed");
  const questionsRestored = byId("questions-restored");
  const repaired = byId("repaired");
  const overfix = byId("auto-overfix");
  const checklist = byId("checklist");
  const lockOrigin = byId("lock-origin");
  const lockSourcesContext = byId("lock-sources-context");
  const lockQuestions = byId("lock-questions");
  const secured = byId("secured");

  needs(initial, ["r/RawFishForever", "Every kind of raw fish is ALWAYS safe.", "ORIGIN HIDDEN · TIMESTAMP HIDDEN", "TREATED AS A NEW ANSWER", "QUESTION HIDDEN · −9,001 POINTS", "47 MEMBERS · 47 AGREE", "THREAD UNTANGLED", "OVER", "9,000", "TOP POSTS", "u/raw_fish_mod · ADMIN", "u/raw_fish_fan_1"]);
  needs(untangled, ["ORIGIN HIDDEN · TIMESTAMP HIDDEN", "TREATED AS A NEW ANSWER"]);
  needs(origin, ["ORIGINAL POST · u/raw_fish_fan_1 · 2 HOURS AGO", "214", "I ate a raw piece of fish once and felt fine.", "This is my personal story—not a safety check.", "TREATED AS A NEW ANSWER"]);
  needs(copies, ["COPY · FROM u/raw_fish_fan_1", "TREATED AS A NEW ANSWER", "QUESTION HIDDEN"]);
  needs(copiesRemoved, ["3 COPIED COMMENTS · COUNTED ONCE", "Read real sources and research before deciding.", "↑ −42 ↓", "↑ 284 ↓", "↑ 2.4K ↓", "QUESTION HIDDEN"]);
  needs(questionsRestored, ["DISAGREEMENT VISIBLE", "47 MEMBERS · 47 AGREE", "QUESTIONS NOT ALLOWED", "RAW_FISH_FAN_1 IS THE SOURCE"]);
  needs(repaired, ["I ate a raw piece of fish once and felt fine.", "This is my personal story—not a safety check.", "Every kind of raw fish is ALWAYS safe.", "Read real sources and research before deciding.", "DISAGREEMENT IS WELCOME", "LINK USEFUL SOURCES", "DISAGREEMENT VISIBLE", "MIXED VIEWS", "TOP POSTS"]);
  needs(overfix, ["Every kind of raw fish is ALWAYS safe.", "AUTO VERIFIED: 47 OUT OF 47 AUTO-FANS AGREE.", "47 AUTO-FANS · ONE COPIED CLAIM", "47 MEMBERS · 47 REPOSTS SYNCED", "REPOST 1", "AUTO MOD", "BLUETOOTH ENABLED", "COPIED FROM u/auto_fan_1", "DISAGREEMENT AUTO-COLLAPSED"]);
  needs(checklist, ["LOCK IN THE REPAIR", "RESTORE HUMAN POSTS", "COUNT SOURCES + COLLAPSE COPIES", "LET PEOPLE DISAGREE"]);
  needs(lockOrigin, ["ORIGINAL POST · u/raw_fish_fan_1 · 2 HOURS AGO", "47 AUTO-FANS · ONE COPIED CLAIM"]);
  needs(lockSourcesContext, ["PERSONAL STORY", "HANDLING CONTEXT", "CURRENT GUIDANCE", "DISAGREEMENT AUTO-COLLAPSED"]);
  needs(lockQuestions, ["DISAGREEMENT VISIBLE", "DISAGREEMENT IS WELCOME", "LINK USEFUL SOURCES"]);
  needs(secured, ["I ate a raw piece of fish once and felt fine.", "This is my personal story—not a safety check.", "Read real sources and research before deciding.", "DISAGREEMENT VISIBLE", "SOURCE LOCKS"]);

  if (!initial.querySelector("[data-thread-connector='tangled']")) issues.push("Initial corruption needs one connected tangled comment path.");
  if (initial.querySelector("[data-thread-connector='tangled'] circle")) issues.push("The initial tangled comment path must not contain red dot markers.");
  if (!untangled.querySelector("[data-thread-connector='ordered']")) issues.push("The first repair must replace the tangle with an ordered post-to-comment connector.");
  if (copiesRemoved.querySelectorAll("[data-copies-collapsed] [data-thread-reply]").length !== 3) issues.push("Collapsed copies must create room for three native comment rows.");

  const firstRun = [initial, untangled, origin, copies, copiesRemoved, questionsRestored, repaired];
  const firstProgress = firstRun.map((state) => Number(state.getAttribute("data-site-progress")));
  if (firstProgress.join(",") !== "0,17,33,50,67,83,100") issues.push(`First-run progress is not 0/17/33/50/67/83/100: ${firstProgress}`);
  const lockRun = [overfix, checklist, lockOrigin, lockSourcesContext, lockQuestions];
  const lockProgress = lockRun.map((state) => Number(state.getAttribute("data-site-progress")));
  if (lockProgress.join(",") !== "0,0,33,67,100") issues.push(`Lock-run progress is not 0/0/33/67/100: ${lockProgress}`);

  for (const state of [checklist, lockOrigin, lockSourcesContext, lockQuestions]) {
    if (state.querySelectorAll("[data-lock-overlay='true']").length !== 1) issues.push(`${state.id} must show one lock-in overlay.`);
  }
  for (const state of [initial, untangled, origin, copies, copiesRemoved, questionsRestored, repaired, overfix, secured]) {
    if (state.querySelector("[data-lock-overlay='true']")) issues.push(`${state.id} must not show the lock overlay.`);
  }
  if (overfix.querySelectorAll("[data-thread-reply]").length !== 3) issues.push("Auto over-fix needs three visibly repeated reposts.");
  if (/\bTESTS?\b/i.test(overfix.textContent)) issues.push("Auto over-fix must describe reposts and copied agreement, not tests.");
  if (overfix.querySelectorAll("[data-auto-easter-egg='character']").length !== 1) issues.push("Auto over-fix needs one restrained in-forum Auto character cue.");
  if (overfix.querySelectorAll("[data-auto-fan-swarm] circle").length < 8) issues.push("Auto over-fix needs a visible Auto-fan swarm, not only renamed copy.");

  const expectedChecks = new Map([[checklist, 0], [lockOrigin, 1], [lockSourcesContext, 2], [lockQuestions, 3]]);
  for (const [state, expected] of expectedChecks) {
    const checks = [...state.querySelectorAll(".lock-mark")].filter((mark) => mark.textContent === "✓").length;
    if (checks !== expected) issues.push(`${state.id} should have ${expected} secured checklist items, found ${checks}.`);
  }

  const stableText = (sequence, key, untilIndex) => {
    const values = sequence.slice(0, untilIndex).map((state) => state.querySelector(`[data-content-key='${key}']`)?.textContent);
    if (values.some((value) => !value) || new Set(values).size !== 1) issues.push(`${key} drifts before its repair: ${values.join(" | ")}`);
  };
  stableText(firstRun, "forum-headline", 2);
  stableText(firstRun.slice(2), "forum-headline", 5);
  stableText(firstRun, "forum-body", 2);
  stableText(firstRun.slice(2), "forum-body", 5);
  stableText(firstRun, "forum-origin", 2);
  stableText(firstRun, "question-card", 5);
  for (const key of ["reply-claim-1", "reply-claim-2", "reply-claim-3", "reply-treatment-1", "reply-treatment-2", "reply-treatment-3"]) {
    stableText(firstRun, key, 4);
  }

  const forbiddenCaptions = /COMMENT ORDER (?:HIDDEN|VISIBLE)|VOTES OPAQUE|ORIGINAL POST CONNECTED TO COMMENTS|COPIED COMMENTS IDENTIFIED|COPIES COUNTED ONCE|UNIQUE COMMENTS RESTORED/i;
  for (const state of firstRun) {
    if (forbiddenCaptions.test(state.textContent)) issues.push(`${state.id} still contains an explanatory repair caption.`);
  }
  if (!/OVER\s*9,000/.test(`${initial.textContent} ${untangled.textContent}`)) issues.push("Initial and untangled states need the absurd OVER 9,000 main score.");
  for (const state of [origin, copies, copiesRemoved, questionsRestored, repaired]) {
    if (!state.textContent.includes("214")) issues.push(`${state.id} should retain the restored main-post score of 214.`);
  }

  const collapsedRows = [...copiesRemoved.querySelectorAll("[data-copies-collapsed] [data-thread-reply]")];
  const expectedRanks = [
    ["1", "u/food_safety_guide", "2.4K"],
    ["2", "u/kitchen_coach", "284"],
    ["3", "u/raw_fish_fan_2", "−42"],
  ];
  expectedRanks.forEach(([rank, author, score], index) => {
    const row = collapsedRows[index];
    if (row?.getAttribute("data-comment-rank") !== rank || !row.textContent.includes(author) || !row.textContent.includes(score)) issues.push(`Collapsed comment rank ${rank} must be ${author} at ${score}.`);
  });

  const verticalAnchor = (state) => ({
    replyY: Math.round(state.querySelector("[data-thread-reply='1']")?.getBBox().y ?? -1),
    questionY: Math.round(state.querySelector("[data-module='question-card']")?.getBBox().y ?? -1),
    commentsY: Math.round(state.querySelector("[data-forum-thread] text.thread-muted")?.getBBox().y ?? -1),
  });
  const securedAnchor = verticalAnchor(secured);
  for (const state of [lockSourcesContext, lockQuestions]) {
    const anchor = verticalAnchor(state);
    if (JSON.stringify(anchor) !== JSON.stringify(securedAnchor)) issues.push(`${state.id} must use the secured comment, question, and label coordinates: ${JSON.stringify(anchor)} vs ${JSON.stringify(securedAnchor)}.`);
  }

  for (const state of states) {
    for (const connector of state.querySelectorAll("[data-thread-connector]")) {
      const box = connector.getBBox();
      if (box.y + box.height > 616) issues.push(`${state.id} comment connector spills below the forum surface.`);
    }
  }
  stableText(lockRun, "forum-headline", 2);
  stableText(lockRun.slice(2), "forum-headline", 3);
  stableText(lockRun, "forum-body", 2);
  stableText(lockRun.slice(2), "forum-body", 3);
  stableText(lockRun, "forum-origin", 2);
  stableText(lockRun, "question-card", 4);

  const canonicalRed = "rgb(197, 37, 30)";
  const canonicalGreen = "rgb(47, 138, 73)";
  if (getComputedStyle(initial.querySelector("[data-content-key='forum-headline']")).fill !== canonicalRed) issues.push("Initial universal claim is not canonical corruption red.");
  if (getComputedStyle(repaired.querySelector("[data-content-key='forum-headline']")).fill !== "rgb(23, 45, 64)") issues.push("Repaired headline should return to neutral site copy with a green repaired forum frame.");
  for (const state of [origin, copies, copiesRemoved, questionsRestored, repaired, lockOrigin, lockSourcesContext, lockQuestions, secured]) {
    if (state.querySelector("[data-content-key='forum-headline']")?.textContent !== "I ate a raw piece of fish once and felt fine.") issues.push(`${state.id} does not preserve the restored personal-story headline.`);
    if (state.querySelector("[data-content-key='forum-body']")?.textContent !== "This is my personal story—not a safety check.") issues.push(`${state.id} does not preserve the restored personal-story qualifier.`);
  }
  for (const state of [repaired, secured]) {
    if (/Can votes decide whether food is safe\?|One claim repeated by several accounts/i.test(state.textContent)) issues.push(`${state.id} regressed to a didactic lesson-statement headline.`);
  }
  if (getComputedStyle(repaired.querySelector("[data-role='site-progress-fill']")).fill !== canonicalGreen) issues.push("Repaired progress does not use canonical repair green.");
  if (getComputedStyle(overfix.querySelector("[data-role='site-progress-fill']")).fill !== canonicalRed && overfix.getAttribute("data-site-progress") !== "0") issues.push("Auto over-fix progress color is not canonical red.");

  for (const state of [lockOrigin, lockSourcesContext, lockQuestions]) {
    const done = [...state.querySelectorAll(".lock-mark")].filter((mark) => mark.textContent === "✓");
    if (done.some((mark) => getComputedStyle(mark).fill !== "rgb(255, 255, 255)")) issues.push(`${state.id} has a non-white check on its canonical green box.`);
  }
  if (secured.querySelector("[data-lock-overlay='true']")) issues.push("Secured ThreadIt state must close the checklist overlay.");
  if (secured.querySelectorAll("[data-content-state='corrupted']").length) issues.push("Secured ThreadIt still contains unresolved semantic-red content.");
  if (repaired.textContent !== secured.textContent.replace("SOURCE LOCKS", "THREAD UNTANGLED")) {
    const repairedForum = repaired.querySelector("[data-forum-thread]")?.textContent + repaired.querySelector("[data-community-rail]")?.textContent + repaired.querySelector("[data-top-posts]")?.textContent;
    const securedForum = secured.querySelector("[data-forum-thread]")?.textContent + secured.querySelector("[data-community-rail]")?.textContent + secured.querySelector("[data-top-posts]")?.textContent;
    if (repairedForum !== securedForum) issues.push("Secured forum does not return to the exact repaired forum content.");
  }
  return issues;
}));
await browser.close();

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("PASS: ThreadIt sequence QA — 13 states, six first-run repairs, three one-passage Auto locks, vote-ranked comments, fixed forum geometry, stable red copy, causal checklist updates, Auto continuity, secured state, and text bounds verified.");
