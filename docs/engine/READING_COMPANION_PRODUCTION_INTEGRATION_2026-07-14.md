# Reading Companion production integration — 2026-07-14

## Outcome

The proven low-latency Reading Companion now has a production integration
boundary, but it is intentionally **not enabled on the public GitHub Pages
build**. The public host still lacks the response headers required by the exact
sherpa-onnx runtime that passed the R&D fixture suite.

The game therefore keeps its existing local Whisper checkpoint guide and final
Whisper assessment as the default. `?streamingGuide=1` requests the new lane,
but the runtime fails closed to the checkpoint guide unless every production
precondition is present. This is an honest fallback, not a simulated streaming
result.

## Proven input retained

The implementation follows PR #115 / commit `233d3b0`:

- sherpa-onnx `v1.13.2`;
- `sherpa-onnx-streaming-zipformer-en-2023-06-21`;
- 16 kHz mono PCM, CPU, one thread, greedy decoding;
- recognizer initialization before the attempt plus a throwaway silent warm-up;
- exact 20 ms audio frames;
- progress only after local transcript evidence, never a timer;
- Whisper remains the final scoring authority.

The warmed browser evidence measured 341–845 ms from speech to first evidence,
302–381 ms p95 ongoing evidence lag, and 80–90 ms worst synchronous decode
blocks across the natural, 200 WPM, 250 WPM, pause, room-noise, and restart
fixtures. The fixture results contain no transcript or audio.

## Production wiring

- `speech/audio-capture.js` can expose resampled 16 kHz PCM through a dedicated
  AudioWorklet to an in-memory subscriber while preserving the uninterrupted
  MediaRecorder capture used by final Whisper scoring.
- `speech/streaming-pcm.js` converts browser-rate mono samples into exact 320
  sample / 20 ms frames without per-callback clock drift.
- `speech/sherpa-streaming-recognizer.js` owns the pinned runtime lifecycle,
  silent warm-up, stream lifecycle, decoding, and ephemeral partial updates
  behind the existing neutral recognizer contract.
- `reading-companion/streaming-guide-gate.js` requires an explicit feature
  request, `crossOriginIsolated`, `SharedArrayBuffer`, the PCM tap, and the
  already-loaded pinned sherpa runtime. Any missing precondition preserves the
  Whisper checkpoint fallback and Continue path.
- `app.js` starts and stops the live lane independently from full-session audio
  capture. A live-lane failure cannot disable the microphone recording, final
  Whisper result, Continue, or game-rule consequence.
- Exported timing reports may include the selected lane, fallback reason, and
  warm-up duration. They still exclude audio and transcript text.

The approximately 203 MB vendor runtime/model is not copied into the production
bundle. The exact approved artifact must be supplied only after a production
host and caching strategy pass the deployment gate.

## Viewport behavior integrated now

The evidence-led viewport refinement is safe on every host and is active
without the streaming feature:

- active early and middle lines use an 18-pixel top reading anchor;
- the browser's natural maximum scroll lets final lines settle lower without
  fake trailing space;
- the page scrolls to the complete target in one browser animation instead of
  waiting for later recognizer events to finish fixed 96-pixel steps;
- forward manual scrolling selects the line at the anchor immediately;
- backward scrolling cannot move the monotonic guide backward;
- manual visual position never changes confirmed words, transcript evidence,
  completion, accuracy, game progress, or final scoring;
- reduced-motion mode uses immediate scrolling.

## Current production-host audit

The public build was probed directly on 2026-07-14:

```text
https://chinmay856.github.io/finn-reading-game/
HTTP 200
Cross-Origin-Opener-Policy: absent
Cross-Origin-Embedder-Policy: absent
Cross-Origin-Resource-Policy: absent
Server: GitHub.com
```

The Pages workflow uploads a static Vite artifact through
`actions/deploy-pages`. There is no repository-controlled server response layer
where the required headers can be added. A query flag or HTML meta tag cannot
substitute for the missing isolation response headers.

## Remaining release gates

Before changing `streamingGuide` from opt-in/fail-closed to production default:

1. Choose a host that returns `COOP: same-origin`, `COEP: require-corp`, and
   `CORP: same-origin`, or separately validate an isolation service worker or a
   non-shared-memory runtime. Do not change the proven runtime silently.
2. Package and cache the exact pinned 203 MB runtime/model, then verify every
   model/runtime response is compatible with COEP.
3. Run the browser fixture suite twice and confirm the committed sub-one-second
   gates on the production origin.
4. Run one consenting natural 180–220 WPM reader on the target desktop.
5. Verify microphone denial, model-load failure, streaming mid-session failure,
   manual scroll, reduced motion, keyboard use, and Continue fallback.
6. Verify network logs show model/runtime downloads only and storage/copy
   reports contain no transcript or audio.
7. Move synchronous sherpa decode into a worker before default enablement if
   the remaining 80–90 ms UI-thread blocks are perceptible in real gameplay.

Until those gates pass, claims should say the low-latency lane is proven in R&D
and production-wired behind a fail-closed gate—not deployed on GitHub Pages.
