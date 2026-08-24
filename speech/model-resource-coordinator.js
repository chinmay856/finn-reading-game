export const SHERPA_MODEL_LEASE_NAME = "finn-reading-sherpa-v1.13.2";

function inertLease({ acquired, coordinated, reason }) {
  return Object.freeze({
    acquired,
    coordinated,
    reason,
    release() {},
  });
}

export async function acquireExclusiveModelLease({
  name = SHERPA_MODEL_LEASE_NAME,
  runtime = globalThis,
} = {}) {
  const locks = runtime.navigator?.locks;
  if (typeof locks?.request !== "function") {
    return inertLease({ acquired: true, coordinated: false, reason: "web-locks-unavailable" });
  }

  let releaseHold;
  const hold = new Promise((resolve) => { releaseHold = resolve; });
  let resolveAcquisition;
  const acquisition = new Promise((resolve) => { resolveAcquisition = resolve; });
  let acquisitionSettled = false;
  const settleAcquisition = (result) => {
    if (acquisitionSettled) return;
    acquisitionSettled = true;
    resolveAcquisition(result);
  };

  try {
    void locks.request(name, { ifAvailable: true, mode: "exclusive" }, async (lock) => {
      if (!lock) {
        settleAcquisition(false);
        return;
      }
      settleAcquisition(true);
      await hold;
    }).catch(() => settleAcquisition(false));
  } catch {
    settleAcquisition(false);
  }

  const acquired = await acquisition;
  if (!acquired) {
    return inertLease({ acquired: false, coordinated: true, reason: "already-in-use" });
  }

  let released = false;
  return Object.freeze({
    acquired: true,
    coordinated: true,
    reason: "exclusive",
    release() {
      if (released) return;
      released = true;
      releaseHold();
    },
  });
}
