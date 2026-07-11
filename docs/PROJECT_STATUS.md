# Project status

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Repository:** `chinmay856/finn-reading-game`
- **Live desktop prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployment:** GitHub Pages through GitHub Actions, with HTTPS enforced
- **Current stage:** Validate local Whisper transcription, forgiving alignment,
  and speed-plus-accuracy scoring in a desktop browser

All active project work now happens through this Codex workspace and GitHub.
There is no remaining requirement to reconcile parallel web or mobile chat
threads.

## Current implementation

The repository root contains the intentionally small desktop mechanics test:

- `index.html` and `styles.css` provide the existing lightly retro test interface.
- `app.js` owns browser integration, microphone permission, local transcription
  state, retry/accept behavior, diagnostics, and review UI.
- `speech/` owns theme-neutral in-memory audio capture and the Transformers.js
  Whisper adapter/worker. The maintained `onnx-community/whisper-base_timestamped`
  model runs locally through the proven WebAssembly/q8 path by default. WebGPU
  remains an explicit experimental diagnostic option, not the default.
- `reading-engine.js` owns theme-neutral normalization, forgiving transcript
  alignment, and scoring data. It must remain free of wrapper terminology.
- `tests/` checks alignment behavior, DOM references, and the engine/wrapper
  boundary.
- `.github/workflows/ci.yml` runs checks and tests.
- `.github/workflows/pages.yml` deploys `main` to GitHub Pages.
- [`engine/SPEECH_TECH_RESEARCH.md`](engine/SPEECH_TECH_RESEARCH.md) records the
  reuse-first decision and future comparison options.

The StoryQuest label is a temporary mechanics-test presentation, not the
canonical long-term game wrapper. Internet Recovery OS remains the first planned
wrapper. The user is working on design separately; do not redesign this test UI
while validating the engine.

## Canonical product facts

- Finn is the fixed protagonist and player character.
- Chinmay is Finn's uncle, the AI-company CEO/developer, and the fixed main
  antagonist.
- The reusable Reading Engine, Content Platform, Game Rules, and Game Wrapper
  concerns remain separate.
- A future Chinmay voice add-on is optional wrapper presentation, requires
  explicit consent and disclosure, and is not part of the current prototype.
- The app uploads and stores no audio or transcripts. Audio is held only in
  memory for local transcription and is discarded after each result.
- Faster reading is beneficial when accuracy and independent comprehension stay
  adequate. There is no maximum-WPM penalty, and punctuation pauses receive a
  bounded timing allowance.

## Immediate next action

Publish the proven WebAssembly-default build, then run the complete four-line
loop from the HTTPS GitHub Pages URL in current Chrome. Compare local transcripts
with what was read, observe first-load time and per-line latency, and paste the
no-audio diagnostic report into Codex if a score feels unfair. Test Edge and a
second WebAssembly-capable desktop browser after Chrome establishes the baseline.

## Known limitations

- One real Chrome microphone line passed locally at 95% estimated accuracy and
  243 WPM through WebAssembly/q8. A full four-line HTTPS session is still needed.
- Whisper transcription is still an estimate, not a formal pronunciation
  assessment; clarity must be evaluated through accuracy and comprehension.
- The first model load is roughly 77 MB on the default WebAssembly path, and
  local transcription latency varies by browser and hardware.
- WebGPU/q4 is not trustworthy on the development computer; even Hugging Face's
  untouched public-sample demo produced unusable output in Chrome. Do not make
  WebGPU the default without new evidence.
- WPM and accuracy are prototype estimates intended to test whether the mechanic
  feels understandable and fair.

## Repository workflow

1. Start from synchronized `main`.
2. Use one scoped `agent/<description>` branch per task.
3. Keep implementation, relevant tests, and truth-changing documentation in the
   same pull request.
4. Merge only after checks pass.
5. Return local `main` to the merged, deployed state.

Historical PR #1 (cross-interface workflow) and PR #2 (earlier separated mobile
foundation) are superseded references, not active implementation branches. PR #3
is the preserved basis of the mobile side-test prototype. Do not delete its
branch or history; do not spend further mobile optimization time unless asked.

## Validation commands

```text
npm run check
npm test
npm run build
npm run dev
```
