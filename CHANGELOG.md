# CHANGELOG

All notable changes to *Midnight Semester* are recorded here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.2.7-advanced] — 2026-07-16
### Refactored
- Introduced `src/modules/` directory structure with subdirectories for `audio`, `textures`, `level`, `character`, `player`, `interaction`, `minigames`, `npc`, `ui`, `flow`, `input`, and `core`.
- Added `src/modules/README.md` documenting module boundaries and architecture overview.
- Introduced `src/modules/gameState.js` exporting the shared `GameState` enum and a mutable `state` object (coopMode, volume controls with `localStorage` hydration).
- Extracted `AudioManager` class into `src/modules/audio/AudioManager.js`, now reading `state.ambientVolume` and `state.sfxVolume` from the shared gameState module instead of closure variables.
- Extracted 29 procedural Web Audio buffer generator functions (drone, footsteps, flashlight, doors, buzz, heartbeat, breath, EMF, jumpscare, UI sounds, and more) into `src/modules/audio/sfx-buffers.js`.
- Extracted whisper and creepy-whisper buffer generators into `src/modules/audio/voice-buffers.js`.
- Added `src/modules/audio/index.js` barrel export re-exporting `AudioManager`, `sfx-buffers`, and `voice-buffers`.
- Wired all audio module exports into `src/main.js` via named imports; removed ~890 lines of duplicate definitions from `main.js`.

## [0.2.6-advanced] — 2026-07-16
### Added
- Expanded outfit color choices from 3 to 8 palette shades.
- Added body scale range slider supporting SHORT, AVERAGE, and TALL skeletal multipliers in character select.
- Added Glasses and Backpack accessories modelled procedurally onto spine and head bones.
- Added skin-tone swatch selections (5 tones) mapped to independent head material colors.
- Added "buzzed" and "ponytail" hair style procedural meshes.
- Added Player 2 customization dossier panel supporting full co-op mode character select step-by-step layout.
- Added preview lighting toggles (Daylight vs Nightlight) for high swatch visibility.
- Extended Randomize function to cover all new options (scale, skin tones, accessories).
- Added arrow key keyboard navigation support for swatch and candidate lists.
- Added explicit validation sanitization function fallback guards for character select options in localStorage reading and continue flows.
- Added aria-label accessibility names for empty outfit and skin swatches.

### Fixed
- Fixed preset selection variant clicks overwriting custom colors and styles by detaching preset values.
- Synced body scale, accessories, hair styles, and skin tones into in-game player mesh creation and setup loops.

## [0.2.5-advanced] — 2026-07-16
### Added
- Recursive WebGL resource disposal helper utilities (`disposeObject3D()`, `disposeRenderer()`, `disposeLevel()`) to prevent GPU memory leaks.
- Global texture cache to prevent duplicate GPU uploads of procedural, checkerboard, and peeling wall textures.
- Main render and character selection loop error boundaries with try-catch blocks and on-screen error banners.
- WebGL context loss and restoration listeners on main and character-select renderers with reload prompt interfaces.

### Fixed
- Duplicate WebGL context creation and resource leaks in character select by tracking and canceling animation frame handles and guarding canvas initialization.
- Player character and shadow figure resource leaks in `resetGame()` via recursive disposal.
- Dead broken-emoji character code representation in `updateDossierPreview()`.

## [0.2.4-advanced] — 2026-07-11
### Added
- Academic Wing classroom annex layout
- Interactive Security CCTV switching carousel and keypad override door bypasses
- Strobe buzzing light SFX
- Screen Contrast graphics sliders

## [0.2.3-advanced] — 2026-07-10
### Added
- retro scanline terminal overlay minigame
- dynamic blueprint facility layout map
- branching epilogues based on player choices
- sound synthesizers for paper rustle, lockers, and buttons

## [0.2.2-advanced] — 2026-07-09

### Added
- Procedurally generated low-frequency heartbeat dual-tone loops (heart_beat_slow below 95 BPM, heart_beat_fast above 95 BPM) mapped to real-time player fear and exhaustion states.
- Diegetic Heart Rate / ECG visual panel HUD widgets featuring vector SVG animated waves that redraw matching player BPM rates.
- Hiding locker breathing stabilization minigame triggered upon entry (if ECG sensors are collected), requiring SPACE (P1) or Period (P2) key calibration alignment inside green target zones.
- Interactive ECG electrode sensor collectibles placed on Room 32's desk.
- Real-time camera tilt and roll sway adjustments matching elevated heart rates.
- Dynamic screen red-shift vignette color grading and blur overlays at critical heart rates (above 115 BPM).
- Developer cheat commands /heartrate and /skipminigame.

## [0.2.1-advanced] — 2026-07-06

### Added
- Real-time screen brightness / gamma calibration slider in Comfort Settings modal.
- Character selection dropdown profile selectors (Aarav, Priya, Prof. Kulkarni, Rohan, Sam) with dynamic custom procedural visual parts (glasses, long hair, baseball cap visor, suit colors).
- Dossier folder investigator desk settings menu design with polaroid photo frames displaying character preview sketches.
- Realistic panel doors: added physical framing pillars, double-sided beveled inset panel trims, and brass plates with lever-handle doorknobs.
- Red spider lily flower clusters (with green stems and crimson petal crosses) scattered along the Level 1 corridor corners.
- Contorted limbs (twisted head/neck and arm angles) and gaping circular mouth cavity on Meera the ghost model.
- Flashlight SpotLight projection cookie overlays, projecting dust noise and lens ring details on walls.
- Dynamic animated running window raindrops texture mapping on all hostel corridor glass panes.
- Real-time lightning flash fog illumination, flickering the global fog color to pale blue when lightning flashes.

### Changed
- Integrated flashlight cookies and brightness ranges across player, player 2, and Sam flashlights.
- Shifted unreleased range to commits 61-87.

## [0.2.0-advanced] — 2026-07-06

### Added
- Distressed horror main menu UI design with left-aligned vertical stack and brush gradient fade.
- Customizable Player Profiles (P1/P2 names and suit colors) inside Settings panel, persisted to localStorage.
- Detailed character model enhancements: procedural hair blocks, glowing sphere eyes, student backpacks, and metallic flashlight models.
- Keyboard-bound Space/Enter shortcuts for advancing dialogue subtitles during gameplay.
- Greenish peeling concrete wall textures and tiled checkerboard floor textures with blood splashes and grime overlays.

### Changed
- Brightened global lighting: increased hemisphere light, moon light, flashlight, and lamp point lights.
- Reduced fog density to 0.012 to ensure clear player visibility down corridors.

### Fixed
- Operations Terminal lock check: corrected check to count read lore notes (out of 8) instead of primary evidence files.
- Scoreboard lore count: display environmental lore note collections out of 8 instead of 5.

## [Unreleased] — Commits 61–87

### Phase 15 — a11y Accessibility & Comfort Auditing

#### Added
- Subtitle display settings toggle enabling dialogue captions hide/show support
- Chase camera shake damping slider preventing high-frequency screen displacement triggers
- Vertical mouse looking inversion option targeting keyboard, touch, and gamepads
- Dialog structure upgrades mapping screen-reader semantic ARIA roles to all menu sections

### Phase 14 — Procedural Rain & Lightning Systems

#### Added
- 3D Points particle system (`THREE.Points`) outside corridor windows simulating falling rain drops
- Exterior directional lighting (`thunderLight`) casting long side shadows during thunderstorm flashes
- Randomly timed lightning trigger system decaying dynamically inside the frame loop
- Programmatically synthesized bassy thunder rumble SFX utilizing low-frequency saw oscillators and low-pass Web Audio filters

### Phase 13 — Game Run Statistics & Saved Profiles

#### Added
- Speedrun duration tracking set upon starting/restarting gameplay
- Aggregated run statistics tracking locker hides, debris throws, fear peaks, and stamina drainage
- Retro terminal-styled win scoreboard displaying run details side-by-side with personal records
- Saved profile high score persistence (Fastest Escape Time, Max Documents Found) using browser localStorage

### Phase 12 — Sound Wave UI & Advanced Search AI

#### Added
- P1/P2 Noise level meters on HUD panels mapping noise from standing, walking, running, and sprinting
- Hold Breath locker stamina mechanics (SPACE for Player 1, Period for Player 2) to reduce fear levels inside hiding cabinets
- Exhaustion gasp noise events when holding breath stamina is depleted, alerting the ghost
- Ghost search visual memory alert (`lockerAlertState`): Meera pursues players directly inside lockers if she spots them hiding

### Phase 11 — Hiding Spots & Distractions

#### Added
- 3D tall wooden locker/wardrobe meshes with interactive entry/exit mechanics
- Pickable rusted cans placed throughout the hostel wing and laboratory
- Key bindings to throw debris cans (G for Player 1, H for Player 2)
- Procedurally synthesized metallic clang impact SFX using Web Audio
- Meera AI behavior refactor to route patrol pathfinding to distraction noise impact coordinates
- Auto-deactivation of target tracking when all players hide inside lockers

### Phase 10 — Developer Debug Console & Cheats

#### Added
- In-Game Developer Command Line Console (`#debug-console`) absolute-positioned at screen bottom
- Backquote/Tilde (`` ` ``) key listener to open/close the console dynamically
- Key input routing blocks (WASD movements and mouse camera rotation disabled when console is open)
- Core console command parser (`/help`, `/god`, `/ib`, `/battery`, `/tp`, `/skip`, `/ghostspeed`, `/loadlevel`)
- Integrated invincibility toggles, infinite battery locks, ghost speed variables, and level skipping overrides

### Phase 9 — WebXR Controller & VR Navigation

#### Added
- WebXR controller connection hooks to spawn and track VR controller groups
- Custom 3D laser-line pointers (`THREE.Line`) attached to controllers representing laser beams
- World-matrix-based raycast intersection mapping (`inspectNearestVR`) to detect targeted meshes in VR space
- Controller button triggers to fire flashlight toggling (`squeezestart`) and object inspections (`selectstart`)
- Multi-gamepad thumbstick polling inside the frame movement loop to support smooth joystick locomotion and rotation yaw navigation

### Phase 8 — Local Split-Screen Co-op

#### Added
- Local Split-Screen Co-op multiplayer gameplay toggle in the Main Menu (Play Solo vs Play Co-op)
- Dual rendering viewports (`renderer.setViewport` & `renderer.setScissor`) in the animation loop
- Keyboard layout splitting: Player 1 (WASD + Mouse) and Player 2 (Arrows + Period/Slash for flashlight/interactions)
- Gamepad controller support mapping for Player 2 movement and looking direction
- Duplicate HUD player metrics panels (P1 left and P2 right absolute layout) and independent reticles
- Aarav and Rohan 3D character models visible in opposite player viewports with head clipping layers protection
- Proximity-based target switching for Meera's chase AI behavior and independent fear level calculation loops

### Phase 7 — Basement Lab & Branching Endings

#### Added
- Level 2 (Basement Lab) layout, concrete geometry, and emergency red/green lights
- Fuel valves (3 valve meshes) and generator starter lever interaction puzzle
- Dr. Verma's Confession Tape collectible lore note in the basement lab
- Branching Ending choice terminal UI and fullscreen selection modal
- Four branching ending cinematics and sequences (Ending A: Whistleblower, Ending B: Compliance, Ending C: Trapped, Ending D: Escape)
- Sam AI co-op companion who follows the player with a secondary flashlight
- Procedural `generator_start` Web Audio sound buffer and start-up revving sequence

#### Changed
- Re-architected level building using distinct groups (`level1Group`, `level2Group`) to enable switching levels cleanly
- Modified basement gate interaction to transition player to Level 2 instead of immediate escape
- Updated checkpoint terminal saving to store player's active level and read lore notes count

### Phase 6 — Narrative & Environmental Polish

#### Added
- Act 1 prologue expanded to 6-line opening monologue (Aarav's inner voice, Kulkarni's warning, Meera's echo)
- Meera's first ghost whisper stinger (one-time sound event at z<-24.5 with 0 evidence)
- Professor Kulkarni intercom phone call sequence triggered upon picking up the 1st evidence document
- Meera's second ghost event (countdown dialogue + shadow/lamp flickering near Room 29 at z<-26)
- Readable Meera's Diary Page (2004) and Aarav's Capstone Report (2026) paper meshes in the dorm room
- Aarav's internal monologue reaction inside Room 32 after reading Meera's Diary page
- Metronome 3D prop in the dorm room with constant spatial ticking audio loop and inspection monologue
- Basement stairwell preview monologue and restricted plaque caption on locked gate inspection
- 2005 Dean's Memo as a findable lore note collectible at z=-18.2
- Meera's final ghost event (non-hostile apparition drift across hallway at z=-31.5 when evidence=3)

#### Changed
- Cleaned up unused meeraWarned variable and references in main.js
- Implemented per-cylinder battery pickup state tracking and saved battery states to terminal checkpoints
- Implemented dynamic door-opening behavior for Meera's ghost AI to prevent clipping through closed doors
- Implemented smooth background ambient audio loop fade-out on Game Over and Win transitions

#### Fixed
- Fixed permanent player position drift and collision bypass during ghost chase camera shakes

#### Planned
- Second level (Basement / Generator Room)
- Full Act 2 and Act 3 narrative with branching endings
- Multiplayer ghost-hunting mode (experimental)
- UE5 production handoff vertical slice

---

## [0.1.0-playable] — 2026-07-05 (Commits 1–60)

### Phase 5 — Polish & Performance (Commits 51–60)

#### Added
- `EffectComposer` post-processing pipeline with custom `FilmGrainShader`
  - Film grain, chromatic aberration (intensity driven by fear), scanlines, vignette boost
  - All shader uniforms update every frame via `fear` level
- Distance-gate LOD for dorm room group (`dormGroup.visible = z < -22`)
- Touch look-drag controls: drag right 40% of screen to rotate camera
- Gamepad polling via Gamepad API: left stick move, right stick look, A interact, X flashlight, L3 sprint
- `renderer.setAnimationLoop` replacing `requestAnimationFrame` for gamepad frame-polling

#### Changed
- Procedural texture canvas halved from 1024×1024 → 512×512 (4× less GPU memory per texture)
- Stroke iteration counts reduced proportionally (900 → 420, 120 → 55)
- Label canvas halved from 1024×256 → 512×128; font size and fillText y-coordinate adjusted
- Texture `anisotropy` now clamped to `renderer.capabilities.getMaxAnisotropy()` instead of hardcoded 8

#### Fixed
- Removed debug `console.log` from `AudioManager.loadSound` success path
- Removed dead `dummy_prevent_tree_shake()` function
- Ghost catch `triggerGameOver` now guarded with `gameState === GameState.PLAYING` to prevent double-fire
- `introPlayed` and `meeraWarned` now reset on full (non-checkpoint) game restart

---

### Phase 4 — Gameplay Functionality (Commits 41–50)

#### Added
- Evidence pickup mechanic: 3 collectible documents (Dr. Verma Memo, Watchman's Logbook, Meera Iyer ID)
  - Mesh hides on collect; removed from `interactables`; case file UI opens
- Sequential objective system: `updateObjectivesSystem()` updates journal text per evidence count
- Door locking / progressive unlock: Room 32 Left (Evidence ≥ 1), Room 29 Right (Evidence ≥ 2)
- Flashlight battery drain + 3 cylinder recharge pickups (+45% each)
- Ghost AI state machine: `INACTIVE → PATROL → CHASE` based on proximity, flashlight, sprint
- Camera shake + fear spike inside ghost proximity zone
- `GameState.GAMEOVER` / `triggerGameOver()` on ghost catch or fear overflow
- `GameState.WIN` / `triggerWin()` — basement gate escape: 3-line cinematic + completion screen with stats
- Checkpoint system: Emergency Terminal saves position, battery, evidence for mid-run restart
- 4 wall-pinned lore notes: readable environmental storytelling (E to read, Aarav voice line + task log)
- Full-loop playtest audit logged to `NOTES.md`

---

### Phase 3 — UI/UX & Audio (Commits 21–40)

#### Added
- Main menu, Pause menu, Settings panel (volume sliders, FOV, mouse sensitivity)
- Journal / Objectives sidebar with sequential unlock messages
- Evidence case file panel with title + body text display
- Task log feed (in-game event timestamps)
- Dialogue subtitle system (speaker name, auto-dismiss, "Next" button for queued lines)
- GAMEOVER screen, WIN screen (with play-again button)
- Interaction prompt tied to raycaster + active reticle highlight
- Quick-action buttons for mobile (Interact, Flashlight)
- `AudioManager` class: buffer cache, spatial positioning, ducking
- Ambient hum, footstep sounds (tile vs. concrete), door creak, flashlight click
- Jump-scare stinger, UI hover/select sounds
- Spatial audio for ghost presence
- Sprint stamina system with winded-caption feedback

---

### Phase 2 — Environment Build (Commits 11–20)

#### Added
- Full corridor: floor, ceiling, walls (7m wide, ~55m long) with procedural tiled textures
- 8 dorm rooms (4 per side) with door meshes, door-open/close animation
- Dorm room interior: beds, desk, bookshelf, book stacks, blood mark, fallen chair
- Basement gate (locked behind evidence progression)
- Emergency Terminal checkpoint pedestal
- 3 battery cylinder pickups
- Ghost mesh (Meera Iyer) with translucent material
- Particle dust field
- Flickering corridor strip lights + blackout event trigger
- Moonlight directional light + hemisphere ambient

---

### Phase 1 — Architecture & Foundation (Commits 1–10)

#### Added
- Vite project scaffold, `package.json`, module bundler config for production build
- `src/` restructure with single `main.js` entry point
- `GameStateManager` with `MENU / PLAYING / PAUSED / GAMEOVER / WIN` transitions
- `THREE.Clock`-based delta-time update loop
- Pointer lock system with fallback arrow-key look
- WASD movement + wall collider AABB system
- `canOccupy()` with static collider list and player radius
- `proceduralTexture()` generator (wall, floor, ceiling, fabric, dark wood, hazard, paper)
- Material library (`materials` object)
- `box()` helper (mesh + collider registration)
- `tagInteractable()` helper for consistent `userData` contract
- `addLabel()` for canvas-texture 3D signs
- Error monitoring: `LoadingManager` errors, `window.onerror`, WebGL context-lost handler
- `PROGRESS.md` tracking 500-commit budget
- `NOTES.md` audit (broken/missing systems at start)
