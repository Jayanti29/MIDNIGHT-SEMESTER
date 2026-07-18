/**
 * AchievementManager.js — Tracks and unlocks achievements.
 */
export class AchievementManager {
  constructor(bus) { this.bus = bus; this.achievements = new Map(); }
  register(a) { this.achievements.set(a.id, { ...a, unlocked: false }); }
  unlock(id) {
    const a = this.achievements.get(id);
    if (!a || a.unlocked) return;
    a.unlocked = true; this.bus.emit('achievementUnlocked', a);
  }
  isUnlocked(id) { return this.achievements.get(id)?.unlocked ?? false; }
  serialize()    { return [...this.achievements.entries()].filter(([, a]) => a.unlocked).map(([id]) => id); }
  deserialize(ids) { for (const id of ids) { const a = this.achievements.get(id); if (a) a.unlocked = true; } }
}
