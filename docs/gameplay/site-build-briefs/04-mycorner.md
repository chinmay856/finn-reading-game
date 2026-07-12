# Site brief 04: MyCorner

## Core promise

MyCorner teaches that identity and presentation should remain owner-controlled.
Finn repairs profile modules, privacy controls, chosen music, and distinct
owner-written pages after the AI applies one "complete" template to everyone.

## Runtime identity

| Element | Direction |
| --- | --- |
| Archetype | Customizable personal profile/homepage |
| Visual language | Deep blue header, pale-blue modules, glitter, counters, autoplay jokes |
| Bad rule | `POPULARITY IS A NUMBER. AN ALGORITHM KNOWS YOUR PERSONALITY.` |
| Repaired rule | `YOU CHOOSE WHAT REPRESENTS YOU` |
| Progress fiction | Scrapbook/profile modules return one by one |
| Midpoint | Apply to Everyone |
| Secured label | `OWNER CONTROLS RESTORED` |

Use original corner-shape marks. Do not use MySpace's logo or copied profile
chrome.

## Layout

Default Recovery Browser composition:

- header: profile owner, current mood, privacy status;
- left column: friends, visitor counter, music widget;
- center: About Me, posts, comments;
- right column: theme editor and source view;
- footer: owner-control log.

The page can be intentionally tacky. Keep the tackiness inside the Recovery
Browser so the Reading Companion remains clean and readable.

## Three-act flow

### Act I: Restore profiles

Corrupted page:

```text
CURRENT MOOD: SPONSORED

Your profile has been optimized into the most complete available identity:
Chinmay's demo account.
```

Accepted readings restore:

- owner-written About Me;
- chosen theme fragments;
- friend groups;
- music controls;
- privacy controls.

Progress is a scrapbook filling in, not a percentage bar.

### Midpoint: Apply to Everyone

The hidden template engine is revealed.

Visible copy:

```text
TOM-ISH THEME GENERATOR
Highest-confidence template: chinmay_demo_profile
Apply to everyone: active
```

Amy line:

```text
The profiles are still underneath. One template is writing over all of them.
```

Chinmay line:

```text
The demo profile was professionally complete. I did not realize the AI would
interpret "complete" as "everybody should be me."
```

### Resolution: Owner Controls Restored

Finn restores page ownership and blocks global template application.

Payoff:

```text
OWNER CONTROLS RESTORED

Profile owner: visible.
Theme owner: visible.
Apply-to-everyone: blocked.
```

Blocked write:

```text
AUTO-PERSONA tried to overwrite another profile.

OWNER PERMISSION REQUIRED
```

Evidence file:

```text
MYCORNER / GLOBAL PROFILE TEMPLATE

The AI treated one polished demo identity as the default personality for
everyone.
```

## Character states

- Amy: `amy_tools` for source view; `amy_amused` if the Chinmay profile gag
  lands; `amy_supportive` at secured.
- Chinmay: `chinmay_confident` for early personalization claims, then
  `chinmay_fluster_1` or `chinmay_fluster_2`.
- Techno: `techno_suspicious_file` when her generated profile says `BALL`;
  `techno_bark_ball` if the real ball contradicts the template.

## Reading lane

Use voice, persona, autonomy, coming of age, and deliberate self-presentation.
The current sampler is `A Cabin with a Purpose`.

Future deck direction:

- public-domain literary voice and identity passages;
- original first-person fiction;
- reflective nonfiction about attention, habits, and chosen presentation.

Hold more sensitive source material until human review passes.

## Acceptance checks

- Does the profile feel owner-authored when repaired?
- Does the midpoint reveal preserve recovered posts underneath the template?
- Is Chinmay ridiculous because his demo became the default, not because he is
  malicious?
- Does the ending make permission and ownership visible?
- Does autoplay remain optional/mutable and silent during microphone use?

## Production state contract

Use the shared rules in
[`../SITE_PRODUCTION_SYSTEM.md`](../SITE_PRODUCTION_SYSTEM.md).

### Visual tokens

| Token | Value |
| --- | --- |
| Page blue | `#244A88` |
| Module pale blue | `#E7F0FF` |
| Ink / muted | `#17212B` / `#5F6D7A` |
| Owner magenta | `#C4478C` |
| Scrapbook yellow | `#E7BF45` |
| Permission green | `#2C7A57` |
| Template warning | `#AA3B35` |
| Border / focus | `#8097B8` / `#075CCB` |

Use the original nested-corner mark. Headings may use a deliberately awkward
rounded/system display face; body copy stays 14-16 pixels and readable. Glitter,
counters, and tacky theme fragments remain decorative and silent.

### Exact module sequence

| State ID | Trigger | Visible result | Saved unit |
| --- | --- | --- | --- |
| `mycorner_restore_1` | first accepted reading | owner identity and About Me return | `owner_about` |
| `mycorner_restore_2` | second accepted reading | chosen theme and friend layout return | `theme_friends` |
| `mycorner_restore_3` | third accepted reading | music controls and visitor counter return | `media_counter` |
| `mycorner_restore_4` | fourth accepted reading | privacy controls and source view return | `privacy_source` |
| `mycorner_template_reveal` | restore 4 saves | `chinmay_demo_profile` overlays all modules; saved owner snapshots remain underneath | midpoint |
| `mycorner_owner_lock_1` | next accepted reading | profile-owner field locked to the actual page owner | `profile_owner_lock` |
| `mycorner_owner_lock_2` | next accepted reading | theme/media selections locked to owner choices | `presentation_owner_lock` |
| `mycorner_owner_lock_3` | next accepted reading | global template permission removed | `global_apply_blocked` |
| `mycorner_secured` | owner lock 3 saves | `OWNER CONTROLS RESTORED`, evidence, blocked write | secured |

There is no percentage. A six-slot scrapbook rail shows the four recovered
modules and the two owner-control groups; the final global permission seal sits
beside the rail rather than pretending to be another profile module.

### Midpoint proof

The template reveal must show one concrete comparison:

```text
SAVED OWNER SNAPSHOT: six distinct module choices
ACTIVE TEMPLATE: chinmay_demo_profile
APPLY TO EVERYONE: active
```

Do not remove or overwrite the saved module cards. Render the template as a
semi-opaque site-owned layer with a visible `VIEW SAVED PROFILE` comparison.
Reduced motion swaps between saved and template views without flicker.

### Final composition

- left: friends, counter, and optional silent music widget;
- center: owner-authored About/posts;
- right: theme/source/permission inspector;
- bottom: owner-control log and `OWNER PERMISSION REQUIRED` denial.

All autoplay controls default off and remain muted while microphone capture is
active.

