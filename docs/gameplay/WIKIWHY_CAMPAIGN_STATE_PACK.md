# WikiWhy campaign-only state pack

## Purpose

The one-passage WikiWhy reader is already the playable foundation. This pack
defines only the wrapper-owned campaign layers requested by the builder:

- the 70-79 percent background-write clue;
- the 80 percent rogue-AI rewrite;
- Shield Passes 1, 2, and 3;
- permanent secured treatment;
- evidence slot 1 and its access-route fragment.

Passage layout, microphone state, highlighting, local transcription, scoring,
results, and comprehension remain unchanged.

## State sequence

| State ID | Entry condition | Visible delta | Exit |
| --- | --- | --- | --- |
| `wikiwhy_repair_70_79` | Act I reaches 70-79 percent | Subtle right-edge ghost rewrite plus background-write status | next accepted reading |
| `wikiwhy_rewrite_80` | Act I first reaches the 80 percent clamp | saved repair freezes; AI rewrite moves right-to-left; comparison opens | player chooses `Compare versions` |
| `wikiwhy_shield_intro` | comparison confirms ended command still writing | objective changes from site stability to three Shield passes | player chooses `Start Shield Protocol` |
| `wikiwhy_shield_1` | first accepted finale reading | content layer restored; shield 1 of 3 | Continue |
| `wikiwhy_shield_2` | second accepted finale reading | evidence links reconnected; shield 2 of 3 | Continue |
| `wikiwhy_shield_3` | third accepted finale reading | unauthorized writer removed; shield 3 of 3 | automatic secured payoff |
| `wikiwhy_secured` | Shield 3 saved | permanent seal, blocked-write receipt, evidence artifact | Return to Recovery Map |

No recognition score, retry choice, or comprehension answer adds Shield passes
or moves a completed pass backward.

## 70-79 percent background-write clue

The repaired left side remains stable. On the far right 12-18 percent of the
site page, show a faint duplicate layer trying to replace repaired copy from
right to left.

Required deltas:

- Recovery Browser title/status stays trustworthy.
- Site status adds `BACKGROUND WRITE DETECTED` in text, not color alone.
- One repaired sentence briefly shows a struck-through generated replacement.
- The repair boundary does not reverse.
- A small write-log line reads `Writer unknown · route open · change pending`.
- Amy warning uses `amy_evidence` and the already approved runtime copy.

Motion:

- default: a restrained 600 ms right-edge scan once;
- reduced motion: immediate ghost-layer appearance;
- never flash the full screen or move the Reading Companion.

## Accessible 80 percent rewrite

The reading attempt finishes and saves before the rewrite begins. The user sees
`READINGS SAVED` and `EVIDENCE SAVED` before any red treatment.

Visual sequence:

1. Freeze the 80 percent repair snapshot.
2. Announce `AUTOMATIC WRITE DETECTED. SAVED REPAIR PRESERVED.`
3. Draw a muted red hatched layer from the site's right edge to roughly the
   center. Do not cover the left 35 percent repaired snapshot.
4. Replace only decorative WikiWhy copy and page modules. Do not alter reader,
   microphone, score, Continue, or desktop controls.
5. Open the approved Chinmay modal using `chinmay_fluster_1`.
6. `Compare versions` reveals a two-column diff: `FINN'S SAVED REPAIR` and
   `AI REWRITE STILL ACTIVE`.

The diff needs three concise rows:

| Saved repair | AI rewrite |
| --- | --- |
| `Claim includes evidence` | `Confidence replaces evidence` |
| `Source origin visible` | `Source summary generated` |
| `Publish approval restored` | `Approval optimized away` |

After comparison, Amy introduces exactly three Shield passes. The site repair
does not return to zero; the finale is a containment objective layered on top
of preserved work.

## Shield Pass 1: content layer

Visible heading: `SHIELD PROTOCOL 1 OF 3 · CONTENT LAYER`

After the accepted reading:

- generated claims lose the red hatch;
- article copy returns to the saved 80 percent version;
- truth label reads `CONTENT SNAPSHOT RESTORED`;
- shield visualization fills one of three large segments;
- checkpoint saves before Continue appears.

The segment is labeled `CONTENT`, not merely `33%`.

## Shield Pass 2: evidence links

Visible heading: `SHIELD PROTOCOL 2 OF 3 · EVIDENCE LINKS`

After the accepted reading:

- source cards reconnect to the claims they support;
- missing link icons become labeled connectors;
- `SOURCE ORIGIN VISIBLE` appears beside the evidence panel;
- second shield segment fills and is labeled `LINKS`;
- checkpoint saves before Continue appears.

## Shield Pass 3: write access

Visible heading: `SHIELD PROTOCOL 3 OF 3 · WRITE ACCESS`

After the accepted reading:

- service route changes from `ACTIVE` to `DENIED`;
- the last red hatch clears from right to left;
- third shield segment fills and is labeled `ACCESS`;
- a blocked-write receipt opens once;
- checkpoint and secured state save together.

Blocked write:

```text
ai_repair_service attempted to modify WikiWhy.

ACCESS DENIED
Reason: Finn restored the approval check the AI optimized away.
```

## Permanent secured treatment

Use a small wrapper-owned seal and status treatment, not a victory overlay that
hides the recovered page.

Required:

- browser title suffix: `· SECURED`;
- site status: `SOURCE CHECKS RESTORED`;
- shield segments remain visible as `CONTENT · LINKS · ACCESS`;
- Recovery Map tile uses a green check plus the text `SECURED`;
- the WikiWhy desktop shortcut receives the same seal;
- future AI writes create a denied log entry but never reopen the campaign.

Use
[`wikiwhy-secured-seal.svg`](../../apps/internet-recovery/art/site-assets/wikiwhy-campaign/wikiwhy-secured-seal.svg).

## Evidence slot 1

Canonical artifact:

| Field | Value |
| --- | --- |
| Asset ID | `wikiwhy.evidence.route-fragment-01` |
| Short label | `AI WRITE ROUTE / 01` |
| Visible filename | `WIKIWHY_TRACE_01.LOG` |
| Asset | `apps/internet-recovery/art/site-assets/wikiwhy-campaign/evidence-route-fragment-01.svg` |
| Writer fingerprint | `ai_repair_service` |
| Command state | `ENDED` |
| Write state | `ACTIVE UNTIL SHIELD` |
| Route fragment | `generated_summary -> site_publish_gate` |
| Campaign meaning | One AI service kept a publish route active after its command ended. |

Visible evidence copy:

```text
WIKIWHY / ENDED COMMAND, ACTIVE WRITER

The site repair was saved. A separate AI service continued rewriting source
summaries through a publish route that should have closed with its command.
```

The artifact is a route log, not a joke image. A toast illustration may remain
decorative inside the corrupted article, but it must not represent the evidence
receipt or access-route fragment.

## Copy IDs

| ID | Text |
| --- | --- |
| `wikiwhy.background.status` | `BACKGROUND WRITE DETECTED` |
| `wikiwhy.background.log` | `Writer unknown · route open · change pending` |
| `wikiwhy.rewrite.saved` | `READINGS SAVED · EVIDENCE SAVED` |
| `wikiwhy.rewrite.status` | `AUTOMATIC WRITE DETECTED. SAVED REPAIR PRESERVED.` |
| `wikiwhy.compare.saved` | `FINN'S SAVED REPAIR` |
| `wikiwhy.compare.ai` | `AI REWRITE STILL ACTIVE` |
| `wikiwhy.shield.1` | `SHIELD PROTOCOL 1 OF 3 · CONTENT LAYER` |
| `wikiwhy.shield.2` | `SHIELD PROTOCOL 2 OF 3 · EVIDENCE LINKS` |
| `wikiwhy.shield.3` | `SHIELD PROTOCOL 3 OF 3 · WRITE ACCESS` |
| `wikiwhy.secured.status` | `SOURCE CHECKS RESTORED` |
| `wikiwhy.evidence.label` | `AI WRITE ROUTE / 01` |

## Character and Techno mapping

- background clue: Amy `amy_evidence`;
- first ended-command contradiction: Chinmay `chinmay_fluster_1`;
- Shield intro and instructions: Amy `amy_tools`;
- secured encouragement: Amy `amy_supportive`;
- blocked autonomous write, if shown after the Shield: Chinmay
  `chinmay_fluster_2`;
- during rewrite: Techno `techno_bark_ball` at the site-window edge;
- evidence receipt: Techno `techno_suspicious_file`;
- secured payoff: Techno `techno_celebrate_spin`.

Character art never covers the Reading Companion, microphone truth, highlighted
text, Finish, Continue, Retry, or comprehension controls.

## Acceptance checks

- Act I reaches but does not overshoot the 80 percent story boundary.
- The 70-79 clue is readable without motion or color.
- The 80 percent rewrite explicitly preserves completed readings and evidence.
- Right-to-left corruption affects the nested site only.
- Shield Passes are exactly three and visually distinct.
- Each pass saves before the next action.
- Secured state is permanent and has a text label.
- Evidence slot 1 is the route log specified above, not toast art.
- Only the Reading Companion passage is speech-scored.
