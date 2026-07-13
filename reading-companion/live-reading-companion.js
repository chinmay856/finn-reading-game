import { KnownTextLineGuide } from "./known-text-line-guide.js";

export class LiveReadingCompanion {
  constructor({ recognizer, passageId, lines, onGuidePosition = () => {}, wordsPerMinute = 180 }) {
    if (!recognizer || typeof recognizer.subscribe !== "function") {
      throw new Error("recognizer must implement subscribe(listener).");
    }
    this.recognizer = recognizer;
    this.onGuidePosition = onGuidePosition;
    this.guide = new KnownTextLineGuide({ passageId, lines, wordsPerMinute });
    this.unsubscribe = null;
  }

  async start() {
    this.guide.reset();
    this.unsubscribe = this.recognizer.subscribe(({ text, observedAtMs }) => {
      if (!text) return;
      this.onGuidePosition(this.guide.observePartial(text, observedAtMs));
    });
    await this.recognizer.start();
  }

  acceptAudio(samples, sampleRate) {
    this.recognizer.acceptAudio(samples, sampleRate);
  }

  async stop() {
    await this.recognizer.stop();
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  async close() {
    await this.stop();
    this.recognizer.close?.();
  }
}

export function assertStreamingRecognizer(recognizer) {
  for (const method of ["subscribe", "start", "acceptAudio", "stop"]) {
    if (typeof recognizer?.[method] !== "function") throw new Error(`Streaming recognizer is missing ${method}().`);
  }
  return recognizer;
}
