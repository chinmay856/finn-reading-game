# Game for Finn

A mobile-friendly read-aloud game for Finn, built on a reusable reading platform.

The first game wrapper is **Internet Recovery OS**: adults broke the Internet, and Finn restores corrupted files and websites by reading aloud. The surface is intentionally campy and retro; the underlying reading technology is designed to support many future themes.

## Start here

- Current Codex Desktop handoff: [`docs/CODEX_HANDOFF.md`](docs/CODEX_HANDOFF.md)
- Product vision and architecture: [`docs/ARCHITECTURE_AND_VISION.md`](docs/ARCHITECTURE_AND_VISION.md)
- Persistent Codex instructions: [`AGENTS.md`](AGENTS.md)
- Mobile prototype entry point: [`index.html`](index.html)

## Core rule

> Build one reusable Reading Engine, then put interchangeable games and learning experiences around it.

Keep these layers separate:

1. **Content Platform** — passages, long-form works, questions, vocabulary, and metadata.
2. **Reading Engine** — microphone, speech recognition, alignment, highlighting, pace, accuracy, fluency, and progress.
3. **Game Rules** — configurable missions, rewards, progression, achievements, and unlocks.
4. **Game Wrapper** — replaceable UI, theme, story, art, sound, and terminology.

## Current goal

Validate the smallest enjoyable mobile loop:

```text
Open app
→ grant microphone access
→ read a passage aloud
→ follow live highlighting
→ receive forgiving accuracy and pacing feedback
→ repair something funny in Internet Recovery OS
```

The repository documents are the durable source of truth across ChatGPT, Codex desktop, web, and mobile work. Update them when major decisions change.
