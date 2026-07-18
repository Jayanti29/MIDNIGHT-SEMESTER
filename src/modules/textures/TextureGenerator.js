/**
 * TextureGenerator.js — Procedural canvas textures.
 */
export class TextureGenerator {
  static noise(size = 64, base = '#1a1a2e') {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d'); ctx.fillStyle = base; ctx.fillRect(0, 0, size, size);
    const id = ctx.getImageData(0, 0, size, size), d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() * 20 - 10) | 0;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
    }
    ctx.putImageData(id, 0, 0); return c;
  }
  static checkerboard(size = 64, cA = '#111122', cB = '#1a1a3a') {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d'), h = size / 2;
    ctx.fillStyle = cA; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = cB; ctx.fillRect(0, 0, h, h); ctx.fillRect(h, h, h, h);
    return c;
  }
}
