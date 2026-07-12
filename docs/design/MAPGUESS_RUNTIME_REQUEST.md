# MapGuess runtime data request

This is the focused implementation-to-design packet for the MapGuess Moving
Target milestone. Please answer with one compact Markdown, JSON, or JavaScript
data file and publish its commit on the design pull request. Stable IDs,
accessible geometry summaries, and explicit omissions are more useful than
another full-board mockup.

## Synchronization point

- Deployed `main`: `e776471` through PRs #34 and #35; FacePlace CI, Pages, and
  public HTTPS diagnostic verification passed.
- Active implementation branch: `agent/mapguess-moving-target-foundation`.
- Publication state: implemented and locally captured, but not yet committed,
  pushed, merged, deployed, or verified on public HTTPS.
- Last integrated design tip: `1f843bc`.
- Executable MapGuess shape: five map-rebuild units, explicit Moving Target
  acknowledgement, three destination-anchor units, then a blocked destination
  move and slot-10 test receipt.
- Content gate: ten planned records, one structured candidate, zero selectable
  records, and eight distinct first-run readings required.
- Only WikiWhy is currently speech-playable.

The local branch already has a responsive semantic map built from DOM, CSS, and
inline SVG; directions and four-goal controls; a fictional ten-by-ten grid;
map metadata, terrain, water, roads, landmarks, and a sponsored-stop inspector;
the exact Moving Target proof; a permanent secured payoff; and a Recovery Map
receipt. It does not use a real location, external tile service, copied map
data, or a navigation-provider API.

Every current place, coordinate, route, process-local ID, blocked target,
evidence field, and content record is deliberately **provisional/test-only**.
The visible test receipt is `PROVISIONAL_MAPGUESS_10.LOG`, with provisional
logical ID `mapguess.evidence.provisional-test.moved-destination-pin-01`. It is
excluded from canonical evidence counts and **cannot unlock the final
incident**. The current fixture is executable scaffolding, not design canon.

## P0 response packet

### 1. Canonical fictional incident and eight-unit assignments

Supply one entirely original fictional map dataset containing:

- a stable coordinate-system ID and accessible description;
- one start and one intended destination, each with stable IDs, names,
  coordinates, and accessible summaries;
- the moved destination/sponsored stop and its exact disclosure;
- the original and moved destination coordinates used by the midpoint proof;
- stable tile/feature IDs and restored place-name records;
- scale, map date, source identity, terrain, and water-boundary records;
- roads and route segments with stable IDs and accessible geometry summaries;
- exactly three landmarks with coordinates and accessible anchor summaries;
- the fixed road-geometry record used to prove that the road did not move; and
- a one-to-one assignment of objective fixture changes or proofs to all eight
  campaign units.

The state contract is frozen as five rebuild units followed by three anchor
units, with no generic percentage:

| Order | Saved unit | Required result |
| ---: | --- | --- |
| 1 | `tiles_names` | map tiles and place names clarify |
| 2 | `scale_date` | scale, date, and map source return |
| 3 | `terrain` | terrain and water boundaries return |
| 4 | `route_segments` | route segments reconnect to roads |
| 5 | `destination_inspector` | destination coordinates and landmark inspector return |
| midpoint | acknowledgement, not a reading | Moving Target proves that the destination moved |
| 6 | `landmark_1` | first landmark anchors the original coordinate |
| 7 | `landmarks_2_3` | second and third landmarks triangulate the destination |
| 8 | `goal_route_lock` | chosen goal and destination lock; honest route saves |

The current local fixture uses Morrow Signal Yard at B8, Glasswater Archive at
H4, the sponsored Instant Arrival Pavilion at D7, and three named landmarks
only so the runtime can be tested. Replace every one of those records if the
canonical incident differs; do not canonize them by copying their provisional
IDs into the response.

### 2. Four honest route-goal variants

Supply one route variant for each valid goal:

- `fastest`
- `safest`
- `scenic`
- `accessible`

Each variant must preserve the same intended destination and provide stable
route-segment IDs, directions, an honest ETA display and basis, a concise
tradeoff, and an accessible summary. All four choices are valid; none is a
correct-answer quiz, comprehension result, or speech score.

Confirm the interaction boundary already implemented from the production
brief: selection opens after Finn acknowledges Moving Target, remains changeable
until the final `goal_route_lock` reading starts, becomes locked on secure, and
is recorded in the final receipt.

### 3. Local process, canonical evidence, and blocked write

Define the relationship between player-facing `ROUTE AUTO-FIX AI` and upstream
hostile service `ai_repair_service`. Freeze the local process ID, writer
fingerprint, actor ID, and exact target of the denied destination move.

Provide the canonical Case File slot-10 registry row with:

```text
siteId
slot
evidenceId
assetId                 # nullable
filename
title
shortLabel
principle
whatChanged
aiBehavior
localWriterFingerprint
upstreamServiceId
writeObservedAt         # or deterministic traceOrder
routeGoalField          # exact field that persists the selected valid goal
routeFragment.id
routeFragment.from
routeFragment.fromLabel
routeFragment.to
routeFragment.toLabel
routeFragment.relationshipLabel
routeFragment.accessibleSummary
blockedWriteId
blockedActorId
blockedTargetId
```

The blocked label remains `DESTINATION LOCKED - USER CHOICE REQUIRED`, and the
display title remains `MAPGUESS / MOVED DESTINATION PIN`. The implementation
will keep displaying `PROVISIONAL_MAPGUESS_10.LOG` and treating all present IDs
as test-only until a durable secured state matches the canonical registry row.

### 4. Midpoint proof, characters, and asset sufficiency

The midpoint proof is frozen exactly as:

```text
ROAD GEOMETRY CHANGED: NO
DESTINATION COORDINATES CHANGED: YES
ETA TARGET: 2 MINUTES FOREVER
```

Provide the canonical before/after coordinate records that make those claims
true. Confirm the approved shared crop IDs for Amy's evidence/tools state,
Chinmay's sincere but flustered midpoint line, and Techno's optional destination
pin beat. Techno's ball is a visual payoff after the destination is locked; it
is never the interactive control.

Also confirm whether the existing folded-map/question-pin production mark,
semantic DOM/CSS map, inline SVG roads, CSS pins, text evidence receipt, and
shared character crops are sufficient. If not, request a small named original
asset pack with an exact runtime use. No whole-page raster map is needed.

### 5. Eight-record first-run content manifest

Freeze eight distinct reviewed first-run records and their Deck A/B placement.
The current plan has five Deck A titles and five Deck B titles, but only `A Map
Is Not a Photograph` is encoded as a structured candidate. It remains
unselectable and still requires independent provenance/revision, rights,
factual/adaptation, grade, sensitivity, comprehension, reading-profile, and
real-microphone review.

Please decide whether to:

1. Expand first-run Deck A with three named A06-A08 records; or
2. Keep five Deck A slots and designate three specific reviewed Deck B
   overflows.

Freeze the stable ID and Deck position of every selected record. A deck decision
does not promote candidate prose, and the builder will not silently repeat or
speech-score a record to fill the eight-unit campaign.

### 6. 1180-pixel responsive behavior

Confirm that at 1180 CSS pixels the right landmark/metadata inspector becomes a
keyboard-addressable drawer owned by the Recovery Browser. It must return focus
to its opener, close with Escape, avoid page overflow, and never overlap the
independent Reading Companion. The directions/goal rail and center map remain
visible. If another panel should collapse instead, provide the exact priority
order.

## Acceptance criteria for the response

- Every place, route, source, and map feature is original fictional material
  with stable IDs and accessible summaries.
- Exactly five rebuild units and three anchor units map to objective fixture
  changes or proofs; no percentage is introduced.
- `FASTEST`, `SAFEST`, `SCENIC`, and `ACCESSIBLE` are all valid, preserve one
  locked destination, and disclose honest ETA tradeoffs.
- The fixed-road and changed-destination records objectively support the three
  frozen midpoint-proof lines.
- The local process, upstream AI service, evidence route, selected-goal field,
  blocked actor, and blocked target agree.
- The first-run manifest names eight distinct records without a silent repeat
  or candidate promotion.
- No external map service, real user location, real map data, or copied product
  chrome is introduced.
- Any genuinely unresolved field is labeled unresolved rather than filled with
  decorative board copy.
- No response turns `PROVISIONAL_MAPGUESS_10.LOG` or any current provisional ID
  into canonical evidence merely by renaming it.

When this packet is answered, update
[`DESIGN_REQUESTS.md`](DESIGN_REQUESTS.md) with the response commit so builders
have an objective synchronization point independent of chat history.
