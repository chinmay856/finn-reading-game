# Codex project instructions

These instructions apply to the entire repository.

## Before changing anything

1. Read `docs/session-handoff.md`.
2. Read the sections of `docs/product-requirements.md`, `docs/design.md`,
   `docs/roadmap.md`, and `docs/decision-log.md` relevant to the task.
3. Inspect the working tree and preserve unrelated user changes.
4. State assumptions when the repository does not contain enough information.

## While working

- Treat the default branch on GitHub as the source of truth.
- Keep changes scoped and use a branch named `agent/<short-description>` when
  starting from the default branch.
- Reference requirement IDs (`FR-*`, `NFR-*`) and decision IDs (`DEC-*`) in
  issues, commits, and pull requests where useful.
- Do not invent product decisions to unblock implementation. Record a reversible
  assumption or an open question instead.
- Do not commit secrets, credentials, personally identifying child information,
  or production data.
- Add or update tests in proportion to the behavior changed.

## Before handing off

Update documentation in the same change when implementation changes its truth:

- `docs/product-requirements.md` for accepted scope or acceptance criteria.
- `docs/design.md` for user experience, architecture, data, or accessibility.
- `docs/roadmap.md` for status, sequencing, or newly discovered work.
- `docs/decision-log.md` for durable decisions and their rationale.
- `docs/session-handoff.md` for current state, validation, risks, and the next
  action.

In the handoff, list exact files changed, tests or checks run, unresolved issues,
and the recommended next step. Do not mark work complete when checks have not
passed or acceptance criteria remain unmet.
