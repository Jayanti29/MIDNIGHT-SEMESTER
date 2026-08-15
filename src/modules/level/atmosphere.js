import * as THREE from "three";
import {
  scene,
  materials,
  camera,
  camera2,
  createFlashlightBeam,
  setFlashlightLight,
  addTaskLog,
  audioCtx
} from "../../main.js";
import { createFlashlightCookie } from "../textures/index.js";

let rainPoints = null;
let thunderLight = null;
let thunderTimer = 10.0;
let windowRainTexture = null;

export function buildFlashlightProp() {
  const group = new THREE.Group();
  group.position.set(0.34, -0.38, -0.72);
  group.rotation.set(-0.15, 0.22, -0.08);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.095, 0.55, 24),
    new THREE.MeshStandardMaterial({ color: 0x232526, roughness: 0.36, metalness: 0.55 })
  );
  body.rotation.x = Math.PI / 2;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.1, 0.16, 24),
    new THREE.MeshStandardMaterial({ color: 0x171818, roughness: 0.3, metalness: 0.72 })
  );
  head.rotation.x = Math.PI / 2;
  head.position.z = -0.34;
  group.add(head);

  const gauge = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.028, 0.018),
    new THREE.MeshBasicMaterial({ color: 0x73d08a })
  );
  gauge.name = "battery gauge";
  gauge.position.set(0, 0.085, -0.08);
  group.add(gauge);
  group.userData.gauge = gauge;
  camera.add(group);
  return group;
}

export function buildEmfProp() {
  const group = new THREE.Group();
  group.name = "emf_prop";
  group.position.set(-0.32, -0.36, -0.72);
  group.rotation.set(-0.1, -0.22, 0.08);

  const bodyGeo = new THREE.BoxGeometry(0.12, 0.22, 0.06);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3a4045, roughness: 0.8 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  group.add(body);

  const screenGeo = new THREE.PlaneGeometry(0.09, 0.07);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x081708 });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 0.03, 0.031);
  group.add(screen);

  const handleGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.16, 8);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.position.set(0, -0.18, 0);
  group.add(handle);

  const ledGeo = new THREE.SphereGeometry(0.01, 8, 8);
  const leds = [];
  const colors = [0x00ff00, 0x00ff00, 0xffff00, 0xffa500, 0xff0000];
  for (let i = 0; i < 5; i++) {
    const ledMat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.18 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.04 + i * 0.02, 0.088, 0.031);
    group.add(led);
    leds.push(led);
  }
  
  group.userData = { leds };
  group.visible = false;
  camera.add(group);
  return group;
}

export function buildEmfPropForP2() {
  const group = new THREE.Group();
  group.name = "emf_prop_p2";
  group.position.set(-0.32, -0.36, -0.72);
  group.rotation.set(-0.1, -0.22, 0.08);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.22, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x3a4045, roughness: 0.8 })
  );
  group.add(body);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.09, 0.07),
    new THREE.MeshBasicMaterial({ color: 0x081708 })
  );
  screen.position.set(0, 0.03, 0.031);
  group.add(screen);

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.024, 0.16, 8),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
  );
  handle.position.set(0, -0.18, 0);
  group.add(handle);

  const ledGeo = new THREE.SphereGeometry(0.01, 8, 8);
  const leds = [];
  const colors = [0x00ff00, 0x00ff00, 0xffff00, 0xffa500, 0xff0000];
  for (let i = 0; i < 5; i++) {
    const ledMat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.18 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.04 + i * 0.02, 0.088, 0.031);
    group.add(led);
    leds.push(led);
  }
  
  group.userData = { leds };
  group.visible = false;
  camera2.add(group);
  return group;
}

export function addAtmosphere() {
  scene.add(new THREE.HemisphereLight(0x8899aa, 0x302820, 2.5));
  const moon = new THREE.DirectionalLight(0xb8d0ff, 4.5);
  moon.position.set(-5, 9, 9);
  moon.castShadow = true;
  scene.add(moon);

  const flashlight = new THREE.SpotLight(0xffe0a4, 280.0, 32, Math.PI / 6.0, 0.55, 1.0);
  flashlight.position.set(0, 0, 0);
  flashlight.target.position.set(0, 0, -1);
  flashlight.map = createFlashlightCookie();

  const beamMesh = createFlashlightBeam();
  flashlight.add(beamMesh);
  flashlight.userData.beamMesh = beamMesh;

  camera.add(flashlight);
  camera.add(flashlight.target);
  scene.add(camera);
  setFlashlightLight(flashlight);
  camera.userData.flashlight = flashlight;
  camera.userData.flashlightProp = buildFlashlightProp();
  camera.userData.emfProp = buildEmfProp();

  const ghost = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 2.2),
    new THREE.MeshBasicMaterial({ color: 0xc9d5cf, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
  );
  ghost.position.set(2.7, 1.18, -31);
  ghost.name = "Meera presence";
  scene.add(ghost);
  scene.userData.ghost = ghost;

  const dustGeometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 1200; i += 1) {
    positions.push(
      (Math.random() - 0.5) * 7.4,
      Math.random() * 3.3 + 0.25,
      Math.random() * -50 + 8
    );
  }
  dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({ color: 0xd7c3a0, size: 0.018, transparent: true, opacity: 0.36, depthWrite: false })
  );
  scene.add(dust);
  scene.userData.dust = dust;
}

let windowRainCanvas = null;
let windowRainDrops = [];

export function initWindowRainTexture() {
  windowRainCanvas = document.createElement("canvas");
  windowRainCanvas.width = 256;
  windowRainCanvas.height = 256;
  const ctx = windowRainCanvas.getContext("2d");
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, 256, 256);

  windowRainDrops = [];
  for (let i = 0; i < 60; i++) {
    windowRainDrops.push({
      x: Math.random() * 256,
      y: Math.random() * 256,
      speed: Math.random() * 80 + 40,
      length: Math.random() * 8 + 6
    });
  }

  windowRainTexture = new THREE.CanvasTexture(windowRainCanvas);
  windowRainTexture.wrapS = THREE.RepeatWrapping;
  windowRainTexture.wrapT = THREE.RepeatWrapping;
  materials.glass.alphaMap = windowRainTexture;
}

export function updateWindowRain(delta) {
  if (!windowRainCanvas) return;
  const ctx = windowRainCanvas.getContext("2d");
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 1.25;

  windowRainDrops.forEach((drop) => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();

    drop.y += drop.speed * delta;
    if (drop.y > 256) {
      drop.y = -drop.length;
      drop.x = Math.random() * 256;
    }
  });

  windowRainTexture.needsUpdate = true;
}

export function buildRainSystem() {
  const count = 350;
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16 - 6;
    positions[i * 3 + 1] = Math.random() * 8 + 1;
    positions[i * 3 + 2] = -Math.random() * 52 - 2;
  }
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x5a6d7a,
    size: 0.08,
    transparent: true,
    opacity: 0.45
  });
  rainPoints = new THREE.Points(geom, mat);
  scene.add(rainPoints);

  thunderLight = new THREE.DirectionalLight(0xbbe2f7, 0.0);
  thunderLight.position.set(-8, 4, -20);
  scene.add(thunderLight);

  initWindowRainTexture();
}

export function updateRain(delta) {
  if (!rainPoints) return;
  const pos = rainPoints.geometry.attributes.position.array;
  const count = pos.length / 3;
  for (let i = 0; i < count; i++) {
    pos[i * 3 + 1] -= delta * 12.0;
    if (pos[i * 3 + 1] < -0.5) {
      pos[i * 3 + 1] = Math.random() * 8 + 4;
    }
  }
  rainPoints.geometry.attributes.position.needsUpdate = true;
  updateWindowRain(delta);
}

export function updateThunder(delta) {
  if (!thunderLight) return;
  thunderTimer -= delta;
  if (thunderTimer <= 0) {
    thunderTimer = Math.random() * 20 + 12;
    triggerThunderFlash();
  }
  
  if (thunderLight.intensity > 0) {
    thunderLight.intensity -= delta * 7.5;
    if (scene && scene.fog) {
      const decay = Math.min(1, thunderLight.intensity / 5.2);
      const r = 8 + decay * 170;
      const g = 7 + decay * 210;
      const b = 6 + decay * 230;
      scene.fog.color.setRGB(r / 255, g / 255, b / 255);
    }
  } else {
    if (scene && scene.fog) {
      scene.fog.color.setHex(0x080706);
    }
  }
}

export function triggerThunderFlash() {
  if (!thunderLight) return;
  thunderLight.intensity = 5.2;
  if (audioCtx) {
    playThunderRumble();
  }
}

function playThunderRumble() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const bq = audioCtx.createBiquadFilter();
  
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(32, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(12, audioCtx.currentTime + 1.8);
  
  bq.type = "lowpass";
  bq.frequency.setValueAtTime(65, audioCtx.currentTime);
  bq.frequency.exponentialRampToValueAtTime(15, audioCtx.currentTime + 1.8);
  
  gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
  
  osc.connect(bq);
  bq.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 2.1);
}

// commit-ref: 55
// commit-ref: 58
// commit-ref: 65
// commit-ref: 68
// commit-ref: 75
// commit-ref: 78
// commit-ref: 85
// commit-ref: 88
// commit-ref: 95
// commit-ref: 98
// commit-ref: 105
// commit-ref: 108
// commit-ref: 115
// commit-ref: 118
// commit-ref: 209
// commit-ref: 219
// commit-ref: 229
// commit-ref: 239
// commit-ref: 249
// commit-ref: 259
// commit-ref: 269
// commit-ref: 279
// commit-ref: 55
// commit-ref: 58
// commit-ref: 65
// commit-ref: 68
// commit-ref: 75
// commit-ref: 78
// commit-ref: 85
// commit-ref: 88
// commit-ref: 95
// commit-ref: 98
// commit-ref: 105
// commit-ref: 108
// commit-ref: 115
// commit-ref: 118
// commit-ref: 209
// commit-ref: 219
// commit-ref: 229
// commit-ref: 239
// commit-ref: 249
// commit-ref: 259
// commit-ref: 269