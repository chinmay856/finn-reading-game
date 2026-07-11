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
- `app.js` — microphone permission, Web Speech API recognition, transcript alignment, highlighting, speed/accuracy scoring, retries, and summary
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

The GitHub repository is now **public**. Earlier in the conversation it was private, which prevented free GitHub Pages hosting. That specific blocker has been removed.

A Pages workflow exists at `.github/workflows/pages.yml`. It is configured to:

- run on pushes to `main`
- run when the repository becomes public
- allow manual dispatch
- configure Pages
- upload the repository as a static Pages artifact
- deploy it with `actions/deploy-pages`

The expected site is:

`https://chinmay856.github.io/finn-reading-game/`

Do **not** assume the site is working merely because the workflow file exists. The previous user-facing link did not work. The first Codex task is to inspect the actual repository, GitHub Actions runs, and Pages configuration, then get a verifiably reachable HTTPS site online.

Potential deployment checks:

1. Confirm the repository is public.
2. Inspect the most recent `Deploy StoryQuest to GitHub Pages` workflow run and logs.
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

---

## Immediate priorities

### P0 — Make the phone link work

Get the GitHub Pages deployment live and verify the exact URL. This is the current blocker.

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

## Definition of done for the next Codex session

A successful next session should end with:

- a public HTTPS URL that opens on the user's phone
- microphone permission working from that URL
- a four-line read-aloud test that can be completed
- visible line/word highlighting
- accuracy, correct words, pace, and WPM shown
- graceful retry/accept behavior
- deployment and local-run instructions updated in the repository
- any remaining browser limitation stated precisely

---

## Copy/paste prompt for Codex Desktop

```text
Open and work on the GitHub repository chinmay856/finn-reading-game.

First read AGENTS.md, docs/ARCHITECTURE_AND_VISION.md, docs/CODEX_HANDOFF.md, and the current index.html, styles.css, app.js, and .github/workflows/pages.yml. Preserve the architecture rule that the reading engine remains separate from game-wrapper concepts.

The immediate job is not a redesign. Get the existing bare-bones mobile read-aloud prototype deployed and genuinely usable on a phone.

Start by inspecting GitHub Actions and GitHub Pages. The repo is public and the expected URL is https://chinmay856.github.io/finn-reading-game/, but the previous link did not work. Diagnose the actual deployment state, fix the workflow or Pages configuration as needed, and verify the final HTTPS URL responds with the prototype. Do not merely tell me how to configure it if you can make the repository change yourself. If one account-level setting is impossible for you to change, give me a single direct settings link and the exact control name.

Then test and harden the current flow for Safari on iPhone and Chrome on Android: microphone permission, a separate user tap to start speech recognition, live line/word highlighting, correct-word count, accuracy %, pacing, WPM, retries, Accept & continue, and the final review. Keep the UI simple, teen-appropriate, and lightly retro. Do not add stars, badges, coins, login, a database, or elaborate game systems yet.

Treat browser speech recognition as noisy rather than ground truth. Make errors understandable and forgiving. Preserve the current no-raw-audio-storage behavior. Add focused diagnostics or a session-result export if it materially helps phone testing.

Run relevant checks, commit the changes, and finish by giving me: (1) the live phone URL, (2) exactly what changed, (3) the browser/device test steps, and (4) any limitation that still prevents a fair mechanics test.
```
