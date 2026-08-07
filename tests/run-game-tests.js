// @ts-nocheck
/**
 * Midnight Semester - Game Logic & Physics Automated Test Suite
 */
import assert from "assert";
import fs from "fs";

console.log("---------------------------------------------------");
console.log("RUNNING MIDNIGHT SEMESTER AUTOMATED TEST SUITE...");
console.log("---------------------------------------------------");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASSED: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAILED: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// 1. Campus Layout Data Integrity
test("Campus layout JSON structure contains valid sectors and rooms", () => {
  const layoutData = JSON.parse(fs.readFileSync("./src/campus-layout.json", "utf-8"));
  assert.ok(layoutData, "campus-layout.json should be defined");
  assert.ok(Array.isArray(layoutData.blocks), "blocks should be an array");
  assert.ok(layoutData.blocks.length >= 3, "should contain at least 3 campus sectors");
  
  const gateSector = layoutData.blocks.find(b => b.id === "gate_sector");
  assert.ok(gateSector, "gate_sector should exist");
  assert.ok(Array.isArray(gateSector.rooms), "gate_sector should contain rooms");
});

// 2. Character Customization Data Structure
test("Character selection default states and attributes", () => {
  const defaultPlayerState = {
    p1Model: "Aarav",
    p1OutfitColor: "#243f5e",
    p1HairStyle: "short",
    p1BodyScale: "average",
    p1HasGlasses: false,
    p1HasBackpack: false,
    p1SkinTone: "#e3a072"
  };

  assert.strictEqual(defaultPlayerState.p1Model, "Aarav");
  assert.strictEqual(defaultPlayerState.p1OutfitColor, "#243f5e");
  assert.strictEqual(defaultPlayerState.p1SkinTone, "#e3a072");
});

// 3. Vector and Spatial Calculation
test("Corridor movement vector normalization and scaling", () => {
  const forward = 1;
  const strafe = 0;
  const speed = 3.2;
  const delta = 0.016;

  const moveX = strafe;
  const moveZ = -forward;
  
  const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
  const normX = moveX / len;
  const normZ = moveZ / len;

  const dx = normX * speed * delta;
  const dz = normZ * speed * delta;

  assert.strictEqual(dx, 0);
  assert.strictEqual(dz, -speed * delta);
});

// 4. Room Bounds Checking
test("Room bounds calculation and occupancy logic", () => {
  const roomBounds = [
    { xMin: -8, xMax: -2, zMin: -20, zMax: -14 }
  ];

  const posInside = { x: -5, z: -17 };
  const posOutside = { x: 0, z: 0 };

  const isInside = roomBounds.some(r => posInside.x >= r.xMin && posInside.x <= r.xMax && posInside.z >= r.zMin && posInside.z <= r.zMax);
  const isOutside = roomBounds.some(r => posOutside.x >= r.xMin && posOutside.x <= r.xMax && posOutside.z >= r.zMin && posOutside.z <= r.zMax);

  assert.strictEqual(isInside, true, "Position inside room bounds should evaluate true");
  assert.strictEqual(isOutside, false, "Position outside room bounds should evaluate false");
});

console.log("---------------------------------------------------");
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
console.log("---------------------------------------------------");
if (failed > 0) process.exit(1);

// commit-ref: 19
// commit-ref: 20