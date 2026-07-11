# ADR 0001: Use local Whisper for the desktop prototype

- **Status:** Accepted
- **Date:** 2026-07-10

## Context

The browser Web Speech prototype produced noticeably unreliable transcripts and
its browser-selected speech service was opaque. This is a private, one-player
side project. The user does not want usage fees or application-controlled
retention or upload of a child's voice data. The active target is now a desktop
browser; the existing mobile path is retained only for occasional side testing.

## Decision

Use Transformers.js `3.7.1` with
`onnx-community/whisper-base_timestamped` in a browser worker, matching the
maintained Hugging Face reference implementation. Capture audio in memory,
decode it through the browser at 16 kHz, run inference locally through
WebAssembly/q8 by default, and discard samples immediately after each
transcription. Do not persist transcripts in reports or local storage.

Keep the provider behind theme-neutral files in `speech/`. Keep alignment,
timing, and scoring in the Reading Engine. Do not put game-wrapper concepts in
either layer.

Reward higher WPM when the accuracy threshold is met. Do not enforce a maximum
WPM. Apply a bounded timing allowance for natural clause and sentence pauses;
keep comprehension independent from speech scoring.

## Consequences

- No API key, speech backend, service account, or per-use bill is required.
- The first visit downloads a sizeable model and browser runtime; later visits
  normally use the browser cache.
- Inference latency varies with desktop hardware and browser capabilities.
- Local Whisper estimates transcription but does not provide a formal
  pronunciation assessment.
- WebAssembly/q8 is slower than WebGPU but produced the proven result on the
  development computer: 95% aligned accuracy at 243 WPM. WebGPU/q4 produced
  unusable output in both the application and Hugging Face's untouched
  public-sample demo, so it remains an explicit diagnostic option only.
- The historical mobile prototype remains in Git and is not deleted, but it is
  not an active optimization target.
