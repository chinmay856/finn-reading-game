import assert from "node:assert/strict";
import test from "node:test";

import {
  PINNED_SHERPA_ASSET_BASE_PATH,
  PINNED_SHERPA_CACHE_CONTROL,
  PINNED_SHERPA_VERSION,
  loadPinnedSherpaRuntime,
  resolvePinnedSherpaAssetBase,
} from "../speech/sherpa-runtime-loader.js";

function mockBrowser({ failScript = null, failOnce = false, initialize = true, beforeMain } = {}) {
  const appended = [];
  const listeners = new WeakMap();
  let scriptFailed = false;
  const runtime = {};
  const document = {
    baseURI: "https://example.test/finn-reading-game/index.html",
    createElement(tagName) {
      assert.equal(tagName, "script");
      const script = {
        addEventListener(type, listener) {
          const events = listeners.get(script) ?? {};
          events[type] = listener;
          listeners.set(script, events);
        },
      };
      return script;
    },
    head: {
      appendChild(script) {
        appended.push(script.src);
        queueMicrotask(() => {
          const events = listeners.get(script);
          if (script.src.endsWith(failScript ?? "__never__") && (!failOnce || !scriptFailed)) {
            scriptFailed = true;
            events.error();
            return;
          }
          if (script.src.endsWith("sherpa-onnx-asr.js")) {
            runtime.createOnlineRecognizer = () => ({});
          }
          if (script.src.endsWith("sherpa-onnx-wasm-main-asr.js")) {
            beforeMain?.(runtime);
          }
          events.load();
          if (initialize && script.src.endsWith("sherpa-onnx-wasm-main-asr.js")) {
            queueMicrotask(() => runtime.Module.onRuntimeInitialized());
          }
        });
      },
    },
  };
  runtime.document = document;
  return { appended, runtime };
}

test("exports the exact pinned version and resolves the default base from document.baseURI", () => {
  const { runtime } = mockBrowser();
  assert.equal(PINNED_SHERPA_VERSION, "v1.13.2");
  assert.equal(PINNED_SHERPA_ASSET_BASE_PATH, "sherpa/v1.13.2/");
  assert.equal(PINNED_SHERPA_CACHE_CONTROL, "public, max-age=31536000, immutable");
  assert.equal(
    resolvePinnedSherpaAssetBase({ runtime }),
    "https://example.test/finn-reading-game/sherpa/v1.13.2/",
  );
});

test("injects the OPFS buffer synchronously before the main script and preserves Module hooks", async () => {
  const packageBuffer = new ArrayBuffer(8);
  const hookCalls = [];
  let initialized = 0;
  let observedPackage;
  const { appended, runtime } = mockBrowser({
    beforeMain(activeRuntime) {
      observedPackage = activeRuntime.Module.getPreloadedPackage(
        "https://example.test/finn-reading-game/sherpa/v1.13.2/sherpa-onnx-wasm-main-asr.data",
        190_951_044,
      );
    },
  });
  runtime.Module = {
    getPreloadedPackage(name, size) {
      hookCalls.push({ name, size });
      return undefined;
    },
    onRuntimeInitialized() {
      initialized += 1;
    },
  };
  const progress = [];
  await loadPinnedSherpaRuntime({
    onDataProgress: (detail) => progress.push(detail),
    prepareDataPackage: async ({ assetBase, onProgress, runtime: activeRuntime }) => {
      assert.equal(activeRuntime, runtime);
      assert.equal(assetBase, "https://example.test/finn-reading-game/sherpa/v1.13.2/");
      onProgress({ loaded: 8, total: 8 });
      return { buffer: packageBuffer, source: "opfs" };
    },
    runtime,
  });

  assert.equal(observedPackage, packageBuffer);
  assert.equal(hookCalls.length, 1);
  assert.equal(initialized, 1);
  assert.equal(progress.length, 1);
  assert.equal(appended.at(-1), "https://example.test/finn-reading-game/sherpa/v1.13.2/sherpa-onnx-wasm-main-asr.js");
});

test("concurrent callers share one promise and classic scripts load in dependency order", async () => {
  const { appended, runtime } = mockBrowser();
  const statuses = [];
  const first = loadPinnedSherpaRuntime({ runtime, onStatus: (status) => statuses.push(status) });
  const second = loadPinnedSherpaRuntime({ runtime });
  assert.equal(first, second);
  const loadedRuntime = await first;
  assert.equal(loadedRuntime, runtime);
  assert.deepEqual(appended, [
    "https://example.test/finn-reading-game/sherpa/v1.13.2/sherpa-onnx-asr.js",
    "https://example.test/finn-reading-game/sherpa/v1.13.2/sherpa-onnx-wasm-main-asr.js",
  ]);
  assert.equal(
    runtime.Module.locateFile("sherpa-onnx-wasm-main-asr.data"),
    "https://example.test/finn-reading-game/sherpa/v1.13.2/sherpa-onnx-wasm-main-asr.data",
  );
  runtime.Module.setStatus("Downloading data...");
  assert.deepEqual(statuses, ["Downloading data..."]);
});

test("does not resolve when the runtime script loaded but Emscripten is not initialized", async () => {
  const { runtime } = mockBrowser({ initialize: false });
  let resolved = false;
  const loading = loadPinnedSherpaRuntime({ runtime }).then(() => { resolved = true; });
  await new Promise((resolvePromise) => setImmediate(resolvePromise));
  assert.equal(resolved, false);
  runtime.Module.onRuntimeInitialized();
  await loading;
  assert.equal(resolved, true);
});

test("rejects with the exact failed script URL instead of hiding a load failure", async () => {
  const { runtime } = mockBrowser({ failScript: "sherpa-onnx-asr.js" });
  await assert.rejects(
    loadPinnedSherpaRuntime({ runtime, assetBase: "/speech-assets/" }),
    /Failed to load.*https:\/\/example\.test\/speech-assets\/sherpa-onnx-asr\.js/u,
  );
});

test("a failed asset request can be retried after the browser recovers", async () => {
  const { appended, runtime } = mockBrowser({ failScript: "sherpa-onnx-asr.js", failOnce: true });
  await assert.rejects(loadPinnedSherpaRuntime({ runtime }), /Failed to load/u);
  await loadPinnedSherpaRuntime({ runtime });
  assert.equal(appended.filter((source) => source.endsWith("sherpa-onnx-asr.js")).length, 2);
});

test("rejects an Emscripten abort with its original reason", async () => {
  const { runtime } = mockBrowser({ initialize: false });
  const loading = loadPinnedSherpaRuntime({ runtime });
  await new Promise((resolvePromise) => setImmediate(resolvePromise));
  runtime.Module.onAbort("out of memory");
  await assert.rejects(loading, /aborted: out of memory/u);
});
