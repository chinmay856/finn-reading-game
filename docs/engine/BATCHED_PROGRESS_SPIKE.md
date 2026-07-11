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

- One Begin action prepares the model and starts capture. Completion is
  automatic after the end is confirmed and a short final pause; `Finish now`
  remains a recovery control.
- Capture continues for the entire passage.
- A likely natural pause after at least 8 seconds requests a bounded audio
  window. A 22-second maximum window prevents progress from remaining pending
  indefinitely during uninterrupted reading.
- Only one local inference runs at a time. Finn can keep reading while it runs.
- Each window includes three seconds of prior audio and alignment begins twelve
  tokens behind the last confirmed position. This overlap avoids losing words
  at artificial chunk boundaries without making every inference reprocess the
  entire growing recording. Confirmed progress never moves backward.
- Reading position uses the furthest aligned token, while accuracy continues to
  use matched-word evidence. A missed word therefore does not make the visual
  reader incorrectly lag behind later confirmed speech.
- The compact reader scrolls by paragraph. A wrapper-owned WikiWhy repair wipe
  maps theme-neutral confirmed progress to visible left-to-right repair.
- Live checkpoints use a separate restartable preview recorder. The final
  recorder remains uninterrupted, preventing `requestData()` fragments from
  being concatenated into a final WebM file that some browser decoders only
  decode through the first fragment.
- Final transcription reconciles the uninterrupted full attempt after automatic
  completion or `Finish now`. Matched-token evidence from live windows is
  combined with the final pass so one failed reconciliation cannot erase
  already confirmed reading.

## Acceptance evidence to collect

Run the deployed build in current Chrome and read naturally. Record:

1. time from a natural pause to visible progress (`Last checkpoint`);
2. whether the reader advances before Finn loses his place;
3. whether local inference falls progressively farther behind;
4. whether ordinary sentence pauses create too many checkpoints;
5. final accuracy, WPM, and confirmed passage percentage.

The review can copy a diagnostics-only timing report. It contains checkpoint
window sizes, inference latency, scores, browser information, and aggregate
microphone signal data; it contains neither audio nor transcript text.

For explicit debugging, the review also exposes final and checkpoint transcript
text inside a collapsed panel. Transcript text remains only in the current tab,
is cleared on reload, and is still excluded from copied timing reports.

After the first corrected full reading scored 91% accuracy at 131 WPM but ended
at 96% position, the fixed 94% automatic-completion threshold was removed.
Automatic completion now requires evidence among the passage's final tokens and
a profile-configured final pause. The expository-prose profile reduces the live
pause trigger from 900 ms to 450 ms and the minimum checkpoint window from eight
seconds to five, reducing orchestration delay while retaining one inference at
a time.

## Predictive guide geometry and finalization

Fast-reading tests showed that a time-based look-ahead offset scrolled
immediately and created the feeling of chasing the page. The guide now holds the
viewport through the complete first content segment, then uses rendered word
positions to ease the estimated current word toward the viewport center. Native
scroll range is the hard lower bound: the large artificial bottom pad was
removed, so the guide cannot continue past the document ending. Transcript
re-renders preserve the current scroll position.

Final scoring now separates responsiveness from reconciliation. Immediately
after capture stops, the review shows a provisional score from live checkpoint
evidence. A visible timer reports the full local transcription in progress; the
same fields update when reconciliation completes. Diagnostics record live-only
accuracy/word count/WPM, final-pass matched words, final words added, and final
latency. This evidence determines whether the expensive full pass improves the
score enough to justify its delay.

The mechanic is promising if most checkpoints appear within roughly three
seconds of a pause and the confirmed paragraph does not lag more than one
paragraph behind. This is a product threshold for the spike, not an established
browser or model guarantee.
