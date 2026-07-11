# Decision log

This append-only log records durable product and technical choices. Correct
typos in place, but supersede a decision with a new entry rather than rewriting
history.

## Entry template

### DEC-XXX — Short decision title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded by DEC-___
- **Context:** What problem or constraint required a choice?
- **Decision:** What was chosen?
- **Rationale:** Why was it chosen over the meaningful alternatives?
- **Consequences:** What becomes easier, harder, required, or ruled out?
- **Links:** Requirements, issues, pull requests, research, or prior decisions.

---

## DEC-001 — GitHub is the project source of truth

- **Date:** 2026-07-10
- **Status:** Accepted
- **Context:** Work may originate in ChatGPT web, ChatGPT mobile, or Codex, while
  chat histories and local workspaces are not guaranteed to stay synchronized.
- **Decision:** The accepted state of code, requirements, design, roadmap,
  decisions, and handoff documentation lives on the default GitHub branch.
- **Rationale:** A repository provides version history, review, links between
  artifacts, and a common handoff point across interfaces.
- **Consequences:** Meaningful chat outcomes must be summarized and reconciled
  into the repository. When chat conflicts with the repository, repository state
  remains authoritative until changed through review.
- **Links:** `README.md`, `CONTRIBUTING.md`.

## DEC-002 — Implementation and truth-changing documentation travel together

- **Date:** 2026-07-10
- **Status:** Accepted
- **Context:** Separate code and documentation updates create stale handoffs and
  make later web, mobile, and Codex sessions disagree about current state.
- **Decision:** A pull request that changes product behavior, design, sequencing,
  or a durable choice also updates the corresponding canonical documents and
  `docs/session-handoff.md`.
- **Rationale:** Reviewing the change as one unit keeps the project resumable.
- **Consequences:** Documentation review is part of the definition of done. A
  code-only pull request is acceptable only when it does not change documented
  truth, and the author should say so explicitly.
- **Links:** `AGENTS.md`, `CONTRIBUTING.md`.

## DEC-003 — Conversations are inputs, not records of accepted state

- **Date:** 2026-07-10
- **Status:** Accepted
- **Context:** Conversations include brainstorming, unverified claims, abandoned
  options, and information that may not be safe or useful to preserve.
- **Decision:** Use the session summary template to extract confirmed decisions,
  proposals, open questions, and actions. Only reviewed repository changes become
  accepted project state.
- **Rationale:** Explicit reconciliation avoids accidental scope changes and
  prevents conversational noise from becoming requirements.
- **Consequences:** A chat link may be included for provenance, but canonical
  documents must remain understandable without access to that conversation.
- **Links:** `docs/templates/session-summary-template.md`.
