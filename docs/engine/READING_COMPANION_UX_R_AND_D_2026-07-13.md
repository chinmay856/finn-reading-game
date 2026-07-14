# Reading Companion UX R&D — 2026-07-13

## Scope

This branch changes only the isolated Reading Companion prototype and R&D
evidence. It does not edit `app.js`, `index.html`, production CSS, speech
capture, scoring, game rules, or any wrapper runtime.

The playtest report says the current experience has poor latency, the active
line can sit at the bottom of the box, and manual scrolling should help the
highlight keep up. The reported final-score wait was about 112 seconds.

## Root causes found in the current build

1. The production guide asks for a near-top target but clamps it to the real
   document bottom. Without space below the last line, the final lines cannot
   physically reach that target and remain at the bottom of the viewport.
2. The passage begins with `13vh` top padding. This creates headroom initially
   but does not create the equivalent tail room needed at the end.
3. Wheel, pointer, or touch interaction pauses automatic guide scrolling for
   five seconds. Recognition can continue during the pause, so the eventual
   resume can jump several lines and feel more latent than the recognizer is.
4. Auto-scroll advances by at most 96 pixels per recognition event. If the last
   event leaves the viewport short of its target, there may be no later event to
   finish the movement.
5. Live-guide latency and final-score latency remain separate problems. Scroll
   policy can improve reading comfort but cannot explain or fix a 112-second
   final Whisper result.

## Prototype refinement

The isolated prototype now implements a reusable viewport policy:

- an 18-pixel reading anchor near the top;
- calculated tail space so every line, including the last, can reach it;
- direct smooth scrolling to the complete target rather than one fixed step per
  recognition event;
- forward manual scroll reconciliation: the line crossing the reading anchor
  becomes the visual line immediately;
- manual navigation never changes confirmed speech indexes, transcript
  alignment, completion, accuracy, or scoring;
- backward scrolling does not drag the monotonic guide backward;
- reduced-motion mode uses immediate scrolling.

The executable geometry benchmark is
`prototypes/reading-companion/viewport-policy-benchmark-2026-07-13.json`.
For the 300-pixel fixture viewport, the last three lines land at exactly 18
pixels from the top. Under the old no-tail geometry, the final line remained at
228 pixels—visually at the bottom.

## Integration recommendation

The integrating agent should port the behavior, not copy prototype DOM code:

1. Add a non-interactive tail spacer inside the production passage scroller.
   Recalculate it with `ResizeObserver` from viewport height, top anchor, and
   final-line height.
2. Scroll the active line to a fixed 16-24 pixel top anchor. Do not use a
   viewport percentage or `block: center`.
3. Replace the five-second manual pause. During forward manual scrolling,
   calculate the line at the anchor and advance a separate `visualLineIndex`.
4. Never write a manual visual position into `confirmedWordIndex`, matched-word
   counts, completion evidence, diagnostics presented as speech evidence, or
   the final result.
5. When speech evidence catches the manually chosen line, resume ordinary
   evidence-led updates without a jump.
6. Animate to the full target in roughly 120-220 ms; do not depend on another
   recognizer event to complete movement.
7. Keep the current monotonic speech guide and asynchronous final Whisper lane
   separate.

## Next latency experiment

Instrument these four clocks independently on the target desktop:

```text
Start click -> microphone accepting PCM
First speech PCM -> first aligned guide event
Aligned guide event -> line settled at top anchor
Finish click -> final Whisper result available
```

Store only durations, counts, model/runtime identifiers, and failure labels.
Do not retain audio or transcript text. Run at least three natural 180-220 WPM
attempts. The UI policy passes when line-settle time is under 220 ms after an
event, the final line reaches the same anchor as middle lines, manual forward
scroll reacts within one animation frame, and no manual action affects scoring.

The 112-second score delay is a separate P0 failure. Before changing models,
capture its phase breakdown: audio finalization, resampling, worker transfer,
model warm-up, inference, and alignment. A warmed model should be reused across
passages; no dependency change should proceed without the repository research
gate and a narrow fixture benchmark.

Existing fixed-fixture evidence narrows the search: the production Whisper
benchmark measured a 42.044-second first model load and 5.536-5.760-second full
decode, while six-second rolling windows still cost 4.230-4.535 seconds. Those
figures are too slow for live guidance but do not by themselves explain the
reported 112-second finish. The next run must determine whether model loading
was repeated, audio finalization stalled, requests queued behind checkpoints,
or the UI delayed result presentation after inference completed.

## Files for the next agent

- `prototypes/reading-companion/viewport-policy.js`
- `prototypes/reading-companion/viewport-policy.test.js`
- `prototypes/reading-companion/viewport-policy-benchmark.mjs`
- `prototypes/reading-companion/viewport-policy-benchmark-2026-07-13.json`
- `prototypes/reading-companion/prototype.js`
- `prototypes/reading-companion/prototype.css`
