const TARGET_SAMPLE_RATE = 16_000;
const SILENCE_THRESHOLD = 0.008;

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

export class LocalAudioCapture {
  constructor() {
    this.analyser = null;
    this.audioContext = null;
    this.chunks = [];
    this.mimeType = "";
    this.recorder = null;
    this.startedAt = 0;
    this.stream = null;
    this.timeDomain = null;
  }

  get active() {
    return this.recorder?.state === "recording";
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

  async start() {
    if (this.active) throw new Error("Audio capture is already active.");
    if (!window.MediaRecorder) throw new Error("This browser does not support local microphone recording.");
    this.chunks = [];
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextApi = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextApi();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 1024;
      this.timeDomain = new Float32Array(this.analyser.fftSize);
      source.connect(this.analyser);
      this.recorder = new MediaRecorder(this.stream);
      this.mimeType = this.recorder.mimeType;
      this.recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) this.chunks.push(event.data);
      });
      this.recorder.start();
      this.startedAt = performance.now();
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  async requestData() {
    if (!this.active) return;
    await new Promise((resolve) => {
      const handleData = () => resolve();
      this.recorder.addEventListener("dataavailable", handleData, { once: true });
      this.recorder.requestData();
    });
  }

  async decode() {
    if (!this.chunks.length) return new Float32Array();
    const blob = new Blob(this.chunks, { type: this.mimeType });
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

  async snapshot({ overlapMs = 0, sinceMs = 0 } = {}) {
    if (!this.active) return new Float32Array();
    await this.requestData();
    const decoded = await this.decode();
    const startMs = Math.max(0, sinceMs - overlapMs);
    const startSample = Math.min(decoded.length, Math.round((startMs / 1_000) * TARGET_SAMPLE_RATE));
    return trimSilence(decoded.slice(startSample));
  }

  async stop() {
    if (!this.recorder) {
      return { audio: new Float32Array(), durationMs: 0, signal: summarizeSignal(new Float32Array()) };
    }
    if (this.active) {
      await new Promise((resolve) => {
        this.recorder.addEventListener("stop", resolve, { once: true });
        this.recorder.stop();
      });
    }
    try {
      const decoded = await this.decode();
      const signal = summarizeSignal(decoded);
      const audio = trimSilence(decoded);
      const durationMs = Math.round((audio.length / TARGET_SAMPLE_RATE) * 1_000);
      return { audio, durationMs, signal };
    } finally {
      await this.cleanup();
    }
  }

  async cleanup() {
    this.stream?.getTracks().forEach((track) => track.stop());
    if (this.audioContext && this.audioContext.state !== "closed") await this.audioContext.close();
    this.analyser = null;
    this.audioContext = null;
    this.chunks = [];
    this.mimeType = "";
    this.recorder = null;
    this.startedAt = 0;
    this.stream = null;
    this.timeDomain = null;
  }
}
