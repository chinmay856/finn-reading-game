# First Six Vocabulary QA — 2026-08-22

Status: implementation gate for the playable vocabulary cards. The reading selections and passage wording remain canonical; vocabulary cards remain editable playtest content.

## Audit result

- Reviewed inventory: 159 cards across 53 passages.
- The existing structural validator passes, but it only proves that every passage has three non-proper-noun cards and that each example sentence is copied from the passage.
- 41 definitions still contain raw dictionary usage labels such as “uncountable,” “transitive,” or “not comparable.” Those are evidence that the definition was imported rather than written for this reader and context.
- Several words repeat across unrelated passages, including `question` five times, `original` four times, and `existence`, `agreement`, `distance`, and `mysterious` three times each.
- Many cards are below the intended stretch level. Common examples include `question`, `attention`, `several`, `sentence`, `vacation`, `conversation`, `medical`, and `position`.
- The `wikiwhy-01` card for `sensitive` used the emotional sense even though the passage uses sensitivity to wavelengths. That card and the two other low-challenge cards in the set have been replaced.

## Corrected first set

| Passage | Word | Context-specific meaning | Exact passage sentence |
| --- | --- | --- | --- |
| `wikiwhy-01` | dichromatic | Using two primary types of color-sensing cells rather than three. | Experiments have found that dogs have dichromatic vision, meaning that their color system relies on two main kinds of cone cells rather than the three used by most humans. |
| `wikiwhy-01` | pigments | Substances that absorb some wavelengths of light and reflect or respond to others. | The two cone pigments are most sensitive to short and medium-to-long wavelengths of light. |
| `wikiwhy-01` | wavelengths | The distances between repeating points in waves; different wavelengths of visible light correspond to different colors. | The two cone pigments are most sensitive to short and medium-to-long wavelengths of light. |

## Playable-deck editorial queue

This queue covers the four playable decks backed by the canonical manuscript. “Rebuild” means choose three stronger words from the existing passage and write definitions for the sense used there. “Revise” means one or more words may remain, but every definition needs a contextual rewrite.

| Deck | Passages | Decision |
| --- | --- | --- |
| WikiWhy | `wikiwhy-02`–`wikiwhy-10` | Rebuild the sets dominated by common academic nouns (`question`, `statement`, `agreement`, `experience`, `experiment`, `material`, `reference`). Preserve strong candidates such as `inference`, `fecundity`, and `revelation`, with reader-facing definitions. |
| ThreadIt | `threadit-01`–`threadit-09` | Rebuild sets using `several`, `question`, `government`, `forgive`, `education`, `original`, `entrance`, `agreement`, `repetition`, and `statement`. Preserve contextually strong candidates such as `assurance`, `dismissal`, `solidity`, and `stimulate` after definition review. |
| FacePlace | `faceplace-01`–`faceplace-08` | Rebuild sets using `distance`, `surprised`, `continued`, `vacation`, `seventeen`, `silence`, `several`, `conversation`, `excitement`, `fraction`, `sentence`, `observation`, `importance`, and `question`. Preserve `perplexity`, `conscious`, `theatrical`, and `judicious` after sense review. |
| ViewTube | `viewtube-01`–`viewtube-08` | Rebuild sets using `attention`, `suddenly`, `practical`, `fraction`, `objective`, `emotional`, `attentive`, `objection`, `majority`, `medical`, `community`, `inspection`, `material`, `difference`, `question`, `position`, and `presence`. Preserve `backwater`, `ingenuity`, `deportment`, `commodious`, and `lucrative` after definition review. |

The two canonical but not-yet-playable decks, MyCorner and Yahuh, should go through the same rebuild before their passages enter a playable site. Do not pre-generate permanent audio assets for a card until its word, contextual definition, and exact sentence pass this gate.

## Acceptance gate for every replacement

1. The word is not a proper noun and is meaningfully challenging for the intended reader; length alone is not evidence of difficulty.
2. The definition states the sense used in the exact sentence, without dictionary grammar labels or unrelated secondary senses.
3. The exact sentence is understandable enough to reinforce that definition when read aloud.
4. The three cards in one passage teach different ideas and do not merely repeat common academic vocabulary.
5. Permanent audio is generated only after the card passes editorial review.
