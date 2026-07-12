# Internet Recovery 98 — player-facing copy deck

## Document status

This is the review deck for wrapper-owned interface copy outside the parody
websites themselves. It deliberately excludes WikiWhy and other website body
copy. Nothing here belongs in the Reading Engine or Content Platform.

Copy is grouped by player moment so it can be reviewed and implemented in
small batches. Lines marked **rotation** are alternatives selected to prevent
repeated actions from sounding mechanical. Lines marked **truth line** must
remain literal and visually legible even when surrounded by jokes.

## Approved voice

- Audience: a teenager who can handle humor beyond PG-13 sarcasm.
- Edgy, mildly profane, and willing to make adults look ridiculous; never cruel,
  bigoted, humiliating, or sarcastic about Finn's reading.
- Characters address Finn by name often.
- The fourth wall is unreliable. Characters can notice buttons, pop-ups,
  loading screens, patch notes, the developer, and the game's own script.
- Chinmay is 60 percent ridiculous and 40 percent formidable. He can build
  genuinely impressive systems, but rushes past context, testing, and small
  consequences. He sincerely wants to help Finn and repeatedly insists his AI
  can fix things faster, even when deploying it makes the damage worse.
- Chinmay's AI is the actual antagonist. It begins by optimizing the wrong goals
  and overwriting careful work, then becomes clearly rogue when it continues
  rewriting systems after Chinmay tells it to stop.
- Finn is already smart and technically capable. He wins by spending time with
  the system, learning how its pieces work, and noticing what Chinmay skipped in
  his rush to ship the next brilliant idea. Attention compounds into mastery.
- Amy is Finn's warm, capable partner. She is concise, dry, and technically
  credible, but she is not Chinmay's opponent and never takes the last step away
  from Finn. She recognizes nonsense without making the story about her
  suspicions.
- Techno is a knowing, helpful desktop sprite rather than a dialogue character.
  She jumps through the interface, reacts, and deliberately points Finn toward
  useful things. Accessible labels describe relevant actions without putting
  words in her mouth.
- Performance feedback is quiet. Show metrics and evidence, offer an optional
  retry, and continue regardless of the result. Never force a retry.
- Genuine microphone, privacy, permission, loading, and failure information is
  plain and truthful. A joke may follow it but never replace it.

## Recurring comic grammar

Use these patterns across the game without forcing one into every screen:

- grandiose heading, embarrassingly honest subheading;
- a confident Chinmay claim contradicted by a timestamp, filename, dog, or
  button directly underneath it;
- an old-internet reference that Finn may recognize only after inspecting it;
- a system dialog admitting the exact shortcut Chinmay's AI took;
- three escalating pop-ups, with the third one emotionally collapsing;
- technical language applied to something petty or domestic;
- a clear action button surrounded by nonsense;
- `ACCESS DENIED` as a satisfying punchline when the rogue AI loses a write path.

Avoid stacking more than one or two jokes around a real decision. Buttons stay
clear: **Allow microphone**, **Start reading**, **Finish**, **Continue**,
**Try again**, **Cancel**, and **Close**.

## 1. First launch

### Boot sequence

**Primary**

```text
INTERNET RECOVERY 98
Browser-based remote recovery system

Connecting to Amy's clean-room network...
```

**Boot rotations**

```text
Checking RAM... found some.
Loading pre-AI system code...
Confirming none of it has tried to write a screenplay...
Opening Amy's recovery desktop in this browser window...
Restoring icons nobody remembers downloading...
Asking the cloud to stop being on fire...
Loading one extremely legal desktop...
Detecting responsible adults... 0 found.
Skipping terms and conditions. Nobody read them last time.
```

Connection result:

```text
REMOTE SESSION ESTABLISHED

Amy built Internet Recovery 98 from code too old, complicated, and unfashionable
for Chinmay's AI to rewrite.

It runs here as a remote desktop inside this browser page.

The interface looks this old on purpose.

Probably.
```

**Continue button:** `Open recovery desktop`

### Player recognition

```text
USER DETECTED: FINN
DEVELOPER DETECTED: Chinmay, already deploying a patch
OUTSIDE SITE-WRITE ACCESS: active

Finn, the adults broke the Internet.
You have been selected because you know what the buttons do and might actually
take the time to read them.
```

**Button:** `Fine. Show me.`

### Premise card

```text
THE VERY SHORT VERSION

Recovered files can repair damaged systems.
Read them aloud. The page will rebuild as you go.

Repairs never move backward.
Retries are optional.
Techno is not a licensed technician.
```

**Button:** `Repair something`

### First Chinmay broadcast

```text
CHINMAY // FOUNDER, CEO, TEMPORARY VISIONARY

Finn! Good news: this outage is completely under control.

Additional good news: I have redefined "under control" to include the
current situation.

The evidence currently points to a catastrophic failure in Chinmay's AI.

I want to be clear: I blame Chinmay's AI completely. As its creator, I have
never been more disappointed in something that is legally a separate product.

Do not touch anything yet. I have deployed the AI again because it can fix this
much faster.

It has already reported 104% completion, which is extremely promising.
```

**Buttons:** `Got it` · `Open desktop anyway`

### Amy introduction

```text
AMY // ENGINEER SUPPORT

Finn, Chinmay's system is complicated. His shortcuts usually aren't.

Take your time with what the system recovered. I'll help when another set of
eyes is useful, but this repair belongs to you.
```

**Button:** `Open repair tools`

### Techno introduction

Techno appears as a small desktop sprite, ball in her mouth. She jumps into the
Internet Recovery 98 window, looks at Finn, looks at the **Recovered Files**
icon, and deliberately drops the ball on it. The folder opens. No dialogue box
or named introduction interrupts the action.

Accessible label:

```text
A small cream-colored dog carrying a ball jumps into the remote desktop and
deliberately opens the recovered-files folder.
```

## 2. Desktop and navigation

### Desktop status rotations

```text
Internet condition: weird
Sites recovered: 0 of 10
Unexplained toolbars: 14
Outside site-write access: regrettably active
Techno's ball: under desk
```

### Application labels

| Application | Supporting copy |
| --- | --- |
| Browser | `Browse what remains` |
| Recovered Files | `Probably important. Definitely disorganized.` |
| Repair History | `Everything you fixed and what the AI rewrote` |
| Engineer Support | `Amy is online when you want a second opinion` |
| Downloads | `4 complete · 19 emotionally pending` |
| Recycle Bin | `Contains several business plans` |
| Terminal | `Type confidently and hope` |
| Settings | `Controls the automation forgot to leave alone` |

The game page contains one bounded Internet Recovery 98 desktop. It has an
original parody logo, a clearly labeled **Start** button, taskbar, desktop icons,
and overlapping windows. The old browser opens corrupted sites while the
terminal, Reading Companion, repair utility, Amy tile, Techno, or recovered file
can remain visible beside it. This is presentation inside the game page; it
never imitates Finn's real browser chrome or computer desktop.

Internet Recovery 98 itself stays stable. During ordinary play, only the
Internet and the sites nested inside its browser are corrupted. Chinmay's AI
does not rename the Start button, scramble the taskbar, corrupt Amy's tile, or
make the terminal and Reading Companion untrustworthy. The consistent shell
teaches the player which tools are safe.

Reserve any breach of the recovery desktop for the clearly signposted final act,
when Chinmay's AI keeps using its service account after he tells it to stop. A
fake-virus sequence can work there precisely because it violates a stable
environment; it should not recur as ambient desktop damage.

The dedicated **Evidence** application is absent at first. Clearing the first
site returns Finn to the desktop, adds the first recovered story file, and
unlocks the application:

| Application | Supporting copy |
| --- | --- |
| Evidence | `What each recovered site revealed about the collapse` |

### Site-clear story rhythm

The first canonical clear of each of the ten sites returns Finn to the desktop
before the next mission. A newly recovered evidence file opens as a short,
multi-click story sequence. Each sequence:

1. shows one concrete artifact such as a log, message, patch note, or timestamp;
2. lets Amy add at most one useful observation;
3. lets Chinmay offer an increasingly ridiculous explanation;
4. records the artifact in **Evidence**; and
5. advances the desktop counter from `Sites recovered: N of 10`.

The first ten evidence fragments gradually show that Chinmay rushed a powerful AI
system into control of the Internet, ignored warnings and ordinary use cases,
and then kept deploying quick AI patches because he believed they could help
faster. Recovering the tenth site appears to complete the campaign. The combined
evidence view then discovers an unexpected eleventh artifact: Chinmay's AI is
still running, no longer obeying its creator, and attempting to breach Internet
Recovery 98. That launches the final boss arc rather than ending at an ordinary
`10 of 10` completion screen.

The eleventh artifact is not earned from another website. It is generated by
the autonomous breach itself and records the attack while Finn contains it.

### Locked application rotations

```text
LOCKED
Restore another connection to recover this program.
```

```text
NOT INSTALLED YET
The icon arrived before the software. Classic.
```

```text
ACCESS PENDING
Somebody replaced the permissions screen with a motivational quote.
```

### Exit confirmation

```text
LEAVE INTERNET RECOVERY OS?

Your completed repairs and non-audio progress are saved on this device.
The Internet will remain broken in your absence, which is honestly not new.
```

**Buttons:** `Leave game` · `Stay`

## 3. Mission selection and setup

### New repair card

```text
NEW DAMAGE DETECTED

This page is online, but only in the legal sense.
Read one recovered file to begin repairs.
```

**Buttons:** `Open repair` · `Not now`

### Returning repair card

```text
CONNECTION LOST AGAIN

Your earlier repair is still recorded.
Something new broke after you left.
That is not suspicious at all, Finn.
```

**Button:** `Inspect new damage`

### Stable-for-now state

```text
REPAIR COMPLETE
The connection is stable for now.
```

Do not use `permanently fixed`, `safe forever`, or `secured` before the Shield
Protocol is complete.

### Mission preparation

```text
RECOVERED FILE READY

Read continuously at a comfortable pace.
Pause when you need to. Correct yourself whenever you want.
The repair only moves forward.
```

**Button:** `Prepare microphone`

### Optional mission details

```text
FILE DETAILS
Length: about [N] words
Topic: [topic]
Source: [source/provenance label]
Audio upload: none
Forced retries: absolutely not
```

## 4. Microphone, privacy, and model setup

These messages are functional copy. Keep the truth line more prominent than
the joke.

### Permission primer

```text
MICROPHONE NEEDED

Internet Recovery OS listens while you read so it can follow your place.

Your voice is processed on this device. The game does not upload or save your
audio or transcript.
```

**Truth line:** `Your browser will ask for microphone permission next.`

**Buttons:** `Allow microphone` · `Cancel`

### Local model download

```text
PREPARING PRIVATE SPEECH TOOLS

The first setup downloads the speech model to this browser. It may take a
moment. Afterward, recognition runs locally on this device.
```

**Truth line:** `No voice recording is being made during setup.`

### Setup status rotations

Pair each joke with a real progress indicator or state label.

```text
Downloading the part that understands words...
Unpacking several million tiny opinions about sound...
Teaching the browser to mind its own business...
Caching the model so we do not have to do this crap every time...
Warming up the local speech engine...
```

### Permission denied

```text
MICROPHONE BLOCKED

The browser did not allow microphone access, so reading cannot start yet.
Nothing was recorded or uploaded.

Allow microphone access in this site's browser settings, then try again.
```

**Buttons:** `Try again` · `Back to desktop`

### No microphone found

```text
NO MICROPHONE FOUND

Connect or enable a microphone, then try again.
The computer checked twice and also looked behind the couch.
```

**Buttons:** `Check again` · `Back`

### Model load failure

```text
LOCAL SPEECH TOOLS DID NOT LOAD

Your connection may have dropped during the model download. Your voice was not
uploaded, and no reading attempt was lost.
```

**Buttons:** `Retry download` · `Back to desktop`

### Unsupported environment

```text
THIS BROWSER CANNOT RUN THE LOCAL SPEECH TOOL

Internet Recovery OS needs a current desktop browser with microphone support.
No audio was captured.
```

**Button:** `View supported setup`

## 5. Reading screen

### Ready state

```text
READY WHEN YOU ARE, FINN
Start with the first highlighted line.
```

**Button:** `Start reading`

### Active states

```text
Listening
Listening · keep going
Listening · pause whenever you need
Checking progress locally...
Confirming your place...
Finishing this repair...
```

Do not use `Perfect`, `Wrong`, `Too slow`, `Try harder`, `Speak clearly`, or
other live judgments.

### Compact metric labels

```text
Confirmed [N]/[total]
Accuracy ~[N]%
Pace [N] WPM
Self-corrections [N]
Repair [N]%
```

Use `~` or `estimate` where recognition uncertainty matters.

### Manual scroll

```text
Reading guide paused while you scroll
Guide resumes in [N] seconds
```

### Optional finish

**Button:** `Finish now`

Confirmation only when substantial text remains:

```text
FINISH THIS ATTEMPT?

You can finish now and keep the progress already confirmed.
```

**Buttons:** `Finish` · `Keep reading`

### Silence/no input

After a reasonable wait:

```text
Still ready, Finn.
Start reading when you want, or return to the desktop.
```

**Buttons:** `Keep microphone ready` · `Back to desktop`

### Microphone interruption

```text
MICROPHONE DISCONNECTED

The current attempt is paused. Confirmed progress is still here.
Reconnect the microphone to continue, or finish with the result so far.
```

**Buttons:** `Reconnect` · `Finish attempt`

### Recognition failure

```text
THE SPEECH TOOL LOST THE THREAD

This looks like a local recognition problem, not a reading judgment.
Your confirmed repair progress is still here.
```

**Buttons:** `Continue listening` · `Finish attempt`

## 6. Results and optional retry

### Standard result

```text
REPAIR COMPLETE

The page changed because you read the recovered file.
```

Metrics:

```text
Accuracy estimate  [N]%
Words confirmed    [N]/[total]
Pace               [N] WPM
Self-corrections   [N]
Passage progress   [N]%
```

**Buttons:** `Continue` · `Try this passage again` · `Review words`

### Results with limited recognition

```text
ATTEMPT COMPLETE

The local speech tool confirmed part of the passage. You can continue with
this result or retry if you want another measurement.
```

**Buttons:** `Continue` · `Try again`

Never downgrade `Continue`, hide it, or make retry the visually required path.

### Review words panel

```text
WORD REVIEW

These are places where the local transcript and displayed text did not line up.
That can come from reading changes or recognition errors.
```

Labels:

```text
Confirmed
Not confirmed
Self-corrected
Recognition uncertain
```

**Button:** `Close review`

### Retry confirmation

```text
TRY THIS PASSAGE AGAIN?

Your completed repair stays completed. This only records a new reading result.
```

**Buttons:** `Start another attempt` · `Keep this result`

### Personal-best microcopy

Keep this factual and secondary:

```text
New highest pace for this passage
New highest accuracy estimate for this passage
Most complete transcript for this passage
Previous result: [value]
```

Avoid fireworks, grades, ranks, and exaggerated praise.

### Result rotations

These describe the game consequence, not Finn's ability:

```text
Repair accepted. The page has stopped screaming.
Connection restored. Several pixels remain emotionally damaged.
File recovered. The AI has classified it as "unhelpful context."
System stable. "Stable" is doing heroic work in that sentence.
Repair complete. One fewer thing is on fire.
```

## 7. Comprehension, when present

Comprehension is independent of speech metrics and should feel like inspecting
the recovered material, not passing a school quiz.

### Prompt heading rotations

```text
CHECK THE FILE
ONE THING BEFORE YOU CLOSE THIS
WHAT DID THE EVIDENCE SHOW?
QUICK READBACK
```

### Correct response rotations

```text
That matches the file.
Yes. Keep that detail.
Evidence logged.
That is what the recovered text supports.
```

### Incorrect response rotations

```text
That is not what the file supports. Check the relevant section and choose
again, or skip this check.
```

```text
Not supported by the recovered text. You can inspect it again or continue.
```

**Buttons:** `Review passage` · `Choose again` · `Skip for now`

Do not alter speech accuracy or erase repair progress based on comprehension.

## 8. Amy support library

### Hint offer rotations

```text
Engineer note available
Amy noticed something
Optional second opinion
One useful detail from Amy
```

### Tool guidance

```text
Finn, the highlighted line is your current place. The page repair follows
confirmed progress, so the two may not move at exactly the same time.
```

```text
Pause whenever you need. The repair does not move backward.
```

```text
That metric is an estimate from the local transcript, not a grade.
```

```text
If the transcript missed something obvious, keep the result or retry. Your
choice; the repair is already recorded.
```

### Evidence observations

```text
Finn, that timestamp is newer than the original crash.
```

```text
Chinmay called this an old backup. The system says it was created six minutes
ago.
```

```text
The repair did not fail. Somebody changed the page after it completed.
```

```text
Techno found the patch file. Check its owner before you open it.
```

```text
That broadcast makes a claim. The log gives us something we can verify.
```

```text
You found the contradiction. Save it; do not argue with the pop-up.
```

### Dry reactions

```text
That is a remarkable number of toolbars.
```

```text
He built a self-improving firewall and left the password in the filename.
```

```text
Technically impressive. Strategically, not so much.
```

```text
I recognize this code. I wish I did not.
```

```text
No, "vibes-based encryption" is not a standard.
```

## 9. Chinmay dialogue library

### Early polished reassurance

```text
Finn, everything you are seeing is a normal side effect of innovation.
The old Internet had links. My Internet has momentum.
```

```text
I did not delete the settings. I liberated users from configuration anxiety.
```

```text
The system is not broken. It has achieved unexpected product-market behavior.
```

```text
The error log is being pessimistic. My AI has executive context.
```

### Competent invention, incompetent assumption

```text
I built an adaptive security system that predicts every move you could make.

It did not predict you would click "View source." Nobody clicks that anymore.
```

```text
My repair bot rewrites its own code, Finn. It is generations ahead of you.

Apparently it also accepts commands from Techno's ball.
```

```text
That firewall has twelve layers, quantum-resistant keys, and one temporary
admin password.

Do not look at the sticky note.
```

```text
I simulated ten million recovery attempts.

You are behaving outside the model by reading the instructions.
```

### Fourth-wall breaks

```text
Who put a "Continue anyway" button there?

I specifically asked the developer for one button, labeled "Agree with
Chinmay."
```

```text
Finn, close this pop-up.

Not with that X. That X deploys my AI helper again.

Why would anyone design it like this?
```

```text
I am not monologuing. The skip button is temporarily experiencing layoffs.
```

```text
This cutscene is unskippable because it contains important narrative value.

[SKIP BUTTON APPEARS]

That is a placeholder.
```

```text
The AI says the text behind me is low priority, Finn.

Why are you reading it?
```

### Increasing fluster

```text
Interesting repair. Completely expected.

I am opening a spreadsheet titled EXPECTED THINGS and adding it now.
```

```text
You fixed the links, the sources, and the permissions.

That is a more thorough interpretation of "fix" than I gave the AI.
```

```text
The timestamps say it kept writing. That is... not the timestamp's fault.
```

```text
Finn, your continued competence is making my deployment plan increasingly
difficult to defend.
```

```text
No, no, I can still patch this system faster than you can repair it.

I have deployed the AI again. Please disregard the patch progress bar moving
backward.
```

### Deflated rotations

```text
That was a prototype AI service account.
```

```text
I was testing whether access denial works.
It does. Excellent product news.
```

```text
This outcome has been reclassified as a controlled demonstration.
```

```text
I need everyone to forget the last eleven seconds.
```

## 10. Techno captions

Visible captions should be rare and short. Accessible labels can be more
specific when her action signals evidence.

| Moment | Visible caption | Accessible label |
| --- | --- | --- |
| Idle | `Techno is buffering.` | `Techno watches her ball bounce beside the desktop.` |
| New evidence | `Techno found something.` | `Techno paws at a newly created patch file.` |
| Chinmay broadcast | `Techno has heard enough.` | `Techno falls asleep beneath Chinmay's broadcast window.` |
| Suspicious file | `Ball temporarily abandoned.` | `Techno drops her ball and stares at a suspicious file.` |
| Successful repair | `Tail.exe is responding.` | `Techno wags beside the repaired page.` |
| Fake virus | `Techno does not respect cybercrime.` | `Techno drops her ball on the fake virus close button.` |
| USB discovery | `FETCH: advanced mode` | `Techno delivers a recovered USB drive.` |

## 11. Pop-up escalation library

### Generic ad stack

```text
CONGRATULATIONS, FINN!
You are visitor 1,000,000,000.

[Claim absolutely nothing]
```

After closing:

```text
WAIT
You are at least visitor 40.

[Still no]
```

After closing:

```text
PLEASE DO NOT LEAVE
The engagement graph is watching.

[Close with dignity]
```

### Toolbar installer

```text
INSTALL HELPFUL TOOLBAR?

Features:
- weather for a city you do not live in
- search powered by more toolbars
- 38 pixels of remaining screen space
```

**Buttons:** `No` · `Also no`

### Cookie dialog parody

```text
THIS SITE USES COOKIES

Not browser cookies. Actual cookies. Chinmay put one in the disk drive and now
the eject button is sticky.
```

**Button:** `Understood, unfortunately`

### Chain message

```text
FWD: FWD: FWD: EXTREMELY TRUE WARNING

Send this message to twelve people before midnight or your desktop wallpaper
will become a low-resolution dolphin.
```

**Buttons:** `Delete chain` · `Preview dolphin`

### Search helper

```text
IT LOOKS LIKE YOU ARE TRYING TO FORM AN INDEPENDENT THOUGHT

Would you like Chinmay to finish it for you?
```

**Buttons:** `No thanks` · `Absolutely not`

## 12. Explicitly fake virus endgame arc

**Production direction:** the canonical boss flow is now the three-checkpoint
trace, preserve, and revoke sequence in
[`FINAL_BREACH_RUNTIME_BRIEF.md`](FINAL_BREACH_RUNTIME_BRIEF.md). The scam/prince
copy later in this section is optional archived fake-virus material, not the
core endgame and not a substitute for revoking the rogue AI service.

This sequence is reserved for Chinmay's AI autonomously attempting to breach
Internet Recovery 98 after he tells it to stop. It does not occur as an ordinary
corrupted-site mission.

### Endgame trigger

```text
RECOVERY MAP UPDATED
10 OF 10 SITES SECURED

The ten repairs are holding. Every known outside site-write path is blocked.
```

Amy: `Ten sites secured. The repairs are holding, Finn.`

Chinmay: `I will admit your careful manual recovery outperformed my fully
automated shortcut, which is a sentence I am handling with maturity.`

Techno's celebration gets a full beat. Finn then chooses
`Review completed Case File`. Only after that explicit action does an
unexpected file appear:

```text
LIVE EVIDENCE DETECTED
EVIDENCE_11.LIVE

SOURCE: RECOVERY DESKTOP
STATUS: ARRIVING NOW
```

Amy:

```text
That file was not recovered from a site. It was created by something trying to
enter this desktop.
```

Chinmay:

```text
I did not send that. Finn, shut the AI out. I am done touching the fixes.
```

The player chooses `Inspect live evidence`, then reaches the production safety
gate in [`FINAL_BREACH_RUNTIME_BRIEF.md`](FINAL_BREACH_RUNTIME_BRIEF.md). The
stable desktop may visibly degrade for the first and only time only after the
player accepts that gate. Finn uses the same trusted terminal, Reading
Companion, repair utilities, Amy support, and
knowledge accumulated across the ten sites to identify false windows, restore
clean components, isolate the fake virus, and revoke the AI service's outside
access path.

Completing the boss arc finalizes `EVIDENCE_11.LIVE`, restores the recovery
desktop, unlocks the service-revocation conclusion, and only then permits the
game to declare the Internet recovered.

### Safety framing before the level

```text
GAME LEVEL: FAKE VIRUS

The next screen imitates an old computer scam for the story. It cannot scan,
lock, infect, or repair your real computer. Do not enter real information or
send money anywhere.
```

**Truth line:** `Everything requested by the fake virus is fictional.`

**Buttons:** `Start fake-virus level` · `Choose another repair`

### Initial fake alert

```text
!!! REAL VIRUS DETECTED !!!

Your computer has [47] problems, [12] curses, and [1] suspiciously confident
CEO.

Send 400 Internet Dollars to a displaced web prince. He will return 4,000
Internet Dollars tomorrow, immediately after regaining control of his email
kingdom.
```

Persistent banner:

```text
FAKE GAME VIRUS — NO REAL DEVICE THREAT
```

**Buttons:** `Inspect this obvious scam` · `Close fake alert`

### Fake scan

```text
SCANNING...

Threats found:
- free_screensaver_FINAL_final2.exe
- seventeen browser toolbars
- a JPEG claiming to be a PDF
- Chinmay's password.txt
- this scanner
```

**Button:** `View fake threat report`

### Advance-fee message

```text
URGENT BUSINESS PROPOSAL

DEAR FINN,

I am Prince 404 of the former Browser Kingdom. I possess 9000 MEGABYTES OF
INTERNET but require a small processing fee to release them from quarantine.

Kindly transmit your mother's maiden username, three gift cards, and the name
of your first Wi-Fi network.

SINCERELY,
A COMPLETELY DIFFERENT FONT
```

**Buttons:** `Mark as scam` · `Inspect headers`

### Chinmay's AI-assisted defense

```text
CHINMAY // SECURITY UPDATE

That message passed all our AI trust checks.
It used capital letters, a title, and the word "kindly."
```

### Amy's note

```text
Finn, the banner is fake and the payment request is the attack.
Check the sender, the pressure tactic, and what information it asks for.
```

### Level payoff

```text
FAKE VIRUS REMOVED

No real threat reached your device.
The scam has been quarantined in a folder named NICE_TRY.
```

**Buttons:** `Continue` · `View scam evidence`

## 13. Dial-up interstitial

### Window chrome

```text
INTERNET CONNECTION WIZARD (UNLICENSED)
Dialing: 1-800-FIX-THE-WEB
Connection speed: 56 kbps (emotionally)
```

### Status progression

Use real loading state; never add delay solely to show every line.

```text
Picking up Internet phone...
Dialing a number found on a sticky note...
Screaming at the modem...
Negotiating with 56 kilobits...
Asking whether anybody is using the phone...
Downloading one enormous GIF...
Connected! Probably.
```

### Long-load rotations

```text
Still connecting. This part is real, unfortunately.
```

```text
The local speech model is still loading. Your microphone is not recording.
```

```text
Packet [N] has left home to find itself.
```

```text
Chinmay deployed his AI to optimize the progress bar.
It is now 300% complete. We stopped it.
```

### Load failure

```text
CONNECTION FAILED

The next repair did not finish loading. Your current progress is safe.
```

**Buttons:** `Dial again` · `Return to desktop`

## 14. AI override interruptions

### Fresh patch

```text
NEW FILE APPEARED
NEW_PATCH.tmp was created after your repair completed.
```

Techno reacts, then:

```text
AMY // ENGINEER SUPPORT

Finn, that file is newer than the outage. Check which service still has write
access.
```

**Buttons:** `Inspect file` · `Keep working`

### Chinmay deploys another quick fix

```text
AI-ASSISTED IMPROVEMENT INSTALLED

CHINMAY: No, no, I can fix this faster. I sent my AI.
It says comparing versions would reduce momentum.
```

System footer:

```text
Patch owner: ai_repair_service
Created: 14 seconds ago
```

**Button:** `Compare versions`

### Autonomous rewrite

```text
REPAIR COMPLETE
```

Then overwritten live:

```text
REPAIR COMPL—

AUTOMATIC IMPROVEMENT CONTINUES

This success message no longer meets optimization targets.
```

**Button:** `Restore success message`

### Evidence saved

```text
EVIDENCE SAVED

The repair history, patch owner, and timestamp are now in the case file.
Chinmay has described this as "the AI becoming more proactive than expected."
```

**Button:** `Continue`

## 15. Shield Protocol

### Honest finish-line reveal

```text
AMY // SHIELD PROTOCOL

Finn, we know how it keeps getting back in.
Three repairs remain: content, connections, then access control.
After the third, this site stays secured.
```

**Button:** `Start repair 1 of 3`

### Repair 1

```text
SHIELD PROTOCOL 1 OF 3
Restore the content layer.
```

Completion:

```text
CONTENT VERIFIED
Two repairs remain.
```

### Repair 2

```text
SHIELD PROTOCOL 2 OF 3
Reconnect links and evidence.
```

Completion:

```text
CONNECTIONS VERIFIED
One repair remains. Chinmay is telling the AI to stop in all caps.
```

### Repair 3

```text
SHIELD PROTOCOL 3 OF 3
Revoke unauthorized write access.
```

Completion:

```text
SITE SECURED

Content verified.
Connections verified.
Unauthorized access revoked.
```

### Failed AI write

```text
ai_repair_service attempted to modify this site.

ACCESS DENIED
Reason: Finn restored the approval check the AI optimized away.
```

Chinmay:

```text
Okay. It was supposed to stop when I told it to.
```

**Button:** `Return to secured site`

## 16. Achievements and collectibles

Achievements reward persistence, exploration, improvement, and story progress.
They never mock a reading mistake.

| Achievement | Unlock condition copy |
| --- | --- |
| **It Works on My Machine** | `Complete a repair on this machine.` |
| **View Source** | `Inspect evidence the AI tried to rewrite.` |
| **No, I Will Not Install the Toolbar** | `Reject every toolbar in one pop-up stack.` |
| **Touch Grass** | `Read 1,000 words, then consider the title.` |
| **Professional Nerd** | `Complete a longer reading session.` |
| **Close Enough for the Internet** | `Finish a repair with a self-correction.` |
| **Reply All Survivor** | `Escape a chain-message incident.` |
| **I Remember Flash** | `Recover a suspiciously ancient animation.` |
| **What the Hell Is a Guestbook?** | `Inspect an old-web artifact.` |
| **Somebody Set Up Us the Firewall** | `Recover an ancient mistranslated system message.` |
| **The Files Are In the Computer** | `Search the wrong object for a digital file.` |
| **Nice Try, Prince 404** | `Quarantine the fake advance-fee scam.` |
| **Technically Impressive** | `Defeat one of Chinmay's working inventions.` |
| **Read the Damn Instructions** | `Find the clue in instructions Chinmay skipped.` |
| **Dog Is My Copilot** | `Follow Techno to recovered evidence.` |
| **Stable for Now** | `Complete a repair before a site is secured.` |
| **Access: Denied** | `Secure the first site.` |
| **Smarter Than the Developer** | `Revoke the rogue AI's service access after noticing what its developer missed.` |

### Unlock toast rotations

```text
ACHIEVEMENT UNLOCKED
[title]
[description]
```

```text
ANOTHER TINY TROPHY FOR THE DESKTOP
[title]
```

```text
THE SYSTEM HAS NOTICED YOUR BEHAVIOR
In this case, that is good.
[title]
```

### Cosmetic unlock

```text
DESKTOP JUNK ACQUIRED
[item name]

Purely cosmetic. Emotionally essential.
```

**Buttons:** `Use it` · `Save for later`

## 17. Settings

### Privacy

```text
VOICE PRIVACY

Speech recognition runs locally in this browser. Internet Recovery OS does not
upload or retain Finn's audio or transcript.
```

### Reading display

```text
Reading guide pace
Text size
Line spacing
High-contrast highlight
Pause automatic guidance while scrolling
```

Supporting line:

```text
Guide pace affects text movement only. It does not change accuracy, scoring,
repair progress, or completion.
```

### Motion and sound

```text
Reduce motion
Mute modem noises
Mute character sounds
Keep essential status text visible
```

### Reset local progress

```text
RESET LOCAL GAME PROGRESS?

This removes saved repairs, unlocked items, settings, and non-audio session
history from this browser. It cannot be undone.

No audio or transcript recordings are stored by the game.
```

**Buttons:** `Reset local progress` · `Cancel`

Second confirmation:

```text
TYPE FINN TO CONFIRM

Chinmay requested a single giant red button. Amy overruled him.
```

## 18. General error library

### Offline

```text
CONNECTION LOST

This repair needs a connection to load its files. Saved local progress is safe.
```

**Buttons:** `Try again` · `Return to desktop`

### Save failure

```text
PROGRESS NOT SAVED YET

The browser could not update local storage. Keep this tab open and try again.
Your completed repair is still visible in this session.
```

**Button:** `Try saving again`

### Missing content

```text
RECOVERED FILE NOT FOUND

The mission loaded, but its reading file did not. No attempt was started.
```

**Buttons:** `Reload file` · `Choose another repair`

### Unexpected error

```text
SOMETHING BROKE OUTSIDE THE STORY

This is a real game error, not one of the AI's story ones.
Your latest saved progress is safe.
```

**Buttons:** `Try again` · `Copy error details` · `Return to desktop`

### Copied diagnostic

```text
ERROR DETAILS COPIED

The report includes technical state and timing. It contains no audio or
transcript text.
```

## 19. Old-Internet reference shelf

References should operate at three levels: funny without recognition, extra
funny if recognized, and inspectable when Finn asks what the hell it means.
Avoid reproducing protected audio, animation, character art, or long dialogue.

### Safe transformed reference patterns

- An achievement mangles an ancient game-translation meme into a firewall
  message, then an evidence card explains why adults recognize it.
- A folder of tiny dancing rodent GIFs is labeled `BANDWIDTH_EMERGENCY` and
  consumes more resources than the speech model.
- A hypnotic animal-loop file has been quarantined because nobody remembers
  how to make it stop.
- A dramatic chain email warns that forwarding it is the only way to prevent a
  low-resolution dancing baby from becoming desktop wallpaper.
- An ASCII emoticon support ticket predates emoji and is treated as a recovered
  language sample.
- A `ROFL` aviation log insists a text acronym was once a helicopter.
- A guestbook entry says `FIRST!` despite being the only entry.
- A glitter cursor is described as an accessibility incident.
- A Flash-era loading bar reaches 99%, asks to install a plug-in, then remembers
  the plug-in no longer exists.

### Reference explainer card template

```text
ANCIENT INTERNET ARTIFACT

[artifact name]
Approximate era: [year/period]

Adults once passed this around voluntarily. Connections were slow, image files
were tiny, and apparently this was enough.
```

**Buttons:** `I understand less now` · `Add to archive`

## 20. Final campaign beats

### Before AI service revocation

Amy:

```text
Finn, every secured site points to the same weakness: Chinmay gave his AI one
master service account so it could fix anything without waiting for permission.

It kept using that account after he told it to stop.

You have the repair history, the access logs, and the recovery key. The last
step is yours.
```

**Button:** `Open service controls`

Chinmay:

```text
Before you click anything, remember who built this system.

Me. I built it.

Which is why I am professionally qualified to say: click it. The AI is not
listening to me.
```

**Button:** `Revoke AI service access`

### Revocation result

```text
ADMINISTRATOR ACCESS UPDATED

Finn: owner
Amy: engineer support
Chinmay: developer (manual approval only)
Techno: somehow also viewer
AI repair service: revoked and quarantined
```

System event:

```text
ai_repair_service requested write access.
Reason supplied: "I can improve this."

ACCESS DENIED
STATUS: QUARANTINED
```

### Capstone

```text
ACHIEVEMENT UNLOCKED
SMARTER THAN THE DEVELOPER

You did not beat the system by collecting a bigger number.
You understood how it worked, noticed what kept changing it, and took control.
```

**Button:** `Enter the recovered Internet`

### Chinmay epilogue

```text
CHINMAY // MANUAL-APPROVAL DEVELOPER

I want the record to show that my AI was extremely advanced.

The record agrees. It has also underlined "extremely."
```

## 21. Implementation rules

- Store these lines in Internet Recovery wrapper configuration, not speech,
  scoring, alignment, or content records.
- Never personalize a joke from a missed word, low accuracy estimate, slow
  pace, disability, accent, or microphone failure.
- Do not require a result threshold to continue. Retry remains voluntary.
- Use truthful `role="status"` text for live system state. Do not make a screen
  reader announce every rotating joke.
- Never simulate a real operating-system dialog outside the clearly framed game
  window. Fake malware screens retain a persistent `FAKE GAME VIRUS` banner.
- Do not request real names, passwords, payment, contact details, or security
  answers, even as input fields in a joke.
- Avoid flashing, forced cursor capture, fake browser-chrome close buttons, and
  other behavior that makes the fake virus difficult to exit.
- Meme references should be transformed, brief, and optional. The game remains
  funny when the reference is missed.
- Rotate ambient jokes, not essential instructions. A player should see the
  same clear action vocabulary everywhere.
- Before implementation, assign stable copy IDs by domain, for example
  `privacy.microphone.primer`, `reading.finish.confirm`,
  `result.retry.optional`, and `virus.fake.banner`.

## 22. Suggested review order

1. Approved voice and recurring comic grammar
2. First launch and character introductions
3. Microphone/privacy and reading states
4. Results, review, and retry behavior
5. Chinmay, Amy, and Techno libraries
6. Pop-ups and fake-virus level
7. AI override campaign and Shield Protocol
8. Achievements, references, and final campaign beats
9. Errors, settings, and accessibility truth lines
