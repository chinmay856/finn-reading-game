import { AutoModel, Tensor, pipeline } from "@huggingface/transformers";

const SAMPLE_RATE = 16_000;
const SPEECH_THRESHOLD = 0.3;
const EXIT_THRESHOLD = 0.1;
const MIN_SILENCE_SAMPLES = 400 * (SAMPLE_RATE / 1_000);
const SPEECH_PAD_SAMPLES = 80 * (SAMPLE_RATE / 1_000);
const MIN_SPEECH_SAMPLES = 250 * (SAMPLE_RATE / 1_000);
const MAX_BUFFER_SAMPLES = 30 * SAMPLE_RATE;
const MAX_PREVIOUS_BUFFERS = Math.ceil(SPEECH_PAD_SAMPLES / 512);
const MODEL_ID = "onnx-community/moonshine-base-ONNX";
const VAD_MODEL_ID = "onnx-community/silero-vad";

// The first real microphone run selected WebGPU and emitted seven empty
// transcript results, so this diagnostic comparison forces the proven CPU path.
const device = "wasm";
self.postMessage({ type: "loading", device, message: `Loading Moonshine Base and Silero VAD on ${device.toUpperCase()}...` });

const progressCallback = (data) => self.postMessage({ type: "progress", device, data });
try {
  const vadModel = await AutoModel.from_pretrained(VAD_MODEL_ID, {
    config: { model_type: "custom" },
    dtype: "fp32",
    progress_callback: progressCallback,
  });
  const transcriber = await pipeline("automatic-speech-recognition", MODEL_ID, {
    device,
    dtype: { encoder_model: "fp32", decoder_model_merged: "q8" },
    progress_callback: progressCallback,
  });
  await transcriber(new Float32Array(SAMPLE_RATE));

  let inferenceChain = Promise.resolve();
  let messageChain = Promise.resolve();
  const audioBuffer = new Float32Array(MAX_BUFFER_SAMPLES);
  let bufferPointer = 0;
  let previousBuffers = [];
  let postSpeechSamples = 0;
  let recording = false;
  let segmentNumber = 0;
  let pendingSegments = 0;
  const sampleRateTensor = new Tensor("int64", [SAMPLE_RATE], []);
  let vadState = new Tensor("float32", new Float32Array(2 * 1 * 128), [2, 1, 128]);

  async function detectSpeech(buffer) {
    const input = new Tensor("float32", buffer, [1, buffer.length]);
    const { stateN, output } = await (inferenceChain = inferenceChain.then(() =>
      vadModel({ input, sr: sampleRateTensor, state: vadState })));
    vadState = stateN;
    const probability = output.data[0];
    return probability > SPEECH_THRESHOLD || (recording && probability >= EXIT_THRESHOLD);
  }

  function reset(offset = 0) {
    audioBuffer.fill(0, offset);
    bufferPointer = offset;
    recording = false;
    postSpeechSamples = 0;
  }

  function summarizeSignal(buffer) {
    let energy = 0;
    let peak = 0;
    for (const sample of buffer) {
      energy += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }
    return {
      durationMs: Math.round((buffer.length / SAMPLE_RATE) * 1_000),
      peak: Number(peak.toFixed(4)),
      rms: Number(Math.sqrt(energy / Math.max(1, buffer.length)).toFixed(4)),
      sampleCount: buffer.length,
    };
  }

  function transcribe(buffer, timing) {
    const id = ++segmentNumber;
    const signal = summarizeSignal(buffer);
    pendingSegments += 1;
    self.postMessage({ type: "transcribing", id, pendingSegments, signal });
    inferenceChain = inferenceChain
      .then(() => transcriber(buffer))
      .then((result) => {
        const text = typeof result?.text === "string" ? result.text.trim() : "";
        pendingSegments -= 1;
        self.postMessage({
          type: "output",
          id,
          text,
          signal,
          response: {
            keys: result && typeof result === "object" ? Object.keys(result) : [],
            textLength: text.length,
            textType: typeof result?.text,
            valueType: Array.isArray(result) ? "array" : typeof result,
          },
          ...timing,
          completedAt: Date.now(),
          pendingSegments,
        });
        if (!pendingSegments) self.postMessage({ type: "idle" });
      })
      .catch((error) => {
        pendingSegments -= 1;
        self.postMessage({ type: "error", message: error?.message ?? String(error) });
      });
  }

  function dispatch(overflow, forced = false) {
    const now = Date.now();
    const end = forced ? now : now - ((postSpeechSamples + SPEECH_PAD_SAMPLES) / SAMPLE_RATE) * 1_000;
    const start = end - (bufferPointer / SAMPLE_RATE) * 1_000;
    const current = audioBuffer.slice(0, Math.min(audioBuffer.length, bufferPointer + SPEECH_PAD_SAMPLES));
    const previousLength = previousBuffers.reduce((total, buffer) => total + buffer.length, 0);
    const padded = new Float32Array(previousLength + current.length);
    let offset = 0;
    for (const buffer of previousBuffers) {
      padded.set(buffer, offset);
      offset += buffer.length;
    }
    padded.set(current, offset);
    transcribe(padded, { start, end, duration: end - start, forced });
    if (overflow?.length) audioBuffer.set(overflow, 0);
    reset(overflow?.length ?? 0);
    previousBuffers = [];
  }

  async function acceptAudio(buffer) {
    const wasRecording = recording;
    const speech = await detectSpeech(buffer);
    if (!wasRecording && !speech) {
      if (previousBuffers.length >= MAX_PREVIOUS_BUFFERS) previousBuffers.shift();
      previousBuffers.push(buffer);
      return;
    }

    const remaining = audioBuffer.length - bufferPointer;
    if (buffer.length >= remaining) {
      audioBuffer.set(buffer.subarray(0, remaining), bufferPointer);
      bufferPointer += remaining;
      dispatch(buffer.subarray(remaining));
      return;
    }
    audioBuffer.set(buffer, bufferPointer);
    bufferPointer += buffer.length;

    if (speech) {
      if (!recording) self.postMessage({ type: "speech_start" });
      recording = true;
      postSpeechSamples = 0;
      return;
    }
    postSpeechSamples += buffer.length;
    if (postSpeechSamples < MIN_SILENCE_SAMPLES) return;
    if (bufferPointer < MIN_SPEECH_SAMPLES) {
      reset();
      return;
    }
    dispatch();
  }

  async function flush() {
    if (bufferPointer >= MIN_SPEECH_SAMPLES) dispatch(undefined, true);
    await inferenceChain;
    self.postMessage({ type: "flushed", pendingSegments });
  }

  self.addEventListener("message", ({ data }) => {
    messageChain = messageChain.then(() => data.type === "flush" ? flush() : acceptAudio(data.buffer));
  });
  self.postMessage({ type: "ready", device, model: MODEL_ID, vadModel: VAD_MODEL_ID });
} catch (error) {
  self.postMessage({ type: "error", message: error?.message ?? String(error), device });
}
