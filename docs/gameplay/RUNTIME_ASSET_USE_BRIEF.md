# Internet Recovery 98 runtime asset use brief

## Purpose

This is a design-only asset-use brief for the builder. It identifies which
current art files are canonical builder inputs, which files are comparison
history, and how to crop the production character sheets without regenerating
new art for every message.

All listed images are wrapper assets. They must not enter the Reading Engine,
Content Platform, speech adapter, scoring logic, or theme-neutral content
records.

## Canonical production character sheets

All production character sheets are `1536x1024` PNGs in
`apps/internet-recovery/art/characters/`.

| Sheet | Grid | Cell size | Runtime use |
| --- | --- | --- | --- |
| `amy-production-portraits.png` | 3 columns x 2 rows | 512x512 | Amy support portraits and tool/evidence poses |
| `chinmay-production-portraits.png` | 3 columns x 2 rows | 512x512 | long-haired Chinmay states from polished to flustered |
| `techno-production-sprites.png` | 4 columns x 2 rows | 384x512 | Techno desktop sprite states, mostly with ball |

Panel IDs and reading order are canonical in
`apps/internet-recovery/art/characters/README.md`.

### Amy crop map

Use a 3x2 grid, left to right, top row first:

| ID | Crop cell | Use |
| --- | --- | --- |
| `amy_neutral` | row 1, col 1 | baseline support, hub calm state |
| `amy_skeptical` | row 1, col 2 | Chinmay's explanation is not matching the logs |
| `amy_amused` | row 1, col 3 | dry humor, low-stakes absurdity |
| `amy_supportive` | row 2, col 1 | secured payoff, encouragement |
| `amy_evidence` | row 2, col 2 | pattern detection, trace view, Case File |
| `amy_tools` | row 2, col 3 | setup, Shield Protocol, repair utilities |

### Chinmay crop map

Use a 3x2 grid, left to right, top row first. Chinmay always remains
long-haired and sincere. Escalation is messier hair, rumpled presentation, and
frazzled expression, not anger or villain framing.

| ID | Crop cell | Use |
| --- | --- | --- |
| `chinmay_neutral` | row 1, col 1 | ordinary broadcast, pre-escalation |
| `chinmay_confident` | row 1, col 2 | overconfident "AI can fix this faster" |
| `chinmay_fluster_1` | row 1, col 3 | first proof the shortcut backfired |
| `chinmay_fluster_2` | row 2, col 1 | logs contradict his explanation |
| `chinmay_fluster_3` | row 2, col 2 | AI ignores pause/stop command |
| `chinmay_relieved` | row 2, col 3 | humbled collaborator after containment |

### Techno crop map

Use a 4x2 grid, left to right, top row first:

| ID | Crop cell | Use |
| --- | --- | --- |
| `techno_idle_ball_bounce` | row 1, col 1 | hub idle, normal desktop pet |
| `techno_alert_ball_pin` | row 1, col 2 | pins suspicious evidence or destination |
| `techno_suspicious_file` | row 1, col 3 | guards Case File or suspicious object |
| `techno_bark_ball` | row 1, col 4 | heightened visual alert |
| `techno_ceo_broadcast_nap` | row 2, col 1 | Chinmay broadcast comedy beat |
| `techno_usb_delivery` | row 2, col 2 | delivers a file or clue |
| `techno_celebrate_spin` | row 2, col 3 | secured-site payoff |
| `techno_clue_point` | row 2, col 4 | points to next useful window |

Accessible labels describe what Techno does. Do not give her dialogue.

## Canonical ten-site concept boards

All canonical site boards are `1536x1024` PNGs. Use them as visual references,
preview images, and layout/story guides. They are not final responsive UI
screenshots and should not be treated as exact implementation blueprints.

| Site | Canonical board |
| --- | --- |
| WikiWhy | `apps/internet-recovery/art/concepts/wikiwhy-three-act-rogue-ai.png` |
| ThreadIt | `apps/internet-recovery/art/concepts/sites/threadit-rogue-ai-campaign.png` |
| FacePlace | `apps/internet-recovery/art/concepts/sites/faceplace-rogue-ai-campaign.png` |
| MyCorner | `apps/internet-recovery/art/concepts/sites/mycorner-rogue-ai-campaign.png` |
| Yahuh! Portal | `apps/internet-recovery/art/concepts/sites/yahuh-portal-rogue-ai-campaign.png` |
| ViewTube | `apps/internet-recovery/art/concepts/sites/viewtube-rogue-ai-campaign.png` |
| Search-ish | `apps/internet-recovery/art/concepts/sites/search-ish-rogue-ai-campaign.png` |
| Amaze-On | `apps/internet-recovery/art/concepts/sites/amaze-on-rogue-ai-campaign.png` |
| Spotty-Fi | `apps/internet-recovery/art/concepts/sites/spotty-fi-rogue-ai-campaign.png` |
| MapGuess | `apps/internet-recovery/art/concepts/sites/mapguess-rogue-ai-campaign.png` |

Use the site boards for:

- visual identity and transformed parody direction;
- desktop/browser/companion relationship;
- local three-act story tone;
- midpoint and finale reference;
- preview cards before full implementation.

Do not use them for:

- final text legibility at runtime;
- exact responsive layout measurements;
- speech-scored passage content;
- character panel crops, except as rough context;
- real brand logos, exact screenshots, or copied trade dress.

## Historical and superseded files

Files matching `*-superseded.png` are explicit comparison history only.

Plain files matching `*-campaign.png` in
`apps/internet-recovery/art/concepts/sites/` are earlier concept passes. They
may be inspected for history, but the builder should prefer the
`*-rogue-ai-campaign.png` board listed above for current runtime direction.

Do not use any board that mixes near-photo private references with cartoon
characters. Private reference photos never enter the product.

## Runtime preview image guidance

For a preview-only site tile or design-preview window:

- use the canonical board as a reduced preview image if helpful;
- overlay clear `DESIGN PREVIEW`, `VIEW ONLY`, and `NO READING SCORE` labels;
- do not crop out labels in a way that implies the site is playable;
- do not use the board as a substitute for accessible text;
- keep the Reading Companion in `MIC: OFF` preview mode.

For a playable site:

- build the runtime layout from HTML/CSS/DOM or equivalent UI components;
- use board composition as a reference, not as the entire screen;
- use character-sheet crops for Amy, Chinmay, and Techno instead of board
  cameos;
- keep decorative site art outside the Reading Companion.

## Asset acceptance checks

- Are all character reactions selected from the production sheets?
- Does every Chinmay use long hair and non-villain framing?
- Does Techno's ball remain a visual prop rather than a scoring mechanic?
- Are canonical `*-rogue-ai-campaign.png` boards used instead of superseded or
  plain earlier boards?
- Does preview mode clearly disclose that reading/scoring is not connected?
- Is all site text implemented accessibly rather than only embedded in an image?

