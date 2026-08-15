// @ts-nocheck
import * as THREE from "three";

/**
 * AudioManager.js — Full implementation for Midnight Semester game audio.
 * Handles SFX playback, ambient layers, looping sounds, volume categories,
 * duck/fade operations, and heartbeat nodes via Web Audio API.
 */
export class AudioManager {
  /**
   * @param {object} listener - THREE.AudioListener attached to camera
   * @param {object} loadingManager - THREE.LoadingManager (accepted for compatibility)
   */

  constructor(listener, loadingManager) {
    this.listener = listener;
    this.loadingManager = loadingManager;

    // Expose a public buffers Map so main.js can store and retrieve AudioBuffers
    this.buffers = new Map();

    // AudioContext pulled from the THREE.AudioListener's context
    this._ctx = null;

    // Gain nodes for volume categories
    this._masterGain = null;
    this._sfxGain = null;
    this._ambientGain = null;

    // Track currently playing looping sources (keyed by buffer name)
    this._loopingSources = new Map();

    // Track ambient duck state
    this._ambientDuckGain = null;
    this._ambientDuckTarget = 1.0;

    // Volume settings (0-1)
    this._masterVolume = 0.8;
    this._sfxVolume = 0.8;
    this._ambientVolume = 0.8;
  }

  /**
   * Initialize the AudioContext from the THREE.AudioListener.
   * Must be called after a user gesture (called from initAudio in main.js).
   */
  init() {
    if (this._ctx) return;
    try {
      // Get the context from the THREE.AudioListener
      this._ctx = this.listener.context;
      if (!this._ctx) {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      }

      this._masterGain = this._ctx.createGain();
      this._masterGain.gain.value = this._masterVolume;
      this._masterGain.connect(this._ctx.destination);

      this._sfxGain = this._ctx.createGain();
      this._sfxGain.gain.value = this._sfxVolume;
      this._sfxGain.connect(this._masterGain);

      this._ambientGain = this._ctx.createGain();
      this._ambientGain.gain.value = this._ambientVolume;
      this._ambientGain.connect(this._masterGain);

      this._ambientDuckGain = this._ctx.createGain();
      this._ambientDuckGain.gain.value = 1.0;
      this._ambientDuckGain.connect(this._ambientGain);

      // Resume if suspended
      if (this._ctx.state === 'suspended') {
        this._ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('[AudioManager] Failed to initialize audio context:', e);
    }
  }

  /** Get the AudioContext (null if not yet initialized) */
  get context() {
    return this._ctx;
  }

  /**
   * Play a sound by its buffer name key.
   * @param {string} name - Key in this.buffers map
   * @param {Object} opts - Options: volume, loop, category ('sfx'|'ambient'), detune, rate
   * @returns {AudioBufferSourceNode|null}
   */
  playSound(name, opts = {}) {
    if (!this._ctx) return null;
    const buffer = this.buffers.get(name);
    if (!buffer) {
      // Silently skip missing buffers — they may not have been registered yet
      return null;
    }

    try {
      const source = this._ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = opts.loop === true;
      if (opts.rate) source.playbackRate.value = opts.rate;
      if (opts.detune) source.detune.value = opts.detune;

      const gainNode = this._ctx.createGain();
      const vol = (opts.volume !== undefined) ? opts.volume : 1.0;
      gainNode.gain.value = Math.max(0, Math.min(1, vol));

      const destGain = (opts.category === 'ambient') ? this._ambientDuckGain : this._sfxGain;
      source.connect(gainNode);
      gainNode.connect(destGain || this._masterGain);

      if (opts.loop) {
        // Store looping sources so they can be stopped
        const prev = this._loopingSources.get(name);
        if (prev) {
          try { prev.source.stop(); } catch (_) {}
        }
        this._loopingSources.set(name, { source, gainNode });
      }

      source.start(0);

      if (!opts.loop) {
        source.onended = () => { try { gainNode.disconnect(); } catch (_) {} };
      }

      return source;
    } catch (e) {
      console.warn(`[AudioManager] Failed to play sound "${name}":`, e);
      return null;
    }
  }

  /**
   * Stop a looping sound by name.
   * @param {string} name
   */
  stopSound(name) {
    const entry = this._loopingSources.get(name);
    if (entry) {
      try { entry.source.stop(); } catch (_) {}
      try { entry.gainNode.disconnect(); } catch (_) {}
      this._loopingSources.delete(name);
    }
  }

  /**
   * Fade out the ambient layer over `duration` seconds.
   * @param {number} duration
   */
  fadeAmbientOut(duration = 2.0) {
    if (!this._ctx || !this._ambientGain) return;
    const now = this._ctx.currentTime;
    this._ambientGain.gain.cancelScheduledValues(now);
    this._ambientGain.gain.setValueAtTime(this._ambientGain.gain.value, now);
    this._ambientGain.gain.linearRampToValueAtTime(0, now + duration);
  }

  /**
   * Restore the ambient layer volume over `duration` seconds.
   * @param {number} duration
   */
  fadeAmbientIn(duration = 1.5) {
    if (!this._ctx || !this._ambientGain) return;
    const now = this._ctx.currentTime;
    this._ambientGain.gain.cancelScheduledValues(now);
    this._ambientGain.gain.setValueAtTime(this._ambientGain.gain.value, now);
    this._ambientGain.gain.linearRampToValueAtTime(this._ambientVolume, now + duration);
  }

  /**
   * Duck (lower) the ambient volume briefly (e.g., during a jumpscare).
   * @param {number} targetVolume - Volume to duck to (0–1)
   * @param {number} duckTime - How long to duck (seconds)
   * @param {number} restoreTime - How long to restore (seconds)
   */
  duckAmbient(targetVolume = 0.15, duckTime = 0.1, restoreTime = 1.0) {
    if (!this._ctx || !this._ambientDuckGain) return;
    const now = this._ctx.currentTime;
    this._ambientDuckGain.gain.cancelScheduledValues(now);
    this._ambientDuckGain.gain.setValueAtTime(1.0, now);
    this._ambientDuckGain.gain.linearRampToValueAtTime(targetVolume, now + duckTime);
    this._ambientDuckGain.gain.linearRampToValueAtTime(1.0, now + duckTime + restoreTime);
  }

  /**
   * Update all category gain values from current stored volumes.
   * Called when the user changes volume settings.
   */
  updateCategoryVolumes() {
    if (!this._ctx) return;
    if (this._masterGain) this._masterGain.gain.setTargetAtTime(this._masterVolume, this._ctx.currentTime, 0.01);
    if (this._sfxGain) this._sfxGain.gain.setTargetAtTime(this._sfxVolume, this._ctx.currentTime, 0.01);
    if (this._ambientGain) this._ambientGain.gain.setTargetAtTime(this._ambientVolume, this._ctx.currentTime, 0.01);
  }

  /** Set master volume (0–1) */
  setMasterVolume(v) {
    this._masterVolume = Math.max(0, Math.min(1, v));
    if (this._masterGain && this._ctx) {
      this._masterGain.gain.setTargetAtTime(this._masterVolume, this._ctx.currentTime, 0.01);
    }
  }

  /** Set SFX volume (0–1) */
  setSFXVolume(v) {
    this._sfxVolume = Math.max(0, Math.min(1, v));
    if (this._sfxGain && this._ctx) {
      this._sfxGain.gain.setTargetAtTime(this._sfxVolume, this._ctx.currentTime, 0.01);
    }
  }

  /** Set ambient/music volume (0–1) */
  setAmbientVolume(v) {
    this._ambientVolume = Math.max(0, Math.min(1, v));
    if (this._ambientGain && this._ctx) {
      this._ambientGain.gain.setTargetAtTime(this._ambientVolume, this._ctx.currentTime, 0.01);
    }
  }

  /** Suspend the audio context (e.g., when tab is hidden) */
  suspend() {
    this._ctx?.suspend().catch(() => {});
  }

  /** Resume the audio context */
  resume() {
    this._ctx?.resume().catch(() => {});
  }

  /** Stop all currently playing looping sounds */
  stopAll() {
    this._loopingSources.forEach(({ source, gainNode }) => {
      try { source.stop(); } catch (_) {}
      try { gainNode.disconnect(); } catch (_) {}
    });
    this._loopingSources.clear();
  }

  /** Legacy compatibility: playSFX method */
  playSFX(name = 'button_click') {
    this.playSound(name, { volume: 0.5 });
  }

  /**
   * Play a 3D spatial positional sound at a world position using THREE.PositionalAudio.
   * @param {string} name 
   * @param {THREE.Vector3|Array<number>} position 
   * @param {Object} opts 
   */
  playPositionalSound(name, position, opts = {}) {
    if (!this._ctx || !this.listener) return null;
    const buffer = this.buffers.get(name);
    if (!buffer) return null;

    try {
      const sound = new THREE.PositionalAudio(this.listener);
      sound.setBuffer(buffer);
      sound.setRefDistance(opts.refDistance || 2.0);
      sound.setMaxDistance(opts.maxDistance || 16.0);
      sound.setVolume((opts.volume !== undefined ? opts.volume : 0.7) * this._sfxVolume * this._masterVolume);
      if (position) {
        if (Array.isArray(position)) sound.position.set(...position);
        else if (position.isVector3) sound.position.copy(position);
      }
      sound.play();
      return sound;
    } catch (e) {
      console.warn(`[AudioManager] Failed to play positional sound "${name}":`, e);
      return null;
    }
  }
}

// commit-ref: 9
// commit-ref: 10
// commit-ref: 29
// commit-ref: 30
// commit-ref: 49
// commit-ref: 50
// commit-ref: 9