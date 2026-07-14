import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveStreamingGuideGate,
  streamingGuideGateMessage,
} from "../reading-companion/streaming-guide-gate.js";

const ready = Object.freeze({
  crossOriginIsolated: true,
  requested: true,
  sharedArrayBufferAvailable: true,
  sherpaRuntimeAvailable: true,
  streamingPcmAvailable: true,
});

test("does not load the streaming lane unless explicitly requested", () => {
  const gate = resolveStreamingGuideGate({ ...ready, requested: false });
  assert.equal(gate.enabled, false);
  assert.equal(gate.reason, "feature-disabled");
  assert.equal(gate.mode, "whisper-checkpoint-fallback");
});

test("fails closed when the production host is not cross-origin isolated", () => {
  const gate = resolveStreamingGuideGate({ ...ready, crossOriginIsolated: false });
  assert.equal(gate.enabled, false);
  assert.equal(gate.reason, "cross-origin-isolation-required");
  assert.match(streamingGuideGateMessage(gate), /fallback active/u);
});

test("enables only when isolation, PCM, and the pinned runtime are all present", () => {
  assert.deepEqual(resolveStreamingGuideGate(ready), {
    enabled: true,
    mode: "streaming-sherpa",
    reason: null,
    requested: true,
  });
});
