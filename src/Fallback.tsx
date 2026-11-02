import {useEffect,useRef} from 'react';
// Canvas projection retains the evolution narrative on devices without WebGL.
export default function Fallback({still=false}:{still?:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current!,ctx=canvas.getContext('2d');if(!ctx)return;
  let w=0,h=0,frame=0,last=0,t=0,p=0,target=0;let sections:number[]=[];
  const points=Array.from({length:128},(_,i)=>{const y=(Math.floor(i/2)/63-.5)*7,a=Math.floor(i/2)*.18+(i%2)*Math.PI;const phi=Math.acos(1-2*(i+.5)/128),theta=i*2.39996;return{dna:[Math.cos(a)*1.05,y,Math.sin(a)*1.05],network:[2.7*Math.sin(phi)*Math.cos(theta),2.7*Math.cos(phi),2.7*Math.sin(phi)*Math.sin(theta)]}});
  const pairs:number[][]=[];points.forEach((a,i)=>points.forEach((b,j)=>{if(j>i&&a.network.reduce((s,v,k)=>s+(v-b.network[k])**2,0)<2.3)pairs.push([i,j])}));
  const scroll=()=>{let n=0;const y=scrollY+innerHeight*.35;for(let i=0;i<sections.length-1;i++)if(y>=sections[i])n=i+Math.min(1,(y-sections[i])/(sections[i+1]-sections[i]));target=Math.min(1,Math.max(0,(n-1.1)/1.7))};
  const resize=()=>{w=canvas.clientWidth;h=canvas.clientHeight;const d=Math.min(devicePixelRatio,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);sections=Array.from(document.querySelectorAll('[data-stage]')).map(x=>x.getBoundingClientRect().top+scrollY);scroll()};
  const ro=new ResizeObserver(resize);ro.observe(document.body);resize();addEventListener('resize',resize);addEventListener('scroll',scroll,{passive:true});
  const render=(now:number)=>{frame=requestAnimationFrame(render);if(now-last<40||document.hidden)return;last=now;if(!still)t+=.006;p=still?target:p+(target-p)*.06;ctx.clearRect(0,0,w,h);const scale=Math.min(h*.103,w*.17),cx=w*.6,cy=h*.47;
   const coords=points.map(({dna,network})=>{const v=dna.map((x,i)=>x*(1-p)+network[i]*p),a=t+p;const xx=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=-v[0]*Math.sin(a)+v[2]*Math.cos(a),tilt=-.28+p*.2;const x=xx*Math.cos(tilt)-v[1]*Math.sin(tilt),y=xx*Math.sin(tilt)+v[1]*Math.cos(tilt),persp=10/(10-z);return{x:cx+x*scale*persp,y:cy+y*scale*persp,z,depth:persp}});
   const line=(i:number,j:number,alpha:number,width:number)=>{const a=coords[i],b=coords[j];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(66,137,255,${alpha})`;ctx.lineWidth=width;ctx.stroke()};
   pairs.forEach(([i,j])=>line(i,j,.22*p,.65));
   for(let i=0;i<128;i++){if(i+2<128)line(i,i+2,.7*(1-p)+.1,2.1*(1-p)+.4);if(i%2===0)line(i,i+1,.36*(1-p),.8)}
   coords.map((v,i)=>({...v,i})).sort((a,b)=>a.z-b.z).forEach(v=>{const brightness=.5+(v.z+3)/12,rad=2.1*v.depth;ctx.globalAlpha=brightness;const glow=ctx.createRadialGradient(v.x,v.y,0,v.x,v.y,rad*6);glow.addColorStop(0,'#c1e7ff');glow.addColorStop(.18,'#7abaff');glow.addColorStop(.35,'#327cf980');glow.addColorStop(1,'#327cf900');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(v.x,v.y,rad*6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#b0d9ff';ctx.beginPath();ctx.arc(v.x,v.y,rad*.7,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1;
  };frame=requestAnimationFrame(render);return()=>{cancelAnimationFrame(frame);ro.disconnect();removeEventListener('resize',resize);removeEventListener('scroll',scroll)};
 },[still]);return <canvas className="fallback-canvas" ref={ref} aria-hidden="true"/>;
}
