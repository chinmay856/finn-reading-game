# Vocabulary synchronization and Hosting cleanup — 2026-09-21

User approved these replacements, keeping the original word in its other passage:

| Passage | Replaced | Approved replacement |
| --- | --- | --- |
| WikiWhy 10 | assent | testimony |
| Search-ish 3 | contemptuously | scornful |
| Yahuh 2 | contemplated | enterprises |
| ViewTube 1 | apparatus | vaudeville |
| Spotty-Fi 5 | assimilated | manifestation |

Updated the five original Google Docs with revision guards and read back every paragraph. Verified that only the selected vocabulary cards changed; passage text and quick checks remain unchanged. Updated source snapshots, approval receipts, generated runtime records, and five Kokoro Heart recordings. Removed the superseded reviewed recordings. All 273 vocabulary words are now unique. All 249 reviewed recordings match their synthesis text and hashes. All 575 tests pass; syntax and whitespace checks pass.

## Hosting capacity

The game site had 30 FINALIZED versions, approximately 350–371 MB each; seven additional versions were already EXPIRED. The legacy site had one FINALIZED version (~294 MB). The displayed quota covers retained Hosting versions, not just the current website or downloaded traffic.

Deleted 28 older FINALIZED game versions through Firebase Hosting's version API. Preserved current `c6f3568e3cf92ae6` and previous `15bc127d2076e733`, and left the legacy live site untouched. Remaining finalized version bytes before this deployment total approximately 1.032 GB across both sites. This is a version inventory, not a refreshed billing-meter measurement.

Both live channels already report retainedReleaseCount=2, despite the game retaining 30 finalized versions. The inventory alone does not establish why automatic cleanup had not completed. Do not assume the setting is sufficient without checking actual retained versions after future deployment bursts.

Reference: https://firebase.google.com/docs/hosting/manage-hosting-resources
