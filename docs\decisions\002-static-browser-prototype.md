# ADR-002 — Use a dependency-free browser prototype for the first read-aloud loop

**Status:** Proposed for prototype validation

## Context

The current stage must test microphone permission, live highlighting, forgiving
feedback, and an immediate game consequence on a phone. The production stack and
speech provider are not yet selected.

## Decision

Implement the first loop as static HTML, CSS, and JavaScript modules. Put browser
speech recognition behind a Reading Engine adapter, provide a transcript demo
fallback, keep content and game rules in separate modules, and keep all Internet
Recovery terminology inside its wrapper.

## Consequences

- The prototype can be hosted quickly over HTTPS without a build pipeline.
- The core alignment and rule functions can be tested without the wrapper.
- Browser speech recognition is an experiment, not a committed production
  provider, and must be replaced without changing game/content interfaces.
- Phone and browser compatibility must be validated before the approach is
  accepted beyond the prototype.
