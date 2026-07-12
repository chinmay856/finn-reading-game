# Techno animation library

These wrapper-owned animated WebP assets provide lightweight Internet Recovery
98 desktop-pet reactions. Each animation has six transparent frames and a
matching still image for reduced-motion presentation.

| State | Animated asset | Intended use |
| --- | --- | --- |
| Progress push | `techno-progress-push-loop.webp` | Move the whole sprite with the confirmed repair boundary. |
| Ball-drop idle | `techno-ball-drop-idle-loop.webp` | Default relaxed desktop idle. |
| Sleep idle | `techno-sleep-idle-loop.webp` | Extended inactivity or a long broadcast. |
| Paw alert | `techno-paw-alert-loop.webp` | Amy notes, Chinmay broadcasts, or ordinary notifications. |
| Bark alert | `techno-bark-alert-loop.webp` | Reverse hacks and serious interruptions. |
| Tail-wag celebration | `techno-tail-wag-celebration-loop.webp` | Completed repairs and secured sites. |

Use the corresponding `*-still.webp` asset when
`prefers-reduced-motion: reduce` is active. Lazy-load reactions other than the
currently visible state. Techno remains wrapper presentation: these assets must
not influence reading accuracy, scoring, comprehension, or saved progress.

## Campaign-state crops

These exact production-sheet crops support the authored WikiWhy story states:

- `techno-alert-ball-pin.webp` is `techno_alert_ball_pin` (row 1, column 2).
- `techno-celebrate-spin.webp` is `techno_celebrate_spin` (row 2, column 3).

Each 384 by 512 source cell is resized to 288 by 384 and shown as a small state
panel. The drawn motion lines carry the action when reduced motion is preferred;
the runtime does not rotate or flash the panel.

The source poses were generated with the built-in image-generation workflow
from the reviewed Techno concept board. Flat chroma-key backgrounds were removed
locally, and every encoded loop was decoded into a six-frame review strip to
check for duplicate characters, clipping, inconsistent scale, and missing
limbs. Rejected explorations and review strips are intentionally not published.
