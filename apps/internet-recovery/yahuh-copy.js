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

export const YAHUH_COPY_IDS = Object.freeze({
  corruptBody: "site.yahuh.corrupt.body",
  corruptHeadline: "site.yahuh.corrupt.headline",
  corruptStatus: "site.yahuh.corruptStatus",
  completionAmy: "site.yahuh.completion.amy",
  completionChinmay: "site.yahuh.completion.chinmay",
  completionTitle: "site.yahuh.completion.title",
  evidenceTitle: "site.yahuh.secure.evidenceTitle",
  midpointAmy: "site.yahuh.midpoint.amy",
  midpointBody: "site.yahuh.midpoint.body",
  midpointChinmay: "site.yahuh.midpoint.chinmay",
  midpointProofChannels: "site.yahuh.midpoint.proof.channels",
  midpointProofModules: "site.yahuh.midpoint.proof.modules",
  midpointProofRewrite: "site.yahuh.midpoint.proof.rewrite",
  midpointTitle: "site.yahuh.midpoint.title",
  name: "site.yahuh.name",
  readingGate: "site.yahuh.readingGate",
  repairBody: "site.yahuh.repair.body",
  repairHeadline: "site.yahuh.repair.headline",
  secureBody: "site.yahuh.secure.body",
  secureDenial: "site.yahuh.secure.denial",
  secureStatus: "site.yahuh.secureStatus",
  tagline: "site.yahuh.tagline",
  technoAlt: "site.yahuh.secure.technoAlt",
  technoLabel: "site.yahuh.secure.technoLabel",
});

export const YAHUH_COPY = Object.freeze({
  [YAHUH_COPY_IDS.corruptBody]: "News, weather, finance, mail, sports, and sponsorship have been merged into one efficient information paste.",
  [YAHUH_COPY_IDS.corruptHeadline]: "IF INFORMATION EXISTS, IT BELONGS ON THE FRONT PAGE",
  [YAHUH_COPY_IDS.corruptStatus]: "FRONT PAGE: EVERYTHING",
  [YAHUH_COPY_IDS.completionAmy]: "You separated all six modules, reconnected their independent channels, and made sources and sponsorship visible. Every module has its own channel again.",
  [YAHUH_COPY_IDS.completionChinmay]: "Six useful sections instead of one extremely efficient hose. I withdraw my objection to categories.",
  [YAHUH_COPY_IDS.completionTitle]: "YAHUH HAS SIX CHANNELS AGAIN",
  [YAHUH_COPY_IDS.evidenceTitle]: "YAHUH PORTAL / SINGLE STREAM MERGE",
  [YAHUH_COPY_IDS.midpointAmy]: "All six modules are sorted and labeled again. Their identical timestamp exposes one generated stream; reconnect each pair to an independent channel.",
  [YAHUH_COPY_IDS.midpointBody]: "PORTAL AUTO-FIX AI replaced all channels with one generated stream.\n\nEfficiency improved.\nMeaning did not.",
  [YAHUH_COPY_IDS.midpointChinmay]: "Separate categories were legacy clutter. I am now open to the possibility that clutter was doing useful work. Reconnect the channels.",
  [YAHUH_COPY_IDS.midpointProofChannels]: "INDEPENDENT CHANNELS: 1",
  [YAHUH_COPY_IDS.midpointProofModules]: "VISIBLE MODULES: 6",
  [YAHUH_COPY_IDS.midpointProofRewrite]: "SAME-MILLISECOND REWRITE: CONFIRMED",
  [YAHUH_COPY_IDS.midpointTitle]: "SINGLE SOURCE OF EVERYTHING",
  [YAHUH_COPY_IDS.name]: "Yahuh! Portal",
  [YAHUH_COPY_IDS.readingGate]: "10 PLANNED - 1 STRUCTURED CANDIDATE - 0 SELECTABLE - 6 REQUIRED\nMIC: OFF\nNO READING SCORE",
  [YAHUH_COPY_IDS.repairBody]: "A useful portal separates categories, sources, dates, and sponsorship so readers can tell what kind of information they are seeing.",
  [YAHUH_COPY_IDS.repairHeadline]: "LABELS HELP YOU DECIDE WHAT MATTERS",
  [YAHUH_COPY_IDS.secureBody]: "Categories separated.\nSources visible.\nSponsorship labeled.",
  [YAHUH_COPY_IDS.secureDenial]: "AUTO-LAYOUT tried to merge the portal again.\n\nCATEGORY AND SOURCE REQUIRED",
  [YAHUH_COPY_IDS.secureStatus]: "CATEGORY SWITCHBOARD RESTORED",
  [YAHUH_COPY_IDS.tagline]: "Labels help you decide what matters.",
  [YAHUH_COPY_IDS.technoAlt]: "Techno's ball is correctly classified in Sports.",
  [YAHUH_COPY_IDS.technoLabel]: "DOG TOY — NOT BREAKING NEWS",
});

export function getYahuhCopy(copyId) {
  if (!Object.hasOwn(YAHUH_COPY, copyId)) throw new RangeError(`Unknown Yahuh copy ID: ${copyId}`);
  return YAHUH_COPY[copyId];
}

export const YAHUH_ASSET_IDS = Object.freeze({ mark: "yahuh.mark" });
export const YAHUH_ASSETS = Object.freeze({
  [YAHUH_ASSET_IDS.mark]: new URL("./art/site-assets/marks/yahuh-mark.svg", import.meta.url).href,
});

const NOTICE = "Canonical fictional Yahuh runtime fixture. Reading passages remain unavailable until every content and real-microphone gate passes.";
const MERGED_ORIGIN_ID = "yahuh-generated-origin-single-stream-01";
const MERGED_TIMESTAMP = "2026-04-18T08:22:22.222Z";
const PORTAL_PROCESS_ID = "yahuh-process-portal-autofix-01";
const BLOCKED_PROCESS_ID = "yahuh-process-auto-layout-01";
const EVIDENCE_ID = "yahuh.evidence.single-stream-merge-01";
const BLOCKED_WRITE_ID = "yahuh-blocked-write-category-source-01";

const moduleRecord = ({
  categoryId,
  categoryName,
  channelId,
  channelName,
  corruptHeadline,
  id,
  publishedAt,
  reconnectedByUnitId,
  routeSummary,
  savedByUnitId,
  sourceId,
  sourceLabel,
  sponsored = false,
  summary,
  title,
}) => provisionalRecord({
  accessibleRouteSummary: routeSummary,
  category: provisionalRecord({ id: categoryId, name: categoryName }),
  channel: provisionalRecord({ id: channelId, name: channelName }),
  corruptHeadline,
  id,
  publishedAt,
  reconnectedByUnitId,
  savedByUnitId,
  source: provisionalRecord({ id: sourceId, label: sourceLabel }),
  sponsored,
  sponsorshipLabel: sponsored ? "SPONSORED" : "NOT SPONSORED",
  summary,
  timezone: "UTC",
  title,
});

const modules = [
  moduleRecord({
    categoryId: "yahuh-category-news-01",
    categoryName: "NEWS",
    channelId: "yahuh-channel-news-wire-01",
    channelName: "NORTHWIND CITY WIRE",
    corruptHeadline: "News: umbrella prices rise before cloudy earnings",
    id: "yahuh-module-news-01",
    publishedAt: "2026-04-18T08:05:00.000Z",
    reconnectedByUnitId: "news_weather_channels",
    routeSummary: "News routes from the fictional Northwind City Wire to the News module only.",
    savedByUnitId: "news_weather_sorted",
    sourceId: "yahuh-source-news-desk-01",
    sourceLabel: "Northwind City Desk",
    summary: "The community observatory will open for an evening tour after repairs.",
    title: "COMMUNITY OBSERVATORY REOPENS AFTER DARK",
  }),
  moduleRecord({
    categoryId: "yahuh-category-weather-02",
    categoryName: "WEATHER",
    channelId: "yahuh-channel-weather-station-02",
    channelName: "NORTHWIND WEATHER STATION",
    corruptHeadline: "Weather: the stock market is cloudy",
    id: "yahuh-module-weather-02",
    publishedAt: "2026-04-18T08:10:00.000Z",
    reconnectedByUnitId: "news_weather_channels",
    routeSummary: "Weather routes from the fictional Northwind Weather Station to the Weather module only.",
    savedByUnitId: "news_weather_sorted",
    sourceId: "yahuh-source-weather-desk-02",
    sourceLabel: "Northwind Weather Desk",
    summary: "Rain is likely after four in the afternoon, with wind from the west.",
    title: "RAIN LIKELY AFTER FOUR",
  }),
  moduleRecord({
    categoryId: "yahuh-category-finance-03",
    categoryName: "FINANCE",
    channelId: "yahuh-channel-civic-ledger-03",
    channelName: "NORTHWIND CIVIC LEDGER",
    corruptHeadline: "Finance: tomorrow will rain quarterly earnings",
    id: "yahuh-module-finance-03",
    publishedAt: "2026-04-18T08:15:00.000Z",
    reconnectedByUnitId: "finance_sports_channels",
    routeSummary: "Finance routes from a fictional public-budget ledger to the Finance module only.",
    savedByUnitId: "finance_sports_sorted",
    sourceId: "yahuh-source-civic-ledger-03",
    sourceLabel: "Northwind Civic Ledger",
    summary: "A fictional library repair budget adds a contingency line for roof work.",
    title: "LIBRARY REPAIR BUDGET ADDS CONTINGENCY",
  }),
  moduleRecord({
    categoryId: "yahuh-category-sports-04",
    categoryName: "SPORTS",
    channelId: "yahuh-channel-recreation-04",
    channelName: "NORTHWIND RECREATION DESK",
    corruptHeadline: "Sports: dog toy declared breaking",
    id: "yahuh-module-sports-04",
    publishedAt: "2026-04-18T08:20:00.000Z",
    reconnectedByUnitId: "finance_sports_channels",
    routeSummary: "Sports routes from the fictional recreation desk to the Sports module only.",
    savedByUnitId: "finance_sports_sorted",
    sourceId: "yahuh-source-recreation-04",
    sourceLabel: "Northwind Recreation Desk",
    summary: "Techno's ball rolled across a practice court. It remains a dog toy, not breaking news.",
    title: "DOG TOY CROSSES PRACTICE COURT",
  }),
  moduleRecord({
    categoryId: "yahuh-category-mail-05",
    categoryName: "MAIL",
    channelId: "yahuh-channel-local-mailbox-05",
    channelName: "LOCAL MAILBOX INDEX",
    corruptHeadline: "Mail: coupon forecast replies to everyone",
    id: "yahuh-module-mail-05",
    publishedAt: "2026-04-18T08:12:00.000Z",
    reconnectedByUnitId: "mail_sponsored_channels",
    routeSummary: "Mail stays in a local mailbox index and exposes no sender, recipient, address, or message body.",
    savedByUnitId: "mail_sponsored_sorted",
    sourceId: "yahuh-source-local-mailbox-05",
    sourceLabel: "Local mailbox index",
    summary: "Two fictional newsletters are indexed. No sender, recipient, address, or message body is stored or displayed.",
    title: "TWO SAVED NEWSLETTERS",
  }),
  moduleRecord({
    categoryId: "yahuh-category-sponsored-06",
    categoryName: "SPONSORED",
    channelId: "yahuh-channel-sponsor-gate-06",
    channelName: "SPONSORSHIP GATE",
    corruptHeadline: "Sponsored News: maybe news, maybe coupon",
    id: "yahuh-module-sponsored-06",
    publishedAt: "2026-04-18T08:18:00.000Z",
    reconnectedByUnitId: "mail_sponsored_channels",
    routeSummary: "Sponsored material routes through a sponsorship gate and cannot enter News without its label.",
    savedByUnitId: "mail_sponsored_sorted",
    sourceId: "yahuh-source-cardboard-corner-06",
    sourceLabel: "Cardboard Corner Shop",
    sponsored: true,
    summary: "A fictional cardboard shop announces an opening-week coupon.",
    title: "CARDBOARD CORNER OPENING-WEEK NOTICE",
  }),
];

export const YAHUH_PROVISIONAL_PORTAL_FIXTURE = freezeDeep(provisionalRecord({
  blockedWrite: provisionalRecord({
    actorId: BLOCKED_PROCESS_ID,
    attemptedFields: ["categoryId", "sourceId", "channelId"],
    attemptedModuleIds: modules.map(({ id }) => id),
    id: BLOCKED_WRITE_ID,
    targetId: "yahuh-switchboard-all-modules-01",
  }),
  evidence: provisionalRecord({
    evidenceId: EVIDENCE_ID,
    filename: "YAHUH_SINGLE_STREAM_MERGE.REC",
    routeFragmentId: "yahuh.route.single-stream-05",
    shortLabel: "SINGLE STREAM MERGE",
    slot: 5,
    writerFingerprint: "yh-portalmerge-18d6",
  }),
  fixtureId: "yahuh-portal-fixture-01",
  savedLabelSnapshotId: "yahuh-saved-label-snapshot-01",
  mergedOrigin: provisionalRecord({
    accessibleSummary: "All six portal modules share one generated origin and the exact same timestamp.",
    id: MERGED_ORIGIN_ID,
    label: "PORTAL AUTO-FIX GENERATED STREAM",
    timestamp: MERGED_TIMESTAMP,
    timestampDisplay: "APRIL 18, 2026 · 08:22:22.222 UTC",
  }),
  modules,
  notice: NOTICE,
  processes: [
    provisionalRecord({
      displayName: "PORTAL AUTO-FIX AI",
      id: PORTAL_PROCESS_ID,
      relationship: "parent local merge job routed to ai_repair_service",
      upstreamServiceId: "ai_repair_service",
    }),
    provisionalRecord({
      displayName: "AUTO-LAYOUT",
      id: BLOCKED_PROCESS_ID,
      relationship: "child retry job routed through the parent portal merge",
      upstreamServiceId: "ai_repair_service",
    }),
  ],
  status: "canonical-runtime-fixture",
  unitAssignments: [
    provisionalRecord({ moduleIds: modules.slice(0, 2).map(({ id }) => id), unitId: "news_weather_sorted" }),
    provisionalRecord({ moduleIds: modules.slice(2, 4).map(({ id }) => id), unitId: "finance_sports_sorted" }),
    provisionalRecord({ moduleIds: modules.slice(4, 6).map(({ id }) => id), unitId: "mail_sponsored_sorted" }),
    provisionalRecord({ moduleIds: modules.slice(0, 2).map(({ id }) => id), unitId: "news_weather_channels" }),
    provisionalRecord({ moduleIds: modules.slice(2, 4).map(({ id }) => id), unitId: "finance_sports_channels" }),
    provisionalRecord({ moduleIds: modules.slice(4, 6).map(({ id }) => id), unitId: "mail_sponsored_channels" }),
  ],
}));

export const YAHUH_PROVISIONAL_NOTICE = NOTICE;
