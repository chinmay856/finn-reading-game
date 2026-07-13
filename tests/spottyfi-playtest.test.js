import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { selectNextSpottyFiPassage } from "../apps/internet-recovery/spottyfi-content.js";

test("Spotty-Fi exposes eight unseen candidate playtests without promoting content", () => {
  const first = selectNextSpottyFiPassage(
    { completedPassageIds: [] },
    { lane: "playtest" },
  );
  assert.equal(first.lane, "playtest");
  assert.equal(first.canonicalEligible, false);
  assert.equal(first.reviewPending, true);
  assert.equal(first.selectableCount, 8);
  assert.equal(first.requiredFirstRun, 8);
  assert.equal(first.passage?.id, "the-city-that-learned-to-improvise-a01");
  assert.equal(first.passage?.availability, "candidate");

  const next = selectNextSpottyFiPassage(
    { completedPassageIds: [first.passage.id] },
    { lane: "playtest" },
  );
  assert.equal(next.passage?.id, "how-a-rhythm-changes-a02");
  assert.equal(next.canonicalEligible, false);

  const production = selectNextSpottyFiPassage({ completedPassageIds: [] });
  assert.equal(production.passage, null);
  assert.equal(production.selectableCount, 0);
  assert.equal(production.reason, "no-selectable-passages");
});

test("Spotty-Fi routes candidate results through tab-only wrapper progress", async () => {
  const [app, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.match(html, /id="spottyfiPlaytest"/u);
  assert.match(html, /id="spottyfiContentReason"/u);
  assert.match(app, /selectNextSpottyFiPassage\(state\.spottyfiState, \{ lane: "playtest" \}\)/u);
  assert.match(app, /applySpottyFiReading\(null/u);
  assert.match(app, /state\.spottyfiPersisted = false/u);
  assert.match(app, /Candidate playtest progress is active in this tab only/u);
});
