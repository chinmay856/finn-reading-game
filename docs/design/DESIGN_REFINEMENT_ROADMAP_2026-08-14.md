# Design refinement roadmap — draft for Chinmay preview

Status: **process reference; site narrative briefs superseded by
`TEN_SITE_PLOT_CONTRACTS_2026-08-14.md`; no implementation authorized**

This is the working plan for turning ten approved concepts into reviewable game
designs. It intentionally does not inherit approval from repository filenames,
commit messages, old specifications, or prior implementations.

The five-board packet, shared-shell, layering, and approval sequence remain
current process proposals. The site-by-site story details below record an earlier
refinement stage and must not override the researched, multi-persona-reviewed plot
contracts or the current open-question agenda.

## What is preserved, and what is not

Preserve from the ten campaign boards:

- each site's recognizable Internet archetype and visual personality;
- the corrupted → midpoint reveal → secured rhythm;
- the site-specific joke or contradiction that makes the problem visible;
- the idea that reading causes visible recovery;
- the separation between the decorative site and Reading Companion.

Do not preserve automatically:

- embedded Amy, Chinmay, or Techno drawings;
- generated headlines, names, dialogue, prices, dates, links, or citations;
- exact proportions, popup placements, or interaction details;
- later executable recreations merely because they exist;
- any old claim that an artifact is canonical, approved, or production-ready.

## Decisions to make once, before refining ten sites

The first review should settle a shared game shell. Current recommendations are
proposals, not defaults that silently become permanent.

| Decision | Recommended review candidate | Why it matters |
| --- | --- | --- |
| Master viewport | 1440 × 900 | One deterministic composition is easier to art-direct and test. |
| Primary split | Site 68%, Reading Companion 32% | The passage remains comfortably readable while the site can carry a strong visual gag. |
| Companion location | Fixed right rail | The player's eyes and controls do not move between sites. |
| Responsive behavior | Proportional scale or letterbox | Avoids rebuilding each fictional page as responsive DOM. |
| Site implementation | Reviewed base image plus a few transparent state layers | Preserves art direction and prevents overlap drift. |
| True interaction | Reading Companion, plus at most one approved site-specific choice | Keeps reading central without turning every site into a simulator. |
| Midpoint agency | Player notices or predicts the contradiction before Amy explains it | The player solves the mystery instead of helping Amy play. |
| Main lesson | One per site | Prevents the story from becoming a lecture or checklist. |
| Character use | Only explicitly approved sheet states or newly reviewed matching poses | Stops likeness and style drift. |
| Techno motion | Rare, short, consequential animation beats | Keeps Techno cute and memorable rather than noisy. |

Separate aspect-ratio compositions can be designed later if they are genuinely
needed. They should be independently reviewed layouts, not fluid rearrangements
of dozens of elements.

## The same five-board packet for every site

No site is ready for implementation until Chinmay has previewed one complete
packet containing:

1. **Identity board** — palette, typography, logo, chrome, texture, density,
   icon language, and explicit parody boundaries.
2. **Gameplay triptych** — the exact entry, midpoint, and secured frames at the
   selected viewport, with the Reading Companion visible.
3. **Layer board** — clean base, corruption, reading-progress effects, midpoint
   override, secured effects, popup safe zones, and character safe zones.
4. **Character and motion board** — the exact Amy, Chinmay, and Techno state at
   every beat, including any Techno animation keys, timing, and loop rules.
5. **Copy and flow board** — exact passage relationship, dialogue, popup title,
   body, buttons, speaker, timing, dismissal behavior, primary joke, and optional
   Easter eggs.

Each packet also needs a short acceptance contract, semantic text for meaningful
content baked into images, multiple clearly labeled simulated teen and parent
perspective reviews, later real-player validation when practical, and an explicit
approve/revise record from Chinmay.

## Ten site refinement briefs

All copy below is a direction to test, not approved dialogue.

### 1. WikiWhy — confidence is not evidence

- **Concept to preserve:** a confident false article improves through reading;
  the midpoint exposes a reverse write; three distinct final actions recover,
  verify, and seal it.
- **Player discovery:** notice that a polished claim conflicts with evidence,
  then catch the page changing behind the recovered work.
- **Needed boards:** encyclopedia grammar; four article states; three-card shield
  sequence; evidence-versus-site popup language; approved character strip.
- **Open choices:** the article topic; passage-based versus percentage-based
  midpoint; whether Chinmay is deliberate, reckless, or disconnected from the
  autonomous system; how many final recovery actions the lesson genuinely needs.
- **Guardrails:** never erase reading results; never obscure the passage; the
  final page must visibly show evidence, sources, and blocked write access.

### 2. ThreadIt — popularity is not independence

- **Concept to preserve:** replies precede the buried question; a huge vote score
  masks many branches copied from one origin; the secured thread restores
  chronology and genuinely different sources.
- **Player discovery:** trace which apparently separate posts repeat the same
  detail before Amy names the trick.
- **Needed boards:** thread/nesting grammar; source-lineage reveal; scrambled and
  restored state layers; optional lightweight trace choice; Techno connector beat.
- **Open choices:** hero example; whether fake Chinmay accounts fit the story;
  how dense the restored thread can be; whether “one post wearing ten hats” is
  the right voice.
- **Guardrails:** votes never equal truth; show at least three independent final
  branches; do not build a functional forum.

### 3. FacePlace — recommendations should not impersonate relationships

- **Concept to preserve:** appliance promotions replace friends; a nonsense
  counter reaches `12% → 114% → AVOCADO%`; the honest midpoint resets the fake
  meter without losing work; secured controls explain distribution.
- **Player discovery:** identify which real authors are hidden under promoted
  cards and what signal the fake counter is actually measuring.
- **Needed boards:** feed grammar; genuine-post underlay; three counter states;
  distribution transparency controls; Amy and Techno reaction strip.
- **Open choices:** one primary lesson—distribution, authorship, chronology, or
  privacy; whether `AVOCADO%` stays; whether chronological mode is automatic or
  selected by the player.
- **Guardrails:** preserve recovered work at the reset; label promotions; make
  `WHY THIS APPEARED` visible; bake decorative feed cards into image layers.

### 4. MyCorner — identity belongs to its owner

- **Concept to preserve:** one sponsored persona overwrites distinct personal
  profiles while the owners' content survives underneath; completion restores
  expression, privacy, and owner controls.
- **Player discovery:** compare profiles to spot what the template changed and
  what each person actually chose.
- **Needed boards:** nostalgic personal-profile grammar; four meaningfully
  different owner profiles; overwrite/underlay layers; privacy and owner-control
  language; completely replaced character art.
- **Open choices:** whether Chinmay is the imposed template; time-period styling;
  the four sample owners; self-expression versus consent as the single lead idea.
- **Guardrails:** reject every short-haired Chinmay depiction; differences must
  include voice and interests, not just color; autoplay is visual-only unless
  the player opts into sound.

### 5. Yahuh Portal — categories need visible sources

- **Concept to preserve:** weather, finance, mail, news, sports, and shopping are
  misrouted; ads resemble reporting; the midpoint reveals one source pretending
  to power everything; the secured portal reconnects distinct channels.
- **Player discovery:** spot category/source mismatches, then infer the shared
  false source from timing or repeated wording.
- **Needed boards:** portal-era identity; module taxonomy; disconnected, falsely
  unified, and repaired switchboards; corrected character strip; Techno sports gag.
- **Open choices:** keep six modules or reduce for legibility; source integrity
  versus cognitive overload as the main lesson; visual result versus one simple
  matching choice.
- **Guardrails:** final modules show category and source; ads are unmistakable;
  distinct connections—not cleaner spacing—communicate success.

### 6. ViewTube — repetition is not corroboration

- **Concept to preserve:** many confident uploads are the same underlying clip;
  the silent repeated toast and autoplay behavior create the corruption joke;
  final evidence separates footage, transcript, and actual sources.
- **Player discovery:** find the repeated detail or contradiction across clips
  before the duplication is revealed.
- **Needed boards:** video-site grammar; duplicate-thumbnail family; clue and
  source treatment; silent autoplay states; rare Techno-off-switch animation.
- **Open choices:** exact teen-relevant clip topic; whether technical hashes are
  visible only as an Easter egg; how the player marks duplicate evidence.
- **Guardrails:** use plain language such as `10 VIDEOS. 1 ORIGINAL.`; never play
  surprise audio; do not require understanding file hashes.

### 7. Search-ish — five results can still be one source

- **Concept to preserve:** a confident summary sits above apparently independent
  results that collapse to one owner or cached origin; the repair exposes who
  said it, when, and how they know.
- **Player discovery:** choose which result deserves trust using a clue from the
  reading, then see the fake diversity collapse.
- **Needed boards:** search grammar; result-lineage reveal; claim provenance;
  unverified-summary label; approved query and result copy.
- **Open choices:** a query a teenager would care about; whether the player makes
  a trust choice; how to show ownership without relying on words like “cache.”
- **Guardrails:** never equate result count with evidence; keep the summary
  visibly unverified until supported; prefer “one source in five costumes.”

### 8. Amaze-On — the site cannot decide for the player

- **Concept to preserve:** returning one item creates two deliveries; a receipt
  exposes permission the player never knowingly gave; the secured state requires
  human confirmation and allows buying nothing.
- **Player discovery:** read the receipt to find why the absurd return happened.
- **Needed boards:** commerce grammar; multiplying-box midpoint; readable receipt
  clue; keep/return/buy-nothing choice; secured confirmation state.
- **Open choices:** the item and hidden permission wording; whether the choice is
  interactive; how far the box animation can escalate without distracting.
- **Guardrails:** use concrete copy—`RETURN ACCEPTED. TWO REPLACEMENTS ORDERED.`—
  rather than policy terms; no real purchasing pattern or dark pattern may remain
  visually ambiguous in the final state.

### 9. Spotty-Fi — suggestions should not overwrite choice

- **Concept to preserve:** the service claims to know the player before login;
  every personalized path collapses to the same short track; the secured state
  separates manual queue choices from suggestions.
- **Player discovery:** identify impossible pre-account history or repeated track
  details, then build a queue that visibly reflects a choice.
- **Needed boards:** music-service grammar; impossible-history clue; repeated-track
  reveal; manual queue versus recommendation layers; creator-credit treatment.
- **Open choices:** one simple explanation for the impossible history; passage
  subject that makes reading relevant; whether choice, privacy, or credit is the
  single main lesson. Recommendation: lead with choice.
- **Guardrails:** no surprise audio; one lesson rather than four; a manual choice
  must produce a visible personal result.

### 10. MapGuess — a confident route still needs anchors

- **Concept to preserve:** a route crosses a lake while claiming two minutes;
  the destination moves but the ETA does not; the player restores stable anchors
  and chooses fastest, safest, or scenic.
- **Player discovery:** use clues in the reading to identify the intended place or
  route, then catch the destination moving while the road stays put.
- **Needed boards:** map grammar; corrupted route; moving-destination midpoint;
  three clearly different route outcomes; scale/date/source anchor treatment.
- **Open choices:** what “safest” concretely means; the destination and reading
  clue; whether the three-route choice is the approved lightweight interaction.
- **Guardrails:** choices must change the visible route and outcome; keep Chinmay's
  line short; do not turn scale/date/source into a worksheet.

## Teen-player findings already strong enough to adopt

The independent review of sites 6–10 found recurring risks worth applying to all
ten packets:

- let the player notice or guess before Amy explains;
- replace policy or engineering vocabulary with short visual statements;
- give each site one lesson, one primary joke, and a distinct emotional mini-story;
- make highlighted reading reveal a clue that changes what happens on the site;
- vary the Amy → Chinmay → repair rhythm so ten sites do not feel templated;
- keep Techno's actions rare enough to remain surprising;
- read all essential copy aloud without design context; simplify anything that
  is not immediately understandable.

The reviewer preferred MapGuess as a first playable concept because its broken
route, moving destination, and meaningful route choice are immediately legible.
That is useful player feedback, not a production decision.

## Recommended approval sequence

### Gate 1 — shared shell and cast

Preview and decide the viewport, split, Reading Companion position, outer-game
chrome, character sheets/state names, Techno motion style, antagonist model,
player/Finn identity, dialogue tone, and status vocabulary.

### Gate 2 — two vertical design pilots, not code pilots

Complete the five-board packet for:

1. **MapGuess**, to establish a visually obvious joke and genuine player choice.
2. **WikiWhy**, to establish the evidence-heavy reading loop and three-step finale.

Together they test the two hardest design modes before multiplying decisions
across all ten sites. Chinmay previews both; neither is implemented yet.

### Gate 3 — remaining eight packets

Apply the approved packet grammar in two review waves:

- ThreadIt, FacePlace, MyCorner, Yahuh;
- ViewTube, Search-ish, Amaze-On, Spotty-Fi.

Each receives multiple clearly labeled simulated teen and parent perspective
reviews before Chinmay's preview, followed by real-player validation when practical.

### Gate 4 — freeze for build

Only after all visual states, exact copy, character states, motion, layer files,
semantic text, and acceptance checks for a site are explicitly approved may that
site move to **Frozen for build**. Implementation is then checked against fixed,
deterministic screenshots rather than improvised during coding.

## First preview agenda

The next working session should preview, not assume, these items:

1. 1440 × 900 with a fixed right Reading Companion at roughly 68/32.
2. The current Amy, long-haired Chinmay, and Techno sheets state by state.
3. Sincerely reckless Chinmay versus autonomous system versus deliberate antagonist.
4. Finn as named visible character versus the player themselves.
5. MapGuess and WikiWhy as the two design pilots.

The output of that session is a decision log and revision brief. It is not code.
