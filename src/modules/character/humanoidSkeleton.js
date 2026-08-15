// @ts-nocheck
import * as THREE from "three";

export function createProceduralHumanoidSkeleton({
  name,
  position,
  isGhost = false,
  identity = "",
  outfitColorOverride = null,
  hairStyleOverride = null,
  hasGlassesOverride = null,
  hasBackpackOverride = null,
  skinColorOverride = null
}) {
  const hips = new THREE.Bone();
  hips.name = "mixamorigHips";
  hips.position.set(0, 0.9, 0);
  const spine = new THREE.Bone();
  spine.name = "mixamorigSpine";
  spine.position.set(0, 0.25, 0);
  hips.add(spine);
  const neck = new THREE.Bone();
  neck.name = "mixamorigNeck";
  neck.position.set(0, 0.38, 0);
  spine.add(neck);
  const head = new THREE.Bone();
  head.name = "mixamorigHead";
  head.position.set(0, 0.16, 0);
  neck.add(head);
  const leftShoulder = new THREE.Bone();
  leftShoulder.name = "mixamorigLeftShoulder";
  leftShoulder.position.set(-0.16, 0.32, 0);
  spine.add(leftShoulder);
  const leftArm = new THREE.Bone();
  leftArm.name = "mixamorigLeftArm";
  leftArm.position.set(-0.22, 0, 0);
  leftShoulder.add(leftArm);
  const rightShoulder = new THREE.Bone();
  rightShoulder.name = "mixamorigRightShoulder";
  rightShoulder.position.set(0.16, 0.32, 0);
  spine.add(rightShoulder);
  const rightArm = new THREE.Bone();
  rightArm.name = "mixamorigRightArm";
  rightArm.position.set(0.22, 0, 0);
  rightShoulder.add(rightArm);
  const leftUpLeg = new THREE.Bone();
  leftUpLeg.name = "mixamorigLeftUpLeg";
  leftUpLeg.position.set(-0.12, -0.08, 0);
  hips.add(leftUpLeg);
  const leftLeg = new THREE.Bone();
  leftLeg.name = "mixamorigLeftLeg";
  leftLeg.position.set(0, -0.38, 0);
  leftUpLeg.add(leftLeg);
  const rightUpLeg = new THREE.Bone();
  rightUpLeg.name = "mixamorigRightUpLeg";
  rightUpLeg.position.set(0.12, -0.08, 0);
  hips.add(rightUpLeg);
  const rightLeg = new THREE.Bone();
  rightLeg.name = "mixamorigRightLeg";
  rightLeg.position.set(0, -0.38, 0);
  rightUpLeg.add(rightLeg);
  const bones = [
    hips, spine, neck, head,
    leftShoulder, leftArm,
    rightShoulder, rightArm,
    leftUpLeg, leftLeg,
    rightUpLeg, rightLeg
  ];
  const skeleton = new THREE.Skeleton(bones);
  const group = new THREE.Group();
  group.name = name;
  group.position.set(...position);
  group.add(hips);
  let outfitColor = outfitColorOverride ? new THREE.Color(outfitColorOverride) : 0x243f5e;
  let skinColor = 0xfcd0a1;
  let hairColor = 0x111111;
  let hairLength = "short";
  let hasGlasses = false;
  let hasCap = false;
  let hasBackpack = false;
  let isAarav = (identity === "Aarav" || name.includes("Aarav"));
  let isPriya = (identity === "Priya" || name.includes("Priya"));
  let isRohan = (identity === "Rohan" || name.includes("Rohan"));
  let isSam = (identity === "Sam" || name.includes("Sam"));
  let isKulkarni = (identity === "Kulkarni" || name.includes("Kulkarni"));

  if (isGhost) {
    outfitColor = 0xffffff;
    hairLength = "long";
    skinColor = 0xe0eee9;
  } else {
    if (isAarav) {
      outfitColor = outfitColorOverride ? new THREE.Color(outfitColorOverride) : 0x1a1a1a;
      skinColor = 0xe3a072;
    } else if (isPriya) {
      outfitColor = outfitColorOverride ? new THREE.Color(outfitColorOverride) : 0x1e2d4a;
      hairColor = 0x2e1a0c;
      hairLength = "long";
      skinColor = 0xfac08f;
    } else if (isRohan) {
      outfitColor = outfitColorOverride ? new THREE.Color(outfitColorOverride) : 0x111111;
      hairColor = 0xdadada;
      hairLength = "short";
      skinColor = 0xfcd0a1;
    } else if (isSam) {
      outfitColor = outfitColorOverride ? new THREE.Color(outfitColorOverride) : 0x422b1c;
      hasCap = false;
      skinColor = 0xa1683d;
    } else if (isKulkarni) {
      outfitColor = outfitColorOverride ? new THREE.Color(outfitColorOverride) : 0x5a5a5a;
      hairColor = 0x8c8c8c;
      hasGlasses = true;
    }
  }

  if (skinColorOverride) {
    skinColor = new THREE.Color(skinColorOverride);
  }

  if (hasGlassesOverride !== null) {
    hasGlasses = hasGlassesOverride;
  }

  if (hasBackpackOverride !== null) {
    hasBackpack = hasBackpackOverride;
  }

  if (hairStyleOverride) {
    if (hairStyleOverride === "long") {
      hairLength = "long";
      hasCap = false;
    } else if (hairStyleOverride === "cap") {
      hairLength = "short";
      hasCap = true;
    } else if (hairStyleOverride === "short") {
      hairLength = "short";
      hasCap = false;
    } else if (hairStyleOverride === "buzzed") {
      hairLength = "buzzed";
      hasCap = false;
    } else if (hairStyleOverride === "ponytail") {
      hairLength = "ponytail";
      hasCap = false;
    }
  }

  const outfitMat = new THREE.MeshStandardMaterial({
    color: outfitColor,
    roughness: 0.74,
    transparent: isGhost,
    opacity: isGhost ? 0.45 : 1.0,
    emissive: isGhost ? outfitColor : 0x000000,
    emissiveIntensity: isGhost ? 0.28 : 0
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: isGhost ? 0xc9d5cf : 0x222831,
    roughness: 0.85,
    transparent: isGhost,
    opacity: isGhost ? 0.45 : 1.0,
    emissive: isGhost ? 0xc9d5cf : 0x000000,
    emissiveIntensity: isGhost ? 0.28 : 0
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: isGhost ? 0xc9d5cf : 0xeeeeee,
    roughness: 0.8,
    transparent: isGhost,
    opacity: isGhost ? 0.45 : 1.0,
    emissive: isGhost ? 0xc9d5cf : 0x000000,
    emissiveIntensity: isGhost ? 0.28 : 0
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.8,
    transparent: isGhost,
    opacity: isGhost ? 0.45 : 1.0,
    emissive: isGhost ? skinColor : 0x000000,
    emissiveIntensity: isGhost ? 0.28 : 0
  });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: isGhost ? 0xb22822 : 0x222222 });

  const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.33, 8), outfitMat);
  shirt.name = "shirt";
  shirt.position.y = 0.39;
  shirt.castShadow = true;
  shirt.receiveShadow = true;
  spine.add(shirt);

  if (isPriya) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    collar.position.y = 0.54;
    spine.add(collar);

    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.14, 0.015), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
    tie.position.set(0, 0.43, 0.205);
    spine.add(tie);
  } else if (isGhost) {
    const cyanBand = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 8), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.0 }));
    cyanBand.position.y = 0.54;
    spine.add(cyanBand);
  }

  const pants = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.22, 8), pantsMat);
  pants.name = "pants";
  pants.position.y = 0.115;
  pants.castShadow = true;
  pants.receiveShadow = true;
  spine.add(pants);

  const beltMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.025, 8), beltMat);
  belt.name = "belt";
  belt.position.y = 0.225;
  spine.add(belt);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), skinMat);
  headMesh.name = "head_sphere";
  headMesh.position.y = 0.12;
  headMesh.castShadow = true;
  head.add(headMesh);

  if (isAarav) {
    // Curved overhead headphone arch band wrapping neatly around the head without clipping
    const hBandGeo = new THREE.TorusGeometry(0.19, 0.012, 8, 16, Math.PI);
    const hBandMat = new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.5, metalness: 0.2 });
    const hBand = new THREE.Mesh(hBandGeo, hBandMat);
    hBand.name = "headphones_band";
    hBand.position.set(0, 0.12, 0);
    hBand.rotation.x = -Math.PI / 2;
    head.add(hBand);

    const cupMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.4 });
    const cupL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.035, 12), cupMat);
    cupL.name = "headphone_cup_L";
    cupL.position.set(-0.195, 0.12, 0.01);
    cupL.rotation.z = Math.PI / 2;
    head.add(cupL);

    const cupR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.035, 12), cupMat);
    cupR.name = "headphone_cup_R";
    cupR.position.set(0.195, 0.12, 0.01);
    cupR.rotation.z = Math.PI / 2;
    head.add(cupR);
  }

  if (isPriya) {
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.022, 0.052), new THREE.MeshStandardMaterial({ color: 0x4a90e2, metalness: 0.5 }));
    clip.position.set(0.16, 0.16, 0.08);
    clip.rotation.y = Math.PI / 4;
    head.add(clip);
  }

  if (!isGhost) {
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 4), skinMat);
    nose.name = "nose";
    nose.position.set(0, 0.11, 0.185);
    nose.rotation.x = Math.PI / 4;
    head.add(nose);

    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), skinMat);
    earL.name = "ear_L";
    earL.position.set(-0.18, 0.12, 0.01);
    head.add(earL);

    const earR = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), skinMat);
    earR.name = "ear_R";
    earR.position.set(0.18, 0.12, 0.01);
    head.add(earR);

    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x5c1d1d });
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.025), mouthMat);
    mouth.name = "mouth";
    mouth.position.set(0, 0.05, 0.17);
    head.add(mouth);
  }

  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
  leftEye.position.set(-0.07, 0.14, 0.14);
  head.add(leftEye);
  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
  rightEye.position.set(0.07, 0.14, 0.14);
  head.add(rightEye);

  const armMat = isRohan ? skinMat : outfitMat;

  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.06), armMat);
  armL.name = "left_arm";
  armL.position.y = -0.16;
  armL.castShadow = true;
  leftArm.add(armL);

  if (isGhost) {
    const bandL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.03, 0.065), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.0 }));
    bandL.position.y = -0.12;
    leftArm.add(bandL);
  }

  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), skinMat);
  handL.name = "left_hand";
  handL.position.y = -0.35;
  handL.castShadow = true;
  leftArm.add(handL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.06), armMat);
  armR.name = "right_arm";
  armR.position.y = -0.16;
  armR.castShadow = true;
  rightArm.add(armR);

  if (isGhost) {
    const bandR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.03, 0.065), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.0 }));
    bandR.position.y = -0.12;
    rightArm.add(bandR);
  }

  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), skinMat);
  handR.name = "right_hand";
  handR.position.y = -0.35;
  handR.castShadow = true;
  rightArm.add(handR);

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), pantsMat);
  legL.name = "left_leg";
  legL.position.y = -0.2;
  legL.castShadow = true;
  leftLeg.add(legL);

  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.14), shoeMat);
  shoeL.name = "left_shoe";
  shoeL.position.set(0, -0.42, 0.03);
  shoeL.castShadow = true;
  leftLeg.add(shoeL);

  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), pantsMat);
  legR.name = "right_leg";
  legR.position.y = -0.2;
  legR.castShadow = true;
  rightLeg.add(legR);

  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.14), shoeMat);
  shoeR.name = "right_shoe";
  shoeR.position.set(0, -0.42, 0.03);
  shoeR.castShadow = true;
  rightLeg.add(shoeR);

  if (hasBackpack) {
    const backpackMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });
    const backpackBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.12), backpackMat);
    backpackBody.name = "backpack";
    backpackBody.position.set(0, 0.28, -0.22);
    backpackBody.castShadow = true;
    spine.add(backpackBody);

    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.36, 0.02), backpackMat);
    strapL.name = "backpack_strap_L";
    strapL.position.set(-0.11, 0.28, -0.11);
    spine.add(strapL);

    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.36, 0.02), backpackMat);
    strapR.name = "backpack_strap_R";
    strapR.position.set(0.11, 0.28, -0.11);
    spine.add(strapR);
  }

  if (hasGlasses) {
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.015), frameMat);
    bridge.position.set(0, 0.14, 0.16);
    head.add(bridge);
    const lensL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.01), frameMat);
    lensL.position.set(-0.06, 0.14, 0.16);
    head.add(lensL);
    const lensR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.01), frameMat);
    lensR.position.set(0.06, 0.14, 0.16);
    head.add(lensR);
  }

  if (hasCap) {
    const capMat = new THREE.MeshStandardMaterial({ color: 0x243f5e, roughness: 0.8 });
    const capDome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), capMat);
    capDome.name = "cap_dome";
    capDome.position.set(0, 0.22, 0);
    head.add(capDome);
    const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.12), capMat);
    capVisor.name = "cap_visor";
    capVisor.position.set(0, 0.2, 0.18);
    head.add(capVisor);
  } else {
    if (hairLength === "buzzed") {
      const hairBuzzed = new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
      hairBuzzed.name = "hair_buzzed";
      hairBuzzed.position.set(0, 0.09, 0);
      hairBuzzed.rotation.x = -Math.PI * 0.1;
      head.add(hairBuzzed);
    } else {
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
      hairCap.name = "hair_short_cap";
      hairCap.position.set(0, 0.08, 0);
      hairCap.rotation.x = -Math.PI * 0.15;
      head.add(hairCap);

      const sideburnL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.04), hairMat);
      sideburnL.position.set(-0.17, 0.08, 0.04);
      head.add(sideburnL);
      const sideburnR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.04), hairMat);
      sideburnR.position.set(0.17, 0.08, 0.04);
      head.add(sideburnR);
    }
  }

  if (hairLength === "long") {
    const lockL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52, 0.1), hairMat);
    lockL.name = "hair_long_L";
    lockL.position.set(-0.16, 0.06, 0.04);
    head.add(lockL);
    const lockR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52, 0.1), hairMat);
    lockR.name = "hair_long_R";
    lockR.position.set(0.16, 0.06, 0.04);
    head.add(lockR);
  } else if (hairLength === "ponytail") {
    const ponytail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.04), hairMat);
    ponytail.name = "hair_ponytail";
    ponytail.position.set(0, 0.20, -0.2);
    ponytail.rotation.x = -Math.PI / 6;
    head.add(ponytail);
  }

  if (isGhost) {
    neck.rotation.z = -0.32;
    neck.rotation.x = 0.22;
    leftShoulder.rotation.set(-0.4, 0.1, -0.5);
    rightShoulder.rotation.set(0.5, -0.2, 0.7);
    const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.08, 12), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    mouth.position.set(0, 0.07, 0.15);
    mouth.rotation.x = Math.PI / 2;
    head.add(mouth);
  }

  group.userData = {
    skeleton,
    hips,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    leftShoulder,
    rightShoulder,
    neck,
    spine,
    head
  };
  return group;
}

// commit-ref: 51
// commit-ref: 52
// commit-ref: 53
// commit-ref: 61
// commit-ref: 62
// commit-ref: 63
// commit-ref: 71
// commit-ref: 72
// commit-ref: 73
// commit-ref: 81
// commit-ref: 82
// commit-ref: 83
// commit-ref: 91
// commit-ref: 92
// commit-ref: 93
// commit-ref: 101
// commit-ref: 102
// commit-ref: 103
// commit-ref: 111
// commit-ref: 112
// commit-ref: 113
// commit-ref: 51
// commit-ref: 52