# Simulated multi-persona screen-review experiment — first three sequences

Date: 2026-08-16  
Status: **simulation only; not user research and not a design-approval record**

## Question tested

Does a simulated teen/parent review of the actual rendered sequences find useful
issues that Chinmay and mechanical QA have not already found?

The answer from this trial is **yes, but only modestly**. The pass found two
cross-site continuity/legibility issues and one small copy ambiguity worth
fixing. Most other comments either repeated Chinmay's existing decisions,
requested intentionally deferred work, or conflicted with the approved lesson.

## Material reviewed

The reviewers inspected the exported screens in sequence before consulting the
contracts. The contracts were then used only to distinguish an actual visual
defect from an intentionally deferred feature.

- WikiWhy: `wikiwhy-complete-state-v3_p1.png` through `_p19.png`,
  `wikiwhy-complete-state-master-v3.svg`, and
  `WIKIWHY_COMPLETE_STATE_LEDGER_2026-08-15.md`.
- Spotty-Fi: `spotty-fi-anchor-v1_p1.png` through `_p13.png`,
  `spotty-fi-anchor-master-v1.svg`, and
  `SPOTTY_FI_PRODUCTION_CONTRACT_2026-08-15.md`.
- Amaze-On: `amaze-on-anchor-v1_p1.png` through `_p15.png`,
  `amaze-on-anchor-master-v1.svg`, and
  `AMAZE_ON_PRODUCTION_CONTRACT_2026-08-15.md`.
- Shared gates: `SCREEN_SEQUENCE_VISUAL_QA_STANDARD_2026-08-15.md` and
  `INTERNET_RECOVERY_SHARED_VISUAL_SYSTEM_2026-08-15.md`.

No web research was used. No site design was modified.

## Simulated lenses

These are deliberately varied **simulations**, not recruited people.

| Simulated persona | Primary test |
| --- | --- |
| Playful/impatient teen, 14 | Can I identify the joke, the broken thing, and the latest repair in about ten seconds? |
| Cautious teen, 14 | Does the situation feel safe and recoverable without punishment or shame? |
| Analytical teen, 15 | Does each repair visibly follow from the lesson, or does the page change for unexplained reasons? |
| Practical/traditional parent | Is there a concrete habit to discuss without turning the game into an anti-business lecture? |
| Progressive/media-literacy parent | Does the game reveal structural incentives while preserving teen agency and avoiding blame? |

Political/value differences were applied only where commerce, platform
incentives, or environmental claims made them relevant.

## Screen-grounded result summary

| Site | Immediate read | Humor | Lesson clarity | Repair causality | Emotional safety | Parent discussion value |
| --- | --- | --- | --- | --- | --- | --- |
| WikiWhy | Strong: the black-and-white claim, `USER FACTS ARE ALWAYS RIGHT`, and red source failures establish the problem immediately. | Strong: `JUST TRUST ME`, `AI CONFIDENCE 10,000%`, and the sandwich citation make the over-fix legible without menace. | Strong: sources, History, and careful wording remain distinct. | Strong: the six first repairs and three locks each have a visible target. | Low concern. The dog topic and nonpunitive recovery feel approachable. | Strong: the secured screen supports a concrete discussion about how to check a claim. |
| Spotty-Fi | Moderate-to-strong: anonymous art and `CREATOR PROFILE NOT FOUND` are clear, but the smallest credit lines carry much of the lesson. | Strong: Auto as every artist, infinite `OPTIMAL SONG`, and maximum volume are memorable. | Strong at the bookends; weaker during the first repair run because credit, choice, artist identity, and track identity return in a counterintuitive order. | Mixed: several early frames change small labels in different regions, so a viewer cannot always name the one thing just repaired. The lock-in run is clearer. | Low concern. No failure or safety framing is punitive. | Strong if the creator/credit text is readable: it prompts discussion of who made a song and how discovery should work. |
| Amaze-On | Strong: three paid golden boots plus one paid flimsy shoe make distorted rank immediately visible. | Strong: escalating paid-placement labels and the $29,998.03 Auto-cart are the clearest jokes of the three sequences. | Strong: paid rank, review context, fit, delivery/waste, available choices, and permission remain distinguishable. | Strong: small filters return before the dominant re-ranking; the final permission lock visibly clears the red cart. | Mild tension only: `SHIPPING NOW` resembles a real purchase, but the impossible shoes, exaggerated total, `AUTO-CART`, and companion line `Finn did not approve these orders` keep it in parody. | Strong: both parent lenses found concrete prompts about ads, reviews, needs, waste, and asking before buying. |

## Incremental actionable findings

Only findings that were new enough to justify revision work are listed here.

### P1 — Auto is not yet one continuous character across the three sequences

**Convergence:** all five simulated lenses.  
**Evidence:** WikiWhy's popup headers and final receipt identify a generic `AI`
and use a square `AI` placeholder, while Spotty-Fi and Amaze-On repeatedly name
`AUTO` as the over-fixing actor. Seen as one campaign, this reads as two
different systems rather than one eager character learning from Finn.

**Action:** during the already-deferred dialogue/character-tile pass, change the
WikiWhy speaker identity to `AUTO` and use the reviewed Auto tile. Do not reopen
the WikiWhy site composition or exact dialogue merely to resolve this.

### P1 — lesson-bearing evidence is the smallest type on two sites

**Convergence:** all three teen simulations and the practical-parent simulation.  
**Evidence:** Spotty-Fi's contributor roles, About line, and related-work line
are approximately 11–12 px while large album art dominates the page. Amaze-On's
fit, durability, review-history, and delivery/waste evidence is similarly much
smaller than the product names and prices. Those details are not decorative;
they are the evidence the lessons ask Finn to notice.

**Action:** before runtime freeze, run a lesson-evidence legibility pass at the
actual 1440 × 900 play size. Enlarge only the essential credit/comparison lines
and remove or compress secondary copy if necessary. This is not a request to
enlarge every label or redesign either composition.

### P2 — Spotty-Fi's initial search prompt has an unclear speaker

**Convergence:** playful/impatient and analytical teen simulations.  
**Evidence:** the corrupted search field says `LISTEN TO WHAT WE WANT`. Without
dialogue, `we` could mean Finn and friends rather than the platform choosing for
him. The super-corrupted `AUTO ALREADY CHOSE EVERYTHING` communicates agency
loss much more directly.

**Action:** in the later microcopy pass, replace the initial prompt with one
short platform-voiced line whose subject is unambiguous, such as `PLAY WHAT WE
PICKED FOR YOU`. Preserve the current, stronger Auto-overfix line.

## Useful confirmation, but not incremental feedback

These observations support current decisions and should not create new work.

- **WikiWhy's sequence works.** All simulated lenses could identify the three
  final protections—supporting sources, visible History, and careful wording—by
  looking at the screens. The Auto over-fix is more bluntly wrong than the
  opening and does not read as evil.
- **Amaze-On does not say “budget is bad.”** The repaired page includes `Great
  Value`, keeps the cheap option visible with disclosed flaws, and makes both
  distorted extremes paid. Both parent lenses read the target as paid rank and
  missing information, not price level.
- **Amaze-On's final permission repair lands.** Keeping the red `AUTO-CART (4)`
  visible while the first four locks turn green gives `ASK BEFORE BUYING` a
  large, understandable final consequence.
- **Spotty-Fi's volume joke is useful but secondary.** It makes the loss of user
  choice instantly visible. Because it is the last lock, it does not need to be
  removed; the final reflection should simply name artists and credits before
  volume.
- **Red/green progression is comprehensible.** The screens pair color with
  labels, borders, checks, hatching, and meters. No simulated lens depended on
  color alone to understand the basic state.
- **All three are nonpunitive.** Nothing in the rendered sequences removes
  reading work, blames Finn, or requires a bad score to be replayed.

## Generic or currently untestable feedback

These comments are not actionable findings from this packet.

- “Add more animation, Techno reactions, or character jokes.” Character motion
  and popup polish are intentionally deferred and cannot repair unclear site
  logic.
- “Make the passages shorter/funnier” or “the mission may feel too long.” The
  current Reading Companion contains layout copy rather than the final passage,
  quick check, results, or transition timing. Static frames cannot test reading
  pacing.
- “Make every screen explain the lesson.” That would undermine Finn noticing
  the visual problem before Amy explains it and would turn the sites into
  worksheets.
- “Add a discussion prompt.” All three missions already end in the separate
  teach-Auto reflection flow; Spotty-Fi and Amaze-On simply do not render that
  deferred layer yet.

## Suggestions that conflict with Chinmay's decisions — do not adopt

- A cautious simulation requested a persistent `NO REAL PURCHASE` warning on
  Amaze-On. This would flatten the joke and conflicts with Chinmay's instruction
  not to over-explain that a fictional game is fictional. The fantasy products,
  Auto-cart label, exaggerated total, and `Finn did not approve` line are enough
  for this candidate; real-player testing can revisit anxiety later.
- One parent simulation preferred removing the maximum-volume joke so Spotty-Fi
  stayed exclusively about creator credit. Chinmay explicitly added volume as a
  fourth user-choice lock. Keep it secondary rather than deleting it.
- The analytical simulation questioned whether Amaze-On should label any result
  `Best Match`. Chinmay explicitly chose the repaired `Best Match` / `Great
  Value` contrast while also requiring `NOTHING SELECTED`, `Cart (0)`, visible
  paid placements, and user choice. The current screen satisfies that boundary.
- The impatient simulation would shorten WikiWhy's six-step first repair run.
  The six targets are already tied to the planned reading portfolio and end with
  the largest History/source payoff. Static-screen impatience is not sufficient
  evidence to override the passage count.

## Is this review step worth keeping?

**Yes, in reduced form.** The full six-person historical panel is too noisy for
every visual iteration. For future site packets, run the persona pass only after
mechanical visual QA and before Chinmay's review, using:

1. one playful/impatient teen simulation for the ten-second read and humor;
2. one cautious teen simulation for emotional safety and recoverability;
3. one analytical teen simulation for repair-to-lesson causality;
4. one parent discussion-value lens, selecting practical or media-literacy
   emphasis based on the site's actual lesson.

Report only:

- screen-specific P1/P2 findings supported by at least two lenses;
- one-lens findings only when they identify a concrete safety or accessibility
  problem;
- conflicts with Chinmay's decisions in a separate, explicitly rejected list.

Do not ask simulated reviewers to settle copy taste, art taste, politics, final
pacing, or approval. A four-lens reduced pass should take place once per complete
site sequence, not after every intermediate render. It is a preflight check, not
a substitute for Chinmay or real teen/parent playtesting.
