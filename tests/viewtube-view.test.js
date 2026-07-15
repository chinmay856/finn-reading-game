import assert from "node:assert/strict";
import test from "node:test";

import { calculateViewTubeReadingOutcome } from "../apps/internet-recovery/viewtube-rules.js";
import {
  acknowledgeViewTubeMidpointState,
  advanceViewTubeState,
  normalizeViewTubeState,
} from "../apps/internet-recovery/viewtube-state.js";
import { getViewTubeCampaignView } from "../apps/internet-recovery/viewtube-view.js";

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.isFrozen(value), true);
  for (const child of Object.values(value)) assertDeepFrozen(child);
}

function advance(state, ordinal) {
  const transition = advanceViewTubeState(state, {
    completedAt: `2026-07-12T09:00:0${ordinal}.000Z`,
    outcome: calculateViewTubeReadingOutcome({ campaignState: state }),
    passageId: `viewtube-passage-${ordinal}`,
    sessionId: `viewtube-session-${ordinal}`,
  });
  assert.equal(transition.ok, true);
  return transition.state;
}

function buildState(unitCount) {
  let state = normalizeViewTubeState();
  for (let ordinal = 1; ordinal <= unitCount; ordinal += 1) {
    if (ordinal === 5 && !state.midpointAcknowledged) {
      state = acknowledgeViewTubeMidpointState(state, {
        acknowledgedAt: "2026-07-12T09:00:04.500Z",
      }).state;
    }
    state = advance(state, ordinal);
  }
  return state;
}

test("the corrupted ViewTube view is silent, exact, and contains no percentage", () => {
  const view = getViewTubeCampaignView(normalizeViewTubeState());
  assertDeepFrozen(view);
  assert.equal(view.stateId, "viewtube_corrupted");
  assert.equal(view.ruleLabel, "WATCH TIME PROVES TRUTH");
  assert.equal(view.recording.title.visible, false);
  assert.equal(view.recording.creator.visible, false);
  assert.equal(view.frameStrip.length, 4);
  assert.ok(view.frameStrip.every(({ duplicate }) => duplicate));
  assert.equal(view.transcript.visible, false);
  assert.equal(view.transcript.label, "SITE TRANSCRIPT (NOT READING PASSAGE)");
  assert.equal(view.sourcePanel.visible, false);
  assert.equal(view.midpoint.title, null);
  assert.equal(view.midpoint.body, null);
  assert.equal(view.midpoint.amy, null);
  assert.equal(view.midpoint.chinmay, null);
  assert.doesNotMatch(JSON.stringify(view), /AUTOPLAY CORROBORATION|file hashes match|one source in ten costumes/iu);
  assert.equal(view.audio.autoplay, false);
  assert.equal(view.audio.hasAudioElement, false);
  assert.equal(view.readingGate.microphone, "off");
  assert.equal(view.readingGate.scoreCreated, false);
  assert.equal(view.readingGate.requiredFirstRun, 7);
  assert.doesNotMatch(JSON.stringify(view), /percentage|\d+%/iu);
});

test("four restore units progressively reveal recording context before the saved midpoint", () => {
  const identity = getViewTubeCampaignView(buildState(1));
  assert.equal(identity.recording.title.visible, true);
  assert.equal(identity.recording.creator.visible, true);
  assert.equal(identity.recording.duration.visible, false);
  assert.equal(identity.transcript.visible, false);

  const frames = getViewTubeCampaignView(buildState(2));
  assert.equal(frames.recording.duration.visible, true);
  assert.equal(frames.frameStrip.length, 6);
  assert.ok(frames.frameStrip.every(({ duplicate }) => !duplicate));

  const transcript = getViewTubeCampaignView(buildState(3));
  assert.equal(transcript.transcript.visible, true);
  assert.equal(transcript.transcript.segments.length, 4);
  assert.equal(transcript.sourcePanel.visible, false);

  const midpoint = getViewTubeCampaignView(buildState(4));
  assert.equal(midpoint.sourcePanel.visible, true);
  assert.equal(midpoint.midpoint.actionRequired, true);
  assert.equal(midpoint.midpoint.duplicatePlaybacks.length, 10);
  assert.equal(midpoint.midpoint.originalFrameStrip.length, 6);
  assert.deepEqual(midpoint.midpoint.proof, [
    "PLAYBACKS: 10",
    "DISTINCT MEDIA HASHES: 1",
    "NEW EVIDENCE: 0",
  ]);
  assert.equal(new Set(midpoint.midpoint.duplicatePlaybacks.map(({ mediaHash }) => mediaHash)).size, 1);
  assert.equal(new Set(midpoint.midpoint.duplicatePlaybacks.map(({ originId }) => originId)).size, 1);
});

test("three evidence-track units verify distinct tracks and end with provisional slot-six evidence", () => {
  const footage = getViewTubeCampaignView(buildState(5));
  assert.deepEqual(footage.progress.evidenceTracks.map(({ verified }) => verified), [true, false, false]);
  assert.equal(footage.frameStrip.length, 6);
  assert.ok(footage.frameStrip.every(({ duplicate, quarantined }) => !duplicate && !quarantined));
  assert.ok(footage.midpoint.duplicatePlaybacks.every(({ quarantined }) => quarantined));

  const transcript = getViewTubeCampaignView(buildState(6));
  assert.deepEqual(transcript.progress.evidenceTracks.map(({ verified }) => verified), [true, true, false]);
  assert.ok(transcript.transcript.segments.every(({ linkedToOriginal, originalRecordingId, timingVerified }) => linkedToOriginal && originalRecordingId && timingVerified));

  const secured = getViewTubeCampaignView(buildState(7));
  assert.equal(secured.secured, true);
  assert.deepEqual(secured.progress.evidenceTracks.map(({ verified }) => verified), [true, true, true]);
  assert.ok(secured.recommendations.every(({ separatedFromEvidence }) => separatedFromEvidence));
  assert.ok(secured.sourcePanel.records.every(({ separatedFromRecommendations }) => separatedFromRecommendations));
  assert.equal(secured.securedPayoff.status, "EVIDENCE TRACKS RESTORED");
  assert.equal(secured.securedPayoff.blockedWrite.label, "DUPLICATE FRAMES - NO NEW EVIDENCE");
  assert.equal(secured.securedPayoff.blockedWrite.actorDisplayName, "VIDEO AUTO-FIX AI");
  assert.equal(secured.securedPayoff.evidence.slot, 6);
  assert.equal(secured.securedPayoff.evidence.canonical, true);
  assert.equal(secured.securedPayoff.evidence.eligibleForCanonicalCount, true);
});

test("reduced motion changes only presentation metadata", () => {
  const state = buildState(4);
  const animated = getViewTubeCampaignView(state, { reducedMotion: false });
  const reduced = getViewTubeCampaignView(state, { reducedMotion: true });
  assert.equal(animated.motion.mode, "single-visual-loop");
  assert.equal(reduced.motion.mode, "static-duplicate-badges");
  assert.deepEqual(
    { ...animated, motion: null },
    { ...reduced, motion: null },
  );
});

test("ViewTube progress follows seven actual repairs and explains the evidence turn", () => {
  const beforeMidpoint = getViewTubeCampaignView(buildState(3));
  assert.deepEqual(beforeMidpoint.progress.phase, { completed: 3, label: "RESTORE VIDEO CONTEXT", total: 4 });
  assert.equal(beforeMidpoint.progress.visibleCountLabel, "3 / 7 VIDEO REPAIRS");

  const midpoint = getViewTubeCampaignView(buildState(4));
  assert.deepEqual(midpoint.progress.phase, { completed: 0, label: "VERIFY EVIDENCE TRACKS", total: 3 });
  assert.match(midpoint.midpoint.amy, /creator, frames, transcript, and source context are restored/iu);
  assert.match(midpoint.midpoint.amy, /file hashes match, proving every replay is the same clip/iu);

  const secured = getViewTubeCampaignView(buildState(7));
  assert.match(secured.securedPayoff.amy, /stopped duplicate loops/iu);
  assert.match(secured.securedPayoff.chinmay, /no longer ten witnesses/iu);
});
