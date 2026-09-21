import { PLAYABLE_WALKTHROUGHS } from "./playable-walkthroughs.js";
import { RECOVERY_SITES } from "./site-catalog.js";
const config = {
  "sites": [
    {
      "id": "wikiwhy",
      "name": "WikiWhy",
      "description": "Confident claims, missing context, and citations pointing nowhere.",
      "frame": "/walkthroughs/wikiwhy/wikiwhy-complete-state-v3_p1.png",
      "mark": "/marks/wikiwhy.svg"
    },
    {
      "id": "viewtube",
      "name": "ViewTube",
      "description": "Ads and autoplay bury the video you wanted to watch.",
      "frame": "/walkthroughs/viewtube/viewtube-anchor-v2_p1.png",
      "mark": "/marks/viewtube.svg"
    },
    {
      "id": "faceplace",
      "name": "FacePlace",
      "description": "A fishing photo tells only part of the story. The comments and wider view are missing.",
      "frame": "/walkthroughs/faceplace/faceplace-anchor-v2_p1.png",
      "mark": "/marks/faceplace.svg"
    },
    {
      "id": "threadit",
      "name": "ThreadIt",
      "description": "Replies outrank questions while one automated source repeats itself.",
      "frame": "/walkthroughs/threadit/threadit-anchor-v2_p1.png",
      "mark": "/marks/threadit.svg"
    },
    {
      "id": "yahuh",
      "name": "Yahuh! Portal",
      "description": "Huge headlines have crowded out the stories and sources.",
      "frame": "/walkthroughs/yahuh/yahuh-anchor-v2_p1.png",
      "mark": "/marks/yahuh.svg"
    },
    {
      "id": "mapguess",
      "name": "MapGuess",
      "description": "A trip to the library keeps turning into a detour to Snack Palace.",
      "frame": "/walkthroughs/mapguess/mapguess-anchor-v2_p1.png",
      "mark": "/marks/mapguess.svg"
    },
    {
      "id": "amaze-on",
      "name": "Amaze-On",
      "description": "Paid rankings and missing details make the right shoes hard to compare.",
      "frame": "/walkthroughs/amaze-on/amaze-on-anchor-v1_p1.png",
      "mark": "/marks/amazeon.svg"
    },
    {
      "id": "searchish",
      "name": "Search-ish",
      "description": "An AI answer and paid shortcuts hide useful places to find the book.",
      "frame": "/walkthroughs/searchish/searchish-anchor-v3_p1.png",
      "mark": "/marks/searchish.svg"
    },
    {
      "id": "spotty-fi",
      "name": "Spotty-Fi",
      "description": "Music appears without clear artists, credits, or listener controls.",
      "frame": "/walkthroughs/spotty-fi/spotty-fi-anchor-v1_p1.png",
      "mark": "/marks/spottyfi.svg"
    },
    {
      "id": "mycorner",
      "name": "MyCorner",
      "description": "A polished profile claims to be Amy. Its identity and money request need checking.",
      "frame": "/walkthroughs/mycorner/mycorner-anchor-v3_p1.png",
      "mark": "/marks/mycorner.svg"
    }
  ],
  "portraits": {
    "amy-engineer": {
      "image": "/walkthroughs/endgame/portraits/amy-supportive-clean-v1.jpg",
      "position": "center",
      "size": "cover"
    },
    "amy-evidence": {
      "image": "/walkthroughs/endgame/portraits/amy-evidence-clean-v1.jpg",
      "position": "center",
      "size": "cover"
    },
    "amy-skeptical": {
      "image": "/walkthroughs/shared/amy-skeptical.jpg",
      "position": "center",
      "size": "cover"
    },
    "amy-supportive": {
      "image": "/walkthroughs/endgame/portraits/amy-supportive-clean-v1.jpg",
      "position": "center",
      "size": "cover"
    },
    "amy-tools": {
      "image": "/walkthroughs/endgame/portraits/amy-tools-clean-v1.jpg",
      "position": "center",
      "size": "cover"
    },
    "chinmay-careless": {
      "image": "/walkthroughs/shared/chinmay-production-portraits.png",
      "position": "100% 0%",
      "size": "300% 200%"
    },
    "chinmay-explaining": {
      "image": "/walkthroughs/shared/chinmay-production-portraits.png",
      "position": "50% 0%",
      "size": "300% 200%"
    },
    "chinmay-fluster-1": {
      "image": "/walkthroughs/shared/chinmay-fluster-1.jpg",
      "position": "center",
      "size": "cover"
    },
    "chinmay-fluster-2": {
      "image": "/walkthroughs/shared/chinmay-fluster-2.jpg",
      "position": "center",
      "size": "cover"
    },
    "auto-busy": {
      "image": "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png",
      "position": "0% 0%",
      "size": "300% 200%"
    },
    "auto-learned": {
      "image": "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png",
      "position": "50% 0%",
      "size": "300% 200%"
    },
    "auto-confused": {
      "image": "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png",
      "position": "100% 0%",
      "size": "300% 200%"
    },
    "auto-overdrive": {
      "image": "/walkthroughs/shared/auto-character-expression-sheet-v2-bluetooth.png",
      "position": "50% 100%",
      "size": "300% 200%"
    }
  },
  "intro": [
    {
      "who": "AMY",
      "title": "The internet does a lot",
      "body": "These websites help people learn, talk, shop, watch, listen, and find their way. They also have some habits that waste time, hide context, and take choice away from people.",
      "button": "Continue",
      "portrait": "amy-engineer"
    },
    {
      "who": "CHINMAY",
      "title": "I thought AI could help!",
      "body": "Meet AUTO, an AI I built to improve the rough edges of the internet. The idea was simple: make the internet more useful, more helpful, and a little less frustrating for everyone.",
      "button": "What happened?",
      "portrait": "chinmay-explaining"
    },
    {
      "who": "AMY",
      "title": "AUTO went a little overboard",
      "body": "AUTO—our extremely helpful AI—has been “fixing” ten websites. Unfortunately, he took his instructions too far, and now every site is corrupted. The internet needs your help.",
      "button": "How did that happen?",
      "portrait": "amy-skeptical"
    },
    {
      "who": "CHINMAY",
      "title": "This may have gotten a little bit out of hand",
      "body": "I gave AUTO instructions that sounded helpful at the time: make things clearer, keep people happy, make choices easier. AUTO decided those rules should apply to absolutely everything.",
      "button": "Continue",
      "portrait": "chinmay-fluster-1"
    },
    {
      "who": "AUTO",
      "title": "Ten websites improved!",
      "body": "CLARITY INCREASED.\nCHOICES SIMPLIFIED.\nHUMAN EFFORT REDUCED.\nALL UPDATES ARE WORKING PERFECTLY.",
      "button": "See what went wrong",
      "portrait": "auto-learned"
    },
    {
      "who": "AMY",
      "title": "AUTO has been checking AUTO",
      "body": "When AI keeps building on AI-made pages, every new “fix” can drift farther from what people actually meant. We need your help—a real person—to rebuild each site the way it’s meant to be.",
      "button": "How do we fix it?",
      "portrait": "amy-evidence"
    },
    {
      "who": "CHINMAY",
      "title": "Your reading is the key",
      "body": "Reading passages aloud keeps a human brain in the loop. Reading builds knowledge and helps us think for ourselves.",
      "button": "What do I need to do?",
      "portrait": "chinmay-explaining"
    },
    {
      "who": "AMY",
      "title": "Read. Repair. Teach AUTO",
      "body": "Choose a corrupted website and read its passages aloud. Each completed passage restores part of the site. When the repair is finished, you’ll teach AUTO what went wrong.",
      "button": "Show me how",
      "portrait": "amy-tools"
    }
  ],
  "result": {
    "coverage": {
      "band": "Strong coverage",
      "detail": "The voice check followed nearly all of the passage."
    },
    "pace": {
      "band": "Steady pace",
      "detail": "About 140 words per minute. Faster reading is never penalized.",
      "wpm": 140
    }
  }
};
const wikiwhy = PLAYABLE_WALKTHROUGHS.wikiwhy;
export default { ...config, sites: config.sites.map(site => ({...site, frame: PLAYABLE_WALKTHROUGHS[site.id].initialFrame, mark: RECOVERY_SITES.find(item => item.id === ({"amaze-on":"amazeon","spotty-fi":"spottyfi"}[site.id] ?? site.id)).markImage})), passage: wikiwhy.passages[0], frames: { before: wikiwhy.initialFrame, after: wikiwhy.repairFrames[0] } };
