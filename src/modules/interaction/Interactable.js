/**
 * Interactable.js — Base class for interactable world objects.
 */
export class Interactable {
  constructor({ id, x, y, radius = 40, label = '', onInteract = () => {} }) {
    this.id = id; this.x = x; this.y = y;
    this.radius = radius; this.label = label; this.onInteract = onInteract; this.enabled = true;
  }
  disable() { this.enabled = false; }
  enable()  { this.enabled = true; }
  getPrompt() { return this.enabled ? `[E] ${this.label}` : ''; }
}
