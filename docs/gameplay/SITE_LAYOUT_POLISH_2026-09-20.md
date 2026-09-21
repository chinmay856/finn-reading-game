# Campaign layout polish — September 20, 2026

Following the screen-art review, the user authorized Search-ish navigation spacing,
compact repair checklists with unchanged label sizes, Yahuh headline fitting and
image gutters, and small ViewTube / Spotty-Fi spacing improvements.

- Nine campaign checklists use tighter rows and less empty padding. Existing type
  sizes and repair behavior remain unchanged. MapGuess retains its previously
  reviewed upper-right panel.
- Yahuh uses individually fitted headline lines, consistent image gutters, and
  full-height exaggerated secondary headlines while reporting is absent. Its
  compact checklist sits lower-right so the lead and soup stories remain visible.
- Search-ish has a dedicated strip for VIEW MORE RESULTS below the final result.
- ViewTube's search controls and Spotty-Fi's section title sit more evenly within
  their existing header space.
- Runtime frames and endgame crops are synchronized and cache versions updated.

Validation: 563 tests; syntax checks; Yahuh rendered SVG checks for slot bounds,
vertical balance, content continuity, and identical final repaired composition.
The old requirement for a single font size per headline was superseded by the
user's request for individually fitted type. Containment checks remain enforced.
A 13-comparison before/after screenshot packet accompanies this change. This is
visual layout QA, not a new speech playtest.
