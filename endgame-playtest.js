import {
  ENDGAME_ASSETS,
  ENDGAME_COPY,
  ENDGAME_PLAYTEST_FIXTURE_ID,
  ENDGAME_POPUPS,
  ENDGAME_REPAIR_STEP_KEYS,
  ENDGAME_SITE_FIXTURES,
  getEndgameRepairStep,
  popupAccessibleCloseName,
  repairStepId,
} from "./apps/internet-recovery/endgame-playtest-content.js";
import {
  advanceEndingDialogue,
  advanceFinalDialogue,
  advanceInstructionIntro,
  advanceReadyDialogue,
  advanceTakeoverDialogue,
  advanceToNextSite,
  answerCurrentLesson,
  closeTopPopup,
  createEndgamePlaytestPersistence,
  endgamePhase,
  finishEndgame,
  jumpToEndgameBeat,
  replayDesktopIncident,
  restoreDesktop,
  returnToEpilogue,
  sendFinalInstruction,
  stopCelebration,
} from "./apps/internet-recovery/endgame-playtest-state.js";

const stage = document.querySelector("#endgameStage");
const stageShell = document.querySelector("#stageShell");
const announcement = document.querySelector("#endgameAnnouncement");
const saveStatus = document.querySelector("#playtestSaveStatus");
const jumpSelect = document.querySelector("#jumpToBeat");
const skipButton = document.querySelector("#skipCurrentStep");
const reduceMotion = document.querySelector("#reduceMotion");
const resetButton = document.querySelector("#resetPlaytest");
const persistence = createEndgamePlaytestPersistence();

const routeParams = new URLSearchParams(location.search);
const replayRequested = routeParams.get("replay") === "1";
const campaignMode = routeParams.get("campaign") === "1";
let state = replayRequested
  ? persistence.save(replayDesktopIncident(persistence.load()))
  : persistence.load();
if (replayRequested) history.replaceState(null, "", campaignMode ? "/endgame-playtest.html?campaign=1" : "/endgame-playtest.html");

function campaignPlayerExplanations() {
  if (!campaignMode) return new Map();
  try {
    const store = JSON.parse(localStorage.getItem("internet-recovery-save-files-v1") ?? "null");
    const profile = store?.activeProfileKey ? store.profiles?.[store.activeProfileKey] : null;
    return new Map(Object.entries(profile?.reflections ?? {}).map(([siteId, record]) => [siteId, String(record?.reflection ?? "").trim()]));
  } catch {
    return new Map();
  }
}

const savedExplanations = campaignPlayerExplanations();
const endgameSiteFixtures = Object.freeze(ENDGAME_SITE_FIXTURES.map((fixture) => Object.freeze({
  ...fixture,
  playerExplanation: campaignMode ? (savedExplanations.get(fixture.id) || "…") : "…",
})));

function runtimeRepairStep(siteIndex, repairIndex) {
  const step = getEndgameRepairStep(siteIndex, repairIndex);
  if (!campaignMode || step?.key !== "player-explanation") return step;
  const currentSite = endgameSiteFixtures[siteIndex];
  return Object.freeze({
    ...step,
    options: Object.freeze(step.options.map((option) => {
      const sourceSite = option.correct
        ? currentSite
        : endgameSiteFixtures.find(({ id }) => option.id.endsWith(`-from-${id}`));
      return Object.freeze({ ...option, text: sourceSite?.playerExplanation ?? option.text });
    })),
  });
}
let selectedOptionId = null;
let wrongOptionId = null;
let feedback = "";
let modal = null;
let startMenuOpen = false;
let replaySiteId = endgameSiteFixtures[0].id;
let documentSiteId = endgameSiteFixtures[0].id;
let saveStatusTimer = null;
let popupRevealTimer = null;
let popupRevealCount = 0;
let lastRenderedPhase = null;
let celebrationAnimationFrame = null;
let celebrationRunToken = 0;

const PORTRAITS = Object.freeze({
  "amy-evidence": Object.freeze({ image: ENDGAME_ASSETS.amyEvidence }),
  "amy-supportive": Object.freeze({ image: ENDGAME_ASSETS.amySupportive }),
  "amy-tools": Object.freeze({ image: ENDGAME_ASSETS.amyTools }),
  "chinmay-neutral": Object.freeze({ image: ENDGAME_ASSETS.chinmayNeutral }),
  "chinmay-fluster-1": Object.freeze({ image: ENDGAME_ASSETS.chinmayFluster1 }),
  "chinmay-fluster-3": Object.freeze({ image: ENDGAME_ASSETS.chinmayFluster3 }),
  "chinmay-relieved": Object.freeze({ image: ENDGAME_ASSETS.chinmayRelieved }),
  "auto-overdrive": Object.freeze({ image: ENDGAME_ASSETS.autoOverdrive }),
  "auto-learned": Object.freeze({ image: ENDGAME_ASSETS.autoLearned }),
});

const ENDGAME_PRELOAD_URLS = Object.freeze([
  ...ENDGAME_POPUPS.map(({ image }) => image),
  ...endgameSiteFixtures.flatMap(({ autoFrame, recoveredFrame }) => [autoFrame, recoveredFrame]),
  ...Object.values(ENDGAME_ASSETS),
]);

// Keep these Image objects alive for the standalone session so playtest jump
// controls cannot briefly expose empty art while a later beat is loading.
const endgamePreloadedImages = ENDGAME_PRELOAD_URLS.map((url) => {
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  return image;
});
const celebrationArtwork = new Image();
celebrationArtwork.decoding = "async";
celebrationArtwork.src = ENDGAME_ASSETS.technoSpriteSheet;

const TECHNO_FRAME = Object.freeze({ width: 192, height: 208 });
const TECHNO_CASCADE_ANIMATIONS = Object.freeze([
  Object.freeze({ row: 1, frameCount: 8, frameDuration: 92 }),
  Object.freeze({ row: 2, frameCount: 8, frameDuration: 92 }),
  Object.freeze({ row: 4, frameCount: 5, frameDuration: 118 }),
  Object.freeze({ row: 7, frameCount: 6, frameDuration: 108 }),
]);

function visibleBoundsForAnimation(artwork, animation) {
  const scratch = document.createElement("canvas");
  scratch.width = TECHNO_FRAME.width;
  scratch.height = TECHNO_FRAME.height;
  const context = scratch.getContext("2d", { willReadFrequently: true });
  const frames = [];
  const union = { bottom: 0, left: TECHNO_FRAME.width, right: 0, top: TECHNO_FRAME.height };
  for (let frame = 0; frame < animation.frameCount; frame += 1) {
    const bounds = { bottom: 0, left: TECHNO_FRAME.width, right: 0, top: TECHNO_FRAME.height };
    context.clearRect(0, 0, scratch.width, scratch.height);
    context.drawImage(
      artwork,
      frame * TECHNO_FRAME.width,
      animation.row * TECHNO_FRAME.height,
      TECHNO_FRAME.width,
      TECHNO_FRAME.height,
      0,
      0,
      TECHNO_FRAME.width,
      TECHNO_FRAME.height,
    );
    const pixels = context.getImageData(0, 0, scratch.width, scratch.height).data;
    for (let y = 0; y < scratch.height; y += 1) {
      for (let x = 0; x < scratch.width; x += 1) {
        if (pixels[(y * scratch.width + x) * 4 + 3] < 16) continue;
        bounds.left = Math.min(bounds.left, x);
        bounds.right = Math.max(bounds.right, x + 1);
        bounds.top = Math.min(bounds.top, y);
        bounds.bottom = Math.max(bounds.bottom, y + 1);
      }
    }
    const frameBounds = bounds.bottom > 0
      ? Object.freeze(bounds)
      : Object.freeze({ bottom: TECHNO_FRAME.height, left: 0, right: TECHNO_FRAME.width, top: 0 });
    frames.push(frameBounds);
    union.left = Math.min(union.left, frameBounds.left);
    union.right = Math.max(union.right, frameBounds.right);
    union.top = Math.min(union.top, frameBounds.top);
    union.bottom = Math.max(union.bottom, frameBounds.bottom);
  }
  return Object.freeze({ frames: Object.freeze(frames), union: Object.freeze(union) });
}

function technoSpriteMarkup(className, label, { column = 0, row = 0 } = {}) {
  return `<div class="techno-sprite ${className}" role="img" aria-label="${escapeHtml(label)}" style="--techno-column:${column};--techno-row:${row}"></div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function portraitMarkup(portrait, speaker) {
  const asset = PORTRAITS[portrait];
  if (!asset) return "";
  const style = [
    `background-image:url('${asset.image}')`,
    `background-position:${asset.position ?? "center"}`,
    `background-size:${asset.size ?? "cover"}`,
  ].join(";");
  return `<div class="character-portrait" role="img" aria-label="${escapeHtml(speaker)}" style="${style}"></div>`;
}

function storyDialogMarkup(entry, { action, buttonLabel, variant = "" } = {}) {
  return `<section class="story-dialog ${variant}" role="dialog" aria-modal="true" aria-labelledby="storyDialogHeading" data-speaker="${entry.speaker.toLowerCase()}">
    ${portraitMarkup(entry.portrait, entry.speaker)}
    <div class="story-dialog-copy">
      <small>${escapeHtml(entry.speaker)}</small>
      <h1 id="storyDialogHeading">${escapeHtml(entry.heading)}</h1>
      <p>${escapeHtml(entry.text)}</p>
      <button class="primary-button narrative-next" data-action="${action}" type="button">${escapeHtml(buttonLabel)}</button>
    </div>
  </section>`;
}

function completedStepsForSite(siteId) {
  return ENDGAME_REPAIR_STEP_KEYS.filter((stepKey) => state.completedRepairStepIds.includes(repairStepId(siteId, stepKey))).length;
}

function isSiteRestored(siteId, mode) {
  if (mode === "ready" || mode === "restored") return true;
  return completedStepsForSite(siteId) === ENDGAME_REPAIR_STEP_KEYS.length;
}

function desktopCardMarkup(site, mode) {
  const restored = isSiteRestored(site.id, mode);
  const frame = restored ? site.recoveredFrame : site.autoFrame;
  return `<article class="desktop-site-card" data-site-id="${site.id}" data-state="${restored ? "restored" : "corrupted"}">
    <div class="site-only-shot"><img src="${frame}" alt="${escapeHtml(site.name)} ${restored ? "recovered site" : "Auto over-fix"}"></div>
    <footer><img src="${site.markImage}" alt=""><b>${escapeHtml(site.name)}</b><span>${restored ? "✓ RECOVERED" : "× AUTO OVER-FIX"}</span></footer>
  </article>`;
}

function desktopMarkup(mode = "ready") {
  const corrupted = mode === "corrupted";
  const completion = corrupted ? "AUTO OVER-FIXES ACTIVE" : "10 OF 10 SITES COMPLETE";
  return `<div class="desktop-base" data-mode="${mode}">
    <nav class="desktop-shortcuts" aria-label="Recovery Desktop">
      <div class="desktop-icon"><img src="/walkthroughs/shared/recovery-icon-computer-v2.png" alt=""><b>MY<br>COMPUTER</b></div>
      <div class="desktop-icon"><img src="/walkthroughs/shared/recovery-icon-documents-v1.png" alt=""><b>DOCUMENTS</b></div>
      <div class="desktop-icon"><img src="/walkthroughs/shared/recovery-icon-trash-v2.png" alt=""><b>TRASH</b></div>
    </nav>
    <section class="recovery-window${corrupted ? " corrupted-window" : ""}" aria-label="Recovery Browser">
      <header class="window-titlebar"><span>▣ RECOVERY BROWSER</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      <div class="desktop-status-line"><strong>${completion}</strong><span>${corrupted ? "THE SAVED DOCUMENTS ARE SCRAMBLED" : "TEN LESSON DOCUMENTS SAVED"}</span></div>
      <div class="endgame-site-grid">${endgameSiteFixtures.map((site) => desktopCardMarkup(site, mode)).join("")}</div>
    </section>
    <footer class="taskbar"><button data-action="toggle-start-menu" type="button" aria-haspopup="menu" aria-expanded="${startMenuOpen}">START</button><span>▣ Recovery Browser</span><i>INTERNET RECOVERY 98</i><time>10:24 AM</time></footer>
    ${startMenuOpen ? `<section class="start-menu" role="menu" aria-label="Start menu">
      <div class="start-menu-brand">RECOVERY<br>OS 98</div>
      <div class="start-menu-items">
        <button data-action="save-endgame" type="button" role="menuitem">💾 <span><b>Save game</b><small>Save the desktop recovery</small></span></button>
        <button data-action="return-recovery-browser" type="button" role="menuitem">▣ <span><b>Recovery map</b><small>Return to all ten sites</small></span></button>
        <button data-action="review-lessons" type="button" role="menuitem">📁 <span><b>Documents</b><small>Review saved lessons</small></span></button>
        <button data-action="replay-incident" type="button" role="menuitem">↻ <span><b>Restart endgame</b><small>Replay the desktop incident</small></span></button>
      </div>
    </section>` : ""}
  </div>`;
}

function readyMarkup() {
  const entry = ENDGAME_COPY.ready[state.readyDialogueIndex];
  const last = state.readyDialogueIndex === ENDGAME_COPY.ready.length - 1;
  return `${desktopMarkup("ready")}
    ${technoSpriteMarkup("ready-techno", "Techno celebrates all ten recovered sites", { column: 2, row: 4 })}
    ${storyDialogMarkup(entry, { action: "advance-ready", buttonLabel: last ? "Apply Auto's update" : "Continue" })}`;
}

function takeoverMarkup() {
  const entry = ENDGAME_COPY.takeover[state.takeoverDialogueIndex];
  return `${desktopMarkup("corrupted")}
    ${storyDialogMarkup(entry, { action: "advance-takeover", buttonLabel: "Continue" })}`;
}

function popupArticleMarkup(popup, { revealComplete = false, active = false, settled = false } = {}) {
  const positionIndex = ENDGAME_POPUPS.findIndex(({ id }) => id === popup.id);
  return `<article class="auto-popup popup-position-${positionIndex}${settled ? " takeover-settled" : ""}" role="${active ? "dialog" : "presentation"}" aria-modal="${active ? "true" : "false"}" aria-labelledby="popup-${popup.id}-title" style="--popup-z:${80 + positionIndex}" ${active ? "" : "inert aria-hidden=\"true\""}>
    <header><strong id="popup-${popup.id}-title">${escapeHtml(popup.title)}</strong><button class="popup-close" data-action="close-popup" data-popup-id="${popup.id}" type="button" aria-label="${escapeHtml(popupAccessibleCloseName(popup))}" ${revealComplete ? "" : "disabled aria-disabled=\"true\""}>×</button></header>
    <div class="auto-popup-body"><img src="${popup.image}" alt=""><p>${escapeHtml(popup.body)}</p></div>
  </article>`;
}

function popupStackMarkup() {
  const revealComplete = popupRevealCount === ENDGAME_POPUPS.length;
  const revealed = ENDGAME_POPUPS.slice(0, popupRevealCount);
  const remaining = revealed.filter(({ id }) => !state.closedPopupIds.includes(id));
  const activePopupId = revealComplete ? remaining.at(-1)?.id : null;
  return `${desktopMarkup("corrupted")}
    <section class="popup-swarm" aria-label="Auto pop-up swarm" aria-live="polite">
      ${remaining.map((popup) => popupArticleMarkup(popup, { revealComplete, active: popup.id === activePopupId, settled: revealComplete })).join("")}
    </section>`;
}

function enablePopupClosing() {
  const popups = [...stage.querySelectorAll(".auto-popup")];
  const activePopup = popups.at(-1);
  for (const popup of popups) {
    popup.classList.add("takeover-settled");
    const close = popup.querySelector(".popup-close");
    close.disabled = false;
    close.removeAttribute("aria-disabled");
    const active = popup === activePopup;
    popup.setAttribute("role", active ? "dialog" : "presentation");
    popup.setAttribute("aria-modal", String(active));
    if (active) {
      popup.removeAttribute("inert");
      popup.removeAttribute("aria-hidden");
      close.focus();
    } else {
      popup.setAttribute("inert", "");
      popup.setAttribute("aria-hidden", "true");
    }
  }
}

function scheduleNextPopupReveal() {
  clearTimeout(popupRevealTimer);
  popupRevealTimer = null;
  if (endgamePhase(state) !== "endgame_popup_swarm" || popupRevealCount >= ENDGAME_POPUPS.length) return;
  popupRevealTimer = setTimeout(() => {
    popupRevealCount += 1;
    const popup = ENDGAME_POPUPS[popupRevealCount - 1];
    const swarm = stage.querySelector(".popup-swarm");
    if (!swarm) return;
    swarm.insertAdjacentHTML("beforeend", popupArticleMarkup(popup));
    announce(`${popup.title} appeared.`);
    if (popupRevealCount === ENDGAME_POPUPS.length) enablePopupClosing();
    else scheduleNextPopupReveal();
  }, 1000);
}

function instructionIntroMarkup() {
  const entry = ENDGAME_COPY.instructionIntro[state.instructionIntroIndex];
  const last = state.instructionIntroIndex === ENDGAME_COPY.instructionIntro.length - 1;
  return `${desktopMarkup("corrupted")}
    ${storyDialogMarkup(entry, { action: "advance-intro", buttonLabel: last ? "Open Auto Instruction Builder" : "Continue" })}`;
}

function restorationRibbonMarkup() {
  return `<div class="restoration-ribbon" aria-label="Saved document restoration status">${endgameSiteFixtures.map((site) => {
    const repairCount = completedStepsForSite(site.id);
    const restored = repairCount === ENDGAME_REPAIR_STEP_KEYS.length;
    return `<div class="ribbon-site" data-state="${restored ? "restored" : "corrupted"}" title="${escapeHtml(site.name)}: ${restored ? "document restored" : "document scrambled"}">
      <img src="${restored ? site.recoveredFrame : site.autoFrame}" alt="">
    </div>`;
  }).join("")}</div>`;
}

function scrambleText(text, offset) {
  const words = String(text).split(/\s+/u);
  if (words.length < 4) return words.reverse().join(" ");
  const rotation = (offset * 3 + 5) % words.length;
  return [...words.slice(rotation), ...words.slice(0, rotation)]
    .map((word, index) => index % 5 === 2 ? `${word} ▓` : word)
    .join(" ");
}

function savedPanelMarkup({ label, text, restored, active, index }) {
  const explanation = label === "YOUR SAVED EXPLANATION";
  return `<article class="saved-panel${explanation ? " saved-explanation-panel" : ""}" data-state="${restored ? "restored" : "scrambled"}" data-active="${active ? "true" : "false"}">
    <small>${restored ? "✓ " : "○ "}${escapeHtml(label)}</small>
    <p>${escapeHtml(restored ? text : scrambleText(text, index))}</p>
  </article>`;
}

function builderMarkup() {
  const fixture = endgameSiteFixtures[state.currentLessonIndex];
  const step = runtimeRepairStep(state.currentLessonIndex, state.currentRepairIndex);
  const siteRepairCount = completedStepsForSite(fixture.id);
  const lessonRestored = siteRepairCount >= 1;
  const explanationRestored = siteRepairCount >= 2;
  const boundaryRestored = siteRepairCount >= 3;
  const selected = step?.options.find(({ id }) => id === selectedOptionId);
  const siteComplete = state.awaitingNextSite;
  const isLastSite = state.currentLessonIndex === endgameSiteFixtures.length - 1;
  return `${desktopMarkup("corrupted")}
    <section class="builder-window" aria-labelledby="builderTitle">
      <header class="window-titlebar"><span id="builderTitle">▣ AUTO INSTRUCTION BUILDER</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      ${restorationRibbonMarkup()}
      <div class="builder-layout">
        <section class="saved-document" aria-labelledby="currentSiteTitle">
          <div class="document-site"><img src="${fixture.markImage}" alt=""><h1 id="currentSiteTitle">${escapeHtml(fixture.name)}</h1></div>
          ${savedPanelMarkup({ label: "AUTO'S SAVED LESSON", text: fixture.savedLesson, restored: lessonRestored, active: !siteComplete && state.currentRepairIndex === 0, index: state.currentLessonIndex })}
          ${savedPanelMarkup({ label: "YOUR SAVED EXPLANATION", text: fixture.playerExplanation, restored: explanationRestored, active: !siteComplete && state.currentRepairIndex === 1, index: state.currentLessonIndex + 2 })}
          ${savedPanelMarkup({ label: "EXTRA INSTRUCTION", text: fixture.boundaryOptions.find(({ correct }) => correct).text, restored: boundaryRestored, active: !siteComplete && state.currentRepairIndex === 2, index: state.currentLessonIndex + 4 })}
        </section>
        ${siteComplete ? `<section class="document-complete" aria-labelledby="choiceTitle">
          <small>DOCUMENT RESTORED</small>
          <h2 id="choiceTitle">All three parts are back in place.</h2>
          <p>Auto's lesson, your explanation, and the extra instruction are saved together.</p>
          <button class="primary-button" data-action="advance-site" type="button">${isLastSite ? "Continue" : "Move on to next site"}</button>
        </section>` : `<section class="instruction-choices" aria-labelledby="choiceTitle">
          <h2 id="choiceTitle">${escapeHtml(step.question)}</h2>
          <div class="option-list">${step.options.map((option, optionIndex) => `<button class="instruction-option${selectedOptionId === option.id ? " selected" : ""}${wrongOptionId === option.id ? " incorrect" : ""}" type="button" draggable="true" data-option-id="${option.id}" aria-pressed="${selectedOptionId === option.id ? "true" : "false"}"><span>${optionIndex + 1}</span><b>${escapeHtml(option.text)}</b></button>`).join("")}</div>
          <div id="instructionDropTarget" class="instruction-drop-target${selectedOptionId ? " has-selection" : ""}" tabindex="0" aria-label="Drop the recovered line here">${selected ? escapeHtml(selected.text) : "DROP THE RECOVERED LINE HERE"}</div>
          <button class="primary-button add-instruction" data-action="add-instruction" type="button" ${selectedOptionId ? "" : "disabled"}>${state.currentRepairIndex === 2 ? "Add this instruction" : "Restore this line"}</button>
          <p class="builder-feedback" role="status">${feedback ? `<strong>AMY:</strong> ${escapeHtml(feedback)}` : "Select one line, then restore it. You can also drag a line into the box."}</p>
        </section>`}
      </div>
      <footer class="builder-receipt">
        <div><span data-done="${lessonRestored}">${lessonRestored ? "✓" : "○"} ORIGINAL AUTO LESSON</span><span data-done="${explanationRestored}">${explanationRestored ? "✓" : "○"} YOUR EXPLANATION</span><span data-done="${boundaryRestored}">${boundaryRestored ? "✓" : "○"} EXTRA INSTRUCTION</span></div>
      </footer>
    </section>`;
}

function finalInstructionMarkup() {
  const entry = ENDGAME_COPY.final[state.finalDialogueIndex];
  const last = state.finalDialogueIndex === ENDGAME_COPY.final.length - 1;
  return `${desktopMarkup("restored")}
    ${storyDialogMarkup(entry, { action: last ? "send-final" : "advance-final", buttonLabel: last ? "Send final instructions to Auto" : "Continue", variant: "final-story-dialog" })}`;
}

function restoredMarkup() {
  const entry = Object.freeze({ speaker: "Auto", portrait: "auto-learned", heading: "I UNDERSTAND", text: ENDGAME_COPY.autoReceipt });
  return `${desktopMarkup("restored")}
    ${storyDialogMarkup(entry, { action: "continue-restored", buttonLabel: "Continue to the restored desktop", variant: "neutral-auto-dialog" })}`;
}

function waterfallMarkup() {
  return `<div class="techno-waterfall" aria-hidden="true"><canvas class="solitaire-techno-canvas" width="1440" height="900"></canvas>${technoSpriteMarkup("static-celebration-techno", "", { column: 2, row: 4 })}</div>`;
}

function stopCelebrationFill() {
  celebrationRunToken += 1;
  cancelAnimationFrame(celebrationAnimationFrame);
  celebrationAnimationFrame = null;
}

function startCelebrationFill() {
  stopCelebrationFill();
  if (reduceMotion.checked || state.celebrationStopped) return;
  const canvas = stage.querySelector(".solitaire-techno-canvas");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;
  const runToken = celebrationRunToken;
  const trajectories = [];
  let launchIndex = 0;
  let previousTime = performance.now();
  let nextLaunchAt = previousTime;
  let randomState = 0x98c0ffee;
  const random = () => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 0x100000000;
  };
  const animationBounds = TECHNO_CASCADE_ANIMATIONS.map((animation) => visibleBoundsForAnimation(celebrationArtwork, animation));

  const launchTechno = () => {
    const width = 148;
    const height = width * TECHNO_FRAME.height / TECHNO_FRAME.width;
    const animationIndex = launchIndex % TECHNO_CASCADE_ANIMATIONS.length;
    const animation = TECHNO_CASCADE_ANIMATIONS[animationIndex];
    const visibleBounds = animationBounds[animationIndex];
    const anchorPattern = [0, 1, .5, .25, .75, .4, .6, .12, .88];
    const anchor = anchorPattern[launchIndex % anchorPattern.length];
    const jitter = (random() - .5) * canvas.width * .12;
    const startsAtLeftEdge = anchor === 0;
    const startsAtRightEdge = anchor === 1;
    const x = startsAtLeftEdge
      ? -width
      : startsAtRightEdge
        ? canvas.width
        : Math.max(-width * .25, Math.min(canvas.width - width * .75, canvas.width * anchor - width / 2 + jitter));
    const direction = startsAtRightEdge || (!startsAtLeftEdge && random() < .5) ? -1 : 1;
    trajectories.push({
      x,
      y: -(visibleBounds.union.bottom / TECHNO_FRAME.height * height) - random() * height * .16,
      vx: direction * (320 + random() * 190),
      vy: 40 + random() * 130,
      gravity: 690 + random() * 210,
      bounce: .74 + random() * .09,
      floor: canvas.height,
      width,
      height,
      animation,
      frameBounds: visibleBounds.frames,
      visibleBottomOffset: visibleBounds.union.bottom / TECHNO_FRAME.height * height,
      animationOffset: launchIndex * 67,
      nextStampAt: 0,
    });
    launchIndex += 1;
  };

  const drawTechno = (trajectory, now) => {
    const frame = Math.floor((now + trajectory.animationOffset) / trajectory.animation.frameDuration)
      % trajectory.animation.frameCount;
    const frameBottom = trajectory.frameBounds[frame].bottom / TECHNO_FRAME.height * trajectory.height;
    const baselineCorrection = trajectory.visibleBottomOffset - frameBottom;
    context.drawImage(
      celebrationArtwork,
      frame * TECHNO_FRAME.width,
      trajectory.animation.row * TECHNO_FRAME.height,
      TECHNO_FRAME.width,
      TECHNO_FRAME.height,
      trajectory.x,
      trajectory.y + baselineCorrection,
      trajectory.width,
      trajectory.height,
    );
  };

  const animate = (now) => {
    if (runToken !== celebrationRunToken || !canvas.isConnected) return;
    const delta = Math.min(.034, Math.max(.008, (now - previousTime) / 1000));
    previousTime = now;
    while (now >= nextLaunchAt) {
      launchTechno();
      nextLaunchAt += 420 + (launchIndex % 4) * 70;
    }
    for (const trajectory of trajectories) {
      trajectory.x += trajectory.vx * delta;
      trajectory.y += trajectory.vy * delta;
      trajectory.vy += trajectory.gravity * delta;
      if (trajectory.y + trajectory.visibleBottomOffset >= trajectory.floor && trajectory.vy > 0) {
        trajectory.y = trajectory.floor - trajectory.visibleBottomOffset;
        trajectory.vy = -Math.max(205, Math.abs(trajectory.vy) * trajectory.bounce);
      }
      if (now >= trajectory.nextStampAt) {
        drawTechno(trajectory, now);
        trajectory.nextStampAt = now + 48;
      }
    }
    for (let index = trajectories.length - 1; index >= 0; index -= 1) {
      const trajectory = trajectories[index];
      const exitedRight = trajectory.vx > 0 && trajectory.x > canvas.width + trajectory.width;
      const exitedLeft = trajectory.vx < 0 && trajectory.x < -trajectory.width * 2;
      if (exitedRight || exitedLeft) trajectories.splice(index, 1);
    }
    celebrationAnimationFrame = requestAnimationFrame(animate);
  };

  const begin = () => {
    if (runToken !== celebrationRunToken || !canvas.isConnected) return;
    launchTechno();
    launchTechno();
    celebrationAnimationFrame = requestAnimationFrame(animate);
  };
  if (celebrationArtwork.complete && celebrationArtwork.naturalWidth > 0) begin();
  else celebrationArtwork.decode().then(begin).catch(() => {});
}

function celebrationMarkup() {
  if (!state.celebrationStopped) {
    return `${desktopMarkup("restored")}
      <section class="celebration-layer" data-action="stop-celebration" aria-label="Techno celebration. Click to stop.">
        ${waterfallMarkup()}
        <div class="celebration-prompt" role="status"><h1>RECOVERY DESKTOP RESTORED</h1><p>Click anywhere to stop the celebration.</p></div>
      </section>`;
  }
  const entry = ENDGAME_COPY.ending[state.endingDialogueIndex];
  return `${desktopMarkup("restored")}
    ${storyDialogMarkup(entry, { action: "advance-ending", buttonLabel: state.endingDialogueIndex === ENDGAME_COPY.ending.length - 1 ? "Continue" : "Continue", variant: "ending-story-dialog" })}`;
}

function epilogueMarkup() {
  return `${desktopMarkup("restored")}
    <section class="techno-final-dialog" role="dialog" aria-modal="true" aria-labelledby="endgameCompleteTitle">
      ${technoSpriteMarkup("techno-final-sprite", "Techno celebrates with her ball", { column: 2, row: 4 })}
      <div><small>ENDGAME COMPLETE</small><h1 id="endgameCompleteTitle">${escapeHtml(ENDGAME_COPY.technoStatus)}</h1>
        <div class="postgame-actions"><button data-action="review-lessons" type="button">Review saved lessons</button><button data-action="replay-site" type="button">Replay recovered sites</button><button data-action="replay-incident" type="button">Replay desktop incident</button><button class="primary-button" data-action="finish-game" type="button">Finish game</button></div>
      </div>
    </section>`;
}

function finishedMarkup() {
  return `${desktopMarkup("restored")}
    <section class="finished-window" aria-labelledby="finishedTitle">${technoSpriteMarkup("finished-techno", "Techno with her ball", { column: 2, row: 4 })}<small>ENDGAME COMPLETE</small><h1 id="finishedTitle">Internet Recovery 98 is stable.</h1><p>Your recovered sites and saved lessons are ready whenever you want to return.</p><button class="primary-button" data-action="return-epilogue" type="button">Return to ending</button></section>`;
}

function unavailableMarkup() {
  return `<section class="unavailable-window"><h1>Endgame unavailable</h1><p>Recover all ten sites and save their lessons to unlock the final desktop recovery.</p></section>`;
}

function documentsModalMarkup() {
  const site = endgameSiteFixtures.find(({ id }) => id === documentSiteId) ?? endgameSiteFixtures[0];
  return `<section class="playtest-modal" role="dialog" aria-modal="true" aria-labelledby="documentsModalTitle"><div class="modal-window documents-modal"><header class="window-titlebar"><span id="documentsModalTitle">▣ Documents — Saved lessons</span><button class="modal-close" data-action="close-modal" type="button" aria-label="Close saved lessons">×</button></header><div class="fixture-documents"><nav aria-label="Saved lessons">${endgameSiteFixtures.map((candidate) => `<button data-action="choose-document-site" data-site-id="${candidate.id}" type="button" aria-pressed="${candidate.id === site.id ? "true" : "false"}"><img src="${candidate.markImage}" alt=""><span>${escapeHtml(candidate.name)}</span></button>`).join("")}</nav><article><div><img src="${site.markImage}" alt=""><h2>${escapeHtml(site.name)}</h2></div><small>AUTO'S LESSON</small><p>${escapeHtml(site.savedLesson)}</p><small>PLAYER EXPLANATION</small><p>${escapeHtml(site.playerExplanation)}</p></article></div></div></section>`;
}

function replayModalMarkup() {
  const site = endgameSiteFixtures.find(({ id }) => id === replaySiteId) ?? endgameSiteFixtures[0];
  return `<section class="playtest-modal" role="dialog" aria-modal="true" aria-labelledby="replayModalTitle"><div class="modal-window replay-modal"><header class="window-titlebar"><span id="replayModalTitle">▣ Recovered Site Replay</span><button class="modal-close" data-action="close-modal" type="button" aria-label="Close recovered site replay">×</button></header><div class="replay-site-tabs">${endgameSiteFixtures.map((candidate) => `<button data-action="choose-replay-site" data-site-id="${candidate.id}" type="button" aria-pressed="${candidate.id === site.id ? "true" : "false"}"><img src="${candidate.markImage}" alt="">${escapeHtml(candidate.name)}</button>`).join("")}</div><div class="replay-comparison"><figure><img src="${site.autoFrame}" alt="${escapeHtml(site.name)} Auto over-fix"><figcaption>AUTO OVER-FIX</figcaption></figure><figure><img src="${site.recoveredFrame}" alt="${escapeHtml(site.name)} recovered"><figcaption>✓ RECOVERED</figcaption></figure></div></div></section>`;
}

function renderModal() {
  if (modal === "documents") return documentsModalMarkup();
  if (modal === "replay") return replayModalMarkup();
  return "";
}

function render() {
  const phase = endgamePhase(state);
  if (phase !== lastRenderedPhase) {
    clearTimeout(popupRevealTimer);
    popupRevealTimer = null;
    stopCelebrationFill();
    popupRevealCount = phase === "endgame_popup_swarm"
      ? (state.closedPopupIds.length > 0 ? ENDGAME_POPUPS.length : 1)
      : 0;
    lastRenderedPhase = phase;
  }
  jumpSelect.value = phase === "finished" ? "endgame_complete" : phase;
  stage.dataset.phase = phase;
  stage.dataset.reducedMotion = reduceMotion.checked ? "true" : "false";
  if (phase === "endgame_ready") stage.innerHTML = readyMarkup();
  else if (phase === "endgame_desktop_corrupted") stage.innerHTML = takeoverMarkup();
  else if (phase === "endgame_popup_swarm") stage.innerHTML = popupStackMarkup();
  else if (phase === "endgame_instruction_intro") stage.innerHTML = instructionIntroMarkup();
  else if (phase === "endgame_lesson_lock") stage.innerHTML = builderMarkup();
  else if (phase === "endgame_final_instruction") stage.innerHTML = finalInstructionMarkup();
  else if (phase === "endgame_desktop_restored") stage.innerHTML = restoredMarkup();
  else if (phase === "endgame_techno_celebration") stage.innerHTML = celebrationMarkup();
  else if (phase === "endgame_complete") stage.innerHTML = epilogueMarkup();
  else if (phase === "finished") stage.innerHTML = finishedMarkup();
  else stage.innerHTML = unavailableMarkup();
  stage.insertAdjacentHTML("beforeend", renderModal());
  if (phase === "endgame_popup_swarm") scheduleNextPopupReveal();
  if (phase === "endgame_techno_celebration" && !state.celebrationStopped) startCelebrationFill();
  else stopCelebrationFill();
  skipButton.disabled = phase === "finished" || phase === "unavailable";
  requestAnimationFrame(() => {
    if (phase === "endgame_popup_swarm" && popupRevealCount === ENDGAME_POPUPS.length) stage.querySelector('.auto-popup[role="dialog"] .popup-close')?.focus();
    else if (modal) stage.querySelector(".modal-close")?.focus();
    else stage.querySelector(".story-dialog .primary-button, .techno-final-dialog .primary-button")?.focus();
  });
}

function setSaveStatus(message) {
  clearTimeout(saveStatusTimer);
  saveStatus.textContent = message;
  saveStatusTimer = setTimeout(() => { saveStatus.textContent = "Endgame saved locally"; }, 1800);
}

function saveState(nextState, message = "Endgame saved locally") {
  state = persistence.save(nextState);
  selectedOptionId = null;
  wrongOptionId = null;
  feedback = "";
  setSaveStatus(message);
  render();
}

function announce(message) {
  announcement.textContent = "";
  requestAnimationFrame(() => { announcement.textContent = message; });
}

function submitSelectedInstruction(optionId = selectedOptionId) {
  const fixture = endgameSiteFixtures[state.currentLessonIndex];
  const currentStepIndex = state.currentRepairIndex;
  if (!fixture || !optionId) return;
  const outcome = answerCurrentLesson(state, { optionId, siteId: fixture.id });
  if (!outcome.correct) {
    wrongOptionId = optionId;
    feedback = ENDGAME_COPY.wrongHints[currentStepIndex];
    announce(feedback);
    render();
    return;
  }
  const completed = outcome.state.completedRepairStepIds.length;
  const message = currentStepIndex === 2
    ? `${fixture.name} document restored.`
    : `${fixture.name}: part ${currentStepIndex + 1} of 3 restored.`;
  announce(message);
  saveState(outcome.state, `${message} ${completed} of 30 repairs complete.`);
}

function skipCurrentStep() {
  const phase = endgamePhase(state);
  if (phase === "endgame_ready") saveState(advanceReadyDialogue(state), "Ready dialogue skipped");
  else if (phase === "endgame_desktop_corrupted") saveState(advanceTakeoverDialogue(state), "Takeover dialogue skipped");
  else if (phase === "endgame_popup_swarm") {
    let nextState = state;
    for (const popup of [...ENDGAME_POPUPS].reverse()) nextState = closeTopPopup(nextState, popup.id);
    saveState(nextState, "Auto pop-up takeover skipped");
  } else if (phase === "endgame_instruction_intro") saveState(advanceInstructionIntro(state), "Builder introduction skipped");
  else if (phase === "endgame_lesson_lock") {
    if (state.awaitingNextSite) saveState(advanceToNextSite(state), "Next saved document opened");
    else {
      const step = runtimeRepairStep(state.currentLessonIndex, state.currentRepairIndex);
      submitSelectedInstruction(step?.options.find(({ correct }) => correct)?.id);
    }
  } else if (phase === "endgame_final_instruction") {
    const atFinalDialogue = state.finalDialogueIndex === ENDGAME_COPY.final.length - 1;
    saveState(atFinalDialogue ? sendFinalInstruction(state) : advanceFinalDialogue(state), "Final instruction step skipped");
  } else if (phase === "endgame_desktop_restored") saveState(restoreDesktop(state), "Desktop-restored receipt skipped");
  else if (phase === "endgame_techno_celebration") {
    saveState(state.celebrationStopped ? advanceEndingDialogue(state) : stopCelebration(state), "Celebration step skipped");
  }
}

stage.addEventListener("click", (event) => {
  const option = event.target.closest(".instruction-option");
  if (option) {
    selectedOptionId = option.dataset.optionId;
    wrongOptionId = null;
    feedback = "";
    render();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  switch (action.dataset.action) {
    case "advance-ready": saveState(advanceReadyDialogue(state), "Endgame story advanced"); break;
    case "advance-takeover": saveState(advanceTakeoverDialogue(state)); break;
    case "close-popup": {
      const popup = ENDGAME_POPUPS.find(({ id }) => id === action.dataset.popupId);
      saveState(closeTopPopup(state, action.dataset.popupId), `${popup?.title ?? "Pop-up"} closed`);
      announce(`${popup?.title ?? "Pop-up"} closed.`);
      break;
    }
    case "advance-intro": saveState(advanceInstructionIntro(state), "Instruction Builder story advanced"); break;
    case "add-instruction": submitSelectedInstruction(); break;
    case "advance-site": saveState(advanceToNextSite(state), "Next saved document opened"); break;
    case "advance-final": saveState(advanceFinalDialogue(state)); break;
    case "send-final": saveState(sendFinalInstruction(state), "Bounded instruction sent"); break;
    case "continue-restored": saveState(restoreDesktop(state), "Recovery Desktop restored"); break;
    case "stop-celebration": saveState(stopCelebration(state), "Techno celebration paused"); break;
    case "advance-ending": saveState(advanceEndingDialogue(state), "Ending advanced"); break;
    case "review-lessons": modal = "documents"; render(); break;
    case "replay-site": modal = "replay"; render(); break;
    case "choose-replay-site": replaySiteId = action.dataset.siteId; render(); break;
    case "choose-document-site": documentSiteId = action.dataset.siteId; render(); break;
    case "close-modal": modal = null; render(); break;
    case "replay-incident": saveState(replayDesktopIncident(state), "Desktop incident replay started"); break;
    case "toggle-start-menu": startMenuOpen = !startMenuOpen; render(); break;
    case "save-endgame": startMenuOpen = false; saveState(state, "Endgame saved locally"); break;
    case "return-recovery-browser": location.assign("/playable-missions.html"); break;
    case "finish-game": {
      state = persistence.save(finishEndgame(state));
      location.assign("/playable-missions.html?endgame=complete");
      break;
    }
    case "return-epilogue": saveState(returnToEpilogue(state)); break;
    default: break;
  }
});

stage.addEventListener("keydown", (event) => {
  if ((event.key !== "Enter" && event.key !== " ") || event.repeat) return;
  const button = event.target.closest("button:not(:disabled)");
  if (!button || !stage.contains(button)) return;
  event.preventDefault();
  button.click();
});

stage.addEventListener("dragstart", (event) => {
  const option = event.target.closest(".instruction-option");
  if (!option) return;
  selectedOptionId = option.dataset.optionId;
  event.dataTransfer?.setData("text/plain", selectedOptionId);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
});

stage.addEventListener("dragover", (event) => {
  if (!event.target.closest("#instructionDropTarget")) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
});

stage.addEventListener("drop", (event) => {
  if (!event.target.closest("#instructionDropTarget")) return;
  event.preventDefault();
  submitSelectedInstruction(event.dataTransfer?.getData("text/plain") || selectedOptionId);
});

let pointerDraggedOptionId = null;

stage.addEventListener("pointerdown", (event) => {
  const option = event.target.closest(".instruction-option");
  if (!option) return;
  pointerDraggedOptionId = option.dataset.optionId;
  option.setPointerCapture?.(event.pointerId);
});

stage.addEventListener("pointerup", (event) => {
  if (!pointerDraggedOptionId) return;
  const dropTarget = stage.querySelector("#instructionDropTarget");
  const draggedOptionId = pointerDraggedOptionId;
  pointerDraggedOptionId = null;
  if (!dropTarget) return;
  const bounds = dropTarget.getBoundingClientRect();
  const droppedInside = event.clientX >= bounds.left
    && event.clientX <= bounds.right
    && event.clientY >= bounds.top
    && event.clientY <= bounds.bottom;
  if (droppedInside) submitSelectedInstruction(draggedOptionId);
});

stage.addEventListener("pointercancel", () => {
  pointerDraggedOptionId = null;
});

jumpSelect.addEventListener("change", () => {
  modal = null;
  saveState(jumpToEndgameBeat(jumpSelect.value), `Jumped to ${jumpSelect.selectedOptions[0].textContent}`);
});

skipButton.addEventListener("click", skipCurrentStep);

reduceMotion.addEventListener("change", () => {
  stage.dataset.reducedMotion = reduceMotion.checked ? "true" : "false";
  setSaveStatus(reduceMotion.checked ? "Reduced motion preview on" : "Default motion preview on");
  render();
});

resetButton.addEventListener("click", () => {
  if (!confirm("Reset only this endgame run? The ten recovered sites and saved lessons will not be changed.")) return;
  state = persistence.reset();
  selectedOptionId = null;
  wrongOptionId = null;
  feedback = "";
  modal = null;
  setSaveStatus("Endgame reset");
  render();
});

function fitStage() {
  const toolbarHeight = document.querySelector(".playtest-toolbar").getBoundingClientRect().height;
  const scale = Math.min(innerWidth / 1440, Math.max(0.1, (innerHeight - toolbarHeight) / 900));
  stageShell.style.width = `${1440 * scale}px`;
  stageShell.style.height = `${900 * scale}px`;
  stage.style.transform = `scale(${scale})`;
}

addEventListener("resize", fitStage);
fitStage();
render();
saveStatus.textContent = state.fixtureId === ENDGAME_PLAYTEST_FIXTURE_ID ? "Endgame resumed" : "Endgame ready";
