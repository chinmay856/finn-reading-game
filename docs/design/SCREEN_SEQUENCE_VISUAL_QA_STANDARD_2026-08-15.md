# Screen Sequence Visual QA Standard

Status: required production gate for WikiWhy and every later site sequence.

## Why this exists

A sequence is not ready for review merely because every frame exports. The
mechanical work—alignment, overflow, color, component continuity, layer order,
and state logic—must be checked before a human reviews story, humor, and art.
The reviewer should not have to rediscover the same layout defect across 19
frames or ten sites.

## Locked dependencies

Once a shell pass is reviewed, later generators must consume that shell as a
dependency. They may not redraw, approximate, or retype it.

- Desktop icons, taskbar controls, window frames, Reading Companion chrome,
  microphone, typography, and fixed geometry live in one reviewed definition.
- A sequence records a cryptographic hash of that definition.
- Validation fails if the dependency changes or required component IDs vanish.
- Site-specific content is layered into named, bounded regions of that shell.

This prevents a large state expansion from silently reverting to earlier icons,
controls, or typography.

Shared semantic colors, geometry, and layer order are executable imports from
`scripts/lib/internet-recovery-design-system.mjs`; their human-readable contract
is `INTERNET_RECOVERY_SHARED_VISUAL_SYSTEM_2026-08-15.md`. Site generators must
not copy these values into independent local palettes.

## Machine-checkable contracts

Every master must encode these contracts before export:

1. **Canvas:** every named page is exactly 1440 x 900.
2. **Shell reuse:** every state begins with the same reviewed shell reference.
3. **Top layer:** Techno remains a separate final overlay, never baked into the
   site or dialogue.
4. **Text bounds:** every variable heading, paragraph, label, checklist, and
   popup title declares an allowed rectangle. Its rendered SVG bounding box
   must remain inside that rectangle.
5. **Exclusion zones:** temporary overlays must clear persistent progress meters,
   window controls, and required actions.
6. **Semantic color:** corruption markers explicitly validate as red; text on
   red surfaces explicitly validates as white; repair controls validate against
   the canonical green; text on solid green validates as white; a fully repaired
   state contains no unintended corruption treatment. Every changing site
   element must declare its semantic state in the generated SVG. Generated,
   missing, false, locked, or otherwise unresolved content remains canonical red
   until that specific element is repaired. Repaired content returns to the
   site's neutral content palette while its border, check, meter, or other repair
   signal turns canonical green. Validators must inspect every annotated element
   in every state—not only the initial and final anchors. Within one repair run,
   unresolved red copy must not silently change into different red copy, and
   repaired copy must not drift into different repaired copy. Copy changes only
   at the repair that changes its semantic state; a midpoint over-fix begins a
   new run and may deliberately replace the copy wholesale.
7. **Required/prohibited state content:** each ledger row names what must appear
   and what must not. For WikiWhy, Act 2 requires grayscale Techno and prohibits
   the repaired spectrum module.
8. **Independent progress:** passage progress and site repair progress remain
   separate state systems.
9. **Completion continuity:** submitting the reflection leaves the Reading
   Companion in a receipt/success state; it cannot reset to reading mode.
10. **Production-language exclusion:** visible SVG text must not contain
    `Act 1`, `Act 2`, `Phase 1`, or `Phase 2`. Those terms remain available only
    in internal documentation, state IDs, metadata, generator logic, and QA
    output. The shared structural validator enforces this across sites.
11. **Visual-delta pacing:** the initial repair ledger records each transition
    as small, medium, or large. Within that repair run, deltas should be
    nondecreasing unless the site contract documents a lesson-driven exception.
    Dominant artwork and layout changes normally occur last. Lock-in repairs are
    reviewed separately and need not follow this ordering.
12. **Asymmetric mission pacing:** first-run repairs and post-midpoint lock
    repairs are authored as independent sequences. They do not default to equal
    counts. Each count follows the site's lesson and visual pacing while the
    combined mission remains within the approved 8–12 passage range. Across the
    campaign, sequence shapes should intentionally vary (for example 5+3 or
    4+6) unless a particular site's story genuinely earns symmetry.
13. **Visual-purpose ledger:** every site-content module, excluding the shared
    desktop and Reading Companion shell, must be classified as a stateful repair
    target, a persistent parody cue, or removed. A stateful target records its
    first and last affected states and must visibly change when its repair is
    secured. Unclassified decoration, stale red states, and premature green
    states fail pre-export review.

## Review order

Run the gates in this order. A failure stops export.

1. Generate the SVG master from the locked shell and state ledger.
2. Run structural validation.
3. Run rendered-DOM geometry, color, overlap, and state validation in headless
   Chrome.
4. Export every named page deterministically with Inkscape.
5. Compare representative and adjacent renders at full resolution for visual
   movement outside expected delta regions.
6. Build a click-through from the exact validated exports.
7. Ask for human review of narrative, visual hierarchy, humor, and art direction.

Automated checks do not approve art. They remove preventable mechanical noise
from the art review.

## WikiWhy commands

```sh
node scripts/generate-wikiwhy-complete-sequence.mjs
node scripts/validate-design-sequence.mjs \
  docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg
node scripts/validate-wikiwhy-visual-qa.mjs \
  docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg
```

Only after both validators pass should Inkscape export the 19 review frames.

## Scaling to the remaining sites

The generic rules above become the shared validator. Each site adds a compact
site contract for its unique layout and story logic: expected state count,
allowed content regions, overlay exclusion zones, required corruption cues,
secured-state prohibitions, and asset identity. The fixed shell is reused; the
site personality is not homogenized.

New screens are reviewed in small batches until that site's shell and bookend
states pass. Only then is the full state ledger expanded. This makes a 200-frame
project a set of validated sequences rather than 200 unrelated illustrations.
