# Roadmap

Status: Living document

Last reviewed: 2026-07-10

The roadmap communicates sequence and current status, not fixed dates. Move
work through GitHub issues and pull requests, and update this file when the plan
materially changes.

## Status vocabulary

- **Proposed:** discussed but not accepted.
- **Ready:** accepted and sufficiently defined to start.
- **In progress:** active work exists on a branch or pull request.
- **Blocked:** a named dependency prevents meaningful progress.
- **Done:** merged, validated, and documented.

## Now — define the first testable loop

- [ ] Confirm target learner age and reading level.
- [ ] Select one narrow reading skill and define its learning objective.
- [ ] Confirm first-release platforms.
- [ ] Define child privacy, consent, retention, and deletion constraints.
- [ ] Turn proposed `FR-*` requirements into accepted, testable scope.
- [ ] Choose the implementation stack and record the decision.
- [ ] Prototype and test the smallest learner activity loop.

Exit signal: an accessible learner can complete one useful activity, receive
supportive feedback, and resume progress in the intended environment.

## Next — make the loop dependable

- [ ] Persist progress safely.
- [ ] Add the trusted-adult progress summary.
- [ ] Validate accessibility with representative input methods.
- [ ] Add automated checks, deployment, and recovery guidance.
- [ ] Run privacy and safety review.

Exit signal: the core loop is reliable, understandable to learner and adult,
and ready for a limited supervised pilot.

## Later — expand based on evidence

- [ ] Add further activities only when the first loop demonstrates value.
- [ ] Improve personalization using minimal, explainable data.
- [ ] Expand platform support based on real usage needs.
- [ ] Add content tooling and review workflows.

## Parking lot

These are not commitments:

- speech recognition;
- multiple learner profiles;
- educator/classroom workflows;
- narrative worlds and collectible systems;
- offline-first support;
- additional languages.

Promote an item only after it has a clear user problem, acceptance criteria, and
privacy/accessibility implications.
