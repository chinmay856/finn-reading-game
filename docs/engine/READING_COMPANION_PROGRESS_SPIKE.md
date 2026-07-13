# Reading companion progress spike

## Status

Isolated architecture and browser prototype, July 12, 2026. Nothing in the
deployed application or current reading loop was changed.

## Decision

Use two independent local lanes instead of asking one recognizer to provide both
the reading experience and the score:

```text
16 kHz microphone audio
  |
  +-- live guidance lane
  |     streaming local ASR -> known-text alignment -> monotonic cursor events
  |     rough/revisable transcript; never persisted; never used as the final score
  |
  +-- assessment lane
        uninterrupted local recording -> slower full-session Whisper pass
        forgiving final alignment/scoring; may finish 15-20 seconds later
```

The first lane answers only, "Where is the reader now?" The second answers,
"How did the completed attempt go?" This matches the product need better than
trying to make chunked Whisper simultaneously low-latency and definitive.

Visible guidance is deliberately coarser than the hidden evidence. The tracker
retains word-level position internally, but the prototype highlights one
authored line at a time and centers that line. It looks ahead by 2-4 words,
scaled from the fixture's pace, to compensate for roughly one second of
recognition latency. Individual word revisions therefore do not become visible
UI jitter.

## Proven candidate

The standalone prototype under `prototypes/reading-companion/` runs the official
sherpa-onnx `v1.13.2` WebAssembly release with the English streaming Zipformer
model `sherpa-onnx-streaming-zipformer-en-2023-06-21`.

- Code/runtime license: Apache 2.0.
- Model license: Apache 2.0.
- Runtime: local CPU WebAssembly, 16 kHz mono input, greedy streaming decode.
- Data flow: audio and partial transcripts remain in browser memory.
- Network use: only the versioned model/runtime artifact is downloaded.
- Unpacked runtime/model footprint: about 203 MB.
- Hosting requirement: cross-origin isolation headers are required by the
  official worker/shared-memory build.

Primary references:

- <https://k2-fsa.github.io/sherpa/onnx/wasm/index.html>
- <https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-transducer/zipformer-transducer-models.html>
- <https://github.com/k2-fsa/sherpa-onnx/releases/tag/v1.13.2>
- <https://github.com/k2-fsa/sherpa-onnx/blob/master/LICENSE>
- <https://huggingface.co/marcoyang/icefall-libri-giga-pruned-transducer-stateless7-streaming-2023-04-04>

## Repeatable fixture

The test uses LibriSpeech clip `1272-128104-0002`, a 12.485-second clean adult
read-aloud recording with its exact 32-word reference transcript. LibriSpeech is
CC BY 4.0. The fixture prevents microphone setup, reader variation, and repeated
manual recording from obscuring changes to the tracker.

- <https://openslr.org/12/>
- <https://huggingface.co/datasets/hf-internal-testing/librispeech_asr_dummy>

## Measured browser result

Measured in the Codex in-app Chromium browser on the development computer after
serving the prototype with the required isolation headers:

| Measure | Result |
| --- | ---: |
| Model initialization | 47.664 s |
| Fixture duration | 12.485 s |
| First partial transcript | 1.133 s |
| First cursor evidence | 1.133 s |
| Partial revisions | 30 |
| Cursor advances | 27 |
| Longest gap between evidence updates | 1.362 s |
| Total synchronous decode time | 2.461 s |
| Worst observed decode block | 97 ms |
| Final reference coverage | 32 / 32 words |

After correcting partial-transcript alignment to treat live input as a passage
prefix, early evidence advanced in order (`HE` -> `HE TELLS` ->
`HE TELLS US`) rather than jumping toward unseen later text. Hidden evidence
never moves backward when a partial transcript is revised. Visible guidance
changes only when the anticipated authored line changes.

## Tough fixture suite

The repeatable suite reuses the same local model and exact reference across six
conditions. The final instrumented run used line-level visible guidance:

| Fixture | Effective WPM | First evidence | Longest evidence gap | Worst decode block | Hidden evidence end | Visible line end | Matched coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Natural recording | 154 | 1.200 s | 1.291 s | 111 ms | 32/32 | 4/4 | 32/32 |
| Accelerated delivery | 200 | 0.835 s | 0.559 s | 129 ms | 31/32 | 4/4 | 31/32 |
| Accelerated delivery | 250 | 0.896 s | 0.402 s | 111 ms | 30/32 | 4/4 | 29/32 |
| 1.5-second middle pause | 137 | 1.130 s | 1.352 s | 133 ms | 32/32 | 4/4 | 32/32 |
| Deterministic light noise | 154 | 1.456 s | 1.441 s | 208 ms | 32/32 | 4/4 | 32/32 |
| Repeated 1.6-second phrase | 136 | 1.122 s | 1.344 s | 104 ms | 32/32 | 4/4 | 32/32 |

An immediately repeated full-suite run produced identical coverage for all six
fixtures. First-evidence differences were under 80 ms in the natural, 200 WPM,
250 WPM, pause, and restart cases; the noise case differed by 7 ms.

The natural fixture is a real adult LibriSpeech recording at about 154 WPM. The
200 and 250 WPM versions accelerate those samples; they are useful compute,
latency, and alignment stress tests but also shift the signal and are not a
substitute for recordings of humans naturally reading at those speeds.

Most importantly for playability, the line guide reached the final authored
line in every case even when the 200 and 250 WPM stress transcripts missed one
or more individual words. Final scoring can reconcile those words later without
holding the live reader behind. Machine-readable results are stored at
`prototypes/reading-companion/benchmark-results-2026-07-12.json`.

## Preserved mobile prototype review

Before extending the spike, the earlier mobile-friendly StoryQuest and
`agent/mobile-read-aloud-foundation` implementations were reviewed. Useful
patterns carried forward are explicit readiness state, large touch controls,
compact live metrics, deterministic diagnostic reports, responsive layout, and
a theme-neutral alignment boundary. The old Web Speech dependency, forced line
checks, maximum-WPM warning, and retry-first flow are intentionally not carried
forward.

## What this proves

- A free, local streaming engine can supply roughly word-level position evidence
  without waiting for natural pauses or multi-second Whisper chunks.
- The UI can remain stable even when the partial transcript contains incomplete
  words such as `CHRISTM`, `RO`, or `RESUL`; the transcript is evidence, not UI.
- Live highlighting does not need to determine pronunciation or final accuracy.
- A monotonic known-text aligner prevents normal partial revisions from pulling
  the reader backward.

## What this does not prove

- One clean adult LibriSpeech clip does not establish quality for Finn's voice,
  fast reading, room noise, restarts, skipped lines, or self-corrections.
- A roughly 1.3-1.45-second worst evidence gap in natural/noisy conditions is
  useful but not consistently magical at word granularity. The line guide masks
  that gap more honestly than pretending every word is current.
- The 47-second initialization and roughly 203 MB footprint are too expensive
  to accept without deliberate preload/onboarding and real target-device tests.
- The official WebAssembly artifact requires `Cross-Origin-Opener-Policy` and
  `Cross-Origin-Embedder-Policy`. Current GitHub Pages hosting cannot add custom
  response headers directly, so production adoption needs either different
  hosting, a carefully validated isolation service-worker approach, or a proven
  single-thread build that does not require shared memory.

## Alternatives considered

### Continue chunking Whisper

Useful for the final assessment lane, but the current evidence already shows why
it is a poor sole source for live guidance: progress waits on bounded chunks,
natural pauses, and expensive reprocessing. `whisper.cpp` also labels its
real-time stream example naive; it repeatedly samples and reruns inference.

- <https://github.com/ggml-org/whisper.cpp#real-time-audio-input-example>

### Wav2Vec2 CTC plus custom forced alignment

Architecturally attractive because CTC emissions can be aligned directly to the
known text. The available browser-ready Wav2Vec2 base model has a roughly 95 MB
int8 variant, but the maintained Transformers.js interface is an ASR pipeline,
not a proven incremental browser forced-aligner. This remains a worthwhile
second spike only if Sherpa's load/hosting cost is unacceptable.

- <https://huggingface.co/onnx-community/wav2vec2-base-960h-ONNX/tree/main/onnx>
- <https://huggingface.co/facebook/wav2vec2-base-960h>

### Open-vocabulary keyword spotting

sherpa-onnx has a tiny English 3.3M-parameter keyword-spotting model and accepts
custom phrases. It may eventually provide much smaller anchor evidence, but the
official documented browser path is less mature and trigger sensitivity needs
passage-specific tuning. Treat it as a follow-up anchor experiment, not a ready
replacement.

- <https://k2-fsa.github.io/sherpa/onnx/kws/index.html>

### Browser Web Speech API

Fast interim text is useful as a non-private comparison baseline, but browser
implementations may use platform-hosted recognition and are inconsistent across
browsers. It does not meet the project's dependable local-processing boundary.

## Next acceptance gate

Before production integration, use the isolated harness with several fixtures
and then consented target-device readings. Require:

1. median first evidence near or below one second, allowing the current
   1.1-1.2-second natural result during early line-guide playtests;
2. 95th-percentile evidence gaps below about 1.25 seconds during continuous
   reading;
3. no backward line movement or false line jumps across repeated phrases;
4. correct behavior for pauses, skips, restarts, and self-corrections;
5. acceptable initialization, memory, CPU, and battery on the target desktop;
6. a hosting path that preserves cross-origin isolation without weakening the
   stable recovery shell or privacy model.

Until those gates pass, retain this as a prototype and keep the deployed reading
engine unchanged.
