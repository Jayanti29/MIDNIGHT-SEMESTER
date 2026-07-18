/**
 * LoadingScreen.js — Full-screen loading overlay with progress bar.
 */
export class LoadingScreen {
  constructor() { this._el = null; }
  mount(root = document.body) {
    this._el = document.createElement('div'); this._el.id = 'loading-screen';
    this._el.innerHTML = `
      <div class="loading-content">
        <div class="loading-logo">Midnight Semester</div>
        <div class="loading-bar-track"><div class="loading-bar-fill" id="loading-fill"></div></div>
        <div class="loading-label" id="loading-label">Loading…</div>
      </div>`;
    root.appendChild(this._el);
  }
  setProgress(pct, label = '') {
    const f = document.getElementById('loading-fill'), l = document.getElementById('loading-label');
    if (f) f.style.width = `${Math.round(pct)}%`; if (l && label) l.textContent = label;
  }
  hide(delay = 400) {
    return new Promise(r => { this._el?.classList.add('fade-out'); setTimeout(() => { this._el?.remove(); r(); }, delay); });
  }
}
