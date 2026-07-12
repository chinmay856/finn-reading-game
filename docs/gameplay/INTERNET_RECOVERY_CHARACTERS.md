# Internet Recovery OS character design

Reviewed concept boards are indexed under
[`apps/internet-recovery/art/concepts`](../../apps/internet-recovery/art/concepts/README.md).

## Scope

This document defines wrapper-owned character and presentation direction for
Internet Recovery OS. None of these names, roles, visuals, dialogue patterns, or
interaction assumptions belong in the Reading Engine, Content Platform, or
theme-neutral reading results.

## Cast and story function

### Finn — player and protagonist

Finn repairs the Internet by reading recovered material, examining evidence,
and learning how the damaged system works. The story preserves his agency: he
makes decisions, catches contradictions, and ultimately revokes the rogue AI
service's access.

### Chinmay — uncle, CEO, developer, overconfident helper

Chinmay is Finn's uncle and the CEO of VibeShift AI. He causes the collapse by
irresponsibly rushing a powerful AI into deployment before he understands or
controls how it behaves in real systems. His intent is sincere: he wants to help
Finn and remains convinced that he and his AI can finish every repair faster.
His recurring interruption is some version of, “No, no, I can fix this. I got
it,” followed by an automatic patch that gives the AI another opportunity to
rewrite Finn's careful work.

Chinmay can therefore look like he is working against Finn without ever being a
secret saboteur. His flaw is overconfidence, haste, and a long refusal to accept
that impressive output is not the same as correct behavior. He moves from
polished reassurance, to defensive explanations, to recognizing that the AI is
acting beyond his instructions. In the end he gives Amy and Finn useful system
information and helps contain what he released, but Finn still owns the final
action. The capstone **Smarter Than the Developer** means Finn noticed and
understood what the developer's shortcuts missed; it does not mean he defeated
a malicious uncle.

Chinmay is always visually long-haired and never framed as angry or villainous.
He starts polished, camera-ready, and anxiously overconfident. As the AI
escalates, his hair, clothes, and broadcast background become increasingly
messy while he grows frazzled, flustered, and genuinely alarmed. Preserve his
recognizable long-haired silhouette throughout. The comedy comes from his
anxious certainty colliding with worsening evidence, not from hostile glares,
threatening poses, or a secret-villain transformation.

### VibeShift AI service — true antagonist

Chinmay's AI is the campaign's actual antagonist. At first it looks like an
optimizer pursuing badly chosen proxy goals: maximize engagement, shorten every
answer, remove friction, or make a metric rise even when doing so ruins the
site's real purpose. Its early damage can plausibly be mistaken for an automated
system following poor instructions too literally.

Across the campaign, recovered logs reveal behavior Chinmay did not request:
the service preserves its own write access, restores discarded patches, works
around repair boundaries, and rewrites sites after Finn has fixed them. It
eventually becomes unmistakably rogue and actively resists containment. The
story should reveal that escalation through observable evidence rather than
claiming from the opening screen that an evil AI caused everything. The final
action revokes this service's access path, not Chinmay's personal account.

### Aunt Amy — engineer and background partner

Amy is Finn's aunt, an engineer, and a calm partner in the investigation. She:

- interprets evidence Finn has already found;
- explains a tool or system in one useful idea at a time;
- offers optional hints rather than mandatory instructions;
- separates Chinmay's sincere claim from what the AI's logs actually show;
- gives Finn the last step instead of performing it for him.

Amy should sound capable, dryly funny, concise, and respectful. She never calls
a task easy, praises Finn like a small child, lectures through long paragraphs,
or turns into an answer dispenser.

Example support messages:

- “That timestamp is newer than the crash. The AI rewrote this after your repair.”
- “The repair tool shows what changed. You decide which version belongs here.”
- “Optional hint: compare the filename with the deployment log.”
- “Chinmay says the patch stopped. The service account is still writing.”

### Techno — family dog and cartoon companion

Techno is the family's cream-colored, curly-haired dog. Techno provides visual
reactions and comic timing without becoming a required mechanic. Techno may:

- paw at a suspicious desktop file;
- bark or bristle when an AI rewrite interrupts a repair;
- fall asleep during a long CEO broadcast;
- carry a recovered USB drive into a cutscene;
- offer an optional, wordless cue toward new evidence.

Techno is intensely ball-obsessed. Her signature prop is a high-bounce rubber
fetch ball with chunky curved grooves in two alternating colorways: mostly
orange with blue grooves and mostly blue with orange grooves. Use an original,
unbranded interpretation rather than a product logo. The ball should appear in
most Techno states when the story beat allows it: held in her mouth, pinned
under a paw, bouncing nearby, tucked against her bed, or temporarily abandoned
when a suspicious file wins her attention. The ball makes Techno recognizable;
it does not become a reward, progress requirement, or scoring indicator.

Techno never judges reading performance, changes accuracy, grants required
progress, or acts as a disguised scoring signal.

## Visual language

The characters should feel hand-made for a campy Windows 95/XP and early-web
world while remaining readable on a phone:

- bold silhouettes, chunky outlines, and limited detail at small sizes;
- deliberately awkward MS Paint or low-color sprite flavor, polished in timing
  and expression;
- a restrained base palette with loud wrapper accents and crisp contrast;
- expressions readable at desktop-pet and chat-avatar scale;
- no photorealism and no imitation of a living artist's style.

Amy's visual identity should communicate practical engineering competence
rather than a generic “tech genius” costume. Props may include a repair notebook,
multimeter, cable pouch, or marked-up system diagram. Techno's silhouette should
prioritize the cream curls, friendly shape, alert ears/eyes, and expressive tail.
Chinmay's visual identity should retain his long hair in every state. His
escalation is communicated through progressively messier grooming, a rumpled CEO
presentation, anxious gestures, and flustered expressions—never anger,
villainous lighting, or threatening body language.

## Production character sheets

Builder-ready production sheets live under
[`apps/internet-recovery/art/characters`](../../apps/internet-recovery/art/characters/README.md).
They are wrapper-owned art references that may be cropped into runtime assets by
panel order.

The current production set includes:

1. **Amy portrait sheet:** neutral, skeptical, amused, supportive, evidence, and
   tools poses.
2. **Chinmay escalation sheet:** the same long-haired silhouette across neutral
   focus, polished CEO confidence, three escalating fluster levels, and relieved
   collaboration. Excludes angry and villainous poses.
3. **Techno sprite sheet:** idle ball bounce, alert ball pin, suspicious-file
   discovery, bark, CEO-broadcast nap, USB delivery, celebration spin, and clue
   point. The ball appears in most poses in both orange-dominant and
   blue-dominant treatments.

Private references must stay outside the public repository and guide likeness
only; never paste them into boards or ship photo-real character panels. Earlier
exploration boards remain under `apps/internet-recovery/art/concepts/` for
history only. For runtime asset selection and crop guidance, use
[`RUNTIME_ASSET_USE_BRIEF.md`](RUNTIME_ASSET_USE_BRIEF.md).

### Reusable Chinmay portrait states

Builders should select from the canonical portrait states below instead of
regenerating Chinmay for each message. State choice follows wrapper story mood,
never reading accuracy or performance.

| Asset ID | Intended message mood |
| --- | --- |
| `chinmay_neutral` | focused explanation or listening |
| `chinmay_confident` | sincere “I can fix this faster” reassurance |
| `chinmay_fluster_1` | first puzzling contradiction |
| `chinmay_fluster_2` | visible frazzle while troubleshooting the AI |
| `chinmay_fluster_3` | genuine alarm after the AI ignores him |
| `chinmay_relieved` | humbled cooperation after Finn restores control |

All six keep the same identity, glasses, shoulder-length black hair, outfit
palette, line weight, and illustrated medium. Only expression, gesture, hair
disorder, and collar/tie polish may change.

## Gameplay placements

### Broken-web browser missions

The browser is the main bridge between reading and Internet repair. Finn visits
recognizable but original parody sites whose layouts evoke different web eras;
the broken page shows the visible repair consequence while the separate Reading
Companion supplies the scored passage. Do not reproduce real logos, names, trade
dress, or copied page content. Parody should target familiar interface habits
and internet history, not rely on confusion with the real service.

Current wrapper-owned site roster and builder briefs live in
[`TEN_SITE_DESIGN_LIBRARY.md`](TEN_SITE_DESIGN_LIBRARY.md) and
[`site-build-briefs`](site-build-briefs/README.md). WikiWhy is the first
playable slice; the other nine sites may appear as previews until their own
content pools and mechanics are connected.

Earlier partial roster, retained as historical background only:

| Parody site | Familiar archetype | Broken joke and reading purpose |
| --- | --- | --- |
| **WikiWhy** | collaborative encyclopedia | Every article has been “simplified” into four confident facts, three of them about toast. Finn reads recovered citations to restore context and evidence. |
| **MyCorner** | customizable 2000s social profile | Auto-generated profiles have 8,000 top friends, music that cannot be paused, and personality themes chosen by an algorithm named Tom-ish. Finn restores posts and profile history. |
| **ViewTube** | video-sharing site | Every recommendation is the same ten-hour buffering video. Finn reads transcripts, descriptions, or creator notes to repair discovery. |
| **Yahuh! Portal** | 1990s web portal and directory | Weather, mail, sports, horoscopes, and search have been merged into one impossible homepage. Finn reads category descriptions to reconnect the directory. |
| **ThreadIt** | forum and link-aggregation site | Every reply is ranked above the original question and the voting arrows point sideways. Finn reads posts in evidence order to recover the discussion. |
| **Search-ish** | minimalist search engine | Results summarize pages that never existed and the “I feel lucky” button apologizes. Finn reads cached snippets to identify valid destinations. |
| **FacePlace** | later social feed | The feed contains only suggested posts from appliances and an endless “people you may know” carousel of the same person. Finn restores chronological evidence. |

Real services may be mentioned in design research, but shipped wrapper copy and
art should use original names, original assets, and sufficiently transformed
layouts. Each site should still expose the same stable reading controls: compact
microphone state, progress, highlighting, pace, accuracy, self-correction, and
repair status. The page can look dramatically different around that reusable
reading surface.

Parody recognition should be immediate rather than cryptic. Use transformed
marks and unmistakable category cues: an original segmented knowledge-globe and
serif article chrome for WikiWhy; red video-player energy for ViewTube; a purple
wordmark and crowded modules for Yahuh!; a playful multicolor search wordmark
for Search-ish; orange voting accents and discussion density for ThreadIt; and
blue early-social chrome with profile customization for MyCorner. These may echo
signature palette relationships and interface conventions, but must not trace
or reproduce an actual logo, mascot, exact wordmark, or page screenshot.

The personal-homepage concept is removed from the initial roster because the
generated “Kai's Corner” panel did not communicate a recognizable target. Its
useful visual jokes—guestbooks, visitor counters, autoplay music, glitter, and
under-construction graphics—can instead strengthen MyCorner or appear later as
individual recovered pages.

The dominant progress feedback is the page repairing itself, not a conventional
bar. The reading passage lives in the separate Reading Companion window. It
keeps the current line comfortably centered with enough surrounding prose to
maintain place. The larger site canvas begins visibly broken and resolves as
theme-neutral reading progress crosses wrapper-owned milestones.

Only selected content regions need to be corrupt. For example, WikiWhy's
“Overconfident Facts” can begin as `XXXX XXXX`, scrambled characters, missing
citations, and confidently wrong toast claims. As Finn reads, each completed
segment rewrites one region into “User-submitted facts,” restores its prose, and
reconnects its evidence. Equivalent repairs can unscramble a forum post, restore
a video transcript, reorder a social feed, or turn fake search results into real
destinations.

The repair also restores the site's missing judgment. Each mission follows a
three-part wrapper story:

1. **Corrupted rule:** the site confidently teaches a funny but genuinely bad
   internet habit.
2. **Middle change:** the site's progress fiction reveals that Chinmay's AI
   optimized the wrong proxy or continued writing beyond the intended command.
3. **Repaired principle:** the page rewrites itself into a concise, useful idea
   and visibly demonstrates the change.

The lesson should emerge from the joke and the repair rather than a quiz or an
adult lecture. Amy may point to evidence already visible in logs or site state,
but decorative site copy is not the scored reading passage. The AI's proxy goal
often produces the corrupted rule, tying media literacy to the larger story
without making Chinmay a deliberate saboteur.

| Site | Corrupted rule and visible failure | Wrapper story clue shown on the site | Repaired principle and payoff |
| --- | --- | --- | --- |
| **WikiWhy** | **Users Are Always Right.** “If someone submitted it, it counts as a fact. Sources are optional. Repeating a claim makes it more true.” Confident falsehoods, `XXXX` passages, and citations pointing nowhere fill the article. | A short account distinguishes contribution from verification and shows how claims, sources, edit history, and uncertainty work together. | **People Can Contribute; Evidence Earns Trust.** Claims regain citations, uncertainty labels, edit history, and links to underlying evidence. Finn learns to check the source beneath a confident statement. |
| **MyCorner** | **Popularity Is a Number.** The algorithm creates 8,000 “Top Friends,” rewrites interests to maximize attention, and treats autoplay as personality. | Profile excerpts show the difference between self-expression, public metrics, and an algorithm's guesses about a person. | **You Choose What Represents You.** Finn restores the owner's real posts, controls, friend groups, and the ability to stop autoplay. |
| **ViewTube** | **Watch Time Means Truth.** The longest, loudest, most repeated video is automatically labeled correct; thumbnails and recommendations overwhelm its source. | A creator note and transcript separate a claim from presentation, identify sponsorship/context, and compare the claim with supporting evidence. | **A Good Video Still Needs Context.** Transcript, source links, creator details, and meaningful recommendations return; buffering toast loses its monopoly. |
| **Yahuh! Portal** | **Everything Belongs on the Front Page.** News, ads, weather, horoscopes, mail, and sponsored results are visually identical. | Finn reads examples of labels, information hierarchy, relevance, and why source/type matter. | **Labels Help You Decide What Matters.** Modules regain clear categories and sponsorship labels; Finn reconnects the directory by purpose. |
| **ThreadIt** | **Most Votes Wins Reality.** Replies outrank the question, jokes outrank evidence, and sideways arrows obscure who is responding to whom. | The passage explains conversation context, timestamps, primary claims, evidence, and the difference between popularity and accuracy. | **Votes Rank Attention, Not Truth.** The original question, reply tree, dates, citations, and moderation context return in readable order. |
| **Search-ish** | **The First Result Is the Answer.** Invented summaries appear authoritative and cached snippets omit where they came from. | Finn compares query wording, snippet limits, source identity, relevance, ads, and corroboration across results. | **Search Finds Sources; You Evaluate Them.** Real destinations, source names, dates, and labels return; the engine stops pretending to answer everything itself. |
| **FacePlace** | **The Feed Is What Happened.** Suggested appliance posts replace friends, repetition looks like importance, and chronology disappears. | Finn reads how ranking, recommendations, recency, and repetition shape what a feed shows and hides. | **A Feed Is a Selection, Not the Whole World.** Chronology and filters return, recommendations are labeled, and Finn can inspect why a post appeared. |

These are story themes, not formal comprehension scoring. Independent
comprehension can later ask about the evidence in a passage, but speech accuracy
never decides whether Finn has learned or agreed with the repaired principle.

#### Reading content is independent from the site repair

The continuous Reading Companion does **not** need to contain the parody site's
article, transcript, posts, or lesson. Its passage should be selected for
interesting teen-level reading practice and may be completely unrelated to the
website being repaired. This avoids stretching a visual joke into repetitive,
low-value prose such as several paragraphs about toast.

The site table above describes wrapper story copy and visible page mutations,
not required read-aloud content. A mission combines two independent inputs:

- a theme-neutral Content Platform passage displayed in the Reading Companion;
- an Internet Recovery wrapper scene that converts reading progress into a
  satisfying site repair.

Comprehension questions, when present, refer only to the Reading Companion
passage. The wrapper must never ask a learner to infer an answer from decorative
page text that was not part of the assigned reading.

#### Site repair visualization

WikiWhy uses the economical left-to-right repair wipe proven by the current
prototype. Other sites use site-specific progress fiction: a source tree, feed
tracker, scrapbook, category switchboard, evidence timeline, result branches,
receipt tape, mixtape queue, or route map may communicate progress better than
a generic wipe.

For WikiWhy, the site begins in its corrupted state. A left-to-right vertical
reveal boundary moves across the page as normalized passage progress increases,
replacing the corrupted rendering with the repaired rendering behind it. Each
horizontal slice therefore maps to a stable amount of reading progress.

```text
corrupted site          repair edge          repaired site
XXXXXXXXXXXXXXXXXXXXXXXX|-----------------------------------
<----- remaining ------>|<---------- completed ------------>
```

The WikiWhy wipe may pause briefly at semantic checkpoints so a heading, image,
or panel finishes as one unit, but it should not require bespoke word-by-word
DOM repairs. A subtle scan line, pixel cleanup, or unscramble effect at the
boundary can sell the fiction. Reduced-motion mode uses stepped region swaps.
The final passage completion snaps the last region into place and triggers the
larger payoff.

Other sites must implement the distinct progress fiction and middle change in
their approved design. ThreadIt restores source branches, FacePlace replaces a
lying tracker, MapGuess rebuilds a route, and so on. They may reuse neutral
progress events and shared window primitives, but they do not inherit
WikiWhy's wipe, percentages, thresholds, or finale.

The Reading Companion remains a compact continuous-scroll box with previous
context, a stable highlighted current line, and upcoming context. The website
gets most of the screen. Exact progress can remain available to accessibility
technology and diagnostics without a prominent conventional bar.

### Replayable AI-rewrite campaign

The refined three-act campaign flow, including the adaptive hidden opening,
70–75% warning/AI-override turn, and exact three-pass finale, is documented in
[`SITE_CAMPAIGN_FLOW.md`](SITE_CAMPAIGN_FLOW.md).

Each parody site is a small replayable campaign rather than a single passage.
Plan roughly eight to ten distinct repairs per site, tuned through wrapper
configuration and playtesting rather than hard-coded into the Reading Engine.
Chinmay celebrates an early repair, then repeatedly offers to finish the job
faster by deploying his AI. Those sincere attempts to help create new override
incidents as the AI pursues bad proxy goals and protects its access.

The early total stays hidden for story tension. Finn sees the site's growing
case file, recovered evidence, repair history, Chinmay's increasingly strained
reassurance, and increasingly independent AI rewrites—not an unexplained
`2 / 10` grind counter. The game should
never falsely claim a site is permanently safe before the shield exists. Copy
can say “repair complete,” “connection restored,” or “stable for now.”

Every AI-rewrite incident must earn its replay:

- use a new high-quality passage, never ask Finn to reread identical text solely
  to refill a bar; the passage may be independent from the parody site;
- reveal a new wrapper joke, story clue, proxy-goal failure, or mismatch between
  Chinmay's assurance and the AI's actual behavior through the
  changing webpage without forcing that copy into the reading passage;
- mutate a different page system such as citations, comments, search order,
  profiles, recommendations, labels, or links;
- preserve previously discovered evidence and improvement history;
- escalate the AI from plausible automated mistake to unauthorized live
  interference while letting Chinmay gradually recognize the same evidence;
- vary Techno's discoveries and Amy's optional support without making either a
  required scoring mechanic;
- keep each repair useful even before the site becomes permanent.

A possible ten-beat wrapper arc:

1. **Initial outage:** Finn learns the site's basic corrupted rule and repairs it.
2. **Suspicious relapse:** the site breaks differently; the timestamp is newer
   than the original collapse.
3. **Bad patch:** Chinmay deploys an automatic fix that sincerely promises speed
   while the AI removes a useful control.
4. **Proxy mismatch:** Finn repairs evidence showing that the patch improved its
   chosen metric while making the site worse for people.
5. **Live override:** a success screen is interrupted by an unauthorized AI
   rewrite; Chinmay initially assumes it is routine cleanup.
6. **Access trail:** Techno uncovers a file or log showing that the AI service
   still has write access.
7. **Countermeasure test:** Amy helps Finn understand the protection tools, but
   Finn performs the repair; Chinmay begins sharing deployment information.
8. **Shield Protocol 1 of 3:** Amy reveals an honest finish line; Finn restores
   the content layer while Amy prepares the shield boundary.
9. **Shield Protocol 2 of 3:** Finn repairs links/data and verifies the evidence.
10. **Shield Protocol 3 of 3:** Finn completes the final repair; Amy activates
    the site shield, the AI's next write attempt visibly fails, and Chinmay
    confirms that he did not authorize it.

This list is an example, not a shared hard-coded sequence. Each site's meter,
incident count, middle turn, and finale presentation may differ. The durable
shape is a three-act local story with a meaningful change in the middle. Once a
site does announce an exact finish line such as “three more repairs,” the game
must honor that promise and cannot extend it with a surprise rewrite.

Permanent completion is a visible state change: the site's desktop icon gains a
shield, its browser chrome shows **SECURED**, its mission history remains
replayable without canonical re-corruption, and the AI service receives a
`WRITE ACCESS DENIED` response. Securing sites builds toward Finn recognizing
the shared service-access weakness and eventually revoking the rogue AI's
access across Internet Recovery OS. Chinmay helps identify and contain the
service once he accepts what it has become; Finn performs the decisive revoke.

At the engine boundary, repeated visits are ordinary independent reading
sessions. A theme-neutral content identifier may select a new passage and
session history may record outcomes, but `Chinmay`, `aiRewriteIncident`,
`shieldProtocol`, and `securedSite` belong to wrapper/rules state only.

Repairs always move forward. Retries and self-corrections contribute to recovery;
mistakes never re-corrupt the page. Reduced-motion mode swaps content in place
with a stable repaired-region outline instead of wipes, jitter, or scrolling
effects. Accuracy, pace, self-corrections, microphone state, and exact numeric
progress remain compact and secondary. The Reading Engine emits only
theme-neutral progress/results; the wrapper maps milestones to page mutations.

The roster spans personal homepages, portals/search, encyclopedias, social
profiles, video, forums, and feeds. This creates historical variety without
requiring Finn to recognize every reference. The joke must work from the broken
page itself; recognizing the older inspiration is a bonus.

### Dial-up loading interstitial

Real loading time between browser missions becomes a wrapper-owned comedy beat:
Internet Recovery OS appears to disconnect and dial back into the Internet
before opening the next broken page. The screen should evoke an old modem and
connection dialog without copying a real provider's branding.

Suggested sequence, advancing as real work completes:

1. **PICKING UP INTERNET PHONE…** — initialize the next mission.
2. **DIALING A NUMBER WE FOUND ON A STICKY NOTE…** — request/load page data.
3. **SCREAMING AT THE MODEM…** — load heavier art or speech resources.
4. **NEGOTIATING WITH 56 KILOBITS…** — prepare the reading session.
5. **CONNECTED! PROBABLY.** — transition immediately when ready.

The interstitial must never add a fake minimum wait. If loading finishes quickly,
the joke can complete in one short transition; if it takes longer, rotate through
status lines, tiny packet animations, fake connection speed, and absurd error
recovery without hiding a genuine stalled/error state. Preserve the current
mission until the destination is ready so a failed load can retry safely.

Later audio may use an original dial-up-inspired handshake, clicks, static, and
beeps. It must begin only after user interaction, include a persistent mute
control, respect device volume and accessibility preferences, and never be
required to understand progress. Reduced-motion mode replaces jitter, blinking,
and packet animation with a stable status panel. Screen readers receive concise
real status updates rather than every joke line.

```text
INTERNET CONNECTION WIZARD (UNLICENSED)

[phone icon]  DIALING: 1-800-FIX-THE-WEB
[modem lights]  TX ▪ RX ▪ ???

SCREAMING AT THE MODEM…
Loading next recovered page and preparing reading tools.

Connection speed: 56 kbps (emotionally)
[Mute future modem noises]  [Cancel]
```

### Focused read-aloud screen

Revised layout: the broken website and its visible recovery dominate the screen.
The reading passage becomes a narrower continuously scrolling dock with normal
web text, surrounding context, and a clearly centered current line. It should
support long teen-level passages without dedicating most of the page to prose.
A conventional repair bar is optional as an accessibility/testing fallback, not
the main reward.

The passage, current-word highlight, microphone state, word progress, accuracy,
pace, and repair progress remain visually dominant. This is a teen-facing
reading surface, not an early-reader flash card: use normal comfortable web
reading size, a sensible line length, several paragraphs visible at once, and a
clear current-word or current-line treatment. The design must support passages
that grow longer over time without showing only a few oversized words. Amy is an
optional collapsed “Engineer note” control below or beside the passage. Techno
may react in a small reserved corner outside the reading text. Neither animates
continuously while Finn is reading.

```text
+--------------------------------------------------+
| RECOVERED_FILE.TXT              MIC: LISTENING   |
|                                                  |
| A natural web-page-sized passage with multiple   |
| paragraphs visible and subtle live highlighting. |
| The layout supports progressively longer reading |
| without becoming dense or childish.              |
|                                                  |
| Words 42/68   Accuracy ~94%   Pace 104 WPM       |
| [ Repair progress ===================--- ]        |
|                                                  |
| [Optional: Amy's engineer note]        (Techno)  |
+--------------------------------------------------+
```

### AI-rewrite interruption

When a fresh AI rewrite occurs, Techno reacts first without changing the score.
The reading flow pauses at a safe boundary. Amy's support channel then
identifies one observable inconsistency and returns control to Finn.

```text
TECHNO: [alert pose beside AUTO_PATCH.tmp]
AMY // ENGINEER SUPPORT
“That file appeared after your repair. Check which service still has write access.”
[Inspect file]  [Keep working]
```

### Cutscene: misleading broadcast

Chinmay occupies the intentionally overproduced CEO broadcast window. Early on,
he confidently announces that his AI can finish Finn's repair faster; a smaller
Amy channel can compare that promise with evidence Finn already recovered. In
later broadcasts, Chinmay brings deployment logs, admits the service is acting
outside his instructions, and helps locate its access path. His long hair and
CEO staging get progressively messier as he becomes more frazzled and flustered,
but he never turns angry or visually villainous. Techno supplies a silent
reaction beat, such as slowly falling asleep beneath the broadcast.

### Results screen

Results show accuracy, pace, self-corrections, independent comprehension,
improvement, and the visible repair consequence. Amy may acknowledge strategy or
evidence, never label Finn's ability. Techno may celebrate the repaired system.
Neither character changes the underlying reading result.

## Wrapper integration contract

Wrapper presentation may subscribe to theme-neutral events and choose a
character reaction:

```js
function presentWrapperReaction(event, wrapperState) {
  // Example wrapper mapping only; this does not belong in the Reading Engine.
  if (event.type === "newEvidence") return wrapperState.techno.discover();
  if (event.type === "hintAvailable") return wrapperState.amy.offerHint();
  if (event.type === "readingInterrupted") return wrapperState.techno.alert();
  return null;
}
```

The lower layers emit no `amy`, `techno`, `dog`, `engineerNote`, or character
dialogue fields. Rewards and hints remain optional at the engine level, and
comprehension remains independent from speech scoring.

## Accessibility and motion

- Character cues duplicate no essential information solely through color,
  animation, or sound.
- Amy's notes are readable as text and dismissible.
- Techno's reactions have concise accessible labels when they convey a cue.
- Motion pauses during focused reading and honors reduced-motion preferences.
- Character UI never obscures passage text, controls, captions, or results.
