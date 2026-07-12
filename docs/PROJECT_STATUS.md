# Project status

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Active implementation branch:** `agent/wikiwhy-campaign-foundation`
- **Repository:** `chinmay856/finn-reading-game`
- **Live prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployed main:** `270c63d` through PR #30
- **Deployment:** GitHub Pages through GitHub Actions, HTTPS enforced
- **Current stage:** Publish the real WikiWhy campaign foundation, then promote
  enough reviewed passages to make the complete route playable without fake
  repetition

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

## Current branch implementation

- Integrated the complete runtime design package through design tip `40f961e`.
- Upgraded real WikiWhy persistence to version 3 with safe v1/v2 migration,
  bounded all-session deduplication, completed passage IDs, explicit phases,
  one-time warning/rewrite events, Shield progress, secured state, and evidence
  ID. Malformed or blocked browser storage never interrupts a reading result.
- Real state now follows `act-one → reverse-hack → shield 0/3 → 1/3 → 2/3 →
  secured`. A jump that crosses both 70% and 80% emits the warning before the
  rewrite, and the Act I reading never also counts as Shield pass 1.
- Shield Protocol consumes exactly three accepted readings. Metrics still render
  plainly, but cannot add or remove Shield passes. A fourth/post-secured result
  is a no-op for campaign progress.
- Securing WikiWhy writes evidence ID
  `wikiwhy.active-write-after-command-end`, changes the hub to `1 OF 10
  SECURED`, fills Case File slot 1, displays the blocked AI write, and persists
  across reloads.
- The nested browser now has accessible phase overlays, a reduced-motion-safe
  right-to-left rewrite treatment, the exact three-item Shield checklist, a
  permanent evidence receipt, and production-sheet crops for Amy, Chinmay, and
  Techno story beats. The trusted desktop and Reading Companion stay stable.
- Campaign visuals rest on persisted campaign progress. Live transcript progress
  projects only toward the next possible campaign step instead of falsely
  repainting the whole site from 0 to 100 for every passage.
- Added a theme-neutral passage catalog and wrapper-owned Deck A/B ID lists.
  Candidate records are never selected. The UI shows an explicit content-review
  gate when no unseen executable passage remains.
- Hardened the current photosynthesis record with a reviewed revision link,
  modification notice, CC BY-SA 4.0 metadata, and visible source/license links
  outside the speech-scored text.
- Published executable warning, rewrite, Shield, and secured screenshots plus
  focused questions in [`design/DESIGN_REQUESTS.md`](design/DESIGN_REQUESTS.md)
  for the parallel designer.

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
  three Shield passes), while Deck A has ten. Design must explicitly approve
  one Deck B overflow or one repeat policy; content review remains independent.

## Design readiness

- The hub, WikiWhy, and nine other site boards plus their runtime briefs are the
  builder-ready design reference. They guide implementation but are not final
  runtime screenshots or speech content.
- Remaining contract questions are durable in
  [`design/DESIGN_REQUESTS.md`](design/DESIGN_REQUESTS.md): Incoming Case count,
  AI writer IDs, copy precedence, exact panel sequence, Shield Pass 2
  comprehension semantics, uncertain-reading continuation, evidence asset,
  replay location, site 2 order, and eleven-reading overflow.
- ThreadIt remains the recommended second-site portability proof unless the
  designer identifies a materially more complete MapGuess pack.

## Validation

- `npm run check` — passed
- `npm test` — 78 tests passed
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
- Post-secured Deck B replay is not designed or implemented.
- ThreadIt and the other eight non-WikiWhy sites remain honest previews.

## Immediate next milestone

1. Publish this branch, run CI, merge, deploy, and smoke-check live HTTPS.
2. Promote the lowest-risk WikiWhy candidates only after the documented content
   gate; begin with A02, A05, A07, A08, and A09.
3. Integrate the designer's answers and exact evidence asset when published.
4. Build ThreadIt's unique Act I source-tree browser consequence without
   borrowing WikiWhy's wipe, state, or content.

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
