export const DEFAULT_SPEECH_DEVICE = "wasm";

export class LocalWhisperRecognizer {
  constructor({ loadTimeoutMs = 150_000, onProgress = () => {}, transcribeTimeoutMs = 30_000 } = {}) {
    this.device = null;
    this.loadTimeoutMs = loadTimeoutMs;
    this.nextRequestId = 1;
    this.onProgress = onProgress;
    this.pending = new Map();
    this.ready = false;
    this.transcribeTimeoutMs = transcribeTimeoutMs;
    this.worker = null;
  }

  failPending(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(error);
    }
    this.pending.clear();
  }

  resetWorker(error) {
    if (error) this.failPending(error);
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
  }

  createWorker(device) {
    this.resetWorker(new Error("The local speech worker was replaced."));
    this.device = device;
    this.worker = new Worker(new URL("./whisper-worker.js", import.meta.url), { type: "module" });
    this.worker.addEventListener("message", ({ data }) => {
      if (data.status === "progress") {
        this.onProgress(data.data);
        return;
      }
      const pending = this.pending.get(data.id);
      if (!pending) return;
      this.pending.delete(data.id);
      clearTimeout(pending.timeoutId);
      if (data.status === "error") pending.reject(new Error(data.error));
      else pending.resolve(data.result);
    });
    this.worker.addEventListener("error", (event) => {
      const error = new Error(event.message || "The local speech worker stopped unexpectedly.");
      this.resetWorker(error);
    });
  }

  request(type, data = {}, transfer = [], timeoutMs = this.transcribeTimeoutMs) {
    const id = this.nextRequestId;
    this.nextRequestId += 1;
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const pending = this.pending.get(id);
        if (!pending) return;
        this.pending.delete(id);
        pending.reject(new Error(`The local speech ${type} request timed out.`));
        this.resetWorker(new Error("The local speech worker was stopped after a timeout."));
      }, timeoutMs);
      this.pending.set(id, { reject, resolve, timeoutId });
      this.worker.postMessage({ data, id, type }, transfer);
    });
  }

  async load(requestedDevice = null) {
    if (this.ready) return this.device;
    const preferredDevice = requestedDevice === "wasm" || requestedDevice === "webgpu"
      ? requestedDevice
      : DEFAULT_SPEECH_DEVICE;
    this.createWorker(preferredDevice);
    try {
      await this.request("load", { device: preferredDevice }, [], this.loadTimeoutMs);
    } catch (error) {
      if (preferredDevice !== "webgpu") throw error;
      this.onProgress({ status: "fallback", message: "WebGPU was unavailable; using the compatible CPU engine." });
      this.createWorker("wasm");
      await this.request("load", { device: "wasm" }, [], this.loadTimeoutMs);
    }
    this.ready = true;
    return this.device;
  }

  async transcribe(audio) {
    if (!this.ready) throw new Error("The local speech model is not ready.");
    if (!(audio instanceof Float32Array) || !audio.length) return "";
    const result = await this.request("transcribe", { audio }, [audio.buffer]);
    return String(result?.text ?? "").trim();
  }

  close() {
    this.resetWorker(new Error("The local speech recognizer was closed."));
  }
}
