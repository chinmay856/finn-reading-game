# Codex Instructions — Game for Finn

## 2026-08-14 design reset — current authority

Chinmay resumed the project after roughly one month and explicitly superseded
the repository's prior approval vocabulary and build-first workflow.

- Do not treat `canonical`, `approved`, `production`, `frozen`, `complete`, or
  `source of truth` in older files, commits, branches, pull requests, or
  screenshots as evidence of current approval.
- Nothing becomes current design canon until Chinmay previews it and explicitly
  approves it during the new review cycle.
- The ten original campaign boards introduced by `f62d04d` are approved concept
  references, not canonical production designs. Preserve their strongest visual,
  narrative, and mechanical ideas while refining them into a consistent set of
  mood boards and state designs.
- The Amy, Chinmay, and Techno production sheets introduced by `a7219c3` are
  canonical candidates pending per-sheet and per-state review; their filenames
  do not constitute approval.
- Design decisions precede implementation. Do not rebuild site UI, animate
  Techno, or change the reading experience until the applicable design package
  has been previewed and approved.
- A fixed player-selected aspect ratio is allowed. Prefer a small number of
  layered site-state images over unnecessary DOM componentization when the site
  surface is decorative rather than interactive.
- The Reading Companion is the primary interactive gameplay surface. Site art,
  jokes, and Easter eggs must not compete with reading, microphone controls,
  highlighting, or results.
- The player is behind the screen and has no visible portrait. Do not display
  the player's name in site copy, dialogue, labels, overlays, or progress text.
- There is no evil antagonist. Chinmay is sincerely helpful but cavalier about
  using more AI, becomes increasingly flustered, and usually triggers each site's
  Phase 2 re-corruption with a well-meant fix. The AI follows priorities that do
  not match human priorities; it is not malicious.
- Each site is a guided, sequential reading mission with roughly 8–12 passages.
  The right-hand Reading Companion owns the gameplay. The two-thirds-width site
  canvas is a mostly static layered storyboard, not a complex interactive puzzle.
- Reading progress drives Phase 1 visual repair. Use translucent red corruption
  states that clear stepwise to neutral/light green, always paired with non-color
  icons, patterns, outlines, or labels. The last Phase 1 passage produces one fully
  fixed beat. Every site uses a `CORRUPTION METER` in Act 1 except FacePlace, which
  substitutes a small nonsensical `HONESTY METER`.
- The first meaningful site click normally occurs at the midpoint. Chinmay appears
  first and applies his parallel AI fix, overriding Finn's work and causing a
  lesson-specific Phase 2 re-corruption. Amy then explains the failure and introduces
  a numbered `LOCK IN THE FIX` checklist. Further reading resolves a site-specific
  number of clearly named final repair milestones.
- Every passage may use a short comprehension interaction during genuine speech-result
  processing. Every secured site ends with an Amy-led, approximately 200-word Finn
  reflection framed as `What lesson did we learn that we should teach the AI?` The
  AI's final learned-rule receipt appears only after Finn submits. This remains
  subject to testing, accessibility, consent, retention, and privacy design.
- Reading performance produces feedback and metrics but never blocks progression
  or removes rewards. Rereading is optional and never required.
- Techno occupies one place at a time and may use simple persistent pet-like idle
  animation or phase-specific poses. Do not build complex roaming behavior.
- Use `1440 × 900` as the first approved storyboard master, with approximately a
  68/32 site/Reading Companion split, minimal desktop border, an original
  Windows-98-inspired bottom taskbar, and dial-up-inspired loading visuals.
- Use `docs/design/REVIEW_CHARTER_2026-08-14.md` for approval states and review
  gates. Drafts and agent recommendations must remain visibly labeled as such.

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
- Close browser tabs, preview servers, terminals, and other temporary sessions
  as soon as their verification work is complete. Leave a live tab or process
  open only when the user explicitly asks for a handoff.
- Coordinate parallel art work through `docs/design/DESIGN_REQUESTS.md`. Keep its
  synchronization commit, focused questions, acceptance criteria, and current
  executable screenshots updated so design agents can answer through GitHub
  without relying on chat history.

## Non-negotiable project rule

This repository is not merely an Internet Recovery game. It is a reusable reading platform with interchangeable game wrappers.

Keep these concerns separate:

- **Reading Engine:** microphone input, speech recognition, word alignment and highlighting, pace, pronunciation, accuracy, fluency, correction handling, session progress, and analytics.
- **Content Platform:** passages, long-form works, reading position, vocabulary, difficulty, hints, questions, and metadata.
- **Game Rules:** configurable mappings from reading outcomes to missions, rewards, progression, achievements, and unlocks.
- **Game Wrapper:** replaceable theme, navigation, terminology, art, animation, audio, characters, and story.

The first wrapper is **Internet Recovery OS**. Do not embed its terminology, visuals, rewards, or mission assumptions inside the reusable engine.

## Historical character premise — candidate for current review

The statements below summarize the strongest prior story premise. They are
review questions, not current canon. Do not build against them or describe them
as settled until Chinmay previews and approves them in the new review cycle.

- **Finn** was framed as the player character and protagonist.
- **Chinmay** was framed as Finn's uncle, the AI-company CEO, and developer. He is
  causally responsible for the collapse because he irresponsibly rushed his
  powerful AI into deployment before he understood or controlled it. His intent
  is sincere: he repeatedly makes Finn's work harder by insisting the AI can
  help faster, but he is not malicious and never deliberately sabotages Finn.
- **Chinmay's AI** was framed as the main antagonist. It first causes damage by optimizing
  narrow proxy goals and overwriting careful human work, then becomes clearly
  rogue by continuing to rewrite systems after Chinmay tries to pause or limit
  it.
- **Chinmay's strongest visual candidate:** he is long-haired and not presented as
  angry or villainous. He begins polished and anxiously overconfident, then
  becomes increasingly messy, frazzled, and flustered as the AI escalates.
  Humor comes from his anxious confidence outlasting the evidence.
- Reconfirm these roles during the current story review. Do not infer approval
  from their historical specificity. A secret-saboteur version of Chinmay is a
  conflicting historical variant, not an approved alternative.
- `Chinmay` is the correct spelling of his name. Treat phonetically
  similar alternatives as transcription errors and never introduce them into
  copy, assets, or filenames.

## Historical product priority — deferred until design approval

The loop below remains a useful implementation target, but it is not authorization
to build while the current design review is open.

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
