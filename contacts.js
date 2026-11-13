/* Fill only with the business contact accounts confirmed by the owner. */
window.CUICAN_CONTACTS = {wechat: 'an941234567890', x: 'https://x.com/muhammudvalero'};
(()=>{'use strict';const en=document.documentElement.lang==='en',data=window.CUICAN_CONTACTS;
document.querySelectorAll('[data-wechat-account]').forEach(el=>el.textContent=data.wechat||(en?'Details coming soon':'微信号待补充'));
const copy=document.querySelector('[data-copy-wechat]'),status=document.querySelector('[data-contact-status]');
if(data.wechat&&copy){copy.hidden=false;copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(data.wechat);status.textContent=en?'WeChat ID copied.':'微信号已复制。'}catch{status.textContent=en?'Please select and copy the WeChat ID above.':'请选中上方微信号复制。'}})}
const target=document.querySelector('[data-x-profile]');if(data.x&&target){let value=data.x.trim(),url;try{url=new URL(value.startsWith('http')?value:'https://x.com/'+value.replace(/^@/,''));if(!['x.com','www.x.com','twitter.com','www.twitter.com'].includes(url.hostname)||url.protocol!=='https:')return}catch{return}const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent='@'+url.pathname.split('/').filter(Boolean)[0]+' ↗';target.replaceChildren(a)}
})();

