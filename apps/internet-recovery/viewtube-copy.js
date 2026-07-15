const freezeDeep = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
};

export const VIEWTUBE_COPY_IDS = Object.freeze({
  corruptBody: "site.viewtube.corrupt.body",
  corruptHeadline: "site.viewtube.corrupt.headline",
  corruptStatus: "site.viewtube.corruptStatus",
  completionAmy: "site.viewtube.completion.amy",
  completionChinmay: "site.viewtube.completion.chinmay",
  completionTitle: "site.viewtube.completion.title",
  evidenceTitle: "site.viewtube.secure.evidenceTitle",
  midpointAction: "site.viewtube.midpoint.action",
  midpointAmy: "site.viewtube.midpoint.amy",
  midpointBody: "site.viewtube.midpoint.body",
  midpointChinmay: "site.viewtube.midpoint.chinmay",
  midpointTitle: "site.viewtube.midpoint.title",
  name: "site.viewtube.name",
  readingGateCount: "site.viewtube.readingGate.count",
  readingGateMicrophone: "site.viewtube.readingGate.microphone",
  readingGateScore: "site.viewtube.readingGate.score",
  repairBody: "site.viewtube.repair.body",
  repairHeadline: "site.viewtube.repair.headline",
  secureBody: "site.viewtube.secure.body",
  secureDenial: "site.viewtube.secure.denial",
  secureStatus: "site.viewtube.secureStatus",
  tagline: "site.viewtube.tagline",
  technoAlt: "site.viewtube.secure.technoAlt",
  technoLabel: "site.viewtube.secure.technoLabel",
});

export const VIEWTUBE_COPY = freezeDeep({
  [VIEWTUBE_COPY_IDS.corruptBody]: "The clip repeated the longest is the most verified. Ten copies of one video now count as ten sources.",
  [VIEWTUBE_COPY_IDS.corruptHeadline]: "WATCH TIME PROVES TRUTH",
  [VIEWTUBE_COPY_IDS.corruptStatus]: "WATCH TIME PROVES TRUTH",
  [VIEWTUBE_COPY_IDS.completionAmy]: "You restored the video's context, separated the footage, transcript, and source tracks, and stopped duplicate loops from pretending to be new evidence.",
  [VIEWTUBE_COPY_IDS.completionChinmay]: "Ten plays are still excellent engagement. They are no longer ten witnesses. I have updated the slide deck.",
  [VIEWTUBE_COPY_IDS.completionTitle]: "VIEWTUBE CAN TELL A REPLAY FROM A SOURCE",
  [VIEWTUBE_COPY_IDS.evidenceTitle]: "VIEWTUBE / DUPLICATE MEDIA HASHES",
  [VIEWTUBE_COPY_IDS.midpointAction]: "Keep the restored context and separate its evidence tracks",
  [VIEWTUBE_COPY_IDS.midpointAmy]: "The creator, frames, transcript, and source context are restored. The file hashes match, proving every replay is the same clip; separate the evidence tracks and quarantine the loop.",
  [VIEWTUBE_COPY_IDS.midpointBody]: "VIDEO AUTO-FIX AI counted the same clip every time it looped. Result: one source in ten costumes.",
  [VIEWTUBE_COPY_IDS.midpointChinmay]: "The confirmation count was very high. I am now learning what it was counting. Please separate the evidence tracks.",
  [VIEWTUBE_COPY_IDS.midpointTitle]: "AUTOPLAY CORROBORATION",
  [VIEWTUBE_COPY_IDS.name]: "ViewTube",
  [VIEWTUBE_COPY_IDS.readingGateCount]: "10 PLANNED - 1 STRUCTURED CANDIDATE - 0 SELECTABLE - 7 REQUIRED",
  [VIEWTUBE_COPY_IDS.readingGateMicrophone]: "MIC: OFF",
  [VIEWTUBE_COPY_IDS.readingGateScore]: "NO READING SCORE",
  [VIEWTUBE_COPY_IDS.repairBody]: "Videos become more useful when viewers can inspect the creator, date, transcript, source links, sponsorship, and independent evidence.",
  [VIEWTUBE_COPY_IDS.repairHeadline]: "A GOOD VIDEO STILL NEEDS CONTEXT",
  [VIEWTUBE_COPY_IDS.secureBody]: "Footage track: distinct. Transcript track: connected. Source track: visible.",
  [VIEWTUBE_COPY_IDS.secureDenial]: "DUPLICATE FRAMES - NO NEW EVIDENCE",
  [VIEWTUBE_COPY_IDS.secureStatus]: "EVIDENCE TRACKS RESTORED",
  [VIEWTUBE_COPY_IDS.tagline]: "A good video still needs context.",
  [VIEWTUBE_COPY_IDS.technoAlt]: "Techno paws the silent autoplay control off beside the duplicate-frame warning.",
  [VIEWTUBE_COPY_IDS.technoLabel]: "AUTOPLAY: OFF",
});

export function getViewTubeCopy(id) {
  if (!Object.hasOwn(VIEWTUBE_COPY, id)) throw new RangeError(`Unknown ViewTube copy ID: ${id}`);
  return VIEWTUBE_COPY[id];
}

export const VIEWTUBE_ASSET_IDS = Object.freeze({
  mark: "viewtube.mark",
  technoMidpoint: "viewtube.techno.suspicious-file",
  technoSecured: "viewtube.techno.clue-point",
});

export const VIEWTUBE_ASSETS = Object.freeze({
  [VIEWTUBE_ASSET_IDS.mark]: new URL("./art/site-assets/marks/viewtube-mark.svg", import.meta.url).href,
  [VIEWTUBE_ASSET_IDS.technoMidpoint]: new URL("./art/characters/techno/techno-suspicious-file.webp", import.meta.url).href,
  [VIEWTUBE_ASSET_IDS.technoSecured]: new URL("./art/characters/techno/techno-paw-alert-still.webp", import.meta.url).href,
});

const fixtureFlags = Object.freeze({
  canonical: true,
  eligibleForCanonicalCount: true,
  provisional: false,
  registryStatus: "canonical-runtime-fixture",
  testOnly: false,
});

export const VIEWTUBE_PROVISIONAL_PROCESS_ID = "viewtube-process-video-autofix-01";
export const VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID = "viewtube-segment-final-eight-01";

const frame = (id, timestampSeconds, description) => ({
  ...fixtureFlags,
  accessibleSummary: `${timestampSeconds} seconds: ${description}`,
  description,
  id,
  timestampSeconds,
});

export const VIEWTUBE_PROVISIONAL_FIXTURE = freezeDeep({
  ...fixtureFlags,
  fixtureId: "viewtube-fixture-winter-signal-01",
  notice: "Canonical fictional silent-video fixture. Reading passages remain review-gated.",
  status: "canonical-runtime-fixture",
  process: {
    ...fixtureFlags,
    aliasResolution: "local media job routed to ai_repair_service",
    displayName: "VIDEO AUTO-FIX AI",
    id: VIEWTUBE_PROVISIONAL_PROCESS_ID,
    upstreamServiceId: "ai_repair_service",
  },
  recording: {
    ...fixtureFlags,
    accessibleSummary: "A fictional 46-second fixed-camera recording of a light trace crossing a winter sky; the recording does not identify the trace's cause.",
    creator: "Northwind Field Archive",
    dateDisplay: "FEBRUARY 14, 2026",
    dateIso: "2026-02-14T19:42:00.000Z",
    durationDisplay: "00:46",
    durationSeconds: 46,
    id: "viewtube-recording-winter-signal-01",
    title: "A Signal Crosses the Winter Sky",
    timezone: "UTC",
  },
  savedContextSnapshotId: "viewtube-snapshot-context-before-loop-01",
  frames: [
    frame("viewtube-frame-01", 0, "A dark observation shelter beneath a clear winter sky."),
    frame("viewtube-frame-02", 8, "A narrow pale streak enters from the left edge."),
    frame("viewtube-frame-03", 16, "The streak crosses above the shelter roof."),
    frame("viewtube-frame-04", 24, "The observer marks the streak's direction on a paper grid."),
    frame("viewtube-frame-05", 32, "The streak fades while the instrument clock remains visible."),
    frame("viewtube-frame-06", 38, "The final eight-second segment begins with the fading streak."),
  ],
  transcript: [
    { ...fixtureFlags, id: "viewtube-transcript-01", text: "The camera is fixed on the northern horizon.", timestampSeconds: 2 },
    { ...fixtureFlags, id: "viewtube-transcript-02", text: "A short light trace crosses the frame from west to east.", timestampSeconds: 11 },
    { ...fixtureFlags, id: "viewtube-transcript-03", text: "The observation grid records direction, not identity.", timestampSeconds: 25 },
    { ...fixtureFlags, id: "viewtube-transcript-04", text: "The last eight seconds repeat the same fading trace.", timestampSeconds: 38 },
  ],
  sourceRecords: [
    { ...fixtureFlags, id: "viewtube-source-camera-log-01", label: "FIXED CAMERA LOG", summary: "Recording settings and clock reference." },
    { ...fixtureFlags, id: "viewtube-source-weather-log-01", label: "FIELD WEATHER LOG", summary: "Visibility and cloud-cover note." },
    { ...fixtureFlags, id: "viewtube-source-observer-grid-01", label: "OBSERVER DIRECTION GRID", summary: "Direction marks with no causal claim." },
  ],
  sponsorship: {
    ...fixtureFlags,
    id: "viewtube-sponsorship-none-01",
    label: "NOT SPONSORED",
    sponsored: false,
  },
  recommendations: [
    { ...fixtureFlags, id: "viewtube-recommendation-01", label: "buffering toast, part 1" },
    { ...fixtureFlags, id: "viewtube-recommendation-02", label: "buffering toast, part 2" },
    { ...fixtureFlags, id: "viewtube-recommendation-03", label: "buffering toast, documentary edition" },
    { ...fixtureFlags, id: "viewtube-recommendation-04", label: "the same final eight seconds again" },
  ],
  comments: [
    { ...fixtureFlags, id: "viewtube-comment-01", text: "Is this a new angle or the same loop?" },
    { ...fixtureFlags, id: "viewtube-comment-02", text: "The source panel should say what the recording can and cannot prove." },
  ],
  autoplayLoop: {
    ...fixtureFlags,
    accessibleSummary: "Ten playback records all point to one original media hash and add no independent evidence.",
    distinctMediaHashCount: 1,
    endSeconds: 46,
    mediaHash: "vt-media-4f7c1a",
    newEvidenceCount: 0,
    originId: "viewtube-origin-recording-01",
    playbackCount: 10,
    segmentId: VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID,
    startSeconds: 38,
  },
  finalEightSecondSegment: {
    ...fixtureFlags,
    accessibleSummary: "The final eight seconds show the same fading trace and are the only segment cloned by the autoplay process.",
    endSeconds: 46,
    id: VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID,
    startSeconds: 38,
  },
  duplicatePlaybacks: Array.from({ length: 10 }, (_, index) => ({
    ...fixtureFlags,
    id: `viewtube-playback-${String(index + 1).padStart(2, "0")}`,
    mediaHash: "vt-media-4f7c1a",
    originId: "viewtube-origin-recording-01",
    playbackNumber: index + 1,
  })),
  evidenceTracks: [
    { ...fixtureFlags, accessibleSummary: "Ten playbacks share one original hash.", id: "viewtube-track-footage-01", kind: "footage", label: "FOOTAGE", linkedRecordIds: ["viewtube-origin-recording-01"], verifiedUnitId: "footage_track_verified" },
    { ...fixtureFlags, accessibleSummary: "All transcript links target the original recording.", id: "viewtube-track-transcript-01", kind: "transcript", label: "TRANSCRIPT", linkedRecordIds: ["viewtube-recording-winter-signal-01"], verifiedUnitId: "transcript_track_verified" },
    { ...fixtureFlags, accessibleSummary: "Three context sources remain distinct from recommendations.", id: "viewtube-track-source-01", kind: "source", label: "SOURCE", linkedRecordIds: ["viewtube-source-camera-log-01", "viewtube-source-weather-log-01", "viewtube-source-observer-grid-01"], verifiedUnitId: "source_track_verified" },
  ],
  unitAssignments: [
    { ...fixtureFlags, accessibleResult: "Recording title, creator, date, timezone, and duration become visible.", recordIds: ["viewtube-recording-winter-signal-01"], unitId: "recording_identity" },
    { ...fixtureFlags, accessibleResult: "Six distinct timestamped frames become visible.", recordIds: Array.from({ length: 6 }, (_, index) => `viewtube-frame-0${index + 1}`), unitId: "distinct_frames" },
    { ...fixtureFlags, accessibleResult: "All four decorative transcript segments reconnect to their timestamps.", recordIds: Array.from({ length: 4 }, (_, index) => `viewtube-transcript-0${index + 1}`), unitId: "transcript_track" },
    { ...fixtureFlags, accessibleResult: "Three source-context records and the explicit sponsorship state become visible.", recordIds: ["viewtube-source-camera-log-01", "viewtube-source-weather-log-01", "viewtube-source-observer-grid-01", "viewtube-sponsorship-none-01"], unitId: "source_context" },
    { ...fixtureFlags, accessibleResult: "Ten duplicate playbacks are quarantined beneath one original footage hash.", recordIds: ["viewtube-track-footage-01", "viewtube-origin-recording-01", ...Array.from({ length: 10 }, (_, index) => `viewtube-playback-${String(index + 1).padStart(2, "0")}`)], unitId: "footage_track_verified" },
    { ...fixtureFlags, accessibleResult: "Transcript timing is verified against the original recording.", recordIds: ["viewtube-track-transcript-01", ...Array.from({ length: 4 }, (_, index) => `viewtube-transcript-0${index + 1}`)], unitId: "transcript_track_verified" },
    { ...fixtureFlags, accessibleResult: "Source evidence is separated from all recommendation records.", recordIds: ["viewtube-track-source-01", "viewtube-source-camera-log-01", "viewtube-source-weather-log-01", "viewtube-source-observer-grid-01", ...Array.from({ length: 4 }, (_, index) => `viewtube-recommendation-0${index + 1}`)], unitId: "source_track_verified" },
  ],
  blockedCloneTarget: {
    ...fixtureFlags,
    id: VIEWTUBE_PROVISIONAL_BLOCKED_TARGET_ID,
    label: "FINAL EIGHT-SECOND SEGMENT",
  },
});
