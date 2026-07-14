import { loadPinnedSherpaRuntime, PINNED_SHERPA_VERSION } from "./sherpa-runtime-loader.js";
import { createSherpaStreamingRecognizer } from "./sherpa-streaming-recognizer.js";

const runButton = document.querySelector("#run");
const status = document.querySelector("#status");

function setStatus(message) {
  status.textContent = message;
}

function formatRuntimeStatus(message) {
  const text = String(message || "");
  const match = text.match(/Downloading data\.\.\. \((\d+)\/(\d+)\)/u);
  if (!match) return text === "Running..." ? "Initializing the local runtime..." : text;
  const loaded = Number(match[1]);
  const total = Number(match[2]);
  return `Downloading local runtime... ${Math.round((loaded / total) * 100)}%`;
}

function formatDataProgress({ loaded, source, stage, total }) {
  if (stage === "fallback") return "OPFS unavailable; using the direct runtime download...";
  if (source === "opfs") return "Loading the verified runtime from browser storage...";
  return `Saving the verified runtime in browser storage... ${Math.round((loaded / total) * 100)}%`;
}

async function runSmokeCheck() {
  runButton.disabled = true;
  let statusLocked = false;
  try {
    if (globalThis.crossOriginIsolated !== true || typeof globalThis.SharedArrayBuffer !== "function") {
      throw new Error("This origin is not cross-origin isolated.");
    }
    setStatus("Preparing the checksum-pinned local runtime...");
    await loadPinnedSherpaRuntime({
      runtime: globalThis,
      onDataProgress(progress) {
        if (!statusLocked) setStatus(formatDataProgress(progress));
      },
      onStatus(message) {
        if (!statusLocked) setStatus(formatRuntimeStatus(message));
      },
    });
    const recognizer = createSherpaStreamingRecognizer({ runtime: globalThis });
    const prepared = recognizer.prepare();
    await recognizer.close();
    statusLocked = true;
    globalThis.__sherpaRuntimeSmoke = Object.freeze({
      crossOriginIsolated: true,
      ready: true,
      version: PINNED_SHERPA_VERSION,
      warmupMs: prepared.warmupMs,
    });
    setStatus(`READY · ${PINNED_SHERPA_VERSION} · silent warm-up ${prepared.warmupMs} ms`);
  } catch (error) {
    statusLocked = true;
    globalThis.__sherpaRuntimeSmoke = Object.freeze({
      crossOriginIsolated: globalThis.crossOriginIsolated === true,
      ready: false,
      version: PINNED_SHERPA_VERSION,
    });
    setStatus(`FAILED · ${error.message}`);
    runButton.disabled = false;
  }
}

runButton.addEventListener("click", runSmokeCheck);
