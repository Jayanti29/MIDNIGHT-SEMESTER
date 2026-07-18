# Audio System

## Overview
The audio system uses the Web Audio API:
- Procedural SFX (footsteps, ambient, UI sounds)
- Dialogue whisper buffers
- Dynamic music layering

## Key Classes
| Class | File | Responsibility |
|---|---|---|
| `AudioManager` | `modules/audio/AudioManager.js` | Central coordinator |
| `SFXGenerator` | `modules/audio/sfx.js` | Procedural SFX |
| `DialogueBuffer` | `modules/audio/dialogue.js` | Whisper/speech |

## Usage
```js
import { AudioManager } from './modules/audio/index.js';
const audio = new AudioManager();
audio.init(); // call after user gesture
audio.playSFX('blip');
```
