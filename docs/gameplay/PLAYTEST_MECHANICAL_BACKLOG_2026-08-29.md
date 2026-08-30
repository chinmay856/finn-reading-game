# Playtest mechanical backlog

## Final-passage retry must remain available

Status: recorded for a later mechanical batch; not implemented in the 150 WPM
Sherpa hotfix.

Observed behavior: after the last passage on a site is accepted, the closing
story pop-up appears immediately and prevents the player from choosing
**Retry reading** on the result screen.

Required behavior:

- Keep **Retry reading** available after every passage, including the final
  passage on a site.
- Do not open the closing story or teaching sequence until the player explicitly
  chooses the forward action.
- Retrying must reuse the same passage and must not advance the repair,
  completion state, or visual sequence.
- Choosing the forward action after the final passage must still open the site’s
  closing story and teaching sequence exactly once.

Regression coverage should exercise all ten sites, both confirmed and
voice-check-unavailable result states, repeated final-passage retries, and the
normal forward path after a retry.
