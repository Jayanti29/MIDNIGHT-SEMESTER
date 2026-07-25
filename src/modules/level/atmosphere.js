import * as THREE from "three";
import {
  scene,
  materials,
  camera,
  camera2,
  createFlashlightBeam,
  setFlashlightLight,
  addTaskLog
} from "../../main.js";
import { createFlashlightCookie } from "../textures/index.js";

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
