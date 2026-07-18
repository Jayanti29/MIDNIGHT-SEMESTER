/** storage.js — type-safe localStorage helpers */
export const storage = {
  get(k, fb = null)  { try { const r = localStorage.getItem(k); return r !== null ? JSON.parse(r) : fb; } catch { return fb; } },
  set(k, v)          { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  remove(k)          { localStorage.removeItem(k); },
  clear()            { localStorage.clear(); },
  has(k)             { return localStorage.getItem(k) !== null; },
};
