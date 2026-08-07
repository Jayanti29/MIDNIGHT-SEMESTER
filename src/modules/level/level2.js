// @ts-nocheck
import * as THREE from "three";
import {
  scene,
  materials,
  interactables,
  camera,
  camera2,
  player2Character,
  evidenceItems,
  batteryItems,
  flickerLights,
  level1Group,
  level2Group,
  disposeLevel,
  clearGroup,
  sayLine,
  audioManager,
  updateObjectivesSystem,
  addTaskLog,
  queueStory,
  setSamCharacter,
  setSamFlashlight,
  resetLevel2State,
  buildDocuments,
  colliders,
  doors,
  addLabel
} from "../../main.js";
import { createCharacter } from "../character/index.js";
import { createFlashlightCookie } from "../textures/index.js";
import { box, addToActiveLevel, tagInteractable, registerCollider } from "./geometry-helpers.js";
import { buildLocker, buildDebrisItem } from "./props-basic.js";
import { buildPillboxProp } from "./props-interactive.js";
import { buildDormRoom, buildFilingCabinetProp, buildDecryptorTerminalProp } from "./props-rooms.js";
import { buildCheckpointConsole } from "./props-misc.js";

let exitTerminalGroup = null;

export function loadLevel2() {
  disposeLevel();
  level1Group.visible = false;
  level2Group.visible = true;

  resetLevel2State();

  colliders.length = 0;
  interactables.length = 0;
  doors.length = 0;
  evidenceItems.length = 0;
  batteryItems.length = 0;
  flickerLights.length = 0;

  clearGroup(level1Group);
  clearGroup(level2Group);
  buildLevel2();

  camera.position.set(0, 1.7, 8);
  camera.rotation.set(0, 0, 0);

  if (camera2) {
    camera2.position.set(0.8, 1.7, 8);
    camera2.rotation.set(0, 0, 0);
  }

  if (scene.userData.player1Character) {
    scene.userData.player1Character.position.set(0, 0, 8);
    scene.userData.player1Character.rotation.set(0, 0, 0);
  }
  if (player2Character) {
    player2Character.position.set(0.8, 0, 8);
    player2Character.rotation.set(0, 0, 0);
  }

  const caption = document.querySelector("#caption");
  if (caption) {
    caption.textContent = "A cold, damp basement smell. Backup batteries hum in the dark.";
  }
  sayLine("Aarav", "I'm in... it's completely sealed. The generator room should be down the hall.");
  
  if (audioManager) {
    audioManager.playSound("blackout_cue", { volume: 0.5 });
  }

  updateObjectivesSystem();
  addTaskLog("Entered Block A Basement Lab.");
}

export function buildValveMesh(position, id, name) {
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

export function buildConfessionTapeMesh(position) {
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

export function buildExitTerminalMesh(position) {
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

export function buildBookshelfProp(position, parentGroup) {
  const group = new THREE.Group();
  group.name = "bookshelf_prop";
  group.position.set(...position);

  // Main wooden frame
  const frameGeo = new THREE.BoxGeometry(1.2, 2.2, 0.38);
  const frameMesh = new THREE.Mesh(frameGeo, materials.darkWood);
  frameMesh.castShadow = true;
  frameMesh.receiveShadow = true;
  group.add(frameMesh);
  registerCollider(frameMesh);

  // Decorative shelves indent panels
  const indentMat = new THREE.MeshStandardMaterial({ color: 0x1d140e, roughness: 0.9 });
  const frontIndent = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.1, 0.05), indentMat);
  frontIndent.position.set(0, 0, 0.17);
  group.add(frontIndent);

  // Add 4 horizontal shelf boards
  const shelfBoardMat = materials.darkWood;
  for (let i = 0; i < 4; i++) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.34), shelfBoardMat);
    board.position.set(0, -0.8 + i * 0.5, 0.16);
    group.add(board);
  }

  // Populate bookshelves with random book stacks/rows
  const bookColors = [0x5c1d1d, 0x1d3d5c, 0x1d5c34, 0x5c541d, 0x474747];
  for (let shelf = 0; shelf < 4; shelf++) {
    const yPos = -0.8 + shelf * 0.5 + 0.02;
    const numBooks = 6 + Math.floor(Math.random() * 8);
    for (let b = 0; b < numBooks; b++) {
      const bookH = 0.22 + Math.random() * 0.1;
      const bookW = 0.03 + Math.random() * 0.02;
      const bookD = 0.24 + Math.random() * 0.06;
      const bookMat = new THREE.MeshStandardMaterial({
        color: bookColors[Math.floor(Math.random() * bookColors.length)],
        roughness: 0.7
      });
      const book = new THREE.Mesh(new THREE.BoxGeometry(bookW, bookH, bookD), bookMat);
      const xOffset = -0.45 + (b / numBooks) * 0.9;
      book.rotation.y = (Math.random() - 0.5) * 0.15;
      book.position.set(xOffset, yPos + bookH / 2, 0.16);
      group.add(book);
    }
  }

  tagInteractable(frameMesh, "bookshelf", "Bookshelf");
  frameMesh.userData.parentBookshelf = group;
  interactables.push(frameMesh);

  parentGroup.attach(group);
}

export function buildLevel2() {
  box("basement floor", [6, 0.18, 50], [0, -0.1, -15], materials.floor, false, true);
  box("basement ceiling", [6, 0.24, 50], [0, 3.0, -15], materials.wall, false, true);
  
  box("library wall segment front", [0.24, 3.0, 14], [-3.02, 1.41, 3], materials.wall, true, true, true);
  box("library wall segment back", [0.24, 3.0, 24], [-3.02, 1.41, -28], materials.wall, true, true, true);
  
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

  const pillboxGroupL2 = new THREE.Group();
  pillboxGroupL2.name = "basement_pillbox_group";
  pillboxGroupL2.position.set(6.0, 1.1, -19.0);
  buildPillboxProp([0, 0, 0], pillboxGroupL2, "basement");
  addToActiveLevel(pillboxGroupL2);

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

  box("library floor", [6, 0.18, 12], [-6.0, -0.1, -10.0], materials.floor, false, true);
  box("library ceiling", [6, 0.24, 12], [-6.0, 3.0, -10.0], materials.wall, false, true);
  box("library left wall", [0.24, 3.0, 12], [-9.02, 1.41, -10.0], materials.wall, true, true, true);
  box("library back wall", [6, 3.0, 0.24], [-6.0, 1.41, -16.02], materials.wall, true, true, true);
  box("library front wall", [6, 3.0, 0.24], [-6.0, 1.41, -3.98], materials.wall, true, true, true);

  const libraryGroup = new THREE.Group();
  libraryGroup.name = "library_group";
  libraryGroup.position.set(-6.0, 0, -10.0);

  buildBookshelfProp([-2.0, 0, -5.2], libraryGroup);
  buildBookshelfProp([0.0, 0, -5.2], libraryGroup);
  buildBookshelfProp([2.0, 0, -5.2], libraryGroup);
  
  const shelfLeft = new THREE.Group();
  buildBookshelfProp([0, 0, 0], shelfLeft);
  shelfLeft.position.set(-2.6, 0, 0);
  shelfLeft.rotation.y = Math.PI / 2;
  libraryGroup.add(shelfLeft);

  buildFilingCabinetProp([-2.0, 0, 5.0], libraryGroup);
  buildFilingCabinetProp([0.0, 0, 5.0], libraryGroup);
  buildFilingCabinetProp([2.0, 0, 5.0], libraryGroup);

  buildDecryptorTerminalProp([0, 0, -2.0], libraryGroup);

  addToActiveLevel(libraryGroup);

  for (let z = 5; z > -36; z -= 12) {
    const lamp = new THREE.PointLight(0x73d08a, 40.0, 14, 1.5);
    lamp.position.set(0, 2.65, z);
    lamp.castShadow = true;
    addToActiveLevel(lamp);
    flickerLights.push({ light: lamp, base: lamp.intensity, phase: Math.random() * Math.PI * 2 });
    box("lamp shade", [0.9, 0.1, 0.45], [0, 2.58, z], materials.brass);
    box("lamp glow", [0.6, 0.03, 0.22], [0, 2.5, z], materials.emission, false, false);
  }
  
  scene.userData.meeraCharacter = createCharacter({ name: "Meera", position: [0, 0, -32], color: 0xc9d5cf, ghostly: true, identity: "Meera" });
  scene.userData.meeraCharacter.visible = false;
  addToActiveLevel(scene.userData.meeraCharacter);

  const samCharacter = createCharacter({ name: "Sam", position: [1.2, 0, 7.5], color: 0xffffff, identity: "Sam" });
  addToActiveLevel(samCharacter);
  setSamCharacter(samCharacter);

  const samLight = new THREE.SpotLight(0xffecc2, 100.0, 14, Math.PI / 6, 0.45, 1.0);
  samLight.castShadow = true;
  samLight.map = createFlashlightCookie();
  addToActiveLevel(samLight);
  addToActiveLevel(samLight.target);
  setSamFlashlight(samLight);

  queueStory([
    ["Sam", "Aarav, is that you? Thank god. Kulkarni told me you went down here."],
    ["Sam", "I brought a backup light. Let's find the fuel valves and get this grid online together."]
  ]);

  buildLocker([-1.8, 0, -18.0], "Lab Locker 1");
  buildDebrisItem([1.8, 0, -24.0], "can_3");
}

// commit-ref: 210
// commit-ref: 220
// commit-ref: 230