export const WIKIWHY_DIAGNOSTIC_KEY = "internet-recovery-98.wikiwhy.diagnostics.v1";
export const DIAGNOSTIC_PASSAGE_ADVANCE = 19;

const EMPTY_DIAGNOSTIC_STATE = Object.freeze({
  phase: "act-one",
  shieldPass: 0,
  shieldProgress: 0,
  simulatedPassages: 0,
  stability: 0,
  version: 1,
});

function normalizeState(value) {
  if (value?.version !== 1) return EMPTY_DIAGNOSTIC_STATE;
  const allowedPhases = new Set(["act-one", "reverse-hack", "shield", "secured"]);
  const phase = allowedPhases.has(value.phase) ? value.phase : "act-one";
  return Object.freeze({
    phase,
    shieldPass: Math.min(3, Math.max(0, Number(value.shieldPass) || 0)),
    shieldProgress: Math.min(100, Math.max(0, Number(value.shieldProgress) || 0)),
    simulatedPassages: Math.max(0, Number(value.simulatedPassages) || 0),
    stability: Math.min(80, Math.max(0, Number(value.stability) || 0)),
    version: 1,
  });
}

export function readWikiWhyDiagnosticState(storage) {
  if (!storage) return EMPTY_DIAGNOSTIC_STATE;
  try {
    return normalizeState(JSON.parse(storage.getItem(WIKIWHY_DIAGNOSTIC_KEY) ?? "null"));
  } catch {
    return EMPTY_DIAGNOSTIC_STATE;
  }
}

export function saveWikiWhyDiagnosticState(storage, value) {
  const state = normalizeState(value);
  if (!storage) return Object.freeze({ ok: false, reason: "unavailable", state });
  try {
    storage.setItem(WIKIWHY_DIAGNOSTIC_KEY, JSON.stringify(state));
    return Object.freeze({ ok: true, state });
  } catch {
    return Object.freeze({ ok: false, reason: "write-failed", state });
  }
}

export function advanceWikiWhyDiagnostic(currentValue) {
  const current = normalizeState(currentValue);
  if (current.phase === "secured") return Object.freeze({ event: "already-secured", state: current });
  if (current.phase === "reverse-hack") return Object.freeze({ event: "reverse-hack-ready", state: current });

  if (current.phase === "shield") {
    const shieldPass = Math.min(3, current.shieldPass + 1);
    const shieldProgress = [0, 33, 66, 100][shieldPass];
    return Object.freeze({
      event: shieldPass === 3 ? "site-secured" : "shield-pass-complete",
      state: normalizeState({
        ...current,
        phase: shieldPass === 3 ? "secured" : "shield",
        shieldPass,
        shieldProgress,
        simulatedPassages: current.simulatedPassages + 1,
      }),
    });
  }

  const stability = Math.min(80, current.stability + DIAGNOSTIC_PASSAGE_ADVANCE);
  const crossedWarning = current.stability < 70 && stability >= 70;
  return Object.freeze({
    event: stability === 80 ? "reverse-hack-ready" : crossedWarning ? "amy-warning" : "passage-complete",
    state: normalizeState({
      ...current,
      phase: stability === 80 ? "reverse-hack" : "act-one",
      simulatedPassages: current.simulatedPassages + 1,
      stability,
    }),
  });
}

export function beginWikiWhyShieldProtocol(currentValue) {
  const current = normalizeState(currentValue);
  return Object.freeze({
    event: "shield-intro",
    state: normalizeState({ ...current, phase: "shield", shieldPass: 0, shieldProgress: 0 }),
  });
}

export function resetWikiWhyDiagnosticState(storage) {
  if (!storage) return Object.freeze({ ok: false, reason: "unavailable", state: EMPTY_DIAGNOSTIC_STATE });
  try {
    storage.removeItem(WIKIWHY_DIAGNOSTIC_KEY);
    return Object.freeze({ ok: true, state: EMPTY_DIAGNOSTIC_STATE });
  } catch {
    return Object.freeze({ ok: false, reason: "write-failed", state: EMPTY_DIAGNOSTIC_STATE });
  }
}
