# WikiWhy complete state ledger

Status: **full narrative and visual-flow candidate for Chinmay review; not frozen
for build**

This ledger supersedes older WikiWhy sequencing and dialogue summaries. It does
not authorize runtime implementation or freeze final passage prose.

## Mission contract

- **Lesson:** A collaborative encyclopedia can be useful, but a user-generated
  claim is not trustworthy merely because it sounds confident. Important claims
  should connect to sources that actually support them, edit history should stay
  visible, and wording should match what the evidence can establish.
- **Anchor topic:** Dog color vision. The opening claim is `DOGS SEE ONLY BLACK
  AND WHITE`.
- **Passage count:** Nine total reading passages: six Phase 1 repairs and three
  Act 2 lock-ins.
- **Reflection:** A separate, unscored write-up of about 200 words. It is not a
  tenth passage and does not affect reading scores or mission completion.
- **Primary play surface:** Reading Companion on the right. The left site is a
  layered storyboard that changes after each passage result.
- **Characters:** Finn is the unseen player. Amy and Chinmay appear only in
  temporary pop-ups. Techno remains a small persistent desktop pet; the article
  may also use the reviewed Techno likeness as an editorial illustration.

## Progress contract

`PASSAGE PROGRESS` and `SOURCE REPAIR` are independent.

- Passage progress begins empty whenever a passage loads, follows Finn through
  that one reading, and completes when he chooses `FINISH NOW`.
- A brief comprehension check occupies genuine score-processing time.
- Results appear in the Reading Companion. The corresponding site delta and
  `SOURCE REPAIR` update then occur once.
- `RETRY` may produce a new score but cannot apply the same site delta twice.
- `NEXT PASSAGE` loads the next passage and resets passage progress.
- `SOURCE REPAIR` reaches 100% after Passage 6. The midpoint override then
  destroys that apparent repair and replaces the meter with the three-part
  `LOCK IN THE REPAIR` panel.

## Phase 1 state ledger

Percentages are player-facing progress, not passage counts.

| State id | Trigger and reading purpose | Quick check while results process | Left-side visual delta after results | Source repair | Persistent/invariant elements |
| --- | --- | --- | --- | ---: | --- |
| `WW-1A-00` | Mission load. No passage completed. | None. | Article opens with `DOGS SEE ONLY BLACK AND WHITE`, `USER FACTS ARE ALWAYS RIGHT`, `100% TRUE — NO QUESTIONS`, grayscale Techno with reading glasses, decorative `[?]` markers, crossed-out cautious wording, hidden History, zero sources, and red hatch corruption. | 0% | Window geometry, article columns, search, desktop, Reading Companion, taskbar, and Techno's desktop anchor. |
| `WW-1A-01` | Passage 1: identify what the article currently claims and how presentation creates false certainty. | `Which part makes the claim sound settled before readers see evidence?` The feedback points to `100% TRUE — NO QUESTIONS`. | The certainty banner becomes neutral `CLAIM UNDER REVIEW`. The headline remains wrong, the spectrum remains absent, citations remain broken, and History remains disabled. | 17% | No component moves. Only the certainty treatment changes. |
| `WW-1A-02` | Passage 2: accessible science explanation of canine cone cells and color range. | `Which colors do dogs generally distinguish more clearly?` Expected concept: blue and yellow rather than only black and white. | Headline becomes `DOGS SEE MORE THAN BLACK AND WHITE`. The grayscale article illustration is replaced by the labeled limited-color spectrum module. | 33% | Citation markers, crossed-out qualifier, History, and source area remain visibly corrupted. |
| `WW-1A-03` | Passage 3: research-summary language that distinguishes a finding from absolute proof. | `Which wording best matches evidence that has limits?` Expected concept: `evidence suggests`, `may`, or `often`. | One paragraph regains `evidence suggests`, `may`, and `often`; the red strike-through over careful language disappears. One red hatch region clears. | 50% | Headline, spectrum, and fixed shell do not move. |
| `WW-1A-04` | Passage 4: interpret a concise comparison chart and its caption. | `What should a useful chart label tell the reader?` Expected concept: what is compared and what the colors mean. | The fake `Confidence: 100% / Evidence: N/A` box becomes a labeled `DOG COLOR VISION` comparison card with an honest caption and no fake certainty score. | 67% | The spectrum colors and article body remain unchanged. |
| `WW-1A-05` | Passage 5: read a bibliographic/source record and connect it to a claim. | `What makes a citation useful here?` Expected concept: it identifies a checkable source and sits beside the claim it supports. | Citation sockets appear beside the major claims. The References area gains readable source cards/lines, dates, and authors. The sources are visible but not yet permanently protected. | 83% | History remains the final disabled component. |
| `WW-1A-06` | Passage 6: read a short fictional edit-history excerpt showing how wording changed. | `Why would a reader open History?` Expected concept: to see what changed, when, and why. | History returns as a legible tab. The final red hatching clears. Citations, cautious wording, spectrum, chart, and edit context appear together in the fully repaired composition. | 100% | The page holds for a short false-completion beat before any popup. |

Reading scores never gate these changes. A wrong quick-check response receives a
brief explanation and the same visual repair.

## Phase 1 repaired composition

The false-completion state must be satisfying enough that Chinmay's override
feels like a real loss.

- Headline: `HOW DOGS SEE COLOR` or another concise, appropriately qualified
  reviewed headline.
- Lead: clearly rejects the black-and-white myth without claiming that every
  detail is settled.
- Spectrum: blue/yellow emphasis with red/green shown as less distinct.
- Claims: key sentences have authored citation markers connected to the correct
  source line.
- History: visible, usable-looking, and not hidden behind decoration.
- Meter: `SOURCE REPAIR 100%` with a check/pattern cue in addition to color.
- Corruption: no red hatch, red question marks, crossed-out evidence, or disabled
  controls remain.

## Midpoint override ledger

These states consume no passages. Pop-ups are modal overlays and disappear after
their single action; character portraits never become persistent directions.

| State id | Background state | Overlay and action | Purpose / next state |
| --- | --- | --- | --- |
| `WW-M-01` | Phase 1 repaired composition at 100%. | **Chinmay popup**, eager `I fixed it` expression. Action label remains deferred. | Reveals that he has been running a parallel fix and gave the AI one careless direction: remove all uncertainty because it is more efficient. |
| `WW-M-02` | Repaired page dims slightly; a dial-up/processing treatment may briefly appear. | **AI system popup**, using the later approved AI character tile. Action label remains deferred. | The AI interprets Chinmay literally: remove sources, edit history, qualifiers, and other cautious wording. |
| `WW-M-03` | Act 2 super-corrupted composition appears in one decisive authored transition. | No character popup for one short visual beat. | Lets Finn see the damage before it is explained. |
| `WW-M-04` | Super-corrupted composition remains visible. | **Amy popup**, concerned/supportive expression. Button: `LOCK IN THE REPAIR`. | Names the misunderstanding and introduces the three permanent locks. |
| `WW-M-05` | Amy closes. | Three-item lock panel appears with all locks open. Passage 7 becomes available. | Begins Act 2 without adding a left-side puzzle. |

### Midpoint popup script placeholder

The following lines are **layout-length and voice candidates only**. They are
not approved player-facing copy. Amy, Chinmay, and AI wording will receive a
manual human read-through after the site-state sequence is visually sound.

**Chinmay — revised intent, not final copy**

> Don't worry, I already fixed it in the background. I told the AI to remove all
> uncertainty. Much more efficient.

**AI**

> BACKGROUND FIX COMPLETE. REMOVED: SOURCE CLUTTER, EDIT HISTORY, AND
> UNCERTAINTY. NEW RULE: IF A FACT SOUNDS CONFIDENT, IT IS TRUE. JUST TRUST ME.

**Amy**

> Okay. It learned that sounding certain matters more than showing support. We
> need to lock three things so it can't erase them again: match each claim to the
> evidence, keep the edit history visible, and say only what the evidence
> supports.

Only the dramatic function is fixed for this visual pass: Chinmay is
enthusiastically careless, the AI is severe and literal, and Amy is concise and
constructive. Exact jokes, sentence rhythm, button labels, and popup timing are
deferred to the dedicated dialogue review.

Character-tile intent is also deferred but recorded: technical Amy for the
repair plan, celebratory Amy for the secured state, eager idea/fix Chinmay at the
midpoint, and flustered/sheepish Chinmay at realization. Reuse the reviewed
expression sheets rather than generating new likenesses.

## Act 2 super-corrupted composition

Phase 2 must be more bluntly wrong than the opening, not merely a redder copy.

- Giant rule: `JUST TRUST ME`.
- Article headline: an absurd absolute such as `DOGS SEE EXACTLY WHAT THE AI
  SAYS`.
- AI badge: `AI CONFIDENCE 10,000%`.
- Qualifiers: `may`, `often`, and `evidence suggests` are removed again.
- Citations: visible lines deliberately attach to the wrong claims. Their
  mismatch must be visually obvious without requiring a draggable puzzle.
- History: the restored History tab is replaced by a second `TRUST ME` control.
- Spectrum: remains visible but is relabeled as total proof, showing that a real
  visual can be misrepresented by bad wording.
- Source repair meter: replaced by `LOCK IN THE REPAIR` with three open locks:
  `MATCH CLAIMS TO SOURCES`, `KEEP HISTORY VISIBLE`, and `USE CAREFUL WORDING`.
- Corruption style: bold red hatching, snapped/misaligned citation lines, and AI
  stamps. Do not shift the shell, columns, or Reading Companion.

## Act 2 lock ledger

| State id | Trigger and reading purpose | Quick check while results process | Permanent left-side lock after results | Lock panel |
| --- | --- | --- | --- | --- |
| `WW-2A-00` | Amy closes the recovery-plan popup. | None. | Super-corrupted baseline holds. | 0 of 3 visibly locked; player-facing copy uses names/checks rather than a hidden passage total. |
| `WW-2A-01` | Passage 7: compare one exact claim with two candidate source excerpts. | `Which source actually supports this sentence?` Finn chooses the excerpt that addresses dog color vision at the same level of certainty. | Citation lines animate/snap from the wrong sentences to the authored correct claims. `MATCH CLAIMS TO SOURCES` closes with a lock/check cue. | 1 lock secured. |
| `WW-2A-02` | Passage 8: compare two article versions and their timestamps/edit notes. | `What can the history tell a reader that the current page cannot?` Expected concept: what changed, when, and why. | The false `TRUST ME` tab changes back to `History`; a compact revision list becomes visible. `KEEP HISTORY VISIBLE` closes. | 2 locks secured. |
| `WW-2A-03` | Passage 9: synthesize what is known and what remains limited or unknown. | `Which final sentence says no more than the evidence supports?` Finn selects or completes cautious wording. | Absolute AI wording becomes accurate qualified copy; `AI CONFIDENCE 10,000%` disappears; `USE CAREFUL WORDING` closes. The clean Phase 1 repaired composition returns with a secured treatment. | 3 locks secured. |

## Completion and reflection ledger

These states consume no reading passage.

| State id | Background state | Overlay / interaction | Exit |
| --- | --- | --- | --- |
| `WW-C-01` | All three locks close; clean secured page is visible. | **Amy success popup.** | Button: `REVIEW THE FIX`. |
| `WW-C-02` | Secured page remains. | **Chinmay realization popup**, sheepish/flustered rather than defeated. | Button: `FAIR POINT`. |
| `WW-C-03` | Secured page remains on the left. | **Amy reflection popup** introduces the final teaching task. | Button: `TEACH THE AI` opens the reflection composer in the Reading Companion. |
| `WW-C-04` | Secured page remains; no new site change. | Finn writes about 200 words. The composer may show a soft target, save locally, and allow editing; prose quality is not scored. | `SEND INSTRUCTIONS` becomes available without requiring an exact word count. |
| `WW-C-05` | Secured page remains. | **AI receipt popup** summarizes the learned instruction only after Finn submits. | Button: `BACK TO RECOVERY DESKTOP`. |
| `WW-C-06` | Recovery Desktop. | WikiWhy's site icon/card shows a secured state and the campaign preserves the completed reflection according to the later-approved privacy/retention design. | Finn chooses another site. |

### Completion popup script placeholder

These lines are also **layout-length and voice candidates only**, not approved
player-facing copy. The sequence and intent can be reviewed independently from
the exact language.

**Amy — success**

> That did it. The page now shows what it knows, what supports it, and how it
> changed. Those fixes are locked in.

**Chinmay — realization**

> Oh. I made it easier for the page to sound right, not easier for anyone to
> check whether it was right. I guess “JUST TRUST ME” is not actually a citation.

**Amy — reflection prompt**

> Finn, what should we teach the AI so it doesn't make this mistake again? Write
> about what went wrong with the user-generated facts and how matching sources,
> visible edit history, and careful wording made the page more useful.

**AI — post-submission receipt**

> Thank you, Finn. Instructions saved: connect important claims to sources that
> support them, keep edit history visible, and use cautious wording when the
> evidence has limits. I will not replace evidence with confidence.

The receipt is a response to Finn's reflection, not a canned message shown before
he writes. Runtime wording may paraphrase Finn's submission, but it must not claim
that the model has permanently retrained itself outside the game.

## Visual-layer inventory

The production master should use fixed coordinates and reusable groups.

The Act 2 checklist is an independent overlay, not three redraws of the
super-corrupted site. Its lock controls move from open/red to secured/green
over the unchanged Act 2 background. When the final lock closes, the base site
swaps directly back to the exact authored repaired composition. A brief
all-three-locked beat may be shown before the checklist disappears.

### Shared throughout

- Recovery Desktop and taskbar
- WikiWhy and Reading Companion windows
- WikiWhy globe/wordmark, navigation, search, columns, and footer region
- persistent desktop Techno anchor, implemented as a separate topmost overlay
  so a later animated pet can move without shifting either window
- temporary popup window frame

### Phase 1 deltas

- certainty banner states
- headline/lead variants
- grayscale Techno editorial card and spectrum replacement
- qualifier strike-through/restoration
- fake certainty box and comparison-card replacement
- citation sockets/source lines
- disabled/restored History tab
- six site-meter fills plus 100% secured treatment

### Midpoint and Act 2

- Chinmay popup state from the reviewed expression sheet
- AI system popup and brief processing overlay
- Amy recovery-plan popup state from the reviewed expression sheet
- giant `JUST TRUST ME` rule and `AI CONFIDENCE 10,000%` badge
- wrong/correct citation-line overlays
- false `TRUST ME` tab and restored History layer
- three lock states plus secured composition

### Completion

- Amy success popup
- Chinmay realization popup
- Amy reflection prompt
- Reading Companion reflection composer
- AI receipt
- Recovery Desktop WikiWhy-secured badge

## WikiWhy-specific QA gates

Before visual approval:

1. Every passage result changes exactly one understandable left-side anchor.
2. `PASSAGE PROGRESS` can reset without moving `SOURCE REPAIR`.
3. A retry cannot advance `SOURCE REPAIR` or an Act 2 lock twice.
4. Phase 1 repaired has no red corruption residue.
5. The super-corrupted state is visibly different from the opening corruption.
6. The three Act 2 locks map one-to-one to citations, History, and wording.
7. Pop-ups use reviewed character likenesses and disappear when dismissed.
8. No popup or generated module changes the underlying window geometry.
9. The secured state exactly reuses the reviewed repaired composition rather
   than approximating it in a newly generated screen.
10. The reflection is requested only after the site is secured, and the AI
    receipt appears only after Finn submits.

## Review decisions requested

1. Approve or revise the nine-passage split: six Phase 1 repairs and three Act 2
   locks.
2. Approve or revise the Chinmay → AI → Amy midpoint **sequence and dramatic
   function**; exact wording is deliberately deferred.
3. Approve or revise the three lock concepts and provisional player-facing names.
4. Approve or revise the completion **sequence**: repair confirmation → Chinmay
   realization → Amy teaching prompt → Finn reflection → AI receipt. Exact
   dialogue is deliberately deferred.
5. Confirm the inferred retry behavior: optional retries rescore the passage but
   never repeat a site delta or Act 2 lock.

Passage manuscripts, quick-check answer wording, reflection storage/retention,
final popup timing, and exact character/AI dialogue remain separate authoring
and implementation reviews.
