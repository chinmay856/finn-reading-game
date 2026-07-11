"use strict";
const LINES=[
  "When Mary Lennox was sent to Misselthwaite Manor to live with her uncle, everybody said she was the most disagreeable-looking child ever seen.",
  "She had a little thin face and a little thin body, thin light hair and a sour expression.",
  "But the fresh air, the moor, and the mystery of the locked garden slowly began to change her.",
  "Before long, Mary discovered that caring for the garden also taught her how to care for other people."
];
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const $=id=>document.getElementById(id);
const S={line:0,min:85,max:150,goal:85,rec:null,listening:false,checking:false,finalText:"",interim:"",start:0,first:0,last:0,tries:Array(LINES.length).fill(0),results:[],pending:null,timer:null};
const screens=["setup","read","review"];
function words(s){return s.toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9'-]+/g," ").trim().split(/\s+/).filter(Boolean)}
function esc(s){return s.replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function diff(a,b){
  const n=a.length,m=b.length,d=Array.from({length:n+1},()=>Array(m+1).fill(0)),op=Array.from({length:n+1},()=>Array(m+1));
  for(let i=1;i<=n;i++){d[i][0]=i;op[i][0]="del"}for(let j=1;j<=m;j++){d[0][j]=j;op[0][j]="ins"}
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){const same=a[i-1]===b[j-1],c=[[d[i-1][j-1]+(same?0:1),same?"ok":"sub"],[d[i-1][j]+1,"del"],[d[i][j-1]+1,"ins"]].sort((x,y)=>x[0]-y[0])[0];d[i][j]=c[0];op[i][j]=c[1]}
  let i=n,j=m,match=0,miss=[],status=Array(n).fill("bad");
  while(i||j){const o=op[i][j];if(o==="ok"){match++;status[i-1]="ok";i--;j--}else if(o==="sub"){miss.push(a[i-1]);i--;j--}else if(o==="del"){miss.push(a[i-1]);i--}else j--}
  return{match,miss:[...new Set(miss.reverse())],status,accuracy:Math.round(match/Math.max(n,m,1)*100)}
}
function transcript(){return[S.finalText,S.interim].filter(Boolean).join(" ").trim()}
function pace(wpm){if(!wpm)return["—",""];if(wpm<S.min)return["Too slow","warn"];if(wpm>S.max)return["Too fast","warn"];return["On target","good"]}
function metrics(){const spoken=words(transcript()),target=words(LINES[S.line]),cmp=diff(target,spoken),from=S.first||S.start||Date.now(),to=S.last||Date.now(),mins=Math.max((to-from)/60000,.03);return{spoken,target,cmp,wpm:Math.round(spoken.length/mins)}}
function aggregate(include=true){const r=[...S.results];if(include&&transcript()){const m=metrics();r.push({correct:m.cmp.match,total:m.target.length,wpm:m.wpm})}const total=r.reduce((a,x)=>a+x.total,0),correct=r.reduce((a,x)=>a+x.correct,0),speeds=r.map(x=>x.wpm).filter(Boolean);return{accuracy:total?Math.round(correct/total*100):0,correct,wpm:speeds.length?Math.round(speeds.reduce((a,b)=>a+b,0)/speeds.length):0}}
function show(name){screens.forEach(x=>$(x).classList.toggle("on",x===name));document.querySelectorAll(".steps span").forEach(x=>x.classList.toggle("on",x.dataset.step===name))}
function notice(t=""){$("notice").textContent=t;$("notice").hidden=!t}
function render(status=[]){$("passage").innerHTML=LINES.map((line,i)=>{let k=0;const text=line.split(/(\s+)/).map(t=>/^\s+$/.test(t)||i!==S.line?esc(t):`<span class="word ${status[k++]||""}">${esc(t)}</span>`).join("");return`<div class="line ${i<S.line?"done":""} ${i===S.line?"active":""}">${text}</div>`}).join("")}
function partial(){const sp=words(transcript()),tar=words(LINES[S.line]),st=Array(tar.length).fill("");for(let i=0;i<Math.min(sp.length,tar.length);i++)st[i]=sp[i]===tar[i]?"ok":"bad";if(sp.length<tar.length)st[sp.length]="now";return st}
function live(){const a=aggregate(true),m=transcript()?metrics():{wpm:0},p=pace(m.wpm);$("accuracy").textContent=a.accuracy?`${a.accuracy}%`:"—";$("speed").textContent=m.wpm?`${m.wpm} WPM`:"—";$("pace").textContent=p[0];$("pace").className=p[1];$("correct").textContent=a.correct}
function state(t,cls=""){$("state").textContent=t;$("state").className=`pill ${cls}`}
function clearTimer(){clearTimeout(S.timer);S.timer=null}
function recognition(){
  const r=new SR();r.lang="en-US";r.continuous=false;r.interimResults=true;r.maxAlternatives=1;
  r.onstart=()=>{S.listening=true;S.start=Date.now();S.first=0;state("Listening","live");$("listen").textContent="Stop listening";$("check").disabled=false;notice("")};
  r.onresult=e=>{let f="",x="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript.trim();e.results[i].isFinal?f+=t+" ":x+=t+" "}if(f.trim())S.finalText=[S.finalText,f.trim()].filter(Boolean).join(" ");S.interim=x.trim();if(!S.first&&transcript())S.first=Date.now();S.last=Date.now();$("heard").textContent=transcript()||"—";render(partial());live();clearTimer();if(words(transcript()).length>=Math.max(4,Math.floor(words(LINES[S.line]).length*.65)))S.timer=setTimeout(()=>check(false),1600)};
  r.onerror=e=>{if(e.error!=="aborted")notice(e.error==="not-allowed"?"Microphone or speech recognition was blocked. Allow microphone access for this site, then reload.":`Speech recognition error: ${e.error}. Try again.`)};
  r.onend=()=>{S.listening=false;$("listen").textContent="Start reading";if(!S.checking)state("Ready");if(transcript()&&!S.checking){clearTimer();S.timer=setTimeout(()=>check(false),350)}};return r
}
function start(){if(!S.rec||S.listening||S.checking)return;try{S.rec.start()}catch(e){notice("Could not start listening. Tap again.")}}
function stop(){clearTimer();if(S.rec&&S.listening)try{S.rec.stop()}catch(e){}}
function resetLine(){S.finalText="";S.interim="";S.start=Date.now();S.first=0;S.last=0;S.pending=null;$("heard").textContent="—";$("coach").hidden=true;$("controls").hidden=false;$("counter").textContent=`Line ${S.line+1} of ${LINES.length}`;render();live();state("Ready")}
function result(force=false){const m=metrics(),a=m.cmp.accuracy>=S.goal,p=m.wpm>=S.min&&m.wpm<=S.max;return{line:S.line,accuracy:m.cmp.accuracy,wpm:m.wpm,correct:m.cmp.match,total:m.target.length,miss:m.cmp.miss,accuracyPass:a,pacePass:p,passed:force||(a&&p),attempts:S.tries[S.line]+1,forced:force}}
async function check(force=false){if(S.checking||(!transcript()&&!force))return;S.checking=true;stop();state("Checking","warn");await new Promise(r=>setTimeout(r,220));let x=force&&S.pending?{...S.pending,passed:true,forced:true}:result(force);if(!force){S.tries[S.line]++;x.attempts=S.tries[S.line]}S.checking=false;if(x.passed)advance(x);else coach(x)}
function coach(x){S.pending=x;$("controls").hidden=true;$("coach").hidden=false;const bits=[];if(!x.accuracyPass)bits.push(`Accuracy ${x.accuracy}% (goal ${S.goal}%).`);if(!x.pacePass)bits.push(`Pace ${x.wpm} WPM (target ${S.min}–${S.max}).`);if(x.miss.length)bits.push(`Review: ${x.miss.join(", ")}.`);$("coachTitle").textContent=x.accuracyPass?"Good words—adjust the pace.":"Try that line once more.";$("coachText").textContent=bits.join(" ");render(diff(words(LINES[S.line]),words(transcript())).status);state("Retry","warn")}
function advance(x){S.results.push(x);S.pending=null;state("Passed","live");render(Array(words(LINES[S.line]).length).fill("ok"));if(S.line===LINES.length-1)setTimeout(finish,450);else{S.line++;setTimeout(resetLine,450)}}
function finish(){stop();const total=S.results.reduce((a,x)=>a+x.total,0),correct=S.results.reduce((a,x)=>a+x.correct,0),acc=total?Math.round(correct/total*100):0,speeds=S.results.map(x=>x.wpm).filter(Boolean),avg=speeds.length?Math.round(speeds.reduce((a,b)=>a+b,0)/speeds.length):0,first=S.results.filter(x=>x.attempts===1&&!x.forced).length,retries=S.results.reduce((a,x)=>a+Math.max(0,x.attempts-1),0);$("finalAccuracy").textContent=`${acc}%`;$("finalSpeed").textContent=`${avg} WPM`;$("firstTry").textContent=`${first}/${S.results.length}`;$("retries").textContent=retries;$("results").innerHTML=S.results.map((x,i)=>`<div class="result"><span>Line ${i+1}${x.forced?" · accepted":""}</span><b>${x.accuracy}%</b><b>${x.wpm} WPM</b></div>`).join("");show("review")}
function begin(){S.min=+$("minWpm").value;S.max=+$("maxWpm").value;S.goal=+$("goal").value;if(S.min>=S.max){notice("Minimum pace must be lower than maximum pace.");return}S.line=0;S.results=[];S.tries=Array(LINES.length).fill(0);$("target").textContent=`Target: ${S.min}–${S.max} WPM · ${S.goal}% accuracy`;show("read");resetLine();notice("Microphone ready. Tap Start reading, then read the highlighted line.")}
async function permission(){if(!window.isSecureContext)throw Error("This test needs an HTTPS link.");if(!navigator.mediaDevices?.getUserMedia)throw Error("This browser cannot request microphone access.");const s=await navigator.mediaDevices.getUserMedia({audio:true});s.getTracks().forEach(t=>t.stop())}
$("begin").onclick=async()=>{const b=$("begin");b.disabled=true;b.textContent="Requesting microphone…";try{if(!SR)throw Error("Speech recognition is unavailable here. Use Safari on iPhone/iPad or Chrome on Android.");await permission();S.rec=recognition();begin()}catch(e){notice(e.message)}finally{b.disabled=false;b.textContent="Enable microphone"}};
$("listen").onclick=()=>S.listening?stop():start();$("check").onclick=()=>check(false);$("finish").onclick=finish;$("retry").onclick=()=>{resetLine();start()};$("accept").onclick=()=>check(true);$("again").onclick=()=>{S.line=0;S.results=[];S.tries=Array(LINES.length).fill(0);show("read");resetLine()};$("settings").onclick=()=>show("setup");
document.querySelectorAll(".quiz button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".quiz button").forEach(x=>x.classList.remove("right","wrong"));const ok=b.dataset.answer==="1";b.classList.add(ok?"right":"wrong");$("quizFeedback").textContent=ok?"Correct—the garden and friendships helped Mary grow healthier and more caring.":"Not quite. Think about the people and environment that changed her."});
function checkDevice(id,ok){$(id).textContent=ok?"ready":"not available";$(id).className=ok?"good":"bad"}checkDevice("httpsCheck",window.isSecureContext);checkDevice("micCheck",!!navigator.mediaDevices?.getUserMedia);checkDevice("speechCheck",!!SR);if(!window.isSecureContext)notice("This page must be published over HTTPS before a phone can use its microphone.");else if(!SR)notice("Use Safari on iPhone/iPad or Chrome on Android for this prototype.");render();
