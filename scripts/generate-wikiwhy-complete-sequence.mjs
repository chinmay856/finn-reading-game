#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const output = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg",
);
const shellReferencePath = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg",
);
const shellReference = fs.readFileSync(shellReferencePath, "utf8");
const referenceDefs = shellReference.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const referenceStyles = shellReference.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!referenceDefs || !referenceStyles) {
  throw new Error("Could not extract the reviewed V2 shell definitions and styles.");
}
const shellReferenceSha256 = crypto.createHash("sha256").update(referenceDefs).digest("hex");

const states = [
  { id: "initial", label: "Phase 1 - Initial corruption", phase: "phase-1", progress: 0, article: 0 },
  { id: "repair-1", label: "Phase 1 - Repair 1", phase: "phase-1", progress: 17, article: 1 },
  { id: "repair-2", label: "Phase 1 - Repair 2", phase: "phase-1", progress: 33, article: 2 },
  { id: "repair-3", label: "Phase 1 - Repair 3", phase: "phase-1", progress: 50, article: 3 },
  { id: "repair-4", label: "Phase 1 - Repair 4", phase: "phase-1", progress: 67, article: 4 },
  { id: "repair-5", label: "Phase 1 - Repair 5", phase: "phase-1", progress: 83, article: 5 },
  { id: "repair-6", label: "Phase 1 - Fully repaired", phase: "phase-1", progress: 100, article: 6 },
  { id: "chinmay-midpoint", label: "Midpoint - Chinmay popup", phase: "midpoint", progress: 100, article: 6, popup: "chinmay-midpoint" },
  { id: "ai-override", label: "Midpoint - AI override popup", phase: "midpoint-ai", progress: 100, article: 6, popup: "ai-override" },
  { id: "super-corrupt", label: "Act 2 - Super corrupted", phase: "act-2", progress: 0, article: 7 },
  { id: "amy-plan", label: "Act 2 - Amy repair plan", phase: "act-2-plan", progress: 0, article: 7, popup: "amy-plan" },
  { id: "locks-open", label: "Act 2 - Repair checklist", phase: "act-2-locks", progress: 0, article: 7, checklist: 0 },
  { id: "lock-1", label: "Act 2 - Sources locked", phase: "act-2-locks", progress: 33, article: 8, checklist: 1 },
  { id: "lock-2", label: "Act 2 - History locked", phase: "act-2-locks", progress: 67, article: 9, checklist: 2 },
  { id: "lock-3", label: "Act 2 - Wording locked and secured", phase: "act-2-locks", progress: 100, article: 6, checklist: 3 },
  { id: "amy-success", label: "Completion - Amy success", phase: "completion", progress: 100, article: 6, popup: "amy-success" },
  { id: "chinmay-realization", label: "Completion - Chinmay realizes", phase: "completion", progress: 100, article: 6, popup: "chinmay-realization" },
  { id: "amy-reflection", label: "Completion - Teach the AI", phase: "reflection", progress: 100, article: 6, popup: "amy-reflection", reflection: true },
  { id: "ai-receipt", label: "Completion - AI receipt", phase: "receipt", progress: 100, article: 6, popup: "ai-receipt", receipt: true },
];

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const lines = (items, x, y, className = "body", gap = 24) =>
  items.map((line, index) => `<text x="${x}" y="${y + index * gap}" class="${className}">${esc(line)}</text>`).join("");

function article(version) {
  const over = version >= 7;
  const locks = over ? version - 7 : 0;
  const fixed = (step) => over ? (step === 5 ? locks >= 1 : step === 6 ? locks >= 2 : locks >= 3) : version >= step;
  const ink = on => on ? COLORS.repairDark : COLORS.corruption;
  const paper = on => on ? '#edf5ea' : '#fff0ed';
  const box = (x,y,w,h,on) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${paper(on)}" stroke="${ink(on)}" stroke-width="1.5"/>`;
  const text = (x,y,value,on,size=17) => `<text x="${x}" y="${y}" style="font-family:'Chalkboard SE',sans-serif;font-size:${size}px;font-weight:${size>=20?700:400};fill:${ink(on)}">${esc(value)}</text>`;
  const region = (id,step,body) => `<g data-repair-region="${id}" data-repaired="${fixed(step)}">${body}</g>`;
  const bodyLines = fixed(3)
    ? ['Dogs can distinguish blue and yellow.', 'Red and green are harder to tell apart.', 'Their color vision differs from ours.', 'Limited color vision is not no color.']
    : over ? ['Dogs see whatever AUTO says.', 'Every confident sentence is proof.', 'Doubt only makes answers confusing.', 'AUTO HAS REMOVED ALL DOUBT.']
    : ['Dogs see only black and white.', 'This is always true.', 'Everyone knows it.', 'NO EVIDENCE NEEDED.'];
  return `<g data-article-version="${version}">
    ${region('headline',2,text(241,207,fixed(2)?'HOW DOGS SEE COLOR':over?'DOGS SEE WHAT AUTO SAYS':'DOGS SEE ONLY BLACK AND WHITE',fixed(2),over||!fixed(2)?22:25))}
    ${region('banner',1,box(241,228,446,48,fixed(1))+text(255,260,fixed(1)?'SUPPORTED BY RESEARCH':over?'JUST TRUST ME':'USER FACTS ARE ALWAYS RIGHT',fixed(1),20))}
    ${region('explanation',3,box(241,297,446,233,fixed(3))+
      text(256,322,fixed(3)?'WHAT THE EVIDENCE SUPPORTS':over?'AUTO CONFIDENCE: 10,000%':'SUBMITTED BY: DogVisionExpert99',fixed(3),14)+
      `<line x1="255" y1="335" x2="672" y2="335" stroke="${ink(fixed(3))}"/>`+
      bodyLines.map((line,i)=>text(256,371+i*39,line,fixed(3),20)).join(''))}
    ${region('source-tab',5,fixed(5)?'':box(453,121,108,42,false)+text(463,148,'× View source',false,13))}
    ${region('sources',5,text(241,575,'References',fixed(5),20)+box(241,590,446,112,fixed(5))+
      (fixed(5)?['[1] Canine cone cells — supports blue/yellow vision','[2] Color-discrimination tests — red/green limits','[3] Source notes — limits of the evidence']:over?['[1] Sandwich recipe → dog vision','[2] AUTO SAYS TRUST ME → every claim','[3] Sources removed: checking takes too long']:['[1] Trust me. I have met a dog.','[2] Everyone says so.','[3] Source: my own confidence.']).map((line,i)=>text(254,616+i*32,line,fixed(5),15)).join(''))}
    ${region('vision',4,box(714,188,178,222,fixed(4))+(fixed(4)?
      text(729,212,'DOG COLOR VISION',true,14)+`<rect x="729" y="227" width="148" height="79" fill="url(#spectrumGradient)"/>`+
      text(732,330,'Blue / yellow',true,15)+text(732,352,'Easier to distinguish',true,12)+text(732,377,'Red / green',true,15)+text(732,397,'Harder to distinguish',true,12):
      over ? `<image href="assets/wikiwhy-auto-dog-vision-v1.jpg" x="724" y="197" width="158" height="158" preserveAspectRatio="xMidYMid meet"/>`+text(728,377,'Certified dog. By AUTO.',false,12)+text(728,398,'All I see is me.',false,13):
      `<image href="assets/wikiwhy-techno-vision-hatch-v3.png" x="724" y="197" width="158" height="158" preserveAspectRatio="xMidYMid slice" filter="url(#grayscale)"/>`+text(728,377,'Only black and white.',false,13)+text(728,398,'Obviously. Look at him.',false,12)))}
    <g data-repair-region="summary">
      <rect x="714" y="430" width="178" height="180" fill="#f2f1ec" stroke="#516b80"/>
      <text x="730" y="453" class="rail-title">ARTICLE CHECK</text>
      <line x1="714" y1="464" x2="892" y2="464" stroke="#8295a5"/>
      ${text(727,488,fixed(1)?'✓ Evidence: research':over?'□ Confidence: 10,000%':'□ Confidence: 100%',fixed(1),11)}
      ${text(727,521,fixed(3)?'✓ Wording: careful':'□ Wording: absolute',fixed(3),13)}
      ${text(727,554,fixed(5)?'✓ Sources: 3 linked':'□ Sources: '+(over?'scrambled':'0'),fixed(5),13)}
      ${text(727,587,fixed(6)?'✓ History: visible':'□ History: hidden',fixed(6),13)}
    </g>
    ${region('history',6,box(566,121,86,42,fixed(6))+text(578,148,fixed(6)?'✓ History':'× History',fixed(6),13)+
      box(241,706,651,59,fixed(6))+text(255,723,fixed(6)?'REVISION HISTORY':'□ EDIT HISTORY HIDDEN',fixed(6),13)+
      text(255,741,fixed(6)?'18 Sep · ColorStudyEditor: corrected the black-and-white claim.':over?'AUTO deleted the edits. A clear answer needs no past.':'Earlier edits are hidden. This contributor says the answer was always right.',fixed(6),12)+
      (fixed(6)?text(255,757,'20 Sep · SourceChecker: added color-vision studies and their limits.',true,12):''))}  </g>`;
}

function checklist(secured) {
  const x = 558, y = 350;
  return `<g data-overlay="act2-checklist">
    <rect x="${x}" y="${y}" width="330" height="166" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/>
    <rect x="${x}" y="${y}" width="330" height="40" rx="10" fill="${COLORS.repair}"/>
    <rect x="${x}" y="${y+27}" width="330" height="13" fill="${COLORS.repair}"/>
    <text x="${x+20}" y="${y+28}" style="font-family:'Chalkboard SE',sans-serif;font-size:20px;font-weight:700;fill:#fff">LOCK IN THE REPAIR</text>
    ${["MATCH CLAIMS TO SOURCES", "KEEP HISTORY VISIBLE", "USE CAREFUL WORDING"].map((label,i)=> {
      const done = i < secured, rowY = y+68+i*34;
      return `<rect x="${x+24}" y="${rowY-22}" width="27" height="27" rx="5" fill="${done?COLORS.repair:COLORS.corruptionSoft}" stroke="${done?COLORS.repair:COLORS.corruption}"/>
      <text x="${x+37.5}" y="${rowY-2}" text-anchor="middle" style="font-family:'Chalkboard SE',sans-serif;font-size:22px;fill:${done?'#fff':COLORS.corruption}">${done?'✓':''}</text>
      <text x="${x+63}" y="${rowY}" style="font-family:'Chalkboard SE',sans-serif;font-size:14px;font-weight:700;fill:${done?COLORS.repairDark:COLORS.corruption}">${label}</text>`;
    }).join('')}
  </g>`;
}

const popups = {
  "chinmay-midpoint": { who: "CHINMAY", image: "chinmay-midpoint.png", color: "#f59b23", title: "I FIXED IT IN THE BACKGROUND!", body: ["I told the AI to remove sources, edit history,", "and cautious words. Now every fact can sound", "completely finished. Much more efficient!"], button: "SHOW ME" },
  "ai-override": { who: "AUTO", image: "auto-overfix.png", color: "#b41f19", title: "BACKGROUND FIX COMPLETE", body: ["REMOVED: SOURCES, HISTORY, UNCERTAINTY.", "NEW RULE: CONFIDENT = TRUE.", "JUST TRUST ME."], button: "AUTO, APPLY CHANGES" },
  "amy-plan": { who: "AMY", image: "amy-supportive.png", color: COLORS.repair, title: "LET'S LOCK THE IMPORTANT PARTS", body: ["It learned to sound certain instead of showing", "support. We need to match claims to sources,", "keep History visible, and use careful wording."], button: "LOCK IN THE REPAIR" },
  "amy-success": { who: "AMY", image: "amy-supportive.png", color: COLORS.repair, title: "THE REPAIR IS SECURED", body: ["The page now shows what supports each claim,", "how it changed, and where the evidence has limits."], button: "REVIEW THE FIX" },
  "chinmay-realization": { who: "CHINMAY", image: "chinmay-realization.png", color: "#f59b23", title: "OH. THAT WAS CONFIDENCE, NOT EVIDENCE.", body: ["I made the page easier to believe, not easier", "to check. 'JUST TRUST ME' is not a citation."], button: "FAIR POINT" },
  "amy-reflection": { who: "AMY", image: "amy-supportive.png", color: COLORS.repair, title: "WHAT SHOULD WE TEACH THE AI?", body: ["Tell the AI what went wrong and what it should", "remember about sources, History, and careful wording."], button: "TEACH THE AI" },
  "ai-receipt": { who: "AUTO", image: "auto-learned.png", color: "#345e91", title: "INSTRUCTIONS RECEIVED", body: ["CONNECT CLAIMS TO SUPPORTING SOURCES.", "KEEP EDIT HISTORY VISIBLE.", "DO NOT REPLACE EVIDENCE WITH CONFIDENCE."], button: "BACK TO RECOVERY DESKTOP" },
};

function popup(name) {
  const p = popups[name];
  const image = p.image ? `<image href="assets/${p.image}" x="436" y="282" width="180" height="180" preserveAspectRatio="xMidYMid slice"/>` : `<g><rect x="436" y="282" width="180" height="180" fill="#1d2d3d"/><text x="526" y="370" text-anchor="middle" class="aiMark">AI</text></g>`;
  const titleSize = name === "chinmay-realization" ? 18 : 20;
  return `<g id="popup-${name}" data-qa-box="398,219,1094,585" filter="url(#windowShadow)"><rect x="404" y="225" width="684" height="354" rx="8" fill="#f8f7f0" stroke="#fff" stroke-width="3"/><rect x="404" y="225" width="684" height="48" rx="8" fill="${p.color}"/><text x="426" y="258" class="popupTitle whiteText">${p.who} — DRAFT COPY FOR REVIEW</text>${image}<text x="642" y="315" class="popupTitle" style="font-size:${titleSize}px" data-qa-box="638,290,1056,324">${esc(p.title)}</text>${lines(p.body, 642, 354, "popupBody", 31)}<rect x="817" y="514" width="232" height="42" rx="4" fill="#ecebe4" stroke="#5b6670" stroke-width="2"/><text x="933" y="542" text-anchor="middle" class="small">${p.button}</text></g>`;
}

function reflectionPanel() {
  return `<g data-companion-state="reflection"><rect x="939" y="56" width="472" height="782" fill="#fbfaf6"/><text x="962" y="105" class="companionTitle">TEACH THE AI</text><text x="962" y="138" class="small">What lesson should the AI remember?</text><rect x="960" y="164" width="410" height="332" rx="4" fill="#fff" stroke="#7e8e99" stroke-width="2"/><text x="980" y="195" class="tiny" style="fill:#7b858c">Write your reflection here...</text><text x="962" y="532" class="tiny">About 200 words is a useful target. This is not scored.</text><rect x="1162" y="570" width="208" height="45" rx="4" fill="${COLORS.repair}"/><text x="1266" y="599" text-anchor="middle" class="small whiteText">SEND INSTRUCTIONS</text></g>`;
}

function receiptPanel() {
  return `<g data-companion-state="receipt"><rect x="939" y="56" width="472" height="782" fill="#fbfaf6"/><circle cx="1175" cy="225" r="64" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}" stroke-width="4"/><path d="m1142 226 23 23 45-55" fill="none" stroke="${COLORS.repair}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><text x="1175" y="330" class="companionTitle" text-anchor="middle">INSTRUCTIONS RECEIVED</text><text x="1175" y="373" class="reading-small" text-anchor="middle">Your lesson has been saved for this mission.</text><text x="1175" y="408" class="reading-small" text-anchor="middle">The repaired site is secured.</text><rect x="1061" y="486" width="228" height="44" rx="4" fill="${COLORS.repair}"/><text x="1175" y="514" class="small whiteText" text-anchor="middle">BACK TO RECOVERY DESKTOP</text></g>`;
}

function readingBody() {
  return `<g data-companion-state="reading" data-qa-box="958,78,1395,552"><text x="964" y="106" class="reading-body">The highlighted guide follows your</text><text x="964" y="144" class="reading-body">reading without changing the site.</text><rect x="960" y="171" width="409" height="34" fill="#f8dfa0"/><text x="964" y="197" class="reading-body">Each result reveals one visual repair.</text><text x="964" y="250" class="reading-body">Scores and site progress update only after</text><text x="964" y="288" class="reading-body">you finish the quick check.</text></g>`;
}

function statePage(state, index) {
  const dx = index * 1480;
  const siteProgress = state.progress;
  const barWidth = Math.round(250 * siteProgress / 100);
  const isAct2 = state.phase.startsWith("act-2");
  return `<g id="page-${state.id}" transform="translate(${dx} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${state.phase}" data-site-progress="${siteProgress}" data-site-progress-label="${isAct2 ? "LOCKS SECURED" : "SOURCE REPAIR"}" data-passage-progress="50">
    <use href="#sharedShell"/>
    ${article(state.article)}
    ${isAct2 ? `<rect x="162" y="794" width="190" height="38" fill="#f1f0ea"/><text x="168" y="823" class="meter-label">LOCKS SECURED</text>` : ""}
    <text x="310" y="823" class="meter-label" style="font-size:13px">${siteProgress}%</text><rect x="368" y="804" width="${barWidth}" height="20" fill="${isAct2 ? COLORS.repair : "#1387b2"}" data-role="site-progress-fill" data-percent="${siteProgress}"/>
    ${state.receipt ? receiptPanel() : state.reflection ? reflectionPanel() : readingBody()}
    <rect x="962" y="568" width="200" height="15" fill="#1387b2" data-role="passage-progress-fill" data-percent="50"/>

    ${state.checklist !== undefined ? checklist(state.checklist) : ""}
    ${state.popup ? popup(state.popup) : ""}
  </g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellReferenceSha256}">
<sodipodi:namedview pagecolor="#bdbdbd">${pages}</sodipodi:namedview>
<defs>
  ${referenceDefs}
</defs>
<style>
  ${referenceStyles}
  .small{font-family:'Chalkboard SE','Comic Sans MS',sans-serif;font-size:14px;fill:${COLORS.neutralInk}}.badText{fill:${COLORS.corruption}!important}.goodText{fill:${COLORS.repairDark}!important}.whiteText{fill:#fff!important}.popupTitle{font-family:'Chalkboard SE','Comic Sans MS',sans-serif;font-size:18px;font-weight:700;fill:${COLORS.neutralInk}}.popupBody{font-family:'Chalkboard SE','Comic Sans MS',sans-serif;font-size:17px;fill:${COLORS.neutralInk}}.aiMark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif;font-size:70px;font-weight:700;fill:#fff}.companionTitle{font-family:'Chalkboard SE','Comic Sans MS',sans-serif;font-size:20px;font-weight:700;fill:${COLORS.neutralInk}}.reading-small{font-family:'Chalkboard SE','Comic Sans MS',sans-serif;font-size:16px;fill:${COLORS.neutralInk}}.tabOverride{font-family:'Chalkboard SE','Comic Sans MS',sans-serif;font-size:12.5px}.certainty-text{fill:${COLORS.corruption}}.rule-banner{letter-spacing:.1px}
</style>
${states.map(statePage).join("\n")}
</svg>`;

fs.writeFileSync(output, svg);
console.log(`Wrote ${output} with ${states.length} named Inkscape pages.`);

// Export runtime frames and both desktop thumbnails from this single master.
if (process.argv.includes("--export")) {
  for (let page = 1; page <= states.length; page++) {
    execFileSync("inkscape", [output, `--export-page=${page}`, "--export-area-page", "--export-width=1440", `--export-filename=${path.resolve(`public/walkthroughs/wikiwhy/wikiwhy-complete-state-v3_p${page}.png`)}`], {stdio:"ignore"});
  }
  for (const [page, name] of [[7, "recovered"], [10, "auto"]]) {
    const x = (page - 1) * 1480;
    execFileSync("inkscape", [output, `--export-area=${x+108}:20:${x+912}:838`, "--export-width=804", `--export-filename=${path.resolve(`public/walkthroughs/endgame/site-crops/wikiwhy-${name}-site-v1.png`)}`], {stdio:"ignore"});
  }
}
