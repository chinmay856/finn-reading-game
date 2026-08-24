#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { buildInternetRecoverySiteIdentityPatch, INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve("docs/design/screens/2026-08-16/yahuh-production");
const assetDirectory = path.join(outputDirectory, "assets");
const output = path.join(outputDirectory, "yahuh-anchor-master-v2.svg");
const reviewPath = path.join(outputDirectory, "yahuh-anchor-review-v2.html");
const typographyReviewPath = path.join(outputDirectory, "yahuh-typography-review-v1.html");
const shellPath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const autoNewsArt = path.join(assetDirectory, "auto-news-megaphone-v1.jpg");
fs.mkdirSync(assetDirectory, { recursive: true });

if (!fs.existsSync(autoNewsArt)) throw new Error("Missing generated Auto-with-megaphone artwork.");

const shell = fs.readFileSync(shellPath, "utf8");
const extractedDefs = shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const shellStyles = shell.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedDefs || !shellStyles) throw new Error("Could not extract the reviewed shared shell.");
const shellHash = crypto.createHash("sha256").update(extractedDefs).digest("hex");
const referenceDefs = extractedDefs.replaceAll('href="assets/', 'href="../../2026-08-15/wikiwhy-inkscape-spike/assets/');

const states = [
  { id: "initial", label: "Headline covers the reporting", run: "first", step: 0, progress: 0, delta: 0 },
  { id: "story", label: "Story emerges", run: "first", step: 1, progress: 17, delta: 1 },
  { id: "sources", label: "Sources return", run: "first", step: 2, progress: 33, delta: 1 },
  { id: "captions", label: "Image captions return", run: "first", step: 3, progress: 50, delta: 1 },
  { id: "authors", label: "Authors return", run: "first", step: 4, progress: 67, delta: 1 },
  { id: "pictures", label: "Pictures match the stories", run: "first", step: 5, progress: 83, delta: 2 },
  { id: "repaired", label: "Headlines match the stories", run: "first", step: 6, progress: 100, delta: 3 },
  { id: "auto-overfix", label: "Auto headline takeover", run: "lock", step: 0, progress: 0, delta: 0, auto: true },
  { id: "checklist", label: "Lock-in checklist", run: "lock", step: 0, progress: 0, delta: 0, auto: true, checklist: 0 },
  { id: "lock-pictures", label: "Pictures restored", run: "lock", step: 1, progress: 33, delta: 1, auto: true, checklist: 1 },
  { id: "lock-reporting", label: "Reporting restored", run: "lock", step: 2, progress: 67, delta: 2, auto: true, checklist: 2 },
  { id: "lock-headlines", label: "Headlines fixed", run: "lock", step: 3, progress: 100, delta: 3, auto: true, checklist: 3 },
  { id: "secured", label: "Repair secured", run: "secured", step: 6, progress: 100, delta: 3 },
];

const first = (state) => state.run === "first";
const autoRun = (state) => state.auto === true;
const storyVisible = (state) => first(state) ? state.step >= 1 : !autoRun(state) || state.step >= 2;
const sourceVisible = (state) => first(state) ? state.step >= 2 : !autoRun(state) || state.step >= 2;
const captionVisible = (state) => first(state) ? state.step >= 3 : !autoRun(state) || state.step >= 2;
const authorVisible = (state) => first(state) ? state.step >= 4 : !autoRun(state) || state.step >= 2;
const picturesFixed = (state) => first(state) ? state.step >= 5 : !autoRun(state) || state.step >= 1;
const headlinesFixed = (state) => first(state) ? state.step >= 6 : !autoRun(state) || state.step >= 3;
const reportingVisible = (state) => storyVisible(state) && sourceVisible(state) && captionVisible(state) && authorVisible(state);
const fullyFixed = (state) => picturesFixed(state) && reportingVisible(state) && headlinesFixed(state);
const takeover = (state) => autoRun(state) && state.step === 0;

const legacyArtRoot = "../../2026-08-15/non-wikiwhy-bookends";
const productionArtRoot = "assets";
const legacyRasterArt = (name, x, y, width, height) => `<image href="${legacyArtRoot}/yahuh-${name}-v1.png" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;
const productionRasterArt = (name, x, y, width, height) => `<image href="${productionArtRoot}/yahuh-${name}-v2.jpg" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;

const storyData = {
  moon: {
    bad: ["MOON", "RESIGNS", "FROM NIGHT", "SHIFT!"], auto: ["MOON", "RESIGNS", "FOREVER!!!!!"], good: ["NEW MOON", "NEXT WEEK"],
    body: ["The next new-moon phase arrives", "on Tuesday during its usual cycle.", "The moon has not resigned;", "it returns after the dark phase."], source: "COMMUNITY OBSERVATORY · MONTHLY CALENDAR", caption: "Expected new-moon phase on the calendar.", author: "MARA ORTIZ · SKY DESK", reactionBad: "Night may never recover.", reactionGood: "A regular moon phase is expected next week.",
  },
  soup: {
    bad: ["PACIFIC", "OCEAN", "TURNS TO", "SOUP!"], auto: ["ENTIRE PLANET", "NOW SOUP!!!!!"], good: ["SHIP CARRYING SOUP", "SAILS ACROSS PACIFIC"],
    compactGood: ["SHIP CARRYING SOUP", "SAILS ACROSS", "PACIFIC"],
    body: ["A cargo ship carrying canned soup", "is sailing across the Pacific Ocean."], source: "CAPTAIN: ‘THE SOUP IS INSIDE THE SHIP.’", caption: "Soup cargo ship at sea.", author: "DEV PATEL · SHIPPING REPORTER",
  },
  pigeon: {
    bad: ["PIGEON", "WINS CITY", "ELECTION!"], auto: ["PIGEON ELECTED", "MAYOR FOR LIFE!"], good: ["PIGEON MASCOT WINS", "SCHOOL FUNDRAISER VOTE"],
    compactGood: ["PIGEON MASCOT WINS", "SCHOOL FUNDRAISER", "VOTE"],
    body: ["Students chose a homemade pigeon costume", "as next year's school mascot."], source: "SCHOOL COUNCIL · 312 STUDENT BALLOTS", caption: "Winning school mascot.", author: "JUNE PARK · SCHOOL NEWS",
  },
};

function titlebarPatch() {
  return buildInternetRecoverySiteIdentityPatch({ siteUrl: "www.yahuh.com", taskLabel: "YAHUH!" });
}

function portalHeader() {
  return `<g data-module="portal-header" data-purpose="persistent-parody-cue" data-qa-box="109,56,911,165"><rect x="109" y="56" width="802" height="62" fill="#fff"/><text x="126" y="96" class="yah-logo">yahuh!</text><rect x="280" y="68" width="402" height="36" rx="18" fill="#fff" stroke="#6D36A8" stroke-width="2"/><text x="300" y="91" class="yah-text yah-muted">Search news and the web</text><circle cx="655" cy="86" r="8" fill="none" stroke="#6D36A8" stroke-width="2"/><path d="m661 92 8 8" stroke="#6D36A8" stroke-width="2"/><circle cx="736" cy="85" r="16" fill="#F3ECFA"/><path d="M730 89h12v-9h-12zm2-11 4-5 4 5" fill="none" stroke="#6D36A8" stroke-width="2"/><text x="760" y="91" class="yah-small" fill="#6D36A8">MAIL</text><text x="847" y="91" class="yah-small" fill="#6D36A8">SIGN IN</text><rect x="109" y="118" width="802" height="47" fill="#5B258F"/><text x="127" y="147" class="yah-small" fill="#fff">HOME</text><text x="188" y="147" class="yah-small" fill="#fff">NEWS</text><text x="247" y="147" class="yah-small" fill="#fff">WEATHER</text><text x="328" y="147" class="yah-small" fill="#fff">SPORTS</text><text x="394" y="147" class="yah-small" fill="#fff">FINANCE</text><rect x="695" y="128" width="192" height="27" rx="13" fill="#7847A6"/><circle cx="713" cy="141" r="7" fill="#F6C85F"/><path d="m710 138 3 3 5-6" fill="none" stroke="#5B258F" stroke-width="2"/><text x="730" y="145" class="yah-micro" fill="#fff">62°F · LIGHT RAIN · SAN FRANCISCO</text></g>`;
}

function storyArt(kind, fixed, x, y, width, height) {
  if (kind === "moon") return fixed ? productionRasterArt("moon-repaired", x, y, width, height) : legacyRasterArt("moon", x, y, width, height);
  if (kind === "soup") return fixed ? legacyRasterArt("soup-ship", x, y, width, height) : productionRasterArt("soup-corrupted", x, y, width, height);
  return fixed ? productionRasterArt("pigeon-repaired", x, y, width, height) : legacyRasterArt("pigeon", x, y, width, height);
}

function revealedPanel({ x, y, width, height, visible, key, children }) {
  if (!visible) return "";
  return `<g data-content-key="${key}" data-content-state="fixed" data-role="reporting-panel"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="5" fill="${COLORS.repairSoft}" stroke="${COLORS.repair}"/>${children}</g>`;
}

function fittedFontSize(text, maxWidth, preferred = 11, minimum = 7.5) {
  const estimatedGlyphWidth = 0.56;
  return Math.max(minimum, Math.min(preferred, maxWidth / Math.max(1, text.length * estimatedGlyphWidth)));
}

function contiguousPartitions(words, lineCount) {
  if (lineCount === 1) return [[words.join(" ")]];
  if (words.length < lineCount) return [];
  const results = [];
  for (let split = 1; split <= words.length - lineCount + 1; split += 1) {
    const head = words.slice(0, split).join(" ");
    for (const tail of contiguousPartitions(words.slice(split), lineCount - 1)) results.push([head, ...tail]);
  }
  return results;
}

function estimatedWidth(text, fontSize, glyphFactor = 0.57) {
  return text.length * fontSize * glyphFactor;
}

function fitLineToSlot(text, slot, { maxFontSize = 64, paddingX = 10, paddingY = 8, glyphFactor = 0.57, heightFactor = 0.72 } = {}) {
  const widthFit = (slot.width - paddingX * 2) / Math.max(1, text.length * glyphFactor);
  const heightFit = (slot.height - paddingY * 2) * heightFactor;
  return Math.max(1, Math.min(maxFontSize, widthFit, heightFit));
}

function scoreHeadlinePartition(lines, slots, options = {}) {
  const individualSizes = lines.map((line, index) => fitLineToSlot(line, slots[index], options));
  const commonSize = Math.min(...individualSizes);
  const sizes = individualSizes.map(() => commonSize);
  const utilization = lines.reduce((sum, line, index) => {
    const available = Math.max(1, slots[index].width - (options.paddingX ?? 10) * 2);
    return sum + Math.min(1, estimatedWidth(line, sizes[index], options.glyphFactor ?? 0.57) / available);
  }, 0) / lines.length;
  return { lines, slots, sizes, score: commonSize * 8 + utilization * 10 };
}

function bestHeadlineLayout(words, slotCandidates, options = {}, forcedLines = null) {
  const candidates = [];
  for (const slots of slotCandidates) {
    const partitions = forcedLines
      ? forcedLines.length === slots.length ? [forcedLines] : []
      : contiguousPartitions(words, slots.length);
    for (const lines of partitions) candidates.push(scoreHeadlinePartition(lines, slots, options));
  }
  if (!candidates.length) throw new Error(`Could not fit headline words: ${words.join(" ")}`);
  return candidates.sort((left, right) => right.score - left.score)[0];
}

function equalVerticalSlots(x, y, width, height, counts) {
  return counts.map((count) => Array.from({ length: count }, (_, index) => ({
    x,
    y: y + height * index / count,
    width,
    height: height / count,
  })));
}

function renderHeadlineLayout(layout, fixed, contentKey) {
  return layout.lines.map((line, index) => {
    const slot = layout.slots[index];
    const fontSize = layout.sizes[index];
    const baseline = slot.y + slot.height / 2 + fontSize * 0.34;
    return `<text x="${slot.x + slot.width / 2}" y="${baseline.toFixed(2)}" class="yah-dynamic-title" font-size="${fontSize.toFixed(2)}" text-anchor="middle" fill="${fixed ? "#172D40" : COLORS.corruption}" data-role="headline-line" data-content-key="${contentKey}" data-slot-x="${slot.x}" data-slot-y="${slot.y}" data-slot-width="${slot.width}" data-slot-height="${slot.height}">${line}</text>`;
  }).join(" ");
}

function inlineFact({ x, y, width, height, label, value, preferred = 10, minimum = 7.5, padding = 12 }) {
  const combined = `${label} ${value}`;
  const lineSize = fittedFontSize(combined, width - padding * 2, preferred, minimum);
  const baseline = y + height / 2 + lineSize * 0.5;
  return `<g data-role="fact-block"><text x="${x + padding}" y="${baseline}" class="yah-small" style="font-size:${lineSize.toFixed(2)}px" text-anchor="start"><tspan class="yah-label" style="font-size:${lineSize.toFixed(2)}px" fill="${COLORS.repair}" data-role="fact-label">${label}</tspan><tspan fill="#172D40" data-role="fact-value">&#160;${value}</tspan></text></g>`;
}

function fitParagraph(text, { width, height, minimumLines = 2, maximumLines = 5, maxFontSize = 22, padding = 12, paddingX = padding, paddingY = padding, labelSize = 10, labelGap = 5, lineHeightFactor = 1.5 }) {
  const words = text.trim().split(/\s+/);
  const availableWidth = width - paddingX * 2;
  const availableHeight = height - paddingY * 2 - labelSize - labelGap;
  const candidates = [];
  for (let lineCount = minimumLines; lineCount <= Math.min(maximumLines, words.length); lineCount += 1) {
    for (const lines of contiguousPartitions(words, lineCount)) {
      const widthFit = Math.min(...lines.map((line) => availableWidth / Math.max(1, line.length * 0.54)));
      const heightFit = availableHeight / Math.max(1, lineCount * lineHeightFactor);
      const fontSize = Math.min(maxFontSize, widthFit, heightFit);
      const widths = lines.map((line) => estimatedWidth(line, fontSize, 0.54));
      const meanWidth = widths.reduce((sum, value) => sum + value, 0) / widths.length;
      const raggedness = Math.sqrt(widths.reduce((sum, value) => sum + Math.pow(value - meanWidth, 2), 0) / widths.length) / Math.max(1, availableWidth);
      const lastLinePenalty = widths.at(-1) < availableWidth * 0.28 ? 1.5 : 0;
      candidates.push({ lines, fontSize, lineHeight: fontSize * lineHeightFactor, score: fontSize * 8 - raggedness * 5 - lastLinePenalty });
    }
  }
  if (!candidates.length) throw new Error(`Could not fit paragraph: ${text}`);
  return candidates.sort((left, right) => right.score - left.score)[0];
}

function labeledTextBlock({ x, y, width, height, label, text, labelSize = 10, maxFontSize = 22, minimumLines = 2, maximumLines = 5, padding = 12, paddingX = padding, paddingY = padding, labelGap = 5, lineHeightFactor = 1.5 }) {
  const fit = fitParagraph(text, { width, height, minimumLines, maximumLines, maxFontSize, padding, paddingX, paddingY, labelSize, labelGap, lineHeightFactor });
  const blockHeight = labelSize + labelGap + fit.lines.length * fit.lineHeight;
  const top = y + Math.max(paddingY, (height - blockHeight) / 2);
  const labelBaseline = top + labelSize;
  const firstBodyBaseline = labelBaseline + labelGap + fit.fontSize;
  return `<g data-role="fact-block" data-kind="story" data-body-font-size="${fit.fontSize.toFixed(2)}" data-body-lines="${fit.lines.length}"><text x="${x + paddingX}" y="${labelBaseline.toFixed(2)}" class="yah-label" style="font-size:${labelSize}px" text-anchor="start" fill="${COLORS.repair}" data-role="fact-label">${label}</text>${fit.lines.map((line, index) => `<text x="${x + paddingX}" y="${(firstBodyBaseline + index * fit.lineHeight).toFixed(2)}" class="yah-text" style="font-size:${fit.fontSize.toFixed(2)}px" text-anchor="start" fill="#172D40" data-role="fact-value">${line}</text>`).join("")}</g>`;
}

function authorPanel(kind, x, y, compact = false) {
  const initials = kind === "moon" ? "MO" : kind === "soup" ? "DP" : "JP";
  return `<circle cx="${x + 13}" cy="${y + 15}" r="10" fill="#6D36A8"/><text x="${x + 13}" y="${y + 18}" class="yah-micro" text-anchor="middle" fill="#fff">${initials}</text><text x="${x + 30}" y="${y + 18}" class="${compact ? "yah-micro" : "yah-small"}" fill="${COLORS.repair}">${storyData[kind].author}</text>`;
}

function visualStep(state) {
  if (headlinesFixed(state)) return 6;
  if (first(state)) return state.step;
  if (autoRun(state) && state.step >= 2) return 4;
  if (autoRun(state) && state.step === 1) return 1;
  return 0;
}

function headlineWords(kind, state, compact = false) {
  const source = headlinesFixed(state)
    ? compact && storyData[kind].compactGood ? storyData[kind].compactGood : storyData[kind].good
    : autoRun(state) ? storyData[kind].auto : storyData[kind].bad;
  return source.join(" ").split(/\s+/);
}

function representativeHeadlineLines(kind, state) {
  if (kind === "moon" && (state.id === "lock-pictures" || state.id === "lock-reporting")) {
    return ["MOON", "RESIGNS", "FOREVER!!!!!"];
  }
  if (state.id === "initial") {
    if (kind === "moon") return ["MOON", "RESIGNS", "FROM", "NIGHT SHIFT!"];
    if (kind === "soup") return ["PACIFIC", "OCEAN", "TURNS", "TO SOUP!"];
    return ["PIGEON", "WINS", "CITY", "ELECTION!"];
  }
  if (state.id === "story") {
    if (kind === "moon") return ["MOON", "RESIGNS", "FROM", "NIGHT SHIFT!"];
    if (kind === "soup") return ["PACIFIC", "OCEAN", "TURNS TO SOUP!"];
    return ["PIGEON", "WINS CITY", "ELECTION!"];
  }
  if (["authors", "pictures"].includes(state.id)) {
    if (kind === "soup") return ["PACIFIC", "OCEAN", "TURNS TO SOUP!"];
    if (kind === "pigeon") return ["PIGEON", "WINS CITY", "ELECTION!"];
  }
  if (state.id === "lock-reporting") {
    if (kind === "soup") return ["ENTIRE", "PLANET", "NOW SOUP!!!!!"];
    if (kind === "pigeon") return ["PIGEON ELECTED", "MAYOR", "FOR LIFE!"];
  }
  return null;
}

function leadHeadline(state) {
  const fixed = headlinesFixed(state);
  const step = visualStep(state);
  const fillVacatedReporting = state.id === "lock-pictures";
  const words = headlineWords("moon", state);
  const heights = [443, 325, 260, 205, 145, 105, 105];
  const geometryStep = fillVacatedReporting ? 0 : step;
  const height = state.id === "lock-reporting" ? 165 : heights[step];
  let shape;
  let slotCandidates;
  if (geometryStep <= 2) {
    const bottom = [638, 520, 455][geometryStep];
    shape = `<path d="M322 195H588V${bottom}H132V365H322Z" fill="url(#yahRedHatch)" stroke="${COLORS.corruption}" stroke-width="3"/>`;
    if (state.id === "lock-pictures") {
      slotCandidates = [[
        { x: 322, y: 195, width: 266, height: 110 },
        { x: 132, y: 340, width: 456, height: 110 },
        { x: 132, y: 485, width: 456, height: 110 },
      ]];
    } else {
      const upper = equalVerticalSlots(322, 195, 266, 170, [2])[0];
      const lowerCount = geometryStep < 2 && words.length >= 4 ? 2 : 1;
      const lower = equalVerticalSlots(132, 365, 456, bottom - 365, [lowerCount])[0];
      slotCandidates = [[...upper, ...lower]];
    }
  } else {
    const x = state.id === "lock-reporting" ? 292 : step >= 5 ? 354 : 322;
    const width = state.id === "lock-reporting" ? 296 : step >= 5 ? 234 : 266;
    shape = `<rect x="${x}" y="195" width="${width}" height="${height}" rx="8" fill="${fixed ? "#F0F8F1" : "url(#yahRedHatch)"}" stroke="${fixed ? COLORS.repair : COLORS.corruption}" stroke-width="3"/>`;
    slotCandidates = equalVerticalSlots(x, 195, width, height, step >= 5 ? [2, 3] : [2, 3, 4]);
  }
  const layout = bestHeadlineLayout(words, slotCandidates, { maxFontSize: 66, paddingX: 12, paddingY: state.id === "lock-reporting" ? 5 : 7, glyphFactor: 0.62 }, representativeHeadlineLines("moon", state));
  return `<g data-content-key="moon-headline" data-content-state="${fixed ? "fixed" : "corrupted"}" data-headline-height="${height}">${shape}${renderHeadlineLayout(layout, fixed, "moon-headline")}</g>`;
}

function compactHeadline(kind, state, y) {
  const fixed = headlinesFixed(state);
  const step = visualStep(state);
  const words = headlineWords(kind, state, true);
  const heights = [202, 139, 103, 82, 82, 82, 82];
  const height = heights[step];
  const split = step >= 2;
  const expandedCompactHeadline = step >= 4;
  const x = split ? 751 : 625;
  const width = split ? 138 : 264;
  const shape = split
    ? `<rect x="${x}" y="${y + 13}" width="${width}" height="${height}" rx="7" fill="${fixed ? "#F0F8F1" : "#fff"}" stroke="${fixed ? COLORS.repair : COLORS.corruption}" stroke-width="2"/>${fixed ? "" : `<rect x="${x}" y="${y + 13}" width="${width}" height="${height}" rx="7" fill="url(#yahRedHatch)"/>`}`
    : `<path d="M737 ${y + 13}H889V${y + 13 + height}H625V${y + 99}H737Z" fill="#fff" stroke="${COLORS.corruption}" stroke-width="2"/><path d="M737 ${y + 13}H889V${y + 13 + height}H625V${y + 99}H737Z" fill="url(#yahRedHatch)"/>`;
  const slotCandidates = split
    ? equalVerticalSlots(x, y + 13, width, height, step >= 5 ? [2, 3] : [2, 3, 4])
    : [[
      ...equalVerticalSlots(737, y + 13, 152, 86, [2])[0],
      ...equalVerticalSlots(625, y + 99, 264, height - 86, [step === 0 ? 2 : 1])[0],
    ]];
  const layout = bestHeadlineLayout(words, slotCandidates, {
    maxFontSize: 32,
    paddingX: expandedCompactHeadline ? 4 : 8,
    paddingY: expandedCompactHeadline ? 2 : 5,
    glyphFactor: 0.62,
    heightFactor: expandedCompactHeadline ? 0.55 : 0.72,
  }, representativeHeadlineLines(kind, state));
  return `<g data-content-key="${kind}-headline" data-content-state="${fixed ? "fixed" : "corrupted"}" data-headline-height="${height}">${shape}${renderHeadlineLayout(layout, fixed, `${kind}-headline`)}</g>`;
}

function autoCharacterWithMegaphone() {
  return `<g data-auto-character="news-desk"><rect x="132" y="366" width="449" height="262" rx="10" fill="#FFF8F1" stroke="${COLORS.corruption}" stroke-width="2"/><image href="assets/auto-news-megaphone-v1.jpg" x="151" y="371" width="411" height="230" preserveAspectRatio="xMidYMid meet"/><text x="356" y="617" class="yah-label" text-anchor="middle" fill="${COLORS.corruption}">AUTO NEWS DESK · BLUETOOTH ENABLED</text></g>`;
}

function autoTakeoverLead(state) {
  const data = storyData.moon;
  const art = autoCharacterWithMegaphone();
  return `<g data-module="lead-story" data-purpose="repair-target" data-story="moon" data-qa-box="119,180,600,650"><rect x="119" y="180" width="481" height="470" rx="9" fill="#fff" stroke="${COLORS.corruption}" stroke-width="3"/><rect x="132" y="195" width="449" height="158" rx="8" fill="url(#yahRedHatch)" stroke="${COLORS.corruption}" stroke-width="3"/><text x="356" y="228" class="yah-label" text-anchor="middle" fill="${COLORS.corruption}">AUTO BREAKING · 100% OF THE NEWS</text><text x="356" y="278" class="yah-auto-title" text-anchor="middle" fill="${COLORS.corruption}" data-content-key="moon-headline" data-content-state="corrupted">${data.auto[0]}</text><text x="356" y="324" class="yah-auto-title" text-anchor="middle" fill="${COLORS.corruption}" data-content-key="moon-headline" data-content-state="corrupted">${data.auto[1]}</text>${art}</g>`;
}

function leadStory(state) {
  if (takeover(state)) return autoTakeoverLead(state);
  const data = storyData.moon;
  const fixed = fullyFixed(state);
  const pictureFixed = picturesFixed(state);
  const step = visualStep(state);
  const layout = [
    {},
    { story: [132, 530, 456, 108] },
    { story: [132, 465, 456, 100], source: [132, 575, 456, 53] },
    { story: [132, 410, 456, 100], caption: [132, 520, 456, 43], source: [132, 573, 456, 43] },
    { story: [132, 370, 456, 105], caption: [132, 483, 456, 45], source: [132, 536, 456, 45], author: [132, 589, 456, 45] },
    { story: [354, 310, 234, 140], caption: [132, 460, 456, 50], source: [132, 520, 456, 50], author: [132, 580, 456, 50] },
    { story: [354, 310, 234, 140], caption: [132, 460, 456, 50], source: [132, 520, 456, 50], author: [132, 580, 456, 50] },
  ][step];
  const pictureBox = state.id === "lock-reporting" ? [132, 195, 160, 165] : step >= 5 ? [132, 195, 210, 255] : [132, 195, 190, 165];
  const panel = (slot, visible, key, children) => {
    const box = layout[slot];
    if (!box) return "";
    return revealedPanel({ x: box[0], y: box[1], width: box[2], height: box[3], visible, key, children: children(box) });
  };
  const storyPanel = panel("story", storyVisible(state), "moon-story", ([x, y, width, height]) => {
    const wide = width >= 400;
    return labeledTextBlock({
      x, y, width, height,
      label: "STORY:",
      text: data.body.join(" "),
      labelSize: wide ? 11 : 9.5,
      maxFontSize: wide ? 19 : 15,
      minimumLines: wide ? 2 : 3,
      maximumLines: wide ? 4 : 5,
      paddingX: wide ? 13 : 11,
      paddingY: wide ? 8 : 7,
      labelGap: wide ? 7 : 5,
      lineHeightFactor: 1.5,
    });
  });
  const sourcePanel = panel("source", sourceVisible(state), "moon-source", ([x, y, width, height]) => inlineFact({ x, y, width, height, label: "SOURCE:", value: data.source, preferred: 10, minimum: 9 }));
  const captionPanel = panel("caption", captionVisible(state), "moon-caption", ([x, y, width, height]) => inlineFact({ x, y, width, height, label: "CAPTION:", value: data.caption, preferred: 11, minimum: 9.5 }));
  const author = panel("author", authorVisible(state), "moon-author", ([x, y, width, height]) => `<circle cx="${x + 18}" cy="${y + height / 2}" r="10" fill="#6D36A8"/><text x="${x + 18}" y="${y + height / 2 + 3}" class="yah-micro" text-anchor="middle" fill="#fff">MO</text>${inlineFact({ x: x + 24, y, width: width - 24, height, label: "BY:", value: data.author, preferred: 9.5, minimum: 8.8 })}`);
  return `<g data-module="lead-story" data-purpose="repair-target" data-story="moon" data-qa-box="119,180,600,650"><rect x="119" y="180" width="481" height="470" rx="9" fill="#fff" stroke="${fixed ? COLORS.repair : COLORS.corruption}" stroke-width="2"/>${storyArt("moon", pictureFixed, ...pictureBox)}${leadHeadline(state)}${storyPanel}${sourcePanel}${captionPanel}${author}</g>`;
}

function autoTakeoverCompact(kind, state, y) {
  const data = storyData[kind];
  return `<g data-module="secondary-story" data-purpose="repair-target" data-story="${kind}" data-qa-box="613,${y},901,${y + 228}"><rect x="613" y="${y}" width="288" height="228" rx="9" fill="#fff" stroke="${COLORS.corruption}" stroke-width="3"/><rect x="625" y="${y + 13}" width="264" height="202" rx="8" fill="url(#yahRedHatch)" stroke="${COLORS.corruption}" stroke-width="2"/><text x="757" y="${y + 43}" class="yah-micro" text-anchor="middle" fill="${COLORS.corruption}">AUTO HEADLINE · ARTICLE REMOVED</text><text x="757" y="${y + 96}" class="yah-compact-auto" text-anchor="middle" fill="${COLORS.corruption}" data-content-key="${kind}-headline" data-content-state="corrupted">${data.auto[0]}</text><text x="757" y="${y + 132}" class="yah-compact-auto" text-anchor="middle" fill="${COLORS.corruption}" data-content-key="${kind}-headline" data-content-state="corrupted">${data.auto[1]}</text><rect x="650" y="${y + 158}" width="214" height="38" rx="19" fill="${COLORS.corruption}"/><text x="757" y="${y + 182}" class="yah-small" text-anchor="middle" fill="#fff">100% NEWS · 0% EXTRA READING</text></g>`;
}

function compactStory(kind, state, y) {
  if (takeover(state)) return autoTakeoverCompact(kind, state, y);
  const data = storyData[kind];
  const fixed = fullyFixed(state);
  const pictureFixed = picturesFixed(state);
  const step = visualStep(state);
  const layouts = [
    {},
    { story: [625, y + 155, 264, 60] },
    { story: [625, y + 122, 264, 52], source: [625, y + 181, 264, 34] },
    { story: [625, y + 101, 264, 54], caption: [625, y + 161, 264, 23], source: [625, y + 190, 264, 25] },
    { story: [625, y + 97, 264, 50], caption: [625, y + 149, 264, 20], source: [625, y + 171, 264, 20], author: [625, y + 193, 264, 22] },
    { story: [625, y + 97, 264, 50], caption: [625, y + 149, 264, 20], source: [625, y + 171, 264, 20], author: [625, y + 193, 264, 22] },
    { story: [625, y + 97, 264, 50], caption: [625, y + 149, 264, 20], source: [625, y + 171, 264, 20], author: [625, y + 193, 264, 22] },
  ][step];
  const pictureBox = [625, y + 13, 112, 82];
  const panel = (slot, visible, key, children) => {
    const box = layouts[slot];
    if (!box) return "";
    return revealedPanel({ x: box[0], y: box[1], width: box[2], height: box[3], visible, key, children: children(box) });
  };
  const compactStoryPanel = panel("story", storyVisible(state), `${kind}-story`, ([x, panelY, width, height]) => {
    return labeledTextBlock({
      x, y: panelY, width, height,
      label: "STORY:",
      text: data.body.join(" "),
      labelSize: 7.5,
      maxFontSize: 11.5,
      minimumLines: 2,
      maximumLines: 3,
      paddingX: 10,
      paddingY: 3.5,
      labelGap: 4.5,
      lineHeightFactor: 1.5,
    });
  });
  const compactCaption = panel("caption", captionVisible(state), `${kind}-caption`, ([x, panelY, width, height]) => inlineFact({ x, y: panelY, width, height, label: "CAPTION:", value: data.caption, preferred: 8.4, minimum: 7.6, padding: 10 }));
  const compactSource = panel("source", sourceVisible(state), `${kind}-source`, ([x, panelY, width, height]) => inlineFact({ x, y: panelY, width, height, label: "SOURCE:", value: data.source, preferred: 7.9, minimum: 7.1, padding: 10 }));
  const compactAuthor = panel("author", authorVisible(state), `${kind}-author`, ([x, panelY, width, height]) => inlineFact({ x, y: panelY, width, height, label: "BY:", value: data.author, preferred: 7.8, minimum: 7.1, padding: 10 }));
  return `<g data-module="secondary-story" data-purpose="repair-target" data-story="${kind}" data-qa-box="613,${y},901,${y + 228}"><rect x="613" y="${y}" width="288" height="228" rx="9" fill="#fff" stroke="${fixed ? COLORS.repair : COLORS.corruption}" stroke-width="2"/>${storyArt(kind, pictureFixed, ...pictureBox)}${compactHeadline(kind, state, y)}${compactStoryPanel}${compactCaption}${compactSource}${compactAuthor}</g>`;
}

function footer(state) {
  const fixed = fullyFixed(state);
  const tone = fixed ? COLORS.repair : COLORS.corruption;
  const fill = Math.round(752 * state.progress / 100);
  const label = state.run === "first" ? "NEWS RECOVERY" : "NEWS LOCKS";
  const status = fixed ? "PICTURES, REPORTING, AND HEADLINES MATCH" : autoRun(state) ? "AUTO HEADLINE-ONLY MODE ACTIVE" : "HEADLINES STILL OUTRUN THE STORIES";
  return `<g data-module="site-progress" data-purpose="progress-only"><rect x="109" y="670" width="802" height="168" fill="#F7F4FA"/><rect x="119" y="681" width="782" height="39" rx="5" fill="#fff" stroke="${tone}"/><text x="133" y="706" class="yah-small" fill="${tone}">${fixed ? "LATEST: NEW MOON NEXT WEEK · SOUP SHIP SAILS ACROSS PACIFIC · SCHOOL MASCOT VOTE COMPLETE" : autoRun(state) ? "AUTO NEWS ALERT: HEADLINES NOW CONTAIN 100% OF THE NEWS!!!" : "TRENDING: MOON PANIC · SOUP OCEAN · PIGEON GOVERNMENT"}</text><text x="126" y="756" class="yah-meter" fill="${tone}">${label}</text><text x="288" y="756" class="yah-meter" fill="${tone}">${state.progress}%</text><rect x="126" y="771" width="752" height="25" fill="url(#yahRedHatch)" stroke="${tone}"/><rect x="126" y="771" width="${fill}" height="25" fill="${tone}" data-role="site-progress-fill" data-percent="${state.progress}"/><text x="878" y="822" class="yah-micro" text-anchor="end" fill="${tone}">${status}</text></g>`;
}

const lockItems = ["BRING BACK THE PICTURES", "RESTORE THE STORIES", "FIX THE HEADLINES"];
function checklist(state) {
  if (state.checklist === undefined) return "";
  return `<g data-lock-overlay="true"><rect x="528" y="358" width="300" height="225" rx="10" fill="#FAF8F1" stroke="${COLORS.repair}" stroke-width="3"/><rect x="528" y="358" width="300" height="48" rx="10" fill="${COLORS.repair}"/><rect x="528" y="393" width="300" height="13" fill="${COLORS.repair}"/><text x="548" y="390" class="lock-title">LOCK IN THE REPAIR</text>${lockItems.map((item, index) => { const done = index < state.checklist; const y = 429 + index * 48; return `<rect x="552" y="${y - 21}" width="28" height="28" rx="5" fill="${done ? COLORS.repair : COLORS.corruptionSoft}" stroke="${done ? COLORS.repair : COLORS.corruption}"/><text x="566" y="${y - 1}" class="lock-mark" text-anchor="middle" fill="${done ? "#fff" : COLORS.corruption}">${done ? "✓" : "○"}</text><text x="590" y="${y}" class="lock-label" fill="${done ? COLORS.repairDark : COLORS.corruption}">${item}</text>`; }).join("")}</g>`;
}

function companion(state) {
  const messages = {
    initial: ["The giant headlines cover the reporting.", "Open the stories underneath."], story: ["The stories are visible.", "Their supporting sources are still missing."], sources: ["The sources are back.", "The pictures still have no captions."], captions: ["The image captions are visible.", "The authors are still missing."], authors: ["The authors are back.", "The pictures still exaggerate what happened."], pictures: ["The pictures now match the stories.", "The headlines still change their meaning."], repaired: ["Every headline now matches its story.", "The absurd news is still fun—and accurate."], "auto-overfix": ["Chinmay said: put the news in the headline.", "Auto removed everything else."], checklist: ["A headline cannot replace the reporting.", "Lock the pictures, stories, and headlines back in."], "lock-pictures": ["The pictures are back.", "The reporting is still missing."], "lock-reporting": ["The reporting is back.", "The headlines still overstate it."], "lock-headlines": ["The headlines match again.", "The news portal is repaired."], secured: ["The repair is secured.", "Finn can teach Auto why headlines must match."],
  }[state.id];
  return `<g data-companion-state="reading" data-qa-box="958,78,1395,552"><text x="964" y="112" class="reading-body">${messages[0]}</text><text x="964" y="150" class="reading-body">${messages[1]}</text><rect x="960" y="183" width="404" height="34" fill="#F8DFA0"/><text x="964" y="209" class="reading-body">Read, then answer the quick check.</text></g>`;
}

function page(state, index) {
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-run="${state.run}" data-phase="${state.run}" data-site-progress="${state.progress}" data-passage-progress="50" data-visual-delta="${state.delta}"><use href="#sharedShell"/>${titlebarPatch()}<rect x="109" y="56" width="802" height="782" fill="#F3EFF7"/>${portalHeader()}${leadStory(state)}${compactStory("soup", state, 180)}${compactStory("pigeon", state, 422)}${footer(state)}${companion(state)}${checklist(state)}<rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/></g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");
const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellHash}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="yahRedHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".22" stroke-width="3"/></pattern></defs><style>${shellStyles}.task-label,.yah-logo,.yah-dynamic-title,.yah-auto-title,.yah-compact-auto,.yah-heading,.yah-label,.yah-text,.yah-small,.yah-micro,.yah-meter,.lock-title,.lock-label,.lock-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.task-label{font-size:14px;font-weight:600;fill:#15191B}.yah-logo{font-size:33px;font-weight:700;fill:#6D36A8}.yah-dynamic-title{font-weight:700}.yah-auto-title{font-size:31px;font-weight:700}.yah-compact-auto{font-size:18px;font-weight:700}.yah-heading{font-size:13px;font-weight:700}.yah-label{font-size:10px;font-weight:700}.yah-text{font-size:11px}.yah-small{font-size:9px}.yah-micro{font-size:8px}.yah-meter{font-size:13px;font-weight:700}.yah-muted{fill:#78828A}.lock-title{font-size:19px;font-weight:700;fill:#fff}.lock-label{font-size:12px;font-weight:700}.lock-mark{font-size:15px;font-weight:700}</style>${states.map(page).join("\n")}</svg>`;
fs.writeFileSync(output, svg);

for (let pageNumber = 1; pageNumber <= states.length; pageNumber += 1) {
  execFileSync("/Applications/Inkscape.app/Contents/MacOS/inkscape", [path.basename(output), `--export-page=${pageNumber}`, "--export-area-page", "--export-type=png", "--export-width=1440", `--export-filename=yahuh-anchor-v2_p${pageNumber}.png`], { cwd: outputDirectory, stdio: "ignore" });
}

const slides = states.map((state, index) => {
  const filename = `yahuh-anchor-v2_p${index + 1}.png`;
  const digest = crypto.createHash("sha256").update(fs.readFileSync(path.join(outputDirectory, filename))).digest("hex").slice(0, 12);
  return { title: state.label, src: `${filename}?v=${digest}` };
});
function reviewHtml(reviewSlides, titleText) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${titleText}</title><style>html,body{margin:0;background:#21172b;color:#fff;font-family:system-ui,sans-serif}main{max-width:1440px;margin:0 auto;padding:18px}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}h1{font-size:20px;margin:0}.stage{position:relative;background:#321b49;border:2px solid #ad91c4}.stage img{display:block;width:100%;height:auto}.nav{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.nav button{pointer-events:auto;margin:12px;width:58px;height:92px;border:1px solid #fff;background:#27163dcc;color:#fff;font-size:38px}.strip{display:flex;gap:10px;overflow:auto;padding-top:12px}.thumb{min-width:215px;border:3px solid transparent;background:#4b315e;color:#fff;padding:0}.thumb.active{border-color:#f5bd47}.thumb img{display:block;width:100%}.thumb span{display:block;padding:7px;font-weight:700}</style></head><body><main><div class="head"><h1 id="title"></h1><span id="count"></span></div><div class="stage"><img id="main" alt=""><div class="nav"><button id="prev">‹</button><button id="next">›</button></div></div><div class="strip" id="strip"></div></main><script>const slides=${JSON.stringify(reviewSlides)};let index=0;const main=document.querySelector('#main'),title=document.querySelector('#title'),count=document.querySelector('#count'),strip=document.querySelector('#strip');function show(next){index=(next+slides.length)%slides.length;main.src=slides[index].src;main.alt=slides[index].title;title.textContent=slides[index].title;count.textContent=(index+1)+' / '+slides.length;[...strip.children].forEach((el,i)=>el.classList.toggle('active',i===index));strip.children[index]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}slides.forEach((slide,i)=>{const b=document.createElement('button');b.className='thumb';b.innerHTML='<img src="'+slide.src+'" alt=""><span>'+slide.title+'</span>';b.onclick=()=>show(i);strip.append(b)});document.querySelector('#prev').onclick=()=>show(index-1);document.querySelector('#next').onclick=()=>show(index+1);addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});show(0);</script></body></html>`;
}
fs.writeFileSync(reviewPath, reviewHtml(slides, "Yahuh production review v2"));
const typographySlides = [0, 1, 5, 6].map((index) => slides[index]);
fs.writeFileSync(typographyReviewPath, reviewHtml(typographySlides, "Yahuh four-frame typography review"));
console.log(`Wrote ${states.length} Yahuh v2 review frames and click-through reviewer.`);
