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
let xrSession = null;
let activeLineTimer = 0;
let introPlayed = false;
let audioCtx = null;
let droneGain = null;
let heartbeatTimer = 0;
let footstepTimer = 0.35;
let meeraWarned = false;
let basementGateGroup = null;
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
let storyQueue = [];
let pointerLocked = false;
let flashlightLight = null;
const GameState = Object.freeze({
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAMEOVER: "gameover",
  WIN: "win"
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

    this.onStateChange(nextState, prevState);
  }

  onStateChange(nextState, prevState) {
    if (nextState === GameState.PLAYING) {
      if (!clock.running) clock.start();
    } else if (nextState === GameState.PAUSED || nextState === GameState.MENU || nextState === GameState.GAMEOVER || nextState === GameState.WIN) {
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

  const jumpscareBuffer = createJumpscareStingerBuffer(audioCtx);
  audioManager.buffers.set("jumpscare_stinger", jumpscareBuffer);

  const blackoutBuffer = createBlackoutCueBuffer(audioCtx);
  audioManager.buffers.set("blackout_cue", blackoutBuffer);

  const buzzBuffer = createBuzzBuffer(audioCtx);
  audioManager.buffers.set("electric_buzz", buzzBuffer);

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

  audioManager.buffers.set("ui_hover", createUiHoverBuffer(audioCtx));
  audioManager.buffers.set("ui_select", createUiSelectBuffer(audioCtx));
  audioManager.buffers.set("ui_pause_open", createUiPauseOpenBuffer(audioCtx));
  audioManager.buffers.set("ui_pause_close", createUiPauseCloseBuffer(audioCtx));

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

  scene.add(basementGateGroup);
  registerCollider(gateFrame);
  interactables.push(gateLeft, gateRight);
  initBatteries();
  initLoreNotes();
  buildCheckpointConsole([2.8, 0, -18.5], "Emergency Terminal");
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
  
  scene.add(group);
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
  
  scene.add(group);
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

  scene.add(noteGroup);
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
    footstepTimer = 0.35; // prime for immediate feedback on next move
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
  if (gameState === GameState.MENU) return;
  
  if (gameState === GameState.PLAYING && !blackoutTriggered && camera.position.z < -10) {
    blackoutTriggered = true;
    triggerBlackoutSequence();
  }

  if (flashlightOn) battery = Math.max(0, battery - delta * 1.15);
  if (battery <= 0 && flashlightOn) setFlashlight(false);
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
    const distToPlayer = meera.position.distanceTo(camera.position);
    
    if (meeraState === AiState.INACTIVE) {
      if (camera.position.z < -16 || fear > 28) {
        meeraState = AiState.PATROL;
        meera.position.set(0, 0, -35);
        meera.visible = true;
      } else {
        meera.visible = false;
      }
    }
    
    if (meeraState !== AiState.INACTIVE) {
      meera.lookAt(camera.position.x, meera.position.y, camera.position.z);
      
      const playerDetected = (flashlightOn && distToPlayer < 15) || (distToPlayer < 7) || (sprintExhausted === false && keys.has("ShiftLeft") && distToPlayer < 11);
      
      if (playerDetected && meeraState === AiState.PATROL) {
        meeraState = AiState.CHASE;
        playJumpscareStinger();
        addTaskLog("Warning: Threat is pursuing you!");
      }
      
      if (meeraState === AiState.PATROL) {
        meeraSpeed = 1.2;
        meera.position.z += meeraPatrolDir * meeraSpeed * delta;
        if (meera.position.z < -45) {
          meeraPatrolDir = 1;
        } else if (meera.position.z > -16) {
          meeraPatrolDir = -1;
        }
        meera.position.x = THREE.MathUtils.lerp(meera.position.x, 0, delta * 3);
      } else if (meeraState === AiState.CHASE) {
        meeraSpeed = 1.6 + (fear / 160);
        const toPlayer = new THREE.Vector3().subVectors(camera.position, meera.position);
        toPlayer.y = 0;
        toPlayer.normalize();
        meera.position.addScaledVector(toPlayer, meeraSpeed * delta);
        
        fear = Math.min(100, fear + delta * 3.6);
        
        if (distToPlayer > 18) {
          meeraState = AiState.PATROL;
          addTaskLog("Lost the ghost threat.");
        }
      }
      
      if (distToPlayer < 4.5 && meeraState === AiState.CHASE) {
        fear = Math.min(100, fear + delta * 24);
        camera.position.x += (Math.random() - 0.5) * 0.045;
        camera.position.y += (Math.random() - 0.5) * 0.045;
      }
      
      if (distToPlayer < 1.15) {
        triggerGameOver("Aarav was caught by Meera's presence inside the old wing.");
      }
    }
  }
  scene.userData.dust.rotation.y += delta * 0.018;

  flickerLights.forEach(({ light, base, phase }) => {
    if (isBlackoutActive) {
      light.intensity = THREE.MathUtils.lerp(light.intensity, 0, delta * 12);
    } else {
      const pulse = Math.sin(clock.elapsedTime * 7.5 + phase) > 0.92 ? 0.26 : 1;
      light.intensity = THREE.MathUtils.lerp(light.intensity, base * pulse, delta * 8);
    }
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
      if (door.userData.locked) {
        if (door.userData.label.includes("Room 32 left") && inspected >= 1) {
          door.userData.locked = false;
          caption.textContent = "You unlock Room 32 using the credentials from Dr. Verma's memo.";
          addTaskLog("Unlocked Room 32 Left Door.");
          sayLine("Aarav", "Okay, it's open. Let's see what's in here.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
        } else if (door.userData.label.includes("Room 29 right") && inspected >= 2) {
          door.userData.locked = false;
          caption.textContent = "You unlock Room 29 using the access card from the Watchman's Logbook.";
          addTaskLog("Unlocked Room 29 Right Door.");
          sayLine("Aarav", "The right wing dorm is unlocked. I should check the study tables.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
        } else {
          caption.textContent = "The door is locked from the inside. Find more documents first.";
          sayLine("Aarav", "Locked tight. I must have missed something down the hall.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
        }
        return;
      }

      door.userData.open = !door.userData.open;
      fear = Math.min(100, fear + 4);
      playDoorCreak(door, door.userData.open);
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
      caption.textContent = "The gate yields — a cold draft rises from the basement stairwell.";
      addTaskLog("Basement gate unlocked. Escape achieved.");
      completeObjective("basement");
      queueStory([
        ["Aarav", "The chain falls. Three years of evidence — and the lab was right here."],
        ["Aarav", "I have to file this with the department. Meera deserves that much."],
        ["Aarav", "Let's get out before she comes back."]
      ]);
      window.setTimeout(() => {
        triggerWin();
      }, 9800);
    } else {
      caption.textContent = "The gate is chained shut. Find all three missing documents first.";
      sayLine("Aarav", "It's locked. I need to find everything Meera left behind.");
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
    inspected = collectedEvidence.size;
    caseTitle.textContent = doc.title;
    caseBody.textContent = doc.body;
    caseFile.classList.add("open");
    playWhisper();
    updateObjectivesSystem();
    caption.textContent = "Document added to case file.";
    sayLine("Aarav", `This belongs in the case file: ${doc.title}.`);
    addTaskLog(`Recovered evidence: ${doc.title}.`);
    window.setTimeout(() => {
      caseFile.classList.remove("open");
    }, 7200);
    return;
  }

  if (type === "battery") {
    const parent = hit.object.userData.parentBattery;
    if (parent) {
      battery = Math.min(100, battery + 45);
      parent.visible = false;
      
      const idx = interactables.indexOf(hit.object);
      if (idx !== -1) {
        interactables.splice(idx, 1);
      }
      
      caption.textContent = "Flashlight battery recharged (+45%).";
      sayLine("Aarav", "This battery still has charge. Good.");
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
        position: [parent.position.x - 1.0, 1.7, parent.position.z],
        battery: battery,
        collectedEvidence: Array.from(collectedEvidence),
        collectedDocuments: Array.from(collectedDocuments.entries()),
        inspected: inspected,
        blackoutTriggered: blackoutTriggered
      };
      caption.textContent = "Progress checkpoint saved.";
      sayLine("Aarav", "A backup power console. The terminal says security log saved.");
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
    caption.textContent = `\u201c${text}\u201d`;
    sayLine("Aarav", `Found something pinned here: ${lbl}.`);
    addTaskLog(`Read environmental log: ${lbl}.`);
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
  setupUiSounds();
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
  addTaskLog("Aarav escaped through the basement. Evidence filed.");
}

function resetGame() {
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
    
    camera.position.set(0, 1.7, 8);
    camera.rotation.set(0, 0, 0);
    yaw = 0;
    pitch = 0;
  }
  
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
    // If checkpoint states exist, just restore them all for simplicity
    group.visible = true;
    const body = group.children[0];
    body.visible = true;
    if (!interactables.includes(body)) {
      interactables.push(body);
    }
  });

  meeraState = AiState.INACTIVE;
  meeraPatrolDir = -1;
  if (scene.userData.meeraCharacter) {
    scene.userData.meeraCharacter.position.set(2.6, 0, -34.5);
    scene.userData.meeraCharacter.visible = false;
  }
  
  updateObjectivesSystem();
  addTaskLog(activeCheckpoint ? "System status restored to last terminal checkpoint." : "System status restored. Re-entering Block A.");
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
    toggleFlashlight();
  }
  if (event.code === "KeyE") inspectNearest();
});

document.addEventListener("keyup", (event) => keys.delete(event.code));
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
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
