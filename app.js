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
  for (const id of ["hub", "sitePreview", "threadit", "setup", "read", "review"]) $(id).classList.toggle("on", id === name);
  state.activeScreen = name;
  const selectedSite = getRecoverySite(state.selectedSiteId);
  const wikiWhyScreen = ["setup", "read", "review"].includes(name);
  const threadItScreen = name === "threadit";
  const activeSiteScreen = name === "sitePreview" || wikiWhyScreen || threadItScreen;
  $("desktopContext").textContent = name === "hub"
    ? "RECOVERY MAP"
    : name === "sitePreview"
      ? `${selectedSite.name.toUpperCase()} PREVIEW`
      : threadItScreen
        ? "THREADIT SOURCE TRACE"
        : "WIKIWHY REPAIR";
  $("taskHub").classList.toggle("active", name === "hub");
  $("taskSite").classList.toggle("active", activeSiteScreen);
  $("taskReader").classList.toggle("active", name === "read" || name === "review" || threadItScreen);
  const visibleCampaignState = state.diagnosticMode && state.diagnosticState ? state.diagnosticState : state.campaignState;
  const securedWikiWhyTask = wikiWhyScreen && visibleCampaignState.phase === "secured";
  const visibleThreadItState = state.threaditDiagnosticMode ? state.threaditDiagnosticState : state.threaditState;
  const securedThreadItTask = threadItScreen && visibleThreadItState.secured;
  const securedSiteTask = securedWikiWhyTask || securedThreadItTask;
  $("taskSite").classList.toggle("secured", securedSiteTask);
  if (securedWikiWhyTask) {
    $("taskSite").innerHTML = `<img src="${WIKIWHY_SECURED_SEAL_URL}" alt=""> <span>WikiWhy · SECURED</span>`;
  } else if (securedThreadItTask) {
    $("taskSite").innerHTML = `<img src="${THREADIT_ASSETS[THREADIT_ASSET_IDS.sourceStableBadge]}" alt=""> <span>ThreadIt · SECURED</span>`;
  } else {
    $("taskSite").textContent = name === "hub" ? "□ No site open" : `□ ${wikiWhyScreen ? "WikiWhy" : selectedSite.name}`;
  }
  $("taskSite").setAttribute("aria-label", securedWikiWhyTask
    ? "WikiWhy secured"
    : securedThreadItTask
      ? "ThreadIt secured"
      : $("taskSite").textContent);
  document.querySelectorAll(".desktop-shortcut").forEach((button) => button.classList.toggle("active", button.dataset.action === "hub" && name === "hub"));
  if (screenChanged) requestAnimationFrame(() => $(name).focus({ preventScroll: true }));
}

function renderRecoveryHub() {
  const realWikiWhy = state.campaignState;
  const diagnosticWikiWhy = state.diagnosticMode ? state.diagnosticState : null;
  const diagnosticView = diagnosticWikiWhy ? campaignView(diagnosticWikiWhy) : null;
  const diagnosticSecured = diagnosticWikiWhy?.phase === "secured";
  const realSecured = realWikiWhy.phase === "secured" && realWikiWhy.evidenceId === WIKIWHY_EVIDENCE_RECORD.id;
  const wikiWhySecured = diagnosticSecured || realSecured;
  const durableWikiWhySecured = diagnosticSecured || (realSecured && state.campaignPersisted);
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
  const realThreadIt = state.threaditState;
  const diagnosticThreadIt = state.threaditDiagnosticMode ? state.threaditDiagnosticState : null;
  const visibleThreadIt = diagnosticThreadIt ?? realThreadIt;
  const threadItView = getThreadItCampaignView(visibleThreadIt);
  const diagnosticThreadItSecured = Boolean(diagnosticThreadIt?.secured);
  const realThreadItSecured = realThreadIt.secured && realThreadIt.evidenceId === THREADIT_EVIDENCE_ID;
  const threadItSecured = diagnosticThreadItSecured || realThreadItSecured;
  const durableThreadItSecured = diagnosticThreadItSecured || (realThreadItSecured && state.threaditPersisted);
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
  const incomingIds = getIncomingSiteIds({ threadItSecured, wikiWhySecured });
  const securedCount = Number(durableWikiWhySecured) + Number(durableThreadItSecured);
  $("securedSiteCount").textContent = String(securedCount);
  $("evidenceCount").textContent = `${securedCount}/10`;
  $("siteGrid").innerHTML = RECOVERY_SITES.map((site) => {
    const siteSecured = (site.id === "wikiwhy" && wikiWhySecured)
      || (site.id === "threadit" && threadItSecured);
    const siteStatus = site.id === "wikiwhy"
      ? wikiWhyStatus
      : site.id === "threadit"
        ? threadItStatus
        : "DESIGN PREVIEW";
    const securedIcon = site.id === "wikiwhy"
      ? WIKIWHY_SECURED_SEAL_URL
      : THREADIT_ASSETS[THREADIT_ASSET_IDS.sourceStableBadge];
    return `
    <button class="site-card" type="button" data-site-id="${site.id}" data-playable="${site.playable}" data-runtime="${Boolean(site.runtimeAvailable)}" data-secured="${siteSecured}" aria-label="${site.name}, ${siteSecured ? "secured" : siteStatus.toLowerCase()}" style="--site-accent:${site.accent}">
      <img src="${site.previewImage}" alt="">
      <span aria-hidden="true">${siteSecured ? `<img src="${securedIcon}" alt="">` : site.mark}</span>
      <div><b>${site.name}</b><small>${siteSecured ? `✓ ${siteStatus}` : siteStatus}</small></div>
    </button>
  `;
  }).join("");
  $("incomingCases").innerHTML = incomingIds.map((siteId) => {
    const site = getRecoverySite(siteId);
    const status = site.id === "wikiwhy" ? wikiWhyStatus : site.id === "threadit" ? threadItStatus : "DESIGN PREVIEW";
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
    return `<li>${site.name} — awaiting evidence</li>`;
  }).join("");
  const support = $("amySupportMessage");
  if (state.threaditDiagnosticMode) {
    support.innerHTML = diagnosticThreadItSecured
      ? "<b>ThreadIt secured in TEST mode.</b> Case File slot 2 shows the synthetic-consensus receipt. No reading score or real campaign save was created."
      : `<b>ThreadIt structural test.</b> ${threadItStatus}. Its candidate passage remains unavailable, so every advance is clearly simulated.`;
  } else if (!state.diagnosticMode) {
    if (realThreadItSecured && state.threaditPersisted && realSecured && state.campaignPersisted) support.innerHTML = "<b>WikiWhy and ThreadIt secured.</b> Two evidence files are in Finn’s Files. FacePlace, Spotty-Fi, and Search-ish remain honest design previews.";
    else if (realThreadItSecured && state.threaditPersisted) support.innerHTML = "<b>ThreadIt secured.</b> Its synthetic-consensus evidence is in Finn’s Files. The candidate passage gate remains closed for new scored readings.";
    else if (realThreadItSecured) support.innerHTML = "<b>ThreadIt is secured in this tab.</b> This browser did not save the evidence for reload.";
    else if (realSecured && state.campaignPersisted) support.innerHTML = "<b>WikiWhy secured.</b> Its evidence file is in Finn’s Files. ThreadIt has a complete structural campaign test; its candidate passage remains under review.";
    else if (realSecured) support.innerHTML = "<b>WikiWhy is secured in this tab.</b> This browser did not save the evidence for reload, so Finn’s Files remains unavailable.";
    else if (realWikiWhy.phase === "shield") support.innerHTML = `<b>Shield Protocol active.</b> ${3 - realWikiWhy.shieldPass} clean repair${3 - realWikiWhy.shieldPass === 1 ? "" : "s"} remain. Reviewed passages are loaded one at a time.`;
    else if (realWikiWhy.phase === "reverse-hack" && state.campaignPersisted) support.innerHTML = "<b>Background write caught.</b> Finn’s readings are saved. Open WikiWhy to start the three-pass Shield Protocol.";
    else if (realWikiWhy.phase === "reverse-hack") support.innerHTML = "<b>Background write caught in this tab.</b> The browser did not save this state for reload. Open WikiWhy to continue without losing the current tab.";
    else support.innerHTML = "<b>System healthy.</b> WikiWhy is connected. ThreadIt’s semantic Act I test is available with MIC: OFF until its passage clears review.";
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
    showCharacterDialog("site-secured-amy", () => showCharacterDialog("site-secured", returnToHub));
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
    showCharacterDialog("site-secured-amy", () => showCharacterDialog("site-secured", returnToHub));
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
    showCharacterDialog("site-secured-amy", () => showCharacterDialog("site-secured"));
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
window.addEventListener("resize", () => {
  if (state.activeScreen === "threadit") scheduleThreadItConnectors(threadItConnectorRelationships);
});
$("taskStart").onclick = returnToHub;
$("taskHub").onclick = returnToHub;
$("taskSite").onclick = () => openRecoverySite(state.selectedSiteId);
$("taskReader").onclick = () => {
  if (state.selectedSiteId === "threadit") {
    openThreadItExperience();
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
