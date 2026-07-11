# Session handoff

## Current state

- Branch: `agent/reading-profile-and-end-detection`
- Base: synchronized `main` at merge commit `c759d18` from PR #11
- Live deployment before this branch:
  <https://chinmay856.github.io/finn-reading-game/>
- Speech: local Transformers.js `3.7.1`,
  `onnx-community/whisper-base_timestamped`, WebAssembly/q8
- Privacy: audio and transcripts stay local; transcript diagnostics are visible
  only in the current tab and copied reports still exclude transcript text

## User evidence

The corrected uninterrupted recording produced 200/220 confirmed words, 91%
accuracy, 131 WPM, and 96% furthest passage position. This validated the capture
fix and the user's expected 80–90% accuracy range. The remaining experience had
consistent paragraph-end visual lag and automatic completion before the true
end.

The completed session was inspected in the live browser, but its transcript
could not be recovered because the deployed build intentionally neither exposed
nor retained transcript text.

## Implemented response

- Added a theme-neutral content record and reading profile under
  `content/evidence-passage.js`.
- The expository-science profile now supplies accuracy/WPM guidance,
  segmentation, checkpoint timing, and end-detection evidence.
- Reduced the natural-pause trigger from 900 ms to 450 ms.
- Reduced the minimum checkpoint window from eight seconds to five and the
  maximum fallback window from 22 seconds to 16.
- Removed the fixed 94% auto-finish threshold.
- Automatic completion now requires at least six matches among the last ten
  passage tokens plus a 900 ms final pause.
- Added a collapsed review panel containing the final transcript and each live
  checkpoint transcript. It is ephemeral and excluded from reports.
- Added reusable `hasEndEvidence` behavior and content-profile tests.

## Runtime interpretation

The default is the proven compatible WASM/q8 path, not the theoretically fastest
path. WebGPU produced unusable output on this computer in both this project and
the maintained upstream example. This change removes avoidable application
delay without changing the model/runtime. Use the next timing/transcript evidence
before benchmarking another local model.

## Validation

- `npm run check` — passed
- `npm test` — passed, 25 tests
- `npm run build` — passed
- `git diff --check` — passed
- Real microphone validation remains required

## Preserved state

`tests/audio-capture.test.js` retains a pre-existing line-ending-only status
with no content diff. It remains unstaged and undiscarded.

## Recommended next step

Publish and reread once. Inspect the transcript panel after completion. Compare
paragraph-ending words across checkpoint transcripts and the final transcript,
and note the visible checkpoint latency. If transcripts contain the words but
the UI still lags, optimize scheduling/runtime; if the words are absent, adjust
window overlap or recognition strategy. Then create additional reading-profile
fixtures for narrative, poetry, and drama before treating any WPM target as
universal.
