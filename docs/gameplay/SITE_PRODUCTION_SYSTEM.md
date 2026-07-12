# Internet Recovery 98 site production system

## Purpose

This design-only system closes the gap between campaign concept boards and
playable site layouts. It applies to WikiWhy, ThreadIt, FacePlace, MyCorner,
Yahuh! Portal, ViewTube, Search-ish, Amaze-On, Spotty-Fi, and MapGuess while
allowing every site to keep its own progress fiction, midpoint, and finish.

The per-site build briefs remain authoritative for local story. This file is
authoritative for shared production behavior.

## Required site contract

Every playable site must define:

1. exact Act I repair units;
2. how one accepted theme-neutral reading result completes a site unit;
3. the exact midpoint trigger;
4. which repaired work persists through the midpoint;
5. exact post-midpoint finish units;
6. a permanent secured state and blocked-write consequence;
7. persisted resume points;
8. reduced-motion and non-color equivalents;
9. original site mark and palette;
10. DOM/SVG versus raster ownership.

Percentages are optional and site-owned. No shared global percentage formula is
hard-coded into site design.

## Reading-result boundary

The Reading Engine emits theme-neutral progress and results. The site's wrapper
configuration maps an accepted result to the next authored repair unit.

Rules:

- one accepted reading completes at least one coherent site unit;
- a stronger result may broaden the visual consequence inside that unit, but it
  never creates a promise that lower results add punishment passages;
- progress never moves backward because of accuracy, pace, recognition
  uncertainty, retries, or comprehension;
- Continue remains available after an accepted reading;
- retry remains voluntary;
- comprehension remains passage-grounded and independent;
- site decoration is never scored speech.

## State and persistence

Site state belongs to Game Rules/non-audio session state through stable
interfaces. Wrapper visuals consume it.

Persist after:

- each completed repair unit;
- midpoint discovery before its dialogue/action;
- midpoint acknowledgement;
- each finale unit;
- secured state and evidence receipt.

Resume at the next unfinished unit. Never replay a completed passage because a
later wrapper animation or save step failed.

Recommended wrapper-facing shape:

```text
siteId
act
stateId
completedUnitIds[]
midpointDiscovered
midpointAcknowledged
secured
evidenceId
lastOpenView
```

Names above are illustrative interface fields, not a request to move site names
or story state into the Reading Engine or Content Platform.

## Desktop and responsive layout

Target 1440 by 900 first; preserve usability down to 1180 CSS pixels.

At 1440:

- 74-90 pixel stable desktop rail;
- Recovery Browser receives the largest region;
- independent Reading Companion receives 340-380 pixels;
- 12-16 pixel window gap;
- site content uses its own internal columns and scroll container;
- browser title, site status, Reading Companion title, microphone state, and
  Continue/Finish remain visible without horizontal page scrolling.

At 1180-1279:

- desktop rail may reduce to 60-68 pixels;
- Reading Companion may reduce to 300-320 pixels;
- hide secondary site metadata before shrinking body text;
- convert the least important site rail into an in-browser tab/drawer;
- never overlay that drawer on the Reading Companion.

Below 1180 is not the current acceptance target. If shown, stack site-owned
secondary panels inside the Recovery Browser while preserving the separate
Reading Companion window.

## Typography and density

These are minimums; site briefs may choose larger type.

- site wordmark: 22-28 CSS pixels;
- site page headline: 22-32 pixels;
- body/card copy: 14-16 pixels;
- metadata: 11-13 pixels;
- wrapper status/log: 11-13 pixel monospace;
- Reading Companion uses its independently tested teen-level typography.

No site should resemble an early-reader flashcard interface. Dense layouts may
be funny, but essential state and actions remain legible.

## Midpoint behavior

- Trigger only after the preceding accepted result is saved.
- Never interrupt active microphone capture.
- Preserve already completed work, even if the site makes it look temporarily
  overwritten or reclassified.
- State the new problem in text and show one concrete visual proof.
- Dialogue stays in a wrapper card/modal and never enters the Reading Companion.
- Character panels use the production manifest IDs.
- Resume after the midpoint action, not before the completed reading.

## Motion and reduced motion

Default transitions should finish in roughly 400-900 ms and communicate one
relationship at a time. Avoid constant idle movement in reading-critical
regions.

With reduced motion:

- replace wipes, route draws, tile swaps, and reorders with discrete state
  changes;
- keep the same text status and completed-unit count;
- do not flash, shake, invert, or rapidly change count text;
- Techno uses the matching still asset.

## Accessibility

- Essential state exists as text, not color, motion, connector geometry, or an
  image alone.
- Use one concise live status when a repair unit completes.
- Do not repeatedly announce decorative number changes.
- Meaningful source trees, feeds, receipts, routes, timelines, queues, and
  module relationships are DOM content with optional inline SVG connectors.
- Concept boards are never runtime backgrounds.
- Character and Techno art has concise alt text or is decorative when adjacent
  dialogue/state already carries the meaning.
- No site traps scroll or keyboard focus away from the Reading Companion.

## Original visual identity

Use the original mark manifest under
`apps/internet-recovery/art/site-assets/marks/`. Do not reproduce a real
platform's logo, wordmark, mascot, browser chrome, trade dress, or exact color
order. Familiarity should come from the site archetype, layout role, parody
name, and transformed palette.

## Asset ownership

Prefer DOM/CSS/inline SVG for:

- marks, badges, state icons, connectors, progress structures;
- cards, modules, timelines, feeds, receipts, maps, queues;
- labels, logs, evidence, controls, and copy.

Use raster/WebP for production character portraits, Techno animations/stills,
and deliberate site illustration where a generated or hand-drawn bitmap adds
value. Never use an entire concept board as the playable page.

## Site acceptance baseline

Before a site moves from preview to playable:

- its own state contract and passage record are connected;
- it does not borrow WikiWhy's passage, progress, copy, or score;
- the midpoint and finale can resume from saved state;
- the secured state is permanent;
- only Reading Companion text is scored;
- all site audio is silent/muted during microphone use;
- the desktop shell stays stable;
- original identity assets replace real-product marks and browser chrome;
- the full flow works at 1440 and 1180 CSS pixels;
- reduced-motion and keyboard-only flows are testable.
