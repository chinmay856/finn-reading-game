import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  SHERPA_CLEANUP_READY_MESSAGE,
  ensureSherpaOpfsMigration,
} from "../speech/sherpa-runtime-migration.js";

function mockMigrationRuntime() {
  const calls = { oldPings: 0, registrations: [], updates: 0 };
  class MockMessageChannel {
    constructor() {
      let listener = null;
      this.port1 = {
        close() {},
        get onmessage() { return listener; },
        set onmessage(value) { listener = value; },
        onmessageerror: null,
      };
      this.port2 = {
        postMessage(data) { queueMicrotask(() => listener?.({ data })); },
      };
    }
  }
  const oldController = {
    postMessage(_message, ports) {
      calls.oldPings += 1;
      ports[0].postMessage({ type: "old-cache-worker" });
    },
  };
  const cleanupController = {
    postMessage(message, ports) {
      assert.equal(message.type, SHERPA_CLEANUP_READY_MESSAGE);
      ports[0].postMessage({ type: SHERPA_CLEANUP_READY_MESSAGE });
    },
    state: "activated",
  };
  const serviceWorker = {
    controller: oldController,
    async getRegistration() {
      return { active: oldController };
    },
    async register(url, options) {
      calls.registrations.push({ options, url });
      serviceWorker.controller = cleanupController;
      return {
        active: cleanupController,
        installing: cleanupController,
        async update() { calls.updates += 1; },
      };
    },
  };
  return {
    calls,
    runtime: {
      MessageChannel: MockMessageChannel,
      clearTimeout,
      document: { baseURI: "https://example.test/finn-reading-game/index.html" },
      navigator: { serviceWorker },
      setTimeout,
    },
  };
}

test("an existing cache worker is replaced before the OPFS data request can start", async () => {
  const { calls, runtime } = mockMigrationRuntime();
  const first = ensureSherpaOpfsMigration({ runtime, timeoutMs: 100 });
  const second = ensureSherpaOpfsMigration({ runtime, timeoutMs: 100 });
  assert.equal(first, second);
  assert.deepEqual(await first, { ready: true, replacedOldCacheWorker: true });
  assert.ok(calls.oldPings >= 1);
  assert.equal(calls.updates, 1);
  assert.deepEqual(calls.registrations, [{
    options: {
      scope: "/finn-reading-game/",
      type: "classic",
      updateViaCache: "none",
    },
    url: "https://example.test/finn-reading-game/sherpa-runtime-cache-sw.js",
  }]);
});

test("a fresh user with no registration proceeds to OPFS without installing a worker", async () => {
  let registrations = 0;
  const runtime = {
    clearTimeout,
    document: { baseURI: "https://example.test/finn-reading-game/index.html" },
    MessageChannel: class {},
    navigator: {
      serviceWorker: {
        controller: null,
        async getRegistration(scope) {
          assert.equal(scope, "https://example.test/finn-reading-game/");
          return undefined;
        },
        async register() {
          registrations += 1;
        },
      },
    },
    setTimeout,
  };
  assert.deepEqual(await ensureSherpaOpfsMigration({ runtime }), {
    ready: true,
    replacedOldCacheWorker: false,
  });
  assert.equal(registrations, 0);
});

test("the deployed migration worker deletes old Finn caches and has no fetch handler", async () => {
  const source = await readFile(
    new URL("../public/sherpa-runtime-cache-sw.js", import.meta.url),
    "utf8",
  );
  assert.match(source, /name\.startsWith\(CACHE_PREFIX\)/u);
  assert.match(source, /caches\.delete\(name\)/u);
  assert.match(source, /self\.clients\.claim\(\)/u);
  assert.match(source, /finn-sherpa-opfs-cleanup-ready/u);
  assert.doesNotMatch(source, /addEventListener\("fetch"|respondWith|cache\.put|fetch\(/u);
});
