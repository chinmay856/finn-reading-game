export const STREAMING_SAMPLE_RATE = 16_000;
export const STREAMING_FRAME_DURATION_MS = 20;
export const STREAMING_FRAME_SAMPLES = Math.round(
  STREAMING_SAMPLE_RATE * (STREAMING_FRAME_DURATION_MS / 1_000),
);

export function resampleMonoPcm(samples, inputSampleRate, targetSampleRate = STREAMING_SAMPLE_RATE) {
  if (!(samples instanceof Float32Array)) samples = new Float32Array(samples ?? []);
  if (!samples.length) return new Float32Array();
  if (!Number.isFinite(inputSampleRate) || inputSampleRate <= 0) {
    throw new Error("A positive input sample rate is required.");
  }
  if (inputSampleRate === targetSampleRate) return new Float32Array(samples);

  const ratio = inputSampleRate / targetSampleRate;
  const outputLength = Math.max(1, Math.round(samples.length / ratio));
  const output = new Float32Array(outputLength);
  for (let index = 0; index < outputLength; index += 1) {
    const sourcePosition = Math.min(samples.length - 1, index * ratio);
    const before = Math.floor(sourcePosition);
    const after = Math.min(samples.length - 1, before + 1);
    const mix = sourcePosition - before;
    output[index] = samples[before] + ((samples[after] - samples[before]) * mix);
  }
  return output;
}

function concatenate(left, right) {
  const output = new Float32Array(left.length + right.length);
  output.set(left);
  output.set(right, left.length);
  return output;
}

export class StreamingPcmFramer {
  constructor({
    frameSamples = STREAMING_FRAME_SAMPLES,
    onFrame = () => {},
    targetSampleRate = STREAMING_SAMPLE_RATE,
  } = {}) {
    this.frameSamples = frameSamples;
    this.onFrame = onFrame;
    this.targetSampleRate = targetSampleRate;
    this.inputSampleRate = null;
    this.pending = new Float32Array();
  }

  push(samples, inputSampleRate) {
    if (this.inputSampleRate != null && this.inputSampleRate !== inputSampleRate) {
      throw new Error("The streaming input sample rate changed during capture.");
    }
    this.inputSampleRate = inputSampleRate;
    this.pending = concatenate(this.pending, samples);
    const sourceFrameSamples = Math.round(
      this.frameSamples * (inputSampleRate / this.targetSampleRate),
    );
    let emitted = 0;
    while (this.pending.length >= sourceFrameSamples) {
      const sourceFrame = this.pending.slice(0, sourceFrameSamples);
      this.pending = this.pending.slice(sourceFrameSamples);
      const frame = resampleMonoPcm(sourceFrame, inputSampleRate, this.targetSampleRate);
      this.onFrame(frame, this.targetSampleRate);
      emitted += 1;
    }
    return emitted;
  }

  reset() {
    this.inputSampleRate = null;
    this.pending = new Float32Array();
  }
}
