# Internet Recovery Shared Visual System

Status: approved working direction for downstream site sequences. Exact dialogue,
AI portrait art, and final character-tile assignments remain deferred.

## Canonical semantic colors

These are shared across every site, regardless of the site's own brand palette.
The executable source is `scripts/lib/internet-recovery-design-system.mjs`.

| Meaning | Token | Value | Use |
| --- | --- | --- | --- |
| Corruption / error | `corruption` | `#C5251E` | Broken claims, open repair items, corruption hatching, warnings |
| Dark corruption | `corruptionDark` | `#7A1815` | Borders or dark text paired with a soft corruption surface |
| Soft corruption | `corruptionSoft` | `#F5D8D6` | Open checklist items and quiet error backgrounds |
| Repair / secured | `repair` | `#2F8A49` | Repair headers, secured checks, successful state transitions |
| Dark repair | `repairDark` | `#1F6034` | Repair borders and success text |
| Soft repair | `repairSoft` | `#DCEFDC` | Repaired panels and quiet success backgrounds |

White text is required on the canonical solid red and green. Site palettes may
use their own colors for identity, but must not redefine what red and green mean.
FacePlace's intentionally nonsensical honesty meter is a story exception, not a
new semantic-color rule.

Semantic color follows the status of each individual element, not the overall
screen. Generated, missing, false, locked, or unresolved content stays canonical
red until its own repair step. After repair, ordinary content returns to the
site's neutral palette; a surrounding border, check, meter, or status signal
turns canonical green. This avoids both premature green and a screen where every
piece of readable content becomes green. Within one repair run, unresolved red
copy must remain textually stable until its own repair, and repaired copy must
remain stable after it is fixed. A midpoint Auto over-fix begins a new run and
may replace the copy wholesale.

## Repair-sequence visual pacing

During the initial corrupted-to-repaired sequence, order visual deltas from
smallest to largest wherever the lesson allows: microcopy and badges first,
details and secondary panels next, and dominant artwork, large modules, or
layout changes last. The page should remain visibly corrupted until late in the
meter, and the final repair should provide the strongest visual payoff. The
later lock-in checklist is independent and may follow the clearest lesson order
instead of visual-delta size.

## Internal versus player-facing state language

`Act 1`, `Act 2`, `Phase 1`, and `Phase 2` are production terms only. They may
appear in design documentation, state IDs, metadata, generator logic, and QA
output, but never in visible player copy: screen labels, progress meters,
checklists, buttons, receipts, status messages, or dialogue. Use story-native
language instead, such as `AUTO OVER-FIX ACTIVE`, `MUSIC RECOVERY`, or
`LOCK IN THE REPAIR`.

## Reusable shell

The following remain stable across sites and are built once:

- 1440 x 900 canvas;
- desktop background and the My Computer, Floppy Disk, and Trash icons;
- Reading Companion window, microphone, passage controls, quick-check region,
  results, reflection composer, and instruction receipt;
- taskbar, Start control, compact speaker/signal/clock treatment;
- popup frame geometry and image/text/action zones;
- Techno as an independent topmost overlay;
- layer ordering and automated QA annotations.

The left window title is an address-like site identifier such as
`www.wikiwhy.com`. It has no decorative titlebar icon or descriptive subtitle.
The browser/site content inside that window changes per mission.

## Site-specific layer

Each site supplies only what needs a distinct personality:

- URL/titlebar text and taskbar site label;
- site logo, navigation, content composition, and parody palette;
- site-specific progress-meter label and visual metaphor;
- Phase 1 corrupted-to-repaired state deltas;
- Act 2 super-corruption and repair items;
- bounded generated-art modules;
- dialogue content and selected character expressions.

The site layer must not redraw the desktop, Reading Companion, taskbar, or popup
geometry.

## Reusable dialogue popups

Amy, Chinmay, and the AI use the same popup component, not newly generated full
screens. The component exposes fixed slots for:

1. speaker identity and semantic header color;
2. a replaceable canonical character tile;
3. a short title;
4. bounded body copy;
5. one context-specific action label.

The component geometry is reusable; the action label is not. Labels such as
`SHOW ME` remains a placeholder and must be reviewed against the transition it
triggers. When Auto announces that a background fix is complete and the next
action applies his over-fix, use the reusable action label
`AUTO, APPLY CHANGES`. The final learned-rule receipt continues to use
`BACK TO RECOVERY DESKTOP`.

Character art comes from the reviewed expression sheets. Use pose selection,
not character regeneration:

- opening Amy: alert/concerned, inviting Finn to inspect the damage;
- repair-plan Amy: technical/problem-solving;
- secured Amy: excited/celebratory;
- midpoint Chinmay: eager `I have an idea / I fixed it` confidence;
- closing Chinmay: sheepish or flustered realization;
- AI: earnest and eager, using the later approved AI character card.

An optional opening Amy popup may introduce a site before Phase 1. Its dialogue
and exact placement are deferred to the reusable popup pass.

## WikiWhy dialogue intent held for later

Do not polish final copy during the current visual freeze. Preserve these jobs:

- Chinmay announces that he already fixed the site in the background and gave
  one careless instruction, approximately: remove all uncertainty because it is
  more efficient.
- The AI interprets that literally and aggressively by removing sources, edit
  history, qualifiers, and other cautious wording.
- Amy identifies the resulting failure and introduces the three repair locks.
- After Finn's reflection, the AI responds earnestly that it received the lesson.

Exact sentences, jokes, button labels, tile crops, and popup dimensions receive a
separate human dialogue-and-character review.

## Production rule

Future site generators import the executable tokens and locked shell. They do
not copy color hex codes or reconstruct shared components. Site-specific QA adds
its own required/prohibited elements while inheriting the common overflow,
contrast, ordering, exclusion-zone, and state-continuity gates.
