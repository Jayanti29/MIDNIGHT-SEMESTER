# Unreal Engine 5 Technical Design Document (TDD)
## Production Handoff & Architecture Blueprint
**Project**: *Midnight Semester* — Vertical Slice Transition Specification

---

## 1. Level Design & World Partition

### Three.js Prototype Structure
- Level assets are grouped into `level1Group` and `level2Group`, manually toggling `.visible = true / false` on level transition.

### Unreal Engine 5 Target Architecture
- **World Partition / Level Streaming**: Implement Level 1 (Old Wing) and Level 2 (Basement Lab) as separate Level Instances.
- **Level Streaming Volumes**: Use Level Streaming volumes or trigger boxes to load/unload sub-levels asynchronously.
- **Transition Blueprint**:
  - Triggering the Basement Gate calls `Load Stream Level (by Name)` for Level 2 and `Unload Stream Level` for Level 1.
  - Drives a custom camera fade to/from black using `Player Camera Manager` -> `Start Camera Fade`.

---

## 2. Rendering & Post-Process Shaders

### Three.js Prototype Structure
- Custom post-processing shader with film grain, scanlines, chromatic aberration, and vignette driven by the player's `fear` level.

### Unreal Engine 5 Target Architecture
- **Post Process Material**: Create a domain-level Post Process Material mapped to the global `PostProcessVolume`.
- **Material Node Network**:
  - **Vignette**: Dot product of Screen Position UVs with texture coordinates, multiplied by a scalar parameter.
  - **Chromatic Aberration**: Decompose `SceneTexture:PostProcessInput0` into separate R, G, B channels using slightly offset UV coordinates.
  - **Film Grain**: Dynamic noise generated using `Time` -> `Sine` -> `Frac` nodes added to base scene color.
- **Material Parameter Collection (MPC)**: Expose `FearLevel` as a scalar parameter. Blueprints update this MPC in real-time, instantly adjusting post-process intensity across viewports.

---

## 3. Ghost AI: Behavior Trees & Blackboard

### Three.js Prototype Structure
- Custom state machine (`AiState.INACTIVE`, `AiState.PATROL`, `AiState.CHASE`) updating positions via 3D distance vectors and bounding boxes.

### Unreal Engine 5 Target Architecture
- **Navigation Mesh**: Place a `NavMeshBoundsVolume` covering the corridor span and generator lab.
- **Blackboard Variables**:
  - `SelfActor` (Actor)
  - `TargetPlayer` (Actor)
  - `AiState` (Enum: Inactive, Patrol, Chase)
  - `PatrolTarget` (Vector)
- **Behavior Tree Nodes**:
  - **Selector**: Root selector branching on `AiState`.
  - **Patrol Sequence**: Moves AI along a set of `Target Point` path actors using `Move To` nodes.
  - **Chase Sequence**: Relentlessly updates destination to `TargetPlayer` position using a service node with 0.1s tick interval.
- **AI Perception System**: Configure a `UAIPerceptionComponent` on the ghost controller with `AISense_Sight` and `AISense_Hearing` inputs. Detects running player footsteps (noise events) or active flashlights.

---

## 4. Audio Systems: MetaSounds & Spatialization

### Three.js Prototype Structure
- Procedural audio buffers synthesized via the Web Audio API (LFO ticks, low-pass filter ducking, engine starter revving wave files).

### Unreal Engine 5 Target Architecture
- **MetaSound Graph**: Replace procedural Web Audio scripts with UE5 MetaSound Sources.
- **Generator Rev-Up Engine**:
  - A MetaSound utilizing a `Sawtooth Oscillator` and a low-pass filter.
  - A Blueprint drives a `Trigger` input on the MetaSound, changing the low-pass cutoff frequency dynamically using a float curve over 4.5 seconds.
- **Metronome Spatial Hum**:
  - Metronome Blueprint containing an Audio Component set to `Spatialization: 3D`.
  - Driven by an attenuation settings asset (`Attenuation_Metronome`) limiting sound bounds to a 3-meter falloff radius.
- **Dynamic Heartbeat Mixer**:
  - A MetaSound running a looping heartbeat WAV.
  - Uses the `FearLevel` scalar variable to speed up playback rate (BPM) and duck background ambient music volume.

---

## 5. Local Multiplayer Subsystem

### Three.js Prototype Structure
- Dual viewport clipping (`renderer.setViewport` and `renderer.setScissor`), keyboard inputs split to separate keys arrays.

### Unreal Engine 5 Target Architecture
- **Local Split-Screen**: Enable "Use Splitscreen" in `Project Settings` -> `Maps & Modes`.
- **Game Mode Initialization**:
  - On start, the `GameMode` Blueprint executes `Create Local Player` node for index 1 (Player 2).
  - Automatically splits the viewport horizontally/vertically based on preference settings.
- **Input Action Mapping (Enhanced Input)**:
  - Map Player 1 to Keyboard/Mouse layout (`IMC_Player1`).
  - Map Player 2 to Gamepad controller or secondary keyboard configurations (`IMC_Player2`).
- **Owner-Visibility Layers**:
  - Set P1 character meshes to **Owner No See** (hidden on Player 1's screen).
  - Set P2 character meshes to **Owner No See** (hidden on Player 2's screen).
  - Allows players to see each other's models while preventing self-model clipping.

---

## 6. Save Systems & Checkpoints

### Three.js Prototype Structure
- Checkpoints serializing state vectors (battery, collected evidence, level) directly to an in-memory `activeCheckpoint` object.

### Unreal Engine 5 Target Architecture
- **SaveGame Object**: Create a Blueprint class inheriting from `USaveGame` containing properties:
  - `PlayerTransform` (Transform)
  - `BatteryLevel` (Float)
  - `CollectedEvidence` (Array of Strings)
  - `CurrentLevelName` (Name)
- **Checkpoint Console Blueprint**:
  - Overlapping the Console Actor saves the game.
  - Executes `Create Save Game Object`, populates fields from the active Player State, and writes to disk via `Save Game to Slot`.
