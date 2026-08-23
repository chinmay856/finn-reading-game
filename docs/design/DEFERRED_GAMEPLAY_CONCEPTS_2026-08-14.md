# Deferred gameplay concepts — 2026-08-14

Status: **concepts directed by Chinmay; implementation details and privacy behavior
remain review-gated**

These ideas are now part of the intended mission flow. They remain unimplemented and
must be specified after the storyline review and Reading Engine validation.

## Per-passage comprehension activity during result processing

After Finn finishes reading each passage, the Reading Companion presents a short
comprehension check before revealing the reading score. This gives Finn something
meaningful and game-like to do while the speech engine processes the recording and
prepares the final passage results.

The activity should:

- relate directly to the passage Finn just read;
- appear before the speed, accuracy, and other reading feedback;
- occupy genuine processing time rather than introduce an artificial delay; and
- hand off smoothly to the completed score when both the check and engine result
  are ready.

The exact question format, scoring relationship, fallback when processing finishes
early or late, and behavior after transcription failure remain to be designed.

## Final site reflection and AI lock-in

Every site ends with an Amy popup that asks Finn to lock in the repairs by explaining
what the AI needs to learn so it will not repeat the site's mistakes. Finn types a
paragraph about what he learned from that site.

The paragraph serves two possible later uses:

- a discussion prompt for Finn and his parents; and
- a discussion prompt for Finn and the game team or facilitator.

This is a final comprehension/reflection beat after the site-specific visual endgame,
not a replacement for the reading passages or their visible repair progress.

Before implementation, this concept still needs decisions about prompt wording,
whether and how the paragraph is evaluated, optional supports for typing and speech,
data storage and deletion, who may view or export it, and explicit parent/player
consent and privacy expectations.
