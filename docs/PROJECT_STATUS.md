# Project status

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Repository:** `chinmay856/finn-reading-game`
- **Live desktop prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployment:** GitHub Pages through GitHub Actions, with HTTPS enforced
- **Current stage:** Validate local Whisper transcription, forgiving alignment,
  and speed-plus-accuracy scoring in a desktop browser

All active project work now happens through this Codex workspace and GitHub.
There is no remaining requirement to reconcile parallel web or mobile chat
threads.

## Current implementation

The repository root contains the intentionally small desktop mechanics test:

- `index.html` and `styles.css` provide the existing lightly retro test interface.
- `app.js` owns browser integration, microphone permission, local transcription
  state, retry/accept behavior, diagnostics, and review UI.
- `speech/` owns theme-neutral in-memory audio capture and the Transformers.js
  Whisper adapter/worker. The maintained `onnx-community/whisper-base_timestamped`
  model runs locally through the proven WebAssembly/q8 path by default. WebGPU
  remains an explicit experimental diagnostic option, not the default.
- `reading-engine.js` owns theme-neutral normalization, forgiving transcript
  alignment, and scoring data. It must remain free of wrapper terminology.
- `tests/` checks alignment behavior, DOM references, and the engine/wrapper
  boundary.
- `.github/workflows/ci.yml` runs checks and tests.
- `.github/workflows/pages.yml` deploys `main` to GitHub Pages.
- [`engine/SPEECH_TECH_RESEARCH.md`](engine/SPEECH_TECH_RESEARCH.md) records the
  reuse-first decision and future comparison options.

The StoryQuest label is a temporary mechanics-test presentation, not the
canonical long-term game wrapper. Internet Recovery OS remains the first planned
wrapper. The user is working on design separately; do not redesign this test UI
while validating the engine.

## Canonical product facts

- Finn is the fixed protagonist and player character.
- Chinmay is Finn's uncle and the overconfident AI-company CEO/developer. He is
  causally responsible for the collapse because he irresponsibly rushed the AI
  into deployment before he understood or controlled it. He keeps making Finn's
  work harder by sincerely insisting his AI can fix things faster, but he is
  not malicious.
- Chinmay's AI is the fixed main antagonist. It begins by optimizing the wrong
  goals and becomes clearly rogue when it keeps rewriting repairs after Chinmay
  tries to stop it.
- Chinmay is always depicted with long hair. He becomes progressively messier,
  frazzled, and flustered as the AI escalates, but never looks angry or
  villainous; the humor comes from anxious overconfidence.
- Aunt Amy is Finn's engineer aunt and optional background partner. Techno is
  the family's cream-colored, curly-haired dog and optional cartoon companion.
  Both characters, their dialogue, and their visuals belong only to the
  Internet Recovery OS wrapper and never affect reading or scoring.
- Private character photos guide likeness only and remain outside the product
  art. Never paste them into boards or use photoreal character panels. Amy,
  Chinmay, and Techno share one illustrated editorial-cartoon treatment;
  Techno remains ball-obsessed and Chinmay follows the long-haired, increasingly
  frazzled arc above.
- The reusable Reading Engine, Content Platform, Game Rules, and Game Wrapper
  concerns remain separate.
- A future Chinmay voice add-on is optional wrapper presentation, requires
  explicit consent and disclosure, and is not part of the current prototype.
- The app uploads and stores no audio or transcripts. Audio is held only in
  memory for local transcription and is discarded after each result.
- Faster reading is beneficial when accuracy and independent comprehension stay
  adequate. There is no maximum-WPM penalty, and punctuation pauses receive a
  bounded timing allowance.

## Current WikiWhy spike

The `agent/batched-reading-spike` branch combines the reviewed wrapper design
foundation with a focused continuous-reading experiment. It replaces four
manual line checks with one approximately 220-word grades 10–12 passage,
pause-triggered cumulative local transcription, paragraph-level reader motion,
and the reusable left-to-right WikiWhy repair wipe. The page reports the last
checkpoint latency so playtesting can judge naturalness directly.

See [`engine/BATCHED_PROGRESS_SPIKE.md`](engine/BATCHED_PROGRESS_SPIKE.md) for
the mechanism, research basis, and acceptance evidence. This is still a spike:
do not generalize its timing constants or UI until a real microphone reading
shows whether the WASM engine keeps up.

The follow-up hardening separates furthest confirmed reading position from
matched-word accuracy, bounds checkpoint inference to overlapping audio
windows, restores a privacy-safe timing-report export, and adds an independent
passage comprehension check. These changes reduce guaranteed latency growth
without changing the pinned speech model or wrapper/engine boundary.

A real 220-word run then displayed 51/220 words, 23% accuracy, and 199 WPM. The
speed showed that elapsed capture covered the reading, while the 51-word result
was consistent with final decoding stopping at the first live-checkpoint media
fragment. The capture fix now gives live checkpoints their own restartable
recorder and reserves an uninterrupted recorder for final scoring. The flow
also uses one Begin action and automatic end-of-passage completion, with a
manual finish fallback. This fix still requires a real reread before the
accuracy estimate is trusted.

The next full run confirmed the capture repair: 200/220 words, 91% accuracy,
131 WPM, and 96% furthest position. Remaining issues were consistent
paragraph-end lag and premature automatic completion at the former 94%
threshold. The current branch introduces content-owned reading profiles,
shortens the expository checkpoint trigger/window, requires matched evidence
from the actual passage ending, and exposes ephemeral transcript diagnostics so
the next run can distinguish recognition omissions from inference latency.

Subsequent playtesting confirmed that transcription contained the words but the
reader viewport still waited too long for confirmation, making the experience
barely unusable at fast pace. A predictive navigation guide now decouples text
visibility from speech inference: it advances only while voice is active at a
selected 150/200/250/300 WPM profile, defaults to 250 WPM, keeps look-ahead text
visible, and yields temporarily to manual scrolling. Transcript evidence alone
continues to control repair, scoring, and end detection.

The first predictive-guide test moved too early and continued into artificial
space below the final paragraph. The guide now waits until the first paragraph
is complete, centers against actual rendered word geometry, eases rather than
jumps, preserves scroll position across transcript updates, and clamps at the
real document bottom. Review appears immediately with live-checkpoint results
while a visible timer finalizes the full local transcript; the report records
how much accuracy and word evidence that expensive final pass actually adds.

## Immediate next action

The first reviewed Internet Recovery 98 interface slice now wraps the existing
mechanics test in a clearly bounded remote recovery desktop. WikiWhy occupies
the dominant browser canvas; the independent continuous Reading Companion is a
compact side window; confirmed neutral progress drives the reusable left-to-
right before/after repair wipe. Setup, privacy, reading, and result language use
stable wrapper copy IDs under `apps/internet-recovery/copy.js`. This implements
only the documented one-passage proof, not the rogue-AI rewrite, final three,
campaign progression, or unreviewed character art.

The next interface test is visual attention: verify that the reader remains easy
to follow at 250 WPM while the WikiWhy repair is noticeable but not distracting.
Then test the complete microphone loop once the preferred local speech adapter
is stable enough to provide a fair transcript.

The slice now reads Deck A passage A01, **How Plants Store Sunlight**, through an
executable Content Platform record with CC BY-SA attribution, source/history
URLs, content-owned reading profile, and an independent passage-grounded check.
The record contains no WikiWhy repair or wrapper outcomes.

An isolated Moonshine comparison is now available at
`moonshine-benchmark.html`. It preserves the exact maintained Hugging Face model,
Silero VAD, and streaming configuration while reporting same-passage accuracy
and segment latency. The production Whisper route remains unchanged. Run the
comparison once in Chrome, then use the recorded evidence—not model reputation—to
decide whether Moonshine deserves adapter integration. See
[`engine/MOONSHINE_BENCHMARK.md`](engine/MOONSHINE_BENCHMARK.md).

The first Moonshine run detected seven speech segments but returned seven empty
transcripts on WebGPU. Its 0% display was therefore an engine failure, not a
reading score. The benchmark now uses only the first paragraph, forces
WebAssembly/q8, and exposes privacy-safe signal and response diagnostics. The
next action is one short reread to decide whether Moonshine is more useful than
the current Whisper path.

Run the complete four-line loop from the deployed HTTPS GitHub Pages URL in
current Chrome. Compare local transcripts with what was read, observe first-load
time and per-line latency, and paste the no-audio diagnostic report into Codex if
a score feels unfair. Test Edge and a second WebAssembly-capable desktop browser
after Chrome establishes the baseline. In parallel, begin the wrapper step below.

Publish and read the WikiWhy batched-progress spike in current Chrome. Judge the
pause-to-progress latency, whether the active paragraph remains easy to follow,
and whether inference falls behind. Tune or reject the batching approach from
that evidence before adding campaign progression or production wrapper art.

After the WikiWhy slice is usable, test whether Finn can follow the scrolling
reader while noticing the page repair without distraction. Use that evidence to
choose the next wrapper component.

The existing phone-test action remains useful for validating the underlying
engine:

Run [`PHONE_TEST.md`](PHONE_TEST.md) in Safari on iPhone and Chrome on Android.
Test microphone permission, the separate Start reading tap, live highlighting,
correct words, accuracy, pace, WPM, retry, Accept & continue, final review, and
Copy test report.

Paste the copied JSON report into Codex when a device-specific problem occurs.
Use that evidence to choose the next smallest Reading Engine improvement.

The private Amy/Chinmay and Techno references remain outside the repository.
Generated concept boards are cataloged under
[`apps/internet-recovery/art/concepts`](../apps/internet-recovery/art/concepts/README.md).
The campaign hub and WikiWhy example are review-ready. All nine proposed
non-WikiWhy site directions remain WIP/art-direction-under-review: they are
exploratory and do not approve production chrome, copy, or character assets.
Version-two WIP boards now replace the rejected or inconsistent character art
for MyCorner, Search-ish, Amaze-On, Spotty-Fi, and MapGuess. The earlier files
remain explicit comparison history and are not builder inputs. The current WIP
boards explore the rogue-AI visual canon: an inset browser within Finn's remote
desktop, restrained retro desktop Easter eggs, a separate stable Reading
Companion, a visibly nonhuman AI process, and long-haired Chinmay becoming
frazzled rather than villainous. Unsuffixed earlier boards are retained only as
superseded composition history.

The WIP Chinmay portrait sheet defines six reusable wrapper states—neutral,
confident, fluster levels one through three, and relieved/cooperative—so builders
select a stable illustrated expression by story mood instead of regenerating a
new portrait for every message. `Chinmay` is the only canonical spelling; an
alternate transcription must never enter copy, assets, or filenames.

The wrapper design also includes original broken-web parody missions and a
dial-up-inspired interstitial that masks genuine between-page loading without
adding fake delay. These are documented concepts only; the current desktop
mechanics test has not implemented them.

Campaign mechanics are authored site by site. The shared story rhythm is an
apparent problem, a meaningful middle change, and a site-specific resolution;
percentages, passage counts, trackers, resets, and finales may differ. WikiWhy's
worked example uses dynamic 10–20% Act I repair, an 80% rogue-AI rewrite, and
an exact three-step containment finale. These remain wrapper design, not Reading
Engine behavior.

Prototype passage authoring now explicitly avoids unnecessary
transcription-hostile proper nouns, invented spellings, dense acronyms, and
symbol strings. Future authentic texts should preserve original wording and use
pronunciation hints, accepted transcript forms, or reduced scoring weight rather
than counting recognizer uncertainty as a reading error.

The current wrapper design deliberately separates Reading Companion content
from parody-site copy. Finn may read any suitable, high-quality passage while a
simple progress-driven left-to-right wipe changes the site from corrupted to
repaired. This keeps comprehension grounded in the passage and avoids building
bespoke word-level repair UI for every site.

The proposed grades 10–12 content library blends verified reusable literary
excerpts, explanatory essays (including scientific-reading structures), and
human-reviewed original writing. Rights/provenance and transcription review are
required content metadata; copying a protected work and merely renaming its
characters is explicitly out of scope.

The WikiWhy handoff now includes an explicit ownership map, an approved campaign
storyboard, and two attributed ten-passage Wikipedia adaptation decks. Deck A is
the first-run pool and Deck B is reserved for unseen replay content. Only the
Reading Companion passage is expected speech; corrupted/repaired WikiWhy page
copy is wrapper-owned decorative visual content.

The broader design library now proposes a ten-site roster: WikiWhy, ThreadIt,
FacePlace, MyCorner, Yahuh! Portal, ViewTube, Search-ish, Amaze-On, Spotty-Fi,
and MapGuess. The nine non-WikiWhy sites each have a review-only three-act board,
unique progress fiction and midpoint, and a researched reading-source lane.
These are design proposals awaiting site-by-site review; they are not current
prototype implementation scope.

The proposed campaign spine now connects those ten independent site stories
without imposing one global progress mechanic. WikiWhy is the onboarding case;
later site order can vary. Global Chinmay/AI/Amy story turns trigger from the
number of secured sites and evidence files, while the hub shows at most three
Incoming Cases. Early AI rewrites follow Chinmay's overconfident attempts to
help; later evidence shows the AI continuing after he tells it to stop. Ten
secured sites produce a genuine apparent finish. An unexpected eleventh live
evidence file then starts the separate, singular rogue-AI breach of Amy's
previously trustworthy recovery desktop and leads to revocation of the AI
service's outside deployment access. This remains design-only and is not a
request to implement campaign state in the current mechanics test.

One review-only grades 10–12 sample is now drafted for each non-WikiWhy site.
The sampler spans argumentative nonfiction, literary retelling, reflective
prose, historical journalism, science fiction, paired-source digital literacy,
consumer information, music history, and cartography. Each entry records its
source, rights basis, adaptation, independent question, sensitivity notes, and
speech risks. The texts still require factual/content review, frozen source
records, jurisdiction review, and real-microphone testing before production use.

## Known limitations

- One real Chrome microphone line passed locally at 95% estimated accuracy and
  243 WPM through WebAssembly/q8. A full four-line HTTPS session is still needed.
- Whisper transcription is still an estimate, not a formal pronunciation
  assessment; clarity must be evaluated through accuracy and comprehension.
- The first model load is roughly 77 MB on the default WebAssembly path, and
  local transcription latency varies by browser and hardware.
- WebGPU/q4 is not trustworthy on the development computer; even Hugging Face's
  untouched public-sample demo produced unusable output in Chrome. Do not make
  WebGPU the default without new evidence.
- WPM and accuracy are prototype estimates intended to test whether the mechanic
  feels understandable and fair.

## Repository workflow

1. Start from synchronized `main`.
2. Use one scoped `agent/<description>` branch per task.
3. Keep implementation, relevant tests, and truth-changing documentation in the
   same pull request.
4. Merge only after checks pass.
5. Return local `main` to the merged, deployed state.

Historical PR #1 (cross-interface workflow) and PR #2 (earlier separated mobile
foundation) are superseded references, not active implementation branches. PR #3
is the preserved basis of the mobile side-test prototype. Do not delete its
branch or history; do not spend further mobile optimization time unless asked.

## Validation commands

```text
npm run check
npm test
npm run build
npm run dev
```
