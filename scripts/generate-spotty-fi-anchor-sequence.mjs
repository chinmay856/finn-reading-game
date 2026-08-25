#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { buildInternetRecoverySiteIdentityPatch, INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve(
  "docs/design/screens/2026-08-15/spotty-fi-production",
);
const output = path.join(outputDirectory, "spotty-fi-anchor-master-v1.svg");
const shellReferencePath = path.resolve(
  "docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg",
);
const artDirectory = path.resolve(
  "docs/design/screens/2026-08-15/non-wikiwhy-bookends",
);

fs.mkdirSync(outputDirectory, { recursive: true });

const shellReference = fs.readFileSync(shellReferencePath, "utf8");
const extractedReferenceDefs = shellReference.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const referenceStyles = shellReference.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedReferenceDefs || !referenceStyles) {
  throw new Error("Could not extract the reviewed WikiWhy shell definitions and styles.");
}

const shellReferenceSha256 = crypto.createHash("sha256").update(extractedReferenceDefs).digest("hex");
const referenceDefs = extractedReferenceDefs.replaceAll(
  'href="assets/',
  'href="../wikiwhy-inkscape-spike/assets/',
);
const art = {
  paper: path.relative(outputDirectory, path.join(artDirectory, "album-paper-v1.png")),
  satellite: path.relative(outputDirectory, path.join(artDirectory, "album-satellite-v1.png")),
  band: path.relative(outputDirectory, path.join(artDirectory, "album-band-v1.png")),
  artist: path.relative(outputDirectory, path.join(artDirectory, "artist-portrait-v1.png")),
};

const states = [
  { id: "initial", label: "Initial corruption", phase: "phase-1", progress: 0, mode: "phase1", step: 0, visualDelta: 0 },
  { id: "phase1-track", label: "Credit details restored", phase: "phase-1", progress: 20, mode: "phase1", step: 1, visualDelta: 1 },
  { id: "phase1-artist", label: "User choice restored", phase: "phase-1", progress: 40, mode: "phase1", step: 2, visualDelta: 1 },
  { id: "phase1-about", label: "Artists restored", phase: "phase-1", progress: 60, mode: "phase1", step: 3, visualDelta: 2 },
  { id: "phase1-credits", label: "Creator context restored", phase: "phase-1", progress: 80, mode: "phase1", step: 4, visualDelta: 2 },
  { id: "repaired", label: "Fully repaired", phase: "phase-1", progress: 100, mode: "phase1", step: 5, visualDelta: 3 },
  { id: "super-corrupt", label: "Auto super-corruption", phase: "act-2", progress: 0, mode: "act2", lock: 0 },
  { id: "act2-locks", label: "Repair checklist", phase: "act-2-locks", progress: 0, mode: "act2", lock: 0, checklist: 0 },
  { id: "act2-artist", label: "Artist locked", phase: "act-2-locks", progress: 25, mode: "act2", lock: 1, checklist: 1 },
  { id: "act2-credits", label: "Credits locked", phase: "act-2-locks", progress: 50, mode: "act2", lock: 2, checklist: 2 },
  { id: "act2-choice", label: "User choice locked", phase: "act-2-locks", progress: 75, mode: "act2", lock: 3, checklist: 3 },
  { id: "act2-volume", label: "Volume locked", phase: "act-2-locks", progress: 100, mode: "act2", lock: 4, checklist: 4 },
  { id: "secured", label: "Site secured", phase: "completion", progress: 100, mode: "act2", lock: 4 },
];

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;");

function titlebarPatch() {
  return buildInternetRecoverySiteIdentityPatch({ siteUrl: "www.spotty-fi.com", taskLabel: "SPOTTY-FI" });
}

function spottyMark() {
  return `<g transform="translate(124 68)">
    <rect width="42" height="28" rx="7" fill="#A8DD19"/>
    <circle cx="15" cy="14" r="8" fill="#111"/><circle cx="29" cy="14" r="8" fill="#E92D8A"/>
    <circle cx="15" cy="14" r="3" fill="#A8DD19"/><circle cx="29" cy="14" r="3" fill="#111"/>
  </g>`;
}

function abstractArt(x, variant, superMode = false) {
  const rotations = [0, 24, -18];
  const accent = "#A8DD19";
  return `<g transform="translate(${x} 198)">
    <rect width="196" height="126" rx="4" fill="#111"/>
    <rect width="196" height="126" rx="4" fill="url(#spottyCorruptHatch)"/>
    <circle cx="132" cy="61" r="43" fill="#E92D8A" opacity=".92"/>
    <path d="M24 112 78 22l52 90z" fill="${accent}" transform="rotate(${rotations[variant]} 78 72)"/>
    ${superMode ? `<text x="98" y="72" class="auto-stamp" text-anchor="middle">AUTO</text>` : ""}
  </g>`;
}

function trackCard({ x, image, title, artist, detail, index, realArt, superMode, cardFixed, titleFixed, artistFixed, creditsFixed }) {
  const stateColor = cardFixed ? COLORS.repair : COLORS.corruption;
  const artMarkup = realArt
    ? `<image href="${image}" x="${x + 10}" y="198" width="196" height="126" preserveAspectRatio="xMidYMid slice"/>`
    : abstractArt(x + 10, index, superMode);
  return `<g data-qa-box="${x},188,${x + 216},415">
    <rect x="${x}" y="188" width="216" height="227" rx="7" fill="#151B19" stroke="${stateColor}" stroke-width="2"/>
    ${artMarkup}
    <text x="${x + 10}" y="350" class="spot-card-title" style="fill:${titleFixed || superMode ? "#fff" : stateColor}" data-track-title="true" data-content-state="${titleFixed || superMode ? "fixed" : "corrupted"}">${esc(title)}</text>
    <text x="${x + 10}" y="376" class="spot-meta" style="fill:${artistFixed ? "#B9C1BC" : superMode ? "#E92D8A" : stateColor}" data-content-state="${artistFixed || superMode ? "fixed" : "corrupted"}">${esc(artist)}</text>
    <text x="${x + 10}" y="399" class="spot-meta" style="fill:${creditsFixed ? "#B9C1BC" : superMode ? "#C9A8E6" : stateColor}" data-content-state="${creditsFixed || superMode ? "fixed" : "corrupted"}">${esc(detail)}</text>
  </g>`;
}

function creatorStrip(model) {
  if (model.artistFixed) {
    const credits = model.creditsFixed
      ? "Mira — voice  •  Jo — guitar  •  Kai — mix"
      : "CONTRIBUTOR CREDITS STILL MISSING";
    const context = !model.aboutFixed
      ? "ABOUT PROFILE STILL MISSING"
      : model.collaborationFixed && model.choiceFixed
      ? "About • Related work • Paper Planes began with Mira's melody and Jo's guitar loop."
      : model.collaborationFixed
        ? "Paper Planes began with Mira's melody and Jo's guitar loop."
      : model.choiceFixed ? "About  •  Related work" : "About restored • Collaboration note still missing";
    return `<g data-qa-box="251,438,895,552">
      <rect x="251" y="438" width="644" height="114" rx="8" fill="#171B19" stroke="${model.aboutFixed && model.creditsFixed && model.collaborationFixed && model.choiceFixed ? COLORS.repair : COLORS.corruption}" stroke-width="2"/>
      <image href="${art.artist}" x="264" y="450" width="90" height="90" preserveAspectRatio="xMidYMid slice"/>
      <text x="371" y="468" class="spot-creator">Soft Crash</text>
      ${model.aboutFixed ? `<circle cx="489" cy="461" r="9" fill="${COLORS.repair}"/><path d="m484 461 3 3 7-8" fill="none" stroke="#fff" stroke-width="2"/><text x="507" y="466" class="spot-meta" style="fill:${COLORS.repair}">VERIFIED CREATOR</text><text x="371" y="492" class="spot-body">18,420 monthly listeners</text>` : `<text x="371" y="492" class="spot-body" style="fill:${COLORS.corruption}">PROFILE DETAILS STILL MISSING</text>`}
      <text x="371" y="515" class="spot-meta" style="fill:${model.creditsFixed ? "#B9C1BC" : COLORS.corruption}">${credits}</text>
      <text x="371" y="536" class="spot-meta" style="font-size:10px;fill:${model.collaborationFixed || model.choiceFixed ? "#B9C1BC" : COLORS.corruption}">${context}</text>
      <rect x="765" y="493" width="112" height="36" rx="18" fill="none" stroke="${model.choiceFixed ? COLORS.repair : COLORS.corruption}" stroke-width="2"/>
      <text x="821" y="517" class="spot-action" text-anchor="middle" style="fill:${model.choiceFixed ? COLORS.repair : COLORS.corruption}">${model.choiceFixed ? "FOLLOW" : "FOLLOW LOCKED"}</text>
    </g>`;
  }
  if (model.superMode) {
    return `<g data-qa-box="251,438,895,552">
      <rect x="251" y="438" width="644" height="114" rx="8" fill="${COLORS.corruptionDark}" stroke="${COLORS.corruption}" stroke-width="3"/>
      <rect x="264" y="450" width="90" height="90" fill="url(#spottyCorruptHatch)"/>
      <text x="309" y="504" class="auto-stamp" text-anchor="middle">AUTO</text>
      <text x="371" y="471" class="spot-creator">ONE PERFECT CREATOR: AUTO</text>
      <text x="371" y="497" class="spot-meta white-on-error">17,004 NEW SONGS • 0 PEOPLE • 100% DISCOVERY</text>
      <text x="371" y="525" class="spot-body white-on-error">ABOUT, CREDITS, FOLLOW, AND RELATED WORK: REMOVED AS DUPLICATES</text>
    </g>`;
  }
  return `<g data-qa-box="251,438,895,552">
    <rect x="251" y="438" width="644" height="114" rx="8" fill="#171B19" stroke="${COLORS.corruption}" stroke-width="2"/>
    <rect x="264" y="450" width="90" height="90" fill="url(#spottyCorruptHatch)"/>
    <text x="371" y="475" class="spot-creator" style="fill:${COLORS.corruption}">CREATOR PROFILE NOT FOUND</text>
    <text x="371" y="501" class="spot-meta" style="fill:${COLORS.corruption}">ARTIST NAMES REMOVED • CREDITS EMPTY • ABOUT HIDDEN</text>
    <text x="371" y="528" class="spot-body" style="fill:${COLORS.corruption}">Verified by the recommendation machine. Probably.</text>
    <rect x="765" y="493" width="112" height="36" rx="18" fill="none" stroke="${COLORS.corruption}"/>
    <text x="821" y="517" class="spot-action" text-anchor="middle" style="fill:${COLORS.corruption}">FOLLOW WHO?</text>
  </g>`;
}

function volumeControl(maximum) {
  const color = maximum ? COLORS.corruption : "#A8DD19";
  const heights = maximum ? [46, 46, 46, 46, 46] : [14, 22, 30, 38, 46];
  return `<g data-volume-control="${maximum ? "maximum" : "user"}">
    <text x="808" y="600" class="spot-meta" style="fill:${color}">${maximum ? "VOLUME: MAX" : "VOLUME"}</text>
    ${heights.map((height, index) => `<rect x="${810 + index * 14}" y="${655 - height}" width="8" height="${height}" rx="2" fill="${!maximum && index > 2 ? "#303A35" : color}" stroke="${color}"/>`).join("")}
  </g>`;
}

function player(model) {
  const titleColor = model.playerFixed ? "#fff" : COLORS.corruption;
  const artistColor = model.artistFixed ? "#B9C1BC" : COLORS.corruption;
  const title = model.playerFixed ? "Paper Planes" : model.superMode ? "OPTIMAL SONG ∞" : "TRACK_001";
  const artist = model.artistFixed ? "Soft Crash" : model.superMode ? "ARTIST: AUTO" : "ARTIST: GENERATED";
  const artMarkup = model.realArt
    ? `<image href="${art.paper}" x="127" y="583" width="74" height="74" preserveAspectRatio="xMidYMid slice"/>`
    : `<rect x="127" y="583" width="74" height="74" fill="url(#spottyCorruptHatch)"/>`;
  return `<g data-qa-box="109,570,911,682">
    <rect x="109" y="570" width="802" height="112" fill="#111615" stroke="#48524E"/>
    ${artMarkup}
    <text x="216" y="608" class="spot-card-title" style="fill:${model.superMode ? "#fff" : titleColor}" data-content-state="${model.playerFixed || model.superMode ? "fixed" : "corrupted"}">${title}</text>
    <text x="216" y="633" class="spot-meta" style="fill:${model.superMode ? "#E92D8A" : artistColor}" data-content-state="${model.artistFixed || model.superMode ? "fixed" : "corrupted"}">${artist}</text>
    <text x="453" y="616" class="spot-control">◀</text><circle cx="518" cy="609" r="25" fill="#fff"/>
    ${model.playerFixed ? `<rect x="511" y="595" width="5" height="28" fill="#111"/><rect x="521" y="595" width="5" height="28" fill="#111"/>` : `<path d="m511 595 22 14-22 14z" fill="#111"/>`}
    <text x="568" y="616" class="spot-control">▶</text><text x="610" y="616" class="spot-control">↻</text>
    <text x="420" y="654" class="spot-meta">0:25</text><rect x="460" y="647" width="290" height="7" rx="4" fill="#666"/><rect x="460" y="647" width="45" height="7" rx="4" fill="#fff"/><text x="762" y="654" class="spot-meta">${model.playerFixed ? "3:08" : "3:12"}</text>
    ${volumeControl(model.volumeMax)}
  </g>`;
}

function repairChecklist(secured) {
  const rows = ["SHOW THE ARTIST", "SHOW THE CREDITS", "LET USERS CHOOSE", "LET USERS SET THE VOLUME"];
  return `<g data-overlay="act2-checklist" data-qa-box="554,364,866,560" filter="url(#windowShadow)">
    <rect x="560" y="370" width="300" height="184" rx="7" fill="${COLORS.neutralPaper}" stroke="${COLORS.repairDark}" stroke-width="3"/>
    <rect x="560" y="370" width="300" height="38" rx="7" fill="${COLORS.repair}"/>
    <text x="578" y="396" class="spot-check-title">LOCK IN THE REPAIR</text>
    ${rows.map((row, index) => { const fixed = index < secured; return `<rect x="579" y="${417 + index * 31}" width="23" height="23" rx="4" fill="${fixed ? COLORS.repair : COLORS.corruptionSoft}" stroke="${fixed ? COLORS.repairDark : COLORS.corruption}"/><text x="590.5" y="${434 + index * 31}" class="${fixed ? "spot-check-fixed" : "spot-check-open"}" text-anchor="middle">${fixed ? "✓" : "○"}</text><text x="615" y="${434 + index * 31}" class="${fixed ? "spot-check-row-fixed" : "spot-check-row"}">${row}</text>`; }).join("")}
  </g>`;
}

function modelFor(state) {
  const superMode = state.mode === "act2" && state.lock < 1;
  const phaseStep = state.mode === "phase1" ? state.step : 5;
  const lock = state.mode === "act2" ? state.lock : 4;
  return {
    superMode,
    titleFixed: state.mode === "phase1" ? phaseStep >= 5 : lock >= 1,
    artistFixed: state.mode === "phase1" ? phaseStep >= 3 : lock >= 1,
    aboutFixed: state.mode === "phase1" ? phaseStep >= 4 : lock >= 1,
    creditsFixed: state.mode === "phase1" ? phaseStep >= 1 : lock >= 2,
    collaborationFixed: state.mode === "phase1" ? phaseStep >= 4 : lock >= 2,
    choiceFixed: state.mode === "phase1" ? phaseStep >= 2 : lock >= 3,
    volumeMax: state.mode === "act2" && lock < 4,
    realArt: state.mode === "phase1" ? phaseStep >= 5 : lock >= 1,
    playerFixed: state.mode === "phase1" ? phaseStep >= 5 : lock >= 1,
  };
}

function site(state) {
  const model = modelFor(state);
  const fullyFixed = model.choiceFixed && !model.volumeMax;
  const choiceColor = model.choiceFixed ? COLORS.repair : COLORS.corruption;
  const cards = model.realArt
    ? [
        { x: 251, image: art.paper, title: "Paper Planes", artist: model.artistFixed ? "Soft Crash" : "ARTIST: GENERATED", detail: model.creditsFixed ? "Mira • Jo • Kai" : "CREDITS: NONE" },
        { x: 473, image: art.satellite, title: "City of Satellites", artist: model.artistFixed ? "Noir Harbor" : "ARTIST: GENERATED", detail: model.creditsFixed ? "Noir Harbor • Lio" : "CREDITS: NONE" },
        { x: 695, image: art.band, title: "Sunday Circuit", artist: model.artistFixed ? "The Formatics" : "ARTIST: GENERATED", detail: model.creditsFixed ? "The Formatics • Ren" : "CREDITS: NONE" },
      ]
    : model.superMode
      ? [
          { x: 251, title: "OPTIMAL SONG 001", artist: "ARTIST: AUTO", detail: "CREDITS: AUTO" },
          { x: 473, title: "OPTIMAL SONG 001+", artist: "ARTIST: AUTO", detail: "CREDITS: AUTO" },
          { x: 695, title: "OPTIMAL SONG ∞", artist: "ARTIST: AUTO", detail: "CREDITS: AUTO" },
        ]
      : ["Soft Crash", "Noir Harbor", "The Formatics"].map((artistName, index) => ({
          x: 251 + index * 222,
          title: `TRACK_00${index + 1}`,
          artist: model.artistFixed ? artistName : "ARTIST: GENERATED",
          detail: model.creditsFixed ? ["Mira • Jo • Kai", "Noir Harbor • Lio", "The Formatics • Ren"][index] : "CREDITS: NONE",
        }));
  const prompt = model.choiceFixed ? "WHAT DO YOU WANT TO PLAY?" : model.superMode ? "AUTO ALREADY CHOSE EVERYTHING" : "LISTEN TO WHAT WE WANT";
  const subtitle = fullyFixed
    ? "Three artists, three sounds, and paths to keep exploring."
    : model.superMode
      ? "INFINITE DISCOVERY COMPLETE. PEOPLE WERE THE BOTTLENECK."
      : !model.creditsFixed ? "Generated to match everybody. No people required."
        : !model.choiceFixed ? "Credit details are back. Discovery still needs a choice."
          : !model.artistFixed ? "Finn can choose. Artist names are still missing."
            : !model.aboutFixed ? "Artist names are back. Creator profiles are still incomplete."
              : !model.collaborationFixed ? "Creator profiles are back. Collaboration context is still missing."
                : !model.titleFixed ? "Creator context is back. Track titles and artwork are still generated."
                  : "Three artists, three sounds, and paths to keep exploring.";
  const nav = model.choiceFixed ? "Chosen by Finn" : model.superMode ? "Made by Auto" : "Made for Finn";
  return `<g data-site-state="${state.id}">
    <rect x="109" y="56" width="802" height="714" fill="#080B0A"/>
    <rect x="109" y="56" width="802" height="52" fill="#121716" stroke="#323B38"/>
    ${spottyMark()}<text x="176" y="91" class="spot-brand">SPOTTY-FI</text>
    <text x="300" y="89" class="spot-nav">Home</text><text x="355" y="89" class="spot-nav">Search</text><text x="421" y="89" class="spot-nav">Library</text>
    <rect x="522" y="65" width="372" height="35" rx="18" fill="#202422" stroke="${choiceColor}" stroke-width="2" data-choice-indicator="search"/>
    <circle cx="546" cy="82" r="8" fill="none" stroke="${choiceColor}" stroke-width="2"/><path d="m552 88 8 8" stroke="${choiceColor}" stroke-width="2"/>
    <text x="570" y="88" class="spot-meta" style="fill:${choiceColor}">${prompt}</text>
    <rect x="109" y="108" width="128" height="574" fill="#101514" stroke="#39423F"/>
    <text x="127" y="148" class="spot-nav spot-lime">● Home</text><text x="127" y="188" class="spot-nav">○ Search</text><text x="127" y="228" class="spot-nav">▥ Library</text>
    <line x1="125" y1="251" x2="221" y2="251" stroke="#4D5753"/><text x="127" y="280" class="spot-meta">DISCOVERY</text>
    <text x="127" y="316" class="spot-nav" style="fill:${choiceColor};font-size:12px" data-choice-indicator="nav">▣ ${nav}</text><text x="127" y="354" class="spot-nav">♫ New sounds</text><text x="127" y="392" class="spot-nav">☆ Following</text>
    <text x="251" y="144" class="spot-heading">DISCOVER WHAT TO PLAY NEXT</text><text x="251" y="173" class="spot-meta" style="fill:${model.superMode ? COLORS.corruption : "#AEB7B1"}">${subtitle}</text>
    ${cards.map((card, index) => trackCard({ ...card, index, realArt: model.realArt, superMode: model.superMode, cardFixed: model.realArt && model.artistFixed && model.creditsFixed, titleFixed: model.titleFixed, artistFixed: model.artistFixed, creditsFixed: model.creditsFixed })).join("")}
    ${creatorStrip(model)}
    ${player(model)}
  </g>`;
}

function footer(state) {
  const act2 = state.mode === "act2";
  const color = state.progress === 100 ? COLORS.repair : state.progress === 0 ? COLORS.corruption : "#A8DD19";
  const status = state.progress === 100 ? "MUSIC + CHOICE RESTORED" : act2 ? "AUTO OVERRIDE REPAIR IN PROGRESS" : "ARTISTS + CREDITS RETURNING";
  return `<g data-site-footer="true">
    <rect x="109" y="682" width="802" height="156" fill="#131817"/>
    <line x1="109" y1="682" x2="911" y2="682" stroke="#687F94"/>
    <text x="128" y="724" class="spot-label" style="fill:${color}">MUSIC RECOVERY</text>
    <text x="276" y="724" class="spot-small">${state.progress}%</text>
    <rect x="128" y="739" width="520" height="20" rx="2" fill="#282F2C" stroke="${color}"/>
    <rect x="128" y="739" width="${Math.round(520 * state.progress / 100)}" height="20" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/>
    <text x="670" y="754" class="spot-meta" style="fill:${color};font-size:11px">${status}</text>
    ${act2 && state.progress < 100 ? `<text x="128" y="797" class="spot-label" style="fill:${COLORS.corruption}">AUTO OVER-FIX ACTIVE</text>` : ""}
  </g>`;
}

function readingCompanion() {
  return `<g data-companion-state="reading" data-qa-box="958,78,1395,552">
    <text x="964" y="106" class="reading-body">This passage introduces one part of</text>
    <text x="964" y="144" class="reading-body">how people make and share music.</text>
    <rect x="960" y="171" width="404" height="34" fill="#F8DFA0"/>
    <text x="964" y="197" class="reading-body">The discovery page changes only after</text>
    <text x="964" y="235" class="reading-body">Finn finishes the quick check.</text>
    <text x="964" y="288" class="reading-body">Artist and contributor details remain</text>
    <text x="964" y="326" class="reading-body">separate from reading progress.</text>
  </g>`;
}

function statePage(state, index) {
  const dx = index * 1480;
  return `<g id="page-${state.id}" transform="translate(${dx} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${state.phase}" data-site-progress="${state.progress}" data-site-progress-label="MUSIC RECOVERY" data-passage-progress="50"${state.visualDelta === undefined ? "" : ` data-visual-delta="${state.visualDelta}"`}>
    <use href="#sharedShell"/>
    ${titlebarPatch()}
    ${site(state)}
    ${footer(state)}
    ${readingCompanion()}
    <rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/>
    ${state.checklist !== undefined ? repairChecklist(state.checklist) : ""}
  </g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellReferenceSha256}">
<sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview>
<defs>
  ${referenceDefs}
  <pattern id="spottyCorruptHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".42" stroke-width="3"/></pattern>
</defs>
<style>
  ${referenceStyles}
  .task-label,.spot-brand,.spot-heading,.spot-card-title,.spot-creator,.spot-label,.spot-small,.spot-action,.spot-nav,.spot-meta,.spot-body,.spot-control,.auto-stamp,.spot-check-title,.spot-check-row,.spot-check-open,.spot-check-fixed,.spot-check-row-fixed{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}
  .task-label{font-size:14px;font-weight:600;fill:#15191B}.spot-brand{fill:#F1F0E9;font-size:19px;font-weight:700}.spot-heading{fill:#fff;font-size:22px;font-weight:700}.spot-card-title{fill:#fff;font-size:15px;font-weight:700}.spot-creator{fill:#fff;font-size:20px;font-weight:700}.spot-label{font-size:13px;font-weight:700;letter-spacing:.7px}.spot-small{fill:#F1F0E9;font-size:14px;font-weight:700}.spot-action{font-size:13px;font-weight:700}.spot-nav{fill:#DFE4DF;font-size:14px}.spot-lime{fill:#A8DD19}.spot-meta{fill:#AEB7B1;font-size:11.5px}.spot-body{fill:#DFE4DF;font-size:12px}.spot-control{fill:#DFE4DF;font-size:18px}.auto-stamp{fill:#fff;font-size:20px;font-weight:700;letter-spacing:1px}.white-on-error{fill:#fff!important}.spot-check-title{fill:#fff;font-size:15px;font-weight:700}.spot-check-row{fill:${COLORS.corruption};font-size:13px;font-weight:700}.spot-check-open{fill:${COLORS.corruption};font-size:13px;font-weight:700}.spot-check-fixed{fill:#fff;font-size:13px;font-weight:700}.spot-check-row-fixed{fill:${COLORS.repairDark};font-size:13px;font-weight:700}
</style>
${states.map(statePage).join("\n")}
</svg>`;

fs.writeFileSync(output, svg);
console.log(`Wrote ${output} with ${states.length} Spotty-Fi site-sequence pages.`);
