/**
 * device3d.js
 * Laptop 3D premium con Three.js — OrbitControls, pantalla con screenshot real.
 * Importado como módulo ES desde main.js.
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const SCREENSHOTS = [
  "assets/projects/juanadiaz.png",
  "assets/projects/khrizstudio.png",
  "assets/projects/geekcollector.png",
  "assets/projects/wrestling.png",
  "assets/projects/twokbsn.png",
];

export function initDevice3D(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const W = () => container.clientWidth;
  const H = () => container.clientHeight;

  /* ── Renderer ───────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  /* ── Scene & Camera ─────────────────────────────────────── */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(28, W() / H(), 0.1, 100);
  camera.position.set(0, 1.4, 5.8);

  /* ── Controls ───────────────────────────────────────────── */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 3.5;
  controls.maxDistance = 9;
  controls.minPolarAngle = Math.PI * 0.25;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;
  controls.target.set(0, 0.3, 0);

  // Stop auto-rotate when user touches; restart after idle
  let autoRotateTimer = null;
  const stopAuto = () => {
    controls.autoRotate = false;
    clearTimeout(autoRotateTimer);
    autoRotateTimer = setTimeout(() => { controls.autoRotate = true; }, 4000);
  };
  renderer.domElement.addEventListener("pointerdown", stopAuto, { passive: true });

  /* ── Lights ─────────────────────────────────────────────── */
  const ambient = new THREE.AmbientLight(0xfaf6ee, 0.55);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xfff8f0, 2.0);
  key.position.set(3, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 30;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xe8d4f8, 0.6);
  fill.position.set(-4, 2, -2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xd4b07a, 0.9);
  rim.position.set(0, -1, -5);
  scene.add(rim);

  /* ── Materials ──────────────────────────────────────────── */
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1c1e22,
    roughness: 0.2,
    metalness: 0.92,
    envMapIntensity: 1,
  });

  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x2a2d32,
    roughness: 0.35,
    metalness: 0.7,
  });

  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x0d0f12,
    roughness: 0.6,
    metalness: 0.2,
  });

  const keyboardMat = new THREE.MeshStandardMaterial({
    color: 0x1a1c20,
    roughness: 0.8,
    metalness: 0.1,
  });

  const trackpadMat = new THREE.MeshStandardMaterial({
    color: 0x222428,
    roughness: 0.25,
    metalness: 0.55,
  });

  const screenOffMat = new THREE.MeshStandardMaterial({
    color: 0x060810,
    roughness: 0.05,
    metalness: 0.0,
  });

  /* ── Screen texture (screenshot) ────────────────────────── */
  const loader = new THREE.TextureLoader();
  let screenMat = new THREE.MeshStandardMaterial({
    color: 0x060810,
    roughness: 0.05,
    metalness: 0.0,
    emissive: 0x060810,
    emissiveIntensity: 0.8,
  });

  // Pick a random screenshot
  const shotPath = SCREENSHOTS[Math.floor(Math.random() * SCREENSHOTS.length)];
  loader.load(shotPath, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    screenMat.map = tex;
    screenMat.emissiveMap = tex;
    screenMat.emissiveIntensity = 0.55;
    screenMat.color.set(0xffffff);
    screenMat.emissive.set(0x888888);
    screenMat.needsUpdate = true;
  });

  /* ── Laptop geometry ────────────────────────────────────── */
  const laptop = new THREE.Group();
  scene.add(laptop);

  // Dimensions (units = dm for nice scale)
  const LW = 2.8;  // lid width
  const LH = 1.85; // lid height
  const LD = 0.06; // lid depth
  const BW = 2.8;  // base width
  const BH = 0.12; // base height
  const BD = 1.9;  // base depth
  const BEVEL = 0.04;

  /* Lid group */
  const lid = new THREE.Group();
  lid.position.set(0, BH / 2 + LH / 2 - 0.05, -BD / 2 + LD / 2);
  lid.rotation.x = -Math.PI * 0.08; // slight tilt open
  laptop.add(lid);

  // Lid shell (back)
  const lidGeo = new THREE.BoxGeometry(LW, LH, LD, 1, 1, 1);
  const lidMesh = new THREE.Mesh(lidGeo, bodyMat);
  lidMesh.castShadow = true;
  lid.add(lidMesh);

  // Bezel frame inside lid
  const bezelOuter = new THREE.BoxGeometry(LW - 0.02, LH - 0.02, LD * 0.4);
  const bezelMesh = new THREE.Mesh(bezelOuter, bezelMat);
  bezelMesh.position.z = LD * 0.31;
  lid.add(bezelMesh);

  // Screen panel (inset)
  const scrnW = LW * 0.88;
  const scrnH = LH * 0.84;
  const scrnGeo = new THREE.BoxGeometry(scrnW, scrnH, 0.002);
  const scrnMesh = new THREE.Mesh(scrnGeo, screenMat);
  scrnMesh.position.set(0, LH * 0.02, LD * 0.52);
  lid.add(scrnMesh);

  // Screen glare overlay
  const glareGeo = new THREE.PlaneGeometry(scrnW, scrnH);
  const glareMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.03,
    depthWrite: false,
  });
  const glareMesh = new THREE.Mesh(glareGeo, glareMat);
  glareMesh.position.set(0, LH * 0.02, LD * 0.54);
  lid.add(glareMesh);

  // Camera dot
  const camGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.015, 16);
  const camMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.4, metalness: 0.3 });
  const camMesh = new THREE.Mesh(camGeo, camMat);
  camMesh.rotation.x = Math.PI / 2;
  camMesh.position.set(0, LH / 2 - 0.1, LD * 0.52);
  lid.add(camMesh);

  // Camera lens glint
  const lensGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.001, 12);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x3a4060, roughness: 0.1, metalness: 0.8 });
  const lensMesh = new THREE.Mesh(lensGeo, lensMat);
  lensMesh.rotation.x = Math.PI / 2;
  lensMesh.position.set(0, LH / 2 - 0.1, LD * 0.525);
  lid.add(lensMesh);

  /* Base group */
  const base = new THREE.Group();
  laptop.add(base);

  // Base shell
  const baseGeo = new THREE.BoxGeometry(BW, BH, BD);
  const baseMesh = new THREE.Mesh(baseGeo, bodyMat);
  baseMesh.position.y = BH / 2;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  base.add(baseMesh);

  // Inner deck (palm rest surface)
  const deckGeo = new THREE.BoxGeometry(BW - 0.06, 0.008, BD - 0.06);
  const deckMesh = new THREE.Mesh(deckGeo, innerMat);
  deckMesh.position.y = BH + 0.001;
  base.add(deckMesh);

  // Keyboard area
  const kbW = BW * 0.82;
  const kbD = BD * 0.6;
  const kbGeo = new THREE.BoxGeometry(kbW, 0.006, kbD);
  const kbMesh = new THREE.Mesh(kbGeo, keyboardMat);
  kbMesh.position.set(0, BH + 0.005, -BD * 0.08);
  base.add(kbMesh);

  // Individual key rows (simplified, 4 rows)
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x252830, roughness: 0.7, metalness: 0.1 });
  const keyW = 0.12, keyH = 0.004, keyD = 0.11;
  const cols = 13, rows = 4;
  const gapX = (kbW - cols * keyW) / (cols - 1);
  const gapZ = (kbD - rows * keyD) / (rows - 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const kg = new THREE.BoxGeometry(keyW - 0.01, keyH, keyD - 0.01);
      const km = new THREE.Mesh(kg, keyMat);
      km.position.set(
        -kbW / 2 + c * (keyW + gapX) + keyW / 2,
        BH + 0.009,
        -kbD / 2 + r * (keyD + gapZ) + keyD / 2 - BD * 0.08
      );
      base.add(km);
    }
  }

  // Space bar
  const sbGeo = new THREE.BoxGeometry(kbW * 0.36, keyH, keyD - 0.01);
  const sbMesh = new THREE.Mesh(sbGeo, keyMat);
  sbMesh.position.set(0, BH + 0.009, kbD / 2 - BD * 0.08 + 0.02);
  base.add(sbMesh);

  // Trackpad
  const tpW = BW * 0.26, tpD = BD * 0.22;
  const tpGeo = new THREE.BoxGeometry(tpW, 0.003, tpD);
  const tpMesh = new THREE.Mesh(tpGeo, trackpadMat);
  tpMesh.position.set(0, BH + 0.004, BD * 0.31);
  base.add(tpMesh);

  // Trackpad border highlight
  const tpBorderGeo = new THREE.BoxGeometry(tpW + 0.01, 0.001, tpD + 0.01);
  const tpBorderMat = new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.3, metalness: 0.7 });
  const tpBorderMesh = new THREE.Mesh(tpBorderGeo, tpBorderMat);
  tpBorderMesh.position.set(0, BH + 0.004, BD * 0.31);
  base.add(tpBorderMesh);

  // Bottom rubber feet
  const footMat = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 0.9, metalness: 0 });
  [[-BW * 0.4, -BD * 0.42], [BW * 0.4, -BD * 0.42],
   [-BW * 0.4, BD * 0.42], [BW * 0.4, BD * 0.42]].forEach(([fx, fz]) => {
    const fg = new THREE.CylinderGeometry(0.06, 0.07, 0.02, 12);
    const fm = new THREE.Mesh(fg, footMat);
    fm.position.set(fx, -0.01, fz);
    base.add(fm);
  });

  // Hinge (center)
  const hingeGeo = new THREE.CylinderGeometry(0.05, 0.05, LW * 0.16, 16);
  const hingeMat = new THREE.MeshStandardMaterial({ color: 0x303540, roughness: 0.15, metalness: 0.9 });
  for (const offset of [-0.6, 0.6]) {
    const hm = new THREE.Mesh(hingeGeo, hingeMat);
    hm.rotation.z = Math.PI / 2;
    hm.position.set(offset, BH / 2 - 0.04, -BD / 2 + 0.04);
    laptop.add(hm);
  }

  // Position laptop slightly above center
  laptop.position.y = -0.4;
  laptop.rotation.y = Math.PI * 0.08;

  /* ── Shadow plane ───────────────────────────────────────── */
  const shadowGeo = new THREE.PlaneGeometry(6, 6);
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.25 });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.42;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  /* ── Environment: soft hemisphere ───────────────────────── */
  const hemi = new THREE.HemisphereLight(0x1a1d2a, 0x0a0b0d, 0.4);
  scene.add(hemi);

  /* ── Reduce-motion: stop animation if requested ─────────── */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    controls.autoRotate = false;
  }

  /* ── Resize ─────────────────────────────────────────────── */
  function onResize() {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  }
  const ro = new ResizeObserver(onResize);
  ro.observe(container);

  /* ── Render loop ────────────────────────────────────────── */
  let frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  /* ── Touch scroll fix on mobile ─────────────────────────── */
  // OrbitControls with touch-action="none" handles pan vs orbit.
  // We set touch-action on canvas explicitly so browser handles scroll.
  renderer.domElement.style.touchAction = "pan-y";

  /* Expose cleanup */
  return () => {
    cancelAnimationFrame(frameId);
    ro.disconnect();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
