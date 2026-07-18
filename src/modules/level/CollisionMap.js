/**
 * CollisionMap.js — Grid-based tile collision detection.
 */
export class CollisionMap {
  constructor(grid, tileSize = 32) {
    this.grid = grid; this.ts = tileSize;
    this.cols = grid[0]?.length ?? 0; this.rows = grid.length;
  }
  isSolid(wx, wy) {
    const c = Math.floor(wx / this.ts), r = Math.floor(wy / this.ts);
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return true;
    return this.grid[r][c] === 1;
  }
  rectOverlaps(x, y, w, h) {
    const x1 = Math.floor(x / this.ts), y1 = Math.floor(y / this.ts);
    const x2 = Math.floor((x + w - 1) / this.ts), y2 = Math.floor((y + h - 1) / this.ts);
    for (let r = y1; r <= y2; r++) for (let c = x1; c <= x2; c++) if (this.grid[r]?.[c] === 1) return true;
    return false;
  }
}
