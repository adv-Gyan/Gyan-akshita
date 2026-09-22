/**
 * PARTICLES.JS — lightweight golden dust, canvas based
 * Designed for mobile-safe, sparse ambient motion.
 */
(function(){
  'use strict';
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const canvas=document.createElement('canvas');
  canvas.id='gold-particles';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;

  let width=0,height=0,dpr=1,particles=[],raf=0,last=0;
  const isSmall=()=>window.innerWidth<600;
  const count=()=>isSmall()?22:34;

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    width=window.innerWidth;height=window.innerHeight;
    canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles=[];
    for(let i=0;i<count();i++)particles.push(make(true));
  }

  function make(initial){
    return {
      x:Math.random()*width,
      y:initial?Math.random()*height:height+8,
      r:.45+Math.random()*1.25,
      a:.12+Math.random()*.38,
      speed:.08+Math.random()*.24,
      drift:(Math.random()-.5)*.12,
      phase:Math.random()*Math.PI*2
    };
  }

  function frame(time){
    if(document.hidden){raf=requestAnimationFrame(frame);return;}
    const dt=Math.min((time-last)/16.67,2)||1;last=time;
    ctx.clearRect(0,0,width,height);
    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      p.y-=p.speed*dt;p.x+=Math.sin(time*.00045+p.phase)*.18*dt+p.drift*dt;
      if(p.y<-8||p.x<-10||p.x>width+10)Object.assign(p,make(false));
      const alpha=p.a*(.72+.28*Math.sin(time*.001+p.phase));
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(201,168,76,'+alpha.toFixed(3)+')';ctx.fill();
    }
    raf=requestAnimationFrame(frame);
  }

  window.addEventListener('resize',resize,{passive:true});
  resize();
  raf=requestAnimationFrame(frame);
})();