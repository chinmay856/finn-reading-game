# Documents folder and desktop endgame concept

Status: concept only. The recovery-file behavior is in scope for the playable build; the endgame is intentionally not implemented or frozen.

## Recovery files now

After a site is repaired, the active player's Documents folder stores one readable file containing:

- the site name;
- the lesson Otto confirms;
- the player's own explanation of that lesson; and
- the save timestamp.

The display filename follows `<site>_<player>_feedback_for_Otto.txt`. Documents is available from the Recovery OS desktop and shows only files belonging to the active local save.

## Unbuilt endgame idea

After all ten sites are repaired, Otto may move from corrupting browser sites to corrupting the Recovery OS desktop. The saved Documents files become the player's accumulated evidence and the objects Otto tries to steal, scramble, or overwrite. A final desktop-scale game would ask the player to protect, recover, or correctly reassemble those lessons.

Open decisions include the exact mechanic, failure and retry behavior, how Techno participates, whether Otto is malicious or still over-helpful, and how the ten documents combine into the final resolution.

## Reading-layout playtest variables

Do not freeze these values before observed playtesting:

- passage font size (current target: 19 px at the 1440 by 900 authored stage);
- preferred words per highlighted chunk (current soft target: about 18);
- whether long unpunctuated clauses should remain intact or receive a secondary typographic wrap;
- the amount of preceding and following text visible around the active chunk; and
- player comfort at different reading speeds and display scales.

Chunk boundaries must preserve the canonical spoken text. Sentence endings are primary boundaries; commas, semicolons, colons, and dashes are preferred boundaries for long sentences. Abbreviations such as `Mr.`, `Mrs.`, and `Dr.` are not sentence endings.
