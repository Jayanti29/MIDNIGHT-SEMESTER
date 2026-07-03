import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";
import "./styles.css";

const canvas = document.querySelector("#game");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const batteryText = document.querySelector("#battery");
const batteryMeter = document.querySelector("#battery-meter");
const fearText = document.querySelector("#fear");
const fearMeter = document.querySelector("#fear-meter");
const objective = document.querySelector("#objective");
const caseFile = document.querySelector("#case-file");
const caseTitle = document.querySelector("#case-title");
const caseBody = document.querySelector("#case-body");
const caption = document.querySelector("#caption");
const vignette = document.querySelector("#vignette");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020303);
scene.fog = new THREE.FogExp2(0x070706, 0.026);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 180);
camera.position.set(0, 1.7, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

const clock = new THREE.Clock();
const keys = new Set();
const interactables = [];
const flickerLights = [];
let yaw = 0;
let pitch = 0;
let battery = 100;
let fear = 0;
let flashlightOn = true;
let inspected = 0;

function proceduralTexture({ base = "#514b40", grain = "#2a241f", scratches = "#776b5a", scale = 1 }) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 1024;
  const ctx = textureCanvas.getContext("2d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 900; i += 1) {
    const alpha = Math.random() * 0.16;
    ctx.strokeStyle = i % 4 === 0 ? `rgba(255,245,220,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 160 * scale, y + Math.random() * 26 * scale);
    ctx.stroke();
  }

  ctx.strokeStyle = grain;
  ctx.lineWidth = 3;
  for (let y = 0; y < 1024; y += 92) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.random() * 18);
    ctx.lineTo(1024, y + Math.random() * 22);
    ctx.stroke();
  }

  ctx.strokeStyle = scratches;
  ctx.lineWidth = 1;
  for (let i = 0; i < 120; i += 1) {
    ctx.beginPath();
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.random() * 220 - 80, y + Math.random() * 90 - 45);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const floorTexture = proceduralTexture({ base: "#2b1f17", grain: "#4a3426", scratches: "#6a5541", scale: 1.5 });
floorTexture.repeat.set(2.5, 18);
const wallTexture = proceduralTexture({ base: "#514b40", grain: "#393329", scratches: "#746b5b", scale: 0.7 });
wallTexture.repeat.set(2, 10);
const woodTexture = proceduralTexture({ base: "#23150f", grain: "#4b2c1d", scratches: "#70513a", scale: 1.2 });
woodTexture.repeat.set(1, 4);

const materials = {
  wall: new THREE.MeshStandardMaterial({ color: 0x736a5a, map: wallTexture, roughness: 0.88, metalness: 0.02 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x4b2c1d, map: woodTexture, roughness: 0.74 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x6b4d35, map: floorTexture, roughness: 0.7 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xaa7a36, roughness: 0.38, metalness: 0.68 }),
  paper: new THREE.MeshStandardMaterial({ color: 0xd4c0a0, roughness: 0.92 }),
  fabric: new THREE.MeshStandardMaterial({ color: 0x4f564c, roughness: 0.95 }),
  hazard: new THREE.MeshStandardMaterial({ color: 0x7f1f1b, roughness: 0.7 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x93a0a0, roughness: 0.08, metalness: 0.04, transparent: true, opacity: 0.28 }),
  emission: new THREE.MeshStandardMaterial({ color: 0xffd9a1, emissive: 0xffb25a, emissiveIntensity: 0.9 })
};

function box(name, size, position, material, cast = true, receive = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  scene.add(mesh);
  return mesh;
}

function addLabel(text, position, size = 0.34) {
  const canvasLabel = document.createElement("canvas");
  canvasLabel.width = 1024;
  canvasLabel.height = 256;
  const ctx = canvasLabel.getContext("2d");
  ctx.fillStyle = "#d8c39f";
  ctx.fillRect(0, 0, canvasLabel.width, canvasLabel.height);
  ctx.fillStyle = "#2d2118";
  ctx.font = "700 58px Georgia";
  ctx.fillText(text, 46, 145);
  const texture = new THREE.CanvasTexture(canvasLabel);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size * 4, size),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.88 })
  );
  mesh.position.set(...position);
  mesh.rotation.y = Math.PI;
  mesh.castShadow = true;
  scene.add(mesh);
  return mesh;
}

function buildCorridor() {
  box("floor", [8, 0.18, 62], [0, -0.1, -18], materials.floor, false);
  box("ceiling", [8, 0.24, 62], [0, 3.8, -18], materials.wall, false);
  box("left wall", [0.28, 4, 62], [-4, 1.85, -18], materials.wall, false);
  box("right wall", [0.28, 4, 62], [4, 1.85, -18], materials.wall, false);

  for (let z = 5; z > -46; z -= 7) {
    box("wood panel left", [0.34, 1.15, 3.5], [-3.82, 0.78, z], materials.darkWood);
    box("wood panel right", [0.34, 1.15, 3.5], [3.82, 0.78, z - 2.6], materials.darkWood);
    box("door left", [0.16, 2.35, 1.18], [-3.66, 1.2, z - 2.4], materials.darkWood);
    box("door right", [0.16, 2.35, 1.18], [3.66, 1.2, z + 0.6], materials.darkWood);
    box("frame left", [0.22, 2.66, 1.42], [-3.54, 1.32, z - 2.4], materials.brass);
    box("frame right", [0.22, 2.66, 1.42], [3.54, 1.32, z + 0.6], materials.brass);
  }

  for (let z = 4; z > -48; z -= 10) {
    const lamp = new THREE.PointLight(0xffc987, 1.1, 8, 2.1);
    lamp.position.set(0, 3.35, z);
    lamp.castShadow = true;
    scene.add(lamp);
    flickerLights.push({ light: lamp, base: lamp.intensity, phase: Math.random() * Math.PI * 2 });
    box("lamp shade", [1.1, 0.12, 0.55], [0, 3.28, z], materials.brass);
    box("lamp glow", [0.72, 0.035, 0.26], [0, 3.2, z], materials.emission, false, false);
  }

  for (let z = 0; z > -42; z -= 14) {
    box("rain window left", [0.035, 1.55, 1.9], [-3.84, 2.02, z - 4.8], materials.glass, false);
    box("rain window right", [0.035, 1.55, 1.9], [3.84, 2.02, z - 8.2], materials.glass, false);
  }

  buildDormRoom();
  buildDocuments();
  addLabel("BLOCK A HOSTEL WING", [0, 2.55, -10.8], 0.42);
}

function buildDormRoom() {
  const roomZ = -35;
  box("dorm floor", [13, 0.16, 12], [0, -0.08, roomZ], materials.floor);
  box("dorm back wall", [13, 4, 0.3], [0, 1.9, roomZ - 6], materials.wall);
  box("bed left base", [2.2, 0.42, 4.8], [-3.1, 0.28, roomZ - 1.6], materials.darkWood);
  box("bed left mattress", [2.04, 0.28, 4.56], [-3.1, 0.68, roomZ - 1.6], materials.fabric);
  box("bed right base", [2.2, 0.42, 4.8], [3.1, 0.28, roomZ - 1.4], materials.darkWood);
  box("bed right mattress", [2.04, 0.28, 4.56], [3.1, 0.68, roomZ - 1.4], materials.fabric);
  box("desk", [2.4, 0.22, 1.2], [0, 1, roomZ - 4.4], materials.darkWood);
  box("desk left leg", [0.16, 1, 0.16], [-1, 0.45, roomZ - 3.96], materials.darkWood);
  box("desk right leg", [0.16, 1, 0.16], [1, 0.45, roomZ - 3.96], materials.darkWood);
  box("fallen chair", [0.9, 0.14, 0.9], [-1.7, 0.28, roomZ + 1.8], materials.darkWood).rotation.z = 0.6;
  box("blood mark", [0.9, 0.025, 1.9], [1.7, 0.04, roomZ + 2.8], materials.hazard, false);
}

function buildDocuments() {
  const docs = [
    {
      title: "Dr. Verma Memo",
      body: "Subject M reports auditory counting after 42 hours of isolation. Trial continues under revised observation protocol.",
      position: [-1.2, 0.08, -4.4]
    },
    {
      title: "Watchman's Logbook",
      body: "The old wing has lights after midnight again. I heard the metronome from the sealed basement and returned the keys.",
      position: [1.4, 0.08, -25.4]
    },
    {
      title: "Meera Iyer ID Card",
      body: "Hostel record, 2004. Fee waiver attached to Applied Cognition Lab volunteer enrollment.",
      position: [0.45, 1.14, -39.45]
    }
  ];

  docs.forEach((doc) => {
    const mesh = box(doc.title, [0.78, 0.025, 0.52], doc.position, materials.paper);
    mesh.userData.doc = doc;
    interactables.push(mesh);
  });
}

function addAtmosphere() {
  scene.add(new THREE.HemisphereLight(0x6d766f, 0x080706, 0.18));
  const moon = new THREE.DirectionalLight(0xb0c6ff, 0.42);
  moon.position.set(-5, 9, 9);
  moon.castShadow = true;
  scene.add(moon);

  const flashlight = new THREE.SpotLight(0xffe0a4, 3.4, 24, Math.PI / 7, 0.58, 1.15);
  flashlight.position.set(0, 0, 0);
  flashlight.target.position.set(0, 0, -1);
  camera.add(flashlight);
  camera.add(flashlight.target);
  scene.add(camera);
  camera.userData.flashlight = flashlight;
  camera.userData.flashlightProp = buildFlashlightProp();

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
  for (let i = 0; i < 950; i += 1) {
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

function buildFlashlightProp() {
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

function updateMovement(delta) {
  const sprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const speed = sprint ? 5.4 : 3.0;
  const forward = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
  const strafe = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
  const direction = new THREE.Vector3(strafe, 0, -forward).normalize().multiplyScalar(speed * delta);
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  camera.position.add(direction);
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, -3.25, 3.25);
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, -41, 8.5);
}

function updateState(delta) {
  if (flashlightOn) battery = Math.max(0, battery - delta * 1.15);
  if (battery <= 0) flashlightOn = false;
  const depthFear = THREE.MathUtils.clamp((-camera.position.z - 6) * 1.7, 0, 58);
  const darknessFear = flashlightOn ? 0 : 24;
  fear = THREE.MathUtils.lerp(fear, depthFear + darknessFear + inspected * 5, delta * 0.9);

  camera.userData.flashlight.intensity = flashlightOn ? 3.4 * (battery / 100 + 0.25) : 0;
  camera.userData.flashlightProp.visible = flashlightOn;
  camera.userData.flashlightProp.userData.gauge.scale.x = Math.max(0.08, battery / 100);
  camera.userData.flashlightProp.userData.gauge.material.color.set(battery > 35 ? 0x73d08a : 0xc9493c);
  batteryText.textContent = `${Math.round(battery)}%`;
  batteryMeter.value = battery;
  fearText.textContent = `${Math.round(fear)}%`;
  fearMeter.value = fear;
  vignette.style.opacity = String(0.35 + fear / 145);

  const ghost = scene.userData.ghost;
  ghost.lookAt(camera.position);
  ghost.material.opacity = Math.max(0, Math.sin(clock.elapsedTime * 1.7) * 0.16 + (fear - 42) / 210);
  scene.userData.dust.rotation.y += delta * 0.018;

  flickerLights.forEach(({ light, base, phase }) => {
    const pulse = Math.sin(clock.elapsedTime * 7.5 + phase) > 0.92 ? 0.26 : 1;
    light.intensity = THREE.MathUtils.lerp(light.intensity, base * pulse, delta * 8);
  });
}

function inspectNearest() {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hit = raycaster.intersectObjects(interactables, false)[0];
  if (!hit || hit.distance > 4) {
    caption.textContent = "Nothing close enough to inspect.";
    return;
  }

  const doc = hit.object.userData.doc;
  inspected += 1;
  caseTitle.textContent = doc.title;
  caseBody.textContent = doc.body;
  caseFile.hidden = false;
  objective.textContent = inspected >= 3
    ? "Case file complete. Reach the basement access at the end of the wing."
    : "Evidence recovered. Keep searching Block A for the sealed lab trail.";
  caption.textContent = "Document added to case file.";
  window.setTimeout(() => {
    caseFile.hidden = true;
  }, 7200);
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  updateMovement(delta);
  updateState(delta);
  renderer.render(scene, camera);
}

function startGame() {
  startScreen.classList.add("hidden");
  document.body.classList.add("started");
  canvas.requestPointerLock?.();
  caption.textContent = "Find evidence. Follow the lights. Do not trust the silence.";
}

buildCorridor();
addAtmosphere();
renderer.setAnimationLoop(animate);

startButton.addEventListener("click", startGame);
if (new URLSearchParams(window.location.search).has("autostart")) {
  startScreen.classList.add("hidden");
  document.body.classList.add("started");
  caption.textContent = "Verification mode: playable scene loaded.";
}
document.addEventListener("click", () => {
  if (startScreen.classList.contains("hidden")) canvas.requestPointerLock?.();
});

document.addEventListener("mousemove", (event) => {
  if (document.pointerLockElement !== canvas) return;
  yaw -= event.movementX * 0.0022;
  pitch -= event.movementY * 0.002;
  pitch = THREE.MathUtils.clamp(pitch, -1.1, 1.1);
  camera.rotation.set(pitch, yaw, 0, "YXZ");
});

document.addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (event.code === "KeyF") {
    flashlightOn = !flashlightOn && battery > 0;
    caption.textContent = flashlightOn ? "Flashlight on." : "Flashlight off.";
  }
  if (event.code === "KeyE") inspectNearest();
});

document.addEventListener("keyup", (event) => keys.delete(event.code));

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
