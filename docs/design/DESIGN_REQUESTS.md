# Implementation-to-design requests and decisions

This is the durable implementation-to-design handoff for Internet Recovery 98.
PR #30 is merged; its questions are answered below and in the focused design
response. Future builders should add new requests here instead of relying on
chat history.

## Current synchronization point

- Implementation baseline: `main` at `270c63d` (PR #30 merged)
- Design response branch: `agent/campaign-spine-content` / PR #23
- Focused response batch: `8b4440b`; complete ten-site contracts: `8786fea`
- Canonical architecture: [`../ARCHITECTURE_AND_VISION.md`](../ARCHITECTURE_AND_VISION.md)
- Storyboard reference catalog (not runtime input):
  [`../../apps/internet-recovery/art/concepts/sites/README.md`](../../apps/internet-recovery/art/concepts/sites/README.md)
- Production character manifest:
  [`../../apps/internet-recovery/art/characters/README.md`](../../apps/internet-recovery/art/characters/README.md)

Already integrated: the promoted five corrected site boards, regenerated map
previews, Amy/Chinmay/Techno production sheets, Amy and Chinmay runtime portrait
crops, the ten-site hub, and the rogue-AI story correction. Do not regenerate
those merely to restate the same direction.

## Current review captures

- [Recovery Map](review/recovery-map-current.jpg)
- [WikiWhy reading view](review/wikiwhy-reading-current.jpg)
- [Amy warning dialogue](review/amy-warning-current.jpg)
- [Chinmay rewrite dialogue](review/chinmay-rewrite-current.jpg)

These captures show the executable browser UI, not a concept-board composite.
Please review them at normal desktop scale and call out a concrete state, asset,
or spacing change rather than replacing the whole screen with another board.

## Answered requests

### P0 — Runtime character extraction — answered

The approved next mapping is:

| Story beat | Production sheet ID | Runtime crop |
| --- | --- | --- |
| Hub support and secured encouragement | `amy_supportive` | `amy-supportive.jpg` |
| Shield instruction | `amy_tools` | `amy-tools.jpg` |
| Background-write warning and evidence check | `amy_evidence` | `amy-evidence.jpg` |
| AI continues after command end | `chinmay_fluster_1` | `chinmay-fluster-1.jpg` |
| Blocked autonomous write | `chinmay_fluster_2` | `chinmay-fluster-2.jpg` |

This is the approved mapping. Preserve long-haired, sincere, increasingly
frazzled Chinmay; no angry or villain-coded variant is wanted.

Builder action still open: import `amy-tools.jpg` in
`apps/internet-recovery/wikiwhy-dialogues.js` and map `shield-intro` to that
asset. The merged baseline still points `shield-intro` at `amy-supportive.jpg`.

One preview-copy cleanup is also open: in `app.js`, replace the visible phrase
`builder-ready design board` with `storyboard preview`. The existing JPEG crop
may remain for honest preview mode, but it is not a production identity or state
input.

### P1 — ThreadIt production handoff — completed in `8b4440b`

ThreadIt is the approved second-site portability proof because its source tree
must feel materially different from WikiWhy's repair wipe. The completed pack
provides:

1. An original ThreadIt mark plus palette, type, border, and spacing tokens.
2. A browser-content layout specification for these named states:
   `threadit_corrupted`, `threadit_tracing`, `threadit_secured`.
3. Separate, implementation-usable assets for the duplicate-source avatars,
   connector/source tree, Consensus Auto-Fix process, and secured/source-stable
   payoff. Transparent PNG or WebP is preferred where art cannot be DOM-native.
4. A clear midpoint composition for **Consensus Cascade / TRACE VIEW** and a
   final **POSTING PAUSED: DUPLICATE SOURCE** consequence.
5. Character placement guidance that never covers the Reading Companion,
   microphone state, highlighted text, or result controls.
6. A small asset manifest with IDs, dimensions, intended state, and whether each
   asset is decorative or meaningful.

The production handoff removes board-only labels, generated microcopy, real
browser/product logos, Windows marks, and legacy `Internet Explorer` chrome.
Target the current 1440×900 desktop composition first, while keeping the inset
browser and independent Reading Companion workable down to 1180 CSS pixels.

### P1 — WikiWhy campaign-only visual states — completed in `8b4440b`

The one-passage WikiWhy reader is implemented. The campaign pack now provides:

- the 70–79% background-write clue;
- the accessible 80% right-edge-to-center rogue-AI rewrite;
- Shield Passes 1, 2, and 3 as distinct, legible states;
- the permanent `SECURED` browser/icon treatment;
- the first Case File evidence artifact and its access-route fragment.

The delivered state deltas and reusable layers do not redesign the reader. The
passage, microphone, highlighting, score, and comprehension UI remain stable
engine/content consumers.

### P2 — Later-site design contracts — completed in `8786fea`

After ThreadIt, the implementation order remains MapGuess, FacePlace,
MyCorner, Yahuh! Portal, ViewTube, Search-ish, Amaze-On, then Spotty-Fi unless a
documented dependency changes it. Each exact Act I, midpoint, finale,
persistence, responsive, and reduced-motion contract is published.
Implementation should still proceed one accepted vertical slice at a time.

Every pack should reuse the stable desktop shell but provide its own internal
composition and progress fiction. Do not turn the ten boards into ten skins of
WikiWhy.

## Focused questions

| Question | Designer response |
| --- | --- |
| Is ThreadIt approved as the next production site after WikiWhy, or is another site materially more ready? | **ThreadIt approved.** Use [`THREADIT_PRODUCTION_HANDOFF.md`](../gameplay/THREADIT_PRODUCTION_HANDOFF.md), published in `8b4440b`. |
| Are the four current Amy/Chinmay runtime mappings above approved without changes? | **Three approved; one split.** Keep `amy_evidence`, `chinmay_fluster_1`, and `chinmay_fluster_2`. Use `amy_supportive` for hub/secured beats and `amy_tools` for Shield instruction. |
| Which exact visual artifact should become WikiWhy evidence slot 1? Include an asset ID and short label. | Use `wikiwhy.evidence.route-fragment-01`, label **AI WRITE ROUTE / 01**, from [`evidence-route-fragment-01.svg`](../../apps/internet-recovery/art/site-assets/wikiwhy-campaign/evidence-route-fragment-01.svg). Toast art remains decorative. |
| Does ThreadIt's connector tree require custom illustration, or can the supplied tokens/layout be rendered as accessible DOM/SVG? | Use accessible semantic DOM plus inline SVG connectors. Standalone SVG art is accent only; nodes, labels, lineage, and duplicate status remain exposed to assistive technology. |

## Boundaries for design responses

- Do not place site names, characters, evidence fiction, or campaign thresholds
  in Reading Engine, speech, Content Platform records, or theme-neutral scoring.
- Do not supply new passage text as final content without provenance, rights,
  factual, grade-level, sensitivity, and microphone review.
- Do not use private photos as shipped art or produce photoreal character panels.
- Do not change Finn, Chinmay, the AI, Amy, or Techno's canonical roles.
- Do not corrupt the trusted desktop shell during ordinary site missions.

When a new request is added, record its eventual decision and commit hash here,
then update the relevant asset manifest. That gives implementation agents an
objective synchronization point instead of relying on chat history.
