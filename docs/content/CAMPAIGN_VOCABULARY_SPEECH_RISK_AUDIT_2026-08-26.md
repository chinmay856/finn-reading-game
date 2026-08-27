# Campaign Vocabulary Speech Risk Audit

Status: automated speech-text audit for all 276 vocabulary cards in the ten-site campaign. Run `npm run audit:campaign-vocabulary-speech` after editing a passage deck.

## Automatic speech-only cleanup

- Parenthesized outline markers such as `(i)`, `(ii)`, and `(iii)` are spoken as `one`, `two`, and `three`.
- Roman numerals attached to `Chapter` or `Part` are spoken as ordinary numbers.
- Bracketed footnote markers, stray square brackets, daggers, and double-hyphen transcription marks are removed or normalized before audio generation.
- Static audio introduces the excerpt with `In this passage:` rather than `Used in a sentence:`.

## Definite extraction fixes completed

- `threadit-09/unselfish`: removed the unrelated trailing date fragment from the start of the saved sentence.
- `yahuh-02/prodigious`: removed a stray closing square bracket.
- `viewtube-04/philanthropy` and `viewtube-04/liabilities`: removed adjacent numbered sentences that had been appended to the matching sentence.
- `viewtube-05/maladies`: reduced a stitched chapter-summary line to the exact matching clause.
- `faceplace-05/languid`: removed the chapter heading that had been joined to the matching sentence.
- `viewtube-06/hexagonal`: removed the work and part headings that had been joined to the matching sentence.

## Vocabulary speech excerpts

The passage text remains unchanged. For 28 cards whose exact source sentence was unusually long, punctuation-heavy, or cut through a quotation boundary, the pronunciation guide uses a concise instructional excerpt instead. These speech-only excerpts preserve the vocabulary word's meaning and nearby source context while omitting material that makes the audio harder to follow. The maintained override list is `speech/campaign-vocabulary-speech-excerpts.js`.

The weak, punctuation-heavy vocabulary choices `particulars` and `spontaneous` were replaced with `diligence`, `confute`, and `revivify` in their respective campaign decks.

The cards cover the former review queue across WikiWhy, ThreadIt, FacePlace, MyCorner, Yahuh, ViewTube, Amaze-On, Search-ish, and Spotty-Fi. The automated audit now reports zero remaining long-sentence, dense-punctuation, unmatched-quotation, heading, date-fragment, Roman-outline, or bracket-marker risks.

Human listening remains appropriate as a final quality check, but there are no known formatting risks awaiting an editorial decision.
