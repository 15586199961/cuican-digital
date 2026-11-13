/* Cuican's original page-build choreography. No upstream Swarm engine code.
   A bounded scene: six roles, measured DOM targets, one opening, no snapshots. */
(()=>{'use strict';
const en=document.documentElement.lang==='en';
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const palette=['#acd9ef','#d4bee7','#b4d9ae','#edce9e','#e5b8aa','#cbdc91'];
const names=en?['Creative','Script','Visuals','Motion','Sound','Review']:['创意','脚本','视觉','动态','声音','审片'];
const root=document.createElement('div');root.className='cc-build-overlay';root.setAttribute('aria-hidden','true');
const controls=document.createElement('div');controls.className='cc-build-controls';controls.setAttribute('aria-label',en?'Opening animation':'开场动画');
const status=document.createElement('span');status.className='cc-build-status';status.setAttribute('role','status');
const progress=document.createElement('span');progress.className='cc-build-progress';progress.setAttribute('aria-hidden','true');const fill=document.createElement('i');progress.append(fill);
const skip=document.createElement('button');skip.type='button';skip.textContent=en?'Skip intro':'跳过开场';skip.hidden=true;
const replay=document.createElement('button');replay.type='button';replay.textContent=en?'Replay page build ↗':'重播页面构建 ↗';
controls.append(status,progress,skip,replay);document.body.append(root,controls);
let running=false,raf=0,lastFrame=0,tasks=[],workers=[],startTime=0,lastCount=-1,readyTimer=0;
const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
const mix=(a,b,p)=>a+(b-a)*p;
function finish(){
 cancelAnimationFrame(raf);clearTimeout(readyTimer);
 for(const t of tasks){t.el.style.removeProperty('clip-path');t.el.style.removeProperty('opacity');t.el.style.removeProperty('translate');t.el.style.removeProperty('will-change');}
 root.replaceChildren();tasks=[];workers=[];running=false;window.__ccSwarmActive=false;
 document.body.dataset.swarmState='complete';document.body.dataset.swarmEngine='cuican-original';
 skip.hidden=true;replay.hidden=false;status.hidden=progress.hidden=true;
 dispatchEvent(new Event('cuican:swarm-stop'));
}
function point(x,y){return{x:Math.max(8,Math.min(innerWidth-20,x)),y:Math.max(8,Math.min(innerHeight-25,y))};}
function worker(i){
 const node=document.createElement('div');node.className='cc-build-cursor';node.style.setProperty('--cursor',palette[i]);
 const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');arrow.setAttribute('viewBox','0 0 20 24');
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M2 2 17 15 10 16 7 22Z');arrow.append(path);
 const label=document.createElement('span');label.textContent=names[i];node.append(arrow,label);root.append(node);
 return{node,last:point(innerWidth*.5+(i-2.5)*20,innerHeight*.43+(i%2)*15)};
}
function begin(){
 if(running)finish();if(motion.matches){finish();return;}
 const selectors=['.dock','.cc-language','.headline span:first-child','.headline span:last-child','.lede','.cc-hero-cta','.cc-scene-still','.card--about','.knob-float','.card--stove'];
 const nodes=selectors.map(s=>document.querySelector(s)).filter(Boolean).filter(el=>{const r=el.getBoundingClientRect();return r.width>2&&r.height>2&&r.bottom>0&&r.top<innerHeight&&getComputedStyle(el).display!=='none';});
 if(!nodes.length){finish();return;}
 workers=Array.from({length:Math.min(innerWidth<650?4:6,nodes.length)},(_,i)=>worker(i));
 tasks=nodes.map((el,i)=>{
  const r=el.getBoundingClientRect(),lane=i%workers.length;
  const box=document.createElement('div');box.className='cc-build-box';box.style.setProperty('--cursor',palette[lane]);
  Object.assign(box.style,{left:r.left+'px',top:r.top+'px'});
  const measure=document.createElement('span');measure.className='cc-build-measure';box.append(measure);root.append(box);
  const text=el.matches('.headline span,.lede');const scene=el.classList.contains('cc-scene-still');
  el.style.willChange='clip-path,opacity';el.style.opacity=scene?'.28':'0';el.style.clipPath='inset(0 100% 0 0)';
  return{el,r,box,measure,lane,text,scene,done:false,from:null,start:Math.floor(i/workers.length)*1120+lane*95,duration:scene?980:910,letters:Math.max(10,el.textContent.trim().length)};
 });
 for(const x of [24,innerWidth*.5,innerWidth-24]){const guide=document.createElement('i');guide.className='cc-build-guide';guide.style.left=x+'px';root.prepend(guide);}
 running=true;window.__ccSwarmActive=true;lastCount=-1;lastFrame=0;startTime=performance.now();
 document.body.dataset.swarmState='building';document.body.dataset.swarmEngine='cuican-original';document.body.dataset.swarmTasks=String(tasks.length);document.body.dataset.swarmAgents=String(workers.length);
 replay.hidden=true;skip.hidden=false;status.hidden=progress.hidden=false;fill.style.transform='scaleX(0)';
 dispatchEvent(new Event('cuican:swarm-start'));raf=requestAnimationFrame(frame);
}
function frame(now){
 if(!running)return;
 if(now-lastFrame<32){raf=requestAnimationFrame(frame);return;}lastFrame=now;
 let count=0;
 for(const t of tasks){
  if(t.done){count++;continue;}
  const elapsed=now-startTime-t.start;if(elapsed<0)continue;
  const w=workers[t.lane];if(!t.from)t.from={...w.last};
  const travel=ease(elapsed/220);let draw=Math.max(0,Math.min(1,(elapsed-220)/(t.duration-220)));
  if(t.text)draw=Math.floor(draw*t.letters)/t.letters;
  const target=point(t.r.left+t.r.width*draw,t.r.top+(t.text?t.r.height*.62:t.r.height*draw));
  const p=elapsed<220?{x:mix(t.from.x,t.r.left,travel),y:mix(t.from.y,t.r.top,travel)}:target;
  w.last=p;w.node.style.transform=`translate3d(${p.x}px,${p.y}px,0)`;w.node.style.opacity='1';
  t.box.style.opacity=elapsed<220?'0':'1';t.box.style.width=Math.max(1,t.r.width*draw)+'px';t.box.style.height=Math.max(1,t.r.height*(t.text?1:draw))+'px';
  t.measure.textContent=Math.round(t.r.width*draw)+' × '+Math.round(t.r.height);
  t.el.style.opacity=String(t.scene ? .28+.72*draw : draw>.01 ? 1 : 0);t.el.style.clipPath=`inset(0 ${(1-draw)*100}% 0 0)`;
  if(!t.text&&!t.scene)t.el.style.translate=`${(1-ease(draw))*8}px ${(1-ease(draw))*5}px`;
  if(elapsed>=t.duration){t.done=true;t.box.style.opacity='0';t.el.style.opacity='1';t.el.style.clipPath='inset(0)';t.el.style.removeProperty('translate');count++;}
 }
 if(count!==lastCount){lastCount=count;status.textContent=en?`Building the page · ${count} / ${tasks.length}`:`正在构建页面 · ${count} / ${tasks.length}`;document.body.dataset.swarmDone=String(count);fill.style.transform=`scaleX(${count/tasks.length})`;}
 if(count===tasks.length||now-startTime>5000){finish();return;}raf=requestAnimationFrame(frame);
}
skip.addEventListener('click',finish);
replay.addEventListener('click',()=>{finish();document.getElementById('hero').scrollIntoView({behavior:'instant'});begin();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&running)finish();});
document.addEventListener('click',e=>{if(running&&e.target.closest('a'))finish();});
for(const type of ['wheel','touchmove','resize'])addEventListener(type,()=>{if(running)finish();},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)finish();});motion.addEventListener('change',()=>{if(motion.matches)finish();});
// Every load plays once; reduced-motion visitors can read the page immediately.
let started=false;
function ready(){if(started)return;if(document.hidden)return;started=true;clearTimeout(readyTimer);if(motion.matches)finish();else begin();}
Promise.race([Promise.all([document.fonts.ready,...[...document.querySelectorAll('.hero img')].map(i=>i.decode().catch(()=>{}))]),new Promise(resolve=>{readyTimer=setTimeout(resolve,1400);})]).then(ready);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!started)ready();});
})();
