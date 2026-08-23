# WikiWhy Inkscape continuity spike

Status: editable visual-review spike; not approved or production art.

This folder tests a fixed-coordinate SVG workflow for the WikiWhy Phase 1 sequence at the agreed 1440 x 900 target. The master opens in Inkscape 1.4.4 as three named pages while reusing one shared shell, so window geometry, navigation, Reading Companion placement, desktop icons, and taskbar controls stay fixed between states.

## Review pages

1. `wikiwhy-phase-one_p1.png` — initial corruption
2. `wikiwhy-phase-one_p2.png` — Repair 1: absolute certainty becomes `CLAIM UNDER REVIEW`; Source Check reaches 17%
3. `wikiwhy-phase-one_p3.png` — Repair 2: headline and spectrum begin correcting the black-and-white claim; Source Check reaches 33%

The Reading Companion deliberately does not expose an exact passage number. Red remains on Repairs 1 and 2 because citations, edit history, and unsupported claims are still corrupted at those points. The completed Phase 1 state should clear the remaining red cues.

## Editable master

`wikiwhy-phase-one-master.svg` is the source file. Its three Inkscape pages are:

- Initial corruption
- Repair 1
- Repair 2

Reusable raster illustrations live in `assets/`; interface chrome, text, labels, controls, progress indicators, desktop icons, and window geometry remain editable vectors/text in the SVG.

## Deterministic export

Run from this directory:

```sh
inkscape wikiwhy-phase-one-master.svg \
  --export-page=all \
  --export-type=png \
  --export-filename=wikiwhy-phase-one.png \
  --export-overwrite \
  --export-dpi=96 \
  --export-background=#ffffff \
  --export-background-opacity=255
```

Inkscape writes `wikiwhy-phase-one_p1.png`, `wikiwhy-phase-one_p2.png`, and `wikiwhy-phase-one_p3.png` at 1440 x 900.

## Review boundary

This spike answers whether a fixed SVG master can preserve alignment and styled text while allowing state-specific edits. It does not yet freeze WikiWhy art direction, final copy, Repair 3–6, midpoint dialogue, Phase 2, animation timing, or production integration.

## Richer hybrid pass

`wikiwhy-phase-one-master-v2.svg` explores the approved next step toward the
original visual concept while retaining the fixed geometry:

- Chalkboard/Comic Sans-style typography is used throughout the game shell.
- The footer is only the site-specific `SOURCE REPAIR` progress meter; it does
  not expose repair or passage counts.
- The History corruption uses a small corner X and hatch treatment so its label
  remains legible.
- Stray punctuation is replaced with reusable red hatch decals.
- Initial corruption and Repair 1 reuse a bespoke Techno illustration derived
  from the reviewed Hatch Pet design language. The art is rendered entirely in
  grayscale for the corrupted black-and-white claim; Repair 2 replaces it with
  the color-spectrum module.

The corresponding review renders are `wikiwhy-phase-one-v2_p1.png`,
`wikiwhy-phase-one-v2_p2.png`, and `wikiwhy-phase-one-v2_p3.png`.

The V2 state groups carry independent `data-site-progress` and
`data-passage-progress` metadata. The Reading Companion is intentionally shown
at the same within-passage progress in all three left-side review states; its bar
does not mirror the `SOURCE REPAIR` meter.

The reusable production and QA process is documented in
`docs/design/SITE_SEQUENCE_PRODUCTION_WORKFLOW_2026-08-15.md`. Validate this
master from the repository root with:

```sh
npm run validate:design-sequence -- \
  docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg
```

## Complete state master V3

`wikiwhy-complete-state-master-v3.svg` extends the continuity test into the
complete WikiWhy review sequence. It contains 19 named Inkscape pages covering
all six Phase 1 repairs, the false completion beat, midpoint overlays, the Act 2
super-corruption, three lock states, the secured page, reflection handoff, and
the post-submission AI receipt.

The master intentionally separates four visual layers:

1. the fixed desktop, site window, and Reading Companion shell;
2. the current WikiWhy base state;
3. temporary Amy, Chinmay, or AI popups;
4. the Act 2 repair checklist, which can update without redrawing the
   super-corrupted site.

Techno is a fifth, topmost presentation overlay implemented as one reusable
Techno is intentionally absent from these static page exports. The playable
runtime owns her animated overlay so she can react to interaction without a
second, frozen copy appearing underneath.

All popup text in V3 is explicitly marked `DRAFT COPY FOR REVIEW`. It exists to
test popup dimensions and dramatic sequencing, not to approve final dialogue.
The Reading Companion body is likewise a neutral structural placeholder; its
results and comprehension-check states require their own later review.

Regenerate, validate, and export from the repository root:

```sh
node scripts/generate-wikiwhy-complete-sequence.mjs
npm run validate:design-sequence -- \
  docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg
node scripts/validate-wikiwhy-visual-qa.mjs \
  docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg
inkscape \
  docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg \
  --export-page=all \
  --export-type=png \
  --export-filename=docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-v3.png \
  --export-overwrite --export-dpi=96 --export-background=#ffffff \
  --export-background-opacity=255
```

V3 imports the reviewed V2 shell definitions instead of rebuilding them. The
visual validator fails if the shell hash or required rich components change,
if variable copy leaves its assigned region, if corruption colors or red-label
contrast are wrong, if the Act 2 checklist reaches the footer meter, if the
wrong dog-vision visual appears in Act 2, or if the final companion state resets
to reading. See `docs/design/SCREEN_SEQUENCE_VISUAL_QA_STANDARD_2026-08-15.md`.
