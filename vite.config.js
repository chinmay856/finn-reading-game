import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        moonshineBenchmark: resolve(import.meta.dirname, "moonshine-benchmark.html"),
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
