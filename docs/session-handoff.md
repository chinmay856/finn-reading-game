# Session handoff

## Current state

- Branch: `agent/predictive-reading-guide`
- Base: synchronized `main` at merge commit `996971e` from PR #12
- Live deployment before this branch:
  <https://chinmay856.github.io/finn-reading-game/>
- Current engine: Transformers.js `3.7.1`, timestamped Whisper base,
  WebAssembly/q8
- Privacy: all recognition remains local; transcript diagnostics are ephemeral

## Latest user evidence

The corrected engine appears to recognize the full reading, but confirmed
progress arrives after the reader reaches the bottom of the viewport. Paragraph
transitions force unnatural mid-sentence pauses. The required experience must
support approximately 250 WPM and may need headroom for faster reading.

This establishes that confirmed transcription is too latent to serve as the
navigation clock even when its final accuracy is acceptable. Current graphics
are inexpensive and inference runs in a worker; the dominant problem is waiting
for checkpoint transcription before scrolling, not site artwork.

## Implemented response

- Added a theme-neutral predictive guide under `reading-guide.js`.
- The guide advances from active speaking time and a selectable 150, 200, 250,
  or 300 WPM profile; 250 WPM is the default.
- Eighteen words of look-ahead and a taller 56vh reading viewport keep current
  and upcoming prose visible.
- Voice pauses stop the guide clock.
- Manual wheel, pointer, or touch scrolling pauses automatic guidance for five
  seconds so the interface does not fight the reader.
- Confirmed transcript progress remains separately labeled and continues to
  drive WikiWhy repair.
- Voice activity and guide position never participate in completion, accuracy,
  scoring, or repair. End detection still requires actual final-token evidence.

## Research

The maintained Hugging Face Moonshine Web example is the next engine candidate
if UI decoupling is insufficient. It uses the same Transformers.js `3.7.1`,
Moonshine Base, Silero VAD, WebGPU with WASM fallback, and serialized inference.
It is designed for live recognition but has a substantially larger model and
must be benchmarked before integration. See `docs/engine/SPEECH_TECH_RESEARCH.md`.

## Validation

- `npm run check` — passed
- `npm test` — passed, 28 tests
- `npm run build` — passed
- Browser smoke: 250 WPM selected by default, 300 WPM available, taller reader
  grid present, transcript panel present, no console warnings/errors
- Real microphone naturalness test remains required

## Preserved state

`tests/audio-capture.test.js` retains a pre-existing line-ending-only status
with no content diff. It remains unstaged and undiscarded.

## Recommended next step

Publish and test the 250 WPM guide once. Read without waiting for confirmed
highlighting and judge only whether upcoming text remains comfortably visible.
If the guide still lags, select 300 WPM or increase look-ahead. If navigation is
comfortable but confirmed repair remains distractingly delayed, run the exact
maintained Moonshine Web example as an isolated benchmark before changing the
production speech adapter.
