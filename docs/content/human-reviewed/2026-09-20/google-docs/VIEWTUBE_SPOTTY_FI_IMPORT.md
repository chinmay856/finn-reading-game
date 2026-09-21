# Final reviewed packets: ViewTube and Spotty-Fi

The user explicitly authorized integrating the final two Google Docs and publishing them to production on September 20, 2026. The remaining packets were identified as ViewTube and Spotty-Fi from Drive and the existing imported-site manifest.

- ViewTube: 8 passages, 24 vocabulary recordings, 8 three-choice quick checks.
- Spotty-Fi: 10 passages, 30 vocabulary recordings, 10 three-choice quick checks.

Source snapshots, revision IDs, and SHA-256 hashes are recorded alongside the approval. Spoken text, vocabulary definitions and playback phrases, questions, answer wording, and correct-answer identities retain the reviewed wording. Bibliographic display headings omit editorial passage numbers and descriptions. Poem and dramatic verse lines remain intact. Answer order still randomizes on each presentation, and wrong-answer retries retain that presentation order.

Existing repair counts and midpoint positions are unchanged. The content-version and replaced-passage IDs use the existing save migration mechanism. Matching vocabulary audio is generated with the existing local Kokoro Heart pipeline into separate reviewed asset names.

Validation: 569 tests passed; syntax checks passed; all 18 passages rendered their exact display lines without horizontal overflow in Chrome. Reviewed vocabulary recordings are validated against exact synthesis text and file hashes before publication. Production verification uses deployed HTML, the content bundle, and audio manifests without downloading speech models.
