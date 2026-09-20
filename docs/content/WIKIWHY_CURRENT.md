# Current WikiWhy release

The current approved packet is
[the 2026-09-20 nine-passage packet](human-reviewed/2026-09-20/wikiwhy/WIKIWHY_HUMAN_REVIEWED_PACKET_RULE_42.md).
It supersedes all earlier WikiWhy manuscripts, review tables, source slates, and
candidate decks for the live game. Older dated packets remain historical records.

The game imports `content/wikiwhy-human-reviewed-passages.js`, generated only
from the current packet. The tutorial imports the same effective runtime's first
passage, question, vocabulary, and initial/first repair frames. It has no second
passage fixture and cannot start speech or write campaign progress.

Candle is rejected. Peirce's *The Fixation of Belief* is selected for ThreadIt
editorial placement, not yet deployed there. Its former WikiWhy repair slot is
now the chapter 19 Huck Finn stars excerpt. The nine repair frames and other
passage slots remain unchanged. Stable slot IDs preserve earned repairs; a
pending read of the replaced Peirce text is cleared when restoring an older save.
The Time Machine stays. Alice now includes the approved Rule Forty-two exchange and is 340 spoken words.
Its vocabulary and quick check are unchanged.

## Required publication synchronization

1. Edit the approved current packet and update its SHA-256 in
   `scripts/lib/wikiwhy-human-reviewed-packet.mjs`; preserve historical packets.
2. Run `npm run generate:wikiwhy-human-reviewed`. Generate vocabulary audio only
   for changed cards; `--passage=wikiwhy-07` scopes the existing generator.
3. Update the [playtester Google Doc](https://docs.google.com/document/d/1pRtfNeqCoI40G1lKGo2YOzL9BO0ev1qNrnZc9qfIT1Y/edit)
   using the effective runtime order and exact text, vocabulary, questions, and
   displayed answer order. Keep draft expansion ideas outside this live packet.
4. Save the connector `get_document_text` structured result to a local JSON file.
   Run `node scripts/verify-wikiwhy-doc-sync.mjs /absolute/path/to/readback.json`.
   This verifies all nine passages and records the Doc revision and packet hash.
5. Run checks, tests, content validation, build, and browser QA. The primary
   deployment command refuses content whose packet hash differs from the last
   verified Doc synchronization receipt.
6. After deployment, verify the served asset hashes and the Google Doc revision.

The receipt proves the checked revision, not continuous synchronization with
future manual Google Doc edits. Every subsequent editorial release must repeat
readback verification.

## Onboarding behavior

New profiles see the approved eight-beat intro followed by the twelve-step tour.
Intro has Continue and bottom Skip intro, with no Back or counter. Tutorial has
Back, Continue and Skip tutorial. Start contains separate replay entries. Completing the intro with Show me how
opens the tutorial, including when replaying the introduction.
[Current reviewed onboarding copy](../gameplay/ONBOARDING_COPY_CURRENT.md).
Returning profiles retain their existing progress and can replay either from
Start. Demonstration results are explicitly examples. All content is DOM text;
site-state artwork stays decorative.
