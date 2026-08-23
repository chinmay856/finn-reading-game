# Design review charter

Status: **process direction approved; design artifacts pending preview**

This document records the project reset directed by Chinmay on 2026-08-14. It
controls how old material is interpreted and how new design work earns approval.
It does not declare any visual or story artifact canonical by itself.

## Authority rule

Chinmay's current review decisions supersede historical repository labels.
Words such as `canonical`, `approved`, `production`, `frozen`, `complete`, and
`source of truth` in older files are untrusted metadata until reconfirmed.

Every reviewed artifact has one of these states:

1. **Historical** — preserved for context; not a current input.
2. **Concept approved** — a strong direction worth refining; details may change.
3. **Candidate** — intentionally prepared for current review.
4. **Revision requested** — reviewed and returned with specific changes.
5. **Approved by Chinmay** — explicitly accepted in the current review cycle.
6. **Frozen for build** — approved and accompanied by sufficient specifications,
   assets, copy, and acceptance checks for one-shot implementation.

No agent may advance an artifact beyond **Candidate** without an explicit
decision from Chinmay. Tests can verify a frozen decision; they cannot approve
one.

## Current artifact status

### Ten campaign boards

The original boards introduced by commit `f62d04d`—nine site boards plus the
original WikiWhy campaign board—are **Concept approved**. They are the strongest
references for what the game should feel like, but they are not literal screens,
pixel specifications, or authoritative sources of generated microcopy.

Later executable screenshots and locked-frame implementations are **Historical**
unless Chinmay promotes a specific element during review.

### Character boards

The Amy, Chinmay, and Techno production sheets introduced by `a7219c3` are
**Concept approved** as the working character direction following Chinmay's
2026-08-14 review. Their cells may be used to refine storyboards, but the sheets
are not yet **Frozen for build**; cropping, motion, site-specific poses, and any
material likeness changes still require review. The short-haired
`chinmay-ceo.jpg` and one-off `amy-engineer.jpg` are **Historical**.

### Story and copy

All existing story documents, copy decks, popup text, and character dialogue are
review inputs only. The current high-level premise remains useful, but exact
site narratives and lines must be previewed in the new cycle.

## Delegated refinement and escalation

Chinmay does not need to approve every small design choice individually. Once he
approves a principle or representative example, agents may apply it consistently
to materially similar cases and record the inference in the relevant packet.

Agents should resolve without escalation:

- copy tightening that preserves the approved meaning and voice;
- spacing, hierarchy, and layer cleanup that preserves approved composition;
- consistent application of an approved character, typography, popup, or motion
  rule;
- removal of obvious contradictions, illegible text, duplicated lessons, and
  distracting decoration;
- ordinary accessibility descriptions and deterministic review states.

Escalate to Chinmay when a choice changes:

- a site's primary lesson, plot, emotional meaning, or midpoint reversal;
- a character's identity, relationship, motivation, likeness, or moral role;
- the player's agency, required interaction, scoring, or reading consequence;
- a major visual metaphor, parody identity, aspect-ratio composition, or final
  payoff;
- factual claims about a real platform or a meaningful legal, safety, privacy,
  accessibility, or age-appropriateness boundary;
- an already approved principle rather than merely applying it.

Every inferred decision remains reviewable. The packet should distinguish
`Chinmay decision`, `inferred application`, and `open escalation` so review can
focus on the decisions that actually matter.

## Plot gate before visual production

Before new site mood boards or state art are generated, each site needs a short
plot contract containing:

1. the single useful lesson a 14-year-old should retain;
2. the documented real-world mechanic or risk that inspired it;
3. the corrupted visual contradiction the player notices;
4. the 8–12-passage portfolio and how each completion changes the site;
5. the simple midpoint interaction and Amy/Chinmay dialogue purpose;
6. Chinmay's well-meant AI intervention and distinct Phase 2 re-corruption;
7. a site-specific endgame with as many reading-driven repair milestones as the
   lesson needs;
8. the secured payoff and lasting consequence;
9. what the story intentionally does **not** claim or teach;
10. an independent multi-persona teen and parent review;
11. Chinmay's approve/revise decision.

The ten plot contracts must also pass a cross-site check so that no two sites
teach the same lesson with different window dressing.

## Recognizable parody boundary

The fictional sites should be recognizable transformative commentary on familiar
Internet archetypes without suggesting source, sponsorship, affiliation, or
endorsement. Use only the minimum genre grammar and selected identity cues needed
for the commentary—such as layout rhythm, information hierarchy, recognizable
control types, or a transformed multicolor wordmark—while creating original
names, logos, illustrations, copy, icons, and final compositions.

Do not import proprietary screenshots, logos, artwork, exact copy, overall trade
dress, pixel geometry, signature animation or sound, or a near-identical wordmark.
“Retro” is a supporting texture, not permission to replace the recognizable site
archetype with a generic stylized period image. A disclaimer is not legal
clearance; obtain qualified intellectual-property review before public release.
The research packet will document the exact visual boundary before new boards
are generated.

## Required package before a site can be built

Each site needs an approval-ready design packet containing:

1. **Identity board** — palette, type, mark, texture, native page grammar, and
   transformation boundary from the real-world archetype.
2. **Corrupted-state board** — one fixed-aspect full composition with the player-
   readable apparent problem and clear visual focus.
3. **Midpoint-state board** — the rule-changing reveal, preserved work, and the
   next objective.
4. **Secured-state board** — a satisfying visual payoff, persistent consequence,
   and obvious difference from the corrupted state.
5. **Character/cutscene strip** — entry, midpoint, and completion reactions using
   reviewed Amy, Chinmay, and Techno states.
6. **Popup and story script** — exact headings, concise dialogue, buttons, and
   transition order. Generated board text is not copied automatically.
7. **Layer plan** — base image, state overlays, semantic labels, progress layer,
   and interactive Reading Companion boundary.
8. **Acceptance contract** — visual anchors, required story beats, forbidden
   drift, accessibility text, and deterministic review states.
9. **Multi-persona review** — independent simulated teen and parent perspectives
   on clarity, humor, stakes, pacing, emotional safety, bias, and confusion,
   honestly labeled as simulation and followed later by real-player validation.
10. **Chinmay approval record** — explicit accepted/revise decision with date.

## Shared layout direction to preview

- Optimize for a fixed desktop viewport selected during setup rather than every
  possible responsive layout. `1440 × 900` is the first candidate, not yet a
  frozen choice.
- Keep the site canvas and Reading Companion visually separate.
- Treat the site canvas primarily as a layered visual consequence surface. Use
  a stable base composition plus a small number of state/progress overlays.
- Keep genuine interaction concentrated in the Reading Companion: passage,
  microphone, highlighting, pause/resume, completion, and feedback.
- Site Easter eggs may be visually rich but cannot obscure the passage, current
  reading location, microphone state, or primary next action.
- Do not recreate every piece of a fictional webpage as a live component when a
  reviewed image layer plus semantic accessibility text is sufficient.

## Review loop

For every design task:

1. Recover and cite the concept inputs.
2. State which details are facts, proposals, or unresolved choices.
3. Produce the smallest reviewable artifact set.
4. Run multiple clearly labeled simulated teen and parent perspective reviews,
   followed by real-player validation when practical.
5. Revise obvious clarity or consistency failures.
6. Present the artifact to Chinmay with explicit decisions requested.
7. Record the result; do not infer approval from silence.
8. Freeze assets and acceptance checks only after approval.
9. Implement once against the frozen packet.
10. Compare deterministic screenshots to the approved packet before merge.

## Archive

The pre-reset GitHub repository is preserved as a verified mirror at:

`/Users/chinmayamy/Documents/Codex/finn-reading-game-archive-2026-08-14.git`

The mirror contains 233 refs and preserves `main` at
`c97bbab727d3cf315c4e24ee622051ae67c70961`.
