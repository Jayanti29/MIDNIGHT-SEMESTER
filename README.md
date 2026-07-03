# Midnight Semester

VR-first psychological horror game prototype set at the fictional Ravenswood Institute of Technology.

This repository currently contains a playable high-fidelity browser prototype built with Three.js. It is designed as a fast iteration layer for lighting, mood, interaction, and UI/UX before the full Unreal Engine 5 production build.

## Run

```bash
npm install
npm run dev
```

Open the local server URL printed by Vite, usually:

```text
http://localhost:5173/
```

The root `index.html` also supports direct browser opening for quick checks, but the dev server is the preferred path while building.

## Build And Preview

```bash
npm run build
npm run preview
```

## Prototype Controls

- `WASD` move
- Mouse look after pointer lock, or arrow keys as fallback
- `Shift` sprint
- `F` toggle flashlight
- `E` inspect evidence or open doors

## Creative Direction

- Slow-burn horror: atmosphere first, threat second.
- No flat HUD dependency for critical fiction systems; UI should feel physical or diegetic.
- Indian engineering campus grounding: hostel wings, Block A, power cuts, research logs, exam pressure.
- Visual target: dark wood corridors, practical warm lights, flashlight-driven tension, readable environmental storytelling.

## Production Target

The final game direction is Unreal Engine 5 with OpenXR support for PCVR, Quest Link, PSVR2, and flatscreen parity. This prototype is not a replacement for UE5; it is a playable vertical slice for interaction and mood validation.
