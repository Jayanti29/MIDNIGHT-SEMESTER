// @ts-nocheck
import * as THREE from "three";
import {
  coopMode,
  playerCustomizationState,
  disposeRenderer,
  disposeObject3D
} from "../../main.js";
import { createProceduralHumanoidSkeleton } from "./humanoidSkeleton.js";
import { updateSwatchHighlights } from "./customization.js";

export const characterSelectState = {
  charSelectActive: false,
  characterSelectInitialized: false,
  selectScene: null,
  selectCamera: null,
  selectRenderer: null,
  selectMesh: null,
  selectRafId: null,
  activeEditingPlayer: 1,
  selectAmbientLight: null,
  selectPointLight: null,
  selectLightingMode: "night",

  selectedVariant: "Aarav",
  selectedOutfitColor: "#243f5e",
  selectedHairStyle: "short",
  selectedBodyScale: "average",
  selectedHasGlasses: false,
  selectedHasBackpack: false,
  selectedSkinTone: "#e3a072",

  selectedVariant2: "Rohan",
  selectedOutfitColor2: "#2f4c34",
  selectedHairStyle2: "short",
  selectedBodyScale2: "average",
  selectedHasGlasses2: false,
  selectedHasBackpack2: false,
  selectedSkinTone2: "#fcd0a1"
};

export function initCharacterSelect() {
  characterSelectState.activeEditingPlayer = 1;
  const coopPlayerTabs = document.getElementById("coop-player-tabs");
  if (coopPlayerTabs) {
    coopPlayerTabs.style.display = coopMode ? "flex" : "none";
  }
  const tabP1 = document.getElementById("btn-tab-p1");
  const tabP2 = document.getElementById("btn-tab-p2");
  if (tabP1) tabP1.classList.add("active");
  if (tabP2) tabP2.classList.remove("active");

  characterSelectState.selectLightingMode = "night";
  const btnCharLight = document.getElementById("btn-char-light");
  if (btnCharLight) btnCharLight.textContent = "☀️ DAYLIGHT MODE";
  if (characterSelectState.selectAmbientLight) {
    characterSelectState.selectAmbientLight.intensity = 0.45;
    characterSelectState.selectAmbientLight.color.setHex(0xffecd9);
  }
  if (characterSelectState.selectPointLight) {
    characterSelectState.selectPointLight.intensity = 1.8;
    characterSelectState.selectPointLight.color.setHex(0xfff5d9);
  }

  characterSelectState.selectedVariant = playerCustomizationState.p1Model;
  characterSelectState.selectedOutfitColor = playerCustomizationState.p1OutfitColor;
  characterSelectState.selectedHairStyle = playerCustomizationState.p1HairStyle;
  characterSelectState.selectedBodyScale = playerCustomizationState.p1BodyScale;
  characterSelectState.selectedHasGlasses = playerCustomizationState.p1HasGlasses;
  characterSelectState.selectedHasBackpack = playerCustomizationState.p1HasBackpack;
  characterSelectState.selectedSkinTone = playerCustomizationState.p1SkinTone;

  characterSelectState.selectedVariant2 = playerCustomizationState.p2Model;
  characterSelectState.selectedOutfitColor2 = playerCustomizationState.p2OutfitColor;
  characterSelectState.selectedHairStyle2 = playerCustomizationState.p2HairStyle;
  characterSelectState.selectedBodyScale2 = playerCustomizationState.p2BodyScale;
  characterSelectState.selectedHasGlasses2 = playerCustomizationState.p2HasGlasses;
  characterSelectState.selectedHasBackpack2 = playerCustomizationState.p2HasBackpack;
  characterSelectState.selectedSkinTone2 = playerCustomizationState.p2SkinTone;

  const selectCanvas = document.getElementById("char-preview-canvas");
  if (!selectCanvas) return;

  const charSelectScreen = document.getElementById("character-select-screen");
  if (charSelectScreen) {
    void charSelectScreen.offsetWidth;
  }

  const width = selectCanvas.clientWidth || 280;
  const height = selectCanvas.clientHeight || 260;

  if (
    characterSelectState.characterSelectInitialized &&
    characterSelectState.charSelectActive &&
    characterSelectState.selectRenderer &&
    characterSelectState.selectScene &&
    characterSelectState.selectCamera
  ) {
    if (characterSelectState.selectCamera) {
      characterSelectState.selectCamera.aspect = width / height;
      characterSelectState.selectCamera.updateProjectionMatrix();
    }
    characterSelectState.selectRenderer.setSize(width, height, false);
    updateSwatchHighlights();
    updatePreviewModel();
    return;
  }

  if (characterSelectState.selectRenderer) {
    disposeRenderer(characterSelectState.selectRenderer);
    characterSelectState.selectRenderer = null;
  }

  characterSelectState.selectScene = new THREE.Scene();
  characterSelectState.selectCamera = new THREE.PerspectiveCamera(35, width / height, 0.1, 10);
  characterSelectState.selectCamera.position.set(0, 0.95, 3.1);
  characterSelectState.selectCamera.lookAt(0, 0.95, 0);

  characterSelectState.selectRenderer = new THREE.WebGLRenderer({ canvas: selectCanvas, antialias: true, alpha: true });
  characterSelectState.selectRenderer.setSize(width, height, false);
  characterSelectState.selectRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  characterSelectState.characterSelectInitialized = true;

  const fatalError = document.getElementById("fatal-error-overlay");

  characterSelectState.selectRenderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    cancelCharacterSelectAnimation();
    console.error("WebGL context lost on character-select renderer.");
    if (fatalError) {
      fatalError.innerHTML = `
        <h2>WebGL Context Lost</h2>
        <p>The graphics context was lost on character selection. Please reload the page.</p>
        <button id="reload-btn" style="margin-top: 15px; padding: 8px 16px; background: #c9a56d; color: #080706; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">Reload Game</button>
      `;
      fatalError.hidden = false;
      document.getElementById("reload-btn")?.addEventListener("click", () => {
        window.location.reload();
      });
    }
  }, false);

  characterSelectState.selectRenderer.domElement.addEventListener("webglcontextrestored", () => {
    console.warn("WebGL context restored on character-select renderer; reloading to rebuild preview.");
    window.location.reload();
  }, false);

  characterSelectState.selectAmbientLight = new THREE.AmbientLight(0xffecd9, 2.5);
  characterSelectState.selectScene.add(characterSelectState.selectAmbientLight);

  characterSelectState.selectPointLight = new THREE.PointLight(0xfff5d9, 45.0, 10);
  characterSelectState.selectPointLight.position.set(0.6, 1.8, 1.2);
  characterSelectState.selectPointLight.castShadow = true;
  characterSelectState.selectScene.add(characterSelectState.selectPointLight);

  updatePreviewModel();
}

export function updatePreviewModel() {
  if (!characterSelectState.selectScene) return;

  const activeEditingPlayer = characterSelectState.activeEditingPlayer;
  const currentVar = activeEditingPlayer === 1 ? characterSelectState.selectedVariant : characterSelectState.selectedVariant2;
  const currentColor = activeEditingPlayer === 1 ? characterSelectState.selectedOutfitColor : characterSelectState.selectedOutfitColor2;
  const currentHair = activeEditingPlayer === 1 ? characterSelectState.selectedHairStyle : characterSelectState.selectedHairStyle2;
  const currentGlasses = activeEditingPlayer === 1 ? characterSelectState.selectedHasGlasses : characterSelectState.selectedHasGlasses2;
  const currentBackpack = activeEditingPlayer === 1 ? characterSelectState.selectedHasBackpack : characterSelectState.selectedHasBackpack2;
  const currentSkin = activeEditingPlayer === 1 ? characterSelectState.selectedSkinTone : characterSelectState.selectedSkinTone2;
  const currentScale = activeEditingPlayer === 1 ? characterSelectState.selectedBodyScale : characterSelectState.selectedBodyScale2;

  // Save previous Y rotation if preview mesh already exists
  const existingRotY = characterSelectState.selectMesh ? characterSelectState.selectMesh.rotation.y : 0;

  if (characterSelectState.selectMesh) {
    characterSelectState.selectScene.remove(characterSelectState.selectMesh);
    disposeObject3D(characterSelectState.selectMesh);
    characterSelectState.selectMesh = null;
  }

  characterSelectState.selectMesh = createProceduralHumanoidSkeleton({
    name: "previewModel",
    position: [0, 0, 0],
    isGhost: false,
    identity: currentVar,
    outfitColorOverride: currentColor,
    hairStyleOverride: currentHair,
    hasGlassesOverride: currentGlasses,
    hasBackpackOverride: currentBackpack,
    skinColorOverride: currentSkin
  });

  characterSelectState.selectMesh.rotation.y = existingRotY;

  let scaleMult = 1.0;
  if (currentScale === "short") scaleMult = 0.88;
  else if (currentScale === "tall") scaleMult = 1.12;

  if (currentVar === "Sam") {
    characterSelectState.selectMesh.scale.set(1.08 * scaleMult, 1.08 * scaleMult, 1.08 * scaleMult);
  } else if (currentVar === "Priya") {
    characterSelectState.selectMesh.scale.set(0.92 * scaleMult, 0.94 * scaleMult, 0.92 * scaleMult);
  } else {
    characterSelectState.selectMesh.scale.set(1.0 * scaleMult, 1.0 * scaleMult, 1.0 * scaleMult);
  }

  characterSelectState.selectScene.add(characterSelectState.selectMesh);
}

export function cancelCharacterSelectAnimation() {
  if (characterSelectState.selectRafId) {
    cancelAnimationFrame(characterSelectState.selectRafId);
    characterSelectState.selectRafId = null;
  }
}

export function animateCharacterSelect() {
  if (!characterSelectState.charSelectActive) return;
  const fatalError = document.getElementById("fatal-error-overlay");
  try {
    characterSelectState.selectRafId = requestAnimationFrame(animateCharacterSelect);

    if (characterSelectState.selectMesh) {
      characterSelectState.selectMesh.rotation.y += 0.012;
      const time = performance.now() * 0.0018;
      const hips = characterSelectState.selectMesh.userData.hips;
      if (hips) {
        hips.position.y = 0.9 + Math.sin(time) * 0.015;
      }
    }

    if (
      characterSelectState.selectRenderer &&
      characterSelectState.selectScene &&
      characterSelectState.selectCamera
    ) {
      characterSelectState.selectRenderer.render(characterSelectState.selectScene, characterSelectState.selectCamera);
    }
  } catch (error) {
    console.error("Error in character select loop:", error);
    if (fatalError) {
      fatalError.innerHTML = `
        <h2>An Error Occurred</h2>
        <p>A fatal error occurred in the character select loop. Please check the console for details, or reload the page.</p>
        <button id="reload-btn" style="margin-top: 15px; padding: 8px 16px; background: #c9a56d; color: #080706; border: none; cursor: pointer; font-weight: bold; border-radius: 4px;">Reload Game</button>
      `;
      fatalError.hidden = false;
      document.getElementById("reload-btn")?.addEventListener("click", () => {
        window.location.reload();
      });
    }
    cancelCharacterSelectAnimation();
    characterSelectState.charSelectActive = false;
  }
}

// commit-ref: 5
// commit-ref: 6
// commit-ref: 25
// commit-ref: 26
// commit-ref: 45
// commit-ref: 46
// commit-ref: 5
// commit-ref: 6
// commit-ref: 25
// commit-ref: 26
// commit-ref: 45
// commit-ref: 46