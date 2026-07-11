# Finn Reading Game

This repository is the source of truth for the Finn Reading Game. ChatGPT web,
the ChatGPT mobile app, and Codex are different ways to work with the same
project; durable decisions and implementation state belong in this repository.

## Start here

| If you need to… | Read or update… |
| --- | --- |
| Understand the product | [`docs/product-requirements.md`](docs/product-requirements.md) |
| Understand the intended experience | [`docs/design.md`](docs/design.md) |
| See priorities and progress | [`docs/roadmap.md`](docs/roadmap.md) |
| Learn why a choice was made | [`docs/decision-log.md`](docs/decision-log.md) |
| Resume the latest work | [`docs/session-handoff.md`](docs/session-handoff.md) |
| Summarize a conversation | [`docs/templates/session-summary-template.md`](docs/templates/session-summary-template.md) |
| Contribute a change | [`CONTRIBUTING.md`](CONTRIBUTING.md) |

## One project, three interfaces

### ChatGPT web

Use web conversations for product thinking, longer planning sessions, research,
and reviewing artifacts. At the end of a session, ask ChatGPT to produce a
summary using the session template. Move confirmed outcomes into the canonical
documents listed above; do not leave important decisions only in chat history.

### ChatGPT mobile

Use mobile for ideas, feedback, observations, and quick decisions. Before ending
the conversation, ask for a repository-ready session summary. If you cannot edit
the repository immediately, save the summary as an issue using the "Session or
implementation task" template. A later web or Codex session can reconcile it.

### Codex

Use Codex for repository-aware work. Begin by reading `AGENTS.md` and
`docs/session-handoff.md`, then consult the relevant requirements, design,
roadmap, and decisions. After implementation, Codex must update the canonical
documents in the same pull request when the code changes their truth.

## Source-of-truth rules

1. The default branch on GitHub is the durable, canonical project record.
2. Pull requests are the reviewable path for changing code and documentation.
3. Issues capture proposed work; they do not supersede accepted requirements or
   decisions in `docs/`.
4. Chat conversations are working sessions, not permanent project records.
5. When chat and the repository conflict, the repository wins until a reviewed
   pull request changes it.
6. Never commit secrets, private child information, credentials, or raw user data.

## End-of-session handoff

At the end of every meaningful ChatGPT or Codex session:

1. Copy the structure from
   [`docs/templates/session-summary-template.md`](docs/templates/session-summary-template.md).
2. Separate confirmed decisions from ideas and open questions.
3. Link affected requirements, design sections, roadmap items, decisions, issues,
   pull requests, and commits where available.
4. Update [`docs/session-handoff.md`](docs/session-handoff.md) with the current
   state and the single best next action.
5. Apply confirmed product changes to their canonical documents.
6. Commit documentation with the implementation it describes.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full workflow.

## Repository layout

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── docs/
│   ├── templates/
│   │   └── session-summary-template.md
│   ├── decision-log.md
│   ├── design.md
│   ├── product-requirements.md
│   ├── roadmap.md
│   └── session-handoff.md
├── AGENTS.md
├── CONTRIBUTING.md
└── README.md
```

Application source folders can be added without changing this documentation
workflow.
