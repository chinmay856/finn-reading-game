# Final breach runtime asset manifest

These original wrapper assets support the singular `EVIDENCE_11.LIVE` breach.
They do not imitate a real operating system, antivirus product, or service.

| Asset ID | File | View box | State | Meaning |
| --- | --- | --- | --- | --- |
| `endgame.evidence11.live` | `evidence-11-live.svg` | `128 128` | arrival onward | Eleventh live file; meaningful with visible filename and source text. |
| `endgame.route.containment` | `containment-route.svg` | `720 260` | trace, revoke | Shared-origin route from AI service through the three containment gates; mirror in DOM. |
| `endgame.evidence.vault` | `evidence-vault.svg` | `256 256` | preserve onward | Read-only Case File vault containing evidence 01-11. |
| `endgame.access.revoked` | `access-revoked-badge.svg` | `520 120` | restored | Final service-access status; duplicate in DOM text. |
| `endgame.board.finalBreach` | `final-breach-containment-board.svg` | `1536 1024` | design reference | Six-state production board; never use as a runtime background. |

## Reused character assets

- celebration/restoration: `amy_supportive`, `chinmay_relieved`,
  `techno_celebrate_spin`;
- evidence/trace: `amy_evidence`, `chinmay_fluster_3`,
  `techno_suspicious_file` or `techno_alert_ball_pin`;
- safety/preserve/revoke: `amy_tools`, `chinmay_fluster_3`,
  `techno_bark_ball` or `techno_clue_point`.

No new character portraits are required.

## Meaning and accessibility

Every asset is a visual companion to DOM text. The filename, writer, route,
checkpoint, evidence count, service ID, and access status must remain available
when images, color, and animation are unavailable.

The final board is a review artifact. Runtime controls, logs, routes, evidence
items, and progress must be responsive DOM/SVG components, not a screenshot.
