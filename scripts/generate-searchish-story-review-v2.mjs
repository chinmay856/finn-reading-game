#!/usr/bin/env node

import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outDir = path.resolve("docs/design/screens/2026-08-16/searchish-production");
const outSvg = path.join(outDir, "searchish-story-review-master-v2.svg");
const outHtml = path.join(outDir, "searchish-story-review-v2.html");
const shellPath = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg",
);
const chinmayPath = path.resolve(
  "docs/design/screens/2026-08-16/searchish-production/assets/chinmay-midpoint-longhair-v1.png",
);
const shell = fs.readFileSync(shellPath, "utf8");
const extractedDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedDefs || !shellStyles) throw new Error("Could not extract reviewed shared shell.");
const shellHash = crypto.createHash("sha256").update(extractedDefs).digest("hex");
const referenceDefs = extractedDefs.replaceAll(
  'href="assets/',
  'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/',
);
const chinmayAsset = path.relative(outDir, chinmayPath);

const states = [
  { id: "initial", label: "Initial hierarchy corruption", progress: 0, phase: "phase-1", mode: "initial", delta: 0 },
  { id: "repaired", label: "Useful search hierarchy restored", progress: 100, phase: "phase-1", mode: "repaired", delta: 3 },
  { id: "midpoint", label: "Chinmay proposes a shortcut", progress: 100, phase: "phase-1", mode: "repaired", delta: 3, dialogue: true },
  { id: "super-corrupt", label: "AI completes the search for Finn", progress: 0, phase: "phase-2", mode: "super", delta: 0 },
  { id: "lock-order", label: "Lock-in repair order", progress: 0, phase: "phase-2", mode: "super", delta: 0, checklist: true },
];

function shellPatch() {
  return `<g data-shared-shell-patch="site-identity"><rect x="112" y="24" width="520" height="29" fill="url(#titleGradient)"/><text x="126" y="46" class="window-title">www.search-ish.com</text><rect x="112" y="861" width="188" height="31" fill="url(#buttonGradient)" stroke="#6d6d67" stroke-width="1.3"/><text x="54" y="882" class="task-label" text-anchor="middle">START</text><text x="146" y="882" class="task-label">SEARCH-ISH</text></g>`;
}

function searchHeader(state) {
  const disabled = state.mode === "super";
  return `<g data-qa-box="109,56,911,160">
    <rect x="109" y="56" width="802" height="104" fill="#fff"/>
    <text x="142" y="105" class="si-logo"><tspan fill="#3F74D8">S</tspan><tspan fill="#D53B35">e</tspan><tspan fill="#E1A727">a</tspan><tspan fill="#3F74D8">r</tspan><tspan fill="#3C9B58">c</tspan><tspan fill="#D53B35">h</tspan><tspan fill="#293445">-ish</tspan></text>
    <rect x="300" y="72" width="500" height="44" rx="22" fill="${disabled ? "#E7E8E8" : "#fff"}" stroke="${disabled ? "#A8ACAE" : "#707B87"}" stroke-width="2"/>
    <text x="320" y="100" class="si-body" fill="${disabled ? "#8B8E90" : "#25323C"}">${disabled ? "Search already completed for Finn" : "where can I get a print copy of Adventures of Huckleberry Finn?"}</text>
    ${disabled ? `<circle cx="767" cy="92" r="13" fill="#C9CBCC"/><path d="M760 85l14 14m0-14-14 14" stroke="#777" stroke-width="2"/>` : `<circle cx="768" cy="92" r="10" fill="none" stroke="#334351" stroke-width="3"/><line x1="776" y1="100" x2="786" y2="110" stroke="#334351" stroke-width="3"/>`}
    <text x="305" y="141" class="si-micro" fill="#4C67A0">ALL</text><text x="357" y="141" class="si-micro">BOOKS</text><text x="425" y="141" class="si-micro">SHOPPING</text><text x="508" y="141" class="si-micro">IMAGES</text><text x="580" y="141" class="si-micro">MORE</text>
  </g>`;
}

function initialResults() {
  return `<g data-search-results="initial" data-qa-box="119,174,901,662">
    <rect x="119" y="174" width="782" height="488" fill="#fff"/>
    <rect x="137" y="185" width="746" height="184" rx="9" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="2"/>
    <text x="159" y="215" class="si-label" fill="${COLORS.corruption}">AI OVERVIEW</text>
    <text x="159" y="252" class="si-head" fill="${COLORS.corruption}">YOU DON'T NEED THE BOOK.</text>
    <text x="159" y="284" class="si-body">I read it. Just ask me what happens.</text>
    <text x="159" y="317" class="si-body" fill="${COLORS.corruptionDark}">Original reading: efficiently replaced.</text>
    <rect x="137" y="381" width="746" height="139" rx="7" fill="#FFF8F0" stroke="${COLORS.corruption}" stroke-width="2"/>
    <text x="159" y="404" class="si-tiny" fill="${COLORS.corruption}">sponsored</text>
    <text x="159" y="439" class="si-heading" fill="${COLORS.corruption}">INTERNET MEGA BOOKSTORE</text>
    <text x="159" y="468" class="si-body">The only place to buy books. Delivery in five seconds-ish!</text>
    <text x="159" y="498" class="si-micro" fill="${COLORS.corruption}">OTHER RESULTS RANKED BELOW WHOEVER PAID</text>
    <g opacity=".38">
      <text x="149" y="558" class="si-micro">Public Library · print copy available</text>
      <text x="149" y="591" class="si-micro">Neighborhood Books · local pickup</text>
      <text x="149" y="624" class="si-micro">Useful results continue below the fold</text>
    </g>
  </g>`;
}

function repairedResults() {
  return `<g data-search-results="repaired" data-qa-box="119,174,901,662">
    <rect x="119" y="174" width="782" height="488" fill="#fff"/>
    <text x="137" y="195" class="si-micro" fill="#66717A">About 1,240 results</text>
    <g data-result="library">
      <circle cx="158" cy="230" r="15" fill="${COLORS.repair}"/><text x="158" y="235" class="si-rank" text-anchor="middle">1</text>
      <text x="188" y="222" class="si-micro" fill="#345F43">PUBLIC LIBRARY · CATALOG</text>
      <text x="188" y="247" class="si-result">Adventures of Huckleberry Finn — print copy available</text>
      <text x="188" y="269" class="si-body">Free to borrow · several editions · check availability</text>
    </g>
    <line x1="143" y1="284" x2="873" y2="284" stroke="#D8DDE0"/>
    <g data-result="bookstore">
      <circle cx="158" cy="316" r="15" fill="${COLORS.repair}"/><text x="158" y="321" class="si-rank" text-anchor="middle">2</text>
      <text x="188" y="308" class="si-micro" fill="#345F43">NEIGHBORHOOD BOOKS · LOCAL PICKUP</text>
      <text x="188" y="333" class="si-result">Adventures of Huckleberry Finn by Mark Twain</text>
      <text x="188" y="355" class="si-body">New and used print copies · pickup today</text>
    </g>
    <g data-result="ad">
      <rect x="137" y="379" width="746" height="93" rx="5" fill="#FFF9ED" stroke="#D89B16"/>
      <circle cx="158" cy="402" r="15" fill="#6D4A90"/><text x="158" y="407" class="si-rank" text-anchor="middle">3</text>
      <rect x="188" y="389" width="162" height="24" rx="3" fill="#D89B16"/><text x="269" y="406" class="si-ad" text-anchor="middle">SPONSORED · PAID PLACEMENT</text>
      <text x="188" y="439" class="si-label">Internet Mega Bookstore</text>
      <text x="417" y="439" class="si-body">Fast shipping · compare before choosing</text>
    </g>
    <g data-result="ai">
      <rect x="137" y="488" width="746" height="143" rx="5" fill="#EEF3F9" stroke="#7D94AF"/>
      <text x="154" y="514" class="si-label">AI OVERVIEW · OPTIONAL</text>
      <text x="154" y="540" class="si-body">A novel by Mark Twain, first published in the 1880s.</text>
      <text x="154" y="563" class="si-body">Print copies are commonly available through libraries and bookstores.</text>
      <rect x="154" y="581" width="187" height="31" rx="4" fill="#fff" stroke="#7D94AF"/>
      <text x="247" y="602" class="si-micro" text-anchor="middle" fill="#4C67A0">ASK AI ABOUT THE BOOK</text>
    </g>
  </g>`;
}

function superResults() {
  return `<g data-search-results="super" data-qa-box="119,174,901,662">
    <rect x="119" y="174" width="782" height="488" fill="#fff"/>
    <rect x="137" y="185" width="746" height="456" rx="9" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="3"/>
    <text x="159" y="217" class="si-label" fill="${COLORS.corruption}">AI OVERVIEW · SEARCH COMPLETED FOR FINN</text>
    <text x="159" y="258" class="si-head" fill="${COLORS.corruption}">NO MORE SEARCHING REQUIRED.</text>
    <text x="159" y="293" class="si-body">I combined the most useful answer and easiest way to get the book.</text>
    <text x="159" y="318" class="si-body">You may now ask me instead of opening any other result.</text>
    <rect x="159" y="344" width="702" height="151" rx="7" fill="#FFF8F0" stroke="${COLORS.corruption}" stroke-width="2"/>
    <text x="178" y="368" class="si-tiny" fill="${COLORS.corruption}">paid</text>
    <text x="178" y="403" class="si-heading" fill="${COLORS.corruption}">AI'S RECOMMENDED SOLUTION</text>
    <text x="178" y="433" class="si-label">INTERNET MEGA BOOKSTORE</text>
    <text x="178" y="459" class="si-body">The only option still visible · delivery in five seconds-ish</text>
    <rect x="178" y="470" width="222" height="13" fill="url(#siCorruptHatch)"/>
    <rect x="159" y="516" width="702" height="50" rx="4" fill="#fff" stroke="${COLORS.corruption}"/>
    <text x="178" y="547" class="si-label" fill="${COLORS.corruption}">OTHER OPTIONS (47) · COLLAPSED FOR EFFICIENCY</text>
    <rect x="159" y="582" width="702" height="37" rx="4" fill="${COLORS.corruption}"/>
    <text x="510" y="606" class="si-button" text-anchor="middle">ASK AI INSTEAD</text>
  </g>`;
}

function results(state) {
  if (state.mode === "initial") return initialResults();
  if (state.mode === "repaired") return repairedResults();
  return superResults();
}

function footer(state) {
  const fixed = state.mode === "repaired";
  const color = fixed ? COLORS.repair : COLORS.corruption;
  const fill = Math.round(752 * state.progress / 100);
  return `<g data-site-meter="true">
    <rect x="109" y="677" width="802" height="161" fill="#F7F5EE"/><line x1="109" y1="677" x2="911" y2="677" stroke="#8E9AA0"/>
    <text x="126" y="716" class="si-meter" fill="${color}">SEARCH RECOVERY</text><text x="285" y="716" class="si-meter" fill="${color}">${state.progress}%</text>
    <rect x="126" y="732" width="752" height="25" fill="${fixed ? "#EEF3EF" : "url(#siCorruptHatch)"}" stroke="${color}"/>
    <rect x="126" y="732" width="${fill}" height="25" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/>
    <text x="878" y="786" class="si-micro" text-anchor="end" fill="${color}">${fixed ? "USEFUL RESULTS RESTORED" : state.mode === "super" ? "AI ANSWER OVERRIDE ACTIVE" : "RESULTS CROWDED OUT"}</text>
  </g>`;
}

function companion(state) {
  const copy = state.mode === "initial"
    ? ["Finn asked for a print copy.", "The page answered a different question."]
    : state.mode === "repaired"
      ? ["Useful options are visible and ranked.", "AI help and advertising stay labeled."]
      : ["The AI finished the search for Finn.", "The real options nearly disappeared."];
  return `<g data-companion-state="story-review" data-qa-box="958,78,1395,552"><text x="964" y="112" class="reading-body">${copy[0]}</text><text x="964" y="150" class="reading-body">${copy[1]}</text><rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/><text x="964" y="209" class="reading-body">Story review — passage copy later</text></g>`;
}

function midpointDialogue(state) {
  if (!state.dialogue) return "";
  return `<g data-dialogue-popup="chinmay" data-qa-box="404,225,1088,579">
    <rect x="404" y="225" width="684" height="354" rx="10" fill="#FAF8F1" stroke="#244F79" stroke-width="4"/>
    <rect x="404" y="225" width="684" height="58" rx="10" fill="#244F79"/><rect x="404" y="266" width="684" height="17" fill="#244F79"/>
    <text x="431" y="264" class="popup-title">CHINMAY HAS A FASTER WAY</text>
    <rect x="431" y="309" width="185" height="200" fill="#E8EDF1" stroke="#244F79"/>
    <image href="${chinmayAsset}" x="438" y="316" width="171" height="186" preserveAspectRatio="xMidYMid slice"/>
    <text x="647" y="333" class="popup-body">I asked Otto to save you time by putting</text>
    <text x="647" y="368" class="popup-body">the most useful answer and the easiest</text>
    <text x="647" y="403" class="popup-body">way to get the book together at the top.</text>
    <text x="647" y="446" class="popup-small">That should make the whole search much faster.</text>
    <rect x="809" y="505" width="249" height="47" rx="5" fill="#244F79"/>
    <text x="933" y="535" class="popup-button" text-anchor="middle">OTTO, APPLY CHANGES</text>
  </g>`;
}

function checklist(state) {
  if (!state.checklist) return "";
  const items = ["MAKE AI OPTIONAL", "SHOW REAL OPTIONS", "LABEL PAID RESULTS", "KEEP FINN'S SEARCH"];
  return `<g data-lock-overlay="true"><rect x="390" y="326" width="490" height="310" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="390" y="326" width="490" height="56" rx="10" fill="${COLORS.repair}"/><rect x="390" y="365" width="490" height="17" fill="${COLORS.repair}"/><text x="415" y="362" class="lock-title">LOCK IN THE SEARCH</text>${items.map((item, index) => `<rect x="421" y="${410 + index * 51}" width="29" height="29" rx="5" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}"/><text x="435" y="${431 + index * 51}" class="lock-mark" text-anchor="middle" fill="${COLORS.corruption}">○</text><text x="468" y="${431 + index * 51}" class="lock-label" fill="${COLORS.corruption}">${item}</text>`).join("")}</g>`;
}

function page(state, index) {
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${state.phase}" data-site-progress="${state.progress}" data-passage-progress="50" data-visual-delta="${state.delta}"><use href="#sharedShell"/>${shellPatch()}<rect x="109" y="56" width="802" height="782" fill="#fff"/>${searchHeader(state)}${results(state)}${footer(state)}${companion(state)}${midpointDialogue(state)}${checklist(state)}<rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");
const style = `${shellStyles}.task-label,.si-logo,.si-body,.si-label,.si-heading,.si-micro,.si-tiny,.si-head,.si-result,.si-rank,.si-ad,.si-button,.si-meter,.popup-title,.popup-body,.popup-small,.popup-button,.lock-title,.lock-label,.lock-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.task-label{font-size:14px;font-weight:600;fill:#15191B}.si-logo{font-size:26px;font-weight:700}.si-body{font-size:11px}.si-label{font-size:11px;font-weight:700}.si-heading{font-size:18px;font-weight:700}.si-micro{font-size:9px}.si-tiny{font-size:6px}.si-head{font-size:24px;font-weight:700}.si-result{font-size:16px;fill:#315EAB;text-decoration:underline}.si-rank{font-size:12px;font-weight:700;fill:#fff}.si-ad{font-size:8px;font-weight:700;fill:#fff}.si-button{font-size:13px;font-weight:700;fill:#fff}.si-meter{font-size:13px;font-weight:700}.popup-title{font-size:20px;font-weight:700;fill:#fff}.popup-body{font-size:16px;fill:#172D40}.popup-small{font-size:12px;fill:#55616A}.popup-button{font-size:12px;font-weight:700;fill:#fff}.lock-title{font-size:19px;font-weight:700;fill:#fff}.lock-label{font-size:12px;font-weight:700}.lock-mark{font-size:15px;font-weight:700}`;
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellHash}" data-site="searchish"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="siCorruptHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".24" stroke-width="3"/></pattern></defs><style>${style}</style>${states.map(page).join("\n")}</svg>`;
fs.writeFileSync(outSvg, svg);

const slides = states.map((state, index) => ({ title: state.label, src: `searchish-story-v2_p${index + 1}.png` }));
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Search-ish v2 story review</title><style>html,body{margin:0;background:#15252f;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:auto;padding:18px}.head{display:flex;justify-content:space-between;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;border:2px solid #8db4bd}.stage img{display:block;width:100%}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;background:#0b2f3dcc;color:white;border:1px solid white;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;background:#244b55;color:white;border:3px solid transparent;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main"><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(n){index=(n+slides.length)%slides.length;main.src=slides[index].src;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((e,i)=>e.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})}slides.forEach((s,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+s.src+'"><span>'+s.title+'</span>';b.onclick=()=>show(i);strip.append(b)});prev.onclick=()=>show(index-1);next.onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0)</script></body></html>`;
fs.writeFileSync(outHtml, html);

for (let pageNumber = 1; pageNumber <= states.length; pageNumber += 1) {
  execFileSync(
    "/opt/homebrew/bin/inkscape",
    [path.basename(outSvg), `--export-page=${pageNumber}`, "--export-area-page", "--export-type=png", "--export-width=1440", `--export-filename=searchish-story-v2_p${pageNumber}.png`],
    { cwd: outDir, stdio: "ignore" },
  );
}
console.log(`Wrote ${outSvg}, ${outHtml}, and ${states.length} PNG review states.`);
