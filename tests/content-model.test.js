import assert from "node:assert/strict";
import test from "node:test";
import { EVIDENCE_PASSAGE } from "../content/evidence-passage.js";
import {
  PASSAGE_CATALOG,
  describePassageRights,
  isSelectablePassage,
  selectNextPassage,
} from "../content/passage-catalog.js";
import { PHOTOSYNTHESIS_PASSAGE } from "../content/wikiwhy/photosynthesis-passage.js";
import { WHY_DISAGREEMENT_MATTERS_PASSAGE } from "../content/threadit/why-disagreement-matters.js";
import { THREADIT_FIRST_RUN_PASSAGES } from "../content/threadit/first-run-passages.js";
import { A_SECOND_READING_PASSAGE } from "../content/faceplace/a-second-reading.js";
import { FACEPLACE_FIRST_RUN_PASSAGES } from "../content/faceplace/first-run-passages.js";
import { A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE } from "../content/mapguess/a-map-is-not-a-photograph.js";
import { A_CABIN_WITH_A_PURPOSE_PASSAGE } from "../content/mycorner/a-cabin-with-a-purpose.js";
import { THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE } from "../content/yahuh/the-newspaper-that-found-people-on-the-moon.js";
import { ENDGAME_PASSAGES } from "../content/endgame/final-incident-passages.js";
import {
  WIKIWHY_DECK_A_IDS,
  WIKIWHY_DECK_B_IDS,
  selectNextWikiWhyPassage,
} from "../apps/internet-recovery/wikiwhy-content.js";
import {
  THREADIT_DECK_A_IDS,
  THREADIT_DECK_B_IDS,
  selectNextThreadItPassage,
} from "../apps/internet-recovery/threadit-content.js";
import {
  FACEPLACE_CONTENT_READINESS,
  FACEPLACE_DECK_A_IDS,
  FACEPLACE_DECK_B_IDS,
  selectNextFacePlacePassage,
} from "../apps/internet-recovery/faceplace-content.js";

const PASSED_REVIEW = Object.freeze({
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
});

function approvedPassage(base, id, overrides = {}) {
  return Object.freeze({
    ...base,
    ...overrides,
    availability: "approved",
    id,
    review: Object.freeze({ ...base.review, ...PASSED_REVIEW, ...overrides.review }),
    transcriptionReview: Object.freeze({
      ...base.transcriptionReview,
      ...overrides.transcriptionReview,
      tested: overrides.transcriptionReview?.tested ?? true,
    }),
  });
}

test("passage carries a reusable reading profile", () => {
  assert.equal(EVIDENCE_PASSAGE.profile.form, "expository-prose");
  assert.equal(EVIDENCE_PASSAGE.profile.segmentation, "short-paragraphs");
  assert.ok(EVIDENCE_PASSAGE.profile.targetWpm.stretch > EVIDENCE_PASSAGE.profile.targetWpm.comfortable);
  assert.ok(EVIDENCE_PASSAGE.profile.checkpoint.pauseMs < 900);
  assert.ok(EVIDENCE_PASSAGE.profile.endDetection.minimumTailMatches > 0);
  assert.ok(EVIDENCE_PASSAGE.profile.guide.supportedWpm.includes(250));
  assert.ok(EVIDENCE_PASSAGE.profile.guide.supportedWpm.includes(300));
});

test("the selected campaign passage is a reusable attributed content record", () => {
  assert.equal(PHOTOSYNTHESIS_PASSAGE.id, "photosynthesis-a01");
  assert.equal(PHOTOSYNTHESIS_PASSAGE.paragraphs.length, 3);
  assert.equal(PHOTOSYNTHESIS_PASSAGE.comprehension.choices.filter(({ correct }) => correct).length, 1);
  assert.equal(PHOTOSYNTHESIS_PASSAGE.source.basis, "cc-by-sa-4.0-adaptation");
  assert.match(PHOTOSYNTHESIS_PASSAGE.source.sourceUrl, /wikipedia\.org\/wiki\/Photosynthesis/u);
  assert.match(PHOTOSYNTHESIS_PASSAGE.source.attribution, /adapted and modified/iu);
  assert.match(PHOTOSYNTHESIS_PASSAGE.source.reviewedRevisionUrl, /oldid=\d+/u);
  assert.match(PHOTOSYNTHESIS_PASSAGE.source.modificationNotice, /adapted and modified/iu);
  assert.equal(PHOTOSYNTHESIS_PASSAGE.rights.licenseId, "CC-BY-SA-4.0");
  assert.match(PHOTOSYNTHESIS_PASSAGE.rights.licenseUrl, /creativecommons\.org/u);
  assert.equal(PHOTOSYNTHESIS_PASSAGE.availability, "prototype");
  assert.doesNotMatch(JSON.stringify(PHOTOSYNTHESIS_PASSAGE), /WikiWhy|Internet Recovery|repair|reward/iu);
});

test("the neutral catalog selects unseen eligible records and excludes candidates", () => {
  const approved = approvedPassage(PHOTOSYNTHESIS_PASSAGE, "approved-passage");
  const candidate = Object.freeze({
    ...PHOTOSYNTHESIS_PASSAGE,
    availability: "candidate",
    id: "candidate-passage",
  });
  const publicDomain = approvedPassage(
    WHY_DISAGREEMENT_MATTERS_PASSAGE,
    "public-domain-passage",
  );
  assert.equal(isSelectablePassage(candidate), false);
  assert.equal(isSelectablePassage(publicDomain), true);
  assert.equal(describePassageRights(publicDomain).label, "Public-domain source");
  assert.equal(describePassageRights(publicDomain).url, publicDomain.source.sourceUrl);
  assert.equal(isSelectablePassage({
    availability: "approved",
    comprehension: {},
    id: "malformed-approved",
    paragraphs: ["Text"],
    profile: {},
    title: "Malformed",
  }), false);
  assert.equal(selectNextPassage({
    catalog: [candidate, approved],
    completedPassageIds: [],
    preferredIds: [candidate.id, approved.id],
  }).passage.id, approved.id);
  assert.equal(selectNextPassage({
    catalog: [candidate, approved],
    completedPassageIds: [approved.id],
    preferredIds: [candidate.id, approved.id],
  }).passage, null);
});

test("selectable passage timing and pace metadata must be real, sensible numbers", () => {
  const approved = approvedPassage(PHOTOSYNTHESIS_PASSAGE, "approved-numeric-baseline");
  const malformedProfiles = [
    {
      ...approved.profile,
      checkpoint: { ...approved.profile.checkpoint, minimumWindowMs: null },
    },
    {
      ...approved.profile,
      checkpoint: { ...approved.profile.checkpoint, maximumWindowMs: "" },
    },
    {
      ...approved.profile,
      guide: { ...approved.profile.guide, defaultWpm: " " },
    },
    {
      ...approved.profile,
      checkpoint: { ...approved.profile.checkpoint, minimumWindowMs: 17_000 },
    },
  ];
  assert.equal(isSelectablePassage(approved), true);
  for (const [index, profile] of malformedProfiles.entries()) {
    assert.equal(isSelectablePassage({
      ...approved,
      id: `malformed-numeric-${index}`,
      profile,
    }), false);
  }
});

test("approved content cannot bypass pending review, microphone, or rights gates", () => {
  const availabilityOnly = Object.freeze({
    ...WHY_DISAGREEMENT_MATTERS_PASSAGE,
    availability: "approved",
  });
  assert.equal(isSelectablePassage(availabilityOnly), false);
  assert.equal(isSelectablePassage(approvedPassage(
    WHY_DISAGREEMENT_MATTERS_PASSAGE,
    "pending-review-passage",
    { review: { transcription: "candidate-pending-real-microphone-test" } },
  )), false);
  assert.equal(isSelectablePassage(approvedPassage(
    A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE,
    "pending-accessibility-review-passage",
    { review: { accessibility: "candidate-pending-human-review" } },
  )), false);
  assert.equal(isSelectablePassage(approvedPassage(
    WHY_DISAGREEMENT_MATTERS_PASSAGE,
    "untested-microphone-passage",
    { transcriptionReview: { tested: false } },
  )), false);
  assert.equal(isSelectablePassage(approvedPassage(
    WHY_DISAGREEMENT_MATTERS_PASSAGE,
    "unfrozen-public-domain-passage",
    { source: { ...WHY_DISAGREEMENT_MATTERS_PASSAGE.source, frozenRevision: null } },
  )), false);
  assert.equal(isSelectablePassage(approvedPassage(
    A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE,
    "placeholder-revision-passage",
  )), false);
});

test("original approved content does not require a fabricated external source URL", () => {
  const original = approvedPassage(PHOTOSYNTHESIS_PASSAGE, "original-passage", {
    rights: Object.freeze({
      basis: "original",
      creditLine: "Original project-authored passage.",
      verifiedOn: "2026-07-12",
    }),
    source: Object.freeze({
      domain: "humanities",
      sourceType: "original",
    }),
  });
  assert.equal(isSelectablePassage(original), true);
});

test("WikiWhy deck IDs remain wrapper-owned while unavailable drafts stay unselectable", () => {
  const ids = [...WIKIWHY_DECK_A_IDS, ...WIKIWHY_DECK_B_IDS];
  assert.equal(new Set(ids).size, 20);
  assert.equal(PASSAGE_CATALOG.length, 24 + ENDGAME_PASSAGES.length);
  assert.ok(PASSAGE_CATALOG.includes(A_CABIN_WITH_A_PURPOSE_PASSAGE));
  assert.ok(PASSAGE_CATALOG.includes(THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE));
  assert.equal(isSelectablePassage(A_CABIN_WITH_A_PURPOSE_PASSAGE), false);
  assert.equal(isSelectablePassage(THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE), false);
  assert.equal(selectNextWikiWhyPassage({ completedPassageIds: [] }).passage.id, "photosynthesis-a01");
  const exhausted = selectNextWikiWhyPassage({ completedPassageIds: ["photosynthesis-a01"] });
  assert.equal(exhausted.passage, null);
  assert.equal(exhausted.reason, "no-unseen-passages");
  assert.equal(exhausted.selectableCount, 1);
  assert.equal(exhausted.unavailableCount, 19);
});

test("ThreadIt candidate records preserve provenance but fail closed", () => {
  const passage = WHY_DISAGREEMENT_MATTERS_PASSAGE;
  assert.equal(passage.id, "why-disagreement-matters-a01");
  assert.equal(passage.availability, "candidate");
  assert.equal(passage.paragraphs.length, 4);
  assert.equal(passage.comprehension.choices.length, 3);
  assert.equal(passage.comprehension.choices.filter(({ correct }) => correct).length, 1);
  assert.equal(passage.source.author, "John Stuart Mill");
  assert.equal(passage.source.title, "On Liberty");
  assert.equal(passage.source.ebookNumber, "34901");
  assert.equal(passage.source.originalPublicationYear, 1859);
  assert.equal(passage.source.ebookReleaseDate, "2011-01-10");
  assert.equal(passage.source.ebookLastUpdated, "2019-08-12");
  assert.match(passage.source.chapter, /Liberty of Thought and Discussion/u);
  assert.match(passage.source.sourceUrl, /gutenberg\.org\/ebooks\/34901/u);
  assert.match(passage.source.editionStatement, /print edition date is not stated/iu);
  assert.equal(passage.rights.basis, "public-domain");
  assert.match(passage.rights.jurisdiction, /United States/iu);
  assert.match(passage.rights.jurisdiction, /elsewhere requires/iu);
  assert.match(passage.rights.permissionUrl, /gutenberg\.org\/policy\/permission/u);
  assert.equal(passage.transcriptionReview.tested, false);
  assert.match(passage.review.transcription, /pending-real-microphone-test/u);
  assert.equal(isSelectablePassage(passage), false);
  assert.equal(describePassageRights(passage).label, "Public-domain source");
  assert.equal(describePassageRights(passage).url, passage.source.sourceUrl);
  assert.doesNotMatch(JSON.stringify(passage), /ThreadIt|Internet Recovery|repair|reward/iu);
});

test("ThreadIt owns two planned decks and selects no candidate content", () => {
  const ids = [...THREADIT_DECK_A_IDS, ...THREADIT_DECK_B_IDS];
  assert.equal(new Set(ids).size, 10);
  assert.equal(THREADIT_DECK_A_IDS.length, 7);
  assert.equal(THREADIT_DECK_B_IDS.length, 3);
  assert.equal(THREADIT_DECK_A_IDS[0], WHY_DISAGREEMENT_MATTERS_PASSAGE.id);
  assert.deepEqual(
    THREADIT_FIRST_RUN_PASSAGES.map(({ id }) => id),
    THREADIT_DECK_A_IDS.slice(1),
  );
  for (const passage of THREADIT_FIRST_RUN_PASSAGES) {
    assert.equal(passage.availability, "candidate");
    assert.equal(passage.paragraphs.length, 5);
    assert.equal(passage.comprehension.choices.length, 3);
    assert.equal(passage.comprehension.choices.filter(({ correct }) => correct).length, 1);
    assert.equal(passage.rights.basis, "original");
    assert.equal(passage.transcriptionReview.tested, false);
    assert.equal(isSelectablePassage(passage), false);
    assert.ok(PASSAGE_CATALOG.includes(passage));
  }
  const selection = selectNextThreadItPassage({ completedPassageIds: [] });
  assert.equal(selection.passage, null);
  assert.equal(selection.reason, "no-selectable-passages");
  assert.equal(selection.selectableCount, 0);
  assert.equal(selection.unavailableCount, 10);
});

test("FacePlace candidate content is structured, review-gated, and never silently borrows Deck B", () => {
  const passage = A_SECOND_READING_PASSAGE;
  assert.equal(passage.id, "a-second-reading-a01");
  assert.equal(passage.availability, "candidate");
  assert.equal(passage.paragraphs.length, 5);
  assert.equal(passage.comprehension.choices.length, 3);
  assert.equal(passage.comprehension.choices.filter(({ correct }) => correct).length, 1);
  assert.equal(passage.source.author, "Jane Austen");
  assert.equal(passage.source.title, "Pride and Prejudice");
  assert.equal(passage.source.ebookNumber, "1342");
  assert.match(passage.source.sourceUrl, /gutenberg\.org\/ebooks\/1342/u);
  assert.equal(passage.rights.basis, "public-domain");
  assert.equal(passage.transcriptionReview.tested, false);
  assert.equal(isSelectablePassage(passage), false);
  assert.doesNotMatch(JSON.stringify(passage), /FacePlace|Internet Recovery|repair|reward/iu);

  const ids = [...FACEPLACE_DECK_A_IDS, ...FACEPLACE_DECK_B_IDS];
  assert.equal(new Set(ids).size, 10);
  assert.equal(FACEPLACE_DECK_A_IDS[0], passage.id);
  assert.deepEqual(
    FACEPLACE_FIRST_RUN_PASSAGES.map(({ id }) => id),
    FACEPLACE_DECK_A_IDS.slice(1),
  );
  for (const candidate of FACEPLACE_FIRST_RUN_PASSAGES) {
    assert.equal(candidate.availability, "candidate");
    assert.equal(candidate.paragraphs.length, 5);
    assert.equal(candidate.comprehension.choices.length, 3);
    assert.equal(candidate.comprehension.choices.filter(({ correct }) => correct).length, 1);
    assert.equal(candidate.rights.basis, "original");
    assert.equal(candidate.transcriptionReview.tested, false);
    assert.equal(isSelectablePassage(candidate), false);
    assert.ok(PASSAGE_CATALOG.includes(candidate));
  }
  assert.deepEqual(FACEPLACE_CONTENT_READINESS, {
    deckACount: 6,
    deckBCount: 4,
    plannedCount: 10,
    requiredFirstRun: 6,
    firstRunShortfall: 0,
  });
  const selection = selectNextFacePlacePassage({ completedPassageIds: [] });
  assert.equal(selection.passage, null);
  assert.equal(selection.reason, "no-selectable-passages");
  assert.equal(selection.selectableCount, 0);
  assert.equal(selection.plannedCount, 10);
  assert.equal(selection.requiredFirstRun, 6);
  assert.equal(selection.firstRunShortfall, 0);
  assert.equal(selection.unavailableCount, 6);
});

test("theme-neutral content metadata contains no wrapper outcomes", () => {
  const content = JSON.stringify(EVIDENCE_PASSAGE);
  assert.doesNotMatch(content, /WikiWhy|Internet Recovery|bandwidth|repair|reward/iu);
});
