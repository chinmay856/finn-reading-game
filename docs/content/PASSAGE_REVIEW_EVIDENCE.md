# Passage review evidence protocol

Candidate passages remain unselectable until a repository review record proves every required gate against one exact content revision.

Each review dimension—accessibility, comprehension, editorial, factual, grade, profile, rights, sensitivity, and transcription—must record `passed`, an independent reviewer ID, an ISO timestamp, and a concrete evidence reference. The reviewer ID cannot equal the declared passage author ID.

Real-microphone evidence must record at least one complete-passage run with browser and recognizer versions, device class, timestamp, and explicit confirmation that audio was neither uploaded nor retained. Every declared unstable transcription token must have a supported disposition: stable, accepted form, or profile adjusted.

Changing passage text changes `contentRevision`. Every review must then be repeated against that revision; copying decisions from an earlier revision cannot promote the passage.

The validator in `content/review-evidence.js` creates an approved projection only when all evidence is complete. It never edits the candidate record, invents reviewer decisions, or treats automated tests as human or microphone review.
