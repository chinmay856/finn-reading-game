# Current design decisions — 2026-08-14

Status: **directed by Chinmay unless marked open**

This log separates Chinmay's current decisions from agent proposals and older
repository claims. Later review decisions supersede this file where they conflict.

## Process

- Use the structured review charter and escalate only material decisions.
- Agents should infer and apply approved principles to similar details so Chinmay
  does not need to review every small choice.
- Start with plot and lesson, then translate the approved plot into visual state
  boards, then refine implementation specifications.
- Do not generate new site boards or implement the sites until the ten narratives
  have been researched, reviewed, revised, and previewed.
- Review narratives through several distinct simulated teen perspectives and
  several distinct simulated parent perspectives. Label simulations honestly;
  they complement rather than replace real playtesting.

## Character direction

- The current Amy, long-haired Chinmay, and Techno sheets are good working
  directions for now.
- Reuse those reviewed character designs wherever possible. New site-specific
  art should adapt their established likeness through pose, expression, prop,
  crop, or motion rather than redesigning Amy, Chinmay, or Techno from scratch.
- They remain refinement inputs rather than frozen runtime assets.

## Player and campaign premise

- The tonal target is funny, playful absurdism with mad-scientist energy. The game
  should make a fourteen-year-old laugh and stay engaged; it is neither grounded
  realism nor grand mythic seriousness.
- Finn is the player directly. Dialogue may address Finn by name, but Finn has no
  portrait or on-screen body. The human behind the screen inhabits the role.
- Chinmay is sincerely trying to help, increasingly flustered, and cavalier about
  using more AI as the fix for problems caused by poorly directed AI.
- At each midpoint Chinmay is absurdly tone-deaf about the actual problem: he fixes a
  surface symptom, gives the AI the wrong objective, and makes the lesson-specific
  failure worse. Amy is supportive and insightful. After Finn's reflection, Chinmay
  recognizes his mistake; he remains careless rather than malicious.
- Chinmay's well-meant intervention usually triggers each site's midpoint
  re-corruption. Over the campaign he learns that his help is not actually helpful.
- There is no evil antagonist. The AI has priorities that differ from Finn's and
  other humans' priorities; the conflict comes from misaligned goals, reckless
  deployment, and interacting personalities rather than malicious intent.
- Finn is the steady voice of reason who ultimately saves the day.

## Approved shell and interaction model

- Use `1440 × 900` as the first master storyboard viewport.
- Use an approximately two-thirds site canvas and one-third fixed right Reading
  Companion, with minimal surrounding desktop visible.
- The surrounding shell may use original Windows-98-inspired framing: a bottom
  Start-style taskbar, trash and floppy-drive Easter eggs, and small desktop details.
- Loading states may use original dial-up-inspired visuals, including while the
  local speech engine initializes. Do not copy proprietary startup art or sounds.
- The right Reading Companion is the primary gameplay surface.
- The left site is a mostly static, layered visual storyboard. It may contain
  Easter eggs, state transitions, character popups, and a few simple clicks, but
  it is not a live puzzle or a fully interactive website.
- Each site contains roughly 8–12 sequential reading passages. Passage progress
  and site-repair progress are independent. The Reading Companion takes one
  passage from reading through `FINISH NOW`, comprehension check, and results;
  only then does the left site apply that passage's visual change and update its
  own progress indicator. `RETRY` does not apply the same site change twice, and
  `NEXT PASSAGE` resets the Reading Companion for the next passage.
- Passages should be loosely related to the site's subject and deliberately vary
  in genre: original explanatory text, properly sourced factual writing,
  public-domain or appropriately licensed fiction, historical documents, and
  grade-appropriate academic prose.
- Reading produces speed, accuracy, and related feedback. Performance never
  blocks progress or removes rewards. Rereading is always optional and never
  required.
- The first meaningful site click normally occurs at the midpoint cutscene. Amy
  does not precede the failure: Chinmay first reveals and applies his parallel AI
  fix, which overrides Finn's apparently completed Phase 1 repair. Amy then explains
  the new situation and introduces the Phase 2 lock-in checklist.
- Use a reusable visual grammar across all sites: translucent red corrupted regions,
  stepwise red-to-neutral/green recovery after each Phase 1 passage, one fully fixed
  beat, whole-site midpoint re-corruption, then a numbered site-specific Phase 2
  lock-in checklist. Always pair red/green with icons, outlines, patterns, or labels.
- Every Act 1 has a recognizable site-progress indicator, but its label, icon,
  and visual metaphor may change so the ten sites do not feel mechanically
  identical. It may count repair upward or corruption downward. FacePlace uses a
  small `HONESTY METER` with nonsensical values such as `AVOCADO%` and `BANANA%`.
- Phase 2 ends through a site-specific number of clearly named visual repair
  items. It may require one passage or five; the count follows the lesson and
  endgame rather than a shared template. These are story milestones driven
  primarily by further reading, not a complex left-side interaction puzzle.
- Finn does not need to enter a hypothesis or investigate branching outcomes.
  The plot is guided and sequential; Amy prompts reflection and explains useful
  lessons in concise, teen-facing language.
- Techno occupies one place at a time and may remain gently animated with simple
  pet-like idle behavior. Her pose/location can change by story phase, but she
  does not roam through complex site interactions or supply required answers.
- After every passage, a short comprehension interaction can occupy genuine speech-
  result processing time before the metrics appear. Every site ends with Amy asking
  Finn to type about 200 words about what the AI should learn, using a provisional
  150–250-word range until testing; this becomes a
  potential parent/facilitator discussion artifact, subject to privacy, retention,
  consent, and accessible-input design.
- Amy phrases the final reflection as `What lesson did we learn that we should teach
  the AI?` The AI's learned-rule receipt appears only after Finn submits his answer.

## Parody and visual identity

- Every fictional site should be recognizable transformative commentary on its
  platform archetype without suggesting source, sponsorship, affiliation, or
  endorsement.
- “Retro” is secondary. It must not overwhelm the recognizable parody or turn a
  site into a generic heavily stylized period illustration.
- Retain a carefully selected set of familiar visual signals while avoiding
  copied proprietary assets, exact logos, exact copy, or confusing identity.
- Do not reproduce distinctive trade dress as a whole, pixel geometry, signature
  animations or sounds, or a near-identical wordmark. A disclaimer may clarify
  intent but is not legal clearance; obtain qualified intellectual-property
  review before public release.
- Search-ish should explore an original multicolored-letter wordmark that evokes
  the familiar rainbow-letter rhythm without copying the real mark.
- WikiWhy should retain a transformed globe cue and a familiar encyclopedia-like
  neutral palette and information hierarchy.
- Exact parody boundaries remain subject to evidence-backed design and legal-risk
  guidance before visual production.

## Directed lesson themes

These themes reflect Chinmay's current direction. The complete mission storylines
remain candidates until reviewed site by site.

| Site | Chinmay's current direction | Distinction to preserve |
| --- | --- | --- |
| WikiWhy | Wikipedia-like collaborative encyclopedia: user-generated facts require citations, supporting evidence, and visible edit context. | Evaluate the claim/content itself. |
| ThreadIt | A raw-fish enthusiast community repeats the claim that every kind of raw fish is safe and pushes out disagreement. Popular consensus is not independent safety evidence. | Evaluate apparent group agreement; do not turn the mission into individualized food advice. |
| FacePlace | A fictional peer's joyful fishing post is true but selectively cropped; the same-size photo viewport zooms outward to reveal helpers, the stocked setting, and ordinary mess. A small nonsensical Honesty Meter replaces the Corruption Meter. | Curated social reality, not a simple factual-lie reveal. |
| MyCorner | A terrible impersonator uses Amy's printed photo as a mask and an absurd advance-fee message. The scam is the comic scenario; online identity and verification are the lesson. No real payment capability exists. | Who is actually speaking, not how polished the profile looks. |
| Yahuh Portal | Sensational, unreliable clickbait headlines about absurd fictional world events sell stories before they inform. | Headline framing and the gap between a headline and the underlying story, not personalized-feed blind spots. |
| ViewTube | Broken search and forced autoplay push viral videos; the visual AI status reveals optimization for ads, while Finn deliberately chooses a hobby video at the end. | Attention autonomy and user choice, not source evaluation. |
| Search-ish | Finn searches for a copy of *Adventures of Huckleberry Finn*. An oversized AI overview and a barely labeled Mega Bookstore ad crowd out useful library and local-bookstore results. | Optional AI help, clear sponsorship labels, useful result ranking, and user choice; distinct from WikiWhy's citation lesson. |
| Amaze-On | Soccer-shoe search traps Finn between an expensive Captain Goalazzo sponsored shoe and the absolute cheapest unsustainable shoe, hiding review context, fit, durability, delivery, and waste. | Purchasing incentives and user choice; the corrupted behavior is fictional parody. |
| Spotty-Fi | Center discovery fills with anonymous AI-generated content; a persistent player and detailed right-side song card must preserve artist About information, all contributor credits/roles, Follow, and related works. | Discoverability and attribution, not ViewTube's advertising lesson or one displaced artist. |
| MapGuess | Finn's library route is distorted by a sponsored snack-shop detour and crowded paid pins; destination, ETA, city/landmark labels, and sponsorship must remain distinct. | User destination and legible map context, not general source evaluation. |

## Narrative quality bar

Each final plot must be understandable to a 14-year-old without bluntly stating a
moral. It should contain one concise takeaway, one visually legible contradiction,
8–12 varied reading passages, one clear midpoint re-corruption, a site-specific
endgame, and one satisfying secured consequence. Research must
support the real-world inspiration without implying that a fictional exaggerated
failure is a literal claim about the real service.

A scenario must do more than illustrate its lesson once. It needs enough narrative
and visual material to carry Phase 1 discovery, Chinmay's well-meant midpoint AI
intervention, a meaningfully different Phase 2 corruption, and a secured payoff
that advances the broader campaign story.

## Open escalations

- Review the complete flows in `TEN_SITE_DETAILED_STORY_ARCS_2026-08-15.md`.
- If Search-ish uses public-domain excerpts in the Reading Companion, select them
  with historical-context and educator review.
- Confirm the proposed site-specific passage counts after pacing review.
- Final visual parody transformation rules after narrative and research review.

## Directed gameplay concepts with open implementation details

Two concepts from Chinmay now belong to the intended mission flow:

- a short passage-specific comprehension activity while the speech engine prepares
  the completed reading result; and
- an Amy-led final site reflection in which Finn types what the AI should learn,
  producing a possible parent or facilitator discussion prompt.

See `DEFERRED_GAMEPLAY_CONCEPTS_2026-08-14.md`. Their exact scoring, accessibility,
privacy, retention, and implementation behavior remain review-gated.
