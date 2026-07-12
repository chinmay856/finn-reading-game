# Game for Finn

A desktop-browser read-aloud game for Finn, built on a reusable reading platform.

The first game wrapper is **Internet Recovery 98**: Chinmay caused the collapse
by irresponsibly rushing a powerful AI into deployment before he understood or
controlled it, and Finn restores the corrupted Internet by reading aloud
through Amy's browser-based recovery desktop. Chinmay sincerely keeps trying to
help faster; his AI keeps overwriting careful work and eventually goes rogue.
Chinmay remains long-haired and grows messier, frazzled, and more flustered—not
angry or villainous—as his anxious confidence collides with the evidence. The
surface is intentionally campy and retro; the underlying reading technology is
designed to support many future themes.

## Start here

- Current project status: [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md)
- Live desktop prototype: <https://chinmay856.github.io/finn-reading-game/>
- Local speech implementation: [`docs/engine/SPEECH_TECH_RESEARCH.md`](docs/engine/SPEECH_TECH_RESEARCH.md)
- Preserved mobile side-test notes: [`docs/PHONE_TEST.md`](docs/PHONE_TEST.md)
- Product vision and architecture: [`docs/ARCHITECTURE_AND_VISION.md`](docs/ARCHITECTURE_AND_VISION.md)
- Internet Recovery character design: [`docs/gameplay/INTERNET_RECOVERY_CHARACTERS.md`](docs/gameplay/INTERNET_RECOVERY_CHARACTERS.md)
- Internet Recovery player-facing copy deck: [`docs/gameplay/INTERNET_RECOVERY_COPY_DECK.md`](docs/gameplay/INTERNET_RECOVERY_COPY_DECK.md)
- Prototype design handoff: [`docs/gameplay/PROTOTYPE_DESIGN_HANDOFF.md`](docs/gameplay/PROTOTYPE_DESIGN_HANDOFF.md)
- Runtime UI notes for builders: [`docs/gameplay/RUNTIME_UI_NOTES_FOR_BUILDERS.md`](docs/gameplay/RUNTIME_UI_NOTES_FOR_BUILDERS.md)
- Runtime asset use brief: [`docs/gameplay/RUNTIME_ASSET_USE_BRIEF.md`](docs/gameplay/RUNTIME_ASSET_USE_BRIEF.md)
- Builder design response: [`docs/design/BUILDER_RESPONSE_2026-07-12.md`](docs/design/BUILDER_RESPONSE_2026-07-12.md)
- Site runtime copy packs: [`docs/gameplay/SITE_RUNTIME_COPY_PACKS.md`](docs/gameplay/SITE_RUNTIME_COPY_PACKS.md)
- WikiWhy first-slice build brief: [`docs/gameplay/WIKIWHY_FIRST_SLICE_BUILD_BRIEF.md`](docs/gameplay/WIKIWHY_FIRST_SLICE_BUILD_BRIEF.md)
- WikiWhy campaign state pack: [`docs/gameplay/WIKIWHY_CAMPAIGN_STATE_PACK.md`](docs/gameplay/WIKIWHY_CAMPAIGN_STATE_PACK.md)
- ThreadIt production handoff: [`docs/gameplay/THREADIT_PRODUCTION_HANDOFF.md`](docs/gameplay/THREADIT_PRODUCTION_HANDOFF.md)
- Ten-site build briefs: [`docs/gameplay/site-build-briefs/README.md`](docs/gameplay/site-build-briefs/README.md)
- Campaign hub runtime brief: [`docs/gameplay/CAMPAIGN_HUB_RUNTIME_BRIEF.md`](docs/gameplay/CAMPAIGN_HUB_RUNTIME_BRIEF.md)
- Final breach runtime brief: [`docs/gameplay/FINAL_BREACH_RUNTIME_BRIEF.md`](docs/gameplay/FINAL_BREACH_RUNTIME_BRIEF.md)
- Ten-site design library: [`docs/gameplay/TEN_SITE_DESIGN_LIBRARY.md`](docs/gameplay/TEN_SITE_DESIGN_LIBRARY.md)
- Campaign spine and recovery hub: [`docs/gameplay/CAMPAIGN_SPINE_AND_HUB.md`](docs/gameplay/CAMPAIGN_SPINE_AND_HUB.md)
- Non-WikiWhy source research: [`docs/content/NON_WIKIWHY_SOURCE_RESEARCH.md`](docs/content/NON_WIKIWHY_SOURCE_RESEARCH.md)
- Prototype passage authoring: [`docs/content/PASSAGE_AUTHORING.md`](docs/content/PASSAGE_AUTHORING.md)
- WikiWhy passage decks: [`content/wikiwhy/PASSAGE_DECKS.md`](content/wikiwhy/PASSAGE_DECKS.md)
- Nine-site sample passage sampler: [`content/proposed-sites/SAMPLE_PASSAGES.md`](content/proposed-sites/SAMPLE_PASSAGES.md)
- Ten-site passage deck plans: [`content/proposed-sites/PASSAGE_DECK_PLANS.md`](content/proposed-sites/PASSAGE_DECK_PLANS.md)
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
→ repair something funny in Internet Recovery 98
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
