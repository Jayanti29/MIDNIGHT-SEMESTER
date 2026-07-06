import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const canvas = document.querySelector("#game");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const coopButton = document.querySelector("#coop-button");
const menuSettings = document.querySelector("#menu-settings");
const menuQuit = document.querySelector("#menu-quit");
const batteryText = document.querySelector("#battery");
const batteryMeter = document.querySelector("#battery-meter");
const batteryText2 = document.querySelector("#battery2");
const batteryMeter2 = document.querySelector("#battery2-meter");
const fearText = document.querySelector("#fear");
const fearMeter = document.querySelector("#fear-meter");
const fearText2 = document.querySelector("#fear2");
const fearMeter2 = document.querySelector("#fear2-meter");
const noiseP1Text = document.querySelector("#noise-p1");
const noiseP1Meter = document.querySelector("#noise-p1-meter");
const breathP1Panel = document.querySelector("#breath-p1-panel");
const breathP1Text = document.querySelector("#breath-p1-text");
const breathP1Meter = document.querySelector("#breath-p1-meter");
const noiseP2Text = document.querySelector("#noise-p2");
const noiseP2Meter = document.querySelector("#noise-p2-meter");
const breathP2Panel = document.querySelector("#breath-p2-panel");
const breathP2Text = document.querySelector("#breath-p2-text");
const breathP2Meter = document.querySelector("#breath-p2-meter");
const debugConsole = document.querySelector("#debug-console");
const debugInput = document.querySelector("#debug-input");
const debugOutput = document.querySelector("#debug-output");
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
const interactionPromptP2 = document.querySelector("#interaction-prompt-p2");
const actionInteract = document.querySelector("#action-interact");
const actionFlashlight = document.querySelector("#action-flashlight");
const fatalError = document.querySelector("#fatal-error");
const reticleP1 = document.querySelector("#reticle-p1");
const reticleP2 = document.querySelector("#reticle-p2");
const settingsPanel = document.querySelector("#settings-panel");
const loadingScreen = document.querySelector("#loading-screen");
const loadingProgress = document.querySelector("#loading-progress");
const loadingStatus = document.querySelector("#loading-status");
const closeSettings = document.querySelector("#close-settings");
const settingMasterVolume = document.querySelector("#setting-master-volume");
const settingSfxVolume = document.querySelector("#setting-sfx-volume");
const settingAmbientVolume = document.querySelector("#setting-ambient-volume");
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
const winScreen = document.querySelector("#win-screen");
const winDetail = document.querySelector("#win-detail");
const winStats = document.querySelector("#win-stats");
const playAgainButton = document.querySelector("#play-again-button");

const choiceScreen = document.querySelector("#choice-screen");
const choiceEndingA = document.querySelector("#choice-ending-a");
const choiceEndingB = document.querySelector("#choice-ending-b");
const choiceEndingC = document.querySelector("#choice-ending-c");
const choiceEndingD = document.querySelector("#choice-ending-d");

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
    this.duckTimer = null;
  }

  loadSound(name, url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (buffer) => {
          this.buffers.set(name, buffer);
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
    const category = options.category || "sfx";
    
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
    sound.userData = { category, baseVolume: volume };
    
    const catVol = category === "ambient" ? ambientVolume : sfxVolume;
    sound.setVolume(volume * catVol);
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

  updateCategoryVolumes() {
    this.activeSounds.forEach((sound) => {
      if (sound.userData) {
        const cat = sound.userData.category;
        const base = sound.userData.baseVolume !== undefined ? sound.userData.baseVolume : 1.0;
        const factor = cat === "ambient" ? ambientVolume : sfxVolume;
        sound.setVolume(base * factor);
      }
    });
  }

  duckAmbient(duration = 2500, duckFactor = 0.25) {
    this.activeSounds.forEach((sound) => {
      if (sound.userData && sound.userData.category === "ambient") {
        const base = sound.userData.baseVolume !== undefined ? sound.userData.baseVolume : 1.0;
        sound.setVolume(base * ambientVolume * duckFactor);
      }
    });
    window.clearTimeout(this.duckTimer);
    this.duckTimer = window.setTimeout(() => {
      this.unduckAmbient();
    }, duration);
  }

  unduckAmbient() {
    this.activeSounds.forEach((sound) => {
      if (sound.userData && sound.userData.category === "ambient") {
        const base = sound.userData.baseVolume !== undefined ? sound.userData.baseVolume : 1.0;
        sound.setVolume(base * ambientVolume);
      }
    });
  }

  fadeAmbientOut(durationSecs = 2.0) {
    window.clearTimeout(this.duckTimer);
    this.activeSounds.forEach((sound) => {
      if (sound.userData && sound.userData.category === "ambient") {
        if (sound.gain && sound.gain.gain) {
          const ctx = this.listener.context;
          sound.gain.gain.setValueAtTime(sound.gain.gain.value, ctx.currentTime);
          sound.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSecs);
        } else {
          sound.setVolume(0);
        }
      }
    });
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
const batteryItems = [];
const flickerLights = [];
const playerRadius = 0.32;
let yaw = 0;
let pitch = 0;
let mouseSensitivity = parseFloat(localStorage.getItem("setting-mouse-sensitivity") || "1.0");
let masterVolume = parseFloat(localStorage.getItem("setting-master-volume") || "0.8");
let sfxVolume = parseFloat(localStorage.getItem("setting-sfx-volume") || "0.8");
let ambientVolume = parseFloat(localStorage.getItem("setting-ambient-volume") || "0.8");
let battery = 100;
let fear = 0;
let flashlightOn = true;
let inspected = 0;
let stamina = 100;
let sprintExhausted = false;
const collectedEvidence = new Set();
const collectedBatteries = new Set();
const readLoreNotes = new Set();
let xrSession = null;
let activeLineTimer = 0;
let introPlayed = false;
let audioCtx = null;
let droneGain = null;
let heartbeatTimer = 0;
let footstepTimer = 0.35;
let meeraFirstWhisperPlayed = false;
let kulkarniCallPlayed = false;
let meeraSecondEventPlayed = false;
let activeCountdownFlicker = false;
let meeraDiaryReacted = false;
let meeraFinalEventPlayed = false;
let activeApparitionWalk = false;
let apparitionGhost = null;
let apparitionFadeTimer = 0;
let basementGateGroup = null;
let level1Group = null;
let level2Group = null;
let currentLevel = 1;
let activeLevelGroup = null;
const valvesActivated = new Set();
let generatorPressure = 0;
let generatorActive = false;
let samCharacter = null;
let samFlashlight = null;
let coopMode = false;
let battery2 = 100;
let fear2 = 0;
let stamina2 = 100;
let sprintExhausted2 = false;
let flashlightOn2 = true;
let camera2 = null;
let player2Character = null;
let player2Yaw = 0;
let player2Pitch = 0;
let godModeActive = false;
let infiniteBatteryActive = false;
let debugConsoleOpen = false;
let meeraSpeedMultiplier = 1.0;
let isPlayerHidden = false;
let isPlayer2Hidden = false;
let player1PreLockerPos = null;
let player2PreLockerPos = null;
let p1DebrisCount = 0;
let p2DebrisCount = 0;
let activeNoiseEventZ = null;
let noiseInvestigateTimer = 0;
let isHoldingBreath = false;
let isHoldingBreath2 = false;
let p1BreathStamina = 100;
let p2BreathStamina = 100;
let lastPlayer1LockerInspected = null;
let lastPlayer2LockerInspected = null;
let lockerAlertState = false;
let lockerTargetToInspect = null;
let meeraLockerSearchTimer = 0;
let runStartTime = 0;
let runEndTime = 0;
let statStaminaDrained = 0;
let statTimesHidden = 0;
let statCansThrown = 0;
let statFearPeak = 0;
let vrController1 = null;
let vrController2 = null;
let vrControllerGrip1 = null;
let vrControllerGrip2 = null;
let player2Flashlight = null;
const player2Keys = new Set();
let blackoutTriggered = false;
let isBlackoutActive = false;
const AiState = {
  INACTIVE: "inactive",
  PATROL: "patrol",
  CHASE: "chase"
};
let meeraState = AiState.INACTIVE;
let meeraPatrolDir = -1;
let meeraSpeed = 1.0;
let activeCheckpoint = null;
const shakeOffset = new THREE.Vector3();
let storyQueue = [];
let pointerLocked = false;
let flashlightLight = null;
const GameState = Object.freeze({
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAMEOVER: "gameover",
  WIN: "win",
  CHOICE: "choice"
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
    document.body.classList.toggle("started", nextState === GameState.PLAYING || nextState === GameState.PAUSED || nextState === GameState.CHOICE);
    
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
        if (audioCtx && audioManager) audioManager.playSound("ui_pause_open", { volume: 0.45 });
      } else {
        pauseMenu.classList.remove("open");
        if (prevState === GameState.PAUSED && audioCtx && audioManager) {
          audioManager.playSound("ui_pause_close", { volume: 0.40 });
        }
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

    if (winScreen) {
      if (nextState === GameState.WIN) {
        winScreen.classList.add("open");
      } else {
        winScreen.classList.remove("open");
      }
    }

    if (choiceScreen) {
      if (nextState === GameState.CHOICE) {
        choiceScreen.classList.add("open");
      } else {
        choiceScreen.classList.remove("open");
      }
    }

    this.onStateChange(nextState, prevState);
  }

  onStateChange(nextState, prevState) {
    if (nextState === GameState.PLAYING) {
      if (!clock.running) clock.start();
    } else if (nextState === GameState.PAUSED || nextState === GameState.MENU || nextState === GameState.GAMEOVER || nextState === GameState.WIN || nextState === GameState.CHOICE) {
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

function updateObjectivesSystem() {
  if (currentLevel === 1) {
    if (inspected === 0) {
      objective.textContent = "Search the corridor for Dr. Verma's Memo.";
    } else if (inspected === 1) {
      completeObjective("start");
      objective.textContent = "Use Memo details to unlock Room 32 Left door and find the Watchman's Logbook.";
    } else if (inspected === 2) {
      objective.textContent = "Use the Logbook card to unlock Room 29 Right door and locate Meera's ID.";
    } else if (inspected >= 3) {
      completeObjective("evidence");
      objective.textContent = "Basement access chains unlocked! Find the gate at the end of the corridor.";
    }
  } else {
    if (!generatorActive) {
      const activeValvesCount = valvesActivated.size;
      if (activeValvesCount < 3) {
        objective.textContent = `Basement sealed. Find and turn fuel valves to prime the backup generator (${activeValvesCount}/3).`;
      } else {
        objective.textContent = "Valves primed. Pull the Generator Starter Lever in the side engine room.";
      }
    } else {
      objective.textContent = "Generator active! Reach the Operations Terminal at the end of the hall.";
    }
  }
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
      renderer.xr.enabled = true;
      vrToggle.textContent = "Exit VR";

      vrController1 = renderer.xr.getController(0);
      vrController2 = renderer.xr.getController(1);

      const laserGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -4)
      ]);
      const laserMat = new THREE.LineBasicMaterial({
        color: 0x73d08a,
        transparent: true,
        opacity: 0.65
      });

      const l1 = new THREE.Line(laserGeom, laserMat);
      l1.name = "laser";
      vrController1.add(l1);

      const l2 = new THREE.Line(laserGeom, laserMat);
      l2.name = "laser";
      vrController2.add(l2);

      scene.add(vrController1);
      scene.add(vrController2);

      vrController1.addEventListener("selectstart", () => inspectNearestVR(vrController1));
      vrController2.addEventListener("selectstart", () => inspectNearestVR(vrController2));

      vrController1.addEventListener("squeezestart", () => toggleFlashlight());
      vrController2.addEventListener("squeezestart", () => toggleFlashlight());

      xrSession.addEventListener("end", () => {
        xrSession = null;
        renderer.xr.enabled = false;
        vrToggle.textContent = "Enter VR";
        scene.remove(vrController1);
        scene.remove(vrController2);
      });
      startGame({ lockPointer: false });
    });
  } catch (error) {
    console.warn("VR entry unavailable in this browser.", error);
  }
}

function inspectNearestVR(controller) {
  if (gameState !== GameState.PLAYING) return;
  const raycaster = new THREE.Raycaster();

  const tempMatrix = new THREE.Matrix4();
  tempMatrix.identity().extractRotation(controller.matrixWorld);

  const origin = new THREE.Vector3().setFromMatrixPosition(controller.matrixWorld);
  const direction = new THREE.Vector3(0, 0, -1).applyMatrix4(tempMatrix).normalize();

  raycaster.set(origin, direction);
  const hits = raycaster.intersectObjects(scene.children, true);

  const hit = hits.find(h => h.distance <= 4.0);
  if (!hit) return;

  let current = hit.object;
  while (current) {
    if (current.userData && current.userData.interactable) {
      inspectObject({ object: current, distance: hit.distance }, false);
      break;
    }
    current = current.parent;
  }
}

function createProceduralDroneBuffer(ctx, durationSeconds = 12) {
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  let lastOut = 0;
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Low frequency drone harmonic combination
    const drone1 = Math.sin(2 * Math.PI * 55 * t);
    const drone2 = Math.sin(2 * Math.PI * 82.5 * t) * 0.4;
    const drone3 = Math.sin(2 * Math.PI * 110 * t) * 0.2;
    const hum = drone1 + drone2 + drone3;
    
    // Spooky ambient wind / brown noise
    const white = Math.random() * 2 - 1;
    const brownNoise = (lastOut + (0.02 * white)) / 1.02;
    lastOut = brownNoise;
    
    // slow breathing mod loop
    const mod = Math.sin(2 * Math.PI * 0.08 * t) * 0.25 + 0.75;
    
    left[i] = (hum * 0.4 + brownNoise * 6.0) * mod * 0.08;
    right[i] = (hum * 0.35 + brownNoise * 6.0) * mod * 0.08;
  }
  return buffer;
}

function createConcreteStepBuffer(ctx) {
  const duration = 0.28;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-18 * t);
    const sine = Math.sin(2 * Math.PI * 120 * Math.exp(-22 * t) * t);
    const noise = (Math.random() * 2 - 1) * 0.15;
    data[i] = (sine * 0.65 + noise) * envelope * 0.22;
  }
  return buffer;
}

function createTileStepBuffer(ctx) {
  const duration = 0.22;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-28 * t);
    const sine = Math.sin(2 * Math.PI * 340 * Math.exp(-32 * t) * t);
    const noise = (Math.random() * 2 - 1) * 0.1;
    data[i] = (sine * 0.8 + noise) * envelope * 0.14;
  }
  return buffer;
}

function createFlashlightClickOnBuffer(ctx) {
  const duration = 0.08;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-60 * t);
    const clickNoise = (Math.random() * 2 - 1) * 0.3;
    const metalRing = Math.sin(2 * Math.PI * 1800 * t) * 0.45;
    data[i] = (clickNoise + metalRing) * envelope * 0.15;
  }
  return buffer;
}

function createFlashlightClickOffBuffer(ctx) {
  const duration = 0.08;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-50 * t);
    const clickNoise = (Math.random() * 2 - 1) * 0.25;
    const metalRing = Math.sin(2 * Math.PI * 1400 * t) * 0.35;
    data[i] = (clickNoise + metalRing) * envelope * 0.12;
  }
  return buffer;
}

function createDoorCreakBuffer(ctx) {
  const duration = 1.6;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = t < 0.2 ? t / 0.2 : Math.exp(-2.2 * (t - 0.2));
    const slipFrequency = 14 + t * 45;
    const click = Math.sin(2 * Math.PI * slipFrequency * t) > 0.94 ? 1.0 : -1.0;
    const squeakFreq = 950 + Math.sin(2 * Math.PI * 1.5 * t) * 150;
    const squeak = Math.sin(2 * Math.PI * squeakFreq * t) * 0.16;
    const noise = (Math.random() * 2 - 1) * 0.08;
    data[i] = (click * 0.25 + squeak + noise) * envelope * 0.15;
  }
  return buffer;
}

function createDoorLatchBuffer(ctx) {
  const duration = 0.2;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-32 * t);
    const clickNoise = (Math.random() * 2 - 1) * 0.35;
    const clickTone = Math.sin(2 * Math.PI * 980 * t) * 0.2;
    data[i] = (clickNoise + clickTone) * envelope * 0.16;
  }
  return buffer;
}

function createBuzzBuffer(ctx) {
  const duration = 1.0;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const mainHum = Math.sin(2 * Math.PI * 50 * t);
    const buzz1 = Math.sin(2 * Math.PI * 150 * t) * 0.45;
    const buzz2 = Math.sin(2 * Math.PI * 350 * t) * 0.25;
    const flicker = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.8 : 0;
    data[i] = (mainHum + buzz1 + buzz2 + flicker) * 0.08;
  }
  return buffer;
}

function createBlackoutCueBuffer(ctx) {
  const duration = 3.5;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-0.75 * t);
    const freq = 160 * Math.exp(-2.2 * t);
    const sweep = Math.sin(2 * Math.PI * freq * t) * 0.65;
    
    let spark = 0;
    if (t < 1.2) {
      const trigger = Math.sin(2 * Math.PI * 18 * t) > 0.85;
      if (trigger) {
        spark = (Math.random() * 2 - 1) * 0.45 * Math.sin(2 * Math.PI * 1200 * t);
      }
    }
    left[i] = (sweep + spark) * envelope * 0.4;
    
    const tRight = Math.max(0, t - 0.02);
    const freqR = 160 * Math.exp(-2.2 * tRight);
    const sweepR = Math.sin(2 * Math.PI * freqR * tRight) * 0.65;
    let sparkR = 0;
    if (tRight < 1.2) {
      const triggerR = Math.sin(2 * Math.PI * 18 * tRight) > 0.85;
      if (triggerR) {
        sparkR = (Math.random() * 2 - 1) * 0.45 * Math.sin(2 * Math.PI * 1200 * tRight);
      }
    }
    right[i] = (sweepR + sparkR) * envelope * 0.4;
  }
  return buffer;
}

function createGeneratorStartBuffer(ctx) {
  const duration = 5.0;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let engineSound = 0;
    if (t < 1.5) {
      const click = Math.sin(2 * Math.PI * 8 * t) > 0.7 ? 0.35 : 0;
      const noise = (Math.random() * 2 - 1) * 0.12 * Math.sin(2 * Math.PI * 40 * t);
      engineSound = click + noise;
    } else {
      const ramp = Math.min(1.0, (t - 1.5) / 2.0);
      const mainFreq = 30 + ramp * 25;
      engineSound = Math.sin(2 * Math.PI * mainFreq * t) * 0.6 + 
                    Math.sin(2 * Math.PI * (mainFreq * 2) * t) * 0.28 +
                    (Math.random() * 2 - 1) * 0.06;
    }
    const envelope = t > 4.2 ? Math.max(0, 1.0 - (t - 4.2) / 0.8) : 1.0;
    const finalVal = engineSound * envelope * 0.8;
    
    left[i] = finalVal;
    right[i] = finalVal;
  }
  return buffer;
}

function triggerBlackoutSequence() {
  isBlackoutActive = true;
  if (audioManager) {
    audioManager.playSound("blackout_cue", { volume: 1.0 });
  }
  
  setFlashlight(false);
  addTaskLog("Warning: Complete sector power failure detected.");
  sayLine("Aarav", "What the... the power's cut?! Did the backup generator just fail?", 5500);
  
  window.setTimeout(() => {
    flickerLights.forEach((lightObj, index) => {
      lightObj.base = 0.25;
      lightObj.light.color.setHex(index % 2 === 0 ? 0xb22822 : 0x228b22);
    });
    isBlackoutActive = false;
    addTaskLog("Emergency power restored. Grid stability: 18%.");
    if (audioManager) {
      audioManager.playSound("flashlight_off", { volume: 0.35 });
    }
  }, 4200);
}

function createUiHoverBuffer(ctx) {
  const duration = 0.04;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-120 * t);
    data[i] = Math.sin(2 * Math.PI * 2200 * t) * envelope * 0.05;
  }
  return buffer;
}

function createDebrisImpactBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 1.0;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-6 * t);
    const res1 = Math.sin(2 * Math.PI * 880 * t) * 0.4;
    const res2 = Math.sin(2 * Math.PI * 1350 * t) * 0.25;
    const res3 = Math.sin(2 * Math.PI * 2200 * t) * 0.15;
    const noise = (Math.random() * 2 - 1) * 0.2;
    data[i] = (res1 + res2 + res3 + noise) * env * 0.55;
  }
  return buffer;
}

function createUiSelectBuffer(ctx) {
  const duration = 0.15;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-22 * t);
    const tone1 = Math.sin(2 * Math.PI * 440 * t);
    const tone2 = Math.sin(2 * Math.PI * 554.37 * t) * 0.5;
    data[i] = (tone1 + tone2) * envelope * 0.08;
  }
  return buffer;
}

function createUiPauseOpenBuffer(ctx) {
  const duration = 0.35;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-8 * t);
    const freq = 180 * Math.exp(-6 * t);
    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.15;
  }
  return buffer;
}

function createUiPauseCloseBuffer(ctx) {
  const duration = 0.25;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-12 * t);
    const freq = 120 + t * 400;
    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.12;
  }
  return buffer;
}

function setupUiSounds() {
  document.querySelectorAll("button").forEach(btn => {
    if (btn.dataset.hasUiSounds) return;
    btn.dataset.hasUiSounds = "true";
    
    btn.addEventListener("mouseenter", () => {
      if (audioCtx && audioManager) {
        audioManager.playSound("ui_hover", { volume: 0.12 });
      }
    });
    btn.addEventListener("click", () => {
      if (audioCtx && audioManager) {
        audioManager.playSound("ui_select", { volume: 0.25 });
      }
    });
  });
}

function setFlashlight(state) {
  const previous = flashlightOn;
  flashlightOn = state && battery > 0;
  if (previous !== flashlightOn) {
    const clickSound = flashlightOn ? "flashlight_on" : "flashlight_off";
    if (audioManager) audioManager.playSound(clickSound, { volume: 0.42 });
    caption.textContent = flashlightOn ? "Flashlight on." : "Flashlight off.";
  }
}

function toggleFlashlight() {
  setFlashlight(!flashlightOn);
}

function setFlashlight2(state) {
  const previous = flashlightOn2;
  flashlightOn2 = state && battery2 > 0;
  if (previous !== flashlightOn2) {
    const clickSound = flashlightOn2 ? "flashlight_on" : "flashlight_off";
    if (audioManager) audioManager.playSound(clickSound, { volume: 0.42 });
    caption.textContent = flashlightOn2 ? "Player 2 Flashlight on." : "Player 2 Flashlight off.";
  }
}

function toggleFlashlight2() {
  setFlashlight2(!flashlightOn2);
}

function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();

  if (audioCtx.state === "suspended") {
    const resume = () => {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      window.removeEventListener("click", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("click", resume);
    window.addEventListener("keydown", resume);
  }

  const droneBuffer = createProceduralDroneBuffer(audioCtx, 12);
  audioManager.buffers.set("ambient_drone", droneBuffer);
  audioManager.playSound("ambient_drone", { loop: true, volume: 0.45, category: "ambient" });

  const concreteBuffer = createConcreteStepBuffer(audioCtx);
  const tileBuffer = createTileStepBuffer(audioCtx);
  audioManager.buffers.set("step_concrete", concreteBuffer);
  audioManager.buffers.set("step_tile", tileBuffer);

  const clickOnBuffer = createFlashlightClickOnBuffer(audioCtx);
  const clickOffBuffer = createFlashlightClickOffBuffer(audioCtx);
  audioManager.buffers.set("flashlight_on", clickOnBuffer);
  audioManager.buffers.set("flashlight_off", clickOffBuffer);

  const doorCreakBuffer = createDoorCreakBuffer(audioCtx);
  const doorLatchBuffer = createDoorLatchBuffer(audioCtx);
  audioManager.buffers.set("door_creak", doorCreakBuffer);
  audioManager.buffers.set("door_latch", doorLatchBuffer);

  const whisperBuffer = createWhisperBuffer(audioCtx);
  audioManager.buffers.set("evidence_whisper", whisperBuffer);

  const phoneRingBuffer = createPhoneRingBuffer(audioCtx);
  audioManager.buffers.set("phone_ring", phoneRingBuffer);

  const jumpscareBuffer = createJumpscareStingerBuffer(audioCtx);
  audioManager.buffers.set("jumpscare_stinger", jumpscareBuffer);

  const blackoutBuffer = createBlackoutCueBuffer(audioCtx);
  audioManager.buffers.set("blackout_cue", blackoutBuffer);

  const buzzBuffer = createBuzzBuffer(audioCtx);
  audioManager.buffers.set("electric_buzz", buzzBuffer);

  const generatorStartBuffer = createGeneratorStartBuffer(audioCtx);
  audioManager.buffers.set("generator_start", generatorStartBuffer);

  // Play spatial buzzing hum on a couple of the corridor lights
  flickerLights.forEach((lightObj, index) => {
    if (index % 2 === 0) {
      audioManager.playSound("electric_buzz", {
        positional: true,
        targetMesh: lightObj.light,
        loop: true,
        refDistance: 1.2,
        maxDistance: 14,
        volume: 0.12,
        category: "ambient"
      });
    }
  });

  if (basementGateGroup) {
    audioManager.playSound("electric_buzz", {
      positional: true,
      targetMesh: basementGateGroup,
      loop: true,
      refDistance: 1.5,
      maxDistance: 16,
      volume: 0.20,
      category: "ambient"
    });
  }

  const metronomeTickBuffer = createTickingBuffer(audioCtx);
  audioManager.buffers.set("metronome_tick", metronomeTickBuffer);

  if (scene.userData.metronomeMesh) {
    audioManager.playSound("metronome_tick", {
      positional: true,
      targetMesh: scene.userData.metronomeMesh,
      loop: true,
      refDistance: 1.2,
      maxDistance: 12,
      volume: 0.28,
      category: "ambient"
    });
  }

  audioManager.buffers.set("ui_hover", createUiHoverBuffer(audioCtx));
  audioManager.buffers.set("ui_select", createUiSelectBuffer(audioCtx));
  audioManager.buffers.set("ui_pause_open", createUiPauseOpenBuffer(audioCtx));
  audioManager.buffers.set("ui_pause_close", createUiPauseCloseBuffer(audioCtx));
  audioManager.buffers.set("debris_impact", createDebrisImpactBuffer(audioCtx));

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

function playDoorCreak(targetMesh, isOpen) {
  if (audioManager && targetMesh) {
    const soundName = isOpen ? "door_creak" : "door_latch";
    audioManager.playSound(soundName, {
      positional: true,
      targetMesh: targetMesh,
      refDistance: 1.6,
      maxDistance: 22,
      volume: isOpen ? 0.52 : 0.35
    });
  }
}

function createWhisperBuffer(ctx) {
  const duration = 1.8;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-2.2 * t);
    const chimeFreq = 880 * Math.exp(-1.8 * t);
    const chime = Math.sin(2 * Math.PI * chimeFreq * t) * 0.4;
    const sub = Math.sin(2 * Math.PI * 65 * Math.exp(-4 * t) * t) * 0.45;
    const mod = Math.sin(2 * Math.PI * 4.5 * t) * 0.4 + 0.6;
    const whisper = (Math.random() * 2 - 1) * 0.18 * mod;
    left[i] = (chime + sub + whisper) * envelope * 0.16;
    
    const tRight = Math.max(0, t - 0.025);
    const chimeR = Math.sin(2 * Math.PI * (880 * Math.exp(-1.8 * tRight)) * tRight) * 0.4;
    const whisperR = (Math.random() * 2 - 1) * 0.18 * mod;
    right[i] = (chimeR + sub + whisperR) * envelope * 0.16;
  }
  return buffer;
}

function playWhisper() {
  if (audioManager) {
    audioManager.playSound("evidence_whisper", { volume: 0.58 });
  }
}

function createPhoneRingBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 2.4;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let ring = 0;
    if ((t >= 0 && t < 0.4) || (t >= 0.6 && t < 1.0)) {
      ring = Math.sin(2 * Math.PI * 400 * t) + Math.sin(2 * Math.PI * 450 * t);
      ring *= 0.5 * (1 + Math.sin(2 * Math.PI * 25 * t));
      let localT = (t >= 0 && t < 0.4) ? t : t - 0.6;
      let fade = Math.sin(Math.PI * localT / 0.4);
      ring *= fade;
    }
    data[i] = ring * 0.24;
  }
  return buffer;
}

function createTickingBuffer(ctx) {
  const sampleRate = ctx.sampleRate;
  const duration = 1.0; // 1 tick per second
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let click = 0;
    if (t < 0.05) {
      // Woodblock/tick decay click
      click = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-120 * t);
    }
    data[i] = click * 0.18;
  }
  return buffer;
}

function createJumpscareStingerBuffer(ctx) {
  const duration = 2.4;
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-1.4 * t);
    
    // FM synth high frequency screaming screech
    const fm = Math.sin(2 * Math.PI * 40 * t) * 120;
    const screamer = Math.sin(2 * Math.PI * (2800 + fm) * t) * 0.35;
    
    // Sub bass impact boom
    const subFreq = 90 * Math.exp(-2.8 * t);
    const subBoom = Math.sin(2 * Math.PI * subFreq * t) * 0.5;
    
    // Brutal white noise impact transient
    const noiseEnv = Math.exp(-6.5 * t);
    const noise = (Math.random() * 2 - 1) * 0.6 * noiseEnv;
    
    left[i] = (screamer + subBoom + noise) * envelope * 0.28;
    
    const tRight = Math.max(0, t - 0.015);
    const fmR = Math.sin(2 * Math.PI * 40 * tRight) * 120;
    const screamerR = Math.sin(2 * Math.PI * (2800 + fmR) * tRight) * 0.35;
    const noiseR = (Math.random() * 2 - 1) * 0.6 * Math.exp(-6.5 * tRight);
    right[i] = (screamerR + subBoom + noiseR) * envelope * 0.28;
  }
  return buffer;
}

function playJumpscareStinger() {
  if (audioManager) {
    audioManager.playSound("jumpscare_stinger", { volume: 1.0 });
    audioManager.duckAmbient(3200, 0.15);
    fear = Math.min(100, fear + 24);
    caption.textContent = "A cold chill runs down Aarav's spine. Something is close.";
  }
}

function proceduralTexture({ base = "#514b40", grain = "#2a241f", scratches = "#776b5a", scale = 1 }) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 512;
  textureCanvas.height = 512;
  const ctx = textureCanvas.getContext("2d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 420; i += 1) {
    const alpha = Math.random() * 0.16;
    ctx.strokeStyle = i % 4 === 0 ? `rgba(255,245,220,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 80 * scale, y + Math.random() * 13 * scale);
    ctx.stroke();
  }

  ctx.strokeStyle = grain;
  ctx.lineWidth = 2;
  for (let y = 0; y < 512; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.random() * 9);
    ctx.lineTo(512, y + Math.random() * 11);
    ctx.stroke();
  }

  ctx.strokeStyle = scratches;
  ctx.lineWidth = 1;
  for (let i = 0; i < 55; i += 1) {
    ctx.beginPath();
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.random() * 110 - 40, y + Math.random() * 45 - 22);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
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

function addToActiveLevel(object) {
  if (activeLevelGroup) {
    activeLevelGroup.add(object);
  } else {
    scene.add(object);
  }
}

function box(name, size, position, material, cast = true, receive = true, isCollider = false) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  addToActiveLevel(mesh);
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

function buildLocker(position, label) {
  const group = new THREE.Group();
  group.position.set(...position);
  
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2e2720, roughness: 0.82 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.2, 0.85), frameMat);
  frame.position.set(0, 1.1, 0);
  frame.castShadow = true;
  frame.receiveShadow = true;
  group.add(frame);
  
  const doorSlat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 2.0, 0.05), new THREE.MeshStandardMaterial({ color: 0x120d0a, roughness: 0.95 }));
  doorSlat.position.set(0, 1.1, 0.41);
  group.add(doorSlat);
  
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.04), new THREE.MeshStandardMaterial({ color: 0xaa7a36, metalness: 0.8, roughness: 0.3 }));
  handle.position.set(-0.3, 1.1, 0.44);
  group.add(handle);
  
  addToActiveLevel(group);
  
  tagInteractable(frame, "hiding_spot", label);
  frame.userData.lockerGroup = group;
  
  registerCollider(frame);
  return group;
}

function buildDebrisItem(position, name) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.name = name;
  
  const can = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: 0x8a715f, roughness: 0.9, metalness: 0.3 })
  );
  can.position.set(0, 0.175, 0);
  can.castShadow = true;
  group.add(can);
  
  addToActiveLevel(group);
  tagInteractable(can, "debris_can", "Rusted Can");
  can.userData.parentGroup = group;
  return group;
}

function addLabel(text, position, size = 0.34) {
  const canvasLabel = document.createElement("canvas");
  canvasLabel.width = 512;
  canvasLabel.height = 128;
  const ctx = canvasLabel.getContext("2d");
  ctx.fillStyle = "#d8c39f";
  ctx.fillRect(0, 0, canvasLabel.width, canvasLabel.height);
  ctx.fillStyle = "#2d2118";
  ctx.font = "700 29px Georgia";
  ctx.fillText(text, 23, 72);
  const texture = new THREE.CanvasTexture(canvasLabel);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size * 4, size),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.88 })
  );
  mesh.position.set(...position);
  mesh.rotation.y = Math.PI;
  mesh.castShadow = true;
  addToActiveLevel(mesh);
  return mesh;
}

function createDoor({ side, z, label }) {
  const direction = side === "left" ? -1 : 1;
  const group = new THREE.Group();
  group.name = label;
  group.position.set(direction * 3.62, 1.18, z);
  const locked = label.includes("Room 32 left") || label.includes("Room 29 right");
  group.userData = { type: "door", open: false, side, label, locked };

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

  addToActiveLevel(group);
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

  addToActiveLevel(group);
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
  addToActiveLevel(group);
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

  addToActiveLevel(group);
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
    addToActiveLevel(lamp);
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
  basementGateGroup = new THREE.Group();
  basementGateGroup.name = "basement gate group";
  basementGateGroup.position.set(0, 0, -48);
  
  const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 0.28), materials.darkWood);
  gateFrame.position.set(0, 1.9, 0);
  gateFrame.name = "basement gate frame";
  basementGateGroup.add(gateFrame);

  const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 0.1), materials.brass);
  gateLeft.position.set(-0.8, 1.7, 0.05);
  gateLeft.name = "basement gate left door";
  tagInteractable(gateLeft, "basement_gate", "Basement Gate Left");
  basementGateGroup.add(gateLeft);
  
  const gateRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 0.1), materials.brass);
  gateRight.position.set(0.8, 1.7, 0.05);
  gateRight.name = "basement gate right door";
  tagInteractable(gateRight, "basement_gate", "Basement Gate Right");
  basementGateGroup.add(gateRight);

  addToActiveLevel(basementGateGroup);
  registerCollider(gateFrame);
  interactables.push(gateLeft, gateRight);
  initBatteries();
  initLoreNotes();
  buildCheckpointConsole([2.8, 0, -18.5], "Emergency Terminal");

  // Hiding spots & distractions (Phase 11)
  buildLocker([-2.2, 0, -20.0], "Corridor Locker 1");
  buildLocker([2.2, 0, -32.0], "Corridor Locker 2");
  buildDebrisItem([-1.8, 0, -14.0], "can_1");
  buildDebrisItem([1.8, 0, -28.0], "can_2");
}

function clearGroup(group) {
  if (!group) return;
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
  }
}

function loadLevel2() {
  currentLevel = 2;
  level1Group.visible = false;
  level2Group.visible = true;
  activeLevelGroup = level2Group;

  valvesActivated.clear();
  generatorPressure = 0;
  generatorActive = false;

  colliders.length = 0;
  interactables.length = 0;
  doors.length = 0;
  evidenceItems.length = 0;
  batteryItems.length = 0;
  flickerLights.length = 0;

  clearGroup(level2Group);
  buildLevel2();

  camera.position.set(0, 1.7, 8);
  camera.rotation.set(0, 0, 0);
  yaw = 0;
  pitch = 0;

  caption.textContent = "A cold, damp basement smell. Backup batteries hum in the dark.";
  sayLine("Aarav", "I'm in... it's completely sealed. The generator room should be down the hall.");
  
  if (audioManager) {
    audioManager.playSound("blackout_cue", { volume: 0.5 });
  }

  updateObjectivesSystem();
  addTaskLog("Entered Block A Basement Lab.");
}

function buildValveMesh(position, id, name) {
  const group = new THREE.Group();
  group.name = id;
  group.position.set(...position);
  
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.52, 8), materials.brass);
  pipe.rotation.z = Math.PI / 2;
  group.add(pipe);
  
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 16), materials.bookRed);
  wheel.position.set(0.26, 0, 0);
  wheel.rotation.y = Math.PI / 2;
  group.add(wheel);
  
  tagInteractable(wheel, "valve", name);
  wheel.userData.valveId = id;
  wheel.userData.parentValve = group;
  interactables.push(wheel);
  
  addToActiveLevel(group);
  return group;
}

function buildConfessionTapeMesh(position) {
  const group = new THREE.Group();
  group.name = "confession_tape";
  group.position.set(...position);
  
  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.18), materials.brass);
  tape.castShadow = true;
  group.add(tape);
  
  tagInteractable(tape, "lore_note", "Dr. Verma's Confession Tape");
  tape.userData.loreText = "Audio Log - Dr. Verma (2005): 'The trial has exceeded 168 hours. Subject M is unresponsive to external audio cues but continues to vocalize the numerical sequence. The administration wants to seal the block to preserve funding. God forgive us.'";
  tape.userData.loreLabel = "Dr. Verma's Confession Tape";
  
  interactables.push(tape);
  addToActiveLevel(group);
  return group;
}

let exitTerminalGroup = null;

function buildExitTerminalMesh(position) {
  const group = new THREE.Group();
  group.name = "exit_terminal";
  group.position.set(...position);
  
  const base = box("exit terminal base", [0.65, 0.95, 0.65], [0, 0.47, 0], materials.darkWood, true, true, true);
  group.add(base);
  
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.35, 0.1),
    materials.emission
  );
  screen.position.set(0, 1.05, 0.05);
  screen.rotation.x = -0.35;
  group.add(screen);
  
  tagInteractable(screen, "exit_terminal", "Main Operations Terminal");
  screen.userData.parentTerminal = group;
  interactables.push(screen);
  
  addToActiveLevel(group);
  exitTerminalGroup = group;
  return group;
}

function buildLevel2() {
  box("basement floor", [6, 0.18, 50], [0, -0.1, -15], materials.floor, false, true);
  box("basement ceiling", [6, 0.24, 50], [0, 3.0, -15], materials.wall, false, true);
  
  box("basement left wall", [0.24, 3.0, 50], [-3.02, 1.41, -15], materials.wall, true, true, true);
  box("basement right wall", [0.24, 3.0, 50], [3.02, 1.41, -15], materials.wall, true, true, true);
  
  box("basement front wall", [6, 3.0, 0.24], [0, 1.41, 10.02], materials.wall, true, true, true);
  box("basement back wall", [6, 3.0, 0.24], [0, 1.41, -40.02], materials.wall, true, true, true);

  box("gen room floor", [6, 0.18, 8], [6.0, -0.1, -20], materials.floor, false, true);
  box("gen room ceiling", [6, 0.24, 8], [6.0, 3.0, -20], materials.wall, false, true);
  box("gen room back wall", [6, 3.0, 0.24], [6.0, 1.41, -24.02], materials.wall, true, true, true);
  box("gen room front wall", [6, 3.0, 0.24], [6.0, 1.41, -15.98], materials.wall, true, true, true);
  box("gen room right wall", [0.24, 3.0, 8], [9.02, 1.41, -20], materials.wall, true, true, true);
  
  box("gen wall segment left", [0.24, 3.0, 21], [3.02, 1.41, -5.5], materials.wall, true, true, true);
  box("gen wall segment right", [0.24, 3.0, 21], [3.02, 1.41, -30.5], materials.wall, true, true, true);
  
  const genGroup = new THREE.Group();
  genGroup.name = "generator";
  genGroup.position.set(6.0, 0, -20.0);
  
  const genBase = box("generator base", [2.2, 1.15, 2.2], [0, 0.52, 0], materials.darkWood, true, true, true);
  genGroup.add(genBase);
  
  const genEngine = box("generator engine", [1.6, 0.82, 1.6], [0, 1.3, 0], materials.brass, true, true, true);
  genGroup.add(genEngine);
  
  const genStripe = box("generator stripe", [1.68, 0.16, 1.68], [0, 1.1, 0], materials.emission, false, false);
  genGroup.add(genStripe);
  
  const leverBase = box("lever base", [0.35, 0.35, 0.18], [0, 1.2, 0.82], materials.darkWood, true, true, true);
  genGroup.add(leverBase);
  const leverHandle = box("generator starter lever", [0.08, 0.42, 0.08], [0, 1.32, 0.88], materials.brass, true, true, true);
  leverHandle.rotation.x = -0.52;
  tagInteractable(leverHandle, "generator_lever", "Generator Starter Lever");
  leverHandle.userData.parentLever = genGroup;
  genGroup.add(leverHandle);
  interactables.push(leverHandle);
  
  addToActiveLevel(genGroup);
  
  buildValveMesh([0, 0.82, 5.0], "Valve 1", "Fuel Valve A");
  buildValveMesh([-2.4, 0.82, -35.0], "Valve 2", "Fuel Valve B");
  buildValveMesh([7.5, 0.82, -22.5], "Valve 3", "Fuel Valve C");
  
  buildConfessionTapeMesh([6.8, 1.12, -18.2]);

  const chamberGroup = new THREE.Group();
  chamberGroup.name = "sensory chamber";
  chamberGroup.position.set(-2.0, 0, -22.0);
  const chamberShell = box("chamber shell", [1.8, 2.5, 1.8], [0, 1.25, 0], materials.darkWood, true, true, true);
  chamberGroup.add(chamberShell);
  const chamberGlass = box("chamber glass", [1.2, 1.6, 0.08], [0, 1.3, 0.86], materials.glass, false, true, true);
  chamberGroup.add(chamberGlass);
  const chamberLabel = addLabel("EXPERIMENTAL SENSORY ISOLATION CHAMBER 01", [0, 2.3, 0.92], 0.22);
  chamberGroup.add(chamberLabel);
  addToActiveLevel(chamberGroup);
  registerCollider(chamberShell);
  
  buildCheckpointConsole([-2.0, 0, -10.0], "Applied Cognition Terminal");
  buildExitTerminalMesh([0, 0, -38.5]);

  for (let z = 5; z > -36; z -= 12) {
    const lamp = new THREE.PointLight(0x73d08a, 0.88, 7, 2.0);
    lamp.position.set(0, 2.65, z);
    lamp.castShadow = true;
    addToActiveLevel(lamp);
    flickerLights.push({ light: lamp, base: lamp.intensity, phase: Math.random() * Math.PI * 2 });
    box("lamp shade", [0.9, 0.1, 0.45], [0, 2.58, z], materials.brass);
    box("lamp glow", [0.6, 0.03, 0.22], [0, 2.5, z], materials.emission, false, false);
  }
  
  scene.userData.meeraCharacter = createCharacter({ name: "Meera", position: [0, 0, -32], color: 0xc9d5cf, ghostly: true });
  scene.userData.meeraCharacter.visible = false;

  samCharacter = createCharacter({ name: "Sam", position: [1.2, 0, 7.5], color: 0xa87c5c });
  const samLight = new THREE.SpotLight(0xffecc2, 2.5, 14, Math.PI / 6, 0.45, 1.0);
  samLight.castShadow = true;
  addToActiveLevel(samLight);
  addToActiveLevel(samLight.target);
  samFlashlight = samLight;

  queueStory([
    ["Sam", "Aarav, is that you? Thank god. Kulkarni told me you went down here."],
    ["Sam", "I brought a backup light. Let's find the fuel valves and get this grid online together."]
  ]);

  // Hiding spots & distractions (Phase 11)
  buildLocker([-1.8, 0, -18.0], "Lab Locker 1");
  buildDebrisItem([1.8, 0, -24.0], "can_3");
}

function buildDormRoom() {
  const dormGroup = new THREE.Group();
  dormGroup.name = "dorm_room_group";
  scene.userData.dormGroup = dormGroup;

  const roomZ = -35;

  function dormBox(name, size, position, mat, cast = true, receive = true, isCol = false) {
    const m = box(name, size, position, mat, cast, receive, isCol);
    dormGroup.attach(m);
    return m;
  }

  dormBox("dorm floor", [13, 0.16, 12], [0, -0.08, roomZ], materials.floor);
  dormBox("dorm back wall", [13, 4, 0.3], [0, 1.9, roomZ - 6], materials.wall, false, true, true);
  dormBox("dorm left wall", [0.3, 4, 12.3], [-6.5, 1.9, roomZ], materials.wall, false, true, true);
  dormBox("dorm right wall", [0.3, 4, 12.3], [6.5, 1.9, roomZ], materials.wall, false, true, true);
  dormBox("dorm front wall left", [2.5, 4, 0.3], [-5.25, 1.9, roomZ + 6], materials.wall, false, true, true);
  dormBox("dorm front wall right", [2.5, 4, 0.3], [5.25, 1.9, roomZ + 6], materials.wall, false, true, true);

  dormBox("bed left base", [2.2, 0.42, 4.8], [-3.1, 0.28, roomZ - 1.6], materials.darkWood, true, true, true);
  dormBox("bed left mattress", [2.04, 0.28, 4.56], [-3.1, 0.68, roomZ - 1.6], materials.fabric);
  dormBox("bed right base", [2.2, 0.42, 4.8], [3.1, 0.28, roomZ - 1.4], materials.darkWood, true, true, true);
  dormBox("bed right mattress", [2.04, 0.28, 4.56], [3.1, 0.68, roomZ - 1.4], materials.fabric);
  dormBox("desk", [2.4, 0.22, 1.2], [0, 1, roomZ - 4.4], materials.darkWood, true, true, true);
  dormBox("desk left leg", [0.16, 1, 0.16], [-1, 0.45, roomZ - 3.96], materials.darkWood);
  dormBox("desk right leg", [0.16, 1, 0.16], [1, 0.45, roomZ - 3.96], materials.darkWood);
  dormBox("fallen chair", [0.9, 0.14, 0.9], [-1.7, 0.28, roomZ + 1.8], materials.darkWood, true, true, true).rotation.z = 0.6;
  dormBox("blood mark", [0.9, 0.025, 1.9], [1.7, 0.04, roomZ + 2.8], materials.hazard, false);

  createBookStack([-0.46, 1.17, roomZ - 4.42], 0.1);
  createBookshelf([-5.1, 0, roomZ - 2.6], Math.PI / 2);

  // Task 65: Meera's Diary Page on left bed
  const diaryPage = box("Meera's Diary Page", [0.34, 0.02, 0.24], [-3.1, 0.83, roomZ - 1.6], materials.paper);
  tagInteractable(diaryPage, "lore_note", "Meera's Diary Page");
  diaryPage.userData.loreText = "October 12, 2004. The noise in the walls isn't random. It's a sequence. 42, 18, 5, 0... If I stop counting, the doors stay locked. If I sleep, they change the sequence.";
  diaryPage.userData.loreLabel = "Meera's Diary Page";
  dormGroup.attach(diaryPage);
  interactables.push(diaryPage);

  // Task 66: Aarav's Capstone Project Report on desk
  const reportPage = box("Capstone Project Report", [0.34, 0.02, 0.24], [0.8, 1.13, roomZ - 4.4], materials.paper);
  tagInteractable(reportPage, "lore_note", "Capstone Project Report");
  reportPage.userData.loreText = "Ravenswood Capstone 2026 - Aarav Mehta. Topic: Neural Synchronization via Low-Frequency Audio Stimuli. Notes: The backup grid in Block A still hums at 12Hz, exactly matching the target frequency from the 2004 experiments.";
  reportPage.userData.loreLabel = "Capstone Project Report";
  dormGroup.attach(reportPage);
  interactables.push(reportPage);

  // Task 68: Add metronome prop on desk
  buildMetronome([-0.6, 1.11, roomZ - 4.4], dormGroup);

  addToActiveLevel(dormGroup);
}

function buildMetronome(position, dormGroup) {
  const group = new THREE.Group();
  group.name = "metronome_group";
  group.position.set(...position);

  // Pyramidal base (cylinder with 4 segments and different radii)
  const baseGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.32, 4);
  const baseMesh = new THREE.Mesh(baseGeo, materials.darkWood);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  baseMesh.rotation.y = Math.PI / 4; // look like a pyramid
  group.add(baseMesh);

  // Brass rod
  const rodGeo = new THREE.BoxGeometry(0.01, 0.22, 0.01);
  const rodMesh = new THREE.Mesh(rodGeo, materials.brass);
  rodMesh.position.set(0, 0.10, 0.04);
  rodMesh.castShadow = true;
  group.add(rodMesh);

  tagInteractable(baseMesh, "metronome", "Sealed Metronome");
  baseMesh.userData.parentMetronome = group;
  scene.userData.metronomeMesh = baseMesh;

  dormGroup.attach(group);
  interactables.push(baseMesh);
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

function buildBatteryMesh(position, name) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.22, 12),
    materials.darkWood
  );
  body.rotation.x = Math.PI / 2;
  body.castShadow = true;
  group.add(body);
  
  const stripe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.062, 0.062, 0.08, 12),
    materials.emission
  );
  stripe.rotation.x = Math.PI / 2;
  group.add(stripe);
  
  const terminal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12),
    materials.brass
  );
  terminal.position.z = 0.12;
  terminal.rotation.x = Math.PI / 2;
  group.add(terminal);

  tagInteractable(body, "battery", name);
  body.userData.parentBattery = group;
  
  addToActiveLevel(group);
  return group;
}

function initBatteries() {
  batteryItems.forEach(b => scene.remove(b));
  batteryItems.length = 0;
  
  batteryItems.push(buildBatteryMesh([1.8, 0.2, 2.0], "Battery Pack"));
  batteryItems.push(buildBatteryMesh([-5.5, 0.8, -18.4], "Spare Battery"));
  batteryItems.push(buildBatteryMesh([2.6, 0.68, -35.2], "Emergency Battery"));
}

function buildCheckpointConsole(position, name) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  
  const base = box("terminal base", [0.45, 0.95, 0.45], [0, 0.47, 0], materials.darkWood, true, true, true);
  group.add(base);
  
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.28, 0.08),
    materials.emission
  );
  screen.position.set(0, 1.05, 0.04);
  screen.rotation.x = -0.35;
  group.add(screen);
  
  tagInteractable(screen, "checkpoint", name);
  screen.userData.parentConsole = group;
  
  addToActiveLevel(group);
  return group;
}

function buildLoreNote(position, rotation, text, label) {
  const noteGroup = new THREE.Group();
  noteGroup.name = label;
  noteGroup.position.set(...position);
  noteGroup.rotation.y = rotation;
  
  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.24, 0.008),
    materials.paper
  );
  paper.castShadow = true;
  noteGroup.add(paper);

  tagInteractable(paper, "lore_note", label);
  paper.userData.loreText = text;
  paper.userData.loreLabel = label;

  addToActiveLevel(noteGroup);
  interactables.push(paper);
  return noteGroup;
}

function initLoreNotes() {
  buildLoreNote(
    [-3.42, 1.46, -5.8], Math.PI / 2,
    "Note pinned by maintenance: \"Block A backup grid rerouted to Laboratory Room 2A. Do not adjust fuses. \u2014 Chief Warden, 2019.\"",
    "Maintenance Fuse Notice"
  );
  buildLoreNote(
    [3.42, 1.56, -14.2], -Math.PI / 2,
    "Torn page from a notebook: \"Subject M has stopped eating. She says something counts on the walls at night. We continue.\"",
    "Torn Lab Page"
  );
  buildLoreNote(
    [-3.42, 1.46, -26.8], Math.PI / 2,
    "Handwritten scrawl on a door frame: \"The metronome doesn\'t need power. It never did. \u2014 M.I.\"",
    "Meera's Wall Scrawl"
  );
  buildLoreNote(
    [3.42, 1.58, -38.4], -Math.PI / 2,
    "Safety notice, partially burned: \"All Applied Cognition experiments suspended pending ethics review. Files to be sealed until 2025. Access revoked. \u2014 Dean\'s Office, 2005.\"",
    "Burned Safety Notice"
  );
  buildLoreNote(
    [-3.42, 1.50, -18.2], Math.PI / 2,
    "Dean\'s Memo, June 2005: \"Kulkarni, the Ministry is questioning the volunteer registry. We cannot account for Meera Iyer\'s academic status. Erase all records from the Block A local server immediately.\"",
    "Dean\'s Secret Memo"
  );
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
  if (gameState !== GameState.PLAYING || debugConsoleOpen) return;

  if (renderer.xr.enabled && renderer.xr.isPresenting) {
    const session = renderer.xr.getSession();
    if (session) {
      const sources = session.inputSources;
      let vrForward = 0;
      let vrStrafe = 0;
      let vrLookYaw = 0;
      
      for (const source of sources) {
        if (source.gamepad) {
          const axes = source.gamepad.axes;
          const handedness = source.handedness;
          const deadzone = 0.18;
          
          if (handedness === "left") {
            const x = axes[2] ?? axes[0] ?? 0;
            const y = axes[3] ?? axes[1] ?? 0;
            if (Math.abs(x) > deadzone) vrStrafe = x;
            if (Math.abs(y) > deadzone) vrForward = -y;
          } else if (handedness === "right") {
            const x = axes[2] ?? axes[0] ?? 0;
            if (Math.abs(x) > deadzone) vrLookYaw = x;
          }
        }
      }
      
      yaw -= vrLookYaw * delta * 1.5;
      camera.rotation.set(0, yaw, 0, "YXZ");
      
      const vrDir = new THREE.Vector3(vrStrafe, 0, -vrForward).normalize().multiplyScalar(3.0 * delta);
      vrDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      const vrCandidate = camera.position.clone().add(vrDir);
      if (canOccupy(vrCandidate)) {
        camera.position.copy(vrCandidate);
      }
      camera.position.y = 1.7;
    }
    return;
  }
  const forward = Number(keys.has("KeyW")) - Number(keys.has("KeyS"));
  const strafe = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
  const wantsSprint = keys.has("ShiftLeft");
  const moving = forward !== 0 || strafe !== 0;
  const sprint = wantsSprint && moving && stamina > 0 && !sprintExhausted;
  stamina = THREE.MathUtils.clamp(stamina + (sprint ? -34 : 22) * delta, 0, 100);
  if (sprint) statStaminaDrained += 34 * delta;
  if (stamina <= 0 && !sprintExhausted) {
    sprintExhausted = true;
    caption.textContent = "Aarav is winded. Release Shift to recover.";
  }
  if (!wantsSprint && stamina > 35) sprintExhausted = false;
  const speed = sprint ? 5.4 : 3.0;
  
  // Player 1 Mouse / Keyboard Look (if not using split-screen keyboard keys, P1 can look with mouse, but if shared keyboard let's allow arrow keys only if NOT co-op mode)
  let lookX = 0;
  let lookY = 0;
  if (!coopMode) {
    lookX = Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft"));
    lookY = Number(keys.has("ArrowDown")) - Number(keys.has("ArrowUp"));
  }
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

  // Sync Player 1 model
  if (coopMode && scene.userData.player1Character) {
    scene.userData.player1Character.position.copy(camera.position);
    scene.userData.player1Character.position.y = 0;
    scene.userData.player1Character.rotation.set(0, yaw, 0);
  }

  // Player 2 controls
  if (coopMode && camera2 && player2Character) {
    const forward2 = Number(player2Keys.has("ArrowUp")) - Number(player2Keys.has("ArrowDown"));
    const strafe2 = Number(player2Keys.has("ArrowRight")) - Number(player2Keys.has("ArrowLeft"));
    const wantsSprint2 = player2Keys.has("ShiftRight");
    const moving2 = forward2 !== 0 || strafe2 !== 0;
    const sprint2 = wantsSprint2 && moving2 && stamina2 > 0 && !sprintExhausted2;
    stamina2 = THREE.MathUtils.clamp(stamina2 + (sprint2 ? -34 : 22) * delta, 0, 100);
    if (sprint2) statStaminaDrained += 34 * delta;
    if (stamina2 <= 0 && !sprintExhausted2) {
      sprintExhausted2 = true;
    }
    if (!wantsSprint2 && stamina2 > 35) sprintExhausted2 = false;
    const speed2 = sprint2 ? 5.4 : 3.0;

    let gpForward = forward2;
    let gpStrafe = strafe2;
    let gpLookX = 0;
    let gpLookY = 0;
    let gpSprint = sprint2;
    
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (pads[0]) {
      const pad = pads[0];
      const lx = pad.axes[0] ?? 0;
      const ly = pad.axes[1] ?? 0;
      const rx = pad.axes[2] ?? 0;
      const ry = pad.axes[3] ?? 0;
      const dead = 0.18;
      
      if (Math.abs(lx) > dead) gpStrafe = lx;
      if (Math.abs(ly) > dead) gpForward = -ly;
      if (Math.abs(rx) > dead) gpLookX = rx;
      if (Math.abs(ry) > dead) gpLookY = ry;
      if (pad.buttons[10]?.pressed) gpSprint = true;
    }

    // P2 keyboard rotate look using Period / Slash if no controller is attached
    const lookX2 = Number(player2Keys.has("Period")) - Number(player2Keys.has("Slash"));
    player2Yaw -= (lookX2 * 1.7 + gpLookX * 1.5) * delta;
    player2Pitch = THREE.MathUtils.clamp(player2Pitch - gpLookY * delta * 1.25, -1.1, 1.1);
    camera2.rotation.set(player2Pitch, player2Yaw, 0, "YXZ");

    const direction2 = new THREE.Vector3(gpStrafe, 0, gpForward).normalize().multiplyScalar(speed2 * delta);
    direction2.applyAxisAngle(new THREE.Vector3(0, 1, 0), player2Yaw);
    const candidate2 = camera2.position.clone().add(direction2);
    if (canOccupy(candidate2)) {
      camera2.position.copy(candidate2);
    } else {
      const xOnly2 = camera2.position.clone().add(new THREE.Vector3(direction2.x, 0, 0));
      const zOnly2 = camera2.position.clone().add(new THREE.Vector3(0, 0, direction2.z));
      if (canOccupy(xOnly2)) camera2.position.copy(xOnly2);
      if (canOccupy(zOnly2)) camera2.position.copy(zOnly2);
    }
    camera2.position.y = 1.7;

    player2Character.position.copy(camera2.position);
    player2Character.position.y = 0;
    player2Character.rotation.set(0, player2Yaw, 0);
  }

  // Footstep audio triggering logic
  if (moving) {
    const stepInterval = sprint ? 0.34 : 0.56;
    footstepTimer += delta;
    if (footstepTimer >= stepInterval) {
      footstepTimer = 0;
      const inDorm = Math.abs(camera.position.x) > 3.0 && (camera.position.z <= -29 && camera.position.z >= -41);
      const stepSound = inDorm ? "step_tile" : "step_concrete";
      audioManager.playSound(stepSound, { volume: sprint ? 0.32 : 0.18 });
    }
  } else {
    footstepTimer = 0.35;
  }
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
  camera.position.sub(shakeOffset);
  shakeOffset.set(0, 0, 0);

  if (gameState === GameState.MENU) return;
  
  if (gameState === GameState.PLAYING && !blackoutTriggered && camera.position.z < -10) {
    blackoutTriggered = true;
    triggerBlackoutSequence();
  }

  // Phase 12 - Hiding Spot Breath Simulation & Noise Level Calculations
  if (gameState === GameState.PLAYING) {
    if (isPlayerHidden) {
      if (breathP1Panel) breathP1Panel.style.display = "flex";
      if (keys.has("Space")) {
        isHoldingBreath = true;
        p1BreathStamina = Math.max(0, p1BreathStamina - delta * 24);
        fear = Math.max(0, fear - delta * 4);
      } else {
        isHoldingBreath = false;
        p1BreathStamina = Math.min(100, p1BreathStamina + delta * 18);
        if (scene.userData.meeraCharacter && !godModeActive) {
          const distToMeera = camera.position.distanceTo(scene.userData.meeraCharacter.position);
          if (distToMeera < 8.0) {
            fear = Math.min(100, fear + delta * 8.5);
          }
        }
      }
      
      if (p1BreathStamina <= 0) {
        isHoldingBreath = false;
        activeNoiseEventZ = camera.position.z;
        noiseInvestigateTimer = 6.0;
        caption.textContent = "Aarav gasped for air! The ghost heard you!";
        addTaskLog("Gasp for air gave away hiding spot!");
        p1BreathStamina = 20;
        if (audioManager) audioManager.playSound("jumpscare_stinger", { volume: 0.5 });
      }
    } else {
      if (breathP1Panel) breathP1Panel.style.display = "none";
      isHoldingBreath = false;
      p1BreathStamina = 100;
    }
    if (breathP1Text) breathP1Text.textContent = `${Math.round(p1BreathStamina)}%`;
    if (breathP1Meter) breathP1Meter.value = p1BreathStamina;

    if (coopMode && camera2) {
      if (isPlayer2Hidden) {
        if (breathP2Panel) breathP2Panel.style.display = "flex";
        if (player2Keys.has("Period")) {
          isHoldingBreath2 = true;
          p2BreathStamina = Math.max(0, p2BreathStamina - delta * 24);
          fear2 = Math.max(0, fear2 - delta * 4);
        } else {
          isHoldingBreath2 = false;
          p2BreathStamina = Math.min(100, p2BreathStamina + delta * 18);
          if (scene.userData.meeraCharacter && !godModeActive) {
            const distToMeera2 = camera2.position.distanceTo(scene.userData.meeraCharacter.position);
            if (distToMeera2 < 8.0) {
              fear2 = Math.min(100, fear2 + delta * 8.5);
            }
          }
        }
        
        if (p2BreathStamina <= 0) {
          isHoldingBreath2 = false;
          activeNoiseEventZ = camera2.position.z;
          noiseInvestigateTimer = 6.0;
          caption.textContent = "Rohan gasped for air! The ghost heard you!";
          addTaskLog("Player 2 gasped for air!");
          p2BreathStamina = 20;
          if (audioManager) audioManager.playSound("jumpscare_stinger", { volume: 0.5 });
        }
      } else {
        if (breathP2Panel) breathP2Panel.style.display = "none";
        isHoldingBreath2 = false;
        p2BreathStamina = 100;
      }
      if (breathP2Text) breathP2Text.textContent = `${Math.round(p2BreathStamina)}%`;
      if (breathP2Meter) breathP2Meter.value = p2BreathStamina;
    }

    let p1Noise = 6;
    if (isPlayerHidden) {
      p1Noise = isHoldingBreath ? 2 : 12;
    } else {
      const isP1Moving = Number(keys.has("KeyW")) - Number(keys.has("KeyS")) !== 0 || Number(keys.has("KeyD")) - Number(keys.has("KeyA")) !== 0;
      const isP1Sprinting = keys.has("ShiftLeft") && isP1Moving && stamina > 0 && !sprintExhausted;
      p1Noise = isP1Sprinting ? 85 : (isP1Moving ? 35 : 6);
    }
    if (noiseP1Text) noiseP1Text.textContent = `${Math.round(p1Noise)}%`;
    if (noiseP1Meter) noiseP1Meter.value = p1Noise;

    if (coopMode) {
      let p2Noise = 6;
      if (isPlayer2Hidden) {
        p2Noise = isHoldingBreath2 ? 2 : 12;
      } else {
        const isP2Moving = Number(player2Keys.has("ArrowUp")) - Number(player2Keys.has("ArrowDown")) !== 0 || Number(player2Keys.has("ArrowLeft")) - Number(player2Keys.has("ArrowRight")) !== 0;
        const isP2Sprinting = player2Keys.has("ShiftRight") && isP2Moving && stamina2 > 0 && !sprintExhausted2;
        p2Noise = isP2Sprinting ? 85 : (isP2Moving ? 35 : 6);
      }
      if (noiseP2Text) noiseP2Text.textContent = `${Math.round(p2Noise)}%`;
      if (noiseP2Meter) noiseP2Meter.value = p2Noise;
    }
  }

  if (flashlightOn && !infiniteBatteryActive) battery = Math.max(0, battery - delta * 1.15);
  if (battery <= 0 && flashlightOn) setFlashlight(false);
  
  if (godModeActive) {
    fear = 0;
  } else {
    const depthFear = THREE.MathUtils.clamp((-camera.position.z - 6) * 1.7, 0, 58);
    const darknessFear = flashlightOn ? 0 : 24;
    fear = THREE.MathUtils.lerp(fear, depthFear + darknessFear + inspected * 5, delta * 0.9);
    if (fear >= 100 && gameState === GameState.PLAYING) {
      triggerGameOver("Aarav's heart could not take the terror. The dark claimed him.");
    }
  }

  // Player 2 Flashlight, Battery, and Fear updates
  if (coopMode && camera2 && player2Flashlight) {
    if (flashlightOn2 && !infiniteBatteryActive) battery2 = Math.max(0, battery2 - delta * 1.15);
    if (battery2 <= 0 && flashlightOn2) setFlashlight2(false);

    if (godModeActive) {
      fear2 = 0;
    } else {
      const depthFear2 = THREE.MathUtils.clamp((-camera2.position.z - 6) * 1.7, 0, 58);
      const darknessFear2 = flashlightOn2 ? 0 : 24;
      fear2 = THREE.MathUtils.lerp(fear2, depthFear2 + darknessFear2 + inspected * 5, delta * 0.9);
      if (fear2 >= 100 && gameState === GameState.PLAYING) {
        triggerGameOver("Rohan's heart could not take the terror. The dark claimed him.");
      }
    }

    if (flashlightOn2 && player2Flashlight.parent !== camera2) {
      camera2.add(player2Flashlight);
      camera2.add(player2Flashlight.target);
    }
    if (!flashlightOn2 && player2Flashlight.parent === camera2) {
      camera2.remove(player2Flashlight);
      camera2.remove(player2Flashlight.target);
    }
    let targetIntensity2 = 3.4 * (battery2 / 100 + 0.1);
    if (flashlightOn2) {
      if (battery2 < 35 && battery2 > 0) {
        const lowFlicker2 = Math.sin(clock.elapsedTime * 22) > 0.3 ? 1.0 : (Math.random() > 0.45 ? 0.18 : 0.02);
        targetIntensity2 *= lowFlicker2;
      }
      player2Flashlight.intensity = targetIntensity2;
    } else {
      player2Flashlight.intensity = 0;
    }

    if (batteryText2) batteryText2.textContent = `${Math.round(battery2)}%`;
    if (batteryMeter2) batteryMeter2.value = battery2;
    if (fearText2) fearText2.textContent = `${Math.round(fear2)}%`;
    if (fearMeter2) fearMeter2.value = fear2;
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
  
  const activeFear = coopMode ? Math.max(fear, fear2) : fear;
  if (activeFear > statFearPeak) statFearPeak = activeFear;
  vignette.style.opacity = String(0.35 + activeFear / 145);

  // Drive post-processing shader uniforms from fear level
  if (filmPass) {
    filmPass.uniforms.vignetteAmount.value = 0.55 + activeFear * 0.004;
    filmPass.uniforms.aberrationAmount.value = 0.0018 + activeFear * 0.000055;
    filmPass.uniforms.grainAmount.value = 0.09 + activeFear * 0.0008;
  }

  const ghost = scene.userData.ghost;
  ghost.lookAt(camera.position);
  ghost.material.opacity = Math.max(0, Math.sin(clock.elapsedTime * 1.7) * 0.16 + (fear - 42) / 210);
  scene.userData.kulkarni?.lookAt(camera.position.x, 1.2, camera.position.z);
  if (scene.userData.meeraCharacter) {
    const meera = scene.userData.meeraCharacter;
    
    // Choose nearest player target, checking if they are hidden
    let targetCamera = null;
    let targetDist = Infinity;
    let targetFear = 0;
    let targetIsP2 = false;

    if (!isPlayerHidden) {
      targetCamera = camera;
      targetDist = meera.position.distanceTo(camera.position);
      targetFear = fear;
    }

    if (coopMode && camera2 && !isPlayer2Hidden) {
      const distToP2 = meera.position.distanceTo(camera2.position);
      if (distToP2 < targetDist) {
        targetCamera = camera2;
        targetDist = distToP2;
        targetFear = fear2;
        targetIsP2 = true;
      }
    }
    
    if (meeraState === AiState.INACTIVE) {
      if (currentLevel === 1) {
        if (camera.position.z < -16 || fear > 28 || (coopMode && (camera2.position.z < -16 || fear2 > 28))) {
          meeraState = AiState.PATROL;
          meera.position.set(0, 0, -35);
          meera.visible = true;
        } else {
          meera.visible = false;
        }
      } else {
        if (generatorActive) {
          meeraState = AiState.CHASE;
          meera.position.set(0, 0, -32);
          meera.visible = true;
        } else {
          meera.visible = false;
        }
      }
    }
    
    if (meeraState !== AiState.INACTIVE) {
      if (lockerAlertState && lockerTargetToInspect) {
        meeraSpeed = 1.65 * meeraSpeedMultiplier;
        meera.lookAt(lockerTargetToInspect.position.x, meera.position.y, lockerTargetToInspect.position.z);
        const toLocker = new THREE.Vector3().subVectors(lockerTargetToInspect.position, meera.position);
        toLocker.y = 0;
        const distToLocker = toLocker.length();
        toLocker.normalize();
        meera.position.addScaledVector(toLocker, meeraSpeed * delta);
        
        if (distToLocker < 1.45 && gameState === GameState.PLAYING && !godModeActive) {
          lockerAlertState = false;
          lockerTargetToInspect = null;
          if (audioManager) audioManager.playSound("jumpscare_stinger", { volume: 1.0 });
          triggerGameOver(coopMode ? "A player was caught by Meera inside the locker." : "Meera ripped open the locker door. Hiding could not save Aarav.");
        }
      } else {
        // Revert to patrol if all players hide during a chase
        if (!targetCamera && meeraState === AiState.CHASE) {
          meeraState = AiState.PATROL;
          addTaskLog("Threat lost visual track of targets.");
        }

        if (targetCamera) {
          meera.lookAt(targetCamera.position.x, meera.position.y, targetCamera.position.z);
        }
        
        const targetFlashlightOn = targetCamera ? (targetIsP2 ? flashlightOn2 : flashlightOn) : false;
        const targetWantsSprint = targetCamera ? (targetIsP2 ? player2Keys.has("ShiftRight") : keys.has("ShiftLeft")) : false;
        const targetSprintExhausted = targetCamera ? (targetIsP2 ? sprintExhausted2 : sprintExhausted) : false;
        const playerDetected = targetCamera && ((targetFlashlightOn && targetDist < 15) || (targetDist < 7) || (targetSprintExhausted === false && targetWantsSprint && targetDist < 11));
        
        if (playerDetected && meeraState === AiState.PATROL) {
          meeraState = AiState.CHASE;
          playJumpscareStinger();
          addTaskLog("Warning: Threat is pursuing you!");
        }
        
        if (meeraState === AiState.PATROL) {
          meeraSpeed = 1.2 * meeraSpeedMultiplier;
          if (activeNoiseEventZ !== null) {
            const investigateDir = Math.sign(activeNoiseEventZ - meera.position.z);
            meera.position.z += investigateDir * meeraSpeed * delta;
            meera.lookAt(0, meera.position.y, activeNoiseEventZ);
            
            noiseInvestigateTimer -= delta;
            if (noiseInvestigateTimer <= 0 || Math.abs(meera.position.z - activeNoiseEventZ) < 0.5) {
              activeNoiseEventZ = null;
            }
          } else {
            meera.position.z += meeraPatrolDir * meeraSpeed * delta;
            const zMin = currentLevel === 1 ? -45 : -35;
            const zMax = currentLevel === 1 ? -16 : 8;
            if (meera.position.z < zMin) {
              meeraPatrolDir = 1;
            } else if (meera.position.z > zMax) {
              meeraPatrolDir = -1;
            }
          }
          meera.position.x = THREE.MathUtils.lerp(meera.position.x, 0, delta * 3);
        } else if (meeraState === AiState.CHASE && targetCamera) {
          meeraSpeed = ((currentLevel === 2 ? 1.48 : 1.6) + (targetFear / 160)) * meeraSpeedMultiplier;
          const toPlayer = new THREE.Vector3().subVectors(targetCamera.position, meera.position);
          toPlayer.y = 0;
          toPlayer.normalize();
          meera.position.addScaledVector(toPlayer, meeraSpeed * delta);
          
          if (targetIsP2) {
            if (!godModeActive) fear2 = Math.min(100, fear2 + delta * 3.6);
          } else {
            if (!godModeActive) fear = Math.min(100, fear + delta * 3.6);
          }
          
          if (targetDist > 18 && currentLevel === 1) {
            meeraState = AiState.PATROL;
            addTaskLog("Lost the ghost threat.");
          }
        }
        
        doors.forEach((door) => {
          if (!door.userData.open) {
            const dx = meera.position.x - door.position.x;
            const dz = meera.position.z - door.position.z;
            const dist2D = Math.sqrt(dx * dx + dz * dz);
            if (dist2D < 1.6) {
              door.userData.open = true;
              door.userData.locked = false;
              playDoorCreak(door, true);
              caption.textContent = "A door creaks open behind the ghost's cold wind...";
              addTaskLog(`Ghost opened closed door: ${door.userData.label}.`);
            }
          }
        });
        
        if (targetCamera && targetDist < 4.5 && meeraState === AiState.CHASE) {
          if (targetIsP2) {
            if (!godModeActive) fear2 = Math.min(100, fear2 + delta * 24);
          } else {
            if (!godModeActive) fear = Math.min(100, fear + delta * 24);
          }
          shakeOffset.x = (Math.random() - 0.5) * 0.045;
          shakeOffset.y = (Math.random() - 0.5) * 0.045;
        }
        
        if (targetCamera && targetDist < 1.15 && gameState === GameState.PLAYING && !godModeActive) {
          triggerGameOver(targetIsP2 ? "Rohan was caught by Meera's presence." : "Aarav was caught by Meera's presence.");
        }
      }
    }
  }
  scene.userData.dust.rotation.y += delta * 0.018;

  // Distance-gate LOD: hide dorm room geometry when player is far away
  if (scene.userData.dormGroup) {
    scene.userData.dormGroup.visible = camera.position.z < -22;
  }

  // Task 62: Meera's first ghost whisper — one-time, triggers on first approach to dorm wing
  if (!meeraFirstWhisperPlayed && inspected === 0 && camera.position.z < -24.5 && gameState === GameState.PLAYING) {
    meeraFirstWhisperPlayed = true;
    playWhisper();
    window.setTimeout(() => {
      sayLine("Meera", "You look just like the ones who used to watch.", 7000);
    }, 800);
    caption.textContent = "Something cold passes through the air near Room 29.";
    addTaskLog("Heard something near Room 29.");
  }

  // Task 64: Meera's second ghost event — countdown sound + shadow flicker near Room 29
  if (!meeraSecondEventPlayed && inspected >= 1 && camera.position.z < -16 && gameState === GameState.PLAYING) {
    meeraSecondEventPlayed = true;
    activeCountdownFlicker = true;
    playWhisper();
    if (audioManager) {
      audioManager.playSound("blackout_cue", { volume: 0.5 });
    }
    window.setTimeout(() => {
      queueStory([
        ["Meera", "Three..."],
        ["Meera", "Two..."],
        ["Meera", "One..."],
        ["Meera", "Ready or not."]
      ]);
    }, 600);
    window.setTimeout(() => {
      activeCountdownFlicker = false;
    }, 11000);
    caption.textContent = "The overhead light buzzes violently. A shadow stretches from Room 29...";
    addTaskLog("Experienced an electrical anomaly near Room 29.");
  }

  // Task 71: Meera's final ghost event — full apparition walk across corridor at z=-30 when evidence=3
  if (!meeraFinalEventPlayed && inspected === 3 && camera.position.z < -24.0 && gameState === GameState.PLAYING) {
    meeraFinalEventPlayed = true;
    activeApparitionWalk = true;
    apparitionGhost = createCharacter({ name: "MeeraApparition", position: [-3.2, 0, -31.5], color: 0x9ed2c2, ghostly: true });
    scene.add(apparitionGhost);
    apparitionGhost.rotation.y = Math.PI / 2; // looking right
    playWhisper();
    if (audioManager) {
      audioManager.playSound("blackout_cue", { volume: 0.4 });
    }
    queueStory([
      ["Aarav", "Meera... I can see you. You're trying to show me the way down..."]
    ]);
    caption.textContent = "A cold, pale figure drifts slowly across the hallway ahead...";
    addTaskLog("Witnessed a non-hostile apparition near the basement gate.");
  }

  if (activeApparitionWalk && apparitionGhost) {
    apparitionGhost.position.x += delta * 0.72;
    apparitionGhost.position.y = Math.sin(clock.elapsedTime * 3) * 0.04;
    if (apparitionGhost.position.x > 3.2) {
      activeApparitionWalk = false;
      apparitionFadeTimer = 0;
    }
  } else if (apparitionGhost) {
    apparitionFadeTimer += delta;
    apparitionGhost.children.forEach(c => {
      if (c.material) {
        c.material.transparent = true;
        c.material.opacity = Math.max(0, 0.42 * (1.0 - apparitionFadeTimer / 2.0));
      }
    });
    if (apparitionFadeTimer >= 2.0) {
      scene.remove(apparitionGhost);
      apparitionGhost = null;
    }
  }

  flickerLights.forEach(({ light, base, phase }) => {
    if (isBlackoutActive) {
      light.intensity = THREE.MathUtils.lerp(light.intensity, 0, delta * 12);
    } else if (activeCountdownFlicker && Math.abs(light.position.z - (-26)) < 1.0) {
      // Override: violent flickering for lamp at z = -26
      light.intensity = Math.random() > 0.45 ? base * 1.85 : 0.05;
    } else {
      const pulse = Math.sin(clock.elapsedTime * 7.5 + phase) > 0.92 ? 0.26 : 1;
      light.intensity = THREE.MathUtils.lerp(light.intensity, base * pulse, delta * 8);
    }
  });

  doors.forEach((door) => {
    const target = door.userData.open ? (door.userData.side === "left" ? -1.18 : 1.18) : 0;
    door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, target, delta * 6);
  });

  if (currentLevel === 2 && samCharacter && samFlashlight) {
    const distToSam = samCharacter.position.distanceTo(camera.position);
    if (distToSam > 2.8) {
      const toPlayer = new THREE.Vector3().subVectors(camera.position, samCharacter.position);
      toPlayer.y = 0;
      toPlayer.normalize();
      samCharacter.position.addScaledVector(toPlayer, 1.48 * delta);
      samCharacter.lookAt(camera.position.x, samCharacter.position.y, camera.position.z);
    }
    samFlashlight.position.copy(samCharacter.position).add(new THREE.Vector3(0, 1.3, 0));
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(samCharacter.quaternion);
    samFlashlight.target.position.copy(samFlashlight.position).add(dir);
  }

  updateInteractionPrompt();
  camera.position.add(shakeOffset);
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
  if (!document.body.classList.contains("started")) return;

  // Player 1 Prompt
  const hit = getFocusedInteractable();
  if (!hit) {
    interactionPrompt.hidden = true;
    if (reticleP1) reticleP1.classList.remove("active");
  } else {
    if (reticleP1) reticleP1.classList.add("active");
    interactionPrompt.hidden = false;
    const type = hit.object.userData.interactionType;
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

  // Player 2 Prompt
  if (coopMode && camera2) {
    const hit2 = getFocusedInteractable2();
    if (!hit2) {
      if (interactionPromptP2) interactionPromptP2.hidden = true;
      if (reticleP2) reticleP2.classList.remove("active");
    } else {
      if (reticleP2) reticleP2.classList.add("active");
      if (interactionPromptP2) {
        interactionPromptP2.hidden = false;
        const type = hit2.object.userData.interactionType;
        if (type === "door") {
          const door = hit2.object.userData.parentDoor;
          const label = door ? door.userData.label : "door";
          const isOpen = door ? door.userData.open : false;
          interactionPromptP2.textContent = `[ShiftRight] ${isOpen ? "Close" : "Open"} ${label}`;
        } else if (type === "basement_gate") {
          if (inspected >= 3) {
            interactionPromptP2.textContent = "[ShiftRight] Open Basement Gate";
          } else {
            interactionPromptP2.textContent = "Basement Gate (Locked - 3 Evidence required)";
          }
        } else if (type === "evidence") {
          const label = hit2.object.userData.interactionLabel || "Evidence";
          interactionPromptP2.textContent = `[ShiftRight] Inspect ${label}`;
        } else {
          interactionPromptP2.textContent = `[ShiftRight] ${hit2.object.userData.interactionLabel || "Interact"}`;
        }
      }
    }
  }
}

function sayLine(name, text, duration = 5600) {
  speaker.textContent = name;
  line.textContent = text;
  dialogue.classList.add("open");
  
  if (audioManager) {
    audioManager.duckAmbient(duration, 0.35);
  }
  
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
    ["Aarav", "Three days. That's all I need. Finish the capstone, submit by Friday, go home."],
    ["Aarav", "Block A is the only building still on backup power. I shouldn't be here after midnight."],
    ["Aarav", "Gate control is offline. Why is Block A drawing backup power at 1 a.m.?"],
    ["Professor Kulkarni", "Aarav, listen carefully. Do not enter the basement under any circumstance. Restore the generator and leave immediately."],
    ["Aarav", "That was three calls ago. He stopped picking up."],
    ["Meera", "Forty-two hours. Still awake. Still here. Still counting."]
  ]);
}

function getFocusedInteractable2(maxDistance = 4) {
  if (!camera2) return null;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera2);
  const hits = raycaster.intersectObjects(scene.children, true);
  
  const hit = hits.find(h => h.distance <= maxDistance);
  if (!hit) return null;
  
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

function inspectNearest() {
  if (gameState !== GameState.PLAYING) return;
  const hit = getFocusedInteractable();
  if (!hit) {
    caption.textContent = "Nothing close enough to inspect.";
    return;
  }
  inspectObject(hit, false);
}

function inspectNearest2() {
  if (gameState !== GameState.PLAYING) return;
  const hit = getFocusedInteractable2();
  if (!hit) {
    caption.textContent = "Nothing close enough to inspect.";
    return;
  }
  inspectObject(hit, true);
}

function inspectObject(hit, isPlayer2 = false) {
  const type = hit.object.userData.interactionType;
  const playerName = isPlayer2 ? "Rohan" : "Aarav";

  if (type === "hiding_spot") {
    if (!isPlayer2) {
      if (!isPlayerHidden) {
        isPlayerHidden = true;
        statTimesHidden++;
        player1PreLockerPos = camera.position.clone();
        camera.position.set(hit.object.parent.position.x, 1.7, hit.object.parent.position.z + 0.1);
        caption.textContent = "You are hidden inside the locker. Press [E] to step out.";
        addTaskLog("Entered hiding spot.");
        setFlashlight(false);

        if (scene.userData.meeraCharacter && meeraState === AiState.CHASE) {
          const distToMeera = camera.position.distanceTo(scene.userData.meeraCharacter.position);
          if (distToMeera < 12.0) {
            lockerAlertState = true;
            lockerTargetToInspect = hit.object.parent;
            addTaskLog("Ghost saw you hide inside the locker!");
          }
        }
      } else {
        isPlayerHidden = false;
        camera.position.copy(player1PreLockerPos || new THREE.Vector3(camera.position.x, 1.7, camera.position.z + 0.6));
        caption.textContent = "You stepped out of the locker.";
        addTaskLog("Exited hiding spot.");
      }
    } else {
      if (!isPlayer2Hidden) {
        isPlayer2Hidden = true;
        statTimesHidden++;
        player2PreLockerPos = camera2.position.clone();
        camera2.position.set(hit.object.parent.position.x, 1.7, hit.object.parent.position.z + 0.1);
        caption.textContent = "Player 2 is hidden inside the locker. Press [ShiftRight] to step out.";
        addTaskLog("Player 2 entered hiding spot.");
        setFlashlight2(false);

        if (scene.userData.meeraCharacter && meeraState === AiState.CHASE) {
          const distToMeera2 = camera2.position.distanceTo(scene.userData.meeraCharacter.position);
          if (distToMeera2 < 12.0) {
            lockerAlertState = true;
            lockerTargetToInspect = hit.object.parent;
            addTaskLog("Ghost saw Player 2 hide inside the locker!");
          }
        }
      } else {
        isPlayer2Hidden = false;
        camera2.position.copy(player2PreLockerPos || new THREE.Vector3(camera2.position.x, 1.7, camera2.position.z + 0.6));
        caption.textContent = "Player 2 stepped out of the locker.";
        addTaskLog("Player 2 exited hiding spot.");
      }
    }
    if (audioManager) audioManager.playSound("door_creak", { volume: 0.4 });
    return;
  }

  if (type === "debris_can") {
    const parent = hit.object.userData.parentGroup;
    if (parent) {
      parent.visible = false;
    }
    if (!isPlayer2) {
      p1DebrisCount++;
      caption.textContent = "Picked up a Rusted Can. Press [G] to throw it and create a distraction noise.";
    } else {
      p2DebrisCount++;
      caption.textContent = "Player 2 picked up a Rusted Can. Press [G] to throw it and create a distraction noise.";
    }
    addTaskLog("Picked up debris can.");
    if (audioManager) audioManager.playSound("ui_select", { volume: 0.3 });
    return;
  }

  if (type === "door") {
    const door = hit.object.userData.parentDoor;
    if (door) {
      if (door.userData.locked) {
        if (door.userData.label.includes("Room 32 left") && inspected >= 1) {
          door.userData.locked = false;
          caption.textContent = "You unlock Room 32 using the credentials from Dr. Verma's memo.";
          addTaskLog("Unlocked Room 32 Left Door.");
          sayLine(playerName, "Okay, it's open. Let's see what's in here.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
        } else if (door.userData.label.includes("Room 29 right") && inspected >= 2) {
          door.userData.locked = false;
          caption.textContent = "You unlock Room 29 using the access card from the Watchman's Logbook.";
          addTaskLog("Unlocked Room 29 Right Door.");
          sayLine(playerName, "The right wing dorm is unlocked. I should check the study tables.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
        } else {
          caption.textContent = "The door is locked from the inside. Find more documents first.";
          sayLine(playerName, "Locked tight. I must have missed something down the hall.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
        }
        return;
      }

      door.userData.open = !door.userData.open;
      if (isPlayer2) {
        fear2 = Math.min(100, fear2 + 4);
      } else {
        fear = Math.min(100, fear + 4);
      }
      playDoorCreak(door, door.userData.open);
      caption.textContent = door.userData.open ? "The door groans open." : "The latch clicks shut.";
      addTaskLog(`${door.userData.open ? "Opened" : "Closed"} ${door.userData.label}.`);
      if (door.userData.open && (camera.position.z < -12 || (camera2 && camera2.position.z < -12))) {
        sayLine("Professor Kulkarni", "Some rooms were sealed after 2005. If a door opens by itself, step back.");
      }
      objective.textContent = "Search rooms for lab records, books, and anything Meera left behind.";
    }
    return;
  }

  if (type === "basement_gate") {
    if (inspected >= 3) {
      caption.textContent = "The gate yields — a cold draft rises from the basement stairwell.";
      addTaskLog("Basement gate unlocked. Descending to basement.");
      completeObjective("basement");
      queueStory([
        [playerName, "The chain falls. Three years of evidence — and the lab was right here."],
        [playerName, "I have to file this with the department. Meera deserves that much."],
        [playerName, "Let's get out before she comes back."]
      ]);
      window.setTimeout(() => {
        loadLevel2();
      }, 9800);
    } else {
      caption.textContent = "Chained shut. A rusted plaque reads: 'Applied Cognition Lab - Authorized Entry Only'.";
      sayLine(playerName, "This leads to the old sub-level. A flight of concrete stairs goes down into pitch black... Kulkarni was hiding something down there.");
      addTaskLog("Inspected the basement gate; locked, leads to the sub-level lab.");
    }
    return;
  }

  if (type === "evidence") {
    const doc = hit.object.userData.doc;
    if (!doc) return;
    
    hit.object.visible = false;
    const idx = interactables.indexOf(hit.object);
    if (idx !== -1) {
      interactables.splice(idx, 1);
    }

    collectedDocuments.set(doc.title, doc.body);
    collectedEvidence.add(doc.title);
    readLoreNotes.add(doc.title);
    inspected = collectedEvidence.size;
    caseTitle.textContent = doc.title;
    caseBody.textContent = doc.body;
    caseFile.classList.add("open");
    playWhisper();
    updateObjectivesSystem();
    caption.textContent = "Document added to case file.";
    sayLine(playerName, `This belongs in the case file: ${doc.title}.`);
    addTaskLog(`Recovered evidence: ${doc.title}.`);
    window.setTimeout(() => {
      caseFile.classList.remove("open");
    }, 7200);

    if (inspected === 1 && !kulkarniCallPlayed) {
      kulkarniCallPlayed = true;
      window.setTimeout(() => {
        if (audioManager) {
          audioManager.playSound("phone_ring", { volume: 0.8 });
        }
        caption.textContent = "A static buzzing ring echoes from Aarav's pocket.";
        window.setTimeout(() => {
          queueStory([
            [playerName, "My phone... wait, the network is dead. How is it ringing?"],
            [playerName, "(answers call) Professor? Professor Kulkarni?"],
            ["Professor Kulkarni", "Aarav! Did you... did you find Verma's memo? You need to leave. She knows you're looking."],
            [playerName, "Professor! What happened in 2005? Who is Meera?"],
            ["Professor Kulkarni", "We tried to cure... the counting... (static) ...run, Aarav! (line dead beep)"]
          ]);
        }, 2500);
      }, 7600);
    }
    return;
  }

  if (type === "battery") {
    const parent = hit.object.userData.parentBattery;
    if (parent) {
      if (isPlayer2) {
        battery2 = Math.min(100, battery2 + 45);
      } else {
        battery = Math.min(100, battery + 45);
      }
      parent.visible = false;
      
      const idx = interactables.indexOf(hit.object);
      if (idx !== -1) {
        interactables.splice(idx, 1);
      }
      
      collectedBatteries.add(parent.name);
      
      caption.textContent = "Flashlight battery recharged (+45%).";
      sayLine(playerName, "This battery still has charge. Good.");
      if (audioManager) {
        audioManager.playSound("ui_select", { volume: 0.25 });
      }
      addTaskLog("Picked up spare battery.");
    }
    return;
  }

  if (type === "checkpoint") {
    const parent = hit.object.userData.parentConsole;
    if (parent) {
      activeCheckpoint = {
        position: isPlayer2 ? [parent.position.x + 1.0, 1.7, parent.position.z] : [parent.position.x - 1.0, 1.7, parent.position.z],
        battery: isPlayer2 ? battery2 : battery,
        collectedEvidence: Array.from(collectedEvidence),
        collectedDocuments: Array.from(collectedDocuments.entries()),
        collectedBatteries: Array.from(collectedBatteries),
        readLoreNotes: Array.from(readLoreNotes),
        inspected: inspected,
        blackoutTriggered: blackoutTriggered,
        level: currentLevel
      };
      caption.textContent = "Progress checkpoint saved.";
      sayLine(playerName, "A backup power console. The terminal says security log saved.");
      if (audioManager) {
        audioManager.playSound("ui_select", { volume: 0.25 });
      }
      addTaskLog("Checkpoint reached: System logs saved.");
    }
    return;
  }

  if (type === "lore_note") {
    const text = hit.object.userData.loreText;
    const lbl = hit.object.userData.loreLabel;
    if (!text) return;
    readLoreNotes.add(lbl);
    caption.textContent = `\u201c${text}\u201d`;
    sayLine(playerName, `Found something pinned here: ${lbl}.`);
    addTaskLog(`Read environmental log: ${lbl}.`);

    if (lbl === "Meera's Diary Page" && !meeraDiaryReacted) {
      meeraDiaryReacted = true;
      window.setTimeout(() => {
        queueStory([
          [playerName, "October 2004... that was right before the department shut down the Cognitive studies."],
          [playerName, "Professor Kulkarni was the lead supervisor back then. What did they do to her?"]
        ]);
      }, 5500);
    }
    return;
  }

  if (type === "metronome") {
    caption.textContent = "A sealed mechanical metronome. It ticks steadily without any winding.";
    sayLine(playerName, "Wait, the scrawl on the door frame: 'the metronome doesn't need power.' It's completely sealed...");
    addTaskLog("Inspected the sealed metronome.");
    return;
  }

  if (type === "valve") {
    const valveId = hit.object.userData.valveId;
    if (valvesActivated.has(valveId)) {
      caption.textContent = "This fuel line is already primed.";
      sayLine(playerName, "The valve is turned all the way.");
    } else {
      valvesActivated.add(valveId);
      generatorPressure += 33.3;
      caption.textContent = `${hit.object.userData.interactionLabel} turned. Pressure line priming... (${valvesActivated.size}/3)`;
      sayLine(playerName, "Okay, that's one line open. I hear fuel rushing through the pipes.");
      if (audioManager) {
        audioManager.playSound("door_creak", { volume: 0.5 });
      }
      addTaskLog(`Primed ${hit.object.userData.interactionLabel}.`);
      updateObjectivesSystem();
    }
    return;
  }

  if (type === "generator_lever") {
    if (generatorActive) {
      caption.textContent = "The generator is humming loudly. Backup power is online.";
      sayLine(playerName, "It's running. No need to pull the starter again.");
      return;
    }
    if (valvesActivated.size < 3) {
      caption.textContent = "The lever is locked. The pressure lines are cold. Prime all 3 fuel valves first.";
      sayLine(playerName, "Nothing happens. The fuel lines aren't primed yet.");
      if (audioManager) {
        audioManager.playSound("door_latch", { volume: 0.5 });
      }
    } else {
      generatorActive = true;
      generatorPressure = 100;
      hit.object.rotation.x = 0.52;
      caption.textContent = "The generator starter roars to life! Power grid online.";
      sayLine(playerName, "Yes! The lights... wait, they are turning red.");
      if (audioManager) {
        audioManager.playSound("generator_start", { volume: 0.9 });
      }
      addTaskLog("Activated backup generator. Power restored.");
      updateObjectivesSystem();
      
      blackoutTriggered = true;
      isBlackoutActive = true;
      
      flickerLights.forEach((lightObj, index) => {
        lightObj.base = 0.42;
        lightObj.light.color.setHex(0xb22822);
      });
      
      meeraState = AiState.CHASE;
      meeraSpeed = 1.48;
      if (scene.userData.meeraCharacter) {
        scene.userData.meeraCharacter.position.set(0, 0, -32);
        scene.userData.meeraCharacter.visible = true;
      }
      
      queueStory([
        ["Professor Kulkarni", "Aarav! The main sensor logs are peaking! Powering the backup grid woke the neural array. You must run!"],
        [playerName, "What is that sound? Something's coming up from the sensory chamber!"]
      ]);
    }
    return;
  }

  if (type === "exit_terminal") {
    if (!generatorActive) {
      caption.textContent = "Terminal display is blank. Power grid offline.";
      sayLine(playerName, "No power. I need to get the generator running first.");
    } else {
      document.exitPointerLock?.();
      setGameState(GameState.CHOICE);
      
      const totalLoreNotes = collectedEvidence.size;
      if (totalLoreNotes >= 5) {
        choiceEndingA.disabled = false;
        choiceEndingA.style.background = "#3c2f25";
        choiceEndingA.style.color = "#e5d4bc";
        choiceEndingA.style.border = "1px solid #584435";
        choiceEndingA.style.cursor = "pointer";
        choiceEndingA.textContent = "Protocol A: Public Broadcast (All Lore Collected)";
      } else {
        choiceEndingA.disabled = true;
        choiceEndingA.style.background = "#2a221d";
        choiceEndingA.style.color = "#8e8379";
        choiceEndingA.style.border = "1px dashed #3a322d";
        choiceEndingA.style.cursor = "not-allowed";
        choiceEndingA.textContent = `Protocol A: Public Broadcast (Locked - ${totalLoreNotes}/5 Lore Notes)`;
      }
      
      caption.textContent = "Accessing Main Operations Terminal. Select system protocol.";
      addTaskLog("Accessed exit operations terminal.");
    }
    return;
  }
}

function addConsoleLog(msg) {
  if (!debugOutput) return;
  const div = document.createElement("div");
  div.textContent = msg;
  debugOutput.appendChild(div);
  debugOutput.scrollTop = debugOutput.scrollHeight;
}

function executeCommand(cmdStr) {
  const trimmed = cmdStr.trim();
  addConsoleLog(`> ${trimmed}`);
  
  if (!trimmed.startsWith("/")) {
    addConsoleLog("Error: Commands must start with a slash (/). Type /help for assistance.");
    return;
  }
  
  const tokens = trimmed.slice(1).split(/\s+/);
  const command = tokens[0].toLowerCase();
  const args = tokens.slice(1);
  
  switch (command) {
    case "help":
      addConsoleLog("Available commands:");
      addConsoleLog("  /help - Display this help list");
      addConsoleLog("  /god - Toggle godmode (invincible to fear/catches)");
      addConsoleLog("  /ib - Toggle infinite battery");
      addConsoleLog("  /battery - Recharge battery to 100%");
      addConsoleLog("  /tp <z> - Teleport player to Z coordinates");
      addConsoleLog("  /skip - Teleport straight to exit operations console");
      addConsoleLog("  /ghostspeed <mult> - Multiply ghost movement speed (e.g. /ghostspeed 0.5)");
      addConsoleLog("  /loadlevel <1|2> - Jump to level 1 or level 2");
      break;
      
    case "god":
      godModeActive = !godModeActive;
      addConsoleLog(`Godmode toggled: ${godModeActive ? "ON" : "OFF"}`);
      addTaskLog(`Developer toggled invincibility: ${godModeActive ? "ACTIVE" : "INACTIVE"}.`);
      break;
      
    case "ib":
    case "infinite_battery":
      infiniteBatteryActive = !infiniteBatteryActive;
      battery = 100;
      battery2 = 100;
      addConsoleLog(`Infinite battery toggled: ${infiniteBatteryActive ? "ON" : "OFF"}`);
      break;
      
    case "battery":
      battery = 100;
      battery2 = 100;
      setFlashlight(true);
      if (coopMode) setFlashlight2(true);
      addConsoleLog("Recharged flashlight batteries (+100%).");
      break;
      
    case "tp":
    case "teleport": {
      if (args.length === 0) {
        addConsoleLog("Error: Missing Z coordinate parameter. Example: /tp -30");
        break;
      }
      const zVal = parseFloat(args[0]);
      if (isNaN(zVal)) {
        addConsoleLog(`Error: Invalid coordinate '${args[0]}'`);
        break;
      }
      camera.position.z = zVal;
      if (camera2) camera2.position.z = zVal;
      addConsoleLog(`Teleported player to z = ${zVal}`);
      break;
    }
      
    case "skip":
      if (currentLevel === 1) {
        inspected = 3;
        completeObjective("start");
        completeObjective("evidence");
        completeObjective("basement");
        loadLevel2();
        addConsoleLog("Skipping Level 1... Loading Level 2.");
      }
      window.setTimeout(() => {
        camera.position.set(0, 1.7, -37);
        if (camera2) camera2.position.set(0, 1.7, -37);
        generatorActive = true;
        blackoutTriggered = true;
        isBlackoutActive = true;
        if (scene.userData.meeraCharacter) {
          scene.userData.meeraCharacter.position.set(0, 0, -32);
          scene.userData.meeraCharacter.visible = true;
        }
        meeraState = AiState.CHASE;
        addConsoleLog("Teleported to Exit Terminal. Generator Active.");
      }, 500);
      break;
      
    case "ghostspeed":
    case "gs": {
      if (args.length === 0) {
        addConsoleLog("Error: Missing multiplier value. Example: /ghostspeed 0.5");
        break;
      }
      const mult = parseFloat(args[0]);
      if (isNaN(mult)) {
        addConsoleLog(`Error: Invalid multiplier '${args[0]}'`);
        break;
      }
      meeraSpeedMultiplier = mult;
      addConsoleLog(`Ghost speed multiplier set to ${mult}`);
      break;
    }
      
    case "loadlevel":
    case "lvl": {
      if (args.length === 0) {
        addConsoleLog("Error: Specify level 1 or 2. Example: /loadlevel 2");
        break;
      }
      const lvlNum = parseInt(args[0]);
      if (lvlNum === 1) {
        currentLevel = 1;
        level2Group.visible = false;
        level1Group.visible = true;
        activeLevelGroup = level1Group;
        camera.position.set(0, 1.7, 8);
        if (camera2) camera2.position.set(0.8, 1.7, 8);
        addConsoleLog("Loaded Level 1.");
      } else if (lvlNum === 2) {
        loadLevel2();
        addConsoleLog("Loaded Level 2.");
      } else {
        addConsoleLog("Error: Invalid level number.");
      }
      break;
    }
      
    default:
      addConsoleLog(`Error: Unknown command '/${command}'. Type /help for commands.`);
      break;
  }
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  updateMovement(delta);
  updateState(delta);
  
  if (coopMode) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setScissorTest(true);
    
    // Player 1 Left Viewport
    renderer.setViewport(0, 0, width / 2, height);
    renderer.setScissor(0, 0, width / 2, height);
    renderer.render(scene, camera);
    
    // Player 2 Right Viewport
    renderer.setViewport(width / 2, 0, width / 2, height);
    renderer.setScissor(width / 2, 0, width / 2, height);
    if (camera2) {
      renderer.render(scene, camera2);
    }
  } else {
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    if (filmPass) {
      filmPass.uniforms.time.value = clock.elapsedTime * 60.0;
    }
    composer.render();
  }
}

// ─── Post-processing composer ─────────────────────────────────────────────────
const filmGrainShader = {
  name: "FilmGrainShader",
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    grainAmount: { value: 0.09 },
    vignetteAmount: { value: 0.55 },
    aberrationAmount: { value: 0.0018 },
    scanlineAmount: { value: 0.04 }
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float grainAmount;
    uniform float vignetteAmount;
    uniform float aberrationAmount;
    uniform float scanlineAmount;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453 + time * 0.001);
    }

    void main() {
      vec2 uv = vUv;

      // Chromatic aberration
      float r = texture2D(tDiffuse, uv + vec2( aberrationAmount, 0.0)).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2( aberrationAmount, 0.0)).b;
      vec4 color = vec4(r, g, b, 1.0);

      // Film grain
      float grain = rand(uv + vec2(time * 0.003, 0.0)) * 2.0 - 1.0;
      color.rgb += grain * grainAmount;

      // Scanlines
      float scanline = sin(uv.y * 800.0 + time * 2.0) * 0.5 + 0.5;
      color.rgb -= scanline * scanlineAmount * 0.5;

      // Vignette
      vec2 center = uv - 0.5;
      float dist = dot(center, center);
      float vignette = 1.0 - smoothstep(0.12, 0.72, dist * 2.0 * vignetteAmount);
      color.rgb *= vignette;

      // Slight desaturation for horror tone
      float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(color.rgb, vec3(luma), 0.18);

      gl_FragColor = color;
    }
  `
};

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const filmPass = new ShaderPass(filmGrainShader);
composer.addPass(filmPass);

function setupPlayer2() {
  if (!coopMode) return;
  
  camera2 = new THREE.PerspectiveCamera(camera.fov, (window.innerWidth / 2) / window.innerHeight, 0.1, 100);
  camera2.position.set(0.8, 1.7, 8);
  camera2.rotation.set(0, 0, 0);
  scene.add(camera2);

  camera.layers.enable(0);
  camera.layers.enable(1);
  
  camera2.layers.enable(0);
  camera2.layers.enable(2);

  player2Character = createCharacter({ name: "Rohan", position: [0.8, 0, 8], color: 0x3f5b7a });
  player2Character.layers.set(1);
  player2Character.traverse(child => {
    if (child.isMesh) child.layers.set(1);
  });

  scene.userData.player1Character = createCharacter({ name: "Aarav", position: [0, 0, 8], color: 0x8c5d3f });
  scene.userData.player1Character.layers.set(2);
  scene.userData.player1Character.traverse(child => {
    if (child.isMesh) child.layers.set(2);
  });

  player2Flashlight = new THREE.SpotLight(0xffecc2, 3.4, 18, Math.PI / 6, 0.45, 1.0);
  player2Flashlight.castShadow = true;
  camera2.add(player2Flashlight);
  camera2.add(player2Flashlight.target);
  
  const hudP2 = document.querySelector("#hud-p2");
  if (hudP2) hudP2.style.display = "flex";

  if (reticleP1) {
    reticleP1.style.left = "25%";
  }
  if (interactionPrompt) {
    interactionPrompt.style.left = "25%";
  }
  if (reticleP2) {
    reticleP2.style.display = "block";
    reticleP2.style.left = "75%";
  }
  if (interactionPromptP2) {
    interactionPromptP2.style.left = "75%";
  }
  
  battery2 = 100;
  fear2 = 0;
  stamina2 = 100;
  sprintExhausted2 = false;
  flashlightOn2 = true;
  player2Yaw = 0;
  player2Pitch = 0;
}

function startGame({ lockPointer = true } = {}) {
  initAudio();
  setupPlayer2();
  setupUiSounds();
  runStartTime = Date.now();
  statStaminaDrained = 0;
  statTimesHidden = 0;
  statCansThrown = 0;
  statFearPeak = 0;
  startScreen.classList.add("hidden");
  setGameState(GameState.PLAYING);
  if (lockPointer) requestPointerLock();
  caption.textContent = "WASD move. Mouse or arrow keys look. E inspects. F toggles the flashlight.";
  updateObjectivesSystem();
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
  setupUiSounds();
}

function triggerGameOver(reason) {
  setGameState(GameState.GAMEOVER);
  document.exitPointerLock?.();
  if (gameoverReason) gameoverReason.textContent = reason;
  playTone(55, 2.0, 0.4, "sawtooth");
  if (audioManager) {
    audioManager.fadeAmbientOut(2.2);
  }
  addTaskLog("Fatal: Aarav collapsed due to extreme heart strain.");
}

function triggerWin() {
  setGameState(GameState.WIN);
  document.exitPointerLock?.();
  
  const evidenceCount = collectedEvidence.size;
  const totalTime = Math.round(clock.elapsedTime);
  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;
  
  if (winDetail) {
    winDetail.textContent = `Aarav sealed ${evidenceCount} of 3 evidence files and escaped Block A through the basement gate before dawn.`;
  }
  if (winStats) {
    winStats.textContent = `Escape time: ${mins}m ${secs}s — Fear at exit: ${Math.round(fear)}%`;
  }
  
  playTone(220, 1.8, 0.28, "sine");
  window.setTimeout(() => playTone(277, 1.8, 0.18, "sine"), 420);
  window.setTimeout(() => playTone(330, 2.2, 0.22, "sine"), 840);
  if (audioManager) {
    audioManager.fadeAmbientOut(2.5);
  }
  addTaskLog("Aarav escaped through the basement. Evidence filed.");
}

function triggerEnding(endingId) {
  setGameState(GameState.WIN);
  document.exitPointerLock?.();
  
  if (audioManager) {
    audioManager.fadeAmbientOut(3.0);
  }

  const kicker = document.querySelector("#win-screen .kicker");
  const title = document.querySelector("#win-screen h2");
  
  if (endingId === "A") {
    if (kicker) kicker.textContent = "Ending A: Whistleblower";
    if (title) title.textContent = "The Truth Released";
    if (winDetail) {
      winDetail.innerHTML = `Aarav initiated a public broadcast of the 2004 sensory isolation data, exposing Ravenswood's illegal cognitive experiments. <strong>Meera's story is finally known.</strong> The facility was permanently closed following a federal probe.`;
    }
    playTone(220, 2.0, 0.3, "sine");
    window.setTimeout(() => playTone(330, 2.0, 0.3, "sine"), 300);
    window.setTimeout(() => playTone(440, 2.5, 0.4, "sine"), 600);
    addTaskLog("Ending A achieved: Truth Broadcasted.");
  } else if (endingId === "B") {
    if (kicker) kicker.textContent = "Ending B: Compliance";
    if (title) title.textContent = "The Files Sealed";
    if (winDetail) {
      winDetail.innerHTML = `Aarav securely transferred all data directly to Professor Kulkarni. Within hours, the server was wiped and the basement staircase was walled over with fresh concrete. <strong>Aarav received his degree, and the silence remains.</strong>`;
    }
    playTone(180, 1.8, 0.4, "triangle");
    window.setTimeout(() => playTone(150, 2.2, 0.5, "triangle"), 400);
    addTaskLog("Ending B achieved: Files delivered to Kulkarni.");
  } else if (endingId === "C") {
    if (kicker) kicker.textContent = "Ending C: Trapped in the Loop";
    if (title) title.textContent = "Lost in the Hum";
    if (winDetail) {
      winDetail.innerHTML = `Aarav manually cut all power grids and stayed in the dark with Meera, matching the metronome's ticking. <strong>No one ever found him, but the backup grid still hums at 12Hz...</strong>`;
    }
    playTone(55, 3.0, 0.8, "sawtooth");
    addTaskLog("Ending C achieved: Stayed in the dark.");
  } else if (endingId === "D") {
    if (kicker) kicker.textContent = "Ending D: Escape";
    if (title) title.textContent = "Survival";
    if (winDetail) {
      winDetail.innerHTML = `Aarav triggered the emergency release hatch and escaped into the cold morning air, leaving the data behind. <strong>He survived, but the weight of what he left behind will follow him forever.</strong>`;
    }
    playTone(220, 1.8, 0.28, "sine");
    window.setTimeout(() => playTone(277, 1.8, 0.18, "sine"), 420);
    window.setTimeout(() => playTone(330, 2.2, 0.22, "sine"), 840);
    addTaskLog("Ending D achieved: Emergency escape.");
  }
  
  const speedrunDuration = Math.round((Date.now() - runStartTime) / 1000);
  const docsCollected = collectedEvidence.size;

  let bestTime = parseInt(localStorage.getItem("ms_best_time") || "9999");
  let bestDocs = parseInt(localStorage.getItem("ms_best_docs") || "0");

  if (speedrunDuration < bestTime) {
    bestTime = speedrunDuration;
    localStorage.setItem("ms_best_time", String(bestTime));
  }
  if (docsCollected > bestDocs) {
    bestDocs = docsCollected;
    localStorage.setItem("ms_best_docs", String(bestDocs));
  }

  if (winStats) {
    winStats.innerHTML = `
<div style="text-align: left; background: rgba(14, 11, 9, 0.95); padding: 16px; border: 1px solid #584435; border-radius: 6px; display: flex; flex-direction: column; gap: 8px; font-family: monospace; color: #d8c39f; font-size: 0.82rem; width: 100%; box-sizing: border-box; margin-top: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.8);">
  <div style="color: #ffc87a; font-weight: bold; font-size: 0.9rem; text-align: center; border-bottom: 1px solid #584435; padding-bottom: 6px; margin-bottom: 6px;">RUN SCOREBOARD</div>
  <div style="display: flex; justify-content: space-between;"><span>ESCAPE TIME:</span><span style="color: #73d08a;">${speedrunDuration}s</span></div>
  <div style="display: flex; justify-content: space-between;"><span>LORE COLLECTED:</span><span style="color: #73d08a;">${docsCollected}/5</span></div>
  <div style="display: flex; justify-content: space-between;"><span>TIMES HID IN CABINETS:</span><span style="color: #73d08a;">${statTimesHidden}</span></div>
  <div style="display: flex; justify-content: space-between;"><span>DISTRACTIONS THROWN:</span><span style="color: #73d08a;">${statCansThrown}</span></div>
  <div style="display: flex; justify-content: space-between;"><span>MAX PEAK FEAR:</span><span style="color: #73d08a;">${Math.round(statFearPeak)}%</span></div>
  <div style="display: flex; justify-content: space-between;"><span>STAMINA EXHAUSTED:</span><span style="color: #73d08a;">${Math.round(statStaminaDrained)} units</span></div>
  <div style="border-top: 1px dashed rgba(88, 68, 53, 0.4); margin: 6px 0;"></div>
  <div style="color: #73d08a; font-weight: bold; text-align: center;">ALL-TIME BESTS</div>
  <div style="display: flex; justify-content: space-between;"><span>FASTEST ESCAPE:</span><span style="color: #ffc87a;">${bestTime}s</span></div>
  <div style="display: flex; justify-content: space-between;"><span>MAX COLLECTED LORE:</span><span style="color: #ffc87a;">${bestDocs}/5</span></div>
</div>
    `;
  }
}

function resetGame() {
  if (camera2) {
    scene.remove(camera2);
    camera2 = null;
  }
  if (player2Character) {
    scene.remove(player2Character);
    player2Character = null;
  }
  if (scene.userData.player1Character) {
    scene.remove(scene.userData.player1Character);
    scene.userData.player1Character = null;
  }
  player2Keys.clear();
  const hudP2 = document.querySelector("#hud-p2");
  if (hudP2) hudP2.style.display = "none";

  if (reticleP1) {
    reticleP1.style.left = "50%";
  }
  if (interactionPrompt) {
    interactionPrompt.style.left = "50%";
  }
  if (reticleP2) {
    reticleP2.style.display = "none";
  }
  if (interactionPromptP2) {
    interactionPromptP2.style.display = "none";
  }

  if (activeCheckpoint) {
    fear = 0;
    battery = activeCheckpoint.battery;
    stamina = 100;
    sprintExhausted = false;
    blackoutTriggered = activeCheckpoint.blackoutTriggered;
    isBlackoutActive = false;
    setFlashlight(battery > 0);
    inspected = activeCheckpoint.inspected;
    
    collectedEvidence.clear();
    activeCheckpoint.collectedEvidence.forEach(e => collectedEvidence.add(e));
    
    collectedDocuments.clear();
    activeCheckpoint.collectedDocuments.forEach(([k, v]) => collectedDocuments.set(k, v));
    
    collectedBatteries.clear();
    if (activeCheckpoint.collectedBatteries) {
      activeCheckpoint.collectedBatteries.forEach(b => collectedBatteries.add(b));
    }
    
    readLoreNotes.clear();
    if (activeCheckpoint.readLoreNotes) {
      activeCheckpoint.readLoreNotes.forEach(n => readLoreNotes.add(n));
    }
    
    currentLevel = activeCheckpoint.level || 1;
    activeLevelGroup = currentLevel === 1 ? level1Group : level2Group;
    level1Group.visible = currentLevel === 1;
    level2Group.visible = currentLevel === 2;
    
    colliders.length = 0;
    interactables.length = 0;
    doors.length = 0;
    evidenceItems.length = 0;
    batteryItems.length = 0;
    flickerLights.length = 0;
    valvesActivated.clear();
    generatorActive = false;
    generatorPressure = 0;
    
    clearGroup(level1Group);
    clearGroup(level2Group);
    
    if (currentLevel === 1) {
      buildCorridor();
    } else {
      buildLevel2();
    }
    
    camera.position.set(...activeCheckpoint.position);
    camera.rotation.set(0, 0, 0);
    yaw = 0;
    pitch = 0;
  } else {
    fear = 0;
    battery = 100;
    stamina = 100;
    sprintExhausted = false;
    blackoutTriggered = false;
    isBlackoutActive = false;
    setFlashlight(true);
    inspected = 0;
    collectedEvidence.clear();
    collectedDocuments.clear();
    collectedBatteries.clear();
    readLoreNotes.clear();
    
    currentLevel = 1;
    activeLevelGroup = level1Group;
    level1Group.visible = true;
    level2Group.visible = false;
    
    colliders.length = 0;
    interactables.length = 0;
    doors.length = 0;
    evidenceItems.length = 0;
    batteryItems.length = 0;
    flickerLights.length = 0;
    valvesActivated.clear();
    generatorActive = false;
    generatorPressure = 0;
    
    clearGroup(level1Group);
    clearGroup(level2Group);
    buildCorridor();
    
    camera.position.set(0, 1.7, 8);
    camera.rotation.set(0, 0, 0);
    yaw = 0;
    pitch = 0;
  }
  
  const kicker = document.querySelector("#win-screen .kicker");
  const title = document.querySelector("#win-screen h2");
  if (kicker) kicker.textContent = "Case Closed";
  if (title) title.textContent = "You Escaped";
  
  if (choiceScreen) choiceScreen.classList.remove("open");
  if (inventoryPanel) inventoryPanel.classList.remove("open");
  if (settingsPanel) settingsPanel.classList.remove("open");
  if (gameoverScreen) gameoverScreen.classList.remove("open");
  
  document.querySelectorAll(".notebook-steps span").forEach(el => {
    el.classList.remove("done");
  });

  flickerLights.forEach((lightObj, index) => {
    if (blackoutTriggered) {
      lightObj.base = 0.25;
      lightObj.light.color.setHex(index % 2 === 0 ? 0xb22822 : 0x228b22);
    } else {
      lightObj.base = 1.1;
      lightObj.light.color.setHex(0xffc987);
    }
  });

  doors.forEach((door) => {
    door.userData.open = false;
    door.rotation.y = 0;
    door.userData.locked = door.userData.label.includes("Room 32 left") || door.userData.label.includes("Room 29 right");
    
    // Auto-unlock if checkpoints say we should
    if (door.userData.label.includes("Room 32 left") && inspected >= 1) {
      door.userData.locked = false;
    }
    if (door.userData.label.includes("Room 29 right") && inspected >= 2) {
      door.userData.locked = false;
    }
  });

  evidenceItems.forEach((mesh) => {
    const isCollected = collectedEvidence.has(mesh.name);
    mesh.visible = !isCollected;
    if (isCollected) {
      const idx = interactables.indexOf(mesh);
      if (idx !== -1) interactables.splice(idx, 1);
    } else {
      if (!interactables.includes(mesh)) interactables.push(mesh);
    }
  });

  batteryItems.forEach((group) => {
    const isCollected = collectedBatteries.has(group.name);
    group.visible = !isCollected;
    const body = group.children[0];
    body.visible = !isCollected;
    
    if (isCollected) {
      const idx = interactables.indexOf(body);
      if (idx !== -1) {
        interactables.splice(idx, 1);
      }
    } else {
      if (!interactables.includes(body)) {
        interactables.push(body);
      }
    }
  });

  meeraState = AiState.INACTIVE;
  meeraPatrolDir = -1;
  if (scene.userData.meeraCharacter) {
    scene.userData.meeraCharacter.position.set(2.6, 0, -34.5);
    scene.userData.meeraCharacter.visible = false;
  }

  if (apparitionGhost) {
    scene.remove(apparitionGhost);
    apparitionGhost = null;
  }
  activeApparitionWalk = false;

  // Reset per-session flags
  if (!activeCheckpoint) {
    introPlayed = false;
    meeraFirstWhisperPlayed = false;
    kulkarniCallPlayed = false;
    meeraSecondEventPlayed = false;
    activeCountdownFlicker = false;
    meeraDiaryReacted = false;
    meeraFinalEventPlayed = false;
  }
  
  updateObjectivesSystem();
  if (audioManager) {
    audioManager.updateCategoryVolumes();
  }
  addTaskLog(activeCheckpoint ? "System status restored to last terminal checkpoint." : "System status restored. Re-entering Block A.");
}

buildCorridor();
addAtmosphere();
if (new URLSearchParams(window.location.search).has("vr")) {
  setupVrEntry();
}
renderer.setAnimationLoop(animate);

startButton.addEventListener("click", () => {
  coopMode = false;
  startGame();
});
coopButton.addEventListener("click", () => {
  coopMode = true;
  startGame();
});
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
  if (!pointerLocked || gameState !== GameState.PLAYING || debugConsoleOpen) return;
  yaw -= event.movementX * 0.0022 * mouseSensitivity;
  pitch -= event.movementY * 0.002 * mouseSensitivity;
  pitch = THREE.MathUtils.clamp(pitch, -1.1, 1.1);
  camera.rotation.set(pitch, yaw, 0, "YXZ");
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Backquote") {
    event.preventDefault();
    if (debugConsoleOpen) {
      debugConsole.style.display = "none";
      debugConsoleOpen = false;
      requestPointerLock();
    } else {
      debugConsole.style.display = "flex";
      debugConsoleOpen = true;
      document.exitPointerLock?.();
      window.setTimeout(() => debugInput.focus(), 80);
    }
    return;
  }

  if (debugConsoleOpen) {
    if (event.code === "Enter") {
      event.preventDefault();
      executeCommand(debugInput.value);
      debugInput.value = "";
    }
    return;
  }

  if (event.code === "KeyG") {
    if (gameState === GameState.PLAYING && !debugConsoleOpen) {
      event.preventDefault();
      if (p1DebrisCount > 0) {
        p1DebrisCount--;
        statCansThrown++;
        const throwDist = 12.0;
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const landZ = THREE.MathUtils.clamp(camera.position.z + dir.z * throwDist, -47.8, 8);
        activeNoiseEventZ = landZ;
        noiseInvestigateTimer = 5.0;
        if (audioManager) audioManager.playSound("debris_impact", { volume: 0.85 });
        caption.textContent = "Aarav threw a Rusted Can. A loud clang echoes.";
        addTaskLog("Player 1 threw rusted can.");
      } else {
        caption.textContent = "You have no cans to throw.";
      }
    }
  }

  if (event.code === "KeyH" && coopMode) {
    if (gameState === GameState.PLAYING && !debugConsoleOpen) {
      event.preventDefault();
      if (p2DebrisCount > 0) {
        p2DebrisCount--;
        statCansThrown++;
        const throwDist = 12.0;
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera2.quaternion);
        const landZ = THREE.MathUtils.clamp(camera2.position.z + dir.z * throwDist, -47.8, 8);
        activeNoiseEventZ = landZ;
        noiseInvestigateTimer = 5.0;
        if (audioManager) audioManager.playSound("debris_impact", { volume: 0.85 });
        caption.textContent = "Rohan threw a Rusted Can. A loud clang echoes.";
        addTaskLog("Player 2 threw rusted can.");
      } else {
        caption.textContent = "Player 2 has no cans to throw.";
      }
    }
  }

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
  
  const p2Codes = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Period", "Slash", "ShiftRight"];
  if (coopMode && p2Codes.includes(event.code)) {
    player2Keys.add(event.code);
    if (event.code === "Period") {
      toggleFlashlight2();
    }
    if (event.code === "ShiftRight") {
      inspectNearest2();
    }
  } else {
    keys.add(event.code);
    if (event.code === "KeyF") {
      toggleFlashlight();
    }
    if (event.code === "KeyE") {
      inspectNearest();
    }
  }
});

document.addEventListener("keyup", (event) => {
  keys.delete(event.code);
  player2Keys.delete(event.code);
});
nextLineButton.addEventListener("click", showNextStoryLine);
actionInteract.addEventListener("click", inspectNearest);
actionFlashlight.addEventListener("click", () => {
  if (gameState !== GameState.PLAYING) return;
  toggleFlashlight();
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

settingSfxVolume.addEventListener("input", (event) => {
  sfxVolume = parseFloat(event.target.value);
  localStorage.setItem("setting-sfx-volume", sfxVolume);
  caption.textContent = `SFX Volume: ${Math.round(sfxVolume * 100)}%`;
  if (audioManager) {
    audioManager.updateCategoryVolumes();
  }
});

settingAmbientVolume.addEventListener("input", (event) => {
  ambientVolume = parseFloat(event.target.value);
  localStorage.setItem("setting-ambient-volume", ambientVolume);
  caption.textContent = `Ambient Volume: ${Math.round(ambientVolume * 100)}%`;
  if (audioManager) {
    audioManager.updateCategoryVolumes();
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

playAgainButton?.addEventListener("click", () => {
  activeCheckpoint = null;
  resetGame();
  startGame({ lockPointer: true });
});

quitToMenu.addEventListener("click", () => {
  setGameState(GameState.MENU);
});

choiceEndingA?.addEventListener("click", () => {
  choiceScreen.classList.remove("open");
  triggerEnding("A");
});
choiceEndingB?.addEventListener("click", () => {
  choiceScreen.classList.remove("open");
  triggerEnding("B");
});
choiceEndingC?.addEventListener("click", () => {
  choiceScreen.classList.remove("open");
  triggerEnding("C");
});
choiceEndingD?.addEventListener("click", () => {
  choiceScreen.classList.remove("open");
  triggerEnding("D");
});

// Apply Initial Settings on Startup
settingMasterVolume.value = masterVolume;
settingSfxVolume.value = sfxVolume;
settingAmbientVolume.value = ambientVolume;
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
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = coopMode ? (aspect / 2) : aspect;
  camera.updateProjectionMatrix();
  if (camera2) {
    camera2.aspect = coopMode ? (aspect / 2) : aspect;
    camera2.updateProjectionMatrix();
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Touch & Gamepad Fallback Controls (Task 57) ─────────────────────────────

// Touch look: drag right 40% of screen to rotate camera
let touchLookId = null;
let touchLookLastX = 0;
let touchLookLastY = 0;

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.clientX > window.innerWidth * 0.6 && touchLookId === null) {
      touchLookId = t.identifier;
      touchLookLastX = t.clientX;
      touchLookLastY = t.clientY;
    }
  }
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.identifier === touchLookId) {
      const dx = t.clientX - touchLookLastX;
      const dy = t.clientY - touchLookLastY;
      yaw -= dx * mouseSensitivity * 0.003;
      pitch = THREE.MathUtils.clamp(pitch - dy * mouseSensitivity * 0.003, -1.1, 1.1);
      touchLookLastX = t.clientX;
      touchLookLastY = t.clientY;
    }
  }
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
  for (const t of e.changedTouches) {
    if (t.identifier === touchLookId) touchLookId = null;
  }
});

// Gamepad polling — inject left stick into keys Set and right stick into yaw/pitch
function pollGamepad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const pad of pads) {
    if (!pad) continue;
    const lx = pad.axes[0] ?? 0;
    const ly = pad.axes[1] ?? 0;
    const rx = pad.axes[2] ?? 0;
    const ry = pad.axes[3] ?? 0;
    const dead = 0.18;

    if (ly < -dead) keys.add("KeyW"); else keys.delete("KeyW");
    if (ly >  dead) keys.add("KeyS"); else keys.delete("KeyS");
    if (lx < -dead) keys.add("KeyA"); else keys.delete("KeyA");
    if (lx >  dead) keys.add("KeyD"); else keys.delete("KeyD");

    if (Math.abs(rx) > dead) yaw -= rx * 0.035;
    if (Math.abs(ry) > dead) pitch = THREE.MathUtils.clamp(pitch - ry * 0.028, -1.1, 1.1);

    if (pad.buttons[0]?.pressed) inspectNearest();
    if (pad.buttons[2]?.pressed) toggleFlashlight();
    if (pad.buttons[10]?.pressed) keys.add("ShiftLeft");
    else keys.delete("ShiftLeft");
  }
}

// Wrap animate to also poll gamepad each frame
const _rawAnimate = animate;
renderer.setAnimationLoop(() => {
  if (gameState === GameState.PLAYING) pollGamepad();
  _rawAnimate();
});

