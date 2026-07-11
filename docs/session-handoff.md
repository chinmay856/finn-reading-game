# Session handoff

## Current state

- Branch: `agent/wikiwhy-loop-hardening`
- Base: synchronized `main` at merge commit `480b636` from PR #9
- Live deployment before this branch:
  <https://chinmay856.github.io/finn-reading-game/>
- Speech: local Transformers.js `3.7.1`,
  `onnx-community/whisper-base_timestamped`, WebAssembly/q8
- Privacy: capture, voice activity, transcription, and alignment remain local;
  reports contain neither audio nor transcript text

## Hardening implemented

- Reading Engine alignment now reports furthest confirmed position separately
  from matched-word completion/accuracy.
- Live progress is monotonic and follows actual reading position even when the
  recognizer misses an earlier word.
- Checkpoints transcribe bounded windows with three seconds of audio overlap and
  twelve tokens of alignment overlap instead of repeatedly processing the full
  growing recording.
- The final full-session transcription remains the reconciliation and scoring
  source after Finish Reading.
- A diagnostics-only timing report can be copied or downloaded after the run.
- An independent comprehension question completes the WikiWhy payoff without
  mixing comprehension into speech scoring.
- Final-transcription failure produces a reviewable zero-evidence result rather
  than leaving the UI stuck.

## Validation

- `npm run check` — passed
- `npm test` — passed, 20 tests
- `npm run build` — passed
- Tests cover position-versus-completion progress, overlapping alignment
  windows, architecture boundaries, local-only reporting, silence handling,
  forgiving alignment, and punctuation-aware uncapped pace

## Preserved state

`tests/audio-capture.test.js` had a line-ending-only working-tree status before
this branch began. It has no content diff and has not been staged, discarded,
or rewritten.

## Recommended next step

Publish this branch and run a real Chrome microphone reading. Copy the timing
report afterward. Keep the batching mechanic only if checkpoints normally land
within roughly three seconds and the active paragraph stays no more than one
paragraph behind. If it fails that bar, compare a faster proven local runtime
instead of compensating with visual delay.
