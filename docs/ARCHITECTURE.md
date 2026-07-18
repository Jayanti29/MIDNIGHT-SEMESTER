# Architecture Overview

## High-Level Structure
```
src/
├── main.js
├── styles.css
└── modules/
    ├── audio/       Web Audio API engine
    ├── character/   Character state & animations
    ├── core/        Engine loop, renderer, event bus
    ├── flow/        Game flow & narrative engine
    ├── input/       Keyboard & pointer handling
    ├── interaction/ Player↔world interaction
    ├── level/       Level loading & management
    ├── minigames/   Embedded mini-game modules
    ├── npc/         NPC AI & dialogue
    ├── player/      Player controller & stats
    ├── textures/    Procedural texture generation
    └── ui/          HUD, menus, overlays
```
Each module exposes a public API via its `index.js` barrel export.
