import test from "node:test";
import assert from "node:assert/strict";

import {
  MYCORNER_CAMPAIGN_UNITS,
  MYCORNER_RESTORE_UNITS,
} from "../apps/internet-recovery/mycorner-rules.js";
import { normalizeMyCornerState } from "../apps/internet-recovery/mycorner-state.js";
import { getMyCornerCampaignView } from "../apps/internet-recovery/mycorner-view.js";

function stateAt(completedCount, details = {}) {
  return normalizeMyCornerState({
    ...details,
    completedUnitIds: MYCORNER_CAMPAIGN_UNITS
      .slice(0, completedCount)
      .map(({ unitId }) => unitId),
    midpointAcknowledged: completedCount > MYCORNER_RESTORE_UNITS.length
      ? true
      : details.midpointAcknowledged,
  });
}

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

test("each restore unit discloses only its authored profile group", () => {
  const corrupted = getMyCornerCampaignView(stateAt(0));
  assert.equal(corrupted.truth.ownerAboutRestored, false);
  assert.equal(corrupted.comparison.savedProfile.owner.restored, false);
  assert.equal(corrupted.liveProfile.owner.displayName, "Chinmay's demo account");
  assert.equal(corrupted.liveProfile.currentMood.value, "SPONSORED");
  assert.equal(corrupted.liveProfile.theme.name, "MOST COMPLETE BLUE");
  assert.equal(corrupted.liveProfile.music.autoplay, false);
  assert.equal(corrupted.process, null);
  assert.equal(corrupted.comparison.templateProfile, null);
  assert.deepEqual(corrupted.midpoint.proofLines, []);
  assert.deepEqual(corrupted.savedChoices, []);
  assert.doesNotMatch(
    JSON.stringify(corrupted),
    /Mara Vale|Midnight Scrapbook|Paper Satellites|FRIENDS ONLY|chinmay_demo_profile|AUTO-PERSONA|SAVED OWNER SNAPSHOT|TOM-ISH/u,
  );

  const owner = getMyCornerCampaignView(stateAt(1));
  assert.equal(owner.truth.ownerAboutRestored, true);
  assert.equal(owner.comparison.savedProfile.owner.displayName, "Mara Vale");
  assert.match(owner.comparison.savedProfile.about.text, /cardboard cities/u);
  assert.equal(owner.comparison.savedProfile.posts.length, 2);
  assert.equal(owner.liveProfile.owner.displayName, "Mara Vale");
  assert.equal(owner.liveProfile.currentMood.value, "BUILDING A TINY NIGHT CITY");
  assert.equal(owner.liveProfile.theme.name, "MOST COMPLETE BLUE");
  assert.equal(owner.process, null);
  assert.deepEqual(owner.midpoint.proofLines, []);
  assert.doesNotMatch(JSON.stringify(owner), /Midnight Scrapbook|Paper Satellites|FRIENDS ONLY|chinmay_demo_profile|AUTO-PERSONA|SAVED OWNER SNAPSHOT|TOM-ISH/u);

  const theme = getMyCornerCampaignView(stateAt(2));
  assert.equal(theme.truth.themeFriendsRestored, true);
  assert.equal(theme.comparison.savedProfile.theme.name, "Midnight Scrapbook");
  assert.equal(theme.comparison.savedProfile.friendGroups.length, 2);
  assert.equal(theme.liveProfile.theme.name, "Midnight Scrapbook");
  assert.equal(theme.liveProfile.music.title, "ENGAGEMENT IS CHARACTER");
  assert.equal(theme.process, null);
  assert.deepEqual(theme.savedChoices, []);
  assert.doesNotMatch(JSON.stringify(theme), /Paper Satellites|FRIENDS ONLY|chinmay_demo_profile|AUTO-PERSONA|SAVED OWNER SNAPSHOT|TOM-ISH/u);

  const media = getMyCornerCampaignView(stateAt(3));
  assert.equal(media.truth.mediaCounterRestored, true);
  assert.equal(media.comparison.savedProfile.music.title, "Paper Satellites");
  assert.equal(media.comparison.savedProfile.music.autoplay, false);
  assert.equal(media.comparison.savedProfile.music.audioAssetId, null);
  assert.equal(media.comparison.savedProfile.counter.value, 184);
  assert.equal(media.liveProfile.music.title, "Paper Satellites");
  assert.equal(media.liveProfile.privacyControls[0].value, "PUBLIC BY VIBE");
  assert.equal(media.process, null);
  assert.deepEqual(media.midpoint.proofLines, []);
  assert.doesNotMatch(JSON.stringify(media), /FRIENDS ONLY|chinmay_demo_profile|AUTO-PERSONA|SAVED OWNER SNAPSHOT|TOM-ISH/u);

  const privacy = getMyCornerCampaignView(stateAt(4));
  assert.equal(privacy.truth.privacySourceRestored, true);
  assert.equal(privacy.comparison.savedProfile.privacyControls[0].value, "FRIENDS ONLY");
  assert.equal(privacy.comparison.savedProfile.sourceView.lines.length, 4);
  assert.equal(privacy.midpoint.discovered, true);
  assert.equal(privacy.comparison.templateProfile.id, "chinmay_demo_profile");
});

test("Apply to Everyone preserves six saved choices and supports a non-mutating comparison", () => {
  const state = stateAt(4);
  const template = getMyCornerCampaignView(state);
  const saved = getMyCornerCampaignView(state, { comparisonView: "saved" });

  assert.equal(template.stateId, "mycorner_template_reveal");
  assert.equal(template.midpoint.visible, true);
  assert.equal(template.midpoint.actionRequired, true);
  assert.deepEqual(template.midpoint.proofLines, [
    "SAVED OWNER SNAPSHOT: six distinct module choices",
    "ACTIVE TEMPLATE: chinmay_demo_profile",
    "APPLY TO EVERYONE: active",
  ]);
  assert.deepEqual(template.midpoint.preservedUnitIds, MYCORNER_RESTORE_UNITS.map(({ unitId }) => unitId));
  assert.equal(template.savedChoices.length, 6);
  assert.equal(new Set(template.savedChoices.map(({ id }) => id)).size, 6);
  assert.equal(template.comparison.activeView, "template");
  assert.equal(template.comparison.profile.id, "chinmay_demo_profile");
  assert.equal(template.templateOverlay.visible, true);
  assert.equal(template.templateOverlay.showingTemplate, true);
  assert.equal(template.midpoint.viewTemplateAction, "VIEW ACTIVE TEMPLATE");

  assert.equal(saved.comparison.activeView, "saved");
  assert.equal(saved.comparison.profile.owner.id, "mycorner-profile-mara-vale-01");
  assert.equal(saved.templateOverlay.visible, true);
  assert.equal(saved.templateOverlay.showingTemplate, false);
  assert.equal(saved.midpoint.actionRequired, true);
  assert.deepEqual(saved.progress, template.progress);
  assert.deepEqual(saved.comparison.savedProfile, template.comparison.savedProfile);
  assert.equal(state.midpointAcknowledged, false);
});

test("the six-slot scrapbook and separate permission seal never become a percentage", () => {
  for (let completedCount = 0; completedCount <= MYCORNER_CAMPAIGN_UNITS.length; completedCount += 1) {
    const view = getMyCornerCampaignView(stateAt(completedCount));
    assert.equal(view.scrapbook.slots.length, 6);
    assert.equal(view.scrapbook.permissionSeal.unitId, "global_apply_blocked");
    assert.equal(view.scrapbook.permissionSeal.completed, completedCount === 7);
    assert.equal(view.progress.restoreTotal, 4);
    assert.equal(view.progress.ownerLockTotal, 3);
    assert.equal(view.progress.totalUnitCount, 7);
    assert.equal(Object.hasOwn(view.progress, "percent"), false);
    assert.equal(Object.hasOwn(view.progress, "percentage"), false);
    assert.doesNotMatch(JSON.stringify(view.progress), /%|percent/iu);
  }
});

test("owner locks progressively restore the live profile without deleting its saved snapshot", () => {
  const acknowledged = getMyCornerCampaignView(stateAt(4, { midpointAcknowledged: true }));
  assert.equal(acknowledged.midpoint.visible, false);
  assert.equal(acknowledged.liveProfile.owner.displayName, "Chinmay");
  assert.equal(acknowledged.comparison.savedProfile.owner.displayName, "Mara Vale");

  const ownerLocked = getMyCornerCampaignView(stateAt(5));
  assert.equal(ownerLocked.truth.profileOwnerLocked, true);
  assert.equal(ownerLocked.liveProfile.owner.displayName, "Mara Vale");
  assert.equal(ownerLocked.liveProfile.theme.name, "Executive Launch Gradient");

  const presentationLocked = getMyCornerCampaignView(stateAt(6));
  assert.equal(presentationLocked.truth.presentationOwnerLocked, true);
  assert.equal(presentationLocked.liveProfile.theme.name, "Midnight Scrapbook");
  assert.equal(presentationLocked.liveProfile.music.title, "Paper Satellites");
  assert.equal(presentationLocked.liveProfile.music.autoplay, false);
  assert.equal(presentationLocked.truth.globalApplyBlocked, false);
  assert.equal(presentationLocked.templateOverlay.active, true);
});

test("secured payoff exposes canonical slot-four evidence and the denied overwrite", () => {
  const secured = getMyCornerCampaignView(stateAt(7));
  assert.equal(secured.secured, true);
  assert.equal(secured.stateId, "mycorner_secured");
  assert.equal(secured.headerStatus, "OWNER CONTROLS RESTORED");
  assert.equal(secured.truth.globalApplyBlocked, true);
  assert.equal(secured.templateOverlay.active, false);
  assert.equal(secured.liveProfile.source, "saved-owner-profile");
  assert.equal(secured.scrapbook.permissionSeal.completed, true);

  assert.equal(secured.evidence.slot, 4);
  assert.equal(secured.evidence.canonical, true);
  assert.equal(secured.evidence.provisional, false);
  assert.equal(secured.evidence.testOnly, false);
  assert.equal(secured.evidence.eligibleForCanonicalCount, true);
  assert.equal(secured.evidence.filename, "MYCORNER_GLOBAL_PROFILE_TEMPLATE.REC");
  assert.equal(secured.blockedWrite.label, "OWNER PERMISSION REQUIRED");
  assert.equal(secured.blockedWrite.canonical, true);
  assert.equal(secured.blockedWrite.fixtureAttempt.actorId, "mycorner-process-auto-persona-01");
  assert.equal(secured.blockedWrite.fixtureAttempt.targetId, "mycorner-profile-rin-moss-02");
  assert.equal(secured.securedPayoff.canonical, true);
  assert.equal(secured.securedPayoff.testOnly, false);
});

test("structural diagnostics keep the microphone and scoring off in every state", () => {
  for (let completedCount = 0; completedCount <= MYCORNER_CAMPAIGN_UNITS.length; completedCount += 1) {
    const view = getMyCornerCampaignView(stateAt(completedCount));
    assert.equal(view.readingGate.playable, false);
    assert.equal(view.readingGate.micState, "off");
    assert.equal(view.readingGate.scoreMode, "none");
    assert.equal(view.readingGate.plannedCount, 10);
    assert.equal(view.readingGate.selectableCount, 0);
    assert.equal(view.readingGate.requiredFirstRun, 7);
    assert.deepEqual(view.readingGate.statusLines.slice(-2), ["MIC: OFF", "NO READING SCORE"]);
  }
});

test("reduced motion changes only motion metadata and the view is deeply frozen", () => {
  const state = stateAt(4);
  const animated = getMyCornerCampaignView(state);
  const reduced = getMyCornerCampaignView(state, { reducedMotion: true });

  assert.equal(animated.motion.moduleRevealMs, 500);
  assert.equal(animated.motion.templateRevealMs, 650);
  assert.equal(reduced.motion.moduleRevealMs, 0);
  assert.equal(reduced.motion.templateRevealMs, 0);
  assert.equal(reduced.motion.mode, "state-swap");
  assert.equal(reduced.motion.usesTechnoStill, true);
  assert.deepEqual({ ...reduced, motion: null }, { ...animated, motion: null });
  assertDeepFrozen(reduced);
});

test("MyCorner exposes honest phase counts and causal midpoint and completion dialogue", () => {
  const midpoint = getMyCornerCampaignView(stateAt(4));
  assert.deepEqual(midpoint.progress.phase, { completed: 0, label: "LOCK OWNER CONTROLS", total: 3 });
  assert.equal(midpoint.progress.visibleCountLabel, "4 / 7 PROFILE REPAIRS");
  assert.match(midpoint.midpoint.amyLine, /owner-written profile sections survived/iu);
  assert.match(midpoint.midpoint.amyLine, /lock those choices to their owners/iu);

  const secured = getMyCornerCampaignView(stateAt(7));
  assert.equal(secured.progress.visibleCountLabel, "7 / 7 PROFILE REPAIRS");
  assert.match(secured.securedPayoff.amyLine, /belongs to its owner again/iu);
  assert.match(secured.securedPayoff.chinmayLine, /no longer everybody's profile/iu);
});
