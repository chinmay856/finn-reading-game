import fixture from './apps/internet-recovery/onboarding-content.js';
const embedded = window.parent !== window;
if (embedded) document.documentElement.dataset.embedded = 'true';
const $=id=>document.getElementById(id);
const STORE='internet-recovery-onboarding-preview-v1';
const STEPS=[
 {title:"Choose a website to recover",text:"We’ll use WikiWhy for this example. Just click Continue to look around.",note:"You don’t need to read aloud yet.",screen:'launcher',target:'#site-wikiwhy',side:'right'},
 {title:"Look at what AUTO changed",text:"The website on the left shows what needs repairing. Look for strange claims, missing information, and red warnings.",screen:'ready',rect:[106,18,810,824],side:'right'},
 {title:"A confident claim isn’t proof",text:"“USER FACTS ARE ALWAYS RIGHT.” That’s AUTO’s rule here. Keep an eye on this red banner—we’ll come back to it after one passage.",screen:'ready',rect:[239,226,450,48],side:'right'},
 {title:"Start with a real source",text:"Read the source introduction and passage aloud. Reading original works builds knowledge and helps you practice thinking for yourself.",screen:'ready',target:'#passage',side:'left'},
 {title:"Start when you’re ready",text:"Click Start reading when you’re ready to begin. Read clearly and loudly at your own pace.",note:"For this tutorial, just click Continue.",screen:'ready',target:'#startReading',side:'left'},
 {title:"Follow the highlight",text:"The tan highlight follows the words the game hears. The bar below tracks your place. Keep reading naturally, even if the guide takes a moment to catch up.",note:"You can always scroll up and down if the guide isn’t moving fast enough.",screen:'reading',target:'#passage p.active',side:'left'},
 {title:"Finish the passage",text:"Read all the way to the end. The game should finish automatically after you stop speaking, or you can click Finish now.",screen:'finish',target:'#finishReading',side:'left'},
 {title:"See how your reading went",text:"Here’s an example result. Coverage describes how many of the words the game recognized. Pace estimates reading speed. These are meant to be helpful feedback, not a pass-or-fail grade.",note:"Retrying is always optional.",screen:'result',target:'.score-grid',side:'left'},
 {title:"Check what you read",text:"Choose the answer supported by the passage. If it isn’t right, you can try again.",screen:'result',target:'.quick-check',side:'left'},
 {title:"Your reading starts the repair",text:"Remember that banner from before? “USER FACTS ARE ALWAYS RIGHT” has now become “CLAIM UNDER REVIEW.” The passage you read and its Quick Check made a repair.",note:"WikiWhy still needs more work, though.",screen:'answered',rect:[239,226,450,48],side:'right'},
 {title:"A little help with tricky words",text:"Words to Know picks out vocabulary from the passage. Hear aloud plays the word, its meaning, and how it was used in a sentence. You can use this to help learn tricky vocabulary after each reading.",screen:'answered',target:'#wordHelp',side:'left'},
 {title:"Keep reading. Keep repairing",text:"Next passage continues the website’s recovery. Each passage and Quick Check repairs another part of the corrupted website. At the end, you’ll teach AUTO what went wrong.",screen:'answered',target:'#nextPassage',side:'left'},
 {title:"Need a reminder?",text:"You can replay the tutorial anytime. Open the Start menu and choose Tutorial.",screen:'launcher',target:'#replayTutorial',side:'right',menu:true,button:'Start game'}
];
let mode='launcher',index=0,chainTutorial=false;
let seen={};try{seen=JSON.parse(localStorage.getItem(STORE)||'{}');}catch{}
function remember(key){seen[key]=true;try{localStorage.setItem(STORE,JSON.stringify(seen));}catch{}}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}
function renderLauncher(){
 $('launcherView').hidden=false;$('missionView').hidden=true;$('technoPet').dataset.place='launcher';
 $('siteGrid').replaceChildren(...fixture.sites.map(site=>{
 const card=el('a','launcher-site playable');card.id='site-'+site.id;card.href='#tutorial';
 card.setAttribute('aria-label',`${site.name} — open guided tour`);
 const img=el('img','preview');img.src=site.frame;img.alt='';
 const copy=el('div','card-copy'),heading=el('div','site-heading'),mark=el('img');mark.src=site.mark;mark.alt='';
 const ring=el('span','recovery-indicator');ring.style.setProperty('--recovery-fill','0%');ring.setAttribute('aria-label','Recovery not started');
 heading.append(mark,el('h3','',site.name),ring);copy.append(heading,el('p','',site.description),el('span','case-status','OPEN CORRUPTED WEBSITE'));card.append(img,copy);
 card.addEventListener('click',e=>{e.preventDefault();startTutorial();});return card;
 }));
}
function renderPassage(screen){
 const p=fixture.passage;
 $('companionTitle').textContent=p.title;
 $('passage').replaceChildren(...p.lines.map((line,i)=>{const n=el('p',(p.linePresentations?.[i]?.kind==='source-introduction'||!p.linePresentations?.length&&i<p.sourceIntroductionLineCount)?'source-introduction':'',line);if(i===0)n.dataset.sourceStart='true';return n;}));
 const active=screen==='reading'?Math.max(0,p.lines.findIndex((_,i)=>p.linePresentations?.[i]?.kind==='prose')):screen==='finish'?p.lines.length-1:-1;
 if(active>=0){const lines=$('passage').children;for(let i=0;i<active;i++)lines[i].classList.add('past');lines[active].classList.add('active');}
 const progress=screen==='reading'?14:screen==='finish'?100:0;
 $('guideProgressFill').style.width=progress+'%';$('guideProgressFill').parentElement.setAttribute('aria-valuenow',progress);
 $('readerStatus').textContent=screen==='reading'?'Listening. Keep reading naturally.':screen==='finish'?'You’ve reached the end of the passage.':'Ready when you are.';
 $('modelPanel').hidden=true;$('prepareModels').hidden=true;
 $('startReading').disabled=screen!=='ready';$('finishReading').disabled=!['reading','finish'].includes(screen);
 $('passage').scrollTop=0;
 if(screen==='finish')$('passage').scrollTop=$('passage').scrollHeight;
 if(screen==='reading'){const line=$('passage').children[active];$('passage').scrollTop=Math.max(0,line.offsetTop-$('passage').offsetTop-18);}
}
function renderResult(answered){
 $('resultTitle').textContent='Reading confirmed';$('resultDetail').textContent='The final local voice check found strong evidence across the passage.';
 $('resultView').querySelector('.companion-kicker span').textContent='EXAMPLE · READING COMPLETE';
 for(const [name,value] of Object.entries(fixture.result)){ $(name+'Band').textContent=value.band;$(name+'Detail').textContent=value.detail; }
 const check=fixture.passage.comprehension;$('question').textContent=check.question;
 $('answers').replaceChildren(...check.choices.map(choice=>{const b=el('button',answered&&choice.correct?'correct':'',choice.text);b.type='button';b.disabled=answered;return b;}));
 $('answerFeedback').textContent=answered?check.correctFeedback:'Choose the answer best supported by the passage.';
 $('wordHelp').hidden=false;$('wordCards').replaceChildren(...fixture.passage.challengingWords.map(w=>{const c=el('article');c.append(el('h3','',w.word),el('button','','▶ Hear aloud'));return c;}));
 $('wordAudioStatus').textContent='';$('nextPassage').disabled=!answered;
}
function renderMission(screen){
 $('launcherView').hidden=true;$('missionView').hidden=false;$('missionView').dataset.demo='true';$('missionTask').textContent='▣ WikiWhy';$('technoPet').dataset.place='left';
 const result=['result','answered'].includes(screen);
 for(const id of ['readerView','resultView','skipView','reflectionView','receiptView'])$(id).hidden=id!==(result?'resultView':'readerView');
 $('siteFrame').src=screen==='answered'?fixture.frames.after:fixture.frames.before;
 $('siteFrame').alt=screen==='answered'?'WikiWhy after one repair. The banner now says CLAIM UNDER REVIEW.':'Corrupted WikiWhy. The red banner says USER FACTS ARE ALWAYS RIGHT.';
 if(result)renderResult(screen==='answered');else renderPassage(screen);
}
function setInert(on){$('launcherView').inert=on;$('missionView').inert=on;}
function closeMenu(){$('startMenu').hidden=true;$('startMenu').inert=false;document.querySelectorAll('.start-button').forEach(b=>b.setAttribute('aria-expanded','false'));}
function portrait(key){const p=fixture.portraits[key],tile=$('introductionSpeaker');tile.replaceChildren();tile.style.setProperty('--portrait-position',p.position);tile.style.setProperty('--portrait-size',p.size);tile.style.setProperty('--portrait-image',`url('${p.image}')`);}
function renderIntro(){
 renderLauncher();setInert(true);$('gameIntroduction').hidden=false;$('tourLayer').hidden=true;$('skipSequence').hidden=false;$('skipSequence').textContent='Skip intro';
 const b=fixture.intro[index];portrait(b.portrait);$('gameIntroduction').querySelector('article').dataset.speaker=b.who.toLowerCase();
 $('introductionLabel').textContent=b.who;$('introductionHeading').textContent=b.title.toUpperCase();$('introductionText').textContent=b.body;
 $('introductionContinue').textContent=b.button;
 $('introductionContinue').focus();
}
function getTarget(step){
 if(step.rect)return {x:step.rect[0],y:step.rect[1],width:step.rect[2],height:step.rect[3]};
 const n=document.querySelector(step.target),r=n.getBoundingClientRect(),s=$('gameStage').getBoundingClientRect(),scale=s.width/1440;
 return {x:(r.left-s.left)/scale-5,y:(r.top-s.top)/scale-5,width:r.width/scale+10,height:r.height/scale+10};
}
function positionTour(){
 if(mode!=='tutorial')return;
 const step=STEPS[index],r=getTarget(step),cut=$('spotCutout'),ring=$('spotRing'),dialog=$('tourDialog');
 for(const key of ['x','y','width','height'])cut.setAttribute(key,r[key]);
 Object.assign(ring.style,{left:r.x+'px',top:r.y+'px',width:r.width+'px',height:r.height+'px'});
 const right=step.side==='right';const x=right?(step.screen==='launcher'?565:945):325;
 const y=Math.max(85,Math.min(r.y-24,760-dialog.offsetHeight));
 Object.assign(dialog.style,{left:x+'px',top:y+'px'});dialog.dataset.side=step.side;
}
function renderTutorial(){
 closeMenu();const step=STEPS[index];step.screen==='launcher'?renderLauncher():renderMission(step.screen);
 if(step.menu){$('startMenu').hidden=false;$('startMenu').inert=true;document.querySelector('#launcherView .start-button').setAttribute('aria-expanded','true');}
 setInert(true);$('gameIntroduction').hidden=true;$('tourLayer').hidden=false;$('skipSequence').hidden=false;$('skipSequence').textContent='Skip tutorial';
 $('tourTitle').textContent=step.title;$('tourText').textContent=step.text;$('tourNote').textContent=step.note||'';$('tourNote').hidden=!step.note;$('tourCount').textContent=`${index+1} OF ${STEPS.length}`;$('tourBack').disabled=index===0;$('tourNext').textContent=step.button||'Continue';
 const context=step.rect ? (index===2?'Banner: USER FACTS ARE ALWAYS RIGHT.':step.screen==='answered'?'Banner: CLAIM UNDER REVIEW.':'WikiWhy shows a claim about dogs seeing only black and white, missing sources, and hidden history.') : step.target==='#passage' ? fixture.passage.lines.slice(0,2).join(' ') : document.querySelector(step.target).textContent;
 $('tourContext').textContent=context;positionTour();$('tourNext').focus();
}
function showLauncher(){if(embedded){window.parent.postMessage({type:'recovery-onboarding-complete'},location.origin);return;}mode='launcher';closeMenu();$('gameIntroduction').hidden=true;$('tourLayer').hidden=true;$('skipSequence').hidden=true;setInert(false);renderLauncher();$('site-wikiwhy').focus();}
function startIntro(chain=false){closeMenu();mode='intro';index=0;chainTutorial=chain;renderIntro();}
function startTutorial(){closeMenu();mode='tutorial';index=0;renderTutorial();}
function finishIntro(){if(embedded)window.parent.postMessage({type:'recovery-intro-complete'},location.origin);else remember('introSeen');chainTutorial?startTutorial():showLauncher();}
function finishTutorial(){if(embedded)window.parent.postMessage({type:'recovery-tutorial-complete'},location.origin);else remember('tutorialSeen');showLauncher();}
$('introductionContinue').onclick=()=>{if(index<7){index++;renderIntro();}else {chainTutorial=true;finishIntro();}};
$('tourNext').onclick=()=>{if(index<STEPS.length-1){index++;renderTutorial();}else finishTutorial();};
$('tourBack').onclick=()=>{if(index>0){index--;renderTutorial();}};
$('skipSequence').onclick=()=>mode==='intro'?finishIntro():finishTutorial();
$('replayIntroduction').onclick=()=>startIntro(false);$('replayTutorial').onclick=startTutorial;$('returnBrowser').onclick=showLauncher;$('closeMenu').onclick=closeMenu;
for(const b of document.querySelectorAll('.start-button')){b.setAttribute('aria-controls','startMenu');b.onclick=()=>{$('startMenu').hidden=!$('startMenu').hidden;b.setAttribute('aria-expanded',!$('startMenu').hidden);if(!$('startMenu').hidden)$('returnBrowser').focus();};}
for(const a of document.querySelectorAll('[data-open-launcher]'))a.onclick=e=>{e.preventDefault();showLauncher();};
for(const b of document.querySelectorAll('[data-open-documents]')){const span=el('span','desktop-shortcut');span.innerHTML=b.innerHTML;b.replaceWith(span);}
// Keep keyboard focus on the narrated controls; all demo surfaces are inert.
document.addEventListener('pointerdown',()=>delete document.documentElement.dataset.keyboard,true);
document.addEventListener('keydown',e=>{
 if(e.key==='Tab')document.documentElement.dataset.keyboard='true';
 if(e.key==='Escape'){if(mode==='tutorial'){finishTutorial();return;}if(!$('startMenu').hidden){closeMenu();document.querySelector('#launcherView .start-button').focus();}else if(mode==='intro')finishIntro();else if(mode==='tutorial')finishTutorial();return;}
 const scope=mode==='intro'?$('gameIntroduction'):mode==='tutorial'?$('tourDialog'):!$('startMenu').hidden?$('startMenu'):null;
 if(e.key!=='Tab'||!scope)return;
 const list=[...scope.querySelectorAll('button:not(:disabled)')];if(mode!=='launcher')list.push($('skipSequence'));
 const i=list.indexOf(document.activeElement);e.preventDefault();list[(i+(e.shiftKey?-1:1)+list.length)%list.length].focus();
});
function resize(){const s=$('stageScaler');const scale=Math.max(.1,Math.min((s.clientWidth-16)/1440,(s.clientHeight-16)/900));$('gameStage').style.transform=`translate(-50%,-50%) scale(${scale})`;positionTour();}
new ResizeObserver(resize).observe($('stageScaler'));resize();
// Hold the artwork in this document so later steps cannot lose images if
// the local preview server stops between clicks. Validate decoding up front.
async function prepareArtwork(){
 const owners=[...Object.values(fixture.portraits).map(p=>[p,'image']),...fixture.sites.flatMap(s=>[[s,'frame'],[s,'mark']]),[fixture.frames,'before'],[fixture.frames,'after']];
 const urls=new Map();
 await Promise.all(owners.map(async([owner,key])=>{
  const source=owner[key];
  if(!urls.has(source))urls.set(source,(async()=>{
   const response=await fetch(source);if(!response.ok)throw new Error('Artwork unavailable');
   const url=URL.createObjectURL(await response.blob());
   const image=new Image();image.src=url;await image.decode();return url;
  })());
  owner[key]=await urls.get(source);
 }));
}
const loading=document.createElement('section');loading.className='artwork-loading';
loading.setAttribute('role','status');loading.textContent='Opening recovery desktop…';$('gameStage').append(loading);
try{await prepareArtwork();await $('tutorialAmy').decode();loading.remove();}catch{
 loading.textContent='The artwork couldn’t load. Reconnect to the preview and try again.';
 const retry=el('button','','Try again');retry.onclick=()=>location.reload();loading.append(retry);
 throw new Error('Onboarding artwork could not be loaded.');
}
const entry=new URLSearchParams(location.search);
if(entry.has('intro'))startIntro(entry.get('chain')!=='false');else if(entry.has('tutorial'))startTutorial();else if(!seen.introSeen)startIntro(true);else if(!seen.tutorialSeen)startTutorial();else showLauncher();
