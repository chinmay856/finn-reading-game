export const WIKIWHY_STATE_KEY = "internet-recovery-98.wikiwhy.prototype.v1";

const EMPTY_STATE = Object.freeze({ lastPassageId: null, lastRepairAt: null, repairCount: 0, status: "corrupted", version: 1 });

export function readWikiWhyState(storage) {
  if (!storage) return EMPTY_STATE;
  try {
    const parsed = JSON.parse(storage.getItem(WIKIWHY_STATE_KEY) ?? "null");
    if (parsed?.version !== 1) return EMPTY_STATE;
    return Object.freeze({
      lastPassageId: parsed.lastPassageId ?? null,
      lastRepairAt: parsed.lastRepairAt ?? null,
      repairCount: Number.isFinite(parsed.repairCount) ? parsed.repairCount : 0,
      status: parsed.status === "stable-for-now" ? parsed.status : "corrupted",
      version: 1,
    });
  } catch {
    return EMPTY_STATE;
  }
}

export function recordWikiWhyRepair(storage, { passageId, repairedAt }) {
  if (!storage) return Object.freeze({ ok: false, reason: "unavailable" });
  const current = readWikiWhyState(storage);
  const next = Object.freeze({
    lastPassageId: String(passageId),
    lastRepairAt: String(repairedAt),
    repairCount: current.repairCount + 1,
    status: "stable-for-now",
    version: 1,
  });
  try {
    storage.setItem(WIKIWHY_STATE_KEY, JSON.stringify(next));
    return Object.freeze({ ok: true, state: next });
  } catch {
    return Object.freeze({ ok: false, reason: "write-failed" });
  }
}
