# Reading Companion production integration — 2026-07-14

## Outcome

The proven low-latency Reading Companion now has a checksum-pinned production
runtime live at <https://finn-reading-game.web.app/> on single-origin Firebase
Hosting. The existing public GitHub Pages build remains intentionally
non-isolated and keeps the local Whisper checkpoint fallback.

An isolated origin requests Sherpa by default and eagerly prepares the exact
pinned runtime after COOP/COEP, `SharedArrayBuffer`, and streaming PCM checks
pass. Before Emscripten loads, the app streams the 190,951,044-byte data package
into a versioned Origin Private File System file. Repeat loads validate its
exact size and provide its local `ArrayBuffer` through Emscripten's synchronous
`Module.getPreloadedPackage` hook, avoiding another data-file request.
`?streamingGuide=0` disables the live lane for diagnosis. Missing headers,
assets, OPFS, or browser support fail safely to the direct runtime path and
checkpoint guide; Whisper remains the final assessment authority in every case.

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
- `reading-companion/streaming-guide-gate.js` requires a feature request,
  `crossOriginIsolated`, `SharedArrayBuffer`, the PCM tap, and the loaded pinned
  sherpa runtime. Isolated origins request the lane by default; a query override
  can enable or disable it explicitly. Any missing precondition preserves the
  Whisper checkpoint fallback and Continue path.
- `speech/sherpa-runtime-loader.js` loads the two classic upstream scripts in
  dependency order from `sherpa/v1.13.2/`, shares concurrent work, waits for
  real Emscripten initialization, and preserves abort/load errors for honest
  fallback diagnostics.
- `speech/sherpa-runtime-opfs.js` requests persistent storage when available,
  streams one cold network response into a versioned OPFS directory, validates
  the exact 190,951,044-byte file, reads it locally on repeat loads, and exposes
  download progress without retaining transcript or audio data.
- `speech/sherpa-runtime-loader.js` installs the synchronous
  `Module.getPreloadedPackage` hook before injecting the Emscripten main script,
  while preserving any prior Module hooks.
- The first Firebase preview briefly shipped a cache-first worker which could
  hold the large response inside `cache.put()`. The same worker URL now ships a
  no-fetch migration worker: it skips waiting, claims the page, deletes every
  `finn-sherpa-runtime-*` Cache Storage entry, and answers only a readiness
  handshake. OPFS download cannot begin until an old controller is replaced.
- `app.js` starts and stops the live lane independently from full-session audio
  capture. A live-lane failure cannot disable the microphone recording, final
  Whisper result, Continue, or game-rule consequence.
- Exported timing reports may include the selected lane, fallback reason, and
  warm-up duration. They still exclude audio and transcript text.

`scripts/prepare-sherpa-assets.mjs` downloads or consumes the exact upstream
archive, verifies the archive plus all four required files by SHA-256, and
copies the approximately 194 MiB payload into the generated Firebase artifact.
The binary payload is never committed to Git. Small versioned JavaScript and
WASM files retain the one-year immutable HTTP cache policy; the large data file
is fetched with `no-store` and persisted in versioned OPFS instead. HTML always
revalidates. Automated tests prove one cold network fetch plus file write, then
a fresh runtime reading the validated OPFS file with zero network requests.

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

## Production-host audit

Both public hosts were probed directly on 2026-07-14. Firebase is the isolated
testing surface:

```text
https://finn-reading-game.web.app/
HTTP 200
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
crossOriginIsolated: true
SharedArrayBuffer: available
```

The GitHub Pages fallback is deliberately non-isolated:

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

Firebase Hosting was selected instead of Cloudflare Pages because the Sherpa
data file is 190,951,044 bytes while Cloudflare Pages and Workers Static Assets
cap individual files at 25 MiB. Firebase accepts files up to 2 GB and can apply
the required headers directly. This keeps the app and runtime same-origin
without adding an object-store proxy before the first production acceptance
run. See ADR-004.

## Release evidence

Completed on the live Firebase origin:

1. Deployed the verified artifact and confirmed the document and runtime
   responses return the intended isolation and cache headers.
2. Cold-loaded Sherpa, stored the exact 190,951,044-byte data file in OPFS,
   cleared the normal HTTP cache, and confirmed a fresh page issued no `.data`
   network request. The migration worker has no fetch handler and clean profiles
   retain no Cache Storage or service-worker state.
3. Confirmed a clean Chrome cold load initializes sherpa-onnx `v1.13.2` and a
   repeat load reaches ready in 4.8 seconds from OPFS. The full game reaches the
   Recovery Map in 6.0 seconds without another model download.
4. Confirmed runtime and storage logs contain model/runtime bytes only; no
   transcript or audio persistence was added.
5. Cold-loaded `onnx-community/whisper-base_timestamped` under production COEP,
   initialized the WASM scoring lane in 100 seconds on the test connection, and
   completed a local inference call. A second `load()` on the retained
   recognizer returned in 0 ms, matching the app's reuse-across-passages design.

Remaining before calling the low-latency lane fully production-accepted:

1. Run the browser fixture suite twice and confirm the committed sub-one-second
   gates on the production origin.
2. Run one consenting natural 180–220 WPM reader on the target desktop.
3. Verify microphone denial, model-load failure, streaming mid-session failure,
   manual scroll, reduced motion, keyboard use, and Continue fallback.
4. Move synchronous sherpa decode into a worker before default enablement if
   the remaining 80–90 ms UI-thread blocks are perceptible in real gameplay.

Until those gates pass, claims should say the low-latency lane is proven,
production-packaged, and enabled only on the isolated preview. GitHub Pages
remains the non-isolated fallback.
