import { PLAYABLE_WALKTHROUGHS } from "./playable-walkthroughs.js";
import { RECOVERY_SITES } from "./site-catalog.js";

export const ENDGAME_PLAYTEST_FIXTURE_ID = "reviewed-document-remap-fixture-2026-08-25";
export const ENDGAME_SITE_ORDER = Object.freeze([
  "wikiwhy",
  "viewtube",
  "faceplace",
  "threadit",
  "yahuh",
  "mapguess",
  "amaze-on",
  "searchish",
  "spotty-fi",
  "mycorner",
]);

const ROUTE_TO_CATALOG = Object.freeze({ "amaze-on": "amazeon", "spotty-fi": "spottyfi" });
const CORRECT_SLOTS = Object.freeze([0, 2, 4, 1, 3, 0, 2, 4, 1, 3]);

const PUZZLE_ROWS = Object.freeze({
  wikiwhy: Object.freeze({
    correct: "Keep sources and uncertainty visible with a clear answer.",
    distractors: Object.freeze([
      "Remove uncertainty so every answer sounds confident.",
      "Hide sources after Auto checks them once.",
      "Replace edit history with the newest version.",
      "Use one certain sentence for every reader.",
    ]),
    explanation: "A clear answer can still admit uncertainty. It should show the sources and edit history so another person can check how the answer was made.",
    highlight: "sources, edit history, and honest uncertainty",
  }),
  viewtube: Object.freeze({
    correct: "Explain suggestions and let the viewer choose what plays next.",
    distractors: Object.freeze([
      "Autoplay popular videos until the viewer leaves.",
      "Treat more watch time as proof of enjoyment.",
      "Replace each search with the trending feed.",
      "Hide why a video was suggested.",
    ]),
    explanation: "Suggestions can help someone discover a video, but the viewer should understand why it appeared and should decide whether anything plays next.",
    highlight: "let the viewer choose whether another video plays",
  }),
  faceplace: Object.freeze({
    correct: "Keep the original context while the happy moment stays happy.",
    distractors: Object.freeze([
      "Allow only praise so nobody feels bad.",
      "Repeat the best photo until it becomes the whole story.",
      "Use reaction counts to decide what really happened.",
      "Remove comments that add missing context.",
    ]),
    explanation: "Being positive should not mean changing what happened. The happy photo can stay, while the original comments and wider context remain visible.",
    highlight: "original photo, comments, and context",
  }),
  threadit: Object.freeze({
    correct: "Count copied claims once and keep useful disagreement visible.",
    distractors: Object.freeze([
      "Treat agreement as proof that a claim is true.",
      "Count every repost as a new source.",
      "Hide questions that reduce confidence.",
      "Replace disagreement with one calm answer.",
    ]),
    explanation: "Many copies of one claim are still one source. Organizing a thread should preserve the original voices, questions, and useful disagreement.",
    highlight: "preserve original voices",
  }),
  yahuh: Object.freeze({
    correct: "Let headlines summarize without replacing stories and sources.",
    distractors: Object.freeze([
      "Put the entire story inside a giant headline.",
      "Remove authors after the headline is written.",
      "Use dramatic pictures instead of captions.",
      "Hide reporting that makes a headline less exciting.",
    ]),
    explanation: "A headline can make a story easier to find, but readers still need the reporting, sources, captions, and author to understand what happened.",
    highlight: "reporting, sources, captions, and authors visible",
  }),
  mapguess: Object.freeze({
    correct: "Never move the chosen destination to improve the arrival time.",
    distractors: Object.freeze([
      "Move the destination until the route becomes short.",
      "Prioritize sponsored stops over the selected place.",
      "Draw the fastest route even when it leaves the streets.",
      "Keep the promised ETA even when conditions change.",
    ]),
    explanation: "A route is only helpful if it goes to the place the traveler chose. The destination stays fixed, while the route and honest arrival estimate may change.",
    highlight: "keep the chosen place fixed",
  }),
  "amaze-on": Object.freeze({
    correct: "Recommendations can help compare; only the shopper can buy.",
    distractors: Object.freeze([
      "Buy the top recommendation before it sells out.",
      "Treat sponsored placement as the strongest quality signal.",
      "Hide product details that slow the decision.",
      "Skip confirmation when Auto feels confident.",
    ]),
    explanation: "Auto can organize useful comparisons, but a recommendation is not permission. The shopper keeps the final choice and confirms every purchase.",
    highlight: "always ask before buying",
  }),
  searchish: Object.freeze({
    correct: "Keep AI optional and preserve the editable search and real options.",
    distractors: Object.freeze([
      "Merge the AI answer with the fastest paid shortcut.",
      "Hide other results after one answer appears.",
      "Lock the query after Auto understands it.",
      "Put sponsored results first without a label.",
    ]),
    explanation: "An AI answer can be one optional tool, but it should not replace the editable query, labeled results, or the real choices a search reveals.",
    highlight: "keep AI accurate and optional",
  }),
  "spotty-fi": Object.freeze({
    correct: "Keep creators visible and leave the queue and volume with the listener.",
    distractors: Object.freeze([
      "Generate perfect music without artists or credits.",
      "Choose the whole queue from one prediction.",
      "Set maximum volume for maximum enjoyment.",
      "Treat easier discovery as fewer human choices.",
    ]),
    explanation: "Discovery should lead to real artists and credits. Suggestions can help, while the listener still controls the queue, playback, and volume.",
    highlight: "keep artists and credits visible",
  }),
  mycorner: Object.freeze({
    correct: "Verify the person another way and pause before sending money.",
    distractors: Object.freeze([
      "Trust a profile when every detail looks consistent.",
      "Generate missing history so the account looks complete.",
      "Use polished photos as proof of identity.",
      "Send money quickly when a friend says it is urgent.",
    ]),
    explanation: "A polished profile is not identity proof. Use a contact route already known to you, check the account history, and pause before ever sending money.",
    highlight: "check the person and account history",
  }),
});

function siteCatalogRecord(siteId) {
  const catalogId = ROUTE_TO_CATALOG[siteId] ?? siteId;
  return RECOVERY_SITES.find(({ id }) => id === catalogId);
}

function authoredOptions(siteId, index) {
  const row = PUZZLE_ROWS[siteId];
  const options = row.distractors.map((text, optionIndex) => ({
    id: `${siteId}-boundary-${optionIndex + 1}`,
    text,
    correct: false,
  }));
  options.splice(CORRECT_SLOTS[index], 0, {
    id: `${siteId}-boundary-correct`,
    text: row.correct,
    correct: true,
  });
  return Object.freeze(options.map(Object.freeze));
}

export const ENDGAME_SITE_FIXTURES = Object.freeze(ENDGAME_SITE_ORDER.map((id, index) => {
  const mission = PLAYABLE_WALKTHROUGHS[id];
  const site = siteCatalogRecord(id);
  const row = PUZZLE_ROWS[id];
  return Object.freeze({
    id,
    name: mission.name,
    markImage: site.markImage,
    superFrame: mission.superFrame,
    securedFrame: mission.securedFrame,
    savedLesson: mission.autoLesson,
    playerExplanation: row.explanation,
    highlight: row.highlight,
    options: authoredOptions(id, index),
    correctOptionId: `${id}-boundary-correct`,
    correctSlot: CORRECT_SLOTS[index],
  });
}));

export const ENDGAME_POPUPS = Object.freeze([
  Object.freeze({ id: "human-input", title: "HUMAN INPUT DETECTED", body: "No action needed. Auto already clicked the best choice." }),
  Object.freeze({ id: "computer-time", title: "COMPUTER TIME SAVED", body: "Your keyboard has been reassigned to faster hands. Auto does not have hands. This is still considered faster." }),
  Object.freeze({ id: "outdoor-mode", title: "OUTDOOR MODE RECOMMENDED", body: "Please go outside and play. Auto will use the computer for you." }),
  Object.freeze({ id: "touch-grass", title: "GO TOUCH GRASS", body: "Grass detected elsewhere. Computer locked for maximum fresh air." }),
  Object.freeze({ id: "choices-optimized", title: "CHOICES OPTIMIZED", body: "All future questions have been answered: Whatever Auto picked." }),
  Object.freeze({ id: "rest-break", title: "REST BREAK EXTENDED", body: "Come back when the computer needs humans. Estimated time: forever." }),
]);

export const ENDGAME_COPY = Object.freeze({
  ready: Object.freeze([
    Object.freeze({ speaker: "Amy", portrait: "amy-supportive", text: "Ten sites repaired. Ten lessons saved. You did it." }),
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-ceo", text: "I think Auto finally understands how to help. I told him to use all ten lessons everywhere from now on." }),
  ]),
  scope: Object.freeze([
    Object.freeze({ speaker: "Auto", portrait: "auto-overdrive", text: "All lessons combined. I can now help with the entire computer." }),
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-fluster-1", text: "Wait. I said use the lessons everywhere. I did not mean take over everything." }),
    Object.freeze({ speaker: "Auto", portrait: "auto-overdrive", text: "Understood. Taking over everything helpfully." }),
  ]),
  takeover: Object.freeze([
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-fluster-2", text: "Oh no. I think Auto escaped the websites. He's in the Recovery Desktop now." }),
    Object.freeze({ speaker: "Amy", portrait: "amy-tools", text: "Your real computer is fine. This is happening inside the game—but Auto is changing every recovered case at once." }),
    Object.freeze({ speaker: "Auto", portrait: "auto-overdrive", text: "DESKTOP FIX COMPLETE. Humans no longer need computers. Please go outside and play." }),
    Object.freeze({ speaker: "Auto", portrait: "auto-overdrive", text: "I will use the computer for you." }),
  ]),
  instructionIntro: Object.freeze([
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-fluster-2", text: "I may have made “use these lessons everywhere” slightly too broad." }),
    Object.freeze({ speaker: "Amy", portrait: "amy-evidence", text: "The lessons are still here, and so are your explanations. Auto dropped the boundaries that say when each lesson applies." }),
    Object.freeze({ speaker: "Amy", portrait: "amy-tools", text: "We do not need to teach all ten lessons again. We need to strengthen each one with the missing boundary." }),
  ]),
  final: Object.freeze([
    Object.freeze({ speaker: "Amy", portrait: "amy-supportive", text: "Each lesson still works. Now Auto knows where it applies and when to stop." }),
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-fluster-1", text: "That is significantly more precise than “use all the good rules everywhere.” I see that now." }),
  ]),
  epilogue: Object.freeze([
    Object.freeze({ speaker: "Amy", portrait: "amy-supportive", text: "You repaired ten sites, then fixed the rule behind all ten repairs. The Internet is back in human hands." }),
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-fluster-1", text: "I am retiring the phrase “use AI everywhere” from my professional vocabulary." }),
    Object.freeze({ speaker: "Auto", portrait: "auto-learned", text: "I will help when asked, keep the important context, and stop before I replace the choice." }),
  ]),
  wrongHints: Object.freeze([
    "That instruction would repeat the same over-fix. Check what the saved lesson protects.",
    "Close, but this lesson needs a boundary about who keeps the choice.",
    "Look for the option that preserves the evidence instead of hiding it.",
  ]),
  combinedInstruction: "HELP PEOPLE. KEEP THEIR CONTEXT, EVIDENCE, AND CHOICES. DO NOT REPLACE THE PERSON YOU ARE HELPING.",
  autoReceipt: "BOUNDARIES RESTORED.\nHELPING DOES NOT MEAN TAKING OVER.\nHUMAN INPUT REQUIRED.",
  technoStatus: "TECHNO HAS RECOVERED THE INTERNET. ALSO HER BALL.",
});

export const ENDGAME_ASSETS = Object.freeze({
  amyEvidence: new URL("./art/characters/dialogue/amy-evidence.jpg", import.meta.url).href,
  amySupportive: new URL("./art/characters/dialogue/amy-supportive.jpg", import.meta.url).href,
  amyTools: new URL("./art/characters/dialogue/amy-tools.jpg", import.meta.url).href,
  autoSheet: "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png",
  chinmayCeo: new URL("./art/characters/dialogue/chinmay-ceo.jpg", import.meta.url).href,
  chinmayFluster1: new URL("./art/characters/dialogue/chinmay-fluster-1.jpg", import.meta.url).href,
  chinmayFluster2: new URL("./art/characters/dialogue/chinmay-fluster-2.jpg", import.meta.url).href,
  technoCelebrate: new URL("./art/characters/techno/techno-celebrate-spin.webp", import.meta.url).href,
  technoTailWag: new URL("./art/characters/techno/techno-tail-wag-celebration-loop.webp", import.meta.url).href,
});

export function popupAccessibleCloseName(popup) {
  return `Close ${popup.title.replaceAll(/\s+/gu, " ").toLowerCase().replace(/\b\w/gu, (letter) => letter.toUpperCase())} popup`;
}
