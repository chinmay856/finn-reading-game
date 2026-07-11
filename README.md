# Game for Finn

A desktop-browser read-aloud game for Finn, built on a reusable reading platform.

The first game wrapper is **Internet Recovery OS**: adults broke the Internet, and Finn restores corrupted files and websites by reading aloud. The surface is intentionally campy and retro; the underlying reading technology is designed to support many future themes.

## Start here

- Current project status: [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md)
- Live desktop prototype: <https://chinmay856.github.io/finn-reading-game/>
- Local speech implementation: [`docs/engine/SPEECH_TECH_RESEARCH.md`](docs/engine/SPEECH_TECH_RESEARCH.md)
- Preserved mobile side-test notes: [`docs/PHONE_TEST.md`](docs/PHONE_TEST.md)
- Product vision and architecture: [`docs/ARCHITECTURE_AND_VISION.md`](docs/ARCHITECTURE_AND_VISION.md)
- Internet Recovery character design: [`docs/gameplay/INTERNET_RECOVERY_CHARACTERS.md`](docs/gameplay/INTERNET_RECOVERY_CHARACTERS.md)
- Prototype design handoff: [`docs/gameplay/PROTOTYPE_DESIGN_HANDOFF.md`](docs/gameplay/PROTOTYPE_DESIGN_HANDOFF.md)
- Prototype passage authoring: [`docs/content/PASSAGE_AUTHORING.md`](docs/content/PASSAGE_AUTHORING.md)
- WikiWhy passage decks: [`content/wikiwhy/PASSAGE_DECKS.md`](content/wikiwhy/PASSAGE_DECKS.md)
- Persistent Codex instructions: [`AGENTS.md`](AGENTS.md)
- Desktop prototype entry point: [`index.html`](index.html)

## Core rule

> Build one reusable Reading Engine, then put interchangeable games and learning experiences around it.

Keep these layers separate:

1. **Content Platform** — passages, long-form works, questions, vocabulary, and metadata.
2. **Reading Engine** — microphone, speech recognition, alignment, highlighting, pace, accuracy, fluency, and progress.
3. **Game Rules** — configurable missions, rewards, progression, achievements, and unlocks.
4. **Game Wrapper** — replaceable UI, theme, story, art, sound, and terminology.

## Current goal

Validate the smallest enjoyable desktop-browser loop:

```text
Open app
→ load the local Whisper model and grant microphone access
→ read a passage aloud
→ follow live highlighting
→ receive forgiving accuracy and speed feedback
→ repair something funny in Internet Recovery OS
```

The repository documents are the durable source of truth across ChatGPT, Codex desktop, web, and mobile work. Update them when major decisions change.

## Local checks

The prototype uses pinned open-source browser dependencies. With Node.js LTS installed:

```text
npm run check
npm test
npm run build
npm run dev
```

The speech model runs in the browser. The application does not upload or store
audio or transcripts. The first visit downloads and caches the model files.
