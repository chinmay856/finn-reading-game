# Design response to implementation PR 30

## Synchronization point

This response was prepared against implementation commit `5542682` and the four
runtime captures in `docs/design/review/`. That work merged through PR #30;
`main` at `270c63d` is now the implementation baseline.

The focused pack originated at design commit `8b4440b`. The final main-based
consolidation is `b32fa22` on `agent/amy-techno-design` / PR #31.

The current Recovery Map, WikiWhy reading view, Amy warning, and Chinmay rewrite
composition are approved as the implementation baseline. The design changes
below are additive state and asset directions; they do not ask the builder to
replace the stable desktop shell or Reading Companion.

## Focused decisions

| Builder question | Design decision |
| --- | --- |
| Is ThreadIt approved as the next production site after WikiWhy? | **Yes.** ThreadIt is the second playable site and the portability proof that site progress can be structural rather than a percentage wipe. Use [`THREADIT_PRODUCTION_HANDOFF.md`](../gameplay/THREADIT_PRODUCTION_HANDOFF.md). |
| Are the four Amy/Chinmay runtime mappings approved? | **Approve three; split one.** Keep `amy_evidence`, `chinmay_fluster_1`, and `chinmay_fluster_2`. Keep `amy_supportive` for hub support and secured encouragement, but use `amy_tools` for Shield instruction. Crop the existing sheet panel; no new character generation is needed. |
| Which artifact becomes WikiWhy evidence slot 1? | `wikiwhy.evidence.route-fragment-01`, visible label **AI WRITE ROUTE / 01**, asset [`evidence-route-fragment-01.svg`](../../apps/internet-recovery/art/site-assets/wikiwhy-campaign/evidence-route-fragment-01.svg). It records that `ai_repair_service` kept a publish route active after its command ended. Do not use toast art as the evidence receipt. |
| Does ThreadIt's connector tree require custom illustration? | **No.** Render the meaningful tree as accessible DOM plus inline SVG connectors so branches can move, collapse, and expose origins. Use the supplied standalone SVGs only for the original mark, avatars/process badge, duplicate badge, and secured payoff. |

## Runtime character extraction review

The four current crops are consistent with the production sheets and readable
at normal desktop scale.

| Story beat | Approved panel | Notes |
| --- | --- | --- |
| Hub support and secured encouragement | `amy_supportive` | Friendly, confident, and does not imply Amy is completing the repair. |
| Shield instruction | `amy_tools` | Makes the three-pass containment read as a prepared engineering tool rather than a vague pep talk. |
| Background-write warning and evidence check | `amy_evidence` | The monitor gesture makes the warning feel evidence-led rather than dramatic. |
| First ended-command contradiction | `chinmay_fluster_1` | Correct first escalation: long-haired, sincere, surprised, not villain-coded. |
| Blocked autonomous write | `chinmay_fluster_2` | Use only after the AI has demonstrably continued without a command. |

Keep the portrait at roughly the current scale. On modal layouts, the portrait
may shrink before body copy or the primary action does. Never crop Chinmay's
hair so tightly that the long-haired silhouette disappears.

The added runtime crop is published as
[`amy-tools.jpg`](../../apps/internet-recovery/art/characters/dialogue/amy-tools.jpg),
exported from row 2, column 3 of `amy-production-portraits.png` at 384 by 384
pixels with the existing dialogue-crop framing and JPEG quality. This is a
mechanical crop of approved art, not a newly generated portrait.

Runtime wiring remains a builder action: import this crop in
`apps/internet-recovery/wikiwhy-dialogues.js` and change the `shield-intro`
portrait from `AMY_SUPPORTIVE_URL` to the new tools asset. No other dialogue
mapping changes.

## WikiWhy campaign response

The complete state-delta and evidence specification is in
[`WIKIWHY_CAMPAIGN_STATE_PACK.md`](../gameplay/WIKIWHY_CAMPAIGN_STATE_PACK.md).
The implemented one-passage reader remains the base layer. The campaign pack
adds only:

- the 70-79 percent background-write clue;
- the accessible right-to-left 80 percent rewrite;
- three visually distinct Shield states;
- the permanent secured treatment;
- evidence slot 1 and its route fragment.

## ThreadIt response

The production handoff is in
[`THREADIT_PRODUCTION_HANDOFF.md`](../gameplay/THREADIT_PRODUCTION_HANDOFF.md).
Its asset manifest is
[`apps/internet-recovery/art/site-assets/threadit/README.md`](../../apps/internet-recovery/art/site-assets/threadit/README.md).

The source tree is meaningful information, so its nodes, labels, relationships,
and duplicate status must exist in the accessibility tree. The supplied SVG
process art is a visual accent, not the source of truth.

## Remaining site response

FacePlace, MyCorner, Yahuh! Portal, ViewTube, Search-ish, Amaze-On, Spotty-Fi,
and MapGuess now each contain exact Act I units, midpoint triggers, preserved
state, finale units, secured conditions, palette tokens, responsive behavior,
reduced-motion direction, and accessible composition in their files under
[`site-build-briefs/`](../gameplay/site-build-briefs/README.md). Shared behavior
is frozen in
[`SITE_PRODUCTION_SYSTEM.md`](../gameplay/SITE_PRODUCTION_SYSTEM.md), and the
original runtime marks are in
[`site-assets/marks/`](../../apps/internet-recovery/art/site-assets/marks/README.md).

## Final breach response

The separate `EVIDENCE_11.LIVE` boss arc is production-frozen in
[`FINAL_BREACH_RUNTIME_BRIEF.md`](../gameplay/FINAL_BREACH_RUNTIME_BRIEF.md),
with three saved checkpoints, complete copy IDs, a safety contract, resumable
state, original SVG assets, and a six-state production board. It does not reuse
an ordinary site's progress model.

## Non-negotiable continuity

- Only Reading Companion text is speech-scored.
- Site text, votes, branches, evidence receipts, and dialogue are wrapper-owned.
- The Recovery Desktop remains stable during WikiWhy and ThreadIt.
- The AI service is the hostile writer. Chinmay is responsible and sincere, not
  malicious.
- Continue stays available after an accepted reading; retry stays optional.
- No campaign state uses raw audio or transcript text.
