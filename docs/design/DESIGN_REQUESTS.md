# Parallel design requests

## ViewTube approved-toast-video correction — 2026-07-14

The generic winter-sky editor has been retired. ViewTube now derives all three
1024x768 WebP frames directly from the approved toast-video concept boards:
the silent toast CRT and repeated recommendation rail in Act I, the `10
COSTUMES — 1 CLIP` hash reveal at midpoint/Act II, and the footage/transcript/
evidence editing bay at completion. No new unrelated retro aesthetic was
invented.

The visible progress UI now matches the story rather than advertising a raw
passage count: four compact recording repairs in Act I, then three evidence-
track checks in Act II. The entry, midpoint, and completion cut scenes follow
the ViewTube designer notes naturally—Chinmay pitches Auto-Fix, Amy disproves
the ten-witness claim with one media hash, and Amy closes the site by naming
Finn's restored tracks and blocked clone. Five executable 1440x900 captures are
listed in `docs/design/review/README.md`.

## Screenshot-reviewed design match correction — 2026-07-13

ThreadIt and FacePlace now match their approved generated compositions nearly
edge-to-edge: cream source-tree tool for ThreadIt and blue six-card social board
for FacePlace. Dense legacy columns, clipped mini cards, washed-out artwork,
and dead space were rejected during executable screenshot review and removed.
MapGuess adds a player-visible lake-crossing route plus original and moved
destination pins. Future site-art acceptance must include screenshot inspection
for hierarchy, legibility, obvious next action, clipping, and dead space—not
only asset presence, aspect-ratio checks, or automated tests.

## Ten-site visual completion — 2026-07-13

The six remaining locked-frame builds are implemented. ThreadIt, FacePlace,
MyCorner, Yahuh, ViewTube, and Amaze-On now use optimized 1024x768 WebP bases
with semantic HTML overlays for repair state, progress, controls, and
accessibility. Final base assets are 77–134 kB each. The earlier request below
is closed; no additional P0 site-frame artwork is outstanding.

Integrated browser QA at 1280x720 covered the corrupted, midpoint, and secured
states for all nine previewable site frames. Each measured exactly 4:3 with no
page or active-screen overflow and one visible Techno. The MapGuess moving
target is legible in its bottom tracker, and the new Amaze-On midpoint was
visually checked in the executable app. Continue to use the locked-frame plus
small-overlay pattern for future revisions.

## Amaze-On approved-marketplace correction — 2026-07-13

The unrelated lamp-workshop board has been retired. Amaze-On now follows the
approved marketplace storyboard closely: Act I is a navy/orange product page
with six-out-of-five stars, Shopping Auto-Fix AI, and four sponsored results;
Act II makes the Negative Purchasing joke literal by showing one return create
two replacements; the secured frame exposes the hidden Auto-Decide permission
and restores human confirmation.

The seven repairs are no longer represented by a raw count or seven detached
blank boxes. Four Act I checks sit on the four visible sponsored claims, then
three Act II checks sit on the receipt/return evidence. Browser review at
1440×900 covered the clean Act I board, Amy and Chinmay midpoint messages, Act
II, and both completion messages. The executable review captures are listed in
`docs/design/review/README.md`. No Reading Engine or speech work changed.

## Player-review visual direction — checkpoint 5b5613d

The live review checkpoint is
<https://chinmay856.github.io/finn-reading-game/?build=5b5613d>. Search-ish,
Spotty-Fi, and MapGuess are the first examples of the requested locked-frame
hybrid: one playful fixed-aspect illustrated base plus small semantic HTML
overlays for changing repair text, progress, and controls. Their current bases
are under `apps/internet-recovery/art/site-assets/*-frames/`.

Next art priority is to bring ThreadIt, FacePlace, MyCorner, Yahuh, ViewTube, and
Amaze-On up to the visual quality of their Recovery Map thumbnails. Each site
needs one stable 4:3 composition and a repair sequence in which one red/corrupt
element changes in place to green/clean without geometry, crop, or palette
jumping. Prefer fewer, stronger elements and playful Easter eggs over dashboard
boxes. Do not bake `Act`, `fixture`, `provisional`, `canonical`, `candidate`, or
repeated `fictional` notes into the art. Optimize bases to WebP and keep state
differences as small overlays when practical. Full acceptance criteria and the
implementation/QA order are in `docs/PLAYTEST_REVIEW_HANDOFF_2026-07-13.md`.

## Compact persistent-Techno motion pack — requested 2026-07-12

Implementation now keeps Techno visible and animated on every game screen using the existing ball-drop idle loop. Please provide a compact behavior pack so her motion can vary by context.

Acceptance criteria:

- Three transparent WebP loops: walk/sniff, alert-point, and sit/tail-wag.
- Matching still WebP fallback for every loop.
- Shared canvas, anchor point, scale, and right-facing orientation so variants swap without layout movement.
- Each loop at or below 150 kB and each still at or below 30 kB after optimization.
- No text, UI chrome, screen-specific background, or baked-in status meaning.
- Confirm whether horizontal mirroring is allowed; current canon keeps Techno facing and pushing right.

Focused questions: Should Techno ever cross in front of a Reading Companion window, or stay on the desktop rim beside it? Which of the three behaviors should be the default during active read-aloud?

## Endgame visual request status — 2026-07-12

Designer PR #46 is consumed. The runtime uses the approved `EVIDENCE_11.LIVE`, containment route, evidence vault, access-revoked badge, Amy/Chinmay states, and Techno mappings. No additional visual or art-direction request is outstanding. The remaining checkpoint gate is independent content, accessibility, transcription-profile, and real-microphone review rather than missing design collateral.

## Canonical evidence reconciliation

- FacePlace PR #37 and MapGuess PR #44 are now fully consumed for their exact
  evidence registry rows and blocked-write routes.
- No designer decision is outstanding for slots 3 or 10. The remaining finale
  blocker is content/runtime approval, not evidence identity.

## Spotty-Fi integration status

- Runtime response PR #43 and the complete A01-A08 manuscript roster are
  integrated on `agent/spottyfi-history-proof-foundation`.
- No visual or asset question is outstanding. The runtime uses only the frozen
  mark, DOM/CSS covers, shared character crops, and Techno queue-guard asset.

## Amaze-On integration status

- Runtime response PR #42 and the complete A01-A07 roster from PR #53 are
  integrated into `agent/amazeon-consent-ledger-foundation`.
- No visual or asset request is outstanding. The existing Amaze-On mark,
  semantic parcels and bins, receipt treatment, shared characters, and
  `techno-alert-ball-pin.webp` satisfy the frozen response.

## 2026-07-12 current builder queue

- Nine structural site runtimes are on `main`: WikiWhy, ThreadIt, FacePlace,
  MapGuess, MyCorner, Yahuh, ViewTube, Search-ish, and Amaze-On. WikiWhy remains
  the only speech-playable site; the other integrated sites remain honestly
  gated until their content records pass independent review and real-microphone
  checks.
- Search-ish shipped through builder PR #62. Designer PR #41 and content PR #51
  are fully consumed; its canonical Techno mapping is
  `searchish.techno.generated-cache-alert` to
  `techno-paw-alert-still.webp`.
- ViewTube's former `techno_clue_point` request is closed. PR #40 freezes
  wrapper asset ID `viewtube.techno.secured-ball-pin` to
  `apps/internet-recovery/art/characters/techno/techno-alert-ball-pin.webp`.
  Accessible meaning: Techno pins her orange-and-blue ball beside the original
  media hash while duplicate playbacks remain quarantined. No new raster,
  audio, or video asset is required.
- Amaze-On shipped through builder PR #64 with the frozen Orbit Bounce Ball
  payoff and consent ledger. Designer PR #42 is fully consumed.
- Spotty-Fi is the sole remaining site build and is ready from PR #43. Its
  complete first-run manuscript roster is already on `main` through PR #54,
  including the exact Techno, Amy, and Chinmay mappings.
- MapGuess's canonical runtime replacement is in PR #44 and its complete
  first-run manuscript roster is already on `main` through PR #58.
- The `EVIDENCE_11.LIVE` finale contract and three checkpoint manuscripts are
  ready in PR #46, but implementation remains gated behind ten genuinely
  secured sites.
- The index merged through PR #59 records every complete first-run manuscript
  roster. Manuscript completion does not promote content: runtime encoding,
  source/rights review, grade and sensitivity review, comprehension/profile
  review, and real
  microphone testing remain explicit gates.

No unanswered P0 design or art request is known at this synchronization point.

## 2026-07-12 builder reconciliation

- Designer PR #38 answered the complete MyCorner runtime packet. The active
  implementation uses the frozen Mara Vale fixture, 7A plus 3B plan, responsive
  drawer contract, process lineage, and canonical slot-four evidence row.
- Designer PR #39 answered the Yahuh runtime packet. The active implementation
  uses the exact six-module fixture, 6A plus 4B plan, process lineage,
  responsive drawer, Techno payoff, and canonical slot-five evidence row.
- Designer PR #37 answers the shared ThreadIt, WikiWhy, and FacePlace runtime
  backlog; it remains queued for a scoped reconciliation so deployed behavior
  is not mixed into the MyCorner PR.
- No new MyCorner P0 art request is outstanding. Existing initials, DOM/CSS
  theme fragments, shared character crops, and Techno still are sufficient.
- No new Yahuh P0 art request is outstanding. The existing mark, semantic DOM,
  CSS modules, shared Chinmay crop, and `techno_alert_ball_pin` satisfy PR #39.

This is now the builder-owned design and implementation checklist for Internet
Recovery 98. Resolve remaining decisions directly in scoped implementation PRs
and record durable rationale here or in linked response documents.

## Current synchronization point

- Implementation branch: `agent/mapguess-moving-target-foundation`
- Last integrated design tip: `1f843bc` (`Add ten-site production overview board`)
- Deployed `main`: `e776471` through PRs #34 and #35; FacePlace CI, Pages, and
  public HTTPS diagnostic verification passed
- MapGuess publication state: implemented and locally captured, but not yet
  committed, pushed, merged, deployed, or verified on public HTTPS
- Designer response consumed:
  [`BUILDER_RESPONSE_2026-07-12.md`](BUILDER_RESPONSE_2026-07-12.md)
- Production index:
  [`TEN_SITE_PRODUCTION_INDEX.md`](TEN_SITE_PRODUCTION_INDEX.md)
- WikiWhy contract:
  [`../gameplay/WIKIWHY_CAMPAIGN_STATE_PACK.md`](../gameplay/WIKIWHY_CAMPAIGN_STATE_PACK.md)
- ThreadIt contract:
  [`../gameplay/THREADIT_PRODUCTION_HANDOFF.md`](../gameplay/THREADIT_PRODUCTION_HANDOFF.md)
- Focused FacePlace runtime response packet:
  [`FACEPLACE_RUNTIME_REQUEST.md`](FACEPLACE_RUNTIME_REQUEST.md)
- Focused MapGuess runtime response packet:
  [`MAPGUESS_RUNTIME_REQUEST.md`](MAPGUESS_RUNTIME_REQUEST.md)
- Exact remaining runtime-data backlog for sites two through ten and the final
  breach:
  [`RUNTIME_FIXTURE_BACKLOG.md`](RUNTIME_FIXTURE_BACKLOG.md)

The complete production package through `1f843bc` is integrated. Do not
republish it unchanged merely to acknowledge this handoff.

## Decisions already consumed

| Design decision | Builder status |
| --- | --- |
| Exactly three Incoming Cases: WikiWhy, ThreadIt, MapGuess before WikiWhy; ThreadIt, MapGuess, ViewTube after | Implemented |
| `ai_repair_service` owns the ended-command write | Implemented; the earlier `wiki_auto_fix_ai` drift is removed |
| 70–79% right-edge clue and readable background-write log | Implemented as semantic DOM/CSS with reduced-motion fallback |
| 80% saved-versus-AI comparison | Implemented with all three production rows |
| Amy evidence/tools/supportive and Chinmay fluster mappings | Implemented from approved production-sheet crops |
| Exactly three Shield passes; comprehension and score cannot add or remove a pass | Implemented |
| Continue remains available after an accepted uncertain result; retry stays optional | Preserved |
| Evidence slot 1 is `wikiwhy.evidence.route-fragment-01`, visible as `AI WRITE ROUTE / 01` | Implemented with `evidence-route-fragment-01.svg` and `WIKIWHY_TRACE_01.LOG` |
| ThreadIt is site 2 and uses an accessible semantic source tree | Shipped through PR #33 and verified on public HTTPS |
| ThreadIt uses four Act I units, explicit midpoint acknowledgement, exactly three trace units, and permanent secured/evidence state | Shipped as a seven-pass wrapper diagnostic with no reading score |
| ThreadIt evidence is `THREADIT / SYNTHETIC CONSENSUS OVERFLOW` and the blocked write is `POSTING PAUSED: DUPLICATE SOURCE` | Shipped in the secured source tree and Case File slot 2 |
| After WikiWhy and ThreadIt are secured, Incoming Cases rotate to FacePlace, Spotty-Fi, and Search-ish | Shipped; FacePlace opens its own provisional structural test runtime while remaining `MIC: OFF` |
| FacePlace uses three false-tracker units, Honest Zero acknowledgement, and three honest-recovery units | Shipped through PR #34; the spoken-separator live-QA fix shipped through PR #35 |
| Provisional FacePlace slot-3 evidence cannot count canonical or unlock the final incident | Shipped and verified on public HTTPS in the hub/evidence-state boundary |
| MapGuess uses five map-rebuild units, Moving Target acknowledgement, and three destination-anchor units | Implemented locally on the active branch with no generic percentage; publication and deployment remain pending |
| All four MapGuess goals are valid wrapper choices and the final unit requires one explicit goal | Implemented locally for `fastest`, `safest`, `scenic`, and `accessible`; no speech or comprehension score chooses it |
| Provisional MapGuess slot-10 evidence cannot count canonical or unlock the final incident | Implemented locally with visible filename `PROVISIONAL_MAPGUESS_10.LOG`; all fixture and evidence IDs remain test-only |
| The ten-site production system and separate `EVIDENCE_11.LIVE` contract | Integrated; final breach remains gated behind ten real secured sites |

## Current implementation review captures

- [Recovery Map](review/recovery-map-current.jpg)
- [WikiWhy ordinary reading](review/wikiwhy-reading-current.jpg)
- [70–79% background-write warning](review/wikiwhy-warning-v3.png)
- [Unobstructed 70–79% route clue](review/wikiwhy-clue-v3.png)
- [80% rogue-AI write and comparison entry](review/wikiwhy-rewrite-v3.png)
- [Saved repair versus AI rewrite](review/wikiwhy-compare-v3.png)
- [Shield Protocol](review/wikiwhy-shield-v3.png)
- [Shield pass 2 source links](review/wikiwhy-shield-links-v3.png)
- [Shield pass 3 write access](review/wikiwhy-shield-access-v3.png)
- [Secured route-log payoff](review/wikiwhy-secured-v3.png)
- [User-opened evidence route](review/wikiwhy-evidence-open-v3.png)
- [Blocked autonomous write](review/wikiwhy-blocked-write-v3.png)
- [Secured Recovery Map and Case File](review/recovery-map-secured-v3.png)
- [ThreadIt corrupted state](review/threadit-corrupted-v1.jpg)
- [ThreadIt first untangle](review/threadit-untangle-1-v1.jpg)
- [ThreadIt midpoint trace](review/threadit-tracing-v1.jpg)
- [FacePlace corrupted state](review/faceplace-corrupted-v1.png)
- [FacePlace Honest Zero at 1180 CSS pixels](review/faceplace-honest-zero-1180-v1.png)
- [FacePlace secured state](review/faceplace-secured-v1.png)
- [MapGuess corrupted state](review/mapguess-corrupted-v1.png)
- [MapGuess Moving Target](review/mapguess-moving-target-v1.png)
- [MapGuess provisional evidence](review/mapguess-evidence-v1.png)
- [MapGuess inspector drawer at 1180 CSS pixels](review/mapguess-inspector-1180-v1.png)

These are executable browser screens at the 1440×900 target, not composite
concept boards. ThreadIt and FacePlace also pass their 1180 CSS-pixel fallbacks,
and their complete diagnostic routes are verified on deployed public HTTPS.
MapGuess has local 1440 and 1180 captures, but its branch is not yet published
or deployed. Only `photosynthesis-a01` is speech-playable; review-only and
candidate passage records remain fail-closed.

## Builder-owned follow-up — ThreadIt content review packet

ThreadIt's complete seven-record first-run Deck A is now encoded as structured
candidate data. The runtime contract has been corrected from the stale `5A +
5B` declaration to the manuscript packet's frozen `7A + 3B` plan. No new record
is selectable, and none should be described as approved yet.

Please review the six original A02–A07 records in
`content/threadit/first-run-passages.js` against their frozen manuscript source
in `content/threadit/FIRST_RUN_MANUSCRIPTS_A02_A07.md` and answer these focused
questions:

1. Does each structured record preserve the exact frozen prose, prompt, and
   three answer choices?
2. Are the shared correct/incorrect feedback lines acceptable for all six, or
   should any record receive passage-specific feedback? Return exact replacement
   copy where needed.
3. Are any phrases likely to create avoidable accessibility, sensitivity, or
   microphone-transcription problems? Name the exact passage ID and token.
4. Confirm that A06 and A07 belong in first-run Deck A and that only B01–B03
   remain in ThreadIt's planned replay Deck B.

Acceptance evidence should be a committed Markdown review under
`docs/design/review/` naming the reviewed commit and each passage ID. This can
resolve design/editorial questions, but it must not claim a real-microphone run
or promote `availability`; those gates remain independent.

## Builder-owned follow-up — FacePlace content review packet

FacePlace's complete six-record first-run Deck A is now encoded as structured
candidate data. `why-this-appeared-a06` has been moved from the obsolete B04
placeholder into its frozen first-run A06 position, eliminating the former
one-passage shortfall while keeping every new record unselectable.

Please review `content/faceplace/first-run-passages.js` against
`content/faceplace/FIRST_RUN_MANUSCRIPTS_A02_A06.md` and return a committed
revision-bound review under `docs/design/review/` that:

1. confirms exact prose, prompt, and three-choice fidelity for A02–A06;
2. approves the A06 Deck A placement and resulting `6A + 4B` plan;
3. supplies exact passage-specific feedback replacements where the shared
   feedback is too generic;
4. names any accessibility, sensitivity, factual, or likely microphone-risk
   token by passage ID.

This review must not claim a real-microphone run or change `availability`.
Those independent evidence gates remain fail-closed.

## Builder-owned follow-up — MyCorner content review packet

MyCorner's complete seven-record first-run Deck A is now structured. Review
`content/mycorner/first-run-passages.js` against the frozen A02–A07 manuscript
and publish a revision-bound response under `docs/design/review/` confirming:

1. exact prose, prompt, and choice fidelity for every ID;
2. whether shared feedback needs passage-specific replacements;
3. any accessibility, sensitivity, factual, or microphone-risk tokens;
4. that the existing `7A + 3B` order remains canonical.

Do not claim microphone evidence or promote availability in the design response.

## Outstanding designer decisions

### P0 — Canonical MapGuess runtime fixture and eight-reading manifest

MapGuess now runs the complete five-plus-three structural test locally: five
map-rebuild units; explicit Moving Target acknowledgement; three
destination-anchor units; a required choice among `fastest`, `safest`, `scenic`,
and `accessible`; a denied destination move; and a slot-10 test receipt. The
fictional grid, places, coordinates, map records, route variants, process IDs,
blocked target, and evidence are executable scaffolding, not canonical data.
Every current ID is provisional/test-only, excluded from canonical counts, and
unable to unlock the final incident.

Please answer the focused packet in
[`MAPGUESS_RUNTIME_REQUEST.md`](MAPGUESS_RUNTIME_REQUEST.md). It requests the
canonical fictional map incident and one-to-one eight-unit assignments; all
four honest route variants; local process and upstream service mapping; the
complete slot-10 evidence registry row and blocked target; midpoint
before/after records; character and asset sufficiency; eight distinct reviewed
first-run records; and the 1180 CSS-pixel right-inspector drawer decision.

The content gate is currently ten planned, one structured candidate, zero
selectable, and eight required. `A Map Is Not a Photograph` is the sole
structured candidate and remains unavailable for speech scoring. Builder
recommendation: return one compact original fictional data fixture, retain
semantic DOM/CSS/inline SVG with no external tile service or real location, and
name either three A06-A08 additions or three explicit reviewed Deck B
overflows. Do not promote the candidate merely by assigning its deck position.

### P0 — Canonical ThreadIt forum fixture

The ThreadIt state, semantic source-tree layout, repair-unit order, tokens,
copy IDs, and approved SVG assets are sufficient for implementation. The one
missing runtime artifact is the actual forum post dataset. Please provide a
compact canonical fixture with:

- the original question title/body, author label, and timestamp;
- four to six reply records with author labels, timestamps, vote counts, and
  parent relationships, using stable record and origin IDs;
- the exact citation/source text introduced by one reply;
- the exact two replies that form the disclosed duplicate group;
- the stable generated-clone-group ID and blocked-post target ID;
- the reply that appears above the displaced question in the corrupted state;
- concise accessible relationship summaries for the source-tree nodes.

Do not create another board or background image. Plain Markdown, JSON, or a
small table is ideal. The builder will use clearly labeled provisional
wrapper-owned fixture text so this request does not block the semantic runtime,
then replace it without changing the frozen state IDs or repair units.

### P0 — First-run passage 11

The minimum 10% Act I advance can require eight Act I readings plus exactly
three Shield readings: eleven total. Deck A has ten records. Choose one:

1. **Approve one reviewed Deck B overflow record.** Builder recommendation:
   `printing-press-b01`, after the normal source, rights, factual, grade,
   sensitivity, comprehension, profile, and microphone gate.
2. Approve one explicitly disclosed least-recent Deck A repeat.

The builder will not silently score a candidate or repeat one passage to imply
depth. This decision changes wrapper selection policy only; it does not promote
content by itself.

### P0 — Post-secured replay

Specify where Deck B replay lives after WikiWhy is secured and how it remains
separate from canonical campaign state. Please decide:

- Recovery Map action, Finn's Files action, or secured WikiWhy browser action;
- visible label for the replay lane;
- whether replay stores a separate non-audio history cursor;
- confirmation that replay can never change `secured`, Shield checkpoints,
  Case File evidence, or the route-log receipt.

Builder recommendation: expose `Open alternate recovered files` inside secured
WikiWhy, with a separate replay cursor and no campaign-state writes.

### P0 — Canonical FacePlace runtime fixture and identities

FacePlace now runs the complete six-unit shape with a fictional six-card fixture,
relationship/source views, feed-order and Why controls, Honest Zero, an exact
blocked target, and a slot-3 test receipt. This is executable scaffolding, not
canonical data. Every current fixture and evidence ID is replaceable,
provisional/test-only, excluded from canonical counts, and unable to unlock the
final incident.

Please answer the focused packet in
[`FACEPLACE_RUNTIME_REQUEST.md`](FACEPLACE_RUNTIME_REQUEST.md). It requests the
canonical identities/posts/source graph and one-to-one six-unit assignments;
initial tracker; process mapping; complete evidence registry row and blocked
actor/target; Chinmay midpoint omission/copy; asset sufficiency; sixth first-run
record and Deck placement; post-FacePlace Incoming Cases/global beat; counter
copy drift; and the 1180 CSS-pixel left-rail drawer decision.

Builder recommendation: use original fictional people and posts, retain
`FEED AUTO-FIX AI` as the player-facing process name, approve semantic DOM/CSS
for the feed and tracker, fire the global beat after the local evidence payoff,
and avoid another full-board mockup.

### P0 — FacePlace six-reading first-run manifest

The canonical FacePlace state contract requires six distinct accepted readings
(three lying-tracker repairs and three honest-recovery units), while planned
Deck A currently contains five slots. Choose one:

1. Expand Deck A to six records by promoting planned `Why This Appeared` from
   B04 to `why-this-appeared-a06`. This is the builder recommendation.
2. Keep the current deck labels and explicitly designate one reviewed Deck B
   record as first-run overflow.

`A Second Reading` is now encoded as a structured candidate and remains
unselectable. Please freeze its intended ID and Deck A/B position as part of the
six-record answer. It still requires provenance, adaptation fidelity, grade,
sensitivity, three-choice comprehension, reading profile, and real-microphone
review. The builder will not score candidate text or silently repeat a passage
to fill the sixth unit.

## Next builder checkpoint

All ten structural runtimes and their visual-fidelity passes are merged and
publicly deployed. ThreadIt, FacePlace, and MyCorner now have complete structured
first-run candidate rosters. Continue encoding Yahuh, ViewTube, Search-ish,
Amaze-On, Spotty-Fi, and MapGuess manuscripts, then resolve the remaining
fixture/copy checklist items directly. Keep all candidates fail-closed until
independent review and real-microphone evidence exist.

## Boundaries for design responses

- Do not put site names, thresholds, evidence, character state, or replay state
  in the Reading Engine, speech adapter, or theme-neutral strength calculation.
- Do not promote passage text without provenance, rights, factual, grade-level,
  sensitivity, comprehension, profile, and real-microphone review.
- Keep the Recovery Desktop stable during ordinary sites.
- The AI service is the hostile writer. Chinmay remains responsible, sincere,
  long-haired, and increasingly flustered—not malicious.
- Only Reading Companion text is speech-scored.

When a remaining request is answered, record the decision and design commit in
this file or a linked response file. That gives implementation agents an
objective synchronization point instead of relying on chat history.

## 2026-07-14 visible-progress and decorative-control rule

- Never show a passage, repair, or unit fraction unless the same screen exposes
  the same number of trackable visual items. Each increment must visibly change
  one of those items, normally from a missing mark to a restored check.
- A control that does not perform an action is illustration, not a button.
  Image-led sites may draw decorative playback, map, or browser controls inside
  the 4:3 artwork, but must not place a second fake interactive layer over them.
- Before accepting an image-led build, open it at the forced desktop viewport,
  capture the corrupted, midpoint, Act II, and completion states, and inspect
  for overlap, clipping, misleading controls, and progress that is not visible.
- Spotty-Fi is the reference correction: five album-card checks in Act I,
  three listener-control checks in Act II, no numeric repair banner, and no
  simulated player. Review evidence is listed in `docs/design/review/README.md`.

## 2026-07-13 mechanics synchronization

- Builder branch: `agent/game-mechanics-refinement` from `afa3152`.
- The shared site-stage contract is now a forced 4:3 letterboxed canvas at
  100% browser zoom. Future site art must preserve one base-frame crop and
  stable overlay coordinates within that boundary.
- Midpoint and completion are no longer art-only states: every site view model
  carries Amy and Chinmay copy plus exact progress/phase data, and runtime
  transitions open the two-person exchanges.
- Search-ish's approved executable count is four visible result/source routes
  before midpoint, followed by three source/answer checks. Do not draw five
  first-half bullets in a replacement frame.
- MapGuess's bottom tracker is an executable semantic overlay. At midpoint it
  must visibly show `YOU ASKED FOR · H4` moving to `TARGET MOVED HERE · D7`
  while the estimate remains two minutes; secured state shows H4 to H4.
- Visual builds are still uneven across the other image-led sites. Any new art
  should target the shared 4:3 boundary and must not replace semantic progress,
  dialogue, focus, or reduced-motion behavior with baked text.
