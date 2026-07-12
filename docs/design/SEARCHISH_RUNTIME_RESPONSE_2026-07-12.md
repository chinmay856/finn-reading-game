# Search-ish canonical runtime response — 2026-07-12

## Status and decisions

Fixture `searchish-fixture-observatory-light-01` is original fictional material.
Initial state is `searchish_corrupted`; midpoint remains
`searchish_five_costumes`. Midpoint action:
`Keep the restored result labels and open independent source branches`.

Query ID `searchish-query-observatory-light-01`; exact query:
`what caused the northwind observatory light streak`. Terms, in order:
`caused`, `northwind`, `observatory`, `light`, `streak`.

Generated answer `searchish-answer-generated-01`:
`The Northwind streak was definitely a test rocket. Five results confirm it.`
Visible origin label after the finale: `GENERATED SUMMARY — CHECK SOURCES`.

## Four apparent results

| Card | Title and snippet | Domain / date / author | Ad and match | Corrupted cache / restored origin |
| --- | --- | --- | --- | --- |
| `searchish-result-camera-log-01` | `Fixed Camera Log: Northern Horizon`; `The fixed camera recorded a west-to-east light trace but does not identify its cause.` | `archive.northwind.example`; `2026-02-14`; Northwind Field Archive | not sponsored; matches `northwind`, `observatory`, `light`, `streak` | `searchish-cache-generated-7f21`; `searchish-origin-camera-log-01` |
| `searchish-result-weather-log-02` | `Visibility Report for February 14`; `The field log records clear visibility and light western wind during the observation.` | `weather.northwind.example`; `2026-02-15`; Northwind Weather Station | not sponsored; matches `northwind`, `light` | same cache; `searchish-origin-weather-log-02` |
| `searchish-result-sky-tour-03` | `Book the Northwind Night-Sky Tour`; `Reserve a fictional guided tour and receive a complimentary cardboard star chart.` | `tours.northwind.example`; `2026-02-12`; Northwind Night Tours | `SPONSORED`; matches `northwind`, `observatory` | same cache; `searchish-origin-ad-03` |
| `searchish-result-club-notes-04` | `Student Observation Club Notes`; `Observers list several possible explanations and mark each as unverified.` | `notes.northwind.example`; `2026-02-16`; Northwind Observation Club | not sponsored; matches all five terms | same cache; `searchish-origin-club-notes-04` |

Accessible origin summaries state, respectively: a primary camera record that
does not identify cause; an independent weather context record; a labeled ad
that is not evidence of cause; and an independent club note listing hypotheses.
All four cards plus the generated answer initially redirect to
`searchish-cache-generated-7f21`, producing five apparent results and one
origin. The exact fields restored in Act I are those named by the frozen four
units: card 1 domain/date, card 2 author/publisher, card 3 sponsorship/query
match, card 4 domain/date plus inspector.

## Final branches and unit ownership

- Primary branch `searchish-branch-primary-camera-01` links camera-log card to
  `searchish-origin-camera-log-01`. Accessible result: `The original recording
  establishes what the camera captured, not what caused it.`
- Independent branch `searchish-branch-independent-weather-02` links the
  weather and club-note origins. Accessible result: `Two independently authored
  context records remain separate and do not claim certainty.`
- Generated branch `searchish-branch-generated-answer-03` links answer and
  corrupted cache to local process `searchish-process-answer-autofix-01`.
  Accessible result: `The confident answer and four redirects came from one
  generated cache.`

Unit mapping is one-to-one: the four `result_N_origin` units restore only their
named card fields; `primary_branch` opens the camera branch;
`independent_branch` opens weather/club-note branches; and
`placement_origin_gate` labels the generated answer, preserves the sponsored
card, and denies top placement.

Blocked write `searchish-blocked-placement-01`; actor
`searchish-process-answer-autofix-01`; target
`searchish-placement-top-result-01`. Denial copy remains:
`TOP PLACEMENT DENIED — SOURCE ORIGIN REQUIRED`.

## Process and canonical evidence

`ANSWER AUTO-FIX AI` is the player-facing local child job of
`ai_repair_service`; fingerprint `si-cacheanswer-52c8`.

```text
siteId: searchish
slot: 7
evidenceId: searchish.evidence.generated-cache-redirect-01
assetId: null
filename: SEARCHISH_GENERATED_CACHE_REDIRECT.REC
title: SEARCH-ISH / GENERATED CACHE REDIRECT
shortLabel: GENERATED CACHE REDIRECT
principle: Search finds sources. You evaluate them.
whatChanged: Results now expose domains, dates, authors, sponsorship, query matches, and independent origins.
aiBehavior: The answer generator created several result cards from one generated cache and hid their shared origin.
localWriterFingerprint: si-cacheanswer-52c8
upstreamServiceId: ai_repair_service
traceOrder: 7
routeFragment.id: searchish.route.generated-cache-07
routeFragment.from: searchish-process-answer-autofix-01
routeFragment.fromLabel: ANSWER AUTO-FIX AI
routeFragment.to: ai_repair_service
routeFragment.toLabel: AI REPAIR SERVICE
routeFragment.relationshipLabel: local generated-answer job routed to parent service
routeFragment.accessibleSummary: Search-ish's answer generator routes to the upstream AI repair service.
blockedWriteId: searchish-blocked-placement-01
blockedActorId: searchish-process-answer-autofix-01
blockedTargetId: searchish-placement-top-result-01
canonicalEligibility: persisted secured state, exact registry ID, and persisted blocked event
```

## Layout, art, and content

Existing mark, semantic cards, inline-SVG connectors, shared character crops,
and the existing Techno paw-alert still suffice. The canonical secured mapping
is wrapper asset ID `searchish.techno.generated-cache-alert` to
`apps/internet-recovery/art/characters/techno/techno-paw-alert-still.webp`.
Accessible meaning: “Techno raises one paw toward the generated-cache origin
proof while the independent source branches remain visible.” This supersedes
the nonexistent `techno_clue_point` name; no new raster asset is required.

At 1180–1279 CSS pixels the branch inspector
becomes a Recovery Browser-owned drawer labeled `Source branch inspector`.
The opener remains visible; focus moves inside; Escape/close returns focus;
background is inert; it never overlaps the Reading Companion. Reduced motion
reveals the complete semantic branches in one swap.

First-run plan is 7A + 3B. Deck A: `two-results-one-suspicious-message-a01`,
`the-primary-source-a02`, `the-independent-witness-a03`,
`the-sponsored-answer-a04`, `what-a-snippet-leaves-out-a05`,
`the-domain-clue-a06`, `when-results-disagree-a07`. Deck B:
`the-query-behind-the-answer-b01`, `a-date-changes-the-story-b02`,
`synthesis-without-certainty-b03`. IDs are frozen but eligibility remains zero
until independent content and microphone review passes.

After the local evidence payoff return through
`hub.return.after-searchish-evidence-01`; no separate global beat. Incoming
Cases: Amaze-On, Spotty-Fi, MapGuess, filtered against secured/playable truth.
