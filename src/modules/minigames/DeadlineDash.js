/**
 * DeadlineDash.js — Mini-game: type a passage before time runs out.
 */
export class DeadlineDash {
  constructor({ passage = '', timeLimit = 90, onComplete = () => {} } = {}) {
    this.passage = passage; this.timeLimit = timeLimit; this.onComplete = onComplete;
    this.typed = ''; this.elapsed = 0; this.active = false;
  }
  init()       { this.typed = ''; this.elapsed = 0; this.active = true; }
  update(dt)   { if (!this.active) return; this.elapsed += dt; if (this.elapsed >= this.timeLimit) this._end(false); }
  typeChar(ch) { if (!this.active) return; this.typed += ch; if (this.typed === this.passage) this._end(true); }
  get accuracy() {
    let ok = 0;
    for (let i = 0; i < this.typed.length; i++) if (this.typed[i] === this.passage[i]) ok++;
    return this.typed.length ? ok / this.typed.length : 0;
  }
  _end(ok)  { this.active = false; this.onComplete({ success: ok, accuracy: this.accuracy, elapsed: this.elapsed }); }
  destroy() { this.active = false; }
}
