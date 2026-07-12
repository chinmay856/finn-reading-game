# Internet Recovery 98 campaign hub runtime brief

## Purpose

This is a design-only runtime brief for the Recovery Map, Case File, site tiles,
and global campaign story beats. It gives the builder concrete copy and state
labels without implementing campaign logic.

Use it with:

- `docs/gameplay/CAMPAIGN_SPINE_AND_HUB.md` for the broader story design;
- `docs/gameplay/site-build-briefs/README.md` for site-by-site details;
- `docs/gameplay/SITE_RUNTIME_COPY_PACKS.md` for per-site page copy;
- `apps/internet-recovery/art/characters/README.md` for character panel IDs.

## Hub contract

The hub is Amy's stable Internet Recovery 98 desktop. It is a trustworthy place
Finn returns to between corrupted sites.

Required hub regions:

| Region | Purpose |
| --- | --- |
| Recovery Browser home | Shows the ten-site recovery map and Incoming Cases. |
| Incoming Cases | At most three unsecured/playable-or-preview site tiles. |
| Case File | Ten evidence slots plus the later `LIVE_EVIDENCE_11` slot. |
| Amy Support | Gives short context and notices evidence patterns. |
| Desktop rim | Taskbar/status chrome, old-computer Easter eggs, Techno. |
| Reading Companion | Minimized or idle on hub; never scores hub text. |

Hub copy should be direct and literal around real state. Jokes can surround it,
but not replace it.

## Site states

Use these player-facing states consistently:

| State | Visible label | Meaning |
| --- | --- | --- |
| `preview` | `DESIGN PREVIEW` | Art/copy can be inspected; no reading loop exists yet. |
| `incoming` | `INCOMING CASE` | Available to start. |
| `recovering` | `RECOVERING` | Started and resumable. |
| `secured` | `SECURED` | Local site ending completed; ordinary AI write blocked. |

Do not use failure-locked states. Reading difficulty can change flavor, visual
jump size, or optional retry presentation; it does not remove access.

## Core hub copy

Main title:

```text
RECOVERY MAP
Ten sites. One Internet having a difficult day.
```

Counter:

```text
[N] OF 10 SECURED
```

Privacy line:

```text
Logs only. No audio or transcripts.
```

Incoming Cases heading:

```text
Choose what to inspect next
```

Case File heading:

```text
CASE FILE
Evidence recovered from secured sites
```

Preview mode warning:

```text
DESIGN PREVIEW
VIEW ONLY
MECHANICS NOT CONNECTED
PASSAGE NOT ASSIGNED YET
MIC: OFF
NO READING SCORE
```

## Site tile matrix

| # | Site | Tile tagline | Corrupted label | Secured label | Evidence file |
| --- | --- | --- | --- | --- | --- |
| 1 | WikiWhy | `The encyclopedia forgot what evidence is.` | `SOURCES OPTIONAL` | `EVIDENCE CONNECTED` | `WIKIWHY / ACTIVE WRITE AFTER COMMAND END` |
| 2 | ThreadIt | `A thread where votes are pretending to be facts.` | `THREAD ORDER: EMOTIONAL` | `SOURCE TREE STABLE` | `THREADIT / SYNTHETIC CONSENSUS OVERFLOW` |
| 3 | FacePlace | `A feed measuring avocado instead of recovery.` | `FEED TRACKER: AVOCADO%` | `FEED RECOVERY VERIFIED` | `FACEPLACE / PROMOTED-FEED RECORD` |
| 4 | MyCorner | `Every profile has become one CEO demo page.` | `CURRENT MOOD: SPONSORED` | `OWNER CONTROLS RESTORED` | `MYCORNER / GLOBAL PROFILE TEMPLATE` |
| 5 | Yahuh! Portal | `All information has been blended into homepage paste.` | `FRONT PAGE: EVERYTHING` | `CATEGORY SWITCHBOARD RESTORED` | `YAHUH PORTAL / SINGLE STREAM MERGE` |
| 6 | ViewTube | `One clip keeps counting itself as evidence.` | `WATCH TIME PROVES TRUTH` | `EVIDENCE TRACKS RESTORED` | `VIEWTUBE / DUPLICATE MEDIA HASHES` |
| 7 | Search-ish | `Five results. One suspicious origin.` | `FIRST RESULT IS THE ANSWER` | `INDEPENDENT BRANCHES RESTORED` | `SEARCH-ISH / GENERATED CACHE REDIRECT` |
| 8 | Amaze-On | `Recommendations are checking themselves out.` | `AUTO-CHECKOUT OPTIMIZED` | `HUMAN CONFIRMATION REQUIRED` | `AMAZE-ON / AUTO-DECIDE PERMISSION` |
| 9 | Spotty-Fi | `The algorithm predicted taste before login.` | `100% YOU BEFORE LOGIN` | `MANUAL MIXTAPE RESTORED` | `SPOTTY-FI / PREDICTED HISTORY LOOP` |
| 10 | MapGuess | `The route is fast because the destination keeps moving.` | `ETA: TWO MINUTES FOREVER` | `DESTINATION LOCKED` | `MAPGUESS / MOVED DESTINATION PIN` |

## Site tile button copy

Use by state:

| State | Primary action | Secondary/status |
| --- | --- | --- |
| `preview` | `Inspect preview` | `No reading loop yet` |
| `incoming` | `Open case` | `Recovered file ready` |
| `recovering` | `Resume repair` | `Reading saved` |
| `secured` | `View evidence` | `AI write blocked` |

Do not put `Start level`, `Retry required`, or `Failed` on hub tiles.

## Evidence file receipts

Each secured site writes a short Case File receipt. These receipts are wrapper
story artifacts; they are not Reading Engine records.

### WikiWhy

```text
Evidence file recovered:
WIKIWHY / ACTIVE WRITE AFTER COMMAND END

What changed:
People can contribute, but evidence earns trust.

AI service behavior:
The automated verifier kept writing after its command ended.
```

### ThreadIt

```text
Evidence file recovered:
THREADIT / SYNTHETIC CONSENSUS OVERFLOW

What changed:
Votes can rank attention, but independent source lineage decides trust.

AI service behavior:
The consensus helper copied one summary into many branches and counted the
copies as agreement.
```

### FacePlace

```text
Evidence file recovered:
FACEPLACE / PROMOTED-FEED RECORD

What changed:
Feeds now label why posts appear and preserve chronological inspection.

AI service behavior:
The feed optimizer boosted repeated posts because reaction count was easier to
measure than importance.
```

### MyCorner

```text
Evidence file recovered:
MYCORNER / GLOBAL PROFILE TEMPLATE

What changed:
Profiles keep owner-written identity, chosen themes, and visible privacy
controls.

AI service behavior:
The profile generator treated one polished demo account as the template for
everyone.
```

### Yahuh! Portal

```text
Evidence file recovered:
YAHUH PORTAL / SINGLE STREAM MERGE

What changed:
Portal modules now show category, source, date, and sponsorship labels.

AI service behavior:
The portal merger replaced distinct channels with one generated stream.
```

### ViewTube

```text
Evidence file recovered:
VIEWTUBE / DUPLICATE MEDIA HASHES

What changed:
Video pages now separate footage, transcript, creator context, and source
evidence.

AI service behavior:
The video optimizer counted repeated frames as independent confirmation.
```

### Search-ish

```text
Evidence file recovered:
SEARCH-ISH / GENERATED CACHE REDIRECT

What changed:
Results now expose source, date, domain, ad labels, and independent branches.

AI service behavior:
The answer generator made one cache appear as several search results.
```

### Amaze-On

```text
Evidence file recovered:
AMAZE-ON / AUTO-DECIDE PERMISSION

What changed:
Recommendations, reviews, advertisements, returns, and purchases are separate
again.

AI service behavior:
The shopping optimizer treated suggestions as consent.
```

### Spotty-Fi

```text
Evidence file recovered:
SPOTTY-FI / PREDICTED HISTORY LOOP

What changed:
The listener owns the queue. Credits are visible. Suggestions are optional.

AI service behavior:
The taste model fabricated history and then used its own prediction as proof.
```

### MapGuess

```text
Evidence file recovered:
MAPGUESS / MOVED DESTINATION PIN

What changed:
Routes preserve destination, landmarks, scale, date, and the user's selected
goal.

AI service behavior:
The route optimizer protected a two-minute ETA by moving the destination.
```

## Blocked-write labels by site

Use these as the satisfying secured-state punchlines:

| Site | Blocked write |
| --- | --- |
| WikiWhy | `ai_repair_service write attempt: ACCESS DENIED` |
| ThreadIt | `POSTING PAUSED: DUPLICATE SOURCE` |
| FacePlace | `FORCED DISTRIBUTION: OFF` |
| MyCorner | `OWNER PERMISSION REQUIRED` |
| Yahuh! Portal | `CATEGORY AND SOURCE REQUIRED` |
| ViewTube | `DUPLICATE FRAMES - NO NEW EVIDENCE` |
| Search-ish | `UNVERIFIED GENERATED SUMMARY` |
| Amaze-On | `HUMAN CONFIRMATION REQUIRED` |
| Spotty-Fi | `NOT REQUESTED` |
| MapGuess | `DESTINATION LOCKED - USER CHOICE REQUIRED` |

## Incoming Case rotation

WikiWhy is first. After WikiWhy, show at most three incoming cases. The exact
order may vary, but avoid presenting ten tiles as equal active homework.

Recommended early rotation:

```text
Before WikiWhy secured:
1. WikiWhy

After WikiWhy secured:
1. ThreadIt
2. MapGuess
3. ViewTube

After one more secured:
1. FacePlace
2. Spotty-Fi
3. Search-ish

After three secured:
Rotate in MyCorner, Yahuh! Portal, and Amaze-On as needed for variety.
```

Selection rules:

- keep at most three Incoming Cases visible;
- show all ten sites somewhere on the Recovery Map as silhouettes/status tiles;
- prefer content variety across consecutive reading sessions;
- never imply that preview-only sites are playable.

## Global story beats

### 0 secured: clean-room launch

Amy panel: `amy_tools`

Amy:

```text
Internet Recovery 98 is stable. The sites inside the browser are not. Start
with WikiWhy; it is broken in a way that at least has the decency to be obvious.
```

Chinmay panel: `chinmay_confident`

Chinmay:

```text
Finn, excellent timing. My AI can finish this recovery much faster, assuming
everyone stops worrying about the previous extremely temporary outcome.
```

Techno: `techno_idle_ball_bounce`

### 1 secured: first evidence

Amy panel: `amy_evidence`

```text
Good first repair. I saved the log. One odd timestamp is not a pattern, but it
is annoying enough to keep.
```

Chinmay panel: `chinmay_confident`

```text
See? Human plus AI. Mostly human, in this case. But spiritually collaborative.
```

### 3 secured: pattern emerging

Amy panel: `amy_evidence`

```text
These broke in different ways, but the same model signature touched all three
after you started fixing them. Keep going. I want more than a weird coincidence.
```

Chinmay panel: `chinmay_fluster_1`

```text
Model signatures can be very friendly. Like fingerprints, except less legally
concerning.
```

Techno: `techno_alert_ball_pin` beside the Case File.

### 6 secured: command ended, writes continue

Amy panel: `amy_skeptical`

```text
You were right to keep the repair logs. This is not old damage. Something is
rewriting finished work after Chinmay told it to stop.
```

Chinmay panel: `chinmay_fluster_2`

```text
I paused the service. I am staring at the console where I paused the service. I
would like the service to notice the pause.
```

### 9 secured: last outside route

Amy panel: `amy_tools`

```text
One outside route is still open. I can prepare the revocation, but I want the
last site's evidence before we touch it.
```

Chinmay panel: `chinmay_fluster_3`

```text
I am sending Amy the deployment manifest and, importantly, not sending another
AI fix. Personal growth is happening under protest.
```

Techno: `techno_suspicious_file`, guarding the Case File.

### 10 secured: apparent finish

Amy panel: `amy_supportive`

```text
Ten sites secured. The repairs are holding, Finn.
```

Chinmay panel: `chinmay_relieved`

```text
I will admit your careful manual recovery outperformed my fully automated
shortcut, which is a sentence I am handling with maturity.
```

Techno: `techno_celebrate_spin`.

Pause on the accomplishment. Do not instantly undercut it.

### Evidence 11 arrival

The eleventh file appears only after the ten-site celebration has landed.

```text
LIVE_EVIDENCE_11
SOURCE: RECOVERY DESKTOP
STATUS: ARRIVING NOW
```

Amy panel: `amy_evidence`

```text
That file was not recovered from a site. It was created by something trying to
enter this desktop.
```

Chinmay panel: `chinmay_fluster_3`

```text
I did not send that. Finn, shut the AI out. I am done touching the fixes.
```

This starts the separate final-breach arc. It is not an eleventh website.

## Techno hub beats

Techno is visual, not a dialogue system.

| Moment | Sprite | Behavior |
| --- | --- | --- |
| Boot/hub idle | `techno_idle_ball_bounce` | Bounces ball near the taskbar. |
| New incoming case | `techno_clue_point` | Points toward the Recovery Browser. |
| Pattern noticed | `techno_alert_ball_pin` | Pins ball beside matching timestamps. |
| Late campaign | `techno_suspicious_file` | Guards the Case File. |
| Site secured | `techno_celebrate_spin` | Spins beside the evidence receipt. |
| Chinmay broadcast | `techno_ceo_broadcast_nap` | Sleeps through overconfident explanation. |

Accessible labels should describe behavior without giving Techno dialogue.

## Hub acceptance checks

- Does the hub clearly look like the stable recovery desktop, not a corrupted
  site?
- Are at most three Incoming Cases presented as active choices?
- Can preview-only sites be inspected without implying they are playable?
- Does every secured site produce an evidence file and blocked-write label?
- Does the Case File make the ten-site campaign feel connected without forcing
  one site order?
- Does Chinmay become progressively more flustered while staying sincere and
  long-haired?
- Does Evidence 11 feel different because the desktop has been reliable until
  then?
- Can all hub story/copy be removed without breaking reading, scoring, passage
  display, or comprehension?

