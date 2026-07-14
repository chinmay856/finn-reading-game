import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ThreadIt makes the illustrated source board primary instead of faint wallpaper", async () => {
  const css = await readFile(new URL("apps/internet-recovery/threadit.css", root), "utf8");

  assert.match(css, /Playtest correction: the source-tree illustration is the ThreadIt stage/u);
  assert.match(css, /\.threadit-layout::before[\s\S]*?opacity:\s*1/u);
  assert.match(css, /background-size:\s*contain/u);
  assert.match(css, /\.threadit-layout,[\s\S]*?display:\s*block/u);
  assert.match(css, /\.threadit-thread-column[\s\S]*?background:\s*#fffaf0ed/u);
  assert.match(css, /\.threadit-header\s*\{\s*display:\s*none/u);
  assert.match(css, /#threadit #threaditPostList,[\s\S]*?display:\s*none/u);
  assert.match(css, /content:\s*"MOST VOTES WINS REALITY"/u);
  assert.match(css, /content:\s*"RECOVERY LIVE"/u);
  assert.match(css, /\.threadit-source-panel\s*\{[\s\S]*?background:\s*transparent/u);
  assert.match(css, /data-source-open="false"[\s\S]*?visibility:\s*hidden/u);
  assert.match(css, /\.threadit-source-node[\s\S]*?background:\s*#fff9eaf0/u);
});
