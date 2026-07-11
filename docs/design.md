# Design

Status: Draft

Last reviewed: 2026-07-10

This document captures the intended user experience and system shape. It should
describe implemented reality and clearly label future or unvalidated ideas.

## Experience principles

1. **Reading comes first.** Game mechanics reinforce practice rather than
   distracting from it.
2. **Encouraging, never shaming.** Errors lead to useful prompts and another
   attempt; they do not punish or embarrass the learner.
3. **Short, clear loops.** Each activity has an obvious start, goal, and finish.
4. **Accessible by default.** Touch targets, text, color, audio, motion, and input
   alternatives are designed for varied abilities and environments.
5. **Privacy is part of the experience.** Collect little, explain adult actions,
   and avoid exposing learner information.

## Initial experience map

```text
Launch
  -> choose or resume learner profile
  -> see one recommended activity
  -> complete a short reading loop
  -> receive supportive feedback and progress
  -> continue, pause, or return to the learner home

Adult area
  -> pass an adult gate when appropriate
  -> review progress
  -> manage settings and data
```

This map is a hypothesis until target age, platform, and learning loop are
confirmed in the product requirements.

## Learner interaction guidelines

- Present one primary action at a time.
- Use simple language appropriate to the confirmed reading level.
- Do not rely on color, sound, hover, or time limits alone.
- Make replay, pause, skip, and help behavior explicit where applicable.
- Avoid streak loss, scarcity, or rewards that pressure a child to remain online.
- Keep feedback specific: what worked, what to notice, and how to try again.

## Adult experience guidelines

- Separate adult configuration and privacy controls from the learner loop.
- Summarize progress in plain language, not only scores.
- Explain what data exists, why it exists, and how to export or delete it.
- Avoid presenting practice data as a diagnosis or formal reading assessment.

## Technical design

The implementation stack has not been selected. Once selected, document:

- client and server boundaries;
- supported platforms and browsers;
- authentication and profile model;
- activity/content representation;
- progress and persistence model;
- privacy, consent, retention, export, and deletion behavior;
- offline and degraded-network behavior;
- telemetry boundaries;
- test strategy and deployment environments.

Use architecture decision entries in `decision-log.md` for durable choices. Do
not let this document become an unreviewed list of implementation guesses.

## Accessibility checklist

- Keyboard and switch-accessible controls where applicable.
- Visible focus and logical navigation order.
- Minimum target sizes suitable for touch.
- Sufficient contrast and non-color status cues.
- Text scaling without loss of content or function.
- Captions, transcripts, or visual equivalents for meaningful audio.
- Reduced-motion behavior for non-essential animation.
- No essential interaction depends solely on speed.
- Testing with representative assistive technologies before release.

## Content and safety

- Review learner-facing text and imagery for age appropriateness.
- Keep generated content out of production learner flows until moderation,
  failure modes, and adult controls are defined.
- Never include real child data in fixtures, screenshots, prompts, or examples.
- Record content provenance and licensing before shipping third-party assets.

## Open design questions

- What is the first activity loop?
- What visual and narrative theme is appropriate for the learner?
- How will audio recording or playback work, if used?
- Which actions require an adult gate?
- What does progress mean for the chosen learning skill?
