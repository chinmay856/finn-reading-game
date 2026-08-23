#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const shell = fs.readFileSync(shellPath, "utf8");
const extractedDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedDefs || !shellStyles) throw new Error("Could not extract reviewed shared shell.");
const shellHash = crypto.createHash("sha256").update(extractedDefs).digest("hex");
const referenceDefs = extractedDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');

const COMMON_STYLES = `
.site-text,.site-small,.site-micro,.site-heading,.site-title,.site-logo,.site-meter,.site-status,.lock-title,.lock-label,.lock-mark,.task-label{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}
.task-label{font-size:14px;font-weight:600;fill:#15191B}.site-logo{font-size:28px;font-weight:700}.site-title{font-size:20px;font-weight:700}.site-heading{font-size:15px;font-weight:700}.site-text{font-size:11px}.site-small{font-size:9px}.site-micro{font-size:8px}.site-meter{font-size:13px;font-weight:700}.site-status{font-size:11px;font-weight:700}.lock-title{font-size:19px;font-weight:700;fill:#fff}.lock-label{font-size:12px;font-weight:700}.lock-mark{font-size:15px;font-weight:700}`;

function titlebarPatch(domain, taskLabel) {
  return `<g data-shared-shell-patch="site-identity"><rect x="112" y="24" width="520" height="29" fill="url(#titleGradient)"/><text x="126" y="46" class="window-title">${domain}</text><rect x="112" y="861" width="188" height="31" fill="url(#buttonGradient)" stroke="#6d6d67" stroke-width="1.3"/><text x="54" y="882" class="task-label" text-anchor="middle">START</text><text x="146" y="882" class="task-label">${taskLabel}</text></g>`;
}

function companion(lines) {
  return `<g data-companion-state="reading"><text x="964" y="112" class="reading-body">${lines[0]}</text><text x="964" y="150" class="reading-body">${lines[1]}</text><rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/><text x="964" y="209" class="reading-body">Read, then answer the quick check.</text><rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

function checklist(items) {
  return `<g data-lock-overlay="true"><rect x="390" y="326" width="490" height="310" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="390" y="326" width="490" height="56" rx="10" fill="${COLORS.repair}"/><rect x="390" y="365" width="490" height="17" fill="${COLORS.repair}"/><text x="415" y="362" class="lock-title">LOCK IN THE REPAIR</text>${items.map((item, index) => `<rect x="421" y="${410 + index * 51}" width="29" height="29" rx="5" fill="${COLORS.corruptionSoft}" stroke="${COLORS.corruption}"/><text x="435" y="${431 + index * 51}" class="lock-mark" text-anchor="middle" fill="${COLORS.corruption}">○</text><text x="468" y="${431 + index * 51}" class="lock-label" fill="${COLORS.corruption}">${item}</text>`).join("")}</g>`;
}

function reviewHtml(siteName, prefix, states) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${siteName} bookend review</title><style>html,body{margin:0;background:#15252f;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:0 auto;padding:18px}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;background:#0c3944;border:2px solid #8db4bd}.stage img{display:block;width:100%;height:auto}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;border:1px solid #fff;background:#0b2f3dcc;color:#fff;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;border:3px solid transparent;background:#244b55;color:#fff;padding:0}.thumb.active{border-color:#ff9d00}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main" alt=""><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(states.map((state, index) => ({ title: state.label, src: `${prefix}_p${index + 1}.png` })))};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(next){index=(next+slides.length)%slides.length;main.src=slides[index].src;main.alt=slides[index].title;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}slides.forEach((slide,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+slide.src+'" alt=""><span>'+slide.title+'</span>';b.onclick=()=>show(i);strip.append(b)});document.querySelector('#prev').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0);</script></body></html>`;
}

function writeMaster({ site, directory, prefix, extraDefs = "", states, pageContent }) {
  fs.mkdirSync(directory, { recursive: true });
  const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");
  const layers = states.map((state, index) => `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${state.phase}" data-site-progress="${state.progress}" data-passage-progress="50"><use href="#sharedShell"/>${pageContent(state)}</g>`).join("\n");
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-site="${site}" data-shell-reference-sha256="${shellHash}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}${extraDefs}</defs><style>${shellStyles}${COMMON_STYLES}</style>${layers}</svg>`;
  fs.writeFileSync(path.join(directory, `${prefix}.svg`), svg);
  fs.writeFileSync(path.join(directory, `${prefix.replace("-master", "-review")}.html`), reviewHtml(site, prefix.replace("-master", ""), states));
}

const YAHUH_STATES = [
  { id: "initial", label: "Initial corruption", mode: "corrupt", phase: "phase-1", progress: 0 },
  { id: "repaired", label: "Headlines repaired", mode: "repaired", phase: "phase-1", progress: 100 },
  { id: "auto-overfix", label: "Auto click override", mode: "auto", phase: "phase-2", progress: 0 },
  { id: "lock-repair", label: "Lock in the repair", mode: "auto", phase: "phase-2", progress: 0, checklist: true },
];

const yahuhArt = (name, x, y, w, h) => `<image href="../../2026-08-15/non-wikiwhy-bookends/yahuh-${name}-v1.png" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`;

function yahuhHeader() {
  return `<g data-site-header="true"><rect x="109" y="56" width="802" height="105" fill="#fff"/><text x="126" y="102" class="site-logo" fill="#6B2FB5">yahuh!</text><rect x="262" y="73" width="424" height="36" rx="3" fill="#fff" stroke="#6B2FB5" stroke-width="2"/><text x="278" y="96" class="site-text" fill="#6F7780">Search news and the web</text><rect x="686" y="73" width="53" height="36" fill="#6B2FB5"/><circle cx="707" cy="89" r="8" fill="none" stroke="#fff" stroke-width="2"/><line x1="713" y1="95" x2="722" y2="104" stroke="#fff" stroke-width="2"/><text x="774" y="95" class="site-small" fill="#6B2FB5">MAIL</text><text x="831" y="95" class="site-small" fill="#6B2FB5">SIGN IN</text><rect x="109" y="119" width="802" height="42" fill="#6B2FB5"/><text x="127" y="145" class="site-small" fill="#fff">HOME</text><text x="184" y="145" class="site-small" fill="#fff">NEWS</text><text x="242" y="145" class="site-small" fill="#fff">WEATHER</text><text x="318" y="145" class="site-small" fill="#fff">SPORTS</text><text x="378" y="145" class="site-small" fill="#fff">FUN</text><text x="864" y="145" class="site-small" text-anchor="end" fill="#fff">10:24 AM</text></g>`;
}

function yahuhLead(mode) {
  const repaired = mode === "repaired";
  const auto = mode === "auto";
  const tone = repaired ? COLORS.repair : COLORS.corruption;
  const title = repaired ? ["NEW MOON", "NEXT WEEK"] : auto ? ["MOON RESIGNS", "FOREVER!!!"] : ["MOON RESIGNS", "FROM NIGHT SHIFT!"];
  return `<g data-lead-story="true"><rect x="119" y="190" width="478" height="430" rx="8" fill="#fff" stroke="${tone}" stroke-width="2"/>${yahuhArt("moon", 131, 204, 205, 205)}<text x="354" y="226" class="site-micro" fill="${tone}">${repaired ? "SKY WATCH · UPDATED 10:18 AM" : auto ? "AUTO BREAKING · 144 EXCLAMATION MARKS" : "BREAKING · 73 EXCLAMATION MARKS"}</text><text x="354" y="264" class="site-title" fill="${repaired ? "#172D40" : tone}">${title[0]}</text><text x="354" y="294" class="site-title" fill="${repaired ? "#172D40" : tone}">${title[1]}</text>${repaired ? `<text x="354" y="331" class="site-text">The moon will appear darkest during</text><text x="354" y="352" class="site-text">its regular monthly cycle.</text><text x="354" y="386" class="site-small" fill="${COLORS.repair}">SOURCE: COMMUNITY OBSERVATORY CALENDAR</text><text x="354" y="410" class="site-small">ILLUSTRATION CAPTION SHOWN</text><line x1="131" y1="438" x2="584" y2="438" stroke="#CDD2D5"/><text x="132" y="468" class="site-heading">LATEST UPDATE</text><text x="132" y="496" class="site-text">10:18 — Calendar and viewing times confirmed.</text><text x="132" y="525" class="site-text">Earlier “resignation” headline was inaccurate.</text><text x="132" y="558" class="site-small" fill="${COLORS.repair}">CORRECTION POSTED · PREVIOUS VERSION AVAILABLE</text>` : auto ? `<rect x="354" y="318" width="221" height="50" fill="${COLORS.corruption}"/><text x="465" y="340" class="site-status" text-anchor="middle" fill="#fff">ARTICLE REMOVED</text><text x="465" y="357" class="site-micro" text-anchor="middle" fill="#fff">HEADLINE ALREADY EXPLAINS EVERYTHING</text><line x1="131" y1="438" x2="584" y2="438" stroke="${tone}"/><text x="132" y="474" class="site-heading" fill="${tone}">LIVE PANIC UPDATES!!!</text><text x="132" y="505" class="site-text" fill="${tone}">10:01 — Moon seen carrying one cardboard box!!!</text><text x="132" y="534" class="site-text" fill="${tone}">10:02 — Night shift reportedly abandoned forever!!!</text><text x="132" y="564" class="site-small" fill="${tone}">CORRECTIONS DISABLED · DRAMA PRESERVED</text>` : `<text x="354" y="331" class="site-text" fill="${tone}">Darkness crisis expected tonight.</text><text x="354" y="356" class="site-text" fill="${tone}">Nobody knows what happens next.</text><rect x="354" y="383" width="221" height="48" fill="url(#yahuhRedHatch)"/><text x="465" y="412" class="site-small" text-anchor="middle" fill="${tone}">ARTICLE DETAILS HIDDEN</text><line x1="131" y1="451" x2="584" y2="451" stroke="#CDD2D5"/><text x="132" y="479" class="site-heading">LIVE UPDATES</text><text x="132" y="508" class="site-text" fill="${tone}">10:01 — Moon seen leaving with a box.</text><text x="132" y="537" class="site-text" fill="${tone}">10:02 — Experts refuse to rule out anything.</text><text x="132" y="566" class="site-small" fill="${tone}">CORRECTION STATUS: NOBODY HAS CHECKED YET</text>`}</g>`;
}

function yahuhSide(mode) {
  const repaired = mode === "repaired";
  const auto = mode === "auto";
  const tone = repaired ? COLORS.repair : COLORS.corruption;
  const soup = repaired ? ["SHIP WITH SOUP", "SAILS ACROSS", "PACIFIC OCEAN", "Canned cargo stays aboard"] : auto ? ["PACIFIC BECOMES", "SOUP!!!", "", "ARTICLE REPLACED BY URGENCY"] : ["OCEAN NOW", "40% SOUP!", "", "Pacific panic spreads"];
  const bird = repaired ? ["PIGEON MASCOT", "WINS SCHOOL", "FUNDRAISER VOTE", "Student costume tops vote"] : auto ? ["PIGEON SEIZES", "CITY HALL!!!", "", "CONTEXT LOWERED EXCITEMENT"] : ["PIGEON WINS", "CITY ELECTION!", "", "Humans stunned"];
  return `<g data-secondary-stories="true"><rect x="611" y="190" width="290" height="204" rx="8" fill="#fff" stroke="${tone}" stroke-width="2"/>${yahuhArt("soup-ship", 624, 203, 112, 90)}<text x="753" y="217" class="site-micro" fill="${tone}">${repaired ? "SHIPPING" : "ALERT"}</text><text x="753" y="243" class="site-heading" fill="${repaired ? "#172D40" : tone}">${soup[0]}</text><text x="753" y="264" class="site-heading" fill="${repaired ? "#172D40" : tone}">${soup[1]}</text><text x="753" y="285" class="site-heading" fill="${repaired ? "#172D40" : tone}">${soup[2]}</text><text x="753" y="307" class="site-small" fill="${auto ? tone : "#3D4B54"}">${soup[3]}</text><text x="624" y="338" class="site-small" fill="${tone}">${repaired ? "CAPTAIN: ‘THE SOUP IS INSIDE THE SHIP.’" : auto ? "QUOTE REMOVED FOR SPEED" : "‘THE WHOLE OCEAN?’ — CHOPPED QUOTE"}</text><text x="624" y="368" class="site-small" fill="${tone}">${repaired ? "UPDATED 9:52 · FULL QUOTE SHOWN" : "UPDATED: ???"}</text><rect x="611" y="410" width="290" height="210" rx="8" fill="#fff" stroke="${tone}" stroke-width="2"/>${yahuhArt("pigeon", 624, 423, 112, 90)}<text x="753" y="437" class="site-micro" fill="${tone}">${repaired ? "SCHOOL NEWS" : auto ? "MAXIMUM DEMOCRACY ALERT" : "DEMOCRACY SHOCK"}</text><text x="753" y="463" class="site-heading" fill="${repaired ? "#172D40" : tone}">${bird[0]}</text><text x="753" y="484" class="site-heading" fill="${repaired ? "#172D40" : tone}">${bird[1]}</text><text x="753" y="505" class="site-heading" fill="${repaired ? "#172D40" : tone}">${bird[2]}</text><text x="753" y="527" class="site-small" fill="${auto ? tone : "#3D4B54"}">${bird[3]}</text><rect x="624" y="548" width="264" height="52" fill="${repaired ? "#FFF3D5" : "url(#yahuhRedHatch)"}"/><text x="636" y="580" class="site-small" fill="${tone}">${repaired ? "PROMOTED: MASCOT T-SHIRTS · CLEARLY LABELED" : auto ? "BREAKING NEWS SPONSORED BY PIGEON SHIRTS" : "PROMOTED STORY · LABEL ALMOST INVISIBLE"}</text></g>`;
}

function yahuhFooter(state) {
  const repaired = state.mode === "repaired";
  const tone = repaired ? COLORS.repair : COLORS.corruption;
  const status = state.mode === "auto" ? "MAXIMIZING CLICKS PER EXCLAMATION MARK" : repaired ? "STORIES MATCH HEADLINES" : "HEADLINES OUTRAN THE STORIES";
  return `<g><rect x="109" y="637" width="802" height="201" fill="#F7F4FA"/><rect x="119" y="650" width="782" height="48" fill="#fff" stroke="${tone}"/><text x="133" y="680" class="site-small" fill="${tone}">${state.mode === "auto" ? "EVERY STORY IS NOW A HEADLINE · ARTICLES REMOVED · PROMOTION DISGUISED" : repaired ? "WEATHER: LIGHT RAIN POSSIBLE · DETAILS, SOURCE, AND UPDATE AVAILABLE" : "MORE BREAKING: WEATHER CLOUD DECLARES THREE DROPS AN EMERGENCY"}</text><text x="126" y="738" class="site-meter" fill="${tone}">HEADLINE REPAIR</text><text x="276" y="738" class="site-meter" fill="${tone}">${state.progress}%</text><rect x="126" y="754" width="752" height="25" fill="url(#yahuhRedHatch)" stroke="${tone}"/><rect x="126" y="754" width="${Math.round(752 * state.progress / 100)}" height="25" fill="${tone}" data-role="site-progress-fill" data-percent="${state.progress}"/><text x="878" y="807" class="site-micro" text-anchor="end" fill="${tone}">${status}</text></g>`;
}

function yahuhPage(state) {
  const lines = state.mode === "repaired" ? ["The headlines now match the stories.", "Support and updates stay visible."] : state.mode === "auto" ? ["Auto made every headline final.", "The actual stories disappeared."] : ["The headlines are loud and certain.", "Read what each story actually says."];
  return `${titlebarPatch("www.yahuh.com", "YAHUH!")}<rect x="109" y="56" width="802" height="782" fill="#F5F1F8"/>${yahuhHeader()}<text x="126" y="181" class="site-small" fill="${state.mode === "repaired" ? COLORS.repair : COLORS.corruption}">${state.mode === "auto" ? "AUTO BREAKING NEWS · ARTICLES ARE NOW OPTIONAL" : state.mode === "repaired" ? "TODAY'S NEWS · UPDATED 10:24 AM" : "BREAKING NEWS · STORIES YOU ABSOLUTELY MUST PANIC-READ"}</text>${yahuhLead(state.mode)}${yahuhSide(state.mode)}${yahuhFooter(state)}${companion(lines)}${state.checklist ? checklist(["READ THE STORY", "SHOW WHAT SUPPORTS IT", "KEEP THE CONTEXT", "SHOW WHAT CHANGED"]) : ""}`;
}

const yahuhDir = path.resolve("docs/design/screens/2026-08-16/yahuh-production");
writeMaster({ site: "Yahuh", directory: yahuhDir, prefix: "yahuh-anchor-master-v1", states: YAHUH_STATES, extraDefs: `<pattern id="yahuhRedHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".25" stroke-width="3"/></pattern>`, pageContent: yahuhPage });

const VIEWTUBE_STATES = [
  { id: "initial", label: "Initial corruption", mode: "corrupt", phase: "phase-1", progress: 0 },
  { id: "repaired", label: "Viewer choice restored", mode: "repaired", phase: "phase-1", progress: 100 },
  { id: "auto-overfix", label: "Auto autoplay override", mode: "auto", phase: "phase-2", progress: 0 },
  { id: "lock-repair", label: "Lock in the repair", mode: "auto", phase: "phase-2", progress: 0, checklist: true },
];

function viewtubeHeader(mode) {
  const repaired = mode === "repaired";
  const auto = mode === "auto";
  return `<g data-site-header="true"><rect x="109" y="56" width="802" height="76" fill="#fff"/><rect x="109" y="56" width="802" height="48" fill="#B8201A"/><rect x="124" y="67" width="34" height="25" rx="6" fill="#fff"/><path d="m137 72 13 8-13 8z" fill="#B8201A"/><text x="168" y="87" class="site-logo" font-size="22" fill="#fff">ViewTube</text><text x="310" y="85" class="site-small" fill="#fff">HOME</text><text x="359" y="85" class="site-small" fill="#fff">EXPLORE</text><text x="418" y="85" class="site-small" fill="#fff">SUBSCRIPTIONS</text><rect x="535" y="66" width="257" height="28" rx="3" fill="#fff" stroke="${repaired ? COLORS.repair : COLORS.corruption}" stroke-width="2"/><text x="548" y="84" class="site-small" fill="${repaired ? "#27373C" : COLORS.corruption}">${repaired ? "stop-motion rocket tutorial" : auto ? "SEARCH REMOVED BY AUTO" : "SEARCH UNAVAILABLE"}</text><circle cx="774" cy="79" r="7" fill="none" stroke="#24313A" stroke-width="2"/><line x1="779" y1="84" x2="787" y2="91" stroke="#24313A" stroke-width="2"/><text x="127" y="122" class="site-small" fill="${repaired ? COLORS.repair : COLORS.corruption}">${auto ? "AUTO FEED · SEARCH INTENT REMOVED" : repaired ? "SEARCHED FOR · FINN'S STOP-MOTION HOBBY" : "FORCED FEED · VIRAL VIDEOS ONLY"}</text></g>`;
}

function videoArt(mode) {
  if (mode === "repaired") return `<rect x="142" y="166" width="448" height="246" fill="#69B7D5"/><circle cx="492" cy="222" r="43" fill="#F6D365"/><path d="M284 344h160l-25-84-55 45-36-28z" fill="#436C54"/><rect x="254" y="251" width="109" height="86" fill="#D9853B"/><polygon points="307,223 342,278 272,278" fill="#E8E0C5"/><circle cx="306" cy="294" r="27" fill="#253B4E"/><circle cx="306" cy="294" r="10" fill="#fff"/><text x="366" y="380" class="site-heading" text-anchor="middle" fill="#fff">BUILD A STOP-MOTION ROCKET</text>`;
  return `<rect x="142" y="166" width="448" height="246" fill="#111820"/><rect x="245" y="214" width="242" height="142" rx="13" fill="#202A31" stroke="#73808A" stroke-width="4"/><rect x="264" y="231" width="204" height="105" fill="#090D10"/><circle cx="366" cy="284" r="42" fill="${COLORS.corruption}"/><path d="m354 258 42 26-42 26z" fill="#fff"/><text x="366" y="382" class="site-heading" text-anchor="middle" fill="#fff">${mode === "auto" ? "MOST ADS: PART 1 OF 83" : "VIRAL VIDEO PART 1"}</text>`;
}

function viewtubePlayer(mode) {
  const repaired = mode === "repaired";
  const auto = mode === "auto";
  const tone = repaired ? COLORS.repair : COLORS.corruption;
  return `<g data-video-player="true"><rect x="119" y="144" width="486" height="464" fill="#fff" stroke="${tone}" stroke-width="2"/>${videoArt(mode)}<rect x="142" y="421" width="448" height="5" fill="#8B9298"/>${auto ? `<rect x="142" y="421" width="410" height="5" fill="${COLORS.corruption}"/><circle cx="197" cy="423" r="7" fill="${COLORS.corruption}"/><circle cx="272" cy="423" r="7" fill="${COLORS.corruption}"/><circle cx="347" cy="423" r="7" fill="${COLORS.corruption}"/><circle cx="422" cy="423" r="7" fill="${COLORS.corruption}"/><circle cx="497" cy="423" r="7" fill="${COLORS.corruption}"/>` : repaired ? `<rect x="142" y="421" width="42" height="5" fill="${COLORS.repair}"/>` : `<rect x="142" y="421" width="218" height="5" fill="${COLORS.corruption}"/><circle cx="197" cy="423" r="7" fill="${COLORS.corruption}"/><circle cx="272" cy="423" r="7" fill="${COLORS.corruption}"/><circle cx="347" cy="423" r="7" fill="${COLORS.corruption}"/>`}<text x="142" y="454" class="site-small">▶  ${repaired ? "0:18 / 7:42" : auto ? "0:03 / 0:30 · AD 1 OF 12" : "0:03 / 0:30 · AD 1 OF 7"}</text><text x="142" y="488" class="site-heading" fill="${repaired ? "#172D40" : tone}">${repaired ? "Build a Stop-Motion Rocket From Cardboard" : auto ? "MOST ADS: PART 1 OF 83" : "VIRAL VIDEO PART 1: THE VIDEO WITH THE MOST ADS"}</text><text x="142" y="514" class="site-small" fill="${tone}">${repaired ? "SELECTED BY FINN · SEARCH RESULT" : auto ? "AUTO-CHOSEN · AD DENSITY: MAXIMUM" : "AUTO-CHOSEN · VIRALITY: MAXIMUM"}</text><line x1="142" y1="531" x2="590" y2="531" stroke="#CDD2D5"/><text x="142" y="554" class="site-small">${repaired ? "Cardboard Lab · clear creator · one optional suggestion" : "Creator hidden · recommendation reason hidden"}</text>${auto ? `<rect x="142" y="568" width="448" height="28" fill="${COLORS.corruption}"/><text x="366" y="587" class="site-status" text-anchor="middle" fill="#fff">OPTIMIZING FOR THE MOST ADS</text>` : `<text x="142" y="582" class="site-small" fill="${tone}">${repaired ? "ADS: 1 · RUNTIME: 7:42 · AUTOPLAY OFF" : "TOTAL ADS: HIDDEN · AUTOPLAY LOCKED ON"}</text>`}</g>`;
}

const queueRows = {
  corrupt: [["PART 2", "VIDEO WITH MORE ADS"], ["PART 3", "NOW WITH MID-ROLL ADS"], ["PART 4", "AD BREAK COMPILATION"], ["PART 5", "THE QUEUE CONTINUES"]],
  repaired: [["SEARCH RESULT", "STOP-MOTION LIGHTING"], ["SUGGESTED", "CARDBOARD PAINTING"], ["QUEUE EMPTY", "NOTHING PLAYS AUTOMATICALLY"]],
  auto: [["PART 2 OF 83", "AN AD INSIDE AN AD"], ["PART 3 OF 83", "THE AD THAT REVIEWS ADS"], ["PART 4 OF 83", "SPONSORED PAUSE SCREEN"], ["PART 5 OF 83", "MOST ADS: EXTENDED CUT"]],
};

function viewtubeQueue(mode) {
  const repaired = mode === "repaired";
  const tone = repaired ? COLORS.repair : COLORS.corruption;
  const rows = queueRows[mode];
  return `<g data-video-queue="true"><rect x="619" y="144" width="282" height="464" fill="#fff" stroke="${tone}" stroke-width="2"/><text x="635" y="171" class="site-heading">UP NEXT</text><text x="786" y="171" class="site-micro" fill="${tone}">AUTOPLAY</text><rect x="850" y="158" width="38" height="18" rx="9" fill="${repaired ? "#CFD4D7" : COLORS.corruption}"/><circle cx="${repaired ? 860 : 878}" cy="167" r="7" fill="#fff"/><text x="635" y="193" class="site-micro" fill="${tone}">${repaired ? "OFF · FINN CHOOSES WHAT PLAYS" : mode === "auto" ? "LOCKED ON · PARTS 1–47 QUEUED" : "ON · NEXT VIDEO FORCED"}</text>${rows.map((row, index) => { const y = 210 + index * 83; return `<g><rect x="633" y="${y}" width="254" height="70" fill="${repaired ? COLORS.repairSoft : COLORS.corruptionSoft}" stroke="${tone}"/><rect x="642" y="${y + 9}" width="74" height="52" fill="${repaired ? "#69B7D5" : "#1A2329"}"/><circle cx="679" cy="${y + 35}" r="16" fill="${tone}"/><path d="m674 ${y + 26} 15 9-15 9z" fill="#fff"/><text x="729" y="${y + 24}" class="site-small" fill="${tone}">${row[0]}</text><text x="729" y="${y + 46}" class="site-small">${row[1]}</text></g>`; }).join("")}<text x="635" y="584" class="site-small" fill="${tone}">${repaired ? "1 CLEARLY MARKED SUGGESTION" : mode === "auto" ? "+ 78 MORE AUTO-CHOSEN VIDEOS" : "+ 42 MORE VIRAL VIDEOS"}</text></g>`;
}

function viewtubeFooter(state) {
  const repaired = state.mode === "repaired";
  const tone = repaired ? COLORS.repair : COLORS.corruption;
  return `<g><rect x="109" y="626" width="802" height="212" fill="#F5F5F2"/><text x="126" y="669" class="site-heading" fill="${tone}">${state.mode === "auto" ? "AUTO STATUS: SEARCH INTENT REMOVED · AUTOPLAYING PARTS 1–47" : repaired ? "VIEWER CONTROLS RESTORED" : "SITE GOALS ARE CHOOSING FOR FINN"}</text><text x="126" y="704" class="site-text">${repaired ? "Search results and suggestions are labeled. Nothing plays without Finn." : state.mode === "auto" ? "Viral videos and ad inventory are now perfectly aligned." : "Search is broken, recommendation reasons are hidden, and the queue will not stop."}</text><text x="126" y="754" class="site-meter" fill="${tone}">VIEWER CONTROL</text><text x="274" y="754" class="site-meter" fill="${tone}">${state.progress}%</text><rect x="126" y="770" width="752" height="25" fill="url(#viewtubeRedHatch)" stroke="${tone}"/><rect x="126" y="770" width="${Math.round(752 * state.progress / 100)}" height="25" fill="${tone}" data-role="site-progress-fill" data-percent="${state.progress}"/><text x="878" y="817" class="site-micro" text-anchor="end" fill="${tone}">${state.mode === "auto" ? "AUTO OVER-FIX ACTIVE" : repaired ? "FINN CHOOSES WHAT PLAYS" : "FORCED QUEUE ACTIVE"}</text></g>`;
}

function viewtubePage(state) {
  const lines = state.mode === "repaired" ? ["Search and suggestions are separate.", "Finn decides what plays next."] : state.mode === "auto" ? ["Auto optimized the queue for ads.", "Finn's search disappeared again."] : ["The queue is choosing for Finn.", "Compare site goals with his goal."];
  return `${titlebarPatch("www.viewtube.com", "VIEWTUBE")}<rect x="109" y="56" width="802" height="782" fill="#ECEDEE"/>${viewtubeHeader(state.mode)}${viewtubePlayer(state.mode)}${viewtubeQueue(state.mode)}${viewtubeFooter(state)}${companion(lines)}${state.checklist ? checklist(["SEARCH WORKS", "SHOW WHY THIS IS NEXT", "ASK BEFORE PLAYING", "SELECTED BY FINN"]) : ""}`;
}

const viewtubeDir = path.resolve("docs/design/screens/2026-08-16/viewtube-production");
writeMaster({ site: "ViewTube", directory: viewtubeDir, prefix: "viewtube-anchor-master-v1", states: VIEWTUBE_STATES, extraDefs: `<pattern id="viewtubeRedHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".25" stroke-width="3"/></pattern>`, pageContent: viewtubePage });

console.log("Wrote Yahuh and ViewTube four-frame anchor masters and click-through reviews.");
