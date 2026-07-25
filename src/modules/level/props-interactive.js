import * as THREE from "three";
import { scene, materials, interactables } from "../../main.js";
import { tagInteractable } from "./geometry-helpers.js";

export function buildTapeRecorder(position, dormGroup) {
  const group = new THREE.Group();
  group.name = "tape_recorder_group";
  group.position.set(...position);

  // Recorder body
  const bodyGeo = new THREE.BoxGeometry(0.26, 0.14, 0.18);
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.darkWood);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Left Reel
  const reelGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 12);
  const reelL = new THREE.Mesh(reelGeo, materials.brass);
  reelL.position.set(-0.06, 0.08, 0);
  reelL.castShadow = true;
  group.add(reelL);

  // Right Reel
  const reelR = new THREE.Mesh(reelGeo, materials.brass);
  reelR.position.set(0.06, 0.08, 0);
  reelR.castShadow = true;
  group.add(reelR);

  // Small speaker grille
  const grilleGeo = new THREE.BoxGeometry(0.08, 0.01, 0.08);
  const grille = new THREE.Mesh(grilleGeo, materials.darkWood);
  grille.position.set(0, 0.075, 0);
  group.add(grille);

  tagInteractable(bodyMesh, "tape_recorder", "Audio Recorder");
  bodyMesh.userData.parentRecorder = group;

  dormGroup.attach(group);
  interactables.push(bodyMesh);
}

export function buildMetronome(position, dormGroup) {
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

export function buildPillboxProp(position, dormGroup, indexName = "1") {
  const group = new THREE.Group();
  group.name = "pillbox_group_" + indexName;
  group.position.set(...position);

  // White cardboard box
  const boxGeo = new THREE.BoxGeometry(0.12, 0.05, 0.08);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.8 });
  const boxMesh = new THREE.Mesh(boxGeo, boxMat);
  boxMesh.castShadow = true;
  boxMesh.receiveShadow = true;
  group.add(boxMesh);

  // Red cross indicator decoration
  const cross1Geo = new THREE.BoxGeometry(0.04, 0.002, 0.01);
  const cross2Geo = new THREE.BoxGeometry(0.01, 0.002, 0.04);
  const crossMat = new THREE.MeshBasicMaterial({ color: 0xcc2929 });
  const cross1 = new THREE.Mesh(cross1Geo, crossMat);
  const cross2 = new THREE.Mesh(cross2Geo, crossMat);
  cross1.position.set(0, 0.026, 0);
  cross2.position.set(0, 0.026, 0);
  group.add(cross1);
  group.add(cross2);

  tagInteractable(boxMesh, "pillbox", "Sanity Pills");
  boxMesh.userData.parentPillbox = group;

  dormGroup.attach(group);
  interactables.push(boxMesh);
}
