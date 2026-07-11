import { getPassage } from "../../packages/content-platform/index.js";
import { evaluateReadingResult } from "../../packages/game-rules/index.js";
import { BrowserSpeechInput, ReadAloudSession } from "../../packages/reading-engine/index.js";
import { latestSessionFor, saveSession } from "../../packages/shared/local-session-store.js";
import { INTERNET_RECOVERY_CONFIG } from "./wrapper-config.js";

const passage = getPassage("passage-001");
const wrapper = INTERNET_RECOVERY_CONFIG.passages[passage.id];
const speechInput = new BrowserSpeechInput({ language: passage.locale });

const elements = Object.fromEntries([
  "accuracy-score", "achievement-copy", "clock", "corruption-copy", "corruption-hint",
  "corruption-panel", "demo-button", "error-message", "pace-score", "passage",
  "progress-copy", "repair-progress", "replay-button", "result-copy", "result-dialog",
  "reward-score", "session-status", "start-button", "status-light", "stop-button",
  "support-status", "transcript",
].map((id) => [id, document.getElementById(id)]));

let session = createSession();
let active = false;
let demoTimer = null;

function createSession() {
  return new ReadAloudSession(passage);
}

function renderSnapshot(snapshot) {
  const matched = new Set(snapshot.matchedTokenIndexes);
  const challenging = new Set(snapshot.challengingTokenIndexes);
  elements.passage.replaceChildren(...snapshot.tokens.flatMap((token) => {
    const span = document.createElement("span");
    span.className = "token";
    if (matched.has(token.index)) span.classList.add("is-matched");
    if (challenging.has(token.index)) span.classList.add("is-challenging");
    if (token.index === snapshot.currentTokenIndex && active) {
      span.classList.add("is-current");
      span.setAttribute("aria-current", "true");
    }
    span.textContent = token.display;
    return [span, document.createTextNode(" ")];
  }));

  const percent = Math.round(snapshot.progress * 100);
  elements["progress-copy"].textContent = `${percent}%`;
  elements["repair-progress"].style.width = `${percent}%`;
  elements.transcript.textContent = snapshot.transcript || "Waiting for speech…";
  if (snapshot.completed && active) finishSession();
}

function setActive(nextActive) {
  active = nextActive;
  elements["start-button"].disabled = nextActive;
  elements["stop-button"].disabled = !nextActive;
  elements["demo-button"].disabled = nextActive;
  elements["status-light"].classList.toggle("is-live", nextActive);
  elements["session-status"].textContent = nextActive ? "LISTENING FOR REPAIR DATA" : "SYSTEM NEEDS READING";
}

function showError(error) {
  elements["error-message"].hidden = false;
  elements["error-message"].textContent = `${error.message} Use “Run transcript demo” to test the rest of the loop.`;
  setActive(false);
}

async function startReading() {
  elements["error-message"].hidden = true;
  elements["result-dialog"].hidden = true;
  session = createSession();
  setActive(true);
  renderSnapshot(session.snapshot());
  try {
    await speechInput.requestPermission();
    speechInput.start({
      onTranscript: (transcript) => renderSnapshot(session.updateTranscript(transcript)),
      onError: showError,
      onEnd: () => {
        if (active) setActive(false);
      },
    });
  } catch (error) {
    showError(error instanceof Error ? error : new Error(String(error)));
  }
}

function finishSession() {
  if (!active) return;
  clearInterval(demoTimer);
  demoTimer = null;
  speechInput.stop();
  setActive(false);

  const result = session.finish();
  const previous = latestSessionFor(result.passageId);
  const outcome = evaluateReadingResult(result, { previousAccuracy: previous?.accuracyEstimate });
  saveSession(result);

  elements["corruption-panel"].classList.toggle("is-repaired", result.completed);
  elements["corruption-copy"].textContent = result.completed ? wrapper.repairedCopy : wrapper.corruptedCopy;
  elements["corruption-hint"].textContent = result.completed ? "PATCH APPLIED. ADULTS CONFUSED." : "PARTIAL PATCH SAVED. TRY AGAIN WHEN READY.";
  elements["accuracy-score"].textContent = `${Math.round(result.accuracyEstimate * 100)}%`;
  elements["pace-score"].textContent = `${result.wordsPerMinute} wpm`;
  elements["reward-score"].textContent = `+${outcome.progressReward.units}`;
  elements["result-copy"].textContent = result.completed
    ? wrapper.repairedCopy
    : "The repair is partly decoded. Your progress is saved; another pass can finish it.";
  elements["achievement-copy"].textContent = outcome.achievementIds
    .map((id) => INTERNET_RECOVERY_CONFIG.achievementCopy[id])
    .filter(Boolean)
    .join(" • ");
  elements["result-dialog"].hidden = false;
  elements["replay-button"].focus();
}

function runDemo() {
  elements["error-message"].hidden = true;
  elements["result-dialog"].hidden = true;
  session = createSession();
  setActive(true);
  const words = passage.text.split(/\s+/u);
  let count = 0;
  renderSnapshot(session.snapshot());
  demoTimer = setInterval(() => {
    count += 1;
    renderSnapshot(session.updateTranscript(words.slice(0, count).join(" ")));
    if (count >= words.length) finishSession();
  }, 90);
}

function reset() {
  elements["result-dialog"].hidden = true;
  elements["corruption-panel"].classList.remove("is-repaired");
  elements["corruption-copy"].textContent = wrapper.corruptedCopy;
  elements["corruption-hint"].textContent = "READ FILE TO APPLY PATCH";
  session = createSession();
  renderSnapshot(session.snapshot());
  elements["start-button"].focus();
}

elements["start-button"].addEventListener("click", startReading);
elements["stop-button"].addEventListener("click", finishSession);
elements["demo-button"].addEventListener("click", runDemo);
elements["replay-button"].addEventListener("click", reset);

elements["support-status"].textContent = BrowserSpeechInput.isSupported()
  ? "Mic recognition available"
  : "Mic recognition unavailable — demo works";

function updateClock() {
  elements.clock.textContent = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date());
}
updateClock();
setInterval(updateClock, 30_000);
renderSnapshot(session.snapshot());
