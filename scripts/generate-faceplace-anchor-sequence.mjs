#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve("docs/design/screens/2026-08-16/faceplace-production");
const output = path.join(outputDirectory, "faceplace-anchor-master-v2.svg");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const photoPath = path.join(outputDirectory, "faceplace-fishing-wide-v4.jpg");
fs.mkdirSync(outputDirectory, { recursive: true });

const shell = fs.readFileSync(shellPath, "utf8");
const extractedDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedDefs || !shellStyles) throw new Error("Could not extract the reviewed shared shell.");
const shellHash = crypto.createHash("sha256").update(extractedDefs).digest("hex");
const referenceDefs = extractedDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');
const photoAsset = path.relative(outputDirectory, photoPath);
const albumAssets = Object.fromEntries(
  ["hero", "helper", "gear", "fish"].map((name) => [
    name,
    path.relative(outputDirectory, path.join(outputDirectory, `faceplace-album-${name}-v1.jpg`)),
  ]),
);

const crops = {
  hero: { x: -420, y: -184, width: 1500, height: 667 },
  helper: { x: -220, y: -91, width: 950, height: 422 },
  gear: { x: 0, y: -49, width: 760, height: 338 },
  full: { x: 0, y: 2, width: 532, height: 236 },
};

const states = [
  { id: "initial", label: "Selected slice", phase: "phase-1", progress: 0, delta: 0, view: "hero", copy: "initial", comments: "enhanced", album: 1, meter: "9000%" },
  { id: "comments", label: "Original comments restored", phase: "phase-1", progress: 20, delta: 1, view: "hero", copy: "initial", comments: "original", album: 1, meter: "12%" },
  { id: "helper", label: "Helper revealed", phase: "phase-1", progress: 40, delta: 2, view: "helper", copy: "helper", comments: "original", album: 2, meter: "8805S%" },
  { id: "gear", label: "Gear and cleanup revealed", phase: "phase-1", progress: 60, delta: 2, view: "gear", copy: "gear", comments: "original", album: 3, meter: "AVOCADO%" },
  { id: "barrel", label: "Other fish revealed", phase: "phase-1", progress: 80, delta: 3, view: "full", copy: "barrel", comments: "original", album: 4, meter: "3½ FISH%" },
  { id: "repaired", label: "Post title and reactions restored", phase: "phase-1", progress: 100, delta: 3, view: "full", copy: "repaired", comments: "original", album: 4, meter: "BANANA%", fixed: true },
  { id: "super-corrupt", label: "Auto-enhanced over-fix", phase: "phase-2", progress: 0, delta: 0, view: "hero", copy: "super", comments: "auto", album: 4, meter: "∞ AWESOME", superMode: true },
  { id: "checklist", label: "Lock-in checklist", phase: "phase-2", progress: 0, delta: 0, view: "hero", copy: "super", comments: "auto", album: 4, meter: "∞ AWESOME", superMode: true, checklist: 0 },
  { id: "lock-comments", label: "Original comments locked", phase: "phase-2", progress: 20, delta: 1, view: "hero", copy: "super", comments: "original", album: 4, meter: "∞ AWESOME", superMode: true, checklist: 1 },
  { id: "lock-album", label: "Album photos restored", phase: "phase-2", progress: 40, delta: 2, view: "hero", copy: "super", comments: "original", album: 4, meter: "∞ AWESOME", superMode: true, checklist: 2 },
  { id: "lock-frame", label: "Original photo restored", phase: "phase-2", progress: 60, delta: 2, view: "full", copy: "super", comments: "original", album: 4, meter: "∞ AWESOME", superMode: true, checklist: 3 },
  { id: "lock-words", label: "Accurate words locked", phase: "phase-2", progress: 80, delta: 3, view: "full", copy: "repaired", comments: "original", album: 4, meter: "∞ AWESOME", superMode: true, checklist: 4 },
  { id: "lock-score", label: "Awesomeness score removed", phase: "phase-2", progress: 100, delta: 3, view: "full", copy: "repaired", comments: "original", album: 4, meter: "¯\\_(ツ)_/¯", fixed: true, checklist: 5 },
  { id: "secured", label: "Repair secured", phase: "phase-2", progress: 100, delta: 3, view: "full", copy: "repaired", comments: "original", album: 4, meter: "¯\\_(ツ)_/¯", fixed: true },
];

function titlebarPatch() {
  return `<g data-shared-shell-patch="site-identity"><rect x="112" y="24" width="520" height="29" fill="url(#titleGradient)"/><text x="126" y="46" class="window-title">www.face-place.net</text><rect x="112" y="861" width="188" height="31" fill="url(#buttonGradient)" stroke="#6d6d67" stroke-width="1.3"/><text x="54" y="882" class="task-label" text-anchor="middle">START</text><text x="146" y="882" class="task-label">FACEPLACE</text></g>`;
}

function navIcon(x, glyph, label) {
  return `<circle cx="${x}" cy="137" r="10" fill="#E7ECF7"/><text x="${x}" y="141" class="face-icon" text-anchor="middle">${glyph}</text><text x="${x + 16}" y="142" class="face-small">${label}</text>`;
}

function header() {
  return `<g data-qa-box="109,56,911,153"><rect x="109" y="56" width="802" height="66" fill="#315CAA"/><rect x="126" y="70" width="38" height="38" rx="7" fill="#fff"/><text x="145" y="100" class="face-mark" text-anchor="middle">f</text><text x="178" y="99" class="face-logo">faceplace</text><rect x="390" y="72" width="300" height="34" rx="17" fill="#fff"/><text x="414" y="94" class="face-muted">Search FacePlace</text><circle cx="831" cy="89" r="17" fill="#fff"/><text x="831" y="95" class="face-blue" text-anchor="middle">•••</text><rect x="109" y="122" width="802" height="31" fill="#fff" stroke="#D4D7DC"/>${navIcon(136, "⌂", "Home")}${navIcon(244, "●●", "Friends")}${navIcon(369, "▣", "Photos")}${navIcon(479, "✉", "Messages")}</g>`;
}

const albumCards = [
  { caption: ["LOOK AT MY FISH"], asset: albumAssets.hero },
  { caption: ["I HAD HELP"], asset: albumAssets.helper },
  { caption: ["LOTS OF GEAR", "AND CLEANUP"], asset: albumAssets.gear },
  { caption: ["OTHER FISH", "AT THE LAKE"], asset: albumAssets.fish },
];

function albumCard(card, index, state) {
  if (index >= state.album) return "";
  const y = 236 + index * 101;
  const overEnhanced = state.superMode && (state.checklist ?? 0) < 2;
  const albumLocked = state.fixed || (state.checklist ?? 0) >= 2;
  const border = albumLocked ? COLORS.repair : overEnhanced ? COLORS.corruption : index === 0 && state.progress === 0 ? COLORS.corruption : "#315CAA";
  const caption = overEnhanced ? ["AUTO PERFECT", "MOMENT"] : card.caption;
  const asset = overEnhanced ? albumAssets.hero : card.asset;
  return `<g data-album-card="${index + 1}" data-album-content="${overEnhanced ? "auto-duplicate" : "original"}"><rect x="699" y="${y}" width="192" height="92" rx="5" fill="#fff" stroke="${border}" stroke-width="2"/><image href="${asset}" x="705" y="${y + 7}" width="88" height="76" preserveAspectRatio="xMidYMid slice"${overEnhanced ? ' style="filter:url(#faceOverEnhance)"' : ""}/><text x="802" y="${y + 35}" class="face-album" fill="${border}">${caption[0]}</text>${caption[1] ? `<text x="802" y="${y + 53}" class="face-album" fill="${border}">${caption[1]}</text>` : ""}</g>`;
}

function albumRail(state) {
  const overEnhanced = state.superMode && (state.checklist ?? 0) < 2;
  return `<g data-album-module="true" data-qa-box="689,165,901,680"><rect x="689" y="165" width="212" height="515" rx="7" fill="#fff" stroke="#D5D8DD"/><text x="705" y="193" class="face-label">MORE FROM THIS ALBUM</text><text x="705" y="214" class="face-blue face-small">LAKE DAY · ${overEnhanced ? "∞ PERFECT MOMENTS" : `${state.album} ${state.album === 1 ? "PHOTO" : "PHOTOS"}`}</text>${albumCards.map((card, index) => albumCard(card, index, state)).join("")}</g>`;
}

function mainPhoto(state) {
  const crop = crops[state.view];
  const overEnhanced = state.superMode && (state.checklist ?? 0) < 3;
  return `<g transform="translate(133 294)" clip-path="url(#facePhotoClip)" data-photo-view="${state.view}" data-photo-enhanced="${overEnhanced}"><image href="${photoAsset}" x="${crop.x}" y="${crop.y}" width="${crop.width}" height="${crop.height}" preserveAspectRatio="xMidYMid meet"${overEnhanced ? ' style="filter:url(#faceOverEnhance)"' : ""}/>${overEnhanced ? `<path d="M40 25 48 44 68 52 48 60 40 80 32 60 12 52 32 44z" fill="#FFF6A0" stroke="${COLORS.corruption}" stroke-width="3"/><path d="m472 28 9 21 22 9-22 9-9 22-9-22-22-9 22-9z" fill="#FFF6A0" stroke="${COLORS.corruption}" stroke-width="3"/><rect x="158" y="188" width="220" height="38" rx="19" fill="${COLORS.corruption}"/><text x="268" y="213" class="face-enhanced" text-anchor="middle">AUTO ENHANCED</text>` : ""}</g>`;
}

const copyByState = {
  initial: { title: [["LEGENDARY FISH! ONE OF A KIND!", "red"]], lines: [["Caught it all by myself. #SoloLegend #NoHelpNeeded", "red"], ["Caught a unique one-of-a-kind fish. #OneOfAKind", "red"], ["Didn't need any fishing gear. #BareHands", "red"]] },
  helper: { title: [["LEGENDARY FISH! ONE OF A KIND!", "red"]], lines: [["Caught it with help. #FishingFriends", "green"], ["Caught a unique one-of-a-kind fish. #OneOfAKind", "red"], ["Didn't need any fishing gear. #BareHands", "red"]] },
  gear: { title: [["LEGENDARY FISH! ONE OF A KIND!", "red"]], lines: [["Caught it with help. #FishingFriends", "green"], ["Caught a unique one-of-a-kind fish. #OneOfAKind", "red"], ["Used fishing gear and cleaned up. #LakeDay", "green"]] },
  barrel: { title: [["LEGENDARY FISH! ONE OF A KIND!", "red"]], lines: [["Caught it with help. #FishingFriends", "green"], ["Caught one of the lake's fish. #GreatCatch", "green"], ["Used fishing gear and cleaned up. #LakeDay", "green"]] },
  repaired: { title: [["GREAT CATCH AT THE LAKE!", "green"]], lines: [["Caught it with help. #FishingFriends", "green"], ["Caught one of the lake's fish. #GreatCatch", "green"], ["Used fishing gear and cleaned up. #LakeDay", "green"]] },
  super: { title: [["THE MOST AWESOME FISH PHOTO EVER!", "red"]], lines: [["AUTO ENHANCED: SOLO. LEGENDARY. PERFECT.", "red"], ["#AutoAwesome", "red"], ["EVERY DETAIL IMPROVED FOR MAXIMUM AWESOME.", "red"]] },
};

function coloredText(parts, y, className, contentKey) {
  const semanticState = parts.every(([, tone]) => tone === "green") ? "fixed" : "corrupted";
  return `<text x="133" y="${y}" class="${className}" xml:space="preserve" data-content-key="${contentKey}" data-content-state="${semanticState}">${parts.map(([text, tone], index) => `<tspan${index ? ' dx="4"' : ""} fill="${tone === "green" ? COLORS.repair : COLORS.corruption}">${text}</tspan>`).join("")}</text>`;
}

function comments(state) {
  if (state.comments === "enhanced") {
    return `<text x="133" y="580" class="face-micro" fill="${COLORS.corruption}">ENHANCED COMMENT</text><text x="235" y="580" class="face-label" fill="${COLORS.corruption}">BIGGEST FISH EVER!!!</text><text x="133" y="605" class="face-micro" fill="${COLORS.corruption}">ENHANCED COMMENT</text><text x="235" y="605" class="face-label" fill="${COLORS.corruption}">YOU DO EVERYTHING PERFECTLY!!!</text><text x="133" y="630" class="face-micro" fill="${COLORS.corruption}">ENHANCED COMMENT</text><text x="235" y="630" class="face-label" fill="${COLORS.corruption}">MOST LEGENDARY DAY EVER!!!</text><rect x="133" y="648" width="532" height="28" fill="url(#faceCorruptHatch)"/><text x="141" y="666" class="face-micro" fill="${COLORS.corruption}">COMMENTS ENHANCED FOR POSITIVITY</text>`;
  }
  if (state.comments === "auto") {
    return `<text x="133" y="584" class="face-label">AUTO FAN 1</text><text x="218" y="584" class="face-small" fill="${COLORS.corruption}">WOW!!!</text><text x="133" y="609" class="face-label">AUTO FAN 2</text><text x="218" y="609" class="face-small" fill="${COLORS.corruption}">PERFECT!!!</text><text x="133" y="634" class="face-label">AUTO FAN 3</text><text x="218" y="634" class="face-small" fill="${COLORS.corruption}">NO NOTES!!!</text><rect x="133" y="652" width="532" height="24" fill="url(#faceCorruptHatch)"/><text x="141" y="669" class="face-micro" fill="${COLORS.corruption}">AUTO PRAISE ONLY</text>`;
  }
  return `<g data-comments-state="fixed"><rect x="129" y="567" width="540" height="109" rx="4" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}" stroke-width="2"/><text x="141" y="582" class="face-micro" fill="${COLORS.repairDark}">ORIGINAL COMMENTS RESTORED</text><text x="141" y="602" class="face-label">Maya R.</text><text x="218" y="602" class="face-small" fill="${COLORS.repairDark}">Nice fish! Glad I could help net it.</text><text x="141" y="622" class="face-label">Leo P.</text><text x="218" y="622" class="face-small" fill="${COLORS.repairDark}">Looks like a fun, messy day.</text><text x="141" y="642" class="face-label">Nia S.</text><text x="218" y="642" class="face-small" fill="${COLORS.repairDark}">Still a great catch!</text><rect x="141" y="650" width="516" height="20" rx="3" fill="#fff" stroke="${COLORS.repair}"/><text x="149" y="664" class="face-micro" fill="${COLORS.repairDark}">Write a comment…</text></g>`;
}

function post(state) {
  const copy = copyByState[state.copy];
  const overEnhanced = state.superMode && (state.checklist ?? 0) < 3;
  const wordsLocked = state.fixed || (state.checklist ?? 0) >= 4;
  const frameLocked = state.fixed || (state.checklist ?? 0) >= 3;
  const reactionsLocked = state.fixed || (state.checklist ?? 0) >= 4;
  const postBorder = wordsLocked ? COLORS.repair : state.progress > 0 && !state.superMode ? "#315CAA" : COLORS.corruption;
  const photoBorder = frameLocked ? COLORS.repair : postBorder;
  const reactionDisplay = reactionsLocked
    ? `<g data-reactions-state="fixed" data-reactions-copy="facebook-style-thumbs-heart"><title>Thumbs-up and heart reactions</title><rect x="606" y="535" width="57" height="26" rx="13" fill="#fff" stroke="#D5D8DD"/><circle cx="623" cy="548" r="10" fill="#4F83E9"/><path d="M617 545h3v8h-3zm3 0 3-4h1c1 0 2 1 1.7 2l-.5 2h3.8c1.3 0 2.2 1.2 1.8 2.4l-1.2 4.1c-.3 1-1.2 1.5-2.2 1.5H620z" fill="#fff"/><circle cx="649" cy="548" r="10" fill="#E94B62"/><path d="M649 554c-6-3.5-8-7-5.5-9.3 2-1.8 4.4-.7 5.5 1.1 1.1-1.8 3.5-2.9 5.5-1.1 2.5 2.3.5 5.8-5.5 9.3z" fill="#fff"/></g>`
    : `<text x="653" y="552" class="face-reaction" text-anchor="end" fill="${COLORS.corruption}" data-reactions-state="corrupted">${overEnhanced ? "∞ reactions" : "MORE LIKES THAN YOU"}</text>`;
  return `<g data-post-state="${state.id}" data-qa-box="119,165,679,680"><rect x="119" y="165" width="560" height="515" rx="7" fill="#fff" stroke="${postBorder}" stroke-width="2"/><text x="133" y="193" class="face-label">Tyler K.</text><text x="133" y="214" class="face-tiny">Yesterday at 5:08 PM · Public</text>${coloredText(copy.title, 236, "face-caption", "post-title")}${copy.lines.map((line, index) => coloredText([line], 253 + index * 14, "face-body", `post-line-${index + 1}`)).join("")}${mainPhoto(state)}<rect x="133" y="294" width="532" height="240" rx="4" fill="none" stroke="${photoBorder}" stroke-width="3"/><text x="133" y="552" class="face-body face-blue">♥ Like   Comment   Share</text>${reactionDisplay}<line x1="133" y1="561" x2="665" y2="561" stroke="#D5D8DD"/>${comments(state)}</g>`;
}

function footer(state) {
  const autoMeter = state.superMode && !state.fixed;
  const label = autoMeter ? "AUTO AWESOMENESS METER" : "HONESTY METER";
  const color = state.fixed ? COLORS.repair : COLORS.corruption;
  const fillWidth = Math.round(752 * state.progress / 100);
  return `<g><rect x="109" y="690" width="802" height="148" fill="#F7F5EE"/><line x1="109" y1="690" x2="911" y2="690" stroke="#8E9AA0"/><text x="126" y="727" class="face-meter" fill="${color}">${label}</text><text x="${autoMeter ? 338 : 275}" y="727" class="face-meter" fill="${color}">${state.meter}</text><rect x="126" y="743" width="752" height="24" fill="url(#faceCorruptHatch)" stroke="${color}"/><rect x="126" y="743" width="${autoMeter ? 752 : fillWidth}" height="24" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/></g>`;
}

const lockLabels = ["RESTORE ORIGINAL COMMENTS", "RESTORE THE ALBUM PHOTOS", "RESTORE THE ORIGINAL PHOTO", "KEEP THE WORDS ACCURATE", "REMOVE THE AWESOMENESS SCORE"];

function checklist(state) {
  if (state.checklist === undefined) return "";
  return `<g data-lock-overlay="true"><rect x="397" y="334" width="484" height="348" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="397" y="334" width="484" height="56" rx="10" fill="${COLORS.repair}"/><rect x="397" y="374" width="484" height="16" fill="${COLORS.repair}"/><text x="421" y="370" class="lock-title">LOCK IN THE REPAIR</text>${lockLabels.map((label, index) => { const done = index < state.checklist; const y = 432 + index * 48; return `<rect x="425" y="${y - 22}" width="28" height="28" rx="5" fill="${done ? COLORS.repair : COLORS.corruptionSoft}" stroke="${done ? COLORS.repair : COLORS.corruption}"/><text x="439" y="${y - 2}" class="lock-mark" text-anchor="middle" fill="${done ? "#fff" : COLORS.corruption}">${done ? "✓" : "○"}</text><text x="472" y="${y}" class="lock-label" fill="${done ? COLORS.repairDark : COLORS.corruption}">${label}</text>`; }).join("")}</g>`;
}

function companion(state) {
  const messages = {
    initial: "The post shows one chosen slice.", comments: "The original comments are visible.", helper: "The wider frame reveals a helper.", gear: "The next view reveals gear and cleanup.", barrel: "The full frame reveals other fish.", repaired: "The title and reactions no longer compare.", "super-corrupt": "Auto made every album photo awesome.", checklist: "Lock the context behind the post.", "lock-comments": "Original comments locked.", "lock-album": "The original album photos are back.", "lock-frame": "The original photo is restored.", "lock-words": "Accurate words are locked.", "lock-score": "The score no longer judges real life.", secured: "The whole story is secured.",
  };
  return `<g data-companion-state="reading" data-qa-box="958,78,1395,552"><text x="964" y="106" class="reading-body">Read the next passage to reveal more</text><text x="964" y="144" class="reading-body">of what happened around this photo.</text><rect x="960" y="171" width="404" height="34" fill="#F8DFA0"/><text x="964" y="197" class="reading-body">${messages[state.id]}</text><text x="964" y="250" class="reading-body">The happy catch can still be real.</text></g>`;
}

function statePage(state, index) {
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${state.phase}" data-site-progress="${state.progress}" data-site-progress-label="${state.superMode && !state.fixed ? "AUTO AWESOMENESS METER" : "HONESTY METER"}" data-passage-progress="50" data-visual-delta="${state.delta}"><use href="#sharedShell"/>${titlebarPatch()}<rect x="109" y="56" width="802" height="782" fill="#F4F5F7"/>${header()}${post(state)}${albumRail(state)}${footer(state)}${companion(state)}${checklist(state)}<rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellHash}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="faceCorruptHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".26" stroke-width="3"/></pattern><clipPath id="facePhotoClip"><rect width="532" height="240" rx="4"/></clipPath><filter id="faceOverEnhance"><feColorMatrix type="saturate" values="2.35"/><feComponentTransfer><feFuncR type="linear" slope="1.12" intercept=".04"/><feFuncG type="linear" slope="1.12" intercept=".04"/><feFuncB type="linear" slope="1.12" intercept=".04"/></feComponentTransfer></filter></defs><style>${shellStyles}.task-label,.face-mark,.face-logo,.face-muted,.face-blue,.face-small,.face-label,.face-tiny,.face-micro,.face-caption,.face-body,.face-meter,.face-enhanced,.face-icon,.face-album,.face-reaction,.lock-title,.lock-label,.lock-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.task-label{font-size:14px;font-weight:600;fill:#15191B}.face-mark{font-size:34px;font-weight:700;fill:#315CAA}.face-logo{font-size:25px;font-weight:700;fill:#fff}.face-muted{font-size:11px;fill:#78828A}.face-blue{fill:#315CAA}.face-small{font-size:11px;fill:#34444D}.face-label{font-size:11px;font-weight:700;fill:#172D40}.face-tiny{font-size:9px;fill:#596267}.face-micro{font-size:8px;fill:#596267}.face-caption{font-size:16px;font-weight:700}.face-body{font-size:10px}.face-meter{font-size:13px;font-weight:700}.face-enhanced{font-size:14px;font-weight:700;fill:#fff}.face-icon{font-size:10px;font-weight:700;fill:#315CAA}.face-album{font-size:9px;font-weight:700}.face-reaction{font-size:11px;font-weight:700}.lock-title{font-size:19px;font-weight:700;fill:#fff}.lock-label{font-size:12px;font-weight:700}.lock-mark{font-size:15px;font-weight:700}</style>${states.map(statePage).join("\n")}</svg>`;
fs.writeFileSync(output, svg);

for (let page = 1; page <= states.length; page += 1) {
  execFileSync(
    "/Applications/Inkscape.app/Contents/MacOS/inkscape",
    [path.basename(output), `--export-page=${page}`, "--export-area-page", "--export-type=png", "--export-width=1440", `--export-filename=faceplace-anchor-v2_p${page}.png`],
    { cwd: outputDirectory, stdio: "ignore" },
  );
}

const slides = states.map((state, index) => {
  const filename = `faceplace-anchor-v2_p${index + 1}.png`;
  const digest = crypto.createHash("sha256").update(fs.readFileSync(path.join(outputDirectory, filename))).digest("hex").slice(0, 12);
  return { title: state.label, src: `${filename}?v=${digest}` };
});
const review = `<!doctype html><html><head><meta charset="utf-8"><title>FacePlace production review v2</title><style>html,body{margin:0;background:#15252f;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:0 auto;padding:18px}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;background:#0c3944;border:2px solid #8db4bd}.stage img{display:block;width:100%;height:auto}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;border:1px solid #fff;background:#0b2f3dcc;color:#fff;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;border:3px solid transparent;background:#244b55;color:#fff;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main" alt=""><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(next){index=(next+slides.length)%slides.length;main.src=slides[index].src;main.alt=slides[index].title;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}slides.forEach((slide,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+slide.src+'" alt=""><span>'+slide.title+'</span>';b.onclick=()=>show(i);strip.append(b)});document.querySelector('#prev').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0);</script></body></html>`;
fs.writeFileSync(path.join(outputDirectory, "faceplace-anchor-review-v2.html"), review);
console.log(`Wrote ${states.length} FacePlace v2 review frames and click-through reviewer.`);
