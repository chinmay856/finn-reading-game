# Local session state

The prototype keeps a small, optional history in browser `localStorage` so a
completed reading can survive a reload without retaining Finn's voice or the
recognized words.

## Data boundary

The reusable Reading Platform record contains only:

- session and passage IDs;
- completion time and reading duration;
- accuracy, matched/total word counts, passage progress, and WPM;
- a small comprehension outcome (`not-attempted`, `supported`, or
  `retry-offered`).

It never contains raw audio, transcript text, checkpoint text, browser user
agent, or Internet Recovery terminology. History is capped at 20 sessions.

WikiWhy repair count and status use a separate wrapper-owned key under
`apps/internet-recovery/`. This keeps game progression replaceable without
changing the Reading Engine's session format.

## Browser behavior

The HTML Web Storage standard makes `localStorage` origin-scoped and persistent
across browsing sessions, but access may be blocked and writes may fail because
of browser policy or quota. The application therefore catches every storage
read/write failure and treats persistence as optional. Reading, scoring, and
continuing remain available when storage fails.

Web Storage does not provide cross-tab locking. Records are deliberately small,
newest-first, deduplicated by session ID, and rewritten as one capped list. The
current one-player prototype does not attempt cross-tab conflict resolution.

Reference: <https://html.spec.whatwg.org/multipage/webstorage.html>

## Acceptance checks

- Stored session JSON contains only the approved fields.
- Injected audio/transcript fields are discarded.
- History remains capped at 20 records.
- Malformed, unavailable, quota-blocked, or policy-blocked storage cannot stop
  the reading flow.
- Wrapper repair state remains outside the reusable Reading Platform record.
