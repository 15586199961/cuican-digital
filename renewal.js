const jump=id=>document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
const links=[...document.querySelectorAll('.dock a')];['hero','hero','services','about','contact'].forEach((id,i)=>{if(links[i]){links[i].href='#'+id;links[i].addEventListener('click',e=>{e.preventDefault();jump(id)})}});
document.querySelector('.liquid-button--explore')?.addEventListener('click',()=>jump('services'));
document.querySelector('.liquid-button--play')?.addEventListener('click',()=>jump('game'));
document.querySelector('.knob--about')?.addEventListener('click',()=>jump('animation'));
document.querySelector('.card--stove .knob')?.addEventListener('click',()=>jump('content'));
const discover=document.querySelector('.scroll');discover.href='#services';discover.addEventListener('click',e=>{e.preventDefault();jump('services')});

['璀粲首页','首页','业务','关于','联系'].forEach((label,i)=>links[i]?.setAttribute('aria-label',label));

if(document.documentElement.lang==='en'){['Cuican home','Home','Services','About','Contact'].forEach((label,i)=>links[i]?.setAttribute('aria-label',label));}
