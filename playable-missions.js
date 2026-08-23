import { getPlayableWalkthrough } from "./apps/internet-recovery/playable-walkthroughs.js";
import { RECOVERY_SITES } from "./apps/internet-recovery/site-catalog.js";
import {
  acceptMissionReading,
  acknowledgeMissionMidpoint,
  createMissionSequenceState,
  recordMissionComprehension,
  retryMissionPassage,
  skipMissionPassage,
  submitMissionReflection,
} from "./apps/internet-recovery/mission-sequence-state.js";
import { ReadingAttemptController } from "./reading-companion/reading-attempt-controller.js";
import { resolveStreamingGuideGate, streamingGuideGateMessage } from "./reading-companion/streaming-guide-gate.js";
import { deleteLatestDiagnosticRun, saveLatestDiagnosticRun } from "./reading-playtest-diagnostics-store.js";
import { LocalWhisperRecognizer } from "./speech/local-whisper-recognizer.js";
import { supportsStreamingPcm } from "./speech/audio-capture.js";
import { loadPinnedSherpaRuntime } from "./speech/sherpa-runtime-loader.js";
import { createSherpaStreamingRecognizer, sherpaStreamingRuntimeAvailable } from "./speech/sherpa-streaming-recognizer.js";

const $ = (id) => document.getElementById(id);
const PLAYABLE_SITE_IDS = Object.freeze(["wikiwhy", "threadit", "faceplace", "yahuh", "viewtube", "amaze-on", "spotty-fi", "mapguess"]);
const CATALOG_TO_ROUTE = Object.freeze({ amazeon: "amaze-on", spottyfi: "spotty-fi" });
const SAVE_STORE_KEY = "internet-recovery-save-files-v1";
const LOCKED_PREVIEWS = Object.freeze({
  mycorner: "/walkthroughs/previews/mycorner-current_p1.png",
  searchish: "/walkthroughs/previews/search-ish-current_p1.png",
});
const requestedSiteId = new URLSearchParams(location.search).get("site");
const mission = requestedSiteId && PLAYABLE_SITE_IDS.includes(requestedSiteId)
  ? getPlayableWalkthrough(requestedSiteId)
  : null;
const streamingGuideOverride = new URLSearchParams(location.search).get("streamingGuide");
const requestedStreamingGuide = streamingGuideOverride == null
  ? globalThis.crossOriginIsolated === true
  : streamingGuideOverride === "1";
const replayRequested = new URLSearchParams(location.search).get("replay") === "1";
const whisper = new LocalWhisperRecognizer({ onProgress: updateOpeningModelProgress });
const wordAudio = new Audio();

let controller = null;
let streamingRecognizer = null;
let sequence = mission ? createMissionSequenceState({ phaseOneCount: mission.phaseOneCount, totalPassages: mission.passages.length }) : null;
let modelsPrepared = false;
let result = null;
let technoActionTimer = null;
let technoPointerTimer = null;
let technoTravelAnimation = null;
let technoTravelTargetState = "idle";
let modelPreparationPromise = null;
let saveToastTimer = null;
let activeWordButton = null;

const PORTRAITS = Object.freeze({
  "amy-engineer": Object.freeze({ image: "/walkthroughs/shared/amy-engineer.jpg", position: "center", size: "cover" }),
  "amy-evidence": Object.freeze({ image: "/walkthroughs/shared/amy-evidence.jpg", position: "center", size: "cover" }),
  "amy-skeptical": Object.freeze({ image: "/walkthroughs/shared/amy-skeptical.jpg", position: "center", size: "cover" }),
  "amy-supportive": Object.freeze({ image: "/walkthroughs/shared/amy-supportive.jpg", position: "center", size: "cover" }),
  "amy-tools": Object.freeze({ image: "/walkthroughs/shared/amy-tools.jpg", position: "center", size: "cover" }),
  "chinmay-careless": Object.freeze({ image: "/walkthroughs/shared/chinmay-production-portraits.png", position: "100% 0%", size: "300% 200%" }),
  "chinmay-explaining": Object.freeze({ image: "/walkthroughs/shared/chinmay-production-portraits.png", position: "50% 0%", size: "300% 200%" }),
  "otto-busy": Object.freeze({ image: "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png", position: "0% 0%", size: "300% 200%" }),
  "otto-learned": Object.freeze({ image: "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png", position: "50% 0%", size: "300% 200%" }),
  "otto-confused": Object.freeze({ image: "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png", position: "100% 0%", size: "300% 200%" }),
  "otto-overdrive": Object.freeze({ image: "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png", position: "50% 100%", size: "300% 200%" }),
});

const SITE_PORTRAITS = Object.freeze({
  wikiwhy: Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-careless", overfix: "otto-busy", correction: "amy-evidence", completion: "amy-supportive" }),
  threadit: Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-explaining", overfix: "otto-overdrive", correction: "amy-tools", completion: "amy-supportive" }),
  faceplace: Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-careless", overfix: "otto-busy", correction: "amy-evidence", completion: "amy-supportive" }),
  yahuh: Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-explaining", overfix: "otto-overdrive", correction: "amy-tools", completion: "amy-supportive" }),
  viewtube: Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-explaining", overfix: "otto-overdrive", correction: "amy-tools", completion: "amy-supportive" }),
  "amaze-on": Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-careless", overfix: "otto-busy", correction: "amy-evidence", completion: "amy-supportive" }),
  "spotty-fi": Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-explaining", overfix: "otto-overdrive", correction: "amy-tools", completion: "amy-supportive" }),
  mapguess: Object.freeze({ briefing: "amy-skeptical", chinmay: "chinmay-careless", overfix: "otto-busy", correction: "amy-evidence", completion: "amy-supportive" }),
});

const TECHNO_GAME_ACTIONS = Object.freeze({
  "floppy-drive": Object.freeze({ frameDurationMs: 220, holdLastMs: 900, loop: false, repetitions: 3 }),
  "file-search": Object.freeze({ frameDurationMs: 210, holdLastMs: 0, loop: true }),
  "usb-delivery": Object.freeze({ frameDurationMs: 190, holdLastMs: 800, loop: false }),
  "data-restored": Object.freeze({ frameDurationMs: 220, holdLastMs: 1200, loop: false }),
});

function emptySaveStore() {
  return { activeProfileKey: null, profiles: {}, version: 1 };
}

function readSaveStore() {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVE_STORE_KEY) ?? "null");
    if (!stored || stored.version !== 1 || typeof stored.profiles !== "object") return emptySaveStore();
    return stored;
  } catch {
    return emptySaveStore();
  }
}

function writeSaveStore(store) {
  localStorage.setItem(SAVE_STORE_KEY, JSON.stringify(store));
}

function normalizeProfileKey(name) {
  return String(name || "").trim().toLocaleLowerCase().replace(/\s+/gu, " ");
}

function activeProfile() {
  const store = readSaveStore();
  return store.activeProfileKey ? store.profiles[store.activeProfileKey] ?? null : null;
}

function loadOrCreateProfile(name) {
  const displayName = String(name || "").trim().replace(/\s+/gu, " ");
  const key = normalizeProfileKey(displayName);
  if (!key) return null;
  const store = readSaveStore();
  store.profiles[key] ??= {
    completedSiteIds: [],
    createdAt: new Date().toISOString(),
    displayName,
    missions: {},
    reflections: {},
    savedAt: new Date().toISOString(),
  };
  store.activeProfileKey = key;
  store.profiles[key].displayName = displayName;
  store.profiles[key].savedAt = new Date().toISOString();
  writeSaveStore(store);
  return store.profiles[key];
}

function updateActiveProfile(update) {
  const store = readSaveStore();
  const profile = store.activeProfileKey ? store.profiles[store.activeProfileKey] : null;
  if (!profile) return null;
  update(profile);
  profile.savedAt = new Date().toISOString();
  writeSaveStore(store);
  return profile;
}

function showSaveToast(message = "Game saved.") {
  clearTimeout(saveToastTimer);
  $("saveToast").textContent = message;
  $("saveToast").hidden = false;
  saveToastTimer = setTimeout(() => { $("saveToast").hidden = true; }, 1800);
}

function saveMissionProgress({ completed = false, notify = false } = {}) {
  if (!mission || !sequence) {
    updateActiveProfile(() => {});
    if (notify) showSaveToast();
    return;
  }
  updateActiveProfile((profile) => {
    profile.missions[mission.id] = { sequence: JSON.parse(JSON.stringify(sequence)), updatedAt: new Date().toISOString() };
    if (completed && !profile.completedSiteIds.includes(mission.id)) profile.completedSiteIds.push(mission.id);
  });
  if (notify) showSaveToast();
}

function restoreMissionProgress() {
  if (!mission || replayRequested) return null;
  const saved = activeProfile()?.missions?.[mission.id]?.sequence;
  if (!saved || saved.version !== 2 || saved.totalPassages !== mission.passages.length || saved.phaseOneCount !== mission.phaseOneCount) return null;
  if (!Number.isInteger(saved.index) || saved.index < 0 || saved.index > mission.passages.length) return null;
  return saved;
}

function stopTechnoAction() {
  clearTimeout(technoActionTimer);
  technoActionTimer = null;
  $("technoGameAction").hidden = true;
  $("technoPet").querySelector(".techno-sprite").hidden = false;
}

function setTechno(state, place = "left") {
  stopTechnoAction();
  clearTimeout(technoPointerTimer);
  const pet = $("technoPet");
  const currentPlace = pet.dataset.place;
  technoTravelTargetState = state;
  if (technoTravelAnimation && currentPlace === place) return;
  if (!currentPlace || currentPlace === place || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    technoTravelAnimation?.cancel();
    technoTravelAnimation = null;
    pet.dataset.state = state;
    pet.dataset.place = place;
    return;
  }
  const start = pet.getBoundingClientRect();
  const stageScale = $("gameStage").getBoundingClientRect().width / 1440 || 1;
  pet.dataset.place = place;
  const finish = pet.getBoundingClientRect();
  const movingRight = finish.left >= start.left;
  pet.dataset.state = movingRight ? "run-right" : "run-left";
  technoTravelAnimation?.cancel();
  technoTravelAnimation = pet.animate([
    { transform: `translate(${(start.left - finish.left) / stageScale}px, ${(start.top - finish.top) / stageScale}px)` },
    { transform: "translate(0, 0)" },
  ], { duration: Math.max(520, Math.min(1450, Math.abs(finish.left - start.left) * 1.7)), easing: "linear" });
  technoTravelAnimation.addEventListener("finish", () => {
    technoTravelAnimation = null;
    pet.dataset.state = technoTravelTargetState;
  }, { once: true });
}

function playTechnoAction(action, place = "left", returnState = "idle") {
  const settings = TECHNO_GAME_ACTIONS[action];
  if (!settings) return;
  stopTechnoAction();
  const pet = $("technoPet");
  const sprite = pet.querySelector(".techno-sprite");
  const image = $("technoGameAction");
  pet.dataset.state = `game-${action}`;
  pet.dataset.place = place;
  sprite.hidden = true;
  image.hidden = false;
  let frameIndex = 0;
  let completedRepetitions = 0;
  const tick = () => {
    image.src = `/pets/techno/game/frames/${action}/${String(frameIndex).padStart(2, "0")}.png`;
    frameIndex += 1;
    if (frameIndex < 6) {
      technoActionTimer = setTimeout(tick, settings.frameDurationMs);
      return;
    }
    if (settings.loop) {
      frameIndex = 0;
      technoActionTimer = setTimeout(tick, settings.frameDurationMs);
      return;
    }
    completedRepetitions += 1;
    if (completedRepetitions < (settings.repetitions ?? 1)) {
      frameIndex = 0;
      technoActionTimer = setTimeout(tick, settings.frameDurationMs);
      return;
    }
    technoActionTimer = setTimeout(() => setTechno(returnState, place), settings.holdLastMs);
  };
  tick();
}

function runTechnoAcross(direction = "right") {
  setTechno("idle", direction === "right" ? "repair" : "left");
}

function aimTechnoAt(clientX, clientY) {
  const pet = $("technoPet");
  if (pet.dataset.state !== "idle" && pet.dataset.state !== "look") return;
  const rect = pet.getBoundingClientRect();
  const angle = (Math.atan2(clientX - (rect.left + rect.width / 2), -(clientY - (rect.top + rect.height / 2))) * 180 / Math.PI + 360) % 360;
  const step = Math.round(angle / 22.5) % 16;
  const sprite = pet.querySelector(".techno-sprite");
  pet.dataset.state = "look";
  sprite.style.setProperty("--look-row", step < 8 ? "90%" : "100%");
  sprite.style.setProperty("--look-x", `${(step % 8) * (100 / 7)}%`);
  clearTimeout(technoPointerTimer);
  technoPointerTimer = setTimeout(() => {
    if (pet.dataset.state === "look") pet.dataset.state = "idle";
  }, 550);
}

function launcherStatus(site) {
  return "DESIGN SAVED · BUILD PENDING";
}

function renderLauncher() {
  document.title = "Internet Recovery OS 98 · Choose a Site";
  $("launcherView").hidden = false;
  $("missionView").hidden = true;
  const completedSiteIds = activeProfile()?.completedSiteIds ?? [];
  $("completeCount").textContent = `${completedSiteIds.length} / 8 COMPLETE`;
  $("siteGrid").replaceChildren(...RECOVERY_SITES.map((site) => {
    const routeId = CATALOG_TO_ROUTE[site.id] ?? site.id;
    const playable = PLAYABLE_SITE_IDS.includes(routeId);
    const completed = completedSiteIds.includes(routeId);
    const card = document.createElement(playable ? "a" : "article");
    card.className = `launcher-site ${playable ? "playable" : "unavailable"}${completed ? " completed" : ""}`;
    if (playable) card.href = completed ? `?site=${routeId}&replay=1` : `?site=${routeId}`;
    else card.setAttribute("aria-disabled", "true");
    const preview = document.createElement("img");
    preview.className = "preview";
    preview.src = playable ? getPlayableWalkthrough(routeId).initialFrame : LOCKED_PREVIEWS[site.id];
    preview.alt = "";
    const copy = document.createElement("div");
    copy.className = "card-copy";
    const heading = document.createElement("div");
    heading.className = "site-heading";
    const mark = document.createElement("img");
    mark.src = site.markImage;
    mark.alt = "";
    const title = document.createElement("h3");
    title.textContent = site.name;
    heading.append(mark, title);
    const description = document.createElement("p");
    description.textContent = site.description;
    const status = document.createElement("span");
    status.className = "case-status";
    status.textContent = completed ? "RECOVERY COMPLETE · PLAY AGAIN" : playable ? "OPEN RECOVERY CASE" : launcherStatus(site);
    copy.append(heading, description, status);
    card.append(preview, copy);
    return card;
  }));
  playTechnoAction("floppy-drive", "launcher", "idle");
}

function recoveryDocumentName(siteName, playerName) {
  const safeSite = String(siteName || "Recovered_site").replace(/[^a-z0-9]+/giu, "_").replace(/^_+|_+$/gu, "");
  const safePlayer = String(playerName || "player").replace(/[^a-z0-9]+/giu, "_").replace(/^_+|_+$/gu, "");
  return `${safeSite}_${safePlayer}_feedback_for_Otto.txt`;
}

function openDocuments() {
  const profile = activeProfile();
  const records = Object.entries(profile?.reflections ?? {}).map(([siteId, record]) => {
    const walkthrough = PLAYABLE_SITE_IDS.includes(siteId) ? getPlayableWalkthrough(siteId) : null;
    const siteName = record.siteName || walkthrough?.name || siteId;
    return {
      filename: recoveryDocumentName(siteName, profile.displayName),
      lesson: record.lesson || walkthrough?.ottoLesson || "Lesson not recorded in this older save.",
      reflection: record.reflection || "No player explanation was saved.",
      savedAt: record.savedAt,
      siteName,
    };
  }).sort((a, b) => String(a.siteName).localeCompare(String(b.siteName)));
  $("documentsProfile").textContent = profile ? `${profile.displayName} · ${records.length} file${records.length === 1 ? "" : "s"}` : "No player loaded";
  const preview = $("documentPreview");
  const showRecord = (record, selectedButton) => {
    for (const button of $("documentList").querySelectorAll("button")) button.setAttribute("aria-pressed", String(button === selectedButton));
    const title = document.createElement("h2");
    title.textContent = record.filename;
    const lessonHeading = document.createElement("h3");
    lessonHeading.textContent = "LESSON SAVED FOR OTTO";
    const lesson = document.createElement("p");
    lesson.textContent = record.lesson;
    const playerHeading = document.createElement("h3");
    playerHeading.textContent = "PLAYER’S EXPLANATION";
    const reflection = document.createElement("p");
    reflection.textContent = record.reflection;
    preview.replaceChildren(title, lessonHeading, lesson, playerHeading, reflection);
  };
  $("documentList").replaceChildren(...records.map((record, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `📄 ${record.filename}`;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => showRecord(record, button));
    if (index === 0) queueMicrotask(() => showRecord(record, button));
    return button;
  }));
  if (!records.length) preview.replaceChildren(Object.assign(document.createElement("h2"), { textContent: "No recovery files yet" }), Object.assign(document.createElement("p"), { textContent: "Finish a recovery case and teach Otto a lesson. The saved lesson will appear here." }));
  $("documentsWindow").hidden = false;
  $("closeDocuments").focus();
}

function closeDocuments() {
  $("documentsWindow").hidden = true;
}

function setFrame(source, description = "") {
  $("siteFrame").src = source;
  $("siteFrame").alt = `${mission.name} ${description}`.trim();
}

function resizeStage() {
  const scaler = $("stageScaler");
  const scale = Math.max(0.1, Math.min(
    (scaler.clientWidth - 16) / 1440,
    (scaler.clientHeight - 16) / 900,
  ));
  $("gameStage").style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function showView(id) {
  for (const view of ["readerView", "resultView", "skipView", "reflectionView", "receiptView"]) $(view).hidden = view !== id;
}

function passage() { return mission.passages[sequence.index]; }

function positionText() { return `${sequence.index + 1} of ${mission.passages.length}`; }

function renderPassage() {
  const current = passage();
  const shouldAutoPrepare = sessionStorage.getItem("internet-recovery-voice-warmed-v1") === "1";
  $("missionName").textContent = mission.name;
  $("passagePosition").textContent = positionText();
  $("companionTitle").textContent = current.title;
  $("passage").replaceChildren(...current.lines.map((line, index) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    if (index < current.sourceIntroductionLineCount) paragraph.className = "source-introduction";
    if (index === 0) paragraph.dataset.sourceStart = "true";
    return paragraph;
  }));
  $("guideProgressFill").style.width = "0%";
  $("guideProgressFill").parentElement.setAttribute("aria-valuenow", "0");
  $("readerStatus").textContent = modelsPrepared
    ? "Ready when you are."
    : shouldAutoPrepare
      ? "Reconnecting to the prepared local voice model…"
      : "Prepare the local models when you are ready.";
  $("prepareModels").hidden = modelsPrepared || shouldAutoPrepare;
  $("startReading").disabled = !modelsPrepared;
  $("finishReading").disabled = true;
  showView("readerView");
  setTechno("idle", "left");
  void buildController();
  void prewarmCurrentVocabulary();
  if (shouldAutoPrepare && !modelsPrepared) void prepareModels();
  preloadNextFrame();
}

async function prewarmCurrentVocabulary() {
  try {
    const { prepareVocabularyCards } = await import("./speech/local-kokoro-tts.js");
    await prepareVocabularyCards(passage().challengingWords.slice(0, 3));
  } catch {
    // The result controls retain an on-demand retry if background preparation fails.
  }
}

function preloadNextFrame() {
  const next = mission.transitionBeats?.[sequence.index]?.frame ?? mission.repairFrames[sequence.index];
  if (!next) return;
  const image = new Image();
  image.src = next;
}

function updateGuide(event) {
  const lines = [...$("passage").querySelectorAll("p")];
  lines.forEach((line, index) => {
    line.classList.toggle("past", index < event.visibleLineIndex);
    line.classList.toggle("active", index === event.visibleLineIndex);
  });
  lines[event.visibleLineIndex]?.scrollIntoView({ block: "center", behavior: "smooth" });
  const percent = event.totalWordCount ? Math.round((event.confirmedWordIndex / event.totalWordCount) * 100) : 0;
  $("guideProgressFill").style.width = `${percent}%`;
  $("guideProgressFill").parentElement.setAttribute("aria-valuenow", String(percent));
}

function updateModelStatus(event) {
  const labels = {
    "preparing-whisper": "Loading the final local voice check…",
    "whisper-ready": "Final local voice check ready",
    "preparing-streaming-guide": "Preparing the optional live guide…",
    "streaming-guide-ready": "Live guide ready; Whisper remains final",
    "whisper-failed": "The final voice model could not load",
  };
  $("modelStatus").textContent = labels[event.phase] ?? event.phase.replaceAll("-", " ");
}

function updateAttemptStatus(event) {
  const labels = {
    "requesting-microphone": "Waiting for microphone permission…",
    listening: "Listening. Finish now is always available.",
    "auto-finish-armed": "End of passage heard. Finishing in about five seconds unless you finish now.",
    finalizing: "Checking this reading locally…",
    "whisper-checkpoint-fallback": "Live guide is using local Whisper checkpoints.",
    "streaming-guide-failed": "The live guide paused; local Whisper checkpoints are continuing.",
    "microphone-unavailable": "The microphone did not start. Check permission and try again.",
    "diagnostic-save-failed": "Reading complete. The optional troubleshooting copy could not be saved.",
  };
  if (labels[event.phase]) $("readerStatus").textContent = labels[event.phase];
  if (event.phase === "requesting-microphone") setTechno("waiting", "left");
  if (event.phase === "listening") playTechnoAction("file-search", "left", "idle");
  if (event.phase === "auto-finish-armed" || event.phase === "finalizing") setTechno("review", "left");
  if (event.phase === "microphone-unavailable") setTechno("failed", "left");
}

async function buildStreamingRecognizer() {
  const baseGate = resolveStreamingGuideGate({
    requested: requestedStreamingGuide,
    crossOriginIsolated: globalThis.crossOriginIsolated === true,
    sharedArrayBufferAvailable: typeof globalThis.SharedArrayBuffer === "function",
    streamingPcmAvailable: supportsStreamingPcm(window),
    sherpaRuntimeAvailable: sherpaStreamingRuntimeAvailable(globalThis),
  });
  const canLoad = requestedStreamingGuide && globalThis.crossOriginIsolated === true
    && typeof globalThis.SharedArrayBuffer === "function" && supportsStreamingPcm(window);
  if (!baseGate.enabled && canLoad && baseGate.reason === "sherpa-runtime-unavailable") {
    try {
      await loadPinnedSherpaRuntime({
        runtime: globalThis,
        onDataProgress({ loaded, total }) {
          $("modelProgress").value = total ? Math.round((loaded / total) * 100) : 0;
        },
        onStatus(message) { $("modelStatus").textContent = String(message || "Loading live guide…"); },
      });
    } catch (error) {
      $("modelStatus").textContent = `Live guide unavailable; Whisper fallback ready (${error.message})`;
      return null;
    }
  }
  const gate = resolveStreamingGuideGate({
    requested: requestedStreamingGuide,
    crossOriginIsolated: globalThis.crossOriginIsolated === true,
    sharedArrayBufferAvailable: typeof globalThis.SharedArrayBuffer === "function",
    streamingPcmAvailable: supportsStreamingPcm(window),
    sherpaRuntimeAvailable: sherpaStreamingRuntimeAvailable(globalThis),
  });
  $("readerStatus").textContent = streamingGuideGateMessage(gate);
  return gate.enabled ? createSherpaStreamingRecognizer({ runtime: globalThis }) : null;
}

async function buildController() {
  const current = passage();
  controller = new ReadingAttemptController({
    lines: current.lines,
    onDiagnostic: (record) => saveLatestDiagnosticRun(record),
    onGuidePosition: updateGuide,
    onModelStatus: updateModelStatus,
    onResult: showResult,
    onStatus: updateAttemptStatus,
    passageId: current.id,
    retainTroubleshooting: $("retainTroubleshooting").checked,
    streamingRecognizer,
    whisper,
    wordsPerMinute: current.profile?.guide?.defaultWpm ?? 180,
  });
  if (modelsPrepared) await controller.prepare({ preferStreaming: Boolean(streamingRecognizer) });
}

async function prepareModels() {
  if (modelsPrepared) return;
  if (modelPreparationPromise) return modelPreparationPromise;
  modelPreparationPromise = (async () => {
    setTechno("waiting", "left");
    $("prepareModels").disabled = true;
    $("prepareModels").textContent = "Preparing local model…";
    try {
      streamingRecognizer ??= await buildStreamingRecognizer();
      await buildController();
      await controller.prepare({ preferStreaming: Boolean(streamingRecognizer) });
      modelsPrepared = true;
      $("modelProgress").value = 100;
      $("modelStatus").textContent = streamingRecognizer ? "Local models ready · live guide on" : "Local Whisper ready · checkpoint guide";
      $("prepareModels").hidden = true;
      $("startReading").disabled = false;
      $("readerStatus").textContent = "Ready when you are.";
      setTechno("idle", "left");
    } catch (error) {
      $("prepareModels").disabled = false;
      $("prepareModels").textContent = "Retry local model";
      $("readerStatus").textContent = `The local voice model did not load: ${error.message}`;
      setTechno("failed", "left");
      modelPreparationPromise = null;
    }
  })();
  return modelPreparationPromise;
}

async function startReading() {
  $("startReading").disabled = true;
  try {
    await controller.start();
    void import("./speech/local-kokoro-tts.js")
      .then(({ prepareVocabularyVoice }) => prepareVocabularyVoice())
      .catch(() => {});
    $("finishReading").disabled = false;
    playTechnoAction("file-search", "left", "idle");
  } catch {
    $("startReading").disabled = false;
  }
}

function confidenceDetail(readingResult) {
  if (readingResult.confidenceBand?.id === "strong") return "The final local voice check found strong evidence across the passage.";
  if (readingResult.confidenceBand?.id === "directional") return "The final local voice check found useful partial evidence.";
  return "Your attempt still counts. You can retry if you want another voice check.";
}

function showResult(readingResult) {
  result = readingResult;
  if (!readingResult.accepted) return;
  sequence = acceptMissionReading(sequence, { passageId: readingResult.passageId }).state;
  saveMissionProgress();
  $("resultPassagePosition").textContent = positionText();
  $("resultTitle").textContent = readingResult.confidenceBand?.label ?? "Reading complete";
  $("resultDetail").textContent = confidenceDetail(readingResult);
  $("coverageBand").textContent = readingResult.coverage.band;
  $("coverageDetail").textContent = readingResult.coverage.detail;
  $("paceBand").textContent = readingResult.pace.band;
  $("paceDetail").textContent = readingResult.pace.detail;
  renderQuestion();
  renderWordHelp();
  $("nextPassage").disabled = true;
  $("nextPassage").textContent = "Next passage";
  showView("resultView");
  $("resultView").focus();
  playTechnoAction("data-restored", "left", "review");
  saveAggregate(readingResult);
}

function renderQuestion() {
  const check = passage().comprehension;
  $("question").textContent = check.question;
  $("answerFeedback").textContent = "Choose the answer best supported by the passage.";
  $("answers").replaceChildren(...check.choices.map((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.text;
    button.addEventListener("click", () => answerQuestion(choice, button));
    return button;
  }));
}

async function answerQuestion(choice, selectedButton) {
  const current = passage();
  for (const button of $("answers").querySelectorAll("button")) button.disabled = true;
  selectedButton.classList.add("checking");
  $("answerFeedback").textContent = "Checking that answer against the passage…";
  await new Promise((resolve) => requestAnimationFrame(resolve));
  const response = recordMissionComprehension(sequence, { correct: choice.correct, passageId: current.id });
  sequence = response.state;
  saveMissionProgress();
  for (const button of $("answers").querySelectorAll("button")) button.classList.remove("checking", "incorrect");
  if (!choice.correct) {
    selectedButton.classList.add("incorrect");
    for (const button of $("answers").querySelectorAll("button")) button.disabled = false;
    $("answerFeedback").textContent = current.comprehension.tryAgainFeedback;
    setTechno("failed", "left");
    return;
  }
  selectedButton.classList.add("correct");
  $("answerFeedback").textContent = current.comprehension.correctFeedback;
  setFrame(mission.repairFrames[sequence.index - 1], `repair ${sequence.index}`);
  playTechnoAction("data-restored", "repair", "review");
  $("nextPassage").disabled = false;
  if (sequence.phase === "midpoint-required") $("nextPassage").textContent = "Review Chinmay’s fix";
  else if (sequence.phase === "reflection-required") $("nextPassage").textContent = "Teach Otto";
  else if (mission.transitionBeats?.[sequence.index]) $("nextPassage").textContent = "See what moved";
}

function renderWordHelp() {
  const normalizedPassage = passage().lines.join(" ").replace(/\s+/gu, " ").trim();
  const words = passage().challengingWords.filter((entry) => {
    const sourceSentence = String(entry.sentence ?? "").replace(/\s+/gu, " ").trim();
    return entry.properNoun === false
      && Boolean(sourceSentence)
      && normalizedPassage.includes(sourceSentence);
  }).slice(0, 3);
  $("wordHelp").hidden = words.length === 0;
  $("wordCards").replaceChildren(...words.map((entry) => {
    const card = document.createElement("article");
    const heading = document.createElement("h3");
    heading.textContent = entry.word;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "▶ Hear aloud";
    button.setAttribute("aria-label", `Hear ${entry.word}, its definition, and its passage sentence`);
    button.addEventListener("click", async () => {
      if (activeWordButton === button) {
        wordAudio.pause();
        wordAudio.currentTime = 0;
        const { stopVocabularyVoice } = await import("./speech/local-kokoro-tts.js");
        stopVocabularyVoice();
        button.textContent = "▶ Hear aloud";
        button.removeAttribute("aria-busy");
        activeWordButton = null;
        $("wordAudioStatus").textContent = `Stopped ${entry.word}.`;
        return;
      }
      if (activeWordButton) {
        activeWordButton.textContent = "▶ Hear aloud";
        activeWordButton.removeAttribute("aria-busy");
      }
      wordAudio.pause();
      wordAudio.currentTime = 0;
      const { stopVocabularyVoice } = await import("./speech/local-kokoro-tts.js");
      stopVocabularyVoice();
      activeWordButton = button;
      button.textContent = "■ Stop";
      button.setAttribute("aria-busy", "true");
      const resetButton = () => {
        if (activeWordButton !== button) return;
        button.textContent = "▶ Hear aloud";
        button.removeAttribute("aria-busy");
        activeWordButton = null;
      };
      try {
        if (entry.audioSrc) {
          wordAudio.src = entry.audioSrc;
          wordAudio.onended = resetButton;
          await wordAudio.play();
          $("wordAudioStatus").textContent = `Playing ${entry.word}, its definition, and its passage sentence.`;
          return;
        }
        const { speakVocabularyCard } = await import("./speech/local-kokoro-tts.js");
        const started = await speakVocabularyCard({
          word: entry.word,
          definition: entry.meaning,
          sentence: entry.sentence,
          onStatus: (message) => { $("wordAudioStatus").textContent = message; },
          onEnded: resetButton,
        });
        if (!started) resetButton();
      } catch {
        $("wordAudioStatus").textContent = "The local pronunciation voice could not start. Try again.";
        resetButton();
      }
    });
    card.append(heading, button);
    return card;
  }));
}

async function retryReading() {
  sequence = retryMissionPassage(sequence, { passageId: passage().id }).state;
  saveMissionProgress();
  result = null;
  renderPassage();
  setTechno("waiting", "left");
}

function skipReading() {
  void controller?.close();
  const current = passage();
  const response = skipMissionPassage(sequence, { passageId: current.id });
  if (!response.advanced) return;
  sequence = response.state;
  saveMissionProgress();
  setFrame(mission.repairFrames[sequence.index - 1], `preview repair ${sequence.index}`);
  $("skipPassagePosition").textContent = `${sequence.index} of ${mission.passages.length}`;
  showView("skipView");
  $("skipView").focus();
  runTechnoAcross("right");
}

function showStoryBeat(speaker, heading, text, buttonLabel, portraitKey) {
  $("storyOverlay").hidden = false;
  $("readingCompanion").inert = true;
  const dialog = $("storyOverlay").querySelector(".story-dialog");
  dialog.dataset.speaker = speaker;
  const portrait = PORTRAITS[portraitKey] ?? PORTRAITS[speaker === "auto" ? "otto-busy" : speaker === "amy" ? "amy-supportive" : "chinmay-careless"];
  const tile = $("storySpeaker");
  tile.style.setProperty("--portrait-image", `url('${portrait.image}')`);
  tile.style.setProperty("--portrait-position", portrait.position);
  tile.style.setProperty("--portrait-size", portrait.size);
  $("storyLabel").textContent = speaker === "auto" ? "OTTO" : speaker.toUpperCase();
  $("storyHeading").textContent = heading;
  $("storyText").textContent = text;
  $("storyContinue").textContent = buttonLabel;
  return new Promise((resolve) => {
    $("storyContinue").onclick = () => {
      $("storyOverlay").hidden = true;
      $("readingCompanion").inert = false;
      resolve();
    };
  });
}

function showCorruptionPause() {
  $("corruptionPause").hidden = false;
  $("readingCompanion").inert = true;
  const previewButton = $("continueAfterSkip");
  const previousLabel = previewButton.textContent;
  previewButton.disabled = true;
  previewButton.textContent = "React to the site first";
  return new Promise((resolve) => {
    $("corruptionContinue").onclick = () => {
      $("corruptionPause").hidden = true;
      $("readingCompanion").inert = false;
      previewButton.disabled = false;
      previewButton.textContent = previousLabel;
      resolve();
    };
  });
}

async function runMidpoint() {
  const portraits = SITE_PORTRAITS[mission.id];
  setTechno("review", "left");
  await showStoryBeat("chinmay", mission.midpoint.chinmay.heading, mission.midpoint.chinmay.text, "See Chinmay’s fix", portraits.chinmay);
  setTechno("failed", "left");
  await showStoryBeat("auto", mission.midpoint.auto.heading, mission.midpoint.auto.text, "Apply Otto’s update", portraits.overfix);
  setFrame(mission.superFrame, "Auto over-fix active");
  setTechno("failed", "left");
  await showCorruptionPause();
  await showStoryBeat("amy", mission.midpoint.amy.heading, mission.midpoint.amy.text, "Lock in the repair", portraits.correction);
  setFrame(mission.checklistFrame, "repair checklist");
  sequence = acknowledgeMissionMidpoint(sequence).state;
  saveMissionProgress();
  renderPassage();
}

function showReflection() {
  setFrame(mission.securedFrame, "secured");
  $("reflectionPrompt").textContent = mission.reflectionPrompt;
  $("reflectionText").value = "";
  $("reflectionCount").textContent = "0 words";
  showView("reflectionView");
  setTechno("waiting", "left");
}

async function runCompletionBriefing() {
  setFrame(mission.securedFrame, "secured");
  setTechno("jump", "left");
  await showStoryBeat(
    "amy",
    "GOOD JOB — THE FIXES ARE LOCKED IN",
    `You repaired ${mission.name} and protected the choices that Otto erased. Now it’s time to teach Otto what we learned from this site so the same over-fix doesn’t happen again.`,
    "Teach Otto",
    SITE_PORTRAITS[mission.id].completion,
  );
  showReflection();
}

async function runTransitionBeat() {
  const beat = mission.transitionBeats?.[sequence.index];
  if (!beat) return false;
  setFrame(beat.frame, `moving-target transition ${sequence.index}`);
  setTechno("failed", "left");
  await showStoryBeat("amy", beat.heading, beat.text, beat.buttonLabel, SITE_PORTRAITS[mission.id].correction);
  renderPassage();
  return true;
}

function nextPassage() {
  if (sequence.phase === "midpoint-required") return void runMidpoint();
  if (sequence.phase === "reflection-required") return void runCompletionBriefing();
  if (mission.transitionBeats?.[sequence.index]) return void runTransitionBeat();
  renderPassage();
}

function continueAfterSkip() {
  if (sequence.phase === "midpoint-required") return void runMidpoint();
  if (sequence.phase === "reflection-required") return void runCompletionBriefing();
  if (mission.transitionBeats?.[sequence.index]) return void runTransitionBeat();
  renderPassage();
}

function submitReflection() {
  const reflection = $("reflectionText").value;
  const response = submitMissionReflection(sequence, { reflection });
  if (!response.completed) {
    $("reflectionPrompt").textContent = `${mission.reflectionPrompt} Write at least one sentence before sending it.`;
    return;
  }
  sequence = response.state;
  setFrame(mission.receiptFrame, "repair complete");
  saveReflection(reflection);
  saveMissionProgress({ completed: true });
  showView("receiptView");
  playTechnoAction("data-restored", "left", "jump");
}

async function confirmReceipt() {
  await showStoryBeat("auto", "THANK YOU FOR THE LESSON", mission.ottoLesson, "Choose the next site", "otto-learned");
  location.href = "/playable-missions.html";
}

function saveAggregate(readingResult) {
  const key = "finn-playable-mission-results-v1";
  const stored = JSON.parse(localStorage.getItem(key) ?? "[]");
  stored.push({
    accepted: readingResult.accepted,
    automaticFinish: readingResult.automaticFinish,
    confidenceBand: readingResult.confidenceBand?.id ?? null,
    coverageBand: readingResult.coverage.band,
    matchedWords: readingResult.matchedWords,
    paceBand: readingResult.pace.band,
    passageId: readingResult.passageId,
    siteId: mission.id,
    totalWords: readingResult.totalWords,
  });
  localStorage.setItem(key, JSON.stringify(stored.slice(-100)));
}

function saveReflection(reflection) {
  updateActiveProfile((profile) => {
    profile.reflections[mission.id] = {
      lesson: mission.ottoLesson,
      reflection,
      savedAt: new Date().toISOString(),
      siteName: mission.name,
    };
  });
}

function restartMission() {
  sequence = createMissionSequenceState({ phaseOneCount: mission.phaseOneCount, totalPassages: mission.passages.length });
  saveMissionProgress();
  setFrame(mission.initialFrame, "initial corruption");
  void runBriefing();
}

function renderSavedProfiles() {
  const store = readSaveStore();
  const profiles = Object.values(store.profiles).sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
  $("savedProfiles").replaceChildren(...profiles.map((profile) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${profile.displayName} · ${profile.completedSiteIds.length}/8 complete`;
    button.addEventListener("click", () => beginProfile(profile.displayName));
    return button;
  }));
  $("savedProfiles").hidden = profiles.length === 0;
}

function updateOpeningModelProgress(event) {
  const gate = $("dialupGate");
  if (!gate || gate.hidden) return;
  const progress = $("dialupProgress");
  const percent = Number(event?.progress);
  if (Number.isFinite(percent)) {
    progress.value = Math.max(1, Math.min(99, Math.round(percent)));
    $("dialupStatus").textContent = `Receiving local voice packets… ${Math.round(percent)}%`;
    return;
  }
  progress.removeAttribute("value");
  if (event?.status === "fallback") $("dialupStatus").textContent = "Switching to the compatible local connection…";
  else if (event?.status === "done") $("dialupStatus").textContent = "Checking the downloaded voice packets…";
  else if (event?.status === "ready") $("dialupStatus").textContent = "Starting the local voice engine…";
}

const waitForPaint = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function prepareOpeningVoiceModel() {
  const gate = $("dialupGate");
  const window = gate.querySelector(".dialup-window");
  const progress = $("dialupProgress");
  const retry = $("retryDialup");
  const continueButton = $("continueWithoutVoice");
  const returningConnection = sessionStorage.getItem("internet-recovery-voice-warmed-v1") === "1";
  $("setupDesktop").hidden = false;
  $("setupShortcuts").hidden = false;
  $("setupTask").textContent = "▣ Dialing Progress";
  gate.hidden = false;
  window.dataset.state = "dialing";
  progress.removeAttribute("value");
  retry.hidden = true;
  continueButton.hidden = true;
  $("dialupStatus").textContent = returningConnection ? "Reconnecting to the local voice cache…" : "Dialing localhost…";
  setTechno("waiting", "center");
  await waitForPaint(returningConnection ? 120 : 360);
  try {
    await whisper.load();
    if (requestedStreamingGuide && globalThis.crossOriginIsolated === true
      && typeof globalThis.SharedArrayBuffer === "function" && supportsStreamingPcm(window)) {
      $("dialupStatus").textContent = "Connecting the live Sherpa line guide…";
      progress.removeAttribute("value");
      await loadPinnedSherpaRuntime({
        runtime: globalThis,
        onDataProgress({ loaded, total }) {
          if (!total) return;
          progress.value = Math.max(1, Math.min(99, Math.round((loaded / total) * 100)));
          $("dialupStatus").textContent = `Receiving Sherpa line-guide packets… ${progress.value}%`;
        },
        onStatus(message) { if (message) $("dialupStatus").textContent = String(message); },
      });
      const openingGuide = createSherpaStreamingRecognizer({ runtime: globalThis });
      openingGuide.prepare();
      await openingGuide.close();
    }
    sessionStorage.setItem("internet-recovery-voice-warmed-v1", "1");
    window.dataset.state = "connected";
    progress.value = 100;
    $("dialupStatus").textContent = "Connected at 56K-ish. Local voice model ready.";
    setTechno("wave", "center");
    await waitForPaint(900);
    gate.hidden = true;
    $("setupDesktop").hidden = true;
    $("setupShortcuts").hidden = true;
    setTechno("idle", mission ? "left" : "launcher");
    return true;
  } catch {
    window.dataset.state = "error";
    progress.removeAttribute("value");
    $("dialupStatus").textContent = "Busy signal. The local voice model did not connect.";
    retry.hidden = false;
    continueButton.hidden = false;
    setTechno("failed", "center");
    return new Promise((resolve) => {
      retry.onclick = async () => resolve(await prepareOpeningVoiceModel());
      continueButton.onclick = () => {
        gate.hidden = true;
        $("setupDesktop").hidden = true;
        $("setupShortcuts").hidden = true;
        setTechno("idle", mission ? "left" : "launcher");
        resolve(false);
      };
    });
  }
}

function openProfileGate({ clearName = false } = {}) {
  $("startMenu").hidden = true;
  for (const button of document.querySelectorAll(".start-button")) button.setAttribute("aria-expanded", "false");
  renderSavedProfiles();
  if (clearName) $("profileName").value = "";
  $("profileError").textContent = "";
  $("setupDesktop").hidden = false;
  $("setupShortcuts").hidden = false;
  $("setupTask").textContent = "▣ Player Login";
  $("profileGate").hidden = false;
  $("profileName").focus();
}

async function beginProfile(name) {
  const profile = loadOrCreateProfile(name);
  if (!profile) {
    $("profileError").textContent = "Enter a player name to continue.";
    return;
  }
  $("profileGate").hidden = true;
  $("activeProfileName").textContent = profile.displayName;
  await prepareOpeningVoiceModel();
  startExperience();
}

function frameForSavedSequence() {
  if (sequence.phase === "completed") return mission.receiptFrame;
  if (sequence.phase === "reflection-required") return mission.securedFrame;
  if (sequence.phase === "lock-sequence" && sequence.index === mission.phaseOneCount) return mission.checklistFrame;
  if (mission.transitionBeats?.[sequence.index]) return mission.transitionBeats[sequence.index].frame;
  if (sequence.index > 0) return mission.repairFrames[sequence.index - 1];
  return mission.initialFrame;
}

function resumeMission() {
  const restored = restoreMissionProgress();
  if (restored) sequence = restored;
  if (!restored || sequence.index === 0) {
    void runBriefing();
    return;
  }
  setFrame(frameForSavedSequence(), "saved recovery progress");
  if (sequence.phase === "completed") {
    showView("receiptView");
    setTechno("jump", "left");
    return;
  }
  if (sequence.phase === "reflection-required") {
    void runCompletionBriefing();
    return;
  }
  if (sequence.phase === "midpoint-required") {
    void runMidpoint();
    return;
  }
  renderPassage();
  void prepareModels();
}

function startExperience() {
  if (!mission) {
    renderLauncher();
    return;
  }
  document.title = `${mission.name} · Playable Mission`;
  sequence = createMissionSequenceState({ phaseOneCount: mission.phaseOneCount, totalPassages: mission.passages.length });
  $("launcherView").hidden = true;
  $("missionView").hidden = false;
  $("missionTask").textContent = `▣ ${mission.name}`;
  resumeMission();
}

function toggleStartMenu(event) {
  event.stopPropagation();
  const willOpen = $("startMenu").hidden;
  $("startMenu").hidden = !willOpen;
  for (const button of document.querySelectorAll(".start-button")) button.setAttribute("aria-expanded", String(willOpen));
}

function bindShellControls() {
  for (const button of document.querySelectorAll("[data-open-documents]")) button.addEventListener("click", openDocuments);
  $("closeDocuments").addEventListener("click", closeDocuments);
  $("documentsWindow").addEventListener("click", (event) => { if (event.target === $("documentsWindow")) closeDocuments(); });
  for (const button of document.querySelectorAll(".start-button")) {
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", toggleStartMenu);
  }
  $("startMenu").addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => {
    $("startMenu").hidden = true;
    for (const button of document.querySelectorAll(".start-button")) button.setAttribute("aria-expanded", "false");
  });
  $("saveGame").addEventListener("click", () => {
    saveMissionProgress({ notify: true });
    $("startMenu").hidden = true;
  });
  $("switchProfile").addEventListener("click", () => {
    saveMissionProgress();
    openProfileGate();
  });
  $("newGame").addEventListener("click", () => {
    saveMissionProgress();
    openProfileGate({ clearName: true });
  });
  $("loadProfile").addEventListener("click", () => beginProfile($("profileName").value));
  $("profileName").addEventListener("keydown", (event) => {
    if (event.key === "Enter") beginProfile($("profileName").value);
  });
}

async function runBriefing() {
  setFrame(mission.initialFrame, "initial corruption");
  setTechno("waiting", "left");
  await showStoryBeat("amy", `${mission.name.toUpperCase()} IS CORRUPTED`, `Read each short passage and answer the quick check to repair this site. Retrying keeps the same passage and does not move the repair forward. For this fast prototype, Skip passage previews the next design state without creating a speech score.`, "Start recovery", SITE_PORTRAITS[mission.id].briefing);
  renderPassage();
  void prepareModels();
}

async function finishReading() {
  $("finishReading").disabled = true;
  await controller.finish();
}

function initialize() {
  if (!mission) $("technoPet").dataset.place = "launcher";
  addEventListener("pointermove", (event) => aimTechnoAt(event.clientX, event.clientY), { passive: true });
  resizeStage();
  addEventListener("resize", resizeStage);
  bindShellControls();
  $("launcherView").hidden = true;
  $("missionView").hidden = true;
  const profile = activeProfile();
  if (profile) {
    $("activeProfileName").textContent = profile.displayName;
    startExperience();
  } else {
    openProfileGate({ clearName: true });
  }
  if (!mission) return;
  $("prepareModels").addEventListener("click", prepareModels);
  $("startReading").addEventListener("click", startReading);
  $("finishReading").addEventListener("click", finishReading);
  $("skipReading").addEventListener("click", skipReading);
  $("continueAfterSkip").addEventListener("click", continueAfterSkip);
  $("retryReading").addEventListener("click", retryReading);
  $("nextPassage").addEventListener("click", nextPassage);
  $("submitReflection").addEventListener("click", submitReflection);
  $("confirmReceipt").addEventListener("click", confirmReceipt);
  $("reflectionText").addEventListener("input", () => {
    const count = $("reflectionText").value.trim().split(/\s+/u).filter(Boolean).length;
    $("reflectionCount").textContent = `${count} word${count === 1 ? "" : "s"}`;
    setTechno("waiting", "left");
  });
  $("deleteTroubleshooting").addEventListener("click", async () => {
    await deleteLatestDiagnosticRun();
    $("diagnosticStatus").textContent = "Latest troubleshooting copy deleted.";
  });
}

addEventListener("pagehide", () => {
  if (controller) void controller.close().catch(() => {});
  else whisper.close();
});
initialize();
