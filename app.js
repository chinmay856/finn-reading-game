import { PHOTOSYNTHESIS_PASSAGE } from "./content/wikiwhy/photosynthesis-passage.js";
import { describePassageRights } from "./content/passage-catalog.js";
import { hydrateInternetRecoveryCopy, INTERNET_RECOVERY_COPY } from "./apps/internet-recovery/copy.js";
import { alignTranscript, estimateReadingPace, hasEndEvidence, summarizeTokenMatches, tokenizeText } from "./reading-engine.js";
import { approachScrollTop, centeredGuideScrollTop, estimateGuideWordIndex } from "./reading-guide.js";
import { LocalAudioCapture } from "./speech/audio-capture.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";
import { saveSessionSummary, updateSessionComprehension } from "./reading-session-store.js";
import {
  WIKIWHY_EVIDENCE_RECORD,
  applyWikiWhyReading,
  beginWikiWhyShield,
  readWikiWhyState,
} from "./apps/internet-recovery/wikiwhy-state.js";
import {
  calculateWikiWhyReadingOutcome,
  calculateWikiWhySiteVisualPercent,
} from "./apps/internet-recovery/wikiwhy-rules.js";
import {
  advanceWikiWhyDiagnostic,
  beginWikiWhyShieldProtocol,
  readWikiWhyDiagnosticState,
  resetWikiWhyDiagnosticState,
  saveWikiWhyDiagnosticState,
} from "./apps/internet-recovery/wikiwhy-diagnostics.js";
import {
  WIKIWHY_DIALOGUES,
  getWikiWhyDialogDescriptionIds,
  isWikiWhyDialogDismissible,
} from "./apps/internet-recovery/wikiwhy-dialogues.js";
import { getIncomingSiteIds, getRecoverySite, RECOVERY_SITES } from "./apps/internet-recovery/site-catalog.js";
import { selectNextWikiWhyPassage } from "./apps/internet-recovery/wikiwhy-content.js";
import {
  THREADIT_ACT_ONE_UNITS,
  THREADIT_TRACE_UNITS,
  calculateThreadItReadingOutcome,
} from "./apps/internet-recovery/threadit-rules.js";
import {
  acknowledgeThreadItMidpoint,
  acknowledgeThreadItMidpointState,
  advanceThreadItState,
  THREADIT_EVIDENCE_ID,
  THREADIT_EVIDENCE_RECORD,
  readThreadItState,
  setThreadItOpenView,
  setThreadItOpenViewState,
} from "./apps/internet-recovery/threadit-state.js";
import { getThreadItCampaignView } from "./apps/internet-recovery/threadit-view.js";
import { selectNextThreadItPassage } from "./apps/internet-recovery/threadit-content.js";
import {
  THREADIT_ASSET_IDS,
  THREADIT_ASSETS,
  THREADIT_COPY,
  THREADIT_COPY_IDS,
  THREADIT_PROVISIONAL_FORUM_FIXTURE,
} from "./apps/internet-recovery/threadit-copy.js";
import {
  FACEPLACE_FALSE_TRACKER_UNITS,
  FACEPLACE_RECOVERY_UNITS,
  calculateFacePlaceReadingOutcome,
} from "./apps/internet-recovery/faceplace-rules.js";
import {
  FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD,
  FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
  acknowledgeFacePlaceMidpoint,
  acknowledgeFacePlaceMidpointState,
  advanceFacePlaceState,
  readFacePlaceState,
  setFacePlaceFeedMode,
  setFacePlaceFeedModeState,
} from "./apps/internet-recovery/faceplace-state.js";
import { getFacePlaceCampaignView } from "./apps/internet-recovery/faceplace-view.js";
import { selectNextFacePlacePassage } from "./apps/internet-recovery/faceplace-content.js";
import {
  FACEPLACE_PROVISIONAL_FEED_FIXTURE,
} from "./apps/internet-recovery/faceplace-copy.js";
import {
  MAPGUESS_ANCHOR_UNITS,
  MAPGUESS_REBUILD_UNITS,
  calculateMapGuessReadingOutcome,
} from "./apps/internet-recovery/mapguess-rules.js";
import {
  MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD,
  MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
  acknowledgeMapGuessMidpoint,
  acknowledgeMapGuessMidpointState,
  advanceMapGuessState,
  readMapGuessState,
  setMapGuessRouteGoal,
  setMapGuessRouteGoalState,
} from "./apps/internet-recovery/mapguess-state.js";
import { getMapGuessCampaignView } from "./apps/internet-recovery/mapguess-view.js";
import { selectNextMapGuessPassage } from "./apps/internet-recovery/mapguess-content.js";
import { summarizeHubEvidenceState } from "./apps/internet-recovery/recovery-hub-state.js";

let activePassage = PHOTOSYNTHESIS_PASSAGE;
let PARAGRAPHS = activePassage.paragraphs;
let PASSAGE = PARAGRAPHS.join(" ");
let PROFILE = activePassage.profile;
const MODEL_ID = "onnx-community/whisper-base_timestamped";
const SPEECH_LEVEL = 0.009;
const TECHNO_PROGRESS_LOOP_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-progress-push-loop.webp", import.meta.url).href;
const TECHNO_PROGRESS_STILL_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-progress-push-still.webp", import.meta.url).href;
const TECHNO_ALERT_BALL_PIN_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-alert-ball-pin.webp", import.meta.url).href;
const TECHNO_BARK_BALL_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-bark-ball.webp", import.meta.url).href;
const TECHNO_CELEBRATE_SPIN_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-celebrate-spin.webp", import.meta.url).href;
const TECHNO_SUSPICIOUS_FILE_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-suspicious-file.webp", import.meta.url).href;
const WIKIWHY_EVIDENCE_ROUTE_URL = new URL("./apps/internet-recovery/art/site-assets/wikiwhy-campaign/evidence-route-fragment-01.svg", import.meta.url).href;
const WIKIWHY_SECURED_SEAL_URL = new URL("./apps/internet-recovery/art/site-assets/wikiwhy-campaign/wikiwhy-secured-seal.svg", import.meta.url).href;
const $ = (id) => document.getElementById(id);
const capture = new LocalAudioCapture();
const requestedDevice = new URLSearchParams(location.search).get("speechDevice");
const uiPreview = new URLSearchParams(location.search).get("uiPreview");
const requestedSite = new URLSearchParams(location.search).get("site");
const requestedLaunch = new URLSearchParams(location.search).get("launch");

function availableLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function createSessionId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `reading-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const localStateStorage = availableLocalStorage();

const state = {
  busy: false, confirmedMatches: new Set(), confirmedProgress: 0, confirmedTokenIndex: 0,
  diagnostics: [], finalText: "", finishing: false, lastCheckpointAt: 0, lastSpeechAt: 0,
  guidePausedUntil: 0, guideProgress: 0, guideSpeechMs: 0,
  guideWpm: PROFILE.guide.defaultWpm, lastMonitorAt: 0,
  listening: false, modelDevice: null, monitor: null, transcriptDiagnostics: [],
  comprehension: "not-attempted", processedThroughMs: 0, repairPercent: 0, result: null,
  sessionId: null, startedAt: 0, technoTimer: null,
  diagnosticMode: false, diagnosticState: null, dialogAction: null, dialogDismissible: true, dialogReturnFocus: null,
  evidenceReceiptOpen: false,
  activeScreen: "hub", selectedSiteId: "wikiwhy", preparing: false,
  campaignEligible: true, campaignState: readWikiWhyState(localStateStorage),
  campaignPersisted: Boolean(localStateStorage), contentAvailabilityReason: null,
  contentCandidateCount: 0, resultApplied: false,
  threaditState: readThreadItState(localStateStorage),
  threaditPersisted: Boolean(localStateStorage),
  threaditDiagnosticMode: false,
  threaditDiagnosticState: readThreadItState(null),
  threaditEvidenceReceiptOpen: false,
  faceplaceState: readFacePlaceState(localStateStorage),
  faceplacePersisted: Boolean(localStateStorage),
  faceplaceDiagnosticMode: false,
  faceplaceDiagnosticState: readFacePlaceState(null),
  faceplaceEvidenceReceiptOpen: false,
  faceplaceProfilePanelOpen: false,
  faceplaceSelectedReasonCardId: null,
  faceplaceWhyOpen: false,
  faceplaceShowActOneResult: false,
  faceplaceTransitionTimer: null,
  mapguessState: readMapGuessState(localStateStorage),
  mapguessPersisted: Boolean(localStateStorage),
  mapguessDiagnosticMode: false,
  mapguessDiagnosticState: readMapGuessState(null),
  mapguessEvidenceReceiptOpen: false,
  mapguessInspectorOpen: false,
};

const recognizer = new LocalWhisperRecognizer({ onProgress(data = {}) {
  const value = Number.isFinite(data.progress) ? ` ${Math.round(data.progress)}%` : "";
  $("modelProgress").textContent = data.message || `Preparing local model${value}`;
} });

function diagnostic(type, details = {}) {
  state.diagnostics.push({ at: new Date().toISOString(), type, ...details });
  if (state.diagnostics.length > 60) state.diagnostics.shift();
}

function hydratePassage() {
  const wordCount = tokenizeText(PASSAGE).length;
  $("fileTitle").textContent = activePassage.title;
  const [firstGrade, lastGrade = firstGrade] = activePassage.profile.targetGrades;
  $("fileMeta").textContent = `${wordCount} words · ${activePassage.source.domain} · grades ${firstGrade}–${lastGrade}`;
  $("fileSource").textContent = activePassage.source.attribution;
  $("fileSourceLink").href = activePassage.source.reviewedRevisionUrl ?? activePassage.source.sourceUrl;
  const rightsView = describePassageRights(activePassage);
  $("fileLicenseLink").href = rightsView.url;
  $("fileLicenseLink").textContent = rightsView.label;
  $("fileModificationNotice").textContent = rightsView.modificationNotice ? ` · ${rightsView.modificationNotice}` : "";
  $("fileRights").hidden = false;
  $("passageTitle").textContent = activePassage.title;
  $("quizQuestion").textContent = activePassage.comprehension.prompt;
  document.querySelectorAll(".quiz button[data-choice]").forEach((button) => {
    const choice = activePassage.comprehension.choices[Number(button.dataset.choice)];
    button.textContent = choice.text;
    button.dataset.answer = choice.correct ? "1" : "0";
  });
}

function setActivePassage(passage) {
  activePassage = passage;
  PARAGRAPHS = activePassage.paragraphs;
  PASSAGE = PARAGRAPHS.join(" ");
  PROFILE = activePassage.profile;
  state.guideWpm = PROFILE.guide.defaultWpm;
  hydratePassage();
}

function selectCampaignPassage() {
  const selection = selectNextWikiWhyPassage(state.campaignState);
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function renderContentAvailabilityGate() {
  state.campaignEligible = false;
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = "Next recovered file is still under review.";
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = "Your WikiWhy campaign progress is safe. The remaining passage drafts will stay unavailable until their source, comprehension, and microphone checks are complete.";
  $("begin").disabled = true;
  $("fileTitle").textContent = "NEXT RECOVERED FILE PENDING REVIEW";
  $("fileMeta").textContent = `${state.contentCandidateCount} candidate passage${state.contentCandidateCount === 1 ? "" : "s"} · not speech-scored yet`;
  $("fileSource").textContent = "The campaign state is ready, but the next passage is still completing source, comprehension, and microphone review.";
  $("fileRights").hidden = true;
  $("modelProgress").textContent = "No draft passage will be presented as playable content. Your saved WikiWhy progress is safe.";
  show("setup");
}

function resetReadingAttempt() {
  state.busy = false;
  state.confirmedMatches = new Set();
  state.confirmedProgress = 0;
  state.confirmedTokenIndex = 0;
  state.comprehension = "not-attempted";
  state.diagnostics = [];
  state.finalText = "";
  state.finishing = false;
  state.guidePausedUntil = 0;
  state.guideProgress = 0;
  state.guideSpeechMs = 0;
  state.lastCheckpointAt = 0;
  state.lastMonitorAt = 0;
  state.lastSpeechAt = 0;
  state.listening = false;
  state.processedThroughMs = 0;
  state.repairPercent = 0;
  state.result = null;
  state.resultApplied = false;
  state.sessionId = null;
  state.startedAt = 0;
  state.transcriptDiagnostics = [];
  $("begin").disabled = false;
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = INTERNET_RECOVERY_COPY["mission.preparation.title"];
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = INTERNET_RECOVERY_COPY["mission.preparation.body"];
  $("continueResult").disabled = false;
  $("continueResult").textContent = "Continue";
  $("again").disabled = false;
  $("again").textContent = "Try this passage again";
  $("listen").disabled = false;
  $("listen").textContent = "Finish now";
  $("repairOutcome").hidden = true;
  $("payoff").hidden = true;
  $("quizFeedback").textContent = "Answer for a stronger repair, or continue without it.";
  document.querySelectorAll(".quiz button").forEach((button) => button.classList.remove("right", "wrong"));
  $("fileRights").hidden = false;
  $("modelProgress").textContent = "Your browser will ask for microphone permission next.";
  $("progressText").textContent = "0% confirmed by local transcript";
  $("readerState").textContent = INTERNET_RECOVERY_COPY["reading.ready.title"];
  $("guideStatus").textContent = `Reading guide: ${state.guideWpm} WPM · 0%`;
  renderPassage(0);
  renderCampaignMeter(state.campaignState);
}

function openNextCampaignReading() {
  hideCharacterDialog();
  const selection = selectCampaignPassage();
  if (!selection.passage) {
    renderContentAvailabilityGate();
    return false;
  }
  resetReadingAttempt();
  show("setup");
  return true;
}

function openWikiWhyExperience({ showEvidence = false } = {}) {
  renderDiagnosticPanel(state.diagnosticState ?? readWikiWhyDiagnosticState(localStateStorage));
  if (state.campaignState.phase === "secured") state.evidenceReceiptOpen = showEvidence;
  renderCampaignMeter(state.campaignState);
  if (state.campaignState.phase === "secured") {
    show("read");
    $("readerState").textContent = "WIKIWHY SECURED · UNAUTHORIZED WRITE BLOCKED";
    $("progressText").textContent = "Evidence file recovered · return to the Recovery Map to inspect Case File slot 1";
    $("listen").disabled = true;
    $("listen").textContent = "Secured";
    return;
  }
  if (state.campaignState.phase === "reverse-hack") {
    show("read");
    $("readerState").textContent = state.campaignPersisted
      ? "READINGS SAVED · EVIDENCE SAVED · BACKGROUND WRITE ISOLATED"
      : "READINGS PRESERVED IN THIS TAB · NOT SAVED FOR RELOAD";
    $("progressText").textContent = "Shield Protocol is ready to begin";
    $("listen").disabled = true;
    $("listen").textContent = "Write isolated";
    showRealRewriteSequence();
    return;
  }
  if (state.result && !state.resultApplied) {
    show("review");
    return;
  }
  openNextCampaignReading();
}

function show(name) {
  const screenChanged = state.activeScreen !== name;
  for (const id of ["hub", "sitePreview", "threadit", "faceplace", "mapguess", "setup", "read", "review"]) $(id).classList.toggle("on", id === name);
  state.activeScreen = name;
  const selectedSite = getRecoverySite(state.selectedSiteId);
  const wikiWhyScreen = ["setup", "read", "review"].includes(name);
  const threadItScreen = name === "threadit";
  const facePlaceScreen = name === "faceplace";
  const mapGuessScreen = name === "mapguess";
  const activeSiteScreen = name === "sitePreview" || wikiWhyScreen || threadItScreen || facePlaceScreen || mapGuessScreen;
  $("desktopContext").textContent = name === "hub"
    ? "RECOVERY MAP"
    : name === "sitePreview"
      ? `${selectedSite.name.toUpperCase()} PREVIEW`
      : threadItScreen
        ? "THREADIT SOURCE TRACE"
        : facePlaceScreen
          ? "FACEPLACE FEED RECOVERY"
          : mapGuessScreen
            ? "MAPGUESS ROUTE RECOVERY"
        : "WIKIWHY REPAIR";
  $("taskHub").classList.toggle("active", name === "hub");
  $("taskSite").classList.toggle("active", activeSiteScreen);
  $("taskReader").classList.toggle("active", name === "read" || name === "review" || threadItScreen || facePlaceScreen || mapGuessScreen);
  const visibleCampaignState = state.diagnosticMode && state.diagnosticState ? state.diagnosticState : state.campaignState;
  const securedWikiWhyTask = wikiWhyScreen && visibleCampaignState.phase === "secured";
  const visibleThreadItState = state.threaditDiagnosticMode ? state.threaditDiagnosticState : state.threaditState;
  const securedThreadItTask = threadItScreen && visibleThreadItState.secured;
  const visibleFacePlaceState = state.faceplaceDiagnosticMode ? state.faceplaceDiagnosticState : state.faceplaceState;
  const securedFacePlaceTask = facePlaceScreen && visibleFacePlaceState.secured;
  const visibleMapGuessState = state.mapguessDiagnosticMode ? state.mapguessDiagnosticState : state.mapguessState;
  const securedMapGuessTask = mapGuessScreen && visibleMapGuessState.secured;
  const securedSiteTask = securedWikiWhyTask || securedThreadItTask || securedFacePlaceTask || securedMapGuessTask;
  $("taskSite").classList.toggle("secured", securedSiteTask);
  if (securedWikiWhyTask) {
    $("taskSite").innerHTML = `<img src="${WIKIWHY_SECURED_SEAL_URL}" alt=""> <span>WikiWhy · SECURED</span>`;
  } else if (securedThreadItTask) {
    $("taskSite").innerHTML = `<img src="${THREADIT_ASSETS[THREADIT_ASSET_IDS.sourceStableBadge]}" alt=""> <span>ThreadIt · SECURED</span>`;
  } else if (securedFacePlaceTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("faceplace").markImage}" alt=""> <span>FacePlace · SECURED TEST</span>`;
  } else if (securedMapGuessTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("mapguess").markImage}" alt=""> <span>MapGuess · SECURED TEST</span>`;
  } else {
    $("taskSite").textContent = name === "hub" ? "□ No site open" : `□ ${wikiWhyScreen ? "WikiWhy" : selectedSite.name}`;
  }
  $("taskSite").setAttribute("aria-label", securedWikiWhyTask
    ? "WikiWhy secured"
    : securedThreadItTask
      ? "ThreadIt secured"
      : securedFacePlaceTask
        ? "FacePlace secured test"
        : securedMapGuessTask
          ? "MapGuess secured test"
      : $("taskSite").textContent);
  document.querySelectorAll(".desktop-shortcut").forEach((button) => button.classList.toggle("active", button.dataset.action === "hub" && name === "hub"));
  if (screenChanged) requestAnimationFrame(() => $(name).focus({ preventScroll: true }));
}

function renderRecoveryHub() {
  const realWikiWhy = state.campaignState;
  const diagnosticWikiWhy = state.diagnosticMode ? state.diagnosticState : null;
  const diagnosticView = diagnosticWikiWhy ? campaignView(diagnosticWikiWhy) : null;
  const realThreadIt = state.threaditState;
  const diagnosticThreadIt = state.threaditDiagnosticMode ? state.threaditDiagnosticState : null;
  const realFacePlace = state.faceplaceState;
  const diagnosticFacePlace = state.faceplaceDiagnosticMode ? state.faceplaceDiagnosticState : null;
  const realMapGuess = state.mapguessState;
  const diagnosticMapGuess = state.mapguessDiagnosticMode ? state.mapguessDiagnosticState : null;
  const evidenceSummary = summarizeHubEvidenceState({
    requiredCanonicalSiteIds: RECOVERY_SITES.map(({ id }) => id),
    sites: [
      {
        canonicalEvidenceId: WIKIWHY_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: WIKIWHY_EVIDENCE_RECORD,
        diagnosticState: diagnosticWikiWhy,
        evidenceRecord: WIKIWHY_EVIDENCE_RECORD,
        persisted: state.campaignPersisted,
        siteId: "wikiwhy",
        state: realWikiWhy,
      },
      {
        canonicalEvidenceId: THREADIT_EVIDENCE_ID,
        diagnosticEvidenceRecord: THREADIT_EVIDENCE_RECORD,
        diagnosticState: diagnosticThreadIt,
        evidenceRecord: THREADIT_EVIDENCE_RECORD,
        persisted: state.threaditPersisted,
        siteId: "threadit",
        state: realThreadIt,
      },
      {
        canonicalEvidenceId: null,
        diagnosticEvidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: diagnosticFacePlace,
        evidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
        persisted: state.faceplacePersisted,
        siteId: "faceplace",
        state: realFacePlace,
      },
      {
        canonicalEvidenceId: null,
        diagnosticEvidenceRecord: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: diagnosticMapGuess,
        evidenceRecord: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
        persisted: state.mapguessPersisted,
        siteId: "mapguess",
        state: realMapGuess,
      },
    ],
  });
  const wikiWhyEvidence = evidenceSummary.bySiteId.wikiwhy;
  const threadItEvidence = evidenceSummary.bySiteId.threadit;
  const facePlaceEvidence = evidenceSummary.bySiteId.faceplace;
  const mapGuessEvidence = evidenceSummary.bySiteId.mapguess;
  const diagnosticSecured = wikiWhyEvidence.testSecured;
  const realSecured = wikiWhyEvidence.realSecured;
  const wikiWhySecured = wikiWhyEvidence.displaySecured;
  const wikiWhyStatus = diagnosticSecured
    ? "SECURED · TEST"
    : realSecured
      ? state.campaignPersisted ? "SECURED" : "SECURED · TAB ONLY"
    : diagnosticView
      ? `${diagnosticView.label} ${diagnosticView.percent}% · TEST`
      : realWikiWhy.phase === "shield"
        ? `SHIELD ${realWikiWhy.shieldPass}/3`
        : realWikiWhy.phase === "reverse-hack"
          ? "BACKGROUND WRITE DETECTED"
      : realWikiWhy.stability > 0
        ? `SITE STABILITY ${realWikiWhy.stability}%`
        : "RECOVERY AVAILABLE";
  const visibleThreadIt = diagnosticThreadIt ?? realThreadIt;
  const threadItView = getThreadItCampaignView(visibleThreadIt);
  const diagnosticThreadItSecured = threadItEvidence.testSecured;
  const realThreadItSecured = threadItEvidence.realSecured;
  const threadItSecured = threadItEvidence.displaySecured;
  const threadItActOneCount = Math.min(
    THREADIT_ACT_ONE_UNITS.length,
    threadItView.progress.completedUnitCount,
  );
  const threadItTraceCount = Math.max(0, threadItView.progress.completedUnitCount - THREADIT_ACT_ONE_UNITS.length);
  const threadItStatus = diagnosticThreadItSecured
    ? "SOURCE TREE STABLE · TEST"
    : realThreadItSecured
      ? state.threaditPersisted ? "SOURCE TREE STABLE" : "SOURCE TREE STABLE · TAB ONLY"
      : state.threaditDiagnosticMode
        ? threadItView.midpoint.acknowledged
          ? `TRACE ${threadItTraceCount}/3 · TEST`
          : threadItView.midpoint.discovered
            ? "TRACE VIEW READY · TEST"
            : `RELATIONSHIPS ${threadItActOneCount}/4 · TEST`
        : threadItView.midpoint.acknowledged
          ? `TRACE ${threadItTraceCount}/3`
          : threadItView.midpoint.discovered
            ? "TRACE VIEW READY"
            : threadItActOneCount
              ? `RELATIONSHIPS ${threadItActOneCount}/4`
              : "CAMPAIGN TEST BUILD";
  const visibleFacePlace = diagnosticFacePlace ?? realFacePlace;
  const facePlaceCompletedCount = visibleFacePlace.completedUnitIds?.length ?? 0;
  const facePlaceRecoveryCount = Math.max(0, facePlaceCompletedCount - FACEPLACE_FALSE_TRACKER_UNITS.length);
  const facePlaceSecured = facePlaceEvidence.displaySecured;
  const facePlaceStatus = facePlaceEvidence.testSecured
    ? "FEED RECOVERY VERIFIED · TEST"
    : facePlaceEvidence.realSecured
      ? facePlaceEvidence.persistedNonCanonical
        ? "FEED RECOVERY VERIFIED · PROVISIONAL"
        : state.faceplacePersisted
          ? "FEED RECOVERY VERIFIED"
          : "FEED RECOVERY VERIFIED · TAB ONLY"
      : state.faceplaceDiagnosticMode
        ? visibleFacePlace.midpointDiscovered
          ? visibleFacePlace.midpointAcknowledged
            ? `HONEST RECOVERY ${[0, 34, 67, 100][facePlaceRecoveryCount] ?? 0}% · TEST`
            : "HONEST ZERO READY · TEST"
          : `ACT I ${facePlaceCompletedCount}/3 · TEST`
        : visibleFacePlace.midpointDiscovered
          ? visibleFacePlace.midpointAcknowledged
            ? `HONEST RECOVERY ${[0, 34, 67, 100][facePlaceRecoveryCount] ?? 0}%`
            : "HONEST ZERO READY"
          : facePlaceCompletedCount
            ? `ACT I ${facePlaceCompletedCount}/3`
            : "CAMPAIGN TEST BUILD";
  const visibleMapGuess = diagnosticMapGuess ?? realMapGuess;
  const mapGuessView = getMapGuessCampaignView(visibleMapGuess);
  const mapGuessSecured = mapGuessEvidence.displaySecured;
  const mapGuessStatus = mapGuessEvidence.testSecured
    ? "DESTINATION LOCKED · TEST"
    : mapGuessEvidence.realSecured
      ? mapGuessEvidence.persistedNonCanonical
        ? "DESTINATION LOCKED · PROVISIONAL"
        : state.mapguessPersisted
          ? "DESTINATION LOCKED"
          : "DESTINATION LOCKED · TAB ONLY"
      : state.mapguessDiagnosticMode
        ? mapGuessView.midpoint.actionRequired
          ? "MOVING TARGET · TEST"
          : mapGuessView.midpoint.acknowledged
            ? `ANCHORS ${mapGuessView.progress.anchorCompletedCount}/3 · TEST`
            : `MAP LAYERS ${mapGuessView.progress.rebuildCompletedCount}/5 · TEST`
        : mapGuessView.midpoint.actionRequired
          ? "MOVING TARGET"
          : mapGuessView.midpoint.acknowledged
            ? `ANCHORS ${mapGuessView.progress.anchorCompletedCount}/3`
            : mapGuessView.progress.rebuildCompletedCount
              ? `MAP LAYERS ${mapGuessView.progress.rebuildCompletedCount}/5`
              : "CAMPAIGN TEST BUILD";
  const incomingIds = getIncomingSiteIds({ facePlaceSecured, threadItSecured, wikiWhySecured });
  const securedCount = evidenceSummary.persistedCanonicalCount;
  $("securedSiteCount").textContent = String(securedCount);
  $("securedSiteCount").dataset.displaySecuredCount = String(evidenceSummary.displaySecuredCount);
  $("evidenceCount").textContent = `${securedCount}/10 canonical`;
  $("evidenceCount").dataset.displaySecuredCount = String(evidenceSummary.displaySecuredCount);
  $("siteGrid").innerHTML = RECOVERY_SITES.map((site) => {
    const siteSecured = (site.id === "wikiwhy" && wikiWhySecured)
      || (site.id === "threadit" && threadItSecured)
      || (site.id === "faceplace" && facePlaceSecured)
      || (site.id === "mapguess" && mapGuessSecured);
    const siteStatus = site.id === "wikiwhy"
      ? wikiWhyStatus
      : site.id === "threadit"
        ? threadItStatus
        : site.id === "faceplace"
          ? facePlaceStatus
          : site.id === "mapguess"
            ? mapGuessStatus
        : "DESIGN PREVIEW";
    const securedIcon = site.id === "wikiwhy"
      ? WIKIWHY_SECURED_SEAL_URL
      : site.id === "threadit"
        ? THREADIT_ASSETS[THREADIT_ASSET_IDS.sourceStableBadge]
        : site.markImage;
    return `
    <button class="site-card" type="button" data-site-id="${site.id}" data-playable="${site.playable}" data-runtime="${Boolean(site.runtimeAvailable)}" data-secured="${siteSecured}" aria-label="${site.name}, ${siteStatus.toLowerCase()}" style="--site-accent:${site.accent}">
      <img src="${site.previewImage}" alt="">
      <span aria-hidden="true">${siteSecured ? `<img src="${securedIcon}" alt="">` : site.mark}</span>
      <div><b>${site.name}</b><small>${siteSecured ? `✓ ${siteStatus}` : siteStatus}</small></div>
    </button>
  `;
  }).join("");
  $("incomingCases").innerHTML = incomingIds.map((siteId) => {
    const site = getRecoverySite(siteId);
    const status = site.id === "wikiwhy"
      ? wikiWhyStatus
      : site.id === "threadit"
        ? threadItStatus
        : site.id === "faceplace"
          ? facePlaceStatus
          : site.id === "mapguess"
            ? mapGuessStatus
          : "DESIGN PREVIEW";
    return `<button class="incoming-case" type="button" data-site-id="${site.id}" style="--site-accent:${site.accent}"><span>${site.mark}</span><div><b>${site.name}</b><small>${status}</small></div></button>`;
  }).join("");
  $("evidenceSlots").innerHTML = RECOVERY_SITES.map((site) => {
    if (site.id === "wikiwhy" && wikiWhySecured) {
      return `<li class="evidence-slot-recovered"><img src="${WIKIWHY_EVIDENCE_ROUTE_URL}" alt=""><div><b>WikiWhy — ${WIKIWHY_EVIDENCE_RECORD.label}${diagnosticSecured ? " · TEST" : state.campaignPersisted ? "" : " · TAB ONLY"}</b><span>${WIKIWHY_EVIDENCE_RECORD.filename}</span><span>Writer: ${WIKIWHY_EVIDENCE_RECORD.writerFingerprint} · Command: ${WIKIWHY_EVIDENCE_RECORD.commandState}</span><span>Write state: ${WIKIWHY_EVIDENCE_RECORD.writeState}</span><span>Route: ${WIKIWHY_EVIDENCE_RECORD.routeFragment}</span></div></li>`;
    }
    if (site.id === "threadit" && threadItSecured) {
      const persistenceLabel = diagnosticThreadItSecured ? " · TEST" : state.threaditPersisted ? "" : " · TAB ONLY";
      return `<li class="evidence-slot-recovered"><img src="${THREADIT_ASSETS[THREADIT_ASSET_IDS.duplicateSourceIcon]}" alt=""><div><b>ThreadIt — ${THREADIT_EVIDENCE_RECORD.label}${persistenceLabel}</b><span>${THREADIT_EVIDENCE_RECORD.filename}</span><span>What changed: ${THREADIT_EVIDENCE_RECORD.whatChanged}</span><span>AI behavior: ${THREADIT_EVIDENCE_RECORD.aiBehavior}</span><span>Writer: ${THREADIT_EVIDENCE_RECORD.writerFingerprint}</span><span>Blocked write: POSTING PAUSED: DUPLICATE SOURCE</span></div></li>`;
    }
    if (site.id === "faceplace" && facePlaceSecured) {
      const persistenceLabel = facePlaceEvidence.testSecured
        ? " · TEST"
        : facePlaceEvidence.tabOnly
          ? " · TAB ONLY"
          : " · PROVISIONAL";
      return `<li class="evidence-slot-recovered" data-provisional="true"><img src="${site.markImage}" alt=""><div><b>FacePlace — ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.label}${persistenceLabel}</b><span>${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.filename}</span><span>What changed: ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.whatChanged}</span><span>AI behavior: ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.aiBehavior}</span><span>Writer: ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.writerFingerprint ?? "PENDING DESIGNER ID"}</span><span>TEST ONLY · not registered for the final evidence unlock</span></div></li>`;
    }
    if (site.id === "mapguess" && mapGuessSecured) {
      const persistenceLabel = mapGuessEvidence.testSecured
        ? " · TEST"
        : mapGuessEvidence.tabOnly
          ? " · TAB ONLY"
          : " · PROVISIONAL";
      return `<li class="evidence-slot-recovered" data-provisional="true"><img src="${site.markImage}" alt=""><div><b>MapGuess — ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.label}${persistenceLabel}</b><span>${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.filename}</span><span>What changed: ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.whatChanged}</span><span>AI behavior: ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.aiBehavior}</span><span>Writer: ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.writerFingerprint ?? "PENDING DESIGNER ID"}</span><span>TEST ONLY · slot 10 is excluded from the final evidence unlock</span></div></li>`;
    }
    return `<li>${site.name} — awaiting evidence</li>`;
  }).join("");
  const support = $("amySupportMessage");
  if (state.selectedSiteId === "mapguess" && state.mapguessDiagnosticMode) {
    support.innerHTML = mapGuessEvidence.testSecured
      ? "<b>MapGuess secured in TEST mode.</b> Slot 10 shows a provisional moved-destination receipt. It is excluded from the final evidence unlock until the designer freezes the registry row."
      : `<b>MapGuess structural test.</b> ${mapGuessStatus}. Its candidate passage remains review-only, so every advance is simulated and creates no reading score.`;
  } else if (state.faceplaceDiagnosticMode) {
    support.innerHTML = facePlaceEvidence.testSecured
      ? "<b>FacePlace secured in TEST mode.</b> Slot 3 shows a provisional promoted-feed receipt. It is excluded from the final evidence unlock, and the next-case order still needs designer confirmation."
      : `<b>FacePlace structural test.</b> ${facePlaceStatus}. Its sampler is review-only, so every advance is simulated and creates no reading score.`;
  } else if (state.threaditDiagnosticMode) {
    support.innerHTML = diagnosticThreadItSecured
      ? "<b>ThreadIt secured in TEST mode.</b> Case File slot 2 shows the synthetic-consensus receipt. No reading score or real campaign save was created."
      : `<b>ThreadIt structural test.</b> ${threadItStatus}. Its candidate passage remains unavailable, so every advance is clearly simulated.`;
  } else if (state.diagnosticMode) {
    support.innerHTML = diagnosticSecured
      ? "<b>WikiWhy secured in TEST mode.</b> The displayed receipt is diagnostic; no reading score or real campaign save was created."
      : `<b>WikiWhy diagnostic active.</b> ${wikiWhyStatus}. No voice recording or transcript is saved.`;
  } else {
    if (mapGuessEvidence.realSecured) support.innerHTML = "<b>MapGuess is structurally secured.</b> Its slot-10 receipt remains provisional and cannot count toward the final evidence unlock until the designer freezes the fixture and evidence registry row.";
    else if (facePlaceEvidence.realSecured) support.innerHTML = "<b>FacePlace is structurally secured.</b> Its slot-3 receipt remains provisional and cannot count toward the final evidence unlock until the designer freezes the registry row.";
    else if (realThreadItSecured && state.threaditPersisted && realSecured && state.campaignPersisted) support.innerHTML = "<b>WikiWhy and ThreadIt secured.</b> Two evidence files are in Finn’s Files. FacePlace is available as a content-gated campaign test.";
    else if (realThreadItSecured && state.threaditPersisted) support.innerHTML = "<b>ThreadIt secured.</b> Its synthetic-consensus evidence is in Finn’s Files. The candidate passage gate remains closed for new scored readings.";
    else if (realThreadItSecured) support.innerHTML = "<b>ThreadIt is secured in this tab.</b> This browser did not save the evidence for reload.";
    else if (realSecured && state.campaignPersisted) support.innerHTML = "<b>WikiWhy secured.</b> Its evidence file is in Finn’s Files. ThreadIt has a complete structural campaign test; its candidate passage remains under review.";
    else if (realSecured) support.innerHTML = "<b>WikiWhy is secured in this tab.</b> This browser did not save the evidence for reload, so Finn’s Files remains unavailable.";
    else if (realWikiWhy.phase === "shield") support.innerHTML = `<b>Shield Protocol active.</b> ${3 - realWikiWhy.shieldPass} clean repair${3 - realWikiWhy.shieldPass === 1 ? "" : "s"} remain. Reviewed passages are loaded one at a time.`;
    else if (realWikiWhy.phase === "reverse-hack" && state.campaignPersisted) support.innerHTML = "<b>Background write caught.</b> Finn’s readings are saved. Open WikiWhy to start the three-pass Shield Protocol.";
    else if (realWikiWhy.phase === "reverse-hack") support.innerHTML = "<b>Background write caught in this tab.</b> The browser did not save this state for reload. Open WikiWhy to continue without losing the current tab.";
    else support.innerHTML = "<b>System healthy.</b> WikiWhy is connected. ThreadIt, FacePlace, and MapGuess have semantic campaign tests with MIC: OFF until their passage manifests clear review.";
  }
  document.querySelectorAll("[data-site-id]").forEach((button) => {
    button.onclick = () => openRecoverySite(button.dataset.siteId);
  });
}

function renderSitePreview(site) {
  state.selectedSiteId = site.id;
  $("sitePreviewWindow").dataset.siteTheme = site.id;
  $("sitePreviewWindow").style.setProperty("--site-accent", site.accent);
  $("sitePreviewTitle").textContent = `${site.name.toUpperCase()} — DESIGN PREVIEW`;
  $("sitePreviewAddress").textContent = `http://${site.id}.ir98/incoming-case`;
  $("sitePreviewMark").textContent = site.mark;
  $("sitePreviewArchetype").textContent = site.archetype.toUpperCase();
  $("sitePreviewName").textContent = site.name;
  $("sitePreviewBelief").textContent = site.belief;
  $("sitePreviewDescription").textContent = `${site.description} This is an optimized crop from the builder-ready design board; its production UI, reading content, and repair rules are not connected yet.`;
  $("sitePreviewMotif").style.backgroundImage = `url("${site.previewImage}")`;
  show("sitePreview");
}

function escapeMarkup(value) {
  return String(value ?? "").replace(/[&<>"']/gu, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

let threadItConnectorRevision = 0;
let threadItConnectorRelationships = [];

function getThreadItConnectorPath(fromElement, toElement, canvasRect) {
  const from = fromElement.getBoundingClientRect();
  const to = toElement.getBoundingClientRect();
  const fromCenter = {
    x: from.left - canvasRect.left + from.width / 2,
    y: from.top - canvasRect.top + from.height / 2,
  };
  const toCenter = {
    x: to.left - canvasRect.left + to.width / 2,
    y: to.top - canvasRect.top + to.height / 2,
  };
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const direction = Math.sign(dx) || 1;
    const startX = fromCenter.x + direction * from.width / 2;
    const endX = toCenter.x - direction * to.width / 2;
    const bend = Math.max(18, Math.abs(endX - startX) * 0.45);
    return `M ${startX} ${fromCenter.y} C ${startX + direction * bend} ${fromCenter.y}, ${endX - direction * bend} ${toCenter.y}, ${endX} ${toCenter.y}`;
  }
  const direction = Math.sign(dy) || 1;
  const startY = fromCenter.y + direction * from.height / 2;
  const endY = toCenter.y - direction * to.height / 2;
  const bend = Math.max(18, Math.abs(endY - startY) * 0.45);
  return `M ${fromCenter.x} ${startY} C ${fromCenter.x} ${startY + direction * bend}, ${toCenter.x} ${endY - direction * bend}, ${toCenter.x} ${endY}`;
}

function drawThreadItConnectors(relationships) {
  const canvas = $("threaditConnectorLayer").closest(".threadit-source-canvas");
  const canvasRect = canvas.getBoundingClientRect();
  if (!canvasRect.width || !canvasRect.height) return;
  const width = Math.max(1, canvas.scrollWidth, canvas.clientWidth);
  const height = Math.max(1, canvas.scrollHeight, canvas.clientHeight);
  $("threaditConnectorLayer").setAttribute("viewBox", `0 0 ${width} ${height}`);
  $("threaditConnectorLayer").innerHTML = relationships.flatMap((relationship) => {
    const from = document.getElementById(relationship.fromNodeId);
    const to = document.getElementById(relationship.toNodeId);
    if (!from || !to) return [];
    const path = getThreadItConnectorPath(from, to, canvasRect);
    const attributes = `data-line-style="${escapeMarkup(relationship.lineStyle)}" data-relationship="${escapeMarkup(relationship.kind)}" data-from-node-id="${escapeMarkup(relationship.fromNodeId)}" data-to-node-id="${escapeMarkup(relationship.toNodeId)}" d="${path}"`;
    const paths = [`<path class="threadit-connector" ${attributes}></path>`];
    if (relationship.lineStyle === "purple-double") {
      paths.push(`<path class="threadit-connector threadit-connector-inner" ${attributes}></path>`);
    }
    return paths;
  }).join("");
}

function scheduleThreadItConnectors(relationships) {
  threadItConnectorRelationships = relationships;
  const revision = ++threadItConnectorRevision;
  requestAnimationFrame(() => {
    if (revision === threadItConnectorRevision) drawThreadItConnectors(relationships);
  });
}

function renderThreadItPost(post, {
  chronologyRestored,
  citationRestored,
  isCorruptedTop,
  questionRestored,
} = {}) {
  const question = post.kind === "question";
  const generated = post.originType === "generated-copy";
  const avatar = generated
    ? THREADIT_ASSETS[THREADIT_ASSET_IDS.consensusBotAvatar]
    : THREADIT_ASSETS[THREADIT_ASSET_IDS.readerAvatar];
  const status = question
    ? questionRestored ? "ORIGIN FOUND" : "UNLINKED"
    : chronologyRestored ? "REPLY ORDER RESTORED" : "UNLINKED";
  const timestamp = question && !questionRestored ? "TIMESTAMP MISSING" : post.timestamp;
  const title = question ? post.title : post.authorLabel;
  const corruptedQuestion = question && !questionRestored
    ? `<em>${escapeMarkup(THREADIT_COPY[THREADIT_COPY_IDS.corruptModule3])}</em>`
    : "";
  const citation = citationRestored && post.citationId
    ? `<p class="threadit-citation"><b>ORIGIN FOUND</b><span>${escapeMarkup(THREADIT_PROVISIONAL_FORUM_FIXTURE.sources.find(({ id }) => id === post.citationId)?.text)}</span></p>`
    : "";
  const sourceWarning = generated
    ? `<span class="threadit-source-warning">${escapeMarkup(THREADIT_COPY[THREADIT_COPY_IDS.corruptModule2])}</span>`
    : "";
  return `<li class="threadit-post" data-node-type="${question ? "question" : "reply"}" data-origin="${escapeMarkup(post.originType ?? "original")}" data-corrupted-rank="${isCorruptedTop ? "top" : ""}" aria-label="${escapeMarkup(post.accessibleSummary)}">
    <div class="threadit-post-votes"><b>${escapeMarkup(post.voteCount)}</b><span>votes</span></div>
    <img class="threadit-post-avatar" src="${avatar}" alt="">
    <article class="threadit-post-main"><header class="threadit-post-meta"><div><b class="threadit-post-title">${escapeMarkup(title)}</b><span>${escapeMarkup(post.authorLabel)} · ${escapeMarkup(timestamp)}</span></div><strong class="threadit-post-status">${status}</strong></header>${corruptedQuestion}<p class="threadit-post-body">${escapeMarkup(post.body)}</p>${sourceWarning}${citation}</article>
  </li>`;
}

function renderThreadItDuplicateGroup(replies) {
  const avatar = THREADIT_ASSETS[THREADIT_ASSET_IDS.consensusBotAvatar];
  return `<li class="threadit-post threadit-duplicate-group" data-node-type="duplicate-group" data-origin="generated-copy" aria-label="Two replies disclosed as copies from one provisional generated origin.">
    <div class="threadit-post-votes"><b>${replies.length}</b><span>copies</span></div>
    <img class="threadit-post-avatar" src="${avatar}" alt="">
    <article class="threadit-post-main"><header class="threadit-post-meta"><div><b class="threadit-post-title">DUPLICATE CLAIM</b><span>SHARED ORIGIN: CONSENSUS AUTO-FIX</span></div><strong class="threadit-post-status">DUPLICATE CLAIM</strong></header><ul>${replies.map((reply) => `<li><b>${escapeMarkup(reply.authorLabel)} · ${escapeMarkup(reply.timestamp)}</b><span>${escapeMarkup(reply.body)}</span></li>`).join("")}</ul></article>
  </li>`;
}

function renderThreadItCampaign(campaignState, { diagnosticMode = false } = {}) {
  const view = getThreadItCampaignView(campaignState, {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
  const completed = new Set(view.progress.completedUnitIds);
  const questionRestored = completed.has("question_origin");
  const chronologyRestored = completed.has("reply_chronology");
  const citationRestored = completed.has("citation_origin");
  const duplicateDisclosed = completed.has("duplicate_disclosure");
  const actOneComplete = view.progress.completedUnitCount >= THREADIT_ACT_ONE_UNITS.length;
  const midpointPending = view.midpoint.discovered && !view.midpoint.acknowledged && !view.secured;
  const fixture = THREADIT_PROVISIONAL_FORUM_FIXTURE;
  const duplicateIds = new Set(fixture.duplicateGroup.replyIds);
  const duplicateReplies = fixture.replies.filter(({ id }) => duplicateIds.has(id));
  const orderedReplies = [...fixture.replies].sort((left, right) => (
    chronologyRestored
      ? left.timestamp.localeCompare(right.timestamp)
      : right.voteCount - left.voteCount
  ));
  const topReply = fixture.replies.find(({ id }) => id === fixture.corruptedTopReplyId);
  const orderedPosts = questionRestored
    ? [fixture.originalQuestion, ...orderedReplies]
    : [topReply, fixture.originalQuestion, ...orderedReplies.filter(({ id }) => id !== topReply.id)];
  const renderedPosts = [];
  let duplicateGroupRendered = false;
  for (const post of orderedPosts) {
    if (duplicateDisclosed && duplicateIds.has(post.id)) {
      if (!duplicateGroupRendered) renderedPosts.push(renderThreadItDuplicateGroup(duplicateReplies));
      duplicateGroupRendered = true;
      continue;
    }
    renderedPosts.push(renderThreadItPost(post, {
      chronologyRestored,
      citationRestored,
      isCorruptedTop: !questionRestored && post.id === topReply.id,
      questionRestored,
    }));
  }
  if (!chronologyRestored) {
    renderedPosts.push(`<li class="threadit-moderator-note">${escapeMarkup(THREADIT_COPY[THREADIT_COPY_IDS.corruptModule4])}</li>`);
  }

  const renderSourceNode = (node) => {
    const avatar = node.originType === "generated-copy"
      ? THREADIT_ASSETS[THREADIT_ASSET_IDS.consensusBotAvatar]
      : THREADIT_ASSETS[THREADIT_ASSET_IDS.readerAvatar];
    const generatedClone = node.id.startsWith("threadit-clone-");
    const cloneIndex = generatedClone ? Math.max(0, Number(node.id.slice(-2)) - 1) : 0;
    return `<li id="${escapeMarkup(node.id)}" class="threadit-source-node" data-origin="${escapeMarkup(node.originType)}" data-duplicate-group="${escapeMarkup(node.duplicateGroupId ?? "")}" data-generated-clone="${generatedClone}" style="--threadit-clone-index:${cloneIndex};--threadit-avatar-hue:${cloneIndex * 21}deg" aria-label="${escapeMarkup(node.authorSourceLabel)}" aria-describedby="${escapeMarkup(node.id)}-summary"><img class="threadit-node-avatar" src="${avatar}" alt=""><div><b>${escapeMarkup(node.authorSourceLabel)}</b><span class="threadit-relationship-label">${escapeMarkup(node.relationshipLabel)}</span><small class="threadit-node-meta">${escapeMarkup(node.orderLabel)}</small></div><strong class="threadit-node-status">${escapeMarkup(node.statusLabel)}</strong><span id="${escapeMarkup(node.id)}-summary" class="threadit-visually-hidden">${escapeMarkup(node.accessibleSummary)}</span></li>`;
  };
  const generatedClones = view.nodes.filter(({ id }) => id.startsWith("threadit-clone-"));
  let cloneGroupRendered = false;
  $("threaditSourceTree").innerHTML = view.nodes.map((node) => {
    const generatedClone = node.id.startsWith("threadit-clone-");
    if (view.midpoint.discovered && generatedClone) {
      if (cloneGroupRendered) return "";
      cloneGroupRendered = true;
      const groupLabel = view.secured
        ? "DUPLICATE-SOURCE QUARANTINE · 10 ACCOUNTS RETAINED"
        : "CONSENSUS CASCADE · 10 APPARENT ACCOUNTS";
      return `<li class="threadit-source-quarantine" data-quarantined="${view.secured}" aria-label="${groupLabel}"><strong>${groupLabel}</strong><ul>${generatedClones.map(renderSourceNode).join("")}</ul></li>`;
    }
    return renderSourceNode(node);
  }).join("");
  const nodeLabels = new Map(view.nodes.map(({ authorSourceLabel, id }) => [id, authorSourceLabel]));
  $("threaditRelationshipSummary").textContent = view.ariaDescription;
  $("threaditRelationshipList").innerHTML = view.nodes.map((node) => {
    const outgoing = view.relationships.filter(({ fromNodeId }) => fromNodeId === node.id);
    if (!outgoing.length) return "";
    return `<li><span>${escapeMarkup(node.authorSourceLabel)}</span><ul>${outgoing.map((relationship) => `<li>${escapeMarkup(relationship.relationshipLabel)} ${escapeMarkup(nodeLabels.get(relationship.toNodeId) ?? relationship.toNodeId)}. ${escapeMarkup(relationship.accessibleSummary)}</li>`).join("")}</ul></li>`;
  }).join("");
  scheduleThreadItConnectors(view.relationships);

  $("threaditPage").dataset.stateId = view.stateId;
  $("threaditPage").dataset.activeView = view.activeView;
  $("threaditPage").dataset.midpoint = String(view.midpoint.discovered);
  $("threaditPage").dataset.motion = view.motion.mode;
  $("threaditPage").dataset.secured = String(view.secured);
  const sourceOpen = view.activeView === "trace" || midpointPending;
  $("threaditPage").dataset.sourceOpen = String(sourceOpen);
  $("threaditSourceToggle").setAttribute("aria-expanded", String(sourceOpen));
  $("threaditSourceToggle").textContent = sourceOpen ? "CLOSE SOURCES" : "OPEN SOURCES";
  $("threaditPage").setAttribute("aria-label", view.ariaDescription);
  $("threaditHeaderStatus").textContent = view.headerStatus;
  $("threaditRule").textContent = actOneComplete
    ? THREADIT_COPY[THREADIT_COPY_IDS.ruleRepaired]
    : THREADIT_COPY[THREADIT_COPY_IDS.ruleCorrupted];
  $("threaditRuleBody").textContent = actOneComplete
    ? THREADIT_COPY[THREADIT_COPY_IDS.repairBody]
    : THREADIT_COPY[THREADIT_COPY_IDS.corruptBody];
  $("threaditPostList").innerHTML = renderedPosts.join("");
  $("threaditSourceStatus").textContent = view.secured
    ? view.headerStatus
    : view.midpoint.banner
    ?? (view.progress.completedUnitCount
      ? `${Math.min(4, view.progress.completedUnitCount)} OF 4 RELATIONSHIPS FOUND`
      : "ORIGIN NOT TRACED");
  $("threaditSourceSummary").textContent = view.midpoint.truthLine ?? view.ariaDescription;
  $("threaditStatusStrip").textContent = view.bottomStatus;
  const traceCompleted = Math.max(0, view.progress.completedUnitCount - THREADIT_ACT_ONE_UNITS.length);
  $("threaditUnitStatus").textContent = view.secured
    ? "3 OF 3 TRACE CHECKS SAVED"
    : view.midpoint.acknowledged
      ? `${traceCompleted} OF 3 TRACE CHECKS SAVED`
      : `${Math.min(4, view.progress.completedUnitCount)} OF 4 RELATIONSHIPS RESTORED`;
  $("threaditDiagnosticTruth").textContent = diagnosticMode ? "SIMULATED · NO READING SCORE" : "CONTENT REVIEW GATE · MIC OFF";
  $("threaditLiveStatus").textContent = campaignState.lastReaction ?? view.bottomStatus;
  $("threaditBrowserTitle").textContent = view.secured
    ? "THREADIT — SOURCE TREE STABLE"
    : view.midpoint.discovered
    ? view.activeView === "trace"
      ? "THREADIT — SOURCE RELATIONSHIP RECOVERY · TRACE VIEW"
      : "THREADIT — SOURCE RELATIONSHIP RECOVERY · TRACE READY"
    : "THREADIT — SOURCE RELATIONSHIP RECOVERY";
  $("threaditSecurityStatus").textContent = view.secured
    ? "SOURCE TREE STABLE"
    : view.activeView === "trace"
    ? "TRACE VIEW ACTIVE"
    : view.midpoint.discovered
      ? "TRACE VIEW READY"
      : "CONTENT REVIEW GATE";
  $("threaditThreadTab").disabled = view.secured;
  $("threaditThreadTab").setAttribute("aria-selected", String(view.activeView === "thread"));
  $("threaditTraceTab").disabled = !view.midpoint.discovered;
  $("threaditTraceTab").setAttribute("aria-selected", String(view.activeView === "trace"));
  $("threaditTraceControl").disabled = !view.midpoint.discovered;
  $("threaditTraceControl").textContent = view.activeView === "trace" ? "TRACE VIEW OPEN" : "OPEN TRACE VIEW";
  $("threaditFixtureStatus").title = fixture.notice;

  $("threaditMidpointNotice").hidden = !midpointPending;
  $("threaditMidpointProcess").src = THREADIT_ASSETS[THREADIT_ASSET_IDS.consensusCascade];
  if (!view.secured) state.threaditEvidenceReceiptOpen = false;
  $("threaditSecuredPayoff").hidden = !view.secured;
  $("threaditSecuredBadge").src = THREADIT_ASSETS[THREADIT_ASSET_IDS.sourceStableBadge];
  $("threaditDuplicateIcon").src = THREADIT_ASSETS[THREADIT_ASSET_IDS.duplicateSourceIcon];
  $("threaditBlockedWriteTitle").textContent = view.blockedWrite?.title ?? THREADIT_COPY[THREADIT_COPY_IDS.blockedTitle];
  $("threaditBlockedWriteBody").textContent = view.blockedWrite?.body ?? THREADIT_COPY[THREADIT_COPY_IDS.blockedBody];
  $("threaditEvidenceTitle").textContent = view.evidence?.title ?? "THREADIT / SYNTHETIC CONSENSUS OVERFLOW";
  $("threaditEvidenceWhatChanged").textContent = view.evidence?.whatChanged ?? THREADIT_EVIDENCE_RECORD.whatChanged;
  $("threaditEvidenceBehavior").textContent = view.evidence?.aiBehavior ?? THREADIT_EVIDENCE_RECORD.aiBehavior;
  $("threaditEvidenceWriter").textContent = view.evidence?.writerFingerprint ?? "consensus_auto_fix";
  $("threaditEvidenceToggle").setAttribute("aria-expanded", String(view.secured && state.threaditEvidenceReceiptOpen));
  $("threaditEvidenceToggle").textContent = state.threaditEvidenceReceiptOpen
    ? "Close THREADIT_TRACE_01.LOG"
    : "Open THREADIT_TRACE_01.LOG";
  $("threaditEvidenceReceipt").hidden = !view.secured || !state.threaditEvidenceReceiptOpen;

  const selection = selectNextThreadItPassage(state.threaditState);
  $("threaditCandidateCount").textContent = `${selection.unavailableCount} planned record${selection.unavailableCount === 1 ? "" : "s"} · ${selection.selectableCount} selectable`;
  $("threaditContentReason").textContent = selection.passage
    ? "A reviewed ThreadIt passage is available, but this structural milestone has not connected it to the Reading Companion yet."
    : "This candidate passage has provenance and comprehension metadata, but it remains unavailable until formal review and a real-microphone check are complete.";
  return view;
}

function renderThreadItDiagnosticPanel(campaignState) {
  const view = getThreadItCampaignView(campaignState);
  const actOneCompleted = Math.min(THREADIT_ACT_ONE_UNITS.length, view.progress.completedUnitCount);
  const traceCompleted = Math.max(0, view.progress.completedUnitCount - THREADIT_ACT_ONE_UNITS.length);
  const midpointPending = view.midpoint.discovered && !view.midpoint.acknowledged;
  if (view.secured) {
    $("diagnosticPhase").textContent = "THREADIT · SOURCE TREE STABLE";
    $("diagnosticSummary").textContent = "Seven simulated passages completed the authored campaign. Evidence and the blocked-write record are visible without a reading score.";
    $("diagnosticAdvance").textContent = "ThreadIt ending reached";
  } else if (midpointPending) {
    $("diagnosticPhase").textContent = "THREADIT · CONSENSUS CASCADE FOUND";
    $("diagnosticSummary").textContent = "Four simulated passages restored Act I. Open Trace View to acknowledge the midpoint before any trace unit can advance.";
    $("diagnosticAdvance").textContent = "Open Trace View first";
  } else if (view.midpoint.acknowledged) {
    $("diagnosticPhase").textContent = `THREADIT TRACE · ${traceCompleted} OF 3 CHECKS`;
    $("diagnosticSummary").textContent = `${view.progress.completedUnitCount} simulated passages · next result ${THREADIT_TRACE_UNITS[traceCompleted]?.visibleRepair.toLowerCase() ?? "saves the secured source tree"}`;
    $("diagnosticAdvance").textContent = "Skip simulated trace passage →";
  } else {
    $("diagnosticPhase").textContent = `THREADIT ACT I · ${actOneCompleted} OF 4 RELATIONSHIPS`;
    $("diagnosticSummary").textContent = `${actOneCompleted} simulated passage${actOneCompleted === 1 ? "" : "s"} · next result restores ${THREADIT_ACT_ONE_UNITS[actOneCompleted]?.unitId.replaceAll("_", " ") ?? "the source trace"}.`;
    $("diagnosticAdvance").textContent = "Skip simulated ThreadIt passage →";
  }
  $("diagnosticAdvance").disabled = view.secured || midpointPending;
}

function facePlaceInitials(label) {
  return String(label ?? "")
    .replace(/\([^)]*\)/gu, "")
    .trim()
    .split(/\s+/u)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

function syncFacePlaceProfileDrawer() {
  const drawerMode = matchMedia("(max-width: 1279px)").matches;
  const open = drawerMode && state.faceplaceProfilePanelOpen;
  $("faceplacePage").dataset.profileOpen = String(open);
  $("faceplaceProfileToggle").setAttribute("aria-expanded", String(open));
  $("faceplaceProfileRail").setAttribute("aria-hidden", String(drawerMode && !open));
  $("faceplaceProfileRail").inert = drawerMode && !open;
}

function renderFacePlaceFeedCard(card, sourceById, { blockedTarget = false } = {}) {
  const source = sourceById.get(card.sourceOriginId);
  const timestamp = card.timestamp
    ? `<time datetime="${escapeMarkup(card.timestamp)}">${escapeMarkup(card.displayTimestamp)}</time>`
    : `<span>${escapeMarkup(card.displayTimestamp)}</span>`;
  const sourceLabel = card.cardTypeVisible
    ? source?.kind === "generated"
      ? "GENERATED ORIGIN · PROVISIONAL"
      : "INDEPENDENT ORIGIN · PROVISIONAL"
    : "ORIGIN UNLABELED";
  const recommendationStatus = card.recommendation.applicable
    ? card.recommendation.verified
      ? "WHY VERIFIED"
      : card.recommendation.controlAvailable
        ? "WHY PENDING"
        : "WHY HIDDEN"
    : "CHRONOLOGICAL SOURCE";
  const duplicateSummary = card.duplicateRepresentative
    ? `<p class="faceplace-duplicate-summary">${card.collapsedDuplicateCardIds.length} repeated cards collapsed under one provisional generated origin. Source cards remain logged.</p>`
    : "";
  const whyControl = card.recommendation.applicable && card.recommendation.controlAvailable
    ? `<button class="faceplace-card-why" type="button" data-faceplace-reason-card="${escapeMarkup(card.id)}" aria-controls="faceplaceWhyDetails">Inspect why</button>`
    : "";
  const blockedTargetLabel = blockedTarget
    ? '<span class="faceplace-blocked-target-label">BLOCKED BOOST TARGET</span>'
    : "";
  const accessibleSummary = blockedTarget
    ? `${card.accessibleSummary} This is the provisional card targeted by the blocked boost attempt.`
    : card.accessibleSummary;
  const focusTarget = blockedTarget ? ' tabindex="-1"' : "";
  const visibleCardType = card.cardTypeVisible ? card.cardType : "unlabeled";
  const visibleOriginKind = card.cardTypeVisible ? source?.kind ?? "unknown" : "unlabeled";
  return `<li id="${escapeMarkup(card.id)}" class="faceplace-feed-card" data-card-type="${escapeMarkup(visibleCardType)}" data-duplicate="${Boolean(card.duplicateGroupId && !card.duplicateRepresentative)}" data-collapsed="${card.duplicateRepresentative}" data-blocked-target="${blockedTarget}" aria-label="${escapeMarkup(accessibleSummary)}"${focusTarget}>
    <span class="faceplace-mini-avatar" aria-hidden="true">${escapeMarkup(facePlaceInitials(card.authorLabel))}</span>
    <article><header><div><b>${escapeMarkup(card.authorLabel)}</b>${timestamp}</div><strong>${escapeMarkup(card.cardTypeLabel)}</strong></header><p>${escapeMarkup(card.body)}</p>${duplicateSummary}<footer class="faceplace-card-footer"><span>${card.reactions} reactions</span><span class="faceplace-card-source" data-origin="${escapeMarkup(visibleOriginKind)}">${escapeMarkup(sourceLabel)}</span><span class="faceplace-card-reason-status" data-secondary="true">${escapeMarkup(recommendationStatus)}</span>${whyControl}${blockedTargetLabel}</footer></article>
  </li>`;
}

function renderFacePlaceCampaign(campaignState, { diagnosticMode = false } = {}) {
  const view = getFacePlaceCampaignView(campaignState, {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    showActOneResult: state.faceplaceShowActOneResult,
  });
  const completed = new Set(view.progress.completedUnitIds);
  const sourceById = new Map(FACEPLACE_PROVISIONAL_FEED_FIXTURE.sources.map((source) => [source.id, source]));

  $("faceplacePage").dataset.stateId = view.stateId;
  $("faceplacePage").dataset.secured = String(view.secured);
  $("faceplacePage").dataset.motion = view.motion.mode;
  $("faceplacePage").dataset.ruleRepaired = String(view.midpoint.discovered);
  $("faceplacePage").dataset.feedMode = view.feedMode;
  $("faceplacePage").setAttribute("aria-label", view.ariaDescription);
  $("faceplaceHeaderStatus").textContent = view.headerStatus;
  $("faceplaceRule").textContent = view.ruleLabel;
  $("faceplaceRuleBody").textContent = view.ruleBody;
  $("faceplaceFixtureStatus").title = view.fixture.notice;
  $("faceplaceFixtureStatus").textContent = "PROVISIONAL FEED FIXTURE · DESIGNER REPLACEMENT PENDING";

  $("faceplaceProfileName").textContent = view.profile.displayName;
  $("faceplaceProfileHandle").textContent = `${view.profile.handle} · FIXTURE`;
  $("faceplaceProfileAvatar").textContent = facePlaceInitials(view.profile.displayName);
  $("faceplaceProfileSummary").textContent = view.profile.accessibleSummary;
  $("faceplaceRelationshipHeading").textContent = view.relationshipClusters.every(({ revealed }) => revealed)
    ? "Distinct people restored"
    : "Relationship map scrambled";
  $("faceplaceRelationshipList").innerHTML = view.relationshipClusters.map((cluster) => {
    const summary = cluster.revealed
      ? `${cluster.members.length} distinct fictional people`
      : "Verified members hidden until Honest Zero";
    const members = cluster.revealed
      ? `<ul>${cluster.members.map((member) => `<li>${escapeMarkup(member.displayName)}</li>`).join("")}</ul>`
      : "";
    return `<li class="faceplace-relationship-cluster" data-revealed="${cluster.revealed}" aria-label="${escapeMarkup(cluster.accessibleSummary)}"><b>${escapeMarkup(cluster.label)}</b><span>${summary}</span>${members}</li>`;
  }).join("");

  const blockedTargetCardId = view.blockedWrite?.fixtureAttempt?.targetCardId ?? null;
  $("faceplaceFeedList").innerHTML = view.feedCards.map((card) => renderFacePlaceFeedCard(card, sourceById, {
    blockedTarget: card.id === blockedTargetCardId,
  })).join("");
  $("faceplaceRankedMode").setAttribute("aria-pressed", String(view.feedMode === "ranked"));
  $("faceplaceChronologicalMode").setAttribute("aria-pressed", String(view.feedMode === "chronological"));
  $("faceplaceRankedMode").disabled = !view.chronologyControl.available;
  $("faceplaceChronologicalMode").disabled = !view.chronologyControl.available;

  const tracker = $("faceplaceTracker");
  const trackerMeter = $("faceplaceTrackerMeter");
  for (const attribute of ["role", "aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext"]) trackerMeter.removeAttribute(attribute);
  tracker.dataset.trackerKind = view.tracker.isProgress ? "honest" : view.tracker.display ? "nonsense" : "pending";
  $("faceplaceTrackerLabel").textContent = view.tracker.label;
  $("faceplaceTrackerValue").textContent = view.tracker.display ?? "—";
  $("faceplaceTrackerValue").toggleAttribute("aria-hidden", !view.tracker.isProgress);
  $("faceplaceTrackerTechno").hidden = !view.tracker.transientActOneResult;
  $("faceplaceTrackerTechno").alt = view.tracker.transientActOneResult
    ? "Techno drops her ball beside the AVOCADO% nonsense tracker."
    : "";
  if (view.tracker.isProgress) {
    trackerMeter.setAttribute("role", "progressbar");
    trackerMeter.setAttribute("aria-valuemin", String(view.tracker.ariaValueMin));
    trackerMeter.setAttribute("aria-valuemax", String(view.tracker.ariaValueMax));
    trackerMeter.setAttribute("aria-valuenow", String(view.tracker.ariaValueNow));
    trackerMeter.setAttribute("aria-valuetext", view.tracker.ariaValueText);
    $("faceplaceTrackerTruth").textContent = view.tracker.ariaValueText;
  } else if (view.tracker.transientActOneResult) {
    $("faceplaceTrackerTruth").textContent = "LAST FALSE TRACKER OUTPUT · HONEST ZERO READY";
  } else {
    $("faceplaceTrackerTruth").textContent = view.tracker.display
      ? "NONSENSE METER · NOT LEARNER PROGRESS"
      : "VALUE PENDING DESIGNER · NO LEARNER SCORE";
  }
  const allUnits = [...FACEPLACE_FALSE_TRACKER_UNITS, ...FACEPLACE_RECOVERY_UNITS];
  const honestChecksRevealed = view.midpoint.visible
    || view.midpoint.acknowledged
    || view.progress.honestRecoveryCompletedCount > 0
    || view.secured;
  const checklist = honestChecksRevealed
    ? allUnits.map((unit) => ({ label: unit.visibleRepair, saved: completed.has(unit.unitId) }))
    : [
        ...FACEPLACE_FALSE_TRACKER_UNITS.map((unit, index) => completed.has(unit.unitId)
          ? { label: unit.visibleRepair, saved: true }
          : { label: `Corrupted signal ${index + 1} pending`, saved: false }),
        ...(view.tracker.transientActOneResult
          ? FACEPLACE_RECOVERY_UNITS.map((_, index) => ({
              label: `Honest recovery signal ${index + 1} pending`,
              saved: false,
            }))
          : []),
      ];
  $("faceplaceSavedRepairs").innerHTML = checklist.map(({ label, saved }) => {
    const status = saved ? "SAVED" : "PENDING";
    return `<li data-saved="${saved}" aria-label="${escapeMarkup(`${status}: ${label}`)}"><span class="faceplace-repair-state">${status}</span> <span>${escapeMarkup(label)}</span></li>`;
  }).join("");

  $("faceplaceMidpointNotice").hidden = !view.midpoint.visible;
  $("faceplaceMidpointHeading").textContent = view.midpoint.body.split("\n")[0] || view.midpoint.title;
  $("faceplaceMidpointAction").hidden = !view.midpoint.actionRequired;
  $("faceplaceMidpointAction").disabled = !view.midpoint.actionRequired;

  const visibleSuggestions = view.truth.contextControlsRestored
    ? view.peopleYouMaySortOfKnow
    : [1, 2, 3].map((ordinal) => ({
        accessibleSummary: `Repeated fictional appliance suggestion ${ordinal} of twelve.`,
        displayName: `Countertop Timer ${String(ordinal).padStart(2, "0")}`,
        handle: `same-appliance-copy-${ordinal}`,
        id: `faceplace-corrupt-appliance-${ordinal}`,
        relationshipHint: ordinal === 3 ? "+9 nearly identical appliances" : "same generated suggestion",
      }));
  $("faceplacePeopleList").innerHTML = visibleSuggestions.map((person) => `<li class="faceplace-person-suggestion" aria-label="${escapeMarkup(person.accessibleSummary)}"><span class="faceplace-mini-avatar" aria-hidden="true">${escapeMarkup(facePlaceInitials(person.displayName))}</span><div><b>${escapeMarkup(person.displayName)}</b><span>${escapeMarkup(person.relationshipHint ?? person.handle)}</span></div></li>`).join("");

  if (!view.contextPanel.shellRestored) {
    state.faceplaceWhyOpen = false;
    state.faceplaceSelectedReasonCardId = null;
  }
  const selectedReason = view.contextPanel.reasons.find(({ cardId }) => cardId === state.faceplaceSelectedReasonCardId)
    ?? view.contextPanel.reasons.find(({ cardId }) => cardId === view.contextPanel.selectedCardId)
    ?? view.contextPanel.reasons.find(({ available }) => available)
    ?? null;
  state.faceplaceSelectedReasonCardId = selectedReason?.cardId ?? null;
  const selectedCard = view.feedCards.find(({ id }) => id === selectedReason?.cardId)
    ?? view.feedCards.find(({ recommendation }) => recommendation.applicable)
    ?? null;
  $("faceplaceWhyToggle").disabled = !view.contextPanel.shellRestored;
  $("faceplaceWhyToggle").setAttribute("aria-expanded", String(view.contextPanel.shellRestored && state.faceplaceWhyOpen));
  $("faceplaceWhyToggle").textContent = state.faceplaceWhyOpen ? "Close recommendation" : "Inspect recommendation";
  $("faceplaceWhyDetails").hidden = !view.contextPanel.shellRestored || !state.faceplaceWhyOpen;
  $("faceplaceWhyCard").textContent = selectedCard?.authorLabel ?? "Recommended card pending";
  $("faceplaceWhyReason").textContent = selectedReason?.reasonText ?? "Recommendation reason pending verification.";
  $("faceplaceWhyStatus").textContent = view.contextPanel.reasonsVerified ? "REASON VERIFIED" : view.contextPanel.shellRestored ? "VERIFICATION PENDING" : "CONTROL NOT RESTORED";
  $("faceplaceFeedList").querySelectorAll("[data-faceplace-reason-card]").forEach((button) => {
    button.onclick = () => {
      state.faceplaceSelectedReasonCardId = button.dataset.faceplaceReasonCard;
      state.faceplaceWhyOpen = true;
      renderFacePlaceCampaign(campaignState, { diagnosticMode });
      requestAnimationFrame(() => $("faceplaceWhyDetails").focus({ preventScroll: true }));
    };
  });

  if (!view.secured) state.faceplaceEvidenceReceiptOpen = false;
  $("faceplaceSecuredPayoff").hidden = !view.secured;
  const blockedTargetCard = view.feedCards.find(({ id }) => id === blockedTargetCardId) ?? null;
  $("faceplaceBlockedActor").textContent = view.blockedWrite?.process?.displayName
    ? `${view.blockedWrite.process.displayName} · PROVISIONAL TARGET`
    : "FEED AUTO-FIX AI · PROVISIONAL TARGET";
  $("faceplaceBlockedTitle").textContent = view.blockedWrite?.title ?? FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD.title;
  $("faceplaceBlockedBody").textContent = view.blockedWrite?.body ?? FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD.body;
  $("faceplaceBlockedTarget").textContent = blockedTargetCard
    ? `Target card: ${blockedTargetCard.authorLabel} · ${blockedTargetCard.id}`
    : "Target card pending";
  $("faceplaceBlockedTarget").href = blockedTargetCard ? `#${blockedTargetCard.id}` : "#faceplaceFeedList";
  $("faceplaceBlockedTarget").onclick = blockedTargetCard
    ? (event) => {
        event.preventDefault();
        const target = $(blockedTargetCard.id);
        target?.scrollIntoView({ block: "nearest", behavior: view.motion.mode === "state-swap" ? "auto" : "smooth" });
        target?.focus({ preventScroll: true });
      }
    : null;
  $("faceplaceEvidenceTitle").textContent = view.evidence?.title ?? FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.title;
  $("faceplaceEvidenceWhatChanged").textContent = view.evidence?.whatChanged ?? FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.whatChanged;
  $("faceplaceEvidenceBehavior").textContent = view.evidence?.aiBehavior ?? FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.aiBehavior;
  $("faceplaceEvidenceWriter").textContent = view.evidence?.fixtureDraft?.writerFingerprint
    ?? view.evidence?.writerFingerprint
    ?? "PENDING DESIGNER ID";
  $("faceplaceEvidenceToggle").setAttribute("aria-expanded", String(view.secured && state.faceplaceEvidenceReceiptOpen));
  $("faceplaceEvidenceToggle").textContent = state.faceplaceEvidenceReceiptOpen
    ? "Close provisional FacePlace test receipt"
    : "Open provisional FacePlace test receipt";
  $("faceplaceEvidenceReceipt").hidden = !view.secured || !state.faceplaceEvidenceReceiptOpen;

  $("faceplaceStatusStrip").textContent = view.secured
    ? "FORCED DISTRIBUTION: OFF"
    : view.tracker.isProgress
      ? `HONEST FEED RECOVERY ${view.tracker.display}`
      : "ACTIVE SORT: REACTIONS DESCENDING";
  $("faceplaceUnitStatus").textContent = view.secured
    ? "3 OF 3 HONEST CHECKS SAVED"
    : view.midpoint.acknowledged
      ? `${view.progress.honestRecoveryCompletedCount} OF 3 HONEST CHECKS SAVED`
      : `${view.progress.actOneCompletedCount} OF 3 ACT I REPAIRS SAVED`;
  $("faceplaceDiagnosticTruth").textContent = diagnosticMode ? "SIMULATED · NO READING SCORE" : "CONTENT REVIEW GATE · MIC OFF";
  $("faceplaceLiveStatus").textContent = campaignState.lastReaction ?? view.lastRepairAnnouncement;
  $("faceplaceBrowserTitle").textContent = view.secured
    ? "FACEPLACE — FEED RECOVERY VERIFIED"
    : view.midpoint.discovered
      ? "FACEPLACE — HONEST FEED RECOVERY"
      : "FACEPLACE — LYING TRACKER RECOVERY";
  $("faceplaceSecurityStatus").textContent = view.secured
    ? "FEED RECOVERY VERIFIED"
    : diagnosticMode
      ? "STRUCTURAL TEST"
      : "CONTENT REVIEW GATE";

  const selection = selectNextFacePlacePassage(state.faceplaceState);
  $("faceplaceCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("faceplaceContentReason").textContent = selection.passage
    ? "A reviewed FacePlace passage is available, but this structural milestone has not connected it to the Reading Companion yet."
    : `This candidate remains unavailable. Deck A has ${selection.deckACount} planned records for a ${selection.requiredFirstRun}-reading first run, so one additional reviewed record is still required.`;

  syncFacePlaceProfileDrawer();
  return view;
}

function renderFacePlaceDiagnosticPanel(campaignState) {
  const view = getFacePlaceCampaignView(campaignState, { showActOneResult: state.faceplaceShowActOneResult });
  const midpointPending = view.midpoint.discovered && !view.midpoint.acknowledged;
  if (view.secured) {
    $("diagnosticPhase").textContent = "FACEPLACE · FEED RECOVERY VERIFIED";
    $("diagnosticSummary").textContent = "Six simulated readings completed the authored campaign. Slot 3 remains explicitly provisional and test-only.";
    $("diagnosticAdvance").textContent = "FacePlace ending reached";
  } else if (midpointPending) {
    $("diagnosticPhase").textContent = state.faceplaceShowActOneResult
      ? "FACEPLACE · LAST FALSE TRACKER: AVOCADO%"
      : "FACEPLACE · HONEST ZERO";
    $("diagnosticSummary").textContent = state.faceplaceShowActOneResult
      ? "Three real structural repairs are saved. The old nonsense output is being replaced with an honest tracker."
      : "Three Act I repairs remain saved. Acknowledge Honest Zero before another simulated reading can advance.";
    $("diagnosticAdvance").textContent = "Acknowledge Honest Zero first";
  } else if (view.midpoint.acknowledged) {
    const next = FACEPLACE_RECOVERY_UNITS[view.progress.honestRecoveryCompletedCount];
    $("diagnosticPhase").textContent = `FACEPLACE HONEST RECOVERY · ${view.progress.honestRecoveryCompletedCount} OF 3`;
    $("diagnosticSummary").textContent = `${view.progress.completedUnitCount} simulated readings · next result ${next?.visibleRepair.toLowerCase() ?? "verifies the feed"}`;
    $("diagnosticAdvance").textContent = "Skip simulated FacePlace reading →";
  } else {
    const next = FACEPLACE_FALSE_TRACKER_UNITS[view.progress.actOneCompletedCount];
    $("diagnosticPhase").textContent = `FACEPLACE ACT I · ${view.progress.actOneCompletedCount} OF 3`;
    $("diagnosticSummary").textContent = `${view.progress.actOneCompletedCount} simulated reading${view.progress.actOneCompletedCount === 1 ? "" : "s"} · next result ${next?.visibleRepair.toLowerCase() ?? "reveals Honest Zero"}`;
    $("diagnosticAdvance").textContent = "Skip simulated FacePlace reading →";
  }
  $("diagnosticAdvance").disabled = view.secured || midpointPending;
}

function mapGuessCoordinateLabel(coordinate) {
  return coordinate?.visible && coordinate.grid ? `GRID ${coordinate.grid}` : "GRID —";
}

function mapGuessPoint(coordinate) {
  if (!coordinate?.visible || !Number.isFinite(coordinate.column) || !Number.isFinite(coordinate.row)) return null;
  return {
    left: (coordinate.column - 0.5) * 10,
    top: (coordinate.row - 0.5) * 10,
  };
}

function mapGuessSvgPoint(point) {
  if (!point || !Number.isFinite(point.column) || !Number.isFinite(point.row)) return null;
  return `${(point.column - 0.5) * 10},${(point.row - 0.5) * 10}`;
}

function syncMapGuessInspector() {
  const drawerMode = getComputedStyle($("mapguessInspectorToggle")).display !== "none";
  if (!drawerMode) state.mapguessInspectorOpen = false;
  const open = drawerMode && state.mapguessInspectorOpen;
  $("mapguessPage").dataset.inspectorOpen = String(open);
  $("mapguessInspectorToggle").setAttribute("aria-expanded", String(open));
  $("mapguessInspectorPanel").setAttribute("aria-hidden", String(drawerMode && !open));
  $("mapguessInspectorPanel").inert = drawerMode && !open;
  $("mapguessMapColumn").setAttribute("aria-hidden", String(open));
  $("mapguessMapColumn").inert = open;
}

function setMapGuessInspectorDrawerOpen(open) {
  state.mapguessInspectorOpen = Boolean(open);
  $("mapguessPage").dataset.inspectorOpen = String(state.mapguessInspectorOpen);
  $("mapguessInspectorToggle").setAttribute("aria-expanded", String(state.mapguessInspectorOpen));
  $("mapguessInspectorPanel").setAttribute("aria-hidden", String(!state.mapguessInspectorOpen));
  $("mapguessInspectorPanel").inert = !state.mapguessInspectorOpen;
  $("mapguessMapColumn").setAttribute("aria-hidden", String(state.mapguessInspectorOpen));
  $("mapguessMapColumn").inert = state.mapguessInspectorOpen;
}

function renderMapGuessCampaign(campaignState, { diagnosticMode = false } = {}) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const view = getMapGuessCampaignView(campaignState, { reducedMotion });
  const page = $("mapguessPage");
  page.dataset.stateId = view.stateId;
  page.dataset.secured = String(view.secured);
  page.dataset.motion = view.motion.mode;
  page.dataset.midpointPending = String(view.midpoint.actionRequired);
  page.setAttribute("aria-label", view.ariaDescription);
  $("mapguessHeaderStatus").textContent = view.headerStatus;
  $("mapguessFixtureStatus").textContent = "PROVISIONAL FICTIONAL GRID · DESIGNER REPLACEMENT PENDING";
  $("mapguessFixtureStatus").title = view.fixture.notice;
  $("mapguessRule").textContent = view.ruleLabel;
  $("mapguessRuleBody").textContent = view.ruleBody;
  $("mapguessStartName").textContent = view.start.displayName;
  $("mapguessStartCoordinate").textContent = mapGuessCoordinateLabel(view.start.coordinate);
  $("mapguessDestinationName").textContent = view.destinationComparison.original.displayName;
  $("mapguessDestinationCoordinate").textContent = mapGuessCoordinateLabel(view.destinationComparison.original.coordinate);

  $("mapguessDirectionList").innerHTML = view.directions.steps.length
    ? view.directions.steps.map((step, index) => `<li class="mapguess-direction" data-connected="${view.directions.honest}" aria-label="${escapeMarkup(step.accessibleSummary)}"><b>${step.ordinal ?? index + 1}</b><span>${escapeMarkup(step.instruction)}</span></li>`).join("")
    : '<li class="mapguess-direction" data-connected="false"><b>!</b><span>Choose a route goal to compare honest directions.</span></li>';
  $("mapguessDirectionSummary").textContent = view.directions.accessibleSummary;

  $("mapguessGoalSelector").dataset.goalRequired = String(view.goals.goalRequired);
  $("mapguessGoalOptions").innerHTML = view.goals.options.map((goal) => `<button class="mapguess-goal-option" type="button" data-mapguess-goal="${escapeMarkup(goal.goalId)}" aria-pressed="${goal.selected}" ${goal.enabled ? "" : "disabled"}><b>${escapeMarkup(goal.label)}</b><span>${escapeMarkup(goal.tradeoff)}${goal.etaDisplay ? ` · ${escapeMarkup(goal.etaDisplay)}` : ""}</span></button>`).join("");
  const selectedGoal = view.goals.options.find(({ selected }) => selected) ?? null;
  $("mapguessGoalStatus").textContent = view.goals.locked
    ? `${selectedGoal?.label ?? "Selected route"} locked to the requested destination.`
    : view.goals.goalRequired
      ? "DESTINATION LOCKED - USER CHOICE REQUIRED"
      : view.goals.selectionAvailable
        ? selectedGoal
          ? `${selectedGoal.label} selected. You may change it until the final anchor reading begins.`
          : "Choose fastest, safest, scenic, or accessible before the final anchor reading."
        : "Available after Moving Target is acknowledged.";
  $("mapguessGoalOptions").querySelectorAll("[data-mapguess-goal]").forEach((button) => {
    button.onclick = () => setMapGuessGoalFromControl(button.dataset.mapguessGoal);
  });

  const allUnits = [...MAPGUESS_REBUILD_UNITS, ...MAPGUESS_ANCHOR_UNITS];
  const savedUnitIds = new Set(view.progress.completedUnitIds);
  $("mapguessProgressList").innerHTML = allUnits.map((unit, index) => {
    const saved = savedUnitIds.has(unit.unitId);
    return `<li data-saved="${saved}"><span>${index + 1}. ${escapeMarkup(unit.visibleRepair)}</span><b class="mapguess-progress-state">${saved ? "SAVED" : "PENDING"}</b></li>`;
  }).join("");

  const tilePositions = [[1, 3], [2, 3], [3, 2], [4, 2]];
  $("mapguessTileGrid").innerHTML = view.tiles.map((tile, index) => {
    const terrainKind = tile.terrain.some(({ kind }) => kind === "canal") ? "water" : tile.terrain.length ? "land" : "unknown";
    const [column, row] = tilePositions[index] ?? [((index % 4) + 1), Math.floor(index / 4) + 1];
    const names = tile.placeNames.map(({ label }) => label).join(" · ");
    const terrain = tile.terrain.map(({ label }) => label).join(" · ");
    return `<li class="mapguess-map-tile" data-restored="${tile.restored}" data-terrain="${terrainKind}" style="grid-column:${column};grid-row:${row}" title="${escapeMarkup(tile.accessibleSummary)}"><b>${escapeMarkup(tile.grid ?? "??")}</b><span>${escapeMarkup(names || terrain || "MAP LAYER UNREADABLE")}</span></li>`;
  }).join("");

  const roadMarkup = view.fixedRoadGeometry.roads.map((road) => {
    const points = road.geometryPoints.map(mapGuessSvgPoint).filter(Boolean).join(" ");
    if (!points) return "";
    return `<polyline class="mapguess-road" points="${points}"></polyline><polyline class="mapguess-road-center" points="${points}"></polyline>`;
  }).join("");
  const routeMarkup = view.routeSegments.filter(({ visible }) => visible).map((segment) => {
    const from = mapGuessSvgPoint(segment.fromPoint);
    const to = mapGuessSvgPoint(segment.toPoint);
    if (!from || !to) return "";
    return `<polyline class="mapguess-route-segment" data-connected="${segment.connected}" data-selected-goal="${segment.selectedForGoal}" points="${from} ${to}"></polyline>`;
  }).join("");
  $("mapguessRouteLayer").innerHTML = roadMarkup + routeMarkup;

  const comparison = view.destinationComparison;
  const currentDestination = comparison.currentLocation === "moved" ? comparison.moved : comparison.original;
  const destinationPoint = mapGuessPoint(currentDestination.coordinate) ?? { left: 55, top: 72 };
  const destinationLabel = comparison.currentLocation === "moved" ? "MOVED" : comparison.currentLocation === "original" ? "LOCKED" : "?";
  const destinationMarkup = `<span id="mapguessDestinationPin" class="mapguess-destination" data-location="${comparison.currentLocation === "original" ? "original" : "moved"}" data-locked="${comparison.original.locked}" style="left:${destinationPoint.left}%;top:${destinationPoint.top}%" title="${escapeMarkup(currentDestination.accessibleSummary)}">${destinationLabel}</span>`;
  const landmarkMarkup = view.landmarks.map((landmark, index) => {
    const point = mapGuessPoint(landmark.coordinate);
    if (!point) return "";
    return `<span class="mapguess-landmark" data-anchored="${landmark.anchored}" data-revealed="${landmark.revealed}" style="left:${point.left}%;top:${point.top}%" title="${escapeMarkup(landmark.accessibleSummary)}">L${index + 1}</span>`;
  }).join("");
  $("mapguessMapOverlay").innerHTML = destinationMarkup + landmarkMarkup;
  $("mapguessMapSummary").textContent = view.ariaDescription;
  $("mapguessMapCaption").textContent = `${view.coordinateSystem.accessibleSummary} No real location or external tile service.`;
  $("mapguessRouteLog").dataset.honest = String(view.directions.honest);
  $("mapguessRouteTradeoff").textContent = view.directions.tradeoff;
  $("mapguessRouteGoal").textContent = `GOAL: ${selectedGoal?.label ?? "NOT SELECTED"}`;
  $("mapguessEta").textContent = view.directions.etaDisplay ? `ETA ${view.directions.etaDisplay}` : "ETA —";

  $("mapguessMidpointNotice").hidden = !view.midpoint.visible;
  $("mapguessMidpointHeading").textContent = view.midpoint.title;
  $("mapguessMidpointBody").textContent = view.midpoint.body;
  $("mapguessMidpointAmy").textContent = `Amy: ${view.midpoint.amyLine}`;
  $("mapguessMidpointChinmay").textContent = `Chinmay: ${view.midpoint.chinmayLine}`;
  $("mapguessMidpointProof").innerHTML = view.midpoint.proof.proofLines.map((line) => {
    const divider = line.indexOf(":");
    const label = divider >= 0 ? line.slice(0, divider) : line;
    const value = divider >= 0 ? line.slice(divider + 1).trim() : "VERIFIED";
    const truth = value === "NO" ? "no" : "yes";
    return `<dl class="mapguess-proof-row" data-truth="${truth}"><dt>${escapeMarkup(label)}</dt><dd>${escapeMarkup(value)}</dd></dl>`;
  }).join("");
  $("mapguessMidpointAction").disabled = !view.midpoint.actionRequired;

  $("mapguessScale").textContent = view.scale.display;
  $("mapguessDate").textContent = view.mapDate.display;
  $("mapguessSource").textContent = view.source.displayName;
  $("mapguessTerrainList").innerHTML = view.terrain.map((record) => `<li>${escapeMarkup(record.label)}${record.cells.length ? ` · ${escapeMarkup(record.cells.join(", "))}` : ""}</li>`).join("");
  $("mapguessWaterList").innerHTML = view.water.map((record) => `<li>${escapeMarkup(record.label)}${record.cells.length ? ` · ${escapeMarkup(record.cells.join(", "))}` : ""}</li>`).join("");
  $("mapguessCoordinateComparison").innerHTML = comparison.visible
    ? [comparison.original, comparison.moved].map((destination) => `<div class="mapguess-coordinate-card" data-current="${comparison.currentLocation === (destination.requested ? "original" : "moved")}" data-locked="${destination.locked}"><span class="mapguess-coordinate-label">${destination.requested ? "REQUESTED" : "AI-MOVED"}</span><strong>${escapeMarkup(destination.displayName)}</strong><span>${escapeMarkup(mapGuessCoordinateLabel(destination.coordinate))}</span></div>`).join("")
    : '<div class="mapguess-coordinate-card"><span class="mapguess-coordinate-label">DESTINATION COMPARISON</span><strong>INSPECTOR LOCKED</strong><span>Save five rebuild units to compare coordinates.</span></div>';
  $("mapguessLandmarkList").innerHTML = view.landmarks.map((landmark) => `<li data-anchored="${landmark.anchored}"><span>${escapeMarkup(landmark.displayName)} · ${escapeMarkup(mapGuessCoordinateLabel(landmark.coordinate))}</span><b class="mapguess-progress-state">${landmark.anchored ? "ANCHORED" : landmark.revealed ? "REVEALED" : "HIDDEN"}</b></li>`).join("");
  $("mapguessSponsoredStop").dataset.disclosed = String(view.sponsoredStop.disclosed);
  $("mapguessSponsoredHeading").textContent = view.sponsoredStop.disclosed ? view.sponsoredStop.disclosure : "IDENTITY HIDDEN";
  $("mapguessSponsoredBody").textContent = `${view.sponsoredStop.text}${view.sponsoredStop.coordinate.visible ? ` · ${mapGuessCoordinateLabel(view.sponsoredStop.coordinate)}` : ""}`;

  if (!view.secured) state.mapguessEvidenceReceiptOpen = false;
  $("mapguessSecuredPayoff").hidden = !view.secured;
  $("mapguessSecuredHeading").textContent = view.securedPayoff?.title ?? "DESTINATION LOCKED";
  $("mapguessSecuredLines").innerHTML = (view.securedPayoff?.bodyLines ?? []).map((line) => `<li>${escapeMarkup(line)}</li>`).join("");
  $("mapguessBlockedActor").textContent = view.blockedWrite?.process?.displayName
    ? `${view.blockedWrite.process.displayName} · ${view.blockedWrite.process.upstreamServiceId ?? "UPSTREAM PENDING"}`
    : "ROUTE AUTO-FIX AI · PROVISIONAL PROCESS";
  $("mapguessBlockedTitle").textContent = view.blockedWrite?.title ?? MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD.title;
  $("mapguessBlockedBody").textContent = view.blockedWrite?.body ?? MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD.body;
  $("mapguessBlockedTarget").textContent = view.blockedWrite?.fixtureAttempt?.attemptedCoordinate?.grid
    ? `Blocked move to grid ${view.blockedWrite.fixtureAttempt.attemptedCoordinate.grid}`
    : "Inspect locked destination";
  $("mapguessEvidenceTitle").textContent = view.evidence?.title ?? MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.title;
  $("mapguessEvidenceFilename").textContent = view.evidence?.filename ?? MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.filename;
  $("mapguessEvidenceWhatChanged").textContent = view.evidence?.whatChanged ?? MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.whatChanged;
  $("mapguessEvidenceBehavior").textContent = view.evidence?.aiBehavior ?? MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.aiBehavior;
  $("mapguessEvidenceWriter").textContent = view.evidence?.fixtureDraft?.writerFingerprint ?? view.evidence?.writerFingerprint ?? "PENDING DESIGNER ID";
  $("mapguessEvidenceGoal").textContent = view.evidence?.routeGoalLabel ?? selectedGoal?.label ?? "PENDING USER CHOICE";
  $("mapguessEvidenceToggle").setAttribute("aria-expanded", String(view.secured && state.mapguessEvidenceReceiptOpen));
  $("mapguessEvidenceToggle").textContent = state.mapguessEvidenceReceiptOpen ? "Close provisional MapGuess test receipt" : "Open provisional MapGuess test receipt";
  $("mapguessEvidenceReceipt").hidden = !view.secured || !state.mapguessEvidenceReceiptOpen;

  $("mapguessStatusStrip").textContent = view.secured
    ? "DESTINATION LOCKED - USER CHOICE REQUIRED"
    : view.midpoint.discovered
      ? "ROAD FIXED · DESTINATION MOVE DISCLOSED"
      : "ETA TARGET: 2 MINUTES FOREVER";
  $("mapguessUnitStatus").textContent = view.secured
    ? "3 OF 3 DESTINATION ANCHORS SAVED"
    : view.midpoint.acknowledged
      ? `${view.progress.anchorCompletedCount} OF 3 DESTINATION ANCHORS SAVED`
      : `${view.progress.rebuildCompletedCount} OF 5 REBUILD UNITS SAVED`;
  $("mapguessDiagnosticTruth").textContent = diagnosticMode ? "SIMULATED · NO READING SCORE" : "CONTENT REVIEW GATE · MIC OFF";
  $("mapguessLiveStatus").textContent = campaignState.lastReaction ?? view.lastRepairAnnouncement;
  $("mapguessBrowserTitle").textContent = view.secured
    ? "MAPGUESS — DESTINATION LOCKED"
    : view.midpoint.discovered
      ? "MAPGUESS — MOVING TARGET"
      : "MAPGUESS — ROUTE RECOVERY";
  $("mapguessSecurityStatus").textContent = view.secured ? "DESTINATION LOCKED" : diagnosticMode ? "STRUCTURAL TEST" : "CONTENT REVIEW GATE";

  const selection = selectNextMapGuessPassage(state.mapguessState);
  $("mapguessCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("mapguessContentReason").textContent = selection.passage
    ? "A reviewed MapGuess passage is available, but this structural milestone has not connected it to the Reading Companion yet."
    : `This candidate remains unavailable. Deck A has ${selection.deckACount} planned records for an ${selection.requiredFirstRun}-reading first run; ${selection.firstRunShortfall} additional reviewed records are still required.`;

  syncMapGuessInspector();
  return view;
}

function renderMapGuessDiagnosticPanel(campaignState) {
  const view = getMapGuessCampaignView(campaignState);
  const midpointPending = view.midpoint.actionRequired;
  const goalRequired = view.goals.goalRequired;
  if (view.secured) {
    $("diagnosticPhase").textContent = "MAPGUESS · DESTINATION LOCKED";
    $("diagnosticSummary").textContent = "Eight simulated readings completed the 5+3 campaign. Slot 10 remains explicitly provisional and test-only.";
    $("diagnosticAdvance").textContent = "MapGuess ending reached";
  } else if (midpointPending) {
    $("diagnosticPhase").textContent = "MAPGUESS · MOVING TARGET";
    $("diagnosticSummary").textContent = "Five rebuild units remain saved. Acknowledge the unchanged road and moved destination before anchoring anything.";
    $("diagnosticAdvance").textContent = "Acknowledge Moving Target first";
  } else if (goalRequired) {
    $("diagnosticPhase").textContent = "MAPGUESS · ROUTE GOAL REQUIRED";
    $("diagnosticSummary").textContent = "Two destination anchors are saved. Choose fastest, safest, scenic, or accessible before the final anchor reading.";
    $("diagnosticAdvance").textContent = "Choose a route goal first";
  } else if (view.midpoint.acknowledged) {
    const next = MAPGUESS_ANCHOR_UNITS[view.progress.anchorCompletedCount];
    $("diagnosticPhase").textContent = `MAPGUESS ANCHORS · ${view.progress.anchorCompletedCount} OF 3`;
    $("diagnosticSummary").textContent = `${view.progress.completedUnitCount} simulated readings · next result ${next?.visibleRepair.toLowerCase() ?? "locks the route"}`;
    $("diagnosticAdvance").textContent = "Skip simulated MapGuess reading →";
  } else {
    const next = MAPGUESS_REBUILD_UNITS[view.progress.rebuildCompletedCount];
    $("diagnosticPhase").textContent = `MAPGUESS REBUILD · ${view.progress.rebuildCompletedCount} OF 5`;
    $("diagnosticSummary").textContent = `${view.progress.rebuildCompletedCount} simulated reading${view.progress.rebuildCompletedCount === 1 ? "" : "s"} · next result ${next?.visibleRepair.toLowerCase() ?? "proves Moving Target"}`;
    $("diagnosticAdvance").textContent = "Skip simulated MapGuess reading →";
  }
  $("diagnosticAdvance").disabled = view.secured || midpointPending || goalRequired;
}

function openMapGuessExperience() {
  state.selectedSiteId = "mapguess";
  hideCharacterDialog();
  const visibleState = state.mapguessDiagnosticMode ? state.mapguessDiagnosticState : state.mapguessState;
  renderMapGuessCampaign(visibleState, { diagnosticMode: state.mapguessDiagnosticMode });
  renderMapGuessDiagnosticPanel(visibleState);
  show("mapguess");
}

function openFacePlaceExperience() {
  state.selectedSiteId = "faceplace";
  hideCharacterDialog();
  const visibleState = state.faceplaceDiagnosticMode
    ? state.faceplaceDiagnosticState
    : state.faceplaceState;
  renderFacePlaceCampaign(visibleState, { diagnosticMode: state.faceplaceDiagnosticMode });
  renderFacePlaceDiagnosticPanel(visibleState);
  show("faceplace");
}

function openThreadItExperience() {
  state.selectedSiteId = "threadit";
  hideCharacterDialog();
  const visibleState = state.threaditDiagnosticMode
    ? state.threaditDiagnosticState
    : state.threaditState;
  renderThreadItCampaign(visibleState, { diagnosticMode: state.threaditDiagnosticMode });
  renderThreadItDiagnosticPanel(visibleState);
  show("threadit");
}

function keepPreparationVisible() {
  if (!state.preparing) return false;
  show("setup");
  $("modelProgress").textContent = "Microphone and local model setup are still running.";
  return true;
}

function openRecoverySite(siteId) {
  if (keepPreparationVisible()) return;
  if (state.listening || (state.finishing && !state.result)) {
    show("read");
    $("readerState").textContent = "Finish the active reading before opening another window.";
    return;
  }
  const site = getRecoverySite(siteId);
  state.selectedSiteId = site.id;
  if (site.id === "wikiwhy" && site.playable) {
    openWikiWhyExperience();
    return;
  }
  if (site.id === "threadit" && site.runtimeAvailable) {
    openThreadItExperience();
    return;
  }
  if (site.id === "faceplace" && site.runtimeAvailable) {
    openFacePlaceExperience();
    return;
  }
  if (site.id === "mapguess" && site.runtimeAvailable) {
    openMapGuessExperience();
    return;
  }
  renderSitePreview(site);
}

function returnToHub() {
  if (keepPreparationVisible()) return;
  if (state.listening || (state.finishing && !state.result)) {
    show("read");
    $("readerState").textContent = "Finish the active reading before returning to the Recovery Map.";
    return;
  }
  hideCharacterDialog();
  state.evidenceReceiptOpen = false;
  state.faceplaceEvidenceReceiptOpen = false;
  state.faceplaceProfilePanelOpen = false;
  state.faceplaceSelectedReasonCardId = null;
  state.faceplaceWhyOpen = false;
  clearTimeout(state.faceplaceTransitionTimer);
  state.faceplaceShowActOneResult = false;
  state.mapguessEvidenceReceiptOpen = false;
  state.mapguessInspectorOpen = false;
  renderRecoveryHub();
  show("hub");
}

function showDesktopMessage(message) {
  if (keepPreparationVisible()) return;
  if (state.listening || (state.finishing && !state.result)) {
    show("read");
    $("readerState").textContent = "Finish the active reading before inspecting desktop objects.";
    return;
  }
  renderRecoveryHub();
  show("hub");
  const support = $("amySupportMessage");
  if (support) support.innerHTML = `<b>Desktop object inspected.</b> ${message}`;
}

function positionTechnoAtRepair(percent, { animate = true } = {}) {
  const sprite = $("technoRepairSprite");
  const previous = Number(sprite.dataset.progress ?? 0);
  const next = Math.min(100, Math.max(0, Number(percent) || 0));
  const movedBackward = next < previous;
  if (movedBackward) sprite.classList.add("is-repositioning");
  sprite.style.left = `clamp(118px, ${next}%, calc(100% - 52px))`;
  sprite.dataset.progress = String(next);
  if (movedBackward) {
    void sprite.offsetWidth;
    requestAnimationFrame(() => sprite.classList.remove("is-repositioning"));
  } else if (animate && next > previous) {
    animateTechnoProgress();
  }
}

function campaignView(campaignState) {
  const phase = campaignState.phase ?? "act-one";
  if (phase === "secured") return { label: "SITE SECURED", percent: 100, status: "SOURCE CHECKS RESTORED" };
  if (phase === "shield") return {
    label: "SHIELD STABILIZATION",
    percent: campaignState.shieldProgress,
    status: `SHIELD PROTOCOL · ${campaignState.shieldPass} OF 3`,
  };
  if (phase === "reverse-hack") return { label: "SITE STABILITY", percent: 80, status: "LIVE CORRUPTION DETECTED" };
  const stability = campaignState.stability ?? 0;
  return {
    label: "SITE STABILITY",
    percent: stability,
    status: stability >= 70 ? "BACKGROUND WRITE DETECTED" : stability > 0 ? "STATUS: RECOVERING" : "STATUS: CORRUPTED",
  };
}

function renderWikiWhyCampaignOverlay(campaignState) {
  const phase = campaignState.phase ?? "act-one";
  const backgroundClue = phase === "act-one" && campaignState.stability >= 70;
  $("wikiwhyAiRewriteLayer").hidden = phase !== "reverse-hack";
  const sourceConnections = $("wikiwhySourceConnections");
  const sourceLinksConnected = phase === "secured" || (phase === "shield" && campaignState.shieldPass >= 2);
  const sourceLabels = ["Methods and measurements", "Limits and alternatives", "Replication record"];
  sourceConnections.hidden = phase !== "shield" && phase !== "secured";
  sourceConnections.dataset.connected = String(sourceLinksConnected);
  sourceConnections.setAttribute("aria-label", sourceLinksConnected
    ? "Source origins connected to supported claims"
    : "Source origins pending connection");
  sourceConnections.querySelectorAll("li").forEach((item, index) => {
    item.querySelector("b").textContent = sourceLinksConnected ? "LINKED →" : "MISSING LINK";
    item.querySelector("[data-source-label]").textContent = sourceLinksConnected
      ? sourceLabels[index]
      : "Source origin pending";
  });
  if (phase !== "secured") state.evidenceReceiptOpen = false;
  const overlay = $("wikiwhyCampaignOverlay");
  const technoState = $("campaignTechnoState");
  $("wikiwhyBackgroundReplacement").hidden = !backgroundClue;
  overlay.hidden = phase === "act-one" && !backgroundClue;
  $("technoRepairSprite").hidden = phase === "reverse-hack" || phase === "secured";
  if (phase === "act-one" && !backgroundClue) return;
  const checklist = $("shieldChecklist");
  const evidence = $("wikiwhyEvidenceReceipt");
  const evidenceButton = $("openWikiWhyEvidence");
  const securedSeal = $("wikiwhySecuredSeal");
  checklist.hidden = phase !== "shield" && phase !== "secured";
  evidenceButton.hidden = phase !== "secured";
  evidenceButton.setAttribute("aria-expanded", String(phase === "secured" && state.evidenceReceiptOpen));
  evidenceButton.textContent = state.evidenceReceiptOpen ? "Close WIKIWHY_TRACE_01.LOG" : "Open WIKIWHY_TRACE_01.LOG";
  evidence.hidden = phase !== "secured" || !state.evidenceReceiptOpen;
  overlay.classList.toggle("compact-secured", phase === "secured" && !state.evidenceReceiptOpen);
  securedSeal.hidden = phase !== "secured";
  technoState.hidden = phase === "shield";
  if (backgroundClue) {
    technoState.src = TECHNO_ALERT_BALL_PIN_URL;
    technoState.alt = "Techno pins her orange-and-blue ball while watching the unexpected background route.";
  } else if (phase === "reverse-hack") {
    technoState.src = TECHNO_BARK_BALL_URL;
    technoState.alt = "Techno barks beside her orange-and-blue ball as the ended-command write continues.";
  } else if (phase === "secured") {
    technoState.src = state.evidenceReceiptOpen ? TECHNO_SUSPICIOUS_FILE_URL : TECHNO_CELEBRATE_SPIN_URL;
    technoState.alt = state.evidenceReceiptOpen
      ? "Techno braces a recovered file while inspecting the route evidence."
      : "Techno spins beneath her orange-and-blue ball while the access-denied log stays visible.";
  }
  const shieldLabels = ["CONTENT", "LINKS", "ACCESS"];
  checklist.querySelectorAll("li").forEach((item, index) => {
    const complete = phase === "secured" || index < campaignState.shieldPass;
    item.classList.toggle("complete", complete);
    item.textContent = `${complete ? "Complete" : "Pending"} — ${shieldLabels[index]}`;
  });
  if (backgroundClue) {
    $("campaignOverlayEyebrow").textContent = "BACKGROUND WRITE DETECTED";
    $("campaignOverlayHeading").textContent = "The saved repair is holding. A route is still open.";
    $("campaignOverlayBody").textContent = "Writer unknown · route open · change pending";
  } else if (phase === "reverse-hack") {
    $("campaignOverlayEyebrow").textContent = state.campaignPersisted
      ? "READINGS SAVED · EVIDENCE SAVED"
      : "PRESERVED IN THIS TAB · NOT SAVED FOR RELOAD";
    $("campaignOverlayHeading").textContent = "AUTOMATIC WRITE DETECTED. SAVED REPAIR PRESERVED.";
    $("campaignOverlayBody").textContent = "Writer: ai_repair_service · Command: ended · Write status: active";
  } else if (phase === "shield") {
    $("campaignOverlayEyebrow").textContent = `SHIELD PROTOCOL · ${campaignState.shieldPass} OF 3`;
    const shieldHeadings = [
      "SHIELD PROTOCOL READY · CONTENT, LINKS, ACCESS",
      "SHIELD PROTOCOL 1 OF 3 · CONTENT LAYER",
      "SHIELD PROTOCOL 2 OF 3 · EVIDENCE LINKS",
    ];
    const shieldBodies = [
      "Three accepted readings remain. No hidden fourth pass.",
      "CONTENT SNAPSHOT RESTORED · two accepted readings remain.",
      "SOURCE ORIGIN VISIBLE · one accepted reading remains.",
    ];
    $("campaignOverlayHeading").textContent = shieldHeadings[campaignState.shieldPass];
    $("campaignOverlayBody").textContent = shieldBodies[campaignState.shieldPass];
  } else {
    $("campaignOverlayEyebrow").textContent = "WIKIWHY SECURED";
    $("campaignOverlayHeading").textContent = "SOURCE CHECKS RESTORED";
    $("campaignOverlayBody").textContent = "CONTENT · LINKS · ACCESS sealed. Contributions stay open; evidence checks stay required.";
  }
}

function renderCampaignMeter(campaignState, { diagnosticMode = false } = {}) {
  const view = campaignView(campaignState);
  const phase = campaignState.phase ?? "act-one";
  $("campaignMeterLabel").textContent = view.label;
  $("campaignMeterValue").textContent = `${view.percent}%`;
  $("campaignMeterFill").style.width = `${view.percent}%`;
  $("campaignMeter").dataset.phase = phase;
  $("campaignMeter").setAttribute("aria-label", view.label.toLowerCase());
  $("campaignMeter").setAttribute("aria-valuenow", String(view.percent));
  $("campaignMeter").setAttribute("aria-valuetext", phase === "shield"
    ? `${campaignState.shieldPass} of 3 shield repairs sealed`
    : phase === "secured"
      ? "3 of 3 shield repairs sealed; WikiWhy secured"
      : `${view.percent}% WikiWhy site stability`);
  const repairStage = document.querySelector(".repair-stage");
  const backgroundClue = phase === "act-one" && campaignState.stability >= 70;
  repairStage.classList.toggle("background-write-clue", backgroundClue);
  repairStage.classList.toggle("live-corruption", phase === "reverse-hack");
  repairStage.classList.toggle("shield-mode", phase === "shield");
  repairStage.classList.toggle("site-secured", phase === "secured");
  repairStage.dataset.shieldPass = phase === "shield" ? String(campaignState.shieldPass) : phase === "secured" ? "3" : "";
  repairStage.setAttribute("aria-label", phase === "secured"
    ? "WikiWhy secured. Techno celebrates beside the access-denied log."
    : phase === "reverse-hack"
      ? "A right-to-left automated rewrite appears over the saved WikiWhy repair."
      : phase === "shield"
        ? `WikiWhy Shield Protocol ${campaignState.shieldPass} of 3.`
        : backgroundClue
          ? "WikiWhy repair remains stable while a faint right-edge write route is detected."
          : "WikiWhy page repairing from corrupted to evidence-based as confirmed reading progress advances.");
  renderWikiWhyCampaignOverlay(campaignState);
  $("wikiwhyBrowserTitle").textContent = phase === "secured"
    ? "WIKIWHY — INTERNET ENCYCLOPEDIA · SECURED"
    : "WIKIWHY — INTERNET ENCYCLOPEDIA";
  $("wikiwhySecurityStatus").textContent = phase === "secured" ? "CONNECTION: VERIFIED" : "CONNECTION: QUESTIONABLE";
  $("siteStatus").textContent = view.status;
  $("siteStatus").style.color = phase === "reverse-hack" || backgroundClue ? "#a6231d" : phase === "secured" ? "#246b3c" : "#173968";
  const siteVisualPercent = calculateWikiWhySiteVisualPercent({
    campaignPercent: view.percent,
    campaignState,
  });
  $("repairFill").style.width = `${siteVisualPercent}%`;
  $("repairEdge").style.left = `${siteVisualPercent}%`;
  positionTechnoAtRepair(siteVisualPercent, { animate: diagnosticMode });
  $("repairPercent").textContent = diagnosticMode
    ? `${view.percent}% campaign test`
    : phase === "shield"
      ? `${campaignState.shieldPass} of 3 shield repairs sealed`
      : phase === "secured"
        ? "Unauthorized write blocked"
        : `${view.percent}% site stability`;
  if (diagnosticMode) $("latency").textContent = "SIMULATED · no speech engine used";
}

function renderDiagnosticPanel(campaignState) {
  const view = campaignView(campaignState);
  const phase = campaignState.phase ?? "act-one";
  $("diagnosticPhase").textContent = `${view.label} · ${view.percent}%`;
  $("diagnosticSummary").textContent = phase === "secured"
    ? `${campaignState.simulatedPassages} simulated passages · WikiWhy ending reached.`
    : phase === "shield"
      ? `${campaignState.simulatedPassages} simulated passages · ${3 - campaignState.shieldPass} shield repairs remain.`
      : phase === "reverse-hack"
        ? `${campaignState.simulatedPassages} simulated passages · apparent completion reached; live overwrite waiting.`
        : `${campaignState.simulatedPassages} simulated passages · next strong test result advances 19%.`;
  $("diagnosticAdvance").textContent = phase === "secured" ? "Ending reached" : phase === "shield" ? "Skip simulated shield passage →" : "Skip simulated passage →";
  $("diagnosticAdvance").disabled = phase === "secured" || phase === "reverse-hack";
}

function hideCharacterDialog() {
  const layer = $("characterDialogLayer");
  layer.hidden = true;
  for (const child of document.querySelector(".recovery-desktop").children) {
    if (child !== layer) child.inert = false;
  }
  state.dialogAction = null;
  state.dialogDismissible = true;
  const returnFocus = state.dialogReturnFocus;
  state.dialogReturnFocus = null;
  if (returnFocus?.isConnected && !returnFocus.disabled) returnFocus.focus({ preventScroll: true });
}

function showCharacterDialog(dialogId, action = hideCharacterDialog) {
  const dialogue = WIKIWHY_DIALOGUES[dialogId];
  if (!dialogue) return;
  let body = dialogue.body;
  let eyebrow = dialogue.eyebrow;
  let heading = dialogue.heading;
  let meta = dialogue.meta;
  if (!state.campaignPersisted && dialogId === "reverse-hack-amy") {
    body = "Good news: Finn’s work is preserved in this tab. Bad news: the browser did not save it for reload, and your shortcut is still typing.";
    eyebrow = "PRESERVED IN THIS TAB · NOT SAVED FOR RELOAD";
  }
  if (!state.campaignPersisted && dialogId === "site-secured-amy") {
    eyebrow = "WIKIWHY SECURED · TAB ONLY";
    heading = "Evidence recovered for this tab.";
    meta = "Browser storage unavailable · not saved for reload";
  }
  const layer = $("characterDialogLayer");
  if (layer.hidden) state.dialogReturnFocus = document.activeElement;
  $("characterDialog").dataset.speaker = dialogue.speaker;
  $("dialogTitle").textContent = dialogue.title;
  $("dialogPortrait").src = dialogue.portrait;
  $("dialogPortrait").alt = `${dialogue.speaker === "amy" ? "Amy" : "Chinmay"} portrait`;
  $("dialogEyebrow").textContent = eyebrow;
  $("dialogHeading").textContent = heading;
  $("dialogBody").textContent = body;
  $("dialogMeta").hidden = !meta;
  $("dialogMeta").textContent = meta ?? "";
  $("dialogComparison").hidden = !dialogue.comparison;
  $("characterDialog").setAttribute("aria-describedby", getWikiWhyDialogDescriptionIds({
    comparison: dialogue.comparison,
    meta,
  }));
  $("dialogAction").textContent = dialogue.action;
  state.dialogAction = action;
  state.dialogDismissible = isWikiWhyDialogDismissible(dialogId);
  for (const child of document.querySelector(".recovery-desktop").children) {
    if (child !== layer) child.inert = true;
  }
  layer.hidden = false;
  $("dialogHeading").focus({ preventScroll: true });
}

function showWikiWhySecuredSequence() {
  showCharacterDialog("site-secured-amy", () => showCharacterDialog("site-secured", returnToHub));
}

function showRealRewriteSequence({ includeWarning = false } = {}) {
  const showRewrite = () => showCharacterDialog("reverse-hack-ready", () => {
    showCharacterDialog("reverse-hack-amy", beginRealShieldSequence);
  });
  if (includeWarning) showCharacterDialog("amy-warning", showRewrite);
  else showRewrite();
}

function beginRealShieldSequence() {
  hideCharacterDialog();
  const transition = beginWikiWhyShield(localStateStorage, {
    currentState: state.campaignState,
    startedAt: new Date().toISOString(),
  });
  state.campaignState = transition.state;
  state.campaignPersisted = transition.ok;
  renderCampaignMeter(state.campaignState);
  renderSavedRepair(state.campaignState, { persisted: state.campaignPersisted });
  renderRecoveryHub();
  show("read");
  if (state.campaignState.phase === "secured") {
    $("readerState").textContent = "WIKIWHY SECURED · UNAUTHORIZED WRITE BLOCKED";
    $("progressText").textContent = "Evidence file recovered · return to the Recovery Map to inspect Case File slot 1";
    showWikiWhySecuredSequence();
    return;
  }
  const remaining = 3 - state.campaignState.shieldPass;
  $("readerState").textContent = state.campaignState.shieldPass
    ? `SHIELD PROTOCOL RESUMED · ${remaining} REPAIR${remaining === 1 ? "" : "S"} REMAIN`
    : "SHIELD PROTOCOL READY · EXACTLY THREE REPAIRS REMAIN";
  $("progressText").textContent = "Reading metrics remain visible; each accepted Shield reading seals one pass";
  if (state.campaignState.shieldPass) {
    showCharacterDialog(`shield-pass-${state.campaignState.shieldPass}`, openNextCampaignReading);
  } else {
    showCharacterDialog("shield-intro", openNextCampaignReading);
  }
}

function configurePostResultButton() {
  $("continueResult").disabled = false;
  $("again").disabled = true;
  $("again").textContent = "Passage already counted";
  if (state.campaignState.phase === "secured") {
    $("continueResult").textContent = "Return to Recovery Map";
    return;
  }
  if (state.campaignState.phase === "reverse-hack") {
    $("continueResult").textContent = "Review background write";
    return;
  }
  const next = selectNextWikiWhyPassage(state.campaignState);
  $("continueResult").textContent = next.passage ? "Load next recovered file" : "View content status";
}

function handleRealCampaignEvents(events) {
  if (events.includes("site-secured")) {
    showWikiWhySecuredSequence();
    return;
  }
  if (events.includes("shield-pass-complete")) {
    showCharacterDialog(`shield-pass-${state.campaignState.shieldPass}`, openNextCampaignReading);
    return;
  }
  if (events.includes("reverse-hack-ready")) {
    showRealRewriteSequence({ includeWarning: events.includes("amy-warning") });
    return;
  }
  if (events.includes("amy-warning")) showCharacterDialog("amy-warning");
}

async function discardActiveReadingForDiagnostics() {
  state.listening = false;
  state.finishing = false;
  clearInterval(state.monitor);
  if (capture.active) await capture.stop();
  $("voicePulse").classList.remove("speaking");
}

function applyDiagnosticState(nextState) {
  const saved = saveWikiWhyDiagnosticState(localStateStorage, nextState);
  state.diagnosticMode = true;
  state.diagnosticState = saved.state;
  renderCampaignMeter(saved.state, { diagnosticMode: true });
  renderDiagnosticPanel(saved.state);
  show("read");
  $("readerState").textContent = `TEST PASS ${saved.state.simulatedPassages} COMPLETE · NEXT SIMULATED PASSAGE READY`;
  $("progressText").textContent = "Diagnostic mode · no reading score created";
  return saved.state;
}

function beginDiagnosticShield() {
  hideCharacterDialog();
  const transition = beginWikiWhyShieldProtocol(state.diagnosticState);
  applyDiagnosticState(transition.state);
  showCharacterDialog("shield-intro");
}

async function advanceDiagnosticExperience() {
  if (state.selectedSiteId === "mapguess") {
    await advanceMapGuessDiagnosticExperience();
    return;
  }
  if (state.selectedSiteId === "faceplace") {
    await advanceFacePlaceDiagnosticExperience();
    return;
  }
  if (state.selectedSiteId === "threadit") {
    await advanceThreadItDiagnosticExperience();
    return;
  }
  if (keepPreparationVisible()) return;
  await discardActiveReadingForDiagnostics();
  const current = state.diagnosticState ?? readWikiWhyDiagnosticState(localStateStorage);
  const transition = advanceWikiWhyDiagnostic(current);
  const next = applyDiagnosticState(transition.state);
  diagnostic("wrapper-diagnostic-advance", { event: transition.event, phase: next.phase, simulatedPassages: next.simulatedPassages });
  if (transition.event === "amy-warning") showCharacterDialog("amy-warning");
  if (transition.event === "reverse-hack-ready") showCharacterDialog("reverse-hack-ready", () => {
    showCharacterDialog("reverse-hack-amy", beginDiagnosticShield);
  });
  if (transition.event === "shield-pass-complete") showCharacterDialog(`shield-pass-${next.shieldPass}`);
  if (transition.event === "site-secured") {
    showWikiWhySecuredSequence();
  }
}

function applyThreadItDiagnosticState(nextState) {
  state.threaditDiagnosticMode = true;
  state.threaditDiagnosticState = nextState;
  renderThreadItCampaign(nextState, { diagnosticMode: true });
  renderThreadItDiagnosticPanel(nextState);
  renderRecoveryHub();
  show("threadit");
}

async function advanceThreadItDiagnosticExperience() {
  if (keepPreparationVisible()) return;
  await discardActiveReadingForDiagnostics();
  const current = state.threaditDiagnosticState ?? readThreadItState(null);
  const view = getThreadItCampaignView(current);
  if (view.secured || (view.midpoint.discovered && !view.midpoint.acknowledged)) {
    applyThreadItDiagnosticState(current);
    return;
  }
  const ordinal = view.progress.completedUnitCount + 1;
  const transition = advanceThreadItState(current, {
    completedAt: new Date().toISOString(),
    outcome: calculateThreadItReadingOutcome({ campaignState: current }),
    passageId: `threadit-diagnostic-passage-${ordinal}`,
    sessionId: `threadit-diagnostic-session-${ordinal}`,
  });
  if (!transition.ok) throw new Error(transition.reason ?? "ThreadIt diagnostic did not advance");
  if (transition.events.includes("site-secured")) state.threaditEvidenceReceiptOpen = false;
  applyThreadItDiagnosticState(transition.state);
  if (transition.events.includes("midpoint-discovered")) {
    requestAnimationFrame(() => $("threaditMidpointAction").focus({ preventScroll: true }));
  }
  if (transition.events.includes("blocked-write-recorded")) {
    $("threaditLiveStatus").textContent = "SOURCE TREE STABLE. POSTING PAUSED: DUPLICATE SOURCE. THREADIT_TRACE_01.LOG saved to Case File slot 2.";
  }
  diagnostic("threadit-wrapper-diagnostic-advance", {
    completedUnitIds: transition.state.completedUnitIds,
    events: transition.events,
    stateId: transition.state.stateId,
  });
}

function resetThreadItDiagnosticExperience() {
  state.threaditDiagnosticMode = true;
  state.threaditEvidenceReceiptOpen = false;
  applyThreadItDiagnosticState(readThreadItState(null));
  $("threaditLiveStatus").textContent = "THREADIT TEST RESET · NO READING SCORE CREATED";
}

function applyFacePlaceDiagnosticState(nextState) {
  state.faceplaceDiagnosticMode = true;
  state.faceplaceDiagnosticState = nextState;
  renderFacePlaceCampaign(nextState, { diagnosticMode: true });
  renderFacePlaceDiagnosticPanel(nextState);
  renderRecoveryHub();
  show("faceplace");
}

async function advanceFacePlaceDiagnosticExperience() {
  if (keepPreparationVisible()) return;
  await discardActiveReadingForDiagnostics();
  const current = state.faceplaceDiagnosticState ?? readFacePlaceState(null);
  const view = getFacePlaceCampaignView(current);
  if (view.secured || (view.midpoint.discovered && !view.midpoint.acknowledged)) {
    applyFacePlaceDiagnosticState(current);
    return;
  }
  const ordinal = view.progress.completedUnitCount + 1;
  const transition = advanceFacePlaceState(current, {
    completedAt: new Date().toISOString(),
    outcome: calculateFacePlaceReadingOutcome({ campaignState: current }),
    passageId: `faceplace-diagnostic-passage-${ordinal}`,
    sessionId: `faceplace-diagnostic-session-${ordinal}`,
  });
  if (!transition.ok) throw new Error(transition.reason ?? "FacePlace diagnostic did not advance");
  if (transition.events.includes("site-secured")) state.faceplaceEvidenceReceiptOpen = false;
  if (transition.events.includes("midpoint-discovered")) {
    state.faceplaceShowActOneResult = true;
    applyFacePlaceDiagnosticState(transition.state);
    clearTimeout(state.faceplaceTransitionTimer);
    const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900;
    state.faceplaceTransitionTimer = setTimeout(() => {
      if (!state.faceplaceDiagnosticMode || state.faceplaceDiagnosticState !== transition.state) return;
      state.faceplaceShowActOneResult = false;
      renderFacePlaceCampaign(transition.state, { diagnosticMode: true });
      renderFacePlaceDiagnosticPanel(transition.state);
      requestAnimationFrame(() => $("faceplaceMidpointAction").focus({ preventScroll: true }));
    }, delay);
  } else {
    state.faceplaceShowActOneResult = false;
    applyFacePlaceDiagnosticState(transition.state);
  }
  if (transition.events.includes("provisional-blocked-write-recorded")) {
    $("faceplaceLiveStatus").textContent = "FEED RECOVERY VERIFIED. FORCED DISTRIBUTION: OFF. Provisional slot-3 test receipt available.";
  }
  diagnostic("faceplace-wrapper-diagnostic-advance", {
    completedUnitIds: transition.state.completedUnitIds,
    events: transition.events,
    stateId: transition.state.stateId,
  });
}

function resetFacePlaceDiagnosticExperience() {
  clearTimeout(state.faceplaceTransitionTimer);
  state.faceplaceDiagnosticMode = true;
  state.faceplaceEvidenceReceiptOpen = false;
  state.faceplaceWhyOpen = false;
  state.faceplaceShowActOneResult = false;
  applyFacePlaceDiagnosticState(readFacePlaceState(null));
  $("faceplaceLiveStatus").textContent = "FACEPLACE TEST RESET · NO READING SCORE CREATED";
}

function applyMapGuessDiagnosticState(nextState) {
  state.mapguessDiagnosticMode = true;
  state.mapguessDiagnosticState = nextState;
  renderMapGuessCampaign(nextState, { diagnosticMode: true });
  renderMapGuessDiagnosticPanel(nextState);
  renderRecoveryHub();
  show("mapguess");
}

async function advanceMapGuessDiagnosticExperience() {
  if (keepPreparationVisible()) return;
  await discardActiveReadingForDiagnostics();
  const current = state.mapguessDiagnosticState ?? readMapGuessState(null);
  const view = getMapGuessCampaignView(current);
  if (view.secured || view.midpoint.actionRequired || view.goals.goalRequired) {
    applyMapGuessDiagnosticState(current);
    if (view.midpoint.actionRequired) requestAnimationFrame(() => {
      $("mapguessMidpointAction").scrollIntoView({ block: "nearest" });
      $("mapguessMidpointAction").focus({ preventScroll: true });
    });
    if (view.goals.goalRequired) requestAnimationFrame(() => $("mapguessGoalSelector").scrollIntoView({ block: "nearest" }));
    return;
  }
  const ordinal = view.progress.completedUnitCount + 1;
  const transition = advanceMapGuessState(current, {
    completedAt: new Date().toISOString(),
    outcome: calculateMapGuessReadingOutcome({ campaignState: current }),
    passageId: `mapguess-diagnostic-passage-${ordinal}`,
    sessionId: `mapguess-diagnostic-session-${ordinal}`,
  });
  if (!transition.ok) throw new Error(transition.reason ?? "MapGuess diagnostic did not advance");
  if (transition.events.includes("site-secured")) state.mapguessEvidenceReceiptOpen = false;
  applyMapGuessDiagnosticState(transition.state);
  if (transition.events.includes("midpoint-discovered")) {
    requestAnimationFrame(() => {
      $("mapguessMidpointAction").scrollIntoView({ block: "nearest" });
      $("mapguessMidpointAction").focus({ preventScroll: true });
    });
  }
  if (transition.events.includes("provisional-blocked-write-recorded")) {
    $("mapguessLiveStatus").textContent = "DESTINATION LOCKED. ROUTE AUTO-FIX AI move denied. Provisional slot-10 test receipt available.";
  }
  diagnostic("mapguess-wrapper-diagnostic-advance", {
    completedUnitIds: transition.state.completedUnitIds,
    events: transition.events,
    routeGoal: transition.state.routeGoal,
    stateId: transition.state.stateId,
  });
}

function resetMapGuessDiagnosticExperience() {
  state.mapguessDiagnosticMode = true;
  state.mapguessEvidenceReceiptOpen = false;
  state.mapguessInspectorOpen = false;
  applyMapGuessDiagnosticState(readMapGuessState(null));
  $("mapguessLiveStatus").textContent = "MAPGUESS TEST RESET · NO READING SCORE CREATED";
}

function buildMapGuessPreviewState(unitCount, { routeGoal = "scenic" } = {}) {
  let previewState = readMapGuessState(null);
  for (let index = 0; index < unitCount; index += 1) {
    if (index === MAPGUESS_REBUILD_UNITS.length && !previewState.midpointAcknowledged) {
      previewState = acknowledgeMapGuessMidpointState(previewState, {
        acknowledgedAt: "2026-07-12T00:00:05.500Z",
      }).state;
    }
    if (index === MAPGUESS_REBUILD_UNITS.length + MAPGUESS_ANCHOR_UNITS.length - 1 && !previewState.routeGoal) {
      previewState = setMapGuessRouteGoalState(previewState, routeGoal, {
        selectedAt: "2026-07-12T00:00:07.500Z",
      }).state;
    }
    const transition = advanceMapGuessState(previewState, {
      completedAt: `2026-07-12T00:00:0${index}.000Z`,
      outcome: calculateMapGuessReadingOutcome({ campaignState: previewState }),
      passageId: `mapguess-preview-passage-${index + 1}`,
      sessionId: `mapguess-preview-session-${index + 1}`,
    });
    if (!transition.ok) throw new Error(transition.reason ?? "MapGuess preview state did not advance");
    previewState = transition.state;
  }
  return previewState;
}

function acknowledgeMapGuessMovingTarget() {
  const diagnosticMode = state.mapguessDiagnosticMode;
  const current = diagnosticMode ? state.mapguessDiagnosticState : state.mapguessState;
  const transition = diagnosticMode
    ? acknowledgeMapGuessMidpointState(current, { acknowledgedAt: new Date().toISOString() })
    : acknowledgeMapGuessMidpoint(localStateStorage, {
        acknowledgedAt: new Date().toISOString(),
        currentState: current,
      });
  const usableInTab = ["unavailable", "write-failed"].includes(transition.reason);
  if (!transition.ok && !usableInTab) return;
  if (diagnosticMode) state.mapguessDiagnosticState = transition.state;
  else {
    state.mapguessState = transition.state;
    state.mapguessPersisted = transition.ok;
  }
  renderMapGuessCampaign(transition.state, { diagnosticMode });
  renderMapGuessDiagnosticPanel(transition.state);
  renderRecoveryHub();
  $("mapguessLiveStatus").textContent = transition.ok
    ? "MOVING TARGET ACKNOWLEDGED · CHOOSE A ROUTE GOAL"
    : "MOVING TARGET ACKNOWLEDGED IN THIS TAB ONLY · BROWSER STORAGE UNAVAILABLE";
  requestAnimationFrame(() => {
    $("mapguessGoalSelector").scrollIntoView({ block: "nearest" });
    $("mapguessGoalOptions").querySelector("[data-mapguess-goal]:not([disabled])")?.focus({ preventScroll: true });
  });
}

function setMapGuessGoalFromControl(routeGoal) {
  const diagnosticMode = state.mapguessDiagnosticMode;
  const current = diagnosticMode ? state.mapguessDiagnosticState : state.mapguessState;
  const transition = diagnosticMode
    ? setMapGuessRouteGoalState(current, routeGoal, { selectedAt: new Date().toISOString() })
    : setMapGuessRouteGoal(localStateStorage, routeGoal, {
        currentState: current,
        selectedAt: new Date().toISOString(),
      });
  const usableInTab = ["unavailable", "write-failed"].includes(transition.reason);
  if (!transition.ok && !usableInTab) return;
  if (diagnosticMode) state.mapguessDiagnosticState = transition.state;
  else {
    state.mapguessState = transition.state;
    state.mapguessPersisted = transition.ok;
  }
  renderMapGuessCampaign(transition.state, { diagnosticMode });
  renderMapGuessDiagnosticPanel(transition.state);
  renderRecoveryHub();
  $("mapguessLiveStatus").textContent = transition.ok
    ? `ROUTE GOAL ${String(routeGoal).toUpperCase()} SAVED`
    : `ROUTE GOAL ${String(routeGoal).toUpperCase()} SAVED IN THIS TAB ONLY · BROWSER STORAGE UNAVAILABLE`;
  requestAnimationFrame(() => $("mapguessGoalOptions").querySelector(`[data-mapguess-goal="${routeGoal}"]`)?.focus({ preventScroll: true }));
}

function buildFacePlacePreviewState(unitCount) {
  let previewState = readFacePlaceState(null);
  for (let index = 0; index < unitCount; index += 1) {
    if (index === FACEPLACE_FALSE_TRACKER_UNITS.length && !previewState.midpointAcknowledged) {
      previewState = acknowledgeFacePlaceMidpointState(previewState, {
        acknowledgedAt: "2026-07-12T00:00:03.500Z",
      }).state;
    }
    const transition = advanceFacePlaceState(previewState, {
      completedAt: `2026-07-12T00:00:0${index}.000Z`,
      outcome: calculateFacePlaceReadingOutcome({ campaignState: previewState }),
      passageId: `faceplace-preview-passage-${index + 1}`,
      sessionId: `faceplace-preview-session-${index + 1}`,
    });
    if (!transition.ok) throw new Error(transition.reason ?? "FacePlace preview state did not advance");
    previewState = transition.state;
  }
  return previewState;
}

function acknowledgeFacePlaceHonestZero() {
  const diagnostic = state.faceplaceDiagnosticMode;
  const current = diagnostic ? state.faceplaceDiagnosticState : state.faceplaceState;
  const transition = diagnostic
    ? acknowledgeFacePlaceMidpointState(current, { acknowledgedAt: new Date().toISOString() })
    : acknowledgeFacePlaceMidpoint(localStateStorage, {
        acknowledgedAt: new Date().toISOString(),
        currentState: current,
      });
  if (!transition.ok) return;
  state.faceplaceShowActOneResult = false;
  if (diagnostic) state.faceplaceDiagnosticState = transition.state;
  else {
    state.faceplaceState = transition.state;
    state.faceplacePersisted = transition.ok;
  }
  renderFacePlaceCampaign(transition.state, { diagnosticMode: diagnostic });
  renderFacePlaceDiagnosticPanel(transition.state);
  renderRecoveryHub();
  requestAnimationFrame(() => $("faceplaceTracker").focus?.({ preventScroll: true }));
}

function setFacePlaceFeedModeFromControl(feedMode) {
  const diagnostic = state.faceplaceDiagnosticMode;
  const current = diagnostic ? state.faceplaceDiagnosticState : state.faceplaceState;
  const transition = diagnostic
    ? setFacePlaceFeedModeState(current, feedMode)
    : setFacePlaceFeedMode(localStateStorage, feedMode, { currentState: current });
  if (!transition.ok) return;
  if (diagnostic) state.faceplaceDiagnosticState = transition.state;
  else {
    state.faceplaceState = transition.state;
    state.faceplacePersisted = transition.ok;
  }
  renderFacePlaceCampaign(transition.state, { diagnosticMode: diagnostic });
  $(feedMode === "chronological" ? "faceplaceChronologicalMode" : "faceplaceRankedMode").focus({ preventScroll: true });
}

function buildThreadItPreviewState(unitCount) {
  let previewState = readThreadItState(null);
  for (let index = 0; index < unitCount; index += 1) {
    if (index === THREADIT_ACT_ONE_UNITS.length && !previewState.midpointAcknowledged) {
      previewState = acknowledgeThreadItMidpointState(previewState, {
        acknowledgedAt: "2026-07-12T00:00:04.000Z",
      }).state;
    }
    const transition = advanceThreadItState(previewState, {
      completedAt: `2026-07-12T00:00:0${index}.000Z`,
      outcome: calculateThreadItReadingOutcome({ campaignState: previewState }),
      passageId: `threadit-preview-passage-${index + 1}`,
      sessionId: `threadit-preview-session-${index + 1}`,
    });
    previewState = transition.state;
  }
  return previewState;
}

function openThreadItView(viewName) {
  const diagnostic = state.threaditDiagnosticMode;
  const current = diagnostic ? state.threaditDiagnosticState : state.threaditState;
  let transition;
  if (viewName === "trace" && current.midpointDiscovered && !current.midpointAcknowledged) {
    transition = diagnostic
      ? acknowledgeThreadItMidpointState(current, { acknowledgedAt: new Date().toISOString() })
      : acknowledgeThreadItMidpoint(localStateStorage, {
          acknowledgedAt: new Date().toISOString(),
          currentState: current,
        });
  } else {
    transition = diagnostic
      ? setThreadItOpenViewState(current, viewName)
      : setThreadItOpenView(localStateStorage, viewName, { currentState: current });
  }
  if (!transition?.state) return;
  if (diagnostic) state.threaditDiagnosticState = transition.state;
  else {
    state.threaditState = transition.state;
    state.threaditPersisted = transition.ok;
  }
  renderThreadItCampaign(transition.state, { diagnosticMode: diagnostic });
  renderThreadItDiagnosticPanel(transition.state);
}

function renderRecoveredFilesShortcut() {
  const wikiWhyEvidenceSaved = state.campaignState.phase === "secured" && state.campaignPersisted;
  const threadItEvidenceSaved = state.threaditState.secured && state.threaditPersisted;
  const evidenceCount = Number(wikiWhyEvidenceSaved) + Number(threadItEvidenceSaved);
  const wikiWhyRepairInTab = state.campaignState.repairCount > 0;
  const wikiWhyRepairSaved = wikiWhyRepairInTab && state.campaignPersisted;
  $("recoveredFilesShortcut").disabled = evidenceCount === 0 && !wikiWhyRepairSaved;
  $("recoveredFilesCount").textContent = evidenceCount
    ? `${evidenceCount} evidence file${evidenceCount === 1 ? "" : "s"}`
    : wikiWhyRepairSaved
      ? `${state.campaignState.repairCount} repair${state.campaignState.repairCount === 1 ? "" : "s"} saved`
      : wikiWhyRepairInTab
        ? "Tab only · not saved"
        : "Empty";
}

function renderSavedRepair(savedState, { persisted = state.campaignPersisted } = {}) {
  renderRecoveredFilesShortcut();
  if (savedState.repairCount < 1) return;
  $("savedRepairReceipt").hidden = false;
  $("savedRepairEyebrow").textContent = persisted ? "LASTING REPAIR FOUND" : "TAB-ONLY REPAIR";
  $("savedStability").textContent = savedState.phase === "shield"
    ? `${savedState.shieldPass}/3`
    : `${savedState.stability}%`;
  $("savedRepairMode").textContent = savedState.phase === "shield" ? "SHIELD PROTOCOL" : savedState.phase === "secured" ? "SITE SECURED" : "SITE STABILITY";
  $("savedRepairCount").textContent = persisted
    ? `${savedState.repairCount} saved repair${savedState.repairCount === 1 ? "" : "s"}`
    : `${savedState.repairCount} tab-only repair${savedState.repairCount === 1 ? "" : "s"}`;
  $("savedReaction").textContent = savedState.lastReaction || "That held.";
  $("savedRepairStatus").hidden = false;
  $("savedRepairStatus").textContent = !persisted
    ? "This result is available in the current tab, but the browser did not save it for reload. Audio and transcript text were not saved."
    : savedState.phase === "secured"
    ? "WikiWhy is secured on this device. The unauthorized write was blocked and evidence slot 1 is available."
    : savedState.phase === "shield"
      ? `Shield Protocol is ${savedState.shieldPass} of 3 on this device. Audio and transcript text were not saved.`
      : savedState.phase === "reverse-hack"
        ? "Readings saved. Evidence saved. A background automated write was detected at 80% site stability."
        : `WikiWhy is ${savedState.stability}% stable on this device. Audio and transcript text were not saved.`;
}

function renderRepairOutcome(repairState, persisted) {
  $("repairOutcome").hidden = false;
  const shieldResult = repairState.phase === "shield" || repairState.phase === "secured";
  const previousStability = Math.max(0, repairState.stability - repairState.lastAdvance);
  const previousShieldPass = Math.max(0, repairState.shieldPass - 1);
  $("stabilityBefore").textContent = shieldResult ? `${previousShieldPass}/3` : `${previousStability}%`;
  $("stabilityAfter").textContent = shieldResult ? `${repairState.shieldPass}/3` : `${repairState.stability}%`;
  $("stabilityGain").textContent = shieldResult ? "+1 PASS" : `+${repairState.lastAdvance}%`;
  const meterValue = shieldResult ? repairState.shieldProgress : repairState.stability;
  $("stabilityFill").style.width = `${meterValue}%`;
  $("stabilityMeter").setAttribute("aria-label", shieldResult ? "Shield Protocol progress" : "WikiWhy site stability");
  $("stabilityMeter").setAttribute("aria-valuenow", String(meterValue));
  $("stabilityMeter").setAttribute("aria-valuetext", shieldResult
    ? `${repairState.shieldPass} of 3 shield repairs sealed`
    : `${repairState.stability}% WikiWhy site stability`);
  $("repairReaction").textContent = repairState.lastReaction;
  $("repairPersistence").textContent = persisted
    ? repairState.phase === "reverse-hack"
      ? "READINGS SAVED · EVIDENCE SAVED · background write isolated"
      : repairState.phase === "secured"
        ? "READING SAVED · EVIDENCE FILE RECOVERED · available after reload"
        : "Reading saved · repair state saved · available after reload"
    : "Repair applied for this tab. This browser did not save it for reload.";
}

function animateTechnoProgress() {
  const image = $("technoRepairSpriteImage");
  clearTimeout(state.technoTimer);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    image.src = TECHNO_PROGRESS_STILL_URL;
    return;
  }
  image.src = TECHNO_PROGRESS_STILL_URL;
  requestAnimationFrame(() => { image.src = TECHNO_PROGRESS_LOOP_URL; });
  state.technoTimer = setTimeout(() => { image.src = TECHNO_PROGRESS_STILL_URL; }, 2_050);
}

function renderPassage(progress = state.confirmedProgress) {
  const passage = $("passage");
  const previousScrollTop = passage.scrollTop;
  const allTokens = tokenizeText(PASSAGE);
  const confirmed = Math.round(progress * allTokens.length);
  let cursor = 0;
  passage.innerHTML = PARAGRAPHS.map((paragraph, paragraphIndex) => {
    const words = paragraph.split(/([\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*)/gu).map((part) => {
      if (!/^[\p{L}\p{N}]/u.test(part)) return part;
      const className = cursor < confirmed ? "confirmed" : "";
      cursor += 1;
      return `<span class="word ${className}">${part}</span>`;
    }).join("");
    const paragraphStart = cursor - tokenizeText(paragraph).length;
    const active = confirmed >= paragraphStart && confirmed < cursor;
    return `<p class="reading-paragraph ${active ? "active" : ""}" data-paragraph="${paragraphIndex}">${words}</p>`;
  }).join("");
  passage.scrollTop = previousScrollTop;
}

function updateReadingGuide() {
  const totalWords = tokenizeText(PASSAGE).length;
  const wordIndex = estimateGuideWordIndex({
    activeSpeechMs: state.guideSpeechMs,
    totalWords,
    wordsPerMinute: state.guideWpm,
  });
  state.guideProgress = Math.max(state.guideProgress, (wordIndex + 1) / totalWords);
  if (performance.now() < state.guidePausedUntil) return;
  const passage = $("passage");
  const firstSegmentWords = tokenizeText(PARAGRAPHS[0]).length;
  if (wordIndex >= firstSegmentWords) {
    const word = passage.querySelectorAll(".word")[wordIndex];
    if (word) {
      const target = centeredGuideScrollTop({
        maximumScrollTop: passage.scrollHeight - passage.clientHeight,
        viewportHeight: passage.clientHeight,
        wordHeight: word.offsetHeight,
        wordOffsetTop: word.offsetTop,
      });
      passage.scrollTop = approachScrollTop(passage.scrollTop, target);
    }
  }
  $("guideStatus").textContent = `Reading guide: ${state.guideWpm} WPM · ${Math.round(state.guideProgress * 100)}%`;
}

function projectedCampaignPercent(readingProgress) {
  const progress = Math.min(1, Math.max(0, Number(readingProgress) || 0));
  const campaign = state.campaignState;
  if (campaign.phase === "secured") return 100;
  if (campaign.phase === "reverse-hack") return 80;
  if (campaign.phase === "shield") {
    const checkpoints = [0, 33, 66, 100];
    const start = checkpoints[campaign.shieldPass] ?? 0;
    const finish = checkpoints[Math.min(3, campaign.shieldPass + 1)] ?? start;
    return Math.round(start + ((finish - start) * progress));
  }
  const start = campaign.stability;
  const finish = Math.min(80, start + 20);
  return Math.round(start + ((finish - start) * progress));
}

function updateProgress(alignment, latencyMs = null) {
  alignment.matchedTokenIndexes.forEach((index) => state.confirmedMatches.add(index));
  state.confirmedProgress = Math.max(state.confirmedProgress, alignment.positionProgress);
  state.confirmedTokenIndex = Math.max(state.confirmedTokenIndex, alignment.furthestMatchedTokenIndex + 1);
  const percent = Math.round(state.confirmedProgress * 100);
  const previousProjected = projectedCampaignPercent(state.repairPercent / 100);
  state.repairPercent = Math.max(state.repairPercent, percent);
  const projected = projectedCampaignPercent(state.repairPercent / 100);
  const previousSiteVisual = calculateWikiWhySiteVisualPercent({
    campaignPercent: previousProjected,
    campaignState: state.campaignState,
  });
  const siteVisual = calculateWikiWhySiteVisualPercent({
    campaignPercent: projected,
    campaignState: state.campaignState,
  });
  $("repairFill").style.width = `${siteVisual}%`;
  $("repairEdge").style.left = `${siteVisual}%`;
  positionTechnoAtRepair(siteVisual, { animate: siteVisual > previousSiteVisual });
  $("repairPercent").textContent = `${percent}% reading confirmed`;
  $("siteStatus").textContent = state.campaignState.phase === "shield"
    ? `SHIELD · ${state.campaignState.shieldPass} OF 3`
    : state.campaignState.phase === "act-one" && state.campaignState.stability >= 70
      ? "BACKGROUND WRITE DETECTED"
    : percent > 0
      ? "STATUS: RECOVERING"
      : campaignView(state.campaignState).status;
  $("siteStatus").classList.remove("complete");
  $("siteStatus").style.color = "#a6231d";
  $("progressText").textContent = `${percent}% confirmed by local transcript`;
  $("latency").textContent = latencyMs == null ? "Waiting for first checkpoint" : `Last checkpoint: ${(latencyMs / 1000).toFixed(1)}s`;
  renderPassage();
}

async function checkpoint(reason) {
  if (!state.listening || state.busy || capture.durationMs < PROFILE.checkpoint.minimumWindowMs) return;
  state.busy = true;
  state.lastCheckpointAt = performance.now();
  $("readerState").textContent = "Checking progress locally…";
  const requestedAt = performance.now();
  try {
    const capturedThroughMs = capture.durationMs;
    const windowStartMs = Math.max(0, state.processedThroughMs - PROFILE.checkpoint.audioOverlapMs);
    const audio = await capture.snapshot({ overlapMs: PROFILE.checkpoint.audioOverlapMs });
    const text = await recognizer.transcribe(audio);
    state.processedThroughMs = capturedThroughMs;
    if (!text || !state.listening) return;
    state.transcriptDiagnostics.push({ reason, text });
    state.finalText = text;
    const startIndex = Math.max(0, state.confirmedTokenIndex - PROFILE.checkpoint.tokenOverlap);
    const alignment = alignTranscript(PASSAGE, text, { lookAhead: 24, startIndex });
    const latencyMs = Math.round(performance.now() - requestedAt);
    updateProgress(alignment, latencyMs);
    diagnostic("checkpoint", {
      audioWindowMs: capturedThroughMs - windowStartMs,
      latencyMs,
      positionProgress: alignment.positionProgress,
      reason,
      startIndex,
    });
  } catch (error) {
    diagnostic("checkpoint-error", { message: error.message, reason });
  } finally {
    state.busy = false;
    if (state.listening) $("readerState").textContent = INTERNET_RECOVERY_COPY["reading.active"];
  }
}

function monitorSpeech() {
  const now = performance.now();
  const elapsedMs = state.lastMonitorAt ? now - state.lastMonitorAt : 0;
  state.lastMonitorAt = now;
  const speaking = capture.level >= SPEECH_LEVEL;
  $("voicePulse").classList.toggle("speaking", speaking);
  if (speaking) {
    state.lastSpeechAt = now;
    state.guideSpeechMs += elapsedMs;
    updateReadingGuide();
  }
  const totalWords = tokenizeText(PASSAGE).length;
  if (!speaking && !state.busy && !state.finishing
    && hasEndEvidence(state.confirmedMatches, totalWords, PROFILE.endDetection)
    && now - state.lastSpeechAt >= PROFILE.endDetection.finalPauseMs) {
    void finishReading();
    return;
  }
  const sinceCheckpoint = now - state.lastCheckpointAt;
  const naturalPause = state.lastSpeechAt > state.lastCheckpointAt
    && now - state.lastSpeechAt >= PROFILE.checkpoint.pauseMs;
  if (!state.busy && ((naturalPause && sinceCheckpoint >= PROFILE.checkpoint.minimumWindowMs)
    || sinceCheckpoint >= PROFILE.checkpoint.maximumWindowMs)) {
    checkpoint(naturalPause ? "natural-pause" : "maximum-window");
  }
}

async function startReading() {
  $("listen").disabled = true;
  $("readerState").textContent = "Starting microphone…";
  await capture.start();
  state.listening = true;
  state.sessionId = createSessionId();
  state.startedAt = performance.now();
  state.lastSpeechAt = state.startedAt;
  state.lastCheckpointAt = state.startedAt;
  state.lastMonitorAt = state.startedAt;
  state.processedThroughMs = 0;
  state.monitor = setInterval(monitorSpeech, 100);
  $("listen").textContent = "Finish now";
  $("listen").disabled = false;
  $("readerState").textContent = INTERNET_RECOVERY_COPY["reading.ready.title"];
  diagnostic("capture-start");
}

function renderReviewResult(summary, durationMs, progress) {
  const pace = estimateReadingPace({ durationMs, expectedText: PASSAGE, wordCount: summary.matchedCount });
  $("finalAccuracy").textContent = `${summary.accuracy}%`;
  $("finalCorrect").textContent = `${summary.matchedCount}/${summary.totalCount}`;
  $("finalSpeed").textContent = `${pace.wpm} WPM`;
  $("finalProgress").textContent = `${Math.round(progress * 100)}%`;
  return pace;
}

async function finishReading() {
  if (state.finishing) return;
  state.finishing = true;
  state.listening = false;
  clearInterval(state.monitor);
  $("listen").disabled = true;
  $("readerState").textContent = "Capturing results…";
  while (state.busy) await new Promise((resolve) => setTimeout(resolve, 100));
  const { audio, durationMs, signal } = await capture.stop();
  const liveMatches = new Set(state.confirmedMatches);
  const liveSummary = summarizeTokenMatches(PASSAGE, liveMatches);
  const livePace = renderReviewResult(liveSummary, durationMs, state.confirmedProgress);
  $("finalizationStatus").textContent = "Reading captured. Finalizing the local transcript… 0.0s";
  $("finalizationStatus").className = "finalization-status working";
  $("finalTranscript").textContent = "Final transcript is still processing locally…";
  $("again").disabled = true;
  $("continueResult").disabled = true;
  $("export").disabled = true;
  show("review");
  const requestedAt = performance.now();
  const finalizationTimer = setInterval(() => {
    const elapsedSeconds = (performance.now() - requestedAt) / 1_000;
    $("finalizationStatus").textContent = `Reading captured. Finalizing the local transcript… ${elapsedSeconds.toFixed(1)}s`;
  }, 250);
  let text = "";
  try {
    text = await recognizer.transcribe(audio);
  } catch (error) {
    diagnostic("final-transcription-error", { message: error.message });
  } finally {
    clearInterval(finalizationTimer);
  }
  state.finalText = text;
  const alignment = alignTranscript(PASSAGE, text, { lookAhead: 24 });
  const finalLatencyMs = Math.round(performance.now() - requestedAt);
  updateProgress(alignment, finalLatencyMs);
  const combined = summarizeTokenMatches(PASSAGE, state.confirmedMatches);
  const pace = renderReviewResult(combined, durationMs, state.confirmedProgress);
  const finalAddedWords = combined.matchedCount - liveSummary.matchedCount;
  state.result = {
    accuracy: combined.accuracy,
    durationMs,
    finalAddedWords,
    finalLatencyMs,
    finalPassMatchedWords: alignment.matchedCount,
    liveAccuracy: liveSummary.accuracy,
    liveMatchedWords: liveSummary.matchedCount,
    liveWpm: livePace.wpm,
    matchedWords: combined.matchedCount,
    progress: state.confirmedProgress,
    signal,
    totalWords: combined.totalCount,
    wpm: pace.wpm,
  };
  const completedAt = new Date().toISOString();
  const storedSession = saveSessionSummary(localStateStorage, {
    completedAt,
    passageId: activePassage.id,
    result: state.result,
    sessionId: state.sessionId,
  });
  $("saveStatus").textContent = storedSession.ok
    ? "Non-audio session summary saved on this device. Audio and transcript text were not saved."
    : "Result is ready, but this browser did not save local history. Audio and transcript text were not saved.";
  diagnostic("session-persistence", { saved: storedSession.ok });
  $("finalizationStatus").textContent = `Final score ready in ${(finalLatencyMs / 1_000).toFixed(1)}s. The final pass added ${finalAddedWords} confirmed words.`;
  $("finalizationStatus").className = "finalization-status ready";
  $("again").disabled = false;
  $("continueResult").disabled = false;
  $("export").disabled = false;
  $("finalTranscript").textContent = text || "No final transcript was returned.";
  $("checkpointTranscripts").textContent = state.transcriptDiagnostics.length
    ? state.transcriptDiagnostics.map(({ reason, text: checkpointText }, index) => (
      `Checkpoint ${index + 1} (${reason})\n${checkpointText}`
    )).join("\n\n")
    : "No live checkpoint transcript was returned.";
  diagnostic("session-finish", state.result);
}

function sessionReport() {
  return {
    appVersion: "wikiwhy-campaign-v3",
    browser: navigator.userAgent,
    checkpoints: state.diagnostics.filter(({ type }) => type.startsWith("checkpoint")),
    completedAt: new Date().toISOString(),
    privacy: { audioUploadedByApp: false, rawAudioStored: false, transcriptIncluded: false, transcriptStored: false },
    result: state.result,
    speechEngine: { device: state.modelDevice, model: MODEL_ID, processing: "in-browser" },
  };
}

async function exportReport() {
  const report = JSON.stringify(sessionReport(), null, 2);
  try {
    await navigator.clipboard.writeText(report);
    $("reportStatus").textContent = "Timing report copied. It contains no audio or transcript text.";
  } catch {
    const blob = new Blob([report], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `wikiwhy-reading-${new Date().toISOString().replace(/[:.]/gu, "-")}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1_000);
    $("reportStatus").textContent = "Timing report downloaded. It contains no audio or transcript text.";
  }
}

async function prepare() {
  if (state.preparing) return;
  if (!state.campaignEligible) {
    renderContentAvailabilityGate();
    return;
  }
  state.preparing = true;
  $("begin").disabled = true;
  try {
    $("modelProgress").textContent = "Requesting microphone…";
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    state.modelDevice = await recognizer.load(requestedDevice);
    state.guideWpm = Number($("guideWpm").value) || PROFILE.guide.defaultWpm;
    $("modelProgress").textContent = `Ready locally (${state.modelDevice}).`;
    show("read");
    await startReading();
  } catch (error) {
    show("setup");
    throw error;
  } finally {
    state.preparing = false;
  }
}

$("begin").onclick = () => prepare().catch((error) => {
  $("begin").disabled = false;
  $("modelProgress").textContent = `Could not start: ${error.message}`;
});
$("listen").onclick = () => (state.listening ? finishReading() : startReading()).catch((error) => {
  $("readerState").textContent = error.message;
  $("listen").disabled = false;
});
$("again").onclick = () => {
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("launch", "wikiwhy");
  location.href = url.href;
};
$("continueResult").onclick = () => {
  if (state.resultApplied) {
    if (state.campaignState.phase === "secured") returnToHub();
    else if (state.campaignState.phase === "reverse-hack") showRealRewriteSequence();
    else openNextCampaignReading();
    return;
  }
  if (!state.campaignEligible) {
    renderContentAvailabilityGate();
    return;
  }
  const outcome = calculateWikiWhyReadingOutcome({
    campaignState: state.campaignState,
    comprehension: state.comprehension,
    readingResult: state.result,
  });
  let previewValue = JSON.stringify(state.campaignState);
  const campaignStorage = uiPreview
    ? {
        getItem: () => previewValue,
        setItem: (_key, value) => { previewValue = value; },
      }
    : localStateStorage;
  const repair = applyWikiWhyReading(campaignStorage, {
    currentState: state.campaignState,
    outcome,
    passageId: activePassage.id,
    repairedAt: new Date().toISOString(),
    sessionId: state.sessionId,
  });
  if (!repair.state) {
    $("reportStatus").textContent = "This reading is saved, but the campaign is waiting for its next explicit story step.";
    return;
  }
  state.campaignState = repair.state;
  const repairEvents = repair.events ?? [];
  if (repair.reason === "invalid-outcome" || repair.reason === "shield-not-started") {
    state.resultApplied = true;
    $("repairOutcome").hidden = true;
    renderCampaignMeter(state.campaignState);
    renderSavedRepair(state.campaignState, { persisted: state.campaignPersisted });
    renderRecoveryHub();
    configurePostResultButton();
    $("reportStatus").textContent = "Campaign progress changed in another tab. This reading result is ready, but it did not consume the newer story step.";
    if (state.campaignState.phase === "reverse-hack") showRealRewriteSequence();
    else if (["shield", "secured"].includes(state.campaignState.phase)) beginRealShieldSequence();
    return;
  }
  state.campaignPersisted = repair.ok || Boolean(uiPreview);
  state.resultApplied = true;
  if (repairEvents.includes("already-secured")) {
    $("repairOutcome").hidden = true;
    renderCampaignMeter(state.campaignState);
    renderSavedRepair(state.campaignState, { persisted: state.campaignPersisted });
    renderRecoveryHub();
    configurePostResultButton();
    $("reportStatus").textContent = "WikiWhy was already secured in another tab. This reading result did not add campaign progress.";
    beginRealShieldSequence();
    return;
  }
  if (repair.duplicate || repair.duplicatePassage) {
    $("repairOutcome").hidden = true;
    renderCampaignMeter(state.campaignState);
    renderSavedRepair(state.campaignState, { persisted: state.campaignPersisted });
    renderRecoveryHub();
    configurePostResultButton();
    $("reportStatus").textContent = repair.duplicatePassage
      ? "Reading result is ready. This passage already counted toward WikiWhy, so campaign progress did not change."
      : "Reading result is ready. This session already counted toward WikiWhy, so campaign progress did not change.";
    return;
  }
  renderRepairOutcome(state.campaignState, state.campaignPersisted);
  renderCampaignMeter(state.campaignState);
  renderSavedRepair(state.campaignState, { persisted: state.campaignPersisted });
  renderRecoveryHub();
  diagnostic("wrapper-repair-persistence", { advance: outcome.advance, events: repair.events, saved: repair.ok });
  configurePostResultButton();
  $("reportStatus").textContent = !state.campaignPersisted
    ? "The repair is active in this tab, but this browser did not save it for reload."
    : state.campaignState.phase === "secured"
    ? "WikiWhy secured. The unauthorized AI write was blocked and evidence slot 1 was saved."
    : state.campaignState.phase === "shield"
      ? `${state.campaignState.lastReaction} Shield Protocol is ${state.campaignState.shieldPass} of 3.`
      : state.campaignState.phase === "reverse-hack"
        ? "Readings saved. Evidence saved. The automated verifier is still writing after its command ended."
        : `${state.campaignState.lastReaction} WikiWhy is ${state.campaignState.stability}% stable for now.`;
  handleRealCampaignEvents(repairEvents);
};
$("export").onclick = exportReport;
$("diagnosticToggle").onclick = () => {
  const opening = $("diagnosticPanel").hidden;
  $("diagnosticPanel").hidden = !opening;
  $("diagnosticToggle").hidden = opening;
  $("diagnosticToggle").setAttribute("aria-expanded", String(opening));
  if (opening) $("diagnosticAdvance").focus();
};
$("diagnosticClose").onclick = () => {
  $("diagnosticPanel").hidden = true;
  $("diagnosticToggle").hidden = false;
  $("diagnosticToggle").setAttribute("aria-expanded", "false");
  $("diagnosticToggle").focus();
};
$("diagnosticAdvance").onclick = () => advanceDiagnosticExperience().catch((error) => {
  $("diagnosticSummary").textContent = `Diagnostic could not advance: ${error.message}`;
});
$("diagnosticReset").onclick = async () => {
  if (state.selectedSiteId === "mapguess") {
    await discardActiveReadingForDiagnostics();
    resetMapGuessDiagnosticExperience();
    return;
  }
  if (state.selectedSiteId === "faceplace") {
    await discardActiveReadingForDiagnostics();
    resetFacePlaceDiagnosticExperience();
    return;
  }
  if (state.selectedSiteId === "threadit") {
    await discardActiveReadingForDiagnostics();
    resetThreadItDiagnosticExperience();
    return;
  }
  if (keepPreparationVisible()) return;
  await discardActiveReadingForDiagnostics();
  hideCharacterDialog();
  const reset = resetWikiWhyDiagnosticState(localStateStorage);
  state.diagnosticMode = true;
  state.diagnosticState = reset.state;
  renderCampaignMeter(reset.state, { diagnosticMode: true });
  renderDiagnosticPanel(reset.state);
  show("read");
  $("readerState").textContent = "TEST CAMPAIGN RESET · SIMULATED PASSAGE READY";
  $("progressText").textContent = "Diagnostic mode · no reading score created";
};
$("dialogAction").onclick = () => (state.dialogAction ?? hideCharacterDialog)();
$("openWikiWhyEvidence").onclick = () => {
  if (state.campaignState.phase !== "secured" && state.diagnosticState?.phase !== "secured") return;
  state.evidenceReceiptOpen = !state.evidenceReceiptOpen;
  renderWikiWhyCampaignOverlay(state.diagnosticMode && state.diagnosticState?.phase === "secured"
    ? state.diagnosticState
    : state.campaignState);
  if (state.evidenceReceiptOpen) $("wikiwhyEvidenceReceipt").focus({ preventScroll: true });
};
$("characterDialog").addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    if (state.dialogDismissible) hideCharacterDialog();
    else $("dialogAction").focus({ preventScroll: true });
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [...$("characterDialog").querySelectorAll("button:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])")];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  const active = document.activeElement;
  if (!focusable.includes(active) || (!event.shiftKey && active === last) || (event.shiftKey && active === first)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  }
});
$("previewBack").onclick = returnToHub;
$("previewReturn").onclick = returnToHub;
$("threaditBack").onclick = returnToHub;
$("threaditReturn").onclick = returnToHub;
$("faceplaceBack").onclick = returnToHub;
$("faceplaceReturn").onclick = returnToHub;
$("mapguessBack").onclick = returnToHub;
$("mapguessReturn").onclick = returnToHub;
$("threaditThreadTab").onclick = () => openThreadItView("thread");
$("threaditTraceTab").onclick = () => openThreadItView("trace");
$("threaditTraceControl").onclick = () => openThreadItView("trace");
$("threaditMidpointAction").onclick = () => {
  openThreadItView("trace");
  requestAnimationFrame(() => $("threaditTraceTab").focus({ preventScroll: true }));
};
$("threaditSourceToggle").onclick = () => {
  const page = $("threaditPage");
  const nextOpen = page.dataset.sourceOpen !== "true";
  page.dataset.sourceOpen = String(nextOpen);
  $("threaditSourceToggle").setAttribute("aria-expanded", String(nextOpen));
  $("threaditSourceToggle").textContent = nextOpen ? "CLOSE SOURCES" : "OPEN SOURCES";
};
$("threaditSourceClose").onclick = () => {
  $("threaditPage").dataset.sourceOpen = "false";
  $("threaditSourceToggle").setAttribute("aria-expanded", "false");
  $("threaditSourceToggle").textContent = "OPEN SOURCES";
  $("threaditSourceToggle").focus();
};
$("threaditEvidenceToggle").onclick = () => {
  const visibleState = state.threaditDiagnosticMode
    ? state.threaditDiagnosticState
    : state.threaditState;
  if (!visibleState.secured) return;
  state.threaditEvidenceReceiptOpen = !state.threaditEvidenceReceiptOpen;
  renderThreadItCampaign(visibleState, { diagnosticMode: state.threaditDiagnosticMode });
  if (state.threaditEvidenceReceiptOpen) {
    requestAnimationFrame(() => $("threaditEvidenceReceipt").focus?.({ preventScroll: true }));
  }
};
$("faceplaceProfileToggle").onclick = () => {
  state.faceplaceProfilePanelOpen = !state.faceplaceProfilePanelOpen;
  syncFacePlaceProfileDrawer();
  if (state.faceplaceProfilePanelOpen) requestAnimationFrame(() => $("faceplaceProfileHeading").focus({ preventScroll: true }));
};
$("faceplaceProfileClose").onclick = () => {
  state.faceplaceProfilePanelOpen = false;
  syncFacePlaceProfileDrawer();
  $("faceplaceProfileToggle").focus({ preventScroll: true });
};
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !state.faceplaceProfilePanelOpen) return;
  event.preventDefault();
  state.faceplaceProfilePanelOpen = false;
  syncFacePlaceProfileDrawer();
  $("faceplaceProfileToggle").focus({ preventScroll: true });
});
$("faceplaceMidpointAction").onclick = acknowledgeFacePlaceHonestZero;
$("faceplaceRankedMode").onclick = () => setFacePlaceFeedModeFromControl("ranked");
$("faceplaceChronologicalMode").onclick = () => setFacePlaceFeedModeFromControl("chronological");
$("faceplaceWhyToggle").onclick = () => {
  if ($("faceplaceWhyToggle").disabled) return;
  state.faceplaceWhyOpen = !state.faceplaceWhyOpen;
  const visibleState = state.faceplaceDiagnosticMode ? state.faceplaceDiagnosticState : state.faceplaceState;
  renderFacePlaceCampaign(visibleState, { diagnosticMode: state.faceplaceDiagnosticMode });
  if (state.faceplaceWhyOpen) requestAnimationFrame(() => $("faceplaceWhyDetails").focus({ preventScroll: true }));
  else $("faceplaceWhyToggle").focus({ preventScroll: true });
};
$("faceplaceEvidenceToggle").onclick = () => {
  const visibleState = state.faceplaceDiagnosticMode ? state.faceplaceDiagnosticState : state.faceplaceState;
  if (!visibleState.secured) return;
  state.faceplaceEvidenceReceiptOpen = !state.faceplaceEvidenceReceiptOpen;
  renderFacePlaceCampaign(visibleState, { diagnosticMode: state.faceplaceDiagnosticMode });
  if (state.faceplaceEvidenceReceiptOpen) requestAnimationFrame(() => $("faceplaceEvidenceReceipt").focus({ preventScroll: true }));
  else $("faceplaceEvidenceToggle").focus({ preventScroll: true });
};
$("mapguessInspectorToggle").onclick = () => {
  setMapGuessInspectorDrawerOpen(!state.mapguessInspectorOpen);
  if (state.mapguessInspectorOpen) requestAnimationFrame(() => $("mapguessInspectorHeading").focus({ preventScroll: true }));
};
$("mapguessInspectorClose").onclick = () => {
  setMapGuessInspectorDrawerOpen(false);
  $("mapguessInspectorToggle").focus({ preventScroll: true });
};
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !state.mapguessInspectorOpen || !$("mapguess").classList.contains("on")) return;
  event.preventDefault();
  setMapGuessInspectorDrawerOpen(false);
  $("mapguessInspectorToggle").focus({ preventScroll: true });
});
$("mapguessMidpointAction").onclick = acknowledgeMapGuessMovingTarget;
$("mapguessEvidenceToggle").onclick = () => {
  const visibleState = state.mapguessDiagnosticMode ? state.mapguessDiagnosticState : state.mapguessState;
  if (!visibleState.secured) return;
  state.mapguessEvidenceReceiptOpen = !state.mapguessEvidenceReceiptOpen;
  renderMapGuessCampaign(visibleState, { diagnosticMode: state.mapguessDiagnosticMode });
  if (state.mapguessEvidenceReceiptOpen) requestAnimationFrame(() => $("mapguessEvidenceReceipt").focus({ preventScroll: true }));
  else $("mapguessEvidenceToggle").focus({ preventScroll: true });
};
$("mapguessBlockedTarget").onclick = (event) => {
  event.preventDefault();
  $("mapguessMapCanvas").scrollIntoView({ block: "nearest" });
  $("mapguessMapCanvas").focus({ preventScroll: true });
};
window.addEventListener("resize", () => {
  if (state.activeScreen === "threadit") scheduleThreadItConnectors(threadItConnectorRelationships);
  if (state.activeScreen === "faceplace") {
    if (!matchMedia("(max-width: 1279px)").matches) state.faceplaceProfilePanelOpen = false;
    syncFacePlaceProfileDrawer();
  }
  if (state.activeScreen === "mapguess") syncMapGuessInspector();
});
$("taskStart").onclick = returnToHub;
$("taskHub").onclick = returnToHub;
$("taskSite").onclick = () => openRecoverySite(state.selectedSiteId);
$("taskReader").onclick = () => {
  if (state.selectedSiteId === "threadit") {
    openThreadItExperience();
    return;
  }
  if (state.selectedSiteId === "faceplace") {
    openFacePlaceExperience();
    return;
  }
  if (state.selectedSiteId === "mapguess") {
    openMapGuessExperience();
    return;
  }
  if (state.result && !state.resultApplied) show("review");
  else if (state.listening) show("read");
  else if (state.preparing) show("setup");
  else if (state.campaignState.phase === "shield") beginRealShieldSequence();
  else if (["reverse-hack", "secured"].includes(state.campaignState.phase)) openWikiWhyExperience();
  else showDesktopMessage("Reading Companion opens automatically beside an active recovery. No passage is running yet.");
};
document.querySelectorAll(".desktop-shortcut").forEach((button) => {
  button.onclick = () => {
    const messages = {
      files: "Finn's Files holds recovered evidence after a site is secured. It never stores voice recordings or transcripts.",
      notes: "TODO: repair the Internet, keep the useful parts, and label anything that says it is definitely not a virus.",
      recycle: "Recycle Byte is empty. Apparently someone has been cleaning up after themselves.",
      repair: "RECOVERED_A: is a deliberately fictional repair disk. Please do not insert it into a real computer.",
    };
    if (button.dataset.action === "hub") returnToHub();
    else if (button.dataset.action === "files") {
      const threadItEvidenceSaved = state.threaditState.secured && state.threaditPersisted;
      if (threadItEvidenceSaved && (state.selectedSiteId === "threadit" || state.campaignState.phase !== "secured")) {
        state.threaditDiagnosticMode = false;
        state.threaditEvidenceReceiptOpen = true;
        openThreadItExperience();
        requestAnimationFrame(() => $("threaditEvidenceReceipt").focus({ preventScroll: true }));
      } else if (state.campaignState.phase === "secured" && state.campaignPersisted) {
        openWikiWhyExperience({ showEvidence: true });
        requestAnimationFrame(() => $("wikiwhyEvidenceReceipt").focus({ preventScroll: true }));
      } else showDesktopMessage(messages.files);
    } else showDesktopMessage(messages[button.dataset.action]);
  };
});
for (const eventName of ["wheel", "pointerdown", "touchstart"]) {
  $("passage").addEventListener(eventName, () => {
    state.guidePausedUntil = performance.now() + 5_000;
    $("guideStatus").textContent = `Manual scroll — guide resumes at ${state.guideWpm} WPM`;
  }, { passive: true });
}
document.querySelectorAll(".quiz button").forEach((button) => {
  button.onclick = () => {
    const correct = button.dataset.answer === "1";
    document.querySelectorAll(".quiz button").forEach((choice) => {
      choice.classList.toggle("right", choice === button && correct);
      choice.classList.toggle("wrong", choice === button && !correct);
    });
    $("quizFeedback").textContent = correct
      ? activePassage.comprehension.correctFeedback
      : activePassage.comprehension.incorrectFeedback;
    $("payoff").hidden = !correct;
    state.comprehension = correct ? "supported" : "retry-offered";
    if (state.sessionId) {
      updateSessionComprehension(
        localStateStorage,
        state.sessionId,
        correct ? "supported" : "retry-offered",
      );
    }
  };
});
window.addEventListener("pagehide", () => {
  clearInterval(state.monitor);
  clearTimeout(state.technoTimer);
  clearTimeout(state.faceplaceTransitionTimer);
  if (capture.active) capture.stop();
  recognizer.close();
});
function updateDesktopClock() {
  $("desktopClock").textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

hydrateInternetRecoveryCopy();
if (uiPreview) {
  state.campaignState = readWikiWhyState(null);
  state.campaignPersisted = true;
  state.threaditState = readThreadItState(null);
  state.threaditPersisted = true;
  state.faceplaceState = readFacePlaceState(null);
  state.faceplacePersisted = true;
  state.mapguessState = readMapGuessState(null);
  state.mapguessPersisted = true;
}
selectCampaignPassage();
renderRecoveryHub();
renderSavedRepair(state.campaignState, { persisted: state.campaignPersisted });
renderCampaignMeter(state.campaignState);
state.diagnosticState = readWikiWhyDiagnosticState(localStateStorage);
renderDiagnosticPanel(state.diagnosticState);
updateDesktopClock();
setInterval(updateDesktopClock, 30_000);
renderPassage(0);
if (requestedLaunch === "wikiwhy") {
  openRecoverySite("wikiwhy");
} else if (requestedLaunch === "threadit") {
  openRecoverySite("threadit");
} else if (requestedLaunch === "faceplace") {
  openRecoverySite("faceplace");
} else if (requestedLaunch === "mapguess") {
  openRecoverySite("mapguess");
} else if (requestedSite) {
  openRecoverySite(requestedSite);
} else if (uiPreview === "hub") {
  show("hub");
} else if ([
  "threadit",
  "threadit-corrupted",
  "threadit-untangle-1",
  "threadit-tracing",
  "threadit-trace-1",
  "threadit-trace-2",
  "threadit-secured",
  "threadit-evidence",
].includes(uiPreview)) {
  const unitCount = {
    "threadit-evidence": 7,
    "threadit-secured": 7,
    "threadit-trace-1": 5,
    "threadit-trace-2": 6,
    "threadit-tracing": 4,
    "threadit-untangle-1": 1,
  }[uiPreview] ?? 0;
  state.threaditDiagnosticMode = uiPreview !== "threadit";
  state.threaditDiagnosticState = buildThreadItPreviewState(unitCount);
  if (uiPreview === "threadit-tracing") {
    state.threaditDiagnosticState = acknowledgeThreadItMidpointState(state.threaditDiagnosticState, {
      acknowledgedAt: "2026-07-12T00:00:04.000Z",
    }).state;
  }
  state.threaditEvidenceReceiptOpen = uiPreview === "threadit-evidence";
  openThreadItExperience();
} else if ([
  "faceplace",
  "faceplace-corrupted",
  "faceplace-false-1",
  "faceplace-false-2",
  "faceplace-false-3",
  "faceplace-honest-zero",
  "faceplace-honest-zero-acknowledged",
  "faceplace-recovery-1",
  "faceplace-recovery-2",
  "faceplace-secured",
  "faceplace-evidence",
].includes(uiPreview)) {
  const unitCount = {
    "faceplace-evidence": 6,
    "faceplace-secured": 6,
    "faceplace-recovery-2": 5,
    "faceplace-recovery-1": 4,
    "faceplace-honest-zero-acknowledged": 3,
    "faceplace-honest-zero": 3,
    "faceplace-false-3": 3,
    "faceplace-false-2": 2,
    "faceplace-false-1": 1,
  }[uiPreview] ?? 0;
  state.faceplaceDiagnosticMode = true;
  state.faceplaceDiagnosticState = buildFacePlacePreviewState(unitCount);
  if (uiPreview === "faceplace-honest-zero-acknowledged") {
    state.faceplaceDiagnosticState = acknowledgeFacePlaceMidpointState(state.faceplaceDiagnosticState, {
      acknowledgedAt: "2026-07-12T00:00:03.500Z",
    }).state;
  }
  state.faceplaceShowActOneResult = uiPreview === "faceplace-false-3";
  state.faceplaceWhyOpen = ["faceplace-recovery-2", "faceplace-secured", "faceplace-evidence"].includes(uiPreview);
  state.faceplaceEvidenceReceiptOpen = uiPreview === "faceplace-evidence";
  openFacePlaceExperience();
} else if ([
  "mapguess",
  "mapguess-corrupted",
  "mapguess-rebuild-1",
  "mapguess-rebuild-2",
  "mapguess-rebuild-3",
  "mapguess-rebuild-4",
  "mapguess-rebuild-5",
  "mapguess-moving-target",
  "mapguess-moving-target-inspector",
  "mapguess-moving-target-acknowledged",
  "mapguess-anchor-1",
  "mapguess-anchor-2",
  "mapguess-goal-fastest",
  "mapguess-goal-safest",
  "mapguess-goal-scenic",
  "mapguess-goal-accessible",
  "mapguess-secured",
  "mapguess-evidence",
].includes(uiPreview)) {
  const unitCount = {
    "mapguess-evidence": 8,
    "mapguess-secured": 8,
    "mapguess-goal-accessible": 7,
    "mapguess-goal-scenic": 7,
    "mapguess-goal-safest": 7,
    "mapguess-goal-fastest": 7,
    "mapguess-anchor-2": 7,
    "mapguess-anchor-1": 6,
    "mapguess-moving-target-acknowledged": 5,
    "mapguess-moving-target": 5,
    "mapguess-moving-target-inspector": 5,
    "mapguess-rebuild-5": 5,
    "mapguess-rebuild-4": 4,
    "mapguess-rebuild-3": 3,
    "mapguess-rebuild-2": 2,
    "mapguess-rebuild-1": 1,
  }[uiPreview] ?? 0;
  state.mapguessDiagnosticMode = uiPreview !== "mapguess";
  state.mapguessDiagnosticState = buildMapGuessPreviewState(unitCount);
  if (uiPreview === "mapguess-moving-target-acknowledged") {
    state.mapguessDiagnosticState = acknowledgeMapGuessMidpointState(state.mapguessDiagnosticState, {
      acknowledgedAt: "2026-07-12T00:00:05.500Z",
    }).state;
  }
  const goalPreview = /^mapguess-goal-(fastest|safest|scenic|accessible)$/u.exec(uiPreview ?? "");
  if (goalPreview) {
    state.mapguessDiagnosticState = setMapGuessRouteGoalState(state.mapguessDiagnosticState, goalPreview[1], {
      selectedAt: "2026-07-12T00:00:07.500Z",
    }).state;
  }
  state.mapguessEvidenceReceiptOpen = uiPreview === "mapguess-evidence";
  state.mapguessInspectorOpen = uiPreview === "mapguess-moving-target-inspector";
  openMapGuessExperience();
  if (uiPreview === "mapguess-moving-target-inspector") setMapGuessInspectorDrawerOpen(true);
  if (uiPreview === "mapguess-evidence") {
    requestAnimationFrame(() => $("mapguessEvidenceReceipt").scrollIntoView({ block: "nearest" }));
  }
} else if (uiPreview === "read") {
  const previewCount = Math.round(tokenizeText(PASSAGE).length * 0.55);
  updateProgress({
    furthestMatchedTokenIndex: previewCount - 1,
    matchedTokenIndexes: Array.from({ length: previewCount }, (_, index) => index),
    positionProgress: 0.55,
  }, 1_250);
  $("readerState").textContent = INTERNET_RECOVERY_COPY["reading.active"];
  show("read");
} else if (uiPreview === "review") {
  const previewTotal = tokenizeText(PASSAGE).length;
  state.result = { accuracy: 91, matchedWords: Math.round(previewTotal * 0.91), progress: 0.96, totalWords: previewTotal, wpm: 243 };
  state.sessionId = "visual-preview";
  $("finalAccuracy").textContent = "91%";
  $("finalCorrect").textContent = `${Math.round(previewTotal * 0.91)}/${previewTotal}`;
  $("finalSpeed").textContent = "243 WPM";
  $("finalProgress").textContent = "96%";
  $("finalizationStatus").textContent = "Final score ready. The page repair is recorded.";
  $("finalizationStatus").className = "finalization-status ready";
  show("review");
} else if (uiPreview === "outcome") {
  const previewTotal = tokenizeText(PASSAGE).length;
  state.comprehension = "supported";
  state.result = { accuracy: 91, matchedWords: Math.round(previewTotal * 0.91), progress: 0.96, totalWords: previewTotal, wpm: 243 };
  $("finalAccuracy").textContent = "91%";
  $("finalCorrect").textContent = `${Math.round(previewTotal * 0.91)}/${previewTotal}`;
  $("finalSpeed").textContent = "243 WPM";
  $("finalProgress").textContent = "96%";
  $("finalizationStatus").textContent = "Final score ready. The page repair is recorded.";
  $("finalizationStatus").className = "finalization-status ready";
  show("review");
  $("continueResult").click();
}
