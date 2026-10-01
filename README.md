# Midnight Semester

A psychological horror browser game built with [Three.js](https://threejs.org/).  
Set at the fictional **Ravenswood Institute of Technology**, 2026.  
Play as final-year student **Aarav Mehta** — alone in Block A after midnight, piecing together what happened to Meera Iyer in 2004.

---

## Play

```bash
npm install
npm run dev
```

Open: `http://localhost:5173/`

Production build:

```bash
npm run build
npm run preview
```

---

## Controls (Third-Person Perspective)

| Input | Action |
|-------|--------|
| `WASD` | Move character relative to camera orientation |
| Mouse | Orbit the third-person chase camera (drag or pointer lock) |
| `Shift` | Sprint (stamina-limited) |
| `F` | Toggle hand-held flashlight (attached to right hand bone) |
| `E` | Reach & interact (doors, chairs, evidence, NPCs) |
| `P` / `Esc` | Pause menu |
| `Tab` / `I` | Open case file inventory |
| **Co-op Player 2 keyboard** | Arrow keys move · `Period` / `Slash` look · `Right Shift` interact · `Right Control` sprint · `L` flashlight · `O` EMF · `P` pills |
| **Gamepad** | Left stick move · Right stick look · A interact · X flashlight · L3 sprint |
| **Mobile** | Left virtual stick move · right-side drag to look · tap on-screen buttons to interact/toggle flashlight |

---

## Features (v0.3.0-rebuild)

### Gameplay & Character Rigging
- **Stylized Human Character Rig** — stylized anime-realistic human mesh with sharp hair locks, detailed facial features (jaw, nose, ears, mouth, eyes), and non-clipping headphones.
- **Multi-State Skeletal Animation** — procedural skeleton driving `IDLE` chest breathing, `WALK` & `RUN` stride cycles, `REACH` right-arm interaction extensions, and `SIT` chair postures.
- **Physical Interaction System** — character visibly reaches out to open doors (smooth 90° rotation lerp), pick up evidence documents, sit on chairs/benches (`E` sit / stand toggle), and hold flashlight in-hand.
- **Interactive Story NPCs** — Professor Kulkarni, Priya Sharma, Rohan Verma, and Sam Shekhar stationed at narrative points with idle behavior, dialogue conversations, and Task Log / Journal objective advancement.
- **TPP Spring-Arm Follow Camera** — chase camera with `THREE.Raycaster` wall collision prevention so the camera never clips through environment geometry.
- **3-evidence progressive unlock** — collect Dr. Verma Memo, Watchman's Logbook, and Meera's ID to advance through locked doors and reach the basement gate.

### Audio
- Procedural ambient hum, footsteps (tile vs. concrete), door creak, flashlight click
- 3D spatial positional audio (`THREE.PositionalAudio`) for environment stingers and NPC voices
- Dialogue system with typewriter subtitles and swappable voice-line audio hooks (`setVoiceAudioSource`)
- Volume/SFX/ambient category controls in Settings panel

### Visual / Post-Processing
- `EffectComposer` + custom `FilmGrainShader` (vignette, film grain, subtle desaturation) — tuned for crisp UI readability
- Live 3D character dossier preview canvas rendering real-time outfit, skin tone, hair style, glasses, and backpack customization swatches
- Flickering corridor lights + blackout event at evidence threshold
- Dust particle field
- Procedural 512×512 wall/floor/ceiling textures (tiled and repeating)
- Distance-gate LOD: dorm room group hidden when player is in the far corridor half

### UI/UX
- Main menu · Pause menu · Settings panel (volume, FOV, mouse sensitivity)
- Journal / Objectives sidebar with sequential unlock text
- Case file panel (collected evidence with title + body text)
- Task log feed (timestamped in-game events)
- Dialogue subtitles with speaker name and auto-dismiss timer
- GAMEOVER screen (reason text + restart) · WIN screen (evidence count, time, fear% + play again)
- Interaction prompt + active reticle highlight
- Quick-action buttons for mobile (Interact, Flashlight)

---

## Tech Stack

| Layer | Library / API |
|-------|--------------|
| 3D Renderer | Three.js r185 |
| Post-Processing | `three/addons` EffectComposer + custom ShaderPass |
| Audio | Web Audio API (no AudioWorklet) |
| Bundler | Vite 5.4 |
| Input | Keyboard · Mouse (PointerLock) · Touch · Gamepad API |

---

## Project Status

This is a feature-rich prototype, not a release-verified game. The app builds and starts, but several systems still need fixes and end-to-end playtesting. Run `npm test` for the current 12-check Node suite; it is not a measure of full feature coverage. See [PROJECT_AUDIT.md](docs/PROJECT_AUDIT.md) for confirmed defects and unverified flows, [PROGRESS.md](PROGRESS.md) for the development log, and [NOTES.md](NOTES.md) for recovery notes.

---

## Creative Direction

- Slow-burn horror: atmosphere first, threat second.
- Indian engineering campus grounding — hostel wings, Block A, power cuts, research logs, exam pressure.
- Visual target: dark wood corridors, practical warm lights, flashlight-driven tension, readable environmental storytelling.
- Diegetic UI wherever possible (case file, task log, dorm room props).

---

## Story

*A final-year engineering student stays behind alone on campus to finish a project during semester break — and discovers the university has been quietly finishing something else since 2005.*

Full narrative in [StoryBible.md](StoryBible.md).

## Module Structure
Game systems live under `src/modules/`; `src/main.js` still owns bootstrapping and cross-system integration. Module boundaries are documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full overview.

## Quick Start
```bash
npm install && npm run dev
```

## Documentation
| File | Contents |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | High-level system design |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Commit conventions & PR guide |
| [AUDIO_SYSTEM.md](docs/AUDIO_SYSTEM.md) | Audio module docs |
| [NPC_SYSTEM.md](docs/NPC_SYSTEM.md) | NPC dialogue & AI |
| [MINIGAMES.md](docs/MINIGAMES.md) | Mini-game registry |
| [LEVEL_DESIGN.md](docs/LEVEL_DESIGN.md) | Level & room schema |
| [PLAYER_MECHANICS.md](docs/PLAYER_MECHANICS.md) | Stats & controls |
| [TESTING.md](docs/TESTING.md) | Testing strategy |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Build & deploy |
| [ROADMAP.md](docs/ROADMAP.md) | Version milestones |
