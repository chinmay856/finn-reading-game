# Project status

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Active implementation branch:** `agent/threadit-act-one-foundation`
- **Repository:** `chinmay856/finn-reading-game`
- **Live prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployed main:** `17826e4` through PR #32
- **Deployment:** GitHub Pages through GitHub Actions, HTTPS enforced
- **Current stage:** Build ThreadIt's semantic Act I/source-tree foundation
  without scoring its review-only passage or borrowing WikiWhy's mechanic

## Deployed implementation

- Internet Recovery 98 opens on a Recovery Map with all ten sites, exactly
  three Incoming Cases, ten Case File slots, Amy Support, persistent desktop
  chrome, and the approved shortcut rail.
- WikiWhy is the only playable site. The other nine open explicit
  **DESIGN PREVIEW / VIEW ONLY** windows with `MIC: OFF` and no borrowed passage,
  scoring, or WikiWhy mechanic.
- The live WikiWhy reader uses local Whisper processing, forgiving alignment, a
  250 WPM predictive guide, independent optional comprehension, and non-audio
  session history.
- The Reading Engine, Content Platform, theme-neutral strength calculation,
  wrapper rules, and Internet Recovery presentation remain separated.
- WikiWhy now has versioned campaign state, the 70–79% route clue, saved-versus-
  AI comparison, exactly three Shield passes, permanent secured navigation, and
  canonical `AI WRITE ROUTE / 01` evidence. This shipped through PR #32.

## Current ThreadIt branch

- The production handoff is sufficient for a semantic structural slice. No new
  art, layout, state, or interaction decision blocks implementation.
- The branch will add versioned non-audio ThreadIt state, four fixed Act I
  relationship units, an objective diagnostic route, and a DOM/inline-SVG
  source-tree view with no site percentage meter.
- `Why Disagreement Matters` remains review-only and must stay fail-closed until
  its structured content, provenance, review, and microphone gate are complete.
- The exact canonical forum fixture is the only open ThreadIt copy artifact;
  it is requested in [`design/DESIGN_REQUESTS.md`](design/DESIGN_REQUESTS.md).

## Deployed WikiWhy implementation

- Integrated the complete production design package through design tip
  `1f843bc`, including the WikiWhy campaign pack, approved ThreadIt handoff,
  original ten-site marks, and final-breach contract/assets.
- Upgraded real WikiWhy persistence to version 3 with safe v1/v2 migration,
  bounded all-session deduplication, completed passage IDs, explicit phases,
  one-time warning/rewrite events, Shield progress, secured state, and evidence
  ID. Malformed or blocked browser storage never interrupts a reading result.
- Real state follows `act-one → reverse-hack → shield 0/3 → 1/3 → 2/3 →
  secured`. A jump that crosses both 70% and 80% emits the warning before the
  rewrite, and the Act I reading never also counts as Shield pass 1.
- Shield Protocol consumes exactly three accepted readings. Metrics still render
  plainly, but cannot add or remove Shield passes. A fourth/post-secured result
  is a no-op for campaign progress.
- The nested browser has accessible phase overlays, a reduced-motion-safe
  70–79% clue, right-to-left rewrite treatment, saved-versus-AI comparison, the
  exact content/links/access Shield checklist, permanent secured seal, canonical
  route-log receipt, and production-sheet crops for Amy, Chinmay, and Techno.
  The trusted desktop and Reading Companion stay stable.
- Campaign visuals rest on persisted campaign progress. Live transcript progress
  projects only toward the next possible campaign step instead of falsely
  repainting the whole site from 0 to 100 for every passage.
- Added a theme-neutral passage catalog and wrapper-owned Deck A/B ID lists.
  Candidate records are never selected. The UI shows an explicit content-review
  gate when no unseen executable passage remains.
- Hardened the current photosynthesis record with a reviewed revision link,
  modification notice, CC BY-SA 4.0 metadata, and visible source/license links
  outside the speech-scored text.
- Published executable warning, rewrite, Shield, and secured screenshots in
  [`design/review/`](design/review/), with the current builder handoff in
  [`design/DESIGN_REQUESTS.md`](design/DESIGN_REQUESTS.md).

## Content readiness

- `photosynthesis-a01` is the only executable record and remains prototype
  content, not final production-approved content.
- The other 19 WikiWhy deck drafts are candidates only. They need structured
  three-choice comprehension/feedback, permanent provenance, rights notice,
  factual review, grade/sensitivity review, a reading profile, and real
  microphone testing before promotion.
- Candidate selection is fail-closed: the runtime will not score a draft or
  silently reuse one passage to imply campaign depth.
- Worst case requires eleven readings (up to eight 10% Act I advances plus
  three Shield passes), while Deck A has ten. The content plan still needs one
  explicit Deck B overflow or repeat policy.

## Design readiness

- Shared production behavior is frozen in
  [`gameplay/SITE_PRODUCTION_SYSTEM.md`](gameplay/SITE_PRODUCTION_SYSTEM.md),
  with exact per-site contracts indexed by
  [`design/TEN_SITE_PRODUCTION_INDEX.md`](design/TEN_SITE_PRODUCTION_INDEX.md).
- ThreadIt is approved as the second playable site and portability proof. Its
  semantic source tree must be DOM content with inline SVG connectors, not a
  flattened concept-board image.
- WikiWhy evidence slot 1 is the route-log artifact
  `wikiwhy.evidence.route-fragment-01`, visible as `AI WRITE ROUTE / 01`.
- The separate `EVIDENCE_11.LIVE` final breach is designed but must not begin
  until ten genuine sites are secured.

## Validation

- `npm run check` — passed
- `npm test` — 84 tests passed
- `npm run build` — passed
- Browser QA — full diagnostic route clicked through at desktop scale: warning,
  rewrite, Amy contradiction, Shield 0/3 through 3/3, secured payoff, source and
  license links, content gate, keyboard-addressable controls, and clean current
  console

## Known limitations

- A complete real microphone run is still required. Browser automation cannot
  judge Finn's read-aloud naturalness.
- Only one executable passage exists, so the real campaign intentionally stops
  at the content-review gate after that unseen record. The full state route is
  objective-testable through wrapper-only diagnostics without creating a score.
- The production speech path remains Transformers.js `3.7.1`, timestamped
  Whisper base, WebAssembly/q8. First load is roughly 77 MB; WebGPU/q4 remains
  untrusted on the development computer.
- Post-secured Deck B replay is not implemented.
- ThreadIt and the other eight non-WikiWhy sites remain honest previews.

## Immediate next milestone

1. Build and test ThreadIt's four-unit Act I state and semantic source-tree
   browser consequence without borrowing WikiWhy's wipe, state, or content.
2. Publish an executable corrupted/untangle screen for designer review while
   keeping provisional forum fixture copy explicitly replaceable.
3. Promote content only after the documented provenance, review, comprehension,
   profile, and real-microphone gates.

Do not fake secured sites, score candidate prose, reuse WikiWhy as a ten-site
template, or start the final breach before enough real campaigns exist.

## Repository workflow

1. Start from synchronized `main`.
2. Use one scoped `agent/<description>` branch per task.
3. Keep implementation, tests, assets, and truth-changing docs together.
4. Merge only after checks pass.
5. Return local `main` to the merged, deployed state.

Preserve the historical mobile prototype and its branches as side-test
reference; do not resume mobile optimization unless the user reprioritizes it.
