import assert from "node:assert/strict";
import test from "node:test";

import {
  ENDGAME_BLOCKED_ATTEMPT_ID,
  ENDGAME_CHECKPOINT_IDS,
  ENDGAME_EVIDENCE_ID,
  ENDGAME_STORAGE_KEY,
  acceptEndgameCheckpoint,
  beginEndgameContainment,
  confirmEndgameRevocation,
  createInitialEndgameState,
  discoverEndgameEvidence,
  makeEndgameAvailable,
  normalizeEndgameState,
  probeEndgameStorage,
  readEndgameState,
} from "../apps/internet-recovery/endgame-state.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
    values,
  };
}

test("the finale remains locked until ten canonical receipts are complete", () => {
  const initial = createInitialEndgameState();
  assert.equal(makeEndgameAvailable(initial, { canonicalComplete: false }).phase, "locked");
  assert.equal(discoverEndgameEvidence(initial, { canonicalComplete: false }).evidenceId, null);
  assert.equal(makeEndgameAvailable(initial, { canonicalComplete: true }).phase, "available");
});

test("opening the completed Case File creates EVIDENCE_11.LIVE once", () => {
  const now = () => new Date("2026-07-12T20:00:00.000Z");
  const discovered = discoverEndgameEvidence(createInitialEndgameState(), { canonicalComplete: true, now });
  assert.equal(discovered.phase, "safety-gate");
  assert.equal(discovered.evidenceId, ENDGAME_EVIDENCE_ID);
  assert.equal(discovered.discoveredAt, "2026-07-12T20:00:00.000Z");
  assert.deepEqual(discoverEndgameEvidence(discovered, { canonicalComplete: true, now }), discovered);
});

test("containment probes write, read, and delete before it starts", () => {
  const storage = memoryStorage();
  assert.equal(probeEndgameStorage(storage), true);
  assert.equal([...storage.values.keys()].some((key) => key.endsWith(".probe")), false);
  const gate = discoverEndgameEvidence(createInitialEndgameState(), { canonicalComplete: true });
  const result = beginEndgameContainment(gate, { storage, now: () => 1 });
  assert.equal(result.storageAvailable, true);
  assert.equal(result.state.phase, "containment");
  assert.ok(storage.getItem(ENDGAME_STORAGE_KEY));
});

test("unavailable storage leaves the safety gate trustworthy and unchanged", () => {
  const storage = { getItem() { throw new Error("blocked"); }, removeItem() {}, setItem() { throw new Error("blocked"); } };
  const gate = discoverEndgameEvidence(createInitialEndgameState(), { canonicalComplete: true });
  const result = beginEndgameContainment(gate, { storage });
  assert.equal(result.storageAvailable, false);
  assert.deepEqual(result.state, gate);
});

test("checkpoint saves are ordered, unseen-only, and fail closed", () => {
  const storage = memoryStorage();
  const gate = discoverEndgameEvidence(createInitialEndgameState(), { canonicalComplete: true });
  let state = beginEndgameContainment(gate, { storage }).state;
  assert.equal(acceptEndgameCheckpoint(state, ENDGAME_CHECKPOINT_IDS[1], { storage }).accepted, false);
  for (const checkpointId of ENDGAME_CHECKPOINT_IDS) {
    const result = acceptEndgameCheckpoint(state, checkpointId, { storage });
    assert.equal(result.accepted, true);
    state = result.state;
  }
  assert.equal(state.phase, "revocation");
  assert.deepEqual(state.checkpointIds, ENDGAME_CHECKPOINT_IDS);
  assert.equal(acceptEndgameCheckpoint(state, ENDGAME_CHECKPOINT_IDS[2], { storage }).accepted, false);
});

test("revocation is a separate durable action after checkpoint three", () => {
  const storage = memoryStorage();
  let state = beginEndgameContainment(
    discoverEndgameEvidence(createInitialEndgameState(), { canonicalComplete: true }),
    { storage },
  ).state;
  for (const checkpointId of ENDGAME_CHECKPOINT_IDS) state = acceptEndgameCheckpoint(state, checkpointId, { storage }).state;
  assert.equal(state.archiveUnlocked, false);
  assert.equal(state.blockedAttemptId, null);
  const result = confirmEndgameRevocation(state, { storage, now: () => new Date("2026-07-12T20:05:00.000Z") });
  assert.equal(result.confirmed, true);
  assert.equal(result.state.phase, "restored");
  assert.equal(result.state.blockedAttemptId, ENDGAME_BLOCKED_ATTEMPT_ID);
  assert.equal(result.state.archiveUnlocked, true);
  assert.equal(readEndgameState(storage).phase, "restored");
});

test("malformed or self-claimed completion cannot manufacture a restored finale", () => {
  const forged = normalizeEndgameState({
    archiveUnlocked: true,
    blockedAttemptId: ENDGAME_BLOCKED_ATTEMPT_ID,
    checkpointIds: [],
    phase: "restored",
    version: 1,
  });
  assert.equal(forged.phase, "locked");
  assert.equal(forged.archiveUnlocked, false);
  assert.equal(forged.blockedAttemptId, null);
});
