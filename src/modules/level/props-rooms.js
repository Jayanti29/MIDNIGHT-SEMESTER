// @ts-nocheck
import * as THREE from "three";
import {
  scene,
  materials,
  interactables,
  flickerLights,
  buildEcgSensorsProp
} from "../../main.js";
import {
  buildMetronome,
  buildTapeRecorder,
  buildPillboxProp
} from "./props-interactive.js";
import { box, addToActiveLevel, tagInteractable, registerCollider } from "./geometry-helpers.js";
import { createBookStack, createBookshelf } from "./props-furniture.js";

export function buildDormRoom() {
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

  const diaryPage = box("Meera's Diary Page", [0.34, 0.02, 0.24], [-3.1, 0.83, roomZ - 1.6], materials.paper);
  tagInteractable(diaryPage, "lore_note", "Meera's Diary Page");
  diaryPage.userData.loreText = "October 12, 2004. The noise in the walls isn't random. It's a sequence. 42, 18, 5, 0... If I stop counting, the doors stay locked. If I sleep, they change the sequence.";
  diaryPage.userData.loreLabel = "Meera's Diary Page";
  dormGroup.attach(diaryPage);
  interactables.push(diaryPage);

  const reportPage = box("Capstone Project Report", [0.34, 0.02, 0.24], [0.8, 1.13, roomZ - 4.4], materials.paper);
  tagInteractable(reportPage, "lore_note", "Capstone Project Report");
  reportPage.userData.loreText = "Ravenswood Capstone 2026 - Aarav Mehta. Topic: Neural Synchronization via Low-Frequency Audio Stimuli. Notes: The backup grid in Block A still hums at 12Hz, exactly matching the target frequency from the 2004 experiments.";
  reportPage.userData.loreLabel = "Capstone Project Report";
  dormGroup.attach(reportPage);
  interactables.push(reportPage);

  buildMetronome([-0.6, 1.11, roomZ - 4.4], dormGroup);
  buildTapeRecorder([0.6, 1.11, roomZ - 4.4], dormGroup);
  buildPillboxProp([0.0, 1.11, roomZ - 4.25], dormGroup, "dorm");
  buildEcgSensorsProp([-0.3, 1.11, roomZ - 4.25], dormGroup);

  addToActiveLevel(dormGroup);
}

export function buildFilingCabinetProp(position, parentGroup) {
  const group = new THREE.Group();
  group.name = "filing_cabinet_prop";
  group.position.set(...position);

  const bodyGeo = new THREE.BoxGeometry(0.8, 1.4, 0.62);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4f545a, metalness: 0.6, roughness: 0.4 });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  const drawerFaceGeo = new THREE.BoxGeometry(0.72, 0.28, 0.02);
  const drawerFaceMat = new THREE.MeshStandardMaterial({ color: 0x3d4145, metalness: 0.6, roughness: 0.4 });
  const handleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8);
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1 });

  for (let i = 0; i < 4; i++) {
    const yOffset = 0.45 - i * 0.3;
    const drawerFace = new THREE.Mesh(drawerFaceGeo, drawerFaceMat);
    drawerFace.position.set(0, yOffset, 0.3);
    group.add(drawerFace);

    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, yOffset, 0.325);
    group.add(handle);
  }

  tagInteractable(bodyMesh, "filing_cabinet", "Filing Cabinet");
  bodyMesh.userData.parentCabinet = group;

  parentGroup.attach(group);
  interactables.push(bodyMesh);
}

export function buildDecryptorTerminalProp(position, parentGroup) {
  const group = new THREE.Group();
  group.name = "decryptor_terminal_prop";
  group.position.set(...position);

  const screenLight = new THREE.PointLight(0x00ff33, 10.0, 2.5, 2.0);
  screenLight.position.set(0, 0.72, 0.4);
  group.add(screenLight);
  flickerLights.push({ light: screenLight, base: screenLight.intensity, phase: Math.random() * Math.PI * 2 });

  const baseGeo = new THREE.BoxGeometry(0.9, 0.9, 0.75);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x242729, metalness: 0.6, roughness: 0.5 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);
  registerCollider(baseMesh);

  const kbShelfGeo = new THREE.BoxGeometry(0.8, 0.08, 0.38);
  const kbShelf = new THREE.Mesh(kbShelfGeo, baseMat);
  kbShelf.position.set(0, 0.45, 0.22);
  group.add(kbShelf);

  const keysGeo = new THREE.BoxGeometry(0.65, 0.02, 0.22);
  const keysMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
  const keys = new THREE.Mesh(keysGeo, keysMat);
  keys.position.set(0, 0.49, 0.25);
  group.add(keys);

  const crtGeo = new THREE.BoxGeometry(0.68, 0.55, 0.55);
  const crtMat = new THREE.MeshStandardMaterial({ color: 0x3d4145, roughness: 0.4 });
  const crtMesh = new THREE.Mesh(crtGeo, crtMat);
  crtMesh.position.set(0, 0.72, 0.05);
  group.add(crtMesh);

  const bezelGeo = new THREE.BoxGeometry(0.58, 0.45, 0.02);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x1e2022, roughness: 0.5 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.set(0, 0.72, 0.325);
  group.add(bezel);

  const screenGeo = new THREE.BoxGeometry(0.48, 0.35, 0.01);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x39ff14 });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0.72, 0.332);
  group.add(screenMesh);

  const ventMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  const vent1 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.3, 0.4), ventMat);
  vent1.position.set(-0.345, 0.72, 0.05);
  group.add(vent1);

  const vent2 = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.3, 0.4), ventMat);
  vent2.position.set(0.345, 0.72, 0.05);
  group.add(vent2);

  tagInteractable(screenMesh, "decryptor_terminal", "Decryptor Terminal");
  screenMesh.userData.parentTerminal = group;

  parentGroup.attach(group);
  interactables.push(screenMesh);
}

// commit-ref: 202
// commit-ref: 204
// commit-ref: 208
// commit-ref: 212
// commit-ref: 214
// commit-ref: 218