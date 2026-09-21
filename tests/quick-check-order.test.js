import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shuffleQuickCheckChoices } from '../apps/internet-recovery/quick-check-order.js';

test('all six answer permutations are reachable without changing wording or correctness', () => {
  const choices = Object.freeze([
    Object.freeze({id:'a',text:'First answer',correct:false}),
    Object.freeze({id:'b',text:'Right answer',correct:true}),
    Object.freeze({id:'c',text:'Third answer',correct:false}),
  ]);
  const orders = new Set();
  for (const first of [0, 0.4, 0.9]) for (const second of [0, 0.9]) {
    const draws = [first, second];
    const result = shuffleQuickCheckChoices(choices, () => draws.shift());
    orders.add(result.map(choice => choice.id).join(''));
    assert.equal(result.find(choice => choice.correct), choices[1]);
    assert.equal(new Set(result).size, 3);
  }
  assert.equal(orders.size, 6);
  assert.deepEqual(choices.map(choice => choice.id), ['a','b','c']);
});

test('game randomizes on question presentation and does not reshuffle a wrong-answer retry', () => {
  const source = readFileSync(new URL('../playable-missions.js', import.meta.url), 'utf8');
  const render = source.slice(source.indexOf('function renderQuestion()'), source.indexOf('async function answerQuestion('));
  const answer = source.slice(source.indexOf('async function answerQuestion('), source.indexOf('function renderWordHelp('));
  assert.match(render, /shuffleQuickCheckChoices\(check\.choices\)/u);
  assert.doesNotMatch(answer, /shuffleQuickCheckChoices|renderQuestion\(/u);
});
