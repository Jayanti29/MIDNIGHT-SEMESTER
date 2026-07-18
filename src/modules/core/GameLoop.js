/**
 * GameLoop.js — Fixed-timestep game loop using requestAnimationFrame.
 */
export class GameLoop {
  constructor({ update = () => {}, render = () => {}, targetFPS = 60 } = {}) {
    this.update = update; this.render = render;
    this.timestep = 1000 / targetFPS;
    this._raf = null; this._last = 0; this._acc = 0; this.running = false;
  }
  start() {
    if (this.running) return;
    this.running = true; this._last = performance.now();
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }
  stop() { this.running = false; cancelAnimationFrame(this._raf); }
  _loop(now) {
    if (!this.running) return;
    this._acc += Math.min(now - this._last, 200); this._last = now;
    while (this._acc >= this.timestep) { this.update(this.timestep / 1000); this._acc -= this.timestep; }
    this.render(this._acc / this.timestep);
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }
}
