# Session handoff

## Current state

- Branch: `agent/fix-fragmented-final-audio`
- Base: synchronized `main` at merge commit `22706a7` from PR #10
- Live deployment before this branch:
  <https://chinmay856.github.io/finn-reading-game/>
- Speech: local Transformers.js `3.7.1`,
  `onnx-community/whisper-base_timestamped`, WebAssembly/q8
- Privacy: all voice processing remains local and audio is discarded

## User evidence

A complete reading produced 199 WPM but only 51/220 words, 23% accuracy, and
23% passage progress. The user judged the reading closer to 80–90% accuracy and
also found the Prepare/Start/Finish interaction inconsistent with continuous
reading.

## Root cause and fix

- Live checkpoints previously called `requestData()` on the same MediaRecorder
  later used for final scoring.
- The final pass concatenated the resulting WebM fragments. The observed
  51-word cutoff is consistent with browser decoding ending at the first
  fragment, even though duration measurement covered the complete reading.
- Capture now uses two recorders on the same local stream: an uninterrupted
  final recorder and an independently restarted preview recorder.
- Preview windows keep three seconds of decoded PCM overlap. Final scoring uses
  only the uninterrupted recording.
- Matched-token evidence is combined across live windows and final
  reconciliation so confirmed work is not erased by one failed pass.
- One Begin action now prepares the model and starts listening. The expected
  finish is automatic after at least 94% position and a 1.8-second final pause;
  `Finish now` remains a fallback.

## Validation

- `npm run check` — pending final rerun after documentation
- `npm test` — pending final rerun; expanded to 22 tests
- `npm run build` — pending final rerun
- A real Chrome microphone reread is required before claiming the accuracy bug
  is resolved

## Preserved state

`tests/audio-capture.test.js` continues to show a pre-existing line-ending-only
working-tree status with no content diff. It remains unstaged and undiscarded.

## Recommended next step

Publish, reread the live passage once, and compare the result with the prior
51/220 cutoff. Confirm that the session begins with one click and normally ends
without using `Finish now`. Copy the timing report if accuracy or automatic
completion is still unfair.
