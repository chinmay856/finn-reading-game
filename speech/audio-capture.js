import { StreamingPcmFramer } from "./streaming-pcm.js";

const TARGET_SAMPLE_RATE = 16_000;
const STREAMING_PCM_WORKLET_URL = new URL("./streaming-pcm-worklet.js", import.meta.url);
const SILENCE_THRESHOLD = 0.008;
const PREFERRED_MICROPHONE_CONSTRAINTS = Object.freeze({
  autoGainControl: true,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  sampleRate: TARGET_SAMPLE_RATE,
});

export function buildLocalMicrophoneConstraints(supported = {}) {
  const audio = {};
  for (const [name, value] of Object.entries(PREFERRED_MICROPHONE_CONSTRAINTS)) {
    if (supported[name]) audio[name] = value;
  }
  return Object.keys(audio).length ? audio : true;
}

export function supportsStreamingPcm(scope = globalThis) {
  const AudioContextApi = scope.AudioContext || scope.webkitAudioContext;
  return Boolean(AudioContextApi && scope.AudioWorkletNode);
}

function frameHasSpeech(audio, start, frameSize) {
  const end = Math.min(audio.length, start + frameSize);
  let energy = 0;
  for (let index = start; index < end; index += 1) energy += audio[index] * audio[index];
  return Math.sqrt(energy / Math.max(1, end - start)) >= SILENCE_THRESHOLD;
}
export function trimSilence(audio) {
  if (audio.length < TARGET_SAMPLE_RATE / 2) return audio;
  const frameSize = Math.round(TARGET_SAMPLE_RATE * 0.02);
  const padding = Math.round(TARGET_SAMPLE_RATE * 0.12);
  let firstSpeech = -1;
  let lastSpeech = -1;

  for (let start = 0; start < audio.length; start += frameSize) {
    if (!frameHasSpeech(audio, start, frameSize)) continue;
    if (firstSpeech < 0) firstSpeech = start;
    lastSpeech = Math.min(audio.length, start + frameSize);
  }

  if (firstSpeech < 0) return new Float32Array();
  return audio.slice(Math.max(0, firstSpeech - padding), Math.min(audio.length, lastSpeech + padding));
}

export function summarizeSignal(audio) {
  if (!audio.length) return Object.freeze({ activeFrameRatio: 0, peak: 0, rms: 0 });
  const frameSize = Math.round(TARGET_SAMPLE_RATE * 0.02);
  let activeFrames = 0;
  let energy = 0;
  let peak = 0;
  let totalFrames = 0;
  for (let start = 0; start < audio.length; start += frameSize) {
    if (frameHasSpeech(audio, start, frameSize)) activeFrames += 1;
    totalFrames += 1;
  }
  for (const sample of audio) {
    energy += sample * sample;
    peak = Math.max(peak, Math.abs(sample));
  }
  return Object.freeze({
    activeFrameRatio: Number((activeFrames / totalFrames).toFixed(3)),
    peak: Number(peak.toFixed(4)),
    rms: Number(Math.sqrt(energy / audio.length).toFixed(4)),
  });
}

function mergeChannels(audioBuffer) {
  if (audioBuffer.numberOfChannels === 1) return new Float32Array(audioBuffer.getChannelData(0));
  const output = new Float32Array(audioBuffer.length);
  const scale = Math.sqrt(2) / audioBuffer.numberOfChannels;
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
    const input = audioBuffer.getChannelData(channel);
    for (let index = 0; index < input.length; index += 1) output[index] += input[index] * scale;
  }
  return output;
}

function concatenateAudio(left, right) {
  const output = new Float32Array(left.length + right.length);
  output.set(left);
  output.set(right, left.length);
  return output;
}

export class LocalAudioCapture {
  constructor() {
    this.analyser = null;
    this.audioContext = null;
    this.finalChunks = [];
    this.mimeType = "";
    this.finalRecorder = null;
    this.previewChunks = [];
    this.previewRecorder = null;
    this.previewTail = new Float32Array();
    this.mediaSource = null;
    this.pcmFramer = null;
    this.pcmListeners = new Set();
    this.pcmProcessor = null;
    this.startedAt = 0;
    this.stream = null;
    this.timeDomain = null;
  }

  get active() {
    return this.finalRecorder?.state === "recording";
  }

  get durationMs() {
    return this.startedAt ? Math.round(performance.now() - this.startedAt) : 0;
  }

  get level() {
    if (!this.analyser || !this.timeDomain) return 0;
    this.analyser.getFloatTimeDomainData(this.timeDomain);
    let energy = 0;
    for (const sample of this.timeDomain) energy += sample * sample;
    return Math.sqrt(energy / this.timeDomain.length);
  }

  subscribePcm(listener) {
    if (typeof listener !== "function") throw new Error("A PCM listener is required.");
    this.pcmListeners.add(listener);
    return () => this.pcmListeners.delete(listener);
  }

  async setupStreamingPcm() {
    if (!this.pcmListeners.size || this.pcmProcessor) return;
    if (!supportsStreamingPcm(window)) {
      throw new Error("This browser cannot expose local streaming PCM frames.");
    }
    this.pcmFramer = new StreamingPcmFramer({
      onFrame: (frame, sampleRate) => {
        for (const listener of this.pcmListeners) listener(frame, sampleRate);
      },
    });
    await this.audioContext.audioWorklet.addModule(STREAMING_PCM_WORKLET_URL);
    this.pcmProcessor = new AudioWorkletNode(this.audioContext, "reading-companion-pcm-tap", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });
    this.pcmProcessor.port.onmessage = ({ data }) => {
      this.pcmFramer.push(new Float32Array(data), this.audioContext.sampleRate);
    };
    this.mediaSource.connect(this.pcmProcessor);
    this.pcmProcessor.connect(this.audioContext.destination);
  }

  async start() {
    if (this.active) throw new Error("Audio capture is already active.");
    if (!window.MediaRecorder) throw new Error("This browser does not support local microphone recording.");
    this.finalChunks = [];
    this.previewChunks = [];
    this.previewTail = new Float32Array();
    try {
      const supported = navigator.mediaDevices.getSupportedConstraints?.() ?? {};
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: buildLocalMicrophoneConstraints(supported) });
      const AudioContextApi = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextApi();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.mediaSource = source;
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 1024;
      this.timeDomain = new Float32Array(this.analyser.fftSize);
      source.connect(this.analyser);
      await this.setupStreamingPcm();
      this.finalRecorder = new MediaRecorder(this.stream);
      this.mimeType = this.finalRecorder.mimeType;
      this.finalRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) this.finalChunks.push(event.data);
      });
      this.finalRecorder.start();
      this.startPreviewRecorder();
      this.startedAt = performance.now();
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  startPreviewRecorder() {
    this.previewChunks = [];
    this.previewRecorder = new MediaRecorder(this.stream);
    this.previewRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) this.previewChunks.push(event.data);
    });
    this.previewRecorder.start();
  }

  async stopRecorder(recorder) {
    if (!recorder || recorder.state === "inactive") return;
    await new Promise((resolve) => {
      recorder.addEventListener("stop", resolve, { once: true });
      recorder.stop();
    });
  }

  async decode(chunks, mimeType = this.mimeType) {
    if (!chunks.length) return new Float32Array();
    const blob = new Blob(chunks, { type: mimeType });
    const encodedAudio = await blob.arrayBuffer();
    const AudioContextApi = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextApi({ sampleRate: TARGET_SAMPLE_RATE });
    try {
      const audioBuffer = await audioContext.decodeAudioData(encodedAudio.slice(0));
      return mergeChannels(audioBuffer);
    } finally {
      await audioContext.close();
    }
  }

  async snapshot({ overlapMs = 0 } = {}) {
    if (!this.active) return new Float32Array();
    const recorder = this.previewRecorder;
    const mimeType = recorder.mimeType;
    await this.stopRecorder(recorder);
    const chunks = this.previewChunks;
    this.startPreviewRecorder();
    const decoded = await this.decode(chunks, mimeType);
    const overlapSamples = Math.round((overlapMs / 1_000) * TARGET_SAMPLE_RATE);
    const audio = concatenateAudio(this.previewTail, decoded);
    this.previewTail = decoded.slice(Math.max(0, decoded.length - overlapSamples));
    return trimSilence(audio);
  }

  async stop() {
    if (!this.finalRecorder) {
      return { audio: new Float32Array(), durationMs: 0, signal: summarizeSignal(new Float32Array()) };
    }
    await Promise.all([this.stopRecorder(this.finalRecorder), this.stopRecorder(this.previewRecorder)]);
    try {
      const decoded = await this.decode(this.finalChunks);
      const signal = summarizeSignal(decoded);
      const audio = trimSilence(decoded);
      const durationMs = Math.round((audio.length / TARGET_SAMPLE_RATE) * 1_000);
      return { audio, durationMs, signal };
    } finally {
      await this.cleanup();
    }
  }

  async cleanup() {
    this.pcmProcessor?.disconnect();
    this.mediaSource?.disconnect();
    if (this.pcmProcessor) this.pcmProcessor.port.onmessage = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    if (this.audioContext && this.audioContext.state !== "closed") await this.audioContext.close();
    this.analyser = null;
    this.audioContext = null;
    this.finalChunks = [];
    this.mimeType = "";
    this.finalRecorder = null;
    this.mediaSource = null;
    this.pcmFramer?.reset();
    this.pcmFramer = null;
    this.pcmListeners.clear();
    this.pcmProcessor = null;
    this.previewChunks = [];
    this.previewRecorder = null;
    this.previewTail = new Float32Array();
    this.startedAt = 0;
    this.stream = null;
    this.timeDomain = null;
  }
}
