/**
 * Journal.js — Narrative log UI.
 */
export class Journal {
  constructor() { this._entries = []; this._el = null; }
  addEntry(e) { this._entries.push(e); this._render(); }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'journal'; this._el.className = 'journal glass';
    this._el.innerHTML = '<h2>Journal</h2><div class="journal-entries"></div>';
    root.appendChild(this._el); this._render();
  }
  _render() {
    if (!this._el) return;
    this._el.querySelector('.journal-entries').innerHTML = this._entries.map(e =>
      `<div class="journal-entry"><strong>${e.title}</strong> <span>Day ${e.day}</span><p>${e.body}</p></div>`
    ).join('');
  }
  show() { this._el?.classList.add('visible'); }
  hide() { this._el?.classList.remove('visible'); }
  unmount() { this._el?.remove(); this._el = null; }
}
