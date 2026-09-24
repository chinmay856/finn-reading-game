import assert from "node:assert/strict";
import test from "node:test";

import { anchoredScrollTop, createViewportTrace, lineAtReadingAnchor, reconcileManualLine } from "./viewport-policy.js";

const lines = [
  { offsetTop: 30, height: 58 },
  { offsetTop: 96, height: 58 },
  { offsetTop: 162, height: 58 },
  { offsetTop: 228, height: 58 },
  { offsetTop: 294, height: 58 },
  { offsetTop: 360, height: 58 },
  { offsetTop: 426, height: 58 },
];

test("anchors early lines high but lets final lines settle naturally near the bottom", () => {
  const trace = createViewportTrace({ viewportHeight: 300, anchorOffset: 18, lines });
  assert.deepEqual(trace.map(({ topInViewport }) => topInViewport), [18, 18, 18, 44, 110, 176, 242]);
});

test("anchors ordinary lines near the top instead of centering them", () => {
  assert.equal(anchoredScrollTop({ lineOffsetTop: 228, anchorOffset: 18, maximumScrollTop: 500 }), 210);
});

test("manual forward scrolling advances only the visible line", () => {
  const atAnchor = lineAtReadingAnchor({ scrollTop: 150, anchorOffset: 18, lines });
  assert.equal(atAnchor, 2);
  assert.equal(reconcileManualLine({ currentVisibleLineIndex: 0, lineAtAnchor: atAnchor }), 2);
});

test("manual backward scrolling never drags a monotonic guide backward", () => {
  assert.equal(reconcileManualLine({ currentVisibleLineIndex: 3, lineAtAnchor: 1 }), 3);
});
