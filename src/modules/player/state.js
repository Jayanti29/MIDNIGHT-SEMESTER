// @ts-nocheck
import * as THREE from "three";
import {
  camera,
  camera2,
  scene,
  clock,
  audioCtx,
  audioManager,
  coopMode,
  keys,
  player2Keys,
  currentLevel,
  doors,
  gameplayState,
  GameState,
  getGameState,
  flashlightLight,
  player2Flashlight,
  flickerLights,
  AiState,
  triggerBlackoutSequence,
  triggerGameOver,
  setFlashlight,
  setFlashlight2,
  setEmfActive,
  setEmfActive2,
  playDoorCreak,
  playJumpscareStinger,
  playWhisper,
  sayLine,
  queueStory,
  updateMapMarkers,
  setGameState,
  requestPointerLock,
  updateInteractionPrompt,
  shakeOffset,
  camShakeMultiplier,
  godModeActive,
  filmPass,
  inspected,
  caption,
  vignette,
  hardcoreMode,
  infiniteBatteryActive,
  p1Model,
  p2Model,
  sfxVolume,
  decryptOscillationDir,
  decryptSpeedMultiplier,
  decryptIndicatorPos,
  decryptTargetPos
} from "../../main.js";
import { createCharacter } from "../character/index.js";


export function updateState(delta) {
  camera.position.sub(shakeOffset);
  shakeOffset.set(0, 0, 0);

  if (getGameState() === GameState.MENU) return;
  
  if (getGameState() === GameState.PLAYING && !gameplayState.blackoutTriggered && camera.position.z < -24) {
    window.blackoutTriggered = true;
    triggerBlackoutSequence();
  }

  // Phase 12 - Hiding Spot Breath Simulation & Noise Level Calculations
  if (getGameState() === GameState.PLAYING) {
    const breathP1Panel = document.getElementById("breath-p1-panel");
    const breathP1Text = document.getElementById("breath-p1-val");
    const breathP1Meter = document.getElementById("breath-p1-meter");
    
    if (gameplayState.isPlayerHidden) {
      if (breathP1Panel) breathP1Panel.style.display = "flex";
      if (keys.has("Space")) {
        window.isHoldingBreath = true;
        window.p1BreathStamina = Math.max(0, gameplayState.p1BreathStamina - delta * 24);
        window.fear = Math.max(0, gameplayState.fear - delta * 4);
      } else {
        window.isHoldingBreath = false;
        window.p1BreathStamina = Math.min(100, gameplayState.p1BreathStamina + delta * 18);
        if (scene.userData.meeraCharacter && !godModeActive) {
          const distToMeera = camera.position.distanceTo(scene.userData.meeraCharacter.position);
          if (distToMeera < 8.0) {
            window.fear = Math.min(100, gameplayState.fear + delta * 8.5);
          }
        }
      }
      
      if (gameplayState.p1BreathStamina <= 0) {
        window.isHoldingBreath = false;
        window.activeNoiseEventZ = camera.position.z;
        window.noiseInvestigateTimer = 6.0;
        caption.textContent = "Aarav gasped for air! The ghost heard you!";
        window.addTaskLog?.("Gasp for air gave away hiding spot!");
        window.p1BreathStamina = 20;
        if (audioManager) audioManager.playSound("jumpscare_stinger", { volume: 0.5 });
      }
    } else {
      if (breathP1Panel) breathP1Panel.style.display = "none";
      window.isHoldingBreath = false;
      window.p1BreathStamina = 100;
    }
    if (breathP1Text) breathP1Text.textContent = `${Math.round(gameplayState.p1BreathStamina)}%`;
    if (breathP1Meter) breathP1Meter.value = gameplayState.p1BreathStamina;

    const breathP2Panel = document.getElementById("breath-p2-panel");
    const breathP2Text = document.getElementById("breath-p2-val");
    const breathP2Meter = document.getElementById("breath-p2-meter");

    if (coopMode && camera2) {
      if (gameplayState.isPlayer2Hidden) {
        if (breathP2Panel) breathP2Panel.style.display = "flex";
        if (player2Keys.has("Period")) {
          window.isHoldingBreath2 = true;
          window.p2BreathStamina = Math.max(0, gameplayState.p2BreathStamina - delta * 24);
          window.fear2 = Math.max(0, gameplayState.fear2 - delta * 4);
        } else {
          window.isHoldingBreath2 = false;
          window.p2BreathStamina = Math.min(100, gameplayState.p2BreathStamina + delta * 18);
          if (scene.userData.meeraCharacter && !godModeActive) {
            const distToMeera2 = camera2.position.distanceTo(scene.userData.meeraCharacter.position);
            if (distToMeera2 < 8.0) {
              window.fear2 = Math.min(100, gameplayState.fear2 + delta * 8.5);
            }
          }
        }
        
        if (gameplayState.p2BreathStamina <= 0) {
          window.isHoldingBreath2 = false;
          window.activeNoiseEventZ = camera2.position.z;
          window.noiseInvestigateTimer = 6.0;
          caption.textContent = "Rohan gasped for air! The ghost heard you!";
          window.addTaskLog?.("Player 2 gasped for air!");
          window.p2BreathStamina = 20;
          if (audioManager) audioManager.playSound("jumpscare_stinger", { volume: 0.5 });
        }
      } else {
        if (breathP2Panel) breathP2Panel.style.display = "none";
        window.isHoldingBreath2 = false;
        window.p2BreathStamina = 100;
      }
      if (breathP2Text) breathP2Text.textContent = `${Math.round(gameplayState.p2BreathStamina)}%`;
      if (breathP2Meter) breathP2Meter.value = gameplayState.p2BreathStamina;
    }

    const noiseP1Text = document.getElementById("noise-p1-val");
    const noiseP1Meter = document.getElementById("noise-p1-meter");
    let p1Noise = 6;
    if (gameplayState.isPlayerHidden) {
      p1Noise = gameplayState.isHoldingBreath ? 2 : 12;
    } else {
      const isP1Moving = Number(keys.has("KeyW")) - Number(keys.has("KeyS")) !== 0 || Number(keys.has("KeyD")) - Number(keys.has("KeyA")) !== 0;
      const isP1Sprinting = keys.has("ShiftLeft") && isP1Moving && window.stamina > 0 && !window.sprintExhausted;
      p1Noise = isP1Sprinting ? 85 : (isP1Moving ? 35 : 6);
    }
    if (noiseP1Text) noiseP1Text.textContent = `${Math.round(p1Noise)}%`;
    if (noiseP1Meter) noiseP1Meter.value = p1Noise;

    const noiseP2Text = document.getElementById("noise-p2-val");
    const noiseP2Meter = document.getElementById("noise-p2-meter");
    if (coopMode) {
      let p2Noise = 6;
      if (gameplayState.isPlayer2Hidden) {
        p2Noise = gameplayState.isHoldingBreath2 ? 2 : 12;
      } else {
        const isP2Moving = Number(player2Keys.has("ArrowUp")) - Number(player2Keys.has("ArrowDown")) !== 0 || Number(player2Keys.has("ArrowLeft")) - Number(player2Keys.has("ArrowRight")) !== 0;
        const isP2Sprinting = player2Keys.has("ShiftRight") && isP2Moving && window.stamina2 > 0 && !window.sprintExhausted2;
        p2Noise = isP2Sprinting ? 85 : (isP2Moving ? 35 : 6);
      }
      if (noiseP2Text) noiseP2Text.textContent = `${Math.round(p2Noise)}%`;
      if (noiseP2Meter) noiseP2Meter.value = p2Noise;
    }
  }

  const batteryMultiplier = hardcoreMode ? 1.6 : 1.0;
  if (gameplayState.flashlightOn && !infiniteBatteryActive) window.battery = Math.max(0, gameplayState.battery - delta * 0.85 * batteryMultiplier);
  if (gameplayState.battery <= 0 && gameplayState.flashlightOn) setFlashlight(false);

  if (window.emfActive && !infiniteBatteryActive) {
    window.battery = Math.max(0, gameplayState.battery - delta * 0.46 * batteryMultiplier);
    if (gameplayState.battery <= 0) setEmfActive(false);
  }

  // Player 1 EMF Reader calculation & update
  if (window.emfActive) {
    let val = 1.0;
    if (scene.userData.meeraCharacter && scene.userData.meeraCharacter.visible) {
      const dist = camera.position.distanceTo(scene.userData.meeraCharacter.position);
      if (dist <= 25) {
        const ratio = Math.max(0, 1 - (dist - 1) / 24);
        val = 1.0 + ratio * 4.0;
        val += (Math.random() - 0.5) * 0.15;
        val = THREE.MathUtils.clamp(val, 1.0, 5.0);
      } else {
        val = 1.0 + (Math.random() - 0.5) * 0.05;
      }
    } else {
      val = 1.0 + (Math.random() - 0.5) * 0.05;
    }
    
    window.emfLevel = Math.floor(val);
    const p1ValEl = document.getElementById("emf-p1-val");
    const p1MeterEl = document.getElementById("emf-p1-meter");
    const p1PanelEl = document.getElementById("emf-p1-panel");
    if (p1ValEl) p1ValEl.textContent = val.toFixed(1);
    if (p1MeterEl) p1MeterEl.value = val;
    if (p1PanelEl) {
      if (gameplayState.emfLevel === 5) p1PanelEl.classList.add("danger-emf");
      else p1PanelEl.classList.remove("danger-emf");
    }

    // Handheld LEDs update
    if (camera.userData.emfProp && camera.userData.emfProp.userData.leds) {
      camera.userData.emfProp.userData.leds.forEach((led, idx) => {
        led.material.opacity = idx < gameplayState.emfLevel ? 1.0 : 0.18;
      });
    }

    // Sound ticking Geiger
    window.emfTickTimer -= delta;
    if (gameplayState.emfTickTimer <= 0) {
      const intervals = [1.2, 0.8, 0.5, 0.24, 0.08];
      window.emfTickTimer = intervals[Math.min(gameplayState.emfLevel - 1, 4)];
      if (audioManager) {
        audioManager.playSound("emf_tick", { volume: 0.18 * (gameplayState.emfLevel / 5) });
      }
    }
  }

  // Player 2 EMF Reader calculation & update
  if (coopMode && window.emfActive2) {
    let val2 = 1.0;
    if (scene.userData.meeraCharacter && scene.userData.meeraCharacter.visible && camera2) {
      const dist2 = camera2.position.distanceTo(scene.userData.meeraCharacter.position);
      if (dist2 <= 25) {
        const ratio2 = Math.max(0, 1 - (dist2 - 1) / 24);
        val2 = 1.0 + ratio2 * 4.0;
        val2 += (Math.random() - 0.5) * 0.15;
        val2 = THREE.MathUtils.clamp(val2, 1.0, 5.0);
      } else {
        val2 = 1.0 + (Math.random() - 0.5) * 0.05;
      }
    } else {
      val2 = 1.0 + (Math.random() - 0.5) * 0.05;
    }

    window.emfLevel2 = Math.floor(val2);
    const p2ValEl = document.getElementById("emf-p2-val");
    const p2MeterEl = document.getElementById("emf-p2-meter");
    const p2PanelEl = document.getElementById("emf-p2-panel");
    if (p2ValEl) p2ValEl.textContent = val2.toFixed(1);
    if (p2MeterEl) p2MeterEl.value = val2;
    if (p2PanelEl) {
      if (gameplayState.emfLevel2 === 5) p2PanelEl.classList.add("danger-emf");
      else p2PanelEl.classList.remove("danger-emf");
    }

    // Handheld LEDs update
    if (camera2 && camera2.userData.emfProp && camera2.userData.emfProp.userData.leds) {
      camera2.userData.emfProp.userData.leds.forEach((led, idx) => {
        led.material.opacity = idx < gameplayState.emfLevel2 ? 1.0 : 0.18;
      });
    }

    // Sound ticking Geiger
    window.emfTickTimer2 -= delta;
    if (gameplayState.emfTickTimer2 <= 0) {
      const intervals2 = [1.2, 0.8, 0.5, 0.24, 0.08];
      window.emfTickTimer2 = intervals2[Math.min(gameplayState.emfLevel2 - 1, 4)];
      if (audioManager) {
        audioManager.playSound("emf_tick", { volume: 0.18 * (gameplayState.emfLevel2 / 5) });
      }
    }
  }
  
  if (godModeActive) {
    window.fear = 0;
    window.p1Sanity = 100;
  } else {
    const depthFear = THREE.MathUtils.clamp((-camera.position.z - 6) * 1.7, 0, 58);
    const darknessFear = gameplayState.flashlightOn ? 0 : 18;
    window.fear = THREE.MathUtils.lerp(gameplayState.fear, depthFear + darknessFear + inspected * 5, delta * 0.9);
    if (gameplayState.fear >= 100 && getGameState() === GameState.PLAYING) {
      triggerGameOver("Aarav's heart could not take the terror. The dark claimed him.");
    }

    let sanityDrain = 0;
    if (!gameplayState.flashlightOn) {
      sanityDrain += 1.5;
    }
    if (scene.userData.meeraCharacter && scene.userData.meeraCharacter.visible) {
      const distToMeera = camera.position.distanceTo(scene.userData.meeraCharacter.position);
      if (distToMeera < 12.0) {
        sanityDrain += 4.5 * (1.0 - (distToMeera / 12.0));
      }
    }
    if (hardcoreMode) {
      sanityDrain *= 1.45;
    }
    const p1HrMultiplier = 1.0 + Math.max(0.0, (gameplayState.p1HeartRate - 70) / 100) * 1.5;
    sanityDrain *= p1HrMultiplier;

    if (sanityDrain > 0) {
      window.p1Sanity = Math.max(0, gameplayState.p1Sanity - delta * sanityDrain);
    } else {
      if (currentLevel === 1 && camera.position.z > -12) {
        window.p1Sanity = Math.min(100, gameplayState.p1Sanity + delta * 2.0);
      }
    }
  }

  // Heart rate calculation P1
  const targetHR1 = 70 + (gameplayState.fear / 100) * 70 + ((100 - gameplayState.stamina) / 100) * 30;
  window.p1HeartRate = THREE.MathUtils.lerp(gameplayState.p1HeartRate, targetHR1 + Math.sin(clock.getElapsedTime() * 3) * 1.5, delta * 2.0);

  const heart1ValEl = document.getElementById("heart-p1-val");
  if (heart1ValEl) heart1ValEl.textContent = `${Math.round(gameplayState.p1HeartRate)} BPM`;
  const ecgPath1 = document.querySelector("#ecg-p1-svg .ecg-path");
  if (ecgPath1) {
    ecgPath1.style.animationDuration = `${60 / gameplayState.p1HeartRate}s`;
  }

  const panicOverlay1 = document.getElementById("panic-overlay-p1");
  if (panicOverlay1) {
    if (gameplayState.p1HeartRate > 115) {
      panicOverlay1.classList.add("panic-active");
    } else {
      panicOverlay1.classList.remove("panic-active");
    }
  }

  if (getGameState() === GameState.PLAYING && audioCtx && audioManager && audioManager.buffers.has("heart_beat_slow")) {
    if (!gameplayState.p1HeartbeatSlowNode) {
      window.p1HeartbeatSlowNode = new THREE.Audio(audioManager.listener);
      gameplayState.p1HeartbeatSlowNode.setBuffer(audioManager.buffers.get("heart_beat_slow"));
      gameplayState.p1HeartbeatSlowNode.setLoop(true);
      gameplayState.p1HeartbeatSlowNode.setVolume(0);
      gameplayState.p1HeartbeatSlowNode.play();
    }
    if (!gameplayState.p1HeartbeatFastNode) {
      window.p1HeartbeatFastNode = new THREE.Audio(audioManager.listener);
      gameplayState.p1HeartbeatFastNode.setBuffer(audioManager.buffers.get("heart_beat_fast"));
      gameplayState.p1HeartbeatFastNode.setLoop(true);
      gameplayState.p1HeartbeatFastNode.setVolume(0);
      gameplayState.p1HeartbeatFastNode.play();
    }

    let p1HeartRateMult = 1.0;
    if (p1Model === "Kulkarni") p1HeartRateMult = 0.82;
    else if (p1Model === "Priya") p1HeartRateMult = 1.15;

    const sfxVolFactor = sfxVolume;
    if (gameplayState.p1HeartRate > 95) {
      const fastVol = Math.min(1.0, (gameplayState.p1HeartRate - 95) / 45) * 0.9 * sfxVolFactor;
      gameplayState.p1HeartbeatFastNode.setVolume(fastVol);
      gameplayState.p1HeartbeatSlowNode.setVolume(0);
      gameplayState.p1HeartbeatFastNode.setPlaybackRate((gameplayState.p1HeartRate / 120) * p1HeartRateMult);
    } else {
      const slowVol = Math.max(0.0, (gameplayState.p1HeartRate - 65) / 30) * 0.5 * sfxVolFactor;
      gameplayState.p1HeartbeatSlowNode.setVolume(slowVol);
      gameplayState.p1HeartbeatFastNode.setVolume(0);
      gameplayState.p1HeartbeatSlowNode.setPlaybackRate((gameplayState.p1HeartRate / 70) * p1HeartRateMult);
    }
  } else {
    if (gameplayState.p1HeartbeatSlowNode) gameplayState.p1HeartbeatSlowNode.setVolume(0);
    if (gameplayState.p1HeartbeatFastNode) gameplayState.p1HeartbeatFastNode.setVolume(0);
  }

  const sanity1Val = document.getElementById("sanity-p1-val");
  const sanity1Meter = document.getElementById("sanity-p1-meter");
  const sanity1Panel = document.getElementById("sanity-p1-panel");
  if (sanity1Val) sanity1Val.textContent = `${Math.round(gameplayState.p1Sanity)}%`;
  if (sanity1Meter) sanity1Meter.value = gameplayState.p1Sanity;
  if (sanity1Panel) {
    if (gameplayState.p1Sanity <= 30) sanity1Panel.classList.add("critical-sanity");
    else sanity1Panel.classList.remove("critical-sanity");
  }

  const minigamePanel1 = document.getElementById("breath-minigame-p1");
  if (minigamePanel1) {
    minigamePanel1.style.display = gameplayState.p1LockerMinigameActive ? "flex" : "none";
  }

  // Strobe sound hum effect
  if (audioManager && Math.random() < 0.05) {
    audioManager.playSound("strobe_buzz", { volume: 0.15 });
  }

  const feedNoise = document.getElementById("cctv-feed-noise");
  if (feedNoise && document.getElementById("security-terminal-modal")?.style.display === "block") {
    const meeraChar = scene.userData.meeraCharacter;
    const distToGhost = meeraChar ? camera.position.distanceTo(meeraChar.position) : 9999;
    if (distToGhost < 8.0) {
      feedNoise.style.background = `rgba(0, 255, 51, ${0.08 + Math.random() * 0.15})`;
    } else {
      feedNoise.style.background = "rgba(0, 255, 51, 0.08)";
    }
  }

  if (document.getElementById("map-overlay")?.style.display === "block") {
    updateMapMarkers();
    if (keys.has("ShiftLeft") || keys.has("ShiftRight")) {
      const mapModal = document.getElementById("map-overlay");
      if (mapModal) mapModal.style.display = "none";
      setGameState(GameState.PLAYING);
      requestPointerLock();
    }
  }

  if (getGameState() === GameState.DECRYPTING) {
    window.decryptIndicatorPos += decryptOscillationDir * delta * 80 * decryptSpeedMultiplier;
    if (decryptIndicatorPos >= 95) {
      window.decryptIndicatorPos = 95;
      window.decryptOscillationDir = -1;
    } else if (decryptIndicatorPos <= 5) {
      window.decryptIndicatorPos = 5;
      window.decryptOscillationDir = 1;
    }
    const indicatorEl = document.getElementById("decrypt-indicator");
    if (indicatorEl) indicatorEl.style.left = `${decryptIndicatorPos}%`;
    const targetEl = document.getElementById("decrypt-target");
    if (targetEl) targetEl.style.left = `${decryptTargetPos - 10}%`;
  }

  if (gameplayState.p1LockerMinigameActive) {
    const cycleSpeed = 2.4 + (gameplayState.p1HeartRate - 70) * 0.02;
    const breathTime = clock.getElapsedTime() * cycleSpeed;
    const indicatorPos = 50 + Math.sin(breathTime) * 45;
    
    const indicatorEl = document.getElementById("breath-indicator-p1");
    if (indicatorEl) indicatorEl.style.left = `${indicatorPos}%`;

    const dir = Math.cos(breathTime) >= 0 ? 1 : -1;
    if (dir !== gameplayState.p1PrevBreathDir) {
      window.p1PrevBreathDir = dir;
      window.p1BreathState = dir === 1 ? "in" : "out";
      if (audioManager && getGameState() === GameState.PLAYING) {
        audioManager.playSound(dir === 1 ? "breath_in" : "breath_out", { volume: 0.35 * sfxVolume });
      }
    }

    window.p1LockerMinigameProgress = Math.max(-50, gameplayState.p1LockerMinigameProgress - delta * 4);
    const progressMeter = document.getElementById("breath-progress-meter-p1");
    if (progressMeter) progressMeter.value = gameplayState.p1LockerMinigameProgress;

    if (gameplayState.p1LockerMinigameProgress <= -50) {
      window.p1LockerMinigameActive = false;
      window.fear = 100;
      caption.textContent = "You panicked! The ghost heard your hyperventilation!";
      if (audioManager) {
        audioManager.playSound("creepy_whisper", { volume: 0.85 });
      }
      window.activeNoiseEventZ = camera.position.z;
      window.noiseInvestigateTimer = 10.0;
      if (scene.userData.meeraCharacter) {
        window.meeraState = AiState.CHASE;
        window.lockerAlertState = true;
      }
    }
  }

  // Player 2 Flashlight, Battery, and Fear updates
  if (coopMode && camera2 && player2Flashlight) {
    if (gameplayState.flashlightOn2 && !infiniteBatteryActive) window.battery2 = Math.max(0, gameplayState.battery2 - delta * 0.85 * batteryMultiplier);
    if (gameplayState.battery2 <= 0 && gameplayState.flashlightOn2) setFlashlight2(false);

    if (gameplayState.emfActive2 && !infiniteBatteryActive) {
      window.battery2 = Math.max(0, gameplayState.battery2 - delta * 0.46 * batteryMultiplier);
      if (gameplayState.battery2 <= 0) setEmfActive2(false);
    }

    if (godModeActive) {
      window.fear2 = 0;
      window.p2Sanity = 100;
    } else {
      const depthFear2 = THREE.MathUtils.clamp((-camera2.position.z - 6) * 1.7, 0, 58);
      const darknessFear2 = gameplayState.flashlightOn2 ? 0 : 24;
      window.fear2 = THREE.MathUtils.lerp(gameplayState.fear2, depthFear2 + darknessFear2 + inspected * 5, delta * 0.9);
      if (gameplayState.fear2 >= 100 && getGameState() === GameState.PLAYING) {
        triggerGameOver("Rohan's heart could not take the terror. The dark claimed him.");
      }

      let sanityDrain2 = 0;
      if (!gameplayState.flashlightOn2) {
        sanityDrain2 += 1.5;
      }
      if (scene.userData.meeraCharacter && scene.userData.meeraCharacter.visible) {
        const distToMeera2 = camera2.position.distanceTo(scene.userData.meeraCharacter.position);
        if (distToMeera2 < 12.0) {
          sanityDrain2 += 4.5 * (1.0 - (distToMeera2 / 12.0));
        }
      }
      if (hardcoreMode) {
        sanityDrain2 *= 1.45;
      }
      const p2HrMultiplier = 1.0 + Math.max(0.0, (gameplayState.p2HeartRate - 70) / 100) * 1.5;
      sanityDrain2 *= p2HrMultiplier;

      if (sanityDrain2 > 0) {
        window.p2Sanity = Math.max(0, gameplayState.p2Sanity - delta * sanityDrain2);
      } else {
        if (currentLevel === 1 && camera2.position.z > -12) {
          window.p2Sanity = Math.min(100, gameplayState.p2Sanity + delta * 2.0);
        }
      }
    }

    // Heart rate calculation P2
    const targetHR2 = 70 + (gameplayState.fear2 / 100) * 70 + ((100 - gameplayState.stamina2) / 100) * 30;
    window.p2HeartRate = THREE.MathUtils.lerp(gameplayState.p2HeartRate, targetHR2 + Math.sin(clock.getElapsedTime() * 3) * 1.5, delta * 2.0);

    const heart2ValEl = document.getElementById("heart-p2-val");
    if (heart2ValEl) heart2ValEl.textContent = `${Math.round(gameplayState.p2HeartRate)} BPM`;
    const ecgPath2 = document.querySelector("#ecg-p2-svg .ecg-path");
    if (ecgPath2) {
      ecgPath2.style.animationDuration = `${60 / gameplayState.p2HeartRate}s`;
    }

    const panicOverlay2 = document.getElementById("panic-overlay-p2");
    if (panicOverlay2) {
      if (gameplayState.p2HeartRate > 115) {
        panicOverlay2.classList.add("panic-active");
      } else {
        panicOverlay2.classList.remove("panic-active");
      }
    }

    if (getGameState() === GameState.PLAYING && audioCtx && audioManager && audioManager.buffers.has("heart_beat_slow")) {
      if (!gameplayState.p2HeartbeatSlowNode) {
        window.p2HeartbeatSlowNode = new THREE.Audio(audioManager.listener);
        gameplayState.p2HeartbeatSlowNode.setBuffer(audioManager.buffers.get("heart_beat_slow"));
        gameplayState.p2HeartbeatSlowNode.setLoop(true);
        gameplayState.p2HeartbeatSlowNode.setVolume(0);
        gameplayState.p2HeartbeatSlowNode.play();
      }
      if (!gameplayState.p2HeartbeatFastNode) {
        window.p2HeartbeatFastNode = new THREE.Audio(audioManager.listener);
        gameplayState.p2HeartbeatFastNode.setBuffer(audioManager.buffers.get("heart_beat_fast"));
        gameplayState.p2HeartbeatFastNode.setLoop(true);
        gameplayState.p2HeartbeatFastNode.setVolume(0);
        gameplayState.p2HeartbeatFastNode.play();
      }

      let p2HeartRateMult = 1.0;
      if (p2Model === "Kulkarni") p2HeartRateMult = 0.82;
      else if (p2Model === "Priya" || p2Model === "Priya Sharma") p2HeartRateMult = 1.15;

      const sfxVolFactor = sfxVolume;
      if (gameplayState.p2HeartRate > 95) {
        const fastVol2 = Math.min(1.0, (gameplayState.p2HeartRate - 95) / 45) * 0.9 * sfxVolFactor;
        gameplayState.p2HeartbeatFastNode.setVolume(fastVol2);
        gameplayState.p2HeartbeatSlowNode.setVolume(0);
        gameplayState.p2HeartbeatFastNode.setPlaybackRate((gameplayState.p2HeartRate / 120) * p2HeartRateMult);
      } else {
        const slowVol2 = Math.max(0.0, (gameplayState.p2HeartRate - 65) / 30) * 0.5 * sfxVolFactor;
        gameplayState.p2HeartbeatSlowNode.setVolume(slowVol2);
        gameplayState.p2HeartbeatFastNode.setVolume(0);
        gameplayState.p2HeartbeatSlowNode.setPlaybackRate((gameplayState.p2HeartRate / 70) * p2HeartRateMult);
      }
    } else {
      if (gameplayState.p2HeartbeatSlowNode) gameplayState.p2HeartbeatSlowNode.setVolume(0);
      if (gameplayState.p2HeartbeatFastNode) gameplayState.p2HeartbeatFastNode.setVolume(0);
    }

    const sanity2Val = document.getElementById("sanity-p2-val");
    const sanity2Meter = document.getElementById("sanity-p2-meter");
    const sanity2Panel = document.getElementById("sanity-p2-panel");
    if (sanity2Val) sanity2Val.textContent = `${Math.round(gameplayState.p2Sanity)}%`;
    if (sanity2Meter) sanity2Meter.value = gameplayState.p2Sanity;
    if (sanity2Panel) {
      if (gameplayState.p2Sanity <= 30) sanity2Panel.classList.add("critical-sanity");
      else sanity2Panel.classList.remove("critical-sanity");
    }

    const minigamePanel2 = document.getElementById("breath-minigame-p2");
    if (minigamePanel2) {
      minigamePanel2.style.display = gameplayState.p2LockerMinigameActive ? "flex" : "none";
    }

    if (gameplayState.p2LockerMinigameActive) {
      const cycleSpeed2 = 2.4 + (gameplayState.p2HeartRate - 70) * 0.02;
      const breathTime2 = clock.getElapsedTime() * cycleSpeed2;
      const indicatorPos2 = 50 + Math.sin(breathTime2) * 45;
      
      const indicatorEl2 = document.getElementById("breath-indicator-p2");
      if (indicatorEl2) indicatorEl2.style.left = `${indicatorPos2}%`;

      const dir2 = Math.cos(breathTime2) >= 0 ? 1 : -1;
      if (dir2 !== gameplayState.p2PrevBreathDir) {
        window.p2PrevBreathDir = dir2;
        window.p2BreathState = dir2 === 1 ? "in" : "out";
        if (audioManager && getGameState() === GameState.PLAYING) {
          audioManager.playSound(dir2 === 1 ? "breath_in" : "breath_out", { volume: 0.35 * sfxVolume });
        }
      }

      window.p2LockerMinigameProgress = Math.max(-50, gameplayState.p2LockerMinigameProgress - delta * 4);
      const progressMeter2 = document.getElementById("breath-progress-meter-p2");
      if (progressMeter2) progressMeter2.value = gameplayState.p2LockerMinigameProgress;

      if (gameplayState.p2LockerMinigameProgress <= -50) {
        window.p2LockerMinigameActive = false;
        window.fear2 = 100;
        caption.textContent = "Player 2 panicked! The ghost heard hyperventilation!";
        if (audioManager) {
          audioManager.playSound("creepy_whisper", { volume: 0.85 });
        }
        window.activeNoiseEventZ = camera2.position.z;
        window.noiseInvestigateTimer = 10.0;
        if (scene.userData.meeraCharacter) {
          window.meeraState = AiState.CHASE;
          window.lockerAlertState = true;
        }
      }
    }

    if (gameplayState.flashlightOn2 && player2Flashlight.parent !== camera2) {
      camera2.add(player2Flashlight);
      camera2.add(player2Flashlight.target);
    }
    if (!gameplayState.flashlightOn2 && player2Flashlight.parent === camera2) {
      camera2.remove(player2Flashlight);
      camera2.remove(player2Flashlight.target);
    }
    let targetIntensity2 = 280.0 * (gameplayState.battery2 / 100 + 0.1);
    if (gameplayState.flashlightOn2) {
      if (gameplayState.battery2 < 35 && gameplayState.battery2 > 0) {
        const lowFlicker2 = Math.sin(clock.elapsedTime * 22) > 0.3 ? 1.0 : (Math.random() > 0.45 ? 0.18 : 0.02);
        targetIntensity2 *= lowFlicker2;
      }
      player2Flashlight.intensity = targetIntensity2;
      if (player2Flashlight.userData.beamMesh) {
        player2Flashlight.userData.beamMesh.material.opacity = 0.08 * (targetIntensity2 / 280.0);
        player2Flashlight.userData.beamMesh.visible = true;
      }
    } else {
      player2Flashlight.intensity = 0;
      if (player2Flashlight.userData.beamMesh) {
        player2Flashlight.userData.beamMesh.visible = false;
      }
    }

    const batteryText2 = document.getElementById("gameplayState.battery-p2-val");
    const batteryMeter2 = document.getElementById("gameplayState.battery-p2-meter");
    const batteryPanelP2 = document.getElementById("gameplayState.battery-p2-panel");
    if (batteryText2) {
      batteryText2.textContent = `${Math.round(gameplayState.battery2)}%`;
      batteryText2.style.color = gameplayState.battery2 > 50 ? "#73d08a" : (gameplayState.battery2 > 20 ? "#ffc87a" : "#ff5555");
    }
    if (batteryMeter2) batteryMeter2.value = gameplayState.battery2;
    if (batteryPanelP2) {
      batteryPanelP2.classList.toggle("gameplayState.battery-low", gameplayState.battery2 < 20);
    }
    const fearText2 = document.getElementById("gameplayState.fear-p2-val");
    const fearMeter2 = document.getElementById("gameplayState.fear-p2-meter");
    if (fearText2) fearText2.textContent = `${Math.round(gameplayState.fear2)}%`;
    if (fearMeter2) fearMeter2.value = gameplayState.fear2;
  }

  if (gameplayState.flashlightOn && flashlightLight.parent !== camera) {
    camera.add(flashlightLight);
    camera.add(flashlightLight.target);
  }
  if (!gameplayState.flashlightOn && flashlightLight.parent === camera) {
    camera.remove(flashlightLight);
    camera.remove(flashlightLight.target);
  }
  let targetIntensity = 280.0 * (gameplayState.battery / 100 + 0.1);
  if (gameplayState.flashlightOn) {
    if (gameplayState.battery < 35 && gameplayState.battery > 0) {
      // Low gameplayState.battery flickering
      const lowFlicker = Math.sin(clock.elapsedTime * 22) > 0.3 ? 1.0 : (Math.random() > 0.45 ? 0.18 : 0.02);
      targetIntensity *= lowFlicker;
    }
    flashlightLight.intensity = targetIntensity;
    if (flashlightLight.userData.beamMesh) {
      flashlightLight.userData.beamMesh.material.opacity = 0.08 * (targetIntensity / 280.0);
      flashlightLight.userData.beamMesh.visible = true;
    }
  } else {
    flashlightLight.intensity = 0;
    if (flashlightLight.userData.beamMesh) {
      flashlightLight.userData.beamMesh.visible = false;
    }
  }
  if (camera.userData.flashlightProp) {
    camera.userData.flashlightProp.visible = true;
    camera.userData.flashlightProp.userData.gauge.scale.x = Math.max(0.08, gameplayState.battery / 100);
    camera.userData.flashlightProp.userData.gauge.material.color.set(gameplayState.battery > 35 ? 0x73d08a : 0xc9493c);
  }
  const batteryText = document.getElementById("gameplayState.battery-p1-val");
  const batteryMeter = document.getElementById("gameplayState.battery-p1-meter");
  const batteryPanelP1 = document.getElementById("gameplayState.battery-p1-panel");
  if (batteryText) {
    batteryText.textContent = `${Math.round(gameplayState.battery)}%`;
    batteryText.style.color = gameplayState.battery > 50 ? "#73d08a" : (gameplayState.battery > 20 ? "#ffc87a" : "#ff5555");
  }
  if (batteryMeter) batteryMeter.value = gameplayState.battery;
  if (batteryPanelP1) {
    batteryPanelP1.classList.toggle("gameplayState.battery-low", gameplayState.battery < 20);
  }
  const fearText = document.getElementById("gameplayState.fear-p1-val");
  const fearMeter = document.getElementById("gameplayState.fear-p1-meter");
  if (fearText) fearText.textContent = `${Math.round(gameplayState.fear)}%`;
  if (fearMeter) fearMeter.value = gameplayState.fear;
  
  const activeFear = coopMode ? Math.max(gameplayState.fear, gameplayState.fear2) : gameplayState.fear;
  if (activeFear > gameplayState.statFearPeak) window.statFearPeak = activeFear;
  if (vignette) {
    vignette.style.opacity = String(0.35 + activeFear / 145);
  }

  // Drive post-processing shader uniforms from gameplayState.fear level
  if (filmPass) {
    filmPass.uniforms.vignetteAmount.value = 0.55 + activeFear * 0.004;
    filmPass.uniforms.aberrationAmount.value = 0.0018 + activeFear * 0.000055;
    filmPass.uniforms.grainAmount.value = 0.09 + activeFear * 0.0008;
  }

  const ghost = scene.userData.ghost;
  if (ghost) {
    ghost.lookAt(camera.position);
    ghost.material.opacity = Math.max(0, Math.sin(clock.elapsedTime * 1.7) * 0.16 + (gameplayState.fear - 42) / 210);
  }
  scene.userData.kulkarni?.lookAt(camera.position.x, 1.2, camera.position.z);
  
  if (scene.userData.meeraCharacter) {
    const meera = scene.userData.meeraCharacter;
    
    // Choose nearest player target, checking if they are hidden
    // Choose nearest player target, prioritizing players with lower sanity
    let targetCamera = null;
    let targetDist = Infinity;
    let targetFear = 0;
    let targetIsP2 = false;
    let bestScore = Infinity;

    if (!gameplayState.isPlayerHidden) {
      const dist1 = meera.position.distanceTo(camera.position);
      const score1 = dist1 * (0.35 + 0.65 * (gameplayState.p1Sanity / 100));
      targetCamera = camera;
      targetDist = dist1;
      targetFear = gameplayState.fear;
      bestScore = score1;
    }

    if (coopMode && camera2 && !gameplayState.isPlayer2Hidden) {
      const dist2 = meera.position.distanceTo(camera2.position);
      const score2 = dist2 * (0.35 + 0.65 * (gameplayState.p2Sanity / 100));
      if (score2 < bestScore) {
        targetCamera = camera2;
        targetDist = dist2;
        targetFear = gameplayState.fear2;
        targetIsP2 = true;
        bestScore = score2;
      }
    }
    
    if (gameplayState.meeraState === AiState.INACTIVE) {
      if (currentLevel === 1) {
        if (hardcoreMode || camera.position.z < -16 || gameplayState.fear > 28 || (coopMode && (camera2.position.z < -16 || gameplayState.fear2 > 28))) {
          window.meeraState = AiState.PATROL;
          meera.position.set(0, 0, -35);
          meera.visible = true;
        } else {
          meera.visible = false;
        }
      } else {
        if (window.generatorActive) {
          window.meeraState = AiState.CHASE;
          meera.position.set(0, 0, -32);
          meera.visible = true;
        } else {
          meera.visible = false;
        }
      }
    }
    
    // Kulkarni Library Radio Trigger Check (Verified Flow)
    if (currentLevel === 2 && !window.kulkarniLibraryEventPlayed && camera.position.x < -3.5 && camera.position.z < -6.0 && camera.position.z > -14.0) {
      window.kulkarniLibraryEventPlayed = true;
      window.triggerKulkarniLibraryDialogue?.();
    }

    // Ghost search checks for hidden players
    if (gameplayState.meeraState === AiState.PATROL && (gameplayState.isPlayerHidden || gameplayState.isPlayer2Hidden) && !gameplayState.lockerAlertState && Math.random() < 0.005) {
      const lockerGroup = scene.getObjectByName("locker_group") || scene.getObjectByName("locker_prop");
      if (lockerGroup) {
        window.lockerAlertState = true;
        window.lockerTargetToInspect = lockerGroup;
      }
    }

    if (gameplayState.meeraState !== AiState.INACTIVE) {
      if (gameplayState.lockerAlertState && gameplayState.lockerTargetToInspect) {
        let meeraSpeed = 1.65 * gameplayState.meeraSpeedMultiplier;
        meera.lookAt(gameplayState.lockerTargetToInspect.position.x, meera.position.y, gameplayState.lockerTargetToInspect.position.z);
        const toLocker = new THREE.Vector3().subVectors(gameplayState.lockerTargetToInspect.position, meera.position);
        toLocker.y = 0;
        const distToLocker = toLocker.length();
        toLocker.normalize();
        meera.position.addScaledVector(toLocker, meeraSpeed * delta);
        
        if (distToLocker < 1.45 && getGameState() === GameState.PLAYING && !godModeActive) {
          // Rattles locker door!
          if (audioManager) {
            audioManager.playSound("creepy_whisper", { volume: 0.8 });
          }
          window.lockerAlertState = false;
          window.lockerTargetToInspect = null;
          if (audioManager) audioManager.playSound("jumpscare_stinger", { volume: 1.0 });
          triggerGameOver(coopMode ? "A player was caught by Meera inside the locker." : "Meera ripped open the locker door. Hiding could not save Aarav.");
        }
      } else {
        // Revert to patrol if all players hide during a chase
        if (!targetCamera && gameplayState.meeraState === AiState.CHASE) {
          window.meeraState = AiState.PATROL;
          window.addTaskLog?.("Threat lost visual track of targets.");
        }

        if (targetCamera) {
          meera.lookAt(targetCamera.position.x, meera.position.y, targetCamera.position.z);
        }
        
        const targetFlashlightOn = targetCamera ? (targetIsP2 ? gameplayState.flashlightOn2 : gameplayState.flashlightOn) : false;
        const targetWantsSprint = targetCamera ? (targetIsP2 ? player2Keys.has("ShiftRight") : keys.has("ShiftLeft")) : false;
        const targetSprintExhausted = targetCamera ? (targetIsP2 ? gameplayState.sprintExhausted2 : window.sprintExhausted) : false;
        const targetEmfActive = targetCamera ? (targetIsP2 ? window.emfActive2 : window.emfActive) : false;
        const detectionMultiplier = targetEmfActive ? 1.5 : 1.0;
        const playerDetected = targetCamera && (
          (targetFlashlightOn && targetDist < 15 * detectionMultiplier) || 
          (targetDist < 7 * detectionMultiplier) || 
          (targetSprintExhausted === false && targetWantsSprint && targetDist < 11 * detectionMultiplier) ||
          (targetEmfActive && targetDist < 16)
        );
        
        if (playerDetected && gameplayState.meeraState === AiState.PATROL) {
          window.meeraState = AiState.CHASE;
          playJumpscareStinger();
          window.addTaskLog?.("Warning: Threat is pursuing you!");
        }
        
        if (gameplayState.meeraState === AiState.PATROL) {
          let meeraSpeed = 1.2 * gameplayState.meeraSpeedMultiplier;
          if (gameplayState.activeNoiseEventZ !== null) {
            const investigateDir = Math.sign(gameplayState.activeNoiseEventZ - meera.position.z);
            meera.position.z += investigateDir * meeraSpeed * delta;
            meera.lookAt(0, meera.position.y, gameplayState.activeNoiseEventZ);
            
            window.noiseInvestigateTimer -= delta;
            if (gameplayState.noiseInvestigateTimer <= 0 || Math.abs(meera.position.z - gameplayState.activeNoiseEventZ) < 0.5) {
              window.activeNoiseEventZ = null;
            }
          } else {
            let targetX = 0; // default: hallway center
            if (currentLevel === 2 && Math.abs(meera.position.z - (-10)) < 1.0 && Math.random() < 0.01) {
              targetX = -3.0; // patrols library occasionally
            }
            // Smoothly lerp toward target X rather than snapping to 0 instantly
            meera.position.x = THREE.MathUtils.lerp(meera.position.x, targetX, delta * 2.5);
            meera.position.z += gameplayState.meeraPatrolDir * meeraSpeed * delta;
            const zMin = currentLevel === 1 ? -45 : -35;
            const zMax = currentLevel === 1 ? -16 : 8;
            if (meera.position.z < zMin) {
              window.meeraPatrolDir = 1;
            } else if (meera.position.z > zMax) {
              window.meeraPatrolDir = -1;
            }
          }
        } else if (gameplayState.meeraState === AiState.CHASE && targetCamera) {
          let meeraSpeed = ((currentLevel === 2 ? 1.48 : 1.6) + (targetFear / 160)) * gameplayState.meeraSpeedMultiplier;
          const toPlayer = new THREE.Vector3().subVectors(targetCamera.position, meera.position);
          toPlayer.y = 0;
          toPlayer.normalize();
          meera.position.addScaledVector(toPlayer, meeraSpeed * delta);
          
          if (targetIsP2) {
            if (!godModeActive) window.fear2 = Math.min(100, gameplayState.fear2 + delta * 3.6);
          } else {
            if (!godModeActive) window.fear = Math.min(100, gameplayState.fear + delta * 3.6);
          }
          
          if (targetDist > 18 && currentLevel === 1) {
            window.meeraState = AiState.PATROL;
            window.addTaskLog?.("Lost the ghost threat.");
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
              window.addTaskLog?.(`Ghost opened closed door: ${door.userData.label}.`);
            }
          }
        });
        
        if (targetCamera && targetDist < 4.5 && gameplayState.meeraState === AiState.CHASE) {
          if (targetIsP2) {
            if (!godModeActive) window.fear2 = Math.min(100, gameplayState.fear2 + delta * 24);
          } else {
            if (!godModeActive) window.fear = Math.min(100, gameplayState.fear + delta * 24);
          }
          shakeOffset.x = (Math.random() - 0.5) * 0.045 * camShakeMultiplier;
          shakeOffset.y = (Math.random() - 0.5) * 0.045 * camShakeMultiplier;
        }
        
        if (targetCamera && targetDist < 1.15 && getGameState() === GameState.PLAYING && !godModeActive) {
          triggerGameOver(targetIsP2 ? "Rohan was caught by Meera's presence." : "Aarav was caught by Meera's presence.");
        }
      }
    }
  }
  if (scene.userData.dust) {
    scene.userData.dust.rotation.y += delta * 0.018;
  }

  // Distance-gate LOD: hide dorm room geometry when player is far away
  if (scene.userData.dormGroup) {
    scene.userData.dormGroup.visible = camera.position.z < -22;
  }

  // Task 62: Meera's first ghost whisper — one-time, triggers on first approach to dorm wing
  if (!gameplayState.meeraFirstWhisperPlayed && inspected === 0 && camera.position.z < -24.5 && getGameState() === GameState.PLAYING) {
    window.meeraFirstWhisperPlayed = true;
    playWhisper();
    window.setTimeout(() => {
      sayLine("Meera", "You look just like the ones who used to watch.", 7000);
    }, 800);
    caption.textContent = "Something cold passes through the air near Room 29.";
    window.addTaskLog?.("Heard something near Room 29.");
  }

  // Task 64: Meera's second ghost event — countdown sound + shadow flicker near Room 29
  if (!gameplayState.meeraSecondEventPlayed && inspected >= 1 && camera.position.z < -16 && getGameState() === GameState.PLAYING) {
    window.meeraSecondEventPlayed = true;
    window.activeCountdownFlicker = true;
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
      window.activeCountdownFlicker = false;
    }, 11000);
    caption.textContent = "The overhead light buzzes violently. A shadow stretches from Room 29...";
    window.addTaskLog?.("Experienced an electrical anomaly near Room 29.");
  }

  // Task 71: Meera's final ghost event — full apparition walk across corridor at z=-30 when evidence=3
  if (!gameplayState.meeraFinalEventPlayed && inspected === 3 && camera.position.z < -24.0 && getGameState() === GameState.PLAYING) {
    window.meeraFinalEventPlayed = true;
    window.activeApparitionWalk = true;
    const ghostAppar = createCharacter({ name: "MeeraApparition", position: [-3.2, 0, -31.5], color: 0x9ed2c2, ghostly: true, identity: "Meera" });
    window.apparitionGhost = ghostAppar;
    scene.add(ghostAppar);
    ghostAppar.rotation.y = Math.PI / 2; // looking right
    playWhisper();
    if (audioManager) {
      audioManager.playSound("blackout_cue", { volume: 0.4 });
    }
    queueStory([
      ["Aarav", "Meera... I can see you. You're trying to show me the way down..."]
    ]);
    caption.textContent = "A cold, pale figure drifts slowly across the hallway ahead...";
    window.addTaskLog?.("Witnessed a non-hostile apparition near the basement gate.");
  }

  if (gameplayState.activeApparitionWalk && gameplayState.apparitionGhost) {
    gameplayState.apparitionGhost.position.x += delta * 0.72;
    gameplayState.apparitionGhost.position.y = Math.sin(clock.getElapsedTime() * 3) * 0.04;
    if (gameplayState.apparitionGhost.position.x > 3.2) {
      window.activeApparitionWalk = false;
      window.apparitionFadeTimer = 0;
    }
  } else if (gameplayState.apparitionGhost) {
    window.apparitionFadeTimer += delta;
    gameplayState.apparitionGhost.children.forEach(c => {
      if (c.material) {
        c.material.transparent = true;
        c.material.opacity = Math.max(0, 0.42 * (1.0 - gameplayState.apparitionFadeTimer / 2.0));
      }
    });
    if (gameplayState.apparitionFadeTimer >= 2.0) {
      scene.remove(gameplayState.apparitionGhost);
      window.apparitionGhost = null;
    }
  }

  flickerLights.forEach(({ light, base, phase }) => {
    if (gameplayState.isBlackoutActive) {
      light.intensity = THREE.MathUtils.lerp(light.intensity, 0, delta * 12);
    } else if (gameplayState.activeCountdownFlicker && Math.abs(light.position.z - (-26)) < 1.0) {
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

  if (currentLevel === 2 && window.samCharacter && window.samFlashlight) {
    const distToSam = window.samCharacter.position.distanceTo(camera.position);
    if (distToSam > 2.8) {
      const toPlayer = new THREE.Vector3().subVectors(camera.position, window.samCharacter.position);
      toPlayer.y = 0;
      toPlayer.normalize();
      window.samCharacter.position.addScaledVector(toPlayer, 1.48 * delta);
      window.samCharacter.lookAt(camera.position.x, window.samCharacter.position.y, camera.position.z);
    }
    window.samFlashlight.position.copy(window.samCharacter.position).add(new THREE.Vector3(0, 1.3, 0));
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(window.samCharacter.quaternion);
    window.samFlashlight.target.position.copy(window.samFlashlight.position).add(dir);
  }

  if (gameplayState.p1Sanity < 50) {
    const sanityIntensity = (50 - gameplayState.p1Sanity) / 50;
    shakeOffset.x += (Math.random() - 0.5) * 0.03 * sanityIntensity * camShakeMultiplier;
    shakeOffset.y += (Math.random() - 0.5) * 0.03 * sanityIntensity * camShakeMultiplier;
    camera.rotation.z += Math.sin(clock.getElapsedTime() * 6) * 0.02 * sanityIntensity * camShakeMultiplier;
  }
  if (gameplayState.p1HeartRate > 80) {
    const hrIntensity = (gameplayState.p1HeartRate - 90) / 80;
    const pulseSpeed = (gameplayState.p1HeartRate / 60) * Math.PI * 2;
    camera.rotation.z += Math.sin(clock.getElapsedTime() * pulseSpeed) * 0.03 * hrIntensity * camShakeMultiplier;
    camera.rotation.y += Math.cos(clock.getElapsedTime() * pulseSpeed * 0.5) * 0.005 * hrIntensity * camShakeMultiplier;
  }
  if (coopMode && camera2 && gameplayState.p2Sanity < 50) {
    const sanityIntensity2 = (50 - gameplayState.p2Sanity) / 50;
    camera2.position.x += (Math.random() - 0.5) * 0.02 * sanityIntensity2 * camShakeMultiplier;
    camera2.position.y += (Math.random() - 0.5) * 0.02 * sanityIntensity2 * camShakeMultiplier;
    camera2.rotation.z += Math.sin(clock.getElapsedTime() * 6) * 0.02 * sanityIntensity2 * camShakeMultiplier;
  }
  if (coopMode && camera2 && gameplayState.p2HeartRate > 90) {
    const hrIntensity2 = (gameplayState.p2HeartRate - 90) / 80;
    const pulseSpeed2 = (gameplayState.p2HeartRate / 60) * Math.PI * 2;
    camera2.rotation.z += Math.sin(clock.getElapsedTime() * pulseSpeed2) * 0.03 * hrIntensity2 * camShakeMultiplier;
    camera2.rotation.y += Math.cos(clock.getElapsedTime() * pulseSpeed2 * 0.5) * 0.005 * hrIntensity2 * camShakeMultiplier;
  }

  updateInteractionPrompt();
  camera.position.add(shakeOffset);
}

// commit-ref: 15
// commit-ref: 16
// commit-ref: 35
// commit-ref: 36
// commit-ref: 54