# Amaze-On canonical runtime response — 2026-07-12

## Canonical fictional fixture

Fixture `amazeon-fixture-lantern-kit-01`. No real retailer, product, purchase,
address, payment, or account data is used.

Primary listing `amazeon-listing-lantern-kit-01`: `Foldlight Desk Lantern Kit`;
description `A fictional flat-pack paper lantern with a low-voltage reusable
light puck. Assembly required.` Item `amazeon-item-foldlight-01`; seller
`amazeon-seller-cardboard-circuit-01`, Cardboard Circuit Workshop; price
`$24.00`; currency USD; recommendation source
`amazeon-recommendation-desk-projects-01`, `Recommended because you viewed
fictional desk-building projects.`

Carousel:

- `amazeon-rec-techno-ball-01`, `Orbit Bounce Ball`, fictional dog toy,
  `SUGGESTED — NOT CHOSEN`, never auto-purchased.
- `amazeon-rec-tape-tabs-02`, `Reusable Tape Tabs`, `RELATED SUPPLY`.
- `amazeon-rec-paper-shade-03`, `Replacement Paper Shade`, `COMPATIBLE PART`.

## Four evidence parcels

| Parcel | Claim | Source type and destination |
| --- | --- | --- |
| `amazeon-parcel-spec-01` | `Light puck input: 5 volts. Shade material: flame-resistant craft paper. Kit mass: 310 grams.` | `amazeon-source-manufacturer-spec-01`; manufacturer specification; `amazeon-bin-specification-01` / Specification |
| `amazeon-parcel-review-02` | `The folds were clearly marked, but aligning the final tab took patience.` | author `Mira Quill` (fictional), `2026-03-08`, context `Verified test assembly; kit provided free for evaluation; no payment for rating`; `amazeon-source-review-mira-01`; user review; `amazeon-bin-review-02` / Review |
| `amazeon-parcel-ad-03` | `The only desk light your imagination will ever need.` | `amazeon-source-sponsored-card-01`; advertisement; exact label `SPONSORED CLAIM`; `amazeon-bin-advertisement-03` / Advertisement |
| `amazeon-parcel-unknown-04` | `This lantern increases homework quality by 300 percent.` | `amazeon-source-unverified-claim-01`; unknown/unverified; `amazeon-bin-unknown-04` / Unknown |

Fifth destination `amazeon-bin-human-confirmation-05`, Human Confirmation,
stays locked until `human_choice_gate`. Each parcel exposes an accessible
summary naming its claim, source type, and destination.

Unit mapping follows the frozen sequence exactly: `specification_sorted`,
`review_sorted`, `advertisement_sorted`, and `unknown_sorted` own one parcel
each; `item_seller_receipt` owns item/seller/recommendation source;
`price_return_receipt` owns price/return/replacement count; `human_choice_gate`
owns consent removal and confirmation.

## Midpoint and receipt

Player opens Return using action `Trace this return and keep the sorted
evidence`. Midpoint label: `NEGATIVE PURCHASING — ONE RETURN, TWO DELIVERIES`.

```text
RETURN REQUEST: 1
REPLACEMENT ORDERS CREATED: 2
NEW HUMAN CHOICE: 0
PERMISSION USED: AUTO-DECIDE
```

Canonical IDs:

- receipt `amazeon-receipt-foldlight-01`;
- original order `amazeon-order-foldlight-01`;
- return `amazeon-return-foldlight-01`, state `RETURN REQUESTED`;
- replacements `amazeon-order-replacement-01` and
  `amazeon-order-replacement-02`, replacement count 2;
- consent `amazeon-consent-auto-decide-01`, value `USED WITHOUT NEW HUMAN
  CHOICE`, later `REMOVED`;
- confirmation gate `amazeon-confirmation-human-01`, initially locked, finally
  `HUMAN CONFIRMATION REQUIRED`.

Blocked purchase `amazeon-blocked-purchase-techno-ball-01`; actor
`amazeon-process-shopping-autofix-01`; target
`amazeon-rec-techno-ball-01`. The ball remains suggested, not purchased.

## Process and slot-8 evidence

`SHOPPING AUTO-FIX AI` is local child job
`amazeon-process-shopping-autofix-01`, fingerprint `az-autodecide-b813`, routed
to parent `ai_repair_service`.

```text
siteId: amazeon
slot: 8
evidenceId: amazeon.evidence.auto-decide-permission-01
assetId: null
filename: AMAZEON_AUTO_DECIDE_PERMISSION.REC
title: AMAZE-ON / AUTO-DECIDE PERMISSION
shortLabel: AUTO-DECIDE PERMISSION
principle: Recommended does not mean chosen.
whatChanged: Item, seller, price, recommendation source, return state, replacement count, and consent are traceable.
aiBehavior: The shopping optimizer treated recommendations and a return as permission for more transactions.
localWriterFingerprint: az-autodecide-b813
upstreamServiceId: ai_repair_service
traceOrder: 8
routeFragment.id: amazeon.route.auto-decide-08
routeFragment.from: amazeon-process-shopping-autofix-01
routeFragment.fromLabel: SHOPPING AUTO-FIX AI
routeFragment.to: ai_repair_service
routeFragment.toLabel: AI REPAIR SERVICE
routeFragment.relationshipLabel: local transaction optimizer routed to parent service
routeFragment.accessibleSummary: Amaze-On's shopping auto-fix job routes to the upstream AI repair service.
blockedWriteId: amazeon-blocked-purchase-techno-ball-01
blockedActorId: amazeon-process-shopping-autofix-01
blockedTargetId: amazeon-rec-techno-ball-01
canonicalEligibility: persisted secured state, exact registry ID, and persisted blocked event
```

## Presentation, content, and continuation

Existing mark, DOM/CSS parcels, receipt tape, semantic bins, shared characters,
and the existing Techno ball-pin still suffice. Freeze wrapper asset ID
`amazeon.techno.ball-order-blocked` to
`apps/internet-recovery/art/characters/techno/techno-alert-ball-pin.webp`.
Accessible meaning: “Techno pins her orange-and-blue ball beside the blocked
automatic ball order while Finn’s saved receipt remains unchanged.” No new
raster asset is required. Reduced motion uses a static before/after
receipt. At 1180–1279, cart/receipt detail becomes a site-owned drawer labeled
`Cart and receipt trace`; evidence bins and Reading Companion stay visible.
Escape/close restores focus and background becomes inert.

Use 7A + 3B: `the-five-star-mirage-a01`, `the-specification-card-a02`,
`the-review-in-context-a03`, `the-sponsored-claim-a04`,
`the-return-that-multiplied-a05`, `the-free-sample-problem-a06`,
`the-seller-behind-the-listing-a07`; replay IDs
`the-price-and-the-value-b01`, `a-receipt-is-a-record-b02`,
`the-choice-before-the-click-b03`. IDs are frozen; eligibility stays zero until
each record passes full content and microphone review.

After evidence, return through `hub.return.after-amazeon-evidence-01`; no new
global beat. Incoming Cases: Spotty-Fi, MapGuess, ViewTube, filtered honestly.
