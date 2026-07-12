# Project status

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Current implementation baseline:** `main` at `270c63d` (PR #30 merged)
- **Repository:** `chinmay856/finn-reading-game`
- **Live desktop prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployment:** GitHub Pages through GitHub Actions, with HTTPS enforced
- **Current stage:** Finish WikiWhy as the first complete real site campaign,
  then prove ThreadIt as the second site-specific vertical slice

## Current implementation

- The Internet Recovery 98 desktop opens on a real Recovery Map with all ten
  wrapper-owned sites, exactly three Incoming Cases, ten Case File evidence
  slots, Amy Support, persistent taskbar/status chrome, and a restrained desktop
  shortcut rail.
- WikiWhy is the only playable site. The other nine entries open explicit
  **DESIGN PREVIEW / VIEW ONLY** windows with an inactive Reading Companion and
  no microphone, transcript, score, or borrowed WikiWhy rules.
- The site catalog, navigation, desktop objects, characters, preview art, and
  campaign language remain inside `apps/internet-recovery/`. Reading Engine,
  Content Platform, speech, and theme-neutral Game Rules boundaries remain
  intact.
- Preview JPEGs are optimized story/composition crops from generated campaign
  boards. They truthfully identify unfinished sites but are temporary preview
  art, not final marks, browser chrome, copy, or state contracts.
- Production Amy and Chinmay sheet panels now supply four optimized runtime
  portraits. Dialogue selects wrapper story moods; reading performance never
  selects a character expression.
- The approved `amy_tools` crop is exported for the next Shield implementation;
  it is not wired into the current four-portrait dialogue baseline yet.
- Techno's WikiWhy progress-push animation faces and moves right with the repair
  boundary. Backward diagnostic resets reposition without playing a reverse
  walk; reduced-motion mode uses the mirrored still.
- Wrapper-only diagnostics can exercise WikiWhy's `0 → 80%` story turn and exact
  three-pass Shield Protocol without creating a reading score or modifying real
  repair history.
- The real WikiWhy loop currently uses one executable attributed Content
  Platform record, local Whisper transcription, forgiving alignment, a 250 WPM
  predictive guide, independent comprehension, and a persistent 10–20% Act I
  repair consequence.
- Non-audio session history stores only approved summary fields. Raw audio and
  transcript text are never uploaded or retained.

## Canonical product facts

- Finn is the player character and protagonist.
- Chinmay is Finn's long-haired uncle and the overconfident developer whose
  irresponsible rushed deployment caused the collapse. He sincerely tries to
  help, becomes increasingly messy and frazzled, and is never a secret saboteur
  or villain-coded.
- Chinmay's VibeShift AI is the antagonist. It first optimizes the wrong proxy,
  then continues rewriting after Chinmay's command ends.
- Amy is Finn's trusted engineering partner; Techno is an optional, mostly
  visual desktop companion. Neither can affect reading, scoring, comprehension,
  or required navigation.
- Faster reading is beneficial when accuracy and independent comprehension stay
  sound. There is no maximum-WPM penalty and no forced retry.
- Ordinary corruption stays inside the inset Recovery Browser. The desktop and
  Reading Companion remain trustworthy until the singular final breach.

## Immediate next milestone

1. Finish WikiWhy as the first complete real campaign: approve enough unseen Deck A
   passages, connect accepted readings to the Act I warning, 80% AI rewrite,
   exactly three shield passages, secured state, evidence slot one, and safe
   resume behavior.
2. Verify the complete local-microphone loop over live HTTPS, including reading
   naturalness, keyboard navigation, production portraits, Techno direction,
   and a clean browser console.
3. Prove ThreadIt as the second playable site only after its content and mechanic
   acceptance gate passes. Its source-tree repair must remain visibly distinct
   from WikiWhy's wipe.
4. Keep the remaining eight sites in truthful preview mode until each has its
   own accepted passages and site-specific mechanic.

Do not fake secured sites, reuse WikiWhy's mechanics as a template, or start the
final breach before enough real site campaigns exist to support it.

## Design readiness

The production design package is complete for WikiWhy, ThreadIt, FacePlace,
MyCorner, Yahuh! Portal, ViewTube, Search-ish, Amaze-On, Spotty-Fi, and
MapGuess. Every site has an exact wrapper-owned state contract, stable copy IDs,
persistence and resume rules, responsive and reduced-motion direction, an
original SVG mark, and a site-specific middle change and finish. WikiWhy and
ThreadIt also have focused runtime packs.

Generated campaign and site boards remain story and composition references.
They are not runtime backgrounds or sources for final logos, browser chrome,
copy, passage text, or state logic. The authoritative builder inputs are
[the ten-site production index](design/TEN_SITE_PRODUCTION_INDEX.md),
[the site production system](gameplay/SITE_PRODUCTION_SYSTEM.md), and the
[site build briefs](gameplay/site-build-briefs/README.md).

The singular post-campaign breach is also frozen as a design: after ten genuine
secured sites, `EVIDENCE_11.LIVE` requires exactly three saved checkpoints—
trace origin, preserve evidence, and revoke access. Its copy IDs, safe-exit and
resume behavior, original assets, and six-state board are documented in
[the final breach runtime brief](gameplay/FINAL_BREACH_RUNTIME_BRIEF.md).
The breach remains unimplemented and must not be previewed as completed progress.

## Known limitations

- A complete real microphone run from the newly deployed Recovery Map build is
  still required. Browser automation cannot substitute for Finn's read-aloud
  naturalness test.
- The production Whisper path remains Transformers.js `3.7.1`, timestamped
  Whisper base, WebAssembly/q8. First load is roughly 77 MB and latency varies
  by browser and hardware.
- WebGPU/q4 is not trusted on the development computer. Do not change the
  production adapter without a maintained-reference spike and objective local
  acceptance evidence.
- The real WikiWhy campaign currently stops at the Act I boundary; rewrite,
  shield, secured evidence, replay, and multi-site campaign state remain to be
  implemented.

## Repository workflow

1. Start from synchronized `main`.
2. Use one scoped `agent/<description>` branch per task.
3. Keep implementation, tests, and truth-changing documentation together.
4. Merge only after checks pass.
5. Return local `main` to the merged, deployed state.

Preserve the historical mobile prototype and its branches as side-test
reference; do not resume mobile optimization unless the user reprioritizes it.

## Validation commands

```text
npm run check
npm test
npm run build
npm run dev
```
