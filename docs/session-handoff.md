# Session handoff

This file is the short, current snapshot for the next human, ChatGPT, or Codex
session. Replace stale details instead of accumulating a diary. Durable history
belongs in commits, pull requests, issues, and the decision log.

## Current state

- **Updated:** 2026-07-10
- **Updated by:** Codex
- **Branch/PR:** `agent/project-workflow` (draft pull request)
- **Phase:** Project definition
- **Overall status:** Documentation workflow created; product scope remains draft

## What changed this session

- Created repository-level guidance for coordinating ChatGPT web, mobile, Codex,
  and GitHub.
- Added draft product requirements, experience/technical design guidance, a
  roadmap, and an append-only decision log.
- Added issue, pull request, and session-summary templates.
- Recorded GitHub as the source of truth and required implementation/documentation
  updates to travel together.

## Confirmed decisions

- DEC-001: GitHub is the project source of truth.
- DEC-002: Implementation and truth-changing documentation travel together.
- DEC-003: Conversations are inputs, not records of accepted state.

## Validation performed

- Confirmed all required scaffold files exist and contain content.
- Confirmed all relative Markdown links resolve to files in the scaffold.
- No application tests exist yet.

## Open questions

- What existing or new GitHub repository should receive this scaffold?
- What age range and reading level does the first release serve?
- What is the first narrow reading skill and activity loop?
- Which platforms and privacy constraints apply?

## Risks and blockers

- Product assumptions are deliberately marked as proposed.
- The first learner, reading skill, supported platforms, and privacy constraints
  still need product-owner confirmation before implementation begins.

## Recommended next action

Review the proposed requirements with the product owner, then accept or revise
the first-release learner, skill, platform, and privacy constraints.

## Resume prompt

> Read `AGENTS.md` and `docs/session-handoff.md`. Inspect the current repository
> state. Help resolve the open first-release product questions without treating
> proposed requirements as accepted. Update the canonical documents and this
> handoff with confirmed outcomes.
