import {
  PINNED_SHERPA_ASSET_BASE_PATH,
  PINNED_SHERPA_CACHE_CONTROL,
  PINNED_SHERPA_DATA_FILE,
  PINNED_SHERPA_DATA_SIZE,
  PINNED_SHERPA_VERSION,
} from "./sherpa-runtime-manifest.js";
import { preparePinnedSherpaDataPackage } from "./sherpa-runtime-opfs.js";

export {
  PINNED_SHERPA_ASSET_BASE_PATH,
  PINNED_SHERPA_CACHE_CONTROL,
  PINNED_SHERPA_DATA_FILE,
  PINNED_SHERPA_DATA_SIZE,
  PINNED_SHERPA_VERSION,
};
export const SHERPA_RUNTIME_VERSION = PINNED_SHERPA_VERSION;
export const SHERPA_RUNTIME_BASE_PATH = PINNED_SHERPA_ASSET_BASE_PATH;

const WRAPPER_SCRIPT = "sherpa-onnx-asr.js";
const RUNTIME_SCRIPT = "sherpa-onnx-wasm-main-asr.js";
const loadsByRuntime = new WeakMap();

function requireRuntime(runtime) {
  if ((typeof runtime !== "object" && typeof runtime !== "function") || runtime === null) {
    throw new TypeError("A browser runtime object is required to load sherpa-onnx.");
  }
  return runtime;
}

function requireDocument(runtime) {
  const document = runtime.document;
  if (!document?.baseURI || typeof document.createElement !== "function") {
    throw new Error("A browser document is required to load the pinned sherpa-onnx runtime.");
  }
  if (!document.head || typeof document.head.appendChild !== "function") {
    throw new Error("The browser document has no head where sherpa-onnx scripts can be loaded.");
  }
  return document;
}

export function resolvePinnedSherpaAssetBase({ runtime = globalThis, assetBase } = {}) {
  const document = requireDocument(requireRuntime(runtime));
  const resolved = new URL(assetBase ?? PINNED_SHERPA_ASSET_BASE_PATH, document.baseURI);
  if (!resolved.pathname.endsWith("/")) resolved.pathname += "/";
  return resolved.href;
}

function loadClassicScript(document, source) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = false;
    script.src = source;
    script.addEventListener?.("load", resolve, { once: true });
    script.addEventListener?.("error", () => {
      reject(new Error(`Failed to load the pinned sherpa-onnx script: ${source}`));
    }, { once: true });

    // Tiny test documents and older browser shims may expose event properties only.
    if (typeof script.addEventListener !== "function") {
      script.onload = resolve;
      script.onerror = () => {
        reject(new Error(`Failed to load the pinned sherpa-onnx script: ${source}`));
      };
    }
    document.head.appendChild(script);
  });
}

function alreadyReady(runtime) {
  return Boolean(runtime.Module && typeof runtime.createOnlineRecognizer === "function");
}

function isPinnedDataRequest(packageName, packageSize) {
  return Number(packageSize) === PINNED_SHERPA_DATA_SIZE
    && String(packageName).split(/[?#]/u)[0].endsWith(`/${PINNED_SHERPA_DATA_FILE}`);
}

function beginRuntimeLoad({ runtime, onStatus, onDataProgress, assetBase, prepareDataPackage }) {
  const document = requireDocument(runtime);
  const resolvedAssetBase = resolvePinnedSherpaAssetBase({ runtime, assetBase });
  const previousModule = runtime.Module ?? {};
  const previousSetStatus = previousModule.setStatus;
  const previousOnRuntimeInitialized = previousModule.onRuntimeInitialized;
  const previousOnAbort = previousModule.onAbort;
  const previousGetPreloadedPackage = previousModule.getPreloadedPackage;
  let preloadedDataPackage = null;
  let resolveInitialized;
  let rejectInitialized;
  let settled = false;

  const initialized = new Promise((resolve, reject) => {
    resolveInitialized = resolve;
    rejectInitialized = reject;
  });

  runtime.Module = {
    ...previousModule,
    locateFile(path) {
      return new URL(path, resolvedAssetBase).href;
    },
    getPreloadedPackage(packageName, packageSize) {
      const previous = previousGetPreloadedPackage?.call(previousModule, packageName, packageSize);
      if (previous) return previous;
      if (preloadedDataPackage && isPinnedDataRequest(packageName, packageSize)) {
        return preloadedDataPackage;
      }
      return undefined;
    },
    setStatus(message) {
      previousSetStatus?.(message);
      onStatus?.(message);
    },
    onRuntimeInitialized() {
      previousOnRuntimeInitialized?.();
      if (settled) return;
      settled = true;
      if (typeof runtime.createOnlineRecognizer !== "function") {
        rejectInitialized(new Error(
          "The pinned sherpa-onnx runtime initialized without createOnlineRecognizer().",
        ));
        return;
      }
      resolveInitialized(runtime);
    },
    onAbort(reason) {
      previousOnAbort?.(reason);
      if (settled) return;
      settled = true;
      rejectInitialized(new Error(`The pinned sherpa-onnx runtime aborted: ${String(reason)}`));
    },
  };

  return (async () => {
    const [prepared] = await Promise.all([
      prepareDataPackage({
        assetBase: resolvedAssetBase,
        onProgress: onDataProgress,
        runtime,
      }),
      loadClassicScript(document, new URL(WRAPPER_SCRIPT, resolvedAssetBase).href),
    ]);
    preloadedDataPackage = prepared?.buffer ?? null;
    const runtimeScriptLoaded = loadClassicScript(
      document,
      new URL(RUNTIME_SCRIPT, resolvedAssetBase).href,
    );
    await Promise.all([runtimeScriptLoaded, initialized]);
    return runtime;
  })();
}

export function loadPinnedSherpaRuntime({
  runtime = globalThis,
  onStatus,
  onDataProgress,
  assetBase,
  prepareDataPackage = preparePinnedSherpaDataPackage,
} = {}) {
  requireRuntime(runtime);
  if (onStatus !== undefined && typeof onStatus !== "function") {
    throw new TypeError("onStatus must be a function when provided.");
  }
  if (onDataProgress !== undefined && typeof onDataProgress !== "function") {
    throw new TypeError("onDataProgress must be a function when provided.");
  }
  if (typeof prepareDataPackage !== "function") {
    throw new TypeError("prepareDataPackage must be a function.");
  }
  if (alreadyReady(runtime)) return Promise.resolve(runtime);

  const existingLoad = loadsByRuntime.get(runtime);
  if (existingLoad) return existingLoad;

  const load = beginRuntimeLoad({
    runtime,
    onStatus,
    onDataProgress,
    assetBase,
    prepareDataPackage,
  });
  const trackedLoad = load.catch((error) => {
    if (loadsByRuntime.get(runtime) === trackedLoad) loadsByRuntime.delete(runtime);
    throw error;
  });
  loadsByRuntime.set(runtime, trackedLoad);
  return trackedLoad;
}
