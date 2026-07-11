# Product requirements

Status: Draft

Owner: Product owner

Last reviewed: 2026-07-10

This document defines accepted product scope. Conversation ideas remain proposed
until they are incorporated here through a reviewed change.

## Product summary

Finn Reading Game is an engaging reading practice experience. The exact target
age, platform, curriculum approach, and launch scope still require confirmation.
The product should make practice feel playful while giving a trusted adult a
clear view of progress.

## Problem

Reading practice can feel repetitive and difficult to sustain. Learners need
short, understandable activities with motivating feedback. Adults supporting
them need useful progress signals without excessive setup or data collection.

## Users

- Primary: a developing reader. Age range and reading level are to be confirmed.
- Secondary: a parent, caregiver, teacher, or other trusted adult.

## Goals

- Make regular reading practice enjoyable and easy to start.
- Give feedback that supports learning rather than merely scoring performance.
- Preserve progress across sessions.
- Give adults a simple, privacy-conscious view of progress.

## Non-goals for the initial release

- Replacing a qualified teacher, reading specialist, or formal assessment.
- Public social networking, direct messaging, or public leaderboards.
- Advertising or selling learner data.
- Broad curriculum coverage before the first learning loop is validated.

## Functional requirements

| ID | Requirement | Priority | Status | Acceptance signal |
| --- | --- | --- | --- | --- |
| FR-001 | A learner can begin an age-appropriate reading activity with minimal setup. | Must | Proposed | A first-time learner reaches an activity without adult-only configuration. |
| FR-002 | The experience gives immediate, supportive feedback during or after an activity. | Must | Proposed | Feedback identifies success and a constructive next attempt. |
| FR-003 | The product records meaningful progress between sessions. | Must | Proposed | A returning learner resumes with prior progress intact. |
| FR-004 | A trusted adult can review a concise progress summary. | Should | Proposed | The summary shows recent activity and learning progress without exposing unnecessary data. |
| FR-005 | The product provides a motivating progression or reward loop. | Should | Proposed | Completing practice produces understandable progress without manipulative pressure. |
| FR-006 | Adult-only actions are distinguishable from learner actions. | Must | Proposed | A learner cannot accidentally change protected settings or disclose data. |

## Non-functional requirements

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| NFR-001 | Core learner flows meet WCAG 2.2 AA where applicable. | Must | Proposed |
| NFR-002 | The interface supports keyboard, touch, readable contrast, scalable text, reduced motion, and clear audio alternatives. | Must | Proposed |
| NFR-003 | Collect only data necessary for learning and operation, with clear retention and deletion behavior. | Must | Proposed |
| NFR-004 | Do not store secrets or personally identifying child information in source control, logs, analytics, or handoff documents. | Must | Accepted |
| NFR-005 | The initial activity loop should feel responsive on supported devices and tolerate ordinary network variability. | Should | Proposed |

## Success measures

Baselines and targets are to be established before release. Candidate measures:

- activity completion and voluntary return rate;
- improvement on the specific reading skill being practiced;
- time required for an adult to start or review a session;
- learner frustration and abandonment signals;
- accessibility and usability findings from representative testing.

Metrics involving children require explicit privacy review, minimal collection,
and a documented purpose.

## Open product questions

- What age range and reading level does the first release serve?
- Which reading skill is the first narrow learning loop?
- Which platforms must the first release support?
- Is speech recognition required, optional, or out of scope initially?
- What progress data should be local, account-based, or visible to adults?
- What consent, retention, and deletion requirements apply?

## Change control

Accepted scope changes must update this file. Record a corresponding `DEC-*`
entry when the change represents a durable tradeoff, and update the roadmap and
session handoff when sequencing or active work changes.
