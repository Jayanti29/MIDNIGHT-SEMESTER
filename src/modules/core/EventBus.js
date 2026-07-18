/**
 * EventBus.js — Lightweight pub/sub event bus.
 */
export class EventBus {
  constructor() { this._l = new Map(); }
  on(e, fn) {
    if (!this._l.has(e)) this._l.set(e, new Set());
    this._l.get(e).add(fn);
    return () => this.off(e, fn);
  }
  off(e, fn) { this._l.get(e)?.delete(fn); }
  emit(e, d)  { this._l.get(e)?.forEach(fn => fn(d)); }
  once(e, fn) { const u = this.on(e, d => { fn(d); u(); }); }
}
