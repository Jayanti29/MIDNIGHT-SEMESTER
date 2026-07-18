/**
 * MinigameManager.js — Orchestrates mini-game lifecycle.
 */
export class MinigameManager {
  constructor(bus) { this.bus = bus; this.active = null; }
  launch(game) { this.active?.destroy(); this.active = game; game.init(); this.bus.emit('minigameStart', { game }); }
  update(dt)   { this.active?.update(dt); }
  end(result)  { const g = this.active; this.active = null; this.bus.emit('minigameEnd', { game: g, result }); }
}
