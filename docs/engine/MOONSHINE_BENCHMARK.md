# Moonshine browser comparison

## Purpose

This is a narrow Reading Engine experiment, not a replacement decision and not
a game-wrapper feature. It compares whether a streaming-oriented local model
can provide more natural progress evidence than the current final-pass Whisper
flow during the first paragraph of the existing passage.

The current Whisper path remains the default. Open
`moonshine-benchmark.html` only when deliberately running the comparison.

## Proven upstream reference

The implementation was checked against Hugging Face's maintained Moonshine Web
example at `transformers.js-examples` commit
`204b0948e88cd2bdc046316e78b754359653caea` before product integration.

Pinned configuration retained from that example:

- Transformers.js `3.7.1`
- `onnx-community/moonshine-base-ONNX`
- `onnx-community/silero-vad`
- 16 kHz mono AudioWorklet input in 512-sample frames
- speech threshold `0.3`, exit threshold `0.1`
- segment after 400 ms of silence, with 80 ms speech padding
- 250 ms minimum speech and 30-second maximum segment buffer
- WebGPU when an adapter is available; WebAssembly fallback
- full-precision encoder and q4 WebGPU or q8 WebAssembly decoder
- serialized VAD and transcription inference

The untouched upstream build compiled locally. Its official hosted demo reached
the listening state on the development computer, proving the runtime/model
combination, but first load took roughly two minutes. The locally hosted copy
could not retrieve its remote model files in the restricted development network.

The repository benchmark intentionally removes the upstream React/3D UI and
does not return audio buffers to the page. It also adds one explicit end-of-test
flush so the last spoken segment is not stranded when the reader selects
Finish. These changes do not alter the model, VAD thresholds, audio format, or
runtime configuration.

Official references:

- <https://github.com/huggingface/transformers.js-examples/tree/main/moonshine-web>
- <https://huggingface.co/spaces/webml-community/moonshine-web>
- <https://huggingface.co/onnx-community/moonshine-base-ONNX>

## Fair comparison procedure

### First real run

The first deployed run automatically selected WebGPU. Silero detected seven
speech segments, but Moonshine returned an empty transcript for every segment.
Consequently, the displayed 0% accuracy and position were not reading scores;
there were no model words for the aligner to score. Timing still reported 19.6
seconds to the first result, 1.6 seconds median segment lag, 6.1 seconds worst
lag, and no final-flush delay.

The follow-up benchmark forces WebAssembly/q8, reduces the test to the first
paragraph, and reports sample count, duration, RMS, peak level, and the shape of
each raw model response. This distinguishes an empty WebGPU inference result
from malformed or silent microphone input without retaining audio.

1. Use current desktop Chrome and the same microphone/environment.
2. Open the deployed Moonshine comparison page and wait for `Ready`. The first
   visit may take around two minutes; later visits should reuse browser cache.
3. Select **Start paragraph**, then read the one displayed paragraph at the
   user's natural fast pace.
4. Select **Finish paragraph** once at the end.
5. Record accuracy, confirmed words, passage position, first transcript time,
   median and worst segment lag, and finish lag.
6. Compare with the current Whisper evidence: the last final pass took 33.9
   seconds and added 15 confirmed words beyond its provisional result.

Do not judge Moonshine from load time alone. It is worth adopting only if its
in-session transcript evidence is meaningfully more responsive and its final
alignment remains fair.

## Decision criteria

Continue investigating Moonshine when:

- transcript segments appear naturally during continuous reading;
- median segment lag is low enough that text guidance need not wait for it;
- the passage ending is captured without a long finalization stall;
- same-passage accuracy is broadly comparable with the expected 80–90% range;
- fast speech around 250 WPM does not cause systematic paragraph-tail loss.

Reject or defer it when the large first load, device requirements, latency, or
accuracy is materially worse than the current Whisper-plus-predictive-guide
experience. One adult reading is mechanics evidence, not a final model-quality
claim for Finn's voice.

## Privacy and architecture

Microphone samples and the displayed transcript stay in browser memory. The app
does not upload or retain either. Model files are fetched from Hugging Face and
cached by the browser, as with the current local Whisper implementation.

All Moonshine code lives under a theme-neutral speech/benchmark boundary. It
emits transcript and timing evidence only; it knows nothing about WikiWhy,
Internet Recovery, rewards, comprehension, or game progression.
