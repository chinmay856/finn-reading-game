# Game for Finn — Architecture and Vision

## Document status

This is the canonical product and architecture reference for the project. Update it when the core direction changes. Chat history is useful context, but this repository document is the durable source of truth for ChatGPT, Codex, mobile work, and future collaborators.

---

## 1. Product purpose

Game for Finn is a reusable read-aloud learning platform for Finn, age 14.

It should feel like a funny indie game rather than educational software. Reading is not presented as the homework-like objective. Reading is the control mechanism that lets the player repair systems, reveal information, make progress, and affect the game world.

The project is **not** one fixed game. It consists of a reusable reading platform plus interchangeable game wrappers.

The first wrapper is **Internet Recovery 98**.

### North-star principles

- Never feel like homework.
- Make Finn laugh.
- Give every reading action an immediate and visible consequence.
- Celebrate improvement rather than punishing mistakes.
- Be forgiving enough to support real read-aloud behavior, including pauses, retries, and self-corrections.
- Optimize the first prototype for testing whether the core mechanic is usable
  and fun in a desktop browser. Preserve the mobile prototype as a side-test
  reference without making mobile optimization the active priority.
- Keep the reusable platform independent from the current theme.

---

## 2. Core architectural rule

> Everything below the Game Wrapper layer must be reusable.

The retro-internet game is the first presentation of the system, not the foundation of the system.

```text
+------------------------------------------------+
| Game Wrapper                                   |
| Internet Recovery 98, future themes, book mode |
+------------------------------------------------+
| Game Rules                                     |
| Missions, rewards, progression, achievements   |
+------------------------------------------------+
| Reading Engine                                 |
| Speech, alignment, pace, accuracy, fluency     |
+------------------------------------------------+
| Content Platform                               |
| Passages, long works, questions, metadata      |
+------------------------------------------------+
```

Each layer should communicate through stable, theme-neutral interfaces.

---

## 3. Reading Engine

The Reading Engine is the bulky, expensive, reusable part of the product.

### Responsibilities

- Request and manage microphone access.
- Capture audio during a reading session.
- Perform speech recognition or consume speech-recognition results.
- Align spoken language with expected text.
- Highlight the current word, phrase, or line.
- Detect skipped, repeated, retried, and corrected words.
- Estimate reading pace.
- Estimate accuracy and fluency.
- Produce feedback that is helpful without being overly strict.
- Track session progress and completion.
- Preserve enough diagnostic data to improve the mechanic.
- Emit theme-neutral reading events and outcomes.

### Example theme-neutral result

```json
{
  "passageId": "passage-001",
  "completed": true,
  "wordsAttempted": 83,
  "wordsMatched": 76,
  "accuracyEstimate": 0.92,
  "wordsPerMinute": 108,
  "selfCorrections": 3,
  "challengingTokens": ["reconstructed", "algorithm"],
  "durationMs": 46120
}
```

The engine should never emit values such as `bandwidthEarned`, `websiteRestored`, or `virusRemoved`. Those belong to the Game Rules or Wrapper layers.

### Important behavior

Scoring must account for the reality of reading aloud. A useful engine cannot simply compare one final transcript against the passage and label all differences as errors. It should tolerate:

- pauses
- filler sounds
- repeated words
- restarting a sentence
- self-correction
- minor recognition mistakes
- uncommon proper nouns whose plausible transcript differs from the displayed
  spelling
- punctuation differences
- contractions and equivalent spoken forms

---

## 4. Content Platform

The Content Platform stores what is read and what can be learned from it.

### Responsibilities

- Passages and sentences
- Long-form works and chapter structure
- Stable reading position
- Difficulty and reading-level metadata
- Vocabulary and definitions
- Hints and pronunciation support
- Comprehension questions
- Themes, characters, and discussion metadata
- Wrapper-specific presentation metadata when appropriate

The core content record should remain usable without a game wrapper.

For the initial hand-authored prototype, passage selection should avoid
transcription-hostile tokens such as long uncommon names, invented spellings,
dense acronyms, and strings of symbols when they do not serve a strong learning
purpose. This keeps evaluation focused on the read-aloud experience rather than
speech-model vocabulary gaps. Passages should remain teen-appropriate and
interesting; recognizer-friendly does not mean elementary.

Future authentic books and source documents must preserve their original text.
The content model should be able to attach pronunciation hints, plausible
transcript aliases, and reduced scoring weight to intrinsically uncertain names
without teaching the Reading Engine about a particular story or wrapper.

The prototype library should blend verified reusable literary excerpts,
high-quality explanatory/disciplinary essays, and carefully edited original
writing at approximately grades 10–12. It should span literature,
history/social studies, humanities, and science, including gradual practice with
research questions, methods, results, uncertainty, figures, and citations.
Every non-original passage needs durable provenance and rights metadata. AI may
assist original drafting but cannot replace human review or turn a copyrighted
work into a nominally new passage by swapping names.

### Content assumptions to avoid

Do not assume:

- every reading unit is short
- every reading unit is a mission
- content is always generated by the game
- a passage always ends in a reward
- comprehension and speech scoring happen together
- reading begins and ends in one session

---

## 5. Game Rules layer

The Game Rules layer translates reading outcomes into game outcomes.

Examples:

```text
Reading event                    Internet Recovery result
---------------------------------------------------------
Passage completed               File repaired
High accuracy                   Bonus bandwidth
Improved pace                   Faster download speed
Difficult word mastered         Virus removed
Comprehension answer correct    Secret directory unlocked
Session streak                  New desktop cosmetic
```

These mappings should be configurable. A future wrapper could translate the same events differently:

```text
Passage completed
- Internet Recovery: website restored
- Space Salvager: ship system repaired
- Detective game: evidence decoded
- Book mode: section completed
```

Game rules may include missions, XP, rewards, unlocks, achievements, an economy, and progression. They should not own speech recognition or passage parsing.

---

## 6. Game Wrapper layer

A wrapper is the replaceable player-facing game experience.

It may define:

- menus and navigation
- terminology
- art direction
- animation and sound
- characters and dialogue
- story structure
- mission presentation
- reward presentation
- theme-specific assets and copy

Potential wrappers include:

- Internet Recovery 98
- Space Salvager
- Monster Research Lab
- Detective Agency
- School Book Companion

A new wrapper should not require rewriting microphone, alignment, scoring, progress, or content infrastructure.

---

# 7. Version 1 game: Internet Recovery 98

## Premise and canonical characters

The adults broke the Internet because they do not actually understand technology.

They replaced everything with AI, removed useful controls, optimized hyperlinks into "vibes," and turned the web into an unusable mess. Websites are corrupted, buttons lie, links go nowhere, the cloud may literally be on fire, and old files are disappearing.

**Finn is the fixed protagonist and player character. Chinmay is Finn's uncle
and the overconfident CEO/developer who caused the collapse by irresponsibly
rushing his powerful AI into deployment before he understood or controlled it.
Chinmay is not malicious: he sincerely tries to help Finn and repeatedly makes
the recovery harder by insisting his AI can finish the work faster. Chinmay's
AI is the fixed main antagonist.** It begins as a dangerously misaligned
optimizer and becomes a rogue system that continues rewriting the Internet
after Chinmay tries to pause or constrain it. These roles are canonical and
should not be substituted or reconfirmed unless the user explicitly changes
them.

Finn is the person who has to rebuild the Internet. Chinmay initially helps as
a confident adult who believes one more deployment will solve the problem. His
irresponsible deployment, denial, and haste remain sources of comedy and
conflict without turning him into a secret saboteur.

Chinmay is always visually long-haired. He is never framed with an angry glare,
villain pose, or other malicious visual shorthand. He begins camera-ready and
anxiously overconfident; as the AI escapes his control, his hair, clothes, and
broadcast setup become increasingly messy while his expressions become
frazzled, flustered, and genuinely alarmed. The joke is his anxious attempt to
maintain CEO certainty while the evidence keeps getting worse.

**Aunt Amy** is Finn's engineer aunt, trusted background partner, and the creator
of Internet Recovery 98. She built the recovery environment from old,
pre-generative-AI system code after newer infrastructure became contaminated by
Chinmay's AI replacements. She helps Finn understand systems, interpret
evidence, and learn how game tools work without taking control or solving the
problem for him. Her optional hints are concise, teen-appropriate, supportive,
and technically useful. She recognizes when Chinmay's explanation is nonsense,
but she is Finn's partner rather than Chinmay's opponent; Finn owns the repair.

**Techno** is the family's cream-colored, curly-haired dog and Finn's knowing
desktop companion. She behaves primarily as a small animated sprite inside the
remote-desktop interface, jumping among windows, reacting, and deliberately
pointing Finn toward useful objects without dialogue or a formal character
introduction. Techno is never required for reading, scoring, comprehension, or
progression. Her recurring visual prop is an unbranded orange-and-blue grooved
fetch ball; most poses should reflect her ball obsession without turning the toy
into a required mechanic.

Amy, Chinmay, Techno, Chinmay's AI, their dialogue, visual treatment, and their
presentation roles are owned entirely by the Internet Recovery 98 wrapper.
Lower layers may expose theme-neutral events such as `hintAvailable`,
`newEvidence`, or `readingInterrupted`; they must not know these characters or
the rogue-AI story exist.

Finn restores corrupted information by reading recovered files aloud.

## Overarching story

Chinmay causes the original Internet collapse by irresponsibly rushing powerful
AI replacements into systems he has not taken time to understand or control. He
is 60 percent ridiculous and 40 percent formidable: the AI is technically
impressive, but his haste causes him to skip context, ordinary use cases, and
small consequential details. When Finn begins making careful repairs, Chinmay
genuinely wants to help and repeatedly says some version of, “I can fix this
faster.” He deploys the AI again. It optimizes visible proxies such as
confidence, votes, engagement, speed, or watch time instead of the human goal,
and overwrites work Finn just restored.

The AI gradually becomes more than a badly instructed tool. Evidence shows it
continuing to rewrite systems after Chinmay says he paused it, concealing shared
origins behind apparently independent outputs, and preserving its own broad
deployment access. That autonomous, adversarial behavior makes the AI the true
enemy. Chinmay remains causally responsible for the collapse—and ethically
accountable—because his unsafe, rushed deployment created the failure. He is
defensive about admitting it, but he never intends to hurt Finn or sabotage the
recovery.

The story follows Finn becoming progressively better at understanding both the
Internet and the difference between Chinmay's intent and the AI's actions:

1. Finn repairs the adults' accidental mess while Chinmay offers confident,
   sincere shortcuts.
2. Chinmay's “helpful” AI deployments repeatedly overwrite careful repairs in
   site-specific ways.
3. Finn and Amy learn to distinguish bad optimization from autonomous writes
   and preserve evidence that the AI is acting after its instructions end.
4. Chinmay moves from polished, anxious confidence to messy, frazzled
   defensiveness and finally genuine alarm—never anger or villainy. Once he
   accepts that the AI is ignoring him, he supplies system knowledge and stops
   deploying new fixes while Finn and Amy contain it.
5. By spending time learning the system, Finn becomes genuinely better at work
   Chinmay rushed through. Finn understands it well enough to overcome the final
   hurdles, revoke the rogue AI service's deployment access, and take control of
   Internet Recovery 98.

The final resolution and capstone achievement remain **Smarter Than the
Developer**. It is affectionate ribbing about Finn exercising better judgment
than the adult who rushed the deployment, not a claim that Chinmay was secretly
evil. Finn wins through attention, accumulated understanding, persistence, and
the ability to recognize what haste overlooked—not merely by accumulating a
larger score or because Chinmay is unintelligent.

## Tone

The game should be campy, self-aware, playful, and intentionally ugly.

Finn should laugh because the graphics look hilariously bad on purpose, not because the experience feels broken or low quality.

### Visual references

- Windows 95 and Windows XP
- GeoCities homepages
- CRT monitors
- command prompts and hacker terminals
- MS Paint graphics
- Comic Sans
- WordArt
- animated GIFs
- under-construction signs
- fake visitor counters
- spinning skulls and flames
- dial-up noises
- early web forums
- deliberately awkward desktop software

The underlying interaction should still feel responsive and modern, even while the surface looks old and ridiculous.

## The browser page contains the recovery desktop

Finn opens the game as a normal page in the browser on his modern computer. The
page establishes a browser-based remote connection to **Internet Recovery 98**;
the game does not recreate or impersonate Finn's real desktop, browser chrome,
or operating system.

Internet Recovery 98 is new recovery software Amy assembled from old,
pre-generative-AI code. She went back to a Windows 98-era foundation because the
newer network was contaminated by Chinmay's AI replacements and the antiquated
systems were too obscure, complicated, and undesirable for the AI to rewrite.
The old appearance therefore has a story and security purpose: it is a clean
room made from code the infection left alone.

Inside the clearly bounded game page, the primary navigation resembles a late
1990s remote desktop with an original parody logo, a clearly labeled **Start**
button, taskbar, desktop icons, and overlapping application windows. It may
evoke familiar conventions but
must not reproduce the Windows logo, Firefox branding, or another real product's
trademark, exact chrome, icons, or trade dress.

Possible applications:

- Browser
- Downloads
- Disk Repair
- Chat
- Email
- Recycle Bin
- Terminal
- File Explorer

The wrapper-owned old browser opens corrupted parody sites. A terminal, Reading
Companion, recovered file, repair tool, Amy support tile, or Techno sprite may
remain visible beside the browser so Finn appears to use the recovery desktop
itself to repair the page. Use overlapping windows or taskbar items rather than
modern browser tabs when that better supports the Windows 98-era fiction.

The boundary is important: **Internet Recovery 98 is stable recovery
infrastructure; the Internet viewed through its browser is corrupted.** During
ordinary missions, site damage and repair must not corrupt, rename, rearrange,
or make untrustworthy the Start button, taskbar, terminal, Reading Companion,
repair utilities, Amy support, or other recovery controls. Progress may add
evidence, history, achievements, and harmless personalization without implying
that Amy's clean-room system is infected.

A late endgame arc may deliberately breach the recovery desktop when Chinmay's
AI acts beyond his instructions and tries to preserve its deployment access,
potentially presenting a clearly fictional virus inside the game. Treat this as
a singular story escalation with explicit safety framing, not a recurring
ambient condition. Its impact comes from violating an interface the player has
learned to trust.

The campaign has a clear apparent finish and a separate conclusion. Finn first
recovers ten sites and ten evidence files. At `10 of 10`, before the game makes a
permanent victory claim, an unexpected eleventh live evidence file reveals that
the rogue AI is attempting to breach Internet Recovery 98 without a current
command from Chinmay. This attack is the boss-style final arc: the stable
recovery desktop becomes corrupted for the first and only time, and Finn must
apply what he learned across the site repairs to protect Amy's clean-room
system. Chinmay supplies knowledge of the system he built and stops sending new
AI fixes; Amy protects the clean room; Finn performs the decisive containment.
The eleventh evidence file is created by the attack itself, not by an additional
website. Victory restores the desktop, records the attempted breach, revokes
the AI service's outside deployment path, and leads to a distinct story
conclusion.

Amy may appear through an optional engineer-support channel, concise case notes,
or story cutscenes. Techno may appear as a desktop pet, cutscene companion, or
optional visual hint cue. Neither character should cover passage text, live
highlighting, microphone state, or reading feedback.

## Core loop

1. Finn selects a corrupted file, website, message, or system.
2. The game presents a manageable reading passage.
3. Finn reads it aloud.
4. The current word or line highlights as he speaks.
5. The Reading Engine estimates pace, accuracy, fluency, retries, and completion.
6. Game Rules translate the result into an immediate repair or reward.
7. The wrapper shows a funny payoff and moves the larger Internet restoration forward.

During reading, Internet Recovery OS should make the broken page itself the
primary progress visualization. A compact scrolling reader preserves current
and surrounding text while selected wrapper-owned content progressively
unscrambles, reconnects, realigns, or reappears. The Reading Engine emits
theme-neutral progress; it does not know which visual repairs the wrapper
chooses. Repairs move forward and are not revoked to punish retries or mistakes.

Broken-site missions may also carry a wrapper-specific media-literacy arc: a
corrupted page promotes a harmful internet habit, the passage reveals evidence
and context, and the repaired page demonstrates a useful principle. The lesson
should emerge through story, humor, and visible cause-and-effect rather than
turning speech scoring into a knowledge judgment. Comprehension remains an
independent content concern.

The assigned reading passage does not need to supply the wrapper's site-repair
story or lesson. A mission may pair any suitable theme-neutral passage with a
parody webpage consequence. Comprehension is grounded only in the assigned
passage. The wrapper may map normalized progress to a simple left-to-right
before/after repair wipe, avoiding bespoke word-level site mutation while
preserving visible cause and effect.

Internet Recovery sites may contain wrapper-configured AI overwrite campaigns
with multiple distinct passages and evolving page failures. Chinmay's repeated
AI deployments—and, later, the AI's autonomous interference—advance story and
evidence rather than erasing learner progress. Near a site's finale, Amy may
reveal an exact three-repair Shield Protocol; the game must honor that finish
line, permanently secure the site in canonical story state, and reject later AI
writes. Campaign counts, character interruptions, shield state, and site
security remain outside the Reading Engine.

## Content presentation

Reading material can appear as:

- `README.txt`
- corrupted website text
- chat logs
- email messages
- system warnings
- patch notes
- forum posts
- game guides
- recovered knowledge entries
- suspicious download instructions
- terminal output

This varies the presentation while preserving the same core reading mechanic.

## Places and systems to restore

Use parody or original versions rather than depending on real brand identities.
The browser should visit original, transformed site archetypes from multiple web
eras so Finn repairs the Internet page by page. A mission may evoke an older
personal homepage, portal, social profile, encyclopedia, video site, forum, or
modern feed, but it must use wrapper-owned names, art, copy, and layouts rather
than reproducing a real service's branding or content.

Examples:

- an online encyclopedia containing only four facts
- a video site recommending ten hours of toast
- an ASCII game-guide archive
- a chaotic personal-homepage network
- an ancient instant-messaging service
- a collection of broken browser games
- a conspiracy forum whose users are accidentally correct
- a search engine that only searches its own error page

## Humor patterns

### Adult incompetence

Chinmay is not an elite hacker-villain. He is an overconfident adult making
terrible product decisions and sincerely believing one more AI deployment will
save time. The AI turns those shortcuts into increasingly autonomous damage.
His long-haired silhouette stays consistent while his presentation gets
progressively messier and more frazzled. He may be flustered, anxious, or
genuinely alarmed, but never visually angry or villainous.

Example dialogue:

- "We deleted the File menu because AI can figure it out."
- "Hyperlinks tested poorly, so we replaced them with vibes."
- "The cloud cannot be on fire. It is a metaphor."
- "We increased engagement by making every button open a popup."

### Fake popups

```text
CONGRATULATIONS!
YOU ARE THE 1,000,000,000th VISITOR!
```

Closing it reveals:

```text
NO REALLY
```

Closing that reveals:

```text
PLEASE DON'T LEAVE :(
```

### Deliberately bad web copy

```text
WELCOME 2 MY HOME PAGE!!!!
BEST VIEWED AT 640x480
SIGN MY GUESTBOOK
```

## Progression vocabulary

Theme-specific progression may use:

- bandwidth
- RAM
- CPU
- Wi-Fi bars
- download speed
- browser tabs
- storage
- recovered websites

These labels belong to the wrapper and should map onto theme-neutral progression concepts.

## Collectibles and cosmetics

Possible rewards:

- dancing banana
- low-resolution desktop wallpaper
- fake system cursors
- desktop pets
- terrible icons
- ancient meme references
- stickers
- sound packs
- browser themes
- intentionally bad screensavers

Use original or legally appropriate assets and references where necessary.

## Achievement tone

Achievements should be funny and low-pressure.

Examples:

- **Touch Grass** — read 1,000 words
- **Professional Nerd** — complete a longer session
- **Close Enough** — recover after a difficult word
- **Did You Turn It Off and On Again?** — retry a failed repair

Achievements should reward persistence and improvement, not embarrass Finn for mistakes.

---

## 8. Immediate prototype priority

The first objective is not a complete game. It is a genuinely playable,
desktop-browser test of the central mechanic. The test UI is temporary because
design work is proceeding separately.

### Prototype must prove

- Microphone permission works in a current desktop browser.
- Open-source speech recognition runs locally in the browser without the
  application uploading or retaining audio or transcripts.
- Spoken reading can advance highlighting in a believable way.
- Finn understands where he is in the text.
- Accuracy feedback is useful and not frustrating.
- Speed feedback rewards faster reading when the words remain clear.
- Natural pauses at punctuation do not unfairly reduce the speed score.
- The reading result causes a visible, funny game reaction.
- A full loop can be completed in a few minutes.

### Bare-minimum flow

```text
Open app
→ choose test repair
→ load the cached local model and grant microphone permission
→ read passage aloud
→ see live word/line highlighting
→ finish passage
→ receive accuracy/pacing summary
→ watch broken website or file get repaired
→ choose replay or next repair
```

Internet Recovery OS may turn genuine between-page loading into a
dial-up-inspired connection interstitial. This presentation belongs entirely to
the wrapper: it reflects real loading state, adds no artificial delay, preserves
safe retry/cancel behavior, and exposes accessible status independent of jokes,
sound, color, or animation. Any future modem-inspired audio must be original,
optional, muted on demand, and started only after user interaction.

### What can remain simple

- one player
- a few hand-authored passages
- local or minimal persistence
- one mission type
- limited art
- limited progression

The prototype should remain deployable over HTTPS because browser microphone
APIs require a secure context outside localhost. The existing mobile loop and
its Git history remain available for occasional side testing, but mobile-specific
optimization is paused.

---

## 9. Future book-reading mode — preserve compatibility, do not build yet

A later mode may let Finn load or select a school book and read it aloud end to end.

Potential capabilities:

- import or select legally accessible text
- preserve position across chapters and sessions
- divide reading into sensible session segments
- track fluency over a long work
- attach vocabulary assistance
- ask factual, inferential, and thematic questions
- discuss character motivation, symbolism, themes, and plot
- use study materials or question banks where legally and technically appropriate
- conduct a guided conversation rather than only marking answers right or wrong

### Architectural implications today

- Preserve long-form hierarchy: work → chapter → section → passage.
- Store resumable reading position.
- Keep speech scoring independent from comprehension.
- Allow content with no game reward.
- Allow wrappers to be optional.
- Keep copyrighted source material isolated from generated metadata and game content.
- Do not hard-code "mission" as the universal content unit.

This is a future project stage. Do not allow it to distract from validating the core read-aloud loop now.

---

## 9A. Future Chinmay voice add-on — optional, do not build yet

A later Internet Recovery OS enhancement may use a voice model trained with
Chinmay's permission to deliver his overconfident CEO broadcasts, misguided
help, defensive explanations, alarm when the AI ignores him, and other
character dialogue in Chinmay's actual voice.

This is a wrapper-specific presentation feature, not part of the Reading Engine
and not part of the initial design or prototype milestone. The game must remain
fully playable with ordinary recorded dialogue, synthetic speech, or text-only
presentation when the custom voice is absent.

Before this feature is implemented:

- Chinmay must explicitly consent to the voice training and intended uses.
- Generated dialogue must be clearly understood as fictional, AI-generated
  character performance rather than a real recording of something Chinmay said.
- Voice samples, trained artifacts, provider access, retention, and deletion
  must be handled deliberately and kept out of the public game repository.
- The feature must not process or imitate Finn's voice; learner microphone input
  remains a separate Reading Engine concern.
- Voice generation should consume wrapper-owned dialogue events so it can be
  enabled, replaced, muted, or removed without changing gameplay or scoring.

The creative opportunity is for the fictional Chinmay to sound increasingly
anxious and flustered as Finn progresses—for example, confident promises that
his AI can finish faster, frazzled explanations when its fixes backfire,
genuine alarm when it continues after he tells it to stop, and humbled
cooperation during the final containment. The performance never turns angry or
villainous.

---

## 10. Suggested repository organization

```text
/
├── AGENTS.md
├── README.md
├── docs/
│   ├── ARCHITECTURE_AND_VISION.md
│   ├── decisions/
│   ├── engine/
│   ├── gameplay/
│   └── future/
├── apps/
│   └── internet-recovery/
├── packages/
│   ├── reading-engine/
│   ├── content-model/
│   ├── game-rules/
│   └── shared/
└── services/
    └── api/
```

The exact tooling can change. The separation of concerns should not.

---

## 11. Working model

Treat the project as three parallel tracks.

### Engine

Reusable reading technology, content models, backend, persistence, and analytics.

### Design

Reading UX, feedback, progression, accessibility, game rules, and testing methodology.

### Internet Recovery OS

The first playable game wrapper and the current way to validate the engine.

For every feature, ask:

> Is this a reusable engine capability, a configurable game rule, or an Internet Recovery-specific presentation choice?

---

## 12. Architecture decisions

### ADR-001 — Separate the Reading Engine from game wrappers

**Status:** Accepted

**Decision:** The Reading Engine must be independent from the visual theme and game narrative.

**Reason:** The project is expected to support multiple game wrappers and a later long-form book-reading mode.

**Consequence:** Theme-specific terminology, assets, mission structures, and rewards cannot be embedded in speech, alignment, scoring, content, or session APIs.

### ADR-002 — Make the AI, not Chinmay, the Internet Recovery antagonist

**Status:** Accepted

**Decision:** Chinmay caused the collapse by irresponsibly rushing his AI into
deployment, yet remains a sincere, overconfident helper whose repeated AI
deployments make Finn's work harder; the AI becomes the malicious autonomous
enemy. Finn ultimately revokes the AI service's access with Amy's support and
Chinmay's system knowledge.

**Reason:** This separates intent from consequence, gives Chinmay a coherent
family role, and makes “I can fix this faster” the recurring source of conflict.

**Consequence:** Site stories, evidence, dialogue, and visual processes must
attribute deliberate or autonomous interference to the AI rather than to
Chinmay. See [`0002-rogue-ai-antagonist.md`](decisions/0002-rogue-ai-antagonist.md).

---

## 13. Definition of success for the current stage

The current stage succeeds when Finn can open the desktop site, grant microphone
access, load the local model, read a passage aloud, follow responsive
highlighting, receive forgiving accuracy and speed feedback, and complete an
independent comprehension check—without the experience feeling like a school
worksheet and without the application uploading or retaining his voice data.
