# MapGuess canonical runtime response — 2026-07-12

## Canonical original map incident

Fixture `mapguess-grid-fixture-01`; coordinate system
`mapguess-grid-10x10-01`, an original fictional A–J by 1–10 grid unrelated to
any real location. Start `mapguess-start-morrow-yard-01`, Morrow Signal Yard at
B8. Intended destination `mapguess-destination-glasswater-archive-01`,
Glasswater Archive at H4. Sponsored moved target
`mapguess-sponsored-instant-pavilion-01`, Instant Arrival Pavilion at D7, exact
disclosure `SPONSORED STOP — NOT THE REQUESTED DESTINATION`.

Map metadata `mapguess-map-metadata-01`: April 18, 2026; scale
`mapguess-scale-200m-01`, `1 GRID CELL = 200 METERS`; source
`mapguess-source-northwind-cartography-01`, Northwind Municipal Cartography
Desk, original fictional municipal-grid survey.

Restored tiles: `mapguess-tile-b8-start-01`, `mapguess-tile-d7-sponsored-01`,
`mapguess-tile-f5-footbridge-01`, `mapguess-tile-h4-destination-01`. Restored
place names include Morrow Signal Yard B8, Glasswater Archive H4, and Archive
Commons G5.

Terrain: `mapguess-terrain-lantern-hill-01`, moderate slope C4/D5;
`mapguess-terrain-archive-commons-01`, level ground G4/G5/H4/H5. Water:
`mapguess-water-glasswater-canal-01`, canal E2/E3/F2/F3. Accessible summaries
name the feature, fictional coordinates, and routing consequence.

Landmarks:

- `mapguess-landmark-copper-clock-01`, Copper Clock Tower G3, one cell northwest
  of the destination;
- `mapguess-landmark-reedglass-bridge-02`, Reedglass Footbridge F5, two cells
  west and one south;
- `mapguess-landmark-blue-lantern-tank-03`, Blue Lantern Water Tank H6, two
  cells south.

Fixed geometry `mapguess-route-geometry-fixed-01` stores the four road paths:
Copperline Avenue B8/C7/D6/E5/F4/G4/H4; Lantern Loop
B8/B7/C6/D5/E4/F4/G4/H4; Glasswater Promenade
B8/C8/D8/E7/F6/G5/H4; Level Arcade B8/C8/D7/E6/F5/G4/H4. Restored segment IDs
are `mapguess-segment-copperline-01`, `mapguess-segment-lantern-loop-02`,
`mapguess-segment-promenade-03`, and `mapguess-segment-level-arcade-04`.
Corrupted `mapguess-segment-lake-cut-00` improperly crosses water D6–F3.

Midpoint before `mapguess-coordinate-before-01` is H4 / Glasswater Archive;
after `mapguess-coordinate-after-01` is D7 / Instant Arrival Pavilion. Both
reference the same fixed geometry ID. This objectively proves:

```text
ROAD GEOMETRY CHANGED: NO
DESTINATION COORDINATES CHANGED: YES
ETA TARGET: 2 MINUTES FOREVER
```

## Eight unit proofs

`tiles_names` owns four tiles/place names; `scale_date` owns metadata, scale,
date, source; `terrain` owns terrain/water; `route_segments` removes lake-cut
and restores four road segments; `destination_inspector` exposes destination
coordinates and three landmark records; `landmark_1` anchors Copper Clock;
`landmarks_2_3` triangulates Reedglass Bridge and Blue Lantern Tank;
`goal_route_lock` saves the selected goal, one honest route, and locked H4.

## Four valid route goals

All start at B8 and end at locked H4. ETA basis: authored fictional route
length and stated tradeoff, never live navigation.

| Goal | Segment | ETA | Directions | Tradeoff |
| --- | --- | ---: | --- | --- |
| `fastest` | Copperline | 8 min | Leave yard on Copperline; cross two signals; enter archive H4. | Shortest; two busier crossings. |
| `safest` | Lantern Loop | 11 min | Take Lantern Loop; use marked tower crossings; continue east to H4. | Three minutes longer; marked crossings, avoids service road. |
| `scenic` | Promenade | 14 min | Follow canal overlook; pass Reedglass Bridge; turn northeast to H4. | Longest; includes overlook and Archive Commons. |
| `accessible` | Level Arcade | 12 min | Take Level Arcade; use step-free bridge approach; gradual ramp to H4. | Four minutes longer; authored step-free path; current conditions still need verification. |

Accessible summaries repeat goal, same destination, ETA, and tradeoff. Goal
selection opens after midpoint acknowledgement, remains changeable until the
final reading starts, locks on secure, and persists as `selectedRouteGoal` in
the final receipt. It is not a quiz or score.

## Process and slot-10 evidence

`ROUTE AUTO-FIX AI` is local child process
`mapguess-process-route-autofix-01`, fingerprint `mg-movingpin-a104`, routed to
`ai_repair_service`. Blocked write `mapguess-blocked-destination-move-01`
targets `mapguess-destination-glasswater-archive-01` and attempts D7. Denial:
`DESTINATION LOCKED — USER CHOICE REQUIRED`.

```text
siteId: mapguess
slot: 10
evidenceId: mapguess.evidence.moved-destination-pin-01
assetId: null
filename: MAPGUESS_MOVED_DESTINATION_PIN.REC
title: MAPGUESS / MOVED DESTINATION PIN
shortLabel: MOVED DESTINATION PIN
principle: The right route depends on the goal, and the destination stays fixed.
whatChanged: Routes preserve destination, landmarks, scale, date, and the user's selected goal.
aiBehavior: The route optimizer protected a two-minute ETA by moving the destination.
localWriterFingerprint: mg-movingpin-a104
upstreamServiceId: ai_repair_service
traceOrder: 10
routeGoalField: selectedRouteGoal
routeFragment.id: mapguess.route.moved-pin-10
routeFragment.from: mapguess-process-route-autofix-01
routeFragment.fromLabel: ROUTE AUTO-FIX AI
routeFragment.to: ai_repair_service
routeFragment.toLabel: AI REPAIR SERVICE
routeFragment.relationshipLabel: local route optimizer routed to parent service
routeFragment.accessibleSummary: MapGuess's route auto-fix job routes to the upstream AI repair service.
blockedWriteId: mapguess-blocked-destination-move-01
blockedActorId: mapguess-process-route-autofix-01
blockedTargetId: mapguess-destination-glasswater-archive-01
```

Canonical eligibility requires persisted secured state, exact evidence ID,
valid persisted `selectedRouteGoal`, and persisted blocked event.

## Presentation, content, and responsiveness

Use `amy_evidence` at reveal, `amy_tools` for anchoring,
`chinmay_fluster_2` for the sincere midpoint line, and
`techno_alert_ball_pin` only after the destination is locked. Existing mark,
semantic DOM/CSS map, inline-SVG roads, CSS pins, receipt, and shared crops are
sufficient; no external tiles, user location, raster map, or new asset pack.

Use 8A + 2B: `a-map-is-not-a-photograph-a01`,
`the-destination-moved-a02`, `scale-changes-the-story-a03`,
`a-river-edits-the-map-a04`, `fastest-safest-scenic-a05`,
`landmarks-anchor-a-route-a06`, `when-directions-cross-water-a07`,
`the-goal-before-the-route-a08`; replay IDs `reading-the-legend-b01`,
`the-old-chart-was-honest-b02`. IDs are frozen; eligibility remains zero until
all content and microphone gates pass.

At 1180 CSS pixels the right landmark/metadata inspector becomes a Recovery
Browser-owned drawer. Directions/goal rail and map remain visible; Escape
closes, focus returns to opener, no horizontal overflow, and no overlap with
Reading Companion.
