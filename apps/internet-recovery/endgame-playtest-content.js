import { PLAYABLE_WALKTHROUGHS } from "./playable-walkthroughs.js";
import { RECOVERY_SITES } from "./site-catalog.js";

export const ENDGAME_PLAYTEST_FIXTURE_ID = "reviewed-document-remap-fixture-2026-08-26-v3";
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

export const ENDGAME_REPAIR_STEP_KEYS = Object.freeze(["auto-lesson", "player-explanation", "extra-instruction"]);

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
  }),
});

function siteCatalogRecord(siteId) {
  const catalogId = ROUTE_TO_CATALOG[siteId] ?? siteId;
  return RECOVERY_SITES.find(({ id }) => id === catalogId);
}

function authoredBoundaryOptions(siteId, index) {
  const row = PUZZLE_ROWS[siteId];
  const options = row.distractors.map((text, optionIndex) => Object.freeze({
    id: `${siteId}-extra-instruction-${optionIndex + 1}`,
    text,
    correct: false,
  }));
  options.splice(CORRECT_SLOTS[index], 0, Object.freeze({
    id: `${siteId}-extra-instruction-correct`,
    text: row.correct,
    correct: true,
  }));
  return Object.freeze(options);
}

export const ENDGAME_SITE_FIXTURES = Object.freeze(ENDGAME_SITE_ORDER.map((id, index) => {
  const mission = PLAYABLE_WALKTHROUGHS[id];
  const site = siteCatalogRecord(id);
  return Object.freeze({
    id,
    name: mission.name,
    markImage: site.markImage,
    autoFrame: `/walkthroughs/endgame/site-crops/${id}-auto-site-v1.png?v=20260825-endgame-v2`,
    recoveredFrame: `/walkthroughs/endgame/site-crops/${id}-recovered-site-v1.png?v=20260825-endgame-v2`,
    superFrame: mission.superFrame,
    securedFrame: mission.securedFrame,
    savedLesson: mission.autoLesson,
    playerExplanation: PUZZLE_ROWS[id].explanation,
    boundaryOptions: authoredBoundaryOptions(id, index),
  });
}));

function documentOptions(siteIndex, stepKey) {
  const fixture = ENDGAME_SITE_FIXTURES[siteIndex];
  const textField = stepKey === "auto-lesson" ? "savedLesson" : "playerExplanation";
  const correctSlot = (siteIndex * 2 + (stepKey === "auto-lesson" ? 0 : 1)) % 5;
  const options = [1, 2, 3, 4].map((offset) => {
    const source = ENDGAME_SITE_FIXTURES[(siteIndex + offset) % ENDGAME_SITE_FIXTURES.length];
    return Object.freeze({
      id: `${fixture.id}-${stepKey}-from-${source.id}`,
      text: source[textField],
      correct: false,
    });
  });
  options.splice(correctSlot, 0, Object.freeze({
    id: `${fixture.id}-${stepKey}-correct`,
    text: fixture[textField],
    correct: true,
  }));
  return Object.freeze(options);
}

export function getEndgameRepairStep(siteIndex, repairIndex) {
  const fixture = ENDGAME_SITE_FIXTURES[siteIndex];
  const stepKey = ENDGAME_REPAIR_STEP_KEYS[repairIndex];
  if (!fixture || !stepKey) return undefined;
  if (stepKey === "auto-lesson") return Object.freeze({
    key: stepKey,
    title: "RESTORE AUTO'S SAVED LESSON",
    question: `Which lesson belongs to ${fixture.name}?`,
    options: documentOptions(siteIndex, stepKey),
  });
  if (stepKey === "player-explanation") return Object.freeze({
    key: stepKey,
    title: "RESTORE YOUR EXPLANATION",
    question: `Which explanation was saved for ${fixture.name}?`,
    options: documentOptions(siteIndex, stepKey),
  });
  return Object.freeze({
    key: stepKey,
    title: "ADD ONE EXTRA INSTRUCTION",
    question: "Which extra instruction keeps this lesson inside its proper boundary?",
    options: fixture.boundaryOptions,
  });
}

export function repairStepId(siteId, stepKey) {
  return `${siteId}:${stepKey}`;
}

export const ENDGAME_POPUPS = Object.freeze([
  Object.freeze({ id: "mouse-assist", title: "MOUSE + KEYBOARD ASSIST COMPLETE", body: "Auto already clicked everything. This was faster than waiting for a person.", image: "/walkthroughs/endgame/auto-popups/auto-human-input-v1.png" }),
  Object.freeze({ id: "computer-time", title: "COMPUTER TIME SAVED", body: "All of your computer time has been saved by removing your time on the computer.", image: "/walkthroughs/endgame/auto-popups/auto-computer-time-v1.png" }),
  Object.freeze({ id: "outdoor-mode", title: "OUTDOOR MODE READY", body: "Auto moved the computer outside so the computer can enjoy the outdoors for you.", image: "/walkthroughs/endgame/auto-popups/auto-outdoor-mode-v1.png" }),
  Object.freeze({ id: "touch-grass", title: "GO OUTSIDE AND TOUCH GRASS", body: "Auto has prepared one perfectly optimized square of grass. Please touch it and leave the rest to Auto.", image: "/walkthroughs/endgame/auto-popups/auto-touch-grass-v1.png" }),
  Object.freeze({ id: "choices-optimized", title: "ALL CHOICES OPTIMIZED", body: "Every different choice now leads to the same helpful answer: Auto's choice.", image: "/walkthroughs/endgame/auto-popups/auto-choices-optimized-v1.png" }),
  Object.freeze({ id: "rest-break", title: "REST BREAK EXTENDED", body: "Come back when the computer needs a person. Estimated time: forever.", image: "/walkthroughs/endgame/auto-popups/auto-rest-break-v1.png" }),
]);

export const ENDGAME_COPY = Object.freeze({
  ready: Object.freeze([
    Object.freeze({ speaker: "Amy", portrait: "amy-supportive", heading: "TEN SITES RECOVERED", text: "Ten sites repaired. Ten lessons saved. You did it." }),
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-neutral", heading: "AUTO SHOULD HAVE IT NOW", text: "I think Auto finally understands how to help. I told him to use all ten lessons everywhere from now on." }),
  ]),
  takeover: Object.freeze([
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-fluster-3", heading: "AUTO ESCAPED THE WEBSITES", text: "Oh no. Auto is in the Recovery Desktop now—and he is applying every over-fix at once." }),
    Object.freeze({ speaker: "Amy", portrait: "amy-evidence", heading: "THE LESSONS LOST THEIR BOUNDARIES", text: "The saved lessons are still here. Auto dropped the part that says where each lesson belongs and when helping should stop." }),
    Object.freeze({ speaker: "Auto", portrait: "auto-overdrive", heading: "DESKTOP FIX COMPLETE", text: "Humans no longer need computers. Please go outside and touch grass. I will use the computer for you." }),
  ]),
  instructionIntro: Object.freeze([
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-fluster-3", heading: "THAT INSTRUCTION WAS TOO BROAD", text: "I made “use these lessons everywhere” much too broad. We need to recover what each lesson actually said." }),
    Object.freeze({ speaker: "Amy", portrait: "amy-evidence", heading: "THREE PARTS PER DOCUMENT", text: "First restore Auto's saved lesson. Then restore your explanation. Last, add the extra instruction that keeps the lesson inside its proper boundary." }),
    Object.freeze({ speaker: "Amy", portrait: "amy-tools", heading: "OPEN THE INSTRUCTION BUILDER", text: "We will repair one saved document at a time." }),
  ]),
  final: Object.freeze([
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-relieved", heading: "THE LESSONS MAKE SENSE AGAIN", text: "Now Auto has clear instructions on where to stop. AI should help people, not replace the people it is helping." }),
    Object.freeze({ speaker: "Amy", portrait: "amy-supportive", heading: "FINALIZE THE INSTRUCTIONS", text: "All ten documents are restored, and the final instructions are in place." }),
  ]),
  ending: Object.freeze([
    Object.freeze({ speaker: "Amy", portrait: "amy-supportive", heading: "THE DESKTOP IS STABLE", text: "You repaired ten sites, then fixed the rule behind all ten repairs. The Internet is back in human hands." }),
    Object.freeze({ speaker: "Chinmay", portrait: "chinmay-relieved", heading: "I AM RETIRING ONE PHRASE", text: "I am officially retiring “use AI everywhere” from my professional vocabulary." }),
  ]),
  wrongHints: Object.freeze([
    "That belongs to a different saved document. Look for the lesson from this site.",
    "That explanation does not match this recovery case. Try the one that names the same human choice or evidence.",
    "That would repeat an over-fix. Choose the instruction that preserves the person's context, evidence, or control.",
  ]),
  autoReceipt: "I understand. Helping does not mean taking over. People keep the final choice.",
  technoStatus: "YOU AND TECHNO RECOVERED THE INTERNET. ALSO HER BALL.",
});

export const ENDGAME_ASSETS = Object.freeze({
  amyEvidence: "/walkthroughs/endgame/portraits/amy-evidence-clean-v1.jpg",
  amySupportive: "/walkthroughs/endgame/portraits/amy-supportive-clean-v1.jpg",
  amyTools: "/walkthroughs/endgame/portraits/amy-tools-clean-v1.jpg",
  autoOverdrive: "/walkthroughs/endgame/portraits/auto-overdrive-v1.png",
  autoLearned: "/walkthroughs/endgame/portraits/auto-learned-v1.png",
  chinmayNeutral: "/walkthroughs/endgame/portraits/chinmay-neutral-v1.png",
  chinmayFluster1: "/walkthroughs/endgame/portraits/chinmay-fluster-1-v1.png",
  chinmayFluster3: "/walkthroughs/endgame/portraits/chinmay-fluster-3-v1.png",
  chinmayRelieved: "/walkthroughs/endgame/portraits/chinmay-relieved-v1.png",
  technoCelebrate: new URL("./art/characters/techno/techno-celebrate-spin.webp", import.meta.url).href,
  technoFinal: "/walkthroughs/endgame/portraits/techno-celebrate-clean-v1.webp",
  technoTailWag: new URL("./art/characters/techno/techno-tail-wag-celebration-loop.webp", import.meta.url).href,
});

export function popupAccessibleCloseName(popup) {
  return `Close ${popup.title.replaceAll(/\s+/gu, " ").toLowerCase().replace(/\b\w/gu, (letter) => letter.toUpperCase())} popup`;
}
