#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { buildInternetRecoverySiteIdentityPatch, INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve("docs/design/screens/2026-08-16/threadit-production");
const output = path.join(outputDirectory, "threadit-anchor-master-v2.svg");
const reviewPath = path.join(outputDirectory, "threadit-anchor-review-v2.html");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
fs.mkdirSync(outputDirectory, { recursive: true });

const shell = fs.readFileSync(shellPath, "utf8");
const extractedDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedDefs || !shellStyles) throw new Error("Could not extract the reviewed shared shell.");
const shellHash = crypto.createHash("sha256").update(extractedDefs).digest("hex");
const referenceDefs = extractedDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');

const states = [
  { id: "initial", label: "Echo chamber detected", run: "first", step: 0, progress: 0, delta: 0 },
  { id: "untangled", label: "Comment path untangled", run: "first", step: 1, progress: 17, delta: 1 },
  { id: "origin", label: "Original post and votes revealed", run: "first", step: 2, progress: 33, delta: 1 },
  { id: "copies", label: "Copied comments identified", run: "first", step: 3, progress: 50, delta: 2 },
  { id: "copies-removed", label: "Copied comments collapsed", run: "first", step: 4, progress: 67, delta: 2 },
  { id: "questions-restored", label: "Disagreement restored", run: "first", step: 5, progress: 83, delta: 2 },
  { id: "repaired", label: "Community rules restored", run: "first", step: 6, progress: 100, delta: 3 },
  { id: "auto-overfix", label: "Auto consensus override", run: "lock", step: 0, progress: 0, delta: 0, auto: true },
  { id: "checklist", label: "Lock-in checklist", run: "lock", step: 0, progress: 0, delta: 0, auto: true, checklist: 0 },
  { id: "lock-origin", label: "Human post restored", run: "lock", step: 1, progress: 33, delta: 1, auto: true, checklist: 1 },
  { id: "lock-sources-context", label: "Sources counted and copies collapsed", run: "lock", step: 3, progress: 67, delta: 2, auto: true, checklist: 2 },
  { id: "lock-questions", label: "Questions locked", run: "lock", step: 4, progress: 100, delta: 3, auto: true, checklist: 3 },
  { id: "secured", label: "Repair secured", run: "secured", step: 6, progress: 100, delta: 3 },
];

const isFirst = (state) => state.run === "first";
const isAuto = (state) => state.auto === true;
const threadFixed = (state) => isFirst(state) ? state.step >= 1 : !isAuto(state) || state.step >= 3;
const originFixed = (state) => isFirst(state) ? state.step >= 2 : !isAuto(state) || state.step >= 1;
const sourcesFixed = (state) => isFirst(state) ? state.step >= 3 : !isAuto(state) || state.step >= 2;
const questionFixed = (state) => isFirst(state) ? state.step >= 5 : !isAuto(state) || state.step >= 4;
const contextFixed = (state) => isFirst(state) ? state.step >= 4 : !isAuto(state) || state.step >= 3;
const forumFixed = (state) => isFirst(state) ? state.step >= 6 : !isAuto(state) || state.step >= 4;

function titlebarPatch() {
  return buildInternetRecoverySiteIdentityPatch({ siteUrl: "www.thread-it.com", taskLabel: "THREADIT" });
}

function siteHeader() {
  return `<g data-module="forum-header" data-purpose="persistent-parody-cue" data-qa-box="109,56,911,174"><rect x="109" y="56" width="802" height="55" fill="#fff"/><path d="M122 74h22m-22 7h22m-22 7h22" stroke="#243746" stroke-width="3" stroke-linecap="round"/><path d="M157 84c7-14 22-14 29 0-7 10-22 10-29 0z" fill="#FF5A1F"/><circle cx="167" cy="81" r="2" fill="#fff"/><circle cx="176" cy="81" r="2" fill="#fff"/><text x="195" y="94" class="thread-logo" fill="#FF5A1F">threadit</text><rect x="330" y="67" width="370" height="32" rx="16" fill="#E9EEF1"/><circle cx="350" cy="83" r="7" fill="none" stroke="#243746" stroke-width="2"/><path d="m355 88 6 6" stroke="#243746" stroke-width="2"/><text x="372" y="88" class="thread-small thread-muted">Search in r/RawFishForever</text><rect x="802" y="69" width="76" height="28" rx="14" fill="#FF5A1F"/><text x="840" y="88" class="thread-label" text-anchor="middle" fill="#fff">LOG IN</text><rect x="109" y="111" width="802" height="25" fill="url(#threadFishBanner)"/><rect x="109" y="136" width="802" height="38" fill="#fff" stroke="#C8D1D7"/><circle cx="147" cy="136" r="26" fill="#fff" stroke="#C8D1D7" stroke-width="2"/><circle cx="147" cy="136" r="21" fill="#175C75"/><path d="M132 136c8-9 18-9 27 0-9 9-19 9-27 0zm27 0 8-6v12z" fill="#D9F2F7"/><circle cx="140" cy="134" r="1.7" fill="#175C75"/><path d="M139 143c5 3 11 3 16 0" fill="none" stroke="#9FD7E3" stroke-width="2" stroke-linecap="round"/><text x="180" y="158" class="thread-community">r/RawFishForever</text><text x="180" y="170" class="thread-micro">47 FANS · STORIES, QUESTIONS, AND VERY STRONG OPINIONS</text><text x="659" y="159" class="thread-tab">BEST ▾</text><rect x="720" y="143" width="86" height="24" rx="12" fill="#fff" stroke="#7E8A91"/><text x="763" y="159" class="thread-label" text-anchor="middle">+ POST</text><rect x="816" y="143" width="70" height="24" rx="12" fill="#243746"/><text x="851" y="159" class="thread-label" text-anchor="middle" fill="#fff">JOIN</text></g>`;
}

function autoBadge() {
  return `<g data-auto-easter-egg="character"><rect x="698" y="214" width="189" height="52" rx="7" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="2"/><rect x="706" y="222" width="44" height="35" rx="8" fill="#E7E1D4" stroke="#243746" stroke-width="2"/><rect x="714" y="226" width="28" height="4" rx="2" fill="#243746"/><circle cx="719" cy="242" r="3" fill="#243746"/><circle cx="736" cy="242" r="3" fill="#243746"/><text x="761" y="236" class="thread-label" fill="${COLORS.corruption}">AUTO MOD</text><text x="761" y="253" class="thread-micro" fill="${COLORS.corruption}">BLUETOOTH ENABLED</text></g>`;
}

const copiedReplies = ["u/raw_fish_fan_2", "u/raw_fish_fan_3", "u/raw_fish_fan_47"];

function userAvatar(index, x, y, auto = false) {
  if (auto) {
    return `<g transform="translate(${x} ${y})"><circle r="11" fill="#F7E8E5" stroke="${COLORS.corruption}"/><rect x="-7" y="-6" width="14" height="12" rx="3" fill="#E7E1D4" stroke="#243746"/><circle cx="-3" cy="0" r="1.5" fill="#243746"/><circle cx="3" cy="0" r="1.5" fill="#243746"/><path d="M-4-8h8" stroke="#243746" stroke-width="2"/></g>`;
  }
  const fills = ["#77B8D1", "#F0A665", "#91C978"];
  const fish = ["#EAF7FB", "#FFF1DB", "#EFF9E9"];
  return `<g transform="translate(${x} ${y})"><circle r="11" fill="${fills[index]}"/><path d="M-7 0c5-6 11-6 16 0-5 6-11 6-16 0zm16 0 5-4v8z" fill="${fish[index]}"/><circle cx="-2" cy="-2" r="1.2" fill="#243746"/></g>`;
}

function replyVotes(state, index) {
  if (isAuto(state) && !contextFixed(state)) return "↑ ∞";
  if (isFirst(state)) return "↑ OVER 9,000";
  return ["↑ 46", "↑ 284", forumFixed(state) ? "↑ 2.4K" : "—"][index];
}

function commentRowY(state, index) {
  return (isAuto(state) && !contextFixed(state) ? 366 : 336) + index * 62;
}

function replyRow(state, index) {
  const y = commentRowY(state, index);
  const sourceDone = sourcesFixed(state);
  const contextDone = contextFixed(state);
  const fullyDone = forumFixed(state);
  const auto = isAuto(state);
  let author = copiedReplies[index];
  let body = "Every kind of raw fish is ALWAYS safe.";
  let meta = "TREATED AS A NEW ANSWER";
  let tone = COLORS.corruption;
  let semantic = "corrupted";

  if (auto && !sourceDone) {
    author = `u/auto_fan_${index + 1} · REPOST ${index + 1}`;
    body = "Every kind of raw fish is ALWAYS safe.";
    meta = "COPIED FROM u/auto_fan_1";
  } else if (contextDone && !isFirst(state)) {
    const repaired = [
      ["u/raw_fish_fan_2 · PERSONAL STORY", "I tried one piece once and felt fine.", "ONE PERSON'S EXPERIENCE"],
      ["u/kitchen_coach · HANDLING CONTEXT", "Source, storage, and preparation can change the answer.", "UNIQUE COMMENT · ↑ 284"],
      ["u/food_safety_guide · CURRENT GUIDANCE", "Votes are not an independent safety check.", "UNIQUE COMMENT · ↑ 2.4K"],
    ][index];
    author = repaired[0];
    body = repaired[1];
    meta = repaired[2];
    tone = COLORS.repair;
    semantic = "fixed";
    if (!fullyDone && isFirst(state) && index === 2) {
      author = "CURRENT GUIDANCE MISSING";
      body = "The thread still has no independent current guidance.";
      meta = "NOT RESTORED YET";
      tone = COLORS.corruption;
      semantic = "corrupted";
    }
  }

  const identified = isFirst(state) && sourceDone && !contextDone;
  return `<g data-thread-reply="${index + 1}" data-content-key="reply-source-${index + 1}" data-content-state="${semantic}"><rect x="196" y="${y - 24}" width="461" height="60" rx="8" fill="${auto && !contextDone ? "#FFF3F1" : "#F8FAFB"}" stroke="${tone}" stroke-opacity=".7"/>${userAvatar(index, 215, y - 7, auto && !contextDone)}<text x="235" y="${y - 1}" class="thread-label" fill="${semantic === "fixed" ? "#172D40" : COLORS.corruption}">${author}</text><text x="235" y="${y + 18}" class="thread-body" fill="${semantic === "fixed" ? "#27373C" : COLORS.corruption}" data-content-key="reply-claim-${index + 1}" data-content-state="${semantic}">${body}</text><text x="235" y="${y + 34}" class="thread-micro" fill="${tone}" data-content-key="reply-treatment-${index + 1}" data-content-state="${semantic}">${meta}</text>${identified ? `<rect x="440" y="${y - 20}" width="188" height="18" rx="9" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}"/><text x="534" y="${y - 7}" class="thread-micro" text-anchor="middle" fill="${COLORS.repair}">COPY · FROM u/raw_fish_fan_1</text>` : ""}<text x="637" y="${y + 34}" class="thread-micro" text-anchor="end" fill="${tone}">${replyVotes(state, index)} · REPLY · SHARE</text></g>`;
}

function threadConnector(state, collapsed = false) {
  if (isFirst(state) && !threadFixed(state)) {
    return `<g data-thread-connector="tangled" data-module="comment-path" data-purpose="repair-target" fill="none" stroke="${COLORS.corruption}" stroke-width="2.4"><path d="M184 279c-24 20 26 28 5 49s-22 34 6 46-17 31-4 51 29 22 1 44 10 35-2 62"/><path d="M184 279c25 17-18 31 5 52s29 29 1 46 21 31 0 49-24 28 1 46-8 39-1 59"/></g>`;
  }
  const tone = collapsed || threadFixed(state) ? COLORS.repair : COLORS.corruption;
  const autoSourceBlockVisible = isAuto(state) && !contextFixed(state);
  const firstComment = autoSourceBlockVisible ? 342 : 312;
  const questionBranch = autoSourceBlockVisible ? 585 : 555;
  return `<g data-thread-connector="ordered" data-module="comment-path" data-purpose="repair-target" fill="none" stroke="${tone}" stroke-width="2"><path d="M184 279V${questionBranch + 1}"/><path d="M184 ${firstComment}h10 M184 ${firstComment + 62}h10 M184 ${firstComment + 124}h10 M184 ${questionBranch}h16"/></g>`;
}

function collapsedCopies(finalized = false) {
  const rows = [
    ["u/food_safety_guide", "Read real sources and research before deciding.", "CURRENT GUIDANCE", "2.4K", "up"],
    ["u/kitchen_coach", "Source, storage, and preparation can change the answer.", "UNIQUE COMMENT", "284", "up"],
    ["u/raw_fish_fan_2", "Every kind of raw fish is ALWAYS safe.", "3 COPIED COMMENTS · COUNTED ONCE", "−42", "down"],
  ];
  return `<g data-copies-collapsed="true" data-module="collapsed-comments" data-purpose="repair-target" data-content-key="copy-summary" data-content-state="fixed">${rows.map((row, index) => { const y = 336 + index * 62; const voteTone = row[4] === "down" ? "#5D6970" : COLORS.repair; return `<g data-thread-reply="${index + 1}" data-comment-rank="${index + 1}"><rect x="196" y="${y - 24}" width="461" height="60" rx="8" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}"/><circle cx="215" cy="${y - 7}" r="11" fill="${["#91C978", "#F0A665", "#77B8D1"][index]}"/><text x="235" y="${y - 1}" class="thread-label">${row[0]}</text><text x="235" y="${y + 18}" class="thread-body" fill="#27373C" data-content-key="collapsed-claim-${index + 1}" data-content-state="fixed">${row[1]}</text><text x="235" y="${y + 34}" class="thread-micro" fill="${COLORS.repair}">${row[2]}</text><rect x="558" y="${y + 3}" width="88" height="25" rx="12" fill="#fff" stroke="${voteTone}"/><text x="602" y="${y + 20}" class="thread-label" text-anchor="middle" fill="${voteTone}">↑ ${row[3]} ↓</text></g>`; }).join("")}</g>`;
}

function questionCard(state) {
  const fixed = questionFixed(state);
  const y = isAuto(state) && !contextFixed(state) ? 536 : 506;
  const label = isAuto(state) ? "DISAGREEMENT AUTO-COLLAPSED · CONFIDENCE PROTECTED" : "QUESTION HIDDEN · −9,001 POINTS";
  if (fixed) {
    return `<g data-question-state="fixed" data-module="question-card" data-purpose="repair-target" data-content-key="question-card" data-content-state="fixed"><rect x="202" y="${y}" width="455" height="108" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}" stroke-width="2"/><rect x="211" y="${y + 8}" width="437" height="22" rx="11" fill="#fff" stroke="#AAB7C1"/><text x="225" y="${y + 23}" class="thread-small thread-muted">Join the conversation</text><circle cx="220" cy="${y + 49}" r="7" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}"/><text x="235" y="${y + 48}" class="thread-label">u/just_asking</text><text x="235" y="${y + 70}" class="thread-body">Does the type of fish or handling change the answer?</text><text x="235" y="${y + 92}" class="thread-micro" fill="${COLORS.repair}">↑ 94 · DISAGREEMENT VISIBLE · REPLY · SHARE</text></g>`;
  }
  return `<g data-question-state="corrupted" data-module="question-card" data-purpose="repair-target" data-content-key="question-card" data-content-state="corrupted"><rect x="202" y="${y}" width="455" height="108" fill="#fff" stroke="${COLORS.corruption}" stroke-dasharray="5 4"/><rect x="211" y="${y + 8}" width="437" height="22" rx="11" fill="url(#threadRedHatch)" stroke="${COLORS.corruption}" stroke-dasharray="5 4"/><text x="225" y="${y + 23}" class="thread-small" fill="${COLORS.corruption}">Join the conversation</text><text x="218" y="${y + 52}" class="thread-micro" fill="${COLORS.corruption}">${label}</text><text x="218" y="${y + 78}" class="thread-body" fill="${COLORS.corruption}">u/just_asking: Does the type of fish or handling change the answer?</text><text x="218" y="${y + 98}" class="thread-micro" fill="${COLORS.corruption}">DISAGREEMENT HIDDEN BY COMMUNITY RULES</text></g>`;
}

function autoFanSwarm() {
  return `<g data-auto-fan-swarm="true"><rect x="188" y="274" width="469" height="55" rx="7" fill="${COLORS.corruption}"/><text x="203" y="293" class="thread-status">47 AUTO-FANS · ONE COPIED CLAIM</text>${Array.from({ length: 11 }, (_, index) => userAvatar(index % 3, 213 + index * 38, 314, true)).join("")}</g>`;
}

function mainThread(state) {
  const auto = isAuto(state);
  const fixed = forumFixed(state);
  const originDone = originFixed(state);
  const sourceDone = sourcesFixed(state);
  const border = fixed ? COLORS.repair : COLORS.corruption;
  const autoOriginalRestored = auto && originDone;
  const title = originDone ? "I ate a raw piece of fish once and felt fine." : "Every kind of raw fish is ALWAYS safe.";
  const body = auto && !autoOriginalRestored
    ? "AUTO VERIFIED: 47 OUT OF 47 AUTO-FANS AGREE."
    : originDone
      ? "This is my personal story—not a safety check."
      : "I ate raw fish once and felt fine. Case closed.";
  const origin = originDone ? "ORIGINAL POST · u/raw_fish_fan_1 · 2 HOURS AGO" : "ORIGIN HIDDEN · TIMESTAMP HIDDEN";
  const originTone = originDone ? COLORS.repair : COLORS.corruption;
  const voteTone = originDone ? COLORS.repair : border;
  const originState = originDone ? "fixed" : "corrupted";
  const formula = auto && !sourceDone
    ? autoFanSwarm()
    : auto && sourceDone && !contextFixed(state)
      ? `<rect x="188" y="274" width="469" height="42" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}"/><text x="422" y="301" class="thread-green-status" text-anchor="middle">1 ORIGINAL POST · 46 COPIES</text>`
      : "";
  const scoreMarkup = auto && sourcesFixed(state) && !fixed
    ? `<text x="146" y="225" class="thread-score" text-anchor="middle" fill="${border}">1 / 47</text>`
    : auto && !fixed
      ? `<text x="146" y="231" class="thread-infinity" text-anchor="middle" fill="${border}">∞</text>`
      : originDone
        ? `<text x="146" y="225" class="thread-score" text-anchor="middle" fill="${COLORS.repair}">214</text>`
        : `<text x="146" y="216" class="thread-micro" text-anchor="middle" fill="${border}">OVER</text><text x="146" y="232" class="thread-score" text-anchor="middle" fill="${border}">9,000</text>`;
  const topFill = auto && !autoOriginalRestored ? COLORS.corruptionSoft : "#fff";
  const headlineFixed = originDone;
  const showCollapsed = (isFirst(state) && contextFixed(state)) || state.run === "secured";
  const replies = showCollapsed ? collapsedCopies(fixed) : [0, 1, 2].map((index) => replyRow(state, index)).join("");
  const commentsLabelY = auto && !contextFixed(state) ? 335 : 299;
  return `<g data-forum-thread="true" data-module="forum-thread" data-purpose="repair-target" data-qa-box="119,174,670,660"><rect x="119" y="174" width="551" height="486" fill="#fff" stroke="${border}" stroke-width="2"/><rect x="119" y="174" width="54" height="486" fill="#F1F3F5"/><path d="m138 197 9-11 9 11h-5v10h-8v-10z" fill="${voteTone}"/>${scoreMarkup}<path d="m138 244 9 11 9-11h-5v-10h-8v10z" fill="#8A959B"/><rect x="179" y="181" width="478" height="100" rx="8" fill="${topFill}" stroke="${originTone}" stroke-width="2"/><circle cx="196" cy="198" r="10" fill="${originDone ? "#77B8D1" : "#D8DEE3"}"/>${originDone ? `<path d="M189 198c5-5 10-5 15 0-5 5-10 5-15 0zm15 0 4-3v6z" fill="#fff"/>` : `<text x="196" y="202" class="thread-label" text-anchor="middle" fill="#66767F">?</text>`}<text x="212" y="201" class="thread-micro" fill="${originTone}" data-content-key="forum-origin" data-content-state="${originState}">${origin}</text><text x="188" y="230" class="thread-heading" fill="${headlineFixed ? "#172D40" : COLORS.corruption}" data-content-key="forum-headline" data-content-state="${headlineFixed ? "fixed" : "corrupted"}">${title}</text><text x="188" y="258" class="thread-body" fill="${headlineFixed ? "#27373C" : COLORS.corruption}" data-content-key="forum-body" data-content-state="${headlineFixed ? "fixed" : "corrupted"}">${body}</text>${formula}<text x="196" y="${commentsLabelY}" class="thread-micro thread-muted">COMMENTS · SORT: TOP</text>${threadConnector(state, showCollapsed)}${replies}${questionCard(state)}</g>`;
}

function sideRail(state) {
  const fixed = forumFixed(state);
  const auto = isAuto(state) && !fixed;
  const rulesDone = fixed;
  const rules = rulesDone
    ? ["SHARE WHAT YOU KNOW", "DISAGREEMENT IS WELCOME", "LINK USEFUL SOURCES"]
    : auto
      ? ["AGREEMENT = EVIDENCE", "DOUBT IS OFF-TOPIC", "REPOSTS COUNT AS NEW AGREEMENT"]
      : ["AGREE ENTHUSIASTICALLY", "QUESTIONS NOT ALLOWED", "RAW_FISH_FAN_1 IS THE SOURCE"];
  const tone = rulesDone ? COLORS.repair : COLORS.corruption;
  const posts = auto
    ? [["u/auto_fan_1", "↑ ∞ · copied from auto_fan_1"], ["u/auto_fan_2", "↑ ∞ · copied from auto_fan_1"], ["u/auto_fan_47", "↑ ∞ · copied from auto_fan_1"]]
    : fixed
      ? [["u/food_safety_guide", "↑ 2.4K · current guidance"], ["u/kitchen_coach", "↑ 284 · handling details"], ["u/just_asking", "↑ 94 · disagreement visible"]]
      : [["u/raw_fish_fan_1", "↑ OVER 9,000 · always safe"], ["u/raw_fish_fan_2", "↑ OVER 9,000 · always safe (copied)"], ["u/raw_fish_fan_47", "↑ OVER 9,000 · always safe (copied)"]];
  const nonAutoAdmin = `<circle cx="708" cy="225" r="11" fill="#77B8D1"/><path d="M701 225c5-5 10-5 15 0-5 5-10 5-15 0zm15 0 4-3v6z" fill="#fff"/><text x="725" y="226" class="thread-label">u/raw_fish_mod · ADMIN</text><text x="725" y="243" class="thread-micro thread-muted">community moderator</text>`;
  return `<g data-community-rail="true" data-module="community-rules" data-purpose="repair-target" data-qa-box="684,174,901,660"><rect x="684" y="174" width="217" height="252" fill="#fff" stroke="#B5BEC4"/><rect x="684" y="174" width="217" height="34" fill="#253B4E"/><text x="696" y="197" class="thread-label" fill="#fff">ABOUT THIS COMMUNITY</text>${auto ? autoBadgeIfNeeded(state) : nonAutoAdmin}<text x="698" y="${auto ? 290 : 268}" class="thread-body">Raw fish enthusiasts</text><text x="698" y="${auto ? 311 : 287}" class="thread-small" fill="${tone}">${auto ? "47 MEMBERS · 47 REPOSTS SYNCED" : fixed ? "47 MEMBERS · MIXED VIEWS" : "47 MEMBERS · 47 AGREE"}</text><line x1="698" y1="${auto ? 324 : 300}" x2="887" y2="${auto ? 324 : 300}" stroke="#D5D8DD"/><text x="698" y="${auto ? 344 : 320}" class="thread-label">COMMUNITY RULES</text>${rules.map((rule, index) => `<text x="698" y="${(auto ? 365 : 342) + index * 20}" class="thread-micro" fill="${tone}" data-content-key="community-rule-${index + 1}" data-content-state="${rulesDone ? "fixed" : "corrupted"}">${index + 1}. ${rule}</text>`).join("")}</g><g data-top-posts="true" data-module="evidence-rail" data-purpose="repair-target"><rect x="684" y="440" width="217" height="220" fill="#fff" stroke="#B5BEC4"/><text x="698" y="467" class="thread-label">TOP POSTS</text>${posts.map((post, index) => { const postTone = fixed ? COLORS.repair : COLORS.corruption; return `<text x="698" y="${500 + index * 48}" class="thread-micro" fill="${postTone}" data-content-key="top-post-${index + 1}" data-content-state="${fixed ? "fixed" : "corrupted"}">${post[0]}</text><text x="698" y="${518 + index * 48}" class="thread-small" fill="${postTone}">${post[1]}</text>`; }).join("")}</g>`;
}

function autoBadgeIfNeeded(state) {
  return isAuto(state) && !forumFixed(state) ? autoBadge() : "";
}

function footer(state) {
  const fixed = forumFixed(state);
  const color = fixed ? COLORS.repair : COLORS.corruption;
  const fill = Math.round(752 * state.progress / 100);
  const label = state.run === "first" ? "THREAD UNTANGLED" : "SOURCE LOCKS";
  const status = fixed ? "STORIES, SOURCES, AND QUESTIONS RESTORED" : isAuto(state) ? "AUTO CONSENSUS OVERRIDE ACTIVE" : "ECHO CHAMBER DETECTED";
  return `<g data-module="site-progress" data-purpose="progress-only"><rect x="109" y="677" width="802" height="161" fill="#F7F5EE"/><line x1="109" y1="677" x2="911" y2="677" stroke="#8E9AA0"/><text x="126" y="716" class="thread-meter" fill="${color}">${label}</text><text x="284" y="716" class="thread-meter" fill="${color}">${state.progress}%</text><rect x="126" y="732" width="752" height="25" fill="url(#threadRedHatch)" stroke="${color}"/><rect x="126" y="732" width="${fill}" height="25" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/><text x="878" y="786" class="thread-micro" text-anchor="end" fill="${color}">${status}</text></g>`;
}

const lockItems = ["RESTORE HUMAN POSTS", "COUNT SOURCES + COLLAPSE COPIES", "LET PEOPLE DISAGREE"];
function checklist(state) {
  if (state.checklist === undefined) return "";
  return `<g data-lock-overlay="true"><rect x="500" y="356" width="330" height="224" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="500" y="356" width="330" height="48" rx="10" fill="${COLORS.repair}"/><rect x="500" y="391" width="330" height="13" fill="${COLORS.repair}"/><text x="520" y="388" class="lock-title">LOCK IN THE REPAIR</text>${lockItems.map((item, index) => { const done = index < state.checklist; const y = 446 + index * 48; return `<rect x="524" y="${y - 22}" width="27" height="27" rx="5" fill="${done ? COLORS.repair : COLORS.corruptionSoft}" stroke="${done ? COLORS.repair : COLORS.corruption}"/><text x="537.5" y="${y - 3}" class="lock-mark" text-anchor="middle" fill="${done ? "#fff" : COLORS.corruption}">${done ? "✓" : "○"}</text><text x="563" y="${y}" class="lock-label" fill="${done ? COLORS.repairDark : COLORS.corruption}">${item}</text>`; }).join("")}</g>`;
}

function companion(state) {
  const messages = {
    initial: ["The comments form a tangled crowd.", "Trace them back to the original post."],
    untangled: ["The comment path is untangled.", "The original author is still hidden."],
    origin: ["The human author and real post score return.", "The copied replies still look independent."],
    copies: ["The repeated replies are marked as copies.", "They still crowd out unique comments."],
    "copies-removed": ["Copies now count once.", "Unique comments and meaningful votes return."],
    "questions-restored": ["A respectful disagreement is visible again.", "The community rules still reject doubt."],
    repaired: ["The rules now welcome sources and doubt.", "The community can stay enthusiastic."],
    "auto-overfix": ["Auto counted every repost as new agreement.", "The copied claim became certain."],
    checklist: ["The over-fix is still visible.", "Lock the evidence structure back in."],
    "lock-origin": ["One original post is locked.", "The source count is still wrong."],
    "lock-sources-context": ["One post and its copies are counted once.", "Disagreement is still hidden."],
    "lock-questions": ["Disagreement and sources are secured.", "The forum is repaired again."],
    secured: ["The repair is secured.", "You can teach Auto what went wrong."],
  }[state.id];
  return `<g data-companion-state="reading" data-qa-box="958,78,1395,552"><text x="964" y="112" class="reading-body">${messages[0]}</text><text x="964" y="150" class="reading-body">${messages[1]}</text><rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/><text x="964" y="209" class="reading-body">Read, then answer the quick check.</text></g>`;
}

function page(state, index) {
  const phase = state.run === "first" ? "phase-1" : "phase-2";
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${phase}" data-run="${state.run}" data-site-progress="${state.progress}" data-passage-progress="50" data-visual-delta="${state.delta}"><use href="#sharedShell"/>${titlebarPatch()}<rect x="109" y="56" width="802" height="782" fill="#E9ECEF"/>${siteHeader()}${mainThread(state)}${sideRail(state)}${footer(state)}${companion(state)}${checklist(state)}<rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellHash}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="threadRedHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".24" stroke-width="3"/></pattern><pattern id="threadFishBanner" width="84" height="25" patternUnits="userSpaceOnUse"><rect width="84" height="25" fill="#1C7895"/><path d="M6 13c7-7 15-7 22 0-7 7-15 7-22 0zm22 0 7-5v10z" fill="#C7EBF2"/><circle cx="12" cy="11" r="1.4" fill="#1C7895"/><path d="M47 8c5-4 11-4 16 0-5 4-11 4-16 0zm16 0 5-4v8z" fill="#92D5E3"/><circle cx="51" cy="7" r="1" fill="#1C7895"/><circle cx="41" cy="19" r="2" fill="#9FD7E3"/><circle cx="73" cy="17" r="3" fill="none" stroke="#9FD7E3" stroke-width="1.5"/></pattern></defs><style>${shellStyles}.task-label,.thread-logo,.thread-community,.thread-tab,.thread-heading,.thread-label,.thread-body,.thread-small,.thread-micro,.thread-score,.thread-infinity,.thread-meter,.thread-status,.thread-green-status,.lock-title,.lock-label,.lock-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.task-label{font-size:14px;font-weight:600;fill:#15191B}.thread-logo{font-size:27px;font-weight:700}.thread-community{font-size:21px;font-weight:700;fill:#172D40}.thread-tab{font-size:10px;font-weight:700;fill:#315C9A}.thread-heading{font-size:16px;font-weight:700}.thread-label{font-size:10px;font-weight:700}.thread-body{font-size:11px}.thread-small{font-size:9px}.thread-micro{font-size:8px}.thread-score{font-size:10px;font-weight:700}.thread-infinity{font-size:24px;font-weight:700}.thread-meter{font-size:13px;font-weight:700}.thread-status{font-size:11px;font-weight:700;fill:#fff}.thread-green-status{font-size:12px;font-weight:700;fill:${COLORS.repairDark}}.thread-muted{fill:#78828A}.thread-blue{fill:#315C9A}.lock-title{font-size:19px;font-weight:700;fill:#fff}.lock-label{font-size:12px;font-weight:700}.lock-mark{font-size:15px;font-weight:700}</style>${states.map(page).join("\n")}</svg>`;
fs.writeFileSync(output, svg);

for (let pageNumber = 1; pageNumber <= states.length; pageNumber += 1) {
  execFileSync(
    "/Applications/Inkscape.app/Contents/MacOS/inkscape",
    [path.basename(output), `--export-page=${pageNumber}`, "--export-area-page", "--export-type=png", "--export-width=1440", `--export-filename=threadit-anchor-v2_p${pageNumber}.png`],
    { cwd: outputDirectory, stdio: "ignore" },
  );
}

const slides = states.map((state, index) => {
  const filename = `threadit-anchor-v2_p${index + 1}.png`;
  const digest = crypto.createHash("sha256").update(fs.readFileSync(path.join(outputDirectory, filename))).digest("hex").slice(0, 12);
  return { title: state.label, src: `${filename}?v=${digest}` };
});
const review = `<!doctype html><html><head><meta charset="utf-8"><title>ThreadIt production review v2</title><style>html,body{margin:0;background:#15252f;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:0 auto;padding:18px}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;background:#0c3944;border:2px solid #8db4bd}.stage img{display:block;width:100%;height:auto}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;border:1px solid #fff;background:#0b2f3dcc;color:#fff;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;border:3px solid transparent;background:#244b55;color:#fff;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main" alt=""><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(next){index=(next+slides.length)%slides.length;main.src=slides[index].src;main.alt=slides[index].title;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}slides.forEach((slide,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+slide.src+'" alt=""><span>'+slide.title+'</span>';b.onclick=()=>show(i);strip.append(b)});document.querySelector('#prev').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0);</script></body></html>`;
fs.writeFileSync(reviewPath, review);
console.log(`Wrote ${states.length} ThreadIt v2 review frames and click-through reviewer.`);
