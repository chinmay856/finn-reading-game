import { PHOTOSYNTHESIS_PASSAGE } from "./wikiwhy/photosynthesis-passage.js";
import { WHY_DISAGREEMENT_MATTERS_PASSAGE } from "./threadit/why-disagreement-matters.js";
import { THREADIT_FIRST_RUN_PASSAGES } from "./threadit/first-run-passages.js";
import { A_SECOND_READING_PASSAGE } from "./faceplace/a-second-reading.js";
import { A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE } from "./mapguess/a-map-is-not-a-photograph.js";
import { A_CABIN_WITH_A_PURPOSE_PASSAGE } from "./mycorner/a-cabin-with-a-purpose.js";
import { THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE } from "./yahuh/the-newspaper-that-found-people-on-the-moon.js";
import { THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE } from "./viewtube/the-sky-becomes-a-streak-of-fire.js";
import { ENDGAME_PASSAGES } from "./endgame/final-incident-passages.js";

const SELECTABLE_AVAILABILITY = new Set(["approved", "prototype"]);
const APPROVED_REVIEW_FIELDS = Object.freeze([
  "accessibility",
  "comprehension",
  "editorial",
  "factual",
  "grade",
  "profile",
  "rights",
  "sensitivity",
  "transcription",
]);
const PROTOTYPE_REVIEW_FIELDS = Object.freeze([
  "factual",
  "grade",
  "sensitivity",
  "transcription",
]);

export const PASSAGE_CATALOG = Object.freeze([
  PHOTOSYNTHESIS_PASSAGE,
  WHY_DISAGREEMENT_MATTERS_PASSAGE,
  ...THREADIT_FIRST_RUN_PASSAGES,
  A_SECOND_READING_PASSAGE,
  A_MAP_IS_NOT_A_PHOTOGRAPH_PASSAGE,
  A_CABIN_WITH_A_PURPOSE_PASSAGE,
  THE_NEWSPAPER_THAT_FOUND_PEOPLE_ON_THE_MOON_PASSAGE,
  THE_SKY_BECOMES_A_STREAK_OF_FIRE_PASSAGE,
  ...ENDGAME_PASSAGES,
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

function hasRequiredReviewState(passage) {
  const review = passage?.review ?? {};
  if (passage?.availability === "prototype") {
    return PROTOTYPE_REVIEW_FIELDS.every((field) => ["prototype", "passed"].includes(review[field]));
  }
  if (passage?.availability !== "approved") return false;
  if (!APPROVED_REVIEW_FIELDS.every((field) => review[field] === "passed")) return false;
  const sourceBasis = `${passage?.source?.basis ?? ""} ${passage?.source?.sourceType ?? ""}`;
  if (/adaptation/u.test(sourceBasis) && review.adaptationFidelity !== "passed") return false;
  return passage?.transcriptionReview?.tested === true;
}

function hasConcreteFrozenRevision(value, text) {
  if (!text(value)) return false;
  return !/(?:^|[-_\s])(pending|placeholder|unresolved|tbd|todo)(?:$|[-_\s])/iu.test(value);
}

function hasRequiredSourceAndRights(passage, text) {
  const source = passage?.source ?? {};
  const rights = passage?.rights ?? {};
  const common = text(source.domain)
    && text(source.sourceType)
    && text(rights.basis)
    && text(rights.creditLine)
    && text(rights.verifiedOn);
  if (!common) return false;

  if (rights.basis === "original") return true;

  const adaptedSource = text(source.attribution)
    && text(source.sourceUrl)
    && text(source.modificationNotice);
  if (!adaptedSource) return false;

  if (rights.basis === "license") {
    const revision = source.reviewedRevisionUrl ?? source.frozenRevision;
    return text(rights.licenseId)
      && text(rights.licenseUrl)
      && (passage.availability !== "approved" || hasConcreteFrozenRevision(revision, text));
  }

  if (rights.basis === "public-domain") {
    return text(rights.evidenceUrl)
      && text(rights.permissionUrl)
      && text(rights.jurisdiction)
      && (passage.availability !== "approved" || hasConcreteFrozenRevision(source.frozenRevision, text));
  }

  return false;
}

export function isSelectablePassage(passage) {
  const choices = passage?.comprehension?.choices;
  const checkpoint = passage?.profile?.checkpoint;
  const endDetection = passage?.profile?.endDetection;
  const guide = passage?.profile?.guide;
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
    && hasRequiredSourceAndRights(passage, text)
    && hasRequiredReviewState(passage),
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
