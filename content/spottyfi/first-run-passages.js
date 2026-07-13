// Generated from content/spottyfi/FIRST_RUN_MANUSCRIPTS_A01_A08.md by scripts/generate-original-site-candidates.mjs.
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

const SHARED_SOURCE = Object.freeze({ basis: "original-project-prose", domain: "music-and-algorithm-literacy", sourceType: "original" });
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
    "correct": "The original result depended on listening and responding, not a fixed sequence.",
    "distractors": [
      "Improvisation uses no rhythm or shared structure.",
      "The musicians refused to perform in courtyards again."
    ],
    "id": "the-city-that-learned-to-improvise-a01",
    "paragraphs": [
      "The first neighborhood concerts followed strict programs. Each performer knew the order, the length of every piece, and the exact moment to begin. The system worked until a summer storm flooded the usual stage and scattered the audience among three dry courtyards.",
      "Musicians adapted. A drummer listened for echoes between brick walls. A horn player shortened a phrase so a distant guitar could answer. Performers who had never rehearsed together established patterns through attention. They repeated an idea, changed it, and left room for another person to respond.",
      "Improvisation did not mean the absence of structure. The musicians still used tempo, key, rhythm, and shared signals. Their structure became flexible enough to respond to the place and the people present. A performer could propose a direction without deciding every note for the group.",
      "The following year, organizers tried to automate the success by scheduling the same surprises. The result sounded planned because it was. What mattered in the storm was not a particular sequence but the act of listening and revising.",
      "The city learned that a useful system can support choices without predicting them all. A playlist, map, or stage plan may offer a starting point. Discovery begins when people can change the order, notice something unexpected, and make a new pattern together."
    ],
    "prompt": "Why could organizers not reproduce the improvisation by scheduling the same surprises?",
    "title": "The City That Learned to Improvise"
  }),
  candidate({
    "correct": "The listener has formed an expectation about when the beat will occur.",
    "distractors": [
      "Every rhythm must change its tempo after repetition.",
      "Genre labels prevent listeners from remembering patterns."
    ],
    "id": "how-a-rhythm-changes-a02",
    "paragraphs": [
      "A rhythm can change without becoming unrecognizable. Moving one accent, adding a pause, or repeating a short pattern can alter how listeners anticipate the next sound. The underlying pulse may remain steady while the surface feels unsettled, playful, or calm.",
      "Listeners participate in this process. After hearing a pattern several times, the brain forms expectations. A delayed beat becomes noticeable because the expected moment passes. When the pattern returns, the listener experiences both recognition and contrast. Musical attention therefore involves memory as well as immediate sound.",
      "Context affects the result. A rhythm used for dancing serves a different purpose from the same rhythm under a quiet scene. Tempo, instrumentation, and surrounding patterns change which features stand out. Describing a track only by genre can hide these specific choices.",
      "Recommendation systems often translate listening into categories: energetic, relaxed, similar tempo, or related genre. Those labels can help discovery, but they cannot fully explain why one listener returns to a particular recording. The attraction may be a single pause, an unusual entrance, or a memory connected to when the track was heard.",
      "Taste develops through encounters with details that broad labels cannot predict. A useful recommendation offers another possibility. It does not claim that shared rhythmic features have already determined what the listener will choose."
    ],
    "prompt": "Why is a delayed beat noticeable after a pattern repeats?",
    "title": "How a Rhythm Changes"
  }),
  candidate({
    "correct": "They let listeners follow contributors and roles beyond the most visible performer.",
    "distractors": [
      "They prove that every contributor performed the same role.",
      "They replace the need to identify the recording date."
    ],
    "id": "the-credit-line-a03",
    "paragraphs": [
      "A track title and performer name rarely tell the whole story of a recording. Writers, arrangers, instrumentalists, producers, engineers, and editors may all contribute. Credits preserve those roles and allow listeners to trace the work across projects.",
      "The distinction between roles matters. A performer interprets material; a writer creates words or musical structure; a recording engineer captures and shapes sound through technical choices. One person can hold several roles, but an interface should not merge them into a vague creator label when the record provides more detail.",
      "Credits are also evidence. If two tracks share an arranger or recording room, that connection may explain a similarity more precisely than an algorithmic mood label. Dates can show whether a later track influenced an earlier one or merely resembles it. Stable names help distinguish people who use similar stage identities.",
      "Missing credits make discovery narrower. A listener may enjoy a particular texture but receive recommendations based only on the most visible performer. Following the engineer, writer, or ensemble can open a different path through the library.",
      "Giving credit is not decorative paperwork. It recognizes labor, supports accountability, and preserves the history of how a recording came together. A recommendation may introduce the track, but the credit line explains who actually made it."
    ],
    "prompt": "How can detailed credits improve discovery?",
    "title": "The Credit Line"
  }),
  candidate({
    "correct": "The track may have autoplayed, looped, served another purpose, or gone unheard.",
    "distractors": [
      "Listening histories never contain timestamps.",
      "A person cannot replay music they enjoy."
    ],
    "id": "what-listening-history-means-a04",
    "paragraphs": [
      "A listening history records actions, not a complete identity. It can show that a track played at a particular time, perhaps after the listener selected it or allowed a queue to continue. It cannot by itself explain whether the listener loved the track, ignored it, studied it, or left the room.",
      "Repetition is equally ambiguous. Someone may replay a difficult passage to understand it, use a quiet recording as background, or accidentally leave one track looping. A count becomes more meaningful when the interface preserves context such as manual selection, autoplay, skip, or saved status.",
      "Histories also need honest boundaries. The record should begin when the account or local profile begins collecting events. Entries dated before account creation cannot describe that listener's actions. They may be imported data, system predictions, or errors, and should be labeled accordingly.",
      "Recommendation systems can use history to offer possibilities. Problems arise when the system converts behavior into certainty: “You played this, therefore this is your taste.” Taste can change, and people often explore material they do not ultimately prefer.",
      "A useful history remains inspectable and correctable. It shows what was observed, how the event began, and where prediction entered. The listener can use that record without allowing yesterday's queue to become a permanent definition of tomorrow's choices."
    ],
    "prompt": "Why does a play event not prove that a listener liked the track?",
    "title": "What Listening History Means"
  }),
  candidate({
    "correct": "Sequence changes the relationships, contrasts, and overall shape.",
    "distractors": [
      "Track order changes the credited performers.",
      "A manual mixtape cannot contain suggested tracks."
    ],
    "id": "the-manual-mixtape-a05",
    "paragraphs": [
      "Building a mixtape is an act of selection and sequence. The maker chooses not only which tracks belong, but how one ending meets the next beginning. A quiet piece can create space after a crowded arrangement. A surprising change of style can wake the listener's attention.",
      "Order gives the collection a shape that individual recommendations do not provide. Two mixtapes containing the same tracks can feel different because one builds gradually while the other begins with contrast. The sequence may tell a story, support a task, or preserve the memory of a particular day.",
      "Automated suggestions can help the maker discover options. They become less helpful when they silently insert tracks, reorder the list, or treat a suggested item as already chosen. The boundary should be clear: suggestions remain outside the tape until the listener adds them.",
      "Manual does not require difficult controls. A system can provide keyboard movement, clear positions, undo, and saved versions. What matters is that the final order belongs to the listener and survives reopening.",
      "A mixtape demonstrates a broader principle of curation. Choosing items is only part of authorship; arranging relationships among them is another part. A useful algorithm supports both actions without replacing the person whose attention gives the sequence its purpose."
    ],
    "prompt": "Why can two mixtapes with the same tracks feel different?",
    "title": "The Manual Mixtape"
  }),
  candidate({
    "correct": "Reflections and decay continue differently in each acoustic space.",
    "distractors": [
      "A pause always changes the written tempo.",
      "Silence prevents listeners from measuring time."
    ],
    "id": "silence-between-notes-a06",
    "paragraphs": [
      "Silence in music is not empty time. A pause can separate ideas, create tension, reveal an echo, or allow a previous sound to fade. The listener continues to measure time during the pause, anticipating what may follow.",
      "Different spaces change that experience. In a dry room, a note may stop almost immediately. In a large hall, reflections continue after the performer rests. The written pause can be the same length while the heard boundary feels different. Recording and playback choices add another layer by preserving or reducing the room's sound.",
      "Visual interfaces often represent audio with constant movement: pulsing bars, scrolling waveforms, or animated covers. These images can suggest that nothing is happening when the bars stop. Yet the musical structure may depend on that stillness. Accessibility also requires that animation never become the only way to identify a state.",
      "Listening closely to silence changes how a person hears the surrounding notes. The entrance after a pause may feel heavier because expectation accumulated. A quiet ending may invite attention rather than announce completion.",
      "Recommendation labels such as calm or energetic rarely capture these relationships. Silence is not a genre tag or a lack of content. It is a timed decision within the work, interpreted through performance, space, recording, and the listener's own anticipation."
    ],
    "prompt": "Why can the same written pause feel different in two rooms?",
    "title": "Silence Between Notes"
  }),
  candidate({
    "correct": "It distinguishes manual choice from autoplay, sharing, or suggestion.",
    "distractors": [
      "It proves the listener enjoyed every track that played.",
      "It prevents playlists from containing more than one creator."
    ],
    "id": "who-chose-the-next-track-a07",
    "paragraphs": [
      "When one track ends and another begins, the interface should be able to explain why. The listener may have placed the track in a manual queue. Autoplay may have selected it from a recommendation. A shared playlist owner may have added it. These paths produce the same audible result but represent different choices.",
      "Clear source labels preserve agency. “Added by listener,” “from saved playlist,” and “optional suggestion” tell the user what happened without requiring a technical log. The labels also make errors easier to correct. An unexpected track can be removed without deleting a genuine manual choice.",
      "Ambiguous interfaces often describe every transition as “for you.” That phrase merges observation, prediction, and permission. A system may predict that a listener will enjoy something, but prediction does not authorize permanent changes to the queue or library.",
      "The explanation should persist after playback. History can record the track and the selection source, allowing the listener to distinguish deliberate choices from passive continuation. This context improves future recommendations because the system need not treat every autoplay event as enthusiastic approval.",
      "Asking who chose the next track is not a demand that algorithms disappear. It is a demand that suggestion and decision remain separate. Discovery works best when the listener can recognize the invitation and decide whether to accept it."
    ],
    "prompt": "Why should history record how a track entered the queue?",
    "title": "Who Chose the Next Track?"
  }),
  candidate({
    "correct": "The account was not created until 4:12.",
    "distractors": [
      "A track cannot be shorter than twenty-five minutes.",
      "Recommendation systems cannot store timestamps."
    ],
    "id": "the-prediction-before-the-person-a08",
    "paragraphs": [
      "A new account appears at 4:12 in the afternoon. Its listening history claims that the user played a track at 3:47. The timeline is impossible if the history represents activity on that account. The earlier event must come from another source: imported data, a system test, or a prediction presented as observation.",
      "Predictions can help with the cold-start problem, which occurs when a service has little information about a new user. The system may suggest popular tracks or ask about broad interests. Trouble begins when the service installs those guesses as past behavior and then uses the invented history as proof that its next recommendation is accurate.",
      "This creates a feedback loop. The system predicts a preference, recommends material based on the prediction, and interprets autoplay as confirmation. The original guess becomes harder to see because later records point back to it.",
      "Honest design separates predicted, imported, and observed events. It preserves account-creation time, labels suggestion sources, and allows the user to remove incorrect history. Recommendations can still begin immediately, but they must admit that they are starting hypotheses.",
      "Personalization should learn from a person rather than manufacture the person it expects. An impossible timestamp is valuable evidence because it reveals where the system crossed from proposing a possibility into pretending that the possibility had already happened."
    ],
    "prompt": "What makes the 3:47 history entry impossible as observed account activity?",
    "title": "The Prediction Before the Person"
  }),
]);
