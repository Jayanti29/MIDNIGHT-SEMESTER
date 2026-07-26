// @ts-nocheck
import {
  characterSelectState,
  updatePreviewModel,
  cancelCharacterSelectAnimation
} from "./characterSelect.js";
import { coopMode } from "../../main.js";

export function updateSwatchHighlights() {
  const activeEditingPlayer = characterSelectState.activeEditingPlayer;
  const currentOutfitColor = activeEditingPlayer === 1 ? characterSelectState.selectedOutfitColor : characterSelectState.selectedOutfitColor2;
  const currentHairStyle = activeEditingPlayer === 1 ? characterSelectState.selectedHairStyle : characterSelectState.selectedHairStyle2;
  const currentSkinTone = activeEditingPlayer === 1 ? characterSelectState.selectedSkinTone : characterSelectState.selectedSkinTone2;
  const currentBodyScale = activeEditingPlayer === 1 ? characterSelectState.selectedBodyScale : characterSelectState.selectedBodyScale2;
  const currentHasGlasses = activeEditingPlayer === 1 ? characterSelectState.selectedHasGlasses : characterSelectState.selectedHasGlasses2;
  const currentHasBackpack = activeEditingPlayer === 1 ? characterSelectState.selectedHasBackpack : characterSelectState.selectedHasBackpack2;
  const currentVariant = activeEditingPlayer === 1 ? characterSelectState.selectedVariant : characterSelectState.selectedVariant2;

  const btnCharAarav = document.getElementById("btn-char-aarav");
  const btnCharPriya = document.getElementById("btn-char-priya");
  const btnCharRohan = document.getElementById("btn-char-rohan");
  const btnCharSam = document.getElementById("btn-char-sam");
  const mapping = { Aarav: btnCharAarav, Priya: btnCharPriya, Rohan: btnCharRohan, Sam: btnCharSam };
  [btnCharAarav, btnCharPriya, btnCharRohan, btnCharSam].forEach(btn => btn?.classList.remove("active"));
  mapping[currentVariant]?.classList.add("active");

  const swatchBtns = document.querySelectorAll("#outfit-swatches .swatch-btn");
  swatchBtns.forEach(btn => {
    if (btn.getAttribute("data-color") === currentOutfitColor) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const hairBtns = document.querySelectorAll("#hair-swatches .hair-style-btn");
  hairBtns.forEach(btn => {
    if (btn.getAttribute("data-style") === currentHairStyle) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const skinBtns = document.querySelectorAll("#skin-swatches .skin-btn");
  skinBtns.forEach(btn => {
    if (btn.getAttribute("data-color") === currentSkinTone) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const bodyScaleSlider = document.getElementById("body-scale-slider");
  const bodyScaleLabel = document.getElementById("body-scale-label");
  if (bodyScaleSlider) {
    if (currentBodyScale === "short") bodyScaleSlider.value = 0;
    else if (currentBodyScale === "average") bodyScaleSlider.value = 1;
    else bodyScaleSlider.value = 2;
  }
  if (bodyScaleLabel) bodyScaleLabel.textContent = currentBodyScale.toUpperCase();

  const chkCharGlasses = document.getElementById("chk-char-glasses");
  if (chkCharGlasses) chkCharGlasses.checked = currentHasGlasses;

  const chkCharBackpack = document.getElementById("chk-char-backpack");
  if (chkCharBackpack) chkCharBackpack.checked = currentHasBackpack;
}

export function enableKeyboardNavForContainer(containerId) {
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

export function initCustomizationListeners({ onConfirm }) {
  const btnCharAarav = document.getElementById("btn-char-aarav");
  const btnCharPriya = document.getElementById("btn-char-priya");
  const btnCharRohan = document.getElementById("btn-char-rohan");
  const btnCharSam = document.getElementById("btn-char-sam");
  const btnCharRandomize = document.getElementById("btn-char-randomize");
  const btnCharConfirm = document.getElementById("btn-char-confirm");
  const btnCharReset = document.getElementById("btn-char-reset");
  const charSelectScreen = document.getElementById("character-select-screen");

  function selectVariantHandler(variant, activeBtn) {
    if (characterSelectState.activeEditingPlayer === 1) {
      characterSelectState.selectedVariant = variant;
    } else {
      characterSelectState.selectedVariant2 = variant;
    }
    [btnCharAarav, btnCharPriya, btnCharRohan, btnCharSam].forEach(btn => btn?.classList.remove("active"));
    activeBtn?.classList.add("active");
    
    updateSwatchHighlights();
    updatePreviewModel();
  }

  if (btnCharAarav) btnCharAarav.addEventListener("click", () => selectVariantHandler("Aarav", btnCharAarav));
  if (btnCharPriya) btnCharPriya.addEventListener("click", () => selectVariantHandler("Priya", btnCharPriya));
  if (btnCharRohan) btnCharRohan.addEventListener("click", () => selectVariantHandler("Rohan", btnCharRohan));
  if (btnCharSam) btnCharSam.addEventListener("click", () => selectVariantHandler("Sam", btnCharSam));

  const swatchBtns = document.querySelectorAll("#outfit-swatches .swatch-btn");
  swatchBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const col = e.target.getAttribute("data-color");
      if (characterSelectState.activeEditingPlayer === 1) {
        characterSelectState.selectedOutfitColor = col;
      } else {
        characterSelectState.selectedOutfitColor2 = col;
      }
      swatchBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      updatePreviewModel();
    });
  });

  const hairBtns = document.querySelectorAll("#hair-swatches .hair-style-btn");
  hairBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const style = e.target.getAttribute("data-style");
      if (characterSelectState.activeEditingPlayer === 1) {
        characterSelectState.selectedHairStyle = style;
      } else {
        characterSelectState.selectedHairStyle2 = style;
      }
      hairBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      updatePreviewModel();
    });
  });

  const skinBtns = document.querySelectorAll("#skin-swatches .skin-btn");
  skinBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const col = e.currentTarget.getAttribute("data-color");
      if (characterSelectState.activeEditingPlayer === 1) {
        characterSelectState.selectedSkinTone = col;
      } else {
        characterSelectState.selectedSkinTone2 = col;
      }
      skinBtns.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      updatePreviewModel();
    });
  });

  btnCharReset?.addEventListener("click", () => {
    const currentVar = characterSelectState.activeEditingPlayer === 1 ? characterSelectState.selectedVariant : characterSelectState.selectedVariant2;
    let defOutfit = "#243f5e";
    let defHair = "short";
    let defSkin = "#e3a072";

    if (currentVar === "Priya") {
      defOutfit = "#d4af37";
      defHair = "long";
      defSkin = "#fac08f";
    } else if (currentVar === "Rohan") {
      defOutfit = "#2f4c34";
      defHair = "short";
      defSkin = "#fcd0a1";
    } else if (currentVar === "Sam") {
      defOutfit = "#56382a";
      defHair = "cap";
      defSkin = "#a1683d";
    }

    if (characterSelectState.activeEditingPlayer === 1) {
      characterSelectState.selectedOutfitColor = defOutfit;
      characterSelectState.selectedHairStyle = defHair;
      characterSelectState.selectedSkinTone = defSkin;
      characterSelectState.selectedBodyScale = "average";
      characterSelectState.selectedHasGlasses = false;
      characterSelectState.selectedHasBackpack = false;
    } else {
      characterSelectState.selectedOutfitColor2 = defOutfit;
      characterSelectState.selectedHairStyle2 = defHair;
      characterSelectState.selectedSkinTone2 = defSkin;
      characterSelectState.selectedBodyScale2 = "average";
      characterSelectState.selectedHasGlasses2 = false;
      characterSelectState.selectedHasBackpack2 = false;
    }

    updateSwatchHighlights();
    updatePreviewModel();
  });

  const chkCharGlasses = document.getElementById("chk-char-glasses");
  chkCharGlasses?.addEventListener("change", (e) => {
    if (characterSelectState.activeEditingPlayer === 1) {
      characterSelectState.selectedHasGlasses = e.target.checked;
    } else {
      characterSelectState.selectedHasGlasses2 = e.target.checked;
    }
    updatePreviewModel();
  });

  const chkCharBackpack = document.getElementById("chk-char-backpack");
  chkCharBackpack?.addEventListener("change", (e) => {
    if (characterSelectState.activeEditingPlayer === 1) {
      characterSelectState.selectedHasBackpack = e.target.checked;
    } else {
      characterSelectState.selectedHasBackpack2 = e.target.checked;
    }
    updatePreviewModel();
  });

  const bodyScaleSlider = document.getElementById("body-scale-slider");
  const bodyScaleLabel = document.getElementById("body-scale-label");

  bodyScaleSlider?.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    let scaleStr = "average";
    if (val === 0) scaleStr = "short";
    else if (val === 2) scaleStr = "tall";

    if (characterSelectState.activeEditingPlayer === 1) {
      characterSelectState.selectedBodyScale = scaleStr;
    } else {
      characterSelectState.selectedBodyScale2 = scaleStr;
    }

    if (bodyScaleLabel) bodyScaleLabel.textContent = scaleStr.toUpperCase();
    updatePreviewModel();
  });

  btnCharRandomize?.addEventListener("click", () => {
    const variants = ["Aarav", "Priya", "Rohan", "Sam"];
    const randVar = variants[Math.floor(Math.random() * variants.length)];
    const colors = ["#243f5e", "#d4af37", "#56382a", "#2f4c34", "#7e2e17", "#4a2c5a", "#5a5a5a", "#d6c5b3"];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    const styles = ["short", "long", "cap", "buzzed", "ponytail"];
    const randStyle = styles[Math.floor(Math.random() * styles.length)];
    
    const scales = ["short", "average", "tall"];
    const randScale = scales[Math.floor(Math.random() * scales.length)];
    const randGlasses = Math.random() < 0.5;
    const randBackpack = Math.random() < 0.5;
    
    const skinTones = ["#fcd0a1", "#fac08f", "#e3a072", "#a1683d", "#5c3818"];
    const randSkin = skinTones[Math.floor(Math.random() * skinTones.length)];

    if (characterSelectState.activeEditingPlayer === 1) {
      characterSelectState.selectedVariant = randVar;
      characterSelectState.selectedOutfitColor = randColor;
      characterSelectState.selectedHairStyle = randStyle;
      characterSelectState.selectedBodyScale = randScale;
      characterSelectState.selectedHasGlasses = randGlasses;
      characterSelectState.selectedHasBackpack = randBackpack;
      characterSelectState.selectedSkinTone = randSkin;
    } else {
      characterSelectState.selectedVariant2 = randVar;
      characterSelectState.selectedOutfitColor2 = randColor;
      characterSelectState.selectedHairStyle2 = randStyle;
      characterSelectState.selectedBodyScale2 = randScale;
      characterSelectState.selectedHasGlasses2 = randGlasses;
      characterSelectState.selectedHasBackpack2 = randBackpack;
      characterSelectState.selectedSkinTone2 = randSkin;
    }

    updateSwatchHighlights();
    updatePreviewModel();
  });

  btnCharConfirm?.addEventListener("click", () => {
    if (coopMode && characterSelectState.activeEditingPlayer === 1) {
      characterSelectState.activeEditingPlayer = 2;
      const tabP1 = document.getElementById("btn-tab-p1");
      const tabP2 = document.getElementById("btn-tab-p2");
      tabP1?.classList.remove("active");
      tabP2?.classList.add("active");
      updateSwatchHighlights();
      updatePreviewModel();
      return;
    }

    characterSelectState.charSelectActive = false;
    cancelCharacterSelectAnimation();
    if (charSelectScreen) {
      charSelectScreen.style.display = "none";
      charSelectScreen.classList.remove("open");
    }

    const p1Customs = {
      model: characterSelectState.selectedVariant,
      outfitColor: characterSelectState.selectedOutfitColor,
      hairStyle: characterSelectState.selectedHairStyle,
      bodyScale: characterSelectState.selectedBodyScale,
      hasGlasses: characterSelectState.selectedHasGlasses,
      hasBackpack: characterSelectState.selectedHasBackpack,
      skinTone: characterSelectState.selectedSkinTone
    };

    const p2Customs = {
      model: characterSelectState.selectedVariant2,
      outfitColor: characterSelectState.selectedOutfitColor2,
      hairStyle: characterSelectState.selectedHairStyle2,
      bodyScale: characterSelectState.selectedBodyScale2,
      hasGlasses: characterSelectState.selectedHasGlasses2,
      hasBackpack: characterSelectState.selectedHasBackpack2,
      skinTone: characterSelectState.selectedSkinTone2
    };

    onConfirm({ p1: p1Customs, p2: p2Customs });
  });

  enableKeyboardNavForContainer("coop-player-tabs");
  enableKeyboardNavForContainer("variant-tabs-container");
  enableKeyboardNavForContainer("outfit-swatches");
  enableKeyboardNavForContainer("skin-swatches");
  enableKeyboardNavForContainer("hair-swatches");
}
