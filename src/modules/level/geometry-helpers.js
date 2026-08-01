// @ts-nocheck
import * as THREE from "three";
import { scene, activeLevelGroup, colliders } from "../../main.js";

export function registerCollider(object) {
  if (!object) return;
  object.updateMatrixWorld(true);
  const box3 = new THREE.Box3().setFromObject(object);
  const targetColliders = colliders || window.colliders;
  if (targetColliders && Array.isArray(targetColliders)) {
    targetColliders.push({
      xMin: box3.min.x,
      xMax: box3.max.x,
      zMin: box3.min.z,
      zMax: box3.max.z,
      name: object.name || "obstacle"
    });
  }
}

export function addToActiveLevel(object) {
  if (activeLevelGroup) {
    activeLevelGroup.add(object);
  } else {
    scene.add(object);
  }
}

export function box(name, size, position, material, cast = true, receive = true, isCollider = false) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  addToActiveLevel(mesh);
  if (isCollider) {
    registerCollider(mesh);
  }
  return mesh;
}

export function tagInteractable(object, type, label) {
  object.userData.interactable = true;
  object.userData.interactionType = type;
  object.userData.interactionLabel = label;
  return object;
}
