// Generated from content/viewtube/FIRST_RUN_MANUSCRIPTS_A02_A07.md by scripts/generate-original-site-candidates.mjs.
// Edit the canonical manuscript or generator, then run npm run generate:site-content.

const SHARED_PROFILE = Object.freeze({
  accuracyTarget: 85,
  checkpoint: Object.freeze({ audioOverlapMs: 3_000, maximumWindowMs: 16_000, minimumWindowMs: 5_000, pauseMs: 450, tokenOverlap: 12 }),
  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),
  form: "expository-prose",
  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),
  segmentation: "short-paragraphs", targetGrades: Object.freeze([10, 12]),
  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),
});

const SHARED_SOURCE = Object.freeze({ basis: "original-project-prose", domain: "media-literacy", sourceType: "original" });
const SHARED_RIGHTS = Object.freeze({ basis: "original", creditLine: "Original prose created for Finn Reading Game.", verifiedOn: "2026-07-12" });
const SHARED_REVIEW = Object.freeze({
  accessibility: "candidate-pending-human-review", comprehension: "candidate-pending-human-review",
  editorial: "candidate-pending-independent-review", factual: "candidate-pending-human-review",
  grade: "candidate-pending-formal-leveling", profile: "candidate-pending-real-microphone-review",
  rights: "candidate-pending-original-work-record-review", sensitivity: "candidate-pending-human-review",
  transcription: "candidate-pending-real-microphone-test",
});

function candidate({ id, title, paragraphs, prompt, correct, distractors }) {
  return Object.freeze({
    availability: "candidate", id, title, paragraphs: Object.freeze(paragraphs),
    comprehension: Object.freeze({
      prompt, choices: Object.freeze([
        Object.freeze({ correct: true, text: correct }),
        ...distractors.map((text) => Object.freeze({ correct: false, text })),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE, source: SHARED_SOURCE, rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  });
}

export const FIRST_RUN_PASSAGES = Object.freeze([
  candidate({
    "correct": "Adjacent frames or off-screen context may change what the moment means.",
    "distractors": [
      "A camera can never record a real event.",
      "Slow motion automatically proves deliberate deception."
    ],
    "id": "the-frame-before-the-crash-a02",
    "paragraphs": [
      "A single frame can look decisive because it freezes motion at one exact instant. Suppose a photograph shows a cyclist leaning sharply beside a fallen road marker. The image may appear to prove that the cyclist struck the marker. Yet the frame before it might show the marker already lying in the road, and the frame after it might show the cyclist steering around the obstacle.",
      "Video gives viewers more sequence than a still image, but sequence can still be incomplete. A clip may begin after an important action or end before its result. Slow motion can reveal movement while making an ordinary second feel unusually dramatic. A tight crop can hide other people, signs, or objects outside the frame. None of these techniques automatically makes a video deceptive. They do change which evidence the viewer can inspect.",
      "Careful analysis starts with boundaries. When does the recording begin? When does it end? Was the camera fixed or moving? Is the clip continuous, or are there cuts? What claims can the visible sequence support, and what questions remain outside it?",
      "The strongest conclusion may be narrower than the most exciting one. A clip can establish that the cyclist leaned, the marker was down, and the camera recorded both. It may not establish who moved the marker or what happened earlier. Looking for the missing frame is not refusing to believe video. It is treating video as evidence with edges."
    ],
    "prompt": "Why can one dramatic frame support the wrong conclusion?",
    "title": "The Frame Before the Crash"
  }),
  candidate({
    "correct": "The links let readers verify text against the original recorded moment.",
    "distractors": [
      "Timestamp links guarantee that automatic recognition made no errors.",
      "A transcript becomes independent evidence each time it is opened."
    ],
    "id": "the-transcript-and-the-clip-a03",
    "paragraphs": [
      "A transcript turns spoken language into searchable text. It can help a viewer locate a statement, follow unfamiliar speech, or review a long recording. However, a transcript is not the recording itself. It represents one layer of evidence and can omit information carried by timing, tone, image, or sound.",
      "Automatic transcription adds another limitation: recognition errors. A model may replace an unfamiliar name with a common word, miss a quiet phrase, or divide one sentence incorrectly. Even an accurate transcript may not identify who is speaking when several voices overlap. Timestamp links help because they let the reader return to the relevant moment instead of treating the text as a detached quotation.",
      "Visual context can matter too. The words “that valve is closed” mean something different if the camera shows the speaker checking the valve than if the image shows an unrelated title card. Conversely, an impressive image does not prove that the spoken explanation is correct. The tracks should support one another without being collapsed into one claim.",
      "A useful evidence page therefore labels its transcript, connects each segment to the original recording, and preserves source information. Viewers can quote the text while still checking the clip. The transcript improves access and navigation. Its value increases when the interface is honest about what the text captured, what it inferred, and where the original moment can be found."
    ],
    "prompt": "Why should transcript segments link back to timestamps?",
    "title": "The Transcript and the Clip"
  }),
  candidate({
    "correct": "The area about which the recording can provide direct visual evidence.",
    "distractors": [
      "Every cause of any event visible in the recording.",
      "Whether all people nearby agreed to be recorded."
    ],
    "id": "what-the-camera-did-not-see-a04",
    "paragraphs": [
      "Cameras are often treated as neutral witnesses, but every camera has a position. It faces one direction, uses one lens, begins at one time, and stops at another. These limits do not make recordings useless. They explain why a recording can be accurate about what appears in frame while remaining silent about events nearby.",
      "Imagine a fixed camera pointed at a bridge during a storm. The video shows water rising and traffic slowing. It does not show the upstream dam, the road behind the camera, or the workers closing another entrance. A viewer can use the recording to study visible water levels and vehicle movement. The viewer cannot use it alone to explain every cause or response.",
      "Source notes make those boundaries clearer. They can identify the camera's location, direction, clock setting, recording gaps, and weather conditions. Other evidence may then answer different questions: a maintenance log can describe the dam, a map can show upstream distance, and an interview can explain why the entrance closed. Each source contributes something without becoming a complete view.",
      "Responsible interpretation distinguishes absence from proof. If the camera did not record a worker, that may mean no worker entered the frame. It does not prove that no worker was present anywhere. The camera's silence has a boundary defined by its field of view. Understanding that boundary allows viewers to make precise claims and seek the evidence the recording cannot provide."
    ],
    "prompt": "What does a camera's field of view define?",
    "title": "What the Camera Did Not See"
  }),
  candidate({
    "correct": "Whether the edit preserves the speaker's meaning.",
    "distractors": [
      "Whether the finished clip contains no cuts at all.",
      "Whether the viewer agrees with the speaker's conclusion."
    ],
    "id": "a-speech-in-its-moment-a05",
    "paragraphs": [
      "A short video quotation can preserve exact words while changing their apparent purpose. Consider a speaker who says, “This plan would fail if we removed the safety review.” A clip beginning after the first half might contain only “we removed the safety review,” turning a warning into what sounds like a report of action.",
      "Context does not mean that every quotation requires an entire hour of video. It means preserving enough surrounding material to represent the speaker's claim fairly. The relevant context may include the question being answered, the sentence before the quotation, a definition introduced earlier, or a correction that follows. Dates and audience also matter because speakers respond to circumstances their later viewers may not know.",
      "Editing is necessary in most reporting. Editors remove pauses, repetition, and unrelated sections so an audience can follow the central point. Ethical editing asks whether those changes preserve meaning. A cut should not reverse a claim, hide a decisive qualification, or combine separate moments as if they occurred together.",
      "Viewers can evaluate a clip by checking its timestamp, seeking a longer source, and comparing the quotation with a transcript. These steps do not guarantee agreement with the speaker. They establish what the speaker actually argued. Criticism becomes stronger when it addresses the full position rather than a sentence manufactured by the edit. Context is not an excuse that erases clear words; it is the evidence that tells readers what those words were doing."
    ],
    "prompt": "What is the central ethical test for an edited quotation?",
    "title": "A Speech in Its Moment"
  }),
  candidate({
    "correct": "Selection, order, repetition, and endings can guide interpretation differently.",
    "distractors": [
      "Authentic frames always produce one unavoidable story.",
      "Any shortened recording must contain fabricated images."
    ],
    "id": "one-scene-three-cuts-a06",
    "paragraphs": [
      "Three editors can build different stories from the same unaltered footage. Imagine a two-minute recording of a town meeting. One version opens with applause, moves to a confident proposal, and ends before questions begin. A second opens with objections and finishes on an empty chair after the meeting. A third follows the full order but removes long pauses. Every visible frame may come from the original recording, yet the versions guide attention differently.",
      "Order creates relationships. Placing a worried face after a proposal can imply that the person reacted to that proposal, even if the face appeared twenty minutes earlier. Repeating a moment can make it seem important. Removing a transition can make separate exchanges look continuous. Music and captions can add further interpretation, although a silent edit can shape meaning through sequence alone.",
      "This does not make editing dishonest by definition. A complete recording is often too long for a report, lesson, or summary. The important questions are what changed and whether viewers can inspect the basis of the edit. Useful labels identify cuts, link to longer source material, and distinguish captions written by an editor from words spoken at the event.",
      "Comparing versions reveals choices that disappear when one cut stands alone. The viewer can ask which moments each editor selected, what order they used, and which conclusion the ending encourages. The footage supplies the raw record. The cut supplies an argument about what deserves attention."
    ],
    "prompt": "How can three edits differ while using only authentic frames?",
    "title": "One Scene, Three Cuts"
  }),
  candidate({
    "correct": "They can demonstrate reach or persistence while sharing one origin.",
    "distractors": [
      "They prove that ten cameras independently recorded the event.",
      "They prove the original recording contains no editing."
    ],
    "id": "the-duplicate-frame-a07",
    "paragraphs": [
      "Repetition can make evidence feel abundant. A search page may display ten thumbnails, ten play counts, and ten links, creating the impression that ten recordings support the same claim. If every item contains the same frames from one original file, however, the page shows one source distributed ten times. A media hash helps identify this relationship. The hash is a compact value calculated from file data. Identical files normally produce the same value, allowing a system to group exact copies. Modified crops or captions may change a hash, so investigators also compare frames, timestamps, and source history. The goal is not merely to count matching numbers. It is to trace which item originated the material and whether another recording independently captured the event.",
      "Copies can still be useful. They may preserve material after an original link disappears or make a recording available in another context. What they cannot do is become new witnesses simply by replaying. Ten copies may demonstrate reach, popularity, or persistence. They do not show ten independent camera positions.",
      "An honest interface keeps the copies visible while disclosing their shared origin. It can quarantine duplicate playbacks, label the original record, and separate other evidence tracks such as weather logs or observer notes. That structure prevents two opposite mistakes: deleting useful copies as worthless and counting them as independent confirmation. The question is not only how many items appear. It is how many distinct origins they represent."
    ],
    "prompt": "What can ten copies of one recording demonstrate without providing ten witnesses?",
    "title": "The Duplicate Frame"
  }),
]);
