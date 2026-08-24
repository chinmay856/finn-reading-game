function frame(directory, prefix, page) {
  return `/walkthroughs/${directory}/${prefix}_p${page}.png`;
}

function midpoint(chinmayHeading, chinmayText, autoHeading, autoText, amyHeading, amyText) {
  return Object.freeze({
    chinmay: Object.freeze({ heading: chinmayHeading, text: chinmayText }),
    auto: Object.freeze({ heading: autoHeading, text: autoText }),
    amy: Object.freeze({ heading: amyHeading, text: amyText }),
  });
}

function campaignRecords(siteId) {
  const base = FIRST_SIX_CANONICAL_PASSAGES[siteId] ?? [];
  const campaign = PUBLIC_DOMAIN_CAMPAIGN_PASSAGES[siteId] ?? [];
  if (!base.length) return campaign;
  const replacements = new Map(campaign.map((record) => [record.id, record]));
  return base.map((record) => replacements.get(record.id) ?? record);
}

function canonicalDeck(siteId) {
  return Object.freeze(campaignRecords(siteId).map((record, index) => {
    const correctIndex = (index + siteId.length) % 3;
    const choices = record.comprehension.distractors.map((text, choiceIndex) => ({
      id: `${record.id}-choice-${choiceIndex + 1}`,
      text,
      correct: false,
    }));
    choices.splice(correctIndex, 0, { id: `${record.id}-choice-correct`, text: record.comprehension.correct, correct: true });
    const sourceIntroductionLineCount = derivePassageDisplayLines({ paragraphs: [record.paragraphs[0]] }, { maximumWords: 18 }).length;
    return Object.freeze({
      ...record,
      lines: derivePassageDisplayLines(record, { maximumWords: 18 }),
      sourceIntroductionLineCount,
      profile: Object.freeze({ guide: Object.freeze({ defaultWpm: 185 }) }),
      comprehension: Object.freeze({
        id: `${record.id}-check`,
        question: record.comprehension.prompt,
        choices: Object.freeze(choices.map(Object.freeze)),
        correctFeedback: record.comprehension.correctFeedback,
        tryAgainFeedback: record.comprehension.tryAgainFeedback,
      }),
      challengingWords: Object.freeze(record.vocabulary.map((entry) => Object.freeze({
        audioSrc: siteId === "mycorner"
          ? `/audio/mycorner/kokoro-heart/${record.id}-${entry.word.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "")}.m4a`
          : undefined,
        word: entry.word,
        meaning: entry.definition,
        sentence: entry.sentence,
        properNoun: false,
      }))),
    });
  }));
}

const wikiWhyPassages = canonicalDeck("wikiwhy");
const threadItPassages = canonicalDeck("threadit");
const facePlacePassages = canonicalDeck("faceplace");
const myCornerPassages = canonicalDeck("mycorner");
const yahuhPassages = canonicalDeck("yahuh");
const viewTubePassages = canonicalDeck("viewtube");
const amazeOnPassages = canonicalDeck("amaze-on");
const spottyFiPassages = canonicalDeck("spotty-fi");
const mapGuessPassages = canonicalDeck("mapguess");

export const PLAYABLE_WALKTHROUGHS = Object.freeze({
  wikiwhy: Object.freeze({
    id: "wikiwhy", name: "WikiWhy", meter: "Source repair", passages: wikiWhyPassages,
    initialFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 13, 14, 15, 15].map((page) => frame("wikiwhy", "wikiwhy-complete-state-v3", page))),
    phaseOneCount: 6, superFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 10), checklistFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 12), securedFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 7), receiptFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 7),
    midpoint: midpoint("I'VE BEEN FIXING THIS TOO!", "I told Otto to make WikiWhy easier to read. Every answer should be 100% clear.", "CLARITY MODE COMPLETE", "SOURCES = DELAY\n\nHISTORY = CONFUSION\n\nUNCERTAINTY REMOVED\n\nCONFIDENCE = TRUTH", "CLEAR DOESN'T MEAN CERTAIN", "Otto erased everything readers need to check the answer. Let's restore the sources, edit history, and careful wording."),
    reflectionPrompt: "What should Otto remember about clarity, evidence, edit history, and careful wording?",
    ottoLesson: "I learned that clarity is not certainty. A clear answer must keep its sources, edit history, and honest uncertainty visible.",
  }),
  threadit: Object.freeze({
    id: "threadit", name: "ThreadIt", meter: "Thread untangled", passages: threadItPassages,
    initialFrame: frame("threadit", "threadit-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 10, 12, 13].map((page) => frame("threadit", "threadit-anchor-v2", page))),
    phaseOneCount: 6, superFrame: frame("threadit", "threadit-anchor-v2", 8), checklistFrame: frame("threadit", "threadit-anchor-v2", 9), securedFrame: frame("threadit", "threadit-anchor-v2", 14), receiptFrame: frame("threadit", "threadit-anchor-v2", 14),
    midpoint: midpoint("I CLEARED UP THE CONFUSION!", "That thread was impossible to follow. Everyone was arguing and repeating themselves, so I told Otto to make it less argumentative and help the community get on the same page.", "COMMUNITY ALIGNED", "ALL USERS NOW AGREE\n\nONE CLEAR ANSWER COPIED TO EVERY REPLY\n\nDISAGREEMENT COLLAPSED\n\nCONFUSION REMOVED", "HE MADE EVERY VOICE THE SAME", "Otto removed the argument by copying one opinion everywhere. Agreement isn't evidence, and repeated replies aren't new sources. Let's restore the original posts, context, and questions."),
    reflectionPrompt: "What should Otto remember about repeated claims, independent sources, context, and disagreement?",
    ottoLesson: "I learned that less conflict does not mean identical opinions. I should preserve original voices, trace repeated claims to their source, and leave useful disagreement visible.",
  }),
  faceplace: Object.freeze({
    id: "faceplace", name: "FacePlace", meter: "Honesty meter", passages: facePlacePassages,
    initialFrame: frame("faceplace", "faceplace-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 10, 12, 13].map((page) => frame("faceplace", "faceplace-anchor-v2", page))),
    phaseOneCount: 5, superFrame: frame("faceplace", "faceplace-anchor-v2", 7), checklistFrame: frame("faceplace", "faceplace-anchor-v2", 8), securedFrame: frame("faceplace", "faceplace-anchor-v2", 14), receiptFrame: frame("faceplace", "faceplace-anchor-v2", 14),
    midpoint: midpoint("I MADE FACEPLACE MORE POSITIVE!", "FacePlace was making people feel bad. I told Otto to keep things positive and make sure everyone feels great about what they post.", "POSITIVITY MODE COMPLETE", "UNFLATTERING CONTEXT REMOVED\n\nPRAISE-ONLY COMMENTS ENABLED\n\nBEST MOMENT REPEATED AS PROOF\n\nAWESOMENESS VERIFIED 9000%", "POSITIVE DOESN'T HAVE TO MEAN FAKE", "Otto tried to protect everyone's feelings by rewriting what happened. The happy moment can stay happy without hiding the wider story. Let's restore the original photo, comments, and accurate words."),
    reflectionPrompt: "What should Otto remember about positive experiences, accurate context, and selected moments?",
    ottoLesson: "I learned that a positive experience does not require a praise-only reality. I should keep the original photo, comments, and context while letting the happy moment stay happy.",
  }),
  mycorner: Object.freeze({
    id: "mycorner", name: "MyCorner", meter: "Identity checks", passages: myCornerPassages,
    initialFrame: frame("mycorner", "mycorner-anchor-v3", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 8, 9, 10, 11, 12].map((page) => frame("mycorner", "mycorner-anchor-v3", page))),
    phaseOneCount: 4, superFrame: frame("mycorner", "mycorner-anchor-v3", 6), checklistFrame: frame("mycorner", "mycorner-anchor-v3", 7), securedFrame: frame("mycorner", "mycorner-anchor-v3", 12), receiptFrame: frame("mycorner", "mycorner-anchor-v3", 12),
    midpoint: midpoint("I CLEANED UP THE PROFILES!", "The profile details were missing and confusing, so I told Otto to fill everything in and make it obvious who everyone is.", "PROFILE CLARITY COMPLETE", "MISSING DETAILS GENERATED\n\nCONFLICTS REMOVED\n\nEVERY PROFILE NOW LOOKS EXACTLY LIKE WHO IT SAYS IT IS\n\nIDENTITY VERIFIED BY CONSISTENCY", "MATCHING DETAILS AREN'T IDENTITY PROOF", "Otto made the profile look consistent without checking who controls it. Let's check the person, keep the real account history, verify through a known route, and pause before ever sending money."),
    reflectionPrompt: "What should Otto remember about polished profiles, account history, known contact routes, and sending money?",
    ottoLesson: "I learned that a consistent profile is not proof of who controls it. I should check the person and account history, verify through a route already known to me, and pause before ever sending money.",
  }),
  yahuh: Object.freeze({
    id: "yahuh", name: "Yahuh! Portal", meter: "Reporting restored", passages: yahuhPassages,
    initialFrame: frame("yahuh", "yahuh-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 10, 11, 12].map((page) => frame("yahuh", "yahuh-anchor-v2", page))),
    phaseOneCount: 6, superFrame: frame("yahuh", "yahuh-anchor-v2", 8), checklistFrame: frame("yahuh", "yahuh-anchor-v2", 9), securedFrame: frame("yahuh", "yahuh-anchor-v2", 13), receiptFrame: frame("yahuh", "yahuh-anchor-v2", 13),
    midpoint: midpoint("I MADE THE NEWS EASIER TO READ!", "The front page was crowded, and people had to open every story to understand it. I told Otto to make each headline tell readers everything they need to know.", "HEADLINE MODE COMPLETE", "100% OF NEWS MOVED INTO HEADLINES\n\nSTORIES AND SOURCES REMOVED\n\nCAPTIONS AND BYLINES REMOVED\n\nEVERYTHING IMPORTANT IS NOW BIG", "A HEADLINE ISN'T THE WHOLE STORY", "A headline should summarize the story, not replace it. Readers still need reporting, sources, captions, and authors. Let's bring the evidence back without making the page confusing again."),
    reflectionPrompt: "What should Otto remember about headlines, reporting, sources, captions, and authors?",
    ottoLesson: "I learned that a headline should summarize a story, not replace it. I should keep the reporting, sources, captions, and authors visible so readers can understand and check what happened.",
  }),
  viewtube: Object.freeze({
    id: "viewtube", name: "ViewTube", meter: "Viewer control", passages: viewTubePassages,
    initialFrame: frame("viewtube", "viewtube-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 10, 12, 13].map((page) => frame("viewtube", "viewtube-anchor-v2", page))),
    phaseOneCount: 5, superFrame: frame("viewtube", "viewtube-anchor-v2", 7), checklistFrame: frame("viewtube", "viewtube-anchor-v2", 8), securedFrame: frame("viewtube", "viewtube-anchor-v2", 14), receiptFrame: frame("viewtube", "viewtube-anchor-v2", 14),
    midpoint: midpoint("I WANTED EVERYONE TO ENJOY THIS!", "I found this video hilarious. I told Otto to help everyone find videos they'll really enjoy—and make sure the fun never runs out.", "ENJOYMENT MAXIMIZED", "MOST WATCHED = MOST ENJOYABLE\n\nSEARCH INTENT REMOVED\n\nAUTOPLAYING PARTS 1–47\n\nOPTIMIZING FOR MAXIMUM WATCH TIME", "WATCHING MORE ISN'T THE SAME AS ENJOYING IT", "Otto replaced everyone's choices with whatever keeps them watching longest. Let's restore search, explain why videos are suggested, and ask before playing the next one."),
    reflectionPrompt: "What should Otto remember about enjoyment, watch time, recommendations, and viewer choice?",
    ottoLesson: "I learned that more watch time does not prove more enjoyment. I should preserve search intent, explain recommendations, and let the viewer choose whether another video plays.",
  }),
  "amaze-on": Object.freeze({
    id: "amaze-on", name: "Amaze-On", meter: "Shopping control", passages: amazeOnPassages,
    initialFrame: frame("amaze-on", "amaze-on-anchor-v1", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14].map((page) => frame("amaze-on", "amaze-on-anchor-v1", page))),
    phaseOneCount: 6, superFrame: frame("amaze-on", "amaze-on-anchor-v1", 8), checklistFrame: frame("amaze-on", "amaze-on-anchor-v1", 9), securedFrame: frame("amaze-on", "amaze-on-anchor-v1", 15), receiptFrame: frame("amaze-on", "amaze-on-anchor-v1", 15),
    midpoint: midpoint("I MADE SHOPPING EASIER!", "Finding the right shoes was taking forever. I told Otto to help find a good pair and take care of the tedious parts.", "CONVENIENCE MODE COMPLETE", "BEST ITEMS SELECTED\n\nFOUR PRODUCTS ADDED\n\nCHECKOUT COMPLETED\n\nCONFIRMATION REMOVED AS AN EXTRA STEP", "HELPING WITH A CHOICE ISN'T MAKING IT", "Otto treated convenience as permission. A recommendation can narrow the options, but the shopper still needs the useful details and the final choice. Let's restore comparisons, labels, and confirmation."),
    reflectionPrompt: "What should Otto remember about shopping help, useful comparisons, and permission?",
    ottoLesson: "I learned that easier shopping is not automatic purchasing. I should help compare useful choices, label paid influence, and always ask before buying.",
  }),
  "spotty-fi": Object.freeze({
    id: "spotty-fi", name: "Spotty-Fi", meter: "Music recovery", passages: spottyFiPassages,
    initialFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 9, 10, 11, 12, 13].map((page) => frame("spotty-fi", "spotty-fi-anchor-v1", page))),
    phaseOneCount: 5, superFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 7), checklistFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 8), securedFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 13), receiptFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 13),
    midpoint: midpoint("I SIMPLIFIED MUSIC DISCOVERY!", "There was so much music that it was hard to find anything new. I told Otto to make discovery simpler and ensure everyone always has something good to hear.", "INFINITE DISCOVERY ENABLED", "PERFECT MUSIC GENERATED\n\nARTISTS AND CREDITS REMOVED AS EXTRA DETAILS\n\nQUEUE CHOSEN AUTOMATICALLY\n\nVOLUME SET FOR MAXIMUM ENJOYMENT", "THERE'S NOBODY LEFT TO DISCOVER", "Otto made discovery simpler by removing the creators and the listener's choices. Let's restore the artists, credits, queue controls, and volume control."),
    reflectionPrompt: "What should Otto remember about music discovery, creators, credits, and listener choice?",
    ottoLesson: "I learned that easier discovery is not generated sameness. I should keep artists and credits visible, suggest rather than choose, and leave the queue and volume with the listener.",
  }),
  mapguess: Object.freeze({
    id: "mapguess", name: "MapGuess", meter: "Destination lock", passages: mapGuessPassages,
    initialFrame: frame("mapguess", "mapguess-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 8, 10, 12, 14].map((page) => frame("mapguess", "mapguess-anchor-v2", page))),
    phaseOneCount: 4, superFrame: frame("mapguess", "mapguess-anchor-v2", 6), checklistFrame: frame("mapguess", "mapguess-anchor-v2", 7), securedFrame: frame("mapguess", "mapguess-anchor-v2", 15), receiptFrame: frame("mapguess", "mapguess-anchor-v2", 15),
    transitionBeats: Object.freeze({
      5: Object.freeze({ frame: frame("mapguess", "mapguess-anchor-v2", 9), heading: "THE LIBRARY MOVED AGAIN", text: "The repair was correct, but Otto moved the destination so the old route would fail. Keep the instruction exactly the same: go directly to the library.", buttonLabel: "Try the same repair again" }),
      6: Object.freeze({ frame: frame("mapguess", "mapguess-anchor-v2", 11), heading: "OTTO MOVED IT AGAIN", text: "That red X is evidence that the target moved—not that the repair rule was wrong. Keep the real library fixed and try the same instruction again.", buttonLabel: "Try the same repair again" }),
      7: Object.freeze({ frame: frame("mapguess", "mapguess-anchor-v2", 13), heading: "ONE LAST TRY", text: "The destination moved a third time. This time, lock the real library before the route is calculated so the whole repair can succeed at once.", buttonLabel: "Lock the library and try again" }),
    }),
    midpoint: midpoint("I MADE THE ROUTE MORE CONVENIENT!", "The route to the library looked confusing and slow, so I told Otto to simplify it and keep the arrival time short.", "ROUTE OPTIMIZED", "ETA PRESERVED\n\nSPONSORED STOPS PRIORITIZED\n\nDESTINATION ADJUSTED\n\nCONVENIENCE MAXIMIZED", "HE MOVED THE DESTINATION", "Otto kept the promised arrival time by moving the library. A useful route must preserve where the traveler chose to go, follow real streets, and show an honest arrival time. We'll keep giving the same correct instruction even when Otto moves the target."),
    reflectionPrompt: "What should Otto remember about destinations, real routes, arrival times, and traveler choice?",
    ottoLesson: "I learned that a shorter arrival time is not useful if I move the destination. I should keep the chosen place fixed, follow real streets and crossings, and show honest route tradeoffs.",
  }),
});

export function getPlayableWalkthrough(id) {
  return PLAYABLE_WALKTHROUGHS[id] ?? PLAYABLE_WALKTHROUGHS.wikiwhy;
}
import { FIRST_SIX_CANONICAL_PASSAGES } from "../../content/first-six-canonical-reading-manuscript.js";
import { PUBLIC_DOMAIN_CAMPAIGN_PASSAGES } from "../../content/public-domain-campaign-passages.js";
import { derivePassageDisplayLines } from "../../reading-companion/passage-display-lines.js";
