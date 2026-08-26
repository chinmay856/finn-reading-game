# Internet Recovery 98 standalone endgame playtest notes

## Review URL

Start the repository development server with `npm run dev -- --host 127.0.0.1`,
then open:

<http://127.0.0.1:5173/endgame-playtest.html>

The endgame keeps its own state machine and persistence namespace, but is now
connected to the ten-site campaign. A completed campaign can open it from the
Recovery Browser or Documents, and Finish returns to the completed Recovery
Browser. The published route is:

<https://internet-recovery-98.web.app/endgame-playtest.html>

## Fixture and persistence boundary

- A direct diagnostic visit starts with ten representative player explanations
  so the complete ending can be tested without replaying the ten missions. A
  campaign launch reads the active profile's real saved explanations.
- Fixture material is labeled `PLAYTEST FIXTURE` anywhere it could be mistaken
  for a real saved response.
- The only key written by this route is
  `internet-recovery-endgame-playtest-v3`.
- The persisted value contains endgame state IDs and progress only. Fixture
  lesson text and player explanations remain static source data. Campaign mode
  may read `internet-recovery-save-files-v1` to display the active profile's
  explanations, but never writes that key.
- Progress saves after every dismissed Auto pop-up and every correctly restored
  document part. Reloading the route resumes that exact state.

## Playtest-only controls

The toolbar above the authored 1440-by-900 stage is not part of the proposed
production ending. It provides:

- a jump menu for the nine authored beats;
- a skip-current-step control for rapid review;
- a reduced-motion toggle;
- a fixture reset control; and
- a save/resume status readout.

`Reset endgame` removes only the standalone key above. It never deletes or
changes a campaign profile.

## Interaction paths

Each saved document begins as three visibly scrambled red panels. The player
restores Auto's saved lesson, then the player-explanation fixture, then the
extra boundary instruction. A site's thumbnail changes from its site-only Auto
over-fix crop to its site-only recovered crop only after all three parts are
correct.

The Instruction Builder supports all of these paths:

- drag an instruction card into the target;
- click or tap a card, then choose `Add this instruction`;
- use Tab and Enter/Space for the same select-and-add path.

A wrong choice returns the card with an Amy hint and no progress penalty. Each
correct choice restores exactly one document part. The six large Auto pop-ups
arrive one at a time at one-second intervals in irregular, strongly overlapping
positions. Each X is visible immediately but remains disabled until the full
takeover has appeared; the windows then close last-in-first-out through named X
buttons. Their generated illustrations are based on the canonical Auto design.
There is no Reading Companion and no new read-aloud passage.

The final celebration uses one persistent canvas. Multiple Technos travel at
varied speeds through gravity-driven, bouncing arcs, and every animation frame
is stamped without clearing the prior positions. The accumulating trails keep
filling the desktop like the classic Solitaire win animation, without separate
free-flying sprites or a fixed card-count cap. Clicking the cascade removes the
canvas and starts individual Amy and Chinmay dialogs. The last dialog belongs
to Techno and offers saved-lesson review, recovered-site replay,
desktop-incident replay, and finish actions.

## QA matrix

The focused automated contract covers:

- ten sites in reviewed order with site-only production over-fix and secured
  crops;
- thirty ordered repair steps, each with five deterministic choices and exactly
  one correct answer;
- state-machine gating through all nine beats;
- wrong-answer recovery and one-part-per-correct-answer behavior;
- resume after each pop-up and each restored document part;
- persistence isolation and absence of fixture prose in storage;
- popup labels/dialog semantics, non-drag controls, all 26 site-crop and Auto
  popup assets, timed takeover gating, pointer-drag fallback, reduced-motion
  markup, and completion/replay behavior; and
- persistence isolation plus the completed-campaign Documents replay link and
  Recovery Browser return.

Manual browser QA is performed at a 1440-by-900 authored stage and at 1180 CSS
pixels, plus reduced motion, keyboard-only selection, reload/resume, wrong
answer, and the fixture reset boundary.

## Production boundary

- The endgame becomes available only when the active profile has completed all
  ten sites; the ten mission state machines and their completion gates remain
  unchanged.
- No existing ten-site completion, reflection, lesson document, or replay state
  is changed.
- The historical `docs/gameplay/FINAL_BREACH_RUNTIME_BRIEF.md` remains intact.
- The playtest does not add an eleventh reading passage.
- Review actions after the Techno finale show the displayed Auto lesson and
  player explanation. Recovered-site replay returns to the production campaign.
- The production Documents window exposes `Replay endgame` only after all ten
  campaign sites are complete. That link starts a fresh isolated incident while
  reading the active profile's saved explanations; it does not copy profile
  data into the endgame namespace.
- The campaign and endgame are published together at the branded Firebase site.
