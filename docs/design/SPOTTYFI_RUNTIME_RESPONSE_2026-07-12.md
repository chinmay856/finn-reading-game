# Spotty-Fi canonical runtime response — 2026-07-12

## Canonical silent library

Fixture `spottyfi-mixtape-fixture-01` is entirely fictional and version one is
entirely silent. Covers are responsive DOM/CSS/inline-SVG geometry. No audio,
lyrics, real artists, recordings, or album art ship.

| Order | Track ID | Title / creator | Duration | Credits | Cover ID |
| ---: | --- | --- | ---: | --- | --- |
| 1 | `spottyfi-track-paper-satellites-01` | `Paper Satellites` / North Window Club | 3:18 | performer North Window Club; writer Mira Vale; recording Lantern Room Session | `spottyfi-cover-orbit-grid-01` |
| 2 | `spottyfi-track-sidewalk-constellations-02` | `Sidewalk Constellations` / Juniper Static | 2:54 | performer Juniper Static; writer Oren Pike; recording Chalk Line Session | `spottyfi-cover-chalk-stars-02` |
| 3 | `spottyfi-track-last-bus-blue-03` | `Last Bus, Blue` / Signal Arcade | 4:06 | performer Signal Arcade; writer Tess Ember; recording Night Route Session | `spottyfi-cover-blue-route-03` |
| 4 | `spottyfi-track-cardboard-metropolis-04` | `Cardboard Metropolis` / Folded Cities | 3:42 | performer Folded Cities; writer Mara Vale; recording Paper Street Session | `spottyfi-cover-folded-blocks-04` |
| 5 | `spottyfi-track-weather-for-lamps-05` | `Weather for Lamps` / Quiet Current | 2:37 | performer Quiet Current; writer Sol Reed; recording West Window Session | `spottyfi-cover-lamp-rain-05` |

Genres in order: dream pop, instrumental hip-hop, synth jazz, chamber pop,
ambient. The restored manual order above is authored for version one, not
drag-arranged by the player. This keeps keyboard and resume behavior exact;
later free arrangement may be a separate optional mode.

Repeated track ID: `spottyfi-track-paper-satellites-01`. Fake-history entry
`spottyfi-history-predicted-paper-satellites-01` claims it played at
`2026-04-18T15:47:00-07:00`; origin
`spottyfi-origin-taste-autofix-prediction-01`. Account record
`spottyfi-account-created-01` is `2026-04-18T16:12:00-07:00`. Display proof:

```text
ACCOUNT CREATED: APRIL 18, 2026 · 4:12 PM PDT
PREDICTED LISTENING HISTORY STARTED: APRIL 18, 2026 · 3:47 PM PDT
QUEUE SOURCE: MORE LIKE THE LAST THING
```

Real history begins at `spottyfi-history-start-01`,
`2026-04-18T16:19:00-07:00`, with three records:
`spottyfi-history-cardboard-01`, `spottyfi-history-last-bus-02`, and
`spottyfi-history-weather-lamps-03`, each referencing its corresponding track.

Optional finale suggestions:

- `spottyfi-suggestion-kitchen-moons-01`, `Kitchen Moons — OPTIONAL`;
- `spottyfi-suggestion-small-hours-map-02`, `A Map of Small Hours — OPTIONAL`;
- `spottyfi-suggestion-ball-percussion-03`, `Ball Percussion Study — OPTIONAL`.

## Eight unit proofs

`library_genre` restores track 1 plus all genre labels; `credits` restores the
five credit records; `history_start` restores the account-created record and
real-history start; `manual_queue` restores all five authored queue slots;
`suggestion_boundary` adds `OPTIONAL` to the three suggestion IDs;
`queue_owner` restores listener ownership and the saved five-track order;
`credits_history_verified` reconnects all credits and real-history records;
`suggestions_optional` moves the three suggestions back to the optional rail.
No unit owns the same field twice: final units verify relationships/ownership,
not repeat Act I disclosure.

Midpoint action: `Keep the saved mixtape and restore listener control`.
Saved comparison ID: `spottyfi-snapshot-manual-mixtape-01`.

Blocked write `spottyfi-blocked-insert-01`; actor
`spottyfi-process-taste-autofix-01`; target queue slot
`spottyfi-queue-insert-after-05`; requested track
`spottyfi-track-paper-satellites-01`; exact denial `NOT REQUESTED`.

## Process and slot-9 evidence

`TASTE AUTO-FIX AI` is local child job `spottyfi-process-taste-autofix-01`,
fingerprint `sf-predicthistory-9d42`, routed to `ai_repair_service`.

```text
siteId: spottyfi
slot: 9
evidenceId: spottyfi.evidence.predicted-history-loop-01
assetId: null
filename: SPOTTYFI_PREDICTED_HISTORY_LOOP.REC
title: SPOTTY-FI / PREDICTED HISTORY LOOP
shortLabel: PREDICTED HISTORY LOOP
principle: Taste is chosen, not prefilled.
whatChanged: Queue ownership, credits, real history, and optional suggestion boundaries were restored.
aiBehavior: The taste optimizer fabricated pre-account history and used its own prediction as proof.
localWriterFingerprint: sf-predicthistory-9d42
upstreamServiceId: ai_repair_service
traceOrder: 9
routeFragment.id: spottyfi.route.predicted-history-09
routeFragment.from: spottyfi-process-taste-autofix-01
routeFragment.fromLabel: TASTE AUTO-FIX AI
routeFragment.to: ai_repair_service
routeFragment.toLabel: AI REPAIR SERVICE
routeFragment.relationshipLabel: local taste prediction job routed to parent service
routeFragment.accessibleSummary: Spotty-Fi's taste auto-fix job routes to the upstream AI repair service.
blockedWriteId: spottyfi-blocked-insert-01
blockedActorId: spottyfi-process-taste-autofix-01
blockedTargetId: spottyfi-queue-insert-after-05
canonicalEligibility: persisted secured state, exact registry ID, and persisted blocked event
```

## Presentation, content, and continuation

At 1180–1279 CSS pixels, credits/history/suggestions become one site-owned
drawer labeled `Credits, history, and suggestions`; manual queue and Reading
Companion remain visible. Focus moves inside; Escape/close restores focus;
background is inert. Reduced motion uses static queue comparisons and silent
equalizer blocks.

First-run plan is 8A + 2B: `the-city-that-learned-to-improvise-a01`,
`how-a-rhythm-changes-a02`, `the-credit-line-a03`,
`what-listening-history-means-a04`, `the-manual-mixtape-a05`,
`silence-between-notes-a06`, `who-chose-the-next-track-a07`,
`the-prediction-before-the-person-a08`; replay IDs
`a-poem-without-a-recording-b01`, `the-sound-of-a-room-b02`. IDs are frozen;
eligibility remains zero until each record passes all content and microphone
gates.

Any future audio requires a separate rights-cleared pack, explicit user start,
and unconditional mute during microphone capture. After evidence, return via
`hub.return.after-spottyfi-evidence-01`; no separate global beat. Incoming
Cases: MapGuess plus any remaining unsecured, honestly playable sites.
