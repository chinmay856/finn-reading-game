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

test("MapGuess cycles sponsored stops before restoring Finn's chosen destination", async () => {
  const [css, html] = await Promise.all([readFile(cssUrl, "utf8"), readFile(htmlUrl, "utf8")]);
  assert.match(css, /content: "FINN PICKED\\A ADVENTURE WONDERLAND"/u);
  assert.match(css, /content: "IGNORED FOR SPONSORS/u);
  assert.match(html, /mapguess-sponsored-pin-trail/u);
  assert.match(html, /SPONSORED<br>#1[\s\S]*SPONSORED<br>#2[\s\S]*SPONSORED<br>#3/u);
  assert.match(html, /mapguess-final-destination[^>]*>[\s\S]*ADVENTURE WONDERLAND/u);
  assert.match(css, /data-secured="true"[\s\S]*\.mapguess-final-destination/u);
});
