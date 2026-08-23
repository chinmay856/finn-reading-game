# MapGuess repair ledger — review draft

Status: first-round review packet, not approved production canon. The route and map are authored fiction, not real navigation guidance.

## Bookends

- Initial corruption: Finn's library destination is vague, city/road/landmark labels are suppressed, and a huge sponsored Snack Palace pin creates an absurd detour across water.
- Repaired bookend: the library name and address, San Francisco label, useful landmarks, direct five-minute route, and optional sponsored stop are clearly separated.
- Auto over-fix: Auto “fixes” the inefficient detour by moving the library destination onto Snack Palace. The route now agrees with the map only because Finn's destination was replaced.

## Initial repair sequence

Order changes from small labels to the dominant route geometry.

1. Restore the library name and address.
2. Restore the San Francisco orientation label.
3. Restore landmark, street, and road hierarchy.
4. Remove the water-crossing segment and restore the direct route and ETA.
5. Separate the optional sponsored snack pin from Finn's route.

## Lock-in repair

1. `KEEP FINN'S DESTINATION`
2. `RESTORE THE DIRECT ROUTE`
3. `SHOW MAP + SPONSOR LABELS`

## Purpose check

Destination card, destination pin, city/landmark layer, route geometry, ETA, sponsored stop, and meter are repair targets. The folded-map mark, classic cream map surface, print-route navigation, and simple road grid are persistent parody cues.
