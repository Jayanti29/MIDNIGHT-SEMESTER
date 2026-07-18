/**
 * Renderer.js — Canvas 2D rendering helper.
 */
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.width = canvas.width; this.height = canvas.height;
  }
  clear(c = '#0a0a0f') { this.ctx.fillStyle = c; this.ctx.fillRect(0, 0, this.width, this.height); }
  drawSprite(img, sx, sy, sw, sh, dx, dy, dw, dh) { this.ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); }
  drawRect(x, y, w, h, c) { this.ctx.fillStyle = c; this.ctx.fillRect(x, y, w, h); }
  drawText(t, x, y, { font = '16px monospace', color = '#fff', align = 'left' } = {}) {
    this.ctx.font = font; this.ctx.fillStyle = color; this.ctx.textAlign = align; this.ctx.fillText(t, x, y);
  }
  resize(w, h) { this.width = this.canvas.width = w; this.height = this.canvas.height = h; }
}
