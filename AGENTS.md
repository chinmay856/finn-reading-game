# Codex Instructions — Game for Finn

Before making architectural, gameplay, content-model, speech, scoring, progression, or UI decisions, read:

1. `docs/ARCHITECTURE_AND_VISION.md`
2. `docs/PROJECT_STATUS.md`
3. `README.md`

## Working model

- All active work now happens through the Codex app and this GitHub repository.
- Treat `main` as the only active source of truth; historical sync-era pull
  requests and branches are reference material, not active work.
- Use one scoped `agent/<description>` branch per task, keep checks and relevant
  documentation with the implementation, and return local `main` to the merged
  state after publication.
- Do not create parallel chat-handoff systems unless the user explicitly changes
  this working model.

## Non-negotiable project rule

This repository is not merely an Internet Recovery game. It is a reusable reading platform with interchangeable game wrappers.

Keep these concerns separate:

- **Reading Engine:** microphone input, speech recognition, word alignment and highlighting, pace, pronunciation, accuracy, fluency, correction handling, session progress, and analytics.
- **Content Platform:** passages, long-form works, reading position, vocabulary, difficulty, hints, questions, and metadata.
- **Game Rules:** configurable mappings from reading outcomes to missions, rewards, progression, achievements, and unlocks.
- **Game Wrapper:** replaceable theme, navigation, terminology, art, animation, audio, characters, and story.

The first wrapper is **Internet Recovery OS**. Do not embed its terminology, visuals, rewards, or mission assumptions inside the reusable engine.

## Canonical Internet Recovery characters

- **Finn** is always the player character and protagonist.
- **Chinmay** is always Finn's uncle, the AI-company CEO, developer, and main
  antagonist.
- Do not rename, substitute, or ask to reconfirm these characters unless the
  user explicitly requests a change. Treat other protagonist or antagonist
  names in transcripts as transcription errors.

## Current product priority

Build and test the smallest enjoyable mobile-friendly read-aloud loop:

1. Display a passage.
2. Request microphone permission.
3. Listen while the player reads aloud.
4. Highlight the current word or line.
5. Provide forgiving, useful accuracy and pacing feedback.
6. Translate the result into an immediate Internet Recovery game consequence.
7. Save enough session state to inspect and improve the mechanic.

Optimize first for learning whether the speaking/highlighting/accuracy loop is fun and usable on Finn's phone. Avoid premature platform complexity.

## Future compatibility

A later mode may allow Finn to read complete school books, resume across sessions, answer comprehension questions, and discuss themes, characters, symbolism, vocabulary, and plot. Do not build that mode now. Avoid data models and APIs that would prevent long-form reading, resumable position, independent comprehension, or wrapper-free use later.

## Implementation expectations

- Prefer stable interfaces between layers.
- Keep theme strings and assets in wrapper-specific configuration.
- Represent reading results as theme-neutral events/data.
- Keep comprehension independent from speech scoring.
- Do not assume all content is short or mission-based.
- Make rewards optional at the engine level.
- Treat `docs/ARCHITECTURE_AND_VISION.md` as the current source of truth.
- When a decision changes these principles, update the document and add a short Architecture Decision Record under `docs/decisions/`.
