import test from "node:test";
import assert from "node:assert/strict";

import {
  VIEWTUBE_CONTENT_READINESS,
  VIEWTUBE_DECK_A_IDS,
  VIEWTUBE_DECK_B_IDS,
  selectNextViewTubePassage,
} from "../apps/internet-recovery/viewtube-content.js";
import { THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE } from "../content/viewtube/the-sky-becomes-a-streak-of-fire.js";
import { isSelectablePassage } from "../content/passage-catalog.js";

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

function approvedRecord(id) {
  return Object.freeze({
    ...THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE,
    availability: "approved",
    id,
    review: Object.freeze({
      accessibility: "passed",
      adaptationFidelity: "passed",
      comprehension: "passed",
      editorial: "passed",
      factual: "passed",
      grade: "passed",
      profile: "passed",
      rights: "passed",
      sensitivity: "passed",
      transcription: "passed",
    }),
    transcriptionReview: Object.freeze({
      ...THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE.transcriptionReview,
      tested: true,
    }),
  });
}

test("The Sky Becomes a Streak of Fire is an exact-revision public-domain candidate that fails closed", () => {
  const passage = THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE;
  assertDeepFrozen(passage);
  assert.equal(passage.availability, "candidate");
  assert.equal(passage.id, VIEWTUBE_DECK_A_IDS[0]);
  assert.equal(passage.paragraphs.length, 4);
  assert.equal(
    (passage.paragraphs.join(" ").match(/[A-Za-z]+(?:[’'-][A-Za-z]+)*/gu) ?? []).length,
    255,
  );
  assert.match(passage.paragraphs[0], /^I am afraid I cannot convey/u);
  assert.match(passage.paragraphs.at(-1), /flickering in the blue\.$/u);
  assert.equal(passage.source.ebookNumber, 35);
  assert.equal(passage.source.releaseDate, "2004-10-02");
  assert.equal(passage.source.editionUpdatedOn, "2026-06-16");
  assert.equal(passage.source.frozenRevision, "project-gutenberg-35-updated-2026-06-16");
  assert.equal(passage.source.originalPublicationYear, 1895);
  assert.equal(passage.rights.basis, "public-domain");
  assert.equal(passage.rights.evidenceUrl, "https://www.gutenberg.org/ebooks/35");
  assert.equal(passage.rights.permissionUrl, "https://www.gutenberg.org/policy/permission.html");
  assert.match(passage.rights.jurisdiction, /United States/u);
  assert.equal(passage.transcriptionReview.tested, false);
  assert.ok(Object.values(passage.review).every((value) => /candidate|pending/u.test(value)));
  assert.equal(isSelectablePassage(passage), false);
  assert.equal(isSelectablePassage({ ...passage, availability: "approved" }), false);
});

test("ViewTube owns the frozen seven-plus-three plan, selects Deck A only, and reports the seven-reading gate", () => {
  assert.equal(VIEWTUBE_DECK_A_IDS.length, 7);
  assert.equal(VIEWTUBE_DECK_B_IDS.length, 3);
  assert.equal(new Set([...VIEWTUBE_DECK_A_IDS, ...VIEWTUBE_DECK_B_IDS]).size, 10);
  assert.deepEqual(VIEWTUBE_CONTENT_READINESS, {
    deckACount: 7,
    deckBCount: 3,
    firstRunShortfall: 0,
    plannedCount: 10,
    requiredFirstRun: 7,
    structuredCandidateCount: 7,
  });

  const gated = selectNextViewTubePassage({ completedPassageIds: [] });
  assert.equal(gated.passage, null);
  assert.equal(gated.reason, "no-selectable-passages");
  assert.equal(gated.selectableCount, 0);
  assert.equal(gated.plannedCount, 10);
  assert.equal(gated.requiredFirstRun, 7);
  assert.equal(gated.firstRunShortfall, 0);

  const approvedA = approvedRecord(VIEWTUBE_DECK_A_IDS[1]);
  const approvedB = approvedRecord(VIEWTUBE_DECK_B_IDS[0]);
  const first = selectNextViewTubePassage(
    { completedPassageIds: [] },
    { catalog: [approvedB, approvedA] },
  );
  assert.equal(first.passage.id, approvedA.id);

  const bOnly = selectNextViewTubePassage(
    { completedPassageIds: [] },
    { catalog: [approvedB] },
  );
  assert.equal(bOnly.passage, null);
  assert.equal(bOnly.reason, "no-selectable-passages");

  const exhausted = selectNextViewTubePassage(
    { completedPassageIds: [approvedA.id] },
    { allowRepeat: true, catalog: [approvedB, approvedA] },
  );
  assert.equal(exhausted.passage, null);
  assert.equal(exhausted.reason, "no-unseen-passages");
  assert.equal(exhausted.selectableCount, 1);
});
