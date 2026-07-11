# Session handoff

## Current state

- Branch: `agent/speech-tool-research`
- Authoritative base: GitHub `main` at `67824e7`
- Target: desktop browser; the earlier mobile loop remains preserved in Git
- Speech engine: local Transformers.js `3.7.1` with
  `onnx-community/whisper-base_timestamped`
- Default runtime: WebAssembly/q8
- Privacy: microphone audio is held in memory, transcribed locally, and
  discarded; reports contain neither audio nor transcripts
- Deployment remains GitHub Pages at
  <https://chinmay856.github.io/finn-reading-game/>

## Evidence gathered

- The original browser Web Speech prototype produced noisy vendor-controlled
  transcripts.
- A first local spike using Transformers.js `4.2.0` and
  `whisper-base.en` produced unusable WebGPU text; its q8 fallback failed with an
  ONNX missing-scale error.
- Hugging Face's untouched timestamped-Whisper demo also produced unusable
  output from its built-in public sample through WebGPU in both the Codex
  in-app browser and ordinary Chrome on this computer.
- The exact maintained Transformers.js `3.7.1` timestamped-Whisper stack through
  WebAssembly/q8 transcribed a real Chrome microphone reading at 95% aligned
  accuracy and 243 WPM. The line advanced successfully after Check line.
- The obscure fictional proper noun `Misselthwaite` was removed from the sample
  because it was a poor mechanics-test word. `Mary Lennox` remains as a
  reasonable familiar-name test.

## Implementation state

- `speech/audio-capture.js` uses the maintained MediaRecorder plus browser
  16 kHz decode path and retains only aggregate signal diagnostics.
- `speech/local-whisper-recognizer.js` isolates the worker and defaults to WASM;
  `?speechDevice=webgpu` remains an explicit diagnostic override.
- `speech/whisper-worker.js` pins the proven model/runtime configuration.
- `reading-engine.js` keeps theme-neutral alignment and now estimates uncapped
  WPM with a bounded punctuation-pause allowance.
- The Reading Engine, Content Platform, Game Rules, and Game Wrapper boundaries
  remain documented and separate. Speech files contain no wrapper concepts.
- `AGENTS.md` now requires primary-source research, exact reference-version
  verification, and a narrow vertical proof before substantial integration.

## Validation

Run:

```text
npm run check
npm test
npm run build
```

The current automated suite covers DOM contracts, architectural boundaries,
silence rejection, non-audio signal summaries, forgiving alignment,
punctuation-aware pace, and the WASM default.

## Remaining risk and next step

The local one-line Chrome result is strong, but the complete four-line flow has
not yet been repeated from the published HTTPS URL. Publish this branch, verify
GitHub Actions and Pages, then run one full Chrome session. Do not optimize
mobile or re-enable WebGPU by default without new evidence.
