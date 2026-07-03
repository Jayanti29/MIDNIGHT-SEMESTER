import * as THREE from "three";
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
scene.fog = new THREE.FogExp2(0x070706, 0.034);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 180);
camera.position.set(0, 1.7, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;

const clock = new THREE.Clock();
const keys = new Set();
const interactables = [];
let yaw = 0;
let pitch = 0;
let battery = 100;
let fear = 0;
let flashlightOn = true;
let inspected = 0;

const materials = {
  wall: new THREE.MeshStandardMaterial({ color: 0x514b40, roughness: 0.86, metalness: 0.02 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x22150f, roughness: 0.72 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.68 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xaa7a36, roughness: 0.38, metalness: 0.68 }),
  paper: new THREE.MeshStandardMaterial({ color: 0xd4c0a0, roughness: 0.92 }),
  fabric: new THREE.MeshStandardMaterial({ color: 0x4f564c, roughness: 0.95 }),
  hazard: new THREE.MeshStandardMaterial({ color: 0x7f1f1b, roughness: 0.7 })
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
    box("lamp shade", [1.1, 0.12, 0.55], [0, 3.28, z], materials.brass);
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

  const ghost = new THREE.Mesh(
    new THREE.PlaneGeometry(0.82, 2.2),
    new THREE.MeshBasicMaterial({ color: 0xc9d5cf, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
  );
  ghost.position.set(2.7, 1.18, -31);
  ghost.name = "Meera presence";
  scene.add(ghost);
  scene.userData.ghost = ghost;
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
  batteryText.textContent = `${Math.round(battery)}%`;
  batteryMeter.value = battery;
  fearText.textContent = `${Math.round(fear)}%`;
  fearMeter.value = fear;
  vignette.style.opacity = String(0.35 + fear / 145);

  const ghost = scene.userData.ghost;
  ghost.lookAt(camera.position);
  ghost.material.opacity = Math.max(0, Math.sin(clock.elapsedTime * 1.7) * 0.16 + (fear - 42) / 210);
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
  requestAnimationFrame(animate);
}

function startGame() {
  startScreen.classList.add("hidden");
  canvas.requestPointerLock?.();
  caption.textContent = "Find evidence. Follow the lights. Do not trust the silence.";
}

buildCorridor();
addAtmosphere();
animate();

startButton.addEventListener("click", startGame);
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
