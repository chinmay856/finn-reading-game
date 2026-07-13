const SHARED_PROFILE = Object.freeze({
  accuracyTarget: 85,
  checkpoint: Object.freeze({
    audioOverlapMs: 3_000,
    maximumWindowMs: 16_000,
    minimumWindowMs: 5_000,
    pauseMs: 450,
    tokenOverlap: 12,
  }),
  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),
  form: "argumentative-nonfiction",
  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),
  segmentation: "short-paragraphs",
  targetGrades: Object.freeze([10, 12]),
  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),
});

const SHARED_SOURCE = Object.freeze({
  basis: "original-project-prose",
  domain: "argument-and-source-literacy",
  modificationNotice: "Original prose frozen in the canonical ThreadIt first-run manuscript packet.",
  sourceType: "original",
});

const SHARED_RIGHTS = Object.freeze({
  basis: "original",
  creditLine: "Original prose created for Finn Reading Game.",
  verifiedOn: "2026-07-12",
});

const SHARED_REVIEW = Object.freeze({
  accessibility: "candidate-pending-human-review",
  comprehension: "candidate-pending-human-review",
  editorial: "candidate-pending-independent-review",
  factual: "candidate-pending-human-review",
  grade: "candidate-pending-formal-leveling",
  profile: "candidate-pending-real-microphone-review",
  rights: "candidate-pending-original-work-record-review",
  sensitivity: "candidate-pending-human-review",
  transcription: "candidate-pending-real-microphone-test",
});

function candidate({ id, title, paragraphs, prompt, correct, distractors, skills, unstableTokens = [] }) {
  return Object.freeze({
    availability: "candidate",
    contentRevision: `${id}@2026-07-12.1`,
    id,
    title,
    paragraphs: Object.freeze(paragraphs),
    comprehension: Object.freeze({
      prompt,
      choices: Object.freeze([
        Object.freeze({ correct: true, text: correct }),
        ...distractors.map((text) => Object.freeze({ correct: false, text })),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    skills: Object.freeze(skills),
    source: SHARED_SOURCE,
    rights: SHARED_RIGHTS,
    review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({
      acceptedTranscriptForms: Object.freeze([]),
      tested: false,
      unstableTokens: Object.freeze(unstableTokens),
    }),
  });
}

export const THREADIT_FIRST_RUN_PASSAGES = Object.freeze([
  candidate({
    id: "the-strongest-version-a02",
    title: "The Strongest Version",
    paragraphs: [
      "A weak argument is easy to defeat. That ease can be misleading if the weak version does not represent what another person actually believes. Productive disagreement begins by identifying the strongest reasonable version of the opposing claim.",
      "Suppose one student proposes later school start times. A reply that says “you want everyone to sleep all day” creates a simple target, but it ignores the actual reasoning about sleep, transportation, and schedules. A stronger reply states the proposal accurately, recognizes its best evidence, and then examines costs or missing assumptions.",
      "This practice is sometimes called charitable interpretation. Charity does not require agreement or politeness without substance. It requires enough accuracy that the other person could recognize the position being criticized. The critic can still conclude that the argument fails.",
      "Strengthening an opposing claim also improves one's own thinking. It may reveal evidence that needs an answer, a tradeoff both sides share, or a distinction hidden by slogans. If the argument survives only against a distorted opponent, it was never tested.",
      "Online discussions reward fast replies and memorable ridicule. Careful readers can slow the exchange by asking: What is the central claim? What reasons support it? Which version would a thoughtful opponent defend? Answering those questions turns disagreement from target practice into investigation.",
    ],
    prompt: "What makes a version of an opposing argument strong?",
    correct: "It accurately includes the claim's best reasons and assumptions.",
    distractors: ["It is the easiest version to ridicule quickly.", "It guarantees that the critic must agree."],
    skills: ["central-idea", "claims-and-evidence", "counterargument"],
  }),
  candidate({
    id: "a-vote-is-not-a-measurement-a03",
    title: "A Vote Is Not a Measurement",
    paragraphs: [
      "Votes measure choices under a set of rules. They can decide a club policy, elect a representative, or rank which question a forum displays first. They do not directly measure whether a factual claim is true.",
      "A popular answer may deserve attention because many readers found it useful. Popularity can also reflect timing, humor, familiar language, or the size of an author's audience. An accurate correction posted later may receive fewer votes without becoming less accurate.",
      "The difference becomes clear when the question has an external answer. If a bridge is two hundred meters long, a forum vote cannot make it three hundred. Readers need a survey, plan, or reliable measurement. Votes may decide which source to inspect first, but the source supports the conclusion.",
      "For questions of preference, votes can be exactly the right tool. A group can choose a meeting time or select a design. Even then, the result represents the participating voters, not every person who might be affected.",
      "Good interfaces label what a number means. “Eighty readers recommended this reply” is honest. “Eighty votes prove this reply” confuses attention with evidence. Keeping those categories separate allows communities to use voting for coordination without outsourcing reality to the scoreboard.",
    ],
    prompt: "What can a high vote count establish about a factual reply?",
    correct: "That many participating readers chose or recommended it, not that it is true.",
    distractors: ["That external measurements must change to match it.", "That no later correction can contain stronger evidence."],
    skills: ["claims-and-evidence", "data-literacy", "source-evaluation"],
  }),
  candidate({
    id: "the-objection-that-improved-the-plan-a04",
    title: "The Objection That Improved the Plan",
    paragraphs: [
      "A planning group wanted to open a courtyard for evening events. Their first proposal included lights, chairs, and a small stage. One member objected that the only step-free entrance would be locked after six. The objection did not oppose the courtyard's purpose; it identified a condition the plan had ignored.",
      "The group could have treated the comment as negativity. Instead, they traced the entrance schedule, spoke with facilities staff, and moved the event gate. They also added clear signs and a rain route. The revised plan served more people and handled a problem before opening night.",
      "Strong objections often work this way. They connect a claim to evidence and explain a consequence. “This is bad” gives little direction. “The route depends on an entrance that will be locked” identifies a testable weakness.",
      "Accepting an objection does not mean that the original proposal was foolish. Complex plans are built from limited information. Review allows different experiences and knowledge to expose missing parts. The important question is whether the group can revise without pretending that revision is defeat.",
      "Disagreement becomes useful when it improves the shared object under review. A forum designed only to reward winning replies may hide that benefit. A forum that preserves the original question, evidence, and revisions can show how one challenge made the final plan stronger.",
    ],
    prompt: "Why was the entrance objection useful?",
    correct: "It identified a testable condition that would prevent access.",
    distractors: ["It proved that courtyard events should never occur.", "It received more votes than every other comment."],
    skills: ["claims-and-evidence", "cause-and-effect", "revision"],
  }),
  candidate({
    id: "when-the-crowd-is-partly-right-a05",
    title: "When the Crowd Is Partly Right",
    paragraphs: [
      "A crowd can notice a real pattern and still explain it incorrectly. Imagine hundreds of commuters reporting that a train line has become slower. Their shared observation deserves attention. Yet the most popular explanation—an engine problem—may be wrong if construction at one station caused the delay.",
      "The reports and the explanation are different claims. Many observations can support the conclusion that travel times changed. Identifying the cause requires schedules, maintenance records, or controlled comparisons. Rejecting the incorrect cause should not erase the valid observation.",
      "Experts can make the opposite mistake by dismissing informal reports because they lack technical language. Local observers may detect a change before official data is published. Their accounts can guide investigation even when the accounts cannot complete it.",
      "Careful synthesis separates levels of confidence. The evidence may strongly support “delays increased,” moderately support “the change began last week,” and fail to support “the engines are failing.” One confident sentence should not flatten those differences.",
      "Forums work best when they preserve this structure. Readers can group repeated observations, trace independent origins, and label proposed explanations. Crowds are neither automatically wise nor automatically mistaken. Their value depends on what was observed, how independently it was reported, and whether the conclusion reaches beyond the evidence.",
    ],
    prompt: "What part of the commuters' claim could be well supported even if the engine explanation was wrong?",
    correct: "That travel times on the line had increased.",
    distractors: ["That construction records could not explain any delay.", "That every commuter observed an engine failure directly."],
    skills: ["synthesis", "cause-and-effect", "evidence-strength"],
  }),
  candidate({
    id: "the-source-behind-the-agreement-a06",
    title: "The Source Behind the Agreement",
    paragraphs: [
      "Six accounts post the same recommendation within three minutes. Their avatars, names, and vote totals differ, so the agreement appears broad. A source trace shows that every post was generated from one summary produced by the same automated job.",
      "The accounts are separate display identities, but they are not six independent origins for the claim. Counting them separately would exaggerate the amount of support. Deleting them all would also remove useful evidence about how the message spread.",
      "A transparent forum can group the copies under a shared-origin label. Readers still see each post, timestamp, and vote count, while the interface explains that the wording came from one process. Independent replies remain on their own branches.",
      "Source tracing does not decide whether the recommendation is true. The original summary might contain good evidence or none at all. Tracing answers a different question: How many distinct routes produced the apparent agreement? Once that relationship is visible, readers can inspect the summary's sources instead of treating repetition as confirmation.",
      "Consensus is meaningful only when its structure is understood. Ten people can independently examine evidence and agree. Ten accounts can also repeat one generated sentence. The surface count may match, but the source tree tells two very different stories.",
    ],
    prompt: "Why should the six accounts be grouped without being deleted?",
    correct: "Grouping discloses one origin while preserving evidence of distribution.",
    distractors: ["Grouping proves that the generated recommendation is false.", "Deleting timestamps would make the accounts independent."],
    skills: ["source-evaluation", "claims-and-evidence", "systems-thinking"],
  }),
  candidate({
    id: "when-a-reply-is-a-copy-a07",
    title: "When a Reply Is a Copy",
    paragraphs: [
      "Similar replies are not always copies. Two people may use common phrases or reach the same conclusion from shared facts. A duplicate finding should rely on stronger evidence than resemblance alone.",
      "Exact wording is one clue, especially when a long unusual sentence repeats. Matching timestamps, source links, generation identifiers, or revision history can strengthen the connection. The forum should state which evidence supports the duplicate label so that users can inspect the decision.",
      "The purpose of a duplicate gate is limited. It can prevent one origin from flooding a discussion while preserving legitimate disagreement. It should not block a person merely for agreeing with another reply or using the same public source. Independent comments may cite one document and still contribute different analysis.",
      "Quarantine is often more informative than deletion. Copies can remain visible in a grouped branch with their votes and account labels. Readers learn both what the repeated message said and how many apparent voices came from one process.",
      "A careful duplicate system therefore answers three questions: Which records match? What origin connects them? What action is proportionate? The final question matters because moderation changes the evidence readers can see. Pausing another automated copy may protect the conversation. Erasing every similar opinion would manufacture agreement of a different kind.",
    ],
    prompt: "Why is similar wording alone insufficient to prove two replies are copies?",
    correct: "Independent people can use common language or shared facts without copying.",
    distractors: ["Copies can never contain exact matching sentences.", "A duplicate gate should block everyone who agrees."],
    skills: ["source-evaluation", "evidence-strength", "proportional-response"],
  }),
]);
