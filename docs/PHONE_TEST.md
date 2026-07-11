# Preserved phone side-test checklist

> This document describes the earlier Web Speech mobile loop. It is retained as
> a side-test reference only. Desktop local-Whisper work is the current priority;
> do not spend further time optimizing this path unless the user asks. The
> implementation remains in Git history at commit `40fc399` and the preserved
> `agent/phone-pages` branch. The live root URL now follows `main` and may no
> longer match every step below.

Use the published HTTPS site for microphone and speech testing:

<https://chinmay856.github.io/finn-reading-game/>

Do not open a downloaded HTML file or a ChatGPT attachment. Microphone and
speech-recognition behavior depends on the browser, origin, permissions, device,
and network.

## Before the test

- Use Safari on iPhone/iPad or Chrome on Android.
- Open the link as a normal browser tab, not inside another app's embedded
  browser.
- If an older build appears, reload the page once.
- Keep the phone connected to the internet. The browser may use a vendor speech
  service even though this app does not store audio.

## Test the four-line loop

1. Confirm the setup screen reports `HTTPS`, `Microphone`, and
   `Speech recognition` as `ready`.
2. Tap **Enable microphone** and choose **Allow** when the browser asks.
3. Confirm the app does not begin listening automatically.
4. Tap **Start reading** as a separate action.
5. Read only the highlighted line. Pause, repeat a word, or self-correct at least
   once so the forgiving alignment can be observed.
6. Confirm words change state while the browser transcript updates and the
   current line remains visually obvious.
7. Confirm **Correct words**, **Accuracy**, **Pace**, and **Speed** update.
8. Tap **Stop listening** if the browser does not stop by itself, then tap
   **Check line**.
9. On a low estimate, use **Retry line** once. If the browser clearly heard the
   line incorrectly, use **Accept & continue**.
10. Complete all four lines and confirm the final review shows accuracy, average
    WPM, first-try lines, retries, per-line results, and the comprehension check.
11. Tap **Copy test report**. Paste that JSON into the next Codex or ChatGPT
    message when a phone-specific failure needs diagnosis. The report contains
    scores and browser diagnostics, never audio.

## Expected error behavior

- `No speech was detected`: nothing is scored; tap **Start reading** again.
- `Microphone or speech recognition was blocked`: allow Microphone for this site
  in the browser's site settings, then reload.
- `No microphone input was available`: close other audio apps and try again.
- `Speech service could not be reached`: check the connection and retry.
- If `Speech recognition` reports `not available`, the device/browser does not
  expose the Web Speech recognition API to this page. Copy the browser details
  from **Phone test details** and try the other target browser if available.

## Local UI check

The project has no third-party dependencies. With Node.js installed:

```text
npm run dev
```

Open <http://127.0.0.1:4173/>. Localhost can validate layout and controls, but
the published HTTPS URL is the fair phone microphone test.
