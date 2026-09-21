# WikiWhy visual repair sequence — 2026-09-20

Approved direction: each damaged region changes once from red to its final green
state. Preserve the encyclopedia shell and use larger, clear article text.

Initial contributor: DogVisionExpert99. Unsupported claims, caption, references,
and hidden history are red. ARTICLE CHECK tracks evidence, wording, sources and
history. No floating hatch marks, question marks or crossed-out fragments.

Reading 1 restores the article’s research-backed status; 2 the headline; 3 the explanation; 4 the
color-vision illustration; 5 the references; 6 the history record. Sidebar rows
change only when their corresponding repair occurs. Color labels are stacked
to prevent overflow. The illustration continues using the existing approved art.

AUTO corrupts wording, sources and history. Lock 1 restores sources, lock 2
restores history, and lock 3 restores wording. Previously restored regions remain
unchanged. All article regions in the final state equal the first full recovery.
The checklist uses the shared 330 × 224 green-header overlay with three large
checkboxes, visible from AUTO’s overfix through the three locks. It sits above
the references and history record so both repairs remain visible. Unfinished
checks are empty red-bordered squares; completed checks are green with a white
tick. Its check marks reflect actual repair state.

Source: scripts/generate-wikiwhy-complete-sequence.mjs and its generated SVG.
Runtime pages: 1, 2–7, 10, 12, 13–15; secured/receipt use 7.
Tutorial copy and frames share the new first repair. Launcher uses runtime frames;
endgame recovered/overfix thumbnails are exported from the same master.
Passages, saved explanations and the playtester passage document are unchanged.

Regenerate all runtime artwork with `node scripts/generate-wikiwhy-complete-sequence.mjs --export`.

View source has a red × in corrupted states. It returns to the normal tab with
the sources repair (reading 5 or final lock 1). The tutorial points to the same
initial and first-repair frames and explains the permanent red-to-green change.

Article copy shows status rather than teaching instructions: SUPPORTED BY RESEARCH,
Evidence: research, Wording: careful, Sources: 3 linked, and History: visible.
Revision history shows two dated edits by fictional encyclopedia contributors,
describing the correction and source additions. Tutorial narration matches it.

## AUTO dog-vision overfix

AUTO's overfix also corrupts the color-vision panel. A new illustration depicts
AUTO in a deliberately unconvincing dog costume, with his own faces filling the
color-test card. Red panel and caption: “Certified dog. By AUTO.” / “All I see is me.”
It stays red through source and history locks, then returns to the identical
accurate color-vision panel with the final wording repair.

Asset: `docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/assets/wikiwhy-auto-dog-vision-v1.png`.
Generated with built-in imagegen using the original dog-with-test-card illustration
and AUTO's learned portrait as style/identity references. The original art is preserved.
Prompt: square cartoon encyclopedia illustration on plain cream; recognizable
cream toaster AUTO, blue face, orange lever and Bluetooth badge, in an obviously
fake golden dog hood with round spectacles and plush paws; tilted test card full
of tiny identical AUTO faces. Match original dog linework and soft shading; no
text, border, floating symbols or extra characters. Readable at 158px.

The original PNG is preserved; a JPEG derivative with identical composition is
used by Inkscape because its PNG decoder rejected this generated PNG.
