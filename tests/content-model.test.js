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
import {
  WIKIWHY_DECK_A_IDS,
  WIKIWHY_DECK_B_IDS,
  selectNextWikiWhyPassage,
} from "../apps/internet-recovery/wikiwhy-content.js";

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
  const approved = Object.freeze({
    ...PHOTOSYNTHESIS_PASSAGE,
    availability: "approved",
    id: "approved-passage",
  });
  const candidate = Object.freeze({
    ...PHOTOSYNTHESIS_PASSAGE,
    availability: "candidate",
    id: "candidate-passage",
  });
  const publicDomain = Object.freeze({
    ...PHOTOSYNTHESIS_PASSAGE,
    availability: "approved",
    id: "public-domain-passage",
    rights: Object.freeze({
      basis: "public-domain",
      creditLine: "Public-domain source; adaptation reviewed for this edition.",
      verifiedOn: "2026-07-12",
    }),
  });
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
  const approved = {
    ...PHOTOSYNTHESIS_PASSAGE,
    availability: "approved",
    id: "approved-numeric-baseline",
  };
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

test("WikiWhy deck IDs remain wrapper-owned while unavailable drafts stay unselectable", () => {
  const ids = [...WIKIWHY_DECK_A_IDS, ...WIKIWHY_DECK_B_IDS];
  assert.equal(new Set(ids).size, 20);
  assert.equal(PASSAGE_CATALOG.length, 1);
  assert.equal(selectNextWikiWhyPassage({ completedPassageIds: [] }).passage.id, "photosynthesis-a01");
  const exhausted = selectNextWikiWhyPassage({ completedPassageIds: ["photosynthesis-a01"] });
  assert.equal(exhausted.passage, null);
  assert.equal(exhausted.reason, "no-unseen-passages");
  assert.equal(exhausted.selectableCount, 1);
  assert.equal(exhausted.unavailableCount, 19);
});

test("theme-neutral content metadata contains no wrapper outcomes", () => {
  const content = JSON.stringify(EVIDENCE_PASSAGE);
  assert.doesNotMatch(content, /WikiWhy|Internet Recovery|bandwidth|repair|reward/iu);
});
