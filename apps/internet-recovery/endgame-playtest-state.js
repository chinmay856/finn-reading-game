import {
  ENDGAME_COPY,
  ENDGAME_PLAYTEST_FIXTURE_ID,
  ENDGAME_POPUPS,
  ENDGAME_REPAIR_STEP_KEYS,
  ENDGAME_SITE_FIXTURES,
  ENDGAME_SITE_ORDER,
  getEndgameRepairStep,
  repairStepId,
} from "./endgame-playtest-content.js";

export const ENDGAME_PLAYTEST_STORAGE_KEY = "internet-recovery-endgame-playtest-v3";
export const ENDGAME_PLAYTEST_VERSION = 3;

export const ENDGAME_BEATS = Object.freeze([
  "endgame_ready",
  "endgame_desktop_corrupted",
  "endgame_popup_swarm",
  "endgame_instruction_intro",
  "endgame_lesson_lock",
  "endgame_final_instruction",
  "endgame_desktop_restored",
  "endgame_techno_celebration",
  "endgame_complete",
]);

const ALL_REPAIR_STEP_IDS = Object.freeze(ENDGAME_SITE_ORDER.flatMap((siteId) =>
  ENDGAME_REPAIR_STEP_KEYS.map((stepKey) => repairStepId(siteId, stepKey))));

export function fixtureUnlockAvailable({ completedSiteIds = [], lessonDocumentIds = [] } = {}) {
  const completed = new Set(completedSiteIds);
  const documents = new Set(lessonDocumentIds);
  return ENDGAME_SITE_ORDER.every((id) => completed.has(id) && documents.has(id));
}

export function completePlaytestFixture() {
  return Object.freeze({
    completedSiteIds: ENDGAME_SITE_ORDER,
    lessonDocumentIds: ENDGAME_SITE_ORDER,
  });
}

export function createEndgamePlaytestState({ fixture = completePlaytestFixture() } = {}) {
  return {
    version: ENDGAME_PLAYTEST_VERSION,
    fixtureId: ENDGAME_PLAYTEST_FIXTURE_ID,
    endgameAvailable: fixtureUnlockAvailable(fixture),
    readyDialogueIndex: 0,
    endgameStarted: false,
    desktopCorrupted: false,
    takeoverDialogueIndex: 0,
    popupSwarmStarted: false,
    closedPopupIds: [],
    instructionIntroIndex: 0,
    instructionBuilderOpened: false,
    completedRepairStepIds: [],
    currentLessonIndex: 0,
    currentRepairIndex: 0,
    finalDialogueIndex: 0,
    finalInstructionSent: false,
    desktopRestored: false,
    celebrationStopped: false,
    endingDialogueIndex: 0,
    endgameComplete: false,
    completedOnce: false,
    replayCount: 0,
    finished: false,
  };
}

function exactKnownPrefix(values, knownIds) {
  if (!Array.isArray(values)) return [];
  const prefix = [];
  for (const knownId of knownIds) {
    if (values[prefix.length] !== knownId) break;
    prefix.push(knownId);
  }
  return prefix;
}

function repairPosition(completedRepairStepIds) {
  const count = completedRepairStepIds.length;
  return {
    currentLessonIndex: Math.min(ENDGAME_SITE_ORDER.length, Math.floor(count / ENDGAME_REPAIR_STEP_KEYS.length)),
    currentRepairIndex: count % ENDGAME_REPAIR_STEP_KEYS.length,
  };
}

export function normalizeEndgamePlaytestState(candidate) {
  const fallback = createEndgamePlaytestState();
  if (!candidate || candidate.version !== ENDGAME_PLAYTEST_VERSION || candidate.fixtureId !== ENDGAME_PLAYTEST_FIXTURE_ID) return fallback;
  const closedPopupIds = exactKnownPrefix(candidate.closedPopupIds, ENDGAME_POPUPS.map(({ id }) => id).reverse());
  const completedRepairStepIds = exactKnownPrefix(candidate.completedRepairStepIds, ALL_REPAIR_STEP_IDS);
  const position = repairPosition(completedRepairStepIds);
  const allRepairsComplete = completedRepairStepIds.length === ALL_REPAIR_STEP_IDS.length;
  const finalInstructionSent = candidate.finalInstructionSent === true && allRepairsComplete;
  const desktopRestored = candidate.desktopRestored === true && finalInstructionSent;
  const celebrationStopped = candidate.celebrationStopped === true && desktopRestored;
  const endgameComplete = candidate.endgameComplete === true && celebrationStopped;
  return {
    ...fallback,
    endgameAvailable: candidate.endgameAvailable === true,
    readyDialogueIndex: Math.min(ENDGAME_COPY.ready.length - 1, Math.max(0, Number(candidate.readyDialogueIndex) || 0)),
    endgameStarted: candidate.endgameStarted === true,
    desktopCorrupted: candidate.desktopCorrupted === true || candidate.endgameStarted === true,
    takeoverDialogueIndex: Math.min(ENDGAME_COPY.takeover.length - 1, Math.max(0, Number(candidate.takeoverDialogueIndex) || 0)),
    popupSwarmStarted: candidate.popupSwarmStarted === true,
    closedPopupIds,
    instructionIntroIndex: Math.min(ENDGAME_COPY.instructionIntro.length - 1, Math.max(0, Number(candidate.instructionIntroIndex) || 0)),
    instructionBuilderOpened: candidate.instructionBuilderOpened === true,
    completedRepairStepIds,
    ...position,
    finalDialogueIndex: Math.min(ENDGAME_COPY.final.length - 1, Math.max(0, Number(candidate.finalDialogueIndex) || 0)),
    finalInstructionSent,
    desktopRestored,
    celebrationStopped,
    endingDialogueIndex: Math.min(ENDGAME_COPY.ending.length - 1, Math.max(0, Number(candidate.endingDialogueIndex) || 0)),
    endgameComplete,
    completedOnce: candidate.completedOnce === true || endgameComplete,
    replayCount: Math.max(0, Number(candidate.replayCount) || 0),
    finished: candidate.finished === true && endgameComplete,
  };
}

export function endgamePhase(state) {
  if (!state.endgameAvailable) return "unavailable";
  if (state.finished) return "finished";
  if (state.endgameComplete) return "endgame_complete";
  if (state.desktopRestored) return "endgame_techno_celebration";
  if (state.finalInstructionSent) return "endgame_desktop_restored";
  if (state.completedRepairStepIds.length === ALL_REPAIR_STEP_IDS.length) return "endgame_final_instruction";
  if (state.instructionBuilderOpened) return "endgame_lesson_lock";
  if (state.closedPopupIds.length === ENDGAME_POPUPS.length) return "endgame_instruction_intro";
  if (state.popupSwarmStarted) return "endgame_popup_swarm";
  if (state.desktopCorrupted) return "endgame_desktop_corrupted";
  return "endgame_ready";
}

export function advanceReadyDialogue(state) {
  if (endgamePhase(state) !== "endgame_ready") return state;
  if (state.readyDialogueIndex < ENDGAME_COPY.ready.length - 1) {
    return { ...state, readyDialogueIndex: state.readyDialogueIndex + 1 };
  }
  return { ...state, endgameStarted: true, desktopCorrupted: true, takeoverDialogueIndex: 0 };
}

export function advanceTakeoverDialogue(state) {
  if (endgamePhase(state) !== "endgame_desktop_corrupted") return state;
  if (state.takeoverDialogueIndex < ENDGAME_COPY.takeover.length - 1) {
    return { ...state, takeoverDialogueIndex: state.takeoverDialogueIndex + 1 };
  }
  return { ...state, popupSwarmStarted: true };
}

export function closeTopPopup(state, popupId) {
  if (endgamePhase(state) !== "endgame_popup_swarm") return state;
  const nextPopup = [...ENDGAME_POPUPS].reverse().find(({ id }) => !state.closedPopupIds.includes(id));
  if (!nextPopup || nextPopup.id !== popupId) return state;
  return { ...state, closedPopupIds: [...state.closedPopupIds, popupId] };
}

export function advanceInstructionIntro(state) {
  if (endgamePhase(state) !== "endgame_instruction_intro") return state;
  if (state.instructionIntroIndex < ENDGAME_COPY.instructionIntro.length - 1) {
    return { ...state, instructionIntroIndex: state.instructionIntroIndex + 1 };
  }
  return { ...state, instructionBuilderOpened: true };
}

export function answerCurrentLesson(state, { optionId, siteId } = {}) {
  if (endgamePhase(state) !== "endgame_lesson_lock") return { correct: false, state };
  const fixture = ENDGAME_SITE_FIXTURES[state.currentLessonIndex];
  const step = getEndgameRepairStep(state.currentLessonIndex, state.currentRepairIndex);
  if (!fixture || !step || fixture.id !== siteId) return { correct: false, state };
  const option = step.options.find(({ id }) => id === optionId);
  if (!option?.correct) return { correct: false, state };
  const expectedStepId = repairStepId(siteId, step.key);
  if (state.completedRepairStepIds.includes(expectedStepId)) return { correct: true, state };
  const completedRepairStepIds = [...state.completedRepairStepIds, expectedStepId];
  return {
    correct: true,
    state: {
      ...state,
      completedRepairStepIds,
      ...repairPosition(completedRepairStepIds),
    },
  };
}

export function advanceFinalDialogue(state) {
  if (endgamePhase(state) !== "endgame_final_instruction") return state;
  if (state.finalDialogueIndex >= ENDGAME_COPY.final.length - 1) return state;
  return { ...state, finalDialogueIndex: state.finalDialogueIndex + 1 };
}

export function sendFinalInstruction(state) {
  if (endgamePhase(state) !== "endgame_final_instruction") return state;
  if (state.finalDialogueIndex !== ENDGAME_COPY.final.length - 1) return state;
  return { ...state, finalInstructionSent: true };
}

export function restoreDesktop(state) {
  if (endgamePhase(state) !== "endgame_desktop_restored") return state;
  return { ...state, desktopRestored: true };
}

export function stopCelebration(state) {
  if (endgamePhase(state) !== "endgame_techno_celebration" || state.celebrationStopped) return state;
  return { ...state, celebrationStopped: true, endingDialogueIndex: 0 };
}

export function advanceEndingDialogue(state) {
  if (endgamePhase(state) !== "endgame_techno_celebration" || !state.celebrationStopped) return state;
  if (state.endingDialogueIndex < ENDGAME_COPY.ending.length - 1) {
    return { ...state, endingDialogueIndex: state.endingDialogueIndex + 1 };
  }
  return { ...state, endgameComplete: true, completedOnce: true };
}

export function finishEndgame(state) {
  if (endgamePhase(state) !== "endgame_complete") return state;
  return { ...state, finished: true };
}

export function returnToEpilogue(state) {
  if (!state.endgameComplete) return state;
  return { ...state, finished: false };
}

export function replayDesktopIncident(state) {
  const replayCount = Math.max(0, Number(state.replayCount) || 0) + 1;
  return {
    ...createEndgamePlaytestState(),
    completedOnce: state.completedOnce || state.endgameComplete,
    replayCount,
  };
}

export function jumpToEndgameBeat(beat) {
  const state = createEndgamePlaytestState();
  if (beat === "endgame_ready") return state;
  state.readyDialogueIndex = ENDGAME_COPY.ready.length - 1;
  state.endgameStarted = true;
  state.desktopCorrupted = true;
  if (beat === "endgame_desktop_corrupted") return state;
  state.takeoverDialogueIndex = ENDGAME_COPY.takeover.length - 1;
  state.popupSwarmStarted = true;
  if (beat === "endgame_popup_swarm") return state;
  state.closedPopupIds = ENDGAME_POPUPS.map(({ id }) => id).reverse();
  if (beat === "endgame_instruction_intro") return state;
  state.instructionIntroIndex = ENDGAME_COPY.instructionIntro.length - 1;
  state.instructionBuilderOpened = true;
  if (beat === "endgame_lesson_lock") return state;
  state.completedRepairStepIds = [...ALL_REPAIR_STEP_IDS];
  state.currentLessonIndex = ENDGAME_SITE_ORDER.length;
  state.currentRepairIndex = 0;
  if (beat === "endgame_final_instruction") return state;
  state.finalDialogueIndex = ENDGAME_COPY.final.length - 1;
  state.finalInstructionSent = true;
  if (beat === "endgame_desktop_restored") return state;
  state.desktopRestored = true;
  if (beat === "endgame_techno_celebration") return state;
  state.celebrationStopped = true;
  state.endingDialogueIndex = ENDGAME_COPY.ending.length - 1;
  state.endgameComplete = true;
  state.completedOnce = true;
  return state;
}

export function createEndgamePlaytestPersistence(storage = globalThis.localStorage) {
  return Object.freeze({
    key: ENDGAME_PLAYTEST_STORAGE_KEY,
    load() {
      try {
        return normalizeEndgamePlaytestState(JSON.parse(storage.getItem(ENDGAME_PLAYTEST_STORAGE_KEY) ?? "null"));
      } catch {
        return createEndgamePlaytestState();
      }
    },
    save(state) {
      const normalized = normalizeEndgamePlaytestState(state);
      storage.setItem(ENDGAME_PLAYTEST_STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    },
    reset() {
      storage.removeItem(ENDGAME_PLAYTEST_STORAGE_KEY);
      return createEndgamePlaytestState();
    },
  });
}
