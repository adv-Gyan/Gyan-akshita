/**
 * ============================================================
 * SCROLL-ANIMATIONS.JS
 * Cinematic GSAP + ScrollTrigger orchestration
 * ============================================================
 */
window.ScrollAnimations=(function(){
'use strict';
let initialized=false;
const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canAnimate=()=>typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'&&!reduced();

function injectEvents(){
 const c=document.getElementById('events-container');
 if(!c||!window.weddingData||c.children.length)return;
 window.weddingData.events.forEach(evt=>{
  const item=document.createElement('article'); item.className='event-item'; item.setAttribute('aria-label',`Event: ${evt.name}`);
  item.innerHTML=`<div class="event-dot" aria-hidden="true"></div><div class="event-card"><div class="event-card-photo-wrap">${photoHTML(evt)}</div><div class="event-card-body"><h3 class="event-card-name">${evt.icon||'✦'} ${evt.name}</h3><p class="event-card-date-time">${evt.date!=='TBD'?evt.date:''}${evt.time!=='TBD'?' · '+evt.time:''}${evt.date==='TBD'&&evt.time==='TBD'?'Date & time coming soon':''}</p><p class="event-card-venue">${evt.venue!=='TBD'?evt.venue:''}${evt.venue!=='TBD'&&evt.address!=='TBD'?'<br/>':''}${evt.address!=='TBD'?evt.address:''}${evt.venue==='TBD'?'Venue to be announced':''}</p><p class="event-card-description">${evt.description||''}</p>${evt.dressCode?`<span class="event-card-dresscode">👗 ${evt.dressCode}</span>`:''}</div></div>`;
  c.appendChild(item);
 });
}
function photoHTML(evt){return `<img src="${evt.photo}" alt="${evt.name} celebration" class="event-card-photo" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="event-photo-placeholder" style="display:none"><span class="event-icon">${evt.icon||'✦'}</span><p>Photo coming soon</p></div>`;}
function injectVenue(){
 if(!window.weddingData)return; const v=window.weddingData.venue,name=qs('#venue-name-display'),addr=qs('#venue-address-display'),btn=qs('#venue-directions-btn'),map=qs('#venue-map-wrap');
 if(name)name.textContent=v.name!=='TBD'?v.name:'Venue to be announced'; if(addr)addr.textContent=v.address!=='TBD'?v.address:'Address will be updated soon'; if(btn)btn.href=v.mapsUrl||'#';
 if(map&&v.embedUrl)map.innerHTML=`<iframe src="${v.embedUrl}" title="Venue location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
}
function splitWords(el){
 if(!el||el.dataset.split==='true')return qsa('.split-word',el);
 const parts=el.textContent.trim().split(/(\s+)/); el.textContent='';
 parts.forEach(p=>{if(/^\s+$/.test(p))el.appendChild(document.createTextNode(p));else if(p){const s=document.createElement('span');s.className='split-word';s.textContent=p;el.appendChild(s)}});
 el.dataset.split='true'; return qsa('.split-word',el);
}
function initHero(){
 const hero=qs('#section-hero'); if(!hero)return;
 if(!canAnimate()){qsa('.animate-hero').forEach(e=>{e.style.opacity='1';e.style.transform='none'});return}
 const bg=qs('.hero-bg',hero),arch=qs('.hero-arch-frame',hero),mono=qs('.hero-monogram',hero),bride=qs('.hero-bride',hero),groom=qs('.hero-groom',hero),amp=qs('.hero-and',hero),divider=qs('.hero-divider',hero),invite=qs('.hero-invite-line',hero),date=qs('.hero-date',hero),cue=qs('.scroll-indicator',hero);
 gsap.set([mono,bride,groom,amp,divider,invite,date,cue],{opacity:0,y:18,filter:'blur(7px)'});gsap.set(bride,{x:-90});gsap.set(groom,{x:90});gsap.set(amp,{scale:.4,y:0});gsap.set(arch,{scale:.82,opacity:0,filter:'drop-shadow(0 0 0 rgba(201,168,76,0))'});
 gsap.timeline({defaults:{ease:'power3.out'}}).to(arch,{scale:1,opacity:1,duration:1.35,filter:'drop-shadow(0 0 18px rgba(201,168,76,.28))'}).to(mono,{opacity:1,y:0,filter:'blur(0px)',duration:.65},'-=.65').to(bride,{opacity:1,x:0,filter:'blur(0px)',duration:.85},'-=.35').to(groom,{opacity:1,x:0,filter:'blur(0px)',duration:.85},'<').to(amp,{opacity:1,scale:1,filter:'blur(0px)',duration:.65,ease:'back.out(1.7)'},'-=.45').to(divider,{opacity:1,y:0,filter:'blur(0px)',duration:.55},'-=.25').to(invite,{opacity:1,y:0,filter:'blur(0px)',duration:.6},'-=.2').to(date,{opacity:1,y:0,filter:'blur(0px)',duration:.65},'-=.15').to(cue,{opacity:1,y:0,filter:'blur(0px)',duration:.5},'-=.1');
 if(bg)gsap.to(bg,{yPercent:12,scale:1.12,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.2}});
 gsap.to(arch,{yPercent:-6,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.5}});
}
function initPhoto(){
 const s=qs('#section-photo'),f=qs('.photo-mughal-frame',s),p=qs('.couple-photo',s),c=qs('.photo-caption',s);if(!s||!f||!canAnimate())return;
 gsap.set(f,{clipPath:'circle(0% at 50% 55%)',opacity:0,scale:.96});if(p)gsap.set(p,{scale:1.08});gsap.set(c,{y:30,opacity:0,letterSpacing:'.22em'});
 gsap.timeline({scrollTrigger:{trigger:s,start:'top 72%',once:true}}).to(f,{clipPath:'circle(76% at 50% 55%)',opacity:1,scale:1,duration:1.25,ease:'power3.inOut'}).to(f,{filter:'drop-shadow(0 0 22px rgba(201,168,76,.32))',duration:.45},'-=.2').to(c,{y:0,opacity:1,letterSpacing:'.08em',duration:.75,ease:'power3.out'},'-=.1');
 if(p)gsap.to(p,{scale:1.02,scrollTrigger:{trigger:s,start:'top bottom',end:'bottom top',scrub:1.4}});
}
function initMessage(){
 const s=qs('#section-message'),card=qs('.message-card',s);if(!s||!card||!canAnimate())return;const verse=qs('.message-verse',card),body=qs('.message-body',card),quote=qs('.message-quote-mark',card),closing=qs('.message-closing',card),words=splitWords(verse);
 gsap.set(card,{opacity:0,y:35});gsap.set(quote,{opacity:0,scale:0,transformOrigin:'50% 80%'});gsap.set(words,{opacity:0,y:12,filter:'blur(4px)'});gsap.set(body,{opacity:0,y:18,filter:'blur(4px)'});gsap.set(closing,{opacity:0,y:18});
 gsap.timeline({scrollTrigger:{trigger:s,start:'top 72%',once:true}}).to(card,{opacity:1,y:0,duration:.65,ease:'power3.out'}).to(quote,{opacity:.2,scale:1,duration:.7,ease:'back.out(1.8)'},'-=.25').to(words,{opacity:1,y:0,filter:'blur(0px)',duration:.38,stagger:.07,ease:'power2.out'},'-=.3').to(body,{opacity:1,y:0,filter:'blur(0px)',duration:.8,ease:'power2.out'},'-=.15').to(closing,{opacity:1,y:0,duration:.55},'-=.25').to(card,{boxShadow:'0 0 34px rgba(201,168,76,.14)',duration:.4},'-=.15');
}
function initEvents(){
 const s=qs('#section-events'),track=qs('.timeline-track',s),fill=qs('#timeline-fill',s),items=qsa('.event-item',s);if(!s||!track||!items.length||!canAnimate())return;gsap.set(fill,{height:0});
 items.forEach((item,i)=>{const card=qs('.event-card',item),dot=qs('.event-dot',item),photo=qs('.event-card-photo',item),dress=qs('.event-card-dresscode',item),x=i%2===0?-70:70;gsap.set(card,{opacity:0,x,y:20});gsap.set(dot,{opacity:0,scale:.2});if(photo)gsap.set(photo,{scale:1.12});const tl=gsap.timeline({scrollTrigger:{trigger:item,start:'top 78%',once:true}});tl.to(dot,{opacity:1,scale:1,duration:.55,ease:'back.out(2)'}).to(card,{opacity:1,x:0,y:0,duration:.75,ease:'power3.out'},'-=.25');if(dress)tl.to(dress,{opacity:1,y:0,duration:.4},'-=.2')});
 gsap.to(fill,{height:'100%',ease:'none',scrollTrigger:{trigger:track,start:'top 70%',end:'bottom 78%',scrub:true}});
 items.forEach(item=>{const p=qs('.event-card-photo',item);if(p)gsap.to(p,{scale:1,xPercent:2,ease:'none',scrollTrigger:{trigger:item,start:'top bottom',end:'bottom top',scrub:1.5}})});
}
function initCountdown(){const s=qs('#section-countdown'),u=qsa('.countdown-unit',s);if(!s||!u.length||!canAnimate())return;gsap.set(u,{opacity:0,y:-24,scale:.96});gsap.timeline({scrollTrigger:{trigger:s,start:'top 75%',once:true}}).to(u,{opacity:1,y:0,scale:1,duration:.6,stagger:.12,ease:'back.out(1.4)',onComplete:()=>qsa('.countdown-number',s).forEach(e=>e.classList.add('countdown-live'))});}
function initVenue(){const s=qs('#section-venue');if(!s||!canAnimate())return;const name=qs('.venue-name',s),addr=qs('.venue-address',s),map=qs('.venue-map-wrap',s),btn=qs('#venue-directions-btn',s);if(name)name.classList.add('gold-shimmer');gsap.set([name,addr],{opacity:0,y:18});gsap.set(map,{clipPath:'inset(0 50% 0 50% round 8px)',opacity:0});gsap.set(btn,{opacity:0,y:18,scale:.98});gsap.timeline({scrollTrigger:{trigger:s,start:'top 72%',once:true}}).to(name,{opacity:1,y:0,duration:.7}).to(name,{backgroundPosition:'-120% 0',duration:1.1,ease:'power2.inOut'},'-=.35').to(addr,{opacity:1,y:0,duration:.55},'-=.55').to(map,{opacity:1,clipPath:'inset(0 0% 0 0% round 8px)',duration:1,ease:'power3.inOut'},'-=.2').to(btn,{opacity:1,y:0,scale:1,duration:.55},'-=.25').call(()=>btn&&btn.classList.add('venue-directions-ready'));}
function initDividers(){const ds=qsa('.section-header img,.caption-divider,.hero-divider img,.site-footer>img');if(!canAnimate())return;ds.forEach(e=>gsap.to(e,{clipPath:'inset(0 0% 0 0%)',opacity:1,duration:.9,ease:'power2.inOut',scrollTrigger:{trigger:e,start:'top 84%',once:true}}));const f=qs('.site-footer');if(f)gsap.fromTo(f,{opacity:0,y:35},{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:f,start:'top 88%',once:true}});}
function initGeneric(){if(!canAnimate()){qsa('.reveal-on-scroll').forEach(e=>{e.style.opacity='1';e.style.transform='none'});return}qsa('.reveal-on-scroll').forEach(e=>{if(e.closest('#section-photo,#section-message,#section-countdown,#section-venue,#section-events'))return;gsap.fromTo(e,{opacity:0,y:30},{opacity:1,y:0,duration:.75,ease:'power3.out',scrollTrigger:{trigger:e,start:'top 82%',once:true}})});}
function init(){if(initialized)return;initialized=true;injectEvents();injectVenue();requestAnimationFrame(()=>{if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined'){initGeneric();return}gsap.registerPlugin(ScrollTrigger);initHero();initPhoto();initMessage();initEvents();initCountdown();initVenue();initDividers();initGeneric();ScrollTrigger.refresh()});}
return{init};
})();