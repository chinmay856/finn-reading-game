# Site Sequence Production Workflow

Status: working production process based on the WikiWhy Inkscape spike; refine
before freezing the remaining nine sites.

## Required preflight

Before using this workflow, read and apply
[`SITE_SEQUENCE_AUTHORING_PRINCIPLES.md`](./SITE_SEQUENCE_AUTHORING_PRINCIPLES.md).
Its story contract, state ledger, module-purpose ledger, and QA contract are
required inputs—not optional review notes.

## Two independent progress systems

The site and Reading Companion do not share a progress state.

### Passage lifecycle — Reading Companion only

1. Load one passage.
2. Finn reads while `PASSAGE PROGRESS` moves from empty to complete.
3. `FINISH NOW` ends that reading attempt.
4. A short comprehension check occupies result-processing time.
5. The Reading Companion shows speed, accuracy, and feedback.
6. Finn chooses `RETRY` or `NEXT PASSAGE`.
7. `NEXT PASSAGE` loads a new passage and resets passage progress.

The exact passage number and total passage count are not player-facing. A site
contains 8–12 passages in total, but the interface should not turn that into a
countdown.

### Site lifecycle — left-side site only

1. The site begins at its Phase 1 corrupted state and its site-specific repair
   meter begins at 0%.
2. Completing a passage produces one predetermined visual delta on the site.
3. The left-side delta and site-repair meter update only after the passage result
   becomes available. They do not animate in lockstep with reading progress.
4. A retry may generate another reading score but must not apply the same site
   delta twice.
5. Phase 1 reaches 100% and appears repaired.
6. The midpoint dialogue runs. Chinmay's well-meant AI intervention then replaces
   the repaired site with the distinct Act 2 re-corruption.
7. Act 2 uses its own bounded lock-in sequence and visual meter/checklist.
8. Each secured Act 2 lock must visibly repair its matching site elements in the
   same state. The checklist checkmark and the underlying site color/content change
   together; the site does not wait until the final lock to turn earlier repairs green.

WikiWhy predates this clarified second-playthrough rule and needs a later visual
retrofit so its Act 2 checklist and underlying site repairs advance together.

The current retry behavior in step 4 is an implementation inference that should
be confirmed when the Reading Companion interaction is reviewed.

## One site, one state ledger

Before drawing state art, make a state ledger with one row per passage result:

| Field | Required content |
| --- | --- |
| State id | Stable machine-readable id |
| Phase | Phase 1, midpoint, or Act 2 |
| Site meter | Label and percentage before/after |
| Reading input | Passage purpose, not final prose |
| Site delta | Exactly what visibly changes after results |
| Persistent elements | What must not move or change |
| Character event | None, Amy popup, Chinmay popup, AI response, or Techno pose |
| Asset source | Reviewed character sheet, generated module, or vector component |
| Dialogue purpose | The single narrative job of any popup |
| QA expectation | What a reviewer must be able to notice without explanation |

The ledger prevents a passage from existing without a visual payoff and prevents
the artwork from inventing a lesson that is not supported by the story.

## Repeatable build order

### 1. Freeze the site contract

- Confirm the single lesson, scenario, Phase 1 corruption, midpoint mistake, Act
  2 corruption, and secured ending.
- Confirm 8–12 total passage slots and which slots belong to each phase.
- Choose the site-specific progress treatment. Preserve its position and basic
  behavior across sites, but vary its label, icon, and visual metaphor.

### 2. Create the fixed Inkscape master

- Target exactly 1440 x 900.
- Build the desktop, two windows, taskbar, and window controls once in
  `#sharedShell`.
- Build the site's fixed chrome once in a reusable group.
- Create one named Inkscape page and one named state group per ledger row.
- Reuse the reviewed Amy, Chinmay, and Techno sheets. Adapt pose, prop,
  expression, crop, or motion; do not redesign their likenesses.
- Import the shared layout and semantic colors from
  `scripts/lib/internet-recovery-design-system.mjs`; do not retype them.
- Reuse the Reading Companion and popup frames. Only the left site's content,
  URL/taskbar label, progress personality, state deltas, popup copy, and selected
  expression tiles vary.

### 3. Use generated art as modules

Image generation is preferred for character poses, hero illustrations, album or
video art, photographs, maps, decorative corruption, and other visually rich
content. Inkscape remains responsible for:

- exact window and component geometry;
- player-facing text and labels;
- progress meters and state metadata;
- repeated cards, rows, posts, and controls;
- stacking order and state-to-state continuity.

Do not regenerate a complete screen to change one state. Replace or reveal a
fixed-size visual module inside the master.

### 4. Build state deltas

- Start from the fixed site shell.
- Make each result state a minimal delta from the previous state.
- Lock invariant object coordinates before authoring copy.
- Mark each state group with `data-phase`, `data-site-progress`,
  `data-site-progress-label`, and `data-passage-progress`.
- Mark the rendered fills with `data-role="site-progress-fill"` or
  `data-role="passage-progress-fill"` plus `data-percent`.

### 5. Export deterministically

```sh
inkscape master.svg \
  --export-page=all \
  --export-type=png \
  --export-filename=review.png \
  --export-overwrite \
  --export-dpi=96 \
  --export-background=#ffffff \
  --export-background-opacity=255
```

Never use independently generated full-screen images as sequential frames.

## Automated checks

Run:

```sh
npm run validate:design-sequence -- path/to/master.svg
```

The validator checks:

- fixed 1440 x 900 canvas;
- matching Inkscape pages and state groups;
- one shared-shell reuse per state;
- unique SVG ids;
- existing external image assets;
- site and passage progress metadata/fills;
- monotonic site progress within a phase;
- absence of player-facing `Passage 1 of 9` or `Repair 1 of 6` copy;
- likely accidental coupling when both progress sequences are identical.

For WikiWhy, the second gate is:

```sh
node scripts/validate-wikiwhy-visual-qa.mjs \
  docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg
```

It renders the SVG DOM in headless Chrome and checks reviewed-shell identity,
variable-text bounding boxes, semantic corruption colors, red-surface contrast,
overlay clearance, Act 2 artwork, top-layer ordering, and the final Reading
Companion receipt state. The full cross-site requirements are in
`SCREEN_SEQUENCE_VISUAL_QA_STANDARD_2026-08-15.md`.

## Required visual QA

Automation should catch mechanical failures before review; it cannot judge
polish. Review every export at 100% and 200% for:

1. text touching, clipping, or crossing panel borders;
2. search bars and horizontal rules intersecting;
3. window controls changing position;
4. footer icons, signal bars, clock, and labels colliding;
5. image crops or character scale changing unintentionally;
6. corruption decals covering required text;
7. color states violating the story logic;
8. remaining corruption color in the fully repaired state;
9. each passage result producing one visible, understandable site delta;
10. changes outside the expected delta region.

For sequential review, flip between adjacent full-resolution exports. Any
movement outside the ledger's expected delta must be fixed before adding the next
state.

## Approval gate

Do not copy the process to the remaining sites until WikiWhy has:

- a reviewed full Phase 1 sequence;
- a reviewed midpoint and Act 2 sequence;
- a reviewed Reading Companion lifecycle;
- one clean validator run;
- one manual adjacent-frame QA pass;
- Chinmay's approval of the reusable shell and production workflow.

Once those are approved, duplicate the production structure—not WikiWhy's visual
personality—for the remaining sites.
