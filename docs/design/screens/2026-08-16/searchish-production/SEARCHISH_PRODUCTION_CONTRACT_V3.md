# Search-ish production contract v3

Status: review candidate. The storyline follows the approved print-copy search
scenario; final dialogue and Reading Companion manuscripts remain a separate
content pass.

## Mission

The visible query asks for a print copy of *Adventures of Huckleberry Finn*.
The broken page lets an oversized generated answer respond with an unsolicited
plot summary while paid products crowd out the results that best satisfy the
query. The overview does not narrate or explain the ad below it; those are two
separate failures until Auto later fuses them into one shortcut. The repair
restores hierarchy and choice without treating AI help or advertising as
inherently bad.

The secured result hierarchy is:

- a collapsed AI-overview bar with no answer content until opened;
- public-library availability and reservation followed by neighborhood-bookstore pickup;
- free online editions from Project Gutenberg and Internet Archive; and
- an unmistakably labeled paid result below those useful options.

No result is selected, reserved, or purchased for the player.

## First repair run

| Frame | Visible repair | Stable unresolved evidence |
| --- | --- | --- |
| 1 | Initial corruption | Wrong AI answer, tiny `ad`, hidden useful results |
| 2 | Correct the oversized AI overview | Paid label and useful results remain unresolved |
| 3 | Collapse AI into a simple `AI OVERVIEW / SHOW MORE` bar | Paid label and useful results remain unresolved |
| 4 | Make the paid-placement label unmistakable | Library and bookstore remain minimized |
| 5 | Restore library availability and free online editions | Neighborhood bookstore remains minimized |
| 6 | Restore neighborhood bookstore and local pickup | The page is not yet reranked |
| 7 | Rerank the whole page | No unresolved corruption remains |

The large re-ranking is last so the page remains visibly corrupted until the
final first-run repair.

## Auto over-fix

Chinmay's plausible platform-wide instruction is to save people time by putting
the most useful answer and easiest next step at the top of every search. Auto
interprets the fastest next step for this book search as a sponsored printed
study guide rather than the requested novel:

- the search field becomes unavailable;
- one giant answer fills the page;
- a visibly sponsored *Huckleberry Finn* study guide is embedded as the one-click answer; and
- all other options collapse.

Auto is visibly eager, not malicious. `BLUETOOTH ENABLED`, impossible
completion language, and the auto-opened shortcut are restrained character
Easter eggs. The midpoint dialogue can land the joke as:
`One best answer, one fastest next step, and zero extra searching.`

## Lock run

The asymmetric four-item lock sequence is:

1. `FIX THE AI`
2. `MAKE AI OPTIONAL`
3. `SHOW REAL OPTIONS`
4. `KEEP THE SEARCH`

The sponsored bookstore remains visibly labeled throughout the lock run. The
second run therefore fixes Auto's answer first, reduces it to optional help,
restores comparison, and only then restores the editable search.

The player name never appears in the site UI.

## Module-purpose ledger

| Module | Purpose | Changes |
| --- | --- | --- |
| Search-ish logo and search-category tabs | Persistent parody cue | Never |
| Search field | Repair target | Disabled by Auto; restored by final lock |
| AI overview | Repair target | Corrected, made optional, then over-expanded and relocked |
| Paid products/result | Repair target | Label restored in each run |
| Public library | Repair target | Full-width result with a recognizable library favicon and URL |
| Neighborhood bookstore | Repair target | Full-width result with a distinct bookstore favicon and URL |
| Free online editions | Repair target | Stacked Project Gutenberg and Internet Archive results with recognizable favicons and URLs |
| Generated river-book illustration | Persistent search/AI cue | Stable within each run |
| Generated edition strip and prices | Persistent search/shopping cue | Same product art within a run |
| Generated study-notes cover | Auto over-fix cue | One polished sponsored shortcut product |
| View-more cue | Persistent parody cue | Shows that useful results continue below the fold |
| Search Recovery meter | Persistent parody cue | Tracks site state only |

## QA contract

- Fourteen 1440 × 900 states use the reviewed shared shell.
- First-run progress is `0,17,33,50,67,83,100`.
- Lock-run progress is `0,0,25,50,75,100`, followed by a secured 100% frame.
- Red wrong copy does not drift before its named repair; corrected copy does not
  drift after repair.
- The Auto over-fix is shown once without the checklist.
- Exactly four checklist items tick one at a time and change the underlying page.
- The first-run and secured site results have the same final hierarchy, with
  free online editions above the sponsored bookstore and no numbered ranks.
- No visible `Act`, `Phase`, player name, real platform name, or production note.
- Every image reference resolves, all exported PNGs exist, and lesson-bearing
  text remains inside the left site window at the 1440 × 900 review size.
