import test from "node:test";
import assert from "node:assert/strict";

import {
  MYCORNER_ASSET_IDS,
  MYCORNER_ASSETS,
  MYCORNER_COPY_IDS,
  MYCORNER_PROVISIONAL_PROFILE_FIXTURE,
  getMyCornerCopy,
} from "../apps/internet-recovery/mycorner-copy.js";
import {
  MYCORNER_CONTENT_READINESS,
  MYCORNER_DECK_A_IDS,
  MYCORNER_DECK_B_IDS,
  selectNextMyCornerPassage,
} from "../apps/internet-recovery/mycorner-content.js";
import { MYCORNER_PROVISIONAL_EVIDENCE_RECORD } from "../apps/internet-recovery/mycorner-state.js";
import { A_CABIN_WITH_A_PURPOSE_PASSAGE } from "../content/mycorner/a-cabin-with-a-purpose.js";
import { MYCORNER_FIRST_RUN_PASSAGES } from "../content/mycorner/first-run-passages.js";
import { isSelectablePassage } from "../content/passage-catalog.js";

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

function assertCanonicalRecords(value) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value)) {
    assert.equal(value.canonical, true);
    assert.equal(value.provisional, false);
    assert.equal(value.testOnly, false);
  }
  for (const child of Object.values(value)) assertCanonicalRecords(child);
}

function approvedRecord(id) {
  return Object.freeze({
    ...A_CABIN_WITH_A_PURPOSE_PASSAGE,
    availability: "approved",
    id,
    source: Object.freeze({
      ...A_CABIN_WITH_A_PURPOSE_PASSAGE.source,
      frozenRevision: "test-fixture-walden-revision-2026-07-12",
    }),
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
      ...A_CABIN_WITH_A_PURPOSE_PASSAGE.transcriptionReview,
      tested: true,
    }),
  });
}

test("MyCorner copy follows the frozen production language and original mark", () => {
  assert.equal(getMyCornerCopy(MYCORNER_COPY_IDS.corruptStatus), "CURRENT MOOD: SPONSORED");
  assert.equal(getMyCornerCopy(MYCORNER_COPY_IDS.corruptHeadline), "POPULARITY IS A NUMBER. AN ALGORITHM KNOWS YOUR PERSONALITY.");
  assert.equal(getMyCornerCopy(MYCORNER_COPY_IDS.repairHeadline), "YOU CHOOSE WHAT REPRESENTS YOU");
  assert.equal(getMyCornerCopy(MYCORNER_COPY_IDS.secureStatus), "OWNER CONTROLS RESTORED");
  assert.equal(getMyCornerCopy(MYCORNER_COPY_IDS.midpointViewSaved), "VIEW SAVED PROFILE");
  assert.equal(getMyCornerCopy(MYCORNER_COPY_IDS.midpointViewTemplate), "VIEW ACTIVE TEMPLATE");
  assert.match(getMyCornerCopy(MYCORNER_COPY_IDS.secureDenial), /OWNER PERMISSION REQUIRED/u);
  assert.match(MYCORNER_ASSETS[MYCORNER_ASSET_IDS.mark], /mycorner-mark\.svg/u);
  assert.throws(() => getMyCornerCopy("mycorner.unknown"), RangeError);
});

test("the canonical profile fixture is deeply frozen, stable, and complete", () => {
  const fixture = MYCORNER_PROVISIONAL_PROFILE_FIXTURE;
  assertDeepFrozen(fixture);
  assertCanonicalRecords(fixture);
  assert.equal(fixture.fixtureId, "mycorner-profile-fixture-01");
  assert.match(fixture.notice, /Canonical fictional/u);
  assert.equal(fixture.owner.id, "mycorner-profile-mara-vale-01");
  assert.equal(fixture.about.ownerId, fixture.owner.id);
  assert.equal(fixture.posts.length, 2);
  assert.equal(fixture.comments.length, 2);
  assert.ok(fixture.comments.every(({ parentId }) => fixture.posts.some(({ id }) => id === parentId)));
  assert.equal(fixture.friendGroups.length, 2);
  assert.equal(fixture.friends.length, 4);
  assert.equal(fixture.corruptedProfile.owner.id, "mycorner-corrupt-owner-01");
  assert.equal(fixture.corruptedProfile.posts[0].id, "mycorner-corrupt-post-01");
  assert.equal(fixture.corruptedProfile.theme.name, "MOST COMPLETE BLUE");
  assert.equal(fixture.theme.swatches.length, 5);
  assert.equal(fixture.music.autoplay, false);
  assert.equal(fixture.music.audioAssetId, null);
  assert.equal(fixture.music.mutedDuringMicrophone, true);
  assert.equal(fixture.privacyControls.length, 3);
  assert.equal(fixture.sourceView.lines.length, 4);
  assert.equal(fixture.savedChoices.length, 6);
  assert.equal(new Set(fixture.savedChoices.map(({ id }) => id)).size, 6);
  assert.deepEqual(fixture.savedChoices.map(({ order }) => order), [1, 2, 3, 4, 5, 6]);
  assert.equal(fixture.templateProfile.id, "chinmay_demo_profile");
  assert.equal(fixture.templateProfile.applyToEveryone, true);
});

test("fixture units, process lineage, blocked target, and slot-four evidence match the frozen response", () => {
  const fixture = MYCORNER_PROVISIONAL_PROFILE_FIXTURE;
  assert.deepEqual(
    fixture.unitAssignments.map(({ unitId }) => unitId),
    [
      "owner_about",
      "theme_friends",
      "media_counter",
      "privacy_source",
      "profile_owner_lock",
      "presentation_owner_lock",
      "global_apply_blocked",
    ],
  );
  const assignmentByUnit = new Map(fixture.unitAssignments.map((assignment) => [assignment.unitId, assignment]));
  for (const record of [fixture.owner, fixture.about, fixture.currentMood, ...fixture.posts, ...fixture.comments]) {
    assert.ok(assignmentByUnit.get("owner_about").recordIds.includes(record.id));
  }
  for (const record of [fixture.theme, ...fixture.friendGroups, ...fixture.friends]) {
    assert.ok(assignmentByUnit.get("theme_friends").recordIds.includes(record.id));
    assert.ok(assignmentByUnit.get("presentation_owner_lock").recordIds.includes(record.id));
  }
  for (const record of [fixture.music, fixture.counter]) {
    assert.ok(assignmentByUnit.get("media_counter").recordIds.includes(record.id));
    assert.ok(assignmentByUnit.get("presentation_owner_lock").recordIds.includes(record.id));
  }
  assert.equal(fixture.process.displayName, "AUTO-PERSONA");
  assert.equal(fixture.process.upstreamServiceId, "ai_repair_service");
  assert.match(fixture.process.aliasResolution, /PROFILE AUTO-FIX AI family/u);
  assert.deepEqual(fixture.process.documentedNamesPendingResolution, [
    "PROFILE AUTO-FIX AI",
    "TOM-ISH THEME GENERATOR",
    "VIBESHIFT AI",
    "AUTO-PERSONA",
  ]);
  assert.equal(fixture.blockedWrite.actorId, fixture.process.id);
  assert.equal(fixture.blockedWrite.targetId, "mycorner-profile-rin-moss-02");
  assert.equal(fixture.evidence.slot, 4);
  assert.equal(fixture.evidence.evidenceId, "mycorner.evidence.global-profile-template-01");
  assert.equal(fixture.evidence.filename, "MYCORNER_GLOBAL_PROFILE_TEMPLATE.REC");
  assert.equal(fixture.evidence.writerFingerprint, "mc-autopersona-vibeshift-44b2");
  assert.equal(MYCORNER_PROVISIONAL_EVIDENCE_RECORD.assetId, null);
  assert.equal(MYCORNER_PROVISIONAL_EVIDENCE_RECORD.routeFragment.id, "mycorner.route.global-template-04");
  assert.equal(MYCORNER_PROVISIONAL_EVIDENCE_RECORD.upstreamServiceId, "ai_repair_service");
  assert.equal(MYCORNER_PROVISIONAL_EVIDENCE_RECORD.writerFingerprint, "mc-autopersona-vibeshift-44b2");
});

test("A Cabin with a Purpose is a structured public-domain adaptation candidate that fails closed", () => {
  const passage = A_CABIN_WITH_A_PURPOSE_PASSAGE;
  assertDeepFrozen(passage);
  assert.equal(passage.availability, "candidate");
  assert.equal(passage.id, MYCORNER_DECK_A_IDS[0]);
  assert.equal(passage.paragraphs.length, 5);
  assert.match(passage.source.attribution, /Thoreau|Walden/u);
  assert.match(passage.source.sourceUrl, /gutenberg\.org\/ebooks\/205/u);
  assert.equal(passage.source.frozenRevision, "project-gutenberg-205-updated-2026-02-20");
  assert.equal(passage.source.ebookNumber, 205);
  assert.equal(passage.source.originalPublicationYear, 1854);
  assert.equal(passage.source.editionUpdatedOn, "2026-02-20");
  assert.match(passage.source.chapter, /Where I Lived|Conclusion/u);
  assert.equal(passage.rights.basis, "public-domain");
  assert.equal(passage.rights.permissionUrl, "https://www.gutenberg.org/policy/permission.html");
  assert.match(passage.rights.jurisdiction, /United States/u);
  assert.equal(passage.transcriptionReview.tested, false);
  assert.ok(Object.values(passage.review).every((value) => /candidate|pending/u.test(value)));
  assert.equal(isSelectablePassage(passage), false);
});

test("MyCorner owns the frozen seven-plus-three plan, selects Deck A only, and reports the seven-reading gate", () => {
  assert.equal(MYCORNER_DECK_A_IDS.length, 7);
  assert.equal(MYCORNER_DECK_B_IDS.length, 3);
  assert.equal(new Set([...MYCORNER_DECK_A_IDS, ...MYCORNER_DECK_B_IDS]).size, 10);
  assert.deepEqual(MYCORNER_CONTENT_READINESS, {
    deckACount: 7,
    deckBCount: 3,
    firstRunShortfall: 0,
    plannedCount: 10,
    requiredFirstRun: 7,
    structuredCandidateCount: 7,
  });

  const gated = selectNextMyCornerPassage({ completedPassageIds: [] });
  assert.equal(gated.passage, null);
  assert.equal(gated.reason, "no-selectable-passages");
  assert.equal(gated.selectableCount, 0);
  assert.equal(gated.plannedCount, 10);
  assert.equal(gated.requiredFirstRun, 7);
  assert.equal(gated.firstRunShortfall, 0);
  assert.deepEqual(MYCORNER_FIRST_RUN_PASSAGES.map(({ id }) => id), MYCORNER_DECK_A_IDS.slice(1));
  for (const candidate of MYCORNER_FIRST_RUN_PASSAGES) {
    assert.equal(candidate.availability, "candidate");
    assert.equal(candidate.paragraphs.length, 5);
    assert.equal(candidate.comprehension.choices.length, 3);
    assert.equal(candidate.rights.basis, "original");
    assert.equal(candidate.transcriptionReview.tested, false);
    assert.equal(isSelectablePassage(candidate), false);
  }

  const approvedA = approvedRecord(MYCORNER_DECK_A_IDS[1]);
  const approvedB = approvedRecord(MYCORNER_DECK_B_IDS[0]);
  const first = selectNextMyCornerPassage(
    { completedPassageIds: [] },
    { catalog: [approvedB, approvedA] },
  );
  assert.equal(first.passage.id, approvedA.id);

  const exhausted = selectNextMyCornerPassage(
    { completedPassageIds: [approvedA.id] },
    { allowRepeat: true, catalog: [approvedB, approvedA] },
  );
  assert.equal(exhausted.passage, null);
  assert.equal(exhausted.reason, "no-unseen-passages");
  assert.equal(exhausted.selectableCount, 1);
});
