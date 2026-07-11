import assert from "node:assert/strict";
import test from "node:test";

import {
  createStoredSession,
  readSessionHistory,
  saveSessionSummary,
  updateSessionComprehension,
} from "../reading-session-store.js";
import { readWikiWhyState, recordWikiWhyRepair } from "../apps/internet-recovery/wikiwhy-state.js";

class MemoryStorage {
  constructor({ failWrites = false } = {}) {
    this.failWrites = failWrites;
    this.values = new Map();
  }

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    if (this.failWrites) throw new Error("storage blocked");
    this.values.set(key, value);
  }
}

function details(index = 1) {
  return {
    completedAt: `2026-07-11T00:00:${String(index).padStart(2, "0")}Z`,
    passageId: "wikiwhy.photosynthesis.a01",
    result: {
      accuracy: 91,
      audio: "must not persist",
      durationMs: 42_000,
      matchedWords: 161,
      progress: 0.96,
      totalWords: 177,
      transcript: "must not persist",
      wpm: 243,
    },
    sessionId: `session-${index}`,
  };
}

test("stored reading summaries contain only the approved non-audio fields", () => {
  const session = createStoredSession(details());
  assert.deepEqual(Object.keys(session).sort(), [
    "accuracy", "completedAt", "comprehension", "durationMs", "matchedWords",
    "passageId", "progress", "sessionId", "totalWords", "version", "wpm",
  ]);
  assert.doesNotMatch(JSON.stringify(session), /audio|transcript|userAgent/i);
});

test("session history is newest-first and capped at 20 records", () => {
  const storage = new MemoryStorage();
  for (let index = 1; index <= 25; index += 1) saveSessionSummary(storage, details(index));
  const sessions = readSessionHistory(storage);
  assert.equal(sessions.length, 20);
  assert.equal(sessions[0].sessionId, "session-25");
  assert.equal(sessions.at(-1).sessionId, "session-6");
});

test("malformed or blocked storage never interrupts the reading flow", () => {
  const malformed = new MemoryStorage();
  malformed.setItem("reading-platform.session-history.v1", "not-json");
  assert.deepEqual(readSessionHistory(malformed), []);
  assert.deepEqual(saveSessionSummary(new MemoryStorage({ failWrites: true }), details()), {
    ok: false,
    reason: "write-failed",
  });
});

test("comprehension outcome can be added without transcript data", () => {
  const storage = new MemoryStorage();
  saveSessionSummary(storage, details());
  assert.equal(updateSessionComprehension(storage, "session-1", "supported"), true);
  assert.equal(readSessionHistory(storage)[0].comprehension, "supported");
});

test("WikiWhy repair state stays wrapper-specific and tolerates blocked storage", () => {
  const storage = new MemoryStorage();
  const first = recordWikiWhyRepair(storage, {
    passageId: "wikiwhy.photosynthesis.a01",
    repairedAt: "2026-07-11T00:00:00Z",
  });
  const second = recordWikiWhyRepair(storage, {
    passageId: "wikiwhy.photosynthesis.a01",
    repairedAt: "2026-07-11T00:01:00Z",
  });
  assert.equal(first.ok, true);
  assert.equal(second.state.repairCount, 2);
  assert.equal(readWikiWhyState(storage).status, "stable-for-now");
  assert.equal(recordWikiWhyRepair(new MemoryStorage({ failWrites: true }), {
    passageId: "passage",
    repairedAt: "now",
  }).ok, false);
});
