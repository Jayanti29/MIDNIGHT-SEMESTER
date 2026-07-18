/**
 * CharacterAnimator.js
 * Sprite-sheet frame selection based on movement state.
 */
export class CharacterAnimator {
  constructor(spriteSheetUrl, fw = 32, fh = 32) {
    this.url = spriteSheetUrl;
    this.fw = fw; this.fh = fh;
    this.frame = 0; this.direction = 'down';
    this.timer = 0; this.interval = 8;
  }
  tick(moving) {
    if (!moving) { this.frame = 0; return; }
    if (++this.timer >= this.interval) { this.timer = 0; this.frame = (this.frame + 1) % 4; }
  }
  getSourceRect() {
    const row = { down: 0, left: 1, right: 2, up: 3 }[this.direction] ?? 0;
    return { sx: this.frame * this.fw, sy: row * this.fh, sw: this.fw, sh: this.fh };
  }
}
