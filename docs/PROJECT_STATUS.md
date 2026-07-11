# Project status

This is the concise operational status for the next Codex task. The durable
product and architecture source of truth is
[`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md).

## Active state

- **Primary workspace:** Codex app
- **Authoritative branch:** `main`
- **Repository:** `chinmay856/finn-reading-game`
- **Live phone prototype:** <https://chinmay856.github.io/finn-reading-game/>
- **Deployment:** GitHub Pages through GitHub Actions, with HTTPS enforced
- **Current stage:** Validate the smallest enjoyable read-aloud loop on Finn's
  phone before adding broader game systems

All active project work now happens through this Codex workspace and GitHub.
There is no remaining requirement to reconcile parallel web or mobile chat
threads.

## Current implementation

The repository root contains the intentionally small phone mechanics test:

- `index.html` and `styles.css` provide the teen-appropriate mobile interface.
- `app.js` owns browser integration, microphone permission, recognition state,
  retry/accept behavior, diagnostics, and review UI.
- `reading-engine.js` owns theme-neutral normalization, forgiving transcript
  alignment, and scoring data. It must remain free of wrapper terminology.
- `tests/` checks alignment behavior, DOM references, and the engine/wrapper
  boundary.
- `.github/workflows/ci.yml` runs checks and tests.
- `.github/workflows/pages.yml` deploys `main` to GitHub Pages.

The StoryQuest label is a temporary mechanics-test presentation, not the
canonical long-term game wrapper. Internet Recovery OS remains the first planned
wrapper. Do not expand either presentation until phone testing establishes what
works.

## Canonical product facts

- Finn is the fixed protagonist and player character.
- Chinmay is Finn's uncle, the AI-company CEO/developer, and the fixed main
  antagonist.
- The reusable Reading Engine, Content Platform, Game Rules, and Game Wrapper
  concerns remain separate.
- A future Chinmay voice add-on is optional wrapper presentation, requires
  explicit consent and disclosure, and is not part of the current prototype.
- The app stores no raw audio. A browser or vendor speech service may still
  process audio to produce recognition results.

## Immediate next action

Run [`PHONE_TEST.md`](PHONE_TEST.md) in Safari on iPhone and Chrome on Android.
Test microphone permission, the separate Start reading tap, live highlighting,
correct words, accuracy, pace, WPM, retry, Accept & continue, final review, and
Copy test report.

Paste the copied JSON report into Codex when a device-specific problem occurs.
Use that evidence to choose the next smallest Reading Engine improvement.

## Known limitations

- Real microphone and browser speech-service behavior cannot be validated from
  the current desktop because it has no microphone.
- Web Speech recognition is noisy, browser-dependent, and not a formal reading
  assessment.
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
is the merged basis of the live phone prototype.

## Validation commands

```text
npm run check
npm test
npm run dev
```
