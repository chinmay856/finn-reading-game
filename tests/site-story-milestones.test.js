import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [app, frameCss] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../apps/internet-recovery/playful-frame-system.css", import.meta.url), "utf8"),
]);

const SITES = [
  "threadit",
  "faceplace",
  "mycorner",
  "yahuh",
  "viewtube",
  "searchish",
  "amazeon",
  "spottyfi",
  "mapguess",
];

const flowStart = app.indexOf("const SITE_STORY_FLOWS");
const flowEnd = app.indexOf("function showSiteMessage", flowStart);
const flows = app.slice(flowStart, flowEnd);

test("every post-WikiWhy site has an authored entry, midpoint, and completion", () => {
  assert.notEqual(flowStart, -1);
  assert.notEqual(flowEnd, -1);
  for (const [index, siteId] of SITES.entries()) {
    const start = flows.indexOf(`${siteId}: Object.freeze({`);
    const nextSite = SITES[index + 1];
    const end = nextSite ? flows.indexOf(`${nextSite}: Object.freeze({`, start) : flows.length;
    const siteFlow = flows.slice(start, end);
    assert.notEqual(start, -1, `${siteId} story flow is missing`);
    assert.match(siteFlow, /entry: Object\.freeze\(\[/u, `${siteId} entry is missing`);
    assert.match(siteFlow, /midpoint: Object\.freeze\(\[/u, `${siteId} midpoint is missing`);
    assert.match(siteFlow, /completion: Object\.freeze\(\[/u, `${siteId} completion is missing`);
    assert.match(siteFlow, /siteStoryBeat\("(?:amy|chinmay)"/u, `${siteId} has no authored beat`);
  }
});

test("cutscene actions name the next game action instead of narrating the template", () => {
  assert.doesNotMatch(flows, /Hear Chinmay|has to say|Start (?:the )?second half|Finish this site|Start recovery/iu);
  for (const action of [
    "Open source trace",
    "Start at honest zero",
    "Restore owner controls",
    "Open the switchboard",
    "Open evidence tracks",
    "Open independent sources",
    "Remove Auto-Decide",
    "Return the queue to Finn",
    "Pin Adventure Wonderland",
  ]) assert.match(flows, new RegExp(action, "u"));
});

test("speaker order and sequence length follow each site's plot", () => {
  assert.match(flows, /threadit:[\s\S]*?midpoint:[\s\S]*?siteStoryBeat\("chinmay"[\s\S]*?siteStoryBeat\("amy"/u);
  assert.match(flows, /faceplace:[\s\S]*?midpoint: Object\.freeze\(\[siteStoryBeat\("amy"[\s\S]*?completion/u);
  assert.match(flows, /mycorner:[\s\S]*?entry:[\s\S]*?siteStoryBeat\("chinmay"[\s\S]*?siteStoryBeat\("amy"/u);
  assert.match(flows, /mapguess:[\s\S]*?midpoint: Object\.freeze\(\[siteStoryBeat\("amy"[\s\S]*?Adventure Wonderland/u);
});

test("the final midpoint beat performs the real Act II transition and cannot be skipped", () => {
  assert.match(app, /function continueSiteAfterMidpoint\(siteId\)[\s\S]*?acknowledgeAmazeOnStory[\s\S]*?acknowledgeFacePlaceHonestZero[\s\S]*?acknowledgeMapGuessMovingTarget[\s\S]*?acknowledgeMyCornerTemplateReveal[\s\S]*?acknowledgeSearchishStory[\s\S]*?acknowledgeSpottyFiStory[\s\S]*?openThreadItView\("trace"\)[\s\S]*?acknowledgeViewTubeStory[\s\S]*?acknowledgeYahuhSingleStream/u);
  assert.match(app, /onMidpoint = \(\) => continueSiteAfterMidpoint\(siteId\)/u);
  assert.match(app, /showAuthoredSiteSequence\(steps, onDone, \{ dismissible: false \}\)/u);
  assert.match(app, /state\.dialogDismissible = dismissible/u);
});

test("completion closes onto the repaired site instead of skipping straight to the map", () => {
  assert.doesNotMatch(app, /onCompletion: returnToHub/u);
  assert.match(app, /onCompletion = hideCharacterDialog/u);
  for (const action of [
    "Review the repaired thread",
    "Review the repaired feed",
    "Review the restored profile",
    "Review the repaired portal",
    "Review the repaired recording",
    "Review the source trail",
    "Review the repaired order",
    "Review Finn's restored queue",
    "Review the final route",
  ]) assert.match(flows, new RegExp(action.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"));
});

test("site transitions open milestone dialogue from diagnostic and reading paths", () => {
  assert.match(app, /events\.includes\("site-secured"\)/u);
  assert.match(app, /events\.includes\("midpoint-discovered"\)/u);
  for (const siteId of SITES) {
    assert.match(app, new RegExp(`showSiteMilestonesForEvents\\("${siteId}"`, "u"));
  }
});

test("all site stages share one forced 4 by 3 calibration boundary", () => {
  assert.match(frameCss, /--ir98-site-aspect:\s*4 \/ 3/u);
  assert.match(frameCss, /aspect-ratio:\s*var\(--ir98-site-aspect\)\s*!important/u);
  assert.match(frameCss, /width:\s*auto\s*!important/u);
  assert.match(frameCss, /height:\s*calc\(100% - 12px\)\s*!important/u);
  assert.match(frameCss, /overflow:\s*hidden\s*!important/u);
});
