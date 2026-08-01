// @ts-nocheck
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import campusLayoutData from "./campus-layout.json";

export const roomBounds = [];
if (campusLayoutData && campusLayoutData.blocks) {
  campusLayoutData.blocks.forEach(block => {
    if (block.rooms) {
      block.rooms.forEach(room => {
        const xCenter = block.position[0] + room.offset[0];
        const zCenter = block.position[2] + room.offset[2];
        const w = room.size[0];
        const d = room.size[2];
        roomBounds.push({
          xMin: xCenter - w / 2 - 0.2,
          xMax: xCenter + w / 2 + 0.2,
          zMin: zCenter - d / 2 - 0.2,
          zMax: zCenter + d / 2 + 0.2
        });
      });
    }
  });
}
// gameState module (not used directly — main.js manages state internally)
import {
  AudioManager,
  createProceduralDroneBuffer,
  createConcreteStepBuffer,
  createTileStepBuffer,
  createFlashlightClickOnBuffer,
  createFlashlightClickOffBuffer,
  createDoorCreakBuffer,
  createDoorLatchBuffer,
  createBuzzBuffer,
  createBlackoutCueBuffer,
  createGeneratorStartBuffer,
  createUiHoverBuffer,
  createDebrisImpactBuffer,
  createUiSelectBuffer,
  createUiPauseOpenBuffer,
  createUiPauseCloseBuffer,
  createPhoneRingBuffer,
  createTickingBuffer,
  createTapePrequelBuffer,
  createEmfTickBuffer,
  createHeartBeatSlowBuffer,
  createHeartBeatFastBuffer,
  createBreathInBuffer,
  createBreathOutBuffer,
  createPillConsumeBuffer,
  createJumpscareStingerBuffer,
  createTerminalBeepBuffer,
  createDecryptSuccessBuffer,
  createLockerShakeBuffer,
  createDrawerSlideBuffer,
  createRadioStaticBuffer,
  createCameraSwitchBuffer,
  createStrobeBuzzBuffer,
  createDoorUnlockBeepBuffer,
  createButtonClickBuffer,
  createPaperRustleBuffer,
  createDecryptFailureBuffer,
  createWhisperBuffer,
  createCreepyWhisperBuffer
} from "./modules/audio/index.js";
import {
  proceduralTexture,
  createFlashlightCookie,
  createCheckerboardTexture,
  createPeelingWallTexture
} from "./modules/textures/index.js";
import {
  createProceduralHumanoidSkeleton,
  createCharacter,
  updateHumanoidAnimations,
  characterSelectState,
  initCharacterSelect,
  updatePreviewModel,
  cancelCharacterSelectAnimation,
  animateCharacterSelect,
  initCustomizationListeners
} from "./modules/character/index.js";
import { updateMovement, canOccupy } from "./modules/player/movement.js";
import { updateState } from "./modules/player/state.js";
import { initCoopKeyHandlers } from "./modules/player/multiplayer.js";
import {
  registerCollider,
  addToActiveLevel,
  box,
  tagInteractable,
  buildLocker,
  buildDebrisItem,
  createBookStack,
  createStudyTable,
  createBookshelf,
  buildDormRoom,
  buildFilingCabinetProp,
  buildDecryptorTerminalProp,
  buildTapeRecorder,
  buildMetronome,
  buildPillboxProp,
  buildBatteryMesh,
  buildCheckpointConsole,
  buildLoreNote,
  buildCorridor,
  buildSegmentedWall,
  addSpiderLilies,
  loadLevel2,
  buildLevel2,
  addAtmosphere,
  buildFlashlightProp,
  buildEmfProp,
  buildEmfPropForP2,
  buildRainSystem,
  updateRain,
  updateThunder
} from "./modules/level/index.js";

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
const batteryPanelP1 = document.querySelector("#hud-p1 .hud-panel");
const batteryPanelP2 = document.querySelector("#hud-p2 .hud-panel");
const settingP1Name = document.querySelector("#setting-p1-name");
const settingP1Model = document.querySelector("#setting-p1-model");
const settingP2Name = document.querySelector("#setting-p2-name");
const settingP2Model = document.querySelector("#setting-p2-model");
const settingBrightness = document.querySelector("#setting-brightness");
const polaroidImagePlaceholder = document.querySelector("#polaroid-image-placeholder");
const polaroidCaption = document.querySelector("#polaroid-caption");
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
export const caption = document.querySelector("#caption");
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
const settingSubtitles = document.querySelector("#setting-subtitles");
const settingCamShake = document.querySelector("#setting-cam-shake");
const settingInvertMouse = document.querySelector("#setting-invert-mouse");
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

const startPlusButton = document.querySelector("#start-plus-button");
const menuEndingsButton = document.querySelector("#menu-endings");
const endingsGallery = document.querySelector("#endings-gallery");
const endingsCloseBtn = document.querySelector("#endings-close-btn");
const hardcoreBadge = document.querySelector("#hardcore-badge");
const continueButton = document.querySelector("#continue-button");

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

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020303);
scene.fog = new THREE.FogExp2(0x070706, 0.012);

export const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 180);
camera.position.set(0, 1.7, 8);

const audioListener = new THREE.AudioListener();
camera.add(audioListener);

export const audioManager = new AudioManager(audioListener, loadingManager);

export let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  window.renderer = renderer;
} catch (error) {
  fatalError.hidden = false;
  throw error;
}
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;
renderer.xr.enabled = true;

let mainRendererContextLost = false;

renderer.domElement.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  mainRendererContextLost = true;
  renderer.setAnimationLoop(null);
  console.error("WebGL context lost on main renderer.");
  if (fatalError) {
    fatalError.innerHTML = `
      <h2>WebGL Context Lost</h2>
      <p>The graphics context was lost. Please reload the page to restart the game.</p>
      <button id="reload-btn" style="margin-top: 15px; padding: 8px 16px; background: #c9a56d; color: #080706; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">Reload Game</button>
    `;
    fatalError.hidden = false;
    document.getElementById("reload-btn")?.addEventListener("click", () => {
      window.location.reload();
    });
  }
}, false);

renderer.domElement.addEventListener("webglcontextrestored", () => {
  console.warn("WebGL context restored on main renderer; reloading to rebuild scene.");
  window.location.reload();
}, false);

export const clock = new THREE.Clock();
export const keys = new Set();
export const interactables = [];
export const doors = [];
export const evidenceItems = [];
export const batteryItems = [];
export const flickerLights = [];
export const playerRadius = 0.32;

export const gameplayState = {
  yaw: 0,
  pitch: 0,
  player2Yaw: 0,
  player2Pitch: 0,
  stamina: 100,
  stamina2: 100,
  sprintExhausted: false,
  sprintExhausted2: false,
  footstepTimer: 0.35,
  fear: 0,
  fear2: 0,
  p1Sanity: 100,
  p2Sanity: 100,
  p1HeartRate: 70,
  p2HeartRate: 70,
  isPlayerHidden: false,
  isPlayer2Hidden: false,
  isHoldingBreath: false,
  isHoldingBreath2: false,
  p1BreathStamina: 100,
  p2BreathStamina: 100,
  activeNoiseEventZ: null,
  noiseInvestigateTimer: 0,
  battery: 100,
  battery2: 100,
  flashlightOn: true,
  flashlightOn2: true,
  emfActive: false,
  emfActive2: false,
  emfLevel: 1,
  emfLevel2: 1,
  emfTickTimer: 0,
  emfTickTimer2: 0,
  p1LockerMinigameActive: false,
  p2LockerMinigameActive: false,
  p1LockerMinigameProgress: 0,
  p2LockerMinigameProgress: 0,
  p1PrevBreathDir: 1,
  p2PrevBreathDir: 1,
  p1BreathState: "in",
  p2BreathState: "in",
  meeraState: "inactive",
  meeraPatrolDir: -1,
  activeApparitionWalk: false,
  apparitionGhost: null,
  apparitionFadeTimer: 0,
  meeraFirstWhisperPlayed: false,
  meeraSecondEventPlayed: false,
  meeraFinalEventPlayed: false,
  activeCountdownFlicker: false,
  isBlackoutActive: false,
  blackoutTriggered: false,
  lockerAlertState: false,
  lockerTargetToInspect: null,
  statFearPeak: 0,
  p1HeartbeatSlowNode: null,
  p1HeartbeatFastNode: null,
  p2HeartbeatSlowNode: null,
  p2HeartbeatFastNode: null
};

for (const key of Object.keys(gameplayState)) {
  Object.defineProperty(window, key, {
    get() { return gameplayState[key]; },
    set(val) { gameplayState[key] = val; },
    configurable: true
  });
}

let mouseSensitivity = parseFloat(localStorage.getItem("setting-mouse-sensitivity") || "1.0");
let vignetteScale = 1.0;
let screenContrast = 1.0;
let masterVolume = parseFloat(localStorage.getItem("setting-master-volume") || "0.8");
let sfxVolume = parseFloat(localStorage.getItem("setting-sfx-volume") || "0.8");
let ambientVolume = parseFloat(localStorage.getItem("setting-ambient-volume") || "0.8");
let inspected = 0;
const collectedEvidence = new Set();
const collectedBatteries = new Set();
const readLoreNotes = new Set();
let p1Name = localStorage.getItem("setting-p1-name") || "Aarav";

function sanitizeCustomization(obj, defaultModel = "Aarav") {
  const validModels = ["Aarav", "Priya", "Rohan", "Sam"];
  const validHairStyles = ["short", "long", "cap", "buzzed", "ponytail"];
  const validOutfitColors = ["#243f5e", "#d4af37", "#56382a", "#2f4c34", "#7e2e17", "#4a2c5a", "#5a5a5a", "#d6c5b3"];
  const validSkinTones = ["#fcd0a1", "#fac08f", "#e3a072", "#a1683d", "#5c3818"];
  const validScales = ["short", "average", "tall"];

  const safe = {};
  
  if (obj && typeof obj === "object" && validModels.includes(obj.model)) {
    safe.model = obj.model;
  } else {
    safe.model = defaultModel;
  }

  let defaultOutfit = "#243f5e";
  let defaultHair = "short";
  let defaultSkin = "#e3a072";
  if (safe.model === "Priya") {
    defaultOutfit = "#d4af37";
    defaultHair = "long";
    defaultSkin = "#fac08f";
  } else if (safe.model === "Rohan") {
    defaultOutfit = "#2f4c34";
    defaultHair = "short";
    defaultSkin = "#fcd0a1";
  } else if (safe.model === "Sam") {
    defaultOutfit = "#56382a";
    defaultHair = "cap";
    defaultSkin = "#a1683d";
  }

  if (obj && typeof obj === "object" && validOutfitColors.includes(obj.outfitColor)) {
    safe.outfitColor = obj.outfitColor;
  } else {
    safe.outfitColor = defaultOutfit;
  }

  if (obj && typeof obj === "object" && validHairStyles.includes(obj.hairStyle)) {
    safe.hairStyle = obj.hairStyle;
  } else {
    safe.hairStyle = defaultHair;
  }

  if (obj && typeof obj === "object" && validScales.includes(obj.bodyScale)) {
    safe.bodyScale = obj.bodyScale;
  } else {
    safe.bodyScale = "average";
  }

  safe.hasGlasses = (obj && typeof obj === "object" && typeof obj.hasGlasses === "boolean") ? obj.hasGlasses : false;
  safe.hasBackpack = (obj && typeof obj === "object" && typeof obj.hasBackpack === "boolean") ? obj.hasBackpack : false;

  if (obj && typeof obj === "object" && validSkinTones.includes(obj.skinTone)) {
    safe.skinTone = obj.skinTone;
  } else {
    safe.skinTone = defaultSkin;
  }

  return safe;
}

let p1Customization = sanitizeCustomization(null, "Aarav");

try {
  const savedP1 = localStorage.getItem("setting-p1-customization");
  if (savedP1) {
    p1Customization = sanitizeCustomization(JSON.parse(savedP1), "Aarav");
  } else {
    const legacy = {
      model: localStorage.getItem("setting-p1-model"),
      outfitColor: localStorage.getItem("setting-p1-outfit-color"),
      hairStyle: localStorage.getItem("setting-p1-hair-style")
    };
    p1Customization = sanitizeCustomization(legacy, "Aarav");
  }
} catch (e) {
  console.error("Failed to parse P1 character customization setting", e);
}

export let p2Name = localStorage.getItem("setting-p2-name") || "Rohan";
let p2Customization = sanitizeCustomization(null, "Rohan");

try {
  const savedP2 = localStorage.getItem("setting-p2-customization");
  if (savedP2) {
    p2Customization = sanitizeCustomization(JSON.parse(savedP2), "Rohan");
  } else {
    const legacy = {
      model: localStorage.getItem("setting-p2-model"),
      outfitColor: localStorage.getItem("setting-p2-outfit-color"),
      hairStyle: localStorage.getItem("setting-p2-hair-style")
    };
    p2Customization = sanitizeCustomization(legacy, "Rohan");
  }
} catch (e) {
  console.error("Failed to parse P2 character customization setting", e);
}

export const playerCustomizationState = {
  p1Model: p1Customization.model,
  p1OutfitColor: p1Customization.outfitColor,
  p1HairStyle: p1Customization.hairStyle,
  p1BodyScale: p1Customization.bodyScale,
  p1HasGlasses: p1Customization.hasGlasses,
  p1HasBackpack: p1Customization.hasBackpack,
  p1SkinTone: p1Customization.skinTone,

  p2Model: p2Customization.model,
  p2OutfitColor: p2Customization.outfitColor,
  p2HairStyle: p2Customization.hairStyle,
  p2BodyScale: p2Customization.bodyScale,
  p2HasGlasses: p2Customization.hasGlasses,
  p2HasBackpack: p2Customization.hasBackpack,
  p2SkinTone: p2Customization.skinTone
};

let p1Model = playerCustomizationState.p1Model;
let p1OutfitColor = playerCustomizationState.p1OutfitColor;
let p1HairStyle = playerCustomizationState.p1HairStyle;
let p1BodyScale = playerCustomizationState.p1BodyScale;
let p1HasGlasses = playerCustomizationState.p1HasGlasses;
let p1HasBackpack = playerCustomizationState.p1HasBackpack;
let p1SkinTone = playerCustomizationState.p1SkinTone;

let p2Model = playerCustomizationState.p2Model;
let p2OutfitColor = playerCustomizationState.p2OutfitColor;
let p2HairStyle = playerCustomizationState.p2HairStyle;
let p2BodyScale = playerCustomizationState.p2BodyScale;
let p2HasGlasses = playerCustomizationState.p2HasGlasses;
let p2HasBackpack = playerCustomizationState.p2HasBackpack;
let p2SkinTone = playerCustomizationState.p2SkinTone;
let screenBrightness = parseFloat(localStorage.getItem("setting-brightness") || "2.0");
let xrSession = null;
let activeLineTimer = 0;
let introPlayed = false;
export let audioCtx = null;
let droneGain = null;
let heartbeatTimer = 0;

let frameCount = 0;
let fpsSum = 0;
let lastPerfLog = 0;

function disposeMaterial(mat) {
  if (!mat) return;
  for (const key in mat) {
    const prop = mat[key];
    if (prop && prop.isTexture) {
      prop.dispose();
    }
  }
  mat.dispose();
}

export function disposeObject3D(obj) {
  if (!obj) return;
  obj.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(child.material);
      }
    }
  });
}

export function disposeRenderer(renderer) {
  if (!renderer) return;
  renderer.dispose();
  if (typeof renderer.forceContextLoss === "function") {
    renderer.forceContextLoss();
  } else if (typeof renderer.getContext === "function") {
    const gl = renderer.getContext();
    const ext = gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  }
  const canvas = renderer.domElement;
  if (canvas) {
    ["__webglContext", "_webglContext", "webglContext", "gl"].forEach((key) => {
      if (key in canvas) canvas[key] = null;
    });
  }
}

export function disposeLevel(group = activeLevelGroup) {
  if (!group) return;
  const trackedObjects = [...group.children];
  trackedObjects.forEach((object) => {
    disposeObject3D(object);
    group.remove(object);
  });
  group.clear();
}

function logPerformanceTelemetry(delta) {
  frameCount++;
  fpsSum += 1 / delta;
  const now = performance.now();
  if (now - lastPerfLog > 3000) {
    const avgFps = Math.round(fpsSum / frameCount);
    const drawCalls = renderer.info.render.calls;
    const geometries = renderer.info.memory.geometries;
    const textures = renderer.info.memory.textures;
    console.log(`[PERFORMANCE] FPS: ${avgFps} | Draw Calls: ${drawCalls} | Memory: ${geometries} geometries, ${textures} textures`);
    frameCount = 0;
    fpsSum = 0;
    lastPerfLog = now;
  }
}

export function playPaperRustle() {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 0.12;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1600;
  filter.Q.value = 3.5;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.08 * sfxVolume;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

export function playPinClick() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.06 * sfxVolume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.06);
}

export const PropFactory = {
  createDesk: (position, rotation = 0) => {
    const group = new THREE.Group();
    group.name = "desk";
    group.position.set(...position);
    group.rotation.y = rotation;
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.8), materials.darkWood);
    top.position.y = 0.74;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);
    registerCollider(top);
    addToActiveLevel(group);
    return group;
  },
  createChair: (position, rotation = 0) => {
    const group = new THREE.Group();
    group.name = "chair";
    group.position.set(...position);
    group.rotation.y = rotation;
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.45), materials.darkWood);
    seat.position.y = 0.42;
    seat.castShadow = true;
    seat.receiveShadow = true;
    group.add(seat);
    registerCollider(seat);
    addToActiveLevel(group);
    return group;
  },
  createBed: (position, rotation = 0) => {
    const group = new THREE.Group();
    group.name = "bed";
    group.position.set(...position);
    group.rotation.y = rotation;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.4, 2.0), materials.darkWood);
    frame.position.y = 0.2;
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);
    registerCollider(frame);
    addToActiveLevel(group);
    return group;
  },
  createLocker: (position, rotation = 0) => {
    const group = new THREE.Group();
    group.name = "locker";
    group.position.set(...position);
    group.rotation.y = rotation;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 0.5), materials.metal);
    body.position.y = 0.9;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    registerCollider(body);
    addToActiveLevel(group);
    return group;
  },
  createCupboard: (position, rotation = 0) => {
    const group = new THREE.Group();
    group.name = "cupboard";
    group.position.set(...position);
    group.rotation.y = rotation;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.0, 0.5), materials.darkWood);
    body.position.y = 1.0;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    registerCollider(body);
    addToActiveLevel(group);
    return group;
  },
  createBookshelf: (position, rotation = 0) => {
    const group = new THREE.Group();
    group.name = "bookshelf";
    group.position.set(...position);
    group.rotation.y = rotation;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.9, 0.35), materials.darkWood);
    frame.position.y = 0.95;
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);
    registerCollider(frame);
    addToActiveLevel(group);
    return group;
  },
  createNoticeBoard: (position, rotation = 0) => {
    const group = new THREE.Group();
    group.name = "noticeboard";
    group.position.set(...position);
    group.rotation.y = rotation;
    group.name = "ceilingfan";
    group.position.set(...position);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5), materials.brass);
    rod.position.y = -0.25;
    group.add(rod);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08), materials.brass);
    hub.position.y = -0.5;
    group.add(hub);
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.01, 0.08), materials.darkWood);
      blade.position.y = -0.5;
      blade.rotation.y = (i * Math.PI * 2) / 3;
      blade.position.x = Math.sin(blade.rotation.y) * 0.32;
      blade.position.z = Math.cos(blade.rotation.y) * 0.32;
      group.add(blade);
    }
    addToActiveLevel(group);
    return group;
  },
  createTubeLight: (position, flicker = false) => {
    const group = new THREE.Group();
    group.name = "tubelight";
    group.position.set(...position);
    const fixture = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.08), materials.darkWood);
    group.add(fixture);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.15), materials.emission);
    tube.rotation.z = Math.PI / 2;
    tube.position.y = -0.04;
    group.add(tube);
    const light = new THREE.PointLight(0xfff9e6, 38.0, 12, 1.2);
    light.position.y = -0.15;
    light.castShadow = false;
    group.add(light);
    if (flicker) {
      flickerLights.push({ light, base: 38.0, phase: Math.random() * Math.PI * 2 });
    }
    addToActiveLevel(group);
    return group;
  }
};

// Level builder utilities exported and bound to window for sub-modules
export const RoomBuilder = {
  buildRoom: (name, type, position, size) => {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(...position);
    const [w, h, d] = size;
    const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), materials.floor);
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    group.add(floor);
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), materials.wall);
    ceiling.position.y = h + 0.05;
    group.add(ceiling);

    // Skip corridor-facing walls: left rooms (position[0] < 0) skip right wall (wallR),
    // right rooms (position[0] > 0) skip left wall (wallL).
    if (position[0] <= 0) {
      const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), materials.wall);
      wallL.position.set(-w/2, h/2, 0);
      wallL.castShadow = true;
      wallL.receiveShadow = true;
      group.add(wallL);
    }
    if (position[0] >= 0) {
      const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), materials.wall);
      wallR.position.set(w/2, h/2, 0);
      wallR.castShadow = true;
      wallR.receiveShadow = true;
      group.add(wallR);
    }

    const wallB = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), materials.wall);
    wallB.position.set(0, h/2, -d/2);
    wallB.castShadow = true;
    wallB.receiveShadow = true;
    group.add(wallB);
    const wallF = new THREE.Mesh(new THREE.BoxGeometry(w - 1.2, h, 0.1), materials.wall);
    wallF.position.set(0.6, h/2, d/2);
    wallF.castShadow = true;
    wallF.receiveShadow = true;
    group.add(wallF);
    addToActiveLevel(group);
    group.updateMatrixWorld(true);
    group.traverse(child => {
      if (child.isMesh && child !== ceiling && child !== floor) {
        registerCollider(child);
      }
    });
    return group;
  }
};

export const CampusLayoutBuilder = {
  buildCampus: (layoutData) => {
    if (!layoutData || !layoutData.blocks) return;
    layoutData.blocks.forEach(block => {
      const sectorGroup = new THREE.Group();
      sectorGroup.name = block.id;
      sectorGroup.position.set(...block.position);
      addToActiveLevel(sectorGroup);
      block.rooms.forEach(room => {
        const roomPos = [
          block.position[0] + room.offset[0],
          block.position[1] + room.offset[1],
          block.position[2] + room.offset[2]
        ];
        const roomGroup = RoomBuilder.buildRoom(room.name, room.type, roomPos, room.size);
        room.props.forEach((propType, idx) => {
          const xOffset = ((idx % 3) - 1) * (room.size[0] / 3.5);
          const zOffset = (Math.floor(idx / 3) - 0.5) * (room.size[2] / 3.5);
          const propPos = [
            roomPos[0] + xOffset,
            roomPos[1],
            roomPos[2] + zOffset
          ];
          if (propType === "desk") PropFactory.createDesk(propPos);
          if (propType === "chair") PropFactory.createChair(propPos);
          if (propType === "bed") PropFactory.createBed(propPos);
          if (propType === "locker") PropFactory.createLocker(propPos);
          if (propType === "cupboard") PropFactory.createCupboard(propPos);
          if (propType === "bookshelf") PropFactory.createBookshelf(propPos);
          if (propType === "noticeboard") PropFactory.createNoticeBoard(propPos);
        });
        PropFactory.createTubeLight([roomPos[0], roomPos[1] + room.size[1] - 0.1, roomPos[2]], true);
      });
      box("corridor segment floor", [6, 0.1, 30], [block.position[0], -0.05, block.position[2]], materials.floor);
      box("corridor segment ceiling", [6, 0.1, 30], [block.position[0], 3.85, block.position[2]], materials.wall);
      PropFactory.createTubeLight([block.position[0], 3.7, block.position[2] - 8], false);
      PropFactory.createTubeLight([block.position[0], 3.7, block.position[2] + 8], true);
    });
  }
};

window.RoomBuilder = RoomBuilder;
window.CampusLayoutBuilder = CampusLayoutBuilder;
window.campusLayoutData = campusLayoutData;

let kulkarniCallPlayed = false;
let meeraDiaryReacted = false;
let hardcoreMode = false;
let tapeRecorderPlaying = false;
let tapeSoundInstance = null;
let p1Pills = 0;
let p2Pills = 0;
let ecgSensorsCollected = false;
let shadowSpawnTimer = 0;
let creepyWhisperTimer = 0;
let shadowFigures = [];
let meeraFinalEventPlayed = false;
let kulkarniLibraryEventPlayed = false;
let currentCctvCam = 1;
let keypadInput = "";
const cctvCameras = [
  { id: 1, label: "CAM_01: MAIN LOBBY" },
  { id: 2, label: "CAM_02: BASEMENT ENGINE" },
  { id: 3, label: "CAM_03: LIBRARY ANNEX" }
];
let academicDoorUnlocked = false;
let activeApparitionWalk = false;
let apparitionGhost = null;
let apparitionFadeTimer = 0;
export let basementGateGroup = null;
export let level1Group = new THREE.Group();
scene.add(level1Group);
export let level2Group = new THREE.Group();
scene.add(level2Group);
export let currentLevel = 1;
export let activeLevelGroup = level1Group;
const valvesActivated = new Set();
let generatorPressure = 0;
let generatorActive = false;
let samCharacter = null;
let samFlashlight = null;

export function setSamCharacter(val) { samCharacter = val; }
export function setSamFlashlight(val) { samFlashlight = val; }
export function resetLevel2State() {
  currentLevel = 2;
  activeLevelGroup = level2Group;
  valvesActivated.clear();
  generatorPressure = 0;
  generatorActive = false;
  yaw = 0;
  pitch = 0;
  player2Yaw = 0;
  player2Pitch = 0;
}
export let yaw = 0;
export let pitch = 0;
export let player2Yaw = 0;
export let player2Pitch = 0;
export let coopMode = false;
export let camera2 = null;
export let player2Character = null;
let godModeActive = false;
let infiniteBatteryActive = false;
export let debugConsoleOpen = false;
let meeraSpeedMultiplier = 1.0;
let player1PreLockerPos = null;
let player2PreLockerPos = null;
let p1DebrisCount = 0;
let p2DebrisCount = 0;
// --- Library Level Specific Global States ---
// === LIBRARY ANNEX GLOBAL STATE ABSTRACTIONS === // Verified Flow - Phase 21 - Overrides
let libraryFoldersCollected = new Set();
let searchedCabinets = new Set();
let decryptedLogsCount = 0;
let p1LockerPeeking = false;
let p2LockerPeeking = false;
let activeEndingPath = null;
let activeDecryptionTerminal = null;
let decryptProgress = 0;
let p2DecryptingActive = false;
let decryptTargetPos = 50;
let decryptSpeedMultiplier = 1.0;
let lastPlayer1LockerInspected = null;
let lastPlayer2LockerInspected = null;
export let meeraLockerSearchTimer = 0;
export let runStartTime = 0;
export let runEndTime = 0;
export let statStaminaDrained = 0;
export let statTimesHidden = 0;
export let statCansThrown = 0;
export let godModeActive = false;
export let filmPass = null;
export let inspected = 0;
export let shadowFigures = [];
export let shadowSpawnTimer = 0;
export let creepyWhisperTimer = 0;

export let subtitlesEnabled = true;
export let camShakeMultiplier = 0.7;
export let invertMouseLook = false;
export let vrController1 = null;
export let vrController2 = null;
export let vrControllerGrip1 = null;
export let vrControllerGrip2 = null;
export let player2Flashlight = null;
export function setPlayer2Flashlight(val) { player2Flashlight = val; }
export const player2Keys = new Set();
export const AiState = {
  INACTIVE: "inactive",
  PATROL: "patrol",
  CHASE: "chase"
};
export let activeCheckpoint = null;
try {
  const savedCP = localStorage.getItem("ms_active_checkpoint");
  if (savedCP) {
    activeCheckpoint = JSON.parse(savedCP);
  }
} catch (e) {
  console.error("Failed to load active checkpoint from localStorage:", e);
}
export const shakeOffset = new THREE.Vector3();
export const moveDirection = new THREE.Vector3();
export const moveDirection2 = new THREE.Vector3();
const NpcSurvivorState = Object.freeze({ IDLE: "idle", FOLLOW: "follow", FLEE: "flee", HIDE: "hide" });
let samState = NpcSurvivorState.IDLE;
let storyQueue = [];
let pointerLocked = false;
export let flashlightLight = null;
export function setFlashlightLight(val) { flashlightLight = val; }
export const GameState = Object.freeze({
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAMEOVER: "gameover",
  WIN: "win",
  CHOICE: "choice",
  DECRYPTING: "decrypting"
});
export let gameState = GameState.MENU;
if (typeof window !== "undefined") {
  window.gameState = gameState;
  window.GameState = GameState;
  window.gameplayState = gameplayState;
}

class GameStateManager {
  constructor() {
    this.state = GameState.MENU;
  }

  transitionTo(nextState) {
    const prevState = this.state;
    this.state = nextState;
    gameState = nextState;
    if (typeof window !== "undefined") {
      window.gameState = nextState;
    }
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

    const decryptorModal = document.getElementById("decryptor-terminal-modal");
    if (decryptorModal) {
      if (nextState === GameState.DECRYPTING) {
        decryptorModal.style.display = "block";
      } else {
        decryptorModal.style.display = "none";
      }
    }

    if (winScreen) {
      if (nextState === GameState.WIN) {
        winScreen.classList.add("open");
        // Trigger epilogue typewriter after stamp delay
        const epilogueEl = document.getElementById("win-epilogue");
        if (epilogueEl) {
          epilogueEl.textContent = "";
          let epilogue = "The corridor was quiet for the first time since midnight. Aarav walked out into the pre-dawn fog, the evidence drive warm in his pocket. Block A would never open again.";
          if (activeEndingPath === "A") {
            epilogue = "Aarav initiated a public broadcast of the 2004 sensory isolation data, exposing Ravenswood's illegal cognitive experiments. Meera's story is finally known. The facility was permanently closed following a federal probe.";
          } else if (activeEndingPath === "B") { // Ending B dynamic block
            epilogue = "Aarav securely transferred all data directly to Professor Kulkarni. Within hours, the server was wiped and the basement staircase was walled over. Aarav received his degree, and the silence remains.";
          } else if (activeEndingPath === "C") { // Ending C dynamic block
            epilogue = "Aarav manually cut all power grids and stayed in the dark with Meera, matching the metronome's ticking. No one ever found him, but the backup grid still hums at 12Hz...";
          } else if (activeEndingPath === "D") { // Ending D dynamic block
            epilogue = "Aarav triggered the emergency release hatch and escaped into the cold morning air, leaving the data behind. He survived, but the weight of what he left behind will follow him forever.";
          }
          let i = 0;
          const typeInterval = window.setInterval(() => {
            epilogueEl.textContent += epilogue[i];
            i++;
            if (i >= epilogue.length) clearInterval(typeInterval);
          }, 38);
        }
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
    } else if (nextState === GameState.PAUSED || nextState === GameState.MENU || nextState === GameState.GAMEOVER || nextState === GameState.WIN || nextState === GameState.CHOICE || nextState === GameState.DECRYPTING) {
      clock.stop();
      keys.clear();
    }
  }
}

const stateManager = new GameStateManager();

export function setGameState(nextState) {
  stateManager.transitionTo(nextState);
}

export function getGameState() {
  return gameState;
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

function completeObjective(step) {
  document.querySelector(`[data-step="${step}"]`)?.classList.add("done");
}

export function updateObjectivesSystem() {
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
      if (libraryFoldersCollected.size > 0 && decryptedLogsCount < 2) {
        objective.textContent = `Library archive folders collected. Decrypt them at the center Decryptor Terminal (${decryptedLogsCount}/2).`;
      } else {
        objective.textContent = "Generator active! Reach the Operations Terminal at the end of the hall.";
      }
    }
  }
}

export function addTaskLog(message) {
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

export function triggerBlackoutSequence() {
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

export function setFlashlight(state) {
  const previous = flashlightOn;
  flashlightOn = state && battery > 0;
  if (previous !== flashlightOn) {
    const clickSound = flashlightOn ? "flashlight_on" : "flashlight_off";
    if (audioManager) audioManager.playSound(clickSound, { volume: 0.42 });
    caption.textContent = flashlightOn ? "Flashlight on." : "Flashlight off.";
  }
}

export function toggleFlashlight() {
  setFlashlight(!flashlightOn);
}

export function setFlashlight2(state) {
  const previous = flashlightOn2;
  flashlightOn2 = state && battery2 > 0;
  if (previous !== flashlightOn2) {
    const clickSound = flashlightOn2 ? "flashlight_on" : "flashlight_off";
    if (audioManager) audioManager.playSound(clickSound, { volume: 0.42 });
    caption.textContent = flashlightOn2 ? "Player 2 Flashlight on." : "Player 2 Flashlight off.";
  }
}

export function toggleFlashlight2() {
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

  const emfTickBuffer = createEmfTickBuffer(audioCtx);
  audioManager.buffers.set("emf_tick", emfTickBuffer);

  const pillConsumeBuffer = createPillConsumeBuffer(audioCtx);
  audioManager.buffers.set("pill_consume", pillConsumeBuffer);

  const whispersBuffer = createCreepyWhisperBuffer(audioCtx);
  audioManager.buffers.set("creepy_whispers", whispersBuffer);

  const generatorStartBuffer = createGeneratorStartBuffer(audioCtx);
  audioManager.buffers.set("generator_start", generatorStartBuffer);

  const tapeBuffer = createTapePrequelBuffer(audioCtx);
  audioManager.buffers.set("tape_prequel", tapeBuffer);

  const heartbeatSlowBuffer = createHeartBeatSlowBuffer(audioCtx);
  audioManager.buffers.set("heart_beat_slow", heartbeatSlowBuffer);

  const heartbeatFastBuffer = createHeartBeatFastBuffer(audioCtx);
  audioManager.buffers.set("heart_beat_fast", heartbeatFastBuffer);

  const breathInBuffer = createBreathInBuffer(audioCtx);
  audioManager.buffers.set("breath_in", breathInBuffer);

  const breathOutBuffer = createBreathOutBuffer(audioCtx);
  audioManager.buffers.set("breath_out", breathOutBuffer);

  const terminalBeepBuffer = createTerminalBeepBuffer(audioCtx);
  audioManager.buffers.set("terminal_beep", terminalBeepBuffer);

  const doorUnlockBeepBuffer = createDoorUnlockBeepBuffer(audioCtx);
  audioManager.buffers.set("door_unlock_beep", doorUnlockBeepBuffer);

  const strobeBuzzBuffer = createStrobeBuzzBuffer(audioCtx);
  audioManager.buffers.set("strobe_buzz", strobeBuzzBuffer);

  const cameraSwitchBuffer = createCameraSwitchBuffer(audioCtx);
  audioManager.buffers.set("camera_switch", cameraSwitchBuffer);

  const radioStaticBuffer = createRadioStaticBuffer(audioCtx);
  audioManager.buffers.set("radio_static", radioStaticBuffer);

  const paperRustleBuffer = createPaperRustleBuffer(audioCtx);
  audioManager.buffers.set("paper_rustle", paperRustleBuffer);

  const buttonClickBuffer = createButtonClickBuffer(audioCtx);
  audioManager.buffers.set("button_click", buttonClickBuffer);

  const lockerShakeBuffer = createLockerShakeBuffer(audioCtx);
  audioManager.buffers.set("locker_shake", lockerShakeBuffer);

  const drawerSlideBuffer = createDrawerSlideBuffer(audioCtx);
  audioManager.buffers.set("drawer_slide", drawerSlideBuffer);

  const decryptSuccessBuffer = createDecryptSuccessBuffer(audioCtx);
  audioManager.buffers.set("decrypt_success", decryptSuccessBuffer);

  const decryptFailureBuffer = createDecryptFailureBuffer(audioCtx);
  audioManager.buffers.set("decrypt_failure", decryptFailureBuffer);

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

  // Adaptive heartbeat: rate and volume scale with fear — silent below 30%, rapid at 80%+
  function scheduleNextHeartbeat() {
    if (!document.body.classList.contains("started")) {
      heartbeatTimer = window.setTimeout(scheduleNextHeartbeat, 2000);
      return;
    }
    const activeFear = Math.max(fear, coopMode ? fear2 : 0);
    if (activeFear < 30) {
      // Nearly silent below fear threshold
      heartbeatTimer = window.setTimeout(scheduleNextHeartbeat, 2400);
      return;
    }
    // Interval: 1200ms at fear=30 → 480ms at fear=100
    const interval = THREE.MathUtils.lerp(1200, 480, (activeFear - 30) / 70);
    const vol = THREE.MathUtils.lerp(0.022, 0.11, (activeFear - 30) / 70);
    playTone(58, 0.10, vol, "sine");
    window.setTimeout(() => playTone(46, 0.07, vol * 0.7, "sine"), 145);
    heartbeatTimer = window.setTimeout(scheduleNextHeartbeat, interval);
  }
  scheduleNextHeartbeat();
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

export function playDoorCreak(targetMesh, isOpen) {
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



export function playWhisper() {
  if (audioManager) {
    audioManager.playSound("evidence_whisper", { volume: 0.58 });
  }
}



export function playJumpscareStinger() {
  if (audioManager) {
    audioManager.playSound("jumpscare_stinger", { volume: 1.0 });
    audioManager.duckAmbient(3200, 0.15);
    fear = Math.min(100, fear + 24);
    caption.textContent = "A cold chill runs down Aarav's spine. Something is close.";
  }
}



export function createFlashlightBeam() {
  const geom = new THREE.CylinderGeometry(0.015, 1.3, 11.0, 20, 1, true);
  geom.rotateX(-Math.PI / 2);
  geom.translate(0, 0, -5.5);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffe0a4,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.name = "volumetric_beam";
  return mesh;
}

const floorTexture = createCheckerboardTexture();
floorTexture.repeat.set(2.5, 18);
const wallTexture = createPeelingWallTexture();
wallTexture.repeat.set(2, 10);
const woodTexture = proceduralTexture({ base: "#23150f", grain: "#4b2c1d", scratches: "#70513a", scale: 1.2 });
woodTexture.repeat.set(1, 4);

export const materials = {
  wall: new THREE.MeshStandardMaterial({ color: 0xffffff, map: wallTexture, roughness: 0.88, metalness: 0.02 }),
  darkWood: new THREE.MeshStandardMaterial({ color: 0x4b2c1d, map: woodTexture, roughness: 0.74 }),
  floor: new THREE.MeshStandardMaterial({ color: 0xffffff, map: floorTexture, roughness: 0.7 }),
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

export const colliders = [];




export function addLabel(text, position, size = 0.34) {
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
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.88, side: THREE.DoubleSide })
  );
  mesh.position.set(...position);
  mesh.rotation.y = Math.PI;
  mesh.castShadow = true;
  addToActiveLevel(mesh);
  return mesh;
}

export function createDoor({ side, z, label }) {
  const direction = side === "left" ? -1 : 1;
  const group = new THREE.Group();
  group.name = label;
  group.position.set(direction * 3.62, 1.18, z);
  const locked = label.includes("Room 32 left") || label.includes("Room 29 right");
  group.userData = { type: "door", open: false, side, label, locked };

  // 1. Realistic Door Frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x221711, roughness: 0.85 });
  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.45, 0.06), frameMat);
  frameLeft.position.set(0, 0, -0.61);
  frameLeft.castShadow = true;
  frameLeft.receiveShadow = true;
  group.add(frameLeft);

  const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.45, 0.06), frameMat);
  frameRight.position.set(0, 0, 0.61);
  frameRight.castShadow = true;
  frameRight.receiveShadow = true;
  group.add(frameRight);

  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 1.28), frameMat);
  frameTop.position.set(0, 1.2, 0);
  frameTop.castShadow = true;
  frameTop.receiveShadow = true;
  group.add(frameTop);

  // 2. Main Door Panel
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.32, 1.14), materials.darkWood);
  panel.name = `${label} panel`;
  panel.castShadow = true;
  panel.receiveShadow = true;
  panel.userData.parentDoor = group;
  tagInteractable(panel, "door", label);
  group.add(panel);

  // 3. Beveled Panel Trims (Wood carvings details)
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x140c07, roughness: 0.9 });
  [[-0.075, 1], [0.075, -1]].forEach(([xOffset]) => {
    [0.48, -0.48].forEach((yPos) => {
      [-0.22, 0.22].forEach((zPos) => {
        const trim = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.62, 0.32), trimMat);
        trim.position.set(xOffset, yPos, zPos);
        trim.castShadow = true;
        group.add(trim);
      });
    });
  });

  // 4. Brass backing plate & Lever doorknob
  const knobPlate = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.08), materials.brass);
  knobPlate.position.set(-direction * 0.1, -0.06, 0.4);
  knobPlate.userData.parentDoor = group;
  tagInteractable(knobPlate, "door", label);
  group.add(knobPlate);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), materials.brass);
  knob.name = `${label} knob`;
  knob.position.set(-direction * 0.12, -0.06, 0.4);
  knob.userData.parentDoor = group;
  tagInteractable(knob, "door", label);
  group.add(knob);

  const handleLever = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8), materials.brass);
  handleLever.position.set(-direction * 0.12, -0.06, 0.48);
  handleLever.rotation.x = Math.PI / 2;
  handleLever.userData.parentDoor = group;
  tagInteractable(handleLever, "door", label);
  group.add(handleLever);

  const sign = addLabel(label.replace(" door", "").toUpperCase(), [0, 0, 0], 0.16);
  if (activeLevelGroup) {
    activeLevelGroup.remove(sign);
  } else {
    scene.remove(sign);
  }
  sign.position.set(-direction * 0.08, 0.74, 0);
  sign.rotation.y = direction < 0 ? Math.PI / 2 : -Math.PI / 2;
  group.add(sign);

  addToActiveLevel(group);
  doors.push(group);
  interactables.push(panel, knob, knobPlate, handleLever);
  return group;
}





export function clearGroup(group) {
  if (!group) return;
  disposeLevel(group);
}





export function buildEcgSensorsProp(position, dormGroup) {
  if (ecgSensorsCollected) return;
  const group = new THREE.Group();
  group.name = "ecg_sensors_group";
  group.position.set(...position);

  const bodyGeo = new THREE.BoxGeometry(0.12, 0.03, 0.08);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.5 });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);
  registerCollider(bodyMesh);

  const ledGeo = new THREE.SphereGeometry(0.008, 8, 8);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x39ff14 });
  const ledMesh = new THREE.Mesh(ledGeo, ledMat);
  ledMesh.position.set(0.04, 0.016, 0.02);
  group.add(ledMesh);

  const padGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.005, 8);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x8e8e8e, metalness: 0.8, roughness: 0.2 });
  
  const pad1 = new THREE.Mesh(padGeo, padMat);
  pad1.position.set(-0.06, -0.01, -0.05);
  group.add(pad1);

  const pad2 = new THREE.Mesh(padGeo, padMat);
  pad2.position.set(0.06, -0.01, 0.05);
  group.add(pad2);

  const wireMat = new THREE.LineBasicMaterial({ color: 0x111111 });
  
  const wire1Points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.03, -0.01, -0.025),
    new THREE.Vector3(-0.06, -0.01, -0.05)
  ];
  const wire1Geo = new THREE.BufferGeometry().setFromPoints(wire1Points);
  const wire1 = new THREE.Line(wire1Geo, wireMat);
  group.add(wire1);

  const wire2Points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.03, -0.01, 0.025),
    new THREE.Vector3(0.06, -0.01, 0.05)
  ];
  const wire2Geo = new THREE.BufferGeometry().setFromPoints(wire2Points);
  const wire2 = new THREE.Line(wire2Geo, wireMat);
  group.add(wire2);

  tagInteractable(bodyMesh, "ecg_sensors", "ECG Sensors");
  bodyMesh.userData.parentEcgSensors = group;

  dormGroup.attach(group);
  interactables.push(bodyMesh);
}






export function buildDocuments() {
  const docs = [
    {
      title: "Dr. Verma Memo",
      body: "Subject M reports auditory counting after 42 hours of isolation. Trial continues under revised observation protocol.",
      position: [-1.2, 0.08, -4.4]
    },
    {
      title: "Watchman's Logbook",
      body: "The old wing has lights after midnight again. I heard the metronome from the sealed basement and returned the keys.",
      position: [0.45, 1.14, -39.45]
    },
    {
      title: "Meera Iyer ID Card",
      body: "Hostel record, 2004. Fee waiver attached to Applied Cognition Lab volunteer enrollment.",
      position: [6.0, 0.8, -29.43]
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



export function initBatteries() {
  batteryItems.forEach(b => scene.remove(b));
  batteryItems.length = 0;
  
  batteryItems.push(buildBatteryMesh([1.8, 0.2, 2.0], "Battery Pack"));
  batteryItems.push(buildBatteryMesh([-5.5, 0.8, -18.4], "Spare Battery"));
  batteryItems.push(buildBatteryMesh([2.6, 0.68, -35.2], "Emergency Battery"));
}



export function initLoreNotes() {
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



export function setEmfActive(active) {
  emfActive = active;
  if (camera.userData.emfProp) {
    camera.userData.emfProp.visible = active;
  }
  const panel = document.getElementById("emf-p1-panel");
  if (panel) panel.style.display = active ? "flex" : "none";
  addTaskLog(active ? "Equipped EMF Detector Gear." : "Holstered EMF Detector Gear.");
}

export function setEmfActive2(active) {
  emfActive2 = active;
  if (camera2 && camera2.userData.emfProp) {
    camera2.userData.emfProp.visible = active;
  }
  const panel = document.getElementById("emf-p2-panel");
  if (panel) panel.style.display = active ? "flex" : "none";
}

function consumePill1() {
  if (p1Pills <= 0) {
    caption.textContent = "You don't have any Sanity Pills left.";
    return;
  }
  p1Pills--;
  const p1Count = document.getElementById("pills-p1-count");
  if (p1Count) p1Count.textContent = p1Pills;
  
  p1Sanity = Math.min(100, p1Sanity + 35);
  const sanity1Val = document.getElementById("sanity-p1-val");
  const sanity1Meter = document.getElementById("sanity-p1-meter");
  if (sanity1Val) sanity1Val.textContent = `${Math.round(p1Sanity)}%`;
  if (sanity1Meter) sanity1Meter.value = p1Sanity;
  
  if (p1Sanity > 30) {
    const sanity1Panel = document.getElementById("sanity-p1-panel");
    if (sanity1Panel) sanity1Panel.classList.remove("critical-sanity");
  }

  caption.textContent = "You took a sanity pill. The panic begins to fade...";
  sayLine("Aarav", "Tastes chalky... but my heartbeat is slowing down.");
  if (audioManager) {
    audioManager.playSound("pill_consume", { volume: 0.95 });
  }
  addTaskLog("Consumed Sanity Pills (+35% Sanity).");
}

function consumePill2() {
  if (p2Pills <= 0) {
    caption.textContent = "Player 2 has no Sanity Pills left.";
    return;
  }
  p2Pills--;
  const p2Count = document.getElementById("pills-p2-count");
  if (p2Count) p2Count.textContent = p2Pills;

  p2Sanity = Math.min(100, p2Sanity + 35);
  const sanity2Val = document.getElementById("sanity-p2-val");
  const sanity2Meter = document.getElementById("sanity-p2-meter");
  if (sanity2Val) sanity2Val.textContent = `${Math.round(p2Sanity)}%`;
  if (sanity2Meter) sanity2Meter.value = p2Sanity;

  if (p2Sanity > 30) {
    const sanity2Panel = document.getElementById("sanity-p2-panel");
    if (sanity2Panel) sanity2Panel.classList.remove("critical-sanity");
  }

  caption.textContent = "Player 2 took a sanity pill.";
  sayLine("Rohan", "Feeling a bit more clear-headed now.");
  if (audioManager) {
    audioManager.playSound("pill_consume", { volume: 0.95 });
  }
  addTaskLog("Player 2 consumed Sanity Pills (+35% Sanity).");
}


// updateState is now handled by modules/player/state.js — imported above as updateState.


export function getFocusedInteractable(maxDistance = 4) {
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

export function updateInteractionPrompt() {
  if (!document.body.classList.contains("started")) return;

  // Player 1 Prompt
  const hit = getFocusedInteractable();
  if (!hit) {
    interactionPrompt.hidden = true;
    if (reticleP1) reticleP1.classList.remove("on-interactable");
  } else {
    if (reticleP1) reticleP1.classList.add("on-interactable");
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
    } else if (type === "pillbox") {
      interactionPrompt.textContent = "[E] Collect Sanity Pills";
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
        } else if (type === "pillbox") {
          interactionPromptP2.textContent = "[ShiftRight] Collect Sanity Pills";
        } else {
          interactionPromptP2.textContent = `[ShiftRight] ${hit2.object.userData.interactionLabel || "Interact"}`;
        }
      }
    }
  }
}

export function translateSpeakerName(name) {
  if (name === "Aarav") return p1Name;
  if (name === "Rohan") return p2Name;
  return name;
}

export function sayLine(name, text, duration = 5600) {
  if (!subtitlesEnabled) {
    dialogue.classList.remove("open");
    return;
  }
  speaker.textContent = translateSpeakerName(name);
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

export function queueStory(lines) {
  storyQueue = [...lines];
  showNextStoryLine();
}

export function showNextStoryLine() {
  const next = storyQueue.shift();
  if (!next) {
    dialogue.classList.remove("open");
    return;
  }

  const delay = Math.min(15000, Math.max(5000, 3000 + next[1].length * 60));
  sayLine(next[0], next[1], delay);
}

export function playIntroDialogue() {
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

export function getFocusedInteractable2(maxDistance = 4) {
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

export function inspectNearest() {
  if (gameState !== GameState.PLAYING) return;
  const hit = getFocusedInteractable();
  if (!hit) {
    caption.textContent = "Nothing close enough to inspect.";
    return;
  }
  inspectObject(hit, false);
}

export function inspectNearest2() {
  if (gameState !== GameState.PLAYING) return;
  const hit = getFocusedInteractable2();
  if (!hit) {
    caption.textContent = "Nothing close enough to inspect.";
    return;
  }
  inspectObject(hit, true);
}

export function inspectObject(hit, isPlayer2 = false) {
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
        p1LockerPeeking = true;
        const peekEl1 = document.getElementById("locker-slat-peek-p1");
        if (peekEl1) peekEl1.style.display = "block";
        addTaskLog("Entered hiding spot.");
        setFlashlight(false);
        if (ecgSensorsCollected) {
          p1LockerMinigameActive = true;
          p1LockerMinigameProgress = 30;
          p1BreathState = "hold";
        }

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
        p1LockerMinigameActive = false;
        p1LockerPeeking = false;
        const peekEl1 = document.getElementById("locker-slat-peek-p1");
        if (peekEl1) peekEl1.style.display = "none";
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
        if (ecgSensorsCollected) {
          p2LockerMinigameActive = true;
          p2LockerMinigameProgress = 30;
          p2BreathState = "hold";
        }

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
        p2LockerMinigameActive = false;
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

  if (type === "npc") {
    const name = hit.object.name || (hit.object.parent ? hit.object.parent.name : "") || "Professor Kulkarni";
    if (name.includes("Kulkarni")) {
      queueStory([
        ["Professor Kulkarni", "Aarav! Thank goodness you're alright. The whole wing has gone into lockdown."],
        ["Aarav", "Professor, what is this place? What were you doing in the basement in 2005?"],
        ["Professor Kulkarni", "We were researching cognitive synchronization. Meera... she was our prime volunteer. But something went wrong. The frequency... it trapped her."],
        ["Professor Kulkarni", "Find the three pieces of evidence: Verma's memo, the Watchman's logbook, and Meera's ID. That will unlock the basement gate. But be careful... Meera is wandering these halls!"]
      ]);
    } else if (name.includes("Priya")) {
      queueStory([
        ["Priya", "Aarav! The power grid in Block A is fluctuating wildly. 12Hz... it matches the 2004 incident records!"],
        ["Aarav", "Priya, how do we get out? The main gate is locked."],
        ["Priya", "We need to unlock the basement gate. Kulkarni has the overrides, but he's terrified of Meera. I'm trying to bypass the electrical sub-station from here."]
      ]);
    } else if (name.includes("Rohan")) {
      queueStory([
        ["Rohan", "Aarav, I'm finding documents about Meera's volunteer profile. She didn't sign up willingly. Kulkarni and the Dean forced her!"],
        ["Aarav", "What? Why?"],
        ["Rohan", "They wanted to achieve total neural synchronization. I'm gathering all the files I can find. We need to expose this!"]
      ]);
    } else if (name.includes("Sam")) {
      queueStory([
        ["Sam", "Aarav, keep your voice down! She's patrolling the dorm hallway. I saw her walk through the walls!"],
        ["Aarav", "Meera? What does she want?"],
        ["Sam", "She's searching for her lost ID card. It was left in one of the study tables. If you find it, do not let her see you with it!"]
      ]);
    }
    return;
  }

  if (type === "door") {
    const door = hit.object.userData.parentDoor;
    if (door) {
      if (door.userData.locked) {
        if (door.userData.label.includes("Room 32 left") && inspected >= 1) {
          door.userData.locked = false;
          door.userData.open = true;
          caption.textContent = "You unlock and open Room 32 using the credentials from Dr. Verma's memo.";
          addTaskLog("Unlocked Room 32 Left Door.");
          sayLine(playerName, "Okay, it's open. Let's see what's in here.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
          playDoorCreak(door, true);
        } else if (door.userData.label.includes("Room 29 right") && inspected >= 2) {
          door.userData.locked = false;
          door.userData.open = true;
          caption.textContent = "You unlock and open Room 29 using the access card from the Watchman's Logbook.";
          addTaskLog("Unlocked Room 29 Right Door.");
          sayLine(playerName, "The right wing dorm is unlocked. I should check the study tables.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
          playDoorCreak(door, true);
        } else {
          caption.textContent = "The door is locked from the inside. Find more documents first.";
          sayLine(playerName, "Locked tight. I must have missed something down the hall.");
          if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
          return;
        }
      } else {
        door.userData.open = !door.userData.open;
        if (isPlayer2) {
          fear2 = Math.min(100, fear2 + 4);
        } else {
          fear = Math.min(100, fear + 4);
        }
        playDoorCreak(door, door.userData.open);
        caption.textContent = door.userData.open ? "The door groans open." : "The latch clicks shut.";
        addTaskLog(`${door.userData.open ? "Opened" : "Closed"} ${door.userData.label}.`);
      }

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

  if (type === "pillbox") {
    const parent = hit.object.userData.parentPillbox;
    if (parent) {
      if (isPlayer2) {
        p2Pills++;
        const p2Count = document.getElementById("pills-p2-count");
        if (p2Count) p2Count.textContent = p2Pills;
      } else {
        p1Pills++;
        const p1Count = document.getElementById("pills-p1-count");
        if (p1Count) p1Count.textContent = p1Pills;
      }
      parent.visible = false;

      const idx = interactables.indexOf(hit.object);
      if (idx !== -1) {
        interactables.splice(idx, 1);
      }

      caption.textContent = `Picked up Sanity Pills. Press [C] (P1) or [P] (P2) to consume.`;
      sayLine(playerName, "Sanity pills... this will calm my nerves.");
      if (audioManager) {
        audioManager.playSound("ui_select", { volume: 0.3 });
      }
      addTaskLog("Picked up sanity pills box.");
    }
    return;
  }

  if (type === "ecg_sensors") {
    const parent = hit.object.userData.parentEcgSensors;
    if (parent) {
      ecgSensorsCollected = true;
      parent.visible = false;
      const idx = interactables.indexOf(hit.object);
      if (idx !== -1) {
        interactables.splice(idx, 1);
      }
      caption.textContent = "Picked up ECG Electrode Sensors. Bio-feed monitoring active.";
      sayLine(playerName, "This looks like an old ECG biosensor kit. It still works.");
      if (audioManager) {
        audioManager.playSound("ui_select", { volume: 0.3 });
      }
      addTaskLog("Collected ECG Electrode Sensors.");
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
        level: currentLevel,
        ecgSensorsCollected: ecgSensorsCollected,
        libraryFoldersCollected: Array.from(libraryFoldersCollected),
        academicDoorUnlocked: academicDoorUnlocked,
        searchedCabinets: Array.from(searchedCabinets),
        decryptedLogsCount: decryptedLogsCount
      };
      try {
        localStorage.setItem("ms_active_checkpoint", JSON.stringify(activeCheckpoint));
        if (continueButton) {
          continueButton.style.display = "block";
        }
      } catch (e) {
        console.error("Failed to save active checkpoint to localStorage:", e);
      }
      caption.textContent = "Progress checkpoint saved.";
      sayLine(playerName, "A backup power console. The terminal says security log saved.");
      if (audioManager) {
        audioManager.playSound("ui_select", { volume: 0.25 });
      }
      addTaskLog("Checkpoint reached: System logs saved.");
    }
    return;
  }

  if (type === "tape_recorder") {
    if (!hardcoreMode) {
      caption.textContent = "A heavy magnetic tape recorder from 2004. The reels are stuck. The label reads: 'Applied Cognition Lab - Trial 8'.";
      sayLine(playerName, "This must have belonged to the lab researchers. I wonder if there's a way to play it...");
      addTaskLog("Inspected the locked tape recorder.");
    } else {
      if (tapeRecorderPlaying) {
        tapeRecorderPlaying = false;
        caption.textContent = "You stopped the tape recorder.";
        if (tapeSoundInstance) {
          try {
            tapeSoundInstance.stop();
          } catch (e) {}
          tapeSoundInstance = null;
        }
        addTaskLog("Stopped the tape recorder playback.");
      } else {
        tapeRecorderPlaying = true;
        caption.textContent = "[Audio Log]: Subject M... 42... 18... 5... 0... [static]... help me...";
        sayLine(playerName, "The reels are spinning! This is Meera's voice... she's reciting the sequence!");
        addTaskLog("Played the historical prequel recording.");
        if (audioManager) {
          tapeSoundInstance = audioManager.playSound("tape_prequel", { volume: 0.8 });
          if (tapeSoundInstance) {
            tapeSoundInstance.onended = () => {
              tapeRecorderPlaying = false;
              tapeSoundInstance = null;
              addTaskLog("Tape recorder playback completed.");
            };
          }
        }
      }
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
      
      const totalLoreNotes = readLoreNotes.size;
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

  if (type === "filing_cabinet") {
    const cabinetId = hit.object.id;
    if (searchedCabinets.has(cabinetId)) {
      caption.textContent = "The cabinet drawers are empty.";
      sayLine(playerName, "Nothing else inside this cabinet.");
      if (audioManager) audioManager.playSound("door_latch", { volume: 0.35 });
    } else {
      searchedCabinets.add(cabinetId);
      libraryFoldersCollected.add(cabinetId);
      caption.textContent = "You found an Encrypted Research Folder inside the cabinet drawer.";
      sayLine(playerName, "An encrypted research log. I should take this to the decryptor terminal in the center.");
      if (audioManager) {
        audioManager.playSound("drawer_slide", { volume: 0.6 });
        audioManager.playSound("ui_select", { volume: 0.4 });
      }
      addTaskLog("Recovered encrypted research log folder.");
    }
    return;
  }

  if (type === "security_terminal") {
    document.exitPointerLock?.();
    const modal = document.getElementById("security-terminal-modal");
    if (modal) modal.style.display = "block";
    setGameState(GameState.PAUSED);
    if (audioManager) audioManager.playSound("terminal_beep", { volume: 0.5 });
    caption.textContent = "Security override gateway accessed.";
    return;
  }

  if (type === "security_door") {
    if (academicDoorUnlocked) {
      hit.object.visible = false;
      const acadIdx = colliders.findIndex(c => c.name === "academic_door");
      if (acadIdx !== -1) colliders.splice(acadIdx, 1);
      caption.textContent = "You opened the Classroom Annex door.";
      if (audioManager) audioManager.playSound("door_creak", { volume: 0.5 });
    } else {
      caption.textContent = "The security door requires keypad authorization at the monitor table.";
      if (audioManager) audioManager.playSound("door_latch", { volume: 0.4 });
    }
    return;
  }

  if (type === "blueprint_map") {
    document.exitPointerLock?.();
    const mapModal = document.getElementById("map-overlay");
    if (mapModal) mapModal.style.display = "block";
    setGameState(GameState.PAUSED);
    updateMapMarkers();
    if (audioManager) audioManager.playSound("paper_rustle", { volume: 0.5 }); // Play map rustle
    caption.textContent = "Viewing Facility Blueprint. Press Escape or click Close to exit.";
    return;
  }

  if (type === "decryptor_terminal") {
    if (libraryFoldersCollected.size === 0) {
      caption.textContent = "The decryptor screen displays: 'INSERT DATA DRIVE'.";
      sayLine(playerName, "I need to find the encrypted data folders in the filing cabinets first.");
      if (audioManager) audioManager.playSound("terminal_beep", { volume: 0.3 });
    } else {
      activeDecryptionTerminal = hit.object;
      if (isPlayer2) {
        p2DecryptingActive = true;
        caption.textContent = "Player 2 (Rohan) joined Decryption Gateway. Press [Period] to align!";
        if (audioManager) audioManager.playSound("terminal_beep", { volume: 0.5 });
      } else {
        document.exitPointerLock?.();
        decryptProgress = 0;
        const modal = document.getElementById("decryptor-terminal-modal");
        if (modal) modal.style.display = "block";
        setGameState(GameState.DECRYPTING);
        caption.textContent = "Accessing Decryption Gateway. Align cyclical frequencies.";
        if (audioManager) audioManager.playSound("terminal_beep", { volume: 0.5 });
      }
    }
    return;
  }

  if (type === "bookshelf") {
    caption.textContent = "Rows of old textbooks, university circulars, and disused binders.";
    sayLine(playerName, "Nothing useful here. Just dust and old academic documents.");
    if (audioManager) audioManager.playSound("ui_hover", { volume: 0.2 });
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
      addConsoleLog("  /heartrate <bpm> [p1|p2] - Override player heart rate manually");
      addConsoleLog("  /unlockall - Unlock academic classroom annex security doors");
      addConsoleLog("  /skipdecryption - Bypass active decryption puzzles");
      addConsoleLog("  /triggerending <A|B|C|D> - Jump to specific game endings");
      addConsoleLog("  /skipminigame - Skip and win active locker breathing minigames");
      break;

    case "triggerending":
      if (args.length >= 1) {
        const endingId = args[0].toUpperCase();
        if (["A", "B", "C", "D"].includes(endingId)) {
          triggerEnding(endingId);
          addConsoleLog(`Cheat: Triggering ending ${endingId}.`);
        } else {
          addConsoleLog("Cheat Error: Ending must be A, B, C, or D.");
        }
      } else {
        addConsoleLog("Usage: /triggerending <A|B|C|D>");
      }
      break;

    case "skipdecryption":
    case "sd":
      if (gameState === GameState.DECRYPTING) {
        handleDecryptionSuccess();
        addConsoleLog("Cheat: Decryption puzzle bypassed.");
      } else {
        addConsoleLog("Cheat Error: No active decryption terminal.");
      }
      break;

    case "showmap":
      const mapOverlay = document.getElementById("map-overlay");
      if (mapOverlay) {
        mapOverlay.style.display = mapOverlay.style.display === "block" ? "none" : "block";
        if (mapOverlay.style.display === "block") {
          setGameState(GameState.PAUSED);
          document.exitPointerLock?.();
          updateMapMarkers();
        } else {
          setGameState(GameState.PLAYING);
          requestPointerLock();
        }
        addConsoleLog("Toggled blueprint map overlay.");
      }
      break;

    case "unlockall":
      academicDoorUnlocked = true;
      addConsoleLog("Cheat: All security doors unlocked.");
      break;

    case "heartrate": {
      if (args.length === 0) {
        addConsoleLog("Error: Missing BPM value. Usage: /heartrate <bpm> [p1|p2]");
        break;
      }
      const val = parseFloat(args[0]);
      if (isNaN(val) || val < 40 || val > 220) {
        addConsoleLog("Usage: /heartrate <bpm> [p1|p2] (BPM between 40 and 220)");
      } else {
        const target = args[1] ? args[1].toLowerCase() : "both";
        if (target === "p1" || target === "player1" || target === "both") {
          p1HeartRate = val;
        }
        if (target === "p2" || target === "player2" || target === "both") {
          p2HeartRate = val;
        }
        addConsoleLog(`Heart rate set to ${val} BPM for target: ${target}`);
      }
      break;
    }

    case "skipminigame":
    case "sm":
      if (p1LockerMinigameActive) {
        p1LockerMinigameProgress = 100;
        p1LockerMinigameActive = false;
        fear = 0;
        p1Sanity = Math.min(100, p1Sanity + 20);
        caption.textContent = "Breathing minigame skipped (Win).";
        addConsoleLog("Skipped Player 1 breathing minigame.");
      }
      if (p2LockerMinigameActive) {
        p2LockerMinigameProgress = 100;
        p2LockerMinigameActive = false;
        fear2 = 0;
        p2Sanity = Math.min(100, p2Sanity + 20);
        caption.textContent = "Player 2 breathing minigame skipped (Win).";
        addConsoleLog("Skipped Player 2 breathing minigame.");
      }
      if (!p1LockerMinigameActive && !p2LockerMinigameActive) {
        addConsoleLog("No active breathing minigames to skip.");
      }
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

/**
 * AnimationStateMachine — shared state machine for all humanoid characters.
 * Owns: current state name, transition blend weight, and bone rotation targets.
 * Usage: new AnimationStateMachine(humanoidGroup).setState("walk")
 */
class AnimationStateMachine {
  static STATES = ["idle", "walk", "run", "reach", "hide", "death"];

  constructor(humanoid) {
    this.h = humanoid;
    this.state = "idle";
    this._blend = 0;
    this._time = 0;
  }

  setState(newState) {
    if (!AnimationStateMachine.STATES.includes(newState)) return;
    if (this.state !== newState) {
      this.state = newState;
      this._blend = 0;
    }
  }

  /** Call once per frame. dt = delta seconds, time = elapsed seconds */
  update(dt, time) {
    this._time = time;
    this._blend = Math.min(1, this._blend + dt * 6); // 6 = fast crossfade
    const d = this.h.userData;
    if (!d.hips) return;

    switch (this.state) {
      case "walk": {
        const c = time * 6.5;
        d.leftLeg.rotation.x = Math.sin(c) * 0.42;
        d.rightLeg.rotation.x = -Math.sin(c) * 0.42;
        if (d.leftArm) d.leftArm.rotation.x = -Math.sin(c) * 0.28;
        if (d.rightArm) d.rightArm.rotation.x = Math.sin(c) * 0.28;
        d.hips.position.y = 0.9 + Math.abs(Math.sin(c * 2)) * 0.04;
        break;
      }
      case "run": {
        const c = time * 9.5;
        d.leftLeg.rotation.x = Math.sin(c) * 0.58;
        d.rightLeg.rotation.x = -Math.sin(c) * 0.58;
        if (d.leftArm) d.leftArm.rotation.x = -Math.sin(c) * 0.42;
        if (d.rightArm) d.rightArm.rotation.x = Math.sin(c) * 0.42;
        d.hips.position.y = 0.9 + Math.abs(Math.sin(c * 2)) * 0.06;
        break;
      }
      case "reach": {
        if (d.leftArm) d.leftArm.rotation.x = -0.9;
        if (d.rightArm) d.rightArm.rotation.x = -0.9;
        d.leftLeg.rotation.x = 0;
        d.rightLeg.rotation.x = 0;
        d.hips.position.y = 0.9;
        break;
      }
      case "hide": {
        d.hips.position.y = 0.42;
        d.leftLeg.rotation.x = -0.8;
        d.rightLeg.rotation.x = -0.8;
        if (d.spine) d.spine.rotation.x = 0.35;
        break;
      }
      case "death": {
        d.hips.position.y = 0.1;
        d.hips.rotation.z = Math.PI / 2;
        d.leftLeg.rotation.x = 0;
        d.rightLeg.rotation.x = 0;
        break;
      }
      default: { // idle
        d.hips.position.y = 0.9 + Math.sin(time * 1.5) * 0.015;
        d.leftLeg.rotation.x = 0;
        d.rightLeg.rotation.x = 0;
        if (d.leftArm) d.leftArm.rotation.z = 0.08 + Math.sin(time * 1.5) * 0.02;
        if (d.rightArm) d.rightArm.rotation.z = -0.08 - Math.sin(time * 1.5) * 0.02;
      }
    }
  }
}

/**
 * updateMeeraAnimations — Meera Iyer (Antagonist) Animation State
 *
 * Deliberately "off" timing from the player walk cycle:
 * - Idle: slow asymmetric head-tilt sway, one shoulder raised
 * - Patrol: lurching walk at 0.6× normal frequency with uneven arm swing
 * - Chase: fast reaching stride with both arms extended forward
 */
/**
 * updateNpcSurvivorAnimations — Fellow Student NPC (Sam / survivor)
 *
 * States:
 *  "idle"   — nervous fidget: arms hugging torso, occasional glance left/right
 *  "follow" — normal scared walk, slightly hunched, shorter stride
 *  "flee"   — fast sprint with panicked uneven arm flail
 */
function updateNpcSurvivorAnimations(npc, state, time) {
  const d = npc.userData;
  if (!d.hips || !d.leftLeg || !d.rightLeg) return;

  if (state === "flee") {
    // Panic sprint: fast uneven stride, arms wild
    const c = time * 9.8;
    d.leftLeg.rotation.x = Math.sin(c) * 0.62;
    d.rightLeg.rotation.x = -Math.sin(c + 0.4) * 0.58; // slight phase offset
    if (d.leftArm) d.leftArm.rotation.x = -Math.sin(c) * 0.55;
    if (d.rightArm) d.rightArm.rotation.x = Math.sin(c + 0.2) * 0.48;
    if (d.leftArm) d.leftArm.rotation.z = Math.sin(c * 0.5) * 0.25;
    if (d.rightArm) d.rightArm.rotation.z = -Math.sin(c * 0.5) * 0.25;
    d.hips.position.y = 0.88 + Math.abs(Math.sin(c * 2)) * 0.07;
    // Hunch forward while running
    if (d.spine) d.spine.rotation.x = 0.18;

  } else if (state === "follow") {
    // Scared following walk — shorter stride, hunched shoulders
    const c = time * 5.5;
    d.leftLeg.rotation.x = Math.sin(c) * 0.30;
    d.rightLeg.rotation.x = -Math.sin(c) * 0.30;
    if (d.leftArm) d.leftArm.rotation.x = -Math.sin(c) * 0.18;
    if (d.rightArm) d.rightArm.rotation.x = Math.sin(c) * 0.18;
    // Arms hugging inward a bit
    if (d.leftArm) d.leftArm.rotation.z = 0.22;
    if (d.rightArm) d.rightArm.rotation.z = -0.22;
    d.hips.position.y = 0.89 + Math.abs(Math.sin(c * 2)) * 0.03;
    if (d.spine) d.spine.rotation.x = 0.08;

  } else {
    // Nervous idle: fidgeting, arms crossed, occasional head glance
    const s = time * 1.6;
    d.hips.position.y = 0.9 + Math.sin(s) * 0.012;
    d.leftLeg.rotation.x = 0;
    d.rightLeg.rotation.x = 0;
    // Arms crossed over torso
    if (d.leftArm) {
      d.leftArm.rotation.z = 0.35 + Math.sin(s * 1.2) * 0.04;
      d.leftArm.rotation.x = 0.28 + Math.sin(s * 0.8) * 0.03;
    }
    if (d.rightArm) {
      d.rightArm.rotation.z = -0.35 - Math.sin(s * 1.1) * 0.04;
      d.rightArm.rotation.x = 0.26 + Math.sin(s * 0.9) * 0.03;
    }
    // Occasional head glance: snaps left or right every ~3s
    if (d.neck) {
      d.neck.rotation.y = Math.sin(s * 0.4) * 0.22; // slow glance
      d.neck.rotation.x = 0.06;
    }
    if (d.spine) d.spine.rotation.x = 0.10; // slight hunch
  }
}

function updateMeeraAnimations(meera, state, time) {
  const d = meera.userData;
  if (!d.hips || !d.leftLeg || !d.rightLeg) return;

  if (state === AiState.INACTIVE || !meera.visible) return;

  if (state === AiState.CHASE) {
    // Sprint-reach: fast stride, arms out
    const cycle = time * 5.2;
    d.leftLeg.rotation.x = Math.sin(cycle) * 0.54;
    d.rightLeg.rotation.x = -Math.sin(cycle) * 0.54;
    d.leftArm.rotation.x = -0.85 + Math.sin(cycle * 0.7) * 0.15;  // arms reaching forward
    d.rightArm.rotation.x = -0.85 - Math.sin(cycle * 0.7) * 0.15;
    d.hips.position.y = 0.9 + Math.abs(Math.sin(cycle * 2)) * 0.05;
    // Neck tilts forward during chase (hunched)
    if (d.neck) d.neck.rotation.x = 0.28 + Math.sin(time * 3.1) * 0.04;
    if (d.neck) d.neck.rotation.z = -0.18;

  } else if (state === AiState.PATROL) {
    // Lurching walk: slow + uneven. Left/right legs out of phase by non-integer
    const cycleL = time * 2.3;
    const cycleR = time * 2.3 + 1.9; // asymmetric offset — not π, so it looks wrong
    d.leftLeg.rotation.x = Math.sin(cycleL) * 0.35;
    d.rightLeg.rotation.x = Math.sin(cycleR) * 0.35;
    // Arm swing also off-phase
    d.leftArm.rotation.x = Math.sin(cycleL + 0.9) * 0.2;
    d.rightArm.rotation.x = -Math.sin(cycleL + 0.9) * 0.2;
    d.hips.position.y = 0.88 + Math.abs(Math.sin(cycleL * 1.8)) * 0.03;
    // Slight head-loll
    if (d.neck) d.neck.rotation.z = Math.sin(time * 1.3) * 0.12 - 0.28;

  } else {
    // Idle sway: breathing rhythm is slower, head-tilt is asymmetric
    const s = time * 0.8;
    d.hips.position.y = 0.88 + Math.sin(s) * 0.018;
    d.leftArm.rotation.z = 0.12 + Math.sin(s * 1.1) * 0.04;
    d.rightArm.rotation.z = -0.35 - Math.sin(s * 0.9) * 0.04;  // one arm hangs lower
    if (d.neck) d.neck.rotation.z = -0.32 + Math.sin(s * 1.4) * 0.06;  // persistent tilt
    if (d.neck) d.neck.rotation.x = 0.18 + Math.sin(s * 0.7) * 0.03;
    d.leftLeg.rotation.x = 0;
    d.rightLeg.rotation.x = 0;
  }
}

function animate() {
  if (mainRendererContextLost) return;
  try {
    // try/catch wrapper added for error boundary tracking
    const delta = Math.min(clock.getDelta(), 0.05);
    updateMovement(delta);
    updateState(delta);
    updateRain(delta);
    updateThunder(delta);

  // Handle sanity creepy whispers looping audio triggers
  if (gameState === GameState.PLAYING) {
    if (p1Sanity < 50 || (coopMode && p2Sanity < 50)) {
      creepyWhisperTimer -= delta;
      if (creepyWhisperTimer <= 0) {
        creepyWhisperTimer = 16.0 + Math.random() * 12.0;
        if (audioManager) {
          audioManager.playSound("creepy_whispers", { volume: 0.8 });
        }
      }
    }

    // Shadow figures spawn logic
    shadowSpawnTimer -= delta;
    if (shadowSpawnTimer <= 0) {
      shadowSpawnTimer = 15.0 + Math.random() * 12.0;
      const targetSanity = coopMode ? Math.min(p1Sanity, p2Sanity) : p1Sanity;
      if (targetSanity < 45) {
        const activeCam = (coopMode && p2Sanity < p1Sanity && camera2) ? camera2 : camera;
        const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(activeCam.quaternion);
        forwardDir.y = 0;
        forwardDir.normalize();

        const spawnPos = activeCam.position.clone()
          .addScaledVector(forwardDir, 10.0 + Math.random() * 4.0);
        spawnPos.y = 1.1;

        const shadowGeo = new THREE.PlaneGeometry(0.75, 2.1);
        const shadowMat = new THREE.MeshBasicMaterial({
          color: 0x07020a,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.position.copy(spawnPos);
        shadowMesh.lookAt(activeCam.position.x, 1.1, activeCam.position.z);
        scene.add(shadowMesh);
        shadowFigures.push(shadowMesh);
      }
    }

    // Shadow figures update logic
    for (let i = shadowFigures.length - 1; i >= 0; i--) {
      const figure = shadowFigures[i];
      const dist1 = camera.position.distanceTo(figure.position);
      const dist2 = camera2 ? camera2.position.distanceTo(figure.position) : 9999;
      const minDist = Math.min(dist1, dist2);

      if (minDist < 5.0) {
        figure.material.opacity -= delta * 2.0;
      }
      
      const relativeZ1 = figure.position.z - camera.position.z;
      const relativeZ2 = camera2 ? (figure.position.z - camera2.position.z) : -999;
      const isBehind = relativeZ1 > 2.0 && relativeZ2 > 2.0;

      if (figure.material.opacity <= 0 || isBehind) {
        scene.remove(figure);
        shadowFigures.splice(i, 1);
        if (figure.material.opacity <= 0 && minDist < 5.0) {
          playWhisper();
          caption.textContent = "A cold breath whispers in your ear...";
        }
      }
    }
  }

  // Procedural bone skeletal updates
  const time = clock.elapsedTime;
  if (scene.userData.player1Character) {
    const speed = moveDirection.length();
    updateHumanoidAnimations(scene.userData.player1Character, speed, time);
  }
  if (player2Character) {
    const speed = moveDirection2.length();
    updateHumanoidAnimations(player2Character, speed, time);
  }
  if (samCharacter) {
    updateNpcSurvivorAnimations(samCharacter, samState, time);
  }
  if (scene.userData.meeraCharacter) {
    updateMeeraAnimations(scene.userData.meeraCharacter, meeraState, time);
  }
  if (apparitionGhost) {
    updateHumanoidAnimations(apparitionGhost, 0.2, time);
  }

  // Draw calls FPS telemetry
  logPerformanceTelemetry(delta);
  
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
      if (p1HeartRate > 80) {
        const shift = Math.min(1.0, (p1HeartRate - 90) / 80);
        filmPass.uniforms.redShiftAmount.value = shift * 0.5;
        filmPass.uniforms.desaturationAmount.value = shift * 0.65;
      } else {
        filmPass.uniforms.redShiftAmount.value = 0.0;
        filmPass.uniforms.desaturationAmount.value = 0.0;
      }
    }
    composer.render();
  }
  } catch (error) {
    console.error("Error in game loop:", error);
    if (fatalError) {
      fatalError.innerHTML = `
        <h2>An Error Occurred</h2>
        <p>A fatal error occurred in the game loop. Please check the console for details, or reload the page.</p>
        <button id="reload-btn" style="margin-top: 15px; padding: 8px 16px; background: #c9a56d; color: #080706; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">Reload Game</button>
      `;
      fatalError.hidden = false;
      document.getElementById("reload-btn")?.addEventListener("click", () => {
        window.location.reload();
      });
    }
    if (renderer) {
      renderer.setAnimationLoop(null);
    }
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
    scanlineAmount: { value: 0.04 },
    redShiftAmount: { value: 0.0 },
    desaturationAmount: { value: 0.0 }
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
    uniform float redShiftAmount;
    uniform float desaturationAmount;
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

      // Dynamic desaturation for horror tone
      float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(color.rgb, vec3(luma), 0.18 + desaturationAmount * 0.6);

      // Red shift for panic
      color.rgb = mix(color.rgb, vec3(color.r * 1.25, color.g * 0.7, color.b * 0.7), redShiftAmount);

      gl_FragColor = color;
    }
  `
};

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const filmPass = new ShaderPass(filmGrainShader);
composer.addPass(filmPass);



export function setupPlayer2() {
  if (!coopMode) return;
  
  camera2 = new THREE.PerspectiveCamera(camera.fov, (window.innerWidth / 2) / window.innerHeight, 0.1, 100);
  camera2.position.set(0.8, 1.7, 8);
  camera2.rotation.set(0, 0, 0);
  scene.add(camera2);

  camera.layers.enable(0);
  camera.layers.enable(1);
  
  camera2.layers.enable(0);
  camera2.layers.enable(2);
  camera2.userData.emfProp = buildEmfPropForP2();

  player2Character = createCharacter({ name: p2Name, position: [0.8, 0, 8], color: 0xffffff, identity: p2Model });
  player2Character.layers.set(1);
  player2Character.traverse(child => {
    if (child.isMesh) child.layers.set(1);
  });

  scene.userData.player1Character = createCharacter({
    name: p1Name,
    position: [0, 0, 8],
    color: 0xffffff,
    identity: p1Model,
    outfitColorOverride: p1OutfitColor,
    hairStyleOverride: p1HairStyle,
    hasGlassesOverride: p1HasGlasses,
    hasBackpackOverride: p1HasBackpack,
    skinColorOverride: p1SkinTone
  });

  let p1ScaleMult = 1.0;
  if (p1BodyScale === "short") p1ScaleMult = 0.88;
  else if (p1BodyScale === "tall") p1ScaleMult = 1.12;

  if (p1Model === "Sam") {
    scene.userData.player1Character.scale.set(1.08 * p1ScaleMult, 1.08 * p1ScaleMult, 1.08 * p1ScaleMult);
  } else if (p1Model === "Priya") {
    scene.userData.player1Character.scale.set(0.92 * p1ScaleMult, 0.94 * p1ScaleMult, 0.92 * p1ScaleMult);
  } else {
    scene.userData.player1Character.scale.set(1.0 * p1ScaleMult, 1.0 * p1ScaleMult, 1.0 * p1ScaleMult);
  }

  scene.userData.player1Character.layers.set(2);
  scene.userData.player1Character.traverse(child => {
    if (child.isMesh) child.layers.set(2);
  });

  player2Flashlight = new THREE.SpotLight(0xffecc2, 280.0, 30, Math.PI / 6.5, 0.6, 1.0);
  player2Flashlight.castShadow = true;
  player2Flashlight.map = createFlashlightCookie();

  const beamMesh2 = createFlashlightBeam();
  player2Flashlight.add(beamMesh2);
  player2Flashlight.userData.beamMesh = beamMesh2;

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

export function startGame({ lockPointer = true } = {}) {
  initAudio();
  setupPlayer2();
  initCoopKeyHandlers();
  document.body.classList.toggle("coop-active", coopMode);
  setupUiSounds();
  buildRainSystem();
  runStartTime = Date.now();
  statStaminaDrained = 0;
  statTimesHidden = 0;
  statCansThrown = 0;
  statFearPeak = 0;
  
  if (hardcoreMode) {
    meeraSpeedMultiplier = 1.4;
    const hardcoreNotes = [
      { title: "Maintenance Fuse Notice", body: "Block A backup grid rerouted to Laboratory Room 2A. Do not adjust fuses. — Chief Warden, 2019." },
      { title: "Torn Lab Page", body: "Subject M has stopped eating. She says something counts on the walls at night. We continue." },
      { title: "Meera's Wall Scrawl", body: "The metronome doesn't need power. It never did. — M.I." },
      { title: "Burned Safety Notice", body: "All Applied Cognition experiments suspended pending ethics review. Files to be sealed until 2025. Access revoked. — Dean's Office, 2005." },
      { title: "Dean's Secret Memo", body: "Kulkarni, the Ministry is questioning the volunteer registry. We cannot account for Meera Iyer's academic status. Erase all records from the Block A local server immediately." },
      { title: "Dr. Verma's Confession Tape", body: "Verification of Subject M's isolation timeline reveals multiple breaches in the trial logs. Verma confessed to forging data parameters. The patient's state is persistent." },
      { title: "Meera's Diary Page", body: "October 12, 2004. The noise in the walls isn't random. It's a sequence. 42, 18, 5, 0... If I stop counting, the doors stay locked. If I sleep, they change the sequence." },
      { title: "Capstone Project Report", body: "Ravenswood Capstone 2026 - Aarav Mehta. Topic: Neural Synchronization via Low-Frequency Audio Stimuli. Notes: The backup grid in Block A still hums at 12Hz, exactly matching the target frequency from the 2004 experiments." }
    ];
    hardcoreNotes.forEach(n => {
      readLoreNotes.add(n.title);
      collectedDocuments.set(n.title, n.body);
    });
    if (hardcoreBadge) hardcoreBadge.style.display = "flex";
  } else {
    meeraSpeedMultiplier = 1.0;
    if (hardcoreBadge) hardcoreBadge.style.display = "none";
  }

  // Spawn solo player character only when NOT in coop mode
  // (In coop mode, setupPlayer2() already created player1Character)
  if (!coopMode && !scene.userData.player1Character) {
    scene.userData.player1Character = createCharacter({
      name: p1Name,
      position: [0, 0, 8],
      color: 0xffffff,
      identity: p1Model,
      outfitColorOverride: p1OutfitColor,
      hairStyleOverride: p1HairStyle,
      hasGlassesOverride: p1HasGlasses,
      hasBackpackOverride: p1HasBackpack,
      skinColorOverride: p1SkinTone
    });

    let scaleMult = 1.0;
    if (p1BodyScale === "short") scaleMult = 0.88;
    else if (p1BodyScale === "tall") scaleMult = 1.12;

    if (p1Model === "Sam") {
      scene.userData.player1Character.scale.set(1.08 * scaleMult, 1.08 * scaleMult, 1.08 * scaleMult);
    } else if (p1Model === "Priya") {
      scene.userData.player1Character.scale.set(0.92 * scaleMult, 0.94 * scaleMult, 0.92 * scaleMult);
    } else {
      scene.userData.player1Character.scale.set(1.0 * scaleMult, 1.0 * scaleMult, 1.0 * scaleMult);
    }

    // In solo mode hide the own-body mesh from the first-person camera
    scene.userData.player1Character.traverse(child => {
      if (child.isMesh) child.layers.enable(0);
    });
    scene.add(scene.userData.player1Character);
  }

  startScreen.classList.add("hidden");
  setGameState(GameState.PLAYING);
  if (lockPointer) requestPointerLock();
  caption.textContent = "WASD move. Mouse or arrow keys look. E inspects. F toggles the flashlight.";
  updateObjectivesSystem();
  addTaskLog("Entered Block A after the midnight power reroute.");
  playTone(33, 1.4, 0.09, "sawtooth");
  playIntroDialogue();
}

export function requestPointerLock() {
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
    setGameState(GameState.PAUSED);
    document.exitPointerLock?.();
  } else if (gameState === GameState.PAUSED) {
    setGameState(GameState.PLAYING);
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

export function triggerGameOver(reason) {
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
  activeEndingPath = endingId;
  setGameState(GameState.WIN);
  document.exitPointerLock?.();
  
  let unlocked = JSON.parse(localStorage.getItem("ms_unlocked_endings") || "[]");
  if (!unlocked.includes(endingId)) {
    unlocked.push(endingId);
    localStorage.setItem("ms_unlocked_endings", JSON.stringify(unlocked));
  }
  
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
  const docsCollected = readLoreNotes.size;

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
    const runBadge = hardcoreMode 
      ? `<div style="color: #ff3b30; font-weight: bold; text-align: center; border: 1px solid #ff3b30; padding: 6px; border-radius: 4px; margin-bottom: 8px; font-size: 0.8rem; background: rgba(255, 59, 48, 0.15); animation: pulse-red 2s infinite; box-sizing: border-box;">NIGHTMARE RUN SUCCESSFUL</div>`
      : "";
    winStats.innerHTML = `
<div style="text-align: left; background: rgba(14, 11, 9, 0.95); padding: 16px; border: 1px solid #584435; border-radius: 6px; display: flex; flex-direction: column; gap: 8px; font-family: monospace; color: #d8c39f; font-size: 0.82rem; width: 100%; box-sizing: border-box; margin-top: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.8);">
  ${runBadge}
  <div style="color: #ffc87a; font-weight: bold; font-size: 0.9rem; text-align: center; border-bottom: 1px solid #584435; padding-bottom: 6px; margin-bottom: 6px;">RUN SCOREBOARD</div>
  <div style="display: flex; justify-content: space-between;"><span>ESCAPE TIME:</span><span style="color: #73d08a;">${speedrunDuration}s</span></div>
  <div style="display: flex; justify-content: space-between;"><span>LORE COLLECTED:</span><span style="color: #73d08a;">${docsCollected}/8</span></div>
  <div style="display: flex; justify-content: space-between;"><span>TIMES HID IN CABINETS:</span><span style="color: #73d08a;">${statTimesHidden}</span></div>
  <div style="display: flex; justify-content: space-between;"><span>DISTRACTIONS THROWN:</span><span style="color: #73d08a;">${statCansThrown}</span></div>
  <div style="display: flex; justify-content: space-between;"><span>MAX PEAK FEAR:</span><span style="color: #73d08a;">${Math.round(statFearPeak)}%</span></div>
  <div style="display: flex; justify-content: space-between;"><span>STAMINA EXHAUSTED:</span><span style="color: #73d08a;">${Math.round(statStaminaDrained)} units</span></div>
  <div style="border-top: 1px dashed rgba(88, 68, 53, 0.4); margin: 6px 0;"></div>
  <div style="color: #73d08a; font-weight: bold; text-align: center;">ALL-TIME BESTS</div>
  <div style="display: flex; justify-content: space-between;"><span>FASTEST ESCAPE:</span><span style="color: #ffc87a;">${bestTime}s</span></div>
  <div style="display: flex; justify-content: space-between;"><span>MAX COLLECTED LORE:</span><span style="color: #ffc87a;">${bestDocs}/8</span></div>
</div>
    `;
  }
}

export function resetGame() {
  if (tapeSoundInstance) {
    try {
      tapeSoundInstance.stop();
    } catch (e) {}
    tapeSoundInstance = null;
  }
  tapeRecorderPlaying = false;
  if (taskLogList) taskLogList.innerHTML = "";

  if (emfActive) setEmfActive(false);
  if (emfActive2) setEmfActive2(false);
  emfLevel = 1;
  emfLevel2 = 1;
  emfTickTimer = 0;
  emfTickTimer2 = 0;

  p1Sanity = 100;
  p2Sanity = 100;
  p1Pills = 0;
  p2Pills = 0;
  p1HeartRate = 72;
  p2HeartRate = 72;
  p1LockerMinigameActive = false;
  p2LockerMinigameActive = false;
  p1LockerMinigameProgress = 0;
  p2LockerMinigameProgress = 0;
  ecgSensorsCollected = false;

  if (p1HeartbeatSlowNode) { try { p1HeartbeatSlowNode.stop(); } catch(e) {} p1HeartbeatSlowNode = null; }
  if (p1HeartbeatFastNode) { try { p1HeartbeatFastNode.stop(); } catch(e) {} p1HeartbeatFastNode = null; }
  if (p2HeartbeatSlowNode) { try { p2HeartbeatSlowNode.stop(); } catch(e) {} p2HeartbeatSlowNode = null; }
  if (p2HeartbeatFastNode) { try { p2HeartbeatFastNode.stop(); } catch(e) {} p2HeartbeatFastNode = null; }

  shadowSpawnTimer = 0;
  creepyWhisperTimer = 0;
  shadowFigures.forEach(f => {
    scene.remove(f);
    disposeObject3D(f);
  });
  shadowFigures = [];

  const sanity1Val = document.getElementById("sanity-p1-val");
  const sanity1Meter = document.getElementById("sanity-p1-meter");
  const sanity2Val = document.getElementById("sanity-p2-val");
  const sanity2Meter = document.getElementById("sanity-p2-meter");
  const pills1Count = document.getElementById("pills-p1-count");
  const pills2Count = document.getElementById("pills-p2-count");

  if (sanity1Val) sanity1Val.textContent = "100%";
  if (sanity1Meter) sanity1Meter.value = 100;
  if (sanity2Val) sanity2Val.textContent = "100%";
  if (sanity2Meter) sanity2Meter.value = 100;
  if (pills1Count) pills1Count.textContent = "0";
  if (pills2Count) pills2Count.textContent = "0";

  const sanity1Panel = document.getElementById("sanity-p1-panel");
  const sanity2Panel = document.getElementById("sanity-p2-panel");
  if (sanity1Panel) sanity1Panel.classList.remove("critical-sanity");
  if (sanity2Panel) sanity2Panel.classList.remove("critical-sanity");

  if (camera2) {
    scene.remove(camera2);
    camera2 = null;
  }
  if (player2Character) {
    scene.remove(player2Character);
    disposeObject3D(player2Character);
    player2Character = null;
  }
  if (scene.userData.player1Character) {
    scene.remove(scene.userData.player1Character);
    disposeObject3D(scene.userData.player1Character);
    scene.userData.player1Character = null;
  }
  player2Keys.clear();
  const hudP2 = document.querySelector("#hud-p2");
  if (hudP2) hudP2.style.display = "none";

  const bMinigameP1 = document.getElementById("breath-minigame-p1");
  if (bMinigameP1) bMinigameP1.style.display = "none";
  const bMinigameP2 = document.getElementById("breath-minigame-p2");
  if (bMinigameP2) bMinigameP2.style.display = "none";

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

  disposeLevel();

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
    ecgSensorsCollected = activeCheckpoint.ecgSensorsCollected || false;
    
    libraryFoldersCollected = new Set(activeCheckpoint.libraryFoldersCollected || []);
    academicDoorUnlocked = activeCheckpoint.academicDoorUnlocked || false;
    searchedCabinets = new Set(activeCheckpoint.searchedCabinets || []);
    decryptedLogsCount = activeCheckpoint.decryptedLogsCount || 0;
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
    libraryFoldersCollected.clear();
    searchedCabinets.clear();
    academicDoorUnlocked = false;
    keypadInput = "";
    decryptedLogsCount = 0;
    activeEndingPath = null;
    
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

// Folder tabs triggers
const tabAudio = document.querySelector("#tab-audio");
const tabGraphics = document.querySelector("#tab-graphics");
const tabControls = document.querySelector("#tab-controls");
const panelAudio = document.querySelector("#panel-audio");
const panelGraphics = document.querySelector("#panel-graphics");
const panelControls = document.querySelector("#panel-controls");

function setActiveTab(activeTab, activePanel) {
  [tabAudio, tabGraphics, tabControls].forEach(btn => btn?.classList.remove("active"));
  [panelAudio, panelGraphics, panelControls].forEach(pnl => pnl?.classList.remove("active"));
  activeTab?.classList.add("active");
  activePanel?.classList.add("active");
  playPaperRustle();
}

tabAudio?.addEventListener("click", () => setActiveTab(tabAudio, panelAudio));
tabGraphics?.addEventListener("click", () => setActiveTab(tabGraphics, panelGraphics));
tabControls?.addEventListener("click", () => setActiveTab(tabControls, panelControls));

// Delegate click sounds to all buttons in DOM
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    playPinClick();
  });
  btn.addEventListener("pointerenter", () => {
    playPaperRustle();
  });
});

initCustomizationListeners({
  onConfirm: (customizations) => {
    p1Model = customizations.p1.model;
    p1OutfitColor = customizations.p1.outfitColor;
    p1HairStyle = customizations.p1.hairStyle;
    p1BodyScale = customizations.p1.bodyScale;
    p1HasGlasses = customizations.p1.hasGlasses;
    p1HasBackpack = customizations.p1.hasBackpack;
    p1SkinTone = customizations.p1.skinTone;

    playerCustomizationState.p1Model = p1Model;
    playerCustomizationState.p1OutfitColor = p1OutfitColor;
    playerCustomizationState.p1HairStyle = p1HairStyle;
    playerCustomizationState.p1BodyScale = p1BodyScale;
    playerCustomizationState.p1HasGlasses = p1HasGlasses;
    playerCustomizationState.p1HasBackpack = p1HasBackpack;
    playerCustomizationState.p1SkinTone = p1SkinTone;

    p1Customization = {
      model: p1Model,
      outfitColor: p1OutfitColor,
      hairStyle: p1HairStyle,
      bodyScale: p1BodyScale,
      hasGlasses: p1HasGlasses,
      hasBackpack: p1HasBackpack,
      skinTone: p1SkinTone
    };

    localStorage.setItem("setting-p1-customization", JSON.stringify(p1Customization));
    localStorage.setItem("setting-p1-model", p1Model);
    localStorage.setItem("setting-p1-outfit-color", p1OutfitColor);
    localStorage.setItem("setting-p1-hair-style", p1HairStyle);

    if (coopMode) {
      p2Model = customizations.p2.model;
      p2OutfitColor = customizations.p2.outfitColor;
      p2HairStyle = customizations.p2.hairStyle;
      p2BodyScale = customizations.p2.bodyScale;
      p2HasGlasses = customizations.p2.hasGlasses;
      p2HasBackpack = customizations.p2.hasBackpack;
      p2SkinTone = customizations.p2.skinTone;

      playerCustomizationState.p2Model = p2Model;
      playerCustomizationState.p2OutfitColor = p2OutfitColor;
      playerCustomizationState.p2HairStyle = p2HairStyle;
      playerCustomizationState.p2BodyScale = p2BodyScale;
      playerCustomizationState.p2HasGlasses = p2HasGlasses;
      playerCustomizationState.p2HasBackpack = p2HasBackpack;
      playerCustomizationState.p2SkinTone = p2SkinTone;

      p2Customization = {
        model: p2Model,
        outfitColor: p2OutfitColor,
        hairStyle: p2HairStyle,
        bodyScale: p2BodyScale,
        hasGlasses: p2HasGlasses,
        hasBackpack: p2HasBackpack,
        skinTone: p2SkinTone
      };

      localStorage.setItem("setting-p2-customization", JSON.stringify(p2Customization));
      localStorage.setItem("setting-p2-model", p2Model);
    }

    resetGame();
    startGame();
  }
});

if (new URLSearchParams(window.location.search).has("vr")) {
  setupVrEntry();
}
renderer.setAnimationLoop(animate);



startButton.addEventListener("click", () => {
  activeCheckpoint = null;
  localStorage.removeItem("ms_active_checkpoint");
  if (continueButton) continueButton.style.display = "none";
  hardcoreMode = false;
  coopMode = false;
  startScreen.classList.add("hidden");
  if (charSelectScreen) {
    charSelectScreen.style.display = "block";
    charSelectScreen.classList.add("open");
  }
  characterSelectState.charSelectActive = true;
  initCharacterSelect();
  animateCharacterSelect();
});
startPlusButton?.addEventListener("click", () => {
  activeCheckpoint = null;
  localStorage.removeItem("ms_active_checkpoint");
  if (continueButton) continueButton.style.display = "none";
  hardcoreMode = true;
  coopMode = false;
  startScreen.classList.add("hidden");
  if (charSelectScreen) {
    charSelectScreen.style.display = "block";
    charSelectScreen.classList.add("open");
  }
  characterSelectState.charSelectActive = true;
  initCharacterSelect();
  animateCharacterSelect();
});
coopButton.addEventListener("click", () => {
  activeCheckpoint = null;
  localStorage.removeItem("ms_active_checkpoint");
  if (continueButton) continueButton.style.display = "none";
  hardcoreMode = false;
  coopMode = true;
  startScreen.classList.add("hidden");
  if (charSelectScreen) {
    charSelectScreen.style.display = "block";
    charSelectScreen.classList.add("open");
  }
  characterSelectState.charSelectActive = true;
  initCharacterSelect();
  animateCharacterSelect();
});

const tabP1 = document.getElementById("btn-tab-p1");
const tabP2 = document.getElementById("btn-tab-p2");

tabP1?.addEventListener("click", () => {
  if (characterSelectState.activeEditingPlayer === 1) return;
  characterSelectState.activeEditingPlayer = 1;
  tabP2?.classList.remove("active");
  tabP1?.classList.add("active");
  updateSwatchHighlights();
  updatePreviewModel();
});

tabP2?.addEventListener("click", () => {
  if (characterSelectState.activeEditingPlayer === 2) return;
  characterSelectState.activeEditingPlayer = 2;
  tabP1?.classList.remove("active");
  tabP2?.classList.add("active");
  updateSwatchHighlights();
  updatePreviewModel();
});

const btnCharLight = document.getElementById("btn-char-light");
btnCharLight?.addEventListener("click", () => {
  if (characterSelectState.selectLightingMode === "night") {
    characterSelectState.selectLightingMode = "day";
    if (btnCharLight) btnCharLight.textContent = "🌙 NIGHTLIGHT MODE";
    if (characterSelectState.selectAmbientLight) {
      characterSelectState.selectAmbientLight.intensity = 1.1;
      characterSelectState.selectAmbientLight.color.setHex(0xffffff);
    }
    if (characterSelectState.selectPointLight) {
      characterSelectState.selectPointLight.intensity = 2.5;
      characterSelectState.selectPointLight.color.setHex(0xffffff);
    }
  } else {
    characterSelectState.selectLightingMode = "night";
    if (btnCharLight) btnCharLight.textContent = "☀️ DAYLIGHT MODE";
    if (characterSelectState.selectAmbientLight) {
      characterSelectState.selectAmbientLight.intensity = 0.45;
      characterSelectState.selectAmbientLight.color.setHex(0xffecd9);
    }
    if (characterSelectState.selectPointLight) {
      characterSelectState.selectPointLight.intensity = 1.8;
      characterSelectState.selectPointLight.color.setHex(0xfff5d9);
    }
  }
});

function enableKeyboardNavForContainer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.addEventListener("keydown", (e) => {
    const buttons = Array.from(container.querySelectorAll("button, input[type='range']"));
    const activeEl = document.activeElement;
    if (!buttons.includes(activeEl)) return;

    const index = buttons.indexOf(activeEl);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % buttons.length;
      buttons[nextIndex].focus();
      if (buttons[nextIndex].tagName === "BUTTON") {
        buttons[nextIndex].click();
      }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + buttons.length) % buttons.length;
      buttons[prevIndex].focus();
      if (buttons[prevIndex].tagName === "BUTTON") {
        buttons[prevIndex].click();
      }
    }
  });
}

enableKeyboardNavForContainer("coop-player-tabs");
enableKeyboardNavForContainer("variant-tabs-container");
enableKeyboardNavForContainer("outfit-swatches");
enableKeyboardNavForContainer("skin-swatches");
enableKeyboardNavForContainer("hair-swatches");

continueButton?.addEventListener("click", () => {
  coopMode = false;
  // Restore saved character directly from localStorage — skip the select screen
  try {
    const saved = localStorage.getItem("setting-p1-customization");
    if (saved) {
      p1Customization = sanitizeCustomization(JSON.parse(saved), "Aarav");
    } else {
      const legacy = {
        model: localStorage.getItem("setting-p1-model"),
        outfitColor: localStorage.getItem("setting-p1-outfit-color"),
        hairStyle: localStorage.getItem("setting-p1-hair-style")
      };
      p1Customization = sanitizeCustomization(legacy, "Aarav");
    }
  } catch (e) {
    console.error("Failed to restore character customization in continue flow", e);
  }

  p1Model = p1Customization.model;
  p1OutfitColor = p1Customization.outfitColor;
  p1HairStyle = p1Customization.hairStyle;
  p1BodyScale = p1Customization.bodyScale;
  p1HasGlasses = p1Customization.hasGlasses;
  p1HasBackpack = p1Customization.hasBackpack;
  p1SkinTone = p1Customization.skinTone;

  startScreen.classList.add("hidden");
  resetGame();
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
let isMouseDownOnCanvas = false;
let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener("mousedown", (e) => {
  isMouseDownOnCanvas = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

window.addEventListener("mouseup", () => {
  isMouseDownOnCanvas = false;
});

canvas.addEventListener("click", () => {
  if (gameState === GameState.PAUSED) {
    togglePause();
  } else if (gameState === GameState.PLAYING) {
    requestPointerLock();
  }
});

let pointerWasLocked = false;

document.addEventListener("pointerlockchange", () => {
  const isCurrentlyLocked = document.pointerLockElement === canvas;
  if (isCurrentlyLocked) {
    pointerLocked = true;
    pointerWasLocked = true;
    document.body.style.cursor = "none";
    caption.textContent = "Mouse look enabled. WASD move, E interact, F flashlight.";
    if (gameState === GameState.PAUSED) {
      setGameState(GameState.PLAYING);
    }
  } else {
    pointerLocked = false;
    document.body.style.cursor = "auto";
    if (pointerWasLocked) {
      pointerWasLocked = false;
      caption.textContent = "Pointer unlocked. Click scene to relock or drag mouse/WASD to play.";
    }
  }
});

document.addEventListener("pointerlockerror", () => {
  pointerLocked = false;
  pointerWasLocked = false;
  document.body.style.cursor = "auto";
  caption.textContent = "Pointer lock inactive. Click & drag mouse or use WASD/Arrows to play.";
});

document.addEventListener("mousemove", (event) => {
  if (gameState !== GameState.PLAYING || debugConsoleOpen) return;

  if (pointerLocked) {
    yaw -= event.movementX * 0.0022 * mouseSensitivity;
    pitch += (invertMouseLook ? 1 : -1) * event.movementY * 0.002 * mouseSensitivity;
    pitch = THREE.MathUtils.clamp(pitch, -1.1, 1.1);
    gameplayState.yaw = yaw;
    gameplayState.pitch = pitch;
    camera.rotation.set(pitch, yaw, 0, "YXZ");
  } else if (isMouseDownOnCanvas) {
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    yaw -= deltaX * 0.003 * mouseSensitivity;
    pitch += (invertMouseLook ? 1 : -1) * deltaY * 0.003 * mouseSensitivity;
    pitch = THREE.MathUtils.clamp(pitch, -1.1, 1.1);
    gameplayState.yaw = yaw;
    gameplayState.pitch = pitch;
    camera.rotation.set(pitch, yaw, 0, "YXZ");
  }
});

function checkDecryptionAlignment() { // Sync minigame status
  if (gameState !== GameState.DECRYPTING) return;
  const diff = Math.abs(decryptIndicatorPos - decryptTargetPos);
  if (diff <= 10) {
    decryptProgress = Math.min(100, decryptProgress + 25);
    const progressMeter = document.getElementById("decrypt-progress");
    if (progressMeter) progressMeter.value = decryptProgress;
    const statusText = document.getElementById("decrypt-status-text");
    if (statusText) statusText.textContent = `ALIGNMENT OK. SIGNAL SYNCED: ${decryptProgress}%`;
    if (audioManager) audioManager.playSound("terminal_beep", { volume: 0.6 });
    decryptTargetPos = 15 + Math.random() * 70;
    decryptSpeedMultiplier = 1.0 + (decryptProgress / 100) * 0.5;
    if (decryptProgress >= 100) {
      handleDecryptionSuccess();
    }
  } else {
    decryptProgress = Math.max(0, decryptProgress - 15);
    const progressMeter = document.getElementById("decrypt-progress");
    if (progressMeter) progressMeter.value = decryptProgress;
    const statusText = document.getElementById("decrypt-status-text");
    if (statusText) statusText.textContent = `SYNC ERROR! DEVIATION DETECTED.`;
    if (audioManager) audioManager.playSound("decrypt_failure", { volume: 0.5 });
  }
}

export function updateMapMarkers() {
  const p1Marker = document.getElementById("map-player-marker");
  if (p1Marker) {
    p1Marker.style.display = "block";
    const zPct = ((camera.position.z - (-48)) / 60) * 100;
    const xPct = ((camera.position.x - (-3)) / 6) * 100;
    p1Marker.style.top = `${100 - zPct}%`;
    p1Marker.style.left = `${xPct}%`;
  }
  const p2Marker = document.getElementById("map-player2-marker");
  if (p2Marker && coopMode && camera2) {
    p2Marker.style.display = "block";
    const zPct2 = ((camera2.position.z - (-48)) / 60) * 100;
    const xPct2 = ((camera2.position.x - (-3)) / 6) * 100;
    p2Marker.style.top = `${100 - zPct2}%`;
    p2Marker.style.left = `${xPct2}%`;
  } else if (p2Marker) {
    p2Marker.style.display = "none";
  }
}

function handleSecurityOverrideFailure() {
  keypadInput = "";
  const display = document.getElementById("keypad-display");
  if (display) {
    display.value = "ERROR";
    display.classList.add("shake-error");
    window.setTimeout(() => {
      display.value = "";
      display.classList.remove("shake-error");
    }, 800);
  }
  if (audioManager) audioManager.playSound("decrypt_failure", { volume: 0.6 });
  caption.textContent = "ACCESS DENIED. INVALID PASSCODE.";
}

function handleSecurityOverrideSuccess() {
  academicDoorUnlocked = true;
  caption.textContent = "PASSCODE ACCEPTED. ACADEMIC ANCHOR BYPASS ONLINE.";
  if (audioManager) {
    audioManager.playSound("decrypt_success", { volume: 0.6 });
    audioManager.playSound("door_unlock_beep", { volume: 0.5 }); // Play unlock beep
  }
  const display = document.getElementById("keypad-display");
  if (display) display.value = "OPEN";
  addTaskLog("Classroom Annex override accepted.");
}

function triggerKulkarniLibraryDialogue() {
  queueStory([
    ["Professor Kulkarni", "Aarav, is that the library annex? Be careful in those files."],
    ["Aarav", "Professor, the filing cabinets contain research folders from 2004. They are encrypted."],
    ["Professor Kulkarni", "The decryption terminal is still wired. Do not upload them to the mainframe. Hand them over to me... for security reasons."]
  ]);
}

function handleDecryptionSuccess() {
  setGameState(GameState.PLAYING);
  document.exitPointerLock?.();
  if (audioManager) audioManager.playSound("decrypt_success", { volume: 0.7 });
  decryptedLogsCount++;
  let title = "Cognitive Research Confession";
  let text = "Subject M trial logs. Dr. Verma confesses to covering up Meera's sensory lock state.";
  if (decryptedLogsCount === 1) {
    title = "Cognitive Research Confession";
    text = "SUBJECT_M_2004 LOG: Dr. Verma confesses to covering up Meera's sensory lock state. 'She is still in the loop. The metronome holds the anchor.'";
  } else {
    title = "Applied Cognition Incident Report";
    text = "INCIDENT REPORT 2005: The board recommends immediate sealing of Block A basement. Disciplinary actions against Dr. Verma are shelved to protect the institution.";
  }
  collectedDocuments.set(title, text);
  inspected++;
  caption.textContent = `Successfully Decrypted: ${title}! Added to Case Archive.`;
  addTaskLog(`Decrypted: ${title}.`);
  updateObjectivesSystem();
  const modal = document.getElementById("decryptor-terminal-modal");
  if (modal) modal.style.display = "none";
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && gameState === GameState.DECRYPTING) {
    event.preventDefault();
    checkDecryptionAlignment();
    return;
  }
  if (event.code === "Space" && p1LockerMinigameActive) {
    event.preventDefault();
    checkBreathingMinigameHitP1();
    return;
  }
  if (event.code === "Period" && p2DecryptingActive) {
    event.preventDefault();
    checkDecryptionAlignment();
    p2DecryptingActive = false;
    return;
  }
  if (event.code === "Period" && p2LockerMinigameActive) {
    event.preventDefault();
    checkBreathingMinigameHitP2();
    return;
  }

  // SUBTITLE DIALOGUE KEYBOARD PROGRESSION (while locked)
  if (dialogue.classList.contains("open")) {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      showNextStoryLine();
      return;
    }
  }

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
  
  const p2Codes = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Period", "Slash", "ShiftRight", "KeyO", "KeyP"];
  if (coopMode && p2Codes.includes(event.code)) {
    player2Keys.add(event.code);
    if (event.code === "Period") {
      toggleFlashlight2();
    }
    if (event.code === "KeyO") {
      setEmfActive2(!emfActive2);
    }
    if (event.code === "KeyP") {
      consumePill2();
    }
    if (event.code === "ShiftRight") {
      inspectNearest2();
    }
  } else {
    keys.add(event.code);
    if (event.code === "KeyF") {
      toggleFlashlight();
    }
    if (event.code === "KeyQ") {
      setEmfActive(!emfActive);
    }
    if (event.code === "KeyC") {
      consumePill1();
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
const decryptBtn = document.getElementById("decrypt-align-btn");
decryptBtn?.addEventListener("click", () => {
  checkDecryptionAlignment();
});
const closeDecryptBtn = document.getElementById("close-decryptor");
closeDecryptBtn?.addEventListener("click", () => {
  setGameState(GameState.PLAYING);
  const modal = document.getElementById("decryptor-terminal-modal");
  if (modal) modal.style.display = "none";
  requestPointerLock();
});

// Wire menu click sounds
document.querySelectorAll(".paper-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (audioManager) audioManager.playSound("button_click", { volume: 0.4 });
  });
});

// Wire numeric keypad buttons
document.querySelectorAll(".keypad-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (keypadInput.length < 4) {
      keypadInput += e.target.textContent;
      const display = document.getElementById("keypad-display");
      if (display) display.value = keypadInput;
      if (audioManager) audioManager.playSound("button_click", { volume: 0.35 });
    }
  });
});
const clearBtn = document.getElementById("keypad-clear");
clearBtn?.addEventListener("click", () => {
  keypadInput = "";
  const display = document.getElementById("keypad-display");
  if (display) display.value = "";
  if (audioManager) audioManager.playSound("button_click", { volume: 0.35 });
});

const enterBtn = document.getElementById("keypad-enter");
enterBtn?.addEventListener("click", () => {
  if (keypadInput === "4812") {
    handleSecurityOverrideSuccess();
  } else {
    handleSecurityOverrideFailure();
  }
});

const switchBtn = document.getElementById("cctv-switch-btn");
switchBtn?.addEventListener("click", () => {
  currentCctvCam = currentCctvCam === 3 ? 1 : currentCctvCam + 1;
  const label = document.getElementById("cctv-label");
  if (label) label.textContent = cctvCameras[currentCctvCam - 1].label;
  if (audioManager) audioManager.playSound("camera_switch", { volume: 0.4 });
});
const closeSecurityBtn = document.getElementById("close-security");
closeSecurityBtn?.addEventListener("click", () => {
  const modal = document.getElementById("security-terminal-modal");
  if (modal) modal.style.display = "none";
  setGameState(GameState.PLAYING);
  requestPointerLock();
});

const closeMapBtn = document.getElementById("close-map-btn");
closeMapBtn?.addEventListener("click", () => { // Register closeMapBtn
  const mapModal = document.getElementById("map-overlay");
  if (mapModal) mapModal.style.display = "none";
  setGameState(GameState.PLAYING);
  requestPointerLock();
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
  if (audioManager) {
    audioManager.setMasterVolume(masterVolume);
  }
});

settingSfxVolume.addEventListener("input", (event) => {
  sfxVolume = parseFloat(event.target.value);
  localStorage.setItem("setting-sfx-volume", sfxVolume);
  caption.textContent = `SFX Volume: ${Math.round(sfxVolume * 100)}%`;
  if (audioManager) {
    audioManager.setSFXVolume(sfxVolume);
  }
});

settingAmbientVolume.addEventListener("input", (event) => {
  ambientVolume = parseFloat(event.target.value);
  localStorage.setItem("setting-ambient-volume", ambientVolume);
  caption.textContent = `Ambient Volume: ${Math.round(ambientVolume * 100)}%`;
  if (audioManager) {
    audioManager.setAmbientVolume(ambientVolume);
  }
});

  const settingVignette = document.getElementById("setting-vignette-scale");
  settingVignette?.addEventListener("input", (event) => {
    vignetteScale = parseFloat(event.target.value);
    const vignetteEl = document.getElementById("vignette");
    if (vignetteEl) vignetteEl.style.boxShadow = `inset 0 0 ${200 * vignetteScale}px rgba(0,0,0,0.95)`;
  });

  const settingContrast = document.getElementById("setting-contrast");
  settingContrast?.addEventListener("input", (event) => {
    screenContrast = parseFloat(event.target.value);
    canvas.style.filter = `contrast(${screenContrast})`;
  });

settingMouseSensitivity?.addEventListener("input", (event) => {
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

settingSubtitles.addEventListener("change", (event) => {
  subtitlesEnabled = event.target.checked;
  localStorage.setItem("setting-subtitles", subtitlesEnabled);
  caption.textContent = `Subtitles: ${subtitlesEnabled ? "Enabled" : "Disabled"}`;
  if (!subtitlesEnabled) {
    dialogue.classList.remove("open");
  }
});

settingCamShake.addEventListener("input", (event) => {
  camShakeMultiplier = parseFloat(event.target.value);
  localStorage.setItem("setting-cam-shake", camShakeMultiplier);
  caption.textContent = `Camera Shake scale: ${Math.round(camShakeMultiplier * 100)}%`;
});

settingInvertMouse.addEventListener("change", (event) => {
  invertMouseLook = event.target.checked;
  localStorage.setItem("setting-invert-mouse", invertMouseLook);
  caption.textContent = `Mouse look vertical axis: ${invertMouseLook ? "Inverted" : "Normal"}`;
});

settingP1Name?.addEventListener("input", (event) => {
  p1Name = event.target.value || "Aarav";
  localStorage.setItem("setting-p1-name", p1Name);
  updateDossierPreview();
});
settingP1Model?.addEventListener("change", (event) => {
  p1Model = event.target.value;
  localStorage.setItem("setting-p1-model", p1Model);
  p1Customization.model = p1Model;
  localStorage.setItem("setting-p1-customization", JSON.stringify(p1Customization));
  // Auto update default names
  if (settingP1Name && (settingP1Name.value === "Aarav" || settingP1Name.value === "Priya" || settingP1Name.value === "Prof. Kulkarni")) {
    p1Name = p1Model === "Kulkarni" ? "Prof. Kulkarni" : p1Model;
    settingP1Name.value = p1Name;
    localStorage.setItem("setting-p1-name", p1Name);
  }
  updateDossierPreview();
});
settingP2Name?.addEventListener("input", (event) => {
  p2Name = event.target.value || "Rohan";
  localStorage.setItem("setting-p2-name", p2Name);
});
settingP2Model?.addEventListener("change", (event) => {
  p2Model = event.target.value;
  localStorage.setItem("setting-p2-model", p2Model);
  if (settingP2Name && (settingP2Name.value === "Rohan" || settingP2Name.value === "Sam" || settingP2Name.value === "Priya")) {
    p2Name = p2Model;
    settingP2Name.value = p2Name;
    localStorage.setItem("setting-p2-name", p2Name);
  }
});
settingBrightness?.addEventListener("input", (event) => {
  screenBrightness = parseFloat(event.target.value);
  localStorage.setItem("setting-brightness", String(screenBrightness));
  renderer.toneMappingExposure = screenBrightness;
  caption.textContent = `Screen Brightness (Exposure): ${Math.round(screenBrightness * 80)}%`;
});

function updateDossierPreview() {
  if (!polaroidImagePlaceholder || !polaroidCaption) return;
  polaroidCaption.textContent = p1Name;
  if (p1Model === "Aarav") {
    polaroidImagePlaceholder.textContent = "👨‍🎓";
  } else if (p1Model === "Priya") {
    polaroidImagePlaceholder.textContent = "👩‍🎓";
  } else if (p1Model === "Kulkarni") {
    // Note: dead broken-emoji textContent fallback was removed in a previous phase
    polaroidImagePlaceholder.innerHTML = "<span style='font-size: 2.2rem;'>👨‍🏫</span>";
  }
}

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
  if (p1HeartbeatSlowNode) { try { p1HeartbeatSlowNode.stop(); } catch(e) {} p1HeartbeatSlowNode = null; }
  if (p1HeartbeatFastNode) { try { p1HeartbeatFastNode.stop(); } catch(e) {} p1HeartbeatFastNode = null; }
  if (p2HeartbeatSlowNode) { try { p2HeartbeatSlowNode.stop(); } catch(e) {} p2HeartbeatSlowNode = null; }
  if (p2HeartbeatFastNode) { try { p2HeartbeatFastNode.stop(); } catch(e) {} p2HeartbeatFastNode = null; }
  if (audioManager) {
    audioManager.stopSound("metronome_tick");
    audioManager.stopSound("electric_buzz");
    audioManager.stopSound("strobe_buzz");
    audioManager.stopSound("creepy_whispers");
  }
  setGameState(GameState.MENU);
});

document.getElementById("gameover-quit-button")?.addEventListener("click", () => {
  if (p1HeartbeatSlowNode) { try { p1HeartbeatSlowNode.stop(); } catch(e) {} p1HeartbeatSlowNode = null; }
  if (p1HeartbeatFastNode) { try { p1HeartbeatFastNode.stop(); } catch(e) {} p1HeartbeatFastNode = null; }
  if (p2HeartbeatSlowNode) { try { p2HeartbeatSlowNode.stop(); } catch(e) {} p2HeartbeatSlowNode = null; }
  if (p2HeartbeatFastNode) { try { p2HeartbeatFastNode.stop(); } catch(e) {} p2HeartbeatFastNode = null; }
  if (audioManager) {
    audioManager.stopSound("metronome_tick");
    audioManager.stopSound("electric_buzz");
    audioManager.stopSound("strobe_buzz");
    audioManager.stopSound("creepy_whispers");
  }
  resetGame();
  setGameState(GameState.MENU);
});

document.getElementById("win-quit-button")?.addEventListener("click", () => {
  if (p1HeartbeatSlowNode) { try { p1HeartbeatSlowNode.stop(); } catch(e) {} p1HeartbeatSlowNode = null; }
  if (p1HeartbeatFastNode) { try { p1HeartbeatFastNode.stop(); } catch(e) {} p1HeartbeatFastNode = null; }
  if (p2HeartbeatSlowNode) { try { p2HeartbeatSlowNode.stop(); } catch(e) {} p2HeartbeatSlowNode = null; }
  if (p2HeartbeatFastNode) { try { p2HeartbeatFastNode.stop(); } catch(e) {} p2HeartbeatFastNode = null; }
  if (audioManager) {
    audioManager.stopSound("metronome_tick");
    audioManager.stopSound("electric_buzz");
    audioManager.stopSound("strobe_buzz");
    audioManager.stopSound("creepy_whispers");
  }
  resetGame();
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
if (audioListener) {
  audioListener.setMasterVolume(masterVolume);
}
if (audioManager) {
  audioManager.setMasterVolume(masterVolume);
  audioManager.setSFXVolume(sfxVolume);
  audioManager.setAmbientVolume(ambientVolume);
}
if (settingMouseSensitivity) settingMouseSensitivity.value = mouseSensitivity; // loaded sensitivity
const savedFov = localStorage.getItem("setting-fov");
if (savedFov) {
  camera.fov = parseInt(savedFov);
  camera.updateProjectionMatrix();
  settingFov.value = savedFov;
} else {
  settingFov.value = 75;
}

const savedSubtitles = localStorage.getItem("setting-subtitles");
if (savedSubtitles !== null) {
  subtitlesEnabled = savedSubtitles === "true";
  settingSubtitles.checked = subtitlesEnabled;
}

const savedCamShake = localStorage.getItem("setting-cam-shake");
if (savedCamShake !== null) {
  camShakeMultiplier = parseFloat(savedCamShake);
  settingCamShake.value = savedCamShake;
}

const savedInvertMouse = localStorage.getItem("setting-invert-mouse");
if (savedInvertMouse !== null) {
  invertMouseLook = savedInvertMouse === "true";
  settingInvertMouse.checked = invertMouseLook;
}

if (settingP1Name) settingP1Name.value = p1Name;
if (settingP1Model) settingP1Model.value = p1Model;
if (settingP2Name) settingP2Name.value = p2Name;
if (settingP2Model) settingP2Model.value = p2Model;
if (settingBrightness) {
  settingBrightness.value = screenBrightness;
  renderer.toneMappingExposure = screenBrightness;
}
updateDossierPreview();

// Phase 16: Initial menu and archive checking
const unlockedEndings = JSON.parse(localStorage.getItem("ms_unlocked_endings") || "[]");
if (unlockedEndings.length > 0 && startPlusButton) {
  startPlusButton.style.display = "block";
}

if (!activeCheckpoint && continueButton) {
  continueButton.style.display = "none";
}

menuEndingsButton?.addEventListener("click", openEndingsGallery);
endingsCloseBtn?.addEventListener("click", () => {
  endingsGallery.style.display = "none";
  startScreen.classList.remove("hidden");
});

function openEndingsGallery() {
  const unlocked = JSON.parse(localStorage.getItem("ms_unlocked_endings") || "[]");
  if (document.getElementById("endings-progress-count")) {
    document.getElementById("endings-progress-count").textContent = `${unlocked.length}/4`;
  }
  
  const endingsData = {
    "A": {
      title: "PROTOCOL A: PUBLIC BROADCAST (THE TRUTH RELEASED)",
      body: "Aarav initiated a public broadcast of the 2004 sensory isolation data, exposing Ravenswood's illegal cognitive experiments. Meera's story is finally known. The facility was permanently closed following a federal probe."
    },
    "B": {
      title: "PROTOCOL B: HANDOVER TO KULKARNI (THE FILES SEALED)",
      body: "Aarav securely transferred all data directly to Professor Kulkarni. Within hours, the server was wiped and the basement staircase was walled over with fresh concrete. Aarav received his degree, and the silence remains."
    },
    "C": {
      title: "PROTOCOL C: TERMINATE GRID & STAY (LOST IN THE HUM)",
      body: "Aarav manually cut all power grids and stayed in the dark with Meera, matching the metronome's ticking. No one ever found him, but the backup grid still hums at 12Hz..."
    },
    "D": {
      title: "PROTOCOL D: EMERGENCY EXIT (SURVIVAL)",
      body: "Aarav triggered the emergency release hatch and escaped into the cold morning air, leaving the data behind. He survived, but the weight of what he left behind will follow him forever."
    }
  };

  ["A", "B", "C", "D"].forEach(id => {
    const card = document.getElementById(`card-ending-${id.toLowerCase()}`);
    if (!card) return;
    const status = card.querySelector(".ending-status");
    const desc = card.querySelector(".ending-desc");
    if (unlocked.includes(id)) {
      card.style.background = "#faf4e8";
      card.style.borderColor = "#ad9e89";
      if (status) {
        status.textContent = "[UNLOCKED]";
        status.style.color = "#73d08a";
      }
      if (desc) {
        desc.innerHTML = `<strong>Result:</strong> ${endingsData[id].body}`;
      }
    } else {
      card.style.background = "rgba(250, 244, 232, 0.4)";
      card.style.borderColor = "#c8b9a5";
      if (status) {
        status.textContent = "[LOCKED]";
        status.style.color = "#b22822";
      }
      if (desc) {
        desc.textContent = id === "A" 
          ? "Expose Ravenswood's cognitive experiments. (Requires 5 Lore Notes + collect Dr. Verma's Confession Tape)."
          : id === "B"
            ? "Trust the faculty liaison. Relinquish all data findings."
            : id === "C"
              ? "Sever the campus backup grid and stay behind with the presence."
              : "Escape immediately through the maintenance generator door without collecting the logs.";
      }
    }
  });

  startScreen.classList.add("hidden");
  endingsGallery.style.display = "block";
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
      pitch = THREE.MathUtils.clamp(pitch + (invertMouseLook ? 1 : -1) * dy * mouseSensitivity * 0.003, -1.1, 1.1);
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

renderer.setAnimationLoop(() => {
  animate();
});

function checkBreathingMinigameHitP1() {
  if (!p1LockerMinigameActive) return;

  const cycleSpeed = 2.4 + (p1HeartRate - 70) * 0.02;
  const breathTime = clock.getElapsedTime() * cycleSpeed;
  const indicatorPos = 50 + Math.sin(breathTime) * 45;

  if (indicatorPos >= 40 && indicatorPos <= 60) {
    p1LockerMinigameProgress = Math.min(100, p1LockerMinigameProgress + 18);
    fear = Math.max(0, fear - 15);
    p1Sanity = Math.min(100, p1Sanity + 4);
    caption.textContent = "Perfect sync! Heart rate stabilizing.";
    if (audioManager) {
      audioManager.playSound("ui_select", { volume: 0.25 });
    }
    if (p1LockerMinigameProgress >= 100) {
      p1LockerMinigameActive = false;
      fear = 0;
      p1Sanity = Math.min(100, p1Sanity + 20);
      caption.textContent = "Calibration success. Heart rate stabilized, sanity restored.";
      addTaskLog("Successfully calibrated breathing in locker.");
    }
  } else {
    p1LockerMinigameProgress = Math.max(-50, p1LockerMinigameProgress - 25);
    fear = Math.min(100, fear + 20);
    caption.textContent = "Missed rhythm! Heavy panting alerts the ghost.";
    if (audioManager) {
      audioManager.playSound("ui_select", { volume: 0.15 });
    }
    activeNoiseEventZ = camera.position.z;
    noiseInvestigateTimer = 6.0;
  }
}

function checkBreathingMinigameHitP2() {
  if (!p2LockerMinigameActive) return;

  const cycleSpeed2 = 2.4 + (p2HeartRate - 70) * 0.02;
  const breathTime2 = clock.getElapsedTime() * cycleSpeed2;
  const indicatorPos2 = 50 + Math.sin(breathTime2) * 45;

  if (indicatorPos2 >= 40 && indicatorPos2 <= 60) {
    p2LockerMinigameProgress = Math.min(100, p2LockerMinigameProgress + 18);
    fear2 = Math.max(0, fear2 - 15);
    p2Sanity = Math.min(100, p2Sanity + 4);
    caption.textContent = "Player 2 perfect sync! Heart rate stabilizing.";
    if (audioManager) {
      audioManager.playSound("ui_select", { volume: 0.25 });
    }
    if (p2LockerMinigameProgress >= 100) {
      p2LockerMinigameActive = false;
      fear2 = 0;
      p2Sanity = Math.min(100, p2Sanity + 20);
      caption.textContent = "Player 2 breathing stabilized, sanity restored.";
      addTaskLog("Player 2 calibrated breathing in locker.");
    }
  } else {
    p2LockerMinigameProgress = Math.max(-50, p2LockerMinigameProgress - 25);
    fear2 = Math.min(100, fear2 + 20);
    caption.textContent = "Player 2 missed rhythm! Noise generated.";
    if (audioManager) {
      audioManager.playSound("ui_select", { volume: 0.15 });
    }
    activeNoiseEventZ = camera2.position.z;
    noiseInvestigateTimer = 6.0;
  }
}

