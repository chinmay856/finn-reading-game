import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { ENDGAME_PASSAGES } from "../content/endgame/final-incident-passages.js";
import { assessPassageReviewEvidence } from "../content/review-evidence.js";

const recordPath = new URL("../content/review-records/endgame.json", import.meta.url);
const records = JSON.parse(await readFile(recordPath, "utf8"));
const recordsById = new Map(records.map((record) => [record.passageId, record]));
let approvedCount = 0;

for (const passage of ENDGAME_PASSAGES) {
  const assessment = assessPassageReviewEvidence(passage, recordsById.get(passage.id));
  if (assessment.approved) approvedCount += 1;
  const label = assessment.approved ? "APPROVED" : "BLOCKED";
  console.log(`${label} ${passage.id} (${passage.contentRevision})`);
  for (const blocker of assessment.blockers) console.log(`  - ${blocker}`);
}

const missingRecords = records.filter(({ passageId }) => !ENDGAME_PASSAGES.some(({ id }) => id === passageId));
if (missingRecords.length) {
  console.error(`Unknown review record IDs: ${missingRecords.map(({ passageId }) => passageId).join(", ")}`);
  process.exitCode = 1;
}

console.log(`\n${approvedCount}/${ENDGAME_PASSAGES.length} final-incident passages approved.`);
console.log(`Manifest: ${fileURLToPath(recordPath)}`);
