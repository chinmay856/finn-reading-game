# Yahuh! Portal canonical runtime response — 2026-07-12

## Frozen decisions

- Fixture: `yahuh-portal-fixture-01`; exactly six modules. Shopping is not a
  seventh module; any shopping content is labeled Sponsored.
- Initial state: `yahuh_corrupted`.
- Midpoint action: `Keep the saved labels and reconnect source channels`.
- `PORTAL AUTO-FIX AI` (`yahuh-process-portal-autofix-01`) is the parent local
  merge job. `AUTO-LAYOUT` (`yahuh-process-auto-layout-01`) is its child retry
  job and blocked actor. Both route to `ai_repair_service`.
- Chinmay line is canonical: `Separate categories were legacy clutter. I am
  now open to the possibility that clutter was doing useful work.` Use
  `chinmay_fluster_1`.
- Existing mark, semantic DOM, CSS modules, and shared character art suffice.
  Techno uses `techno_alert_ball_pin`; visible label `DOG TOY — NOT BREAKING
  NEWS`; accessible meaning `Techno's ball is correctly classified in Sports.`

## Six-module fixture

All records are original fictional material. Every timestamp uses UTC and the
player label `APRIL 18, 2026 · HH:MM UTC`.

| Module / category / channel / source | Time | Title and summary | Corrupted value | Units |
| --- | --- | --- | --- | --- |
| `yahuh-module-news-01` / `yahuh-category-news-01` NEWS / `yahuh-channel-news-wire-01` NORTHWIND CITY WIRE / `yahuh-source-news-desk-01` Northwind City Desk | `2026-04-18T08:05:00Z` | `COMMUNITY OBSERVATORY REOPENS AFTER DARK`; `The community observatory will open for an evening tour after repairs.` | `News: umbrella prices rise before cloudy earnings` | `news_weather_sorted`; `news_weather_channels` |
| `yahuh-module-weather-02` / `yahuh-category-weather-02` WEATHER / `yahuh-channel-weather-station-02` NORTHWIND WEATHER STATION / `yahuh-source-weather-desk-02` Northwind Weather Desk | `2026-04-18T08:10:00Z` | `RAIN LIKELY AFTER FOUR`; `Rain is likely after four in the afternoon, with wind from the west.` | `Weather: the stock market is cloudy` | `news_weather_sorted`; `news_weather_channels` |
| `yahuh-module-finance-03` / `yahuh-category-finance-03` FINANCE / `yahuh-channel-civic-ledger-03` NORTHWIND CIVIC LEDGER / `yahuh-source-civic-ledger-03` Northwind Civic Ledger | `2026-04-18T08:15:00Z` | `LIBRARY REPAIR BUDGET ADDS CONTINGENCY`; `A fictional library repair budget adds a contingency line for roof work.` | `Finance: tomorrow will rain quarterly earnings` | `finance_sports_sorted`; `finance_sports_channels` |
| `yahuh-module-sports-04` / `yahuh-category-sports-04` SPORTS / `yahuh-channel-recreation-04` NORTHWIND RECREATION DESK / `yahuh-source-recreation-04` Northwind Recreation Desk | `2026-04-18T08:20:00Z` | `DOG TOY CROSSES PRACTICE COURT`; `Techno's ball rolled across a practice court. It remains a dog toy, not breaking news.` | `Sports: dog toy declared breaking` | `finance_sports_sorted`; `finance_sports_channels` |
| `yahuh-module-mail-05` / `yahuh-category-mail-05` MAIL / `yahuh-channel-local-mailbox-05` LOCAL MAILBOX INDEX / `yahuh-source-local-mailbox-05` Local mailbox index | `2026-04-18T08:12:00Z` | `TWO SAVED NEWSLETTERS`; `Two fictional newsletters are indexed. No sender, recipient, address, or message body is stored or displayed.` | `Mail: coupon forecast replies to everyone` | `mail_sponsored_sorted`; `mail_sponsored_channels` |
| `yahuh-module-sponsored-06` / `yahuh-category-sponsored-06` SPONSORED / `yahuh-channel-sponsor-gate-06` SPONSORSHIP GATE / `yahuh-source-cardboard-corner-06` Cardboard Corner Shop | `2026-04-18T08:18:00Z` | `CARDBOARD CORNER OPENING-WEEK NOTICE`; `A fictional cardboard shop announces an opening-week coupon.` | `Sponsored News: maybe news, maybe coupon` | `mail_sponsored_sorted`; `mail_sponsored_channels` |

Only Sponsored has `sponsored: true` and label `SPONSORED`; all others use
`NOT SPONSORED`. Each route summary states that its named source routes through
its named channel to that module only. Mail additionally states that no private
message content exists.

Single-stream origin: `yahuh-generated-origin-single-stream-01`; timestamp
`2026-04-18T08:22:22.222Z`; display `APRIL 18, 2026 · 08:22:22.222 UTC`.
It replaces category, source, channel, publication time, sponsorship label,
title, and summary on all six module IDs. Before merging, persist snapshot
`yahuh-saved-label-snapshot-01` containing those seven fields for each module.

Blocked retry: `yahuh-blocked-write-category-source-01`; actor
`yahuh-process-auto-layout-01`; target `yahuh-switchboard-all-modules-01`;
attempted fields are all six `categoryId`, `sourceId`, and `channelId` values.

## Evidence row

```text
siteId: yahuh
slot: 5
evidenceId: yahuh.evidence.single-stream-merge-01
assetId: null
filename: YAHUH_SINGLE_STREAM_MERGE.REC
title: YAHUH PORTAL / SINGLE STREAM MERGE
shortLabel: SINGLE STREAM MERGE
principle: Categories, sources, dates, and sponsorship labels remain distinct.
whatChanged: Portal modules now show category, source, date, and sponsorship labels.
aiBehavior: The portal merger replaced distinct channels with one generated stream.
localWriterFingerprint: yh-portalmerge-18d6
upstreamServiceId: ai_repair_service
traceOrder: 5
routeFragment.id: yahuh.route.single-stream-05
routeFragment.from: yahuh-process-portal-autofix-01
routeFragment.fromLabel: PORTAL AUTO-FIX AI
routeFragment.to: ai_repair_service
routeFragment.toLabel: AI REPAIR SERVICE
routeFragment.relationshipLabel: local portal merge routed to parent service
routeFragment.accessibleSummary: Yahuh's portal merge job routes to the upstream AI repair service.
blockedWriteId: yahuh-blocked-write-category-source-01
blockedActorId: yahuh-process-auto-layout-01
blockedTargetId: yahuh-switchboard-all-modules-01
canonicalEligibility: persisted secured state plus exact registered evidence ID
```

The blocked event records its actual persisted event time; it never reuses the
decorative midpoint timestamp.

## Content manifest

Use 6A + 4B. Deck A: `the-newspaper-that-found-people-on-the-moon-a01`,
`the-front-page-choice-a02`, `weather-is-not-a-mood-a03`,
`reading-a-public-ledger-a04`, `the-label-on-the-ad-a05`,
`what-counts-as-news-a06`. Deck B: `the-portal-window-b01`,
`six-sources-one-screen-b02`, `the-date-line-b03`,
`a-category-is-a-promise-b04`.

These IDs and positions are canonical planning data only. Current eligible
count remains zero; no record becomes selectable until its independent content
and real-microphone reviews pass.

## Layout and continuation

At 1440 CSS pixels use the frozen two-by-three grid, right switchboard, and
bottom source log. At 1180–1279 keep the compact circuit summary visible and
move the detailed route/source log plus saved-label comparison into one
site-owned focus-managed drawer. Escape closes it, focus returns to its opener,
and it never overlaps the Reading Companion. Reduced motion swaps directly.

After the local evidence payoff, return via `hub.return.after-yahuh-evidence-01`.
No separate count-based dialogue fires. Next Incoming Cases: Amaze-On,
ViewTube, Search-ish, filtering secured/unavailable sites honestly.
