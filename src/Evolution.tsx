import { useEffect, useRef } from 'react';
import * as T from 'three';

// One scene, one animation loop. Scroll mutates GPU buffers, never React state.
export default function Evolution({still,onFail}:{still:boolean;onFail:()=>void}) {
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=host.current!; let renderer:T.WebGLRenderer;
  try { renderer=new T.WebGLRenderer({alpha:true,antialias:window.innerWidth>700,powerPreference:'low-power'}); } catch {onFail();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,window.innerWidth<700?1.25:1.75));
  renderer.setClearColor(0x05070d,0); renderer.outputColorSpace=T.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.fog=new T.FogExp2(0x05070d,.018);
  const camera=new T.PerspectiveCamera(35,1,.1,80);camera.position.z=14;
  const organism=new T.Group();scene.add(organism);
  scene.add(new T.AmbientLight(0x537bbd,2));
  const light=new T.PointLight(0x8acaff,45,20);light.position.set(3,3,5);scene.add(light);
  const rim=new T.PointLight(0x164dff,50,20);rim.position.set(-3,-2,2);scene.add(rim);
  const rows=100,count=rows*2, positions=new Float32Array(count*3),dna=new Float32Array(count*3),neural=new Float32Array(count*3);
  for(let i=0;i<count;i++){
   const row=Math.floor(i/2),strand=i%2, y=(row/(rows-1)-.5)*7,angle=row*.115+strand*Math.PI;
   dna.set([Math.cos(angle)*1.05,y,Math.sin(angle)*1.05],i*3);
   const phi=Math.acos(1-2*(i+.5)/count),theta=i*2.39996323;
   const r=2.6+.27*Math.sin(i*3.7);
   neural.set([r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta)],i*3);
  }
  const geometry=new T.IcosahedronGeometry(.055,1),material=new T.MeshStandardMaterial({color:0x79bdff,metalness:.85,roughness:.2,emissive:0x247aff,emissiveIntensity:1.2});
  const nodes=new T.InstancedMesh(geometry,material,count);nodes.frustumCulled=false;organism.add(nodes);
  const matrix=new T.Object3D();
  const pairs:number[]=[];
  for(let i=0;i<count;i++){
   if(i+2<count)pairs.push(i,i+2);
   if(i%2===0)pairs.push(i,i+1);
  }
  const networkPairs:number[]=[];
  for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){
   const dx=neural[i*3]-neural[j*3],dy=neural[i*3+1]-neural[j*3+1],dz=neural[i*3+2]-neural[j*3+2];
   if(dx*dx+dy*dy+dz*dz<1.8)networkPairs.push(i,j);
  }
  const makeLines=(p:number[],color:number,opacity:number)=>{
   const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(p.length*3),3));
   const m=new T.LineBasicMaterial({color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false});
   const l=new T.LineSegments(g,m);l.frustumCulled=false;organism.add(l);return l;
  };
  const rails=makeLines(pairs,0x7abfff,.7),network=makeLines(networkPairs,0x398aff,0);
  // Parallel micro-filaments give the backbone a physically dimensional surface.
  const backbones:T.Mesh<T.TubeGeometry,T.MeshStandardMaterial>[]=[];
  for(let strand=0;strand<2;strand++){const pts=[];for(let i=0;i<180;i++){const a=i/179*99*.115+strand*Math.PI;pts.push(new T.Vector3(Math.cos(a)*1.05,(i/179-.5)*7,Math.sin(a)*1.05));}const curve=new T.CatmullRomCurve3(pts);const mesh=new T.Mesh(new T.TubeGeometry(curve,180,.035,6,false),new T.MeshStandardMaterial({color:0x1f4c96,metalness:.9,roughness:.18,emissive:0x1265dd,emissiveIntensity:.7,transparent:true}));organism.add(mesh);backbones.push(mesh);}
  const filaments:T.Line[]=[];
  for(let strand=0;strand<2;strand++)for(let k=0;k<10;k++){
   const pts=[];for(let i=0;i<180;i++){const y=(i/179-.5)*7,a=i/179*99*.115+strand*Math.PI;const r=1.05+Math.cos(k/10*Math.PI*2)*.055;pts.push(new T.Vector3(Math.cos(a)*r,y+Math.sin(k/10*Math.PI*2)*.055,Math.sin(a)*r));}
   const l=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:k%3===0?0xa7d8ff:0x2563eb,transparent:true,opacity:.8,blending:T.AdditiveBlending}));organism.add(l);filaments.push(l);
  }
  const texCanvas=document.createElement('canvas');texCanvas.width=64;texCanvas.height=64;const ctx=texCanvas.getContext('2d')!;const grad=ctx.createRadialGradient(32,32,0,32,32,32);grad.addColorStop(0,'white');grad.addColorStop(.13,'#80caff');grad.addColorStop(.4,'#1a59b980');grad.addColorStop(1,'#00000000');ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);const tex=new T.CanvasTexture(texCanvas);
  const glowG=new T.BufferGeometry();glowG.setAttribute('position',new T.BufferAttribute(positions,3));
  const glows=new T.Points(glowG,new T.PointsMaterial({map:tex,color:0x65aaff,size:.34,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));glows.frustumCulled=false;organism.add(glows);
  const starsG=new T.BufferGeometry(),stars=new Float32Array(180*3);for(let i=0;i<stars.length;i++)stars[i]=Math.sin(i*137.27)*18;starsG.setAttribute('position',new T.BufferAttribute(stars,3));scene.add(new T.Points(starsG,new T.PointsMaterial({color:0x6797c9,size:.018,transparent:true,opacity:.45})));
  let target=0,progress=0,mx=0,my=0,frame=0,last=0,elapsed=0;const start=performance.now();
  const bounds:{top:number}[]=[];
  const scroll=()=>{const y=scrollY+innerHeight*.35;let p=0;for(let i=0;i<bounds.length-1;i++)if(y>=bounds[i].top)p=i+Math.min(1,(y-bounds[i].top)/Math.max(1,bounds[i+1].top-bounds[i].top));target=Math.min(4,p);};
  const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();bounds.splice(0,bounds.length,...Array.from(document.querySelectorAll('[data-stage]')).map(e=>({top:e.getBoundingClientRect().top+scrollY})));scroll();};
  const pointer=(e:PointerEvent)=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5);};
  resize();const ro=new ResizeObserver(resize);ro.observe(document.body);window.addEventListener('resize',resize);window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('pointermove',pointer,{passive:true});
  const updateLines=(l:T.LineSegments,p:number[])=>{const a=l.geometry.attributes.position as T.BufferAttribute;for(let i=0;i<p.length;i++){a.setXYZ(i,positions[p[i]*3],positions[p[i]*3+1],positions[p[i]*3+2]);}a.needsUpdate=true;};
  const animate=(time:number)=>{
   frame=requestAnimationFrame(animate);if(document.hidden||time-last<(innerWidth<700?32:16))return;last=time;
   if(!still)elapsed+=.016;
   progress=still?target:progress+(target-progress)*.065;
   const morph=T.MathUtils.smoothstep(progress,1.1,2.8),birth=still?1:T.MathUtils.smoothstep((time-start)/1000,0,1.8);
   const spread=.025+.975*birth;
   for(let i=0;i<count;i++){
    for(let j=0;j<3;j++)positions[i*3+j]=T.MathUtils.lerp(dna[i*3+j],neural[i*3+j],morph)*spread;
    matrix.position.fromArray(positions,i*3);matrix.scale.setScalar(.7+.35*Math.sin(i*.8+elapsed*2));matrix.updateMatrix();nodes.setMatrixAt(i,matrix.matrix);
   }
   nodes.instanceMatrix.needsUpdate=true;glowG.attributes.position.needsUpdate=true;updateLines(rails,pairs);updateLines(network,networkPairs);
   backbones.forEach(mesh=>{mesh.material.opacity=(1-morph)*birth;mesh.scale.setScalar(spread);});
   rails.material.opacity=.65*(1-morph)+.12;network.material.opacity=morph*.3;
   filaments.forEach(l=>{(l.material as T.LineBasicMaterial).opacity=(1-morph)*.8*birth;l.scale.setScalar(spread);});
   organism.rotation.set(.08+(still?0:my*.13),elapsed*.14+progress*.65,-.32+Math.sin(progress*.9)*.25);
   organism.position.x=innerWidth<700?0:1.25-Math.sin(progress*.7)*.6;
   camera.position.z=innerWidth<700?17:14+Math.sin(progress)*.8+Math.max(0,progress-3)*1.5;
   camera.position.x=still?0:mx*.3;light.position.x=3+Math.sin(elapsed)*2;renderer.render(scene,camera);
  };frame=requestAnimationFrame(animate);
  const lost=(e:Event)=>{e.preventDefault();onFail();};renderer.domElement.addEventListener('webglcontextlost',lost);
  return()=>{cancelAnimationFrame(frame);ro.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('scroll',scroll);window.removeEventListener('pointermove',pointer);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{const m=o as T.Mesh;if(m.geometry)m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());});tex.dispose();renderer.dispose();el.replaceChildren();};
 },[still,onFail]);
 return <div className="three-host" ref={host} aria-hidden="true"/>;
}
