#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const svgPath = process.argv[2];

if (!svgPath) {
  console.error("Usage: node scripts/validate-design-sequence.mjs <master.svg>");
  process.exit(2);
}

const resolvedPath = path.resolve(svgPath);
const svgDirectory = path.dirname(resolvedPath);
const source = fs.readFileSync(resolvedPath, "utf8");
const errors = [];
const warnings = [];

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]),
  );
}

function tags(pattern) {
  return [...source.matchAll(pattern)].map((match) => ({
    raw: match[0],
    attrs: attributes(match[0]),
  }));
}

const root = source.match(/<svg\b[^>]*>/)?.[0];
if (!root) {
  errors.push("Missing SVG root element.");
} else {
  const attrs = attributes(root);
  if (attrs.width !== "1440" || attrs.height !== "900" || attrs.viewBox !== "0 0 1440 900") {
    errors.push("Master must use the fixed 1440 x 900 canvas and viewBox 0 0 1440 900.");
  }
}

const pages = tags(/<inkscape:page\b[^>]*\/>/g);
const states = tags(/<g\b[^>]*\bid="page-[^"]+"[^>]*>/g);
if (pages.length === 0) errors.push("No named Inkscape pages found.");
if (pages.length !== states.length) {
  errors.push(`Found ${pages.length} Inkscape pages but ${states.length} state groups.`);
}

const pageLabels = pages.map(({ attrs }) => attrs["inkscape:label"]);
const stateLabels = states.map(({ attrs }) => attrs["inkscape:label"]);
if (pageLabels.some((label) => !label) || stateLabels.some((label) => !label)) {
  errors.push("Every page and state group must have an Inkscape label.");
} else if (pageLabels.join("\n") !== stateLabels.join("\n")) {
  errors.push("Inkscape page labels and state-group labels must match in order.");
}

const sharedShellUses = tags(/<use\b[^>]*href="#sharedShell"[^>]*\/>/g).length;
if (sharedShellUses !== states.length) {
  errors.push(`Each state must reuse #sharedShell; found ${sharedShellUses} uses for ${states.length} states.`);
}

const siteFills = tags(/<rect\b[^>]*data-role="site-progress-fill"[^>]*\/>/g);
const passageFills = tags(/<rect\b[^>]*data-role="passage-progress-fill"[^>]*\/>/g);
if (siteFills.length !== states.length) {
  errors.push(`Expected one site-progress fill per state; found ${siteFills.length}.`);
}
if (passageFills.length !== states.length) {
  errors.push(`Expected one passage-progress fill per state; found ${passageFills.length}.`);
}

function percentages(items, attributeName) {
  return items.map(({ attrs }, index) => {
    const value = Number(attrs[attributeName]);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      errors.push(`Invalid ${attributeName} on item ${index + 1}.`);
    }
    return value;
  });
}

const stateSiteProgress = percentages(states, "data-site-progress");
const statePassageProgress = percentages(states, "data-passage-progress");
const fillSiteProgress = percentages(siteFills, "data-percent");
const fillPassageProgress = percentages(passageFills, "data-percent");

if (stateSiteProgress.join(",") !== fillSiteProgress.join(",")) {
  errors.push("State site-progress metadata does not match the rendered site-progress fills.");
}
if (statePassageProgress.join(",") !== fillPassageProgress.join(",")) {
  errors.push("State passage-progress metadata does not match the rendered passage-progress fills.");
}

for (let index = 1; index < states.length; index += 1) {
  const samePhase = states[index - 1].attrs["data-phase"] === states[index].attrs["data-phase"];
  if (samePhase && stateSiteProgress[index] < stateSiteProgress[index - 1]) {
    errors.push(`Site progress moves backward between states ${index} and ${index + 1}.`);
  }
}

const visualDeltaStates = states.filter(({ attrs }) => attrs["data-visual-delta"] !== undefined);
for (let index = 0; index < visualDeltaStates.length; index += 1) {
  const value = Number(visualDeltaStates[index].attrs["data-visual-delta"]);
  if (!Number.isInteger(value) || value < 0 || value > 3) {
    errors.push(`Invalid data-visual-delta on paced state ${index + 1}; expected 0 through 3.`);
  }
  if (index > 0) {
    const previous = visualDeltaStates[index - 1];
    const samePhase = previous.attrs["data-phase"] === visualDeltaStates[index].attrs["data-phase"];
    const previousValue = Number(previous.attrs["data-visual-delta"]);
    if (samePhase && value < previousValue) errors.push("Initial repair visual-delta scale decreases; order small changes before dominant imagery/layout changes.");
  }
}

if (
  states.length > 1 &&
  new Set(stateSiteProgress).size > 1 &&
  stateSiteProgress.join(",") === statePassageProgress.join(",")
) {
  warnings.push("Site and passage progress are identical across states; verify they were not coupled accidentally.");
}

const playerFacingCountPatterns = [
  /PASSAGE\s+\d+\s+(?:OF|\/)\s*\d+/i,
  /REPAIR\s+\d+\s+(?:OF|\/)\s*\d+/i,
];
for (const pattern of playerFacingCountPatterns) {
  if (pattern.test(source)) {
    errors.push(`Player-facing exact count is prohibited: ${pattern}.`);
  }
}

// Act/phase names are useful production metadata, but must never leak into
// visible player copy. Inspect SVG text nodes only so data-phase, ids, and
// Inkscape labels remain available to generators and QA.
const visibleText = [...source.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)]
  .map((match) => match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
  .join("\n");
const internalStoryTerm = /\b(?:ACT|PHASE)\s*[12]\b/i;
if (internalStoryTerm.test(visibleText)) {
  errors.push("Player-facing text contains internal Act/Phase terminology.");
}

const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length > 0) {
  errors.push(`Duplicate SVG ids: ${duplicateIds.join(", ")}.`);
}

const imageReferences = [...source.matchAll(/<image\b[^>]*href="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => !reference.startsWith("#") && !reference.startsWith("data:"));
for (const reference of imageReferences) {
  const assetPath = path.resolve(svgDirectory, reference);
  if (!fs.existsSync(assetPath)) errors.push(`Missing image asset: ${reference}.`);
}

if (warnings.length > 0) {
  for (const warning of warnings) console.warn(`WARN: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(
  `PASS: ${path.basename(resolvedPath)} — ${states.length} states, fixed canvas, shared shell, independent progress metadata, and ${imageReferences.length} image references verified.`,
);
