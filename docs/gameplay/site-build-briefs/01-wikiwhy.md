# Site brief 01: WikiWhy

## Status

WikiWhy is the first playable Internet Recovery 98 slice. The detailed
scene-by-scene brief is
[`../WIKIWHY_FIRST_SLICE_BUILD_BRIEF.md`](../WIKIWHY_FIRST_SLICE_BUILD_BRIEF.md).
Campaign-only warning, rewrite, Shield, secured, and evidence layers are frozen
in [`../WIKIWHY_CAMPAIGN_STATE_PACK.md`](../WIKIWHY_CAMPAIGN_STATE_PACK.md).
This file exists so the ten-site package has one consistent entry per site.

## Core promise

Finn repairs a corrupted collaborative encyclopedia by reading independent
passages in the Reading Companion. The visible lesson is simple: people can
contribute information, but evidence earns trust.

## Builder target

Build this site first:

1. show a corrupted encyclopedia page inside the Recovery Browser;
2. keep the Reading Companion separate and clearly marked;
3. let accepted reading results advance a page-level repair wipe;
4. reveal a background automated write after the page has visibly improved;
5. complete exactly three final Shield Protocol repairs;
6. secure the site and save the evidence file.

## Runtime identity

| Element | Direction |
| --- | --- |
| Archetype | Collaborative encyclopedia |
| Bad rule | `USERS ARE ALWAYS RIGHT` |
| Repaired rule | `PEOPLE CAN CONTRIBUTE; EVIDENCE EARNS TRUST` |
| Progress fiction | Evidence cleanup wipe and citation restoration |
| AI failure | Automated verifier keeps writing after its command ended |
| Secured label | `WIKIWHY SECURED` |

## Character states

- Amy: `amy_tools` at entry, `amy_evidence` at suspicion,
  `amy_skeptical` at the AI-write reveal, `amy_supportive` at secured payoff.
- Chinmay: `chinmay_fluster_1` at the rewrite reveal,
  `chinmay_fluster_2` at secured payoff.
- Techno: `techno_idle_ball_bounce`, then `techno_alert_ball_pin`, then
  `techno_celebrate_spin`.

## Content lane

Use `content/wikiwhy/PASSAGE_DECKS.md`. Deck A is first-run content. Deck B is
unseen replay content. Only the assigned passage is speech-scored.

## Acceptance checks

- Does the page look like a corrupted encyclopedia, not a generic article card?
- Is the Reading Companion obviously the text Finn should read aloud?
- Does every accepted reading produce visible repair?
- Does the midpoint preserve saved reading and evidence?
- Does the final Shield Protocol honor exactly three final repairs?
- Does the ending show `ACCESS DENIED` for the AI write path?
