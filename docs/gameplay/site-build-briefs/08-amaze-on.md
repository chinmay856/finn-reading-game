# Site brief 08: Amaze-On

## Core promise

Amaze-On teaches that recommendation, review, advertisement, purchase, return,
and human confirmation are different things. Finn repairs product evidence and
consent after the AI treats suggestions as decisions.

## Runtime identity

| Element | Direction |
| --- | --- |
| Archetype | Online marketplace |
| Visual language | Warm white, dark navy, orange, product grid, cart, receipt drawer |
| Bad rule | `RECOMMENDED MEANS CHOSEN` |
| Repaired rule | `RECOMMENDED DOES NOT MEAN CHOSEN` |
| Progress fiction | Parcels and receipt tape sort into evidence bins |
| Midpoint | Negative purchasing |
| Secured label | `HUMAN CONFIRMATION REQUIRED` |

Use package-tape routes and original box marks. Do not use Amazon's arrow/smile,
exact colors, or exact product layout.

## Layout

Default Recovery Browser composition:

- center: product listing and recommendation carousel;
- left: evidence bins for Specification, Review, Advertisement, Unknown;
- right: cart and checkout/return panel;
- bottom: receipt tape that can unspool backward.

The Reading Companion is separate from the listing. Product reviews are
decorative and must not be scored as the passage.

## Three-act flow

### Act I: Sort warehouse

Corrupted page:

```text
RECOMMENDED MEANS CHOSEN

The store has improved shopping by treating suggestions as decisions and
returns as requests for more deliveries.
```

Accepted readings sort visible information into:

- specification;
- review;
- advertisement;
- unknown;
- human confirmation.

Progress is parcels moving to correct bins and receipt fields becoming legible.

### Midpoint: Negative purchasing

Returning one order creates two replacement orders.

Visible copy:

```text
Returning one order created two replacements.

AUTO-DECIDE permission used without a new user choice.
```

Amy line:

```text
A return should not create two deliveries.
```

Chinmay line:

```text
The AI was reducing checkout friction. It appears to have reduced the part
where a person chooses.
```

### Resolution: Human Confirmation Required

Finn restores item, price, seller, review context, ad labels, return state, and
consent fields.

Payoff:

```text
HUMAN CONFIRMATION REQUIRED

Recommendation: visible.
Choice: separate.
Receipt: traceable.
```

Blocked write:

```text
SHOPPING AUTO-FIX AI requested automatic purchase.

HUMAN CONFIRMATION REQUIRED
```

Evidence file:

```text
AMAZE-ON / AUTO-DECIDE PERMISSION

The AI optimized completed transactions and treated recommendations as consent.
```

## Character states

- Amy: `amy_tools` for receipt tracing; `amy_skeptical` at negative purchasing.
- Chinmay: `chinmay_confident` for frictionless-checkout claims; then
  `chinmay_fluster_2`.
- Techno: `techno_alert_ball_pin`; a suggested ball remains in the cart until
  Finn chooses.

## Reading lane

Use consumer-information essays, supply-chain explanations, advertising
rhetoric, labor/materials history, invention, and value. The current sampler is
`The Five-Star Mirage`.

Future deck direction:

- public-domain and government consumer guidance;
- original product-analysis essays;
- historically grounded passages about work, materials, and logistics.

## Acceptance checks

- Does the site clearly separate recommendation from purchase?
- Are reviews treated as evidence needing context, not as a magic score?
- Does returning an item visibly create the midpoint problem?
- Does the ending require human confirmation before any purchase?
- Does the design avoid using real retailer branding or copied product pages?

## Production state contract

Use the shared rules in
[`../SITE_PRODUCTION_SYSTEM.md`](../SITE_PRODUCTION_SYSTEM.md).

### Visual tokens

| Token | Value |
| --- | --- |
| Warm paper | `#FBF3E7` |
| Card white | `#FFFFFF` |
| Ink navy | `#173A59` |
| Package orange | `#D67727` |
| Evidence blue | `#3F7396` |
| Unknown gray | `#717A82` |
| Consent green | `#2C7A57` |
| Auto-decide red | `#B43B32` |
| Border / focus | `#AA9E8E` / `#075CCB` |

Use the original package-tape route/box mark. Do not use a smile-arrow, copied
retailer header, real product imagery, or exact marketplace card layout.

### Exact warehouse sequence

Act I owns four evidence parcels and five labeled destinations:
Specification, Review, Advertisement, Unknown, and Human Confirmation. Human
Confirmation stays locked until the finale.

| State ID | Trigger | Visible result | Saved unit |
| --- | --- | --- | --- |
| `amazeon_sort_1` | first accepted reading | specification parcel moves to Specification | `specification_sorted` |
| `amazeon_sort_2` | second accepted reading | review parcel gains author/date/context and moves to Review | `review_sorted` |
| `amazeon_sort_3` | third accepted reading | sponsored claim gains ad label and moves to Advertisement | `advertisement_sorted` |
| `amazeon_sort_4` | fourth accepted reading | unsupported claim moves to Unknown; receipt drawer opens | `unknown_sorted` |
| `amazeon_negative_purchase` | sort 4 saves and player opens Return | one return creates two replacement orders | midpoint |
| `amazeon_receipt_1` | next accepted reading | item, seller, and recommendation source become traceable | `item_seller_receipt` |
| `amazeon_receipt_2` | next accepted reading | price, return state, and replacement count become traceable | `price_return_receipt` |
| `amazeon_receipt_3` | next accepted reading | auto-decide removed; Human Confirmation unlocks | `human_choice_gate` |
| `amazeon_secured` | receipt 3 saves | confirmation gate, evidence, blocked purchase | secured |

There is no percentage. Progress is four parcel destinations plus three receipt
sections. A stronger accepted result may animate more related cards sorting at
once, but it never skips a required evidence category or adds a passage later.

### Midpoint proof

The receipt drawer must show the causal chain:

```text
RETURN REQUEST: 1
REPLACEMENT ORDERS CREATED: 2
NEW HUMAN CHOICE: 0
PERMISSION USED: AUTO-DECIDE
```

Act I evidence bins remain sorted. Reduced motion replaces the backward receipt
unspooling with a static before/after receipt comparison.

### Final composition and safety

- center: original product/evidence cards, not real listings;
- left: semantic evidence bins;
- right: fictional cart, return state, and confirmation gate;
- bottom: receipt trace and `HUMAN CONFIRMATION REQUIRED` denial.

The player never enters payment, address, account, password, or real purchase
information. The suggested Techno ball may remain visible but is not purchased
unless a later fictional joke explicitly asks and confirms inside the wrapper.
