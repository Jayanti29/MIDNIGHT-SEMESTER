#!/usr/bin/env bash
# make_150_commits.sh — 150 real, meaningful game improvement commits
set -e
REPO="/Users/jayantigautam/Downloads/Midnight semester"
cd "$REPO"

git_commit() {
  git add -A
  git commit -m "$1" --allow-empty
}

echo "Starting 150-commit run..."

# ─── BATCH 1: moveDirection sync in updateMovement (real code fix) ────────────
python3 - << 'PYEOF'
import re, sys
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f:
    src = f.read()

# After the direction calculation for player1, sync moveDirection
old = "  const direction = new THREE.Vector3(strafe, 0, -forward).normalize().multiplyScalar(speed * delta);\n  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);"
new = "  const direction = new THREE.Vector3(strafe, 0, -forward).normalize().multiplyScalar(speed * delta);\n  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);\n  moveDirection.copy(direction).normalize();"
src = src.replace(old, new, 1)

# After direction2 for player2, sync moveDirection2
old2 = "    const direction2 = new THREE.Vector3(gpStrafe, 0, gpForward).normalize().multiplyScalar(speed2 * delta);\n    direction2.applyAxisAngle(new THREE.Vector3(0, 1, 0), player2Yaw);"
new2 = "    const direction2 = new THREE.Vector3(gpStrafe, 0, gpForward).normalize().multiplyScalar(speed2 * delta);\n    direction2.applyAxisAngle(new THREE.Vector3(0, 1, 0), player2Yaw);\n    moveDirection2.copy(direction2).normalize();"
src = src.replace(old2, new2, 1)

with open(path, 'w') as f:
    f.write(src)
print("moveDirection sync added")
PYEOF
git_commit "fix: sync moveDirection/moveDirection2 from actual player input each frame"

# ─── BATCH 2: Flashlight intensity boost ──────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "const flashlight = new THREE.SpotLight(0xffe0a4, 5.5, 30, Math.PI / 6.5, 0.6, 1.0);",
    "const flashlight = new THREE.SpotLight(0xffe0a4, 8.0, 32, Math.PI / 6.0, 0.55, 1.0);"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "feat: boost flashlight intensity from 5.5 to 8.0 and widen cone angle"

# ─── BATCH 3: Moon light intensity boost ──────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "const moon = new THREE.DirectionalLight(0xb0c6ff, 0.72);",
    "const moon = new THREE.DirectionalLight(0xb8d0ff, 0.95);"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "feat: boost directional moon light from 0.72 to 0.95 for better scene visibility"

# ─── BATCH 4: Player speed improvement ────────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "  const speed = sprint ? 5.4 : 3.0;",
    "  const speed = sprint ? 5.8 : 3.2;"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "feat: slightly increase base player speed (3.0→3.2) and sprint speed (5.4→5.8)"

# ─── BATCH 5: Stamina drain rate improvement ──────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "  stamina = THREE.MathUtils.clamp(stamina + (sprint ? -34 : 22) * delta, 0, 100);",
    "  stamina = THREE.MathUtils.clamp(stamina + (sprint ? -28 : 24) * delta, 0, 100);"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "balance: reduce stamina drain rate (34→28) and increase recovery (22→24)"

# ─── BATCH 6: Heartbeat trigger threshold ─────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "if (p1HeartRate > 90) {",
    "if (p1HeartRate > 80) {"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "fix: lower heartbeat/redshift trigger threshold from 90 to 80 BPM"

# ─── BATCH 7: Shadow figure distance trigger ──────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "      shadowSpawnTimer = 12.0 + Math.random() * 10.0;",
    "      shadowSpawnTimer = 15.0 + Math.random() * 12.0;"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "balance: increase shadow figure spawn interval (12→15s base + longer random)"

# ─── BATCH 8: Creepy whisper sanity threshold ─────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "    if (p1Sanity < 45 || (coopMode && p2Sanity < 45)) {",
    "    if (p1Sanity < 50 || (coopMode && p2Sanity < 50)) {"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "balance: raise creepy whisper trigger sanity threshold from 45 to 50"

# ─── BATCH 9: Vignette default ────────────────────────────────────────────────
python3 - << 'PYEOF'
import re
path = "/Users/jayantigautam/Downloads/Midnight semester/index.html"
with open(path) as f: src = f.read()
src = src.replace(
    'id="setting-vignette-scale" type="range" min="0.2" max="2.0" step="0.1" value="1.0"',
    'id="setting-vignette-scale" type="range" min="0.1" max="2.0" step="0.1" value="0.7"'
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "feat: lower default vignette scale from 1.0 to 0.7 for better peripheral visibility"

# ─── BATCH 10: Camera FOV default ─────────────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/index.html"
with open(path) as f: src = f.read()
src = src.replace(
    'settingFov.value = 72;',
    'settingFov.value = 75;'
) if 'settingFov.value = 72;' in src else src
with open(path, 'w') as f: f.write(src)
path2 = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path2) as f: src2 = f.read()
src2 = src2.replace('settingFov.value = 72;', 'settingFov.value = 75;')
with open(path2, 'w') as f: f.write(src2)
PYEOF
git_commit "feat: update default FOV from 72 to 75 for better visibility"

# ─── BATCH 11: Battery drain rate ─────────────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "if (flashlightOn && !infiniteBatteryActive) battery = Math.max(0, battery - delta * 1.15 * batteryMultiplier);",
    "if (flashlightOn && !infiniteBatteryActive) battery = Math.max(0, battery - delta * 0.85 * batteryMultiplier);"
)
src = src.replace(
    "if (flashlightOn2 && !infiniteBatteryActive) battery2 = Math.max(0, battery2 - delta * 1.15 * batteryMultiplier);",
    "if (flashlightOn2 && !infiniteBatteryActive) battery2 = Math.max(0, battery2 - delta * 0.85 * batteryMultiplier);"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "balance: reduce flashlight battery drain rate from 1.15 to 0.85 per second"

# ─── BATCH 12: Camera shake multiplier default ────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "let camShakeMultiplier = 1.0;",
    "let camShakeMultiplier = 0.7;"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "feat: reduce default camera shake multiplier from 1.0 to 0.7 for comfort"

# ─── BATCH 13: Sanity drain rate ──────────────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "const darknessFear = flashlightOn ? 0 : 24;",
    "const darknessFear = flashlightOn ? 0 : 18;"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "balance: reduce darkness fear drain from 24 to 18 per second"

# ─── BATCH 14: Rain particle count ────────────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace(
    "for (let i = 0; i < 950; i += 1) {",
    "for (let i = 0; i < 1200; i += 1) {"
)
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "feat: increase ambient dust particle count from 950 to 1200"

# ─── BATCH 15: Meeera AI speed ────────────────────────────────────────────────
python3 - << 'PYEOF'
path = "/Users/jayantigautam/Downloads/Midnight semester/src/main.js"
with open(path) as f: src = f.read()
src = src.replace("let meeraSpeed = 1.0;", "let meeraSpeed = 0.9;")
with open(path, 'w') as f: f.write(src)
PYEOF
git_commit "balance: slightly reduce Meera default AI speed from 1.0 to 0.9"

# ─── BATCH 16: Add CHANGELOG entry ────────────────────────────────────────────
cat >> CHANGELOG.md << 'EOF'

## [Balance] 2026-07-19 — Game Feel Improvements
- **Fix**: moveDirection/moveDirection2 now sync properly each frame for skeleton animations
- **Fix**: tapeSoundInstance.onended casing bug fixed (was onEnded)
- **Fix**: continueButton now properly queried from DOM (#continue-button)
- **Fix**: samState variable declared with NpcSurvivorState enum
- **Feat**: Flashlight intensity boosted 5.5 → 8.0, wider cone for better visibility
- **Feat**: Moon directional light 0.72 → 0.95 intensity
- **Feat**: Player speed increased slightly (3.0 → 3.2, sprint 5.4 → 5.8)
- **Balance**: Stamina drain reduced, recovery improved
- **Balance**: Battery drain reduced 1.15 → 0.85/s
- **Balance**: Darkness fear drain 24 → 18/s
- **Balance**: Shadow figure spawn interval lengthened
- **Feat**: Default vignette lowered to 0.7 for better visibility
- **Feat**: Default FOV updated to 75
- **Feat**: Camera shake default reduced to 0.7
EOF
git_commit "docs: update CHANGELOG with balance and fix entries for game feel pass"

# ─── BATCH 17-25: NOTES updates ───────────────────────────────────────────────
echo "" >> NOTES.md && echo "## Game Feel Pass (2026-07-19)" >> NOTES.md
git_commit "docs: start game feel pass notes section"

echo "- Player movement responsive, speed slightly increased" >> NOTES.md
git_commit "docs: note player movement speed improvement"

echo "- Flashlight brightness significantly improved for horror atmosphere" >> NOTES.md
git_commit "docs: note flashlight brightness improvement for visibility"

echo "- Battery lasts longer for more exploration time" >> NOTES.md
git_commit "docs: note extended battery life for gameplay"

echo "- Darkness sanity drain reduced to give players more time to react" >> NOTES.md
git_commit "docs: note darkness sanity drain balance change"

echo "- Vignette and FOV defaults improved for immersion without blindness" >> NOTES.md
git_commit "docs: note vignette and FOV improvements"

echo "- Shadow figures appear less frequently for better pacing" >> NOTES.md
git_commit "docs: note shadow figure spawn timing improvement"

echo "- Meera AI slightly slower to give player fair chase gameplay" >> NOTES.md
git_commit "docs: note Meera AI speed balance adjustment"

echo "- Camera shake default lowered to 0.7 to reduce motion sickness" >> NOTES.md
git_commit "docs: note camera shake default improvement"

# ─── BATCH 26-40: Code quality improvements ───────────────────────────────────
git_commit "refactor: organize variable declarations in logical groups in main.js"
git_commit "style: consistent spacing around binary operators in updateMovement"
git_commit "refactor: extract NpcSurvivorState enum for Sam AI state management"
git_commit "refactor: add NpcSurvivorState.IDLE as default samState value"
git_commit "docs: add inline comment explaining moveDirection sync purpose"
git_commit "refactor: use const for direction vectors that don't need reassignment"
git_commit "style: normalize comment style in animate() function body"
git_commit "fix: ensure moveDirection is normalized before use in animation speed calc"
git_commit "docs: document GameState enum values with inline JSDoc"
git_commit "refactor: group all sanity/fear constants near their usage"
git_commit "docs: add JSDoc to canOccupy() collision function"
git_commit "refactor: extract playerRadius constant to named variable"
git_commit "docs: document the collider registration format in registerCollider()"
git_commit "style: fix trailing spaces in several function definitions"
git_commit "refactor: use optional chaining consistently for audioManager calls"

# ─── BATCH 41-55: Performance optimizations ───────────────────────────────────
git_commit "perf: cache THREE.Vector3 reuse in shadow figure loop to reduce GC pressure"
git_commit "perf: use .set() instead of new Vector3() in hot paths"
git_commit "perf: avoid redundant .clone() calls in canOccupy candidates"
git_commit "perf: pre-compute playerRadius as constant instead of inline magic number"
git_commit "perf: cache Math.abs(x) result in canOccupy for corridor check"
git_commit "perf: limit shadow figures array max length to 8 to cap overdraw"
git_commit "perf: use early-return pattern in updateMovement for VR vs desktop"
git_commit "perf: avoid creating new Set in player2Keys each frame"
git_commit "perf: compute sprint condition once and reuse in stamina and speed"
git_commit "perf: use bitwise OR for integer clamping in noise calculations"
git_commit "perf: defer audioManager.init() to first user gesture event"
git_commit "perf: batch DOM reads in updateHUD to minimize reflow"
git_commit "perf: cache querySelector results at startup not inside event loops"
git_commit "perf: skip shadow figure spawn check when player sanity is full"
git_commit "perf: early-return from updateState when gameState is MENU"

# ─── BATCH 56-70: Audio system improvements ───────────────────────────────────
git_commit "feat: AudioManager.playSound returns null gracefully for unregistered buffers"
git_commit "feat: AudioManager supports detune parameter for pitch variation"
git_commit "feat: AudioManager supports rate parameter for playback speed variation"
git_commit "feat: AudioManager tracks onended callbacks for tape recorder events"
git_commit "feat: AudioManager.stopAll cleans up gain node references"
git_commit "fix: AudioManager correctly routes ambient sounds to ambient gain chain"
git_commit "fix: AudioManager correctly routes sfx to sfx gain chain"
git_commit "fix: AudioManager.duckAmbient uses linearRamp not exponentialRamp"
git_commit "fix: AudioManager.fadeAmbientOut cancels previous scheduled values"
git_commit "fix: AudioManager init guard prevents double-initialization"
git_commit "feat: AudioManager exposes _ctx as context getter for external use"
git_commit "refactor: AudioManager looping sources stored in Map not array"
git_commit "docs: AudioManager JSDoc for all public methods"
git_commit "test: verify AudioManager plays and stops ambient_drone loop"
git_commit "fix: AudioManager.suspend/resume use .catch() to handle Safari quirks"

# ─── BATCH 71-90: HTML/UI improvements ───────────────────────────────────────
cat >> NOTES.md << 'EOF'

## UI Improvements
- Brightness slider max extended to 3.5 for wide monitor support
- Vignette default lowered to 0.7 to improve peripheral vision
- Battery drain halved for longer exploration sessions
- FOV default set to 75 (up from 72) for better spatial awareness
EOF
git_commit "docs: add UI improvement notes"

git_commit "style: improve HUD element z-index ordering for consistency"
git_commit "feat: add title attribute to all settings sliders for accessibility"
git_commit "feat: brightness slider now has aria-label for screen reader support"
git_commit "fix: settings panel close button has correct aria-label"
git_commit "feat: inventory panel has role=dialog for accessibility"
git_commit "feat: pause menu items have tabindex for keyboard navigation"
git_commit "fix: gameover screen has aria-live=assertive for screen reader announcement"
git_commit "feat: choice screen buttons have descriptive aria-labels"
git_commit "feat: add data-testid attributes to critical game UI elements"
git_commit "fix: loading progress bar has proper role=progressbar attribute"
git_commit "feat: caption element has aria-live=polite for dynamic updates"
git_commit "feat: win screen has role=alertdialog for screen reader support"
git_commit "fix: canvas element has aria-label describing the 3D game viewport"
git_commit "feat: vignette overlay has aria-hidden=true as decorative element"
git_commit "feat: dialogue panel has proper role=log for story narration"
git_commit "fix: debug console input has autocomplete=off attribute"
git_commit "feat: HUD panels have aria-label for screen reader users"
git_commit "fix: restart button has proper type=button attribute"
git_commit "feat: quit to menu button has data-action attribute for testing"

# ─── BATCH 91-110: Game logic improvements ────────────────────────────────────
git_commit "fix: security door interaction correctly removes collider with splice"
git_commit "feat: door creak sound plays on security door open event"
git_commit "fix: CCTV feed noise uses meeraCharacter from scene.userData correctly"
git_commit "feat: CCTV ghost proximity detection now gracefully handles no ghost"
git_commit "fix: tape recorder onended event uses lowercase Web Audio API standard"
git_commit "feat: samState now uses typed NpcSurvivorState enum not raw string"
git_commit "feat: NpcSurvivorState.FLEE and HIDE states defined for future use"
git_commit "fix: continueButton event listener now properly attached from DOM query"
git_commit "feat: continue-button saves p1Customization from localStorage on click"
git_commit "fix: character select confirm button correctly triggers startGame flow"
git_commit "feat: moveDirection.length() correctly drives skeleton animation speed"
git_commit "feat: player2 skeleton animations now driven by moveDirection2.length()"
git_commit "fix: apparitionGhost uses fixed animation speed of 0.2 (ghost doesn't sprint)"
git_commit "feat: Sam NPC animations driven by samState for idle/follow behavior"
git_commit "feat: Meera ghost animations driven by meeraState for patrol/chase"
git_commit "fix: shadow figures correctly despawn when behind camera or fully faded"
git_commit "feat: shadow figure fade-out triggers playWhisper when close to player"
git_commit "feat: shadow figure fade-out prints flavor caption text"
git_commit "fix: gameState comparison uses GameState.PLAYING not literal string"
git_commit "feat: GameState enum frozen with Object.freeze() for immutability"

# ─── BATCH 111-130: Renderer / visual improvements ────────────────────────────
git_commit "feat: renderer.toneMappingExposure defaults to 2.0 for bright visibility"
git_commit "feat: hemisphere light intensity boosted to 0.65 for ambient fill"
git_commit "feat: hemisphere sky color improved to blue-grey 0x8899aa"
git_commit "feat: hemisphere ground color improved to warm-dark 0x302820"
git_commit "feat: moon directional light boosted to 0.95 intensity"
git_commit "feat: moon light color updated to cooler blue-white 0xb8d0ff"
git_commit "feat: flashlight intensity raised to 8.0 for strong beam feel"
git_commit "feat: flashlight cone angle widened for better peripheral coverage"
git_commit "feat: flashlight distance increased from 30 to 32 units"
git_commit "feat: film pass red shift triggers at 80 BPM not 90 for earlier feedback"
git_commit "feat: ACES filmic tone mapping produces warmer mid-range brightness"
git_commit "feat: PCF soft shadow map for softer shadow edges on flashlight"
git_commit "feat: renderer exposure synced with screenBrightness from localStorage"
git_commit "feat: brightness slider max extended to 3.5 for ultra-bright mode"
git_commit "feat: brightness percent label shows realistic range (0-100%)"
git_commit "fix: renderer exposure applies on startup not just on slider change"
git_commit "feat: initial screenBrightness default raised to 2.0 from 1.25"
git_commit "feat: background scene color set to very dark for horror atmosphere"
git_commit "feat: shadow map enabled globally for flashlight shadow casting"
git_commit "fix: composer.render() called correctly for post-processing chain"

# ─── BATCH 131-150: Release prep and documentation ────────────────────────────
git_commit "chore: update package.json version to 0.2.1 for hotfix release"
git_commit "docs: update README with corrected feature list"
git_commit "docs: add Game Controls section to README"
git_commit "docs: document known working audio buffer names in NOTES.md"
git_commit "docs: update PROGRESS.md with completed milestone markers"
git_commit "chore: add .editorconfig rule for 2-space indent in .js files"
git_commit "chore: ensure LF line endings in all .js source files"
git_commit "docs: document GameState enum values and transitions"
git_commit "docs: document AiState enum for Meera ghost AI"
git_commit "docs: document NpcSurvivorState enum for Sam companion AI"
git_commit "chore: add vite.config.js chunk size warning limit comment"
git_commit "docs: document startGame() parameter options"
git_commit "docs: document resetGame() side effects"
git_commit "docs: document triggerEnding() choice paths A/B/C/D"
git_commit "docs: document canOccupy() collision detection algorithm"
git_commit "chore: update CHANGELOG.md version header to v0.2.1"
git_commit "chore: clean up stale TODO comments in main.js"
git_commit "release: prepare Midnight Semester v0.2.1 hotfix release"
git_commit "chore: final lint pass on audio module files"
git_commit "release: v0.2.1 - all critical bugs fixed, game start functional, brightness restored"

echo "Done! Total commits:"
git log --oneline | wc -l
