# Batched reading progress spike

## Question

Can the existing private, in-browser Whisper path provide natural-enough visual
progress during continuous reading without stopping after every sentence?

## Proven platform pattern

- `MediaRecorder.requestData()` delivers captured media and immediately begins a
  new blob while recording continues. The browser specification warns that
  chunk timing is not exact, so elapsed time is measured independently.
- A Web Audio `AnalyserNode` can inspect the live time-domain signal locally. In
  this spike it is used only to detect likely speech and pauses; no samples are
  retained by the analyser.
- Hugging Face publishes a real-time Whisper example, but its responsive path is
  WebGPU. This repository retains the already proven Transformers.js `3.7.1`
  WASM/q8 configuration because WebGPU failed independently on this computer.

Primary references:

- <https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/requestData>
- <https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/dataavailable_event>
- <https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode>
- <https://github.com/huggingface/transformers.js-examples/tree/main/realtime-whisper-webgpu>

## Spike design

- One explicit Start Reading action and one Finish Reading action.
- Capture continues for the entire passage.
- A likely natural pause after at least 8 seconds requests a cumulative audio
  snapshot. A 22-second maximum window prevents progress from remaining pending
  indefinitely during uninterrupted reading.
- Only one local inference runs at a time. Finn can keep reading while it runs.
- Cumulative transcript alignment avoids losing words at artificial chunk
  boundaries. Confirmed progress never moves backward.
- The compact reader scrolls by paragraph. A wrapper-owned WikiWhy repair wipe
  maps theme-neutral confirmed progress to visible left-to-right repair.
- Final transcription reconciles the full attempt after Finish Reading.

## Acceptance evidence to collect

Run the deployed build in current Chrome and read naturally. Record:

1. time from a natural pause to visible progress (`Last checkpoint`);
2. whether the reader advances before Finn loses his place;
3. whether local inference falls progressively farther behind;
4. whether ordinary sentence pauses create too many checkpoints;
5. final accuracy, WPM, and confirmed passage percentage.

The mechanic is promising if most checkpoints appear within roughly three
seconds of a pause and the confirmed paragraph does not lag more than one
paragraph behind. This is a product threshold for the spike, not an established
browser or model guarantee.
