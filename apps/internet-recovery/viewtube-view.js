import {
  VIEWTUBE_ASSETS,
  VIEWTUBE_ASSET_IDS,
  VIEWTUBE_COPY_IDS,
  VIEWTUBE_PROVISIONAL_FIXTURE,
  getViewTubeCopy,
} from "./viewtube-copy.js";
import { VIEWTUBE_RESTORE_UNITS, VIEWTUBE_TRACK_UNITS } from "./viewtube-rules.js";
import {
  VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
  normalizeViewTubeState,
} from "./viewtube-state.js";

const freezeDeep = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
};

const hiddenValue = (label) => ({ display: `${label} HIDDEN`, visible: false });
const visibleValue = (display) => ({ display, visible: true });

function buildFrameStrip(framesRestored, midpointDiscovered, footageVerified) {
  if (midpointDiscovered) {
    return VIEWTUBE_PROVISIONAL_FIXTURE.duplicatePlaybacks.map((playback) => ({
      accessibleSummary: `Playback ${playback.playbackNumber} repeats media hash ${playback.mediaHash} from origin ${playback.originId}.`,
      duplicate: true,
      id: playback.id,
      mediaHash: playback.mediaHash,
      originId: playback.originId,
      quarantined: footageVerified,
      timestampSeconds: VIEWTUBE_PROVISIONAL_FIXTURE.autoplayLoop.startSeconds,
    }));
  }
  if (framesRestored) {
    return VIEWTUBE_PROVISIONAL_FIXTURE.frames.map((frame) => ({
      accessibleSummary: `${frame.timestampSeconds} seconds: ${frame.description}`,
      description: frame.description,
      duplicate: false,
      id: frame.id,
      quarantined: false,
      timestampSeconds: frame.timestampSeconds,
    }));
  }
  return Array.from({ length: 4 }, (_, index) => ({
    accessibleSummary: `Corrupted frame ${index + 1}; identity and timestamp unavailable.`,
    description: "FRAME BUFFER REPEATED",
    duplicate: true,
    id: `viewtube.frame.corrupted.${index + 1}`,
    quarantined: false,
    timestampSeconds: null,
  }));
}

export function getViewTubeCampaignView(campaignState, { reducedMotion = false } = {}) {
  const state = normalizeViewTubeState(campaignState);
  const completed = new Set(state.completedUnitIds);
  const identityRestored = completed.has("recording_identity");
  const framesRestored = completed.has("distinct_frames");
  const transcriptRestored = completed.has("transcript_track");
  const sourceRestored = completed.has("source_context");
  const footageVerified = completed.has("footage_track_verified");
  const transcriptVerified = completed.has("transcript_track_verified");
  const sourceVerified = completed.has("source_track_verified");
  const fixture = VIEWTUBE_PROVISIONAL_FIXTURE;
  const frameStrip = buildFrameStrip(
    framesRestored,
    state.midpointDiscovered && !footageVerified,
    footageVerified,
  );
  const savedOriginalFrameStrip = framesRestored
    ? fixture.frames.map((frame) => ({
        accessibleSummary: `${frame.timestampSeconds} seconds: ${frame.description}`,
        description: frame.description,
        duplicate: false,
        id: frame.id,
        timestampSeconds: frame.timestampSeconds,
      }))
    : [];
  const recording = {
    accessibleSummary: fixture.recording.accessibleSummary,
    creator: identityRestored ? visibleValue(fixture.recording.creator) : hiddenValue("CREATOR"),
    date: identityRestored ? visibleValue(fixture.recording.dateDisplay) : hiddenValue("DATE"),
    duration: framesRestored ? visibleValue(fixture.recording.durationDisplay) : hiddenValue("DURATION"),
    id: fixture.recording.id,
    title: identityRestored ? visibleValue(fixture.recording.title) : hiddenValue("TITLE"),
  };
  const transcript = {
    label: "SITE TRANSCRIPT (NOT READING PASSAGE)",
    segments: transcriptRestored
      ? fixture.transcript.map((segment) => ({
          id: segment.id,
          linkedToOriginal: transcriptVerified,
          originalRecordingId: transcriptVerified ? fixture.recording.id : null,
          text: segment.text,
          timingVerified: transcriptVerified,
          timestampSeconds: segment.timestampSeconds,
        }))
      : [],
    visible: transcriptRestored,
  };
  const sourcePanel = {
    records: sourceRestored
      ? fixture.sourceRecords.map(({ id, label, summary }) => ({
          id,
          label,
          separatedFromRecommendations: sourceVerified,
          summary,
          verified: sourceVerified,
        }))
      : [],
    visible: sourceRestored,
  };
  const restoreTimeline = VIEWTUBE_RESTORE_UNITS.map((unit) => ({
    label: unit.visibleRepair,
    saved: completed.has(unit.unitId),
    unitId: unit.unitId,
  }));
  const evidenceTracks = VIEWTUBE_TRACK_UNITS.map((unit, index) => ({
    id: fixture.evidenceTracks[index].id,
    kind: fixture.evidenceTracks[index].kind,
    label: fixture.evidenceTracks[index].label,
    unitId: unit.unitId,
    verified: completed.has(unit.unitId),
  }));
  const midpointProof = state.midpointDiscovered
    ? [
        `PLAYBACKS: ${fixture.autoplayLoop.playbackCount}`,
        `DISTINCT MEDIA HASHES: ${fixture.autoplayLoop.distinctMediaHashCount}`,
        `NEW EVIDENCE: ${fixture.autoplayLoop.newEvidenceCount}`,
      ]
    : [];
  const headerStatus = state.secured
    ? getViewTubeCopy(VIEWTUBE_COPY_IDS.secureStatus)
    : state.midpointDiscovered
      ? "AUTOPLAY CORROBORATION DETECTED"
      : getViewTubeCopy(VIEWTUBE_COPY_IDS.corruptStatus);

  return freezeDeep({
    act: state.act,
    ariaDescription: `ViewTube structural campaign. ${state.completedUnitIds.length} of 7 authored units saved. ${headerStatus}. Silent player; microphone off; no reading score.`,
    audio: {
      autoplay: false,
      hasAudioElement: false,
      microphoneBoundary: "silent-during-reading",
      muted: true,
    },
    comments: fixture.comments.map(({ id, text }) => ({ id, text })),
    fixture: {
      fixtureId: fixture.fixtureId,
      notice: fixture.notice,
      status: fixture.status,
    },
    frameStrip,
    headerStatus,
    identity: {
      mark: VIEWTUBE_ASSETS[VIEWTUBE_ASSET_IDS.mark],
      name: getViewTubeCopy(VIEWTUBE_COPY_IDS.name),
      tagline: getViewTubeCopy(VIEWTUBE_COPY_IDS.tagline),
    },
    midpoint: {
      acknowledged: state.midpointAcknowledged,
      actionLabel: state.midpointDiscovered ? getViewTubeCopy(VIEWTUBE_COPY_IDS.midpointAction) : null,
      actionRequired: state.midpointDiscovered && !state.midpointAcknowledged,
      amy: state.midpointDiscovered ? getViewTubeCopy(VIEWTUBE_COPY_IDS.midpointAmy) : null,
      body: state.midpointDiscovered ? getViewTubeCopy(VIEWTUBE_COPY_IDS.midpointBody) : null,
      chinmay: state.midpointDiscovered ? getViewTubeCopy(VIEWTUBE_COPY_IDS.midpointChinmay) : null,
      discovered: state.midpointDiscovered,
      duplicatePlaybacks: state.midpointDiscovered
        ? fixture.duplicatePlaybacks.map((playback) => ({
            accessibleSummary: `Playback ${playback.playbackNumber} repeats media hash ${playback.mediaHash} from origin ${playback.originId}.`,
            duplicate: true,
            id: playback.id,
            mediaHash: playback.mediaHash,
            originId: playback.originId,
            quarantined: footageVerified,
            timestampSeconds: fixture.autoplayLoop.startSeconds,
          }))
        : [],
      mediaHash: state.midpointDiscovered ? fixture.autoplayLoop.mediaHash : null,
      originalFrameStrip: state.midpointDiscovered ? savedOriginalFrameStrip : [],
      originId: state.midpointDiscovered ? fixture.autoplayLoop.originId : null,
      proof: midpointProof,
      technoAsset: state.midpointDiscovered ? VIEWTUBE_ASSETS[VIEWTUBE_ASSET_IDS.technoMidpoint] : null,
      title: state.midpointDiscovered ? getViewTubeCopy(VIEWTUBE_COPY_IDS.midpointTitle) : null,
    },
    motion: {
      mode: reducedMotion ? "static-duplicate-badges" : "single-visual-loop",
      reduced: Boolean(reducedMotion),
    },
    progress: {
      completedUnitCount: state.completedUnitIds.length,
      evidenceTracks,
      requiredReadingCount: 7,
      restoreCompletedCount: restoreTimeline.filter(({ saved }) => saved).length,
      restoreTimeline,
      trackCompletedCount: evidenceTracks.filter(({ verified }) => verified).length,
      visibleCountLabel: `${state.completedUnitIds.length} / 7 VIDEO REPAIRS`,
      phase: state.completedUnitIds.length < VIEWTUBE_RESTORE_UNITS.length
        ? { completed: restoreTimeline.filter(({ saved }) => saved).length, label: "RESTORE VIDEO CONTEXT", total: VIEWTUBE_RESTORE_UNITS.length }
        : { completed: evidenceTracks.filter(({ verified }) => verified).length, label: "VERIFY EVIDENCE TRACKS", total: VIEWTUBE_TRACK_UNITS.length },
    },
    readingGate: {
      countLabel: getViewTubeCopy(VIEWTUBE_COPY_IDS.readingGateCount),
      microphone: "off",
      microphoneLabel: getViewTubeCopy(VIEWTUBE_COPY_IDS.readingGateMicrophone),
      plannedCount: 10,
      requiredFirstRun: 7,
      scoreCreated: false,
      scoreLabel: getViewTubeCopy(VIEWTUBE_COPY_IDS.readingGateScore),
      selectableCount: 0,
      structuredCandidateCount: 1,
    },
    recommendations: fixture.recommendations.map(({ id, label }) => ({
      id,
      label,
      separatedFromEvidence: sourceVerified,
    })),
    recording,
    ruleBody: state.midpointDiscovered
      ? getViewTubeCopy(VIEWTUBE_COPY_IDS.repairBody)
      : getViewTubeCopy(VIEWTUBE_COPY_IDS.corruptBody),
    ruleLabel: state.midpointDiscovered
      ? getViewTubeCopy(VIEWTUBE_COPY_IDS.repairHeadline)
      : getViewTubeCopy(VIEWTUBE_COPY_IDS.corruptHeadline),
    secured: state.secured,
    securedPayoff: state.secured
      ? {
          amy: getViewTubeCopy(VIEWTUBE_COPY_IDS.completionAmy),
          blockedWrite: {
            ...VIEWTUBE_PROVISIONAL_BLOCKED_WRITE_RECORD,
            actorDisplayName: fixture.process.displayName,
            targetDisplayName: fixture.blockedCloneTarget.label,
          },
          body: getViewTubeCopy(VIEWTUBE_COPY_IDS.secureBody),
          chinmay: getViewTubeCopy(VIEWTUBE_COPY_IDS.completionChinmay),
          evidence: { ...VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD },
          status: getViewTubeCopy(VIEWTUBE_COPY_IDS.secureStatus),
          title: getViewTubeCopy(VIEWTUBE_COPY_IDS.completionTitle),
          technoAlt: getViewTubeCopy(VIEWTUBE_COPY_IDS.technoAlt),
          technoAsset: VIEWTUBE_ASSETS[VIEWTUBE_ASSET_IDS.technoSecured],
          technoLabel: getViewTubeCopy(VIEWTUBE_COPY_IDS.technoLabel),
        }
      : null,
    sourcePanel,
    sponsorship: sourceRestored
      ? { ...fixture.sponsorship, visible: true }
      : { id: null, label: "SPONSORSHIP HIDDEN", sponsored: null, visible: false },
    stateId: state.stateId,
    transcript,
  });
}
