# Ten-site continuity QA — 2026-08-24

## Scope

This pass checks the playable Recovery Browser and all ten missions for the
same player-visible contract:

- launcher progress is legible without covering a site preview;
- a new player always lands on the Recovery Browser;
- the website and Reading Companion use aligned Recovery OS window controls;
- every accepted or skipped passage advances exactly one declared runtime
  frame;
- the lock-in panel uses canonical corruption red for every pending repair;
- lock-in copy fits without hiding more of the repaired site than necessary;
- retries cannot reapply a repair delta; and
- completed recoveries and partial replays retain separate save checkpoints.

## Ten-site mapping audit

| Mission | Passages | Before Otto | After Otto | Runtime frame sequence | Continuity result |
| --- | ---: | ---: | ---: | --- | --- |
| WikiWhy | 10 | 6 | 4 | 2, 3, 4, 5, 6, 7, 13, 14, 15, 7 | Three lock rows, then one final secured-state passage; the last passage no longer repeats an unchanged open checklist. |
| ThreadIt | 9 | 6 | 3 | 2, 3, 4, 5, 6, 7, 10, 11, 12 | Three visible rows map one-to-one to three passages. `COUNT SOURCES + COLLAPSE COPIES` combines two dependent parts of the same evidence repair. |
| FacePlace | 8 | 5 | 3 | 2, 3, 4, 5, 6, 9, 10, 11 | Three visible rows map one-to-one to three passages. Photo/context pairs are grouped where one cannot be restored meaningfully without the other. |
| MyCorner | 9 | 4 | 5 | 2, 3, 4, 5, 8, 9, 10, 11, 12 | Four identity locks plus the final secured Friend Space state; copy retains `PAUSE BEFORE EVER SENDING MONEY`. |
| Yahuh! Portal | 9 | 6 | 3 | 2, 3, 4, 5, 6, 7, 10, 11, 12 | Three visible reporting locks map one-to-one to three passages. |
| ViewTube | 8 | 5 | 3 | 2, 3, 4, 5, 6, 9, 10, 11 | Three visible rows map one-to-one to three passages. Search/ad restoration and autoplay/final choice are grouped into coherent single repairs. |
| Amaze-On | 11 | 6 | 5 | 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14 | Five compact shopping-control locks map one-to-one to five passages. |
| Search-ish | 10 | 6 | 4 | 2, 3, 4, 5, 6, 7, 10, 11, 12, 13 | Four reviewed search locks map one-to-one to four passages. |
| Spotty-Fi | 10 | 5 | 5 | 2, 3, 4, 5, 6, 9, 10, 11, 12, 13 | Four music-control locks plus the final secured-state passage; no duplicate repair application. |
| MapGuess | 8 | 4 | 4 | 2, 3, 4, 5, 8, 10, 12, 14 | The same red `GO DIRECTLY TO THE LIBRARY` repair fails visibly three times at frames 9, 11, and 13 before the fourth attempt succeeds. The redundant `TRY THE REPAIR` line was removed from the panel. |

## Corrections made during the audit

ThreadIt, FacePlace, and ViewTube each had more visible post-Otto checklist
rows than remaining passages. Their old runtime mappings skipped intermediate
frames, making one passage appear to check two rows at once. The overlapping
concepts are now grouped into three honest rows per mission, and every passage
advances one row only.

WikiWhy had the inverse issue: the final two passages both pointed to the same
open-checklist frame. Its final passage now closes the checklist by returning
to the secured site state.

## Automated evidence

`npm run test:ten-site-continuity` opens all ten missions in Chromium, skips
through all 92 passages, traverses every midpoint and all three MapGuess
moving-target interruptions, and compares the displayed image after each
passage with the declared runtime frame. It also seeds a completed ViewTube
recovery with a three-passage replay checkpoint, verifies that the launcher
offers `CONTINUE REPLAY` and resumes at passage four, and verifies that `New
game` clears the mission route before showing player login. It fails on a
renderer crash, page error, console error, missing story transition, save-lane
failure, or frame mismatch.

The ten current production validators also pass. They cover state counts,
semantic colors, checklist geometry, copy bounds, reviewed secured states, and
mission-specific behavior. This QA pass found no unresolved continuity question
that requires an editorial decision.
