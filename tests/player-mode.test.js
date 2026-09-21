import test from 'node:test';
import assert from 'node:assert/strict';
import { isPlaytester, gameUrl } from '../apps/internet-recovery/player-mode.js';

test('player URLs stay clean unless explicitly opened in playtester mode', () => {
  for (const query of ['', '?site=wikiwhy', '?streamingGuide=0', '?playtest=0']) assert.equal(isPlaytester(query), false);
  assert.equal(isPlaytester('?playtest=1&site=wikiwhy'), true);
});
test('playtester mode survives mission, profile, and finale navigation without losing parameters', () => {
  for (const route of ['/playable-missions.html', '/playable-missions.html?site=wikiwhy&replay=1', '/playable-missions.html?player=new', '/endgame-playtest.html?campaign=1&replay=1']) {
    const destination = new URL(gameUrl(route, true), 'https://game.invalid');
    assert.equal(destination.searchParams.get('playtest'), '1');
    for (const [key, value] of new URL(route, 'https://game.invalid').searchParams) assert.equal(destination.searchParams.get(key), value);
    assert.equal(gameUrl(destination.pathname + destination.search, false), route);
  }
});
