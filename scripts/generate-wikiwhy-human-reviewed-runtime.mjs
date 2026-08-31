import { readFile, writeFile } from "node:fs/promises";

import {
  packetSha256,
  parseWikiWhyHumanReviewedPacket,
  WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256,
} from "./lib/wikiwhy-human-reviewed-packet.mjs";

const packetUrl = new URL("../docs/content/human-reviewed/2026-08-31/wikiwhy/WIKIWHY_HUMAN_REVIEWED_PACKET.md", import.meta.url);
const outputUrl = new URL("../content/wikiwhy-human-reviewed-passages.js", import.meta.url);
const markdown = await readFile(packetUrl, "utf8");
const checksum = packetSha256(markdown);
if (checksum !== WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256) {
  throw new Error(`Frozen WikiWhy packet checksum mismatch: ${checksum}`);
}
const records = parseWikiWhyHumanReviewedPacket(markdown);
const moduleText = `// Generated exclusively from the frozen WikiWhy human-reviewed packet.\n// Run npm run generate:wikiwhy-human-reviewed after an explicitly approved packet update.\n\nconst DATA = ${JSON.stringify(records, null, 2)};\n\nfunction deepFreeze(value) {\n  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;\n  for (const child of Object.values(value)) deepFreeze(child);\n  return Object.freeze(value);\n}\n\nexport const WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 = ${JSON.stringify(checksum)};\nexport const WIKIWHY_HUMAN_REVIEWED_PASSAGES = deepFreeze(DATA);\n`;
await writeFile(outputUrl, moduleText);
console.log(`Generated ${records.length} WikiWhy records from ${checksum}.`);
