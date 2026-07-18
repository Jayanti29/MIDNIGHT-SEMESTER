/**
 * Player.js — Combines CharacterController, CharacterAnimator, and PlayerStats.
 */
import { CharacterController } from '../character/CharacterController.js';
import { CharacterAnimator }   from '../character/CharacterAnimator.js';
import { PlayerStats }         from './PlayerStats.js';

export class Player {
  constructor(x = 0, y = 0) {
    this.controller = new CharacterController(x, y);
    this.animator   = new CharacterAnimator('/assets/player-sheet.png');
    this.stats      = new PlayerStats();
  }
  get x() { return this.controller.x; }
  get y() { return this.controller.y; }
  update(input) {
    const dx = (input.isHeld('ArrowRight') || input.isHeld('KeyD') ? 1 : 0)
             - (input.isHeld('ArrowLeft')  || input.isHeld('KeyA') ? 1 : 0);
    const dy = (input.isHeld('ArrowDown')  || input.isHeld('KeyS') ? 1 : 0)
             - (input.isHeld('ArrowUp')    || input.isHeld('KeyW') ? 1 : 0);
    const moving = dx !== 0 || dy !== 0;
    if (moving) {
      this.controller.move(dx, dy);
      this.animator.direction = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
    }
    this.animator.tick(moving);
  }
}
