/**
 * LevelManager.js — Loads and manages the campus level from JSON.
 */
import { Room } from './Room.js';
export class LevelManager {
  constructor() { this.rooms = new Map(); this.currentRoomId = null; }
  async load(url) {
    const data = await fetch(url).then(r => r.json());
    for (const rd of data.rooms ?? []) this.rooms.set(rd.id, new Room(rd));
    this.currentRoomId = data.startRoom ?? this.rooms.keys().next().value;
  }
  get currentRoom() { return this.rooms.get(this.currentRoomId) ?? null; }
  transition(id) {
    if (!this.rooms.has(id)) throw new Error(`Unknown room: ${id}`);
    this.currentRoomId = id;
  }
}
