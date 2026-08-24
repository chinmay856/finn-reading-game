#!/usr/bin/env node

import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { buildInternetRecoverySiteIdentityPatch, INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outDir = path.resolve("docs/design/screens/2026-08-16/searchish-production");
const outSvg = path.join(outDir, "searchish-anchor-master-v3.svg");
const outHtml = path.join(outDir, "searchish-anchor-review-v3.html");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const aiArtPath = path.join(outDir, "assets/searchish-ai-river-book-v1.jpg");
const editionStripPath = path.join(outDir, "assets/searchish-edition-strip-v1.jpg");
const studyNotesPath = path.join(outDir, "assets/searchish-study-notes-v1.jpg");

for (const required of [shellPath, aiArtPath, editionStripPath, studyNotesPath]) {
  if (!fs.existsSync(required)) throw new Error(`Missing required Search-ish asset: ${required}`);
}
fs.mkdirSync(outDir, { recursive: true });

const shell = fs.readFileSync(shellPath, "utf8");
const shellDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!shellDefs || !shellStyles) throw new Error("Reviewed shared shell is unavailable.");
const shellHash = crypto.createHash("sha256").update(shellDefs).digest("hex");
const referenceDefs = shellDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');
const aiArtAsset = path.relative(outDir, aiArtPath);
const editionStripAsset = path.relative(outDir, editionStripPath);
const studyNotesAsset = path.relative(outDir, studyNotesPath);

const states = Object.freeze([
  { id: "initial", label: "Answer and ads crowd out the search", progress: 0, run: "first", repair: 0, delta: 0 },
  { id: "overview-corrected", label: "AI overview corrected", progress: 17, run: "first", repair: 1, delta: 1 },
  { id: "overview-optional", label: "AI overview made optional", progress: 33, run: "first", repair: 2, delta: 2 },
  { id: "paid-labeled", label: "Paid placement labeled", progress: 50, run: "first", repair: 3, delta: 2 },
  { id: "library-restored", label: "Library result restored", progress: 67, run: "first", repair: 4, delta: 3 },
  { id: "bookstore-restored", label: "Neighborhood bookstore restored", progress: 83, run: "first", repair: 5, delta: 3 },
  { id: "hierarchy-restored", label: "Useful search hierarchy restored", progress: 100, run: "first", repair: 6, delta: 3 },
  { id: "auto-overfix", label: "Auto finishes the search", progress: 0, run: "auto", auto: true },
  { id: "lock-open", label: "Lock in the search repair", progress: 0, run: "lock", auto: true, checklist: 0 },
  { id: "ai-lock", label: "AI answer corrected", progress: 25, run: "lock", lock: 1, checklist: 1 },
  { id: "optional-lock", label: "AI made optional", progress: 50, run: "lock", lock: 2, checklist: 2 },
  { id: "options-lock", label: "Real options restored", progress: 75, run: "lock", lock: 3, checklist: 3 },
  { id: "search-lock", label: "Search control restored", progress: 100, run: "lock", lock: 4, checklist: 4 },
  { id: "secured", label: "Search repair secured", progress: 100, run: "secured", secured: true },
]);

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function shellPatch() {
  return buildInternetRecoverySiteIdentityPatch({ siteUrl: "www.search-ish.com", taskLabel: "SEARCH-ISH", taskClass: "si-task", taskButtonWidth: 190 });
}

function logo() {
  const letters = [["S","#4285F4"],["e","#EA4335"],["a","#FBBC05"],["r","#4285F4"],["c","#34A853"],["h","#EA4335"]];
  return `<text x="131" y="91" class="si-logo">${letters.map(([letter,color]) => `<tspan fill="${color}">${letter}</tspan>`).join("")}<tspan fill="#25344A">-ish</tspan></text>`;
}

function header(state) {
  const disabled = state.auto || (state.run === "lock" && (state.lock || 0) < 4);
  const query = disabled ? "AUTO ALREADY SEARCHED FOR YOU" : "print copy of Adventures of Huckleberry Finn";
  return `<g data-module="search-header" data-purpose="persistent parody cue" data-search-state="${disabled ? "disabled" : "available"}">
    <rect x="109" y="56" width="802" height="95" fill="#fff"/>
    ${logo()}
    <rect x="288" y="66" width="570" height="42" rx="21" fill="${disabled ? "#F1F3F4" : "#fff"}" stroke="${disabled ? COLORS.corruption : "#BCC2C8"}" stroke-width="2"/>
    <text x="310" y="92" class="si-query ${disabled ? "si-red" : ""}">${query}</text>
    ${disabled ? `<circle cx="825" cy="87" r="12" fill="${COLORS.corruptionSoft}"/><path d="M819 81l12 12m0-12-12 12" stroke="${COLORS.corruption}" stroke-width="2"/>` : `<circle cx="824" cy="84" r="9" fill="none" stroke="#394854" stroke-width="3"/><line x1="831" y1="91" x2="840" y2="100" stroke="#394854" stroke-width="3"/>`}
    <g class="si-nav"><text x="292" y="129">ALL</text><text x="341" y="129">SHOPPING</text><text x="418" y="129">BOOKS</text><text x="471" y="129">IMAGES</text><text x="532" y="129">NEARBY</text></g>
    <line x1="288" y1="138" x2="858" y2="138" stroke="#D6DADD"/>
  </g>`;
}

function editionArt(x, y, width = 280, height = 112) {
  return `<image data-module="edition-art" data-purpose="persistent parody cue" href="${editionStripAsset}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;
}

function aiCard({ y, h, repaired, optional = false, auto = false }) {
  if (auto) return autoAnswer();
  const color = repaired ? COLORS.repair : COLORS.corruption;
  const fill = repaired ? "#F4F8FE" : COLORS.corruptionSoft;
  if (optional) return `<g data-module="ai-overview" data-purpose="repair target" data-semantic-state="repaired" data-collapsed="true">
    <rect x="129" y="${y}" width="762" height="54" rx="10" fill="${fill}" stroke="${color}" stroke-width="2"/>
    <text x="151" y="${y+34}" class="si-kicker" fill="${color}">✦ AI OVERVIEW</text>
    <rect x="742" y="${y+12}" width="126" height="30" rx="15" fill="#fff" stroke="#9BB0CA"/>
    <text x="805" y="${y+32}" class="si-small" text-anchor="middle" fill="#416B9D">SHOW MORE</text>
  </g>`;
  const heading = repaired ? "ADVENTURES OF HUCKLEBERRY FINN" : "I CAN HELP WITH THE BOOK.";
  const lines = repaired
    ? ["A novel by Mark Twain, published in the 1880s.", "Print copies are available from libraries and bookstores."]
    : ["You asked for a print copy. I can summarize it instead.", "Huckleberry Finn follows a boy traveling on the Mississippi River."];
  const imageWidth = 214;
  const imageHeight = Math.max(78, h - 30);
  const imageX = 867 - imageWidth;
  return `<g data-module="ai-overview" data-purpose="repair target" data-semantic-state="${repaired ? "repaired" : "corrupt"}">
    <rect x="129" y="${y}" width="762" height="${h}" rx="10" fill="${fill}" stroke="${color}" stroke-width="2"/>
    <text x="151" y="${y+25}" class="si-kicker" fill="${color}">✦ AI OVERVIEW</text>
    <text x="151" y="${y+54}" class="si-ai-title" fill="${repaired ? "#23364A" : color}">${heading}</text>
    <text x="151" y="${y+81}" class="si-body">${lines[0]}</text>
    ${h >= 112 ? `<text x="151" y="${y+104}" class="si-body">${lines[1]}</text>` : ""}
    ${!repaired && h >= 140 ? `<text x="151" y="${y+127}" class="si-body">There is a raft, a journey, and many complicated adventures...</text>` : ""}
    ${repaired && h >= 132 ? `<text x="151" y="${y+129}" class="si-source" fill="${COLORS.repairDark}">SOURCES: LIBRARY CATALOG · PUBLISHER HISTORY</text>` : ""}
    <image href="${aiArtAsset}" x="${imageX}" y="${y+12}" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid slice"/>
    <rect x="${imageX}" y="${y+12}" width="${imageWidth}" height="${imageHeight}" rx="7" fill="none" stroke="${color}" stroke-width="1.5"/>
  </g>`;
}

function sponsoredProducts({ y, h = 154, labeled = false, compact = false }) {
  const border = labeled ? COLORS.repair : COLORS.corruption;
  const semantic = labeled ? "repaired" : "corrupt";
  const label = labeled ? "SPONSORED PRODUCTS · PAID PLACEMENT" : "ad";
  const labelClass = labeled ? "si-paid-label" : "si-ad-tiny";
  const artX = 600;
  const artY = y + 34;
  const artW = 266;
  const artH = Math.min(compact ? 77 : 93, h - 52);
  return `<g data-module="paid-results" data-purpose="repair target" data-semantic-state="${semantic}">
    <rect x="129" y="${y}" width="762" height="${h}" rx="8" fill="#FFF9EF" stroke="${border}" stroke-width="2"/>
    ${labeled ? `<rect x="145" y="${y+12}" width="238" height="25" rx="12" fill="#E8A928"/><text x="264" y="${y+30}" class="${labelClass}" text-anchor="middle">${label}</text>` : `<text x="146" y="${y+18}" class="${labelClass}" fill="${COLORS.corruption}">${label}</text>`}
    <text x="${labeled ? 402 : 147}" y="${y+31}" class="si-store-title">Internet Mega Bookstore</text>
    <text x="151" y="${y+62}" class="si-result-title">Adventures of Huckleberry Finn</text>
    <text x="151" y="${y+87}" class="si-body">Three print editions · fastest shipping first</text>
    <text x="151" y="${y+116}" class="si-price">Hardcover $18.99</text>
    <text x="151" y="${y+137}" class="si-price">Paperback $24.99 · School edition $39.99</text>
    ${editionArt(artX,artY,artW,artH)}
    <text x="638" y="${y+h-9}" class="si-edition-price" text-anchor="middle">$18.99</text>
    <text x="733" y="${y+h-9}" class="si-edition-price" text-anchor="middle">$24.99</text>
    <text x="826" y="${y+h-9}" class="si-edition-price" text-anchor="middle">$39.99</text>
  </g>`;
}

function resultFavicon(kind, x, y, color) {
  if (kind === "library") return `<circle cx="${x}" cy="${y}" r="13" fill="#3274B9"/><path d="M${x-9} ${y-6}q6-2 9 2q3-4 9-2v12q-6-2-9 2q-3-4-9-2zM${x} ${y-4}v12" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>`;
  if (kind === "bookstore") return `<circle cx="${x}" cy="${y}" r="13" fill="#D87835"/><path d="M${x-8} ${y-2}h16v9h-16zm-2 0 3-6h14l3 6m-12 2v7" fill="none" stroke="#fff" stroke-width="2"/>`;
  if (kind === "gutenberg") return `<circle cx="${x}" cy="${y}" r="13" fill="#F5F5F2" stroke="#A7ADB2"/><text x="${x}" y="${y+4}" class="si-favicon-pg" text-anchor="middle">PG</text>`;
  return `<circle cx="${x}" cy="${y}" r="13" fill="#F5F5F2" stroke="#A7ADB2"/><path d="M${x-8} ${y-5}h16l-8-5zm1 2h3v8h-3zm5 0h3v8h-3zm5 0h3v8h-3zm-10 10h18" fill="#232629"/>`;
}

function organicResult({ y, kind, restored = false, faint = false, x = 129, width = 762, h = 72 }) {
  const library = kind === "library";
  const color = restored ? COLORS.repair : COLORS.corruption;
  const opacity = faint ? 0.27 : 1;
  const title = library ? "Public Library — print copy available" : "Neighborhood Books — new and used copies";
  const detail = library ? "Free to borrow · reserve a copy · several editions" : "Local pickup · compare editions in person";
  const source = library ? "CITY LIBRARY" : "NEIGHBORHOOD BOOKS";
  const url = library ? "www.citylibrary.org/catalog" : "www.neighborhoodbooks.com";
  return `<g data-module="${kind}-result" data-purpose="repair target" data-semantic-state="${restored ? "repaired" : "corrupt"}" opacity="${opacity}">
    <rect x="${x}" y="${y}" width="${width}" height="${h}" rx="7" fill="${restored ? COLORS.repairSoft : "#fff"}" stroke="${color}" stroke-width="${restored ? 2 : 1}"/>
    ${resultFavicon(kind,x+24,y+24,color)}
    <text x="${x+48}" y="${y+18}" class="si-source" fill="${restored ? COLORS.repairDark : color}">${source}</text>
    <text x="${x+width-18}" y="${y+18}" class="si-url" text-anchor="end">${url}</text>
    <text x="${x+48}" y="${y+43}" class="si-link">${title}</text>
    <text x="${x+48}" y="${y+63}" class="si-small">${detail}</text>
  </g>`;
}

function onlineRow(y, restored, h = 104) {
  return `<g data-module="free-online-results" data-purpose="repair target" data-semantic-state="${restored ? "repaired" : "corrupt"}" opacity="${restored ? 1 : .22}">
    <rect x="129" y="${y}" width="762" height="${h}" rx="7" fill="${restored ? "#F3F8FD" : "#fff"}" stroke="${restored ? COLORS.repair : COLORS.corruption}"/>
    <text x="151" y="${y+18}" class="si-source" fill="${restored ? COLORS.repairDark : COLORS.corruption}">FREE ONLINE EDITIONS</text>
    ${resultFavicon("gutenberg",154,y+44,COLORS.repair)}
    <text x="177" y="${y+39}" class="si-online-title">Project Gutenberg</text><text x="177" y="${y+55}" class="si-url">gutenberg.org/files</text>
    <text x="848" y="${y+47}" class="si-small" text-anchor="end">Read online or print chapters</text>
    <line x1="145" y1="${y+65}" x2="875" y2="${y+65}" stroke="#CAD7E1"/>
    ${resultFavicon("archive",154,y+84,COLORS.repair)}
    <text x="177" y="${y+80}" class="si-online-title">Internet Archive</text><text x="177" y="${y+96}" class="si-url">archive.org/details</text>
    <text x="848" y="${y+88}" class="si-small" text-anchor="end">Borrow or download available formats</text>
  </g>`;
}

function countLine() {
  return `<text x="131" y="153" class="si-count">About 1,240 results</text>`;
}

function viewMore(y = 648) {
  return `<g data-module="view-more" data-purpose="persistent parody cue"><text x="510" y="${y}" class="si-view-more" text-anchor="middle">VIEW MORE RESULTS</text><path d="M503 ${y+8}l7 7 7-7" fill="none" stroke="#516370" stroke-width="2"/></g>`;
}

function cleanHierarchy({ search = true } = {}) {
  return `<g data-results-layout="ranked">
    ${countLine()}
    ${aiCard({y:160,h:54,repaired:true,optional:true})}
    ${organicResult({y:226,kind:"library",restored:true})}
    ${organicResult({y:308,kind:"bookstore",restored:true})}
    ${onlineRow(390,true)}
    ${sponsoredProducts({y:506,h:145,labeled:true,compact:true})}
    ${viewMore()}
  </g>`;
}

function firstRunResults(state) {
  const r = state.repair;
  if (r >= 6) return cleanHierarchy();
  const corrected = r >= 1;
  const optional = r >= 2;
  const labeled = r >= 3;
  const library = r >= 4;
  const bookstore = r >= 5;
  if (!optional) return `<g data-results-layout="crowded">${countLine()}${aiCard({y:160,h:162,repaired:corrected})}${sponsoredProducts({y:334,h:145,labeled})}${organicResult({y:491,kind:"library",restored:false,faint:true})}${organicResult({y:575,kind:"bookstore",restored:false,faint:true})}${viewMore()}</g>`;
  if (r <= 3) return `<g data-results-layout="ai-shrunk">${countLine()}${aiCard({y:160,h:54,repaired:true,optional:true})}${sponsoredProducts({y:226,h:145,labeled})}${organicResult({y:383,kind:"library",restored:false,faint:true})}${organicResult({y:467,kind:"bookstore",restored:false,faint:true})}${onlineRow(551,false,100)}${viewMore()}</g>`;
  return `<g data-results-layout="options-returning">${countLine()}${aiCard({y:160,h:54,repaired:true,optional:true})}${sponsoredProducts({y:226,h:145,labeled:true,compact:true})}${organicResult({y:383,kind:"library",restored:library,faint:!library})}${onlineRow(467,library,100)}${organicResult({y:579,kind:"bookstore",restored:bookstore,faint:!bookstore})}${viewMore()}</g>`;
}

function autoAnswer() {
  return `<g data-module="auto-answer" data-purpose="repair target" data-semantic-state="corrupt">
    ${countLine()}
    <rect x="129" y="160" width="762" height="474" rx="11" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="3"/>
    <text x="151" y="190" class="si-kicker" fill="${COLORS.corruption}">AUTO SEARCH · BLUETOOTH ENABLED</text>
    <text x="151" y="229" class="si-auto-title" fill="${COLORS.corruption}">HUCKLEBERRY FINN SHORTCUT FOUND.</text>
    <text x="151" y="258" class="si-body">Auto found the fastest printed way to get the main ideas.</text>
    <text x="151" y="281" class="si-body">One answer · one bookstore · one click.</text>
    <rect x="151" y="298" width="718" height="218" rx="8" fill="#FFF8EE" stroke="${COLORS.corruption}" stroke-width="2"/>
    <rect x="169" y="314" width="142" height="24" rx="12" fill="#E8A928"/><text x="240" y="331" class="si-paid-label" text-anchor="middle">SPONSORED · PAID</text>
    <text x="169" y="368" class="si-auto-sub" fill="${COLORS.corruption}">HUCKLEBERRY FINN STUDY NOTES</text>
    <text x="169" y="397" class="si-store-title">Internet Mega Bookstore</text>
    <text x="169" y="423" class="si-body">Fast summary edition · delivery tomorrow</text>
    <text x="169" y="450" class="si-price">$16.99</text>
    <rect x="169" y="468" width="270" height="31" rx="16" fill="${COLORS.corruption}"/><text x="304" y="489" class="si-paid-label" text-anchor="middle">AUTO OPENED THIS OPTION</text>
    <image href="${studyNotesAsset}" x="641" y="314" width="194" height="186" preserveAspectRatio="xMidYMid slice"/>
    <rect x="641" y="314" width="194" height="186" rx="7" fill="none" stroke="${COLORS.corruption}" stroke-width="1.5"/>
    <rect x="151" y="528" width="718" height="44" rx="6" fill="#fff" stroke="${COLORS.corruption}"/><text x="171" y="557" class="si-auto-sub" fill="${COLORS.corruption}">OTHER RESULTS (47) · COLLAPSED</text>
    <rect x="151" y="584" width="718" height="32" rx="6" fill="${COLORS.corruption}"/><text x="510" y="606" class="si-auto-button" text-anchor="middle">ONE BEST ANSWER · ZERO EXTRA SEARCHING</text>
  </g>`;
}

function lockResults(state) {
  const lock = state.lock || 0;
  if (lock === 0) return autoAnswer();
  if (lock === 1) return `<g data-results-layout="auto-ai-corrected">${countLine()}${aiCard({y:160,h:162,repaired:true,optional:false})}${sponsoredProducts({y:334,h:145,labeled:true,compact:true})}<rect x="129" y="491" width="762" height="118" rx="8" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="2"/><text x="151" y="527" class="si-auto-sub" fill="${COLORS.corruption}">OTHER RESULTS (47) · STILL COLLAPSED</text><text x="151" y="557" class="si-body">The answer is accurate, but it still takes over the search.</text>${viewMore(594)}</g>`;
  if (lock === 2) return `<g data-results-layout="auto-ai-optional">${countLine()}${aiCard({y:160,h:54,repaired:true,optional:true})}${sponsoredProducts({y:226,h:145,labeled:true,compact:true})}<rect x="129" y="383" width="762" height="150" rx="8" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="2"/><text x="151" y="423" class="si-auto-sub" fill="${COLORS.corruption}">OTHER RESULTS (47) · STILL COLLAPSED</text><text x="151" y="455" class="si-body">The useful choices are still below the paid result.</text>${viewMore(510)}</g>`;
  if (lock === 3) return cleanHierarchy();
  return cleanHierarchy();
}

function results(state) {
  if (state.run === "first") return firstRunResults(state);
  if (state.auto) return autoAnswer();
  if (state.run === "lock") return lockResults(state);
  return cleanHierarchy();
}

function footer(state) {
  const repaired = state.run === "first" ? state.progress === 100 : state.run === "secured" || state.progress === 100;
  const color = repaired ? COLORS.repair : COLORS.corruption;
  const fill = Math.round(752 * state.progress / 100);
  const status = state.auto ? "AUTO ANSWER OVERRIDE ACTIVE" : repaired ? "SEARCH RESULTS RESTORED" : "RESULTS STILL CROWDED";
  return `<g data-module="site-meter" data-purpose="persistent parody cue"><rect x="109" y="677" width="802" height="161" fill="#F7F5EE"/><line x1="109" y1="677" x2="911" y2="677" stroke="#8E9AA0"/><text x="126" y="716" class="si-meter" fill="${color}">SEARCH RECOVERY</text><text x="287" y="716" class="si-meter" fill="${color}">${state.progress}%</text><rect x="126" y="732" width="752" height="25" fill="${repaired ? "#EEF4EF" : "url(#siHatch)"}" stroke="${color}"/><rect x="126" y="732" width="${fill}" height="25" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/><text x="878" y="786" class="si-status" text-anchor="end" fill="${color}">${status}</text></g>`;
}

const lockItems = Object.freeze(["FIX THE AI","MAKE AI OPTIONAL","SHOW REAL OPTIONS","KEEP THE SEARCH"]);
function checklist(state) {
  if (state.checklist === undefined) return "";
  return `<g data-module="lock-overlay" data-purpose="repair target" data-checked="${state.checklist}"><rect x="582" y="356" width="285" height="268" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="582" y="356" width="285" height="47" rx="10" fill="${COLORS.repair}"/><rect x="582" y="390" width="285" height="13" fill="${COLORS.repair}"/><text x="602" y="388" class="si-lock-title">LOCK IN THE REPAIR</text>${lockItems.map((item,index)=>{const checked=index<state.checklist;const y=431+index*47;return `<rect x="606" y="${y-23}" width="29" height="29" rx="5" fill="${checked?COLORS.repair:COLORS.corruptionSoft}" stroke="${checked?COLORS.repair:COLORS.corruption}"/><text x="620" y="${y-3}" class="si-lock-mark" text-anchor="middle" fill="${checked?"#fff":COLORS.corruption}">${checked?"✓":"○"}</text><text x="651" y="${y-3}" class="si-lock-label" fill="${checked?COLORS.repairDark:COLORS.corruption}">${item}</text>`;}).join("")}</g>`;
}

function companion(state) {
  let lines;
  if (state.run === "first") {
    lines = state.repair === 0 ? ["AI and paid products hide useful results.","The search itself is still visible."] : state.repair >= 6 ? ["The print-copy options now match the search.","Paid placement and AI help stay labeled."] : ["One part of the page has been repaired.","The remaining red evidence needs attention."];
  } else if (state.auto || (state.run === "lock" && (state.lock || 0) === 0)) lines = ["Auto selected one answer.","Other book options nearly disappeared."];
  else lines = ["The search page is giving control back.","Read, then answer the quick check."];
  return `<g data-module="reading-copy" data-purpose="persistent parody cue"><text x="964" y="112" class="reading-body">${esc(lines[0])}</text><text x="964" y="150" class="reading-body">${esc(lines[1])}</text><rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/><text x="964" y="209" class="reading-body">Read, then answer the quick check.</text></g>`;
}

function page(state,index) {
  const delta = state.run === "first" ? state.delta : state.run === "lock" ? (state.lock || 0) : 0;
  const phase = state.run === "first" ? "first-run" : state.run === "lock" ? "lock-run" : state.run;
  return `<g id="page-${state.id}" transform="translate(${index*1480} 0)" inkscape:groupmode="layer" inkscape:label="${esc(state.label)}" data-run="${state.run}" data-phase="${phase}" data-site-progress="${state.progress}" data-passage-progress="50" data-visual-delta="${Math.min(delta,3)}"><use href="#sharedShell"/>${shellPatch()}<rect x="109" y="56" width="802" height="782" fill="#fff"/>${header(state)}${results(state)}${footer(state)}${companion(state)}${checklist(state)}<rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

const pages = states.map((state,index)=>`<inkscape:page x="${index*1480}" y="0" width="1440" height="900" inkscape:label="${esc(state.label)}"/>`).join("");
const styles = `${shellStyles}
.si-task,.si-logo,.si-query,.si-nav,.si-chip,.si-kicker,.si-ai-title,.si-ai-title-small,.si-body,.si-small,.si-source,.si-url,.si-link,.si-link-small,.si-online-title,.si-dot,.si-rank,.si-count,.si-view-more,.si-favicon-pg,.si-ad-tiny,.si-paid-label,.si-store-title,.si-result-title,.si-price,.si-edition-price,.si-cover,.si-cover-big,.si-cover-small,.si-auto-title,.si-auto-sub,.si-auto-button,.si-meter,.si-status,.si-lock-title,.si-lock-label,.si-lock-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.si-task{font-size:14px;font-weight:600;fill:#15191B}.si-logo{font-size:25px;font-weight:700}.si-query{font-size:14px;fill:#283641}.si-red{fill:${COLORS.corruption};font-weight:700}.si-nav{font-size:9px;fill:#34424D}.si-chip{font-size:8px;font-weight:700;fill:#45535E}.si-kicker{font-size:12px;font-weight:700}.si-ai-title{font-size:22px;font-weight:700}.si-ai-title-small{font-size:17px;font-weight:700}.si-body{font-size:12px;fill:#202B34}.si-small{font-size:10px;fill:#45535E}.si-source{font-size:9px;font-weight:700}.si-url{font-size:9px;fill:#536573}.si-link{font-size:15px;fill:#245EAD}.si-link-small{font-size:11px;fill:#245EAD;text-decoration:underline}.si-online-title{font-size:12px;font-weight:700;fill:#245EAD}.si-dot{font-size:12px;fill:#60717E}.si-rank{font-size:11px;font-weight:700;fill:#fff}.si-count{font-size:9px;fill:#68747C}.si-view-more{font-size:10px;font-weight:700;fill:#516370}.si-favicon-pg{font-size:8px;font-weight:700;fill:#A53C35}.si-ad-tiny{font-size:7px}.si-paid-label{font-size:9px;font-weight:700;fill:#fff}.si-store-title{font-size:13px;font-weight:700;fill:#27323B}.si-result-title{font-size:15px;font-weight:700;fill:#27323B}.si-price{font-size:13px;font-weight:700;fill:#793D2A}.si-edition-price{font-size:9px;font-weight:700;fill:#793D2A}.si-cover{font-size:7px;font-weight:700;fill:#fff}.si-cover-big{font-size:12px;font-weight:700;fill:#fff}.si-cover-small{font-size:5px;fill:#fff}.si-auto-title{font-size:24px;font-weight:700}.si-auto-sub{font-size:15px;font-weight:700}.si-auto-button{font-size:13px;font-weight:700}.si-meter{font-size:13px;font-weight:700}.si-status{font-size:8px;font-weight:700}.si-lock-title{font-size:18px;font-weight:700;fill:#fff}.si-lock-label{font-size:11px;font-weight:700}.si-lock-mark{font-size:14px;font-weight:700}`;
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellHash}" data-site="searchish" data-sequence-version="3"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="siHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".25" stroke-width="3"/></pattern></defs><style>${styles}</style>${states.map(page).join("\n")}</svg>`;
fs.writeFileSync(outSvg,svg);

const cacheKey = "20260823-searchish-unsolicited-summary-v6";
const slides = states.map((state,index)=>({title:state.label,src:`searchish-anchor-v3_p${index+1}.png?review=${cacheKey}`}));
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Search-ish production review v3</title><style>html,body{margin:0;background:#15252f;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:auto;padding:18px}.head{display:flex;justify-content:space-between;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;border:2px solid #8db4bd}.stage img{display:block;width:100%}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;background:#0b2f3dcc;color:white;border:1px solid white;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;background:#244b55;color:white;border:3px solid transparent;padding:0}.thumb.active{border-color:#ffb000}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main"><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(n){index=(n+slides.length)%slides.length;main.src=slides[index].src;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((e,i)=>e.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})}slides.forEach((s,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+s.src+'"><span>'+s.title+'</span>';b.onclick=()=>show(i);strip.append(b)});prev.onclick=()=>show(index-1);next.onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0)</script></body></html>`;
fs.writeFileSync(outHtml,html);

for (let pageNumber=1;pageNumber<=states.length;pageNumber+=1) {
  execFileSync("/opt/homebrew/bin/inkscape",[path.basename(outSvg),`--export-page=${pageNumber}`,"--export-area-page","--export-type=png","--export-width=1440",`--export-filename=searchish-anchor-v3_p${pageNumber}.png`],{cwd:outDir,stdio:"ignore"});
}
console.log(`Wrote ${outSvg}, ${outHtml}, and ${states.length} Search-ish production states.`);
