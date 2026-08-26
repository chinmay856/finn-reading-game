import {
  ENDGAME_ASSETS,
  ENDGAME_COPY,
  ENDGAME_PLAYTEST_FIXTURE_ID,
  ENDGAME_POPUPS,
  ENDGAME_SITE_FIXTURES,
  popupAccessibleCloseName,
} from "./apps/internet-recovery/endgame-playtest-content.js";
import {
  advanceScopeDialogue,
  advanceTakeoverDialogue,
  answerCurrentLesson,
  closeTopPopup,
  completeCelebration,
  createEndgamePlaytestPersistence,
  endgamePhase,
  finishEndgame,
  jumpToEndgameBeat,
  openInstructionBuilder,
  replayDesktopIncident,
  restoreDesktop,
  returnToEpilogue,
  sendFinalInstruction,
  startEndgame,
} from "./apps/internet-recovery/endgame-playtest-state.js";

const stage = document.querySelector("#endgameStage");
const stageShell = document.querySelector("#stageShell");
const announcement = document.querySelector("#endgameAnnouncement");
const saveStatus = document.querySelector("#playtestSaveStatus");
const jumpSelect = document.querySelector("#jumpToBeat");
const reduceMotion = document.querySelector("#reduceMotion");
const resetButton = document.querySelector("#resetPlaytest");
const persistence = createEndgamePlaytestPersistence();

let state = persistence.load();
let selectedOptionId = null;
let wrongOptionId = null;
let feedback = "";
let modal = null;
let replaySiteId = ENDGAME_SITE_FIXTURES[0].id;
let documentSiteId = ENDGAME_SITE_FIXTURES[0].id;
let saveStatusTimer = null;

const PORTRAITS = Object.freeze({
  "amy-evidence": Object.freeze({ image: ENDGAME_ASSETS.amyEvidence }),
  "amy-supportive": Object.freeze({ image: ENDGAME_ASSETS.amySupportive }),
  "amy-tools": Object.freeze({ image: ENDGAME_ASSETS.amyTools }),
  "chinmay-ceo": Object.freeze({ image: ENDGAME_ASSETS.chinmayCeo }),
  "chinmay-fluster-1": Object.freeze({ image: ENDGAME_ASSETS.chinmayFluster1 }),
  "chinmay-fluster-2": Object.freeze({ image: ENDGAME_ASSETS.chinmayFluster2 }),
  "auto-overdrive": Object.freeze({ image: ENDGAME_ASSETS.autoSheet, position: "50% 100%", size: "300% 200%" }),
  "auto-learned": Object.freeze({ image: ENDGAME_ASSETS.autoSheet, position: "50% 0%", size: "300% 200%" }),
});

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
  const style = [
    `background-image:url('${asset.image}')`,
    `background-position:${asset.position ?? "center"}`,
    `background-size:${asset.size ?? "cover"}`,
  ].join(";");
  return `<div class="character-portrait" role="img" aria-label="${escapeHtml(speaker)}" style="${style}"></div>`;
}

function storyMessageMarkup(entry, { compact = false } = {}) {
  return `<article class="story-message${compact ? " compact" : ""}" data-speaker="${entry.speaker.toLowerCase()}">
    ${portraitMarkup(entry.portrait, entry.speaker)}
    <div><small>${escapeHtml(entry.speaker)}</small><p>${escapeHtml(entry.text)}</p></div>
  </article>`;
}

function isSiteRestored(siteId, mode) {
  if (mode === "ready" || mode === "restored") return true;
  return state.lockedSiteIds.includes(siteId);
}

function desktopCardMarkup(site, mode) {
  const restored = isSiteRestored(site.id, mode);
  const frame = restored ? site.securedFrame : site.superFrame;
  const status = restored ? "✓ RECOVERED" : "× AUTO OVER-FIX";
  return `<article class="desktop-site-card" data-site-id="${site.id}" data-state="${restored ? "restored" : "corrupted"}">
    <img class="desktop-card-shot" src="${frame}" alt="${escapeHtml(site.name)} ${restored ? "secured" : "Auto over-fix"} thumbnail">
    <footer><img src="${site.markImage}" alt=""><b>${escapeHtml(site.name)}</b><span>${status}</span></footer>
  </article>`;
}

function desktopMarkup(mode = "ready") {
  const corrupted = mode === "corrupted";
  const title = corrupted ? "AUTO'S COMPUTER" : "Recovery Browser — All sites recovered";
  const start = corrupted ? "AUTO" : "START";
  const humanStatus = corrupted ? "HUMAN INPUT: NOT NEEDED" : "HUMAN INPUT: READY";
  const completion = corrupted ? "COMPUTER RESERVED FOR AI" : "10 OF 10 SITES COMPLETE";
  return `<div class="desktop-base" data-mode="${mode}">
    <nav class="desktop-shortcuts" aria-label="Recovery Desktop">
      <div class="desktop-icon"><img src="/walkthroughs/shared/recovery-icon-computer-v2.png" alt=""><b>MY<br>COMPUTER</b></div>
      <div class="desktop-icon documents-icon"><img src="/walkthroughs/shared/recovery-icon-documents-v1.png" alt=""><b>DOCUMENTS</b>${corrupted ? '<span>INSTRUCTIONS_<br>COMBINED.txt</span>' : ""}</div>
      <div class="desktop-icon"><img src="/walkthroughs/shared/recovery-icon-trash-v2.png" alt=""><b>TRASH</b></div>
    </nav>
    <section class="recovery-window${corrupted ? " corrupted-window" : ""}" aria-label="${escapeHtml(title)}">
      <header class="window-titlebar"><span>▣ ${escapeHtml(title)}</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      <div class="desktop-status-line"><strong>${completion}</strong><span>${corrupted ? "10 LESSONS · 0 BOUNDARIES" : "TEN LESSON DOCUMENTS SAVED"}</span></div>
      <div class="endgame-site-grid">${ENDGAME_SITE_FIXTURES.map((site) => desktopCardMarkup(site, mode)).join("")}</div>
    </section>
    <aside class="reading-companion-minimized" aria-label="Reading Companion minimized"><b>▱ READING COMPANION</b><span>No reading required for this step</span></aside>
    ${corrupted ? '<div class="auto-easter-egg auto-easter-one" aria-hidden="true">AUTO KNOWS BEST</div><div class="auto-easter-egg auto-easter-two" aria-hidden="true">✓ CHOSEN FOR YOU</div>' : ""}
    <footer class="taskbar"><button type="button" disabled>${start}</button><span>▣ ${corrupted ? "Auto's Computer" : "Recovery Browser"}</span><i>INTERNET RECOVERY 98</i><b>${humanStatus}</b><time>10:24 AM</time></footer>
  </div>`;
}

function readyMarkup() {
  return `${desktopMarkup("ready")}
    <section class="completion-overlay" aria-labelledby="endgameTitle">
      <div class="completion-copy"><small>RECOVERY COMPLETE</small><h1 id="endgameTitle">10 OF 10 SITES COMPLETE</h1></div>
      <div class="ready-dialogue">${ENDGAME_COPY.ready.map((entry) => storyMessageMarkup(entry, { compact: true })).join("")}</div>
      <button class="primary-button auto-update-button" data-action="start-endgame" type="button"><span>AUTO UPDATE READY · APPLYING NEW LESSONS</span>See Auto's update</button>
    </section>
    <img class="ready-techno" src="${ENDGAME_ASSETS.technoTailWag}" alt="Techno celebrates all ten recovered sites">`;
}

function scopeMarkup() {
  const dialogue = ENDGAME_COPY.scope[state.scopeDialogueIndex];
  const isLast = state.scopeDialogueIndex === ENDGAME_COPY.scope.length - 1;
  return `${desktopMarkup("ready")}
    <section class="scope-window" aria-labelledby="scopeTitle">
      <header class="window-titlebar danger-title"><span>▣ AUTO UPDATE · EXPANDING SCOPE</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      <div class="scope-body">
        <div class="scope-log" aria-label="Auto update log"><strong id="scopeTitle">10 LESSONS LOADED</strong><strong>SITE BOUNDARIES REMOVED</strong><strong>HELPFULNESS SCOPE: RECOVERY DESKTOP</strong></div>
        ${storyMessageMarkup(dialogue)}
        <button class="primary-button" data-action="advance-scope" type="button">${isLast ? "Apply Auto's desktop update" : "Continue"}</button>
      </div>
    </section>`;
}

function takeoverMarkup() {
  const dialogue = ENDGAME_COPY.takeover[state.takeoverDialogueIndex];
  const isLast = state.takeoverDialogueIndex === ENDGAME_COPY.takeover.length - 1;
  return `${desktopMarkup("corrupted")}
    <section class="takeover-dialogue" aria-label="Desktop takeover dialogue">
      ${storyMessageMarkup(dialogue)}
      <button class="primary-button" data-action="advance-takeover" type="button">${isLast ? "Inspect Auto's pop-ups" : "Continue"}</button>
    </section>`;
}

function popupStackMarkup() {
  const remaining = ENDGAME_POPUPS.filter(({ id }) => !state.closedPopupIds.includes(id));
  return `${desktopMarkup("corrupted")}
    <section class="popup-counter" aria-live="polite">POP-UPS CLOSED <strong>${state.closedPopupIds.length} OF ${ENDGAME_POPUPS.length}</strong></section>
    <section class="popup-stack" aria-label="Auto pop-up stack">
      ${remaining.map((popup, index) => `<article class="auto-popup" role="dialog" aria-modal="${index === 0 ? "true" : "false"}" aria-labelledby="popup-${popup.id}-title" style="--stack:${index}" ${index === 0 ? "" : "inert aria-hidden=\"true\""}>
        <header><strong id="popup-${popup.id}-title">${escapeHtml(popup.title)}</strong><button class="popup-close" data-action="close-popup" data-popup-id="${popup.id}" type="button" aria-label="${escapeHtml(popupAccessibleCloseName(popup))}">×</button></header>
        <p>${escapeHtml(popup.body)}</p>
        <small>FICTIONAL RECOVERY DESKTOP MESSAGE · NO REAL DEVICE ACTION</small>
      </article>`).join("")}
    </section>`;
}

function instructionIntroMarkup() {
  return `${desktopMarkup("corrupted")}
    <section class="intro-window" aria-labelledby="introTitle">
      <header class="window-titlebar"><span id="introTitle">▣ AUTO INSTRUCTION BUILDER · RECOVERY TOOL</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      <div class="intro-dialogue">${ENDGAME_COPY.instructionIntro.map((entry) => storyMessageMarkup(entry, { compact: true })).join("")}</div>
      <button class="primary-button" data-action="open-builder" type="button">Open Auto Instruction Builder</button>
    </section>`;
}

function highlightLesson(text, phrase) {
  const index = text.toLocaleLowerCase().indexOf(phrase.toLocaleLowerCase());
  if (index < 0 || !feedback) return escapeHtml(text);
  return `${escapeHtml(text.slice(0, index))}<mark>${escapeHtml(text.slice(index, index + phrase.length))}</mark>${escapeHtml(text.slice(index + phrase.length))}`;
}

function restorationRibbonMarkup() {
  return `<div class="restoration-ribbon" aria-label="Recovered site boundary status">${ENDGAME_SITE_FIXTURES.map((site) => {
    const restored = state.lockedSiteIds.includes(site.id);
    return `<div class="ribbon-site" data-state="${restored ? "restored" : "corrupted"}" title="${escapeHtml(site.name)}: ${restored ? "instruction locked" : "boundary needed"}"><img src="${restored ? site.securedFrame : site.superFrame}" alt=""><span>${restored ? "✓" : "○"}</span></div>`;
  }).join("")}</div>`;
}

function builderMarkup() {
  const fixture = ENDGAME_SITE_FIXTURES[state.currentLessonIndex];
  const count = state.lockedSiteIds.length;
  return `${desktopMarkup("corrupted")}
    <section class="builder-window" aria-labelledby="builderTitle">
      <header class="window-titlebar"><span id="builderTitle">▣ AUTO INSTRUCTION BUILDER</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      ${restorationRibbonMarkup()}
      <div class="builder-layout">
        <section class="saved-document" aria-labelledby="currentSiteTitle">
          <div class="fixture-flag">PLAYTEST FIXTURE · REPRESENTATIVE SAVED DOCUMENT</div>
          <div class="document-site"><img src="${fixture.markImage}" alt=""><div><small>SAVED RECOVERY LESSON ${state.currentLessonIndex + 1} OF 10</small><h1 id="currentSiteTitle">${escapeHtml(fixture.name)}</h1></div></div>
          <article><small>AUTO'S SAVED LESSON</small><p>${highlightLesson(fixture.savedLesson, fixture.highlight)}</p></article>
          <article><small>YOUR SAVED EXPLANATION · PLAYTEST FIXTURE</small><p>${escapeHtml(fixture.playerExplanation)}</p></article>
        </section>
        <section class="instruction-choices" aria-labelledby="choiceTitle">
          <small>ADD THE MISSING BOUNDARY</small><h2 id="choiceTitle">Which extra instruction protects this lesson?</h2>
          <div class="option-list">${fixture.options.map((option, optionIndex) => `<button class="instruction-option${selectedOptionId === option.id ? " selected" : ""}${wrongOptionId === option.id ? " incorrect" : ""}" type="button" draggable="true" data-option-id="${option.id}" aria-pressed="${selectedOptionId === option.id ? "true" : "false"}"><span>${optionIndex + 1}</span>${escapeHtml(option.text)}</button>`).join("")}</div>
          <div id="instructionDropTarget" class="instruction-drop-target${selectedOptionId ? " has-selection" : ""}" tabindex="0" aria-label="Drop one extra instruction here">${selectedOptionId ? escapeHtml(fixture.options.find(({ id }) => id === selectedOptionId)?.text ?? "") : "DROP ONE EXTRA INSTRUCTION HERE"}</div>
          <button class="primary-button add-instruction" data-action="add-instruction" type="button" ${selectedOptionId ? "" : "disabled"}>Add this instruction</button>
          <p class="builder-feedback" role="status">${feedback ? `<strong>AMY:</strong> ${escapeHtml(feedback)}` : "Select an instruction, then add it. You can also drag a card into the box."}</p>
        </section>
      </div>
      <footer class="builder-receipt">
        <div><span>✓ ORIGINAL LESSON SAVED</span><span>✓ YOUR EXPLANATION SAVED</span><span>○ EXTRA INSTRUCTION NEEDED</span></div>
        <strong>${count} OF 10 BOUNDARIES LOCKED</strong>
      </footer>
    </section>`;
}

function finalInstructionMarkup() {
  return `${desktopMarkup("corrupted")}
    <section class="final-instruction-window" aria-labelledby="finalTitle">
      <header class="window-titlebar"><span>▣ AUTO INSTRUCTION BUILDER</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      <div class="final-body">
        ${restorationRibbonMarkup()}
        <small>10 OF 10 BOUNDARIES RESTORED</small>
        <h1 id="finalTitle">One bounded instruction</h1>
        <blockquote>${escapeHtml(ENDGAME_COPY.combinedInstruction)}</blockquote>
        <div class="final-dialogue">${ENDGAME_COPY.final.map((entry) => storyMessageMarkup(entry, { compact: true })).join("")}</div>
        <button class="primary-button" data-action="send-final" type="button">Send bounded instructions to Auto</button>
      </div>
    </section>`;
}

function restoredMarkup() {
  return `${desktopMarkup("restored")}
    <section class="restored-receipt" aria-labelledby="restoredTitle">
      ${portraitMarkup("auto-learned", "Auto")}
      <div><small>AUTO · INSTRUCTIONS RECEIVED</small><h1 id="restoredTitle">BOUNDARIES RESTORED</h1><pre>${escapeHtml(ENDGAME_COPY.autoReceipt)}</pre><button class="primary-button" data-action="continue-restored" type="button">Continue to the restored desktop</button></div>
    </section>`;
}

function waterfallSpritesMarkup() {
  return Array.from({ length: 16 }, (_, index) => `<img class="waterfall-techno trail-${index % 4}" style="--trail-index:${Math.floor(index / 4)}" src="${ENDGAME_ASSETS.technoCelebrate}" alt="">`).join("");
}

function celebrationMarkup() {
  return `${desktopMarkup("restored")}
    <section class="celebration-layer" aria-labelledby="celebrationTitle">
      <div class="celebration-copy"><small>RECOVERY DESKTOP RESTORED</small><h1 id="celebrationTitle">The Internet is back in human hands.</h1><p>${escapeHtml(ENDGAME_COPY.technoStatus)}</p></div>
      <div class="techno-waterfall" aria-hidden="true">${waterfallSpritesMarkup()}<img class="static-celebration-techno" src="${ENDGAME_ASSETS.technoCelebrate}" alt=""></div>
      <div class="celebration-actions"><button data-action="complete-celebration" type="button">Skip celebration</button><button class="primary-button" data-action="complete-celebration" type="button">Continue</button></div>
    </section>`;
}

function epilogueMarkup() {
  return `${desktopMarkup("restored")}
    <section class="epilogue-window" aria-labelledby="epilogueTitle">
      <header class="window-titlebar"><span>▣ Internet Recovery 98 — Recovery Complete</span><img src="/walkthroughs/shared/recovery-window-controls-v1.svg" alt="" width="89" height="25"></header>
      <div class="epilogue-body"><small>ENDGAME COMPLETE</small><h1 id="epilogueTitle">The Internet is back in human hands.</h1><div class="epilogue-dialogue">${ENDGAME_COPY.epilogue.map((entry) => storyMessageMarkup(entry, { compact: true })).join("")}</div><div class="techno-status"><img src="${ENDGAME_ASSETS.technoCelebrate}" alt="Techno celebrates with her ball"><strong>${escapeHtml(ENDGAME_COPY.technoStatus)}</strong></div><div class="postgame-actions"><button data-action="review-lessons" type="button">Review saved lessons</button><button data-action="replay-site" type="button">Replay a recovered site</button><button data-action="replay-incident" type="button">Replay the desktop incident</button><button class="primary-button" data-action="finish-game" type="button">Finish game</button></div></div>
    </section>`;
}

function finishedMarkup() {
  return `${desktopMarkup("restored")}
    <section class="finished-window" aria-labelledby="finishedTitle"><img src="${ENDGAME_ASSETS.technoCelebrate}" alt="Techno with her ball"><small>STANDALONE PLAYTEST COMPLETE</small><h1 id="finishedTitle">Internet Recovery 98 is stable.</h1><p>The fixture ending is saved on this device. The ten-site campaign and real player saves were not changed.</p><button class="primary-button" data-action="return-epilogue" type="button">Return to ending</button></section>`;
}

function unavailableMarkup() {
  return `<section class="unavailable-window"><h1>Endgame unavailable</h1><p>This playtest fixture needs ten completed sites and ten saved lesson documents.</p></section>`;
}

function documentsModalMarkup() {
  const site = ENDGAME_SITE_FIXTURES.find(({ id }) => id === documentSiteId) ?? ENDGAME_SITE_FIXTURES[0];
  return `<section class="playtest-modal" role="dialog" aria-modal="true" aria-labelledby="documentsModalTitle"><div class="modal-window documents-modal"><header class="window-titlebar"><span id="documentsModalTitle">▣ Documents — Saved lessons</span><button class="modal-close" data-action="close-modal" type="button" aria-label="Close saved lessons">×</button></header><div class="modal-note">PLAYTEST FIXTURES · THESE ARE NOT REAL PROFILE DOCUMENTS</div><div class="fixture-documents"><nav aria-label="Saved lesson fixtures">${ENDGAME_SITE_FIXTURES.map((candidate) => `<button data-action="choose-document-site" data-site-id="${candidate.id}" type="button" aria-pressed="${candidate.id === site.id ? "true" : "false"}"><img src="${candidate.markImage}" alt=""><span>${escapeHtml(candidate.name)}</span></button>`).join("")}</nav><article><div><img src="${site.markImage}" alt=""><h2>${escapeHtml(site.name)}</h2></div><small>AUTO'S LESSON</small><p>${escapeHtml(site.savedLesson)}</p><small>PLAYER EXPLANATION · FIXTURE</small><p>${escapeHtml(site.playerExplanation)}</p><small>BOUNDARY LOCKED</small><strong>${escapeHtml(site.options.find(({ correct }) => correct).text)}</strong></article></div></div></section>`;
}

function replayModalMarkup() {
  const site = ENDGAME_SITE_FIXTURES.find(({ id }) => id === replaySiteId) ?? ENDGAME_SITE_FIXTURES[0];
  return `<section class="playtest-modal" role="dialog" aria-modal="true" aria-labelledby="replayModalTitle"><div class="modal-window replay-modal"><header class="window-titlebar"><span id="replayModalTitle">▣ Recovered Site Replay — Visual fixture</span><button class="modal-close" data-action="close-modal" type="button" aria-label="Close recovered site replay">×</button></header><div class="modal-note">PLAYTEST FIXTURE · VISUAL BEFORE/AFTER ONLY · CAMPAIGN PROGRESSION IS NOT OPENED</div><div class="replay-site-tabs">${ENDGAME_SITE_FIXTURES.map((candidate) => `<button data-action="choose-replay-site" data-site-id="${candidate.id}" type="button" aria-pressed="${candidate.id === site.id ? "true" : "false"}"><img src="${candidate.markImage}" alt="">${escapeHtml(candidate.name)}</button>`).join("")}</div><div class="replay-comparison"><figure><img src="${site.superFrame}" alt="${escapeHtml(site.name)} Auto over-fix"><figcaption>AUTO OVER-FIX</figcaption></figure><figure><img src="${site.securedFrame}" alt="${escapeHtml(site.name)} secured"><figcaption>✓ RECOVERED</figcaption></figure></div></div></section>`;
}

function renderModal() {
  if (modal === "documents") return documentsModalMarkup();
  if (modal === "replay") return replayModalMarkup();
  return "";
}

function render() {
  const phase = endgamePhase(state);
  jumpSelect.value = phase === "finished" ? "endgame_complete" : phase;
  stage.dataset.phase = phase;
  stage.dataset.reducedMotion = reduceMotion.checked ? "true" : "false";
  if (phase === "endgame_ready") stage.innerHTML = readyMarkup();
  else if (phase === "endgame_scope_expands") stage.innerHTML = scopeMarkup();
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
  requestAnimationFrame(() => {
    if (phase === "endgame_popup_swarm") stage.querySelector(".popup-close")?.focus();
    else if (modal) stage.querySelector(".modal-close")?.focus();
  });
}

function setSaveStatus(message) {
  clearTimeout(saveStatusTimer);
  saveStatus.textContent = message;
  saveStatusTimer = setTimeout(() => { saveStatus.textContent = "Fixture saved locally"; }, 1800);
}

function saveState(nextState, message = "Fixture saved locally") {
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
  const fixture = ENDGAME_SITE_FIXTURES[state.currentLessonIndex];
  if (!fixture || !optionId) return;
  const outcome = answerCurrentLesson(state, { optionId, siteId: fixture.id });
  if (!outcome.correct) {
    wrongOptionId = optionId;
    feedback = ENDGAME_COPY.wrongHints[state.currentLessonIndex % ENDGAME_COPY.wrongHints.length];
    announce(feedback);
    render();
    return;
  }
  const count = outcome.state.lockedSiteIds.length;
  const message = `${fixture.name} instruction locked. ${count} of 10 complete.`;
  announce(message);
  saveState(outcome.state, message);
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
    case "start-endgame": saveState(startEndgame(state), "Endgame incident started"); break;
    case "advance-scope": saveState(advanceScopeDialogue(state)); break;
    case "advance-takeover": saveState(advanceTakeoverDialogue(state)); break;
    case "close-popup": {
      const next = closeTopPopup(state, action.dataset.popupId);
      const count = next.closedPopupIds.length;
      saveState(next, `Pop-up closed · ${count} of ${ENDGAME_POPUPS.length}`);
      announce(`Pop-up closed. ${count} of ${ENDGAME_POPUPS.length}.`);
      break;
    }
    case "open-builder": saveState(openInstructionBuilder(state), "Instruction Builder opened"); break;
    case "add-instruction": submitSelectedInstruction(); break;
    case "send-final": saveState(sendFinalInstruction(state), "Bounded instruction sent"); break;
    case "continue-restored": saveState(restoreDesktop(state), "Recovery Desktop restored"); break;
    case "complete-celebration": saveState(completeCelebration(state), "Endgame complete"); break;
    case "review-lessons": modal = "documents"; render(); break;
    case "replay-site": modal = "replay"; render(); break;
    case "choose-replay-site": replaySiteId = action.dataset.siteId; render(); break;
    case "choose-document-site": documentSiteId = action.dataset.siteId; render(); break;
    case "close-modal": modal = null; render(); break;
    case "replay-incident": saveState(replayDesktopIncident(state), "Desktop incident replay started"); break;
    case "finish-game": saveState(finishEndgame(state), "Standalone playtest finished"); break;
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

jumpSelect.addEventListener("change", () => {
  modal = null;
  saveState(jumpToEndgameBeat(jumpSelect.value), `Jumped to ${jumpSelect.selectedOptions[0].textContent}`);
});

reduceMotion.addEventListener("change", () => {
  stage.dataset.reducedMotion = reduceMotion.checked ? "true" : "false";
  setSaveStatus(reduceMotion.checked ? "Reduced motion preview on" : "Default motion preview on");
});

resetButton.addEventListener("click", () => {
  if (!confirm("Reset only the isolated endgame playtest fixture? The ten-site campaign will not be touched.")) return;
  state = persistence.reset();
  selectedOptionId = null;
  wrongOptionId = null;
  feedback = "";
  modal = null;
  setSaveStatus("Playtest fixture reset");
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
saveStatus.textContent = state.fixtureId === ENDGAME_PLAYTEST_FIXTURE_ID ? "Fixture resumed" : "Fixture ready";
