# MapGuess storyline and state direction

Status: current Chinmay-directed working narrative; bookend review candidate,
not a final visual freeze.

## Core trip

Finn starts at home in Noe Valley and chooses a nearby library. The real route
is about five minutes. The map is a simplified, playful San Francisco with Noe
Valley, the Mission, Downtown, Golden Gate Park, the Golden Gate Bridge, and
Fisherman's Wharf.

## Phase 1 corruption

Paid pins crowd out ordinary geography. Snack Palace near Fisherman's Wharf is
inserted as the first destination. The recommended route loops absurdly around
the city, visits Snack Palace, and then returns to the nearby library. It is
falsely labeled `5 MIN`; the genuinely direct five-minute library route is a
small, visually minimized alternative.

Candidate five repairs:

1. remove the irrelevant paid-pin clutter;
2. restore San Francisco labels, neighborhoods, landmarks, and road hierarchy;
3. restore truthful ETAs: roughly 45 minutes for the detour and five minutes
   for the direct route;
4. restore the library name, address, and destination marker;
5. make the direct library route primary and reduce Snack Palace to a small,
   clearly sponsored optional pin.

## Midpoint and Phase 2

Chinmay: `The detour was inefficient, so I told the AI to make the routes and
destinations work.`

AI: `DESTINATION OPTIMIZED. ROUTE NOW ALWAYS 100% CORRECT.`

The AI solves its routing problem by replacing the chosen destination. The map
becomes a whack-a-Snack-Palace sequence rather than the standard checklist:
each completed reading removes one Snack Palace destination, but the AI
regenerates the route toward a different Snack Palace elsewhere on the map.
After approximately three false destinations, the final reading restores the
Noe Valley Library and the site returns to the repaired bookend.

This variation is intentional. Player-facing Phase 2 does not show the standard
three-lock checklist. The lesson remains: Finn owns the destination; the system
may help with the route but may not rewrite his goal.

## Geography and editable assets

The v2 map footprint and neighborhood shapes are derived from San Francisco's
public Analysis Neighborhoods GeoJSON, then simplified and stylized for the
game. These are analysis/reporting areas rather than legal neighborhood
boundaries; they are used here only to make the parody recognizably San
Francisco.

- Source data: `mapguess-data/sf-analysis-neighborhoods.geojson`
- Projection and illustration generator: `scripts/generate-mapguess-sf-map.mjs`
- Deterministic geography reference: `mapguess-san-francisco-base-v2.svg` and `.png`
- Current illustrated game layer: `mapguess-san-francisco-illustrated-v8.png`
- Current editable bookend master: `mapguess-bookends-v8.svg`
- Current review renders: `mapguess-bookends-v8_p1.png` and `mapguess-bookends-v8_p2.png`

The v8 illustration intentionally trades geographic precision for immediate San
Francisco recognition and a playful, flat tourist-map look. The base raster now
contains only the city, road network, and major landmarks. Home, the open-book
library, routes, real-place labels, three custom sponsored-destination icons,
ETAs, and corruption states are separate editable SVG layers; they are not baked
into the generated map artwork.

In Phase 1 corruption, the real landmark names are suppressed and the map labels
only the sponsored diversions: Snack Palace, Mega Cookie Dock, and Burrito
Lighthouse. The false route follows the illustrated street network east to the
Embarcadero, north around the waterfront and Fisherman's Wharf/Pier 39, then back
to the library. In the repaired state, real landmark names return as small
haloed map labels and the direct northbound home-to-library route is primary.
