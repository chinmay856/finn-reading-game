import test from "node:test";
import assert from "node:assert/strict";

import {
  YAHUH_CONTENT_READINESS,
  YAHUH_DECK_A_IDS,
  YAHUH_DECK_B_IDS,
  selectNextYahuhPassage,
} from "../apps/internet-recovery/yahuh-content.js";
import { THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE } from "../content/yahuh/the-newspaper-that-found-people-on-the-moon.js";
import { YAHUH_FIRST_RUN_PASSAGES } from "../content/yahuh/first-run-passages.js";
import { isSelectablePassage } from "../content/passage-catalog.js";

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

function approvedRecord(id) {
  return Object.freeze({
    ...THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE,
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
      ...THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE.transcriptionReview,
      tested: true,
    }),
  });
}

test("The Newspaper That Found People on the Moon is a structured public-domain candidate that fails closed", () => {
  const passage = THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE;
  assertDeepFrozen(passage);
  assert.equal(passage.availability, "candidate");
  assert.equal(passage.id, YAHUH_DECK_A_IDS[0]);
  assert.equal(passage.paragraphs.length, 4);
  assert.equal(passage.source.ebookNumber, 62779);
  assert.equal(passage.source.frozenRevision, "project-gutenberg-62779-updated-2024-10-18");
  assert.equal(passage.source.originalPublicationYear, 1835);
  assert.match(passage.source.factCheckUrl, /loc\.gov/u);
  assert.equal(passage.rights.basis, "public-domain");
  assert.equal(passage.rights.permissionUrl, "https://www.gutenberg.org/policy/permission.html");
  assert.match(passage.rights.jurisdiction, /United States/u);
  assert.equal(passage.transcriptionReview.tested, false);
  assert.ok(Object.values(passage.review).every((value) => /candidate|pending/u.test(value)));
  assert.equal(isSelectablePassage(passage), false);
});

test("Yahuh owns the frozen six-plus-four plan, selects Deck A only, and reports the six-reading gate", () => {
  assert.equal(YAHUH_DECK_A_IDS.length, 6);
  assert.equal(YAHUH_DECK_B_IDS.length, 4);
  assert.equal(new Set([...YAHUH_DECK_A_IDS, ...YAHUH_DECK_B_IDS]).size, 10);
  assert.deepEqual(YAHUH_CONTENT_READINESS, {
    deckACount: 6,
    deckBCount: 4,
    firstRunShortfall: 0,
    plannedCount: 10,
    requiredFirstRun: 6,
    structuredCandidateCount: 6,
  });

  const gated = selectNextYahuhPassage({ completedPassageIds: [] });
  assert.equal(gated.passage, null);
  assert.equal(gated.reason, "no-selectable-passages");
  assert.equal(gated.selectableCount, 0);
  assert.equal(gated.plannedCount, 10);
  assert.equal(gated.requiredFirstRun, 6);
  assert.equal(gated.firstRunShortfall, 0);
  assert.deepEqual(YAHUH_FIRST_RUN_PASSAGES.map(({ id }) => id), YAHUH_DECK_A_IDS.slice(1));
  for (const candidate of YAHUH_FIRST_RUN_PASSAGES) {
    assert.equal(candidate.availability, "candidate");
    assert.equal(candidate.paragraphs.length, 4);
    assert.equal(candidate.comprehension.choices.length, 3);
    assert.equal(candidate.rights.basis, "original");
    assert.equal(isSelectablePassage(candidate), false);
  }

  const approvedA = approvedRecord(YAHUH_DECK_A_IDS[1]);
  const approvedB = approvedRecord(YAHUH_DECK_B_IDS[0]);
  const first = selectNextYahuhPassage(
    { completedPassageIds: [] },
    { catalog: [approvedB, approvedA] },
  );
  assert.equal(first.passage.id, approvedA.id);

  const exhausted = selectNextYahuhPassage(
    { completedPassageIds: [approvedA.id] },
    { allowRepeat: true, catalog: [approvedB, approvedA] },
  );
  assert.equal(exhausted.passage, null);
  assert.equal(exhausted.reason, "no-unseen-passages");
  assert.equal(exhausted.selectableCount, 1);
});
