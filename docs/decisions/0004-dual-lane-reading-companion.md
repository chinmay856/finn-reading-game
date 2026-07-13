# ADR 0004: Separate live reading guidance from final speech assessment

## Status

Proposed for integration, validated by an isolated browser spike on 2026-07-12.

## Context

The current time-led guide feels detached from the reader, while repeatedly
running the full Whisper assessment model creates avoidable latency. The player
needs a calm visual guide during reading; the game needs a defensible score only
after the attempt ends. Those jobs have different latency and accuracy needs.

## Decision

Use two local, replaceable speech lanes:

1. A streaming recognizer supplies rough partial text to known-text alignment.
   Alignment emits a monotonic, theme-neutral line position with a bounded
   2-4-word visual lead. It does not score, persist transcripts, or advance from
   elapsed time alone.
2. The existing full-session Whisper recognizer remains the final assessment
   authority. It may finish asynchronously after reading stops.

The Content Platform or view supplies authored display lines. The Reading
Engine reports line and hidden word indexes. The wrapper owns highlighting,
centering, reduced motion, manual-scroll behavior, and game consequences.

The proposed streaming implementation is sherpa-onnx `v1.13.2` with
`sherpa-onnx-streaming-zipformer-en-2023-06-21`, 16 kHz mono audio, CPU,
one thread, and greedy decoding. It remains behind a neutral adapter.

## Consequences

- Reading feedback can update in roughly one second without waiting for a
  polished transcript.
- Recognition revisions cannot pull the visible guide backward.
- A streaming failure can freeze or disable the guide without invalidating the
  final scoring lane.
- The official sherpa WebAssembly build requires cross-origin isolation and a
  roughly 203 MB first-load model/runtime download. Deployment must prove those
  headers and caching before integration is enabled.
- The accelerated 200 and 250 WPM fixtures are useful stress tests, not a
  substitute for consented human recordings at 180-220 WPM.

