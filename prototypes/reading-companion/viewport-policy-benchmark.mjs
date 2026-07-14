import { writeFile } from "node:fs/promises";
import { createViewportTrace, lineAtReadingAnchor, reconcileManualLine } from "./viewport-policy.js";

const viewportHeight = 300;
const anchorOffset = 18;
const lines = [30, 96, 162, 228].map((offsetTop) => ({ offsetTop, height: 58 }));
const oldMaximumScrollTop = Math.max(0, lines.at(-1).offsetTop + lines.at(-1).height - viewportHeight);
const oldCentered = lines.map((line) => ({
  lineOffsetTop: line.offsetTop,
  topInViewport: line.offsetTop - Math.max(0, Math.min(oldMaximumScrollTop, line.offsetTop - (viewportHeight / 2) + (line.height / 2))),
}));
const topAnchored = createViewportTrace({ anchorOffset, lines, viewportHeight });
const manualTopLine = lineAtReadingAnchor({ anchorOffset, lines, scrollTop: 150 });
const result = {
  generatedAt: "2026-07-13",
  scenario: { anchorOffset, lineCount: lines.length, viewportHeight },
  oldCenteredWithoutTailSpace: oldCentered,
  topAnchoredWithTailSpace: topAnchored,
  manualForwardScroll: {
    confirmedSpeechLineIndex: 0,
    viewportLineAtAnchor: manualTopLine,
    visibleLineIndex: reconcileManualLine({ currentVisibleLineIndex: 0, lineAtAnchor: manualTopLine }),
    scoringPositionChanged: false,
  },
};

await writeFile(new URL("./viewport-policy-benchmark-2026-07-13.json", import.meta.url), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
