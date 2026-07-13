export const FIXTURE_DEFINITIONS = Object.freeze([
  Object.freeze({ id: "natural-154", label: "Natural recording (~154 WPM)", kind: "identity" }),
  Object.freeze({ id: "fast-200", label: "Accelerated delivery (~200 WPM)", kind: "speed", speed: 200 / 154 }),
  Object.freeze({ id: "fast-250", label: "Accelerated delivery (~250 WPM)", kind: "speed", speed: 250 / 154 }),
  Object.freeze({ id: "mid-pause", label: "Natural delivery + 1.5 s mid-passage pause", kind: "pause", pauseMs: 1_500, position: 0.48 }),
  Object.freeze({ id: "room-noise", label: "Natural delivery + deterministic light noise", kind: "noise", noiseRatio: 0.16 }),
  Object.freeze({ id: "restart", label: "Natural delivery + repeated 1.6 s phrase", kind: "repeat", startMs: 2_100, endMs: 3_700 }),
]);

function interpolate(samples, position) {
  const left = Math.floor(position);
  const right = Math.min(samples.length - 1, left + 1);
  const mix = position - left;
  return (samples[left] * (1 - mix)) + (samples[right] * mix);
}

export function changeSpeed(samples, speed) {
  if (!Number.isFinite(speed) || speed <= 0) throw new Error("Speed must be a positive number.");
  const output = new Float32Array(Math.max(1, Math.floor(samples.length / speed)));
  for (let index = 0; index < output.length; index += 1) {
    output[index] = interpolate(samples, Math.min(samples.length - 1, index * speed));
  }
  return output;
}

export function insertSilence(samples, sampleRate, pauseMs, position = 0.5) {
  const insertion = Math.round(Math.min(1, Math.max(0, position)) * samples.length);
  const silenceLength = Math.round((pauseMs / 1_000) * sampleRate);
  const output = new Float32Array(samples.length + silenceLength);
  output.set(samples.subarray(0, insertion), 0);
  output.set(samples.subarray(insertion), insertion + silenceLength);
  return output;
}

export function addDeterministicNoise(samples, ratio = 0.16) {
  let energy = 0;
  for (const sample of samples) energy += sample * sample;
  const rms = Math.sqrt(energy / Math.max(1, samples.length));
  const amplitude = rms * ratio;
  const output = new Float32Array(samples.length);
  let state = 0x5f3759df;
  for (let index = 0; index < samples.length; index += 1) {
    state = ((state * 1_664_525) + 1_013_904_223) >>> 0;
    const noise = ((state / 0xffffffff) * 2) - 1;
    output[index] = Math.max(-1, Math.min(1, samples[index] + (noise * amplitude)));
  }
  return output;
}

export function repeatSegment(samples, sampleRate, startMs, endMs) {
  const start = Math.max(0, Math.min(samples.length, Math.round((startMs / 1_000) * sampleRate)));
  const end = Math.max(start, Math.min(samples.length, Math.round((endMs / 1_000) * sampleRate)));
  const repeated = samples.subarray(start, end);
  const output = new Float32Array(samples.length + repeated.length);
  output.set(samples.subarray(0, end), 0);
  output.set(repeated, end);
  output.set(samples.subarray(end), end + repeated.length);
  return output;
}

export function buildFixtureSamples(baseSamples, fixture, sampleRate = 16_000) {
  switch (fixture.kind) {
    case "identity": return new Float32Array(baseSamples);
    case "speed": return changeSpeed(baseSamples, fixture.speed);
    case "pause": return insertSilence(baseSamples, sampleRate, fixture.pauseMs, fixture.position);
    case "noise": return addDeterministicNoise(baseSamples, fixture.noiseRatio);
    case "repeat": return repeatSegment(baseSamples, sampleRate, fixture.startMs, fixture.endMs);
    default: throw new Error(`Unknown fixture kind: ${fixture.kind}`);
  }
}

export function fixtureWordsPerMinute(wordCount, sampleCount, sampleRate = 16_000) {
  if (!wordCount || !sampleCount || !sampleRate) return 0;
  return Math.round(wordCount / ((sampleCount / sampleRate) / 60));
}
