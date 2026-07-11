# Session handoff

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
