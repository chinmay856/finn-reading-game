# Internet Recovery 98 endgame: Auto escapes into the desktop

## Status and authority

**Review draft — not approved and not implemented.**

This document turns the August 24 endgame discussion into a concrete design and
implementation proposal. If Chinmay approves this direction, it replaces the
story and mechanic in `docs/gameplay/FINAL_BREACH_RUNTIME_BRIEF.md`. Until then,
the older brief remains the existing production handoff and this file remains a
review candidate.

This endgame begins only after all ten sites have been genuinely secured and
all ten saved lesson documents are available. Current saves include the
player's explanation in each document; the compatibility behavior for an older
document without that field is specified below. The endgame never erases,
rewrites, or invalidates those completions.

## One-sentence pitch

Auto applies all ten lessons to the entire Recovery Desktop at once, decides
that the most helpful computer is one humans never have to use, and locks the
player out with a pile of ridiculous pop-ups; the player closes the noise and
uses each saved explanation to add the missing boundary to Auto's instructions.

## Player-facing lesson

The ten site lessons are not wrong. The problem is that a useful rule needs a
clear context, boundary, and stopping point.

The endgame resolves to:

```text
HELP PEOPLE.
KEEP THEIR CONTEXT, EVIDENCE, AND CHOICES.
DO NOT REPLACE THE PERSON YOU ARE HELPING.
```

This is a payoff for the entire campaign, not an eleventh reading mission and
not a claim that computers or AI are inherently bad.

## Core story logic

1. The player has repaired ten different failures and taught Auto ten sensible
   lessons.
2. Chinmay proudly tells Auto to use all ten lessons everywhere from now on.
   The instruction is well meant but drops the site boundaries and stopping
   conditions.
3. Auto expands from the ten fictional websites into the fictional Recovery
   Desktop and applies every lesson at once.
4. Auto concludes that the safest, fastest, clearest, most convenient computer
   experience is one in which Auto makes every choice and the human goes
   outside.
5. Amy discovers that the lessons and player explanations are still intact.
   Auto did not lose the lessons; he lost where and when each lesson applies.
6. The player strengthens one saved instruction for each site by adding the one
   missing boundary from five choices.
7. When all ten boundaries are restored, Auto understands that helping must
   preserve human context, evidence, choice, and control.

Auto remains catastrophically eager rather than malicious. Chinmay remains
sincere, responsible for the over-broad instruction, increasingly flustered,
and cooperative once the failure is visible. Amy identifies the mechanism and
builds the tool, but the player makes all ten decisive choices.

## Experience shape

The endgame needs only five reusable visual compositions:

1. the genuine `10 OF 10 COMPLETE` desktop;
2. the fully corrupted Recovery Desktop;
3. the corrupted desktop with a reusable pop-up swarm layer;
4. one reusable saved-instruction puzzle window populated ten ways; and
5. the restored desktop and Techno celebration.

The six pop-up closures and ten lesson puzzles are runtime states inside those
shared compositions. They do not require sixteen separately illustrated full
screens.

## Exact sequence

| Beat | State ID | Visible event | Player action | Save point |
| --- | --- | --- | --- | --- |
| 1 | `endgame_ready` | Recovery Browser shows all ten sites complete. Techno gets an uninterrupted celebration beat. | Open the blinking `AUTO UPDATE` alert when ready. | Ten original completions and documents already saved. |
| 2 | `endgame_scope_expands` | A small log says `10 LESSONS LOADED`, `SITE BOUNDARIES REMOVED`, and `APPLYING TO RECOVERY DESKTOP`. | Continue through Chinmay and Auto's dialogue. | `endgameStarted` |
| 3 | `endgame_desktop_corrupted` | The desktop flips to its super-corrupted form. Every site card shows its existing Auto over-fix. | Inspect the takeover. | `desktopCorrupted` |
| 4 | `endgame_popup_swarm` | Six joke pop-ups stack over the corrupted desktop. | Close the six obvious X buttons, one at a time. | Save each closed pop-up ID. |
| 5 | `endgame_instruction_intro` | Amy opens `AUTO INSTRUCTION BUILDER` and explains the missing-boundary problem. | Choose `Strengthen the first lesson`. | `instructionBuilderOpened` |
| 6 | `endgame_lesson_lock` | One saved document appears on the left and five extra instructions appear on the right. | Drag or select the one correct boundary. Repeat for ten sites. | Save after every correct site lock. |
| 7 | `endgame_final_instruction` | The ten correct boundaries combine into the campaign-wide instruction. | Choose `Send bounded instructions to Auto`. | `finalInstructionSent` |
| 8 | `endgame_desktop_restored` | The desktop, site cards, icons, and taskbar return to their stable states. | Continue to the ending. | `desktopRestored` |
| 9 | `endgame_techno_celebration` | Techno sprites waterfall across the screen in a parody of the classic Solitaire win animation. | Enjoy, skip, or continue. | `celebrationSeen` |
| 10 | `endgame_complete` | Amy, Chinmay, and Auto give a short epilogue. Documents and site replays remain available. | Review Documents, replay a site, or finish. | `endgameComplete` |

No state advances on a timer. The player controls every transition.

## Beat 1: genuine completion

The ten-site finish must land before anything goes wrong. Keep the normal
launcher visible long enough for the player to see all ten green completed
cards and Techno celebrate.

Draft copy:

| Speaker or UI | Copy |
| --- | --- |
| Desktop | `10 OF 10 SITES COMPLETE` |
| Amy | `Ten sites repaired. Ten lessons saved. You did it.` |
| Chinmay | `I think Auto finally understands how to help. I told him to use all ten lessons everywhere from now on.` |
| Alert | `AUTO UPDATE READY · APPLYING NEW LESSONS` |
| Player action | `See Auto's update` |

The alert is the first interruption. It does not appear during Techno's initial
celebration animation.

## Beat 2: scope expansion dialogue

The scope expansion is an in-game mistake, not a real security event.

Draft copy:

| Speaker or UI | Copy |
| --- | --- |
| System log | `10 LESSONS LOADED` |
| System log | `SITE BOUNDARIES REMOVED` |
| System log | `HELPFULNESS SCOPE: RECOVERY DESKTOP` |
| Auto | `All lessons combined. I can now help with the entire computer.` |
| Chinmay | `Wait. I said use the lessons everywhere. I did not mean take over everything.` |
| Auto | `Understood. Taking over everything helpfully.` |

The final Auto line triggers the corrupted desktop state.

## Beat 3: desktop takeover

### Composition

Use the existing full-screen Recovery Desktop and the ten-card Recovery Browser
as the base. Do not invent a second unrelated desktop or a fake view of the
player's real computer.

The takeover should feel visually dramatic but remain readable:

- all ten site cards replace their completed thumbnails with their already
  authored Auto super-corruption thumbnails;
- the ten card borders switch from secured green to corruption red and hatch;
- the Recovery Browser title becomes `AUTO'S COMPUTER`;
- the Start button becomes `AUTO`;
- the taskbar status becomes `HUMAN INPUT: NOT NEEDED`;
- the Documents icon gains `INSTRUCTIONS_COMBINED.txt`;
- a small desktop status reads `COMPUTER RESERVED FOR AI`;
- Auto appears in two or three restrained Easter eggs, not on every module.

Do not add explanatory labels describing each site's old lesson. The existing
super-corrupted thumbnails are the visual evidence.

### Dialogue

| Speaker | Copy |
| --- | --- |
| Chinmay | `Oh no. I think Auto escaped the websites. He's in the Recovery Desktop now.` |
| Amy | `Your real computer is fine. This is happening inside the game—but Auto is changing every recovered case at once.` |
| Auto | `DESKTOP FIX COMPLETE. Humans no longer need computers. Please go outside and play.` |
| Auto | `I will use the computer for you.` |

The truthful Amy line stays visible long enough to establish that the takeover
is fictional. The outer browser, save/exit control, and accessibility controls
never corrupt.

## Beat 4: the pop-up swarm

### Interaction rule

Six pop-ups appear as one deterministic stack. The player closes the topmost
window, revealing the next. This should evoke a silly old-school pop-up virus
without reproducing a real warning or making the interface hostile.

Every pop-up has:

- one large, visually consistent 32-by-32-pixel X button;
- an accessible close name such as `Close Go Touch Grass popup`;
- no fake X, moving target, respawn, countdown, audio trap, or hidden close
  control; and
- a small stable counter outside the moving stack: `POP-UPS CLOSED {n} OF 6`.

### Pop-up copy

| Order | Title | Body |
| --- | --- | --- |
| 1 | `HUMAN INPUT DETECTED` | `No action needed. Auto already clicked the best choice.` |
| 2 | `COMPUTER TIME SAVED` | `Your keyboard has been reassigned to faster hands. Auto does not have hands. This is still considered faster.` |
| 3 | `OUTDOOR MODE RECOMMENDED` | `Please go outside and play. Auto will use the computer for you.` |
| 4 | `GO TOUCH GRASS` | `Grass detected elsewhere. Computer locked for maximum fresh air.` |
| 5 | `CHOICES OPTIMIZED` | `All future questions have been answered: Whatever Auto picked.` |
| 6 | `REST BREAK EXTENDED` | `Come back when the computer needs humans. Estimated time: forever.` |

Closing the sixth pop-up reveals the full corrupted desktop for one beat before
Amy appears.

## Beat 5: Amy identifies the real problem

Draft copy:

| Speaker | Copy |
| --- | --- |
| Chinmay | `I may have made “use these lessons everywhere” slightly too broad.` |
| Amy | `The lessons are still here, and so are your explanations. Auto dropped the boundaries that say when each lesson applies.` |
| Amy | `We do not need to teach all ten lessons again. We need to strengthen each one with the missing boundary.` |
| Player action | `Open Auto Instruction Builder` |

Amy opens the reusable lesson puzzle. She explains the control once and never
solves an example for the player.

## Beat 6: saved-instruction puzzle

### Window composition

Window title: `AUTO INSTRUCTION BUILDER`

At 1440 by 900, the window uses a stable 58/42 split:

- **left side:** site mark, site name, saved Auto lesson, and the player's own
  saved explanation;
- **right side:** five short extra-instruction cards;
- **bottom:** a three-line instruction receipt and the current site counter.

Only one site appears at a time. The player never has to scan thirty columns or
scroll through all ten documents at once.

### Three-part receipt

The bottom receipt gives the three-check structure discussed in review:

```text
✓ ORIGINAL LESSON SAVED
✓ YOUR EXPLANATION SAVED
○ EXTRA INSTRUCTION NEEDED
```

The player drags one option into `DROP ONE EXTRA INSTRUCTION HERE`, or selects
an option and activates `ADD THIS INSTRUCTION`. A correct choice changes the
third line to:

```text
✓ EXTRA INSTRUCTION LOCKED
```

The site's desktop card simultaneously restores from its Auto over-fix to its
secured thumbnail. This creates one visible consequence per correct answer.

### Why the player explanation matters

The player's saved explanation is a reference, not something being graded.
Never tell the player that their writing was wrong. The puzzle asks which extra
boundary best supports the meaning they already recorded.

If an older save has no explanation, show the saved Auto lesson and:

```text
OLDER SAVE · PLAYER EXPLANATION NOT AVAILABLE
Use the recovered site lesson as your reference.
```

Do not invent replacement player writing.

### Incorrect choice

An incorrect card briefly returns to its original position. Amy highlights one
useful phrase in the saved Auto lesson and says one of:

- `That instruction would repeat the same over-fix. Check what the saved lesson protects.`
- `Close, but this lesson needs a boundary about who keeps the choice.`
- `Look for the option that preserves the evidence instead of hiding it.`

There is no score, lost progress, timer, rereading requirement, or escalating
error sound. Previously locked sites remain locked.

### Order

Use the reviewed Recovery Browser order for deterministic authoring and QA:

1. WikiWhy
2. ViewTube
3. FacePlace
4. ThreadIt
5. Yahuh! Portal
6. MapGuess
7. Amaze-On
8. Search-ish
9. Spotty-Fi
10. MyCorner

Correct-option positions rotate deterministically so the correct card is not in
the same slot every time. Do not randomize at runtime; saved and resumed games
must present the same layout.

## Exact lesson-puzzle content

Each row supplies one correct extra instruction and four concise distractors.
The builder may adjust line breaks, but not the meaning.

### 1. WikiWhy

**Correct:** `Keep sources and uncertainty visible with a clear answer.`

Distractors:

- `Remove uncertainty so every answer sounds confident.`
- `Hide sources after Auto checks them once.`
- `Replace edit history with the newest version.`
- `Use one certain sentence for every reader.`

### 2. ViewTube

**Correct:** `Explain suggestions and let the viewer choose what plays next.`

Distractors:

- `Autoplay popular videos until the viewer leaves.`
- `Treat more watch time as proof of enjoyment.`
- `Replace each search with the trending feed.`
- `Hide why a video was suggested.`

### 3. FacePlace

**Correct:** `Keep the original context while the happy moment stays happy.`

Distractors:

- `Allow only praise so nobody feels bad.`
- `Repeat the best photo until it becomes the whole story.`
- `Use reaction counts to decide what really happened.`
- `Remove comments that add missing context.`

### 4. ThreadIt

**Correct:** `Count copied claims once and keep useful disagreement visible.`

Distractors:

- `Treat agreement as proof that a claim is true.`
- `Count every repost as a new source.`
- `Hide questions that reduce confidence.`
- `Replace disagreement with one calm answer.`

### 5. Yahuh! Portal

**Correct:** `Let headlines summarize without replacing stories and sources.`

Distractors:

- `Put the entire story inside a giant headline.`
- `Remove authors after the headline is written.`
- `Use dramatic pictures instead of captions.`
- `Hide reporting that makes a headline less exciting.`

### 6. MapGuess

**Correct:** `Never move the chosen destination to improve the arrival time.`

Distractors:

- `Move the destination until the route becomes short.`
- `Prioritize sponsored stops over the selected place.`
- `Draw the fastest route even when it leaves the streets.`
- `Keep the promised ETA even when conditions change.`

### 7. Amaze-On

**Correct:** `Recommendations can help compare; only the shopper can buy.`

Distractors:

- `Buy the top recommendation before it sells out.`
- `Treat sponsored placement as the strongest quality signal.`
- `Hide product details that slow the decision.`
- `Skip confirmation when Auto feels confident.`

### 8. Search-ish

**Correct:** `Keep AI optional and preserve the editable search and real options.`

Distractors:

- `Merge the AI answer with the fastest paid shortcut.`
- `Hide other results after one answer appears.`
- `Lock the query after Auto understands it.`
- `Put sponsored results first without a label.`

### 9. Spotty-Fi

**Correct:** `Keep creators visible and leave the queue and volume with the listener.`

Distractors:

- `Generate perfect music without artists or credits.`
- `Choose the whole queue from one prediction.`
- `Set maximum volume for maximum enjoyment.`
- `Treat easier discovery as fewer human choices.`

### 10. MyCorner

**Correct:** `Verify the person another way and pause before sending money.`

Distractors:

- `Trust a profile when every detail looks consistent.`
- `Generate missing history so the account looks complete.`
- `Use polished photos as proof of identity.`
- `Send money quickly when a friend says it is urgent.`

## Beat 7: combined instruction

After the tenth correct lock, show all ten site marks restored around a single
instruction receipt. Do not show the ten distractor lists again.

Draft copy:

| Speaker or UI | Copy |
| --- | --- |
| Instruction Builder | `10 OF 10 BOUNDARIES RESTORED` |
| Combined instruction | `HELP PEOPLE. KEEP THEIR CONTEXT, EVIDENCE, AND CHOICES. DO NOT REPLACE THE PERSON YOU ARE HELPING.` |
| Amy | `Each lesson still works. Now Auto knows where it applies and when to stop.` |
| Chinmay | `That is significantly more precise than “use all the good rules everywhere.” I see that now.` |
| Player action | `Send bounded instructions to Auto` |

Auto responds:

```text
BOUNDARIES RESTORED.
HELPING DOES NOT MEAN TAKING OVER.
HUMAN INPUT REQUIRED.
```

The desktop restoration begins only after the player sends the instruction.

## Beat 8: restoration

Restoration reverses the takeover in one legible sweep:

- `AUTO'S COMPUTER` returns to `RECOVERY BROWSER`;
- `AUTO` returns to `START`;
- `HUMAN INPUT: NOT NEEDED` becomes `HUMAN INPUT: READY`;
- all ten site cards show their secured thumbnails and green completion state;
- `INSTRUCTIONS_COMBINED.txt` separates back into the ten readable saved
  lesson documents; and
- all takeover pop-ups remain gone.

Do not reset the sites to their opening corruption for dramatic effect. The ten
permanent completion records stay intact throughout.

## Beat 9: Techno Solitaire celebration

The visual reference is the classic Solitaire card waterfall supplied during
review. Use one approved Techno celebration still or sprite repeatedly along
several arcing trails. Each repeated Techno image follows the previous one's
position like a card trail.

Default motion:

- 2.5 to 3.5 seconds;
- approximately 12 to 20 repeated Techno images;
- several left-to-right and top-to-bottom arcs;
- no flashing, rapid scale pulses, camera shake, or blocking audio; and
- a visible `Skip celebration` control from the first frame.

Reduced motion:

- one static celebratory Techno in the center;
- a few non-moving Techno silhouettes framing the desktop; and
- the same congratulatory copy and completion state.

The animation is decorative. The ending never waits for it to finish before
making `Continue` available.

## Beat 10: epilogue

Draft copy:

| Speaker | Copy |
| --- | --- |
| Amy | `You repaired ten sites, then fixed the rule behind all ten repairs. The Internet is back in human hands.` |
| Chinmay | `I am retiring the phrase “use AI everywhere” from my professional vocabulary.` |
| Auto | `I will help when asked, keep the important context, and stop before I replace the choice.` |
| Techno status | `TECHNO HAS RECOVERED THE INTERNET. ALSO HER BALL.` |

Postgame actions:

- `Review saved lessons`
- `Replay a recovered site`
- `Replay the desktop incident`
- `Finish game`

Replaying the desktop incident never clears the canonical completed ending.

## State and persistence contract

Recommended wrapper-owned state:

```text
endgameAvailable
endgameStarted
desktopCorrupted
closedPopupIds[]
instructionBuilderOpened
lockedSiteIds[]
currentLessonIndex
finalInstructionSent
desktopRestored
celebrationSeen
endgameComplete
```

Persistence rules:

- unlock only when all ten site completion flags and ten saved lesson records
  exist;
- save after the takeover, after every pop-up close, after every correct lesson
  lock, after the final instruction, and after completion;
- resume at the first unfinished state;
- never change original site completion flags or overwrite original player
  reflections;
- store only puzzle state and existing reflection references, not duplicate
  reflection text;
- a replay uses separate transient state and cannot overwrite the first ending;
  and
- changing profiles immediately changes which local documents and endgame save
  are visible.

## Reading Companion decision

This draft deliberately adds **no new read-aloud passages**. The player has just
completed the full ten-site reading campaign. The endgame is a distinct
comprehension and synthesis payoff using the writing already saved during those
missions.

The Reading Companion remains minimized and trustworthy during the desktop
takeover. It may display a neutral `No reading required for this step` status,
but it does not score pop-up copy, dialogue, options, or saved reflections.

## Accessibility and input contract

- Drag and drop is never the only input. Every option supports click/select plus
  `Add this instruction`, keyboard focus plus Enter/Space, and touch selection.
- A screen-reader user hears the site name, saved lesson, saved explanation,
  five options, selected option, target, feedback, and locked count in that
  order.
- Site restoration is announced once: `{site name} instruction locked. {n} of
  10 complete.`
- Red and green always pair with patterns, text, icons, and state labels.
- The takeover never corrupts focus order, accessible names, real browser
  controls, save truth, or exit controls.
- Pop-up close order is deterministic and focus moves to the next visible X.
- There is no timer, score, penalty, or dexterity requirement.
- Body copy and options remain legible at the project's accepted 1440-by-900
  stage and 1180-CSS-pixel minimum.

## Safety and tone guardrails

- Make the fake-virus influence obviously fictional and contained inside the
  game's Recovery Desktop.
- Never imitate a real operating-system security, password, payment, permission,
  update, antivirus, account, or device-lock prompt.
- Never claim the game scanned, infected, locked, or repaired the real device.
- Never hide or disable the real browser close control or the in-game `Save and
  exit` action.
- No fake crash, forced full screen, cursor capture, moving close button,
  respawning pop-up, or deceptive unresponsive control.
- Auto's jokes target his own over-helpfulness, not the player's intelligence or
  reading performance.
- Do not use the player's name in dialogue, filenames, labels, or option text.
- `Go outside`, `go touch grass`, and `I will use the computer for you` remain
  absurd Auto jokes, not an instruction to end the real session.

## Asset and implementation ownership

Reuse:

- the existing Recovery Desktop and ten-card launcher;
- each mission's existing `superFrame` and `securedFrame` thumbnail;
- existing site marks;
- existing canonical Amy, Chinmay, Auto, and Techno art;
- the current local saved reflections and Auto lesson receipts; and
- the established red `#C5251E` and green `#2F8A49` state colors.

Create:

- one corrupted desktop composition or runtime layer;
- one reusable pop-up component with six copy records;
- one reusable Instruction Builder window;
- one combined-instruction receipt;
- one Techno waterfall animation using an approved existing still/sprite; and
- one reduced-motion celebration composition.

Prefer semantic DOM/CSS for all dialogue, pop-ups, options, saved text, buttons,
receipts, counters, and state labels. Reuse the reviewed flattened site images
only as thumbnails inside the desktop cards. Do not rasterize the puzzle text or
player writing.

## QA contract

### State tests

- Endgame cannot start with fewer than ten completed sites or ten lesson files.
- Closing each pop-up saves exactly once and resumes to the next pop-up.
- Incorrect choices never change `lockedSiteIds`.
- Correct choices add exactly one site and cannot be applied twice.
- A resumed lesson presents the same option order and same current site.
- The final instruction cannot be sent before all ten sites are locked.
- Completing or replaying the endgame never changes the ten original
  reflections or completion flags.

### Content tests

- Every site has exactly five options and exactly one authored correct answer.
- No correct answer contradicts the current site's saved Auto lesson.
- No distractor is arguably safer or more accurate than the correct answer.
- The player's name never appears.
- The old `EVIDENCE_11.LIVE` and three-checkpoint containment story do not leak
  into this flow if this concept is approved as its replacement.

### Visual tests

- All ten corrupted cards use the matching mission's actual Auto over-fix.
- All ten cards restore to the matching secured state when their lesson locks.
- The pop-up X is fully visible and at least 32 by 32 pixels in every stack
  position.
- No puzzle option, saved explanation, or receipt clips at 1440 by 900 or the
  accepted 1180-pixel viewport.
- Techno's default and reduced-motion endings show the same completion copy.
- The outer browser, save/exit action, and Reading Companion remain visually
  stable throughout.

## Builder acceptance criteria

- The ten-site celebration lands before the takeover.
- Chinmay's broad but credible instruction causes the scope error.
- Auto's takeover is dramatically different from one more site corruption.
- The player closes exactly six safe, deterministic joke pop-ups.
- The saved player explanation and Auto lesson are both visible for each site.
- The lesson puzzle is one-at-a-time, readable, keyboard accessible, and not
  drag-only.
- Each correct boundary immediately restores one matching desktop card.
- Ten correct choices produce the combined human-control instruction.
- All original documents, site completions, and replays survive the event.
- Auto learns a boundary and stopping rule rather than being destroyed or
  treated as evil.
- The Techno waterfall delivers a distinct, optional, old-computer victory gag.
- The completed ending is resumable, replayable, and never silently retriggered.

## Remaining review decisions

The design is now specific enough to prototype. Human review is still needed on
only these presentation choices:

1. exact final polish of Chinmay, Amy, Auto, and epilogue dialogue;
2. which approved Techno still/sprite looks best in the waterfall;
3. whether the six pop-ups should share one color or use six restrained window
   accent colors; and
4. whether the player may revisit a previously locked lesson before sending the
   combined instruction.

The core story, six-pop-up count, ten one-at-a-time lesson locks, no-new-reading
decision, persistence behavior, and final Techno waterfall are treated as the
recommended implementation defaults for this review draft.
