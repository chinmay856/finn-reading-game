import {
  PINNED_SHERPA_ASSET_BASE_PATH,
  PINNED_SHERPA_DATA_FILE,
  PINNED_SHERPA_DATA_SIZE,
  PINNED_SHERPA_OPFS_DIRECTORY,
} from "./sherpa-runtime-manifest.js";
import { ensureSherpaOpfsMigration } from "./sherpa-runtime-migration.js";

function emitProgress(onProgress, detail) {
  try {
    onProgress?.(Object.freeze({
      loaded: detail.loaded,
      percent: detail.total > 0 ? Math.round((detail.loaded / detail.total) * 100) : 0,
      source: detail.source,
      stage: detail.stage,
      total: detail.total,
    }));
  } catch {
    // Display callbacks cannot be allowed to corrupt or cancel the persisted package.
  }
}

async function removeIncompleteFile(directory) {
  try {
    await directory.removeEntry(PINNED_SHERPA_DATA_FILE);
  } catch {
    // Missing and partially-created files are both safe to ignore here.
  }
}

async function readValidatedFile(directory, expectedSize, onProgress) {
  let handle;
  try {
    handle = await directory.getFileHandle(PINNED_SHERPA_DATA_FILE);
  } catch {
    return null;
  }
  try {
    const file = await handle.getFile();
    if (file.size !== expectedSize) {
      await removeIncompleteFile(directory);
      return null;
    }
    emitProgress(onProgress, {
      loaded: expectedSize,
      source: "opfs",
      stage: "reading",
      total: expectedSize,
    });
    let buffer;
    try {
      buffer = await file.arrayBuffer();
    } catch {
      return null;
    }
    if (buffer.byteLength !== expectedSize) {
      await removeIncompleteFile(directory);
      return null;
    }
    emitProgress(onProgress, {
      loaded: expectedSize,
      source: "opfs",
      stage: "ready",
      total: expectedSize,
    });
    return buffer;
  } catch {
    return null;
  }
}

async function streamResponseToFile(runtime, response, writable, expectedSize, onProgress) {
  let loaded = 0;
  let lastReportedPercent = -1;
  const reportProgress = () => {
    const percent = expectedSize > 0 ? Math.round((loaded / expectedSize) * 100) : 0;
    if (percent === lastReportedPercent) return;
    lastReportedPercent = percent;
    emitProgress(onProgress, {
      loaded,
      source: "network",
      stage: "downloading",
      total: expectedSize,
    });
  };
  if (response.body?.pipeThrough && typeof writable.getWriter === "function"
    && typeof runtime.TransformStream === "function") {
    const progressStream = new runtime.TransformStream({
      transform(chunk, controller) {
        loaded += chunk.byteLength;
        if (loaded > expectedSize) throw new Error("The pinned Sherpa data response is too large.");
        reportProgress();
        controller.enqueue(chunk);
      },
    });
    await response.body.pipeThrough(progressStream).pipeTo(writable, { preventClose: true });
  } else if (response.body?.getReader) {
    const reader = response.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        loaded += value.byteLength;
        if (loaded > expectedSize) throw new Error("The pinned Sherpa data response is too large.");
        await writable.write(value);
        reportProgress();
      }
    } catch (error) {
      try {
        await reader.cancel(error);
      } catch {
        // The original stream or write error is the useful failure.
      }
      throw error;
    }
  } else {
    const buffer = await response.arrayBuffer();
    loaded = buffer.byteLength;
    await writable.write(buffer);
    reportProgress();
  }
  if (loaded !== expectedSize) {
    throw new Error(`The pinned Sherpa data response was ${loaded} bytes; expected ${expectedSize}.`);
  }
}

export async function preparePinnedSherpaDataPackage({
  runtime = globalThis,
  assetBase,
  expectedSize = PINNED_SHERPA_DATA_SIZE,
  onProgress,
} = {}) {
  if (onProgress !== undefined && typeof onProgress !== "function") {
    throw new TypeError("onProgress must be a function when provided.");
  }

  try {
    await ensureSherpaOpfsMigration({ runtime });
  } catch (error) {
    // With no controller there is no old fetch handler to evade, so a fresh browser may proceed.
    if (runtime.navigator?.serviceWorker?.controller) throw error;
  }
  const storage = runtime.navigator?.storage;
  if (!storage?.getDirectory) return null;
  try {
    await storage.persist?.();
  } catch {
    // Persistence is best-effort; OPFS remains available when the request is declined.
  }

  let directory;
  try {
    const root = await storage.getDirectory();
    directory = await root.getDirectoryHandle(PINNED_SHERPA_OPFS_DIRECTORY, { create: true });
  } catch {
    return null;
  }

  const cached = await readValidatedFile(directory, expectedSize, onProgress);
  if (cached) return Object.freeze({ buffer: cached, source: "opfs" });
  if (typeof runtime.fetch !== "function") return null;

  let dataUrl;
  try {
    const base = new URL(assetBase ?? PINNED_SHERPA_ASSET_BASE_PATH, runtime.document?.baseURI);
    dataUrl = new URL(PINNED_SHERPA_DATA_FILE, base);
  } catch {
    return null;
  }
  let writable;
  try {
    const response = await runtime.fetch(dataUrl.href, {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) throw new Error(`Could not download ${dataUrl.href} (${response.status}).`);
    const handle = await directory.getFileHandle(PINNED_SHERPA_DATA_FILE, { create: true });
    writable = await handle.createWritable({ keepExistingData: false });
    await streamResponseToFile(runtime, response, writable, expectedSize, onProgress);
    await writable.close();
    writable = null;
    const buffer = await readValidatedFile(directory, expectedSize, onProgress);
    if (!buffer) throw new Error("The OPFS Sherpa package failed final size validation.");
    return Object.freeze({ buffer, source: "network" });
  } catch {
    try {
      await writable?.abort?.();
    } catch {
      // The cleanup below removes any incomplete file even if abort itself fails.
    }
    await removeIncompleteFile(directory);
    emitProgress(onProgress, {
      loaded: 0,
      source: "network",
      stage: "fallback",
      total: expectedSize,
    });
    return null;
  }
}
