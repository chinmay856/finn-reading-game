# Session summary template

Use this template at the end of a meaningful ChatGPT web, ChatGPT mobile, or
Codex session. Keep it concise and repository-safe. Do not include secrets,
credentials, private child information, or raw production data.

```markdown
# Session summary: <short topic>

- Date: YYYY-MM-DD
- Interface: ChatGPT web | ChatGPT mobile | Codex
- Participants: <roles or names safe to record>
- Related issue/PR/branch: <links or none>
- Conversation link: <optional; context only, never the sole record>

## Objective

<What outcome was this session trying to reach?>

## Confirmed decisions

- <Only choices explicitly accepted by the decision owner.>
- None.

## Proposed ideas

- <Ideas still requiring validation or approval.>
- None.

## Evidence or user feedback

- <Observation, research, test result, or feedback and its source.>
- None.

## Work completed

- <Concrete repository or implementation work.>
- None.

## Open questions

- <Question, owner, and what it blocks.>
- None.

## Action items

- [ ] <Action> — owner: <name/role> — target: <date/issue if useful>

## Canonical files to update

- [ ] `docs/product-requirements.md` — <accepted scope/criteria or no change>
- [ ] `docs/design.md` — <experience/architecture or no change>
- [ ] `docs/roadmap.md` — <priority/status or no change>
- [ ] `docs/decision-log.md` — <durable decision or no change>
- [ ] `docs/session-handoff.md` — <current state and next action>

## Recommended next action

<The single best next step for the next session.>
```

## Reconciliation rules

- A "confirmed decision" requires a clear decision owner and explicit agreement.
- Keep alternatives or unverified claims under "Proposed ideas."
- Rewrite outcomes so the repository remains understandable without chat access.
- Add stable links to issues, pull requests, commits, requirements, and decisions.
- If the summary conflicts with the default branch, flag the conflict and open a
  reviewed change; do not overwrite silently.
- For Codex sessions, include exact validation performed and any failures.
