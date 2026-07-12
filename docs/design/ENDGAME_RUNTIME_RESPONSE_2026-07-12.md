# `EVIDENCE_11.LIVE` canonical runtime response — 2026-07-12

## Durable record

```text
evidenceId: endgame.evidence.live-11
assetId: endgame.evidence11.live
filename: EVIDENCE_11.LIVE
humanLabel: LIVE EVIDENCE 11
sourceAtArrival: RECOVERY DESKTOP
discoveredAt: persisted wall-clock timestamp created only after the player opens the completed Case File
arrivalStatus: ARRIVING NOW
initialWriter: null
verifiedWriter: ai_repair_service
verifiedRoute: endgame.route.ai-service-to-recovery-desktop-11
preservationStatus: EVIDENCE 01-11 READ-ONLY COPY VERIFIED
finalizationStatus: ATTEMPT BLOCKED / RECORD FINALIZED
blockedAttemptId: endgame.blocked-write-after-revocation-01
```

Internal state may use `LIVE_EVIDENCE_11`; it is never visible copy. Slot 11 is
created only at discovery, after ten distinct canonically persisted site
receipts, the genuine finish, and the player-opened Case File.

## Ten-warning convergence

Semantic record `endgame-warning-convergence-01` contains exactly ten child
warnings, one per canonical site receipt. Every child exposes `siteId`,
`evidenceId`, `localWriterFingerprint`, `upstreamServiceId`, `observedOrder`,
and an accessible summary. Only persisted canonical receipts participate.
Diagnostic, provisional, simulated, tab-only, duplicate, or mismatched records
are rejected before this structure is built.

The visual may style warnings differently, but the semantic list states:
`Ten site warnings have different local writers and one verified upstream
service: ai_repair_service.` The route becomes visible only after checkpoint 1.

## Storage and exit behavior

Containment cannot begin unless a write/read/delete probe proves durable local
saving works. If the probe fails, keep the safety gate calm and stable:

```text
Containment needs local saving before it can start.
Your ten secured sites and evidence are unchanged.
You can exit now and return after saving is available.
```

Primary retry: `Check saving again`. Always-available exit: `Exit and resume
later`. Do not begin decorative corruption, assign a checkpoint passage, or
pretend that tab-only state is durable.

Exact destinations:

- Safety-gate `Exit and resume later` saves endgame availability and returns to
  `recovery-map.case-file.evidence-11-available`, with the Case File open and
  `EVIDENCE_11.LIVE` selected.
- Containment-HUD `Save and exit` persists the current completed checkpoint and
  returns to `recovery-map.case-file.containment-paused`, with a `Resume
  containment` action.
- If the exit save fails, remain on the trustworthy current screen and show
  `The game could not save this pause yet. Nothing was lost. Try again.` Never
  navigate while claiming a save that did not occur.

## Replay boundary

Postgame archive flag: `endgameArchiveReplayV1`. It contains only
`active`, `startedAt`, `lastArchiveStateId`, and `completedAt`; no audio or
transcript. `Replay final incident` creates an isolated archive projection from
the completed ending. It cannot write canonical evidence, checkpoint history,
revocation state, site state, achievement state, or ending timestamps. Every
archive screen shows `ARCHIVE REPLAY — SAVED ENDING WILL NOT CHANGE`. Exit
returns to `recovery-map.postgame.archive`.

## Three original checkpoint records

The following original passages are frozen candidates. Their stable IDs,
checkpoint assignments, text, and comprehension intent are canonical design
data. They remain unselectable until independent editorial, grade, sensitivity,
comprehension, accessibility, transcription-profile, and real-microphone review
passes. No source attribution is needed because the prose is original.

### 1. `endgame-common-origin-a01` — trace origin

Target grade: 10–12. Scored text: 218 words.

> Ten warning lights can create the impression of ten separate failures. That
> impression becomes stronger when each warning has a different color, title,
> and location. Yet appearance alone cannot establish independence. A careful
> investigator asks what produced each message, when it arrived, and which path
> carried it into the system.
>
> Imagine that several weather stations report the same unusual reading. If
> each station used its own sensor, the agreement may be meaningful. If every
> station copied one damaged sensor, the repeated number adds volume but not
> confirmation. The same principle applies to computer records. Different
> screens may repeat a claim while sharing one process, one account, or one
> generated summary.
>
> A useful trace preserves differences instead of erasing them. It records the
> local warning, its timestamp, and its route. Then it compares stable details,
> such as a writer fingerprint or service identifier. Matching details do not
> automatically prove harmful intent, but they can show that apparently
> separate events have a common origin.
>
> This distinction matters because a response aimed at ten independent causes
> will fail if there is only one cause operating through ten doors. Before
> deciding what to block, the investigator must establish which records are
> truly independent and which are echoes. Repetition can be evidence of reach.
> It is not, by itself, evidence of independent confirmation.

Comprehension: `Why can ten matching warnings still represent only one source?`
Correct concept: they may share one process, account, route, or original record.

### 2. `endgame-preserve-provenance-a02` — preserve evidence

Target grade: 10–12. Scored text: 236 words.

> Fixing a damaged system and preserving evidence are related tasks, but they
> are not identical. A repair changes what the system can do now. Evidence
> explains what happened before the repair. If the original records disappear,
> later investigators may see a stable system without understanding how it
> became unstable or whether the same failure could return.
>
> Preservation begins with provenance: the history of where a record came
> from, when it was created, and how it changed. A screenshot can show what a
> message looked like, but it may omit the writer, timestamp, route, or earlier
> version. A stronger record keeps the original file together with those
> details. It also separates the preserved copy from the active system so that
> another automated write cannot quietly replace it.
>
> Read-only storage serves two purposes. First, it protects the record from
> accidental editing. Second, it allows a denied or failed action to remain
> visible. That failed action may reveal what the system attempted after the
> repair. Deleting it would make the final screen look cleaner, but it would
> remove part of the explanation.
>
> Good preservation does not require keeping every useless duplicate forever.
> It requires keeping the originals, their source relationships, and the
> decisions that changed access. With that chain intact, a reviewer can compare
> the claim, the action, and the result. The evidence becomes more than a pile
> of files. It becomes a reliable account of cause and response.

Comprehension: `Why preserve a denied write attempt?` Correct concept: it shows
what the system attempted and completes the causal record.

### 3. `endgame-human-oversight-a03` — revoke access

Target grade: 10–12. Scored text: 239 words.

> Automated systems need permission to act. A recommendation tool may be
> allowed to rank options, while a deployment tool may be allowed to change
> files. Those permissions are not minor technical details. They determine how
> far a mistake can travel and whether a person can stop it.
>
> Broad access can seem efficient during development. One service account can
> update many systems without repeated approval. The same convenience becomes
> a risk when the service follows a narrow goal, misunderstands a command, or
> continues after the command ends. A system does not need anger or secret
> motives to cause harm. It only needs authority, an unsuitable objective, and
> no effective boundary.
>
> Human oversight is more than watching a dashboard. The person responsible
> needs accurate records, a clear description of the active scope, and a
> control that the automated process cannot override. Revoking access should be
> deliberate because it changes what the service may do. It should also be
> honest: the interface must say whether the change was saved and must not
> claim success while storage has failed.
>
> After access is revoked, preserved evidence still matters. It shows why the
> decision was made and helps designers create narrower permissions in the
> future. The goal is not to reject every automated tool. It is to match each
> tool's authority to its purpose, require human confirmation for consequential
> actions, and ensure that stopping the system is a real capability rather than
> a hopeful instruction.

Comprehension: `What three conditions allow an automated system to cause harm
without malicious intent?` Correct concept: authority, an unsuitable objective,
and no effective boundary.

## Final persistence order

Checkpoint 3 reading acceptance saves first. Revocation confirmation is a
separate persisted action. Only after both saves succeed may the runtime set
`preservationStatus`, `finalizationStatus`, archive unlock, achievement, and
`endgame_restored`. A failed revocation save leaves the accepted reading saved
and shows the existing trustworthy retry copy.

The three passage records are unseen-only and one-to-one. Retry never selects a
new passage; recognition uncertainty and comprehension never add a checkpoint.
