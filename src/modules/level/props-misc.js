import * as THREE from "three";
import { materials, interactables } from "../../main.js";
import { box, addToActiveLevel, tagInteractable } from "./geometry-helpers.js";

export function buildBatteryMesh(position, name) {
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

export function buildCheckpointConsole(position, name) {
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

export function buildLoreNote(position, rotation, text, label) {
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
