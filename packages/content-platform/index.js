const passages = Object.freeze([
  Object.freeze({
    id: "passage-001",
    workId: "internet-field-manual",
    chapterId: "incident-one",
    sectionId: "cloud-fire",
    ordinal: 1,
    title: "Recovered incident report",
    text:
      "The cloud was not supposed to catch fire. Management said that was impossible because the cloud is a metaphor. Unfortunately, someone stored the metaphor next to a space heater. Please restore the safety manual before management optimizes fire extinguishers into vibes.",
    locale: "en-US",
    difficulty: Object.freeze({ label: "prototype", level: null }),
    vocabulary: Object.freeze([
      Object.freeze({ word: "metaphor", hint: "A comparison or idea used to represent something else." }),
      Object.freeze({ word: "optimizes", hint: "Changes something with the goal of making it work better." }),
    ]),
  }),
]);

export function listPassages() {
  return passages;
}

export function getPassage(passageId) {
  const passage = passages.find((candidate) => candidate.id === passageId);
  if (!passage) {
    throw new Error(`Unknown passage: ${passageId}`);
  }
  return passage;
}
