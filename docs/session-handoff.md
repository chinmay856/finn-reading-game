# Session handoff

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
