# MapGuess playable implementation handoff

Status: **visually approved by Chinmay on 2026-08-22**. This handoff freezes the
reviewed site-state images and their order for the live-game implementation. It
does not freeze later Amy, Chinmay, Auto, or reflection dialogue copy.

## Runtime assets

The 15 reviewed 1440 x 900 frames are packaged at:

`/public/walkthroughs/mapguess/mapguess-anchor-v2_p1.png` through
`/public/walkthroughs/mapguess/mapguess-anchor-v2_p15.png`.

The editable master, reviewer, generator, validator, and full visual contract
remain in the design workspace:

- `docs/design/screens/2026-08-22/mapguess-production/mapguess-anchor-master-v2.svg`
- `docs/design/screens/2026-08-22/mapguess-production/mapguess-anchor-review-v2.html`
- `docs/design/screens/2026-08-22/mapguess-production/MAPGUESS_PRODUCTION_CONTRACT_V2.md`
- `scripts/generate-mapguess-production-v2.mjs`
- `scripts/validate-mapguess-production-v2.mjs`

## Exact state order

| Page | Runtime state | Trigger |
|---:|---|---|
| 1 | initial sponsored detour | mission load |
| 2 | irrelevant sponsored clutter cleared | accepted passage 1 plus correct comprehension |
| 3 | San Francisco labels restored | accepted passage 2 plus correct comprehension |
| 4 | truthful ETA restored | accepted passage 3 plus correct comprehension |
| 5 | library destination and direct route restored | accepted passage 4 plus correct comprehension |
| 6 | Auto moves the destination | midpoint dialogue acknowledgement |
| 7 | first `GO DIRECTLY TO THE LIBRARY` try ready | after Auto/Amy dialogue |
| 8 | first try fails with red X | accepted passage 5 plus correct comprehension |
| 9 | library moves; second try ready | failure acknowledgement |
| 10 | second try fails with red X | accepted passage 6 plus correct comprehension |
| 11 | library moves; third try ready | failure acknowledgement |
| 12 | third try fails with red X | accepted passage 7 plus correct comprehension |
| 13 | library moves; final try ready | Amy final-try dialogue acknowledgement |
| 14 | final try succeeds; real library and direct route return | accepted passage 8 plus correct comprehension |
| 15 | secured clean state | secured overlay/dialogue closes |

Pages 14 and 15 are intentionally byte-identical. Page 14 is the success
transition target; page 15 is the stable secured-state alias.

## Integration requirements

- Advance a site-state delta only after an accepted reading attempt **and** a
  correct comprehension answer. Friendly score bands never gate progress.
- Key completion by `missionId + passageId`; retrying a completed passage must
  not apply the visual delta twice.
- The repeated second-half repair is intentionally not a standard multi-item
  checklist. The same `GO DIRECTLY TO THE LIBRARY` repair fails three times,
  with each red-X frame visible before the target moves.
- Keep the destination-lock meter at zero through pages 6-13. It jumps to 100%
  only on page 14.
- Use DOM character/dialogue overlays. Do not bake new dialogue into the
  reviewed site frames.
- Completely cover the rasterized Reading Companion area with the live DOM
  companion, using the same approach as the existing playable walkthroughs.
- Preload only the current and next frames. Do not eagerly load all 15 PNGs.
- The route, destination marker, ETA copy, and labels in these frames are the
  approved visual evidence. Do not recreate them as approximate DOM drawings.

## Validation

Run:

```sh
node scripts/generate-mapguess-production-v2.mjs
node scripts/validate-design-sequence.mjs \
  docs/design/screens/2026-08-22/mapguess-production/mapguess-anchor-master-v2.svg
node scripts/validate-mapguess-production-v2.mjs
```

The approved review established the production sequence after both validators
passed. Re-exporting is necessary only when intentionally editing the master.
