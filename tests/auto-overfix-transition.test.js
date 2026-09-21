import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { playAutoOverfixTransition, AUTO_OVERFIX_DURATION } from '../apps/internet-recovery/auto-overfix-transition.js';

for (const reduced of [false, true]) test(`overfix awaits reveal and restores controls (reduced motion: ${reduced})`, async t => {
  const originals = { document: globalThis.document, Image: globalThis.Image, matchMedia: globalThis.matchMedia };
  t.after(() => Object.assign(globalThis, originals));
  const animations = [];
  class Node {
    constructor() { this.inert = false; this.children = []; this.classList = { add() {} }; }
    setAttribute() {}
    append(...nodes) { this.children.push(...nodes); }
    querySelector() { return new Node(); }
    decode() { return Promise.resolve(); }
    remove() { this.removed = true; }
    animate(frames, options) {
      let finish;
      const animation = {frames, options, finished: new Promise(resolve => { finish = resolve; }), finish: () => finish(), cancel() { this.cancelled = true; }};
      animations.push(animation); return animation;
    }
  }
  globalThis.document = {createElement: () => new Node()}; globalThis.Image = Node;
  globalThis.matchMedia = () => ({matches: reduced});
  const stage = new Node(), active = new Node(), inert = new Node(); inert.inert = true;
  stage.append(active, inert);
  stage.querySelectorAll = () => [active];
  let complete = false;
  const pending = playAutoOverfixTransition({stage, source:'/overfix.png', siteName:'WikiWhy'}).then(() => { complete = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(active.inert, true); assert.equal(complete, false);
  assert.equal(AUTO_OVERFIX_DURATION, 5000);
  assert.equal(animations.length, reduced ? 1 : 2);
  assert.ok(animations.every(animation => animation.options.duration === 5000));
  if (reduced) assert.deepEqual(animations[0].frames, [{opacity:0}, {opacity:1}]);
  else assert.deepEqual(animations[0].frames, [{height:'0px'}, {height:'825px'}]);
  for (const animation of animations) animation.finish();
  await pending;
  assert.equal(active.inert, false); assert.equal(inert.inert, true);
  assert.equal(stage.children.at(-1).removed, true);
});

test('shared midpoint completes AUTO animation before reaction and repair checklist', () => {
  const source = readFileSync(new URL('../playable-missions.js', import.meta.url), 'utf8');
  const midpoint = source.slice(source.indexOf('async function runMidpoint()'), source.indexOf('function showReflection()'));
  assert.ok(midpoint.indexOf('await playAutoOverfixTransition(') < midpoint.indexOf('await showCorruptionPause()'));
  assert.ok(midpoint.indexOf('await showCorruptionPause()') < midpoint.indexOf('setFrame(mission.checklistFrame'));
});
