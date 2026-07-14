import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const cssUrl = new URL("../apps/internet-recovery/mapguess.css", import.meta.url);
const htmlUrl = new URL("../index.html", import.meta.url);

test("MapGuess shows the absurd lake route on the map itself", async () => {
  const [css, html] = await Promise.all([readFile(cssUrl, "utf8"), readFile(htmlUrl, "utf8")]);
  assert.match(html, /class="mapguess-lake-route-proof"/u);
  assert.match(html, /class="mapguess-lake-route-line"/u);
  assert.match(html, /class="mapguess-lake-warning"[^>]*>ROUTE ENTERS LAKE</u);
  assert.match(css, /\.mapguess-lake-route-proof/u);
  assert.match(css, /\.mapguess-lake-route-line[\s\S]*stroke:\s*#d32f2a/u);
  assert.match(css, /data-secured="true"[\s\S]*\.mapguess-lake-route-proof/u);
});

test("MapGuess moving-target states retain original and moved destinations with a motion trace", async () => {
  const css = await readFile(cssUrl, "utf8");
  assert.match(css, /data-state-id="mapguess_moving_target"[^}]+mapguess-map-overlay::before/su);
  assert.match(css, /content: "ORIGINAL\\A H4"/u);
  assert.match(css, /content: "TARGET MOVED  H4  ⇢  D7"/u);
  assert.match(css, /data-location="moved"/u);
  assert.match(css, /mapguess-illustrated-frame::before/u);
  assert.match(css, /YOU ASKED FOR\\A H4/u);
  assert.match(css, /content: "▶"/u);
});
