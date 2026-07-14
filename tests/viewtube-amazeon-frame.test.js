import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);

test("ViewTube uses one 4:3 image-led board with seven live repair slots", async () => {
  const [html, css] = await Promise.all([
    readFile(new URL("index.html", ROOT), "utf8"),
    readFile(new URL("apps/internet-recovery/viewtube-frame.css", ROOT), "utf8"),
    access(new URL("apps/internet-recovery/art/site-assets/viewtube-frames/viewtube-01.webp", ROOT)),
  ]);

  assert.match(html, /viewtube-frame\.css/u);
  assert.match(css, /viewtube-01\.webp/u);
  assert.match(css, /grid-template-columns:\s*repeat\(7,/u);
  assert.match(css, /overflow:\s*hidden/u);
  assert.match(css, /\.viewtube-midpoint\[hidden\]/u);
  assert.match(css, /\.viewtube-secured-payoff\[hidden\]/u);
});

test("Amaze-On uses one 4:3 image-led board with seven live consent slots", async () => {
  const [html, css] = await Promise.all([
    readFile(new URL("index.html", ROOT), "utf8"),
    readFile(new URL("apps/internet-recovery/amazeon-frame.css", ROOT), "utf8"),
    access(new URL("apps/internet-recovery/art/site-assets/amazeon-frames/amazeon-01.webp", ROOT)),
  ]);

  assert.match(html, /amazeon-frame\.css/u);
  assert.match(css, /amazeon-01\.webp/u);
  assert.match(css, /grid-template-columns:\s*repeat\(7,/u);
  assert.match(css, /overflow:\s*hidden/u);
  assert.match(css, /\.amazeon-midpoint\[hidden\]/u);
  assert.match(css, /\.amazeon-secured-payoff\[hidden\]/u);
  assert.match(css, /\.amazeon-techno img/u);
});
