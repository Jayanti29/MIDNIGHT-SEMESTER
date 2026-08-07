// @ts-nocheck
import { createProceduralHumanoidSkeleton } from "./humanoidSkeleton.js";

export function updateHumanoidAnimations(humanoid, speed, time, animState = "auto") {
  const hips = humanoid.userData.hips;
  const leftLeg = humanoid.userData.leftLeg;
  const rightLeg = humanoid.userData.rightLeg;
  const leftArm = humanoid.userData.leftArm;
  const rightArm = humanoid.userData.rightArm;
  const spine = humanoid.userData.spine;
  const head = humanoid.userData.head;
  if (!hips || !leftLeg || !rightLeg) return;

  if (animState === "sit" || humanoid.userData.isSitting) {
    hips.position.y = 0.45;
    leftLeg.rotation.x = -1.45;
    rightLeg.rotation.x = -1.45;
    if (leftArm && rightArm) {
      leftArm.rotation.x = -0.3;
      rightArm.rotation.x = -0.3;
      leftArm.rotation.z = 0.1;
      rightArm.rotation.z = -0.1;
    }
    return;
  }

  const isReaching = animState === "reach" || humanoid.userData.reachTimer > 0;
  if (humanoid.userData.reachTimer > 0) {
    humanoid.userData.reachTimer -= 0.016;
  }

  if (speed > 0.05) {
    const isSprint = speed > 4.5;
    const strideFreq = isSprint ? 11.0 : 7.5;
    const ampLeg = isSprint ? 0.65 : 0.42;
    const ampArm = isSprint ? 0.55 : 0.28;
    const cycle = time * speed * strideFreq;

    leftLeg.rotation.x = Math.sin(cycle) * ampLeg;
    rightLeg.rotation.x = -Math.sin(cycle) * ampLeg;
    
    if (leftArm && rightArm) {
      leftArm.rotation.x = -Math.sin(cycle) * ampArm;
      if (isReaching) {
        rightArm.rotation.x = -1.25;
        rightArm.rotation.z = -0.1;
      } else {
        rightArm.rotation.x = Math.sin(cycle) * ampArm;
        rightArm.rotation.z = -0.08;
      }
    }
    hips.position.y = 0.9 + Math.abs(Math.sin(cycle * 2)) * (isSprint ? 0.06 : 0.04);
  } else {
    // Idle pose
    hips.position.y = 0.9 + Math.sin(time * 1.5) * 0.015;
    leftLeg.rotation.x = 0;
    rightLeg.rotation.x = 0;
    if (leftArm && rightArm) {
      leftArm.rotation.z = 0.08 + Math.sin(time * 1.5) * 0.02;
      leftArm.rotation.x = 0;
      if (isReaching) {
        rightArm.rotation.x = -1.25;
        rightArm.rotation.z = -0.1;
      } else {
        rightArm.rotation.z = -0.08 - Math.sin(time * 1.5) * 0.02;
        rightArm.rotation.x = 0;
      }
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
