# Internet Recovery 98 site build briefs

## Purpose

These briefs turn the reviewed ten-site design library into builder-facing
runtime direction. They are design artifacts only: no code, no runtime state
shape, and no Reading Engine behavior is defined here.

Use them to build or preview each Internet Recovery 98 site while preserving
the project boundaries:

- the Reading Companion passage is the only scored speech text;
- site copy is decorative visual feedback and story context;
- site progress is wrapper/game-rule presentation, not speech logic;
- comprehension questions refer only to the assigned passage;
- Chinmay is sincere, long-haired, and increasingly flustered;
- Chinmay's AI owns hostile or autonomous writes.

For Recovery Map tile text, evidence-file receipts, blocked-write labels, and
global campaign beats, use
[`../CAMPAIGN_HUB_RUNTIME_BRIEF.md`](../CAMPAIGN_HUB_RUNTIME_BRIEF.md).

For replay-oriented Reading Companion content planning, use
[`../../../content/proposed-sites/PASSAGE_DECK_PLANS.md`](../../../content/proposed-sites/PASSAGE_DECK_PLANS.md).

## Build order recommendation

1. WikiWhy as the first playable slice.
2. ThreadIt or MapGuess as the second slice, because their repair visuals are
   legible without heavy media assets.
3. FacePlace or Spotty-Fi once the builder has reusable feed/list components.
4. The remaining sites as preview windows until each has a content pool and
   site-specific mechanics.

This order is pragmatic only. The campaign spine supports flexible site order
after WikiWhy.

## Brief index

| # | Site | Brief | Runtime status |
| --- | --- | --- | --- |
| 1 | WikiWhy | [`01-wikiwhy.md`](01-wikiwhy.md) | First playable slice |
| 2 | ThreadIt | [`02-threadit.md`](02-threadit.md) | Design-ready |
| 3 | FacePlace | [`03-faceplace.md`](03-faceplace.md) | Design-ready |
| 4 | MyCorner | [`04-mycorner.md`](04-mycorner.md) | Design-ready |
| 5 | Yahuh! Portal | [`05-yahuh-portal.md`](05-yahuh-portal.md) | Design-ready |
| 6 | ViewTube | [`06-viewtube.md`](06-viewtube.md) | Design-ready |
| 7 | Search-ish | [`07-search-ish.md`](07-search-ish.md) | Design-ready |
| 8 | Amaze-On | [`08-amaze-on.md`](08-amaze-on.md) | Design-ready |
| 9 | Spotty-Fi | [`09-spotty-fi.md`](09-spotty-fi.md) | Design-ready |
| 10 | MapGuess | [`10-mapguess.md`](10-mapguess.md) | Design-ready |

## Shared runtime rules

Every site starts inside the stable Internet Recovery 98 desktop. Ordinary site
corruption stays inside the Recovery Browser. The desktop rim, taskbar, Amy
Support, and Reading Companion remain trustworthy until the separate final
breach arc.

Every playable site should expose these durable states:

- `incoming` - available but not started;
- `recovering` - started and resumable;
- `secured` - site-specific ending reached and ordinary AI writes blocked;
- `preview` - visible design reference only, no microphone or scoring.

Every secured site should produce:

1. a restored principle;
2. a blocked AI write;
3. one evidence file;
4. an Amy or Chinmay reaction;
5. a Techno visual beat;
6. return to the Recovery Map.

## Preview mode rules

If a site is shown before it is playable, label it plainly:

```text
DESIGN PREVIEW
VIEW ONLY
MECHANICS NOT CONNECTED
PASSAGE NOT ASSIGNED YET
MIC: OFF
NO READING SCORE
```

Preview mode may show corrupted/repaired art and a short story teaser. It must
not pretend that reading, scoring, or campaign persistence exists for that site.
