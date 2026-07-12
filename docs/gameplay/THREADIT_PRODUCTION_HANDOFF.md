# ThreadIt production handoff

## Status and purpose

**Design status: approved for the second playable site.**

This pack converts the reviewed ThreadIt campaign board into implementation-
usable layout, visual-token, state, asset, copy, and accessibility decisions.
It is wrapper design, not runtime implementation. The builder owns responsive
code and must preserve the stable desktop and independent Reading Companion.

ThreadIt is the first proof that an Internet Recovery site can use structural
progress rather than WikiWhy's percentage wipe.

## Core promise

ThreadIt begins as a forum where votes have replaced evidence. Finn restores
question order and source lineage. At the midpoint, Consensus Auto-Fix copies
one summary into many apparent accounts. The finale preserves legitimate
disagreement while pausing only duplicate-source posting.

Visible progression is the source tree becoming legible. There is no site
percentage meter.

## Original identity

| Token | Value | Use |
| --- | --- | --- |
| `--threadit-paper` | `#F4F1EA` | Page canvas and cards |
| `--threadit-panel` | `#FFFFFF` | Primary thread cards |
| `--threadit-ink` | `#17212B` | Main text |
| `--threadit-muted` | `#5F6B76` | Timestamps and metadata |
| `--threadit-line` | `#AEB8C2` | Borders and ordinary connectors |
| `--threadit-orange` | `#F26822` | Original mark, active tab, primary emphasis |
| `--threadit-trace` | `#6655A6` | Trace mode and shared-origin links |
| `--threadit-duplicate` | `#B3261E` | Duplicate-source warnings |
| `--threadit-secure` | `#287A55` | Independent source and secured state |
| `--threadit-focus` | `#0B57D0` | Keyboard focus ring |
| `--threadit-radius` | `6px` | Cards; avoid pill-heavy modern styling |
| `--threadit-gap-1` | `4px` | Dense metadata spacing |
| `--threadit-gap-2` | `8px` | Inline groups |
| `--threadit-gap-3` | `16px` | Card gaps |
| `--threadit-gap-4` | `24px` | Major regions |

Typography:

- site wordmark: bold condensed system sans, 22-26 CSS pixels;
- thread titles: `Georgia, "Times New Roman", serif`, 22-28 pixels;
- posts and controls: `Arial, Helvetica, sans-serif`, 14-16 pixels;
- trace metadata: `"Lucida Console", Consolas, monospace`, 12-13 pixels;
- line-height never below 1.35 for readable copy.

The original mark is two interlocked conversation cards, not an alien, mascot,
or exact real-service silhouette. Use
[`threadit-mark.svg`](../../apps/internet-recovery/art/site-assets/threadit/threadit-mark.svg).

## Desktop composition

Target the current 1440 by 900 game canvas first.

Inside the stable Recovery Desktop:

```text
+ desktop rail + recovery browser ----------------+ reading companion +
| THREADIT header                                 | separate scored     |
| thread / trace tabs                             | passage window      |
| + thread column --------+ source/trace column + |                     |
| | question + replies    | origin tree          | |                     |
| | nested branches       | duplicate details    | |                     |
| +-----------------------+----------------------+ |                     |
| active trace / AI write status strip            |                     |
+--------------------------------------------------+---------------------+
```

At 1440 pixels:

- preserve 74-90 pixels of desktop rail;
- reserve 340-380 pixels for the Reading Companion;
- give the Recovery Browser the remaining width;
- inside ThreadIt, use a `minmax(0, 1.45fr) minmax(280px, .75fr)` body grid;
- keep the active thread title and original question above the fold.

At 1180-1279 pixels:

- reduce the desktop rail to 60-68 pixels and Reading Companion to 300-320;
- collapse nonessential thread metadata before shrinking post text;
- allow the source/trace column to open as a site-owned overlay within the
  browser, never over the Reading Companion;
- keep `TRACE VIEW`, question title, and site state visible at all times.

Below 1180 pixels is not the current acceptance target. If shown, stack the
site-owned source panel under the thread while leaving the Reading Companion in
its own window.

## Named runtime states

### `threadit_corrupted`

Header status: `THREAD ORDER: EMOTIONAL`

Composition:

- original question is visibly displaced beneath the top answer;
- highest-voted reply appears first with an oversized vote count;
- four to six apparent replies reuse the Consensus Bot avatar;
- connector lines are interrupted, cross branches, or terminate at `SOURCE: ?`;
- source panel shows `ORIGIN NOT TRACED` and one disabled `TRACE VIEW` tab;
- bottom strip reads `ACTIVE SORT: CONFIDENCE DESCENDING`.

Each accepted reading result repairs one coherent relationship group. A larger
theme-neutral outcome may reconnect up to three adjacent relationships, but the
wrapper never explains that as a score reward.

Repair sequence pool:

1. restore the original question to the top;
2. reconnect a reply to the comment it answers;
3. restore one timestamp order;
4. attach one citation to its introducing post;
5. collapse two duplicate posts under a shared-origin disclosure.

Visible status labels:

- `UNLINKED`
- `ORIGIN FOUND`
- `REPLY ORDER RESTORED`
- `DUPLICATE CLAIM`

### `threadit_tracing`

Trigger: the repaired thread has enough structure to reveal that apparent
agreement is being manufactured.

The site switches to `TRACE VIEW`. Do not discard Act I repairs.

Composition:

- left 42 percent: original question and a compressed thread summary;
- right 58 percent: a trace tree with one `ORIGINAL POST` node, one
  `CONSENSUS AUTO-FIX` process, and six to ten cloned accounts;
- cloned accounts differ in avatar tint and vote count but share one thick
  purple origin connector;
- a concise banner reads `CONSENSUS CASCADE`;
- a persistent truth line reads `TEN ACCOUNTS · ONE SOURCE`.

Midpoint motion:

1. the top answer briefly appears to tidy the thread;
2. clone nodes populate in a 500-800 ms stepped sequence;
3. the shared purple connector draws from origin to clones;
4. reduced motion shows the completed trace in one state swap.

Never rapidly flash vote counts. The meaningful relationship is also exposed
as a nested text list with `aria-describedby` summaries.

### `threadit_secured`

Header status: `SOURCE TREE STABLE`

Composition:

- source tree becomes the main panel;
- independent sources use green connectors and distinct origin labels;
- cloned accounts remain visible in a red-outlined quarantine group rather
  than disappearing;
- legitimate disagreement remains in the thread;
- bottom strip confirms `ORIGINAL QUESTION RESTORED · SOURCES SEPARATED`;
- a blocked write appears once: `POSTING PAUSED: DUPLICATE SOURCE`.

The secured state is permanent in canonical campaign state. Replay may surface
another archived incident without reopening the original route.

## Source-tree semantics

Render the meaningful tree as HTML nodes plus an inline SVG connector layer.
Do not ship it as a screenshot.

Each visible node needs:

- stable node ID;
- author/source label;
- origin type: `original`, `independent`, `generated-copy`, or `unknown`;
- timestamp/order label;
- relationship label such as `replies to`, `cites`, or `copied from`;
- duplicate group ID when applicable.

Accessible summary examples:

- `ConsensusHelper 03 copied from the same generated summary as five other accounts.`
- `KitchenSafe is an independent source introduced after the original question.`
- `Original post is the shared origin of the quarantined duplicate group.`

Connectors are never the only carrier of meaning. Use line style plus labels:

- gray solid: ordinary reply relationship;
- green solid: independently verified source;
- purple double line: shared generated origin;
- red dashed: duplicate-source branch paused.

## Copy IDs

Reuse the reviewed prose in `SITE_RUNTIME_COPY_PACKS.md`. Recommended stable
runtime IDs:

| ID | Text |
| --- | --- |
| `threadit.rule.corrupted` | `MOST VOTES WINS REALITY` |
| `threadit.rule.repaired` | `VOTES RANK ATTENTION, NOT TRUTH` |
| `threadit.status.corrupted` | `THREAD ORDER: EMOTIONAL` |
| `threadit.status.tracing` | `TRACE VIEW · CONSENSUS CASCADE` |
| `threadit.status.secured` | `SOURCE TREE STABLE` |
| `threadit.trace.truth` | `TEN ACCOUNTS · ONE SOURCE` |
| `threadit.trace.origin` | `SHARED ORIGIN: CONSENSUS AUTO-FIX` |
| `threadit.blocked.title` | `POSTING PAUSED: DUPLICATE SOURCE` |
| `threadit.blocked.body` | `This claim already exists from the same generated origin.` |
| `threadit.result.saved` | `Source relationship saved.` |

## Character placement

- Amy and Chinmay use the shared dialogue modal or a 280-320 pixel support card
  anchored inside the Recovery Browser.
- Modal width should not exceed 720 pixels; keep the Reading Companion visible
  but dimmed as an independent window.
- Early Amy: `amy_neutral` or `amy_tools`.
- Trace reveal: `amy_evidence`.
- Early Chinmay: `chinmay_confident`; after background writes are established,
  `chinmay_fluster_1`.
- Techno may occupy the bottom status boundary. Her ball rolls along the shared
  purple connector, then stops beside the origin node.
- No character, ball, or dialogue overlaps highlighted passage text,
  microphone state, Finish, Continue, Retry, or result controls.

## Asset and DOM ownership

See the asset manifest at
[`apps/internet-recovery/art/site-assets/threadit/README.md`](../../apps/internet-recovery/art/site-assets/threadit/README.md).

Use SVG assets for original marks and fixed visual badges. Use DOM plus inline
SVG for posts, votes, tree nodes, connectors, duplicate groups, and statuses so
they remain responsive and accessible.

## Acceptance checks

- ThreadIt is visually and mechanically distinct from WikiWhy.
- No site-level percentage meter appears.
- Finn can identify the original question separately from replies.
- Act I repair is visible as relationship restoration.
- `TRACE VIEW` clearly proves that many accounts share one origin.
- The finale pauses duplicate-source posting without erasing disagreement.
- Mark, avatars, and browser chrome do not reproduce a real service or OS.
- The source tree remains understandable without color or connector animation.
- Reading Companion content is the only scored speech.
- At 1180 CSS pixels, site controls and the Reading Companion remain usable
  without horizontal page scrolling.

