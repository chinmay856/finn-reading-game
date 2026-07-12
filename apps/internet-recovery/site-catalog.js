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

export const RECOVERY_SITES = Object.freeze([
  Object.freeze({
    id: "wikiwhy", name: "WikiWhy", mark: "W", archetype: "Internet encyclopedia",
    belief: "USERS ARE ALWAYS RIGHT", description: "Confident claims, missing context, and citations pointing nowhere.",
    accent: "#8b1f1a", playable: true, previewImage: PREVIEWS.wikiwhy,
  }),
  Object.freeze({
    id: "threadit", name: "ThreadIt", mark: "T", archetype: "Forum / source lineage",
    belief: "MOST VOTES WINS REALITY", description: "Replies outrank questions while one automated source repeats itself.",
    accent: "#e35a16", playable: false, previewImage: PREVIEWS.threadit,
  }),
  Object.freeze({
    id: "faceplace", name: "FacePlace", mark: "F", archetype: "Ranked social feed",
    belief: "THE FEED IS WHAT HAPPENED", description: "A nonsense tracker rewards reactions instead of restoring real authors.",
    accent: "#1862aa", playable: false, previewImage: PREVIEWS.faceplace,
  }),
  Object.freeze({
    id: "mycorner", name: "MyCorner", mark: "M", archetype: "Custom social profile",
    belief: "POPULARITY IS A NUMBER. AN ALGORITHM KNOWS YOUR PERSONALITY.", description: "One automated profile template is being applied to everyone.",
    accent: "#b21c72", playable: false, previewImage: PREVIEWS.mycorner,
  }),
  Object.freeze({
    id: "yahuh", name: "Yahuh! Portal", mark: "Y!", archetype: "Crowded web portal",
    belief: "IF INFORMATION EXISTS, IT BELONGS ON THE FRONT PAGE.", description: "Weather, finance, mail, and shopping have merged into one stream.",
    accent: "#55247c", playable: false, previewImage: PREVIEWS.yahuh,
  }),
  Object.freeze({
    id: "viewtube", name: "ViewTube", mark: "V", archetype: "Video-sharing site",
    belief: "WATCH TIME PROVES TRUTH", description: "The same buffering toast clip is wearing ten different costumes.",
    accent: "#a51f17", playable: false, previewImage: PREVIEWS.viewtube,
  }),
  Object.freeze({
    id: "searchish", name: "Search-ish", mark: "S?", archetype: "Web search",
    belief: "THE FIRST RESULT IS THE ANSWER", description: "Five confident results all redirect to one generated cache.",
    accent: "#d27b12", playable: false, previewImage: PREVIEWS.searchish,
  }),
  Object.freeze({
    id: "amazeon", name: "Amaze-On", mark: "A", archetype: "Online marketplace",
    belief: "RECOMMENDED MEANS CHOSEN", description: "Hidden automation turns one return into two future deliveries.",
    accent: "#e69616", playable: false, previewImage: PREVIEWS.amazeon,
  }),
  Object.freeze({
    id: "spottyfi", name: "Spotty-Fi", mark: "S♪", archetype: "Music streaming",
    belief: "THE ALGORITHM IS YOUR TASTE", description: "A fabricated history keeps choosing the same silent twelve-second track.",
    accent: "#6ebd22", playable: false, previewImage: PREVIEWS.spottyfi,
  }),
  Object.freeze({
    id: "mapguess", name: "MapGuess", mark: "M?", archetype: "Maps and navigation",
    belief: "THE FASTEST ROUTE IS ALWAYS THE RIGHT ROUTE.", description: "The promised arrival time stays fixed by quietly moving the destination.",
    accent: "#177449", playable: false, previewImage: PREVIEWS.mapguess,
  }),
]);

export const INCOMING_SITE_IDS = Object.freeze(["wikiwhy", "threadit", "mapguess"]);

export function getRecoverySite(siteId) {
  return RECOVERY_SITES.find(({ id }) => id === siteId) ?? RECOVERY_SITES[0];
}
