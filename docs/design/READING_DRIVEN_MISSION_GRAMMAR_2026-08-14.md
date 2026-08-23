# Reading-driven site mission grammar

Status: **approved structural direction; site-specific applications pending review**

The read-aloud sequence is the game. The fictional website is a layered visual
storyboard that makes progress, humor, and consequences visible; it is not a
second full puzzle running beside the reading.

## Tone

Aim for funny, playful absurdism with mad-scientist energy. The corrupted sites and
Chinmay's escalating fixes should make a fourteen-year-old laugh while the lesson
stays legible. Avoid both grounded instructional realism and grand mythic stakes.

## Fixed composition

- Master storyboard: `1440 × 900`.
- Site canvas: approximately 68% on the left.
- Reading Companion: approximately 32% in a fixed right rail.
- Minimal original late-1990s desktop frame remains visible around the content.
- A bottom Start-style taskbar, trash/floppy-drive Easter eggs, and other small
  desktop details may appear without becoming required interactions.
- Dial-up-inspired loading visuals are tied to real speech-engine initialization
  and disappear immediately when ready. They never introduce artificial delay or
  play audio by default.
- Scale or letterbox the approved composition. Do not freely rearrange dozens of
  elements for arbitrary aspect ratios.

## Flexible 8–12-passage state machine

Each site contains 8–12 passages. Choose the exact total, midpoint, and Phase 2
length from that site's lesson and pacing; do not force every mission into a
ten-passage or three-lock template.

### 0. Desktop and genuine loading

- Show the desktop shell and the site's loading identity.
- Prepare speech resources and microphone state.
- Never convert nostalgia into an unnecessary wait.

### 1. Phase 1 — obvious corruption

- The left site begins in a recognizable, clearly corrupted state.
- Corrupted components use a light translucent red treatment that preserves the
  recognizable parody underneath. Every red state also carries a non-color cue such
  as a broken-link icon, warning hatch, or `CORRUPTED` label.
- Each completed passage produces neutral metrics and advances one visual recovery
  beat on the left.
- Each recovery beat changes one authored component from corrupted red to a fixed
  neutral or light green state. Green is reinforced with a check, solid outline, or
  `FIXED` label so progress never depends on red/green perception alone.
- The final Phase 1 passage clears the final corrupted component. For one short beat,
  the whole site appears fixed and the Phase 1 progress meter reaches completion.
- Every site calls this Act 1 indicator the `CORRUPTION METER` except FacePlace,
  whose small `HONESTY METER` displays intentionally nonsensical percentages. The
  FacePlace meter is a supporting component, not its core mechanic.
- The player does not need to inspect, deduce, drag, sort, or solve the site.
- Progress may reveal cleaner copy, restore image layers, reconnect a visual
  system, or update a site-native progress metaphor.

### 2. Midpoint — first simple site interaction

- The first required click on the site normally occurs here.
- It is an obvious continue/inspect action with no wrong answer, not a knowledge
  test or branching puzzle.
- Chinmay appears first and reveals that he has been preparing a parallel AI fix.
  His instruction removes or maximizes the exact safeguard the site lesson needs.
- His line should be absurdly tone-deaf and careless: he sincerely thinks he solved
  the surface symptom, misses the underlying lesson, and gives the AI an objective
  that makes the site worse. He is chaotic, not malicious.
- Chinmay's well-meant intervention overrides Finn's apparently completed repair and
  triggers a visibly distinct Phase 2 re-corruption across the whole site.
- Amy appears immediately after the override: she names what the AI misunderstood,
  reassures Finn that the earlier work still mattered, and introduces the numbered
  site-specific items that must now be locked in.
- Chinmay becomes more flustered, but neither he nor the AI is framed as evil.
- The midpoint occurs roughly halfway through the site's 8–12 passages, at the
  moment when the visual joke is clear enough for Amy to name the underlying
  lesson and the remaining work.
- The cutscene sits **between** passages: finish passage N and its visual change,
  click the midpoint button, show Amy and Chinmay, swap to the Phase 2 corrupted
  backplate, then begin passage N+1. The cutscene never consumes a passage.

### 3. Phase 2 — site-specific endgame

- Amy names the concrete repair milestones required by this site's lesson.
- A site may have one, three, four, five, or another justified number of Phase 2
  passages and objectives, so long as the whole mission remains within 8–12.
- Do not add or remove objectives merely to match another site's shape.
- Reading completion—not a left-side deduction—drives each resolution.
- Any accompanying site clicks are obvious confirmations or popup dismissals.
- Collected progress and prior reading results remain visible and saved.
- The Phase 1 progress indicator visibly resets into a new numbered `LOCK IN THE
  FIX` checklist. It is a new act, not a deletion of Finn's reading history.
- Every Phase 2 passage changes the site visually; the magnitude can range from a
  small label restoration to the decisive secured-state transformation.

## Interaction budget

- Each site has one required site-canvas action by default: the obvious midpoint
  button.
- Dialogue advancement, retry, continue, reread, and passage controls belong to
  the Reading Companion or shared dialogue system.
- Any additional required site-canvas action needs explicit design approval.
- Repair names are internal authoring concepts. Player-facing milestones use
  short, site-native language and visible consequences rather than rubric terms.
- Preserve the Amy/Chinmay midpoint roles while varying the performance: the AI
  fix may be queued, auto-applied, demonstrated, merged, filtered, or rerouted so
  ten scenes do not repeat the same timing and sentence.

### 4. Secured state

- The final clean composition locks in with a site-specific visual payoff.
- Amy frames the prompt as Finn training the AI: `What lesson did we learn that we
  should teach the AI?`
- Finn types a short reflection, targeting about 200 words with a provisional
  150–250-word range until real-reader testing establishes a better target. It is a comprehension and discussion artifact,
  not a punishment or prose-quality gate.
- Only after Finn submits, Amy states one useful lesson in plain, age-appropriate
  language, Chinmay acknowledges what his AI prioritized incorrectly, and the AI may
  display a concise learned-rule receipt derived from the approved lesson. The AI
  must not show that final receipt before Finn teaches it, pretend to evaluate Finn's
  values, or silently rewrite his reflection.
- Show speed, transcript-match/accuracy, completion, and encouraging feedback.
- Continue without requiring mastery or rereading.

Before storing, sharing, or exporting a reflection, define player/parent consent,
visibility, retention, deletion, and an accessible alternative to typing.

## Reading and feedback contract

- Passage completion always advances the story regardless of score.
- Rereading is optional and never required.
- A weak attempt receives constructive feedback, not punishment or lost progress.
- Silence, an empty transcript, or a failed transcription must never fabricate a
  score or silently advance. Offer retry or an explicit continue path.
- Until pronunciation assessment is genuinely supported, label transcript word
  alignment honestly rather than implying it measures pronunciation or fluency.
- If the player rereads, preserve both attempts, show the latest attempt, and may
  show a quiet best marker. Story progress advances only once.
- Metrics are private and noncompetitive. Do not add leaderboards, compare Finn
  with other readers, or imply that faster is inherently better.
- Show an unmistakable microphone/recording indicator and plainly state what is
  processed locally, stored, or transmitted. Provide an accessible continuation
  path when speech input is unavailable; exact behavior depends on the Reading
  Engine experiments.
- After each passage, present one brief passage-specific comprehension interaction
  while the speech engine prepares results. Reveal the completed reading feedback
  when both are ready; never introduce artificial waiting if processing finishes
  first, and never let a transcription failure fabricate either a score or an answer.

## Provisional pacing budget

- Most passages should take roughly 45–90 seconds to read aloud, with shorter
  UI/data items used for rhythm.
- Aim for approximately 12–18 minutes per site including feedback and midpoint
  dialogue, then validate this with Finn and the speech engine before freezing
  passage word counts.
- Passage counts are not quotas, and the genre portfolio is a menu rather than a
  classroom checklist.

## Passage portfolio

Each site should mix reading forms rather than repeating ten miniature articles.
Scalable portfolio menu:

- 3 explanatory or informational passages;
- 2 evidence/reference passages, such as scientific, historical, or primary-
  source material;
- 2 narrative or public-domain literary passages;
- 1 procedural/how-to passage;
- 1 argument or opinion passage;
- 1 compact data-rich item, such as a notice, caption, comparison, or annotated
  result.

Aim primarily at grades 7–9. Vary length, syntax, voice, and genre without forcing
every passage to be harder than the previous one. Use original writing, factual
material with documented sources, public-domain text, or content whose license
and intended use have been verified. Do not assume that “recommended for an SAT”
grants reproduction rights.

## Character contract

- Finn is the player behind the screen. Finn has no sprite, portrait, or dialogue
  panel.
- Amy is supportive, insightful, and concise. She contextualizes without scolding or
  demanding a hypothesis before progress.
- Chinmay is earnest, chaotic, cavalier about AI fixes, increasingly flustered, and
  capable of learning. His tone-deaf midpoint instruction usually causes Phase 2;
  after Finn's reflection, he clearly recognizes the mistake.
- The AI optimizes different priorities; it is not a villain or moral agent.
- Techno stays anchored in one place at a time and uses a small reusable motion
  library: idle, sleep, ball play, USB/file curiosity, alert, and celebration.
- Techno may change pose or location by phase but does not roam through the site
  or supply a required answer. Support reduced motion.

## Minimal implementation model

The site canvas should usually need only:

1. one stable base composition;
2. several Phase 1 recovery overlays;
3. one midpoint re-corruption layer or state swap;
4. the site-specific number of Phase 2 repair overlays;
5. one secured-state layer;
6. character/popup overlays with fixed safe zones;
7. semantic accessibility text for meaningful information baked into images.

Avoid building general-purpose replicas of feeds, forums, editors, storefronts,
maps, or players. Optional Easter-egg hotspots may be considered later only if
they do not affect progression or complicate the core implementation.

Working storyboard grid:

- stage: `1440 × 900` CSS pixels;
- outer desktop margin: `16px`;
- taskbar: `40px` at the bottom;
- usable main frame: approximately `1408 × 828`;
- site slot: `948px`;
- gutter: `12px`;
- Reading Companion: `448px`;
- one roughly `128 × 128` Techno anchor inside the desktop/site boundary;
- one shared lower-site dialogue-safe area that never overlaps the Reading
  Companion or site-critical evidence.

These values are working geometry for storyboard consistency, not permission to
implement before visual approval.

Asset/runtime budget per site:

- at most three full-canvas backplates: Phase 1, Phase 2 corruption, secured;
- normally one small visual-delta overlay per passage;
- no more than roughly six simultaneously visible runtime layers;
- shared dialogue chrome and approved character portraits;
- one shared Techno atlas, with site-specific props confined to her anchor box.

Animation whitelist:

- short crossfades between reviewed states;
- simple opacity or small translation for an entering overlay;
- one brief midpoint re-corruption transition ending on a fixed frame;
- Techno's shared sprite loops;
- genuine loading feedback tied to actual engine state.

Do not introduce live counters, physics, scrolling feeds, procedural queues,
graph traversal, interactive crop manipulation, video playback, map routing, or
dynamically generated site content. Reduced motion jumps directly to the reviewed
final frame for each state.

## Anti-drift acceptance checks

A site mission fails review if any of these statements is false:

- It contains 8–12 passages, with a count justified by the site's lesson and pace.
- Most player input occurs in the Reading Companion.
- The mission can be completed without solving a left-side puzzle.
- The midpoint is normally the first required site click.
- That click is obvious and has no wrong answer.
- Amy guides rather than interrogates.
- Chinmay's well-meant AI intervention triggers the distinct Phase 2 corruption.
- Chinmay and the AI are free of villain or evil framing.
- Its site-specific final repair milestones are clearly visible and not padded to
  match another mission.
- Reading completion drives those milestones.
- Every passage advances the visual story.
- Weak scores are nonpunitive and rereading is optional.
- Silence or transcription failure cannot create a false score or silent advance.
- Finn remains visually unrepresented.
- Techno stays anchored and uses lightweight reusable animation.
- The site uses a small number of reviewed layers rather than responsive component
  sprawl.
- The 1440 × 900 composition and right-rail reading priority remain intact.
- Loading visuals reflect real loading without artificial waiting.
- The ending communicates a positive, balanced lesson: technology has benefits,
  risks, and choices that users can understand.
