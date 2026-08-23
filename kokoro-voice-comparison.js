import { KokoroTTS } from "kokoro-js";
import { READING_ENGINE_PLAYTEST as passage } from "./content/reading-engine-playtest.js";

const $ = (id) => document.getElementById(id);
const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const OBSERVED_MODEL_REVISION = "1939ad2a8e416c0acfeecc08a694d14ef25f2231";
let kokoro = null;
let loading = false;
let generating = false;
let playerUrl = null;

function stopPlayback() {
  speechSynthesis.cancel();
  $("kokoroPlayer").pause();
  $("kokoroPlayer").currentTime = 0;
}

function preferredSystemVoice() {
  const voices = speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  return ["Samantha", "Flo (English (US))", "Eddy (English (US))"]
    .map((name) => voices.find((voice) => voice.localService && voice.name === name))
    .find(Boolean)
    ?? voices.find((voice) => voice.localService && voice.lang.toLowerCase() === "en-us")
    ?? voices.find((voice) => voice.localService)
    ?? voices[0]
    ?? null;
}

function playSystem(entry) {
  stopPlayback();
  const utterance = new SpeechSynthesisUtterance(`${entry.word}. ${entry.example}`);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  utterance.voice = preferredSystemVoice();
  utterance.onstart = () => {
    $("status").textContent = `Playing the system voice${utterance.voice?.name ? ` · ${utterance.voice.name}` : ""}.`;
  };
  speechSynthesis.speak(utterance);
}

function setNeuralButtons(enabled) {
  for (const button of document.querySelectorAll("[data-kokoro-word]")) button.disabled = !enabled;
}

async function prepareKokoro() {
  if (kokoro || loading) return;
  loading = true;
  $("prepareKokoro").disabled = true;
  $("kokoroVoice").disabled = true;
  const startedAt = performance.now();
  try {
    kokoro = await KokoroTTS.from_pretrained(MODEL_ID, {
      device: "wasm",
      dtype: "q8",
      progress_callback(data = {}) {
        if (data.status !== "progress") return;
        const percent = Math.max(0, Math.min(100, Math.round(Number(data.progress) || 0)));
        $("modelProgress").value = percent;
        $("modelProgress").textContent = `${percent}%`;
        $("status").textContent = `Preparing Kokoro locally · ${percent}%`;
      },
    });
    const loadMs = Math.round(performance.now() - startedAt);
    $("modelProgress").value = 100;
    $("status").textContent = `Kokoro ready in ${(loadMs / 1_000).toFixed(1)} seconds. Choose any neural sample.`;
    $("measurement").textContent = `Model load: ${(loadMs / 1_000).toFixed(1)}s · observed upstream revision ${OBSERVED_MODEL_REVISION.slice(0, 9)}…`;
    setNeuralButtons(true);
  } catch (error) {
    kokoro = null;
    $("status").textContent = `Kokoro could not prepare: ${error.message}`;
    $("prepareKokoro").disabled = false;
  } finally {
    loading = false;
    $("kokoroVoice").disabled = false;
  }
}

async function playKokoro(entry) {
  if (!kokoro || generating) return;
  generating = true;
  stopPlayback();
  setNeuralButtons(false);
  const voice = $("kokoroVoice").value;
  const startedAt = performance.now();
  $("status").textContent = `Generating “${entry.word}” locally with ${voice}…`;
  try {
    const audio = await kokoro.generate(`${entry.word}. ${entry.example}`, { voice, speed: 0.95 });
    if (playerUrl) URL.revokeObjectURL(playerUrl);
    playerUrl = URL.createObjectURL(audio.toBlob());
    $("kokoroPlayer").src = playerUrl;
    $("downloadKokoro").href = playerUrl;
    $("downloadKokoro").download = `kokoro-heart-${entry.word}.wav`;
    $("downloadKokoro").hidden = voice !== "af_heart";
    const generationMs = Math.round(performance.now() - startedAt);
    $("measurement").textContent = `${entry.word} · ${voice} · generated in ${(generationMs / 1_000).toFixed(2)}s · ${(audio.audio.length / audio.sampling_rate).toFixed(2)}s audio`;
    try {
      await $("kokoroPlayer").play();
      $("status").textContent = `Playing Kokoro ${voice}.`;
    } catch {
      $("status").textContent = `Kokoro ${voice} is ready. Press play below.`;
    }
  } catch (error) {
    $("status").textContent = `Kokoro generation failed: ${error.message}`;
  } finally {
    generating = false;
    setNeuralButtons(Boolean(kokoro));
  }
}

for (const entry of passage.challengingWords) {
  const article = document.createElement("article");
  article.className = "example";
  const heading = document.createElement("h2");
  heading.textContent = entry.word;
  const copy = document.createElement("p");
  copy.textContent = `${entry.meaning}. ${entry.example}`;
  const actions = document.createElement("div");
  actions.className = "actions";
  const systemButton = document.createElement("button");
  systemButton.type = "button";
  systemButton.textContent = "Play system voice";
  systemButton.addEventListener("click", () => playSystem(entry));
  const kokoroButton = document.createElement("button");
  kokoroButton.type = "button";
  kokoroButton.textContent = "Play Kokoro voice";
  kokoroButton.dataset.kokoroWord = entry.word;
  kokoroButton.disabled = true;
  kokoroButton.addEventListener("click", () => playKokoro(entry));
  actions.append(systemButton, kokoroButton);
  article.append(heading, copy, actions);
  $("examples").append(article);
}

$("prepareKokoro").addEventListener("click", prepareKokoro);
window.addEventListener("pagehide", () => {
  stopPlayback();
  if (playerUrl) URL.revokeObjectURL(playerUrl);
});
