# CHANGELOG

All notable changes to *Midnight Semester* are recorded here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — Commits 61–71

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
