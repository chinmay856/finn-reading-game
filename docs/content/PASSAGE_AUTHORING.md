# Prototype passage authoring guide

## Purpose

Prototype passages should test whether reading aloud is usable and enjoyable,
not whether a speech recognizer can guess rare names. Hand-authored Internet
Recovery missions therefore favor natural teen-level prose with vocabulary that
is meaningful, pronounceable, and likely to transcribe consistently.

This is a Content Platform and test-content policy. The Reading Engine remains
theme-neutral and must still tolerate recognition uncertainty.

## Avoid in initial prototype passages

- long, uncommon, or visually ambiguous proper nouns;
- invented names with several plausible pronunciations;
- dense strings of acronyms, version numbers, usernames, or file hashes;
- repeated code, URLs, symbols, or punctuation intended to be read literally;
- tongue twisters and alliteration that mainly stress the recognizer;
- unexplained foreign-language words or specialist jargon;
- passages whose key scoring decision depends on one unusual token.

For example, a Misselphwaite-like fictional place name is a poor prototype
scoring token: even a careful, correct reading may produce several plausible
transcripts. Replace it with a familiar name when writing original mission copy,
or restructure the sentence so the rare name is not required for progress.

## Prefer

- natural sentences a 14-year-old might encounter on a real webpage;
- varied but common vocabulary with useful context;
- a controlled number of genuinely challenging words;
- short names with conventional spelling/pronunciation;
- passages that remain coherent if one token is transcribed imperfectly;
- humor, evidence, and media-literacy ideas that do not depend on gimmick words.

Do not flatten the writing into elementary vocabulary. The goal is mature,
interesting prose with fair acoustic evidence, not artificially easy text.

## Passage review checklist

Before a prototype passage ships:

1. Read it aloud naturally on the target phone/browser at least three times.
2. Record which words the recognizer changes across otherwise clear readings.
3. Rewrite avoidable unstable names, strings, or jargon.
4. Confirm that one uncertain token cannot block completion or dominate accuracy.
5. Keep only challenge words whose value outweighs recognizer risk.
6. Test pauses, retries, and self-corrections around those words.

## Future long-form and authentic text

Real books and source documents must not be silently rewritten merely to suit a
recognizer. When an authentic text includes an unusual name, the Content
Platform may attach theme-neutral support metadata:

```json
{
  "token": "unusual-name",
  "displayText": "Original spelling",
  "pronunciationHint": "reader-friendly hint",
  "acceptedTranscriptForms": ["plausible form one", "plausible form two"],
  "scoringWeight": 0.25
}
```

The exact schema is not decided here. The important behaviors are:

- preserve the displayed source text;
- offer an optional pronunciation preview;
- accept plausible recognizer outputs without claiming the learner misread;
- lower or remove scoring weight when recognition is intrinsically uncertain;
- keep recognizer confidence separate from pronunciation assessment;
- log uncertainty for model evaluation without exposing raw child audio.

These capabilities preserve future book compatibility but are not required to
build before the small prototype is tested.

## Grade and quality target

Finn is in 10th grade. The library should primarily span grades 10–12, with a
controlled mix of accessible and stretching passages rather than one fixed
formula score. Reading level is a review signal, not proof of quality: syntax,
background knowledge, abstraction, structure, and transcription behavior all
need human review.

Passages should feel like material worth reading in their own right. A useful
target is roughly 500–1,200 words per full mission passage, segmented into
shorter resumable sections after device testing establishes comfortable session
length. The UI may show only a moving window of that text.

The mix should cover the broad academic domains used in college-readiness
reading: literature, history/social studies, humanities, and science. It should
also exercise central ideas, details, evidence, inference, vocabulary in
context, structure, purpose, and cross-text comparison without copying SAT
questions or branding the game as test preparation.

## Three-source passage library

### 1. Literary excerpts

Use genuinely strong prose from works whose reuse rights have been verified.
Prefer public-domain editions or explicitly licensed sources, and store title,
author, publication year, edition/source URL, rights basis, credit line, and any
adaptation notes with the content record.

Choose excerpts that stand alone, contain a meaningful change or observation,
and do not require several pages of missing context. Avoid transcription-hostile
proper nouns when selecting among otherwise good excerpts. Do not silently
modernize or rename characters in an authentic excerpt; display edits and
abridgment must be documented.

### 2. Explanatory and disciplinary essays

Commission or curate clear essays about science, history, technology, culture,
ethics, and how knowledge is built. Essays can connect loosely to a mission's
theme but do not have to describe the parody webpage.

Scientific-reading selections should gradually teach the structures readers
actually encounter:

- research question or problem;
- background and hypothesis;
- methods, variables, sample, and comparison;
- results stated separately from interpretation;
- uncertainty, limitations, and alternative explanations;
- figures, tables, captions, and references;
- correlation distinguished from causation.

Start with well-written science journalism and explanatory abstracts, then move
toward age-appropriate adapted research summaries. Do not imply that dense
jargon is what makes scientific writing rigorous.

### 3. Original custom writing

Original passages may use comedy, suspense, Internet Recovery lore, or a genre
Finn enjoys. AI assistance is acceptable as a drafting tool, but every passage
requires human editorial review for factual accuracy, coherence, voice,
originality, age fit, bias, safety, and transcription fairness.

Create original characters, settings, sentences, and plots. Do not take a
copyrighted passage and merely swap names, paraphrase it closely, or imitate a
living author's distinctive style. A broad genre parody is acceptable; a renamed
substitute for a protected work is not. Public-domain works may be transformed
when rights and adaptation are recorded, but the source should still be credited.

## Suggested library balance

For an initial 30-passage review set:

- 10 verified literary excerpts across fiction, memoir, speech, and essay;
- 10 explanatory pieces across science, history/social studies, and humanities;
- 10 original pieces across comedy, suspense, speculative fiction, and game lore.

Balance is measured across the library, not forced into every site. Repeated
sabotage visits should rotate source type and structure so replay changes the
kind of reading practice, not only the topic.

## Required content metadata

Each passage should eventually record:

```json
{
  "sourceType": "public-domain-literature | licensed | explanatory | original",
  "domain": "literature | history-social-studies | humanities | science",
  "targetGrades": [10, 12],
  "rights": {
    "basis": "public-domain | license | original",
    "sourceUrl": "https://example.invalid/source",
    "verifiedOn": "YYYY-MM-DD",
    "creditLine": ""
  },
  "skills": ["central-idea", "evidence", "inference"],
  "transcriptionReview": {
    "tested": false,
    "unstableTokens": []
  }
}
```

This illustrative schema is future-facing; the prototype does not need a full
content-management system before testing the core loop.

## Reading profiles

Pacing and presentation expectations belong to content metadata, not one
universal game constant. A passage may carry a theme-neutral reading profile
covering:

- form, such as expository prose, narrative, poetry, or drama;
- segmentation, such as short paragraphs, scenes, stanzas, or continuous prose;
- comfortable and stretch WPM guidance;
- accuracy target;
- pause/checkpoint timing appropriate to the form;
- end-of-passage evidence requirements.

These values guide practice and UI behavior; they are not claims that one genre
has a universally correct reading speed. Poetry may intentionally reward
phrasing and pauses, Shakespearean drama may segment by speech or scene, and
dense scientific prose may use slower targets than familiar narrative. The
first implemented profile is the original evidence passage in
`content/evidence-passage.js`.

The viewport guide may use a selected WPM to keep upcoming text visible, but it
must never use estimated pace or voice activity to declare completion. A reader
may exceed the selected WPM. Profiles should therefore provide higher-speed
headroom, look-ahead text, and manual-scroll recovery while reserving completion
and scoring for transcript evidence.
