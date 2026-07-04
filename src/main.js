import * as THREE from "three";

const canvas = document.querySelector("#game");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const menuSettings = document.querySelector("#menu-settings");
const menuQuit = document.querySelector("#menu-quit");
const batteryText = document.querySelector("#battery");
const batteryMeter = document.querySelector("#battery-meter");
const fearText = document.querySelector("#fear");
const fearMeter = document.querySelector("#fear-meter");
const objective = document.querySelector("#objective");
const objectiveSteps = document.querySelectorAll("[data-step]");
const caseFile = document.querySelector("#case-file");
const caseTitle = document.querySelector("#case-title");
const caseBody = document.querySelector("#case-body");
const taskLogList = document.querySelector("#task-log-list");
const pauseMenu = document.querySelector("#pause-menu");
const resumeButton = document.querySelector("#resume-button");
const pauseSettings = document.querySelector("#pause-settings");
const quitToMenu = document.querySelector("#quit-to-menu");
const caption = document.querySelector("#caption");
const vignette = document.querySelector("#vignette");
const vrToggle = document.querySelector("#vr-toggle");
const dialogue = document.querySelector("#dialogue");
const speaker = document.querySelector("#speaker");
const line = document.querySelector("#line");
const nextLineButton = document.querySelector("#next-line");
const interactionPrompt = document.querySelector("#interaction-prompt");
const actionInteract = document.querySelector("#action-interact");
const actionFlashlight = document.querySelector("#action-flashlight");
const fatalError = document.querySelector("#fatal-error");
const reticle = document.querySelector("#reticle");
const settingsPanel = document.querySelector("#settings-panel");
const loadingScreen = document.querySelector("#loading-screen");
const loadingProgress = document.querySelector("#loading-progress");
const loadingStatus = document.querySelector("#loading-status");
const closeSettings = document.querySelector("#close-settings");
const settingMasterVolume = document.querySelector("#setting-master-volume");
const settingMouseSensitivity = document.querySelector("#setting-mouse-sensitivity");
const settingFov = document.querySelector("#setting-fov");
const inventoryPanel = document.querySelector("#inventory-panel");
const inventoryList = document.querySelector("#inventory-list");
const inventoryDetail = document.querySelector("#inventory-detail");
const inventoryDetailTitle = document.querySelector("#inventory-detail-title");
const inventoryDetailBody = document.querySelector("#inventory-detail-body");
const closeInventory = document.querySelector("#close-inventory");
const collectedDocuments = new Map();
const gameoverScreen = document.querySelector("#gameover-screen");
const gameoverReason = document.querySelector("#gameover-reason");
const restartButton = document.querySelector("#restart-button");

const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const percent = Math.min(100, Math.round((itemsLoaded / itemsTotal) * 100));
  if (loadingProgress) loadingProgress.style.width = `${percent}%`;
  if (loadingStatus) loadingStatus.textContent = `Loading asset: ${percent}%`;
};

loadingManager.onLoad = () => {
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
      setTimeout(() => { loadingScreen.style.display = "none"; }, 600);
    }
  }, 400);
};

loadingManager.onError = (url) => {
  console.error(`Asset failed to load via LoadingManager: ${url}`);
  caption.textContent = "An asset failed to load. Check the console for details.";
};

// Simulated loading compiling shaders on boot
(function simulateBootLoad() {
  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.random() * 12 + 6;
    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add("hidden");
          setTimeout(() => { loadingScreen.style.display = "none"; }, 600);
        }
      }, 350);
    }
    if (loadingProgress) loadingProgress.style.width = `${percent}%`;
    if (loadingStatus) loadingStatus.textContent = `Compiling shaders... ${Math.round(percent)}%`;
  }, 90);
})();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020303);
scene.fog = new THREE.FogExp2(0x070706, 0.026);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 180);
camera.position.set(0, 1.7, 8);

const audioListener = new THREE.AudioListener();
camera.add(audioListener);

class AudioManager {
  constructor(listener) {
    this.listener = listener;
    this.loader = new THREE.AudioLoader(loadingManager);
    this.buffers = new Map();
    this.activeSounds = new Map();
  }

  loadSound(name, url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (buffer) => {
          this.buffers.set(name, buffer);
          console.log(`Audio buffer loaded: ${name} (${url})`);
          resolve(buffer);
        },
        undefined,
        (err) => {
          console.error(`Failed to load audio: ${url}`, err);
          reject(err);
        }
      );
    });
  }

  playSound(name, options = {}) {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Audio buffer not loaded: ${name}`);
      return null;
    }

    const loop = options.loop || false;
    const volume = options.volume !== undefined ? options.volume : 1.0;
    const positional = options.positional || false;
    const targetMesh = options.targetMesh || null;
    
    let sound;
    if (positional && targetMesh) {
      sound = new THREE.PositionalAudio(this.listener);
      sound.setBuffer(buffer);
      sound.setRefDistance(options.refDistance || 1.2);
      sound.setMaxDistance(options.maxDistance || 18);
      targetMesh.add(sound);
    } else {
      sound = new THREE.Audio(this.listener);
      sound.setBuffer(buffer);
    }

    sound.setLoop(loop);
    sound.setVolume(volume);
    sound.play();

    this.activeSounds.set(name, sound);
    
    if (!loop) {
      sound.onEnded = () => {
        if (sound.parent) {
          sound.parent.remove(sound);
        }
        if (this.activeSounds.get(name) === sound) {
          this.activeSounds.delete(name);
        }
      };
    }

    return sound;
  }

  stopSound(name) {
    const sound = this.activeSounds.get(name);
    if (sound) {
      if (sound.isPlaying) {
        sound.stop();
      }
      if (sound.parent) {
        sound.parent.remove(sound);
      }
      this.activeSounds.delete(name);
    }
  }

  setVolume(name, volume) {
    const sound = this.activeSounds.get(name);
    if (sound) {
      sound.setVolume(volume);
    }
  }
}

const audioManager = new AudioManager(audioListener);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
} catch (error) {
  fatalError.hidden = false;
  throw error;
}
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.xr.enabled = true;

const clock = new THREE.Clock();
const keys = new Set();
const interactables = [];
const doors = [];
const evidenceItems = [];
const flickerLights = [];
const playerRadius = 0.32;
let yaw = 0;
let pitch = 0;
let mouseSensitivity = parseFloat(localStorage.getItem("setting-mouse-sensitivity") || "1.0");
let masterVolume = parseFloat(localStorage.getItem("setting-master-volume") || "0.8");
let battery = 100;
let fear = 0;
let flashlightOn = true;
let inspected = 0;
let stamina = 100;
let sprintExhausted = false;
const collectedEvidence = new Set();
let xrSession = null;
let activeLineTimer = 0;
let introPlayed = false;
let audioCtx = null;
let droneGain = null;
let heartbeatTimer = 0;
let meeraWarned = false;
let storyQueue = [];
let pointerLocked = false;
let flashlightLight = null;
const GameState = Object.freeze({
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAMEOVER: "gameover"
});
let gameState = GameState.MENU;

class GameStateManager {
  constructor() {
    this.state = GameState.MENU;
  }

  transitionTo(nextState) {
    const prevState = this.state;
    this.state = nextState;
    gameState = nextState;
    document.body.dataset.state = nextState;
    document.body.classList.toggle("started", nextState === GameState.PLAYING || nextState === GameState.PAUSED);
    
    if (startScreen) {
      if (nextState === GameState.MENU) {
        startScreen.classList.remove("hidden");
      } else {
        startScreen.classList.add("hidden");
      }
    }
    if (pauseMenu) {
      if (nextState === GameState.PAUSED) {
        pauseMenu.classList.add("open");
      } else {
        pauseMenu.classList.remove("open");
      }
    }
    
    const settingsPanel = document.querySelector("#settings-panel");
    if (settingsPanel) settingsPanel.classList.remove("open");
    
    if (inventoryPanel) inventoryPanel.classList.remove("open");
    
    const gameoverScreen = document.querySelector("#gameover-screen");
    if (gameoverScreen) {
      if (nextState === GameState.GAMEOVER) {
        gameoverScreen.classList.add("open");
      } else {
        gameoverScreen.classList.remove("open");
      }
    }

    this.onStateChange(nextState, prevState);
  }

  onStateChange(nextState, prevState) {
    if (nextState === GameState.PLAYING) {
      if (!clock.running) clock.start();
    } else if (nextState === GameState.PAUSED || nextState === GameState.MENU || nextState === GameState.GAMEOVER) {
      clock.stop();
      keys.clear();
    }
  }
}

const stateManager = new GameStateManager();

function setGameState(nextState) {
  stateManager.transitionTo(nextState);
}

window.addEventListener("error", (event) => {
  // Capture resource errors (like <img>, <audio> loading failures)
  if (event.target && (event.target.tagName === "IMG" || event.target.tagName === "AUDIO" || event.target.tagName === "VIDEO" || event.target.tagName === "SOURCE")) {
    console.error(`Asset failed to load: ${event.target.src || event.target.currentSrc}`);
    caption.textContent = `Warning: Asset failed to load: ${event.target.src || event.target.currentSrc}`;
    return;
  }
  console.error("Runtime error:", event.message, event.error);
}, true); // Use capture phase to intercept resource errors

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

// Handle WebGL context loss safely
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  console.error("WebGL Context Lost!");
  caption.textContent = "Fatal: Graphics context lost. Please reload the page.";
  setGameState(GameState.MENU);
}, false);


function completeObjective(step) {
  document.querySelector(`[data-step="${step}"]`)?.classList.add("done");
}

function addTaskLog(message) {
  const item = document.createElement("li");
  item.textContent = message;
  taskLogList.prepend(item);
  while (taskLogList.children.length > 5) {
    taskLogList.lastElementChild.remove();
  }
}

async function setupVrEntry() {
  if (!navigator.xr || !vrToggle) return;

  try {
    vrToggle.hidden = false;
    vrToggle.addEventListener("click", async () => {
      if (xrSession) {
        await xrSession.end();
        return;
      }

      xrSession = await navigator.xr.requestSession("immersive-vr", {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"]
      });
      renderer.xr.setSession(xrSession);
      vrToggle.textContent = "Exit VR";
      xrSession.addEventListener("end", () => {
        xrSession = null;
        vrToggle.textContent = "Enter VR";
      });
      startGame({ lockPointer: false });
    });
  } catch (error) {
    console.warn("VR entry unavailable in this browser.", error);
  }
}

function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();

  const drone = audioCtx.createOscillator();
  drone.type = "sawtooth";
  drone.frequency.value = 42;
  droneGain = audioCtx.createGain();
  droneGain.gain.value = 0.035;
  drone.connect(droneGain).connect(audioCtx.destination);
  drone.start();

  heartbeatTimer = window.setInterval(() => {
    if (!document.body.classList.contains("started")) return;
    playTone(64, 0.11, 0.04 + fear / 900, "sine");
    window.setTimeout(() => playTone(52, 0.08, 0.025 + fear / 1400, "sine"), 140);
  }, 1180);
}

function playTone(frequency, duration = 0.3, volume = 0.08, type = "sine") {
  if (!audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration + 0.03);
}

function playDoorCreak() {
  playTone(96, 0.55, 0.08, "sawtooth");
  window.setTimeout(() => playTone(68, 0.45, 0.055, "triangle"), 90);
}

function playWhisper() {
  playTone(520, 0.18, 0.035, "triangle");
  window.setTimeout(() => playTone(410, 0.22, 0.025, "triangle"), 160);
  window.setTimeout(() => playTone(615, 0.14, 0.025, "sine"), 340);
}

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
  bookBlue: new THREE.MeshStandardMaterial({ color: 0x243f5e, roughness: 0.82 }),
  bookRed: new THREE.MeshStandardMaterial({ color: 0x61231f, roughness: 0.84 }),
  bookGreen: new THREE.MeshStandardMaterial({ color: 0x2f4c34, roughness: 0.84 }),
  hazard: new THREE.MeshStandardMaterial({ color: 0x7f1f1b, roughness: 0.7 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x93a0a0, roughness: 0.08, metalness: 0.04, transparent: true, opacity: 0.28 }),
  emission: new THREE.MeshStandardMaterial({ color: 0xffd9a1, emissive: 0xffb25a, emissiveIntensity: 0.9 })
};

const colliders = [];

function registerCollider(object) {
  if (!object) return;
  const box3 = new THREE.Box3().setFromObject(object);
  colliders.push({
    xMin: box3.min.x,
    xMax: box3.max.x,
    zMin: box3.min.z,
    zMax: box3.max.z,
    name: object.name || "obstacle"
  });
}

function box(name, size, position, material, cast = true, receive = true, isCollider = false) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  scene.add(mesh);
  if (isCollider) {
    registerCollider(mesh);
  }
  return mesh;
}

function tagInteractable(object, type, label) {
  object.userData.interactable = true;
  object.userData.interactionType = type;
  object.userData.interactionLabel = label;
  return object;
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

function createDoor({ side, z, label }) {
  const direction = side === "left" ? -1 : 1;
  const group = new THREE.Group();
  group.name = label;
  group.position.set(direction * 3.62, 1.18, z);
  group.userData = { type: "door", open: false, side, label };

  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.35, 1.18), materials.darkWood);
  panel.name = `${label} panel`;
  panel.castShadow = true;
  panel.receiveShadow = true;
  panel.userData.parentDoor = group;
  tagInteractable(panel, "door", label);
  group.add(panel);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), materials.brass);
  knob.name = `${label} knob`;
  knob.position.set(-direction * 0.12, -0.06, 0.36);
  knob.userData.parentDoor = group;
  tagInteractable(knob, "door", label);
  group.add(knob);

  const sign = addLabel(label.replace(" door", "").toUpperCase(), [direction * 3.48, 1.92, z], 0.16);
  sign.rotation.y = direction < 0 ? Math.PI / 2 : -Math.PI / 2;

  scene.add(group);
  doors.push(group);
  interactables.push(panel, knob);
  return group;
}

function createBookStack(position, rotation = 0) {
  const colors = [materials.bookBlue, materials.bookRed, materials.bookGreen, materials.paper];
  for (let i = 0; i < 5; i += 1) {
    const book = box(`book ${i}`, [0.48 - i * 0.025, 0.06, 0.32], [position[0], position[1] + i * 0.065, position[2]], colors[i % colors.length]);
    book.rotation.y = rotation + (i - 2) * 0.04;
  }
}

function createStudyTable(position, rotation = 0) {
  const group = new THREE.Group();
  group.name = "study table";
  group.position.set(...position);
  group.rotation.y = rotation;

  const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.14, 0.92), materials.darkWood);
  top.position.y = 0.9;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  [[-0.74, -0.34], [0.74, -0.34], [-0.74, 0.34], [0.74, 0.34]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 0.12), materials.darkWood);
    leg.position.set(x, 0.42, z);
    leg.castShadow = true;
    group.add(leg);
  });

  scene.add(group);
  createBookStack([position[0] - 0.34, position[1] + 1.0, position[2] + 0.08], rotation);
  registerCollider(group);
  return group;
}

function createBookshelf(position, rotation = 0) {
  const group = new THREE.Group();
  group.name = "bookshelf";
  group.position.set(...position);
  group.rotation.y = rotation;
  for (let shelf = 0; shelf < 4; shelf += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.32), materials.darkWood);
    plank.position.y = 0.32 + shelf * 0.48;
    plank.castShadow = true;
    plank.receiveShadow = true;
    group.add(plank);

    for (let i = 0; i < 8; i += 1) {
      const mat = [materials.bookBlue, materials.bookRed, materials.bookGreen, materials.paper][(i + shelf) % 4];
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32 + (i % 3) * 0.05, 0.24), mat);
      book.position.set(-0.75 + i * 0.2, plank.position.y + 0.22, 0);
      book.rotation.z = (i % 2 ? 0.06 : -0.04);
      book.castShadow = true;
      group.add(book);
    }
  }
  scene.add(group);
  registerCollider(group);
  return group;
}

function createCharacter({ name, position, color, ghostly = false }) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.74,
    transparent: ghostly,
    opacity: ghostly ? 0.42 : 1,
    emissive: ghostly ? color : 0x000000,
    emissiveIntensity: ghostly ? 0.28 : 0
  });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.82, 8, 16), material);
  body.position.y = 1.05;
  body.castShadow = !ghostly;
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), material);
  head.position.y = 1.7;
  head.castShadow = !ghostly;
  group.add(head);

  const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.18), material);
  shoulder.position.y = 1.42;
  shoulder.castShadow = !ghostly;
  group.add(shoulder);

  const armGeometry = new THREE.CapsuleGeometry(0.055, 0.62, 6, 10);
  [-0.42, 0.42].forEach((x) => {
    const arm = new THREE.Mesh(armGeometry, material);
    arm.position.set(x, 1.1, 0);
    arm.rotation.z = x < 0 ? -0.16 : 0.16;
    arm.castShadow = !ghostly;
    group.add(arm);
  });

  const legGeometry = new THREE.CapsuleGeometry(0.07, 0.64, 6, 10);
  [-0.12, 0.12].forEach((x) => {
    const leg = new THREE.Mesh(legGeometry, material);
    leg.position.set(x, 0.38, 0);
    leg.castShadow = !ghostly;
    group.add(leg);
  });

  scene.add(group);
  return group;
}

function buildSegmentedWall(x, side) {
  const wallStart = 13;
  const wallEnd = -49;
  const doorWidth = 1.18;
  const doorZList = [];
  for (let z = 5; z > -46; z -= 7) {
    const doorZ = side === "left" ? z - 2.4 : z + 0.6;
    doorZList.push(doorZ);
  }
  doorZList.sort((a, b) => b - a);

  let currentZ = wallStart;
  doorZList.forEach((doorZ) => {
    const segStart = currentZ;
    const segEnd = doorZ + doorWidth / 2;
    const length = segStart - segEnd;
    if (length > 0.05) {
      const centerZ = segStart - length / 2;
      box(`${side} wall segment`, [0.28, 4, length], [x, 1.85, centerZ], materials.wall, false, true, true);
    }
    // Top arch above the door: height from 2.35 to 3.8
    box(`${side} arch segment`, [0.28, 1.45, doorWidth], [x, 3.08, doorZ], materials.wall, false, true, false);

    currentZ = doorZ - doorWidth / 2;
  });

  const length = currentZ - wallEnd;
  if (length > 0.05) {
    const centerZ = currentZ - length / 2;
    box(`${side} wall segment`, [0.28, 4, length], [x, 1.85, centerZ], materials.wall, false, true, true);
  }
}

function buildCorridor() {
  box("floor", [8, 0.18, 62], [0, -0.1, -18], materials.floor, false);
  box("ceiling", [8, 0.24, 62], [0, 3.8, -18], materials.wall, false);
  buildSegmentedWall(-4, "left");
  buildSegmentedWall(4, "right");

  for (let z = 5; z > -46; z -= 7) {
    box("wood panel left", [0.34, 1.15, 3.5], [-3.82, 0.78, z], materials.darkWood, true, true, true);
    box("wood panel right", [0.34, 1.15, 3.5], [3.82, 0.78, z - 2.6], materials.darkWood, true, true, true);
    createDoor({ side: "left", z: z - 2.4, label: `Room ${Math.abs(Math.round(z - 2.4))} left door` });
    createDoor({ side: "right", z: z + 0.6, label: `Room ${Math.abs(Math.round(z + 0.6))} right door` });
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

  createBookshelf([-3.48, 0, -12], Math.PI / 2);
  createBookshelf([3.48, 0, -20], -Math.PI / 2);
  createStudyTable([0.8, 0, -8.4], 0.18);
  createStudyTable([-1.1, 0, -29], -0.3);
  buildDormRoom();
  buildDocuments();
  scene.userData.kulkarni = createCharacter({ name: "Professor Kulkarni", position: [-2.4, 0, -15.5], color: 0x3f5f69 });
  registerCollider(scene.userData.kulkarni);
  scene.userData.meeraCharacter = createCharacter({ name: "Meera", position: [2.6, 0, -34.5], color: 0xc9d5cf, ghostly: true });
  addLabel("BLOCK A HOSTEL WING", [0, 2.55, -10.8], 0.42);

  // Basement Gate (Visual entry point for winning the game)
  const gateGroup = new THREE.Group();
  gateGroup.name = "basement gate group";
  gateGroup.position.set(0, 0, -48);
  
  const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 0.28), materials.darkWood);
  gateFrame.position.set(0, 1.9, 0);
  gateFrame.name = "basement gate frame";
  gateGroup.add(gateFrame);

  const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 0.1), materials.brass);
  gateLeft.position.set(-0.8, 1.7, 0.05);
  gateLeft.name = "basement gate left door";
  tagInteractable(gateLeft, "basement_gate", "Basement Gate Left");
  gateGroup.add(gateLeft);
  
  const gateRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 0.1), materials.brass);
  gateRight.position.set(0.8, 1.7, 0.05);
  gateRight.name = "basement gate right door";
  tagInteractable(gateRight, "basement_gate", "Basement Gate Right");
  gateGroup.add(gateRight);

  scene.add(gateGroup);
  registerCollider(gateFrame);
  interactables.push(gateLeft, gateRight);
}

function buildDormRoom() {
  const roomZ = -35;
  box("dorm floor", [13, 0.16, 12], [0, -0.08, roomZ], materials.floor);
  box("dorm back wall", [13, 4, 0.3], [0, 1.9, roomZ - 6], materials.wall, false, true, true);
  box("dorm left wall", [0.3, 4, 12.3], [-6.5, 1.9, roomZ], materials.wall, false, true, true);
  box("dorm right wall", [0.3, 4, 12.3], [6.5, 1.9, roomZ], materials.wall, false, true, true);
  box("dorm front wall left", [2.5, 4, 0.3], [-5.25, 1.9, roomZ + 6], materials.wall, false, true, true);
  box("dorm front wall right", [2.5, 4, 0.3], [5.25, 1.9, roomZ + 6], materials.wall, false, true, true);

  box("bed left base", [2.2, 0.42, 4.8], [-3.1, 0.28, roomZ - 1.6], materials.darkWood, true, true, true);
  box("bed left mattress", [2.04, 0.28, 4.56], [-3.1, 0.68, roomZ - 1.6], materials.fabric);
  box("bed right base", [2.2, 0.42, 4.8], [3.1, 0.28, roomZ - 1.4], materials.darkWood, true, true, true);
  box("bed right mattress", [2.04, 0.28, 4.56], [3.1, 0.68, roomZ - 1.4], materials.fabric);
  box("desk", [2.4, 0.22, 1.2], [0, 1, roomZ - 4.4], materials.darkWood, true, true, true);
  box("desk left leg", [0.16, 1, 0.16], [-1, 0.45, roomZ - 3.96], materials.darkWood);
  box("desk right leg", [0.16, 1, 0.16], [1, 0.45, roomZ - 3.96], materials.darkWood);
  box("fallen chair", [0.9, 0.14, 0.9], [-1.7, 0.28, roomZ + 1.8], materials.darkWood, true, true, true).rotation.z = 0.6;
  box("blood mark", [0.9, 0.025, 1.9], [1.7, 0.04, roomZ + 2.8], materials.hazard, false);
  createBookStack([-0.46, 1.17, roomZ - 4.42], 0.1);
  createBookshelf([-5.1, 0, roomZ - 2.6], Math.PI / 2);
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
    tagInteractable(mesh, "evidence", doc.title);
    evidenceItems.push(mesh);
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
  flashlightLight = flashlight;
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
  if (gameState !== GameState.PLAYING) return;
  const forward = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
  const strafe = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
  const wantsSprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const moving = forward !== 0 || strafe !== 0;
  const sprint = wantsSprint && moving && stamina > 0 && !sprintExhausted;
  stamina = THREE.MathUtils.clamp(stamina + (sprint ? -34 : 22) * delta, 0, 100);
  if (stamina <= 0 && !sprintExhausted) {
    sprintExhausted = true;
    caption.textContent = "Aarav is winded. Release Shift to recover.";
  }
  if (!wantsSprint && stamina > 35) sprintExhausted = false;
  const speed = sprint ? 5.4 : 3.0;
  const lookX = Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft"));
  const lookY = Number(keys.has("ArrowDown")) - Number(keys.has("ArrowUp"));
  yaw -= lookX * delta * 1.7;
  pitch = THREE.MathUtils.clamp(pitch - lookY * delta * 1.25, -1.1, 1.1);
  camera.rotation.set(pitch, yaw, 0, "YXZ");

  const direction = new THREE.Vector3(strafe, 0, -forward).normalize().multiplyScalar(speed * delta);
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const candidate = camera.position.clone().add(direction);
  if (canOccupy(candidate)) {
    camera.position.copy(candidate);
  } else {
    const xOnly = camera.position.clone().add(new THREE.Vector3(direction.x, 0, 0));
    const zOnly = camera.position.clone().add(new THREE.Vector3(0, 0, direction.z));
    if (canOccupy(xOnly)) camera.position.copy(xOnly);
    if (canOccupy(zOnly)) camera.position.copy(zOnly);
  }
  camera.position.y = 1.7;
}

function canOccupy(position) {
  const x = position.x;
  const z = position.z;

  // Global corridor & dorm room Z limits
  if (z > 8.5 || z < -47.5) return false;

  // Max X limits based on whether we are in the dorm Z-span or not
  const inDormZ = z <= -29 && z >= -41;
  const maxX = inDormZ ? 6.15 : 3.55;
  if (Math.abs(x) > maxX) return false;

  // Check static colliders registered in the list
  for (let i = 0; i < colliders.length; i++) {
    const col = colliders[i];
    if (x >= col.xMin - playerRadius && x <= col.xMax + playerRadius &&
        z >= col.zMin - playerRadius && z <= col.zMax + playerRadius) {
      return false;
    }
  }

  // Check doors (closed doors block movement through their frame segment)
  for (let i = 0; i < doors.length; i++) {
    const door = doors[i];
    if (!door.userData.open) {
      const xDoor = door.position.x;
      const zDoor = door.position.z;
      const xMin = xDoor - 0.25;
      const xMax = xDoor + 0.25;
      const zMin = zDoor - 0.65;
      const zMax = zDoor + 0.65;
      if (x >= xMin - playerRadius && x <= xMax + playerRadius &&
          z >= zMin - playerRadius && z <= zMax + playerRadius) {
        return false;
      }
    }
  }

  return true;
}

function updateState(delta) {
  if (gameState === GameState.MENU) return;
  if (flashlightOn) battery = Math.max(0, battery - delta * 1.15);
  if (battery <= 0) flashlightOn = false;
  const depthFear = THREE.MathUtils.clamp((-camera.position.z - 6) * 1.7, 0, 58);
  const darknessFear = flashlightOn ? 0 : 24;
  fear = THREE.MathUtils.lerp(fear, depthFear + darknessFear + inspected * 5, delta * 0.9);
  if (fear >= 100 && gameState === GameState.PLAYING) {
    triggerGameOver("Aarav's heart could not take the terror. The dark claimed him.");
  }

  if (flashlightOn && flashlightLight.parent !== camera) {
    camera.add(flashlightLight);
    camera.add(flashlightLight.target);
  }
  if (!flashlightOn && flashlightLight.parent === camera) {
    camera.remove(flashlightLight);
    camera.remove(flashlightLight.target);
  }
  let targetIntensity = 3.4 * (battery / 100 + 0.1);
  if (flashlightOn) {
    if (battery < 35 && battery > 0) {
      // Low battery flickering
      const lowFlicker = Math.sin(clock.elapsedTime * 22) > 0.3 ? 1.0 : (Math.random() > 0.45 ? 0.18 : 0.02);
      targetIntensity *= lowFlicker;
    }
    flashlightLight.intensity = targetIntensity;
  } else {
    flashlightLight.intensity = 0;
  }
  camera.userData.flashlightProp.visible = true;
  camera.userData.flashlightProp.userData.gauge.scale.x = Math.max(0.08, battery / 100);
  camera.userData.flashlightProp.userData.gauge.material.color.set(battery > 35 ? 0x73d08a : 0xc9493c);
  if (batteryText) batteryText.textContent = `${Math.round(battery)}%`;
  if (batteryMeter) batteryMeter.value = battery;
  if (fearText) fearText.textContent = `${Math.round(fear)}%`;
  if (fearMeter) fearMeter.value = fear;
  vignette.style.opacity = String(0.35 + fear / 145);

  const ghost = scene.userData.ghost;
  ghost.lookAt(camera.position);
  ghost.material.opacity = Math.max(0, Math.sin(clock.elapsedTime * 1.7) * 0.16 + (fear - 42) / 210);
  scene.userData.kulkarni?.lookAt(camera.position.x, 1.2, camera.position.z);
  if (scene.userData.meeraCharacter) {
    const meera = scene.userData.meeraCharacter;
    meera.lookAt(camera.position.x, 1.2, camera.position.z);
    const active = camera.position.z < -18 || fear > 38;
    meera.visible = active;
    if (active) {
      const target = new THREE.Vector3(camera.position.x * 0.35, 0, camera.position.z - 5.6);
      meera.position.lerp(target, delta * (0.08 + fear / 460));
      if (!meeraWarned) {
        meeraWarned = true;
        sayLine("Meera", "You opened the wrong wing.");
        playWhisper();
      }
    }
  }
  scene.userData.dust.rotation.y += delta * 0.018;

  flickerLights.forEach(({ light, base, phase }) => {
    const pulse = Math.sin(clock.elapsedTime * 7.5 + phase) > 0.92 ? 0.26 : 1;
    light.intensity = THREE.MathUtils.lerp(light.intensity, base * pulse, delta * 8);
  });

  doors.forEach((door) => {
    const target = door.userData.open ? (door.userData.side === "left" ? -1.18 : 1.18) : 0;
    door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, target, delta * 6);
  });

  updateInteractionPrompt();
}

function getFocusedInteractable(maxDistance = 4) {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  
  // Find the closest hit within maxDistance
  const hit = hits.find(h => h.distance <= maxDistance);
  if (!hit) return null;
  
  // Traverse up to find if this object or any parent is interactable
  let current = hit.object;
  while (current) {
    if (current.userData && current.userData.interactable) {
      return {
        object: current,
        distance: hit.distance
      };
    }
    current = current.parent;
  }
  return null;
}

function updateInteractionPrompt() {
  const hit = getFocusedInteractable();
  if (!hit || !document.body.classList.contains("started")) {
    interactionPrompt.hidden = true;
    if (reticle) reticle.classList.remove("active");
    return;
  }

  if (reticle) reticle.classList.add("active");
  const type = hit.object.userData.interactionType;
  interactionPrompt.hidden = false;
  
  if (type === "door") {
    const door = hit.object.userData.parentDoor;
    const label = door ? door.userData.label : "door";
    const isOpen = door ? door.userData.open : false;
    interactionPrompt.textContent = `[E] ${isOpen ? "Close" : "Open"} ${label}`;
  } else if (type === "basement_gate") {
    if (inspected >= 3) {
      interactionPrompt.textContent = "[E] Open Basement Gate";
    } else {
      interactionPrompt.textContent = "Basement Gate (Locked - 3 Evidence required)";
    }
  } else if (type === "evidence") {
    const label = hit.object.userData.interactionLabel || "Evidence";
    interactionPrompt.textContent = `[E] Inspect ${label}`;
  } else {
    interactionPrompt.textContent = `[E] ${hit.object.userData.interactionLabel || "Interact"}`;
  }
}

function sayLine(name, text, duration = 5600) {
  speaker.textContent = name;
  line.textContent = text;
  dialogue.classList.add("open");
  
  if (storyQueue.length > 0) {
    nextLineButton.style.display = "inline-block";
    window.clearTimeout(activeLineTimer);
  } else {
    nextLineButton.style.display = "none";
    window.clearTimeout(activeLineTimer);
    activeLineTimer = window.setTimeout(() => {
      dialogue.classList.remove("open");
    }, duration);
  }
}

function queueStory(lines) {
  storyQueue = [...lines];
  showNextStoryLine();
}

function showNextStoryLine() {
  const next = storyQueue.shift();
  if (!next) {
    dialogue.classList.remove("open");
    return;
  }

  sayLine(next[0], next[1], 12000);
}

function playIntroDialogue() {
  if (introPlayed) return;
  introPlayed = true;
  queueStory([
    ["Aarav", "Gate control is offline. Why is Block A drawing backup power?"],
    ["Professor Kulkarni", "Aarav, listen carefully. Do not enter the basement. Restore the generator and leave."],
    ["Meera", "Forty-two hours. Still awake. Still here."]
  ]);
}

function inspectNearest() {
  if (gameState !== GameState.PLAYING) return;
  const hit = getFocusedInteractable();
  if (!hit) {
    caption.textContent = "Nothing close enough to inspect.";
    return;
  }

  const type = hit.object.userData.interactionType;
  if (type === "door") {
    const door = hit.object.userData.parentDoor;
    if (door) {
      door.userData.open = !door.userData.open;
      fear = Math.min(100, fear + 4);
      playDoorCreak();
      caption.textContent = door.userData.open ? "The door groans open." : "The latch clicks shut.";
      addTaskLog(`${door.userData.open ? "Opened" : "Closed"} ${door.userData.label}.`);
      if (door.userData.open && camera.position.z < -12) {
        sayLine("Professor Kulkarni", "Some rooms were sealed after 2005. If a door opens by itself, step back.");
      }
      objective.textContent = "Search rooms for lab records, books, and anything Meera left behind.";
    }
    return;
  }

  if (type === "basement_gate") {
    if (inspected >= 3) {
      caption.textContent = "You unlock the basement gate and escape block A.";
      addTaskLog("Unlocked the basement access.");
      sayLine("Aarav", "The gate is open. I can get down to the generator room now.");
    } else {
      caption.textContent = "The gate is chained shut. I need to find all the missing documents first.";
      sayLine("Aarav", "It's locked. Professor Kulkarni said the keys were returned, but maybe there's another way...");
    }
    return;
  }

  if (type === "evidence") {
    const doc = hit.object.userData.doc;
    if (!doc) return;
    collectedDocuments.set(doc.title, doc.body);
    collectedEvidence.add(doc.title);
    inspected = collectedEvidence.size;
    caseTitle.textContent = doc.title;
    caseBody.textContent = doc.body;
    caseFile.classList.add("open");
    playWhisper();
    objective.textContent = inspected >= 3
      ? "Case file complete. Reach the basement access at the end of the wing."
      : "Evidence recovered. Keep searching Block A for the sealed lab trail.";
    if (inspected >= 1) completeObjective("evidence");
    if (inspected >= 3) completeObjective("basement");
    caption.textContent = "Document added to case file.";
    sayLine("Aarav", `This belongs in the case file: ${doc.title}.`);
    addTaskLog(`Recovered evidence: ${doc.title}.`);
    window.setTimeout(() => {
      caseFile.classList.remove("open");
    }, 7200);
    return;
  }
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  updateMovement(delta);
  updateState(delta);
  renderer.render(scene, camera);
}

function startGame({ lockPointer = true } = {}) {
  initAudio();
  startScreen.classList.add("hidden");
  setGameState(GameState.PLAYING);
  if (lockPointer) requestPointerLock();
  caption.textContent = "WASD move. Mouse or arrow keys look. E inspects. F toggles the flashlight.";
  completeObjective("start");
  addTaskLog("Entered Block A after the midnight power reroute.");
  playTone(33, 1.4, 0.09, "sawtooth");
  playIntroDialogue();
}

function requestPointerLock() {
  if (document.pointerLockElement === canvas) return;
  try {
    const request = canvas.requestPointerLock?.();
    if (request?.catch) {
      request.catch(() => {
        caption.textContent = "Click the game view again to enable mouse look.";
      });
    }
  } catch (error) {
    console.warn("Pointer lock request failed.", error);
    caption.textContent = "Mouse look was blocked. Use arrow keys or click the game again.";
  }
}

function togglePause() {
  if (gameState === GameState.PLAYING) {
    document.exitPointerLock?.();
  } else if (gameState === GameState.PAUSED) {
    requestPointerLock();
  }
}

function toggleInventory() {
  if (gameState !== GameState.PLAYING && gameState !== GameState.PAUSED) return;
  const isOpen = inventoryPanel.classList.contains("open");
  if (isOpen) {
    inventoryPanel.classList.remove("open");
    if (gameState === GameState.PLAYING) {
      requestPointerLock();
    }
  } else {
    populateInventory();
    document.exitPointerLock?.();
    inventoryPanel.classList.add("open");
    if (pauseMenu) pauseMenu.classList.remove("open");
    if (settingsPanel) settingsPanel.classList.remove("open");
  }
}

function populateInventory() {
  inventoryList.innerHTML = "";
  if (collectedDocuments.size === 0) {
    inventoryList.innerHTML = '<p class="empty-notice">No evidence collected yet. Search classrooms and dorms.</p>';
    inventoryDetail.hidden = true;
    return;
  }
  
  collectedDocuments.forEach((body, title) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "inventory-item-btn";
    btn.textContent = title;
    btn.addEventListener("click", () => {
      inventoryDetailTitle.textContent = title;
      inventoryDetailBody.textContent = body;
      inventoryDetail.hidden = false;
    });
    inventoryList.appendChild(btn);
  });
}

function triggerGameOver(reason) {
  setGameState(GameState.GAMEOVER);
  document.exitPointerLock?.();
  if (gameoverReason) gameoverReason.textContent = reason;
  playTone(55, 2.0, 0.4, "sawtooth");
  addTaskLog("Fatal: Aarav collapsed due to extreme heart strain.");
}

function resetGame() {
  fear = 0;
  battery = 100;
  stamina = 100;
  sprintExhausted = false;
  flashlightOn = true;
  inspected = 0;
  collectedEvidence.clear();
  collectedDocuments.clear();
  
  camera.position.set(0, 1.7, 8);
  camera.rotation.set(0, 0, 0);
  yaw = 0;
  pitch = 0;
  
  if (inventoryPanel) inventoryPanel.classList.remove("open");
  if (settingsPanel) settingsPanel.classList.remove("open");
  if (gameoverScreen) gameoverScreen.classList.remove("open");
  
  document.querySelectorAll(".notebook-steps span").forEach(el => {
    el.classList.remove("done");
  });
  
  objective.textContent = "Find the generator route through the old hostel wing.";
  addTaskLog("System status restored. Re-entering Block A.");
}

buildCorridor();
addAtmosphere();
if (new URLSearchParams(window.location.search).has("vr")) {
  setupVrEntry();
}
renderer.setAnimationLoop(animate);

startButton.addEventListener("click", () => startGame());
menuSettings.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  settingsPanel.classList.add("open");
});
menuQuit.addEventListener("click", () => {
  caption.textContent = "Quit is disabled in browser preview. Close the tab to exit.";
});
if (new URLSearchParams(window.location.search).has("autostart")) {
  startScreen.classList.add("hidden");
  setGameState(GameState.PLAYING);
  caption.textContent = "Verification mode: playable scene loaded.";
}
canvas.addEventListener("click", () => {
  if (gameState === GameState.PLAYING) requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  pointerLocked = document.pointerLockElement === canvas;
  if (pointerLocked) {
    caption.textContent = "Mouse look enabled. WASD move, E interact, F flashlight.";
    if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
    }
  } else {
    caption.textContent = "Mouse look disabled. Click the game view to resume.";
    if (gameState === GameState.PLAYING) {
      setGameState(GameState.PAUSED);
    }
  }
});

document.addEventListener("pointerlockerror", () => {
  pointerLocked = false;
  caption.textContent = "Mouse look was blocked. Click the game view or use arrow keys.";
  if (gameState === GameState.PLAYING) {
    setGameState(GameState.PAUSED);
  }
});

document.addEventListener("mousemove", (event) => {
  if (!pointerLocked || gameState !== GameState.PLAYING) return;
  yaw -= event.movementX * 0.0022 * mouseSensitivity;
  pitch -= event.movementY * 0.002 * mouseSensitivity;
  pitch = THREE.MathUtils.clamp(pitch, -1.1, 1.1);
  camera.rotation.set(pitch, yaw, 0, "YXZ");
});

document.addEventListener("keydown", (event) => {
  // Graceful Escape/Inventory closure first
  if (event.code === "Escape" || event.code === "KeyI" || event.code === "Tab") {
    if (inventoryPanel && inventoryPanel.classList.contains("open")) {
      event.preventDefault();
      toggleInventory();
      return;
    }
    if (settingsPanel && settingsPanel.classList.contains("open")) {
      event.preventDefault();
      closeSettings.click();
      return;
    }
  }

  if (event.code === "Escape" && (gameState === GameState.PLAYING || gameState === GameState.PAUSED)) {
    togglePause();
    return;
  }

  if (event.code === "KeyI" || event.code === "Tab") {
    if (gameState === GameState.PLAYING || gameState === GameState.PAUSED) {
      event.preventDefault();
      toggleInventory();
      return;
    }
  }

  if (gameState !== GameState.PLAYING) return;
  keys.add(event.code);
  if (event.code === "KeyF") {
    flashlightOn = !flashlightOn && battery > 0;
    caption.textContent = flashlightOn ? "Flashlight on." : "Flashlight off.";
  }
  if (event.code === "KeyE") inspectNearest();
});

document.addEventListener("keyup", (event) => keys.delete(event.code));
nextLineButton.addEventListener("click", showNextStoryLine);
actionInteract.addEventListener("click", inspectNearest);
actionFlashlight.addEventListener("click", () => {
  if (gameState !== GameState.PLAYING) return;
  flashlightOn = !flashlightOn && battery > 0;
  caption.textContent = flashlightOn ? "Flashlight on." : "Flashlight off.";
});
resumeButton.addEventListener("click", togglePause);
pauseSettings.addEventListener("click", () => {
  pauseMenu.classList.remove("open");
  settingsPanel.classList.add("open");
});
closeSettings.addEventListener("click", () => {
  settingsPanel.classList.remove("open");
  if (gameState === GameState.MENU) {
    startScreen.classList.remove("hidden");
  } else if (gameState === GameState.PAUSED) {
    pauseMenu.classList.add("open");
  }
});

// Settings Input Event Listeners
settingMasterVolume.addEventListener("input", (event) => {
  masterVolume = parseFloat(event.target.value);
  localStorage.setItem("setting-master-volume", masterVolume);
  caption.textContent = `Master Volume: ${Math.round(masterVolume * 100)}%`;
  if (audioListener) {
    audioListener.setMasterVolume(masterVolume);
  }
});

settingMouseSensitivity.addEventListener("input", (event) => {
  mouseSensitivity = parseFloat(event.target.value);
  localStorage.setItem("setting-mouse-sensitivity", mouseSensitivity);
  caption.textContent = `Mouse Sensitivity: ${mouseSensitivity.toFixed(1)}x`;
});

settingFov.addEventListener("input", (event) => {
  const fovVal = parseInt(event.target.value);
  camera.fov = fovVal;
  camera.updateProjectionMatrix();
  localStorage.setItem("setting-fov", fovVal);
  caption.textContent = `Field of View: ${fovVal}°`;
});

closeInventory.addEventListener("click", toggleInventory);
restartButton.addEventListener("click", () => {
  resetGame();
  startGame({ lockPointer: true });
});

quitToMenu.addEventListener("click", () => {
  setGameState(GameState.MENU);
});

// Apply Initial Settings on Startup
settingMasterVolume.value = masterVolume;
settingMouseSensitivity.value = mouseSensitivity;
const savedFov = localStorage.getItem("setting-fov");
if (savedFov) {
  camera.fov = parseInt(savedFov);
  camera.updateProjectionMatrix();
  settingFov.value = savedFov;
} else {
  settingFov.value = 72;
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
