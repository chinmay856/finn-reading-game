export const DEFAULT_READING_ANCHOR_PX = 18;

export function requiredTailSpace({ anchorOffset = DEFAULT_READING_ANCHOR_PX, bottomPadding = 0, lastLineHeight, viewportHeight }) {
  return Math.max(0, Math.ceil(viewportHeight - anchorOffset - lastLineHeight - bottomPadding));
}

export function anchoredScrollTop({ anchorOffset = DEFAULT_READING_ANCHOR_PX, lineOffsetTop, maximumScrollTop }) {
  return Math.round(Math.max(0, Math.min(maximumScrollTop, lineOffsetTop - anchorOffset)));
}

export function lineAtReadingAnchor({ anchorOffset = DEFAULT_READING_ANCHOR_PX, lines, scrollTop }) {
  if (!lines.length) return 0;
  const anchor = scrollTop + anchorOffset;
  const found = lines.findIndex(({ height, offsetTop }) => offsetTop + height > anchor);
  return found < 0 ? lines.length - 1 : found;
}

export function reconcileManualLine({ currentVisibleLineIndex, lineAtAnchor }) {
  return Math.max(0, currentVisibleLineIndex, lineAtAnchor);
}

export function createViewportTrace({ anchorOffset = DEFAULT_READING_ANCHOR_PX, lines, viewportHeight }) {
  const lastLine = lines.at(-1) ?? { height: 0, offsetTop: 0 };
  const tailSpace = requiredTailSpace({ anchorOffset, lastLineHeight: lastLine.height, viewportHeight });
  const scrollHeight = lastLine.offsetTop + lastLine.height + tailSpace;
  const maximumScrollTop = Math.max(0, scrollHeight - viewportHeight);
  return Object.freeze(lines.map((line, lineIndex) => {
    const scrollTop = anchoredScrollTop({ anchorOffset, lineOffsetTop: line.offsetTop, maximumScrollTop });
    return Object.freeze({ lineIndex, scrollTop, topInViewport: line.offsetTop - scrollTop });
  }));
}
