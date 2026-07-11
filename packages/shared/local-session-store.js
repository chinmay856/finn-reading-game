const STORAGE_KEY = "game-for-finn.reading-sessions.v1";

export function readSessions(storage = globalThis.localStorage) {
  if (!storage) return [];
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function saveSession(result, storage = globalThis.localStorage) {
  if (!storage) return;
  const sessions = readSessions(storage);
  const safeRecord = {
    passageId: result.passageId,
    completed: result.completed,
    accuracyEstimate: result.accuracyEstimate,
    wordsPerMinute: result.wordsPerMinute,
    durationMs: result.durationMs,
    recordedAt: new Date().toISOString(),
  };
  storage.setItem(STORAGE_KEY, JSON.stringify([...sessions.slice(-19), safeRecord]));
}

export function latestSessionFor(passageId, storage = globalThis.localStorage) {
  return readSessions(storage).findLast?.((session) => session.passageId === passageId)
    ?? [...readSessions(storage)].reverse().find((session) => session.passageId === passageId)
    ?? null;
}
