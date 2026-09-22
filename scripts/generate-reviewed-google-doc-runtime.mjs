import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parseReviewedGoogleDoc } from './lib/reviewed-google-doc-packet.mjs';

const approval = JSON.parse(await readFile(new URL('../docs/content/human-reviewed/2026-09-20/google-docs/approval.json', import.meta.url), 'utf8'));
const records = {};
const sources = {};
for (const site of ['faceplace', 'threadit', 'mycorner', 'yahuh', 'searchish', 'amaze-on', 'viewtube', 'spotty-fi', 'mapguess']) {
  const raw = await readFile(new URL(`../docs/content/human-reviewed/2026-09-20/google-docs/${site}.json`, import.meta.url), 'utf8');
  const doc = JSON.parse(raw);

  sources[site] = { documentId: doc.documentId, revisionId: doc.revisionId, sha256: createHash('sha256').update(raw).digest('hex') };
  assert.deepEqual(sources[site], approval.sources[site], `${site}: source differs from approved snapshot`);
  records[site] = parseReviewedGoogleDoc(site, doc);
}
await writeFile(new URL('../content/reviewed-google-doc-passages.js', import.meta.url), `// Generated from the explicitly approved Google Doc snapshots.\nexport const REVIEWED_GOOGLE_DOC_SOURCES = ${JSON.stringify(sources, null, 2)};\nexport const REVIEWED_GOOGLE_DOC_PASSAGES = ${JSON.stringify(records, null, 2)};\n`);
console.log(`Generated ${Object.values(records).flat().length} approved passages with exact vocabulary and quick-check wording and correct-answer identities.`);
