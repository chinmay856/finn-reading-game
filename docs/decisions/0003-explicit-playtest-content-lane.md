# ADR-003 — Keep unreviewed playtest content distinct from approved content

## Status

Accepted for full-game playtest integration on 2026-07-12.

## Context

The complete first-run manuscripts need to be experienced inside their actual
site campaigns before the user can review the game coherently. Production
selection correctly rejects candidates until independent reviews and real
microphone evidence pass. Relabeling those candidates as approved would erase
that truth; keeping every campaign disconnected would prevent the requested
full playthrough and contextual review.

## Decision

The Content Platform exposes a separate playtest selector for structurally
complete `candidate` records. A selected record remains a candidate, retains
its pending review manifest, and is explicitly marked noncanonical. Production
selection and canonical evidence continue to require the existing approved or
prototype rules.

Wrapper integrations must label the lane `PLAYTEST · REVIEW PENDING`, must not
count its evidence toward production completion, and must preserve non-audio
privacy and the shared Reading Engine behavior.

## Consequences

- The user can review passages in the context of a full campaign playthrough.
- Playtest results can exercise reading, persistence, and wrapper progression.
- No playtest result can claim production approval or canonical evidence.
- Later review evidence promotes an approved projection without changing the
  playtest record or rewriting the Reading Engine.
