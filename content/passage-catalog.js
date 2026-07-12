import { PHOTOSYNTHESIS_PASSAGE } from "./wikiwhy/photosynthesis-passage.js";

const SELECTABLE_AVAILABILITY = new Set(["approved", "prototype"]);

export const PASSAGE_CATALOG = Object.freeze([
  PHOTOSYNTHESIS_PASSAGE,
]);

export function getPassageById(id, catalog = PASSAGE_CATALOG) {
  return catalog.find((passage) => passage.id === id) ?? null;
}

export function describePassageRights(passage) {
  const rights = passage?.rights ?? {};
  const source = passage?.source ?? {};
  if (rights.basis === "license") {
    return Object.freeze({
      label: rights.licenseId === "CC-BY-SA-4.0" ? "CC BY-SA 4.0" : rights.licenseId,
      modificationNotice: source.modificationNotice ?? "",
      url: rights.licenseUrl,
    });
  }
  if (rights.basis === "public-domain") {
    return Object.freeze({
      label: "Public-domain source",
      modificationNotice: source.modificationNotice ?? "",
      url: rights.licenseUrl ?? source.sourceUrl,
    });
  }
  return Object.freeze({
    label: "Rights and source record",
    modificationNotice: source.modificationNotice ?? "",
    url: rights.licenseUrl ?? source.sourceUrl,
  });
}

export function isSelectablePassage(passage) {
  const choices = passage?.comprehension?.choices;
  const checkpoint = passage?.profile?.checkpoint;
  const endDetection = passage?.profile?.endDetection;
  const guide = passage?.profile?.guide;
  const source = passage?.source;
  const rights = passage?.rights;
  const review = passage?.review;
  const text = (value) => typeof value === "string" && value.trim().length > 0;
  const number = (value) => typeof value === "number" && Number.isFinite(value);
  const positive = (value) => number(value) && value > 0;
  const positiveInteger = (value) => positive(value) && Number.isInteger(value);
  return Boolean(
    passage
    && SELECTABLE_AVAILABILITY.has(passage.availability)
    && text(passage.id)
    && text(passage.title)
    && Array.isArray(passage.paragraphs)
    && passage.paragraphs.length > 0
    && passage.paragraphs.every(text)
    && text(passage.comprehension?.prompt)
    && Array.isArray(choices)
    && choices.length === 3
    && choices.every((choice) => text(choice?.text) && typeof choice.correct === "boolean")
    && choices.filter(({ correct }) => correct).length === 1
    && text(passage.comprehension?.correctFeedback)
    && text(passage.comprehension?.incorrectFeedback)
    && text(passage.profile?.form)
    && text(passage.profile?.segmentation)
    && Array.isArray(passage.profile?.targetGrades)
    && passage.profile.targetGrades.length > 0
    && passage.profile.targetGrades.every(positiveInteger)
    && positive(passage.profile?.accuracyTarget)
    && passage.profile.accuracyTarget <= 100
    && positive(checkpoint?.audioOverlapMs)
    && positive(checkpoint?.maximumWindowMs)
    && positive(checkpoint?.minimumWindowMs)
    && checkpoint.minimumWindowMs <= checkpoint.maximumWindowMs
    && checkpoint.audioOverlapMs < checkpoint.maximumWindowMs
    && positive(checkpoint?.pauseMs)
    && positiveInteger(checkpoint?.tokenOverlap)
    && positive(endDetection?.finalPauseMs)
    && positiveInteger(endDetection?.minimumTailMatches)
    && positiveInteger(endDetection?.tailSize)
    && endDetection.minimumTailMatches <= endDetection.tailSize
    && positive(guide?.defaultWpm)
    && positiveInteger(guide?.leadWords)
    && Array.isArray(guide?.supportedWpm)
    && guide.supportedWpm.length > 0
    && guide.supportedWpm.every(positive)
    && guide.supportedWpm.includes(guide.defaultWpm)
    && positive(passage.profile?.targetWpm?.comfortable)
    && positive(passage.profile?.targetWpm?.stretch)
    && passage.profile.targetWpm.comfortable <= passage.profile.targetWpm.stretch
    && text(source?.attribution)
    && text(source?.domain)
    && text(source?.sourceType)
    && text(source?.sourceUrl)
    && text(rights?.basis)
    && text(rights?.creditLine)
    && text(rights?.verifiedOn)
    && (rights.basis !== "license" || (text(rights.licenseId) && text(rights.licenseUrl)))
    && text(review?.factual)
    && text(review?.grade)
    && text(review?.sensitivity)
    && text(review?.transcription),
  );
}

export function selectNextPassage({
  allowRepeat = false,
  catalog = PASSAGE_CATALOG,
  completedPassageIds = [],
  preferredIds = catalog.map(({ id }) => id),
} = {}) {
  const completed = new Set(completedPassageIds);
  const eligible = preferredIds
    .map((id) => getPassageById(id, catalog))
    .filter(isSelectablePassage);
  const availability = {
    selectableCount: eligible.length,
    unavailableCount: Math.max(0, preferredIds.length - eligible.length),
  };
  const unseen = eligible.find(({ id }) => !completed.has(id));
  if (unseen) return Object.freeze({ ...availability, passage: unseen, reason: "unseen" });
  if (allowRepeat && eligible.length) {
    const lastCompletedId = completedPassageIds.at(-1);
    return Object.freeze({
      ...availability,
      passage: eligible.find(({ id }) => id !== lastCompletedId) ?? eligible[0],
      reason: "exhausted-repeat",
    });
  }
  return Object.freeze({
    ...availability,
    passage: null,
    reason: eligible.length ? "no-unseen-passages" : "no-selectable-passages",
  });
}
