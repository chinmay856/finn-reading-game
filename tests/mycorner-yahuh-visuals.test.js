import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("MyCorner uses one fixed illustrated frame with semantic overlays", async () => {
  const css = await readFile(new URL("apps/internet-recovery/mycorner.css", root), "utf8");
  await access(new URL("apps/internet-recovery/art/site-assets/mycorner-frames/mycorner-01.webp", root));
  assert.match(css, /mycorner-frames\/mycorner-01\.webp/u);
  assert.match(css, /\.mycorner-module[\s\S]+background: #fffdf3e8/u);
  assert.match(css, /\.mycorner-midpoint,[\s\S]+\.mycorner-secured-payoff[\s\S]+position: absolute/u);
  assert.doesNotMatch(css, /speech|microphone|transcript/iu);
});

test("Yahuh keeps exactly six visible module positions on one fixed frame", async () => {
  const css = await readFile(new URL("apps/internet-recovery/yahuh.css", root), "utf8");
  await access(new URL("apps/internet-recovery/art/site-assets/yahuh-frames/yahuh-01.webp", root));
  assert.match(css, /yahuh-frames\/yahuh-01\.webp/u);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/u);
  assert.match(css, /grid-template-rows: repeat\(2, minmax\(0, 1fr\)\)/u);
  assert.match(css, /\.yahuh-midpoint,[\s\S]+\.yahuh-secured-payoff[\s\S]+position: absolute/u);
  assert.doesNotMatch(css, /speech|microphone|transcript/iu);
});
