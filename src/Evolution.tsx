import {useEffect, useRef} from 'react';
import * as T from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {ROWS, COUNT, bonds, links, sample, stageProgress, clamp} from './evolution-model';

export default function Evolution({still, onFail}: {still: boolean; onFail: () => void}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current!;
    let renderer: T.WebGLRenderer;
    try { renderer = new T.WebGLRenderer({alpha: true, antialias: false, powerPreference: 'default'}); }
    catch { onFail(); return; }
    const mobile = innerWidth < 760;
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.5));
    renderer.setClearColor(0x05070d, 0);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    const scene = new T.Scene();
    scene.fog = new T.FogExp2(0x05070d, .035);
    const camera = new T.PerspectiveCamera(36, 1, .1, 60);
    const organism = new T.Group(); scene.add(organism);
    // A tiny procedural studio environment gives the metal actual reflections.
    const room = new RoomEnvironment(), pmrem = new T.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, .05);
    scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    scene.add(new T.AmbientLight(0x779bda, .6));
    const key = new T.PointLight(0xaddbff, 65, 25); key.position.set(3, 4, 5); scene.add(key);
    const rim = new T.PointLight(0x2463ff, 45, 20); rim.position.set(-4, -1, 2); scene.add(rim);
    const positions = new Float32Array(COUNT * 3);
    const nodeMaterial = new T.MeshStandardMaterial({color: 0x83baff, metalness: .85, roughness: .22, emissive: 0x1351b5, emissiveIntensity: .6});
    const nodes = new T.InstancedMesh(new T.IcosahedronGeometry(.05, 1), nodeMaterial, COUNT);
    nodes.instanceMatrix.setUsage(T.DynamicDrawUsage); nodes.frustumCulled = false; organism.add(nodes);
    const matrix = new T.Object3D();
    function lines(pairs: number[], color: number) {
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(pairs.length * 3), 3).setUsage(T.DynamicDrawUsage));
      const line = new T.LineSegments(geometry, new T.LineBasicMaterial({color, transparent: true, opacity: .3, blending: T.AdditiveBlending, depthWrite: false}));
      line.frustumCulled = false; organism.add(line); return line;
    }
    const rails = lines(bonds, 0x7fbaff), network = lines(links, 0x448dff);
    // Tubular backbones deform in-place, rather than fading a static helix away.
    const tubeMaterial = new T.MeshStandardMaterial({color: 0x163666, metalness: .95, roughness: .2, emissive: 0x11458c, emissiveIntensity: .65, transparent: true});
    const tubes: T.Mesh<T.BufferGeometry, T.MeshStandardMaterial>[] = [];
    const SIDES = 8;
    for (let strand = 0; strand < 2; strand++) {
      const g = new T.BufferGeometry(), indices: number[] = [];
      g.setAttribute('position', new T.BufferAttribute(new Float32Array(ROWS * SIDES * 3), 3).setUsage(T.DynamicDrawUsage));
      g.setAttribute('normal', new T.BufferAttribute(new Float32Array(ROWS * SIDES * 3), 3).setUsage(T.DynamicDrawUsage));
      for (let row = 0; row < ROWS - 1; row++) for (let j = 0; j < SIDES; j++) {
        const a = row * SIDES + j, b = row * SIDES + (j + 1) % SIDES;
        indices.push(a, b, a + SIDES, b, b + SIDES, a + SIDES);
      }
      g.setIndex(indices);
      const mesh = new T.Mesh(g, tubeMaterial); mesh.frustumCulled = false; tubes.push(mesh); organism.add(mesh);
    }
    const tangent = new T.Vector3(), normal = new T.Vector3(), binormal = new T.Vector3(), axis = new T.Vector3();
    function updateTubes() {
      tubes.forEach((mesh, strand) => {
        const a = mesh.geometry.attributes.position as T.BufferAttribute, n = mesh.geometry.attributes.normal as T.BufferAttribute;
        for (let row = 0; row < ROWS; row++) {
          const idx = (row * 2 + strand) * 3, before = (Math.max(0, row - 1) * 2 + strand) * 3, after = (Math.min(ROWS - 1, row + 1) * 2 + strand) * 3;
          tangent.set(positions[after] - positions[before], positions[after + 1] - positions[before + 1], positions[after + 2] - positions[before + 2]).normalize();
          axis.set(0, Math.abs(tangent.y) > .9 ? 0 : 1, Math.abs(tangent.y) > .9 ? 1 : 0);
          normal.crossVectors(tangent, axis).normalize(); binormal.crossVectors(tangent, normal).normalize();
          for (let j = 0; j < SIDES; j++) {
            const angle = j / SIDES * Math.PI * 2, c = Math.cos(angle), s = Math.sin(angle);
            const nx = normal.x * c + binormal.x * s, ny = normal.y * c + binormal.y * s, nz = normal.z * c + binormal.z * s;
            a.setXYZ(row * SIDES + j, positions[idx] + nx * .045, positions[idx + 1] + ny * .045, positions[idx + 2] + nz * .045);
            n.setXYZ(row * SIDES + j, nx, ny, nz);
          }
        }
        a.needsUpdate = true; n.needsUpdate = true;
      });
    }
    const spriteCanvas = document.createElement('canvas'); spriteCanvas.width = spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, '#effaff'); gradient.addColorStop(.12, '#82c5ff'); gradient.addColorStop(.4, '#367dce60'); gradient.addColorStop(1, '#00000000');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
    const texture = new T.CanvasTexture(spriteCanvas);
    const glowGeometry = new T.BufferGeometry(); glowGeometry.setAttribute('position', new T.BufferAttribute(positions, 3));
    const glowMaterial = new T.PointsMaterial({map: texture, size: .23, color: 0x89c5ff, transparent: true, blending: T.AdditiveBlending, depthWrite: false});
    const glow = new T.Points(glowGeometry, glowMaterial); glow.frustumCulled = false; organism.add(glow);
    const pulsePositions = new Float32Array(18 * 3), pulseGeometry = new T.BufferGeometry();
    pulseGeometry.setAttribute('position', new T.BufferAttribute(pulsePositions, 3));
    const pulses = new T.Points(pulseGeometry, new T.PointsMaterial({map: texture, color: 0xc4e7ff, size: .32, transparent: true, blending: T.AdditiveBlending, depthWrite: false}));
    pulses.frustumCulled = false; organism.add(pulses);
    const dustGeometry = new T.BufferGeometry(), dustPositions = new Float32Array((mobile ? 70 : 160) * 3);
    for (let i = 0; i < dustPositions.length; i++) dustPositions[i] = Math.sin(i * 127.31 + 1) * 11;
    dustGeometry.setAttribute('position', new T.BufferAttribute(dustPositions, 3));
    const dust = new T.Points(dustGeometry, new T.PointsMaterial({size: .025, color: 0x6e9fda, transparent: true, opacity: .35, depthWrite: false})); scene.add(dust);
    // Restrained bloom only on desktop; mobile retains inexpensive sprite halos.
    const composer = mobile ? null : new EffectComposer(renderer);
    let bloom: UnrealBloomPass | null = null;
    if (composer) {
      composer.addPass(new RenderPass(scene, camera));
      bloom = new UnrealBloomPass(new T.Vector2(1, 1), .3, .65, .85);
      composer.addPass(bloom); composer.addPass(new OutputPass());
    }
    let frame = 0, previous = 0, elapsed = 0, progress = 0, target = 0, mx = 0, my = 0, px = 0, py = 0, dirty = true;
    let tops: number[] = [];
    const scroll = () => { target = stageProgress(tops, scrollY); dirty = true; };
    const resize = () => {
      const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
      renderer.setSize(w, h); composer?.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      tops = Array.from(document.querySelectorAll('[data-stage]')).map(e => e.getBoundingClientRect().top + scrollY); scroll();
    };
    const pointer = (e: PointerEvent) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; };
    const ro = new ResizeObserver(resize); ro.observe(document.body); resize();
    addEventListener('resize', resize); addEventListener('scroll', scroll, {passive: true}); addEventListener('pointermove', pointer, {passive: true});
    const updateLines = (line: typeof rails, pairs: number[]) => {
      const a = line.geometry.attributes.position as T.BufferAttribute;
      for (let i = 0; i < pairs.length; i++) a.setXYZ(i, positions[pairs[i] * 3], positions[pairs[i] * 3 + 1], positions[pairs[i] * 3 + 2]);
      a.needsUpdate = true;
    };
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate);
      if (document.hidden) { previous = time; return; }
      if (time - previous < (mobile ? 32 : 16)) return;
      const dt = Math.min((time - previous) / 1000, .05); previous = time;
      if (still && !dirty) return;
      dirty = false;
      if (!still) elapsed += dt;
      const ease = 1 - Math.exp(-dt * 7);
      progress = still ? target : progress + (target - progress) * ease;
      px += (mx - px) * ease; py += (my - py) * ease;
      sample(progress, positions);
      const neural = clamp(1 - Math.abs(progress - 3)), body = 1 - neural;
      for (let i = 0; i < COUNT; i++) {
        matrix.position.fromArray(positions, i * 3); matrix.scale.setScalar(.75 + .2 * Math.sin(i * .9 + elapsed)); matrix.updateMatrix(); nodes.setMatrixAt(i, matrix.matrix);
      }
      nodes.instanceMatrix.needsUpdate = true; glowGeometry.attributes.position.needsUpdate = true;
      updateTubes(); updateLines(rails, bonds); updateLines(network, links);
      tubeMaterial.opacity = body * .92; tubes.forEach(t => t.visible = body > .02);
      rails.material.opacity = .32 * body + .025; network.material.opacity = neural * .44;
      glowMaterial.size = .2 + neural * .06;
      for (let i = 0; i < 18; i++) {
        const pairs = neural > .5 ? links : bonds;
        const t = (elapsed * .11 + i / 18) % 1, edge = Math.floor(t * pairs.length / 2) * 2, f = t * pairs.length / 2 % 1;
        for (let c = 0; c < 3; c++) pulsePositions[i * 3 + c] = T.MathUtils.lerp(positions[pairs[edge] * 3 + c], positions[pairs[edge + 1] * 3 + c], f);
      }
      pulseGeometry.attributes.position.needsUpdate = true;
      organism.rotation.set(.08 + Math.sin(progress * 1.3) * .2 + (still ? 0 : py * .09), elapsed * .09 + progress * .48, -.22 + Math.sin(progress) * .16);
      organism.position.set(mobile ? 0 : 1.15 - Math.sin(progress * .8) * .3, Math.sin(progress * 1.4) * .16, 0);
      camera.position.set(still ? 0 : px * .45, Math.sin(progress * 1.2) * .35, (mobile ? 17 : 14.2) - Math.sin(progress * Math.PI / 4) * 1.1 + Math.max(0, progress - 3) * 1.1);
      camera.lookAt(.25, 0, 0);
      dust.rotation.y = elapsed * .008;
      key.position.x = 3 + Math.sin(elapsed * .3) * 1.5;
      if (bloom) bloom.strength = .26 + neural * .12;
      if (composer) composer.render(); else renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    const lost = (e: Event) => { e.preventDefault(); onFail(); };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    return () => {
      cancelAnimationFrame(frame); ro.disconnect(); removeEventListener('resize', resize); removeEventListener('scroll', scroll); removeEventListener('pointermove', pointer);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      scene.traverse(o => {const m = o as T.Mesh; m.geometry?.dispose(); if(m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach(x => x.dispose());});
      composer?.passes.forEach(p => p.dispose()); composer?.dispose(); texture.dispose(); environment.dispose(); renderer.dispose(); el.replaceChildren();
    };
  }, [still, onFail]);
  return <div className="three-host" ref={host} aria-hidden="true"/>;
}
