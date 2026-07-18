/**
 * FlowController.js — Manages high-level game state transitions.
 */
export class FlowController {
  constructor(bus) { this.bus = bus; this.state = 'mainMenu'; }
  transition(to) { const prev = this.state; this.state = to; this.bus.emit('flowTransition', { from: prev, to }); }
  startGame()        { this.transition('gameplay'); }
  pauseGame()        { this.transition('paused'); }
  resumeGame()       { this.transition('gameplay'); }
  triggerEnding(id)  { this.transition(`ending:${id}`); }
  returnToMenu()     { this.transition('mainMenu'); }
}
