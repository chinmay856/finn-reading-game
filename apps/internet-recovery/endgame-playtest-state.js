import {
  ENDGAME_PLAYTEST_FIXTURE_ID,
  ENDGAME_POPUPS,
  ENDGAME_SITE_FIXTURES,
  ENDGAME_SITE_ORDER,
} from "./endgame-playtest-content.js";

export const ENDGAME_PLAYTEST_STORAGE_KEY = "internet-recovery-endgame-playtest-v1";
export const ENDGAME_PLAYTEST_VERSION = 1;

export const ENDGAME_BEATS = Object.freeze([
  "endgame_ready",
  "endgame_scope_expands",
  "endgame_desktop_corrupted",
  "endgame_popup_swarm",
  "endgame_instruction_intro",
  "endgame_lesson_lock",
  "endgame_final_instruction",
  "endgame_desktop_restored",
  "endgame_techno_celebration",
  "endgame_complete",
]);

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
    endgameStarted: false,
    scopeDialogueIndex: 0,
    desktopCorrupted: false,
    takeoverDialogueIndex: 0,
    popupSwarmStarted: false,
    closedPopupIds: [],
    instructionBuilderOpened: false,
    lockedSiteIds: [],
    currentLessonIndex: 0,
    finalInstructionSent: false,
    desktopRestored: false,
    celebrationSeen: false,
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

export function normalizeEndgamePlaytestState(candidate) {
  const fallback = createEndgamePlaytestState();
  if (!candidate || candidate.version !== ENDGAME_PLAYTEST_VERSION || candidate.fixtureId !== ENDGAME_PLAYTEST_FIXTURE_ID) return fallback;
  const closedPopupIds = exactKnownPrefix(candidate.closedPopupIds, ENDGAME_POPUPS.map(({ id }) => id));
  const lockedSiteIds = exactKnownPrefix(candidate.lockedSiteIds, ENDGAME_SITE_ORDER);
  return {
    ...fallback,
    endgameAvailable: candidate.endgameAvailable === true,
    endgameStarted: candidate.endgameStarted === true,
    scopeDialogueIndex: Math.min(2, Math.max(0, Number(candidate.scopeDialogueIndex) || 0)),
    desktopCorrupted: candidate.desktopCorrupted === true,
    takeoverDialogueIndex: Math.min(3, Math.max(0, Number(candidate.takeoverDialogueIndex) || 0)),
    popupSwarmStarted: candidate.popupSwarmStarted === true,
    closedPopupIds,
    instructionBuilderOpened: candidate.instructionBuilderOpened === true,
    lockedSiteIds,
    currentLessonIndex: Math.min(ENDGAME_SITE_ORDER.length, lockedSiteIds.length),
    finalInstructionSent: candidate.finalInstructionSent === true && lockedSiteIds.length === ENDGAME_SITE_ORDER.length,
    desktopRestored: candidate.desktopRestored === true && candidate.finalInstructionSent === true,
    celebrationSeen: candidate.celebrationSeen === true && candidate.desktopRestored === true,
    endgameComplete: candidate.endgameComplete === true && candidate.celebrationSeen === true,
    completedOnce: candidate.completedOnce === true || candidate.endgameComplete === true,
    replayCount: Math.max(0, Number(candidate.replayCount) || 0),
    finished: candidate.finished === true && candidate.endgameComplete === true,
  };
}

export function endgamePhase(state) {
  if (!state.endgameAvailable) return "unavailable";
  if (state.finished) return "finished";
  if (state.endgameComplete) return "endgame_complete";
  if (state.celebrationSeen) return "endgame_complete";
  if (state.desktopRestored) return "endgame_techno_celebration";
  if (state.finalInstructionSent) return "endgame_desktop_restored";
  if (state.lockedSiteIds.length === ENDGAME_SITE_ORDER.length) return "endgame_final_instruction";
  if (state.instructionBuilderOpened) return "endgame_lesson_lock";
  if (state.closedPopupIds.length === ENDGAME_POPUPS.length) return "endgame_instruction_intro";
  if (state.popupSwarmStarted) return "endgame_popup_swarm";
  if (state.desktopCorrupted) return "endgame_desktop_corrupted";
  if (state.endgameStarted) return "endgame_scope_expands";
  return "endgame_ready";
}

export function startEndgame(state) {
  if (!state.endgameAvailable) return state;
  return { ...state, endgameStarted: true };
}

export function advanceScopeDialogue(state) {
  if (endgamePhase(state) !== "endgame_scope_expands") return state;
  if (state.scopeDialogueIndex < 2) return { ...state, scopeDialogueIndex: state.scopeDialogueIndex + 1 };
  return { ...state, desktopCorrupted: true, takeoverDialogueIndex: 0 };
}

export function advanceTakeoverDialogue(state) {
  if (endgamePhase(state) !== "endgame_desktop_corrupted") return state;
  if (state.takeoverDialogueIndex < 3) return { ...state, takeoverDialogueIndex: state.takeoverDialogueIndex + 1 };
  return { ...state, popupSwarmStarted: true };
}

export function closeTopPopup(state, popupId) {
  if (endgamePhase(state) !== "endgame_popup_swarm") return state;
  const nextPopup = ENDGAME_POPUPS.find(({ id }) => !state.closedPopupIds.includes(id));
  if (!nextPopup || nextPopup.id !== popupId) return state;
  return { ...state, closedPopupIds: [...state.closedPopupIds, popupId] };
}

export function openInstructionBuilder(state) {
  if (endgamePhase(state) !== "endgame_instruction_intro") return state;
  return { ...state, instructionBuilderOpened: true };
}

export function answerCurrentLesson(state, { optionId, siteId } = {}) {
  if (endgamePhase(state) !== "endgame_lesson_lock") return { correct: false, state };
  const fixture = ENDGAME_SITE_FIXTURES[state.currentLessonIndex];
  if (!fixture || fixture.id !== siteId) return { correct: false, state };
  const option = fixture.options.find(({ id }) => id === optionId);
  if (!option?.correct) return { correct: false, state };
  if (state.lockedSiteIds.includes(siteId)) return { correct: true, state };
  const lockedSiteIds = [...state.lockedSiteIds, siteId];
  return {
    correct: true,
    state: {
      ...state,
      lockedSiteIds,
      currentLessonIndex: lockedSiteIds.length,
    },
  };
}

export function sendFinalInstruction(state) {
  if (endgamePhase(state) !== "endgame_final_instruction") return state;
  return { ...state, finalInstructionSent: true };
}

export function restoreDesktop(state) {
  if (endgamePhase(state) !== "endgame_desktop_restored") return state;
  return { ...state, desktopRestored: true };
}

export function completeCelebration(state) {
  if (endgamePhase(state) !== "endgame_techno_celebration") return state;
  return { ...state, celebrationSeen: true, endgameComplete: true, completedOnce: true };
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
  state.endgameStarted = true;
  if (beat === "endgame_scope_expands") return state;
  state.scopeDialogueIndex = 2;
  state.desktopCorrupted = true;
  if (beat === "endgame_desktop_corrupted") return state;
  state.takeoverDialogueIndex = 3;
  state.popupSwarmStarted = true;
  if (beat === "endgame_popup_swarm") return state;
  state.closedPopupIds = ENDGAME_POPUPS.map(({ id }) => id);
  if (beat === "endgame_instruction_intro") return state;
  state.instructionBuilderOpened = true;
  if (beat === "endgame_lesson_lock") return state;
  state.lockedSiteIds = [...ENDGAME_SITE_ORDER];
  state.currentLessonIndex = ENDGAME_SITE_ORDER.length;
  if (beat === "endgame_final_instruction") return state;
  state.finalInstructionSent = true;
  if (beat === "endgame_desktop_restored") return state;
  state.desktopRestored = true;
  if (beat === "endgame_techno_celebration") return state;
  state.celebrationSeen = true;
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
