import assert from "node:assert/strict";
import test from "node:test";

import { preparePinnedSherpaDataPackage } from "../speech/sherpa-runtime-opfs.js";

function createOpfsStore({ failWrite = false } = {}) {
  const files = new Map();
  const calls = { aborts: 0, closes: 0, writes: 0 };
  const directory = {
    async getFileHandle(name, { create = false } = {}) {
      if (!files.has(name) && !create) throw new Error("not found");
      return {
        async createWritable() {
          const chunks = [];
          return {
            async abort() {
              calls.aborts += 1;
            },
            async close() {
              calls.closes += 1;
              const size = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
              const combined = new Uint8Array(size);
              let offset = 0;
              for (const chunk of chunks) {
                combined.set(chunk, offset);
                offset += chunk.byteLength;
              }
              files.set(name, combined);
            },
            async write(value) {
              calls.writes += 1;
              if (failWrite) throw new Error("disk full");
              const bytes = value instanceof ArrayBuffer
                ? new Uint8Array(value)
                : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
              chunks.push(bytes.slice());
            },
          };
        },
        async getFile() {
          const bytes = files.get(name) ?? new Uint8Array();
          return {
            async arrayBuffer() {
              return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
            },
            size: bytes.byteLength,
          };
        },
      };
    },
    async removeEntry(name) {
      files.delete(name);
    },
  };
  return {
    calls,
    files,
    root: {
      async getDirectoryHandle(name, options) {
        assert.equal(name, "finn-sherpa-runtime-v1.13.2");
        assert.deepEqual(options, { create: true });
        return directory;
      },
    },
  };
}

function mockRuntime(store, bytes, { persistFails = false } = {}) {
  const calls = { fetches: 0, persists: 0 };
  return {
    calls,
    runtime: {
      document: { baseURI: "https://example.test/finn-reading-game/index.html" },
      async fetch(url, options) {
        calls.fetches += 1;
        assert.equal(
          url,
          "https://example.test/finn-reading-game/sherpa/v1.13.2/sherpa-onnx-wasm-main-asr.data",
        );
        assert.deepEqual(options, { cache: "no-store", credentials: "same-origin" });
        return new Response(bytes, { status: 200 });
      },
      navigator: {
        storage: {
          async getDirectory() {
            return store.root;
          },
          async persist() {
            calls.persists += 1;
            if (persistFails) throw new Error("denied");
            return true;
          },
        },
      },
    },
  };
}

test("a cold load fetches once, streams the exact package into OPFS, and reports progress", async () => {
  const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const store = createOpfsStore();
  const { calls, runtime } = mockRuntime(store, bytes);
  const progress = [];
  const prepared = await preparePinnedSherpaDataPackage({
    expectedSize: bytes.byteLength,
    onProgress: (detail) => progress.push(detail),
    runtime,
  });

  assert.equal(prepared.source, "network");
  assert.deepEqual([...new Uint8Array(prepared.buffer)], [...bytes]);
  assert.equal(calls.fetches, 1);
  assert.equal(calls.persists, 1);
  assert.equal(store.calls.writes, 1);
  assert.equal(store.calls.closes, 1);
  assert.equal(store.files.get("sherpa-onnx-wasm-main-asr.data").byteLength, bytes.byteLength);
  assert.ok(progress.some(({ source, stage, percent }) => (
    source === "network" && stage === "downloading" && percent === 100
  )));
});

test("a fresh runtime reads the validated OPFS package with zero network requests", async () => {
  const bytes = new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1]);
  const store = createOpfsStore();
  const cold = mockRuntime(store, bytes);
  await preparePinnedSherpaDataPackage({
    expectedSize: bytes.byteLength,
    runtime: cold.runtime,
  });

  const warm = mockRuntime(store, new Uint8Array([0]));
  const prepared = await preparePinnedSherpaDataPackage({
    expectedSize: bytes.byteLength,
    runtime: warm.runtime,
  });
  assert.equal(prepared.source, "opfs");
  assert.deepEqual([...new Uint8Array(prepared.buffer)], [...bytes]);
  assert.equal(warm.calls.fetches, 0);
  assert.equal(store.calls.writes, 1);
});

test("a wrong-size OPFS file is discarded and replaced by one exact network response", async () => {
  const bytes = new Uint8Array([4, 3, 2, 1]);
  const store = createOpfsStore();
  store.files.set("sherpa-onnx-wasm-main-asr.data", new Uint8Array([9, 9, 9]));
  const { calls, runtime } = mockRuntime(store, bytes);
  const prepared = await preparePinnedSherpaDataPackage({
    expectedSize: bytes.byteLength,
    runtime,
  });
  assert.equal(prepared.source, "network");
  assert.equal(calls.fetches, 1);
  assert.deepEqual([...store.files.get("sherpa-onnx-wasm-main-asr.data")], [...bytes]);
});

test("OPFS write failure removes the partial file and safely returns direct-download fallback", async () => {
  const bytes = new Uint8Array([1, 2, 3, 4]);
  const store = createOpfsStore({ failWrite: true });
  const { calls, runtime } = mockRuntime(store, bytes, { persistFails: true });
  const progress = [];
  const prepared = await preparePinnedSherpaDataPackage({
    expectedSize: bytes.byteLength,
    onProgress: (detail) => progress.push(detail),
    runtime,
  });
  assert.equal(prepared, null);
  assert.equal(calls.fetches, 1);
  assert.equal(store.calls.aborts, 1);
  assert.equal(store.files.size, 0);
  assert.equal(progress.at(-1).stage, "fallback");
});

test("unsupported OPFS falls through without starting a network request", async () => {
  let fetches = 0;
  const prepared = await preparePinnedSherpaDataPackage({
    runtime: {
      async fetch() { fetches += 1; },
      navigator: { storage: {} },
    },
  });
  assert.equal(prepared, null);
  assert.equal(fetches, 0);
});
