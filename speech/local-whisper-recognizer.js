export const DEFAULT_SPEECH_DEVICE = "wasm";

export class LocalWhisperRecognizer {
  constructor({ onProgress = () => {} } = {}) {
    this.device = null;
    this.nextRequestId = 1;
    this.onProgress = onProgress;
    this.pending = new Map();
    this.ready = false;
    this.worker = null;
  }

  createWorker(device) {
    this.worker?.terminate();
    this.pending.clear();
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
      if (data.status === "error") pending.reject(new Error(data.error));
      else pending.resolve(data.result);
    });
    this.worker.addEventListener("error", (event) => {
      const error = new Error(event.message || "The local speech worker stopped unexpectedly.");
      for (const pending of this.pending.values()) pending.reject(error);
      this.pending.clear();
    });
  }

  request(type, data = {}, transfer = []) {
    const id = this.nextRequestId;
    this.nextRequestId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { reject, resolve });
      this.worker.postMessage({ data, id, type }, transfer);
    });
  }

  async load(requestedDevice = null) {
    if (this.ready) return this.device;
    let hasWebGpu = false;
    if (navigator.gpu) {
      try {
        hasWebGpu = Boolean(await navigator.gpu.requestAdapter());
      } catch {
        hasWebGpu = false;
      }
    }
    const preferredDevice = requestedDevice === "wasm" || requestedDevice === "webgpu"
      ? requestedDevice
      : DEFAULT_SPEECH_DEVICE;
    this.createWorker(preferredDevice);
    try {
      await this.request("load", { device: preferredDevice });
    } catch (error) {
      if (preferredDevice !== "webgpu") throw error;
      this.onProgress({ status: "fallback", message: "WebGPU was unavailable; using the compatible CPU engine." });
      this.createWorker("wasm");
      await this.request("load", { device: "wasm" });
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
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
  }
}
