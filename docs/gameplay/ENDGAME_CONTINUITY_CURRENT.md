# Campaign and desktop incident continuity

The regular game is the visual reference. `desktop-chrome.css` is loaded by
campaign, onboarding and endgame. It owns the final Start menu treatment;
endgame window geometry, desktop stripes, taskbar, tray and card typography
match the campaign. The menu has Save Game, Choose Recovery Site, Replay
Introduction, Tutorial, Switch Player and New Game. Saved lessons remain
available through the desktop Documents icon. Intro/tutorial replay returns
to the current endgame state; player actions use the regular profile gate.

Completed launcher cards use the same recovered site crops as the endgame,
including when a recovered site is being replayed. Their description says the
site is recovered rather than describing its old corruption. Completion and
reading progress are otherwise unchanged.

After Chinmay's raised-finger “AUTO SHOULD HAVE IT NOW” beat, applying the update
runs a 20-second presentation: AUTO visits all ten sites in launcher order,
changes each recovered thumbnail to its over-fix, and turns its frame/status red.
Only after all ten does “AUTO ESCAPED THE WEBSITES” appear. Skip animation commits
the same transition immediately. Reduced motion omits movement/bobbing and uses
350 milliseconds per site. Artwork is decoded before the sequence. Timers are
cancelled by rerender/navigation; interrupted playback leaves the saved ready
beat intact so reload cannot strand the game midway through the visual.

## AUTO cutout provenance

Built-in image generation, background-extraction edit of the existing
`public/walkthroughs/endgame/portraits/auto-overdrive-v1.png`.
Saved output: `public/walkthroughs/endgame/portraits/auto-working-cutout-v1.png`.
Alpha channel verified. Original source preserved.

Prompt: Extract ONLY the complete cream robot and its attached mechanical
arms/tools onto a truly transparent alpha background. Keep the exact face,
Bluetooth badge, colors, linework, tools and pose. Remove the cream background,
floating website diagrams, blue orbit lines and ground shadow. No added border,
text, backdrop, checkerboard, or other objects. Center the entire robot with
modest transparent padding; preserve all tool tips. This will be shown as a small
animated helper moving between website thumbnails.

## Validation

Local full normal animation: ten red sites before the takeover warning. Skip,
reduced-motion mode, replay Tutorial and return to the same beat, and Switch
Player entry checked without loading production speech assets. Existing test
suite and build remain release gates.
