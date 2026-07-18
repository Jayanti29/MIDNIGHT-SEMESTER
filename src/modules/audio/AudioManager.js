/**
 * AudioManager.js — Central coordinator for all game audio.
 */
import { generateNoiseBurst, generateBlip } from './sfx.js';
import { generateWhisper } from './dialogue.js';
export class AudioManager {
  constructor() { this._ctx = null; this._master = null; this._sfx = null; this._music = null; }
  init() {
    if (this._ctx) return;
    this._ctx = new AudioContext();
    this._master = this._ctx.createGain();
    this._sfx    = this._ctx.createGain();
    this._music  = this._ctx.createGain();
    this._sfx.connect(this._master); this._music.connect(this._master); this._master.connect(this._ctx.destination);
  }
  setMasterVolume(v) { this._master?.gain.setTargetAtTime(v, this._ctx.currentTime, 0.01); }
  setSFXVolume(v)    { this._sfx?.gain.setTargetAtTime(v, this._ctx.currentTime, 0.01); }
  setMusicVolume(v)  { this._music?.gain.setTargetAtTime(v, this._ctx.currentTime, 0.01); }
  _play(buf, gain) { if (!this._ctx) return; const s = this._ctx.createBufferSource(); s.buffer = buf; s.connect(gain); s.start(); }
  playSFX(type = 'click') { this.init(); this._play(type === 'blip' ? generateBlip(this._ctx) : generateNoiseBurst(this._ctx), this._sfx); }
  playWhisper() { this.init(); this._play(generateWhisper(this._ctx), this._sfx); }
  suspend() { this._ctx?.suspend(); }
  resume()  { this._ctx?.resume(); }
}
