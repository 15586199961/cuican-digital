/* Pre-rendered hero first. The optional original WebGL engine loads on demand. */
(()=>{'use strict';
const en=document.documentElement.lang==='en',hero=document.querySelector('#hero'),image=document.querySelector('.cc-scene-still img');
document.body.classList.add('is-ready','intro-done','cc-light-scene');document.body.dataset.sceneMode='prerendered';
const assets=[image,...document.querySelectorAll('.hero img')];
Promise.race([Promise.all(assets.map(i=>i.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,1800))]).then(()=>{window.__ccStaticReady=true});
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 hero.addEventListener('pointermove',e=>{if(document.body.classList.contains('cc-live-scene'))return;const r=hero.getBoundingClientRect();hero.style.setProperty('--still-x',((e.clientX-r.left)/r.width-.5)*8+'px');hero.style.setProperty('--still-y',((e.clientY-r.top)/r.height-.5)*5+'px')},{passive:true});
 hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--still-x','0px');hero.style.setProperty('--still-y','0px')});
}
const button=document.createElement('button');button.type='button';button.className='cc-scene-toggle';button.setAttribute('data-cc-swarm-control','');button.textContent=en?'Enable live 3D':'启用实时 3D';document.body.append(button);
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.append(s)})}
let loading=false,loaded=false;
button.addEventListener('click',async()=>{if(loading)return;if(loaded){location.reload();return}loading=true;button.disabled=true;button.textContent=en?'Loading 3D…':'正在加载 3D…';try{await load('inner-green-assets/three.min.js');await load('scene-runtime.js');}catch{button.textContent=en?'Retry live 3D':'重试实时 3D';button.disabled=false;loading=false}});
document.addEventListener('cuican:scene-ready',()=>{loaded=true;loading=false;document.body.dataset.sceneMode='live';button.disabled=false;button.textContent=en?'Use light mode':'切回轻量模式'});
addEventListener('cuican:swarm-start',()=>{button.hidden=true});addEventListener('cuican:swarm-stop',()=>{button.hidden=false});
})();
