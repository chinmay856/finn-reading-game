# Site Sequence Authoring Principles

Status: required preflight for every new or revised Internet Recovery site.

Read this before opening a generator. It distills the durable lessons from the
reviewed WikiWhy, Spotty-Fi, Amaze-On, ViewTube, and FacePlace sequences. The
site-specific lesson and art direction still come from that site's current
contract; this file governs how the lesson becomes a reviewable sequence.

## 1. Earn the lesson with one concrete scenario

- Give the site one primary lesson and a scenario specific enough to sustain
  the entire repair run, Auto's over-fix, and the secured ending.
- Critique a platform feature or incentive, not all technology or all users.
- Keep the tone playful, absurd, and legible to a fourteen-year-old. Auto is
  catastrophically eager, not malicious; Chinmay's shortcut omits the `why`;
  Finn supplies the missing lesson.
- Before drawing, write the initial corruption, repaired state, distinct Auto
  over-fix, secured state, and the exact visual proof that each state provides.

## 2. Show the problem inside the parody

- Build an actual recognizable parody site, not a storyboard or design memo.
- Use site-native evidence: posts, votes, timestamps, search rank, ads, credits,
  controls, comments, albums, routes, receipts, or other real interface roles.
- Do not place explanatory slogans such as `PHOTO DOES NOT PROVE IDENTITY` or
  `BEFORE YOU TRUST, DO THIS` on the site merely because they describe the
  lesson. Put the evidence in the interface and let Amy explain nuance later.
- Prefer one strong visual joke over several labels describing the same joke.
  Remove duplicated headings, metadata, and status copy until essential text is
  readable at the target viewport.

## 3. Every site module needs a job

Classify every site-specific module before export as exactly one of:

1. **repair target** — it changes at a named repair;
2. **persistent parody cue** — recognizable site chrome that stays fixed; or
3. **remove it** — it is decorative clutter or repeats another module's job.

Every accepted passage produces one understandable visual consequence on the
site. Several tightly related details may change together, but a checklist tick
without an underlying site change is not a repair.

## 4. Preserve state continuity

- Lock the 1440 × 900 shell, site geometry, and component positions before
  expanding the state sequence.
- Within one repair run, unresolved red content stays identical until its repair.
  Red copy never drifts into different red copy between frames.
- At its repair, unresolved content becomes neutral or corrected and gains a
  canonical green signal: text, border, check, panel, badge, or meter change.
- Once repaired, green/corrected content does not drift again within that run.
- Scores, vote counts, ranks, and other metrics obey the same rule. Do not change
  numbers merely to decorate an intermediate frame; restore meaningful metrics
  in the named repair that restores the evidence or controls they represent.
- Static site chrome remains in the site's own palette. Do not paint everything
  red or green; reserve semantic colors for state.
- Auto's midpoint over-fix begins a new run and may replace content wholesale.

## 5. Pace the visual repairs

- Order the first run from smaller deltas to larger ones when the lesson permits:
  metadata first, secondary modules next, dominant artwork or re-ranking last.
- Keep the page visibly corrupted until late in the run. The last first-run
  repair must still have a visible payoff; do not add a frame that only changes
  an internal label.
- Author the first run and Auto lock run independently. Do not default to equal
  counts or repeat the same sequence twice. The combined reading mission remains
  within 8–12 passages, but counts follow the story.
- In the lock run, repair the clearest causal groups in lesson order. Each green
  check and its corresponding underlying site change happen in the same frame.

## 6. Make Auto's over-fix unmistakably different

- Start from Chinmay identifying a real problem and giving one careless shortcut.
- Auto follows that shortcut literally, cheerfully, and too far. The over-fix
  must be more visually and logically corrupted than the opening state, not the
  opening state with `AUTO` inserted into a few labels.
- Give Auto two or three restrained in-world Easter eggs—procedural status copy,
  a Bluetooth joke, impossible confidence, duplicated content, or a changed
  control—but do not cover the interface in explanatory Auto labels.
- Show the over-fix unobscured once before placing the green repair checklist
  over it.

## 7. Keep interface and art legible

- Reuse the reviewed desktop, windows, taskbar, Reading Companion, and character
  assets. Site generators replace the site layer; they do not redraw the shell.
- Use generated art as fixed-size modules inside Inkscape/SVG geometry. Do not
  regenerate whole screens to make a state change.
- Create thumbnails for thumbnail scale: one subject, bold silhouette, limited
  detail, and an immediately readable gag. Keep one dominant image large and
  supporting images simple.
- Use the available space. Enlarge lesson-bearing evidence before adding more
  copy. Check text, icons, crops, and alignment at the actual 1440 × 900 export.
- Player-facing screens never say `Act 1`, `Act 2`, `Phase 1`, `Phase 2`, passage
  counts, repair counts, real platform names, or internal design terminology.
- Do not display the player's name anywhere in the game UI. Write directly to
  `you`, `your`, or the visible action instead of naming the person playing.

## 8. Keep the two progress systems separate

- Reading Companion passage progress resets for each passage.
- Site progress advances only after an accepted reading and its comprehension
  check; retry never applies the same visual repair twice.
- Give each site progress bar a clear, site-appropriate label when one exists.
  A generic repair label is better than a strained metaphor. Joke meters such as
  FacePlace's Honesty Meter remain supporting components, not the whole lesson.

## Required preflight artifacts

Before generating a full sequence, create or update:

1. **Story contract:** lesson, scenario, initial corruption, Auto instruction,
   over-fix, secured payoff, and any content-safety gate.
2. **State ledger:** every frame, its visible delta, persistent elements, meter
   state, and required/prohibited content.
3. **Module-purpose ledger:** repair target, persistent parody cue, or removed.
4. **QA contract:** expected state count, stable red/green content keys, bounds,
   asset identities, over-fix proof, and secured-state prohibitions.

## Review-ready gate

Do not ask for human review until all of the following are true:

- the structural and site-specific validators pass;
- every asset reference resolves;
- adjacent frames have been inspected at full size for unintended movement;
- every unresolved red element stays stable until its repair;
- every secured checklist item changes the underlying site in the same frame;
- the over-fix is visibly distinct and Auto remains eager rather than evil;
- no module reads like a design instruction instead of a functioning parody;
- the click-through uses the exact validated exports with cache-busted paths.
