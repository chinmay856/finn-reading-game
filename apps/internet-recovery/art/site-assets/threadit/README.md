# ThreadIt runtime asset manifest

These are production-approved wrapper design assets for ThreadIt. They are
original SVGs and do not reproduce a real forum logo, mascot, browser, or OS.

| Asset ID | File | View box | State | Meaning |
| --- | --- | --- | --- | --- |
| `threadit.mark` | `threadit-mark.svg` | `128 128` | all | Original interlocked-conversation mark; meaningful site identity. |
| `threadit.avatar.reader` | `avatar-reader.svg` | `96 96` | corrupted, secured | Generic human account avatar; decorative beside a text username. |
| `threadit.avatar.consensusBot` | `avatar-consensus-bot.svg` | `96 96` | corrupted, tracing | Generated-account avatar; decorative beside a text origin label. |
| `threadit.process.consensusCascade` | `process-consensus-cascade.svg` | `720 180` | tracing | Visual summary of one process producing many accounts; its relationship must also exist in DOM text. |
| `threadit.icon.duplicateSource` | `icon-duplicate-source.svg` | `64 64` | tracing, secured | Duplicate-source warning; meaningful only with adjacent text. |
| `threadit.badge.sourceStable` | `badge-source-stable.svg` | `460 96` | secured | Secured payoff badge with embedded text; duplicate the state in DOM. |

## DOM-native elements

Do not create screenshots for these elements:

- thread cards and vote controls;
- question/reply order;
- source-tree nodes;
- connector lines and relationship labels;
- clone-group quarantine;
- `TRACE VIEW` controls;
- status and blocked-write copy.

Render the source tree as accessible HTML nodes with an inline SVG connector
layer. The tree must remain understandable if images, color, or animation are
unavailable.

## Export/use notes

- SVGs use transparent backgrounds unless the badge intentionally includes a
  panel.
- All assets scale cleanly; do not rasterize above the displayed size.
- When raster export is required by a pipeline, preserve transparency and use
  at least 2x the CSS display dimensions.
- The orange/blue palette is ThreadIt's original visual identity; do not replace
  the mark with a real platform mascot.
- Asset decoration never covers Reading Companion or microphone/result controls.
