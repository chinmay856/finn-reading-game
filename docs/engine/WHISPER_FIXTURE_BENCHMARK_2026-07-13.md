# Production Whisper fixture benchmark — 2026-07-13

## Decision

Keep the production final-assessment lane on Transformers.js `3.7.1`,
`onnx-community/whisper-base_timestamped`, and WebAssembly/q8. Do not claim that
rolling Whisper checkpoints are a true streaming lane, and do not shorten the
checkpoint windows merely to make the progress display move more often.

The maintained Hugging Face word-timestamp example still uses this exact
package, model, device, dtype, warm-up, 30-second chunk, and word-timestamp
configuration. Sherpa-onnx `v1.13.2` remains the separately proven streaming
candidate, but the approximately 203 MB runtime and cross-origin-isolation
hosting gate remain unresolved for the public GitHub Pages build.

## Repeatable acceptance test

Open `/whisper-fixture-benchmark.html` and select **Run fixture benchmark**. The
page runs the production worker against the included LibriSpeech
`1272-128104-0002` clip, then repeats it at accelerated 200 and 250 WPM. It also
transcribes overlapping six-second windows to measure the current live-lane
tradeoff. Audio and transcripts remain in the tab and are not persisted.

## Measured result

| Fixture | Effective speed | Matched words | Alignment accuracy | Decode latency |
| --- | ---: | ---: | ---: | ---: |
| Natural LibriSpeech | 154 WPM | 31 / 32 | 96% | 5.714 s |
| Accelerated | 200 WPM | 31 / 32 | 96% | 5.536 s |
| Accelerated stress case | 250 WPM | 29 / 32 | 89% | 5.760 s |

First model load was 42.044 seconds on the playtest computer. Three overlapping
six-second windows decoded in 4.230–4.535 seconds each. Their reference matches
covered 14, 14, and 9 words respectively, and their real production transcripts
advanced the monotonic line guide to the final authored line without moving
backward.

## Product changes justified by the test

- Keep final Whisper scoring separate from visible line guidance.
- Keep the evidence-locked known-text guide tolerant of overlap, homophone-like
  substitutions, and revisions; the exact measured stress transcript is now a
  regression test.
- Request browser-supported single-channel, echo-cancelled, noise-suppressed,
  auto-gained 16 kHz microphone input before the existing local decode path.
- Keep the sentence line as the stable visible unit. Recognition imperfections
  should not make the highlight jitter word by word.
- Do not upload or retain audio or transcript text. The committed evidence above
  contains only timing and match counts.

## Primary sources rechecked

- <https://github.com/huggingface/transformers.js-examples/tree/main/whisper-word-timestamps>
- <https://huggingface.co/onnx-community/whisper-base_timestamped>
- <https://github.com/k2-fsa/sherpa-onnx/releases/tag/v1.13.2>
- <https://k2-fsa.github.io/sherpa/onnx/wasm/index.html>
