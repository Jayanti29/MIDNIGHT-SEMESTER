/**
 * Room.js — Represents a single room in the campus layout.
 */
export class Room {
  constructor({ id, name, bounds, exits = [], lighting = 'ambient' }) {
    this.id = id; this.name = name; this.bounds = bounds;
    this.exits = exits; this.lighting = lighting; this.interactables = [];
  }
  contains(x, y) {
    return x >= this.bounds.x && x <= this.bounds.x + this.bounds.w
        && y >= this.bounds.y && y <= this.bounds.y + this.bounds.h;
  }
  addInteractable(o) { this.interactables.push(o); }
}
