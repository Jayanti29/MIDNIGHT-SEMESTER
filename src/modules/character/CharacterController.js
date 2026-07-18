/**
 * CharacterController.js
 * Manages character position and velocity.
 */
export class CharacterController {
  constructor(x = 0, y = 0) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.speed = 3;
  }
  move(dx, dy) {
    this.vx = dx * this.speed; this.vy = dy * this.speed;
    this.x += this.vx; this.y += this.vy;
  }
  dampen() { this.vx = 0; this.vy = 0; }
}
