/**
 * COUNTDOWN.JS — Live countdown with cinematic ticking
 */
(function(){
'use strict';
const daysEl=document.getElementById('cd-days'),hoursEl=document.getElementById('cd-hours'),minsEl=document.getElementById('cd-minutes'),secsEl=document.getElementById('cd-seconds'),grid=document.getElementById('countdown-grid');
let last={d:'',h:'',m:'',s:''};
const pad=n=>String(n).padStart(2,'0');
function target(){return window.weddingData&&window.weddingData.weddingDate?new Date(window.weddingData.weddingDate):new Date('2026-11-21T00:00:00');}
function tick(el){if(!el||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;el.classList.remove('ticking');void el.offsetWidth;el.classList.add('ticking');}
function update(){
 const diff=target()-new Date();
 if(diff<=0){[daysEl,hoursEl,minsEl,secsEl].forEach(e=>e&&(e.textContent='00'));const l=document.querySelector('.countdown-date-label');if(l)l.textContent='🎉 Today is the day!';return}
 const v={d:pad(Math.floor(diff/86400000)),h:pad(Math.floor(diff%86400000/3600000)),m:pad(Math.floor(diff%3600000/60000)),s:pad(Math.floor(diff%60000/1000))},e={d:daysEl,h:hoursEl,m:minsEl,s:secsEl};
 Object.keys(v).forEach(k=>{if(e[k]&&v[k]!==last[k]){e[k].textContent=v[k];tick(e[k]);last[k]=v[k]}});
 if(grid&&typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   const section=grid.closest('#section-countdown');
   if(section){
     gsap.fromTo(section,{ '--pulse-opacity': 0.035 },{ '--pulse-opacity': 0.12,duration:.22,yoyo:true,repeat:1,overwrite:true,ease:'power2.out' });
   }
   gsap.to(grid,{scale:1.003,duration:.18,yoyo:true,repeat:1,overwrite:true,ease:'power2.out'});
 }
}
update();setInterval(update,1000);
})();