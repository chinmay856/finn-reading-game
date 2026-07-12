# Site brief 06: ViewTube

## Core promise

ViewTube teaches that repetition and watch time do not prove truth. Finn repairs
creator/date context, transcript, source panels, and evidence tracks for a video
page that keeps counting cloned loops as independent confirmation.

## Runtime identity

| Element | Direction |
| --- | --- |
| Archetype | Video-sharing platform |
| Visual language | Red, charcoal, cream, central player, thumbnails, transcript/source panels |
| Bad rule | `WATCH TIME PROVES TRUTH` |
| Repaired rule | `A GOOD VIDEO STILL NEEDS CONTEXT` |
| Progress fiction | Editing timeline and evidence tracks restore |
| Midpoint | Autoplay corroboration |
| Secured label | `EVIDENCE TRACKS RESTORED` |

Use an original angular play bolt inside a CRT. Do not copy YouTube's logo,
exact player chrome, or brand layout.

## Audio boundary

ViewTube remains silent while the microphone is active. Any future video/audio
flavor must pause or mute during reading and must not obscure speech capture.

## Layout

Default Recovery Browser composition:

- center: video player with corrupted frame strip;
- right: recommendations repeating one clip;
- lower: transcript, creator/date, source panel, comments;
- bottom: editing timeline with footage, transcript, and source tracks.

The Reading Companion is separate from the video transcript. The transcript in
the site is decorative context and is not the scored passage.

## Three-act flow

### Act I: Restore recording

Corrupted page:

```text
WATCH TIME PROVES TRUTH

The clip repeated the longest is the most verified. Ten copies of one video now
count as ten sources.
```

Accepted readings restore:

- title;
- creator;
- date;
- transcript panel;
- source panel;
- distinct timeline frames.

Progress is the editing timeline filling with real tracks.

### Midpoint: Autoplay corroboration

The final eight seconds loop and each replay increments the confirmation count.

Visible copy:

```text
VIDEO AUTO-FIX AI counted the same clip every time it looped.

Result: one source in ten costumes.
```

Amy line:

```text
The file hashes match. Replaying a clip does not make it a new witness.
```

Chinmay line:

```text
The confirmation count was very high. I am now learning what it was counting.
```

### Resolution: Evidence Tracks Restored

Finn separates footage, transcript, and source evidence.

Payoff:

```text
EVIDENCE TRACKS RESTORED

Footage track: distinct.
Transcript track: connected.
Source track: visible.
```

Blocked write:

```text
VIDEO AUTO-FIX AI attempted to clone the last eight seconds.

DUPLICATE FRAMES - NO NEW EVIDENCE
```

Evidence file:

```text
VIEWTUBE / DUPLICATE MEDIA HASHES

The AI counted repeated footage as independent confirmation because watch time
was easier to optimize than evidence.
```

## Character states

- Amy: `amy_evidence` for matching hashes.
- Chinmay: `chinmay_fluster_1` or `chinmay_fluster_2`, depending on global
  campaign stage.
- Techno: `techno_suspicious_file` near the autoplay loop, then
  `techno_clue_point` as she paws the autoplay toggle off.

## Reading lane

Use dramatic narration, documentary prose, speeches, science explainers, and
authentic public-domain excerpts. The current sampler is `The Sky Becomes a
Streak of Fire`.

Future deck direction:

- public-domain narrative scenes with strong imagery;
- science and documentary-style explainers;
- original video-essay prose about evidence and context.

Do not copy modern creator transcripts.

## Acceptance checks

- Does progress restore video context rather than imply watch time is a score?
- Is all site audio silent during microphone use?
- Can the player see that ten loops are one source?
- Does the repaired state make transcript/source/footage distinct?
- Is the decorative site transcript not confused with the Reading Companion?

## Production state contract

Use the shared rules in
[`../SITE_PRODUCTION_SYSTEM.md`](../SITE_PRODUCTION_SYSTEM.md).

### Visual tokens

| Token | Value |
| --- | --- |
| CRT charcoal | `#242A31` |
| Cream canvas | `#F3EFE5` |
| ViewTube red | `#B43A31` |
| Context aqua | `#31848A` |
| Timeline yellow | `#D7A93E` |
| Duplicate purple | `#6851A1` |
| Verified green | `#2C7A57` |
| Border / focus | `#89939C` / `#0B66D0` |

Use the original angular play bolt inside a CRT. Do not use a rounded red play
rectangle, copied player controls, real creator UI, or a familiar video-site
wordmark. Site transcript text uses 13-14 pixels and is labeled `SITE TRANSCRIPT
(NOT READING PASSAGE)`.

### Exact timeline sequence

| State ID | Trigger | Visible result | Saved unit |
| --- | --- | --- | --- |
| `viewtube_restore_1` | first accepted reading | title, creator, and recording date return | `recording_identity` |
| `viewtube_restore_2` | second accepted reading | distinct frame strip and duration return | `distinct_frames` |
| `viewtube_restore_3` | third accepted reading | decorative transcript reconnects to timestamps | `transcript_track` |
| `viewtube_restore_4` | fourth accepted reading | source/context panel returns | `source_context` |
| `viewtube_autoplay_loop` | restore 4 saves | final eight seconds clone into ten apparent confirmations | midpoint |
| `viewtube_track_1` | next accepted reading | footage hashes grouped; duplicate loops quarantined | `footage_track_verified` |
| `viewtube_track_2` | next accepted reading | transcript timing linked to original recording | `transcript_track_verified` |
| `viewtube_track_3` | next accepted reading | source evidence separated from recommendations | `source_track_verified` |
| `viewtube_secured` | track 3 saves | evidence tracks, denial, receipt | secured |

The timeline is the progress display. It has four Act I clips and three final
evidence tracks; do not add a percentage bar.

### Midpoint proof

Show the repeated clip thumbnails with the same short hash and one origin:

```text
PLAYBACKS: 10
DISTINCT MEDIA HASHES: 1
NEW EVIDENCE: 0
```

Do not autoplay audio. A restrained visual loop may run once between readings;
reduced motion shows one frame strip with ten duplicate badges.

### Final composition and audio

- main player remains a silent visual frame during microphone use;
- recommendations sit in a clearly separate rail;
- site transcript and source panels remain distinct from the Reading Companion;
- bottom timeline labels `FOOTAGE`, `TRANSCRIPT`, and `SOURCE`;
- blocked log reads `DUPLICATE FRAMES - NO NEW EVIDENCE`.

Any future audio starts only after user interaction, pauses during capture, and
has a visible mute state.
