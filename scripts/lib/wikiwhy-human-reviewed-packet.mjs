import { createHash } from "node:crypto";

import { derivePassageDisplayLines } from "../../reading-companion/passage-display-lines.js";

export const WIKIWHY_HUMAN_REVIEWED_PACKET_SHA256 = "95e3bee0c555566229202fe36ad71768e65ffd1844b87562b0b20898b6980153";

function collapse(value) {
  return String(value ?? "").replace(/-\n\s*/gu, "-").replace(/\n\s*/gu, " ").replace(/\s+/gu, " ").trim();
}

function plainInline(value) {
  return collapse(value)
    .replace(/\[([^\]]+)\]\([^\)]+\)/gu, "$1")
    .replace(/\*\*([^*]+)\*\*/gu, "$1")
    .replace(/\*([^*]+)\*/gu, "$1");
}

function quotedPhrase(value) {
  return plainInline(value).replace(/^[“"]|[”"]$/gu, "");
}

function quoteBlocks(value) {
  const blocks = [];
  let current = [];
  for (const line of value.split("\n")) {
    if (!line.startsWith(">")) continue;
    const content = line.replace(/^> ?/u, "");
    if (!content.trim()) {
      if (current.length) blocks.push(current.join(" "));
      current = [];
      continue;
    }
    current.push(content.trim());
  }
  if (current.length) blocks.push(current.join(" "));
  return blocks;
}

function presentationFor(block, blockIndex) {
  const transition = /^\*(?!\*)([\s\S]+)\*$/u.test(block);
  const speakerMatch = block.match(/^\*\*([^*]+):\*\*\s*/u);
  const sourceIntroduction = blockIndex === 0
    || /^(?:First|Next), an excerpt from\b/u.test(plainInline(block));
  return Object.freeze({
    kind: transition ? "transition" : sourceIntroduction ? "source-introduction" : speakerMatch ? "speaker" : "prose",
    speaker: speakerMatch?.[1] ?? "",
  });
}

function passageLines(blocks) {
  const displayLines = [];
  const linePresentations = [];
  blocks.forEach((block, blockIndex) => {
    const plain = plainInline(block);
    const presentation = presentationFor(block, blockIndex);
    for (const line of derivePassageDisplayLines({ paragraphs: [plain] })) {
      displayLines.push(line);
      linePresentations.push(presentation);
    }
  });
  return { displayLines, linePresentations };
}

function parseVocabulary(section) {
  const vocabularyText = section.match(/### Vocabulary\n([\s\S]*?)\n### Quick check/u)?.[1] ?? "";
  const cards = [];
  const pattern = /\d+\. \*\*([^*]+)\*\*\n\s+- \*\*(?:Secondary definition|Definition):\*\* ([\s\S]*?)\n\s+- \*\*Exact playback phrase:\*\* ([\s\S]*?)(?=\n\n\d+\. \*\*|$)/gu;
  for (const match of vocabularyText.matchAll(pattern)) {
    cards.push(Object.freeze({
      word: plainInline(match[1]),
      definition: plainInline(match[2]),
      sentence: quotedPhrase(match[3]),
      playbackPhrase: quotedPhrase(match[3]),
      properNoun: false,
    }));
  }
  return cards;
}

function parseComprehension(section) {
  const quickCheck = section.match(/### Quick check\n([\s\S]*?)$/u)?.[1] ?? "";
  const prompt = plainInline(quickCheck.match(/\*\*Exact question:\*\* ([\s\S]*?)\n\n- \*\*A/u)?.[1]);
  const correct = plainInline(quickCheck.match(/- \*\*A — Correct:\*\* ([\s\S]*?)(?=\n- \*\*B:)/u)?.[1]);
  const distractorB = plainInline(quickCheck.match(/- \*\*B:\*\* ([\s\S]*?)(?=\n- \*\*C:)/u)?.[1]);
  const distractorC = plainInline(quickCheck.match(/- \*\*C:\*\* ([\s\S]*?)$/u)?.[1]).replace(/\s+---$/u, "");
  return Object.freeze({
    prompt,
    correct,
    distractors: Object.freeze([distractorB, distractorC]),
    orderedChoices: Object.freeze([
      Object.freeze({ text: correct, correct: true }),
      Object.freeze({ text: distractorB, correct: false }),
      Object.freeze({ text: distractorC, correct: false }),
    ]),
    correctFeedback: "Yes. That answer is supported by the passage.",
    tryAgainFeedback: "Take another look at the passage, then choose again.",
  });
}

export function packetSha256(markdown) {
  return createHash("sha256").update(markdown).digest("hex");
}

export function parseWikiWhyHumanReviewedPacket(markdown) {
  const sections = [...markdown.matchAll(/(?:^|\n)## Passage (\d+): ([^\n]+)\n([\s\S]*?)(?=\n## Passage |$)/gu)];
  if (sections.length !== 10) throw new Error(`Expected ten WikiWhy passages; found ${sections.length}.`);
  return Object.freeze(sections.map((match) => {
    const number = Number(match[1]);
    const title = match[2].trim();
    const section = match[3];
    const sourceAndRights = section.match(/^\n\*\*Source and rights:\*\* ([\s\S]*?)\n\n### Exact complete spoken passage/u)?.[1] ?? "";
    const spoken = section.match(/### Exact complete spoken passage\n([\s\S]*?)\n### Vocabulary/u)?.[1] ?? "";
    const blocks = quoteBlocks(spoken);
    const paragraphs = blocks.map(plainInline);
    const { displayLines, linePresentations } = passageLines(blocks);
    return Object.freeze({
      id: `wikiwhy-${String(number).padStart(2, "0")}`,
      title,
      form: "human-reviewed public-domain reading",
      spokenWordCount: paragraphs.join(" ").split(/\s+/u).filter(Boolean).length,
      paragraphs: Object.freeze(paragraphs),
      displayLines: Object.freeze(displayLines),
      linePresentations: Object.freeze(linePresentations),
      source: Object.freeze({
        label: title,
        url: sourceAndRights.match(/https:\/\/[^)]+/u)?.[0] ?? "",
        editorialNote: sourceAndRights.trim(),
      }),
      rights: plainInline(sourceAndRights),
      selectionNote: "Frozen human-reviewed WikiWhy packet dated 2026-08-31.",
      comprehension: parseComprehension(section),
      vocabulary: Object.freeze(parseVocabulary(section)),
      reviewStatus: "human-reviewed-frozen-2026-08-31",
    });
  }));
}
