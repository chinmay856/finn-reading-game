export const READING_ENGINE_PLAYTEST = Object.freeze({
  id: "reading-engine-playtest-50",
  title: "The Map Backup",
  lines: Object.freeze([
    "A city library found an unusual way to protect its oldest maps.",
    "Volunteers photographed each page, recorded every torn edge,",
    "and stored copies in several places.",
    "When a leaking pipe damaged one cabinet,",
    "the originals needed repair, but readers could still study",
    "the digital maps and help identify missing details.",
  ]),
  comprehension: Object.freeze({
    id: "map-backup-purpose",
    question: "What let readers keep studying the maps after the originals were damaged?",
    choices: Object.freeze([
      Object.freeze({ id: "digital-copies", text: "Digital copies stored in several places", correct: true }),
      Object.freeze({ id: "new-cabinet", text: "A new cabinet built before the leak", correct: false }),
      Object.freeze({ id: "memorized-maps", text: "Volunteers memorized every map", correct: false }),
    ]),
    correctFeedback: "That’s it — the digital copies kept the maps available.",
    tryAgainFeedback: "That’s incorrect. Try again.",
  }),
  challengingWords: Object.freeze([
    Object.freeze({
      word: "unusual",
      meaning: "not ordinary or expected",
      example: "It was unusual for the library to protect old maps with digital copies.",
      audioSrc: "/audio/reading-engine-playtest/kokoro-heart/unusual.m4a",
    }),
    Object.freeze({
      word: "photographed",
      meaning: "made pictures using a camera",
      example: "The volunteers photographed every page before the pipe leaked.",
      audioSrc: "/audio/reading-engine-playtest/kokoro-heart/photographed.m4a",
    }),
    Object.freeze({
      word: "identify",
      meaning: "recognize or name something",
      example: "Readers used the digital maps to identify details that were missing.",
      audioSrc: "/audio/reading-engine-playtest/kokoro-heart/identify.m4a",
    }),
  ]),
});

export const READING_ENGINE_PLAYTEST_TEXT = READING_ENGINE_PLAYTEST.lines.join(" ");
