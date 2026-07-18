/**
 * Inventory.js — Item bag with add/remove/has.
 */
export class Inventory {
  constructor(cap = 20) { this.cap = cap; this.items = new Map(); }
  add(item, qty = 1) {
    if (this.items.size >= this.cap && !this.items.has(item.id)) return false;
    const e = this.items.get(item.id);
    if (e) e.qty += qty; else this.items.set(item.id, { ...item, qty });
    return true;
  }
  remove(id, qty = 1) {
    const e = this.items.get(id);
    if (!e || e.qty < qty) return false;
    e.qty -= qty;
    if (e.qty <= 0) this.items.delete(id);
    return true;
  }
  has(id, qty = 1) { return (this.items.get(id)?.qty ?? 0) >= qty; }
  toArray() { return [...this.items.values()]; }
  serialize() { return this.toArray(); }
  deserialize(a) { this.items.clear(); for (const i of a) this.items.set(i.id, i); }
}
