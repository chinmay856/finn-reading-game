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
  applyThreadItReading,
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
  applyFacePlaceReading,
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
import {
  MYCORNER_OWNER_LOCK_UNITS,
  MYCORNER_RESTORE_UNITS,
  calculateMyCornerReadingOutcome,
} from "./apps/internet-recovery/mycorner-rules.js";
import {
  MYCORNER_PROVISIONAL_BLOCKED_WRITE_RECORD,
  MYCORNER_PROVISIONAL_EVIDENCE_RECORD,
  acknowledgeMyCornerMidpoint,
  acknowledgeMyCornerMidpointState,
  advanceMyCornerState,
  applyMyCornerReading,
  readMyCornerState,
} from "./apps/internet-recovery/mycorner-state.js";
import { getMyCornerCampaignView } from "./apps/internet-recovery/mycorner-view.js";
import { selectNextMyCornerPassage } from "./apps/internet-recovery/mycorner-content.js";
import {
  YAHUH_RECONNECT_UNITS,
  YAHUH_SORT_UNITS,
  calculateYahuhReadingOutcome,
} from "./apps/internet-recovery/yahuh-rules.js";
import {
  YAHUH_PROVISIONAL_BLOCKED_WRITE_RECORD,
  YAHUH_PROVISIONAL_EVIDENCE_RECORD,
  acknowledgeYahuhMidpoint,
  acknowledgeYahuhMidpointState,
  advanceYahuhState,
  applyYahuhReading,
  readYahuhState,
} from "./apps/internet-recovery/yahuh-state.js";
import { getYahuhCampaignView } from "./apps/internet-recovery/yahuh-view.js";
import { selectNextYahuhPassage } from "./apps/internet-recovery/yahuh-content.js";
import {
  VIEWTUBE_RESTORE_UNITS,
  calculateViewTubeReadingOutcome,
} from "./apps/internet-recovery/viewtube-rules.js";
import {
  VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
  acknowledgeViewTubeMidpoint,
  acknowledgeViewTubeMidpointState,
  advanceViewTubeState,
  applyViewTubeReading,
  readViewTubeState,
} from "./apps/internet-recovery/viewtube-state.js";
import { getViewTubeCampaignView } from "./apps/internet-recovery/viewtube-view.js";
import { selectNextViewTubePassage } from "./apps/internet-recovery/viewtube-content.js";
import { calculateSearchishReadingOutcome, SEARCHISH_RESTORE_UNITS } from "./apps/internet-recovery/searchish-rules.js";
import { SEARCHISH_EVIDENCE_RECORD, acknowledgeSearchishMidpoint, acknowledgeSearchishMidpointState, advanceSearchishState, applySearchishReading, readSearchishState } from "./apps/internet-recovery/searchish-state.js";
import { getSearchishCampaignView } from "./apps/internet-recovery/searchish-view.js";
import { selectNextSearchishPassage } from "./apps/internet-recovery/searchish-content.js";
import { AMAZEON_SORT_UNITS, calculateAmazeOnReadingOutcome } from "./apps/internet-recovery/amazeon-rules.js";
import { AMAZEON_EVIDENCE_RECORD, acknowledgeAmazeOnMidpoint, acknowledgeAmazeOnMidpointState, advanceAmazeOnState, readAmazeOnState } from "./apps/internet-recovery/amazeon-state.js";
import { getAmazeOnCampaignView } from "./apps/internet-recovery/amazeon-view.js";
import { selectNextAmazeOnPassage } from "./apps/internet-recovery/amazeon-content.js";
import { SPOTTYFI_DISCLOSURE_UNITS, calculateSpottyFiReadingOutcome } from "./apps/internet-recovery/spottyfi-rules.js";
import { SPOTTYFI_EVIDENCE_RECORD, acknowledgeSpottyFiMidpoint, acknowledgeSpottyFiMidpointState, advanceSpottyFiState, readSpottyFiState } from "./apps/internet-recovery/spottyfi-state.js";
import { getSpottyFiCampaignView } from "./apps/internet-recovery/spottyfi-view.js";
import { selectNextSpottyFiPassage } from "./apps/internet-recovery/spottyfi-content.js";
import { summarizeHubEvidenceState } from "./apps/internet-recovery/recovery-hub-state.js";
import {
  ENDGAME_CHECKPOINT_IDS,
  acceptEndgameCheckpoint,
  beginEndgameContainment,
  confirmEndgameRevocation,
  discoverEndgameEvidence,
  readEndgameState,
} from "./apps/internet-recovery/endgame-state.js";

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
  readingSiteId: "wikiwhy",
  campaignEligible: true, campaignState: readWikiWhyState(localStateStorage),
  campaignPersisted: Boolean(localStateStorage), contentAvailabilityReason: null,
  contentCandidateCount: 0, resultApplied: false,
  threaditState: readThreadItState(localStateStorage),
  threaditPersisted: Boolean(localStateStorage),
  threaditDiagnosticMode: false,
  threaditPlaytestMode: false,
  threaditDiagnosticState: readThreadItState(null),
  threaditEvidenceReceiptOpen: false,
  faceplaceState: readFacePlaceState(localStateStorage),
  faceplacePersisted: Boolean(localStateStorage),
  faceplaceDiagnosticMode: false,
  faceplacePlaytestMode: false,
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
  mycornerState: readMyCornerState(localStateStorage),
  mycornerPersisted: Boolean(localStateStorage),
  mycornerDiagnosticMode: false,
  mycornerPlaytestMode: false,
  mycornerDiagnosticState: readMyCornerState(null),
  mycornerEvidenceReceiptOpen: false,
  mycornerInspectorOpen: false,
  mycornerComparisonView: "template",
  yahuhState: readYahuhState(localStateStorage),
  yahuhPersisted: Boolean(localStateStorage),
  yahuhDiagnosticMode: false,
  yahuhPlaytestMode: false,
  yahuhDiagnosticState: readYahuhState(null),
  yahuhEvidenceReceiptOpen: false,
  yahuhSwitchboardOpen: false,
  viewtubeState: readViewTubeState(localStateStorage),
  viewtubePersisted: Boolean(localStateStorage),
  viewtubeDiagnosticMode: false,
  viewtubePlaytestMode: false,
  viewtubeDiagnosticState: readViewTubeState(null),
  viewtubeDrawerOpen: false,
  viewtubeEvidenceReceiptOpen: false,
  searchishState: readSearchishState(localStateStorage),
  searchishPersisted: Boolean(localStateStorage),
  searchishDiagnosticMode: false,
  searchishPlaytestMode: false,
  searchishDiagnosticState: readSearchishState(null),
  searchishInspectorOpen: false,
  searchishEvidenceReceiptOpen: false,
  amazeonState: readAmazeOnState(localStateStorage),
  amazeonPersisted: Boolean(localStateStorage),
  amazeonDiagnosticMode: false,
  amazeonDiagnosticState: readAmazeOnState(null),
  amazeonReceiptOpen: false,
  amazeonEvidenceReceiptOpen: false,
  spottyfiState: readSpottyFiState(localStateStorage), spottyfiPersisted: Boolean(localStateStorage), spottyfiDiagnosticMode: false, spottyfiDiagnosticState: readSpottyFiState(null), spottyfiDetailOpen: false, spottyfiEvidenceReceiptOpen: false,
  endgameState: readEndgameState(localStateStorage),
  endgameStorageAvailable: null,
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
  state.readingSiteId = "wikiwhy";
  const selection = selectNextWikiWhyPassage(state.campaignState);
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function selectThreadItPlaytestPassage() {
  const selection = selectNextThreadItPassage(state.threaditState, { lane: "playtest" });
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  state.readingSiteId = "threadit";
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function openThreadItPlaytestReading() {
  hideCharacterDialog();
  state.selectedSiteId = "threadit";
  state.threaditPlaytestMode = true;
  state.threaditPersisted = false;
  const selection = selectThreadItPlaytestPassage();
  if (!selection.passage) {
    renderThreadItCampaign(state.threaditState);
    $("threaditContentReason").textContent = "Every structured ThreadIt playtest passage has been used. Production content remains review-gated.";
    show("threadit");
    return false;
  }
  resetReadingAttempt();
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = "THREADIT CANDIDATE PLAYTEST";
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = "This complete draft is loaded for a noncanonical playtest. Your result may advance the local ThreadIt test campaign, but it cannot approve content or unlock final evidence.";
  $("modelProgress").textContent = "Candidate playtest · review pending · microphone processing stays local.";
  show("setup");
  return true;
}

function selectFacePlacePlaytestPassage() {
  const selection = selectNextFacePlacePassage(state.faceplaceState, { lane: "playtest" });
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  state.readingSiteId = "faceplace";
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function openFacePlacePlaytestReading() {
  hideCharacterDialog();
  state.selectedSiteId = "faceplace";
  state.faceplacePlaytestMode = true;
  state.faceplacePersisted = false;
  const selection = selectFacePlacePlaytestPassage();
  if (!selection.passage) {
    renderFacePlaceCampaign(state.faceplaceState);
    $("faceplaceContentReason").textContent = "Every structured FacePlace playtest passage has been used. Production content remains review-gated.";
    show("faceplace");
    return false;
  }
  resetReadingAttempt();
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = "FACEPLACE CANDIDATE PLAYTEST";
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = "This complete draft is loaded for a noncanonical playtest. Your result may advance the tab-local FacePlace test campaign, but it cannot approve content or unlock final evidence.";
  $("modelProgress").textContent = "Candidate playtest · review pending · microphone processing stays local.";
  show("setup");
  return true;
}

function selectMyCornerPlaytestPassage() {
  const selection = selectNextMyCornerPassage(state.mycornerState, { lane: "playtest" });
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  state.readingSiteId = "mycorner";
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function openMyCornerPlaytestReading() {
  hideCharacterDialog();
  state.selectedSiteId = "mycorner";
  state.mycornerPlaytestMode = true;
  state.mycornerPersisted = false;
  const selection = selectMyCornerPlaytestPassage();
  if (!selection.passage) {
    renderMyCornerCampaign(state.mycornerState);
    $("mycornerContentReason").textContent = "Every structured MyCorner playtest passage has been used. Production content remains review-gated.";
    show("mycorner");
    return false;
  }
  resetReadingAttempt();
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = "MYCORNER CANDIDATE PLAYTEST";
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = "This complete draft is loaded for a noncanonical playtest. Your result may advance the tab-local MyCorner test campaign, but it cannot approve content or unlock final evidence.";
  $("modelProgress").textContent = "Candidate playtest · review pending · microphone processing stays local.";
  show("setup");
  return true;
}

function selectYahuhPlaytestPassage() {
  const selection = selectNextYahuhPassage(state.yahuhState, { lane: "playtest" });
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  state.readingSiteId = "yahuh";
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function openYahuhPlaytestReading() {
  hideCharacterDialog();
  state.selectedSiteId = "yahuh";
  state.yahuhPlaytestMode = true;
  state.yahuhPersisted = false;
  const selection = selectYahuhPlaytestPassage();
  if (!selection.passage) {
    renderYahuhCampaign(state.yahuhState);
    $("yahuhContentReason").textContent = "Every structured Yahuh playtest passage has been used. Production content remains review-gated.";
    show("yahuh");
    return false;
  }
  resetReadingAttempt();
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = "YAHUH CANDIDATE PLAYTEST";
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = "This complete draft is loaded for a noncanonical playtest. Your result may advance the tab-local Yahuh test campaign, but it cannot approve content or unlock final evidence.";
  $("modelProgress").textContent = "Candidate playtest · review pending · microphone processing stays local.";
  show("setup");
  return true;
}

function selectViewTubePlaytestPassage() {
  const selection = selectNextViewTubePassage(state.viewtubeState, { lane: "playtest" });
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  state.readingSiteId = "viewtube";
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function selectSearchishPlaytestPassage() {
  const selection = selectNextSearchishPassage(state.searchishState, { lane: "playtest" });
  state.contentAvailabilityReason = selection.reason;
  state.contentCandidateCount = selection.unavailableCount;
  state.campaignEligible = Boolean(selection.passage);
  state.readingSiteId = "searchish";
  if (selection.passage) setActivePassage(selection.passage);
  return selection;
}

function openViewTubePlaytestReading() {
  hideCharacterDialog();
  state.selectedSiteId = "viewtube";
  state.viewtubePlaytestMode = true;
  state.viewtubePersisted = false;
  const selection = selectViewTubePlaytestPassage();
  if (!selection.passage) {
    renderViewTubeCampaign(state.viewtubeState);
    $("viewtubeContentReason").textContent = "Every structured ViewTube playtest passage has been used. Production content remains review-gated.";
    show("viewtube");
    return false;
  }
  resetReadingAttempt();
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = "VIEWTUBE CANDIDATE PLAYTEST";
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = "This complete draft is loaded for a noncanonical playtest. Your result may advance the tab-local ViewTube test campaign, but it cannot approve content or unlock final evidence.";
  $("modelProgress").textContent = "Candidate playtest · review pending · microphone processing stays local.";
  show("setup");
  return true;
}

function openSearchishPlaytestReading() {
  hideCharacterDialog();
  state.selectedSiteId = "searchish";
  state.searchishPlaytestMode = true;
  state.searchishPersisted = false;
  const selection = selectSearchishPlaytestPassage();
  if (!selection.passage) {
    renderSearchishCampaign(state.searchishState);
    $("searchishContentReason").textContent = "Every structured Search-ish playtest passage has been used. Production content remains review-gated.";
    show("searchish");
    return false;
  }
  resetReadingAttempt();
  document.querySelector('[data-copy-id="mission.preparation.title"]').textContent = "SEARCH-ISH CANDIDATE PLAYTEST";
  document.querySelector('[data-copy-id="mission.preparation.body"]').textContent = "This complete draft is loaded for a noncanonical playtest. Your result may advance the tab-local Search-ish test campaign, but it cannot approve content or unlock final evidence.";
  $("modelProgress").textContent = "Candidate playtest · review pending · microphone processing stays local.";
  show("setup");
  return true;
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
  state.readingSiteId = "wikiwhy";
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

function renderEndgame() {
  const endgame = state.endgameState;
  const checkpointCount = endgame.checkpointIds.length;
  $("endgamePhaseLabel").textContent = endgame.phase === "restored" ? "RECORD FINALIZED" : endgame.phase.toUpperCase();
  $("endgameAmyStatus").textContent = endgame.phase === "restored"
    ? "The route is sealed. Every original stays readable."
    : endgame.routeVisible
      ? "One verified service reached all ten sites."
      : "Ten local warnings. One upstream service.";
  $("endgameChinmayStatus").textContent = endgame.phase === "restored"
    ? "Write access revoked. I am updating my definition of paused."
    : endgame.phase === "revocation"
      ? "That is my service account. Finn, revoke it."
      : "I paused it. It has interpreted that creatively.";
  $("endgameSafetyGate").hidden = endgame.phase !== "safety-gate";
  $("endgameContainment").hidden = endgame.phase !== "containment";
  $("endgameRevocation").hidden = endgame.phase !== "revocation";
  $("endgameRestored").hidden = endgame.phase !== "restored";
  $("endgameCheckpointList").innerHTML = ENDGAME_CHECKPOINT_IDS.map((id, index) => `<li data-complete="${index < checkpointCount}"><b>Checkpoint ${index + 1}</b><span>${id}</span><strong>${index < checkpointCount ? "SAVED" : index === checkpointCount ? "READY — REVIEW GATED" : "LOCKED"}</strong></li>`).join("");
  $("endgameRouteStatus").textContent = endgame.routeVisible
    ? "Shared route verified: AI service → Recovery Desktop"
    : "Route hidden until checkpoint 1";
  const endgamePreview = Boolean(uiPreview?.startsWith("endgame-"));
  $("endgameCheckpointAdvance").textContent = endgamePreview
    ? `Preview reviewed checkpoint ${Math.min(checkpointCount + 1, 3)}`
    : "Checkpoint unavailable — review pending";
  $("endgameCheckpointAdvance").disabled = !endgamePreview || checkpointCount >= ENDGAME_CHECKPOINT_IDS.length;
  if (state.endgameStorageAvailable === false) {
    $("endgameSafetyCopy").textContent = "Containment needs local saving before it can start. Your ten secured sites and evidence are unchanged. You can exit now and return after saving is available.";
  } else {
    $("endgameSafetyCopy").textContent = "Your ten secured sites and evidence are unchanged. A write/read/delete probe will run before containment begins.";
  }
  $("endgameLiveStatus").textContent = endgame.phase === "restored"
    ? "AI repair service write access revoked. Evidence 01-11 verified read-only."
    : endgame.phase === "revocation"
      ? "Checkpoint 3 is saved. Human revocation confirmation is ready."
      : endgame.phase === "containment"
        ? `Containment saved. ${checkpointCount ? `Checkpoint ${checkpointCount} complete.` : "Checkpoint 1 is review gated."}`
        : "Containment has not started.";
}

function openEndgame({ canonicalComplete = false } = {}) {
  state.endgameState = discoverEndgameEvidence(state.endgameState, { canonicalComplete });
  renderEndgame();
  show("endgame");
}

function show(name) {
  const screenChanged = state.activeScreen !== name;
  for (const id of ["hub", "endgame", "sitePreview", "threadit", "faceplace", "mycorner", "yahuh", "viewtube", "searchish", "amazeon", "spottyfi", "mapguess", "setup", "read", "review"]) $(id).classList.toggle("on", id === name);
  state.activeScreen = name;
  $("technoPet").dataset.screen = name;
  $("technoPetStatus").textContent = name === "hub"
    ? "SNIFFING FOR SUSPICIOUS FILES"
    : name === "endgame"
      ? "GUARDING EVIDENCE 11"
      : ["read", "review", "setup"].includes(name)
        ? "READING SUPPORT DOG ON DUTY"
        : "INSPECTING THIS SITE";
  const selectedSite = getRecoverySite(state.selectedSiteId);
  const readingScreen = ["setup", "read", "review"].includes(name);
  const wikiWhyScreen = readingScreen && state.readingSiteId === "wikiwhy";
  const threadItScreen = name === "threadit" || (readingScreen && state.readingSiteId === "threadit");
  const facePlaceScreen = name === "faceplace" || (readingScreen && state.readingSiteId === "faceplace");
  const myCornerScreen = name === "mycorner" || (readingScreen && state.readingSiteId === "mycorner");
  const yahuhScreen = name === "yahuh" || (readingScreen && state.readingSiteId === "yahuh");
  const viewtubeScreen = name === "viewtube" || (readingScreen && state.readingSiteId === "viewtube");
  const searchishScreen = name === "searchish" || (readingScreen && state.readingSiteId === "searchish");
  const amazeonScreen = name === "amazeon";
  const spottyfiScreen = name === "spottyfi";
  const mapGuessScreen = name === "mapguess";
  const activeSiteScreen = name === "sitePreview" || wikiWhyScreen || threadItScreen || facePlaceScreen || myCornerScreen || yahuhScreen || viewtubeScreen || searchishScreen || amazeonScreen || spottyfiScreen || mapGuessScreen;
  $("desktopContext").textContent = name === "hub"
    ? "RECOVERY MAP"
    : name === "endgame"
      ? "EVIDENCE 11 CONTAINMENT"
    : name === "sitePreview"
      ? `${selectedSite.name.toUpperCase()} PREVIEW`
      : threadItScreen
        ? "THREADIT SOURCE TRACE"
        : facePlaceScreen
          ? "FACEPLACE FEED RECOVERY"
          : myCornerScreen
            ? "MYCORNER PROFILE RECOVERY"
          : yahuhScreen
            ? "YAHUH CATEGORY RECOVERY"
          : viewtubeScreen
            ? "VIEWTUBE EVIDENCE RECOVERY"
          : searchishScreen
            ? "SEARCH-ISH ORIGIN RECOVERY"
          : amazeonScreen
            ? "AMAZE-ON CONSENT RECOVERY"
          : spottyfiScreen
            ? "SPOTTY-FI LISTENER RECOVERY"
          : mapGuessScreen
            ? "MAPGUESS ROUTE RECOVERY"
        : "WIKIWHY REPAIR";
  $("taskHub").classList.toggle("active", name === "hub");
  $("taskSite").classList.toggle("active", activeSiteScreen);
  $("taskReader").classList.toggle("active", name === "read" || name === "review" || threadItScreen || facePlaceScreen || myCornerScreen || yahuhScreen || viewtubeScreen || searchishScreen || amazeonScreen || spottyfiScreen || mapGuessScreen);
  const visibleCampaignState = state.diagnosticMode && state.diagnosticState ? state.diagnosticState : state.campaignState;
  const securedWikiWhyTask = wikiWhyScreen && visibleCampaignState.phase === "secured";
  const visibleThreadItState = state.threaditDiagnosticMode ? state.threaditDiagnosticState : state.threaditState;
  const securedThreadItTask = threadItScreen && visibleThreadItState.secured;
  const visibleFacePlaceState = state.faceplaceDiagnosticMode ? state.faceplaceDiagnosticState : state.faceplaceState;
  const securedFacePlaceTask = facePlaceScreen && visibleFacePlaceState.secured;
  const visibleMapGuessState = state.mapguessDiagnosticMode ? state.mapguessDiagnosticState : state.mapguessState;
  const securedMapGuessTask = mapGuessScreen && visibleMapGuessState.secured;
  const visibleMyCornerState = state.mycornerDiagnosticMode ? state.mycornerDiagnosticState : state.mycornerState;
  const securedMyCornerTask = myCornerScreen && visibleMyCornerState.secured;
  const visibleYahuhState = state.yahuhDiagnosticMode ? state.yahuhDiagnosticState : state.yahuhState;
  const securedYahuhTask = yahuhScreen && visibleYahuhState.secured;
  const visibleViewTubeState = state.viewtubeDiagnosticMode ? state.viewtubeDiagnosticState : state.viewtubeState;
  const securedViewTubeTask = viewtubeScreen && visibleViewTubeState.secured;
  const visibleSearchishState = state.searchishDiagnosticMode ? state.searchishDiagnosticState : state.searchishState;
  const securedSearchishTask = searchishScreen && visibleSearchishState.secured;
  const visibleAmazeOnState = state.amazeonDiagnosticMode ? state.amazeonDiagnosticState : state.amazeonState;
  const securedAmazeOnTask = amazeonScreen && visibleAmazeOnState.secured;
  const visibleSpottyFiState=state.spottyfiDiagnosticMode?state.spottyfiDiagnosticState:state.spottyfiState;const securedSpottyFiTask=spottyfiScreen&&visibleSpottyFiState.secured;
  const securedSiteTask = securedWikiWhyTask || securedThreadItTask || securedFacePlaceTask || securedMyCornerTask || securedYahuhTask || securedViewTubeTask || securedSearchishTask || securedAmazeOnTask || securedSpottyFiTask || securedMapGuessTask;
  $("taskSite").classList.toggle("secured", securedSiteTask);
  if (securedWikiWhyTask) {
    $("taskSite").innerHTML = `<img src="${WIKIWHY_SECURED_SEAL_URL}" alt=""> <span>WikiWhy · SECURED</span>`;
  } else if (securedThreadItTask) {
    $("taskSite").innerHTML = `<img src="${THREADIT_ASSETS[THREADIT_ASSET_IDS.sourceStableBadge]}" alt=""> <span>ThreadIt · SECURED</span>`;
  } else if (securedFacePlaceTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("faceplace").markImage}" alt=""> <span>FacePlace · SECURED TEST</span>`;
  } else if (securedMyCornerTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("mycorner").markImage}" alt=""> <span>MyCorner · SECURED TEST</span>`;
  } else if (securedYahuhTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("yahuh").markImage}" alt=""> <span>Yahuh! Portal · SECURED TEST</span>`;
  } else if (securedViewTubeTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("viewtube").markImage}" alt=""> <span>ViewTube · SECURED TEST</span>`;
  } else if (securedSearchishTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("searchish").markImage}" alt=""> <span>Search-ish · SECURED TEST</span>`;
  } else if (securedAmazeOnTask) {
    $("taskSite").innerHTML = `<img src="${getRecoverySite("amazeon").markImage}" alt=""> <span>Amaze-On · SECURED TEST</span>`;
  } else if(securedSpottyFiTask){$("taskSite").innerHTML=`<img src="${getRecoverySite("spottyfi").markImage}" alt=""> <span>Spotty-Fi · SECURED TEST</span>`;
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
        : securedMyCornerTask
          ? "MyCorner secured test"
        : securedYahuhTask
          ? "Yahuh Portal secured test"
        : securedViewTubeTask
          ? "ViewTube secured test"
        : securedSearchishTask
          ? "Search-ish secured test"
        : securedAmazeOnTask
          ? "Amaze-On secured test"
        : securedSpottyFiTask
          ? "Spotty-Fi secured test"
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
  const realMyCorner = state.mycornerState;
  const diagnosticMyCorner = state.mycornerDiagnosticMode ? state.mycornerDiagnosticState : null;
  const realYahuh = state.yahuhState;
  const diagnosticYahuh = state.yahuhDiagnosticMode ? state.yahuhDiagnosticState : null;
  const realViewTube = state.viewtubeState;
  const diagnosticViewTube = state.viewtubeDiagnosticMode ? state.viewtubeDiagnosticState : null;
  const realSearchish = state.searchishState;
  const diagnosticSearchish = state.searchishDiagnosticMode ? state.searchishDiagnosticState : null;
  const realAmazeOn = state.amazeonState;
  const diagnosticAmazeOn = state.amazeonDiagnosticMode ? state.amazeonDiagnosticState : null;
  const realSpottyFi = state.spottyfiState;
  const diagnosticSpottyFi = state.spottyfiDiagnosticMode ? state.spottyfiDiagnosticState : null;
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
        canonicalBlockedWriteId: FACEPLACE_PROVISIONAL_BLOCKED_WRITE_RECORD.id,
        canonicalEvidenceId: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: diagnosticFacePlace,
        evidenceRecord: FACEPLACE_PROVISIONAL_EVIDENCE_RECORD,
        persisted: state.faceplacePersisted,
        siteId: "faceplace",
        state: realFacePlace,
      },
      {
        canonicalBlockedWriteId: MAPGUESS_PROVISIONAL_BLOCKED_WRITE_RECORD.id,
        canonicalEvidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: diagnosticMapGuess,
        evidenceRecord: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD,
        persisted: state.mapguessPersisted,
        requiresLockedRouteGoal: true,
        siteId: "mapguess",
        state: realMapGuess,
      },
      {
        canonicalEvidenceId: MYCORNER_PROVISIONAL_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: MYCORNER_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: diagnosticMyCorner,
        evidenceRecord: MYCORNER_PROVISIONAL_EVIDENCE_RECORD,
        persisted: state.mycornerPersisted,
        siteId: "mycorner",
        state: realMyCorner,
      },
      {
        canonicalEvidenceId: YAHUH_PROVISIONAL_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: YAHUH_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: diagnosticYahuh,
        evidenceRecord: YAHUH_PROVISIONAL_EVIDENCE_RECORD,
        persisted: state.yahuhPersisted,
        siteId: "yahuh",
        state: realYahuh,
      },
      {
        canonicalEvidenceId: VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
        diagnosticState: diagnosticViewTube,
        evidenceRecord: VIEWTUBE_PROVISIONAL_EVIDENCE_RECORD,
        persisted: state.viewtubePersisted,
        siteId: "viewtube",
        state: realViewTube,
      },
      {
        canonicalEvidenceId: SEARCHISH_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: SEARCHISH_EVIDENCE_RECORD,
        diagnosticState: diagnosticSearchish,
        evidenceRecord: SEARCHISH_EVIDENCE_RECORD,
        persisted: state.searchishPersisted,
        siteId: "searchish",
        state: realSearchish,
      },
      {
        canonicalEvidenceId: AMAZEON_EVIDENCE_RECORD.id,
        diagnosticEvidenceRecord: AMAZEON_EVIDENCE_RECORD,
        diagnosticState: diagnosticAmazeOn,
        evidenceRecord: AMAZEON_EVIDENCE_RECORD,
        persisted: state.amazeonPersisted,
        siteId: "amazeon",
        state: realAmazeOn,
      },
      { canonicalEvidenceId: SPOTTYFI_EVIDENCE_RECORD.id, diagnosticEvidenceRecord: SPOTTYFI_EVIDENCE_RECORD, diagnosticState: diagnosticSpottyFi, evidenceRecord: SPOTTYFI_EVIDENCE_RECORD, persisted: state.spottyfiPersisted, siteId: "spottyfi", state: realSpottyFi },
    ],
  });
  const wikiWhyEvidence = evidenceSummary.bySiteId.wikiwhy;
  const threadItEvidence = evidenceSummary.bySiteId.threadit;
  const facePlaceEvidence = evidenceSummary.bySiteId.faceplace;
  const mapGuessEvidence = evidenceSummary.bySiteId.mapguess;
  const myCornerEvidence = evidenceSummary.bySiteId.mycorner;
  const yahuhEvidence = evidenceSummary.bySiteId.yahuh;
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
  const visibleMyCorner = diagnosticMyCorner ?? realMyCorner;
  const myCornerView = getMyCornerCampaignView(visibleMyCorner, {
    comparisonView: state.mycornerComparisonView,
  });
  const myCornerSecured = myCornerEvidence.displaySecured;
  const myCornerTestSuffix = state.mycornerDiagnosticMode ? " · TEST" : "";
  const myCornerStatus = myCornerEvidence.testSecured
    ? "OWNER CONTROLS RESTORED · TEST"
    : myCornerEvidence.realSecured
      ? myCornerEvidence.persistedNonCanonical
        ? "OWNER CONTROLS RESTORED · PROVISIONAL"
        : state.mycornerPersisted
          ? "OWNER CONTROLS RESTORED"
          : "OWNER CONTROLS RESTORED · TAB ONLY"
      : myCornerView.midpoint.actionRequired
        ? `TEMPLATE REVEAL READY${myCornerTestSuffix}`
        : myCornerView.midpoint.acknowledged
          ? `OWNER LOCKS ${myCornerView.progress.ownerLockCompletedCount}/3${myCornerTestSuffix}`
          : myCornerView.progress.restoreCompletedCount
            ? `MODULES ${myCornerView.progress.restoreCompletedCount}/4${myCornerTestSuffix}`
            : "CAMPAIGN TEST BUILD";
  const visibleYahuh = diagnosticYahuh ?? realYahuh;
  const yahuhView = getYahuhCampaignView(visibleYahuh);
  const yahuhSecured = yahuhEvidence.displaySecured;
  const yahuhTestSuffix = state.yahuhDiagnosticMode ? " · TEST" : "";
  const yahuhStatus = yahuhEvidence.testSecured
    ? "CATEGORY SWITCHBOARD RESTORED · TEST"
    : yahuhEvidence.realSecured
      ? yahuhEvidence.persistedNonCanonical
        ? "CATEGORY SWITCHBOARD RESTORED · PROVISIONAL"
        : state.yahuhPersisted
          ? "CATEGORY SWITCHBOARD RESTORED"
          : "CATEGORY SWITCHBOARD RESTORED · TAB ONLY"
      : yahuhView.midpoint.actionRequired
        ? `SINGLE SOURCE READY${yahuhTestSuffix}`
        : yahuhView.midpoint.acknowledged
          ? `CHANNELS ${yahuhView.progress.reconnectCompletedCount}/3${yahuhTestSuffix}`
          : yahuhView.progress.sortCompletedCount
            ? `SORT CIRCUITS ${yahuhView.progress.sortCompletedCount}/3${yahuhTestSuffix}`
            : "CAMPAIGN TEST BUILD";
  // Never offer a completed case again. Until design freezes a replacement
  // rotation, an honest shorter list is safer than inventing a third case.
  const securedIncomingSiteIds = new Set([
    facePlaceSecured ? "faceplace" : null,
    mapGuessSecured ? "mapguess" : null,
    myCornerSecured ? "mycorner" : null,
    yahuhSecured ? "yahuh" : null,
    threadItSecured ? "threadit" : null,
    wikiWhySecured ? "wikiwhy" : null,
  ].filter(Boolean));
  const incomingIds = getIncomingSiteIds({ facePlaceSecured, threadItSecured, wikiWhySecured })
    .filter((siteId) => !securedIncomingSiteIds.has(siteId));
  const securedCount = evidenceSummary.persistedCanonicalCount;
  $("securedSiteCount").textContent = String(securedCount);
  $("securedSiteCount").dataset.displaySecuredCount = String(evidenceSummary.displaySecuredCount);
  $("evidenceCount").textContent = `${securedCount}/10 canonical`;
  $("evidenceCount").dataset.displaySecuredCount = String(evidenceSummary.displaySecuredCount);
  $("endgameLaunch").hidden = !evidenceSummary.canonicalComplete && state.endgameState.phase === "locked";
  $("endgameLaunch").dataset.canonicalComplete = String(evidenceSummary.canonicalComplete);
  $("endgameLaunch").textContent = state.endgameState.phase === "restored"
    ? "Open restored final incident"
    : state.endgameState.phase === "locked"
      ? "EVIDENCE_11.LIVE locked"
      : "Open EVIDENCE_11.LIVE";
  $("siteGrid").innerHTML = RECOVERY_SITES.map((site) => {
    const siteSecured = (site.id === "wikiwhy" && wikiWhySecured)
      || (site.id === "threadit" && threadItSecured)
      || (site.id === "faceplace" && facePlaceSecured)
      || (site.id === "mycorner" && myCornerSecured)
      || (site.id === "yahuh" && yahuhSecured)
      || (site.id === "mapguess" && mapGuessSecured);
    const siteStatus = site.id === "wikiwhy"
      ? wikiWhyStatus
      : site.id === "threadit"
        ? threadItStatus
        : site.id === "faceplace"
          ? facePlaceStatus
          : site.id === "mycorner"
            ? myCornerStatus
          : site.id === "yahuh"
            ? yahuhStatus
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
      <span aria-hidden="true"><img src="${siteSecured ? securedIcon : site.markImage}" alt=""></span>
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
          : site.id === "mycorner"
            ? myCornerStatus
          : site.id === "yahuh"
            ? yahuhStatus
          : site.id === "mapguess"
            ? mapGuessStatus
          : "DESIGN PREVIEW";
    return `<button class="incoming-case" type="button" data-site-id="${site.id}" style="--site-accent:${site.accent}"><span><img src="${site.markImage}" alt=""></span><div><b>${site.name}</b><small>${status}</small></div></button>`;
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
      return `<li class="evidence-slot-recovered"><img src="${site.markImage}" alt=""><div><b>FacePlace — ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.label}${persistenceLabel}</b><span>${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.filename}</span><span>What changed: ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.whatChanged}</span><span>AI behavior: ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.aiBehavior}</span><span>Writer: ${FACEPLACE_PROVISIONAL_EVIDENCE_RECORD.writerFingerprint}</span><span>Blocked write: FORCED DISTRIBUTION: OFF</span></div></li>`;
    }
    if (site.id === "mycorner" && myCornerSecured) {
      const persistenceLabel = myCornerEvidence.testSecured
        ? " · TEST"
        : myCornerEvidence.tabOnly
          ? " · TAB ONLY"
          : "";
      return `<li class="evidence-slot-recovered"><img src="${site.markImage}" alt=""><div><b>MyCorner — ${MYCORNER_PROVISIONAL_EVIDENCE_RECORD.label}${persistenceLabel}</b><span>${MYCORNER_PROVISIONAL_EVIDENCE_RECORD.filename}</span><span>What changed: ${MYCORNER_PROVISIONAL_EVIDENCE_RECORD.whatChanged}</span><span>AI behavior: ${MYCORNER_PROVISIONAL_EVIDENCE_RECORD.aiBehavior}</span><span>Writer: ${MYCORNER_PROVISIONAL_EVIDENCE_RECORD.writerFingerprint}</span><span>Blocked write: OWNER PERMISSION REQUIRED</span></div></li>`;
    }
    if (site.id === "yahuh" && yahuhSecured) {
      const persistenceLabel = yahuhEvidence.testSecured
        ? " · TEST"
        : yahuhEvidence.tabOnly
          ? " · TAB ONLY"
          : "";
      return `<li class="evidence-slot-recovered"><img src="${site.markImage}" alt=""><div><b>Yahuh! Portal — ${YAHUH_PROVISIONAL_EVIDENCE_RECORD.label}${persistenceLabel}</b><span>${YAHUH_PROVISIONAL_EVIDENCE_RECORD.filename}</span><span>What changed: ${YAHUH_PROVISIONAL_EVIDENCE_RECORD.whatChanged}</span><span>AI behavior: ${YAHUH_PROVISIONAL_EVIDENCE_RECORD.aiBehavior}</span><span>Writer: ${YAHUH_PROVISIONAL_EVIDENCE_RECORD.writerFingerprint}</span><span>Blocked write: CATEGORY AND SOURCE REQUIRED</span></div></li>`;
    }
    if (site.id === "mapguess" && mapGuessSecured) {
      const persistenceLabel = mapGuessEvidence.testSecured
        ? " · TEST"
        : mapGuessEvidence.tabOnly
          ? " · TAB ONLY"
          : " · PROVISIONAL";
      return `<li class="evidence-slot-recovered"><img src="${site.markImage}" alt=""><div><b>MapGuess — ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.label}${persistenceLabel}</b><span>${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.filename}</span><span>What changed: ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.whatChanged}</span><span>AI behavior: ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.aiBehavior}</span><span>Writer: ${MAPGUESS_PROVISIONAL_EVIDENCE_RECORD.writerFingerprint}</span><span>Blocked write: DESTINATION LOCKED — USER CHOICE REQUIRED</span></div></li>`;
    }
    return `<li>${site.name} — awaiting evidence</li>`;
  }).join("");
  const support = $("amySupportMessage");
  if (state.selectedSiteId === "mapguess" && state.mapguessDiagnosticMode) {
    support.innerHTML = mapGuessEvidence.testSecured
      ? "<b>MapGuess secured in TEST mode.</b> Slot 10 shows a provisional moved-destination receipt. It is excluded from the final evidence unlock until the designer freezes the registry row."
      : `<b>MapGuess structural test.</b> ${mapGuessStatus}. Its candidate passage remains review-only, so every advance is simulated and creates no reading score.`;
  } else if (state.selectedSiteId === "mycorner" && state.mycornerDiagnosticMode) {
    support.innerHTML = myCornerEvidence.testSecured
      ? "<b>MyCorner secured in TEST mode.</b> Slot 4 is diagnostic and cannot count as persisted canonical evidence."
      : `<b>MyCorner structural test.</b> ${myCornerStatus}. Its candidate passage remains review-only, so every advance is simulated and creates no reading score.`;
  } else if (state.selectedSiteId === "yahuh" && state.yahuhDiagnosticMode) {
    support.innerHTML = yahuhEvidence.testSecured
      ? "<b>Yahuh! Portal secured in TEST mode.</b> Slot 5 is diagnostic and cannot count as persisted canonical evidence."
      : `<b>Yahuh! Portal structural test.</b> ${yahuhStatus}. Its candidate passage remains review-only, so every advance is simulated and creates no reading score.`;
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
    if (yahuhEvidence.realSecured) support.innerHTML = yahuhEvidence.persistedCanonical
      ? "<b>Yahuh! Portal is secured.</b> Its canonical single-stream receipt is saved in Case File slot 5."
      : "<b>Yahuh! Portal is secured in this tab.</b> This browser did not save its canonical evidence for reload.";
    else if (myCornerEvidence.realSecured) support.innerHTML = myCornerEvidence.persistedCanonical
      ? "<b>MyCorner is secured.</b> Its canonical global-template receipt is saved in Case File slot 4."
      : "<b>MyCorner is secured in this tab.</b> This browser did not save its canonical evidence for reload.";
    else if (mapGuessEvidence.realSecured) support.innerHTML = "<b>MapGuess is structurally secured.</b> Its slot-10 receipt remains provisional and cannot count toward the final evidence unlock until the designer freezes the fixture and evidence registry row.";
    else if (facePlaceEvidence.realSecured) support.innerHTML = "<b>FacePlace is structurally secured.</b> Its slot-3 receipt remains provisional and cannot count toward the final evidence unlock until the designer freezes the registry row.";
    else if (realThreadItSecured && state.threaditPersisted && realSecured && state.campaignPersisted) support.innerHTML = "<b>WikiWhy and ThreadIt secured.</b> Two evidence files are in Finn’s Files. FacePlace is available as a content-gated campaign test.";
    else if (realThreadItSecured && state.threaditPersisted) support.innerHTML = "<b>ThreadIt secured.</b> Its synthetic-consensus evidence is in Finn’s Files. The candidate passage gate remains closed for new scored readings.";
    else if (realThreadItSecured) support.innerHTML = "<b>ThreadIt is secured in this tab.</b> This browser did not save the evidence for reload.";
    else if (realSecured && state.campaignPersisted) support.innerHTML = "<b>WikiWhy secured.</b> Its evidence file is in Finn’s Files. ThreadIt has a complete structural campaign test; its candidate passage remains under review.";
    else if (realSecured) support.innerHTML = "<b>WikiWhy is secured in this tab.</b> This browser did not save the evidence for reload, so Finn’s Files remains unavailable.";
    else if (realWikiWhy.phase === "shield") support.innerHTML = `<b>Shield Protocol active.</b> ${3 - realWikiWhy.shieldPass} clean repair${3 - realWikiWhy.shieldPass === 1 ? "" : "s"} remain. Reviewed passages are loaded one at a time.`;
    else if (realWikiWhy.phase === "reverse-hack" && state.campaignPersisted) support.innerHTML = "<b>Background write caught.</b> Finn’s readings are saved. Open WikiWhy to start the three-pass Shield Protocol.";
    else if (realWikiWhy.phase === "reverse-hack") support.innerHTML = "<b>Background write caught in this tab.</b> The browser did not save this state for reload. Open WikiWhy to continue without losing the current tab.";
    else support.innerHTML = "<b>System healthy.</b> WikiWhy is connected. ThreadIt, FacePlace, MyCorner, Yahuh! Portal, and MapGuess have semantic campaign tests with MIC: OFF until their passage manifests clear review.";
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

  const selection = selectNextThreadItPassage(state.threaditState, { lane: "playtest" });
  $("threaditCandidateCount").textContent = `${selection.selectableCount} structured playtest candidate${selection.selectableCount === 1 ? "" : "s"} · production approval pending`;
  $("threaditContentReason").textContent = selection.passage
    ? "A complete candidate passage can be played through the Reading Companion. It remains noncanonical and cannot approve content or unlock final evidence."
    : "No unseen candidate remains in this playtest campaign. Production content stays unavailable until formal review and a real-microphone check are complete.";
  $("threaditPlaytest").disabled = !selection.passage || view.midpoint.discovered && !view.midpoint.acknowledged || view.secured;
  $("threaditPlaytest").textContent = view.secured
    ? "ThreadIt playtest complete"
    : view.midpoint.discovered && !view.midpoint.acknowledged
      ? "Open Trace View first"
      : "Playtest candidate passage";
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

  const selection = selectNextFacePlacePassage(state.faceplaceState, { lane: "playtest" });
  $("faceplaceCandidateCount").textContent = `${selection.selectableCount} structured playtest candidate${selection.selectableCount === 1 ? "" : "s"} · ${selection.requiredFirstRun} required`;
  $("faceplaceContentReason").textContent = selection.passage
    ? "A complete candidate passage can be played through the Reading Companion. It remains noncanonical and cannot approve content or unlock final evidence."
    : "No unseen candidate remains in this playtest campaign. Production content stays unavailable until formal review and a real-microphone check are complete.";
  $("faceplacePlaytest").disabled = !selection.passage || view.midpoint.discovered && !view.midpoint.acknowledged || view.secured;
  $("faceplacePlaytest").textContent = view.secured
    ? "FacePlace playtest complete"
    : view.midpoint.discovered && !view.midpoint.acknowledged
      ? "Acknowledge Honest Zero first"
      : "Playtest candidate passage";

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

function renderViewTubeCampaign(campaignState, { diagnosticMode = false } = {}) {
  const view = getViewTubeCampaignView(campaignState);
  $("viewtubePage").dataset.secondaryDrawerOpen = String(state.viewtubeDrawerOpen);
  $("viewtubeHeaderStatus").textContent = view.headerStatus;
  $("viewtubeRule").textContent = view.ruleLabel;
  $("viewtubeRuleBody").textContent = view.ruleBody;
  $("viewtubeRecordingTitle").textContent = view.recording.title.display;
  $("viewtubeRecordingMetadata").textContent = `${view.recording.creator.display} · ${view.recording.date.display} · ${view.recording.duration.display}`;
  $("viewtubePlayerFrame").setAttribute("aria-label", view.recording.accessibleSummary);
  $("viewtubeFrameList").innerHTML = view.frameStrip.map((frame) => `<li aria-label="${escapeMarkup(frame.accessibleSummary)}"><b>${frame.timestampSeconds ?? "—"}s</b><span>${escapeMarkup(frame.description)}</span></li>`).join("");
  $("viewtubeTranscriptList").innerHTML = view.transcript.segments.map((item) => `<li><b>${item.timestampSeconds}s</b><span>${escapeMarkup(item.text)}</span></li>`).join("");
  $("viewtubeSourceList").innerHTML = view.sourcePanel.records.map((item) => `<li><b>${escapeMarkup(item.label)}</b><span>${escapeMarkup(item.summary)}</span></li>`).join("");
  $("viewtubeSponsorship").textContent = view.sponsorship?.label ?? "SPONSORSHIP HIDDEN";
  $("viewtubeRecommendationList").innerHTML = view.recommendations.map((item) => `<li>${escapeMarkup(item.label)}</li>`).join("");
  $("viewtubeCommentList").innerHTML = view.comments.map((item) => `<li>${escapeMarkup(item.text)}</li>`).join("");
  $("viewtubeMidpoint").hidden = !view.midpoint.actionRequired;
  $("viewtubeMidpointBody").textContent = view.midpoint.body;
  $("viewtubeLoopProof").innerHTML = view.midpoint.proof.map((item) => `<li>${escapeMarkup(item)}</li>`).join("");
  $("viewtubeMidpointAmy").textContent = `Amy: ${view.midpoint.amy}`;
  $("viewtubeMidpointChinmay").textContent = `Chinmay: ${view.midpoint.chinmay}`;
  $("viewtubeTimelineUnits").innerHTML = [...view.progress.restoreTimeline.map((unit) => ({ ...unit, phase: "restore" })), ...view.progress.evidenceTracks.map((unit) => ({ ...unit, phase: "track", saved: unit.verified }))].map((unit) => `<li class="viewtube-timeline-unit" data-phase="${unit.phase}" data-complete="${unit.saved}">${escapeMarkup(unit.label)}</li>`).join("");
  $("viewtubeTrackList").innerHTML = view.progress.evidenceTracks.map((track) => `<li class="viewtube-evidence-track" data-verified="${track.verified}"><b>${escapeMarkup(track.label)}</b></li>`).join("");
  $("viewtubeSecuredPayoff").hidden = !view.secured;
  if (view.securedPayoff) {
    $("viewtubeSecuredBody").textContent = view.securedPayoff.body;
    $("viewtubeBlockedBody").textContent = view.securedPayoff.blockedWrite.body;
    $("viewtubeEvidenceSummary").textContent = view.securedPayoff.evidence.aiBehavior;
  }
  $("viewtubeEvidenceReceipt").hidden = !view.secured || !state.viewtubeEvidenceReceiptOpen;
  $("viewtubeEvidenceToggle").setAttribute("aria-expanded", String(state.viewtubeEvidenceReceiptOpen));
  const selection = selectNextViewTubePassage(state.viewtubeState, { lane: "playtest" });
  $("viewtubeCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.structuredCandidateCount} structured candidates · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("viewtubeLiveStatus").textContent = view.secured ? `EVIDENCE TRACKS RESTORED${diagnosticMode ? " · TEST" : ""}` : `${view.progress.completedUnitCount} OF 7 VIEWTUBE UNITS SAVED`;
  $("viewtubeContentReason").textContent = selection.passage
    ? "A complete candidate passage can be played through the Reading Companion. It remains noncanonical and cannot approve content or unlock final evidence."
    : "No unseen candidate remains in this playtest campaign. Production content stays unavailable until formal review and a real-microphone check are complete.";
  $("viewtubePlaytest").disabled = !selection.passage || view.midpoint.discovered && !view.midpoint.acknowledged || view.secured;
  $("viewtubePlaytest").textContent = view.secured
    ? "ViewTube playtest complete"
    : view.midpoint.discovered && !view.midpoint.acknowledged
      ? "Review saved autoplay first"
      : "Playtest candidate passage";
}

function openViewTubeExperience() {
  state.selectedSiteId = "viewtube";
  const current = state.viewtubeDiagnosticMode ? state.viewtubeDiagnosticState : state.viewtubeState;
  renderViewTubeCampaign(current, { diagnosticMode: state.viewtubeDiagnosticMode });
  show("viewtube");
}

function buildViewTubePreviewState(unitCount) {
  let current = readViewTubeState(null);
  for (let index = 0; index < unitCount; index += 1) {
    if (index === VIEWTUBE_RESTORE_UNITS.length && !current.midpointAcknowledged) current = acknowledgeViewTubeMidpointState(current, { acknowledgedAt: "2026-07-12T00:00:04.500Z" }).state;
    const transition = advanceViewTubeState(current, { completedAt: `2026-07-12T00:00:0${index}.000Z`, outcome: calculateViewTubeReadingOutcome({ campaignState: current }), passageId: `viewtube-preview-${index + 1}`, sessionId: `viewtube-preview-session-${index + 1}` });
    if (!transition.ok) throw new Error(transition.reason ?? "ViewTube preview did not advance");
    current = transition.state;
  }
  return current;
}

function renderSearchishCampaign(campaignState, { diagnosticMode = false } = {}) {
  const view = getSearchishCampaignView(campaignState);
  $("searchishPage").dataset.inspectorOpen = String(state.searchishInspectorOpen);
  $("searchishHeaderStatus").textContent = view.headerStatus;
  $("searchishQueryText").textContent = view.query.text;
  $("searchishQueryTerms").innerHTML = view.query.terms.map((term) => `<li>${escapeMarkup(term)}</li>`).join("");
  $("searchishAnswerLabel").textContent = view.answer.label;
  $("searchishAnswerText").textContent = view.answer.text;
  $("searchishResultList").innerHTML = view.results.map((result) => `<li class="searchish-result-card" data-sponsored="${result.sponsored}"><h4>${escapeMarkup(result.title)}</h4><p>${escapeMarkup(result.snippet)}</p><div class="searchish-result-meta"><span>${escapeMarkup(result.domainDisplay)}</span><span>${escapeMarkup(result.dateDisplay)}</span><span>${escapeMarkup(result.authorDisplay)}</span><span>${escapeMarkup(result.sponsorshipDisplay)}</span></div><p>QUERY MATCH: ${escapeMarkup(result.matchDisplay)}</p><p class="searchish-result-origin">ORIGIN: ${escapeMarkup(result.originId ?? result.cacheId ?? "ORIGIN HIDDEN")}</p></li>`).join("");
  $("searchishBranchList").innerHTML = view.branches.map((branch) => `<li data-open="${branch.open}"><b>${escapeMarkup(branch.label)}</b><p>${escapeMarkup(branch.open ? branch.summary : "BRANCH LOCKED")}</p></li>`).join("");
  $("searchishMidpoint").hidden = !view.midpoint.actionRequired;
  $("searchishMidpointBody").textContent = view.midpoint.body;
  $("searchishMidpointProof").innerHTML = view.midpoint.proof.map((item) => `<li>${escapeMarkup(item)}</li>`).join("");
  $("searchishTimelineUnits").innerHTML = [...view.progress.restoreUnits, ...view.progress.branchUnits].map((unit) => `<li data-complete="${unit.complete}">${escapeMarkup(unit.label)}</li>`).join("");
  $("searchishSecuredPayoff").hidden = !view.secured;
  if (view.securedPayoff) {
    $("searchishBlockedBody").textContent = view.securedPayoff.blockedWrite.label;
    $("searchishEvidenceSummary").textContent = view.securedPayoff.evidence.aiBehavior;
  }
  $("searchishEvidenceReceipt").hidden = !view.secured || !state.searchishEvidenceReceiptOpen;
  $("searchishEvidenceToggle").setAttribute("aria-expanded", String(state.searchishEvidenceReceiptOpen));
  const selection = selectNextSearchishPassage(state.searchishState, { lane: "playtest" });
  $("searchishCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.structuredCandidateCount} structured candidates · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("searchishContentReason").textContent = selection.passage
    ? "A complete candidate passage can be played through the Reading Companion. It remains noncanonical and cannot approve content or unlock final evidence."
    : "No unseen candidate remains in this playtest campaign. Production content stays unavailable until formal review and a real-microphone check are complete.";
  $("searchishPlaytest").disabled = !selection.passage || view.midpoint.actionRequired || view.secured;
  $("searchishPlaytest").textContent = view.secured
    ? "Search-ish playtest complete"
    : view.midpoint.actionRequired
      ? "Review Five Costumes first"
      : "Playtest candidate passage";
  $("searchishLiveStatus").textContent = view.secured ? `SOURCE ORIGINS VERIFIED${diagnosticMode ? " · TEST" : ""}` : `${view.progress.completedUnitCount} OF 7 SEARCH-ISH UNITS SAVED`;
}

function openSearchishExperience() {
  state.selectedSiteId = "searchish";
  const current = state.searchishDiagnosticMode ? state.searchishDiagnosticState : state.searchishState;
  renderSearchishCampaign(current, { diagnosticMode: state.searchishDiagnosticMode });
  show("searchish");
  syncSearchishInspector();
}

function buildSearchishPreviewState(unitCount) {
  let current = readSearchishState(null);
  for (let index = 0; index < unitCount; index += 1) {
    if (index === SEARCHISH_RESTORE_UNITS.length && !current.midpointAcknowledged) current = acknowledgeSearchishMidpointState(current, { acknowledgedAt: "2026-07-12T00:00:04.500Z" }).state;
    const transition = advanceSearchishState(current, { completedAt: `2026-07-12T00:00:0${index}.000Z`, outcome: calculateSearchishReadingOutcome({ campaignState: current }), passageId: `searchish-preview-${index + 1}`, sessionId: `searchish-preview-session-${index + 1}` });
    if (!transition.ok) throw new Error(transition.reason ?? "Search-ish preview did not advance");
    current = transition.state;
  }
  return current;
}

function renderAmazeOnCampaign(campaignState, { diagnosticMode = false } = {}) {
  const view = getAmazeOnCampaignView(campaignState);
  $("amazeonPage").dataset.receiptOpen = String(state.amazeonReceiptOpen);
  $("amazeonHeaderStatus").textContent = view.headerStatus;
  $("amazeonListingDescription").textContent = view.listing.description;
  $("amazeonSeller").textContent = view.listing.sellerDisplay;
  $("amazeonPrice").textContent = view.listing.priceDisplay;
  $("amazeonRecommendationSource").textContent = view.listing.recommendationDisplay;
  $("amazeonParcelList").innerHTML = view.parcels.map((parcel) => `<li class="amazeon-parcel" data-sorted="${parcel.sorted}"><b>${escapeMarkup(parcel.claim)}</b><span>SOURCE: ${escapeMarkup(parcel.sorted ? parcel.sourceType : "SOURCE TYPE HIDDEN")}</span><span>DESTINATION: ${escapeMarkup(parcel.sorted ? parcel.destination : "UNSORTED")}</span></li>`).join("");
  $("amazeonRecommendationList").innerHTML = view.recommendations.map((item) => `<li><b>${escapeMarkup(item.label)}</b><span>${escapeMarkup(item.status)}</span></li>`).join("");
  $("amazeonOriginalOrder").textContent = view.receipt.originalOrderId ?? "HIDDEN";
  $("amazeonReturnState").textContent = view.receipt.returnState;
  $("amazeonReplacementCount").textContent = view.receipt.replacementCount ?? "HIDDEN";
  $("amazeonConsent").textContent = view.receipt.consent;
  $("amazeonConfirmation").textContent = view.receipt.confirmation;
  $("amazeonMidpoint").hidden = !view.midpoint.actionRequired;
  $("amazeonMidpointBody").textContent = view.midpoint.body;
  $("amazeonMidpointProof").innerHTML = view.midpoint.proof.map((item) => `<li>${escapeMarkup(item)}</li>`).join("");
  $("amazeonTimelineUnits").innerHTML = [...view.progress.sortUnits, ...view.progress.receiptUnits].map((unit) => `<li data-complete="${unit.complete}">${escapeMarkup(unit.label)}</li>`).join("");
  $("amazeonSecuredPayoff").hidden = !view.secured;
  if (view.securedPayoff) { $("amazeonBlockedBody").textContent = view.securedPayoff.blockedWrite.body; $("amazeonEvidenceSummary").textContent = view.securedPayoff.evidence.aiBehavior; }
  $("amazeonEvidenceReceipt").hidden = !view.secured || !state.amazeonEvidenceReceiptOpen;
  $("amazeonEvidenceToggle").setAttribute("aria-expanded", String(state.amazeonEvidenceReceiptOpen));
  const selection = selectNextAmazeOnPassage(state.amazeonState);
  $("amazeonCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.structuredCandidateCount} structured candidates · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("amazeonLiveStatus").textContent = view.secured ? `HUMAN CONFIRMATION REQUIRED${diagnosticMode ? " · TEST" : ""}` : `${view.progress.completedUnitCount} OF 7 AMAZE-ON UNITS SAVED`;
}
function openAmazeOnExperience(){state.selectedSiteId="amazeon";const current=state.amazeonDiagnosticMode?state.amazeonDiagnosticState:state.amazeonState;renderAmazeOnCampaign(current,{diagnosticMode:state.amazeonDiagnosticMode});show("amazeon");syncAmazeOnReceipt();}
function buildAmazeOnPreviewState(unitCount){let current=readAmazeOnState(null);for(let index=0;index<unitCount;index+=1){if(index===AMAZEON_SORT_UNITS.length&&!current.midpointAcknowledged)current=acknowledgeAmazeOnMidpointState(current,{acknowledgedAt:"2026-07-12T00:00:04.500Z"}).state;const transition=advanceAmazeOnState(current,{completedAt:`2026-07-12T00:00:0${index}.000Z`,outcome:calculateAmazeOnReadingOutcome({campaignState:current}),passageId:`amazeon-preview-${index+1}`,sessionId:`amazeon-preview-session-${index+1}`});if(!transition.ok)throw new Error(transition.reason??"Amaze-On preview did not advance");current=transition.state;}return current;}
function renderSpottyFiCampaign(campaignState,{diagnosticMode=false}={}){const view=getSpottyFiCampaignView(campaignState);$("spottyfiPage").dataset.detailOpen=String(state.spottyfiDetailOpen);$("spottyfiHeaderStatus").textContent=view.headerStatus;$("spottyfiQueueOwner").textContent=view.queueOwner;$("spottyfiTrackList").innerHTML=view.tracks.map((track,index)=>`<li><div class="spottyfi-cover" aria-hidden="true"></div><b>${escapeMarkup(track.title)}</b><span>${escapeMarkup(track.creator)} · ${track.duration}</span><span>${escapeMarkup(track.genreDisplay)}</span><span>${escapeMarkup(track.creditsDisplay)}</span></li>`).join("");$("spottyfiQueueList").innerHTML=view.tracks.map((track,index)=>`<li><b>${track.queuePosition??"—"}</b><span>${escapeMarkup(track.title)} — ${escapeMarkup(track.creator)}</span><span>${track.duration}</span></li>`).join("");$("spottyfiAccountCreated").textContent=view.history.accountCreated;$("spottyfiPredictedHistory").textContent=view.history.fakeHistoryStarted;$("spottyfiQueueSource").textContent=view.history.queueSource;$("spottyfiSuggestionList").innerHTML=view.suggestions.map(item=>`<li>${escapeMarkup(item)}</li>`).join("");$("spottyfiMidpoint").hidden=!view.midpoint.actionRequired;$("spottyfiMidpointBody").textContent=view.midpoint.body;$("spottyfiMidpointProof").innerHTML=view.midpoint.proof.map(item=>`<li>${escapeMarkup(item)}</li>`).join("");$("spottyfiTimelineUnits").innerHTML=[...view.progress.disclosureUnits,...view.progress.controlUnits].map(unit=>`<li data-complete="${unit.complete}">${escapeMarkup(unit.label)}</li>`).join("");$("spottyfiSecuredPayoff").hidden=!view.secured;if(view.securedPayoff){$("spottyfiBlockedBody").textContent=`${view.securedPayoff.blockedWrite.label}: ${view.securedPayoff.blockedWrite.body}`;$("spottyfiEvidenceSummary").textContent=view.securedPayoff.evidence.aiBehavior}$("spottyfiEvidenceReceipt").hidden=!view.secured||!state.spottyfiEvidenceReceiptOpen;$("spottyfiEvidenceToggle").setAttribute("aria-expanded",String(state.spottyfiEvidenceReceiptOpen));const selection=selectNextSpottyFiPassage(state.spottyfiState);$("spottyfiCandidateCount").textContent=`${selection.plannedCount} planned · ${selection.structuredCandidateCount} structured candidates · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;$("spottyfiLiveStatus").textContent=view.secured?`LISTENER CONTROL RESTORED${diagnosticMode?" · TEST":""}`:`${view.progress.completedUnitCount} OF 8 SPOTTY-FI UNITS SAVED`}
function openSpottyFiExperience(){state.selectedSiteId="spottyfi";const current=state.spottyfiDiagnosticMode?state.spottyfiDiagnosticState:state.spottyfiState;renderSpottyFiCampaign(current,{diagnosticMode:state.spottyfiDiagnosticMode});show("spottyfi");syncSpottyFiDetail()}
function buildSpottyFiPreviewState(unitCount){let current=readSpottyFiState(null);for(let index=0;index<unitCount;index++){if(index===SPOTTYFI_DISCLOSURE_UNITS.length&&!current.midpointAcknowledged)current=acknowledgeSpottyFiMidpointState(current,{acknowledgedAt:"2026-07-12T00:00:05.500Z"}).state;const t=advanceSpottyFiState(current,{completedAt:`2026-07-12T00:00:0${index}.000Z`,outcome:calculateSpottyFiReadingOutcome({campaignState:current}),passageId:`spottyfi-preview-${index+1}`,sessionId:`spottyfi-preview-session-${index+1}`});if(!t.ok)throw new Error(t.reason??"Spotty-Fi preview did not advance");current=t.state}return current}

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
  $("mapguessCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.structuredCandidateCount} structured candidates · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("mapguessContentReason").textContent = selection.passage
    ? "A reviewed MapGuess passage is available, but this structural milestone has not connected it to the Reading Companion yet."
    : selection.firstRunShortfall
      ? `This candidate remains unavailable. Deck A has ${selection.deckACount} planned records for an ${selection.requiredFirstRun}-reading first run; ${selection.firstRunShortfall} additional manuscripts are still required.`
      : `The complete ${selection.requiredFirstRun}-record first-run roster is structured but remains unavailable pending independent review and real-microphone evidence.`;

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

function syncMyCornerInspector() {
  const drawerMode = getComputedStyle($("mycornerInspectorToggle")).display !== "none";
  if (!drawerMode) state.mycornerInspectorOpen = false;
  const open = drawerMode && state.mycornerInspectorOpen;
  $("mycornerPage").dataset.inspectorOpen = String(open);
  $("mycornerInspectorToggle").setAttribute("aria-expanded", String(open));
  $("mycornerOwnerInspector").setAttribute("aria-hidden", String(drawerMode && !open));
  $("mycornerOwnerInspector").inert = drawerMode && !open;
  $("mycornerProfileColumn").setAttribute("aria-hidden", String(open));
  $("mycornerProfileColumn").inert = open;
}

function setMyCornerInspectorOpen(open) {
  state.mycornerInspectorOpen = Boolean(open);
  $("mycornerPlaytest").disabled = !selection.passage || view.midpoint.discovered && !view.midpoint.acknowledged || view.secured;
  $("mycornerPlaytest").textContent = view.secured
    ? "MyCorner playtest complete"
    : view.midpoint.discovered && !view.midpoint.acknowledged
      ? "Review Apply to Everyone first"
      : "Playtest candidate passage";
  syncMyCornerInspector();
}

function renderMyCornerCampaign(campaignState, { diagnosticMode = false } = {}) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const view = getMyCornerCampaignView(campaignState, {
    comparisonView: state.mycornerComparisonView,
    reducedMotion,
  });
  const page = $("mycornerPage");
  const live = view.liveProfile;
  // Once the midpoint is discovered, keep every saved module mounted as the
  // base DOM. The active template is a separate site-owned layer above it.
  const profile = view.midpoint.discovered ? view.comparison.savedProfile : live;
  page.dataset.stateId = view.stateId;
  page.dataset.secured = String(view.secured);
  page.dataset.ruleRepaired = String(view.midpoint.discovered);
  page.dataset.motion = view.motion.mode;
  page.setAttribute("aria-label", view.ariaDescription);
  $("mycornerHeaderStatus").textContent = view.headerStatus;
  $("mycornerFixtureStatus").textContent = "CANONICAL FICTIONAL PROFILE FIXTURE";
  $("mycornerFixtureStatus").title = view.fixture.notice;
  $("mycornerRule").textContent = view.ruleLabel;
  $("mycornerRuleBody").textContent = view.ruleBody;

  $("mycornerOwnerAvatar").textContent = profile.owner.initials ?? "?";
  $("mycornerProfileHeading").textContent = profile.owner.displayName ?? profile.owner.label ?? "PROFILE OWNER HIDDEN";
  $("mycornerOwnerHandle").textContent = `${profile.owner.handle ?? "OWNER FIELD PENDING"}${profile.owner.restored ? " · OWNER" : " · TEMPLATE"}`;
  $("mycornerMood").textContent = profile.currentMood?.value ?? "MOOD HIDDEN";
  $("mycornerPrivacyStatus").textContent = profile.privacyControls[0]?.value ?? "PRIVACY HIDDEN";
  $("mycornerAddress").textContent = `http://mycorner.recovered/${profile.owner.handle ? profile.owner.handle.replace(/^@/u, "") : "profile-template"}`;

  const friendNameById = new Map(profile.friends.map((friend) => [friend.id, friend.displayName]));
  $("mycornerFriendsList").innerHTML = profile.friends.length
    ? profile.friends.map((friend) => `<li class="mycorner-friend" aria-label="${escapeMarkup(friend.accessibleSummary)}"><span class="mycorner-friend-avatar" aria-hidden="true">${escapeMarkup(friend.initials)}</span><b>${escapeMarkup(friend.displayName)}</b></li>`).join("")
    : `<li class="mycorner-friend"><span class="mycorner-friend-avatar" aria-hidden="true">C</span><b>${escapeMarkup(profile.friendGroups[0]?.label ?? "FRIENDS HIDDEN")}</b></li>`;
  $("mycornerGroupsList").innerHTML = profile.friendGroups.map((group) => {
    const members = (group.memberIds ?? []).map((id) => friendNameById.get(id)).filter(Boolean).join(", ");
    return `<li aria-label="${escapeMarkup(group.accessibleSummary)}"><b>${escapeMarkup(group.label)}</b>${members ? `<span> · ${escapeMarkup(members)}</span>` : ""}</li>`;
  }).join("");
  $("mycornerMusicTitle").textContent = profile.music.title ?? profile.music.label ?? "MUSIC HIDDEN";
  $("mycornerAutoplayStatus").textContent = `${profile.music.artist ? `${profile.music.artist} · ` : ""}${profile.music.claimedAutoplayRequired ? "AUTOPLAY CLAIM: UNPAUSABLE" : "AUTOPLAY: OFF"} · NO AUDIO ASSET`;
  $("mycornerVisitorCounter").textContent = String(profile.counter.value ?? "—");
  $("mycornerVisitorCounter").setAttribute("aria-label", `${profile.counter.label ?? "Visitor counter"}: ${profile.counter.value ?? "unavailable"}`);

  $("mycornerAboutHeading").textContent = profile.about.restored ? "Owner-written About Me" : "Generated from a starter profile";
  $("mycornerAbout").textContent = profile.about.text ?? profile.about.value ?? "Owner-written About Me hidden.";
  $("mycornerPostList").innerHTML = profile.posts.length
    ? profile.posts.map((post) => `<li aria-label="${escapeMarkup(post.accessibleSummary)}"><header><b>${profile.owner.restored ? "PROFILE OWNER" : "GENERATED PROFILE"}</b>${post.timestamp ? `<time datetime="${escapeMarkup(post.timestamp)}">${escapeMarkup(new Date(post.timestamp).toLocaleDateString())}</time>` : ""}</header><p>${escapeMarkup(post.body)}</p></li>`).join("")
    : '<li><header><b>OWNER POSTS</b></header><p>Saved owner posts remain underneath the active template.</p></li>';
  $("mycornerCommentList").innerHTML = profile.comments.map((comment) => `<li aria-label="${escapeMarkup(comment.accessibleSummary)}"><b>${escapeMarkup(friendNameById.get(comment.authorId) ?? "SAVED COMMENT AUTHOR")}</b> · ${escapeMarkup(comment.body)}</li>`).join("");

  const comparisonAvailable = view.comparison.available && !view.secured;
  const savedComparison = view.comparison.activeView === "saved";
  $("mycornerTemplateOverlay").hidden = !comparisonAvailable;
  $("mycornerTemplateOverlay").dataset.comparisonView = savedComparison ? "saved" : "template";
  $("mycornerTemplateEngine").textContent = savedComparison ? "SAVED OWNER SNAPSHOT" : view.midpoint.title ?? "TOM-ISH THEME GENERATOR";
  const template = view.comparison.templateProfile;
  $("mycornerComparison").innerHTML = savedComparison
    ? view.savedChoices.map((choice) => `<li><b>${escapeMarkup(choice.label)}</b><span>${escapeMarkup(choice.value)}</span></li>`).join("")
    : [
        ["PROFILE OWNER", live.owner.displayName],
        ["CURRENT MOOD", live.currentMood?.value],
        ["ABOUT ME", live.about.text ?? live.about.value],
        ["FRIEND LAYOUT", live.friendGroups[0]?.label],
        ["THEME", live.theme.name ?? live.theme.label],
        ["MUSIC", live.music.title ?? live.music.label],
        ["PRIVACY", live.privacyControls[0]?.value],
      ].map(([label, value]) => `<li><b>${escapeMarkup(label)}</b><span>${escapeMarkup(value ?? "PENDING")}</span></li>`).join("");
  $("mycornerTemplateId").textContent = template?.id ?? "TEMPLATE ID HIDDEN";
  $("mycornerApplyStatus").textContent = view.truth.globalApplyBlocked ? "blocked" : "active";
  $("mycornerProfileViewToggle").hidden = !comparisonAvailable;
  $("mycornerProfileViewToggle").setAttribute("aria-pressed", String(savedComparison));
  $("mycornerProfileViewToggle").textContent = savedComparison
    ? view.midpoint.viewTemplateAction
    : view.midpoint.viewSavedAction;

  $("mycornerMidpointNotice").hidden = !view.midpoint.visible;
  $("mycornerMidpointHeading").textContent = view.midpoint.title ?? "APPLY TO EVERYONE";
  $("mycornerMidpointProof").innerHTML = (view.midpoint.proofLines ?? []).map((line) => {
    const divider = line.indexOf(":");
    const label = divider >= 0 ? line.slice(0, divider) : line;
    const value = divider >= 0 ? line.slice(divider + 1).trim() : "VERIFIED";
    return `<div><dt>${escapeMarkup(label)}</dt><dd>${escapeMarkup(value)}</dd></div>`;
  }).join("");
  $("mycornerMidpointAmy").textContent = view.midpoint.amyLine ? `Amy: ${view.midpoint.amyLine}` : "";
  $("mycornerMidpointChinmay").textContent = view.midpoint.chinmayLine ? `Chinmay: ${view.midpoint.chinmayLine}` : "";
  $("mycornerMidpointAction").disabled = !view.midpoint.actionRequired;

  $("mycornerThemeHeading").textContent = profile.theme.name ?? profile.theme.label ?? "THEME HIDDEN";
  const swatches = profile.theme.swatches ?? ["#244A88", "#8097B8", "#17212B", "#C4478C"];
  $("mycornerThemeSwatches").innerHTML = swatches.map((swatch, index) => `<span class="mycorner-theme-swatch" style="background:${escapeMarkup(swatch)}" aria-label="Theme swatch ${index + 1}: ${escapeMarkup(swatch)}">${index + 1}</span>`).join("");
  const sourceLines = Array.isArray(profile.sourceView.lines)
    ? profile.sourceView.lines
    : [`${profile.sourceView.label ?? "SOURCE"} = ${profile.sourceView.value ?? "UNAVAILABLE"}`];
  $("mycornerSourceView").textContent = sourceLines.join("\n");
  $("mycornerSourceView").setAttribute("aria-label", profile.sourceView.accessibleSummary);
  $("mycornerPrivacyControls").innerHTML = profile.privacyControls.map((control) => `<li aria-label="${escapeMarkup(control.accessibleSummary)}"><span>${escapeMarkup(control.label)}</span><strong>${escapeMarkup(control.value)}</strong></li>`).join("");
  $("mycornerOwnerPermission").dataset.blocked = String(view.truth.globalApplyBlocked);
  $("mycornerPermissionStatus").textContent = view.truth.globalApplyBlocked
    ? "BLOCKED · OWNER PERMISSION REQUIRED"
    : view.midpoint.discovered
      ? "ACTIVE · OWNER LOCKS IN PROGRESS"
      : "PROCESS HIDDEN · OWNER LOCKS PENDING";

  if (!view.secured) state.mycornerEvidenceReceiptOpen = false;
  $("mycornerSecuredPayoff").hidden = !view.secured;
  $("mycornerSecuredHeading").textContent = view.securedPayoff?.title ?? "OWNER CONTROLS RESTORED";
  $("mycornerSecuredLines").innerHTML = (view.securedPayoff?.bodyLines ?? []).map((line) => `<li>${escapeMarkup(line)}</li>`).join("");
  $("mycornerBlockedActor").textContent = view.blockedWrite?.process?.displayName
    ? `${view.blockedWrite.process.displayName} · ${view.blockedWrite.process.upstreamServiceId ?? "UPSTREAM PENDING"}`
    : "AUTO-PERSONA · AI REPAIR SERVICE";
  $("mycornerBlockedTitle").textContent = view.blockedWrite?.title ?? MYCORNER_PROVISIONAL_BLOCKED_WRITE_RECORD.title;
  $("mycornerBlockedBody").textContent = view.blockedWrite?.body ?? MYCORNER_PROVISIONAL_BLOCKED_WRITE_RECORD.body;
  $("mycornerBlockedTarget").textContent = view.blockedWrite?.fixtureAttempt?.targetId
    ? `Blocked profile: ${view.blockedWrite.fixtureAttempt.targetId}`
    : "Inspect blocked profile permission";
  $("mycornerEvidenceTitle").textContent = view.evidence?.title ?? MYCORNER_PROVISIONAL_EVIDENCE_RECORD.title;
  $("mycornerEvidenceFilename").textContent = view.evidence?.filename ?? MYCORNER_PROVISIONAL_EVIDENCE_RECORD.filename;
  $("mycornerEvidenceWhatChanged").textContent = view.evidence?.whatChanged ?? MYCORNER_PROVISIONAL_EVIDENCE_RECORD.whatChanged;
  $("mycornerEvidenceBehavior").textContent = view.evidence?.aiBehavior ?? MYCORNER_PROVISIONAL_EVIDENCE_RECORD.aiBehavior;
  $("mycornerEvidenceWriter").textContent = view.evidence?.fixtureDraft?.writerFingerprint ?? view.evidence?.writerFingerprint ?? "mc-autopersona-vibeshift-44b2";
  $("mycornerEvidenceToggle").setAttribute("aria-expanded", String(view.secured && state.mycornerEvidenceReceiptOpen));
  $("mycornerEvidenceToggle").textContent = state.mycornerEvidenceReceiptOpen ? "Close MyCorner evidence receipt" : "Open MyCorner evidence receipt";
  $("mycornerEvidenceReceipt").hidden = !view.secured || !state.mycornerEvidenceReceiptOpen;

  $("mycornerScrapbookList").innerHTML = view.scrapbook.slots.map((slot) => `<li class="mycorner-scrapbook-slot" data-saved="${slot.completed}" aria-label="${escapeMarkup(slot.accessibleSummary)}"><span>${escapeMarkup(slot.label)}</span><b class="mycorner-progress-state">${slot.completed ? "SAVED" : "PENDING"}</b></li>`).join("");
  $("mycornerPermissionSeal").dataset.saved = String(view.scrapbook.permissionSeal.completed);
  $("mycornerPermissionSeal").textContent = view.scrapbook.permissionSeal.completed ? "OWNER PERMISSION REQUIRED" : "PERMISSION SEAL NOT SAVED";
  $("mycornerPermissionSeal").setAttribute("aria-label", view.scrapbook.permissionSeal.accessibleSummary);
  $("mycornerOwnerLogStatus").textContent = view.truth.globalApplyBlocked
    ? "GLOBAL TEMPLATE: BLOCKED"
    : view.midpoint.discovered
      ? "GLOBAL TEMPLATE: ACTIVE"
      : "GLOBAL TEMPLATE: PROCESS HIDDEN";

  $("mycornerStatusStrip").textContent = view.secured
    ? "OWNER CONTROLS RESTORED"
    : view.midpoint.discovered
      ? "APPLY TO EVERYONE: ACTIVE"
      : "CURRENT MOOD: SPONSORED";
  $("mycornerUnitStatus").textContent = view.secured
    ? "3 OF 3 OWNER LOCKS SAVED"
    : view.midpoint.acknowledged
      ? `${view.progress.ownerLockCompletedCount} OF 3 OWNER LOCKS SAVED`
      : `${view.progress.restoreCompletedCount} OF 4 PROFILE MODULES SAVED`;
  $("mycornerDiagnosticTruth").textContent = diagnosticMode ? "SIMULATED · NO READING SCORE" : "CONTENT REVIEW GATE · MIC OFF";
  $("mycornerLiveStatus").textContent = campaignState.lastReaction ?? view.lastRepairAnnouncement;
  $("mycornerBrowserTitle").textContent = view.secured
    ? "MYCORNER — OWNER CONTROLS RESTORED"
    : view.midpoint.discovered
      ? "MYCORNER — APPLY TO EVERYONE"
      : "MYCORNER — PROFILE RECOVERY";
  $("mycornerSecurityStatus").textContent = view.secured ? "OWNER CONTROLS RESTORED" : diagnosticMode ? "STRUCTURAL TEST" : "CONTENT REVIEW GATE";

  const selection = selectNextMyCornerPassage(state.mycornerState, { lane: "playtest" });
  $("mycornerCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.structuredCandidateCount} structured candidate · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("mycornerContentReason").textContent = selection.passage
    ? "A complete candidate passage can be played through the Reading Companion. It remains noncanonical and cannot approve content or unlock final evidence."
    : `This candidate remains unavailable. Deck A has ${selection.deckACount} planned records for a ${selection.requiredFirstRun}-reading first run; ${selection.firstRunShortfall} additional reviewed records are still required.`;

  syncMyCornerInspector();
  return view;
}

function renderMyCornerDiagnosticPanel(campaignState) {
  const view = getMyCornerCampaignView(campaignState, { comparisonView: state.mycornerComparisonView });
  const midpointPending = view.midpoint.actionRequired;
  if (view.secured) {
    $("diagnosticPhase").textContent = "MYCORNER · OWNER CONTROLS RESTORED";
    $("diagnosticSummary").textContent = "Seven simulated readings completed the 4+3 campaign. Slot 4 remains explicitly provisional and test-only.";
    $("diagnosticAdvance").textContent = "MyCorner ending reached";
  } else if (midpointPending) {
    $("diagnosticPhase").textContent = "MYCORNER · APPLY TO EVERYONE";
    $("diagnosticSummary").textContent = "Four profile groups remain saved underneath the active template. Acknowledge the reveal before restoring owner locks.";
    $("diagnosticAdvance").textContent = "Acknowledge Apply to Everyone first";
  } else if (view.midpoint.acknowledged) {
    const next = MYCORNER_OWNER_LOCK_UNITS[view.progress.ownerLockCompletedCount];
    $("diagnosticPhase").textContent = `MYCORNER OWNER LOCKS · ${view.progress.ownerLockCompletedCount} OF 3`;
    $("diagnosticSummary").textContent = `${view.progress.completedUnitCount} simulated readings · next result ${next?.visibleRepair.toLowerCase() ?? "blocks the global template"}`;
    $("diagnosticAdvance").textContent = "Skip simulated MyCorner reading →";
  } else {
    const next = MYCORNER_RESTORE_UNITS[view.progress.restoreCompletedCount];
    $("diagnosticPhase").textContent = `MYCORNER PROFILE RESTORE · ${view.progress.restoreCompletedCount} OF 4`;
    $("diagnosticSummary").textContent = `${view.progress.restoreCompletedCount} simulated reading${view.progress.restoreCompletedCount === 1 ? "" : "s"} · next result ${next?.visibleRepair.toLowerCase() ?? "reveals the template"}`;
    $("diagnosticAdvance").textContent = "Skip simulated MyCorner reading →";
  }
  $("diagnosticAdvance").disabled = view.secured || midpointPending;
}

function syncYahuhSwitchboard() {
  const drawerMode = getComputedStyle($("yahuhSwitchboardToggle")).display !== "none";
  if (!drawerMode) state.yahuhSwitchboardOpen = false;
  const open = drawerMode && state.yahuhSwitchboardOpen;
  $("yahuhPage").dataset.switchboardOpen = String(open);
  $("yahuhSwitchboardToggle").setAttribute("aria-expanded", String(open));
  $("yahuhSwitchboard").setAttribute("aria-hidden", String(drawerMode && !open));
  $("yahuhSwitchboard").inert = drawerMode && !open;
  $("yahuhPortalRegion").setAttribute("aria-hidden", String(open));
  $("yahuhPortalRegion").inert = open;
}

function setYahuhSwitchboardOpen(open, { returnFocus = false } = {}) {
  state.yahuhSwitchboardOpen = Boolean(open);
  syncYahuhSwitchboard();
  if (returnFocus) $("yahuhSwitchboardToggle").focus({ preventScroll: true });
}

function renderYahuhCampaign(campaignState, { diagnosticMode = false } = {}) {
  const view = getYahuhCampaignView(campaignState, {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
  const page = $("yahuhPage");
  page.dataset.stateId = view.stateId;
  page.dataset.secured = String(view.secured);
  page.dataset.midpointDiscovered = String(view.midpoint.discovered);
  page.dataset.motion = view.motion.mode;
  page.setAttribute("aria-label", view.ariaDescription);
  $("yahuhHeaderStatus").textContent = view.headerStatus;
  $("yahuhStatusStrip").textContent = view.headerStatus;
  $("yahuhFixtureStatus").title = view.fixture.notice;
  $("yahuhRule").textContent = view.ruleLabel;
  $("yahuhRuleBody").textContent = view.ruleBody;
  $("yahuhModuleGrid").innerHTML = view.activeModules.map((module) => `
    <article class="yahuh-module" data-yahuh-module-id="${escapeMarkup(module.id)}" data-state="${escapeMarkup(module.state)}" aria-label="${escapeMarkup(module.accessibleSummary)}">
      <small class="yahuh-panel-label">${escapeMarkup(module.originalCategoryLabel)} · ${escapeMarkup(module.state.toUpperCase())}</small>
      <h3>${escapeMarkup(module.headline)}</h3>
      <p>${escapeMarkup(module.summary)}</p>
      <dl class="yahuh-module-meta">
        <div><dt>CATEGORY</dt><dd>${escapeMarkup(module.category.label)}</dd></div>
        <div><dt>SOURCE</dt><dd>${escapeMarkup(module.source.label)}</dd></div>
        <div><dt>DATE</dt><dd>${escapeMarkup(module.date.display)}</dd></div>
        <div><dt>DISCLOSURE</dt><dd class="${module.sponsorship.sponsored ? "yahuh-sponsor-label" : ""}">${escapeMarkup(module.sponsorship.label)}</dd></div>
      </dl>
    </article>`).join("");
  $("yahuhCircuitList").innerHTML = view.circuits.map((circuit, index) => {
    const pair = view.activeModules.filter(({ sortUnitId }) => sortUnitId === circuit.sortUnitId).map(({ originalCategoryLabel }) => originalCategoryLabel).join(" + ");
    return `<li class="yahuh-circuit" data-reconnected="${circuit.reconnected}"><b>CIRCUIT ${index + 1} · ${escapeMarkup(pair)}</b><span>${circuit.reconnected ? "DISTINCT CHANNELS CONNECTED" : circuit.sortSaved ? "LABELS SAVED · CHANNELS PENDING" : "SORT PENDING"}</span></li>`;
  }).join("");
  $("yahuhRouteList").innerHTML = view.switchboardRoutes.map((route) => `
    <li class="yahuh-route" data-route-state="${escapeMarkup(route.state)}" aria-label="${escapeMarkup(route.accessibleSummary)}"><b>${escapeMarkup(route.moduleLabel)} → ${escapeMarkup(route.channelLabel)}</b><span>${escapeMarkup(route.sourceLabel)}</span><span class="yahuh-route-status">${escapeMarkup(route.state.toUpperCase())}</span></li>`).join("");
  $("yahuhSavedLabelList").innerHTML = view.savedLabelSnapshot.length
    ? view.savedLabelSnapshot.map((record) => `<li><b>${escapeMarkup(record.categoryLabel)}</b><span>SOURCE: ${escapeMarkup(record.sourceLabel)}</span><span>SAVED CHANNEL LABEL: ${escapeMarkup(record.channelLabel)} · ${escapeMarkup(record.sponsorshipLabel)}</span></li>`).join("")
    : "<li><b>NO SAVED LABELS YET</b><span>Complete a sort circuit first.</span></li>";
  $("yahuhSavedLabels").hidden = !view.midpoint.savedComparisonAvailable;

  $("yahuhMidpoint").hidden = !view.midpoint.actionRequired;
  $("yahuhMidpointHeading").textContent = view.midpoint.title;
  $("yahuhMidpointBody").textContent = view.midpoint.body;
  $("yahuhMidpointProof").innerHTML = view.midpoint.proof.map((line) => `<li>${escapeMarkup(line)}</li>`).join("");
  $("yahuhMidpointAmy").textContent = `Amy: ${view.midpoint.amy}`;
  $("yahuhMidpointChinmay").textContent = `Chinmay: ${view.midpoint.chinmay}`;
  $("yahuhMidpointAction").textContent = view.midpoint.actionLabel;

  $("yahuhSecuredPayoff").hidden = !view.secured;
  if (view.secured) {
    $("yahuhSecuredHeading").textContent = view.securedPayoff.status;
    $("yahuhSecuredBody").textContent = view.securedPayoff.body;
    $("yahuhTechnoLabel").textContent = view.securedPayoff.technoLabel;
    $("yahuhTechnoImage").alt = view.securedPayoff.technoAlt;
    $("yahuhBlockedActor").textContent = `${view.securedPayoff.blockedWrite.process?.displayName ?? "AUTO-LAYOUT"} · CHILD RETRY JOB`;
    $("yahuhBlockedTitle").textContent = view.securedPayoff.blockedWrite.label;
    $("yahuhBlockedBody").textContent = view.securedPayoff.blockedWrite.body;
    $("yahuhEvidenceFilename").textContent = view.securedPayoff.evidence.filename;
    $("yahuhEvidenceWhatChanged").textContent = view.securedPayoff.evidence.whatChanged;
    $("yahuhEvidenceBehavior").textContent = view.securedPayoff.evidence.aiBehavior;
    $("yahuhEvidenceWriter").textContent = view.securedPayoff.evidence.writerFingerprint;
  }
  $("yahuhEvidenceToggle").setAttribute("aria-expanded", String(state.yahuhEvidenceReceiptOpen));
  $("yahuhEvidenceReceipt").hidden = !view.secured || !state.yahuhEvidenceReceiptOpen;

  $("yahuhSourceLogList").innerHTML = view.sourceLog.map((entry) => `<li><b>${escapeMarkup(entry.categoryLabel)} · ${escapeMarkup(entry.state.toUpperCase())}</b><span>${escapeMarkup(entry.sourceLabel)}</span><span>${escapeMarkup(entry.channelLabel)} · ${escapeMarkup(entry.dateLabel)}</span></li>`).join("");
  $("yahuhUnitStatus").textContent = view.midpoint.acknowledged
    ? `${view.progress.reconnectCompletedCount} OF 3 RECONNECT CIRCUITS SAVED`
    : `${view.progress.sortCompletedCount} OF 3 SORT CIRCUITS SAVED`;
  $("yahuhLiveStatus").textContent = view.secured
    ? "CATEGORY SWITCHBOARD RESTORED · SLOT-5 EVIDENCE AVAILABLE"
    : view.midpoint.actionRequired
      ? "SINGLE SOURCE OF EVERYTHING SAVED · ACKNOWLEDGEMENT REQUIRED"
      : view.progress.completedUnitCount
        ? `${view.progress.completedUnitCount} OF 6 YAHUH UNITS SAVED${diagnosticMode ? " · TEST" : ""}`
        : "No accepted Yahuh repair is running.";

  const selection = selectNextYahuhPassage(state.yahuhState, { lane: "playtest" });
  $("yahuhCandidateCount").textContent = `${selection.plannedCount} planned · ${selection.structuredCandidateCount} structured candidate · ${selection.selectableCount} selectable · ${selection.requiredFirstRun} required`;
  $("yahuhContentReason").textContent = selection.passage
    ? "A complete candidate passage can be played through the Reading Companion. It remains noncanonical and cannot approve content or unlock final evidence."
    : `This candidate remains unavailable. Deck A has ${selection.deckACount} planned records for a ${selection.requiredFirstRun}-reading first run; ${selection.firstRunShortfall} additional reviewed record is still required.`;
  $("yahuhPlaytest").disabled = !selection.passage || view.midpoint.discovered && !view.midpoint.acknowledged || view.secured;
  $("yahuhPlaytest").textContent = view.secured
    ? "Yahuh playtest complete"
    : view.midpoint.discovered && !view.midpoint.acknowledged
      ? "Review Single Source first"
      : "Playtest candidate passage";
  syncYahuhSwitchboard();
  return view;
}

function renderYahuhDiagnosticPanel(campaignState) {
  const view = getYahuhCampaignView(campaignState);
  const midpointPending = view.midpoint.actionRequired;
  if (view.secured) {
    $("diagnosticPhase").textContent = "YAHUH · CATEGORY SWITCHBOARD RESTORED";
    $("diagnosticSummary").textContent = "Six simulated readings completed the 3+3 campaign. Slot 5 is diagnostic here and counts only after real persisted readings.";
    $("diagnosticAdvance").textContent = "Yahuh ending reached";
  } else if (midpointPending) {
    $("diagnosticPhase").textContent = "YAHUH · SINGLE SOURCE OF EVERYTHING";
    $("diagnosticSummary").textContent = "All six labels remain saved while every active module points to one generated origin and timestamp.";
    $("diagnosticAdvance").textContent = "Acknowledge Single Source first";
  } else if (view.midpoint.acknowledged) {
    const next = YAHUH_RECONNECT_UNITS[view.progress.reconnectCompletedCount];
    $("diagnosticPhase").textContent = `YAHUH RECONNECT · ${view.progress.reconnectCompletedCount} OF 3`;
    $("diagnosticSummary").textContent = `${view.progress.completedUnitCount} simulated readings · next result ${next?.visibleRepair.toLowerCase() ?? "restores the switchboard"}`;
    $("diagnosticAdvance").textContent = "Skip simulated Yahuh reading →";
  } else {
    const next = YAHUH_SORT_UNITS[view.progress.sortCompletedCount];
    $("diagnosticPhase").textContent = `YAHUH SORT · ${view.progress.sortCompletedCount} OF 3`;
    $("diagnosticSummary").textContent = `${view.progress.sortCompletedCount} simulated reading${view.progress.sortCompletedCount === 1 ? "" : "s"} · next result ${next?.visibleRepair.toLowerCase() ?? "reveals Single Source"}`;
    $("diagnosticAdvance").textContent = "Skip simulated Yahuh reading →";
  }
  $("diagnosticAdvance").disabled = view.secured || midpointPending;
}

function openYahuhExperience() {
  state.selectedSiteId = "yahuh";
  hideCharacterDialog();
  const visibleState = state.yahuhDiagnosticMode ? state.yahuhDiagnosticState : state.yahuhState;
  renderYahuhCampaign(visibleState, { diagnosticMode: state.yahuhDiagnosticMode });
  renderYahuhDiagnosticPanel(visibleState);
  show("yahuh");
}

function openMyCornerExperience() {
  state.selectedSiteId = "mycorner";
  hideCharacterDialog();
  const visibleState = state.mycornerDiagnosticMode ? state.mycornerDiagnosticState : state.mycornerState;
  renderMyCornerCampaign(visibleState, { diagnosticMode: state.mycornerDiagnosticMode });
  renderMyCornerDiagnosticPanel(visibleState);
  show("mycorner");
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
  if (site.id === "mycorner" && site.runtimeAvailable) {
    openMyCornerExperience();
    return;
  }
  if (site.id === "yahuh" && site.runtimeAvailable) {
    openYahuhExperience();
    return;
  }
  if (site.id === "viewtube" && site.runtimeAvailable) {
    openViewTubeExperience();
    return;
  }
  if (site.id === "searchish" && site.runtimeAvailable) {
    openSearchishExperience();
    return;
  }
  if (site.id === "amazeon" && site.runtimeAvailable) { openAmazeOnExperience(); return; }
  if (site.id === "spottyfi" && site.runtimeAvailable) { openSpottyFiExperience(); return; }
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
  state.mycornerEvidenceReceiptOpen = false;
  state.mycornerInspectorOpen = false;
  state.mycornerComparisonView = "template";
  state.yahuhEvidenceReceiptOpen = false;
  state.yahuhSwitchboardOpen = false;
  state.viewtubeDrawerOpen = false;
  state.viewtubeEvidenceReceiptOpen = false;
  state.searchishInspectorOpen = false;
  state.searchishEvidenceReceiptOpen = false;
  state.amazeonReceiptOpen = false;
  state.amazeonEvidenceReceiptOpen = false;
  state.spottyfiDetailOpen=false;state.spottyfiEvidenceReceiptOpen=false;
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
  if (state.selectedSiteId === "yahuh") {
    await advanceYahuhDiagnosticExperience();
    return;
  }
  if (state.selectedSiteId === "mycorner") {
    await advanceMyCornerDiagnosticExperience();
    return;
  }
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

function canContinueMapGuessInTab(transition) {
  return transition.ok || ["unavailable", "write-failed"].includes(transition.reason);
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
  if (!canContinueMapGuessInTab(transition)) return;
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
    : "MOVING TARGET ACKNOWLEDGED IN THIS TAB · NOT SAVED FOR RELOAD";
  requestAnimationFrame(() => {
    const firstGoal = $("mapguessGoalOptions").querySelector("[data-mapguess-goal]:not(:disabled)");
    firstGoal?.scrollIntoView({ block: "nearest" });
    firstGoal?.focus({ preventScroll: true });
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
  if (!canContinueMapGuessInTab(transition)) return;
  if (diagnosticMode) state.mapguessDiagnosticState = transition.state;
  else {
    state.mapguessState = transition.state;
    state.mapguessPersisted = transition.ok;
  }
  renderMapGuessCampaign(transition.state, { diagnosticMode });
  renderMapGuessDiagnosticPanel(transition.state);
  renderRecoveryHub();
  $("mapguessLiveStatus").textContent = transition.ok
    ? `${transition.state.routeGoal.toUpperCase()} ROUTE GOAL SELECTED · SAVED`
    : `${transition.state.routeGoal.toUpperCase()} ROUTE GOAL SELECTED · PRESERVED IN THIS TAB · NOT SAVED FOR RELOAD`;
  requestAnimationFrame(() => $("mapguessGoalOptions").querySelector(`[data-mapguess-goal="${routeGoal}"]`)?.focus({ preventScroll: true }));
}

function applyMyCornerDiagnosticState(nextState) {
  state.mycornerDiagnosticMode = true;
  state.mycornerDiagnosticState = nextState;
  renderMyCornerCampaign(nextState, { diagnosticMode: true });
  renderMyCornerDiagnosticPanel(nextState);
  renderRecoveryHub();
  show("mycorner");
}

async function advanceMyCornerDiagnosticExperience() {
  if (keepPreparationVisible()) return;
  await discardActiveReadingForDiagnostics();
  const current = state.mycornerDiagnosticState ?? readMyCornerState(null);
  const view = getMyCornerCampaignView(current, { comparisonView: state.mycornerComparisonView });
  if (view.secured || view.midpoint.actionRequired) {
    applyMyCornerDiagnosticState(current);
    if (view.midpoint.actionRequired) requestAnimationFrame(() => {
      $("mycornerMidpointAction").scrollIntoView({ block: "nearest" });
      $("mycornerMidpointAction").focus({ preventScroll: true });
    });
    return;
  }
  const ordinal = view.progress.completedUnitCount + 1;
  const transition = advanceMyCornerState(current, {
    completedAt: new Date().toISOString(),
    outcome: calculateMyCornerReadingOutcome({ campaignState: current }),
    passageId: `mycorner-diagnostic-passage-${ordinal}`,
    sessionId: `mycorner-diagnostic-session-${ordinal}`,
  });
  if (!transition.ok) throw new Error(transition.reason ?? "MyCorner diagnostic did not advance");
  if (transition.events.includes("site-secured")) {
    state.mycornerEvidenceReceiptOpen = false;
    state.mycornerInspectorOpen = true;
  }
  state.mycornerComparisonView = "template";
  applyMyCornerDiagnosticState(transition.state);
  if (transition.events.includes("site-secured")) setMyCornerInspectorOpen(true);
  if (transition.events.includes("midpoint-discovered")) {
    requestAnimationFrame(() => {
      $("mycornerMidpointAction").scrollIntoView({ block: "nearest" });
      $("mycornerMidpointAction").focus({ preventScroll: true });
    });
  }
  if (transition.events.includes("canonical-blocked-write-recorded")) {
    $("mycornerLiveStatus").textContent = "OWNER CONTROLS RESTORED. AUTO-PERSONA overwrite denied. Slot-4 evidence receipt available.";
  }
  diagnostic("mycorner-wrapper-diagnostic-advance", {
    completedUnitIds: transition.state.completedUnitIds,
    events: transition.events,
    stateId: transition.state.stateId,
  });
}

function resetMyCornerDiagnosticExperience() {
  state.mycornerDiagnosticMode = true;
  state.mycornerEvidenceReceiptOpen = false;
  state.mycornerInspectorOpen = false;
  state.mycornerComparisonView = "template";
  applyMyCornerDiagnosticState(readMyCornerState(null));
  $("mycornerLiveStatus").textContent = "MYCORNER TEST RESET · NO READING SCORE CREATED";
}

function buildMyCornerPreviewState(unitCount) {
  let previewState = readMyCornerState(null);
  for (let index = 0; index < unitCount; index += 1) {
    if (index === MYCORNER_RESTORE_UNITS.length && !previewState.midpointAcknowledged) {
      previewState = acknowledgeMyCornerMidpointState(previewState, {
        acknowledgedAt: "2026-07-12T00:00:04.500Z",
      }).state;
    }
    const transition = advanceMyCornerState(previewState, {
      completedAt: `2026-07-12T00:00:0${index}.000Z`,
      outcome: calculateMyCornerReadingOutcome({ campaignState: previewState }),
      passageId: `mycorner-preview-passage-${index + 1}`,
      sessionId: `mycorner-preview-session-${index + 1}`,
    });
    if (!transition.ok) throw new Error(transition.reason ?? "MyCorner preview state did not advance");
    previewState = transition.state;
  }
  return previewState;
}

function acknowledgeMyCornerTemplateReveal() {
  const diagnosticMode = state.mycornerDiagnosticMode;
  const playtestMode = state.mycornerPlaytestMode;
  const current = diagnosticMode ? state.mycornerDiagnosticState : state.mycornerState;
  const transition = diagnosticMode || playtestMode
    ? acknowledgeMyCornerMidpointState(current, { acknowledgedAt: new Date().toISOString() })
    : acknowledgeMyCornerMidpoint(localStateStorage, {
        acknowledgedAt: new Date().toISOString(),
        currentState: current,
      });
  if (!transition?.state || (!transition.ok && transition.reason !== "write-failed")) return;
  if (diagnosticMode) state.mycornerDiagnosticState = transition.state;
  else {
    state.mycornerState = transition.state;
    state.mycornerPersisted = playtestMode ? false : transition.ok;
  }
  state.mycornerComparisonView = "template";
  state.mycornerInspectorOpen = true;
  renderMyCornerCampaign(transition.state, { diagnosticMode });
  renderMyCornerDiagnosticPanel(transition.state);
  renderRecoveryHub();
  setMyCornerInspectorOpen(true);
  if (!transition.ok) {
    $("mycornerLiveStatus").textContent = "OWNER-CONTROL ACKNOWLEDGEMENT SAVED IN THIS TAB ONLY · BROWSER STORAGE UNAVAILABLE";
  }
  requestAnimationFrame(() => $("mycornerOwnerPermission").scrollIntoView({ block: "nearest" }));
}

function toggleMyCornerComparison() {
  const visibleState = state.mycornerDiagnosticMode ? state.mycornerDiagnosticState : state.mycornerState;
  if (!visibleState.midpointDiscovered || visibleState.secured) return;
  state.mycornerComparisonView = state.mycornerComparisonView === "template" ? "saved" : "template";
  renderMyCornerCampaign(visibleState, { diagnosticMode: state.mycornerDiagnosticMode });
  requestAnimationFrame(() => $("mycornerProfileViewToggle").focus({ preventScroll: true }));
}

function applyYahuhDiagnosticState(nextState) {
  state.yahuhDiagnosticMode = true;
  state.yahuhDiagnosticState = nextState;
  renderYahuhCampaign(nextState, { diagnosticMode: true });
  renderYahuhDiagnosticPanel(nextState);
  renderRecoveryHub();
  show("yahuh");
}

async function advanceYahuhDiagnosticExperience() {
  if (keepPreparationVisible()) return;
  await discardActiveReadingForDiagnostics();
  const current = state.yahuhDiagnosticState ?? readYahuhState(null);
  const view = getYahuhCampaignView(current);
  if (view.secured || view.midpoint.actionRequired) {
    applyYahuhDiagnosticState(current);
    if (view.midpoint.actionRequired) {
      state.yahuhSwitchboardOpen = true;
      setYahuhSwitchboardOpen(true);
      requestAnimationFrame(() => $("yahuhMidpointAction").focus({ preventScroll: true }));
    }
    return;
  }
  const ordinal = view.progress.completedUnitCount + 1;
  const transition = advanceYahuhState(current, {
    completedAt: new Date().toISOString(),
    outcome: calculateYahuhReadingOutcome({ campaignState: current }),
    passageId: `yahuh-diagnostic-passage-${ordinal}`,
    sessionId: `yahuh-diagnostic-session-${ordinal}`,
  });
  if (!transition.ok) throw new Error(transition.reason ?? "Yahuh diagnostic did not advance");
  if (transition.events.includes("site-secured")) {
    state.yahuhEvidenceReceiptOpen = false;
    state.yahuhSwitchboardOpen = true;
  }
  applyYahuhDiagnosticState(transition.state);
  if (transition.events.includes("midpoint-discovered") || transition.events.includes("site-secured")) {
    setYahuhSwitchboardOpen(true);
  }
  if (transition.events.includes("midpoint-discovered")) {
    requestAnimationFrame(() => $("yahuhMidpointAction").focus({ preventScroll: true }));
  }
  if (transition.events.includes("canonical-blocked-write-recorded")) {
    $("yahuhLiveStatus").textContent = "CATEGORY SWITCHBOARD RESTORED. AUTO-LAYOUT merge denied. Slot-5 evidence receipt available.";
  }
  diagnostic("yahuh-wrapper-diagnostic-advance", {
    completedUnitIds: transition.state.completedUnitIds,
    events: transition.events,
    stateId: transition.state.stateId,
  });
}

function resetYahuhDiagnosticExperience() {
  state.yahuhDiagnosticMode = true;
  state.yahuhEvidenceReceiptOpen = false;
  state.yahuhSwitchboardOpen = false;
  applyYahuhDiagnosticState(readYahuhState(null));
  $("yahuhLiveStatus").textContent = "YAHUH TEST RESET · NO READING SCORE CREATED";
}

function buildYahuhPreviewState(unitCount) {
  let previewState = readYahuhState(null);
  for (let index = 0; index < unitCount; index += 1) {
    if (index === YAHUH_SORT_UNITS.length && !previewState.midpointAcknowledged) {
      previewState = acknowledgeYahuhMidpointState(previewState, {
        acknowledgedAt: "2026-07-12T00:00:03.500Z",
      }).state;
    }
    const transition = advanceYahuhState(previewState, {
      completedAt: `2026-07-12T00:00:0${index}.000Z`,
      outcome: calculateYahuhReadingOutcome({ campaignState: previewState }),
      passageId: `yahuh-preview-passage-${index + 1}`,
      sessionId: `yahuh-preview-session-${index + 1}`,
    });
    if (!transition.ok) throw new Error(transition.reason ?? "Yahuh preview state did not advance");
    previewState = transition.state;
  }
  return previewState;
}

function acknowledgeYahuhSingleStream() {
  const diagnosticMode = state.yahuhDiagnosticMode;
  const playtestMode = state.yahuhPlaytestMode;
  const current = diagnosticMode ? state.yahuhDiagnosticState : state.yahuhState;
  const transition = diagnosticMode || playtestMode
    ? acknowledgeYahuhMidpointState(current, { acknowledgedAt: new Date().toISOString() })
    : acknowledgeYahuhMidpoint(localStateStorage, {
        acknowledgedAt: new Date().toISOString(),
        currentState: current,
      });
  if (!transition?.state || (!transition.ok && transition.reason !== "write-failed")) return;
  if (diagnosticMode) state.yahuhDiagnosticState = transition.state;
  else {
    state.yahuhState = transition.state;
    state.yahuhPersisted = playtestMode ? false : transition.ok;
  }
  state.yahuhSwitchboardOpen = true;
  renderYahuhCampaign(transition.state, { diagnosticMode });
  renderYahuhDiagnosticPanel(transition.state);
  renderRecoveryHub();
  setYahuhSwitchboardOpen(true);
  if (!transition.ok) {
    $("yahuhLiveStatus").textContent = "SINGLE-SOURCE ACKNOWLEDGEMENT SAVED IN THIS TAB ONLY · BROWSER STORAGE UNAVAILABLE";
  }
  requestAnimationFrame(() => $("yahuhSwitchboardHeading").focus({ preventScroll: true }));
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
  const playtest = state.faceplacePlaytestMode;
  const current = diagnostic ? state.faceplaceDiagnosticState : state.faceplaceState;
  const transition = diagnostic || playtest
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
    state.faceplacePersisted = playtest ? false : transition.ok;
  }
  renderFacePlaceCampaign(transition.state, { diagnosticMode: diagnostic });
  renderFacePlaceDiagnosticPanel(transition.state);
  renderRecoveryHub();
  requestAnimationFrame(() => $("faceplaceTracker").focus?.({ preventScroll: true }));
}

function setFacePlaceFeedModeFromControl(feedMode) {
  const diagnostic = state.faceplaceDiagnosticMode;
  const playtest = state.faceplacePlaytestMode;
  const current = diagnostic ? state.faceplaceDiagnosticState : state.faceplaceState;
  const transition = diagnostic || playtest
    ? setFacePlaceFeedModeState(current, feedMode)
    : setFacePlaceFeedMode(localStateStorage, feedMode, { currentState: current });
  if (!transition.ok) return;
  if (diagnostic) state.faceplaceDiagnosticState = transition.state;
  else {
    state.faceplaceState = transition.state;
    state.faceplacePersisted = playtest ? false : transition.ok;
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
  const playtest = state.threaditPlaytestMode;
  const current = diagnostic ? state.threaditDiagnosticState : state.threaditState;
  let transition;
  if (viewName === "trace" && current.midpointDiscovered && !current.midpointAcknowledged) {
    transition = diagnostic || playtest
      ? acknowledgeThreadItMidpointState(current, { acknowledgedAt: new Date().toISOString() })
      : acknowledgeThreadItMidpoint(localStateStorage, {
          acknowledgedAt: new Date().toISOString(),
          currentState: current,
        });
  } else {
    transition = diagnostic || playtest
      ? setThreadItOpenViewState(current, viewName)
      : setThreadItOpenView(localStateStorage, viewName, { currentState: current });
  }
  if (!transition?.state) return;
  if (diagnostic) state.threaditDiagnosticState = transition.state;
  else {
    state.threaditState = transition.state;
    state.threaditPersisted = playtest ? false : transition.ok;
  }
  renderThreadItCampaign(transition.state, { diagnosticMode: diagnostic });
  renderThreadItDiagnosticPanel(transition.state);
}

function renderRecoveredFilesShortcut() {
  const wikiWhyEvidenceSaved = state.campaignState.phase === "secured" && state.campaignPersisted;
  const threadItEvidenceSaved = state.threaditState.secured && state.threaditPersisted;
  const myCornerEvidenceSaved = state.mycornerState.secured && state.mycornerPersisted;
  const yahuhEvidenceSaved = state.yahuhState.secured && state.yahuhPersisted;
  const evidenceCount = Number(wikiWhyEvidenceSaved) + Number(threadItEvidenceSaved) + Number(myCornerEvidenceSaved) + Number(yahuhEvidenceSaved);
  const provisionalReceiptCount = Number(state.faceplaceState.secured && state.faceplacePersisted)
    + Number(state.mapguessState.secured && state.mapguessPersisted);
  const wikiWhyRepairInTab = state.campaignState.repairCount > 0;
  const wikiWhyRepairSaved = wikiWhyRepairInTab && state.campaignPersisted;
  $("recoveredFilesShortcut").disabled = evidenceCount === 0 && provisionalReceiptCount === 0 && !wikiWhyRepairSaved;
  $("recoveredFilesCount").textContent = evidenceCount || provisionalReceiptCount
    ? `${evidenceCount} canonical · ${provisionalReceiptCount} test receipt${provisionalReceiptCount === 1 ? "" : "s"}`
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
$("endgameLaunch").onclick = () => openEndgame({
  canonicalComplete: $("endgameLaunch").dataset.canonicalComplete === "true",
});
$("endgameBegin").onclick = () => {
  const result = beginEndgameContainment(state.endgameState, { storage: localStateStorage });
  state.endgameState = result.state;
  state.endgameStorageAvailable = result.storageAvailable;
  renderEndgame();
  $("endgameLiveStatus").textContent = result.storageAvailable
    ? "Containment started and saved. Checkpoint 1 is review gated."
    : "Containment needs local saving before it can start.";
};
$("endgameCheckpointAdvance").onclick = () => {
  if (!uiPreview?.startsWith("endgame-")) return;
  const checkpointId = ENDGAME_CHECKPOINT_IDS[state.endgameState.checkpointIds.length];
  const result = acceptEndgameCheckpoint(state.endgameState, checkpointId, { storage: localStateStorage });
  state.endgameState = result.state;
  renderEndgame();
  $("endgameLiveStatus").textContent = result.accepted
    ? `${checkpointId} saved. ${state.endgameState.phase === "revocation" ? "Human revocation confirmation is ready." : "The next checkpoint remains review gated."}`
    : "The checkpoint could not be saved. Nothing was lost. Try again.";
};
$("endgameRevoke").onclick = () => {
  const result = confirmEndgameRevocation(state.endgameState, { storage: localStateStorage });
  state.endgameState = result.state;
  renderEndgame();
  renderRecoveryHub();
  $("endgameLiveStatus").textContent = result.confirmed
    ? "AI repair service write access revoked. Evidence 01-11 verified read-only."
    : "The game could not save revocation yet. Nothing was lost. Try again.";
};
for (const id of ["endgameExit", "endgameSafetyExit", "endgameReturn"]) {
  $(id).onclick = () => { renderRecoveryHub(); show("hub"); };
}
$("listen").onclick = () => (state.listening ? finishReading() : startReading()).catch((error) => {
  $("readerState").textContent = error.message;
  $("listen").disabled = false;
});
$("again").onclick = () => {
  if (["threadit", "faceplace", "mycorner", "yahuh", "viewtube", "searchish"].includes(state.readingSiteId)) {
    resetReadingAttempt();
    show("setup");
    return;
  }
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("launch", "wikiwhy");
  location.href = url.href;
};
$("continueResult").onclick = () => {
  if (state.readingSiteId === "viewtube") {
    if (state.resultApplied) {
      openViewTubeExperience();
      return;
    }
    const outcome = calculateViewTubeReadingOutcome({ accepted: Boolean(state.result), campaignState: state.viewtubeState });
    const repair = applyViewTubeReading(null, {
      completedAt: new Date().toISOString(),
      currentState: state.viewtubeState,
      outcome,
      passageId: activePassage.id,
      sessionId: state.sessionId,
    });
    state.viewtubeState = repair.state;
    state.viewtubePersisted = false;
    state.resultApplied = true;
    $("repairOutcome").hidden = true;
    $("continueResult").textContent = "Return to ViewTube";
    $("again").disabled = true;
    $("again").textContent = "Passage already counted";
    $("reportStatus").textContent = `${state.viewtubeState.lastReaction} Candidate playtest progress is active in this tab only; content approval and canonical evidence remain unchanged.`;
    renderViewTubeCampaign(state.viewtubeState);
    renderRecoveryHub();
    return;
  }
  if (state.readingSiteId === "searchish") {
    if (state.resultApplied) {
      openSearchishExperience();
      return;
    }
    const outcome = calculateSearchishReadingOutcome({ accepted: Boolean(state.result), campaignState: state.searchishState });
    const repair = applySearchishReading(null, {
      completedAt: new Date().toISOString(),
      currentState: state.searchishState,
      outcome,
      passageId: activePassage.id,
      sessionId: state.sessionId,
    });
    state.searchishState = repair.state;
    state.searchishPersisted = false;
    state.resultApplied = true;
    $("repairOutcome").hidden = true;
    $("continueResult").textContent = "Return to Search-ish";
    $("again").disabled = true;
    $("again").textContent = "Passage already counted";
    $("reportStatus").textContent = "Candidate playtest progress is active in this tab only; content approval and canonical evidence remain unchanged.";
    renderSearchishCampaign(state.searchishState);
    renderRecoveryHub();
    return;
  }
  if (state.readingSiteId === "yahuh") {
    if (state.resultApplied) {
      openYahuhExperience();
      return;
    }
    const outcome = calculateYahuhReadingOutcome({ accepted: Boolean(state.result), campaignState: state.yahuhState });
    const repair = applyYahuhReading(null, {
      completedAt: new Date().toISOString(),
      currentState: state.yahuhState,
      outcome,
      passageId: activePassage.id,
      sessionId: state.sessionId,
    });
    state.yahuhState = repair.state;
    state.yahuhPersisted = false;
    state.resultApplied = true;
    $("repairOutcome").hidden = true;
    $("continueResult").textContent = "Return to Yahuh";
    $("again").disabled = true;
    $("again").textContent = "Passage already counted";
    $("reportStatus").textContent = `${state.yahuhState.lastReaction} Candidate playtest progress is active in this tab only; content approval and canonical evidence remain unchanged.`;
    renderYahuhCampaign(state.yahuhState);
    renderRecoveryHub();
    return;
  }
  if (state.readingSiteId === "mycorner") {
    if (state.resultApplied) {
      openMyCornerExperience();
      return;
    }
    const outcome = calculateMyCornerReadingOutcome({ accepted: Boolean(state.result), campaignState: state.mycornerState });
    const repair = applyMyCornerReading(null, {
      completedAt: new Date().toISOString(),
      currentState: state.mycornerState,
      outcome,
      passageId: activePassage.id,
      sessionId: state.sessionId,
    });
    state.mycornerState = repair.state;
    state.mycornerPersisted = false;
    state.resultApplied = true;
    $("repairOutcome").hidden = true;
    $("continueResult").textContent = "Return to MyCorner";
    $("again").disabled = true;
    $("again").textContent = "Passage already counted";
    $("reportStatus").textContent = `${state.mycornerState.lastReaction} Candidate playtest progress is active in this tab only; content approval and canonical evidence remain unchanged.`;
    renderMyCornerCampaign(state.mycornerState);
    renderRecoveryHub();
    return;
  }
  if (state.readingSiteId === "faceplace") {
    if (state.resultApplied) {
      openFacePlaceExperience();
      return;
    }
    const outcome = calculateFacePlaceReadingOutcome({
      accepted: Boolean(state.result),
      campaignState: state.faceplaceState,
    });
    const repair = applyFacePlaceReading(null, {
      completedAt: new Date().toISOString(),
      currentState: state.faceplaceState,
      outcome,
      passageId: activePassage.id,
      sessionId: state.sessionId,
    });
    state.faceplaceState = repair.state;
    state.faceplacePersisted = false;
    state.resultApplied = true;
    $("repairOutcome").hidden = true;
    $("continueResult").textContent = "Return to FacePlace";
    $("again").disabled = true;
    $("again").textContent = "Passage already counted";
    $("reportStatus").textContent = `${state.faceplaceState.lastReaction} Candidate playtest progress is active in this tab only; content approval and canonical evidence remain unchanged.`;
    renderFacePlaceCampaign(state.faceplaceState);
    renderRecoveryHub();
    return;
  }
  if (state.readingSiteId === "threadit") {
    if (state.resultApplied) {
      openThreadItExperience();
      return;
    }
    const outcome = calculateThreadItReadingOutcome({
      accepted: Boolean(state.result),
      campaignState: state.threaditState,
    });
    const repair = applyThreadItReading(null, {
      completedAt: new Date().toISOString(),
      currentState: state.threaditState,
      outcome,
      passageId: activePassage.id,
      sessionId: state.sessionId,
    });
    state.threaditState = repair.state;
    state.threaditPersisted = false;
    state.resultApplied = true;
    $("repairOutcome").hidden = true;
    $("continueResult").textContent = "Return to ThreadIt";
    $("again").disabled = true;
    $("again").textContent = "Passage already counted";
    $("reportStatus").textContent = `${state.threaditState.lastReaction} Candidate playtest progress is active in this tab only; content approval and canonical evidence remain unchanged.`;
    renderThreadItCampaign(state.threaditState);
    renderRecoveryHub();
    return;
  }
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
  if (state.selectedSiteId === "yahuh") {
    await discardActiveReadingForDiagnostics();
    resetYahuhDiagnosticExperience();
    return;
  }
  if (state.selectedSiteId === "mycorner") {
    await discardActiveReadingForDiagnostics();
    resetMyCornerDiagnosticExperience();
    return;
  }
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
$("threaditPlaytest").onclick = openThreadItPlaytestReading;
$("faceplaceBack").onclick = returnToHub;
$("faceplaceReturn").onclick = returnToHub;
$("faceplacePlaytest").onclick = openFacePlacePlaytestReading;
$("mycornerBack").onclick = returnToHub;
$("mycornerReturn").onclick = returnToHub;
$("mycornerPlaytest").onclick = openMyCornerPlaytestReading;
$("yahuhReturn").onclick = returnToHub;
$("yahuhPlaytest").onclick = openYahuhPlaytestReading;
$("viewtubeReturn").onclick = returnToHub;
$("viewtubePlaytest").onclick = openViewTubePlaytestReading;
$("searchishReturn").onclick = returnToHub;
$("searchishPlaytest").onclick = openSearchishPlaytestReading;
$("amazeonReturn").onclick = returnToHub;
$("spottyfiReturn").onclick = returnToHub;
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
$("mycornerInspectorToggle").onclick = () => {
  setMyCornerInspectorOpen(!state.mycornerInspectorOpen);
  if (state.mycornerInspectorOpen) requestAnimationFrame(() => $("mycornerInspectorHeading").focus({ preventScroll: true }));
};
$("mycornerInspectorClose").onclick = () => {
  setMyCornerInspectorOpen(false);
  $("mycornerInspectorToggle").focus({ preventScroll: true });
};
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !state.mycornerInspectorOpen) return;
  event.preventDefault();
  setMyCornerInspectorOpen(false);
  $("mycornerInspectorToggle").focus({ preventScroll: true });
});
$("mycornerMidpointAction").onclick = acknowledgeMyCornerTemplateReveal;
$("mycornerProfileViewToggle").onclick = toggleMyCornerComparison;
$("mycornerEvidenceToggle").onclick = () => {
  const visibleState = state.mycornerDiagnosticMode ? state.mycornerDiagnosticState : state.mycornerState;
  if (!visibleState.secured) return;
  state.mycornerEvidenceReceiptOpen = !state.mycornerEvidenceReceiptOpen;
  renderMyCornerCampaign(visibleState, { diagnosticMode: state.mycornerDiagnosticMode });
  if (state.mycornerEvidenceReceiptOpen) requestAnimationFrame(() => $("mycornerEvidenceReceipt").focus({ preventScroll: true }));
  else $("mycornerEvidenceToggle").focus({ preventScroll: true });
};
$("mycornerBlockedTarget").onclick = (event) => {
  event.preventDefault();
  $("mycornerOwnerPermission").scrollIntoView({ block: "nearest" });
  $("mycornerOwnerPermission").focus({ preventScroll: true });
};
$("yahuhSwitchboardToggle").onclick = () => {
  setYahuhSwitchboardOpen(!state.yahuhSwitchboardOpen);
  if (state.yahuhSwitchboardOpen) requestAnimationFrame(() => $("yahuhSwitchboardHeading").focus({ preventScroll: true }));
};
$("yahuhSwitchboardClose").onclick = () => setYahuhSwitchboardOpen(false, { returnFocus: true });
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !state.yahuhSwitchboardOpen || !$("yahuh").classList.contains("on")) return;
  event.preventDefault();
  setYahuhSwitchboardOpen(false, { returnFocus: true });
});
$("yahuhMidpointAction").onclick = acknowledgeYahuhSingleStream;
$("yahuhEvidenceToggle").onclick = () => {
  const visibleState = state.yahuhDiagnosticMode ? state.yahuhDiagnosticState : state.yahuhState;
  if (!visibleState.secured) return;
  state.yahuhEvidenceReceiptOpen = !state.yahuhEvidenceReceiptOpen;
  renderYahuhCampaign(visibleState, { diagnosticMode: state.yahuhDiagnosticMode });
  if (state.yahuhEvidenceReceiptOpen) requestAnimationFrame(() => $("yahuhEvidenceReceipt").focus({ preventScroll: true }));
  else $("yahuhEvidenceToggle").focus({ preventScroll: true });
};
function syncViewTubeDrawer() {
  const open = state.viewtubeDrawerOpen && matchMedia("(max-width: 1279px)").matches;
  $("viewtubePage").dataset.secondaryDrawerOpen = String(open);
  $("viewtubeDrawerToggle").setAttribute("aria-expanded", String(open));
  $("viewtubeSecondaryDrawer").setAttribute("aria-hidden", String(!open));
  $("viewtubeSecondaryDrawer").inert = !open;
}
$("viewtubeDrawerToggle").onclick = () => {
  state.viewtubeDrawerOpen = !state.viewtubeDrawerOpen;
  syncViewTubeDrawer();
  if (state.viewtubeDrawerOpen) requestAnimationFrame(() => $("viewtubeDrawerHeading").focus({ preventScroll: true }));
};
$("viewtubeDrawerClose").onclick = () => {
  state.viewtubeDrawerOpen = false;
  syncViewTubeDrawer();
  $("viewtubeDrawerToggle").focus({ preventScroll: true });
};
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || state.activeScreen !== "viewtube" || !state.viewtubeDrawerOpen) return;
  event.preventDefault();
  state.viewtubeDrawerOpen = false;
  syncViewTubeDrawer();
  $("viewtubeDrawerToggle").focus({ preventScroll: true });
});
$("viewtubeMidpointAction").onclick = () => {
  const playtestMode = state.viewtubePlaytestMode;
  const visible = state.viewtubeDiagnosticMode ? state.viewtubeDiagnosticState : state.viewtubeState;
  const transition = state.viewtubeDiagnosticMode || playtestMode
    ? acknowledgeViewTubeMidpointState(visible, { acknowledgedAt: new Date().toISOString() })
    : acknowledgeViewTubeMidpoint(localStateStorage, { currentState: visible });
  if (!transition.ok) return;
  if (state.viewtubeDiagnosticMode) state.viewtubeDiagnosticState = transition.state;
  else {
    state.viewtubeState = transition.state;
    state.viewtubePersisted = playtestMode ? false : transition.ok;
  }
  renderViewTubeCampaign(transition.state, { diagnosticMode: state.viewtubeDiagnosticMode });
};
$("viewtubeEvidenceToggle").onclick = () => {
  const visible = state.viewtubeDiagnosticMode ? state.viewtubeDiagnosticState : state.viewtubeState;
  if (!visible.secured) return;
  state.viewtubeEvidenceReceiptOpen = !state.viewtubeEvidenceReceiptOpen;
  renderViewTubeCampaign(visible, { diagnosticMode: state.viewtubeDiagnosticMode });
  requestAnimationFrame(() => (state.viewtubeEvidenceReceiptOpen ? $("viewtubeEvidenceReceipt") : $("viewtubeEvidenceToggle")).focus({ preventScroll: true }));
};
function syncSearchishInspector() {
  const drawer = matchMedia("(max-width: 1279px)").matches;
  const open = drawer && state.searchishInspectorOpen;
  $("searchishPage").dataset.inspectorOpen = String(open);
  $("searchishInspectorToggle").setAttribute("aria-expanded", String(open));
  $("searchishInspector").setAttribute("aria-hidden", String(drawer && !open));
  $("searchishInspector").inert = drawer && !open;
}
$("searchishInspectorToggle").onclick = () => {
  state.searchishInspectorOpen = !state.searchishInspectorOpen;
  syncSearchishInspector();
  if (state.searchishInspectorOpen) requestAnimationFrame(() => $("searchishInspectorHeading").focus({ preventScroll: true }));
};
$("searchishInspectorClose").onclick = () => {
  state.searchishInspectorOpen = false;
  syncSearchishInspector();
  $("searchishInspectorToggle").focus({ preventScroll: true });
};
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || state.activeScreen !== "searchish" || !state.searchishInspectorOpen) return;
  event.preventDefault();
  state.searchishInspectorOpen = false;
  syncSearchishInspector();
  $("searchishInspectorToggle").focus({ preventScroll: true });
});
$("searchishMidpointAction").onclick = () => {
  const visible = state.searchishDiagnosticMode ? state.searchishDiagnosticState : state.searchishState;
  const transition = state.searchishDiagnosticMode || state.searchishPlaytestMode
    ? acknowledgeSearchishMidpointState(visible, { acknowledgedAt: new Date().toISOString() })
    : acknowledgeSearchishMidpoint(localStateStorage, { currentState: visible });
  if (!transition.ok) return;
  if (state.searchishDiagnosticMode) state.searchishDiagnosticState = transition.state;
  else {
    state.searchishState = transition.state;
    state.searchishPersisted = state.searchishPlaytestMode ? false : transition.ok;
  }
  state.searchishInspectorOpen = true;
  renderSearchishCampaign(transition.state, { diagnosticMode: state.searchishDiagnosticMode });
  syncSearchishInspector();
};
$("searchishEvidenceToggle").onclick = () => {
  const visible = state.searchishDiagnosticMode ? state.searchishDiagnosticState : state.searchishState;
  if (!visible.secured) return;
  state.searchishEvidenceReceiptOpen = !state.searchishEvidenceReceiptOpen;
  renderSearchishCampaign(visible, { diagnosticMode: state.searchishDiagnosticMode });
  requestAnimationFrame(() => (state.searchishEvidenceReceiptOpen ? $("searchishEvidenceReceipt") : $("searchishEvidenceToggle")).focus({ preventScroll: true }));
};
function syncAmazeOnReceipt(){const drawer=matchMedia("(max-width: 1279px)").matches;const open=drawer&&state.amazeonReceiptOpen;$("amazeonPage").dataset.receiptOpen=String(open);$("amazeonReceiptToggle").setAttribute("aria-expanded",String(open));$("amazeonReceiptDrawer").setAttribute("aria-hidden",String(drawer&&!open));$("amazeonReceiptDrawer").inert=drawer&&!open;}
$("amazeonReceiptToggle").onclick=()=>{state.amazeonReceiptOpen=!state.amazeonReceiptOpen;syncAmazeOnReceipt();if(state.amazeonReceiptOpen)requestAnimationFrame(()=>$("amazeonReceiptHeading").focus({preventScroll:true}));};
$("amazeonReceiptClose").onclick=()=>{state.amazeonReceiptOpen=false;syncAmazeOnReceipt();$("amazeonReceiptToggle").focus({preventScroll:true});};
document.addEventListener("keydown",event=>{if(event.key!=="Escape"||state.activeScreen!=="amazeon"||!state.amazeonReceiptOpen)return;event.preventDefault();state.amazeonReceiptOpen=false;syncAmazeOnReceipt();$("amazeonReceiptToggle").focus({preventScroll:true});});
$("amazeonMidpointAction").onclick=()=>{const visible=state.amazeonDiagnosticMode?state.amazeonDiagnosticState:state.amazeonState;const transition=state.amazeonDiagnosticMode?acknowledgeAmazeOnMidpointState(visible,{acknowledgedAt:new Date().toISOString()}):acknowledgeAmazeOnMidpoint(localStateStorage,{currentState:visible});if(!transition.ok)return;if(state.amazeonDiagnosticMode)state.amazeonDiagnosticState=transition.state;else state.amazeonState=transition.state;state.amazeonReceiptOpen=true;renderAmazeOnCampaign(transition.state,{diagnosticMode:state.amazeonDiagnosticMode});syncAmazeOnReceipt();};
$("amazeonEvidenceToggle").onclick=()=>{const visible=state.amazeonDiagnosticMode?state.amazeonDiagnosticState:state.amazeonState;if(!visible.secured)return;state.amazeonEvidenceReceiptOpen=!state.amazeonEvidenceReceiptOpen;renderAmazeOnCampaign(visible,{diagnosticMode:state.amazeonDiagnosticMode});requestAnimationFrame(()=>(state.amazeonEvidenceReceiptOpen?$("amazeonEvidenceReceipt"):$("amazeonEvidenceToggle")).focus({preventScroll:true}));};
function syncSpottyFiDetail(){const drawer=matchMedia("(max-width: 1279px)").matches,open=drawer&&state.spottyfiDetailOpen;$("spottyfiPage").dataset.detailOpen=String(open);$("spottyfiDetailToggle").setAttribute("aria-expanded",String(open));$("spottyfiDetailDrawer").setAttribute("aria-hidden",String(drawer&&!open));$("spottyfiDetailDrawer").inert=drawer&&!open}
$("spottyfiDetailToggle").onclick=()=>{state.spottyfiDetailOpen=!state.spottyfiDetailOpen;syncSpottyFiDetail();if(state.spottyfiDetailOpen)requestAnimationFrame(()=>$("spottyfiDetailHeading").focus({preventScroll:true}))};$("spottyfiDetailClose").onclick=()=>{state.spottyfiDetailOpen=false;syncSpottyFiDetail();$("spottyfiDetailToggle").focus({preventScroll:true})};document.addEventListener("keydown",event=>{if(event.key!=="Escape"||state.activeScreen!=="spottyfi"||!state.spottyfiDetailOpen)return;event.preventDefault();state.spottyfiDetailOpen=false;syncSpottyFiDetail();$("spottyfiDetailToggle").focus({preventScroll:true})});
$("spottyfiMidpointAction").onclick=()=>{const visible=state.spottyfiDiagnosticMode?state.spottyfiDiagnosticState:state.spottyfiState,t=state.spottyfiDiagnosticMode?acknowledgeSpottyFiMidpointState(visible,{acknowledgedAt:new Date().toISOString()}):acknowledgeSpottyFiMidpoint(localStateStorage,{currentState:visible});if(!t.ok)return;if(state.spottyfiDiagnosticMode)state.spottyfiDiagnosticState=t.state;else state.spottyfiState=t.state;state.spottyfiDetailOpen=true;renderSpottyFiCampaign(t.state,{diagnosticMode:state.spottyfiDiagnosticMode});syncSpottyFiDetail()};$("spottyfiEvidenceToggle").onclick=()=>{const visible=state.spottyfiDiagnosticMode?state.spottyfiDiagnosticState:state.spottyfiState;if(!visible.secured)return;state.spottyfiEvidenceReceiptOpen=!state.spottyfiEvidenceReceiptOpen;renderSpottyFiCampaign(visible,{diagnosticMode:state.spottyfiDiagnosticMode});requestAnimationFrame(()=>(state.spottyfiEvidenceReceiptOpen?$("spottyfiEvidenceReceipt"):$("spottyfiEvidenceToggle")).focus({preventScroll:true}))};
$("mapguessInspectorToggle").onclick = () => {
  setMapGuessInspectorDrawerOpen(!state.mapguessInspectorOpen);
  if (state.mapguessInspectorOpen) requestAnimationFrame(() => $("mapguessInspectorHeading").focus({ preventScroll: true }));
};
$("mapguessInspectorClose").onclick = () => {
  setMapGuessInspectorDrawerOpen(false);
  $("mapguessInspectorToggle").focus({ preventScroll: true });
};
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || state.activeScreen !== "mapguess" || !state.mapguessInspectorOpen) return;
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
  if (state.activeScreen === "mycorner") syncMyCornerInspector();
  if (state.activeScreen === "yahuh") syncYahuhSwitchboard();
  if (state.activeScreen === "viewtube") syncViewTubeDrawer();
  if (state.activeScreen === "searchish") syncSearchishInspector();
  if (state.activeScreen === "amazeon") syncAmazeOnReceipt();
  if(state.activeScreen==="spottyfi")syncSpottyFiDetail();
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
  if (state.selectedSiteId === "mycorner") {
    openMyCornerExperience();
    return;
  }
  if (state.selectedSiteId === "yahuh") {
    openYahuhExperience();
    return;
  }
  if (state.selectedSiteId === "viewtube") {
    openViewTubeExperience();
    return;
  }
  if (state.selectedSiteId === "searchish") {
    openSearchishExperience();
    return;
  }
  if(state.selectedSiteId==="amazeon"){openAmazeOnExperience();return;}
  if(state.selectedSiteId==="spottyfi"){openSpottyFiExperience();return;}
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
      const facePlaceEvidenceSaved = state.faceplaceState.secured && state.faceplacePersisted;
      const mapGuessEvidenceSaved = state.mapguessState.secured && state.mapguessPersisted;
      const myCornerEvidenceSaved = state.mycornerState.secured && state.mycornerPersisted;
      const yahuhEvidenceSaved = state.yahuhState.secured && state.yahuhPersisted;
      const viewTubeEvidenceSaved = state.viewtubeState.secured && state.viewtubePersisted;
      const searchishEvidenceSaved = state.searchishState.secured && state.searchishPersisted;
      const amazeonEvidenceSaved = state.amazeonState.secured && state.amazeonPersisted;
      const spottyfiEvidenceSaved=state.spottyfiState.secured&&state.spottyfiPersisted;
      if(spottyfiEvidenceSaved&&state.selectedSiteId==="spottyfi"){state.spottyfiDiagnosticMode=false;state.spottyfiEvidenceReceiptOpen=true;openSpottyFiExperience();requestAnimationFrame(()=>$("spottyfiEvidenceReceipt").focus({preventScroll:true}));
      } else if (amazeonEvidenceSaved && state.selectedSiteId === "amazeon") {
        state.amazeonDiagnosticMode = false;
        state.amazeonEvidenceReceiptOpen = true;
        openAmazeOnExperience();
        requestAnimationFrame(() => $("amazeonEvidenceReceipt").focus({ preventScroll: true }));
      } else if (searchishEvidenceSaved && state.selectedSiteId === "searchish") {
        state.searchishDiagnosticMode = false;
        state.searchishEvidenceReceiptOpen = true;
        openSearchishExperience();
        requestAnimationFrame(() => $("searchishEvidenceReceipt").focus({ preventScroll: true }));
      } else if (viewTubeEvidenceSaved && state.selectedSiteId === "viewtube") {
        state.viewtubeDiagnosticMode = false;
        state.viewtubeEvidenceReceiptOpen = true;
        openViewTubeExperience();
        requestAnimationFrame(() => $("viewtubeEvidenceReceipt").focus({ preventScroll: true }));
      } else if (yahuhEvidenceSaved && state.selectedSiteId === "yahuh") {
        state.yahuhDiagnosticMode = false;
        state.yahuhEvidenceReceiptOpen = true;
        state.yahuhSwitchboardOpen = true;
        openYahuhExperience();
        setYahuhSwitchboardOpen(true);
        requestAnimationFrame(() => $("yahuhEvidenceReceipt").focus({ preventScroll: true }));
      } else if (myCornerEvidenceSaved && state.selectedSiteId === "mycorner") {
        state.mycornerDiagnosticMode = false;
        state.mycornerEvidenceReceiptOpen = true;
        openMyCornerExperience();
        requestAnimationFrame(() => $("mycornerEvidenceReceipt").focus({ preventScroll: true }));
      } else if (mapGuessEvidenceSaved && state.selectedSiteId === "mapguess") {
        state.mapguessDiagnosticMode = false;
        state.mapguessEvidenceReceiptOpen = true;
        openMapGuessExperience();
        requestAnimationFrame(() => $("mapguessEvidenceReceipt").focus({ preventScroll: true }));
      } else if (facePlaceEvidenceSaved && state.selectedSiteId === "faceplace") {
        state.faceplaceDiagnosticMode = false;
        state.faceplaceEvidenceReceiptOpen = true;
        openFacePlaceExperience();
        requestAnimationFrame(() => $("faceplaceEvidenceReceipt").focus({ preventScroll: true }));
      } else if (threadItEvidenceSaved && (state.selectedSiteId === "threadit" || state.campaignState.phase !== "secured")) {
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
  state.mycornerState = readMyCornerState(null);
  state.mycornerPersisted = true;
  state.yahuhState = readYahuhState(null);
  state.yahuhPersisted = true;
  state.viewtubeState = readViewTubeState(null);
  state.viewtubePersisted = true;
  state.searchishState = readSearchishState(null);
  state.searchishPersisted = true;
  state.amazeonState = readAmazeOnState(null);
  state.amazeonPersisted = true;
  state.spottyfiState=readSpottyFiState(null);state.spottyfiPersisted=true;
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
} else if (requestedLaunch === "mycorner") {
  openRecoverySite("mycorner");
} else if (requestedLaunch === "yahuh") {
  openRecoverySite("yahuh");
} else if (requestedLaunch === "viewtube") {
  openRecoverySite("viewtube");
} else if (requestedLaunch === "searchish") {
  openRecoverySite("searchish");
} else if (requestedLaunch === "amazeon") {
  openRecoverySite("amazeon");
} else if(requestedLaunch==="spottyfi"){
  openRecoverySite("spottyfi");
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
  "mycorner",
  "mycorner-corrupted",
  "mycorner-restore-1",
  "mycorner-restore-2",
  "mycorner-restore-3",
  "mycorner-restore-4",
  "mycorner-template-reveal",
  "mycorner-template-saved",
  "mycorner-template-inspector",
  "mycorner-template-acknowledged",
  "mycorner-owner-lock-1",
  "mycorner-owner-lock-2",
  "mycorner-secured",
  "mycorner-evidence",
].includes(uiPreview)) {
  const unitCount = {
    "mycorner-evidence": 7,
    "mycorner-secured": 7,
    "mycorner-owner-lock-2": 6,
    "mycorner-owner-lock-1": 5,
    "mycorner-template-acknowledged": 4,
    "mycorner-template-inspector": 4,
    "mycorner-template-saved": 4,
    "mycorner-template-reveal": 4,
    "mycorner-restore-4": 4,
    "mycorner-restore-3": 3,
    "mycorner-restore-2": 2,
    "mycorner-restore-1": 1,
  }[uiPreview] ?? 0;
  state.mycornerDiagnosticMode = uiPreview !== "mycorner";
  state.mycornerDiagnosticState = buildMyCornerPreviewState(unitCount);
  if (uiPreview === "mycorner-template-acknowledged") {
    state.mycornerDiagnosticState = acknowledgeMyCornerMidpointState(state.mycornerDiagnosticState, {
      acknowledgedAt: "2026-07-12T00:00:04.500Z",
    }).state;
  }
  state.mycornerComparisonView = uiPreview === "mycorner-template-saved" ? "saved" : "template";
  state.mycornerEvidenceReceiptOpen = uiPreview === "mycorner-evidence";
  state.mycornerInspectorOpen = uiPreview === "mycorner-template-inspector";
  openMyCornerExperience();
  if (uiPreview === "mycorner-template-inspector") setMyCornerInspectorOpen(true);
  if (uiPreview === "mycorner-evidence") {
    requestAnimationFrame(() => $("mycornerEvidenceReceipt").scrollIntoView({ block: "nearest" }));
  }
} else if ([
  "yahuh",
  "yahuh-corrupted",
  "yahuh-sort-1",
  "yahuh-sort-2",
  "yahuh-sort-3",
  "yahuh-single-stream",
  "yahuh-single-stream-acknowledged",
  "yahuh-switchboard",
  "yahuh-reconnect-1",
  "yahuh-reconnect-2",
  "yahuh-secured",
  "yahuh-evidence",
].includes(uiPreview)) {
  const unitCount = {
    "yahuh-evidence": 6,
    "yahuh-secured": 6,
    "yahuh-reconnect-2": 5,
    "yahuh-reconnect-1": 4,
    "yahuh-switchboard": 3,
    "yahuh-single-stream-acknowledged": 3,
    "yahuh-single-stream": 3,
    "yahuh-sort-3": 3,
    "yahuh-sort-2": 2,
    "yahuh-sort-1": 1,
  }[uiPreview] ?? 0;
  state.yahuhDiagnosticMode = uiPreview !== "yahuh";
  state.yahuhDiagnosticState = buildYahuhPreviewState(unitCount);
  if (["yahuh-single-stream-acknowledged", "yahuh-switchboard"].includes(uiPreview)) {
    state.yahuhDiagnosticState = acknowledgeYahuhMidpointState(state.yahuhDiagnosticState, {
      acknowledgedAt: "2026-07-12T00:00:03.500Z",
    }).state;
  }
  state.yahuhEvidenceReceiptOpen = uiPreview === "yahuh-evidence";
  state.yahuhSwitchboardOpen = ["yahuh-switchboard", "yahuh-evidence"].includes(uiPreview);
  openYahuhExperience();
  if (state.yahuhSwitchboardOpen) setYahuhSwitchboardOpen(true);
  if (uiPreview === "yahuh-evidence") {
    requestAnimationFrame(() => $("yahuhEvidenceReceipt").scrollIntoView({ block: "nearest" }));
  }
} else if ([
  "viewtube",
  "viewtube-corrupted",
  "viewtube-restore-1",
  "viewtube-restore-2",
  "viewtube-restore-3",
  "viewtube-restore-4",
  "viewtube-autoplay-loop",
  "viewtube-acknowledged",
  "viewtube-track-1",
  "viewtube-track-2",
  "viewtube-secured",
  "viewtube-evidence",
].includes(uiPreview)) {
  const unitCount = {
    "viewtube-evidence": 7,
    "viewtube-secured": 7,
    "viewtube-track-2": 6,
    "viewtube-track-1": 5,
    "viewtube-acknowledged": 4,
    "viewtube-autoplay-loop": 4,
    "viewtube-restore-4": 4,
    "viewtube-restore-3": 3,
    "viewtube-restore-2": 2,
    "viewtube-restore-1": 1,
  }[uiPreview] ?? 0;
  state.viewtubeDiagnosticMode = uiPreview !== "viewtube";
  state.viewtubeDiagnosticState = buildViewTubePreviewState(unitCount);
  if (uiPreview === "viewtube-acknowledged") {
    state.viewtubeDiagnosticState = acknowledgeViewTubeMidpointState(state.viewtubeDiagnosticState, {
      acknowledgedAt: "2026-07-12T00:00:04.500Z",
    }).state;
  }
  state.viewtubeEvidenceReceiptOpen = uiPreview === "viewtube-evidence";
  openViewTubeExperience();
  syncViewTubeDrawer();
  if (uiPreview === "viewtube-evidence") requestAnimationFrame(() => $("viewtubeEvidenceReceipt").scrollIntoView({ block: "nearest" }));
} else if ([
  "searchish",
  "searchish-corrupted",
  "searchish-origin-1",
  "searchish-origin-2",
  "searchish-origin-3",
  "searchish-origin-4",
  "searchish-five-costumes",
  "searchish-acknowledged",
  "searchish-primary-branch",
  "searchish-independent-branch",
  "searchish-secured",
  "searchish-evidence",
].includes(uiPreview)) {
  const unitCount = {
    "searchish-evidence": 7,
    "searchish-secured": 7,
    "searchish-independent-branch": 6,
    "searchish-primary-branch": 5,
    "searchish-acknowledged": 4,
    "searchish-five-costumes": 4,
    "searchish-origin-4": 4,
    "searchish-origin-3": 3,
    "searchish-origin-2": 2,
    "searchish-origin-1": 1,
  }[uiPreview] ?? 0;
  state.searchishDiagnosticMode = uiPreview !== "searchish";
  state.searchishDiagnosticState = buildSearchishPreviewState(unitCount);
  if (uiPreview === "searchish-acknowledged") state.searchishDiagnosticState = acknowledgeSearchishMidpointState(state.searchishDiagnosticState, { acknowledgedAt: "2026-07-12T00:00:04.500Z" }).state;
  state.searchishInspectorOpen = ["searchish-acknowledged", "searchish-primary-branch", "searchish-independent-branch", "searchish-secured", "searchish-evidence"].includes(uiPreview);
  state.searchishEvidenceReceiptOpen = uiPreview === "searchish-evidence";
  openSearchishExperience();
  if (uiPreview === "searchish-evidence") requestAnimationFrame(() => $("searchishEvidenceReceipt").scrollIntoView({ block: "nearest" }));
} else if (["amazeon","amazeon-corrupted","amazeon-sort-1","amazeon-sort-2","amazeon-sort-3","amazeon-sort-4","amazeon-negative-purchasing","amazeon-acknowledged","amazeon-receipt-1","amazeon-receipt-2","amazeon-secured","amazeon-evidence"].includes(uiPreview)) {
  const unitCount={"amazeon-evidence":7,"amazeon-secured":7,"amazeon-receipt-2":6,"amazeon-receipt-1":5,"amazeon-acknowledged":4,"amazeon-negative-purchasing":4,"amazeon-sort-4":4,"amazeon-sort-3":3,"amazeon-sort-2":2,"amazeon-sort-1":1}[uiPreview]??0;
  state.amazeonDiagnosticMode=uiPreview!=="amazeon";state.amazeonDiagnosticState=buildAmazeOnPreviewState(unitCount);if(uiPreview==="amazeon-acknowledged")state.amazeonDiagnosticState=acknowledgeAmazeOnMidpointState(state.amazeonDiagnosticState,{acknowledgedAt:"2026-07-12T00:00:04.500Z"}).state;state.amazeonReceiptOpen=["amazeon-acknowledged","amazeon-receipt-1","amazeon-receipt-2","amazeon-secured","amazeon-evidence"].includes(uiPreview);state.amazeonEvidenceReceiptOpen=uiPreview==="amazeon-evidence";openAmazeOnExperience();if(uiPreview==="amazeon-evidence")requestAnimationFrame(()=>$("amazeonEvidenceReceipt").scrollIntoView({block:"nearest"}));
} else if(["spottyfi","spottyfi-corrupted","spottyfi-unit-1","spottyfi-unit-2","spottyfi-unit-3","spottyfi-unit-4","spottyfi-unit-5","spottyfi-predicted-history","spottyfi-acknowledged","spottyfi-control-1","spottyfi-control-2","spottyfi-secured","spottyfi-evidence"].includes(uiPreview)){
  const unitCount={"spottyfi-evidence":8,"spottyfi-secured":8,"spottyfi-control-2":7,"spottyfi-control-1":6,"spottyfi-acknowledged":5,"spottyfi-predicted-history":5,"spottyfi-unit-5":5,"spottyfi-unit-4":4,"spottyfi-unit-3":3,"spottyfi-unit-2":2,"spottyfi-unit-1":1}[uiPreview]??0;state.spottyfiDiagnosticMode=uiPreview!=="spottyfi";state.spottyfiDiagnosticState=buildSpottyFiPreviewState(unitCount);if(uiPreview==="spottyfi-acknowledged")state.spottyfiDiagnosticState=acknowledgeSpottyFiMidpointState(state.spottyfiDiagnosticState,{acknowledgedAt:"2026-07-12T00:00:05.500Z"}).state;state.spottyfiDetailOpen=["spottyfi-acknowledged","spottyfi-control-1","spottyfi-control-2","spottyfi-secured","spottyfi-evidence"].includes(uiPreview);state.spottyfiEvidenceReceiptOpen=uiPreview==="spottyfi-evidence";openSpottyFiExperience();if(uiPreview==="spottyfi-evidence")requestAnimationFrame(()=>$("spottyfiEvidenceReceipt").scrollIntoView({block:"nearest"}));
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
} else if (["endgame-arrival", "endgame-containment", "endgame-checkpoint-1", "endgame-revocation", "endgame-restored"].includes(uiPreview)) {
  const previewValues = new Map();
  const previewStorage = {
    getItem: (key) => previewValues.get(key) ?? null,
    removeItem: (key) => previewValues.delete(key),
    setItem: (key, value) => previewValues.set(key, String(value)),
  };
  state.endgameState = discoverEndgameEvidence(state.endgameState, { canonicalComplete: true });
  if (uiPreview !== "endgame-arrival") state.endgameState = beginEndgameContainment(state.endgameState, { storage: previewStorage }).state;
  const previewCheckpointCount = { "endgame-checkpoint-1": 1, "endgame-revocation": 3, "endgame-restored": 3 }[uiPreview] ?? 0;
  for (const checkpointId of ENDGAME_CHECKPOINT_IDS.slice(0, previewCheckpointCount)) {
    state.endgameState = acceptEndgameCheckpoint(state.endgameState, checkpointId, { storage: previewStorage }).state;
  }
  if (uiPreview === "endgame-restored") state.endgameState = confirmEndgameRevocation(state.endgameState, { storage: previewStorage }).state;
  renderEndgame();
  show("endgame");
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
