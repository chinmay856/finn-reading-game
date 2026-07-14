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

test("every post-WikiWhy site has midpoint and completion dialogue for Amy and Chinmay", () => {
  for (const siteId of SITES) {
    const start = app.indexOf(`${siteId}: Object.freeze({ midpoint:`);
    assert.notEqual(start, -1, `${siteId} milestone copy is missing`);
    const slice = app.slice(start, start + 900);
    assert.match(slice, /midpoint: \{ amy:/u, `${siteId} midpoint Amy copy is missing`);
    assert.match(slice, /chinmay:/u, `${siteId} midpoint Chinmay copy is missing`);
    assert.match(slice, /completion: \{ amy:/u, `${siteId} completion Amy copy is missing`);
    assert.match(slice, /is finished\./u, `${siteId} completion does not clearly end the site`);
  }
});

test("site transitions open milestone dialogue from diagnostic and reading paths", () => {
  assert.match(app, /events\.includes\("site-secured"\)/u);
  assert.match(app, /events\.includes\("midpoint-discovered"\)/u);
  for (const siteId of SITES) {
    assert.match(app, new RegExp(`showSiteMilestonesForEvents\\(\"${siteId}\"`, "u"));
  }
});

test("all site stages share one forced 4 by 3 calibration boundary", () => {
  assert.match(frameCss, /--ir98-site-aspect:\s*4 \/ 3/u);
  assert.match(frameCss, /aspect-ratio:\s*var\(--ir98-site-aspect\)\s*!important/u);
  assert.match(frameCss, /width:\s*auto\s*!important/u);
  assert.match(frameCss, /height:\s*calc\(100% - 12px\)\s*!important/u);
  assert.match(frameCss, /overflow:\s*hidden\s*!important/u);
});
