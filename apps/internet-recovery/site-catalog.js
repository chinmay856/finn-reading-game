const PREVIEWS = Object.freeze({
  amazeon: new URL("./art/site-assets/previews/amazeon-act-one.jpg", import.meta.url).href,
  faceplace: new URL("./art/site-assets/previews/faceplace-act-one.jpg", import.meta.url).href,
  mapguess: new URL("./art/site-assets/previews/mapguess-act-one.jpg", import.meta.url).href,
  mycorner: new URL("./art/site-assets/previews/mycorner-act-one.jpg", import.meta.url).href,
  searchish: new URL("./art/site-assets/previews/searchish-act-one.jpg", import.meta.url).href,
  spottyfi: new URL("./art/site-assets/previews/spottyfi-act-one.jpg", import.meta.url).href,
  threadit: new URL("./art/site-assets/previews/threadit-act-one.jpg", import.meta.url).href,
  viewtube: new URL("./art/site-assets/previews/viewtube-act-one.jpg", import.meta.url).href,
  wikiwhy: new URL("./art/site-assets/previews/wikiwhy-act-one.jpg", import.meta.url).href,
  yahuh: new URL("./art/site-assets/previews/yahuh-act-one.jpg", import.meta.url).href,
});

const MARKS = Object.freeze({
  amazeon: new URL("./art/site-assets/marks/amazeon-mark.svg", import.meta.url).href,
  faceplace: new URL("./art/site-assets/marks/faceplace-mark.svg", import.meta.url).href,
  mapguess: new URL("./art/site-assets/marks/mapguess-mark.svg", import.meta.url).href,
  mycorner: new URL("./art/site-assets/marks/mycorner-mark.svg", import.meta.url).href,
  searchish: new URL("./art/site-assets/marks/searchish-mark.svg", import.meta.url).href,
  spottyfi: new URL("./art/site-assets/marks/spottyfi-mark.svg", import.meta.url).href,
  threadit: new URL("./art/site-assets/threadit/threadit-mark.svg", import.meta.url).href,
  viewtube: new URL("./art/site-assets/marks/viewtube-mark.svg", import.meta.url).href,
  wikiwhy: new URL("./art/site-assets/marks/wikiwhy-mark.svg", import.meta.url).href,
  yahuh: new URL("./art/site-assets/marks/yahuh-mark.svg", import.meta.url).href,
});

export const RECOVERY_SITES = Object.freeze([
  Object.freeze({
    id: "wikiwhy", name: "WikiWhy", mark: "W", archetype: "Internet encyclopedia",
    belief: "USERS ARE ALWAYS RIGHT", description: "Confident claims, missing context, and citations pointing nowhere.",
    accent: "#8b1f1a", markImage: MARKS.wikiwhy, playable: true, runtimeAvailable: true, runtimeLabel: "RECOVERY AVAILABLE", previewImage: PREVIEWS.wikiwhy,
  }),
  Object.freeze({
    id: "threadit", name: "ThreadIt", mark: "T", archetype: "Forum / source lineage",
    belief: "MOST VOTES WINS REALITY", description: "Replies outrank questions while one automated source repeats itself.",
    accent: "#e35a16", markImage: MARKS.threadit, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.threadit,
  }),
  Object.freeze({
    id: "faceplace", name: "FacePlace", mark: "F", archetype: "Ranked social feed",
    belief: "THE FEED IS WHAT HAPPENED", description: "A fishing photo tells only part of the story. The comments and wider view are missing.",
    accent: "#1862aa", markImage: MARKS.faceplace, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.faceplace,
  }),
  Object.freeze({
    id: "mycorner", name: "MyCorner", mark: "M", archetype: "Custom social profile",
    belief: "POPULARITY IS A NUMBER. AN ALGORITHM KNOWS YOUR PERSONALITY.", description: "A polished profile claims to be Amy. Its identity and money request need checking.",
    accent: "#b21c72", markImage: MARKS.mycorner, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.mycorner,
  }),
  Object.freeze({
    id: "yahuh", name: "Yahuh! Portal", mark: "Y!", archetype: "Crowded web portal",
    belief: "IF INFORMATION EXISTS, IT BELONGS ON THE FRONT PAGE.", description: "Huge headlines have crowded out the stories and sources.",
    accent: "#6e3e98", markImage: MARKS.yahuh, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.yahuh,
  }),
  Object.freeze({
    id: "viewtube", name: "ViewTube", mark: "V", archetype: "Video-sharing site",
    belief: "WATCH TIME PROVES TRUTH", description: "Ads and autoplay bury the video you wanted to watch.",
    accent: "#a51f17", markImage: MARKS.viewtube, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.viewtube,
  }),
  Object.freeze({
    id: "searchish", name: "Search-ish", mark: "S?", archetype: "Web search",
    belief: "THE FIRST RESULT IS THE ANSWER", description: "An AI answer and paid shortcuts hide useful places to find the book.",
    accent: "#d27b12", markImage: MARKS.searchish, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.searchish,
  }),
  Object.freeze({
    id: "amazeon", name: "Amaze-On", mark: "A", archetype: "Online marketplace",
    belief: "RECOMMENDED MEANS CHOSEN", description: "Paid rankings and missing details make the right shoes hard to compare.",
    accent: "#e69616", markImage: MARKS.amazeon, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.amazeon,
  }),
  Object.freeze({
    id: "spottyfi", name: "Spotty-Fi", mark: "S♪", archetype: "Music streaming",
    belief: "THE ALGORITHM IS YOUR TASTE", description: "Music appears without clear artists, credits, or listener controls.",
    accent: "#6ebd22", markImage: MARKS.spottyfi, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.spottyfi,
  }),
  Object.freeze({
    id: "mapguess", name: "MapGuess", mark: "M?", archetype: "Maps and navigation",
    belief: "THE FASTEST ROUTE IS ALWAYS THE RIGHT ROUTE.", description: "A trip to the library keeps turning into a detour to Snack Palace.",
    accent: "#177449", markImage: MARKS.mapguess, playable: false, runtimeAvailable: true, runtimeLabel: "READY TO RECOVER", previewImage: PREVIEWS.mapguess,
  }),
]);

export const INCOMING_SITE_IDS = Object.freeze(["wikiwhy", "threadit", "mapguess"]);
const AFTER_WIKIWHY_INCOMING_SITE_IDS = Object.freeze(["threadit", "mapguess", "viewtube"]);
const AFTER_THREADIT_ONLY_INCOMING_SITE_IDS = Object.freeze(["wikiwhy", "mapguess", "viewtube"]);
const AFTER_THREADIT_INCOMING_SITE_IDS = Object.freeze(["faceplace", "spottyfi", "searchish"]);
// The designer has not frozen the post-FacePlace order. Keep the two already
// offered cases and add the next unbuilt site without presenting this as canon.
export const AFTER_FACEPLACE_PROVISIONAL_INCOMING_SITE_IDS = Object.freeze(["spottyfi", "searchish", "mycorner"]);

export function getIncomingSiteIds({ facePlaceSecured = false, threadItSecured = false, wikiWhySecured = false } = {}) {
  if (facePlaceSecured && wikiWhySecured && threadItSecured) return AFTER_FACEPLACE_PROVISIONAL_INCOMING_SITE_IDS;
  if (wikiWhySecured && threadItSecured) return AFTER_THREADIT_INCOMING_SITE_IDS;
  if (wikiWhySecured) return AFTER_WIKIWHY_INCOMING_SITE_IDS;
  if (threadItSecured) return AFTER_THREADIT_ONLY_INCOMING_SITE_IDS;
  return INCOMING_SITE_IDS;
}

export function getRecoverySite(siteId) {
  return RECOVERY_SITES.find(({ id }) => id === siteId) ?? RECOVERY_SITES[0];
}
