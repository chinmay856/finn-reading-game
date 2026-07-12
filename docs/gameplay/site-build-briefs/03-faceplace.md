# Site brief 03: FacePlace

## Core promise

FacePlace teaches that a feed is a selection, not the whole world. Finn repairs
chronology, authorship, recommendation labels, and the ability to inspect why a
post appeared.

## Runtime identity

| Element | Direction |
| --- | --- |
| Archetype | Ranked social feed |
| Visual language | Cobalt and white, aqua/yellow accents, profile rail, feed cards |
| Bad rule | `THE FEED IS WHAT HAPPENED` |
| Repaired rule | `A FEED IS A SELECTION, NOT THE WHOLE WORLD` |
| Progress fiction | Broken feed tracker becomes honest recovery map |
| Midpoint | Honest zero |
| Secured label | `FEED RECOVERY VERIFIED` |

Use original overlapping profile-frame marks. Do not use Facebook's `f`, exact
colors, or exact layout.

## Layout

Default Recovery Browser composition:

- left rail: profile card and relationship clusters;
- center: tall feed with repeated, mislabeled, and missing-context posts;
- right rail: `People You May Sort Of Know`, tracker, and `Why this appeared`;
- lower strip: recovery log.

The Reading Companion should sit beside the browser, not inside the feed. The
feed may scroll independently, but it must not steal scroll focus from the
passage while reading.

## Three-act flow

### Act I: Lying tracker

Corrupted page:

```text
THE FEED IS WHAT HAPPENED

If the feed repeats it, it must be important. If the feed hides it, it probably
did not matter.
```

Tracker jokes:

```text
Progress: 12%
Progress: 114%
Progress: AVOCADO%
```

For exactly the first three accepted readings, real page improvements happen
while the tracker remains nonsense:

- duplicate posts collapse;
- timestamps return;
- author names reappear;
- recommendation labels become visible.

### Midpoint: Honest zero

Amy reveals that the old counter measured reactions, not recovery. This should
feel like clarity, not punishment.

Visible copy:

```text
The old tracker measured reactions, not recovery.

Recovered posts saved.
Corrupted signals logged.
Starting honest feed recovery at 0%.
```

Amy line:

```text
The counter was not broken. It was measuring the wrong thing very confidently.
```

The repaired tracker starts at 0%, but previously restored posts remain visible.

### Resolution: Feed Recovery Verified

Finn restores chronology, recommendation labels, authorship, and `Why this
appeared`.

Payoff:

```text
FEED RECOVERY VERIFIED

Chronology restored.
Recommendations labeled.
Forced distribution disabled.
```

Blocked write:

```text
FEED AUTO-FIX AI attempted to boost the same post again.

FORCED DISTRIBUTION: OFF
```

Evidence file:

```text
FACEPLACE / PROMOTED-FEED RECORD

The AI optimized reactions and repetition, then treated attention as importance.
```

## Character states

- Amy: `amy_skeptical` for the dishonest tracker reveal; `amy_supportive` at
  the secured state.
- Chinmay: `chinmay_confident` for early "important posts first" claims, or
  `chinmay_fluster_1` once the tracker is exposed.
- Techno: `techno_alert_ball_pin`; she drops her ball on `AVOCADO%`, then pins
  it beside `Why this appeared`.

## Reading lane

Use memoir, letters, social perception, first impressions, privacy, and curated
identity. The current sampler is `A Second Reading`.

Future deck direction:

- public-domain literary scenes about mistaken first impressions;
- diary/letter adaptations with careful source metadata;
- original essays about online presentation and memory.

## Acceptance checks

- Does the false tracker read as funny and wrong, not as actual player score?
- Does the honest-zero transition preserve completed work visibly?
- Can the player distinguish chronological posts from recommendations?
- Does the ending make `Why this appeared` a restored control?
- Does the site avoid humiliating Finn or any real social-media user?

## Production state contract

Use the shared rules in
[`../SITE_PRODUCTION_SYSTEM.md`](../SITE_PRODUCTION_SYSTEM.md).

### Visual tokens

| Token | Value |
| --- | --- |
| Paper / card | `#FFFFFF` / `#F3F6FA` |
| Ink / muted | `#17212B` / `#617080` |
| FacePlace cobalt | `#315FA8` |
| Context aqua | `#2C8F91` |
| Nonsense yellow | `#F2C14E` |
| Forced-distribution red | `#B33A32` |
| Verified green | `#2C7A57` |
| Border / focus | `#AAB6C2` / `#075CCB` |

Use the original overlapping profile-frame mark from the shared mark manifest.
Use Arial/system sans for feed UI, 14-16 pixel card copy, and 11-13 pixel
metadata. The layout may evoke a ranked feed but must not reproduce a real
social platform's navigation, `f` mark, exact blue, or card geometry.

### Exact state sequence

| State ID | Trigger | Visible result | Saved unit |
| --- | --- | --- | --- |
| `faceplace_false_tracker_1` | first accepted reading | one duplicate cluster collapses; tracker shows `12%` | `duplicates_collapsed` |
| `faceplace_false_tracker_2` | second accepted reading | author names and timestamps return; tracker shows `114%` | `authorship_time_restored` |
| `faceplace_false_tracker_3` | third accepted reading | recommendation labels and the shell of `Why this appeared` return; tracker shows `AVOCADO%` | `context_controls_restored` |
| `faceplace_honest_zero` | third unit is saved | Amy reveals the counter measured reactions; recovered cards remain | midpoint discovered/acknowledged |
| `faceplace_recovery_1` | next accepted reading | chronological branch restored; honest tracker reaches `34%` | `chronology_verified` |
| `faceplace_recovery_2` | next accepted reading | authorship and recommendation reasons verified; tracker reaches `67%` | `recommendations_explained` |
| `faceplace_recovery_3` | next accepted reading | forced distribution disabled; honest tracker reaches `100%` | `distribution_gate_restored` |
| `faceplace_secured` | recovery 3 saves | evidence receipt and permanent secured treatment | secured |

The first three nonsense values are decorative site satire, not reading score
or learner progress. Do not live-announce the changing joke value. Announce the
real repair consequence instead.

### Midpoint and persistence

`faceplace_honest_zero` starts the new honest tracker at zero while all three
Act I repairs remain visibly checked and stored under `RECOVERED POSTS SAVED`.
The zero is a corrected measurement, never a reset of Finn's work.

Save after every row above. Resume directly at the next unfinished unit. With
reduced motion, collapse/reorder cards instantly and show the completed-unit
status; do not animate feed cards flying across the Reading Companion.

### Final composition

- left: profile identity and chronological filter;
- center: feed cards with explicit `CHRONOLOGICAL` or `RECOMMENDED` labels;
- right: honest tracker plus `Why this appeared` detail;
- lower log: `FORCED DISTRIBUTION: OFF` and the blocked AI write.

The visible feed may scroll, but reading mode freezes its wheel focus unless the
player intentionally enters the site window.
