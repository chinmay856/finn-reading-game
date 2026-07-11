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
    },
    target: "es2022",
  },
  worker: {
    format: "es",
  },
});
