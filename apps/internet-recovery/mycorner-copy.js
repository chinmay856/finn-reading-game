const freezeDeep = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
};

const provisionalRecord = (value) => ({
  ...value,
  canonical: true,
  provisional: false,
  testOnly: false,
});

export const MYCORNER_COPY_IDS = Object.freeze({
  corruptBody: "site.mycorner.corrupt.body",
  corruptHeadline: "site.mycorner.corrupt.headline",
  corruptModule1: "site.mycorner.corrupt.module.1",
  corruptModule2: "site.mycorner.corrupt.module.2",
  corruptModule3: "site.mycorner.corrupt.module.3",
  corruptModule4: "site.mycorner.corrupt.module.4",
  corruptStatus: "site.mycorner.corruptStatus",
  evidenceBody: "site.mycorner.secure.evidenceBody",
  evidenceTitle: "site.mycorner.secure.evidenceTitle",
  completionAmy: "site.mycorner.completion.amy",
  completionChinmay: "site.mycorner.completion.chinmay",
  completionTitle: "site.mycorner.completion.title",
  midpointAmy: "site.mycorner.midpoint.amy",
  midpointApply: "site.mycorner.midpoint.apply",
  midpointBody: "site.mycorner.midpoint.body",
  midpointChinmay: "site.mycorner.midpoint.chinmay",
  midpointSaved: "site.mycorner.midpoint.saved",
  midpointTemplate: "site.mycorner.midpoint.template",
  midpointTitle: "site.mycorner.midpoint.title",
  midpointViewSaved: "site.mycorner.midpoint.viewSaved",
  midpointViewTemplate: "site.mycorner.midpoint.viewTemplate",
  name: "site.mycorner.name",
  processName: "mycorner.process.autoPersona",
  readingGate: "site.mycorner.readingGate",
  repairBody: "site.mycorner.repair.body",
  repairHeadline: "site.mycorner.repair.headline",
  repairLabel1: "site.mycorner.repair.label.1",
  repairLabel2: "site.mycorner.repair.label.2",
  repairLabel3: "site.mycorner.repair.label.3",
  repairLabel4: "site.mycorner.repair.label.4",
  secureBody: "site.mycorner.secure.body",
  secureDenial: "site.mycorner.secure.denial",
  secureStatus: "site.mycorner.secureStatus",
  secureTitle: "site.mycorner.secure.title",
  tagline: "site.mycorner.tagline",
  technoAlt: "site.mycorner.secure.technoAlt",
});

export const MYCORNER_COPY = Object.freeze({
  [MYCORNER_COPY_IDS.corruptBody]: "Your profile has been optimized into the most complete available identity: Chinmay's demo account.",
  [MYCORNER_COPY_IDS.corruptHeadline]: "POPULARITY IS A NUMBER. AN ALGORITHM KNOWS YOUR PERSONALITY.",
  [MYCORNER_COPY_IDS.corruptModule1]: "Top 8,000 Friends: Chinmay, Chinmay, Chinmay...",
  [MYCORNER_COPY_IDS.corruptModule2]: "About Me: generated from a starter profile",
  [MYCORNER_COPY_IDS.corruptModule3]: "Music: autoplay cannot be paused because engagement is character",
  [MYCORNER_COPY_IDS.corruptModule4]: "Privacy: public by vibe",
  [MYCORNER_COPY_IDS.corruptStatus]: "CURRENT MOOD: SPONSORED",
  [MYCORNER_COPY_IDS.evidenceBody]: "The AI treated one polished demo identity as the default personality for everyone.",
  [MYCORNER_COPY_IDS.evidenceTitle]: "MYCORNER / GLOBAL PROFILE TEMPLATE",
  [MYCORNER_COPY_IDS.completionAmy]: "You restored the real profile, locked every choice to its owner, and blocked Apply to Everyone. MyCorner is fixed. Site complete.",
  [MYCORNER_COPY_IDS.completionChinmay]: "My profile remains professionally complete, but it is no longer everybody's profile. That is, apparently, an important distinction.",
  [MYCORNER_COPY_IDS.completionTitle]: "MYCORNER BELONGS TO ITS OWNERS AGAIN",
  [MYCORNER_COPY_IDS.midpointAmy]: "First half complete: the four real profile sections are saved underneath. Second half: lock those choices to their owners and block the template from applying itself to everyone.",
  [MYCORNER_COPY_IDS.midpointApply]: "APPLY TO EVERYONE: active",
  [MYCORNER_COPY_IDS.midpointBody]: "Highest-confidence template: chinmay_demo_profile\nApply to everyone: active",
  [MYCORNER_COPY_IDS.midpointChinmay]: "The demo profile was professionally complete. I did not realize the AI would interpret \"complete\" as \"everybody should be me.\" Please proceed with the owner locks.",
  [MYCORNER_COPY_IDS.midpointSaved]: "SAVED OWNER SNAPSHOT: six distinct module choices",
  [MYCORNER_COPY_IDS.midpointTemplate]: "ACTIVE TEMPLATE: chinmay_demo_profile",
  [MYCORNER_COPY_IDS.midpointTitle]: "TOM-ISH THEME GENERATOR",
  [MYCORNER_COPY_IDS.midpointViewSaved]: "VIEW SAVED PROFILE",
  [MYCORNER_COPY_IDS.midpointViewTemplate]: "VIEW ACTIVE TEMPLATE",
  [MYCORNER_COPY_IDS.name]: "MyCorner",
  [MYCORNER_COPY_IDS.processName]: "AUTO-PERSONA",
  [MYCORNER_COPY_IDS.readingGate]: "10 PLANNED - 1 STRUCTURED CANDIDATE - 0 SELECTABLE - 7 REQUIRED\nMIC: OFF\nNO READING SCORE",
  [MYCORNER_COPY_IDS.repairBody]: "A profile should preserve owner-written posts, chosen themes, real friend groups, privacy controls, and the right to stop autoplay.",
  [MYCORNER_COPY_IDS.repairHeadline]: "YOU CHOOSE WHAT REPRESENTS YOU",
  [MYCORNER_COPY_IDS.repairLabel1]: "Owner-written About Me",
  [MYCORNER_COPY_IDS.repairLabel2]: "Manual music choice",
  [MYCORNER_COPY_IDS.repairLabel3]: "Friend groups restored",
  [MYCORNER_COPY_IDS.repairLabel4]: "Privacy controls visible",
  [MYCORNER_COPY_IDS.secureBody]: "Profile owner: visible.\nTheme owner: visible.\nApply-to-everyone: blocked.",
  [MYCORNER_COPY_IDS.secureDenial]: "AUTO-PERSONA tried to overwrite another profile.\n\nOWNER PERMISSION REQUIRED",
  [MYCORNER_COPY_IDS.secureStatus]: "OWNER CONTROLS RESTORED",
  [MYCORNER_COPY_IDS.secureTitle]: "OWNER CONTROLS RESTORED",
  [MYCORNER_COPY_IDS.tagline]: "Your page should not be replaced by someone else's template.",
  [MYCORNER_COPY_IDS.technoAlt]: "Techno compares the generated BALL profile with the real ball under her paw.",
});

export function getMyCornerCopy(copyId) {
  if (!Object.hasOwn(MYCORNER_COPY, copyId)) {
    throw new RangeError(`Unknown MyCorner copy ID: ${copyId}`);
  }
  return MYCORNER_COPY[copyId];
}

export const MYCORNER_ASSET_IDS = Object.freeze({
  mark: "mycorner.mark",
});

export const MYCORNER_ASSETS = Object.freeze({
  [MYCORNER_ASSET_IDS.mark]: new URL("./art/site-assets/marks/mycorner-mark.svg", import.meta.url).href,
});

const NOTICE = "Canonical fictional MyCorner runtime fixture. Reading passages remain unavailable until every content and real-microphone review gate passes.";
const OWNER_ID = "mycorner-profile-mara-vale-01";
const TARGET_ID = "mycorner-profile-rin-moss-02";
const PROCESS_ID = "mycorner-process-auto-persona-01";
const EVIDENCE_ID = "mycorner.evidence.global-profile-template-01";
const BLOCKED_WRITE_ID = "mycorner-blocked-write-owner-permission-01";

const owner = provisionalRecord({
  accessibleSummary: "The fictional profile owner is Mara Vale, shown with the initials MV and the handle at mara corners.",
  displayName: "Mara Vale",
  handle: "@mara_corners",
  id: OWNER_ID,
  initials: "MV",
});

const about = provisionalRecord({
  accessibleSummary: "Mara's fictional owner-written About Me says she builds tiny cardboard cities and notices which windows stay lit.",
  id: "mycorner-about-mara-01",
  ownerId: OWNER_ID,
  sourceId: "mycorner-source-owner-about-01",
  text: "I build tiny cardboard cities, then write down which windows stay lit after midnight.",
});

const theme = provisionalRecord({
  accessibleSummary: "The fictional Midnight Scrapbook theme uses deep blue, pale blue, magenta, yellow, and green owner-selected fragments.",
  fragments: [
    provisionalRecord({ id: "mycorner-theme-fragment-grid-stars-01", label: "HAND-DRAWN GRID STARS", order: 1 }),
    provisionalRecord({ id: "mycorner-theme-fragment-tape-corners-02", label: "YELLOW TAPE CORNERS", order: 2 }),
  ],
  id: "mycorner-theme-midnight-scrapbook-01",
  name: "Midnight Scrapbook",
  ownerId: OWNER_ID,
  swatches: ["#244A88", "#E7F0FF", "#C4478C", "#E7BF45", "#2C7A57"],
});

const friendGroups = [
  provisionalRecord({
    accessibleSummary: "The fictional Workshop Crew group contains Jo Park and Inez Bell in owner-chosen order.",
    id: "mycorner-group-workshop-crew-01",
    label: "WORKSHOP CREW",
    memberIds: ["mycorner-person-jo-park-01", "mycorner-person-inez-bell-02"],
    order: 1,
    ownerId: OWNER_ID,
  }),
  provisionalRecord({
    accessibleSummary: "The fictional Night Readers group contains Sol Reed and Rin Moss in owner-chosen order.",
    id: "mycorner-group-night-readers-02",
    label: "NIGHT READERS",
    memberIds: ["mycorner-person-sol-reed-03", TARGET_ID],
    order: 2,
    ownerId: OWNER_ID,
  }),
];

const friends = [
  provisionalRecord({ accessibleSummary: "Fictional friend Jo Park, initials JP.", displayName: "Jo Park", id: "mycorner-person-jo-park-01", initials: "JP" }),
  provisionalRecord({ accessibleSummary: "Fictional friend Inez Bell, initials IB.", displayName: "Inez Bell", id: "mycorner-person-inez-bell-02", initials: "IB" }),
  provisionalRecord({ accessibleSummary: "Fictional friend Sol Reed, initials SR.", displayName: "Sol Reed", id: "mycorner-person-sol-reed-03", initials: "SR" }),
  provisionalRecord({ accessibleSummary: "Fictional profile owner Rin Moss, initials RM; this is the blocked overwrite target.", displayName: "Rin Moss", id: TARGET_ID, initials: "RM" }),
];

const music = provisionalRecord({
  accessibleSummary: "The fictional track Paper Satellites by North Window Club is selected. Autoplay is off and there is no audio asset.",
  artist: "North Window Club (fictional)",
  audioAssetId: null,
  autoplay: false,
    id: "mycorner-music-paper-satellites-01",
  mutedDuringMicrophone: true,
  ownerId: OWNER_ID,
  title: "Paper Satellites",
});

const counter = provisionalRecord({
  accessibleSummary: "The fictional profile has 184 visits labeled visitors who arrived on purpose.",
  id: "mycorner-counter-owner-visits-01",
  label: "VISITORS WHO ARRIVED ON PURPOSE",
  value: 184,
});

const privacyControls = [
  provisionalRecord({ id: "mycorner-privacy-profile-01", label: "PROFILE VISIBILITY", ownerId: OWNER_ID, value: "FRIENDS ONLY" }),
  provisionalRecord({ id: "mycorner-privacy-comments-02", label: "COMMENTS", ownerId: OWNER_ID, value: "FRIENDS MAY COMMENT" }),
  provisionalRecord({ id: "mycorner-privacy-template-03", label: "TEMPLATE CHANGES", ownerId: OWNER_ID, value: "OWNER APPROVAL REQUIRED" }),
];

const sourceView = provisionalRecord({
  accessibleSummary: "The fictional source inspector identifies Mara as profile and theme owner, reports autoplay off, and requires owner approval for template changes.",
  id: "mycorner-source-view-mara-01",
  lines: [
    "profile_owner = mycorner-profile-mara-vale-01",
    "theme_owner = mycorner-profile-mara-vale-01",
    "music_autoplay = false",
    "template_permission = owner_approval_required",
  ],
  ownerId: OWNER_ID,
});

const posts = [
  provisionalRecord({
    authorId: OWNER_ID,
    body: "The paper train station finally has a roof. It also has three clocks and none agree.",
    id: "mycorner-post-station-roof-01",
    sourceId: "mycorner-source-owner-post-01",
    timestamp: "2026-04-16T19:20:00-07:00",
  }),
  provisionalRecord({
    authorId: OWNER_ID,
    body: "Tonight's rule: every tiny street gets one unnecessary bench.",
    id: "mycorner-post-street-bench-02",
    sourceId: "mycorner-source-owner-post-02",
    timestamp: "2026-04-17T22:05:00-07:00",
  }),
];

const comments = [
  provisionalRecord({
    authorId: "mycorner-person-jo-park-01",
    body: "The clocks are accurate in three different imaginary time zones.",
    id: "mycorner-comment-clocks-01",
    parentId: "mycorner-post-station-roof-01",
    sourceId: "mycorner-source-friend-comment-01",
    timestamp: "2026-04-16T19:44:00-07:00",
  }),
  provisionalRecord({
    authorId: TARGET_ID,
    body: "Please reserve the bench beside the cardboard bakery.",
    id: "mycorner-comment-bench-02",
    parentId: "mycorner-post-street-bench-02",
    sourceId: "mycorner-source-friend-comment-02",
    timestamp: "2026-04-17T22:31:00-07:00",
  }),
];

const savedChoices = [
  provisionalRecord({ id: "mycorner-choice-owner-01", label: "PROFILE OWNER", order: 1, owningUnitId: "owner_about", value: "Mara Vale" }),
  provisionalRecord({ id: "mycorner-choice-about-02", label: "ABOUT ME", order: 2, owningUnitId: "owner_about", value: "Tiny cardboard cities" }),
  provisionalRecord({ id: "mycorner-choice-theme-03", label: "THEME", order: 3, owningUnitId: "theme_friends", value: "Midnight Scrapbook" }),
  provisionalRecord({ id: "mycorner-choice-friends-04", label: "FRIEND GROUPS", order: 4, owningUnitId: "theme_friends", value: "Workshop Crew + Night Readers" }),
  provisionalRecord({ id: "mycorner-choice-music-05", label: "MUSIC", order: 5, owningUnitId: "media_counter", value: "Paper Satellites — autoplay off" }),
  provisionalRecord({ id: "mycorner-choice-privacy-06", label: "PRIVACY", order: 6, owningUnitId: "privacy_source", value: "Friends only" }),
];

const templateProfile = provisionalRecord({
  about: "AI-company CEO. Professionally complete. Available for keynotes and emergency relaunches.",
  accessibleSummary: "Chinmay's rushed demo profile replaces every owner field with one polished executive template.",
  applyToEveryone: true,
  friendLayout: "TOP 8,000 FRIENDS: CHINMAY REPEATED",
  id: "chinmay_demo_profile",
  currentMood: "SPONSORED",
  music: "Quarterly Momentum Theme - autoplay requested",
  ownerDisplayName: "Chinmay",
  ownerHandle: "@chinmay_demo",
  privacy: "PUBLIC BY VIBE",
  theme: "Executive Launch Gradient",
});

const corruptedProfile = provisionalRecord({
  about: provisionalRecord({
    accessibleSummary: "The corrupted About Me was generated from a starter profile.",
    id: "mycorner-corrupt-about-01",
    restored: false,
    text: "generated from a starter profile",
  }),
  comments: [],
  counter: provisionalRecord({
    accessibleSummary: "The corrupted visitor counter claims maximum popularity without an inspectable count.",
    id: "mycorner-corrupt-counter-01",
    label: "POPULARITY",
    restored: false,
    value: "MAXIMUM",
  }),
  currentMood: provisionalRecord({
    accessibleSummary: "The corrupted profile mood is sponsored rather than owner-written.",
    id: "mycorner-corrupt-mood-01",
    restored: false,
    value: "SPONSORED",
  }),
  friendGroups: [provisionalRecord({
    accessibleSummary: "The corrupted friend module repeats Chinmay instead of showing owner-selected groups.",
    id: "mycorner-corrupt-friends-01",
    label: "TOP 8,000 FRIENDS: CHINMAY REPEATED",
    restored: false,
  })],
  friends: [],
  music: provisionalRecord({
    accessibleSummary: "The corrupted module claims engagement is character, but the structural diagnostic has no audio asset and keeps autoplay off.",
    artist: null,
    audioAssetId: null,
    autoplay: false,
    claimedAutoplayRequired: true,
    id: "mycorner-corrupt-music-01",
    mutedDuringMicrophone: true,
    restored: false,
    title: "ENGAGEMENT IS CHARACTER",
  }),
  owner: provisionalRecord({
    accessibleSummary: "The corrupted page presents Chinmay's demo account instead of the actual profile owner.",
    displayName: "Chinmay's demo account",
    handle: null,
    id: "mycorner-corrupt-owner-01",
    initials: "C",
    restored: false,
  }),
  posts: [provisionalRecord({
    accessibleSummary: "The corrupted page replaces owner-written posts with generic professional updates.",
    authorId: null,
    body: "Professional update approved for maximum completeness.",
    id: "mycorner-corrupt-post-01",
    restored: false,
  })],
  privacyControls: [provisionalRecord({
    accessibleSummary: "The corrupted privacy setting is public by vibe.",
    id: "mycorner-corrupt-privacy-01",
    label: "PRIVACY",
    restored: false,
    value: "PUBLIC BY VIBE",
  })],
  source: "corrupted-profile-with-staged-owner-restores",
  sourceView: provisionalRecord({
    accessibleSummary: "The corrupted page hides profile source and ownership fields.",
    id: "mycorner-corrupt-source-01",
    label: "SOURCE VIEW",
    restored: false,
    value: "UNAVAILABLE",
  }),
  theme: provisionalRecord({
    accessibleSummary: "The corrupted page uses a generic complete-profile blue theme.",
    id: "mycorner-corrupt-theme-01",
    name: "MOST COMPLETE BLUE",
    restored: false,
  }),
});

export const MYCORNER_PROVISIONAL_PROFILE_FIXTURE = freezeDeep(provisionalRecord({
  about,
  blockedWrite: provisionalRecord({
    accessibleSummary: "AUTO-PERSONA attempts to overwrite Rin Moss's owner, theme, music, and privacy fields with the demo template and is denied.",
    actorId: PROCESS_ID,
    attemptedFieldIds: ["profile_owner", "theme_owner", "music_choice", "privacy"],
    blockedLabel: "OWNER PERMISSION REQUIRED",
    id: BLOCKED_WRITE_ID,
    templateId: templateProfile.id,
    targetId: TARGET_ID,
  }),
  comments,
  corruptedProfile,
  counter,
  currentMood: provisionalRecord({
    corrupted: "SPONSORED",
    id: "mycorner-mood-night-city-01",
    ownerValue: "BUILDING A TINY NIGHT CITY",
  }),
  evidence: provisionalRecord({
    accessibleSummary: "A test-only MyCorner global-profile-template receipt for Case File slot 4; it is not registered for the final evidence unlock.",
    evidenceId: EVIDENCE_ID,
    filename: "MYCORNER_GLOBAL_PROFILE_TEMPLATE.REC",
    routeFragmentId: "mycorner.route.global-template-04",
    shortLabel: "GLOBAL PROFILE TEMPLATE",
    slot: 4,
    writerFingerprint: "mc-autopersona-vibeshift-44b2",
  }),
  fixtureId: "mycorner-profile-fixture-01",
  friendGroups,
  friends,
  music,
  notice: NOTICE,
  owner,
  posts,
  privacyControls,
  process: provisionalRecord({
    accessibleSummary: "AUTO-PERSONA is the local profile-template job routed to the canonical AI repair service.",
    aliasResolution: "PROFILE AUTO-FIX AI family; TOM-ISH theme subtask; VIBESHIFT model family",
    displayName: "AUTO-PERSONA",
    documentedNamesPendingResolution: ["PROFILE AUTO-FIX AI", "TOM-ISH THEME GENERATOR", "VIBESHIFT AI", "AUTO-PERSONA"],
    id: PROCESS_ID,
    upstreamServiceId: "ai_repair_service",
  }),
  savedChoices,
  sourceView,
  status: "canonical-runtime-fixture",
  templateProfile,
  theme,
  unitAssignments: [
    provisionalRecord({ recordIds: [OWNER_ID, about.id, "mycorner-mood-night-city-01", ...posts.map(({ id }) => id), ...comments.map(({ id }) => id)], unitId: "owner_about" }),
    provisionalRecord({ recordIds: [theme.id, ...friendGroups.map(({ id }) => id), ...friends.map(({ id }) => id)], unitId: "theme_friends" }),
    provisionalRecord({ recordIds: [music.id, counter.id], unitId: "media_counter" }),
    provisionalRecord({ recordIds: [...privacyControls.map(({ id }) => id), sourceView.id], unitId: "privacy_source" }),
    provisionalRecord({ recordIds: [OWNER_ID, "mycorner-mood-night-city-01"], unitId: "profile_owner_lock" }),
    provisionalRecord({ recordIds: [theme.id, music.id, counter.id, ...friendGroups.map(({ id }) => id), ...friends.map(({ id }) => id)], unitId: "presentation_owner_lock" }),
    provisionalRecord({ recordIds: [PROCESS_ID, TARGET_ID], unitId: "global_apply_blocked" }),
  ],
}));

export const MYCORNER_PROVISIONAL_NOTICE = NOTICE;
