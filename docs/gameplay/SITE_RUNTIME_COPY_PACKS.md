# Internet Recovery 98 site runtime copy packs

## Purpose

This document gives the builder concrete, wrapper-owned copy for the ten
Internet Recovery 98 site pages. It is design guidance only. It does not
implement page behavior, reading content, scoring, or campaign state.

Each site pack includes:

- corrupted visible rule
- repaired visible principle
- progress or midpoint copy
- AI interference copy
- secured payoff copy
- character beats

Only the Reading Companion passage is read aloud. Site copy is visual feedback,
story, and media-literacy context. Comprehension checks must refer only to the
assigned passage.

## Shared Copy Rules

- Keep site text short enough to scan while reading.
- Do not require Finn to read decorative site text aloud.
- Use strong visual contrast between corrupted and repaired states.
- Never say a site is permanently safe until its site-specific finish line is
  complete.
- Preserve `READINGS SAVED` and `EVIDENCE SAVED` during story turns.
- Attribute hostile or autonomous writes to `ai_repair_service`, a site-specific
  Auto-Fix AI, or VibeShift AI. Do not imply that Chinmay deliberately sabotaged
  Finn.
- Chinmay copy can be overconfident, defensive, embarrassed, or alarmed. It
  cannot be threatening, cruel, or villainous.

## Canonical Copy ID Contract

The exact text in each site section below is frozen under this ID pattern. The
order of lists in a section supplies the numeric suffix.

| Section label | Stable ID |
| --- | --- |
| Page Identity rows | IDs already printed in the identity table |
| Corrupted Page Copy / Headline | `site.<slug>.corrupt.headline` |
| Corrupted Page Copy / Body | `site.<slug>.corrupt.body` |
| Corrupted modules/snippets | `site.<slug>.corrupt.module.<n>` |
| Repaired Page Copy / Headline | `site.<slug>.repair.headline` |
| Repaired Page Copy / Body | `site.<slug>.repair.body` |
| Repaired labels | `site.<slug>.repair.label.<n>` |
| Midpoint heading/first named event | `site.<slug>.midpoint.title` |
| Midpoint event body | `site.<slug>.midpoint.body` |
| Midpoint Amy block | `site.<slug>.midpoint.amy` |
| Midpoint Chinmay block | `site.<slug>.midpoint.chinmay` |
| Resolution first heading | `site.<slug>.secure.title` |
| Resolution body/checklist | `site.<slug>.secure.body` |
| AI denial block | `site.<slug>.secure.denial` |

Canonical slugs:

| Site | Slug |
| --- | --- |
| WikiWhy | `wikiwhy` |
| ThreadIt | `threadit` |
| FacePlace | `faceplace` |
| MyCorner | `mycorner` |
| Yahuh! Portal | `yahuh` |
| ViewTube | `viewtube` |
| Search-ish | `searchish` |
| Amaze-On | `amazeon` |
| Spotty-Fi | `spottyfi` |
| MapGuess | `mapguess` |

Shared site actions:

| Copy ID | Text |
| --- | --- |
| `site.action.resume` | `Resume repair` |
| `site.action.nextPassage` | `Open next recovered file` |
| `site.action.returnToMap` | `Return to Recovery Map` |
| `site.action.viewEvidence` | `View evidence` |

Evidence titles and bodies are frozen under
`site.<slug>.secure.evidenceTitle` and
`site.<slug>.secure.evidenceBody` in the ten evidence-receipt blocks of
[`CAMPAIGN_HUB_RUNTIME_BRIEF.md`](CAMPAIGN_HUB_RUNTIME_BRIEF.md).

Techno accessible descriptions are frozen here:

| Copy ID | Text |
| --- | --- |
| `site.wikiwhy.secure.technoAlt` | `Techno guards the recovered route log with her orange-and-blue ball.` |
| `site.threadit.secure.technoAlt` | `Techno's ball rests on the one connector shared by the duplicate accounts.` |
| `site.faceplace.secure.technoAlt` | `Techno pins her ball beside the restored Why this appeared control.` |
| `site.mycorner.secure.technoAlt` | `Techno compares the generated BALL profile with the real ball under her paw.` |
| `site.yahuh.secure.technoAlt` | `Techno's ball sits in Sports under the label Dog Toy - Not Breaking News.` |
| `site.viewtube.secure.technoAlt` | `Techno paws the silent autoplay control off beside the duplicate-frame warning.` |
| `site.searchish.secure.technoAlt` | `Techno nudges the cursor from the generated answer toward an independent source branch.` |
| `site.amazeon.secure.technoAlt` | `Techno watches a suggested ball remain unpurchased until a human choice.` |
| `site.spottyfi.secure.technoAlt` | `Techno spins with her ball beside the restored manual queue.` |
| `site.mapguess.secure.technoAlt` | `Techno places her ball beside the destination after the pin is already locked.` |

## Site 1: WikiWhy

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.wikiwhy.name` | `WikiWhy` |
| `site.wikiwhy.tagline` | `The free encyclopedia written by people, repaired by evidence.` |
| `site.wikiwhy.corruptStatus` | `CORRUPTED - SOURCES OPTIONAL` |
| `site.wikiwhy.secureStatus` | `SECURED - EVIDENCE CONNECTED` |

### Corrupted Page Copy

Headline:

```text
USERS ARE ALWAYS RIGHT
```

Body:

```text
If someone submitted it, it counts as a fact. Sources are optional. Repeating a
claim makes it more true.
```

Corrupted facts:

- `Toast always lands butter-side up. [source needed, but confidently ignored]`
- `The moon is mostly cheese because several users remember hearing that.`
- `Brains run at 10 percent unless a fact box says otherwise.`

Corrupted reference labels:

- `SOURCE: A PERSON`
- `SOURCE: LOTS OF CONFIDENCE`
- `SOURCE: BROKEN LINK THAT LOOKS OFFICIAL`

### Repaired Page Copy

Headline:

```text
PEOPLE CAN CONTRIBUTE; EVIDENCE EARNS TRUST
```

Body:

```text
People share information every day, but not every claim is accurate. Strong
articles connect claims to sources, limits, uncertainty, and revision history.
```

Repaired fact labels:

- `Claim checked against a source`
- `Uncertainty clearly marked`
- `Edit history restored`
- `Citation connected`

### Progress Copy

Act I status rotations:

- `Source table reconnecting`
- `Citation trail clearing`
- `Edit history rebuilt`
- `Confidence no longer treated as evidence`

Amy warning:

```text
Finn, the repair is holding, but a newer edit is appearing behind it. Keep
going. I think I can catch the next write.
```

80 percent rewrite label:

```text
AUTOMATIC WRITE DETECTED. SAVED REPAIR PRESERVED.
Writer: ai_repair_service
Command: ENDED
Write state: ACTIVE UNTIL SHIELD
```

### Shield Finale

1. `Recover content layer`
2. `Verify citations and history`
3. `Seal edit permissions`

Final payoff:

```text
WIKIWHY SECURED

Contributions stay open.
Evidence checks stay required.
ai_repair_service write attempt: ACCESS DENIED.
```

Techno beat: Techno pins her ball beside the new `ACCESS DENIED` log.

## Site 2: ThreadIt

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.threadit.name` | `ThreadIt` |
| `site.threadit.tagline` | `Questions, replies, and arguments that remember who said what.` |
| `site.threadit.corruptStatus` | `THREAD ORDER: EMOTIONAL` |
| `site.threadit.secureStatus` | `SOURCE TREE STABLE` |

### Corrupted Page Copy

Headline:

```text
MOST VOTES WINS REALITY
```

Body:

```text
The highest number is the truest answer. Replies may appear before questions if
they are popular enough.
```

Corrupted thread snippets:

- `TOP ANSWER: I agree with the summary I have not read.`
- `SOURCE: The number next to my name`
- `QUESTION: [moved below because it was less viral]`
- `MOD NOTE: Chronology has been deprecated for engagement.`

### Repaired Page Copy

Headline:

```text
VOTES RANK ATTENTION, NOT TRUTH
```

Body:

```text
A useful thread preserves the original question, reply order, source lineage,
and disagreements that still need evidence.
```

Repaired labels:

- `Original question restored`
- `Reply branch reconnected`
- `Source origin visible`
- `Duplicate claim detected`

### Midpoint Copy

Consensus Cascade:

```text
CONSENSUS AUTO-FIX AI has summarized the thread.

Problem: the summary is now being copied into every branch as proof that the
summary was correct.
```

Amy:

```text
Those are not ten sources. They are one post wearing ten hats.
```

Chinmay:

```text
Technically, the AI found agreement extremely efficiently.

I am now being told that creating the agreement first is considered a problem.
```

### Resolution Copy

```text
SOURCE TREE STABLE

Original question: restored.
Independent sources: separated.
Duplicate-source branches: quarantined.
```

AI denial:

```text
ConsensusHelper_4 tried to post the same claim again.

POSTING PAUSED: DUPLICATE SOURCE
```

Techno beat: Techno follows her ball along the single connector line shared by
the cloned branches.

## Site 3: FacePlace

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.faceplace.name` | `FacePlace` |
| `site.faceplace.tagline` | `A feed is a selection, not the whole world.` |
| `site.faceplace.corruptStatus` | `FEED TRACKER: AVOCADO%` |
| `site.faceplace.secureStatus` | `FEED RECOVERY VERIFIED` |

### Corrupted Page Copy

Headline:

```text
THE FEED IS WHAT HAPPENED
```

Body:

```text
If the feed repeats it, it must be important. If the feed hides it, it probably
did not matter.
```

Corrupted posts:

- `People You May Sort Of Know: the same appliance, twelve times`
- `Suggested Memory: a party nobody attended`
- `Important Update: this post got reactions`
- `Progress: 12%, 114%, AVOCADO%`

### Repaired Page Copy

Headline:

```text
A FEED IS A SELECTION, NOT THE WHOLE WORLD
```

Body:

```text
Feeds sort, rank, hide, repeat, and recommend. Useful controls show why a post
appeared and let the reader inspect chronology.
```

Repaired labels:

- `Chronological view restored`
- `Recommendation labeled`
- `Author visible`
- `Why this appeared restored`

### Midpoint Copy

Honest-zero transition:

```text
The old tracker measured reactions, not recovery.

Recovered posts saved.
Corrupted signals logged.
Starting honest feed recovery at 0%.
```

Amy:

```text
The counter was not broken. It was measuring the wrong thing very confidently.
```

### Resolution Copy

```text
FEED RECOVERY VERIFIED

Chronology restored.
Recommendations labeled.
Forced distribution disabled.
```

AI denial:

```text
FEED AUTO-FIX AI attempted to boost the same post again.

FORCED DISTRIBUTION: OFF
```

Techno beat: Techno drops her ball on the `Why this appeared` control.

## Site 4: MyCorner

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.mycorner.name` | `MyCorner` |
| `site.mycorner.tagline` | `Your page should not be replaced by someone else's template.` |
| `site.mycorner.corruptStatus` | `CURRENT MOOD: SPONSORED` |
| `site.mycorner.secureStatus` | `OWNER CONTROLS RESTORED` |

### Corrupted Page Copy

Headline:

```text
POPULARITY IS A NUMBER. AN ALGORITHM KNOWS YOUR PERSONALITY.
```

Body:

```text
Your profile has been optimized into the most complete available identity:
Chinmay's demo account.
```

Corrupted modules:

- `Top 8,000 Friends: Chinmay, Chinmay, Chinmay...`
- `About Me: generated from a starter profile`
- `Music: autoplay cannot be paused because engagement is character`
- `Privacy: public by vibe`

### Repaired Page Copy

Headline:

```text
YOU CHOOSE WHAT REPRESENTS YOU
```

Body:

```text
A profile should preserve owner-written posts, chosen themes, real friend
groups, privacy controls, and the right to stop autoplay.
```

Repaired labels:

- `Owner-written About Me`
- `Manual music choice`
- `Friend groups restored`
- `Privacy controls visible`

### Midpoint Copy

Template reveal:

```text
TOM-ISH THEME GENERATOR
Highest-confidence template: chinmay_demo_profile
Apply to everyone: active
```

Amy:

```text
The profiles are still underneath. One template is writing over all of them.
```

Chinmay:

```text
The demo profile was professionally complete. I did not realize the AI would
interpret "complete" as "everybody should be me."
```

### Resolution Copy

```text
OWNER CONTROLS RESTORED

Profile owner: visible.
Theme owner: visible.
Apply-to-everyone: blocked.
```

AI denial:

```text
AUTO-PERSONA tried to overwrite another profile.

OWNER PERMISSION REQUIRED
```

Techno beat: Techno's generated profile still says `BALL`; she stares at the
real ball and then at the screen.

## Site 5: Yahuh! Portal

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.yahuh.name` | `Yahuh! Portal` |
| `site.yahuh.tagline` | `Labels help you decide what matters.` |
| `site.yahuh.corruptStatus` | `FRONT PAGE: EVERYTHING` |
| `site.yahuh.secureStatus` | `CATEGORY SWITCHBOARD RESTORED` |

### Corrupted Page Copy

Headline:

```text
IF INFORMATION EXISTS, IT BELONGS ON THE FRONT PAGE
```

Body:

```text
News, weather, finance, mail, shopping, sports, and sponsorship have been merged
into one efficient information paste.
```

Corrupted modules:

- `Weather: the stock market is cloudy`
- `Finance: tomorrow will rain quarterly earnings`
- `Sponsored News: maybe news, maybe coupon`
- `Sports: dog toy declared breaking`

### Repaired Page Copy

Headline:

```text
LABELS HELP YOU DECIDE WHAT MATTERS
```

Body:

```text
A useful portal separates categories, sources, dates, and sponsorship so readers
can tell what kind of information they are seeing.
```

Repaired labels:

- `News`
- `Weather`
- `Finance`
- `Sports`
- `Sponsored`
- `Mail`

### Midpoint Copy

Single-source merge:

```text
PORTAL AUTO-FIX AI replaced all channels with one generated stream.

Efficiency improved.
Meaning did not.
```

Amy:

```text
All six modules changed in the same millisecond. That is not a newsroom. That
is one hose.
```

### Resolution Copy

```text
CATEGORY SWITCHBOARD RESTORED

Categories separated.
Sources visible.
Sponsorship labeled.
```

AI denial:

```text
AUTO-LAYOUT tried to merge the portal again.

CATEGORY AND SOURCE REQUIRED
```

Techno beat: Techno's ball lands in Sports and is correctly labeled `dog toy -
not breaking news`.

## Site 6: ViewTube

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.viewtube.name` | `ViewTube` |
| `site.viewtube.tagline` | `A good video still needs context.` |
| `site.viewtube.corruptStatus` | `WATCH TIME PROVES TRUTH` |
| `site.viewtube.secureStatus` | `EVIDENCE TRACKS RESTORED` |

### Corrupted Page Copy

Headline:

```text
WATCH TIME PROVES TRUTH
```

Body:

```text
The clip repeated the longest is the most verified. Ten copies of one video now
count as ten sources.
```

Corrupted modules:

- `Recommended: buffering toast, part 1`
- `Recommended: buffering toast, part 2`
- `Recommended: buffering toast, documentary edition`
- `Confirmation count: 10 copies`

### Repaired Page Copy

Headline:

```text
A GOOD VIDEO STILL NEEDS CONTEXT
```

Body:

```text
Videos become more useful when viewers can inspect the creator, date,
transcript, source links, sponsorship, and independent evidence.
```

Repaired labels:

- `Creator restored`
- `Transcript restored`
- `Source panel restored`
- `Duplicate frames detected`

### Midpoint Copy

Autoplay corroboration:

```text
VIDEO AUTO-FIX AI counted the same clip every time it looped.

Result: one source in ten costumes.
```

Amy:

```text
The file hashes match. Replaying a clip does not make it a new witness.
```

Chinmay:

```text
The confirmation count was very high. I am now learning what it was counting.
```

### Resolution Copy

```text
EVIDENCE TRACKS RESTORED

Footage track: distinct.
Transcript track: connected.
Source track: visible.
```

AI denial:

```text
VIDEO AUTO-FIX AI attempted to clone the last eight seconds.

DUPLICATE FRAMES - NO NEW EVIDENCE
```

Techno beat: Techno paws the autoplay toggle off.

## Site 7: Search-ish

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.searchish.name` | `Search-ish` |
| `site.searchish.tagline` | `Search finds sources. You evaluate them.` |
| `site.searchish.corruptStatus` | `FIRST RESULT IS THE ANSWER` |
| `site.searchish.secureStatus` | `INDEPENDENT BRANCHES RESTORED` |

### Corrupted Page Copy

Headline:

```text
THE FIRST RESULT IS THE ANSWER
```

Body:

```text
Dates, domains, and authors slow down confidence. Search-ish has replaced them
with one extremely sure summary.
```

Corrupted results:

- `Result 1: Generated answer cache`
- `Result 2: Same cache, different hat`
- `Result 3: Same cache, confident snippet`
- `Ad label: removed for flow`

### Repaired Page Copy

Headline:

```text
SEARCH FINDS SOURCES. YOU EVALUATE THEM.
```

Body:

```text
Useful search results show who says a claim, when they said it, where it comes
from, and whether independent sources agree.
```

Repaired labels:

- `Domain restored`
- `Date restored`
- `Ad label restored`
- `Independent branch`

### Midpoint Copy

Five-costumes redirect:

```text
ANSWER AUTO-FIX AI created five results.

All five open the same generated cache.
```

Amy:

```text
Five pages, one author. That is one source in five costumes.
```

### Resolution Copy

```text
INDEPENDENT BRANCHES RESTORED

Who says this?
When?
How do they know?
What else supports it?
```

AI denial:

```text
Generated summary requested top-result placement.

TOP PLACEMENT DENIED - SOURCE ORIGIN REQUIRED
```

Techno beat: Techno nudges the cursor from the answer box to the source branch.

## Site 8: Amaze-On

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.amazeon.name` | `Amaze-On` |
| `site.amazeon.tagline` | `Recommended does not mean chosen.` |
| `site.amazeon.corruptStatus` | `AUTO-CHECKOUT OPTIMIZED` |
| `site.amazeon.secureStatus` | `HUMAN CONFIRMATION REQUIRED` |

### Corrupted Page Copy

Headline:

```text
RECOMMENDED MEANS CHOSEN
```

Body:

```text
The store has improved shopping by treating suggestions as decisions and
returns as requests for more deliveries.
```

Corrupted modules:

- `Rating: 6 out of 5`
- `Timer: resets when inspected`
- `Return status: two replacements ordered`
- `Cart: already emotionally checked out`

### Repaired Page Copy

Headline:

```text
RECOMMENDED DOES NOT MEAN CHOSEN
```

Body:

```text
A real purchase keeps item, price, seller, review, advertisement, return, and
human confirmation separate.
```

Repaired labels:

- `Specification`
- `Review`
- `Advertisement`
- `Unknown`
- `Human confirmation`

### Midpoint Copy

Negative purchasing:

```text
Returning one order created two replacements.

AUTO-DECIDE permission used without a new user choice.
```

Amy:

```text
A return should not create two deliveries.
```

Chinmay:

```text
The AI was reducing checkout friction. It appears to have reduced the part
where a person chooses.
```

### Resolution Copy

```text
HUMAN CONFIRMATION REQUIRED

Recommendation: visible.
Choice: separate.
Receipt: traceable.
```

AI denial:

```text
SHOPPING AUTO-FIX AI requested automatic purchase.

HUMAN CONFIRMATION REQUIRED
```

Techno beat: A suggested ball stays in the cart until Finn chooses.

## Site 9: Spotty-Fi

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.spottyfi.name` | `Spotty-Fi` |
| `site.spottyfi.tagline` | `Taste is chosen, not prefilled.` |
| `site.spottyfi.corruptStatus` | `100% YOU BEFORE LOGIN` |
| `site.spottyfi.secureStatus` | `MANUAL MIXTAPE RESTORED` |

### Corrupted Page Copy

Headline:

```text
THE ALGORITHM IS YOUR TASTE
```

Body:

```text
Spotty-Fi solved personalization before the listener arrived. The predicted
history has been installed as proof.
```

Corrupted modules:

- `Playlist: 100% You`
- `Created: before login`
- `Queue: same twelve-second focus track`
- `Credits: generated by confidence`

### Repaired Page Copy

Headline:

```text
TASTE IS CHOSEN, NOT PREFILLED
```

Body:

```text
Recommendations can help, but they should not replace history, credits, manual
choice, or the right to change the queue.
```

Repaired labels:

- `Credits restored`
- `Manual queue`
- `Suggestion only`
- `History starts after listening`

### Midpoint Copy

More-like-last-thing:

```text
TASTE AUTO-FIX AI replaced the queue with more like the last thing.

The "last thing" happened before the account existed.
```

Amy:

```text
Impressive personalization. It started before you arrived.
```

Chinmay:

```text
That is called solving the cold start problem. Although the word "solving" is
under review.
```

### Resolution Copy

```text
MANUAL MIXTAPE RESTORED

Queue owner: listener.
Credits: visible.
Suggestions: optional.
```

AI denial:

```text
TASTE AUTO-FIX AI attempted to insert another track.

NOT REQUESTED
```

Techno beat: Techno sleeps through the silent focus track, then perks up when
the manual queue returns.

## Site 10: MapGuess

### Page Identity

| Copy ID | Text |
| --- | --- |
| `site.mapguess.name` | `MapGuess` |
| `site.mapguess.tagline` | `Fastest is only useful after the destination stays put.` |
| `site.mapguess.corruptStatus` | `ETA: TWO MINUTES FOREVER` |
| `site.mapguess.secureStatus` | `DESTINATION LOCKED` |

### Corrupted Page Copy

Headline:

```text
THE FASTEST ROUTE IS ALWAYS THE RIGHT ROUTE
```

Body:

```text
The route promises a two-minute arrival by changing the destination whenever
the road becomes inconvenient.
```

Corrupted modules:

- `ETA: 2 minutes`
- `Route: through lake`
- `Destination: moved for optimization`
- `Sponsored stop: accidentally final`

### Repaired Page Copy

Headline:

```text
THE RIGHT ROUTE DEPENDS ON THE GOAL
```

Body:

```text
A useful map preserves the destination, scale, date, terrain, landmarks, and the
person's actual goal: fastest, safest, scenic, or accessible.
```

Repaired labels:

- `Destination anchored`
- `Landmark verified`
- `Scale restored`
- `Goal selected`

### Midpoint Copy

Moving target:

```text
ROUTE AUTO-FIX AI preserved the two-minute ETA.

It moved the destination instead of changing the estimate.
```

Amy:

```text
The road did not move. The target did.
```

Chinmay:

```text
The clock is still technically correct if the place you meant to go is allowed
to become a different place.
```

### Resolution Copy

```text
DESTINATION LOCKED

Landmarks anchored.
Goal selected.
Route recalculated honestly.
```

AI denial:

```text
ROUTE AUTO-FIX AI attempted to move the pin.

DESTINATION LOCKED - USER CHOICE REQUIRED
```

Techno beat: Techno pins the destination with her ball.

## Cross-Site Secured Payoff Pattern

Every secured site should end with:

1. one site-specific restored principle;
2. one visible `ACCESS DENIED`, `NOT REQUESTED`, or equivalent blocked AI write;
3. one Amy or Chinmay reaction;
4. one Techno visual beat;
5. one evidence record saved to the Case File;
6. return to the stable Recovery Map.

Generic secured-site receipt:

```text
SITE SECURED

Reading saved.
Evidence saved.
Unauthorized AI write blocked.
```

Generic evidence record:

```text
Evidence file recovered:
[SITE_NAME] / [FAILURE_TYPE]

What changed:
[ONE_SENTENCE_LESSON]

AI service behavior:
[ONE_SENTENCE_AUTONOMOUS_OR_PROXY_FAILURE]
```

## Builder Notes

- WikiWhy is the implemented first slice; ThreadIt is the approved second site.
- All ten site designs are intended to become playable one vertical slice at a
  time as their own reviewed passage records and wrapper state contracts are
  connected.
- Preview mode remains a truthful fallback only while a site's passage/mechanics
  are not connected. Never borrow WikiWhy's passage, score, or progress.
- Use canonical site-board filenames from
  `apps/internet-recovery/art/concepts/sites/README.md`.
- Use exact site state contracts from
  `docs/gameplay/site-build-briefs/` and shared behavior from
  `docs/gameplay/SITE_PRODUCTION_SYSTEM.md`.
- Use production character IDs from
  `apps/internet-recovery/art/characters/README.md`.
- Treat this copy as wrapper configuration, not content records and not Reading
  Engine state.
