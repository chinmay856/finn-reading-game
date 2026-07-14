# Playtest review handoff — 2026-07-13

## Completion update — 2026-07-13

The gameplay, story, layout, and visual TODOs in this handoff are implemented
in the ten-site completion candidate. The six missing image-led frames are in
place; every site has honest phase counts plus Amy/Chinmay midpoint and ending
payoffs; site-correct routing, stale popup cancellation, result return, map
counts, FacePlace AVOCADO, and one-Techno behavior have automated regressions.
The integrated suite now passes 360 tests.

Browser QA at 1280x720 covered entry, midpoint, and secured states across all
ten sites (WikiWhy through its entry route and the other nine through their
diagnostic previews). The nine fixed site frames measured exactly 4:3, with no
document or active-screen overflow and exactly one visible Techno. MapGuess's
bottom tracker visibly moves H4 to D7 while its vintage ETA remains stuck at
two minutes.

The only deliberately unclosed items below are not site-mechanics TODOs:
independent content approval and real-microphone/latency evidence. The user
explicitly excluded speech-engine work from this pass. Do not reopen those
areas as part of visual or gameplay polish.

## Start here

- Authority: GitHub `main` at `5b5613d` (PR #113).
- Live checkpoint: <https://chinmay856.github.io/finn-reading-game/?build=5b5613d>
- This is a useful test checkpoint, not the final review build.
- Preserve the dirty primary checkout. Start new work from current
  `origin/main` in a clean `agent/<description>` worktree.
- Before changing gameplay, UI, content, or speech behavior, reread
  `AGENTS.md`, `docs/ARCHITECTURE_AND_VISION.md`, `docs/PROJECT_STATUS.md`, and
  `README.md`.

## What shipped in build 5b5613d

- Search-ish, Spotty-Fi, and MapGuess use a locked 4:3 illustrated base frame
  with stable HTML overlays for changing repair text and controls. This is the
  preferred visual direction: consistent geometry between repair states with
  only the state-specific layer changing.
- Search-ish now resembles the playful supplied reference instead of a grid of
  diagnostic boxes. Repaired source rows change from red to green in place.
- MapGuess now resembles a playful street-map application, not satellite or
  fantasy terrain art, and uses a smooth illustrated route.
- Spotty-Fi reads as a green/pink music player with album art and visible
  previous, play/pause, and next controls.
- Site content and story dialogs use a Comic Sans-style throwback font. The
  trusted outer OS chrome stays restrained for legibility.
- All ten initial site boards were browser-audited at 1280x720 with no document
  overflow and no nested scrolling panes.
- Candidate TEST routing is site-specific instead of falling back to WikiWhy.
  The shared reading stage uses the selected site's identity and passage.
- The microphone flow exposes `Prepare microphone` followed by `Start reading`,
  and the prepared recognizer/model can be reused in the tab.
- The active reading line sits near the top so upcoming text has more headroom.
  Ordinary sentences are not split at arbitrary word counts.
- Results render as an overlay over the site; continuing returns to the owning
  site instead of replacing the campaign with a diagnostics page.
- Returning to the Recovery Map clears stale story timers/dialogs so the
  previous site should not continue firing popups.
- The Recovery Map shows passage counts for all ten sites and a recovered-site
  count. Player-facing `canonical`, `campaign test build`, and most
  fixture/review labels were removed or hidden.
- Every non-WikiWhy site has an Amy/Chinmay entry exchange. FacePlace includes
  an extra AVOCADO reading beat before Amy explains that the progress bar is
  lying and opens the second half of the recovery.
- Techno uses one active presentation at a time, with popup alert, reading
  ball-push, celebration, and one-minute idle sleep behavior drawn from the
  existing optimized sprite set.
- Validation passed: `npm.cmd run check`, 342/342 tests, production build, and
  a ten-site browser overflow audit.

## Product direction to preserve

The target is the playful Recovery Map thumbnails and the supplied Search-ish
reference—not dense admin dashboards. Prefer one strong, readable scene with a
few delightful details over many bordered text boxes. Image-led sites are
acceptable and often preferable. Keep semantic HTML overlays for changing copy,
progress, buttons, focus, and accessibility. All frames for one site must share
the same aspect ratio, window geometry, palette, and overlay coordinates so
transitions do not jump.

The player should always understand three things without developer notes:

1. What the AI corrupted: red, wrong, duplicated, suspicious, or visibly
   overwritten.
2. What Finn repaired: the same element changes in place to green/clean.
3. What to do next: one dominant action, with Amy or Chinmay explaining the
   story reason when needed.

Do not expose `canonical`, `noncanonical`, `provisional`, `fixture`, `candidate`,
`Act I/II/III`, content-review status, or editor notes to the player. Those can
remain in data and tests. If a fiction disclaimer is needed, use one friendly
statement at game start instead of repeating `fictional` throughout every site.

## Next implementation order

### P0 — prove the full game loop is correct

1. Regression-play all ten sites from a clean tab. For each site, use both the
   normal `Read next passage` action and TEST. Confirm the selected site,
   passage, reading stage, result overlay, and return destination all match.
   Specifically recheck ViewTube, Search-ish, Amaze-On, Spotty-Fi, and MapGuess,
   which previously opened WikiWhy.
2. Reproduce the old cross-campaign leak: enter one site, return to the Recovery
   Map before its popup fires, enter another site, and wait. No timer, popup,
   selected passage, diagnostic phase, or companion copy from the first site
   may appear. Add an automated regression around campaign/session ownership.
3. Complete every candidate passage path. All passages should be testable while
   production approval remains fail-closed. Keep TEST, but keep wrapper-only
   diagnostics and developer notes visually quiet.
4. Verify FacePlace's exact sequence: three initial repairs, one extra passage
   while the meter reads AVOCADO, Amy's “the progress bar is not honestly
   showing what is happening” popup, then the second recovery phase. The extra
   beat must not create fake permanent evidence.
5. Verify the Recovery Map after every result. Each card must show passages
   cleared for that site; finishing a site must update 0/10 through 10/10.
   Returning home must never retain the wrong site's campaign UI.
6. Verify results stay in a popup over the current site. `Continue` returns to
   the site, preserves its repaired visual state, and offers the next sensible
   action. Never route through a full-screen diagnostics page.

### P1 — finish the image-led visual redesign

1. Treat the Recovery Map thumbnails and supplied Search-ish mockup as the
   visual bar. Search-ish, MapGuess, and Spotty-Fi are the first locked-frame
   examples; review them in the live checkpoint before extending the system.
2. Redesign ThreadIt, FacePlace, MyCorner, Yahuh, ViewTube, and Amaze-On into
   simpler, playful scenes matching their thumbnails. Prefer generated base art
   plus a small semantic overlay over more nested boxes.
3. For every site, create one fixed frame template and a small sequence of
   repair states. Replace one corrupted line/object at a time in the same
   location. Keep image dimensions, colors, browser chrome, and crop identical.
4. Make corruption versus repair unmistakable: red/suspicious for bad state,
   green/settled for corrected state. Avoid corrupt and clean sites side by
   side; the recovery should feel like one site repaired in place.
5. Replace the hard left-to-right wipe with a soft overlapping or feathered
   edge. Keep layers close at the boundary. Preserve the attractive AI overwrite
   background when `Compare versions` or `Start Shield Protocol` opens a popup;
   a popup may dim it but must not reset to an older state.
6. Keep every site visible without page or nested-panel scrolling at the
   supported desktop size. Do not hide an extremely tall page. Reduce side-panel
   width, border thickness, metadata, and repeated controls first.
7. Search every player-facing state for jargon and overlap. Remove remaining
   baked/runtime `Act`, `fixture`, `provisional`, `canonical`, `candidate`, and
   repeated `fictional` labels. Fix clipped images, collisions, empty space,
   tiny controls, and unnecessary borders.
8. Control payload growth. Optimize art to WebP, reuse one base frame per site,
   and implement repair differences as small overlays where convincing.

### P1 — make the story legible on every site

1. Give every site a short Amy and Chinmay arc: entry setup, midpoint reaction,
   and completion payoff. Entry exchanges exist; midpoint and completion copy
   still need a complete site-by-site story pass.
2. Amy helps Finn identify the evidence problem. Chinmay is sincere, anxiously
   overconfident, increasingly frazzled, long-haired, and never villainous. His
   AI—not Chinmay—is the antagonist.
3. Popups explain why the next interaction matters, not implementation status.
   A 14-year-old should be able to summarize the site's problem and what changed
   without repository terminology.
4. Techno is one character and cannot be in two places. Assert exactly one
   active Techno across desktop pet, popup, reading progress, and payoff. Use a
   larger alert sprite over a dimmed popup, smaller companion during reading or
   browsing, ball-push for passage progress, sleep after sixty seconds, and the
   appropriate celebration/inspection sprites elsewhere.

### P1 — improve the reading experience with evidence

1. Run a real desktop microphone playtest around 180–220 WPM. Record only
   timings and non-audio summary metrics. Do not upload or retain voice audio or
   transcript text.
2. Measure click-to-ready, speech-to-highlight, end-of-reading detection, and
   final-score availability separately. The reported player run took about 112
   seconds to produce a final score and felt choppy; that is not acceptable even
   if simulated tests pass.
3. Keep the active line near the top with several upcoming lines visible. Finn
   should continue naturally through recognition lag instead of stopping for
   the highlight.
4. Verify authored line units for every passage. Do not split ordinary
   sentences in the middle. Reduce font size only enough for useful forward
   headroom while keeping comfortable size and spacing.
5. Keep `Prepare microphone` and `Start reading` unmistakable. Preparing once
   should be reusable across passages in the same tab; a new passage should not
   feel like loading another app.
6. Keep live guidance and final scoring separate. The guide may use low-latency
   local evidence; final Whisper scoring remains authoritative. Never replace
   measured latency with time-based highlight movement.
7. Before changing speech dependencies, follow the research gate: verify the
   maintained upstream version, browser support, privacy, license, model size,
   hosting headers, and a narrow microphone-to-transcript spike. Use licensed
   clips with known transcripts for repeatable benchmarks, then confirm comfort
   with a consenting real reader.

## Required visual QA before the next review

Use the production build at the target desktop size, not only DOM tests. Inspect
the Recovery Map, all ten initial sites, midpoint and secured states, popups,
setup, active reading, result overlay, and return flow. Ask on each screen:

- Would a 14-year-old know what is wrong and what to click next?
- Does it look playful and intentional, or like a developer dashboard?
- Is the repaired element visibly replacing the corrupted one?
- Is any image cut off, text overlapping, or important content hidden?
- Is there any scrollbar or tall unused page?
- Is exactly one Techno visible and behaving appropriately?
- Does it still look like the same site before and after the repair?

Fix anything weird before requesting review. Capture representative screenshots
and update `docs/design/DESIGN_REQUESTS.md` when the executable visual state
materially changes.

## Completion gate for the next review build

- `npm.cmd run check`, `npm.cmd test`, and `npm.cmd run build` pass.
- Automated regressions cover site-correct routing, stale popup cancellation,
  FacePlace's AVOCADO beat, per-site counts, recovered count, one-Techno
  exclusivity, result return flow, and stable line segmentation.
- Browser QA finds no page/nested scrolling, horizontal overflow, collisions,
  or clipped key art across all required states.
- A measured microphone report distinguishes guide latency from final-score
  latency and documents remaining uncertainty honestly.
- Publish a cache-busted GitHub Pages URL and list fixes plus known gaps.

## Likely implementation surfaces

- `app.js`: screen/session ownership, popup timers, candidate routing, result
  flow, FacePlace beat, microphone preparation, and Techno state.
- `index.html`: stable semantic overlays and player-facing copy.
- `apps/internet-recovery/playful-frame-system.css`: locked-frame overlays,
  Comic Sans site typography, compact rules, and transitions.
- `apps/internet-recovery/art/site-assets/*-frames/`: optimized base artwork.
- `apps/internet-recovery/*-state.js`, `*-view.js`, and `*-copy.js`: site story
  state and wrapper copy; do not leak it into the Reading Engine.
- `reading-guide.js`, `reading-engine.js`, and `speech/`: only neutral,
  evidence-backed changes.
- `tests/`: behavior contracts and regressions; browser screenshots remain a
  separate required acceptance step.
