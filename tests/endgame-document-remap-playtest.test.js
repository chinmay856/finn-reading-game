import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ENDGAME_COPY,
  ENDGAME_POPUPS,
  ENDGAME_SITE_FIXTURES,
  ENDGAME_SITE_ORDER,
  popupAccessibleCloseName,
} from "../apps/internet-recovery/endgame-playtest-content.js";
import {
  ENDGAME_BEATS,
  ENDGAME_PLAYTEST_STORAGE_KEY,
  advanceScopeDialogue,
  advanceTakeoverDialogue,
  answerCurrentLesson,
  closeTopPopup,
  completeCelebration,
  createEndgamePlaytestPersistence,
  createEndgamePlaytestState,
  endgamePhase,
  finishEndgame,
  fixtureUnlockAvailable,
  normalizeEndgamePlaytestState,
  openInstructionBuilder,
  replayDesktopIncident,
  restoreDesktop,
  sendFinalInstruction,
  startEndgame,
} from "../apps/internet-recovery/endgame-playtest-state.js";
import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

const html = await readFile(new URL("../endgame-playtest.html", import.meta.url), "utf8");
const runtime = await readFile(new URL("../endgame-playtest.js", import.meta.url), "utf8");
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
  let state = startEndgame(createEndgamePlaytestState());
  for (let index = 0; index < 3; index += 1) state = advanceScopeDialogue(state);
  for (let index = 0; index < 4; index += 1) state = advanceTakeoverDialogue(state);
  assert.equal(endgamePhase(state), "endgame_popup_swarm");
  return state;
}

function advanceToBuilder() {
  let state = advanceToPopupSwarm();
  for (const popup of ENDGAME_POPUPS) state = closeTopPopup(state, popup.id);
  state = openInstructionBuilder(state);
  assert.equal(endgamePhase(state), "endgame_lesson_lock");
  return state;
}

test("standalone endgame keeps the reviewed ten-site order and production before/after art", () => {
  assert.equal(ENDGAME_SITE_FIXTURES.length, 10);
  assert.deepEqual(ENDGAME_SITE_FIXTURES.map(({ id }) => id), ENDGAME_SITE_ORDER);
  for (const fixture of ENDGAME_SITE_FIXTURES) {
    assert.equal(fixture.superFrame, PLAYABLE_WALKTHROUGHS[fixture.id].superFrame);
    assert.equal(fixture.securedFrame, PLAYABLE_WALKTHROUGHS[fixture.id].securedFrame);
    assert.equal(fixture.savedLesson, PLAYABLE_WALKTHROUGHS[fixture.id].autoLesson);
    assert.ok(fixture.playerExplanation.length > 80);
  }
});

test("every lesson puzzle has five deterministic choices and exactly one correct boundary", () => {
  const correctSlots = ENDGAME_SITE_FIXTURES.map(({ correctSlot }) => correctSlot);
  assert.deepEqual(correctSlots, [0, 2, 4, 1, 3, 0, 2, 4, 1, 3]);
  for (const fixture of ENDGAME_SITE_FIXTURES) {
    assert.equal(fixture.options.length, 5);
    assert.equal(fixture.options.filter(({ correct }) => correct).length, 1);
    assert.equal(fixture.options[fixture.correctSlot].id, fixture.correctOptionId);
    assert.equal(Object.isFrozen(fixture.options), true);
  }
});

test("fixture gate requires all ten completed sites and all ten lesson documents", () => {
  assert.equal(fixtureUnlockAvailable({ completedSiteIds: ENDGAME_SITE_ORDER, lessonDocumentIds: ENDGAME_SITE_ORDER }), true);
  assert.equal(fixtureUnlockAvailable({ completedSiteIds: ENDGAME_SITE_ORDER.slice(1), lessonDocumentIds: ENDGAME_SITE_ORDER }), false);
  assert.equal(fixtureUnlockAvailable({ completedSiteIds: ENDGAME_SITE_ORDER, lessonDocumentIds: ENDGAME_SITE_ORDER.slice(0, 9) }), false);
});

test("the six-popup stack closes only from the top and resumes after each dismissal", () => {
  const storage = new RecordingStorage();
  const persistence = createEndgamePlaytestPersistence(storage);
  let state = advanceToPopupSwarm();

  const notTop = closeTopPopup(state, ENDGAME_POPUPS[1].id);
  assert.deepEqual(notTop.closedPopupIds, []);

  for (const [index, popup] of ENDGAME_POPUPS.entries()) {
    state = closeTopPopup(state, popup.id);
    persistence.save(state);
    const resumed = persistence.load();
    assert.deepEqual(resumed.closedPopupIds, ENDGAME_POPUPS.slice(0, index + 1).map(({ id }) => id));
    assert.equal(popupAccessibleCloseName(popup), `Close ${popup.title.toLowerCase().replace(/\b\w/gu, (letter) => letter.toUpperCase())} popup`);
  }
  assert.equal(endgamePhase(state), "endgame_instruction_intro");
});

test("wrong answers have no penalty; each correct answer locks one site exactly once", () => {
  let state = advanceToBuilder();
  for (const fixture of ENDGAME_SITE_FIXTURES) {
    const wrong = fixture.options.find(({ correct }) => !correct);
    const wrongResult = answerCurrentLesson(state, { siteId: fixture.id, optionId: wrong.id });
    assert.equal(wrongResult.correct, false);
    assert.equal(wrongResult.state, state);

    const correctResult = answerCurrentLesson(state, { siteId: fixture.id, optionId: fixture.correctOptionId });
    assert.equal(correctResult.correct, true);
    assert.equal(correctResult.state.lockedSiteIds.length, state.lockedSiteIds.length + 1);
    state = correctResult.state;

    const duplicate = answerCurrentLesson(state, { siteId: fixture.id, optionId: fixture.correctOptionId });
    assert.equal(duplicate.correct, false);
    assert.equal(duplicate.state, state);
  }
  assert.equal(endgamePhase(state), "endgame_final_instruction");
});

test("malformed resume data cannot skip a popup or lesson boundary", () => {
  const valid = advanceToBuilder();
  const normalized = normalizeEndgamePlaytestState({
    ...valid,
    closedPopupIds: [ENDGAME_POPUPS[1].id, ENDGAME_POPUPS[0].id],
    lockedSiteIds: [ENDGAME_SITE_ORDER[0], ENDGAME_SITE_ORDER[2]],
    currentLessonIndex: 9,
    finalInstructionSent: true,
  });
  assert.deepEqual(normalized.closedPopupIds, []);
  assert.deepEqual(normalized.lockedSiteIds, [ENDGAME_SITE_ORDER[0]]);
  assert.equal(normalized.currentLessonIndex, 1);
  assert.equal(normalized.finalInstructionSent, false);
});

test("the bounded instruction cannot be sent early and the complete state remains replayable", () => {
  let state = advanceToBuilder();
  assert.equal(sendFinalInstruction(state), state);
  for (const fixture of ENDGAME_SITE_FIXTURES) {
    state = answerCurrentLesson(state, { siteId: fixture.id, optionId: fixture.correctOptionId }).state;
  }
  state = sendFinalInstruction(state);
  assert.equal(endgamePhase(state), "endgame_desktop_restored");
  state = restoreDesktop(state);
  assert.equal(endgamePhase(state), "endgame_techno_celebration");
  state = completeCelebration(state);
  assert.equal(endgamePhase(state), "endgame_complete");
  state = finishEndgame(state);
  assert.equal(endgamePhase(state), "finished");
  const replay = replayDesktopIncident(state);
  assert.equal(endgamePhase(replay), "endgame_ready");
  assert.equal(replay.completedOnce, true);
  assert.equal(replay.replayCount, 1);
});

test("persistence uses only the isolated playtest namespace and stores no fixture prose", () => {
  const storage = new RecordingStorage();
  const persistence = createEndgamePlaytestPersistence(storage);
  const state = persistence.save(advanceToBuilder());
  assert.equal(persistence.load().instructionBuilderOpened, true);
  persistence.reset();

  assert.equal(ENDGAME_PLAYTEST_STORAGE_KEY, "internet-recovery-endgame-playtest-v1");
  assert.deepEqual(new Set(storage.operations.map(([, key]) => key)), new Set([ENDGAME_PLAYTEST_STORAGE_KEY]));
  assert.equal(storage.values.has(ENDGAME_PLAYTEST_STORAGE_KEY), false);
  const serialized = JSON.stringify(state);
  for (const fixture of ENDGAME_SITE_FIXTURES) {
    assert.doesNotMatch(serialized, new RegExp(fixture.playerExplanation.slice(0, 24), "u"));
  }
});

test("the standalone route exposes non-drag controls, accessible dialogs, reduced motion, and playtest-only QA controls", () => {
  assert.match(html, /ENDGAME PLAYTEST ONLY/u);
  assert.match(html, /Fixture data · isolated from campaign saves · not deployed/u);
  assert.match(html, /id="jumpToBeat"/u);
  assert.match(html, /id="reduceMotion"/u);
  assert.match(html, /id="resetPlaytest"/u);
  assert.match(runtime, /draggable="true"/u);
  assert.doesNotMatch(runtime, /role="listitem"/u);
  assert.match(runtime, /data-action="add-instruction"/u);
  assert.match(runtime, /addEventListener\("dragstart"/u);
  assert.match(runtime, /addEventListener\("drop"/u);
  assert.match(runtime, /addEventListener\("keydown"[\s\S]+event\.key !== "Enter"[\s\S]+event\.key !== " "[\s\S]+button\.click\(\)/u);
  assert.match(runtime, /role="dialog"/u);
  assert.match(runtime, /aria-modal=/u);
  assert.match(runtime, /popupAccessibleCloseName/u);
  assert.match(runtime, /READING COMPANION[\s\S]+No reading required for this step/u);
  assert.match(runtime, /AUTO UPDATE READY · APPLYING NEW LESSONS/u);
  assert.match(runtime, /waterfall-techno/u);
  assert.match(runtime, /static-celebration-techno/u);
  assert.deepEqual(ENDGAME_BEATS, [
    "endgame_ready", "endgame_scope_expands", "endgame_desktop_corrupted", "endgame_popup_swarm",
    "endgame_instruction_intro", "endgame_lesson_lock", "endgame_final_instruction",
    "endgame_desktop_restored", "endgame_techno_celebration", "endgame_complete",
  ]);
});

test("the prototype does not enter the campaign route or rename the four canonical characters", () => {
  assert.doesNotMatch(campaignHtml, /endgame-playtest/iu);
  assert.doesNotMatch(campaignRuntime, /endgame-playtest/iu);
  const prototypeSource = `${html}\n${runtime}\n${content}\n${stateSource}`;
  assert.doesNotMatch(prototypeSource, /\bFinn\b/u);
  assert.doesNotMatch(prototypeSource, /\bOtto\b/u);
  assert.match(prototypeSource, /\bAuto\b/u);
  assert.match(prototypeSource, /\bChinmay\b/u);
  assert.match(prototypeSource, /\bAmy\b/u);
  assert.match(prototypeSource, /\bTechno\b/u);
  assert.equal(ENDGAME_COPY.combinedInstruction, "HELP PEOPLE. KEEP THEIR CONTEXT, EVIDENCE, AND CHOICES. DO NOT REPLACE THE PERSON YOU ARE HELPING.");
});
