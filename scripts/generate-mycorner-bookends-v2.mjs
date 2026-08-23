#!/usr/bin/env node

import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outDir = path.resolve("docs/design/screens/2026-08-16/mycorner-production");
const outSvg = path.join(outDir, "mycorner-bookends-master-v2.svg");
const outReview = path.join(outDir, "mycorner-bookends-review-v2.html");
const shellPath = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg",
);
const amyPath = path.resolve("apps/internet-recovery/art/characters/dialogue/amy-supportive.jpg");
fs.mkdirSync(outDir, { recursive: true });

const shell = fs.readFileSync(shellPath, "utf8");
const defs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const styles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!defs || !styles) throw new Error("Reviewed shared shell unavailable.");
const shellHash = crypto.createHash("sha256").update(defs).digest("hex");
const sharedDefs = defs.replaceAll(
  'href="assets/',
  'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/',
);
const amyAsset = path.relative(outDir, amyPath);

const states = [
  { id: "initial", label: "Initial impersonator profile", progress: 0, fixed: false },
  { id: "repaired", label: "Known Amy profile restored", progress: 100, fixed: true },
];

function titlebarPatch() {
  return `<g><rect x="112" y="24" width="520" height="29" fill="url(#titleGradient)"/><text x="126" y="46" class="window-title">www.my-corner.com</text><rect x="112" y="861" width="188" height="31" fill="url(#buttonGradient)" stroke="#6d6d67" stroke-width="1.3"/><text x="54" y="882" class="task-label" text-anchor="middle">START</text><text x="146" y="882" class="task-label">MYCORNER</text></g>`;
}

function siteHeader() {
  return `<g data-qa-box="109,56,911,150">
    <rect x="109" y="56" width="802" height="56" fill="#49206E"/>
    <rect x="124" y="70" width="29" height="29" rx="5" fill="#E64D9E"/>
    <rect x="141" y="82" width="29" height="29" rx="5" fill="#48B8C8"/>
    <rect x="158" y="73" width="29" height="29" rx="5" fill="#A5D64D"/>
    <text x="201" y="98" class="mc-logo">mycorner</text>
    <rect x="425" y="71" width="272" height="31" rx="5" fill="#fff"/>
    <text x="441" y="92" class="mc-small mc-muted">Search people</text>
    <text x="786" y="91" class="mc-small" fill="#fff">MAIL · FRIENDS</text>
    <rect x="109" y="112" width="802" height="38" fill="#E8DAF1" stroke="#A68EB7"/>
    <text x="126" y="136" class="mc-tab">HOME</text>
    <text x="186" y="136" class="mc-tab">BROWSE</text>
    <text x="260" y="136" class="mc-tab">PROFILES</text>
    <text x="344" y="136" class="mc-tab">BLOGS</text>
    <text x="405" y="136" class="mc-tab">MUSIC</text>
    <text x="466" y="136" class="mc-tab">BULLETINS</text>
  </g>`;
}

function paperMask() {
  return `<g data-profile-image="paper-mask">
    <rect x="132" y="181" width="211" height="199" rx="5" fill="#252B38" stroke="${COLORS.corruption}" stroke-width="3"/>
    <path d="M155 365 Q235 292 320 365" fill="#15191F"/>
    <circle cx="235" cy="309" r="50" fill="#20252D"/>
    <line x1="235" y1="318" x2="235" y2="369" stroke="#B98B54" stroke-width="8"/>
    <g transform="rotate(-7 235 258)">
      <rect x="171" y="198" width="128" height="128" fill="#fff" stroke="#D8D0C3" stroke-width="8"/>
      <image href="${amyAsset}" x="180" y="207" width="110" height="110" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <text x="237" y="371" class="mc-micro" text-anchor="middle" fill="#fff">PHOTO TAPED TO A POPSICLE STICK</text>
  </g>`;
}

function realAmyPhoto() {
  return `<g data-profile-image="known-amy">
    <rect x="132" y="181" width="211" height="199" rx="5" fill="#ECF4EE" stroke="${COLORS.repair}" stroke-width="3"/>
    <image href="${amyAsset}" x="143" y="191" width="189" height="165" preserveAspectRatio="xMidYMid slice"/>
    <rect x="143" y="356" width="189" height="16" fill="#fff"/>
    <text x="237" y="368" class="mc-micro" text-anchor="middle" fill="${COLORS.repairDark}">AMY · KNOWN PROFILE</text>
  </g>`;
}

function contactBox(fixed) {
  const border = fixed ? COLORS.repair : COLORS.corruption;
  const labels = fixed
    ? ["MESSAGE", "ADD FRIEND", "FAMILY CHAT", "BLOCK COPY"]
    : ["MESSAGE", "ADD FRIEND", "FORWARD", "BLOCK USER"];
  return `<g data-contact-box="true">
    <rect x="132" y="391" width="211" height="105" fill="#fff" stroke="${border}"/>
    <rect x="132" y="391" width="211" height="27" fill="#6D3996"/>
    <text x="143" y="410" class="mc-label" fill="#fff">CONTACTING ${fixed ? "AMY" : "DEFINITELYAMY"}</text>
    ${labels.map((label, index) => {
      const x = index % 2 === 0 ? 144 : 244;
      const y = index < 2 ? 443 : 475;
      const symbol = ["✉", "+", "◆", "×"][index];
      return `<text x="${x}" y="${y}" class="mc-icon" fill="${border}">${symbol}</text><text x="${x + 17}" y="${y}" class="mc-micro">${label}</text>`;
    }).join("")}
  </g>`;
}

function detailsBox(fixed) {
  const rows = fixed
    ? [
        ["Joined", "6 years ago"],
        ["Hometown", "San Francisco"],
        ["Status", "At home"],
        ["Last login", "Yesterday"],
      ]
    : [
        ["Joined", "6 minutes ago"],
        ["Hometown", "Paris? Dubai?"],
        ["Status", "STILL STRANDED"],
        ["Last login", "Right now"],
      ];
  return `<g data-details-box="true">
    <rect x="132" y="508" width="211" height="139" fill="#FAF7FC" stroke="#C8B5D7"/>
    <rect x="132" y="508" width="211" height="27" fill="#E8DAF1"/>
    <text x="143" y="527" class="mc-label" fill="#49206E">${fixed ? "AMY'S DETAILS" : "DEFINITELYAMY'S DETAILS"}</text>
    ${rows.map(([label, value], index) => `<text x="143" y="${554 + index * 22}" class="mc-micro" fill="#66717A">${label}</text><text x="211" y="${554 + index * 22}" class="mc-small" fill="${fixed ? "#172D40" : COLORS.corruption}">${value}</text>`).join("")}
  </g>`;
}

function identityHeader(fixed) {
  if (fixed) {
    return `<g data-identity-header="known">
      <text x="365" y="186" class="mc-name">Amy</text>
      <text x="365" y="207" class="mc-small" fill="#66717A">San Francisco · known profile · joined 6 years ago</text>
      <rect x="779" y="168" width="107" height="30" rx="5" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}"/>
      <text x="833" y="188" class="mc-label" text-anchor="middle" fill="${COLORS.repairDark}">✓ CONFIRMED</text>
    </g>`;
  }
  return `<g data-identity-header="impersonator">
    <text x="365" y="186" class="mc-name">DefinitelyAmy_Official_Real</text>
    <text x="365" y="207" class="mc-small" fill="${COLORS.corruption}">Online now · new account · identity not verified</text>
    <rect x="779" y="168" width="107" height="30" rx="5" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}"/>
    <text x="833" y="188" class="mc-label" text-anchor="middle" fill="${COLORS.corruptionDark}">! NEW PROFILE</text>
  </g>`;
}

function leadPost(fixed) {
  if (fixed) {
    return `<g data-lead-post="known-post">
      <rect x="365" y="226" width="521" height="92" rx="5" fill="#F8F3FA" stroke="#C8B5D7"/>
      <rect x="365" y="226" width="521" height="27" fill="#6D3996"/>
      <text x="378" y="245" class="mc-label" fill="#fff">AMY'S LATEST POST</text>
      <text x="381" y="276" class="mc-body">Printer repair update: the printer made one noise, ate two labels,</text>
      <text x="381" y="297" class="mc-body">and is now pretending it has never met me. Progress!</text>
    </g>`;
  }
  return `<g data-lead-post="urgent-pitch">
    <rect x="365" y="226" width="521" height="92" rx="5" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}" stroke-width="2"/>
    <rect x="365" y="226" width="521" height="27" fill="${COLORS.corruption}"/>
    <text x="378" y="245" class="mc-label" fill="#fff">URGENT BULLETIN!!!</text>
    <text x="381" y="276" class="mc-alert">HELP! ROYAL USB CONFERENCE EMERGENCY!</text>
    <text x="381" y="299" class="mc-body" fill="${COLORS.corruptionDark}">Send $20 now and I will definitely return $200. Please do not call me.</text>
  </g>`;
}

function blurbs(fixed) {
  const about = fixed
    ? ["Engineer, tea drinker, printer negotiator.", "Usually accompanied by Techno and several cables."]
    : ["Hello it is me, Amy. I am extremely abroad.", "My camera broke, so please trust this photograph instead."];
  const meet = fixed
    ? "People who label their cables before unplugging them."
    : "A helpful nephew who acts before checking anything.";
  return `<g data-blurbs="true">
    <rect x="365" y="330" width="521" height="128" fill="#fff" stroke="#C8B5D7"/>
    <rect x="365" y="330" width="521" height="27" fill="#E8DAF1"/>
    <text x="378" y="349" class="mc-label" fill="#49206E">${fixed ? "AMY'S BLURBS" : "DEFINITELYAMY'S BLURBS"}</text>
    <text x="378" y="379" class="mc-label" fill="#D14A9A">About me:</text>
    <text x="456" y="379" class="mc-body">${about[0]}</text>
    <text x="456" y="398" class="mc-body">${about[1]}</text>
    <text x="378" y="425" class="mc-label" fill="#D14A9A">Who I'd like to meet:</text>
    <text x="505" y="425" class="mc-body" fill="${fixed ? "#172D40" : COLORS.corruptionDark}">${meet}</text>
  </g>`;
}

function timeline(fixed) {
  if (fixed) {
    return `<g data-timeline="known-history">
      <rect x="365" y="470" width="521" height="177" fill="#fff" stroke="#C8B5D7"/>
      <rect x="365" y="470" width="521" height="27" fill="#6D3996"/>
      <text x="378" y="489" class="mc-label" fill="#fff">AMY'S COMMENTS &amp; HISTORY</text>
      <circle cx="391" cy="524" r="13" fill="#48B8C8"/><text x="391" y="528" class="mc-label" text-anchor="middle" fill="#fff">F</text>
      <text x="416" y="519" class="mc-label" fill="#49206E">Saved family chat</text>
      <text x="416" y="538" class="mc-body">Amy confirmed she is home. Same contact route as always.</text>
      <line x1="379" y1="553" x2="872" y2="553" stroke="#E0D6E7"/>
      <circle cx="391" cy="579" r="13" fill="#A5D64D"/><text x="391" y="583" class="mc-label" text-anchor="middle" fill="#26431A">6y</text>
      <text x="416" y="574" class="mc-label" fill="#49206E">Profile history</text>
      <text x="416" y="593" class="mc-body">Six years of posts, distinct photos, and familiar details restored.</text>
      <rect x="379" y="608" width="493" height="27" fill="#EEF3EF" stroke="${COLORS.repair}"/>
      <text x="390" y="626" class="mc-small" fill="${COLORS.repairDark}">✓ Copied profile separated and blocked — Amy's account remains.</text>
    </g>`;
  }
  const entries = [
    ["6 MIN AGO · PARIS", "Boarding now from Paris. Very stranded."],
    ["4 MIN AGO · DUBAI", "Still boarding now, but from Dubai."],
    ["1 MIN AGO · GATE 404", "Emergency fee changed again. Do not call."],
  ];
  return `<g data-timeline="contradictions">
    <rect x="365" y="470" width="521" height="177" fill="#fff" stroke="${COLORS.corruption}"/>
    <rect x="365" y="470" width="521" height="27" fill="#6D3996"/>
    <text x="378" y="489" class="mc-label" fill="#fff">DEFINITELYAMY'S LATEST BULLETINS</text>
    ${entries.map(([stamp, body], index) => {
      const y = 516 + index * 42;
      return `<text x="380" y="${y}" class="mc-micro" fill="${COLORS.corruption}">${stamp}</text><text x="510" y="${y}" class="mc-body">${body}</text>${index < 2 ? `<line x1="379" y1="${y + 14}" x2="872" y2="${y + 14}" stroke="#EAD7D6"/>` : ""}`;
    }).join("")}
    <text x="380" y="634" class="mc-micro" fill="${COLORS.corruptionDark}">COMMENTS (1): PrinceOfPrinters — “Third new profile today?”</text>
  </g>`;
}

function footer(state) {
  const color = state.fixed ? COLORS.repair : COLORS.corruption;
  const fill = Math.round(752 * state.progress / 100);
  return `<g data-site-meter="true">
    <rect x="109" y="663" width="802" height="175" fill="#F7F5EE"/>
    <line x1="109" y1="663" x2="911" y2="663" stroke="#8E9AA0"/>
    <text x="126" y="705" class="mc-meter" fill="${color}">PROFILE REPAIR</text>
    <text x="270" y="705" class="mc-meter" fill="${color}">${state.progress}%</text>
    <rect x="126" y="721" width="752" height="25" fill="${state.fixed ? "#EEF3EF" : "url(#mcCorruptHatch)"}" stroke="${color}"/>
    <rect x="126" y="721" width="${fill}" height="25" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/>
    <text x="878" y="783" class="mc-micro" text-anchor="end" fill="${color}">${state.fixed ? "KNOWN PROFILE RESTORED" : "IMPERSONATION DETECTED"}</text>
  </g>`;
}

function companion() {
  return `<g data-companion-state="bookend-placeholder" data-qa-box="958,78,1395,552">
    <text x="964" y="112" class="reading-body">Reading Companion content stays</text>
    <text x="964" y="150" class="reading-body">independent from this site mockup.</text>
    <rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/>
    <text x="964" y="209" class="reading-body">Site bookend review</text>
  </g>`;
}

function page(state, index) {
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="phase-1" data-site-progress="${state.progress}" data-passage-progress="50" data-visual-delta="${state.fixed ? 3 : 0}">
    <use href="#sharedShell"/>
    ${titlebarPatch()}
    <rect x="109" y="56" width="802" height="782" fill="#E9DFF0"/>
    ${siteHeader()}
    ${state.fixed ? realAmyPhoto() : paperMask()}
    ${contactBox(state.fixed)}
    ${detailsBox(state.fixed)}
    ${identityHeader(state.fixed)}
    ${leadPost(state.fixed)}
    ${blurbs(state.fixed)}
    ${timeline(state.fixed)}
    ${footer(state)}
    ${companion()}
    <rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/>
  </g>`;
}

const pages = states
  .map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`)
  .join("");
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellHash}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${sharedDefs}<pattern id="mcCorruptHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".26" stroke-width="3"/></pattern></defs><style>${styles}.task-label,.mc-logo,.mc-small,.mc-tab,.mc-label,.mc-micro,.mc-icon,.mc-name,.mc-body,.mc-alert,.mc-meter{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.task-label{font-size:14px;font-weight:600;fill:#15191B}.mc-logo{font-size:28px;font-weight:700;fill:#fff}.mc-small{font-size:10px}.mc-muted{fill:#78828A}.mc-tab{font-size:10px;font-weight:700;fill:#49206E}.mc-label{font-size:11px;font-weight:700}.mc-micro{font-size:8px}.mc-icon{font-size:13px;font-weight:700}.mc-name{font-size:19px;font-weight:700;fill:#172D40}.mc-body{font-size:10px;fill:#172D40}.mc-alert{font-size:14px;font-weight:700;fill:${COLORS.corruption}}.mc-meter{font-size:13px;font-weight:700}</style>${states.map(page).join("\n")}</svg>`;
fs.writeFileSync(outSvg, svg);

const slides = states.map((state, index) => ({
  title: state.label,
  src: `mycorner-bookends-v2_p${index + 1}.png`,
}));
const review = `<!doctype html><html><head><meta charset="utf-8"><title>MyCorner v2 bookend review</title><style>html,body{margin:0;background:#2a1738;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:auto;padding:18px}.head{display:flex;justify-content:space-between;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;border:2px solid #bb8bd0}.stage img{display:block;width:100%}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;background:#29133dcc;color:white;border:1px solid white;font-size:38px}.strip{display:flex;gap:10px;padding-top:12px}.thumb{width:260px;background:#4a2c5c;color:white;border:3px solid transparent;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main"><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(slides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(n){index=(n+slides.length)%slides.length;main.src=slides[index].src;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((e,i)=>e.classList.toggle('active',i===index))}slides.forEach((s,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+s.src+'"><span>'+s.title+'</span>';b.onclick=()=>show(i);strip.append(b)});prev.onclick=()=>show(index-1);next.onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0)</script></body></html>`;
fs.writeFileSync(outReview, review);

for (let pageNumber = 1; pageNumber <= states.length; pageNumber += 1) {
  execFileSync(
    "/opt/homebrew/bin/inkscape",
    [
      path.basename(outSvg),
      `--export-page=${pageNumber}`,
      "--export-area-page",
      "--export-type=png",
      "--export-width=1440",
      `--export-filename=mycorner-bookends-v2_p${pageNumber}.png`,
    ],
    { cwd: outDir, stdio: "ignore" },
  );
}

console.log(`Wrote ${outSvg}, ${outReview}, and ${states.length} PNG bookends.`);
