import { assertStreamingRecognizer } from "../reading-companion/live-reading-companion.js";
import { STREAMING_SAMPLE_RATE } from "./streaming-pcm.js";

function requireRuntime(runtime) {
  if (!runtime?.Module || typeof runtime.createOnlineRecognizer !== "function") {
    throw new Error("The pinned sherpa-onnx WebAssembly runtime is not loaded.");
  }
  return runtime;
}

export function sherpaStreamingRuntimeAvailable(runtime = globalThis) {
  return Boolean(runtime?.Module && typeof runtime.createOnlineRecognizer === "function");
}

export class SherpaStreamingRecognizer {
  constructor({ runtime = globalThis } = {}) {
    this.runtime = requireRuntime(runtime);
    this.listeners = new Set();
    this.recognizer = null;
    this.stream = null;
    this.lastText = "";
    this.warmupMs = null;
  }

  subscribe(listener) {
    if (typeof listener !== "function") throw new Error("A streaming listener is required.");
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  prepare() {
    if (this.recognizer) return Object.freeze({ warmupMs: this.warmupMs });
    this.recognizer = this.runtime.createOnlineRecognizer(this.runtime.Module);
    const startedAt = performance.now();
    const warmup = this.recognizer.createStream();
    try {
      warmup.acceptWaveform(STREAMING_SAMPLE_RATE, new Float32Array(STREAMING_SAMPLE_RATE));
      warmup.inputFinished();
      while (this.recognizer.isReady(warmup)) this.recognizer.decode(warmup);
    } finally {
      warmup.free();
    }
    this.warmupMs = Math.round(performance.now() - startedAt);
    return Object.freeze({ warmupMs: this.warmupMs });
  }

  async start() {
    this.prepare();
    if (this.stream) throw new Error("The streaming recognizer is already active.");
    this.lastText = "";
    this.stream = this.recognizer.createStream();
  }

  emitResult() {
    if (!this.stream) return;
    const text = String(this.recognizer.getResult(this.stream)?.text ?? "").trim();
    if (!text || text === this.lastText) return;
    this.lastText = text;
    const update = Object.freeze({ observedAtMs: performance.now(), text });
    for (const listener of this.listeners) listener(update);
  }

  decodeAvailable() {
    if (!this.stream) return;
    while (this.recognizer.isReady(this.stream)) this.recognizer.decode(this.stream);
    this.emitResult();
  }

  acceptAudio(samples, sampleRate) {
    if (!this.stream) return;
    if (sampleRate !== STREAMING_SAMPLE_RATE) {
      throw new Error(`Sherpa requires ${STREAMING_SAMPLE_RATE} Hz mono PCM.`);
    }
    this.stream.acceptWaveform(sampleRate, samples);
    this.decodeAvailable();
  }

  async stop() {
    if (!this.stream) return;
    try {
      this.stream.inputFinished();
      this.decodeAvailable();
    } finally {
      this.stream.free();
      this.stream = null;
      this.lastText = "";
    }
  }

  async close() {
    await this.stop();
    this.recognizer?.free?.();
    this.recognizer = null;
    this.listeners.clear();
  }
}

export function createSherpaStreamingRecognizer(options) {
  return assertStreamingRecognizer(new SherpaStreamingRecognizer(options));
}
