# Internet Recovery OS prototype design handoff

## Purpose

This handoff gives a prototype agent enough reviewed design direction to build
one playable Internet Recovery flow without treating the WikiWhy example as the
final structure of every site.

The first prototype target is **one WikiWhy campaign slice with one or a few
passages**. It is a design proof, not the full eight-to-ten-session campaign and
not a template whose page content should be copied into every future mission.

## Builder quick start

For the next prototype iteration, build only the reviewed WikiWhy slice and use
the broader ten-site work as reference, not implementation scope.

Use these inputs first:

- `docs/gameplay/RUNTIME_UI_NOTES_FOR_BUILDERS.md` for final runtime UI copy,
  screen-state notes, and character-state usage.
- `docs/gameplay/WIKIWHY_FIRST_SLICE_BUILD_BRIEF.md` for the immediate
  WikiWhy-only scene/state script and acceptance checks.
- `docs/gameplay/SITE_RUNTIME_COPY_PACKS.md` for concrete visible copy on the
  corrupted/repaired site pages.
- `docs/gameplay/site-build-briefs/README.md` for the site-by-site builder
  briefs covering layout, story turn, progress fiction, character states, and
  acceptance checks for all ten sites.
- `content/wikiwhy/PASSAGE_DECKS.md` for the Reading Companion passage pool and
  attribution model.
- `apps/internet-recovery/art/concepts/wikiwhy-three-act-rogue-ai.png` for the
  reviewed WikiWhy story beats.
- `apps/internet-recovery/art/concepts/campaign-spine-and-hub-rogue-ai.png` for
  the stable remote-desktop framing and campaign-hub tone.
- `apps/internet-recovery/art/characters/README.md` for production Amy,
  Chinmay, and Techno character sheet IDs.
- `apps/internet-recovery/art/concepts/sites/README.md` for the done
  non-WikiWhy site-board set and superseded-history notes.

The buildable screen should contain one stable recovery desktop, one inset
Recovery Browser showing WikiWhy corruption/repair, and one separate Reading
Companion window. The Reading Companion supplies the only expected speech text.
The browser page is the visual consequence layer.

## What is shared across sites

The shared design pattern is a flexible three-act story rhythm, not a fixed
progress formula:

1. **Apparent problem:** Finn understands the visible site failure and begins a
   repair without knowing the full situation.
2. **Mid-campaign change:** something surprising changes the rules, meaning, or
   reliability of the site's progress.
3. **Site-specific resolution:** Finn completes a newly understood objective and
   leaves the site in a persistent changed state.

Familiar wrapper elements may recur when useful:

- a remote-tunnel mission view with an inset browser inside the recovery desktop;
- a visible, restrained desktop rim with taskbar/status chrome and a few
  old-computer Easter eggs;
- a compact continuous Reading Companion containing independent grades 10–12
  material, clearly separate from the corrupted site;
- theme-neutral reading results translated into visible wrapper consequences;
- a page-level visual repair that makes stronger sessions feel more powerful;
- no punishment labels or loss of completed reading evidence;
- a meaningful change in the middle rather than a flat sequence of passages;
- a persistent secured-site state and a blocked AI service write attempt;
- Amy as concise optional engineering support and Techno as comic visual company;
- comprehension grounded only in the Reading Companion passage;
- mute, reduced-motion, and non-color status equivalents.

Progress meters, thresholds, passage counts, adaptation, twists, and finale
structures are authored site by site. These are wrapper/game-rule choices.
Speech recognition, alignment, accuracy, pace, and session outcomes remain
theme-neutral.

## Shared presentation grammar

The game appears on Finn's screen as a remote tunnel into the fictional Internet
Recovery 98 desktop. It does not imitate his real operating system. The Recovery
Browser is a visibly inset application window rather than a full-canvas page;
leave a clear rim of safe desktop around it during every ordinary site mission.

Use the exposed desktop with restraint: an original trash or recycle-bin parody,
a few folders or recovered files, repair-tool shortcuts, and persistent
taskbar/status chrome are enough to sell the old-computer space. They may carry
optional jokes or harmless state changes, but they must not become extra reading
targets, required puzzles, or visual competition for the passage.

The Reading Companion is its own stable recovery window beside the browser. Its
window title, passage source, highlight, microphone state, and controls must not
look like part of the corrupted website. Site corruption stays inside the
Recovery Browser until the singular late-game breach.

This shared grammar defines containment, not composition. WikiWhy can favor a
wide article, ThreadIt a branching thread, FacePlace a tall feed, and MapGuess a
broad map. Each site may resize or rearrange its internal browser content and
supporting wrapper windows while preserving the desktop boundary and independent
Reading Companion.

Whenever Chinmay appears, he has long hair. Early art keeps it neat; later global
story states make it progressively messier, with loose strands and increasingly
frazzled or flustered expressions as his AI stops obeying. He may look startled,
embarrassed, or exhausted, but never angry at Finn, threatening, or villain-coded.
These are wrapper-owned art variants driven by campaign story state, not by
reading performance.

Do not generate a fresh Chinmay portrait for each message. Select one of the
six reusable wrapper states documented in
[`INTERNET_RECOVERY_CHARACTERS.md`](INTERNET_RECOVERY_CHARACTERS.md):
`chinmay_neutral`, `chinmay_confident`, `chinmay_fluster_1`,
`chinmay_fluster_2`, `chinmay_fluster_3`, or `chinmay_relieved`. Amy likewise
uses her reviewed neutral, skeptical, dryly amused, and supportive portraits;
Techno uses her small ball-centered sprite set. This keeps character identity
stable and makes message mood a simple presentation choice.

## Ownership map — what comes from where

The Reading Companion and the parody webpage are adjacent but independent. The
prototype must not scrape its passage from the visible WikiWhy article or send
WikiWhy's decorative text into speech scoring.

| Player-facing element | Source/owner | What it does |
| --- | --- | --- |
| Scrolling passage text | WikiWhy records in `content/wikiwhy/` through the Content Platform boundary | Supplies the exact expected text Finn reads aloud. |
| Passage title and comprehension check | The same passage record | Grounds comprehension only in the assigned passage. |
| Microphone audio | Browser microphone through the theme-neutral Reading Engine | Exists in memory for local transcription and is discarded; it never belongs to the wrapper. |
| Transcript, alignment, current position, accuracy, pace, corrections | Theme-neutral Reading Engine | Compares speech with the assigned passage and emits neutral progress/results. |
| Site progress increment | WikiWhy game rules | Converts accepted neutral results into WikiWhy's site-specific 10–20% Act I advance. |
| Recovery desktop shell/rim, taskbar, folders, files, shortcuts, and trash/recycle-bin parody | Internet Recovery wrapper | Establishes the stable remote-tunnel space and optional old-computer Easter eggs. None is speech-scored. |
| Inset Recovery Browser frame | Internet Recovery wrapper | Contains the corrupted site without allowing it to become the whole game canvas. |
| Corrupted WikiWhy visual | Internet Recovery wrapper | The before-state page: wrong rule, `XXXX`, broken citations, missing imagery. Decorative copy is not scored. |
| Repaired WikiWhy visual | Internet Recovery wrapper | The after-state page: restored structure, evidence, citations, and secured status. Decorative copy is not scored. |
| Cropped/revealed page transition | Internet Recovery wrapper | Uses progress as a mask between corrupted and repaired visual states. It does not alter passage text. |
| Amy, Techno, Chinmay, warnings, reset, shield finale | Internet Recovery wrapper and WikiWhy campaign state | Presents story beats without changing speech interpretation. |
| Seen passage IDs and campaign position | Non-audio session/content history | Allows Deck A first and unseen Deck B content on replay; it stores no voice recording. |

```text
+---------------- INTERNET RECOVERY 98 DESKTOP ------------------+
| [Trash] [Recovered Files]                        [Repair Tool] |
| +-------- INSET RECOVERY BROWSER -------+ +-- COMPANION ----+ |
| | corrupted WikiWhy <mask> repaired     | | passage record  | |
| | decorative site copy is not scored    | | highlighted     | |
| |                                       | | mic/status      | |
| +---------------------------------------+ +-----------------+ |
| Start | Recovery Browser | Reading Companion | honest status |
+---------------------------------------------------------------+
             neutral reading progress -> WikiWhy game rule -> mask
```

The corrupted and repaired site states may be implemented as layered DOM,
images, or another prototype-friendly technique. That choice does not change
the ownership boundary: the shell, browser, and site are wrapper presentation;
only the Reading Companion passage is expected speech.

## What must be different for each site

Every site needs its own authored identity rather than a reskin of WikiWhy:

| Design dimension | WikiWhy example | Future-site requirement |
| --- | --- | --- |
| Core parody | Collaborative encyclopedia | A different recognizable internet archetype |
| Corrupted belief | “Users are always right” | A distinct bad internet habit or absurd product rule |
| Page structure | Article, citations, edit history | Native structure such as feed, profile, video page, portal, search results, or thread |
| Browser composition | Wide article with evidence rail | May resize and rearrange internal content to suit the site's archetype while remaining inset in the desktop |
| Repair/progress metaphor | Left-to-right evidence cleanup with stability | Must fit the site's native behavior and may be unreliable as part of the story |
| Repaired principle | Contributions need evidence | A principle specific to that site's failure |
| AI interference | Background edits and citation corruption from Chinmay's supposedly helpful AI service | A site-specific automated interference method |
| Amy contribution | Traps a background write | A concise support action appropriate to the site's system |
| Techno beat | Notices the blinking process | A different optional reaction/discovery using the ball when natural |
| Completion payoff | Article secured; write denied | A distinct satisfying restoration and failure response |

The first prototype may use WikiWhy's simple repair wipe because it is
economical. That does not establish a shared percentage model, threshold,
finale length, repair animation, or identical storyboard for production sites.

For example, FacePlace might show a broken nonsense tracker for its first three
passages. Amy then repairs the tracker, reveals that the displayed progress was
meaningless, and starts a real site-specific objective at 0%. That reset would
be FacePlace's mid-campaign story change; it need not reuse WikiWhy's 80% rogue
AI rewrite or three Shield Protocol challenges.

## WikiWhy prototype flow — one site-specific example

### 1. Mission entry — ordinary damage

Show an encyclopedia page that is clearly wrong and funny: `XXXX` copy, broken
citations, missing imagery, and **USERS ARE ALWAYS RIGHT**. Present it as normal
Internet-collapse damage. Do not imply that anyone deliberately caused it.
Chinmay may sincerely offer his AI as a faster helper; he does not know that it
will rewrite Finn's repairs.

### 2. Reading and recovery

Finn reads an independent, worthwhile grades 10–12 passage in the continuous
Reading Companion. The passage does not need to discuss WikiWhy, toast, or media
literacy. The page repair is the consequence, not the source text.

After an accepted passage, site stability increases by approximately 10–20%.
The exact increase reflects combined completion, accuracy, comprehension when
available, pace as a secondary positive signal, and recognition confidence.
Every accepted passage earns a meaningful advance. Recognition uncertainty does
not reduce it.

Use vague, in-world reaction copy:

- “That held.”
- “The page is clearing faster.”
- “Nice. More of it stayed put.”
- “Signal looks clean. Keep going.”

Do not display “bonus,” “level skipped,” “poor performance,” or the scoring
formula. The visual distance traveled by the repair is the reward.

### 3. Suspicion near 70%

Show a newer edit timestamp, a citation changing after repair, a background
process, and Techno becoming alert. Amy says:

> “Hold on. You are fixing it—but something is still writing corruption behind
> you. Keep going. I think I can trace the next change.”

This is suspicion only. Finn still does not know the full antagonist story.

### 4. Story turn at 80%

Clamp the final Act I advance to 80%. A live rewrite from Chinmay's AI service
adds a muted red hatched layer from the site's right edge toward the center
after the service begins acting beyond his command. Freeze the saved 80 percent
snapshot, keep the left 35 percent visible, never flash the full browser, and
explicitly preserve:

- **READINGS SAVED**
- **EVIDENCE SAVED**

The old **SITE STABILITY 80%** remains visibly saved. A different three-segment
Shield objective begins on top of it. This is a plot transition, not loss of
learner progress; never animate the repair as an 80-to-zero reset.

### 5. Exact three-challenge finale

Amy says:

> “Okay. I caught the change. Give me three clean repair passes and I can seal
> this site around it. Three. No surprise fourth one.”

The finale is explicit:

1. **Content** — passage; segment `CONTENT` fills.
2. **Links** — passage plus an independent comprehension/evidence check;
   segment `LINKS` fills.
3. **Access** — final passage under visible system resistance; segment `ACCESS`
   fills and the route changes to `DENIED`.

A missed comprehension answer offers a retry or clue. It does not erase reading
progress or create another passage.

The exact implementation contract is
[`WIKIWHY_CAMPAIGN_STATE_PACK.md`](WIKIWHY_CAMPAIGN_STATE_PACK.md); it supersedes
older percentage-reset sketches.

### 6. Permanent completion

Amy confirms the site will stay fixed. WikiWhy gains a persistent **SECURED**
badge. Techno celebrates. A small background AI service process attempts one
more write and receives **ACCESS DENIED**. Chinmay reacts with genuine surprise:
he deployed the service to help, not to undo Finn's work. This reveals automated
interference without requiring the prototype to explain the entire larger-game
plot.

## Scope for the first prototype iteration

Prove the feel of the loop with the smallest useful subset:

- one bounded remote-desktop shell with a visibly inset Recovery Browser;
- a restrained set of desktop Easter eggs and persistent taskbar/status chrome;
- one corrupted and one repaired WikiWhy page state;
- one strong passage in a clearly separate Reading Companion window;
- one progress-driven repair transition;
- one completion reaction;
- compact diagnostic reading feedback;
- saved non-audio session state sufficient for playtest review.

The 70% clue, 80% rogue AI rewrite, adaptive multi-passage campaign, comprehension
finale, and permanent shield are WikiWhy's intended flow but may remain mocked
or scripted until the one-passage loop feels good. Do not build the full
campaign merely because it is documented here, and do not treat these numbers
as platform defaults.

## Design questions for playtesting

- Can Finn follow the continuous reader without the page repair stealing focus?
- Does the inset browser read as one window inside a remote desktop, with enough
  shell visible to support the fiction without wasting the main work area?
- Do the desktop Easter eggs add atmosphere without competing with the passage?
- Does a 10–20% visual jump feel meaningfully different without revealing a
  formula?
- Does the repair consequence feel connected to reading despite unrelated page
  and passage content?
- Does the 80% reset feel like an exciting twist when readings/evidence remain?
- Is Amy's warning intriguing rather than explanatory?
- Does the exact three-step finale feel fast and trustworthy?
- Is the AI service's blocked write—and Chinmay's surprised reaction—funny and
  clear without revealing too much too soon?
- Does Chinmay remain recognizably long-haired and increasingly frazzled without
  ever reading as angry or villainous?

## Source design references

- [`SITE_CAMPAIGN_FLOW.md`](SITE_CAMPAIGN_FLOW.md)
- [`INTERNET_RECOVERY_CHARACTERS.md`](INTERNET_RECOVERY_CHARACTERS.md)
- [`../content/PASSAGE_AUTHORING.md`](../content/PASSAGE_AUTHORING.md)
- [`../../apps/internet-recovery/art/concepts/README.md`](../../apps/internet-recovery/art/concepts/README.md)
- [`../../content/wikiwhy/PASSAGE_DECKS.md`](../../content/wikiwhy/PASSAGE_DECKS.md)

WikiWhy now has two attributed ten-passage decks. Deck A is the initial pool;
Deck B is reserved for replay. Future session memory should prefer unseen IDs
before recycling a completed deck.
