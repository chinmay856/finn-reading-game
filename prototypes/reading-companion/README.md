# Evidence-locked reading companion spike

This standalone page tests a theme-neutral live reading cursor without changing
the production application. It replays one fixed, licensed recording through a
real streaming recognizer and moves the visible cursor only when recognition
evidence aligns with the known passage.

## Why this is different

- Live progress and final scoring are separate jobs.
- The live engine is allowed to produce an ugly, revisable transcript.
- The cursor is monotonic and evidence-locked; elapsed time alone cannot move it.
- Cursor catch-up is animated across intervening words rather than jumping.
- The same audio can be replayed repeatedly, producing comparable event traces.

## Proven upstream inputs

- sherpa-onnx WebAssembly release `v1.13.2`
- sherpa-onnx streaming Zipformer English model
  `sherpa-onnx-streaming-zipformer-en-2023-06-21`
- CPU, one thread, greedy streaming decode, 16 kHz mono input
- LibriSpeech fixture `1272-128104-0002`, CC BY 4.0

The unpacked model/runtime is about 203 MB. Once loaded, inference is local
and the browser can run without sending audio or transcripts anywhere. The
prototype does not retain either.

## Run

From the worktree root, start the prototype server and open:

```text
node prototypes/reading-companion/server.mjs
http://127.0.0.1:8918/
```

The small dedicated server supplies the cross-origin isolation headers required
by the official WebAssembly build's worker/shared-memory runtime.

Prepare the ignored local vendor directory once, then use **Run sample** after
the status changes to ready:

```powershell
powershell -ExecutionPolicy Bypass -File prototypes/reading-companion/fetch-sherpa.ps1
```

The helper downloads the exact official GitHub release artifact. The large
generated `vendor/` directory is deliberately not committed.

## Checks

```text
node --test prototypes/reading-companion/tracker-core.test.js
```

## Acceptance gate

Continue with this engine only when the fixture and later consented real-reader
tests show:

- first useful cursor evidence in roughly one second;
- partial revisions frequent enough to avoid multi-second frozen highlighting;
- monotonic cursor movement without timer-led drift;
- final reference coverage comparable to the fixed transcript;
- model load, CPU blocking, and memory acceptable on the target desktop.

The spike is not production code. It deliberately does not modify the current
reading UI, scoring pipeline, wrapper, or deployed application.

Measured results and the architecture recommendation are recorded in
`docs/engine/READING_COMPANION_PROGRESS_SPIKE.md`.
