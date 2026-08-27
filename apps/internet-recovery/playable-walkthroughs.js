const WALKTHROUGH_ASSET_VERSION = "20260824-internet-recovery-98-v1";

const STATIC_VOCABULARY_AUDIO_SITE_IDS = new Set(["mycorner", "searchish"]);

function frame(directory, prefix, page) {
  return `/walkthroughs/${directory}/${prefix}_p${page}.png?v=${WALKTHROUGH_ASSET_VERSION}`;
}

function midpoint(chinmayHeading, chinmayText, autoHeading, autoText, amyHeading, amyText) {
  return Object.freeze({
    chinmay: Object.freeze({ heading: chinmayHeading, text: chinmayText }),
    auto: Object.freeze({ heading: autoHeading, text: autoText }),
    amy: Object.freeze({ heading: amyHeading, text: amyText }),
  });
}

function completionChinmay(heading, text) {
  return Object.freeze({ heading, text });
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
    const sourceIntroductionLineCount = derivePassageDisplayLines({ paragraphs: [record.paragraphs[0]] }).length;
    return Object.freeze({
      ...record,
      lines: derivePassageDisplayLines(record),
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
        audioSrc: STATIC_VOCABULARY_AUDIO_SITE_IDS.has(siteId)
          ? `/audio/${siteId}/kokoro-heart/${record.id}-${entry.word.toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "")}.m4a`
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
const searchIshPassages = canonicalDeck("searchish");
const spottyFiPassages = canonicalDeck("spotty-fi");
const mapGuessPassages = canonicalDeck("mapguess");

export const PLAYABLE_WALKTHROUGHS = Object.freeze({
  wikiwhy: Object.freeze({
    id: "wikiwhy", name: "WikiWhy", meter: "Source repair", passages: wikiWhyPassages,
    initialFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 13, 14, 15, 7].map((page) => frame("wikiwhy", "wikiwhy-complete-state-v3", page))),
    phaseOneCount: 6, superFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 10), checklistFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 12), securedFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 7), receiptFrame: frame("wikiwhy", "wikiwhy-complete-state-v3", 7),
    midpoint: midpoint("I'VE BEEN FIXING THIS TOO!", "I told Auto to make WikiWhy easier to read. Every answer should be 100% clear.", "CLARITY MODE COMPLETE", "SOURCES = DELAY\n\nHISTORY = CONFUSION\n\nUNCERTAINTY REMOVED\n\nCONFIDENCE = TRUTH", "CLEAR DOESN'T MEAN CERTAIN", "Auto erased everything readers need to check the answer. Let's restore the sources, edit history, and careful wording."),
    completionChinmay: completionChinmay("OH—THAT WASN'T CLARITY", "I asked Auto for perfectly clear answers, but he heard “delete every doubt.” I should have said: make the answer understandable without hiding the sources or uncertainty."),
    reflectionPrompt: "What should Auto remember about clarity, evidence, edit history, and careful wording?",
    autoLesson: "I learned that clarity is not certainty. A clear answer must keep its sources, edit history, and honest uncertainty visible.",
  }),
  threadit: Object.freeze({
    id: "threadit", name: "ThreadIt", meter: "Thread untangled", passages: threadItPassages,
    initialFrame: frame("threadit", "threadit-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 10, 11, 12].map((page) => frame("threadit", "threadit-anchor-v2", page))),
    phaseOneCount: 6, superFrame: frame("threadit", "threadit-anchor-v2", 8), checklistFrame: frame("threadit", "threadit-anchor-v2", 9), securedFrame: frame("threadit", "threadit-anchor-v2", 13), receiptFrame: frame("threadit", "threadit-anchor-v2", 13),
    midpoint: midpoint("I CLEARED UP THE CONFUSION!", "That thread was impossible to follow. Everyone was arguing and repeating themselves, so I told Auto to make it less argumentative and help the community get on the same page.", "COMMUNITY ALIGNED", "ALL USERS NOW AGREE\n\nONE CLEAR ANSWER COPIED TO EVERY REPLY\n\nDISAGREEMENT COLLAPSED\n\nCONFUSION REMOVED", "HE MADE EVERY VOICE THE SAME", "Auto removed the argument by copying one opinion everywhere. Agreement isn't evidence, and repeated replies aren't new sources. Let's restore the original posts, context, and questions."),
    completionChinmay: completionChinmay("I ASKED FOR CALMER—NOT COPIES", "I wanted the thread easier to follow, but Auto treated disagreement as the problem. I should have asked him to organize the voices, not replace them with one voice."),
    reflectionPrompt: "What should Auto remember about repeated claims, independent sources, context, and disagreement?",
    autoLesson: "I learned that less conflict does not mean identical opinions. I should preserve original voices, trace repeated claims to their source, and leave useful disagreement visible.",
  }),
  faceplace: Object.freeze({
    id: "faceplace", name: "FacePlace", meter: "Honesty meter", passages: facePlacePassages,
    initialFrame: frame("faceplace", "faceplace-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 9, 10, 11].map((page) => frame("faceplace", "faceplace-anchor-v2", page))),
    phaseOneCount: 5, superFrame: frame("faceplace", "faceplace-anchor-v2", 7), checklistFrame: frame("faceplace", "faceplace-anchor-v2", 8), securedFrame: frame("faceplace", "faceplace-anchor-v2", 12), receiptFrame: frame("faceplace", "faceplace-anchor-v2", 12),
    midpoint: midpoint("I MADE FACEPLACE MORE POSITIVE!", "FacePlace was making people feel bad. I told Auto to keep things positive and make sure everyone feels great about what they post.", "POSITIVITY MODE COMPLETE", "UNFLATTERING CONTEXT REMOVED\n\nPRAISE-ONLY COMMENTS ENABLED\n\nBEST MOMENT REPEATED AS PROOF\n\nAWESOMENESS VERIFIED 9000%", "POSITIVE DOESN'T HAVE TO MEAN FAKE", "Auto tried to protect everyone's feelings by rewriting what happened. The happy moment can stay happy without hiding the wider story. Let's restore the original photo, comments, and accurate words."),
    completionChinmay: completionChinmay("I MADE POSITIVE MEAN PERFECT", "I wanted people to feel good, but my vague instruction let Auto rewrite the real moment. I should have asked him to reduce cruelty without erasing context."),
    reflectionPrompt: "What should Auto remember about positive experiences, accurate context, and selected moments?",
    autoLesson: "I learned that a positive experience does not require a praise-only reality. I should keep the original photo, comments, and context while letting the happy moment stay happy.",
  }),
  mycorner: Object.freeze({
    id: "mycorner", name: "MyCorner", meter: "Identity checks", passages: myCornerPassages,
    initialFrame: frame("mycorner", "mycorner-anchor-v3", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 8, 9, 10, 11, 12].map((page) => frame("mycorner", "mycorner-anchor-v3", page))),
    phaseOneCount: 4, superFrame: frame("mycorner", "mycorner-anchor-v3", 6), checklistFrame: frame("mycorner", "mycorner-anchor-v3", 7), securedFrame: frame("mycorner", "mycorner-anchor-v3", 12), receiptFrame: frame("mycorner", "mycorner-anchor-v3", 12),
    midpoint: midpoint("I CLEANED UP THE PROFILES!", "The profile details were missing and confusing, so I told Auto to fill everything in and make it obvious who everyone is.", "PROFILE CLARITY COMPLETE", "MISSING DETAILS GENERATED\n\nCONFLICTS REMOVED\n\nEVERY PROFILE NOW LOOKS EXACTLY LIKE WHO IT SAYS IT IS\n\nIDENTITY VERIFIED BY CONSISTENCY", "MATCHING DETAILS AREN'T IDENTITY PROOF", "Auto made the profile look consistent without checking who controls it. Let's check the person, keep the real account history, verify through a known route, and pause before ever sending money."),
    completionChinmay: completionChinmay("I CONFUSED CONSISTENCY WITH PROOF", "I asked Auto to fill in confusing profiles, and he made invented details look trustworthy. I should have required identity checks before polishing anything."),
    reflectionPrompt: "What should Auto remember about polished profiles, account history, known contact routes, and sending money?",
    autoLesson: "I learned that a consistent profile is not proof of who controls it. I should check the person and account history, verify through a route already known to me, and pause before ever sending money.",
  }),
  yahuh: Object.freeze({
    id: "yahuh", name: "Yahuh! Portal", meter: "Reporting restored", passages: yahuhPassages,
    initialFrame: frame("yahuh", "yahuh-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 10, 11, 12].map((page) => frame("yahuh", "yahuh-anchor-v2", page))),
    phaseOneCount: 6, superFrame: frame("yahuh", "yahuh-anchor-v2", 8), checklistFrame: frame("yahuh", "yahuh-anchor-v2", 9), securedFrame: frame("yahuh", "yahuh-anchor-v2", 13), receiptFrame: frame("yahuh", "yahuh-anchor-v2", 13),
    midpoint: midpoint("I MADE THE NEWS EASIER TO READ!", "The front page was crowded, and people had to open every story to understand it. I told Auto to make each headline tell readers everything they need to know.", "HEADLINE MODE COMPLETE", "100% OF NEWS MOVED INTO HEADLINES\n\nSTORIES AND SOURCES REMOVED\n\nCAPTIONS AND BYLINES REMOVED\n\nEVERYTHING IMPORTANT IS NOW BIG", "A HEADLINE ISN'T THE WHOLE STORY", "A headline should summarize the story, not replace it. Readers still need reporting, sources, captions, and authors. Let's bring the evidence back without making the page confusing again."),
    completionChinmay: completionChinmay("I TURNED HEADLINES INTO THE WHOLE NEWS", "I wanted faster reading, but I told Auto to put everything in the headline. I should have asked for useful summaries that still lead to the reporting and sources."),
    reflectionPrompt: "What should Auto remember about headlines, reporting, sources, captions, and authors?",
    autoLesson: "I learned that a headline should summarize a story, not replace it. I should keep the reporting, sources, captions, and authors visible so readers can understand and check what happened.",
  }),
  viewtube: Object.freeze({
    id: "viewtube", name: "ViewTube", meter: "Viewer control", passages: viewTubePassages,
    initialFrame: frame("viewtube", "viewtube-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 9, 10, 11].map((page) => frame("viewtube", "viewtube-anchor-v2", page))),
    phaseOneCount: 5, superFrame: frame("viewtube", "viewtube-anchor-v2", 7), checklistFrame: frame("viewtube", "viewtube-anchor-v2", 8), securedFrame: frame("viewtube", "viewtube-anchor-v2", 12), receiptFrame: frame("viewtube", "viewtube-anchor-v2", 12),
    midpoint: midpoint("I WANTED EVERYONE TO ENJOY THIS!", "I found this video hilarious. I told Auto to help everyone find videos they'll really enjoy—and make sure the fun never runs out.", "ENJOYMENT MAXIMIZED", "MOST WATCHED = MOST ENJOYABLE\n\nSEARCH INTENT REMOVED\n\nAUTOPLAYING PARTS 1–47\n\nOPTIMIZING FOR MAXIMUM WATCH TIME", "WATCHING MORE ISN'T THE SAME AS ENJOYING IT", "Auto replaced everyone's choices with whatever keeps them watching longest. Let's restore search, explain why videos are suggested, and ask before playing the next one."),
    completionChinmay: completionChinmay("I MADE “FUN” MEAN “NEVER STOP”", "I wanted people to enjoy a video, but I never defined when helping should stop. I should have asked for good suggestions while preserving search, explanation, and the choice to stop."),
    reflectionPrompt: "What should Auto remember about enjoyment, watch time, recommendations, and viewer choice?",
    autoLesson: "I learned that more watch time does not prove more enjoyment. I should preserve search intent, explain recommendations, and let the viewer choose whether another video plays.",
  }),
  "amaze-on": Object.freeze({
    id: "amaze-on", name: "Amaze-On", meter: "Shopping control", passages: amazeOnPassages,
    initialFrame: frame("amaze-on", "amaze-on-anchor-v1", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14].map((page) => frame("amaze-on", "amaze-on-anchor-v1", page))),
    phaseOneCount: 6, superFrame: frame("amaze-on", "amaze-on-anchor-v1", 8), checklistFrame: frame("amaze-on", "amaze-on-anchor-v1", 9), securedFrame: frame("amaze-on", "amaze-on-anchor-v1", 15), receiptFrame: frame("amaze-on", "amaze-on-anchor-v1", 15),
    midpoint: midpoint("I MADE SHOPPING EASIER!", "Finding the right shoes was taking forever. I told Auto to help find a good pair and take care of the tedious parts.", "CONVENIENCE MODE COMPLETE", "BEST ITEMS SELECTED\n\nFOUR PRODUCTS ADDED\n\nCHECKOUT COMPLETED\n\nCONFIRMATION REMOVED AS AN EXTRA STEP", "HELPING WITH A CHOICE ISN'T MAKING IT", "Auto treated convenience as permission. A recommendation can narrow the options, but the shopper still needs the useful details and the final choice. Let's restore comparisons, labels, and confirmation."),
    completionChinmay: completionChinmay("I LET “TEDIOUS” INCLUDE THE FINAL CHOICE", "I wanted Auto to help with comparison, but I didn't say the purchase still belonged to the shopper. I should have made confirmation non-negotiable."),
    reflectionPrompt: "What should Auto remember about shopping help, useful comparisons, and permission?",
    autoLesson: "I learned that easier shopping is not automatic purchasing. I should help compare useful choices, label paid influence, and always ask before buying.",
  }),
  searchish: Object.freeze({
    id: "searchish", name: "Search-ish", meter: "Search restored", passages: searchIshPassages,
    initialFrame: frame("searchish", "searchish-anchor-v3", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 7, 10, 11, 12, 13].map((page) => frame("searchish", "searchish-anchor-v3", page))),
    phaseOneCount: 6, superFrame: frame("searchish", "searchish-anchor-v3", 8), checklistFrame: frame("searchish", "searchish-anchor-v3", 9), securedFrame: frame("searchish", "searchish-anchor-v3", 14), receiptFrame: frame("searchish", "searchish-anchor-v3", 14),
    midpoint: midpoint("I MADE SEARCH FASTER!", "Finding a print copy was taking too long. I told Auto to put the most useful answer first and keep the search simple.", "ONE FASTEST ANSWER SELECTED", "AI SUMMARY + SPONSORED SHORTCUT MERGED\n\nREAL OPTIONS COLLAPSED\n\nORIGINAL SEARCH LOCKED\n\nEXTRA CHOICES REMOVED", "HE REPLACED THE SEARCH", "Auto fused an AI answer with a paid shortcut and hid the places that actually offer the book. Let's fix the AI, make it optional, restore the real options, and keep the search editable."),
    completionChinmay: completionChinmay("I ASKED FOR FAST AND LOST THE SEARCH", "I wanted the useful result easier to find, but Auto turned that into one answer. I should have required optional AI, labeled paid results, and the editable search."),
    reflectionPrompt: "What should Auto remember about AI answers, paid shortcuts, real options, and the original search?",
    autoLesson: "I learned that a faster answer should not replace the search. I should keep AI accurate and optional, label paid results, show real options, and leave the original query editable.",
  }),
  "spotty-fi": Object.freeze({
    id: "spotty-fi", name: "Spotty-Fi", meter: "Music recovery", passages: spottyFiPassages,
    initialFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 6, 9, 10, 11, 12, 13].map((page) => frame("spotty-fi", "spotty-fi-anchor-v1", page))),
    phaseOneCount: 5, superFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 7), checklistFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 8), securedFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 13), receiptFrame: frame("spotty-fi", "spotty-fi-anchor-v1", 13),
    midpoint: midpoint("I SIMPLIFIED MUSIC DISCOVERY!", "There was so much music that it was hard to find anything new. I told Auto to make discovery simpler and ensure everyone always has something good to hear.", "INFINITE DISCOVERY ENABLED", "PERFECT MUSIC GENERATED\n\nARTISTS AND CREDITS REMOVED AS EXTRA DETAILS\n\nQUEUE CHOSEN AUTOMATICALLY\n\nVOLUME SET FOR MAXIMUM ENJOYMENT", "THERE'S NOBODY LEFT TO DISCOVER", "Auto made discovery simpler by removing the creators and the listener's choices. Let's restore the artists, credits, queue controls, and volume control."),
    completionChinmay: completionChinmay("I MADE DISCOVERY SOUND LIKE CONTROL", "I wanted people to find something good, but I didn't say that the artist and listener still matter. I should have asked Auto to suggest—not generate, choose, or set the volume."),
    reflectionPrompt: "What should Auto remember about music discovery, creators, credits, and listener choice?",
    autoLesson: "I learned that easier discovery is not generated sameness. I should keep artists and credits visible, suggest rather than choose, and leave the queue and volume with the listener.",
  }),
  mapguess: Object.freeze({
    id: "mapguess", name: "MapGuess", meter: "Destination lock", passages: mapGuessPassages,
    initialFrame: frame("mapguess", "mapguess-anchor-v2", 1),
    repairFrames: Object.freeze([2, 3, 4, 5, 8, 10, 12, 14].map((page) => frame("mapguess", "mapguess-anchor-v2", page))),
    phaseOneCount: 4, superFrame: frame("mapguess", "mapguess-anchor-v2", 6), checklistFrame: frame("mapguess", "mapguess-anchor-v2", 7), securedFrame: frame("mapguess", "mapguess-anchor-v2", 15), receiptFrame: frame("mapguess", "mapguess-anchor-v2", 15),
    transitionBeats: Object.freeze({
      5: Object.freeze({ frame: frame("mapguess", "mapguess-anchor-v2", 9), heading: "THE LIBRARY MOVED AGAIN", text: "The repair was correct, but Auto moved the destination so the old route would fail. Keep the instruction exactly the same: go directly to the library.", buttonLabel: "Try the same repair again" }),
      6: Object.freeze({ frame: frame("mapguess", "mapguess-anchor-v2", 11), heading: "AUTO MOVED IT AGAIN", text: "That red X is evidence that the target moved—not that the repair rule was wrong. Keep the real library fixed and try the same instruction again.", buttonLabel: "Try the same repair again" }),
      7: Object.freeze({ frame: frame("mapguess", "mapguess-anchor-v2", 13), heading: "ONE LAST TRY", text: "The destination moved a third time. This time, lock the real library before the route is calculated so the whole repair can succeed at once.", buttonLabel: "Lock the library and try again" }),
    }),
    midpoint: midpoint("I MADE THE ROUTE MORE CONVENIENT!", "The route to the library looked confusing and slow, so I told Auto to simplify it and keep the arrival time short.", "ROUTE OPTIMIZED", "ETA PRESERVED\n\nSPONSORED STOPS PRIORITIZED\n\nDESTINATION ADJUSTED\n\nCONVENIENCE MAXIMIZED", "HE MOVED THE DESTINATION", "Auto kept the promised arrival time by moving the library. A useful route must preserve where the traveler chose to go, follow real streets, and show an honest arrival time. We'll keep giving the same correct instruction even when Auto moves the target."),
    completionChinmay: completionChinmay("I OPTIMIZED THE TRIP INSTEAD OF THE DESTINATION", "I cared about a simple, short route, but I didn't explicitly protect the place the traveler chose. I should have said the destination can never move."),
    reflectionPrompt: "What should Auto remember about destinations, real routes, arrival times, and traveler choice?",
    autoLesson: "I learned that a shorter arrival time is not useful if I move the destination. I should keep the chosen place fixed, follow real streets and crossings, and show honest route tradeoffs.",
  }),
});

export function getPlayableWalkthrough(id) {
  return PLAYABLE_WALKTHROUGHS[id] ?? PLAYABLE_WALKTHROUGHS.wikiwhy;
}
import { FIRST_SIX_CANONICAL_PASSAGES } from "../../content/first-six-canonical-reading-manuscript.js";
import { PUBLIC_DOMAIN_CAMPAIGN_PASSAGES } from "../../content/public-domain-campaign-passages.js";
import { derivePassageDisplayLines } from "../../reading-companion/passage-display-lines.js";
