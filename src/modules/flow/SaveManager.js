/**
 * SaveManager.js — Serialises game state to/from localStorage.
 */
const KEY = 'midnight_semester_save';
export class SaveManager {
  save(state)  { try { localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() })); return true; } catch { return false; } }
  load()       { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
  deleteSave() { localStorage.removeItem(KEY); }
  hasSave()    { return localStorage.getItem(KEY) !== null; }
}
