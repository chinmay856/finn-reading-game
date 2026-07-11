import { env, pipeline } from "@huggingface/transformers";

const MODEL_ID = "onnx-community/whisper-base_timestamped";
const DEVICE_CONFIG = {
  wasm: { device: "wasm", dtype: "q8" },
  webgpu: {
    device: "webgpu",
    dtype: { decoder_model_merged: "q4", encoder_model: "fp32" },
  },
};

env.allowLocalModels = false;
env.useBrowserCache = true;

let loadedDevice = null;
let transcriber = null;
let queue = Promise.resolve();

function reply(id, status, details = {}) {
  self.postMessage({ id, status, ...details });
}

async function loadModel(id, device) {
  if (transcriber && loadedDevice === device) {
    reply(id, "complete", { result: { device } });
    return;
  }
  const config = DEVICE_CONFIG[device];
  if (!config) throw new Error(`Unsupported local speech device: ${device}`);
  transcriber = await pipeline("automatic-speech-recognition", MODEL_ID, {
    ...config,
    progress_callback: (data) => reply(id, "progress", { data }),
  });
  loadedDevice = device;
  if (device === "webgpu") await transcriber(new Float32Array(16_000), { language: "en" });
  reply(id, "complete", { result: { device } });
}

async function transcribe(id, audio) {
  if (!transcriber) throw new Error("The local speech model has not been loaded.");
  const result = await transcriber(audio, {
    chunk_length_s: 30,
    language: "en",
    return_timestamps: "word",
  });
  reply(id, "complete", { result: { text: result?.text ?? "" } });
}

async function handleMessage({ data, id, type }) {
  try {
    if (type === "load") await loadModel(id, data.device);
    else if (type === "transcribe") await transcribe(id, data.audio);
    else throw new Error(`Unknown speech worker request: ${type}`);
  } catch (error) {
    reply(id, "error", { error: error?.message ?? String(error) });
  }
}

self.addEventListener("message", ({ data }) => {
  queue = queue.then(() => handleMessage(data));
});
