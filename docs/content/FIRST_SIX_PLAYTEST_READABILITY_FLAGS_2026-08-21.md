# First-six reading playtest: readability flags

Status: editorial QA queue. This does not alter the approved canonical manuscript.

The runtime now fixes mechanical chunking separately from passage selection. It recognizes common titles and initials, ends chunks at real sentence boundaries, and prefers clause punctuation for long sentences. The flags below require human playtest judgment because shortening or modernizing them would change reviewed source copy.

## Highest-priority FacePlace review

- `faceplace-01`, *Anne of Green Gables*: several character and place names appear immediately (`Matthew Cuthbert`, `Bright River`, `Prince Edward Island`, `Marilla`, `Mrs. Rachel`), along with period vocabulary such as `balsamy`, `filmy`, `sorrel`, `personage`, and `ungainly`. The Gutenberg chapter heading also interrupts the spoken opening.
- `faceplace-02`, *The Picture of Dorian Gray*: dialogue depends on repeatedly tracking Dorian, Harry, Basil Hallward, and Lord Henry.
- `faceplace-03`, *Walden: Solitude*: comparatively few names, but high abstraction and difficult vocabulary including `conscious`, `consequences`, `torrent`, `theatrical exhibition`, and `spectator`.
- `faceplace-04`, *Of the Meaning of Progress*: contains a German epigraph and a dense concentration of historical and institutional names. This is the strongest candidate for a supported stretch label, a new excerpt boundary, or a swap.
- `faceplace-05`, *Alice's Adventures in Wonderland*: frequent speaker shifts, emphatic capitals, and identity-focused dialogue may need stronger visual speaker cues.
- `faceplace-08`, *A Pair of Silk Stockings*: recurring character names and period diction should be tested aloud before acceptance for a younger reader.

## Cross-site stretch queue

The first playtest should also watch `wikiwhy-03` (Bacon), `wikiwhy-08` (Mill), `threadit-03` (Madison), `threadit-04` (Mackay), `threadit-09` (Wells), `yahuh-01` and `yahuh-02` (hoax prose), `viewtube-03` (Thoreau), and `viewtube-08` (Stevenson). These passages contain long sentences, archaic syntax, dense argument, or many unfamiliar names.

## Playtest questions

1. Can the player read the source introduction without using working memory needed for the passage itself?
2. Do names cause decoding difficulty even when they are not vocabulary targets?
3. Does the active chunk contain a complete idea and a natural breath point?
4. Are 19-pixel type and roughly 18-word clause chunks comfortable at the actual display distance?
5. Which difficulty comes from worthwhile vocabulary, and which comes from avoidable framing, headings, or excerpt boundaries?
