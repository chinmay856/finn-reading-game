# Player and playtester links

- Player: https://internet-recovery-98.web.app/
- Playtester: https://internet-recovery-98.web.app/playtest

The player entry hides diagnostic toolbars before JavaScript starts. Both the mission and finale toolbars are enabled only by the explicit `playtest=1` URL flag. No preference is saved in browser storage, so opening the player link after testing returns to the clean interface.

Playtester navigation preserves its mode through site changes, player switching, finale entry, and return to the Recovery Browser. It retains jumps, repair previews, optional troubleshooting sample retention, finale skips/reset, and diagnostic voice-guide override. Player mode disables those shortcuts and the voice-loading preview bypass. Normal rereading, saving, tutorials, player switching, and actionable microphone recovery remain available. Both links use the existing on-device save system; use a separate test player to keep test progress separate.

Simplified internal model-preparation labels and removed preview-server wording from the artwork error. The player reading-guide loader does not show underlying runtime loader diagnostics.

Validation: 577 tests; syntax checks; production build using cached Sherpa assets; local Chrome checks for login, launcher, mission jump, finale, and navigation between mission and finale modes. The UI smoke test stubs initial Whisper loading to avoid downloading speech models; it is not a fresh speech-quality test. Screenshots confirm clean player login, launcher and finale, and visible controls in the playtester version.
