# Session handoff

## WikiWhy campaign diagnostic and character dialogue pass

- Added a small `TEST` control above the recovery taskbar. It can simulate a
  strong passage result without requesting microphone access, running speech
  recognition, creating a reading score, or changing saved real-repair state.
- Diagnostic campaign state uses its own
  `internet-recovery-98.wikiwhy.diagnostics.v1` browser-storage key. Its reset
  button removes only diagnostic progress.
- The deterministic Act I route advances `0 → 19 → 38 → 57 → 76 → 80%`, which
  makes the documented Amy warning and 80% reverse-hack boundary reachable in
  five clicks. The live overwrite explicitly changes the cumulative browser
  meter from `SITE STABILITY 80%` to `SHIELD STABILIZATION 0%`.
- Shield Protocol then advances in exactly three simulated passages at
  `33 → 66 → 100%`, ending with the documented hidden-admin `ACCESS DENIED`
  beat. The diagnostic panel always labels these as simulated passages because
  the current executable prototype still contains one real Content Platform
  passage.
- Added lightweight Windows-style Amy and Chinmay dialogue overlays. The two
  wrapper-owned static portraits follow the approved character/campaign boards;
  Techno's separately produced progress-push sprite is unchanged and no other
  Techno states are loaded.
- Only the nested WikiWhy page receives the short reverse-hack effect. The
  recovery desktop, taskbar, Reading Companion, Amy channel, and diagnostic
  controls remain stable, preserving the wrapper's trusted-shell rule.
- Architecture remains separated: the harness, campaign state, dialogue copy,
  and portraits live under `apps/internet-recovery/`; Reading Engine, Content
  Platform, theme-neutral Game Rules, speech, and real session history are
  unchanged.
- Published through merged PR #27 at
  <https://chinmay856.github.io/finn-reading-game/>. Validation: `npm run check`,
  `npm test` (53 passing), `npm run build`, and a live HTTPS smoke check all
  pass. Recommended next step: click through the full diagnostic route once to
  judge dialogue size, story timing, and whether the 80% reset is visually
  understandable before connecting additional real passages.

## WikiWhy visual-fidelity pass

- Compared the live prototype directly with the reviewed WikiWhy reader/repair
  board, parody-site states, Amy/Techno character board, and recovery-hub board.
- Added an original production WikiWhy globe mark and buttered-toast evidence
  image under the wrapper-owned `art/site-assets/` directory, with prompt and
  provenance notes. They do not enter Content Platform, Reading Engine, or Game
  Rules data.
- Brought the live page closer to the approved boards with a real WikiWhy
  masthead, search/account chrome, explicit corrupted/repaired integrity labels,
  stronger Windows-style title bars and taskbar, a white encyclopedia page,
  tighter typography, a clearer repair edge, and a subtle optional CRT texture.
- Preserved the large-site / narrow-reader layout, continuous reading behavior,
  progress wipe, optional comprehension, privacy boundary, and persistent
  stability consequence unchanged.
- The separately produced Techno library is now present. This branch will wire
  only the documented progress-push proof; all other reaction states remain
  unhooked until their placement is reviewed.
- The progress-push proof now follows the confirmed repair boundary. It stays on
  the still frame until confirmed progress advances, plays one approximately
  two-second push reaction, then returns to still. Reduced-motion users always
  receive the still; the other five animation states remain unloaded.
## Techno animation library

- Added six approved, wrapper-owned animated WebP states under
  `apps/internet-recovery/art/characters/techno/`: progress push, ball-drop
  idle, sleep idle, paw alert, bark alert, and tail-wag celebration.
- Every state uses six transparent frames over approximately two to three
  seconds and includes a matching still WebP for reduced-motion presentation.
- The progress-push sprite is intended to move with the wrapper's confirmed
  repair boundary. Other reactions should be lazy-loaded and remain optional
  presentation; they do not affect reading, scoring, comprehension, or saved
  progress.
- Each loop was decoded and visually checked for duplicate characters,
  clipping, inconsistent scale, and missing limbs. Rejected experiments and
  internal review strips are not part of the published asset set.
- The WikiWhy visual-fidelity branch integrates only the progress-push state;
  the matching still is the default and reduced-motion presentation. The other
  five reactions remain unreferenced and therefore absent from the live bundle.

## Persistent WikiWhy repair consequence

- The completed reading now produces one visible WikiWhy stability outcome
  instead of ending at a generic Continue button. The result shows the previous
  stability, new stability, advance, an in-world reaction, and explicit
  `READING SAVED · EVIDENCE SAVED` confirmation.
- A theme-neutral Game Rules function combines completion, accuracy,
  comprehension, and pace. The WikiWhy-specific rule maps that strength to the
  documented 10–20% Act I advance. Every accepted reading advances; optional
  comprehension can strengthen the repair; faster reading has no upper-speed
  penalty; and no answer can force a retry.
- Wrapper state now persists stability, repair count, last reaction, and the
  last applied session ID. Duplicate clicks cannot count a session twice, and
  existing version 1 saves migrate at the minimum earned 10% per repair.
- Reloading the prototype enables Recovered Files and displays the saved
  WikiWhy stability receipt. Storage failure still leaves the current-tab
  outcome playable and never affects speech scoring.
- Added `?uiPreview=outcome` for no-microphone visual review of the consequence.
- Deliberately did not implement the 80% reverse hack, Shield Protocol, hub, or
  multi-site campaign. The next mechanics decision should come from testing
  whether this single persistent reward feels connected and satisfying.

## Local non-audio session state track

- Added a versioned, theme-neutral Reading Platform session history stored only
  in this browser. It saves passage/session IDs, completion time, duration,
  accuracy, confirmed/total words, progress, WPM, and comprehension outcome.
- The store explicitly discards raw audio, transcript text, checkpoint text,
  browser identity, and wrapper terminology. It is capped at 20 sessions.
- Added a separate Internet Recovery 98 WikiWhy repair record, written only
  when the player chooses Continue. The wrapper state does not enter the Reading
  Engine session format.
- Browser storage is optional. Blocked access, malformed data, policy errors,
  and quota failures fall back safely without interrupting reading or scoring.
- Recommended next action: finish the first WikiWhy vertical slice by mapping a
  saved, comprehended reading result to one visible but optional repair outcome;
  keep the speech adapter swappable while Moonshine remains unproven.

## WikiWhy interface track

- Reviewed the complete merged prototype handoff, campaign flow, character
  direction, player-facing copy deck, passage decks, passage authoring guide,
  canonical architecture, and relevant concept boards.
- Implemented the smallest supported visual slice: one bounded Internet
  Recovery 98 remote desktop, one dominant WikiWhy browser window, one compact
  independent Reading Companion, one progress-driven repair wipe, and quiet
  result/comprehension windows.
- Added stable implemented copy IDs in `apps/internet-recovery/copy.js`; no
  wrapper copy or WikiWhy concepts entered the Reading Engine or speech files.
- Added `?uiPreview=read` and `?uiPreview=review` as no-microphone visual QA
  states. They are diagnostics, not player navigation.
- Wired Deck A passage A01, **How Plants Store Sunlight**, through a reusable
  attributed Content Platform record. Title, paragraphs, word count,
  provenance, profile, and comprehension now hydrate the interface from that
  record instead of the former hard-coded evidence demo.
- Deliberately deferred the 80% reverse hack, ten-session campaign, Shield
  Protocol, achievements, and generated character sprites until the core
  one-passage experience is reviewed.
- Next action: deploy and judge whether the compact reader holds attention at
  250 WPM while the page repair remains legible without stealing focus.

## Moonshine latency track

- PR #17 added an isolated Moonshine Base + Silero VAD browser comparison while
  leaving the production Whisper path unchanged.
- The first real run detected seven speech segments but returned seven empty
  transcripts on WebGPU. Timing was 19.6 seconds to first output, 1.6 seconds
  median segment lag, 6.1 seconds worst lag, and no final-flush delay. The 0%
  display was an engine failure, not a reading score.
- The follow-up test uses only the first passage paragraph, forces
  WebAssembly/q8, and displays privacy-safe sample count, duration, RMS, peak,
  and model-response shape for every segment.
- Next action: deploy and perform one short microphone reread. Continue with
  Moonshine only if it returns a fair transcript with materially better latency
  than the current Whisper final pass.

## Copywriting track

- Added `docs/gameplay/INTERNET_RECOVERY_COPY_DECK.md`, a reviewable wrapper-only
  deck covering first launch, navigation, mission framing, microphone/privacy,
  reading states, quiet results, voluntary retries, character dialogue, pop-ups,
  a clearly labeled fake-virus level, dial-up loading, sabotage, Shield Protocol,
  achievements, settings, errors, old-Internet references, and final story beats.
- Approved voice: edgy teen comedy without cruelty; mild profanity; direct use
  of Finn's name; extensive fourth-wall breaks; and Chinmay as a brilliant,
  theatrical inventor whose overlooked details defeat his plans.
- Reading feedback stays minimal and nonjudgmental. Metrics remain visible,
  recognition uncertainty is explicit, continuing is always available, and no
  score can force a retry.
- Canonical wrapper title is now `Internet Recovery 98`. Finn opens it as an
  ordinary browser-based game, and the game page contains Amy's bounded remote
  recovery desktop. Amy assembled the new recovery environment from old,
  pre-generative-AI code that Chinmay's contaminated AI systems did not
  understand or want to rewrite. The contained desktop uses original parody
  start/taskbar/browser/terminal conventions and must not imitate Finn's actual
  operating system or real browser chrome.
- Techno is a knowing visual sprite who jumps through and helps inside the
  recovery desktop without a formal introduction or dialogue-character role.
- Internet Recovery 98 uses a normal `Start` label. The recovery desktop is a
  stable, trusted shell: taskbar, terminal, Reading Companion, repair tools, Amy
  tile, and Techno do not become corrupted during ordinary site missions. Only
  websites nested inside the old browser are unstable. A single explicitly
  fictional virus breach is reserved as a possible late-game escalation when
  Chinmay makes a final attempt to regain control.
- Campaign structure is ten sites and eleven evidence files. Each site supplies
  one story artifact. Apparent completion at `10 of 10` is interrupted by
  `EVIDENCE_11.LIVE`, which records Chinmay's AI attempting to breach the
  recovery desktop. The resulting fake-virus boss arc is the only ordinary-story
  exception to the desktop's stability and leads to a separate conclusion.
- Parody-site body copy remains intentionally out of scope for this pass.
- Implementation has not begun. Review the deck in its suggested section order,
  then assign stable wrapper copy IDs before wiring approved lines into UI.

## Current state

- Branch: `agent/predictive-reading-guide`
- Base: synchronized `main` at merge commit `996971e` from PR #12
- Live deployment before this branch:
  <https://chinmay856.github.io/finn-reading-game/>
- Current engine: Transformers.js `3.7.1`, timestamped Whisper base,
  WebAssembly/q8
- Privacy: all recognition remains local; transcript diagnostics are ephemeral

## Latest user evidence

The corrected engine appears to recognize the full reading, but confirmed
progress arrives after the reader reaches the bottom of the viewport. Paragraph
transitions force unnatural mid-sentence pauses. The required experience must
support approximately 250 WPM and may need headroom for faster reading.

This establishes that confirmed transcription is too latent to serve as the
navigation clock even when its final accuracy is acceptable. Current graphics
are inexpensive and inference runs in a worker; the dominant problem is waiting
for checkpoint transcription before scrolling, not site artwork.

## Implemented response

- Added a theme-neutral predictive guide under `reading-guide.js`.
- The guide advances from active speaking time and a selectable 150, 200, 250,
  or 300 WPM profile; 250 WPM is the default.
- Eighteen words of look-ahead and a taller 56vh reading viewport keep current
  and upcoming prose visible.
- Voice pauses stop the guide clock.
- Manual wheel, pointer, or touch scrolling pauses automatic guidance for five
  seconds so the interface does not fight the reader.
- Confirmed transcript progress remains separately labeled and continues to
  drive WikiWhy repair.
- Voice activity and guide position never participate in completion, accuracy,
  scoring, or repair. End detection still requires actual final-token evidence.

## Research

The maintained Hugging Face Moonshine Web example is the next engine candidate
if UI decoupling is insufficient. It uses the same Transformers.js `3.7.1`,
Moonshine Base, Silero VAD, WebGPU with WASM fallback, and serialized inference.
It is designed for live recognition but has a substantially larger model and
must be benchmarked before integration. See `docs/engine/SPEECH_TECH_RESEARCH.md`.

## Validation

- `npm run check` — passed
- `npm test` — passed, 28 tests
- `npm run build` — passed
- Browser smoke: 250 WPM selected by default, 300 WPM available, taller reader
  grid present, transcript panel present, no console warnings/errors
- Real microphone naturalness test remains required

## Preserved state

`tests/audio-capture.test.js` retains a pre-existing line-ending-only status
with no content diff. It remains unstaged and undiscarded.

## Recommended next step

Publish and test the 250 WPM guide once. Read without waiting for confirmed
highlighting and judge only whether upcoming text remains comfortably visible.
If the guide still lags, select 300 WPM or increase look-ahead. If navigation is
comfortable but confirmed repair remains distractingly delayed, run the exact
maintained Moonshine Web example as an isolated benchmark before changing the
production speech adapter.
