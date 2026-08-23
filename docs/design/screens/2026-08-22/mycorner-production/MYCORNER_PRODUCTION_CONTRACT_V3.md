# MyCorner production contract v3

Status: first complete production sequence prepared for Chinmay review. It is a
review candidate, not approved merely because it has been generated or
validated.

## Story contract

### Lesson

A polished profile is not proof of who controls it. Pause on urgent requests,
check the account's history, and verify the person through a route already known
to you before responding or sending anything.

### Scenario

A brand-new MyCorner profile copies Amy's face with an obvious cardboard mask.
It claims her phone broke at the airport, asks for $2,000 for a plane ticket
home, and insists on online messages instead of a known contact route. Its
brand-new history, urgent request, one overtly suspicious friend, and known
details do not agree.

The image intentionally shows the mechanism rather than explaining it in a
design-note label: another person's shoulders, arms, and hand remain visible
while they hold Amy's printed face on a stick in front of their own. A taped
paper airport backdrop keeps the deception playful and unmistakable.

### First-run payoff

Four accepted passages:

1. restore Amy's profile song, known contact methods, and Profile Details as one
   clearly outlined group while the copied profile remains;
2. restore Amy's Latest Bulletins and long account history, replacing the
   urgent request directly with a normal bulletin;
3. restore Amy's real Profile Blurbs;
4. restore Amy's known profile, real history, known friends, and family-chat
   route.

The final first-run frame is the clean profile bookend.

### Chinmay shortcut and Auto over-fix

Working dialogue job, not final popup copy:

- Chinmay: `I told Auto to clean up every profile, fill in the missing details,
  and make it obvious who everyone is.`
- Midpoint button: `AUTO: APPLY CHANGES`
- Auto: `PROFILE CLARITY COMPLETE. MISSING DETAILS GENERATED. CONFLICTS
  REMOVED. EVERY PROFILE NOW LOOKS EXACTLY LIKE WHO IT SAYS IT IS.`
- Amy: `Auto made every profile detail agree without checking who controls the
  account.`

Auto is earnest and literal. He replaces the paper backdrop with a glittering
cardboard palace, upgrades the impersonator's clothes, fills Friend Space with
four overly polished social photos of himself at the beach, hiking, at a party,
and visiting a retro computer museum, and adds a small Bluetooth joke. He also
"improves" the airport request into a $20,000 private-jet rescue. The cardboard
edge, stick, holding hand, and impersonator's body remain obvious. The joke is
not that Auto believes a particular airport story; it is that he mistakes a
profile's internal consistency and visual polish for identity verification.

### Lock-in recovery

Four locks, deliberately not a mirror of the four first-run repairs:

1. `CHECK THE PERSON` restores Amy's known portrait, profile song, and Profile
   Details as one identity bundle;
2. `CHECK ACCOUNT HISTORY` restores Amy's Profile Blurbs, Latest Bulletins, and
   known-friends context;
3. `VERIFY ANOTHER WAY` replaces the unsecured online-only route with known
   verified phone and message routes;
4. `PAUSE ON MONEY REQUESTS` removes the urgent demand and returns the clean
   profile.

### Secured payoff

The secured site matches the clean first-run profile. Working Auto receipt:
`LEARNED: A CONSISTENT PROFILE IS NOT PROOF OF WHO CONTROLS IT.` Exact dialogue
and reflection copy remain a later human-review layer.

## State ledger

| # | State ID | Visible delta | Meter |
|---:|---|---|---:|
| 1 | initial | Obvious cardboard Amy mask, brand-new account, $2,000 airport request, contradictory claims, and one suspicious friend | 0% |
| 2 | details-restored | The outlined profile-information group restores the song, known contact methods, and Profile Details while the copied identity remains | 25% |
| 3 | bulletins-restored | Amy's Latest Bulletins and established history replace the contradictory posts and urgent request directly | 50% |
| 4 | blurbs-restored | Amy's real Profile Blurbs replace the copied biography | 75% |
| 5 | known-profile | Amy's real profile, bulletin, history, two known friends, and known contact route return | 100% |
| 6 | auto-overfix | Unobscured profile-consistency takeover, $20,000 private-jet request, and four-scene Auto Friend Space | 0% |
| 7 | lock-open | Compact four-item green repair overlay opens over the same Auto takeover | 0% |
| 8 | person-checked | Amy's known portrait, profile song, and Profile Details replace Auto's polished identity bundle; online-only contact and Auto history remain unresolved | 25% |
| 9 | history-kept | Profile Blurbs, Latest Bulletins, and Known Friends restore the established account history | 50% |
| 10 | known-route | Known phone and online-message verification routes replace the unsecured online-only route | 75% |
| 11 | request-blocked | Final lock removes the urgent money request and returns the clean profile | 100% |
| 12 | secured | Clean repaired bookend without overlay | 100% |

Internal state IDs may describe implementation phases; player-facing screens
must not use `Act`, `Phase`, passage counts, or repair counts.

## Module-purpose ledger

| Module | Purpose | Job |
|---|---|---|
| MyCorner header, slogan, navigation, search | persistent parody cue | Evoke the classic social-profile layout without copying a live product |
| Profile identity and extended-network banner | repair target | Make profile ownership and relationship status visible |
| Profile photo | repair target | Carry the cardboard-mask scam and Auto's polish-without-verification joke |
| Profile song player | repair target inside profile-information group | Add a recognizable period Easter egg and replace the scam anthem while it remains visibly muted |
| Contacting box | repair target inside profile-information group | Replace unsecured online-only contact with known verified routes |
| Profile Details | repair target inside profile-information group | Reveal age, hometown, mood, and login contradictions |
| Lead bulletin | repair target | Carry the urgent advance-fee request without enabling payment |
| Blurbs | repair target | Contrast copied claims with known details |
| Profile history | repair target | Reveal whether the account has a consistent timeline |
| Friend Space / Known Friends / Auto Friend Space | repair target | Use one comically suspicious masked account; replace it with four scene-based Auto social photos during the overfix; return to two larger established connections during the account-history repair |
| Identity Checks meter | persistent progress | Keep site repair separate from Reading Companion progress |
| Lock overlay | repair target | Advance four named locks in a compact panel that leaves the changing site visible |
| Reading Companion and characters | shared reusable layer | Remain reusable; dialogue is not baked into this sequence |

## QA contract

- 12 fixed 1440 x 900 states in the reviewed shared shell.
- Four first-run repairs and four asymmetric lock-in repairs.
- Canonical corruption red `#C5251E` and repair green `#2F8A49`.
- Wrong red copy stays byte-stable until its named repair; resolved modules add
  green or return to neutral with an adjacent green signal.
- The song, contact methods, and Profile Details share an outer red outline in
  the opening frame and turn green together on the first named repair.
- Profile Blurbs retain a red container until their named repair, then retain a
  green container.
- The first Auto frame is unobscured; the overlay begins on the next frame.
- Checklist state and underlying site change in the same frame.
- The cardboard edge, stick, holding hand, shoulders, and fake backdrop remain
  legible in the opening and Auto-enhanced impersonation images.
- Friend Space carries the repetition visually through native profile tiles. It
  must not explain the joke with labels such as `SAME PHOTO FOUR TIMES`.
- Opening Friend Space uses one comically obvious masked scam account named
  `AMY_FRIEND_LEGIT`; Auto Friend Space replaces it with four distinct
  social-profile scenes without explanatory copy.
- Auto's enhanced image preserves the same pose/crop and remains an obvious
  impersonation rather than becoming a plausible portrait.
- `CHECK THE PERSON` switches immediately from the enhanced copy to Amy's neutral
  known portrait and restores the profile song and Profile Details; it never
  falls back to the unpolished scam image or prematurely restores a verified
  contact route.
- `CHECK ACCOUNT HISTORY` restores Profile Blurbs, Latest Bulletins, and Known
  Friends together, using a composed Chinmay portrait rather than a flustered
  dialogue tile.
- The unresolved Contacting panel exposes only one unsecured online-message
  action. Additional actions appear only with known verified routes.
- No player-facing copy names the person playing.
- The secured frame contains no unresolved corruption-red profile content and
  returns to the clean first-run site state.
- No variable text, image, tile, or overlay may escape its declared bounds.
- Site progress and Reading Companion passage progress remain independent.
- Click-through references the exact validated exports with a cache-busted URL.

## Generated image provenance

- `assets/mycorner-impersonation-base-v1.png`: built-in image generation from a
  new-image prompt for the paper-mask impersonation scene.
- `assets/mycorner-impersonation-auto-v1.png`: reference-image edit of that base
  image; geometry and impersonation mechanism were explicitly preserved while
  the backdrop and clothing were theatrically polished.
- `assets/mycorner-suspicious-friend-v1.png`: built-in image generation for the
  deliberately obvious masked scam-account joke in the unresolved Friend Space.
- `assets/amy-known-profile-v1.png`: built-in image generation grounded in Amy's
  complete canonical character boards, using a neutral home-office portrait
  with no gesture in frame.
- `assets/chinmay-known-profile-v1.png`: built-in image generation grounded in
  Chinmay's complete canonical character boards, using his composed look rather
  than a flustered dialogue pose.
- `assets/auto-profile-beach-v1.png`, `assets/auto-profile-hike-v1.png`,
  `assets/auto-profile-birthday-v1.png`, and
  `assets/auto-profile-museum-v1.png`: built-in image generation grounded in the
  approved full Auto expression sheet, preserving his toaster-like silhouette
  and Bluetooth badge across four legible social-profile scenes.
