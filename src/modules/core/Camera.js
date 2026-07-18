/**
 * Camera.js — 2D camera with smooth follow and viewport culling.
 */
export class Camera {
  constructor(vw, vh) { this.x = 0; this.y = 0; this.vw = vw; this.vh = vh; this.lerp = 0.1; }
  follow(t) {
    this.x += (t.x - this.vw / 2 - this.x) * this.lerp;
    this.y += (t.y - this.vh / 2 - this.y) * this.lerp;
  }
  clamp(ww, wh) {
    this.x = Math.max(0, Math.min(ww - this.vw, this.x));
    this.y = Math.max(0, Math.min(wh - this.vh, this.y));
  }
  toScreen(wx, wy) { return { x: wx - this.x, y: wy - this.y }; }
  isVisible(x, y, w, h) {
    return x + w > this.x && x < this.x + this.vw && y + h > this.y && y < this.y + this.vh;
  }
}
