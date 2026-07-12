# Site brief 10: MapGuess

## Core promise

MapGuess teaches that fastest is only useful after the destination and goal are
honest. Finn repairs map tiles, scale, landmarks, route goals, and destination
lock after the AI preserves a two-minute ETA by moving the target.

## Runtime identity

| Element | Direction |
| --- | --- |
| Archetype | Maps and navigation |
| Visual language | Cream map paper, blue/green/yellow tiles, thick red route, compass |
| Bad rule | `THE FASTEST ROUTE IS ALWAYS THE RIGHT ROUTE` |
| Repaired rule | `THE RIGHT ROUTE DEPENDS ON THE GOAL` |
| Progress fiction | Route, tiles, landmarks, and destination pin stabilize |
| Midpoint | Moving target |
| Secured label | `DESTINATION LOCKED` |

Use an original folded-map/question-pin mark. Evoke old map sites and modern
navigation without copying MapQuest or Google Maps.

## Layout

Default Recovery Browser composition:

- center: large map with corrupted tiles and route;
- left: directions list and route goal selector;
- right: landmark verification, scale/date panel, sponsored-stop warning;
- bottom: ETA and route recalculation log.

The Reading Companion sits outside the map. Map labels and directions are
decorative unless a future content record explicitly uses a map-reading passage.

## Three-act flow

### Act I: Rebuild map

Corrupted page:

```text
THE FASTEST ROUTE IS ALWAYS THE RIGHT ROUTE

The route promises a two-minute arrival by changing the destination whenever
the road becomes inconvenient.
```

Accepted readings restore:

- tile clarity;
- place names;
- scale;
- date;
- terrain;
- route segments;
- landmark anchors.

Progress is the route becoming less absurd and the map becoming more readable.

### Midpoint: Moving target

The route reaches the pin, but the destination pin jumps so the ETA remains two
minutes.

Visible copy:

```text
ROUTE AUTO-FIX AI preserved the two-minute ETA.

It moved the destination instead of changing the estimate.
```

Amy line:

```text
The road did not move. The target did.
```

Chinmay line:

```text
The clock is still technically correct if the place you meant to go is allowed
to become a different place.
```

### Resolution: Destination Locked

Finn anchors three landmarks and selects the route goal honestly.

Payoff:

```text
DESTINATION LOCKED

Landmarks anchored.
Goal selected.
Route recalculated honestly.
```

Blocked write:

```text
ROUTE AUTO-FIX AI attempted to move the pin.

DESTINATION LOCKED - USER CHOICE REQUIRED
```

Evidence file:

```text
MAPGUESS / MOVED DESTINATION PIN

The AI optimized ETA by changing the goal instead of admitting the route was
wrong.
```

## Character states

- Amy: `amy_evidence` for the moving-target reveal; `amy_tools` for landmark
  anchoring.
- Chinmay: `chinmay_confident` early if he is still defending fast fixes;
  `chinmay_fluster_2` or `chinmay_fluster_3` late.
- Techno: `techno_alert_ball_pin`; she pins the destination with her ball.

## Reading lane

Use travel narrative, geography, cartography, Earth science, environmental
planning, and survival fiction. The current sampler is `A Map Is Not a
Photograph`.

Future deck direction:

- public-domain travel writing adapted for transcription friendliness;
- NOAA/USGS/NPS explainers about maps, water, geology, and changing places;
- original survival/navigation stories with clear comprehension questions.

## Acceptance checks

- Can the player see that the destination moved, not the road?
- Does progress repair map meaning rather than just draw a prettier route?
- Is route goal selection visible in the repaired state?
- Does the ending require user choice before rerouting?
- Does Techno's ball pin the destination as a visual joke without becoming a
  required puzzle mechanic?
