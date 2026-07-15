# Session handoff

## 2026-07-14 authored cutscene continuity

- Working branch: `agent/site-visual-continuity`; the dirty primary checkout
  remains untouched. This continues draft PR #124.
- All nine post-WikiWhy sites now use authored entry, midpoint, and completion
  arrays instead of the fixed Amy then Chinmay template. Buttons name concrete
  game actions, speaker order varies by story, and the final midpoint click
  invokes the site's real Act II acknowledgement directly.
- Midpoint and completion sequences are non-dismissible so Escape cannot strand
  saved progress. Completion leaves the repaired site on screen for inspection
  instead of returning to the map before the payoff can be seen.
- Real 1280x720 browser playthroughs covered every midpoint and the complete
  FacePlace ending. Search-ish needed one additional diagnostic-panel render
  after acknowledgement; that regression was fixed and retested.
- Review captures: `threadit-cutscene-ten-accounts-v2.png`,
  `threadit-act2-source-trace-v2.png`, `faceplace-completion-cutscene-v2.png`,
  and `faceplace-repaired-feed-v2.png` under `docs/design/review/`.
- Validation passes: all 407 repository tests, syntax checks, the Vite
  production build, and `git diff --check`.
- Commit `c6e7593` is pushed to draft PR #124 and deployed to
  <https://finn-reading-game.web.app/>. Production smoke verification confirmed
  the live ThreadIt entry and `Untangle the thread` action from that build.
- The Reading Engine, speech recognition, scoring, microphone behavior, and
  passage selection were not changed.

## 2026-07-14 Reading Companion production integration

- Isolated publication branch: `agent/sherpa-live-hosting`, based on
  authoritative `origin/main` at `4f54c92`; the dirty primary checkout remains
  untouched.
- The production app now has a 20 ms / 16 kHz PCM tap, warmed sherpa adapter,
  dual-lane lifecycle, privacy-safe timing metadata, and an isolated-host
  default with `?streamingGuide=0` as its diagnostic opt-out. Whisper remains
  final scoring authority, and any streaming failure preserves the checkpoint
  guide and Continue path.
- The isolated build is deployed at <https://finn-reading-game.web.app/>.
  Firebase returns COOP, COEP, and CORP; real Chrome reports
  `crossOriginIsolated`, `SharedArrayBuffer`, and OPFS support. The non-isolated
  GitHub Pages build remains available as the Whisper-only fallback.
- The 190,951,044-byte Sherpa data package is downloaded once into versioned
  OPFS, size-validated, and supplied locally before Emscripten starts. A clean
  cold production run initialized Sherpa and stored the exact file. A separate
  warm run cleared the normal HTTP cache, reached ready in 4.8 seconds, and made
  zero `.data` requests; the game then reached the Recovery Map in 6.0 seconds
  without another data download. One warmed recognizer is reused across
  passages.
- The existing Whisper final-scoring model also cold-loaded successfully under
  production COEP, initialized through WASM in 100 seconds on the test
  connection, and completed a local inference call. Calling `load()` again on
  the same recognizer returned in 0 ms, confirming the intended one-load-per-app
  lifecycle used across passage attempts.
- The viewport policy from PR #115 is production-integrated independently of
  hosting: 18-pixel top anchor, natural ending clamp, full-target animation,
  immediate forward manual visual reconciliation, monotonic backward behavior,
  and reduced-motion fallback. Manual position never enters speech evidence or
  scoring.
- Handoff and remaining fixture, failure-path, and real-reader gates are documented in
  `docs/engine/READING_COMPANION_PRODUCTION_INTEGRATION_2026-07-14.md`.
- Validation passed: syntax checks, all 401 repository tests, the Sherpa asset
  checksum build, Vite production build, Firebase deploy, production header and
  cache audit, real Chrome cold/warm runtime checks, and rendered Recovery Map
  inspection. Temporary browser profiles, tabs, and servers are closed after
  final publication verification.

## 2026-07-13 player review checkpoint and next-thread handoff

- The player-review checkpoint is merged to `main` at `5b5613d` through PR
  #113 and is live at
  <https://chinmay856.github.io/finn-reading-game/?build=5b5613d>.
- Search-ish, Spotty-Fi, and MapGuess establish the locked illustrated-frame
  direction; Comic Sans-style site typography, compact ten-site layouts,
  site-specific candidate routing, clearer reading start, result overlays,
  progress labels, and the FacePlace AVOCADO beat are included.
- Validation passed: syntax checks, 342 tests, production build, and no document
  or nested-panel overflow across all ten initial sites at 1280x720.
- This is a test checkpoint, not the final review build. The complete prioritized
  player-feedback backlog and acceptance criteria are in
  `docs/PLAYTEST_REVIEW_HANDOFF_2026-07-13.md`. Start the next thread there and
  keep the P0 routing/state/progression regressions ahead of further art polish.

## 2026-07-13 Tomorrow playtest polish and speech evidence

- Working branch: `agent/tomorrow-playtest-polish`, created from authoritative
  `main` at `8d06fb2` in a clean worktree. The older dirty primary checkout was
  preserved untouched.
- Ten-site full-screen browser QA at 1440×900 now reports one Techno and no page
  or nested-panel scrollers on each initial site board. The candidate reading
  preview reports one active sentence, one site-correct stage, one Techno, and
  no horizontal or page overflow.
- The shared reader no longer hardcodes WikiWhy for ThreadIt through MapGuess.
  The visible unit is a complete sentence by default; authored line limits can
  still opt into bounded chunks where content explicitly requires them.
- Techno's state is mutually exclusive across page idle, reading ball-push,
  completion, alert-dialog, and sixty-second sleep states. No new sprite payload
  was added.
- The included LibriSpeech clip was replayed through the exact production
  Whisper worker at 154, 200, and accelerated 250 WPM. Metrics and the reusable
  benchmark page are documented in
  `docs/engine/WHISPER_FIXTURE_BENCHMARK_2026-07-13.md`.
- The measured 4.2–4.6 second rolling-window decode cost means checkpoint
  shortening would not create true low-latency highlighting. Keep Sherpa behind
  its hosting gate and keep Whisper as the final scoring lane.
- Pending external evidence remains honest: a consenting reader's natural
  180–220 WPM microphone run and independent review of all 85 candidates are
  still required for production approval.

## 2026-07-12 Evidence-driven Reading Companion app integration

- Integration branch: `agent/reading-companion-app-integration`, reconciled with
  ten-site main through MapGuess PR #108 (`80682ba`).
- The active app now uses `KnownTextLineGuide` with stable display lines derived
  before microphone capture. Checkpoint transcript evidence is accumulated only
  in memory for the current attempt and drives a monotonic centered line.
- Existing local Whisper checkpoints and final scoring are unchanged; Game
  Rules still receive only the final theme-neutral reading result.
- The streaming recognizer contract, spike, ADR, licensed fixture, and benchmark
  evidence are present. Sherpa remains behind its hosting gate and is not loaded
  by the production app on GitHub Pages.
- Validation completed: `npm run check`, 339 tests, `npm run build`, and desktop
  browser inspection of the reading screen. A natural consenting-reader run at
  180–220 WPM remains required before declaring streaming UX complete.

## 2026-07-12 MapGuess candidate playthrough

- Follow-up browser QA found that a persisted MapGuess campaign could exhaust
  or secure the state used to derive the playtest button, leaving a click on
  `Playtest candidate passage` on the MapGuess screen. The playtest now owns a
  fresh tab-only state separate from canonical persisted MapGuess progress, and
  the button-to-handler-to-setup route has an explicit source contract test.
- Added the explicit playtest selector and Reading Companion route for all
  eight MapGuess first-run candidates while production selection remains
  fail-closed.
- Froze A01's cited NOAA page to its visible 2026-06-22 update, verified
  2026-07-12, so provenance is concrete without changing any pending content
  review status.
- Reading results drive the existing exact 5+3 campaign; Moving Target
  acknowledgement and the four valid route goals remain wrapper-owned
  interactions outside speech scoring.
- All playtest progress and slot-ten evidence remain tab-only. No canonical
  evidence, finale gate, external map service, or Reading Engine behavior
  changed.
- After merging authoritative `main` at `33b8cdb`, `npm run check`, all 329
  tests, and `npm run build` pass together with the Search-ish, Amaze-On, and
  Spotty-Fi playtest lanes. The local MapGuess launch route returns HTTP 200.
- Final production-bundle browser QA found the playtest button could sit beneath
  the fixed taskbar at a 712px-high desktop viewport. The compact-height layout
  now keeps both MapGuess actions visibly inside the companion window. Browser
  recheck confirmed the primary button opens `A Map Is Not a Photograph` in the
  shared setup screen and the page has no horizontal overflow.

## 2026-07-12 Amaze-On candidate playthrough

- Added the explicit playtest selector and Reading Companion route for all seven
  Amaze-On Deck A candidates while production selection remains fail-closed.
- Reading results drive the existing 4+3 sort/consent campaign; Negative
  Purchasing acknowledgement and the receipt trace remain wrapper-owned.
- All playtest progress and slot-eight evidence remain tab-only and cannot
  satisfy canonical or finale gates. Reading Engine internals were not changed.

## 2026-07-12 ViewTube candidate playthrough

- Added the explicit playtest selector and Reading Companion route for all seven
  ViewTube Deck A candidates while production selection remains fail-closed.
- Reading results drive the existing 4+3 silent-media campaign; saved autoplay
  acknowledgement remains a wrapper-owned interaction.
- All progress and slot-six evidence remain tab-only. No audio, video, iframe,
  canonical evidence, finale gate, or Reading Engine behavior changed.

## 2026-07-12 Reading Companion integration kit

- Branch: `agent/reading-companion-integration-kit`
- Deliverable: `docs/engine/READING_COMPANION_INTEGRATION_HANDOFF.md`
- Reusable code: `reading-companion/known-text-line-guide.js` and
  `reading-companion/live-reading-companion.js`
- Evidence: `prototypes/reading-companion/` and
  `docs/engine/READING_COMPANION_PROGRESS_SPIKE.md`
- Decision: live streaming line guidance and final Whisper assessment are
  independent local lanes; see `docs/decisions/0004-dual-lane-reading-companion.md`.
- Integration boundary: content/view owns authored lines; engine emits neutral
  guide indexes; wrapper owns centered highlighting; Game Rules only consume
  the final reading result.
- Production code was not edited. The integrating agent should follow the exact
  seven-step sequence and acceptance gate in the handoff document.

## 2026-07-12 Search-ish candidate playthrough

- Added the explicit playtest selector and Reading Companion route for all seven
  Search-ish Deck A candidates while production selection remains fail-closed.
- Reading results drive the existing 4+3 origin/branch campaign; Five Costumes
  acknowledgement and the semantic source inspector remain wrapper-owned
  interactions.
- All playtest progress and slot-seven evidence remain tab-only and cannot
  satisfy canonical or finale gates. The separate reading-engine agent retains
  speech/alignment ownership.
- `npm run check`, all 323 tests, and `npm run build` pass. The local Vite route
  returned HTTP 200; visual browser automation was unavailable in this task's
  runtime, so desktop visual inspection remains the publication gate.

## 2026-07-12 Yahuh candidate playthrough

- Added the explicit playtest selector and Reading Companion route for all six
  Yahuh Deck A candidates while production selection remains fail-closed.
- Reading results drive the existing 3+3 sort/reconnect campaign; Single Source
  acknowledgement and the switchboard remain wrapper-owned interactions.
- All playtest progress and slot-five evidence remain tab-only and cannot
  satisfy canonical or finale gates. The separate reading-engine agent retains
  speech/alignment ownership.

## 2026-07-12 MyCorner candidate playthrough

- Added the explicit playtest selector and Reading Companion route for all seven
  MyCorner Deck A candidates while production selection remains fail-closed.
- Reading results drive the existing 4+3 owner-control campaign; Apply to
  Everyone acknowledgement and comparison remain wrapper-owned interactions.
- All playtest progress and slot-four evidence remain tab-only and cannot
  satisfy canonical or finale gates. The separate reading-engine agent retains
  speech/alignment ownership.

## 2026-07-12 FacePlace candidate playthrough

- Added the explicit playtest selector and Reading Companion route for all six
  FacePlace Deck A candidates while production selection remains fail-closed.
- Bound A01 to the official Project Gutenberg 1342 HTML artifact and its RDF
  modified timestamp (`2026-02-10T12:53:56.255684Z`), replacing the placeholder
  source-revision freeze without claiming editorial or microphone approval.
- Playtest progress, Honest Zero acknowledgement, and feed-mode changes remain
  tab-only. They cannot create persisted canonical evidence or satisfy finale
  gates. The separate reading-engine agent retains speech/alignment ownership.

## 2026-07-12 ThreadIt candidate playtest selector

- Added an explicit wrapper-level `playtest` option to
  `selectNextThreadItPassage`; normal production calls still use the approved
  selector and fail closed.
- Playtest results remain candidate-only, review-pending, unseen-first, and
  noncanonical. No passage availability, review evidence, microphone claim, or
  finale eligibility is changed.
- Connected the projection to the existing Reading Companion and ThreadIt state
  transition. Candidate playtest progress is deliberately tab-only so a full
  structural playthrough cannot manufacture persisted canonical evidence.
- Browser QA at 1440×900 confirmed the ThreadIt gate, explicit playtest warning,
  A01 title/source metadata, local-processing notice, and setup-screen route.
  The separate reading-engine agent retains ownership of speech/alignment
  changes.

## 2026-07-12 ViewTube and Amaze-On compact boards

- Restored ViewTube's intended desktop grid instead of the later scrolling-block
  override and compressed player/card/timeline chrome.
- Compacted Amaze-On listing, parcels, bins, receipt, and progress strip.
- At 1440×900 ViewTube is 706/706 and Amaze-On is 700/700 client/scroll
  pixels; both right-side companions fit without changing their type scale.

## 2026-07-12 MapGuess illustrated board

- Generated a fictional summer cartography layer from the canonical MapGuess
  board direction and optimized it to a 214 KB WebP.
- Integrated it only in the wrapper presentation layer. Semantic tile state,
  SVG routes, destinations, landmarks, controls, and accessibility remain live.
- Browser inspection at 1440×900 confirms the overall MapGuess page fits with
  the full Reading Companion; secondary detail rails scroll independently.

## 2026-07-12 Spotty-Fi identity and compact board

- Strengthened the wrapper-owned SVG mark with a large acid-green music note
  while retaining the original cassette/tuning identity.
- Compacted Spotty-Fi into a fixed desktop board at 1440×900; browser inspection
  reports `scrollHeight === clientHeight` with all five tracks and queue entries
  visible alongside the full Reading Companion.

## 2026-07-12 compact desktop and Search-ish artwork

- Added a shared desktop affordance contract: real enabled controls receive a
  cyan action halo, the primary next action pulses, disabled controls dim, and
  reduced-motion users receive a static treatment.
- Demoted the left shortcut rail visually without removing its Easter eggs.
- Recolored Search-ish away from Google-like primaries and integrated a
  board-derived source-network illustration as a 164 KB lazy WebP.
- At 1440×900 the Search-ish page reports `scrollHeight === clientHeight`, shows
  all four result cards, and keeps the full Reading Companion visible.

## 2026-07-12 Yahuh structured first-run deck

- Encoded frozen manuscripts A02–A06 and catalogued the full six-record Deck A.
- Corrected readiness from one structured candidate and six missing manuscripts
  to six structured candidates and no manuscript shortfall.
- All records remain fail-closed pending external evidence.

## 2026-07-12 builder-owned design continuation

- The parallel designer is paused after completing their available work.
- Remaining visual, copy, interaction, asset, and art-direction decisions now
  belong to the builder and should be resolved against the canonical design
  library instead of waiting for another design PR.
- Former design-request packets remain useful as acceptance checklists and are
  relabeled builder-owned follow-ups. Independent editorial review and real
  microphone testing remain separate evidence gates.

## 2026-07-12 MyCorner structured first-run deck

- Encoded frozen manuscripts A02–A07 as six theme-neutral candidate records.
- Reconciled readiness metadata from one structured candidate and a seven-item
  shortfall to seven structured candidates and no manuscript shortfall.
- The complete roster remains fail-closed; the designer request covers exact
  content fidelity and editorial risks, while microphone evidence stays separate.

## 2026-07-12 FacePlace structured first-run deck

- Encoded frozen manuscripts A02–A06 as five theme-neutral candidate records
  with exact prose, prompts, choices, original-work rights metadata, reading
  profiles, and explicit pending review fields.
- Moved `why-this-appeared-a06` into the first-run Deck A position frozen by the
  manuscript packet, changing the stale `5A + 5B` runtime plan to `6A + 4B` and
  removing the reported shortfall.
- All six records remain unselectable. A focused revision-bound review request
  is published for the parallel designer; microphone evidence remains separate.

## 2026-07-12 ThreadIt structured first-run deck

- Encoded frozen manuscripts A02–A07 as six theme-neutral candidate passage
  records with exact prose, prompts, choices, original-work rights metadata,
  reading profiles, and explicit pending review fields.
- Corrected ThreadIt's wrapper-owned deck plan from the stale `5A + 5B` list to
  the manuscript packet's frozen `7A + 3B` contract.
- All seven first-run records remain unselectable; no human review or microphone
  evidence was fabricated. The parallel designer request now asks for a
  revision-bound content review and focused feedback-copy decisions.

## 2026-07-12 ThreadIt visual fidelity

- ThreadIt now more closely matches the canonical three-act board through orange identity framing, an Act 1 ribbon, deeper ranked-post cards, bot-copy labels, a gridded source canvas, animated trace connectors, and stronger question/generated/independent visual states.
- The source tree remains semantic DOM plus inline SVG; no flattened board or new bitmap asset was added. Reduced motion disables connector flow and card movement.

## 2026-07-12 shared desktop and finale fidelity

- Added subtle shared CRT scanlines, signal sweep, and window-title depth without changing semantic layout or pointer behavior.
- Finale now uses the canonical Amy evidence portrait, Chinmay fluster portrait, containment route, evidence vault, live-file animation, contextual dialogue, and persistent Techno companion.
- All new finale graphics reuse assets already present in the production bundle. Reduced motion disables the signal sweep and evidence-file float.

## 2026-07-12 visual-fidelity and persistent-Techno pass

- Recovery Map now uses all ten production marks, richer network-depth CSS, stronger card focus/hover treatment, a visual evidence-vault watermark, and the existing optimized concept-board crops.
- Techno is a persistent animated desktop pet on every screen. Context changes her scale/status; reduced motion automatically swaps to the existing still asset and disables roaming.
- Runtime cost is approximately 118.87 kB for the loop plus 20.06 kB for its still fallback; no large concept board became a runtime background.
- Published a concrete compact-motion-pack request in `docs/design/DESIGN_REQUESTS.md` for the parallel designer.

## 2026-07-12 deployment runtime hygiene

- Split the production bundle along the existing Content Platform and Internet Recovery wrapper boundaries. The former 506.59 kB main chunk is now approximately 190.75 kB, with separate 51.34 kB content and 268.58 kB wrapper chunks; the Vite oversize warning is gone.
- Updated checkout and Node setup actions from v4 to v6, whose official releases use the Node 24 action runtime. The workflows continue to run the repository itself on Node 24.
- GitHub's current major tags for several Pages-specific composite/deploy actions may still emit upstream Node-runtime annotations; do not replace those actions with an unreviewed custom upload path.

## 2026-07-12 revision-bound review manifests

- Each final-incident passage now owns a stable `contentRevision`, and the validator compares submitted evidence directly to that canonical revision.
- `content/review-records/endgame.json` contains one honest pending manifest per passage. `npm run review:status` reports every missing review, microphone run, and token resolution without changing approval state.
- Current truth is 0/3 approved. Reviewers can now publish durable evidence without editing passage or wrapper code.

## 2026-07-12 passage review evidence gate

- Added a theme-neutral evidence validator for accessibility, comprehension, editorial, factual, grade, profile, rights, sensitivity, transcription, exact content revision, and real-microphone runs.
- Reviewers cannot equal the declared author; every pass requires an evidence reference and timestamp. Audio must remain local and unretained, and every declared unstable token needs an evidenced resolution.
- Only a complete record can create an approved selectable projection. Candidate source records are never mutated, and automated tests do not count as human or microphone approval.

## 2026-07-12 final-incident Content Platform records

- The three frozen PR #46 passages now exist as exact 218-, 236-, and 239-word Content Platform records with stable IDs, original-work rights metadata, comprehension choices, reading profiles, and transcription-risk tokens.
- They are catalogued but remain `candidate` and unselectable. The endgame selector requests only the next one-to-one unseen checkpoint and never skips or repeats.
- Approval still requires independent editorial, grade, sensitivity, comprehension, accessibility, rights-record, transcription-profile, and real-microphone review. No wrapper or Reading Engine exception was added.

## 2026-07-12 `EVIDENCE_11.LIVE` implementation

- Imported the frozen endgame runtime contract from designer PR #46.
- Added a theme-owned v1 finale state machine with ten-canonical-site gating, one-time evidence discovery, durable write/read/delete probing, ordered checkpoint saves, separate revocation persistence, and fail-closed normalization.
- Added responsive semantic arrival, safety-gate, containment, revocation, and restored screens using the approved wrapper assets.
- The three original checkpoint passages remain review-locked. Production cannot use the visual-preview checkpoint control and therefore cannot manufacture the canonical ending without approved readings.
- No additional portrait or Techno request is outstanding; PR #46 maps all required character states to existing production assets.

## 2026-07-12 canonical receipt integrity follow-up

- The Recovery Map now counts FacePlace slot 3 only when the exact canonical blocked-boost receipt is present in persisted v2 state.
- MapGuess slot 10 additionally requires the exact blocked destination-write receipt plus a persisted, locked player route goal.
- Diagnostic and tab-only states remain visible for testing but cannot satisfy canonical completion or unlock the finale.

## Canonical evidence reconciliation

- Active branch: `agent/canonical-evidence-reconciliation`.
- Imported the frozen FacePlace registry response from PR #37 and MapGuess
  response from PR #44.
- FacePlace slot 3 and MapGuess slot 10 now use exact canonical IDs, filenames,
  writer fingerprints, process routes, blocked actors, and blocked targets.
- Both state stores move to v2 keys. Old v1 structural/test saves fail closed
  and cannot be reclassified as canonical evidence.
- Diagnostic secured views remain test mode; only exact persisted v2 secured
  states can contribute to the ten-site canonical evidence predicate.

## Spotty-Fi listener-control foundation

- Active branch: `agent/spottyfi-history-proof-foundation`.
- Integrated designer PR #43's canonical silent library; the complete A01-A08
  manuscript roster is already on `main`.
- Spotty-Fi restores five disclosure proofs, saves the pre-account predicted
  history midpoint, and verifies three listener-control units. Its authored
  five-track queue is silent and contains no audio, lyrics, or real artists.
- Canonical persisted evidence is reserved for Case File slot 9 as
  `SPOTTYFI_PREDICTED_HISTORY_LOOP.REC`. Techno guards the manual queue while
  the unrequested predicted insert remains blocked.

## Amaze-On consent-ledger foundation

- Active branch: `agent/amazeon-consent-ledger-foundation`.
- Integrated designer PR #42's canonical fictional commerce fixture; the full
  A01-A07 manuscript roster is already on `main` from PR #53.
- Amaze-On now sorts four evidence parcels, saves Negative Purchasing before
  acknowledgement, restores a three-unit receipt trace, removes AUTO-DECIDE,
  and permanently requires human confirmation.
- The Orbit Bounce Ball remains `SUGGESTED — NOT CHOSEN`; the canonical Techno
  ball-pin asset marks the blocked purchase without creating a transaction.
- Canonical persisted evidence is reserved for Case File slot 8 as
  `AMAZEON_AUTO_DECIDE_PERMISSION.REC`. No real retailer, product, payment,
  address, account, or checkout data exists.

## Complete manuscript inventory

- Branch: `agent/content-readiness-index`.
- Durable audit:
  [`design/CONTENT_READINESS_INDEX_2026-07-12.md`](design/CONTENT_READINESS_INDEX_2026-07-12.md).
- Every first-run site arc and the final breach has a complete manuscript roster.
  Runtime encoding and independent review/microphone gates remain outstanding.

## Search-ish origin-proof foundation

- Active branch: `agent/searchish-origin-proof-foundation`.
- Integrated designer PR #41's canonical Search-ish runtime response and PR
  #51's complete A01-A07 first-run manuscript roster.
- Search-ish now renders four apparent result cards, preserves the generated
  answer, restores four exact origin-label units, saves the Five Costumes
  midpoint before acknowledgement, and opens three semantic source branches.
- The responsive Source branch inspector is Recovery Browser-owned, supports
  focus transfer and Escape/close return, and never overlaps the Reading
  Companion. Content remains fail-closed with MIC OFF and no reading score.
- Canonical persisted evidence is reserved for Case File slot 7 as
  `SEARCHISH_GENERATED_CACHE_REDIRECT.REC`.
- Designer commit `47c25bf` resolves the Techno asset: canonical wrapper ID
  `searchish.techno.generated-cache-alert` maps to the paw-alert still.

## ViewTube evidence-track foundation

- Active branch: `agent/viewtube-evidence-track-foundation`.
- Integrated designer PR #40's canonical silent-video runtime contract and PR
  #49's first-run manuscripts without touching stashes or `worktrees/`.
- ViewTube now has a seven-unit structural runtime: four recording-context
  restores, an explicit autoplay-loop acknowledgement, and three independently
  verified evidence tracks. The runtime is silent, keeps the microphone off,
  and cannot create a reading score while its manuscripts remain review-gated.
- Canonical persisted evidence is reserved for Case File slot 6 as
  `VIEWTUBE_DUPLICATE_MEDIA_HASHES.REC`; diagnostic state is still labeled test.
- `npm run check`, all 268 tests, and `npm run build` pass locally.
- ViewTube's former `techno_clue_point` dependency is resolved by designer PR
  #40: `viewtube.techno.secured-ball-pin` maps to the approved Techno
  alert-ball-pin still.

## Yahuh channel-reconnect foundation

- Deployed `main` is authoritative at `76e6f05` through MyCorner PR #45 and
  live-copy fix PR #47. Both CI and Pages passed; the public corrupted and
  secured MyCorner routes were verified without console errors.
- Active implementation is `agent/yahuh-channel-reconnect-foundation`.
- Designer PR #39 is reconciled into the exact six-module fixture, 6A plus 4B
  plan, process lineage, responsive drawer, Techno payoff, blocked retry, and
  canonical slot-five evidence contract.
- Yahuh remains content-gated: one structured candidate, zero selectable
  passages, six reviewed readings required, `MIC: OFF`, and no score.
- Focused Yahuh, DOM, and hub validation passes 58 tests. Remaining work is
  full-suite validation, scope review, PR/CI/merge, Pages deploy, and HTTPS QA.

## MyCorner owner-controls foundation

- Deployed `main` is authoritative at `65368e8` through MapGuess PR #36. The
  MapGuess Moving Target route, CI, Pages workflow, and public HTTPS interaction
  were verified.
- Active implementation is `agent/mycorner-owner-controls-foundation`.
- Designer PR #38 has been inspected and its canonical response is preserved in
  `docs/design/MYCORNER_RUNTIME_RESPONSE_2026-07-12.md`. The runtime now uses
  the exact Mara Vale fixture, process lineage, slot-four evidence route, and
  frozen 7A plus 3B passage-ID plan.
- MyCorner owns four exact profile restore units, an explicit saved Apply to
  Everyone acknowledgement, and three owner-lock units. It preserves six saved
  choices plus a separate permission seal and never exposes a percentage.
- All reading content remains fail-closed: one structured candidate, zero
  selectable records, `MIC: OFF`, and no score. The wrapper fixture may be
  canonical without promoting unreviewed reading content.
- The canonical evidence row is registered only for a persisted seven-reading
  secured state with exact ID `mycorner.evidence.global-profile-template-01`.
  Diagnostics and failed-storage tab states remain noncanonical.
- Focused MyCorner, DOM, and hub validation passes 58 tests. Remaining work is
  complete documentation reconciliation, full-suite validation, explicit diff
  review, PR/CI/merge, Pages deployment, and public HTTPS QA.

The MapGuess section below is retained as milestone history. Its publication-
pending language is superseded by PR #36 and deployed `65368e8`.

## MapGuess moving-target foundation

- Deployed `main` is authoritative at `e776471` through FacePlace PR #34 and
  spoken-separator accessibility PR #35. Both workflows and GitHub Pages passed,
  and the FacePlace diagnostic route was verified on the public HTTPS build.
- Active implementation continues on
  `agent/mapguess-moving-target-foundation`. MapGuess's structural runtime is
  implemented and under final validation; it has not been committed, pushed,
  merged, deployed, or verified on the public site yet.
- The wrapper owns an eight-unit MapGuess campaign: exactly five rebuild units,
  an explicit moving-target acknowledgement, and exactly three anchor units.
  The fifth save reveals the coordinate overwrite; anchor work cannot begin
  until Finn acknowledges it.
- The fictional fixture keeps road geometry stable while `ROUTE AUTO-FIX AI`
  moves the destination from the intended location to a sponsored stop. The
  midpoint proof reads `ROAD GEOMETRY CHANGED: NO`, `DESTINATION COORDINATES
  CHANGED: YES`, and `ETA TARGET: 2 MINUTES FOREVER`.
- Before anchor unit eight, Finn must explicitly choose one valid route goal:
  fastest, safest, scenic, or accessible. That wrapper-owned choice is not
  speech or comprehension scoring, remains changeable until the last unit
  begins, and is locked when the route becomes secured.
- The final diagnostic route produces a provisional slot-10 test receipt and
  blocked-write record. It may be displayed for structural QA, but it is
  excluded from canonical evidence counts and cannot satisfy the ten-site
  final-unlock predicate.
- The independent Reading Companion reports `10 planned / 0 selectable / 8
  required`. `A Map Is Not a Photograph` is a structured candidate only; it is
  unavailable and cannot be selected, scored, or silently repeated.
- The current branch includes the campaign rules and persistence, content/copy
  fixture, semantic map view, responsive right-side inspector drawer, Recovery
  Map integration, diagnostic routes, and automated contracts. Reading Engine,
  theme-neutral Game Rules, speech, and real session history remain unchanged.
  The shared Content Platform gate now explicitly requires accessibility review
  before approved content can become selectable.
- Validation known so far: `npm run check`, 43 focused MapGuess state/content/view
  tests, the full 193-test suite, and `npm run build` pass. The runtime has been
  visually inspected at 1440px and 1180px, including the collapsed inspector
  drawer. Remaining work is final diff review, commit and push, PR and CI,
  merge, Pages deploy, and public HTTPS verification.

## FacePlace Honest Zero foundation (deployed)

- FacePlace is authoritative on deployed `main` at `e776471` through PRs #34
  and #35. GitHub Actions and GitHub Pages passed, and its corrupted, Honest
  Zero, recovery, secured, evidence-open, and Recovery Map return states were
  verified on the public HTTPS build.
- FacePlace remains an honest structural test build and non-playable with
  `MIC: OFF` while all first-run content is review-gated. WikiWhy remains the
  only speech-playable site.
- The wrapper owns a six-unit FacePlace model: exactly three false-tracker
  repairs, an explicit Honest Zero acknowledgement, and exactly three later
  honest-recovery units. Unit four stays blocked until the acknowledgement;
  Honest Zero remains the saved baseline while later percentages report only
  the three honest recovery checks.
- The executable, fictional six-card fixture includes relationship clusters,
  ranked and chronological feed order, recommendation reasons, a duplicate
  source group, `People You May Sort Of Know`, feed-order controls, a Why panel,
  and one exact provisional card targeted by the final blocked boost.
- The false tracker moves through the approved three-result shape and keeps a
  separate list of saved repairs. The midpoint names zero as the honest answer
  instead of turning another arbitrary number into progress.
- The secured diagnostic route exposes a provisional blocked-write record and a
  slot-3 test receipt. That receipt is explicitly noncanonical: it can appear in
  diagnostics but is excluded from canonical Case File counts and can never
  satisfy the ten-site final-unlock predicate.
- The independent Reading Companion reports `10 planned / 0 selectable / 6
  required`. `A Second Reading` is a structured candidate only; no sampler or
  candidate text can be selected, speech-scored, or silently repeated.
- The current people, posts, source graph, process IDs, evidence ID/filename,
  writer/route, and blocked actor/target are deliberately replaceable
  provisional fields. The focused designer request is
  `docs/design/FACEPLACE_RUNTIME_REQUEST.md`; no state-machine or layout rewrite
  is required when canonical data arrives.
- The current state/view/hub tests preserve the distinction among displayed
  test evidence, tab-only diagnostics, persisted noncanonical records, and real
  canonical receipts. Reading Engine, Content Platform review rules,
  theme-neutral Game Rules, speech, and real session history remain unchanged.
- Publication validation passed for FacePlace, including `npm run check`, the
  full test suite, `npm run build`, deterministic state/view/DOM routes, PR CI,
  Pages deployment, and public HTTPS QA. The remaining FacePlace work is to
  replace the provisional fixture when design answers arrive and clear the
  six-record content gate.

## Recovery Map and multi-site preview shell

- Integrated the latest rogue-AI campaign/design branch with the current live
  mechanics work. The AI service now owns autonomous overwrites; Chinmay remains
  the sincere, overconfident developer whose command has stopped while the
  service keeps writing.
- Added a real initial Recovery Map inside the stable Internet Recovery 98
  desktop. It shows all ten sites, exactly three Incoming Cases, a separate
  ten-slot Case File, Amy Support, persistent taskbar/status chrome, and a
  restrained shortcut rail with Recovery Browser, Finn's Files, a fictional
  `RECOVERED_A:` disk, `notes.txt`, and Recycle Byte.
- WikiWhy remains the only playable site. The other nine entries open honest
  design-preview windows with a separate inactive Reading Companion; they do
  not borrow WikiWhy's passage, microphone flow, scoring, or campaign rules.
- The site catalog and navigation live entirely under the Internet Recovery
  wrapper. No site identity, desktop object, character, or campaign concept was
  added to Reading Engine, Content Platform, or theme-neutral Game Rules.
- The live preview artwork uses optimized 640×480 JPEG crops taken directly
  from the canonical builder-ready rogue-AI boards. The five crops affected by
  the last art cleanup were regenerated from the promoted MyCorner, Search-ish,
  Amaze-On, Spotty-Fi, and MapGuess sources; superseded boards are not shipped.
- Production Amy and Chinmay sheet panels are now cropped into four lightweight
  wrapper-owned runtime portraits and mapped to story beats. The full sheets
  remain the character source of truth; lower-layer interfaces are unchanged.
- Corrected Techno's repair interaction: the existing progress-push frames are
  mirrored to face right, the ball is aligned to the repair edge, diagnostic
  advances now play the push, and objective resets snap back without making her
  walk the repair backward. Reduced-motion mode stays on the mirrored still.
- Updated the 80% interruption and secured-site copy so the VibeShift AI service
  owns the continuing write. Removed `CHINMAY WAS HERE` and `chinmay_admin`
  sabotage framing.
- Validation on the implementation branch: `npm run check`, `npm test` (58
  passing), `npm run build`, an automated click-through of all nine view-only
  previews, WikiWhy setup/re-entry and diagnostic dialogue checks, production
  portrait screenshots, Techno direction review, and a clean browser console.
- Published implementation screenshots and focused requests for the parallel
  designer under `docs/design/`; future design answers should update that
  handoff and its synchronization commit instead of relying on chat history.
- Recommended next step after publication: finish WikiWhy as the first complete
  real campaign by selecting unseen approved passages and connecting accepted
  readings to the warning, 80% rewrite, exact three-pass shield, secured site,
  and first Case File evidence record. Keep other sites as previews until their
  own content and mechanics pass the implementation gate.

## Rogue-AI campaign design track

- Latest design-only builder aid:
  `docs/gameplay/RUNTIME_UI_NOTES_FOR_BUILDERS.md` translates the reviewed art,
  copy deck, WikiWhy flow, hub, character sheets, and accessibility rules into
  concrete runtime UI notes. It is explicitly not an implementation change and
  keeps all wrapper-specific material out of Reading Engine, speech, scoring,
  and Content Platform logic.
- Latest site-copy aid:
  `docs/gameplay/SITE_RUNTIME_COPY_PACKS.md` gives the builder concrete
  corrupted/repaired page copy, midpoint copy, AI-denial text, secured payoffs,
  and character beats for all ten sites. Other sites remain design/previews
  until their own passages and mechanics are implemented.
- Latest WikiWhy build aid:
  `docs/gameplay/WIKIWHY_FIRST_SLICE_BUILD_BRIEF.md` narrows the immediate
  builder target to the WikiWhy playable slice with screen/state copy,
  ownership boundaries, character panel IDs, loading/error copy, and acceptance
  checks.
- Latest ten-site build aid:
  `docs/gameplay/site-build-briefs/README.md` indexes builder-facing briefs for
  all ten Internet Recovery 98 sites. Each site brief records runtime identity,
  layout, local three-act flow, progress fiction, character states, reading
  lane, and acceptance checks without implementing code.
- Latest campaign hub aid:
  `docs/gameplay/CAMPAIGN_HUB_RUNTIME_BRIEF.md` gives concrete Recovery Map
  copy, site tile text, evidence-file receipts, blocked-write labels, Incoming
  Case rotation guidance, and count-based global story beats for the ten-site
  campaign.
- Latest content-planning aid:
  `content/proposed-sites/PASSAGE_DECK_PLANS.md` outlines two-deck
  replayability targets for all ten sites: WikiWhy uses its existing Deck A/B,
  and the other nine sites now have ten candidate Reading Companion passage
  slots each with source lane, reading focus, and speech-risk notes.
- Latest asset-use aid:
  `docs/gameplay/RUNTIME_ASSET_USE_BRIEF.md` identifies canonical character
  sheets, character crop grids, current ten-site concept boards, preview-image
  rules, and superseded/plain-board boundaries for builders.
- Canon now separates intent from consequence: Chinmay irresponsibly rushed a
  powerful AI into deployment but sincerely believes his automated fixes will
  help. The AI becomes the actual antagonist when it keeps rewriting systems
  beyond his commands. Finn owns the decisive final action and revokes the AI
  service's recovery access.
- Chinmay is always long-haired. His visual state progresses from neat,
  overconfident polish to increasingly messy, frazzled, and flustered concern;
  he is never angry at Finn, threatening, or villain-coded.
- The campaign hub, WikiWhy worked example, and nine non-WikiWhy generated
  boards remain story/composition references. Production state contracts,
  exact copy IDs, responsive/accessibility rules, and original marks are now
  frozen in gameplay briefs and site-asset manifests. Passage acceptance and
  runtime implementation remain build/content work.
- The prior inconsistent MyCorner, Search-ish, Amaze-On, Spotty-Fi, and
  MapGuess boards now carry `-superseded` filenames and are comparison history
  only. The current storyboard filenames are indexed in
  `apps/internet-recovery/art/concepts/sites/README.md`; do not use any board as
  a runtime background or final identity asset.
- Production character sheets now live under
  `apps/internet-recovery/art/characters/`. Builders choose Amy, Chinmay, and
  Techno states by wrapper story mood instead of regenerating character art per
  message. `Chinmay` is the only canonical spelling; alternate transcriptions
  never enter assets, copy, or filenames.
- Current revised boards carry the `rogue-ai` filename; the earlier unsuffixed
  boards remain only as superseded layout-history references. Generation
  provenance and the final shared prompt direction are recorded in
  `apps/internet-recovery/art/concepts/ROGUE_AI_PROMPT_NOTES.md`.
- Private photos guide likeness only: never paste one into a board or use a
  photoreal character panel. Amy, Chinmay, and Techno share one consistent
  illustrated editorial-cartoon treatment. Techno remains ball-obsessed;
  long-haired Chinmay becomes progressively messier and more frazzled without
  angry or villain coding.
- These are wrapper design inputs. Each site still owns its own three-act story,
  middle change, progress fiction, reading lane, and resolution; the reusable
  Reading Engine does not know about Chinmay, the AI, the desktop shell, or any
  site mechanic.

## WikiWhy campaign diagnostic and character dialogue pass

- Added a small `TEST` control above the recovery taskbar. It can simulate a
  strong passage result without requesting microphone access, running speech
  recognition, creating a reading score, or changing saved real-repair state.
- Diagnostic campaign state uses its own
  `internet-recovery-98.wikiwhy.diagnostics.v1` browser-storage key. Its reset
  button removes only diagnostic progress.
- The deterministic Act I route advances `0 → 19 → 38 → 57 → 76 → 80%`, which
  makes the documented Amy warning and 80% reverse-hack boundary reachable in
  five clicks. The live overwrite explicitly changes the cumulative browser
  meter from `SITE STABILITY 80%` to `SHIELD STABILIZATION 0%`.
- Shield Protocol then advances in exactly three simulated passages at
  `33 → 66 → 100%`, ending with the documented hidden-admin `ACCESS DENIED`
  beat. The diagnostic panel always labels these as simulated passages because
  the current executable prototype still contains one real Content Platform
  passage.
- Added lightweight Windows-style Amy and Chinmay dialogue overlays. The two
  wrapper-owned static portraits follow the approved character/campaign boards;
  Techno's separately produced progress-push sprite is unchanged and no other
  Techno states are loaded.
- Only the nested WikiWhy page receives the short reverse-hack effect. The
  recovery desktop, taskbar, Reading Companion, Amy channel, and diagnostic
  controls remain stable, preserving the wrapper's trusted-shell rule.
- Architecture remains separated: the harness, campaign state, dialogue copy,
  and portraits live under `apps/internet-recovery/`; Reading Engine, Content
  Platform, theme-neutral Game Rules, speech, and real session history are
  unchanged.
- Published through merged PR #27 at
  <https://chinmay856.github.io/finn-reading-game/>. Validation: `npm run check`,
  `npm test` (53 passing), `npm run build`, and a live HTTPS smoke check all
  pass. Recommended next step: click through the full diagnostic route once to
  judge dialogue size, story timing, and whether the 80% reset is visually
  understandable before connecting additional real passages.

## WikiWhy visual-fidelity pass

- Compared the live prototype directly with the reviewed WikiWhy reader/repair
  board, parody-site states, Amy/Techno character board, and recovery-hub board.
- Added an original production WikiWhy globe mark and buttered-toast evidence
  image under the wrapper-owned `art/site-assets/` directory, with prompt and
  provenance notes. They do not enter Content Platform, Reading Engine, or Game
  Rules data.
- Brought the live page closer to the approved boards with a real WikiWhy
  masthead, search/account chrome, explicit corrupted/repaired integrity labels,
  stronger Windows-style title bars and taskbar, a white encyclopedia page,
  tighter typography, a clearer repair edge, and a subtle optional CRT texture.
- Preserved the large-site / narrow-reader layout, continuous reading behavior,
  progress wipe, optional comprehension, privacy boundary, and persistent
  stability consequence unchanged.
- The separately produced Techno library is now present. This branch will wire
  only the documented progress-push proof; all other reaction states remain
  unhooked until their placement is reviewed.
- The progress-push proof now follows the confirmed repair boundary. It stays on
  the still frame until confirmed progress advances, plays one approximately
  two-second push reaction, then returns to still. Reduced-motion users always
  receive the still; the other five animation states remain unloaded.
## Techno animation library

- Added six approved, wrapper-owned animated WebP states under
  `apps/internet-recovery/art/characters/techno/`: progress push, ball-drop
  idle, sleep idle, paw alert, bark alert, and tail-wag celebration.
- Every state uses six transparent frames over approximately two to three
  seconds and includes a matching still WebP for reduced-motion presentation.
- The progress-push sprite is intended to move with the wrapper's confirmed
  repair boundary. Other reactions should be lazy-loaded and remain optional
  presentation; they do not affect reading, scoring, comprehension, or saved
  progress.
- Each loop was decoded and visually checked for duplicate characters,
  clipping, inconsistent scale, and missing limbs. Rejected experiments and
  internal review strips are not part of the published asset set.
- The WikiWhy visual-fidelity branch integrates only the progress-push state;
  the matching still is the default and reduced-motion presentation. The other
  five reactions remain unreferenced and therefore absent from the live bundle.

## Persistent WikiWhy repair consequence

- The completed reading now produces one visible WikiWhy stability outcome
  instead of ending at a generic Continue button. The result shows the previous
  stability, new stability, advance, an in-world reaction, and explicit
  `READING SAVED · EVIDENCE SAVED` confirmation.
- A theme-neutral Game Rules function combines completion, accuracy,
  comprehension, and pace. The WikiWhy-specific rule maps that strength to the
  documented 10–20% Act I advance. Every accepted reading advances; optional
  comprehension can strengthen the repair; faster reading has no upper-speed
  penalty; and no answer can force a retry.
- Wrapper state now persists stability, repair count, last reaction, and the
  last applied session ID. Duplicate clicks cannot count a session twice, and
  existing version 1 saves migrate at the minimum earned 10% per repair.
- Reloading the prototype enables Recovered Files and displays the saved
  WikiWhy stability receipt. Storage failure still leaves the current-tab
  outcome playable and never affects speech scoring.
- Added `?uiPreview=outcome` for no-microphone visual review of the consequence.
- Deliberately did not implement the 80% reverse hack, Shield Protocol, hub, or
  multi-site campaign. The next mechanics decision should come from testing
  whether this single persistent reward feels connected and satisfying.

## Local non-audio session state track

- Added a versioned, theme-neutral Reading Platform session history stored only
  in this browser. It saves passage/session IDs, completion time, duration,
  accuracy, confirmed/total words, progress, WPM, and comprehension outcome.
- The store explicitly discards raw audio, transcript text, checkpoint text,
  browser identity, and wrapper terminology. It is capped at 20 sessions.
- Added a separate Internet Recovery 98 WikiWhy repair record, written only
  when the player chooses Continue. The wrapper state does not enter the Reading
  Engine session format.
- Browser storage is optional. Blocked access, malformed data, policy errors,
  and quota failures fall back safely without interrupting reading or scoring.
- Recommended next action: keep the speech adapter swappable while using the
  campaign diagnostics to review the wrapper consequence and story timing.

## WikiWhy interface track

- Reviewed the complete merged prototype handoff, campaign flow, character
  direction, player-facing copy deck, passage decks, passage authoring guide,
  canonical architecture, and relevant concept boards.
- Implemented the smallest supported visual slice: one bounded Internet
  Recovery 98 remote desktop, one dominant WikiWhy browser window, one compact
  independent Reading Companion, one progress-driven repair wipe, and quiet
  result/comprehension windows.
- New reviewed visual direction for the next wrapper pass: present the game as a
  remote tunnel into Finn's fictional Internet Recovery 98 desktop. Keep the
  Recovery Browser visibly inset rather than full-canvas, leave a restrained
  stable desktop rim with taskbar/status chrome and a few old-computer Easter
  eggs, and keep the Reading Companion visibly separate from corrupted site
  content. This is shared framing; each site's browser composition may vary.
- Added stable implemented copy IDs in `apps/internet-recovery/copy.js`; no
  wrapper copy or WikiWhy concepts entered the Reading Engine or speech files.
- Added `?uiPreview=read` and `?uiPreview=review` as no-microphone visual QA
  states. They are diagnostics, not player navigation.
- Wired Deck A passage A01, **How Plants Store Sunlight**, through a reusable
  attributed Content Platform record. Title, paragraphs, word count,
  provenance, profile, and comprehension now hydrate the interface from that
  record instead of the former hard-coded evidence demo.
- Deliberately deferred the 80% rogue AI rewrite, ten-session campaign, Shield
  Protocol, achievements, and generated character sprites until the core
  one-passage experience is reviewed.
- Next action: deploy and judge whether the compact reader holds attention at
  250 WPM while the page repair remains legible without stealing focus.

## Moonshine latency track

- PR #17 added an isolated Moonshine Base + Silero VAD browser comparison while
  leaving the production Whisper path unchanged.
- The first real run detected seven speech segments but returned seven empty
  transcripts on WebGPU. Timing was 19.6 seconds to first output, 1.6 seconds
  median segment lag, 6.1 seconds worst lag, and no final-flush delay. The 0%
  display was an engine failure, not a reading score.
- The follow-up test uses only the first passage paragraph, forces
  WebAssembly/q8, and displays privacy-safe sample count, duration, RMS, peak,
  and model-response shape for every segment.
- Next action: deploy and perform one short microphone reread. Continue with
  Moonshine only if it returns a fair transcript with materially better latency
  than the current Whisper final pass.

## Copywriting track

- Added `docs/gameplay/INTERNET_RECOVERY_COPY_DECK.md`, a reviewable wrapper-only
  deck covering first launch, navigation, mission framing, microphone/privacy,
  reading states, quiet results, voluntary retries, character dialogue, pop-ups,
  a clearly labeled fake-virus level, dial-up loading, AI interference, Shield
  Protocol, achievements, settings, errors, old-Internet references, and final
  story beats.
- Approved voice: edgy teen comedy without cruelty; mild profanity; direct use
  of Finn's name; extensive fourth-wall breaks; and Chinmay as a brilliant,
  theatrical, overconfident inventor whose sincere attempts to help by deploying
  his AI create additional problems for Finn to solve. Chinmay is not malicious.
- Chinmay always has long hair. His campaign art progresses from neat and
  confident to increasingly messy, frazzled, and flustered as the AI ignores
  him. He may look startled, embarrassed, tired, or relieved, but never angry at
  Finn, threatening, or villain-coded.
- Reading feedback stays minimal and nonjudgmental. Metrics remain visible,
  recognition uncertainty is explicit, continuing is always available, and no
  score can force a retry.
- Canonical wrapper title is now `Internet Recovery 98`. Finn opens it as an
  ordinary browser-based game, and the game page becomes a clearly bounded
  remote-tunnel view into his fictional Internet Recovery desktop. The Recovery
  Browser remains visibly inset within that shell, leaving room for restrained
  trash/recycle-bin, folder, file, shortcut, taskbar, and status-chrome details.
  It must not imitate Finn's real desktop. Amy assembled the new recovery
  environment from old,
  pre-generative-AI code that Chinmay's contaminated AI systems did not
  understand or want to rewrite. The contained desktop uses original parody
  start/taskbar/browser/terminal conventions and must not imitate Finn's actual
  operating system or real browser chrome.
- Techno is a knowing visual sprite who jumps through and helps inside the
  recovery desktop without a formal introduction or dialogue-character role.
- Internet Recovery 98 uses a normal `Start` label. The recovery desktop is a
  stable, trusted shell: taskbar, terminal, Reading Companion, repair tools, Amy
  tile, and Techno do not become corrupted during ordinary site missions. Only
  websites nested inside the old browser are unstable. The Reading Companion
  remains its own recovery window, and site-specific browser layouts may vary
  inside the shared desktop frame. A single explicitly fictional virus breach
  is now frozen as the late-game escalation when Chinmay's AI acts beyond his
  command and attempts to enter the recovery desktop.
- Campaign structure is ten sites and eleven evidence files. Each site supplies
  one story artifact. Apparent completion at `10 of 10` is interrupted by
  `EVIDENCE_11.LIVE`, which records Chinmay's AI attempting to breach the
  recovery desktop after acting beyond his command. The resulting fake-virus
  boss arc is the only ordinary-story exception to the desktop's stability and
  leads to a separate conclusion in which Finn traces the common origin,
  preserves all eleven evidence files, and revokes the AI service's access
  across exactly three saved reading checkpoints. See
  [`gameplay/FINAL_BREACH_RUNTIME_BRIEF.md`](gameplay/FINAL_BREACH_RUNTIME_BRIEF.md).
- The ten-site production design pass is complete. Every site has stable copy
  IDs, exact repair/midpoint/finale/persistence contracts, responsive and
  reduced-motion direction, and an original runtime mark. WikiWhy and ThreadIt
  also have focused implementation-usable SVG packs. Generated boards remain
  story/composition references rather than runtime backgrounds.
- Parallel implementation is active on `agent/recovery-hub-navigation` / PR 30.
  The design branch answers its durable requests through
  [`design/BUILDER_RESPONSE_2026-07-12.md`](design/BUILDER_RESPONSE_2026-07-12.md).

## Historical predictive-guide snapshot

## FacePlace visual-fidelity handoff (2026-07-12)

- Active branch: `agent/faceplace-visual-fidelity`, based on synchronized
  `main` after merged ThreadIt PR #75.
- `faceplace.css` now supplies a compact production-fidelity layer matching the
  canonical three-act board: cobalt/aqua header, state-aware act ribbon,
  network-paper texture, dimensional feed cards, `AMPLIFIED` corruption flags,
  and a drifting nonsense-tracker treatment.
- No new raster asset is loaded. Existing semantic DOM, state contracts,
  provisional fixture/evidence boundary, and persistent Techno remain intact.
- Local browser QA at the corrupted preview found six cards, three duplicate
  flags, fixed Techno, and no horizontal overflow. `npm test` (310 tests),
  `npm run check`, `npm run build`, and `git diff --check` all pass.
- No newer designer PR was present at this synchronization point. The focused
  canonical fixture request in `design/FACEPLACE_RUNTIME_REQUEST.md` remains
  unanswered; do not promote the current test receipt.

## MyCorner visual-fidelity handoff (2026-07-12)

- Active branch: `agent/mycorner-visual-fidelity`, based on deployed FacePlace
  PR #76 / `main` at `fe384b6`.
- `mycorner.css` now matches the canonical three-act direction more closely via
  state-aware act labeling, layered profile texture, taped modules, tacky hover
  depth, `AUTO-PERSONA` corruption labeling, animated template scan, and a
  stronger saved-profile scrapbook.
- No new raster asset is loaded. The canonical Mara Vale data, exact seven-unit
  state machine, evidence contract, silence/autoplay rules, responsive drawer,
  and platform separation remain unchanged.
- Local corrupted-state browser QA found eleven semantic modules, fixed Techno,
  and no horizontal overflow. `npm test` (310 tests), `npm run check`,
  `npm run build`, and `git diff --check` all pass.
- No newer designer PR or fetch delta was present. The designer's existing
  MyCorner runtime response remains the canonical data source and does not
  require another art packet for this CSS-only pass.

## Yahuh! Portal visual-fidelity handoff (2026-07-12)

- Active branch: `agent/yahuh-visual-fidelity`, based on deployed MyCorner PR
  #77 / `main` at `5f81603`.
- `yahuh.css` now brings the six-module runtime closer to the canonical portal
  board through stronger purple chrome, a state-aware act ribbon, intentionally
  tilted pasted modules, corruption flags, single-stream scan, and semantic
  switchboard socket styling.
- No new raster asset is loaded. The canonical fixture, exact three-sort plus
  three-reconnect state machine, source labels, evidence boundary, content gate,
  independent Reading Companion, and reduced-motion behavior remain intact.
- Local corrupted-state QA found six pasted modules, the expected act ribbon,
  fixed Techno, and no horizontal overflow. `npm test` (310 tests),
  `npm run check`, `npm run build`, and `git diff --check` all pass.
- No newer designer PR or fetch delta was present. The existing canonical Yahuh
  runtime response remains sufficient; no new art request is needed for this
  CSS-only milestone.

## ViewTube visual-fidelity handoff (2026-07-12)

- Active branch: `agent/viewtube-visual-fidelity`, based on deployed Yahuh PR
  #78 / `main` at `eb82c6b`.
- `viewtube.css` now supplies the canonical silent CRT/editor character via a
  state-aware act ribbon, scanline and glass treatments, duplicate-frame flags,
  styled recommendation thumbnails, and a stronger evidence timeline.
- No media or raster asset was added. The site remains silent and preserves the
  exact four-restore plus three-track state machine, content gate, decorative
  transcript separation, evidence contract, and reduced-motion fallback.
- Local corrupted-state QA found the expected act ribbon and silent visual-only
  badge, fixed Techno, and no horizontal overflow. `npm test` (310 tests),
  `npm run check`, `npm run build`, and `git diff --check` all pass.
- No newer designer PR or fetch delta was present. The existing canonical
  ViewTube runtime response is sufficient for this CSS-only milestone.

## Search-ish visual-fidelity handoff (2026-07-12)

- Active branch: `agent/searchish-visual-fidelity`, based on deployed ViewTube
  PR #79 / `main` at `b487d65`.
- `searchish.css` now applies the canonical source-evaluation palette and three
  acts through a campaign ribbon, colored query trail, explicit generated-origin
  warning, dimensional result cards, semantic branch wires, and trail depth.
- No external search, iframe, remote content, or raster asset was added. The
  exact four-origin plus three-branch state machine, canonical fixture/evidence,
  content gate, independent Reading Companion, and reduced-motion behavior are
  unchanged.
- Local corrupted-state QA found four result cards, three branch gates, the
  generated warning, fixed Techno, and no horizontal overflow. `npm test` (310
  tests), `npm run check`, `npm run build`, and `git diff --check` all pass.
- No newer designer PR or fetch delta was present. The existing canonical
  Search-ish runtime response remains sufficient for this CSS-only milestone.

## Amaze-On visual-fidelity handoff (2026-07-12)

- Active branch: `agent/amazeon-visual-fidelity`, based on deployed Search-ish
  PR #80 / `main` at `6f51a17`.
- `amazeon.css` now adds the canonical warehouse/receipt personality through a
  state-aware act ribbon, fictional/no-purchase badge, taped evidence parcels,
  five colored destinations, recommendation warnings, receipt paper, and a
  negative-purchasing rewind treatment.
- No transactional or external-commerce capability and no raster asset was
  added. The exact four-sort plus three-receipt state machine, consent/evidence
  boundaries, content gate, independent Reading Companion, and reduced-motion
  behavior remain unchanged.
- Local corrupted-state QA found four parcels, five evidence bins, the safety
  badge, fixed Techno, and no horizontal overflow. `npm test` (310 tests),
  `npm run check`, `npm run build`, and `git diff --check` all pass.
- No newer designer PR or fetch delta was present. The existing canonical
  Amaze-On runtime response is sufficient for this CSS-only milestone.

## Spotty-Fi visual-fidelity handoff (2026-07-12)

- Active branch: `agent/spottyfi-visual-fidelity`, based on deployed Amaze-On
  PR #81 / `main` at `df81a7e`.
- A separate `spottyfi-fidelity.css` layer now applies the canonical dark
  manual-mixtape direction: three-act ribbon, five geometric silent cards,
  magenta card labels, dark queue/history panel, visual-only level meter, and
  cassette-style ownership timeline.
- No media, lyrics, autoplay, iframe, remote album art, or raster asset was
  added. The exact five-disclosure plus three-owner state machine, canonical
  fixture/evidence, content gate, Reading Companion separation, and reduced
  motion behavior remain unchanged.
- Local corrupted-state QA found five library cards, five queue entries, the
  no-audio badge, fixed Techno, zero media elements, and no horizontal overflow.
  `npm test` (310 tests), `npm run check`, `npm run build`, and
  `git diff --check` all pass.
- No newer designer PR or fetch delta was present. The canonical Spotty-Fi
  runtime response remains sufficient for this lightweight fidelity milestone.

## MapGuess visual-fidelity handoff (2026-07-12)

- Active branch: `agent/mapguess-visual-fidelity`, based on deployed Spotty-Fi
  PR #82 / `main` at `20f6b23`.
- `mapguess.css` now applies the canonical navigation-board art direction via
  blue route chrome, three-act ribbon, contour paper, corrupted-layer labels,
  flowing dashed routes, moving-target pulse, anchor beacons, and route-log
  texture.
- No external map, iframe, real location, remote tiles, or raster asset was
  added. The exact five-rebuild plus three-anchor state machine, four valid
  route goals, canonical fixture/evidence, content gate, Reading Companion
  separation, and reduced-motion behavior remain unchanged.
- Local corrupted-state QA found four corrupted blocks, one semantic route, the
  expected act ribbon, fixed Techno, zero external frames, and no horizontal
  overflow. `npm test` (310 tests), `npm run check`, `npm run build`, and
  `git diff --check` all pass.
- No newer designer PR or fetch delta was present. The canonical MapGuess
  response remains sufficient for this CSS-only milestone.

- Branch: `agent/campaign-spine-content`
- Base for this stacked design PR: `agent/multi-site-design-library` at `f62d04d`
- Live deployment before this branch:
  <https://chinmay856.github.io/finn-reading-game/>
- Current engine: Transformers.js `3.7.1`, timestamped Whisper base,
  WebAssembly/q8
- Privacy: all recognition remains local; transcript diagnostics are ephemeral

### Latest user evidence

The corrected engine appears to recognize the full reading, but confirmed
progress arrives after the reader reaches the bottom of the viewport. Paragraph
transitions force unnatural mid-sentence pauses. The required experience must
support approximately 250 WPM and may need headroom for faster reading.

This establishes that confirmed transcription is too latent to serve as the
navigation clock even when its final accuracy is acceptable. Current graphics
are inexpensive and inference runs in a worker; the dominant problem is waiting
for checkpoint transcription before scrolling, not site artwork.

### Implemented response

- Added a theme-neutral predictive guide under `reading-guide.js`.
- The guide advances from active speaking time and a selectable 150, 200, 250,
  or 300 WPM profile; 250 WPM is the default.
- Eighteen words of look-ahead and a taller 56vh reading viewport keep current
  and upcoming prose visible.
- Voice pauses stop the guide clock.
- Manual wheel, pointer, or touch scrolling pauses automatic guidance for five
  seconds so the interface does not fight the reader.
- Confirmed transcript progress remains separately labeled and continues to
  drive WikiWhy repair.
- Voice activity and guide position never participate in completion, accuracy,
  scoring, or repair. End detection still requires actual final-token evidence.

### Research

The maintained Hugging Face Moonshine Web example is the next engine candidate
if UI decoupling is insufficient. It uses the same Transformers.js `3.7.1`,
Moonshine Base, Silero VAD, WebGPU with WASM fallback, and serialized inference.
It is designed for live recognition but has a substantially larger model and
must be benchmarked before integration. See `docs/engine/SPEECH_TECH_RESEARCH.md`.

### Validation

- `npm run check` — passed
- `npm test` — passed, 28 tests
- `npm run build` — passed
- Browser smoke: 250 WPM selected by default, 300 WPM available, taller reader
  grid present, transcript panel present, no console warnings/errors
- Real microphone naturalness test remains required

### Preserved state

`tests/audio-capture.test.js` retains a pre-existing line-ending-only status
with no content diff. It remains unstaged and undiscarded.

### Recommended next step at that time

Publish and test the 250 WPM guide once. Read without waiting for confirmed
highlighting and judge only whether upcoming text remains comfortably visible.
If the guide still lags, select 300 WPM or increase look-ahead. If navigation is
comfortable but confirmed repair remains distractingly delayed, run the exact
maintained Moonshine Web example as an isolated benchmark before changing the
production speech adapter.

## ThreadIt desktop-density handoff (2026-07-12)

- Active branch: `agent/threadit-dense-desktop-board`, based on deployed
  ViewTube/Amaze-On PR #92 / `main` at `f613a03`.
- `compact-sites.css` now renders the ThreadIt feed as a desktop-only
  two-column scan board with compact metadata and two-line excerpts. The
  Reading Companion is untouched.
- Local browser QA at 1440x900 measured all 6 posts fully visible (previously
  2), page client/scroll height 612/612, and thread-column height 453/487 with
  every card inside the visible column bounds.
- Next: run repository checks, publish through PR/CI/merge/Pages, then audit
  FacePlace, MyCorner, and Yahuh for meaningful first-screen content density.

## Remaining campaign density handoff (2026-07-12)

- Active branch: `agent/remaining-site-density`, based on merged ThreadIt PR
  #93 / `main` at `f5fb516`.
- Desktop-only rules in `compact-sites.css` convert FacePlace, MyCorner, and
  Yahuh into glanceable overview boards without changing the Reading Engine,
  campaign state, content records, or Reading Companion typography.
- 1440x900 browser QA: FacePlace 6/6 feed cards visible, MyCorner 5/5 profile
  modules visible, Yahuh 6/6 portal modules visible; every outer site page is
  756/756 client/scroll height.
- Secondary copy stays in the semantic DOM and is clamped only in desktop
  overview mode. Shared real-button action halos continue to distinguish
  interactables from decorative, button-like site artwork.

## WikiWhy candidate-roster handoff (2026-07-12)

- Active branch: `agent/wikiwhy-candidate-roster`, based on deployed desktop
  density PR #94 / `main` at `960ffb1`.
- `content/wikiwhy/first-run-passages.js` adds the nineteen missing WikiWhy
  A02-B10 records as complete, theme-neutral Content Platform candidates.
- `scripts/generate-wikiwhy-candidates.mjs` deterministically derives prose,
  prompts, correct answers, article/history URLs, and titles from the canonical
  `PASSAGE_DECKS.md`; passage-specific distractors and the fail-closed review
  contract remain generator-owned. Run `npm run generate:wikiwhy` after editing
  either source.
- Every candidate has three paragraphs, exactly three comprehension choices,
  CC BY-SA 4.0 attribution, a local reading profile, null frozen revision,
  pending independent review, and `transcriptionReview.tested: false`.
- Focused content-model QA confirms 19/19 candidate records, exact deck ID
  order, and zero candidate selectability. WikiWhy still selects only A01.

## Remaining candidate-rosters handoff (2026-07-12)

- Active branch: `agent/remaining-candidate-rosters`, based on merged WikiWhy
  roster PR #95 / `main` at `2899eba`.
- `scripts/generate-original-site-candidates.mjs` converts the canonical
  Search-ish (7), Amaze-On (7), Spotty-Fi (8), MapGuess A02-A08 (7), and
  ViewTube A02-A07 (6) manuscript packets into 35 Content Platform candidates.
- The catalog also retains MapGuess A01 and ViewTube A01, producing complete
  eight- and seven-record first-run rosters respectively.
- Each generated record has at least three prose paragraphs, exactly three
  authored comprehension choices, the shared local reading profile,
  original-work rights, pending independent review, and an untested microphone
  record. None is selectable.
- Campaign readiness now reports zero manuscript shortfall. MapGuess Deck A is
  reconciled to its newer frozen A01-A08 manuscript packet; its five B records
  remain replay-only, for thirteen planned records total.

## Campaign review-manifest handoff (2026-07-12)

- Active branch: `agent/campaign-review-manifests`, based on merged roster PR
  #96 / `main` at `c6045fa`.
- Every candidate now declares an exact `contentRevision`; generated and manual
  passage modules use the same `<passage-id>@2026-07-12.1` convention.
- `content/review-records/campaign.json` contains 82 pending campaign records;
  together with three endgame records it covers all 85 candidates exactly once.
- `npm run review:status` now audits the whole candidate catalog and currently
  reports 0/85 approved with exact blockers. This is truthful external-work
  inventory, not a promotion mechanism.
- `npm run generate:review-manifests` preserves unchanged evidence, rejects
  unknown IDs, and fails if a revised passage already has review or microphone
  evidence that would otherwise be overwritten.

## Full-playthrough playtest-lane handoff (2026-07-12)

- Active branch: `agent/playtest-content-lane`, based on merged review-manifest
  PR #97 / `main` at `40c8387`.
- The user will review content during a future full playthrough rather than as
  a separate manuscript pass. ADR-003 therefore permits structurally complete
  candidates in an explicit `PLAYTEST · REVIEW PENDING` lane.
- `selectNextPlaytestPassage` is candidate-only, unseen-first, noncanonical,
  and does not mutate passage availability or review manifests.
- Production `isSelectablePassage` and `selectNextPassage` behavior is
  unchanged. ThreadIt is the next wrapper to connect end to end.
## 2026-07-12 Spotty-Fi candidate playthrough

- Added the explicit playtest selector and shared Reading Companion route for
  all eight Spotty-Fi Deck A candidates while production selection remains
  fail-closed.
- Reading results advance the existing five disclosure and three listener-
  control units. The predicted-history midpoint remains an explicit player
  acknowledgement and blocks the sixth reading until reviewed.
- Playtest progress, the blocked insert, and slot-nine evidence are tab-only;
  they cannot approve content, become persisted canonical evidence, or satisfy
  the finale gate.
- No Reading Engine code changed. `npm run check`, all 325 tests, and
  `npm run build` pass. The local build served successfully over HTTP, but no
  in-app browser backend was available for automated desktop interaction.
