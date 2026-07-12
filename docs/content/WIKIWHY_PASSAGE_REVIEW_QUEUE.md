# WikiWhy passage review queue

This is the durable promotion queue for WikiWhy Reading Companion content. It
keeps promising prose visible to reviewers without letting draft content become
speech-scored merely because it exists in Markdown.

## Runtime truth

- `photosynthesis-a01` is the only executable record.
- Its availability is `prototype`, not final production approval.
- A02–B10 remain candidate drafts in
  [`../../content/wikiwhy/PASSAGE_DECKS.md`](../../content/wikiwhy/PASSAGE_DECKS.md).
- The neutral catalog filters candidates out. The wrapper shows an explicit
  content-review gate when no unseen executable record remains.

## Promotion gate

Every candidate needs all of these before its availability changes:

1. Stable content ID and three-paragraph executable record.
2. Comparison against a specific source revision. `reviewedAgainstRevision`
   must not be described as the revision originally adapted unless that is
   independently established.
3. Contributor/article link, history link, modification notice, CC BY-SA 4.0
   license link, and a visible end-user credit line outside speech-scored text.
4. Factual review against the cited source and any appropriate primary source.
5. Grade, sensitivity, and accessibility review.
6. Exactly one grounded comprehension question with three choices, one correct
   answer, and feedback that never forces a retry.
7. Theme-neutral reading profile and static tokenizer/alignment checks.
8. Real-microphone read-through for names, compounds, punctuation, and likely
   recognition failures.
9. Tests proving no wrapper, reward, repair, character, or site language entered
   the content record.

## Current revision candidates

Captured from the official MediaWiki revision API on 2026-07-12. These are
comparison targets only until a reviewer records the completed comparison.

| Deck | ID | Source article | Revision candidate | Priority / note |
| --- | --- | --- | --- | --- |
| A01 | `photosynthesis-a01` | [Photosynthesis](https://en.wikipedia.org/wiki/Photosynthesis) | [1358838651](https://en.wikipedia.org/w/index.php?title=Photosynthesis&oldid=1358838651) | Executable prototype; complete production review still pending |
| A02 | `plate-tectonics-a02` | [Plate tectonics](https://en.wikipedia.org/wiki/Plate_tectonics) | [1362124384](https://en.wikipedia.org/w/index.php?title=Plate_tectonics&oldid=1362124384) | Promote early; low-risk science lane |
| A03 | `sleep-a03` | [Sleep](https://en.wikipedia.org/wiki/Sleep) | [1363250410](https://en.wikipedia.org/w/index.php?title=Sleep&oldid=1363250410) | Needs health review |
| A04 | `memory-a04` | [Memory](https://en.wikipedia.org/wiki/Memory) | [1358945620](https://en.wikipedia.org/w/index.php?title=Memory&oldid=1358945620) | Extra cognition/factual review |
| A05 | `habit-a05` | [Habit](https://en.wikipedia.org/wiki/Habit) | [1363315359](https://en.wikipedia.org/w/index.php?title=Habit&oldid=1363315359) | Promote early; check self-help overclaiming |
| A06 | `placebo-a06` | [Placebo](https://en.wikipedia.org/wiki/Placebo) | [1360728734](https://en.wikipedia.org/w/index.php?title=Placebo&oldid=1360728734) | Needs medical and ethics review |
| A07 | `urban-heat-island-a07` | [Urban heat island](https://en.wikipedia.org/wiki/Urban_heat_island) | [1362971741](https://en.wikipedia.org/w/index.php?title=Urban_heat_island&oldid=1362971741) | Promote early; low-risk science lane |
| A08 | `pollination-a08` | [Pollination](https://en.wikipedia.org/wiki/Pollination) | [1361721612](https://en.wikipedia.org/w/index.php?title=Pollination&oldid=1361721612) | Promote early; check broad food claims |
| A09 | `scientific-method-a09` | [Scientific method](https://en.wikipedia.org/wiki/Scientific_method) | [1363484633](https://en.wikipedia.org/w/index.php?title=Scientific_method&oldid=1363484633) | Promote early; central evidence theme |
| A10 | `cognitive-bias-a10` | [Cognitive bias](https://en.wikipedia.org/wiki/Cognitive_bias) | [1362055650](https://en.wikipedia.org/w/index.php?title=Cognitive_bias&oldid=1362055650) | Extra cognition and tone review |
| B01 | `printing-press-b01` | [Printing press](https://en.wikipedia.org/wiki/Printing_press) | [1363169243](https://en.wikipedia.org/w/index.php?title=Printing_press&oldid=1363169243) | Best first overflow/replay candidate |
| B02 | `encryption-b02` | [Encryption](https://en.wikipedia.org/wiki/Encryption) | [1362367673](https://en.wikipedia.org/w/index.php?title=Encryption&oldid=1362367673) | Check technical precision |
| B03 | `internet-b03` | [Internet](https://en.wikipedia.org/wiki/Internet) | [1363603104](https://en.wikipedia.org/w/index.php?title=Internet&oldid=1363603104) | Check web/internet distinction wording |
| B04 | `public-library-b04` | [Public library](https://en.wikipedia.org/wiki/Public_library) | [1361213911](https://en.wikipedia.org/w/index.php?title=Public_library&oldid=1361213911) | Low speech risk |
| B05 | `renewable-energy-b05` | [Renewable energy](https://en.wikipedia.org/wiki/Renewable_energy) | [1363065623](https://en.wikipedia.org/w/index.php?title=Renewable_energy&oldid=1363065623) | Check policy-neutral framing |
| B06 | `coral-reef-b06` | [Coral reef](https://en.wikipedia.org/wiki/Coral_reef) | [1360636852](https://en.wikipedia.org/w/index.php?title=Coral_reef&oldid=1360636852) | Highest obvious vocabulary/transcription risk |
| B07 | `probability-b07` | [Probability](https://en.wikipedia.org/wiki/Probability) | [1360283399](https://en.wikipedia.org/w/index.php?title=Probability&oldid=1360283399) | Check examples and numeracy load |
| B08 | `music-b08` | [Music](https://en.wikipedia.org/wiki/Music) | [1360502846](https://en.wikipedia.org/w/index.php?title=Music&oldid=1360502846) | Broad article; freeze scope carefully |
| B09 | `architecture-b09` | [Architecture](https://en.wikipedia.org/wiki/Architecture) | [1363750396](https://en.wikipedia.org/w/index.php?title=Architecture&oldid=1363750396) | Broad article; check cultural framing |
| B10 | `map-b10` | [Map](https://en.wikipedia.org/wiki/Map) | [1363745599](https://en.wikipedia.org/w/index.php?title=Map&oldid=1363745599) | Low-risk replay candidate |

## Campaign sizing decision

At a minimum 10% Act I advance, WikiWhy can require eight Act I readings plus
three Shield readings: eleven total. Deck A contains ten records. The wrapper
must receive an explicit design decision before it guarantees unseen content:

- approve one reviewed Deck B overflow record, preferably B01; or
- approve one clearly disclosed least-recent Deck A repeat.

The Content Platform must not change the 10–20% wrapper rule or silently score a
candidate to solve this count.

## Recommended promotion order

Start with A02, A05, A07, A08, and A09. They offer the clearest early path with
lower medical/sensitivity risk. Complete A03 and A06 only with the additional
health review noted above. B01 is the cleanest first overflow candidate after
the first-run policy is decided.
