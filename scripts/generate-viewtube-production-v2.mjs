#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { buildInternetRecoverySiteIdentityPatch, INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve("docs/design/screens/2026-08-17/viewtube-production");
const assetDirectory = path.join(outputDirectory, "assets");
const output = path.join(outputDirectory, "viewtube-anchor-master-v2.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
fs.mkdirSync(assetDirectory, { recursive: true });

const shell = fs.readFileSync(shellPath, "utf8");
const extractedDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedDefs || !shellStyles) throw new Error("Could not extract the reviewed shared shell.");
const shellHash = crypto.createHash("sha256").update(extractedDefs).digest("hex");
let referenceDefs = extractedDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');

const assets = {
  pop: "assets/inkscape/viewtube-monster-pop-v2.jpg",
  battle: "assets/inkscape/viewtube-battle-ramp-v1.jpg",
  dance: "assets/inkscape/viewtube-dance-challenge-v1.jpg",
  rover: "assets/inkscape/viewtube-cardboard-rover-v1.jpg",
  dog: "assets/inkscape/viewtube-dog-cushions-v1.jpg",
  fetch: "assets/inkscape/viewtube-dog-fetch-v2.jpg",
  tacos: "assets/inkscape/viewtube-tacos-v1.jpg",
  tacoStunt: "assets/inkscape/viewtube-taco-stunt-v1.jpg",
  microscope: "assets/inkscape/viewtube-microscope-v1.jpg",
  scooter: "assets/inkscape/viewtube-escooter-v1.jpg",
  lighting: "assets/inkscape/viewtube-stopmotion-lighting-v1.jpg",
  autoShow: "assets/inkscape/viewtube-auto-show-v1.jpg",
  auto: "assets/inkscape/auto-character-expression-sheet-v2-bluetooth.jpg",
};

const assetSymbolByPath = new Map(
  Object.entries(assets).map(([name, assetPath]) => [assetPath, `vt-asset-${name}`]),
);
const assetSymbols = Object.entries(assets).map(([name, assetPath]) => {
  const source = path.join(outputDirectory, assetPath);
  const base64 = fs.readFileSync(source).toString("base64");
  const isAuto = name === "auto";
  const width = isAuto ? 1536 : 1672;
  const height = isAuto ? 1024 : 941;
  return `<image id="vt-asset-${name}" href="data:image/jpeg;base64,${base64}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;
}).join("");
referenceDefs += assetSymbols;

const states = [
  { id: "initial", label: "Forced viral feed", progress: 0 },
  { id: "search", label: "Player search restored", progress: 20, search: true },
  { id: "ads", label: "Excessive ads removed", progress: 40, search: true, ads: true },
  { id: "details", label: "Views and comments restored", progress: 60, search: true, ads: true, details: true },
  { id: "autoplay", label: "Autoplay choice restored", progress: 80, search: true, ads: true, details: true, autoplay: true },
  { id: "repaired", label: "Player selects a video", progress: 100, search: true, ads: true, details: true, autoplay: true, choice: true, fixed: true },
  { id: "auto-overfix", label: "Auto Show over-fix", progress: 0, auto: true },
  { id: "checklist", label: "Lock in the repair", progress: 0, auto: true, checklist: 0 },
  { id: "lock-search-ads", label: "Search restored and excessive ads removed", progress: 33, auto: true, search: true, ads: true, checklist: 1 },
  { id: "lock-details", label: "Views and comments locked", progress: 67, auto: true, search: true, ads: true, details: true, checklist: 2 },
  { id: "lock-choice", label: "Autoplay permission and viewer choice locked", progress: 100, auto: true, search: true, ads: true, details: true, autoplay: true, choice: true, fixed: true, checklist: 3 },
  { id: "secured", label: "Repair secured", progress: 100, search: true, ads: true, details: true, autoplay: true, choice: true, fixed: true },
];

const SITE_RED = "#8B1E1B";
const SITE_RED_DARK = "#5C1513";
const SITE_PAPER = "#F6F6F4";
const INK = "#152532";
const AMBER = "#D78519";

function titlebarPatch() {
  return buildInternetRecoverySiteIdentityPatch({ siteUrl: "www.viewtube.com", taskLabel: "VIEWTUBE" });
}

function playMark(x, y, size = 30, color = SITE_RED) {
  return `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}"/><path d="m${x - size * 0.22} ${y - size * 0.38} ${size * 0.75} ${size * 0.38}-${size * 0.75} ${size * 0.38}z" fill="#fff"/>`;
}

function infinityMark(x, y, size = 31) {
  return `<circle cx="${x}" cy="${y}" r="${size}" fill="${COLORS.corruption}"/><text x="${x}" y="${y + 12}" class="vt-infinity" text-anchor="middle">∞</text>`;
}

function header(state) {
  const searchText = state.search ? "how to teach your dog to play fetch" : state.auto ? "AUTO ALREADY SEARCHED FOR YOU" : "TRENDING REPLACED YOUR SEARCH";
  const searchTone = state.search ? COLORS.repair : COLORS.corruption;
  const stripText = state.choice
    ? "YOUR SEARCH · VIDEOS ABOUT YOUR HOBBY"
    : state.auto
      ? "AUTO SHOW · ALWAYS ON · ALWAYS NEXT"
      : state.search
        ? "YOUR SEARCH IS BACK · THE FEED IS STILL TRENDING"
        : "TRENDING FOR EVERYONE · PERSONAL SEARCH HIDDEN";
  return `<g data-site-header="true"><rect x="109" y="56" width="802" height="84" fill="#fff"/><text x="124" y="86" class="vt-menu">☰</text><rect x="153" y="64" width="34" height="25" rx="7" fill="${SITE_RED}"/>${playMark(170, 76.5, 8, "#fff")}<text x="197" y="86" class="vt-logo-dark">ViewTube</text><rect x="360" y="63" width="405" height="31" rx="16" fill="#fff" stroke="${searchTone}" stroke-width="2.2"/><text x="378" y="84" class="vt-search" fill="${searchTone}">${searchText}</text><circle cx="740" cy="77" r="7" fill="none" stroke="${searchTone}" stroke-width="2"/><line x1="745" y1="82" x2="753" y2="89" stroke="${searchTone}" stroke-width="2"/><circle cx="793" cy="78" r="15" fill="#F0F1F2"/><text x="793" y="84" class="vt-mic" text-anchor="middle">●</text><circle cx="837" cy="78" r="15" fill="#F0F1F2"/><text x="837" y="83" class="vt-user" text-anchor="middle">F</text><rect x="109" y="103" width="802" height="37" fill="#fff" stroke="#D6D8DA"/><rect x="123" y="110" width="36" height="22" rx="11" fill="${state.choice ? INK : SITE_RED}"/><text x="141" y="125" class="vt-chip" text-anchor="middle">ALL</text><text x="171" y="125" class="vt-strip" fill="${state.choice ? COLORS.repair : state.auto ? COLORS.corruption : searchTone}">${stripText}</text></g>`;
}

function thumb(asset, x, y, w, h, extra = "") {
  const symbolId = assetSymbolByPath.get(asset);
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" ${extra}><use href="#${symbolId}" xlink:href="#${symbolId}" x="0" y="0" width="1672" height="941"/></svg>`;
}

function autoPortrait(x, y, w, h) {
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="512 0 512 512" preserveAspectRatio="xMidYMid slice"><use href="#vt-asset-auto" xlink:href="#vt-asset-auto" x="0" y="0" width="1536" height="1024"/></svg>`;
}

function timeline(state, x, y, w) {
  const auto = state.auto && !state.choice;
  const positions = state.ads || state.choice
    ? [0.52]
    : auto
    ? [0.06, 0.14, 0.22, 0.30, 0.38, 0.46, 0.54, 0.62, 0.70, 0.78, 0.86, 0.94]
    : [0.10, 0.23, 0.36, 0.49, 0.62, 0.75, 0.88];
  const redWidth = state.choice ? 122 : auto ? w : 76;
  const markers = positions.map((p) => {
    const markerX = Math.round(x + w * p);
    const markerTone = state.ads || state.choice ? AMBER : COLORS.corruption;
    return `<rect x="${markerX - 8}" y="${y - 8}" width="16" height="13" rx="2" fill="${markerTone}"/><text x="${markerX}" y="${y + 1}" class="vt-ad" text-anchor="middle">AD</text>`;
  }).join("");
  return `<rect x="${x}" y="${y}" width="${w}" height="5" fill="#9BA1A5"/><rect x="${x}" y="${y}" width="${redWidth}" height="5" fill="${state.choice ? COLORS.repair : COLORS.corruption}"/>${markers}`;
}

function playerControls(state) {
  const auto = state.auto && !state.choice;
  const played = state.choice ? 122 : auto ? 470 : 76;
  return `<g data-player-controls="true"><rect x="124" y="382" width="510" height="54" fill="#090909" opacity=".94"/>${timeline(state, 138, 394, 480)}${auto ? infinityMark(157, 418, 13) : playMark(157, 417, 11, "#fff")}<path d="M184 410h6l7-7v28l-7-7h-6z" fill="#fff"/><path d="M201 410q8 7 0 14" fill="none" stroke="#fff" stroke-width="2"/><text x="219" y="423" class="vt-control">${auto ? "∞ / ∞" : state.choice ? "0:18 / 8:12" : "0:03 / 3:18"}</text><text x="501" y="423" class="vt-control">CC</text><text x="548" y="423" class="vt-control">⚙</text><text x="597" y="423" class="vt-control">⛶</text></g>`;
}

function player(state) {
  const fixed = state.choice;
  const auto = state.auto && !state.choice;
  const border = fixed ? COLORS.repair : COLORS.corruption;
  const image = fixed ? assets.fetch : assets.pop;
  const title = fixed
    ? "Teach Your Dog to Play Fetch"
    : auto
      ? "AUTO SHOW: VIRAL FOREVER"
      : "Neon Monster Idols: The Dance Break Everyone Is Watching";
  const subtitle = fixed
    ? "Dog Skills Club · selected by you"
    : auto
      ? "AUTO PRESENTS · PART 1 OF ∞"
      : "Popular now · selected for everyone";
  const stats = state.labels
    ? fixed
      ? "1 ad · 8:12 · search result"
      : auto
        ? "12 ads every 30 seconds · sponsored forever"
        : "7 ads · 3:18 · trending recommendation"
    : "Ad count hidden · recommendation reason hidden";
  const channel = fixed ? "Dog Skills Club" : auto ? "AUTO SHOW" : "TrendBlaster TV";
  const views = state.labels ? (fixed ? "18K views · posted 2 weeks ago" : auto ? "∞ views · uploaded continuously" : "4.2M views · promoted today") : "View count hidden · promotion details hidden";
  const comment = fixed ? "FetchFan14: My dog needed the short practice steps!" : auto ? "AUTO_COMMENT_0001: AMAZING!!! OPTIMAL!!! NEXT!!!" : "HypeMachine99: MOST VIRAL VIDEO EVER!!!";
  return `<g data-video-player="true"><rect x="119" y="149" width="524" height="642" rx="7" fill="#fff" stroke="${border}" stroke-width="2.5"/><g clip-path="url(#vtPlayerClip)">${thumb(image, 124, 154, 510, 282, auto ? 'opacity=".32"' : "")}${auto ? `<rect x="124" y="154" width="510" height="282" fill="#11182A" opacity=".73"/>${autoPortrait(276, 166, 205, 205)}<rect x="140" y="168" width="143" height="30" rx="15" fill="#14273D" stroke="#45C9FF" stroke-width="2"/><text x="211" y="188" class="vt-auto-badge" text-anchor="middle">AUTO SHOW</text><circle cx="588" cy="181" r="17" fill="#fff"/><text x="588" y="187" class="vt-bt" text-anchor="middle">ᛒ</text><text x="378" y="365" class="vt-auto-title" text-anchor="middle">PLAYING EVERYTHING</text>` : `${playMark(379, 286, 31, SITE_RED)}`}</g>${playerControls(state)}<text x="130" y="467" class="vt-video-title" fill="${fixed ? INK : border}">${title}</text><circle cx="147" cy="504" r="17" fill="${fixed ? COLORS.repairSoft : auto ? "#CBEFFF" : "#F3D6D3"}" stroke="${border}"/><text x="147" y="510" class="vt-avatar" text-anchor="middle">${auto ? "A" : fixed ? "D" : "T"}</text><text x="174" y="498" class="vt-channel">${channel}</text><text x="174" y="516" class="vt-subs">${fixed ? "24K subscribers" : auto ? "BLUETOOTH ENABLED" : "8.1M subscribers"}</text><rect x="284" y="487" width="76" height="31" rx="15" fill="${fixed ? INK : border}"/><text x="322" y="507" class="vt-action-white" text-anchor="middle">${auto ? "AUTO-SUB" : "SUBSCRIBE"}</text><rect x="371" y="487" width="68" height="31" rx="15" fill="#ECEEEF"/><text x="405" y="507" class="vt-action" text-anchor="middle">👍 ${fixed ? "412" : auto ? "∞" : "9.8K"}</text><rect x="447" y="487" width="67" height="31" rx="15" fill="#ECEEEF"/><text x="480" y="507" class="vt-action" text-anchor="middle">SHARE</text><rect x="522" y="487" width="42" height="31" rx="15" fill="#ECEEEF"/><text x="543" y="508" class="vt-action" text-anchor="middle">•••</text><rect x="130" y="535" width="502" height="81" rx="8" fill="#F0F1F2"/><text x="144" y="558" class="vt-description-strong" fill="${state.labels ? fixed ? COLORS.repairDark : AMBER : COLORS.corruption}">${views}</text><text x="144" y="580" class="vt-description">${fixed ? "Short, patient steps for teaching fetch—and when to stop for a break." : auto ? "AUTO PICKED THE MOST WATCHABLE VIDEO. NO SEARCH REQUIRED." : "The biggest dance break on the internet. Keep watching for the next part."}</text><text x="144" y="600" class="vt-description">${state.labels ? fixed ? "Search result · selected by you" : auto ? "Sponsored forever · reason: AUTO KNOWS BEST" : stats : "Recommendation source and ad load are hidden"}</text><text x="130" y="646" class="vt-comments-title">${fixed ? "18 COMMENTS" : auto ? "∞ AUTO-COMMENTS" : "12K COMMENTS"}</text><rect x="130" y="660" width="502" height="45" rx="6" fill="${fixed ? COLORS.repairSoft : auto ? "#F2D0CF" : "#F7F2EF"}" stroke="${border}"/><text x="144" y="680" class="vt-comment">${comment}</text><text x="144" y="698" class="vt-comment-small">${fixed ? "Helpful · 31 likes" : auto ? "Pinned automatically" : "Enhanced for excitement · pinned"}</text><text x="130" y="738" class="vt-footer-status" fill="${border}">${subtitle}</text><text x="130" y="767" class="vt-footer-note">${fixed ? "Selected by you · autoplay off" : auto ? "AUTO PLAYLIST STATUS: INFINITE" : state.autoplay ? "Queue paused · waiting for you" : state.labels ? "Recommendation details visible · autoplay still on" : state.search ? "Search restored · trending queue still active" : "Trending queue refreshes automatically"}</text></g>`;
}

const queueContent = {
  forced: [
    [assets.battle, "Storm Ramp Panic", "POPULAR"],
    [assets.dance, "Sideways Dance Challenge", "RECOMMENDED"],
    [assets.pop, "Monster-Pop Dance Break", "POPULAR"],
    [assets.dog, "Dog vs. Every Cushion", "RECOMMENDED"],
  ],
  repaired: [
    [assets.rover, "Build a cardboard rover", "MORE FROM YOUR INTERESTS"],
    [assets.tacos, "Make tacos together", "MORE FROM YOUR INTERESTS"],
    [assets.microscope, "Your first microscope slide", "MORE FROM YOUR INTERESTS"],
    [assets.scooter, "Ride an e-scooter safely", "MORE FROM YOUR INTERESTS"],
  ],
  auto: [
    [assets.pop, "AUTO SHOW PART 2 OF ∞", "AUTO-CHOSEN"],
    [assets.dog, "AUTO SHOW: DOG INTERRUPTION", "AUTO-CHOSEN"],
    [assets.tacos, "AUTO SHOW: TACO LOOP", "AUTO-CHOSEN"],
    [assets.pop, "AUTO SHOW: THE ADS EPISODE", "SPONSORED"],
  ],
};

function queueRow(state, row, index) {
  const [asset, title, reason] = row;
  const y = 220 + index * 132;
  const fixed = state.choice;
  const auto = state.auto && !fixed;
  const labeled = state.labels;
  const tone = fixed ? COLORS.repair : auto ? COLORS.corruption : labeled ? AMBER : COLORS.corruption;
  const fill = fixed ? COLORS.repairSoft : auto ? "#F2D0CF" : "#F7F2EF";
  return `<g data-queue-row="${index + 1}"><rect x="653" y="${y}" width="239" height="122" rx="7" fill="${fill}" stroke="${tone}" stroke-width="1.7"/>${thumb(asset, 661, y + 8, 104, 72, auto ? 'opacity=".72"' : "")}<rect x="661" y="${y + 62}" width="104" height="18" fill="#111" opacity=".8"/><text x="758" y="${y + 75}" class="vt-runtime" text-anchor="end">${index ? "0:42" : "0:30"}</text><text x="775" y="${y + 30}" class="vt-card-title">${title}</text><text x="775" y="${y + 55}" class="vt-card-label" fill="${labeled ? tone : COLORS.corruption}">${labeled ? reason : "WHY NEXT: HIDDEN"}</text><text x="661" y="${y + 101}" class="vt-card-detail" fill="${tone}">${fixed ? "Chosen from your interests" : auto ? "AUTO-CHOSEN · CANNOT SKIP" : labeled ? "Suggested by the feed" : "Reason hidden · autoplay on"}</text>${auto ? `<rect x="844" y="${y + 91}" width="40" height="18" rx="9" fill="${COLORS.corruption}"/><text x="864" y="${y + 104}" class="vt-auto-mini" text-anchor="middle">AUTO</text>` : ""}</g>`;
}

function queue(state) {
  const fixed = state.choice;
  const auto = state.auto && !state.choice;
  const rows = fixed ? queueContent.repaired : auto ? queueContent.auto : queueContent.forced;
  const tone = fixed ? COLORS.repair : COLORS.corruption;
  const autoplayCopy = state.autoplay ? "OFF · NOTHING PLAYS UNTIL YOU CLICK" : auto ? "∞ · AUTO SHOW NEVER ENDS" : "ON · NEXT VIDEO STARTS AUTOMATICALLY";
  return `<g data-video-queue="true"><rect x="649" y="149" width="252" height="642" rx="7" fill="#fff" stroke="${tone}" stroke-width="2.5"/><text x="665" y="178" class="vt-heading">${auto ? "AUTO SHOW QUEUE" : "UP NEXT"}</text><text x="797" y="177" class="vt-tiny">AUTOPLAY</text>${state.autoplay ? `<rect x="850" y="164" width="38" height="18" rx="9" fill="#CDD3D7"/><circle cx="860" cy="173" r="7" fill="#fff" stroke="#9CA4A9"/>` : auto ? infinityMark(869, 173, 15) : `<rect x="850" y="164" width="38" height="18" rx="9" fill="${COLORS.corruption}"/><circle cx="878" cy="173" r="7" fill="#fff"/>`}<text x="665" y="203" class="vt-tiny" fill="${state.autoplay ? COLORS.repair : COLORS.corruption}">${autoplayCopy}</text>${rows.map((row, index) => queueRow(state, row, index)).join("")}<text x="665" y="776" class="vt-tiny" fill="${tone}">${fixed ? "NOTHING ELSE PLAYS AUTOMATICALLY" : auto ? "+ ∞ MORE AUTO-CHOSEN VIDEOS" : state.autoplay ? "QUEUE PAUSED" : "+ 42 MORE VIDEOS WAITING"}</text></g>`;
}

const queueContentV3 = {
  forced: [
    [assets.battle, "Minecraft to Infinity"],
    [assets.pop, "Monster Pop Dance"],
    [assets.dog, "Dog vs. Every Cushion"],
  ],
  repaired: [
    [assets.tacoStunt, "Taco Flip"],
    [assets.microscope, "First Microscope Slide"],
    [assets.scooter, "E-Scooter Safety"],
  ],
  auto: [
    [assets.autoShow, "AUTO SHOW · PART 2 OF ∞"],
    [assets.autoShow, "AUTO SHOW · PART 3 OF ∞"],
    [assets.autoShow, "AUTO SHOW · PART 4 OF ∞"],
  ],
};

function playerV3(state) {
  const fixed = state.choice;
  const auto = state.auto && !state.choice;
  const border = fixed ? COLORS.repair : COLORS.corruption;
  const image = fixed ? assets.fetch : auto ? assets.autoShow : assets.dance;
  const title = fixed ? "Teach Your Dog to Play Fetch" : auto ? "AUTO SHOW: VIRAL FOREVER" : "Sideways Dance Challenge";
  const channel = fixed ? "Dog Skills Club" : auto ? "AUTO SHOW" : "TrendBlaster TV";
  const detailsRestored = fixed || state.details;
  const adsRestored = fixed || state.ads;
  const views = fixed
    ? "18K views · posted 2 weeks ago"
    : detailsRestored
      ? "4.2M views · promoted today"
      : auto
        ? "∞ VIEWS · UPLOADED CONTINUOUSLY"
        : "LOTS OF VIEWS · PROMOTED TODAY";
  const adStatus = adsRestored
    ? "EXCESSIVE ADS REMOVED · 1 AD BREAK"
    : auto
      ? "∞ AD BREAKS · ∞ POP-UP ADS"
      : "7 AD BREAKS · POP-UP AD ACTIVE";
  const comment = fixed
    ? "FetchFan14: The short practice steps helped my dog!"
    : detailsRestored
      ? auto
        ? "PixelPilot: I wanted one video, not an endless show."
        : "PixelPilot: That sideways step at 0:18 made me laugh."
      : auto
        ? "AUTO_COMMENT_0001: AMAZING!!! OPTIMAL!!! NEXT!!!"
        : "AMAZING!!! BEST VIDEO EVER!!! WATCH NEXT!!!";
  const commentMeta = detailsRestored
    ? "31 likes"
    : auto
      ? "Pinned automatically"
      : "Enhanced for excitement · pinned";
  const detailTone = detailsRestored ? COLORS.repairDark : COLORS.corruption;
  const adTone = adsRestored ? COLORS.repairDark : COLORS.corruption;
  const adBreakCount = adsRestored ? 1 : auto ? "infinity" : 7;
  return `<g data-video-player="true" data-ad-break-count="${adBreakCount}"><rect x="119" y="149" width="524" height="642" rx="7" fill="#fff" stroke="${border}" stroke-width="2.5"/><g clip-path="url(#vtPlayerClip)">${thumb(image, 124, 154, 510, 282)}${auto ? `${infinityMark(379, 286, 48)}<rect x="140" y="168" width="137" height="30" rx="15" fill="#14273D" stroke="#45C9FF" stroke-width="2"/><text x="208" y="188" class="vt-auto-badge" text-anchor="middle">AUTO SHOW</text>` : playMark(379, 286, 31, SITE_RED)}</g>${playerControls(state)}<text x="130" y="467" class="vt-video-title" fill="${fixed ? COLORS.repairDark : border}">${title}</text><circle cx="147" cy="504" r="17" fill="${fixed ? COLORS.repairSoft : auto ? "#CBEFFF" : "#F3D6D3"}" stroke="${border}"/><text x="147" y="510" class="vt-avatar" text-anchor="middle">${auto ? "A" : fixed ? "D" : "T"}</text><text x="174" y="498" class="vt-channel">${channel}</text><text x="174" y="516" class="vt-subs">${fixed ? "24K subscribers" : auto ? "BLUETOOTH ENABLED" : "8.1M subscribers"}</text><rect x="284" y="487" width="76" height="31" rx="15" fill="${fixed ? INK : border}"/><text x="322" y="507" class="vt-action-white" text-anchor="middle">${auto ? "AUTO-SUB" : "SUBSCRIBE"}</text><rect x="371" y="487" width="68" height="31" rx="15" fill="#ECEEEF"/><text x="405" y="507" class="vt-action" text-anchor="middle">👍 ${fixed ? "412" : auto ? "∞" : "9.8K"}</text><rect x="447" y="487" width="67" height="31" rx="15" fill="#ECEEEF"/><text x="480" y="507" class="vt-action" text-anchor="middle">SHARE</text><rect x="522" y="487" width="42" height="31" rx="15" fill="#ECEEEF"/><text x="543" y="508" class="vt-action" text-anchor="middle">•••</text><rect x="130" y="535" width="502" height="67" rx="8" fill="#F0F1F2"/><text x="144" y="560" class="vt-description-strong" fill="${detailTone}">${views}</text><text x="144" y="586" class="vt-description-strong" fill="${adTone}">${adStatus}</text><text x="130" y="630" class="vt-comments-title">${fixed ? "18 COMMENTS" : detailsRestored ? "12K COMMENTS" : auto ? "∞ AUTO-COMMENTS" : "12K COMMENTS"}</text><rect x="130" y="644" width="502" height="64" rx="6" fill="${detailsRestored ? COLORS.repairSoft : auto ? "#F2D0CF" : "#F7F2EF"}" stroke="${detailsRestored ? COLORS.repair : border}"/><text x="144" y="670" class="vt-comment">${comment}</text><text x="144" y="695" class="vt-comment-small">${commentMeta}</text></g>`;
}

function queueRowV3(state, row, index) {
  const [asset, title] = row;
  const y = 220 + index * 171;
  const fixed = state.choice;
  const auto = state.auto && !fixed;
  const paused = state.autoplay && !fixed;
  const tone = fixed ? COLORS.repair : paused ? "#89949B" : COLORS.corruption;
  const fill = fixed ? COLORS.repairSoft : paused ? "#EEF0F1" : auto ? "#F2D0CF" : "#F7F2EF";
  const cardOpacity = paused ? ".48" : "1";
  const centerX = 772.5;
  const centerY = y + 63.5;
  const mediaMark = auto
    ? infinityMark(centerX, centerY, 17)
    : playMark(centerX, centerY, 17, SITE_RED);
  return `<g data-queue-row="${index + 1}"><rect x="653" y="${y}" width="239" height="156" rx="7" fill="${fill}" stroke="${tone}" stroke-width="1.7"/><g opacity="${cardOpacity}">${thumb(asset, 661, y + 8, 223, 111)}<text x="665" y="${y + 143}" class="vt-card-title" fill="${auto ? COLORS.corruption : INK}">${title}</text></g><g data-queue-media-mark="true">${mediaMark}</g></g>`;
}

function queueV3(state) {
  const fixed = state.choice;
  const auto = state.auto && !state.choice;
  const rows = fixed ? queueContentV3.repaired : auto ? queueContentV3.auto : queueContentV3.forced;
  const tone = fixed || state.autoplay ? COLORS.repair : COLORS.corruption;
  const autoplayCopy = fixed || state.autoplay
    ? "AUTOPLAY OFF"
    : auto
      ? "SAME AUTO SHOW FOREVER"
      : "AUTOPLAY ON";
  const switchControl = auto && !state.autoplay
    ? infinityMark(869, 173, 15)
    : `<text x="797" y="177" class="vt-tiny">AUTOPLAY</text>${state.autoplay ? `<rect x="850" y="164" width="38" height="18" rx="9" fill="#CDD3D7"/><circle cx="860" cy="173" r="7" fill="#fff" stroke="#9CA4A9"/>` : `<rect x="850" y="164" width="38" height="18" rx="9" fill="${COLORS.corruption}"/><circle cx="878" cy="173" r="7" fill="#fff"/>`}`;
  const statusTone = fixed || state.autoplay ? COLORS.repair : COLORS.corruption;
  const heading = state.autoplay ? "MORE VIDEOS" : auto ? "AUTO QUEUE" : "UP NEXT";
  return `<g data-video-queue="true" data-queue-count="${rows.length}"><rect x="649" y="149" width="252" height="642" rx="7" fill="#fff" stroke="${tone}" stroke-width="2.5"/><text x="665" y="178" class="vt-heading">${heading}</text>${switchControl}<text x="665" y="203" class="vt-queue-status" fill="${statusTone}">${autoplayCopy}</text>${rows.map((row, index) => queueRowV3(state, row, index)).join("")}</g>`;
}

function adPopup(x, y, w, h, label = "AD") {
  return `<g data-popup-ad="true" data-popup-label="${label}"><rect x="${x + 4}" y="${y + 5}" width="${w}" height="${h}" rx="8" fill="#23323A" opacity=".25"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#FFF2C7" stroke="${COLORS.corruption}" stroke-width="3"/><text x="${x + w / 2}" y="${y + h / 2 + 10}" class="vt-ad-popup" text-anchor="middle">${label}</text></g>`;
}

function persistentAds(state) {
  if (state.ads || state.choice) return "";
  if (state.auto) {
    return `<g data-persistent-ads="4">${adPopup(130, 160, 105, 58)}${adPopup(522, 160, 105, 58)}${adPopup(130, 318, 105, 58)}${adPopup(522, 318, 105, 58)}</g>`;
  }
  return `<g data-persistent-ads="1" data-popup-placement="main-video">${adPopup(512, 168, 110, 66)}</g>`;
}

function footer(state) {
  const tone = state.fixed ? COLORS.repair : COLORS.corruption;
  const headline = state.choice
    ? "YOU PICKED THE VIDEO THAT MATCHES YOUR HOBBY"
    : state.auto
      ? "AUTO SHOW IS PLAYING EVERYTHING SO YOU DON'T HAVE TO CHOOSE"
      : state.autoplay
        ? "THE QUEUE STOPS UNTIL YOU CHOOSE"
        : state.labels
          ? "ADS AND RECOMMENDATION REASONS ARE VISIBLE"
          : state.search
            ? "YOUR SEARCH IS BACK"
            : "THE TRENDING FEED IS CHOOSING FOR YOU";
  const note = state.choice
    ? "Selected by you · autoplay off"
    : state.auto
      ? "AUTO PLAYLIST STATUS: INFINITE"
      : state.autoplay
        ? "Queue paused · waiting for you"
        : state.labels
          ? "Recommendation details visible · autoplay still on"
          : state.search
            ? "Search restored · trending queue still active"
            : "Trending queue refreshes automatically";
  return `<g><rect x="119" y="800" width="782" height="38" rx="6" fill="#fff" stroke="${tone}"/><text x="132" y="824" class="vt-meter" fill="${tone}">VIEWER CONTROL ${state.progress}%</text><rect x="315" y="811" width="565" height="15" fill="url(#vtCorruptHatch)" stroke="${tone}"/><rect x="315" y="811" width="${Math.round(565 * state.progress / 100)}" height="15" fill="${tone}" data-role="site-progress-fill" data-percent="${state.progress}"/></g>`;
}

const locks = ["RESTORE SEARCH + REMOVE ADS", "RESTORE VIEWS + COMMENTS", "ASK FIRST + KEEP THE CHOICE"];

function checklist(state) {
  if (state.checklist === undefined) return "";
  return `<g data-lock-overlay="true"><rect x="505" y="356" width="330" height="224" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="505" y="356" width="330" height="48" rx="10" fill="${COLORS.repair}"/><rect x="505" y="391" width="330" height="13" fill="${COLORS.repair}"/><text x="525" y="388" class="lock-title">LOCK IN THE REPAIR</text>${locks.map((label, index) => { const done = index < state.checklist; const y = 446 + index * 48; return `<rect x="529" y="${y - 22}" width="27" height="27" rx="5" fill="${done ? COLORS.repair : COLORS.corruptionSoft}" stroke="${done ? COLORS.repair : COLORS.corruption}"/><text x="542.5" y="${y - 3}" class="lock-mark" text-anchor="middle" fill="${done ? "#fff" : COLORS.corruption}">${done ? "✓" : "○"}</text><text x="568" y="${y}" class="lock-label" fill="${done ? COLORS.repairDark : COLORS.corruption}">${label}</text>`; }).join("")}</g>`;
}

function companion(state) {
  const copy = {
    initial: ["The site has already picked what plays.", "Read to restore one viewer control."],
    search: ["Your search is visible again.", "The feed is still deciding what plays."],
    ads: ["The excessive ads are gone.", "The views and comments are still distorted."],
    details: ["The real views and comments are back.", "Autoplay is still making the next choice."],
    autoplay: ["Autoplay now waits for you.", "One more repair restores your selection."],
    repaired: ["You picked a video about your hobby.", "Nothing starts without you."],
    "auto-overfix": ["Auto replaced autoplay with an endless show.", "The ordinary play button disappeared."],
    checklist: ["Lock the viewer controls into place.", "Each next passage secures one control."],
    "lock-search-ads": ["Your search is locked and extra ads are gone.", "Auto still distorts the views and comments."],
    "lock-details": ["The real views and comments are locked in.", "Auto still starts every next video."],
    "lock-choice": ["Autoplay must ask and the viewer chooses.", "The endless Auto Show is gone."],
    secured: ["Viewer control is secured.", "You decide what plays next."],
  }[state.id];
  return `<g data-companion-state="reading"><text x="964" y="107" class="reading-body">${copy[0]}</text><text x="964" y="145" class="reading-body">${copy[1]}</text><rect x="960" y="173" width="404" height="34" fill="#F8DFA0"/><text x="964" y="199" class="reading-body">Read, then answer the quick check.</text></g>`;
}

function statePage(state, index) {
  const phaseTwo = index >= 6;
  const delta = phaseTwo ? Math.min(3, state.checklist ?? 0) : [0, 1, 1, 2, 2, 3][index];
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${phaseTwo ? "phase-2" : "phase-1"}" data-site-progress="${state.progress}" data-passage-progress="50" data-visual-delta="${delta}" data-state-mode="${state.auto ? "auto-overfix" : state.fixed ? "fixed" : "repairing"}"><use href="#sharedShell"/>${titlebarPatch()}<rect x="109" y="56" width="802" height="782" fill="#E8EAEC"/>${header(state)}${playerV3(state)}${queueV3(state)}${persistentAds(state)}${footer(state)}${companion(state)}${checklist(state)}<rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellHash}" data-brand-red="${SITE_RED}" data-corruption-red="${COLORS.corruption}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="vtCorruptHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".25" stroke-width="3"/></pattern><clipPath id="vtPlayerClip"><rect x="124" y="154" width="510" height="282" rx="4"/></clipPath></defs><style>${shellStyles}.task-label,.vt-logo-dark,.vt-menu,.vt-mic,.vt-user,.vt-chip,.vt-search,.vt-strip,.vt-heading,.vt-tiny,.vt-queue-status,.vt-card-title,.vt-card-label,.vt-card-detail,.vt-runtime,.vt-ad,.vt-ad-popup,.vt-ad-popup-small,.vt-meter,.vt-auto-badge,.vt-auto-title,.vt-auto-mini,.vt-infinity,.vt-bt,.vt-control,.vt-video-title,.vt-avatar,.vt-channel,.vt-subs,.vt-action,.vt-action-white,.vt-description-strong,.vt-description,.vt-comments-title,.vt-comment,.vt-comment-small,.vt-footer-status,.vt-footer-note,.lock-title,.lock-label,.lock-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.task-label{font-size:14px;font-weight:600;fill:#15191B}.vt-logo-dark{font-size:22px;font-weight:700;fill:${INK}}.vt-menu{font-size:20px;font-weight:700;fill:${INK}}.vt-mic{font-size:10px;fill:${INK}}.vt-user{font-size:12px;font-weight:700;fill:${INK}}.vt-chip{font-size:8px;font-weight:700;fill:#fff}.vt-search{font-size:10px;font-weight:700}.vt-strip{font-size:9px;font-weight:700}.vt-heading{font-size:16px;font-weight:700;fill:${INK}}.vt-tiny{font-size:8px}.vt-queue-status{font-size:10px;font-weight:700}.vt-card-title{font-size:12px;font-weight:700;fill:${INK}}.vt-card-label{font-size:7px;font-weight:700}.vt-card-detail{font-size:7px;font-weight:700}.vt-runtime{font-size:9px;fill:#fff}.vt-ad{font-size:6px;font-weight:700;fill:#fff}.vt-ad-popup{font-size:27px;font-weight:700;fill:${COLORS.corruption}}.vt-ad-popup-small{font-size:8px;font-weight:700;fill:#fff}.vt-meter{font-size:12px;font-weight:700}.vt-auto-badge{font-size:10px;font-weight:700;fill:#fff}.vt-auto-title{font-size:15px;font-weight:700;fill:#fff}.vt-auto-mini{font-size:6px;font-weight:700;fill:#fff}.vt-infinity{font-size:43px;font-weight:700;fill:#fff}.vt-bt{font-size:17px;font-weight:700;fill:#1976D2}.vt-control{font-size:11px;font-weight:700;fill:#fff}.vt-video-title{font-size:16px;font-weight:700}.vt-avatar{font-size:12px;font-weight:700;fill:${INK}}.vt-channel{font-size:12px;font-weight:700;fill:${INK}}.vt-subs{font-size:9px;fill:#5B6268}.vt-action{font-size:9px;font-weight:700;fill:${INK}}.vt-action-white{font-size:8px;font-weight:700;fill:#fff}.vt-description-strong{font-size:11px;font-weight:700}.vt-description{font-size:10px;fill:${INK}}.vt-comments-title{font-size:12px;font-weight:700;fill:${INK}}.vt-comment{font-size:11px;font-weight:700;fill:${INK}}.vt-comment-small{font-size:10px;fill:#687077}.vt-footer-status{font-size:10px;font-weight:700}.vt-footer-note{font-size:8px;fill:#4D5961}.lock-title{font-size:19px;font-weight:700;fill:#fff}.lock-label{font-size:12px;font-weight:700}.lock-mark{font-size:15px;font-weight:700}</style>${states.map(statePage).join("\n")}</svg>`;
fs.writeFileSync(output, svg);

for (let page = 1; page <= states.length; page += 1) {
  execFileSync(
    "/Applications/Inkscape.app/Contents/MacOS/inkscape",
    [path.basename(output), `--export-page=${page}`, "--export-area-page", "--export-type=png", "--export-width=1440", `--export-filename=viewtube-anchor-v2_p${page}.png`],
    { cwd: outputDirectory, stdio: "ignore" },
  );
}

const slides = states.map((state, index) => {
  const filename = `viewtube-anchor-v2_p${index + 1}.png`;
  const digest = crypto.createHash("sha256").update(fs.readFileSync(path.join(outputDirectory, filename))).digest("hex").slice(0, 12);
  return { title: state.label, src: `${filename}?v=${digest}` };
});
const review = `<!doctype html><html><head><meta charset="utf-8"><title>ViewTube production review v2</title><style>html,body{margin:0;background:#15252f;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:0 auto;padding:18px}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;background:#0c3944;border:2px solid #8db4bd}.stage img{display:block;width:100%;height:auto}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;border:1px solid #fff;background:#0b2f3dcc;color:#fff;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;border:3px solid transparent;background:#244b55;color:#fff;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main" alt=""><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(next){index=(next+slides.length)%slides.length;main.src=slides[index].src;main.alt=slides[index].title;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}slides.forEach((slide,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+slide.src+'" alt=""><span>'+slide.title+'</span>';b.onclick=()=>show(i);strip.append(b)});document.querySelector('#prev').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0);</script></body></html>`;
fs.writeFileSync(path.join(outputDirectory, "viewtube-anchor-review-v2.html"), review);
console.log(`Wrote ${states.length} ViewTube v2 review frames and click-through reviewer.`);
