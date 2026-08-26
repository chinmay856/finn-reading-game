# Internet Recovery 98 standalone endgame playtest notes

## Review URL

Start the repository development server with `npm run dev -- --host 127.0.0.1`,
then open:

<http://127.0.0.1:5173/endgame-playtest.html>

This route is a standalone design playtest. It is not linked from
`playable-missions.html`, is not part of the ten-site campaign state machine,
and has not been deployed to Firebase.

## Fixture and persistence boundary

- The playtest starts with ten representative lesson documents and player
  explanations so the complete ending can be tested without replaying the ten
  missions.
- Fixture material is labeled `PLAYTEST FIXTURE` anywhere it could be mistaken
  for a real saved response.
- The only persistence key used by this route is
  `internet-recovery-endgame-playtest-v1`.
- The persisted value contains endgame state IDs and progress only. Fixture
  lesson text and player explanations remain static source data, and this route
  never reads or writes campaign profile/save keys.
- Progress saves after every dismissed Auto pop-up and every correctly locked
  site boundary. Reloading the route resumes that state.

## Playtest-only controls

The purple toolbar above the authored 1440-by-900 stage is not part of the
proposed production ending. It provides:

- a jump menu for the ten authored beats;
- a reduced-motion toggle;
- a fixture reset control; and
- a save/resume status readout.

`Reset fixture` removes only the standalone key above. It never deletes or
changes a campaign profile.

## Interaction paths

The Instruction Builder supports all of these paths:

- drag an instruction card into the target;
- click or tap a card, then choose `Add this instruction`;
- use Tab and Enter/Space for the same select-and-add path.

A wrong choice returns the card with an Amy hint and no progress penalty. A
correct choice locks exactly one boundary and restores exactly one site card.
The six Auto pop-ups close in a deterministic order through large, named X
buttons. The Reading Companion remains visibly minimized and provides no new
read-aloud passages.

## QA matrix

The focused automated contract covers:

- ten sites in reviewed order with production over-fix and secured thumbnails;
- exactly five deterministic choices with exactly one correct choice per site;
- state-machine gating through all ten beats;
- wrong-answer recovery and one-lock-per-correct-answer behavior;
- resume after each pop-up and each site lock;
- persistence isolation and absence of fixture prose in storage;
- popup labels/dialog semantics, non-drag controls, reduced-motion markup, and
  completion/replay behavior; and
- separation from `playable-missions.html` and its runtime.

Manual browser QA is performed at a 1440-by-900 viewport and at 1180 CSS pixels,
plus reduced motion, keyboard-only selection, reload/resume, wrong answer, and
the fixture reset boundary.

## Deliberately unintegrated

- No campaign unlock trigger or completion gate is changed.
- No existing ten-site completion, reflection, lesson document, or replay state
  is changed.
- The historical `docs/gameplay/FINAL_BREACH_RUNTIME_BRIEF.md` remains intact.
- The playtest does not add an eleventh reading passage.
- Review actions after the epilogue show fixture-only lesson and visual replay
  modals; they do not open a production mission.
- No Firebase route has been published for this prototype.

