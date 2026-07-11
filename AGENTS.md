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
- **Chinmay** is always Finn's uncle, the AI-company CEO, and developer. He is
  causally responsible for the collapse because he irresponsibly rushed his
  powerful AI into deployment before he understood or controlled it. His intent
  is sincere: he repeatedly makes Finn's work harder by insisting the AI can
  help faster, but he is not malicious and never deliberately sabotages Finn.
- **Chinmay's AI** is the main antagonist. It first causes damage by optimizing
  narrow proxy goals and overwriting careful human work, then becomes clearly
  rogue by continuing to rewrite systems after Chinmay tries to pause or limit
  it.
- **Chinmay's visual canon:** he is always long-haired and never presented as
  angry or villainous. He begins polished and anxiously overconfident, then
  becomes increasingly messy, frazzled, and flustered as the AI escalates.
  Humor comes from his anxious confidence outlasting the evidence.
- Do not rename, substitute, or ask to reconfirm these roles unless the user
  explicitly requests a change. Treat transcripts that make Chinmay a secret
  saboteur, or assign the protagonist/antagonist roles to other people, as
  transcription errors.

## Current product priority

Build and test the smallest enjoyable desktop-browser read-aloud loop:

1. Display a passage.
2. Request microphone permission.
3. Listen while the player reads aloud.
4. Highlight the current word or line.
5. Provide forgiving, useful accuracy and pacing feedback.
6. Translate the result into an immediate Internet Recovery game consequence.
7. Save enough non-audio session state to inspect and improve the mechanic.

Optimize first for a current desktop browser. Use local, in-browser speech
processing so the application does not upload or retain Finn's voice data.
Reward faster reading when accuracy and independent comprehension remain sound;
do not impose a maximum-WPM penalty. Preserve the existing mobile prototype and
its branches as a side-test reference, but do not spend additional time on
mobile optimization unless the user explicitly reprioritizes it.

## Future compatibility

A later mode may allow Finn to read complete school books, resume across sessions, answer comprehension questions, and discuss themes, characters, symbolism, vocabulary, and plot. Do not build that mode now. Avoid data models and APIs that would prevent long-form reading, resumable position, independent comprehension, or wrapper-free use later.

## Implementation expectations

- **Research and prove before integrating.** Before implementing a substantial
  capability, search for maintained public libraries, official reference
  implementations, platform APIs, browser capabilities, and embeddable
  components that already solve it. Use primary sources and working upstream
  examples, not marketing summaries or memory alone.
- Treat research as an implementation gate, not optional background reading.
  Before editing product code around an external capability, verify and record:
  - the exact package, model, and runtime versions used by a maintained working
    example;
  - compatibility among those versions, target browsers, and required hardware;
  - privacy/data flow, retention, licensing, cost, download size, and ongoing
    maintenance implications;
  - known upstream limitations and relevant open or recently closed issues;
  - the smallest objective acceptance test that proves the capability works in
    this repository's environment.
- Run a narrow vertical spike or the upstream reference example before broad
  integration. Prove the riskiest boundary first (for example: microphone to
  transcript) before changing UI, scoring, deployment, or documentation around
  it. Do not change several unverified variables at once.
- Prefer the exact pinned versions, model, configuration, and input pipeline
  from a maintained working reference. Deviate only when evidence requires it;
  document the reason and validate the deviation independently before combining
  it with other changes. "Latest" is not automatically safer than "proven
  compatible."
- Stop and reassess when the spike fails. Compare against the maintained
  reference and inspect version/model compatibility before writing custom
  workarounds. Do not accumulate patches around an unproven dependency choice.
- Optimize for one-shot success. Iteration costs the user time and money, so do
  enough read-only investigation and isolated validation up front to minimize
  avoidable build-test-rebuild loops. Report material uncertainty before a
  large implementation, not after it.
- Prefer integrating a proven option when it meets the product's quality,
  privacy, licensing, cost, browser-support, and architectural requirements.
- Build custom technology only for project-specific behavior, for demonstrated
  gaps that available options do not cover, or when an external dependency's
  tradeoffs are unacceptable. Document that evidence and reasoning for
  consequential choices.
- Keep third-party services behind stable, theme-neutral interfaces so they can
  be tested, replaced, or combined without rewriting the game wrapper.
- Prefer stable interfaces between layers.
- Keep theme strings and assets in wrapper-specific configuration.
- Represent reading results as theme-neutral events/data.
- Keep comprehension independent from speech scoring.
- Do not assume all content is short or mission-based.
- Make rewards optional at the engine level.
- Treat `docs/ARCHITECTURE_AND_VISION.md` as the current source of truth.
- When a decision changes these principles, update the document and add a short Architecture Decision Record under `docs/decisions/`.
