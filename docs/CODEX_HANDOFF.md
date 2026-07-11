# Codex Desktop Handoff — Game for Finn

**Snapshot date:** July 11, 2026  
**Repository:** `chinmay856/finn-reading-game`  
**Default branch:** `main`  
**Expected GitHub Pages URL:** `https://chinmay856.github.io/finn-reading-game/`

## Read these first

Before editing code, read:

1. [`AGENTS.md`](../AGENTS.md)
2. [`ARCHITECTURE_AND_VISION.md`](ARCHITECTURE_AND_VISION.md)
3. This handoff
4. The current prototype files: [`index.html`](../index.html), [`styles.css`](../styles.css), [`app.js`](../app.js)
5. The Pages workflow: [`.github/workflows/pages.yml`](../.github/workflows/pages.yml)

The architecture document is the canonical long-term source of truth. This handoff captures the current prototype and immediate next task.

---

## Product intent from the conversation

Finn is 14. He does not currently enjoy reading and may be a couple of years behind in reading comprehension. He likes video games and puzzles. The broader goal is to make reading aloud feel like the input mechanic for a game rather than homework.

The user initially explored a highly gamified avatar experience, then deliberately simplified it. The current prototype should feel:

- appropriate for a teenager, not an eight-year-old
- crisp, direct, and mobile friendly
- lightly retro, inspired by 1990s educational computer games and typing games
- original rather than a copy of Mario, Nintendo characters, or other protected assets
- focused on the speaking/highlighting/scoring loop, not decorative game systems

For this mechanics test, avoid stars, badges, coins, elaborate avatars, economies, and large game dashboards. The user specifically wants to test whether reading at a target pace and accuracy is understandable and fun.

The metrics the user cares about are:

- current line or word highlighting
- correct words
- accuracy percentage
- pacing feedback
- reading speed in words per minute

The user also liked the vocabulary-test concept, but vocabulary and deeper game systems are not the first priority. First prove the read-aloud loop on Finn's phone.

---

## Current prototype

The current site is a dependency-free static web app:

- `index.html` — setup, live reading, and review screens
- `styles.css` — mobile-first dark/green retro interface
- `app.js` — phone/browser integration, UI state, retries, review, and the
  privacy-safe test-report export
- `reading-engine.js` — theme-neutral transcript normalization, forgiving word
  alignment, and scoring data
- `tests/` — zero-dependency Node tests for alignment and the UI/engine boundary
- `.nojekyll` — keeps GitHub Pages from applying Jekyll processing
- `.github/workflows/pages.yml` — GitHub Pages deployment through Actions

### Current flow

```text
Open site
→ choose target minimum/maximum WPM and accuracy goal
→ grant microphone permission
→ tap Start reading
→ read one highlighted line aloud
→ see transcript and live word feedback
→ receive estimated accuracy, WPM, pace, and correct-word count
→ retry a line or accept the browser result
→ complete four lines
→ see a review summary and one comprehension question
```

The included passage uses public-domain text inspired by *The Secret Garden*.

### Current scoring implementation

`app.js` currently:

- normalizes expected and spoken words
- compares them with an edit-distance-style alignment
- marks expected words as matched or missed
- estimates line accuracy from matched words
- estimates WPM from recognized words and elapsed speaking time
- classifies pace against configurable minimum and maximum WPM
- allows retries when pace or accuracy misses the target
- allows `Accept & continue` because browser recognition can be wrong
- aggregates line results for the review screen

Current defaults are approximately:

- minimum pace: 85 WPM
- maximum pace: 150 WPM
- accuracy goal: 85%

Treat these as prototype settings, not validated learning standards.

### Privacy behavior

The prototype does not intentionally save audio recordings. It requests microphone access, stops the temporary media stream after permission testing, and uses the browser's speech-recognition implementation to produce a transcript. Browser or platform speech services may process audio according to their own behavior, so do not claim that recognition is fully local.

---

## Deployment state

The GitHub repository is **public**, GitHub Pages is enabled with **GitHub
Actions** as its source, and HTTPS is enforced. The live phone URL is:

<https://chinmay856.github.io/finn-reading-game/>

The original deployment failures occurred because the Pages site had not been
created. The workflow token could not create it and failed with `Resource not
accessible by integration`. Codex enabled Pages through the authenticated
repository API, after which the same workflow completed successfully.

A Pages workflow exists at `.github/workflows/pages.yml`. It is configured to:

- run on pushes to `main`
- run when the repository becomes public
- allow manual dispatch
- configure Pages
- upload the repository as a static Pages artifact
- deploy it with `actions/deploy-pages`

The expected site is:

`https://chinmay856.github.io/finn-reading-game/`

Verify the site and its static assets after each deployment rather than assuming
the workflow result alone proves the phone URL is serving the intended commit.

Deployment verification checklist:

1. Confirm the repository is public.
2. Inspect the most recent `Deploy Game for Finn to GitHub Pages` workflow run and logs.
3. Confirm repository **Settings → Pages → Build and deployment** is using **GitHub Actions**.
4. Confirm Actions are enabled for the repository.
5. Confirm the `github-pages` environment was created and deployment succeeded.
6. Check that `index.html`, `styles.css`, and `app.js` are present on `main` and use relative URLs.
7. Verify the live URL with an HTTP request and in a real browser.
8. If the existing Pages workflow is the problem, repair it rather than introducing unnecessary frameworks.

If an account-level setting cannot be changed from Codex, give the user one exact direct link and one clearly named control to change. Avoid long setup tutorials.

---

## Mobile and speech constraints

The prototype must be tested as a top-level HTTPS page. Opening `index.html` as a ChatGPT attachment or local file is not a valid phone test because microphone and speech APIs depend on origin and browser permissions.

Initial target browsers:

- Safari on iPhone/iPad
- Chrome on Android

The current implementation uses `window.SpeechRecognition || window.webkitSpeechRecognition`. Browser speech recognition varies by browser, OS, network, accent, and vendor service. It may stop unexpectedly, return delayed interim results, or misrecognize words. The prototype should be forgiving and should expose enough diagnostics to distinguish:

- microphone permission failure
- unsupported speech-recognition API
- speech-recognition service/network failure
- real pronunciation/reading differences
- alignment/scoring bugs

Do not treat browser transcription as ground truth. Keep `Accept & continue` or an equivalent correction path during early testing.

The current hardened prototype also:

- creates a fresh recognition instance for each explicit **Start reading** tap;
- never auto-restarts recognition and never auto-accepts a browser estimate;
- explains common permission, no-speech, audio-capture, and network failures;
- tolerates fillers, repeats, skipped words, near recognition matches, and
  self-corrections in the theme-neutral `reading-engine.js` module;
- excludes silence between recognition attempts from WPM timing;
- can copy a session JSON report containing scores and diagnostics but no audio.

Use [`PHONE_TEST.md`](PHONE_TEST.md) for the exact iPhone and Android checklist.

---

## Immediate priorities

### P0 — Make the phone link work (completed)

GitHub Pages is enabled, the workflow deploys successfully, and the root page,
stylesheet, and JavaScript respond over HTTPS. Re-verify after each main-branch
deployment.

### P1 — Validate the smallest enjoyable loop

On a phone, verify:

1. The page loads without horizontal scrolling.
2. Tapping the microphone button produces a browser permission prompt.
3. Granting permission returns to a clear ready state.
4. A fresh user gesture starts recognition.
5. Spoken words advance highlighting in a believable way.
6. Finn can always tell which line to read.
7. Live stats update without distracting from the text.
8. Pauses and self-corrections do not produce excessive punishment.
9. A recognition mistake can be retried or accepted.
10. The review screen is understandable.

### P2 — Improve reliability before adding more game

Once the live link works, inspect and improve:

- recognition restart behavior on mobile
- accidental double-starts and `InvalidStateError`
- handling of `not-allowed`, `no-speech`, `audio-capture`, `network`, and aborted events
- line completion detection
- tolerance for repeated words, skipped function words, contractions, and self-correction
- WPM timing so silence before speech does not distort pace
- visual distinction among current, correct, uncertain, and missed words
- a small debug panel or downloadable session JSON for testing, without saving raw audio

### Not yet

Do not spend the next iteration on:

- authentication
- accounts or databases
- complex avatars
- badges, currencies, or reward economies
- a large content-management system
- AI-generated art
- uploading full books
- a server transcription backend unless browser recognition proves unusable

Keep interfaces between the Content Platform, Reading Engine, Game Rules, and Game Wrapper clean so those capabilities can be added later.

---

## Definition of done for the next phone test

A successful next session should end with:

- a public HTTPS URL that opens on the user's phone
- microphone permission working from that URL
- a four-line read-aloud test that can be completed
- visible line/word highlighting
- accuracy, correct words, pace, and WPM shown
- graceful retry/accept behavior
- deployment and local-run instructions updated in the repository
- any remaining browser limitation stated precisely
