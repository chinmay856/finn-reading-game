# Three-site playable integration handoff — 2026-08-16

Status: local vertical slice implemented and verified. This is a playtest entry,
not a replacement for the legacy campaign entry yet.

## Playtest entry

Open `playable-missions.html` with one of these query routes:

- `?site=wikiwhy`
- `?site=spotty-fi`
- `?site=amaze-on`

Add `&streamingGuide=1` to request the optional Sherpa live-guide lane. When
browser isolation, streaming PCM, or the pinned Sherpa runtime is unavailable,
the Reading Companion falls back to periodic Whisper checkpoints. Whisper still
owns the final assessment in either mode.

## Preserved interaction contract

1. Finn prepares the local model and starts one continuous read.
2. Manual **Finish now** remains available after capture begins. A good-faith
   finished attempt counts even if the voice check is unavailable.
3. Strong end evidence, at least 90 percent guide continuity, and five seconds
   after endpoint evidence may finish automatically.
4. The result uses friendly coverage and pace bands. Faster reading is never
   penalized and there is no player-facing numeric accuracy score.
5. Reading completion does not yet change the site. Finn answers the quick check
   until correct; only then does exactly one reviewed visual repair appear.
6. **Retry reading** is voluntary and never applies the repair twice.
7. The midpoint uses reusable DOM dialogue over the reviewed repaired state,
   switches to Auto's super-corruption, then opens the repair checklist.
8. The final correct check restores the secured site and opens the **Teach Auto**
   reflection. Auto's receipt appears only after Finn sends a nonempty lesson.

Passage progress and site-repair progress are independent. Aggregate bands are
saved locally without transcript or audio. Audio, transcript, and trace are saved
only when the visible troubleshooting checkbox is selected; the same panel
provides a deletion control.

## Visual mapping

The wrapper displays the reviewed 1440 by 900 flattened state as the fixed stage.
An opaque live Reading Companion replaces the static companion at the reviewed
right-window boundary. Current and next frames are loaded on demand rather than
eager-loading all 47 source PNGs.

- WikiWhy: 6 initial repairs, midpoint, 3 locks, reflection.
- Spotty-Fi: 5 initial repairs, midpoint, 4 locks, reflection.
- Amaze-On: 6 initial repairs, midpoint, 5 locks, reflection.

## Intentionally open for Chinmay review

- The exact Amy, Chinmay, and Auto popup copy is draft, as previously agreed.
- WikiWhy now uses a nine-passage dog-color-vision playtest deck matching the
  approved anchor. The prose and comprehension checks still require substantive
  human content review before production approval.
- Spotty-Fi and Amaze-On retain the existing candidate decks plus the minimum
  integration-draft passages needed to match their reviewed visual timelines.
- The playtest is a separate entry because the existing home screen and legacy
  campaign router still represent the earlier implementation direction.
- Techno remains baked into the reviewed WikiWhy states and is absent from the
  other two. A shared animated runtime pet layer remains a later integration.

## Verification

- `npm run check`
- `npm test` (454 passing)
- `npm run build`
- `git diff --check`
- Browser QA at a 1280 by 720 viewport for all three site routes
- Local Whisper preparation and microphone-timeout recovery smoke test

