import { readFile, writeFile } from "node:fs/promises";
import { PASSAGE_CATALOG } from "../content/passage-catalog.js";
import { ENDGAME_PASSAGES } from "../content/endgame/final-incident-passages.js";

const endgameIds = new Set(ENDGAME_PASSAGES.map(({ id }) => id));
const candidates = PASSAGE_CATALOG.filter((passage) => (
  passage.availability === "candidate" && !endgameIds.has(passage.id)
));

const manifestUrl = new URL("../content/review-records/campaign.json", import.meta.url);
const existingRecords = await readFile(manifestUrl, "utf8").then(JSON.parse).catch((error) => {
  if (error?.code === "ENOENT") return [];
  throw error;
});
const existingById = new Map(existingRecords.map((record) => [record.passageId, record]));
const candidateIds = new Set(candidates.map(({ id }) => id));
const unknownIds = existingRecords.filter(({ passageId }) => !candidateIds.has(passageId));
if (unknownIds.length) throw new Error(`Unknown campaign manifest IDs: ${unknownIds.map(({ passageId }) => passageId).join(", ")}`);

const records = candidates.map((passage) => {
  const existing = existingById.get(passage.id);
  if (existing?.contentRevision === passage.contentRevision) return existing;
  const hasEvidence = existing && (
    existing.reviewedContentRevision
    || Object.keys(existing.reviews ?? {}).length
    || (existing.microphoneRuns ?? []).length
    || (existing.transcription?.tokenResolutions ?? []).length
  );
  if (hasEvidence) throw new Error(`${passage.id}: revision changed while review evidence exists; archive or reconcile it manually.`);
  return {
    passageId: passage.id,
    authorId: "game-for-finn-content-team",
    contentRevision: passage.contentRevision,
    reviewedContentRevision: null,
    reviews: {},
    microphoneRuns: [],
    transcription: { acceptedTranscriptForms: [], tokenResolutions: [] },
  };
});

if (records.length !== 82) throw new Error(`Expected 82 campaign candidate manifests, found ${records.length}.`);
if (records.some((record) => typeof record.contentRevision !== "string" || !record.contentRevision)) {
  throw new Error("Every candidate must have a contentRevision before a review manifest can be generated.");
}

await writeFile(
  manifestUrl,
  `${JSON.stringify(records, null, 2)}\n`,
  "utf8",
);
