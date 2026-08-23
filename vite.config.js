import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        kokoroVoiceComparison: resolve(import.meta.dirname, "kokoro-voice-comparison.html"),
        main: resolve(import.meta.dirname, "index.html"),
        moonshineBenchmark: resolve(import.meta.dirname, "moonshine-benchmark.html"),
        playableMissions: resolve(import.meta.dirname, "playable-missions.html"),
        sherpaRuntimeSmoke: resolve(import.meta.dirname, "sherpa-runtime-smoke.html"),
        speechModelComparison: resolve(import.meta.dirname, "speech-model-comparison.html"),
        readingAcceptanceBenchmark: resolve(import.meta.dirname, "reading-acceptance-benchmark.html"),
        readingGuidePlaytest: resolve(import.meta.dirname, "reading-guide-playtest.html"),
        whisperFixtureBenchmark: resolve(import.meta.dirname, "whisper-fixture-benchmark.html"),
      },
      output: {
        manualChunks(id) {
          const normalized = id.replaceAll("\\", "/");
          if (normalized.includes("/content/")) return "content-platform";
          if (normalized.includes("/apps/internet-recovery/")) return "internet-recovery-wrapper";
          return undefined;
        },
      },
    },
    target: "es2022",
  },
  worker: {
    format: "es",
  },
});
