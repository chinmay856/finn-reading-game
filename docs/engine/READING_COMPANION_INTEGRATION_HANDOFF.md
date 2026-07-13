# Reading Companion integration handoff

## Deliverable

Branch: `agent/reading-companion-integration-kit`

This branch contains an integration-ready, theme-neutral line-guide module and
the isolated sherpa-onnx proof that justifies it. It deliberately does not edit
`app.js`, the deployed UI, game rules, or the current Whisper scoring path.

Use these files:

- `reading-companion/known-text-line-guide.js`: known-text alignment, authored
  line ranges, bounded latency lead, and monotonic guide events.
- `reading-companion/live-reading-companion.js`: small orchestration boundary
  between any streaming recognizer and the guide.
- `tests/known-text-line-guide.test.js`: executable contract tests.
- `prototypes/reading-companion/`: exact upstream runtime proof, licensed fixed
  fixture, tough fixtures, benchmark results, and local server.
- `docs/decisions/0004-dual-lane-reading-companion.md`: architectural decision.

## Stable contract

The view creates the controller with content-owned lines:

```js
const companion = new LiveReadingCompanion({
  recognizer: streamingRecognizer,
  passageId: passage.id,
  lines: passage.displayLines,
  wordsPerMinute: 180,
  onGuidePosition(event) {
    readingView.showLine(event.visibleLineIndex, { block: "center" });
  },
});
```

The recognizer adapter implements:

```text
subscribe(listener) -> unsubscribe function
start() -> Promise<void>
acceptAudio(Float32Array, sampleRate)
stop() -> Promise<void>
close() -> optional cleanup
```

Each listener update is `{ text, observedAtMs }`. Text can revise. The guide
event is:

```json
{
  "type": "reading-guide-position",
  "passageId": "passage-001",
  "observedAtMs": 1200,
  "confirmedWordIndex": 18,
  "anticipatedWordIndex": 21,
  "visibleLineIndex": 2,
  "matchedWordCount": 19,
  "totalWordCount": 83
}
```

It intentionally contains no transcript text, score, audio, wrapper term, or
game progress.

## Exact integration sequence

1. Add `displayLines` to the Content Platform record or derive stable lines in
   the Reading Companion view before capture begins. Do not infer line breaks
   from live DOM wrapping after a resize.
2. Add a streaming PCM tap to `speech/audio-capture.js`. Feed 16 kHz mono
   `Float32Array` frames to `LiveReadingCompanion.acceptAudio`; preserve the
   existing full-session recorder for Whisper.
3. Extract the sherpa lifecycle from
   `prototypes/reading-companion/prototype.js` into a recognizer adapter that
   satisfies the contract above. Keep all sherpa/model details inside that
   adapter.
4. In the reading setup path in `app.js`, load both recognizers before the
   attempt. A streaming load failure must leave Whisper scoring and Continue
   available.
5. During capture, update only the authored line. Center it smoothly, pause
   automatic scrolling while the player manually scrolls, and resume only
   after an explicit quiet interval.
6. On Finish, stop the live lane immediately and show a local checking state.
   Send the existing final captured audio to Whisper. Only the final neutral
   reading result may enter Game Rules.
7. Persist timing/count diagnostics, never audio or transcript text.

## Hosting gate

The proven official sherpa package uses workers/shared memory and requires:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

GitHub Pages does not provide repository-controlled response headers. Before
shipping this adapter, choose and test one of: a host with explicit headers, a
validated isolation service worker, or a separately proven single-thread
build. Do not silently weaken the runtime configuration that passed the spike.

## Acceptance gate for the integrating agent

- Run `npm run check`, `npm test`, and `npm run build`.
- Run the fixed replay twice and the tough suite once.
- At 154, accelerated 200, and accelerated 250 WPM: first evidence is near one
  second, the line reaches the end, and it never moves backward.
- Test one consenting reader at natural 180-220 WPM before calling the UX done.
- Verify manual scroll, reduced motion, keyboard navigation, microphone denial,
  model-load failure, and mid-session streaming failure.
- Verify network logs show only model/runtime downloads and no audio/transcript
  upload.
- Verify stored session state and copied diagnostics contain no transcript.

## Measured evidence and limitations

The committed benchmark JSON records 29-32 of 32 word coverage across natural,
fast, pause, noise, and restart fixtures. First line evidence was 835-1456 ms;
worst decode blocking was 104-208 ms. See
`docs/engine/READING_COMPANION_PROGRESS_SPIKE.md` for the full table and source
record.

The remaining product decision is deployment, not alignment architecture. The
203 MB download is substantial. If target-machine load/memory or hosting fails
the acceptance gate, retain this contract and replace only the streaming
adapter.

