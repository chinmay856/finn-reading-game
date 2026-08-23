# MapGuess design handoff — v8 working direction

Status: current Chinmay-reviewed direction and best continuation point. This is
not a final visual freeze and must not be relabeled canonical without a new
Chinmay review.

## Copy/paste brief for the receiving task

Continue MapGuess from the v8 editable master and review renders listed below.
Do not restart from the old design boards or rebuild the shared game shell.
MapGuess is a playful MapQuest-style parody set on a flat, cartoon San Francisco
map. Finn starts at a home icon immediately east of Twin Peaks and wants to reach
an open-book library icon several streets north, between Golden Gate Park and
Downtown. The repaired route is a short, street-following northbound path. The
corrupted route must follow the illustrated streets east to the Embarcadero,
north past sponsored waterfront diversions around Fisherman's Wharf and Pier 39,
and then return to the library while falsely claiming the same five-minute ETA.

The corrupted map suppresses real landmark names and instead promotes three
absurd sponsored destinations with bespoke icons and callouts: Snack Palace,
Mega Cookie Dock, and Burrito Lighthouse. The repaired map removes that clutter
and restores small, haloed real-place labels. Keep the generated raster limited
to the city, roads, and landmark drawings. Home, library, routes, labels,
sponsored icons, ETAs, and state changes remain editable SVG layers.

## Lesson and narrative job

The route should serve the destination Finn chose. A recommendation system may
help with a route, but it may not rewrite Finn's goal. Sponsored suggestions must
remain visibly separate from route guidance.

The comedy comes from a sincerely unhelpful system that treats advertising as a
navigation objective, not from an evil antagonist. The tone is playful,
absurd, and legible to a fourteen-year-old.

## Current trip and state logic

### Repaired destination

- Start: an original generic home UI glyph immediately east of Twin Peaks.
- Destination: an open-book library glyph north of home, between Golden Gate
  Park and Downtown.
- Direct route: a short series of northbound street segments.
- ETA: approximately five minutes / 0.8 miles in the current mock.
- The home and library are vector overlays, not baked into the map raster.

### Initial corrupted state

- The false route follows the drawn street network; it is not a freehand loop.
- It leaves home, travels east to the Embarcadero, travels north around the
  waterfront/Fisherman's Wharf/Pier 39, and then returns to the library.
- The false route is promoted as `RECOMMENDED · 5 MIN`.
- The genuinely direct route is visible only as a minimized gray alternative.
- Real landmark labels are suppressed.
- Sponsored diversions dominate the map and the `ON YOUR WAY` list:
  - Snack Palace — crown/burger icon;
  - Mega Cookie Dock — cookie/dock icon;
  - Burrito Lighthouse — burrito/lighthouse icon.
- Do not restore generic orange dollar-sign pins.

### Candidate Phase 1 repair sequence

The current narrative uses five repairs:

1. remove irrelevant sponsored clutter;
2. restore useful San Francisco landmark and geography labels;
3. correct the detour ETA to roughly 45 minutes while preserving the direct
   route at five minutes;
4. restore the library as Finn's selected destination;
5. make the direct library route primary and leave sponsored places optional.

These are narrative beats, not permission to put instructional prose directly
on the map. Each passage should produce one visible map/UI change and advance
the site-specific repair meter.

### Midpoint and Act 2

Current working dialogue job:

- Chinmay: `The detour was inefficient, so I told the AI to make the routes and
  destinations work.`
- AI: `DESTINATION OPTIMIZED. ROUTE NOW ALWAYS 100% CORRECT.`

The AI "fixes" routing by rewriting every destination as Snack Palace. MapGuess
then uses a custom whack-a-Snack-Palace sequence rather than the standard static
three-lock checklist. Each completed reading removes one false sponsored target,
but the route regenerates toward another. After approximately three false
targets, the final repair restores the library and the repaired bookend.

This unique interaction is an intentional variation. If an Act 2 overlay is
needed, design it around the moving destination/route problem; do not force the
standard three-item lock checklist onto this mission.

### Ending and reflection

- Secured state: direct library route prominent, real city labels readable,
  sponsored destinations optional rather than inserted.
- Reflection job: Finn explains what lesson the AI should learn about preserving
  the user's chosen destination.
- Working AI receipt: `LEARNED: OPTIMIZE THE ROUTE, NOT THE DESTINATION.`

Exact Amy, Chinmay, and AI dialogue remains a later human copy review. Do not
bake character dialogue into the site artwork.

## Current visual hierarchy

### Generated raster base

The map is intentionally a flat illustrated game board rather than accurate GIS
cartography or a three-dimensional tourist poster. It contains:

- sparse cream street blocks and pale roads;
- Golden Gate Bridge oriented north from the northwest edge;
- the Presidio;
- Golden Gate Park as one strong horizontal green shape;
- Palace of Fine Arts;
- Twin Peaks placed just east/southeast of Golden Gate Park;
- a deliberately small Downtown cluster;
- Coit Tower;
- Fisherman's Wharf / waterfront piers;
- Ferry Building.

The raster deliberately contains no text, endpoints, pins, routes, ETA, or
corruption UI.

### Editable SVG overlays

- generic home glyph;
- open-book library glyph;
- direct and corrupted street-following routes;
- small haloed real-place labels;
- three bespoke sponsored-destination icons and callouts;
- ETA and left route-planner content;
- corruption/repair meter and semantic red/green states.

### State-specific labeling rule

- Corrupted state: suppress real place labels; label sponsored diversions.
- Repaired state: restore real place labels; remove sponsored map clutter.
- Real-place labels use small text with a light halo, not opaque rectangular
  blocks that hide the illustration.
- Large boxes are reserved for actual route/advertising callouts, not ordinary
  map labels.

## Durable production lessons from this iteration

1. **Generate the bounded art layer, author the gameplay layer.** Image
   generation provides the playful city illustration. Inkscape/SVG controls
   every element that changes across states.
2. **Design at gameplay size.** A map that looks attractive full-screen can
   become cluttered at the 620 × 526 site-map panel. Inspect every render at its
   actual size.
3. **Semantic icons beat literal buildings.** A standard home glyph and an open
   book read faster than miniature architecture.
4. **Generated text is prohibited.** Labels, names, ETAs, and callouts stay
   editable so spelling, placement, and state continuity remain deterministic.
5. **Routes must respect the visible map.** Even fictional streets establish a
   visual contract. Route lines should follow those streets rather than cut
   across the map as arbitrary curves.
6. **Corruption changes information priority.** The initial state is not merely
   the repaired screen tinted red. It hides useful geography and over-promotes
   absurd sponsored content.
7. **Use bespoke corruption artifacts.** The three sponsored icons communicate
   the joke more clearly than repeated generic dollar pins.
8. **Keep landmark density bounded.** Favor a few unmistakable landmarks with
   deliberate spacing. Avoid random trees, houses, cable cars, boats, detailed
   piers, or micro-buildings.
9. **Keep the map flat.** Do not return to 3D/isometric terrain or a dense tourist
   poster. The route and labels need to remain the primary visual information.
10. **Preserve state separation.** The clean base raster, endpoint glyphs,
    labels, sponsored icons, routes, and semantic status treatments should
    remain independent layers.

## Do not revive

- the generic DataSF polygon map as production artwork;
- a bridge that runs horizontally across the city rather than north from the
  northwest edge;
- generated landmark text;
- opaque label pills for every real landmark;
- dense trees, random houses, cable cars, boats, ponds, and ornamental filler;
- a large Downtown skyline;
- a literal library building;
- home and library baked into the raster;
- generic dollar-sign map pins;
- a smooth red loop that ignores the illustrated streets;
- real landmark names remaining visible in the initial corrupted state;
- a standard three-lock Act 2 checklist for this mission.

## Current assets

All paths are relative to
`docs/design/screens/2026-08-15/non-wikiwhy-bookends/`.

- Editable two-page bookend master: `mapguess-bookends-v8.svg`
- Corrupted review render: `mapguess-bookends-v8_p1.png`
- Repaired review render: `mapguess-bookends-v8_p2.png`
- Clean illustrated map raster: `mapguess-san-francisco-illustrated-v8.png`
- Final raster-edit prompt: `mapguess-san-francisco-illustrated-v8-prompt.md`
- Storyline/state note: `MAPGUESS_STORYLINE_HANDOFF.md`
- Historical deterministic geography reference:
  `mapguess-san-francisco-base-v2.svg` and `.png`
- Public source snapshot used only for the historical geography reference:
  `mapguess-data/sf-analysis-neighborhoods.geojson`

Shared shell and semantic-color contracts live at:

- `docs/design/INTERNET_RECOVERY_SHARED_VISUAL_SYSTEM_2026-08-15.md`
- `docs/design/SCREEN_SEQUENCE_VISUAL_QA_STANDARD_2026-08-15.md`

## Continue from here

1. Open and visually review the two v8 PNGs before editing.
2. Treat v8 as the baseline; preserve the raster/overlay split.
3. Resolve only genuine label or route collisions discovered at actual size.
4. Design the Act 2 super-corrupted moving-destination state and its custom
   overlay/sequence.
5. After that state is reviewed, define passage-by-passage visual deltas and
   validate every sequence frame against the shared visual QA standard.
6. Keep character popups, Techno, Reading Companion, and exact dialogue in their
   shared reusable layers rather than redrawing them inside MapGuess.

