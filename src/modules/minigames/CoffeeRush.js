/**
 * CoffeeRush.js — Mini-game: tap to keep energy up.
 */
export class CoffeeRush {
  constructor({ targetTaps = 20, windowMs = 10000, onComplete = () => {} } = {}) {
    this.targetTaps = targetTaps; this.windowMs = windowMs; this.onComplete = onComplete;
    this.taps = 0; this.elapsed = 0; this.active = false;
  }
  init()   { this.taps = 0; this.elapsed = 0; this.active = true; }
  update(dt) { if (!this.active) return; this.elapsed += dt * 1000; if (this.elapsed >= this.windowMs) this._end(); }
  tap()    { if (!this.active) return; this.taps++; if (this.taps >= this.targetTaps) this._end(); }
  _end()   { this.active = false; this.onComplete({ success: this.taps >= this.targetTaps, taps: this.taps }); }
  destroy() { this.active = false; }
}
