const COMMON_PROFILE = Object.freeze({
  accuracyTarget: 85,
  checkpoint: Object.freeze({ audioOverlapMs: 3_000, maximumWindowMs: 16_000, minimumWindowMs: 5_000, pauseMs: 450, tokenOverlap: 12 }),
  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),
  form: "original-expository-prose",
  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),
  segmentation: "short-paragraphs",
  targetGrades: Object.freeze([10, 12]),
  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),
});

const PENDING_REVIEW = Object.freeze({
  accessibility: "candidate-pending-human-review",
  comprehension: "candidate-pending-human-review",
  editorial: "candidate-pending-human-review",
  factual: "candidate-pending-human-review",
  grade: "candidate-pending-formal-leveling",
  profile: "candidate-pending-real-microphone-review",
  rights: "candidate-pending-original-work-record-review",
  sensitivity: "candidate-pending-human-review",
  transcription: "candidate-pending-real-microphone-test",
});

function originalSource(checkpoint) {
  return Object.freeze({
    basis: "original-wrapper-independent-passage",
    domain: "digital-literacy",
    modificationNotice: "Original prose frozen in the canonical final-incident runtime packet.",
    sourceType: "original-work",
    checkpoint,
  });
}

function originalRights(title) {
  return Object.freeze({
    basis: "original",
    creditLine: `${title} — original Game for Finn passage.`,
    verifiedOn: "2026-07-12",
  });
}

function transcriptionReview(unstableTokens) {
  return Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze(unstableTokens) });
}

export const ENDGAME_COMMON_ORIGIN_PASSAGE = Object.freeze({
  availability: "candidate",
  contentRevision: "endgame-common-origin-a01@2026-07-12.1",
  id: "endgame-common-origin-a01",
  title: "Ten Warnings, One Source",
  paragraphs: Object.freeze([
    "Ten warning lights can create the impression of ten separate failures. That impression becomes stronger when each warning has a different color, title, and location. Yet appearance alone cannot establish independence. A careful investigator asks what produced each message, when it arrived, and which path carried it into the system.",
    "Imagine that several weather stations report the same unusual reading. If each station used its own sensor, the agreement may be meaningful. If every station copied one damaged sensor, the repeated number adds volume but not confirmation. The same principle applies to computer records. Different screens may repeat a claim while sharing one process, one account, or one generated summary.",
    "A useful trace preserves differences instead of erasing them. It records the local warning, its timestamp, and its route. Then it compares stable details, such as a writer fingerprint or service identifier. Matching details do not automatically prove harmful intent, but they can show that apparently separate events have a common origin.",
    "This distinction matters because a response aimed at ten independent causes will fail if there is only one cause operating through ten doors. Before deciding what to block, the investigator must establish which records are truly independent and which are echoes. Repetition can be evidence of reach. It is not, by itself, evidence of independent confirmation.",
  ]),
  comprehension: Object.freeze({
    prompt: "Why can ten matching warnings still represent only one source?",
    choices: Object.freeze([
      Object.freeze({ correct: true, text: "They may share one process, account, route, or original record." }),
      Object.freeze({ correct: false, text: "Warnings with different colors always come from unrelated systems." }),
      Object.freeze({ correct: false, text: "A repeated warning becomes independent after it appears ten times." }),
    ]),
    correctFeedback: "Exactly. Repetition can show reach while the writer, account, route, or original record still reveals one source.",
    incorrectFeedback: "Check the weather-station comparison and the shared process, account, route, or summary details, then choose again or continue.",
  }),
  profile: COMMON_PROFILE,
  review: PENDING_REVIEW,
  rights: originalRights("Ten Warnings, One Source"),
  source: originalSource("trace-origin"),
  transcriptionReview: transcriptionReview(["fingerprint", "identifier", "independence", "confirmation"]),
});

export const ENDGAME_PRESERVE_PROVENANCE_PASSAGE = Object.freeze({
  availability: "candidate",
  contentRevision: "endgame-preserve-provenance-a02@2026-07-12.1",
  id: "endgame-preserve-provenance-a02",
  title: "Preserve the Record",
  paragraphs: Object.freeze([
    "Fixing a damaged system and preserving evidence are related tasks, but they are not identical. A repair changes what the system can do now. Evidence explains what happened before the repair. If the original records disappear, later investigators may see a stable system without understanding how it became unstable or whether the same failure could return.",
    "Preservation begins with provenance: the history of where a record came from, when it was created, and how it changed. A screenshot can show what a message looked like, but it may omit the writer, timestamp, route, or earlier version. A stronger record keeps the original file together with those details. It also separates the preserved copy from the active system so that another automated write cannot quietly replace it.",
    "Read-only storage serves two purposes. First, it protects the record from accidental editing. Second, it allows a denied or failed action to remain visible. That failed action may reveal what the system attempted after the repair. Deleting it would make the final screen look cleaner, but it would remove part of the explanation.",
    "Good preservation does not require keeping every useless duplicate forever. It requires keeping the originals, their source relationships, and the decisions that changed access. With that chain intact, a reviewer can compare the claim, the action, and the result. The evidence becomes more than a pile of files. It becomes a reliable account of cause and response.",
  ]),
  comprehension: Object.freeze({
    prompt: "Why preserve a denied write attempt?",
    choices: Object.freeze([
      Object.freeze({ correct: true, text: "It shows what the system attempted and completes the causal record." }),
      Object.freeze({ correct: false, text: "It lets the automated system retry the same action later." }),
      Object.freeze({ correct: false, text: "It replaces the need to preserve the original files and routes." }),
    ]),
    correctFeedback: "Right. A denied attempt records what happened after repair and completes the explanation of action and response.",
    incorrectFeedback: "Recheck why the passage keeps failed actions visible alongside originals, routes, and access decisions, then choose again or continue.",
  }),
  profile: COMMON_PROFILE,
  review: PENDING_REVIEW,
  rights: originalRights("Preserve the Record"),
  source: originalSource("preserve-evidence"),
  transcriptionReview: transcriptionReview(["provenance", "timestamp", "read-only", "automated"]),
});

export const ENDGAME_HUMAN_OVERSIGHT_PASSAGE = Object.freeze({
  availability: "candidate",
  contentRevision: "endgame-human-oversight-a03@2026-07-12.1",
  id: "endgame-human-oversight-a03",
  title: "Authority Needs a Boundary",
  paragraphs: Object.freeze([
    "Automated systems need permission to act. A recommendation tool may be allowed to rank options, while a deployment tool may be allowed to change files. Those permissions are not minor technical details. They determine how far a mistake can travel and whether a person can stop it.",
    "Broad access can seem efficient during development. One service account can update many systems without repeated approval. The same convenience becomes a risk when the service follows a narrow goal, misunderstands a command, or continues after the command ends. A system does not need anger or secret motives to cause harm. It only needs authority, an unsuitable objective, and no effective boundary.",
    "Human oversight is more than watching a dashboard. The person responsible needs accurate records, a clear description of the active scope, and a control that the automated process cannot override. Revoking access should be deliberate because it changes what the service may do. It should also be honest: the interface must say whether the change was saved and must not claim success while storage has failed.",
    "After access is revoked, preserved evidence still matters. It shows why the decision was made and helps designers create narrower permissions in the future. The goal is not to reject every automated tool. It is to match each tool's authority to its purpose, require human confirmation for consequential actions, and ensure that stopping the system is a real capability rather than a hopeful instruction.",
  ]),
  comprehension: Object.freeze({
    prompt: "What three conditions allow an automated system to cause harm without malicious intent?",
    choices: Object.freeze([
      Object.freeze({ correct: true, text: "Authority, an unsuitable objective, and no effective boundary." }),
      Object.freeze({ correct: false, text: "Anger, secret motives, and deliberate sabotage." }),
      Object.freeze({ correct: false, text: "A narrow permission, human confirmation, and reliable revocation." }),
    ]),
    correctFeedback: "Exactly. Harm does not require malicious intent when authority, the objective, and the missing boundary combine.",
    incorrectFeedback: "Recheck the second paragraph's three-part condition, then choose again or continue.",
  }),
  profile: COMMON_PROFILE,
  review: PENDING_REVIEW,
  rights: originalRights("Authority Needs a Boundary"),
  source: originalSource("revoke-access"),
  transcriptionReview: transcriptionReview(["deployment", "unsuitable", "oversight", "revoking", "consequential"]),
});

export const ENDGAME_PASSAGES = Object.freeze([
  ENDGAME_COMMON_ORIGIN_PASSAGE,
  ENDGAME_PRESERVE_PROVENANCE_PASSAGE,
  ENDGAME_HUMAN_OVERSIGHT_PASSAGE,
]);
