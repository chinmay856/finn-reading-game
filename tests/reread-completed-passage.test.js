import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createMissionSequenceState, acceptMissionReading, recordMissionComprehension, acknowledgeMissionMidpoint, retryMissionPassage } from '../apps/internet-recovery/mission-sequence-state.js';
const source = readFileSync('playable-missions.js', 'utf8');
const retry = source.slice(source.indexOf('async function retryReading()'), source.indexOf('async function skipReading()'));
const complete = (s, id) => recordMissionComprehension(acceptMissionReading(s, {passageId:id}).state, {passageId:id, correct:true}).state;
for (const position of [1, 2, 4]) test(`reread preserves the completed passage and earned progress at position ${position}`, async () => {
  let state = createMissionSequenceState({phaseOneCount:2,totalPassages:4});
  for(let n=1;n<=position;n++) {
    if(state.phase==='midpoint-required') state=acknowledgeMissionMidpoint(state).state;
    state=complete(state, 'p'+n);
  }
  let shown;
  const context = vm.createContext({sequence:state, displayedPassageIndex:position-1, result:{},
    passage:()=>({id:'p'+position}), retryMissionPassage, saveMissionProgress(){},
    renderPassage:index=>{shown=index;}, setTechno(){}});
  await vm.runInContext(retry+'\nretryReading()', context);
  assert.equal(shown, position-1);
  assert.equal(context.sequence.index, position);
  assert.equal(context.sequence.phase, state.phase);
  assert.deepEqual(context.sequence.completedPassageIds,state.completedPassageIds);
  const repeat = recordMissionComprehension(context.sequence,{passageId:'p'+position,correct:true});
  assert.equal(repeat.duplicate,true);
  assert.equal(repeat.state.index,position);
});
