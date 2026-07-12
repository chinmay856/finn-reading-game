# Internet Recovery 98 runtime UI notes for builders

## Purpose

This is a design-only implementation aid for the builder thread. It converts
the reviewed Internet Recovery 98 art, copy, and campaign docs into concrete
runtime UI notes without assigning engineering ownership or changing source
code.

Use this when implementing the first playable Internet Recovery 98 experience.
Keep reusable reading, speech, scoring, content, and storage logic theme-neutral.
All names, visuals, character reactions, site states, desktop chrome, and story
beats below belong to the Internet Recovery 98 wrapper.

## Current build priority

Build the smallest useful player path first:

1. Recovery Map opens inside the stable Internet Recovery 98 desktop.
2. Finn can launch WikiWhy.
3. WikiWhy displays an inset corrupted/repaired browser page beside a separate
   Reading Companion.
4. Finn reads one real Content Platform passage.
5. The reading result advances the WikiWhy visual repair.
6. Accepted readings can reach Amy's warning, the 80 percent story turn, the
   exact three-pass Shield Protocol, and the secured-site payoff.
7. The hub records WikiWhy as secured and unlocks one evidence entry.

Other sites can appear as design previews until their own content and mechanics
are implemented. Do not fake their reading loops by reusing WikiWhy passage,
score, or progression state.

## Builder input files

Use these as source-of-truth design inputs:

- `docs/gameplay/PROTOTYPE_DESIGN_HANDOFF.md` - core WikiWhy flow and ownership
  boundary.
- `docs/gameplay/WIKIWHY_FIRST_SLICE_BUILD_BRIEF.md` - immediate WikiWhy-only
  scene/state script and acceptance checks.
- `docs/gameplay/TEN_SITE_DESIGN_LIBRARY.md` - ten-site story and progress
  direction.
- `docs/gameplay/RUNTIME_ASSET_USE_BRIEF.md` - canonical art inputs, character
  crop guidance, and preview-vs-playable asset rules.
- `docs/gameplay/CAMPAIGN_SPINE_AND_HUB.md` - global hub and campaign spine.
- `docs/gameplay/CAMPAIGN_HUB_RUNTIME_BRIEF.md` - concrete Recovery Map,
  site-tile, Case File, evidence receipt, and global story beat copy.
- `docs/gameplay/INTERNET_RECOVERY_COPY_DECK.md` - full wrapper copy library.
- `docs/gameplay/SITE_RUNTIME_COPY_PACKS.md` - concrete visible copy for the
  ten corrupted/repaired site pages.
- `docs/gameplay/site-build-briefs/README.md` - per-site runtime design briefs
  for all ten sites.
- `apps/internet-recovery/art/characters/README.md` - production character
  sheet panel IDs.
- `apps/internet-recovery/art/concepts/sites/README.md` - done site-board set
  and superseded-history notes.
- `content/wikiwhy/PASSAGE_DECKS.md` - WikiWhy reading-passage decks.

## Non-negotiable boundaries

- Only the Reading Companion passage is expected speech.
- Decorative site copy is never speech-scored.
- The Reading Engine never knows about WikiWhy, Amy, Chinmay, Techno, site
  stability, evidence files, AI rewrites, or Shield Protocol.
- Comprehension checks refer only to the assigned passage.
- Reading progress never moves backward because of mistakes, recognition
  uncertainty, retries, or comprehension answers.
- Retry is optional. Continue is always available after a completed attempt.
- Internet Recovery 98 is stable during ordinary site missions. Only nested
  corrupted sites are unstable until the final `EVIDENCE_11.LIVE` breach.

## Screen Contract

### 1. First Launch / Boot

Goal: establish that the page is a browser-based remote desktop, not Finn's real
computer.

Required visible elements:

- `INTERNET RECOVERY 98`
- `Browser-based remote recovery system`
- `REMOTE SESSION ESTABLISHED`
- a plain truth line that this runs inside the browser page
- a clear action: `Open recovery desktop`

Use one or two rotating jokes at most. Keep the action button literal.

Suggested stable copy IDs:

| Copy ID | Text |
| --- | --- |
| `boot.title` | `INTERNET RECOVERY 98` |
| `boot.subtitle` | `Browser-based remote recovery system` |
| `boot.status.connecting` | `Connecting to Amy's clean-room network...` |
| `boot.status.established` | `REMOTE SESSION ESTABLISHED` |
| `boot.truth.boundary` | `Internet Recovery 98 runs as a fictional remote desktop inside this browser page.` |
| `boot.action.open` | `Open recovery desktop` |

Optional boot rotations:

- `Loading pre-AI system code...`
- `Confirming none of it has tried to write a screenplay...`
- `Detecting responsible adults... 0 found.`
- `Skipping terms and conditions. Nobody read them last time.`

### 2. Recovery Map

Goal: show ten sites, exactly three incoming cases, and a trustworthy desktop
shell.

Required visible elements:

- ten site tiles from the design roster
- exactly three Incoming Cases
- Case File with ten slots
- Amy Support panel
- taskbar/status chrome
- restrained desktop shortcuts
- clear distinction between playable WikiWhy and view-only previews

Recommended copy:

| Copy ID | Text |
| --- | --- |
| `hub.title` | `Ten sites. One Internet having a difficult day.` |
| `hub.counter.label` | `OF 10 SECURED` |
| `hub.incoming.title` | `Choose what to inspect next` |
| `hub.casefile.title` | `CASE FILE` |
| `hub.casefile.privacy` | `Logs only. No audio or transcripts.` |
| `hub.amy.initial` | `System healthy. WikiWhy is connected. The other site files are arriving, so their windows are view-only for now.` |

Incoming Cases before WikiWhy is secured:

1. WikiWhy
2. ThreadIt
3. MapGuess

Incoming Cases after WikiWhy is secured:

1. ThreadIt
2. MapGuess
3. ViewTube

The next-cases list is a presentation choice. It should not imply that all ten
sites are already implemented.

### 3. Design Preview Sites

Goal: let Finn inspect other site directions without pretending they are
playable.

Required visible labels:

- `DESIGN PREVIEW`
- `VIEW ONLY`
- `MECHANICS NOT CONNECTED`
- `Passage not assigned yet`
- `MIC: OFF`
- `NO READING SCORE`

Recommended copy:

| Copy ID | Text |
| --- | --- |
| `preview.title.suffix` | `DESIGN PREVIEW` |
| `preview.status.viewOnly` | `VIEW ONLY` |
| `preview.footer.designFile` | `DESIGN FILE RECEIVED` |
| `preview.footer.mechanics` | `MECHANICS NOT CONNECTED` |
| `preview.reader.title` | `Passage not assigned yet` |
| `preview.reader.body` | `This site preview does not borrow WikiWhy's passage or scoring. Its own reviewed content and repair rules will connect here later.` |
| `preview.action.return` | `Return to Recovery Map` |

### 4. WikiWhy Setup

Goal: prepare microphone and local model without feeling like a school tool.

Required truth lines:

- voice is processed locally
- no upload
- no audio or transcript retention
- browser will ask for microphone permission

Recommended copy:

| Copy ID | Text |
| --- | --- |
| `mission.preparation.eyebrow` | `RECOVERED FILE READY` |
| `mission.preparation.title` | `Read one recovered file to begin repairs.` |
| `mission.preparation.body` | `Read continuously at a comfortable pace. Pause when you need to. Correct yourself whenever you want. The repair only moves forward.` |
| `privacy.microphone.truth` | `Your voice is processed on this device. The game does not upload or save your audio or transcript.` |
| `mission.action.prepareMic` | `Prepare microphone` |
| `mission.model.readyNext` | `Your browser will ask for microphone permission next.` |

Use passage metadata from the Content Platform record, not hard-coded wrapper
copy.

### 5. Reading Companion

Goal: make teen-level continuous reading comfortable at roughly 250 WPM.

Required layout behavior:

- normal web reading size, not early-reader flashcard size
- several lines/paragraph context visible
- current line or word is clear
- user can manually scroll
- automatic guide pauses while manual scrolling
- visible metrics stay compact
- page repair is noticeable but secondary to reading

Recommended copy:

| Copy ID | Text |
| --- | --- |
| `reading.ready.title` | `READY WHEN YOU ARE, FINN` |
| `reading.ready.body` | `Start with the first highlighted line.` |
| `reading.active` | `Listening - pause whenever you need.` |
| `reading.checking` | `Checking progress locally...` |
| `reading.guide.manualPause` | `Reading guide paused while you scroll.` |
| `reading.finish.action` | `Finish now` |

Metric labels:

- `Confirmed [N]/[total]`
- `Accuracy estimate [N]%`
- `Pace [N] WPM`
- `Self-corrections [N]`
- `Repair [N]%`

Never show:

- `wrong`
- `too slow`
- `try harder`
- `failed`
- `level skipped`
- `poor performance`

### 6. WikiWhy Page Repair

Goal: the website itself is the progress visualization.

Corrupted visible rule:

```text
USERS ARE ALWAYS RIGHT
If someone submitted it, it counts as a fact. Sources are optional. Repeating a
claim makes it more true.
```

Repaired visible principle:

```text
PEOPLE CAN CONTRIBUTE; EVIDENCE EARNS TRUST
People share ideas and information every day, but not everything is accurate.
Strong claims explain their evidence, limits, and uncertainty.
```

Required repair behavior:

- repair wipe or equivalent moves forward only
- each accepted reading creates a visible 10-20 percent Act I advance
- last Act I advance clamps at 80 percent
- show `READINGS SAVED` and `EVIDENCE SAVED` during the 80 percent story turn
- after the turn, switch from `SITE STABILITY` to `SHIELD STABILIZATION`

Vague positive reactions:

- `That held.`
- `The page is clearing faster.`
- `Nice. More of it stayed put.`
- `Signal looks clean. Keep going.`

### 7. Amy Warning

Trigger: near the final Act I stretch, before the 80 percent rewrite.

Recommended copy:

| Copy ID | Text |
| --- | --- |
| `dialog.amy.warning.eyebrow` | `BACKGROUND WRITE DETECTED` |
| `dialog.amy.warning.heading` | `The repair is holding. Something else is still moving.` |
| `dialog.amy.warning.body` | `Hold on. You are fixing it, but something is still rewriting the page behind you. Keep going. I think I can trace the next change.` |
| `dialog.amy.warning.action` | `Keep going` |

Use `amy_evidence` or `amy_supportive`.

### 8. Chinmay / AI Rewrite

Trigger: WikiWhy reaches the 80 percent story boundary.

The visible offender is the AI service, not Chinmay personally.

Recommended copy:

| Copy ID | Text |
| --- | --- |
| `dialog.chinmay.rewrite.eyebrow` | `AUTOMATIC IMPROVEMENT CONTINUES` |
| `dialog.chinmay.rewrite.heading` | `Chinmay: The AI is still running.` |
| `dialog.chinmay.rewrite.body` | `I asked it to clean things up, not rewrite the sources. That command should have ended.` |
| `dialog.chinmay.rewrite.meta` | `Writer: ai_repair_service - Command: ENDED - Write status: ACTIVE` |
| `dialog.chinmay.rewrite.action` | `Compare versions` |

Use `chinmay_fluster_1`. Do not use angry lighting, villain copy, or sabotage
labels such as `CHINMAY WAS HERE`.

### 9. Shield Protocol

Trigger: after the 80 percent rewrite resolves into a new objective.

Amy promise:

```text
Okay. I caught the AI's change. Give me three clean repair passes and I can seal
this site around it. Three. No surprise fourth one.
```

Required sequence:

1. `SHIELD PROTOCOL 1 OF 3` - restore content layer - reaches about 33 percent.
2. `SHIELD PROTOCOL 2 OF 3` - reconnect links/evidence - reaches about 66
   percent.
3. `SHIELD PROTOCOL 3 OF 3` - revoke unauthorized write access - reaches 100
   percent.

Do not extend this with a surprise fourth repair.

Final denial:

```text
ai_repair_service attempted to modify this site.

ACCESS DENIED
Reason: Finn restored the approval check the AI optimized away.
```

### 10. Results / Continue

Goal: show useful metrics, optional retry, and visible consequence.

Recommended copy:

| Copy ID | Text |
| --- | --- |
| `result.complete.eyebrow` | `REPAIR COMPLETE` |
| `result.complete.title` | `The page changed because you read the recovered file.` |
| `result.continue` | `Continue` |
| `result.retry` | `Try this passage again` |
| `result.report` | `Copy timing report` |
| `result.report.truth` | `The report contains timing and scores, never audio or transcript text.` |

If recognition is partial, keep Continue visible:

```text
The local speech tool confirmed part of the passage. You can continue with this
result or retry if you want another measurement.
```

### 11. Optional Comprehension

Goal: evidence check, not school quiz.

Recommended heading rotations:

- `CHECK THE FILE`
- `ONE THING BEFORE YOU CLOSE THIS`
- `WHAT DID THE EVIDENCE SHOW?`
- `QUICK READBACK`

Correct response:

- `That matches the file.`
- `Evidence logged.`
- `That is what the recovered text supports.`

Incorrect response:

```text
That is not what the file supports. Check the relevant section and choose again,
or skip this check.
```

Missed comprehension can lower the optional lift. It must not erase reading
progress or create a forced retry.

### 12. Dial-up Loading

Use only for genuine loading between pages or missions. Never add delay just to
show every joke.

Required truth handling:

- visible loading state
- cancel/retry path when appropriate
- reduced-motion equivalent
- optional/mutable future sound

Short status rotation:

- `Picking up Internet phone...`
- `Dialing a number found on a sticky note...`
- `Screaming at the modem...`
- `Negotiating with 56 kilobits...`
- `Connected! Probably.`

Long-load truth lines:

- `Still connecting. This part is real, unfortunately.`
- `The local speech model is still loading. Your microphone is not recording.`

### 13. Character State Use

Use the production sheet manifest for IDs:
`apps/internet-recovery/art/characters/README.md`.

Amy:

- `amy_neutral` - general support, quiet setup
- `amy_skeptical` - suspicious logs, contradictory claim
- `amy_amused` - dry jokes, non-critical reactions
- `amy_supportive` - setup, shield intro, completion
- `amy_evidence` - timestamps, source checks, warnings
- `amy_tools` - system/tool explanation

Chinmay:

- `chinmay_neutral` - direct technical explanation
- `chinmay_confident` - early "I can fix this faster"
- `chinmay_fluster_1` - first contradiction
- `chinmay_fluster_2` - AI continues despite his command
- `chinmay_fluster_3` - genuine alarm later in campaign
- `chinmay_relieved` - cooperative after Finn restores control

Techno:

- `techno_idle_ball_bounce` - desktop idle
- `techno_alert_ball_pin` - suspicious change
- `techno_suspicious_file` - file/evidence clue
- `techno_bark_ball` - AI interruption
- `techno_ceo_broadcast_nap` - Chinmay monologue
- `techno_usb_delivery` - evidence delivery
- `techno_celebrate_spin` - secured-site payoff
- `techno_clue_point` - optional visual hint

Techno captions should be rare. Accessible labels can be more specific when her
action signals evidence.

### 14. Accessibility and Motion

Required:

- all essential state is text, not color-only
- live states use concise `role="status"` text
- rotating jokes do not spam screen readers
- reduced motion replaces wipes/jitter with stepped swaps
- fake-virus screens retain a persistent `FAKE GAME VIRUS` banner
- no flashing, cursor capture, fake browser close tricks, or real credential
  requests

### 15. Design QA Checklist

Before handing a screen to playtest, verify:

- Reading Companion remains visually separate from the corrupted site.
- Site repair is visible but does not steal focus from the passage.
- Desktop shell remains stable during ordinary missions.
- Continue is available after a completed reading attempt.
- Retry is optional.
- Character art matches the canonical production sheets.
- Chinmay is long-haired and non-villainous.
- Techno's ball appears in most Techno states.
- Copy does not blame Finn for recognition issues.
- No wrapper terms entered Reading Engine, speech adapter, or theme-neutral
  content records.
