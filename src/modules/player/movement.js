// @ts-nocheck
import * as THREE from "three";
import {
  camera,
  camera2,
  player2Character,
  scene,
  audioManager,
  coopMode,
  keys,
  player2Keys,
  playerRadius,
  currentLevel,
  roomBounds,
  colliders,
  doors,
  inspectNearest,
  toggleFlashlight,
  moveDirection,
  moveDirection2,
  gameplayState,
  GameState,
  getGameState,
  debugConsoleOpen,
  renderer,
  caption
} from "../../main.js";

export function canOccupy(position) {
  const x = position.x;
  const z = position.z;
  const rad = 0.22; // Tightened player collision radius for fluid corridor navigation

  // Check if player is in the main corridor or entry lobby
  let inCorridor = false;
  if (Math.abs(x) <= 4.2) {
    if (currentLevel === 1) {
      if (z <= 32.0 && z >= -92.0) {
        inCorridor = true;
      }
    } else {
      if (z <= 12.0 && z >= -45.0) {
        inCorridor = true;
      }
    }
  }

  // Check if player is inside any defined room or building structure
  let inRoom = false;
  if (currentLevel === 1) {
    // Check hardcoded Level 1 Dorm room (Room 32)
    const roomZ = -35;
    if (x >= -7.5 && x <= 7.5 && z >= roomZ - 7 && z <= roomZ + 7) {
      inRoom = true;
    }

    // Check all data-driven rooms
    const bounds = roomBounds || window.roomBounds || [];
    for (const r of bounds) {
      if (x >= r.xMin - 0.3 && x <= r.xMax + 0.3 && z >= r.zMin - 0.3 && z <= r.zMax + 0.3) {
        inRoom = true;
        break;
      }
    }
  } else if (currentLevel === 2) {
    // Generator Room
    if (x >= -2.0 && x <= 10.2 && z >= -25.2 && z <= -14.8) {
      inRoom = true;
    }
    // Library Archive Room
    if (x >= -10.2 && x <= 2.0 && z >= -17.2 && z <= -2.8) {
      inRoom = true;
    }
  }

  if (!inCorridor && !inRoom) return false;

  // Check static colliders registered in the list
  const currentColliders = colliders || window.colliders || [];
  for (let i = 0; i < currentColliders.length; i++) {
    const col = currentColliders[i];
    if (!col || !col.name) continue;
    const nameLower = col.name.toLowerCase();
    if (
      nameLower.includes("floor") ||
      nameLower.includes("ceiling") ||
      nameLower.includes("player") ||
      nameLower.includes("aarav") ||
      nameLower.includes("priya") ||
      nameLower.includes("rohan") ||
      nameLower.includes("sam") ||
      nameLower.includes("trigger") ||
      nameLower.includes("carpet") ||
      nameLower.includes("panel") ||
      nameLower.includes("lily") ||
      nameLower.includes("paper") ||
      nameLower.includes("debris") ||
      nameLower.includes("tubelight")
    ) {
      continue;
    }
    if (x >= col.xMin - rad && x <= col.xMax + rad &&
        z >= col.zMin - rad && z <= col.zMax + rad) {
      return false;
    }
  }

  // Check doors (closed doors block movement through their frame segment)
  const currentDoors = doors || window.doors || [];
  for (let i = 0; i < currentDoors.length; i++) {
    const door = currentDoors[i];
    if (door && door.userData && !door.userData.open) {
      const xDoor = door.position.x;
      const zDoor = door.position.z;
      const xMin = xDoor - 0.25;
      const xMax = xDoor + 0.25;
      const zMin = zDoor - 0.65;
      const zMax = zDoor + 0.65;
      if (x >= xMin - rad && x <= xMax + rad &&
          z >= zMin - rad && z <= zMax + rad) {
        return false;
      }
    }
  }

  return true;
}

export function updateMovement(delta) {
  // Access global/proxied states safely
  const curGameState = getGameState ? getGameState() : (window.gameState || "playing");
  const TargetGameState = GameState || window.GameState || { PLAYING: "playing" };
  const isDebugOpen = typeof debugConsoleOpen !== "undefined" ? debugConsoleOpen : (window.debugConsoleOpen || false);
  const curRenderer = typeof renderer !== "undefined" ? renderer : window.renderer;
  const curCaption = typeof caption !== "undefined" ? caption : window.caption;

  if (curGameState !== TargetGameState.PLAYING || isDebugOpen) return;

  if (curRenderer && curRenderer.xr && curRenderer.xr.enabled && curRenderer.xr.isPresenting) {
    const session = curRenderer.xr.getSession();
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
      
      gameplayState.yaw -= vrLookYaw * delta * 1.5;
      camera.rotation.set(0, gameplayState.yaw, 0, "YXZ");
      
      const vrDir = new THREE.Vector3(vrStrafe, 0, -vrForward).normalize().multiplyScalar(3.0 * delta);
      vrDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), gameplayState.yaw);
      const vrCandidate = camera.position.clone().add(vrDir);
      if (canOccupy(vrCandidate)) {
        camera.position.copy(vrCandidate);
      }
      camera.position.y = 1.7;
    }
    return;
  }
  const isForwardKey = keys.has("KeyW") || keys.has("Keyw") || keys.has("w") || keys.has("W") || (!coopMode && keys.has("ArrowUp"));
  const isBackwardKey = keys.has("KeyS") || keys.has("Keys") || keys.has("s") || keys.has("S") || (!coopMode && keys.has("ArrowDown"));
  const isRightKey = keys.has("KeyD") || keys.has("Keyd") || keys.has("d") || keys.has("D") || (!coopMode && keys.has("ArrowRight"));
  const isLeftKey = keys.has("KeyA") || keys.has("Keya") || keys.has("a") || keys.has("A") || (!coopMode && keys.has("ArrowLeft"));

  const forward = Number(isForwardKey) - Number(isBackwardKey);
  const strafe = Number(isRightKey) - Number(isLeftKey);
  const wantsSprint = keys.has("ShiftLeft");

  let moveX = strafe;
  let moveZ = -forward;
  let wantsSprintP1 = wantsSprint;

  // Player 1 Mouse / Keyboard Look
  let lookX = 0;
  let lookY = 0;
  if (!coopMode && !isForwardKey && !isBackwardKey && !isRightKey && !isLeftKey) {
    lookX = Number(keys.has("ArrowRight")) - Number(keys.has("ArrowLeft"));
    lookY = Number(keys.has("ArrowDown")) - Number(keys.has("ArrowUp"));
  }

  // Poll gamepad for Player 1 (uses pads[0])
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const pad = pads[0];
  if (pad) {
    const lx = pad.axes[0] ?? 0;
    const ly = pad.axes[1] ?? 0;
    const rx = pad.axes[2] ?? 0;
    const ry = pad.axes[3] ?? 0;
    const dead = 0.18;

    if (Math.abs(lx) > dead) moveX = lx;
    if (Math.abs(ly) > dead) moveZ = ly;

    if (Math.abs(rx) > dead) lookX = rx * 0.9;
    if (Math.abs(ry) > dead) lookY = ry * 0.7;

    if (pad.buttons[0]?.pressed) inspectNearest();
    if (pad.buttons[2]?.pressed) toggleFlashlight();
    if (pad.buttons[10]?.pressed) wantsSprintP1 = true;
  }

  const moving = moveX !== 0 || moveZ !== 0;
  const sprint = wantsSprintP1 && moving && gameplayState.stamina > 0 && !gameplayState.sprintExhausted;
  gameplayState.stamina = THREE.MathUtils.clamp(gameplayState.stamina + (sprint ? -28 : 24) * delta, 0, 100);
  if (sprint) {
    window.statStaminaDrained = (window.statStaminaDrained || 0) + 34 * delta;
  }
  if (gameplayState.stamina <= 0 && !gameplayState.sprintExhausted) {
    gameplayState.sprintExhausted = true;
    caption.textContent = "Aarav is winded. Release Shift to recover.";
  }
  if (!wantsSprintP1 && gameplayState.stamina > 35) gameplayState.sprintExhausted = false;
  const speed = sprint ? 5.8 : 3.2;

  gameplayState.yaw -= lookX * delta * 1.7;
  gameplayState.pitch = THREE.MathUtils.clamp(gameplayState.pitch - lookY * delta * 1.25, -1.1, 1.1);
  camera.rotation.set(gameplayState.pitch, gameplayState.yaw, 0, "YXZ");

  const direction = new THREE.Vector3(moveX, 0, moveZ).normalize().multiplyScalar(speed * delta);
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), gameplayState.yaw);
  moveDirection.copy(direction).normalize();
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
  if (scene.userData.player1Character) {
    scene.userData.player1Character.position.copy(camera.position);
    scene.userData.player1Character.position.y = 0;
    scene.userData.player1Character.rotation.set(0, gameplayState.yaw, 0);
  }

  // Player 2 controls
  if (coopMode && camera2 && player2Character) {
    const forward2 = Number(player2Keys.has("ArrowUp")) - Number(player2Keys.has("ArrowDown"));
    const strafe2 = Number(player2Keys.has("ArrowRight")) - Number(player2Keys.has("ArrowLeft"));
    const wantsSprint2 = player2Keys.has("ShiftRight");
    const moving2 = forward2 !== 0 || strafe2 !== 0;
    const sprint2 = wantsSprint2 && moving2 && gameplayState.stamina2 > 0 && !gameplayState.sprintExhausted2;
    gameplayState.stamina2 = THREE.MathUtils.clamp(gameplayState.stamina2 + (sprint2 ? -34 : 22) * delta, 0, 100);
    if (sprint2) {
      window.statStaminaDrained = (window.statStaminaDrained || 0) + 34 * delta;
    }
    if (gameplayState.stamina2 <= 0 && !gameplayState.sprintExhausted2) {
      gameplayState.sprintExhausted2 = true;
    }
    if (!wantsSprint2 && gameplayState.stamina2 > 35) gameplayState.sprintExhausted2 = false;
    const speed2 = sprint2 ? 5.4 : 3.0;

    let gpForward = forward2;
    let gpStrafe = strafe2;
    let gpLookX = 0;
    let gpLookY = 0;
    let gpSprint = sprint2;
    
    // For Player 2, check pads[1] first if available, otherwise pads[0]
    const pad2 = pads[1] || pads[0];
    if (pad2 && pad2 !== pad) {
      const lx = pad2.axes[0] ?? 0;
      const ly = pad2.axes[1] ?? 0;
      const rx = pad2.axes[2] ?? 0;
      const ry = pad2.axes[3] ?? 0;
      const dead = 0.18;
      
      if (Math.abs(lx) > dead) gpStrafe = lx;
      if (Math.abs(ly) > dead) gpForward = -ly;
      if (Math.abs(rx) > dead) gpLookX = rx;
      if (Math.abs(ry) > dead) gpLookY = ry;
      if (pad2.buttons[10]?.pressed) gpSprint = true;
    }

    // P2 keyboard rotate look using Period / Slash if no controller is attached
    const lookX2 = Number(player2Keys.has("Period")) - Number(player2Keys.has("Slash"));
    gameplayState.player2Yaw -= (lookX2 * 1.7 + gpLookX * 1.5) * delta;
    gameplayState.player2Pitch = THREE.MathUtils.clamp(gameplayState.player2Pitch - gpLookY * delta * 1.25, -1.1, 1.1);
    camera2.rotation.set(gameplayState.player2Pitch, gameplayState.player2Yaw, 0, "YXZ");

    const direction2 = new THREE.Vector3(gpStrafe, 0, gpForward).normalize().multiplyScalar(speed2 * delta);
    direction2.applyAxisAngle(new THREE.Vector3(0, 1, 0), gameplayState.player2Yaw);
    moveDirection2.copy(direction2).normalize();
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
    player2Character.rotation.set(0, gameplayState.player2Yaw, 0);
  }

  // Footstep audio triggering logic
  if (moving) {
    const stepInterval = sprint ? 0.34 : 0.56;
    gameplayState.footstepTimer += delta;
    if (gameplayState.footstepTimer >= stepInterval) {
      gameplayState.footstepTimer = 0;
      const inDorm = Math.abs(camera.position.x) > 3.0 && (camera.position.z <= -29 && camera.position.z >= -41);
      const stepSound = inDorm ? "step_tile" : "step_concrete";
      audioManager.playSound(stepSound, { volume: sprint ? 0.32 : 0.18 });
    }
  } else {
    gameplayState.footstepTimer = 0.35;
  }
}

// commit-ref: 1
// commit-ref: 2
// commit-ref: 21
// commit-ref: 22
// commit-ref: 41