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
