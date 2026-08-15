// @ts-nocheck
import * as THREE from "three";
import {
  scene,
  materials,
  interactables,
  flickerLights,
  basementGateGroup,
  level1Group,
  roomBounds,
  createDoor,
  addLabel,
  initBatteries,
  initLoreNotes,
  buildDocuments,
  CampusLayoutBuilder,
  RoomBuilder,
  PropFactory,
  campusLayoutData
} from "../../main.js";
import { createCharacter } from "../character/index.js";
import { box, addToActiveLevel, tagInteractable, registerCollider } from "./geometry-helpers.js";
import { buildLocker, buildDebrisItem } from "./props-basic.js";
import { buildCheckpointConsole } from "./props-misc.js";
import { buildPillboxProp } from "./props-interactive.js";
import { buildDormRoom } from "./props-rooms.js";

export function addSpiderLilies() {
  const lilyMat = new THREE.MeshStandardMaterial({ color: 0xb21818, roughness: 0.9, side: THREE.DoubleSide });
  const lilyGeo = new THREE.BoxGeometry(0.08, 0.01, 0.08); // petal cross
  
  // Scatter lilies along the Level 1 corridor corners (x = -3.22 or 3.22, z between 12 and -48)
  for (let i = 0; i < 75; i++) {
    const side = Math.random() > 0.5 ? -3.22 : 3.22;
    const z = Math.random() * 60 - 48;
    
    const cluster = new THREE.Group();
    cluster.position.set(side + (Math.random() - 0.5) * 0.35, 0.015, z);
    
    // Draw cross star-shaped petals
    const petalCount = Math.floor(Math.random() * 3) + 3;
    for (let p = 0; p < petalCount; p++) {
      const petal = new THREE.Mesh(lilyGeo, lilyMat);
      petal.rotation.y = (p * Math.PI) / petalCount;
      petal.rotation.x = (Math.random() - 0.5) * 0.2;
      petal.position.x = (Math.random() - 0.5) * 0.08;
      petal.position.z = (Math.random() - 0.5) * 0.08;
      cluster.add(petal);
    }
    
    // Green stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.08, 4),
      new THREE.MeshStandardMaterial({ color: 0x224422 })
    );
    stem.position.y = 0.04;
    cluster.add(stem);
    
    addToActiveLevel(cluster);
  }
}

export function buildSegmentedWall(x, side) {
  const wallStart = 13;
  const wallEnd = -49;
  const doorWidth = 1.18;
  const doorZList = [];
  for (let z = 5; z > -46; z -= 7) {
    const doorZ = side === "left" ? z - 2.4 : z + 0.6;
    doorZList.push(doorZ);
  }
  doorZList.sort((a, b) => b - a);

  let currentZ = wallStart;
  doorZList.forEach((doorZ) => {
    const segStart = currentZ;
    const segEnd = doorZ + doorWidth / 2;
    const length = segStart - segEnd;
    if (length > 0.05) {
      const centerZ = segStart - length / 2;
      box(`${side} wall segment`, [0.28, 4, length], [x, 1.85, centerZ], materials.wall, false, true, true);
    }
    // Top arch above the door: height from 2.35 to 3.8
    box(`${side} arch segment`, [0.28, 1.45, doorWidth], [x, 3.08, doorZ], materials.wall, false, true, false);

    currentZ = doorZ - doorWidth / 2;
  });

  const length = currentZ - wallEnd;
  if (length > 0.05) {
    const centerZ = currentZ - length / 2;
    box(`${side} wall segment`, [0.28, 4, length], [x, 1.85, centerZ], materials.wall, false, true, true);
  }
}

export function isDoorCovered(side, doorZ) {
  if (window.campusLayoutData && window.campusLayoutData.blocks) {
    for (const block of window.campusLayoutData.blocks) {
      if (block.rooms) {
        for (const room of block.rooms) {
          const xCenter = block.position[0] + room.offset[0];
          const zCenter = block.position[2] + room.offset[2];
          const d = room.size[2];
          
          const isLeftRoom = xCenter < 0;
          const isLeftDoor = side === "left";
          if (isLeftRoom === isLeftDoor) {
            // Check if doorZ is inside the room's z bounds (with a safety margin)
            if (doorZ >= zCenter - d/2 - 0.5 && doorZ <= zCenter + d/2 + 0.5) {
              return true;
            }
          }
        }
      }
    }
  }
  // Check Room 32 (hardcoded at z = -35, left side)
  if (side === "left" && doorZ >= -41.5 && doorZ <= -28.5) {
    return true;
  }
  return false;
}

export function buildProceduralRoom(side, doorZ, roomName) {
  const direction = side === "left" ? -1 : 1;
  const xCenter = direction * 6.0;
  const zCenter = doorZ;
  const w = 4.5;
  const h = 3.5;
  const d = 5.0;

  const builder = RoomBuilder || window.RoomBuilder;
  const props = PropFactory || window.PropFactory;

  // Build the room geometry using RoomBuilder
  if (builder?.buildRoom) {
    builder.buildRoom(roomName, "dorm", [xCenter, 0, zCenter], [w, h, d]);
  }

  // Add room bounds to roomBounds array so player can occupy it
  roomBounds.push({
    xMin: xCenter - w / 2 - 0.2,
    xMax: xCenter + w / 2 + 0.2,
    zMin: zCenter - d / 2 - 0.2,
    zMax: zCenter + d / 2 + 0.2
  });

  // Spawn simple furniture inside the room
  if (props) {
    const deskPos = [xCenter - direction * 0.8, 0, zCenter - 1.2];
    props.createDesk(deskPos, side === "left" ? Math.PI / 2 : -Math.PI / 2);
    props.createChair([deskPos[0] + direction * 0.5, 0, deskPos[2]], side === "left" ? -Math.PI / 2 : Math.PI / 2);
    props.createBed([xCenter + direction * 0.8, 0, zCenter + 0.8], 0);
    props.createLocker([xCenter - direction * 1.2, 0, zCenter + 1.2], side === "left" ? Math.PI / 2 : -Math.PI / 2);
    props.createTubeLight([xCenter, h - 0.1, zCenter], false);
  }
}

export function buildCorridor() {
  // Call data-driven campus layout builder! Loads gate, academic, dorm, canteens, and restricted basement
  const campusBuilder = CampusLayoutBuilder || window.CampusLayoutBuilder;
  const layout = campusLayoutData || window.campusLayoutData;
  if (campusBuilder?.buildCampus && layout) {
    campusBuilder.buildCampus(layout);
  }

  // Load remaining primary narrative items (Emergency Terminal console, Win Gate, etc.)
  scene.userData.kulkarni = createCharacter({ name: "Professor Kulkarni", position: [-2.4, 0, -15.5], color: 0xffffff, identity: "Kulkarni" });
  tagInteractable(scene.userData.kulkarni, "npc", "Talk to Professor Kulkarni");
  registerCollider(scene.userData.kulkarni);
  addToActiveLevel(scene.userData.kulkarni);

  scene.userData.meeraCharacter = createCharacter({ name: "Meera", position: [2.6, 0, -34.5], color: 0xc9d5cf, ghostly: true, identity: "Meera" });
  addToActiveLevel(scene.userData.meeraCharacter);
  addLabel("BLOCK A HOSTEL WING", [0, 2.55, -10.8], 0.42);

  // Academic Wing Corridor Strobe Light
  const strobeLight = new THREE.PointLight(0xff0000, 30.0, 8, 2.0);
  strobeLight.position.set(3.5, 2.5, -15.0);
  addToActiveLevel(strobeLight);
  flickerLights.push({ light: strobeLight, base: strobeLight.intensity, phase: Math.random() * Math.PI * 2 });

  // Academic Wing Classroom Annex (X > 3.0)
  const consoleTable = box("security_terminal", [0.8, 0.95, 0.8], [2.0, 0.48, -20.0], materials.brass, true, true, true);
  tagInteractable(consoleTable, "security_terminal", "Access Security System");
  const academicDoor = box("academic_door", [0.15, 2.2, 1.0], [3.02, 1.15, -15.0], materials.darkWood, true, true, true);
  tagInteractable(academicDoor, "security_door", "Inspect locked door");
  box("academic_table_1", [1.6, 0.75, 0.8], [6.0, 0.38, -13.0], materials.darkWood, true, true, true);
  box("academic_table_2", [1.6, 0.75, 0.8], [6.0, 0.38, -17.0], materials.darkWood, true, true, true);
  box("academic floor", [8, 0.18, 12], [7.0, -0.1, -15.0], materials.floor, false, true);
  box("academic ceiling", [8, 0.24, 12], [7.0, 3.0, -15.0], materials.wall, false, true);
  box("academic back wall", [8, 3.0, 0.24], [7.0, 1.41, -21.02], materials.wall, true, true, true);
  box("academic front wall", [8, 3.0, 0.24], [7.0, 1.41, -8.98], materials.wall, true, true, true);
  box("academic right wall", [0.24, 3.0, 12], [11.02, 1.41, -15.0], materials.wall, true, true, true);

  // Spawn a blueprint paper on the starting desk
  const blueprintPaper = box("blueprint_map", [0.45, 0.01, 0.35], [0.8, 0.8, -24.8], materials.brass, false, true);
  tagInteractable(blueprintPaper, "blueprint_map", "Read blueprint map");

  // Spawn a pillbox in the main corridor lobby
  const p1PillboxGroup = new THREE.Group();
  p1PillboxGroup.name = "corridor_pillbox";
  level1Group.add(p1PillboxGroup);
  buildPillboxProp([0.8, 0.78, -25.0], p1PillboxGroup, "corridor");

  const newBasementGateGroup = new THREE.Group();
  newBasementGateGroup.name = "basement gate group";
  newBasementGateGroup.position.set(0, 0, -48);
  
  const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 0.28), materials.darkWood);
  gateFrame.position.set(0, 1.9, 0);
  gateFrame.name = "basement gate frame";
  newBasementGateGroup.add(gateFrame);

  const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 0.1), materials.brass);
  gateLeft.position.set(-0.8, 1.7, 0.05);
  gateLeft.name = "basement gate left door";
  tagInteractable(gateLeft, "basement_gate", "Basement Gate Left");
  newBasementGateGroup.add(gateLeft);
  
  const gateRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 0.1), materials.brass);
  gateRight.position.set(0.8, 1.7, 0.05);
  gateRight.name = "basement gate right door";
  tagInteractable(gateRight, "basement_gate", "Basement Gate Right");
  newBasementGateGroup.add(gateRight);

  // Assign back to the exported basementGateGroup binding via window/getter or let them be updated.
  // Since basementGateGroup is a global, we can update it in window:
  window.basementGateGroup = newBasementGateGroup;
  addToActiveLevel(newBasementGateGroup);
  interactables.push(gateLeft, gateRight);
  initBatteries();
  initLoreNotes();
  buildCheckpointConsole([2.8, 0, -18.5], "Emergency Terminal");

  buildLocker([-2.2, 0, -20.0], "Corridor Locker 1");
  buildLocker([2.2, 0, -32.0], "Corridor Locker 2");
  buildDebrisItem([-1.8, 0, -14.0], "can_1");
  buildDebrisItem([1.8, 0, -28.0], "can_2");
  addSpiderLilies();

  // Build segmented walls for the hallway so that rooms have door openings
  buildSegmentedWall(-3.76, "left");
  buildSegmentedWall(3.76, "right");

  // Spawn Priya Sharma NPC in Computer Lab
  scene.userData.priyaNpc = createCharacter({ name: "Priya Sharma", position: [-5.0, 0, -28.0], color: 0xffffff, identity: "Priya" });
  tagInteractable(scene.userData.priyaNpc, "npc", "Talk to Priya Sharma");
  registerCollider(scene.userData.priyaNpc);
  addToActiveLevel(scene.userData.priyaNpc);

  // Spawn Rohan Verma NPC in Library
  scene.userData.rohanNpc = createCharacter({ name: "Rohan Verma", position: [5.0, 0, -28.0], color: 0xffffff, identity: "Rohan" });
  tagInteractable(scene.userData.rohanNpc, "npc", "Talk to Rohan Verma");
  registerCollider(scene.userData.rohanNpc);
  addToActiveLevel(scene.userData.rohanNpc);

  // Spawn Sam Shekhar NPC in Dorm 201
  scene.userData.samNpc = createCharacter({ name: "Sam Shekhar", position: [-5.0, 0, -70.0], color: 0xffffff, identity: "Sam" });
  tagInteractable(scene.userData.samNpc, "npc", "Talk to Sam Shekhar");
  registerCollider(scene.userData.samNpc);
  addToActiveLevel(scene.userData.samNpc);

  // Restore realistic wood panels and interactive door objects along the hallway
  for (let z = 5; z > -46; z -= 7) {
    box("wood panel left", [0.34, 1.15, 3.5], [-3.82, 0.78, z], materials.darkWood, true, true, true);
    box("wood panel right", [0.34, 1.15, 3.5], [3.82, 0.78, z - 2.6], materials.darkWood, true, true, true);
    
    const leftZ = z - 2.4;
    const rightZ = z + 0.6;
    
    createDoor({ side: "left", z: leftZ, label: `Room ${Math.abs(Math.round(leftZ))} left door` });
    createDoor({ side: "right", z: rightZ, label: `Room ${Math.abs(Math.round(rightZ))} right door` });

    if (!isDoorCovered("left", leftZ)) {
      buildProceduralRoom("left", leftZ, `Room ${Math.abs(Math.round(leftZ))} Left`);
    }
    if (!isDoorCovered("right", rightZ)) {
      buildProceduralRoom("right", rightZ, `Room ${Math.abs(Math.round(rightZ))} Right`);
    }
  }

  // Restore missing Level 1 Dorm Room 32 and all narrative item pickups inside it
  buildDormRoom();

  // Spawn the progression evidence documents
  buildDocuments();
}

// commit-ref: 11
// commit-ref: 12
// commit-ref: 17
// commit-ref: 18
// commit-ref: 31
// commit-ref: 32
// commit-ref: 37
// commit-ref: 38
// commit-ref: 206
// commit-ref: 207
// commit-ref: 216
// commit-ref: 217
// commit-ref: 226
// commit-ref: 227
// commit-ref: 236
// commit-ref: 237
// commit-ref: 246
// commit-ref: 247
// commit-ref: 256
// commit-ref: 257
// commit-ref: 266
// commit-ref: 267
// commit-ref: 276
// commit-ref: 277
// commit-ref: 288
// commit-ref: 298
// commit-ref: 308
// commit-ref: 318
// commit-ref: 328
// commit-ref: 338
// commit-ref: 348
// commit-ref: 11
// commit-ref: 12
// commit-ref: 17
// commit-ref: 18
// commit-ref: 31
// commit-ref: 32
// commit-ref: 37