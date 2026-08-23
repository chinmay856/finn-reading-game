# ThreadIt production contract and repair ledger

Status: visual-sequence contract for review. The food-safety wording remains
provisional and must receive qualified review before player-facing copy freezes.

This contract applies the required preflight in
`docs/design/SITE_SEQUENCE_AUTHORING_PRINCIPLES.md`.

## Story contract

### Lesson

Repeated agreement can look like independent evidence even when every account
is repeating the same original claim. Votes, repetition, and belonging do not
establish food safety.

### Scenario

Finn lands in `r/RawFishForever`, an enthusiastic forum where one personal story
from `u/raw_fish_fan_1`—`I ate a raw piece of fish once and felt fine`—has been
turned into the universal claim `Every kind of raw fish is ALWAYS safe` and
copied into an apparent crowd. The forum inflates votes, hides where the claim
began, collapses a respectful question, and rewards agreement. The repaired
community remains enthusiastic; it restores the original anecdote and clearly
distinguishes stories, context, current guidance, and questions.

### Initial corruption

- The universal claim is canonical red.
- The original-post timestamp and origin are hidden.
- Three agreeing replies sit in separate comment cards with identical absurd
  `OVER 9,000` vote scores, making repetition look popular and independent.
- Two red tangled paths visibly connect the one post to its confusing comment
  tree. They contain no decorative dots or detached marks.
- `u/just_asking` is collapsed at `−9,001` points.
- Community rules reward agreement and discourage questions.
- A persistent `u/RawFishMod · ADMIN` cue makes moderation part of the native
  forum rather than a design-note panel.

### Chinmay shortcut and Auto over-fix

Chinmay notices that the forum cannot agree and tells Auto to make the answer
more certain. Auto cheerfully treats every copied reply as fresh agreement:

`47 AUTO-FANS · ONE COPIED CLAIM`

Auto replaces the forum with `47 OUT OF 47 AUTO-FANS AGREE`, creates a visible
swarm of toaster-like Auto accounts, turns three copies into numbered reposts,
re-collapses the question, and rewrites the rules to reward agreement. Each
repost still visibly says it was copied from `u/auto_fan_1`.
Auto remains eager, literal, and mistaken—not malicious.

### Secured payoff

The final forum keeps its raw-fish fandom while making the evidence structure
legible. Its anchor remains the modest original post—`I ate a raw piece of fish
once and felt fine` / `This is my personal story—not a safety check`—alongside
one collapsed copy group that is net downvoted, separate preparation context, a
highly upvoted research/source comment, an open disagreement, and rules that
welcome sources and disagreement.

## State ledger

The mission uses ten reading repairs: six before Auto's over-fix and four
after it. The click-through contains fourteen rendered states because the
over-fix and checklist are each shown unobscured once, and the secured state
closes the overlay.

| # | State | Visible delta | Progress | Persistent unresolved content |
|---:|---|---|---:|---|
| 1 | Initial corruption | Universal claim, hidden origin, copied crowd, collapsed question, exclusionary rules | 0% | All first-run red keys |
| 2 | Comment path untangled | Red tangles become one ordered green post-to-comment connector; the origin remains hidden | 17% | Origin, copies, disagreement, headline/rules |
| 3 | Original post and score revealed | The top card gains the `u/raw_fish_fan_1` identity, timestamp, meaningful `214` score, and original personal-story wording; the universal copied replies remain red | 33% | Copies, disagreement, community rules |
| 4 | Copied comments identified | Every bounded comment keeps the same red claim and gains a green badge tracing it to `u/raw_fish_fan_1` | 50% | Copied crowd, disagreement, headline/rules |
| 5 | Copied comments collapsed | Three copies become one native comment counted once and net downvoted; preparation and research comments enter the freed space and rank by their visible votes | 67% | Disagreement and community rules |
| 6 | Disagreement restored | The respectful question and normal participation return; exclusionary community rules remain visibly unresolved | 83% | Community rules |
| 7 | Community rules corrected | Welcoming rules complete the forum without rewriting the original personal story into a lesson statement | 100% | None |
| 8 | Auto consensus override | Whole forum resets to Auto's visually distinct Auto-fan swarm, copied agreement, and infinite-vote over-fix | 0% | All lock-run red keys |
| 9 | Checklist opened | Green four-item overlay appears over the unchanged over-fix | 0% | All lock-run red keys |
| 10 | Human posts restored | One human story replaces Auto's synthetic top post and the first check turns green | 25% | Source count, context, questions |
| 11 | Unique sources counted | Forty-seven reposts resolve to one copied claim | 50% | Context, questions |
| 12 | Copied comments collapsed | Repeated comments collapse and unique context returns | 75% | Disagreement/rules |
| 13 | Disagreement locked | Disagreement and welcoming rules return; fourth check turns green | 100% | None |
| 14 | Repair secured | Overlay closes on the repaired forum | 100% | None |

### First-run red continuity keys

- `forum-headline` and `forum-body` (restored with the original post)
- `forum-origin`
- `reply-source-1`, `reply-source-2`, `reply-source-3`
- `reply-claim-1`, `reply-claim-2`, `reply-claim-3`
- `reply-treatment-1`, `reply-treatment-2`, `reply-treatment-3`
- `question-card`
- `collapsed-claim`
- `community-rules`

Each key remains textually and visually stable until its named repair, then
becomes neutral/corrected with a canonical green signal and does not drift.

### Lock-run red continuity keys

- `auto-original`
- `auto-source-count`
- `auto-context`
- `auto-question`

The Auto over-fix is a permitted wholesale reset. Within the lock run, each key
remains stable until its checklist repair.

## Player-facing repair labels

First-run labels stay in the Reading Companion and reviewer title, not as
instructions pasted into the forum:

1. Untangle the comment path
2. Reveal the author and real post score
3. Identify the copied comments
4. Collapse the copies and restore voting
5. Restore disagreement
6. Correct the community rules

The green lock checklist uses four short items:

1. Restore human posts
2. Count unique sources
3. Collapse copied comments
4. Let people disagree

## Module-purpose ledger

| Module | Purpose | Repair responsibility |
|---|---|---|
| ThreadIt header, search, community tabs | Persistent parody cue | Never changes during a run |
| Main post and vote rail | Repair target | Origin, headline, evidence category, and absurd-to-meaningful score change |
| Three bounded comment cards, avatars, votes, and connected thread paths | Repair target | Untangle order, reveal shared origin, identify exact copies, then collapse them into one counted claim |
| Native vote controls | Repair target | Return with the collapsed-comment repair; the repeated universal claim ranks below preparation context and research |
| Question card | Repair target | Restore visible disagreement and normal participation |
| Community rules rail | Repair target | Replace exclusion with questions/sources welcome |
| Static Top Posts rail | Repair target | Repeated crowd becomes current guidance, handling detail, and an open question without changing the section label |
| Progress footer | Progress only | `THREAD UNTANGLED`, then `SOURCE LOCKS` |
| Shared desktop and Reading Companion | Persistent shared shell | Never regenerated by this site sequence |

No remaining site-specific module may exist only to explain the lesson. If a
module neither changes nor makes the parody recognizable, remove it.

## QA contract

- Exactly 14 states, 6 first-run repairs, and 4 lock-run repairs.
- Shared 1440 × 900 shell and fixed forum geometry across every state.
- Clean title bar: `www.thread-it.com`; community path appears only inside the
  page as `r/RawFishForever`.
- Canonical corruption red `#C5251E` and repair green `#2F8A49`.
- Auto over-fix appears once without the checklist and includes the Auto-fan
  swarm, repeated toaster avatars, Auto moderator card, and Bluetooth joke.
- Checklist check and corresponding underlying forum repair happen together.
- First-run and lock-run red keys do not drift before repair; repaired keys do
  not drift afterward.
- Black native-interface labels stay stable across the run; only red repair
  targets change, and each change introduces a green confirmation.
- Secured state contains no unresolved semantic red and no checklist overlay.
- Player-facing screens contain no Act/Phase labels, real platform names, or
  design-document instructions.
- All text and module bounds pass at 1440 × 900; adjacent frames receive visual
  inspection before review.
