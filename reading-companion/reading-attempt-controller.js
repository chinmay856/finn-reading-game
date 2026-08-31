import {
  advanceEvidenceCursor,
  alignTranscript,
  hasEndEvidence,
  tokenizeText,
} from "../reading-engine.js";
import {
  describeReadingCoverage,
  describeReadingPace,
  evaluateFinishedAttempt,
  shouldAutoFinishAttempt,
} from "../reading-attempt-evaluation.js";
import { LocalAudioCapture } from "../speech/audio-capture.js";
import { LocalWhisperRecognizer } from "../speech/local-whisper-recognizer.js";
import { anticipatedGuideWord, createLineLayout, lineForWord } from "./known-text-line-guide.js";

const DEFAULT_AUTO_FINISH_MS = 5_000;
const DEFAULT_CHECKPOINT_INTERVAL_MS = 6_000;
const DEFAULT_CHECKPOINT_MINIMUM_MS = 3_500;
const DEFAULT_CHECKPOINT_OVERLAP_MS = 1_800;
const DEFAULT_MONITOR_INTERVAL_MS = 100;

function noop() {}

function freezeEvent(type, details = {}) {
  return Object.freeze({ type, ...details });
}

function requirePassage({ lines, passageId }) {
  if (!passageId) throw new Error("passageId is required.");
  if (!Array.isArray(lines) || !lines.length) throw new Error("At least one authored line is required.");
}

/**
 * Theme-neutral orchestration for one read-aloud attempt.
 *
 * The optional streaming recognizer is guide-only. The full captured recording
 * always goes through Whisper for the final assessment. This controller emits
 * aggregate events and deliberately never returns or persists transcript text
 * or audio.
 */
export class ReadingAttemptController {
  constructor({
    autoFinishSilenceMs = DEFAULT_AUTO_FINISH_MS,
    capture = new LocalAudioCapture(),
    checkpointIntervalMs = DEFAULT_CHECKPOINT_INTERVAL_MS,
    checkpointMinimumMs = DEFAULT_CHECKPOINT_MINIMUM_MS,
    checkpointOverlapMs = DEFAULT_CHECKPOINT_OVERLAP_MS,
    clearIntervalFn = globalThis.clearInterval.bind(globalThis),
    lines,
    monitorIntervalMs = DEFAULT_MONITOR_INTERVAL_MS,
    now = () => performance.now(),
    onDiagnostic = noop,
    onGuidePosition = noop,
    onModelStatus = noop,
    onResult = noop,
    onStatus = noop,
    passageId,
    permitCheckpointFallback = true,
    retainTroubleshooting = false,
    setIntervalFn = globalThis.setInterval.bind(globalThis),
    streamingRecognizer = null,
    whisper = new LocalWhisperRecognizer(),
    wordsPerMinute = 180,
  } = {}) {
    requirePassage({ lines, passageId });
    this.autoFinishSilenceMs = autoFinishSilenceMs;
    this.capture = capture;
    this.checkpointIntervalMs = checkpointIntervalMs;
    this.checkpointMinimumMs = checkpointMinimumMs;
    this.checkpointOverlapMs = checkpointOverlapMs;
    this.clearInterval = clearIntervalFn;
    this.lines = Object.freeze(lines.map(String));
    this.lineLayout = createLineLayout(this.lines);
    this.monitorIntervalMs = monitorIntervalMs;
    this.now = now;
    this.onDiagnostic = onDiagnostic;
    this.onGuidePosition = onGuidePosition;
    this.onModelStatus = onModelStatus;
    this.onResult = onResult;
    this.onStatus = onStatus;
    this.passageId = String(passageId);
    this.permitCheckpointFallback = Boolean(permitCheckpointFallback);
    this.retainTroubleshooting = Boolean(retainTroubleshooting);
    this.referenceText = this.lines.join(" ");
    this.setInterval = setIntervalFn;
    this.streamingRecognizer = streamingRecognizer;
    this.tokens = tokenizeText(this.referenceText);
    this.whisper = whisper;
    this.wordsPerMinute = wordsPerMinute;
    this.prepared = false;
    this.closed = false;
    this.resetAttemptState();
  }

  resetAttemptState() {
    this.activeCheckpoint = null;
    this.attemptStartedAt = 0;
    this.autoFinishArmedAt = 0;
    this.captureStarted = false;
    this.checkpointTimer = null;
    this.cursor = 0;
    this.endEvidenceObserved = false;
    this.finishing = false;
    this.listening = false;
    this.monitorTimer = null;
    this.pcmUnsubscribe = null;
    this.streamingActive = false;
    this.streamingUnsubscribe = null;
    this.transcriptTrace = [];
    this.visibleLineIndex = 0;
  }

  emitModelStatus(phase, details = {}) {
    const event = freezeEvent("reading-model-status", { passageId: this.passageId, phase, ...details });
    this.onModelStatus(event);
    return event;
  }

  emitStatus(phase, details = {}) {
    const event = freezeEvent("reading-attempt-status", { passageId: this.passageId, phase, ...details });
    this.onStatus(event);
    return event;
  }

  async prepare({ preferStreaming = true } = {}) {
    if (this.closed) throw new Error("The reading attempt controller is closed.");
    this.emitModelStatus("preparing-whisper");
    try {
      if (!this.whisper.ready) await this.whisper.load("wasm");
    } catch (error) {
      this.prepared = false;
      this.emitModelStatus("whisper-failed", { message: error.message });
      throw error;
    }

    let streamingAvailable = false;
    if (preferStreaming && this.streamingRecognizer) {
      this.emitModelStatus("preparing-streaming-guide");
      try {
        const prepared = this.streamingRecognizer.prepare?.() ?? {};
        streamingAvailable = true;
        this.emitModelStatus("streaming-guide-ready", { warmupMs: prepared.warmupMs ?? null });
      } catch (error) {
        this.emitModelStatus("streaming-guide-unavailable", { message: error.message });
        if (!this.permitCheckpointFallback) throw error;
      }
    }

    this.streamingPrepared = streamingAvailable;
    this.prepared = true;
    this.emitModelStatus("ready", {
      guideMode: streamingAvailable ? "streaming" : "whisper-checkpoint-fallback",
    });
    return Object.freeze({
      guideMode: streamingAvailable ? "streaming" : "whisper-checkpoint-fallback",
      streamingAvailable,
    });
  }

  emitGuidePosition(source, observedAtMs = this.now(), matchedWordCount = this.cursor) {
    const confirmedWordIndex = Math.max(-1, this.cursor - 1);
    const anticipatedWordIndex = anticipatedGuideWord({
      confirmedWordIndex,
      totalWords: this.tokens.length,
      wordsPerMinute: this.wordsPerMinute,
    });
    const evidenceLineIndex = lineForWord(this.lineLayout, anticipatedWordIndex);
    this.visibleLineIndex = Math.max(
      this.visibleLineIndex,
      Math.min(evidenceLineIndex, this.visibleLineIndex + 1),
    );
    const event = freezeEvent("reading-guide-position", {
      anticipatedWordIndex,
      confirmedWordIndex,
      matchedWordCount,
      observedAtMs,
      passageId: this.passageId,
      source,
      totalWordCount: this.tokens.length,
      visibleLineIndex: this.visibleLineIndex,
    });
    this.onGuidePosition(event);
    return event;
  }

  observeTranscript(transcript, { final = false, source = "unknown", observedAtMs = this.now() } = {}) {
    const alignment = alignTranscript(this.referenceText, transcript, {
      lookAhead: 50,
      startIndex: final || source === "streaming-guide" ? 0 : Math.max(0, this.cursor - 12),
    });
    const nextCursor = advanceEvidenceCursor({
      currentTokenIndex: final ? 0 : this.cursor,
      matchedTokenIndexes: alignment.matchedTokenIndexes,
      maximumAdvance: final ? this.tokens.length : 12,
      totalCount: this.tokens.length,
    });
    if (this.retainTroubleshooting) {
      this.transcriptTrace.push(Object.freeze({
        atMs: Math.max(0, Math.round(observedAtMs - this.attemptStartedAt)),
        cursor: this.cursor,
        source,
        text: String(transcript ?? ""),
      }));
    }
    this.cursor = Math.max(this.cursor, nextCursor);
    if (!final && !this.endEvidenceObserved && this.cursor / this.tokens.length >= 0.9
      && hasEndEvidence(alignment.matchedTokenIndexes, this.tokens.length)) {
      this.endEvidenceObserved = true;
      this.autoFinishArmedAt = observedAtMs;
      this.emitStatus("auto-finish-armed", { delayMs: this.autoFinishSilenceMs });
    }
    if (!final) this.emitGuidePosition(source, observedAtMs, alignment.matchedCount);
    return alignment;
  }

  startCheckpointFallback(details = {}) {
    if (this.checkpointTimer != null || !this.listening) return;
    this.emitStatus("whisper-checkpoint-fallback", details);
    this.checkpointTimer = this.setInterval(() => void this.checkpoint(), this.checkpointIntervalMs);
  }

  async disableStreaming(error) {
    if (!this.streamingActive) return;
    this.streamingActive = false;
    this.pcmUnsubscribe?.();
    this.pcmUnsubscribe = null;
    this.streamingUnsubscribe?.();
    this.streamingUnsubscribe = null;
    this.emitStatus("streaming-guide-failed", { message: error.message });
    if (this.permitCheckpointFallback) {
      this.startCheckpointFallback({ reason: "streaming-guide-failed" });
    }
    await this.streamingRecognizer?.stop().catch(noop);
  }

  async start() {
    if (this.closed) throw new Error("The reading attempt controller is closed.");
    if (!this.prepared) throw new Error("Prepare the local reading models before starting.");
    if (this.listening || this.finishing) throw new Error("A reading attempt is already active.");
    this.resetAttemptState();
    this.emitStatus("requesting-microphone");

    if (this.streamingPrepared && this.streamingRecognizer) {
      try {
        this.streamingUnsubscribe = this.streamingRecognizer.subscribe(({ observedAtMs, text }) => {
          try {
            this.observeTranscript(text, { observedAtMs, source: "streaming-guide" });
          } catch (error) {
            void this.disableStreaming(error);
          }
        });
        await this.streamingRecognizer.start();
        this.pcmUnsubscribe = this.capture.subscribePcm((samples, sampleRate) => {
          try {
            this.streamingRecognizer.acceptAudio(samples, sampleRate);
          } catch (error) {
            void this.disableStreaming(error);
          }
        });
        this.streamingActive = true;
      } catch (error) {
        this.streamingUnsubscribe?.();
        this.streamingUnsubscribe = null;
        await this.streamingRecognizer.stop().catch(noop);
        this.emitStatus("streaming-guide-failed", { message: error.message });
        if (!this.permitCheckpointFallback) throw error;
      }
    }

    try {
      await this.capture.start();
    } catch (error) {
      await this.stopStreaming();
      await this.capture.cleanup().catch(noop);
      this.emitStatus("microphone-unavailable", { message: error.message });
      throw error;
    }

    this.attemptStartedAt = this.now();
    this.captureStarted = true;
    this.listening = true;
    this.monitorTimer = this.setInterval(() => this.monitorAutoFinish(), this.monitorIntervalMs);
    if (!this.streamingActive) {
      if (!this.permitCheckpointFallback) {
        throw new Error("The required live reading guide did not start.");
      }
      this.startCheckpointFallback({ reason: "streaming-guide-unavailable" });
    }
    this.emitStatus("listening", {
      guideMode: this.streamingActive ? "streaming" : "whisper-checkpoint-fallback",
    });
  }

  async checkpoint() {
    if (!this.listening || this.activeCheckpoint || this.capture.durationMs < this.checkpointMinimumMs) return;
    this.activeCheckpoint = (async () => {
      try {
        const audio = await this.capture.snapshot({ overlapMs: this.checkpointOverlapMs });
        const transcript = await this.whisper.transcribe(audio);
        if (transcript && this.listening) this.observeTranscript(transcript, { source: "whisper-checkpoint" });
      } catch (error) {
        this.emitStatus("checkpoint-failed", { message: error.message });
      } finally {
        this.activeCheckpoint = null;
      }
    })();
    await this.activeCheckpoint;
  }

  monitorAutoFinish() {
    if (!this.listening || this.finishing) return false;
    const millisecondsSinceEndEvidence = this.autoFinishArmedAt
      ? Math.max(0, this.now() - this.autoFinishArmedAt)
      : 0;
    const positionProgress = this.tokens.length ? this.cursor / this.tokens.length : 0;
    const shouldFinish = shouldAutoFinishAttempt({
      endEvidence: this.endEvidenceObserved,
      listening: this.listening,
      millisecondsSinceSpeech: millisecondsSinceEndEvidence,
      positionProgress,
      silenceThresholdMs: this.autoFinishSilenceMs,
    });
    if (shouldFinish) void this.finish({ automatic: true });
    return shouldFinish;
  }

  stopTimers() {
    if (this.monitorTimer != null) this.clearInterval(this.monitorTimer);
    if (this.checkpointTimer != null) this.clearInterval(this.checkpointTimer);
    this.monitorTimer = null;
    this.checkpointTimer = null;
  }

  async stopStreaming() {
    this.pcmUnsubscribe?.();
    this.pcmUnsubscribe = null;
    this.streamingUnsubscribe?.();
    this.streamingUnsubscribe = null;
    this.streamingActive = false;
    await this.streamingRecognizer?.stop().catch(noop);
  }

  async finish({ automatic = false, restarted = false } = {}) {
    if (!this.listening || this.finishing) return null;
    this.finishing = true;
    this.listening = false;
    this.stopTimers();
    this.emitStatus(restarted ? "restarting" : "finalizing", { automatic });
    if (this.activeCheckpoint) await this.activeCheckpoint.catch(noop);
    await this.stopStreaming();

    let audio = new Float32Array();
    let durationMs = Math.max(0, Math.round(this.now() - this.attemptStartedAt));
    let modelFailed = false;
    try {
      const stopped = await this.capture.stop();
      audio = stopped.audio;
      durationMs = stopped.durationMs;
    } catch (error) {
      modelFailed = true;
      await this.capture.cleanup().catch(noop);
      this.emitStatus("capture-stop-failed", { message: error.message });
    }

    if (restarted) {
      const outcome = evaluateFinishedAttempt({ captureStarted: this.captureStarted, finishRequested: false });
      this.resetAttemptState();
      this.emitStatus("ready");
      return outcome;
    }

    let alignment = alignTranscript(this.referenceText, "");
    let finalTranscript = "";
    const diagnosticAudio = this.retainTroubleshooting ? audio.slice() : null;
    if (!modelFailed && this.whisper.ready) {
      try {
        finalTranscript = await this.whisper.transcribe(audio);
        alignment = this.observeTranscript(finalTranscript, { final: true, source: "whisper-final" });
      } catch (error) {
        modelFailed = true;
        this.emitStatus("final-check-failed", { message: error.message });
      }
    } else {
      modelFailed = true;
    }

    const outcome = evaluateFinishedAttempt({
      captureStarted: this.captureStarted,
      finishRequested: true,
      matchedTokenIndexes: alignment.matchedTokenIndexes,
      matchedWords: alignment.matchedCount,
      modelFailed,
      positionProgress: alignment.positionProgress,
      spokenWords: alignment.spokenWordCount,
      totalWords: this.tokens.length,
      transcript: alignment.transcript,
      unalignedWords: alignment.unalignedWords,
    });
    const readingDurationMs = Math.max(2_000, Math.round(
      (this.autoFinishArmedAt || (this.attemptStartedAt + durationMs)) - this.attemptStartedAt,
    ));
    const coverage = describeReadingCoverage(outcome.evidence?.coverage ?? 0);
    const pace = describeReadingPace({ matchedWords: alignment.matchedCount, readingDurationMs });
    const result = freezeEvent("reading-attempt-finished", {
      accepted: outcome.accepted,
      automaticFinish: Boolean(automatic),
      confidenceBand: outcome.confidenceBand,
      coverage,
      evidence: outcome.evidence,
      matchedWords: alignment.matchedCount,
      modelFailed,
      pace,
      passageId: this.passageId,
      readingDurationMs,
      reason: outcome.reason,
      retryAvailable: outcome.retryAvailable,
      totalWords: this.tokens.length,
    });
    this.onResult(result);
    if (this.retainTroubleshooting) {
      await Promise.resolve(this.onDiagnostic(Object.freeze({
        audio: diagnosticAudio,
        sampleRate: 16_000,
        summary: result,
        transcript: finalTranscript,
        transcriptTrace: Object.freeze([...this.transcriptTrace]),
      }))).catch((error) => {
        this.emitStatus("diagnostic-save-failed", { message: error.message });
      });
    }
    this.finishing = false;
    this.emitStatus("complete", { automatic: Boolean(automatic) });
    return result;
  }

  restart() {
    return this.listening ? this.finish({ restarted: true }) : Promise.resolve(null);
  }

  async close() {
    if (this.closed) return;
    this.stopTimers();
    this.listening = false;
    await this.stopStreaming();
    await this.capture.cleanup().catch(noop);
    await Promise.resolve(this.streamingRecognizer?.close?.()).catch(noop);
    this.whisper.close();
    this.closed = true;
    this.emitStatus("closed");
  }
}

export const READING_ATTEMPT_DEFAULTS = Object.freeze({
  autoFinishSilenceMs: DEFAULT_AUTO_FINISH_MS,
  checkpointIntervalMs: DEFAULT_CHECKPOINT_INTERVAL_MS,
  checkpointMinimumMs: DEFAULT_CHECKPOINT_MINIMUM_MS,
  checkpointOverlapMs: DEFAULT_CHECKPOINT_OVERLAP_MS,
  monitorIntervalMs: DEFAULT_MONITOR_INTERVAL_MS,
});
