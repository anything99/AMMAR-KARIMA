/* AMMAR × KARIMA | Aero Shards-inspired background
   Original React Bits reference: https://github.com/DavidHDev/react-bits/tree/main/src/content/Backgrounds/AeroShards
   Ported to the site's existing vanilla HTML + Three.js setup. This is an adaptation, not the React/vgpu component.
   Free dependencies already used by the site: Three.js r128. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (!window.THREE || document.getElementById('aero-shards-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'aero-shards-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  let renderer, scene, camera, shards = [], raf = 0;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !coarse, powerPreference: 'low-power' });
  } catch (error) {
    canvas.remove();
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.6));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 1600);
  camera.position.set(0, 0, 520);

  scene.add(new THREE.AmbientLight(0x9c7bb8, 1.2));
  const key = new THREE.PointLight(0xffa8d0, 2.8, 1000);
  key.position.set(-210, 170, 230);
  scene.add(key);
  const rim = new THREE.PointLight(0x8f72ff, 2.2, 1000);
  rim.position.set(220, -120, 120);
  scene.add(rim);

  const palette = [0xffc6e0, 0xc6b3ff, 0x9f8dff, 0xff8fc4, 0xf8eaff];
  const count = coarse ? 13 : 23;
  const rand = (min, max) => min + Math.random() * (max - min);

  function makeShard(index) {
    const group = new THREE.Group();
    const width = rand(22, coarse ? 62 : 88);
    const height = rand(44, coarse ? 104 : 150);
    const shape = new THREE.Shape();
    shape.moveTo(rand(-width*.25, width*.1), -height*.5);
    shape.lineTo(width*.5, rand(-height*.15, height*.45));
    shape.lineTo(rand(-width*.1, width*.3), height*.5);
    shape.lineTo(-width*.5, rand(-height*.1, height*.25));
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape, 1);
    const color = palette[index % palette.length];
    const material = new THREE.MeshPhongMaterial({
      color, emissive: color, emissiveIntensity: 0.12,
      specular: 0xffffff, shininess: 110,
      transparent: true, opacity: rand(0.12, 0.3),
      side: THREE.DoubleSide, depthWrite: false
    });
    const face = new THREE.Mesh(geometry, material);
    group.add(face);

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xffd8ee, transparent: true, opacity: rand(0.22, 0.55) })
    );
    outline.position.z = 1.2;
    group.add(outline);

    group.position.set(rand(-innerWidth*.65, innerWidth*.65), rand(-innerHeight*.7, innerHeight*.7), rand(-220, 160));
    group.rotation.set(rand(-1, 1), rand(-1, 1), rand(-Math.PI, Math.PI));
    group.userData = {
      baseX: group.position.x, baseY: group.position.y, baseZ: group.position.z,
      drift: rand(0.14, 0.5), phase: rand(0, Math.PI * 2),
      rx: rand(-0.0025, 0.0025), ry: rand(-0.003, 0.003),
      rz: rand(-0.002, 0.002), scale: rand(0.72, 1.32)
    };
    group.scale.setScalar(group.userData.scale);
    scene.add(group);
    shards.push(group);
  }

  for (let i = 0; i < count; i++) makeShard(i);

  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  window.addEventListener('pointermove', event => {
    targetX = (event.clientX / innerWidth - 0.5) * 2;
    targetY = (event.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight);
    camera.aspect = w / h;
    camera.position.z = Math.max(480, w * 0.62);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    shards.forEach(s => {
      s.userData.baseX = Math.max(-w * .68, Math.min(w * .68, s.userData.baseX));
      s.userData.baseY = Math.max(-h * .72, Math.min(h * .72, s.userData.baseY));
    });
  }
  window.addEventListener('resize', resize, { passive: true });

  const start = performance.now();
  function draw(now) {
    const t = (now - start) * 0.001;
    pointerX += (targetX - pointerX) * 0.025;
    pointerY += (targetY - pointerY) * 0.025;
    camera.position.x = pointerX * -18;
    camera.position.y = pointerY * -12;
    camera.lookAt(0, 0, 0);

    if (!reduced) {
      shards.forEach(s => {
        const d = s.userData;
        s.position.x = d.baseX + Math.sin(t * d.drift + d.phase) * 18 + pointerX * (d.baseZ * -0.035);
        s.position.y = d.baseY + Math.cos(t * d.drift * .8 + d.phase) * 22 - pointerY * (d.baseZ * -0.025);
        s.rotation.x += d.rx;
        s.rotation.y += d.ry;
        s.rotation.z += d.rz;
      });
    }
    renderer.render(scene, camera);
    if (!reduced) raf = requestAnimationFrame(draw);
  }

  draw(performance.now());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduced) raf = requestAnimationFrame(draw);
  });
})();