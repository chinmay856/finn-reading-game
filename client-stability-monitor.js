const EVENT_STORE_KEY = "internet-recovery-98-stability-events-v1";
const SESSION_STORE_KEY = "internet-recovery-98-stability-session-v1";
const MAX_EVENTS = 40;

function parseJson(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}

function safeText(value, maximumLength = 160) {
  return String(value ?? "")
    .replace(/https?:\/\/[^\s?#]+(?:\?[^\s#]*)?/gu, (url) => url.split("?")[0])
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, maximumLength);
}

function storageRead(storage, key, fallback) {
  try {
    return parseJson(storage?.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

function storageWrite(storage, key, value) {
  try {
    storage?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function randomSessionId(runtime) {
  return runtime.crypto?.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function errorName(error) {
  return safeText(error?.name || error?.constructor?.name || "Error", 48);
}

export function installClientStabilityMonitor({ runtime = globalThis } = {}) {
  if (runtime.__internetRecovery98StabilityMonitor) return runtime.__internetRecovery98StabilityMonitor;

  const previous = storageRead(runtime.sessionStorage, SESSION_STORE_KEY, null);
  const recoveredFromUncleanExit = Boolean(previous?.active === true);
  const sessionId = randomSessionId(runtime);
  const route = safeText(runtime.location?.pathname || "unknown", 96);
  let stage = "boot";
  let closed = false;

  function readEvents() {
    const records = storageRead(runtime.localStorage, EVENT_STORE_KEY, []);
    return Array.isArray(records) ? records : [];
  }

  function record(type, details = {}) {
    const recordDetails = {};
    for (const [key, value] of Object.entries(details)) {
      if (value === undefined || value === null || value === "") continue;
      recordDetails[safeText(key, 40)] = typeof value === "number" || typeof value === "boolean"
        ? value
        : safeText(value);
    }
    const records = readEvents();
    records.push({
      at: new Date().toISOString(),
      details: recordDetails,
      route,
      sessionId,
      stage,
      type: safeText(type, 64),
    });
    storageWrite(runtime.localStorage, EVENT_STORE_KEY, records.slice(-MAX_EVENTS));
  }

  function writeSession(active = true) {
    storageWrite(runtime.sessionStorage, SESSION_STORE_KEY, {
      active,
      sessionId,
      stage,
      updatedAt: new Date().toISOString(),
    });
  }

  function markStage(nextStage, details = {}) {
    stage = safeText(nextStage, 64) || "unknown";
    writeSession(true);
    record("stage", details);
  }

  function close(reason = "pagehide") {
    if (closed) return;
    closed = true;
    record("clean-exit", { reason });
    writeSession(false);
  }

  function report() {
    return Object.freeze({
      events: Object.freeze(readEvents()),
      generatedAt: new Date().toISOString(),
      privacy: "No audio, transcripts, passage text, player names, or browsing history are recorded.",
      recoveredFromUncleanExit,
      version: 1,
    });
  }

  runtime.addEventListener?.("error", (event) => {
    record("script-error", {
      error: errorName(event?.error),
      message: safeText(event?.message),
    });
  });
  runtime.addEventListener?.("unhandledrejection", (event) => {
    record("unhandled-rejection", {
      error: errorName(event?.reason),
      message: safeText(event?.reason?.message || event?.reason),
    });
  });
  runtime.addEventListener?.("pagehide", () => close("pagehide"), { once: true });

  writeSession(true);
  record("session-start", { recoveredFromUncleanExit });

  const monitor = Object.freeze({
    close,
    markStage,
    record,
    recoveredFromUncleanExit,
    report,
    sessionId,
  });
  runtime.__internetRecovery98StabilityMonitor = monitor;
  return monitor;
}

export { EVENT_STORE_KEY, MAX_EVENTS, SESSION_STORE_KEY };
