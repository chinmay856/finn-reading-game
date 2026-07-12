# WikiWhy first-slice build brief

## Purpose

This is a design-only build brief for the separate builder agent. It narrows the
broader Internet Recovery 98 design library into the next useful WikiWhy
prototype slice.

It does not implement runtime behavior. It does not define the required flow for
all ten sites. WikiWhy is the first playable example because it has the clearest
reading-to-repair mapping.

## Builder target

Build one playable WikiWhy loop inside the Internet Recovery 98 desktop:

1. Finn launches WikiWhy from the Recovery Map.
2. The Recovery Browser shows a corrupted WikiWhy page.
3. The separate Reading Companion shows one real passage.
4. Finn reads the passage aloud.
5. The neutral reading result advances the WikiWhy repair visual.
6. Repeated accepted readings can reach the WikiWhy story turn.
7. Amy reveals exactly three final Shield Protocol repairs.
8. WikiWhy becomes secured and records an evidence file.

Other sites may remain preview-only until their own vertical slices are
implemented, but all ten production designs are complete. Do not make the other
nine sites reuse WikiWhy's passage, percentage model, or Shield Protocol.

## Required inputs

- `docs/gameplay/RUNTIME_UI_NOTES_FOR_BUILDERS.md`
- `docs/gameplay/SITE_RUNTIME_COPY_PACKS.md`
- `docs/gameplay/PROTOTYPE_DESIGN_HANDOFF.md`
- `content/wikiwhy/PASSAGE_DECKS.md`
- `apps/internet-recovery/art/characters/README.md`
- `apps/internet-recovery/art/concepts/wikiwhy-three-act-rogue-ai.png`

## Screen layout contract

The game page contains a fictional remote desktop. The WikiWhy site appears
inside the desktop's Recovery Browser, not as the whole real browser page.

Minimum visible structure:

```text
+---------------- INTERNET RECOVERY 98 DESKTOP ----------------+
| desktop rim: taskbar, safe status, a few old-computer icons   |
| +---------------- RECOVERY BROWSER -------------------------+ |
| | WikiWhy corrupted/repaired page visual                    | |
| | decorative site copy, not read aloud                      | |
| +-----------------------------------------------------------+ |
| +----------- READING COMPANION -----------------------------+ |
| | source, passage, live highlight, mic status, controls     | |
| | this is the only expected speech text                     | |
| +-----------------------------------------------------------+ |
+---------------------------------------------------------------+
```

The layout may be responsive, but preserve these proportions as the default
desktop target:

- desktop rim: enough space to prove this is a remote session, not a full-screen
  website;
- Recovery Browser: the largest visual area;
- Reading Companion: compact but readable, with natural webpage-sized teen text,
  not oversized early-reader text;
- character reactions: small side panels or overlays that never cover the live
  passage, microphone control, or current highlight.

## Ownership boundary

| Element | Owner | Rule |
| --- | --- | --- |
| Passage text | Content Platform | The exact text Finn reads aloud. |
| Speech, alignment, pace, accuracy | Reading Engine | Theme-neutral. No WikiWhy, Amy, Techno, or site state. |
| Completion result | Game Rules | Converts neutral reading outcome into a WikiWhy repair amount. |
| Corrupted/repaired page | Internet Recovery wrapper | Decorative visual consequence. Not speech-scored. |
| Amy, Chinmay, Techno, AI write logs | Internet Recovery wrapper | Story and presentation only. |
| Comprehension check | Content Platform | Ask only about the assigned passage, not decorative site copy. |

Decorative WikiWhy text can teach the site lesson visually, but Finn is not
expected to read it aloud and should not be scored against it.

## State sequence

### 1. Recovery Map launch

Use this state when WikiWhy is available but not secured.

Visible copy:

```text
INCOMING CASE
WikiWhy
Status: CORRUPTED - SOURCES OPTIONAL

Recovered files can rebuild this page.
Only the Reading Companion text is read aloud.
```

Primary action:

```text
Open WikiWhy
```

Amy panel: `amy_tools`

Amy line:

```text
WikiWhy is a good first repair. The page is broken in an obvious way, which is
the only polite thing a broken page has done today.
```

### 2. Mission entry: ordinary damage

Present the failure as ordinary Internet collapse damage. Do not reveal the
rogue AI yet.

Recovery Browser visible state:

```text
WikiWhy
The free encyclopedia written by people, repaired by evidence.

CORRUPTED - SOURCES OPTIONAL

USERS ARE ALWAYS RIGHT

If someone submitted it, it counts as a fact. Sources are optional. Repeating a
claim makes it more true.
```

Add several `XXXX` blocks, broken citation tags, and missing-image boxes. The
page should look clearly wrong, but not so visually busy that it competes with
the reader.

Reading Companion visible state:

```text
READING COMPANION
Passage loaded from recovered file
Mic: waiting
```

Primary action:

```text
Start reading
```

Techno sprite: `techno_idle_ball_bounce`

### 3. Active reading

During reading, the Reading Companion remains stable and legible.

Required behavior:

- keep the current line or sentence visible;
- show literal microphone/listening state;
- let the player stop or finish without a joke blocking the control;
- keep the Recovery Browser repair animation secondary to the passage;
- make progress visible through the page repair, not through loud coaching.

Suggested visible statuses:

```text
Listening locally
No audio saved
Repair signal building
```

Avoid:

- `You missed a word`
- `Poor score`
- `Penalty`
- `Try harder`
- forced retry language
- popups that cover the passage

### 4. Accepted reading result

After an accepted attempt, show metrics plainly and advance the site repair.

Metrics should be visible but not emotionally loaded:

```text
Reading saved
Words matched: [value]
Estimated accuracy: [value]
Pace: [value] WPM
Comprehension: [if available]
```

Recommended reaction rotations:

```text
That held.
The page is clearing faster.
Nice. More of it stayed put.
Signal looks clean. Keep going.
```

Do not show the exact formula. The rough 10-20 percent Act I jump is a WikiWhy
game-rule presentation choice, not Reading Engine behavior.

### 5. Suspicion state

Trigger this when the site has visibly improved enough that a new background
write feels suspicious.

Visual clues:

- repaired citation changes after it was restored;
- a newer timestamp appears behind older page history;
- a background process line blinks;
- Techno notices it before the adults do.

Amy panel: `amy_evidence`

Techno sprite: `techno_alert_ball_pin`

Amy line:

```text
Hold on. You are fixing it, but something is still writing corruption behind
you. Keep going. I think I can trace the next change.
```

This is only suspicion. Do not claim that Chinmay is sabotaging Finn.

### 6. WikiWhy story turn

When WikiWhy reaches its authored story turn, the page does not punish Finn or
erase completed reading. It reveals that a newer automated service is still
writing after the command should have ended.

Required persistence:

```text
READINGS SAVED
EVIDENCE SAVED
```

Failure label:

```text
AUTOMATIC VERIFICATION CONTINUES
Writer: wiki_auto_fix_ai
Command: ended
Write status: active
```

Chinmay panel: `chinmay_fluster_1`

Chinmay line:

```text
Okay, tiny clarification. My AI is not supposed to keep editing after the
command ends, which is why this is technically very educational.
```

Amy panel: `amy_skeptical`

Amy line:

```text
Good news: Finn's work is saved. Bad news: your shortcut is still typing.
```

### 7. Shield Protocol reveal

After Amy catches the background write, reveal the exact remaining finish line.
This is the moment where the game becomes more explicit, because Finn has earned
a clear target.

Amy panel: `amy_tools`

Amy line:

```text
I can hold the write path open for three clean repairs. Do those, and I can seal
WikiWhy so this one stays fixed.
```

Visible checklist:

```text
SHIELD PROTOCOL
[ ] Recover content layer
[ ] Verify citations and history
[ ] Seal edit permissions
```

Rules:

- exactly three final repairs after this reveal;
- no hidden extra repairs for WikiWhy once Amy says three;
- each final accepted reading marks one checkbox;
- reading metrics can still influence flavor and animation strength, but not
  the number of remaining Shield Protocol steps.

### 8. Secured payoff

After the third Shield Protocol repair, the page should feel permanently
changed.

Recovery Browser:

```text
WIKIWHY SECURED

Contributions stay open.
Evidence checks stay required.
ai_repair_service write attempt: ACCESS DENIED.
```

Evidence file:

```text
Evidence file recovered:
AI WRITE ROUTE / 01
WIKIWHY_TRACE_01.LOG
WIKIWHY / ENDED COMMAND, ACTIVE WRITER

What changed:
People can contribute, but evidence earns trust.

AI service behavior:
ai_repair_service kept a publish route active after its command ended.
```

Amy panel: `amy_supportive`

Amy line:

```text
Nice work, Finn. That site is not just cleaner. It has a lock the shortcut
cannot write through.
```

Chinmay panel: `chinmay_fluster_2`

Chinmay line:

```text
I would like the record to show that I am also upset with my AI, although I did
name the deployment "Definitely Fine."
```

Techno sprite: `techno_celebrate_spin`

Accessible Techno label:

```text
Techno spins beside her orange-and-blue ball while the access-denied log stays
on screen.
```

Return action:

```text
Return to Recovery Map
```

## Failure and loading copy

Do not let a real loading delay look like the game is broken.

Loading:

```text
CONNECTING TO THE PART OF THE INTERNET THAT STILL ANSWERS

Loading recovered file...
Preparing local speech model...
No audio is uploaded or saved.
```

Model still loading:

```text
The local speech model is still loading. First load can take a little while.
This is annoying, but private.
```

Microphone denied:

```text
Microphone permission is blocked.

Internet Recovery can show the page, but it cannot listen until the browser
allows microphone access.
```

Transcription uncertain:

```text
The local transcript was uncertain.

Your reading is saved. You can continue, or retry if you want a cleaner repair
signal.
```

Buttons:

```text
Continue
Try again
Open browser microphone settings
Cancel
```

Retry is always optional.

## Visual repair guidance

The first prototype may implement the page repair as a simple mask between a
corrupted and repaired WikiWhy state.

Acceptable prototype approaches:

- layered DOM states with a left-to-right reveal;
- one corrupted image and one repaired image with a mask;
- block-level replacement of visible page regions;
- hybrid image background plus live text overlays.

Design requirements:

- the repair direction is easy to see in peripheral vision;
- the page never flashes so hard that it distracts from reading;
- repaired regions stay repaired during normal Act I progress;
- the story turn shows a new automated write without blaming Finn;
- the secured state clearly blocks later writes.

## Acceptance checklist

The first WikiWhy slice is design-complete when a reviewer can answer yes to all
of these:

- Does the screen clearly look like a remote desktop containing a browser,
  rather than a normal full-screen webpage?
- Is the Reading Companion visibly separate from WikiWhy?
- Is it obvious which text Finn should read aloud?
- Does site copy stay decorative and unscored?
- Does a completed reading cause a visible WikiWhy repair?
- Are metrics factual and low-drama?
- Is retry optional?
- Does the midpoint reveal preserve saved reading/evidence?
- Does Chinmay read as sincere, long-haired, and flustered rather than angry or
  malicious?
- Is the AI service, not Chinmay, the active source of continuing writes?
- Does Amy reveal exactly three final WikiWhy repairs?
- Does the final state show `ACCESS DENIED` and an evidence file?
- Can the builder implement this without putting wrapper story into the Reading
  Engine or Content Platform?
