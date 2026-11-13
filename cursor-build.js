/* Cuican's original page-build choreography. No upstream Swarm engine code.
   Measured DOM targets across the page; bounded batches, no snapshots. */
(()=>{'use strict';
const en=document.documentElement.lang==='en';
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const palette=['#acd9ef','#d4bee7','#b4d9ae','#edce9e','#e5b8aa','#cbdc91'];
const names=en?['Creative','Script','Visuals','Motion','Sound','Review']:['创意','脚本','视觉','动态','声音','审片'];
const root=document.createElement('div');root.className='cc-build-overlay';root.setAttribute('aria-hidden','true');
const controls=document.createElement('div');controls.className='cc-build-controls';controls.setAttribute('aria-label',en?'Page construction animation':'页面构建动效');
const status=document.createElement('span');status.className='cc-build-status';status.setAttribute('role','status');
const progress=document.createElement('span');progress.className='cc-build-progress';progress.setAttribute('aria-hidden','true');const fill=document.createElement('i');progress.append(fill);
const skip=document.createElement('button');skip.type='button';skip.textContent=en?'Skip animation':'跳过动效';skip.hidden=true;
const replay=document.createElement('button');replay.type='button';replay.textContent=en?'Replay page build ↗':'重播页面构建 ↗';
controls.append(status,progress,skip,replay);document.body.append(root,controls);
let running=false,raf=0,lastFrame=0,tasks=[],workers=[],startTime=0,lastCount=-1,readyTimer=0;
let sectionTimer=0,context='hero',began=false;
const built=new Set(),inView=new Set();
const sectionTargets=[...document.querySelectorAll('.cc-site section h2,.cc-lead,.cc-services h3,.cc-services article>p,.cc-services article>ul,.cc-photo,.cc-about>div>p,.cc-about small,.cc-process li,.cc-contact>div>p,.cc-contact-channel,.cc-footer,.cc-credit')];
document.body.dataset.swarmCoverage=String(sectionTargets.length);
const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
const mix=(a,b,p)=>a+(b-a)*p;
function restore(t){for(const [name,value] of Object.entries(t.saved)){if(value)t.el.style.setProperty(name,value);else t.el.style.removeProperty(name);}}
function finish(){
 cancelAnimationFrame(raf);clearTimeout(readyTimer);
 for(const t of tasks)restore(t);
 root.replaceChildren();tasks=[];workers=[];running=false;window.__ccSwarmActive=false;
 document.body.dataset.swarmState='complete';document.body.dataset.swarmEngine='cuican-original';
 skip.hidden=true;replay.hidden=false;status.hidden=progress.hidden=true;
 dispatchEvent(new Event('cuican:swarm-stop'));
 scheduleSections();
}
function point(x,y){return{x:Math.max(8,Math.min(innerWidth-20,x)),y:Math.max(8,Math.min(innerHeight-25,y))};}
function worker(i){
 const node=document.createElement('div');node.className='cc-build-cursor';node.style.setProperty('--cursor',palette[i]);
 const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');arrow.setAttribute('viewBox','0 0 20 24');
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M2 2 17 15 10 16 7 22Z');arrow.append(path);
 const label=document.createElement('span');label.textContent=names[i];node.append(arrow,label);root.append(node);
 return{node,last:point(innerWidth*.5+(i-2.5)*20,innerHeight*.43+(i%2)*15)};
}
function visible(el){const r=el.getBoundingClientRect();return r.width>2&&r.height>2&&r.bottom>16&&r.top<innerHeight-24&&getComputedStyle(el).display!=='none';}
function begin(candidates=null,area='hero'){
 if(running)finish();if(motion.matches){finish();return;}
 const selectors=['.dock','.cc-language','.headline span:first-child','.headline span:last-child','.lede','.cc-hero-cta','.cc-artwork','.cc-hero-caption'];
 const nodes=(candidates||selectors.map(s=>document.querySelector(s)).filter(Boolean)).filter(visible).slice(0,12);
 if(!nodes.length){finish();return;}
 context=area;
 workers=Array.from({length:Math.min(innerWidth<650?4:6,nodes.length)},(_,i)=>worker(i));
 tasks=nodes.map((el,i)=>{
  const r=el.getBoundingClientRect(),lane=i%workers.length;
  const box=document.createElement('div');box.className='cc-build-box';box.style.setProperty('--cursor',palette[lane]);
  Object.assign(box.style,{left:r.left+'px',top:r.top+'px'});
  const measure=document.createElement('span');measure.className='cc-build-measure';box.append(measure);root.append(box);
  const text=el.matches('.headline span,.lede,h2,h3,p,.cc-lead');const scene=el.classList.contains('cc-artwork');
  const saved={};for(const name of ['clip-path','opacity','translate','will-change'])saved[name]=el.style.getPropertyValue(name);
  el.style.willChange='clip-path,opacity';el.style.opacity=scene?'.28':'0';el.style.clipPath='inset(0 100% 0 0)';
  return{el,r:{left:r.left,top:r.top,width:r.width,height:r.height},docTop:r.top+scrollY,box,measure,lane,text,scene,saved,done:false,from:null,start:Math.floor(i/workers.length)*1120+lane*95,duration:scene?980:910,letters:Math.max(10,el.textContent.trim().length)};
 });
 for(const x of [24,innerWidth*.5,innerWidth-24]){const guide=document.createElement('i');guide.className='cc-build-guide';guide.style.left=x+'px';root.prepend(guide);}
 running=true;window.__ccSwarmActive=true;lastCount=-1;lastFrame=0;startTime=performance.now();
 document.body.dataset.swarmState='building';document.body.dataset.swarmEngine='cuican-original';document.body.dataset.swarmSection=context;document.body.dataset.swarmTasks=String(tasks.length);document.body.dataset.swarmAgents=String(workers.length);
 replay.hidden=true;skip.hidden=false;status.hidden=progress.hidden=false;fill.style.transform='scaleX(0)';
 dispatchEvent(new Event('cuican:swarm-start'));raf=requestAnimationFrame(frame);
}
function frame(now){
 if(!running)return;
 if(now-lastFrame<32){raf=requestAnimationFrame(frame);return;}lastFrame=now;
 let count=0;
 for(const t of tasks){
  if(t.done){count++;continue;}
  t.r={...t.r,top:t.docTop-scrollY};t.box.style.top=t.r.top+'px';
  if(t.r.top+t.r.height<0||t.r.top>innerHeight){restore(t);t.box.style.opacity='0';t.done=true;count++;continue;}
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
  if(elapsed>=t.duration){t.done=true;built.add(t.el);t.box.style.opacity='0';restore(t);count++;}
 }
 if(count!==lastCount){lastCount=count;status.textContent=en?`Building the page · ${count} / ${tasks.length}`:`正在构建页面 · ${count} / ${tasks.length}`;document.body.dataset.swarmDone=String(count);document.body.dataset.swarmBuilt=String(sectionTargets.filter(el=>built.has(el)).length);fill.style.transform=`scaleX(${count/tasks.length})`;}
 if(count===tasks.length||now-startTime>5000){finish();return;}raf=requestAnimationFrame(frame);
}
function scheduleSections(){clearTimeout(sectionTimer);if(!began||running||motion.matches||document.hidden)return;sectionTimer=setTimeout(()=>{if(running||motion.matches||document.hidden)return;const nodes=sectionTargets.filter(el=>inView.has(el)&&!built.has(el)&&visible(el)).slice(0,12);if(nodes.length){const parent=nodes[0].closest('section,footer,aside');begin(nodes,parent?.id||parent?.classList[0]||'content');}},90);}
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)inView.add(entry.target);else inView.delete(entry.target);}scheduleSections();},{threshold:0,rootMargin:'-16px 0px -24px 0px'});
sectionTargets.forEach(el=>observer.observe(el));
function skipVisible(){for(const el of sectionTargets)if(visible(el))built.add(el);for(const t of tasks)built.add(t.el);finish();}
skip.addEventListener('click',skipVisible);
replay.addEventListener('click',()=>{finish();built.clear();document.getElementById('hero').scrollIntoView({behavior:'instant'});begin();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&running)skipVisible();});
document.addEventListener('click',e=>{if(running&&e.target.closest('a'))finish();});
addEventListener('scroll',scheduleSections,{passive:true});
addEventListener('resize',()=>{if(running)finish();scheduleSections();},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)finish();else if(!document.hidden)scheduleSections();});motion.addEventListener('change',()=>{if(motion.matches)finish();else scheduleSections();});
// Every load plays once; reduced-motion visitors can read the page immediately.
let started=false;
function ready(){if(started)return;if(document.hidden)return;started=true;began=true;clearTimeout(readyTimer);if(motion.matches)finish();else begin();}
Promise.race([Promise.all([document.fonts.ready,...[...document.querySelectorAll('.hero img')].map(i=>i.decode().catch(()=>{}))]),new Promise(resolve=>{readyTimer=setTimeout(resolve,1400);})]).then(ready);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!started)ready();});
})();
