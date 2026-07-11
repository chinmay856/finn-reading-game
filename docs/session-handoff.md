# Session handoff

## Current state

- Branch: `agent/batched-reading-spike`
- Base: synchronized `main` at `1e9db63`
- Design foundation: merged locally from `agent/amy-techno-design` at `0beafcf`;
  that design branch was present on GitHub but had not been merged into `main`
- Target: current desktop Chrome
- Speech: local Transformers.js `3.7.1`,
  `onnx-community/whisper-base_timestamped`, WebAssembly/q8
- Privacy: capture, voice activity, transcription, and alignment remain local;
  audio is held in memory and discarded

## Implemented spike

- One continuous approximately 220-word grades 10–12 passage replaces four
  line-by-line checks.
- One Start Reading and one Finish Reading control; no sentence checkpoints.
- Natural pauses after at least 8 seconds trigger cumulative snapshots; an
  uninterrupted 22-second window provides a fallback checkpoint.
- Only one inference runs at once, confirmed alignment never moves backward,
  and the final full recording reconciles the result.
- The compact reader advances by paragraph while a wrapper-owned WikiWhy page
  repairs from left to right using theme-neutral progress.
- The UI exposes checkpoint latency because naturalness is the primary unknown.

## Validation

- `npm run check` — passed
- `npm test` — passed, 18 tests
- `npm run build` — passed
- Local browser DOM and console smoke test — passed with no warnings/errors
- Real microphone reading — still required; the automated browser remained at
  its own microphone permission prompt and cannot establish perceived latency

## Recommended next step

Publish this branch, read the passage naturally in Chrome, and observe the
`Last checkpoint` number. Keep the approach only if progress normally appears
within about three seconds of a pause and stays no more than one paragraph
behind. If WASM cannot meet that bar, reassess the recognition runtime rather
than hiding latency with more UI animation.
