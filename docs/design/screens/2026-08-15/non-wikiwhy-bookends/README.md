# Non-WikiWhy visual bookends

Status: review candidates, not production art.

Each editable SVG uses fixed-position Inkscape pages. The first pass deliberately
contains only the Phase 1 corrupted and repaired base states. Dialogue, Techno,
Act 2 overlays, and passage transitions are absent so the site's information
architecture and parody identity can be reviewed without noise.

## Spotty-Fi v1

`spotty-fi-bookends-v1.svg` contains two 1440 x 900 pages with identical shell
geometry:

- corrupted: three anonymous generated tracks, no meaningful About content, no
  contributor names, and a discovery feed that repeats one synthetic pattern;
- repaired: three distinct fictional creators, a persistent player, and a
  right-side current-song card with About, contributors/roles, Follow, and
  related work.

## Spotty-Fi v2

`spotty-fi-bookends-v2.svg` incorporates Chinmay's first review:

- the persistent player is a full-width control surface with
  shuffle/previous/play-or-pause/next/repeat controls, elapsed time, realistic
  three-to-four-minute durations, a scrubber, and an authored visualizer;
- the visualizer is static in this bookend review and becomes an animated layer
  only in the later live implementation;
- red is the default corruption signal and green is the default repaired signal,
  while Spotty-Fi's lime and pink remain native brand/parody accents;
- the repaired discovery cards use three generated fictional cover illustrations;
- the repaired right rail uses a generated fictional artist portrait, making the
  human creator more visually immediate than the anonymous generated state.

The generated source sheet is `spotty-fi-generated-art-v1.png`; deterministic
square crops are stored alongside it as `album-paper-v1.png`,
`album-satellite-v1.png`, `album-band-v1.png`, and `artist-portrait-v1.png`.

Image generation used the built-in image tool with this production prompt:

> Create a clean 2x2 source sheet: dream-pop paper-airplane sunset cover,
> nocturnal satellite-city electronic cover, indie rehearsal-room band cover,
> and a warm fictional indie-musician portrait. Use a cohesive editorial
> illustration style; no real people, text, logos, branding, or watermark.

## Spotty-Fi v3 — site-only review

`spotty-fi-bookends-v3.svg` is the preferred review master. It exports only the
fixed 900 x 815 site window; the shared Reading Companion is no longer repeated
inside each site's bookend artifact.

The v3 review incorporates the second feedback pass:

- corrupted search asks `LISTEN TO WHAT WE WANT`; repaired search asks `WHAT DO
  YOU WANT TO PLAY?`;
- repaired navigation changes `Made for Finn` to `Chosen by Finn`;
- track IDs, generated artist fields, missing credits, missing profile data,
  and creator-repair status are explicitly red in the corrupted state;
- corrected creator records, verification, credits, choice, and repair status
  are explicitly green in the repaired state;
- a new full-width creator strip uses the previously empty vertical space for a
  portrait, fictional verification cue, monthly-listener context, contributor
  roles, and Follow control.

### Provisional Phase 1 repair anchors

The exact passage split is not frozen. A coherent seven-delta candidate is:

1. restore Finn's search prompt and choice;
2. replace `TRACK_001` and its generated artist label;
3. replace `TRACK_002` and its generated artist label;
4. replace `TRACK_003` and its generated artist label;
5. restore contributor credits and roles;
6. restore the artist profile, verification context, and listener information;
7. change `Made for Finn` to `Chosen by Finn` and secure the player/discovery
   relationship.

This treats a track's title and artist as one understandable identity repair,
rather than stretching three songs into nine nearly identical passages.

## Spotty-Fi v4 — simplified information hierarchy

`spotty-fi-bookends-v4.svg` removes the duplicated narrow current-artist rail.
The three discovery cards now span the full available width, while the single
horizontal creator strip owns artist identity, verification context, listener
information, contributor roles, About/related-work affordances, and Follow.

The outer browser title bar now reads `www.spotty-fi.com` without a logo. The
Spotty-Fi mark appears only inside the website header, separating browser chrome
from site identity.

## Amaze-On v1

`amaze-on-bookends-v1.svg` applies the approved bookend grammar to a simplified
marketplace comparison:

- the exact same two-card geometry is used in both states;
- the corrupted page traps Finn between the most sponsored and absolute-cheapest
  soccer shoes, marks hidden decision information in red, and shows no purchase;
- the repaired page keeps both extremes visible but restores paid-placement
  disclosure, fit, review context, durability, delivery/packaging tradeoffs, and
  a clear route to other choices;
- browser chrome uses `www.amaze-on.com`; the box mark and `amaze-on` wordmark
  appear only inside the site header;
- the Reading Companion, dialogue, Techno, and Act 2 layers are not duplicated.

The built-in image tool generated a two-panel fictional product source sheet:
one absurd metallic-gold Captain Goalazo cleat and one visibly flimsy blue
cheapest-option cleat, matched in angle and scale. The prompt prohibited people,
logos, brand marks, text, prices, ratings, and watermarks. The source and
deterministic crops are `amaze-on-products-v1.png`,
`amaze-on-goalazo-v1.png`, and `amaze-on-cheapest-v1.png`.

## Amaze-On v2 — visual evidence inside the storefront

`amaze-on-bookends-v2.svg` is the current review candidate. It replaces the
explanatory `WHAT THE PAGE HIDES` design-note box with an Amazon-like search
results structure whose controls and product records carry the lesson:

- the corrupted filter rail visibly suppresses size, playing surface, budget,
  review context, and neutral sorting while selecting immediate delivery;
- the four-card corrupted grid repeats the same paid Mega-Boot three times and
  then inserts the absolute-cheapest shoe, making the biased ranking visible
  without an explanatory note;
- its cards expose only paid/cheapest rank, impossible pricing, identical
  praise, and urgency, while red hatched rows occupy the places where fit,
  durability, and waste information should be;
- the repaired state preserves the exact geometry and restores Finn's filters,
  four distinct choices, mixed-review context, fit, durability, delivery, and
  waste information; the sponsored result remains available but is clearly
  labeled and no longer ranked first;
- the filter rail uses size, brand, and budget; its delivery control contrasts
  high-emissions air-rush shipping with grouped delivery using fewer trips and
  boxes;
- neither state chooses or purchases a product for Finn.

The built-in image tool restyled the two fictional shoes into the simpler,
outlined 2D illustration language used elsewhere in the game. The production
prompt retained the absurd gold winged cleat and flimsy blue patchwork cleat,
matched their angle and scale, and prohibited text, logos, people, dogs, UI,
prices, ratings, and watermarks. The source sheet and deterministic crops are
`amaze-on-products-illustrated-v2.png`,
`amaze-on-goalazo-illustrated-v2.png`, and
`amaze-on-cheapest-illustrated-v2.png`.

Two additional practical shoe illustrations were generated for the repaired
comparison in the same style. The prompt requested a durable green-and-cream
classic cleat and a coral-and-navy lightweight cleat, with no text, logos,
brands, UI, or watermarks. The source sheet and crops are
`amaze-on-products-practical-v3.png`, `amaze-on-classic-practical-v3.png`, and
`amaze-on-lightweight-practical-v3.png`.

## FacePlace v1 — fixed viewport, wider truth

`faceplace-bookends-v1.svg` is the first corrupted/repaired review pair. Both
states use the same 520 x 330 photo viewport and the same wide fishing-scene
master. The corrupted state enlarges and offsets that master inside the clipped
viewport; the repaired state zooms out without changing the post or viewport
geometry.

- the fictional peer's truthful caption is preserved separately from the AI's
  `LEGENDARY FISH` and `SOLO WILDERNESS MASTER` inference;
- the wider state reveals helpers, a stocked tank, similar fish, tangled gear,
  and cleanup while keeping the genuine happy catch;
- whole-life comparison language is removed rather than replacing the post;
- the Honesty Meter remains a supporting progress-bar joke with nonsensical
  fruit percentages, unique to FacePlace.

The built-in image tool generated `faceplace-fishing-wide-v1.png` from the
review-board composition and the project's simpler outlined illustration style.
The production prompt required one wide master with a center-safe tight crop,
fictional people, visible helpers and stocked-fishing context, and no text,
logos, UI, or character-canon reuse. `faceplace-fishing-wide-v1.jpg` is the
deterministic Inkscape-compatible derivative consumed by the SVG.

## FacePlace v2 — the post carries the lesson

`faceplace-bookends-v2.svg` removes the internal design-note labels from the
player-facing page. The narrative now lives in the social post itself: authored
caption, hashtags, reaction count, photo album count, comments, trending tags,
and the fixed-size image crop. The repaired comments reveal help and cleanup
without invalidating the catch.

The Phase 1 crop sequence will reuse the 520 x 240 viewport and the same image:

1. `1100 x 619 at (-290,-130)`: peer and apparently enormous fish only;
2. `900 x 506 at (-190,-98)`: first helper begins to enter the frame;
3. `760 x 428 at (-120,-74)`: the stocked tank and similar fish appear;
4. `640 x 360 at (-55,-48)`: equipment and cleanup context enter;
5. `520 x 292 at (0,-26)`: full secured scene.

These are implementation coordinates, not visible labels. Caption, hashtag,
album-count, and comment changes provide the other passage-level deltas.

## ThreadIt v1 — forum experience, not storyboard labels

`threadit-bookends-v1.svg` translates the raw-fish echo-chamber storyline into
an authored discussion page. It does not display internal lesson labels such as
`ONE SOURCE, MANY COPIES`.

- the corrupted thread uses repeated fan usernames, copied claims, inflated
  votes, a collapsed question, exclusionary community rules, and a top-posts
  rail that visibly traces back to the same user;
- the repaired thread keeps the community and its enthusiasm but separates a
  personal anecdote, preparation context, current guidance, and a restored
  question through ordinary forum metadata and reply styling;
- both states keep identical post, reply, sidebar, and progress geometry;
- detailed food-safety claims remain provisional pending the planned qualified
  content review.

## Yahuh v1 — recognizable news portal

`yahuh-bookends-v1.svg` translates the headline lesson into a purple portal with
a search bar, section navigation, one lead story, two secondary cards, a news
ticker, timestamps, updates, correction history, quotes, and a promoted item.

- corrupted headlines turn ordinary fictional events into emergencies while
  hiding story details, chopping a quote, obscuring timestamps, and nearly
  hiding the promotion label;
- repaired headlines accurately describe the same moon, soup-ship, pigeon, and
  weather illustrations while restoring summaries, sources, full quotes,
  updates, corrections, and promotion labeling;
- both states preserve identical portal and card geometry.

The built-in image tool generated the four-panel source sheet
`yahuh-news-thumbnails-v1.png` in the project's simple outlined illustration
style. Deterministic crops are `yahuh-moon-v1.png`,
`yahuh-soup-ship-v1.png`, `yahuh-pigeon-v1.png`, and `yahuh-weather-v1.png`.

## Shared-system compliance boundary

The current Spotty-Fi v4 and Amaze-On v1 SVGs are compact **site-window review
slices**, not independent production shells. Their semantic state colors now
match the approved shared tokens exactly: corruption `#C5251E` and repair
`#2F8A49`, with canonical soft surfaces where used.

When expanded into passage sequences, their site-state groups must mount into
the locked 1440 x 900 shared shell from
`scripts/lib/internet-recovery-design-system.mjs`. Production generators must
reuse the shared desktop, 810 x 824 site-window frame, Reading Companion,
taskbar, popup geometry, and topmost Techno layer; they may not copy the preview
frame from these compact SVGs. Dialogue, Techno, Act 2 overlays, and the Reading
Companion remain intentionally deferred in this bookend review.

Export from this directory:

```sh
inkscape spotty-fi-bookends-v1.svg --export-page=all --export-type=png \
  --export-filename=spotty-fi-bookends-v1.png --export-overwrite \
  --export-dpi=96 --export-background=#ffffff --export-background-opacity=255
```
