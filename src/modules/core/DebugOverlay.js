/**
 * DebugOverlay.js — On-screen FPS counter and debug data overlay.
 */
export class DebugOverlay {
  constructor() { this._el = null; this._fps = 0; this._fc = 0; this._lt = performance.now(); }
  mount(root = document.body) {
    this._el = document.createElement('div');
    Object.assign(this._el.style, {
      position: 'fixed', top: '0', right: '0', padding: '8px',
      background: 'rgba(0,0,0,.7)', color: '#0f0', font: '12px monospace',
      zIndex: '9999', pointerEvents: 'none', whiteSpace: 'pre',
    });
    root.appendChild(this._el);
  }
  update(data = {}) {
    this._fc++;
    const now = performance.now();
    if (now - this._lt >= 500) {
      this._fps = Math.round(this._fc / ((now - this._lt) / 1000));
      this._fc = 0; this._lt = now;
    }
    if (this._el) this._el.textContent = `FPS: ${this._fps}\n` +
      Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
  }
  unmount() { this._el?.remove(); this._el = null; }
}
