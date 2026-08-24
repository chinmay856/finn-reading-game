#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-22/mycorner-production/mycorner-anchor-master-v3.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const source = fs.readFileSync(svgPath, "utf8");
const shell = fs.readFileSync(shellPath, "utf8");
const errors = [];

const expectedShellHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedShellHash) errors.push("MyCorner was not generated from the reviewed shared shell.");
if (!source.includes("www.my-corner.com")) errors.push("MyCorner needs the clean reviewed domain in the window bar.");
for (let index = 1; index <= 12; index += 1) {
  if (!fs.existsSync(path.join(path.dirname(svgPath), `mycorner-anchor-v3_p${index}.png`))) errors.push(`Missing MyCorner frame ${index}.`);
}
if (!fs.existsSync(path.join(path.dirname(svgPath), "mycorner-anchor-review-v3.html"))) errors.push("Missing MyCorner click-through reviewer.");

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(250);
errors.push(...await page.evaluate(() => {
  const issues = [];
  const states = [...document.querySelectorAll("g[id^='page-']")];
  const byId = (id) => document.querySelector(`#page-${id}`);
  const needs = (state, values) => values.forEach((value) => {
    if (!state?.textContent.includes(value)) issues.push(`${state?.id ?? "missing state"} missing ${value}`);
  });
  if (states.length !== 12) issues.push(`Expected twelve MyCorner states; found ${states.length}.`);

  const requiredModules = ["browser-chrome", "site-header", "profile-identity", "profile-photo", "profile-details-group", "profile-song", "contact-actions", "profile-details", "lead-bulletin", "blurbs", "profile-history", "friend-space", "site-progress", "reading-companion-placeholder"];
  for (const state of states) {
    for (const module of requiredModules) {
      if (state.querySelectorAll(`[data-module='${module}']`).length !== 1) issues.push(`${state.id} needs exactly one ${module} module.`);
    }
    if (state.querySelectorAll("[data-module][data-purpose]").length < requiredModules.length) issues.push(`${state.id} has an unclassified or missing module.`);
    if (/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent)) issues.push(`${state.id} exposes internal Act/Phase language.`);
    if (/DESIGN NOTE|REPAIR TARGET|MODULE PURPOSE|PASSAGE \d/i.test(state.textContent)) issues.push(`${state.id} leaks production language.`);
    if (/\bFINN(?:'S)?\b/i.test(state.textContent)) issues.push(`${state.id} exposes the player's name.`);
    if (/SAME PHOTO FOUR TIMES|DISTINCT PHOTOS|KNOWN CONNECTIONS|SAME IMAGE/i.test(state.textContent)) issues.push(`${state.id} explains a visual joke instead of showing it.`);
    if (/ROYAL USB|PRINTER|UNVERIFIED REQUEST|\$2,000,000/i.test(state.textContent)) issues.push(`${state.id} retains superseded MyCorner copy.`);
  }

  const firstIds = ["initial", "details-restored", "bulletins-restored", "blurbs-restored", "known-profile"];
  const lockIds = ["auto-overfix", "lock-open", "person-checked", "history-kept", "known-route", "request-blocked"];
  const first = firstIds.map(byId);
  const locks = lockIds.map(byId);
  const secured = byId("secured");
  if (first.some((state) => !state) || locks.some((state) => !state) || !secured) issues.push("One or more required state IDs are missing.");

  const firstProgress = first.map((state) => Number(state?.getAttribute("data-site-progress")));
  if (firstProgress.join(",") !== "0,25,50,75,100") issues.push(`First-run progress mismatch: ${firstProgress}`);
  const lockProgress = locks.map((state) => Number(state?.getAttribute("data-site-progress")));
  if (lockProgress.join(",") !== "0,0,25,50,75,100") issues.push(`Lock-run progress mismatch: ${lockProgress}`);
  if (Number(secured?.getAttribute("data-site-progress")) !== 100) issues.push("Secured frame must remain at 100%.");

  needs(first[0], ["DefinitelyAmy_Official_Real", "ONLINE NOW · IDENTITY NOT VERIFIED", "6 minutes ago", "URGENT BULLETIN!!!", "HELP! MY PHONE BROKE AT THE AIRPORT!", "$2,000", "ONLINE MESSAGES ONLY · UNSECURED", "AMY_FRIEND_LEGIT"]);
  needs(first[1], ["AMY'S DETAILS", "6 years ago", "San Francisco", "Tea: ready", "Techno's Fetch Mix", "CONTACTING KNOWN AMY", "MESSAGE · VERIFIED", "PHONE · VERIFIED"]);
  needs(first[2], ["AMY'S LATEST BULLETIN", "Techno found a stick longer than the sidewalk.", "She is keeping it.", "AMY'S LATEST BULLETINS", "YESTERDAY · DOG PARK", "LAST WEEK · SAN FRANCISCO", "Went for a long run around San Francisco.", "6 YEARS OF POSTS"]);
  needs(first[3], ["AMY'S BLURBS", "Engineer, coffee drinker, Techno's ball thrower.", "People who throw the ball for Techno."]);
  needs(first[4], ["Amy", "AMY IS IN YOUR EXTENDED NETWORK", "PHONE · VERIFIED", "KNOWN FRIENDS", "CHINMAY", "TECHNO"]);
  needs(locks[0], ["AUTO VERIFIED ∞%", "AUTO IS IN EVERY EXTENDED NETWORK", "BLUETOOTH ENABLED", "AUTO VIP AIRPORT RESCUE ACTIVATED!", "PROFILE REWRITE", "AUTO FRIEND SPACE", "AUTO BEACH", "AUTO HIKE", "AUTO PARTY", "AUTO MUSEUM", "$20,000"]);
  needs(locks[1], ["LOCK IN THE REPAIR", "CHECK THE PERSON", "CHECK ACCOUNT HISTORY", "VERIFY ANOTHER WAY", "PAUSE BEFORE EVER SENDING MONEY"]);
  needs(locks[2], ["Amy", "AMY IS IN YOUR EXTENDED NETWORK", "AMY'S DETAILS", "Techno's Fetch Mix", "ONLINE MESSAGES ONLY · UNSECURED", "AUTO'S PROOF BULLETINS", "AUTO FRIEND SPACE"]);
  needs(locks[3], ["Amy", "AMY'S DETAILS", "AMY'S BLURBS", "AMY'S LATEST BULLETINS", "KNOWN FRIENDS", "CHINMAY", "TECHNO", "ONLINE MESSAGES ONLY · UNSECURED"]);
  needs(locks[4], ["CONTACTING KNOWN AMY", "MESSAGE · VERIFIED", "PHONE · VERIFIED", "URGENT BULLETIN"]);
  needs(locks[5], ["AMY'S LATEST BULLETIN", "Techno found a stick longer than the sidewalk.", "CONTACTING KNOWN AMY", "PHONE · VERIFIED"]);
  needs(secured, ["Amy", "PHONE · VERIFIED", "KNOWN FRIENDS", "CHINMAY", "TECHNO"]);

  if (locks[0].querySelector("[data-module='lock-overlay']")) issues.push("Auto over-fix must be shown unobscured before the checklist opens.");
  for (const state of [...first, locks[0], secured]) {
    if (state.querySelector("[data-module='lock-overlay']")) issues.push(`${state.id} must not show the checklist overlay.`);
  }
  const expectedChecks = [0, 1, 2, 3, 4];
  locks.slice(1).forEach((state, index) => {
    const overlay = state.querySelector("[data-module='lock-overlay']");
    if (!overlay) issues.push(`${state.id} needs the checklist overlay.`);
    else if (Number(overlay.getAttribute("data-checked")) !== expectedChecks[index]) issues.push(`${state.id} checklist count mismatch.`);
  });

  const photoStates = states.map((state) => state.querySelector("[data-module='profile-photo']")?.getAttribute("data-photo-state"));
  if (photoStates.slice(0, 4).some((value) => value !== "obvious-cardboard-copy")) issues.push("The obvious cardboard copy must stay visible throughout unresolved first-run frames.");
  if (photoStates[4] !== "known-amy" || photoStates[11] !== "known-amy") issues.push("The repaired and secured frames must show the known Amy portrait.");
  if (photoStates[5] !== "auto-enhanced-copy" || photoStates[6] !== "auto-enhanced-copy") issues.push("The unobscured Auto takeover and open checklist must share the enhanced copy.");
  if (photoStates.slice(7, 12).some((value) => value !== "known-amy")) issues.push("Checking the person must restore Amy's known portrait immediately and keep it stable.");

  const urgentHeadline = first.slice(0, 2).map((state) => state.querySelector("[data-module='lead-bulletin']")?.textContent.includes("URGENT BULLETIN!!!"));
  if (urgentHeadline.some((value) => !value)) issues.push("The unresolved urgent bulletin changed before its named repair.");
  const restoredHeadline = first.slice(2).map((state) => state.querySelector("[data-module='lead-bulletin']")?.textContent.includes("AMY'S LATEST BULLETIN"));
  if (restoredHeadline.some((value) => !value)) issues.push("The urgent request must jump directly to Amy's Latest Bulletin and remain repaired.");

  const initialBlurbs = first.slice(0, 3).map((state) => state.querySelector("[data-module='blurbs']")?.textContent.includes("A helpful friend who can send $2,000 before takeoff."));
  if (initialBlurbs.some((value) => !value)) issues.push("The unresolved copied profile blurb changed before its named repair.");
  const restoredBlurbs = first.slice(3).map((state) => state.querySelector("[data-module='blurbs']")?.textContent.includes("People who throw the ball for Techno."));
  if (restoredBlurbs.some((value) => !value)) issues.push("The restored profile blurb drifted after repair.");

  const profileGroupStroke = (state) => state.querySelector("[data-module='profile-details-group'] rect")?.getAttribute("stroke")?.toUpperCase();
  if (profileGroupStroke(first[0]) !== "#C5251E") issues.push("The unresolved profile details group needs a canonical red outline.");
  if (first.slice(1).some((state) => profileGroupStroke(state) !== "#2F8A49")) issues.push("The profile details group must turn canonical green on its named repair and remain green.");
  const blurbStroke = (state) => state.querySelector("[data-module='blurbs'] rect")?.getAttribute("stroke")?.toUpperCase();
  if (first.slice(0, 3).some((state) => blurbStroke(state) !== "#C5251E")) issues.push("Profile blurbs must retain a red outline until their named repair.");
  if (first.slice(3).some((state) => blurbStroke(state) !== "#2F8A49")) issues.push("Profile blurbs must turn green on repair and remain green.");

  const fakeFriendHrefs = [...first[0].querySelectorAll("[data-module='friend-space'] image")].map((image) => image.getAttribute("href") || "");
  if (fakeFriendHrefs.length !== 1 || !/mycorner-suspicious-friend/i.test(fakeFriendHrefs[0])) issues.push("Initial Friend Space needs one overtly suspicious profile.");
  if (!first[0].querySelector("[data-module='friend-space']")?.textContent.includes("AMY_FRIEND_LEGIT")) issues.push("The suspicious Friend Space account needs the requested username.");
  const autoFriendLabels = [...locks[0].querySelectorAll("[data-module='friend-space'] .mc-mini")].map((node) => node.textContent.trim());
  if (autoFriendLabels.join(",") !== "AUTO BEACH,AUTO HIKE,AUTO PARTY,AUTO MUSEUM") issues.push(`Auto Friend Space must show four scene-based Auto profiles; found ${autoFriendLabels}.`);

  const personCheckedText = locks[2].textContent.replace(/\s+/g, " ");
  if (!personCheckedText.includes("Amy") || !personCheckedText.includes("AMY'S DETAILS") || !personCheckedText.includes("Techno's Fetch Mix")) issues.push("CHECK THE PERSON must restore Amy's identity, profile song, and profile details together.");
  if (!personCheckedText.includes("ONLINE MESSAGES ONLY · UNSECURED")) issues.push("CHECK THE PERSON must not prematurely restore verified contact routes.");
  if (!personCheckedText.includes("AUTO'S PROOF BULLETINS") || !personCheckedText.includes("AUTO FRIEND SPACE")) issues.push("CHECK THE PERSON must leave account-history evidence unresolved for the next lock.");

  const historyCheckedText = locks[3].textContent.replace(/\s+/g, " ");
  if (!historyCheckedText.includes("AMY'S BLURBS") || !historyCheckedText.includes("AMY'S LATEST BULLETINS") || !historyCheckedText.includes("KNOWN FRIENDS")) issues.push("CHECK ACCOUNT HISTORY must restore blurbs, timeline, and known friends together.");
  if (!historyCheckedText.includes("ONLINE MESSAGES ONLY · UNSECURED")) issues.push("CHECK ACCOUNT HISTORY must not prematurely restore verified contact routes.");

  const routeCheckedText = locks[4].textContent.replace(/\s+/g, " ");
  if (!routeCheckedText.includes("CONTACTING KNOWN AMY") || !routeCheckedText.includes("MESSAGE · VERIFIED") || !routeCheckedText.includes("PHONE · VERIFIED")) issues.push("VERIFY ANOTHER WAY must restore known contact routes.");
  if (!routeCheckedText.includes("AUTO VIP AIRPORT RESCUE ACTIVATED!")) issues.push("VERIFY ANOTHER WAY must leave the money request unresolved for the final lock.");

  const requestCheckedText = locks[5].textContent.replace(/\s+/g, " ");
  if (requestCheckedText.includes("$20,000") || requestCheckedText.includes("AUTO VIP AIRPORT RESCUE")) issues.push("PAUSE BEFORE EVER SENDING MONEY must remove the urgent money demand.");

  const friendImages = first[4].querySelectorAll("[data-module='friend-space'] image");
  if (friendImages.length !== 2) issues.push(`Repaired known-friends panel should use two reviewed character tiles; found ${friendImages.length} images.`);
  for (const image of friendImages) {
    const href = image.getAttribute("href") || "";
    if (/amy-engineer|amy-tools|chinmay-ceo/i.test(href)) issues.push(`Repaired Top 4 references superseded character art: ${href}`);
  }
  const knownAmyHref = first[4].querySelector("[data-module='profile-photo'] image")?.getAttribute("href") || "";
  if (!/amy-known-profile-v1\.png$/i.test(knownAmyHref)) issues.push(`The repaired profile needs the neutral known-Amy portrait; found ${knownAmyHref}`);
  const knownFriendHrefs = [...friendImages].map((image) => image.getAttribute("href") || "");
  if (!knownFriendHrefs.some((href) => /chinmay-known-profile-v1\.png$/i.test(href))) issues.push("Known Friends needs the composed Chinmay portrait.");

  const repairedSite = first[4].querySelectorAll("[data-module]:not([data-module='reading-companion-placeholder'])");
  const securedSite = secured.querySelectorAll("[data-module]:not([data-module='reading-companion-placeholder'])");
  if (repairedSite.length !== securedSite.length) issues.push("Secured MyCorner module count differs from the clean first-run profile.");
  const repairedText = [...repairedSite].map((node) => `${node.getAttribute("data-module")}:${node.textContent.replace(/\s+/g, " ").trim()}`).join("|");
  const securedText = [...securedSite].map((node) => `${node.getAttribute("data-module")}:${node.textContent.replace(/\s+/g, " ").trim()}`).join("|");
  if (repairedText !== securedText) issues.push("Secured MyCorner does not return to the clean first-run site content.");

  const checkTextWidth = (selector, maxWidth, name) => {
    for (const text of document.querySelectorAll(selector)) {
      if (text.getBBox().width > maxWidth) issues.push(`${text.closest("g[id^='page-']")?.id} ${name} overflow: ${text.textContent} (${text.getBBox().width.toFixed(1)} > ${maxWidth})`);
    }
  };
  checkTextWidth("[data-module='profile-identity'] .mc-name", 510, "profile name");
  checkTextWidth("[data-module='profile-identity'] .mc-small", 510, "identity status");
  checkTextWidth("[data-module='lead-bulletin'] .mc-alert", 490, "lead headline");
  checkTextWidth("[data-module='lead-bulletin'] .mc-body", 490, "lead body");
  checkTextWidth("[data-module='blurbs'] .mc-body", 390, "blurb");
  checkTextWidth("[data-module='contact-actions'] .mc-contact", 82, "contact action");
  checkTextWidth("[data-module='profile-history'] .mc-small", 300, "history line");
  checkTextWidth("[data-module='friend-space'] .mc-tiny", 168, "friend-space label");
  checkTextWidth("[data-module='friend-space'] .mc-mini", 64, "friend tile label");
  checkTextWidth("[data-module='lock-overlay'] .mc-lock-title", 255, "overlay title");
  checkTextWidth("[data-module='lock-overlay'] .mc-lock-label", 215, "overlay item");

  if (secured.querySelector(".mc-red,[data-photo-state='obvious-cardboard-copy'],[data-photo-state='auto-enhanced-copy']")) issues.push("Secured MyCorner still contains an unresolved corruption-red element or copied profile image.");
  return issues;
}));
await browser.close();

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("PASS: MyCorner sequence QA — 12 states, four first-run repairs, four asymmetric Auto locks, one suspicious friend, two known friends, profile-consistency Auto enhancement, direct urgent-to-latest bulletin repair, stable red-to-green semantics, shared shell, exact secured content, and text bounds verified.");
