/**
 * PETALS.JS — sparse, elegant wedding petals + a trace of gold dust.
 * Intentionally restrained: slow drift, low opacity, mostly around the
 * edges of the viewport so the typography remains the focal point.
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
  const count=()=>isSmall()?10:16;

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    width=window.innerWidth;height=window.innerHeight;
    canvas.width=Math.floor(width*dpr);
    canvas.height=Math.floor(height*dpr);
    canvas.style.width=width+'px';
    canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles=[];
    for(let i=0;i<count();i++)particles.push(make(true));
  }

  function make(initial){
    const fromEdge=Math.random()<.78;
    const side=Math.random()<.5?'left':'right';
    const x=fromEdge
      ? (side==='left'
        ? -12+Math.random()*width*.22
        : width-width*.22+Math.random()*width*.22)
      : Math.random()*width;

    return {
      x,
      y:initial?Math.random()*height:height+24,
      size:3.2+Math.random()*3.8,
      alpha:.12+Math.random()*.22,
      speed:.16+Math.random()*.24,
      drift:.06+Math.random()*.16,
      sway:18+Math.random()*30,
      phase:Math.random()*Math.PI*2,
      rotation:Math.random()*Math.PI*2,
      spin:(Math.random()-.5)*.006,
      tilt:.72+Math.random()*.42,
      tone:Math.random()<.72?'rose':(Math.random()<.65?'ivory':'gold')
    };
  }

  function petalColor(p,a){
    if(p.tone==='rose') return 'rgba(235,190,190,'+a.toFixed(3)+')';
    if(p.tone==='ivory') return 'rgba(248,242,230,'+a.toFixed(3)+')';
    return 'rgba(232,201,122,'+(a*.78).toFixed(3)+')';
  }

  function drawPetal(p,time){
    const sway=Math.sin(time*.00038+p.phase)*p.sway;
    const x=p.x+sway;
    const y=p.y;

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(p.rotation+Math.sin(time*.00045+p.phase)*.12);
    ctx.scale(p.tilt,1);

    const g=ctx.createLinearGradient(-p.size,0,p.size,p.size*1.7);
    const alpha=p.alpha*(.72+.28*Math.sin(time*.0008+p.phase));
    g.addColorStop(0,petalColor(p,alpha*.55));
    g.addColorStop(.55,petalColor(p,alpha));
    g.addColorStop(1,petalColor(p,alpha*.28));

    ctx.beginPath();
    ctx.moveTo(0,-p.size*1.05);
    ctx.bezierCurveTo(p.size*.92,-p.size*.58,p.size*.82,p.size*.72,0,p.size*1.22);
    ctx.bezierCurveTo(-p.size*.82,p.size*.72,-p.size*.92,-p.size*.58,0,-p.size*1.05);
    ctx.fillStyle=g;
    ctx.fill();

    /* A very soft central fold gives the petal a paper-like quality. */
    ctx.beginPath();
    ctx.moveTo(0,-p.size*.72);
    ctx.quadraticCurveTo(p.size*.10,p.size*.20,0,p.size*.88);
    ctx.strokeStyle=petalColor(p,alpha*.22);
    ctx.lineWidth=.45;
    ctx.stroke();

    ctx.restore();
  }

  function frame(time){
    if(document.hidden){
      raf=requestAnimationFrame(frame);
      return;
    }

    const dt=Math.min((time-last)/16.67,2)||1;
    last=time;
    ctx.clearRect(0,0,width,height);

    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      p.y+=p.speed*dt;
      p.x+=Math.sin(time*.00042+p.phase)*.16*dt+p.drift*dt;
      p.rotation+=p.spin*dt;

      if(p.y>height+24||p.x<-35||p.x>width+35){
        Object.assign(p,make(false));
      }

      drawPetal(p,time);
    }

    raf=requestAnimationFrame(frame);
  }

  window.addEventListener('resize',resize,{passive:true});
  resize();
  raf=requestAnimationFrame(frame);
})();