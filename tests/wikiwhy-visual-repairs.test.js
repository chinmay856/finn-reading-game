import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PLAYABLE_WALKTHROUGHS } from '../apps/internet-recovery/playable-walkthroughs.js';
const svg = readFileSync('docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg','utf8');
const pages = [...svg.matchAll(/<g id="page-([^\"]+)"([\s\S]*?)(?=<g id="page-|<\/svg>)/g)];
const regions = id => Object.fromEntries([...pages.find(p=>p[1]===id)[2].matchAll(/<g data-repair-region="([^\"]+)"[^>]*>[\s\S]*?<\/g>/g)].map(m=>[m[1],m[0]]));
const order = ['banner','headline','explanation','vision','sources','history'];
test('each first-phase region changes exactly once to its final green state',()=>{
 const final=regions('repair-6'); let previous=regions('initial');
 for(let i=1;i<=6;i++){
  const current=regions(`repair-${i}`);
  for(const key of order){
   if(key===order[i-1]) {assert.notEqual(current[key],previous[key]);assert.equal(current[key],final[key]);assert.match(current[key],/data-repaired="true"/);}
   else assert.equal(current[key],previous[key],`${key} unexpectedly changed at ${i}`);
  }
  previous=current;
 }
});
test('source and history locks visibly repair their regions and final article matches the first recovery',()=>{
 const over=regions('super-corrupt'), one=regions('lock-1'),two=regions('lock-2'),final=regions('repair-6');
 assert.notEqual(one.sources,over.sources);assert.equal(one.sources,final.sources);
 assert.equal(one.history,over.history);assert.equal(two.history,final.history);
 assert.equal(two.explanation,over.explanation);
 assert.deepEqual(regions('lock-3'),final);
 assert.equal(PLAYABLE_WALKTHROUGHS.wikiwhy.repairFrames.length,9);
 assert.match(PLAYABLE_WALKTHROUGHS.wikiwhy.repairFrames[6],/_p13\.png/);
});

test('View source is crossed out only while sources are corrupted',()=>{
 for(const id of ['initial','repair-1','repair-4','super-corrupt','locks-open']) assert.match(regions(id)['source-tab'],/× View source/);
 for(const id of ['repair-5','repair-6','lock-1','lock-2','lock-3']) assert.doesNotMatch(regions(id)['source-tab'],/× View source/);
});

test('AUTO dog impersonation stays corrupted until the final wording repair',()=>{
 for(const id of ['super-corrupt','locks-open','lock-1','lock-2']) {
  const vision=regions(id).vision;
  assert.match(vision,/data-repaired="false"/);
  assert.match(vision,/wikiwhy-auto-dog-vision-v1.jpg/);
  assert.doesNotMatch(vision,/DOG COLOR VISION/);
 }
 assert.equal(regions('lock-3').vision,regions('repair-6').vision);
 assert.match(regions('initial').vision,/wikiwhy-techno-vision-hatch-v3.png/);
});

test('the full AUTO reveal and Amy explanation precede the checklist',()=>{
 assert.doesNotMatch(pages.find(p=>p[1]==='super-corrupt')[2],/data-overlay="act2-checklist"/);
 assert.doesNotMatch(pages.find(p=>p[1]==='amy-plan')[2],/data-overlay="act2-checklist"/);
 assert.match(pages.find(p=>p[1]==='locks-open')[2],/data-overlay="act2-checklist"/);
 assert.match(PLAYABLE_WALKTHROUGHS.wikiwhy.superFrame,/_p10\.png/);
 assert.match(PLAYABLE_WALKTHROUGHS.wikiwhy.checklistFrame,/_p12\.png/);
});
