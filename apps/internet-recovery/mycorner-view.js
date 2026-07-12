import {
  MYCORNER_COPY,
  MYCORNER_COPY_IDS,
  MYCORNER_PROVISIONAL_PROFILE_FIXTURE,
} from "./mycorner-copy.js";
import {
  MYCORNER_CAMPAIGN_UNITS,
  MYCORNER_OWNER_LOCK_UNITS,
  MYCORNER_RESTORE_UNITS,
} from "./mycorner-rules.js";
import {
  MYCORNER_PROVISIONAL_BLOCKED_WRITE_RECORD,
  MYCORNER_PROVISIONAL_EVIDENCE_RECORD,
  normalizeMyCornerState,
} from "./mycorner-state.js";

function freezeDeep(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
}

function copy(copyId) {
  return MYCORNER_COPY[copyId];
}

function redactedModule(id, label, accessibleSummary) {
  return {
    accessibleSummary,
    id: `${id}-redacted`,
    label,
    restored: false,
    value: null,
  };
}

function buildSavedProfile(completed) {
  const fixture = MYCORNER_PROVISIONAL_PROFILE_FIXTURE;
  const ownerAboutRestored = completed.has("owner_about");
  const themeFriendsRestored = completed.has("theme_friends");
  const mediaCounterRestored = completed.has("media_counter");
  const privacySourceRestored = completed.has("privacy_source");

  return {
    about: ownerAboutRestored
      ? { ...fixture.about, restored: true }
      : redactedModule("mycorner-about", "ABOUT ME", "Owner-written About Me remains hidden until its restore unit saves."),
    comments: ownerAboutRestored
      ? fixture.comments.map((comment) => ({ ...comment, restored: true }))
      : [],
    counter: mediaCounterRestored
      ? { ...fixture.counter, restored: true }
      : redactedModule("mycorner-counter", "VISITOR COUNTER", "The honest visitor counter remains hidden until its media unit saves."),
    currentMood: ownerAboutRestored
      ? { ...fixture.currentMood, restored: true, value: fixture.currentMood.ownerValue }
      : redactedModule("mycorner-current-mood", "CURRENT MOOD", "The owner-selected mood remains hidden until the first restore unit saves."),
    friendGroups: themeFriendsRestored
      ? fixture.friendGroups.map((group) => ({ ...group, restored: true }))
      : [redactedModule("mycorner-friends", "FRIEND GROUPS", "Owner-selected friend groups remain hidden until their restore unit saves.")],
    friends: themeFriendsRestored
      ? fixture.friends.map((friend) => ({ ...friend, restored: true }))
      : [],
    music: mediaCounterRestored
      ? { ...fixture.music, restored: true }
      : {
          ...redactedModule("mycorner-music", "MUSIC", "Owner-selected music metadata remains hidden until its media unit saves."),
          audioAssetId: null,
          autoplay: false,
          mutedDuringMicrophone: true,
        },
    owner: ownerAboutRestored
      ? { ...fixture.owner, restored: true }
      : redactedModule("mycorner-owner", "PROFILE OWNER", "The profile owner remains hidden until the first restore unit saves."),
    posts: ownerAboutRestored
      ? fixture.posts.map((post) => ({ ...post, restored: true }))
      : [],
    privacyControls: privacySourceRestored
      ? fixture.privacyControls.map((control) => ({ ...control, restored: true }))
      : [redactedModule("mycorner-privacy", "PRIVACY", "Privacy values remain hidden until their restore unit saves.")],
    sourceView: privacySourceRestored
      ? { ...fixture.sourceView, restored: true }
      : redactedModule("mycorner-source", "SOURCE VIEW", "Profile-source lines remain hidden until their restore unit saves."),
    theme: themeFriendsRestored
      ? { ...fixture.theme, restored: true }
      : redactedModule("mycorner-theme", "THEME", "Owner-selected theme fragments remain hidden until their restore unit saves."),
  };
}

function buildTemplateProfile(visible) {
  if (!visible) return null;
  return { ...MYCORNER_PROVISIONAL_PROFILE_FIXTURE.templateProfile, restored: false };
}

function buildCorruptedProfile(savedProfile) {
  const corrupted = MYCORNER_PROVISIONAL_PROFILE_FIXTURE.corruptedProfile;
  const ownerAboutRestored = savedProfile.owner.restored;
  const themeFriendsRestored = savedProfile.theme.restored;
  const mediaCounterRestored = savedProfile.music.restored;
  const privacySourceRestored = savedProfile.sourceView.restored;

  return {
    about: ownerAboutRestored ? savedProfile.about : { ...corrupted.about },
    comments: ownerAboutRestored ? savedProfile.comments : corrupted.comments.map((comment) => ({ ...comment })),
    counter: mediaCounterRestored ? savedProfile.counter : { ...corrupted.counter },
    currentMood: ownerAboutRestored ? savedProfile.currentMood : { ...corrupted.currentMood },
    friendGroups: themeFriendsRestored ? savedProfile.friendGroups : corrupted.friendGroups.map((group) => ({ ...group })),
    friends: themeFriendsRestored ? savedProfile.friends : corrupted.friends.map((friend) => ({ ...friend })),
    music: mediaCounterRestored ? savedProfile.music : { ...corrupted.music },
    owner: ownerAboutRestored ? savedProfile.owner : { ...corrupted.owner },
    posts: ownerAboutRestored ? savedProfile.posts : corrupted.posts.map((post) => ({ ...post })),
    privacyControls: privacySourceRestored ? savedProfile.privacyControls : corrupted.privacyControls.map((control) => ({ ...control })),
    source: corrupted.source,
    sourceView: privacySourceRestored ? savedProfile.sourceView : { ...corrupted.sourceView },
    theme: themeFriendsRestored ? savedProfile.theme : { ...corrupted.theme },
  };
}

function buildLiveProfile(savedProfile, templateProfile, {
  globalApplyBlocked,
  midpointDiscovered,
  presentationOwnerLocked,
  profileOwnerLocked,
}) {
  if (!midpointDiscovered) return buildCorruptedProfile(savedProfile);
  if (globalApplyBlocked) return { ...savedProfile, source: "saved-owner-profile" };

  return {
    about: {
      accessibleSummary: "The active template About Me is visible while the owner-written version remains saved underneath.",
      id: "mycorner-active-template-about",
      restored: false,
      text: templateProfile.about,
    },
    comments: [],
    counter: presentationOwnerLocked
      ? savedProfile.counter
      : {
          accessibleSummary: "The demo template displays a popularity count instead of the owner's visitor counter.",
          id: "mycorner-active-template-counter",
          label: "TOP FRIENDS",
          restored: false,
          value: "8,000",
        },
    currentMood: profileOwnerLocked
      ? savedProfile.currentMood
      : {
          accessibleSummary: "The active demo template supplies the sponsored mood until the owner field is locked.",
          id: "mycorner-active-template-current-mood",
          restored: false,
          value: templateProfile.currentMood,
        },
    friendGroups: presentationOwnerLocked
      ? savedProfile.friendGroups
      : [{
          accessibleSummary: "The demo template repeats Chinmay instead of the owner's friend groups.",
          id: "mycorner-active-template-friends",
          label: templateProfile.friendLayout,
          restored: false,
        }],
    friends: presentationOwnerLocked ? savedProfile.friends : [],
    music: presentationOwnerLocked
      ? savedProfile.music
      : {
          accessibleSummary: "The template requests the fictional Quarterly Momentum Theme, but runtime audio remains absent and autoplay remains off.",
          artist: null,
          audioAssetId: null,
          autoplay: false,
          id: "mycorner-active-template-music",
          mutedDuringMicrophone: true,
          restored: false,
          title: templateProfile.music,
        },
    owner: profileOwnerLocked
      ? savedProfile.owner
      : {
          accessibleSummary: "The template currently presents Chinmay as the page owner.",
          displayName: templateProfile.ownerDisplayName,
          handle: templateProfile.ownerHandle,
          id: "mycorner-active-template-owner",
          initials: "C",
          restored: false,
        },
    posts: [],
    privacyControls: [{
      accessibleSummary: "The demo template makes the page public by vibe until global apply is blocked.",
      id: "mycorner-active-template-privacy",
      label: "PRIVACY",
      restored: false,
      value: templateProfile.privacy,
    }],
    source: "active-template-with-owner-locks",
    sourceView: {
      accessibleSummary: "The active template still reports apply to everyone until the final permission seal saves.",
      id: "mycorner-active-template-source",
      label: "APPLY TO EVERYONE",
      restored: false,
      value: "active",
    },
    theme: presentationOwnerLocked
      ? savedProfile.theme
      : {
          accessibleSummary: "The demo profile's Executive Launch Gradient is active while the owner theme remains saved underneath.",
          id: "mycorner-active-template-theme",
          name: templateProfile.theme,
          restored: false,
        },
  };
}

function buildScrapbook(completed) {
  const slots = [
    ...MYCORNER_RESTORE_UNITS,
    ...MYCORNER_OWNER_LOCK_UNITS.slice(0, 2),
  ].map((unit, index) => ({
    accessibleSummary: completed.has(unit.unitId)
      ? `Scrapbook slot ${index + 1} saved: ${unit.visibleRepair}`
      : `Scrapbook slot ${index + 1} is empty: ${unit.unitId} has not saved.`,
    completed: completed.has(unit.unitId),
    label: unit.unitId.replaceAll("_", " ").toUpperCase(),
    slot: index + 1,
    unitId: unit.unitId,
  }));
  const permissionCompleted = completed.has("global_apply_blocked");

  return {
    accessibleSummary: `${slots.filter(({ completed: done }) => done).length} of 6 scrapbook slots saved. Global permission seal ${permissionCompleted ? "secured" : "not secured"}.`,
    permissionSeal: {
      accessibleSummary: permissionCompleted
        ? "The separate global permission seal is secured: Apply to Everyone is blocked."
        : "The separate global permission seal is not yet secured.",
      completed: permissionCompleted,
      label: permissionCompleted ? "OWNER PERMISSION REQUIRED" : "GLOBAL PERMISSION PENDING",
      unitId: "global_apply_blocked",
    },
    slots,
  };
}

function buildMidpoint(state, savedProfile, templateProfile, comparisonView) {
  const discovered = state.midpointDiscovered;
  if (!discovered) {
    return {
      acknowledged: false,
      actionRequired: false,
      activeComparisonView: null,
      amyLine: null,
      body: null,
      chinmayLine: null,
      comparisonProfile: null,
      discovered: false,
      preservedUnitIds: [],
      proofLines: [],
      savedChoiceCount: 0,
      savedProfileAvailable: false,
      title: null,
      viewSavedAction: null,
      viewTemplateAction: null,
      visible: false,
    };
  }
  const activeComparisonView = discovered && comparisonView === "saved" ? "saved" : "template";
  return {
    acknowledged: state.midpointAcknowledged,
    actionRequired: discovered && !state.midpointAcknowledged,
    activeComparisonView,
    amyLine: copy(MYCORNER_COPY_IDS.midpointAmy),
    body: copy(MYCORNER_COPY_IDS.midpointBody),
    chinmayLine: copy(MYCORNER_COPY_IDS.midpointChinmay),
    comparisonProfile: activeComparisonView === "saved" ? savedProfile : templateProfile,
    discovered,
    preservedUnitIds: MYCORNER_RESTORE_UNITS.map(({ unitId }) => unitId),
    proofLines: [
      copy(MYCORNER_COPY_IDS.midpointSaved),
      copy(MYCORNER_COPY_IDS.midpointTemplate),
      copy(MYCORNER_COPY_IDS.midpointApply),
    ],
    savedChoiceCount: discovered
      ? MYCORNER_PROVISIONAL_PROFILE_FIXTURE.savedChoices.length
      : 0,
    savedProfileAvailable: discovered,
    title: copy(MYCORNER_COPY_IDS.midpointTitle),
    viewSavedAction: copy(MYCORNER_COPY_IDS.midpointViewSaved),
    viewTemplateAction: copy(MYCORNER_COPY_IDS.midpointViewTemplate),
    visible: discovered && !state.midpointAcknowledged,
  };
}

function buildSecuredRecords(state) {
  if (!state.secured) return { blockedWrite: null, evidence: null, securedPayoff: null };
  const fixture = MYCORNER_PROVISIONAL_PROFILE_FIXTURE;
  return {
    blockedWrite: {
      ...MYCORNER_PROVISIONAL_BLOCKED_WRITE_RECORD,
      fixtureAttempt: { ...fixture.blockedWrite },
      process: { ...fixture.process },
    },
    evidence: {
      ...MYCORNER_PROVISIONAL_EVIDENCE_RECORD,
      fixtureDraft: { ...fixture.evidence },
    },
    securedPayoff: {
      bodyLines: copy(MYCORNER_COPY_IDS.secureBody).split("\n").filter(Boolean),
      canonical: true,
      denial: copy(MYCORNER_COPY_IDS.secureDenial),
      evidenceTitle: copy(MYCORNER_COPY_IDS.evidenceTitle),
      provisional: false,
      status: copy(MYCORNER_COPY_IDS.secureStatus),
      testOnly: false,
      title: copy(MYCORNER_COPY_IDS.secureTitle),
    },
  };
}

export function getMyCornerCampaignView(currentState, {
  comparisonView = "template",
  reducedMotion = false,
} = {}) {
  const state = normalizeMyCornerState(currentState);
  const completed = new Set(state.completedUnitIds);
  const savedProfile = buildSavedProfile(completed);
  const templateProfile = buildTemplateProfile(state.midpointDiscovered);
  const profileOwnerLocked = completed.has("profile_owner_lock");
  const presentationOwnerLocked = completed.has("presentation_owner_lock");
  const globalApplyBlocked = completed.has("global_apply_blocked");
  const liveProfile = buildLiveProfile(savedProfile, templateProfile, {
    globalApplyBlocked,
    midpointDiscovered: state.midpointDiscovered,
    presentationOwnerLocked,
    profileOwnerLocked,
  });
  const midpoint = buildMidpoint(state, savedProfile, templateProfile, comparisonView);
  const securedRecords = buildSecuredRecords(state);
  const completedCount = state.completedUnitIds.length;
  const lastCompletedUnit = completedCount ? MYCORNER_CAMPAIGN_UNITS[completedCount - 1] : null;
  const ruleRepaired = state.midpointDiscovered;

  return freezeDeep({
    ariaDescription: state.secured
      ? "MyCorner owner controls restored. The saved owner profile is visible, Apply to Everyone is blocked, and the canonical slot-four evidence receipt is available."
      : state.midpointDiscovered
        ? "MyCorner Apply to Everyone reveal. Four restored profile groups remain saved beneath one active demo template while owner controls are repaired."
        : "Corrupted MyCorner profile. Owner-authored modules return in four exact restore groups without a percentage tracker.",
    blockedWrite: securedRecords.blockedWrite,
    comparison: {
      activeView: midpoint.activeComparisonView,
      available: state.midpointDiscovered,
      profile: midpoint.comparisonProfile,
      savedProfile,
      templateProfile: state.midpointDiscovered ? templateProfile : null,
    },
    evidence: securedRecords.evidence,
    fixture: {
      canonical: true,
      fixtureId: MYCORNER_PROVISIONAL_PROFILE_FIXTURE.fixtureId,
      notice: MYCORNER_PROVISIONAL_PROFILE_FIXTURE.notice,
      provisional: false,
      status: MYCORNER_PROVISIONAL_PROFILE_FIXTURE.status,
      testOnly: false,
    },
    headerStatus: state.secured
      ? copy(MYCORNER_COPY_IDS.secureStatus)
      : state.midpointDiscovered
        ? "APPLY TO EVERYONE: active"
        : copy(MYCORNER_COPY_IDS.corruptStatus),
    lastRepairAnnouncement: lastCompletedUnit?.reaction
      ?? "MyCorner structural test ready. No repair result saved.",
    liveProfile,
    midpoint,
    motion: {
      moduleRevealMs: reducedMotion ? 0 : 500,
      mode: reducedMotion ? "state-swap" : "stepped-scrapbook-repair",
      templateRevealMs: reducedMotion ? 0 : 650,
      usesTechnoStill: reducedMotion,
    },
    process: state.midpointDiscovered
      ? { ...MYCORNER_PROVISIONAL_PROFILE_FIXTURE.process }
      : null,
    progress: {
      completedUnitCount: completedCount,
      completedUnitIds: [...state.completedUnitIds],
      ownerLockCompletedCount: Math.max(0, completedCount - MYCORNER_RESTORE_UNITS.length),
      ownerLockTotal: MYCORNER_OWNER_LOCK_UNITS.length,
      preservedRestoreUnitIds: state.midpointDiscovered
        ? MYCORNER_RESTORE_UNITS.map(({ unitId }) => unitId)
        : [],
      restoreCompletedCount: Math.min(completedCount, MYCORNER_RESTORE_UNITS.length),
      restoreTotal: MYCORNER_RESTORE_UNITS.length,
      totalUnitCount: MYCORNER_CAMPAIGN_UNITS.length,
    },
    readingGate: {
      firstRunShortfall: 7,
      micState: "off",
      plannedCount: 10,
      playable: false,
      requiredFirstRun: 7,
      scoreMode: "none",
      selectableCount: 0,
      statusLines: copy(MYCORNER_COPY_IDS.readingGate).split("\n"),
    },
    ruleBody: copy(ruleRepaired ? MYCORNER_COPY_IDS.repairBody : MYCORNER_COPY_IDS.corruptBody),
    ruleLabel: copy(ruleRepaired ? MYCORNER_COPY_IDS.repairHeadline : MYCORNER_COPY_IDS.corruptHeadline),
    savedChoices: state.midpointDiscovered
      ? MYCORNER_PROVISIONAL_PROFILE_FIXTURE.savedChoices.map((choice) => ({ ...choice }))
      : [],
    scrapbook: buildScrapbook(completed),
    secured: state.secured,
    securedPayoff: securedRecords.securedPayoff,
    siteId: "mycorner",
    stateId: state.stateId,
    templateOverlay: {
      active: state.midpointDiscovered && !globalApplyBlocked,
      applyToEveryone: state.midpointDiscovered && !globalApplyBlocked,
      profile: state.midpointDiscovered ? templateProfile : null,
      showingTemplate: midpoint.activeComparisonView === "template",
      visible: state.midpointDiscovered && !globalApplyBlocked,
    },
    truth: {
      globalApplyBlocked,
      mediaCounterRestored: completed.has("media_counter"),
      ownerAboutRestored: completed.has("owner_about"),
      presentationOwnerLocked,
      privacySourceRestored: completed.has("privacy_source"),
      profileOwnerLocked,
      themeFriendsRestored: completed.has("theme_friends"),
    },
  });
}

export const createMyCornerViewModel = getMyCornerCampaignView;
