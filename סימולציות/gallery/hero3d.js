/* ==========================================================================
   gallery/hero3d.js — ההמחשה החיה בדף הנחיתה
   כף יד אנושית (מודל תלת-ממדי אמיתי עם שלד) בסגנון הולוגרמה מרשת לייזר:
   שוליים זוהרים, רשת משולשים, הבזקים בקצות האצבעות ורשת "מתפרקת" בשורש כף היד.
   גב היד כלפי מטה, והאצבעות כלפי מעלה "ממששות" כדור קטן ודמיוני.
   אפשר לסובב (גרירה), להתקרב ולהתרחק (גלגלת / צביטה). היד מסתובבת לאט לבד.
   מקור המודל: WebXR Input Profiles (generic-hand, רישיון MIT), מוטמע ב-gallery/handModel.js.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.THREE || !THREE.GLTFLoader) return;
  const $ = id => document.getElementById(id);
  const canvas = $('heroCanvas'), box = $('hero3d');
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S = {play:!reduced, speed:1, lam:532};
  const MODEL = 'https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/generic-hand/right.glb';   // גיבוי, אם הקובץ המקומי חסר

  /* ---------- צבע לייזר לפי אורך גל ---------- */
  function wlColor(l){
    let r = 0, g = 0, b = 0;
    if (l < 440){ r = -(l - 440)/60; b = 1; } else if (l < 490){ g = (l - 440)/50; b = 1; } else if (l < 510){ g = 1; b = -(l - 510)/20; }
    else if (l < 580){ r = (l - 510)/70; g = 1; } else if (l < 645){ r = 1; g = -(l - 645)/65; } else r = 1;
    const m = Math.max(r, g, b) || 1; return new THREE.Color(r/m, g/m, b/m);
  }
  const NAMES = [[450, 'סגול-כחול'], [495, 'כחול'], [520, 'טורקיז'], [570, 'ירוק'], [590, 'צהוב'], [625, 'כתום'], [701, 'אדום']];
  const nameOf = l => NAMES.find(n => l < n[0])[1];

  /* ---------- סצנה, מצלמה ושליטה בעכבר ---------- */
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  // רזולוציה מוגבלת: הזוהר מרכך את הקווים ממילא, וכך כל פריים זול בהרבה
  const PR = Math.min(1.25, window.devicePixelRatio || 1);
  renderer.setPixelRatio(PR);
  renderer.setClearColor(0x030806, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 100);
  camera.position.set(0, 1.4, 7.5);
  const controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, canvas) : null;
  if (controls){
    controls.target.set(0, 0.1, 0); controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.enablePan = false; controls.minDistance = 2.5; controls.maxDistance = 16;
    controls.autoRotate = S.play; controls.autoRotateSpeed = 0.7;            // סיבוב איטי במרחב
  }
  let composer = null;
  if (THREE.EffectComposer && THREE.UnrealBloomPass && THREE.RenderPass){
    composer = new THREE.EffectComposer(renderer); composer.setPixelRatio(PR);
    composer.addPass(new THREE.RenderPass(scene, camera));
    composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(512, 512), 0.75, 0.3, 0.4));
  }

  /* ---------- חומרים: שוליים זוהרים + רשת (שניהם עוקבים אחרי השלד) ---------- */
  const U = {uColor:{value:new THREE.Color()}};
  const rimMat = new THREE.ShaderMaterial({
    uniforms:U, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:`#include <common>
      #include <skinning_pars_vertex>
      varying vec3 vN; varying vec3 vV;
      void main(){
        #include <beginnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>
        vN = normalize(transformedNormal); vV = normalize(-mvPosition.xyz);
      }`,
    fragmentShader:`uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
        gl_FragColor = vec4(uColor*(0.03 + 0.95*f) + vec3(0.4)*pow(f, 7.0), 1.0); }`
  });
  rimMat.skinning = true;
  const wireMat = new THREE.MeshBasicMaterial({wireframe:true, transparent:true, opacity:0.28, blending:THREE.AdditiveBlending, depthWrite:false});
  wireMat.skinning = true;

  /* ---------- הבזקים, ניצוצות ---------- */
  function tex(draw){ const c = document.createElement('canvas'); c.width = 128; c.height = 128; draw(c.getContext('2d')); return new THREE.CanvasTexture(c); }
  const dotT = tex(g => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const streakT = tex(g => { const gr = g.createLinearGradient(0, 0, 128, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 60, 128, 8); });
  const spr = (t, op) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({map:t, transparent:true, opacity:op, blending:THREE.AdditiveBlending, depthWrite:false})); scene.add(s); return s; };
  const flares = Array.from({length:5}, () => ({dot:spr(dotT, 0.75), streak:spr(streakT, 0.4)}));
  const NS = 70, sPos = new Float32Array(NS*3), sSeed = [];
  for (let i = 0; i < NS; i++) sSeed.push([(Math.random() - 0.5)*7, (Math.random() - 0.4)*3.4, (Math.random() - 0.5)*4, Math.random()*6.28]);
  const sGeo = new THREE.BufferGeometry(); sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const sparks = new THREE.Points(sGeo, new THREE.PointsMaterial({size:0.022, transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false}));
  sparks.frustumCulled = false; scene.add(sparks);
  let netMat = null;

  function applyColor(){
    const c = wlColor(S.lam);
    U.uColor.value.copy(c); wireMat.color.copy(c); sparks.material.color.copy(c); if (netMat) netMat.color.copy(c);
    flares.forEach(f => { f.dot.material.color.copy(c); f.streak.material.color.copy(c); });
    document.documentElement.style.setProperty('--laser', '#' + c.getHexString());
    $('lamV').textContent = S.lam + ' nm'; $('lamName').textContent = 'לייזר ' + nameOf(S.lam) + ' · ' + S.lam + ' nm';
  }

  /* ---------- טעינת היד ---------- */
  const handRoot = new THREE.Group(); scene.add(handRoot);
  // כיוון: כף היד (‎−x במודל) כלפי מעלה, האצבעות (‎−y במודל) לכיוון שמאל, ומעט הטיה אל הצופה
  handRoot.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1)))
    .premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.55));
  handRoot.scale.setScalar(17);
  const FING = ['index-finger', 'middle-finger', 'ring-finger', 'pinky-finger'];
  const PARTS = ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'];
  let chains = null, thumbChain = null;       // לכל שרשרת: עצמות + מיקום/כיוון במצב המקורי
  const PALM_N = new THREE.Vector3(-1, 0, 0); // צד כף היד במודל

  function onModel(gltf){
    const model = gltf.scene; let skinned = null;
    model.traverse(o => { if (o.isSkinnedMesh) skinned = o; });
    if (!skinned) return;
    skinned.material = rimMat; skinned.frustumCulled = false;
    const wire = new THREE.SkinnedMesh(skinned.geometry, wireMat);
    wire.bind(skinned.skeleton, skinned.bindMatrix); wire.frustumCulled = false;
    skinned.parent.add(wire); wire.position.copy(skinned.position); wire.quaternion.copy(skinned.quaternion); wire.scale.copy(skinned.scale);
    const get = n => model.getObjectByName(n);
    const mk = names => names.map(n => get(n)).filter(Boolean).map(b => ({b, p0:b.position.clone(), q0:b.quaternion.clone()}));
    chains = FING.map(f => mk(PARTS.map(p => f + '-' + p)));
    thumbChain = mk(['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip']);
    // רשת "מתפרקת" קצרה בשורש כף היד (במערכת הצירים של המודל: האמה לכיוון ‎+y)
    const w = get('wrist'); const c0 = w ? w.position.clone() : new THREE.Vector3();
    const pts = []; for (let i = 0; i < 26; i++){ const a = Math.random()*2*Math.PI, y = Math.random()*0.045, r = 0.022 + 0.3*y + 0.006*Math.random(); pts.push(new THREE.Vector3(c0.x + r*Math.cos(a), c0.y - 0.01 + y, c0.z + 1.3*r*Math.sin(a))); }
    const P = [], C = [];
    pts.forEach(p => pts.map(q => [q, p.distanceTo(q)]).filter(x => x[1] > 0).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([q]) => {
      const fa = Math.max(0, 1 - (p.y - c0.y)/0.04), fb = Math.max(0, 1 - (q.y - c0.y)/0.04); P.push(p.x, p.y, p.z, q.x, q.y, q.z); C.push(fa, fa, fa, fb, fb, fb); }));
    const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); ng.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
    netMat = new THREE.LineBasicMaterial({vertexColors:true, transparent:true, opacity:0.4, blending:THREE.AdditiveBlending, depthWrite:false});
    model.add(new THREE.LineSegments(ng, netMat));
    // מרכז את היד סביב נקודת הסיבוב
    handRoot.add(model); handRoot.updateMatrixWorld(true);
    const ctr = new THREE.Vector3(), m1 = new THREE.Vector3(); (w || chains[1][0].b).getWorldPosition(ctr); chains[1][1].b.getWorldPosition(m1); ctr.lerp(m1, 0.75);   // מרכז כף היד
    handRoot.position.sub(ctr).add(new THREE.Vector3(0, 0.1, 0));
    applyColor(); draw();
    requestAnimationFrame(() => box.classList.add('live'));        // מחליפים את תמונת הפתיחה ביד החיה
  }
  const onErr = err => console.warn('hand model failed to load', err);
  if (window.HAND_GLB_B64){
    const bin = atob(window.HAND_GLB_B64), buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    new THREE.GLTFLoader().parse(buf.buffer, '', onModel, onErr);
  } else new THREE.GLTFLoader().load(MODEL, onModel, undefined, onErr);

  /* ---------- קינמטיקה: כל מפרק מסובב את כל מה שאחריו ---------- */
  const qT = new THREE.Quaternion(), vT = new THREE.Vector3(), axisT = new THREE.Vector3();
  function bendChain(ch, angles, spread){
    ch.forEach(j => { j.b.position.copy(j.p0); j.b.quaternion.copy(j.q0); });
    // ציר כיפוף: ניצב לכיוון האצבע ולנורמל של כף היד (כך שהקצה נע לצד כף היד)
    const dir = vT.copy(ch[ch.length - 1].p0).sub(ch[1].p0).normalize();
    const flexAxis = new THREE.Vector3().crossVectors(dir, PALM_N).normalize();
    if (spread){ applyRot(ch, 1, PALM_N, spread); }
    angles.forEach((a, k) => { const pivot = k + 1; if (pivot < ch.length - 1) applyRot(ch, pivot, flexAxis, a); });
  }
  function applyRot(ch, pivot, axis, a){
    qT.setFromAxisAngle(axis, a); const pv = ch[pivot].b.position.clone();
    for (let k = pivot; k < ch.length; k++){
      if (k > pivot) ch[k].b.position.sub(pv).applyQuaternion(qT).add(pv);
      ch[k].b.quaternion.premultiply(qT);
    }
    axis.applyQuaternion(qT);
  }
  function pose(t){
    if (!chains) return;
    chains.forEach((ch, i) => {
      const ph = t*1.5 - i*0.85;                                  // גל איטי בין האצבעות, כמו גלגול כדור קטן בקצות האצבעות
      bendChain(ch, [0.62 + 0.16*Math.sin(ph), 0.72 + 0.18*Math.sin(ph - 0.6), 0.48 + 0.14*Math.sin(ph - 1.1)], 0.04*Math.sin(ph + 0.8));
    });
    const tt = t*1.5 + 0.6;                                       // האגודל "משפשף" מול האצבעות
    bendChain(thumbChain, [0.32 + 0.14*Math.sin(tt), 0.35 + 0.16*Math.sin(tt - 0.6)], 0.05*Math.sin(tt));
      }
  function fx(t){
    if (chains){
      [...chains.map(c => c[c.length - 1]), thumbChain[thumbChain.length - 1]].forEach((j, i) => {
        j.b.getWorldPosition(vT); const f = flares[i], tw = 0.75 + 0.25*Math.sin(t*3 + i*1.7);
        f.dot.position.copy(vT); f.dot.scale.set(0.3*tw, 0.3*tw, 1); f.streak.position.copy(vT); f.streak.scale.set(1.4*tw, 1.4*tw, 1);
      });
    }
    for (let i = 0; i < NS; i++){ const d = sSeed[i]; sPos[i*3] = d[0] + 0.12*Math.sin(t*0.4 + d[3]); sPos[i*3 + 1] = d[1] + 0.12*Math.cos(t*0.3 + d[3]); sPos[i*3 + 2] = d[2]; }
    sGeo.attributes.position.needsUpdate = true;
  }

  /* ---------- פקדים ---------- */
  let t = 0.8, last = performance.now(), visible = true;
  function draw(){ pose(t); scene.updateMatrixWorld(true); fx(t); if (composer) composer.render(); else renderer.render(scene, camera); }
  function setPlay(p){ S.play = p; if (controls) controls.autoRotate = p; $('icPause').classList.toggle('hidden', !p); $('icPlay').classList.toggle('hidden', p); }
  $('playBtn').addEventListener('click', () => setPlay(!S.play));
  $('spd').addEventListener('input', e => { S.speed = +e.target.value; if (controls) controls.autoRotateSpeed = 0.7*S.speed; $('spdV').textContent = '×' + S.speed.toFixed(2); });
  $('lam').addEventListener('input', e => { S.lam = +e.target.value; applyColor(); });
  $('spdV').textContent = '×1.00'; setPlay(S.play); applyColor();

  /* ---------- לולאה ---------- */
  function resize(){
    const w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); if (composer) composer.setSize(w, h);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(box);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(box);
  function frame(now){
    requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(0.05, (now - last)/1000)); last = now;
    if (!visible || document.hidden) return;
    if (S.play) t += dt*S.speed;
    if (controls) controls.update();                              // גם בעצירה אפשר לסובב ולהתקרב
    draw();
  }
  resize();
  requestAnimationFrame(frame);
})();
