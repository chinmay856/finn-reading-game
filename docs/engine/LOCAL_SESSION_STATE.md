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

WikiWhy repair count, site stability, last reaction, and last applied session ID
use a separate versioned wrapper-owned key under `apps/internet-recovery/`.
Version 2 migrates the earlier repair count conservatively at the minimum 10%
earned per repair. This keeps game progression replaceable without changing the
Reading Engine's session format.

The Game Rules layer converts theme-neutral completion, accuracy,
comprehension, and pace signals into a session-strength value. WikiWhy's own
rule converts that value into a 10–20% stability advance and clamps the current
prototype at its documented 80% Act I story boundary. Comprehension is optional
and can strengthen the repair; it never blocks continuation. Faster reading can
help, but there is no maximum-WPM penalty.

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
- A session ID can be applied to wrapper state only once.
- Existing version 1 repair counts migrate without losing earned progress.
