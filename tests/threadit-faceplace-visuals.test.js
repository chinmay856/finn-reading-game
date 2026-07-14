import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ThreadIt uses text-free image-led art behind semantic repair UI", async () => {
  const [css, view] = await Promise.all([
    readFile(new URL("apps/internet-recovery/threadit.css", root), "utf8"),
    readFile(new URL("apps/internet-recovery/threadit-view.js", root), "utf8"),
    access(new URL("apps/internet-recovery/art/site-assets/threadit/threadit-source-tree-base-v1.webp", root)),
  ]);

  assert.match(css, /threadit-source-tree-base-v1\.webp/u);
  assert.match(css, /\.threadit-layout::before/u);
  assert.match(css, /pointer-events:\s*none/u);
  assert.match(view, /display:\s*`\$\{state\.completedUnitIds\.length\} \/ \$\{THREADIT_CAMPAIGN_UNITS\.length\} REPAIRS`/u);
  assert.match(view, /nextUnitCount:\s*THREADIT_CAMPAIGN_UNITS\.length - THREADIT_ACT_ONE_UNITS\.length/u);
  assert.match(view, /amy:\s*getThreadItCopy\(THREADIT_COPY_IDS\.completionAmy\)/u);
  assert.match(view, /chinmay:\s*getThreadItCopy\(THREADIT_COPY_IDS\.completionChinmay\)/u);
});

test("FacePlace uses text-free image-led art while AVOCADO and six repairs stay semantic", async () => {
  const [css, view, copy] = await Promise.all([
    readFile(new URL("apps/internet-recovery/faceplace.css", root), "utf8"),
    readFile(new URL("apps/internet-recovery/faceplace-view.js", root), "utf8"),
    readFile(new URL("apps/internet-recovery/faceplace-copy.js", root), "utf8"),
    access(new URL("apps/internet-recovery/art/site-assets/faceplace/faceplace-feed-base-v1.webp", root)),
  ]);

  assert.match(css, /faceplace-feed-base-v1\.webp/u);
  assert.match(css, /\.faceplace-layout::before/u);
  assert.match(css, /pointer-events:\s*none/u);
  assert.match(css, /opacity:\s*\.94/u);
  assert.match(css, /\.faceplace-profile-rail\s*\{\s*display:\s*none/u);
  assert.match(css, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/u);
  assert.match(css, /\.faceplace-header,[\s\S]*\.faceplace-browser-window \.browser-security[\s\S]*display:\s*none/u);
  assert.match(css, /#faceplaceMidpointAction[\s\S]*background:\s*#ffd65a/u);
  assert.match(css, /HONEST FEED STARTS AT 0%/u);
  assert.doesNotMatch(css, /background-color:\s*#f3f6fad9/u);
  assert.match(copy, /AVOCADO%/u);
  assert.match(view, /totalUnitCount:\s*FACEPLACE_CAMPAIGN_UNITS\.length/u);
  assert.match(view, /amy:\s*copy\(FACEPLACE_COPY_IDS\.completionAmy\)/u);
  assert.match(view, /chinmay:\s*copy\(FACEPLACE_COPY_IDS\.completionChinmay\)/u);
});
