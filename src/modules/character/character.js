// @ts-nocheck
import { createProceduralHumanoidSkeleton } from "./humanoidSkeleton.js";

export function updateHumanoidAnimations(humanoid, speed, time) {
  const hips = humanoid.userData.hips;
  const leftLeg = humanoid.userData.leftLeg;
  const rightLeg = humanoid.userData.rightLeg;
  const leftArm = humanoid.userData.leftArm;
  const rightArm = humanoid.userData.rightArm;
  if (!hips || !leftLeg || !rightLeg) return;
  if (speed > 0.05) {
    const cycle = time * speed * 7.5;
    leftLeg.rotation.x = Math.sin(cycle) * 0.42;
    rightLeg.rotation.x = -Math.sin(cycle) * 0.42;
    if (leftArm && rightArm) {
      leftArm.rotation.x = -Math.sin(cycle) * 0.28;
      rightArm.rotation.x = Math.sin(cycle) * 0.28;
    }
    hips.position.y = 0.9 + Math.abs(Math.sin(cycle * 2)) * 0.04;
  } else {
    hips.position.y = 0.9 + Math.sin(time * 1.5) * 0.015;
    leftLeg.rotation.x = 0;
    rightLeg.rotation.x = 0;
    if (leftArm && rightArm) {
      leftArm.rotation.z = 0.08 + Math.sin(time * 1.5) * 0.02;
      rightArm.rotation.z = -0.08 - Math.sin(time * 1.5) * 0.02;
    }
  }
}

export function createCharacter({
  name,
  position,
  color,
  ghostly = false,
  identity = "",
  outfitColorOverride = null,
  hairStyleOverride = null,
  hasGlassesOverride = null,
  hasBackpackOverride = null,
  skinColorOverride = null
}) {
  const group = createProceduralHumanoidSkeleton({
    name,
    position,
    isGhost: ghostly,
    identity,
    outfitColorOverride,
    hairStyleOverride,
    hasGlassesOverride,
    hasBackpackOverride,
    skinColorOverride
  });
  return group;
}
