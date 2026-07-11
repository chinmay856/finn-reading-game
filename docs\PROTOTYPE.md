# Mobile read-aloud prototype

## Purpose

This static prototype tests one complete read-aloud repair loop on a phone. It is
deliberately small and uses no build dependencies.

## Architecture map

| Layer | Location | Owns |
| --- | --- | --- |
| Content Platform | `packages/content-platform/` | Wrapper-neutral passage records and long-form-compatible identifiers |
| Reading Engine | `packages/reading-engine/` | Tokenization, forgiving alignment, progress, scoring, and browser speech input |
| Game Rules | `packages/game-rules/` | Configurable translation from reading results to neutral progress rewards |
| Shared | `packages/shared/` | Minimal theme-neutral local session persistence |
| Game Wrapper | `apps/internet-recovery/` | Retro UI, story copy, themed reward names, and repair presentation |

The engine never emits Internet Recovery terms. The wrapper converts neutral
progress units into bandwidth and owns all themed copy.

## Run locally

Serve the repository over localhost, then open `/`. ES modules do not reliably
run from a `file://` URL.

```powershell
npm run dev
```

The microphone path requires HTTPS or localhost. GitHub Pages is suitable for
phone testing because it serves over HTTPS.

## Test

```powershell
npm test
```

Tests cover forgiving transcript alignment, fillers, repeated and skipped words,
theme-neutral engine results, and theme-neutral game-rule outputs.

## Device test checklist

- Open the HTTPS link on Finn's phone.
- Confirm text sizing, touch targets, focus order, and reduced-motion behavior.
- Grant microphone permission and read the entire passage naturally.
- Pause, repeat a word, restart a phrase, and self-correct.
- Confirm highlighting remains understandable and feedback feels forgiving.
- Confirm the themed repair consequence appears immediately.
- Deny microphone permission and confirm the error is clear and the demo remains usable.
- Record browser/OS, transcript behavior, confusing moments, and Finn's reaction.

## Known prototype limits

- Browser speech-recognition availability and behavior vary by browser and OS.
- No audio is stored by this code. Browser speech-recognition services may process
  audio remotely according to the browser vendor's behavior and policies; confirm
  that behavior before real learner use.
- The greedy alignment is intentionally forgiving and diagnostic, not a formal
  assessment.
- Persistence contains only a small local summary and has no account sync.
- Pace in the automated transcript demo is synthetic and not meaningful.
