/**
 * InteractionSystem.js — Detects and triggers player↔world interactions.
 */
export class InteractionSystem {
  constructor(bus) { this.bus = bus; this.interactables = []; }
  register(o)    { this.interactables.push(o); }
  unregister(id) { this.interactables = this.interactables.filter(i => i.id !== id); }
  getNearby(player) {
    let best = null, min = Infinity;
    for (const o of this.interactables) {
      const d = Math.hypot(player.x - o.x, player.y - o.y);
      if (o.enabled && d <= o.radius && d < min) { best = o; min = d; }
    }
    return best;
  }
  tryInteract(player) {
    const t = this.getNearby(player);
    if (t) { t.onInteract(player); this.bus.emit('interaction', { id: t.id }); }
  }
}
