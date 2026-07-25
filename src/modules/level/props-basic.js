import * as THREE from "three";
import { addToActiveLevel, tagInteractable, registerCollider } from "./geometry-helpers.js";

export function buildLocker(position, label) {
  const group = new THREE.Group();
  group.position.set(...position);
  
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2e2720, roughness: 0.82 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.2, 0.85), frameMat);
  frame.position.set(0, 1.1, 0);
  frame.castShadow = true;
  frame.receiveShadow = true;
  group.add(frame);
  
  const doorSlat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 2.0, 0.05), new THREE.MeshStandardMaterial({ color: 0x120d0a, roughness: 0.95 }));
  doorSlat.position.set(0, 1.1, 0.41);
  group.add(doorSlat);
  
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.04), new THREE.MeshStandardMaterial({ color: 0xaa7a36, metalness: 0.8, roughness: 0.3 }));
  handle.position.set(-0.3, 1.1, 0.44);
  group.add(handle);
  
  addToActiveLevel(group);
  
  tagInteractable(frame, "hiding_spot", label);
  frame.userData.lockerGroup = group;
  
  registerCollider(frame);
  return group;
}

export function buildDebrisItem(position, name) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.name = name;
  
  const can = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: 0x8a715f, roughness: 0.9, metalness: 0.3 })
  );
  can.position.set(0, 0.175, 0);
  can.castShadow = true;
  group.add(can);
  
  addToActiveLevel(group);
  tagInteractable(can, "debris_can", "Rusted Can");
  can.userData.parentGroup = group;
  return group;
}
