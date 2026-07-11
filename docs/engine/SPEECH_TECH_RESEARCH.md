# Speech technology reuse research

## Status

Initial market scan and local-engine decision, July 2026. Verify current
platform support, licenses, data handling, and child/privacy requirements before
changing engines.

## Recommendation

Use **Transformers.js with `onnx-community/whisper-base_timestamped`** as the current
desktop prototype engine. It is free/open source, runs through ONNX Runtime in a
browser worker, uses WebAssembly/q8 by default, and needs
no service account, API key, or backend. Model files are downloaded from Hugging
Face and cached by the browser; microphone samples are processed only in memory
and are not sent to Hugging Face or stored by the application.

Pin Transformers.js `3.7.1`, matching Hugging Face's maintained timestamped
Whisper example. WebGPU/q4 is intentionally not the default: on the development
computer, both this application and Hugging Face's untouched public-sample demo
returned unusable punctuation/fragments through WebGPU, while WebAssembly/q8
returned a 95% aligned transcript from the real microphone test. Keep
`?speechDevice=webgpu` only as an explicit diagnostic option.

Whisper produces a transcript rather than a formal pronunciation score. The
project's theme-neutral Reading Engine remains responsible for forgiving
reference-text alignment, self-correction handling, accuracy, punctuation-aware
timing, and scoring. Independent comprehension remains outside speech scoring.

Test the local implementation on the actual desktop hardware before changing
models. Measure first-load size, per-line latency, transcription fairness,
live-highlight usefulness, and CPU/GPU compatibility. If base English is too
slow, compare tiny English; if it is still too inaccurate, compare a larger
local model before considering a paid service.

## Shortlist

### SoapBox Fluency

Best functional match on paper. SoapBox describes Fluency as designed
specifically for children's speech and oral-reading assessment. Given audio and
reference text, its API returns a transcript, comparison analysis, and a
word/token breakdown including insertions and deletions. Online, on-device, and
embedded offerings are documented, although access, custom language models,
pricing, and production terms require provider contact.

Official documentation:

- <https://docs.soapboxlabs.com/technical-docs/online-technical-documentation/fluency-%28online%29/>
- <https://docs.soapboxlabs.com/technical-docs>

### Azure Pronunciation Assessment

Best broadly documented platform candidate. Scripted assessment accepts
reference text and returns pronunciation accuracy, fluency, completeness,
prosody, and word-level error types such as omission, insertion, and
mispronunciation. It supports streaming, but continuous readings longer than 30
seconds require application-side comparison to recover omission and insertion
tags. Prosody is currently limited by locale and priced as an add-on.

Official documentation:

- <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment>
- <https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/pronunciation-assessment/characteristics-and-limitations-pronunciation-assessment>

### Speechace

Specialist pronunciation and fluency API. It supports scripted passage reading,
word/syllable/phoneme feedback, pause and hesitation metrics, and passage-level
fluency scoring. Its published product emphasis includes language learning and
exam-style scoring, so its fit for forgiving native-language child reading must
be tested rather than assumed.

Official documentation and samples:

- <https://docs.speechace.com/>
- <https://github.com/speechace/speechace-api-samples>

## Useful components, not complete solutions

### Moonshine Web comparison candidate

Hugging Face maintains a real-time in-browser Moonshine example using the same
pinned Transformers.js `3.7.1`. It combines `onnx-community/moonshine-base-ONNX`
with `onnx-community/silero-vad`, runs through WebGPU when supported, and falls
back to WASM. Moonshine is designed for live transcription and variable-length
audio, so it is the strongest maintained local candidate for a future latency
comparison.

Do not replace the current engine without a narrow benchmark. The Moonshine
base repository is substantially larger than the current model, the reference
worker serializes VAD and transcription because Transformers.js does not support
simultaneous inference, and its accuracy on fast read-aloud prose has not been
tested on this computer. Benchmark exact reference versions, download/cache
cost, first-load time, real-time factor, accuracy, and memory before integrating.

Official references:

- <https://github.com/huggingface/transformers.js-examples/tree/main/moonshine-web>
- <https://huggingface.co/onnx-community/moonshine-base-ONNX>
- <https://huggingface.co/docs/transformers/model_doc/moonshine_streaming>

### Browser Web Speech API

Useful for the current zero-backend mechanics test and fast interim transcripts.
Recognition is not consistently available across major browsers, may use a
platform-hosted service, and does not itself provide dependable oral-reading or
pronunciation assessment. Keep it as a baseline and fallback, not the planned
assessment engine.

- <https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API>
- <https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/start>

### Generic speech-to-text services

Google Cloud Speech-to-Text and comparable services can stream transcripts,
provide word timestamps/confidence, and bias recognition toward passage words.
Those capabilities help highlighting, but the application would still own
reading-specific alignment, self-correction logic, pronunciation judgments,
and forgiving scoring.

- <https://docs.cloud.google.com/speech-to-text/docs/v1/async-time-offsets>
- <https://docs.cloud.google.com/speech-to-text/docs/reference/rest/v1/RecognitionConfig>

### Current open-source transcription stack

- Transformers.js `3.7.1`
- ONNX Runtime through Transformers.js
- `onnx-community/whisper-base_timestamped`
- Web Worker isolation from the UI thread
- WebAssembly/q8 by default; WebGPU/q4 only for explicit diagnostics
- in-memory 16 kHz mono PCM capture; samples are discarded after transcription

Official references:

- <https://huggingface.co/docs/transformers.js/main/index>
- <https://huggingface.co/docs/transformers.js/guides/webgpu>
- <https://huggingface.co/onnx-community/whisper-base_timestamped>
- <https://github.com/huggingface/transformers.js-examples/tree/main/whisper-word-timestamps>
- <https://github.com/openai/whisper>

## Integration boundary

Keep vendor output behind a theme-neutral adapter. A provider should return or
be translated into events such as:

```text
partial transcript
word timing and confidence
reference-word alignment
omission / insertion / retry / correction
pronunciation evidence
fluency and pace evidence
session completion
```

The Reading Engine should convert that evidence into forgiving product behavior.
The provider must not emit game rewards or Internet Recovery terminology.

## Before production use

- Compare candidates only with Finn's consented real-device samples; synthetic
  or adult benchmarks are insufficient.
- Confirm whether raw audio is retained, used for model improvement, or can be
  disabled/deleted.
- Keep provider credentials off the public GitHub Pages client; use a minimal
  backend or short-lived token mechanism.
- Review child/privacy obligations, consent, regional processing, security,
  accessibility, licensing, and costs with an appropriate responsible adult or
  qualified adviser.
- Prefer encouraging product feedback over exposing a vendor's raw score as a
  definitive judgment of reading ability.
