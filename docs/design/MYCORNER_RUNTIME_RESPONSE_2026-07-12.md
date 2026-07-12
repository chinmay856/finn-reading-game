# MyCorner canonical runtime response — 2026-07-12

## Status

This freezes MyCorner's wrapper fixture and interaction decisions. It does not
promote reading content. Passage records remain unavailable until every normal
content and real-microphone gate passes.

## Canonical fixture

Fixture ID: `mycorner-profile-fixture-01`.

### Owner and modules

| Field | Canonical value |
| --- | --- |
| Owner | `mycorner-profile-mara-vale-01`; Mara Vale; `MV`; `@mara_corners` |
| Mood | `mycorner-mood-night-city-01`; `BUILDING A TINY NIGHT CITY` |
| Privacy badge | `FRIENDS ONLY` |
| About | `mycorner-about-mara-01`; source `mycorner-source-owner-about-01`; `I build tiny cardboard cities, then write down which windows stay lit after midnight.` |
| Theme | `mycorner-theme-midnight-scrapbook-01`; `Midnight Scrapbook`; owner Mara |
| Theme swatches | `#244A88`, `#E7F0FF`, `#C4478C`, `#E7BF45`, `#2C7A57` |
| Theme fragments | `mycorner-theme-fragment-grid-stars-01` / `HAND-DRAWN GRID STARS`; `mycorner-theme-fragment-tape-corners-02` / `YELLOW TAPE CORNERS` |
| Music | `mycorner-music-paper-satellites-01`; `Paper Satellites`; North Window Club; original fictional metadata; autoplay off; `audioAssetId: null` |
| Counter | `mycorner-counter-owner-visits-01`; `184`; `VISITORS WHO ARRIVED ON PURPOSE` |

Owner accessible summary: `Mara Vale's fictional profile uses the initials MV
and preserves her own writing, theme, friends, music choice, and privacy.`

Posts and comments:

| ID | Author | Parent | Timestamp | Source | Body |
| --- | --- | --- | --- | --- | --- |
| `mycorner-post-station-roof-01` | Mara | — | `2026-04-16T19:20:00-07:00` | `mycorner-source-owner-post-01` | `The paper train station finally has a roof. It also has three clocks and none agree.` |
| `mycorner-comment-clocks-01` | `mycorner-person-jo-park-01` / Jo Park | station post | `2026-04-16T19:44:00-07:00` | `mycorner-source-friend-comment-01` | `The clocks are accurate in three different imaginary time zones.` |
| `mycorner-post-street-bench-02` | Mara | — | `2026-04-17T22:05:00-07:00` | `mycorner-source-owner-post-02` | `Tonight's rule: every tiny street gets one unnecessary bench.` |
| `mycorner-comment-bench-02` | `mycorner-profile-rin-moss-02` / Rin Moss | bench post | `2026-04-17T22:31:00-07:00` | `mycorner-source-friend-comment-02` | `Please reserve the bench beside the cardboard bakery.` |

Friend records: Jo Park (`JP`), Inez Bell (`IB`), Sol Reed (`SR`), and Rin
Moss (`RM`), using IDs `mycorner-person-jo-park-01`,
`mycorner-person-inez-bell-02`, `mycorner-person-sol-reed-03`, and
`mycorner-profile-rin-moss-02`.

Groups:

- `mycorner-group-workshop-crew-01`, `WORKSHOP CREW`, order 1: Jo, Inez.
  Accessible summary: `Mara placed Jo Park and Inez Bell in Workshop Crew.`
- `mycorner-group-night-readers-02`, `NIGHT READERS`, order 2: Sol, Rin.
  Accessible summary: `Mara placed Sol Reed and Rin Moss in Night Readers.`

Privacy controls:

- `mycorner-privacy-profile-01`: `PROFILE VISIBILITY` = `FRIENDS ONLY`.
- `mycorner-privacy-comments-02`: `COMMENTS` = `FRIENDS MAY COMMENT`.
- `mycorner-privacy-template-03`: `TEMPLATE CHANGES` = `OWNER APPROVAL REQUIRED`.

Source view lines:

```text
profile_owner = mycorner-profile-mara-vale-01
theme_owner = mycorner-profile-mara-vale-01
music_autoplay = false
template_permission = owner_approval_required
```

Accessible summary: `Mara owns the profile and theme, music autoplay is off,
and template changes require her approval.`

### Saved midpoint choices

| Order | ID | Label | Value | Unit |
| ---: | --- | --- | --- | --- |
| 1 | `mycorner-choice-owner-01` | `PROFILE OWNER` | `Mara Vale` | `owner_about` |
| 2 | `mycorner-choice-about-02` | `ABOUT ME` | `Tiny cardboard cities` | `owner_about` |
| 3 | `mycorner-choice-theme-03` | `THEME` | `Midnight Scrapbook` | `theme_friends` |
| 4 | `mycorner-choice-friends-04` | `FRIEND GROUPS` | `Workshop Crew + Night Readers` | `theme_friends` |
| 5 | `mycorner-choice-music-05` | `MUSIC` | `Paper Satellites — autoplay off` | `media_counter` |
| 6 | `mycorner-choice-privacy-06` | `PRIVACY` | `Friends only` | `privacy_source` |

### Active template comparison

Template ID remains `chinmay_demo_profile`.

```text
ownerDisplayName: Chinmay
ownerHandle: @chinmay_demo
currentMood: SPONSORED
about: AI-company CEO. Professionally complete. Available for keynotes and emergency relaunches.
theme: Executive Launch Gradient
friendLayout: TOP 8,000 FRIENDS: CHINMAY REPEATED
music: Quarterly Momentum Theme — autoplay requested
privacy: PUBLIC BY VIBE
applyToEveryone: true
```

Chinmay is sincere and flustered; this is his rushed demo profile being
misapplied, not deliberate sabotage.

### Corrupted-state records

| ID | Corrupted value |
| --- | --- |
| `mycorner-corrupt-owner-01` | `Chinmay's demo account` |
| `mycorner-corrupt-about-01` | `generated from a starter profile` |
| `mycorner-corrupt-post-01` | `Professional update approved for maximum completeness.` |
| `mycorner-corrupt-friends-01` | `TOP 8,000 FRIENDS: CHINMAY REPEATED` |
| `mycorner-corrupt-music-01` | `ENGAGEMENT IS CHARACTER`; claims autoplay is required, but runtime remains silent/off |
| `mycorner-corrupt-counter-01` | `POPULARITY: MAXIMUM` |
| `mycorner-corrupt-privacy-01` | `PUBLIC BY VIBE` |
| `mycorner-corrupt-source-01` | `SOURCE VIEW: UNAVAILABLE` |
| `mycorner-corrupt-theme-01` | `MOST COMPLETE BLUE` |

## Unit assignments

1. `owner_about`: owner, mood, About, both posts, both comments.
2. `theme_friends`: theme, fragments, groups, friend records.
3. `media_counter`: silent music selection and visitor counter.
4. `privacy_source`: privacy controls and source view.
5. `profile_owner_lock`: lock owner and mood to Mara.
6. `presentation_owner_lock`: lock theme, groups, music, and counter choices.
7. `global_apply_blocked`: block the template write to Rin Moss.

The blocked write is `mycorner-blocked-write-owner-permission-01`. Actor:
`mycorner-process-auto-persona-01`. Target:
`mycorner-profile-rin-moss-02`. Attempted fields: `profile_owner`,
`theme_owner`, `music_choice`, and `privacy`. Template:
`chinmay_demo_profile`.

## Process and evidence contract

`AUTO-PERSONA` is the player-facing local job and blocked-write actor.
`TOM-ISH THEME GENERATOR` is its theme subtask. `PROFILE AUTO-FIX AI` is the
plain-language family label used in logs. `VIBESHIFT AI` is the internal model
family. All resolve through parent service `ai_repair_service`; they are not
four independent antagonists.

```text
siteId: mycorner
slot: 4
evidenceId: mycorner.evidence.global-profile-template-01
assetId: null
filename: MYCORNER_GLOBAL_PROFILE_TEMPLATE.REC
title: MYCORNER / GLOBAL PROFILE TEMPLATE
shortLabel: GLOBAL PROFILE TEMPLATE
principle: You choose what represents you.
whatChanged: Profiles keep owner-written identity, chosen themes, and visible privacy controls.
aiBehavior: The profile generator treated one polished demo account as the template for everyone.
localWriterFingerprint: mc-autopersona-vibeshift-44b2
upstreamServiceId: ai_repair_service
routeFragment.id: mycorner.route.global-template-04
routeFragment.from: mycorner-process-auto-persona-01
routeFragment.fromLabel: AUTO-PERSONA
routeFragment.to: ai_repair_service
routeFragment.toLabel: AI REPAIR SERVICE
routeFragment.relationshipLabel: local profile-template job routed to parent service
routeFragment.accessibleSummary: MyCorner's local Auto-Persona template job routes to the upstream AI repair service.
blockedWriteId: mycorner-blocked-write-owner-permission-01
blockedActorId: mycorner-process-auto-persona-01
blockedTargetId: mycorner-profile-rin-moss-02
canonicalEligibility: persisted secured state plus exact registered evidence ID
```

## Content manifest

Revise the plan to 7A + 3B with no migration aliases required because none of
the planning-only B IDs has shipped as approved content.

Deck A first-run order:

1. `a-cabin-with-a-purpose-a01`
2. `the-page-you-choose-a02`
3. `a-room-that-explains-its-owner-a03`
4. `the-costume-and-the-person-a04`
5. `what-a-profile-leaves-out-a05`
6. `autoplay-is-not-personality-a06`
7. `the-template-problem-a07`

Deck B replay plan: `a-chosen-name-b01`, `the-visitor-counter-lies-b02`,
`the-habit-of-a-place-b03`.

These are frozen IDs and positions, **not seven reviewed records**. Current
honest eligibility remains zero. Each record becomes first-run eligible only
after its own full gate passes; the runtime must remain `MIC: OFF` until all
seven are eligible.

## Visual, character, and responsive decisions

- Initials and DOM/CSS theme fragments are sufficient; no new raster pack.
- Midpoint primary action: `Keep the saved profile and restore owner controls`.
- Open the active template first; `VIEW SAVED PROFILE` is reversible and does
  not acknowledge or advance.
- Character map: early `chinmay_confident`; source inspection `amy_tools`;
  midpoint `amy_amused` plus `chinmay_fluster_1`; secured `amy_supportive` plus
  `chinmay_fluster_2`.
- Techno still: `techno_suspicious_file`. Visible comparison:
  `GENERATED PROFILE: BALL / REAL OBJECT: BALL`. Accessible text remains
  `Techno compares the generated BALL profile with the real ball under her paw.`
- At 1180–1279 CSS pixels, the right owner/source/permission inspector is a
  Recovery Browser-owned accessible drawer. It auto-opens for midpoint
  acknowledgement and secured evidence, closes with Escape, traps focus while
  modal, returns focus to its opener, and never overlaps the Reading Companion.
- All media is silent; autoplay stays off and no audio asset ships in version one.

## Hub continuation

After MyCorner's local evidence payoff, return to the Recovery Map. There is no
separate global dialogue beat for this site. Stable route ID:
`hub.return.after-mycorner-evidence-01`.

Next Incoming Cases, filtering any already secured site and never presenting a
preview as playable:

1. Yahuh! Portal
2. Amaze-On
3. ViewTube

