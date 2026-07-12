# Parallel design requests

This is the durable implementation-to-design handoff for Internet Recovery 98.
The parallel designer can answer by editing the response table, updating the
referenced manifest, or publishing a focused asset commit on the design branch.

## Current synchronization point

- Implementation branch: `agent/recovery-hub-navigation`
- Last integrated design tip: `0746209` (`Promote site boards for build handoff`)
- Canonical architecture: [`../ARCHITECTURE_AND_VISION.md`](../ARCHITECTURE_AND_VISION.md)
- Builder-ready board catalog:
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

## Requests, in priority order

### P0 — Review the runtime character extraction

The implementation currently maps:

| Story beat | Production sheet ID | Runtime crop |
| --- | --- | --- |
| Hub support and Shield instruction | `amy_supportive` | `amy-supportive.jpg` |
| Background-write warning and evidence check | `amy_evidence` | `amy-evidence.jpg` |
| AI continues after command end | `chinmay_fluster_1` | `chinmay-fluster-1.jpg` |
| Blocked autonomous write | `chinmay_fluster_2` | `chinmay-fluster-2.jpg` |

Please confirm this mapping or publish an exact replacement mapping using the
existing panel IDs. Preserve long-haired, sincere, increasingly frazzled
Chinmay; no angry or villain-coded variant is wanted.

### P1 — Supply a production-ready ThreadIt handoff

ThreadIt is the recommended second-site portability proof because its source
tree must feel materially different from WikiWhy's repair wipe. The executable
pack needs:

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

The production handoff must remove board-only labels, generated microcopy, real
browser/product logos, Windows marks, and legacy `Internet Explorer` chrome.
Target the current 1440×900 desktop composition first, while keeping the inset
browser and independent Reading Companion workable down to 1180 CSS pixels.

### P1 — Finish WikiWhy's campaign-only visual states

The one-passage WikiWhy reader is implemented. The next engineering milestone
needs focused wrapper art/direction for:

- the 70–79% background-write clue;
- the accessible 80% right-to-left rogue-AI rewrite;
- Shield Passes 1, 2, and 3 as distinct, legible states;
- the permanent `SECURED` browser/icon treatment;
- the first Case File evidence artifact and its access-route fragment.

Please provide state deltas and reusable layers, not another full reader mockup.
The passage, microphone, highlighting, score, and comprehension UI are stable
engine/content consumers and should not be redesigned by this asset request.

### P2 — Prepare later site packs one vertical slice at a time

After ThreadIt, the implementation order is expected to be MapGuess, FacePlace,
MyCorner, Yahuh! Portal, ViewTube, Search-ish, Amaze-On, then Spotty-Fi unless a
documented dependency changes it. For each site, first publish only the Act I
runtime pack and its unique visible consequence. Midpoint/finale assets can
follow after the first accepted-passage slice works in the browser.

Every pack should reuse the stable desktop shell but provide its own internal
composition and progress fiction. Do not turn the ten boards into ten skins of
WikiWhy.

## Focused questions

| Question | Designer response |
| --- | --- |
| Is ThreadIt approved as the next production site after WikiWhy, or is another site materially more ready? | Pending |
| Are the four current Amy/Chinmay runtime mappings above approved without changes? | Pending |
| Which exact visual artifact should become WikiWhy evidence slot 1? Include an asset ID and short label. | Pending |
| Does ThreadIt's connector tree require custom illustration, or can the supplied tokens/layout be rendered as accessible DOM/SVG? | Pending |

## Boundaries for design responses

- Do not place site names, characters, evidence fiction, or campaign thresholds
  in Reading Engine, speech, Content Platform records, or theme-neutral scoring.
- Do not supply new passage text as final content without provenance, rights,
  factual, grade-level, sensitivity, and microphone review.
- Do not use private photos as shipped art or produce photoreal character panels.
- Do not change Finn, Chinmay, the AI, Amy, or Techno's canonical roles.
- Do not corrupt the trusted desktop shell during ordinary site missions.

When a request is answered, replace `Pending` with the decision and commit hash,
then update the relevant asset manifest. That gives implementation agents an
objective synchronization point instead of relying on chat history.
