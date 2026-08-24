import assert from "node:assert/strict";
import test from "node:test";

import {
  EVENT_STORE_KEY,
  MAX_EVENTS,
  SESSION_STORE_KEY,
  installClientStabilityMonitor,
} from "../client-stability-monitor.js";

function createStorage(seed = new Map()) {
  return {
    getItem(key) { return seed.has(key) ? seed.get(key) : null; },
    setItem(key, value) { seed.set(key, String(value)); },
  };
}

function createRuntime({ localSeed = new Map(), sessionSeed = new Map() } = {}) {
  const listeners = new Map();
  return {
    addEventListener(type, listener) { listeners.set(type, listener); },
    crypto: { randomUUID: () => "stable-session-id" },
    dispatch(type, event = {}) { listeners.get(type)?.(event); },
    localStorage: createStorage(localSeed),
    location: { pathname: "/playable-missions.html" },
    sessionStorage: createStorage(sessionSeed),
  };
}

test("stores only bounded local stability breadcrumbs and a privacy statement", () => {
  const runtime = createRuntime();
  const monitor = installClientStabilityMonitor({ runtime });
  for (let index = 0; index < MAX_EVENTS + 8; index += 1) {
    monitor.markStage(`stage-${index}`, { site: "mycorner" });
  }
  const report = monitor.report();
  assert.equal(report.events.length, MAX_EVENTS);
  assert.match(report.privacy, /No audio, transcripts, passage text, player names/u);
  assert.equal(JSON.stringify(report).includes("stable-session-id"), true);
  assert.equal(runtime.localStorage.getItem(EVENT_STORE_KEY).includes("mycorner"), true);
});

test("detects an unclean prior renderer session and clears the marker on pagehide", () => {
  const localSeed = new Map();
  const sessionSeed = new Map();
  const firstRuntime = createRuntime({ localSeed, sessionSeed });
  const first = installClientStabilityMonitor({ runtime: firstRuntime });
  first.markStage("sherpa-loading");

  const crashedRuntime = createRuntime({ localSeed, sessionSeed });
  const recovered = installClientStabilityMonitor({ runtime: crashedRuntime });
  assert.equal(recovered.recoveredFromUncleanExit, true);

  crashedRuntime.dispatch("pagehide");
  const cleanRecord = JSON.parse(sessionSeed.get(SESSION_STORE_KEY));
  assert.equal(cleanRecord.active, false);
  const nextRuntime = createRuntime({ localSeed, sessionSeed });
  assert.equal(installClientStabilityMonitor({ runtime: nextRuntime }).recoveredFromUncleanExit, false);
});

test("captures script failures without storing URL query strings", () => {
  const runtime = createRuntime();
  const monitor = installClientStabilityMonitor({ runtime });
  runtime.dispatch("error", {
    error: new TypeError("failed"),
    message: "Failed at https://example.test/playable-missions.html?site=mycorner&name=private",
  });
  const report = monitor.report();
  const failure = report.events.find((event) => event.type === "script-error");
  assert.equal(failure.details.error, "TypeError");
  assert.doesNotMatch(failure.details.message, /name=private/u);
});
