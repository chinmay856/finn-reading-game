import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { PASSAGE_CATALOG } from "../content/passage-catalog.js";
import { assessPassageReviewEvidence } from "../content/review-evidence.js";

const recordPaths = [
  new URL("../content/review-records/campaign.json", import.meta.url),
  new URL("../content/review-records/endgame.json", import.meta.url),
];
const records = (await Promise.all(recordPaths.map(async (path) => JSON.parse(await readFile(path, "utf8"))))).flat();
const recordsById = new Map(records.map((record) => [record.passageId, record]));
const candidates = PASSAGE_CATALOG.filter(({ availability }) => availability === "candidate");
let approvedCount = 0;

for (const passage of candidates) {
  const assessment = assessPassageReviewEvidence(passage, recordsById.get(passage.id));
  if (assessment.approved) approvedCount += 1;
  const label = assessment.approved ? "APPROVED" : "BLOCKED";
  console.log(`${label} ${passage.id} (${passage.contentRevision})`);
  for (const blocker of assessment.blockers) console.log(`  - ${blocker}`);
}

const missingRecords = records.filter(({ passageId }) => !candidates.some(({ id }) => id === passageId));
if (missingRecords.length) {
  console.error(`Unknown review record IDs: ${missingRecords.map(({ passageId }) => passageId).join(", ")}`);
  process.exitCode = 1;
}

console.log(`\n${approvedCount}/${candidates.length} candidate passages approved.`);
for (const recordPath of recordPaths) console.log(`Manifest: ${fileURLToPath(recordPath)}`);
