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

// commit-ref: 201
// commit-ref: 205
// commit-ref: 211
// commit-ref: 215
// commit-ref: 221
// commit-ref: 225
// commit-ref: 231
// commit-ref: 235
// commit-ref: 241
// commit-ref: 245
// commit-ref: 251
// commit-ref: 255
// commit-ref: 261