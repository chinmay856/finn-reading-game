import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  ENDGAME_COPY,
  ENDGAME_POPUPS,
  ENDGAME_REPAIR_STEP_KEYS,
  ENDGAME_SITE_FIXTURES,
  ENDGAME_SITE_ORDER,
  getEndgameRepairStep,
  popupAccessibleCloseName,
  repairStepId,
} from "../apps/internet-recovery/endgame-playtest-content.js";
import {
  ENDGAME_BEATS,
  ENDGAME_PLAYTEST_STORAGE_KEY,
  advanceEndingDialogue,
  advanceFinalDialogue,
  advanceInstructionIntro,
  advanceReadyDialogue,
  advanceTakeoverDialogue,
  advanceToNextSite,
  answerCurrentLesson,
  closeTopPopup,
  createEndgamePlaytestPersistence,
  createEndgamePlaytestState,
  endgamePhase,
  finishEndgame,
  fixtureUnlockAvailable,
  normalizeEndgamePlaytestState,
  replayDesktopIncident,
  restoreDesktop,
  sendFinalInstruction,
  stopCelebration,
} from "../apps/internet-recovery/endgame-playtest-state.js";
import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

const html = await readFile(new URL("../endgame-playtest.html", import.meta.url), "utf8");
const runtime = await readFile(new URL("../endgame-playtest.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../endgame-playtest.css", import.meta.url), "utf8");
const content = await readFile(new URL("../apps/internet-recovery/endgame-playtest-content.js", import.meta.url), "utf8");
const stateSource = await readFile(new URL("../apps/internet-recovery/endgame-playtest-state.js", import.meta.url), "utf8");
const campaignHtml = await readFile(new URL("../playable-missions.html", import.meta.url), "utf8");
const campaignRuntime = await readFile(new URL("../playable-missions.js", import.meta.url), "utf8");

class RecordingStorage {
  constructor() {
    this.values = new Map();
    this.operations = [];
  }

  getItem(key) {
    this.operations.push(["get", key]);
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.operations.push(["set", key]);
    this.values.set(key, value);
  }

  removeItem(key) {
    this.operations.push(["remove", key]);
    this.values.delete(key);
  }
}

function advanceToPopupSwarm() {
  let state = createEndgamePlaytestState();
  for (const _ of ENDGAME_COPY.ready) state = advanceReadyDialogue(state);
  for (const _ of ENDGAME_COPY.takeover) state = advanceTakeoverDialogue(state);
  assert.equal(endgamePhase(state), "endgame_popup_swarm");
  return state;
}

function advanceToBuilder() {
  let state = advanceToPopupSwarm();
  for (const popup of [...ENDGAME_POPUPS].reverse()) state = closeTopPopup(state, popup.id);
  for (const _ of ENDGAME_COPY.instructionIntro) state = advanceInstructionIntro(state);
  assert.equal(endgamePhase(state), "endgame_lesson_lock");
  return state;
}

function completeAllThirtyRepairs(state) {
  for (let siteIndex = 0; siteIndex < ENDGAME_SITE_FIXTURES.length; siteIndex += 1) {
    const fixture = ENDGAME_SITE_FIXTURES[siteIndex];
    for (let repairIndex = 0; repairIndex < ENDGAME_REPAIR_STEP_KEYS.length; repairIndex += 1) {
      const step = getEndgameRepairStep(siteIndex, repairIndex);
      const correct = step.options.find((option) => option.correct);
      state = answerCurrentLesson(state, { siteId: fixture.id, optionId: correct.id }).state;
    }
    state = advanceToNextSite(state);
  }
  return state;
}

test("standalone endgame keeps the reviewed ten-site order and uses site-only before/after crops", async () => {
  assert.equal(ENDGAME_SITE_FIXTURES.length, 10);
  assert.deepEqual(ENDGAME_SITE_FIXTURES.map(({ id }) => id), ENDGAME_SITE_ORDER);
  for (const fixture of ENDGAME_SITE_FIXTURES) {
    assert.equal(fixture.superFrame, PLAYABLE_WALKTHROUGHS[fixture.id].superFrame);
    assert.equal(fixture.securedFrame, PLAYABLE_WALKTHROUGHS[fixture.id].securedFrame);
    assert.equal(fixture.savedLesson, PLAYABLE_WALKTHROUGHS[fixture.id].autoLesson);
    assert.match(fixture.autoFrame, new RegExp(`/endgame/site-crops/${fixture.id}-auto-site-v1\\.png`, "u"));
    assert.match(fixture.recoveredFrame, new RegExp(`/endgame/site-crops/${fixture.id}-recovered-site-v1\\.png`, "u"));
    assert.ok(fixture.playerExplanation.length > 80);
    await access(new URL(`../public${fixture.autoFrame.split("?")[0]}`, import.meta.url));
    await access(new URL(`../public${fixture.recoveredFrame.split("?")[0]}`, import.meta.url));
  }
  for (const popup of ENDGAME_POPUPS) await access(new URL(`../public${popup.image}`, import.meta.url));
});

test("all thirty repair steps have five deterministic choices and exactly one correct answer", () => {
  const optionSnapshots = [];
  for (let siteIndex = 0; siteIndex < ENDGAME_SITE_FIXTURES.length; siteIndex += 1) {
    for (let repairIndex = 0; repairIndex < ENDGAME_REPAIR_STEP_KEYS.length; repairIndex += 1) {
      const step = getEndgameRepairStep(siteIndex, repairIndex);
      assert.equal(step.key, ENDGAME_REPAIR_STEP_KEYS[repairIndex]);
      assert.equal(step.options.length, 5);
      assert.equal(step.options.filter(({ correct }) => correct).length, 1);
      assert.equal(Object.isFrozen(step.options), true);
      optionSnapshots.push(step.options.map(({ id }) => id));
    }
  }
  assert.deepEqual(optionSnapshots, optionSnapshots.map((ids) => [...ids]));
});

test("fixture gate requires all ten completed sites and all ten lesson documents", () => {
  assert.equal(fixtureUnlockAvailable({ completedSiteIds: ENDGAME_SITE_ORDER, lessonDocumentIds: ENDGAME_SITE_ORDER }), true);
  assert.equal(fixtureUnlockAvailable({ completedSiteIds: ENDGAME_SITE_ORDER.slice(1), lessonDocumentIds: ENDGAME_SITE_ORDER }), false);
  assert.equal(fixtureUnlockAvailable({ completedSiteIds: ENDGAME_SITE_ORDER, lessonDocumentIds: ENDGAME_SITE_ORDER.slice(0, 9) }), false);
});

test("the six scattered virus windows close only from the active top window and resume after each dismissal", () => {
  const storage = new RecordingStorage();
  const persistence = createEndgamePlaytestPersistence(storage);
  let state = advanceToPopupSwarm();
  assert.deepEqual(closeTopPopup(state, ENDGAME_POPUPS[0].id).closedPopupIds, []);
  const dismissalOrder = [...ENDGAME_POPUPS].reverse();
  for (const [index, popup] of dismissalOrder.entries()) {
    state = closeTopPopup(state, popup.id);
    persistence.save(state);
    assert.deepEqual(persistence.load().closedPopupIds, dismissalOrder.slice(0, index + 1).map(({ id }) => id));
    assert.equal(popupAccessibleCloseName(popup), `Close ${popup.title.toLowerCase().replace(/\b\w/gu, (letter) => letter.toUpperCase())} popup`);
  }
  assert.equal(endgamePhase(state), "endgame_instruction_intro");
});

test("wrong answers have no penalty and each site needs all three ordered repairs", () => {
  let state = advanceToBuilder();
  let expectedCompleted = 0;
  for (let siteIndex = 0; siteIndex < ENDGAME_SITE_FIXTURES.length; siteIndex += 1) {
    const fixture = ENDGAME_SITE_FIXTURES[siteIndex];
    for (let repairIndex = 0; repairIndex < ENDGAME_REPAIR_STEP_KEYS.length; repairIndex += 1) {
      const step = getEndgameRepairStep(siteIndex, repairIndex);
      const wrong = step.options.find(({ correct }) => !correct);
      const correct = step.options.find(({ correct }) => correct);
      const wrongResult = answerCurrentLesson(state, { siteId: fixture.id, optionId: wrong.id });
      assert.equal(wrongResult.correct, false);
      assert.equal(wrongResult.state, state);
      const correctResult = answerCurrentLesson(state, { siteId: fixture.id, optionId: correct.id });
      expectedCompleted += 1;
      assert.equal(correctResult.correct, true);
      assert.equal(correctResult.state.completedRepairStepIds.length, expectedCompleted);
      state = correctResult.state;
      assert.equal(state.currentLessonIndex, siteIndex);
      if (repairIndex === 2) {
        assert.equal(state.awaitingNextSite, true);
        state = advanceToNextSite(state);
        assert.equal(state.currentLessonIndex, siteIndex + 1);
      }
    }
  }
  assert.equal(endgamePhase(state), "endgame_final_instruction");
});

test("malformed resume data cannot skip a popup or any of the thirty repair steps", () => {
  const valid = advanceToBuilder();
  const normalized = normalizeEndgamePlaytestState({
    ...valid,
    closedPopupIds: [ENDGAME_POPUPS[1].id, ENDGAME_POPUPS[0].id],
    completedRepairStepIds: [
      repairStepId(ENDGAME_SITE_ORDER[0], ENDGAME_REPAIR_STEP_KEYS[0]),
      repairStepId(ENDGAME_SITE_ORDER[0], ENDGAME_REPAIR_STEP_KEYS[2]),
    ],
    currentLessonIndex: 9,
    currentRepairIndex: 2,
    finalInstructionSent: true,
  });
  assert.deepEqual(normalized.closedPopupIds, []);
  assert.deepEqual(normalized.completedRepairStepIds, [repairStepId(ENDGAME_SITE_ORDER[0], ENDGAME_REPAIR_STEP_KEYS[0])]);
  assert.equal(normalized.currentLessonIndex, 0);
  assert.equal(normalized.currentRepairIndex, 1);
  assert.equal(normalized.finalInstructionSent, false);
});

test("the final instruction, continuous cascade, stopped-dialog sequence, and Techno ending are ordered", () => {
  let state = completeAllThirtyRepairs(advanceToBuilder());
  assert.equal(sendFinalInstruction(state), state);
  for (let index = 1; index < ENDGAME_COPY.final.length; index += 1) state = advanceFinalDialogue(state);
  state = sendFinalInstruction(state);
  assert.equal(endgamePhase(state), "endgame_desktop_restored");
  state = restoreDesktop(state);
  assert.equal(endgamePhase(state), "endgame_techno_celebration");
  assert.equal(advanceEndingDialogue(state), state);
  state = stopCelebration(state);
  for (const _ of ENDGAME_COPY.ending) state = advanceEndingDialogue(state);
  assert.equal(endgamePhase(state), "endgame_complete");
  state = finishEndgame(state);
  assert.equal(endgamePhase(state), "finished");
  const replay = replayDesktopIncident(state);
  assert.equal(endgamePhase(replay), "endgame_ready");
  assert.equal(replay.completedOnce, true);
  assert.equal(replay.replayCount, 1);
});

test("persistence uses only the v3 isolated namespace and stores no fixture prose", () => {
  const storage = new RecordingStorage();
  const persistence = createEndgamePlaytestPersistence(storage);
  const state = persistence.save(advanceToBuilder());
  assert.equal(persistence.load().instructionBuilderOpened, true);
  persistence.reset();
  assert.equal(ENDGAME_PLAYTEST_STORAGE_KEY, "internet-recovery-endgame-playtest-v3");
  assert.deepEqual(new Set(storage.operations.map(([, key]) => key)), new Set([ENDGAME_PLAYTEST_STORAGE_KEY]));
  assert.equal(storage.values.has(ENDGAME_PLAYTEST_STORAGE_KEY), false);
  const serialized = JSON.stringify(state);
  for (const fixture of ENDGAME_SITE_FIXTURES) {
    assert.doesNotMatch(serialized, new RegExp(fixture.playerExplanation.slice(0, 24), "u"));
    assert.doesNotMatch(serialized, new RegExp(fixture.savedLesson.slice(0, 24), "u"));
  }
});

test("route exposes keyboard and touch alternatives, accessible dialogs, reduced motion, and separated QA controls", () => {
  assert.match(html, /DIAGNOSTICS/u);
  assert.match(html, /stay outside the game screen/u);
  assert.match(html, /id="jumpToBeat"/u);
  assert.match(html, /id="skipCurrentStep"/u);
  assert.match(html, /id="reduceMotion"/u);
  assert.match(html, /id="resetPlaytest"/u);
  assert.match(runtime, /draggable="true"/u);
  assert.match(runtime, /data-action="add-instruction"/u);
  assert.match(runtime, /addEventListener\("dragstart"/u);
  assert.match(runtime, /addEventListener\("drop"/u);
  assert.match(runtime, /addEventListener\("pointerup"/u);
  assert.match(runtime, /droppedInside[\s\S]+submitSelectedInstruction\(draggedOptionId\)/u);
  assert.match(runtime, /addEventListener\("keydown"[\s\S]+event\.key !== "Enter"[\s\S]+event\.key !== " "[\s\S]+button\.click\(\)/u);
  assert.match(runtime, /role="dialog"/u);
  assert.match(runtime, /aria-modal=/u);
  assert.match(runtime, /popupAccessibleCloseName/u);
  assert.match(runtime, /class="solitaire-techno-canvas"/u);
  assert.match(runtime, /context\.drawImage\(\s*celebrationArtwork/u);
  assert.match(runtime, /TECHNO_CASCADE_ANIMATIONS/u);
  assert.match(runtime, /row:\s*1[\s\S]+row:\s*2[\s\S]+row:\s*4[\s\S]+row:\s*7/u);
  assert.match(runtime, /trajectory\.animation\.row \* TECHNO_FRAME\.height/u);
  assert.match(runtime, /trajectory\.nextStampAt = now \+ 48/u);
  assert.match(runtime, /visibleBoundsForAnimation/u);
  assert.match(runtime, /baselineCorrection = trajectory\.visibleBottomOffset - frameBottom/u);
  assert.match(runtime, /floor: canvas\.height/u);
  assert.match(runtime, /trajectory\.y = trajectory\.floor - trajectory\.visibleBottomOffset/u);
  assert.match(runtime, /anchorPattern = \[0, 1, \.5, \.25, \.75, \.4, \.6, \.12, \.88\]/u);
  assert.match(runtime, /requestAnimationFrame\(animate\)/u);
  assert.match(runtime, /trajectory\.vy = -Math\.max/u);
  assert.doesNotMatch(runtime, /context\.rotate\(|trajectory\.rotation/u);
  assert.match(styles, /\.celebration-layer \{[^}]*z-index: 130/u);
  assert.match(styles, /\.solitaire-techno-canvas \{[^}]*z-index: 132/u);
  assert.doesNotMatch(runtime, /waterfall-techno|cascade-stamp|celebrationStampIndex/u);
  assert.match(runtime, /data-action="stop-celebration"/u);
  assert.match(runtime, /review-lessons/u);
  assert.match(runtime, /ENDGAME_POPUPS\.slice\(0, popupRevealCount\)/u);
  assert.match(runtime, /popupRevealCount === ENDGAME_POPUPS\.length/u);
  assert.match(runtime, /disabled aria-disabled=/u);
  assert.match(runtime, /\}, 1000\)/u);
  assert.match(runtime, /ENDGAME_POPUPS\]\.reverse\(\)/u);
  assert.match(styles, /prefers-reduced-motion: reduce/u);
  assert.match(styles, /\.saved-explanation-panel[\s\S]+-webkit-line-clamp:\s*5/u);
  assert.match(styles, /\.auto-popup[\s\S]+width:\s*820px[\s\S]+height:\s*460px/u);
  assert.match(content, /\/pets\/techno\/spritesheet\.webp/u);
  assert.doesNotMatch(content, /techno-progress-push|techno-celebrate-clean|techno-tail-wag/u);
  assert.deepEqual(ENDGAME_BEATS, [
    "endgame_ready", "endgame_desktop_corrupted", "endgame_popup_swarm",
    "endgame_instruction_intro", "endgame_lesson_lock", "endgame_final_instruction",
    "endgame_desktop_restored", "endgame_techno_celebration", "endgame_complete",
  ]);
});

test("rejected first-pass labels, counters, minimized Companion, old naming, and boundary review are absent", () => {
  const prototypeSource = `${html}\n${runtime}\n${styles}\n${content}\n${stateSource}`;
  for (const rejected of [
    /POP-UPS CLOSED/iu,
    /NO REAL DEVICE ACTION/iu,
    /CHOSEN FOR YOU/iu,
    /HUMAN INPUT:\s*NOT NEEDED/iu,
    /No reading required for this step/iu,
    /BOUNDARY LOCKED/iu,
    /10 LESSONS LOADED/iu,
    /SITE BOUNDARIES REMOVED/iu,
    /APPLYING TO RECOVERY DESKTOP/iu,
    /Close Auto's pop-ups/iu,
    /A wrong choice simply returns to the list/iu,
    /Techno victory cascade/iu,
    /\bFinn\b/u,
    /\bOtto\b/u,
  ]) assert.doesNotMatch(prototypeSource, rejected);
  assert.match(prototypeSource, /GO OUTSIDE AND TOUCH GRASS/u);
  assert.match(prototypeSource, /YOU AND TECHNO RECOVERED THE INTERNET\. ALSO HER BALL\./u);
  assert.match(runtime, /campaignPlayerExplanations/u);
  assert.match(runtime, /RECOVERY DESKTOP RESTORED/u);
  assert.match(styles, /\.story-dialog\[data-speaker="auto"\][^{]+\{\s*color:\s*var\(--ink\)/u);
});

test("standalone state remains isolated while completed campaign documents can replay the incident", () => {
  assert.match(campaignHtml, /id="replayEndgame"/u);
  assert.match(campaignRuntime, /canReplayEndgame/u);
  assert.match(campaignRuntime, /\/endgame-playtest\.html\?campaign=1&replay=1/u);
  assert.match(campaignRuntime, /\/endgame-playtest\.html\?campaign=1/u);
  assert.match(campaignHtml, /class="game-diagnostic-toolbar"/u);
  assert.match(campaignHtml, /id="diagnosticJump"/u);
  assert.match(campaignHtml, /id="skipReading"[^>]*hidden/u);
  assert.doesNotMatch(campaignHtml, /class="reader-actions"[\s\S]{0,500}id="skipReading"/u);
  assert.match(runtime, /location\.assign\("\/playable-missions\.html\?endgame=complete"\)/u);
  const prototypeSource = `${html}\n${runtime}\n${content}\n${stateSource}`;
  assert.match(prototypeSource, /\bAuto\b/u);
  assert.match(prototypeSource, /\bChinmay\b/u);
  assert.match(prototypeSource, /\bAmy\b/u);
  assert.match(prototypeSource, /\bTechno\b/u);
  assert.doesNotMatch(runtime, /combined-instruction/u);
  assert.equal(ENDGAME_COPY.ending.length, 2);
});
