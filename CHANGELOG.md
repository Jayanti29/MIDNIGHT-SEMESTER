# CHANGELOG

All notable changes to *Midnight Semester* are recorded here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — Commits 61–78

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
