export const STREAMING_GUIDE_QUERY_VALUE = "1";

const REASONS = Object.freeze({
  disabled: "feature-disabled",
  isolation: "cross-origin-isolation-required",
  pcm: "streaming-pcm-unavailable",
  runtime: "sherpa-runtime-unavailable",
});

export function resolveStreamingGuideGate({
  requested = false,
  crossOriginIsolated = false,
  sharedArrayBufferAvailable = false,
  streamingPcmAvailable = false,
  sherpaRuntimeAvailable = false,
} = {}) {
  let reason = null;
  if (!requested) reason = REASONS.disabled;
  else if (!crossOriginIsolated || !sharedArrayBufferAvailable) reason = REASONS.isolation;
  else if (!streamingPcmAvailable) reason = REASONS.pcm;
  else if (!sherpaRuntimeAvailable) reason = REASONS.runtime;

  return Object.freeze({
    enabled: reason == null,
    mode: reason == null ? "streaming-sherpa" : "whisper-checkpoint-fallback",
    reason,
    requested: Boolean(requested),
  });
}

export function streamingGuideGateMessage(gate) {
  if (gate.enabled) return "Local streaming guide ready; final scoring still uses Whisper.";
  if (!gate.requested) return "Local Whisper checkpoint guide active.";
  if (gate.reason === REASONS.isolation) {
    return "Streaming guide unavailable on this host; secure Whisper checkpoint fallback active.";
  }
  if (gate.reason === REASONS.pcm) {
    return "Streaming audio frames are unavailable in this browser; Whisper checkpoint fallback active.";
  }
  return "Streaming recognizer assets are unavailable; Whisper checkpoint fallback active.";
}
