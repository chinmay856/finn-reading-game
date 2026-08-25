# MapGuess production contract v2

Status: preflight for the next Chinmay review. The v8 bookends are the reviewed
working baseline, not a final visual freeze.

## Story contract

### Lesson

The route should serve the destination Finn chose. Recommendations and paid
places may remain optional, but they may not replace the destination or distort
the route and ETA.

### Scenario

Finn starts at home in Noe Valley and asks for directions to the nearby library.
The corrupted route planner inserts three sponsored waterfront distractions,
draws a city-wide loop, suppresses useful San Francisco labels, and claims both
the loop and the direct route take five minutes.

### First-run payoff

Four accepted passages:

1. clear irrelevant sponsored clutter;
2. restore useful San Francisco labels and replace `HOTTEST SPOTS IN TOWN`
   with `SAN FRANCISCO`;
3. restore truthful ETAs;
4. restore the library as Finn's selected destination and make the direct
   library route primary, leaving the sponsored stop optional.

The fourth repair returns the reviewed v8 repaired bookend.

### Chinmay shortcut and Auto over-fix

Working dialogue job, not final popup copy:

- Chinmay: `The route and ETA were confusing, so I told Auto to make sure Finn
  always gets a great destination with a fast ETA.`
- Auto: `FAST ETA GUARANTEED. DESTINATION WILL MOVE UNTIL PERFECT.`
- Amy: Auto made every ETA look good by moving the library. Finn's destination
  must stay fixed while the route changes.

The over-fix fills the city with unlabeled Snack Palace icons while exactly one
library marker jumps between sponsored locations. Auto is eager and literal,
not malicious. Small in-world status copy and a Bluetooth joke may appear, but
the map must carry the joke.

### Moving-target recovery

This mission intentionally does not use a multi-item repair checklist. The same
green single-item overlay—`GO DIRECTLY TO THE LIBRARY`—appears at each target.
Each of the first three attempts visibly changes from an open circle to a red X
before the library jumps to the next sponsored location. Reusable Amy and
Chinmay dialogue can explain the failures between those site states later. The
destination-lock meter remains at zero because none of those attempts holds.
The fourth try finally locks the real library and restores the direct route all
at once.

### Secured payoff

The final clean state returns to the reviewed v8 repaired bookend. Working Auto
receipt: `LEARNED: OPTIMIZE THE ROUTE, NOT THE DESTINATION.` Exact dialogue and
reflection copy remain a later human review layer.

## State ledger

| # | State ID | Visible delta | Meter | Required content | Prohibited content |
|---:|---|---|---:|---|---|
| 1 | initial | Three paid destinations dominate; the recommended route travels to a waterfront Snack Palace before returning to the nearby library; both routes claim five minutes | 0% | long red detour, minimized direct route, three bespoke paid markers | real landmark labels |
| 2 | clutter-cleared | Two irrelevant paid callouts and list entries disappear; Snack Palace remains inserted | 25% | one dominant paid waypoint, same unresolved route and copy | green route |
| 3 | labels-restored | Small haloed San Francisco landmark labels return; bottom map label becomes `SAN FRANCISCO` | 50% | same red loop and unresolved destination; green label signal | opaque real-place pills |
| 4 | eta-restored | Loop changes from false five minutes to truthful forty-five; direct route remains five | 75% | stable routes; corrected ETA signal | changed destination wording |
| 5 | destination-route-restored | Planner and book marker identify Noe Valley Library; direct green route becomes primary and Snack Palace becomes optional | 100% | reviewed v8 repaired bookend | unresolved red content |
| 6 | auto-overfix | Unobscured Auto takeover: Snack Palaces fill the city while one library marker owns the route | 0% | destination rewritten, route visibly follows the moved library, Auto status joke | standard checklist, repeated library markers |
| 7 | target-lock-ready-1 | Single repair overlay appears at the first false library | 0% | `GO DIRECTLY TO THE LIBRARY`, red open circle; the Reading Companion owns the next action | multiple checklist items, duplicate `TRY THE REPAIR` prompt inside the site art |
| 8 | target-lock-failed-1 | Same overlay Xes out before the target moves | 0% | red X, `DIDN'T LOCK · CONTINUE`, unchanged target | premature destination jump |
| 9 | target-lock-ready-2 | Library jumps downtown and the same repair resets | 0% | next active target, open circle | retained failed X |
| 10 | target-lock-failed-2 | Second attempt visibly fails | 0% | red X on the same downtown target | progress fill |
| 11 | target-lock-ready-3 | Library jumps to the Presidio and the same repair resets | 0% | next active target, open circle | multiple repair items |
| 12 | target-lock-failed-3 | Third attempt visibly fails | 0% | red X on the same Presidio target | premature green route |
| 13 | target-lock-ready-4 | Library jumps south for one final try | 0% | final false target, open circle | failed state before input |
| 14 | destination-secured | Final try succeeds; false target clears and the real library/direct route return together | 100% | reviewed repaired state, secured status | stale red target, overlay |
| 15 | repair-secured | Clean reviewed repaired bookend | 100% | exact secured site state | Auto takeover, red route, overlay |

Internal state IDs may describe implementation phases; player-facing screens
must not use `Act`, `Phase`, passage counts, or repair counts.

## Module-purpose ledger

| Module | Purpose | First affected | Last affected | Job |
|---|---|---|---|---|
| MapGuess header and navigation | persistent parody cue | — | — | Make the site immediately read as a retro route planner |
| Illustrated San Francisco base | persistent parody cue | — | — | Stable flat geography and streets for every route |
| Real landmark labels | repair target | labels-restored | repair-secured | Restore useful orientation without covering the map |
| Home and library glyphs | repair target | destination-restored | repair-secured | Keep Finn's start and chosen destination explicit |
| Primary and alternative routes | repair target | eta-restored | repair-secured | Show route hierarchy, ETA truth, and final direct path |
| Sponsored destination markers | repair target | clutter-cleared | destination-secured | Carry both the paid-detour joke and moving-target over-fix |
| Route planner destination field | repair target | destination-restored | destination-secured | Show whether the system preserved or rewrote Finn's goal |
| ETA and route cards | repair target | eta-restored | route-restored | Correct misleading timing and route priority |
| `ON YOUR WAY` / nearby list | repair target | clutter-cleared | route-restored | Separate optional suggestions from navigation |
| Site-specific progress bar | persistent progress | initial | repair-secured | Show map repair / destination stability independently of passage progress |
| Moving-target overlay | repair target | target-lock-ready-1 | target-lock-ready-4 | Repeat one repair; visibly X each failed attempt before moving the target |
| Reading Companion and characters | shared reusable layer | — | — | Never redraw inside MapGuess artwork |

Everything else is removed. In particular: no ornamental vehicles, decorative
tourist clutter, generic dollar pins, instructional design prose, or duplicated
status labels.

## QA contract

- 15 fixed 1440 x 900 states in the reviewed shared shell.
- Four first-run repairs plus four attempts at one repeated moving-target repair.
  The three failures each receive their own red-X frame before the target moves;
  the fourth attempt succeeds all at once.
- V8 illustrated map raster identity remains fixed in all states.
- Routes use explicit street-following polylines; no route crosses water.
- Unresolved red destination, ETA, route, and paid-callout copy remains byte
  stable until its named repair.
- Each repaired target changes in the underlying site in the same frame that its
  meter or overlay advances.
- Real labels use small haloed text; paid destinations use distinct generated
  icons and bounded callouts.
- Auto over-fix is shown once without an overlay and contains ten unlabeled
  Snack Palace icons plus one obviously moved library destination.
- The takeover, intro, and each failed state show exactly one active false
  library in a new location. No red target circle is drawn. The
  destination-lock meter stays at zero until the final success.
- The clean secured state contains no canonical corruption red and matches the
  reviewed v8 repaired bookend in site content.
- No variable text, route, icon, or overlay may escape its declared bounds.
- Map, site progress, and Reading Companion passage progress remain independent.
- Click-through must reference the exact validated exports with a cache-busted
  review URL.

## Reviewed baseline assets

Relative to `docs/design/screens/2026-08-15/non-wikiwhy-bookends/`:

- `mapguess-bookends-v8.svg`
- `mapguess-bookends-v8_p1.png`
- `mapguess-bookends-v8_p2.png`
- `mapguess-san-francisco-illustrated-v8.png`
- `MAPGUESS_DESIGN_HANDOFF_V8_2026-08-21.md`
