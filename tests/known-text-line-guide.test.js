import assert from "node:assert/strict";
import test from "node:test";
import { createLineLayout, KnownTextLineGuide } from "../reading-companion/known-text-line-guide.js";
import { LiveReadingCompanion } from "../reading-companion/live-reading-companion.js";

const lines = [
  "The quick brown fox jumps over the lazy dog.",
  "A second sentence follows at a comfortable pace.",
  "The final line stays visible after the reader finishes.",
];

test("creates stable content-owned word ranges", () => {
  assert.deepEqual(createLineLayout(lines).map(({ firstWordIndex, lastWordIndex }) => [firstWordIndex, lastWordIndex]), [[0, 8], [9, 16], [17, 25]]);
});

test("uses evidence plus a bounded lead at fast reading pace", () => {
  const guide = new KnownTextLineGuide({ passageId: "passage-1", lines, wordsPerMinute: 250 });
  const event = guide.observePartial("the quick brown fox jumps over the lazy dog a second");
  assert.equal(event.confirmedWordIndex, 10);
  assert.equal(event.anticipatedWordIndex, 14);
  assert.equal(event.visibleLineIndex, 1);
  assert.equal(event.type, "reading-guide-position");
});

test("recognizer revisions and restarts never move the visible line backward", () => {
  const guide = new KnownTextLineGuide({ passageId: "passage-1", lines, wordsPerMinute: 200 });
  const forward = guide.observePartial("the quick brown fox jumps over the lazy dog a second sentence follows");
  const revised = guide.observePartial("the quick brown fox");
  const restart = guide.observePartial("the quick brown fox jumps over the lazy dog");
  assert.equal(revised.visibleLineIndex, forward.visibleLineIndex);
  assert.equal(restart.visibleLineIndex, forward.visibleLineIndex);
  assert.equal(revised.confirmedWordIndex, forward.confirmedWordIndex);
});

test("silence cannot advance the guide because no transcript is observed", () => {
  const guide = new KnownTextLineGuide({ passageId: "passage-1", lines });
  const before = guide.observePartial("the quick");
  assert.equal(guide.confirmedWordIndex, before.confirmedWordIndex);
});

test("controller exposes only a neutral recognizer and guide boundary", async () => {
  let listener;
  const events = [];
  const recognizer = {
    subscribe(next) { listener = next; return () => { listener = null; }; },
    async start() {}, acceptAudio() {}, async stop() {},
  };
  const companion = new LiveReadingCompanion({ recognizer, passageId: "passage-1", lines, onGuidePosition: (event) => events.push(event) });
  await companion.start();
  listener({ text: "the quick brown fox", observedAtMs: 50 });
  await companion.stop();
  assert.equal(events.length, 1);
  assert.equal(events[0].passageId, "passage-1");
  assert.equal(Object.hasOwn(events[0], "transcript"), false);
  assert.equal(listener, null);
});
