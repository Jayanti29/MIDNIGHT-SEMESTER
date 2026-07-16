import * as THREE from "three";
import { state } from "../gameState.js";

export class AudioManager {
  constructor(listener, loadingManager = null) {
    this.listener = listener;
    this.loader = new THREE.AudioLoader(loadingManager);
    this.buffers = new Map();
    this.activeSounds = new Map();
    this.duckTimer = null;
  }

  loadSound(name, url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (buffer) => {
          this.buffers.set(name, buffer);
          resolve(buffer);
        },
        undefined,
        (err) => {
          console.error(`Failed to load audio: ${url}`, err);
          reject(err);
        }
      );
    });
  }

  playSound(name, options = {}) {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Audio buffer not loaded: ${name}`);
      return null;
    }

    const loop = options.loop || false;
    const volume = options.volume !== undefined ? options.volume : 1.0;
    const positional = options.positional || false;
    const targetMesh = options.targetMesh || null;
    const category = options.category || "sfx";
    
    let sound;
    if (positional && targetMesh) {
      sound = new THREE.PositionalAudio(this.listener);
      sound.setBuffer(buffer);
      sound.setRefDistance(options.refDistance || 1.2);
      sound.setMaxDistance(options.maxDistance || 18);
      targetMesh.add(sound);
    } else {
      sound = new THREE.Audio(this.listener);
      sound.setBuffer(buffer);
    }

    sound.setLoop(loop);
    sound.userData = { category, baseVolume: volume };
    
    const catVol = category === "ambient" ? state.ambientVolume : state.sfxVolume;
    sound.setVolume(volume * catVol);
    sound.play();

    this.activeSounds.set(name, sound);
    
    if (!loop) {
      sound.onEnded = () => {
        if (sound.parent) {
          sound.parent.remove(sound);
        }
        if (this.activeSounds.get(name) === sound) {
          this.activeSounds.delete(name);
        }
      };
    }

    return sound;
  }

  updateCategoryVolumes() {
    this.activeSounds.forEach((sound) => {
      if (sound.userData) {
        const cat = sound.userData.category;
        const base = sound.userData.baseVolume !== undefined ? sound.userData.baseVolume : 1.0;
        const factor = cat === "ambient" ? state.ambientVolume : state.sfxVolume;
        sound.setVolume(base * factor);
      }
    });
  }

  duckAmbient(duration = 2500, duckFactor = 0.25) {
    this.activeSounds.forEach((sound) => {
      if (sound.userData && sound.userData.category === "ambient") {
        const base = sound.userData.baseVolume !== undefined ? sound.userData.baseVolume : 1.0;
        sound.setVolume(base * state.ambientVolume * duckFactor);
      }
    });
    window.clearTimeout(this.duckTimer);
    this.duckTimer = window.setTimeout(() => {
      this.unduckAmbient();
    }, duration);
  }

  unduckAmbient() {
    this.activeSounds.forEach((sound) => {
      if (sound.userData && sound.userData.category === "ambient") {
        const base = sound.userData.baseVolume !== undefined ? sound.userData.baseVolume : 1.0;
        sound.setVolume(base * state.ambientVolume);
      }
    });
  }

  fadeAmbientOut(durationSecs = 2.0) {
    window.clearTimeout(this.duckTimer);
    this.activeSounds.forEach((sound) => {
      if (sound.userData && sound.userData.category === "ambient") {
        if (sound.gain && sound.gain.gain) {
          const ctx = this.listener.context;
          sound.gain.gain.setValueAtTime(sound.gain.gain.value, ctx.currentTime);
          sound.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSecs);
        } else {
          sound.setVolume(0);
        }
      }
    });
  }
}
