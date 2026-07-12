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
import { calculateWikiWhyReadingOutcome } from "./apps/internet-recovery/wikiwhy-rules.js";
import {
  advanceWikiWhyDiagnostic,
  beginWikiWhyShieldProtocol,
  readWikiWhyDiagnosticState,
  resetWikiWhyDiagnosticState,
  saveWikiWhyDiagnosticState,
} from "./apps/internet-recovery/wikiwhy-diagnostics.js";
import {
  WIKIWHY_DIALOGUES,
  isWikiWhyDialogDismissible,
} from "./apps/internet-recovery/wikiwhy-dialogues.js";
import { getRecoverySite, INCOMING_SITE_IDS, RECOVERY_SITES } from "./apps/internet-recovery/site-catalog.js";
import { selectNextWikiWhyPassage } from "./apps/internet-recovery/wikiwhy-content.js";

let activePassage = PHOTOSYNTHESIS_PASSAGE;
let PARAGRAPHS = activePassage.paragraphs;
let PASSAGE = PARAGRAPHS.join(" ");
let PROFILE = activePassage.profile;
const MODEL_ID = "onnx-community/whisper-base_timestamped";
const SPEECH_LEVEL = 0.009;
const TECHNO_PROGRESS_LOOP_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-progress-push-loop.webp", import.meta.url).href;
const TECHNO_PROGRESS_STILL_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-progress-push-still.webp", import.meta.url).href;
const TECHNO_ALERT_BALL_PIN_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-alert-ball-pin.webp", import.meta.url).href;
const TECHNO_CELEBRATE_SPIN_URL = new URL("./apps/internet-recovery/art/characters/techno/techno-celebrate-spin.webp", import.meta.url).href;
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
  activeScreen: "hub", selectedSiteId: "wikiwhy", preparing: false,
  campaignEligible: true, campaignState: readWikiWhyState(localStateStorage),
  campaignPersisted: Boolean(localStateStorage), contentAvailabilityReason: null,
  contentCandidateCount: 0, resultApplied: false,
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

function openWikiWhyExperience() {
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
  for (const id of ["hub", "sitePreview", "setup", "read", "review"]) $(id).classList.toggle("on", id === name);
  state.activeScreen = name;
  const selectedSite = getRecoverySite(state.selectedSiteId);
  const wikiWhyScreen = ["setup", "read", "review"].includes(name);
  $("desktopContext").textContent = name === "hub"
    ? "RECOVERY MAP"
    : name === "sitePreview"
      ? `${selectedSite.name.toUpperCase()} PREVIEW`
      : "WIKIWHY REPAIR";
  $("taskHub").classList.toggle("active", name === "hub");
  $("taskSite").classList.toggle("active", name === "sitePreview" || wikiWhyScreen);
  $("taskReader").classList.toggle("active", name === "read" || name === "review");
  $("taskSite").textContent = name === "hub" ? "□ No site open" : `□ ${wikiWhyScreen ? "WikiWhy" : selectedSite.name}`;
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
  const incomingIds = wikiWhySecured ? ["threadit", "mapguess", "viewtube"] : INCOMING_SITE_IDS;
  $("securedSiteCount").textContent = durableWikiWhySecured ? "1" : "0";
  $("evidenceCount").textContent = durableWikiWhySecured ? "1/10" : "0/10";
  $("siteGrid").innerHTML = RECOVERY_SITES.map((site) => `
    <button class="site-card" type="button" data-site-id="${site.id}" data-playable="${site.playable}" style="--site-accent:${site.accent}">
      <img src="${site.previewImage}" alt="">
      <span aria-hidden="true">${site.mark}</span>
      <div><b>${site.name}</b><small>${site.id === "wikiwhy" ? wikiWhyStatus : "DESIGN PREVIEW"}</small></div>
    </button>
  `).join("");
  $("incomingCases").innerHTML = incomingIds.map((siteId) => {
    const site = getRecoverySite(siteId);
    return `<button class="incoming-case" type="button" data-site-id="${site.id}" style="--site-accent:${site.accent}"><span>${site.mark}</span><div><b>${site.name}</b><small>${site.id === "wikiwhy" ? wikiWhyStatus : "Design file received"}</small></div></button>`;
  }).join("");
  $("evidenceSlots").innerHTML = RECOVERY_SITES.map((site) => {
    if (site.id !== "wikiwhy" || !wikiWhySecured) return `<li>${site.name} — awaiting evidence</li>`;
    return `<li>${diagnosticSecured ? "WikiWhy — autonomous write log saved (TEST)" : `${WIKIWHY_EVIDENCE_RECORD.title}${state.campaignPersisted ? "" : " · TAB ONLY"}`}</li>`;
  }).join("");
  if (!state.diagnosticMode) {
    const support = $("amySupportMessage");
    if (realSecured && state.campaignPersisted) support.innerHTML = "<b>WikiWhy secured.</b> Its evidence file is in Finn’s Files. ThreadIt, MapGuess, and ViewTube remain honest design previews.";
    else if (realSecured) support.innerHTML = "<b>WikiWhy is secured in this tab.</b> This browser did not save the evidence for reload, so Finn’s Files remains unavailable.";
    else if (realWikiWhy.phase === "shield") support.innerHTML = `<b>Shield Protocol active.</b> ${3 - realWikiWhy.shieldPass} clean repair${3 - realWikiWhy.shieldPass === 1 ? "" : "s"} remain. Reviewed passages are loaded one at a time.`;
    else if (realWikiWhy.phase === "reverse-hack" && state.campaignPersisted) support.innerHTML = "<b>Background write caught.</b> Finn’s readings are saved. Open WikiWhy to start the three-pass Shield Protocol.";
    else if (realWikiWhy.phase === "reverse-hack") support.innerHTML = "<b>Background write caught in this tab.</b> The browser did not save this state for reload. Open WikiWhy to continue without losing the current tab.";
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
  if (site.playable) {
    openWikiWhyExperience();
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
  if (phase === "secured") return { label: "SITE SECURED", percent: 100, status: "STATUS: SECURED" };
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
    status: stability >= 70 ? "STATUS: VERIFYING CHANGES" : stability > 0 ? "STATUS: RECOVERING" : "STATUS: CORRUPTED",
  };
}

function renderWikiWhyCampaignOverlay(campaignState) {
  const phase = campaignState.phase ?? "act-one";
  const overlay = $("wikiwhyCampaignOverlay");
  const technoState = $("campaignTechnoState");
  overlay.hidden = phase === "act-one";
  $("technoRepairSprite").hidden = phase === "reverse-hack" || phase === "secured";
  if (phase === "act-one") return;
  const checklist = $("shieldChecklist");
  const evidence = $("wikiwhyEvidenceReceipt");
  checklist.hidden = phase === "reverse-hack";
  evidence.hidden = phase !== "secured";
  technoState.hidden = phase === "shield";
  if (phase === "reverse-hack") {
    technoState.src = TECHNO_ALERT_BALL_PIN_URL;
    technoState.alt = "Techno pins her orange-and-blue ball while watching the unexpected automated write.";
  } else if (phase === "secured") {
    technoState.src = TECHNO_CELEBRATE_SPIN_URL;
    technoState.alt = "Techno spins beneath her orange-and-blue ball while the access-denied log stays visible.";
  }
  const shieldLabels = ["Recover content layer", "Verify citations and history", "Seal edit permissions"];
  checklist.querySelectorAll("li").forEach((item, index) => {
    const complete = phase === "secured" || index < campaignState.shieldPass;
    item.classList.toggle("complete", complete);
    item.textContent = `${complete ? "Complete" : "Pending"} — ${shieldLabels[index]}`;
  });
  if (phase === "reverse-hack") {
    $("campaignOverlayEyebrow").textContent = state.campaignPersisted
      ? "READINGS SAVED · EVIDENCE SAVED"
      : "PRESERVED IN THIS TAB · NOT SAVED FOR RELOAD";
    $("campaignOverlayHeading").textContent = "AUTOMATIC VERIFICATION CONTINUES";
    $("campaignOverlayBody").textContent = "Writer: wiki_auto_fix_ai · Service: ai_repair_service · Command: ended · Write status: active";
  } else if (phase === "shield") {
    $("campaignOverlayEyebrow").textContent = `SHIELD PROTOCOL · ${campaignState.shieldPass} OF 3`;
    $("campaignOverlayHeading").textContent = "Hold the write path. Seal each layer.";
    $("campaignOverlayBody").textContent = `${3 - campaignState.shieldPass} accepted reading${3 - campaignState.shieldPass === 1 ? "" : "s"} remain. No hidden fourth pass.`;
  } else {
    $("campaignOverlayEyebrow").textContent = "WIKIWHY SECURED";
    $("campaignOverlayHeading").textContent = "Unauthorized AI write blocked.";
    $("campaignOverlayBody").textContent = "Contributions stay open. Evidence checks stay required.";
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
  repairStage.classList.toggle("live-corruption", phase === "reverse-hack");
  repairStage.classList.toggle("shield-mode", phase === "shield");
  repairStage.classList.toggle("site-secured", phase === "secured");
  repairStage.setAttribute("aria-label", phase === "secured"
    ? "WikiWhy secured. Techno celebrates beside the access-denied log."
    : phase === "reverse-hack"
      ? "A right-to-left automated rewrite appears over the saved WikiWhy repair."
      : phase === "shield"
        ? `WikiWhy Shield Protocol ${campaignState.shieldPass} of 3.`
        : "WikiWhy page repairing from corrupted to evidence-based as confirmed reading progress advances.");
  renderWikiWhyCampaignOverlay(campaignState);
  $("siteStatus").textContent = view.status;
  $("siteStatus").style.color = phase === "reverse-hack" ? "#a6231d" : phase === "secured" ? "#246b3c" : "#173968";
  $("repairFill").style.width = `${view.percent}%`;
  $("repairEdge").style.left = `${view.percent}%`;
  positionTechnoAtRepair(view.percent, { animate: diagnosticMode });
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

function renderSavedRepair(savedState, { persisted = state.campaignPersisted } = {}) {
  if (savedState.repairCount < 1) return;
  $("recoveredFilesShortcut").disabled = !persisted;
  $("recoveredFilesCount").textContent = persisted
    ? `${savedState.repairCount} repair${savedState.repairCount === 1 ? "" : "s"} saved`
    : "Tab only · not saved";
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
  $("repairFill").style.width = `${projected}%`;
  $("repairEdge").style.left = `${projected}%`;
  positionTechnoAtRepair(projected, { animate: projected > previousProjected });
  $("repairPercent").textContent = `${percent}% reading confirmed`;
  $("siteStatus").textContent = state.campaignState.phase === "shield"
    ? `SHIELD · ${state.campaignState.shieldPass} OF 3`
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
$("taskStart").onclick = returnToHub;
$("taskHub").onclick = returnToHub;
$("taskSite").onclick = () => openRecoverySite(state.selectedSiteId);
$("taskReader").onclick = () => {
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
    else showDesktopMessage(messages[button.dataset.action]);
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
} else if (requestedSite) {
  renderSitePreview(getRecoverySite(requestedSite));
} else if (uiPreview === "hub") {
  show("hub");
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
