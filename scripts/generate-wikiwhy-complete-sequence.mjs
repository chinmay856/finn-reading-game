#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
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
  { id: "lock-1", label: "Act 2 - Sources locked", phase: "act-2-locks", progress: 33, article: 7, checklist: 1 },
  { id: "lock-2", label: "Act 2 - History locked", phase: "act-2-locks", progress: 67, article: 7, checklist: 2 },
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
  const isSuper = version === 7;
  const repaired = version === 6;
  const p = Math.min(version, 6);
  const headline = p < 2 ? "DOGS SEE ONLY BLACK AND WHITE" : p < 6 ? "DOGS SEE MORE THAN BLACK AND WHITE" : "HOW DOGS SEE COLOR";
  const headlineText = isSuper ? "DOGS SEE EXACTLY WHAT AUTO SAYS" : headline;
  const banner = isSuper ? "JUST TRUST ME" : p === 0 ? "USER FACTS ARE ALWAYS RIGHT" : p === 1 ? "CLAIM UNDER REVIEW" : p === 6 ? "CLAIMS CHECKED AND SOURCED" : "EVIDENCE CHECK IN PROGRESS";
  const bannerColor = isSuper || p === 0 ? COLORS.corruption : p < 6 ? "#e6e8e5" : COLORS.repairSoft;
  const bannerText = isSuper || p === 0 ? "#fff" : p < 6 ? "#506576" : "#17662e";
  const body = isSuper
    ? ["Dogs see whatever this page says they see.", "Every confident sentence is now treated as proof.", "Maybe, often, and evidence suggests were deleted."]
    : p < 2
      ? ["Dogs see only black and white.", "This is always true.", "Everyone knows it."]
      : p < 3
        ? ["Dogs may distinguish blue and yellow more clearly.", "Red and green can appear less distinct.", "The page still needs careful wording and sources."]
        : ["Evidence suggests dogs distinguish blue and yellow more clearly.", "Red and green may appear less distinct than they do to humans.", "Color vision varies by species and should be described carefully."];
  const red = isSuper || !repaired;
  const spectrum = p >= 2 && !isSuper;
  const citations = p >= 5 && !isSuper;
  const chart = p >= 4 && !isSuper;
  const qualifierFixed = p >= 3 && !isSuper;
  const questionCount = isSuper ? 3 : p < 3 ? 3 : p < 5 ? 2 : 0;
  const questionMarks = Array.from({ length: questionCount }, (_, index) =>
    `<text x="686" y="${isSuper ? 360 + index * 28 : 360 + index * 28}" class="badText" text-anchor="end" data-qa-color="red">[?]</text>`,
  ).join("");
  const historyOverlay = isSuper
    ? `<rect x="566" y="121" width="86" height="42" fill="#fbfaf6"/><rect x="566" y="121" width="86" height="42" fill="url(#redHatch)" stroke="${COLORS.corruption}" stroke-width="2"/><text x="609" y="148" class="tabOverride badText" text-anchor="middle">TRUST ME</text>`
    : p < 6
      ? `<rect x="568" y="122" width="82" height="40" fill="url(#redHatch)" stroke="${COLORS.corruption}" stroke-dasharray="6 4"/><path d="m634 127 11 11m0-11-11 11" stroke="${COLORS.corruption}" stroke-width="3"/>`
      : "";
  return `
    <g data-article-version="${version}">
      ${historyOverlay}
      <text x="241" y="208" class="article-heading${isSuper ? " badText" : ""}" style="font-size:${isSuper ? 20 : p >= 2 && p < 6 ? 22 : 25}px" data-qa-box="238,176,695,220"${isSuper ? ` data-content-state="corrupted" data-qa-color="red"` : ""}>${headlineText}</text>
      <rect x="241" y="228" width="446" height="43" rx="5" fill="${bannerColor}" stroke="${isSuper ? "#85100c" : "#718593"}" stroke-width="2"/><text x="255" y="258" class="rule-banner" style="fill:${bannerText}" data-qa-box="252,230,680,265"${isSuper || p === 0 ? ` data-qa-on-red="true"` : ""}>${banner}</text>
      ${isSuper ? `<rect x="241" y="282" width="446" height="44" fill="url(#redHatch)" stroke="${COLORS.corruption}" stroke-width="3"/><text x="255" y="313" class="certainty-text" data-qa-box="252,284,680,320">AUTO CONFIDENCE 10,000%</text>` : ""}
      <g class="article-body${isSuper ? " badText" : ""}" data-qa-box="238,300,692,500"${isSuper ? ` data-content-state="corrupted" data-qa-color="red"` : ""}>${lines(body, 242, isSuper ? 360 : 360, isSuper ? "article-body badText" : "article-body", 28)}${questionMarks}</g>
      ${!qualifierFixed && !isSuper ? `<text x="242" y="460" class="article-body" style="text-decoration:line-through;text-decoration-color:${COLORS.corruption}">Scientists may disagree about the exact limits.</text><text x="686" y="460" class="badText" text-anchor="end" data-qa-color="red">[?]</text>` : ""}
      ${qualifierFixed ? `<rect x="239" y="432" width="448" height="52" fill="#edf5ea" stroke="#78a785"/><text x="253" y="454" class="article-body-small goodText">CAREFUL WORDING RESTORED</text><text x="253" y="475" class="tiny">Claims now say only what the evidence can support.</text>` : ""}
      <line x1="241" y1="610" x2="691" y2="610" stroke="#6484a0"/>
      <text x="241" y="634" class="article-body">References</text>
      <g data-qa-box="238,638,692,716">${citations ? `${lines(["[1] Canine cone-cell overview — checked", "[2] Veterinary color-vision guide — checked", "[3] Source notes match claims above"], 241, 657, "article-body-small goodText", 22)}` : isSuper ? `${lines(["[1] Sandwich recipe → dog vision", "[2] AUTO SAYS TRUST ME → every claim", "[3] Source removed for being slow"], 241, 657, "article-body-small badText", 22)}` : `${lines(["[1] Trust me.", "[2] Evidence suggests otherwise.", "[3] Common sense."], 241, 657, "article-body-small badText", 22)}`}</g>
      <g>
        <rect x="714" y="188" width="178" height="222" fill="#f2f1ec" stroke="#516b80"/>
        ${spectrum ? `<text x="803" y="216" class="rail-title" text-anchor="middle">DOG COLOR VISION</text><rect x="730" y="233" width="146" height="92" fill="url(#spectrumGradient)" stroke="#344f66"/><text x="745" y="348" class="rail-body">BLUE</text><text x="786" y="348" class="rail-body">YELLOW</text><text x="834" y="348" class="rail-body">RED/GREEN</text><text x="834" y="363" class="rail-body">DULLER</text><text x="803" y="388" class="rail-body" text-anchor="middle">Limited color is not no color.</text>` : `<image href="assets/wikiwhy-techno-vision-hatch-v3.png" x="724" y="196" width="158" height="158" preserveAspectRatio="xMidYMid slice" filter="url(#grayscale)"/><text x="803" y="378" class="rail-body" text-anchor="middle">A good boy with very good vision.</text><text x="803" y="396" class="rail-body" text-anchor="middle">Only in black and white.</text>`}
      </g>
      <g><rect x="714" y="430" width="178" height="150" fill="#f2f1ec" stroke="#516b80"/><text x="803" y="454" class="rail-title" text-anchor="middle">At a Glance</text><line x1="714" y1="464" x2="892" y2="464" stroke="#8295a5"/>${chart ? lines(["Evidence: linked", "Sources: 3", "History: visible", "Wording: careful"], 730, 489, "rail-body goodText", 22) : isSuper ? lines(["Confidence: 10,000%", "Evidence: deleted", "Sources: scrambled", "History: TRUST ME"], 730, 489, "rail-body badText", 22) : lines(["Confidence: 100%", "Evidence: N/A", "Sources: 0", "History: hidden"], 730, 489, "rail-body badText", 22)}</g>
      ${red ? `<g opacity=".9"><rect x="680" y="176" width="18" height="38" fill="url(#redHatch)"/><rect x="678" y="500" width="20" height="30" fill="url(#redHatch)"/><rect x="849" y="593" width="38" height="15" fill="url(#redHatch)"/></g>` : ""}
    </g>`;
}

function checklist(secured) {
  const rows = ["MATCH CLAIMS TO SOURCES", "KEEP HISTORY VISIBLE", "USE CAREFUL WORDING"];
  return `<g data-overlay="act2-checklist" data-qa-box="520,548,905,732" filter="url(#windowShadow)"><rect x="526" y="552" width="374" height="172" rx="6" fill="${COLORS.neutralPaper}" stroke="${COLORS.repairDark}" stroke-width="3"/><rect x="526" y="552" width="374" height="36" fill="${COLORS.repair}"/><text x="545" y="578" class="popupTitle whiteText" data-qa-on-green="true">LOCK IN THE REPAIR</text>${rows.map((row, i) => { const on = i < secured; return `<rect x="545" y="${601 + i * 36}" width="26" height="26" rx="4" fill="${on ? COLORS.repair : COLORS.corruptionSoft}" stroke="${on ? COLORS.repairDark : COLORS.corruption}"/><text x="558" y="${620 + i * 36}" text-anchor="middle" class="small ${on ? "whiteText" : "badText"}">${on ? "✓" : "○"}</text><text x="584" y="${620 + i * 36}" class="small" style="fill:${on ? COLORS.repairDark : COLORS.corruptionDark}">${row}</text>`; }).join("")}</g>`;
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
