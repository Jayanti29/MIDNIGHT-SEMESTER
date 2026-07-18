/**
 * NPC.js — Base class for all non-player characters.
 */
export class NPC {
  constructor({ id, name, x = 0, y = 0, dialogueTree = null }) {
    this.id = id; this.name = name; this.x = x; this.y = y;
    this.dialogueTree = dialogueTree; this.state = 'idle';
  }
  distanceTo(e) { return Math.hypot(e.x - this.x, e.y - this.y); }
  update(player) {
    if (this.state !== 'talking') this.state = this.distanceTo(player) < 80 ? 'alert' : 'idle';
  }
  startDialogue() { this.state = 'talking'; }
  endDialogue()   { this.state = 'idle'; }
}
