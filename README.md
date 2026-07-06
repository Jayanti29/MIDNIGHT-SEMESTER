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

## Controls

| Input | Action |
|-------|--------|
| `WASD` | Move |
| Mouse / Arrow keys | Look |
| `Shift` | Sprint (stamina-limited) |
| `F` | Toggle flashlight |
| `E` | Inspect / Interact |
| `P` / `Esc` | Pause |
| `Tab` | Open case file (collected evidence) |
| **Gamepad** | Left stick move · Right stick look · A interact · X flashlight · L3 sprint |
| **Mobile** | Drag right 40% of screen to look · tap on-screen buttons to interact/toggle flashlight |

---

## Features (v0.2.1-advanced)

### Gameplay
- **3-evidence progressive unlock** — collect Dr. Verma Memo, Watchman's Logbook, and Meera's ID to advance through locked doors and reach the basement gate
- **Ghost AI** — Meera Iyer's ghost patrols Block A, transitions to chase on flashlight/sprint detection, triggers game-over on catch
- **Flashlight battery** — drains over time; 3 recharge pickups placed around the corridor
- **Stamina system** — sprinting depletes, recovers on rest
- **Fear meter** — builds from depth, darkness, and ghost proximity; drives chromatic aberration, grain, and vignette intensity; game-over at 100%
- **Win condition** — escape through the basement gate after gathering all evidence (3-line narrative cinematic → completion screen with run stats)
- **Lose condition** — fear overflow or caught by Meera → game-over screen with reason text
- **Checkpoint** — Emergency Terminal at corridor midpoint saves state for mid-run restarts
- **4 lore notes** — readable wall notes (maintenance notice, torn lab page, Meera's scrawl, burned dean's safety notice)

### Audio
- Procedural ambient hum, footsteps (tile vs. concrete), door creak, flashlight click
- Jump-scare stinger
- Spatial audio with custom `AudioManager`
- Ambient ducking during dialogue
- UI sounds (hover, select, pause)
- Volume/SFX/ambient sliders in Settings

### Visual / Post-Processing
- `EffectComposer` + custom `FilmGrainShader` (film grain, chromatic aberration, scanlines, vignette) — all driven by fear level
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
| 3D Renderer | Three.js r177 |
| Post-Processing | `three/addons` EffectComposer + custom ShaderPass |
| Audio | Web Audio API (no AudioWorklet) |
| Bundler | Vite 7 |
| Input | Keyboard · Mouse (PointerLock) · Touch · Gamepad API |

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Architecture & Foundation | ✅ Done |
| 2 | Environment Build | ✅ Done |
| 3 | UI/UX & Audio | ✅ Done |
| 4 | Gameplay Functionality | ✅ Done |
| 5 | Polish & Performance | ✅ Done (commits 51–58) |
| 6 | Narrative & Environmental Polish | ✅ Done (commits 59–74) |
| 7–10 | AI, Multiple Levels, VR, Local Multiplayer | ✅ Done (commits 75–79) |
| 11–15 | Locker Hiding, HUD Soundwaves, Scoreboards, Rain/Thunder, Accessibility Controls | ✅ Done (commits 80–86) |

See [PROGRESS.md](PROGRESS.md) for the full 500-commit log and [NOTES.md](NOTES.md) for known issues and deferred work.

---

## Creative Direction

- Slow-burn horror: atmosphere first, threat second.
- Indian engineering campus grounding — hostel wings, Block A, power cuts, research logs, exam pressure.
- Visual target: dark wood corridors, practical warm lights, flashlight-driven tension, readable environmental storytelling.
- Diegetic UI wherever possible (case file, task log, dorm room props).

---

## Story

*A final-year engineering student stays behind alone on campus to finish a project during semester break — and discovers the university has been quietly finishing something else since 2005.*

Full narrative in the internal Story Bible (not included in this repository).
