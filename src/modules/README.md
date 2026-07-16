# Midnight Semester ESM Modules

This directory contains the modular ESM splits of the original `src/main.js` script. To maintain strict clean boundaries and avoid circular dependencies, the codebase is split as follows:

## Module Map

- **`gameState.js`**: Shared, centralized mutable state variables (e.g. `gameState`, `coopMode`, `fear`, etc.) and basic reactive state change listener patterns.
- **`audio/`**: Orchestrates Promise-based Web Audio buffer caching, Category volumes, spatialized `PositionalAudio` sources, and ducking loops.
  - `AudioManager.js`: Central core class for volume adjustments, playback tracking, and loading operations.
  - `sfx-buffers.js`: Generates synthesized footsteps, clicks, locks, metronomes, clangs, and screens.
  - `voice-buffers.js`: Monologue narration and professor dialogue buffers.
- **`textures/`**: Keyed LRU procedural textures generators cache.
- **`level/`**: Campus corridor builder utilities, light configurations, backup generator puzzles, and emergency pedestal saves.
- **`character/`**: Humanoid skeletal rigs, procedural accessories, preset variant files, select renderer loops, and swatches triggers.
- **`player/`**: Movement controllers, boundary collision, and dual viewport split-screen coordination.
