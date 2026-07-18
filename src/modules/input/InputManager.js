/**
 * InputManager.js — Centralised keyboard input state tracker.
 */
export class InputManager {
  constructor() { this._held = new Set(); this._jp = new Set(); this._jr = new Set(); }
  attach() {
    window.addEventListener('keydown', this._kd = e => {
      if (!this._held.has(e.code)) this._jp.add(e.code);
      this._held.add(e.code);
    });
    window.addEventListener('keyup', this._ku = e => {
      this._held.delete(e.code); this._jr.add(e.code);
    });
  }
  detach() {
    window.removeEventListener('keydown', this._kd);
    window.removeEventListener('keyup', this._ku);
  }
  flush() { this._jp.clear(); this._jr.clear(); }
  isHeld(k) { return this._held.has(k); }
  isJustPressed(k) { return this._jp.has(k); }
  isJustReleased(k) { return this._jr.has(k); }
}
