# Content readiness index — 2026-07-12

## What this proves

Every canonical first-run site arc and the final breach now has a complete
manuscript roster. This proves manuscript supply, stable IDs, broad grade target,
rights intent, and comprehension intent. It does **not** prove runtime
selectability. Each record remains fail-closed until it is encoded and passes
the repository's independent editorial, factual/adaptation, grade, sensitivity,
accessibility, comprehension, reading-profile, rights, and real-microphone gates.

## First-run rosters

| Site | Required | Manuscript evidence | Status |
| --- | ---: | --- | --- |
| WikiWhy | up to 11 first run | 10 Deck A + `printing-press-b01` overflow in [`content/wikiwhy/PASSAGE_DECKS.md`](../../content/wikiwhy/PASSAGE_DECKS.md); 10 additional Deck B replay texts | manuscript complete; A01 alone currently encoded/selectable |
| ThreadIt | 7 | A01 plus A02–A07 structured candidate records; frozen manuscripts originated in [PR #55](https://github.com/chinmay856/finn-reading-game/pull/55) | manuscript complete and encoded; review-gated |
| FacePlace | 6 | A01 plus A02–A06 structured candidate records; frozen manuscripts originated in [PR #56](https://github.com/chinmay856/finn-reading-game/pull/56) | manuscript complete and encoded; review-gated |
| MyCorner | 7 | A01 plus A02–A07 structured candidate records; frozen manuscripts originated in [PR #57](https://github.com/chinmay856/finn-reading-game/pull/57) | manuscript complete and encoded; review-gated |
| Yahuh! Portal | 6 | A01 structured candidate on `main`; A02–A06 in [PR #48](https://github.com/chinmay856/finn-reading-game/pull/48) | manuscript complete; review-gated |
| ViewTube | 7 | A01 candidate on builder branch; A02–A07 in [PR #49](https://github.com/chinmay856/finn-reading-game/pull/49) | manuscript complete; review-gated |
| Search-ish | 7 | A01–A07 in [PR #51](https://github.com/chinmay856/finn-reading-game/pull/51) | manuscript complete; review-gated |
| Amaze-On | 7 | A01–A07 in [PR #53](https://github.com/chinmay856/finn-reading-game/pull/53) | manuscript complete; review-gated |
| Spotty-Fi | 8 | A01–A08 in [PR #54](https://github.com/chinmay856/finn-reading-game/pull/54) | manuscript complete; review-gated |
| MapGuess | 8 | A01 structured candidate on `main`; A02–A08 in [PR #58](https://github.com/chinmay856/finn-reading-game/pull/58) | manuscript complete; review-gated |
| Final breach | 3 | trace, preserve, revoke records in [PR #46](https://github.com/chinmay856/finn-reading-game/pull/46), 218/236/239 words | manuscript complete; review-gated |

## Runtime-design packets

Canonical wrapper fixtures and endgame decisions are published in PRs
[#37](https://github.com/chinmay856/finn-reading-game/pull/37),
[#40](https://github.com/chinmay856/finn-reading-game/pull/40),
[#41](https://github.com/chinmay856/finn-reading-game/pull/41),
[#42](https://github.com/chinmay856/finn-reading-game/pull/42),
[#43](https://github.com/chinmay856/finn-reading-game/pull/43),
[#44](https://github.com/chinmay856/finn-reading-game/pull/44), and
[#46](https://github.com/chinmay856/finn-reading-game/pull/46). MyCorner and
Yahuh packets were consumed by merged implementation PRs #45/#47 and #50.

## Required next gate

For each manuscript, the builder/content reviewer must:

1. encode one structured passage record with the frozen ID and exact scored text;
2. freeze three answer choices and feedback from the manuscript intent;
3. add reading-profile timing and segmentation metadata;
4. complete the full review-state fields honestly;
5. perform real microphone testing and record unstable transcript tokens;
6. make the record selectable only after every required gate passes;
7. verify each site's no-repeat first-run route and save/resume behavior.

Do not bulk-mark manuscripts approved because this index exists. A manuscript
is complete writing; an approved passage is separately verified runtime data.
