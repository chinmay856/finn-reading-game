# Reviewed passage release — September 20, 2026

The release uses the current Google Docs for WikiWhy (9), FacePlace (8), ThreadIt (9), and MyCorner (9): 35 passages and 105 vocabulary cards. The source snapshots, document revision IDs, approval record, and SHA-256 hashes are in `human-reviewed/2026-09-20/google-docs/`. All four Google Doc revisions were checked again immediately before publication and were unchanged.

Chinmay explicitly selected Little Women for FacePlace passage 6, resolving the stale local Anne of Green Gables packet. ThreadIt starts with The Fox Without a Tail. Short work titles replace editorial headings; reviewed spoken introductions retain their exact author and context wording. Spoken passages, vocabulary definitions and playback phrases, quick-check questions, answer text, and correct-answer identities match the approved snapshots.

Quick-check choices shuffle on each presentation using Fisher-Yates. Correctness stays attached to each choice; retries leave the displayed order stable. Random shuffles can coincidentally repeat an earlier arrangement. Source A/B/C ordering exists only for editorial traceability, not fixed player-facing positions.

All 105 reviewed vocabulary recordings were regenerated using local Kokoro Heart, with versioned asset filenames. Audio manifests record synthesis text and file hashes. Approved context phrases remain visible even when they are not verbatim sentences in the reading passage. Existing campaign repairs remain earned; unfinished passage credit from replaced content resets through the content-version migration.

Publication gates compare effective runtime content against the frozen Doc snapshots, exercise all six answer permutations, and validate the 105 audio manifests. This verifies the import; it does not claim another human playtest of the deployed build.
