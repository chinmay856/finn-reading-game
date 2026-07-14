export const SHERPA_CLEANUP_WORKER_PATH = "sherpa-runtime-cache-sw.js";
export const SHERPA_CLEANUP_READY_MESSAGE = "finn-sherpa-opfs-cleanup-ready";

const migrationsByRuntime = new WeakMap();

function delay(runtime, milliseconds) {
  return new Promise((resolve) => runtime.setTimeout(resolve, milliseconds));
}

function probeCleanupWorker(runtime, worker, timeoutMs = 500) {
  if (!worker || typeof runtime.MessageChannel !== "function") return Promise.resolve(false);
  return new Promise((resolve) => {
    const channel = new runtime.MessageChannel();
    let settled = false;
    const finish = (ready) => {
      if (settled) return;
      settled = true;
      runtime.clearTimeout(timeout);
      channel.port1.close?.();
      resolve(ready);
    };
    const timeout = runtime.setTimeout(() => finish(false), timeoutMs);
    channel.port1.onmessage = ({ data }) => finish(data?.type === SHERPA_CLEANUP_READY_MESSAGE);
    channel.port1.onmessageerror = () => finish(false);
    try {
      worker.postMessage({ type: SHERPA_CLEANUP_READY_MESSAGE }, [channel.port2]);
    } catch {
      finish(false);
    }
  });
}

async function waitForWorker(runtime, registration, timeoutMs) {
  const immediate = registration.installing ?? registration.waiting;
  if (immediate) return immediate;
  if (registration.active && await probeCleanupWorker(runtime, registration.active)) {
    return registration.active;
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    const timeout = runtime.setTimeout(() => {
      if (settled) return;
      settled = true;
      registration.removeEventListener?.("updatefound", onUpdateFound);
      reject(new Error("The no-fetch Sherpa migration worker did not install."));
    }, timeoutMs);
    async function onUpdateFound() {
      let worker = registration.installing ?? registration.waiting;
      if (!worker && registration.active && await probeCleanupWorker(runtime, registration.active)) {
        worker = registration.active;
      }
      if (!worker) return;
      if (settled) return;
      settled = true;
      runtime.clearTimeout(timeout);
      registration.removeEventListener?.("updatefound", onUpdateFound);
      resolve(worker);
    }
    registration.addEventListener?.("updatefound", onUpdateFound);
    onUpdateFound();
  });
}

function waitForActivation(runtime, worker, timeoutMs) {
  if (worker.state === "activated") return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeout = runtime.setTimeout(() => {
      worker.removeEventListener?.("statechange", onStateChange);
      reject(new Error("The no-fetch Sherpa migration worker did not activate."));
    }, timeoutMs);
    function onStateChange() {
      if (worker.state === "redundant") {
        runtime.clearTimeout(timeout);
        worker.removeEventListener?.("statechange", onStateChange);
        reject(new Error("The no-fetch Sherpa migration worker became redundant."));
      } else if (worker.state === "activated") {
        runtime.clearTimeout(timeout);
        worker.removeEventListener?.("statechange", onStateChange);
        resolve();
      }
    }
    worker.addEventListener?.("statechange", onStateChange);
    onStateChange();
  });
}

async function waitForCleanupController(runtime, candidate, timeoutMs) {
  const serviceWorker = runtime.navigator.serviceWorker;
  const deadline = Date.now() + timeoutMs;
  await probeCleanupWorker(runtime, candidate);
  while (Date.now() < deadline) {
    if (await probeCleanupWorker(runtime, serviceWorker.controller)) {
      return serviceWorker.controller;
    }
    await delay(runtime, 50);
  }
  throw new Error("The no-fetch Sherpa migration worker did not claim this page.");
}

async function beginMigration(runtime, timeoutMs) {
  const serviceWorker = runtime.navigator?.serviceWorker;
  if (!serviceWorker) return Object.freeze({ ready: false, reason: "service-worker-unsupported" });
  if (!runtime.document?.baseURI || typeof runtime.MessageChannel !== "function") {
    if (serviceWorker.controller) {
      throw new Error("The old Sherpa cache worker cannot be replaced in this browser.");
    }
    return Object.freeze({ ready: false, reason: "migration-unsupported" });
  }
  if (await probeCleanupWorker(runtime, serviceWorker.controller)) {
    return Object.freeze({ ready: true, replacedOldCacheWorker: false });
  }

  const workerUrl = new URL(SHERPA_CLEANUP_WORKER_PATH, runtime.document.baseURI);
  const scopeUrl = new URL("./", runtime.document.baseURI);
  if (typeof serviceWorker.getRegistration === "function") {
    let existingRegistration;
    try {
      existingRegistration = await serviceWorker.getRegistration(scopeUrl.href);
    } catch (error) {
      if (serviceWorker.controller) throw error;
      return Object.freeze({ ready: true, replacedOldCacheWorker: false });
    }
    if (!existingRegistration && !serviceWorker.controller) {
      return Object.freeze({ ready: true, replacedOldCacheWorker: false });
    }
  }
  const registration = await serviceWorker.register(workerUrl.href, {
    scope: scopeUrl.pathname,
    type: "classic",
    updateViaCache: "none",
  });
  try {
    await registration.update?.();
  } catch (error) {
    if (!registration.installing && !registration.waiting) throw error;
  }
  if (await probeCleanupWorker(runtime, serviceWorker.controller)) {
    return Object.freeze({ ready: true, replacedOldCacheWorker: true });
  }
  const candidate = await waitForWorker(runtime, registration, timeoutMs);
  await waitForActivation(runtime, candidate, timeoutMs);
  await waitForCleanupController(runtime, candidate, timeoutMs);
  return Object.freeze({ ready: true, replacedOldCacheWorker: true });
}

export function ensureSherpaOpfsMigration({ runtime = globalThis, timeoutMs = 15_000 } = {}) {
  if ((typeof runtime !== "object" && typeof runtime !== "function") || runtime === null) {
    throw new TypeError("A browser runtime object is required for the Sherpa OPFS migration.");
  }
  const existing = migrationsByRuntime.get(runtime);
  if (existing) return existing;
  const migration = beginMigration(runtime, timeoutMs);
  const tracked = migration.catch((error) => {
    if (migrationsByRuntime.get(runtime) === tracked) migrationsByRuntime.delete(runtime);
    throw error;
  });
  migrationsByRuntime.set(runtime, tracked);
  return tracked;
}
