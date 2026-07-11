# Contributing

## Canonical workflow

GitHub is the source of truth. Use issues for proposed work, branches for active
changes, pull requests for review, and the default branch for accepted project
state. ChatGPT web and mobile can originate ideas and decisions, but those
outcomes are not durable until they are reflected in the repository.

## Turning a ChatGPT conversation into repository state

At the end of a useful web or mobile conversation, ask ChatGPT:

> Summarize this conversation using `docs/templates/session-summary-template.md`.
> Separate confirmed decisions from proposals and open questions. Include only
> repository-safe information and identify which canonical files should change.

Then reconcile the result:

1. Remove conversational filler, speculation presented as fact, secrets, and
   sensitive personal information.
2. Put accepted requirements in `docs/product-requirements.md`.
3. Put accepted experience or technical design in `docs/design.md`.
4. Put durable choices and rationale in `docs/decision-log.md`.
5. Put planned work and status in `docs/roadmap.md` or a GitHub issue.
6. Replace the active snapshot in `docs/session-handoff.md`.
7. Open a pull request so the update is reviewable.

If repository access is unavailable on mobile, create a GitHub issue from the
session/task template and paste the summary there. Label every uncertain item as
`Proposed` or `Open question`; do not silently treat it as accepted.

## Starting a Codex session

Give Codex a task with the desired outcome and relevant issue or requirement IDs.
Codex should:

1. Read `AGENTS.md` and `docs/session-handoff.md`.
2. Inspect the canonical product, design, roadmap, and decision documents.
3. Check the current branch and working tree before editing.
4. Implement the smallest coherent change.
5. Run relevant validation.
6. Update documentation and the handoff in the same pull request.

Suggested prompt:

> Read `AGENTS.md` and `docs/session-handoff.md`, then implement issue #___.
> Preserve unrelated changes. Update requirements, design, roadmap, decisions,
> and the handoff wherever this implementation changes the current truth. Run
> relevant checks and prepare a draft pull request.

## Branches, commits, and pull requests

- Branch from the current default branch.
- Use `agent/<short-description>` for Codex-created branches.
- Keep commits focused and use imperative summaries.
- Link the issue and relevant requirement or decision IDs in the pull request.
- Start as a draft until acceptance criteria and checks are satisfied.
- Do not merge a documentation/code mismatch; update both together.

The pull request description must explain what changed, why, user impact, tests
or checks, documentation updates, risks, and follow-up work.

## Definition of done

A change is done when:

- applicable acceptance criteria are satisfied;
- relevant tests and checks pass;
- accessibility, privacy, and safety implications were considered;
- canonical documents reflect the implemented state;
- `docs/session-handoff.md` names the next action or says there is none; and
- the pull request contains enough context for another person or agent to resume.
