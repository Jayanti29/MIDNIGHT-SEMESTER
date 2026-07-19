# Midnight Semester Recovery Notes

## Task 1 Audit: Broken Or Missing Systems In `src/`

Current source files:

- `src/main.js`
- `src/styles.css`

## Core Loop

- Pointer lock is best-effort only and does not track lock state or failure cases.
- Movement uses simple axis clamping; there is no actual collision volume system for walls, doors, props, or floor boundaries.
- Sprint is implemented as a raw speed multiplier while Shift is held; there is no stamina, toggle option, or UI feedback.
- Flashlight toggle changes light intensity and prop visibility, but there is no robust light attach/detach abstraction.
- Interact logic mixes raycast and proximity fallback, but objects do not yet share a consistent `userData.interactable` contract.
- There is no explicit game state manager; menu, playing, pause, and gameover are inferred from DOM classes and ad hoc flags.
- Input is not centrally routed through game state, so keyboard/mouse events can still mutate state outside the intended mode.
- Asset/error logging is limited to renderer startup; texture/audio creation failures are not centrally reported.

## UI/UX

- Main menu is only a start overlay, not a full menu with Play, Settings, and Quit.
- Pause menu does not exist.
- Settings panel does not exist.
- Interaction prompt exists, but it is not yet tied to a formal interactable tagging system.
- Battery feedback still uses a meter and a small prop gauge; the diegetic dimming behavior needs to be formalized.
- Objective tracker exists as HUD text/list, but the requested in-world journal/notebook UI is missing.
- Inventory UI for collected evidence is missing.
- Reticle exists, but hover-over-interactable state is not visually distinct.
- Loading screen and loading progress are missing.
- Death/gameover screen is missing.
- Subtitle/dialogue exists, but it is not yet a reusable caption system.
- UI styling is partially horror-themed, but not yet consistent across all screens.
- Mobile layout has basic handling, but quick actions, task log, and dialogue still need full responsive verification.
- UI transitions are partial and inconsistent.
- Full UI flow cannot pass yet because pause, gameover, settings, and quit-to-menu are missing.

## Audio

- Audio uses raw Web Audio oscillators, not Three.js `AudioListener`.
- No audio manager module exists.
- Ambient loop is procedural and not managed as a reusable sound.
- Footsteps are missing.
- Flashlight click sounds are missing.
- Door creak is procedural but not managed as a loaded/central SFX.
- Evidence inspect stinger is procedural but not managed centrally.
- UI hover/select sounds are missing.
- Jump-scare trigger system is missing.
- Spatial/positional audio sources are missing.
- Power-cut/blackout cue is missing.
- Volume settings are missing.
- Audio ducking is missing.
- Autoplay policy is partly handled by starting audio on game start, but not surfaced in UI.
- Full audio mix playthrough has not been performed.

## Gameplay

- Evidence pickup exists as inspection, but collected items are not represented in an inventory UI.
- Door lock/unlock logic tied to objectives is missing.
- Objective progression is simple evidence count only, not a sequential system.
- Flashlight battery drains, but recharge/pickup mechanics are missing.
- Threat presence exists as a reactive Meera position/visibility behavior, but there is no patrol, detection, or robust AI state machine.
- Player damage/detection is missing.
- Checkpoint/save system is missing.
- Win condition is missing.
- Lose condition is missing.
- Environmental notes/logs exist, but readable interaction is not robust enough for a full loop.
- Full start-to-finish playtest is blocked until win/lose/objective systems exist.

## Polish And Performance

- Post-processing is currently CSS/canvas-like vignette only; no Three.js post-processing pass exists.
- Procedural textures are large canvas textures and not optimized.
- Corridor geometry lacks LOD/frustum-specific management beyond Three.js defaults.
- Console warning/error audit needs to be repeated after each feature phase.
- Mobile/gamepad fallback is incomplete.
- README has been partially updated but should be revised after the recovery tasks.
- Changelog is missing.
- Release tag `v0.1-playable` has not been created.

## Non-Applicable Requested Areas For This Prototype

This repository is currently a local Three.js horror prototype. It does not contain authentication, database connectivity, real-time sync, voice chat, video calls, messaging backend, notes backend, or group creation systems. Those areas cannot be repaired until such systems are added to the project scope.

---

## Task 52 Audit: Full Loop Playtest — Phase 4 Complete (Commit 50/500)

### Verified Working
- **Start → Game**: Menu → Start Game transitions correctly; AudioContext resumes on first click; intro dialogue fires once.
- **Evidence pickup (3 of 3)**: Dr. Verma Memo, Watchman's Logbook, Meera ID all visible and collectable. On pickup, mesh hides, removed from interactables, case file opens, objective updates.
- **Door locks**: Room 32 Left requires Evidence >= 1 (Memo). Room 29 Right requires Evidence >= 2 (Logbook). Both auto-unlock on interact when condition is met.
- **Basement gate**: Locked until Evidence = 3. On open: 3-line escape cinematic queues -> WIN screen fires after ~9.8 s with correct stats (evidence count, elapsed time, fear%).
- **Ghost AI**: Meera enters PATROL when player reaches z < -16 or fear > 28. Transitions to CHASE on flashlight/sprint detection. Camera shake at < 4.5 m. GAMEOVER if distance < 1.15 m (guarded with gameState === PLAYING check).
- **Fear -> GAMEOVER**: fear >= 100 correctly guarded with PLAYING state; triggerGameOver() fires once.
- **Battery drain + pickups**: 3 cylinders spawn; interact recharges 45%; reset handled on restart.
- **Checkpoint**: Emergency Terminal at z = -18.5 saves position, battery, evidence state. On restart: doors auto-unlock per evidence count, collected items stay hidden.
- **Lore notes**: 4 wall notes at z = -5.8, -14.2, -26.8, -38.4; E reads full text into caption and fires Aarav voice line.
- **Win screen**: Evidence count, escape time, fear% shown. Play Again clears checkpoint and fully restarts.
- **Full restart**: introPlayed and meeraWarned reset correctly for clean new-game experience.

### Resolved Issues (Phase 6 Polish)
- Unused `meeraWarned` variable declared and reset but never read (removed declaration and resets).
- Battery cylinders always restore on checkpoint-reset (resolved by implementing per-cylinder battery pickup state tracking).
- Ghost clips through closed doors (resolved by implementing proximity door-opening logic for Meera's AI).
- Camera Y shake pushes player above floor or causes X coordinate drift (resolved by implementing a non-drifting visual-only camera shake system).
- No ambient duck on WIN/GAMEOVER state transitions (resolved by implementing linear audio ramping to fade out ambient audio on state changes and restore on restart).

---

## Character Customization System — Track B Summary

### Architecture & Capabilities
1. **Accouterments & Sizing**: Added interactive ranges and checkboxes for adjusting body height/scale (SHORT: 0.88x, AVERAGE: 1.0x, TALL: 1.12x scaling multipliers) and toggling physical accessory boxes representing glasses (head bone child) and backpacks (spine bone child).
2. **Shading & Hair Stylization**: Outfit color palette expanded to 8 shades and skin tones expanded to 5 custom swatches. Added custom ponytail and buzzed cap hair geometries.
3. **Player 2 dossier integration**: Multi-step personnel files config dossier that automatically processes P1 configuration before seamlessly loading the P2 customization panel in co-op mode. Added preview lighting toggle (Daylight vs Nightlight) for high visibility.
4. **Accessible A11y & Navigation**: Swatch buttons equipped with custom `aria-label` elements and interactive Left/Right/Up/Down Arrow key event listeners for cycling through selections within focused color groups.

### Validation & Fallback Rules
- Handled via the validation function `sanitizeCustomization(obj, defaultModel)`.
- Compares variables against explicit arrays of valid models, colors, scales, hair configurations, and skin tones.
- Automatically reverts single variables to standard fallbacks or variant defaults (e.g. Priyas default outfit gold, Aaravs midnight blue, skin color matched to character presets) on null, malformed inputs, or manually corrupted `localStorage` records.
- Sanity checks are applied at startup `localStorage` parsing, option modifications, and the main menu `continueButton` restore loops.



---
## Track D Complete — 2026-07-18

Module scaffolding pass complete. The project now has:
- **12 feature modules** each with barrel exports and documented APIs
- **5 utility modules** (math, time, storage, dom, async)
- **10+ documentation files** covering every major system
- **Comprehensive CSS** design tokens and utility classes
- **Proper tooling**: ESLint, Prettier, EditorConfig, jsconfig
- **CI/CD**: GitHub Actions lint and build workflows

### Architecture decisions
1. **Fixed-timestep game loop** — prevents physics inconsistencies
2. **Procedural audio only** — no external files, small bundle
3. **JSON dialogue trees** — writers author NPC conversations without touching code
4. **CSS custom properties** — enables runtime theming
5. **EventBus communication** — flat dependency graph, independently testable modules

## Bug Fix Session (2026-07-19)
- Root cause of game startup failure: AudioManager was a stub class; all audio methods threw TypeErrors at runtime
- Secondary issue: audio/index.js did not re-export any of the 37 sfx-buffer functions
- Tertiary: colliders const reassignment caused Vite esbuild dependency scan failure
- Brightness fix: initial exposure of 2.0 instead of 1.25, ambient hemisphere boosted from 0.35 to 0.65

## Game Feel Pass (2026-07-19)
- Player movement responsive, speed slightly increased
