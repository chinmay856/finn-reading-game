# Gameplay shell review — 2026-08-15

Status: **review candidate; not approved or production art**

## Artifact

- `internet-recovery-shell-wikiwhy-v2-1440x900.png`
- Native review target: 1440 × 900
- Generated with the built-in image-generation workflow and then cropped/resampled
  to the target aspect ratio.

## What this mock is testing

- one stable desktop managed by the Internet Recovery OS taskbar;
- two independent windows, WikiWhy and Reading Companion, each with its own title
  bar and window controls;
- a roughly 68/32 site-to-Reading-Companion split;
- a small amount of desktop visible around and between the two windows;
- a mostly static left-side storyboard and primary reading interaction on the right;
- subtle, component-level corruption instead of a page-wide red treatment;
- a truthful, site-specific Phase 1 progress bar (`SOURCE CHECK` for WikiWhy);
- persistent reading controls, current-word highlighting, passage progress, and the
  post-reading quick-check placeholder;
- Techno in one unobtrusive site location;
- no persistent Amy or Chinmay directions; and
- no visible Finn avatar.

Amy and Chinmay appear only in authored temporary overlay states when they have
dialogue. They are absent from ordinary reading screens. The overlays may be compact
bottom-corner dialogue boxes or deliberately aggressive pop-up windows, depending on
the story beat.

## Rules carried forward from board review

- Three-panel story boards are narrative diagrams, not literal gameplay screens.
- Internal lesson labels and repair checklists belong in the companion/dialogue flow,
  not automatically inside the parody website.
- Every site needs three genuinely distinct visual states: initial corruption,
  fully repaired Phase 1, and escalated Phase 2 corruption.
- Phase 1 needs one authored screen per passage so the player can see gradual repair.
- The reusable completion bar may use a different site-native name and visual style on
  each site. FacePlace alone uses deliberately nonsensical percentages.
- Real-site resemblance should come from a minimal set of high-level cues such as
  palette, information hierarchy, and an original parody mark—not copied trade dress.

## First exact-screen pilot: WikiWhy

The current narrative already supports six Phase 1 readings followed by three Phase
2 readings. The next asset pass should create:

1. initial corrupted screen;
2. title certainty reduced;
3. limited-color spectrum graphic restored;
4. cautious wording restored;
5. certainty widget replaced with a labeled chart;
6. citation sockets restored;
7. edit History restored and Phase 1 fully fixed;
8. Chinmay/Amy midpoint dialogue screens;
9. escalated `JUST TRUST ME` corruption with `NO SOURCE NEEDED`, crossed-out History,
   and absolute wording;
10. three sequential lock-in screens for claim-matched citations, edit history, and
    careful wording; and
11. final reflection and post-submit AI receipt.

These should reuse layered components instead of generating eleven unrelated page
illustrations.
