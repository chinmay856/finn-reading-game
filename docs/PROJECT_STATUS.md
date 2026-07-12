# Project status

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Active implementation branch:** `agent/recovery-hub-navigation`
- **Repository:** `chinmay856/finn-reading-game`
- **Live desktop prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployment:** GitHub Pages through GitHub Actions, with HTTPS enforced
- **Current stage:** Publish the Recovery Map shell, then finish WikiWhy as the
  first complete real site campaign

The implementation branch must pass CI, merge to `main`, deploy, and receive a
live HTTPS smoke check before this milestone becomes authoritative.

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
- Preview JPEGs are optimized crops from the canonical builder-ready campaign
  boards. MyCorner, Search-ish, Amaze-On, Spotty-Fi, and MapGuess were refreshed
  after corrected boards replaced their superseded sources.
- Production Amy and Chinmay sheet panels now supply four optimized runtime
  portraits. Dialogue selects wrapper story moods; reading performance never
  selects a character expression.
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

## Design readiness

- The campaign hub, WikiWhy, and nine non-WikiWhy boards are the builder-ready
  ten-site design reference set. They approve direction, three-act story,
  progress fiction, and layout reference; they are not production DOM or final
  microcopy.
- Each site owns a distinct apparent problem, middle change, progress metaphor,
  resolution, and AI interference. WikiWhy's percentage wipe, 80% rewrite, and
  three-pass shield are not platform defaults.
- The one sample passage drafted for each non-WikiWhy site remains review-only.
  Each needs a stable content ID, frozen source/provenance, factual and rights
  review, grade/sensitivity/accessibility review, and real-microphone testing
  before it becomes executable content.
- Production character sheets define reusable Amy, Chinmay, and Techno panel
  IDs. Private likeness references remain outside the repository and product
  art stays illustrated rather than photoreal.

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

1. Publish and deploy the Recovery Map branch; verify all ten tiles, preview
   honesty, WikiWhy re-entry, production portraits, Techno direction, keyboard
   navigation, and clean console state over live HTTPS.
2. Convert and approve enough WikiWhy Deck A entries into executable neutral
   content records, with unseen-passage selection and non-audio seen-ID history.
3. Replace the diagnostic-only campaign transition with a versioned real
   WikiWhy state machine: Act I warning, 80% AI rewrite, exactly three shield
   passages, secured state, evidence slot one, and safe resume behavior.
4. Prove a second site only after its content and mechanic acceptance gate is
   satisfied. ThreadIt is the strongest portability test because its source-tree
   repair must remain visibly distinct from WikiWhy's wipe.

Do not fake nine secured sites, reuse WikiWhy's mechanics as a template, or
start the final breach before enough real site campaigns exist to support it.

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
