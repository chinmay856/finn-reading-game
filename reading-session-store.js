export const SESSION_HISTORY_KEY = "reading-platform.session-history.v1";
export const SESSION_HISTORY_VERSION = 1;
const MAX_SESSIONS = 20;

function finiteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

export function createStoredSession({ completedAt, comprehension = "not-attempted", passageId, result, sessionId }) {
  return Object.freeze({
    accuracy: finiteNumber(result?.accuracy),
    completedAt: String(completedAt),
    comprehension,
    durationMs: finiteNumber(result?.durationMs),
    matchedWords: finiteNumber(result?.matchedWords),
    passageId: String(passageId),
    progress: finiteNumber(result?.progress),
    sessionId: String(sessionId),
    totalWords: finiteNumber(result?.totalWords),
    version: SESSION_HISTORY_VERSION,
    wpm: finiteNumber(result?.wpm),
  });
}

export function readSessionHistory(storage) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(SESSION_HISTORY_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((session) => session?.version === SESSION_HISTORY_VERSION).slice(0, MAX_SESSIONS);
  } catch {
    return [];
  }
}

export function saveSessionSummary(storage, details) {
  if (!storage) return Object.freeze({ ok: false, reason: "unavailable" });
  const session = createStoredSession(details);
  try {
    const sessions = readSessionHistory(storage).filter(({ sessionId }) => sessionId !== session.sessionId);
    storage.setItem(SESSION_HISTORY_KEY, JSON.stringify([session, ...sessions].slice(0, MAX_SESSIONS)));
    return Object.freeze({ ok: true, session });
  } catch {
    return Object.freeze({ ok: false, reason: "write-failed" });
  }
}

export function updateSessionComprehension(storage, sessionId, comprehension) {
  if (!storage) return false;
  try {
    const sessions = readSessionHistory(storage);
    const index = sessions.findIndex((session) => session.sessionId === sessionId);
    if (index < 0) return false;
    sessions[index] = { ...sessions[index], comprehension };
    storage.setItem(SESSION_HISTORY_KEY, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
}
