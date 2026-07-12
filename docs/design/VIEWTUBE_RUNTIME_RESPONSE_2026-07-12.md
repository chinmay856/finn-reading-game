# ViewTube canonical runtime response — 2026-07-12

## Decisions

- Initial state remains `viewtube_corrupted`; midpoint remains
  `viewtube_autoplay_loop`. No migration alias is needed.
- Midpoint action: `Keep the restored context and separate its evidence tracks`.
- Local writer/blocked actor: `viewtube-process-video-autofix-01`, player label
  `VIDEO AUTO-FIX AI`, fingerprint `vt-loopverify-6a91`. It is a child media job
  of `ai_repair_service`, which is the upstream antagonist service.
- Version one uses responsive DOM/CSS/inline-SVG abstract frames, thumbnails,
  timeline, and hash badges. No raster media pack and no site audio.
- Existing `amy_evidence`, `chinmay_fluster_1`,
  `techno_suspicious_file`, and `techno_clue_point` assets are sufficient.

## Canonical silent-video fixture

Fixture `viewtube-fixture-winter-signal-01` is entirely original fictional
material.

Recording `viewtube-recording-winter-signal-01`: `A Signal Crosses the Winter
Sky`; creator `Northwind Field Archive`; recorded
`2026-02-14T19:42:00Z`; timezone UTC; duration 46 seconds. Accessible summary:
`A fictional fixed-camera recording shows a light trace crossing a winter sky;
the recording does not identify the trace's cause.`

Frames:

| ID | Time | Description and accessible meaning |
| --- | ---: | --- |
| `viewtube-frame-01` | 0 | Dark observation shelter under a clear winter sky. |
| `viewtube-frame-02` | 8 | Narrow pale streak enters from the left. |
| `viewtube-frame-03` | 16 | Streak crosses above the shelter roof. |
| `viewtube-frame-04` | 24 | Observer marks direction on a paper grid. |
| `viewtube-frame-05` | 32 | Streak fades while the instrument clock remains visible. |
| `viewtube-frame-06` | 38 | Final eight-second segment begins with the same fading streak. |

Each accessible summary begins with its timestamp, e.g. `16 seconds: The pale
streak crosses above the shelter roof.`

Decorative transcript, always headed `SITE TRANSCRIPT (NOT READING PASSAGE)`:

| ID | Time | Text |
| --- | ---: | --- |
| `viewtube-transcript-01` | 2 | `The camera is fixed on the northern horizon.` |
| `viewtube-transcript-02` | 11 | `A short light trace crosses the frame from west to east.` |
| `viewtube-transcript-03` | 25 | `The observation grid records direction, not identity.` |
| `viewtube-transcript-04` | 38 | `The last eight seconds repeat the same fading trace.` |

Sources: `viewtube-source-camera-log-01` / `FIXED CAMERA LOG` / recording
settings and clock reference; `viewtube-source-weather-log-01` / `FIELD WEATHER
LOG` / visibility and cloud cover; `viewtube-source-observer-grid-01` /
`OBSERVER DIRECTION GRID` / direction marks with no causal claim. Sponsorship
record `viewtube-sponsorship-none-01`: `NOT SPONSORED`, false.

Recommendations: `viewtube-recommendation-01..04`, labeled `buffering toast,
part 1`, `buffering toast, part 2`, `buffering toast, documentary edition`, and
`the same final eight seconds again`. Comments: `viewtube-comment-01`, `Is this
a new angle or the same loop?`; `viewtube-comment-02`, `The source panel should
say what the recording can and cannot prove.`

Final segment `viewtube-segment-final-eight-01` spans 38–46 seconds. Origin
`viewtube-origin-recording-01`; media hash `vt-media-4f7c1a`. Playback IDs are
`viewtube-playback-01` through `viewtube-playback-10`; all ten share that origin
and hash. Accessible summary: `Ten playback records point to one original media
hash and add zero independent evidence.` The clone target and blocked target is
`viewtube-segment-final-eight-01`.

Saved pre-loop snapshot `viewtube-snapshot-context-before-loop-01` contains the
recording identity, six frame IDs, four transcript links, three source IDs,
sponsorship state, duration, origin, and hash. At midpoint only playback count,
apparent confirmation count, recommendation repetition, and active segment are
overwritten; saved context remains inspectable.

## Seven unit proofs

| Unit | Owned records and accessible result |
| --- | --- |
| `recording_identity` | Recording ID; title, creator, date, timezone, duration become visible. |
| `distinct_frames` | Six frame IDs; six distinct timestamped frames become visible. |
| `transcript_track` | Four transcript IDs; decorative segments reconnect to timestamps. |
| `source_context` | Three sources plus sponsorship; context and `NOT SPONSORED` become visible. |
| `footage_track_verified` | `viewtube-track-footage-01`, origin, hash, ten playbacks; duplicates quarantine beneath one footage hash. |
| `transcript_track_verified` | `viewtube-track-transcript-01`; transcript timing verifies against the original recording, not loops. |
| `source_track_verified` | `viewtube-track-source-01`; sources separate from recommendations and playback counts. |

Evidence-track summaries respectively state: ten playbacks share one original
hash; all transcript links target the original recording; three context sources
remain distinct from recommendations.

## Canonical slot-6 row

```text
siteId: viewtube
slot: 6
evidenceId: viewtube.evidence.duplicate-media-hashes-01
assetId: null
filename: VIEWTUBE_DUPLICATE_MEDIA_HASHES.REC
title: VIEWTUBE / DUPLICATE MEDIA HASHES
shortLabel: DUPLICATE MEDIA HASHES
principle: Repetition is not independent evidence.
whatChanged: Footage, transcript, and source context now appear as separate evidence tracks.
aiBehavior: The video optimizer counted ten loops of one media hash as ten confirming sources.
localWriterFingerprint: vt-loopverify-6a91
upstreamServiceId: ai_repair_service
traceOrder: 6
routeFragment.id: viewtube.route.duplicate-hashes-06
routeFragment.from: viewtube-process-video-autofix-01
routeFragment.fromLabel: VIDEO AUTO-FIX AI
routeFragment.to: ai_repair_service
routeFragment.toLabel: AI REPAIR SERVICE
routeFragment.relationshipLabel: local media-verification job routed to parent service
routeFragment.accessibleSummary: ViewTube's video auto-fix job routes to the upstream AI repair service.
blockedWriteId: viewtube-blocked-clone-01
blockedActorId: viewtube-process-video-autofix-01
blockedTargetId: viewtube-segment-final-eight-01
canonicalEligibility: persisted secured state, exact registered evidence ID, and persisted blocked event
```

The durable observed time is captured from the actual blocked save, never the
video timestamp.

## Responsive and reduced-motion behavior

At 1440 CSS pixels show player, recommendation rail, context panels, and bottom
evidence timeline. At 1180–1279, recommendations and comments move into one
Recovery Browser-owned drawer labeled `Recommendations and comments`. The
opener stays visible; opening moves focus inside; background becomes inert;
Escape/close returns focus; source/context proof and Reading Companion never
enter or sit beneath the drawer. Reduced motion replaces loop population and
track drawing with one immediate semantic state swap.

## Content and replay

Use 7A + 3B. Deck A: `the-sky-becomes-a-streak-of-fire-a01`,
`the-frame-before-the-crash-a02`, `the-transcript-and-the-clip-a03`,
`what-the-camera-did-not-see-a04`, `a-speech-in-its-moment-a05`,
`one-scene-three-cuts-a06`, `the-duplicate-frame-a07`. Deck B:
`the-expedition-dispatch-b01`, `a-demonstration-needs-a-method-b02`,
`the-witness-and-the-recording-b03`.

These are frozen IDs, not approved prose. Eligibility remains zero until each
record passes every content and microphone gate. Post-secure action `Open
another recovered recording` selects unseen Deck B through a separate non-audio
replay cursor and cannot change secured state, evidence, or campaign history.
