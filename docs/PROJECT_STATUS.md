# Project status

## Ten-site playtest completion candidate — 2026-07-13

- All ten Internet Recovery sites now use a fixed 4:3 play surface. ThreadIt,
  FacePlace, MyCorner, Yahuh, ViewTube, and Amaze-On have joined Search-ish,
  Spotty-Fi, and MapGuess with image-led locked frames and semantic repair
  overlays; WikiWhy retains its established campaign presentation.
- Every post-WikiWhy site now has Amy/Chinmay entry, midpoint, and completion
  exchanges. Midpoints explain the change between the first and second repair
  problem; completions say what Finn fixed and explicitly finish the site.
- Progress geometry matches each authored flow: ThreadIt 4+3, FacePlace 3+3,
  MyCorner 4+3, Yahuh 3+3, ViewTube 4+3, Search-ish 4+3, Amaze-On 4+3,
  Spotty-Fi 5+3, and MapGuess 5+3. Search-ish therefore shows four initial
  source routes followed by three answer checks rather than changing phase
  halfway through a mismatched list.
- MapGuess's bottom tracker now visibly compares the requested and moved
  destination and preserves the deliberately unreliable vintage
  “2 minutes remaining” estimate until Finn locks the real target.
- Desktop browser QA at 1280x720 covered entry, midpoint, and secured previews:
  all image-led site frames measured exactly 4:3, no document or active-screen
  overflow was found, and exactly one Techno was visible in every state.
- Validation for this candidate: syntax checks, 360 tests, production build,
  and `git diff --check` pass. Per the current playtest instruction, no speech
  engine or latency behavior changed in this work.

## Player review checkpoint — active 2026-07-13

- Build `5b5613d` is live for review. It publishes the first image-led locked
  frames for Search-ish, Spotty-Fi, and MapGuess; Comic Sans-style site copy;
  compact no-scroll boards; site-correct TEST routing; reading-start and result
  flow improvements; map progress; and the FacePlace AVOCADO story beat.
- The checkpoint passed syntax checks, 342 tests, the production build, and a
  browser overflow audit across all ten initial sites at 1280x720.
- It is not the final playtest release. Full next steps and completion gates are
  in `docs/PLAYTEST_REVIEW_HANDOFF_2026-07-13.md`: gameplay correctness and
  state isolation first, remaining visual redesign second, and measured real-
  microphone latency work third.

## Tomorrow playtest release pass — active 2026-07-13

- All ten site boards and companion panels fit the 1440×900 desktop without
  page or nested-panel scrolling in their initial playtest state. ThreadIt,
  MyCorner, ViewTube, Search-ish, and MapGuess received targeted overflow and
  artwork corrections; stale Design Preview labels were removed.
- Every candidate reading now keeps the owning site on the left. WikiWhy is no
  longer shown beside another site's passage. Long sentences remain one stable
  semantic guide unit instead of being cut after an arbitrary word count.
- Techno now uses one mutually exclusive state at a time: idle/inspect,
  ball-push reading progress, celebration, popup alert, or sleep after sixty
  seconds without activity. Existing optimized sprites are reused.
- The production Whisper fixture test measured 31/32 matches at 154 and 200 WPM
  and 29/32 at accelerated 250 WPM. Full-pass decode took 5.5–5.8 seconds;
  six-second rolling windows still took 4.2–4.6 seconds. This confirms Whisper
  remains the final assessment lane and must not be described as truly live.
- Microphone capture now requests only browser-supported single-channel 16 kHz
  speech cleanup constraints. Audio and transcript text remain in memory only.
- Content approval truth is unchanged: all 85 candidate/finale records still
  require independent review and real-microphone evidence.

## Evidence-driven Reading Companion integration — active 2026-07-12

- The deployed Whisper scoring lane remains the final result authority.
- The Reading Companion now derives stable sentence/line ranges before capture
  and advances its centered highlight only from local checkpoint transcript
  evidence. Silence and elapsed time cannot move the guide forward, and later
  transcript revisions cannot move it backward.
- Manual scrolling pauses automatic centering until another checkpoint arrives
  after the quiet interval. The guide retains no transcript beyond the active
  attempt, and saved session records remain transcript- and audio-free.
- The replaceable streaming recognizer contract and sherpa proof are included,
  but sherpa is not shipped in the deployed path: its 203 MB runtime still
  requires a host or isolation strategy that can provide the proven security
  headers. A streaming failure must never disable Whisper scoring or Continue.
- Combined ten-site validation: syntax checks passed; 339 tests passed; production build
  passed; desktop browser QA confirmed one active authored line, no horizontal
  overflow, and the existing independent Reading Companion layout.

## MapGuess candidate playthrough — active 2026-07-12

MapGuess now exposes all eight complete first-run candidates through the
explicit noncanonical playtest lane and routes them through the shared Reading
Companion into five map rebuilds, the saved Moving Target acknowledgement and
route-goal choice, and three destination anchors. Progress is tab-only, so the
slot-ten receipt cannot be persisted as canonical evidence or unlock the
finale. Production selection and independent review remain fail-closed. No
Reading Engine code changed. Production-bundle browser QA at desktop size
confirmed the primary playtest control remains visible above the taskbar and
opens `A Map Is Not a Photograph` in the shared setup screen with no horizontal
overflow.

## Amaze-On candidate playthrough — active 2026-07-12

Amaze-On now exposes all seven complete Deck A candidates through the explicit
noncanonical playtest lane and routes them through the existing Reading
Companion into four evidence-parcel sorts, the Negative Purchasing
acknowledgement, and three consent-ledger repairs. Progress is intentionally
tab-only, so the slot-eight receipt cannot become persisted canonical evidence
or unlock the finale. Production selection and every independent content-review
gate remain fail-closed. No Reading Engine code changed.

## ViewTube candidate playthrough — active 2026-07-12

ViewTube now exposes all seven complete Deck A candidates through the explicit
noncanonical playtest lane and routes them through the existing Reading
Companion into four context restores, the saved-autoplay acknowledgement, and
three evidence tracks. The site remains silent and media-free. Progress is
tab-only, so slot-six evidence cannot become persisted canonical evidence or
unlock the finale. Production selection and independent review remain
fail-closed. No Reading Engine code changed.

## Reading Companion integration kit — ready for integration 2026-07-12

- A theme-neutral, evidence-locked line guide is packaged under
  `reading-companion/` on `agent/reading-companion-integration-kit`.
- The isolated sherpa-onnx spike and repeatable 154-250 WPM fixture results are
  under `prototypes/reading-companion/`; the deployed app is unchanged.
- The existing local Whisper path remains the final scoring authority. The new
  lane is only for low-latency visual position.
- Exact wiring, hosting headers, fallback behavior, privacy boundaries, and
  acceptance checks are in
  `docs/engine/READING_COMPANION_INTEGRATION_HANDOFF.md`.
- Next action: integrate the neutral contract behind a feature flag after the
  production host proves cross-origin isolation and one natural 180-220 WPM
  reader fixture passes.

## Search-ish candidate playthrough — active 2026-07-12

Search-ish now exposes all seven complete Deck A candidates through the explicit
noncanonical playtest lane and routes them through the existing Reading
Companion into four origin restores, the Five Costumes acknowledgement, and
three independent-source branch gates. Progress is intentionally tab-only, so
the slot-seven receipt cannot become persisted canonical evidence or unlock the
finale. Production selection and every independent content-review gate remain
fail-closed. No Reading Engine code changed.

## Yahuh candidate playthrough — active 2026-07-12

Yahuh now exposes all six complete Deck A candidates through the explicit
noncanonical playtest lane and routes them through the existing Reading
Companion into three module sorts, the Single Source acknowledgement, and three
channel reconnects. Progress is intentionally tab-only, so the slot-five
receipt cannot become persisted canonical evidence or unlock the finale.
Production selection and every independent content-review gate remain
fail-closed. No Reading Engine code changed.

## MyCorner candidate playthrough — active 2026-07-12

MyCorner now exposes all seven complete Deck A candidates through the explicit
noncanonical playtest lane and routes them through the existing Reading
Companion into four profile restores, the Apply to Everyone acknowledgement,
and three owner-control locks. Playtest progress is intentionally tab-only, so
the slot-four receipt cannot become persisted canonical evidence or unlock the
finale. Production selection and every independent content-review gate remain
fail-closed. No Reading Engine code changed.

## FacePlace candidate playthrough — active 2026-07-12

FacePlace now exposes all six complete Deck A candidates through the explicit
noncanonical playtest lane and routes them through the existing Reading
Companion into its three false-tracker and three honest-recovery units. Progress
is tab-only, so the provisional slot-three receipt cannot become persisted
canonical evidence or unlock the finale. A01's public-domain source freeze is
now bound to Project Gutenberg eBook 1342's official HTML file modified
2026-02-10T12:53:56.255684Z; editorial, adaptation, accessibility, sensitivity,
profile, and real-microphone reviews remain pending. No Reading Engine code
changed.

## ThreadIt playtest integration — active 2026-07-12

ThreadIt's wrapper-owned content selector now exposes the neutral candidate
`playtest` lane explicitly while leaving its production selector fail-closed.
The site can load an unseen candidate into the existing Reading Companion and
apply an accepted result to its seven-unit wrapper campaign. Playtest progress
is intentionally tab-only: it remains noncanonical and review-pending, cannot
promote passage availability, cannot persist canonical evidence, and cannot
satisfy finale gates. No Reading Engine code changed.

## Full-playthrough content lane — active 2026-07-12

The Content Platform now has an explicit `playtest` selector for structurally
complete candidate passages. It is candidate-only, unseen-first, review-pending,
and always noncanonical; it does not mutate availability or manifests and
cannot satisfy production selection. ThreadIt is the first planned end-to-end
wrapper integration using this lane.

## Campaign review manifests — active 2026-07-12

All 85 candidate passages now have exact revision-bound pending review
manifests: 82 campaign records plus the existing three final-incident records.
The campaign generator preserves evidence for unchanged revisions, rejects
unknown IDs, and refuses to overwrite evidence after revision drift. The status
command reports 0/85 approved with exact independent-review, microphone, and
token blockers; no automated check self-certifies a passage.

## Remaining first-run content rosters — active 2026-07-12

Search-ish, Amaze-On, Spotty-Fi, MapGuess, and ViewTube now have complete
theme-neutral first-run candidate rosters generated from their canonical
manuscript packets: 35 newly structured original-prose records in total. Each
record has authored prose, exactly three comprehension choices, a reading
profile, original-work rights metadata, and explicit pending independent-review
and real-microphone evidence. MapGuess now follows its newer frozen eight-record
first-run manuscript roster while retaining five separate replay records. No
new candidate is selectable; every campaign continues to fail closed.

## WikiWhy structured content — active 2026-07-12

WikiWhy's complete twenty-record A/B roster is now represented in the reusable
Content Platform: the existing A01 prototype plus nineteen licensed-adaptation
candidates generated deterministically from the canonical manuscript deck.
Every candidate includes three paragraphs, a three-choice comprehension check,
reading profile, Wikipedia article/history attribution, CC BY-SA 4.0 rights,
and explicit pending independent-review and real-microphone evidence. Candidate
selection remains fail-closed, so A01 is still the only executable record.

## ViewTube and Amaze-On compact boards — active 2026-07-12

The final two overflowing site simulations now fit at 1440×900. ViewTube's
desktop page measures 706/706 client/scroll pixels and Amaze-On measures
700/700; both Reading Companions also fit exactly. Compression affects site
chrome and card spacing, not reading typography.

## MapGuess illustrated board — active 2026-07-12

MapGuess now uses a bright board-derived fictional summer terrain layer beneath
its semantic tile, route, destination, and landmark overlays. The optimized lazy
WebP is 214 KB. At 1440×900 the site page and Reading Companion fit without page
scrolling; narrow secondary detail rails retain independent inspector scrolling.

## Spotty-Fi identity and compact board — active 2026-07-12

Spotty-Fi now uses a clearer cassette-plus-music-note SVG mark and a fixed
1440×900 board. Five library cards, all five queue entries, the silent player,
history/suggestions, progress strip, and full Reading Companion fit without
site-page scrolling.

## Compact desktop interaction and Search-ish art — active 2026-07-12

The desktop site contract now distinguishes real enabled controls with a steady
action halo and reserves animation for the primary next action. Search-ish uses
an original ultraviolet/cyan/lime/coral palette, a board-derived 164 KB lazy
WebP, and a fixed 1440×900 board that exposes all four results, the source
inspector, progress strip, and full Reading Companion without site scrolling.

## Yahuh structured content — active 2026-07-12

Yahuh's complete six-record first-run roster is encoded as Content Platform
candidates. Its manuscript shortfall is now zero; every record remains
unselectable pending independent review and real-microphone evidence.

## Design ownership — active 2026-07-12

The parallel designer has completed and paused their work. Remaining visual,
copy, interaction, asset, and art-direction decisions are builder-owned and will
be resolved directly from the canonical design library. The repository will no
longer wait for a separate designer response. Independent editorial review and
real-microphone evidence remain external approval gates and must not be
self-certified by the implementation author.

## MyCorner structured content — active 2026-07-12

MyCorner's full seven-record first-run roster is represented as theme-neutral
Content Platform candidates. The former seven-record shortfall now reads zero;
A02–A07 remain unselectable pending independent review and real-microphone
evidence.

## FacePlace structured content — active 2026-07-12

FacePlace's full six-record first-run roster is represented as theme-neutral
Content Platform candidates. The frozen `why-this-appeared-a06` manuscript now
fills Deck A's former shortfall, producing a `6A + 4B` plan. A02–A06 remain
unselectable pending independent review and real-microphone evidence.

## ThreadIt structured content — active 2026-07-12

ThreadIt's complete seven-record first-run manuscript roster is now represented
as theme-neutral Content Platform candidate records. The stale `5A + 5B`
wrapper declaration is corrected to the frozen `7A + 3B` plan. A02–A07 remain
fail-closed pending independent review evidence and real-microphone testing; the
implementation does not make ThreadIt speech-playable yet.

## ThreadIt graphics — 2026-07-12

ThreadIt has received its first board-matching visual fidelity pass with no new image payload and no change to its content-review or canonical-evidence gates.

## Shared visual fidelity — active 2026-07-12

Desktop chrome and the final incident now more closely match the canonical boards through reusable portraits, semantic SVG route/vault art, subtle CRT depth, and reduced-motion-safe animation. No flattened board image was introduced.

## Visual fidelity — active 2026-07-12

The Recovery Map has a size-conscious graphics upgrade and persistent animated Techno companion using existing optimized assets. Bundle architecture remains split; no flattened design board or large sprite sheet was added to runtime.

## Deployment health — 2026-07-12

The browser build is code-split on the canonical platform/wrapper boundary and no longer exceeds Vite's 500 kB chunk warning. CI checkout and setup-node actions now use their official Node 24 runtime releases.

## Review manifests — 2026-07-12

All three final-incident candidates have revision-bound pending manifests and an exact status command. Current result: 0/3 approved, with every human-review, real-microphone, and transcription-token blocker listed explicitly.

## Independent review evidence workflow — 2026-07-12

The Content Platform now has a fail-closed review evidence validator and durable protocol. It can safely promote a candidate projection only after independent reviews, exact-revision matching, a complete local real-microphone run, privacy confirmation, and unstable-token resolution. No candidate has been falsely promoted; collecting genuine evidence remains outstanding.

## Endgame content structure — 2026-07-12

All three canonical final-incident passages are now structured and ordered in the reusable Content Platform. They deliberately fail the selectable-content predicate until every required independent review and real-microphone transcription check passes.

## Final incident runtime — in progress 2026-07-12

The canonical `EVIDENCE_11.LIVE` persistence and UI foundation is implemented on `agent/evidence-11-live-finale`. It remains locked behind ten distinct persisted canonical site receipts. The real containment path stops honestly at checkpoint 1 until the three frozen original passages receive independent editorial, grade, sensitivity, comprehension, accessibility, transcription-profile, and real-microphone approval.

## Canonical completion integrity — 2026-07-12

FacePlace and MapGuess now use the approved designer evidence contracts. Hub completion fails closed unless each exact evidence ID and blocked-write ID is persisted; MapGuess also requires the player's route goal to be locked. Preview/diagnostic state never counts toward the ten-site completion predicate.

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Active implementation branch:** `agent/mycorner-owner-controls-foundation`
- **Repository:** `chinmay856/finn-reading-game`
- **Live prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployed main:** `65368e8` through MapGuess PR #36
- **Deployment:** GitHub Pages through GitHub Actions, HTTPS enforced
- **Current stage:** Reconcile designer PR #38 and publish MyCorner's seven-unit
  owner-control campaign while keeping all unreviewed passages unavailable

The header above is retained as historical setup context. Current work is the
post-ten-site canonical evidence audit on
`agent/canonical-evidence-reconciliation`.

## Canonical evidence audit

- FacePlace slot 3 is frozen as `faceplace.evidence.promoted-feed-01` with
  `FACEPLACE_PROMOTED_FEED.REC` and fingerprint
  `fp-vibeshift-amplify-7c31`.
- MapGuess slot 10 is frozen as
  `mapguess.evidence.moved-destination-pin-01` with
  `MAPGUESS_MOVED_DESTINATION_PIN.REC`, fingerprint `mg-movingpin-a104`, and a
  required persisted route goal.
- Their former provisional exclusions are removed. New v2 storage keys ensure
  previous structural/test saves cannot silently become canonical.
- This fixes the registry path only. The finale remains locked because nine
  sites still have zero review-approved selectable first-run records.

## Deployed implementation

- Internet Recovery 98 opens on a Recovery Map with all ten sites, exactly
  three Incoming Cases, ten Case File slots, Amy Support, persistent desktop
  chrome, and the approved shortcut rail.
- WikiWhy remains the only speech-playable site. ThreadIt is deployed as an
  honest seven-unit structural test build with `MIC: OFF`; the remaining sites
  do not borrow WikiWhy's passage, scoring, or mechanic.
- The live WikiWhy reader uses local Whisper processing, forgiving alignment, a
  250 WPM predictive guide, independent optional comprehension, and non-audio
  session history.
- The Reading Engine, Content Platform, theme-neutral strength calculation,
  wrapper rules, and Internet Recovery presentation remain separated.
- WikiWhy now has versioned campaign state, the 70–79% route clue, saved-versus-
  AI comparison, exactly three Shield passes, permanent secured navigation, and
  canonical `AI WRITE ROUTE / 01` evidence. This shipped through PR #32.
- ThreadIt now has its own semantic source tree, four Act I units, explicit
  midpoint acknowledgement, three trace units, permanent secured state, and
  Case File slot 2 test route. It shipped through PR #33; CI, Pages deployment,
  and the complete public HTTPS diagnostic route were verified.
- FacePlace now has its own semantic six-card feed, exactly three false-tracker
  repairs, an explicit Honest Zero acknowledgement, three honest-recovery units,
  and a permanent secured test route. It shipped through PR #34, followed by
  the spoken-separator accessibility correction in PR #35. CI, Pages deployment,
  and the public HTTPS diagnostic route were verified at `e776471`.
- MapGuess's complete five-plus-three Moving Target campaign shipped through PR
  #36. CI and Pages passed, and the public HTTPS route was verified at
  `65368e8`, including a saved SCENIC route-goal interaction.

## Current Spotty-Fi branch

- `agent/spottyfi-history-proof-foundation` implements the canonical five-track
  silent library, five disclosure units, saved predicted-history proof, three
  listener-control units, and Case File slot 9 evidence.
- All ten sites now expose structural runtimes; WikiWhy remains the only
  speech-playable site while independent review gates remain closed elsewhere.
- No Spotty-Fi asset request is open. The frozen Techno queue guard, Chinmay
  fluster, Amy evidence crop, mark, and DOM/CSS covers are available.

## Current Amaze-On branch

- `agent/amazeon-consent-ledger-foundation` implements four exact evidence
  parcels, the saved one-return/two-deliveries midpoint, three receipt/choice
  units, the denied Techno-ball purchase, and canonical Case File slot 8.
- Amaze-On is an honest structural campaign build with MIC OFF and no reading
  score. Seven manuscripts remain fail-closed pending independent review.
- Designer PR #42 is integrated; existing mark, parcel presentation, receipt
  treatment, shared characters, and Techno ball-pin satisfy the art contract.

## Current Search-ish branch

- `agent/searchish-origin-proof-foundation` implements the frozen four-origin
  restore, Five Costumes midpoint, three source branches, top-placement denial,
  and canonical Case File slot 7 evidence contract.
- Search-ish is an honest structural campaign test build, not speech-playable.
  Seven manuscripts are frozen in the repository but remain unselectable until
  independent content and real-microphone review passes.
- Designer PRs #41 and #51 are integrated. Commit `47c25bf` maps the canonical
  Search-ish Techno alert to the existing paw-alert still; no art dependency
  remains open.

## Current ViewTube branch

- `agent/viewtube-evidence-track-foundation` implements the canonical fictional
  silent-video fixture, four context restores, saved autoplay-loop discovery,
  explicit acknowledgement, three evidence tracks, and canonical Case File
  slot 6 registration.
- ViewTube is a clickable structural campaign test build, not speech-playable.
  Its reading companion remains fail-closed at zero selectable passages.
- Designer PRs #40 and #49 are integrated. The dedicated Techno clue-point art
  remains outstanding and is published back to the designer with acceptance
  criteria; the approved paw-alert still is the temporary fallback.
- Local validation: `npm run check`, 268 tests, and production build pass.

## Current MyCorner branch

- Designer PR #38 froze `mycorner-profile-fixture-01`, the seven-plus-three
  passage-ID plan, process lineage, responsive drawer behavior, blocked-write
  target, and canonical Case File slot 4 contract.
- MyCorner implements four profile restores, an explicit Apply to Everyone
  acknowledgement, and three owner-lock readings. The six saved choices and
  separate owner-permission seal never become a percentage.
- The exact fictional Mara Vale profile fixture is canonical wrapper data. The
  one structured passage remains a review-gated candidate; zero passages are
  selectable, so `MIC: OFF` and `NO READING SCORE` remain honest.
- Canonical slot-four evidence is eligible only after the persisted secured
  seven-reading state and exact registered ID. Diagnostic and tab-only states
  remain excluded from canonical hub counts.
- Focused MyCorner and hub/DOM validation currently passes 58 tests. Full-suite
  validation is being refreshed after documentation reconciliation.

The older MapGuess branch notes below are retained as milestone history; their
publication-pending language is superseded by PR #36 and deployed `65368e8`.

## Current Yahuh branch

- MyCorner is deployed through PR #45 and live-copy fix PR #47 at `76e6f05`.
- Active implementation is `agent/yahuh-channel-reconnect-foundation` using the
  canonical designer response from PR #39.
- Yahuh implements exactly three paired sorts, saved Single Source discovery
  and acknowledgement, and three channel reconnections across six modules.
- The frozen 6A plus 4B plan has one structured candidate and zero selectable
  records. All six required readings remain review-gated, so `MIC: OFF` and no
  reading score remain mandatory.
- Canonical Case File slot 5 requires the exact persisted secured state and
  `yahuh.evidence.single-stream-merge-01`; diagnostics remain excluded.

## Current MapGuess branch

- MapGuess has an executable, explicitly provisional/test-only campaign with
  exactly five rebuild units followed by an explicit moving-target
  acknowledgement and exactly three anchor units. It remains non-speech
  gameplay with `MIC: OFF`; diagnostic advances and route-goal choices create
  no reading score.
- The fictional map fixture uses a stable road network while the hostile repair
  moves the destination pin. The midpoint proves that road geometry did not
  change, destination coordinates did change, and the ETA target remains
  `2 MINUTES FOREVER`.
- Anchor unit eight cannot start until Finn explicitly chooses one valid route
  goal: fastest, safest, scenic, or accessible. The choice remains changeable
  after midpoint acknowledgement until the final unit begins, then locks on
  secure.
- The final structural route exposes a provisional slot-10 test receipt and
  blocked-write record for `ROUTE AUTO-FIX AI`. The hub must label that receipt
  test-only, exclude it from canonical evidence counts, and never use it for the
  ten-site final-unlock predicate.
- The independent Reading Companion exposes the content gate honestly: ten
  passages planned, zero selectable, and eight distinct first-run records
  required. `A Map Is Not a Photograph` is a structured candidate only and
  cannot be selected or scored.
- The state, view, semantic three-column layout, responsive inspector drawer,
  diagnostic routes, hub integration, and provisional fixture are implemented.
  Final validation and publication remain; this branch is not deployed.

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
- The other 19 WikiWhy deck entries are review-only drafts, not structured
  selectable records. They need passage records, three-choice comprehension and
  feedback, permanent provenance, rights notice, factual review,
  grade/sensitivity review, a reading profile, and real microphone testing
  before promotion.
- Candidate selection is fail-closed: the runtime will not score a draft or
  silently reuse one passage to imply campaign depth.
- MapGuess's two planned five-record decks are still entirely review-gated.
  Its first-run structural route requires eight distinct records; the current
  candidate is unavailable and the runtime reports zero selectable passages.
- This branch also prevents an availability-only promotion from bypassing the
  gate. `approved` records require explicit passed review states, a completed
  transcription review, and rights-basis-specific source evidence; the existing
  WikiWhy `prototype` lane remains explicit and separate.
- Worst case requires eleven readings (up to eight 10% Act I advances plus
  three Shield passes), while Deck A has ten. The content plan still needs one
  explicit Deck B overflow or repeat policy.

## Design readiness

- Shared production behavior is frozen in
  [`gameplay/SITE_PRODUCTION_SYSTEM.md`](gameplay/SITE_PRODUCTION_SYSTEM.md),
  with exact per-site contracts indexed by
  [`design/TEN_SITE_PRODUCTION_INDEX.md`](design/TEN_SITE_PRODUCTION_INDEX.md).
- ThreadIt is approved as the second implemented structural site and portability
  proof. Its
  semantic source tree must be DOM content with inline SVG connectors, not a
  flattened concept-board image.
- FacePlace's deployed state and semantic feed layout remain explicitly
  provisional/test-only pending the focused designer packet; its slot-3 test
  receipt is not canonical evidence.
- MapGuess's state and semantic map layout are executable on the current branch,
  but the fictional fixture, process mapping, blocked-write fields, and slot-10
  evidence record are provisional pending designer review.
- WikiWhy evidence slot 1 is the route-log artifact
  `wikiwhy.evidence.route-fragment-01`, visible as `AI WRITE ROUTE / 01`.
- The separate `EVIDENCE_11.LIVE` final breach is designed but must not begin
  until ten genuine sites are secured.

## Validation

- `npm run check` — passed on the MapGuess implementation branch
- Focused MapGuess tests — 43 passed across state, content, and view contracts
- Full test suite — 193 passed, including MapGuess DOM, hub-count, and
  Reading Engine separation contracts
- `npm run build` — passed on the MapGuess implementation branch
- Browser QA — the MapGuess structural runtime has been visually inspected at
  1440px and 1180px widths, including the desktop inspector and collapsed
  browser-owned drawer behavior. PR CI, Pages deployment, and public HTTPS
  verification remain publication gates.
- Deployed FacePlace CI, Pages deployment, corrupted-to-secured routes,
  evidence-open state, Recovery Map return, and spoken separator accessibility
  correction were verified publicly through `e776471`.

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
- ThreadIt is an honest structural test build with its passage content gated.
  FacePlace is a deployed provisional structural test build with a strict
  test-only evidence boundary. MapGuess is an unpublished provisional
  structural build with the same noncanonical boundary; the other six
  non-WikiWhy sites remain honest design previews.

## Immediate next milestone

### FacePlace graphics fidelity (2026-07-12)

- FacePlace now carries the canonical cobalt/aqua identity through a branded
  act ribbon, textured network paper, deeper feed cards, amplified-post flags,
  and an animated nonsense tracker without adding runtime bitmap payload.
- The act ribbon changes with the existing repaired and secured state flags;
  duplicate-card and tracker motion stop under `prefers-reduced-motion`.
- Desktop visual QA confirmed six feed cards, three amplified duplicates, the
  persistent fixed Techno companion, and no horizontal page overflow.
- The semantic feed, provisional-data boundary, independent Reading Companion,
  and wrapper/platform separation are unchanged.

### MyCorner graphics fidelity (2026-07-12)

- MyCorner now carries its canonical scrapbook/profile personality through a
  state-aware act ribbon, owner-magenta branding, taped semantic modules,
  dimensional cards, an animated template-overwrite pattern, and a clearer
  saved-profile scrapbook treatment.
- The pass adds no raster payload and preserves the canonical Mara Vale fixture,
  seven-unit owner-control contract, silent autoplay boundary, independent
  Reading Companion, and reduced-motion fallback.
- Desktop visual QA confirmed the act treatment, eleven semantic modules,
  persistent fixed Techno, and no horizontal page overflow.

### Yahuh! Portal graphics fidelity (2026-07-12)

- Yahuh now expresses its canonical retro portal/switchboard direction through
  a stronger purple identity, state-aware act ribbon, deliberately mismatched
  pasted modules, explicit `EVERYTHING PASTE` flags, channel sockets, and a
  single-stream scan treatment.
- Sorted and reconnected module states settle into the existing orderly layout;
  live channel sockets pulse only when reconnected and stop under reduced
  motion. No raster payload was added.
- Desktop visual QA confirmed all six modules, the Act I ribbon, fixed Techno,
  and no horizontal page overflow. The canonical fixture, six-unit contract,
  content gate, and independent Reading Companion remain unchanged.

### ViewTube graphics fidelity (2026-07-12)

- ViewTube now presents its semantic silent player as a CRT evidence surface
  with a state-aware act ribbon, scanline motion, glass/reflection depth,
  duplicate-frame flags, richer recommendation thumbnails, and a stronger
  editing timeline.
- The site remains media-free and silent: no video, audio, autoplay, iframe, or
  new raster payload was introduced. Reduced-motion disables scan, clone, and
  timeline animations.
- Desktop corrupted-state QA confirmed the Act I ribbon, silent-evidence badge,
  persistent fixed Techno, and no horizontal page overflow. The canonical
  seven-unit timeline and independent Reading Companion remain unchanged.

### Search-ish graphics fidelity (2026-07-12)

- Search-ish now uses its canonical indigo/teal/amber/coral source-evaluation
  system through a state-aware act ribbon, query-trail colors, a prominent
  generated-origin warning, dimensional result cards, semantic branch wiring,
  and a stronger seven-unit trail.
- Corrupted certainty drifts visually while open independent branches pulse;
  both stop under reduced motion. No external search service, iframe, remote
  content, or new raster payload was introduced.
- Desktop QA confirmed one generated answer, four result cards, three semantic
  branch gates, persistent fixed Techno, and no horizontal page overflow. The
  canonical state/evidence contracts and independent Reading Companion remain
  unchanged.

### Amaze-On graphics fidelity (2026-07-12)

- Amaze-On now carries its canonical fictional warehouse/receipt direction via
  a state-aware act ribbon, an explicit no-purchase listing badge, taped
  evidence parcels, five color-coded semantic bins, suggested-not-chosen labels,
  receipt paper, and a negative-purchase rewind treatment.
- No purchase, payment, address, account, real checkout, external commerce, or
  new raster payload was introduced. All decorative movement stops under
  reduced motion.
- Desktop QA confirmed four parcels, five evidence bins, the fictional-listing
  safety badge, persistent fixed Techno, and no horizontal page overflow. The
  canonical seven-unit consent/receipt contract and independent Reading
  Companion remain unchanged.

### Spotty-Fi graphics fidelity (2026-07-12)

- Spotty-Fi now carries its canonical charcoal/acid/magenta manual-mixtape
  direction through a state-aware act ribbon, five original geometric silent
  cards, a dark queue/control-room treatment, visual-only meter badge, history
  drift, and an eight-unit cassette-style timeline.
- No audio, video, lyrics, iframe, autoplay, remote album art, or new raster
  payload was introduced. Meter/history movement stops under reduced motion.
- Desktop QA confirmed five silent library cards, five manual queue entries,
  zero media elements, persistent fixed Techno, and no horizontal page overflow.
  The canonical eight-unit ownership contract and independent Reading Companion
  remain unchanged.

### MapGuess graphics fidelity (2026-07-12)

- MapGuess now expresses its canonical fictional navigation board through blue
  route chrome, a state-aware act ribbon, layered contour paper, map-layer
  warning labels, flowing disconnected routes, a moving-target pulse, anchor
  beacons, and a stronger route log.
- All cartography remains semantic DOM/SVG and fictional. No external map,
  iframe, real location, remote tile service, or new raster payload was added;
  route/pin/anchor movement stops under reduced motion.
- Desktop QA confirmed four corrupted map blocks, the semantic route, persistent
  fixed Techno, zero external-map frames, and no horizontal overflow. The exact
  five-rebuild plus three-anchor contract and independent Reading Companion
  remain unchanged.

1. Review the complete MapGuess diff, then publish through PR, CI, merge, Pages
   deployment, and public HTTPS verification.
2. Keep slot 10 excluded from canonical evidence counts and the final unlock
   until a persisted record matches the fixed, designer-approved registry row.
3. Replace provisional MapGuess fixture and evidence fields when the parallel
   designer supplies the canonical runtime packet; retain the frozen 5+3 state
   and semantic layout contracts.
4. Promote MapGuess content only after provenance, adaptation fidelity,
   grade/sensitivity, comprehension, profile, and real-microphone review, and
   freeze eight distinct first-run records without a silent repeat.

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

### ThreadIt desktop scanability (2026-07-12)

- The desktop ThreadIt forum feed now uses a compact two-column board so all
  six first-run posts can be scanned together without scrolling the site page.
- Feed-only metadata, avatars, and excerpts are compressed at desktop sizes;
  the independent Reading Companion type and layout are unchanged.
- Browser QA at 1440x900 measured 6 of 6 posts fully visible, a 612px page
  client/scroll height match, and no page overflow. Interactive controls retain
  the shared cyan action halo and reduced-motion-safe treatment.

### Remaining campaign desktop scanability (2026-07-12)

- FacePlace, MyCorner, and Yahuh now use desktop-only overview layouts for
  their site-side content while leaving Reading Companion typography intact.
- FacePlace presents all six feed cards in a two-column board; MyCorner shows
  all five profile modules as compact scrapbook covers; Yahuh presents all six
  portal modules in a three-column switchboard.
- Browser QA at 1440x900 measured all primary cards visible and exact outer
  client/scroll-height matches (756/756) for all three sites. Secondary detail
  remains in semantic DOM but is visually clamped in overview mode.
## Spotty-Fi candidate playthrough — active 2026-07-12

Spotty-Fi now exposes all eight complete Deck A candidates through the explicit
noncanonical playtest lane and routes them through the existing Reading
Companion. Accepted results advance the wrapper-owned five-disclosure plus
three-listener-control campaign. The saved predicted-history interruption still
requires Finn's explicit acknowledgement before the sixth passage can begin.
Playtest progress and slot-nine evidence remain tab-only; production selection,
content review, canonical evidence, and finale gates remain fail-closed. No
Reading Engine code changed. `npm run check`, all 325 tests, and `npm run build`
pass. Automated browser control was unavailable for this worktree, so live
desktop click-through remains the publication smoke check.

## Ten-site mechanics refinement — active 2026-07-13

- Every site now has an explicit Amy plus Chinmay midpoint exchange explaining
  what Finn fixed in the first half and what changes in the second half.
- Every site has an explicit two-character completion payoff naming Finn's
  repair and clearly ending that site before returning to the Recovery Map.
- Site view models expose honest completed/total and half-boundary data instead
  of deriving progress from decorative art. FacePlace retains its AVOCADO beat.
- Search-ish now shows exactly four source-route bullets in its first half;
  all four clear together before the three answer/source checks replace them.
- MapGuess now has a semantic bottom tracker that shows the target moving from
  H4 to D7 while `2 MINUTES REMAINING` refuses to change, including the vintage
  software-update joke and a reduced-motion text fallback.
- All site stages use one forced 4:3 calibration boundary at 100% browser zoom;
  unused space is letterboxed outside the stage instead of independently
  scaling image and overlay layers.
- Browser QA at 1280x720 confirmed 4:3 Search-ish and MapGuess frames, exact
  document client/scroll dimensions, four initial Search-ish rows, and a
  non-overlapping MapGuess moving-target tracker.
- Speech, scoring, microphone, and Reading Engine files were intentionally not
  changed. `npm.cmd run check`, all 354 tests, and `npm.cmd run build` pass.
