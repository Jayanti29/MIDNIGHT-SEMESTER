/**
 * HUD.js — Heads-up display DOM elements.
 */
export class HUD {
  constructor(root = document.body) { this.root = root; this._el = null; }
  mount() {
    this._el = document.createElement('div'); this._el.id = 'hud';
    this._el.innerHTML = `
      <div class="hud-bar hud-energy"><span class="hud-label">Energy</span><div class="hud-fill" id="hud-energy"></div></div>
      <div class="hud-bar hud-stress"><span class="hud-label">Stress</span><div class="hud-fill" id="hud-stress"></div></div>
      <div class="hud-stat" id="hud-gpa">GPA: 3.00</div>
      <div class="hud-stat" id="hud-date">Day 1 — 08:00</div>`;
    this.root.appendChild(this._el);
  }
  update({ energy, stress, gpa, day, hour, minute }) {
    document.getElementById('hud-energy').style.width = `${energy}%`;
    document.getElementById('hud-stress').style.width = `${stress}%`;
    document.getElementById('hud-gpa').textContent = `GPA: ${gpa.toFixed(2)}`;
    document.getElementById('hud-date').textContent =
      `Day ${day} — ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
  }
  unmount() { this._el?.remove(); this._el = null; }
}

// commit-ref: 7
// commit-ref: 27
// commit-ref: 47
// commit-ref: 7
// commit-ref: 27