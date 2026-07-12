import test from "node:test";
import assert from "node:assert/strict";

import { FACEPLACE_PROVISIONAL_FEED_FIXTURE } from "../apps/internet-recovery/faceplace-copy.js";
import { FACEPLACE_CAMPAIGN_UNITS } from "../apps/internet-recovery/faceplace-rules.js";
import {
  FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
  normalizeFacePlaceState,
} from "../apps/internet-recovery/faceplace-state.js";
import { getFacePlaceCampaignView } from "../apps/internet-recovery/faceplace-view.js";

function stateAt(completedCount, details = {}) {
  return normalizeFacePlaceState({
    completedUnitIds: FACEPLACE_CAMPAIGN_UNITS
      .slice(0, completedCount)
      .map(({ unitId }) => unitId),
    ...details,
  });
}

function semanticView(view) {
  const { motion, ...semantic } = view;
  return semantic;
}

test("all FacePlace states expose the exact tracker sequence without inventing an initial value", () => {
  const expected = [
    { display: null, kind: "nonsense", value: null },
    { display: "12%", kind: "nonsense", value: null },
    { display: "114%", kind: "nonsense", value: null },
    { display: "0%", kind: "honest", value: 0 },
    { display: "34%", kind: "honest", value: 34 },
    { display: "67%", kind: "honest", value: 67 },
    { display: "100%", kind: "honest", value: 100 },
  ];

  expected.forEach((tracker, completedCount) => {
    const view = getFacePlaceCampaignView(stateAt(completedCount));
    assert.equal(view.tracker.display, tracker.display);
    assert.equal(view.tracker.kind, tracker.kind);
    assert.equal(view.tracker.value, tracker.value);
    assert.equal(view.tracker.isProgress, tracker.kind === "honest");
    assert.equal(view.tracker.decorative, tracker.kind !== "honest");
    assert.equal(view.tracker.role, tracker.kind === "honest" ? "progressbar" : null);
    assert.equal(view.tracker.ariaValueNow, tracker.value);
  });
});

test("corrupted ranked feed follows visual order and does not expose hidden identity or context", () => {
  const view = getFacePlaceCampaignView(stateAt(0));

  assert.deepEqual(
    view.feedCards.map(({ reactions }) => reactions),
    [488, 431, 406, 27, 22, 18],
  );
  assert.deepEqual(
    view.feedCards.map(({ id }) => id),
    FACEPLACE_PROVISIONAL_FEED_FIXTURE.feedCards.map(({ id }) => id),
  );
  assert.ok(view.feedCards.every(({ authorLabel }) => authorLabel === "AUTHOR HIDDEN"));
  assert.ok(view.feedCards.every(({ displayTimestamp }) => displayTimestamp === "TIME HIDDEN"));
  assert.ok(view.feedCards.every(({ cardTypeLabel }) => cardTypeLabel === "UNLABELED"));
  assert.equal(view.contextPanel.shellRestored, false);
  assert.equal(view.chronologyControl.available, false);
});

test("the first repair collapses duplicate display while retaining every source-card identity", () => {
  const view = getFacePlaceCampaignView(stateAt(1));
  const duplicateGroup = view.duplicateGroups[0];

  assert.equal(duplicateGroup.collapsed, true);
  assert.deepEqual(duplicateGroup.memberCardIds, FACEPLACE_PROVISIONAL_FEED_FIXTURE.duplicateGroup.cardIds);
  assert.deepEqual(duplicateGroup.hiddenCardIds, FACEPLACE_PROVISIONAL_FEED_FIXTURE.duplicateGroup.cardIds.slice(1));
  assert.equal(view.sourceCardIds.length, 6);
  assert.equal(view.feedCards.length, 4);
  assert.equal(view.feedCards[0].duplicateRepresentative, true);
  assert.deepEqual(view.feedCards[0].collapsedDuplicateCardIds, duplicateGroup.memberCardIds);
});

test("authorship repair restores semantic author and time fields without making the tracker real", () => {
  const view = getFacePlaceCampaignView(stateAt(2));

  assert.ok(view.feedCards.every(({ authorVisible }) => authorVisible));
  assert.ok(view.feedCards.every(({ timestampVisible }) => timestampVisible));
  assert.ok(view.feedCards.every(({ timestamp }) => timestamp?.startsWith("2026-07-12T")));
  assert.equal(view.tracker.display, "114%");
  assert.equal(view.tracker.ariaHidden, true);
  assert.equal(view.tracker.role, null);
  assert.equal(view.tracker.ariaValueNow, null);
  assert.equal(view.tracker.live, false);
});

test("normal unit-three view is Honest Zero with all Act I work preserved", () => {
  const state = stateAt(3);
  const view = getFacePlaceCampaignView(state);

  assert.equal(state.stateId, "faceplace_honest_zero");
  assert.equal(state.lastCompletedStateId, "faceplace_false_tracker_3");
  assert.equal(view.stateId, "faceplace_honest_zero");
  assert.equal(view.tracker.display, "0%");
  assert.equal(view.tracker.value, 0);
  assert.match(view.tracker.ariaValueText, /Three Act I repairs remain saved/u);
  assert.equal(view.midpoint.visible, true);
  assert.equal(view.midpoint.actionRequired, true);
  assert.deepEqual(
    view.midpoint.preservedUnitIds,
    FACEPLACE_CAMPAIGN_UNITS.slice(0, 3).map(({ unitId }) => unitId),
  );
  assert.equal(view.contextPanel.shellRestored, true);
  assert.equal(view.contextPanel.reasonsVerified, false);
  assert.ok(view.contextPanel.reasons.every(({ reasonText }) => /verification pending/u.test(reasonText)));
});

test("post-unit-three transient shows decorative AVOCADO without changing canonical state", () => {
  const state = stateAt(3);
  const view = getFacePlaceCampaignView(state, { showActOneResult: true });

  assert.equal(view.stateId, "faceplace_honest_zero");
  assert.equal(view.tracker.display, "AVOCADO%");
  assert.equal(view.tracker.kind, "nonsense");
  assert.equal(view.tracker.value, null);
  assert.equal(view.tracker.role, null);
  assert.equal(view.tracker.decorative, true);
  assert.equal(view.tracker.transientActOneResult, true);
  assert.equal(view.midpoint.discovered, true);
  assert.equal(view.midpoint.visible, false);
  assert.ok(view.relationshipClusters.every(({ revealed }) => !revealed));

  const acknowledged = stateAt(3, { midpointAcknowledged: true });
  const acknowledgedView = getFacePlaceCampaignView(acknowledged);
  assert.equal(acknowledged.stateId, "faceplace_honest_zero");
  assert.equal(acknowledgedView.tracker.display, "0%");
  assert.equal(acknowledgedView.midpoint.acknowledged, true);
});

test("chronology repair changes actual DOM order and leaves ranked mode explicitly available", () => {
  const chronological = getFacePlaceCampaignView(stateAt(4));
  const ranked = getFacePlaceCampaignView(stateAt(4, { feedMode: "ranked" }));

  assert.equal(chronological.feedMode, "chronological");
  assert.equal(chronological.chronologyControl.available, true);
  assert.deepEqual(
    chronological.feedCards.map(({ displayTimestamp }) => displayTimestamp),
    ["08:41", "08:37", "08:12", "07:54"],
  );
  assert.deepEqual(
    ranked.feedCards.map(({ reactions }) => reactions),
    [488, 27, 22, 18],
  );
  assert.notDeepEqual(
    chronological.feedCards.map(({ id }) => id),
    ranked.feedCards.map(({ id }) => id),
  );
});

test("recommendation reasons appear only after their authored verification unit", () => {
  const pending = getFacePlaceCampaignView(stateAt(4));
  const verified = getFacePlaceCampaignView(stateAt(5));

  assert.ok(pending.contextPanel.reasons.every(({ verified: itemVerified }) => !itemVerified));
  assert.ok(pending.contextPanel.reasons.every(({ reasonText }) => /verification pending/u.test(reasonText)));
  assert.ok(verified.contextPanel.reasons.every(({ verified: itemVerified }) => itemVerified));
  assert.ok(verified.contextPanel.reasons.every(({ reasonText }) => /Recommended because/u.test(reasonText)));
  assert.ok(verified.feedCards
    .filter(({ recommendation }) => recommendation.applicable)
    .every(({ recommendation }) => recommendation.verified));
});

test("relationship rail and People You May Sort Of Know remain semantic provisional data", () => {
  const corrupted = getFacePlaceCampaignView(stateAt(0));
  const view = getFacePlaceCampaignView(stateAt(3));

  assert.ok(corrupted.relationshipClusters.every(({ revealed }) => !revealed));
  assert.ok(corrupted.relationshipClusters.every(({ members }) => members.length === 0));
  assert.equal(view.relationshipClusters.length, 2);
  assert.ok(view.relationshipClusters.every(({ revealed }) => revealed));
  assert.ok(view.relationshipClusters.every(({ accessibleSummary }) => accessibleSummary.length > 20));
  assert.ok(view.relationshipClusters.every(({ members }) => members.length === 2));
  assert.deepEqual(
    view.peopleYouMaySortOfKnow.map(({ id }) => id),
    FACEPLACE_PROVISIONAL_FEED_FIXTURE.peopleSuggestions.map(({ id }) => id),
  );
  assert.equal(view.fixture.canonical, false);
  assert.equal(view.fixture.provisional, true);
  assert.match(view.fixture.notice, /NOT CANONICAL/u);
});

test("secured payoff exposes canonical evidence and the exact blocked target", () => {
  const view = getFacePlaceCampaignView(stateAt(6));

  assert.equal(view.secured, true);
  assert.equal(view.tracker.value, 100);
  assert.equal(view.evidence.id, FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.id);
  assert.equal(view.evidence.canonical, true);
  assert.equal(view.evidence.provisional, false);
  assert.equal(view.evidence.testOnly, false);
  assert.equal(view.evidence.slot, 3);
  assert.equal(view.blockedWrite.id, FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD.id);
  assert.equal(view.blockedWrite.canonical, true);
  assert.equal(view.blockedWrite.targetId, "faceplace-card-crispmaster-01");
  assert.equal(
    view.blockedWrite.fixtureAttempt.targetCardId,
    FACEPLACE_PROVISIONAL_FEED_FIXTURE.boostedCardId,
  );
  assert.equal(view.securedPayoff.canonical, true);
  assert.equal(view.securedPayoff.testOnly, false);
});

test("reduced motion changes only motion metadata", () => {
  for (let completedCount = 0; completedCount <= FACEPLACE_CAMPAIGN_UNITS.length; completedCount += 1) {
    const state = stateAt(completedCount);
    const animated = getFacePlaceCampaignView(state);
    const reduced = getFacePlaceCampaignView(state, { reducedMotion: true });

    assert.deepEqual(semanticView(reduced), semanticView(animated));
    assert.equal(reduced.motion.mode, "state-swap");
    assert.equal(reduced.motion.cardCollapseMs, 0);
    assert.equal(reduced.motion.cardReorderMs, 0);
    assert.equal(reduced.motion.trackerSwapMs, 0);
    assert.equal(reduced.motion.usesTechnoStill, true);
  }
});
