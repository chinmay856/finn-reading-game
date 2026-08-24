#!/usr/bin/env node

import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve("docs/design/screens/2026-08-22/mycorner-production");
const output = path.join(outputDirectory, "mycorner-anchor-master-v3.svg");
const reviewPath = path.join(outputDirectory, "mycorner-anchor-review-v3.html");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const basePhotoPath = path.join(outputDirectory, "assets/mycorner-impersonation-base-v1.png");
const autoPhotoPath = path.join(outputDirectory, "assets/mycorner-impersonation-auto-v1.png");
const suspiciousFriendPath = path.join(outputDirectory, "assets/mycorner-suspicious-friend-v1.png");
const autoBeachPath = path.join(outputDirectory, "assets/auto-profile-beach-v1.png");
const autoHikePath = path.join(outputDirectory, "assets/auto-profile-hike-v1.png");
const autoBirthdayPath = path.join(outputDirectory, "assets/auto-profile-birthday-v1.png");
const autoMuseumPath = path.join(outputDirectory, "assets/auto-profile-museum-v1.png");
const amyKnownPath = path.join(outputDirectory, "assets/amy-known-profile-v1.png");
const chinmayKnownPath = path.join(outputDirectory, "assets/chinmay-known-profile-v1.png");
const technoPath = path.join(outputDirectory, "assets/techno-top-friend-v1.png");

fs.mkdirSync(outputDirectory, { recursive: true });
for (const required of [shellPath, basePhotoPath, autoPhotoPath, suspiciousFriendPath, autoBeachPath, autoHikePath, autoBirthdayPath, autoMuseumPath, amyKnownPath, chinmayKnownPath, technoPath]) {
  if (!fs.existsSync(required)) throw new Error(`Missing required MyCorner asset: ${required}`);
}

const shell = fs.readFileSync(shellPath, "utf8");
const shellDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!shellDefs || !shellStyles) throw new Error("Reviewed shared shell is unavailable.");
const shellHash = crypto.createHash("sha256").update(shellDefs).digest("hex");
const referenceDefs = shellDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');

const rel = (assetPath) => path.relative(outputDirectory, assetPath);
const ASSETS = Object.freeze({
  base: rel(basePhotoPath),
  auto: rel(autoPhotoPath),
  suspicious: rel(suspiciousFriendPath),
  autoBeach: rel(autoBeachPath),
  autoHike: rel(autoHikePath),
  autoBirthday: rel(autoBirthdayPath),
  autoMuseum: rel(autoMuseumPath),
  amy: rel(amyKnownPath),
  chinmay: rel(chinmayKnownPath),
  techno: rel(technoPath),
});

const states = Object.freeze([
  { id: "initial", label: "Impersonator profile", progress: 0, stage: "first" },
  { id: "details-restored", label: "Profile details restored", progress: 25, stage: "first", profileDetails: true },
  { id: "bulletins-restored", label: "Latest bulletins restored", progress: 50, stage: "first", profileDetails: true, history: true, request: true },
  { id: "blurbs-restored", label: "Profile blurbs restored", progress: 75, stage: "first", profileDetails: true, history: true, request: true, blurbs: true },
  { id: "known-profile", label: "Known Amy profile restored", progress: 100, stage: "first", real: true },
  { id: "auto-overfix", label: "Auto makes the profile consistent", progress: 0, stage: "auto", auto: true },
  { id: "lock-open", label: "Lock in identity checks", progress: 0, stage: "lock", auto: true, checklist: 0 },
  { id: "person-checked", label: "Identity details checked", progress: 25, stage: "lock", auto: true, checklist: 1, identityChecked: true },
  { id: "history-kept", label: "Account history checked", progress: 50, stage: "lock", auto: true, checklist: 2, identityChecked: true, history: true, blurbs: true },
  { id: "known-route", label: "Known contact route verified", progress: 75, stage: "lock", auto: true, checklist: 3, identityChecked: true, history: true, blurbs: true, verify: true },
  { id: "request-blocked", label: "Money request flagged", progress: 100, stage: "lock", checklist: 4, real: true },
  { id: "secured", label: "Identity repair secured", progress: 100, stage: "secured", real: true },
]);

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function titlebarPatch() {
  return `<g data-module="browser-chrome" data-purpose="persistent parody cue"><rect x="112" y="24" width="520" height="29" fill="url(#titleGradient)"/><text x="126" y="46" class="window-title">www.my-corner.com</text><rect x="112" y="861" width="190" height="31" fill="url(#buttonGradient)" stroke="#6d6d67" stroke-width="1.3"/><text x="54" y="882" class="mc-task" text-anchor="middle">START</text><text x="146" y="882" class="mc-task">MYCORNER</text></g>`;
}

function siteHeader() {
  return `<g data-module="site-header" data-purpose="persistent parody cue">
    <rect x="109" y="56" width="802" height="58" fill="#1C4C82"/>
    <text x="126" y="94" class="mc-logo">mycorner</text>
    <text x="291" y="78" class="mc-tiny mc-white">A PLACE FOR FRIENDS</text>
    <rect x="416" y="69" width="276" height="29" rx="3" fill="#fff"/>
    <text x="429" y="89" class="mc-small mc-muted">Search MyCorner</text>
    <rect x="704" y="69" width="58" height="29" rx="3" fill="#F0A33A"/><text x="733" y="89" class="mc-small" text-anchor="middle" fill="#173A62">SEARCH</text>
    <text x="786" y="87" class="mc-small mc-white">HELP · SIGN OUT</text>
    <rect x="109" y="114" width="802" height="36" fill="#6DA5D7"/>
    ${["HOME","BROWSE","SEARCH","INVITE","FILM","MAIL","BLOG","MUSIC","VIDEO"].map((item, index) => `<text x="${126 + index * 72}" y="137" class="mc-tab">${item}</text>`).join("")}
  </g>`;
}

function networkHeader(state) {
  const real = state.real || state.identityChecked;
  const auto = state.auto;
  const name = real ? "Amy" : "DefinitelyAmy_Official_Real";
  return `<g data-module="profile-identity" data-purpose="repair target">
    <text x="365" y="178" class="mc-name">${name}</text>
    <text x="365" y="197" class="mc-small ${real ? "mc-green" : "mc-red"}">${real ? "San Francisco · known profile · joined 6 years ago" : auto ? "AUTO VERIFIED ∞% · ONLINE EVERYWHERE" : "ONLINE NOW · IDENTITY NOT VERIFIED"}</text>
    <rect x="365" y="207" width="521" height="32" fill="${real ? COLORS.repairSoft : auto ? "#F3D9FF" : COLORS.corruptionSoft}" stroke="${real ? COLORS.repair : COLORS.corruption}"/>
    <text x="625" y="228" class="mc-label" text-anchor="middle" fill="${real ? COLORS.repairDark : COLORS.corruptionDark}">${real ? "AMY IS IN YOUR EXTENDED NETWORK" : auto ? "AUTO IS IN EVERY EXTENDED NETWORK" : "NEW PROFILE · NOT YET IN YOUR NETWORK"}</text>
  </g>`;
}

function profilePhoto(state) {
  const real = state.real;
  const autoPhoto = state.auto && !state.identityChecked;
  const knownPhoto = real || state.identityChecked;
  const href = knownPhoto ? ASSETS.amy : autoPhoto ? ASSETS.auto : ASSETS.base;
  const border = knownPhoto ? COLORS.repair : COLORS.corruption;
  return `<g data-module="profile-photo" data-purpose="repair target" data-photo-state="${knownPhoto ? "known-amy" : autoPhoto ? "auto-enhanced-copy" : "obvious-cardboard-copy"}">
    <rect x="127" y="176" width="226" height="180" rx="4" fill="#fff" stroke="${border}" stroke-width="3"/>
    <image href="${href}" x="133" y="182" width="214" height="168" preserveAspectRatio="xMidYMid slice"/>
    <text x="240" y="371" class="mc-small" text-anchor="middle" fill="${border}">${knownPhoto ? "View Amy's Pics" : autoPhoto ? "View 17 Auto Proofs" : "View Profile Pics"}</text>
  </g>`;
}

function profileDetailsGroup(state) {
  const restored = state.real || state.profileDetails || state.identityChecked;
  const color = restored ? COLORS.repair : COLORS.corruption;
  return `<g data-module="profile-details-group" data-purpose="repair target"><rect x="121" y="374" width="238" height="281" rx="5" fill="none" stroke="${color}" stroke-width="3"/></g>`;
}

function profileSong(state) {
  const real = state.real;
  const auto = state.auto;
  const restored = real || state.profileDetails || state.identityChecked;
  const border = restored ? COLORS.repair : COLORS.corruption;
  return `<g data-module="profile-song" data-purpose="persistent parody cue">
    <rect x="127" y="380" width="226" height="45" fill="${restored ? COLORS.repairSoft : auto ? COLORS.corruptionSoft : "#FFF7F6"}" stroke="${border}" stroke-width="2"/>
    <text x="138" y="397" class="mc-tiny mc-blue">PROFILE SONG</text>
    <text x="138" y="416" class="mc-small ${restored ? "" : "mc-red"}">${restored ? "Techno's Fetch Mix" : auto ? "Profile Clarity Mix ∞" : "Airport Hold Music"}</text>
    <rect x="290" y="390" width="50" height="24" rx="3" fill="#D5D9DC"/><text x="315" y="407" class="mc-tiny" text-anchor="middle">MUTED</text>
  </g>`;
}

function contactBox(state) {
  const real = state.real;
  const restored = real || state.profileDetails || state.verify;
  const verifiedRoute = state.verify || real;
  const target = restored ? "KNOWN AMY" : "DEFINITELYAMY";
  const items = restored ? [["✉","MESSAGE · VERIFIED"],["+","ADD FRIEND"],["☎","PHONE · VERIFIED"],["×",verifiedRoute ? "BLOCK COPY" : "BLOCK USER"]] : [];
  const border = restored ? COLORS.repair : COLORS.corruption;
  return `<g data-module="contact-actions" data-purpose="repair target">
    <rect x="127" y="434" width="226" height="88" fill="${restored ? COLORS.repairSoft : "#FFF7F6"}" stroke="${border}" stroke-width="2"/>
    <rect x="127" y="434" width="226" height="25" fill="#F0A33A"/>
    <text x="139" y="452" class="mc-label" fill="#173A62">CONTACTING ${target}</text>
    <text x="139" y="471" class="mc-tiny ${restored ? "mc-green" : "mc-red"}">${restored ? "KNOWN CONTACT METHODS" : "ONLINE MESSAGES ONLY · UNSECURED"}</text>
    ${restored ? items.map(([icon, item], index) => { const x = index % 2 ? 242 : 140; const y = index < 2 ? 492 : 513; return `<text x="${x}" y="${y}" class="mc-icon" fill="${COLORS.repair}">${icon}</text><text x="${x + 15}" y="${y}" class="mc-contact">${item}</text>`; }).join("") : `<rect x="139" y="480" width="202" height="30" rx="4" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}"/><text x="158" y="500" class="mc-icon" fill="${COLORS.corruption}">✉</text><text x="239" y="500" class="mc-contact mc-contact-large" text-anchor="middle">MESSAGE ONLINE</text>`}
  </g>`;
}

function detailsBox(state) {
  const real = state.real;
  const auto = state.auto;
  const restored = real || state.profileDetails || state.identityChecked;
  let rows;
  if (restored) rows = [["Joined","6 years ago"],["Hometown","San Francisco"],["Mood","Tea: ready"],["Last login","Yesterday"]];
  else if (auto) rows = [["Joined","HISTORY GENERATED"],["Hometown","EVERYWHERE ONLINE"],["Mood","MAXIMUM CLARITY"],["Last login","Always"]];
  else rows = [["Joined","6 minutes ago"],["Hometown","Paris? Dubai?"],["Mood","STRANDED!!!"],["Last login","Right now"]];
  return `<g data-module="profile-details" data-purpose="repair target">
    <rect x="127" y="531" width="226" height="118" fill="${restored ? COLORS.repairSoft : "#FFF7F6"}" stroke="${restored ? COLORS.repair : COLORS.corruption}" stroke-width="2"/>
    <rect x="127" y="531" width="226" height="24" fill="#D7E7F4"/><text x="139" y="548" class="mc-label mc-blue">${restored ? "AMY'S DETAILS" : "PROFILE DETAILS"}</text>
    ${rows.map(([label,value], index) => `<text x="139" y="${572 + index * 18}" class="mc-tiny mc-muted">${label}</text><text x="204" y="${572 + index * 18}" class="mc-small ${restored ? "" : "mc-red"}">${value}</text>`).join("")}
  </g>`;
}

function leadPost(state) {
  const fixed = state.real || state.request;
  if (fixed) return `<g data-module="lead-bulletin" data-purpose="repair target"><rect x="365" y="248" width="521" height="83" rx="4" fill="#fff" stroke="${COLORS.repair}"/><rect x="365" y="248" width="521" height="25" fill="#315C8B"/><text x="378" y="266" class="mc-label mc-white">AMY'S LATEST BULLETIN</text><text x="380" y="294" class="mc-body">Techno found a stick longer than the sidewalk.</text><text x="380" y="314" class="mc-body">She is keeping it.</text></g>`;
  if (state.auto) return `<g data-module="lead-bulletin" data-purpose="repair target"><rect x="365" y="248" width="521" height="83" rx="4" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="2"/><rect x="365" y="248" width="521" height="25" fill="${COLORS.corruption}"/><text x="378" y="266" class="mc-label mc-white">AUTO URGENT BULLETIN · BLUETOOTH ENABLED</text><text x="380" y="294" class="mc-alert">AUTO VIP AIRPORT RESCUE ACTIVATED!</text><text x="380" y="314" class="mc-body mc-red">Travel request upgraded: send $20,000 for a private jet home.</text></g>`;
  return `<g data-module="lead-bulletin" data-purpose="repair target"><rect x="365" y="248" width="521" height="83" rx="4" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="2"/><rect x="365" y="248" width="521" height="25" fill="${COLORS.corruption}"/><text x="378" y="266" class="mc-label mc-white">URGENT BULLETIN!!!</text><text x="380" y="294" class="mc-alert">HELP! MY PHONE BROKE AT THE AIRPORT!</text><text x="380" y="314" class="mc-body mc-red">Send $2,000 for a plane ticket home. Please don't call—messages only.</text></g>`;
}

function blurbs(state) {
  const real = state.real;
  const auto = state.auto;
  const restored = real || state.blurbs;
  const about = restored ? "Engineer, coffee drinker, Techno's ball thrower." : auto ? "Every missing detail generated. Profile clarity: complete." : "Hello it is me, Amy. I am extremely abroad.";
  const meet = restored ? "People who throw the ball for Techno." : auto ? "Anyone who can send $20,000 before takeoff." : "A helpful friend who can send $2,000 before takeoff.";
  return `<g data-module="blurbs" data-purpose="repair target"><rect x="365" y="341" width="521" height="91" fill="${restored ? COLORS.repairSoft : "#FFF7F6"}" stroke="${restored ? COLORS.repair : COLORS.corruption}" stroke-width="2"/><rect x="365" y="341" width="521" height="24" fill="#D7E7F4"/><text x="378" y="358" class="mc-label mc-blue">${restored ? "AMY'S BLURBS" : "PROFILE BLURBS"}</text><text x="378" y="385" class="mc-label" fill="#C13A86">About me:</text><text x="455" y="385" class="mc-body ${restored ? "" : "mc-red"}">${about}</text><text x="378" y="412" class="mc-label" fill="#C13A86">Who I'd like to meet:</text><text x="500" y="412" class="mc-body ${restored ? "" : "mc-red"}">${meet}</text></g>`;
}

function timeline(state) {
  const real = state.real;
  const auto = state.auto;
  const fixed = state.history;
  let entries;
  if (real) entries = [["YESTERDAY · DOG PARK","Techno found the longest stick."],["LAST WEEK · SAN FRANCISCO","Went for a long run around San Francisco."],["6 YEARS OF POSTS","Consistent account history."]];
  else if (auto && !fixed) entries = [["NOW · VIP AIRPORT LOUNGE","Auto upgraded the trip."],["1 MIN AGO · PROFILE REWRITE","Every conflicting detail now agrees."],["2 MIN AGO · AUTO VERIFIED","Missing history generated. Identity obvious."]];
  else if (fixed) entries = [["YESTERDAY · DOG PARK","Techno found the longest stick."],["LAST WEEK · SAN FRANCISCO","Went for a long run around San Francisco."],["6 YEARS OF POSTS","Consistent account history."]];
  else entries = [["6 MIN AGO · PARIS","Boarding now from Paris. Very stranded."],["4 MIN AGO · DUBAI","Still boarding now, but from Dubai."],["NOW · GATE 404","Emergency fee changed again. Do not call."]];
  const color = real || fixed ? COLORS.repair : COLORS.corruption;
  return `<g data-module="profile-history" data-purpose="repair target"><rect x="365" y="443" width="332" height="206" fill="#fff" stroke="${color}"/><rect x="365" y="443" width="332" height="25" fill="#315C8B"/><text x="377" y="461" class="mc-label mc-white">${real || fixed ? "AMY'S LATEST BULLETINS" : auto ? "AUTO'S PROOF BULLETINS" : "LATEST BULLETINS"}</text>${entries.map(([stamp,body], index) => { const y=489+index*48; return `<text x="378" y="${y}" class="mc-tiny ${real || fixed ? "mc-green" : "mc-red"}">${stamp}</text><text x="378" y="${y+18}" class="mc-small ${real || fixed ? "" : "mc-red"}">${body}</text>${index<2?`<line x1="377" y1="${y+29}" x2="685" y2="${y+29}" stroke="#D9E1E7"/>`:""}`; }).join("")}</g>`;
}

function photoTile(href, x, y, label, color) {
  return `<g><rect x="${x}" y="${y}" width="38" height="43" fill="#fff" stroke="${color}"/><image href="${href}" x="${x+3}" y="${y+3}" width="32" height="31" preserveAspectRatio="xMidYMid slice"/><text x="${x+19}" y="${y+40}" class="mc-mini" text-anchor="middle" fill="${color}">${label}</text></g>`;
}

function largePhotoTile(href, x, y, label, color) {
  return `<g><rect x="${x}" y="${y}" width="72" height="68" fill="#fff" stroke="${color}"/><image href="${href}" x="${x+4}" y="${y+4}" width="64" height="48" preserveAspectRatio="xMidYMid slice"/><text x="${x+36}" y="${y+64}" class="mc-mini" text-anchor="middle" fill="${color}">${label}</text></g>`;
}

function wideFriendTile(href, x, y, label, color) {
  return `<g><rect x="${x}" y="${y}" width="140" height="70" fill="#fff" stroke="${color}"/><image href="${href}" x="${x+5}" y="${y+5}" width="72" height="60" preserveAspectRatio="xMidYMid slice"/><text x="${x+107}" y="${y+40}" class="mc-small" text-anchor="middle" fill="${color}">${label}</text></g>`;
}

function mediumPhotoTile(href, x, y, label, color) {
  return `<g><rect x="${x}" y="${y}" width="50" height="68" fill="#fff" stroke="${color}"/><image href="${href}" x="${x+3}" y="${y+3}" width="44" height="48" preserveAspectRatio="xMidYMid slice"/><text x="${x+25}" y="${y+64}" class="mc-mini" text-anchor="middle" fill="${color}">${label}</text></g>`;
}

function friendSpace(state) {
  const real = state.real;
  const auto = state.auto;
  const known = real || (state.stage === "lock" && state.history);
  let content = "";
  if (known) {
    content = wideFriendTile(ASSETS.chinmay,726,478,"CHINMAY",COLORS.repair)
      + wideFriendTile(ASSETS.techno,726,558,"TECHNO",COLORS.repair);
  } else if (auto) {
    const autoFriends = [
      [ASSETS.autoBeach,"AUTO BEACH"],[ASSETS.autoHike,"AUTO HIKE"],
      [ASSETS.autoBirthday,"AUTO PARTY"],[ASSETS.autoMuseum,"AUTO MUSEUM"],
    ];
    content = autoFriends.map(([href,label],index)=>largePhotoTile(href,714+(index%2)*82,478+Math.floor(index/2)*76,label,COLORS.corruption)).join("");
  } else {
    content = `<g><rect x="744" y="486" width="104" height="124" fill="#fff" stroke="${COLORS.corruption}"/><image href="${ASSETS.suspicious}" x="750" y="492" width="92" height="92" preserveAspectRatio="xMidYMid slice"/><text x="796" y="601" class="mc-friend-legit" text-anchor="middle" fill="${COLORS.corruption}">AMY_FRIEND_LEGIT</text></g>`;
  }
  return `<g data-module="friend-space" data-purpose="repair target"><rect x="706" y="443" width="180" height="206" fill="${known ? COLORS.repairSoft : "#FFF7F6"}" stroke="${known ? COLORS.repair : COLORS.corruption}" stroke-width="2"/><rect x="706" y="443" width="180" height="25" fill="#315C8B"/><text x="716" y="461" class="mc-label mc-white">${known ? "KNOWN FRIENDS" : auto ? "AUTO FRIEND SPACE" : "FRIEND SPACE"}</text>${content}</g>`;
}

const lockItems = Object.freeze(["CHECK THE PERSON", "CHECK ACCOUNT HISTORY", "VERIFY ANOTHER WAY", "PAUSE BEFORE EVER SENDING MONEY"]);
function checklist(state) {
  if (state.checklist === undefined) return "";
  return `<g data-module="lock-overlay" data-purpose="repair target" data-checked="${state.checklist}"><rect x="585" y="374" width="292" height="247" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="585" y="374" width="292" height="45" rx="10" fill="${COLORS.repair}"/><rect x="585" y="406" width="292" height="13" fill="${COLORS.repair}"/><text x="602" y="404" class="mc-lock-title">LOCK IN THE REPAIR</text>${lockItems.map((item,index)=>{const checked=index<state.checklist;const y=440+index*42;return `<rect x="604" y="${y}" width="25" height="25" rx="4" fill="${checked?COLORS.repair:COLORS.corruptionSoft}" stroke="${checked?COLORS.repair:COLORS.corruption}"/><text x="616" y="${y+18}" class="mc-lock-mark" text-anchor="middle" fill="${checked?"#fff":COLORS.corruption}">${checked?"✓":"○"}</text><text x="642" y="${y+18}" class="mc-lock-label" fill="${checked?COLORS.repairDark:COLORS.corruption}">${item}</text>`;}).join("")}</g>`;
}

function footer(state) {
  const color = state.progress === 100 ? COLORS.repair : COLORS.corruption;
  const fill = Math.round(752 * state.progress / 100);
  const status = state.real ? "KNOWN PROFILE SECURED" : state.auto ? "AUTO PROFILE POLISH ACTIVE" : "IMPERSONATION SIGNALS";
  return `<g data-module="site-progress" data-purpose="persistent progress"><rect x="109" y="667" width="802" height="171" fill="#F7F5EE"/><line x1="109" y1="667" x2="911" y2="667" stroke="#8E9AA0"/><text x="126" y="707" class="mc-meter" fill="${color}">IDENTITY CHECKS</text><text x="280" y="707" class="mc-meter" fill="${color}">${state.progress}%</text><rect x="126" y="724" width="752" height="25" fill="url(#mcRedHatch)" stroke="${color}"/><rect x="126" y="724" width="${fill}" height="25" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/><text x="878" y="787" class="mc-tiny" text-anchor="end" fill="${color}">${status}</text></g>`;
}

function companion(state) {
  const text = state.real ? ["The known account, history, and contact route", "separate Amy from the copied profile."] : state.auto ? ["Auto made every profile detail agree", "without checking who controls the account."] : ["This profile has Amy's picture,", "but its history and request do not match."];
  return `<g data-module="reading-companion-placeholder" data-purpose="shared reusable layer"><text x="964" y="112" class="reading-body">${text[0]}</text><text x="964" y="150" class="reading-body">${text[1]}</text><rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/><text x="964" y="209" class="reading-body">Read, then answer the quick check.</text><rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

function page(state, index) {
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${esc(state.label)}" data-stage="${state.stage}" data-phase="${state.stage}" data-site-progress="${state.progress}" data-passage-progress="50"><use href="#sharedShell"/>${titlebarPatch()}<rect x="109" y="56" width="802" height="782" fill="#EEF3F7"/>${siteHeader()}${profilePhoto(state)}${profileDetailsGroup(state)}${profileSong(state)}${contactBox(state)}${detailsBox(state)}${networkHeader(state)}${leadPost(state)}${blurbs(state)}${timeline(state)}${friendSpace(state)}${footer(state)}${companion(state)}${checklist(state)}</g>`;
}

function reviewHtml() {
  const slides = states.map((state,index)=>({title:state.label,src:`mycorner-anchor-v3_p${index+1}.png`}));
  return `<!doctype html><html><head><meta charset="utf-8"><title>MyCorner production review v3</title><style>html,body{margin:0;background:#1e3040;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:auto;padding:18px}.head{display:flex;justify-content:space-between;margin-bottom:12px}h1{font-size:22px;margin:0}.stage{position:relative;border:2px solid #7da7c8}.stage img{display:block;width:100%}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;border:1px solid #fff;background:#173a62cc;color:#fff;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;border:3px solid transparent;background:#315c70;color:#fff;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main" alt=""><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(next){index=(next+slides.length)%slides.length;main.src=slides[index].src+'?v=20260823-mycorner-production-v9';main.alt=slides[index].title;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}slides.forEach((slide,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+slide.src+'?v=20260823-mycorner-production-v9" alt=""><span>'+slide.title+'</span>';b.onclick=()=>show(i);strip.append(b)});document.querySelector('#prev').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);addEventListener('keydown',event=>{if(event.key==='ArrowLeft')show(index-1);if(event.key==='ArrowRight')show(index+1)});show(0);</script></body></html>`;
}

const pages = states.map((state,index)=>`<inkscape:page x="${index*1480}" y="0" width="1440" height="900" inkscape:label="${esc(state.label)}"/>`).join("");
const styles = `${shellStyles}.mc-task,.mc-logo,.mc-tab,.mc-name,.mc-label,.mc-body,.mc-small,.mc-tiny,.mc-mini,.mc-friend-legit,.mc-contact,.mc-icon,.mc-alert,.mc-meter,.mc-lock-title,.mc-lock-label,.mc-lock-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.mc-task{font-size:14px;font-weight:600;fill:#15191B}.mc-logo{font-size:30px;font-weight:700;fill:#fff}.mc-tab{font-size:9px;font-weight:700;fill:#fff}.mc-name{font-size:19px;font-weight:700;fill:#172D40}.mc-label{font-size:11px;font-weight:700}.mc-body{font-size:10px;fill:#172D40}.mc-small{font-size:9px;fill:#172D40}.mc-tiny{font-size:7.5px;fill:#172D40}.mc-mini{font-size:5.7px;font-weight:700}.mc-friend-legit{font-size:7px;font-weight:700}.mc-contact{font-size:5.8px;font-weight:700;fill:#172D40}.mc-contact-large{font-size:8px}.mc-icon{font-size:12px;font-weight:700}.mc-alert{font-size:13px;font-weight:700;fill:${COLORS.corruption}}.mc-meter{font-size:13px;font-weight:700}.mc-lock-title{font-size:15.5px;font-weight:700;fill:#fff}.mc-lock-label{font-size:10px;font-weight:700}.mc-lock-mark{font-size:13px;font-weight:700}.mc-red{fill:${COLORS.corruption}}.mc-green{fill:${COLORS.repair}}.mc-blue{fill:#315C8B}.mc-white{fill:#fff}.mc-muted{fill:#6E7B85}`;
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-site="mycorner" data-shell-reference-sha256="${shellHash}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="mcRedHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".22" stroke-width="3"/></pattern></defs><style>${styles}</style>${states.map(page).join("\n")}</svg>`;

fs.writeFileSync(output, svg);
fs.writeFileSync(reviewPath, reviewHtml());
for (const entry of fs.readdirSync(outputDirectory)) {
  const stale = entry.match(/^mycorner-anchor-v3_p(\d+)\.png$/);
  if (stale && Number(stale[1]) > states.length) fs.unlinkSync(path.join(outputDirectory, entry));
}
for (let index=0; index<states.length; index+=1) {
  const exportPath = path.join(outputDirectory, `mycorner-anchor-v3_p${index+1}.png`);
  execFileSync("inkscape", [output, `--export-page=${index+1}`, `--export-filename=${exportPath}`, "--export-width=1440", "--export-height=900"], {stdio:"inherit"});
}
console.log(`Wrote ${output}`);
console.log(`Wrote ${reviewPath}`);
console.log(`Exported ${states.length} MyCorner review frames.`);
