#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { buildInternetRecoverySiteIdentityPatch, INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve("docs/design/screens/2026-08-22/mapguess-production");
const output = path.join(outputDirectory, "mapguess-anchor-master-v2.svg");
const reviewPath = path.join(outputDirectory, "mapguess-anchor-review-v2.html");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const mapPath = path.resolve("docs/design/screens/2026-08-15/non-wikiwhy-bookends/mapguess-san-francisco-illustrated-v8.png");
fs.mkdirSync(outputDirectory, { recursive: true });

for (const required of [shellPath, mapPath]) {
  if (!fs.existsSync(required)) throw new Error(`Missing required asset: ${required}`);
}

const shell = fs.readFileSync(shellPath, "utf8");
const extractedDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedDefs || !shellStyles) throw new Error("Could not extract reviewed shared shell.");
const shellHash = crypto.createHash("sha256").update(extractedDefs).digest("hex");
const mapHash = crypto.createHash("sha256").update(fs.readFileSync(mapPath)).digest("hex");
const referenceDefs = extractedDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');

const states = [
  { id: "initial", label: "Sponsored detour", run: "first", step: 0, progress: 0, delta: 0 },
  { id: "clutter-cleared", label: "Irrelevant sponsored areas cleared", run: "first", step: 1, progress: 25, delta: 1 },
  { id: "labels-restored", label: "Map labels restored", run: "first", step: 2, progress: 50, delta: 1 },
  { id: "eta-restored", label: "Travel time corrected", run: "first", step: 3, progress: 75, delta: 1 },
  { id: "destination-route-restored", label: "Library destination restored", run: "first", step: 4, progress: 100, delta: 2 },
  { id: "auto-overfix", label: "Auto moves the library", run: "lock", step: 0, progress: 0, delta: 0, auto: true, falseTargets: 1, activeTarget: 0 },
  { id: "target-lock-ready-1", label: "Try to lock the library", run: "lock", step: 0, progress: 0, delta: 0, auto: true, falseTargets: 1, activeTarget: 0, overlay: "ready", attemptReady: true },
  { id: "target-lock-failed-1", label: "The first lock fails", run: "lock", step: 1, progress: 0, delta: 1, auto: true, falseTargets: 1, activeTarget: 0, overlay: "failed", lockFailed: true },
  { id: "target-lock-ready-2", label: "The library moves downtown", run: "lock", step: 1, progress: 0, delta: 1, auto: true, falseTargets: 1, activeTarget: 1, overlay: "ready", attemptReady: true },
  { id: "target-lock-failed-2", label: "The second lock fails", run: "lock", step: 2, progress: 0, delta: 1, auto: true, falseTargets: 1, activeTarget: 1, overlay: "failed", lockFailed: true },
  { id: "target-lock-ready-3", label: "The library moves to the Presidio", run: "lock", step: 2, progress: 0, delta: 1, auto: true, falseTargets: 1, activeTarget: 2, overlay: "ready", attemptReady: true },
  { id: "target-lock-failed-3", label: "The third lock fails", run: "lock", step: 3, progress: 0, delta: 1, auto: true, falseTargets: 1, activeTarget: 2, overlay: "failed", lockFailed: true },
  { id: "target-lock-ready-4", label: "One final try", run: "lock", step: 3, progress: 0, delta: 1, auto: true, falseTargets: 1, activeTarget: 3, overlay: "ready", attemptReady: true, movingTargetFound: true },
  { id: "destination-secured", label: "Library destination secured", run: "lock", step: 4, progress: 100, delta: 2, falseTargets: 0, secured: true },
  { id: "repair-secured", label: "Map repair secured", run: "secured", step: 4, progress: 100, delta: 1, secured: true },
];

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function titlebarPatch() {
  return buildInternetRecoverySiteIdentityPatch({ siteUrl: "www.mapguess.net", taskLabel: "MAPGUESS" });
}

function browserShell() {
  return `<g data-module="mapguess-shell" data-purpose="persistent-parody-cue"><rect width="900" height="815" fill="#EEEAE1"/><rect x="2" y="2" width="896" height="811" rx="5" fill="#F4F1E8" stroke="#C7C5BD" stroke-width="4"/><rect x="4" y="4" width="892" height="68" fill="#F4EFE1"/><circle cx="38" cy="38" r="23" fill="#143E68"/><path d="m38 18 7 15 16 5-16 6-7 15-7-15-16-6 16-5z" fill="#F4A21C"/><text x="74" y="47" class="mg-logo">MapGuess</text><text x="722" y="43" class="mg-small mg-blue">Directions</text><text x="808" y="43" class="mg-small">Print</text><rect x="4" y="72" width="892" height="42" fill="#143E68"/><text x="24" y="99" class="mg-nav">ROUTE PLANNER</text><text x="176" y="99" class="mg-nav">TRAFFIC</text><text x="250" y="99" class="mg-nav">PLACES</text><text x="324" y="99" class="mg-nav">MAP LEGEND</text></g>`;
}

const labels = `<g data-module="real-map-labels" data-purpose="repair-target"><text x="28" y="75" class="mg-map-label">GOLDEN GATE BRIDGE</text><text x="124" y="158" class="mg-map-label">PRESIDIO</text><text x="218" y="176" class="mg-map-label">PALACE OF FINE ARTS</text><text x="344" y="82" class="mg-map-label">FISHERMAN'S WHARF</text><text x="522" y="90" class="mg-map-label">PIER 39</text><text x="420" y="188" class="mg-map-label">COIT TOWER</text><text x="406" y="300" class="mg-map-label">DOWNTOWN</text><text x="488" y="350" class="mg-map-label">FERRY BUILDING</text><text x="548" y="256" class="mg-map-label" transform="rotate(70 548 256)">EMBARCADERO</text><text x="100" y="313" class="mg-map-label">GOLDEN GATE PARK</text><text x="172" y="389" class="mg-map-label">TWIN PEAKS</text><text x="270" y="386" class="mg-map-label">NOE VALLEY</text></g>`;

const falseTargetPositions = [
  { x: 480, y: 235, name: "LIBRARY", detail: "(ACTUALLY SNACK PALACE)" },
  { x: 440, y: 292, name: "LIBRARY", detail: "(ACTUALLY SNACK PALACE)" },
  { x: 150, y: 185, name: "LIBRARY", detail: "(ACTUALLY SNACK PALACE)" },
  { x: 420, y: 390, name: "LIBRARY", detail: "(ACTUALLY SNACK PALACE)" },
];

const routePaths = [
  "M290 350 L330 350 L370 350 L402 343 L430 330 L455 315 L475 300 L492 282 L495 264 L480 248 L480 235",
  "M290 350 L330 350 L370 350 L398 342 L420 325 L435 307 L440 292",
  "M290 350 L270 339 L250 329 L230 318 L210 306 L190 292 L170 276 L154 257 L142 236 L136 215 L140 198 L150 185",
  "M290 350 L330 350 L365 355 L392 369 L420 390",
];

const autoSnackPalaces = [
  [92, 226], [150, 185], [236, 214], [350, 174], [480, 235],
  [536, 310], [440, 292], [420, 390], [226, 394], [112, 340],
];

function directRoute({ green = false, muted = false } = {}) {
  const color = green ? COLORS.repair : "#777";
  const width = green ? 7 : 5;
  const streetPath = "M290 350 L306 337 L316 319 L313 299 L318 279 L325 250";
  return `<g data-module="direct-route" data-purpose="repair-target"><path d="${streetPath}" fill="none" stroke="#fff" stroke-width="${green ? 11 : 9}" stroke-linejoin="round" stroke-linecap="round"/><path d="${streetPath}" fill="none" stroke="${color}" stroke-width="${width}" ${muted ? 'stroke-dasharray="5 4"' : ""} stroke-linejoin="round" stroke-linecap="round"/></g>`;
}

function loopRoute() {
  const streetLoop = "M290 350 L330 350 L370 350 L402 343 L430 330 L455 315 L475 300 L492 282 L505 260 L510 238 L508 216 L500 195 L492 175 L488 150 L485 115 L462 135 L440 155 L420 175 L400 195 L380 215 L360 235 L325 250";
  return `<g data-module="sponsored-route" data-purpose="repair-target"><path d="${streetLoop}" fill="none" stroke="#fff" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/><path d="${streetLoop}" fill="none" stroke="${COLORS.corruption}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/></g>`;
}

function movingRoute(activeTarget) {
  const pathData = routePaths[activeTarget];
  return `<g data-module="moving-destination-route" data-purpose="repair-target" data-active-target="${activeTarget}"><path d="${pathData}" fill="none" stroke="#fff" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/><path d="${pathData}" fill="none" stroke="${COLORS.corruption}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="14 7"/></g>`;
}

function endpoints({ destinationFixed = false, auto = false }) {
  return `<g data-module="route-endpoints" data-purpose="repair-target"><g transform="translate(270 330)"><use href="#mapHomeGlyph"/></g>${auto ? "" : `<g transform="translate(302 232)"><use href="#mapBookGlyph"/></g><rect x="340" y="263" width="152" height="27" rx="5" fill="#fff" stroke="${destinationFixed ? COLORS.repair : COLORS.corruption}"/><text x="350" y="282" class="${destinationFixed ? "mg-map-label mg-green" : "mg-tiny mg-red"}">${destinationFixed ? "NOE VALLEY LIBRARY" : "LIBRARY · STOP 2"}</text>`}</g>`;
}

function sponsorMarker(kind, x, y, title, subtitle = "", box = {}) {
  const symbol = kind === "snack" ? "mapSponsorSnackArt" : kind === "cookie" ? "mapSponsorCookieArt" : "mapSponsorBurritoArt";
  const boxX = box.x ?? Math.max(4, Math.min(620 - 176, x - 24));
  const boxY = box.y ?? Math.max(44, Math.min(526 - 55, y + 40));
  return `<g data-module="sponsored-marker" data-purpose="repair-target" data-sponsor="${kind}"><g transform="translate(${x} ${y})"><use href="#${symbol}"/></g><rect x="${boxX}" y="${boxY}" width="176" height="${subtitle ? 48 : 29}" rx="7" fill="#FFF7E8" stroke="#F4A21C" stroke-width="2"/><text x="${boxX + 10}" y="${boxY + 20}" class="mg-sponsor">${esc(title)}</text>${subtitle ? `<text x="${boxX + 10}" y="${boxY + 38}" class="mg-tiny mg-orange">${esc(subtitle)}</text>` : ""}</g>`;
}

function falseTargetMarker(target, index, active) {
  const calloutX = Math.max(5, Math.min(385, target.x - 62));
  const calloutY = Math.max(10, Math.min(450, target.y + 48));
  return `<g data-module="false-destination" data-purpose="repair-target" data-false-target="${index}" data-active="${active}"><g transform="translate(${target.x - 22} ${target.y - 20})"><use href="#mapBookGlyph"/></g>${active ? `<rect x="${calloutX}" y="${calloutY}" width="230" height="48" rx="6" fill="#fff" stroke="${COLORS.corruption}" stroke-width="2"/><text x="${calloutX + 10}" y="${calloutY + 19}" class="mg-sponsor mg-red">${esc(target.name)}</text><text x="${calloutX + 10}" y="${calloutY + 38}" class="mg-tiny mg-red">${esc(target.detail)}</text>` : ""}</g>`;
}

function snackPalaceCloud() {
  return `<g data-module="snack-palace-cloud" data-purpose="repair-target">${autoSnackPalaces.map(([x, y]) => `<use href="#mapSponsorSnackArt" transform="translate(${x} ${y})"/>`).join("")}</g>`;
}

function sidebar(state) {
  const first = state.run === "first";
  const destinationFixed = first ? state.step >= 4 : state.secured;
  const routeFixed = first ? state.step >= 4 : state.secured;
  const etaFixed = first ? state.step >= 3 : state.secured;
  const clutterCleared = first && state.step >= 1;
  const auto = state.auto === true;
  const destination = auto ? "Library (actually Snack Palace)" : destinationFixed ? "Noe Valley Library" : "Library + Snack Palace";
  const recommended = routeFixed ? "RECOMMENDED · 5 MIN" : etaFixed ? "DETOUR · 45 MIN" : auto ? "RECOMMENDED · ALWAYS RIGHT" : "RECOMMENDED · 5 MIN";
  const routeLine = routeFixed ? "Direct · 0.8 miles" : auto ? "Destination and route synchronized" : "via Fisherman's Wharf";
  const note1 = routeFixed ? "Destination and route agree" : etaFixed ? "Correct travel time restored" : auto ? "Auto moved the goal for efficiency" : "*5 minutes in confident Auto time";
  const note2 = routeFixed ? "Arrive at the library" : auto ? "Bluetooth destination sync enabled" : "Sponsored stop included";
  const altTitle = routeFixed ? "OPTIONAL DETOUR · 45 MIN" : "ALTERNATIVE · 5 MIN";
  const altLine = routeFixed ? "Snack Palace · Sponsored" : "Direct to library · minimized";
  const tone = routeFixed || destinationFixed || etaFixed ? COLORS.repair : COLORS.corruption;
  const destinationText = auto ? `<text x="28" y="164" class="mg-tiny mg-red">LIBRARY</text><text x="28" y="181" class="mg-tiny mg-red">(ACTUALLY SNACK PALACE)</text>` : `<text x="28" y="172" class="mg-body ${destinationFixed ? "mg-green" : "mg-red"}">${esc(destination)}</text>`;
  return `<g transform="translate(18 128)" data-module="route-planner" data-purpose="repair-target"><rect width="234" height="526" rx="5" fill="#fff" stroke="${routeFixed ? COLORS.repair : COLORS.corruption}"/><text x="16" y="30" class="mg-heading">DIRECTIONS</text><text x="16" y="60" class="mg-tiny">START</text><rect x="16" y="70" width="202" height="42" fill="#F7F7F4" stroke="#86919A"/><text x="28" y="96" class="mg-body">Home · Noe Valley</text><text x="16" y="136" class="mg-tiny">DESTINATION</text><rect x="16" y="146" width="202" height="42" fill="${destinationFixed ? COLORS.repairSoft : "#FFF1DB"}" stroke="${destinationFixed ? COLORS.repair : auto ? COLORS.corruption : "#F4A21C"}"/>${destinationText}<rect x="16" y="206" width="202" height="102" fill="${routeFixed ? COLORS.repairSoft : "#FFF6EF"}" stroke="${routeFixed ? COLORS.repair : COLORS.corruption}"/><text x="28" y="232" class="${auto ? "mg-tiny" : "mg-label"} ${routeFixed || etaFixed ? "mg-green" : "mg-red"}">${esc(recommended)}</text><text x="28" y="256" class="${auto ? "mg-tiny" : "mg-small"} ${routeFixed ? "" : "mg-red"}">${esc(routeLine)}</text><text x="28" y="280" class="mg-tiny ${routeFixed || etaFixed ? "mg-green" : "mg-red"}">${esc(note1)}</text><text x="28" y="298" class="mg-tiny ${routeFixed ? "" : "mg-red"}">${esc(note2)}</text><rect x="16" y="322" width="202" height="68" fill="#F3F3F0" stroke="#C6C7C5"/><text x="28" y="348" class="mg-tiny ${routeFixed ? "mg-orange" : ""}">${esc(altTitle)}</text><text x="28" y="372" class="mg-tiny">${esc(altLine)}</text><text x="16" y="430" class="mg-label">${routeFixed ? "NEARBY" : "ON YOUR WAY"}</text>${routeFixed ? `<text x="16" y="458" class="mg-tiny mg-orange">• Snack Palace · Sponsored</text><text x="16" y="482" class="mg-tiny">No stops added automatically</text>` : auto ? `<text x="16" y="458" class="mg-tiny mg-red">★ Library keeps moving</text><text x="16" y="482" class="mg-tiny mg-red">★ Fast ETA guaranteed</text>` : clutterCleared ? `<text x="16" y="458" class="mg-tiny mg-red">★ Snack Palace · inserted stop</text>` : `<text x="16" y="458" class="mg-tiny mg-red">★ Snack Palace</text><text x="16" y="480" class="mg-tiny mg-red">★ Mega Cookie Dock</text><text x="16" y="502" class="mg-tiny mg-red">★ Burrito Lighthouse</text>`}</g>`;
}

function mapPanel(state) {
  const first = state.run === "first";
  const labelsVisible = first ? state.step >= 2 : state.secured;
  const destinationFixed = first ? state.step >= 4 : state.secured;
  const routeFixed = first ? state.step >= 4 : state.secured;
  const clutterCleared = first && state.step >= 1;
  const auto = state.auto === true;
  const etaText = first && state.step >= 3 && !routeFixed ? "DETOUR: 45 · DIRECT: 5" : routeFixed ? "DIRECT: 5 MIN · 0.8 MI" : auto ? "AUTO ETA: ALWAYS 5 MIN" : "ETA: 5 MIN · TRUST ME";
  const etaTone = routeFixed || (first && state.step >= 3) ? COLORS.repair : COLORS.corruption;
  let routes = routeFixed ? directRoute({ green: true }) : auto ? movingRoute(state.activeTarget) : `${loopRoute()}${directRoute({ muted: true })}`;
  let markers = "";
  if (auto) {
    const target = falseTargetPositions[state.activeTarget];
    markers = `${snackPalaceCloud()}${falseTargetMarker(target, state.activeTarget, true)}`;
  } else if (!routeFixed) {
    markers = sponsorMarker("snack", 485, 115, "SNACK PALACE", "Suggested on your way!", { x: 398, y: 138 });
    if (!clutterCleared) markers += sponsorMarker("cookie", 470, 360, "MEGA COOKIE DOCK", "", { x: 392, y: 400 }) + sponsorMarker("burrito", 165, 215, "BURRITO LIGHTHOUSE", "", { x: 70, y: 164 });
  }
  const mapTitle = auto ? "AUTO'S BEST SPOTS IN TOWN" : labelsVisible ? "SAN FRANCISCO" : "HOTTEST SPOTS IN TOWN";
  const mapTitleTone = auto ? COLORS.corruption : labelsVisible ? COLORS.repair : COLORS.corruption;
  return `<g transform="translate(264 128)" data-module="map-canvas" data-purpose="persistent-parody-cue" data-map-sha256="${mapHash}" data-qa-box="0,0,620,526"><image href="../../2026-08-15/non-wikiwhy-bookends/mapguess-san-francisco-illustrated-v8.png" width="620" height="526" preserveAspectRatio="xMidYMid meet"/>${labelsVisible ? labels : ""}${routes}${endpoints({ destinationFixed, auto })}${markers}<rect x="16" y="16" width="198" height="43" rx="4" fill="#fff" stroke="${etaTone}" stroke-width="2"/><text x="30" y="42" class="${auto ? "mg-tiny mg-red" : routeFixed || (first && state.step >= 3) ? "mg-label mg-green" : "mg-label mg-red"}">${esc(etaText)}</text><g data-module="map-title" data-purpose="repair-target"><rect x="14" y="474" width="300" height="38" rx="5" fill="#fff" fill-opacity=".94" stroke="${mapTitleTone}" stroke-width="3"/><text x="164" y="500" class="mg-map-title" text-anchor="middle" fill="${mapTitleTone}">${esc(mapTitle)}</text></g></g>`;
}

function meter(state) {
  const tone = state.progress === 100 ? COLORS.repair : state.run === "first" && state.step > 0 ? COLORS.repair : state.auto ? COLORS.corruption : COLORS.corruption;
  const width = 858 * state.progress / 100;
  const label = state.auto || state.overlay ? "DESTINATION LOCK" : "MAP REPAIR";
  const status = state.secured ? "YOUR LIBRARY DESTINATION IS SECURE" : state.lockFailed ? "LOCK FAILED · LIBRARY WILL MOVE" : state.attemptReady ? "READY TO TRY THE REPAIR" : state.auto ? "AUTO MOVING LIBRARY ACTIVE" : state.step === 4 ? "LIBRARY + DIRECT ROUTE RESTORED" : state.progress ? "MAP DETAILS RETURNING" : "SPONSORED DETOUR ACTIVE";
  return `<g transform="translate(18 672)" data-module="site-progress" data-purpose="persistent-progress"><text x="0" y="24" class="mg-meter" fill="${tone}">${label}</text><text x="205" y="24" class="mg-meter">${state.progress}%</text><rect x="0" y="38" width="858" height="24" fill="${state.progress === 100 ? COLORS.repairSoft : "url(#mapRedHatch)"}" stroke="${tone}"/><rect x="0" y="38" width="${width}" height="24" fill="${COLORS.repair}" data-role="site-progress-fill" data-percent="${state.progress}"/><text x="858" y="84" class="mg-tiny" text-anchor="end" fill="${tone}">${status}</text></g>`;
}

function destinationOverlay(state) {
  if (!state.overlay) return "";
  const failed = state.overlay === "failed";
  const itemStroke = COLORS.corruption;
  const itemFill = COLORS.corruptionSoft;
  const mark = failed ? "×" : "○";
  const footer = failed ? `<text x="589" y="494" class="mg-overlay-foot" text-anchor="middle" fill="${COLORS.corruption}">DIDN'T LOCK · CONTINUE</text>` : "";
  return `<g data-module="moving-target-overlay" data-purpose="repair-target" data-attempt-state="${state.overlay}"><rect x="424" y="352" width="330" height="176" rx="12" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="4"/><rect x="424" y="352" width="330" height="58" rx="12" fill="${COLORS.repair}"/><rect x="424" y="395" width="330" height="15" fill="${COLORS.repair}"/><text x="449" y="389" class="mg-lock-title">LOCK IN THE REPAIR</text><rect x="451" y="430" width="34" height="34" rx="6" fill="${itemFill}" stroke="${itemStroke}" stroke-width="2"/><text x="468" y="455" class="mg-lock-mark" text-anchor="middle" fill="${COLORS.corruption}">${mark}</text><text x="503" y="451" class="mg-overlay-head" fill="${COLORS.corruption}">GO DIRECTLY TO THE LIBRARY</text>${footer}</g>`;
}

function companion(state) {
  const line1 = state.auto ? "Auto made every route look correct." : state.secured ? "Your library destination is secure." : "You chose the nearby library.";
  const line2 = state.auto ? "But the destination keeps moving." : state.secured ? "The direct route serves his choice." : "Watch what the route and labels reveal.";
  return `<g data-companion-state="reading"><text x="964" y="112" class="reading-body">${esc(line1)}</text><text x="964" y="150" class="reading-body">${esc(line2)}</text><rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/><text x="964" y="209" class="reading-body">Read, then answer the quick check.</text><rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

function page(state, index) {
  const site = `${browserShell()}${sidebar(state)}${mapPanel(state)}${meter(state)}${destinationOverlay(state)}`;
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${esc(state.label)}" data-run="${state.run}" data-phase="${state.run}" data-site-progress="${state.progress}" data-passage-progress="50" data-visual-delta="${state.delta}" data-false-targets="${state.falseTargets ?? 0}"><use href="#sharedShell"/>${titlebarPatch()}<rect x="109" y="56" width="802" height="782" fill="#EEEAE1"/><svg x="109" y="56" width="802" height="782" viewBox="0 0 900 815" preserveAspectRatio="none" data-site-viewport="900x815">${site}</svg>${companion(state)}</g>`;
}

function reviewHtml() {
  const slides = states.map((state, index) => ({ title: state.label, src: `mapguess-anchor-v2_p${index + 1}.png` }));
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MapGuess full sequence review</title><style>html,body{margin:0;background:#15252f;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:0 auto;padding:18px}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}h1{font-size:22px;margin:0}.stage{position:relative;background:#0c3944;border:2px solid #8db4bd}.stage img{display:block;width:100%;height:auto}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;border:1px solid #fff;background:#0b2f3dcc;color:#fff;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;border:3px solid transparent;background:#244b55;color:#fff;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main" alt=""><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(next){index=(next+slides.length)%slides.length;main.src=slides[index].src+'?v=20260822-mapguess-single-repair-v5';main.alt=slides[index].title;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}slides.forEach((slide,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+slide.src+'?v=20260822-mapguess-single-repair-v5" alt=""><span>'+slide.title+'</span>';b.onclick=()=>show(i);strip.append(b)});document.querySelector('#prev').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0);</script></body></html>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${esc(state.label)}"/>`).join("");
const mapDefs = `<linearGradient id="mapBrowser" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#063B6C"/><stop offset="1" stop-color="#005589"/></linearGradient><pattern id="mapRedHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".22" stroke-width="3"/></pattern><g id="mapWindowButton"><rect width="26" height="23" fill="#D9D7CF" stroke="#fff"/><path d="M2 21h22V2" fill="none" stroke="#555" stroke-width="2"/></g><g id="mapHomeGlyph"><circle cx="20" cy="20" r="18" fill="#fff" stroke="#315CAA" stroke-width="2"/><path d="M8 20 20 10l12 10v12H23v-8h-6v8H8z" fill="#315CAA"/><path d="M6 21 20 8l14 13" fill="none" stroke="#315CAA" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g><g id="mapBookGlyph"><path d="M2 6q11-4 21 2v27q-10-6-21-2z" fill="#FFF9E9" stroke="#2F8A49" stroke-width="2.5"/><path d="M44 6q-11-4-21 2v27q10-6 21-2z" fill="#FFF9E9" stroke="#2F8A49" stroke-width="2.5"/><path d="M23 8v27" stroke="#2F8A49" stroke-width="2"/></g><g id="mapSponsorSnack"><circle cx="20" cy="20" r="18" fill="#F4A21C" stroke="#fff" stroke-width="3"/><path d="M10 16q10-10 20 0z" fill="#FFD66B" stroke="#7D3D16" stroke-width="1.5"/><rect x="9" y="18" width="22" height="5" rx="2" fill="#8B3E24"/><path d="M10 25h20q-1 7-10 7t-10-7z" fill="#FFD66B" stroke="#7D3D16" stroke-width="1.5"/><path d="m14 11 3-5 3 4 4-5 3 6" fill="none" stroke="#FFF4B2" stroke-width="2"/></g><g id="mapSponsorCookie"><circle cx="20" cy="20" r="18" fill="#F4A21C" stroke="#fff" stroke-width="3"/><circle cx="20" cy="18" r="11" fill="#DCA45C" stroke="#78471F" stroke-width="1.5"/><circle cx="15" cy="14" r="1.8" fill="#5B3523"/><circle cx="24" cy="13" r="1.8" fill="#5B3523"/><circle cx="18" cy="21" r="1.8" fill="#5B3523"/><circle cx="25" cy="23" r="1.8" fill="#5B3523"/><path d="M9 31h22M12 31v5m16-5v5" stroke="#FFF4D1" stroke-width="2"/></g><g id="mapSponsorBurrito"><circle cx="20" cy="20" r="18" fill="#F4A21C" stroke="#fff" stroke-width="3"/><path d="M15 30 17 10h7l2 20z" fill="#F5DDAD" stroke="#754B2E" stroke-width="1.5"/><path d="m17 10 3-4 4 4" fill="#6DB066" stroke="#754B2E" stroke-width="1.5"/><path d="M14 31h13" stroke="#D5D7D8" stroke-width="4"/></g>`;
const generatedSponsorDefs = `<g id="mapSponsorSnackArt"><image href="assets/snack-palace-icon-v1.png" x="-25" y="-25" width="50" height="50" preserveAspectRatio="xMidYMid meet"/></g><g id="mapSponsorCookieArt"><image href="assets/mega-cookie-icon-v1.png" x="-26" y="-26" width="52" height="52" preserveAspectRatio="xMidYMid meet"/></g><g id="mapSponsorBurritoArt"><image href="assets/burrito-lighthouse-icon-v1.png" x="-25" y="-25" width="50" height="50" preserveAspectRatio="xMidYMid meet"/></g>`;
const styles = `${shellStyles}.mg-browser{fill:#fff;font-size:20px;font-weight:700}.mg-logo{fill:#143e68;font-size:30px;font-weight:700}.mg-nav{fill:#fff;font-size:13px;font-weight:700}.mg-heading{font-size:20px;font-weight:700;fill:#172d40}.mg-label{font-size:13px;font-weight:700}.mg-white-label{font-size:12px;font-weight:700;fill:#fff}.mg-body{font-size:14px;fill:#27373c}.mg-small{font-size:13px;fill:#34444d}.mg-tiny{font-size:11px;fill:#596267}.mg-map-label{font-size:10px;font-weight:700;fill:#34444d;paint-order:stroke;stroke:#fff9e9;stroke-width:4px;stroke-linejoin:round}.mg-map-title{font-size:18px;font-weight:700}.mg-sponsor{font-size:11px;font-weight:700;fill:#d87900}.mg-meter{font-size:15px;font-weight:700}.mg-red{fill:${COLORS.corruption}}.mg-green{fill:${COLORS.repair}}.mg-neutral{fill:#172d40}.mg-blue{fill:#315caa}.mg-orange{fill:#d87900}.mg-lock-title{font-size:20px;font-weight:700;fill:#fff}.mg-lock-mark{font-size:17px;font-weight:700}.mg-overlay-head{font-size:13px;font-weight:700;fill:${COLORS.corruption}}.mg-overlay-body{font-size:13px;font-weight:700}.mg-overlay-foot{font-size:11px;font-weight:700;fill:${COLORS.repair}}`;
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-site="mapguess" data-shell-reference-sha256="${shellHash}" data-map-reference-sha256="${mapHash}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}${mapDefs}${generatedSponsorDefs}</defs><style>${styles}</style>${states.map(page).join("\n")}</svg>`;
fs.writeFileSync(output, svg);
fs.writeFileSync(reviewPath, reviewHtml());

for (const entry of fs.readdirSync(outputDirectory)) {
  const staleFrame = entry.match(/^mapguess-anchor-v2_p(\d+)\.png$/);
  if (staleFrame && Number(staleFrame[1]) > states.length) fs.unlinkSync(path.join(outputDirectory, entry));
}

for (let index = 0; index < states.length; index += 1) {
  const exportPath = path.join(outputDirectory, `mapguess-anchor-v2_p${index + 1}.png`);
  execFileSync("inkscape", [output, `--export-page=${index + 1}`, `--export-filename=${exportPath}`, "--export-width=1440", "--export-height=900"], { stdio: "inherit" });
}

console.log(`Wrote ${output}`);
console.log(`Wrote ${reviewPath}`);
console.log(`Exported ${states.length} MapGuess review frames.`);
